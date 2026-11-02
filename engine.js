// Groszery engine v0: curated prices + recipes, deterministic planner (no AI at runtime).
// ALL PRICES AND RECIPES ARE DRAFT: verify against receipts / by cooking before public launch.
(function(root){
const GROUPS={v:'Warzywa i owoce',d:'Nabiał i jajka',m:'Mięso i ryby',s:'Suche',p:'Pieczywo',c:'Puszki i mrożonki',o:'Tłuszcze',z:'Przyprawy'};
// id:[name, packSize, unit, pricePerPack(PLN), group, tags]
const PR={
mak:['makaron',500,'g',4.5,'s','gluten'],ryz:['ryż',1000,'g',7,'s',''],pls:['płatki owsiane',500,'g',3.8,'s','gluten'],mka:['mąka pszenna',1000,'g',3.9,'s','gluten'],
ziem:['ziemniaki',1000,'g',3.5,'v',''],jaj:['jajka',10,'szt',11.5,'d','egg'],mlk:['mleko',1000,'ml',3.9,'d','milk'],mas:['masło',200,'g',8.5,'d','milk'],
fet:['feta',200,'g',8.5,'d','milk'],twr:['twaróg',250,'g',6.5,'d','milk'],jog:['jogurt naturalny',400,'g',3.6,'d','milk'],moz:['mozzarella',125,'g',3.8,'d','milk'],zol:['ser żółty',150,'g',7,'d','milk'],
kur:['pierś z kurczaka',500,'g',12.5,'m','meat'],mie:['mięso mielone',500,'g',14,'m','meat pork'],tun:['tuńczyk w puszce',170,'g',7,'m','fish'],
cbl:['cebula',1000,'g',3,'v',''],czn:['czosnek',10,'ząbki',1.5,'v',''],mar:['marchew',1000,'g',3,'v',''],cuk:['cukinia',1,'szt',3.5,'v',''],pap:['papryka',1,'szt',3,'v',''],
pom:['pomidory',100,'g',1.2,'v',''],ogr:['ogórek',1,'szt',3,'v',''],bna:['banany',100,'g',0.65,'v',''],jab:['jabłka',100,'g',0.5,'v',''],
pup:['pomidory krojone (puszka)',400,'g',3.5,'c',''],szp:['szpinak mrożony',450,'g',5.5,'c',''],bro:['brokuły mrożone',450,'g',5.5,'c',''],wmr:['warzywa mrożone',450,'g',5,'c',''],
kuk:['kukurydza (puszka)',400,'g',3.5,'c',''],fas:['fasola czerwona (puszka)',400,'g',3.8,'c',''],cie:['ciecierzyca (puszka)',400,'g',4,'c',''],soc:['soczewica czerwona',400,'g',6,'s',''],
chl:['chleb',500,'g',4.5,'p','gluten'],tor:['tortille',8,'szt',6,'p','gluten'],olj:['olej rzepakowy',1000,'ml',9,'o',''],mot:['masło orzechowe',350,'g',9,'s','nuts'],cyt:['cytryna',1,'szt',1.5,'v',''],sos:['sos sojowy',150,'ml',5,'s','soy'],kon:['koncentrat pomidorowy',200,'g',4,'c',''],smt:['śmietana 18%',200,'g',3,'d','milk'],cur:['przyprawy: curry',20,'g',4,'z',''],wed:['przyprawy: papryka wędzona',20,'g',4.5,'z','']};
// type: b=breakfast, l=lunch/dinner, s=snack. ing: [productId, qty in product unit]
const R=[
['b1','Owsianka z bananem i masłem orzechowym','b',10,[['pls',60],['mlk',250],['bna',120],['mot',15]],'Zagotuj mleko ze szczyptą soli.|Wsyp płatki i gotuj 3-4 min, mieszając.|Połowę banana rozgnieć widelcem i wmieszaj: osłodzi całą owsiankę.|Na wierzch plasterki banana i łyżeczka masła orzechowego.'],
['b2','Jajecznica na maśle z pomidorem','b',10,[['jaj',3],['mas',10],['chl',80],['pom',80]],'Pomidora pokrój w kostkę i podsmaż na maśle 2 min ze słodką papryką.|Jajka roztrzep z solą i pieprzem, wlej na patelnię.|Mieszaj na małym ogniu 2-3 min, żeby została kremowa, nie sucha.|Chleb podpiecz na suchej patelni i podaj z jajecznicą.'],
['b3','Chleb z pastą twarogową i ogórkiem','b',5,[['twr',125],['jog',30],['ogr',0.5],['chl',80]],'Twaróg rozgnieć z jogurtem, solą, pieprzem i szczyptą oregano.|Ogórka pokrój w plasterki i lekko posól.|Chleb podpiecz, posmaruj pastą i ułóż ogórka.'],
['b4','Naleśniki z twarogiem i cytryną','b',25,[['mka',60],['jaj',1],['mlk',120],['twr',100],['jog',30],['cyt',0.25],['olj',10]],'Wymieszaj mąkę, jajko, mleko i szczyptę soli. Odstaw na 5 min.|Smaż cienkie naleśniki na rozgrzanej patelni, ok. 1 min z każdej strony.|Twaróg wymieszaj z jogurtem i sokiem z cytryny.|Nałóż nadzienie i zwiń.'],
['b5','Tosty z serem, pomidorem i oregano','b',10,[['chl',80],['zol',30],['pom',80],['mas',5]],'Posmaruj chleb masłem po zewnętrznej stronie.|Ułóż ser i cienko pokrojonego pomidora, oprósz oregano i pieprzem.|Opiekaj na patelni pod przykryciem po 2-3 min z każdej strony, aż ser się roztopi.'],
['b6','Jogurt z prażonymi płatkami i jabłkiem','b',5,[['jog',200],['pls',40],['jab',150]],'Płatki uprażyć na suchej patelni 2-3 min, aż zapachną orzechowo.|Jabłko zetrzyj na grubej tarce.|Wymieszaj z jogurtem i posyp ciepłymi płatkami.'],
['b7','Owsianka na wodzie z jabłkiem','b',10,[['pls',60],['jab',150]],'Płatki zagotuj w 250 ml wody ze szczyptą soli, 4 min.|Jabłko pokrój w kostkę i dodaj na ostatnią minutę, żeby było miękkie, ale nie rozpadło się.'],
['b8','Chleb z masłem orzechowym i bananem','b',5,[['chl',80],['mot',20],['bna',100]],'Chleb podpiecz na suchej patelni.|Posmaruj masłem orzechowym i ułóż plasterki banana.'],
['b9','Smażone ziemniaki z jajkiem i pomidorem','b',20,[['ziem',200],['jaj',2],['pom',80],['olj',10]],'Ziemniaki pokrój w cienkie plasterki i smaż na oleju pod przykryciem 10 min, aż się zrumienią.|Dodaj pomidora, posól i oprósz słodką papryką.|Wbij jajka, wymieszaj i smaż 2 min.'],
['l1','Makaron w sosie pomidorowym z mozzarellą','l',25,[['mak',100],['pup',200],['cbl',50],['czn',2],['moz',60],['kon',20],['olj',10]],'Makaron ugotuj w osolonej wodzie i zostaw pół szklanki wody z gotowania.|Cebulę posiekaj i szklij na oleju 4 min, dodaj czosnek na 30 s.|Dodaj koncentrat i smaż minutę: skarmelizuje się i da głębię.|Wlej pomidory, dodaj oregano, sól i pieprz, duś 10 min.|Wymieszaj makaron z sosem, dolej trochę wody z gotowania i wrzuć rwaną mozzarellę.'],
['l2','Makaron z zrumienioną cukinią i fetą','l',25,[['mak',100],['cuk',1],['fet',50],['czn',2],['olj',10],['cyt',0.25]],'Makaron ugotuj w osolonej wodzie.|Cukinię pokrój w półplasterki i smaż na mocno rozgrzanym oleju ok. 5 min, mieszając rzadko, żeby się zrumieniła.|Dodaj czosnek na ostatnią minutę.|Wymieszaj z makaronem i pokruszoną fetą, skrop sokiem z cytryny i dopraw pieprzem. Soli nie trzeba, feta jest słona.'],
['l3','Kurczak w sosie sojowym z ryżem i warzywami','l',25,[['ryz',80],['kur',150],['wmr',150],['sos',15],['czn',2],['olj',10]],'Ryż ugotuj według opisu.|Kurczaka pokrój w paski, oprósz pieprzem i smaż na mocnym ogniu 5 min, aż się zrumieni.|Dodaj czosnek i warzywa prosto z mrożonki, smaż 5 min.|Wlej sos sojowy i 2 łyżki wody, gotuj 2 min, aż powstanie lśniący sos.|Podaj z ryżem.'],
['l4','Kurczak w cytrynowej marynacie z ziemniakami','l',35,[['kur',150],['ziem',250],['mar',100],['czn',2],['cyt',0.25],['olj',10]],'Kurczaka natrzyj solą, pieprzem, słodką papryką, oregano i czosnkiem, skrop sokiem z cytryny i odstaw na 10 min.|Ziemniaki i marchew pokrój w słupki i ugotuj do miękkości, ok. 12 min.|Kurczaka smaż na średnim ogniu 6 min z każdej strony.|Odcedzone ziemniaki podsmaż chwilę na tej samej patelni, wchłoną smak.'],
['l5','Chili z fasolą, kukurydzą i wędzoną papryką','l',30,[['fas',200],['pup',200],['cbl',50],['kuk',100],['ryz',80],['kon',20],['wed',2],['czn',2],['olj',10]],'Ryż ugotuj.|Cebulę szklij 4 min, dodaj czosnek, koncentrat i wędzoną paprykę, smaż minutę.|Dodaj pomidory, odcedzoną fasolę i kukurydzę, gotuj 15 min na małym ogniu.|Dopraw solą i pieprzem; wędzona papryka daje mięsisty smak bez mięsa.|Podaj z ryżem.'],
['l6','Zupa krem z soczewicy z curry i cytryną','l',30,[['soc',80],['mar',100],['cbl',50],['ziem',100],['cur',2],['czn',2],['cyt',0.25],['olj',10]],'Cebulę i marchew podsmaż na oleju 5 min, dodaj czosnek i curry na minutę.|Wsyp soczewicę, ziemniaki w kostce i wlej ok. 600 ml wody, gotuj 20 min.|Zmiksuj na gładko, dopraw solą i pieprzem.|Na koniec sok z cytryny: kwaśność ożywia zupę.'],
['l7','Spaghetti bolognese','l',35,[['mak',100],['mie',125],['pup',200],['cbl',50],['czn',2],['mar',30],['kon',20],['olj',10]],'Cebulę i startą marchewkę szklij 5 min.|Dodaj mięso i smaż, rozbijając na drobno, aż mocno się zrumieni (ok. 10 min). To daje smak.|Dodaj koncentrat i czosnek na minutę, potem pomidory i oregano.|Duś 20 min pod uchyloną pokrywką.|Podaj z ugotowanym makaronem.'],
['l8','Makaron z tuńczykiem, czosnkiem i cytryną','l',15,[['mak',100],['tun',85],['kuk',80],['czn',2],['cyt',0.5],['olj',15]],'Makaron ugotuj w osolonej wodzie.|Na oleju podsmaż czosnek 30 s (nie przypal) i kukurydzę 2 min.|Dodaj odsączonego tuńczyka i makaron, wymieszaj.|Skrop sokiem z cytryny i dopraw pieprzem.'],
['l9','Szpinak w śmietanie z jajkiem sadzonym i ziemniakami','l',30,[['szp',150],['ziem',250],['jaj',2],['czn',2],['smt',40],['mas',10]],'Ziemniaki ugotuj w osolonej wodzie.|Szpinak podgrzej z czosnkiem na maśle 5 min.|Wlej śmietanę, dopraw solą i pieprzem, gotuj 2 min.|Usmaż jajka sadzone na maśle 3 min, żeby żółtko zostało płynne.|Podaj razem.'],
['l10','Curry z ciecierzycy z ryżem','l',30,[['cie',200],['pup',200],['cbl',50],['czn',2],['ryz',80],['cur',4],['cyt',0.25],['olj',10]],'Ryż ugotuj.|Cebulę szklij 5 min, dodaj czosnek i curry, smaż minutę w tłuszczu (przyprawa się rozwinie).|Dodaj pomidory i ciecierzycę, gotuj 10 min.|Dopraw solą i na koniec sokiem z cytryny.'],
['l11','Tortilla z kurczakiem, papryką i sosem czosnkowym','l',25,[['tor',2],['kur',120],['pap',1],['jog',60],['czn',2],['cyt',0.25],['olj',10]],'Sos: jogurt z czosnkiem, sokiem z cytryny i solą.|Kurczaka pokrój w paski, oprósz słodką papryką i smaż 5 min.|Dodaj paski papryki i smaż jeszcze 4 min.|Tortille podgrzej na suchej patelni po 20 s z każdej strony.|Zawiń z mięsem i sosem.'],
['l12','Kotlety mielone z ziemniakami i surówką z marchewki','l',40,[['mie',150],['jaj',1],['ziem',250],['mar',100],['cbl',30],['jog',30],['cyt',0.25],['olj',15]],'Cebulę zetrzyj, wymieszaj z mięsem, jajkiem, solą, pieprzem i oregano, uformuj kotlety.|Smaż po 5 min z każdej strony.|Ziemniaki ugotuj w osolonej wodzie.|Surówka: marchew zetrzyj i wymieszaj z jogurtem, sokiem z cytryny, solą i szczyptą cukru.'],
['l13','Makaron z brokułami, czosnkiem i serem','l',20,[['mak',100],['bro',150],['zol',40],['czn',2],['olj',10]],'Makaron gotuj w osolonej wodzie, brokuły dorzuć na ostatnie 4 min.|Na oleju krótko podsmaż czosnek.|Odcedź, wymieszaj z czosnkowym olejem i połową sera.|Posyp resztą sera i pieprzem.'],
['l14','Placki ziemniaczane z czosnkowym jogurtem','l',35,[['ziem',300],['jaj',1],['mka',30],['cbl',30],['jog',100],['czn',1],['olj',20]],'Ziemniaki i cebulę zetrzyj, odciśnij sok, dodaj jajko, mąkę, sól i pieprz.|Smaż małe placki na oleju po 3-4 min z każdej strony, aż będą chrupiące.|Jogurt wymieszaj z czosnkiem i solą.'],
['l15','Sałatka z tuńczykiem, fasolą i cytryną','l',10,[['tun',85],['fas',200],['ogr',0.5],['pom',100],['cbl',20],['cyt',0.5],['chl',80],['olj',10]],'Tuńczyka i fasolę odcedź, cebulę posiekaj bardzo drobno.|Ogórka i pomidora pokrój w kostkę.|Sos: olej, sok z cytryny, sól, pieprz i oregano.|Wymieszaj, podaj z podpieczonym chlebem.'],
['l16','Zapiekanka makaronowa ze szpinakiem i fetą','l',35,[['mak',100],['szp',150],['fet',50],['jaj',1],['mlk',50],['czn',2]],'Makaron ugotuj 2 min krócej niż w opisie.|Rozmrożony, odciśnięty szpinak podsmaż z czosnkiem 2 min.|Wymieszaj makaron, szpinak, fetę, jajko i mleko, dopraw pieprzem.|Piecz 20 min w 190°C, aż się zrumieni na wierzchu.'],
['l17','Makaron z cukinią, pomidorami i czosnkiem','l',20,[['mak',100],['cuk',1],['pup',200],['czn',2],['kon',20],['olj',10]],'Makaron ugotuj w osolonej wodzie.|Cukinię zrumień na oleju 5 min, dodaj czosnek i koncentrat na minutę.|Wlej pomidory, dopraw oregano, solą i pieprzem, duś 8 min.|Wymieszaj z makaronem.'],
['s1','Banan z masłem orzechowym','s',3,[['bna',120],['mot',20]],'Pokrój banana i podaj z masłem orzechowym.'],
['s2','Jogurt z jabłkiem','s',3,[['jog',150],['jab',120]],'Jabłko pokrój w kostkę i wymieszaj z jogurtem.'],
['s3','Kanapka z serem','s',5,[['chl',80],['zol',30],['mas',5]],'Chleb posmaruj cienko masłem i połóż ser.'],
['s4','Twaróg z pomidorem','s',3,[['twr',100],['pom',100]],'Pomidora pokrój, posól i podaj z twarogiem.'],
['s5','Marchewka i ogórek w słupkach','s',3,[['mar',100],['ogr',0.5]],'Pokrój warzywa w słupki.'],
['s6','Jabłko','s',1,[['jab',200]],'Umyj i zjedz.']];
const SL={2:'ll',3:'bll',4:'blls',5:'bsl ls'.replace(' ','')},TN={b:'Śniadanie',l:'Obiad',s:'Przekąska'};
const nrm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
const RB={};R.forEach(r=>RB[r[0]]={id:r[0],name:r[1],type:r[2],time:r[3],ing:r[4],steps:r[5].split('|')});
Object.values(RB).forEach(r=>{const t=new Set();r.ing.forEach(([p])=>PR[p][5].split(' ').forEach(x=>x&&t.add(x)));r.tags=t});
const TAGW={milk:/mlek|milk|lakt|dairy|nabial/,egg:/jaj|egg/,gluten:/gluten|pszen|wheat/,fish:/ryb|fish|tun/,nuts:/orzech|orzesz|nut|peanut/,soy:/soj|soy/};
function pool(P){const a=nrm(P.allergies),dk=nrm(P.dislikes),dt=nrm(P.diet),ex=new Set();
 Object.keys(TAGW).forEach(k=>{if(TAGW[k].test(a))ex.add(k)});if(/laktoz|lactose/.test(dt))ex.add('milk');if(/gluten/.test(dt))ex.add('gluten');const pesc=/pescet|pescat/.test(dt);
 const veg=/wegetar|vegetar/.test(dt),vgn=!veg&&/wegan|vegan/.test(dt),nopork=/wieprz|pork/.test(dt);
 const dl=dk.split(/[,;]/).map(x=>x.trim()).filter(x=>x.length>2);
 return Object.values(RB).filter(r=>{for(const x of ex)if(r.tags.has(x))return false;
  if((veg||vgn)&&(r.tags.has('meat')||r.tags.has('fish')))return false;if(vgn&&(r.tags.has('milk')||r.tags.has('egg')))return false;
  if(nopork&&r.tags.has('pork'))return false;if(pesc&&r.tags.has('meat'))return false;
  if(dl.some(w=>r.ing.some(([p])=>nrm(PR[p][0]).includes(w)||w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))||/ryb/.test(w)&&r.tags.has('fish')))return false;return true})}
const likeW=P=>nrm(P.likes).split(/[,;]/).map(x=>x.trim()).filter(x=>x.length>2);
function have(P){const t=nrm(P.pantry).split(/[,;]/).map(x=>x.trim()).filter(x=>x.length>2);return new Set(Object.keys(PR).filter(p=>t.some(w=>nrm(PR[p][0]).includes(w)||w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))))}
function cart(ids,own){const m={};ids.forEach(id=>RB[id].ing.forEach(([p,q])=>{if(!own.has(p))m[p]=(m[p]||0)+q}));
 return Object.keys(m).map(p=>{const[n,pk,u,pr,g]=PR[p],k=Math.max(1,Math.ceil(m[p]/pk-1e-9));return{p,name:n,g,need:m[p],packs:k,qty:k*pk,unit:u,price:Math.round(k*pr*100)/100}})}
const sum=l=>Math.round(l.reduce((a,x)=>a+x.price,0)*100)/100;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const fq=(q,u)=>({0.25:'¼',0.5:'½'}[q]||q)+' '+u;
function build(ids,P,own){const days=Number(P.days),sl=SL[P.meals]||SL[3],used=[...new Set(ids)];const l=cart(ids,own),tot=sum(l);
 const gr=Object.keys(GROUPS).map(g=>({category:GROUPS[g],items:l.filter(x=>x.g===g).map(x=>({item:x.name,qty:x.p==='czn'?x.packs+' główka':x.qty+' '+x.unit,price_pln:x.price}))})).filter(c=>c.items.length);
 let i=0;const dd=[];for(let d=1;d<=days;d++){dd.push({day:d,meals:(()=>{let c=0;return sl.split('').map(t=>({type:t==='l'?(c++?'Kolacja':'Obiad'):TN[t],recipe_id:ids[i++]}))})()})}
 return{id:'p'+Date.now(),lang:'Polski',engine:1,summary:'Plan na '+days+' dni: '+tot.toFixed(2).replace('.',',')+' zł.',ids,
  days:dd,recipes:used.map(id=>{const r=RB[id];return{id,name:r.name,time_min:r.time,servings:1,ingredients:r.ing.map(([p,q])=>PR[p][0]+' '+fq(q,PR[p][2])).concat(['sól, pieprz, oregano, słodka papryka (z domu)']),steps:r.steps}}),
  grocery:gr,tips:[],removed:[...own].length?[...own].map(p=>PR[p][0]):[]}}
function plan(P,seed){const own=have(P),pl=pool(P),days=Number(P.days),sl=SL[P.meals]||SL[3],R0=rng(seed==null?Date.now():seed),n=sl.length;
 const by={b:pl.filter(r=>r.type==='b'),l:pl.filter(r=>r.type==='l'),s:pl.filter(r=>r.type==='s')};
 for(const t of new Set(sl))if(!by[t].length)return{error:'Za mało przepisów dla tych ustawień (baza jest jeszcze mała).'};
 const cost=ids=>sum(cart(ids,own)),types=[];for(let d=0;d<days;d++)for(const t of sl)types.push(t);const lim=t=>Math.max(t==='l'?2:3,Math.ceil(types.filter(x=>x===t).length/by[t].length));
 const lk=likeW(P),liked=ids=>lk.length?ids.filter(id=>RB[id].ing.some(([p])=>lk.some(w=>nrm(PR[p][0]).includes(w)))).length:0;
 const dayDup=ids=>ids.some((id,i)=>ids.slice(i-i%n,i).includes(id));
 const ok=ids=>{const c={};return !dayDup(ids)&&ids.every((id,i)=>(c[id]=(c[id]||0)+1)<=lim(types[i]))};
 let best=null,bs=-1e9;const cheap=[];
 for(let it=0;it<3000;it++){const ids=[],cnt={};for(const t of types){const day=ids.slice(ids.length-ids.length%n);let r;for(let k=0;k<12;k++){r=by[t][Math.floor(R0()*by[t].length)];if((cnt[r.id]||0)<lim(t)&&!day.includes(r.id))break}cnt[r.id]=(cnt[r.id]||0)+1;ids.push(r.id)}
  const c=cost(ids),u=Object.keys(cnt).length,s=c<=P.budget?1000+u*10+liked(ids)*4-(dayDup(ids)?500:0)+R0():-c-(dayDup(ids)?500:0);if(s>bs){bs=s;best=ids}
  if(c>P.budget){cheap.push([c,ids]);if(cheap.length>60){cheap.sort((x,y)=>x[0]-y[0]);cheap.length=8}}}
 if(bs<0){cheap.sort((x,y)=>x[0]-y[0]);let bc=1e9;for(const [c0,ids0] of cheap.slice(0,8)){let ids=ids0.slice(),c=c0,imp=true,k=0;
   while(imp&&k++<10){imp=false;for(let i=0;i<ids.length;i++){for(const r of by[types[i]]){if(r.id===ids[i])continue;const t=ids.slice();t[i]=r.id;if(!ok(t))continue;const c2=cost(t);if(c2<c-0.005){ids=t;c=c2;imp=true}}}}
   if(c<bc){bc=c;best=ids}}}
 const out=build(best,P,own);out.pool=pl.length;out.over=out.grocery.flatMap(g=>g.items).reduce((a,x)=>a+x.price_pln,0)>P.budget;return out}
function swap(p,P,idx,seed){const own=have(P),cur=p.ids[idx],t=RB[cur].type,R0=rng(seed==null?Date.now():seed);
 const n=(SL[P.meals]||SL[3]).length,s0=idx-idx%n,dayIds=p.ids.slice(s0,s0+n).filter((x,j)=>s0+j!==idx),c=pool(P).filter(r=>r.type===t&&r.id!==cur&&!dayIds.includes(r.id)).map(r=>{const ids=p.ids.slice();ids[idx]=r.id;return{ids,c:sum(cart(ids,own))}}).sort((a,b)=>a.c-b.c);
 if(!c.length)return p;const ok=c.filter(x=>x.c<=P.budget),ch=(ok.length?ok:c).slice(0,3);return build(ch[Math.floor(R0()*ch.length)].ids,P,own)}
function rescue(text,P){const own=new Set(),unknown=[],P2=P||{};
 nrm(text).split(/[,;\n]/).map(x=>x.trim()).filter(x=>x.length>2).forEach(w=>{const hit=Object.keys(PR).filter(p=>PR[p][4]!=='z'&&(nrm(PR[p][0]).includes(w)||(w.length>4&&w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))));if(hit.length)hit.forEach(h=>own.add(h));else unknown.push(w)});
 const list=pool(P2).map(r=>{const used=r.ing.filter(([p])=>own.has(p)).map(([p])=>PR[p][0]);if(!used.length)return null;const miss=cart([r.id],own),mc=sum(miss);
  return{id:r.id,name:r.name,time:r.time,used:used,missing:miss.map(x=>({name:x.name,price:x.price})),missingCost:mc,score:used.length*10+(r.type==='l'?8:r.type==='b'?4:0)-mc*0.7,ingredients:r.ing.map(([p,q])=>PR[p][0]+' '+fq(q,PR[p][2])),steps:r.steps}}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5);
 return{list:list,unknown:unknown,matchedNames:[...own].map(p=>PR[p][0])}}
const api={PR,RB,GROUPS,plan,swap,pool,have,cart,sum,rescue};
if(typeof module!=='undefined')module.exports=api;else root.GrEngine=api;
})(this);
