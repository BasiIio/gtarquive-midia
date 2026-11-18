# uso: python3 transcrever.py audio.wav(16k mono) saida_words.json
import sys,json,wave,numpy as np
from faster_whisper import WhisperModel
w=wave.open(sys.argv[1]); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
m=WhisperModel('/home/claude/models/whisper-small',device='cpu',compute_type='int8',cpu_threads=2)
segs,info=m.transcribe(a,language='pt',vad_filter=True,beam_size=1,word_timestamps=True)
W=[]
for s in segs:
    print(f'{s.start:6.2f}-{s.end:6.2f} {s.text}',flush=True)
    for x in s.words: W.append({'text':x.word.strip(),'start':round(x.start,2),'end':round(x.end,2),'type':'word','p':round(x.probability,2)})
json.dump(W,open(sys.argv[2],'w'),ensure_ascii=False)
