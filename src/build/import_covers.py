#!/usr/bin/env python3
"""Genspark에서 받은 표지 PNG를 반영한다.
covers_in/cover_<키>.png → (16:9 가운데 맞춤) → 원래 픽셀 격자 480×270로 NEAREST 축소 → 4배 NEAREST 확대
→ covers/cover_<키>.webp (1920×1080 무손실) + assets/og/cover_<키>.jpg (1200×630 공유 미리보기).
그다음 build.py를 다시 실행하면 장 표지·목차 썸네일이 바뀐다."""
import os, glob
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
IN, OUT, OG = os.path.join(B, 'covers_in'), os.path.join(B, 'covers'), os.path.join(ROOT, 'assets', 'og')
GX, GY, S = 480, 270, 4
os.makedirs(IN, exist_ok=True); os.makedirs(OUT, exist_ok=True); os.makedirs(OG, exist_ok=True)
done = 0
for f in sorted(glob.glob(os.path.join(IN, 'cover_*.png')) + glob.glob(os.path.join(IN, 'cover_*.jpg')) + glob.glob(os.path.join(IN, 'cover_*.webp'))):
    k = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert('RGB'); w, h = im.size
    if w / h > 16 / 9:  # 가로가 길면 양옆을 자름
        nw = round(h * 16 / 9); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    elif w / h < 16 / 9:
        nh = round(w * 9 / 16); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    grid = im.resize((GX, GY), Image.NEAREST)
    big = grid.resize((GX * S, GY * S), Image.NEAREST)
    big.save(os.path.join(OUT, k + '.webp'), 'WEBP', lossless=True, method=6)
    og = big.resize((1200, 675), Image.NEAREST).crop((0, 22, 1200, 652))
    og.save(os.path.join(OG, k + '.jpg'), 'JPEG', quality=88)
    print('반영', k, f'{w}x{h} → 1920x1080'); done += 1
print(f'{done}장 반영. 이어서: python3 src/build/build.py . && python3 src/build/practice.py .')
