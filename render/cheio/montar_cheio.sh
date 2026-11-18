#!/bin/bash
# Uso: montar_cheio.sh bruto.mp4 inicio dur "TITULO" "credito" saida.mp4
# Fundo desfocado 1080x1920, gameplay em 16:9 largura total, título em cima, crédito embaixo (nunca sobre o vídeo).
TMP=$(mktemp -d); printf "%s" "$4" > $TMP/t.txt; printf "%s" "$5" > $TMP/c.txt
IN="$1"; SS="$2"; T="$3"; TIT="$4"; CRED="$5"; OUT="$6"
F=/home/claude/gtarquive-midia/render/branco/Archivo-Black.ttf
ffmpeg -v error -y -ss "$SS" -t "$T" -i "$IN" -filter_complex "
[0:v]split[a][b];
[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.25[bg];
[b]scale=1080:-2[fg];
[bg][fg]overlay=0:(H-h)/2,
drawtext=fontfile='$F':textfile=$TMP/t.txt:fontcolor=white:fontsize=58:borderw=6:bordercolor=black:x=(w-text_w)/2:y=330,
drawtext=fontfile='$F':textfile=$TMP/c.txt:fontcolor=white:fontsize=40:box=1:boxcolor=black@0.7:boxborderw=18:x=(w-text_w)/2:y=1500[v]" -map "[v]" -map 0:a? -c:v libx264 -preset veryfast -crf 20 -r 30 -c:a aac -b:a 160k -movflags +faststart "$OUT"
