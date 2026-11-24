#!/usr/bin/env python3
"""docs/AUDIT_REPORT.md(원자료와 다르게 쓴 곳) · docs/IMG_PROMPTS_all.md(표지 그림 지시문) 생성."""
import os, sys, re, importlib.util
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B)); PG = os.path.join(ROOT, 'src', 'pages')
sys.path.insert(0, PG)
def load(f):
    spec = importlib.util.spec_from_file_location('p', os.path.join(PG, f)); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m.P
strip = lambda s: re.sub('<[^>]+>', '', s)
pages = [load(f) for f in sorted(os.listdir(PG)) if f.startswith('p') and f.endswith('.py')]
os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
L = ['# 감사보고서 — 원자료와 다르게 쓴 곳', '', '노동경제학 연구실 v1.0 · 2026-11-25 · 글 안상선', '',
     '주 자료: 「노동경제학」 강의노트(2026-1학기, 1~11주차), 기말고사 대비 자료집, 추가 자료(01·03·04·06~08), 저자의 특별 부록 「생산함수와 AI 대체 시대」(05). 주 교재: Borjas, Labor Economics (8th ed.). 겹치는 자료는 한 번만 반영했습니다.', '',
     '원칙: 뜻이 불분명하거나 틀린 표현은 "원자료의 A를 이 페이지에서는 B로 바꿉니다" 형식으로 바꾸고, 각 쪽 바닥글에도 같은 문장을 적었습니다. 모든 예시값은 다시 계산했습니다.', '']
n = 0
for P in pages:
    if not P.get('changes'): continue
    L += [f'## {strip(P["title"])}', '', f'- 파일: `{P["file"]}`']
    for c in P['changes']:
        n += 1; L.append(f'- [{n:02d}] {strip(c)}')
    L.append('')
L += ['## 자료 중복 정리', '', '- 추가 자료 01(4장 40쪽)은 기말고사 대비 자료집 앞부분과 같아, 새 슬라이드(FIGURE 4-3 주 간 임금 수렴)만 반영했습니다.',
      '- 추가 자료 03(9주차 5장)·04(요약 슬라이드 5장)·06(10주차 7장)은 기말고사 대비 자료집과 같고, 07(11주차 8장)은 새 쪽 10장(이주 비용 역산·이민의 잉여·직업 매칭)을 반영했습니다.',
      '- 05(「생산함수와 AI 대체 시대」)는 저자가 직접 만든 특별 부록이라 다른 자료와 섞지 않고 별도 쪽(특별 부록, 04s_special_ai_substitution.html)으로 만들었고, CH04 3단계는 그 쪽으로 이어 둡니다.',
      '- 8·9주차 교재 스캔은 같은 5장이며, 6·10·11주차 교재 스캔은 교재 8판 PDF의 해당 장입니다.', '',
      '## 검산 기록', '',
      '- CH01 송유관: w = (120 + B − M) ÷ 4 → 30, 40, 30, 20, 30. 임금방정식 1.5 + 1.6 + 0.25 = 3.35, e^3.35 = 28.50.',
      '- CH02 실업률 40 ÷ 640 = 6.25%, 20 ÷ 620 = 3.23%. U = C·L, w 20, V 320, T 112 → L* = 64, h* = 48, C* = 1,280. 유보임금 320 ÷ 112 = 2.86.',
      '- CH03 w 20 → 30: L_B = √(81,920 ÷ 30) = 52.26, L₁ = 61.33 → 대체 +11.74, 소득 −9.07, 전체 +2.67시간. EITC(2017, 자녀 2명) 5,616 − 0.2106 × 11,660 = 3,160.',
      '- CH04 MP = 63 − 6n, p 2, w 60 → L* = 5. CD Y 100, w 10, r 20 → L 141.42, K 70.71. 선형 4L + 2K, r 6 → w* 12, r 3 → w* 6, L* 0, K* 10.',
      '- 특별 부록: 준선형 6√L + 2K, w 8, r 6 → L = 9 × 36 ÷ 256 = 1.27, K = (20 − 6.75) ÷ 2 = 6.63. 콥-더글러스 L = 20 ÷ √8 × √0.75 = 6.12, r 0.5 → 1.77. 실망실업 참여 (w_m − 2) ÷ 12 × 100: w_m 12 → 83, 6 → 33, 4 → 17.',
      '- CH05 두 지역 x = 70, 생산 3,750 → 3,950. 수요독점 E = 160/3 = 53.3, w = 9.33. m = 12 → E = 80. 이민 M 25: w 20 → 15, 잉여 62.5.',
      '- CH06 VSL 700 ÷ 0.0001 = 7,000,000. 해고 40,000 ÷ 1,600 = 25.',
      '- CH07 내부수익률(고졸 2,800, 대졸 4,000, 등록금 700, 18~65세) ≈ 7.3%. MRR 24 − 1.2s = 6 → 15년.',
      '- CH08 σ 0.6: 90-10 = e^1.538 = 4.66, 지니 = 2Φ(0.424) − 1 = 0.329. 프리미엄 1.45 × e^(1.5 × 0.4 ÷ 1.4) = 2.23.',
      '- CH09 (1.05 ÷ 0.05) × 16,470 ÷ 28,300 = 12.2배(교과서 어림 0.5 → 10.5배). 20년 이득 = 16,470 × 13.085 = 215,516.', '']
open(os.path.join(ROOT, 'docs', 'AUDIT_REPORT.md'), 'w', encoding='utf-8').write('\n'.join(L))

# 그림 지시문(docs/IMG_PROMPTS_all.md)은 make_genspark_pack.py가 만든다.
print('audit items', n)
