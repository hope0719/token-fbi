"""为新条目分配永久详情 ID；保留现有 ID，不根据排序重新编号。"""
import hashlib
import json
import re
from pathlib import Path

source = Path(__file__).resolve().parents[1] / "data.json"
data = json.loads(source.read_text(encoding="utf-8"))
entries = data.get("items", []) + data.get("watchlist", []) + data.get("retired", [])
existing = [entry["detail_slug"] for entry in entries if entry.get("detail_slug")]
if any(not re.fullmatch(r"[0-9]{4}[a-z]{4}", value) for value in existing):
    raise ValueError("现有 ID 格式不正确，禁止自动覆盖")
if len(existing) != len(set(existing)):
    raise ValueError("现有 ID 重复")
serial = max((int(value[:4]) for value in existing), default=0)
assigned = 0
for entry in entries:
    if entry.get("detail_slug"):
        continue
    serial += 1
    if serial > 9999:
        raise ValueError("4 位序号已用完")
    suffix = "".join(chr(97 + value % 26) for value in
                     hashlib.sha256(entry["name"].encode()).digest()[:4])
    entry["detail_slug"] = f"{serial:04d}{suffix}"
    assigned += 1
if assigned:
    source.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"分配 {assigned} 个新 ID；现有 ID 保持不变")
