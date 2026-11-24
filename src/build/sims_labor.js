/* 노동경제학 연구실 실험 모듈 (설명용 모형, 숫자는 예시값) */
function lbarPlot(c,H,title,items,max,sub){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);txt(ctx,title,16,18,COL.text,13,'left',true);if(sub)txt(ctx,sub,16,34,COL.muted,11,'left');
  var m=max||Math.max.apply(null,items.map(function(i){return Math.abs(i.v)}).concat([1]))*1.15;bars(ctx,24,H-28,W-48,H-(sub?80:64),items,m);
  var gw=(W-48)/items.length;items.forEach(function(it,i){if(it.n)fitLab(ctx,it.n,24+gw*i+gw/2,H-28+16,gw-6,COL.muted,11)});return {ctx:ctx,W:W}}
function pc(v,d){return f1(v*100,d==null?1:d)+'%'}
function usd(v){return '$'+nf(Math.round(v))}
function bisect(f,lo,hi,n){for(var i=0;i<(n||80);i++){var m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return (lo+hi)/2}
function Phi(z){return normCdf(z)}
function PhiInv(p){var a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],cc=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416];
  var q,r;if(p<.02425){q=Math.sqrt(-2*Math.log(p));return (((((cc[0]*q+cc[1])*q+cc[2])*q+cc[3])*q+cc[4])*q+cc[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  if(p>1-.02425){q=Math.sqrt(-2*Math.log(1-p));return -(((((cc[0]*q+cc[1])*q+cc[2])*q+cc[3])*q+cc[4])*q+cc[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  q=p-.5;r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}

/* ===== CH01 노동경제학이란 ===== */
/* 알래스카 송유관: 수요 충격과 노동 이동 (수요 E = 100 − 2w + B, 공급 E = 2w − 20 + M) */
function alaskaEq(B,M){var w=(120+B-M)/4;return {w:w,E:100+B-2*w}}
SIMS.alaska=function(el,cfg){var c=S0(el,cfg,280,'알래스카 송유관 공사: 수요 충격과 노동자 이동'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var B=40,share=100,st=1;
  buttons(row,'시점',[[0,'① 공사 전'],[1,'② 공사 시작(단기)'],[2,'③ 노동자 유입 후'],[3,'④ 완공 직후'],[4,'⑤ 떠난 뒤']],st,function(v){st=v;draw()});
  S(row,'공사로 늘어난 노동수요 B(명)',10,60,5,B,null,function(v){B=v;draw()});S(row,'임금 격차를 메우는 유입 비율',0,100,10,share,function(v){return v+'%'},function(v){share=v;draw()});
  function draw(){var M=B*share/100,b=[0,B,B,0,0][st],m=[0,0,M,M,0][st],e=alaskaEq(b,m),e0=alaskaEq(0,0);
    var P=plot(c,280,{xlo:0,xhi:140,ylo:0,yhi:60,xl:'고용(명)',yl:'시급(달러)',title:'파랑 노동수요 · 빨강 노동공급 · 점 = 지금 균형'});
    P.fn(function(E){return (100+b-E)/2},COL.s,2.4);P.fn(function(E){return (E+20-m)/2},COL.r,2.4);
    if(b||m){P.fn(function(E){return (100-E)/2},COL.muted,1.2,[4,4]);P.fn(function(E){return (E+20)/2},COL.muted,1.2,[4,4])}
    P.dot(e0.E,e0.w,COL.muted,4,'처음',-8,14);P.dot(e.E,e.w,COL.g,6,'지금');stamp(P.ctx,P.W,'예시값');
    K([[usd(e.w),'균형 시급',e.w>e0.w?'a':e.w<e0.w?'r':'g'],[f1(e.E,0)+'명','고용',e.E>e0.E?'g':'i'],[f1(m,0)+'명','다른 지역에서 온 노동자','m'],[['공사 전','단기 수요 충격','공급의 반응','수요 감소','장기 균형'][st],'단계','i']]);
    E('수요 100 − 2w + '+b+' = 공급 2w − 20 + '+f1(m,0)+' → w = (120 + '+b+' − '+f1(m,0)+') ÷ 4 = <i>'+f1(e.w,1)+'</i>');
    I([[st===1?'a':st===3?'r':'i',['처음 균형은 시급 30달러, 고용 40명이에요.','공사로 노동수요가 오른쪽으로 옮겨 가 시급이 '+usd(e.w)+'로 뛰었어요. 지역 안 노동자만으로는 금방 늘릴 수 없어요.','높은 임금 소식이 퍼져 다른 지역 노동자가 들어왔어요. 공급이 오른쪽으로 옮겨 시급이 다시 내려가요.','공사가 끝나 수요는 원래대로인데 들어온 노동자는 아직 남아 있어요. 시급이 처음보다 낮은 '+usd(e.w)+'까지 내려가요.','노동자들이 떠나 공급도 원래대로 돌아왔어요. 시급과 고용이 처음 균형으로 돌아왔어요.'][st]],['i','노동수요는 송유관(최종 생산물)이 필요해서 생긴 파생수요예요. 임금은 수요와 공급이 함께 정하고, 노동자의 이동이 지역 간 차이를 메워요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 임금방정식 log w = b0 + b1·edu + b2·exper */
SIMS.mincer=function(el,cfg){var c=S0(el,cfg,260,'임금방정식: 교육과 경력이 시급에 주는 효과'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var b0=1.5,b1=.10,b2=.05,ed=16,ex=5;
  S(row,'교육 연수 edu',9,20,1,ed,null,function(v){ed=v;draw()});S(row,'경력 연수 exper',0,20,1,ex,null,function(v){ex=v;draw()});
  S(row,'교육 계수 β₁',0,.2,.01,b1,fx(2),function(v){b1=v;draw()});S(row,'경력 계수 β₂',0,.1,.01,b2,fx(2),function(v){b2=v;draw()});
  function W(e,x){return Math.exp(b0+b1*e+b2*x)}
  function draw(){var lw=b0+b1*ed+b2*ex,w=Math.exp(lw),up=W(ed+1,ex)/w-1;
    var P=plot(c,260,{xlo:9,xhi:20,ylo:0,yhi:Math.max(40,W(20,ex)*1.1),xl:'교육 연수',yl:'예상 시급(달러)',title:'경력을 고정하고 교육만 바꿀 때 예상 시급',fy:function(v){return '$'+v}});
    P.fn(function(e){return W(e,ex)},COL.s,2.4);P.dot(ed,w,COL.g,6,'지금');stamp(P.ctx,P.W,'가정한 계수');
    K([[f1(lw,2),'로그 임금 log w','i'],['$'+f1(w,2),'예상 시급 = e^log w','g'],[pc(b1,0),'교육 1년의 근사 효과(β₁ × 100%)','a'],[pc(up,1),'정확한 효과 e^β₁ − 1','m']]);
    E('log w = '+f1(b0,1)+' + '+f1(b1,2)+'×'+ed+' + '+f1(b2,2)+'×'+ex+' = '+f1(b0,1)+' + '+f1(b1*ed,2)+' + '+f1(b2*ex,2)+' = <i>'+f1(lw,2)+'</i> → 시급 ≈ e<sup>'+f1(lw,2)+'</sup> = $'+f1(w,2));
    I([['i','로그를 쓰면 계수를 "비율"로 읽을 수 있어요. β₁ = 0.10이면 교육 1년마다 시급이 약 10% 올라요. 정확히는 e<sup>0.10</sup> − 1 = 10.5%예요.'],['a','이 식은 "다른 조건이 같다면(ceteris paribus)" 교육 1년의 효과를 말해요. 계수 자체는 실제 자료로 추정해야 하고, 여기 값은 강의노트의 가정값이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 정책 질문 분류 게임 */
SIMS.qmap=function(el,cfg){var box=h('div',{class:'stack',style:'gap:10px'});el.appendChild(box);var K=kpis(el,4),I=insight(el);
  var Q=[['실업급여를 늘리면 실직자가 구직을 늦출까?','공급','실증'],['최저임금을 올리면 청년 고용이 줄어들까?','수요','실증'],['외국인 노동자가 늘면 국내 노동자의 임금은 어떻게 될까?','균형','실증'],['중대재해처벌법은 더 강화되어야 한다.','정부','규범'],['교육을 1년 더 받으면 임금이 몇 % 오를까?','실증','실증'],['기업은 왜 임금이 오르면 사람 대신 기계를 들일까?','수요','실증'],['AI 시대에는 기본소득을 도입해야 한다.','정부','규범']],a={},b={};
  var TOOLS=[['공급','노동공급(가계)'],['수요','노동수요(기업)'],['균형','시장균형'],['정부','정부 개입'],['실증','실증분석(회귀)']];
  Q.forEach(function(q,i){var d=h('div',{class:'panel',style:'padding:10px 14px'});d.innerHTML='<p style="margin:0 0 6px"><b>'+(i+1)+'.</b> '+q[0]+'</p>';var r=ctrlRow(d);
    buttons(r,'먼저 볼 도구',TOOLS,null,function(v){a[i]=v;draw()});buttons(r,'',[['실증','실증(사실)'],['규범','규범(가치판단)']],null,function(v){b[i]=v;draw()});box.appendChild(d)});
  function draw(){var x=0,y=0,n=0;Q.forEach(function(q,i){if(a[i]){n++;if(a[i]===q[1])x++}if(b[i]&&b[i]===q[2])y++});
    K([[x+'/'+Q.length,'도구 맞힘','g'],[y+'/'+Q.length,'실증·규범 맞힘','i'],[n+'/'+Q.length,'고른 질문','m'],[x===Q.length&&y===Q.length?'만점':'진행 중','상태','a']]);
    I([['i','"~할까?"처럼 자료로 확인할 수 있으면 실증, "~해야 한다"처럼 가치판단이 들어가면 규범이에요. 노동경제학은 먼저 실증 질문에 답하고, 그 답을 규범 논쟁의 재료로 내놓아요.'],['a','정답 예: 1 공급, 2 수요, 3 균형, 4 정부(규범), 5 실증, 6 수요, 7 정부(규범). 3번은 공급이 늘 때 임금이 어디서 멈추는지라 균형 문제예요.']])}
  draw()};

/* ===== CH02 노동공급 (1) ===== */
/* 고용 지표와 실망실업자 */
SIMS.lfstat=function(el,cfg){var c=S0(el,cfg,250,'생산가능인구 1,000만 명의 구성'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var Em=600,U=40,d=0;
  S(row,'취업자(만 명)',500,700,5,Em,null,function(v){Em=v;draw()});S(row,'실업자(만 명)',10,80,2,U,null,function(v){U=v;if(d>U)d=U;draw()});S(row,'구직을 포기한 실업자(만 명)',0,40,2,d,null,function(v){d=Math.min(v,U);draw()});
  function draw(){var P0=1000,u=U-d,LF=Em+u,NLF=P0-LF,ur=u/LF,lfpr=LF/P0,er=Em/P0,ur0=U/(Em+U);
    lbarPlot(c,250,'인구 구성(만 명): 취업자 · 실업자 · 비경제활동인구',[{v:Em,c:COL.g,t:nf(Em),n:'취업자'},{v:u,c:COL.r,t:nf(u),n:'실업자'},{v:NLF,c:COL.muted,t:nf(NLF),n:'비경제활동인구'},{v:d,c:COL.a,t:nf(d),n:'그중 실망실업자'}],P0*.75);
    K([[pc(ur,2),'실업률 = 실업자 ÷ 경제활동인구',d?'a':'i'],[pc(lfpr,1),'경제활동참가율','i'],[pc(er,1),'고용률 = 취업자 ÷ 생산가능인구','g'],[d?pc(ur0,2)+' → '+pc(ur,2):'변화 없음','실망실업 전후 실업률','m']]);
    E('실업률 = '+u+' ÷ ('+Em+' + '+u+') = <i>'+pc(ur,2)+'</i> · 고용률 = '+Em+' ÷ 1,000 = '+pc(er,1));
    I([[d?'a':'i',d?'구직을 포기한 '+d+'만 명이 실업자에서 비경제활동인구로 옮겨 가 실업률이 '+pc(ur0,2)+'에서 '+pc(ur,2)+'로 내려갔어요. 일자리는 하나도 늘지 않았는데요(고용률 그대로).':'"구직을 포기한 실업자" 슬라이더를 올려 보세요. 실업률만 내려가고 고용률은 그대로예요.'],['i','실업자는 ① 일이 없고 ② 일할 뜻이 있고 ③ 지난 4주간 구직활동을 했고 ④ 바로 일할 수 있는 사람이에요. 구직을 멈추면 ③이 빠져 통계에서 사라져요(실망실업자 효과).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 예산선과 무차별곡선 U = C·L */
SIMS.budgetic=function(el,cfg){var c=S0(el,cfg,290,'여가-소비 평면: 예산선과 무차별곡선'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var T=112,w=cfg.w||20,V=cfg.V||320,L=cfg.L||90;
  S(row,'시급 w(달러)',5,40,1,w,null,function(v){w=v;draw()});S(row,'비근로소득 V(달러)',0,800,20,V,null,function(v){V=v;draw()});S(row,'내가 고른 여가 L(시간)',10,112,1,L,null,function(v){L=v;draw()});
  function draw(){var C=w*(T-L)+V,u=C*L,cmax=w*T+V;
    var P=plot(c,290,{xlo:0,xhi:120,ylo:0,yhi:Math.max(1200,cmax*1.08),xl:'여가 L(주당 시간)',yl:'소비 C(달러)',title:'파랑 예산선 C = w(T − L) + V · 보라 지금 점을 지나는 무차별곡선'});
    P.fn(function(x){return x<=T?w*(T-x)+V:NaN},COL.s,2.6,null,0,T);P.seg(T,0,T,V,COL.s,2.6);
    P.fn(function(x){return u/x},COL.m,2,null,Math.max(1,u/(cmax*1.08)),120);
    P.dot(L,C,COL.g,6,'지금');P.dot(T,V,COL.i,5,'E (일 안 함)',-8,-8);stamp(P.ctx,P.W,'U = C × L');
    K([[usd(C),'소비 C','i'],[f1(T-L,0)+'시간','근로시간 h = T − L','a'],[nf(Math.round(u)),'효용 U = C × L','g'],[f1(C/L,1)+' vs '+w,'MRS = C ÷ L 와 시급 w',Math.abs(C/L-w)<1.5?'g':'r']]);
    E('예산선: C = '+w+' × ('+T+' − '+L+') + '+V+' = <i>'+usd(C)+'</i> · 기울기 = −w = −'+w+' (여가 1시간의 기회비용)');
    I([[Math.abs(C/L-w)<1.5?'g':'a',Math.abs(C/L-w)<1.5?'무차별곡선이 예산선에 거의 닿아 있어요. 여기서 더 높은 효용은 예산 밖이에요.':C/L>w?'MRS('+f1(C/L,1)+') > 시급('+w+'): 여가 1시간을 '+f1(C/L,1)+'달러만큼 아끼는데 시장에선 '+w+'달러면 사요. 여가를 늘리세요.':'MRS('+f1(C/L,1)+') < 시급('+w+'): 여가 1시간의 값어치가 시급보다 작아요. 더 일하는(여가를 줄이는) 편이 나아요.'],['i','강의노트 예: U = C × L이면 (C 400, L 100)의 효용 40,000이 (250, 150)의 37,500보다 커요(√을 씌우면 200 대 193.6). 원점에서 먼 무차별곡선일수록 더 높은 효용이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 최적 노동시간과 유보임금 */
SIMS.optimal=function(el,cfg){var c=S0(el,cfg,290,'최적 선택: MRS = w, 그리고 유보임금'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var T=112,w=20,V=320;
  S(row,'시급 w(달러)',1,40,.5,w,fx(1),function(v){w=v;draw()});S(row,'비근로소득 V(달러)',0,3000,20,V,null,function(v){V=v;draw()});
  function draw(){var wr=V/T,Ls=Math.min(T,(w*T+V)/(2*w)),h=T-Ls,C=w*h+V,u=C*Ls,cmax=w*T+V;
    var P=plot(c,290,{xlo:0,xhi:120,ylo:0,yhi:Math.max(1500,cmax*1.08),xl:'여가 L(주당 시간)',yl:'소비 C(달러)',title:'파랑 예산선 · 보라 가장 높은 무차별곡선 · 점선 E에서의 무차별곡선 기울기'});
    P.fn(function(x){return x<=T?w*(T-x)+V:NaN},COL.s,2.6,null,0,T);P.seg(T,0,T,V,COL.s,2.6);
    P.fn(function(x){return u/x},COL.m,2,null,Math.max(1,u/(cmax*1.08)),120);
    if(V>0)P.fn(function(x){return V-wr*(x-T)},COL.a,1.4,[4,3],60,T);
    P.dot(Ls,C,COL.g,6,h>0?'최적 P':'코너해 E');stamp(P.ctx,P.W,'U = C × L');
    K([[f1(h,1)+'시간','최적 근로시간 h*',h>0?'g':'r'],[f1(Ls,1)+'시간','최적 여가 L*','i'],[usd(C),'최적 소비 C*','i'],['$'+f1(wr,2),'유보임금 = V ÷ T',w>wr?'g':'r']]);
    E('MRS = C ÷ L = w → C = wL · 예산선에 넣으면 wL = w(T − L) + V → L* = (wT + V) ÷ 2w = ('+f1(w*T,0)+' + '+V+') ÷ '+f1(2*w,0)+' = <i>'+f1(Ls,1)+'</i>'+(h<=0?' → T보다 커서 L* = T(일하지 않음)':''));
    I([[h>0?'g':'r',h>0?'시급이 유보임금 $'+f1(wr,2)+'보다 높아 일하는 쪽을 골라요(내부해). 강의노트 예: w = 20, V = 320, T = 112 → L* = 64, h* = 48, C* = 1,280.':'시급이 유보임금 $'+f1(wr,2)+'보다 낮아 일하지 않는 게 최선이에요(코너해). E점에서 무차별곡선이 예산선보다 가파르기 때문이에요.'],['i','유보임금은 "이 시급 아래면 일하지 않겠다"는 문턱이에요. 일을 전혀 하지 않는 점 E에서 무차별곡선의 기울기와 같아요. 비근로소득 V가 늘면 문턱이 올라가요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH03 노동공급 (2) ===== */
/* 대체효과·소득효과 분해 (U = C·L) */
function cdL(w,V,T){return Math.min(T,(w*T+V)/(2*w))}
SIMS.slutskyl=function(el,cfg){var c=S0(el,cfg,290,'임금 인상을 두 효과로 나누기'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var T=112,w0=20,w1=30,V=320,mode=0,dV=1000;
  buttons(row,'바뀐 것',[[0,'임금 인상'],[1,'복권 당첨(V 증가)']],mode,function(v){mode=v;draw()});
  S(row,'처음 시급 w₀',5,40,1,w0,null,function(v){w0=v;draw()});S(row,'새 시급 w₁',5,60,1,w1,null,function(v){w1=v;draw()});S(row,'비근로소득 V',0,1000,20,V,null,function(v){V=v;draw()});S(row,'복권 당첨금',0,3000,100,dV,null,function(v){dV=v;draw()});
  function draw(){var L0=cdL(w0,V,T),C0=w0*(T-L0)+V,U0=C0*L0,L1,C1,Lh,Ch,ww=mode?w0:w1,VV=mode?V+dV:V;
    L1=cdL(ww,VV,T);C1=ww*(T-L1)+VV;Lh=mode?L0:Math.min(T,Math.sqrt(U0/w1));Ch=mode?C0:U0/Lh;
    var se=-(Lh-L0),ie=-(L1-Lh),tot=-(L1-L0),ym=Math.max(ww*T+VV,w0*T+V)*1.08;
    var P=plot(c,290,{xlo:0,xhi:120,ylo:0,yhi:ym,xl:'여가 L',yl:'소비 C',title:'회색 처음 예산선 · 파랑 새 예산선 · 주황 점선 가상 예산선(처음 효용 유지)'});
    P.fn(function(x){return x<=T?w0*(T-x)+V:NaN},COL.muted,2,null,0,T);P.fn(function(x){return x<=T?ww*(T-x)+VV:NaN},COL.s,2.4,null,0,T);
    if(!mode)P.fn(function(x){return Ch+w1*(Lh-x)},COL.a,1.5,[5,4],Math.max(0,Lh-30),Math.min(120,Lh+30));
    P.fn(function(x){return U0/x},COL.muted,1.3,[3,3],U0/ym,120);P.fn(function(x){return C1*L1/x},COL.m,1.6,null,C1*L1/ym,120);
    P.dot(L0,C0,COL.muted,5,'A 처음',8,14);if(!mode)P.dot(Lh,Ch,COL.a,5,'B 가상',-8,-8);P.dot(L1,C1,COL.g,6,'C 새 선택');stamp(P.ctx,P.W,'U = C × L');
    K([[f1(T-L0,1)+' → '+f1(T-L1,1),'근로시간 h (처음 → 새)','i'],[(se>=0?'+':'')+f1(se,1)+'시간','대체효과(A → B)',mode?'i':'g'],[(ie>=0?'+':'')+f1(ie,1)+'시간','소득효과(B → C)','r'],[(tot>=0?'+':'')+f1(tot,1)+'시간','전체 변화',tot>=0?'g':'r']]);
    E(mode?'임금 그대로, V가 '+usd(dV)+' 늘면 예산선이 위로 평행이동 → 여가(정상재)가 늘어 근로시간 '+f1(tot,1)+'시간 (순수 소득효과)':'가상 예산선: 기울기는 새 임금 '+w1+', 처음 효용 '+nf(Math.round(U0))+' 유지 → L<sub>B</sub> = √(U₀ ÷ w₁) = <i>'+f1(Lh,1)+'</i>');
    I([[mode?'r':tot>=0?'g':'r',mode?'복권 당첨은 임금(여가의 값)을 바꾸지 않고 소득만 늘려요. 여가가 정상재라 일을 덜 해요. 대체효과는 0이에요.':(tot>=0?'대체효과(여가가 비싸져 덜 쉼)가 소득효과(부자가 되어 더 쉼)보다 커서 근로시간이 늘었어요.':'소득효과가 대체효과보다 커서 근로시간이 줄었어요.')],['i','강의노트·교과서 방식: 처음 무차별곡선에 새 임금 기울기로 접하는 가상의 점 B를 찍어요. A→B는 상대가격만 바뀐 효과(대체), B→C는 실질소득이 늘어난 효과(소득)예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 노동공급곡선과 후방굴절: u = C^(1−θ)/(1−θ) − g·h²/2,  FOC w(wh+V)^−θ = g·h */
function lsH(w,V,th,g){return bisect(function(h){return w*Math.pow(w*h+V,-th)-g*h},0,100,70)}
function lsGfit(V,th){var lo=Math.log(1e-12),hi=Math.log(10);for(var i=0;i<80;i++){var m=(lo+hi)/2;if(lsH(20,V,th,Math.exp(m))>44)lo=m;else hi=m}return Math.exp((lo+hi)/2)}
SIMS.lsupply=function(el,cfg){var c=S0(el,cfg,280,'임금이 오를 때 근로시간: 노동공급곡선'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var th=2,w=20,V=800;
  S(row,'소득효과의 세기 θ',1,3,.1,th,fx(1),function(v){th=v;draw()});S(row,'지금 시급 w(달러)',4,64,1,w,null,function(v){w=v;draw()});
  function draw(){var g=lsGfit(V,th),H=function(x){return lsH(x,V,th,g)},h=H(w),h2=H(w*1.1),el_=(h2/h-1)/.1,pk=4,ph=0;for(var x=4;x<=64;x+=.5){var y=H(x);if(y>ph){ph=y;pk=x}}
    var P=plot(c,280,{xlo:0,xhi:60,ylo:0,yhi:70,xl:'주당 근로시간 h',yl:'시급 w',title:'노동공급곡선: 가로 근로시간, 세로 시급 · 점 = 지금'});
    var pts=[];for(var x=4;x<=64;x+=1)pts.push([H(x),x]);var ctx=P.ctx;ctx.save();ctx.strokeStyle=COL.r;ctx.lineWidth=2.6;ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(P.X(p[0]),P.Y(p[1])):ctx.moveTo(P.X(p[0]),P.Y(p[1]))});ctx.stroke();ctx.restore();
    P.seg(0,pk,60,pk,COL.a,1.2,[4,3]);P.dot(h,w,COL.g,6,'지금');stamp(P.ctx,P.W,'설명용 모형');
    K([[f1(h,1)+'시간','지금 근로시간','i'],[(el_>=0?'+':'')+f1(el_,2),'노동공급 탄력성 σ = %Δh ÷ %Δw',el_>=0?'g':'r'],['$'+f1(pk,1),'근로시간이 가장 긴 시급(굽는 점)','a'],[w<pk?'대체효과 우세':'소득효과 우세','지금 구간',w<pk?'g':'r']]);
    E('σ = (h(1.1w) − h(w)) ÷ h(w) ÷ 10% = ('+f1(h2,2)+' − '+f1(h,2)+') ÷ '+f1(h,2)+' ÷ 0.1 = <i>'+f1(el_,2)+'</i>');
    I([[w<pk?'g':'r',w<pk?'시급 $'+f1(pk,1)+' 아래에서는 임금이 오를수록 더 일해요(곡선이 오른쪽 위로).':'시급 $'+f1(pk,1)+'을 넘으면 임금이 올라도 덜 일해요. 곡선이 뒤로 굽는 후방굴절이에요.'],['i','θ를 올리면 소득이 늘 때 여가를 더 원해(소득효과가 세져) 곡선이 더 일찍, 더 크게 굽어요. 실제 남성의 노동공급 탄력성은 0에 가깝고 음수로 추정되기도 해요(교과서 실증). 모형 수치는 설명용이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* EITC 예산선 (연간, 2017 미국 자녀 2명 기준 — 교과서 그림 2-18) */
function eitc(E,on){if(!on)return 0;if(E<=14040)return .40*E;if(E<=18340)return 5616;return Math.max(0,5616-.2106*(E-18340))}
function eitcBest(w,V,on,T){var bh=0,bu=-1;for(var h=0;h<=T;h+=10){var E=w*h,C=E+eitc(E,on)+V,u=C*(T-h);if(u>bu){bu=u;bh=h}}return bh}
SIMS.eitc=function(el,cfg){var c=S0(el,cfg,290,'근로장려세제(EITC)가 예산선과 근로시간을 바꾸는 방식'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var T=4000,w=10,V=6000,on=1;
  buttons(row,'EITC',[[0,'없음'],[1,'있음']],on,function(v){on=v;draw()});S(row,'시급 w(달러)',5,30,1,w,null,function(v){w=v;draw()});S(row,'다른 소득 V(연, 달러)',0,20000,500,V,null,function(v){V=v;draw()});
  function draw(){var h0=eitcBest(w,V,0,T),h1=eitcBest(w,V,1,T),hh=on?h1:h0,Eh=w*hh,cr=eitc(Eh,on),ymax=(w*T+V+5616)*1.05;
    var P=plot(c,290,{xlo:0,xhi:T,ylo:0,yhi:ymax,xl:'연간 여가(시간)',yl:'연간 소비(달러)',title:'회색 EITC 없는 예산선 · 파랑 EITC 있는 예산선(꺾인 곳 = 지급 구간 경계)',fx:function(v){return nf(v)},fy:function(v){return nf(v)}});
    P.fn(function(L){var E=w*(T-L);return E+V},COL.muted,1.8,[4,3],0,T);P.fn(function(L){var E=w*(T-L);return E+eitc(E,1)+V},COL.s,2.4,null,0,T);
    P.dot(T-h0,w*h0+V,COL.muted,5,'EITC 없을 때',8,14);if(on)P.dot(T-h1,w*h1+eitc(w*h1,1)+V,COL.g,6,'EITC 있을 때');stamp(P.ctx,P.W,'U = C × L, 단순화');
    var zone=Eh<=0?'일 안 함':Eh<=14040?'지급 증가 구간(40%)':Eh<=18340?'정액 구간':Eh<45007?'지급 감소 구간(−21%)':'지급 없음';
    K([[nf(h0)+' → '+nf(h1)+'시간','연간 근로시간(없음 → 있음)',h1>h0?'g':h1<h0?'r':'i'],[usd(cr),'받는 장려금','a'],[usd(Eh),'근로소득','i'],[zone,'지금 구간','m']]);
    E('장려금 = 근로소득 ≤ 14,040: 40% · 14,040~18,340: 5,616 · 18,340 초과: 5,616 − 21.06% × (근로소득 − 18,340) → 지금 <i>'+usd(cr)+'</i>');
    I([[h1>h0?'g':h1<h0?'r':'i',h0===0&&h1>0?'EITC가 없으면 일하지 않던 사람이 EITC로 일하기 시작했어요. 일해야만 받을 수 있어 참여를 끌어내요.':h1<h0?'지급 감소 구간에서는 1달러 더 벌 때 장려금이 21센트 줄어 실질 시급이 낮아지고, 받는 돈으로 소득효과도 생겨 근로시간이 줄 수 있어요.':h1>h0?'근로시간이 늘었어요.':'이 조건에서는 근로시간이 거의 바뀌지 않아요.'],['i','EITC는 일하지 않는 사람에게는 참여를 늘리는 쪽(대체효과)으로, 이미 오래 일하는 사람에게는 근로시간을 줄이는 쪽으로 작용할 수 있어요. 실증 연구는 참여 증가 효과가 뚜렷하다고 보고해요(교과서 표 2-4). 지급 기준은 교과서의 2017년 미국 자녀 2명 가구 예시예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH04 노동수요 ===== */
/* 단기: 한계생산·가치한계생산과 고용 결정 q = 60L − 3L² */
SIMS.vmp=function(el,cfg){var c=S0(el,cfg,280,'한 명 더 뽑을 때: 한계생산의 가치(VMP)와 임금'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var p=2,w=60,A=1,L=4;
  S(row,'제품 가격 p(달러)',1,4,.25,p,fx(2),function(v){p=v;draw()});S(row,'시급 w(달러)',20,120,2,w,null,function(v){w=v;draw()});S(row,'기술 수준(생산성 배수)',.8,1.4,.1,A,fx(1),function(v){A=v;draw()});S(row,'내가 정한 고용 L(명)',0,10,1,L,null,function(v){L=v;draw()});
  function q(x){return A*(60*x-3*x*x)}function mp(n){return q(n)-q(n-1)}
  function draw(){var Ls=0;for(var n=1;n<=10;n++){if(p*mp(n)>=w)Ls=n;else break}var pr=function(n){return p*q(n)-w*n};
    var it=[];for(var n=1;n<=10;n++)it.push({v:p*mp(n),c:n<=Ls?COL.g:COL.muted,t:f1(p*mp(n),0),n:n+'번째'});
    var r=lbarPlot(c,280,'n번째 노동자의 VMP = p × MP (초록 = 뽑을 가치 있음) · 주황 점선 = 시급',it,Math.max(p*mp(1),w)*1.15);
    var ctx=r.ctx,W=r.W,y0=280-28,hh=280-64,m=Math.max(p*mp(1),w)*1.15,yw=y0-w/m*hh;ctx.save();ctx.strokeStyle=COL.a;ctx.setLineDash([5,4]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(24,yw);ctx.lineTo(W-24,yw);ctx.stroke();ctx.restore();
    K([[Ls+'명','이윤이 가장 큰 고용 L*','g'],[usd(pr(Ls)),'L*의 이윤(자본비용 제외)','g'],[usd(pr(L)),'내가 정한 '+L+'명의 이윤',pr(L)>=pr(Ls)-.01?'g':'r'],[usd(p*mp(Math.max(1,L))),L+'번째 노동자의 VMP','i']]);
    E('MP(n) = q(n) − q(n − 1), q = '+(A===1?'':f1(A,1)+' × ')+'(60L − 3L²) · 뽑는 규칙: VMP = p × MP ≥ w → L* = <i>'+Ls+'</i>명');
    I([[pr(L)>=pr(Ls)-.01?'g':'a',pr(L)>=pr(Ls)-.01?'마지막 노동자가 만든 가치가 시급 이상인 곳까지 뽑았어요. 이윤이 가장 커요.':'고용을 '+Ls+'명으로 맞춰 보세요. 그 너머 노동자는 시급보다 적은 가치를 만들어 이윤을 깎아요.'],['i','한계생산 체감 때문에 VMP 막대가 계단처럼 내려가요. 시급을 내리거나 제품 가격·기술을 올리면 더 많이 뽑아요. 이 VMP 막대들이 곧 단기 노동수요곡선이에요(파생수요).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 장기: 비용 최소화 Y = L^0.5 K^0.5 */
SIMS.costmin=function(el,cfg){var c=S0(el,cfg,290,'장기: 같은 산출을 가장 싸게 — 등량곡선과 등비용선'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var w=10,r=20,Y=100,w0=10;
  S(row,'시급 w',5,40,1,w,null,function(v){w=v;draw()});S(row,'자본 사용료 r',5,40,1,r,null,function(v){r=v;draw()});S(row,'산출량 Y',50,150,10,Y,null,function(v){Y=v;draw()});
  function draw(){var L=Y*Math.sqrt(r/w),Kk=Y*Math.sqrt(w/r),TC=w*L+r*Kk,L0=Y*Math.sqrt(r/w0),K0=Y*Math.sqrt(w0/r);
    var P=plot(c,290,{xlo:0,xhi:300,ylo:0,yhi:200,xl:'노동 L',yl:'자본 K',title:'보라 등량곡선 L^0.5 K^0.5 = Y · 파랑 등비용선 wL + rK = 최소비용'});
    P.fn(function(x){return Y*Y/x},COL.m,2.4,null,Y*Y/200,300);P.fn(function(x){return (TC-w*x)/r},COL.s,2.2,null,0,TC/w);
    if(w!==w0){P.dot(L0,K0,COL.muted,5,'시급 '+w0+'일 때',8,14)}P.dot(L,Kk,COL.g,6,'비용 최소점');stamp(P.ctx,P.W,'Cobb-Douglas');
    K([[f1(L,2),'노동수요 L*','g'],[f1(Kk,2),'자본수요 K*','i'],[usd(TC),'최소 총비용','a'],[f1(Kk/L,2),'자본 ÷ 노동 = w ÷ r','m']]);
    E('MRTS = MP<sub>L</sub> ÷ MP<sub>K</sub> = K ÷ L = w ÷ r = '+w+' ÷ '+r+' → K = '+f1(w/r,2)+'L → Y = L × √'+f1(w/r,2)+' → L* = <i>'+f1(L,2)+'</i>');
    I([[w>w0?'a':'i',w>w0?'시급이 '+w0+'에서 '+w+'로 오르자 같은 산출을 위해 노동을 '+f1(L0,1)+' → '+f1(L,1)+'로 줄이고 자본을 '+f1(K0,1)+' → '+f1(Kk,1)+'로 늘렸어요(대체효과). 비용이 올라 산출까지 줄이면 노동이 더 줄어요(규모효과).':'강의노트 예: w = 10, r = 20, Y = 100 → L* ≈ 141.42, K* ≈ 70.71. 시급 슬라이더를 올려 보세요.'],['i','장기에는 자본도 바꿀 수 있어 임금이 오를 때 단기보다 고용이 더 많이 줄어요. 장기 노동수요가 더 탄력적인 이유예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 생산함수 4종과 AI 대체: 선형 Y = aL + bK의 임계임금 */
SIMS.aithresh=function(el,cfg){var c=S0(el,cfg,280,'노동과 AI 자본: 생산함수에 따라 달라지는 노동수요'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var type=1,a=4,b=2,r=6,w=8,Y=20,wR=15;
  buttons(row,'생산함수',[[0,'레온티에프 min(aL, bK)'],[1,'선형 aL + bK'],[2,'콥-더글러스']],type,function(v){type=v;draw()});
  S(row,'AI·자본 사용료 r',.5,12,.5,r,fx(1),function(v){r=v;draw()});S(row,'시장 시급 w',1,20,.5,w,fx(1),function(v){w=v;draw()});S(row,'노동자의 유보임금 w_R',1,20,.5,wR,fx(1),function(v){wR=v;draw()});
  function LD(ww){if(type===0)return Y/a;if(type===1)return ww/a<r/b?Y/a:ww/a>r/b?0:Y/(2*a);return Y/Math.sqrt(a*b)*Math.sqrt(r/ww)}
  function draw(){var ws=a/b*r,L=LD(w),Kk=type===0?Y/b:type===1?(L>0&&L<Y/a?Y/(2*b):L>0?0:Y/b):Y/Math.sqrt(a*b)*Math.sqrt(w/r),disc=w<wR;
    var P=plot(c,280,{xlo:0,xhi:20,ylo:0,yhi:8,xl:'시급 w',yl:'노동수요 L',title:'노동수요곡선(시급에 따른 고용) · 주황 = 임계임금 w* · 보라 = 유보임금'});
    if(type===1){P.seg(0,Y/a,ws,Y/a,COL.s,2.6);P.seg(ws,Y/a,ws,0,COL.s,1.4,[3,3]);P.seg(ws,0,20,0,COL.s,2.6);P.seg(ws,0,ws,8,COL.a,1.4,[5,4])}else P.fn(LD,COL.s,2.6,null,.3,20);
    P.seg(wR,0,wR,8,COL.m,1.4,[2,3]);P.dot(w,L,COL.g,6,'지금');stamp(P.ctx,P.W,'Y = '+Y+', a = 4, b = 2');
    K([[f1(L,2),'노동수요 L*',L>0?'g':'r'],[f1(Kk,2),'자본(AI) 수요 K*','i'],[type===1?'$'+f1(ws,1):'없음','임계임금 w* = (a ÷ b) × r','a'],[disc?'실망실업 위험':'일함','시장 시급 vs 유보임금',disc?'r':'g']]);
    E(type===0?'레온티에프: aL = bK = Y → L* = Y ÷ a = <i>'+f1(Y/a,2)+'</i> (임금과 상관없이 고정, 탄력성 0)':type===1?'단위비용: 노동 w ÷ a = '+f1(w/a,2)+' · 자본 r ÷ b = '+f1(r/b,2)+' → 더 싼 쪽만 씀 → L* = <i>'+f1(L,2)+'</i>':'콥-더글러스: L* = (Y ÷ √ab) × √(r ÷ w) = <i>'+f1(L,2)+'</i>');
    I([[type===1&&L===0?'r':'i',type===0?'완전보완: 사람 한 명에 기계 한 대처럼 비율이 고정이라 임금이 바뀌어도 고용이 그대로예요(수요곡선이 수직).':type===1?(L>0?'지금은 노동이 더 싸서 노동만 써요. r을 3으로 내리면 w*가 6이 되어 시급 8에서 노동수요가 0으로 뚝 떨어져요(강의노트 문제 6).':'AI 단위비용이 더 싸서 노동을 전혀 쓰지 않아요. 완전대체에서는 임계임금을 넘는 순간 수요가 절벽처럼 0이 돼요.'):'콥-더글러스는 부분 대체: 임금이 오르면 노동이 서서히 줄어요.'],[disc?'r':'a',disc?'시장 시급('+f1(w,1)+')이 유보임금('+f1(wR,1)+')보다 낮아요. 이 노동자는 구직을 포기할 수 있어요(실망실업, 노동공급 왼쪽 이동).':'AI 가격이 0에 가까워지면 w* → 0이라 어떤 양의 임금도 비싸져요. 이때 노동수요 탄력성은 무한대로 커져요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH05 노동시장균형 ===== */
/* 두 지역 시장: 이동으로 임금 수렴 */
SIMS.twomkt=function(el,cfg){var c=S0(el,cfg,280,'두 지역 노동시장: 노동자가 옮겨 가면 임금이 같아진다'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var x=50,mc=0;
  S(row,'북부에서 일하는 노동자(전체 100명 중)',30,90,1,x,null,function(v){x=v;draw()});S(row,'이주 비용(임금 차이로 환산)',0,30,2,mc,null,function(v){mc=v;draw()});
  function wN(n){return 60-.5*n}function wS(n){return 40-.5*n}function Y(n){return 60*n-.25*n*n+40*(100-n)-.25*(100-n)*(100-n)}
  function draw(){var xe=70-mc,gap=wN(x)-wS(100-x),loss=Y(xe)-Y(x);
    var P=plot(c,280,{xlo:0,xhi:100,ylo:0,yhi:60,xl:'북부 고용 →   ← 남부 고용',yl:'시급',title:'파랑 북부 수요(VMP) · 빨강 남부 수요(오른쪽에서 왼쪽으로)'});
    P.fn(wN,COL.s,2.4);P.fn(function(n){return wS(100-n)},COL.r,2.4);P.seg(x,0,x,60,COL.muted,1.4,[4,3]);
    P.dot(x,wN(x),COL.s,5,'북부 '+f1(wN(x),1),8,-8);P.dot(x,wS(100-x),COL.r,5,'남부 '+f1(wS(100-x),1),8,16);P.dot(xe,wN(xe),COL.g,5,'이동이 멈추는 곳',-8,-10);stamp(P.ctx,P.W,'예시값');
    K([[f1(wN(x),1)+' / '+f1(wS(100-x),1),'시급 북부 / 남부','i'],[f1(gap,1),'임금 격차',Math.abs(gap-mc)<1?'g':'a'],[nf(Math.round(Y(x))),'두 지역 생산 합계','g'],[nf(Math.round(loss)),'더 옮겨 가면 늘 생산',loss>1?'r':'g']]);
    E('이동이 멈추는 곳: (60 − 0.5x) − (40 − 0.5(100 − x)) = 이주 비용 '+mc+' → 70 − x = '+mc+' → x = <i>'+xe+'</i>');
    I([[Math.abs(gap-mc)<1?'g':'a',Math.abs(gap-mc)<1?'임금 격차가 이주 비용만큼으로 줄어 더는 옮길 이유가 없어요. 두 지역의 VMP가 같아져 생산이 가장 커요(이주 비용 0일 때 3,950).':'북부 시급이 더 높아 노동자가 옮겨 갈 이유가 남아 있어요. 슬라이더를 '+xe+'명 쪽으로 움직여 보세요.'],['i','교과서 그림 4-3은 1950~2010년 미국 주(州) 사이 임금 격차가 점점 줄어든 모습을 보여 줘요(임금 수렴). 다만 이주 비용이 있어 완전히 같아지지는 않아요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 최저임금: 경쟁시장 vs 수요독점. 공급 w = 4 + E/10, 수요(VMP) w = 20 − E/10 */
SIMS.minwage=function(el,cfg){var c=S0(el,cfg,290,'최저임금: 경쟁시장과 수요독점에서 고용이 다르게 움직인다'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var mono=0,m=0;
  buttons(row,'시장',[[0,'경쟁시장(고용주 여럿)'],[1,'수요독점(고용주 하나)']],mono,function(v){mono=v;draw()});S(row,'최저임금 m(0 = 없음)',0,18,.25,m,fx(2),function(v){m=v;draw()});
  function draw(){var res=minres(mono,m);
    var P=plot(c,290,{xlo:0,xhi:160,ylo:0,yhi:24,xl:'고용 E',yl:'시급 w',title:'빨강 공급 · 파랑 수요(VMP)'+(mono?' · 보라 한계노동비용 MC_E':'')+' · 주황 최저임금'});
    P.fn(function(E){return 4+E/10},COL.r,2.4);P.fn(function(E){return 20-E/10},COL.s,2.4);if(mono)P.fn(function(E){return 4+E/5},COL.m,2,[5,4]);
    if(m>0)P.seg(0,m,160,m,COL.a,1.6,[4,3]);if(res.u>0)P.seg(res.E,m,res.E+res.u,m,COL.r,5);
    P.dot(res.E,res.w,COL.g,6,'고용 '+f1(res.E,1));stamp(P.ctx,P.W,'예시값');
    K([[f1(res.E,1)+'명','고용',res.E>=res.E0-.01?'g':'r'],['$'+f1(res.w,2),'시급','i'],[f1(res.u,1)+'명','일하려는데 못 하는 사람(실업)',res.u>0?'r':'g'],[(res.E-res.E0>=0?'+':'')+f1(res.E-res.E0,1)+'명','최저임금 없을 때 대비 고용 변화',res.E>=res.E0?'g':'r']]);
    E(mono?'수요독점: 한 명 더 뽑으면 모두의 임금을 올려야 해서 MC<sub>E</sub> = 4 + E/5 = VMP = 20 − E/10 → E = 53.3, w = 공급곡선 위 9.33':'경쟁: 4 + E/10 = 20 − E/10 → E = 80, w = 12');
    I([[res.E>=res.E0?'g':'r',mono?(m>9.33&&m<=12?'수요독점에서는 최저임금을 9.33~12 사이로 두면 고용이 오히려 늘어요. 기업이 임금을 낮추려 고용을 줄이던 이유가 사라지기 때문이에요. m = 12에서 고용 80명으로 가장 커요.':m>12?'12를 넘으면 수요곡선을 따라 고용이 다시 줄어요.':'최저임금을 올려 보세요.'):(m>12?'균형(12)보다 높은 최저임금은 고용을 '+f1(res.E0-res.E,1)+'명 줄이고 실업 '+f1(res.u,1)+'명을 만들어요.':'균형 시급 12보다 낮은 최저임금은 아무 효과가 없어요.')],['i','최저임금의 고용 효과에 대한 실증 결과는 갈려요. 카드·크루거의 뉴저지 패스트푸드 연구처럼 고용 감소가 뚜렷하지 않았다는 결과도, 고용이 줄었다는 결과도 있어요. 시장 구조가 답을 가르는 한 이유예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};
function minres(mono,m){var Es=function(w){return Math.max(0,10*(w-4))},Ed=function(w){return Math.max(0,10*(20-w))};
  var E0=mono?160/3:80,w0=mono?4+E0/10:12,E,w,u;
  if(!m||m<=(mono?w0:12)){E=E0;w=w0;u=0;if(m>w0&&!mono){}}
  if(mono){if(m>w0){if(m<=12){E=Es(m);w=m;u=0}else{E=Ed(m);w=m;u=Es(m)-E}}else{E=E0;w=w0;u=0}}
  else{if(m>12){E=Ed(m);w=m;u=Es(m)-E}else{E=80;w=12;u=0}}
  return {E:E,w:w,u:u,E0:E0}}

/* 이민의 잉여: 수요 w = 40 − 0.2E, 내국인 100명(비탄력), 이민자 M */
SIMS.immig=function(el,cfg){var c=S0(el,cfg,290,'이민 유입: 단기 임금 하락과 이민의 잉여'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var M=25,kadj=0;
  S(row,'이민자 수 M',0,60,5,M,null,function(v){M=v;draw()});S(row,'자본이 늘어나는 정도(장기 조정)',0,100,10,kadj,function(v){return v+'%'},function(v){kadj=v;draw()});
  function draw(){var N=100,w0=40-.2*N,w1s=40-.2*(N+M),sh=(w0-w1s)*kadj/100,w1=w1s+sh,surp=.5*(w0-w1s)*M*(1-kadj/100),loss=(w0-w1)*N;
    var P=plot(c,290,{xlo:0,xhi:200,ylo:0,yhi:45,xl:'고용 E',yl:'시급',title:'파랑 노동수요 · 빨강 공급(내국인 100명 → 이민 뒤 100 + M) · 초록 삼각형 = 이민의 잉여'});
    P.fn(function(E){return 40-.2*E+sh},COL.s,2.4);if(sh)P.fn(function(E){return 40-.2*E},COL.muted,1.2,[4,4]);
    P.seg(N,0,N,45,COL.muted,1.6,[4,3]);P.seg(N+M,0,N+M,45,COL.r,2.4);
    if(M&&kadj<100)P.poly([[N,w0],[N+M,w1s],[N,w1s]],COL.g,.3);P.dot(N,w0,COL.muted,5,'이민 전',-8,-8);P.dot(N+M,w1,COL.g,6,'이민 뒤');stamp(P.ctx,P.W,'예시값');
    K([['$'+f1(w0,1)+' → $'+f1(w1,1),'시급',w1<w0?'r':'g'],[usd(loss*1),'내국인 노동자 소득 감소(자본가에게 이전)',loss>0?'r':'g'],[usd(surp),'이민의 잉여(내국인 전체 순이득)','g'],[f1(N+M,0)+'명','총고용','i']]);
    E('이민의 잉여 = ½ × 임금 하락 × 이민자 수 = ½ × '+f1(w0-w1s,1)+' × '+M+(kadj?' × (1 − 조정 '+kadj+'%)':'')+' = <i>'+usd(surp)+'</i>');
    I([[w1<w0?'a':'g',kadj<100?'단기에는 자본이 고정이라 임금이 '+f1(w0-w1,1)+'달러 내려가요. 내국인 노동자가 잃은 몫은 자본 소유자에게 가고, 삼각형만큼은 내국인 전체의 순이득으로 남아요.':'장기에 자본이 늘면 노동수요가 오른쪽으로 옮겨 가 임금이 원래대로 돌아와요. 이때 이민의 잉여도 사라져요.'],['i','마리엘 보트 리프트(1980, 마이애미)는 연구마다 결론이 갈려요. 고졸 미만 노동자 임금이 크게 떨어졌다는 연구와 큰 효과가 없었다는 연구가 있어요(교과서 그림 4-12b).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH06 보상적 임금격차 ===== */
/* 위험한 일의 시장: 유보가격 분포와 수요 */
SIMS.riskmkt=function(el,cfg){var c=S0(el,cfg,280,'위험한 일자리 시장: 마지막으로 들어오는 사람이 수당을 정한다'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var D=40,lov=10;
  S(row,'위험한 일자리 수(100명 중)',5,95,5,D,null,function(v){D=v;draw()});S(row,'위험을 좋아하는 사람 비율(%)',0,40,5,lov,null,function(v){lov=v;draw()});
  function rp(k){return k<lov?-3*(lov-k)/Math.max(1,lov):(k-lov)/(100-lov)*20}
  function draw(){var prem=rp(D-1),rent=0;for(var k=0;k<D;k++)rent+=prem-rp(k);
    var P=plot(c,280,{xlo:0,xhi:100,ylo:-4,yhi:22,xl:'위험한 일을 받아들이는 사람 수(유보가격이 낮은 순)',yl:'월 위험수당(만 원)',title:'빨강 공급(유보가격 순서) · 파랑 일자리 수 · 점 = 시장 수당'});
    P.fn(rp,COL.r,2.4,null,0,100);P.seg(D,-4,D,22,COL.s,2.4);P.seg(0,0,100,0,COL.muted,1,[3,3]);P.dot(D,prem,COL.g,6,'수당 '+f1(prem,1));stamp(P.ctx,P.W,'예시값');
    K([[f1(prem,1)+'만 원','시장 위험수당(보상적 임금격차)',prem>0?'a':'r'],[D+'명','위험한 일을 하는 사람','i'],[f1(rent,0)+'만 원','앞선 사람들이 얻는 추가 이득 합','g'],[prem<0?'위험이 오히려 싸다':'위험이 비싸다','판정',prem<0?'r':'g']]);
    E('수당 = '+D+'번째 사람의 유보가격 = <i>'+f1(prem,1)+'</i>만 원');
    I([[prem>0?'a':'r',prem>0?'위험한 일자리를 채우려면 위험을 가장 싫어하는 마지막 사람도 설득해야 해요. 그 사람의 유보가격이 모두의 수당이 돼요.':'일자리가 위험을 좋아하는 사람 수보다 적으면 수당이 0 아래로 내려갈 수 있어요(교과서 그림 5-3). 위험한 일이 늘 더 받는 건 아니에요.'],['i','보상적 임금격차는 애덤 스미스가 말한 원리예요. 직업의 좋고 나쁨(위험·불쾌·불안정)이 임금에 반영돼 직업 전체의 "순이익"이 비슷해져요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 헤도닉 임금함수: 시장 위험가격과 근로자별 선택 */
SIMS.hedonic=function(el,cfg){var c=S0(el,cfg,290,'헤도닉 임금함수: 근로자마다 고르는 위험 수준'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var k=.5,al=[.25,.5,1],pick=1;
  S(row,'시장의 위험 1단위 값 k(만 원)',.1,1,.05,k,fx(2),function(v){k=v;draw()});buttons(row,'근로자',[[0,'A(위험 덜 싫어함)'],[1,'B(보통)'],[2,'C(위험 매우 싫어함)']],pick,function(v){pick=v;draw()});
  function draw(){var W=function(r){return 200+20*k*r-.6*r*r*k},sl=function(r){return 20*k-1.2*k*r};
    var ch=al.map(function(a){var r=(20*k-2*a)/(1.2*k);return clamp(r,0,16)});
    var P=plot(c,290,{xlo:0,xhi:16,ylo:190,yhi:290,xl:'직무 위험(사고율, 가상 단위)',yl:'월급(만 원)',title:'초록 헤도닉 임금함수 · 점 = 근로자 A·B·C가 고른 일자리'});
    P.fn(W,COL.g,2.6);var cols=[COL.i,COL.a,COL.r];al.forEach(function(a,i){var r=ch[i],u0=W(r)-2*a*r;P.fn(function(x){return u0+2*a*x},cols[i],1.2,[4,3],Math.max(0,r-4),Math.min(16,r+4));P.dot(r,W(r),cols[i],i===pick?7:5,'ABC'[i])});stamp(P.ctx,P.W,'설명용 모형');
    var r=ch[pick];
    K([[f1(r,1),'고른 위험 수준','i'],[f1(W(r),1)+'만 원','받는 월급','a'],[f1(sl(r),2),'그 점에서 임금함수 기울기','m'],[f1(2*al[pick],2),'그 근로자가 위험 1단위에 원하는 보상','g']]);
    E('근로자는 무차별곡선(점선)이 임금함수에 접하는 곳을 골라요: 기울기 '+f1(20*k,1)+' − '+f1(1.2*k,2)+'r = '+f1(2*al[pick],2)+' → r = <i>'+f1(r,1)+'</i>');
    I([['i','헤도닉 임금함수는 위험 수준별로 시장에서 실제로 관찰되는 (위험, 임금) 조합이에요. 위험을 덜 싫어하는 A는 위험하지만 월급이 많은 일을, C는 안전하지만 월급이 적은 일을 골라요.'],['a','기업도 안전 투자 비용이 달라 서로 다른 위험 수준을 내놓아요(등이윤곡선). 근로자와 기업이 짝지어진 점들을 이은 선이 헤도닉 임금함수예요. 이 모형의 숫자는 설명용이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 통계적 생명가치와 해고 보상 */
SIMS.vsl=function(el,cfg){var c=S0(el,cfg,260,'위험수당에서 생명의 통계적 가치 읽어 내기'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var mode=0,prem=700,dr=1,hs=2000,hl=1600,ws=20;
  buttons(row,'계산',[[0,'통계적 생명가치(VSL)'],[1,'해고 위험 보상']],mode,function(v){mode=v;draw()});
  S(row,'연간 위험수당(달러)',100,2000,50,prem,null,function(v){prem=v;draw()});S(row,'추가 사망위험(1만 명당)',.5,5,.5,dr,fx(1),function(v){dr=v;draw()});
  S(row,'해고 직장 연간 근로시간',1000,2000,50,hl,null,function(v){hl=v;draw()});
  function draw(){var vsl=prem/(dr/10000),wl=ws*hs/hl;
    if(!mode){lbarPlot(c,260,'1만 명이 각자 수당을 받으면 모이는 돈 = 사망 '+f1(dr,1)+'명의 값',[{v:prem*10000/1e6,c:COL.a,t:f1(prem*10000/1e6,1)+'백만',n:'1만 명 수당 합'},{v:vsl/1e6,c:COL.r,t:f1(vsl/1e6,1)+'백만',n:'사망 1명당(VSL)'}],Math.max(prem*1e4,vsl)/1e6*1.2)}
    else{lbarPlot(c,260,'연소득을 같게 맞추는 시급',[{v:ws*hs,c:COL.s,t:nf(ws*hs),n:'안정 직장 연소득'},{v:wl*hl,c:COL.g,t:nf(Math.round(wl*hl)),n:'해고 직장 연소득'},{v:ws,c:COL.s,t:'$'+ws,n:'안정 직장 시급'},{v:wl,c:COL.g,t:'$'+f1(wl,2),n:'필요한 시급'}],ws*hs*1.2)}
    K(mode?[['$'+f1(wl,2),'해고 직장에 필요한 시급','g'],[pc(wl/ws-1,1),'보상적 임금격차','a'],[nf(hl)+'시간','해고 직장 근로시간','i'],[usd(ws*hs),'연소득(같게 맞춤)','m']]:[[usd(vsl),'통계적 생명가치 VSL','a'],[usd(prem),'1인 연간 위험수당','i'],[f1(dr,1)+'명','1만 명당 추가 사망','r'],[usd(prem*10000),'1만 명 수당 합','m']]);
    E(mode?'시급 × 시간을 같게: '+ws+' × '+nf(hs)+' = w × '+nf(hl)+' → w = <i>$'+f1(wl,2)+'</i>':'VSL = 위험수당 ÷ 추가 위험 = '+prem+' ÷ ('+f1(dr,1)+' ÷ 10,000) = <i>'+usd(vsl)+'</i>');
    I(mode?[['a','해고 위험이 있는 일은 일하는 시간이 적어 시급이 높아야 같은 연소득을 받아요(교과서 그림 5-9). 실업보험이 있으면 필요한 수당이 줄어요.'],['i','숫자는 예시값이에요.']]:[['a','근로자 1만 명이 각자 '+usd(prem)+'씩 더 받고 사망 '+f1(dr,1)+'명을 감수한다면, 그들은 사망 1명을 '+usd(vsl)+'로 평가한 셈이에요. 특정인의 목숨값이 아니라 작은 위험 변화의 값이에요.'],['i','미국 연구의 VSL 추정치는 수백만~1천만 달러대로 폭이 넓어요. 안전규제(OSHA)의 비용과 편익을 비교할 때 이 값을 써요.']]) }
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH07 교육 ===== */
function pvStream(a,startAge,endAge,r,pay,tuition,study){var s=0;for(var t=0;t<endAge-startAge;t++){var age=startAge+t,v=age<startAge+study?-tuition:pay;s+=v/Math.pow(1+r,t)}return s}
SIMS.pvschool=function(el,cfg){var c=S0(el,cfg,280,'고졸 바로 취업 vs 대학 4년: 생애소득의 현재가치'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var wh=2800,wc=4000,tu=700,r=5;
  S(row,'고졸 연봉(만 원)',2000,4000,100,wh,null,function(v){wh=v;draw()});S(row,'대졸 연봉(만 원)',2500,6000,100,wc,null,function(v){wc=v;draw()});S(row,'연 등록금(만 원)',0,1500,50,tu,null,function(v){tu=v;draw()});S(row,'할인율 r(%)',1,12,.5,r,fx(1),function(v){r=v;draw()});
  function PV(rr){return {hs:pvStream(0,18,65,rr,wh,0,0),col:pvStream(0,18,65,rr,wc,tu,4)}}
  function draw(){var p=PV(r/100),irr=bisect(function(x){var q=PV(x);return q.col-q.hs},0.001,.6);
    var P=plot(c,280,{xlo:18,xhi:65,ylo:-1600,yhi:6500,xl:'나이',yl:'연 소득(만 원)',title:'파랑 고졸 소득 흐름 · 초록 대졸 소득 흐름(처음 4년은 등록금만큼 마이너스)'});
    P.fn(function(a){return wh},COL.s,2.4,null,18,65);P.fn(function(a){return a<22?-tu:wc},COL.g,2.4,null,18,65);P.seg(18,0,65,0,COL.muted,1,[3,3]);stamp(P.ctx,P.W,'예시값');
    K([[nf(Math.round(p.hs)),'고졸 생애소득 현재가치','i'],[nf(Math.round(p.col)),'대졸 생애소득 현재가치','g'],[p.col>p.hs?'대학 진학':'바로 취업','현재가치가 큰 쪽',p.col>p.hs?'g':'a'],[pc(irr,1),'둘이 같아지는 할인율(내부수익률)','m']]);
    E('PV = Σ 소득<sub>t</sub> ÷ (1 + r)<sup>t</sup> · 고졸 '+nf(Math.round(p.hs))+' vs 대졸 '+nf(Math.round(p.col))+' (r = '+r+'%)');
    I([[p.col>p.hs?'g':'a','미래 소득은 기다린 만큼 할인해요. 할인율이 '+pc(irr,1)+'보다 낮은 사람은 대학이, 높은 사람(지금 돈이 급한 사람)은 바로 취업이 더 나아요.'],['i','대학의 비용은 등록금(직접비용)만이 아니에요. 4년 동안 포기한 고졸 소득(기회비용)이 더 커요. 그림에서 처음 4년 파랑과 초록의 간격이 그 비용이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 정지규칙: MRR(s) = r */
SIMS.stoprule=function(el,cfg){var c=S0(el,cfg,270,'학교를 언제 그만둘까: 한계수익률 = 할인율'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var r=6,ab=0,s=16;
  S(row,'할인율 r(%)',2,14,.5,r,fx(1),function(v){r=v;draw()});S(row,'능력(한계수익률을 올리는 정도, %p)',-3,3,.5,ab,fx(1),function(v){ab=v;draw()});S(row,'내가 고른 학교교육 연수',8,20,1,s,null,function(v){s=v;draw()});
  function draw(){var mr=function(x){return 24+ab-1.2*x},sstar=clamp((24+ab-r)/1.2,8,20);
    var P=plot(c,270,{xlo:8,xhi:20,ylo:0,yhi:16,xl:'학교교육 연수 s',yl:'%',title:'초록 한계수익률 MRR(1년 더 다닐 때 임금 증가율) · 빨강 할인율 r'});
    P.fn(mr,COL.g,2.4);P.seg(8,r,20,r,COL.r,2.2);P.dot(sstar,r,COL.g,6,'s* = '+f1(sstar,1));P.seg(s,0,s,16,COL.a,1.4,[4,3]);stamp(P.ctx,P.W,'설명용 모형');
    K([[f1(sstar,1)+'년','최적 학교교육 s*','g'],[f1(mr(s),1)+'%','내가 고른 연수의 MRR','i'],[r+'%','할인율','r'],[s<sstar-.5?'더 다니는 게 이득':s>sstar+.5?'너무 오래 다님':'최적 근처','판정',Math.abs(s-sstar)<=.5?'g':'a']]);
    E('MRR(s) = '+f1(24+ab,1)+' − 1.2s = r = '+r+' → s* = ('+f1(24+ab,1)+' − '+r+') ÷ 1.2 = <i>'+f1(sstar,1)+'</i>');
    I([[Math.abs(s-sstar)<=.5?'g':'a','1년 더 다닐 때 임금이 오르는 비율(MRR)이 할인율보다 크면 더 다니고, 같아지는 곳에서 멈춰요(정지규칙).'],['i','할인율이 높은 사람(지금 돈이 급함)은 일찍 그만두고, 능력이 높은 사람(MRR이 높음)은 더 오래 다녀요. 그래서 교육과 임금의 관계에는 능력 차이도 섞여 있어요(다음 단계).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 민서 임금방정식 실습: 모의 자료 N=500, 능력 편의 */
function ols(X,y){var k=X[0].length,A=[],b=[];for(var i=0;i<k;i++){A.push(new Array(k).fill(0));b.push(0)}X.forEach(function(x,n){for(var i=0;i<k;i++){b[i]+=x[i]*y[n];for(var j=0;j<k;j++)A[i][j]+=x[i]*x[j]}});
  for(var i=0;i<k;i++){var p=i;for(var r=i+1;r<k;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;var t=A[i];A[i]=A[p];A[p]=t;var tb=b[i];b[i]=b[p];b[p]=tb;for(var r2=i+1;r2<k;r2++){var f=A[r2][i]/A[i][i];for(var j=i;j<k;j++)A[r2][j]-=f*A[i][j];b[r2]-=f*b[i]}}
  var x=new Array(k).fill(0);for(var i2=k-1;i2>=0;i2--){var s=b[i2];for(var j2=i2+1;j2<k;j2++)s-=A[i2][j2]*x[j2];x[i2]=s/A[i2][i2]}return x}
function mincerData(seed,bS,gA,link){var R=rng(seed),D=[];for(var i=0;i<500;i++){var a=gauss(R),S=clamp(Math.round(12+link*a+1.6*gauss(R)),8,20),X=clamp(Math.round(5+20*R()),0,40),lw=1.2+bS*S+.04*X-.0007*X*X+gA*a+.3*gauss(R);D.push({S:S,X:X,a:a,lw:lw})}return D}
SIMS.mincerlab=function(el,cfg){var c=S0(el,cfg,280,'모의 자료 500명으로 추정하는 교육수익률'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var bS=.08,gA=.1,link=1,seed=1;
  S(row,'진짜 교육수익률 β₁',.03,.15,.01,bS,fx(2),function(v){bS=v;draw()});S(row,'능력이 임금에 주는 효과',0,.25,.01,gA,fx(2),function(v){gA=v;draw()});S(row,'능력이 교육연수를 늘리는 정도',0,2,.25,link,fx(2),function(v){link=v;draw()});action(row,'↻ 다른 표본 뽑기',function(){seed++;draw()});
  function draw(){var D=mincerData(seed*97+5,bS,gA,link),y=D.map(function(d){return d.lw});
    var b1=ols(D.map(function(d){return [1,d.S,d.X,d.X*d.X]}),y),b2=ols(D.map(function(d){return [1,d.S,d.X,d.X*d.X,d.a]}),y);
    var P=plot(c,280,{xlo:7,xhi:21,ylo:1.5,yhi:4.2,xl:'교육 연수 S',yl:'로그 임금 ln w',title:'점 = 모의 근로자 · 빨강 능력 빼고 추정한 기울기 · 초록 능력 넣고 추정한 기울기'});
    var ctx=P.ctx;D.forEach(function(d){ctx.fillStyle=d.a>0?'rgba(210,63,44,.35)':'rgba(37,99,201,.35)';ctx.beginPath();ctx.arc(P.X(d.S+(d.X%7-3)*.04),P.Y(clamp(d.lw-.04*d.X+.0007*d.X*d.X+.04*15-.0007*225,1.5,4.2)),2.2,0,7);ctx.fill()});
    var mx=15,base=function(b,x){return b[0]+b[1]*x+b[2]*15+b[3]*225};P.fn(function(x){return base(b1,x)},COL.r,2.4,null,8,20);P.fn(function(x){return base(b2,x)+(b2[4]||0)*0},COL.g,2.4,[6,4],8,20);stamp(P.ctx,P.W,'N = 500 모의 자료');
    K([[f1(bS,3),'진짜 β₁(설정값)','i'],[f1(b1[1],3),'능력을 빼고 추정한 β₁',Math.abs(b1[1]-bS)>.01?'r':'g'],[f1(b2[1],3),'능력을 넣고 추정한 β₁','g'],[(b1[1]-bS>=0?'+':'')+f1(b1[1]-bS,3),'능력 편의(과대추정)','a']]);
    E('ln w = β₀ + β₁S + β₂X − β₃X² + ε · 능력 a가 ε 안에 숨어 S와 함께 움직이면 β̂₁이 진짜보다 커져요 → '+f1(b1[1],3)+' vs '+f1(bS,3));
    I([[b1[1]-bS>.01?'r':'g',b1[1]-bS>.01?'능력이 높은 사람이 공부도 오래 하고 임금도 높아서, 능력을 모르면 그 몫까지 교육 효과로 잡혀요(생략변수 편의, 능력 편의).':'능력이 교육연수와 관계없거나 임금에 영향이 없으면 편의가 거의 없어요.'],['i','실제로는 능력을 관측할 수 없어요. 그래서 경제학자들은 일란성 쌍둥이 비교(애셴펠터·크루거), 의무교육 제도 변화나 인도네시아 학교 건설 같은 도구변수·자연실험으로 진짜 효과를 찾아요. 빨간 점은 능력이 평균보다 높은 사람이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH08 임금분포 ===== */
/* 직장 내 훈련: 일반 vs 특수 */
SIMS.ojt=function(el,cfg){var c=S0(el,cfg,270,'훈련 비용은 누가 낼까: 일반 훈련 vs 특수 훈련'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var type=0,H=10,g=30,sh=50;
  buttons(row,'훈련 종류',[[0,'일반 훈련(어디서나 쓰임)'],[1,'특수 훈련(이 회사에서만)']],type,function(v){type=v;draw()});
  S(row,'훈련 비용 H(만 원/월)',0,40,2,H,null,function(v){H=v;draw()});S(row,'훈련 뒤 생산성 증가(만 원/월)',0,60,2,g,null,function(v){g=v;draw()});S(row,'특수 훈련에서 근로자 몫(%)',0,100,10,sh,null,function(v){sh=v;draw()});
  function draw(){var v0=200,s=sh/100,w1=type?v0-s*H:v0-H,w2=type?v0+s*g:v0+g,out=type?v0:v0+g,firm1=v0-H-w1,firm2=(v0+g)-w2;
    lbarPlot(c,270,'월급(만 원): 훈련 기간 · 훈련 뒤 · 훈련 뒤 다른 회사가 주는 값',[{v:w1,c:COL.r,t:f1(w1,0),n:'훈련 중 월급'},{v:w2,c:COL.g,t:f1(w2,0),n:'훈련 뒤 월급'},{v:out,c:COL.muted,t:f1(out,0),n:'다른 회사 제안'},{v:v0+g,c:COL.s,t:f1(v0+g,0),n:'훈련 뒤 생산성'}],(v0+60)*1.15);
    K([[f1(v0-w1,0)+'만 원','근로자가 낸 훈련비(깎인 월급)','r'],[f1(firm1+firm2,0)+'만 원','회사의 순이득(두 기간 합)',Math.abs(firm1+firm2)<.5?'i':firm1+firm2>0?'g':'r'],[w2>=out?'남음':'떠남','훈련 뒤 이직 유인',w2>=out?'g':'r'],[type?'공동 부담':'근로자 부담','비용 부담 구조','a']]);
    E(type?'특수 훈련: 훈련 중 월급 = 200 − '+sh+'% × '+H+' = '+f1(w1,1)+' · 훈련 뒤 = 200 + '+sh+'% × '+g+' = '+f1(w2,1):'일반 훈련: 훈련 중 월급 = 200 − '+H+' = '+f1(w1,0)+' · 훈련 뒤 = 생산성 200 + '+g+' = '+f1(w2,0)+' (다른 회사도 이만큼 줌)');
    I([[type?'a':'r',type?'특수 훈련은 다른 회사에서 쓸모가 없어 바깥 제안이 오르지 않아요. 회사와 근로자가 비용과 이익을 나누면 둘 다 관계를 이어 갈 이유가 생겨 이직·해고가 줄어요.':'일반 훈련은 다른 회사도 그 가치를 알아줘요. 회사가 비용을 내면 훈련 뒤 근로자가 떠나 버릴 수 있어, 근로자가 낮은 월급으로 비용을 내요.'],['i','그래서 연령-소득 프로필이 위로 올라가요. 젊을 때 훈련으로 덜 받고, 나중에 더 받아요. 특수 훈련을 받은 근로자가 불황에도 덜 해고되는 이유이기도 해요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 불평등 측정: 로그정규 임금분포 */
SIMS.ineq=function(el,cfg){var c=S0(el,cfg,280,'임금 불평등 재기: 분위수 비율·로렌츠 곡선·지니계수'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var sg=.6,fl=0;
  S(row,'임금 분산 σ(로그 임금 표준편차)',.2,1.2,.05,sg,fx(2),function(v){sg=v;draw()});S(row,'최저임금 바닥(하위 몇 %를 끌어올림)',0,20,2,fl,function(v){return v+'%'},function(v){fl=v;draw()});
  function draw(){var z9=1.2816,q=function(p){return Math.exp(sg*PhiInv(p))},bot=fl>0?q(fl/100):0,Q=function(p){return Math.max(q(p),bot)};
    var r9010=Q(.9)/Q(.1),r5010=Q(.5)/Q(.1),r9050=Q(.9)/Q(.5);
    var N=400,xs=[],tot=0;for(var i=0;i<N;i++){var v=Q((i+.5)/N);xs.push(v);tot+=v}var cum=[0];xs.forEach(function(v){cum.push(cum[cum.length-1]+v/tot)});var gini=0;for(var i2=0;i2<N;i2++)gini+=(1/N)*(cum[i2]+cum[i2+1]);gini=1-gini;
    var P=plot(c,280,{xlo:0,xhi:1,ylo:0,yhi:1,xl:'아래부터 센 인구 비율',yl:'소득 비율',title:'회색 완전평등선 · 파랑 로렌츠 곡선 · 사이 면적 × 2 = 지니계수',fx:function(v){return Math.round(v*100)+'%'},fy:function(v){return Math.round(v*100)+'%'}});
    P.seg(0,0,1,1,COL.muted,1.4,[4,3]);var pts=[[0,0]];for(var k=0;k<=N;k+=4)pts.push([k/N,cum[k]]);pts.push([1,0]);P.poly(pts,COL.s,.15);P.fn(function(p){return cum[Math.round(p*N)]},COL.s,2.6,null,0,1);stamp(P.ctx,P.W,'로그정규 분포 가정');
    K([[f1(r9010,2),'90-10 비율(전체 격차)','r'],[f1(r5010,2),'50-10 비율(하단 격차)','a'],[f1(r9050,2),'90-50 비율(상단 격차)','m'],[f1(gini,3),'지니계수(0 평등 ~ 1 불평등)','i']]);
    E('로그정규에서 90-10 비율 = e<sup>2 × 1.2816σ</sup> = e<sup>'+f1(2*z9*sg,3)+'</sup> = <i>'+f1(Math.exp(2*z9*sg),2)+'</i>'+(fl?' (바닥 적용 전)':''));
    I([['i','분위수 비율은 극단값에 흔들리지 않고 분포의 어느 쪽(하단·상단)이 벌어졌는지 보여 줘요. 지니계수는 분포 전체를 숫자 하나로 요약해요.'],[fl?'g':'a',fl?'바닥을 올리니 50-10 비율이 줄고 90-50은 그대로예요. 최저임금은 하단 격차에 주로 작용해요(교과서: 1980년대 미국 실질 최저임금 하락이 50-10 격차를 벌렸다는 연구).':'바닥 슬라이더를 올려 보세요. 하단 격차만 줄어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 숙련 프리미엄: 교육과 기술의 경주 */
SIMS.sbtc=function(el,cfg){var c=S0(el,cfg,270,'대졸 임금 프리미엄: 기술의 수요 증가 vs 대졸자 공급 증가'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var gD=3.5,gS=3.5,sig=1.4,un=0;
  S(row,'숙련 편향 기술진보(수요 증가, %/년)',0,6,.25,gD,fx(2),function(v){gD=v;draw()});S(row,'대졸자 상대공급 증가(%/년)',0,6,.25,gS,fx(2),function(v){gS=v;draw()});S(row,'노조·제도의 압축 효과(%p)',0,20,2,un,null,function(v){un=v;draw()});
  function prem(t){return Math.exp(Math.log(1.45)+(gD-gS)/100*(t-1980)/sig)-un/100}
  function draw(){var p20=prem(2020),p80=prem(1980);
    var P=plot(c,270,{xlo:1980,xhi:2020,ylo:1,yhi:2.6,xl:'연도',yl:'대졸 ÷ 고졸 임금',title:'대졸 임금 프리미엄 경로 · log 프리미엄 변화 = (수요 증가 − 공급 증가) ÷ σ',fx:function(v){return String(v)}});
    P.fn(prem,COL.r,2.6);P.seg(1980,1.45-un/100,2020,1.45-un/100,COL.muted,1.2,[4,3]);P.dot(2020,p20,COL.r,5,f1(p20,2)+'배');stamp(P.ctx,P.W,'σ = 1.4 가정');
    K([[f1(p80,2)+'배','1980년 프리미엄','i'],[f1(p20,2)+'배','2020년 프리미엄',p20>p80+.01?'r':p20<p80-.01?'g':'i'],[f1(gD-gS,2)+'%p','수요 − 공급 증가 속도',gD>gS?'r':'g'],[gD>gS?'기술이 앞섬':gD<gS?'교육이 앞섬':'같은 속도','경주 결과','a']]);
    E('Δ ln(프리미엄) = (수요 증가 '+f1(gD,2)+'% − 공급 증가 '+f1(gS,2)+'%) ÷ σ '+sig+' = <i>'+f1((gD-gS)/sig,2)+'%</i>/년');
    I([[gD>gS?'r':'g',gD>gS?'기술이 대졸자를 원하는 속도가 대졸자가 늘어나는 속도보다 빨라 프리미엄이 커져요. 1980년대 이후 미국의 모습이에요.':gD<gS?'대졸자가 기술 수요보다 빨리 늘면 프리미엄이 줄어요.':'두 속도가 같으면 대졸자가 늘어도 프리미엄은 그대로예요.'],['i','교과서는 불평등이 커진 원인으로 ① 숙련 편향 기술진보 ② 세계화(무역) ③ 제도(최저임금 실질 하락·노조 쇠퇴)를 들어요. 숫자는 설명용이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH09 노동이동 ===== */
function pvGain(gap,r,N){if(!N)return (1+r)/r*gap;var s=0;for(var t=0;t<N;t++)s+=gap/Math.pow(1+r,t);return s}
SIMS.migpv=function(el,cfg){var c=S0(el,cfg,270,'이주는 투자다: 임금 차이의 현재가치 vs 이주 비용'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var wp=28300,wu=44770,r=5,age=0;
  S(row,'출신지 연봉 w_PR(달러)',15000,40000,100,wp,null,function(v){wp=v;draw()});S(row,'목적지 연봉 w_US(달러)',20000,70000,100,wu,null,function(v){wu=v;draw()});S(row,'할인율 r(%)',2,12,.5,r,fx(1),function(v){r=v;draw()});
  buttons(row,'일할 기간',[[0,'사실상 무한(교과서)'],[40,'40년(25세)'],[20,'20년(45세)'],[10,'10년(55세)']],age,function(v){age=v;draw()});
  function draw(){var gap=wu-wp,M=pvGain(gap,r/100,age),x=M/wp;
    var it=[[0,'무한'],[40,'40년'],[20,'20년'],[10,'10년']].map(function(a){var v=pvGain(gap,r/100,a[0]);return {v:v/1000,c:a[0]===age?COL.g:COL.muted,t:nf(Math.round(v/1000))+'천',n:a[1]}});
    lbarPlot(c,270,'남은 근로기간별 이주 이득의 현재가치(천 달러) = 감수할 수 있는 최대 이주 비용',it,pvGain(gap,r/100,0)/1000*1.15);
    K([[usd(gap),'연봉 차이','i'],[usd(M),'이주 이득의 현재가치 = 무차별한 이주 비용 M','a'],[f1(x,1)+'배','M ÷ 출신지 연봉','r'],[pc(gap/wp,1),'임금 상승률 (w_US − w_PR) ÷ w_PR','m']]);
    E(age?'이득 = Σ<sub>t=0..'+(age-1)+'</sub> '+nf(gap)+' ÷ 1.'+String(r/100).split('.')[1]+'<sup>t</sup> = <i>'+usd(M)+'</i>':'(1 + r) ÷ r × (w_US − w_PR) = '+f1((1+r/100)/(r/100),1)+' × '+nf(gap)+' = <i>'+usd(M)+'</i> → '+f1(x,1)+'배');
    I([['a','2016년 푸에르토리코 타일공 연봉 28,300달러, 미국 본토 44,770달러예요. 이주를 망설이는 사람이 느끼는 이주 비용은 연봉의 '+f1(x,1)+'배라는 계산이 나와요. 교과서는 상승률을 약 0.5로 어림해 10.5배(약 30만 달러)로 계산해요.'],['i','그런데도 푸에르토리코 사람의 3분의 2는 떠나지 않았어요. 이주 비용에는 교통비보다 고향·가족·문화를 떠나는 심리적 비용이 훨씬 크다는 뜻이에요. 나이가 들수록 이득을 거둘 기간이 짧아 덜 옮겨요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* Roy 모형: 이민자의 자기선택 */
SIMS.roy=function(el,cfg){var c=S0(el,cfg,270,'로이 모형: 누가 떠나는가(양의 선택 vs 음의 선택)'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var s0=1,s1=1.5,gap=.2;
  S(row,'출신국 임금 불평등 σ₀',.5,2,.1,s0,fx(1),function(v){s0=v;draw()});S(row,'목적국 임금 불평등 σ₁',.5,2,.1,s1,fx(1),function(v){s1=v;draw()});S(row,'평균 임금 차이 − 이주 비용',-1,1,.05,gap,fx(2),function(v){gap=v;draw()});
  function draw(){var k=s1/s0-1,cut=Math.abs(k)<1e-9?null:-gap/k,mig=function(e){return k>1e-9?e>cut:k<-1e-9?e<cut:gap>0};
    var share=k>1e-9?1-Phi(cut):k<-1e-9?Phi(cut):gap>0?1:0,mean=function(lo,hi){var a=Math.max(-6,lo),b=Math.min(6,hi);if(b<=a)return 0;return (Math.exp(-a*a/2)-Math.exp(-b*b/2))/Math.sqrt(2*Math.PI)/Math.max(1e-9,Phi(b)-Phi(a))},mM=k>1e-9?mean(cut,99):k<-1e-9?mean(-99,cut):0;
    var P=plot(c,270,{xlo:-3,xhi:3,ylo:0,yhi:.45,xl:'출신국에서의 숙련(표준화)',yl:'인구 비율',title:'출신국 숙련 분포 · 초록 칠한 쪽 = 떠나는 사람'});
    var pts=[];for(var e=-3;e<=3.001;e+=.05)if(mig(e))pts.push([e,Math.exp(-e*e/2)/Math.sqrt(2*Math.PI)]);if(pts.length){var ptsF=[[pts[0][0],0]].concat(pts).concat([[pts[pts.length-1][0],0]]);P.poly(ptsF,COL.g,.35)}
    P.fn(function(e){return Math.exp(-e*e/2)/Math.sqrt(2*Math.PI)},COL.s,2.4);if(cut!=null&&Math.abs(cut)<3)P.seg(cut,0,cut,.45,COL.a,1.6,[4,3]);stamp(P.ctx,P.W,'로이 모형, 숙련 상관 1');
    K([[pc(share,1),'떠나는 사람 비율','i'],[(mM>=0?'+':'')+f1(mM,2),'떠나는 사람의 평균 숙련',mM>0?'g':mM<0?'r':'i'],[s1>s0?'양의 선택':s1<s0?'음의 선택':'선택 없음','유형',s1>s0?'g':'r'],[cut==null?'없음':f1(cut,2),'떠나는 숙련 기준점','a']]);
    E('떠날 조건: (σ₁ ÷ σ₀ − 1) × 숙련 > −(평균 차이 − 비용) → '+f1(k,2)+' × e > '+f1(-gap,2));
    I([[s1>s0?'g':'r',s1>s0?'목적국이 숙련에 더 큰 보상을 주면(불평등이 큼) 숙련이 높은 사람이 떠나요(양의 선택, 두뇌 유출).':s1<s0?'출신국이 숙련에 더 큰 보상을 주면 숙련이 낮은 사람이 떠나요(음의 선택). 목적국의 복지·평등이 낮은 숙련자에게 보험처럼 작용해요.':'두 나라의 보상 구조가 같으면 숙련과 관계없이 평균 차이로만 결정돼요.'],['i','이민자 수입국이 원하는 인재를 모으려면 숙련 보상 구조와 선발 제도(점수제 등)를 함께 봐야 한다는 시사점이 나와요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 동화와 코호트 효과 */
SIMS.cohort=function(el,cfg){var c=S0(el,cfg,270,'단면 자료의 착시: 동화 속도와 코호트 효과'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var g=8,q=8;
  S(row,'진짜 동화 속도(10년마다 임금 격차 축소, %p)',0,20,1,g,null,function(v){g=v;draw()});S(row,'최근 코호트의 질 하락(10년마다 입국 임금, %p)',0,20,1,q,null,function(v){q=v;draw()});
  function entry(y){return -15-q*(y-1980)/10}function path(y,t){return entry(y)+g*(t-y)/10}
  function draw(){var cs=function(yrs){return path(2010-yrs,2010)};
    var P=plot(c,270,{xlo:0,xhi:30,ylo:-50,yhi:20,xl:'미국 거주 연수',yl:'내국인 대비 임금(%)',title:'빨강 2010년 단면 자료 · 색 선 = 입국 코호트별 실제 경로 · 회색 = 내국인'});
    P.seg(0,0,30,0,COL.muted,1.4,[4,3]);[1980,1990,2000].forEach(function(y,i){P.fn(function(t){return path(y,y+t)},[COL.i,COL.a,COL.m][i],1.8,null,0,2010-y+.01);P.dot(0,entry(y),[COL.i,COL.a,COL.m][i],4,y+'년 입국',8,10)});
    P.fn(function(t){return cs(t)},COL.r,2.6,[6,4],0,30);stamp(P.ctx,P.W,'설명용 모형');
    var slopeCS=(cs(30)-cs(0))/3,slopeTrue=g;
    K([[f1(slopeCS,1)+'%p','단면 자료가 말하는 10년당 따라잡기','r'],[f1(slopeTrue,1)+'%p','진짜 10년당 따라잡기','g'],[(slopeCS-slopeTrue>=0?'+':'')+f1(slopeCS-slopeTrue,1)+'%p','과대추정(코호트 효과)','a'],[f1(cs(30),1)+'%','단면에서 30년 차 이민자 임금',cs(30)>0?'a':'i']]);
    E('단면 기울기 = 진짜 동화 '+g+' + 코호트 질 하락 '+q+' = <i>'+f1(slopeCS,1)+'</i>%p / 10년');
    I([[q?'a':'g',q?'한 해의 자료로 30년 차와 1년 차를 비교하면, 일찍 온 코호트가 원래 더 숙련된 사람들이었던 차이까지 "적응"으로 착각해요. 이민자가 30년 뒤 내국인을 앞지르는 것처럼 보이기도 해요.':'코호트의 질이 같으면 단면 자료도 진짜 동화 속도를 보여 줘요.'],['i','같은 코호트를 여러 해 따라가는 패널 자료로 보면 착시가 사라져요. 보하스는 이 방법으로 미국 이민자의 동화 속도가 예상보다 느리다는 결과를 냈어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== 조교 대결 ===== */
DUELS.alaska=function(){var after=alaskaEq(0,40).w;return {fly:Math.abs(20-after),robo:Math.abs(30-after),say:'공사가 끝난 직후(유입된 40명은 아직 남아 있음) 균형 시급은 $'+after.toFixed(0)+'예요. 초파리 조교 예측 $20(오차 '+Math.abs(20-after).toFixed(0)+'), 주판봇 조교 예측 $30(오차 '+Math.abs(30-after).toFixed(0)+').'}};
DUELS.discour=function(){return {fly:0,robo:20,say:'실업자 40만 명 중 20만 명이 구직을 포기했어요. 실업률은 6.25% → 3.23%로 내려갔지만 취업자는 600만 명 그대로예요. 주판봇 조교는 "실업률이 내렸으니 20만 명이 취업했다"고 봤어요.'}};
DUELS.wageup=function(){var L0=cdL(20,320,112),L1=cdL(30,320,112),Lh=Math.sqrt(1280*64/30),truth=L0-L1,fly=truth,robo=L0-Lh;return {fly:Math.abs(fly-truth),robo:Math.abs(robo-truth),say:'시급 20 → 30달러: 실제 근로시간 변화 +'+truth.toFixed(1)+'시간. 초파리 조교(대체효과 + 소득효과) +'+fly.toFixed(1)+'시간, 주판봇 조교(대체효과만) +'+robo.toFixed(1)+'시간.'}};
DUELS.aicost=function(){var Y=20,a=4,b=2,w=8,r=3;return {fly:w/a*Y,robo:r/b*Y,say:'AI 사용료가 6 → 3으로 내렸어요. 산출 20을 만드는 비용: 사람만 쓰면 '+(w/a*Y)+'(단위비용 2), AI만 쓰면 '+(r/b*Y)+'(단위비용 1.5). 임계임금 w* = 2 × 3 = 6이 시급 8보다 낮아요.'}};
DUELS.monopsony=function(){return {fly:minres(1,12).E,robo:minres(1,0).E,say:'지역 유일 공장(수요독점)에서 최저임금 12달러면 고용 '+minres(1,12).E.toFixed(1)+'명, 최저임금이 없으면 '+minres(1,0).E.toFixed(1)+'명이에요.'}};
DUELS.layoff=function(){var need=20*2000/1600;return {fly:Math.abs(need*1600-20*2000),robo:Math.abs(20*1600-20*2000),say:'안정 직장: 20달러 × 2,000시간 = 40,000달러. 해고 위험 직장(1,600시간)에서 초파리 조교 제안 $'+need.toFixed(2)+'이면 연소득 차이 0, 주판봇 조교 제안 $20이면 8,000달러 적어요.'}};
DUELS.college=function(){var r=.06,hs=pvStream(0,18,65,r,2800,0,0),col=pvStream(0,18,65,r,4000,700,4),irr=bisect(function(x){return pvStream(0,18,65,x,4000,700,4)-pvStream(0,18,65,x,2800,0,0)},.001,.6);return {fly:hs,robo:col,say:'할인율 6%에서 생애소득 현재가치: 바로 취업 '+nf(Math.round(hs))+'만 원, 대학 진학 '+nf(Math.round(col))+'만 원. 내부수익률이 약 '+(irr*100).toFixed(1)+'%라 6%에서는 대학이 이득이에요(8%라면 반대).'}};
DUELS.race=function(){return {fly:0,robo:.25,say:'기술 수요와 대졸 공급이 같은 속도(연 3.5%)로 늘면 프리미엄은 40년 뒤에도 1.45배 그대로예요. 주판봇 조교는 대졸자가 늘어난 것만 보고 1.20배로 떨어진다고 예측해 0.25배 빗나갔어요.'}};
DUELS.cohortd=function(){var g=8,q=8;return {fly:0,robo:q*3,say:'1980년 입국 코호트를 30년 따라가면 실제로 '+g*3+'%p 따라잡았어요. 주판봇 조교는 2010년 단면 자료의 기울기로 '+(g+q)*3+'%p라고 예측해 '+q*3+'%p 과대추정했어요.'}};

/* ===== 특별 부록: 생산함수와 AI 대체 시대 (저자 작성 부록) ===== */
/* 네 가지 생산함수의 등량곡선(Y = 20, a = 4, b = 2)과 비용 최소점 */
function q4opt(t,w,r){var Y=20,a=4,b=2;if(t===0)return {L:Y/a,K:Y/b};if(t===1){return w/a<r/b?{L:Y/a,K:0}:w/a>r/b?{L:0,K:Y/b}:{L:Y/(2*a),K:Y/(2*b)}}
  if(t===2){var L=Y/Math.sqrt(a*b)*Math.sqrt(r/w);return {L:L,K:Y*Y/(a*b*L)}}var Lq=Math.min(9*r*r/(b*b*w*w),Y*Y/36);return {L:Lq,K:Math.max(0,(Y-6*Math.sqrt(Lq))/b)}}
SIMS.isoq4=function(el,cfg){var c=S0(el,cfg,300,'네 가지 생산함수: 같은 산출(Y = 20)을 만드는 노동·자본 조합'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var t=0,w=8,r=6,names=['레온티에프 min(4L, 2K)','선형 4L + 2K','콥-더글러스 √8·L^½K^½','준선형 6√L + 2K'],sig=['0 (완전보완)','∞ (완전대체)','1 (부분 대체)','L에 따라 변함'];
  buttons(row,'생산함수',[[0,'레온티에프'],[1,'선형'],[2,'콥-더글러스'],[3,'준선형']],t,function(v){t=v;draw()});
  S(row,'시급 w',1,20,.5,w,fx(1),function(v){w=v;draw()});S(row,'AI·자본 사용료 r',.5,12,.5,r,fx(1),function(v){r=v;draw()});
  function iso(x){if(t===0)return x<5?NaN:10;if(t===1)return (20-4*x)/2;if(t===2)return 50/x;return (20-6*Math.sqrt(x))/2}
  function draw(){var o=q4opt(t,w,r),TC=w*o.L+r*o.K;
    var P=plot(c,300,{xlo:0,xhi:14,ylo:0,yhi:16,xl:'노동 L',yl:'자본(AI) K',title:'보라 등량곡선 · 파랑 최소 비용 등비용선 · 점 = 비용 최소 조합'});
    if(t===0){P.seg(5,10,14,10,COL.m,2.6);P.seg(5,10,5,16,COL.m,2.6)}else P.fn(iso,COL.m,2.6,null,t===2?50/16:0,t===1?5:t===3?11.1:14);
    P.fn(function(x){return (TC-w*x)/r},COL.s,1.8,[5,4],0,14);P.dot(o.L,o.K,COL.g,6,'최소');stamp(P.ctx,P.W,'Y = 20');
    K([[f1(o.L,2),'노동수요 L*',o.L>0?'g':'r'],[f1(o.K,2),'자본(AI) 수요 K*','i'],[nf(Math.round(TC)),'최소 총비용','a'],[sig[t],'대체탄력성 σ','m']]);
    E(t===0?'4L = 2K = 20 → L* = 5, K* = 10 (가격과 무관)':t===1?'단위비용 노동 '+f1(w/4,2)+' vs AI '+f1(r/2,2)+' → 싼 쪽만(코너해) · 임계임금 w* = 2r = '+f1(2*r,1):t===2?'K ÷ L = w ÷ r → L* = 20 ÷ √8 × √(r ÷ w) = <i>'+f1(o.L,2)+'</i>':'MRTS = f′(L) ÷ b = 3 ÷ (2√L) = w ÷ r → L* = 9r² ÷ (4w²) = <i>'+f1(o.L,2)+'</i>');
    I([['i',['보완: 사람 한 명에 기계 한 대처럼 비율이 고정이에요. 등량곡선이 L자라 가격이 바뀌어도 꼭짓점에 머물러요.','완전대체: 등량곡선이 직선이라 등비용선과 기울기를 비교해 끝점(코너)만 골라요.','부분 대체: 볼록한 등량곡선에 등비용선이 접하는 곳. 가격이 바뀌면 조합이 조금씩 움직여요.','준선형: MRTS가 L에만 달려 있어 등량곡선이 위아래로 평행이동한 모양이에요. 보완과 대체가 섞인 일(자동화 + 사람)을 그릴 때 써요.'][t]],['a','부록의 핵심 질문: AI는 생산함수를 레온티에프·콥-더글러스(보완·부분 대체)에서 선형(완전대체)으로 옮겨 놓는가?']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* AI 가격 하락과 노동수요: 레온티에프 vs 선형 vs 콥-더글러스 */
SIMS.rcliff=function(el,cfg){var c=S0(el,cfg,280,'AI 사용료가 내려갈 때 노동수요: 수직·절벽·완만'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var w=8,r=6;
  S(row,'시급 w',1,20,.5,w,fx(1),function(v){w=v;draw()});S(row,'AI 사용료 r(ChatGPT 초저가로 내려 보기)',.1,12,.1,r,fx(1),function(v){r=v;draw()});
  function draw(){var lin=function(rr){return w<2*rr?5:w>2*rr?0:2.5},cd=function(rr){return q4opt(2,w,rr).L};
    var P=plot(c,280,{xlo:0,xhi:12,ylo:0,yhi:10,xl:'AI 사용료 r',yl:'노동수요 L*',title:'보라 레온티에프 · 빨강 선형(완전대체) · 파랑 콥-더글러스 · 주황 점선 = 지금 r'});
    P.seg(0,5,12,5,COL.m,2.2);var x0=w/2;P.seg(0,0,x0,0,COL.r,2.6);P.seg(x0,0,x0,5,COL.r,1.2,[3,3]);P.seg(x0,5,12,5,COL.r,2.6);P.fn(cd,COL.s,2.2,null,.1,12);
    P.seg(r,0,r,10,COL.a,1.4,[4,3]);P.dot(r,lin(r),COL.r,6,'선형');P.dot(r,cd(r),COL.s,5,'CD',8,14);stamp(P.ctx,P.W,'Y = 20, a = 4, b = 2');
    K([['$'+f1(2*r,1),'임계임금 w* = (a ÷ b)r','a'],[f1(lin(r),2),'선형 노동수요',lin(r)>0?'g':'r'],[f1(cd(r),2),'콥-더글러스 노동수요','i'],['5.00','레온티에프 노동수요(고정)','m']]);
    E('w* = (4 ÷ 2) × '+f1(r,1)+' = '+f1(2*r,1)+(w>2*r?' < 시급 '+f1(w,1)+' → 선형 기술에서 노동수요 0':' ≥ 시급 '+f1(w,1)+' → 노동 유지(L* = Y ÷ a = 5)'));
    I([[w>2*r?'r':'g',w>2*r?'AI 사용료가 시급의 절반 아래로 내려가는 순간 선형 기술의 노동수요가 5에서 0으로 뚝 떨어져요. 부록의 "ChatGPT 초저가 시나리오"예요.':'아직은 사람의 단위비용이 더 싸요. r을 '+f1(w/2,1)+' 아래로 내려 보세요.'],['i','r → 0이면 w* → 0이라 어떤 양의 임금도 AI보다 비싸져요. 임계 부근에서 노동수요의 임금탄력성은 무한대로 발산해요. 레온티에프는 AI 가격과 상관없이 그대로, 콥-더글러스는 서서히 줄어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 시장임금 하락과 실망실업: 의향임금이 2~14달러에 고르게 퍼진 100명 */
SIMS.discwork=function(el,cfg){var c=S0(el,cfg,280,'시장임금이 의향임금 아래로: 실망실업과 통계의 착시'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var r=6;
  S(row,'AI 사용료 r(시장임금 상한 w* = 2r)',.5,8,.25,r,fx(2),function(v){r=v;draw()});
  function draw(){var wm=Math.min(12,2*r),part=Math.max(0,Math.min(100,(wm-2)/12*100)),emp=.9*part,u=part?10:0,disc=100-part;
    var P=plot(c,280,{xlo:0,xhi:110,ylo:0,yhi:14,xl:'노동공급(일하려는 사람 수)',yl:'임금',title:'빨강 노동공급곡선(의향임금 순서) · 주황 시장임금 · 회색 = 이탈한 사람'});
    P.fn(function(n){return n>100?NaN:2+.12*n},COL.r,2.6,null,0,100);P.seg(0,wm,110,wm,COL.a,1.8,[5,4]);if(part<100)P.poly([[part,wm],[100,14],[100,wm]],COL.muted,.25);P.dot(part,wm,COL.g,6,'참여 '+f1(part,0)+'명');stamp(P.ctx,P.W,'설명용 모형');
    K([['$'+f1(wm,2),'시장임금 w_m',wm<12?'r':'g'],[f1(disc,0)+'명','시장임금 < 의향임금으로 이탈',disc>16.8?'r':'i'],[f1(u,0)+'%','공식 실업률(구직자 중)','i'],[f1(emp,0)+'%','고용률(100명 중 취업)',emp<75?'r':'g']]);
    E('참여 = 의향임금 ≤ w_m 인 사람 = ('+f1(wm,1)+' − 2) ÷ 12 × 100 = <i>'+f1(part,0)+'명</i> · 취업 = 참여 × 90%');
    I([[wm<12?'r':'i',wm<12?'AI 사용료가 내려 시장임금이 $'+f1(wm,1)+'까지 밀렸어요. 의향임금이 더 높은 '+f1(disc,0)+'명이 구직을 포기해 비경제활동인구가 됐어요(노동공급 왼쪽 이동).':'시장임금이 12달러면 의향임금이 그보다 낮은 사람은 모두 일하려 해요.'],['a','그런데 공식 실업률은 10% 그대로예요. 구직을 포기한 사람은 실업자로 세지 않기 때문이에요(CH02 실망실업자). 고용률을 함께 봐야 AI 충격의 크기가 보여요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

DUELS.chatgpt=function(){var cd=q4opt(2,8,.5).L;return {fly:cd,robo:0,say:'AI 사용료가 6 → 0.5로 폭락했어요. 일은 사람과 AI가 완전히 바꿔 쓸 수 있는(선형) 일이에요. 실제 노동수요는 0(임계임금 1 < 시급 8). 초파리 조교는 콥-더글러스처럼 서서히 준다고 보고 '+cd.toFixed(2)+'를 예측했고, 주판봇 조교는 0을 예측했어요.'}};

