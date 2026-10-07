# -*- coding: utf-8 -*-
"""校验首页「新增」五角星是否符合 data.json 的 added 口径。

用法（仓库根目录）：python3 scripts/check_star.py
任何一项不符即以非 0 退出，便于接到自动化或 CI 里。
"""
import json
import os
import re
import sys
from datetime import date, datetime, time, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NEW_DAYS = 3  # 与 build.py 的 NEW_DAYS 保持一致

data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
dist = ROOT / "dist"
index = dist / "index.html"
if not index.exists():
    sys.exit("dist/index.html 不存在，请先运行 python3 build.py")
html = index.read_text(encoding="utf-8")

today = date.today()
expect = 0
for it in data.get("items", []):
    if it.get("sponsored"):
        continue                      # 赞助条目走广告位排版，不渲染情报卡
    raw = str(it.get("added") or "").strip()[:10]
    if not raw:
        continue
    try:
        d0 = date.fromisoformat(raw)
    except ValueError:
        sys.exit(f"added 格式非法：{it.get('name')} → {raw!r}（应为 YYYY-MM-DD）")
    if 0 <= (today - d0).days < NEW_DAYS:
        expect += 1

found = re.findall(r'<span class="new-star" data-exp="(\d+)" title="新增" aria-label="新增">★</span>', html)
expiry_ok = all(int(ts) > datetime.now().timestamp() for ts in found)
# 到期时刻应等于「收录日 + NEW_DAYS 天」的 00:00
by_name = {}
for it in data.get("items", []):
    by_name[str(it.get("name"))] = it.get("added")

problems = []
if len(found) != expect:
    problems.append(f"星标数量不符：期望 {expect}，实际 {len(found)}")
if not expiry_ok:
    problems.append("存在已过期的星标仍留在 HTML 里（构建时应直接不渲染）")
if ".new-star{position:absolute" not in html:
    problems.append("缺少 .new-star 样式")
if html.count("tf-new-star-sweep") != 1:
    problems.append("到期自摘脚本份数异常（首页应恰好 1 份）")
for p in dist.rglob("*.html"):
    if p != index and 'class="new-star"' in p.read_text(encoding="utf-8"):
        problems.append(f"非首页出现星标：{p.relative_to(dist)}")

print(f"新增窗口：收录当天起 {NEW_DAYS} 天 | 应为 {expect} 个星标，实际 {len(found)} 个")
if problems:
    for x in problems:
        print("  FAIL", x)
    sys.exit(1)
print("五角星校验通过")
