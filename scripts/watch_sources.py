#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""官方源每日抓取 + diff。

读取 sources.json，抓每个源的正文，归一化后与该源上次快照比对，
只报「这次多了/少了什么」，把「官方改档但没人发现」的窗口压到一天内。

用法：
  python3 scripts/watch_sources.py --init          # 首次建基线（不报变化）
  python3 scripts/watch_sources.py                 # 日常跑：抓取 + diff
  python3 scripts/watch_sources.py --dry           # 只测可达性，不写快照
  python3 scripts/watch_sources.py --only qoder-blog,unisound-u2flash
  python3 scripts/watch_sources.py --json          # 机器可读，便于自动更新解析

退出码：0 正常（无论有无变化）；2 所有源都失败。
"""
import argparse
import datetime
import gzip
import hashlib
import html as htmllib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, "sources.json")
STATE_DIR = os.path.join(ROOT, ".workbuddy", "state", "sources")
INDEX = os.path.join(STATE_DIR, "_index.json")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/130.0 Safari/537.36")
TIMEOUT = 30
MAX_CHARS = 400_000


def fetch(url, retries=1):
    last = None
    for i in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            })
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                raw = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
                enc = "utf-8"
                ctype = r.headers.get("Content-Type", "")
                m = re.search(r"charset=([\w-]+)", ctype, re.I)
                if m:
                    enc = m.group(1)
                return raw.decode(enc, "ignore")
        except Exception as e:  # noqa: BLE001
            last = e
            if i < retries:
                time.sleep(2)
    raise last


def to_text(raw, kind):
    """html -> 可见正文；rss -> 每条「时间 + 标题 + 摘要」。"""
    if kind == "rss":
        items = re.findall(r"<item[\s\S]*?</item>", raw, re.I)
        if not items:
            items = re.findall(r"<entry[\s\S]*?</entry>", raw, re.I)
        lines = []
        for it in items:
            def pick(tag):
                m = re.search(rf"<{tag}[^>]*>([\s\S]*?)</{tag}>", it, re.I)
                if not m:
                    return ""
                v = htmllib.unescape(m.group(1))
                v = re.sub(r"<[^>]+>", " ", v)
                return re.sub(r"\s+", " ", v).strip()

            date = pick("pubDate") or pick("updated") or pick("dc:date")
            title = pick("title")
            desc = pick("description") or pick("content:encoded") or pick("summary")
            head = f"{date} {title}".strip()
            lines.append(head)
            if desc:
                # 摘要按句切行，diff 才能定位到「哪一条哪一句变了」
                for sent in re.split(r"(?<=[。！？!?])", desc):
                    sent = sent.strip()
                    if len(sent) >= 8:
                        lines.append(sent)
        return "\n".join(lines)[:MAX_CHARS]

    s = raw
    s = re.sub(r"<!--[\s\S]*?-->", " ", s)
    s = re.sub(r"<(script|style|noscript|svg|iframe)[\s\S]*?</\1>", " ", s, flags=re.I)
    s = re.sub(r"<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = htmllib.unescape(s)
    s = s.replace("\u200b", "").replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()[:MAX_CHARS]


def chunks(text, min_len=6):
    """切成「句/行」级片段，用于 diff。"""
    out = []
    for line in text.split("\n"):
        for part in re.split(r"(?<=[。！？!?；;])|\s{2,}", line):
            p = part.strip()
            if len(p) >= min_len:
                out.append(p)
    return out


def load_index():
    try:
        with open(INDEX, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_index(idx):
    os.makedirs(STATE_DIR, exist_ok=True)
    with open(INDEX, "w", encoding="utf-8") as f:
        json.dump(idx, f, ensure_ascii=False, indent=2, sort_keys=True)


def snap_path(sid):
    return os.path.join(STATE_DIR, f"{sid}.txt")


def read_snap(sid):
    try:
        with open(snap_path(sid), encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None


def diff_text(old, new, limit=12):
    import difflib
    a, b = chunks(old or ""), chunks(new)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    added, removed = [], []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("replace", "insert"):
            added.extend(b[j1:j2])
        if tag in ("replace", "delete"):
            removed.extend(a[i1:i2])
    return [x for x in added if len(x) >= 8][:limit], [x for x in removed if len(x) >= 8][:limit]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--init", action="store_true", help="建基线，不报变化")
    ap.add_argument("--dry", action="store_true", help="只测可达性，不写快照")
    ap.add_argument("--only", default="", help="只跑指定 id，逗号分隔")
    ap.add_argument("--json", action="store_true", help="JSON 输出")
    ap.add_argument("--limit", type=int, default=8, help="每个源最多列几条新增（默认 8）")
    args = ap.parse_args()

    with open(SOURCES, encoding="utf-8") as f:
        cfg = json.load(f)
    only = {x.strip() for x in args.only.split(",") if x.strip()}
    idx = load_index()
    today = datetime.date.today().isoformat()
    results = []
    errors = 0

    for src in cfg.get("sources", []):
        sid = src["id"]
        if not src.get("enabled", True) or (only and sid not in only):
            continue
        row = {"id": sid, "label": src.get("label", sid), "url": src["url"],
               "slugs": src.get("slugs", []), "status": "", "chars": 0,
               "added": [], "removed": [], "error": "", "last_change": None}
        try:
            raw = fetch(src["url"])
            text = to_text(raw, src.get("kind", "html"))
            row["chars"] = len(text)
            if len(text) < src.get("min_chars", 1000):
                row["status"] = "short"
                if not args.dry:
                    idx.setdefault(sid, {}).update({"last_short": today, "chars": len(text)})
                results.append(row)
                continue
            old = read_snap(sid)
            if old is None:
                row["status"] = "new"
            elif hashlib.sha256(old.encode()).hexdigest() == hashlib.sha256(text.encode()).hexdigest():
                row["status"] = "same"
            else:
                row["status"] = "changed"
                row["added"], row["removed"] = diff_text(old, text, args.limit)
            if not args.dry:
                os.makedirs(STATE_DIR, exist_ok=True)
                with open(snap_path(sid), "w", encoding="utf-8") as f:
                    f.write(text)
                meta = idx.setdefault(sid, {})
                meta["chars"] = len(text)
                meta["fetched_at"] = today
                if row["status"] in ("new", "changed"):
                    meta["last_change"] = today
                    meta["last_change_digest"] = hashlib.sha256(text.encode()).hexdigest()[:12]
            row["last_change"] = idx.get(sid, {}).get("last_change")
        except Exception as e:  # noqa: BLE001
            row["status"] = "error"
            row["error"] = f"{type(e).__name__}: {e}"
            errors += 1
        results.append(row)

    if not args.dry:
        idx["_last_run"] = {"at": today, "date": today}
        save_index(idx)

    if args.json:
        print(json.dumps({"date": today, "results": results}, ensure_ascii=False, indent=2))
    else:
        icon = {"new": "基线", "changed": "有变化", "same": "无变化",
                "short": "抓取退化", "error": "失败"}
        print(f"官方源巡检 {today}（{len(results)} 个源）")
        changed = [r for r in results if r["status"] == "changed"]
        for r in results:
            print(f"\n[{icon.get(r['status'], r['status'])}] {r['label']}")
            print(f"  {r['url']}  ({r['chars']} 字)")
            if r["slugs"]:
                print(f"  关联卡片: {', '.join(r['slugs'])}")
            if r["error"]:
                print(f"  错误: {r['error']}")
            if r["status"] == "short":
                print("  提示: 正文过短，多半是前端渲染页（SPA），改用搜索或人工核对")
            for a in r["added"]:
                print(f"  + {a[:180]}")
            for d in r["removed"]:
                print(f"  - {d[:180]}")
        print("\n小结：" + "、".join(f"{k} {sum(1 for r in results if r['status'] == k)}"
                                   for k in ("changed", "new", "same", "short", "error") if
                                   any(r["status"] == k for r in results)) or "无")
        if changed:
            print("CHANGED: " + ",".join(r["id"] for r in changed))
        else:
            print("CHANGED: none")

    return 0 if errors < max(1, len(results)) else 2


if __name__ == "__main__":
    sys.exit(main())
