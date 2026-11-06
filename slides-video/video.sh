#!/bin/bash
# Uso: video.sh <pasta-do-carrossel> <saida.mp4>  -> video vertical 1080x1920 de slides com musica
D=$1; O=$2; T=3.6; X=0.5
ffmpeg -y -loglevel error \
 -loop 1 -t $T -i $D/1.png -loop 1 -t $T -i $D/2.png -loop 1 -t $T -i $D/3.png -loop 1 -t $T -i $D/4.png -i musica.wav \
 -filter_complex "\
[0]scale=1080:-2,pad=1080:1920:0:285:color=0x120726,format=yuv420p[a];\
[1]scale=1080:-2,pad=1080:1920:0:285:color=0x120726,format=yuv420p[b];\
[2]scale=1080:-2,pad=1080:1920:0:285:color=0x120726,format=yuv420p[c];\
[3]scale=1080:-2,pad=1080:1920:0:285:color=0x120726,format=yuv420p[d];\
[a][b]xfade=transition=slideleft:duration=$X:offset=3.1[ab];\
[ab][c]xfade=transition=slideleft:duration=$X:offset=6.2[abc];\
[abc][d]xfade=transition=slideleft:duration=$X:offset=9.3[v]" \
 -map "[v]" -map 4:a -t 12.8 -r 30 -c:v libx264 -preset veryfast -crf 21 -c:a aac -b:a 128k -af "afade=t=out:st=11.8:d=1" -shortest -movflags +faststart $O
