#!/usr/bin/env python3
"""Rebuild the local WebGL atlas from the four original commissioned pixel-art sources.
No asset downloaded at runtime. The transparent sprite strips are exported for the UI.
"""
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import json,math
BASE=Path(__file__).resolve().parents[1]; ART=BASE/'assets'/'art';SRC=ART/'source'
SRC.mkdir(exist_ok=True)
robot=Image.open(SRC/'robot-sheet.png').convert('RGBA')
fox=Image.open(SRC/'fox-sheet.png').convert('RGBA')
tiles=Image.open(SRC/'forest-kit.png').convert('RGBA')
back=Image.open(SRC/'enchanted-valley.png').convert('RGBA')
assets={}
def add(n,img):
 img=img.convert('RGBA')
 if img.width<1 or img.height<1: raise ValueError(n)
 assets[n]=img

def piece(name,img,region,trim=False):
 sub=img.crop(region)
 if trim:
  a=sub.getchannel('A').point(lambda z:255 if z>14 else 0)
  b=a.getbbox()
  if b:sub=sub.crop(b)
 add(name,sub)
 return sub

robot_rows={
 'idle':([190,352,512,680,845,1006,1170],(12,199)),
 'walk':([191,327,467,612,752,895,1036,1172,1315],(206,379)),
 'run':([184,320,465,606,748,887,1032,1173,1337],(385,540)),
 'jump':([193,360,540,714,907,1072,1245],(541,731)),
 'interact':([192,371,545,720,905,1101,1285],(731,887)),
 'celebrate':([217,400,579,757,945,1127,1308],(888,1057)),
}
for action,(bounds,(y0,y1)) in robot_rows.items():
 for j,(x0,x1) in enumerate(zip(bounds,bounds[1:])):
  piece(f'robot_{action}_{j}',robot,(x0,y0,x1,y1),True)
fox_rows={
 'idle':([(211,418),(445,655),(699,907),(939,1155)],(9,170)),
 'walk':([(211,459),(479,723),(726,969),(975,1215)],(171,314)),
 'run':([(207,488),(490,751),(755,1021),(1018,1304)],(318,459)),
 'sit':([(210,441),(451,694),(723,963),(966,1205)],(463,608)),
 'jump':([(215,486),(487,748),(750,1035),(1038,1360)],(606,753)),
 'wag':([(214,448),(453,711),(724,966),(969,1218)],(749,895)),
 'happy':([(240,477),(480,737),(735,998),(994,1250)],(894,1051)),
}
for action,(regions,(y0,y1)) in fox_rows.items():
 for j,(x0,x1) in enumerate(regions):
  piece(f'fox_{action}_{j}',fox,(x0,y0,x1,y1),True)
# Scene background sized for pixel-perfect 768x576 canvas and UV atlas.
back=back.resize((1152,648),Image.Resampling.LANCZOS)
add('valley',back)
# Atmospheric/terrain atlas pieces selected from the generated environment art.
regions={
 'path0':(668,8,783,113),'path1':(781,8,889,110),'path2':(668,117,786,224),
 'path3':(783,122,894,227),'path4':(676,241,790,348),'path5':(789,240,900,346),
 'ground0':(8,10,142,128),'ground1':(147,15,314,169),'ground2':(16,127,142,277),
 'tree0':(10,361,327,722),'tree1':(336,372,596,713),
 'tree2':(584,440,792,694),
 'bush0':(301,677,395,757),'bush1':(396,674,508,754),
 'bush2':(1010,815,1076,872),'shroom':(634,756,872,877),
 'crystal0':(681,683,789,753),'crystal1':(793,693,954,792),
 'rocks':(1110,691,1249,755),'portal_new':(1018,408,1237,687),
 'ruin0':(775,434,876,674),'ruin1':(898,439,1009,686),
 'bridge':(1007,267,1194,402), 'fence':(1047,754,1400,832),
 'waterfall':(6,726,139,940),'waterfall2':(144,727,296,936),
 'lamp':(1167,334,1260,479),'sign':(1171,830,1339,904),
 'crate':(1332,977,1423,1067),
}
for n,reg in regions.items():piece(n,tiles,reg,False)
# Procedural prebaked soft alpha light halo, texture is GPU sampled.
light=Image.new('RGBA',(128,128));p=light.load()
for y in range(128):
 for x in range(128):
  dist=((x-63.5)**2+(y-63.5)**2)**.5/64
  p[x,y]=(255,255,255,max(0,min(255,round(80*max(0,1-dist)**1.8))))
add('light',light)
add('white',Image.new('RGBA',(2,2),'white'))
# A two-column-ish shelf-packed atlas, with 2px gutter and one draw call per frame.
ATLAS_WIDTH=2048; margin=2
sheet=Image.new('RGBA',(ATLAS_WIDTH,4096),(0,0,0,0)); atlas={}
x=y=shelf=margin
# Arrange large assets first to reduce fragmentation.
for n,img in sorted(assets.items(),key=lambda kv: kv[1].height,reverse=True):
 w,h=img.size
 if w+margin*2>ATLAS_WIDTH:raise ValueError(n)
 if x+w+margin>ATLAS_WIDTH:x=margin;y+=shelf+margin;shelf=0
 if y+h+margin>4096:raise ValueError(f'Atlas overflow: {n}, row {y+h}')
 sheet.alpha_composite(img,(x,y));atlas[n]={'x':x,'y':y,'w':w,'h':h}
 x+=w+margin;shelf=max(shelf,h)
height=y+shelf+margin
# Force power-of-two height for widest hardware compatibility.
hpow=2**math.ceil(math.log2(height));sheet=sheet.crop((0,0,ATLAS_WIDTH,hpow))
out=ART/'gpu-atlas.webp';sheet.save(out,'WEBP',lossless=True,method=5)
meta=json.dumps({'width':ATLAS_WIDTH,'height':hpow,'frames':atlas},ensure_ascii=False,separators=(',',':'))
(ART/'gpu-atlas.json').write_text(meta,encoding='utf8')
(ART/'gpu-atlas.js').write_text('window.PIXEL_GPU_ATLAS='+meta+';',encoding='utf8')
# Thumbnail characters for menu/world cards; animated sprite strips for CSS compositor.
for character,animation,length,size in [('robot','idle',6,(110,126)),('fox','wag',4,(136,112))]:
 cells=Image.new('RGBA',(size[0]*length,size[1]))
 for i in range(length):
  src=assets[f'{character}_{animation}_{i}']
  scale=min((size[0]-9)/src.width,(size[1]-7)/src.height)
  im=src.resize((max(1,int(src.width*scale)),max(1,int(src.height*scale))),Image.Resampling.NEAREST)
  px=i*size[0]+(size[0]-im.width)//2
  py=size[1]-im.height-2
  cells.alpha_composite(im,(px,py))
 cells.save(ART/f'{character}-idle-strip.png',optimize=True)
 cells.crop((0,0,*size)).save(ART/f'{character}-portrait.png',optimize=True)
print('Atlas',out.stat().st_size,'bytes,',sheet.size,'images',len(atlas),'height used',height)
