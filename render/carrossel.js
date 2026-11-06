// Renderizador de carrosseis do GTArquive (slides 1080x1350).
// Uso: node carrossel.js <arquivo.json> <pasta-de-saida>
// JSON: { selo, tema, slides: [ ...slides ] }  (o slide final de CTA e adicionado sozinho)
// Tipos de slide:
//   capa:   { tipo:"capa", icone, gancho, sub }
//   dado:   { tipo:"dado", icone, numero, legenda, texto, fonte }
//   barras: { tipo:"barras", titulo, itens:[{label, valor, rotulo, destaque}], texto, fonte }
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const COR = { 'OFICIAL': '#25E2E0', 'CONTAGEM': '#25E2E0', 'IMPRENSA': '#FFB347', '1 FONTE': '#FFB347', 'RUMOR': '#FF3E9A', 'VAZAMENTO': '#FF3E9A' };

const ICONES = {
  moedas: `<g fill="none" stroke="#FFB347" stroke-width="10" stroke-linecap="round"><ellipse cx="100" cy="150" rx="70" ry="20"/><path d="M30 150v-40M170 150v-40"/><ellipse cx="100" cy="110" rx="70" ry="20"/><path d="M30 110v-40M170 110v-40"/><ellipse cx="100" cy="70" rx="70" ry="20" fill="#FFB347" fill-opacity=".25"/></g>`,
  trofeu: `<g fill="none" stroke="#FFB347" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M60 30h80v50a40 40 0 0 1-80 0z" fill="#FFB347" fill-opacity=".25"/><path d="M60 45H30c0 30 15 45 35 48M140 45h30c0 30-15 45-35 48"/><path d="M100 120v30M65 170h70"/></g>`,
  ampulheta: `<g fill="none" stroke="#25E2E0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M55 25h90M55 175h90"/><path d="M65 25c0 50 70 50 70 75s-70 25-70 75M135 25c0 50-70 50-70 75"/><path d="M85 150h30" stroke="#FF3E9A"/></g>`,
  play: `<g fill="none" stroke="#FF3E9A" stroke-width="10" stroke-linejoin="round"><rect x="15" y="40" width="170" height="120" rx="24"/><path d="M85 75l45 25-45 25z" fill="#FF3E9A"/></g>`,
  disco: `<g fill="none" stroke="#25E2E0" stroke-width="10"><circle cx="100" cy="100" r="78"/><circle cx="100" cy="100" r="18" fill="#25E2E0" fill-opacity=".3"/><path d="M40 70a70 70 0 0 1 40-30" stroke="#FFB347" stroke-linecap="round"/></g>`,
  alerta: `<g fill="none" stroke="#FF3E9A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M100 25L180 165H20z"/><path d="M100 80v45M100 148v2"/></g>`,
  calendario: `<g fill="none" stroke="#25E2E0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><rect x="25" y="45" width="150" height="130" rx="16"/><path d="M25 85h150M65 25v35M135 25v35"/><path d="M75 125l20 20 35-40" stroke="#FFB347"/></g>`,
  grafico: `<g fill="none" stroke="#FFB347" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M25 170h155M25 30v140"/><path d="M45 140l40-35 30 20 55-70"/><path d="M145 55h25v25"/></g>`,
};
const icone = (n, size = 220) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200">${ICONES[n] || ICONES.moedas}</svg>`;

const FOLDER = `<svg width="84" height="67" viewBox="0 0 200 160"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD25A"/><stop offset=".5" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FF3E9A"/></linearGradient></defs><path d="M16 20H78L92 36H184A10 10 0 0 1 194 46V140A10 10 0 0 1 184 150H16A10 10 0 0 1 6 140V30A10 10 0 0 1 16 20Z" fill="url(#g)"/><circle cx="168" cy="62" r="8" fill="#25E2E0"/><text x="100" y="116" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="64" letter-spacing="-2" fill="#1A0B2E">GTA</text></svg>`;
const FOLDER_BIG = FOLDER.replace('width="84" height="67"', 'width="260" height="208"');

function palma(left, top) {
  return `<svg style="position:absolute;${left ? 'left:-110px' : 'right:-110px;transform:scaleX(-1)'};top:${top||760}px" width="420" height="840" viewBox="0 0 400 800"><g fill="none" stroke="#0B0618" stroke-linecap="round"><path d="M130 800C150 600 170 420 230 250" stroke-width="18"/><path d="M230 250C170 200 90 210 30 290" stroke-width="14"/><path d="M230 250C180 170 120 140 50 150" stroke-width="14"/><path d="M230 250C230 170 260 110 320 70" stroke-width="14"/><path d="M230 250C290 190 360 190 395 250" stroke-width="14"/><path d="M230 250C300 230 350 270 380 340" stroke-width="14"/><path d="M230 250C160 260 110 320 100 390" stroke-width="14"/></g></svg>`;
}

function base(cor, inner, n, total, cta) {
  const fonts = path.resolve(__dirname, 'fonts');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;font-weight:600;src:url(file://${fonts}/archivo-latin-600-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;src:url(file://${fonts}/archivo-latin-900-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;font-style:italic;src:url(file://${fonts}/archivo-latin-900-italic.woff2)}
@font-face{font-family:JetBrains;font-weight:700;src:url(file://${fonts}/jetbrains-mono-latin-700-normal.woff2)}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1350px;overflow:hidden;font-family:Archivo,sans-serif;background:#120726}
.bg{position:absolute;inset:0;background:linear-gradient(180deg,#120726 0%,#2B1250 62%,${cta ? '#6A1B7A' : '#4A1A6B'} 100%)}
.glow{position:absolute;left:0;top:850px;width:1080px;height:500px;background:radial-gradient(ellipse at 50% 100%,rgba(255,62,154,.65) 0%,rgba(106,27,122,.35) 50%,rgba(18,7,38,0) 75%)}
.wrap{position:absolute;left:72px;top:72px;width:936px;height:1206px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;justify-content:space-between}
.wm{font-weight:900;font-size:42px;letter-spacing:-.03em;color:#F4EFE4;line-height:1}.wm b{color:#FFB347}
.mono{font-family:JetBrains,monospace;font-weight:700}
.pill{display:inline-block;background:${cor};color:#1A0B2E;font-size:28px;letter-spacing:.12em;padding:12px 26px;border-radius:8px}
.fonte{margin-top:auto;font-size:24px;letter-spacing:.1em;color:#C9B8E8}
</style></head><body><div class="bg"></div><div class="glow"></div>${inner}</body></html>`;
}

const topo = (n, total) => `<div class="top"><div style="display:flex;align-items:center;gap:20px">${FOLDER}<div class="wm">GT<b>A</b>rchived</div></div><div class="mono" style="font-size:28px;letter-spacing:.12em;color:#C9B8E8">${n} / ${total}</div></div>`;

function slideHtml(d, ctx, n, total) {
  const { selo, tema, cor } = ctx;
  if (d.tipo === 'cta') {
    return base(cor, `
<div style="position:absolute;left:190px;top:930px;width:700px;height:700px;border-radius:50%;background:linear-gradient(180deg,#FFD25A 0%,#FF8A3D 45%,#FF3E9A 100%);opacity:.85"></div>
${palma(true, 880)}${palma(false, 880)}
<div class="wrap" style="align-items:center;text-align:center">
<div style="margin-top:60px">${FOLDER_BIG}</div>
<div style="margin-top:50px;font-style:italic;font-weight:900;font-size:132px;line-height:.98;letter-spacing:-.03em;color:#F4EFE4;text-shadow:0 6px 0 rgba(18,7,38,.5)">Siga o <span style="color:#FFB347">@gtarchived</span></div>
<div style="margin-top:34px;font-weight:600;font-size:42px;line-height:1.3;color:#F4EFE4;max-width:780px;text-shadow:0 3px 0 rgba(18,7,38,.6)">Tudo de GTA 6, com status e fonte. Rumor sempre avisado como rumor.</div>
<div style="margin-top:50px;background:#FF3E9A;color:#1A0B2E;font-size:36px;letter-spacing:.1em;padding:20px 54px;border-radius:999px" class="mono">SEGUIR</div>
</div>`, n, total, true);
  }
  let inner;
  if (d.tipo === 'capa') {
    inner = `
${palma(false, 900)}
<div class="wrap">
${topo(n, total)}
<div style="margin-top:70px;display:flex;align-items:center;gap:24px"><span class="pill mono">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:50px;font-style:italic;font-weight:900;font-size:${d.fs || 128}px;line-height:1;letter-spacing:-.025em;color:#F4EFE4;text-wrap:balance">${esc(d.gancho)}</div>
<div style="margin-top:40px;font-weight:600;font-size:42px;line-height:1.3;color:#E9DFF7;max-width:760px">${esc(d.sub)}</div>
<div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between"><div>${icone(d.icone, 190)}</div><div class="mono" style="font-size:32px;letter-spacing:.1em;color:#25E2E0;border:3px solid #25E2E0;border-radius:999px;padding:14px 30px">DESLIZE →</div></div>
</div>`;
  } else if (d.tipo === 'dado') {
    inner = `
<div class="wrap">
${topo(n, total)}
<div style="margin-top:60px;display:flex;align-items:center;gap:24px"><span class="pill mono">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:50px">${icone(d.icone, 150)}</div>
<div style="margin-top:10px;font-style:italic;font-weight:900;font-size:${d.fs || 220}px;line-height:.95;letter-spacing:-.04em;color:#FFB347;text-shadow:0 8px 0 rgba(18,7,38,.45)">${esc(d.numero)}</div>
<div style="margin-top:24px;font-style:italic;font-weight:900;font-size:64px;line-height:1.05;letter-spacing:-.02em;color:#F4EFE4;max-width:900px">${esc(d.legenda)}</div>
<div style="margin-top:34px;font-weight:600;font-size:42px;line-height:1.32;color:#E9DFF7;max-width:860px">${esc(d.texto)}</div>
<div class="fonte mono">FONTE: ${esc(String(d.fonte || '').toUpperCase())}</div>
</div>`;
  } else {
    const max = Math.max(...d.itens.map((i) => i.valor));
    const barras = d.itens.map((i) => {
      const w = Math.max(8, Math.round((i.valor / max) * 100));
      const c = i.destaque ? '#FF3E9A' : '#25E2E0';
      return `<div style="margin-top:34px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:20px"><div style="font-weight:600;font-size:38px;color:#F4EFE4">${esc(i.label)}</div><div class="mono" style="font-size:40px;color:${i.destaque ? '#FF8AC0' : '#25E2E0'};white-space:nowrap">${esc(i.rotulo)}</div></div><div style="margin-top:12px;height:34px;width:${w}%;background:${c};border-radius:8px"></div></div>`;
    }).join('');
    inner = `
<div class="wrap">
${topo(n, total)}
<div style="margin-top:60px;display:flex;align-items:center;gap:24px"><span class="pill mono">${esc(selo)}</span><span class="mono" style="font-size:28px;letter-spacing:.14em;color:#FF8AC0">${esc(tema.toUpperCase())}</span></div>
<div style="margin-top:44px;font-style:italic;font-weight:900;font-size:80px;line-height:1.02;letter-spacing:-.02em;color:#F4EFE4">${esc(d.titulo)}</div>
<div style="margin-top:20px">${barras}</div>
${d.texto ? `<div style="margin-top:44px;font-weight:600;font-size:38px;line-height:1.32;color:#E9DFF7;max-width:860px">${esc(d.texto)}</div>` : ''}
<div class="fonte mono">FONTE: ${esc(String(d.fonte || '').toUpperCase())}</div>
</div>`;
  }
  return base(cor, inner, n, total, false);
}

(async () => {
  const post = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = path.resolve(process.argv[3]);
  fs.mkdirSync(out, { recursive: true });
  const cor = COR[String(post.selo).toUpperCase()] || '#FFB347';
  const ctx = { selo: String(post.selo).toUpperCase(), tema: post.tema, cor };
  const slides = [...post.slides, { tipo: 'cta' }];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 0; i < slides.length; i++) {
    const f = path.join(out, `tmp${i + 1}.html`);
    fs.writeFileSync(f, slideHtml(slides[i], ctx, i + 1, slides.length));
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, `${i + 1}.png`) });
    fs.unlinkSync(f);
  }
  await browser.close();
  console.log('ok', out, slides.length);
})().catch((e) => { console.error(e); process.exit(1); });
