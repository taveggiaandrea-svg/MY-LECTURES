/* Lezione 14: casi applicati, cancellazioni alberghiere con tre modelli ad albero e abbandono dei clienti di una banca */
const LEFTC=ORG,KEEPC=BLUE,HONC=GRN;
INIT[14]=function(){
  /* three confusion matrices, hotel */
  (function(){
    const t=el('div','trio');$('#b14cm').append(t);
    [['Albero di decisione',{tp:9944,fn:3314,fp:2069,tn:20434}],['Random forest',{tp:10293,fn:2965,fp:1381,tn:21122}],['Gradient boosting',{tp:9790,fn:3468,fp:1690,tn:20813}]].forEach(([n,m])=>
      cell(t,n,cm12(70,46,m,['Yes','No'],{w:82,h:52,fs:15,noside:1}),250,160,'Matrice di confusione: '+n,'mancate <b>'+fi(m.fn,0)+'</b> · falsi allarmi <b>'+fi(m.fp,0)+'</b>'));
  })();
  /* errors by model */
  (function(){
    let s='';const M=[['Albero',3314,2069],['Random forest',2965,1381],['Gradient boosting',3468,1690]],B=200,T=24,Y=v=>B-v/4000*(B-T);
    [0,1000,2000,3000,4000].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,0),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,a,b],i)=>{const x=100+i*190;s+=rect(x,Y(a),60,B-Y(a),RED)+rect(x+68,Y(b),60,B-Y(b),ORG)+tx(x+30,Y(a)-6,fi(a,0),{s:12.5,f:'#fff'})+tx(x+98,Y(b)-6,fi(b,0),{s:12.5,f:'#fff'})+tx(x+64,B+20,n,{s:13,f:'#ddd'})});
    s+=line(50,B,660,B,'#777',1.2)+rect(330,4,12,12,RED)+tx(348,15,'cancellazioni mancate',{s:12.5,f:'#ddd',a:'start'})+rect(510,4,12,12,ORG)+tx(528,15,'falsi allarmi',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b14err'),680,230,s,'Errori dei tre modelli','42rem');
  })();
  /* special agreements split */
  (function(){
    let s='';const G=[['almeno un conto in convenzione',1581,5],['nessuna convenzione',2631,2101]];
    G.forEach(([n,tot,ch],i)=>{const y=30+i*84,w=560*tot/2631;s+=tx(20,y,n+' · '+fi(tot,0)+' clienti',{s:13.5,f:'#ddd',a:'start'});
      s+=rect(20,y+10,w*ch/tot,34,LEFTC)+rect(20+w*ch/tot,y+10,w*(1-ch/tot),34,KEEPC)+tx(20+w+10,y+33,fi(ch/tot*100,1)+'% se ne va',{s:14,f:LEFTC,a:'start',w:600})});
    s+=rect(20,200,12,12,LEFTC)+tx(38,211,'se ne va',{s:12.5,f:'#ddd',a:'start'})+rect(120,200,12,12,KEEPC)+tx(138,211,'resta',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b14conv'),720,222,s,'Abbandono per conti in convenzione','44rem');
  })();
  /* row flow */
  (function(){
    let s='<defs>'+arrowDef('b14a','#888')+'</defs>';
    const box=(x,y,w,t1,n,p,c)=>{let r=rect(x,y,w,62,'#111',c||'#bbb',' rx="6"')+tx(x+w/2,y+20,t1,{s:12.5,f:GRAY})+tx(x+w/2,y+40,fi(n,0)+' righe',{s:14,f:'#fff',w:600});
      r+=rect(x+10,y+48,(w-20)*p,6,LEFTC)+rect(x+10+(w-20)*p,y+48,(w-20)*(1-p),6,KEEPC)+tx(x+w/2,y+76,fi(p*100,1)+'% se ne va',{s:12,f:LEFTC});return r};
    s+=box(10,20,150,'come consegnato',4212,.5)+box(200,20,150,'solo conto corrente',3944,.534)+box(400,0,140,'training 70%',2760,.534)+box(400,110,140,'test 30%',1184,.534,YEL)+box(580,0,130,'training bilanciato',2572,.5,HONC);
    s+=line(160,51,196,51,'#888',1.5,' marker-end="url(#b14a)"')+line(350,45,396,31,'#888',1.5,' marker-end="url(#b14a)"')+line(350,60,396,140,'#888',1.5,' marker-end="url(#b14a)"')+line(540,31,576,31,'#888',1.5,' marker-end="url(#b14a)"');
    s+=tx(180,42,'−268',{s:12,f:GRAY})+tx(645,104,'Equal Size Sampling',{s:12,f:HONC})+tx(645,150,'il test resta',{s:12.5,f:YEL})+tx(645,168,'com\'è',{s:12.5,f:YEL});
    svgBox($('#b14flow'),720,196,s,'Righe a ogni passo della preparazione','46rem');
  })();
  /* before / after */
  (function(){
    let s='';const M=[['Albero di decisione',.942,.682],['Random forest / Tree Ensemble',.911,.752],['Gradient boosting (H2O)',.754,.762]],B=210,T=24,Y=v=>B-(v-.5)/.5*(B-T);
    [.5,.6,.7,.8,.9,1].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,a,b],i)=>{const x=90+i*195;s+=rect(x,Y(a),62,B-Y(a),'#8a8a8a')+rect(x+70,Y(b),62,B-Y(b),HONC)+tx(x+31,Y(a)-6,fi(a,3),{s:12.5,f:'#ddd'})+tx(x+101,Y(b)-6,fi(b,3),{s:12.5,f:HONC,w:600})+tx(x+66,B+20,n,{s:12.5,f:'#ddd'});
      const d=Math.round((b-a)*100);s+=tx(x+66,B+38,(d>0?'+':'−')+Math.abs(d)+(Math.abs(d)===1?' punto':' punti'),{s:12,f:d<0?RED:HONC})});
    s+=line(50,B,660,B,'#777',1.2)+rect(370,4,12,12,'#8a8a8a')+tx(388,15,'workflow consegnato',{s:12.5,f:'#ddd',a:'start'})+rect(530,4,12,12,HONC)+tx(548,15,'workflow corretto',{s:12.5,f:'#ddd',a:'start'})+tx(50,14,'(l\'asse parte da 0,5)',{s:11.5,f:GRAY,a:'start'});
    svgBox($('#b14ba'),680,260,s,'Accuratezza prima e dopo','42rem');
  })();
  /* GBM importance */
  (function(){
    const V=[['tenure (anzianità)',15.8,1],['contatore dei movimenti',6.3,1],['age (età)',5.9,1],['area',5.5,1],['carte e utenze',4.1,1],['indicatore di problematicità',4.0,1],['strategy (strategia)',2.4,1],['saldo passivo, trimestre −1',2.2,0],['accrediti di pensione o stipendio, trimestre −3',2.1,0],['movimenti di addebito, trimestre −3',2.1,0]];
    let s='';const L=330,X=v=>L+v/18*330;V.forEach(([n,v,p],i)=>{const y=8+i*28;s+=tx(L-10,y+16,n,{s:12.5,f:'#ddd',a:'end'})+rect(L,y+4,X(v)-L,17,p?BLUE:'#8a8a8a')+tx(X(v)+8,y+17,fi(v,1)+'%',{s:12.5,f:'#fff',a:'start'})});
    svgBox($('#b14imp'),720,V.length*28+14,s,'Importanza delle variabili nel GBM','44rem');
  })();
  /* three patterns */
  (function(){
    const t=el('div','trio');$('#b14pat').append(t);
    const P=[['Per prodotti posseduti',[['0',77.5],['1',56.0],['2',49.2],['3',49.0],['4+',36.5]],[0],[4]],['Per fascia d\'età',[['&lt;30',48.4],['30-40',52.2],['40-50',49.5],['50-60',53.7],['60+',62.7]],[4],[]],['Per anni di rapporto',[['0-2',48.9],['3-5',50.9],['6-8',44.9],['9-11',51.5],['12+',62.6]],[4],[2]]];
    P.forEach(([n,b,hi,lo])=>cell(t,n,vbars11(b.map(([l,v],i)=>[l,v,hi.includes(i)?RED:lo.includes(i)?GRN:'#8a8a8a']),{W:260,H:190,max:85,bw:34,L:6,R:6}),260,190,'Abbandono '+n,''));
  })();
  /* call list */
  (function(){
    let s='';const B=190,Y=v=>B-v/300*(B-20);
    [[ 'a caso',160,'#8a8a8a'],['primi 300 del modello',276,HONC]].forEach(([n,v,c],i)=>{const x=110+i*230;s+=rect(x,Y(300),120,B-Y(300),'none','#444',' stroke-dasharray="4 3"')+rect(x,Y(v),120,B-Y(v),c)+tx(x+60,Y(v)+24,'≈ '+v,{s:17,f:'#000',w:600})+tx(x+60,B+20,n,{s:13,f:'#ddd'})});
    s+=line(80,B,600,B,'#777',1.2)+tx(600,14,'300 chiamate (tratteggio)',{s:12,f:GRAY,a:'end'})+lbl(285,Y(218),'+116 clienti',HONC,{s:14,w:600});
    s+=tx(170,Y(300)-6,'clienti in uscita trovati',{s:12,f:GRAY});
    svgBox($('#b14call'),640,220,s,'Clienti trovati con 300 chiamate','40rem');
  })();
};
QZ['14a']=()=>[{q:'Sulle 35.761 prenotazioni di test, quante sono state cancellate davvero, e quale accuratezza otterrebbe un modello che prevede sempre «No»?',o:['13.258 e 0,629','22.503 e 0,371','13.258 e 0,500','10.293 e 0,878'],a:0,
  e:'Cancellazioni vere = TP + FN = 10.293 + 2.965 = 13.258 (37,1%). Prevedendo sempre No si indovinano le 22.503 non cancellate: 22.503 / 35.761 = 0,629.',h:'Somma la riga Yes di una matrice qualsiasi.'}];
QZ['14b']=()=>[{q:'Quale domanda permette di scartare una colonna come «conti aperti dopo l\'abbandono» anche se predice benissimo?',o:['Che cosa significa questa colonna?','Quando viene misurata, rispetto al momento della previsione?','Quanti valori mancanti ha?','È numerica o categorica?'],a:1,
  e:'Il leakage riguarda il momento della misura: una colonna misurata dopo l\'evento contiene la risposta e non sarà disponibile quando servirà prevedere.',h:'Le slide dicono: non che cosa significa, ma quando.'}];
QZ['14c']=()=>[{q:'Uno studente bilancia l\'intero dataset (50% e 50%) e poi lo divide in training e test. Che cosa non va?',o:['Niente, l\'ordine non conta','Il test ha una distribuzione delle classi che non esiste nella realtà: le misure non valgono per i dati veri','Il training ha troppe righe','Bisognava bilanciare solo il test'],a:1,
  e:'Prima si divide (in modo stratificato), poi si bilancia solo il training. Il test deve conservare la distribuzione naturale, perché è la misura che si riporta.',h:'Su quali dati deve essere misurato il modello?'}];
QZ['14d']=()=>[{q:'La filiale può fare 300 chiamate. Perché la lista si taglia a 300 invece di usare la soglia 0,5?',o:['Perché 0,5 è sempre sbagliata','Perché la lunghezza della lista la decide la capacità della filiale, non una soglia statistica','Perché il modello non dà probabilità','Perché 300 è il 25% dei clienti di test'],a:1,
  e:'Con la soglia 0,5 i clienti segnalati sarebbero 638, più delle chiamate possibili. Si ordinano per probabilità e si prendono i primi 300.',h:'Quanti clienti segnala la soglia 0,5?'}];
QZ['14']=()=>[
  {q:'Nel caso degli hotel la random forest ha TP = 10.293 e FP = 1.381. Quanto vale la precisione?',o:['0,776','0,882','0,939','0,878'],a:1,
   e:'10.293 / (10.293 + 1.381) = 10.293 / 11.674 ≈ 0,882.',h:'Delle prenotazioni previste cancellate, quante lo sono davvero?'},
  {q:'Se per l\'albergo un falso allarme (cliente da spostare in un altro albergo) costa più di una cancellazione mancata, come si muove la soglia?',o:['Si abbassa sotto 0,5','Si alza sopra 0,5','Resta 0,5','Si sceglie il modello con l\'accuratezza più alta'],a:1,
   e:'Alzando la soglia si segnalano meno prenotazioni: meno falsi allarmi, al prezzo di qualche cancellazione mancata in più.',h:'Quale soglia produce meno previsioni positive?'},
  {q:'Le 87 colonne z-score della banca sono copie standardizzate delle colonne grezze. Che effetto hanno su un albero?',o:['Lo migliorano, perché i dati sono normalizzati','Nessun guadagno: dividono l\'importanza fra gemelli identici e raddoppiano lo spazio delle variabili','Causano leakage','Rendono impossibile il bilanciamento'],a:1,
   e:'Una standardizzazione è lineare: correlazione 1,000, nessuna informazione nuova. Togliendole l\'accuratezza è rimasta uguale (0,904 → 0,909).',h:'Che correlazione hanno una colonna e il suo z-score?'},
  {q:'Quali due sintomi dovevano far sospettare del workflow consegnato?',o:['Accuratezza bassa e AUC bassa','Sensibilità 0,997 dell\'albero e l\'albero singolo che batte l\'insieme di alberi','Troppi valori mancanti e poche righe','Il boosting più lento della foresta'],a:1,
   e:'Niente nel comportamento dei clienti è prevedibile al 99,7%, e una media di alberi non può migliorare una colonna che è già la risposta.',h:'Rileggi il paragrafo sui numeri lusinghieri.'},
  {q:'Le slide notano che i cicli di ottimizzazione valutano sulla parte di test. Che cosa implica per l\'AUC migliore trovata?',o:['È pessimista','È ottimista: i parametri sono stati scelti guardando il test','È esatta','Non cambia nulla perché si usa l\'AUC e non l\'accuratezza'],a:1,
   e:'Un test usato per scegliere i parametri non è più indipendente. La versione pulita regola su una parte di validazione.',h:'Ricorda il ruolo dell\'insieme di validazione nella lezione 12.'},
  {q:'Con 300 chiamate il modello trova 276 clienti in uscita contro circa 160 a caso. Se il 30% dei clienti raggiunti accetta l\'offerta, quanti clienti in più trattiene il modello rispetto alla scelta casuale?',o:['Circa 35','Circa 83','Circa 116','Circa 48'],a:0,
   e:'Modello: 276 × 0,3 ≈ 83; a caso: 160 × 0,3 = 48. Differenza: circa 35 clienti trattenuti in più, cioè 116 × 0,3.',h:'Applica il 30% ai due numeri, poi sottrai.'}
];
MAPPA[14]={c:'Quando ci si può fidare di un modello?',r:[
  {t:'Caso hotel',c:BLUE,v:['Training 83.442, test 35.761, seme 42','Foresta migliore: 0,878, AUC 0,948','Sempre No: 0,629']},
  {t:'Dai punteggi alle decisioni',c:ORG,v:['Mancata: camera vuota','Falso allarme: ospite da spostare','Modello sull\'AUC, soglia sui costi']},
  {t:'Trappole della banca',c:RED,v:['87 copie z-score, correlazione 1','Convenzioni: 0,3% contro 79,9%','Colonne post-evento: leakage','Prova dell\'azione']},
  {t:'Dividere e bilanciare',c:YEL,v:['Prima stratificare 70/30','Poi bilanciare solo il training','Fissare i semi, regolare sulla validazione']},
  {t:'Risultati onesti',c:GRN,v:['Albero 0,942 → 0,682','GBM 0,762, AUC 0,844','Anzianità, età, prodotti, area']},
  {t:'Lista di chiamate',c:PINK,v:['Ordinare, tagliare, agire, misurare','300 chiamate: 276 contro 160','Costo delle chiamate contro margine']}]};
