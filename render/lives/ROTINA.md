# Rotina de cortes de lives da Twitch (autorizada pelo dono em 17/11/2026 23h35, registrada no Notion)
Canais principais: alanzoka, davyjones, paulinholokobr. Reservas (só se nenhum dos 3 estiver ao vivo): oflowgames, brksedu.
Só momentos de GTA 6 (a página é de GTA 6). Selo [REAÇÃO] (ou outro que couber). Nunca afirmar o que o streamer não disse.

## Preparar o container (se foi reiniciado)
- Repositório: /home/claude/gtarquive-midia (clonar BasiIio/gtarquive-midia se faltar).
- Modelo de transcrição grátis: baixar com curl (o cliente python do HF falha):
  mkdir -p /home/claude/models/whisper-small; for f in config.json tokenizer.json vocabulary.txt model.bin; do curl -sSL -o /home/claude/models/whisper-small/$f https://huggingface.co/Systran/faster-whisper-small/resolve/main/$f; done
- `pip install --break-system-packages brotli` (se precisar converter fonte).

## Ciclo (checar a cada 5 min enquanto houver live — pedido do dono 18/11 00h04)
1. Navegador embutido do PC: abrir twitch.tv/<canal> e ver se está AO VIVO (screenshot/texto). Não usar a API interna da Twitch (gql) — o classificador bloqueia.
2. Abrir twitch.tv/<canal>/clips?filter=clips&range=24hr ; escolher clipes NOVOS de GTA 6 com mais visualizações (anotar o slug usado em render/lives/usados.txt para não repetir).
2b. ESCOLHER O MELHOR (pedido do dono 18/11 00h05): não pegar só o mais visto. Para os 3-5 candidatos novos de GTA 6: baixar, transcrever (9 s cada) e dar nota:
   - Velocidade: visualizações por minuto desde que o clipe foi criado (pesa mais que o total).
   - Momento: primeira impressão/reação forte, risada, susto, descoberta no mapa, física/detalhe impressionante, bug engraçado, fala marcante sobre o jogo. Picos de volume e risada no áudio contam a favor.
   - Clareza: fala entendível, começa e termina no assunto, 15-60 s. Descartar clipes sem fala útil, só tela de carregamento, menu ou anúncio.
   - Novidade: não repetir assunto de corte recente; variar cenas (regra de variedade).
   - Evitar spoiler pesado da história (final, mortes, reviravoltas); preferir gameplay e reação.
   Postar o de maior nota; os outros bons ficam na fila em render/lives/fila.txt (com slug, canal, nota e motivo).
3. Abrir o clipe, ler `document.querySelector('video').currentSrc` e baixar com fetch→blob→<a download> (sai como .tmp GUID em C:\Users\HOME\Downloads; achar pelo tamanho com device_list_dir; device_stage_files).
4. Transcrever: ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 a.wav; python3 render/lives/transcrever.py a.wav words.json (corrigir nomes: Selbit→Cellbit etc.; pular trechos com p<0.4 ou ininteligíveis).
5. Montar no layout branco (render/branco/LEIA-ME.md): título chamativo fiel à fala, crop no rosto/jogo, legendas, conferir quadros (contact sheet) antes de postar.
6. Salvar no repo (origem/twitch/<canal>/, reels/), commit + push (sem avisar o dono).
7. Postar o corte nas 3 redes de uma vez pelo Metricool (já conectado: Instagram gtarquive, TikTok GTArchived, YouTube UCCXNZ489s_4_8EmXrTFQA9g; blogId 7906683; fuso America/Sao_Paulo): mcp__Metricool_Social_Media_Management__createScheduledPost com date = agora + 2 min, autoPublish true, media = [raw GitHub do reel no commit], providers instagram (instagramData.type REEL), tiktok (tiktokData.privacyOption PUBLIC_TO_EVERYONE), youtube (youtubeData type short, title, madeForKids false). Se o Metricool falhar ou bater limite do plano: Instagram via vidIQ e YouTube/TikTok pelo Chrome Browser 1. Um corte nas 3 redes a cada 20 min (pedido do dono). Meta: até 10 cortes por live.
7b. ADIANTAR (pedido do dono 18/11 00h11): no tempo livre entre um post e outro, deixar os próximos cortes já prontos (baixados, transcritos, montados e conferidos) em render/lives/prontos/ com nota no fila.txt. Manter 2-3 prontos. Na hora do slot de 20 min, só reavaliar (pode ter surgido algo melhor) e postar o melhor pronto.
8. Cortes de 10 min para YouTube longo: gravar a live no navegador do PC em blocos de 10 min (MediaRecorder, ~4 Mbps) quando houver trecho forte; publicar como vídeo normal no YouTube.
