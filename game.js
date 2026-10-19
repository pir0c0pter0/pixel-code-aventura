/* Pixel Code — A Aventura de Lumi. Motor original, independente do framework de blocos.
   Blockly (Apache-2.0) é carregado sob demanda por CDN. Editor alternativo é local. */
'use strict';
const $ = id => document.getElementById(id);
const W = 12, H = 8, TILE = 48, OX = 96, OY = 95;
const DIRECTIONS = ['N','E','S','W'];
const DIR_DELTA = {N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]};
const WORLDS = [
  {name:'Floresta do Começo',theme:'floresta',icon:'🌳',emoji:'🌿',color:'#3d805e',concept:'Sequências',about:'Descubra como dar instruções na ordem certa.',lesson:'SEQUÊNCIA',description:'Os blocos são executados de cima para baixo, como uma receita.'},
  {name:'Deserto dos Repetecos',theme:'deserto',icon:'🏜️',emoji:'☀️',color:'#bd854c',concept:'Repetições',about:'Aprenda a fazer mais com menos comandos.',lesson:'REPETIÇÃO',description:'Uma repetição faz os comandos dentro dela acontecerem várias vezes.'},
  {name:'Cavernas dos Cristais',theme:'cristais',icon:'💎',emoji:'🔮',color:'#7061aa',concept:'Condições',about:'Tome decisões e descubra os interruptores.',lesson:'CONDIÇÕES',description:'As condições ajudam Lumi a escolher o que fazer em cada situação.'},
  {name:'Estação das Estrelas',theme:'cosmos',icon:'🚀',emoji:'🪐',color:'#49679c',concept:'Desafios finais',about:'Misture tudo e transforme ideias em soluções!',lesson:'ALGORITMOS',description:'Combine sequências, repetições e decisões para resolver problemas.'},
];
const SEEDS = [
  {name:'O primeiro passo',route:'EEE',start:[2,3],dir:'E',gems:[2],limit:3,intro:'Ajude Lumi a chegar ao portal! Use o bloco AVANÇAR três vezes.',hint:'Arraste o bloco azul “avançar” três vezes, conectando um embaixo do outro.',toolset:'basico'},
  {name:'Uma curva no caminho',route:'EESS',start:[2,2],dir:'E',gems:[3],limit:5,intro:'O caminho fez uma curva. Para onde Lumi precisa olhar?',hint:'Avance duas casas, vire à direita para olhar para baixo e avance outras duas.',toolset:'basico'},
  {name:'Agora à esquerda',route:'EENEE',start:[2,4],dir:'E',gems:[3],limit:7,intro:'Você já sabe virar à direita. Vamos aprender a virar à esquerda!',hint:'Avance duas vezes, vire à esquerda, avance, vire à direita e avance duas vezes.',toolset:'basico'},
  {name:'Labirinto das folhas',route:'EEESSWWS',start:[2,2],dir:'E',gems:[2,6],limit:12,intro:'Planeje todas as curvas antes de apertar Executar.',hint:'Leia o mapa da esquerda para a direita; depois, desça e retorne pelo corredor de baixo.',toolset:'basico'},
  {name:'Guardiã da floresta',route:'EENNEESSE',start:[2,4],dir:'E',gems:[3,7],limit:13,intro:'Junte tudo que aprendeu em uma sequência!',hint:'Faça duas casas para leste, duas ao norte, duas a leste, duas ao sul e uma a leste.',toolset:'basico'},
  {name:'Passos repetidos',route:'EEEEE',start:[2,3],dir:'E',gems:[2,4],limit:2,intro:'Cinco passos iguais? Use uma repetição para economizar blocos.',hint:'Coloque “avançar” dentro de “repetir 5 vezes”.',toolset:'repetir'},
  {name:'O grande L',route:'EEEESSSS',start:[2,1],dir:'E',gems:[3,6],limit:5,intro:'Você pode usar dois laços: um para cada corredor.',hint:'Repita 4 avanços; vire à direita; repita mais 4 avanços.',toolset:'repetir'},
  {name:'Escadaria dourada',route:'EEEESSSE',start:[2,1],dir:'E',gems:[4,7],limit:7,intro:'A repetição funciona melhor nos trechos longos.',hint:'Repita 4 avanços, vire à direita, repita 3 avanços, vire à esquerda e avance.',toolset:'repetir'},
  {name:'Caminho zigue-zague',route:'EEESSEEES',start:[1,2],dir:'E',gems:[2,5,8],limit:10,intro:'Grupos repetidos tornam seu programa mais simples.',hint:'Repita os três avanços; vire à direita para descer e vire à esquerda para voltar a leste.',toolset:'repetir'},
  {name:'A última duna',route:'EEEESSSWWEEE',start:[2,1],dir:'E',gems:[4,9,12],limit:12,intro:'Um algoritmo eficiente resolve até os caminhos mais longos.',hint:'Use repetições para cada trecho reto. Atenção: algumas curvas mudam o sentido!',toolset:'repetir'},
  {name:'O portão adormecido',route:'EEEEEE',start:[2,3],dir:'E',gems:[2,5],switchAt:3,gateAt:5,limit:9,intro:'Uma porta bloqueia o caminho. Pare no botão dourado e use ATIVAR.',hint:'Avance três casas, ative o interruptor, depois continue até o portal.',toolset:'cond'},
  {name:'O botão esquecido',route:'EEESSSEEE',start:[1,1],dir:'E',gems:[4,8],switchAt:4,gateAt:7,limit:14,intro:'Aprenda o bloco SE ESTOU NO BOTÃO para só ativar quando necessário.',hint:'Quando pisar na placa dourada, use “se estou no botão”, com “ativar” dentro.',toolset:'cond'},
  {name:'Porta das ametistas',route:'EEEENNEEEE',start:[1,4],dir:'E',gems:[3,7],switchAt:5,gateAt:8,limit:16,intro:'O interruptor abre uma porta em outro ponto do mapa.',hint:'O botão está depois da subida. Acione-o ANTES de atravessar a porta.',toolset:'cond'},
  {name:'O código das cavernas',route:'EESSEEEENNE',start:[1,2],dir:'E',gems:[3,8],switchAt:5,gateAt:9,limit:17,intro:'Use condições, curvas e repetições para seguir em frente.',hint:'Ative a placa quando estiver sobre ela; avance até o portão e faça a curva.',toolset:'cond'},
  {name:'Coração de cristal',route:'EEEESSEEE',start:[1,1],dir:'E',gems:[2,5,8],switchAt:4,gateAt:7,limit:15,intro:'Colete todas as gemas e abra a passagem para o próximo mundo!',hint:'A porta não abre sozinha: depois de quatro avanços, ative a placa.',toolset:'cond'},
  {name:'Piloto automático',route:'EEEEE',start:[2,3],dir:'E',gems:[3],limit:2,intro:'Experimente REPETIR ATÉ O PORTAL para deixar Lumi continuar sozinho.',hint:'Coloque “avançar” dentro de “repetir até o portal”.',toolset:'final'},
  {name:'Órbita de Lumi',route:'EEESSSEEEENNEE',start:[1,1],dir:'E',gems:[3,8,12],limit:14,intro:'Uma nova jornada: use tudo que já conhece.',hint:'Transforme os trechos retos em repetições e observe o sentido das curvas.',toolset:'final'},
  {name:'O mapa das estrelas',route:'EEEESSSSEENNN',start:[2,1],dir:'E',gems:[3,7,11],switchAt:6,gateAt:10,limit:17,intro:'Sua missão é ativar um interruptor antes de subir ao portal.',hint:'O botão está no corredor que desce. Ative antes de avançar para a porta.',toolset:'final'},
  {name:'Poeira cósmica',route:'EEEESSSWWEEE',start:[2,1],dir:'E',gems:[2,6,10],limit:13,intro:'Programar é dividir um desafio grande em partes menores.',hint:'Conte os passos de cada segmento. Curvas para a esquerda também fazem parte da solução.',toolset:'final'},
  {name:'O núcleo do universo',route:'EEEEENNN EEEESSSS',start:[1,5],dir:'E',gems:[3,8,15],switchAt:7,gateAt:13,limit:19,intro:'Último desafio! Recupere o núcleo e conclua a aventura.',hint:'Combine laços e “se estou no botão” antes de atravessar a porta do núcleo.',toolset:'final'},
];
function makeLevel(seed,i){
  let path=[[...seed.start]],x=seed.start[0],y=seed.start[1];
  const seq=seed.route.replace(/\s/g,'');
  for(const letter of seq){const [dx,dy]=DIR_DELTA[letter];x+=dx;y+=dy; if(x<1||y<1||x>10||y>6)console.warn('Fase fora do mapa',i+1,letter,x,y); path.push([x,y]);}
  let walkable=new Set(path.map(([a,b])=>`${a},${b}`));
  return {...seed,route:seq,index:i,world:Math.floor(i/5),path,walkable,start:path[0],goal:path[path.length-1],gemTiles:seed.gems.map(k=>path[Math.min(k,path.length-2)]).filter(Boolean),switchTile:seed.switchAt?path[seed.switchAt]:null,gateTile:seed.gateAt?path[seed.gateAt]:null};
}
const LEVELS=SEEDS.map(makeLevel);
const THEMES=[
 {sky:'#203d4c',ground:'#326c57',floor:'#9bc57c',edge:'#517f55',wall:'#254b44',path:'#a4c98b',accent:'#d9f39d'},
 {sky:'#65504b',ground:'#ae7d52',floor:'#deb97c',edge:'#c18c52',wall:'#93654e',path:'#efcc94',accent:'#ffe2a8'},
 {sky:'#2f315d',ground:'#494778',floor:'#8586bb',edge:'#6a65a0',wall:'#373a6e',path:'#9291cc',accent:'#c5baff'},
 {sky:'#1c294d',ground:'#263967',floor:'#6483ba',edge:'#4b6493',wall:'#1f2f5d',path:'#8295c9',accent:'#91f6ff'},
];
const MUSIC = {'menu':'assets/audio/menu.ogg','floresta':'assets/audio/floresta.ogg','deserto':'assets/audio/deserto.ogg','cristais':'assets/audio/cristais.ogg','cosmos':'assets/audio/cosmos.ogg'};
const music=new Audio();music.loop=true;music.volume=.27;let musicEnabled=localStorage.getItem('pc-music')!=='off',currentSong='';
const sounds={};for(const n of ['passo','gema','sucesso','erro','clique','portal','ligar'])sounds[n]=`assets/audio/${n}.wav`;
function sfx(name){if(!musicEnabled)return;try{let a=new Audio(sounds[name]);a.volume=name==='passo'?.18:.35;a.play().catch(()=>{});}catch(e){}}
function playMusic(name){if(currentSong===name)return;currentSong=name;music.pause();music.src=MUSIC[name]||MUSIC.menu; if(musicEnabled)music.play().catch(()=>{});}
function toggleMusic(){musicEnabled=!musicEnabled;localStorage.setItem('pc-music',musicEnabled?'on':'off');$('musicBtn').textContent=musicEnabled?'♫':'♪̸';$('musicBtn').title=musicEnabled?'Desligar som':'Ligar som';if(musicEnabled){music.play().catch(()=>{});sfx('clique');}else music.pause();}
let progress;try{progress=JSON.parse(localStorage.getItem('pc-progress')||'{}')}catch(e){progress={}};
let stars=Array.from({length:20},(_,i)=>Math.min(3,Math.max(0,Number(progress[i]||0))));
let currentLevel=0,scene='home',currentState=null,runner=null,busy=false,serial=0,stepRate=1;
let blocklyWorkspace=null,blocklyFailed=false,fallbackRoot=[],fallbackTarget=null;
let blocklyEditorSetup=false;
const robot=new Image();robot.src='assets/art/robot-portrait.png';
const foxPortrait=new Image();foxPortrait.src='assets/art/fox-portrait.png';
const valleyFallback=new Image();valleyFallback.src='assets/art/cenario-vale-v2.webp';
const atlasFallback=new Image();atlasFallback.src='assets/art/gpu-atlas.webp';
const crystalImg=new Image();crystalImg.src='assets/art/gema.png';
const portalImg=new Image();portalImg.src='assets/art/portal.png';
const signImg=new Image();signImg.src='assets/art/chave.png';
const treeImgs=[];for(const name of ['arvore','cacto','rocha','antena']){let image=new Image();image.src=`assets/art/${name}.png`;treeImgs.push(image)}
const canvas=$('gameCanvas'),gpu=window.PixelRenderer?.create(canvas)||null;
const ctx=gpu?null:canvas.getContext('2d');if(ctx)ctx.imageSmoothingEnabled=false;
$('renderBadge').textContent=gpu?'✦ WEBGL2 • GPU':'◧ CANVAS 2D';
function highestUnlocked(){let i=0;while(i<19&&stars[i]>0)i++;return i}
function updateProgress(){$('progressLabel').textContent=`✦ ${stars.filter(Boolean).length}/20 fases`;$('playBtnText').textContent=stars.some(Boolean)?'CONTINUAR AVENTURA':'COMEÇAR AVENTURA';}
function showView(name){scene=name;for(const id of ['home','world','game'])$(id+'View').classList.toggle('hidden',id!==name);window.scrollTo({top:0,behavior:'instant'});if(name==='home')playMusic('menu');if(name==='world'){drawWorlds();playMusic('menu');}if(name==='game')setTimeout(resizeBlockly,100);updateProgress();}
function drawWorlds(){const grid=$('worldGrid');grid.replaceChildren();WORLDS.forEach((w,wi)=>{
 const start=wi*5, done=stars.slice(start,start+5).filter(Boolean).length, open=wi===0||stars[start-1]>0;
 const card=document.createElement('button');card.className='world-card';card.innerHTML=`<div class="world-cover world-cover-${wi}" style="--world-color:${w.color}"><span class="world-index">MUNDO 0${wi+1}</span><span class="world-icon">${w.icon}</span><img class="world-portrait" src="assets/art/${wi%2?'fox':'robot'}-portrait.png" alt="" /></div><div class="world-content"><span class="eyebrow">${w.concept.toUpperCase()}</span><h3>${w.name}</h3><p>${w.about}</p><div class="world-info"><span>✦ ${done}/5 fases concluídas</span><span>${open?'EXPLORAR →':'🔒 BLOQUEADO'}</span></div></div>`;
 card.addEventListener('click',()=>{if(!open){showModal('🔒 Mundo bloqueado','Termine as cinco fases do mundo anterior para continuar sua aventura.','CONTINUE SUA JORNADA',[{label:'ENTENDI',action:closeModal}]);return}let go=start;while(go<start+4&&stars[go]>0)go++;loadLevel(go)});
 grid.appendChild(card);
 });}
function updateDirection(){const e={N:'▲ NORTE',E:'▶ LESTE',S:'▼ SUL',W:'◀ OESTE'};$('directionLabel').textContent=e[currentState?.dir]||'▶ LESTE';}
function resetState(){let level=LEVELS[currentLevel];currentState={x:level.start[0],y:level.start[1],dir:level.dir,crystals:new Set(level.gemTiles.map(a=>a.join(','))),activated:false,finished:false,steps:0,moves:0,lastMoveAt:0,lastActivateAt:0}; if(level.gateTile){} setStatus('Monte seu programa e aperte Executar!');updateGems();updateDirection();}
function currentLevelKey(){return`pc-code-${currentLevel}`}
function saveWorkspace(){try{if(blocklyWorkspace&&window.Blockly){localStorage.setItem(currentLevelKey(),JSON.stringify({engine:'blockly',data:Blockly.serialization.workspaces.save(blocklyWorkspace)}));}else if(blocklyFailed){localStorage.setItem(currentLevelKey(),JSON.stringify({engine:'fallback',data:fallbackRoot}));}}catch(e){}}
function loadCode(){let saved;try{saved=JSON.parse(localStorage.getItem(currentLevelKey()))}catch(e){saved=null}
 if(blocklyWorkspace){Blockly.Events.disable();try{blocklyWorkspace.clear();if(saved?.engine==='blockly'){try{Blockly.serialization.workspaces.load(saved.data,blocklyWorkspace)}catch(e){console.warn('Salvamento inválido',e)}}}finally{Blockly.Events.enable()}
 }else if(blocklyFailed){fallbackRoot=saved?.engine==='fallback'&&Array.isArray(saved.data)?saved.data:[];fallbackTarget=fallbackRoot;renderFallback()}
 updateBlockCount();}
function loadLevel(index){if(index<0||index>=20)return;if(index>highestUnlocked()){showModal('🔒 Fase bloqueada','Conclua os desafios anteriores para desbloquear esta fase.','SUA JORNADA',[{label:'OK',action:closeModal}]);return}
 serial++;busy=false;currentLevel=index;runner=null;const l=LEVELS[index],w=WORLDS[l.world];$('levelWorld').textContent=`MUNDO ${l.world+1} • ${w.name.toUpperCase()}`;$('levelTitle').textContent=`${String(index+1).padStart(2,'0')} — ${l.name}`;$('headStars').textContent='★'.repeat(stars[index])+'☆'.repeat(3-stars[index]);$('lessonName').textContent=w.lesson;$('lessonText').textContent=l.intro;$('prevBtn').disabled=index<=0;$('nextBtn').disabled=index>=19||index>=highestUnlocked();$('prevBtn').style.opacity=index===0?'.4':'1';$('nextBtn').style.opacity=index>=highestUnlocked()?'.4':'1';$('navDots').innerHTML='';for(let i=0;i<5;i++){const dot=document.createElement('button');const idx=l.world*5+i;dot.className=`${currentLevel===idx?'active':''} ${stars[idx]?'done':''}`;dot.title=`Fase ${idx+1}`;dot.onclick=()=>loadLevel(idx);$('navDots').appendChild(dot)}
 $('firstLevelTutorial').classList.toggle('hidden',index!==0);$('firstLevelTutorial').open=stars[index]===0;
 resetState();showView('game');if(blocklyEditorSetup){if(blocklyWorkspace)refreshBlocklyToolbox();loadCode();}else if(blocklyFailed)loadCode();playMusic(w.theme);updateBlockCount();}
function updateGems(){let l=LEVELS[currentLevel];$('gemsCounter').textContent=`◆ ${l.gemTiles.length-(currentState?.crystals.size||0)} / ${l.gemTiles.length}`;}
function setStatus(message){$('gameStatus').textContent=message;}
function isAheadPassable(){const s=currentState,l=LEVELS[currentLevel],d=DIR_DELTA[s.dir],tx=s.x+d[0],ty=s.y+d[1];if(tx<0||ty<0||tx>=W||ty>=H)return false;if(!l.walkable.has(`${tx},${ty}`))return false;if(l.gateTile&&!s.activated&&tx===l.gateTile[0]&&ty===l.gateTile[1])return false;return true;}
function isOnSwitch(){const l=LEVELS[currentLevel],s=currentState;return!!l.switchTile&&l.switchTile[0]===s.x&&l.switchTile[1]===s.y}
function atGoal(){const l=LEVELS[currentLevel],s=currentState;return s.x===l.goal[0]&&s.y===l.goal[1]&&s.crystals.size===0}
function handleAction(action){const s=currentState;if(action.kind==='move'){
 if(!isAheadPassable()) {sfx('erro');setStatus('💥 Lumi bateu em um obstáculo. Reveja a ordem dos comandos!');return false;}
 const [dx,dy]=DIR_DELTA[s.dir];s.x+=dx;s.y+=dy;s.moves++;s.lastMoveAt=Date.now();sfx('passo');const key=`${s.x},${s.y}`;
 if(s.crystals.has(key)){s.crystals.delete(key);sfx('gema');setStatus('◆ Cristal coletado! Continue!');updateGems()}else setStatus(`✓ Passo ${++s.steps}: Lumi avançou uma casa.`);
 }else if(action.kind==='left'||action.kind==='right'){
 s.dir=DIRECTIONS[(DIRECTIONS.indexOf(s.dir)+(action.kind==='right'?1:3))%4];s.steps++;updateDirection();setStatus(`↪ Lumi virou para ${ {N:'cima',E:'direita',S:'baixo',W:'esquerda'}[s.dir]}.`);sfx('passo');
 }else if(action.kind==='activate'){
 s.steps++;s.lastActivateAt=Date.now();if(isOnSwitch()){s.activated=true;sfx('ligar');setStatus('⚡ Interruptor ligado! A passagem se abriu.')}else {setStatus('⚠️ Lumi só pode ativar o botão quando estiver sobre ele.');sfx('erro')}
 }if(atGoal()){finishLevel();return 'won'}
 return true;}
function finishLevel(){if(currentState.finished)return;currentState.finished=true;serial++;sfx('sucesso');const l=LEVELS[currentLevel];const programCount=countBlocks();let scored=(programCount<=l.limit?3:programCount<=l.limit+3?2:1);let extra='';if(stars[currentLevel]<scored){stars[currentLevel]=scored;progress[currentLevel]=scored;localStorage.setItem('pc-progress',JSON.stringify(progress));extra='Novo recorde!'}else extra='Mais uma bela solução!';
 updateProgress();$('headStars').textContent='★'.repeat(scored)+'☆'.repeat(3-scored);setStatus('🎉 Missão cumprida! Lumi chegou ao portal.');const finishedState=currentState;setTimeout(()=>{if(scene!=='game'||currentState!==finishedState)return;showModal('Missão cumprida!','Lumi coletou os cristais e chegou ao portal. '+extra+'\n'+programCount+' blocos utilizados — '+l.limit+' blocos para conseguir 3 estrelas.','FASE CONCLUÍDA',[
 {label:'↺ JOGAR DE NOVO',action:()=>{closeModal();loadLevel(currentLevel)}},...(currentLevel<19?[{label:'PRÓXIMA FASE →',primary:true,action:()=>{closeModal();loadLevel(currentLevel+1)}}]:[{label:'VER MEUS MUNDOS',primary:true,action:()=>{closeModal();showView('world')}}])],scored);},330);}
function closeModal(){$('modal').close();$('modal').classList.add('hidden');document.body.classList.remove('modal-open')}
function showModal(title,text,eyebrow,actions,starsCount=0,art='✦'){
 $('modal').classList.remove('hidden');$('modalTitle').textContent=title;$('modalText').textContent=text;$('modalEyebrow').textContent=eyebrow;$('modalArt').textContent=art;$('modalStars').textContent=starsCount?'★'.repeat(starsCount)+'☆'.repeat(3-starsCount):'';$('modalActions').replaceChildren();actions.forEach(a=>{let b=document.createElement('button');b.className='btn '+(a.primary?'primary':'ghost');b.textContent=a.label;b.onclick=a.action;$('modalActions').appendChild(b)});
 document.body.classList.add('modal-open');if(!$('modal').open)$('modal').showModal();
 }
// O motor executa AST em vez de avaliar JavaScript arbitrário de crianças.
function* executeTree(nodes,counter){for(const node of nodes){if(counter.calls++>500)throw Error('Limite de execução atingido (500 comandos).');
 if(['move','left','right','activate'].includes(node.kind))yield node;
 else if(node.kind==='repeat'){for(let i=0;i<Number(node.times||2);i++)yield* executeTree(node.children||[],counter)}
 else if(node.kind==='until'){let limit=0;while(!atGoal()&&limit++<100)yield* executeTree(node.children||[],counter);if(limit>=100)throw Error('Repetição infinita: verifique o caminho.')}
 else if(node.kind==='ifpath'){yield* executeTree(isAheadPassable()?node.children||[]:node.elseChildren||[],counter)}
 else if(node.kind==='ifswitch'){if(isOnSwitch())yield* executeTree(node.children||[],counter)}
 }}
function getProgram(){if(blocklyWorkspace&&window.Blockly){let tops=blocklyWorkspace.getTopBlocks(true).sort((a,b)=>a.getRelativeToSurfaceXY().y-b.getRelativeToSurfaceXY().y);let nodes=[];for(let block of tops)nodes.push(...blocklyBlockList(block));return nodes}return fallbackRoot;}
function blocklyBlockList(block){let list=[];while(block){let type=block.type;let n={kind:type.replace('lumi_',''),blockId:block.id};if(type==='lumi_repeat'){n.kind='repeat';n.times=Number(block.getFieldValue('TIMES'));n.children=blocklyBlockList(block.getInputTargetBlock('DO'))}else if(type==='lumi_until'){n.kind='until';n.children=blocklyBlockList(block.getInputTargetBlock('DO'))}else if(type==='lumi_ifpath'){n.kind='ifpath';n.children=blocklyBlockList(block.getInputTargetBlock('DO'));n.elseChildren=blocklyBlockList(block.getInputTargetBlock('ELSE'))}else if(type==='lumi_ifswitch'){n.kind='ifswitch';n.children=blocklyBlockList(block.getInputTargetBlock('DO'))}list.push(n);block=block.getNextBlock()}return list;}
function countNodes(nodes){let c=0;for(const n of nodes){c++;if(n.children)c+=countNodes(n.children);if(n.elseChildren)c+=countNodes(n.elseChildren)}return c;}
function countBlocks(){return blocklyWorkspace?blocklyWorkspace.getAllBlocks(false).length:countNodes(fallbackRoot)}
function updateBlockCount(){$('blockCount').textContent=`${countBlocks()} bloco${countBlocks()===1?'':'s'} utilizados`;}
function startExecution(){if(!currentState||scene!=='game')return false;runner=null;resetState();const program=getProgram();if(!program.length){setStatus('💡 Coloque alguns blocos no programa primeiro.');sfx('erro');return false}
 runner=executeTree(program,{calls:0});return true;}
function executionStep(){if(!runner)return 'ended';let n;try{n=runner.next()}catch(e){runner=null;setStatus('⚠️ '+e.message);sfx('erro');return 'ended'}if(n.done){runner=null;if(!currentState.finished){setStatus('⌛ O programa terminou antes do portal. Ajuste os blocos e tente novamente.');sfx('erro')}return 'ended';}
 if(blocklyWorkspace&&n.value.blockId)try{blocklyWorkspace.highlightBlock(n.value.blockId)}catch(e){}
 const result=handleAction(n.value);if(result===false){runner=null;return 'ended'}if(result==='won'){runner=null;return 'won'}return 'running';}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function runProgram(){if(busy)return;serial++;const mySerial=serial;if(!runner&&!startExecution())return;busy=true;$('runBtn').disabled=true;
 try{let loops=0;while(runner&&scene==='game'&&mySerial===serial&&loops++<505){let result=executionStep();if(result!=='running')break;await sleep(420/stepRate);}if(loops>=505)setStatus('⚠️ Programa longo demais. Use menos repetições.')}finally{busy=false;$('runBtn').disabled=false;if(blocklyWorkspace)try{blocklyWorkspace.highlightBlock(null)}catch(e){}}}
function stepProgram(){if(busy)return;serial++;if(!runner&&!startExecution())return;executionStep()}
function stopExecution(){serial++;runner=null;busy=false;$('runBtn').disabled=false;if(blocklyWorkspace)try{blocklyWorkspace.highlightBlock(null)}catch(e){}}
function resetProgram(){stopExecution();resetState();sfx('clique')}
// Editor Blockly: biblioteca de programação visual existente, Apache-2.0.
const BLOCK_DEFS=[
 {type:'lumi_move',message0:'➡️ avançar',previousStatement:null,nextStatement:null,colour:'#3293c5',tooltip:'Lumi anda uma casa para a frente.'},
 {type:'lumi_left',message0:'↶ virar à esquerda',previousStatement:null,nextStatement:null,colour:'#3293c5',tooltip:'Lumi gira 90 graus para a esquerda.'},
 {type:'lumi_right',message0:'↷ virar à direita',previousStatement:null,nextStatement:null,colour:'#3293c5',tooltip:'Lumi gira 90 graus para a direita.'},
 {type:'lumi_repeat',message0:'🔁 repetir %1 vezes %2 %3',args0:[{type:'field_dropdown',name:'TIMES',options:[['2','2'],['3','3'],['4','4'],['5','5'],['6','6']]},{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:'#df983f',tooltip:'Repete os blocos encaixados de 2 a 6 vezes.'},
 {type:'lumi_ifpath',message0:'❔ se caminho livre %1 então %2 senão %3',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'},{type:'input_statement',name:'ELSE'}],previousStatement:null,nextStatement:null,colour:'#936bc1',tooltip:'Testa se é possível avançar; escolha o que fazer se for ou não.'},
 {type:'lumi_ifswitch',message0:'❔ se estou no botão %1 então %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:'#936bc1',tooltip:'Executa os blocos se Lumi estiver sobre a placa amarela.'},
 {type:'lumi_activate',message0:'⚡ ativar interruptor',previousStatement:null,nextStatement:null,colour:'#ce6c9c',tooltip:'Abre o portão enquanto Lumi está na placa.'},
 {type:'lumi_until',message0:'⭐ repetir até chegar %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:'#dc9850',tooltip:'Repete os blocos até Lumi alcançar o portal com todos os cristais.'}
];
function blockTypes(){let set=SEEDS[currentLevel].toolset;let basics=['lumi_move','lumi_left','lumi_right'];if(set==='basico')return basics;if(set==='repetir')return [...basics,'lumi_repeat'];if(set==='cond')return [...basics,'lumi_repeat','lumi_ifswitch','lumi_ifpath','lumi_activate'];return [...basics,'lumi_repeat','lumi_until','lumi_ifswitch','lumi_ifpath','lumi_activate'];}
function toolbox(){return {kind:'flyoutToolbox',contents:blockTypes().map(type=>({kind:'block',type}))}}
function refreshBlocklyToolbox(){if(blocklyWorkspace)blocklyWorkspace.updateToolbox(toolbox());}
function resizeBlockly(){if(blocklyWorkspace)try{Blockly.svgResize(blocklyWorkspace)}catch(e){}}
window.blocklyReady=function(){if(blocklyEditorSetup||!window.Blockly)return;try{Blockly.defineBlocksWithJsonArray(BLOCK_DEFS);blocklyWorkspace=Blockly.inject('blocklyEditor',{toolbox:toolbox(),renderer:'zelos',theme:Blockly.Themes.Classic,trashcan:true,scrollbars:true,move:{scrollbars:true,drag:true,wheel:true},zoom:{controls:true,wheel:false,startScale:.83,maxScale:1.45,minScale:.5,scaleSpeed:1.12},grid:{spacing:20,length:3,colour:'#d5e1e6',snap:false},sounds:false});blocklyWorkspace.addChangeListener(e=>{if(e.type===Blockly.Events.UI)return;stopExecution();updateBlockCount();saveWorkspace();});blocklyEditorSetup=true;blocklyFailed=false;$('tutorialBlocks').textContent='Arraste três blocos “avançar” da lista para a área ao lado. Encaixe um embaixo do outro, de cima para baixo.';$('fallbackEditor').classList.add('hidden');$('blocklyEditor').classList.remove('hidden');if(scene==='game')loadCode();resizeBlockly();}catch(err){console.error('Blockly init',err);window.blocklyFailed();}}
window.blocklyFailed=function(){if(blocklyEditorSetup)return;blocklyFailed=true;$('tutorialBlocks').textContent='Toque em “Avançar” três vezes na lista de comandos. Eles aparecem em SEU PROGRAMA, na ordem em que Lumi vai andar.';$('blocklyEditor').classList.add('hidden');$('fallbackEditor').classList.remove('hidden');renderFallback();if(scene==='game')loadCode();};
setTimeout(()=>{if(!blocklyEditorSetup)window.blocklyFailed()},7000);
// Editor de contingência: funciona mesmo sem CDN/internet. Editor de comandos clicáveis, com aninhamento.
const LABELS={move:'➡️ Avançar',left:'↶ Esquerda',right:'↷ Direita',repeat:'🔁 Repetir',until:'⭐ Até o portal',ifpath:'❔ Se caminho livre',ifswitch:'❔ Se no botão',activate:'⚡ Ativar'};
function renderFallback(){if(!blocklyFailed||blocklyEditorSetup)return;let palette=$('fallbackPalette');palette.replaceChildren();let types=blockTypes().map(x=>x.replace('lumi_',''));
 for(const type of types){let btn=document.createElement('button');btn.className='palette-block';btn.textContent=LABELS[type];btn.onclick=()=>{if(!fallbackTarget)fallbackTarget=fallbackRoot;let n={kind:type};if(type==='repeat'){n.times=3;n.children=[]}if(['until','ifpath','ifswitch'].includes(type))n.children=[];if(type==='ifpath')n.elseChildren=[];fallbackTarget.push(n);onFallbackChange()};palette.appendChild(btn)}
 const root=$('fallbackProgram');root.replaceChildren();let title=document.createElement('strong');title.textContent='SEU PROGRAMA';title.style.fontSize='11px';root.appendChild(title);renderFallbackNodes(fallbackRoot,root,0);if(!fallbackRoot.length){let hint=document.createElement('p');hint.textContent='Clique nos blocos acima para começar.';hint.style.cssText='font-size:12px;color:#617388';root.appendChild(hint)}
 let rootBtn=document.createElement('button');rootBtn.className='palette-block';rootBtn.textContent='+ Adicionar no final';rootBtn.style.cssText='margin-top:8px;background:#546c8b;font-size:10px';rootBtn.onclick=()=>{fallbackTarget=fallbackRoot;renderFallback()};root.appendChild(rootBtn);updateBlockCount();}
function renderFallbackNodes(nodes,into,depth){if(depth>9)return;nodes.forEach((n,i)=>{
 let item=document.createElement('div');item.className='program-block'+(['repeat','until'].includes(n.kind)?' special': ['ifpath','ifswitch'].includes(n.kind)?' condition':'');
 let title=document.createElement('span');title.textContent=LABELS[n.kind]||n.kind;item.appendChild(title);
 if(n.kind==='repeat'){let sel=document.createElement('select');sel.setAttribute('aria-label','Quantidade de repetições');sel.style.cssText='margin-left:8px;border:0;border-radius:5px;background:#fff4;color:#fff;font-weight:900';for(let j=2;j<=6;j++){let o=document.createElement('option');o.value=j;o.textContent=j+'x';o.style.color='#263';if(Number(n.times||3)===j)o.selected=true;sel.appendChild(o)}sel.onchange=e=>{n.times=Number(e.target.value);onFallbackChange()};item.appendChild(sel)}
 for(const [label,move] of [['↑',-1],['↓',1]]){let b=document.createElement('button');b.textContent=label;b.disabled=(i+move<0||i+move>=nodes.length);b.onclick=()=>{let next=nodes[i+move];nodes[i+move]=n;nodes[i]=next;onFallbackChange()};item.appendChild(b)}
 let del=document.createElement('button');del.textContent='✕';del.onclick=()=>{nodes.splice(i,1);fallbackTarget=fallbackRoot;onFallbackChange()};item.appendChild(del);
 for(const prop of ['children','elseChildren']){if(!n[prop])continue;let nested=document.createElement('div');nested.className='program-children';let head=document.createElement('span');head.style.fontSize='10px';head.textContent=prop==='elseChildren'?'SENÃO':'DENTRO';nested.appendChild(head);renderFallbackNodes(n[prop],nested,depth+1);
 let button=document.createElement('button');button.textContent='＋ INSERIR AQUI';button.onclick=()=>{fallbackTarget=n[prop];renderFallback()};nested.appendChild(button);if(fallbackTarget===n[prop])nested.style.borderColor='#fff2a4';item.appendChild(nested)}into.appendChild(item);
 });}
function onFallbackChange(){stopExecution();renderFallback();saveWorkspace();}
// Geração de solução demonstrativa, baseada na rota declarativa de cada fase.
function sampleSolution(){const l=LEVELS[currentLevel];let orient=l.dir;let dirs=l.route.split('');const ast=[];let index=0;
 function pushMove(count){if(count<=0)return;if(count>=3&&l.toolset!=='basico'){let remaining=count;while(remaining>0){let n=Math.min(6,remaining);if(n>=3)ast.push({kind:'repeat',times:n,children:[{kind:'move'}]});else for(let i=0;i<n;i++)ast.push({kind:'move'});remaining-=n}}else for(let i=0;i<count;i++)ast.push({kind:'move'})}
 while(index<dirs.length){const goalDir=dirs[index];let diff=(DIRECTIONS.indexOf(goalDir)-DIRECTIONS.indexOf(orient)+4)%4;if(diff===1){ast.push({kind:'right'});orient=goalDir}else if(diff===3){ast.push({kind:'left'});orient=goalDir}else if(diff===2){ast.push({kind:'right'},{kind:'right'});orient=goalDir}
 let count=0;while(index<dirs.length&&dirs[index]===goalDir){index++;count++}
 // Interruptor está na casa do percurso index=switchAt: dividir trechos quando necessário.
 const startIndex=index-count,sw=l.switchAt;
 if(sw&&startIndex<sw&&sw<=index){pushMove(sw-startIndex); if(l.toolset==='cond'||l.toolset==='final')ast.push({kind:'ifswitch',children:[{kind:'activate'}]});else ast.push({kind:'activate'});pushMove(index-sw)}else {pushMove(count);if(sw&&index===sw)ast.push({kind:'ifswitch',children:[{kind:'activate'}]})}
 }
 return ast;}
function createBlocklyBlock(n){let t='lumi_'+n.kind;let b=blocklyWorkspace.newBlock(t);if(n.kind==='repeat')b.setFieldValue(String(n.times||3),'TIMES');b.initSvg();b.render();if(n.children?.length){let child=createBlockChain(n.children);b.getInput('DO')?.connection.connect(child.previousConnection)}if(n.elseChildren?.length){let child=createBlockChain(n.elseChildren);b.getInput('ELSE')?.connection.connect(child.previousConnection)}return b;}
function createBlockChain(nodes){let root=null,prev=null;for(const n of nodes){const b=createBlocklyBlock(n);if(!root)root=b;if(prev?.nextConnection&&b.previousConnection)prev.nextConnection.connect(b.previousConnection);prev=b}return root}
function setSolution(){const ast=sampleSolution();if(blocklyWorkspace){Blockly.Events.disable();try{blocklyWorkspace.clear();let root=createBlockChain(ast);if(root)root.moveBy(45,45)}finally{Blockly.Events.enable()};saveWorkspace()}else {fallbackRoot=JSON.parse(JSON.stringify(ast));fallbackTarget=fallbackRoot;onFallbackChange()}resetProgram();updateBlockCount()}
// Arte procedural dos mundos e animação: sprites criados para o projeto.
const SCENE_COLORS=THEMES;
function randTile(x,y,s){let v=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return v-Math.floor(v)}
function drawPixel(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}
function drawBackdrop(time,theme){if(valleyFallback.complete&&valleyFallback.naturalWidth){ctx.drawImage(valleyFallback,0,0,768,576);ctx.fillStyle='rgba(5,19,29,.26)';ctx.fillRect(0,0,768,576);return;}let t=SCENE_COLORS[theme];ctx.fillStyle=t.sky;ctx.fillRect(0,0,768,576);let g=ctx.createLinearGradient(0,0,0,576);g.addColorStop(0,t.sky);g.addColorStop(1,'#151e39');ctx.fillStyle=g;ctx.fillRect(0,0,768,576);
 ctx.fillStyle=theme===1?'#deaa75':theme===3?'#e5ebff':'#c4d7ea';ctx.globalAlpha=.09;for(let i=0;i<34;i++){let x=(i*83)%768,y=(i*131)%560;ctx.fillRect(x,y,(i%3+1)*3,(i%4+1)*3)}ctx.globalAlpha=1;
 ctx.fillStyle='#0e1a2e';ctx.fillRect(78,77,612,420);ctx.fillStyle='#324763';ctx.fillRect(78,77,612,6);ctx.fillRect(78,491,612,6);
 ctx.fillStyle='#cddbe4';ctx.font='bold 14px monospace';ctx.fillText('✦  LUMI / MAPA DA MISSÃO',95,52);ctx.textAlign='right';ctx.fillText('◈  '+String(currentLevel+1).padStart(2,'0')+'/20',676,52);ctx.textAlign='left';}
function drawAtlasFallback(name,x,y,w,h,opacity=1){const f=window.PIXEL_GPU_ATLAS?.frames?.[name];if(!f||!atlasFallback.complete||!atlasFallback.naturalWidth)return false;
 ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(atlasFallback,f.x,f.y,f.w,f.h,x,y,w,h);ctx.restore();return true;}
function drawGround(x,y,walkable,t,theme){const X=OX+x*TILE,Y=OY+y*TILE;
 if(atlasFallback.complete&&atlasFallback.naturalWidth){
  drawPixel(X,Y,48,48,walkable?'#304c3e':'#1d4739');
  if(walkable){drawAtlasFallback('path'+((x*13+y*17)%6),X+1,Y+1,46,46);drawPixel(X+4,Y+44,40,2,'#385344')}
  else{drawAtlasFallback('ground'+(x+y*3)%3,X,Y,48,48,.61);const v=(x*53+y*97+11)%23;if(v===5||v===10||v===17)drawAtlasFallback('bush'+v%3,X+7,Y+16,36,28,.85);if(v===8)drawAtlasFallback('rocks',X+8,Y+20,35,25,.77)}
  return;
 }
drawPixel(X,Y,TILE,TILE,walkable?t.floor:t.ground);
 if(walkable){drawPixel(X+2,Y+2,44,44,t.path);ctx.globalAlpha=.18;drawPixel(X+3,Y+43,42,3,t.edge);ctx.globalAlpha=1;if(randTile(x,y,9)>.45)drawPixel(X+10+(x*3)%20,Y+9+(y*7)%22,5,3,t.accent);}
 else {let k=randTile(x,y,theme);ctx.globalAlpha=.24;drawPixel(X+7,Y+5,12,9,t.accent);ctx.globalAlpha=1;if(k>.3&&x>0&&y>0&&x<W-1&&y<H-1){if(treeImgs[theme]?.complete&&treeImgs[theme]?.naturalWidth)ctx.drawImage(treeImgs[theme],X+4,Y+2,40,40);else drawPixel(X+9,Y+9,30,30,t.wall);}else {drawPixel(X+3,Y+4,42,42,t.wall);drawPixel(X+9,Y+10,26,12,t.edge)}}
 ctx.globalAlpha=.19;drawPixel(X,Y,48,2,'#06162c');drawPixel(X,Y,2,48,'#06162c');ctx.globalAlpha=1;}
function drawPortal(px,py,time){let X=OX+px*TILE+6,Y=OY+py*TILE+4;
 if(drawAtlasFallback('portal_new',X-17,Y-25+Math.sin(time/550),68,80))return;
let glow=Math.sin(time/340)*2;ctx.shadowColor='#72ecff';ctx.shadowBlur=9+glow*3;if(portalImg.complete&&portalImg.naturalWidth)ctx.drawImage(portalImg,X,Y,37,42);else drawPixel(X,Y,34,39,'#5ee7fa');ctx.shadowBlur=0;}
function drawRobot(time){if(!currentState)return;let s=currentState;let X=OX+s.x*TILE-7,Y=OY+s.y*TILE-15;
 if(atlasFallback.complete&&atlasFallback.naturalWidth){
  const walking=Date.now()-s.lastMoveAt<470,activating=Date.now()-s.lastActivateAt<600;
  let action=s.finished?'celebrate':activating?'interact':walking?'walk':'idle';
  let anim=action==='walk'?8:6,frame=Math.floor(time/(walking?90:170))%anim;
  let fx=X-31,fy=Y+24+Math.sin(time/650);
  ctx.save();if(s.dir==='W'){ctx.translate(fx+45,0);ctx.scale(-1,1);drawAtlasFallback(`fox_${s.finished?'happy':walking?'walk':'wag'}_${Math.floor(time/(walking?120:240))%4}`,0,fy,45,43)}
  else drawAtlasFallback(`fox_${s.finished?'happy':walking?'walk':'wag'}_${Math.floor(time/(walking?120:240))%4}`,fx,fy,45,43);
  ctx.restore();
  ctx.save();if(s.dir==='W'){ctx.translate(X+61,0);ctx.scale(-1,1);drawAtlasFallback(`robot_${action}_${frame}`,0,Y,61,70)}else drawAtlasFallback(`robot_${action}_${frame}`,X,Y,61,70);ctx.restore();return;
 }
 if(foxPortrait.complete&&foxPortrait.naturalWidth){ctx.save();if(s.dir==='W'){ctx.translate(X+4,0);ctx.scale(-1,1);ctx.drawImage(foxPortrait,-12,Y+25,40,39)}else ctx.drawImage(foxPortrait,X-28,Y+25,40,39);ctx.restore()}
 if(robot.complete&&robot.naturalWidth){ctx.save();if(s.dir==='W'){ctx.translate(X+61,0);ctx.scale(-1,1);ctx.drawImage(robot,0,Y,61,70)}else ctx.drawImage(robot,X,Y,61,70);ctx.restore()}
 else{drawPixel(X+6,Y+8,32,28,'#f2eff9');drawPixel(X+11,Y+15,23,8,'#287d93')}}
function drawCrystal(px,py,time){let X=OX+px*TILE+7,Y=OY+py*TILE+7+Math.sin(time/440+px)*2;
 if(drawAtlasFallback('crystal0',X,Y,34,35))return;ctx.shadowColor='#84eeff';ctx.shadowBlur=11;if(crystalImg.complete&&crystalImg.naturalWidth)ctx.drawImage(crystalImg,X,Y,34,35);ctx.shadowBlur=0;}
function drawMap(time){if(scene!=='game'||!currentState){requestAnimationFrame(drawMap);return;}
 if(gpu){gpu.draw(time,{level:LEVELS[currentLevel],state:currentState,levelIndex:currentLevel});requestAnimationFrame(drawMap);return;}
 let level=LEVELS[currentLevel],theme=level.world,t=SCENE_COLORS[theme];ctx.imageSmoothingEnabled=false;drawBackdrop(time,theme);
 if(atlasFallback.complete&&atlasFallback.naturalWidth){drawPixel(83,84,602,404,'#122e31');drawPixel(90,90,589,391,'#2a5151');}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)drawGround(x,y,level.walkable.has(`${x},${y}`),t,theme);
 // começo
 drawPixel(OX+level.start[0]*TILE+5,OY+level.start[1]*TILE+40,38,4,'#75f8c5');
 if(level.switchTile){let [x,y]=level.switchTile,X=OX+x*TILE,Y=OY+y*TILE;drawPixel(X+6,Y+24,36,18,'#73563e');drawPixel(X+9,Y+24,30,11,currentState.activated?'#5ce3b0':'#ffd36c');drawPixel(X+17,Y+26,13,8,'#513d56');ctx.font='bold 13px monospace';ctx.fillStyle='#17233e';ctx.fillText('!',X+20,Y+18)}
 if(level.gateTile){let [x,y]=level.gateTile,X=OX+x*TILE,Y=OY+y*TILE;if(!currentState.activated){drawPixel(X+7,Y+2,35,45,'#393049');drawPixel(X+11,Y+4,26,39,'#76668f');for(let q=0;q<3;q++)drawPixel(X+14+q*8,Y+8,4,29,'#3a324b');drawPixel(X+12,Y+2,25,6,'#edd080')}else {ctx.globalAlpha=.5;drawPixel(X+5,Y+41,39,4,'#6df9b4');ctx.globalAlpha=1}}
 drawPortal(...level.goal,time);for(const key of currentState.crystals){let [x,y]=key.split(',').map(Number);drawCrystal(x,y,time)}drawRobot(time);
 if(atlasFallback.complete&&atlasFallback.naturalWidth){drawAtlasFallback('tree0',-16,280,128,206,.91);drawAtlasFallback('tree1',654,285,102,180,.86);drawAtlasFallback('shroom',576,487,119,61,.91);drawAtlasFallback('lamp',695,127,54,96,.92);ctx.fillStyle='#071e2bd9';ctx.fillRect(78,509,613,52)}
 ctx.fillStyle='#cad3e4';ctx.font='bold 12px monospace';ctx.fillText('DICA: OBSERVE A DIREÇÃO DOS OLHOS DE LUMI',96,523);ctx.fillStyle='#9be7d8';ctx.fillText('✦ PROGRAMAR = PLANEJAR + TESTAR',96,546);
 requestAnimationFrame(drawMap);}
requestAnimationFrame(drawMap);
// Ligação de menus e botões
$('playBtn').onclick=()=>{sfx('clique');loadLevel(highestUnlocked())};$('worldBtn').onclick=()=>{sfx('clique');showView('world')};$('homeBtn').onclick=()=>{stopExecution();showView('home')};$('worldBack').onclick=()=>showView('home');$('gameBack').onclick=()=>{stopExecution();showView('world')};$('musicBtn').onclick=toggleMusic;$('helpBtn').onclick=()=>showModal('Como jogar','1. Escolha uma fase e observe o mapa.\n2. Arraste os blocos de código para a área de trabalho.\n3. Encaixe os comandos na ordem desejada.\n4. Aperte EXECUTAR ou PASSO para acompanhar Lumi.\n5. Colete os cristais e entre no portal para vencer!\n\nUm programa com menos blocos recebe mais estrelas.','GUIA DO EXPLORADOR',[{label:'VAMOS JOGAR!',primary:true,action:closeModal}],0,'🎮');
$('runBtn').onclick=runProgram;$('stepBtn').onclick=stepProgram;$('resetBtn').onclick=resetProgram;
$('clearBtn').onclick=()=>{stopExecution();if(blocklyWorkspace){blocklyWorkspace.clear();saveWorkspace()}else {fallbackRoot=[];fallbackTarget=fallbackRoot;onFallbackChange()}resetState();updateBlockCount()};
$('hintBtn').onclick=()=>showModal('Uma dica para você',LEVELS[currentLevel].hint,'CONSELHO DE LUMI',[{label:'ENTENDI!',primary:true,action:closeModal}],0,'💡');
$('solutionBtn').onclick=()=>showModal('Exemplo de solução','Quer ver uma maneira possível de resolver esta missão? Isso vai substituir os blocos que você montou nesta fase.','LABORATÓRIO DE CÓDIGO',[{label:'VOLTAR',action:closeModal},{label:'CARREGAR EXEMPLO',primary:true,action:()=>{closeModal();setSolution();setStatus('✦ Exemplo carregado! Agora aperte Executar.')}}],0,'🧠');
$('prevBtn').onclick=()=>loadLevel(currentLevel-1);$('nextBtn').onclick=()=>loadLevel(currentLevel+1);
$('slowBtn').onclick=()=>{stepRate=Math.max(.5,stepRate/2);$('speedText').textContent=stepRate+'×'};$('fastBtn').onclick=()=>{stepRate=Math.min(4,stepRate*2);$('speedText').textContent=stepRate+'×'};
$('modalCover').onclick=closeModal;$('modalClose').onclick=closeModal;
$('modal').addEventListener('cancel',e=>{e.preventDefault();closeModal()});window.addEventListener('resize',resizeBlockly);
window.addEventListener('visibilitychange',()=>{if(document.hidden)music.pause();else if(musicEnabled&&currentSong)music.play().catch(()=>{})});
$('musicBtn').textContent=musicEnabled?'♫':'♪̸';updateProgress();showView('home');
// Auto-testes de integridade do desenho das rotas e do currículo
for(const l of LEVELS){let invalid=l.path.some(([x,y])=>x<1||x>10||y<1||y>6);if(invalid)console.error(`Fase ${l.index+1} fora do tabuleiro.`);if(l.gateAt&&l.switchAt>=l.gateAt)console.error(`Fase ${l.index+1}: placa após portão.`)}
