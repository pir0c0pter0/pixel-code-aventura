const fs=require('fs');const vm=require('vm');const assert=require('node:assert/strict');
function fake(){return {style:{},classList:{add(){},remove(){},toggle(){}},getContext(){return {imageSmoothingEnabled:false}},addEventListener(){},appendChild(){},replaceChildren(){},setAttribute(){},scrollIntoView(){},focus(){},innerHTML:'',textContent:'',getBoundingClientRect(){return {width:800,height:500}}}}
const elems=new Map();const storage=new Map([['pc-music','off']]);const Audio=function(){this.pause=()=>{};this.play=()=>Promise.resolve()};const Image=function(){this.complete=false;this.naturalWidth=0};
const window={addEventListener(){},scrollTo(){}};const document={getElementById(k){if(!elems.has(k))elems.set(k,fake());return elems.get(k)},createElement(){return fake()},hidden:false};
const c={window,document,localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},Image,Audio,requestAnimationFrame(){},setTimeout(){},assert,console,Math,Array,Set,JSON,Number,Promise};vm.createContext(c);
const code=fs.readFileSync(require('path').join(__dirname,'..','game.js'),'utf8');
vm.runInContext(code+`
 // Screen directions must move one tile regardless of the previous heading.
 currentLevel=3;
 for(const [kind,fromX,fromY,x,y] of [['move_up',5,4,5,3],['move_down',5,3,5,4],['move_left',5,4,4,4],['move_right',4,4,5,4]]){
  for(const dir of ['N','E','S','W']){
   resetState();Object.assign(currentState,{x:fromX,y:fromY,dir});
   const actions=[...executeTree([{kind}],{calls:0})];
   assert.equal(actions.length,1,'Directional commands must execute');
   assert.equal(handleAction(actions[0]),true);
   assert.equal(currentState.x,x);assert.equal(currentState.y,y);
   assert.equal(currentState.moves,1);
  }
 }
 currentLevel=0;resetState();
 assert.equal(handleAction({kind:'move_up'}),false,'Cannot walk off the path');
 assert.equal(currentState.x,2);assert.equal(currentState.y,3);
 currentLevel=10;resetState();currentState.x=6;
 assert.equal(handleAction({kind:'move_right'}),false,'Closed gates block directional movement');
 assert.equal(currentState.x,6);
 currentState.activated=true;
 assert.equal(handleAction({kind:'move_right'}),true);
 assert.equal(currentState.x,7);assert.equal(currentState.crystals.has('7,3'),false);
 // Previously saved programs keep their relative movement semantics.
 currentLevel=1;resetState();
 for(const kind of ['move','move','right','move','move'])handleAction({kind});
 assert.equal(currentState.finished,true,'Legacy programs must still win');
 let results=[];
 for(let li=0;li<20;li++){
  currentLevel=li;resetState();let ast=sampleSolution();let flat=countNodes(ast);let tr=executeTree(ast,{calls:0});let ticks=0,err=null;
  while(ticks++<450){let z;try{z=tr.next()}catch(e){err=e.message;break}if(z.done)break;const r=handleAction(z.value);if(r===false){err='COLLISION: '+currentState.x+','+currentState.y+', dir='+currentState.dir;break}if(r==='won')break}
  results.push({fase:li+1,nome:LEVELS[li].name,valid:!LEVELS[li].path.some(([x,y])=>x<1||y<1||x>10||y>6),win:currentState.finished,steps:ticks,blocks:flat,goal:LEVELS[li].goal,error:err});
 }
 console.log(JSON.stringify(results,null,2)); if(results.some(r=>!r.valid||!r.win||r.error))throw Error('Erro no currículo'); console.log('✅ 20 fases: rotas verificadas e solução vencedora.');
`,c,{timeout:2000});
