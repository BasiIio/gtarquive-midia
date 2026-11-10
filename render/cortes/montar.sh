#!/bin/bash
# uso: montar.sh bruto.mp4 inicio_s duracao_s params.json saida.mp4
# Cria vertical 1080x1920: cartão de título 2.5s + corte (com selo, crédito e faixa) + slide final "Siga o GTArchived" 2.5s.
# Opcional 6o arg: voz.mp3 (locução do gancho) toca sobre o cartão de título, que se estende até acabar a voz (máx 6 s).
# Aceita fonte horizontal (centraliza sobre fundo desfocado) ou vertical (preenche).
set -e
RAW="$1"; SS="$2"; DUR="$3"; PRM="$4"; OUT="$5"; VOZ="$6"
TD=2.5
D=$(mktemp -d); [ -n "$VOZ" ] && VOZ=$(readlink -f "$VOZ") && L=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VOZ") && TD=$(python3 -c "print(min(6,max(2.5,$L+0.4)))")
cd "$(dirname "$0")"
NODE_PATH=$(npm root -g) node overlay.js "$PRM" "$D"
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$RAW"); H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$RAW")
ffmpeg -y -loglevel error -ss "$SS" -i "$RAW" -frames:v 1 "$D/bg.png"
if [ "$H" -gt "$W" ]; then MAIN="[m1]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[mx]"; else
MAIN="[m1]split[a][b];[a]scale=3413:1920,crop=1080:1920,boxblur=22:2,eq=brightness=-0.35[mb];[b]scale=1080:608,setsar=1[mf];[mb][mf]overlay=0:656[mx]"; fi
if [ -n "$VOZ" ]; then IA="[6:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:$TD[ia]"; else IA="[5:a]atrim=0:2.5,aformat=channel_layouts=stereo[ia]"; fi
ffmpeg -y -loglevel error -loop 1 -framerate 30 -t $TD -i "$D/bg.png" -loop 1 -framerate 30 -t $TD -i "$D/title.png" -ss "$SS" -t "$DUR" -i "$RAW" -loop 1 -framerate 30 -t 2.5 -i "$D/end.png" -i "$D/seal.png" -f lavfi -t 6 -i anullsrc=r=44100:cl=stereo ${VOZ:+-i "$VOZ"} -filter_complex "
[0:v]scale=3413:1920,crop=1080:1920,boxblur=14:1,eq=brightness=-0.3,format=yuv420p[bgi];[bgi][1:v]overlay=0:0,format=yuv420p,setsar=1[iv];
$IA;
[2:v]fps=30[m1];$MAIN;[mx][4:v]overlay=0:0,format=yuv420p,setsar=1[mv];
[2:a]aresample=44100,aformat=channel_layouts=stereo[ma];
[3:v]format=yuv420p,setsar=1[ev];[5:a]atrim=0:2.5,aformat=channel_layouts=stereo[ea];
[iv][ia][mv][ma][ev][ea]concat=n=3:v=1:a=1[v][a0];[a0]loudnorm=I=-14:TP=-1.5:LRA=9[a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 21 -c:a aac -b:a 160k -movflags +faststart "$OUT"
echo "ok: $OUT"
