/* Lezione 12: valutazione dei modelli predittivi (soggiorni alberghieri, target ricavo e high_value) */
const TRC='#9a9a9a',TSC=PINK,DTC='#9a9a9a',RFC=GRN;
/* 2x2 confusion matrix: m={tp,fn,fp,tn}, labels [pos,neg] */
function cm12(x,y,m,lab,o){o=o||{};const w=o.w||120,h=o.h||64;let s='';
  s+=tx(x+w,y-28,'classe prevista',{s:12.5,f:GRAY})+tx(x+w/2,y-8,lab[0],{s:13,f:'#ddd'})+tx(x+w*1.5,y-8,lab[1],{s:13,f:'#ddd'});
  s+=tx(x-12,y+h/2+5,lab[0],{s:13,f:'#ddd',a:'end'})+tx(x-12,y+h*1.5+5,lab[1],{s:13,f:'#ddd',a:'end'});
  if(!o.noside)s+=tx(x-70-(o.sx||0),y+h,'classe vera',{s:12.5,f:GRAY,x:' transform="rotate(-90 '+(x-70-(o.sx||0))+' '+(y+h)+')"'});
  const C=[['tp',0,0,OKBG,'TP'],['fn',1,0,BADBG,'FN'],['fp',0,1,BADBG,'FP'],['tn',1,1,OKBG,'TN']];
  C.forEach(([k,cx,cy,bg,n])=>{const X=x+cx*w,Y=y+cy*h;s+=rect(X,Y,w,h,bg,'#000')+tx(X+w/2,Y+h/2+(o.tag===false?6:0),fi(m[k],0),{s:o.fs||18,f:'#fff',w:600});
    if(o.tag!==false)s+=tx(X+w/2,Y+h/2+20,n,{s:12,f:GRAY})});
  return s}
INIT[12]=function(){
  /* training vs test error */
  (function(){
    let s='';const L=60,R=660,T=16,B=250,X=c=>L+(c-1)/9*(R-L),Y=e=>B-e/35*(B-T);
    const tr=c=>28*Math.exp(-.33*(c-1))+1.5,te=c=>tr(c)+0.55*(c-1)**1.55+2;
    [0,10,20,30].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    for(let c=1;c<=10;c++)s+=tx(X(c),B+18,String(c),{s:12.5,f:GRAY});
    const path=f=>{let d='';for(let c=1;c<=10.001;c+=.1)d+=(d?'L':'M')+X(c).toFixed(1)+' '+Y(f(c)).toFixed(1);return d};
    s+='<path d="'+path(tr)+'" fill="none" stroke="'+TRC+'" stroke-width="3"/><path d="'+path(te)+'" fill="none" stroke="'+TSC+'" stroke-width="3"/>';
    let best=1,bv=1e9;for(let c=1;c<=10;c+=.01){if(te(c)<bv){bv=te(c);best=c}}
    s+=line(X(best),T,X(best),B,'#666',1.2,' stroke-dasharray="5 4"')+lbl(X(best),T+12,'complessità migliore',null,{s:13});
    s+=lbl(X(9.6),Y(tr(9.6))-10,'errore sul training',TRC,{a:'end',s:13})+lbl(X(9.6),Y(te(9.6))-10,'errore sul test',TSC,{a:'end',s:13});
    s+=lbl(X(2.1),Y(te(2.1))-14,'il modello impara poco',GRAY,{a:'start',s:12.5})+lbl(X(7.2),Y(te(7.2))+28,'impara il rumore',GRAY,{s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'complessità del modello (per esempio profondità dell\'albero)',{s:13,f:GRAY})+tx(18,(T+B)/2,'errore',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b12over'),680,300,s,'Errore di training e di test','42rem');
  })();
  /* splits */
  (function(){
    const duo=el('div','duo');$('#b12split').append(duo);
    let a='';const P=[['Training',60,'#9a9a9a','costruisce il modello'],['Validazione',20,TEAL,'regola e sceglie'],['Test',20,TSC,'stima l\'errore sui dati nuovi']];let x=10;
    P.forEach(([n,v,c,d],k)=>{const w=v/100*320;a+=rect(x,24,w,46,c,'#000')+tx(x+w/2,52,v+'%',{s:15,f:'#000',w:600})+rect(14,92+k*22,12,12,c)+tx(34,103+k*22,n+': '+d,{s:12.5,f:'#ddd',a:'start'});x+=w});
    cell(duo,'Holdout: 60/20/20',a,340,156,'Divisione in training, validazione e test','Il test si usa <b>una volta sola</b>, alla fine.');
    let b='';for(let r=0;r<5;r++){for(let k=0;k<5;k++){b+=rect(30+k*56,14+r*24,54,20,k===r?TSC:'#555','#000')}b+=tx(20,29+r*24,String(r+1),{s:12,f:GRAY,a:'end'})}
    b+=tx(170,148,'parti dei dati',{s:12,f:GRAY});
    cell(duo,'Validazione incrociata, k = 5',b,340,154,'Validazione incrociata a 5 parti','Ogni parte fa da test <b>una volta</b>.');
  })();
  /* confusion matrix RF */
  (function(){
    svgBox($('#b12cm'),440,210,cm12(150,50,{tp:3792,fn:702,fp:396,tn:17127},['High','Standard'],{w:130,h:70}),'Matrice di confusione della random forest','30rem');
  })();
  /* lazy models */
  (function(){
    const duo=el('div','duo');$('#b12lazy').append(duo);
    cell(duo,'Frodi: sempre «legittima»',cm12(130,46,{tp:0,fn:1,fp:0,tn:99},['Frode','Legit'],{w:95,h:56,fs:17,sx:-14}),340,170,'Modello pigro sulle frodi','Accuratezza <b>99%</b>, frodi trovate <b>0%</b>.');
    cell(duo,'Soggiorni: sempre «Standard»',cm12(130,46,{tp:0,fn:4494,fp:0,tn:17523},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Modello pigro sui soggiorni','Accuratezza <b>79,6%</b>, soggiorni High trovati <b>0</b>.');
  })();
  /* DT vs RF indices */
  (function(){
    const I=[['Accuratezza',.928,.950],['Sensibilità',.810,.844],['Specificità',.958,.977],['Precisione',.832,.905],['F1',.821,.874],['Acc. bilanciata',.884,.911],['κ di Cohen',.776,.843],['MCC',.776,.843]];
    let s='';const L=150,R=600,X=v=>L+(v-.7)/.3*(R-L);
    [.7,.8,.9,1].forEach(v=>s+=line(X(v),10,X(v),I.length*40+14,'#1d1d1d',1)+tx(X(v),I.length*40+30,fi(v,1),{s:12,f:GRAY}));
    I.forEach(([n,a,b],i)=>{const y=14+i*40;s+=tx(L-12,y+18,n,{s:13,f:'#ddd',a:'end'})+rect(L,y,X(a)-L,14,DTC)+rect(L,y+16,X(b)-L,14,RFC)+tx(X(a)+6,y+12,fi(a,3),{s:11.5,f:'#ccc',a:'start'})+tx(X(b)+6,y+28,fi(b,3),{s:11.5,f:RFC,a:'start',w:600})});
    s+=rect(L,I.length*40+42,12,12,DTC)+tx(L+18,I.length*40+53,'albero di decisione',{s:12.5,f:'#ddd',a:'start'})+rect(L+180,I.length*40+42,12,12,RFC)+tx(L+198,I.length*40+53,'random forest',{s:12.5,f:'#ddd',a:'start'});
    s+=tx(R,I.length*40+30,'(l\'asse parte da 0,7)',{s:11.5,f:GRAY,a:'end'});
    svgBox($('#b12cmp'),660,I.length*40+64,s,'Albero e foresta sugli stessi indici','42rem');
  })();
  /* cut-off */
  (function(){
    const duo=el('div','duo');$('#b12cut').append(duo);
    const note=(r,p,a)=>'sensibilità <b>'+r+'</b> · precisione <b>'+p+'</b> · accuratezza '+a;
    cell(duo,'Soglia 0,5',cm12(130,46,{tp:3792,fn:702,fp:396,tn:17127},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Soglia 0,5',note('0,844','0,905','0,950'));
    cell(duo,'Soglia 0,2',cm12(130,46,{tp:4327,fn:167,fp:1305,tn:16218},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Soglia 0,2',note('0,963','0,768','0,933'));
  })();
  /* ROC illustrative */
  (function(){
    let s='';const L=70,S=300,T=16,X=v=>L+v*S,Y=v=>T+S-v*S;
    [0,.2,.4,.6,.8,1].forEach(v=>{s+=line(X(v),T,X(v),T+S,'#1d1d1d',1)+line(L,Y(v),L+S,Y(v),'#1d1d1d',1)+tx(X(v),T+S+18,fi(v,1),{s:12,f:GRAY})+tx(L-8,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'})});
    const roc=a=>{let d='',pts=[];for(let i=0;i<=10;i++){const x=i/10,y=1-Math.pow(1-x,a);pts.push([x,y]);d+=(d?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1)}return [d,pts]};
    const [d1,p1]=roc(4.5),[d2,p2]=roc(2);
    s+=line(X(0),Y(0),X(1),Y(1),'#777',1.5,' stroke-dasharray="6 5"')+'<path d="'+d2+'" fill="none" stroke="'+DTC+'" stroke-width="2.5"/><path d="'+d1+'" fill="none" stroke="'+RFC+'" stroke-width="3"/>';
    p1.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="3.5" fill="'+RFC+'"/>');p2.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="3" fill="'+DTC+'"/>');
    s+='<circle cx="'+X(0)+'" cy="'+Y(1)+'" r="6" fill="none" stroke="'+YEL+'" stroke-width="2"/>'+lbl(X(0)+12,Y(1)+5,'(0, 1) perfetto',YEL,{a:'start',s:13});
    s+=lbl(X(0)+10,Y(0)-8,'(0, 0) soglia 1',null,{a:'start',s:12.5})+lbl(X(1)+8,Y(1)+5,'(1, 1) soglia 0',null,{a:'start',s:12.5});
    s+=lbl(X(.62),Y(.5),'casuale',GRAY,{s:12.5});
    s+=line(L,T+S,L+S,T+S,'#777',1.2)+line(L,T,L,T+S,'#777',1.2)+tx(L+S/2,T+S+40,'tasso di falsi positivi (1 − specificità)',{s:13,f:GRAY})+tx(20,T+S/2,'sensibilità',{s:13,f:GRAY,x:' transform="rotate(-90 20 '+(T+S/2)+')"'});
    s+=rect(410,60,14,14,RFC)+tx(432,72,'modello 1',{s:13,f:'#ddd',a:'start'})+rect(410,88,14,14,DTC)+tx(432,100,'modello 2',{s:13,f:'#ddd',a:'start'})+line(410,124,424,124,'#777',1.5,' stroke-dasharray="4 3"')+tx(432,128,'casuale',{s:13,f:'#ddd',a:'start'})+tx(410,160,'ogni punto = una soglia',{s:12.5,f:GRAY,a:'start'});
    svgBox($('#b12roc'),580,370,s,'Curva ROC illustrativa','36rem');
  })();
  /* cumulative gain */
  (function(){
    const G=[0,47.9,87.2,98.4,99.6,99.8,99.9,99.9,100,100,100];let s='';const L=60,R=640,T=34,B=300,X=v=>L+v/100*(R-L),Y=v=>B-v/100*(B-T);
    [0,20,40,60,80,100].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,v+'%',{s:12,f:GRAY,a:'end'})});for(let v=0;v<=100;v+=10)s+=tx(X(v),B+18,v+'%',{s:12,f:GRAY});
    s+=line(X(0),Y(0),X(100),Y(100),'#777',1.5,' stroke-dasharray="6 5"')+'<polyline points="'+X(0)+','+Y(0)+' '+X(20.4)+','+Y(100)+' '+X(100)+','+Y(100)+'" fill="none" stroke="'+RFC+'" stroke-width="1.8" stroke-dasharray="3 4"/>';
    s+='<polyline points="'+G.map((g,i)=>X(i*10)+','+Y(g)).join(' ')+'" fill="none" stroke="#fff" stroke-width="3"/>';
    G.forEach((g,i)=>s+='<circle cx="'+X(i*10)+'" cy="'+Y(g)+'" r="4" fill="#fff"/>');
    s+=lbl(X(10)+8,Y(47.9)+16,'10% → 47,9%',null,{a:'start',s:13})+lbl(X(20)+8,Y(87.2)+18,'20% → 87,2%',null,{a:'start',s:13})+lbl(X(30)+6,Y(98.4)+22,'30% → 98,4%',null,{a:'start',s:13});
    s+=lbl(X(60),Y(55),'selezione casuale',GRAY,{s:12.5})+lbl(X(20.4)+6,Y(100)-8,'modello perfetto: 20,4%',RFC,{a:'start',s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+40,'quota di soggiorni contattati, in ordine di P(High)',{s:13,f:GRAY})+tx(14,(T+B)/2,'quota dei soggiorni High raccolti',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    svgBox($('#b12gain'),680,354,s,'Gain cumulato della random forest','42rem');
  })();
  /* errors in regression (illustrative) */
  (function(){
    const r=lcg(1212),P=[];for(let i=0;i<22;i++){const p=80+r()*780,a=Math.max(40,Math.min(960,p+gauss10(r)*(40+p*.14)));P.push([p,a])}
    let s='';const L=70,S=300,T=16,X=v=>L+v/1000*S,Y=v=>T+S-v/1000*S;
    [0,200,400,600,800,1000].forEach(v=>{s+=line(X(v),T,X(v),T+S,'#1d1d1d',1)+line(L,Y(v),L+S,Y(v),'#1d1d1d',1)+tx(X(v),T+S+18,String(v),{s:12,f:GRAY})+tx(L-8,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'})});
    s+=line(X(0),Y(0),X(1000),Y(1000),'#888',1.5,' stroke-dasharray="6 5"');
    P.forEach(([p,a])=>s+=line(X(p),Y(p),X(p),Y(a),RED,1.6)+'<circle cx="'+X(p).toFixed(1)+'" cy="'+Y(a).toFixed(1)+'" r="4.5" fill="#fff"/>');
    s+=line(L,T+S,L+S,T+S,'#777',1.2)+line(L,T,L,T+S,'#777',1.2)+tx(L+S/2,T+S+40,'ricavo previsto ŷ (€)',{s:13,f:GRAY})+tx(20,T+S/2,'ricavo vero y (€)',{s:13,f:GRAY,x:' transform="rotate(-90 20 '+(T+S/2)+')"'});
    s+=line(410,70,424,70,RED,2)+tx(432,74,'errore e = y − ŷ',{s:13,f:'#ddd',a:'start'})+line(410,98,424,98,'#888',1.5,' stroke-dasharray="4 3"')+tx(432,102,'previsione perfetta',{s:13,f:'#ddd',a:'start'});
    svgBox($('#b12err'),580,370,s,'Errori di previsione','36rem');
  })();
  /* regression comparison */
  (function(){
    let s='';const B=230,T=24,Y=v=>B-v/320*(B-T);
    [0,100,200,300].forEach(v=>s+=line(50,Y(v),640,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));
    [['MAE',191.0,61.8],['RMSE',288.6,108.1]].forEach(([n,a,b],i)=>{const x=120+i*270;s+=rect(x,Y(a),70,B-Y(a),DTC)+rect(x+80,Y(b),70,B-Y(b),RFC)+tx(x+35,Y(a)+18,fi(a,1),{s:13,f:'#000',w:600})+tx(x+115,Y(b)+18,fi(b,1),{s:13,f:'#000',w:600})+tx(x+75,B+20,n,{s:13.5,f:'#ddd'})});
    s+=line(50,Y(214.1),640,Y(214.1),YEL,1.6,' stroke-dasharray="6 4"')+lbl(636,Y(214.1)-7,'MAE ingenuo 214,1',YEL,{a:'end',s:12.5});
    s+=line(50,B,640,B,'#777',1.2)+rect(370,2,12,12,DTC)+tx(388,13,'albero di regressione',{s:12.5,f:'#ddd',a:'start'})+rect(530,2,12,12,RFC)+tx(548,13,'random forest',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b12regc'),660,256,s,'Errori in euro dei due modelli','42rem');
  })();
};
QZ['12a']=()=>[{q:'Un analista prova dieci profondità diverse di un albero, sceglie quella con l\'errore più basso sull\'insieme di test e riporta quell\'errore come stima delle prestazioni in produzione. Che cosa non va?',o:['Niente, il test serve proprio a questo','Ha usato il test per scegliere il modello: la stima è ottimista; la scelta andava fatta sulla validazione, e il test usato una volta sola alla fine','Doveva usare più profondità','Doveva usare l\'errore sul training'],a:1,
  e:'La validazione serve a regolare i parametri e scegliere il modello; il test stima l\'errore su dati nuovi e si usa una volta sola. Scegliendo sul test, il test non è più indipendente.',h:'Ricorda i compiti dei tre insiemi.'}];
QZ['12b']=()=>[{q:'Una banca usa un modello per bloccare le transazioni sospette; ogni frode non bloccata costa migliaia di euro, ogni blocco sbagliato solo una telefonata al cliente. Quale indice deve essere alto prima di tutto?',o:['La precisione','La sensibilità (recall)','La specificità','L\'accuratezza'],a:1,
  e:'Qui costa caro il caso mancato (falso negativo): serve una sensibilità alta, anche al prezzo di qualche falso allarme in più.',h:'Quale errore costa di più: il falso allarme o il caso mancato?'}];
QZ['12c']=()=>[{q:'Un modello ha AUC = 0,52. Come lo leggi?',o:['Eccellente','Accettabile','Praticamente casuale: non distingue le classi','Dipende dalla soglia'],a:2,
  e:'0,5 è un modello casuale; 0,52 ci è appena sopra. L\'AUC non dipende dalla soglia.',h:'Ricorda la scala delle slide.'}];
QZ['12d']=()=>[{q:'Due modelli hanno lo stesso MAE di 60 euro; il primo ha RMSE 62, il secondo RMSE 150. Che cosa ne deduci?',o:['Sono equivalenti','Il secondo fa alcuni errori molto grandi; il primo sbaglia di quantità simili ovunque','Il primo ha errori più grandi','L\'RMSE non si può confrontare con il MAE'],a:1,
  e:'RMSE ≥ MAE sempre, uguali solo se gli errori hanno tutti la stessa dimensione. Un divario grande indica alcuni errori molto grandi, che il quadrato fa pesare.',h:'Che cosa fa il quadrato agli errori grandi?'}];
QZ['12e']=()=>[{q:'Un\'azienda può chiamare solo 2.000 clienti su 20.000 e vuole sapere quanti potenziali abbandoni raggiungerà chiamando i primi in classifica. Quale strumento risponde?',o:['La matrice di confusione con soglia 0,5','Il gain cumulato al primo decile','L\'R²','Il MAPE'],a:1,
  e:'2.000 su 20.000 è il 10%: il gain cumulato al primo decile dice quale quota di tutti i positivi si raccoglie contattando il 10% in cima.',h:'Si agisce solo su una parte della classifica.'}];
QZ['12']=()=>[
  {q:'Con la soglia 0,2 la random forest ha TP = 4.327 e FN = 167. Qual è la sensibilità?',o:['0,844','0,963','0,768','0,933'],a:1,
   e:'4.327 / (4.327 + 167) = 4.327 / 4.494 ≈ 0,963. 0,768 è la precisione, 0,933 l\'accuratezza.',h:'Sensibilità = TP / (TP + FN).'},
  {q:'Con TP = 3.792 e FP = 396, quanto vale la precisione?',o:['0,844','0,977','0,905','0,950'],a:2,
   e:'3.792 / (3.792 + 396) = 3.792 / 4.188 ≈ 0,905.',h:'Delle righe previste High, quante lo sono davvero?'},
  {q:'Il modello che prevede sempre «Standard» ha accuratezza 0,796. Quanto valgono la sua accuratezza bilanciata e la sua kappa?',o:['0,796 e 0,796','0,5 e 0','1 e 1','0 e −1'],a:1,
   e:'Sensibilità 0, specificità 1: media 0,5. Kappa 0: l\'accordo è esattamente quello atteso per caso. Per questo questi indici reggono le classi sbilanciate.',h:'Calcola sensibilità e specificità del modello pigro.'},
  {q:'Il primo decile di un modello contiene il 60% di positivi, mentre in tutto il test i positivi sono il 15%. Qual è il lift del primo decile?',o:['0,25','4','45','60'],a:1,
   e:'Lift = 60% / 15% = 4: il modello concentra i positivi quattro volte meglio di una scelta a caso.',h:'Dividi la quota nel decile per la quota complessiva.'},
  {q:'Un modello di regressione ha R² = −0,15 sull\'insieme di test. Che cosa significa?',o:['Un errore di calcolo: l\'R² non può essere negativo','Il modello fa peggio che prevedere sempre la media','Il modello spiega il 15% della varianza','Il modello è sovradattato ai dati di test'],a:1,
   e:'Sul test l\'R² può essere negativo: la somma degli errori al quadrato del modello supera quella di chi prevede sempre la media.',h:'Che cosa vuol dire R² = 0?'},
  {q:'Si vuole confrontare l\'errore di previsione delle vendite giornaliere di due negozi, ma in molti giorni le vendite di uno sono zero. Quale indice evitare?',o:['MAE','MASE','MAPE','RMSE'],a:2,
   e:'Il MAPE divide per il valore vero: con valori a zero esplode (divisione per zero). Il MASE non ha scala e non divide per i valori veri.',h:'Quale indice ha y al denominatore?'}
];
MAPPA[12]={c:'Come si misura se un modello prevede bene?',r:[
  {t:'Dati mai visti',c:BLUE,v:['Training, validazione, test','Holdout, validazione incrociata','Campionamento stratificato','Sovradattamento: il test lo rivela']},
  {t:'Matrice di confusione',c:GRN,v:['TP, FN, FP, TN','Accuratezza: inganna con classi rare','Sensibilità, specificità','Precisione, F1']},
  {t:'Classi sbilanciate',c:TEAL,v:['Accuratezza bilanciata','κ di Cohen','MCC']},
  {t:'Soglia e classifica',c:PINK,v:['La soglia è una scelta di business','ROC: tutte le soglie','AUC: 0,5 casuale, 1 perfetto','Gain e lift: il primo k%']},
  {t:'Errori in numeri',c:YEL,v:['MAE, MSE, RMSE','MPE: distorsione','MAPE: niente zeri','R², R² corretto, MASE']},
  {t:'Caso alberghi',c:ORG,v:['Foresta: accuratezza 0,950, AUC 0,987','Primo decile: lift 4,79','Ricavo: R² 0,877, MASE 0,29']}]};
