# Cortes de criadores (processo)
1. Escolher o vídeo e o trecho (30 a 75 s) por transcrição/legendas; anotar canal, título e link para o crédito.
2. Gravar o trecho no navegador do PC (YouTube aberto, 1080p): `gravar_youtube.js`. Sai um .webm em Downloads (passagem). Levar para a nuvem com device_stage_files.
3. Converter e montar: `ffmpeg -i bruto.webm -c:v libx264 -crf 20 -r 30 -c:a aac bruto.mp4` e depois `./montar.sh bruto.mp4 INICIO_S DURACAO_S params.json saida.mp4`.
   params.json: gancho, etiqueta, credito, faixaTag, faixaTitulo (ver overlay.js).
4. Salvar no repositório: bruto em `origem/<criador>/`, final em `reels/AAAA-MM-DD-slug.mp4`, capa em `capas/`.
5. Publicar: Instagram (vidiq_instagram_publish_reel), TikTok Studio e YouTube Studio (Chrome). Legenda: selo no início, crédito ao canal com link, até 5 hashtags terminando com #GTArchived.
Regras: o dono autoriza repostar cortes; o crédito ao criador fica sempre visível no vídeo e na legenda. Sem vazamento não confirmado.
