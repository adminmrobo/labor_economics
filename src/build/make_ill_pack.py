#!/usr/bin/env python3
"""Genspark 요청 꾸러미: 장마다 「그림으로 먼저 보기」 2장(모두 22장).
docs/genspark_ill/ (요청문·체크리스트) + docs/IMG_PROMPTS_ill.md + 배포용 zip.
사용: python3 make_ill_pack.py <캐릭터 참고 그림 폴더(refs)> [zip 출력 경로]"""
import os, sys, shutil, zipfile
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
sys.path.insert(0, B); sys.path.insert(0, os.path.join(ROOT, 'src', 'pages'))
from make_genspark_pack import CAST
from _ill import ILL
REFS = sys.argv[1] if len(sys.argv) > 1 else '/tmp/genspark_pack/refs'
ZIP = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'docs', 'genspark_ill_pack.zip')
NAME = '경제학원론연구실_그림해설_genspark'

STYLE = ('16-bit SNES-era RPG pixel art EXPLAINER ILLUSTRATION, crisp hard-edged pixels on a clear pixel grid '
         '(draw at 480x270 logical pixels, then scale 4x with no smoothing), limited bright palette, PURE WHITE background '
         '(no room, no walls, just a clean white ground with soft pixel shadows). The economic diagram is the MAIN subject, '
         'drawn big and simple: thick colored lines, blocks, coins and small icons that a beginner understands at a glance. '
         'The characters are SMALL guides at the side (about 1/6 of the picture height). Composition 16:9 (1920x1080). '
         'Colors: blue = demand/buyers, red = supply/cost, green = good result, orange = rule or limit, purple = special line.')
MARK = ('Place exactly three small round markers with the digits 1, 2 and 3 (white digit in a dark navy circle) on the three key spots '
        'listed below. Apart from these three digits there must be NO text, letters, words, labels, numbers, logos or signatures anywhere.')
# 표시 위치(①②③) — 그림 아래 설명 순서와 같다
SPOTS = {
 '01a': ['the row of green blocks', 'the row of red blocks', 'the STOP flag'],
 '01b': ['the shop income coins and shop costs on the scale', 'the salary coins on the scale', 'the balance point of the scale'],
 '02a': ['the worker on the fence', 'the sleeping workers inside', 'the dream cloud / pushed-out fence'],
 '02b': ['the first crate of computers and the small car stack', 'the tallest car stack', 'the fence growing outward'],
 '03a': ['the blue line of shoppers', 'the red line of record crates', 'the green handshake crossing'],
 '03b': ['lever one and the blue line', 'lever two and the red line', 'the old ghost dot and the new green dot'],
 '04a': ['the tall thin carpet and the flat wide carpet', 'the price and quantity sides of a carpet', 'the biggest square carpet with the crown'],
 '04b': ['the robot price flag on the hill', 'the treasure chest at the top', 'the rope (left) and rubber band (right) slopes'],
 '05a': ['the orange rope below the crossing', 'the long queue', 'the shadowy seller'],
 '05b': ['the two ropes (low left, high right)', 'the queue (left) and unsold boxes (right)', 'the small number of trades on both sides'],
 '06a': ['the green triangle', 'the blue triangle', 'the crossing point'],
 '06b': ['the closed gate and the red triangle', 'the traders beyond the crossing', 'the crossing point'],
 '07a': ['the wooden wedge', 'the red triangle in the left scene', 'the big red triangle in the right scene'],
 '07b': ['the rising part of the green hill', 'the steep red curve', 'the far side of the green hill past the top'],
 '08a': ['the purple line', 'the point where purple meets red', 'the price tag on the blue line'],
 '08b': ['the single well', 'the middle wells', 'the eight wells with the low price tag'],
 '09a': ['the red line and purple line gap', 'the red-blue crossing', 'the arrow lifting the red line to purple'],
 '09b': ['the straight diagonal', 'the bowed curve', 'the robot moving coins'],
 '10a': ['basket with this-year tags and balloon', 'basket with base-year tags', 'the pin deflating the balloon'],
 '10b': ['the working and job-seeking groups', 'the people walking to the bench', 'the whole village of 100'],
 '11a': ['the blue-red crossing', 'the gray pole and the gap', 'the team pushing the blue line'],
 '11b': ['the blue knob', 'the orange knob', 'the gauge with green zone and flames'],
}
CONV = [('대화 1 — 그림체 확정', ['03a', '03b']), ('대화 2', ['01a', '01b', '02a', '02b']), ('대화 3', ['04a', '04b', '05a', '05b']),
        ('대화 4', ['06a', '06b', '07a', '07b']), ('대화 5', ['08a', '08b', '09a', '09b']), ('대화 6', ['10a', '10b', '11a', '11b'])]
assert sorted(k for _, ks in CONV for k in ks) == sorted(ILL)

def cast(keys): return 'Characters (match the attached reference sheet EXACTLY, same faces, hair, outfits): ' + '; '.join(CAST[k] for k in keys) + '.'
def prompt(k):
    lv, t, who, scene, cap = ILL[k]
    sp = SPOTS[k]
    return (f'{STYLE} {cast(who)} Scene: {scene} {MARK} Marker 1: {sp[0]}. Marker 2: {sp[1]}. Marker 3: {sp[2]}. '
            'Mood: friendly, clean, educational; nothing cut off at the edges.')
def where(k):
    lv = ILL[k][0]
    return '대시보드 바로 앞' if lv == 'dash' else f'단계 {"①②③"[int(lv[-1]) - 1]} 실험 바로 앞'

def write(out):
    os.makedirs(out, exist_ok=True)
    R = ['# Genspark 요청문 — 「그림으로 먼저 보기」 22장 (장마다 2장)', '',
         '처음 오신 분이 차트·숫자를 보기 전에, 그 차트와 대시보드가 무엇을 보여 주는지 그림 한 장으로 먼저 잡도록 돕는 그림입니다.', '',
         '## 순서', '',
         '1. **대화 1**을 먼저 엽니다. `refs/` 폴더의 `cast_sheet.png`, 캐릭터 그림 9장, `style/` 폴더의 표지 그림 2장을 모두 올리고 CH03 두 장을 받습니다.',
         '2. 그림체(픽셀 크기, 흰 배경, 원 번호 1·2·3만 있고 다른 글자 없음)가 마음에 들 때까지 대화 1에서 다시 그립니다.',
         '3. 확정한 CH03 그림(`ill_03a.png`)을 **대화 2~6에 참고 그림으로 함께** 올립니다. 대화 하나에 4장, 모두 16:9입니다.',
         '4. 받은 그림은 `체크리스트.md`의 이름으로 저장해 저장소의 `src/build/ill_in/`에 넣고 아래를 실행합니다.',
         '   `python3 src/build/import_ill.py && python3 src/build/build.py .`',
         '   (픽셀 격자 480×270을 찾아 NEAREST 2배 960×540 무손실 WebP로 바꾸고, 장 쪽의 「그림 준비 중」 자리를 그림으로 바꿉니다.)', '',
         '## 공통 주의', '',
         '- 그림 안에는 **원 번호 1·2·3만** 있어야 합니다. 다른 글자·숫자·로고가 보이면 "remove all text except the three circled digits 1, 2, 3"로 다시 요청합니다.',
         '- 번호 1·2·3의 위치가 프롬프트의 Marker 설명과 다르면 다시 요청합니다. 번호의 뜻은 페이지의 그림 아래 설명(①②③)에 있습니다.',
         '- 선 색이 바뀌면 안 됩니다: 파랑 = 수요·사는 쪽, 빨강 = 공급·비용, 초록 = 좋은 결과, 주황 = 규칙·한계, 보라 = 특별한 선.',
         '- 캐릭터 얼굴·머리·옷이 참고 그림과 다르면 "match the reference sheet exactly"로 다시 요청합니다.',
         '- 흐릿하거나 매끄럽게 나오면 "crisp pixel art, no anti-aliasing, no blur"를 덧붙입니다.', '']
    for name, ks in CONV:
        R += [f'## {name}', '']
        for k in ks:
            lv, t, who, scene, cap = ILL[k]
            R += [f'### ill_{k}.png — CH{k[:2]} {t}', '',
                  f'- 놓일 곳: CH{k[:2]} {where(k)}',
                  '- 그림 아래 설명: ' + ' / '.join(f'{"①②③"[i]} {c}' for i, c in enumerate(cap)), '',
                  '```text', prompt(k), '```', '']
    open(os.path.join(out, '요청문.md'), 'w', encoding='utf-8').write('\n'.join(R))
    C = ['# 저장 이름 체크리스트 — 그림으로 먼저 보기 22장', '', '| 대화 | 저장 이름 | 장 | 놓일 곳 | 제목 | 받음 |', '|---|---|---|---|---|---|']
    for name, ks in CONV:
        for k in ks:
            C.append(f'| {name.split(" ")[0]} {name.split(" ")[1]} | `ill_{k}.png` | CH{k[:2]} | {where(k)} | {ILL[k][1]} | ☐ |')
    C += ['', '받은 그림은 모두 `src/build/ill_in/`에 넣고 `python3 src/build/import_ill.py && python3 src/build/build.py .`를 실행합니다.']
    open(os.path.join(out, '체크리스트.md'), 'w', encoding='utf-8').write('\n'.join(C) + '\n')
    return R

if __name__ == '__main__':
    out = os.path.join(ROOT, 'docs', 'genspark_ill'); R = write(out)
    shutil.copy(os.path.join(out, '요청문.md'), os.path.join(ROOT, 'docs', 'IMG_PROMPTS_ill.md'))
    # zip: 요청문·체크리스트 + refs(캐릭터) + style(표지에서 그림체 참고 2장, PNG)
    tmp = '/tmp/' + NAME; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp + '/refs'); os.makedirs(tmp + '/style')
    for f in ('요청문.md', '체크리스트.md'): shutil.copy(os.path.join(out, f), tmp)
    for f in sorted(os.listdir(REFS)):
        if f.endswith('.png'): shutil.copy(os.path.join(REFS, f), os.path.join(tmp, 'refs', f))
    for k in ('cover_idx', 'cover_03'):
        Image.open(os.path.join(B, 'covers', k + '.webp')).save(os.path.join(tmp, 'style', f'style_{k}.png'))
    os.makedirs(os.path.dirname(ZIP), exist_ok=True)
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for d, _, fs in os.walk(tmp):
            for f in sorted(fs):
                p = os.path.join(d, f); z.write(p, os.path.join(NAME, os.path.relpath(p, tmp)))
    print('zip', ZIP, os.path.getsize(ZIP) // 1024, 'KB')
