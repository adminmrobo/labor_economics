/* 노동경제학 연구실 — 장별 동적 대시보드 (설명용 모형, 숫자는 예시값) */
function rdl(v,d){return +(+v).toFixed(d==null?0:d)}
DASHES['lm']={tag:'노동시장',title:'노동시장 한눈에 — 수요·공급·최저임금',sub:'공급 w = 4 + E/10 + 이동 · 수요(VMP) w = 20 − E/10 + 이동 · 최저임금 m',play:'m',playLabel:'최저임금을 0→18로',
  params:[['d','노동수요 이동(제품 값·기술)',-4,4,.5,0,String],['s','노동공급 이동(인구·이민·여가 선호)',-4,4,.5,0,String],['m','최저임금(0 = 없음)',0,18,.5,0,String]],
  f:function(p){var we=(24+p.d+p.s)/2,Ee=10*(we-4-p.s),bind=p.m>we,w=bind?p.m:we,Ed=10*(20+p.d-w),Es=10*(w-4-p.s),E=bind?Ed:Ee,u=bind?Es-Ed:0,ms=seqv(0,18,37);
    return {k:[['$'+rdl(we,2),'경쟁 균형 시급','g'],[rdl(Ee,1)+'명','경쟁 균형 고용','g'],[rdl(E,1)+'명','실제 고용',E<Ee-.01?'r':'g'],[rdl(u,1)+'명','실업(일하려는데 못 함)',u>0?'r':'g']],
      c:[{t:'fn',draw:function(cv,H){var P=plot(cv,H,{xlo:0,xhi:200,ylo:0,yhi:28,T:46,xl:'고용 E',yl:'시급',title:'파랑 노동수요 · 빨강 노동공급 · 주황 최저임금'});P.fn(function(E){return 20+p.d-E/10},COL.s,2.4);P.fn(function(E){return 4+p.s+E/10},COL.r,2.4);if(p.m)P.seg(0,p.m,200,p.m,COL.a,1.5,[4,3]);P.dot(E,w,COL.g,5,'지금');stamp(P.ctx,P.W,'예시값')}},
        {t:'line',title:'최저임금 수준별 고용(경쟁시장)',xs:ms,ys:[{c:COL.g,d:ms.map(function(m){return m>we?10*(20+p.d-m):Ee})}],ymin:0,mark:{x:p.m,y:E,l:'지금'},xl:'최저임금'}],
      note:[[u>0?'r':'g',u>0?'균형보다 높은 최저임금이 고용을 '+rdl(Ee-E,1)+'명 줄이고 실업 '+rdl(u,1)+'명을 만들었어요(경쟁시장).':'최저임금이 균형 시급보다 낮아 효과가 없어요.'],['i','수요 이동을 올리면(제품 값·기술↑) 임금과 고용이 함께 오르고, 공급 이동을 올리면(이민·인구↑) 임금은 내리고 고용은 늘어요.']]}}};

DASHES['01']={tag:'CH01',title:'알래스카 송유관 — 노동시장의 수요 충격',sub:'수요 E = 100 − 2w + B · 공급 E = 2w − 20 + M (M = 유입 노동자)',play:'M',playLabel:'유입 노동자를 0→60으로',
  params:[['B','공사로 늘어난 노동수요 B',0,60,5,40,String],['M','다른 지역에서 온 노동자 M',0,60,5,0,String]],
  f:function(p){var e=alaskaEq(p.B,p.M),Ms=seqv(0,60,31);
    return {k:[['$'+rdl(e.w,1),'균형 시급',e.w>30?'a':e.w<30?'r':'g'],[rdl(e.E,0)+'명','고용','i'],['$'+rdl(e.w-30,1),'처음(30달러) 대비',e.w>=30?'a':'r'],[p.B>0&&p.M>=p.B?'임금 회복':p.B>0?'임금 상승 중':'수요 정상','상태','m']],
      c:[{t:'line',title:'유입 노동자 수에 따른 균형 시급',xs:Ms,ys:[{n:'공사 중',c:COL.a,d:Ms.map(function(m){return alaskaEq(p.B,m).w})},{n:'완공 뒤',c:COL.r,d:Ms.map(function(m){return alaskaEq(0,m).w})}],hline:30,hlabel:'처음 시급',mark:{x:p.M,y:e.w,l:'지금'},xl:'유입 노동자 M'},
        {t:'bar',title:'지금 고용과 시급',vals:[rdl(e.E,0),rdl(e.w,1)],labels:['고용(명)','시급(달러)'],cols:[COL.g,COL.a]}],
      note:[['a','공사 중에는 노동자가 많이 들어올수록 시급이 처음 수준으로 돌아와요. 완공 뒤에도 남아 있으면 시급이 처음보다 낮아져요(빨간 선).'],['i','노동자의 이동이 지역 간 임금 차이를 메우는 장치라는 점이 이 장의 출발점이에요.']]}}};

DASHES['02']={tag:'CH02',title:'일할까, 쉴까 — 최적 근로시간 대시보드',sub:'U = C × L, C = w(T − L) + V, T = 112시간',play:'w',playLabel:'시급을 1→40으로',
  params:[['w','시급 w',1,40,.5,20,String],['V','비근로소득 V',0,3000,20,320,String]],
  f:function(p){var T=112,L=Math.min(T,(p.w*T+p.V)/(2*p.w)),h=T-L,ws=seqv(1,40,79),wr=p.V/T;
    return {k:[[rdl(h,1)+'시간','최적 근로시간',h>0?'g':'r'],['$'+rdl(wr,2),'유보임금 V ÷ T','a'],['$'+nf(Math.round(p.w*h+p.V)),'최적 소비','i'],[h>0?'일함(내부해)':'안 함(코너해)','선택',h>0?'g':'r']],
      c:[{t:'line',title:'시급별 최적 근로시간(이 사람의 노동공급곡선)',xs:ws,ys:[{c:COL.r,d:ws.map(function(w){return Math.max(0,T-Math.min(T,(w*T+p.V)/(2*w)))})}],ymin:0,ymax:60,mark:{x:p.w,y:h,l:'지금'},xl:'시급 w'},
        {t:'bar',title:'시간 배분(주 112시간)',vals:[rdl(h,1),rdl(L,1)],labels:['근로','여가'],cols:[COL.a,COL.s]}],
      note:[[h>0?'g':'r',h>0?'시급이 유보임금보다 높아 일해요.':'시급이 유보임금 $'+rdl(wr,2)+'보다 낮아 일하지 않아요.'],['i','V를 올리면 유보임금이 올라 낮은 시급에서는 일하지 않게 돼요.']]}}};

DASHES['03']={tag:'CH03',title:'임금 인상의 두 얼굴 — 대체효과와 소득효과',sub:'U = C × L, T = 112, 처음 시급 20달러에서 새 시급으로',play:'w1',playLabel:'새 시급을 20→60으로',
  params:[['w1','새 시급',20,60,1,30,String],['V','비근로소득',0,1000,20,320,String]],
  f:function(p){var T=112,L0=cdL(20,p.V,T),C0=20*(T-L0)+p.V,U0=C0*L0,L1=cdL(p.w1,p.V,T),Lh=Math.min(T,Math.sqrt(U0/p.w1)),se=L0-Lh,ie=Lh-L1,ws=seqv(20,60,41);
    return {k:[['+'+rdl(se,1),'대체효과(시간)','g'],[rdl(-ie,1),'소득효과(시간)','r'],[(L0-L1>=0?'+':'')+rdl(L0-L1,1),'전체 변화(시간)',L0>=L1?'g':'r'],[rdl(T-L1,1)+'시간','새 근로시간','i']],
      c:[{t:'line',title:'새 시급별 두 효과(시간)',xs:ws,ys:[{n:'대체',c:COL.g,d:ws.map(function(w){return L0-Math.sqrt(U0/w)})},{n:'소득',c:COL.r,d:ws.map(function(w){return Math.sqrt(U0/w)-cdL(w,p.V,T)})},{n:'전체',c:COL.s,d:ws.map(function(w){return L0-cdL(w,p.V,T)})}],hline:0,hlabel:'0',mark:{x:p.w1,y:L0-L1,l:'지금'},xl:'새 시급'},
        {t:'bar',title:'근로시간 변화 분해',vals:[rdl(se,1),rdl(-ie,1),rdl(L0-L1,1)],labels:['대체','소득','전체'],cols:[COL.g,COL.r,COL.s]}],
      note:[['i','대체효과는 언제나 더 일하는 쪽(+), 소득효과는 덜 일하는 쪽(−)이에요. 전체는 둘의 크기 싸움이에요.'],['a','V = 0이면 이 효용함수에서는 두 효과가 정확히 상쇄돼 근로시간이 56시간으로 그대로예요. V를 0으로 내려 보세요.']]}}};

DASHES['04']={tag:'CH04',title:'기업의 고용 결정 — 시급과 AI 가격',sub:'선형 생산 Y = 4L + 2K(Y = 20) · 콥-더글러스 L* = Y√(r/w)/√(ab)',play:'r',playLabel:'AI 사용료를 12→0.5로',
  params:[['w','시장 시급',1,20,.5,8,String],['r','AI·자본 사용료',.5,12,.5,6,String]],
  f:function(p){var a=4,b=2,Y=20,ws=a/b*p.r,Llin=p.w<ws?Y/a:p.w>ws?0:Y/(2*a),Lcd=Y/Math.sqrt(a*b)*Math.sqrt(p.r/p.w),xs=seqv(1,20,77);
    return {k:[['$'+rdl(ws,1),'임계임금 w* = (a ÷ b)r','a'],[rdl(Llin,2),'선형(완전대체) 노동수요',Llin>0?'g':'r'],[rdl(Lcd,2),'콥-더글러스 노동수요','i'],[rdl(Y/a,2),'레온티에프 노동수요(고정)','m']],
      c:[{t:'line',title:'시급별 노동수요: 생산함수 세 가지',xs:xs,ys:[{n:'선형',c:COL.r,d:xs.map(function(w){return w<ws?Y/a:0})},{n:'콥-더글러스',c:COL.s,d:xs.map(function(w){return Y/Math.sqrt(a*b)*Math.sqrt(p.r/w)})},{n:'레온티에프',c:COL.m,dash:[4,3],d:xs.map(function(){return Y/a})}],ymin:0,ymax:12,mark:{x:p.w,y:Llin,l:'지금'},xl:'시급 w'},
        {t:'bar',title:'단위비용 비교(산출 1 만드는 비용)',vals:[rdl(p.w/a,2),rdl(p.r/b,2)],labels:['사람 w ÷ a','AI r ÷ b'],cols:[COL.g,COL.i]}],
      note:[[Llin>0?'g':'r',Llin>0?'사람의 단위비용이 AI보다 싸서 선형 기술에서도 사람을 써요.':'AI 단위비용이 더 싸서 완전대체 기술에서는 노동수요가 0이에요.'],['i','▶ 재생으로 AI 사용료를 내리면 임계임금이 시급 아래로 내려가는 순간 선형 노동수요가 절벽처럼 떨어져요.']]}}};

DASHES['05']={tag:'CH05',title:'최저임금과 시장 구조 대시보드',sub:'공급 w = 4 + E/10 · 수요(VMP) w = 20 − E/10',play:'m',playLabel:'최저임금을 0→18로',
  params:[['mono','시장(0 경쟁 · 1 수요독점)',0,1,1,1,function(v){return v?'수요독점':'경쟁'}],['m','최저임금',0,18,.25,0,String]],
  f:function(p){var r=minres(p.mono,p.m),ms=seqv(0,18,73);
    return {k:[[rdl(r.E,1)+'명','고용',r.E>=r.E0-.01?'g':'r'],['$'+rdl(r.w,2),'시급','i'],[rdl(r.u,1)+'명','실업',r.u>0?'r':'g'],[(r.E-r.E0>=0?'+':'')+rdl(r.E-r.E0,1),'최저임금 없을 때 대비',r.E>=r.E0?'g':'r']],
      c:[{t:'line',title:'최저임금별 고용',xs:ms,ys:[{n:'경쟁',c:COL.s,d:ms.map(function(m){return minres(0,m).E})},{n:'수요독점',c:COL.m,d:ms.map(function(m){return minres(1,m).E})}],ymin:0,ymax:100,mark:{x:p.m,y:r.E,l:'지금'},xl:'최저임금'},
        {t:'bar',title:'지금 노동시장',vals:[rdl(r.E,1),rdl(r.E+r.u,1)],labels:['고용','일하려는 사람'],cols:[COL.g,COL.r]}],
      note:[[p.mono?'a':'i',p.mono?'수요독점에서는 최저임금 12까지 고용이 오히려 늘어요(보라 선의 꼭대기).':'경쟁시장에서는 12를 넘는 최저임금이 고용을 줄여요.'],['i','같은 최저임금이라도 고용주가 시장에서 임금을 정할 힘이 있는지에 따라 결과가 달라져요.']]}}};

DASHES['06']={tag:'CH06',title:'위험수당과 생명의 통계적 가치',sub:'위험한 일자리 수와 위험 선호 · VSL = 위험수당 ÷ 추가 위험',play:'D',playLabel:'위험한 일자리를 5→95로',
  params:[['D','위험한 일자리 수(100명 중)',5,95,5,40,String],['lov','위험을 좋아하는 사람(%)',0,40,5,10,String],['prem','연간 위험수당(달러)',100,2000,50,700,String]],
  f:function(p){var rp=function(k){return k<p.lov?-3*(p.lov-k)/Math.max(1,p.lov):(k-p.lov)/(100-p.lov)*20},pr=rp(p.D-1),Ds=seqv(5,95,19),vsl=p.prem/(1/10000);
    return {k:[[rdl(pr,1)+'만 원','월 위험수당(시장)',pr>0?'a':'r'],[p.D+'명','위험한 일 하는 사람','i'],['$'+nf(Math.round(vsl)),'VSL(1만 명당 1명 위험일 때)','m'],[pr<0?'위험이 싸다':'위험이 비싸다','판정',pr<0?'r':'g']],
      c:[{t:'line',title:'위험한 일자리 수별 시장 위험수당',xs:Ds,ys:[{c:COL.r,d:Ds.map(function(d){return rp(d-1)})}],hline:0,hlabel:'0',mark:{x:p.D,y:pr,l:'지금'},xl:'위험한 일자리 수'},
        {t:'bar',title:'1만 명의 수당 합 = 사망 1명의 값',vals:[rdl(p.prem*1e4/1e6,1),rdl(vsl/1e6,1)],labels:['1만 명 수당 합(백만 $)','VSL(백만 $)'],cols:[COL.a,COL.r]}],
      note:[['a','위험한 일자리가 많을수록 위험을 더 싫어하는 사람까지 설득해야 해서 수당이 올라가요.'],['i','위험을 좋아하는 사람보다 일자리가 적으면 수당이 마이너스가 될 수 있어요.']]}}};

DASHES['07']={tag:'CH07',title:'대학에 갈까 — 현재가치와 정지규칙',sub:'고졸 2,800 · 대졸 연봉 · 연 등록금(만 원), 18~65세',play:'r',playLabel:'할인율을 1→12%로',
  params:[['wc','대졸 연봉(만 원)',2500,6000,100,4000,String],['tu','연 등록금(만 원)',0,1500,50,700,String],['r','할인율(%)',1,12,.5,5,String]],
  f:function(p){var pv=function(rr){return pvStream(0,18,65,rr,p.wc,p.tu,4)-pvStream(0,18,65,rr,2800,0,0)},d=pv(p.r/100),rs=seqv(1,12,45),irr=bisect(pv,.001,.6);
    return {k:[[nf(Math.round(d)),'대학의 순현재가치(만 원)',d>0?'g':'r'],[rdl(irr*100,1)+'%','내부수익률','a'],[d>0?'대학 진학':'바로 취업','더 나은 선택',d>0?'g':'r'],[nf(4*2800+4*p.tu),'4년 동안의 비용(포기 소득 + 등록금)','m']],
      c:[{t:'line',title:'할인율별 대학의 순현재가치',xs:rs,ys:[{c:COL.g,d:rs.map(function(r){return pv(r/100)})}],hline:0,hlabel:'0',mark:{x:p.r,y:d,l:'지금'},xl:'할인율(%)',fy:function(v){return nf(v)}},
        {t:'bar',title:'연봉 비교(만 원)',vals:[2800,p.wc],labels:['고졸','대졸'],cols:[COL.s,COL.g]}],
      note:[[d>0?'g':'r','할인율이 내부수익률('+rdl(irr*100,1)+'%)보다 낮으면 대학이 이득이에요.'],['i','대학의 가장 큰 비용은 4년 동안 포기한 고졸 소득이에요.']]}}};

DASHES['08']={tag:'CH08',title:'임금 불평등 대시보드',sub:'로그정규 임금분포 σ · 대졸 프리미엄 경로(σ_sub = 1.4)',play:'sg',playLabel:'σ를 0.2→1.2로',
  params:[['sg','임금 분산 σ',.2,1.2,.05,.6,function(v){return v.toFixed(2)}],['gD','기술 수요 증가(%/년)',0,6,.25,3.5,String],['gS','대졸 공급 증가(%/년)',0,6,.25,3.5,String]],
  f:function(p){var r9010=Math.exp(2*1.2816*p.sg),gini=2*normCdf(p.sg/Math.SQRT2)-1,ys=seqv(1980,2020,41),pr=function(t){return 1.45*Math.exp((p.gD-p.gS)/100*(t-1980)/1.4)};
    return {k:[[rdl(r9010,2),'90-10 비율','r'],[rdl(gini,3),'지니계수','i'],[rdl(pr(2020),2)+'배','2020년 대졸 프리미엄',pr(2020)>1.46?'r':'g'],[p.gD>p.gS?'기술이 앞섬':p.gD<p.gS?'교육이 앞섬':'같은 속도','교육과 기술의 경주','a']],
      c:[{t:'line',title:'로렌츠 곡선',xs:seqv(0,1,41),ys:[{n:'완전평등',c:COL.muted,dash:[4,3],d:seqv(0,1,41)},{n:'로렌츠',c:COL.s,d:seqv(0,1,41).map(function(q){return q<=0?0:q>=1?1:normCdf(PhiInv(q)-p.sg)})}],ymin:0,ymax:1,xl:'인구 비율',fx:function(v){return Math.round(v*100)+'%'},fy:function(v){return Math.round(v*100)+'%'}},
        {t:'line',title:'대졸 ÷ 고졸 임금 경로',xs:ys,ys:[{c:COL.r,d:ys.map(pr)}],ymin:1,ymax:2.6,xl:'연도'}],
      note:[['i','로그정규 분포에서 지니계수 = 2Φ(σ/√2) − 1이에요. σ가 커지면 로렌츠 곡선이 아래로 처져요.'],[p.gD>p.gS?'r':'g',p.gD>p.gS?'기술이 대졸자를 원하는 속도가 더 빨라 프리미엄이 커져요.':'대졸자 공급이 따라잡아 프리미엄이 커지지 않아요.']]}}};

DASHES['09']={tag:'CH09',title:'떠날까 남을까 — 이주의 현재가치와 선택성',sub:'출신지·목적지 연봉, 할인율, 남은 근로기간 · 로이 모형 σ₁/σ₀',play:'N',playLabel:'남은 근로기간을 5→45년으로',
  params:[['wu','목적지 연봉(달러)',30000,70000,500,44770,String],['r','할인율(%)',2,12,.5,5,String],['N','남은 근로기간(년)',5,45,1,40,String],['ratio','목적국 ÷ 출신국 불평등',.5,2,.1,1.5,function(v){return v.toFixed(1)}]],
  f:function(p){var wp=28300,gap=p.wu-wp,M=pvGain(gap,p.r/100,p.N),Ns=seqv(5,45,41);
    return {k:[['$'+nf(Math.round(M)),'감수할 수 있는 이주 비용',M>0?'g':'r'],[rdl(M/wp,1)+'배','출신지 연봉의','a'],[p.ratio>1?'양의 선택':p.ratio<1?'음의 선택':'선택 없음','떠나는 사람의 숙련',p.ratio>1?'g':'r'],[rdl(gap/wp*100,1)+'%','임금 상승률','i']],
      c:[{t:'line',title:'남은 근로기간별 이주 이득의 현재가치(천 달러)',xs:Ns,ys:[{c:COL.g,d:Ns.map(function(n){return pvGain(gap,p.r/100,n)/1000})}],ymin:0,mark:{x:p.N,y:M/1000,l:'지금'},xl:'남은 근로기간(년)'},
        {t:'bar',title:'연봉(달러)',vals:[wp,p.wu],labels:['출신지','목적지'],cols:[COL.s,COL.g],fy:function(v){return nf(v)}}],
      note:[['a','젊을수록 이득을 거둘 기간이 길어 같은 임금 차이라도 더 큰 이주 비용을 감수해요. 이주가 젊은 층에 몰리는 이유예요.'],['i',p.ratio>1?'목적국이 숙련에 더 큰 보상을 주면 숙련이 높은 사람이 떠나요.':'출신국이 숙련에 더 큰 보상을 주면 숙련이 낮은 사람이 떠나요.']]}}};
