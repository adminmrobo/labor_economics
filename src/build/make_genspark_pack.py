#!/usr/bin/env python3
"""Genspark 요청 꾸러미 생성: docs/genspark/ (요청문·체크리스트) + docs/IMG_PROMPTS_all.md + 배포용 zip.
사용: python3 make_genspark_pack.py <fruitfly-lab-expressions 경로> [zip 출력 경로]"""
import os, sys, shutil, zipfile, subprocess
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
CHR = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/adminmrobo/fruitfly-lab-expressions')
ZIP = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'docs', 'genspark_pack.zip')

STYLE = ('16-bit SNES-era RPG pixel art, crisp hard-edged pixels on a clear pixel grid (draw at 480x270 logical pixels, then scale 4x with no smoothing), '
         'limited bright palette, bright DAYTIME university lecture room with a PURE WHITE background wall, big windows with soft daylight, '
         'a white board at the front, light wooden desks in rows. Composition 16:9 (1920x1080). '
         'ABSOLUTELY NO text, letters, numbers, logos or signatures anywhere (keep boards, screens, signs blank or use simple icons).')
CAST = {
 'doctor': 'the PROFESSOR: spiky black hair with one white streak, small ponytail, teal rectangular glasses, white lab coat over black vest and tie',
 'haru': 'HARU (student): long pink hair with navy-blue streaks and two buns, blue eyes, lavender hoodie under a white lab coat',
 'fruitfly': 'the FRUIT-FLY TA: black fruit-fly body, big red compound eyes, blue round helmet with pink and blue tubes, white lab coat, clear wings',
 'jupanbot': 'the ABACUS-ROBOT TA: beige boxy CRT-monitor head with a green smiling face and a small antenna, gray arms, holds a brown wooden abacus, tank treads',
 'sia': 'SIA (student): long straight black hair, black maid-style dress with white frills and a gray bow',
 'moa': 'MOA (student): long light-brown hair, white frilled headband with ribbon, red plaid bow, tan cardigan over white blouse',
 'x1': 'X1 (back-row student): fully black cute silhouette, white dot eyes, pink cheeks, pink hair bow and ponytail',
 'x2': 'X2 (back-row student): fully black cute silhouette, black beret, round teal glasses, white dot eyes',
 'x3': 'X3 (back-row student): fully black cute silhouette in a cat-ear hood with two yellow pom-pom strings',
}
ALL = list(CAST)
def cast(keys): return 'Characters (match the attached reference sheet EXACTLY, same faces, hair, outfits): ' + '; '.join(CAST[k] for k in keys) + '.'
# key, 제목, 등장인물, 장면(행동·소품), 표정 메모
COVERS = [
 ('idx', '목차 — 노동경제학 연구실', ALL, 'the whole class posing together in front of the white board like a class photo; the professor in the center, the two TAs on both sides, three students in front, three silhouettes peeking from the back row; on the desk a small pay envelope, a hard hat, a graduation cap and a suitcase; through the window a bright job-fair street with striped booth awnings', '모두 밝게 웃는 단체 사진'),
 ('01', 'CH01 노동경제학이란', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'x1'], 'a long oil pipeline model running across a snowy mountain diorama on the desk with tiny worker figurines walking toward it; a pay envelope with a question-mark icon floating above it; two crossing straight lines (one blue going down, one red going up) on the board', '하루는 "왜 이 월급?" 고민하는 얼굴'),
 ('02', 'CH02 노동공급 (1) 일할까, 쉴까', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'sia'], 'a big wall clock split into a work half (tiny briefcase icon) and a rest half (tiny hammock icon); on the board a straight downward line touched by one curved line at a glowing green dot; a sofa on one side and a work desk on the other', '시아가 접점을 가리킴'),
 ('03', 'CH03 노동공급 (2) 임금 변화와 정책', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'moa'], 'a golden lottery ticket (blank) with confetti; on the board a curve that rises then bends backward; a small government counter with a coin envelope sliding out; two arrows pulling a rope in opposite directions (substitution vs income)', '모아가 줄다리기 심판'),
 ('04', 'CH04 노동수요', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'x2'], 'a small factory line model with five worker figurines and one shiny AI robot arm entering from the side; a staircase of descending green bars on the board; the robot TA proudly stands next to the AI robot arm while the fruit-fly TA looks surprised', '주판봇이 이긴 판: 주판봇 기뻐함, 초파리 놀람'),
 ('04s', '특별 부록 — 생산함수와 AI 대체 시대', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'x2', 'x3'], 'a split classroom stage: on the LEFT an old-fashioned workshop corner with a hand loom and simple tools where a worker figurine and a wooden machine work side by side (complement); on the RIGHT a sleek glowing AI robot arm and a floating chat-bubble icon (no text) at a modern desk, with a price tag (blank) dropping down like a falling feather; on the board a vertical line, a cliff-shaped step line and a gentle curve; a small group of worker figurines walking away through a side door; the robot TA confidently points at the cliff line while the fruit-fly TA scratches its head', '주판봇이 이긴 판: 주판봇 자신만만, 초파리 머리 긁적'),
 ('05', 'CH05 노동시장균형', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'sia', 'moa'], 'a map of two towns connected by a road with tiny workers walking from one town to the other; a single big factory with one chimney in a small town; an orange horizontal floor line across two crossing lines on the board; a small boat with tiny passengers at the edge of the map', '두 마을을 잇는 길이 보이게'),
 ('05m', '중간 요약정리 및 퀴즈', ['doctor', 'haru', 'moa', 'x1', 'fruitfly', 'jupanbot'], 'a bright review lounge: five closed binders in a row, blank quiz cards pinned on a cork board, a small score board with empty colored bars; Moa holds a clipboard like a referee, students cheering', '응원하는 분위기'),
 ('06', 'CH06 보상적 임금격차', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'sia'], 'a balance scale on the desk with a hard hat and warning cone on one pan and a stack of coins on the other; a rising curve on the board with three colored dots on it; a safety vest hanging on a hook', '저울이 균형을 이룸'),
 ('07', 'CH07 교육 — 인적자본 투자', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'x3'], 'a graduation cap on top of a stack of books next to a small piggy bank; a staircase made of books where each step gets smaller toward the top; on the board a scatter of tiny dots with two straight lines through them; the robot TA happily wears the graduation cap while the fruit-fly TA checks a calculator', '주판봇이 이긴 판: 주판봇 학사모, 초파리 한숨'),
 ('08', 'CH08 임금 분포와 불평등', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'moa'], 'a row of coin stacks of very different heights on the desk from short to very tall; a bowed curve under a diagonal line on the board; a small running track with two runners (one carrying a book, one carrying a computer chip)', '두 주자가 나란히 달림'),
 ('09', 'CH09 노동 이동과 이민', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'sia', 'x1'], 'a world map on the wall with dotted travel lines; suitcases and a small airplane model on the desk; a family of tiny figurines holding hands next to a signpost with two blank arrows; three colored lines rising on the board', '여행 가방을 든 하루'),
 ('09f', '기말 요약정리 및 퀴즈', ['doctor', 'haru', 'sia', 'x3', 'fruitfly', 'jupanbot'], 'a sunny review lounge with four closed binders, blank quiz cards on a cork board, an open door at the back glowing toward a plaza with striped booth awnings; Sia raises a small starting flag (no text)', '마지막 응원'),
 ('prac', '마지막 장 · 실전 연습장', ['doctor', 'haru', 'fruitfly', 'jupanbot', 'x2'], 'an outdoor PLAZA at the end of a job fair under blue sky (keep it bright and white-toned): four small booths: a household desk with a clock and sofa, a factory hiring desk with worker figurines, a government policy desk with a floor-line sign, a career desk with a graduation cap; characters running each booth', '각자 부스를 운영'),
]
TITLE = {k: t for k, t, *_ in COVERS}
CONV = [('대화 1 — 그림체 확정', ['idx']), ('대화 2', ['01', '02', '03', '04']), ('대화 3', ['04s', '05', '05m', '06']), ('대화 4', ['07', '08', '09']), ('대화 5', ['09f', 'prac'])]

def prompt(k):
    _, t, who, scene, memo = next(c for c in COVERS if c[0] == k)
    return f'{STYLE} {cast(who)} Scene: {scene}. Mood: cheerful, clean, educational, everyone clearly visible, no one cut off at the edges.'

def write_docs(out):
    os.makedirs(out, exist_ok=True)
    R = ['# Genspark 요청문 — 노동경제학 연구실 표지 14장', '',
         '## 순서', '',
         '1. **대화 1**을 먼저 엽니다. `refs/` 폴더의 `cast_sheet.png`와 캐릭터 9장을 모두 올리고 목차 표지 1장을 받습니다.',
         '2. 그림체(픽셀 크기, 흰 배경, 캐릭터 얼굴)가 마음에 들 때까지 대화 1에서 다시 그립니다.',
         '3. 확정한 목차 표지(`cover_idx.png`)를 **대화 2~5에 참고 그림으로 함께** 올립니다. 대화 하나에 3~4장, 모두 16:9입니다.',
         '4. 받은 그림은 `체크리스트.md`의 이름으로 저장하고, 저장소의 `src/build/covers_in/`에 넣은 뒤 `python3 src/build/import_covers.py`를 실행합니다(픽셀 격자를 찾아 NEAREST 정수배로 1920×1080 무손실 WebP로 바꿉니다).', '',
         '## 공통 주의', '', '- 그림 안에 글자·숫자·로고가 들어가면 다시 요청합니다("remove all text").', '- 캐릭터 얼굴·머리·옷이 참고 그림과 다르면 "match the reference sheet exactly"로 다시 요청합니다.', '- 흐릿하게(매끄럽게) 나오면 "hard-edged pixels, no anti-aliasing"을 덧붙입니다.', '']
    for name, ks in CONV:
        R += [f'## {name} ({len(ks)}장)', '', '첨부: `refs/cast_sheet.png` + 캐릭터 9장' + (' + 확정한 `cover_idx.png`' if ks != ['idx'] else ''), '']
        if ks != ['idx']:
            R += ['첫 메시지 맨 앞에 붙일 문장:', '', '```', 'Use the attached cover_idx.png as the STYLE REFERENCE (same pixel size, palette, white daytime classroom, same character designs). Make the following images one by one, 16:9 each.', '```', '']
        for k in ks:
            R += [f'### cover_{k} — {TITLE[k]}', '', '```', prompt(k), '```', '']
    open(os.path.join(out, '요청문.md'), 'w', encoding='utf-8').write('\n'.join(R))
    C = ['# 저장 이름 체크리스트', '', '| ☐ | 대화 | 저장 이름 | 쪽 | 표정·장면 확인 |', '|---|---|---|---|---|']
    for name, ks in CONV:
        for k in ks:
            memo = next(c for c in COVERS if c[0] == k)[4]
            C.append(f'| ☐ | {name.split(" —")[0]} | `cover_{k}.png` | {TITLE[k]} | {memo} |')
    C += ['', '받은 뒤 점검: ① 글자 없음 ② 흰 배경·낮 ③ 캐릭터 얼굴이 참고 그림과 같음 ④ 4배 확대해도 픽셀 경계가 또렷함 ⑤ 등장인물이 잘리지 않음']
    open(os.path.join(out, '체크리스트.md'), 'w', encoding='utf-8').write('\n'.join(C))
    P = ['# 그림 지시문 모음 — 노동경제학 연구실 (Genspark용)', '', '표지 14장. 16비트 RPG 픽셀아트, 낮의 강의실(흰 배경). 대화별 순서와 첨부 목록은 `docs/genspark/요청문.md`에 있습니다.', '']
    for k, t, *_ in COVERS:
        P += [f'## cover_{k} — {t}', '', '```', prompt(k), '```', '']
    open(os.path.join(ROOT, 'docs', 'IMG_PROMPTS_all.md'), 'w', encoding='utf-8').write('\n'.join(P))

def make_refs(dst):
    os.makedirs(dst, exist_ok=True)
    names = {'doctor': '박사', 'haru': '하루', 'fruitfly': '초파리', 'jupanbot': '주판봇', 'sia': '시아', 'moa': '모아', 'x1': 'X1', 'x2': 'X2', 'x3': 'X3'}
    files = []
    for k in CAST:
        s = os.path.join(CHR, 'images', k, 'E13_neutral.png'); d = os.path.join(dst, f'ref_{k}.png'); shutil.copy(s, d); files.append(d)
    subprocess.run(['montage', *files, '-tile', '5x2', '-geometry', '360x360+10+10', '-background', 'white', os.path.join(dst, 'cast_sheet.png')], check=True)

if __name__ == '__main__':
    out = os.path.join(ROOT, 'docs', 'genspark'); write_docs(out)
    tmp = '/tmp/genspark_pack'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    make_refs(os.path.join(tmp, 'refs'))
    for f in ('요청문.md', '체크리스트.md'): shutil.copy(os.path.join(out, f), tmp)
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for r, _, fs in os.walk(tmp):
            for f in fs: p = os.path.join(r, f); z.write(p, os.path.join('노동경제학연구실_genspark', os.path.relpath(p, tmp)))
    print(ZIP, os.path.getsize(ZIP) // 1024, 'KB')
