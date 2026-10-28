// Google Apps Script: wklej do Arkusza Google (Rozszerzenia > Apps Script), wdróż jako Aplikację internetową (dostęp: Każdy).
function doPost(e){var sh=SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];var d={};try{d=JSON.parse(e.postData.contents)}catch(x){}
 sh.appendRow([d.t||new Date().toISOString(),d.uid||'',d.ev||'',JSON.stringify(d)]);return ContentService.createTextOutput('ok')}
// Uruchom ręcznie (Uruchom > summary), żeby zobaczyć podsumowanie w zakładce "Podsumowanie".
function summary(){var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheets()[0],rows=sh.getDataRange().getValues(),U={};
 rows.forEach(function(r){var u=r[1],ev=r[2];if(!u)return;U[u]=U[u]||{p:0,a:0,s:0,d:0,rc:[]};var o=U[u],d={};try{d=JSON.parse(r[3])}catch(x){}
  if(ev=='plan')o.p++;if(ev=='plan_again')o.a++;if(ev=='list_start')o.s++;if(ev=='list_done')o.d++;if(ev=='receipt')o.rc.push(d.diff_pct)});
 var n=0,a=0,s=0,dn=0,rc=[],k;for(k in U){var o=U[k];if(o.p+o.a==0)continue;n++;if(o.a>0)a++;if(o.s>0)s++;if(o.d>0)dn++;rc=rc.concat(o.rc)}
 var avg=rc.length?rc.reduce(function(x,y){return x+Math.abs(y)},0)/rc.length:'';var out=ss.getSheetByName('Podsumowanie')||ss.insertSheet('Podsumowanie');out.clear();
 out.getRange(1,1,6,2).setValues([['Użytkownicy z planem',n],['Wygenerowali drugi plan (%)',n?a/n:''],['Zaczęli odhaczać listę (%)',n?s/n:''],['Odhaczyli całą listę (%)',n?dn/n:''],['Paragony (liczba)',rc.length],['Średni błąd ceny (|%|)',avg]])}
