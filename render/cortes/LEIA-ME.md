# Cortes de criadores (processo)
1. Escolher o vídeo e o trecho (30 a 75 s) por transcrição/legendas; anotar canal, título e link para o crédito.
2. Gravar o trecho no navegador do PC (YouTube aberto, 1080p): `gravar_youtube.js`. Sai um .webm em Downloads (passagem). Levar para a nuvem com device_stage_files.
3. Converter e montar: `ffmpeg -i bruto.webm -c:v libx264 -crf 20 -r 30 -c:a aac bruto.mp4` e depois `./montar.sh bruto.mp4 INICIO_S DURACAO_S params.json saida.mp4`.
   params.json: gancho, etiqueta, credito, faixaTag, faixaTitulo (ver overlay.js).
3b. VOZ DE ABERTURA (tentar; se falhar em qualquer ponto, seguir SEM voz, sem parar e sem perguntar):
   - Gerar com mcp__ElevenLabs__creative_generate_speech (voz Nassif Hype `Fjiik8aKXNDjmxd1Q2jF`, modelo eleven_v4, generations_count 1; carregar via ToolSearch). Texto: 1 frase curta (até ~12 palavras, ~4 s) que apresenta o corte, ex.: "Olha o que o Davy Jones contou sobre GTA 6!". Nunca afirmar nada que o criador não disse. Não repetir a geração (gasta crédito).
   - Pegar o resultado com mcp__ElevenLabs__creative_get_flow_run_status (url do áudio, host elevenlabsusercontent.com, bloqueado na nuvem): abrir a url no navegador embutido do PC (ele baixa para Downloads), device_stage_files, copiar para `audio/voz/AAAA-MM-DD-slug.mp3` no repositório.
   - Montar passando o mp3 como 6o argumento: `./montar.sh bruto.mp4 INICIO DUR params.json saida.mp4 voz.mp3` (o cartão de título se estende até a voz acabar, máx. 6 s).
   - Se a voz não vier em ~10 min de tentativas (2 falhas seguidas), montar sem o 6o argumento e registrar no Notion "sem voz".
4. Salvar no repositório: bruto em `origem/<criador>/`, final em `reels/AAAA-MM-DD-slug.mp4`, capa em `capas/`.
5. Publicar: Instagram (vidiq_instagram_publish_reel), TikTok Studio e YouTube Studio (Chrome). Legenda: selo no início, crédito ao canal com link, até 5 hashtags terminando com #GTArchived.
Regras: o dono autoriza repostar cortes; o crédito ao criador fica sempre visível no vídeo e na legenda. Sem vazamento não confirmado.
