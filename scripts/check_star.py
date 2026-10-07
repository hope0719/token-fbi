# -*- coding: utf-8 -*-
"""校验首页「新增」五角星是否符合 data.json 的 added 口径。

用法（仓库根目录）：python3 scripts/check_star.py
任何一项不符即以非 0 退出，便于接到自动化或 CI 里。

时区约定：与 build.py 一致，一律按北京时间（UTC+8）判定，不依赖构建机时区。
"""
import json
import re
import sys
from datetime import datetime, time, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NEW_DAYS = 3  # 与 build.py 的 NEW_DAYS 保持一致
TZ = timezone(timedelta(hours=8))

data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
dist = ROOT / "dist"
index = dist / "index.html"
if not index.exists():
    sys.exit("dist/index.html 不存在，请先运行 python3 build.py")
html = index.read_text(encoding="utf-8")

today = datetime.now(TZ).date()

# ---- 期望值：逐条算出应有星标及其精确到期时刻 ----
expected = {}          # 条目名 -> 到期 Unix 秒
for it in data.get("items", []):
    if it.get("sponsored"):
        continue                      # 赞助条目走广告位排版，不渲染情报卡
    raw = str(it.get("added") or "").strip()[:10]
    if not raw:
        continue
    try:
        d0 = datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError:
        sys.exit(f"added 格式非法：{it.get('name')} → {raw!r}（应为 YYYY-MM-DD）")
    if 0 <= (today - d0).days < NEW_DAYS:
        end = datetime.combine(d0 + timedelta(days=NEW_DAYS), time.min, tzinfo=TZ)
        expected[str(it.get("name"))] = int(end.timestamp())

# ---- 实际值：从首页卡片里逐张读回来 ----
found = {}             # 条目名 -> 到期 Unix 秒
for block in re.findall(r'<article class="card[^>]*>.*?</article>', html, re.S):
    m_exp = re.search(r'<span class="new-star" data-exp="(\d+)"', block)
    if not m_exp:
        continue
    m_name = re.search(r'<h3 class="c-name"><a[^>]*>([^<]+)</a>', block)
    if not m_name:
        sys.exit(f"星标卡片解析不到条目名：{block[:120]!r}")
    found[m_name.group(1)] = int(m_exp.group(1))

problems = []
miss = sorted(set(expected) - set(found))
extra = sorted(set(found) - set(expected))
if miss:
    problems.append(f"应出星却未出：{miss}")
if extra:
    problems.append(f"不应出星却出了：{extra}")
for name, exp in sorted(expected.items()):
    if name in found and found[name] != exp:
        got = datetime.fromtimestamp(found[name], TZ)
        want = datetime.fromtimestamp(exp, TZ)
        problems.append(
            f"{name} 到期时刻不符：实际 {found[name]}（北京 {got:%Y-%m-%d %H:%M}）"
            f"，应为 {exp}（北京 {want:%Y-%m-%d %H:%M}）"
        )
now = datetime.now(TZ).timestamp()
for name, exp in sorted(found.items()):
    if exp <= now:
        problems.append(f"{name} 的星标已过期却仍留在 HTML 里：{exp}")
if ".new-star{position:absolute" not in html:
    problems.append("缺少 .new-star 样式")
if html.count("tf-new-star-sweep") != 1:
    problems.append("到期自摘脚本份数异常（首页应恰好 1 份）")
for p in dist.rglob("*.html"):
    if p != index and 'class="new-star"' in p.read_text(encoding="utf-8"):
        problems.append(f"非首页出现星标：{p.relative_to(dist)}")

print(f"新增窗口：收录当天起 {NEW_DAYS} 天（北京时间判定）| 应为 {len(expected)} 个星标，实际 {len(found)} 个")
if problems:
    for x in problems:
        print("  FAIL", x)
    sys.exit(1)
print("五角星校验通过")
