CHT = {1: '노동경제학이란', 2: '노동공급 (1) 일할까, 쉴까', 3: '노동공급 (2) 임금 변화와 정책', 4: '노동수요', 5: '노동시장균형',
       6: '보상적 임금격차', 7: '교육 — 인적자본 투자', 8: '임금 분포와 불평등', 9: '노동 이동과 이민'}
FILES = {1: '01_what_is_labor_econ.html', 2: '02_labor_supply.html', 3: '03_labor_supply_policy.html', 4: '04_labor_demand.html', 5: '05_labor_market_equilibrium.html',
         6: '06_compensating_differentials.html', 7: '07_education.html', 8: '08_wage_distribution.html', 9: '09_labor_mobility.html'}
AU = [{'family': '안', 'given': '상선'}]
def _r(id, typ, title, year, role, note, url='', venue=''):
    r = {'id': id, 'type': typ, 'title': title, 'author': AU, 'issued': {'date-parts': [[year]]},
         'lab': {'work': f'lab:work/{id}', 'role': role, 'verified': {'title': True, 'authors': True, 'year': True, 'venue': False}, 'checkedBy': '업로드 원본 PDF 대조', 'note': note}}
    if url: r['URL'] = url
    if venue: r['container-title'] = venue
    return r
NOTE = _r('ahn2026labor', 'manuscript', '노동경제학 강의노트 (2026-1학기, 1~11주차)', 2026, 'primary', '한국기술교육대학교 고용정책과 노동경제학 강의노트. 주차별 강의안(오리엔테이션, 2~5주차 노동공급·노동수요, 9주차 보상적 임금격차, 10주차 임금 분포, 11주차 노동 이동)')
FINAL = _r('ahn2026labor_final', 'manuscript', '노동경제학 기말고사 대비 자료집 (2026-1학기)', 2026, 'primary', '4장 노동시장균형부터 8장 노동 이동까지 묶은 자료집과 추가 자료(민서 임금방정식 실습, 보상적 임금격차 요약 슬라이드)')
AIAPP = _r('ahn2026labor_ai', 'manuscript', '생산함수와 AI 대체 시대 — 생산함수와 임금·자본비용 변화, AI 대체, 그리고 실망실업의 경제학적 분석 (노동경제학 특별 부록)', 2026, 'primary', '저자가 직접 만든 특별 부록. 생산함수 4종 비교, 레온티에프 비용 최소화, 선형 대체의 코너해와 임계임금, ChatGPT 초저가 시나리오, 의향임금과 실망실업, 연습문제 Q1~Q9')
SRC_AI = '안상선 (2026). 「생산함수와 AI 대체 시대」 노동경제학 특별 부록(저자 작성). 이 쪽의 주 자료.'
BORJAS = {'id': 'borjas2020labor', 'type': 'book', 'title': 'Labor Economics (8th ed.)', 'author': [{'family': 'Borjas', 'given': 'George J.'}], 'issued': {'date-parts': [[2020]]},
          'container-title': 'McGraw-Hill Education', 'lab': {'work': 'lab:work/borjas2020labor', 'role': 'background', 'verified': {'title': True, 'authors': True, 'year': True, 'venue': True}, 'checkedBy': '업로드 교재 PDF 판권면 대조(ISBN 978-1-260-56552-2)', 'note': '강의의 주 교재. 본문을 옮기지 않고 개념·그림 번호·사례만 참고'}}
def REFS(n):
    return ([NOTE] if n <= 5 else [NOTE, FINAL]) + [BORJAS]
SRC_NOTE = '안상선 (2026). 「노동경제학」 강의노트(2026-1학기). 한국기술교육대학교 고용정책과. 이 페이지의 주 자료.'
SRC_FINAL = '안상선 (2026). 「노동경제학」 기말고사 대비 자료집과 추가 자료. 이 페이지의 주 자료.'
SRC_BJ = 'Borjas, G. J. (2020). Labor Economics (8th ed.). McGraw-Hill. 강의의 주 교재(본문을 옮기지 않음).'
def PN(n):
    seq = [None] + [(FILES[i], f'CH{i:02d} {CHT[i]}') for i in range(1, 10)]
    prev = seq[n - 1] if n > 1 else None
    nxt = seq[n + 1] if n < 9 else None
    if n == 5: nxt = ('05m_midterm_review.html', '중간 요약정리 및 퀴즈')
    if n == 6: prev = ('05m_midterm_review.html', '중간 요약정리 및 퀴즈')
    if n == 9: nxt = ('09f_final_review.html', '기말 요약정리 및 퀴즈')
    return dict(prev=prev, next=nxt)
def fix(P):
    for l in P['levels']:
        if l.get('math'): l['math']['try'] = l['math'].pop('try_')
    P.update(PN(int(P['num'])))
    return P
