// Groszery engine v0: curated prices + recipes, deterministic planner (no AI at runtime).
// ALL PRICES AND RECIPES ARE DRAFT: verify against receipts / by cooking before public launch.
(function(root){
const GROUPS={v:'Warzywa i owoce',d:'Nabiał i jajka',m:'Mięso i ryby',s:'Suche',p:'Pieczywo',c:'Puszki i mrożonki',o:'Tłuszcze',z:'Przyprawy'};
// id:[name, packSize, unit, pricePerPack(PLN), group, tags]
const PR={
mak:['makaron',500,'g',4.5,'s','gluten'],ryz:['ryż',1000,'g',7,'s',''],pls:['płatki owsiane',500,'g',3.8,'s','gluten'],mka:['mąka pszenna',1000,'g',3.9,'s','gluten'],
ziem:['ziemniaki',1000,'g',3.5,'v',''],jaj:['jajka',10,'szt',11.5,'d','egg'],mlk:['mleko',1000,'ml',3.9,'d','milk'],mas:['masło',200,'g',5.5,'d','milk'],
fet:['feta',200,'g',8.5,'d','milk'],twr:['twaróg',250,'g',6.5,'d','milk'],jog:['jogurt naturalny',400,'g',3.6,'d','milk'],moz:['mozzarella',125,'g',3.8,'d','milk'],zol:['ser żółty',150,'g',6.3,'d','milk'],
kur:['pierś z kurczaka',500,'g',10,'m','meat'],mie:['mięso mielone',500,'g',14,'m','meat pork'],tun:['tuńczyk w puszce',170,'g',7,'m','fish'],
cbl:['cebula',1000,'g',3,'v',''],czn:['czosnek',10,'ząbki',1.5,'v',''],mar:['marchew',1000,'g',3,'v',''],cuk:['cukinia',1,'szt',3.5,'v',''],pap:['papryka',1,'szt',3,'v',''],
pom:['pomidory',100,'g',1.2,'v',''],ogr:['ogórek',1,'szt',3,'v',''],bna:['banany',100,'g',0.65,'v',''],jab:['jabłka',100,'g',0.5,'v',''],
pup:['pomidory krojone (puszka)',400,'g',3.5,'c',''],szp:['szpinak mrożony',450,'g',5.5,'c',''],bro:['brokuły mrożone',450,'g',5.5,'c',''],wmr:['warzywa mrożone',450,'g',5,'c',''],
kuk:['kukurydza (puszka)',400,'g',3.5,'c',''],fas:['fasola czerwona (puszka)',400,'g',3.8,'c',''],cie:['ciecierzyca (puszka)',400,'g',4,'c',''],soc:['soczewica czerwona',400,'g',6,'s',''],
chl:['chleb',500,'g',4.5,'p','gluten'],tor:['tortille',8,'szt',6,'p','gluten'],olj:['olej rzepakowy',1000,'ml',9.5,'o',''],mot:['masło orzechowe',350,'g',9,'s','nuts'],cyt:['cytryna',1,'szt',1.5,'v',''],sos:['sos sojowy',150,'ml',5,'s','soy'],kon:['koncentrat pomidorowy',200,'g',4,'c',''],smt:['śmietana 18%',200,'g',3,'d','milk'],cur:['przyprawy: curry',20,'g',4,'z',''],wed:['przyprawy: papryka wędzona',20,'g',4.5,'z',''],pie:['pieczarki',500,'g',7,'v',''],kas:['kasza gryczana',400,'g',5.5,'s',''],kap:['kapusta biała',1000,'g',3,'v','']};
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
['s6','Jabłko','s',1,[['jab',200]],'Umyj i zjedz.'],
['b10','Ryż na mleku z jabłkiem','b',20,[['ryz',50],['mlk',250],['jab',100]],'Ryż zagotuj z mlekiem na małym ogniu, mieszając, ok. 15 min.|Jabłko zetrzyj na tarce i dodaj na ostatnie 3 min.|Podaj ciepły.'],
['b11','Omlet na słodko z bananem','b',10,[['jaj',2],['mka',20],['mlk',50],['bna',100],['mas',5]],'Jajka roztrzep z mąką, mlekiem i szczyptą soli.|Smaż na maśle pod przykryciem 3 min z każdej strony.|Nałóż plasterki banana i złóż omlet na pół.'],
['b12','Jajka na twardo z chlebem i ogórkiem','b',12,[['jaj',2],['chl',80],['ogr',0.5],['mas',5]],'Jajka gotuj 9 min od wrzenia i schłodź w zimnej wodzie.|Chleb posmaruj masłem, ułóż plasterki ogórka.|Jajka pokrój, posól i oprósz pieprzem.'],
['l18','Pomidorowa z ryżem','l',30,[['pup',200],['mar',60],['cbl',40],['ryz',50],['smt',30],['kon',15],['olj',5]],'Cebulę i marchew podsmaż na oleju 4 min.|Dodaj koncentrat, pomidory i 400 ml wody, gotuj 15 min.|Ryż ugotuj osobno.|Zupę zabiel śmietaną, dopraw solą, pieprzem i szczyptą cukru (łagodzi kwaśność). Podaj z ryżem.'],
['l19','Kopytka z zrumienioną cebulką','l',40,[['ziem',300],['mka',100],['jaj',1],['cbl',50],['mas',15]],'Ziemniaki ugotuj w mundurkach lub obrane, odcedź i rozgnieć.|Dodaj mąkę, jajko i szczyptę soli, szybko zagnieć ciasto.|Uformuj wałki, pokrój skośnie i gotuj we wrzątku, aż wypłyną (ok. 2 min).|Cebulę zrumień na maśle i polej kopytka.'],
['l20','Kasza gryczana z pieczarkami i czosnkiem','l',30,[['kas',80],['pie',150],['cbl',60],['czn',2],['olj',15]],'Kaszę ugotuj w osolonej wodzie (1 do 2) pod przykryciem 15 min.|Cebulę zeszklij, dodaj pokrojone pieczarki i smaż 8 min na mocnym ogniu, aż się zrumienią.|Dodaj czosnek, sól i pieprz.|Wymieszaj z kaszą.'],
['l21','Leczo z papryki i cukinii z chlebem','l',35,[['pap',2],['cuk',1],['pup',200],['cbl',60],['czn',2],['chl',80],['olj',10]],'Cebulę zeszklij na oleju, dodaj paprykę i cukinię w kostce, smaż 5 min.|Dodaj czosnek, pomidory, słodką paprykę, sól i pieprz.|Duś pod przykryciem 15 min.|Podaj z chlebem.'],
['l22','Fasolka po bretońsku z chlebem','l',30,[['fas',200],['pup',100],['cbl',60],['kon',20],['wed',2],['czn',2],['chl',80],['olj',10]],'Cebulę zeszklij na oleju, dodaj czosnek, koncentrat i wędzoną paprykę na minutę.|Dodaj pomidory i odcedzoną fasolę, gotuj 15 min.|Dopraw solą, pieprzem i oregano.|Podaj z chlebem.'],
['l23','Zupa jarzynowa z ziemniakami','l',35,[['mar',100],['ziem',150],['cbl',40],['wmr',100],['olj',5]],'Cebulę i marchew podsmaż na oleju 4 min.|Dodaj ziemniaki w kostce i 500 ml wody, gotuj 10 min.|Dorzuć warzywa z mrożonki, gotuj jeszcze 8 min.|Dopraw solą, pieprzem i oregano.'],
['l24','Kapusta duszona z ziemniakami i jajkiem sadzonym','l',40,[['kap',250],['ziem',250],['cbl',50],['jaj',1],['olj',15]],'Ziemniaki ugotuj w osolonej wodzie.|Cebulę zeszklij, dodaj poszatkowaną kapustę i duś 20 min pod przykryciem, podlewając wodą.|Dopraw solą, pieprzem i słodką papryką.|Usmaż jajko sadzone i podaj razem.'],
['l25','Leniwe z jogurtem i masłem','l',25,[['twr',250],['mka',80],['jaj',1],['mas',10],['jog',60]],'Twaróg rozgnieć z jajkiem, mąką i szczyptą soli, zagnieć ciasto.|Uformuj wałki, pokrój skośnie i gotuj we wrzątku, aż wypłyną (ok. 2 min).|Polej roztopionym masłem i podaj z jogurtem.'],
['l26','Zapiekanka ziemniaczana z serem i czosnkiem','l',45,[['ziem',300],['zol',50],['smt',60],['czn',2],['mas',5]],'Ziemniaki obierz i pokrój w cienkie plasterki.|Ułóż warstwami w naczyniu, przekładając śmietaną wymieszaną z czosnkiem, solą i pieprzem.|Posyp serem i piecz 35 min w 190°C pod folią, ostatnie 10 min bez.'],
['l27','Omlet z pieczarkami i serem','l',15,[['jaj',3],['pie',80],['zol',30],['chl',60],['mas',5]],'Pieczarki pokrój i smaż na maśle 5 min, aż odparują.|Jajka roztrzep z solą i pieprzem, wlej na patelnię.|Gdy się zetną, posyp serem i złóż na pół. Podaj z chlebem.'],
['l28','Kurczak w sosie śmietanowo-pieczarkowym z makaronem','l',30,[['kur',130],['pie',100],['smt',60],['mak',100],['czn',2],['olj',10]],'Makaron ugotuj w osolonej wodzie.|Kurczaka pokrój w kostkę i zrumień na oleju 5 min.|Dodaj pieczarki i czosnek, smaż 5 min.|Wlej śmietanę, duś 3 min, dopraw solą i pieprzem.|Wymieszaj z makaronem.'],
['l29','Placki z cukinii z czosnkowym jogurtem','l',30,[['cuk',1],['jaj',1],['mka',40],['jog',80],['czn',1],['olj',20]],'Cukinię zetrzyj, posól i odciśnij sok po 5 min.|Dodaj jajko i mąkę, wymieszaj.|Smaż małe placki na oleju po 3 min z każdej strony.|Jogurt wymieszaj z czosnkiem i solą.'],
['l30','Naleśniki wytrawne ze szpinakiem i fetą','l',35,[['mka',60],['jaj',1],['mlk',120],['szp',120],['fet',50],['czn',1],['olj',10]],'Wymieszaj mąkę, jajko i mleko, odstaw na 5 min i usmaż cienkie naleśniki.|Szpinak podgrzej z czosnkiem i odparuj wodę, dodaj pokruszoną fetę.|Nałóż nadzienie i zwiń naleśniki.'],
['s7','Jajko na twardo z pomidorem','s',12,[['jaj',1],['pom',100]],'Jajko ugotuj na twardo (9 min).|Podaj z pokrojonym pomidorem, solą i pieprzem.'],
['s8','Chleb z twarogiem i pomidorem','s',5,[['chl',60],['twr',60],['pom',60]],'Chleb posmaruj twarogiem.|Ułóż plastry pomidora, posól i oprósz pieprzem.']];
const SL={2:'ll',3:'bll',4:'blls',5:'bsl ls'.replace(' ','')},TN={b:'Śniadanie',l:'Obiad',s:'Przekąska'};
const nrm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
const BASE={b1:'płatki',b2:'jajka',b3:'chleb',b4:'naleśniki',b5:'chleb',b6:'jogurt',b7:'płatki',b8:'chleb',b9:'ziemniaki',l1:'makaron',l2:'makaron',l3:'ryż',l4:'ziemniaki',l5:'ryż',l6:'zupa',l7:'makaron',l8:'makaron',l9:'ziemniaki',l10:'ryż',l11:'tortilla',l12:'ziemniaki',l13:'makaron',l14:'ziemniaki',l15:'sałatka',l16:'makaron',l17:'makaron',s1:'banan',s2:'jogurt',s3:'chleb',s4:'twaróg',s5:'warzywa',s6:'jabłko',b10:'ryż',b11:'jajka',b12:'jajka',l18:'zupa',l19:'ziemniaki',l20:'kasza',l21:'leczo',l22:'fasola',l23:'zupa',l24:'ziemniaki',l25:'kluski',l26:'ziemniaki',l27:'jajka',l28:'makaron',l29:'placki',l30:'naleśniki',s7:'jajka',s8:'chleb'};
const KEEP={l1:3,l2:2,l3:2,l4:2,l5:3,l6:3,l7:3,l8:2,l10:3,l12:2,l13:2,l15:2,l16:3,l17:3,l18:3,l19:2,l20:3,l21:3,l22:3,l23:3,l24:2,l26:2,l28:2};
const RB={};R.forEach(r=>RB[r[0]]={id:r[0],name:r[1],type:r[2],time:r[3],ing:r[4],steps:r[5].split('|')});
Object.values(RB).forEach(r=>{r.base=BASE[r.id];r.keep=KEEP[r.id]||0});
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
function cart(ids,own,mult){const m={};ids.forEach((id,i)=>{const k=mult?mult[i]:1;if(!k)return;RB[id].ing.forEach(([p,q])=>{if(!own.has(p))m[p]=(m[p]||0)+q*k})});
 return Object.keys(m).map(p=>{const[n,pk,u,pr,g]=PR[p],k=Math.max(1,Math.ceil(m[p]/pk-1e-9));return{p,name:n,g,need:m[p],packs:k,qty:k*pk,unit:u,price:Math.round(k*pr*100)/100}})}
const sum=l=>Math.round(l.reduce((a,x)=>a+x.price,0)*100)/100;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const fq=(q,u)=>({0.25:'¼',0.5:'½',0.75:'¾',1.5:'1½'}[q]||q)+' '+u;
const scale=(r,k)=>r.ing.map(([p,q])=>PR[p][0]+' '+fq(Math.round(q*k*100)/100,PR[p][2])).concat(['sól, pieprz, oregano, słodka papryka (z domu)']);
function mk(P){const own=have(P),pl=pool(P),days=Number(P.days),sl=SL[P.meals]||SL[3],n=sl.length,prep=P.mode==='prep',types=[];
 for(let d=0;d<days;d++)for(const t of sl)types.push(t);
 const by={b:pl.filter(r=>r.type==='b'),l:pl.filter(r=>r.type==='l'),s:pl.filter(r=>r.type==='s')};
 const lk=likeW(P),liked=ids=>lk.length?ids.filter(id=>RB[id].ing.some(([p])=>lk.some(w=>nrm(PR[p][0]).includes(w)))).length:0;
 const cost=(ids,mult)=>sum(cart(ids,own,mult));
 const lim=t=>Math.max(t==='l'?2:3,Math.ceil(types.filter(x=>x===t).length/((by[t]||[]).length||1)));
 const viol=(ids,grp)=>{let v=0;for(let i=0;i<ids.length;i++){const d=Math.floor(i/n),r=RB[ids[i]];
  for(let j=d*n;j<i;j++){const q=RB[ids[j]];if((!grp||grp[j]!==grp[i])&&(q.id===r.id||q.base===r.base))v+=2}
  if(i>=n&&!(prep&&types[i]==='l')){const q=RB[ids[i-n]];if(q.id===r.id||q.base===r.base)v+=2}
  if(i>=n&&!(prep&&types[i]==='l')){for(let j=(d-1)*n;j<d*n;j++){if(j!==i-n&&ids[j]===ids[i])v+=1}}
  if(i>=2*n&&!(prep&&types[i]==='l')){const q=RB[ids[i-2*n]];if(q.id===r.id||q.base===r.base)v+=0.5}}
  const seen={},cnt={};let G=0;ids.forEach((id,i)=>{const k=RB[id].base+'|'+(grp?grp[i]:i);if(!seen[k]){seen[k]=1;G++;cnt[RB[id].base]=(cnt[RB[id].base]||0)+1}});const thr=Math.max(2,Math.ceil(G/3));Object.keys(cnt).forEach(b=>{if(cnt[b]>thr)v+=cnt[b]-thr});return v};
 return{own,pl,days,sl,n,prep,types,by,liked,cost,lim,viol}}
function genFresh(cx,R0){const{n,types,by,lim}=cx,ids=[],cnt={};
 for(let i=0;i<types.length;i++){const t=types[i],d=Math.floor(i/n),day=ids.slice(d*n);let pick=null;
  for(let a=0;a<25&&!pick;a++){const r=by[t][Math.floor(R0()*by[t].length)];const bad=(cnt[r.id]||0)>=lim(t)||day.some(x=>x===r.id||RB[x].base===r.base)||(i>=n&&(ids[i-n]===r.id||RB[ids[i-n]].base===r.base));if(!bad)pick=r}
  for(let a=0;a<15&&!pick;a++){const r=by[t][Math.floor(R0()*by[t].length)];if(!day.some(x=>x===r.id||RB[x].base===r.base))pick=r}
  if(!pick)pick=by[t][Math.floor(R0()*by[t].length)];cnt[pick.id]=(cnt[pick.id]||0)+1;ids.push(pick.id)}
 return{ids,mult:ids.map(()=>1),grp:ids.map((_,i)=>i)}}
function genPrep(cx,R0){const{n,types,by,days}=cx,N=types.length,ids=new Array(N).fill(null),mult=new Array(N).fill(0),grp=new Array(N).fill(-1),used={},Lidx=[];let bi=0;
 types.forEach((t,i)=>{if(t==='l')Lidx.push(i)});const per=Lidx.length/days,slotAt=(d,p)=>Lidx[d*per+p];
 for(const s of Lidx){if(ids[s]!==null)continue;const li=Lidx.indexOf(s),d0=Math.floor(li/per),p0=li%per,slots=[s];
  for(let t=1;t<=2;t++){const d=d0+t;if(d>=days)break;const order=per>1?(t%2?[1-p0,p0]:[p0,1-p0]):[0];let f=null;for(const p of order){const x=slotAt(d,p);if(ids[x]===null){f=x;break}}if(f===null)break;slots.push(f)}
  let k=slots.length,c=[];for(;;){c=by.l.filter(r=>k===1||r.keep>=k);if(c.length||k===1)break;slots.pop();k--}
  if(!c.length)c=by.l;let pick=null;
  for(let a=0;a<20&&!pick;a++){const r=c[Math.floor(R0()*c.length)];const dayBad=slots.some(x=>{const d=Math.floor(x/n);return ids.slice(d*n,d*n+n).some(y=>y!==null&&RB[y].base===r.base)});if(!used[r.id]&&!dayBad)pick=r}
  for(let a=0;a<10&&!pick;a++){const r=c[Math.floor(R0()*c.length)];if(!used[r.id])pick=r}
  if(!pick)pick=c[Math.floor(R0()*c.length)];used[pick.id]=1;slots.forEach((x,j)=>{ids[x]=pick.id;mult[x]=j===0?k:0;grp[x]=bi});bi++}
 for(let i=0;i<N;i++){if(ids[i]!==null)continue;const t=types[i],d=Math.floor(i/n);let pick=null;
  for(let a=0;a<30&&!pick;a++){const r=by[t][Math.floor(R0()*by[t].length)],day=ids.slice(d*n,d*n+n).filter(y=>y!==null);
   const bad=ids.filter(x=>x===r.id).length>=3||day.some(y=>y===r.id||RB[y].base===r.base)||(i>=n&&ids[i-n]!==null&&(ids[i-n]===r.id||RB[ids[i-n]].base===r.base));if(!bad)pick=r}
  if(!pick)pick=by[t][Math.floor(R0()*by[t].length)];ids[i]=pick.id;mult[i]=1;grp[i]=bi++}
 return{ids,mult,grp}}
function descend(cx,st){const{by,prep,cost,viol,types,lim}=cx,mult=st.mult,grp=st.grp,groups=[...new Set(grp)];let ids=st.ids.slice(),c=cost(ids,mult),v=viol(ids,grp),imp=true,pass=0;
 while(imp&&pass++<12){imp=false;let bm=null;
  for(const g of groups){const slots=[];grp.forEach((x,i)=>{if(x===g)slots.push(i)});const t=types[slots[0]],k=slots.length;
   for(const r of by[t]){if(r.id===ids[slots[0]])continue;if(prep&&t==='l'&&k>1&&r.keep<k)continue;const t2=ids.slice();slots.forEach(i=>t2[i]=r.id);
    if(!(prep&&t==='l')&&t2.filter(x=>x===r.id).length>lim(t))continue;
    const c2=cost(t2,mult),v2=viol(t2,grp);if(v2<=v+1e-9&&c2<c-0.005&&(!bm||c2<bm.c))bm={ids:t2,c:c2,v:v2}}}
  if(bm){ids=bm.ids;c=bm.c;v=bm.v;imp=true}}
 return{ids,mult,grp,c,v}}
function build(st,P,cx){const{ids,mult,grp}=st,{own,n,days,types}=cx,lines=cart(ids,own,mult),tot=sum(lines);
 const gr=Object.keys(GROUPS).map(g=>({category:GROUPS[g],items:lines.filter(x=>x.g===g).map(x=>({item:x.name,qty:x.p==='czn'?x.packs+' główka':x.qty+' '+x.unit,price_pln:x.price}))})).filter(c=>c.items.length);
 const lab=i=>{const d=Math.floor(i/n);let c=0;for(let j=0;j<n;j++){const ii=d*n+j;if(types[ii]==='l'){if(ii===i)return c?'Kolacja':'Obiad';c++}else if(ii===i)return TN[types[ii]]}};
 const members={};grp.forEach((g,i)=>{(members[g]=members[g]||[]).push(i)});
 const dd=[];for(let d=0;d<days;d++){const meals=[];for(let j=0;j<n;j++){const i=d*n+j,g=grp[i],mem=members[g],m={type:lab(i),recipe_id:ids[i],cook:mult[i]>0,k:mem.length};
   if(m.cook&&m.k>1)m.ing=scale(RB[ids[i]],m.k);
   if(!m.cook){const ci=mem.find(x=>mult[x]>0);m.from={day:Math.floor(ci/n)+1,type:lab(ci)};m.until=Math.floor(mem[mem.length-1]/n)+1}
   meals.push(m)}dd.push({day:d+1,meals})}
 const sessions=[];if(cx.prep)Object.keys(members).forEach(g=>{const mem=members[g],ci=mem.find(x=>mult[x]>0);if(types[mem[0]]!=='l'||mem.length<2)return;sessions.push({day:Math.floor(ci/n)+1,type:lab(ci),recipe:RB[ids[ci]].name,k:mem.length,order:ci,eat:mem.map(x=>({day:Math.floor(x/n)+1,type:lab(x)}))})});
 sessions.sort((a,b)=>a.order-b.order);const used=[...new Set(ids)];
 return{id:'p'+Date.now(),lang:'Polski',engine:2,mode:cx.prep?'prep':'fresh',summary:'Plan na '+days+' dni: '+tot.toFixed(2).replace('.',',')+' zł.',ids:ids,mult:mult,grp:grp,days:dd,sessions:sessions,
  recipes:used.map(id=>{const r=RB[id];return{id,name:r.name,time_min:r.time,servings:1,ingredients:scale(r,1),steps:r.steps}}),grocery:gr,tips:[],removed:[...cx.own].map(p=>PR[p][0])}}
function plan(P,seed){const cx=mk(P),R0=rng(seed==null?Date.now():seed);
 for(const t of new Set(cx.sl))if(!cx.by[t].length)return{error:'Za mało przepisów dla tych ustawień (baza jest jeszcze mała).'};
 const gen=cx.prep?genPrep:genFresh;let best=null,bs=-1e9;const cheap=[];
 const IT=P.iters||1500;for(let it=0;it<IT;it++){const st=gen(cx,R0),c=cx.cost(st.ids,st.mult),v=cx.viol(st.ids,st.grp),u=new Set(st.ids).size;
  const s=c<=P.budget?1000+u*10+cx.liked(st.ids)*4-v*40+R0():-c-v*25;if(s>bs){bs=s;best=st}
  if(c>P.budget){cheap.push([c+v*25,st]);if(cheap.length>60){cheap.sort((a,b)=>a[0]-b[0]);cheap.length=8}}}
 if(bs<0){cheap.sort((a,b)=>a[0]-b[0]);let bc=1e9;for(const [,st0] of cheap.slice(0,8)){const d=descend(cx,st0),sc=d.c+d.v*25;if(sc<bc){bc=sc;best={ids:d.ids,mult:d.mult,grp:d.grp}}}}
 const out=build(best,P,cx);out.over=cx.cost(best.ids,best.mult)>P.budget;out.pool=cx.pl.length;return out}
function swap(p,P,idx,seed){const cx=mk(P),R0=rng(seed==null?Date.now():seed),st={ids:p.ids.slice(),mult:p.mult.slice(),grp:p.grp.slice()},g=st.grp[idx],slots=[];
 st.grp.forEach((x,i)=>{if(x===g)slots.push(i)});const t=cx.types[slots[0]],k=slots.length,cur=st.ids[slots[0]],v0=cx.viol(st.ids,st.grp);
 let c=cx.by[t].filter(r=>r.id!==cur&&!(cx.prep&&t==='l'&&k>1&&r.keep<k)).map(r=>{const ids=st.ids.slice();slots.forEach(i=>ids[i]=r.id);return{ids,c:cx.cost(ids,st.mult),v:cx.viol(ids,st.grp)}});
 if(!c.length)return p;const good=c.filter(x=>x.v<=v0+1e-9);if(good.length)c=good;c.sort((a,b)=>a.c-b.c);const ok=c.filter(x=>x.c<=P.budget),ch=(ok.length?ok:c).slice(0,3),pick=ch[Math.floor(R0()*ch.length)];
 const out=build({ids:pick.ids,mult:st.mult,grp:st.grp},P,cx);out.over=pick.c>P.budget;return out}
function cheaper(p,P){const cx=mk(P),st={ids:p.ids.slice(),mult:p.mult.slice(),grp:p.grp.slice()},c0=cx.cost(st.ids,st.mult),v0=cx.viol(st.ids,st.grp);let best=null,bc=c0-0.005;
 const d=descend(cx,st);if(d.c<bc){bc=d.c;best={ids:d.ids,mult:d.mult,grp:d.grp}}
 for(let s=1;s<=3;s++){const q=plan(Object.assign({},P,{budget:1,iters:400}),s*7919);if(q.error)continue;const c=cx.cost(q.ids,q.mult);if(c<bc&&cx.viol(q.ids,q.grp)<=v0+1e-9){bc=c;best={ids:q.ids,mult:q.mult,grp:q.grp}}}
 if(!best)return null;const out=build(best,P,cx);out.over=bc>P.budget;return out}
function rescue(text,P){const own=new Set(),unknown=[],P2=P||{};
 nrm(text).split(/[,;\n]/).map(x=>x.trim()).filter(x=>x.length>2).forEach(w=>{const hit=Object.keys(PR).filter(p=>PR[p][4]!=='z'&&(nrm(PR[p][0]).includes(w)||(w.length>4&&w.includes(nrm(PR[p][0]).split(' ')[0].slice(0,5)))));if(hit.length)hit.forEach(h=>own.add(h));else unknown.push(w)});
 const list=pool(P2).map(r=>{const used=r.ing.filter(([p])=>own.has(p)).map(([p])=>PR[p][0]);if(!used.length)return null;const miss=cart([r.id],own),mc=sum(miss);
  return{id:r.id,name:r.name,time:r.time,used:used,missing:miss.map(x=>({name:x.name,price:x.price})),missingCost:mc,score:used.length*10+(r.type==='l'?8:r.type==='b'?4:0)-mc*0.7,ingredients:r.ing.map(([p,q])=>PR[p][0]+' '+fq(q,PR[p][2])),steps:r.steps}}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5);
 return{list:list,unknown:unknown,matchedNames:[...own].map(p=>PR[p][0])}}
const api={PR,RB,GROUPS,plan,swap,cheaper,pool,have,cart,sum,rescue};
if(typeof module!=='undefined')module.exports=api;else root.GrEngine=api;
})(this);
