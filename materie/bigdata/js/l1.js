/* Lezione 1: l'evoluzione dell'analisi dei dati */
const ERP1=[[1,'ROSSI MARCO','Milano',0],[2,'DOE JOHN','London',1],[3,'SMITH MARK','Liverpool',2],[4,'JANE MARY','London',3],[5,'BIANCHI MARIO','Roma',4]];
const CRM1=[[101,'Marco','Rossi','Milan',0],[102,'John','Doe','LONDON',1],[103,'Mary','Jane','Manchester',3],[104,'Mary','Jane','London',3],[105,'Mark','Smith','Liverpool',2],[106,'Mario','Bianchi','Rome',4]];
INIT[1]=function(){
  codeHL($('#lezione-1'));
  /* two systems, one customer base */
  (function(){
    const duo=el('div','duo');$('#b1src').append(duo);
    const t1=sTab(6,6,[{t:'id',w:34,a:'e'},{t:'nominativo',w:130},{t:'città',w:88}],ERP1.map(r=>[r[0],r[1],r[2]==='Milano'?{v:r[2],bg:BADBG}:r[2]]));
    cell(duo,'Sistema delle vendite (ERP)',t1.s,t1.w+12,t1.h+12,'Tabella clienti dell\'ERP','Cercando la città \'Milan\' si trovano <span class="bad">0</span> clienti. Contando i record si ottiene 5.');
    const t2=sTab(6,6,[{t:'id',w:40,a:'e'},{t:'nome',w:58},{t:'cognome',w:74},{t:'città',w:92}],CRM1.map(r=>[r[0],r[1],r[2],r[0]===103?{v:r[3],bg:BADBG}:r[3]]),{bg:i=>CRM1[i][4]===3?HLBG:null});
    cell(duo,'Sistema dei clienti (CRM)',t2.s,t2.w+12,t2.h+12,'Tabella contatti del CRM','Cercando \'Milan\' se ne trova 1. Contando i record si ottiene <span class="bad">6</span>: Mary Jane compare due volte, in due città.');
  })();
  /* linea del tempo: cinque fasi, uno strato ciascuna */
  (function(){
    const ph=[['anni Ottanta','DB operativi','Report statici'],['anni Novanta','Data warehouse','Report statici'],['fine anni Novanta','OLAP','Report dinamici'],['anni Duemila','Data mining','Analisi predittiva'],['dal 2012','Hadoop, Spark','Piattaforme Big Data']];
    let s=line(20,206,680,206,'#555',2);
    ph.forEach((p,k)=>{const cx=70+k*140;
      for(let j=0;j<=k;j++){const y=170-j*32,top=j===k;
        s+=rect(cx-62,y,124,28,top?'#6db9f4':'#17303d',top?'#6db9f4':'#2c5468')+tx(cx,y+19,ph[j][1],{s:13,f:top?'#000':'#cfe6f5'})}
      s+='<circle cx="'+cx+'" cy="206" r="6" fill="#6db9f4"/>'+tx(cx,232,'Fase '+(k+1),{s:14,f:'#fff',w:500})+tx(cx,252,p[0],{s:13,f:GRAY})+tx(cx,272,p[2],{s:13,f:GRAY})});
    svgBox($('#b1time'),700,284,s,'Cinque fasi dell\'evoluzione dell\'analisi dei dati, ognuna aggiunge uno strato','44rem');
  })();
  /* tre report delle stesse sei vendite */
  (function(){
    const trio=el('div','trio');$('#b1rep').append(trio);
    const rows=SAL.map(r=>({d:r[1],p:r[3],q:r[4],a:r[4]*r[5]}));const days=[...new Set(rows.map(r=>r.d))];
    const sh=d=>d.slice(8)+'/'+d.slice(5,7);
    const op=[];days.forEach(d=>{const ds=rows.filter(r=>r.d===d);ds.forEach(r=>op.push([sh(r.d),r.p,r.q,{v:fi(r.a),f:MSC}]));
      op.push([{v:sh(d),f:GRAY},{v:'totale',f:GRAY},{v:ds.reduce((a,r)=>a+r.q,0),f:GRAY},{v:fi(ds.reduce((a,r)=>a+r.a,0)),f:MSC,b:1}])});
    const C4=[{t:'data',w:56},{t:'prodotto',w:66},{t:'qtà',w:38,a:'e'},{t:'importo',w:66,a:'e'}];
    let t=sTab(4,4,C4,op,{bg:i=>(i%3===2)?HLBG:null,fs:13});cell(trio,'Operativo',t.s,t.w+8,t.h+8,'Report operativo','Ogni vendita più i subtotali giornalieri: 9 righe. Prodotto ogni giorno.');
    const ta=days.map(d=>{const ds=rows.filter(r=>r.d===d);return [sh(d),ds.length,ds.reduce((a,r)=>a+r.q,0),{v:fi(ds.reduce((a,r)=>a+r.a,0)),f:MSC}]});
    t=sTab(4,4,[{t:'data',w:56},{t:'vendite',w:56,a:'e'},{t:'qtà',w:44,a:'e'},{t:'importo',w:66,a:'e'}],ta,{fs:13});cell(trio,'Tattico',t.s,t.w+8,t.h+8,'Report tattico','Una riga al giorno: 3 righe. Prodotto ogni giorno o ogni settimana.');
    t=sTab(4,4,[{t:'periodo',w:70},{t:'vendite',w:56,a:'e'},{t:'qtà',w:36,a:'e'},{t:'importo',w:66,a:'e'}],[['set 2018',6,26,{v:'43,4',f:MSC}]],{fs:13});cell(trio,'Strategico',t.s,t.w+8,t.h+8,'Report strategico','Una riga per il periodo. Prodotto ogni settimana o ogni mese.');
  })();
  /* modello illustrativo del carico di lavoro */
  (function(){
    const trio=el('div','trio');const root=$('#b1load');root.append(legend([[BLUE,'tempo per salvare un ordine','box'],[RED,'sopra i 15 ms','box']]),trio);
    const rnd=(()=>{let x=7;return()=>{x=(x*16807)%2147483647;return x/2147483647}})(),jit=Array.from({length:12},()=>0.6+0.8*rnd());
    [['Nessun report',0.3],['8 report sullo stesso server',0.82],['8 report su una copia',0.3]].forEach(([title,u])=>{
      const mean=4/(1-u),W=230,H=180,L=34,B=150,T=12,Y=v=>B-v/40*(B-T);let s='';
      [0,10,20,30,40].forEach(v=>{s+=line(L,Y(v),W-6,Y(v),'#222',1)+tx(L-6,Y(v)+4,v,{s:13,f:GRAY,a:'end'})});
      const avg=jit.reduce((a,j)=>a+Math.min(39.5,mean*j),0)/jit.length;s+=tx(12,(T+B)/2,'ms',{s:13,f:GRAY,x:' transform="rotate(-90 12 '+(T+B)/2+')"'});
      jit.forEach((j,i)=>{const v=Math.min(39.5,mean*j),bw=(W-6-L)/12;s+=rect(L+i*bw+2,Y(v),bw-4,B-Y(v),v>15?RED:BLUE)});
      s+=line(L,B,W-6,B,'#777',1.5)+tx((L+W)/2,B+20,'ordini in arrivo',{s:13,f:GRAY});
      cell(trio,title,s,W,H,title,'In media <b>'+fi(avg,1)+' ms</b> per ordine.')});
  })();
  /* ETL: staging, trasformazione, warehouse */
  (function(){
    const W=720,H=372;let s='';
    [[0,'Area di staging (extract)'],[244,'Trasformati (transform)'],[488,'Data warehouse (load)']].forEach(([x,t])=>{s+=rect(x+2,30,228,H-34,'#0b0b0b','#2a2a2a')+tx(x+116,20,t,{s:14,f:GRAY})});
    const all=ERP1.map(r=>({src:'ERP',raw:r[0]+' · '+r[1]+' · '+r[2],clean:capw(r[1].split(' ')[1].toLowerCase())+' '+capw(r[1].split(' ')[0].toLowerCase())+' · '+({Milano:'Milan',Roma:'Rome'}[r[2]]||r[2]),p:r[3],id:r[0]}))
      .concat(CRM1.map(r=>({src:'CRM',raw:r[0]+' · '+r[1]+' '+r[2]+' · '+r[3],clean:r[1]+' '+r[2]+' · '+capw(r[3].toLowerCase()),p:r[4],id:r[0],drop:r[0]===103})));
    const wy=p=>70+p*62;
    all.forEach((c,j)=>{const y=54+j*28;s+=tx(10,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(46,y+5,esc(c.raw),{s:13,a:'start',f:'#fff'})});
    const ord=all.slice().sort((a,b)=>a.p-b.p||(a.src<b.src?1:a.src>b.src?-1:a.id-b.id));
    ord.forEach((c,j)=>{const y=54+j*28;
      s+=tx(254,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(290,y+5,esc(c.clean),{s:13,a:'start',f:c.drop?RED:'#fff',x:c.drop?' text-decoration="line-through"':''});
      if(!c.drop)s+=line(458,y,496,wy(c.p)-4,'#666',1.2);
    });
    [0,1,2,3,4].forEach(p=>{const e=ERP1.find(r=>r[3]===p),c=CRM1.find(r=>r[4]===p&&r[0]!==103),cl=all.find(a=>a.src==='ERP'&&a.p===p).clean;
      s+=tx(508,wy(p),p+1,{s:15,f:PKC,w:600})+tx(524,wy(p),esc(cl),{s:14,a:'start',f:'#fff'})+tx(524,wy(p)+19,'ERP id '+e[0]+' · CRM id '+c[0],{s:12.5,a:'start',f:GRAY})});
    svgBox($('#b1etl'),W,H,s,'ETL da due fonti a una sola tabella del warehouse','46rem');
  })();
  /* il cubo, una fetta per data, e una pivot */
  (function(){
    const cities=['Milan','London','Liverpool'],cityIt={Milan:'Milano',London:'Londra',Liverpool:'Liverpool'},prods=['abc','xyz'],dates=['2018-09-01','2018-09-02','2018-09-03'];
    const cityOf=id=>capw(CUST.find(c=>c[0]===id)[3]);
    const q=(c,p,d)=>SAL.filter(r=>cityOf(r[2])===c&&r[3]===p&&(!d||r[1]===d)).reduce((a,r)=>a+r[4],0);
    let s='';const cw=46,rh=30,y0=64;
    cities.forEach((c,i)=>{s+=tx(76,y0+i*rh+20,cityIt[c],{s:13.5,a:'end',f:'#fff'})});
    dates.forEach((d,k)=>{const x=86+k*(2*cw+20);s+=tx(x+cw,22,d.slice(8)+'/'+d.slice(5,7),{s:13.5,f:GRAY});
      prods.forEach((p,j)=>{s+=tx(x+j*cw+cw/2,y0-8,p,{s:13,f:GRAY})});
      cities.forEach((c,i)=>prods.forEach((p,j)=>{const v=q(c,p,d);s+=rect(x+j*cw,y0+i*rh,cw,rh,v?'rgba(88,196,221,.22)':'#0d0d0d','#333')+(v?tx(x+j*cw+cw/2,y0+i*rh+20,v,{s:14,f:MSC}):'')}))});
    s+=tx(86+(2*cw+20)*1.5-10,y0+3*rh+28,'una fetta per data (quantità)',{s:13,f:GRAY});
    const px=436;s+=tx(px+20,y0+rh*1.5+8,'→',{s:22,f:GRAY});
    const pr=cities.map(c=>[cityIt[c],{v:q(c,'abc'),f:MSC},{v:q(c,'xyz'),f:MSC},{v:q(c,'abc')+q(c,'xyz'),f:MSC,b:1}]);
    pr.push([{v:'totale',f:GRAY},{v:8,f:MSC,b:1},{v:18,f:MSC,b:1},{v:26,f:MSC,b:1}]);
    const t=sTab(px+44,y0-26,[{t:'città',w:76},{t:'abc',w:44,a:'e'},{t:'xyz',w:44,a:'e'},{t:'totale',w:52,a:'e'}],pr,{rh:28,bg:i=>i===3?HLBG:null});
    s+=t.s+tx(px+44+108,y0+4*28+30,'pivot: date sommate',{s:13,f:GRAY});
    svgBox($('#b1olap'),720,226,s,'Cubo delle vendite tagliato per data e pivot per città e prodotto','46rem');
  })();
  /* vendite simulate e previsione */
  (function(){
    const N=36,now=24;let x=11;const rnd=()=>{x=(x*16807)%2147483647;return x/2147483647};
    const y=Array.from({length:N},(_,t)=>100+1.6*t+16*Math.sin(2*Math.PI*(t-2)/12)+(rnd()-.5)*12);
    const W=700,H=300,L=56,R=686,T=14,B=250,X=t=>L+t/(N-1)*(R-L),Y=v=>B-(v-60)/(200-60)*(B-T);let s='';
    for(let v=60;v<=200;v+=35)s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'});
    for(let t=0;t<N;t+=6)s+=tx(X(t),B+20,t+1,{s:13,f:GRAY});
    s+=tx((L+R)/2,H-6,'mese',{s:13,f:GRAY})+tx(14,(T+B)/2,'vendite, migliaia di unità',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    const k=now-1,m1=y.slice(now-12,now).reduce((a,b)=>a+b)/12,m0=y.slice(now-24,now-12).reduce((a,b)=>a+b)/12,dr=m1-m0;
    const f=[{t:k,v:y[k],w:0}];for(let h=1;h<=6;h++)f.push({t:k+h,v:y[k+h-12]+dr,w:6+2.5*h});
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v+p.w).toFixed(1)).join('')+f.slice().reverse().map(p=>'L'+X(p.t).toFixed(1)+' '+Y(p.v-p.w).toFixed(1)).join('')+'Z" fill="'+ORG+'" fill-opacity=".18"/>';
    s+='<path d="'+y.slice(0,now).map((v,t)=>(t?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/>';
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v).toFixed(1)).join('')+'" fill="none" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
    s+=line(X(k),T,X(k),B,'#fff',1,' stroke-dasharray="3 4"')+lbl(X(k),T+12,'oggi','#fff');
    const r=$('#b1fc');r.append(legend([[BLUE,'passato noto: analisi descrittiva'],[ORG,'previsione e fascia di incertezza: analisi predittiva','dash']]));
    svgBox(r,W,H,s,'Vendite mensili con una previsione a sei mesi','44rem');
  })();
  /* un post: che cosa vedi e che cosa viene memorizzato */
  (function(){
    const root=$('#b1post'),duo=el('div','duo');root.append(legend([['#fff','coppia chiave/valore, sta in una colonna','box'],[GRAY,'contenuto libero, senza struttura fissa','box']]),duo);
    const S='color:#fff',U='color:#8c8c8c;font-style:italic';
    const a=el('div');a.append(el('h4','','Che cosa vedi'));
    a.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:var(--sans);line-height:1.6;display:flex;flex-direction:column;gap:.5rem;width:100%">'+
      '<div style="display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap"><b style="'+S+'">Milano Bites</b><span style="'+S+'">30 set 2026, 18:42</span></div>'+
      '<span style="'+S+'">Milano, Italia</span><span style="'+U+'">Il miglior risotto della città stasera, lo zafferano era incredibile! Coda lunga ma ne valeva la pena.</span>'+
      '<svg viewBox="0 0 200 64" style="max-width:200px"><rect width="200" height="64" fill="#1d1d1d"/><circle cx="58" cy="34" r="18" fill="#8c8c8c"/><path d="M110 54L140 18L174 54Z" fill="#555"/></svg>'+
      '<span style="'+S+'">♥ 128</span></div>'));
    const b=el('div');b.append(el('h4','','Che cosa viene memorizzato'));
    const kv=(k,v,u,last)=>'<div style="padding-left:1.4em;text-indent:-1.2em;'+(u?U:S)+'">"'+k+'": '+v+(last?'':',')+'</div>';
    b.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:ui-monospace,Menlo,monospace;font-size:.82rem;line-height:1.75;width:100%;overflow-wrap:anywhere">{'+
      kv('author','"@milano_bites"')+kv('created_at','"2026-09-30T18:42:00Z"')+kv('location','"Milano, IT"')+kv('text','"Il miglior risotto della città stasera, lo zafferano..."',1)+kv('media','["photo_8841.jpg"]',1)+kv('likes','128',0,1)+'}</div>'));
    duo.append(a,b);
    root.append(el('div','cellnote','Autore, data, luogo e like sono valori con un\'etichetta; il testo e la foto no. Un oggetto che mescola le due cose è <b>semi-strutturato</b>.'));
  })();
};
QZ['1a']=()=>[{q:'Con le sei vendite del corso, un report tattico mostra l\'importo totale per giorno. Che cosa mostra per il 2 settembre 2018?',o:['15','43,4','23','11,5'],a:2,
  e:'Il 2 settembre ci sono due vendite: 10 unità di xyz a 1,5 (15) e 4 unità di abc a 2 (8), quindi 15 + 8 = 23.',h:'Prendi solo le righe con data 2018-09-02 e somma, per ciascuna, quantità per prezzo.'}];
QZ['1b']=()=>[{q:'Un\'azienda copia ogni notte il suo database operativo su un secondo server e fa girare lì tutti i report, senza cambiare nient\'altro. Quale problema risolve?',
  o:['La stessa città è scritta in due modi diversi nell\'ERP e nel CRM.','Il CRM tiene un vecchio indirizzo accanto a quello nuovo per lo stesso cliente.','I report pesanti rallentano l\'inserimento dei nuovi ordini.','Nessuno dei tre.'],a:2,
  e:'Una copia su un altro server elimina la competizione fra letture massicce e scritture: è così che sono nati i primi data warehouse. Non fa nulla per i formati o le versioni, perché copia anche quelli.',
  h:'Una copia contiene gli stessi valori dell\'originale. Quale dei problemi riguarda i valori, e quale la macchina?'}];
QZ['1c']=()=>[{q:'Rispetto a interrogare il data warehouse in SQL, che cosa aggiunge l\'OLAP?',
  o:['Prevede i valori del mese prossimo a partire da quelli storici.','L\'utente può aggregare lungo le dimensioni senza conoscere le relazioni fra le tabelle, e le aggregazioni arrivano più in fretta.','Elimina il bisogno dell\'ETL, perché legge direttamente i database operativi.','Memorizza i dati in tabelle normalizzate.'],a:1,
  e:'L\'OLAP unisce ai dati i metadati, così l\'utente non deve sapere come sono collegate le tabelle, e risponde alle domande di aggregazione molto più velocemente di un database relazionale.',
  h:'Pensa a che cosa doveva sapere un utente nella fase 2 per ottenere un totale per città, e a che cosa cambia quando il motore sa già come sono collegate le tabelle.'}];
QZ['1d']=()=>[{q:'Un\'azienda energetica riceve una lettura ogni 15 minuti da ciascuno di 2 milioni di contatori intelligenti, come record con id del contatore, data e ora, kWh e una nota libera del tecnico. Quante letture arrivano al giorno, e che tipo di dati è ogni record?',o:['192 milioni; semi-strutturati','2 milioni; strutturati','192 milioni; non strutturati','48 milioni; semi-strutturati'],a:0,
  e:'Un giorno ha 24 × 4 = 96 quarti d\'ora, quindi 2.000.000 × 96 = 192 milioni di letture. Ogni record mescola campi che stanno in colonne di una tabella e testo libero: semi-strutturato.',h:'Conta i quarti d\'ora in un giorno, poi guarda che cosa contiene ogni record.'}];
QZ['1']=()=>[
  {q:'Sulle sei vendite del corso, qual è il ricavo (quantità × prezzo) del prodotto abc, e qual è il ricavo dei clienti che abitano a Londra?',o:['8 e 9','16,4 e 16,5','16,4 e 12','12,4 e 16,5'],a:1,
   e:'abc: 2 × 2 + 4 × 2 + 2 × 2,2 = 4 + 8 + 4,4 = 16,4. A Londra abitano John Doe (cliente 2) e Mary Jane (cliente 4): vendite 2, 4 e 6, quindi 4 + 8 + 4,5 = 16,5.',h:'Calcola prima l\'importo di ogni vendita; poi scegli le righe per prodotto, e per città del cliente.'},
  {q:'Nella pivot della figura sull\'OLAP, qual è la quantità totale comprata dai clienti di Londra?',o:['6','3','10','9'],a:3,
   e:'I clienti di Londra hanno comprato abc due volte (2 e 4) e xyz una volta (3): 2 + 4 + 3 = 9.',h:'Trova le vendite di Londra nelle tre fette per data e somma le loro quantità.'},
  {q:'Quale di questi è l\'esempio di dati semi-strutturati dato a lezione?',o:['Un tweet','La tabella delle fatture di un ERP','Un\'immagine a raggi X','Un report strategico stampato'],a:0,
   e:'Un post mescola testo libero e coppie chiave/valore come autore, data e luogo: è questo che vuol dire semi-strutturato.',h:'Cerca l\'elemento che contiene sia contenuto libero sia campi con un\'etichetta.'},
  {q:'Quale di questi è analisi predittiva e non descrittiva?',o:['Un report mensile delle vendite per regione','Una pivot OLAP dei margini dell\'anno scorso','Una stima del costo dell\'energia del mese prossimo','Una dashboard degli ordini di ieri'],a:2,
   e:'Stimare quanto è probabile un valore futuro è analisi predittiva; gli altri tre riassumono ciò che è già successo.',h:'Ricorda la divisione della lezione: un tipo di analisi descrive, l\'altro stima.'},
  {q:'Un rivenditore tiene 50 GB di vendite in un database relazionale, e tutti i suoi report girano in pochi secondi. Secondo la definizione preferita dal docente, sono Big Data?',o:['Sì, perché le vendite si generano di continuo','Sì, perché 50 GB sono più di quanto un portatile possa contenere','No, perché si possono analizzare comodamente con gli strumenti tradizionali','No, perché solo i dati dei social network sono Big Data'],a:2,
   e:'Il docente definisce Big Data i dati che non possiamo analizzare, o che non conviene analizzare, con gli strumenti tradizionali come i database relazionali. Qui l\'RDBMS se la cava bene, quindi non sono Big Data.',h:'La definizione preferita dipende dagli strumenti, non da una dimensione fissa.'},
  {q:'L\'ERP elenca 5 clienti; il CRM ne elenca 6, perché Mary Jane compare due volte, a Manchester e a Londra. In quale passo dell\'ETL si fondono i due record, e quanti clienti dovrebbe contare il warehouse?',o:['Extract; 6','Load; 11','Transform; 6','Transform; 5'],a:3,
   e:'L\'eliminazione dei duplicati e l\'integrazione sono regole di business e controlli di qualità, applicati nel passo Transform; entrambi i sistemi descrivono le stesse cinque persone, quindi il warehouse ne conta 5.',h:'Abbina ogni cliente del CRM a uno dell\'ERP.'}
];
