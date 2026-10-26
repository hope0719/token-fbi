"""Refresh the radar data snapshot from its existing source repository."""
import json
from pathlib import Path
from urllib.request import Request, urlopen

URL = 'https://raw.githubusercontent.com/hope0719/ai-pick/main/data.json'
TARGET = Path(__file__).resolve().parents[1] / 'ai-pick' / 'data.json'


def main():
    request = Request(URL, headers={'User-Agent': 'Token-FBI-data-sync'})
    with urlopen(request, timeout=30) as response:
        raw = response.read(10_000_001)
    if len(raw) > 10_000_000:
        raise ValueError('Radar data exceeds the 10 MB safety limit')
    data = json.loads(raw)
    activities = data.get('activities')
    if not isinstance(activities, list) or not activities:
        raise ValueError('Missing or empty radar activities; keeping existing snapshot')
    if any(not isinstance(item, dict) or not item.get('id') or not item.get('title') for item in activities):
        raise ValueError('Invalid activity records; keeping existing snapshot')
    previous = json.loads(TARGET.read_text())
    if len(activities) < len(previous['activities']) * 0.5:
        raise ValueError('Radar count fell by over 50%; manual review required')
    if data == previous:
        print('Radar data unchanged')
        return
    temp = TARGET.with_suffix('.tmp')
    temp.write_bytes(raw)
    temp.replace(TARGET)
    print(f"Updated radar snapshot: {len(activities)} activities")


if __name__ == '__main__':
    main()
