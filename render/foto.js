// Renderizador de posts com imagens oficiais (carrossel 1080x1350 e quadros de Reel 1080x1920).
// Uso: node foto.js <post.json> <pasta-de-saida>
// JSON: { selo, tema, fonte, credito, slides:[{ img, pos, gancho, sub, fs }] }
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const COR = { OFICIAL: '#25E2E0', CONTAGEM: '#25E2E0', IMPRENSA: '#FFB347', '1 FONTE': '#FFB347', RUMOR: '#FF3E9A', VAZAMENTO: '#FF3E9A' };
const fonts = path.resolve(__dirname, 'fonts');
const FOLDER = `<svg width="84" height="67" viewBox="0 0 200 160"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD25A"/><stop offset=".5" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FF3E9A"/></linearGradient></defs><path d="M16 20H78L92 36H184A10 10 0 0 1 194 46V140A10 10 0 0 1 184 150H16A10 10 0 0 1 6 140V30A10 10 0 0 1 16 20Z" fill="url(#g)"/><circle cx="168" cy="62" r="8" fill="#25E2E0"/><text x="100" y="116" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="64" letter-spacing="-2" fill="#1A0B2E">GTA</text></svg>`;
const CSS = (W, H) => `
@font-face{font-family:Archivo;font-weight:600;src:url(file://${fonts}/archivo-latin-600-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;src:url(file://${fonts}/archivo-latin-900-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;font-style:italic;src:url(file://${fonts}/archivo-latin-900-italic.woff2)}
@font-face{font-family:JetBrains;font-weight:700;src:url(file://${fonts}/jetbrains-mono-latin-700-normal.woff2)}
*{box-sizing:border-box}body{margin:0;width:${W}px;height:${H}px;overflow:hidden;font-family:Archivo,sans-serif;background:#120726;position:relative}
.mono{font-family:JetBrains,monospace;font-weight:700}
.wm{font-weight:900;font-size:42px;letter-spacing:-.03em;color:#F4EFE4;line-height:1}.wm b{color:#FFB347}
.pill{display:inline-block;color:#1A0B2E;font-size:28px;letter-spacing:.12em;padding:12px 26px;border-radius:8px}
.top{display:flex;align-items:center;justify-content:space-between}`;
const topo = (n, t) => `<div class="top"><div style="display:flex;align-items:center;gap:20px">${FOLDER}<div class="wm">GT<b>A</b>rchived</div></div><div class="mono" style="font-size:28px;letter-spacing:.12em;color:#F4EFE4;text-shadow:0 2px 8px rgba(0,0,0,.6)">${n} / ${t}</div></div>`;

// carrossel: foto em tela cheia
function carrossel(d, ctx, n, t) {
  const { selo, tema, cor, fonte, credito } = ctx;
  if (d.card) return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(1080, 1350)}
.bg{position:absolute;inset:-60px;background:url(file://${d.img}) 50% 50%/cover;filter:blur(38px) brightness(.45) saturate(1.2)}
.ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,7,38,.55) 0%,rgba(43,18,80,.25) 50%,rgba(106,27,122,.45) 100%)}
.wrap{position:absolute;left:72px;top:72px;width:936px;height:1206px;display:flex;flex-direction:column}
.card{margin:40px -72px 0;width:1080px;height:607px;background:url(file://${d.img}) 50% 50%/cover;box-shadow:0 20px 60px rgba(0,0,0,.55)}
</style></head><body><div class="bg"></div><div class="ov"></div><div class="wrap">${topo(n, t)}
<div class="card" style="margin-top:50px"></div>
<div style="margin-top:44px;display:flex;align-items:center;gap:24px"><span class="pill mono" style="background:${cor}">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:26px;font-style:italic;font-weight:900;font-size:${d.fs || 96}px;line-height:1;letter-spacing:-.025em;color:#F4EFE4;text-shadow:0 4px 18px rgba(0,0,0,.55)">${esc(d.gancho)}</div>
<div style="margin-top:22px;font-weight:600;font-size:38px;line-height:1.3;color:#F4EFE4;max-width:880px">${esc(d.sub)}</div>
<div class="mono" style="margin-top:auto;font-size:22px;letter-spacing:.1em;color:#C9B8E8">${esc(credito)} · FONTE: ${esc(fonte.toUpperCase())}</div></div></body></html>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(1080, 1350)}
.ph{position:absolute;inset:0;background:url(file://${d.img}) ${d.pos || '50% 50%'}/cover}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,7,38,.78) 0%,rgba(18,7,38,0) 22%,rgba(18,7,38,0) 40%,rgba(18,7,38,.88) 78%,rgba(18,7,38,.96) 100%)}
.wrap{position:absolute;left:72px;top:72px;width:936px;height:1206px;display:flex;flex-direction:column}
</style></head><body><div class="ph"></div><div class="sh"></div><div class="wrap">${topo(n, t)}
<div style="margin-top:auto"><div style="display:flex;align-items:center;gap:24px"><span class="pill mono" style="background:${cor}">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:30px;font-style:italic;font-weight:900;font-size:${d.fs || 100}px;line-height:1;letter-spacing:-.025em;color:#F4EFE4;text-shadow:0 4px 18px rgba(0,0,0,.55)">${esc(d.gancho)}</div>
<div style="margin-top:26px;font-weight:600;font-size:40px;line-height:1.3;color:#F4EFE4;max-width:880px;text-shadow:0 3px 12px rgba(0,0,0,.6)">${esc(d.sub)}</div>
<div class="mono" style="margin-top:34px;font-size:22px;letter-spacing:.1em;color:#C9B8E8">${esc(credito)} · FONTE: ${esc(fonte.toUpperCase())}</div></div></div></body></html>`;
}
// quadro de Reel: fundo desfocado + foto inteira em cartao
function reel(d, ctx, n, t) {
  const { selo, tema, cor, fonte, credito } = ctx;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(1080, 1920)}
.bg{position:absolute;inset:-60px;background:url(file://${d.img}) 50% 50%/cover;filter:blur(38px) brightness(.45) saturate(1.2)}
.ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,7,38,.55) 0%,rgba(43,18,80,.25) 50%,rgba(106,27,122,.45) 100%)}
.wrap{position:absolute;left:72px;top:96px;width:936px;height:1728px;display:flex;flex-direction:column}
.card{margin:60px -72px 0;width:1080px;height:607px;background:url(file://${d.img}) 50% 50%/cover;box-shadow:0 20px 60px rgba(0,0,0,.55)}
</style></head><body><div class="bg"></div><div class="ov"></div><div class="wrap">${topo(n, t)}
<div style="margin-top:80px;display:flex;align-items:center;gap:24px"><span class="pill mono" style="background:${cor}">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:36px;font-style:italic;font-weight:900;font-size:${d.fsr || 108}px;line-height:1;letter-spacing:-.025em;color:#F4EFE4;text-shadow:0 4px 18px rgba(0,0,0,.55)">${esc(d.gancho)}</div>
<div class="card"></div>
<div style="margin-top:44px;font-weight:600;font-size:44px;line-height:1.3;color:#F4EFE4;max-width:860px;text-shadow:0 3px 12px rgba(0,0,0,.6)">${esc(d.sub)}</div>
<div class="mono" style="margin-top:auto;font-size:24px;letter-spacing:.1em;color:#C9B8E8">${esc(credito)} · FONTE: ${esc(fonte.toUpperCase())}</div></div></body></html>`;
}
(async () => {
  const post = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = path.resolve(process.argv[3]); fs.mkdirSync(out, { recursive: true });
  const cor = COR[String(post.selo).toUpperCase()] || '#FFB347';
  const ctx = { selo: String(post.selo).toUpperCase(), tema: post.tema, cor, fonte: post.fonte, credito: post.credito };
  const browser = await chromium.launch();
  for (const [mode, W, H, fn, pre] of [['c', 1080, 1350, carrossel, 'c'], ['r', 1080, 1920, reel, 'r']]) {
    const arr = pre === 'r' && post.reel ? post.reel : post.slides;
    const total = arr.length + 1;
    const cx = { ...ctx, credito: pre === 'r' && post.creditoReel ? post.creditoReel : ctx.credito };
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    for (let i = 0; i < arr.length; i++) {
      const f = path.join(out, `tmp_${pre}${i}.html`);
      fs.writeFileSync(f, fn(arr[i], cx, i + 1, total)); await page.goto('file://' + f);
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(out, `${pre}${i + 1}.png`) });
      const y = await page.evaluate(() => { const c = document.querySelector('.card'); return c ? Math.round(c.getBoundingClientRect().top) : -1; });
      fs.writeFileSync(path.join(out, `${pre}${i + 1}.y`), String(y)); fs.unlinkSync(f);
    }
    await page.close();
  }
  await browser.close(); console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
