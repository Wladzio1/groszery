// Groszery engine v0: curated prices + recipes, deterministic planner (no AI at runtime).
// ALL PRICES AND RECIPES ARE DRAFT: verify against receipts / by cooking before public launch.
(function(root){
const GROUPS={v:'Warzywa i owoce',d:'Nabiał i jajka',m:'Mięso i ryby',s:'Suche',p:'Pieczywo',c:'Puszki i mrożonki',o:'Tłuszcze'};
// id:[name, packSize, unit, pricePerPack(PLN), group, tags]
const PR={
mak:['makaron',500,'g',4.5,'s','gluten'],ryz:['ryż',1000,'g',7,'s',''],pls:['płatki owsiane',500,'g',3.8,'s','gluten'],mka:['mąka pszenna',1000,'g',3.9,'s','gluten'],
ziem:['ziemniaki',1000,'g',3.5,'v',''],jaj:['jajka',10,'szt',11.5,'d','egg'],mlk:['mleko',1000,'ml',3.9,'d','milk'],mas:['masło',200,'g',8.5,'d','milk'],
fet:['feta',200,'g',8.5,'d','milk'],twr:['twaróg',250,'g',6.5,'d','milk'],jog:['jogurt naturalny',400,'g',3.6,'d','milk'],moz:['mozzarella',125,'g',3.8,'d','milk'],zol:['ser żółty',150,'g',7,'d','milk'],
kur:['pierś z kurczaka',500,'g',12.5,'m','meat'],mie:['mięso mielone',500,'g',14,'m','meat pork'],tun:['tuńczyk w puszce',170,'g',7,'m','meat fish'],
cbl:['cebula',1000,'g',3,'v',''],czn:['czosnek',10,'ząbki',1.5,'v',''],mar:['marchew',1000,'g',3,'v',''],cuk:['cukinia',1,'szt',3.5,'v',''],pap:['papryka',1,'szt',3,'v',''],
pom:['pomidory',100,'g',1.2,'v',''],ogr:['ogórek',1,'szt',3,'v',''],bna:['banany',100,'g',0.65,'v',''],jab:['jabłka',100,'g',0.5,'v',''],
pup:['pomidory krojone (puszka)',400,'g',3.5,'c',''],szp:['szpinak mrożony',450,'g',5.5,'c',''],bro:['brokuły mrożone',450,'g',5.5,'c',''],wmr:['warzywa mrożone',450,'g',5,'c',''],
kuk:['kukurydza (puszka)',400,'g',3.5,'c',''],fas:['fasola czerwona (puszka)',400,'g',3.8,'c',''],cie:['ciecierzyca (puszka)',400,'g',4,'c',''],soc:['soczewica czerwona',400,'g',6,'s',''],
chl:['chleb',500,'g',4.5,'p','gluten'],tor:['tortille',8,'szt',6,'p','gluten'],olj:['olej rzepakowy',1000,'ml',9,'o',''],mot:['masło orzechowe',350,'g',9,'s','nuts']};
// type: b=breakfast, l=lunch/dinner, s=snack. ing: [productId, qty in product unit]
const R=[
['b1','Owsianka z bananem','b',10,[['pls',60],['mlk',250],['bna',120]],'Zagotuj mleko.|Wsyp płatki, gotuj 3 min.|Dodaj pokrojonego banana.'],
['b2','Jajecznica z chlebem i pomidorem','b',10,[['jaj',3],['mas',10],['chl',80],['pom',80]],'Rozpuść masło, wbij jajka.|Mieszaj do ścięcia.|Podaj z chlebem i pomidorem.'],
['b3','Chleb z twarogiem i ogórkiem','b',5,[['twr',125],['ogr',0.5],['chl',80]],'Rozgnieć twaróg widelcem.|Dodaj pokrojony ogórek, posól.|Podaj z chlebem.'],
['b4','Naleśniki z twarogiem','b',25,[['mka',60],['jaj',1],['mlk',120],['twr',100],['olj',10]],'Zmiksuj mąkę, jajko i mleko.|Smaż cienkie naleśniki na oleju.|Zawiń z twarogiem.'],
['b5','Tosty z serem i pomidorem','b',10,[['chl',80],['zol',30],['pom',80],['mas',5]],'Posmaruj chleb masłem.|Połóż ser i pomidor.|Opiekaj na patelni do roztopienia sera.'],
['b6','Jogurt z płatkami i jabłkiem','b',5,[['jog',200],['pls',40],['jab',150]],'Pokrój jabłko.|Wymieszaj z jogurtem i płatkami.'],
['l1','Makaron z sosem pomidorowym i mozzarellą','l',20,[['mak',100],['pup',200],['cbl',50],['czn',1],['moz',60],['olj',10]],'Ugotuj makaron.|Zeszklij cebulę, dodaj czosnek i pomidory, duś 10 min.|Wymieszaj z makaronem, dodaj mozzarellę.'],
['l2','Makaron z cukinią i fetą','l',25,[['mak',100],['cuk',1],['fet',50],['czn',1],['olj',10]],'Ugotuj makaron.|Podsmaż cukinię z czosnkiem.|Wymieszaj z makaronem, dodaj fetę.'],
['l3','Ryż z kurczakiem i warzywami','l',25,[['ryz',80],['kur',150],['wmr',150],['olj',10]],'Ugotuj ryż.|Podsmaż kurczaka, dodaj warzywa, duś 10 min.|Podaj z ryżem.'],
['l4','Kurczak z ziemniakami i marchewką','l',35,[['kur',150],['ziem',250],['mar',100],['olj',10]],'Ugotuj ziemniaki i marchewkę.|Usmaż kurczaka 6 min z każdej strony.|Podaj razem.'],
['l5','Chili z fasolą i ryżem','l',30,[['fas',200],['pup',200],['cbl',50],['kuk',100],['ryz',80],['olj',10]],'Ugotuj ryż.|Zeszklij cebulę, dodaj fasolę, kukurydzę i pomidory.|Duś 15 min, przypraw papryką.'],
['l6','Zupa krem z soczewicy','l',30,[['soc',80],['mar',100],['cbl',50],['ziem',100],['olj',10]],'Podsmaż cebulę i marchew.|Dodaj soczewicę, ziemniaki i wodę, gotuj 20 min.|Zmiksuj.'],
['l7','Spaghetti bolognese','l',35,[['mak',100],['mie',125],['pup',200],['cbl',50],['czn',1],['olj',10]],'Podsmaż mięso z cebulą i czosnkiem.|Dodaj pomidory, duś 20 min.|Podaj z makaronem.'],
['l8','Makaron z tuńczykiem i kukurydzą','l',15,[['mak',100],['tun',85],['kuk',100],['cbl',30],['olj',10]],'Ugotuj makaron.|Podsmaż cebulę, dodaj tuńczyka i kukurydzę.|Wymieszaj.'],
['l9','Szpinak z jajkiem i ziemniakami','l',30,[['szp',150],['ziem',250],['jaj',2],['czn',1],['mas',10]],'Ugotuj ziemniaki.|Podgrzej szpinak z czosnkiem.|Usmaż jajka sadzone, podaj razem.'],
['l10','Curry z ciecierzycy z ryżem','l',30,[['cie',200],['pup',200],['cbl',50],['czn',1],['ryz',80],['olj',10]],'Ugotuj ryż.|Zeszklij cebulę, dodaj czosnek, ciecierzycę i pomidory.|Duś 15 min z curry.'],
['l11','Tortilla z kurczakiem i papryką','l',25,[['tor',2],['kur',120],['pap',1],['jog',40],['olj',10]],'Podsmaż kurczaka z papryką.|Podgrzej tortille.|Zawiń z jogurtem.'],
['l12','Kotlety mielone z ziemniakami i surówką','l',40,[['mie',150],['jaj',1],['ziem',250],['mar',100],['cbl',30],['olj',15]],'Wymieszaj mięso z jajkiem i cebulą, uformuj kotlety.|Smaż 5 min z każdej strony.|Ugotuj ziemniaki, zetrzyj marchew na surówkę.'],
['l13','Makaron z brokułami i serem','l',20,[['mak',100],['bro',150],['zol',40],['czn',1],['olj',10]],'Ugotuj makaron, dorzuć brokuły na ostatnie 4 min.|Odcedź, dodaj czosnek podsmażony na oleju.|Posyp serem.'],
['l14','Placki ziemniaczane z jogurtem','l',35,[['ziem',300],['jaj',1],['mka',30],['cbl',30],['olj',20],['jog',100]],'Zetrzyj ziemniaki i cebulę, dodaj jajko i mąkę.|Smaż małe placki na oleju.|Podaj z jogurtem.'],
['l15','Sałatka z tuńczykiem i fasolą','l',10,[['tun',85],['fas',200],['ogr',0.5],['pom',100],['cbl',20],['chl',80],['olj',10]],'Odcedź tuńczyka i fasolę.|Pokrój warzywa, wymieszaj z olejem.|Podaj z chlebem.'],
['l16','Zapiekanka makaronowa ze szpinakiem i fetą','l',35,[['mak',100],['szp',150],['fet',50],['jaj',1],['mlk',50]],'Ugotuj makaron, rozmroź szpinak.|Wymieszaj z fetą, jajkiem i mlekiem.|Piecz 20 min w 190°C.'],
['s1','Banan z masłem orzechowym','s',3,[['bna',120],['mot',20]],'Pokrój banana.|Podaj z masłem orzechowym.'],
['s2','Jogurt z jabłkiem','s',3,[['jog',150],['jab',120]],'Pokrój jabłko.|Wymieszaj z jogurtem.'],
['s3','Kanapka z serem','s',5,[['chl',80],['zol',30],['mas',5]],'Posmaruj chleb masłem.|Połóż ser.'],
['s4','Twaróg z pomidorem','s',3,[['twr',100],['pom',100]],'Pokrój pomidora.|Podaj z twarogiem, posól.'],
['b7','Owsianka na wodzie z jabłkiem','b',10,[['pls',60],['jab',150]],'Zagotuj płatki z wodą.|Dodaj pokrojone jabłko.'],
['b8','Chleb z masłem orzechowym i bananem','b',5,[['chl',80],['mot',20],['bna',100]],'Posmaruj chleb masłem orzechowym.|Dodaj plasterki banana.'],
['b9','Jajecznica z pomidorem i ziemniakami','b',20,[['jaj',3],['pom',80],['ziem',150],['olj',10]],'Ugotuj i pokrój ziemniaki.|Podsmaż je na oleju.|Dodaj pomidora i jajka, mieszaj do ścięcia.'],
['l17','Makaron z cukinią i pomidorami','l',20,[['mak',100],['cuk',1],['pup',200],['czn',1],['olj',10]],'Ugotuj makaron.|Podsmaż cukinię z czosnkiem, dodaj pomidory.|Duś 8 min, wymieszaj z makaronem.'],
['s5','Marchewka i ogórek','s',3,[['mar',100],['ogr',0.5]],'Pokrój warzywa w słupki.'],
['s6','Jabłko','s',1,[['jab',200]],'Umyj i zjedz.']];
const SL={2:'ll',3:'bll',4:'blls',5:'bsl ls'.replace(' ','')},TN={b:'Śniadanie',l:'Obiad',s:'Przekąska'};
const nrm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
const RB={};R.forEach(r=>RB[r[0]]={id:r[0],name:r[1],type:r[2],time:r[3],ing:r[4],steps:r[5].split('|')});
Object.values(RB).forEach(r=>{const t=new Set();r.ing.forEach(([p])=>PR[p][5].split(' ').forEach(x=>x&&t.add(x)));r.tags=t});
const TAGW={milk:/mlek|milk|lakt|dairy|nabial/,egg:/jaj|egg/,gluten:/gluten|pszen|wheat/,fish:/ryb|fish|tun/,nuts:/orzech|orzesz|nut|peanut/};
function pool(P){const a=nrm(P.allergies),dk=nrm(P.dislikes),dt=nrm(P.diet),ex=new Set();
 Object.keys(TAGW).forEach(k=>{if(TAGW[k].test(a))ex.add(k)});
 const veg=/wegetar|vegetar/.test(dt),vgn=!veg&&/wegan|vegan/.test(dt),nopork=/wieprz|pork/.test(dt);
 const dl=dk.split(/[,;]/).map(x=>x.trim()).filter(x=>x.length>2);
 return Object.values(RB).filter(r=>{for(const x of ex)if(r.tags.has(x))return false;
  if((veg||vgn)&&(r.tags.has('meat')||r.tags.has('fish')))return false;if(vgn&&(r.tags.has('milk')||r.tags.has('egg')))return false;
  if(nopork&&r.tags.has('pork'))return false;
  if(dl.some(w=>r.ing.some(([p])=>nrm(PR[p][0]).includes(w)||w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))||/ryb/.test(w)&&r.tags.has('fish')))return false;return true})}
function have(P){const t=nrm(P.pantry).split(/[,;]/).map(x=>x.trim()).filter(x=>x.length>2);return new Set(Object.keys(PR).filter(p=>t.some(w=>nrm(PR[p][0]).includes(w)||w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))))}
function cart(ids,own){const m={};ids.forEach(id=>RB[id].ing.forEach(([p,q])=>{if(!own.has(p))m[p]=(m[p]||0)+q}));
 return Object.keys(m).map(p=>{const[n,pk,u,pr,g]=PR[p],k=Math.max(1,Math.ceil(m[p]/pk-1e-9));return{p,name:n,g,need:m[p],packs:k,qty:k*pk,unit:u,price:Math.round(k*pr*100)/100}})}
const sum=l=>Math.round(l.reduce((a,x)=>a+x.price,0)*100)/100;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const fq=(q,u)=>(q===0.5?'½':q)+' '+u;
function build(ids,P,own){const days=Number(P.days),sl=SL[P.meals]||SL[3],used=[...new Set(ids)];const l=cart(ids,own),tot=sum(l);
 const gr=Object.keys(GROUPS).map(g=>({category:GROUPS[g],items:l.filter(x=>x.g===g).map(x=>({item:x.name,qty:x.p==='czn'?x.packs+' główka':x.qty+' '+x.unit,price_pln:x.price}))})).filter(c=>c.items.length);
 let i=0;const dd=[];for(let d=1;d<=days;d++){dd.push({day:d,meals:(()=>{let c=0;return sl.split('').map(t=>({type:t==='l'?(c++?'Kolacja':'Obiad'):TN[t],recipe_id:ids[i++]}))})()})}
 return{id:'p'+Date.now(),lang:'Polski',engine:1,summary:'Plan na '+days+' dni: '+tot.toFixed(2).replace('.',',')+' zł.',ids,
  days:dd,recipes:used.map(id=>{const r=RB[id];return{id,name:r.name,time_min:r.time,servings:1,ingredients:r.ing.map(([p,q])=>PR[p][0]+' '+fq(q,PR[p][2])),steps:r.steps}}),
  grocery:gr,tips:[],removed:[...own].length?[...own].map(p=>PR[p][0]):[]}}
function plan(P,seed){const own=have(P),pl=pool(P),days=Number(P.days),sl=SL[P.meals]||SL[3],R0=rng(seed==null?Date.now():seed);
 const by={b:pl.filter(r=>r.type==='b'),l:pl.filter(r=>r.type==='l'),s:pl.filter(r=>r.type==='s')};
 for(const t of new Set(sl))if(!by[t].length)return{error:'Za mało przepisów dla tych ustawień (baza jest jeszcze mała).'};
 const lim=t=>t==='l'?2:3,cost=ids=>sum(cart(ids,own)),types=[];for(let d=0;d<days;d++)for(const t of sl)types.push(t);
 const ok=ids=>{const c={};return ids.every((id,i)=>(c[id]=(c[id]||0)+1)<=lim(types[i]))};
 let best=null,bs=-1e9;const cheap=[];
 for(let it=0;it<3000;it++){const ids=[],cnt={};for(const t of types){let r;for(let k=0;k<6;k++){r=by[t][Math.floor(R0()*by[t].length)];if((cnt[r.id]||0)<lim(t))break}cnt[r.id]=(cnt[r.id]||0)+1;ids.push(r.id)}
  const c=cost(ids),u=Object.keys(cnt).length,s=c<=P.budget?1000+u*10+R0():-c;if(s>bs){bs=s;best=ids}
  if(c>P.budget){cheap.push([c,ids]);if(cheap.length>60){cheap.sort((x,y)=>x[0]-y[0]);cheap.length=8}}}
 if(bs<0){cheap.sort((x,y)=>x[0]-y[0]);let bc=1e9;for(const [c0,ids0] of cheap.slice(0,8)){let ids=ids0.slice(),c=c0,imp=true,n=0;
   while(imp&&n++<10){imp=false;for(let i=0;i<ids.length;i++){for(const r of by[types[i]]){if(r.id===ids[i])continue;const t=ids.slice();t[i]=r.id;if(!ok(t))continue;const c2=cost(t);if(c2<c-0.005){ids=t;c=c2;imp=true}}}}
   if(c<bc){bc=c;best=ids}}}
 const out=build(best,P,own);out.pool=pl.length;out.over=out.grocery.flatMap(g=>g.items).reduce((a,x)=>a+x.price_pln,0)>P.budget;return out}
function swap(p,P,idx,seed){const own=have(P),cur=p.ids[idx],t=RB[cur].type,R0=rng(seed==null?Date.now():seed);
 const c=pool(P).filter(r=>r.type===t&&r.id!==cur).map(r=>{const ids=p.ids.slice();ids[idx]=r.id;return{ids,c:sum(cart(ids,own))}}).sort((a,b)=>a.c-b.c);
 if(!c.length)return p;const ok=c.filter(x=>x.c<=P.budget),ch=(ok.length?ok:c).slice(0,3);return build(ch[Math.floor(R0()*ch.length)].ids,P,own)}
const api={PR,RB,GROUPS,plan,swap,pool,have,cart,sum};
if(typeof module!=='undefined')module.exports=api;else root.GrEngine=api;
})(this);
