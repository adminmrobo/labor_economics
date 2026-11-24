// 그래프 글자 겹침 검사: 캔버스 fillText와 SVG <text>의 상자를 모아 서로 겹치거나 그림 밖으로 나가는 글자를 찾는다.
// 사용: node check_text.js <html 파일들...>   (폭 390·1280 두 가지)
const {chromium} = require('playwright');
const INIT = `(() => {
  const LOG = new WeakMap(); window.__TXT = [];
  const P = CanvasRenderingContext2D.prototype, ft = P.fillText, cr = P.clearRect;
  P.clearRect = function(x, y, w, h) { if (x <= 0 && y <= 0) LOG.set(this.canvas, []); return cr.apply(this, arguments); };
  const rr = P.roundRect;
  if (rr) P.roundRect = function(x, y, w, h) { const tf = this.getTransform(), sc = tf.a || 1; if (!LOG.has(this.canvas)) LOG.set(this.canvas, []); if (w > 20 && h <= 30) { LOG.get(this.canvas).push({t: '[표시 상자]', x: x + tf.e / sc, y: y, w: w, h: h, badge: 1}); this.canvas.__log = LOG.get(this.canvas); } return rr.apply(this, arguments); };
  P.fillText = function(t, x, y) {
    const s = String(t); if (!s.trim()) return ft.apply(this, arguments);
    const m = this.measureText(s), tf = this.getTransform(), sc = tf.a || 1;
    const w = m.width, asc = m.actualBoundingBoxAscent || 8, desc = m.actualBoundingBoxDescent || 2;
    let x0 = x; if (this.textAlign === 'center') x0 = x - w / 2; else if (this.textAlign === 'right' || this.textAlign === 'end') x0 = x - w;
    const box = {t: s, x: (x0 * sc + tf.e) / sc, y: (y - asc), w: w, h: asc + desc};
    if (!LOG.has(this.canvas)) LOG.set(this.canvas, []);
    LOG.get(this.canvas).push(box);
    this.canvas.__log = LOG.get(this.canvas);
    return ft.apply(this, arguments);
  };
})();`;
function overl(a, b) { if (a.badge && b.badge) return 0; if ((a.badge || b.badge) && (a.x >= (b.x||0) - 1 && a.x + a.w <= b.x + b.w + 1 && a.y >= b.y - 1 && a.y + a.h <= b.y + b.h + 1 || b.x >= a.x - 1 && b.x + b.w <= a.x + a.w + 1 && b.y >= a.y - 1 && b.y + b.h <= a.y + a.h + 1)) return 0; const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); return ix > 1 && iy > 1 ? ix * iy : 0; }
(async () => {
  const b = await chromium.launch(); let total = 0;
  for (const f of process.argv.slice(2)) for (const W of [390, 1280]) {
    const p = await b.newPage({viewport: {width: W, height: 900}});
    await p.addInitScript(INIT);
    await p.goto('file://' + f, {waitUntil: 'load'}); await p.waitForTimeout(1500);
    // 숨겨진 패널(접기·탭)도 열어 그리게 한다
    await p.evaluate(() => { document.querySelectorAll('details').forEach(d => d.open = true); window.dispatchEvent(new Event('resize')); });
    await p.waitForTimeout(900);
    if (process.env.EXT) { await p.evaluate((m) => { document.querySelectorAll('input[type=range]').forEach(r => { r.value = m === 'max' ? r.max : r.min; r.dispatchEvent(new Event('input', {bubbles: true})); }); }, process.env.EXT); await p.waitForTimeout(600); }
    if (process.env.TABS) { const tabs = await p.$$('[role=tab], .tabs button'); for (const t of tabs) { try { await t.click(); await p.waitForTimeout(250); } catch (e) {} } }
    const res = await p.evaluate(() => {
      const out = [];
      const cvs = [...document.querySelectorAll('canvas')].filter(c => c.__log && c.offsetWidth > 0);
      cvs.forEach((c, ci) => {
        const L = c.__log, cw = c.width / (window.devicePixelRatio || 1), ch = c.height / (window.devicePixelRatio || 1);
        const sec = c.closest('[id]'); const where = (sec ? sec.id : '?');
        const cap = (c.closest('.panel,.dash,.sim') || c.parentElement).querySelector('h3,.title,b') ;
        out.push({kind: 'canvas', where, idx: ci, w: cw, h: ch, boxes: L.map(b => ({...b}))});
      });
      document.querySelectorAll('svg').forEach((s, si) => {
        if (!s.getBoundingClientRect().width) return; const vb = s.viewBox.baseVal; const ts = [...s.querySelectorAll('text')].filter(t => t.textContent.trim());
        if (!ts.length || !vb) return;
        const sec = s.closest('[id]');
        out.push({kind: 'svg', where: sec ? sec.id : '?', idx: si, w: vb.width, h: vb.height, boxes: ts.map(t => { const bb = t.getBBox(); return {t: t.textContent, x: bb.x, y: bb.y, w: bb.width, h: bb.height}; })});
      });
      return out;
    });
    const probs = [];
    for (const g of res) {
      const B = g.boxes;
      for (let i = 0; i < B.length; i++) {
        const a = B[i];
        if (a.x < -2 || a.x + a.w > g.w + 2 || a.y < -2 || a.y + a.h > g.h + 2) probs.push(`밖으로 나감 「${a.t}」`);
        for (let j = i + 1; j < B.length; j++) { const o = overl(a, B[j]); if (o > 3) probs.push(`겹침 「${a.t}」×「${B[j].t}」`); }
      }
      if (probs.length) { console.log(`${f.split('/').pop()} @${W} ${g.kind}#${g.idx} (${g.where}): ` + [...new Set(probs)].slice(0, 8).join(' | ')); total += probs.length; probs.length = 0; }
    }
    await p.close();
  }
  console.log('TOTAL', total); await b.close();
})();
