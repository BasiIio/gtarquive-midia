// Renderizador de Reels do GTArquive.
// Uso: node render.js '<json>' <saida-sem-extensao>
// Gera <saida>.png (capa/primeiro quadro) e <saida>.mp4 (6 s, 1080x1920, vertical).
// JSON:
//   tipo: "noticia" (padrao) ou "contagem"
//   selo: OFICIAL | IMPRENSA | 1 FONTE | RUMOR | VAZAMENTO | CONTAGEM
//   tema: texto curto (2 a 3 palavras)
//   manchete: ate 8 palavras
//   apoio: ate 20 palavras
//   fonte: nome do veiculo ou da fonte
//   numero, data: so para tipo "contagem"
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SELO_COR = {
  'OFICIAL': '#25E2E0',
  'IMPRENSA': '#FFB347',
  '1 FONTE': '#FFB347',
  'RUMOR': '#FF3E9A',
  'VAZAMENTO': '#FF3E9A',
  'CONTAGEM': '#25E2E0',
};

const FOLDER = `
<svg width="110" height="88" viewBox="0 0 200 160" aria-hidden="true">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#FFD25A"/><stop offset="0.5" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FF3E9A"/>
</linearGradient></defs>
<path d="M16 20 H78 L92 36 H184 A10 10 0 0 1 194 46 V140 A10 10 0 0 1 184 150 H16 A10 10 0 0 1 6 140 V30 A10 10 0 0 1 16 20 Z" fill="url(#g)"/>
<circle cx="168" cy="62" r="8" fill="#25E2E0"/>
<text x="100" y="116" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="64" letter-spacing="-2" fill="#1A0B2E">GTA</text>
</svg>`;

const PALM = `
<svg style="position:absolute;right:-90px;top:1230px" width="380" height="760" viewBox="0 0 400 800" aria-hidden="true">
<g fill="none" stroke="#0B0618" stroke-linecap="round">
<path d="M130 800 C150 600 170 420 230 250" stroke-width="18"/>
<path d="M230 250 C170 200 90 210 30 290" stroke-width="14"/>
<path d="M230 250 C180 170 120 140 50 150" stroke-width="14"/>
<path d="M230 250 C230 170 260 110 320 70" stroke-width="14"/>
<path d="M230 250 C290 190 360 190 395 250" stroke-width="14"/>
<path d="M230 250 C300 230 350 270 380 340" stroke-width="14"/>
<path d="M230 250 C160 260 110 320 100 390" stroke-width="14"/>
</g></svg>`;

const SKYLINE = `
<svg style="position:absolute;left:0;top:1660px" width="1080" height="260" viewBox="0 0 1080 260" aria-hidden="true">
<g fill="#0B0618">
<rect x="0" y="140" width="70" height="120"/><rect x="60" y="90" width="60" height="170"/>
<rect x="130" y="150" width="50" height="110"/><rect x="190" y="60" width="70" height="200"/>
<rect x="270" y="120" width="60" height="140"/><rect x="340" y="170" width="80" height="90"/>
<rect x="430" y="100" width="55" height="160"/><rect x="495" y="40" width="65" height="220"/>
<rect x="570" y="130" width="70" height="130"/><rect x="650" y="80" width="55" height="180"/>
<rect x="715" y="150" width="60" height="110"/><rect x="785" y="110" width="70" height="150"/>
<rect x="865" y="60" width="60" height="200"/><rect x="935" y="140" width="70" height="120"/>
<rect x="1000" y="100" width="80" height="160"/>
</g></svg>`;

function html(d) {
  const fonts = path.resolve(__dirname, 'fonts');
  const selo = String(d.selo || (d.tipo === 'contagem' ? 'CONTAGEM' : 'OFICIAL')).toUpperCase();
  const cor = SELO_COR[selo] || '#FFB347';
  const base = `
<style>
@font-face{font-family:Archivo;font-weight:600;src:url(file://${fonts}/archivo-latin-600-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;src:url(file://${fonts}/archivo-latin-900-normal.woff2)}
@font-face{font-family:Archivo;font-weight:900;font-style:italic;src:url(file://${fonts}/archivo-latin-900-italic.woff2)}
@font-face{font-family:JetBrains;font-weight:700;src:url(file://${fonts}/jetbrains-mono-latin-700-normal.woff2)}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Archivo,sans-serif;background:#120726}
.bg{position:absolute;inset:0;background:linear-gradient(180deg,#120726 0%,#2B1250 55%,#4A1A6B 82%,#6A1B7A 100%)}
.glow{position:absolute;left:0;top:1300px;width:1080px;height:620px;background:radial-gradient(ellipse at 50% 100%,rgba(255,62,154,.85) 0%,rgba(106,27,122,.45) 48%,rgba(18,7,38,0) 74%)}
.wrap{position:absolute;left:72px;top:300px;width:936px;display:flex;flex-direction:column}
.head{display:flex;align-items:center;gap:22px}
.wm{font-weight:900;font-size:50px;letter-spacing:-.03em;color:#F4EFE4;line-height:1}
.wm b{color:#FFB347}
.mono{font-family:JetBrains,monospace;font-weight:700}
.pill{display:inline-block;background:${cor};color:#1A0B2E;font-size:34px;letter-spacing:.12em;padding:14px 30px;border-radius:8px}
.handle{position:absolute;left:0;width:1080px;top:1600px;text-align:center;font-size:32px;letter-spacing:.1em;color:#F4EFE4}
</style>`;
  const head = `<div class="head">${FOLDER}<div class="wm">GT<b>A</b>rchive</div></div>`;
  let body;
  if (d.tipo === 'contagem') {
    body = `
<div class="wrap" style="align-items:center;text-align:center">
${head}
<div style="margin-top:70px"><span class="pill mono">${esc(selo)}</span></div>
<div style="margin-top:30px;font-style:italic;font-weight:900;font-size:520px;line-height:.9;letter-spacing:-.04em;color:#F4EFE4;text-shadow:0 12px 0 rgba(18,7,38,.45)">${esc(d.numero)}</div>
<div style="font-style:italic;font-weight:900;font-size:104px;line-height:1;letter-spacing:-.02em;color:#F4EFE4">dias para <span style="color:#FFB347">GTA 6</span></div>
<div class="mono" style="margin-top:36px;font-size:34px;letter-spacing:.1em;color:#F4EFE4">${esc(d.data || '19/11 · 0H EM BRASÍLIA')}</div>
</div>`;
  } else {
    body = `
<div class="wrap">
${head}
<div style="margin-top:90px"><span class="pill mono">${esc(selo)}</span></div>
<div class="mono" style="margin-top:34px;font-size:32px;letter-spacing:.14em;color:#FF8AC0">${esc(String(d.tema || '').toUpperCase())}</div>
<div style="margin-top:26px;font-style:italic;font-weight:900;font-size:96px;line-height:1.02;letter-spacing:-.02em;color:#F4EFE4;max-width:936px;text-wrap:balance">${esc(d.manchete)}</div>
<div style="margin-top:40px;font-weight:600;font-size:44px;line-height:1.3;color:#E9DFF7;max-width:700px">${esc(d.apoio)}</div>
<div class="mono" style="margin-top:54px;font-size:28px;letter-spacing:.1em;color:#C9B8E8">FONTE: ${esc(String(d.fonte || '').toUpperCase())}</div>
</div>`;
  }
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${base}</head><body>
<div class="bg"></div><div class="glow"></div>${PALM}${SKYLINE}${body}
<div class="handle mono">@gtarchive</div></body></html>`;
}

(async () => {
  const dados = JSON.parse(process.argv[2]);
  const saida = path.resolve(process.argv[3] || 'saida');
  const tmp = saida + '.html';
  fs.writeFileSync(tmp, html(dados));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: saida + '.png' });
  await browser.close();
  fs.unlinkSync(tmp);
  // Video de 6 s: o primeiro quadro ja tem todo o conteudo (vira a capa), com zoom leve.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-framerate', '30', '-i', saida + '.png',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-vf', "scale=2160:3840,zoompan=z='1+0.0005*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1080x1920:fps=30,format=yuv420p",
    '-t', '6', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-c:a', 'aac', '-shortest',
    '-movflags', '+faststart', saida + '.mp4']);
  console.log('ok', saida + '.mp4');
})().catch((e) => { console.error(e); process.exit(1); });
