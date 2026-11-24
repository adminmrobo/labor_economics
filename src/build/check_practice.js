// 실전 연습장: 탭마다, 슬라이더 최소·중간·최대에서 SVG 글자 겹침 검사
const {chromium}=require('playwright');
function ov(a,b){const ix=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),iy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);return ix>1&&iy>1}
(async()=>{const b=await chromium.launch();let tot=0;
for(const W of [390,1280]){const p=await b.newPage({viewport:{width:W,height:900}});await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
 const tabs=await p.$$('[role=tab]');
 for(let t=0;t<tabs.length;t++){await tabs[t].click();await p.waitForTimeout(300);
  const n=await p.evaluate(()=>[...document.querySelectorAll('input[type=range]')].filter(r=>r.offsetWidth).length);
  for(let i=0;i<n;i++)for(const f of [0,.25,.5,.75,1]){
   const r=await p.evaluate(([i,f])=>{const R=[...document.querySelectorAll('input[type=range]')].filter(r=>r.offsetWidth)[i];const mn=+R.min,mx=+R.max,st=+R.step||1;R.value=Math.round((mn+(mx-mn)*f)/st)*st;R.dispatchEvent(new Event('input',{bubbles:true}));
     const out=[];document.querySelectorAll('svg').forEach((s,si)=>{if(!s.getBoundingClientRect().width)return;const vb=s.viewBox.baseVal;const B=[...s.querySelectorAll('text')].filter(t=>t.textContent.trim()).map(t=>{const bb=t.getBBox();return{t:t.textContent,x:bb.x,y:bb.y,w:bb.width,h:bb.height}});out.push({si,vw:vb?vb.width:0,vh:vb?vb.height:0,B})});return {lab:R.getAttribute('aria-label')||R.id,out}},[i,f]);
   for(const g of r.out){const B=g.B;for(let a=0;a<B.length;a++){const A=B[a];if(g.vw&&(A.x<-1||A.x+A.w>g.vw+1||A.y<-1||A.y+A.h>g.vh+1)){console.log(`@${W} tab${t} ${r.lab}=${f} svg${g.si} 밖 「${A.t}」`);tot++}
     for(let c=a+1;c<B.length;c++)if(ov(A,B[c])){console.log(`@${W} tab${t} ${r.lab}=${f} svg${g.si} 겹침 「${A.t}」×「${B[c].t}」`);tot++}}}
  }}
 await p.close()}
console.log('TOTAL',tot);await b.close()})();
