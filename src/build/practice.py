#!/usr/bin/env python3
"""마지막 장 · 실전 연습장 (practice/index.html) — 가계 상담소 · 공장 인사팀 · 노동부 정책실 · 진로 상담소."""
import os, sys, json, html
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
OUT = sys.argv[1] if len(sys.argv) > 1 else ROOT
SP = json.load(open(os.path.join(B, 'sprites.json')))
def spr(k):
    a = SP['alias'].get(k, k); return SP['img'][a]
NEED = ['doc_front', 'doc_judge', 'doc_think', 'asst_report', 'asst_smile', 'fly_point', 'fly_arms', 'robo_coin', 'robo_happy', 'robo_sigh', 'sia_start', 'moa_judge', 'x2_watch']
IMG = {k: spr(k) for k in NEED}

CSS = r'''
:root{--bg:#fff;--panel2:#f5f6f9;--rule:#d9dce5;--text:#1d2030;--muted:#545a6e;--green:#137a45;--blue:#2457b8;--red:#c0392b;--amber:#8f5f00;--violet:#6a3fc2;color-scheme:light}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:#fff;color:var(--text);font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif;line-height:1.75;font-size:16px}
header.top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 24px;border-bottom:1px solid var(--rule);flex-wrap:wrap;background:#fff;position:sticky;top:0;z-index:5}
header.top .brand{font-weight:800;color:var(--green);text-decoration:none}header.top nav a{margin-left:16px;color:var(--blue);font-size:14px}
main{max-width:1120px;margin:0 auto;padding:22px 20px 60px}
.eyebrow{font-size:13px;font-weight:700;color:var(--green);letter-spacing:.04em;margin:18px 0 4px}
h1{font-size:clamp(28px,4.6vw,44px);line-height:1.25;margin:4px 0 12px}.lead{font-size:18px;color:var(--muted);margin:0 0 18px}
.cast{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}
.cast div{border:1px solid var(--rule);border-radius:14px;padding:10px;display:flex;gap:10px;align-items:center;background:var(--panel2)}
.cast img,.say img{width:52px;height:52px;image-rendering:pixelated;object-fit:contain;flex:none}.cast b{display:block;font-size:14px}.cast span{font-size:13px;color:var(--muted)}
.howto{border-left:4px solid var(--green);background:#f2f8f4;padding:12px 16px;border-radius:0 10px 10px 0;margin:14px 0 22px;font-size:15px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0;position:sticky;top:58px;background:#fff;padding:8px 0;z-index:4}
.tabs button{font:inherit;font-size:15px;font-weight:700;border:1px solid var(--rule);background:#fff;border-radius:999px;padding:8px 16px;cursor:pointer;color:var(--text)}
.tabs button[aria-selected=true]{background:var(--text);color:#fff;border-color:var(--text)}
.sim{display:none;border:1px solid var(--rule);border-radius:20px;padding:22px;margin-top:10px;background:#fff}.sim.on{display:block}
.sim h2{margin:0 0 4px;font-size:26px}.sim .q{color:var(--muted);margin:0 0 14px}
.scene{background:var(--panel2);border-radius:12px;padding:12px 16px;font-size:15px;margin-bottom:16px}
.grid{display:grid;grid-template-columns:320px 1fr;gap:20px}
.controls{border:1px solid var(--rule);border-radius:14px;padding:14px;background:#fff;align-self:start}
.controls h3{font-size:15px;margin:6px 0 8px}.controls h3.env{color:var(--green)}.controls h3.me{color:var(--blue)}
.ctl{margin:10px 0}.ctl label{display:flex;justify-content:space-between;font-size:14px;font-weight:600;gap:8px}
.ctl output{font-variant-numeric:tabular-nums}.ctl.env output{color:var(--green)}.ctl.me output{color:var(--blue)}
.ctl input[type=range]{width:100%}.ctl.env input{accent-color:var(--green)}.ctl.me input{accent-color:var(--blue)}
.score{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.score div{border:1px solid var(--rule);border-radius:12px;padding:10px 12px}.score b{display:block;font-size:22px;font-variant-numeric:tabular-nums}.score span{font-size:13px;color:var(--muted)}
.score .good b{color:var(--green)}.score .bad b{color:var(--red)}.score .mid b{color:var(--amber)}.score .info b{color:var(--blue)}
.charts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.charts svg{width:100%;height:auto;border:1px solid var(--rule);border-radius:12px;background:#fff}
.talk{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
.say{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--rule);border-radius:12px;padding:8px 10px}.say b{font-size:13px}.say p{margin:0;font-size:14px}
.missions{border:1px solid var(--rule);border-radius:14px;padding:12px 16px;margin-top:10px}.missions h3{margin:0 0 6px;font-size:16px}
.missions li{margin:6px 0;font-size:15px}.missions li .st{display:inline-block;min-width:64px;font-size:12px;font-weight:700;border-radius:999px;padding:1px 8px;margin-right:6px;background:#eef0f5;color:var(--muted);text-align:center}
.missions li.done .st{background:#e3f3ea;color:var(--green)}
.back{font-size:14px;margin-top:10px}.back a{color:var(--blue);margin-right:12px}
.wrapup{border:2px solid var(--green);border-radius:16px;padding:16px 20px;margin-top:26px}
.notice{font-size:13px;color:var(--amber);background:#fff8e6;border-radius:8px;padding:8px 12px}
footer{border-top:1px solid var(--rule);margin-top:30px;padding-top:14px;font-size:13px;color:var(--muted)}
@media (max-width:860px){.grid,.charts,.talk{grid-template-columns:1fr}.cast{grid-template-columns:repeat(2,1fr)}.score{grid-template-columns:repeat(2,1fr)}}
'''

SCENES = [
 dict(id='home', tab='① 가계 상담소', title='가계 상담소 — 일주일에 몇 시간 일할까',
      q='시급과 용돈(비근로소득)이 주어졌을 때 만족이 가장 큰 근로시간은? 일하지 않는 게 나을 때도 있을까요?',
      scene='상담자는 주당 112시간을 일과 여가로 나눠요. 효용은 U = C × L(소비 × 여가), 예산은 C = w × 근로시간 + V예요. 시급 w와 비근로소득 V는 상담자가 바꿀 수 없는 조건이에요.',
      env=[('w', '시급 w(달러)', 2, 40, 1, 20, ''), ('V', '비근로소득 V(달러)', 0, 3000, 20, 320, '')], me=[('h', '주당 근로시간', 0, 80, 1, 30, '')],
      missions=['시급 20·V 320에서 효용이 가장 큰 근로시간 찾기 — 오차 1시간 이내', '함정 관찰: V를 올려 유보임금(V ÷ 112)이 시급보다 커지게 한 뒤 근로시간 0이 최선인 것 확인하기(근로시간을 1 이하로)', '시급이나 V를 바꾼 뒤 최적 근로시간 다시 찾기'],
      back=[('02_labor_supply.html#lv3', 'CH02 최적 선택'), ('03_labor_supply_policy.html#lv1', 'CH03 대체·소득효과')]),
 dict(id='factory', tab='② 공장 인사팀', title='공장 인사팀 — 몇 명을 뽑을까',
      q='평균 생산성이 아니라 마지막 한 명의 가치로 정하면 몇 명일까요?',
      scene='설비는 고정이에요. n번째 노동자의 한계생산은 63 − 6n개(1번째 57개, 2번째 51개 …). 제품 가격 p와 시급 w는 시장이 정해요. 이윤 = p × 생산량 − w × 고용(설비비 제외).',
      env=[('p', '제품 가격 p(달러)', 1, 4, .25, 2, ''), ('w', '시급 w(달러)', 20, 120, 2, 60, '')], me=[('L', '고용(명)', 0, 10, 1, 3, '')],
      missions=['p 2·시급 60에서 이윤이 가장 큰 고용 찾기', '함정 관찰: 8명 이상 뽑아 이윤이 최대보다 작아지는 것 확인하기(평균 생산성 함정)', '제품 가격이나 시급을 바꾼 뒤 이윤 최대 고용 다시 찾기'],
      back=[('04_labor_demand.html#lv1', 'CH04 VMP = w'), ('04_labor_demand.html#lv3', 'CH04 AI 대체')]),
 dict(id='ministry', tab='③ 노동부 정책실', title='노동부 정책실 — 최저임금을 얼마로 할까',
      q='같은 최저임금이 어떤 시장에선 고용을 늘리고 어떤 시장에선 줄여요. 고용을 가장 크게 하는 최저임금은?',
      scene='노동공급 w = 4 + E/10, 노동수요(VMP) w = 20 − E/10. 시장이 경쟁시장(0)인지 고용주가 하나인 수요독점(1)인지는 정책실이 바꿀 수 없어요. 판정은 고용된 사람 수와 실업이에요.',
      env=[('mono', '시장(0 경쟁 · 1 수요독점)', 0, 1, 1, 1, '')], me=[('m', '최저임금 m(0 = 없음)', 0, 18, .25, 0, '')],
      missions=['수요독점에서 고용이 가장 커지는 최저임금 찾기 — 오차 0.25달러 이내', '함정 관찰: 경쟁시장에서 최저임금을 14달러 이상으로 올려 실업이 생기는 것 확인하기', '수요독점에서 최저임금을 16달러 이상으로 올려 고용이 최저임금 없을 때(53.3명)보다 줄어드는 것 확인하기'],
      back=[('05_labor_market_equilibrium.html#lv2', 'CH05 최저임금'), ('04_labor_demand.html#lv1', 'CH04 노동수요')]),
 dict(id='career', tab='④ 진로 상담소', title='진로 상담소 — 학교를 몇 년 다닐까',
      q='1년 더 공부할 때의 수익률이 할인율과 같아지는 곳은 어디일까요?',
      scene='1년 더 다닐 때 임금이 오르는 비율(한계수익률)은 MRR(s) = (24 + 능력) − 1.2s(%)예요. 할인율 r과 능력은 상담자의 조건이에요. 판정은 순이득 지수 G(s) = Σ(MRR − r)예요(8년을 기준 0).',
      env=[('r', '할인율 r(%)', 2, 14, .5, 6, ''), ('ab', '능력(MRR을 올리는 정도, %p)', -3, 3, .5, 0, '')], me=[('s', '학교교육 연수', 8, 20, .5, 12, '')],
      missions=['할인율 6%·능력 0에서 순이득이 가장 큰 연수 찾기 — 오차 0.5년 이내', '함정 관찰: 20년(최대)을 골라 순이득이 최적보다 작은 것 확인하기', '할인율이나 능력을 바꾼 뒤 최적 연수 다시 찾기'],
      back=[('07_education.html#lv2', 'CH07 정지규칙'), ('07_education.html#lv1', 'CH07 현재가치')]),
]

JS = r'''
var IMG=__IMG__;
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function f(v,d){return Number(v).toLocaleString('ko-KR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0})}
function svg(w,h,body){return '<svg viewBox="0 0 '+w+' '+h+'" role="img">'+body+'</svg>'}
function tw(t,z){var w=0;String(t).split('').forEach(function(ch){w+=/[\u3131-\uD79D]/.test(ch)?z*0.98:/[A-Z0-9%$]/.test(ch)?z*0.62:z*0.5});return w}
function chart(o){var W=460,H=280,L=46,R=12,T=30,Bt=34,pw=W-L-R,ph=H-T-Bt,BX=[];function hit(b){return BX.some(function(a){return b.x<a.x+a.w&&b.x+b.w>a.x&&b.y<a.y+a.h&&b.y+b.h>a.y})}function X(v){return L+(v-o.x0)/(o.x1-o.x0)*pw}function Y(v){return T+ph-(v-o.y0)/(o.y1-o.y0)*ph}
 var s='<text x="'+L+'" y="18" font-size="13" font-weight="700" fill="#1d2030">'+o.title+'</text>';BX.push({x:L,y:5,w:tw(o.title,13),h:16});if(o.key)BX.push({x:L+pw-tw(o.key,11),y:7,w:tw(o.key,11),h:14});
 for(var i=0;i<=4;i++){var yv=o.y0+(o.y1-o.y0)*i/4,y=Y(yv);var yt=f(yv,o.yd||0);BX.push({x:L-6-tw(yt,10),y:y-5,w:tw(yt,10),h:11});s+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+y+'" y2="'+y+'" stroke="#eceef4"/><text x="'+(L-6)+'" y="'+(y+4)+'" font-size="10" text-anchor="end" fill="#545a6e">'+yt+'</text>'}
 for(var i=0;i<=4;i++){var xv=o.x0+(o.x1-o.x0)*i/4,x=X(xv);var xt=f(xv,o.xd||0),xw=tw(xt,10);BX.push({x:i?x-xw/2:x+2,y:T+ph+4,w:xw,h:11});s+='<text x="'+(i?x:x+2)+'" y="'+(T+ph+14)+'" font-size="10" text-anchor="'+(i?'middle':'start')+'" fill="#545a6e">'+xt+'</text>'}
 s+='<line x1="'+L+'" x2="'+L+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#999"/><line x1="'+L+'" x2="'+(L+pw)+'" y1="'+(T+ph)+'" y2="'+(T+ph)+'" stroke="#999"/>';
 s+='<text x="'+(L+pw)+'" y="'+(H-4)+'" font-size="10" text-anchor="end" fill="#545a6e">'+o.xl+'</text>';
 (o.lines||[]).forEach(function(l){var p=[],n=80;for(var i=0;i<=n;i++){var x=o.x0+(o.x1-o.x0)*i/n,y=l.f(x);if(isFinite(y)&&y>=o.y0-1e-9&&y<=o.y1+1e-9)p.push(X(x).toFixed(1)+','+Y(y).toFixed(1));else if(p.length&&p[p.length-1]!=='M')p.push('M')}var d='',st=true;p.forEach(function(q){if(q==='M'){st=true;return}d+=(st?'M':'L')+q+' ';st=false});s+='<path d="'+d+'" fill="none" stroke="'+l.c+'" stroke-width="'+(l.w||2.4)+'"'+(l.dash?' stroke-dasharray="5 4"':'')+'/>'});
 (o.vlines||[]).forEach(function(v){s+='<line x1="'+X(v.x)+'" x2="'+X(v.x)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="'+v.c+'" stroke-width="'+(v.w||2.4)+'"'+(v.dash?' stroke-dasharray="4 3"':'')+'/>'});
 (o.hlines||[]).forEach(function(v){s+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+Y(v.y)+'" y2="'+Y(v.y)+'" stroke="'+v.c+'" stroke-width="1.6" stroke-dasharray="5 4"/>'+(v.l?(function(){var yy=Y(v.y)-4<T+10?Y(v.y)+12:Y(v.y)-4;BX.push({x:L+pw-2-tw(v.l,10),y:yy-9,w:tw(v.l,10),h:12});return '<text x="'+(L+pw-2)+'" y="'+yy+'" font-size="10" text-anchor="end" fill="'+v.c+'">'+v.l+'</text>'})():'')});
 var DP=(o.dots||[]).map(function(d){var x=X(Math.max(o.x0,Math.min(o.x1,d.x))),y=Y(Math.max(o.y0,Math.min(o.y1,d.y)));BX.push({x:x-6,y:y-6,w:12,h:12});s+='<circle cx="'+x+'" cy="'+y+'" r="5.5" fill="'+d.c+'" stroke="#fff" stroke-width="1.5"/>';return {d:d,x:x,y:y}});
 DP.forEach(function(q){var d=q.d,w=tw(d.l,11),pref=(d.dx||8)<0?-1:1,C=[];[-8,10,-20,22,-32,34].forEach(function(dy){C.push([pref,dy]);C.push([-pref,dy])});var pick=null;
  for(var k=0;k<C.length;k++){var lx=C[k][0]>0?q.x+8:q.x-8-w,ly=q.y+C[k][1];if(lx<2||lx+w>W-2||ly-10<2||ly+2>H-2)continue;var b={x:lx,y:ly-10,w:w,h:13};if(!hit(b)){pick=[lx,ly,b];break}}
  if(!pick){var lx=Math.max(2,Math.min(W-2-w,q.x+8)),ly=Math.max(12,Math.min(H-4,q.y-8));pick=[lx,ly,{x:lx,y:ly-10,w:w,h:13}]}
  BX.push(pick[2]);s+='<text x="'+pick[0]+'" y="'+pick[1]+'" font-size="11" font-weight="700" fill="'+d.c+'">'+d.l+'</text>'});
 if(o.key)s+='<text x="'+(L+pw)+'" y="18" font-size="11" text-anchor="end" fill="#545a6e">'+o.key+'</text>';
 return svg(W,H,s)}
function say(who,mood,name,t){return '<div class="say"><img src="'+IMG[who+'_'+mood]+'" alt=""><div><b>'+name+'</b><p>'+t+'</p></div></div>'}
function score(items){return items.map(function(k){return '<div class="'+k[2]+'"><b>'+k[0]+'</b><span>'+k[1]+'</span></div>'}).join('')}
var MODEL={
 home:function(v){var T=112,hs=Math.max(0,T/2-v.V/(2*v.w)),U=function(h){return (v.w*h+v.V)*(T-h)},u=U(v.h),us=U(hs),wr=v.V/T,near=Math.abs(v.h-hs)<=1.0001;
  return {sc:[[f(hs,1)+'시간','최적 근로시간',hs>0?'info':'mid'],[f(u/1000,1)+'천','내 효용 U',near?'good':'mid'],[f(100*u/us,1)+'%','최적 대비 효용',near?'good':'bad'],['$'+f(wr,2),'유보임금 V ÷ 112',v.w>wr?'good':'bad']],
   c1:chart({title:'예산선(파랑)과 지금 점의 무차별곡선(보라)',x0:0,x1:120,y0:0,y1:Math.max(1000,(v.w*T+v.V)*1.1),xl:'여가 L(시간)',lines:[{f:function(L){return L<=T?v.w*(T-L)+v.V:NaN},c:'#2457b8'},{f:function(L){return u/L},c:'#6a3fc2',w:1.6}],dots:[{x:T-v.h,y:v.w*v.h+v.V,c:'#8f5f00',l:'나'},{x:T-hs,y:v.w*hs+v.V,c:'#137a45',l:'최적',dx:-8}]}),
   c2:chart({title:'근로시간별 효용(천)',x0:0,x1:80,y0:0,y1:Math.max(10,us/1000*1.15),xl:'주당 근로시간',lines:[{f:function(h){return U(h)/1000},c:'#137a45'}],dots:[{x:v.h,y:u/1000,c:'#8f5f00',l:'나'},{x:hs,y:us/1000,c:'#c0392b',l:'최대',dx:-8}]}),
   talk:[say('doc',near?'judge':'think','박사',near?'마지막 1시간의 휴식과 그 시간의 소득이 같아진 곳이에요(MRS = w).':(hs===0?'시급이 유보임금보다 낮아요. 이럴 땐 일하지 않는 게 최선(코너해)이에요.':'근로시간을 '+f(hs,1)+'시간 쪽으로 옮겨 보세요.')),say('asst','report','하루','지금 효용은 최적의 '+f(100*u/us,1)+'%예요. MRS = '+f((v.w*v.h+v.V)/Math.max(1,T-v.h),1)+', 시급 '+v.w+'.'),say('fly','point','초파리 조교',v.V/T>v.w?'유보임금이 시급보다 높아. 일할수록 손해야.':'V를 크게 올려 봐. 어느 순간 일하지 않는 게 최선이 돼.'),say('robo',v.h>hs+5?'happy':'coin','주판봇 조교','많이 일할수록 돈이 많으니 무조건 최고 아냐?')],
   m:[v.w===20&&v.V===320&&near,wr>v.w&&hs===0&&v.h<=1,(v.w!==20||v.V!==320)&&hs>0&&near]}},
 factory:function(v){var q=function(n){return 60*n-3*n*n},mp=function(n){return 63-6*n},Ls=0;for(var n=1;n<=10;n++){if(v.p*mp(n)>=v.w)Ls=n;else break}var pr=function(n){return v.p*q(n)-v.w*n},near=v.L===Ls;
  return {sc:[[Ls+'명','이윤 최대 고용','info'],[f(pr(v.L),0),'내 이윤(달러)',near?'good':'mid'],[f(pr(Ls),0),'최대 이윤(달러)','info'],[v.L?f(v.p*mp(v.L),0):'—',v.L+'번째의 VMP',v.L&&v.p*mp(v.L)<v.w?'bad':'good']],
   c1:chart({title:'n번째 노동자의 VMP(초록)와 시급(주황)',x0:0,x1:10,y0:0,y1:Math.max(v.w,v.p*57)*1.15,xl:'몇 번째 노동자',lines:[{f:function(x){var n=Math.max(1,Math.ceil(x));return v.p*mp(n)},c:'#137a45'}],hlines:[{y:v.w,c:'#8f5f00',l:'시급'}],dots:[{x:v.L,y:v.L?v.p*mp(v.L):v.p*57,c:'#2457b8',l:'나'}]}),
   c2:chart({title:'고용별 이윤',x0:0,x1:10,y0:Math.min(0,pr(10)),y1:Math.max(10,pr(Ls)*1.2),xl:'고용(명)',lines:[{f:pr,c:'#2457b8'}],dots:[{x:v.L,y:pr(v.L),c:'#8f5f00',l:'나'},{x:Ls,y:pr(Ls),c:'#c0392b',l:'최대',dx:-8}]}),
   talk:[say('doc',near?'judge':'think','박사',near?'마지막 노동자의 VMP가 시급 이상인 곳까지 뽑았어요.':'VMP 막대가 시급선 아래로 내려가는 곳을 보세요.'),say('asst','report','하루',Ls+'번째 VMP는 '+f(v.p*mp(Math.max(1,Ls)),0)+', '+(Ls+1)+'번째는 '+f(v.p*mp(Ls+1),0)+'이에요. 시급은 '+v.w+'.'),say('fly','point','초파리 조교','평균 생산성 말고 마지막 한 명이 더 만드는 가치를 봐.'),say('robo',v.L>Ls?'happy':'coin','주판봇 조교','평균 36개씩 만드는데 많이 뽑을수록 좋지!')],
   m:[v.p===2&&v.w===60&&near,v.L>=8&&pr(v.L)<pr(Ls)-.5,(v.p!==2||v.w!==60)&&near]}},
 ministry:function(v){var r=minres(v.mono,v.m),best=v.mono?12:0,near=v.mono?Math.abs(v.m-12)<=.2501:r.u===0,ms=[];
  return {sc:[[f(r.E,1)+'명','고용',r.E>=r.E0-.01?'good':'bad'],['$'+f(r.w,2),'시급','info'],[f(r.u,1)+'명','실업',r.u>0?'bad':'good'],[(r.E-r.E0>=0?'+':'')+f(r.E-r.E0,1),'최저임금 없을 때 대비',r.E>=r.E0?'good':'bad']],
   c1:chart({title:'공급(빨강)·수요(파랑)'+(v.mono?'·한계노동비용(보라)':''),x0:0,x1:160,y0:0,y1:24,xl:'고용 E',lines:[{f:function(E){return 4+E/10},c:'#c0392b'},{f:function(E){return 20-E/10},c:'#2457b8'}].concat(v.mono?[{f:function(E){return 4+E/5},c:'#6a3fc2',dash:1}]:[]),hlines:v.m?[{y:v.m,c:'#8f5f00',l:'최저임금'}]:[],dots:[{x:r.E,y:r.w,c:'#137a45',l:'지금'}]}),
   c2:chart({title:'최저임금별 고용',x0:0,x1:18,y0:0,y1:100,xl:'최저임금',lines:[{f:function(m){return minres(v.mono,m).E},c:'#137a45'}],dots:[{x:v.m,y:r.E,c:'#8f5f00',l:'지금'}]}),
   talk:[say('doc',v.mono&&near?'judge':'think','박사',v.mono?(near?'수요독점에서 고용이 가장 큰 최저임금이에요. 경쟁 임금과 같아요.':'수요독점 임금(9.33)과 경쟁 임금(12) 사이에서 고용이 늘어요.'):(v.m>12?'경쟁시장에서 균형(12)보다 높은 최저임금은 실업을 만들어요.':'경쟁시장에서 12 이하의 최저임금은 효과가 없어요.')),say('asst','report','하루','고용 '+f(r.E,1)+'명, 실업 '+f(r.u,1)+'명이에요.'),say('fly','point','초파리 조교','시장 슬라이더를 바꿔 같은 최저임금의 결과를 비교해 봐.'),say('robo','coin','주판봇 조교',v.mono?'최저임금은 무조건 일자리를 줄이는데…?':'최저임금은 높을수록 노동자에게 좋겠지!')],
   m:[v.mono===1&&Math.abs(v.m-12)<=.2501,v.mono===0&&v.m>=14&&r.u>0,v.mono===1&&v.m>=16&&r.E<r.E0]}},
 career:function(v){var A=24+v.ab,ss=Math.max(8,Math.min(20,(A-v.r)/1.2)),G=function(s){return (A-v.r)*(s-8)-.6*(s*s-64)},near=Math.abs(v.s-ss)<=.5001;
  return {sc:[[f(ss,1)+'년','최적 학교교육 s*','info'],[f(A-1.2*v.s,1)+'%','내 연수의 MRR',A-1.2*v.s>=v.r?'good':'bad'],[f(G(v.s),1),'내 순이득 지수',near?'good':'mid'],[f(G(ss),1),'최대 순이득 지수','info']],
   c1:chart({title:'한계수익률(초록)과 할인율(빨강)',x0:8,x1:20,y0:0,y1:20,xl:'학교교육 연수',lines:[{f:function(s){return A-1.2*s},c:'#137a45'}],hlines:[{y:v.r,c:'#c0392b',l:'할인율'}],dots:[{x:v.s,y:A-1.2*v.s,c:'#8f5f00',l:'나'},{x:ss,y:A-1.2*ss,c:'#2457b8',l:'s*',dx:-8}]}),
   c2:chart({title:'연수별 순이득 지수',x0:8,x1:20,y0:Math.min(0,G(20),G(8)),y1:Math.max(5,G(ss)*1.2),xl:'학교교육 연수',lines:[{f:G,c:'#2457b8'}],dots:[{x:v.s,y:G(v.s),c:'#8f5f00',l:'나'},{x:ss,y:G(ss),c:'#c0392b',l:'최대',dx:-8}]}),
   talk:[say('doc',near?'judge':'think','박사',near?'마지막 1년의 수익률이 할인율과 같아졌어요(정지규칙).':'MRR이 할인율보다 크면 더, 작으면 덜 다니세요.'),say('asst','report','하루','지금 MRR '+f(A-1.2*v.s,1)+'%, 할인율 '+v.r+'%. 최적은 '+f(ss,1)+'년이에요.'),say('fly','point','초파리 조교','할인율이 높으면(돈이 급하면) 일찍 멈추는 게 합리적이야.'),say('robo',v.s>=19?'happy':'coin','주판봇 조교','공부는 많이 할수록 무조건 좋지! 박사까지!')],
   m:[v.r===6&&v.ab===0&&near,v.s>=20&&G(v.s)<G(ss)-1,(v.r!==6||v.ab!==0)&&near]}}};
function minres(mono,m){var Es=function(w){return Math.max(0,10*(w-4))},Ed=function(w){return Math.max(0,10*(20-w))},E0=mono?160/3:80,w0=mono?4+E0/10:12,E,w,u;
 if(mono){if(m>w0){if(m<=12){E=Es(m);w=m;u=0}else{E=Ed(m);w=m;u=Es(m)-E}}else{E=E0;w=w0;u=0}}else{if(m>12){E=Ed(m);w=m;u=Es(m)-E}else{E=80;w=12;u=0}}return {E:E,w:w,u:u,E0:E0}}
var DONE={},TOUCH={};
function render(id){var box=$('#'+id),v={};$$('input',box).forEach(function(i){v[i.name]=+i.value;$('output[for='+i.id+']').textContent=i.value});var o=MODEL[id](v);
 $('.score',box).innerHTML=score(o.sc);$('.c1',box).innerHTML=o.c1;$('.c2',box).innerHTML=o.c2;$('.talk',box).innerHTML=o.talk.join('');
 DONE[id]=DONE[id]||[false,false,false];if(TOUCH[id])o.m.forEach(function(x,i){if(x)DONE[id][i]=true});
 $$('.missions li',box).forEach(function(li,i){li.classList.toggle('done',DONE[id][i]);$('.st',li).textContent=DONE[id][i]?'통과 ✓':'도전 중'});
 var n=Object.keys(MODEL).reduce(function(s,k){return s+(DONE[k]||[]).filter(Boolean).length},0);$('#total').textContent=n+' / 12'}
function show(id){$$('.sim').forEach(function(s){s.classList.toggle('on',s.id===id)});$$('.tabs button').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.t===id))});if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);render(id)}
$$('.tabs button').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t)})});
$$('.sim').forEach(function(s){$$('input',s).forEach(function(i){i.addEventListener('input',function(){TOUCH[s.id]=true;render(s.id)})});render(s.id)});
window.__MODEL=MODEL;
show((location.hash||'').slice(1) in MODEL?location.hash.slice(1):'home');
'''

def ctl(prefix, cls, items):
    o = []
    for k, lab, a, b, st, v, _ in items:
        i = f'{prefix}-{k}'
        o.append(f'<div class="ctl {cls}"><label for="{i}">{lab}<output for="{i}">{v}</output></label><input type="range" id="{i}" name="{k}" min="{a}" max="{b}" step="{st}" value="{v}"></div>')
    return ''.join(o)

def page():
    e = html.escape
    tabs = ''.join(f'<button type="button" role="tab" data-t="{s["id"]}" aria-selected="false">{s["tab"]}</button>' for s in SCENES)
    sims = []
    for s in SCENES:
        ms = ''.join(f'<li><span class="st">도전 중</span>{m}</li>' for m in s['missions'])
        bk = ''.join(f'<a href="../{h}">{t}</a>' for h, t in s['back'])
        sims.append(f'''<section class="sim" id="{s["id"]}" role="tabpanel" aria-label="{e(s["title"])}"><h2>{s["title"]}</h2><p class="q">{s["q"]}</p><div class="scene">{s["scene"]}</div>
<div class="grid"><div class="controls"><h3 class="env">시장 환경(초록)</h3>{ctl(s["id"], "env", s["env"])}<h3 class="me">내 결정(파랑)</h3>{ctl(s["id"], "me", s["me"])}</div>
<div><div class="score"></div><div class="charts"><div class="c1"></div><div class="c2"></div></div></div></div>
<div class="talk"></div><div class="missions"><h3>미션 3개 — 조작해야 판정해요</h3><ol style="list-style:none;padding:0;margin:0">{ms}</ol></div><p class="back">배운 곳 다시 보기: {bk}</p></section>''')
    cast = ''.join(f'<div><img src="{IMG[k]}" alt=""><span><b>{n}</b>{r}</span></div>' for k, n, r in [('doc_front', '박사', '판정과 정리'), ('asst_smile', '하루', '숫자 보고'), ('fly_point', '초파리 조교', '의심과 힌트'), ('robo_coin', '주판봇 조교', '성급한 확신')])
    return f'''<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>마지막 장 · 실전 연습장 — 노동경제학 연구실</title>
<meta name="description" content="가계 상담소·공장 인사팀·노동부 정책실·진로 상담소를 직접 운영하며 최적 근로시간, VMP = w, 최저임금과 수요독점, 교육의 정지규칙을 연습하는 시뮬레이터. 한국기술교육대학교 고용정책과 노동경제학 2026년 1학기 강의 기반.">
<meta property="og:title" content="마지막 장 · 실전 연습장 — 노동경제학 연구실"><meta property="og:image" content="https://adminmrobo.github.io/labor_economics/assets/og/cover_prac.jpg">
<style>{CSS}</style></head>
<body>
<header class="top"><a class="brand" href="../index.html">노동경제학 연구실</a><nav><a href="../index.html">목차</a><a href="../09f_final_review.html">기말 정리</a><a href="../tower.html">장터 보기</a><a href="#wrap">정리</a></nav></header>
<main>
<p class="eyebrow">마지막 장 · 실전 연습장 · 장터 끝 광장</p>
<h1>가계·공장·정책실·진로 상담소를<br>직접 운영해 보세요</h1>
<p class="lead">아홉 강의에서 배운 노동공급, 노동수요, 최저임금과 시장 구조, 교육 투자를 네 곳에서 연습합니다. 슬라이더를 움직이면 성적표와 그래프, 강의실 식구들의 말이 바로 바뀌어요.</p>
<div class="cast">{cast}</div>
<p class="howto"><b>사용법</b> · 초록 슬라이더는 내가 바꿀 수 없는 시장 환경, 파랑 슬라이더는 내 결정이에요. 미션은 슬라이더를 직접 움직인 뒤에만 판정해요. 주소 끝에 #home, #factory, #ministry, #career를 붙이면 그 장면이 바로 열려요. 진행 기록은 이 탭에서만 유지돼요. <b>통과한 미션: <span id="total">0 / 12</span></b></p>
<nav class="tabs" role="tablist" aria-label="장면 고르기">{tabs}</nav>
{"".join(sims)}
<section class="wrapup" id="wrap"><h2>마무리 — 네 장면이 함께 묻는 질문</h2>
<p>가계의 근로시간, 공장의 고용, 정책실의 최저임금, 진로 상담소의 학교교육 연수는 모두 "마지막 한 단위"를 비교해 정했어요. 마지막 1시간의 휴식과 그 시간의 소득, 마지막 한 명의 VMP와 시급, 최저임금이 고용주의 한계노동비용을 바꾸는 방식, 마지막 1년의 수익률과 할인율. 그리고 네 곳 모두 "많이, 높게"가 답이 아니었습니다.</p>
<p class="notice">모형의 한계: 모든 숫자는 교육용 예시이며 단순한 효용함수와 직선 수요·공급을 가정했어요. 실제 근로시간 선택·채용·최저임금 효과·교육 수익은 추정이 필요하고 사람과 시장마다 다릅니다. 경영·정책·진로 권고가 아닙니다.</p></section>
<footer>본 강의는 한국기술교육대학교 고용정책과의 노동경제학 2026년 1학기 강의를 기반으로 제작됐습니다.<br>글 · 안상선 (<a href="https://www.ahnboat.xyz" target="_blank" rel="noopener">www.ahnboat.xyz</a>) · (주)M-Robo 대표 · 노동경제학 연구실 실전 연습장 v1.0 · 2026-11-25<br>캐릭터 이름·설정·그림의 저작권은 안상선(개인)에게 있으며 허락 없이 쓸 수 없습니다.</footer>
</main>
<script>{JS.replace('__IMG__', json.dumps(IMG))}</script>
</body></html>'''

if __name__ == '__main__':
    d = os.path.join(OUT, 'practice'); os.makedirs(d, exist_ok=True)
    p = os.path.join(d, 'index.html'); import pxfix; open(p, 'w', encoding='utf-8').write(pxfix.apply(page())); print(p, os.path.getsize(p) // 1024, 'KB')
