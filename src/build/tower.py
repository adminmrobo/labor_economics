# -*- coding: utf-8 -*-
"""노동시장 일자리 장터 — 3D 첫 화면(장터 안내)

시장 보기 쪽(tower.html)은 장터 전체를, 장 쪽은 그 장이 들어 있는 부스를 3D로 보여 주고
부스 평면(방 = 이 쪽의 단계)과 둘러보는 순서를 안내한다.

- build.py / build_extra.py 가 nav 바로 뒤, 표지 그림 앞에 tower_html(key)를 넣는다.
- 이미 빌드된 HTML에는 add_tower.py 로 같은 블록을 넣거나 갈아 끼운다(표식 <!--tower:start--> … <!--tower:end-->).
- three.js 는 CDN(jsdelivr)에서 불러온다. 불러오지 못하면 오른쪽 안내판만으로 쓸 수 있다.
"""
import os, json, html

B = os.path.dirname(os.path.abspath(__file__))
CSS = open(os.path.join(B, 'tower.css'), encoding='utf-8').read()
JS = open(os.path.join(B, 'tower.js'), encoding='utf-8').read()
THREE_VER = '0.170.0'

COMPANY = dict(ko='노동시장 일자리 장터', en='Labor Market Job Fair', hq='강의 장터',
               motto='부스를 한 곳씩 들르며 임금과 일자리가 정해지는 원리를 읽는 일자리 장터',
               sign=['JOB FAIR', '일자리 장터'], plate='노동시장 일자리 장터  ·  천안', svg='JOBS',
               note='가상의 강의 장터입니다. 부스마다 강의실이 하나 있고, 부스마다 박사가 그 장을 강의합니다.')

CLOCKS = [('서울', 'Asia/Seoul'), ('런던', 'Europe/London'), ('뉴욕', 'America/New_York'), ('싱가포르', 'Asia/Singapore')]

PAL = ['#3f5fa8', '#138a52', '#d23f2c', '#2563c9', '#a8329f', '#b77800', '#14899a', '#7a45d6']

def LES(a, b, c, sa, sb, sc):
    return [('three', '안내 데스크', '3줄 요약'), ('cast', '강의실 입구', '강의실 식구'), ('lv1', a, '단계 ① ' + sa), ('lv2', b, '단계 ② ' + sb), ('lv3', c, '단계 ③ ' + sc),
            ('dash', '전광판', '한눈에 보는 대시보드'), ('duel', '토론 코트', '조교 대결'), ('sum', '정리 칠판', '정리'), ('kg', '자료실', '지식 색인 · 꾸러미')]

REV = [('three', '안내 데스크', '3줄 요약'), ('cast', '강의실 입구', '강의실 식구'), ('summary', '요약 게시판', '1부 요약'), ('orig', '시험장', '2부 원자료 문제'),
       ('calc', '계산 연습실', '3부 업무 계산'), ('score', '점수판', '장별 점수'), ('kg', '자료실', '지식 색인 · 꾸러미')]

IDX = [('micro', '안내 데스크', '노동경제학이란'), ('map', '부스 안내판', '목차'), ('keys', '한 줄 핵심 게시판', '한 줄 핵심 모음'), ('dash', '종합 전광판', '종합 대시보드'),
       ('path', '개념 계단', '개념 흐름'), ('how', '식구 라운지', '식구 · 사용법'), ('about', '자료 보관실', '자료와 원칙')]

PRAC = [('home', '가계 상담소', '가계 — 일할 시간 정하기'), ('factory', '공장 인사팀', '공장 — 몇 명 뽑을까'), ('ministry', '노동부 정책실', '정책실 — 최저임금'), ('career', '진로 상담소', '진로 — 공부와 이주')]

def CH(key, label, file, dept, en, title, biz, rooms):
    return dict(key=key, label=label, file=file, dept=dept, en=en, branch='노동시장 일자리 장터', title=title, ep=title.split(' ')[0], biz=biz, rooms=rooms)

FLOORS = [
 dict(key='lobby', label='입구', file='index.html', dept='장터 입구 · 안내소', en='Job Fair Gate & Directory', branch='노동시장 일자리 장터',
      title='목차 — 노동경제학 연구실', ep='목차', biz='일자리 장터의 입구 안내소입니다. 부스 안내판에서 강의실(장)을 고르면 그 부스로 걸어갑니다.', rooms=IDX),
 CH('01', '1호', '01_what_is_labor_econ.html', '오리엔테이션 부스', 'Orientation Booth', 'CH01 노동경제학이란', '노동시장의 세 주체와 임금방정식으로 첫 질문을 던지는 부스예요.', LES('송유관 현장 지도', '임금방정식 계산대', '질문 분류 테이블', '노동시장의 작동', '임금방정식', '질문 분류')),
 CH('02', '2호', '02_labor_supply.html', '노동공급 부스', 'Labor Supply Booth', 'CH02 노동공급 (1) 일할까, 쉴까', '고용 통계와 여가-소비 선택으로 일할 시간을 정하는 부스예요.', LES('고용 통계 게시판', '예산선 작업대', '최적점 탐색대', '고용 지표', '예산선과 무차별곡선', '최적 선택과 유보임금')),
 CH('03', '3호', '03_labor_supply_policy.html', '근로장려 부스', 'Work Incentive Booth', 'CH03 노동공급 (2) 임금 변화와 정책', '임금이 오를 때의 두 효과와 근로장려세제를 계산하는 부스예요.', LES('효과 분해실', '공급곡선 언덕', 'EITC 창구', '대체·소득효과', '노동공급곡선', 'EITC와 복지')),
 CH('04', '4호', '04_labor_demand.html', '채용 부스', 'Hiring Booth', 'CH04 노동수요', '기업이 몇 명을 뽑을지, 사람과 AI 중 무엇을 쓸지 정하는 부스예요.', LES('생산 라인', '비용 최소화 책상', 'AI 대체 실험실', '단기 노동수요', '장기 노동수요', '생산함수와 AI')),
 CH('05', '5호', '05_labor_market_equilibrium.html', '균형 부스', 'Equilibrium Booth', 'CH05 노동시장균형', '임금이 어디서 멈추는지, 최저임금과 이민이 그 자리를 어떻게 옮기는지 다뤄요.', LES('두 지역 지도', '최저임금 저울', '이민 잉여 칠판', '경쟁균형과 이동', '최저임금', '이민의 효과')),
 dict(key='05m', label='쉼터A', file='05m_midterm_review.html', dept='중간 점검 쉼터', en='Mid-term Review Rest Area', branch='노동시장 일자리 장터',
      title='중간 요약정리 및 퀴즈 — CH01~CH05', ep='중간 점검', biz='1~5호 부스 강의를 돌아보며 요약을 보고, 원자료 문제와 계산 문제로 점검하는 쉼터예요.', rooms=REV),
 CH('06', '6호', '06_compensating_differentials.html', '위험수당 부스', 'Risk Premium Booth', 'CH06 보상적 임금격차', '위험하고 불편한 일이 왜 더 받는지, 생명의 통계적 가치를 계산하는 부스예요.', LES('위험 일자리 게시판', '헤도닉 곡선 벽', 'VSL 계산대', '위험한 일의 시장', '헤도닉 임금함수', '생명가치와 정책')),
 CH('07', '7호', '07_education.html', '교육 투자 부스', 'Education Booth', 'CH07 교육 — 인적자본 투자', '공부를 투자로 보고 현재가치와 수익률로 판단하는 부스예요.', LES('현재가치 계산대', '정지규칙 계단', '회귀분석 실습실', '학교교육 모형', '정지규칙', '임금방정식과 능력 편의')),
 CH('08', '8호', '08_wage_distribution.html', '불평등 부스', 'Inequality Booth', 'CH08 임금 분포와 불평등', '훈련, 불평등 측정, 기술과 교육의 경주를 다루는 부스예요.', LES('훈련 작업장', '로렌츠 곡선 벽', '경주 트랙', '직장 내 훈련', '불평등 측정', '불평등의 원인')),
 CH('09', '9호', '09_labor_mobility.html', '이주 상담 부스', 'Mobility Booth', 'CH09 노동 이동과 이민', '떠날지 남을지를 투자로 계산하고, 누가 떠나는지 보는 부스예요.', LES('이주 계산대', '로이 모형 지도', '코호트 추적판', '이주의 현재가치', '로이 모형', '동화와 코호트')),
 dict(key='09f', label='쉼터B', file='09f_final_review.html', dept='기말 점검 쉼터', en='Final Review Rest Area', branch='노동시장 일자리 장터',
      title='기말 요약정리 및 퀴즈 — CH06~CH09', ep='기말 점검', biz='6~9호 부스 강의를 요약하고 퀴즈로 마무리하는 쉼터예요. 장터 끝 광장의 실전 연습장으로 가기 전에 들러요.', rooms=REV),
 dict(key='roof', label='광장', file='practice/index.html', dept='광장 실전 연습장', en='Plaza Practice Arena', branch='노동시장 일자리 장터',
      title='마지막 장 · 실전 연습장 — 가계·공장·정책실·진로 상담소', ep='실전 연습장', biz='장터 끝 광장이에요. 가계·공장·노동부 정책실·진로 상담소를 직접 운영하며 아홉 장의 원리를 연습해요.', rooms=PRAC),
]
for i, f in enumerate(FLOORS):
    f['color'] = '#5d6278' if f['key'] == 'lobby' else ('#138a52' if f['key'] in ('05m', '09f', 'roof') else PAL[(i - 1) % len(PAL)])
KEYS = [f['key'] for f in FLOORS]
BYKEY = {f['key']: f for f in FLOORS}

e = lambda s: html.escape(str(s), quote=True)

def floor_name(f):
    return f'{f["label"]} {f["dept"]}'

def _data(cur, home=''):
    fl = [dict(key=f['key'], label=f['label'], dept=f['dept'], en=f['en'], branch=f['branch'], title=f['title'], ep=f['ep'], file=f['file'],
               biz=f['biz'], color=f['color'], rooms=[dict(id=a, name=b, sec=c) for a, b, c in f['rooms']]) for f in FLOORS]
    return dict(cur=cur, home=home, company=COMPANY, floors=fl)

def _route_items(f):
    o = []
    for i, (a, b, c) in enumerate(f['rooms']):
        tag = '입구' if i == 0 else str(i)
        o.append(f'<li data-i="{i}"><a href="#{a}"><i>{tag}</i><b>{e(b)}</b><span>{e(c)}</span></a></li>')
    return ''.join(o)

def _panel_floor(f):
    i = KEYS.index(f['key'])
    dn = FLOORS[i - 1] if i > 1 else None          # 1호 앞은 장터 입구(목차)
    up = FLOORS[i + 1] if i + 1 < len(FLOORS) else None
    el = []
    el.append(f'<a class="dn" href="{dn["file"]}" title="{e(dn["title"])}">◀ {e(floor_name(dn))}</a>' if dn else '<span class="dn off">◀ 앞 부스 없음</span>')
    el.append('<a class="lob" href="index.html">로비 · 목차</a>')
    el.append(f'<a class="up" href="{up["file"]}" title="{e(up["title"])}">▶ {e(floor_name(up))}</a>' if up else '<span class="up off">▶ 광장이 장터 끝</span>')
    first = '부스 입구로 들어오면 안내 데스크(3줄 요약)부터 들러요. 걷는 사람 표시가 둘러보는 순서를 따라 움직입니다.'
    return f'''<aside class="tw-panel" aria-label="{e(f["label"])} 부스 안내">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<div class="tw-fl"><span class="tw-badge" style="--c:{f["color"]}">{e(f["label"])}</span><div><h2>{e(f["dept"])}</h2><p class="tw-en">{e(f["en"])} · {e(f["branch"])}</p></div></div>
<p class="tw-ep"><b>{e(f["ep"])}</b> {e(f["title"])}</p>
<p class="tw-biz">{e(f["biz"])}</p>
<h3>이 부스 둘러보는 순서</h3>
<p class="tw-tip">{first}</p>
<ol class="tw-route">{_route_items(f)}</ol>
<nav class="tw-elev" aria-label="장터 길 — 부스 이동">{"".join(el)}</nav>
</aside>'''

def _panel_index(f, standalone=False):
    rows = []
    if standalone:
        rows.append(f'<li data-k="00" class="here"><a href="index.html"><span class="tw-badge" style="--c:{f["color"]}">입구</span><b>장터 입구 · 안내소</b><span>목차 · 노동경제학 해설 쪽으로</span></a></li>')
    else:
        rows.append(f'<li data-k="00" class="here"><a href="#three"><span class="tw-badge" style="--c:{f["color"]}">입구</span><b>장터 입구 · 안내소</b><span>지금 계신 곳 · 이 목차 쪽</span></a></li>')
    for g in FLOORS[1:]:
        rows.append(f'<li data-k="{g["key"]}"><a href="{g["file"]}"><span class="tw-badge" style="--c:{g["color"]}">{e(g["label"])}</span><b>{e(g["dept"])}</b><span>{e(g["ep"])} · {e(g["title"])}</span></a></li>')
    clocks = ''.join(f'<span data-tz="{tz}"><b>{c}</b><i>--:--</i></span>' for c, tz in CLOCKS)
    return f'''<aside class="tw-panel" aria-label="부스 안내판">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<h2>부스 안내판</h2>
<p class="tw-biz">{e(COMPANY["motto"])}. 아홉 강의실이 부스 하나씩을 쓰고, 북쪽 줄 끝 쉼터A와 남쪽 줄 끝 쉼터B에서 요약정리와 퀴즈를, 장터 끝 광장에서 실전 연습장을 봅니다. 시장의 부스를 누르거나 아래 안내판에서 골라 들어가세요.</p>
<div class="tw-clock" aria-label="세계 주요 시장 시각">{clocks}</div>
<ol class="tw-dir">{"".join(rows)}</ol>
<p class="tw-note">{e(COMPANY["note"])}</p>
</aside>'''

def tower_html(key, standalone=False):
    f = BYKEY[key]
    idx = key == 'lobby'
    panel = _panel_index(f, standalone) if idx else _panel_floor(f)
    tools = ('<button type="button" data-v="b" class="on">장터 전체</button><button type="button" data-v="spin" aria-pressed="true">자동 회전</button>' if idx else
             '<button type="button" data-v="b">장터 전체</button><button type="button" data-v="p" class="on">이 부스 평면</button>')
    hint = '드래그로 돌려 보고 부스를 누르면 안내 카드가 열려요' if idx else '방을 누르면 그 단계로 내려갑니다 · 드래그로 돌려 보기'
    cap = (f'{COMPANY["ko"]} 3D 모형: 장터 입구부터 장터 끝 광장까지 부스 13곳, 부스마다 한 강의실(장)' if idx else
           f'{COMPANY["ko"]} 3D 모형에서 {f["label"]} {f["dept"]}의 지붕을 걷어 보여 주는 부스 평면')
    data = json.dumps(_data(key, 'index.html' if standalone else ''), ensure_ascii=False).replace('</', '<\\/')
    imap = json.dumps({'imports': {'three': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/build/three.module.js',
                                   'three/addons/': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/'}})
    return f'''<!--tower:start-->
<style>
{CSS}
</style>
<section class="tower{' tw-idx' if idx else ''}" id="tower" data-floor="{key}" aria-label="{e(COMPANY['ko'])} — 장터 안내">
<div class="tw-stage" role="img" aria-label="{e(cap)}">
<div class="tw-cv" aria-hidden="true"></div><div class="tw-labels" aria-hidden="true"></div>
<div class="tw-tools">{tools}</div>
<p class="tw-hint">{hint}</p>
<div class="tw-card" hidden></div>
<div class="tw-err" hidden>3D 장터를 불러오지 못했습니다(인터넷 연결 · WebGL 확인). 오른쪽 안내판으로 그대로 이동할 수 있어요.</div>
<div class="tw-load">장터를 여는 중…</div>
</div>
{panel}
</section>
<script type="application/json" id="towerData">{data}</script>
<script type="importmap">{imap}</script>
<script type="module">
{JS}
</script>
<!--tower:end-->
'''

NAV_LINK = '<a href="#tower">장터 안내</a>'
