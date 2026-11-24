/* Lezione 15: text analytics, sentiment e topic sui tweet alle compagnie aeree (Twitter US Airline Sentiment) */
const NEGC=RED,NEUC='#9a9a9a',POSC=GRN,HUMC=BLUE,LEXC=YEL;
/* 3x3 confusion heat matrix with row percentages */
function cm15(rows,lab){let s='';const x0=120,y0=56,w=72,h=44;
  s+=tx(x0+1.5*w,y0-34,'classe prevista',{s:12,f:GRAY})+tx(20,y0+1.5*h,'classe umana',{s:12,f:GRAY,x:' transform="rotate(-90 20 '+(y0+1.5*h)+')"'});
  lab.forEach((l,j)=>{s+=tx(x0+j*w+w/2,y0-10,l,{s:12,f:'#ddd'})+tx(x0-8,y0+j*h+h/2+5,l,{s:12,f:'#ddd',a:'end'})});
  rows.forEach((r,i)=>{const tot=r.reduce((a,b)=>a+b,0);r.forEach((v,j)=>{const p=v/tot;s+=rect(x0+j*w,y0+i*h,w,h,i===j?'rgba(131,193,103,'+(0.15+p*.7).toFixed(2)+')':'rgba(252,98,85,'+(0.08+p*.7).toFixed(2)+')','#000');
    s+=tx(x0+j*w+w/2,y0+i*h+20,Math.round(p*100)+'%',{s:14,f:'#fff',w:600})+tx(x0+j*w+w/2,y0+i*h+36,fi(v,0),{s:11,f:'#ccc'})})});
  return s}
INIT[15]=function(){
  /* bag of words vs embeddings */
  (function(){
    const duo=el('div','duo');$('#b15bow').append(duo);
    const cols=[{t:'tweet',w:134},{t:'delayed',w:62,a:'m'},{t:'hours',w:54,a:'m'},{t:'bag',w:42,a:'m'},{t:'great',w:52,a:'m'}];
    const one=v=>({v:String(v),f:v?'#fff':'#555',b:!!v,bg:v?'rgba(88,196,221,.22)':null});
    const t=sTab(0,0,cols,[['«delayed 3 hours»',1,1,0,0],['«lost my bag»',0,0,1,0],['«great crew»',0,0,0,1]].map(r=>[r[0]].concat(r.slice(1).map(one))),{rh:30});
    tabCell(duo,'Bag of words',t,'Trasparente ma <b>sparso</b>: i sinonimi non si toccano.',340);
    let b=line(14,176,326,176,'#555',1)+line(14,176,14,10,'#555',1);
    [[['delayed',70,40],['late',110,58],['hours',62,78]],[['bag',230,52],['luggage',272,76],['suitcase',226,98]],[['great',110,140],['love',160,124],['thanks',188,152]]].forEach((g,k)=>{const c=[ORG,BLUE,GRN][k];
      g.forEach(([w,x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+c+'"/>'+tx(x+8,y+4,w,{s:12.5,f:c,a:'start'}))});
    cell(duo,'Embedding (mappa illustrativa)',b,340,186,'Embedding','Significati simili stanno <b>vicini</b>.');
  })();
  /* LDA idea */
  (function(){
    let s='';const T=[['Topic A','delayed · gate · hours · plane',ORG],['Topic B','bag · lost · luggage · baggage',BLUE],['Topic C','cancelled · hold · phone · rebook',PINK]];
    T.forEach(([n,w,c],i)=>{const y=24+i*62;s+=rect(10,y,250,46,'#111',c,' rx="6"')+tx(22,y+19,n,{s:13,f:c,a:'start',w:600})+tx(22,y+37,w,{s:12,f:'#ccc',a:'start'})});
    const D=[['«Flight cancelled, 2 h on hold to rebook»',[[.15,0],[0,1],[.85,2]]],['«Sitting at the gate 3 hours, now my bag is lost»',[[.55,0],[.45,1]]],['«Lost luggage again, nobody answers the phone»',[[.7,1],[.3,2]]]];
    D.forEach(([t,mix],i)=>{const y=24+i*62;s+=tx(300,y+16,t,{s:12.5,f:'#ddd',a:'start'});let x=300;mix.forEach(([p,k])=>{if(p>0){s+=rect(x,y+26,p*400,14,T[k][2]);x+=p*400}})});
    s+=tx(135,14,'ogni topic: un miscuglio di parole',{s:12,f:GRAY})+tx(500,14,'ogni tweet: un miscuglio di topic',{s:12,f:GRAY});
    svgBox($('#b15lda'),720,212,s,'Idea della Latent Dirichlet Allocation','46rem');
  })();
  /* labels */
  (function(){
    const duo=el('div','duo');$('#b15lab').append(duo);
    cell(duo,'Etichette umane',vbars11([['negativo',62.7,NEGC],['neutro',21.2,NEUC],['positivo',16.1,POSC]],{max:72,H:200}),340,200,'Etichette umane','<b>9.084</b> tweet negativi su 14.485.');
    const R=[['Customer Service Issue',2883],['Late Flight',1652],['Can\'t Tell',1183],['Cancelled Flight',831],['Lost Luggage',718],['Bad Flight',573],['Flight Booking Problems',521]];
    let b='';R.forEach(([n,v],i)=>{const y=8+i*26;b+=tx(160,y+16,n,{s:12,f:'#ddd',a:'end'})+rect(166,y+4,v/2883*120,16,NEGC)+tx(172+v/2883*120,y+17,fi(v,0),{s:11.5,f:'#fff',a:'start'})});
    cell(duo,'Motivi dei tweet negativi',b,340,194,'Motivi dei tweet negativi','I sette motivi più frequenti.');
  })();
  /* confusion matrices */
  (function(){
    const duo=el('div','duo');$('#b15cm').append(duo);const L=['neg','neu','pos'];
    cell(duo,'Dizionario, 14.485 tweet',cm15([[3720,3856,1508],[346,2034,687],[119,699,1516]],L),340,196,'Dizionario','Accuratezza <b>50%</b>, κ 0,27.');
    cell(duo,'Random forest, 4.147 tweet di test',cm15([[2305,245,117],[368,346,107],[175,77,407]],L),340,196,'Random forest','Accuratezza <b>74%</b>, κ 0,48.');
  })();
  /* airlines humans vs lexicon */
  (function(){
    let s='';const A=[['US Airways',77.7,36],['American',71.7,30],['United',68.9,33],['Southwest',49.0,21],['Delta',43.0,21],['Virgin America',35.9,18]],B=210,T=20,Y=v=>B-v/85*(B-T);
    [0,20,40,60,80].forEach(v=>s+=line(40,Y(v),680,Y(v),'#1d1d1d',1)+tx(34,Y(v)+4,v+'%',{s:12,f:GRAY,a:'end'}));
    A.forEach(([n,h,l],i)=>{const x=60+i*104;s+=rect(x,Y(h),40,B-Y(h),HUMC)+rect(x+44,Y(l),40,B-Y(l),LEXC)+tx(x+20,Y(h)-6,Math.round(h)+'%',{s:12.5,f:'#fff'})+tx(x+64,Y(l)-6,l+'%',{s:12.5,f:'#fff'})+tx(x+42,B+20,n,{s:12.5,f:'#ddd'})});
    s+=line(40,B,680,B,'#777',1.2)+rect(470,2,12,12,HUMC)+tx(488,13,'persone',{s:12.5,f:'#ddd',a:'start'})+rect(570,2,12,12,LEXC)+tx(588,13,'dizionario',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b15air'),700,236,s,'Quota di tweet negativi per compagnia','44rem');
  })();
  /* topics negative share */
  (function(){
    const Tp=[['Ritardi e cancellazioni',72,36],['Attesa al telefono e riprenotazioni',70,24],['Assistenza e personale',67,38],['Bagagli',61,31],['Posti, miglia e upgrade',56,24],['Complimenti e promozioni',22,10]];
    let s='';const L=250,X=v=>L+v/80*400;Tp.forEach(([n,h,l],i)=>{const y=10+i*44;s+=tx(L-10,y+22,n,{s:12.5,f:'#ddd',a:'end'})+rect(L,y+4,X(h)-L,16,HUMC)+rect(L,y+22,X(l)-L,14,LEXC)+tx(X(h)+6,y+17,h+'%',{s:12,f:'#fff',a:'start'})+tx(X(l)+6,y+34,l+'%',{s:12,f:'#fff',a:'start'})});
    s+=rect(L,Tp.length*44+18,12,12,HUMC)+tx(L+18,Tp.length*44+29,'persone',{s:12.5,f:'#ddd',a:'start'})+rect(L+110,Tp.length*44+18,12,12,LEXC)+tx(L+128,Tp.length*44+29,'dizionario',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b15topic'),700,Tp.length*44+40,s,'Quota di tweet negativi per topic','44rem');
  })();
};
QZ['15a']=()=>[{q:'Il tweet «still no response from AA. great job guys!» contiene la parola «great». Che cosa conclude un dizionario, e perché sbaglia?',o:['Negativo: riconosce l\'ironia','Positivo: conta «great» e non vede l\'ironia','Neutro: non conosce «AA»','Non lo classifica: è troppo corto'],a:1,
  e:'Un dizionario conta le parole positive e negative senza contesto: «great» lo fa pendere verso il positivo, ma è ironico.',h:'Che cosa conta un dizionario?'}];
QZ['15b']=()=>[{q:'Un tweet ha 3 parole positive e 1 negativa del lessico. Quanto vale il punteggio del dizionario, e quale classe ne esce?',o:['0,75, positive','0,5, positive','2, positive','−0,5, negative'],a:1,
  e:'(3 − 1) / (3 + 1) = 2 / 4 = 0,5: maggiore di zero, quindi «positive».',h:'(positive − negative) / (positive + negative).'}];
QZ['15c']=()=>[{q:'Se il dizionario sottostima la negatività di tutte le compagnie, perché può ancora servire per un indicatore mensile del marchio?',o:['Perché il livello assoluto è giusto','Perché ordina le compagnie quasi come le persone (correlazione di rango 0,94): contano tendenza e classifica','Perché è più accurato della random forest','Non serve a nulla'],a:1,
  e:'Per confrontare concorrenti e seguire la tendenza conta l\'ordine, non il livello: e l\'ordine è quasi lo stesso degli annotatori.',h:'Guarda la figura delle compagnie.'}];
QZ['15d']=()=>[{q:'Quale risultato della lezione permette a un manager di agire, oltre a sapere che i clienti sono scontenti?',o:['L\'accuratezza del dizionario','Topic incrociati con il sentiment: che cosa non piace, e a chi','Il numero di termini nel bag of words','Il numero di iterazioni dell\'LDA'],a:1,
  e:'Topic per sentiment dice quali temi sono più negativi e per quale compagnia: un problema proprio o di tutto il settore.',h:'Rileggi la frase dopo la tabella dei topic per compagnia.'}];
QZ['15']=()=>[
  {q:'Su 14.485 tweet il dizionario ne classifica bene 3.720 negativi, 2.034 neutri e 1.516 positivi. Qual è la sua accuratezza?',o:['circa 26%','circa 50%','circa 63%','circa 74%'],a:1,
   e:'(3.720 + 2.034 + 1.516) / 14.485 = 7.270 / 14.485 ≈ 0,50.',h:'Somma la diagonale e dividi per il totale.'},
  {q:'Perché il workflow sostituisce «Cancelled Flightled» con «cancelled» prima di tutto il resto?',o:['Per accorciare i tweet','Perché l\'artefatto crea parole finte e fa trapelare nel testo l\'etichetta del motivo: un leakage','Perché KNIME non accetta le maiuscole','Per tradurre i tweet'],a:1,
   e:'Le etichette «Late Flight» e «Cancelled Flight» erano state scritte dentro 1.408 tweet: un modello avrebbe imparato l\'etichetta, non il linguaggio dei clienti.',h:'Ricorda la lezione 14 sulle colonne che conoscono la risposta.'},
  {q:'In quale ordine conviene applicare Dictionary Tagger e Stop Word Filter?',o:['Prima le parole vuote, poi il tagger','Prima il tagger, poi le parole vuote, altrimenti «not» e «no» spariscono','L\'ordine non conta','Il tagger non serve se si tolgono le parole vuote'],a:1,
   e:'Le liste di parole vuote contengono negazioni come «not» e «no», che contano per il sentiment: vanno marcate prima.',h:'Che cosa c\'è nelle liste di parole vuote?'},
  {q:'Quale differenza fra bag of words ed embedding è corretta?',o:['Il bag of words conserva l\'ordine delle parole','Negli embedding parole con significati simili hanno vettori vicini; nel bag of words i sinonimi sono colonne senza legame','Gli embedding sono più trasparenti','Il bag of words richiede un modello pre-addestrato'],a:1,
   e:'Il bag of words è trasparente e sparso, con una colonna per parola; gli embedding sono vettori densi in cui la vicinanza riflette il significato.',h:'Guarda i due riquadri della figura.'},
  {q:'Nel Topic Extractor si impostano α = 0,1 e β = 0,01. Che cosa vogliono dire valori così piccoli?',o:['Molti topic per tweet e molte parole per topic','Pochi topic per tweet e poche parole per topic','Pochi tweet per topic','Che le iterazioni sono poche'],a:1,
   e:'α piccolo concentra ogni documento su pochi topic, β piccolo concentra ogni topic su poche parole: adatto a tweet brevi e topic leggibili.',h:'α riguarda i documenti, β i topic.'},
  {q:'La random forest arriva al 74% di accuratezza contro il 50% del dizionario. Qual è il prezzo principale?',o:['È più lenta da eseguire su un tweet','Servono migliaia di tweet etichettati da persone, e va riaddestrata quando il linguaggio cambia','Non si può usare in KNIME','Non funziona sui tweet negativi'],a:1,
   e:'Il machine learning supervisionato impara il dominio dalle etichette umane: senza etichette non si addestra, e invecchia con il linguaggio.',h:'Riguarda la riga «Etichette necessarie» della tabella dei tre metodi.'}
];
MAPPA[15]={c:'Come si trasformano le parole in numeri?',r:[
  {t:'Perché il testo',c:BLUE,v:['I clienti spiegano a parole','Sentiment, topic, classificazione, entità','Uber COTA: 90% dei ticket']},
  {t:'Difficoltà',c:RED,v:['Ambiguità, dominio, negazione','Ironia, rumore, contesto','Artefatti nei dati: leggere i testi grezzi']},
  {t:'Rappresentazioni',c:TEAL,v:['Bag of words: trasparente, sparso','Embedding: significati vicini','Preprocessing: l\'ordine conta']},
  {t:'Sentiment',c:YEL,v:['Dizionario: 50%, κ 0,27','Random forest: 74%, κ 0,48','LLM: senza etichette, da controllare']},
  {t:'Topic',c:PINK,v:['LDA: documenti come miscugli di topic','k, α, β; i nomi li diamo noi','Sei topic come i motivi degli annotatori']},
  {t:'Decidere',c:GRN,v:['Topic per sentiment, per compagnia','Smistare, seguire, correggere la causa','Quali 50 tweet leggere oggi']}]};
