#!/bin/bash
# uso: montar_branco.sh bruto.mp4 inicio_s duracao_s params.json saida.mp4 [legendas.ass]
# Layout branco (cabecalho com logo, nome verificado, @ e titulo; video no meio; credito) + slide final "Siga o GTArchived" 2.5 s.
# params.json: titulo, credito, creditoBaixo, crop {x,y,w,h} (regiao do bruto; padrao = centro), videoY (560), videoH (1000), tituloPx (62)
# Legendas .ass com tempo relativo ao inicio do corte (offset 0).
set -e
RAW=$(readlink -f "$1"); SS="$2"; DUR="$3"; PRM=$(readlink -f "$4"); OUT=$(readlink -f "$5"); ASS="$6"; [ -n "$ASS" ] && ASS=$(readlink -f "$ASS")
cd "$(dirname "$0")"; D=$(mktemp -d)
NODE_PATH=$(npm root -g) node layout.js "$PRM" "$D"
read Y0 VH CX CY CW CH < <(python3 -c "
import json,subprocess;p=json.load(open('$PRM'));Y=p.get('videoY',560);H=p.get('videoH',1000)
w,h=map(int,subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0','$RAW']).decode().strip().split(','))
c=p.get('crop')
if not c:
  ar=1080/H
  if w/h>ar: cw=int(h*ar)//2*2; c={'x':(w-cw)//2,'y':0,'w':cw,'h':h}
  else: ch=int(w/ar)//2*2; c={'x':0,'y':(h-ch)//2,'w':w,'h':ch}
print(Y,H,c['x'],c['y'],c['w'],c['h'])")
SUB=""; [ -n "$ASS" ] && SUB=",ass=$ASS:fontsdir=$(pwd)"
ffmpeg -y -loglevel error -loop 1 -framerate 30 -t "$DUR" -i "$D/header.png" -ss "$SS" -t "$DUR" -i "$RAW" -loop 1 -framerate 30 -t "$DUR" -i "$D/pill.png" -loop 1 -framerate 30 -t 2.5 -i "$D/end.png" -f lavfi -t 2.5 -i anullsrc=r=44100:cl=stereo -filter_complex "
[1:v]fps=30,crop=$CW:$CH:$CX:$CY,scale=1080:$VH,setsar=1[v1];[0:v][v1]overlay=0:$Y0[b1];[b1][2:v]overlay=0:0,format=yuv420p$SUB,setsar=1[mv];
[1:a]aresample=44100,aformat=channel_layouts=stereo[ma];[3:v]format=yuv420p,setsar=1[ev];[4:a]aformat=channel_layouts=stereo[ea];
[mv][ma][ev][ea]concat=n=2:v=1:a=1[v][a0];[a0]loudnorm=I=-14:TP=-1.5:LRA=9[a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 160k -movflags +faststart "$OUT"
echo "ok: $OUT"
