#!/usr/bin/env python3
"""Genspark에서 받은 「그림으로 먼저 보기」 PNG를 반영한다.
src/build/ill_in/ill_<장><a|b>.png  (예: ill_03a.png)
→ 16:9 가운데 맞춤 → 원래 픽셀 격자 480×270로 NEAREST 축소 → 2배 NEAREST 확대
→ ill/ill_<키>.webp (960×540 무손실, 화면에서는 image-rendering:pixelated 로 키운다)
그다음 build.py를 다시 실행하면 장 쪽의 「그림 준비 중」 자리가 그림으로 바뀐다."""
import os, glob, re
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
IN, OUT = os.path.join(B, 'ill_in'), os.path.join(ROOT, 'ill')
GX, GY, S = 480, 270, 2
os.makedirs(IN, exist_ok=True); os.makedirs(OUT, exist_ok=True)
done = 0
for f in sorted(glob.glob(os.path.join(IN, 'ill_*.*'))):
    k = os.path.splitext(os.path.basename(f))[0]
    if not re.fullmatch(r'ill_(0[1-9]|1[01])[ab]', k):
        print('건너뜀(이름 확인):', os.path.basename(f)); continue
    im = Image.open(f).convert('RGB'); w, h = im.size
    if w / h > 16 / 9:
        nw = round(h * 16 / 9); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    elif w / h < 16 / 9:
        nh = round(w * 9 / 16); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    grid = im.resize((GX, GY), Image.NEAREST)
    grid.resize((GX * S, GY * S), Image.NEAREST).save(os.path.join(OUT, k + '.webp'), 'WEBP', lossless=True, method=6)
    print('반영', k, f'{w}x{h} → {GX * S}x{GY * S}'); done += 1
print(f'{done}장 반영. 이어서: python3 src/build/build.py .')
