/* Pixel Code v2 — purpose-built WebGL2 GPU compositor.
   A single lossless atlas, one dynamically batched draw call per frame, no external runtime.
   Coordinates stay in a stable 768x576 virtual resolution for responsive CSS scaling.
*/
(() => {
 'use strict';
 const VW = 768, VH = 576, PI2 = Math.PI * 2;
 const vs = `#version 300 es
 in vec2 a_pos;
 in vec2 a_uv;
 in vec4 a_tint;
 uniform vec2 u_resolution;
 out vec2 v_uv;
 out vec4 v_tint;
 void main() {
  vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
  v_tint = a_tint;
 }`;
 const fs = `#version 300 es
 precision mediump float;
 uniform sampler2D u_texture;
 in vec2 v_uv;
 in vec4 v_tint;
 out vec4 color;
 void main() {
  vec4 pixel = texture(u_texture, v_uv);
  color = vec4(pixel.rgb * v_tint.rgb, pixel.a * v_tint.a);
 }`;
 function createShader(gl, type, code) {
  const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
  return s;
 }
 function makeProgram(gl){
  const p=gl.createProgram();gl.attachShader(p,createShader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,createShader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;
 }
 const D={x:96,y:95,size:48,w:12,h:8};
 const tones=[
  {soil:[.49,.78,.59,1],path:[1.06,1.03,.91,1],sky:[1,1,1,1],edge:[.12,.265,.22,1]},
  {soil:[.88,.68,.40,1],path:[1.18,.94,.65,1],sky:[1.09,.92,.73,1],edge:[.34,.22,.12,1]},
  {soil:[.55,.53,.91,1],path:[.92,.87,1.17,1],sky:[.79,.84,1.09,1],edge:[.21,.18,.35,1]},
  {soil:[.40,.60,.92,1],path:[.89,.98,1.18,1],sky:[.65,.80,1.10,1],edge:[.13,.17,.30,1]},
 ];
 const palette=[
  [1,1,1,1], [.3,1,.95,1], [1,.78,.53,1],[.77,.68,1,1],[.65,.88,1,1]
 ];
 class PixelGPU {
  constructor(canvas,gl) {
   this.canvas=canvas;this.gl=gl;this.ready=false;this.offline=false;this.frames={};this.frame=0;
   this.vertex=[];this.tex=null;this.lastTime=0;this.level=-1;this.anim='idle';this.animEnd=0;
   this.px=null;this.py=null;this.fx=null;this.fy=null;this.lastDir='E';this.facing='E';this.lastActivated=false;this.lastFinished=false;
   this.particles=Array.from({length:33},(_,i)=>({x:(i*97+47)%768,y:(i*41+65)%576,shift:(i*73)%100,scale:3+i%5}));
   gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
   gl.clearColor(.025,.063,.09,1);
   this.program=makeProgram(gl);gl.useProgram(this.program);
   const vao=gl.createVertexArray();gl.bindVertexArray(vao);
   this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,150000,gl.DYNAMIC_DRAW);
   const stride=32;
   for(const [name,count,offset] of [['a_pos',2,0],['a_uv',2,8],['a_tint',4,16]]){
    const loc=gl.getAttribLocation(this.program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,count,gl.FLOAT,false,stride,offset);
   }
   gl.uniform2f(gl.getUniformLocation(this.program,'u_resolution'),VW,VH);
   gl.uniform1i(gl.getUniformLocation(this.program,'u_texture'),0);
   this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   this.vao=vao;
   this.load().catch(e=>{this.offline=true;console.error('Falha no atlas WebGL:',e);});
  }
  async load(){
   const [res,img]=await Promise.all([
    window.PIXEL_GPU_ATLAS ? Promise.resolve(window.PIXEL_GPU_ATLAS) : fetch('assets/art/gpu-atlas.json').then(r=>{if(!r.ok)throw Error('Atlas JSON '+r.status);return r.json()}),
    new Promise((resolve,reject)=>{let a=new Image();if(location.protocol!=='file:')a.crossOrigin='anonymous';a.onload=()=>resolve(a);a.onerror=reject;a.src='assets/art/gpu-atlas.webp';})
   ]);
   this.frames=res.frames;this.aw=res.width;this.ah=res.height;
   const gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,this.texture);
   gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
   this.ready=true;
  }
  quad(name,x,y,w,h,c=[1,1,1,1],flip=false){
   const v=this.frames[name];if(!v||w<=0||h<=0)return;
   const inset=0.12;
   const u0=(v.x+inset)/this.aw,u1=(v.x+v.w-inset)/this.aw;
   const t0=(v.y+inset)/this.ah,t1=(v.y+v.h-inset)/this.ah;
   const l=flip?u1:u0,r=flip?u0:u1;
   const coords=[x,y,l,t0,x+w,y,r,t0,x,y+h,l,t1,x,y+h,l,t1,x+w,y,r,t0,x+w,y+h,r,t1];
   const a=this.vertex;for(let k=0;k<24;k+=4)a.push(coords[k],coords[k+1],coords[k+2],coords[k+3],...c);
  }
  box(x,y,w,h,c){this.quad('white',x,y,w,h,c)}
  glow(x,y,w,h,alpha=.7,tint=[.35,1,1]){this.quad('light',x-w/2,y-h/2,w,h,[...tint,alpha])}
  frameAsset(prefix,animation,time,count,speed=140){return `${prefix}_${animation}_${Math.floor(time/speed)%count}`}
  terrain(l,world,time){
   const tone=tones[world];const color=palette[world+1];
   const x0=D.x,y0=D.y,S=D.size;
   // Modal-like gameboard always legible in front of the richly illustrated valley.
   this.box(83,84,602,405,[.045,.10,.15,.67]);
   this.box(87,87,594,398,[.68,.84,.79,.46]);
   this.box(91,90,586,392,[.05,.14,.13,.95]);
   for(let y=0;y<D.h;y++)for(let x=0;x<D.w;x++){
    const X=x0+x*S,Y=y0+y*S,walk=l.walkable.has(`${x},${y}`);
    if(walk){
     this.box(X,Y,S,S,[.55,.70,.48,1]);
     this.quad('path'+((x*13+y*17)%6),X+1,Y+1,S-2,S-2,tone.path);
     this.box(X+1,Y+1,46,2,[.93,1,.74,.34]);
     this.box(X+1,Y+1,2,46,[.93,1,.74,.29]);
     this.box(X+2,Y+44,44,3,[.09,.25,.23,.22]);
    }else{
     this.box(X,Y,S,S,tone.edge);
     this.quad('ground'+(x+y*3)%3,X+1,Y+1,S-2,S-2,[...tone.soil.slice(0,3),.48]);
     const v=(x*53+y*97+11)%23;
     if(v===5||v===10||v===17)this.quad('bush'+v%3,X+5,Y+15,39,30,[.9,.95,.89,.76]);
     if(v===8)this.quad('rocks',X+13,Y+22,29,24,[.79,.85,.9,.85]);
     if(v===3&&x>1&&y>1)this.quad('shroom',X+8,Y+17,30,30,[1,1,1,.79]);
    }
    // very subtle dividers so the child can count steps.
    this.box(X,Y,S,1,[.05,.10,.11,.13]);this.box(X,Y,1,S,[.05,.10,.11,.13]);
   }
   // Path marker signals the first command.
   const [sx,sy]=l.start;
   this.box(x0+sx*S+5,y0+sy*S+42,38,4,[.19,1,.64,.78]);
  }
  initializeMotion(state,l,idx){
   this.level=idx;this.px=state.x;this.py=state.y;this.fx=state.x-.72;this.fy=state.y+.12;
   this.lastX=state.x;this.lastY=state.y;this.lastDir=state.dir;
   this.anim='idle';this.animEnd=0;this.lastActivated=state.activated;this.lastFinished=state.finished;
  }
  actors(state,l,idx,time,dt){
   if(this.level!==idx||this.px===null)this.initializeMotion(state,l,idx);
   if(this.lastX!==state.x||this.lastY!==state.y){
    this.anim='walk';this.animEnd=time+370;this.lastX=state.x;this.lastY=state.y;
   }
   if(this.lastDir!==state.dir){this.anim='idle';this.animEnd=time+180;this.lastDir=state.dir;}
   if(this.lastActivated!==state.activated){this.anim='interact';this.animEnd=time+700;this.lastActivated=state.activated;}
   if(this.lastFinished!==state.finished){this.anim='celebrate';this.animEnd=Infinity;this.lastFinished=state.finished;}
   // Frame-rate independent smoothing: turns are immediate, travel interpolates.
   const chase=1-Math.exp(-dt/148),buddy=1-Math.exp(-dt/370);
   this.px+=(state.x-this.px)*chase;this.py+=(state.y-this.py)*chase;
   this.fx+=(this.px-.74-this.fx)*buddy;this.fy+=(this.py+.08-this.fy)*buddy;
   const foxMoving=Math.abs(this.fx-(this.px-.74))+.6*Math.abs(this.fy-this.py-.08)>.08;
   let fa=state.finished?'happy':foxMoving?'walk':'wag';
   let fx=D.x+this.fx*D.size+4,fy=D.y+this.fy*D.size+4;
   const moon=Math.sin(time/480);
   this.box(fx+12,fy+42,24,3,[.025,.06,.08,.30]);
   this.quad(this.frameAsset('fox',fa,time,4,fa==='walk'?125:230),fx-5,fy+1+(state.finished?moon*2:0),54,48,[1,1,1,1],state.dir==='W');
   const bob=state.finished?-Math.abs(Math.sin(time/150))*7: Math.abs(this.px-state.x)+Math.abs(this.py-state.y)>.045? -Math.abs(Math.sin(time/100))*4: Math.sin(time/340)*1.2;
   const rx=D.x+this.px*D.size-7,ry=D.y+this.py*D.size-17;
   this.box(rx+15,ry+56,29,4,[.025,.06,.08,.32]);
   const active=state.finished?'celebrate':(time<this.animEnd?this.anim:'idle');
   const frames=active==='walk'?8:6;
   this.quad(this.frameAsset('robot',active,time,frames,active==='walk'?90:active==='celebrate'?165:180),rx,ry+bob,63,71,[1,1,1,1],state.dir==='W');
  }
  effects(time,l,state,world){
   for(const [name,loc] of [['switch',l.switchTile],['gate',l.gateTile]]){
    if(!loc)continue;
    const X=D.x+loc[0]*D.size, Y=D.y+loc[1]*D.size;
    if(name==='switch'){
     this.glow(X+24,Y+24,72,61,.56,state.activated?[.36,1,.61]:[1,.75,.16]);
     this.box(X+6,Y+33,36,12,[.36,.24,.16,1]);this.box(X+10,Y+29,28,12,state.activated?[.28,.94,.51,1]:[1,.74,.26,1]);
     this.quad('crystal0',X+17,Y+3,19,30,state.activated?[.38,1,.65,.82]:[1,.81,.37,.82]);
    }
    if(name==='gate'){
     if(!state.activated){this.box(X+4,Y+7,40,39,[.12,.12,.17,.83]);this.quad('ruin1',X+8,Y-7,35,60,[.72,.69,.87,1]);}
     else {this.glow(X+24,Y+28,62,53,.30,[.19,1,.66]);this.box(X+6,Y+44,36,3,[.14,.95,.53,.75]);}
    }
   }
   // The portal is a larger animated sprite, reaching above its target tile.
   const [gx,gy]=l.goal;const X=D.x+gx*D.size,Y=D.y+gy*D.size;
   this.glow(X+22,Y+19,110,116,.61+Math.sin(time/220)*.1,[.24,.94,1]);
   this.quad('portal_new',X-9,Y-25+Math.sin(time/560)*1.1,68,80,[1,1,1,1]);
   for(const key of state.crystals){const [x,y]=key.split(',').map(Number),cx=D.x+x*D.size+24,cy=D.y+y*D.size+25;
    this.glow(cx,cy,70,76,.52,[.18,1,1]);
    this.quad('crystal0',cx-16,cy-21+Math.sin(time/400+x)*2,32,43,[.92,1,1,1]);
   }
  }
  decorations(time,world){
   // Plants/falls frame the composition without covering mission cells.
   this.quad('tree0',-15,267,132,215,[1,1,1,.90]);
   this.quad('tree1',655,255,106,192,[1,1,1,.86]);
   this.quad('waterfall',14,442+Math.sin(time/900)*2,65,118,[1,1,1,.84]);
   this.quad('fence',615,482,161,33,[1,1,1,.82]);
   this.quad('shroom',573,487,117,63,[1,.98,.89,.85]);
   this.quad('lamp',688,115,61,109,[1,1,1,.90]);
   this.glow(725,182,84,90,.76,[1,.63,.24]);
   // GPU-drawn firefly particles: deterministic, smooth, batched into one draw.
   for(const p of this.particles){
    const px=(p.x+Math.sin(time*.0005+p.shift)*13+VW)%VW;
    const py=(p.y+Math.cos(time*.00071+p.shift)*16+VH)%VH;
    const pul=.25+.35*(.5+.5*Math.sin(time*.002+p.shift));
    this.glow(px,py,22+p.scale,22+p.scale,pul,world===2?[.56,.61,1]:[1,.76,.26]);
    if(p.shift%3===0)this.box(px,py,2.5,2.5,[1,.95,.64,pul+.15]);
   }
  }
  draw(time,{level,state,levelIndex}){
   const gl=this.gl;if(!this.ready){gl.clear(gl.COLOR_BUFFER_BIT);return;}
   if(!state)return;
   const dt=Math.max(2,Math.min(60,time-(this.lastTime||time-16)));this.lastTime=time;
   this.vertex.length=0;
   const world=level.world,tone=tones[world];
   this.quad('valley',-103+Math.sin(time/17000)*5,-2,974,580,tone.sky);
   this.box(0,0,VW,VH,[.035,.08,.13,.18]);
   this.terrain(level,world,time);
   this.effects(time,level,state,world);
   this.actors(state,level,levelIndex,time,dt);
   this.decorations(time,world);
   // Better contrast near the lower rim of the stage.
   this.box(0,561,VW,15,[.025,.06,.10,.48]);
   const arr=new Float32Array(this.vertex);
   gl.viewport(0,0,this.canvas.width,this.canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT);
   gl.useProgram(this.program);gl.bindVertexArray(this.vao);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);
   gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
   gl.bufferData(gl.ARRAY_BUFFER,arr,gl.DYNAMIC_DRAW);
   gl.drawArrays(gl.TRIANGLES,0,arr.length/8);
   this.frame++;
  }
 }
 function create(canvas){
  if(!canvas||!canvas.getContext)return null;
  try{
   const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
   if(!gl)return null;
   const renderer=new PixelGPU(canvas,gl);
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.ready=false;});
   canvas.addEventListener('webglcontextrestored',()=>{location.reload();});
   return renderer;
  }catch(e){console.warn('WebGL2 não disponível:',e);return null;}
 }
 window.PixelRenderer={create};
})();
