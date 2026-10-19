const fs=require('fs');const vm=require('vm');
function fake(){return {style:{},classList:{add(){},remove(){},toggle(){}},getContext(){return {imageSmoothingEnabled:false}},addEventListener(){},appendChild(){},replaceChildren(){},setAttribute(){},scrollIntoView(){},focus(){},innerHTML:'',textContent:'',getBoundingClientRect(){return {width:800,height:500}}}}
const elems=new Map();const storage=new Map([['pc-music','off']]);const Audio=function(){this.pause=()=>{};this.play=()=>Promise.resolve()};const Image=function(){this.complete=false;this.naturalWidth=0};
const window={addEventListener(){},scrollTo(){}};const document={getElementById(k){if(!elems.has(k))elems.set(k,fake());return elems.get(k)},createElement(){return fake()},hidden:false};
const c={window,document,localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},Image,Audio,requestAnimationFrame(){},setTimeout(){},console,Math,Array,Set,JSON,Number,Promise};vm.createContext(c);
const code=fs.readFileSync(require('path').join(__dirname,'..','game.js'),'utf8');
vm.runInContext(code+`
 let results=[];
 for(let li=0;li<20;li++){
  currentLevel=li;resetState();let ast=sampleSolution();let flat=countNodes(ast);let tr=executeTree(ast,{calls:0});let ticks=0,err=null;
  while(ticks++<450){let z;try{z=tr.next()}catch(e){err=e.message;break}if(z.done)break;const r=handleAction(z.value);if(r===false){err='COLLISION: '+currentState.x+','+currentState.y+', dir='+currentState.dir;break}if(r==='won')break}
  results.push({fase:li+1,nome:LEVELS[li].name,valid:!LEVELS[li].path.some(([x,y])=>x<1||y<1||x>10||y>6),win:currentState.finished,steps:ticks,blocks:flat,goal:LEVELS[li].goal,error:err});
 }
 console.log(JSON.stringify(results,null,2)); if(results.some(r=>!r.valid||!r.win||r.error))throw Error('Erro no currículo'); console.log('✅ 20 fases: rotas verificadas e solução vencedora.');
`,c,{timeout:2000});
