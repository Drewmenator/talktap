// My World: avatar dress-up, a room to decorate, and a star shop. Stars come only from playing TalkTap
// (KIDS[kid].wallet, added in win()). Built in a shadow root so its styles and ids never clash with the app.
// Uses TalkTap's KIDS, S, save, speak and stopAll.
(()=>{
const WORLD_CSS="/* My World lives in a shadow root, so these rules never touch TalkTap and TalkTap's never touch these. */\n:host{--chip:#f3f8ff;--shade:rgba(29,43,58,.45);position:fixed;inset:0;z-index:7;overflow:auto;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:16px;\n  padding:calc(12px + env(safe-area-inset-top,0px)) 16px calc(20px + env(safe-area-inset-bottom,0px));box-sizing:border-box;-webkit-user-select:none;user-select:none;overscroll-behavior:contain}\n@media (prefers-color-scheme:dark){:host{--chip:#22344a;--shade:rgba(0,0,0,.6)}}\n*,*::before,*::after{box-sizing:border-box}\n[hidden]{display:none!important}\nbutton{font:inherit;color:inherit;cursor:pointer;border:0;background:none;touch-action:manipulation}\nbutton:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.close{font-family:var(--display);font-weight:600;font-size:1.1rem;background:var(--panel);border:3px solid var(--tile-edge);padding:8px 16px;border-radius:999px}\n.top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;max-width:1180px;margin:0 auto 14px}\n.top h1{font-family:var(--display);font-weight:700;font-size:clamp(1.5rem,3.4vw,2.1rem);margin:0;text-wrap:balance}\n.top .spacer{flex:1}\n.stars{font-family:var(--display);font-weight:700;font-size:1.35rem;background:var(--panel);padding:8px 16px;border-radius:999px;font-variant-numeric:tabular-nums;display:inline-flex;gap:6px;align-items:center;transition:transform .25s}\n.stars.bump{transform:scale(1.15)}\n\n.wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:18px;max-width:1180px;margin:0 auto}\n@media (max-width:820px){.wrap{grid-template-columns:1fr}}\n\n/* Stage */\n.stage{position:relative;border-radius:28px;overflow:hidden;min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:78px 16px 16px;transition:background .4s}\n.stage .decor{position:absolute;inset:0;pointer-events:none;font-size:clamp(2.2rem,5vw,3.2rem)}\n.stage .decor span{position:absolute}\n.stage svg.avatar{position:relative;width:min(100%,330px);height:auto;filter:drop-shadow(0 8px 10px rgba(0,0,0,.12))}\n.bubble{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:#fff;color:#1d2b3a;font-family:var(--display);font-weight:600;font-size:clamp(1.05rem,2.6vw,1.35rem);padding:10px 18px;border-radius:20px;box-shadow:0 4px 0 rgba(0,0,0,.08);max-width:88%;text-align:center;z-index:2}\n.bubble::after{content:\"\";position:absolute;bottom:-10px;left:50%;margin-left:-10px;border:10px solid transparent;border-top-color:#fff;border-bottom:0}\n.tell{position:relative;z-index:2;margin-top:10px;background:var(--accent);color:var(--accent-ink);font-family:var(--display);font-weight:600;font-size:1.2rem;padding:12px 22px;border-radius:999px;box-shadow:0 5px 0 #c96200}\n.tell:active{transform:translateY(3px);box-shadow:0 2px 0 #c96200}\n\n/* Room: things are placed by % and sized in room-width units, so the layout scales with the room */\n.room{position:relative;width:100%;aspect-ratio:4/3;border-radius:22px;overflow:hidden;container-type:inline-size;touch-action:none;box-shadow:0 6px 0 rgba(0,0,0,.08)}\n.room .wall{position:absolute;inset:0 0 34% 0}\n.room .floor{position:absolute;inset:66% 0 0 0;border-top:6px solid rgba(255,255,255,.75)}\n.thing{position:absolute;transform:translate(-50%,-100%);line-height:1;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;filter:drop-shadow(0 3px 2px rgba(0,0,0,.15))}\n.thing.me svg{display:block;width:21cqw;height:auto}\n.thing.sel{outline:3px dashed var(--accent);outline-offset:3px;border-radius:12px}\n.thing .x{position:absolute;top:-16px;right:-16px;width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;font:700 16px/34px var(--body);text-align:center;box-shadow:0 3px 0 #c96200}\n.rt{width:100%;height:130px;border-radius:14px;display:grid;place-items:center;font-size:64px;background:#f3f8ff}\n\n/* Panel */\n.panel{background:var(--panel);border-radius:28px;padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}\n.tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;background:var(--chip);padding:6px;border-radius:999px}\n.tabs button{font-family:var(--display);font-weight:600;font-size:clamp(.95rem,2.2vw,1.15rem);white-space:nowrap;padding:10px;border-radius:999px;color:var(--muted)}\n.tabs button[aria-pressed=\"true\"]{background:var(--accent);color:var(--accent-ink)}\n.cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}\n.cats button{white-space:nowrap;font-weight:800;font-size:.95rem;padding:8px 14px;border-radius:999px;background:var(--chip);border:2px solid var(--tile-edge)}\n.cats button[aria-pressed=\"true\"]{border-color:var(--accent);color:var(--accent)}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}\n.item{position:relative;background:var(--tile);border:3px solid var(--tile-edge);border-radius:20px;padding:6px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:2px;transition:transform .12s,border-color .2s}\n.item:active{transform:scale(.96)}\n.item svg{width:100%;height:130px;border-radius:14px}\n.item .nm{font-weight:800;font-size:.88rem;text-align:center;line-height:1.15;min-height:2.3em;display:flex;align-items:center}\n.item.on{border-color:var(--good)}\n.item.on::after{content:\"✓\";position:absolute;top:6px;right:8px;background:var(--good);color:#fff;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:800}\n.price{position:absolute;top:6px;left:6px;background:var(--star);color:#5a3d00;font-family:var(--display);font-weight:700;font-size:.95rem;padding:2px 9px;border-radius:999px}\n.owned{position:absolute;top:6px;left:6px;background:var(--good);color:#fff;font-weight:800;font-size:.75rem;padding:3px 8px;border-radius:999px}\n.item.locked svg{opacity:.85}\n.more{font-weight:800;color:var(--muted);text-align:center;padding:8px}\n.more button{color:var(--accent);font-weight:800;text-decoration:underline}\n\n/* Buy sheet */\n.sheet{position:fixed;inset:0;background:var(--shade);display:grid;place-items:center;padding:16px;z-index:10}\n.card{background:var(--panel);border-radius:28px;padding:22px;width:min(380px,100%);text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;animation:pop .25s ease-out}\n.card svg{width:180px;height:auto;border-radius:18px}\n.card h2{font-family:var(--display);font-weight:600;font-size:1.5rem;margin:0;text-wrap:balance}\n.card p{margin:0;color:var(--muted);font-weight:700}\n.card .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}\n.btn{font-family:var(--display);font-weight:600;font-size:1.15rem;padding:12px 20px;border-radius:999px;background:var(--chip);border:2px solid var(--tile-edge)}\n.btn.buy{background:var(--accent);color:var(--accent-ink);border-color:transparent;box-shadow:0 5px 0 #c96200}\n@keyframes pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}\n\n.burst{position:fixed;pointer-events:none;font-size:1.8rem;z-index:20;animation:fly 1s ease-out forwards}\n@keyframes fly{to{transform:translate(var(--dx),var(--dy)) rotate(200deg);opacity:0}}\n@media (prefers-reduced-motion:reduce){.burst{display:none}.card{animation:none}.stars{transition:none}}\n";
const host=document.createElement("div");host.id="world";host.hidden=true;host.setAttribute("role","dialog");host.setAttribute("aria-label","My World");
document.body.appendChild(host);
const root=host.attachShadow({mode:"open"});
root.innerHTML="<style>"+WORLD_CSS+"</style>"+"<header class=\"top\">\n  <h1 id=\"title\">My World</h1>\n  <span class=\"spacer\"></span>\n  <span class=\"stars\" id=\"stars\" aria-live=\"polite\">⭐ <b id=\"starN\">0</b></span>\n  <button class=\"close\" id=\"close\" type=\"button\">✕ Back</button>\n</header>\n<main class=\"wrap\">\n  <section class=\"stage\" id=\"stage\" aria-label=\"Avatar\">\n    <div class=\"decor\" id=\"decor\"></div>\n    <div class=\"bubble\" id=\"bubble\"></div>\n    <div id=\"avatarBox\"></div>\n    <div class=\"room\" id=\"room\" hidden></div>\n    <button class=\"tell\" id=\"tell\" type=\"button\">🔊 Tell me</button>\n  </section>\n  <section class=\"panel\">\n    <div class=\"tabs\" role=\"group\" aria-label=\"Dress up, my room or shop\">\n      <button id=\"t-dress\" type=\"button\" aria-pressed=\"true\">👗 Dress up</button>\n      <button id=\"t-room\" type=\"button\" aria-pressed=\"false\">🏠 My room</button>\n      <button id=\"t-shop\" type=\"button\" aria-pressed=\"false\">🛍️ Star shop</button>\n    </div>\n    <div class=\"cats\" id=\"cats\" role=\"group\" aria-label=\"What to change\"></div>\n    <div class=\"grid\" id=\"grid\"></div>\n    <div class=\"more\" id=\"more\"></div>\n  </section>\n</main>\n<div class=\"sheet\" id=\"sheet\" hidden><div class=\"card\" id=\"sheetCard\"></div></div>\n";

// ---------- Items ----------
const SKIN=[["#fbe0c9","light"],["#efc29b","tan"],["#c98f62","brown"],["#8d5a3b","dark brown"],["#5e3a26","deep brown"]];
const CATS=[
  {id:"clothes",label:"👗 Clothes"},{id:"hair",label:"💇 Hair"},{id:"hcol",label:"🎨 Hair colour"},{id:"face",label:"😊 Face"},{id:"eyes",label:"👀 Eyes"},
  {id:"extra",label:"👑 Extras"},{id:"pet",label:"🐾 Pets"},{id:"place",label:"🏞️ Places"},{id:"furn",label:"🛋️ Furniture"},{id:"toy",label:"🧸 Toys"},{id:"wall",label:"🖌️ Walls"},{id:"floor",label:"🟫 Floors"},{id:"skin",label:"🙂 Skin"}];
const ITEMS=[
  // clothes: kind tee | dress | hoodie | gown
  {id:"tee-yellow",cat:"clothes",kind:"tee",color:"#ffc53d",name:"yellow T-shirt",say:"a yellow T-shirt",price:0},
  {id:"dress-blue",cat:"clothes",kind:"dress",color:"#4aa3ff",name:"blue dress",say:"a blue dress",price:0},
  {id:"dress-red",cat:"clothes",kind:"dress",color:"#ef4b4b",name:"red dress",say:"a red dress",price:5},
  {id:"hoodie-green",cat:"clothes",kind:"hoodie",color:"#34b56b",name:"green hoodie",say:"a green hoodie",price:5},
  {id:"dress-pink",cat:"clothes",kind:"dress",color:"#ff7eb6",name:"pink dress",say:"a pink dress",price:6},
  {id:"dress-rainbow",cat:"clothes",kind:"dress",color:"rainbow",name:"rainbow dress",say:"a rainbow dress",price:10},
  {id:"gown-purple",cat:"clothes",kind:"gown",color:"#9b6bff",name:"princess dress",say:"a purple princess dress",price:12},
  // hair styles
  {id:"puffs",cat:"hair",name:"puffs",price:0},{id:"long",cat:"hair",name:"long hair",price:0},{id:"short",cat:"hair",name:"short hair",price:0},
  {id:"bun",cat:"hair",name:"bun",price:4},{id:"braids",cat:"hair",name:"braids",price:5},{id:"curly",cat:"hair",name:"curly hair",price:6},
  // hair colours
  {id:"black",cat:"hcol",color:"#2a1f1a",name:"black",price:0},{id:"brown",cat:"hcol",color:"#6b4128",name:"brown",price:0},
  {id:"blonde",cat:"hcol",color:"#e2b04a",name:"blonde",price:0},{id:"ginger",cat:"hcol",color:"#c0532e",name:"ginger",price:3},
  {id:"pinkhair",cat:"hcol",color:"#ff7eb6",name:"pink",price:4},{id:"purplehair",cat:"hcol",color:"#9b6bff",name:"purple",price:4},
  {id:"bluehair",cat:"hcol",color:"#4aa3ff",name:"blue",price:5},
  // faces (feelings)
  {id:"happy",cat:"face",name:"happy",price:0},{id:"calm",cat:"face",name:"calm",price:0},
  {id:"excited",cat:"face",name:"excited",price:3},{id:"surprised",cat:"face",name:"surprised",price:3},
  {id:"silly",cat:"face",name:"silly",price:4},{id:"sleepy",cat:"face",name:"sleepy",price:4},
  // eye colours
  {id:"e-brown",cat:"eyes",color:"#7a4a2a",name:"brown",price:0},{id:"e-dark",cat:"eyes",color:"#3b2416",name:"dark brown",price:0},
  {id:"e-green",cat:"eyes",color:"#3fae6a",name:"green",price:3},{id:"e-blue",cat:"eyes",color:"#3d8fe0",name:"blue",price:3},
  {id:"e-purple",cat:"eyes",color:"#9b6bff",name:"purple",price:5},{id:"e-pink",cat:"eyes",color:"#ff6fae",name:"pink",price:5},
  // extras
  {id:"noextra",cat:"extra",name:"nothing",price:0},{id:"bow",cat:"extra",name:"red bow",say:"a red bow",price:0},
  {id:"flower",cat:"extra",name:"flower",say:"a flower",price:4},{id:"cap",cat:"extra",name:"blue cap",say:"a blue cap",price:4},
  {id:"glasses",cat:"extra",name:"sunglasses",say:"sunglasses",price:5},{id:"crown",cat:"extra",name:"crown",say:"a crown",price:8},
  // pets
  {id:"nopet",cat:"pet",name:"no pet",price:0},{id:"cat",cat:"pet",e:"🐱",name:"cat",say:"a cat",price:6},
  {id:"puppy",cat:"pet",e:"🐶",name:"puppy",say:"a puppy",price:6},{id:"bunny",cat:"pet",e:"🐰",name:"bunny",say:"a bunny",price:8},
  {id:"unicorn",cat:"pet",e:"🦄",name:"unicorn",say:"a unicorn",price:15},
  // room: furniture (big = things can sit on it; hang = goes on the wall), toys, walls, floors
  {id:"bed",cat:"furn",e:"🛏️",name:"bed",say:"a bed",size:26,big:1,price:0},
  {id:"window",cat:"furn",e:"🪟",name:"window",say:"a window",size:15,hang:1,price:0},
  {id:"chair",cat:"furn",e:"🪑",name:"chair",say:"a chair",size:13,big:1,price:0},
  {id:"plant",cat:"furn",e:"🪴",name:"plant",say:"a plant",size:12,price:3},
  {id:"picture",cat:"furn",e:"🖼️",name:"picture",say:"a picture",size:12,hang:1,price:3},
  {id:"mirror",cat:"furn",e:"🪞",name:"mirror",say:"a mirror",size:12,hang:1,price:4},
  {id:"balloons",cat:"furn",e:"🎈",name:"balloon",say:"a balloon",size:10,price:4},
  {id:"sofa",cat:"furn",e:"🛋️",name:"sofa",say:"a sofa",size:26,big:1,price:5},
  {id:"tv",cat:"furn",e:"📺",name:"TV",say:"a TV",size:15,price:6},
  {id:"tent",cat:"furn",e:"⛺",name:"tent",say:"a tent",size:24,price:6},
  {id:"piano",cat:"furn",e:"🎹",name:"piano",say:"a piano",size:20,big:1,price:8},
  {id:"teddy",cat:"toy",e:"🧸",name:"teddy",say:"a teddy",size:9,price:0},
  {id:"ball",cat:"toy",e:"⚽",name:"ball",say:"a ball",size:7,price:2},
  {id:"cupcake",cat:"toy",e:"🧁",name:"cupcake",say:"a cupcake",size:7,price:3},
  {id:"books",cat:"toy",e:"📚",name:"books",say:"some books",size:8,price:3},
  {id:"robot",cat:"toy",e:"🤖",name:"robot",say:"a robot",size:8,price:4},
  {id:"doll",cat:"toy",e:"🪆",name:"doll",say:"a doll",size:8,price:4},
  {id:"rocket",cat:"toy",e:"🚀",name:"rocket",say:"a rocket",size:9,price:5},
  {id:"dino",cat:"toy",e:"🦕",name:"dinosaur",say:"a dinosaur",size:11,price:6},
  {id:"w-lilac",cat:"wall",name:"lilac walls",bg:"#e6dcff",line:"My walls are lilac.",price:0},
  {id:"w-mint",cat:"wall",name:"mint walls",bg:"#d4f3e4",line:"My walls are green.",price:0},
  {id:"w-stripes",cat:"wall",name:"pink stripes",bg:"repeating-linear-gradient(90deg,#ffd9e8 0 22px,#ffc2da 22px 44px)",line:"My walls have pink stripes.",price:3},
  {id:"w-stars",cat:"wall",name:"star walls",bg:"radial-gradient(circle,#fff6b0 2px,transparent 3.5px) 0 0/30px 30px,#c9d6ff",line:"My walls have stars.",price:5},
  {id:"w-rainbow",cat:"wall",name:"rainbow walls",bg:"linear-gradient(#ffb8c6,#ffd9ab,#fff3b0,#c9f0c4,#c0e2ff,#ddcaff)",line:"My walls are a rainbow.",price:8},
  {id:"f-wood",cat:"floor",name:"wood floor",bg:"repeating-linear-gradient(90deg,#dcaa72 0 46px,#c8925a 46px 48px)",line:"My floor is wood.",price:0},
  {id:"f-pink",cat:"floor",name:"pink carpet",bg:"#ffc6dd",line:"My floor is a pink carpet.",price:3},
  {id:"f-checks",cat:"floor",name:"blue checks",bg:"conic-gradient(#ffffff 25%,#c3e2ff 0 50%,#ffffff 0 75%,#c3e2ff 0) 0 0/36px 36px",line:"My floor has blue checks.",price:4},
  {id:"f-grass",cat:"floor",name:"grass",bg:"repeating-linear-gradient(90deg,#94d97f 0 6px,#80cc6c 6px 12px)",line:"My floor is grass.",price:5},
  // places (the "where" words from Ask it)
  {id:"bedroom",cat:"place",name:"bedroom",say:"in her bedroom",bg:"linear-gradient(#e9dcff,#d6c4ff)",decor:[["🛏️",6,70],["🧸",82,74],["🖼️",10,8]],price:0},
  {id:"park",cat:"place",name:"park",say:"at the park",bg:"linear-gradient(#bfe6ff 0 60%,#9bdc8c 60%)",decor:[["🌳",4,40],["🌼",84,80],["☁️",72,6]],price:5},
  {id:"beach",cat:"place",name:"beach",say:"at the beach",bg:"linear-gradient(#aee3ff 0 52%,#5fc4ef 52% 64%,#f6dc9c 64%)",decor:[["☀️",80,6],["🏖️",6,74],["🐚",84,82]],price:7},
  {id:"castle",cat:"place",name:"castle",say:"at the castle",bg:"linear-gradient(#ffd6ec,#e4c9ff)",decor:[["🏰",4,52],["✨",80,10],["🌈",8,6]],price:12},
];
SKIN.forEach(([c,n],i)=>ITEMS.push({id:"skin"+i,cat:"skin",color:c,name:n,price:0}));
const BY=Object.fromEntries(ITEMS.map(i=>[i.id,i]));

// ---------- State (per child, saved inside KIDS so it stays with the child's profile) ----------
const K=()=>KIDS[S.kid];
const NAME=()=>K().name;
const PRO=()=>K().pron==="he"?"He":"She";
const HIS=()=>K().pron==="he"?"his":"her";
const START={look:{clothes:"tee-yellow",hair:"puffs",hcol:"black",extra:"bow",pet:"nopet",place:"bedroom",skin:"skin2",face:"happy",eyes:"e-brown"},
  room:{wall:"w-lilac",floor:"f-wood",items:[{u:1,id:"window",x:72,y:42},{u:2,id:"bed",x:27,y:92},{u:3,id:"teddy",x:22,y:72},{u:4,id:"me",x:60,y:98}]}};
let W=null;
function loadW(){
  const k=K();if(!k.avatar)k.avatar=JSON.parse(JSON.stringify({...START,owned:[]}));W=k.avatar;
  if(!W.room)W.room=JSON.parse(JSON.stringify(START.room));
  for(const i of ITEMS)if(!i.price&&!W.owned.includes(i.id))W.owned.push(i.id);
  if(typeof k.wallet!=="number")k.wallet=0;
}
const persist=()=>save("tt.kids",KIDS);
let tab="dress",cat="clothes",fromDone=false;

// ---------- Avatar drawing (one SVG, layered; big head, big eyes, small body) ----------
let gid=0;
function shade(hex,amt){ // darken (amt<0) or lighten (amt>0) a #rrggbb colour
  const n=parseInt(hex.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(c+(amt<0?c:255-c)*amt)));
  return "#"+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
function eyeOpen(cx,cy,iris,flip){
  const d=flip?-1:1,ink="#2a1830";
  return `<ellipse cx="${cx}" cy="${cy}" rx="15" ry="18" fill="#fff"/>`+
    `<ellipse cx="${cx}" cy="${cy+2}" rx="12" ry="15" fill="${iris}"/>`+
    `<ellipse cx="${cx}" cy="${cy+7}" rx="10" ry="7" fill="${shade(iris,.35)}" opacity=".7"/>`+
    `<ellipse cx="${cx}" cy="${cy+2}" rx="6.5" ry="8.5" fill="${ink}"/>`+
    `<circle cx="${cx+4*d}" cy="${cy-5}" r="5" fill="#fff"/><circle cx="${cx-4*d}" cy="${cy+8}" r="2.4" fill="#fff"/>`+
    `<path d="M${cx-17*d} ${cy-6} Q${cx} ${cy-26} ${cx+16*d} ${cy-8}" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`+
    `<path d="M${cx-15*d} ${cy-9} L${cx-22*d} ${cy-15} M${cx-11*d} ${cy-13} L${cx-16*d} ${cy-21}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
}
function eyeShut(cx,cy,flip,happy){
  const d=flip?-1:1,ink="#2a1830";
  return happy?`<path d="M${cx-13} ${cy+4} Q${cx} ${cy-12} ${cx+13} ${cy+4}" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
              :`<path d="M${cx-13} ${cy} Q${cx} ${cy+11} ${cx+13} ${cy}" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M${cx-13*d} ${cy} L${cx-19*d} ${cy-4}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
}
function avatarSVG(look,opts={}){
  const g="g"+(++gid);
  const skin=BY[look.skin].color,hc=BY[look.hcol].color,cl=BY[look.clothes],hair=look.hair,ex=look.extra,pet=BY[look.pet];
  const iris=BY[look.eyes].color,face=look.face;
  const fill=cl.color==="rainbow"?`url(#${g}r)`:cl.color,dark=cl.color==="rainbow"?"#7a4fd6":shade(cl.color,-.18);
  const hdark=shade(hc,-.25),hlite=shade(hc,.45),sdark=shade(skin,-.12);
  const vb=!opts.thumb?"0 -12 220 302":opts.zoom==="head"?"20 -10 180 188":"0 -12 220 302";
  let s=`<svg class="${opts.thumb?"":"avatar"}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opts.label||NAME()+"'s avatar"}">
  <defs><linearGradient id="${g}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b8b"/><stop offset=".2" stop-color="#ffa64d"/><stop offset=".4" stop-color="#ffe066"/><stop offset=".6" stop-color="#6fdc8c"/><stop offset=".8" stop-color="#6fb8ff"/><stop offset="1" stop-color="#b38bff"/></linearGradient>
  <radialGradient id="${g}f" cx=".5" cy=".42" r=".6"><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${sdark}"/></radialGradient></defs>`;
  if(opts.thumb)s+=`<rect x="0" y="-12" width="220" height="302" fill="${opts.bg||"#f3f8ff"}"/>`;
  // hair behind the head
  if(hair==="long")s+=`<path d="M40 104 Q36 22 110 22 Q184 22 180 104 L188 206 Q150 220 110 210 Q70 220 32 206 Z" fill="${hdark}"/>`;
  if(hair==="curly")for(const [x,y,r] of [[44,74,28],[176,74,28],[36,112,26],[184,112,26],[40,148,25],[180,148,25],[52,180,23],[168,180,23],[76,196,20],[144,196,20]])s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${hdark}"/><circle cx="${x-6}" cy="${y-7}" r="${r*.35}" fill="${hlite}" opacity=".35"/>`;
  if(hair==="braids")for(const x of [46,174]){for(let y=128;y<=214;y+=19)s+=`<ellipse cx="${x}" cy="${y}" rx="13" ry="12" fill="${hc}" stroke="${hdark}" stroke-width="2"/>`;s+=`<circle cx="${x}" cy="230" r="7" fill="#ff7eb6"/>`}
  if(hair==="puffs")for(const x of [46,174])s+=`<circle cx="${x}" cy="40" r="34" fill="${hc}"/><circle cx="${x-10}" cy="28" r="11" fill="${hlite}" opacity=".35"/>`;
  if(hair==="bun")s+=`<circle cx="110" cy="18" r="27" fill="${hc}"/><circle cx="101" cy="9" r="8" fill="${hlite}" opacity=".35"/>`;
  // legs, shoes, arms
  const legTop=cl.kind==="tee"||cl.kind==="hoodie"?226:244;
  if(cl.kind!=="gown")s+=`<rect x="90" y="${legTop}" width="16" height="${266-legTop}" rx="7" fill="${skin}"/><rect x="114" y="${legTop}" width="16" height="${266-legTop}" rx="7" fill="${skin}"/>`;
  s+=`<path d="M82 272 Q82 260 98 260 Q110 262 108 272 Z" fill="#ff7eb6"/><path d="M112 272 Q110 262 122 260 Q138 260 138 272 Z" fill="#ff7eb6"/><rect x="80" y="270" width="30" height="5" rx="2.5" fill="#fff"/><rect x="110" y="270" width="30" height="5" rx="2.5" fill="#fff"/>`;
  s+=`<rect x="56" y="176" width="15" height="48" rx="7.5" fill="${skin}"/><rect x="149" y="176" width="15" height="48" rx="7.5" fill="${skin}"/><circle cx="63.5" cy="225" r="8.5" fill="${skin}"/><circle cx="156.5" cy="225" r="8.5" fill="${skin}"/>`;
  s+=`<rect x="101" y="148" width="18" height="16" fill="${sdark}"/>`;
  // clothes
  const top=`M74 178 Q76 160 96 158 L124 158 Q144 160 146 178 L162 200 L150 207`;
  if(cl.kind==="tee"||cl.kind==="hoodie"){
    if(cl.kind==="hoodie")s+=`<path d="M82 164 Q110 140 138 164 L132 172 Q110 156 88 172 Z" fill="${dark}"/>`;
    s+=`<path d="${top} L143 197 L143 226 L77 226 L77 197 L70 207 L58 200 Z" fill="${fill}"/>`;
    s+=`<path d="M77 214 L143 214 L143 226 L77 226 Z" fill="${dark}" opacity=".35"/>`;
    if(cl.kind==="hoodie")s+=`<path d="M92 204 L128 204 L125 220 L95 220 Z" fill="${dark}"/><path d="M104 160 L103 184 M116 160 L117 184" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
    else s+=`<path d="M110 182 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill="#fff" opacity=".9"/>`;
    s+=`<rect x="77" y="224" width="66" height="10" rx="4" fill="#3d6fb8"/>`;
  }else if(cl.kind==="dress"){
    s+=`<path d="${top} L144 198 L170 246 Q110 262 50 246 L76 198 L70 207 L58 200 Z" fill="${fill}"/>`;
    s+=`<path d="M78 200 Q110 212 142 200 L142 206 Q110 218 78 206 Z" fill="#fff" opacity=".75"/>`;
    s+=`<path d="M52 242 Q110 258 168 242 L170 246 Q110 262 50 246 Z" fill="${dark}"/>`;
  }else if(cl.kind==="gown"){
    s+=`<path d="${top} L144 198 L188 262 Q110 280 32 262 L76 198 L70 207 L58 200 Z" fill="${fill}"/>`;
    s+=`<path d="M36 256 Q50 270 64 258 Q80 272 96 260 Q110 274 124 260 Q140 272 156 258 Q170 270 184 256 L188 262 Q110 280 32 262 Z" fill="#fff" opacity=".7"/>`;
    s+=`<path d="M78 200 Q110 212 142 200" stroke="#ffe680" stroke-width="5" fill="none"/>`;
    for(const [x,y] of [[94,222],[126,232],[80,246],[140,248],[110,240],[60,258],[160,258]])s+=`<path d="M${x} ${y-5} L${x+1.6} ${y-1.6} L${x+5} ${y} L${x+1.6} ${y+1.6} L${x} ${y+5} L${x-1.6} ${y+1.6} L${x-5} ${y} L${x-1.6} ${y-1.6} Z" fill="#fff6b0"/>`;
  }
  // head
  s+=`<circle cx="44" cy="108" r="11" fill="${skin}"/><circle cx="176" cy="108" r="11" fill="${skin}"/>`;
  s+=`<ellipse cx="110" cy="98" rx="68" ry="63" fill="url(#${g}f)"/>`;
  // eyebrows
  s+=`<path d="M70 82 Q84 74 98 80" stroke="${hdark}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M122 80 Q136 74 150 82" stroke="${hdark}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // eyes by face
  if(face==="sleepy")s+=eyeShut(84,108,false,false)+eyeShut(136,108,true,false);
  else if(face==="excited")s+=eyeShut(84,108,false,true)+eyeShut(136,108,true,true);
  else if(face==="silly")s+=eyeOpen(84,108,iris,false)+eyeShut(136,108,true,true);
  else s+=eyeOpen(84,108,iris,false)+eyeOpen(136,108,iris,true);
  if(ex==="glasses")s+=`<rect x="64" y="92" width="40" height="30" rx="12" fill="#2a1830" opacity=".92"/><rect x="116" y="92" width="40" height="30" rx="12" fill="#2a1830" opacity=".92"/><rect x="102" y="101" width="16" height="5" fill="#2a1830"/><path d="M72 99 L84 99 M124 99 L136 99" stroke="#8fd0ff" stroke-width="3.5" stroke-linecap="round"/>`;
  s+=`<ellipse cx="66" cy="132" rx="12" ry="7.5" fill="#ff8fa3" opacity=".55"/><ellipse cx="154" cy="132" rx="12" ry="7.5" fill="#ff8fa3" opacity=".55"/>`;
  s+=`<ellipse cx="110" cy="126" rx="3.5" ry="2.5" fill="${shade(skin,-.25)}"/>`;
  // mouth by face
  if(face==="happy"||face==="excited")s+=`<path d="M96 136 Q110 152 124 136 Z" fill="#b8324f"/><path d="M102 143 Q110 150 118 143 Q110 140 102 143 Z" fill="#ff8fa3"/>`;
  else if(face==="surprised")s+=`<ellipse cx="110" cy="142" rx="7" ry="9" fill="#b8324f"/>`;
  else if(face==="silly")s+=`<path d="M98 136 Q110 146 122 136" stroke="#b8324f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M106 140 Q106 154 113 153 Q119 152 117 140 Z" fill="#ff7b95"/>`;
  else s+=`<path d="M103 138 Q110 143 117 138" stroke="#b8324f" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if(face==="excited")s+=`<path d="M30 52 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z M188 44 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#ffc53d"/>`;
  if(face==="sleepy")s+=`<text x="168" y="56" font-family="Fredoka,sans-serif" font-weight="700" font-size="22" fill="#6b7fd6">z</text><text x="182" y="40" font-family="Fredoka,sans-serif" font-weight="700" font-size="16" fill="#6b7fd6">z</text>`;
  // hair in front
  if(hair==="short")s+=`<path d="M40 112 Q34 24 110 24 Q186 24 180 112 Q176 80 160 64 Q140 84 110 74 Q80 84 60 64 Q44 80 40 112 Z" fill="${hc}"/>`;
  else s+=`<path d="M42 102 Q38 24 110 24 Q182 24 178 102 Q170 72 150 60 Q136 80 110 72 Q84 80 70 60 Q50 72 42 102 Z" fill="${hc}"/>`;
  s+=`<path d="M66 44 Q96 28 136 34" stroke="${hlite}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>`;
  // extras
  if(ex==="bow")s+=`<path d="M154 40 L132 24 Q126 40 134 58 Z M154 40 L176 24 Q182 40 174 58 Z" fill="#ff5a7a"/><circle cx="154" cy="41" r="8" fill="#e23d62"/>`;
  if(ex==="flower")s+=[0,72,144,216,288].map(a=>`<circle cx="${64+13*Math.cos(a*Math.PI/180)}" cy="${48+13*Math.sin(a*Math.PI/180)}" r="10" fill="#ff9ccf"/>`).join("")+`<circle cx="64" cy="48" r="8" fill="#ffd23f"/>`;
  if(ex==="cap")s+=`<path d="M44 74 Q46 18 110 18 Q174 18 176 74 Z" fill="#4a8ff0"/><path d="M110 70 L196 70 Q202 82 184 84 L110 80 Z" fill="#2f6fd0"/><circle cx="110" cy="20" r="6" fill="#2f6fd0"/>`;
  if(ex==="crown")s+=`<path d="M76 40 L82 4 L98 26 L110 -2 L122 26 L138 4 L144 40 Z" fill="#ffc53d" stroke="#e39b00" stroke-width="3" stroke-linejoin="round"/><circle cx="110" cy="28" r="6" fill="#ff5a7a"/><circle cx="91" cy="32" r="4" fill="#4aa3ff"/><circle cx="129" cy="32" r="4" fill="#34b56b"/>`;
  // pet
  if(pet.e)s+=`<text x="186" y="282" text-anchor="middle" font-size="${opts.thumb?58:46}">${pet.e}</text>`;
  return s+`</svg>`;
}

// ---------- Speech: TalkTap's own voice (recorded clip when there is one, else the iPad voice) ----------
function say(text){$("bubble").textContent=text;speak(text)}
function hairWords(look){
  const c=BY[look.hcol].name,h=look.hair;
  return {puffs:`${c} puffs`,long:`long ${c} hair`,short:`short ${c} hair`,bun:`a ${c} bun`,braids:`${c} braids`,curly:`curly ${c} hair`}[h];
}
function describe(){
  const L=W.look,P=PRO(),out=[`${NAME()} has ${hairWords(L)}.`,`${P} has ${BY[L.clothes].say}.`];
  out.push(`${P} has ${BY[L.eyes].name} eyes.`);
  if(BY[L.extra].say)out.push(`${P} has ${BY[L.extra].say}.`);
  if(BY[L.pet].say)out.push(`${P} has ${BY[L.pet].say}.`);
  out.push(`${P} feels ${BY[L.face].name}.`,`${P} is ${BY[L.place].say.replace(" her "," "+HIS()+" ")}.`);
  return out.join(" ");
}
function wearLine(it){
  if(it.cat==="clothes"||(it.cat==="extra"&&it.say)||(it.cat==="pet"&&it.say))return `I have ${it.say}!`;
  if(it.cat==="hair"||it.cat==="hcol")return `I have ${hairWords(W.look)}!`;
  if(it.cat==="place")return `I am ${it.say}!`;
  if(it.cat==="face")return `I feel ${it.name}!`;
  if(it.cat==="eyes")return `I have ${it.name} eyes!`;
  return "I look great!";
}

// ---------- Room ----------
const ROOMCATS=new Set(["furn","toy","wall","floor"]);
const listWords=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];
const hPct=it=>it.size*4/3; // item height as % of room height (room is 4:3, size is % of width)
function thingName(t){return t.id==="me"?NAME():"the "+BY[t.id].name}
// Where is this thing? "on" a big piece of furniture, else "next to" the nearest thing on the floor.
function relation(t){
  if(t.id!=="me"&&BY[t.id].hang)return null;
  let best=null;
  for(const f of W.room.items){
    if(f===t)continue;const F=f.id==="me"?null:BY[f.id];if(F&&F.hang)continue;
    const dx=Math.abs(t.x-f.x),dy=t.y-f.y;
    if(F&&F.big&&dx<F.size*.5&&dy<-3&&dy>-hPct(F)*.95)return {word:"on",f};
    const d=Math.hypot(dx,dy*1.4);
    if(d<26&&(!best||d<best.d))best={word:"next to",f,d};
  }
  return best;
}
function relSentence(t){const r=relation(t);if(!r)return null;const n=thingName(t);return `${n[0].toUpperCase()+n.slice(1)} is ${r.word} ${thingName(r.f)}.`}
function describeRoom(){
  const things=W.room.items.filter(t=>t.id!=="me").map(t=>BY[t.id].say);
  const out=[things.length?`${NAME()}'s room has ${listWords(things)}.`:`${NAME()}'s room is empty.`];
  const movers=W.room.items.filter(t=>t.id==="me"||BY[t.id].cat==="toy");
  const pairs=new Set(); // say "the teddy is next to the robot" once, not again the other way round
  for(const t of movers){const r=relation(t);if(!r)continue;const k=[t.u,r.f.u].sort().join("-");if(pairs.has(k))continue;pairs.add(k);
    out.push(relSentence(t));if(out.length>=4)break}
  out.push(BY[W.room.wall].line);
  return out.join(" ");
}
let sel=null,drag=null;
function thingHTML(t){
  const it=BY[t.id],z=Math.round(t.y*10)+(t.id==="me"?5:0);
  const x=sel===t.u?`<button class="x" type="button" data-x="${t.u}" aria-label="Put away">✕</button>`:"";
  if(t.id==="me")return `<div class="thing me${sel===t.u?" sel":""}" data-u="${t.u}" style="left:${t.x}%;top:${t.y}%;z-index:${z}">${avatarSVG(W.look,{label:NAME()})}</div>`;
  return `<div class="thing${sel===t.u?" sel":""}" data-u="${t.u}" role="img" aria-label="${it.name}" style="left:${t.x}%;top:${t.y}%;z-index:${z};font-size:${it.size}cqw">${it.e}${x}</div>`;
}
function renderRoom(){
  $("room").innerHTML=`<div class="wall" style="background:${BY[W.room.wall].bg}"></div><div class="floor" style="background:${BY[W.room.floor].bg}"></div>`+W.room.items.map(thingHTML).join("");
}
function roomUse(it){
  if(it.cat==="wall"||it.cat==="floor"){W.room[it.cat]=it.id;persist();renderRoom();renderGrid();say(it.line);return}
  const t={u:Date.now(),id:it.id,x:Math.round(25+Math.random()*50),y:it.hang?38:it.cat==="toy"?86:94};
  W.room.items.push(t);sel=t.u;persist();renderRoom();say(`My room has ${it.say}! Move it where you like.`);
}
function setupRoomDrag(){
  const room=$("room");
  room.addEventListener("pointerdown",e=>{
    const xb=e.target.closest("[data-x]");
    if(xb){e.stopPropagation();const u=+xb.dataset.x,t=W.room.items.find(i=>i.u===u);
      W.room.items=W.room.items.filter(i=>i.u!==u);sel=null;persist();renderRoom();say(`I put ${thingName(t)} away.`);return}
    const el=e.target.closest(".thing");
    if(!el){if(sel!==null){sel=null;renderRoom()}return}
    const t=W.room.items.find(i=>i.u===+el.dataset.u);
    drag={t,el,px:e.clientX,py:e.clientY,x0:t.x,y0:t.y,moved:false};
    el.setPointerCapture(e.pointerId);el.style.zIndex=9999;e.preventDefault();
  });
  room.addEventListener("pointermove",e=>{
    if(!drag)return;const r=room.getBoundingClientRect();
    const dx=(e.clientX-drag.px)/r.width*100,dy=(e.clientY-drag.py)/r.height*100;
    if(Math.abs(dx)+Math.abs(dy)>1.5)drag.moved=true;
    drag.t.x=Math.max(4,Math.min(96,drag.x0+dx));drag.t.y=Math.max(14,Math.min(100,drag.y0+dy));
    drag.el.style.left=drag.t.x+"%";drag.el.style.top=drag.t.y+"%";
  });
  const end=()=>{
    if(!drag)return;const {t,moved}=drag;drag=null;
    if(moved){sel=null;persist();renderRoom();const s=relSentence(t);if(s)say(s)}
    else{sel=sel===t.u?null:t.u;renderRoom()}
  };
  room.addEventListener("pointerup",end);room.addEventListener("pointercancel",end);
}

// ---------- Render ----------
const $=id=>root.getElementById(id);
const roomView=()=>tab==="room"||(tab==="shop"&&ROOMCATS.has(cat));
function renderStage(){
  const p=BY[W.look.place],rv=roomView();
  $("stage").style.background=rv?"linear-gradient(#fff3e3,#ffe4c7)":p.bg;
  $("decor").hidden=rv;$("avatarBox").hidden=rv;$("room").hidden=!rv;
  $("tell").textContent=rv?"🔊 Tell me about my room":"🔊 Tell me about "+NAME();
  $("decor").innerHTML=p.decor.map(([e,x,y])=>`<span style="left:${x}%;top:${y}%">${e}</span>`).join("");
  $("avatarBox").innerHTML=avatarSVG(W.look);
  if(rv)renderRoom();
  $("starN").textContent=K().wallet;
}
function preview(it){return {...W.look,[it.cat]:it.id}}
function thumb(it){
  if(it.cat==="wall"||it.cat==="floor")return `<div class="rt" style="background:${it.bg}"></div>`;
  if(ROOMCATS.has(it.cat))return `<div class="rt">${it.e}</div>`;
  const look=preview(it),zoom=["hair","hcol","extra","skin","face","eyes"].includes(it.cat)?"head":"body";
  if(it.cat==="place")return `<div style="border-radius:14px;overflow:hidden;background:${it.bg};width:100%;line-height:0">${avatarSVG(look,{thumb:true,zoom,bg:"transparent",label:it.name})}</div>`;
  return avatarSVG(look,{thumb:true,zoom,label:it.name});
}
function renderCats(){
  const list=CATS.filter(c=>tab==="room"?ROOMCATS.has(c.id):tab==="dress"?!ROOMCATS.has(c.id):c.id!=="skin");
  if(!list.some(c=>c.id===cat))cat=list[0].id;
  $("cats").innerHTML=list.map(c=>`<button type="button" data-cat="${c.id}" aria-pressed="${c.id===cat}">${c.label}</button>`).join("");
  renderStage();
}
function renderGrid(){
  const owned=new Set(W.owned);
  let items=ITEMS.filter(i=>i.cat===cat);
  if(tab==="dress")items=items.filter(i=>owned.has(i.id));
  else if(tab==="shop")items=items.filter(i=>i.price>0).sort((a,b)=>a.price-b.price);
  else items=items.slice().sort((a,b)=>owned.has(b.id)-owned.has(a.id)||a.price-b.price);
  $("grid").innerHTML=items.map(it=>{
    const have=owned.has(it.id),on=ROOMCATS.has(it.cat)?W.room[it.cat]===it.id:W.look[it.cat]===it.id;
    const badge=tab==="shop"?(have?`<span class="owned">Got it</span>`:`<span class="price">⭐ ${it.price}</span>`):(!have?`<span class="price">⭐ ${it.price}</span>`:"");
    return `<button type="button" class="item${on?" on":""}${!have?" locked":""}" data-id="${it.id}" aria-label="${it.name}${!have?", "+it.price+" stars":""}">${badge}${thumb(it)}<span class="nm">${it.name}</span></button>`;
  }).join("");
  const left=ITEMS.filter(i=>i.cat===cat&&i.price>0&&!owned.has(i.id)).length;
  $("more").innerHTML=tab==="room"?"Tap to add it to your room. Drag things to move them. Tap a thing, then ✕ to put it away."
    :tab==="dress"&&left?`${left} more in the <button type="button" id="goShop">Star shop</button>`:(tab==="shop"&&!left?"You have everything here! 🎉":"");
  const gs=$("goShop");if(gs)gs.onclick=()=>setTab("shop");
}
function render(){renderCats();renderGrid()}
function setTab(t){tab=t;for(const k of ["dress","room","shop"])$("t-"+k).setAttribute("aria-pressed",String(t===k));sel=null;renderCats();renderGrid()}

// ---------- Actions ----------
function wear(it){W.look[it.cat]=it.id;persist();render();say(wearLine(it))}
function use(it){if(ROOMCATS.has(it.cat)){if(tab!=="room")setTab("room");cat=it.cat;render();roomUse(it)}else wear(it)}
function bumpStars(){const el=$("stars");el.classList.add("bump");setTimeout(()=>el.classList.remove("bump"),250)}
function burst(){
  const r=$("stars").getBoundingClientRect();
  for(let i=0;i<14;i++){const b=document.createElement("span");b.className="burst";b.textContent=i%3?"⭐":"✨";
    b.style.left=(r.left+r.width/2)+"px";b.style.top=(r.top+r.height/2)+"px";
    b.style.setProperty("--dx",(Math.random()*360-180)+"px");b.style.setProperty("--dy",(Math.random()*300+40)+"px");
    root.appendChild(b);setTimeout(()=>b.remove(),1000)}
}
function openSheet(it){
  const need=it.price-K().wallet,card=$("sheetCard");
  card.innerHTML=thumb(it)+`<h2>${it.name[0].toUpperCase()+it.name.slice(1)}</h2>`+
    (need>0?`<p>You need ${need} more ${need===1?"star":"stars"}. Play to earn them!</p><div class="row"><button class="btn buy" type="button" id="sEarn">▶ Go and play</button><button class="btn" type="button" id="sNo">OK</button></div>`
           :`<p>This costs ⭐ ${it.price}. You have ⭐ ${K().wallet}.</p><div class="row"><button class="btn buy" type="button" id="sBuy">Buy for ⭐ ${it.price}</button><button class="btn" type="button" id="sNo">Not now</button></div>`);
  $("sheet").hidden=false;
  $("sNo").onclick=closeSheet;
  if($("sBuy"))$("sBuy").onclick=()=>{K().wallet-=it.price;W.owned.push(it.id);closeSheet();bumpStars();burst();
    if(!ROOMCATS.has(it.cat)){setTab("dress");cat=it.cat;renderCats()}use(it)};
  if($("sEarn"))$("sEarn").onclick=()=>{closeSheet();closeWorld()};
  ($("sBuy")||$("sEarn")).focus();
}
function closeSheet(){$("sheet").hidden=true}

for(const k of ["dress","room","shop"])$("t-"+k).onclick=()=>setTab(k);
$("cats").onclick=e=>{const b=e.target.closest("button[data-cat]");if(!b)return;cat=b.dataset.cat;renderCats();renderGrid()};
$("grid").onclick=e=>{const b=e.target.closest(".item");if(!b)return;const it=BY[b.dataset.id];
  if(W.owned.includes(it.id))use(it);else openSheet(it)};
$("tell").onclick=()=>say(roomView()?describeRoom():describe());
$("sheet").onclick=e=>{if(e.target.id==="sheet")closeSheet()};
document.addEventListener("keydown",e=>{if(host.hidden||e.key!=="Escape")return;if(!$("sheet").hidden)closeSheet();else closeWorld()});
setupRoomDrag();

// ---------- Open, close and the TalkTap buttons ----------
function openWorld(viaDone){
  stopAll();loadW();fromDone=!!viaDone;$("title").textContent=NAME()+"'s World";$("stage").setAttribute("aria-label",NAME()+"'s avatar");
  host.hidden=false;host.scrollTop=0;cat="clothes";setTab("dress");say(`Hi! I'm ${NAME()}!`);
}
function closeWorld(){
  stopAll();closeSheet();host.hidden=true;persist();updateButtons();
  if(fromDone)document.getElementById("done").hidden=false;
}
function updateButtons(){
  const k=K();if(!k)return;const mode=k.world||0;
  const b=document.getElementById("worldBtn");b.hidden=mode!==2;b.textContent="👗 My world  ⭐ "+(k.wallet||0);
  document.getElementById("doneWorld").hidden=mode<1;
}
$("close").onclick=closeWorld;
document.getElementById("worldBtn").onclick=()=>openWorld(false);
document.getElementById("doneWorld").onclick=()=>{document.getElementById("done").hidden=true;openWorld(true)};
window.worldKidChanged=updateButtons;window.worldStarsChanged=updateButtons;
updateButtons();

})();
