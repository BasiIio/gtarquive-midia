# Layout branco (padrão dos cortes desde 17/11/2026, pedido do dono)
Fundo branco em cima e embaixo; cabeçalho com logo do canal (marca/logo-gtarchived.jpg), "GTArchived" + selo de verificado, @gtarchived.oficial e título chamativo (fiel ao que o criador disse); vídeo no meio entre faixas rosa; pílula com o canal do criador sobre o vídeo; legenda amarela com contorno; crédito por extenso embaixo; slide final branco "Siga o GTArchived".
1. Transcrever (ElevenLabs Scribe via raw GitHub do áudio; ~5,5 créditos/s) e salvar words.json.
2. `MARGINV=410 python3 legendas.py words.json 0 leg.ass [ini-fim de trechos inaudíveis]` (nunca legendar palavra duvidosa).
3. params.json: titulo, credito (ex. twitch.tv/alanzoka), creditoBaixo, crop {x,y,w,h} do bruto (enquadrar o rosto/jogo), headY 170, videoY 690, videoH 860, tituloPx 66.
4. `./montar_branco.sh bruto.mp4 inicio dur params.json saida.mp4 leg.ass` e conferir os quadros antes de postar.
