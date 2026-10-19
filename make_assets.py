"""Gerador reprodutível das artes pixeladas e trilha autoral Pixel Code.
Requer Pillow, numpy, ffmpeg (arquivos já gerados acompanham distribuição)."""
from PIL import Image, ImageDraw
import numpy as np, wave, os, subprocess, math, random
from pathlib import Path
random.seed(23)
BASE=Path(__file__).parent/'assets'
ART=BASE/'art'; AUD=BASE/'audio'; ART.mkdir(parents=True,exist_ok=True); AUD.mkdir(parents=True,exist_ok=True)
# Sprites independentes utilizados no canvas do jogo
pal={'dark':'#121a32','edge':'#223b56','metal':'#ecf5f2','side':'#8ba9ba','cyan':'#6ceeff','orange':'#ff9a54'}
im=Image.new('RGBA',(32*4,32*3),'#00000000'); d=ImageDraw.Draw(im)
for row in range(3):
 for col in range(4):
  x=col*32;y=row*32
  leg=row%2
  d.rectangle((x+9,y+23,x+14,y+27+leg),fill='#364b64');d.rectangle((x+18,y+23,x+23,y+27+(1-leg)),fill='#364b64')
  d.rectangle((x+8,y+14,x+24,y+24),fill='#f59c51');d.rectangle((x+12,y+17,x+21,y+21),fill='#4e5b88')
  d.rectangle((x+5,y+15,x+8,y+23),fill='#a9c2ce');d.rectangle((x+24,y+15,x+27,y+23),fill='#a9c2ce')
  d.rectangle((x+6,y+3,x+26,y+15),fill='#243146');d.rectangle((x+8,y+4,x+24,y+13),fill='#eef4ed')
  d.rectangle((x+10,y+6,x+22,y+11),fill='#223850')
  if col!=2:
   d.rectangle((x+12,y+7,x+14,y+10),fill='#67f3ff');d.rectangle((x+19,y+7,x+21,y+10),fill='#67f3ff')
  else:d.rectangle((x+11,y+7,x+21,y+10),fill='#54c6d6')
  d.rectangle((x+15,y+1,x+17,y+3),fill='#e7a84b');d.rectangle((x+16,y-0,x+17,y+1),fill='#ffdd8c')
  d.rectangle((x+20,y+18,x+21,y+20),fill='#70ebff')
im.save(ART/'lumi-sprites.png')
# Icones PNG
for typ in ('gema','portal','chave','estrela','arvore','cacto','rocha','antena','lumi'):
 s=Image.new('RGBA',(32,32),'#00000000'); z=ImageDraw.Draw(s)
 if typ=='gema':
  z.polygon([(16,3),(26,11),(22,25),(16,30),(9,24),(6,11)],fill='#27bddb');z.polygon([(16,3),(16,26),(6,11)],fill='#82f7ff');z.polygon([(16,3),(26,11),(16,12)],fill='#d8ffff')
 elif typ=='portal':
  z.ellipse((5,1,27,31),fill='#6eeeff');z.ellipse((8,3,24,29),fill='#1c4778');z.ellipse((11,8,21,25),fill='#8c76ff')
 elif typ=='chave':
  z.rectangle((5,10,26,25),fill='#d4aa63');z.rectangle((7,12,24,23),fill='#426275');z.ellipse((10,14,15,19),fill='#6bf1df');z.rectangle((20,15,28,20),fill='#d4aa63')
 elif typ=='estrela':
  z.polygon([(16,1),(21,11),(31,13),(23,21),(25,31),(16,25),(7,31),(9,21),(1,13),(11,11)],fill='#ffdb65');z.polygon([(16,4),(19,13),(16,21),(11,13)],fill='#fff5a5')
 elif typ=='arvore':
  z.rectangle((14,20,19,30),fill='#7a4b44');z.ellipse((5,3,27,23),fill='#174e44');z.ellipse((8,0,22,18),fill='#357b58');z.rectangle((9,12,15,15),fill='#56a96c')
 elif typ=='cacto':
  z.rectangle((13,5,20,30),fill='#3a806b');z.rectangle((7,13,15,21),fill='#3a806b');z.rectangle((19,12,27,18),fill='#3a806b');z.rectangle((15,6,17,24),fill='#89c881')
 elif typ=='rocha':
  z.polygon([(3,26),(10,10),(24,7),(30,26)],fill='#687c9c');z.polygon([(10,10),(17,12),(3,26)],fill='#adbac8');z.line([(13,16),(18,22),(25,22)],fill='#485e87',width=2)
 elif typ=='antena':
  z.rectangle((13,8,20,29),fill='#708daf');z.rectangle((8,24,26,30),fill='#cad9e2');z.line([(17,7),(17,2)],fill='#ddedf5',width=2);z.ellipse((13,0,21,8),fill='#80f0ff')
 else:s=im.crop((0,0,32,32))
 s.save(ART/f'{typ}.png')
# marca do menu
logo=Image.new('RGBA',(100,100),'#00000000'); logo.paste(im.crop((0,0,32,32)).resize((96,96),Image.Resampling.NEAREST),(2,2));logo.save(ART/'lumi-logo.png')
# Composição chip-tune original com ondas seno, pulse e triângulo
SR=22050
NOTES={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def freq(note):
 if not note:return 0
 root=note[:-1];octave=int(note[-1]);midi=12*(octave+1)+NOTES[root];return 440*2**((midi-69)/12)
def tone(buffer,t,f,dur,vol=.1,shape='pulse',attack=.009):
 if not f:return
 st=int(t*SR); n=min(int(dur*SR),len(buffer)-st)
 if n<=0:return
 tt=np.arange(n,dtype=np.float32)/SR
 phase=np.mod(tt*f,1)
 if shape=='pulse':osc=np.where(phase<.28,1.,-.65)
 elif shape=='tri':osc=4*np.abs(phase-.5)-1
 elif shape=='bell':osc=np.sin(tt*f*2*math.pi)+.3*np.sin(tt*f*4*math.pi)
 else:osc=np.sin(tt*f*2*math.pi)
 attack_steps=max(1,min(n,int(attack*SR))); envelope=np.ones(n,dtype=np.float32)
 envelope[:attack_steps]=np.linspace(0,1,attack_steps)
 envelope*=np.minimum(1.,(n-np.arange(n,dtype=np.float32))/(SR*max(.04,dur*.23)))
 buffer[st:st+n]+=osc*envelope*vol
SONGS={
 'menu':{'tempo':114,'mel':['E5','G5','A5',None,'G5','E5','D5',None,'C5','D5','E5','G5','A5',None,'E5',None], 'bass':['C3','A2','F2','G2'],'chord':['C4','A3','F3','G3']},
 'floresta':{'tempo':122,'mel':['E5','G5','A5','G5','E5','D5','C5',None,'D5','E5','G5','A5','G5','E5','D5',None], 'bass':['C3','G2','A2','F2'],'chord':['C4','G3','A3','F3']},
 'deserto':{'tempo':112,'mel':['D5','F5','G5','A5','G5','F5','D5',None,'A4','D5','F5','G5','F5','D5','A4',None], 'bass':['D3','C3','A2','D3'],'chord':['D4','C4','A3','D4']},
 'cristais':{'tempo':106,'mel':['A5','C6','E6',None,'D6','C6','A5',None,'G5','A5','C6','E6','D6',None,'C6',None], 'bass':['A2','F2','C3','G2'],'chord':['A3','F3','C4','G3']},
 'cosmos':{'tempo':132,'mel':['G5','D6','B5','G5','E5','G5','A5',None,'C6','B5','G5','E5','D5','E5','G5',None], 'bass':['E3','C3','G2','D3'],'chord':['E4','C4','G3','D4']}}
for name,cfg in SONGS.items():
 beat=60/cfg['tempo']; steps=32; dur=steps*beat/2; buf=np.zeros(int(SR*dur)+SR//2,dtype=np.float32)
 for i in range(steps):
  t=i*beat/2; nt=cfg['mel'][i%16];tone(buf,t,freq(nt),beat*.41,.087,'pulse')
  if i%2==0:
   chord=cfg['chord'][(i//8)%4];tone(buf,t,freq(chord),beat*.75,.075,'tri')
   tone(buf,t,freq(cfg['bass'][(i//8)%4]),beat*.85,.14,'tri')
  if i%4==0:tone(buf,t,60,beat*.16,.16,'bell')
  if i%4==2:tone(buf,t,130,beat*.07,.055,'pulse')
  if i%2==1:tone(buf,t,1400,beat*.018,.013,'pulse')
 # tail smoothing
 buf=buf[:int(SR*dur)];fade=min(1200,len(buf)//8);buf[-fade:]*=np.linspace(1,0,fade)
 buf=np.tanh(buf*1.27)
 wfile=AUD/(name+'.wav')
 with wave.open(str(wfile),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*30000).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wfile),'-c:a','libvorbis','-q:a','3',str(AUD/(name+'.ogg'))],check=True)
 wfile.unlink()
for name, sequence in {'passo':[(550,.05),(700,.055)],'gema':[(850,.06),(1230,.09),(1660,.16)],'sucesso':[(523,.16),(659,.16),(784,.16),(1046,.36)],'erro':[(250,.16),(180,.24)],'clique':[(900,.06)],'portal':[(490,.12),(720,.15),(990,.3)],'ligar':[(440,.08),(880,.11)]}.items():
 timeline=sum(d for _,d in sequence)+.045;arr=np.zeros(int(SR*timeline),dtype=np.float32);tm=0
 for f,d in sequence:tone(arr,tm,f,d,.24,'bell');tm+=d
 with wave.open(str(AUD/(name+'.wav')),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(arr,-.98,.98)*32000).astype('<i2').tobytes())
print('assets generated')
