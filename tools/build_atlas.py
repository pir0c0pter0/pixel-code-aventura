#!/usr/bin/env python3
"""Rebuild the local WebGL atlas from the four original commissioned pixel-art sources.
No asset downloaded at runtime. The transparent sprite strips are exported for the UI.
"""
from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
import json,math
BASE=Path(__file__).resolve().parents[1]; ART=BASE/'assets'/'art';SRC=ART/'source'
SRC.mkdir(exist_ok=True)
robot=Image.open(SRC/'robot-sheet.png').convert('RGBA')
fox=Image.open(SRC/'fox-sheet.png').convert('RGBA')
tiles=Image.open(SRC/'forest-kit.png').convert('RGBA')
back=Image.open(SRC/'enchanted-valley.png').convert('RGBA')
assets={}
# Non-rectangular boundaries separate artwork that overlaps neighboring rows.
outlines={
 'robot_run_3':[(630,390),(775,390),(775,555),(676,555),(676,550),(662,550),(662,555),(630,555)],
 'robot_jump_2':[(555,554),(650,554),(650,548),(685,548),(685,554),(730,554),(730,725),(555,725)],
 'robot_interact_2':[(575,748),(760,748),(760,900),(700,900),(700,912),(575,912)],
 'robot_celebrate_0':[(236,913),(410,913),(410,1080),(230,1080),(230,1011),(236,1011)],
 'robot_celebrate_2':[(598,909),(700,909),(700,904),(790,904),(790,1080),(598,1080)],
 'tree0':[(7,382),(50,382),(50,365),(318,365),(337,400),(337,452),(301,452),(301,739),(7,739)],
 'tree1':[(454,401),(489,401),(489,370),(620,370),(660,410),(660,527),(544,553),(544,688),(478,688),(478,518),(437,497),(437,436),(454,436)],
 'tree2':[(341,380),(452,380),(452,440),(416,440),(416,470),(378,470),(378,439),(341,439)],
 'bush0':[(402,596),(484,596),(484,660),(470,677),(390,677),(390,622),(402,622)],
 'bush1':[(397,677),(470,677),(470,695),(496,695),(496,752),(397,752)],
 'crystal0':[(731,670),(788,670),(788,698),(803,698),(803,753),(699,753),(699,695),(731,695)],
 'crystal1':[(866,690),(947,690),(947,748),(974,748),(974,815),(851,815),(851,752),(866,752)],
 'portal_new':[(1040,445),(1090,445),(1090,416),(1211,416),(1211,451),(1267,451),(1267,604),(1321,641),(1321,714),(982,714),(982,610),(1039,580)],
 'ruin0':[(795,419),(901,419),(901,675),(790,675),(790,640),(799,640),(799,500),(790,500)],
 'ruin1':[(922,443),(1014,443),(1014,625),(950,625),(950,520),(922,520)],
 'bridge':[(1041,265),(1204,265),(1204,404),(1115,404),(1115,442),(1041,442)],
 'fence':[(1073,780),(1110,780),(1110,771),(1140,771),(1140,787),(1209,787),(1209,777),(1234,777),(1234,835),(1073,835)],
 'lamp':[(1208,365),(1297,365),(1297,458),(1254,458),(1254,434),(1208,434)],
}
# Neighboring fragments inside a bounding box cannot be removed by trimming alpha.
exclusions={
 'tree1':[(619,370,656,410),(437,485,465,512),(640,521,660,532),(489,370,505,382),(655,438,660,476),(577,370,597,375),(478,536,481,550),(437,436,445,441),(568,544,582,548),(511,370,516,371)],
 'portal_new':[(982,598,1015,625),(1090,416,1111,439),(982,695,1012,714),(1311,706,1321,714),(1210,416,1212,428),(1259,451,1268,454)],
 'ruin0':[(897,536,901,613),(893,419,901,436)],
 'ruin1':[(1004,443,1014,444)],
 'bridge':[(1051,265,1072,270)],
 'sign':[(1225,892,1228,907),(1301,956,1304,972)],
 'crystal0':[(731,670,740,680)],
 'crystal1':[(961,748,974,762),(866,715,869,737),(851,770,853,784)],
 'rocks':[(1208,777,1227,782)],
}
def add(n,img):
 img=img.convert('RGBA')
 if img.width<1 or img.height<1: raise ValueError(n)
 assets[n]=img

def piece(name,img,region,trim=False):
 sub=img.crop(region)
 for x0,y0,x1,y1 in exclusions.get(name,[]):
  ImageDraw.Draw(sub).rectangle((x0-region[0],y0-region[1],x1-region[0]-1,y1-region[1]-1),fill=(0,0,0,0))
 if name in outlines:
  mask=Image.new('L',sub.size)
  ImageDraw.Draw(mask).polygon([(x-region[0],y-region[1]) for x,y in outlines[name]],fill=255)
  sub.putalpha(ImageChops.multiply(sub.getchannel('A'),mask))
 if trim:
  a=sub.getchannel('A').point(lambda z:255 if z>14 else 0)
  b=a.getbbox()
  if b:sub=sub.crop(b)
 add(name,sub)
 return sub

# The source sheets are not uniform grids; each frame needs its own bounds.
robot_rows={
 'idle':[(190,12,352,205),(352,12,512,205),(512,12,680,205),(680,12,845,205),(845,12,1020,205),(1020,12,1180,205)],
 'walk':[(190,206,332,385),(332,206,476,385),(476,206,624,385),(624,206,768,385),(768,206,913,385),(913,206,1061,385),(1061,206,1208,385),(1208,206,1345,385)],
 'run':[(190,390,340,553),(340,390,480,553),(480,390,630,555),(630,390,775,555),(775,390,922,555),(922,390,1080,555),(1080,390,1230,555),(1230,390,1375,555)],
 'jump':[(205,580,345,747),(375,550,530,725),(555,548,730,725),(740,560,905,725),(930,590,1080,747),(1110,590,1250,747)],
 'interact':[(215,748,355,912),(380,748,558,912),(575,748,760,912),(770,748,950,912),(960,748,1138,912),(1155,748,1290,912)],
 'celebrate':[(230,913,410,1080),(425,915,598,1080),(598,904,790,1080),(790,913,985,1080),(985,909,1165,1080),(1185,910,1355,1080)],
}
fox_rows={
 'idle':[(211,9,418,171),(445,9,655,171),(699,9,907,171),(939,9,1155,171)],
 'walk':[(220,172,460,325),(480,172,725,325),(750,172,990,325),(1000,172,1230,325)],
 'run':[(210,328,500,465),(500,328,775,468),(780,328,1045,470),(1050,328,1320,470)],
 'sit':[(235,465,410,618),(495,468,685,618),(750,470,942,618),(1005,470,1185,617)],
 'jump':[(230,635,480,768),(487,618,765,758),(795,616,1070,750),(1100,645,1365,768)],
 'wag':[(214,768,448,908),(475,768,711,908),(750,768,969,908),(1000,768,1225,908)],
 'happy':[(250,915,480,1080),(515,918,735,1080),(800,909,1035,1080),(1055,910,1280,1080)],
}
for character,source,rows in [('robot',robot,robot_rows),('fox',fox,fox_rows)]:
 for action,regions in rows.items():
  for j,region in enumerate(regions):
   piece(f'{character}_{action}_{j}',source,region,True)
# Scene background sized for pixel-perfect 768x576 canvas and UV atlas.
back=back.resize((1152,648),Image.Resampling.LANCZOS)
add('valley',back)
# Atmospheric/terrain atlas pieces selected from the generated environment art.
regions={
 'path0':(682,12,795,113),'path1':(800,12,913,113),'path2':(690,114,910,233),
 'path3':(914,116,1038,232),'path4':(691,235,867,354),'path5':(872,235,979,322),
 'ground0':(16,12,144,130),'ground1':(148,12,320,168),'ground2':(16,130,145,281),
 'tree0':(7,357,337,739),'tree1':(437,370,660,560),
 'tree2':(341,380,452,470),
 'bush0':(390,596,484,677),'bush1':(397,677,496,752),
 'bush2':(1033,838,1104,887),'shroom':(674,760,779,876),
 'crystal0':(699,670,803,753),'crystal1':(851,690,974,815),
 'rocks':(1140,713,1230,782),'portal_new':(982,416,1321,714),
 'ruin0':(791,419,901,675),'ruin1':(922,443,1014,625),
 'bridge':(1041,265,1204,442), 'fence':(1073,771,1234,835),
 'waterfall':(12,743,139,961),'waterfall2':(139,745,302,985),
 'lamp':(1208,365,1297,458),'sign':(1225,838,1304,979),
 'crate':(1352,973,1431,1073),
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
