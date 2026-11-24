# -*- coding: utf-8 -*-
"""목차(index) 첫 화면 = 노동경제학 해설 + 장터 보기 썸네일.

- index.html : 표지 → 머리말(미시경제학 설명) → 미시경제학이란 → 목차 카드 → 시장으로 둘러보기(썸네일) → …
- tower.html : 생활경제 시장 3D(시장 전체 · 가게 안내판)를 따로 보는 쪽
build_extra.index() 와 patch_home.py(이미 빌드된 index.html 고치기)가 함께 쓴다.
"""
import base64, html, re, json
import tower

e = html.escape
strip = lambda s: re.sub('<[^>]+>', '', s)
DATE = '2026-11-25'
WHO_PAGE = 'https://adminmrobo.github.io/who_am_i/who_am_i.html'

LEAD = ('<b>노동경제학</b>은 "나는 왜 이 월급을 받을까?"를 숫자로 묻는 경제학이에요. 일할 시간을 고르는 <b>노동자(공급)</b>, 몇 명을 뽑을지 정하는 <b>기업(수요)</b>, 규칙을 만드는 <b>정부</b>가 노동시장에서 만나 <b>임금</b>과 <b>고용</b>이 정해집니다. '
        '이 강의는 1부(CH01~CH05)에서 노동공급·노동수요·노동시장균형과 최저임금·이민을, 2부(CH06~CH09)에서 보상적 임금격차·교육·임금 불평등·노동 이동을 다룹니다. '
        'CH05와 CH09 뒤에는 요약정리와 퀴즈가, 마지막에는 가계·공장·노동부 정책실·진로 상담소를 운영해 보는 실전 연습장이 있어요.')
BASIS = ('<b>본 강의는 한국기술교육대학교 고용정책과의 노동경제학 2026년 1학기 강의를 기반으로 제작됐습니다.</b> '
         '주차별 강의노트(1~11주차)와 기말고사 대비 자료집, 추가 자료(생산함수 4종과 AI 대체·실망실업, 민서 임금방정식 실습)를 뼈대로 하고, '
         '주 교재 George J. Borjas, 『Labor Economics』(8판)의 개념·그림 번호를 따랐습니다.')

def byline():
    return (f'<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{WHO_PAGE}" target="_blank" rel="noopener">저자 소개</a>'
            f' · {DATE} 처음 공개</p>'
            f'<p class="basis">{BASIS}</p>')

# ---------- 시장 썸네일 (픽셀풍 SVG) ----------
def tower_svg(w=192, h=108):
    """16비트 RPG 픽셀아트 느낌의 일자리 장터 그림. 부스 차양 색은 tower.FLOORS 와 같다."""
    r = []
    R = lambda x, y, ww, hh, c: r.append(f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" fill="{c}"/>')
    R(0, 0, 192, 108, '#f3f7fd'); R(0, 56, 192, 44, '#e8f0fb')
    for cx, cy in ((22, 12), (150, 8), (110, 18)):
        R(cx, cy, 14, 3, '#ffffff'); R(cx + 3, cy - 2, 7, 2, '#ffffff')
    R(0, 100, 192, 8, '#a9c48a'); R(0, 100, 192, 1, '#8fb070')
    # 아케이드 지붕(반원 느낌 계단형)
    for i, (dy, ww) in enumerate(((0, 128), (2, 132), (4, 136))):
        R(16 - i * 2, 30 + dy, ww, 2, '#c9d8ec')
    R(14, 36, 136, 2, '#9aa8be')
    for x in range(18, 150, 18): R(x, 30, 1, 8, '#9aa8be')
    # 가게 일곱 곳이 늘어선 앞줄(북쪽 줄) — 차양 줄무늬 + 간판 + 진열대
    north = [f for f in tower.FLOORS if f['key'] in ('lobby', '01', '02', '03', '04', '05', '05m')]
    sx, sw = 16, 19
    for i, f in enumerate(north):
        x = sx + i * sw
        R(x, 40, sw - 1, 58, '#f4ecdc')                    # 가게 몸체
        R(x + 2, 42, sw - 5, 6, f['color']); R(x + 3, 44, sw - 7, 2, '#ffffff')   # 간판
        for k in range(0, sw - 1, 4):                       # 줄무늬 차양
            R(x + k, 50, 2, 6, f['color']); R(x + k + 2, 50, 2, 6, '#ffffff')
        R(x, 56, sw - 1, 1, '#00000022')
        R(x + 3, 84, sw - 7, 10, '#d9c7a6'); R(x + 3, 84, sw - 7, 1, '#b8a382')  # 진열대
        for k, c in enumerate(('#d23f2c', '#f3c969', '#6fae84')): R(x + 4 + k * 4, 81, 3, 3, c)
    # 시장 문(왼쪽)
    R(6, 34, 3, 66, '#8f5f00'); R(6, 26, 30, 6, '#8f5f00'); R(8, 27, 26, 4, '#f3c969')
    r.append('<text x="21" y="30.4" font-size="4.2" font-family="monospace" font-weight="700" text-anchor="middle" fill="#8f5f00">JOBS</text>')
    # 골목 끝 광장 경기장(오른쪽)
    R(156, 72, 34, 4, '#dfe5ee'); R(154, 76, 38, 20, '#dfe5ee'); R(158, 78, 30, 14, '#8fcf9f'); R(172, 78, 1, 14, '#ffffff')
    R(156, 96, 34, 4, '#c9d1de'); R(164, 62, 18, 7, '#138a52')
    r.append('<text x="173" y="67.4" font-size="4.2" font-family="monospace" font-weight="700" text-anchor="middle" fill="#ffffff">PLAZA</text>')
    # 나무 · 사람
    for tx in (146, 186):
        R(tx + 2, 96, 2, 4, '#7a5530'); R(tx, 90, 6, 6, '#3f8f4e')
    for px, c in ((40, '#d0457f'), (92, '#3f5fa8'), (120, '#138a52')):
        R(px, 95, 2, 2, '#f1c9a5'); R(px, 97, 2, 3, c)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 108" width="{w}" height="{h}" shape-rendering="crispEdges" '
            f'role="img" aria-label="픽셀 그림: 장터 문으로 들어가 줄무늬 차양 부스들이 늘어선 길 끝에 광장이 있는 {e(tower.COMPANY["ko"])}">' + ''.join(r) + '</svg>')

def tower_svg_uri():
    return 'data:image/svg+xml;base64,' + base64.b64encode(tower_svg().encode('utf-8')).decode()

# ---------- CSS ----------
CSS = '''
.th-tower{background-image:url(%s);image-rendering:pixelated}
.ihero .byline{font-size:14px;color:var(--muted);margin:0}
.ihero .basis{font-size:14px;margin:0;padding:10px 14px;border-left:4px solid var(--seq);background:rgba(63,95,168,.07);border-radius:0 10px 10px 0}
.ihero .lead2{color:var(--text);max-width:68ch}
.mosaic .mt.bld{outline:2px solid var(--seq);outline-offset:-2px}
.mosaic .mt.bld span{background:var(--seq);color:#fff}
.bys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;counter-reset:bys}
.bys>div{position:relative;background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:18px 18px 16px;display:flex;flex-direction:column;gap:6px}
.bys>div b{font-size:17px}
.bys>div .en{font-size:12px;color:var(--muted);letter-spacing:.02em}
.bys>div:nth-child(1){border-top:4px solid var(--seq)}
.bys>div:nth-child(2){border-top:4px solid var(--amber)}
.bys>div:nth-child(3){border-top:4px solid var(--gfp)}
.byfx{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;font-weight:700;font-size:clamp(16px,2.2vw,21px);padding:16px;border:1px dashed var(--rule);border-radius:12px;background:#fff}
.byfx span{padding:6px 12px;border-radius:8px}
.byfx .p{background:rgba(63,95,168,.10);color:var(--seq)}.byfx .l{background:rgba(183,120,0,.12);color:var(--amber)}.byfx .q{background:rgba(19,138,82,.12);color:var(--gfp)}
.byfx i{font-style:normal;color:var(--muted)}
.bylab{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px}
.bylab .row{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center}
.bylab label{display:flex;align-items:center;gap:8px;font-size:14px;flex:1 1 220px}
.bylab label input{flex:1}
.bylab output{min-width:42px;font-weight:700;text-align:right}
.bymeter{position:relative;height:30px;border-radius:8px;background:#fff;border:1px solid var(--rule);overflow:hidden}
.bymeter i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,var(--gfp),#2fb37a);transition:width .35s}
.bymeter b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px}
.byhist{display:flex;flex-wrap:wrap;gap:6px;font-size:13px}
.byhist span{padding:3px 8px;border-radius:6px;background:#fff;border:1px solid var(--rule)}
.byhist span.up{border-color:rgba(19,138,82,.5)}.byhist span.dn{border-color:rgba(210,63,44,.5)}
.chapx{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.chapx a{display:flex;flex-direction:column;gap:6px;background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:16px;color:var(--text);text-decoration:none;min-width:0}
.chapx a:hover{border-color:var(--seq);box-shadow:0 4px 12px rgba(30,35,60,.10)}
.chapx a .ct{display:block;aspect-ratio:16/9;margin:-16px -16px 8px;border-radius:11px 11px 0 0;background-size:cover;background-position:center;border-bottom:1px solid var(--rule)}
.chapx a>b{color:var(--seq);font-size:13px}
.chapx a>strong{font-size:16px;line-height:1.35}
.chapx a>small{color:var(--muted)}
.chapx a ol{margin:2px 0 0;padding-left:20px;font-size:14px;color:var(--text)}
.chapx a ol li.duel{list-style:none;margin-left:-20px;color:var(--c-fly)}
.chapx a.review{border-color:rgba(183,120,0,.55);background:rgba(183,120,0,.06)}
.chapx a.review>b{color:var(--amber)}
.bldcard{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:22px;align-items:center;background:linear-gradient(180deg,#eef3fb,#fff);border:1px solid var(--rule);border-radius:14px;padding:18px;color:var(--text);text-decoration:none}
.bldcard:hover{border-color:var(--seq);box-shadow:0 6px 16px rgba(30,35,60,.12)}
.bldcard .pic{border-radius:10px;overflow:hidden;border:1px solid var(--rule);background:#f3f7fd}
.bldcard .pic svg{display:block;width:100%;height:auto;image-rendering:pixelated}
.bldcard h3{margin:0 0 6px}
.bldcard ul{margin:8px 0 12px;padding-left:20px;font-size:15px}
.bldcard .go{display:inline-block;background:var(--seq);color:#fff;font-weight:700;padding:9px 16px;border-radius:9px}
@media (max-width:860px){.bys,.chapx{grid-template-columns:repeat(2,minmax(0,1fr))}.bldcard{grid-template-columns:1fr}}
@media (max-width:520px){.bys,.chapx{grid-template-columns:1fr}}
'''

def css():
    return '<style>' + CSS.replace('url(%s)', 'url(' + tower_svg_uri() + ')', 1) + '</style>'

# ---------- 미시경제학이란 ----------
LAB_JS = ""

def micro_section(say):
    """say(who, mood, text) -> html (캐릭터 대사)."""
    talk = (say('doc', 'front', '첫 질문은 늘 같아요. "당신은 왜 그 월급을 받나요?" 열심히 일해서? 공부를 많이 해서? 회사 규정이라서? 노동경제학은 이 직관을 숫자로 확인해요.')
            + say('fly', 'point', '임금 뉴스를 들으면 먼저 물어. 수요 쪽 이야기야, 공급 쪽 이야기야? 그리고 무엇을 고정하고 비교했어?')
            + say('robo', 'coin', '난 높은 임금 편이야! 최저임금은 높을수록 좋겠지… 일단 아래 대시보드부터 돌려 볼게!')
            + say('asst', 'smile', '맨 앞자리 하루예요. 아래 대시보드에서 수요·공급·최저임금 슬라이더를 하나씩만 움직여 보세요.')
            + say('x1', 'wow', '뒷자리 X1이에요. ▶ 재생을 누르니 최저임금이 균형을 넘는 순간부터 실업 막대가 자라요!'))
    rows = [('파는 사람', '노동자(가계) — 시간을 팔아 소득을 얻음', 'CH02·CH03 노동공급, CH07 교육, CH09 이주'),
            ('사는 사람', '기업 — 노동이 만든 가치(VMP)만큼 사려 함', 'CH04 노동수요, AI와의 대체'),
            ('가격', '임금 — 수요와 공급이 만나는 곳', 'CH05 균형, CH06 보상격차, CH08 불평등'),
            ('규칙', '정부 — 최저임금·세금·안전규제·이민정책', 'CH03 EITC, CH05 최저임금·이민, CH06 안전규제')]
    tb = ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>' for a, b, c in rows)
    return f"""<section class="level" id="micro"><div class="wrap stack">
<div class="lvhead"><h2>노동경제학이란? — 시간을 파는 시장</h2><p class="lead">노동시장도 수요와 공급이 만나는 시장이에요. 다만 파는 물건이 "사람의 시간과 노력"이라 두 가지가 특별해요. 공급은 여가와 소득 사이의 선택에서 나오고, 수요는 그 노동이 만든 물건이 팔려야 생기는 파생수요예요.</p></div>
<div class="bys">
<div><span class="en">① SUPPLY · 노동공급</span><b>얼마나 일할까</b><p>하루 24시간을 일과 여가로 나눠요. 시급은 여가 1시간의 값(기회비용)이라, 임금이 바뀌면 대체효과와 소득효과가 함께 생겨요.</p></div>
<div><span class="en">② DEMAND · 노동수요</span><b>몇 명을 뽑을까</b><p>기업은 마지막 한 명이 만든 가치(VMP)가 임금과 같아질 때까지 뽑아요. 임금이 오르면 기계·AI로 바꾸기도 해요.</p></div>
<div><span class="en">③ EQUILIBRIUM · 균형과 차이</span><b>임금은 어디서 멈출까</b><p>수요와 공급이 만나는 곳에서 임금이 정해지고, 위험·교육·숙련·이동 비용이 사람마다 임금을 다르게 만들어요.</p></div>
</div>
<div class="byfx" aria-label="노동경제학을 말로 쓴 식"><span class="p">노동공급(여가 vs 소득)</span><i>+</i><span class="l">노동수요(VMP = w)</span><i>→</i><span class="q">임금과 고용</span><i>→</i><span class="p">격차·불평등·정책</span></div>
<details open class="more"><summary>수식으로 보면</summary><p style="margin:10px 0 0">노동자: 효용 U(C, L)을 예산 C = w(T − L) + V 안에서 최대로 → MRS = w. 기업: 이윤을 최대로 → VMP<sub>L</sub> = p × MP<sub>L</sub> = w. 시장: 공급 E<sub>s</sub>(w) = 수요 E<sub>d</sub>(w). 예) 공급 w = 4 + E/10, 수요 w = 20 − E/10 → E* = 80, w* = 12. 자세한 풀이는 <a href="05_labor_market_equilibrium.html">CH05 노동시장균형</a>에서 다룹니다.</p></details>
<div class="talk">{talk}</div>
<div class="dash panel" data-dash="lm" id="mclab" aria-label="직접 해 보기: 노동수요·공급·최저임금을 바꿔 노동시장 균형 보기 대시보드"></div>
<h3>노동시장의 세 주체와 이 강의</h3>
<div class="tw"><table class="tb"><tr><th></th><th>누가 · 무엇을</th><th>이 강의에서</th></tr>{tb}</table></div>
<p class="muted" style="font-size:14px">수요·공급·잉여의 기초가 더 필요하면 <a href="https://adminmrobo.github.io/basic_economic_lab/" target="_blank" rel="noopener">경제학 원론 연구실</a>, 소비자·생산자 이론을 깊게 보려면 <a href="https://adminmrobo.github.io/micro_economics/" target="_blank" rel="noopener">미시경제학 연구실</a>로 이어집니다.</p>
</div></section>
{LAB_JS}"""

# ---------- 목차 카드 ----------
def chl(n): return f'CH{n}'
MID = ['01', '02', '03', '04', '05']; FIN = ['06', '07', '08', '09']; CHS = MID + FIN
def toc_section(L):
    def card(n):
        Q = L[n]
        topic = Q['short_title']
        lis = ''.join(f'<li>{e(strip(l["title"]))}</li>' for l in Q['levels'])
        lis += f'<li class="duel">⚔ 조교 대결: {e(strip(Q["duel"]["question"]))}</li>'
        return (f'<a href="{Q["file"]}"><span class="ct th-{n}" aria-hidden="true"></span><b>{chl(n)} · {e(topic)}</b>'
                f'<strong>{e(strip(Q["title"]))}</strong><small>{e(strip(Q["question"]))}</small><ol>{lis}</ol></a>')
    def rv(k, f, t, items, label='요약 · 퀴즈'):
        lis = ''.join(f'<li>{x}</li>' for x in items)
        return f'<a class="review" href="{f}"><span class="ct th-{k}" aria-hidden="true"></span><b>{label}</b><strong>{t}</strong><ol>{lis}</ol></a>'
    p1 = ''.join(card(n) for n in MID) + rv('05m', '05m_midterm_review.html', '중간 요약정리 및 퀴즈 (CH01~CH05)', ['장별 요약정리', '원자료 확인 문제 25문항', '업무 계산 문제 5개', '장별 점수'])
    p2 = ''.join(card(n) for n in FIN) + rv('09f', '09f_final_review.html', '기말 요약정리 및 퀴즈 (CH06~CH09)', ['장별 요약정리', '원자료 확인 문제 20문항', '업무 계산 문제 4개', '장별 점수'])
    p3 = rv('prac', 'practice/index.html', '마지막 장 · 실전 연습장', ['가계 상담소 — 최적 근로시간·유보임금', '공장 인사팀 — VMP = w와 AI 대체', '노동부 정책실 — 최저임금과 수요독점', '진로 상담소 — 교육의 정지규칙'], '시뮬레이터')
    steps = ('<div class="steps"><div><b>이런 분께</b><p>최저임금·실업률·외국인 노동자·AI 일자리 뉴스를 듣지만, 그것이 내 월급과 어떻게 이어지는지 숫자로 보고 싶은 분. 수식을 몰라도 됩니다.</p></div>'
             '<div><b>읽는 순서</b><p>CH01 → CH09 순서가 기본이에요. 앞 장의 한계가 다음 장의 이유가 되도록 이어 두었어요. 시험 대비라면 중간·기말 정리 쪽부터 봐도 됩니다.</p></div>'
             '<div><b>장터로 둘러보기</b><p>장마다 가상의 「노동시장 일자리 장터」의 부스 하나(강의실)가 됩니다. 아래 <a href="#building">장터 보기</a>에서 3D 장터와 부스 안내판으로 장을 골라도 돼요.</p></div></div>')
    return (f'<section class="level" id="map"><div class="wrap stack"><div class="lvhead"><h2>목차</h2><p class="lead">아홉 장과 요약·퀴즈 두 쪽, 그리고 마지막 장 실전 연습장입니다. 카드마다 그 장에서 다루는 세 가지 주제와 조교 대결 질문을 적어 두었어요.</p></div>'
            f'<h3>1부 · 노동시장의 기본 모형 — 공급·수요·균형 (CH01~CH05, 중간고사 범위)</h3><div class="chapx">{p1}</div>'
            f'<h3>2부 · 임금은 왜 사람마다 다를까 — 보상격차·교육·불평등·이동 (CH06~CH09, 기말고사 범위)</h3><div class="chapx">{p2}</div>'
            f'<h3>마지막 장</h3><div class="chapx">{p3}</div>{steps}</div></section>')

def building_section():
    return f"""<section class="level" id="building"><div class="wrap stack">
<div class="lvhead"><h2>장터로 둘러보기 — 노동시장 일자리 장터</h2><p class="lead">같은 열한 쪽을 일자리 장터로도 볼 수 있어요. 가상의 강의 장터 「노동시장 일자리 장터」에서 장 하나가 강의실 하나, 강의실 하나가 부스 하나입니다. 노동을 사고파는 곳이 노동시장이니까요.</p></div>
<a class="bldcard" href="tower.html"><div class="pic">{tower_svg(384, 216)}</div><div><h3>장터 보기 — 3D 일자리 장터</h3><p class="muted" style="margin:0">장터 입구 안내소부터 장터 끝 광장 실전 연습장까지 13곳</p><ul><li>장터를 드래그로 돌려 보고, 부스를 누르면 강의실(장) 안내 카드가 열려요.</li><li>부스 안내판에서 바로 그 강의실로 갈 수 있어요.</li></ul><span class="go">장터 보기 →</span></div></a>
</div></section>"""

def mosaic_tile():
    return '<a class="mt th-tower bld" href="tower.html" title="장터 보기 · 노동시장 일자리 장터"><span>장터</span><i class="sr">장터 보기 · 노동시장 일자리 장터 3D</i></a>'

def practice_tile():
    return '<a class="mt th-prac" href="practice/index.html" title="마지막 장 · 실전 연습장"><span>실전</span><i class="sr">마지막 장 · 실전 연습장</i></a>'

THUMB_KEYS = CHS + ['05m', '09f', 'idx', 'prac']

NAV = [('micro', '노동경제학이란'), ('map', '목차'), ('building', '장터 보기'), ('keys', '한 줄 핵심'), ('dash', '종합 대시보드'), ('path', '개념 흐름'), ('how', '식구·사용법'), ('about', '자료와 원칙')]

def nav_html(label):
    a = ''.join(f'<a href="{"tower.html" if i == "building" else "#" + i}">{e(t)}</a>' for i, t in NAV)
    return f'<nav class="top" aria-label="섹션 바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>{e(label)}</a><div class="links">{a}</div></div></nav>\n'

# ---------- 시장 보기 쪽(tower.html) ----------
def tower_page(base_css, site):
    blk = tower.tower_html('lobby', standalone=True)
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>장터 보기 — 노동시장 일자리 장터 · 노동경제학 연구실</title>
<meta name="description" content="노동경제학 연구실 열한 쪽과 실전 연습장을 가상의 강의 장터 「노동시장 일자리 장터」의 부스 13곳으로 둘러보는 3D 장터 안내.">
<meta property="og:title" content="장터 보기 — 노동시장 일자리 장터">
<meta property="og:image" content="{site}assets/og/cover_idx.jpg">
<meta property="og:url" content="{site}tower.html">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0l7 4v8l-7 4-7-4V4z' fill='%239ab0d0'/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap">
<style>
{base_css}
</style>
</head>
<body>
<nav class="top" aria-label="바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>노동경제학 연구실</a><div class="links"><a href="index.html">← 목차</a><a href="index.html#map">장 목록</a><a href="01_what_is_labor_econ.html">CH01부터</a></div></div></nav>
{blk}
<section class="level"><div class="wrap stack">
<div class="lvhead"><h2>이 장터는</h2><p class="lead">{e(tower.COMPANY["motto"])}. 「노동경제학 연구실」 아홉 장이 아홉 부스로, 쉼터A와 쉼터B가 중간·기말 요약정리 및 퀴즈로, 장터 끝 광장이 실전 연습장으로 들어 있어요. 본 강의는 한국기술교육대학교 고용정책과의 노동경제학 2026년 1학기 강의를 기반으로 제작됐습니다.</p></div>
<p class="muted" style="font-size:14px">{e(tower.COMPANY["note"])} 3D는 three.js(jsdelivr CDN)로 그립니다. 불러오지 못하면 안내판만으로 그대로 이동할 수 있어요.</p>
<p><a href="index.html">← 목차로 돌아가기</a></p>
</div></section>
<footer id="footer"><div class="wrap stack"><p>글 · 안상선 ((주)M-Robo 대표) · <a href="{WHO_PAGE}" target="_blank" rel="noopener">저자 소개</a> · <a href="https://github.com/adminmrobo/labor_economics" target="_blank" rel="noopener">GitHub 저장소</a><br>캐릭터 이름·설정·그림의 저작권은 안상선(개인)에게 있으며 허락 없이 쓸 수 없습니다.</p></div></footer>
</body>
</html>
"""
