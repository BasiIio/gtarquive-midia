// Gera quadros PNG transparentes (1080x1920, 30fps) com textos animados, flashes e cartão final.
// Uso: node gameplay_overlay.js <gameplay.json> <pasta-saida> [de] [ate]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const cfg = JSON.parse(fs.readFileSync(process.argv[2]));
const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
const FPS = 30, N = Math.round(cfg.total * FPS);
const from = +(process.argv[4] || 0), to = +(process.argv[5] || N);
const fonts = path.resolve(__dirname, 'fonts');
// tempos dos blocos de texto (proporcional ao número de letras dentro de cada frase)
const chunks = [];
for (const s of cfg.sent) {
  const len = s.chunks.map(c => c.replace(/[|*#]/g, '').length), tot = len.reduce((a, b) => a + b, 0);
  let t = s.a + cfg.O;
  s.chunks.forEach((c, i) => { const d = (s.b - s.a) * len[i] / tot; chunks.push({ a: t, b: t + d, raw: c }); t += d; });
}
for (let i = 0; i < chunks.length; i++) chunks[i].b = Math.min(chunks[i].b + 0.12, (chunks[i + 1] ? chunks[i + 1].a : chunks[i].b + .3) + 0.02);
const cuts = cfg.cuts.map(c => c.t);
const FOLDER = `<svg width="64" height="51" viewBox="0 0 200 160"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD25A"/><stop offset=".5" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FF3E9A"/></linearGradient></defs><path d="M10 30 Q10 10 30 10 L75 10 L95 30 L170 30 Q190 30 190 50 L190 130 Q190 150 170 150 L30 150 Q10 150 10 130 Z" fill="url(#g)"/><text x="100" y="116" font-family="Archivo" font-weight="900" font-size="64" text-anchor="middle" fill="#1A0B2E">GTA</text></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;font-weight:600;src:url(file://${fonts}/archivo-latin-600-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;src:url(file://${fonts}/archivo-latin-900-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;font-style:italic;src:url(file://${fonts}/archivo-latin-900-italic.woff2)}
@font-face{font-family:JetBrains;font-weight:700;src:url(file://${fonts}/jetbrains-mono-latin-700-normal.woff2)}
html,body{margin:0;background:transparent;width:1080px;height:1920px;overflow:hidden;font-family:Archivo,sans-serif}
.mono{font-family:JetBrains,monospace;font-weight:700}
#top{position:absolute;left:72px;top:96px;right:72px;display:flex;align-items:center;justify-content:space-between}
.wm{font-weight:900;font-size:40px;letter-spacing:-.03em;color:#F4EFE4;line-height:1}.wm b{color:#FFB347}
#tag{font-size:24px;letter-spacing:.12em;color:#F4EFE4;text-shadow:0 2px 8px rgba(0,0,0,.7)}
#kick{position:absolute;left:72px;top:520px;font-style:italic;font-weight:900;font-size:46px;letter-spacing:.02em;color:#FF8AC0;text-shadow:0 3px 14px rgba(0,0,0,.7)}
#shade{position:absolute;left:0;right:0;bottom:0;height:760px;background:linear-gradient(0deg,rgba(18,7,38,.92),rgba(18,7,38,0))}
#cap{position:absolute;left:72px;right:72px;top:1280px;height:440px;display:flex;align-items:center}
#cap .in{transform-origin:0 50%}
.ln{font-style:italic;font-weight:900;line-height:1.02;letter-spacing:-.02em;color:#F4EFE4;text-shadow:0 5px 22px rgba(0,0,0,.65);white-space:nowrap}
.kw{display:inline-block;color:#1A0B2E;padding:0 .18em;border-radius:12px;transform:rotate(-2deg);margin:0 .04em;text-shadow:none}
#credit{position:absolute;left:72px;bottom:70px;font-size:22px;letter-spacing:.1em;color:#C9B8E8;text-shadow:0 2px 8px rgba(0,0,0,.8)}
#bar{position:absolute;left:0;bottom:0;height:8px;background:linear-gradient(90deg,#FFB347,#FF3E9A)}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
#end{position:absolute;inset:0;opacity:0;background:radial-gradient(120% 80% at 50% 30%,#6A1B7A 0%,#2B1250 45%,#120726 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
</style></head><body>
<div id="shade"></div><div id="top"><div style="display:flex;align-items:center;gap:18px">${FOLDER}<div class="wm">GT<b>A</b>rchived</div></div><div id="tag" class="mono">OFICIAL · LAUNCH TRAILER</div></div>
<div id="kick"></div><div id="cap"><div class="in" id="capin"></div></div>
<div id="credit" class="mono">IMAGENS E VÍDEO: ROCKSTAR GAMES</div><div id="bar"></div><div id="flash"></div>
<div id="end"><div style="transform:scale(2)">${FOLDER}</div><div class="wm" style="font-size:120px;margin-top:70px">GT<b>A</b>rchived</div>
<div style="font-style:italic;font-weight:900;font-size:92px;line-height:1.05;margin-top:70px;color:#F4EFE4">SIGA O<br><span class="kw" style="background:#25E2E0">GTArchived</span></div>
<div class="mono" style="margin-top:80px;font-size:32px;letter-spacing:.14em;color:#FF8AC0">GTA 6 · 19/11 · 0H DE BRASÍLIA</div>
<div class="mono" style="margin-top:34px;font-size:22px;letter-spacing:.1em;color:#C9B8E8">IMAGENS E VÍDEO: ROCKSTAR GAMES</div></div>
</body></html>`;
const KW = ['#FF3E9A', '#25E2E0', '#FFB347'];
const easeOutBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
function parse(raw, ci) {
  const big = raw.startsWith('#'); if (big) raw = raw.slice(1);
  const lines = raw.split('|').map(l => l.replace(/\*(.+?)\*/g, (_, k) => `<span class="kw" style="background:${KW[ci % 3]}">${k}</span>`));
  const mx = Math.max(...raw.split('|').map(l => l.replace(/\*/g, '').length));
  const fs = big ? 300 : Math.max(76, Math.min(138, Math.floor(900 / (mx * 0.80))));
  return { html: lines.map(l => `<div class="ln" style="font-size:${fs}px">${l}</div>`).join(''), big };
}
(async () => {
  const f = path.join(out, '_ov.html'); fs.writeFileSync(f, html);
  const browser = await chromium.launch();
  const W = 4, step = Math.ceil((to - from) / W);
  await Promise.all([...Array(W)].map(async (_, w) => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    await page.goto('file://' + f); await page.evaluate(() => document.fonts.ready);
    for (let n = from + w * step; n < Math.min(to, from + (w + 1) * step); n++) {
      const t = n / FPS;
      const ci = chunks.findIndex(c => t >= c.a && t < c.b);
      let cap = '', sc = 1, op = 0, bl = 0, ty = 0;
      if (ci >= 0) { const c = chunks[ci], p = parse(c.raw, ci); cap = p.html; const k = Math.min(1, (t - c.a) / 0.2);
        sc = 0.55 + 0.45 * easeOutBack(k); op = Math.min(1, (t - c.a) / 0.09); bl = 14 * (1 - k); ty = 50 * (1 - k);
        const rem = c.b - t; if (rem < 0.08) op *= Math.max(0, rem / 0.08); }
      let cutIdx = -1; for (let i = 0; i < cuts.length; i++) if (t >= cuts[i]) cutIdx = i;
      const cut = cfg.cuts[cutIdx], since = t - cuts[cutIdx];
      const flash = cutIdx > 0 ? Math.max(0, 0.5 * (1 - since / 0.16)) : 0;
      const full = cut.mode === 'full';
      const endA = Math.max(0, Math.min(1, (t - cfg.end) / 0.25));
      await page.evaluate(({ cap, sc, op, bl, ty, flash, k, full, endA, prog, tag }) => {
        const ci = document.getElementById('capin'); ci.innerHTML = cap; ci.style.opacity = op;
        ci.style.transform = `translateY(${ty}px) scale(${sc})`; ci.style.filter = `blur(${bl}px)`;
        document.getElementById('flash').style.opacity = flash;
        document.getElementById('kick').textContent = full ? '' : k;
        document.getElementById('shade').style.opacity = full ? 1 : 0;
        document.getElementById('end').style.opacity = endA;
        document.getElementById('bar').style.width = (prog * 1080) + 'px';
      }, { cap, sc, op, bl, ty, flash, k: cut.k || '', full, endA, prog: t / cfg.total });
      await page.screenshot({ path: path.join(out, String(n + 1).padStart(4, '0') + '.png'), omitBackground: true });
    }
    await page.close();
  }));
  await browser.close(); console.log('ok', from, to);
})();
