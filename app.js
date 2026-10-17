// Talk Tap. Content comes from vocab.js (library) plus the legacy sentence ladder and WH scenes below. Eight activities share one item model.
// ---------- Legacy content (kept: it already has pictures and recorded audio) ----------
const LEGACY=[
 {n:2,items:[
  ["doctor","👩‍⚕️","She is a doctor."],["doctor","👨‍⚕️","He is a doctor."],["chef","👨‍🍳","He is a chef."],["chef","👩‍🍳","She is a chef."],
  ["pilot","👨‍✈️","He is a pilot."],["pilot","👩‍✈️","She is a pilot."],["firefighter","👩‍🚒","She is a firefighter."],["firefighter","👨‍🚒","He is a firefighter."],
  ["police officer","👮‍♂️","He is a police officer."],["police officer","👮‍♀️","She is a police officer."],["farmer","👩‍🌾","She is a farmer."],["farmer","👨‍🌾","He is a farmer."],
  ["teacher","👨‍🏫","He is a teacher."],["teacher","👩‍🏫","She is a teacher."],["builder","👷‍♀️","She is a builder."],["builder","👷‍♂️","He is a builder."],
  ["scientist","👩‍🔬","She is a scientist."],["scientist","👨‍🔬","He is a scientist."]
 ].map(([w,e,s])=>({w,e,s,q:s.startsWith("She")?"What is she?":"What is he?",img:"job_"+w.replace(/ /g,"_")+(s.startsWith("She")?"_f":"_m")}))},
 {n:3,items:[
  ["jump","🤸"],["run","🏃"],["swim","🏊"],["sing","🎤"],["climb","🧗"],["kick","🦵"],["sleep","😴"],["read","📖"],
  ["dance","💃"],["cook","🍳"],["paint","🎨"],["ride","🚴"],["write","✍️"],["drink","🥤"],["eat","🍽️"],["wave","👋"]
 ].map(([w,e])=>({w,e,s:"I can "+w+".",q:"What can I do?",img:"can_"+w}))},
 {n:4,items:[
  ["feeding the elephant","🐘🍌"],["feeding the dog","🐶🦴"],["feeding the cat","🐱🐟"],["feeding the bird","🐦🌾"],
  ["washing the car","🚗🧽"],["washing the dog","🐶🛁"],["washing the dishes","🍽️🧼"],["eating the apple","🍎😋"],["eating the pizza","🍕😋"],["eating the banana","🍌😋"],
  ["kicking the ball","⚽🦵"],["throwing the ball","⚽🤾"],["holding the ball","⚽🙌"],["reading the book","📕👀"],["holding the cup","🥤✋"],["building a house","🏠🔨"]
 ].map(([w,e])=>({w,e,s:"I am "+w+".",q:"What am I doing?",img:"vo_"+w.replace(/ /g,"_")}))},
 {n:5,items:[
  ["bird is flying","🐦✈️"],["bird is nesting","🐦🪺"],["fish is swimming","🐟🌊"],["dog is running","🐶💨"],["dog is sleeping","🐶💤"],
  ["cat is sleeping","🐱💤"],["cat is jumping","🐱⬆️"],["boy is eating","👦🍽️"],["boy is reading","👦📖"],["girl is singing","👧🎤"],
  ["girl is painting","👧🎨"],["baby is crying","👶😢"],["baby is laughing","👶😂"],["man is cooking","👨🍳"],["woman is driving","👩🚗"]
 ].map(([w,e])=>({w,e,s:"The "+w+".",q:"What is happening?",img:"sv_"+w.replace(/ /g,"_")}))},
 {n:6,items:[
  ["big dog","🐶⬆️","This is a big dog."],["small dog","🐶⬇️","This is a small dog."],["red apple","🍎","This is a red apple."],["green apple","🍏","This is a green apple."],
  ["red car","🚗","This is a red car."],["blue car","🚙","This is a blue car."],["one ball","⚽","I see one ball."],["two balls","⚽⚽","I see two balls."],
  ["three fish","🐟🐟🐟","I see three fish."],["one fish","🐟","I see one fish."],["hot soup","🍲🔥","The soup is hot."],["cold drink","🥤🧊","The drink is cold."],
  ["happy boy","👦😀","The boy is happy."],["sad boy","👦😢","The boy is sad."],["yellow hat","🧢","This is a yellow hat."],["black hat","🎩","This is a black hat."]
 ].map(([w,e,s])=>({w,e,s,q:"What do you see?",img:"d6_"+w.replace(/ /g,"_")}))},
];
// ---------- Stages ----------
const STAGES=[
  {n:1,name:"Words",eg:"water"},
  {n:2,name:"Two words",eg:"want water"},
  {n:3,name:"Sentences",eg:"I want water."},
  {n:4,name:"Describe",eg:"I want cold water."},
  {n:5,name:"Ask and answer",eg:"Mummy, can I have water?"},
];
// One item model for every activity: {id, w, e, img, cat, stage, s (text), q (question), find (Find it line), key (unique), src}
let ITEMS=[];let CUSTOM=[];
function buildItems(){
  ITEMS=[];
  for(const v of VOCAB)for(let st=1;st<=5;st++)ITEMS.push({id:v.id,w:v.w,e:v.e,img:v.img,cat:v.cat,stage:st,s:v.st[st-1],q:v.q[st-1],find:v.f,key:v.id+"@"+st,src:"vocab",tip:""});
  for(const L of LEGACY){const st=L.n===6?4:3;for(const it of L.items)ITEMS.push({id:"L"+L.n+"_"+it.img,w:it.w,e:it.e,img:it.img,cat:"legacy",stage:st,s:it.s,q:it.q,find:"Find the "+it.w+".",key:"L"+L.n+"_"+it.img,src:"legacy"})}
  for(const c of CUSTOM){const st5=stagesFor(c);for(let st=1;st<=5;st++)ITEMS.push({id:"c_"+c.id,w:c.w,e:c.e||"⭐",img:c.img,cat:c.cat||"objects",stage:st,s:st5[st-1],q:(VOCAB_Q[c.cat]||VOCAB_Q.objects)[st-1],find:"Find the "+c.w+".",key:"c_"+c.id+"@"+st,src:"custom",audio:c.audio,tip:c.tip||""})}
}
// Stage sentences for a parent-added word, from its group's pattern unless the parent typed their own.
const STAGE_TPL={
  food:w=>[w,"want "+w,"I want "+w+".","I want more "+w+".","Can I have "+w+", please?"],
  objects:w=>[w,"my "+w,"I want my "+w+".","I want my "+w+" now.","Where is my "+w+"?"],
  people:w=>[w,"hi "+w,"I see "+w+".","I see "+w+" smiling.",w+", where are you?"],
  animals:w=>[w,"big "+w,"I see a "+w+".","I see a big "+w+".","Where is the "+w+"?"],
  actions:w=>[w,"I "+w,"I can "+w+".","I can "+w+" now.","Can you "+w+"?"],
  places:w=>[w,"go "+w,"I go to the "+w+".","I want to go to the "+w+".","Can we go to the "+w+"?"],
  feelings:w=>[w,"I'm "+w,"I feel "+w+".","I feel "+w+" today.","Are you "+w+"?"],
  describe:w=>[w,"very "+w,"It is "+w+".","It is very "+w+".","Is it "+w+"?"],
  needs:w=>[w,"want "+w,"I want "+w+".","I want "+w+", please.","Can I have "+w+"?"],
  social:w=>[w,w+" Mummy",w+", "+"please.",w+", thank you.","Say "+w+"."],
  body:w=>[w,"my "+w,"This is my "+w+".","I touch my "+w+".","Where is your "+w+"?"],
  positions:w=>[w,w+" the box","It is "+w+" the box.","The ball is "+w+" the box.","Is it "+w+" the box?"],
  colours:w=>[w,w+" ball","I see a "+w+" ball.","I see a big "+w+" ball.","Which one is "+w+"?"],
};
function stagesFor(c){const t=(STAGE_TPL[c.cat]||STAGE_TPL.objects)(c.w);return [0,1,2,3,4].map(i=>(c.st&&c.st[i])||t[i])}

// ---------- WH scenes (Ask it) ----------
const WH_ORDER=["what","who","where","when","how"];
const WH_WORD={what:"What?",who:"Who?",where:"Where?",when:"When?",how:"How?"};
const P=(w,e)=>({w,e});
const WHO={boy:P("the boy","👦"),girl:P("the girl","👧"),mum:P("Mum","👩"),dad:P("Dad","👨"),baby:P("the baby","👶"),dog:P("the dog","🐶"),cat:P("the cat","🐱"),teacher:P("the teacher","👩‍🏫"),grandma:P("Grandma","👵")};
const WHAT={apple:P("an apple","🍎"),book:P("a book","📕"),ball:P("a ball","⚽"),rice:P("rice","🍚"),car:P("the car","🚗"),cup:P("a cup","🥤"),bone:P("a bone","🦴"),bread:P("bread","🍞"),phone:P("the iPad","📱"),pencil:P("a pencil","✏️"),water:P("water","💧"),toothbrush:P("a toothbrush","🪥")};
const WHERE={kitchen:P("in the kitchen","🍳"),bed:P("in bed","🛏️"),park:P("at the park","🌳"),school:P("at school","🏫"),road:P("on the road","🛣️"),pool:P("at the pool","🏊"),sofa:P("on the sofa","🛋️"),garden:P("in the garden","🌻"),bathroom:P("in the bathroom","🛁"),car:P("in the car","🚗")};
const WHEN={morning:P("in the morning","🌅"),afternoon:P("in the afternoon","☀️"),night:P("at night","🌙"),bedtime:P("at bedtime","🛌")};
const HOW={happy:P("happy","😀"),sad:P("sad","😢"),tired:P("tired","🥱"),angry:P("angry","😠"),scared:P("scared","😨")};
const SCENES=[
 ["boy","eating","apple","kitchen","morning","happy"],["girl","reading","book","bed","night","tired"],["dog","chewing","bone","garden","afternoon","happy"],
 ["mum","cooking","rice","kitchen","afternoon","happy"],["dad","driving","car","road","morning","happy"],["baby","holding","cup","bed","night","sad"],
 ["teacher","holding","pencil","school","morning","happy"],["boy","kicking","ball","park","afternoon","happy"],["girl","watching","phone","sofa","night","happy"],
 ["cat","holding","ball","sofa","afternoon","tired"],["grandma","drinking","water","garden","morning","happy"],["dad","holding","toothbrush","bathroom","bedtime","tired"],
 ["boy","eating","bread","car","morning","sad"],["girl","reading","book","school","afternoon","happy"],["mum","driving","car","road","night","angry"],["baby","holding","ball","park","afternoon","scared"],
].map(([who,verb,what,where,when,how],idx)=>{
  const s={who:WHO[who],what:WHAT[what]||WHERE[what],where:WHERE[where],when:WHEN[when],how:HOW[how],verb};
  s.img="wh_"+["boy","girl","dog","mum","dad","baby","teacher","boy2","girl2","cat","grandma","dad2","boy3","girl3","mum2","baby2"][idx];
  s.sentence=cap(s.who.w)+" is "+verb+" "+s.what.w+" "+s.where.w+" "+s.when.w+".";
  s.pic=s.who.e+s.what.e+s.where.e+s.when.e;
  s.q={who:"Who is "+verb+"?",what:"What is "+s.who.w+" "+verb+"?",where:"Where is "+s.who.w+"?",when:"When is "+s.who.w+" "+verb+"?",how:"How does "+s.who.w+" feel?"};
  s.a={who:cap(s.who.w)+".",what:cap(s.what.w)+".",where:cap(s.where.w)+".",when:cap(s.when.w)+".",how:cap(s.who.w)+". Feels "+s.how.w+"."};
  return s;
});
function cap(t){return t[0].toUpperCase()+t.slice(1)}
const WH_POOL={who:Object.values(WHO),what:Object.values(WHAT),where:Object.values(WHERE),when:Object.values(WHEN),how:Object.values(HOW)};
const WH_LEVELS=[
  {n:1,name:"Answer: what, who, where",types:["what","who","where"],mixed:false},
  {n:2,name:"Answer: add when and how",types:WH_ORDER,mixed:false},
  {n:3,name:"Answer: mixed choices",types:WH_ORDER,mixed:true},
  {n:4,name:"Ask me: pick the question word",types:WH_ORDER,ask:true},
];

// ---------- Activities ----------
const MODES=[
  {id:"find",label:"Find it",e:"👂",skill:"hear"},
  {id:"read",label:"Read it",e:"📖",skill:"read"},
  {id:"say",label:"Say it",e:"🗣️",skill:"say"},
  {id:"ask",label:"Ask it",e:"❓",skill:"understand"},
  {id:"build",label:"Build it",e:"🧱",skill:"read"},
  {id:"next",label:"What next",e:"➡️",skill:"understand"},
  {id:"feel",label:"Feelings",e:"🙂",skill:"understand"},
  {id:"do",label:"Do it",e:"👉",skill:"hear"},
];
const MODE_IDS=MODES.map(m=>m.id);const MODE_LABEL=Object.fromEntries(MODES.map(m=>[m.id,m.label]));const MODE_SKILL=Object.fromEntries(MODES.map(m=>[m.id,m.skill]));

// ---------- State ----------
const S={mode:"find",stars:0,streak:0,item:null,choices:[],locked:false,recent:[],recentAsk:[],sessionEnd:0,scene:null,wh:null,
  settings:{name:"",reward:"",streak:5,rate:0.9,level:1,auto:1,session:10,pin:"",wh:1,voice:"jessica",v:4,modes:MODE_IDS.slice(),cats:Object.keys(VOCAB_CATS).concat(["legacy"])},
  today:{},kid:null};
// world: My World (avatar, room, star shop). 2 = any time, 1 = only after the session, 0 = off. wallet: stars kept for the shop.
const KIDS_DEFAULT={oba:{name:"Oba",emoji:"🧒",level:2,wh:1,auto:1,v4:1,v5:1,pron:"he",world:0,wallet:0},june:{name:"June",emoji:"👧",level:3,wh:2,auto:1,pron:"she",world:2,wallet:10}};
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
{const g=load("tt.settings",{});delete g.name;delete g.level;delete g.wh;delete g.auto;
 if(g.v!==2&&g.v!==3&&g.v!==4){g.voice="jessica";g.v=2}if(g.v<3){if(g.pin==="2468")g.pin="";g.v=3}if(g.v<4){g.v=4}
 S.settings={...S.settings,...g};if(!Array.isArray(S.settings.modes))S.settings.modes=MODE_IDS.slice();if(!Array.isArray(S.settings.cats))S.settings.cats=Object.keys(VOCAB_CATS).concat(["legacy"])}
const dayKey=new Date().toDateString();
const KIDS=load("tt.kids",null)||JSON.parse(JSON.stringify(KIDS_DEFAULT));
for(const k in KIDS_DEFAULT)if(!KIDS[k])KIDS[k]=JSON.parse(JSON.stringify(KIDS_DEFAULT[k]));
// Old six-level ladder → five stages: 1→1, 2..5→3, 6→4
for(const k in KIDS){const kd=KIDS[k];if(!kd.v4){kd.level=kd.level>=6?4:kd.level>=2?3:1;kd.v4=1}}
// One-time move: Stage 1 was too easy, so a device that still has Oba on Stage 1 starts him on Stage 2.
if(KIDS.oba&&!KIDS.oba.v5){if((KIDS.oba.level||1)<2)KIDS.oba.level=2;KIDS.oba.v5=1}
// One-time: My World on for June (with 10 welcome stars), off for Oba.
for(const k in KIDS){const kd=KIDS[k];if(kd.world===undefined){kd.world=k==="june"?2:0;kd.wallet=kd.wallet||(k==="june"?10:0);kd.pron=kd.pron||(k==="june"?"she":"he")}}
save("tt.kids",KIDS);
const freshToday=()=>Object.fromEntries(MODE_IDS.map(m=>[m,[0,0]]));
function loadKid(id){
  const k=KIDS[id];S.kid=id;
  S.settings.name=k.name;S.settings.level=k.level||1;S.settings.wh=k.wh||1;S.settings.auto=k.auto??1;
  S.today=(k.day===dayKey&&k.today)?{...freshToday(),...k.today}:freshToday();
  S.stars=k.day===dayKey?(k.stars||0):0;S.streak=0;S.recent=[];S.recentAsk=[];
  save("tt.kid",id);
  if(window.worldKidChanged)worldKidChanged();
}
function syncKid(){const k=KIDS[S.kid];if(!k)return;k.level=S.settings.level;k.wh=S.settings.wh;k.auto=S.settings.auto;k.today=S.today;k.stars=S.stars;k.day=dayKey;save("tt.kids",KIDS)}
function persistToday(){syncKid()}

// ---------- Pictures ----------
let IMGS=load("tt.imgs",{});
fetch("api/images").then(r=>r.ok?r.json():null).then(m=>{if(m&&Object.keys(m).length){IMGS=m;save("tt.imgs",m);prefetchImgs(m)}}).catch(()=>{});
function prefetchImgs(m){const urls=Object.values(m);const sig=urls.length+":"+urls.slice(-1)[0];if(load("tt.imgsig",null)===sig||!navigator.onLine)return;let i=0;
  const next=()=>{if(i>=urls.length){save("tt.imgsig",sig);return}const u=urls[i++];fetch(u,{mode:"no-cors"}).catch(()=>{}).finally(()=>setTimeout(next,150))};next();next();next();}
const imgUrl=it=>it&&it.img&&IMGS[it.img]||null;
function putImg(el,key,alt,fallback){const u=key&&IMGS[key];el.innerHTML="";if(u){const im=document.createElement("img");im.src=u;im.alt=alt||"";el.appendChild(im)}else el.textContent=fallback||""}
function fillTile(b,it,label){putImg(b,it.img,it.w,it.e);if(label){const l=document.createElement("span");l.className="lbl";l.textContent=label;b.appendChild(l)}}
function fillBig(el,it){el.hidden=false;putImg(el,it&&it.img,it&&it.w,it&&it.e)}

// ---------- Custom words (parent builder) ----------
CUSTOM=load("tt.custom",[]);
async function loadCustom(){try{const r=await fetch("api/vocab",{cache:"no-store"});if(r.ok){const j=await r.json();if(Array.isArray(j)){CUSTOM=j;save("tt.custom",j);buildItems()}}}catch(e){}}
buildItems();loadCustom();

// ---------- Progress log (queued locally, sent to /api/log when online) ----------
const DEVICE=(()=>{let d=load("tt.device",null);if(!d){d=Math.random().toString(36).slice(2,10);save("tt.device",d)}return d})();
let SESSION=Date.now().toString(36);
const QUEUE=load("tt.queue",[]);
function logEvent(e){
  QUEUE.push({skill:MODE_SKILL[e.mode]||e.skill,stage:S.settings.level,...e,kid:S.kid,client_ts:new Date().toISOString(),session_id:SESSION,voice:S.roundVoice||"jessica"});
  if(QUEUE.length>400)QUEUE.splice(0,QUEUE.length-400);
  save("tt.queue",QUEUE);
  if(QUEUE.length>=12)flushLog();
}
let flushing=false;
async function flushLog(){
  if(flushing||!QUEUE.length||!navigator.onLine||location.protocol==="file:")return;
  flushing=true;const batch=QUEUE.slice(0,200);
  try{const r=await fetch("api/log",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({device:DEVICE,events:batch})});if(r.ok){QUEUE.splice(0,batch.length);save("tt.queue",QUEUE)}}catch(e){}
  flushing=false;
}
window.addEventListener("online",flushLog);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flushLog()});
setInterval(flushLog,45000);

// ---------- Speech ----------
let voice=null;
function pickVoice(){if(!("speechSynthesis" in window))return;const vs=speechSynthesis.getVoices();voice=vs.find(v=>/^en/i.test(v.lang)&&/Samantha|Daniel|Google US|Karen|Moira/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang))||null}
if("speechSynthesis" in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
let current=null;
const CUSTOM_AUDIO={};  // lowercased word -> url, from parent recordings
function clipFor(part){let t=part.trim();if(!t)return null;if(!/[.!?]$/.test(t))t+=".";return CLIPS[t.toLowerCase()]||null}
const sprites={};let stopTimer=null;let playToken=0;
function spriteAudio(v,file){const k=v+(file||0);let a=sprites[k];if(!a){a=new Audio("voice_"+v+(file?"_"+(file+1):"")+".mp3");a.preload="auto";sprites[k]=a}return a}
function playClip(id,cb){
  const v=S.roundVoice||"jessica";const span=(SPRITES[v]||{})[id]||(SPRITES.jessica||{})[id];if(!span){cb&&cb();return}
  const a=spriteAudio((SPRITES[v]||{})[id]?v:"jessica",span[2]);current=a;const token=++playToken;
  const done=()=>{if(!cb)return;const f=cb;cb=null;if(token!==playToken){return}a.pause();a.onplaying=null;clearTimeout(stopTimer);f()};
  const go=()=>{
    clearTimeout(stopTimer);a.onplaying=null;
    try{a.currentTime=span[0]}catch(e){}
    a.playbackRate=S.settings.rate<0.85?0.9:1;
    const end=span[1]+0.08;const dur=(end-span[0])/a.playbackRate;
    const tick=()=>{if(!cb||token!==playToken){cb=null;return}if(a.currentTime>=end){done();return}requestAnimationFrame(tick)};
    a.onplaying=()=>{a.onplaying=null;clearTimeout(stopTimer);stopTimer=setTimeout(done,dur*1000+600);requestAnimationFrame(tick)};
    stopTimer=setTimeout(done,dur*1000+4000);
    const p=a.play();if(p&&p.catch)p.catch(()=>done());
  };
  if(a.readyState>=1)go();else{a.addEventListener("loadedmetadata",go,{once:true});a.load()}
}
function playUrl(url,cb){const a=new Audio(url);current=a;const token=++playToken;let fired=false;const fin=()=>{if(fired||token!==playToken)return;fired=true;cb&&cb()};a.onended=fin;a.onerror=fin;const p=a.play();if(p&&p.catch)p.catch(fin);setTimeout(fin,6000)}
function tts(text,cb){
  if(!("speechSynthesis" in window)){cb&&cb();return}
  const u=new SpeechSynthesisUtterance(text);if(voice)u.voice=voice;u.rate=S.settings.rate;u.pitch=1.05;
  u.onend=()=>cb&&cb();u.onerror=()=>cb&&cb();speechSynthesis.speak(u);
}
function stopAll(){playToken++;if("speechSynthesis" in window)speechSynthesis.cancel();clearTimeout(stopTimer);if(current){current.pause();current.onplaying=null;current=null}}
// Plays each sentence from a clip when one exists (recorded voice first, then a parent recording, then the iPad voice).
function speak(text,cb){
  stopAll();
  const whole=clipFor(text);
  const parts=whole?[text]:(text.match(/[^.!?]+[.!?]?/g)||[text]);
  let i=0;
  (function next(){
    if(i>=parts.length){cb&&cb();return}
    const p=parts[i++];const src=clipFor(p);const cu=CUSTOM_AUDIO[p.trim().replace(/[.!?]$/,"").toLowerCase()];
    if(src)playClip(src,()=>setTimeout(next,120));else if(cu)playUrl(cu,()=>setTimeout(next,120));else tts(p,next);
  })();
}
let unlocked=false;
document.addEventListener("touchend",()=>{if(unlocked)return;unlocked=true;for(const v of ["jessica","dad","mum"]){const a=spriteAudio(v);a.volume=1;a.load()}for(const f of [1,2]){const a=spriteAudio("jessica",f);a.volume=1;a.load()}},{once:true,passive:true});

// ---------- Helpers ----------
const $=id=>document.getElementById(id);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function mk(label,cls,fn){const b=document.createElement("button");b.className=cls;b.textContent=label;b.onclick=fn;return b}
const inPlay=it=>S.settings.cats.includes(it.cat)||it.src==="custom";
const stageItems=st=>ITEMS.filter(it=>it.stage===st&&inPlay(it));
let last=null;
// Spaced review: mastered after 3 first-try rights in a row, back after 1, 3, 7, 14 days; a miss restarts it.
const SR_DAYS=[1,3,7,14];
const srKey=it=>S.mode+"|"+it.key;
function srRec(){const k=KIDS[S.kid];k.sr=k.sr||{};return k.sr}
function srDue(pool){const sr=srRec(),now=Date.now();return pool.filter(i=>{const r=sr[srKey(i)];return r&&r.due&&r.due<=now&&i!==last})}
function srUpdate(it,firstTryRight,wrong){
  const sr=srRec(),k=srKey(it),r=sr[k]||(sr[k]={n:0,step:0,due:null});
  if(wrong){r.n=0;r.step=0;r.due=null}
  else if(firstTryRight){r.n++;if(S.review){r.step=Math.min(r.step+1,SR_DAYS.length-1);r.due=Date.now()+SR_DAYS[r.step]*864e5}else if(r.n>=3&&!r.due){r.step=0;r.due=Date.now()+SR_DAYS[0]*864e5}}
  save("tt.kids",KIDS);
}
// Shuffle bag per child and pool: everything once before any repeat.
function bagDraw(key,src){
  const k=KIDS[S.kid];k.bags=k.bags||{};let bag=k.bags[key];
  const valid=i=>i>=0&&i<src.length;
  if(!bag||!bag.length||!bag.every(valid)){bag=shuffle(src.map((_,i)=>i));if(src.length>1&&src[bag[bag.length-1]]===last)bag.unshift(bag.pop())}
  const i=bag.pop();k.bags[key]=bag;save("tt.kids",KIDS);
  return src[i]||src[0];
}
function poolFor(mode){
  if(mode==="build"){const st=Math.max(2,Math.min(4,S.settings.level));return stageItems(st).filter(i=>i.src!=="legacy"&&i.s.split(" ").length>=2)}
  return stageItems(S.settings.level);
}
function pick(){
  S.review=false;const pool=poolFor(S.mode);
  if(S.mode!=="say"&&Math.random()<0.34){const due=srDue(ITEMS.filter(i=>i.stage<=S.settings.level&&inPlay(i)));if(due.length){S.review=true;return due[Math.random()*due.length|0]}}
  return bagDraw("pool:"+S.mode+":"+S.settings.level+":"+pool.length,pool);
}
// Wrong answers share the frame (same group, same stage), so meaning has to do the work.
function distractors(item,n){
  n=n||2;const pool=stageItems(item.stage).filter(i=>i.id!==item.id&&i.img!==item.img&&i.w!==item.w);
  const same=shuffle(pool.filter(i=>i.cat===item.cat)),other=shuffle(pool.filter(i=>i.cat!==item.cat));
  const out=[],seen=new Set([item.img||item.e]);
  for(const d of same.concat(other)){const k=d.img||d.e;if(seen.has(k))continue;seen.add(k);out.push(d);if(out.length===n)break}
  return out;
}
function praise(){
  const n=S.settings.name;
  const named=["Yes, "+n+"!","Good job, "+n+"!","Well done, "+n+"!","You got it, "+n+"!","That's it, "+n+"!"].filter(t=>clipFor(t));
  const plain=["Yes!","That's it!","Good job!","You got it!","Well done!"];
  const pool=(named.length&&Math.random()<0.5)?named:plain;return pool[Math.random()*pool.length|0];
}
function named(line,fallback){const n=S.settings.name;const t=line.replace("{n}",n);return clipFor(t)?t:fallback}
function setStars(){$("stars").textContent="⭐ "+S.stars}
function setLevelBadge(){
  const b=$("lvlBadge");
  if(S.mode==="next"||S.mode==="feel")b.textContent=MODE_LABEL[S.mode];
  else if(S.mode==="ask")b.textContent="WH "+S.settings.wh+" · "+WH_LEVELS[S.settings.wh-1].name;
  else b.textContent="Stage "+S.settings.level+" · "+STAGES[S.settings.level-1].name;
}
function resetStage(){
  const tiles=$("tiles"),actions=$("actions"),pt=$("promptText"),big=$("bigPic"),pair=$("pair"),slots=$("slots");
  tiles.innerHTML="";actions.innerHTML="";big.hidden=true;big.innerHTML="";pair.hidden=true;pair.innerHTML="";slots.hidden=true;slots.innerHTML="";pt.className="text";tiles.hidden=false;tiles.style.gridTemplateColumns="";
  $("hint").textContent="";
  return {tiles,actions,pt,big,pair,slots,hint:$("hint")};
}
function tileButtons(choices,onTap,label){
  const tiles=$("tiles");
  for(const c of choices){const b=document.createElement("button");b.className="tile";fillTile(b,c,label?label(c):null);b.setAttribute("aria-label",c.w);b.onclick=()=>onTap(b,c);tiles.appendChild(b)}
}
function markRight(btn){S.locked=true;btn.classList.add("good");[...$("tiles").children].forEach(x=>{if(x!==btn)x.classList.add("dim")})}
function markWrong(btn){btn.classList.add("bad");setTimeout(()=>btn.classList.remove("bad"),700)}
function win(n){S.stars+=n||1;S.streak++;const k=KIDS[S.kid];if(k)k.wallet=(k.wallet||0)+(n||1);setStars();persistToday();if(window.worldStarsChanged)worldStarsChanged()}
function miss(){S.streak=0;persistToday()}
function nextButtons(repeatText,extra){
  const a=$("actions");a.innerHTML="";
  a.append(mk("🔊 Hear it again","btn",()=>speak(repeatText)));if(extra)a.append(extra);a.append(mk("Next ▶","btn primary",()=>afterRound()));
}
const roundMeta=firstTry=>({replays:S.replays||0,ms:firstTry?Date.now()-S.roundT0:undefined,review:S.review||undefined});
// Auto level-up from Find it and Read it (first try) and Say it ("He said it"): 5 right in a row, or 8 of the last 10.
function track(ok){
  S.recent.push(ok);if(S.recent.length>10)S.recent.shift();
  const fiveInRow=S.recent.length>=5&&S.recent.slice(-5).every(Boolean);
  const eightOfTen=S.recent.length===10&&S.recent.filter(Boolean).length>=8;
  if(S.settings.auto&&(fiveInRow||eightOfTen)&&S.settings.level<STAGES.length){S.settings.level++;syncKid();S.recent=[];speak("Level up!")}
}
function trackAsk(ok){
  S.recentAsk.push(ok);if(S.recentAsk.length>10)S.recentAsk.shift();
  if(S.settings.auto&&S.recentAsk.length===10&&S.recentAsk.filter(Boolean).length>=8&&S.settings.wh<WH_LEVELS.length){S.settings.wh++;syncKid();S.recentAsk=[];speak("Level up!")}
}

// ---------- Rounds ----------
function pickVoice2(){const v=S.settings.voice;S.roundVoice=v==="both"?(S.roundVoice==="dad"?"mum":"dad"):v}
function newRound(){
  S.locked=false;S.triedThisRound=false;S.replays=0;S.roundT0=Date.now();S.review=false;pickVoice2();setLevelBadge();
  const r={find:findRound,read:readRound,say:sayRound,ask:askRound,build:buildRound,next:nextRound,feel:feelRound,do:doRound}[S.mode]||findRound;
  r();
}
// Find it: hear it, tap the picture. Stage 1 says "Find the X"; from Stage 2 it speaks the stage sentence (no reading).
function findRound(){
  S.item=pick();last=S.item;const u=resetStage();
  S.choices=shuffle([S.item,...distractors(S.item)]);tileButtons(S.choices,choose);
  u.pt.textContent="Tap the speaker";u.pt.classList.add("hidden-word");u.hint.textContent=S.settings.level>1?"He hears it, then taps the picture.":"He hears the word, then taps the picture.";
  S.prompt=S.item.stage>1?S.item.s:S.item.find;speak(S.prompt);
}
// Read it: read the words, tap the matching picture. Stage sets how long the text is.
function readRound(){
  S.item=pick();last=S.item;const u=resetStage();
  S.choices=shuffle([S.item,...distractors(S.item)]);tileButtons(S.choices,choose);
  u.pt.textContent=S.item.s;u.hint.textContent="He reads it and taps the matching picture. Speaker reads it aloud.";
  S.prompt=S.item.s;
}
function choose(btn,c){
  if(S.locked)return;
  const stat=S.today[S.mode];stat[1]++;
  const firstTry=!S.triedThisRound;S.triedThisRound=true;const ok=c===S.item;
  logEvent({mode:S.mode,level:S.settings.level,item:S.mode==="find"?S.prompt:S.item.s,target:S.item.w,cat:S.item.cat,choice:c.w,correct:ok,first_try:firstTry&&ok,...roundMeta(firstTry)});
  if(firstTry)srUpdate(S.item,ok,!ok);
  if(ok){
    markRight(btn);stat[0]++;win(1);if(firstTry)track(true);
    speak(praise()+" "+S.item.s,()=>{nextButtons(S.item.s);$("hint").textContent="Your turn: say \""+S.item.s.replace(/\.$/,"")+"\". Then tap Next.";speak((Math.random()<0.5?named("{n}, your turn.","Your turn."):"Your turn.")+" "+S.item.s)});
  }else{
    markWrong(btn);miss();if(firstTry)track(false);
    speak((Math.random()<0.4?named("Try again, {n}.","Try again."):"Try again.")+" "+S.prompt);
  }
}
// Say it: the app models it, the parent scores the echo. Never required to advance.
function sayRound(){
  S.item=pick();last=S.item;const u=resetStage();u.tiles.hidden=true;
  fillBig(u.big,S.item);u.pt.textContent=S.item.q;S.prompt=S.item.q;
  u.hint.textContent="Tap the speaker to hear the question. Model the answer, then give him time.";
  u.actions.append(mk("🔊 "+S.item.s.replace(/\.$/,""),"btn primary",()=>speak(S.item.s)),mk("✅ He said it","btn good",()=>scoreSay(2)),mk("👍 He tried","btn",()=>scoreSay(1)),mk("🖼️ Pointed or signed","btn",()=>scoreSay(1,"aac")),mk("Skip","btn soft",()=>newRound()));
  speak(S.item.q);
}
function scoreSay(n,how){
  const stat=S.today.say;stat[1]++;
  logEvent({mode:"say",level:S.settings.level,item:S.item.q,target:S.item.s,cat:S.item.cat,score:n,correct:n>0,first_try:n===2,choice:how||(n===2?"said":n===1?"tried":"skip")});
  track(n===2);
  if(n>0){stat[0]++;win(n);speak(praise()+" "+S.item.s,()=>afterRound())}else afterRound();
  persistToday();
}
// Ask it: WH questions on one scene.
function askRound(){
  const L=WH_LEVELS[S.settings.wh-1];const sc=bagDraw("scene",SCENES);last=sc;S.scene=sc;
  const type=L.types[Math.random()*L.types.length|0];S.wh=type;const u=resetStage();u.big.hidden=false;
  const answer=sc[type];
  if(L.ask){
    u.big.textContent=type==="how"?sc.pic+"❓":sc.pic.replace(answer.e,"❓");u.pt.textContent="Ask me";u.hint.textContent="Something is missing. He taps the question word that asks for it.";
    const others=shuffle(WH_ORDER.filter(t=>t!==type)).slice(0,2);S.choices=shuffle([type,...others]);
    for(const t of S.choices){const b=document.createElement("button");b.className="tile word";b.textContent=WH_WORD[t];b.onclick=()=>chooseWH(b,t===type,()=>{putImg(u.big,sc.img,sc.sentence,sc.pic+(type==="how"?sc.how.e:""));return WH_WORD[type]+" "+sc.a[type]});u.tiles.appendChild(b)}
    S.prompt="Something is missing. Ask me.";speak(S.prompt);return;
  }
  putImg(u.big,sc.img,sc.sentence,sc.pic+(type==="how"?sc.how.e:""));u.pt.textContent=sc.q[type];u.hint.textContent="He hears the question and taps the answer. Speaker repeats the question.";
  let pool=L.mixed?shuffle(WH_ORDER.filter(t=>t!==type).map(t=>sc[t])):shuffle(WH_POOL[type].filter(p=>p.e!==answer.e));
  const d=[];for(const p of pool){if(!d.some(x=>x.e===p.e)&&p.e!==answer.e)d.push(p);if(d.length===2)break}
  S.choices=shuffle([answer,...d]);
  for(const c of S.choices){const b=document.createElement("button");b.className="tile";b.textContent=c.e;b.setAttribute("aria-label",c.w);b.onclick=()=>chooseWH(b,c===answer,()=>sc.a[type]);u.tiles.appendChild(b)}
  S.prompt=sc.q[type];speak(S.prompt);
}
function chooseWH(btn,ok,answerText){
  if(S.locked)return;
  const stat=S.today.ask;stat[1]++;const firstTry=!S.triedThisRound;S.triedThisRound=true;const L=WH_LEVELS[S.settings.wh-1];
  logEvent({mode:"ask",wh:S.settings.wh,item:L.ask?"Ask me: "+S.wh+" ("+S.scene.sentence+")":S.scene.q[S.wh],target:L.ask?WH_WORD[S.wh]:S.scene[S.wh].w,choice:btn.textContent,correct:ok,first_try:firstTry&&ok,...roundMeta(firstTry)});
  if(ok){
    markRight(btn);stat[0]++;win(1);trackAsk(firstTry);const a=answerText();
    speak(praise()+" "+a,()=>{nextButtons(a,mk("Whole story","btn",()=>speak(S.scene.sentence)));$("hint").textContent="Your turn: say \""+a.replace(/\.$/,"")+"\". Then tap Next.";speak("Your turn. "+a)});
  }else{markWrong(btn);miss();trackAsk(false);speak("Try again. "+S.prompt)}
}
// Build a Sentence: tap the words in order. Each tap is spoken; the finished sentence is read back.
function buildRound(){
  S.item=pick();last=S.item;const u=resetStage();
  const words=S.item.s.replace(/[.?!]$/,"").split(" ");S.buildWords=words;S.buildPos=0;S.buildWrong=0;
  fillBig(u.big,S.item);u.pt.textContent="Build it";u.pt.classList.add("hidden-word");
  u.slots.hidden=false;for(const w of words){const s=document.createElement("div");s.className="slot";s.textContent="";s.dataset.w=w;u.slots.appendChild(s)}
  const others=stageItems(S.item.stage).filter(i=>i.id!==S.item.id).flatMap(i=>i.s.replace(/[.?!]$/,"").split(" ")).filter(w=>!words.includes(w));
  const extra=shuffle([...new Set(others)]).slice(0,words.length>=4?1:2);
  const tiles=shuffle(words.map((w,i)=>({w,i})).concat(extra.map(w=>({w,i:-1}))));
  u.tiles.style.gridTemplateColumns="repeat("+Math.min(tiles.length,4)+",1fr)";
  for(const t of tiles){const b=document.createElement("button");b.className="tile word";b.textContent=t.w;b.onclick=()=>buildTap(b,t);u.tiles.appendChild(b)}
  u.hint.textContent="Tap the words in order to build the sentence. The speaker reads the whole sentence.";
  S.prompt=S.item.s;speak(S.item.s);
}
function buildTap(btn,t){
  if(S.locked||btn.classList.contains("dim"))return;
  const want=S.buildWords[S.buildPos];
  speak(t.w);
  if(t.w===want){
    btn.classList.add("dim");const slot=$("slots").children[S.buildPos];slot.textContent=t.w;slot.classList.add("filled");S.buildPos++;
    if(S.buildPos===S.buildWords.length){
      const stat=S.today.build;stat[1]++;stat[0]++;const clean=S.buildWrong===0;
      logEvent({mode:"build",level:S.settings.level,item:S.item.s,target:S.item.w,cat:S.item.cat,correct:true,first_try:clean,choice:S.buildWrong+" wrong taps",...roundMeta(clean)});
      srUpdate(S.item,clean,false);track(clean);S.locked=true;win(clean?2:1);
      setTimeout(()=>speak(praise()+" "+S.item.s,()=>{nextButtons(S.item.s);$("hint").textContent="Your turn: say \""+S.item.s.replace(/\.$/,"")+"\". Then tap Next.";speak("Your turn. "+S.item.s)}),500);
    }
  }else{S.buildWrong++;markWrong(btn);if(S.buildWrong===1)miss()}
}
// What Happens Next: two steps shown, pick the third.
function nextRound(){
  const sq=bagDraw("seq",SEQUENCES);last=sq;S.seq=sq;const u=resetStage();
  const hide=S.settings.level>=4&&Math.random()<0.5?1:2;S.seqHide=hide;   // later: sometimes the middle step is missing
  u.pair.hidden=false;
  sq.steps.forEach((st,i)=>{
    if(i===hide){const q=document.createElement("div");q.className="arrow";q.textContent="❓";u.pair.appendChild(q);return}
    const f=document.createElement("figure");const d=document.createElement("div");putImg(d,"seq_"+sq.id+"_"+(i+1),st[0],"🖼️");f.appendChild(d.firstChild||d);const c=document.createElement("figcaption");c.textContent=(i+1)+". "+st[0];f.appendChild(c);u.pair.appendChild(f);
    if(i<2&&i+1!==hide){const a=document.createElement("div");a.className="arrow";a.textContent="→";u.pair.appendChild(a)}
  });
  u.pt.textContent=hide===2?"What happens next?":"What happens in the middle?";
  const answer={w:sq.steps[hide][0],img:"seq_"+sq.id+"_"+(hide+1),e:"🖼️",id:sq.id};
  const others=shuffle(SEQUENCES.filter(s=>s!==sq)).slice(0,2).map(s=>({w:s.steps[hide][0],img:"seq_"+s.id+"_"+(hide+1),e:"🖼️",id:s.id}));
  S.choices=shuffle([answer,...others]);S.answer=answer;
  tileButtons(S.choices,(b,c)=>{
    if(S.locked)return;const stat=S.today.next;stat[1]++;const firstTry=!S.triedThisRound;S.triedThisRound=true;const ok=c===answer;
    logEvent({mode:"next",level:S.settings.level,item:sq.name,target:answer.w,choice:c.w,correct:ok,first_try:firstTry&&ok,...roundMeta(firstTry)});
    if(ok){markRight(b);stat[0]++;win(1);const story=sq.steps.map(s=>s[0]).join(" ");speak(praise()+" "+answer.w,()=>{nextButtons(answer.w,mk("Whole story","btn",()=>speak(story)));$("hint").textContent="Your turn: say \""+answer.w.replace(/\.$/,"")+"\".";speak("Your turn. "+answer.w)})}
    else{markWrong(b);miss();speak("Try again. "+S.prompt)}
  },c=>c.w);
  u.hint.textContent=sq.name+". He looks at the steps and taps what comes "+(hide===2?"next":"in the middle")+".";
  S.prompt=u.pt.textContent;speak(S.prompt);
}
// Understand Feelings: "How does she feel?" (pick the word) or "Who is happy?" (pick the face).
function feelRound(){
  const u=resetStage();const who=FEEL_WHO[Math.random()*2|0];const f=bagDraw("feel",FEELINGS);last=f;
  const wordOf=x=>VOCAB.find(v=>v.id===x);
  const sentence=cap(who.w)+" feels "+f+".";
  if(Math.random()<0.5){
    // picture → word
    u.big.hidden=false;putImg(u.big,"feel_"+who.id+"_"+f,sentence,wordOf(f).e);
    u.pt.textContent="How does "+who.w+" feel?";
    const others=shuffle(FEELINGS.filter(x=>x!==f)).slice(0,2);S.choices=shuffle([f,...others]);
    for(const c of S.choices){const b=document.createElement("button");b.className="tile word";b.innerHTML="<span>"+wordOf(c).e+"</span><small>"+c+"</small>";b.onclick=()=>feelTap(b,c===f,sentence,f,c);u.tiles.appendChild(b)}
  }else{
    // word → picture
    u.pt.textContent="Who is "+f+"?";
    const others=shuffle(FEELINGS.filter(x=>x!==f)).slice(0,2);
    const mkc=(x,w)=>({w:x,img:"feel_"+w.id+"_"+x,e:wordOf(x).e,who:w});
    S.choices=shuffle([mkc(f,who),...others.map(x=>mkc(x,FEEL_WHO[Math.random()*2|0]))]);
    tileButtons(S.choices,(b,c)=>feelTap(b,c.w===f,cap(c.who.name)+" is "+f+".",f,c.w));
  }
  u.hint.textContent="Feelings. Name it together: happy, sad, angry, tired, scared, excited, hurt.";
  S.prompt=u.pt.textContent;speak(S.prompt);
}
function feelTap(btn,ok,answer,f,chosen){
  if(S.locked)return;const stat=S.today.feel;stat[1]++;const firstTry=!S.triedThisRound;S.triedThisRound=true;
  logEvent({mode:"feel",level:S.settings.level,item:S.prompt,target:f,choice:chosen,correct:ok,first_try:firstTry&&ok,...roundMeta(firstTry)});
  if(ok){markRight(btn);stat[0]++;win(1);speak(praise()+" "+answer,()=>{nextButtons(answer);$("hint").textContent="Your turn: say \""+answer.replace(/\.$/,"")+"\".";speak("Your turn. "+answer)})}
  else{markWrong(btn);miss();speak("Try again. "+S.prompt)}
}
// Follow Instructions: "Touch the ball." → "Touch the red ball." → "Touch the ball under the box." → two steps.
function doRound(){
  const u=resetStage();const st=S.settings.level;const v=id=>VOCAB.find(x=>x.id===id);
  let kind=st<=2?"object":st===3?"colour":st===4?"position":"two";
  if(st>=3&&Math.random()<0.3)kind="object";
  let choices,targets,line;
  if(kind==="object"||kind==="two"){
    const ids=shuffle(DO_OBJECTS.filter(id=>v(id))).slice(0,3);choices=ids.map(id=>({w:v(id).w,img:v(id).img,e:v(id).e,id}));
    if(kind==="two"){targets=[choices[0],choices[1]];line="Touch the "+targets[0].w+", then the "+targets[1].w+"."}else{targets=[choices[0]];line="Touch the "+targets[0].w+"."}
    choices=shuffle(choices);
  }else if(kind==="colour"){
    const cs=shuffle(DO_COLOURS.slice()).slice(0,2),obs=shuffle(["ball","cup"]);
    choices=shuffle([{c:cs[0],o:obs[0]},{c:cs[1],o:obs[0]},{c:cs[0],o:obs[1]}].map(x=>({w:x.c.c+" "+x.o,img:"c_"+x.c.c+"_"+x.o,e:x.c.e,id:x.c.c+x.o})));
    const t=choices.find(x=>x.id===cs[0].c+obs[0]);targets=[t];line="Touch the "+t.w+".";
  }else{
    const ps=shuffle(DO_POSITIONS.slice()).slice(0,3);choices=ps.map(p=>({w:"ball "+p.p,img:"pos_ball_"+p.id,e:"⚽"+p.e,id:p.id}));
    targets=[choices[0]];line="Touch the ball "+ps[0].p+".";choices=shuffle(choices);
  }
  S.doTargets=targets;S.doPos=0;S.doKind=kind;S.choices=choices;
  u.pt.textContent="Listen";u.pt.classList.add("hidden-word");u.hint.textContent="He listens and touches what the voice says"+(kind==="two"?", in order":"")+".";
  tileButtons(choices,(b,c)=>{
    if(S.locked)return;const want=S.doTargets[S.doPos];const firstTry=!S.triedThisRound;S.triedThisRound=true;
    if(c===want){
      b.classList.add("good");S.doPos++;
      if(S.doPos===S.doTargets.length){
        const stat=S.today.do;stat[1]++;stat[0]++;S.locked=true;[...$("tiles").children].forEach(x=>{if(!x.classList.contains("good"))x.classList.add("dim")});
        logEvent({mode:"do",level:st,item:line,target:targets.map(t=>t.w).join(", "),choice:c.w,correct:true,first_try:firstTry,...roundMeta(firstTry)});win(1);
        speak(praise()+" "+line.replace("Touch","You touched"),()=>nextButtons(line));
      }else speak("Now the "+S.doTargets[S.doPos].w+".");
    }else{
      if(firstTry){const stat=S.today.do;stat[1]++;logEvent({mode:"do",level:st,item:line,target:targets.map(t=>t.w).join(", "),choice:c.w,correct:false,first_try:false,...roundMeta(true)})}
      markWrong(b);miss();speak("Try again. "+line);
    }
  },kind==="object"||kind==="two"?null:null);
  S.prompt=line;speak(line);
}
function afterRound(){
  if(S.sessionEnd&&Date.now()>S.sessionEnd){endSession();return}
  if(S.streak>0&&S.streak%S.settings.streak===0)bubbleBreak();else newRound();
}

// ---------- Needs board ----------
function openNeeds(sub){
  const g=$("needGrid");g.innerHTML="";$("needs").hidden=false;$("needBack").hidden=!sub;$("needsTitle").textContent=sub?"I want…":"What do you need?";
  const list=sub?NEEDS.find(n=>n.id==="want").sub.map(id=>{const v=VOCAB.find(x=>x.id===id);return {id,label:v.w,e:v.e,img:v.img,say:"I want "+(v.cat==="actions"?"to "+v.w:v.cat==="objects"&&v.id==="bed"?"to go to bed":v.w)+"."}}):NEEDS;
  for(const n of list){
    const b=document.createElement("button");b.className="tile";
    if(n.img&&IMGS[n.img]){const im=document.createElement("img");im.src=IMGS[n.img];im.alt=n.label;b.appendChild(im)}else{const e=document.createElement("span");e.textContent=n.e;b.appendChild(e)}
    const l=document.createElement("span");l.className="lbl";l.textContent=n.label;b.appendChild(l);
    b.onclick=()=>{if(n.sub){openNeeds(true);return}b.classList.add("good");setTimeout(()=>b.classList.remove("good"),900);speak(n.say);logEvent({mode:"need",skill:"request",item:n.say,target:n.label,correct:true})};
    g.appendChild(b);
  }
}
$("needBtn").onclick=()=>{stopAll();openNeeds(false)};
$("needBack").onclick=()=>openNeeds(false);
$("needClose").onclick=()=>{$("needs").hidden=true;flushLog()};

// ---------- Bubble break ----------
let bubbleTimer=null;
function bubbleBreak(){
  $("celebText").textContent=S.settings.streak+" in a row"+(S.settings.name?", "+S.settings.name:"")+"!";
  $("celebrate").hidden=false;speak(named("Amazing, {n}! Pop the bubbles!","Amazing! Pop the bubbles!"));
  const box=$("bubbles");box.innerHTML="";const faces=["🐘","🐶","🐱","⭐","🎈","🍎","🚗","🐟","🦁","🎉"];let popped=0;const t0=Date.now();
  function spawn(){
    if(Date.now()-t0>20000){$("bubbleHint").textContent="Popped "+popped+"! Tap Keep going.";return}
    const b=document.createElement("button");b.className="bubble";b.textContent=faces[Math.random()*faces.length|0];
    b.style.left=(Math.random()*80+5)+"%";b.style.top="100%";b.style.animationDuration=(4+Math.random()*3)+"s";
    b.onclick=()=>{popped++;b.remove();$("bubbleHint").textContent="Popped "+popped+"!";speak("Pop!")};
    b.onanimationend=()=>b.remove();box.appendChild(b);bubbleTimer=setTimeout(spawn,700);
  }
  spawn();
}
$("celebNext").onclick=()=>{clearTimeout(bubbleTimer);$("bubbles").innerHTML="";$("celebrate").hidden=true;newRound()};

// ---------- Session ----------
function startSession(){SESSION=Date.now().toString(36);S.sessionEnd=S.settings.session?Date.now()+S.settings.session*60000:0}
function endSession(){
  const d=S.today;
  $("doneText").textContent="All done"+(S.settings.name?", "+S.settings.name:"")+"!";
  $("doneStats").textContent="⭐ "+S.stars+" today · "+MODE_IDS.filter(m=>d[m][1]).map(m=>MODE_LABEL[m]+" "+d[m][0]+"/"+d[m][1]).join(" · ");
  const rl=$("rewardLink");if(/^https?:\/\//.test(S.settings.reward)){rl.href=S.settings.reward;rl.hidden=false}else rl.hidden=true;
  flushLog();$("done").hidden=false;speak(named("All done, {n}! Great work today.","All done! Great work today."));
}
$("doneAgain").onclick=()=>{$("done").hidden=true;startSession();newRound()};
$("speak").onclick=()=>{S.replays=(S.replays||0)+1;if(S.prompt)speak(S.prompt)};

// ---------- Mode bar ----------
function renderModes(){
  const bar=$("modeBar");bar.innerHTML="";
  const shown=MODES.filter(m=>S.settings.modes.includes(m.id));if(!shown.length)shown.push(MODES[0]);
  for(const m of shown){const b=document.createElement("button");b.id="m-"+m.id;b.textContent=m.e+" "+m.label;b.setAttribute("aria-pressed",String(m.id===S.mode));b.onclick=()=>{S.mode=m.id;renderModes();newRound()};bar.appendChild(b)}
  if(!shown.some(m=>m.id===S.mode)){S.mode=shown[0].id;renderModes()}
}

// ---------- Settings ----------
function openSheet(){$("pinGate").hidden=false;$("settingsBody").hidden=true;$("pinIn").value="";$("sheet").hidden=false}
function showSettings(){
  $("pinGate").hidden=true;$("settingsBody").hidden=false;
  $("kidSel").innerHTML=Object.keys(KIDS).map(k=>`<option value="${k}" ${k===S.kid?"selected":""}>${KIDS[k].emoji} ${KIDS[k].name}</option>`).join("");$("reward").value=S.settings.reward;
  $("level").innerHTML=STAGES.map(L=>`<option value="${L.n}" ${L.n===S.settings.level?"selected":""}>Stage ${L.n}: ${L.name} (e.g. "${L.eg}")</option>`).join("");
  $("whLevel").innerHTML=WH_LEVELS.map(L=>`<option value="${L.n}" ${L.n===S.settings.wh?"selected":""}>Stage ${L.n}: ${L.name}</option>`).join("");
  $("autoLevel").value=String(S.settings.auto);$("sessionLen").value=String(S.settings.session);
  $("streakLen").value=String(S.settings.streak);$("rate").value=String(S.settings.rate);$("pinNew").value=S.settings.pin;$("voice").value=S.settings.voice;$("worldOn").value=String(KIDS[S.kid].world||0);
  $("modeChips").innerHTML=MODES.map(m=>`<label><input type="checkbox" data-mode="${m.id}" ${S.settings.modes.includes(m.id)?"checked":""}>${m.e} ${m.label}</label>`).join("");
  const cats={...VOCAB_CATS,legacy:"Picture sentences (jobs, I can, I am…)"};
  $("catChips").innerHTML=Object.entries(cats).map(([k,n])=>`<label><input type="checkbox" data-cat="${k}" ${S.settings.cats.includes(k)?"checked":""}>${n}</label>`).join("");
  $("cwCat").innerHTML=Object.entries(VOCAB_CATS).map(([k,n])=>`<option value="${k}">${n}</option>`).join("");
  renderMyWords();cwStagesPreview();
  const g=$("statGrid");g.innerHTML="<span></span><b>right</b><b>tries</b>"+MODE_IDS.map(k=>`<span>${MODE_LABEL[k]}</span><b>${S.today[k][0]}</b><b>${S.today[k][1]}</b>`).join("");
}
$("gear").onclick=openSheet;
$("pinGo").onclick=()=>{const v=$("pinIn").value.trim();if(!S.settings.pin){$("sheet").hidden=true;showSetup();return}if(v===S.settings.pin)showSettings();else{$("pinIn").value="";$("pinIn").placeholder="wrong code"}};
$("pinCancel").onclick=()=>$("sheet").hidden=true;
$("sheet").onclick=e=>{if(e.target===$("sheet"))$("sheet").hidden=true};
function saveGlobal(){const g={...S.settings};delete g.name;delete g.level;delete g.wh;delete g.auto;save("tt.settings",g)}
$("saveSettings").onclick=()=>{
  const pin=$("pinNew").value.trim();
  const modes=[...document.querySelectorAll("#modeChips input:checked")].map(i=>i.dataset.mode);
  const cats=[...document.querySelectorAll("#catChips input:checked")].map(i=>i.dataset.cat);
  S.settings={...S.settings,reward:$("reward").value.trim(),streak:+$("streakLen").value,rate:+$("rate").value,level:+$("level").value,wh:+$("whLevel").value,auto:+$("autoLevel").value,session:+$("sessionLen").value,voice:$("voice").value,pin:/^\d{4}$/.test(pin)?pin:S.settings.pin,modes:modes.length?modes:["find"],cats:cats.length?cats:["food"]};
  KIDS[S.kid].world=+$("worldOn").value;if(window.worldKidChanged)worldKidChanged();
  saveGlobal();syncKid();S.recent=[];S.recentAsk=[];$("sheet").hidden=true;renderModes();startSession();newRound();
};
$("resetToday").onclick=()=>{S.today=freshToday();S.stars=0;S.streak=0;setStars();persistToday();showSettings()};
let startOverArmed=0;
$("startOver").onclick=async()=>{
  const b=$("startOver"),note=$("startOverNote"),name=KIDS[S.kid].name;
  if(!startOverArmed){startOverArmed=setTimeout(()=>{startOverArmed=0;b.textContent="Start over for this child";note.hidden=true},6000);b.textContent="Tap again to erase everything for "+name;note.hidden=false;note.textContent="Stage, stars and the progress-page history for "+name+" will all go back to zero.";return}
  clearTimeout(startOverArmed);startOverArmed=0;b.textContent="Start over for this child";b.disabled=true;
  KIDS[S.kid]=JSON.parse(JSON.stringify(KIDS_DEFAULT[S.kid]||KIDS[S.kid]));KIDS[S.kid].v4=1;save("tt.kids",KIDS);
  for(let i=QUEUE.length-1;i>=0;i--)if(QUEUE[i].kid===S.kid)QUEUE.splice(i,1);save("tt.queue",QUEUE);
  loadKid(S.kid);setStars();setLevelBadge();
  let cloud="History on the progress page is cleared too.";
  try{const r=await fetch("api/reset",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pin:S.settings.pin,kid:S.kid})});if(!r.ok)cloud="Could not clear the progress page (code "+r.status+"). Use the reset link on that page."}
  catch(e){cloud="No internet, so the progress page was not cleared. Use the reset link on that page later."}
  b.disabled=false;note.hidden=false;note.textContent=name+" is back at the start on this iPad. "+cloud+" Other iPads keep their own stage until you reset there.";showSettings();
};
$("kidSel").onchange=()=>{syncKid();loadKid($("kidSel").value);setStars();setLevelBadge();$("whoBtn").textContent=KIDS[S.kid].emoji+" "+KIDS[S.kid].name;showSettings()};

// ---------- My words (parent builder) ----------
let cwPhotoBlob=null,cwAudioBlob=null,cwAudioType="";
function renderMyWords(){
  const box=$("myWords");box.innerHTML="";
  if(!CUSTOM.length){box.innerHTML='<p>No words added yet.</p>';return}
  for(const c of CUSTOM){
    const row=document.createElement("div");row.className="w";
    if(c.img&&IMGS[c.img]){const im=document.createElement("img");im.src=IMGS[c.img];row.appendChild(im)}else{const e=document.createElement("span");e.textContent=c.e||"⭐";e.style.flex="0";row.appendChild(e)}
    const s=document.createElement("span");s.textContent=c.w+" · "+(VOCAB_CATS[c.cat]||c.cat)+(c.audio?" · 🎙️":"");row.appendChild(s);
    row.appendChild(mk("Remove","",async()=>{if(!confirm("Remove "+c.w+"?"))return;await fetch("api/vocab",{method:"DELETE",headers:{"content-type":"application/json"},body:JSON.stringify({pin:S.settings.pin,id:c.id})});await loadCustom();renderMyWords()}));
    box.appendChild(row);
  }
}
function cwStagesPreview(){
  const w=$("cwWord").value.trim();const box=$("cwStages");
  if(!w){box.innerHTML="";return}
  const t=(STAGE_TPL[$("cwCat").value]||STAGE_TPL.objects)(w);
  box.innerHTML='<p>Sentences it grows into (edit if you like):</p>'+t.map((s,i)=>`<input class="cwSt" data-i="${i}" value="${s.replace(/"/g,"&quot;")}" style="margin-top:6px">`).join("");
}
$("cwWord").oninput=cwStagesPreview;$("cwCat").onchange=cwStagesPreview;
$("cwPhoto").onchange=async()=>{
  const f=$("cwPhoto").files[0];if(!f)return;
  try{const bmp=await createImageBitmap(f);const s=512;const c=document.createElement("canvas");const r=Math.min(1,s/Math.max(bmp.width,bmp.height));c.width=Math.round(bmp.width*r);c.height=Math.round(bmp.height*r);c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
    cwPhotoBlob=await new Promise(res=>c.toBlob(res,"image/jpeg",0.85));$("cwPhotoBox").innerHTML='<img src="'+URL.createObjectURL(cwPhotoBlob)+'">'}catch(e){cwPhotoBlob=f;$("cwPhotoBox").textContent="✅"}
};
let rec=null;
$("cwRec").onclick=async()=>{
  const b=$("cwRec");
  if(rec&&rec.state==="recording"){rec.stop();return}
  if(!navigator.mediaDevices||!window.MediaRecorder){$("cwNote").hidden=false;$("cwNote").textContent="Recording is not available in this browser. The iPad voice will read the word.";return}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});const chunks=[];
    rec=new MediaRecorder(stream);cwAudioType=rec.mimeType||"audio/mp4";
    rec.ondataavailable=e=>chunks.push(e.data);
    rec.onstop=()=>{stream.getTracks().forEach(t=>t.stop());cwAudioBlob=new Blob(chunks,{type:cwAudioType});b.textContent="🎙️ Recorded ✓ (tap to redo)";};
    rec.start();b.textContent="⏹ Stop";setTimeout(()=>{if(rec&&rec.state==="recording")rec.stop()},4000);
  }catch(e){$("cwNote").hidden=false;$("cwNote").textContent="Microphone not allowed."}
};
const toB64=blob=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result.split(",")[1]);fr.readAsDataURL(blob)});
$("cwSave").onclick=async()=>{
  const w=$("cwWord").value.trim(),note=$("cwNote");note.hidden=false;
  if(!w){note.textContent="Type the word first.";return}
  const id=w.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,30)||("w"+Date.now());
  $("cwSave").disabled=true;note.textContent="Saving…";
  try{
    let img=null,audio=null;
    if(cwPhotoBlob){const r=await fetch("api/upload",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pin:S.settings.pin,name:"cw_"+id,type:cwPhotoBlob.type||"image/jpeg",data:await toB64(cwPhotoBlob)})});if(r.ok)img="cw_"+id;else throw new Error("photo "+r.status)}
    if(cwAudioBlob){const mt=(cwAudioType||"audio/mp4").split(";")[0];const r=await fetch("api/upload",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pin:S.settings.pin,name:"ca_"+id,type:mt,data:await toB64(cwAudioBlob)})});if(r.ok)audio=(await r.json()).url}
    const st=[...document.querySelectorAll(".cwSt")].map(i=>i.value.trim());
    const r=await fetch("api/vocab",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pin:S.settings.pin,word:{id,w,e:"⭐",cat:$("cwCat").value,st,img,audio,tip:$("cwTip").value.trim()}})});
    if(!r.ok)throw new Error("save "+r.status);
    note.textContent="Added "+w+". It is in play in every activity.";
    $("cwWord").value="";$("cwTip").value="";$("cwStages").innerHTML="";cwPhotoBlob=null;cwAudioBlob=null;$("cwPhotoBox").textContent="📷";$("cwRec").textContent="🎙️ Record the word";
    const im=await fetch("api/images").then(r=>r.json()).catch(()=>null);if(im){IMGS=im;save("tt.imgs",im)}
    await loadCustom();renderMyWords();
  }catch(e){note.textContent="Could not save ("+e.message+"). Check the parent code matches Vercel and try again."}
  $("cwSave").disabled=false;
};
function refreshCustomAudio(){for(const k in CUSTOM_AUDIO)delete CUSTOM_AUDIO[k];for(const c of CUSTOM)if(c.audio)CUSTOM_AUDIO[c.w.toLowerCase()]=c.audio}
const _buildItems=buildItems;buildItems=function(){_buildItems();refreshCustomAudio()};buildItems();

// ---------- Child picker and boot ----------
function showPicker(){
  $("whoBtns").innerHTML="";
  for(const id in KIDS){const b=mk(KIDS[id].emoji+" "+KIDS[id].name,"btn primary",()=>{syncKid();loadKid(id);setStars();$("whoPick").hidden=true;$("whoBtn").textContent=KIDS[id].emoji+" "+KIDS[id].name;startSession();speak(named("Hello {n}! Let's play.","Listen."),()=>newRound())});b.style.fontSize="2rem";b.style.padding="28px 40px";$("whoBtns").appendChild(b)}
  $("whoPick").hidden=false;
}
$("whoBtn").onclick=showPicker;
const lastKid=load("tt.kid",null);loadKid(KIDS[lastKid]?lastKid:Object.keys(KIDS)[0]);
$("whoBtn").textContent=KIDS[S.kid].emoji+" "+KIDS[S.kid].name;
setStars();startSession();renderModes();newRound();
function showSetup(){$("setup").hidden=false;setTimeout(()=>$("setupPin").focus(),50)}
$("setupGo").onclick=()=>{const v=$("setupPin").value.trim();if(!/^\d{4}$/.test(v)){$("setupErr").hidden=false;return}S.settings.pin=v;saveGlobal();$("setup").hidden=true;showPicker()};
$("setupPin").addEventListener("keydown",e=>{if(e.key==="Enter")$("setupGo").click()});
if(/^\d{4}$/.test(S.settings.pin))showPicker();else showSetup();
