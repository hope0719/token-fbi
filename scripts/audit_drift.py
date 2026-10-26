#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""在架条目「漂移巡检」队列。

解决的问题：自动更新只负责「找新平台」，在架卡片的额度/截止日发生变化时没人复检，
信息会静默过期（例：Qoder 的 DeepSeek 免费期 10-24 延长到 10-31，卡片上一直写着 10-24）。

本脚本不联网，只做排程：把「最可能已经变了」的条目按优先级挖出来，交给人工/Agent 逐条核。

用法：
  python3 scripts/audit_drift.py                  # 前 10 条待核
  python3 scripts/audit_drift.py -n 8             # 只看前 8 条
  python3 scripts/audit_drift.py --mark SLUG ...  # 记录今天已核过（写状态文件，不改 data.json）
  python3 scripts/audit_drift.py --stats          # 只看体检统计
  python3 scripts/audit_drift.py --json           # 机器可读输出
"""
import argparse
import datetime
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data.json")
STATE = os.path.join(ROOT, ".workbuddy", "state", "verify_log.json")

TODAY = datetime.date.today()
SOON_DAYS = 7      # 有效期剩余 <= 7 天 → P0
STALE_DAYS = 14    # 距上次核验 >= 14 天 → 进队列


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def parse_dates(text, year=TODAY.year):
    """从文案里抠出日期：10 月 24 日 / 10/24 / 2026-10-24。"""
    out = []
    text = text or ""
    for m in re.finditer(r"(\d{1,2})\s*月\s*(\d{1,2})\s*日", text):
        try:
            out.append(datetime.date(year, int(m.group(1)), int(m.group(2))))
        except ValueError:
            pass
    for m in re.finditer(r"(?<!\d)(\d{1,2})\s*[/\-]\s*(\d{1,2})(?!\d)", text):
        try:
            out.append(datetime.date(year, int(m.group(1)), int(m.group(2))))
        except ValueError:
            pass
    for m in re.finditer(r"(20\d{2})-(\d{2})-(\d{2})", text):
        try:
            out.append(datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3))))
        except ValueError:
            pass
    return out


def days_since(datestr):
    try:
        return (TODAY - datetime.date.fromisoformat(datestr)).days
    except (TypeError, ValueError):
        return None


def audit(items, state):
    rows = []
    for it in items:
        slug = it.get("detail_slug") or ""
        text = " ".join([it.get("quota") or "", " ".join(it.get("activity_rules") or [])])
        validity = (it.get("validity") or "").strip()
        checked = state.get(slug) or it.get("last_verified") or ""
        age = days_since(checked)
        reasons, prio = [], 99

        # P0 已过期却没处理
        if validity:
            vd_age = days_since(validity)
            if vd_age is not None and vd_age > 0:
                prio, reasons = 0, [f"有效期已过 {-vd_age} 天（{validity}）未处理"]
            elif vd_age is not None and -vd_age <= SOON_DAYS:
                prio, reasons = 1, [f"有效期只剩 {-vd_age} 天（{validity}），临近到期需确认是否续期"]

        # P2 漂移嫌疑：正文出现过期日期
        if prio > 2:
            stale = [d for d in parse_dates(text) if d < TODAY]
            if stale:
                prio = 2
                reasons = [f"正文出现过期日期 {min(stale).isoformat()}，可能已延期/改档"]

        # P3 久未核验
        if prio > 3 and age is not None and age >= STALE_DAYS:
            prio = 3
            reasons = [f"已有 {age} 天未复核（上次 {checked}）"]

        # P4 兜底：从没进过队列的也需要轮到
        if prio > 4:
            if state.get(slug) == TODAY.isoformat():
                continue
            prio = 4
            reasons = [f"距上次核验 {age} 天（{checked or '无记录'}），按轮转纳入"] if age is not None else ["无核验记录"]

        # 今天已核过的跳过（P0/P1 除外，临期必须每天看）
        if state.get(slug) == TODAY.isoformat() and prio >= 2:
            continue

        rows.append({
            "prio": prio,
            "name": it.get("name", ""),
            "slug": slug,
            "free_type": it.get("free_type", ""),
            "validity": validity,
            "quota": it.get("quota", ""),
            "entry_url": it.get("entry_url", ""),
            "intel_url": it.get("intel_url", ""),
            "checked": checked,
            "age": age,
            "reasons": reasons,
        })

    rows.sort(key=lambda r: (r["prio"], -(r["age"] if r["age"] is not None else 999), r["slug"]))
    return rows


def stats(items, state):
    total = len(items)
    with_validity = [i for i in items if (i.get("validity") or "").strip()]
    expired = [i for i in with_validity if (days_since(i["validity"]) or -1) > 0]
    soon = [i for i in with_validity if 0 <= -(days_since(i["validity"]) or 999) <= SOON_DAYS]
    never = [i for i in items if not (state.get(i.get("detail_slug", "")) or i.get("last_verified"))]
    ages = [days_since(state.get(i.get("detail_slug", "")) or i.get("last_verified") or "")
            for i in items]
    ages = [a for a in ages if a is not None]
    drift = [i for i in items
             if any(d < TODAY for d in parse_dates(" ".join([i.get("quota") or "",
                                                             " ".join(i.get("activity_rules") or [])])))]
    return {
        "total": total,
        "with_validity": len(with_validity),
        "expired": len(expired),
        "expiring_7d": len(soon),
        "drift_suspect": len(drift),
        "never_checked": len(never),
        "avg_age": round(sum(ages) / len(ages), 1) if ages else None,
        "max_age": max(ages) if ages else None,
        "stale_14d": len([a for a in ages if a >= STALE_DAYS]),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", "--limit", type=int, default=10, help="输出前 N 条（默认 10）")
    ap.add_argument("--mark", nargs="*", default=None, help="记录今天已核过的 slug")
    ap.add_argument("--stats", action="store_true", help="只输出体检统计")
    ap.add_argument("--json", action="store_true", help="JSON 输出")
    args = ap.parse_args()

    data = load_json(DATA, {})
    items = data.get("items", [])
    state = load_json(STATE, {})

    if args.mark is not None:
        os.makedirs(os.path.dirname(STATE), exist_ok=True)
        for slug in args.mark:
            state[slug] = TODAY.isoformat()
        with open(STATE, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=2, sort_keys=True)
        print(f"已记录 {len(args.mark)} 条核验时间 → {os.path.relpath(STATE, ROOT)}")

    s = stats(items, state)
    if args.stats or args.json:
        if args.json:
            print(json.dumps({"stats": s, "queue": audit(items, state)[:args.limit]},
                             ensure_ascii=False, indent=2))
            return 0
        print("在架条目体检")
        for k, label in [("total", "在架条目"), ("with_validity", "带有效期"),
                         ("expired", "已过期未处理"), ("expiring_7d", "7 天内到期"),
                         ("drift_suspect", "正文含过期日期（漂移嫌疑）"),
                         ("stale_14d", "超 14 天未核"), ("never_checked", "无核验记录"),
                         ("avg_age", "平均未核天数"), ("max_age", "最久未核天数")]:
            print(f"  {label}: {s[k]}")
        return 0

    rows = audit(items, state)
    print("在架条目体检")
    for k, label in [("total", "在架条目"), ("expired", "已过期未处理"),
                     ("expiring_7d", "7 天内到期"), ("drift_suspect", "漂移嫌疑"),
                     ("stale_14d", "超 14 天未核"), ("avg_age", "平均未核天数")]:
        print(f"  {label}: {s[k]}")
    print(f"\n待核队列（前 {min(args.limit, len(rows))} / 共 {len(rows)} 条）")
    for r in rows[:args.limit]:
        p = {0: "P0", 1: "P1", 2: "P2", 3: "P3", 4: "P4"}.get(r["prio"], "P?")
        print(f"\n[{p}] {r['name']}  ({r['slug']})")
        print(f"  原因: {'；'.join(r['reasons'])}")
        print(f"  现文案: {r['quota']}")
        print(f"  有效期: {r['validity'] or '空'} | 类型: {r['free_type']} | 上次核验: {r['checked'] or '无'}")
        print(f"  官网: {r['entry_url']}")
        print(f"  情报: {r['intel_url']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
