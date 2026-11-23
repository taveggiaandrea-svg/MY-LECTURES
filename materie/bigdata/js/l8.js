/* Lezione 8: architetture con data lake */
const HOT=ORG,COLD=BLUE;
const qChip8=(x,y,q,o)=>{o=o||{};const st=o.bad?RED:o.good?GRN:'#888';return rect(x,y,70,22,o.bad?'rgba(252,98,85,.12)':'#1a1a1a',st)+tx(x+35,y+16,q,{s:12.5,f:o.bad?'#c88':'#fff'})};
INIT[8]=function(){
  codeHL($('#lezione-8'));
  /* technologies by phase */
  (function(){
    let s='';const ph=[['Acquisire','i dati grezzi',['Spark SQL','Spark Streaming'],['Kafka, Flume','Storm, Sqoop']],['Trasformare','e integrare',['Spark SQL'],['Pig, Hive']],['Memorizzare','grezzi ed elaborati',[],['HDFS']],['Analizzare','per capire i dati',['Spark SQL, Spark ML','GraphX'],['Hive, Mahout']]];
    ph.forEach(([n,d,sp,hd],i)=>{const x=10+i*176,w=170;s+='<polygon points="'+[x,20,x+w-18,20,x+w,48,x+w-18,76,x,76,x+(i?18:0),48].join(' ')+'" fill="#1e1e1e" stroke="#9a9a9a"/>';
      s+=tx(x+w/2+(i?6:0),44,n,{s:15,f:'#fff',w:600})+tx(x+w/2+(i?6:0),63,d,{s:12.5,f:GRAY});
      s+=tx(x+w/2,104,'Spark',{s:13,f:GRAY});(sp.length?sp:['nessuno']).forEach((l,j)=>s+=tx(x+w/2,124+j*18,l,{s:13.5,f:sp.length?'#fff':'#555'}));
      s+=tx(x+w/2,176,'Hadoop',{s:13,f:GRAY});hd.forEach((l,j)=>s+=tx(x+w/2,196+j*18,l,{s:13.5,f:'#fff'}))});
    s+=line(10,88,710,88,'#333',1)+line(10,160,710,160,'#333',1);
    svgBox($('#b8tech'),720,236,s,'Tecnologie del data lake per fase','46rem');
  })();
  /* schema on write vs schema on read */
  (function(){
    const duo=el('div','duo');$('#b8schema').append(duo);
    const L=['20161130,ProdABD,300,4','20161205,ProdXYZ,n/a,7','20161210,ProdDEF,90,2'];
    let a=rect(10,6,320,46,'#141414','#9a9a9a')+mono(20,24,'CREATE TABLE sales (date INT,',{s:12.5})+mono(20,42,'  product VARCHAR, value INT, ...)',{s:12.5});
    a+=tx(170,74,'prima la tabella, poi i record',{s:12.5,f:GRAY});
    L.forEach((l,k)=>{const ok=k!==1,y=86+k*28;a+=rect(10,y,240,22,ok?OKBG:BADBG)+mono(18,y+16,l,{s:12.5})+tx(262,y+16,ok?'✓ caricato':'✗ rifiutato',{s:13,f:ok?GRN:RED,a:'start'})});
    const t=sTab(10,182,[{t:'date',w:86},{t:'product',w:86},{t:'value',w:60,a:'e',c:BLUE},{t:'cust.',w:56,a:'e'}],[['20161130','ProdABD','300','4'],['20161210','ProdDEF','90','2']],{rh:23,hh:24});
    a+=t.s;
    cell(duo,'Data warehouse: schema on write',a,340,262,'Schema on write','Il record sbagliato non entra mai: 2 righe su 3.');
    let b=rect(10,6,250,96,'#141414','#9a9a9a')+tx(20,24,'sales.csv nel lago (tutte e 3 le righe)',{s:12.5,f:GRAY,a:'start'});
    L.forEach((l,k)=>b+=mono(20,48+k*20,l,{s:12.5}));
    b+=tx(10,128,'lettore A: value come INT',{s:13,f:'#fff',a:'start'})+tx(10,146,'«n/a» viene letto come NULL, gli altri valori come numeri',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,180,'lettore B: value come STRING',{s:13,f:'#fff',a:'start'})+tx(10,198,'tiene «n/a» come testo, per trovare i record sbagliati',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,232,'Lo schema sta nel codice che legge.',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Data lake: schema on read',b,340,262,'Schema on read','Si tiene tutto: 3 righe su 3.');
  })();
  /* cost per raw TB (approximate) */
  (function(){
    let s='';const L=150,R=600,X=v=>L+v/100*(R-L);
    [0,20,40,60,80,100].forEach(v=>{s+=line(X(v),8,X(v),214,'#222',1)+tx(X(v),234,'$'+(v?v+'.000':'0'),{s:13,f:GRAY})});
    const rows=[['Storage nel cloud',0,1],['Hadoop',0,3],['NAS',12,18],['Engineered system',10,20],['MPP',21,80],['SAN',38,100]];
    rows.forEach(([l,lo,hi],k)=>{const y=14+k*34;s+=tx(L-10,y+16,l,{s:13.5,a:'end',f:k<2?'#fff':'#ccc',w:k<2?600:undefined});
      s+=rect(X(0),y,Math.max(X(lo)-X(0),0),22,'#2c2c2c')+rect(X(lo),y,Math.max(X(hi)-X(lo),3),22,k<2?'#fff':'#777');
      s+=tx(X(hi)+8,y+16,k<2?'qualche migliaio di $':'≈ '+lo+'-'+hi+' mila $',{s:12.5,f:GRAY,a:'start'})});
    s+=tx((L+R)/2,256,'costo complessivo per TB grezzo, dal minimo al massimo (approssimato)',{s:13,f:GRAY});
    svgBox($('#b8cost'),720,264,s,'Costo per terabyte grezzo secondo la tecnologia di memorizzazione','46rem');
  })();
  /* four adoption steps */
  (function(){
    let s='';const st=[['01','Area di staging e zona dei dati grezzi','luogo di atterraggio economico e scalabile'],['02','Ambiente di data science','dove girano gli esperimenti di machine learning'],['03','Sistema di offloading per i data warehouse','tiene i dati freddi del DWH'],['04','Componente principale del sistema informativo','coinvolto nella maggior parte dei flussi di dati']];
    st.forEach(([n,l,d],k)=>{const y=200-k*56,hw=150-k*32,cx=160,top=hw-16;
      s+='<polygon points="'+[cx-hw,y+50,cx+hw,y+50,cx+top,y,cx-top,y].join(' ')+'" fill="'+['#2a2a2a','#383838','#474747','#5a5a5a'][k]+'" stroke="#111"/>'+tx(cx,y+32,n,{s:17,f:'#fff',w:600});
      s+=line(cx+top+8,y+25,330,y+25,'#555',1)+tx(340,y+22,l,{s:14,f:'#fff',a:'start',w:500})+tx(340,y+40,d,{s:12.5,f:GRAY,a:'start'})});
    svgBox($('#b8steps'),720,256,s,'Quattro passi dell\'adozione di un data lake','46rem');
  })();
  /* traditional BI vs BI 2.0 */
  (function(){
    const duo=el('div','duo');$('#b8arch').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const up=(x,y1,y2,id)=>line(x,y1,x,y2,GRAY,1.6,' marker-end="url(#'+id+')"');
    let a=ar('b8u1');const cx=90,w=160;
    a+=box(cx,8,w,34,['Reportistica'],{fs:14})+up(170,104,46,'b8u1')+box(cx,106,w,30,['Strato semantico'])+up(170,166,140,'b8u1');
    a+=box(cx,168,w,44,['Data warehouse','dati caldi'],{fs:14,c2:HOT,b:1})+up(170,252,216,'b8u1')+box(cx,254,w,28,['ETL'])+up(170,316,286,'b8u1')+box(cx,318,w,40,['Fonti tradizionali','relazionali: ERP, CRM'],{fs:13.5});
    cell(duo,'BI tradizionale',a,340,364,'BI tradizionale','Un solo percorso: ETL verso il warehouse.');
    let b=ar('b8u2');const c1=10,c2=180,W=150;
    b+=box(10,8,320,34,['Reportistica e analisi avanzate'],{fs:14})+up(85,104,46,'b8u2')+up(255,104,46,'b8u2');
    b+=box(c1,106,W,30,['Strato semantico'])+box(c2,106,W,30,['Strato semantico'])+up(85,166,140,'b8u2')+up(255,158,140,'b8u2');
    b+=box(c1,168,W,44,['Data warehouse','caldi, distillati'],{fs:14,c2:HOT,b:1})+rect(c2,160,W,78,'#0d0d0d','#666')+tx(255,180,'Data lake',{s:14,f:'#fff',w:600})+tx(255,198,'Hadoop, Spark',{s:13,f:GRAY})+tx(255,214,'grezzi, freddi',{s:13,f:COLD})+tx(255,230,'qualità, governance',{s:12.5,f:GRAY});
    b+=tx(170,197,'⇄',{s:18,f:'#ddd'});
    b+=up(85,252,216,'b8u2')+up(255,284,242,'b8u2')+box(c1,254,W,28,['ETL'])+box(c2,286,W,28,['Data ingestion']);
    b+=up(85,316,286,'b8u2')+up(255,342,318,'b8u2')+box(c1,318,W,40,['Fonti tradizionali','relazionali'],{fs:13.5})+box(c2,320,W,40,['Fonti emergenti','log, dispositivi, social'],{fs:13.5});
    cell(duo,'BI 2.0, con un data lake',b,340,364,'BI 2.0','Le nuove fonti atterrano nel lago; i risultati passano al warehouse.');
  })();
  /* data distillation, animated */
  (function(){
    const root=$('#b8distill'),W=720,H=250;const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const rnd=lcg(8),D=[];for(let k=0;k<240;k++)D.push([24+rnd()*266,52+rnd()*170]);
    const steps=[3,4.5,3,3,3];
    const msgs=['Il lago contiene una grande quantità di dati grezzi, con più dettaglio e una storia più lunga del warehouse.','<b>Lettura.</b> Un job Spark legge i dati grezzi che gli servono; i dati restano nel lago.','<b>Calcolo.</b> Il risultato è piccolo: poche righe, per esempio un indicatore per ogni segmento di clienti.',
      '<b>Distillazione.</b> Essendo piccolo, il risultato viene caricato nel data warehouse.','<b>Uso.</b> Nel warehouse entra nel flusso di lavoro della BI: i report lo interrogano con bassa latenza.'];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b8d1',GRAY)+'</defs>';
      s+=rect(14,26,286,206,'#0b0b0b','#666')+tx(157,44,'data lake: dati grezzi',{s:13.5,f:'#fff'});
      D.forEach(([x,y])=>s+='<circle cx="'+x+'" cy="'+y+'" r="2.2" fill="#8a8a8a"/>');
      s+=rect(330,104,100,52,i===1||i===2?'#1e1e1e':'#141414',i===1||i===2?'#fff':'#777')+tx(380,126,'job Spark',{s:13.5,f:'#fff'})+tx(380,144,'in memoria',{s:12.5,f:GRAY});
      s+=rect(466,40,140,180,'#0b0b0b',i>=3?'#fff':'#666')+tx(536,58,'data warehouse',{s:13.5,f:'#fff'})+tx(536,76,'dati caldi',{s:12.5,f:HOT});
      s+=rect(624,90,90,90,'#0b0b0b',i===4?'#fff':'#444')+tx(669,106,'report BI',{s:13,f:i===4?'#fff':'#666'});
      if(i===1){D.forEach(([x,y],k)=>{if(k%4)return;const st=(k/4)/60*.6,ek=clamp((u-st)/.4,0,1);if(ek>0&&ek<1){const xx=lerp(x,330,ease(ek)),yy=lerp(y,130,ease(ek));s+='<circle cx="'+xx+'" cy="'+yy+'" r="2.6" fill="#fff" opacity="'+(1-ek*.5)+'"/>'}})}
      const tbl=(x,y,a)=>{let r='<g opacity="'+a+'">'+rect(x,y,104,62,'#1e1e1e','#ddd');[0,1,2,3].forEach(j=>{r+=rect(x+8,y+8+j*13,24,8,'#777')+rect(x+38,y+8+j*13,[46,30,52,22][j],8,BLUE)});return r+'</g>'};
      if(i===2)s+=tbl(lerp(330,330,e),lerp(166,166,e),e)+tx(382,244,'poche righe',{s:12.5,f:GRAY});
      if(i===3)s+=tbl(lerp(330,484,e),lerp(166,100,e),1);
      if(i===4){s+=tbl(484,100,1);[46,30,52,22].forEach((v,j)=>s+=rect(640+j*18,170-v*e*1.2,12,v*e*1.2,BLUE))}
      if(i>=1)s+=line(302,130,326,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i>=3)s+=line(432,130,462,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i===4)s+=line(608,130,620,130,GRAY,1.5,' marker-end="url(#b8d1)"');
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione della distillazione dei dati">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 5. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* input filter vs quality label */
  (function(){
    const duo=el('div','duo');$('#b8qual').append(duo);const Q=['alta','media','bassa','alta','media','alta'];
    let a='';Q.forEach((q,k)=>a+=qChip8(10,14+k*34,q,{bad:q!=='alta'}));
    a+=line(118,6,118,214,'#ddd',3)+tx(118,232,'filtro: solo alta',{s:12.5,f:GRAY});
    a+=rect(150,6,180,208,'#0b0b0b','#666')+tx(240,26,'data lake',{s:13.5,f:'#fff'});
    Q.forEach((q,k)=>{const y=14+k*34;if(q==='alta'){a+=line(82,y+11,110,y+11,GRN,1.4)+qChip8(205,36+Q.slice(0,k).filter(x=>x==='alta').length*34,q,{good:1})}else a+=tx(98,y+16,'✗',{s:14,f:RED})});
    cell(duo,'Filtro di qualità in ingresso',a,340,240,'Filtro in ingresso','<span class="bad">I record di qualità media vanno persi</span>, anche per chi potrebbe usarli.');
    let b=rect(10,6,190,214,'#0b0b0b','#666')+tx(105,26,'data lake (tutti i record)',{s:13,f:'#fff'});
    const pos=k=>[20+(k%2)*92,40+Math.floor(k/2)*40];
    b+=box(232,30,104,48,['Reportistica','solo alta'],{fs:13.5})+box(232,140,104,48,['Data scientist','alta, media'],{fs:13.5});
    Q.forEach((q,k)=>{const [x,y]=pos(k);if(q==='alta')b+=line(x+70,y+11,232,54,GRN,1,' opacity=".55"');if(q!=='bassa')b+=line(x+70,y+11,232,164,GRN,1,' opacity=".55"')});
    Q.forEach((q,k)=>{const [x,y]=pos(k);b+=qChip8(x,y,q)});
    cell(duo,'Etichetta di qualità, decide l\'utente',b,340,240,'Etichetta di qualità','Ogni record entra; <span class="ok">ogni utente sceglie il suo livello</span>.');
  })();
  /* ETL copy vs virtualization */
  (function(){
    const duo=el('div','duo');$('#b8virt').append(duo);const src=['ERP','CRM','log web'];
    let a='<defs>'+arrowDef('b8v1',GRAY)+'</defs>';a+=box(120,6,100,34,['query utente']);
    a+=line(170,42,170,62,GRAY,1.5,' marker-end="url(#b8v1)"')+cyl(110,66,120,46,'archivio centrale');
    src.forEach((n,k)=>{const x=20+k*110;a+=cyl(x,186,90,42,n)+line(x+45,184,170+(k-1)*30,118,GRAY,1.4,' marker-end="url(#b8v1)"')});
    a+=tx(260,154,'copia (ETL)',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Copiare i dati (ETL)',a,340,236,'Copia con ETL','Una seconda copia dei dati da caricare e tenere allineata.');
    let b='<defs>'+arrowDef('b8v2',ORG)+'</defs>';b+=box(120,6,100,34,['query utente']);
    b+=line(170,42,170,62,ORG,1.5,' marker-end="url(#b8v2)"')+rect(40,66,260,46,'#0d0d0d','#ddd',' stroke-dasharray="5 4"')+tx(170,86,'strato di virtualizzazione',{s:13.5,f:'#fff'})+tx(170,104,'nessun dato memorizzato',{s:12.5,f:GRAY});
    src.forEach((n,k)=>{const x=20+k*110;b+=cyl(x,186,90,42,n)+line(170+(k-1)*60,114,x+45,182,ORG,1.4,' marker-end="url(#b8v2)"')});
    b+=tx(330,154,'rete',{s:12.5,f:ORG,a:'end'});
    cell(duo,'Query sul posto (virtualizzazione)',b,340,236,'Virtualizzazione dei dati','Nessuna copia, ma ogni query carica le fonti e la rete.');
  })();
  wideFigs(8);
};
QZ['8a']=()=>[{q:'Un\'azienda raccoglie log grezzi di sensori il cui uso non è ancora deciso: l\'anno prossimo un modello potrebbe aver bisogno di alcuni campi, in un formato che oggi nessuno sa definire. Dove dovrebbero andare, e perché?',o:['Nel data lake, perché con lo schema on read la struttura si può definire quando i dati servono','Nel DWH, perché lo schema on write garantisce la qualità','Da nessuna parte: i dati senza schema non si possono memorizzare','Nel DWH, perché è la memorizzazione più economica'],a:0,
  e:'Il lago memorizza i dati nel loro formato nativo e definisce lo schema al momento della lettura; il DWH ha bisogno delle tabelle definite prima del caricamento ed è la memorizzazione più costosa.',h:'Chiediti quale dei due deve conoscere la struttura prima di scrivere.'}];
QZ['8b']=()=>[{q:'Una banca sposta dieci anni di storico delle transazioni, consultato di rado, dal suo data warehouse al data lake, dove resta disponibile. Quale passo dell\'adozione è questo?',o:['Area di staging e zona dei dati grezzi','Ambiente di data science','Sistema di offloading per i data warehouse','Componente principale del sistema informativo'],a:2,
  e:'Usare il basso costo di memorizzazione del lago per tenere i dati freddi e usati di rado del warehouse è il terzo passo, l\'offloading.',h:'Chiediti da dove vengono i dati e quanto spesso vengono usati.'}];
QZ['8c']=()=>[{q:'Una dashboard giornaliera mostra le vendite del mese scorso per negozio; i log web del 2012 vengono letti una volta all\'anno per uno studio. Nell\'architettura della lezione,',o:['entrambi stanno nel data warehouse','le vendite restano nel data lake, i log vanno nel warehouse','le vendite, dati caldi, stanno nel warehouse; i log, dati freddi, nel lago','entrambi stanno solo nei sistemi di origine'],a:2,
  e:'I dati recenti e consultati spesso sono caldi e li serve il warehouse con bassa latenza; i dati vecchi e consultati di rado sono freddi e restano nel lago, disponibili con una latenza maggiore.',h:'Ricorda le definizioni di dati caldi e freddi.'}];
QZ['8d']=()=>[{q:'Arrivano record di clienti con indirizzi di qualità media: vanno bene per un modello di abbandono, non per le fatture. Che cosa raccomanda la lezione?',o:['Rifiutarli all\'ingresso del lago','Correggerli a mano prima di caricarli','Caricarli con un\'etichetta di qualità, e lasciare che ogni utente decida se usarli','Memorizzarli solo nel warehouse'],a:2,
  e:'Le regole di qualità vanno sull\'output: un\'etichetta di qualità permette al report delle fatture di escluderli mentre il data scientist può comunque usarli.',h:'Dove vanno applicate le regole di qualità, secondo la lezione?'}];
QZ['8']=()=>[
  {q:'Un caricamento di 1000 record ne contiene 30 con un testo dove ci si aspetta un intero. Quante righe finiscono in una tabella del warehouse con schema on write e caricamento rigoroso, e quante righe nel lago?',o:['970 e 970','1000 e 970','970 e 1000','1000 e 1000'],a:2,
   e:'La tabella del warehouse rifiuta i 30 record che non rispettano il suo schema: 1000 − 30 = 970. Il lago scrive tutte le 1000 righe così come sono e lascia lo schema ai lettori.',h:'Un sistema controlla lo schema quando scrive, l\'altro quando legge.'},
  {q:'Un rivenditore esegue in Spark un modello di abbandono su due anni di clickstream grezzo nel lago e ottiene un punteggio di abbandono per cliente, che le dashboard del marketing devono interrogare in modo interattivo. Che cosa suggerisce l\'architettura della lezione?',o:['Spostare il clickstream grezzo nel warehouse','Tenere il clickstream grezzo nel lago e caricare i punteggi nel warehouse','Far interrogare alle dashboard il clickstream grezzo nel lago','Cancellare il clickstream una volta calcolati i punteggi'],a:1,
   e:'È la distillazione dei dati: l\'analisi pesante gira sul lago, e il risultato piccolo va nel warehouse, che serve query a bassa latenza agli strumenti di BI.',h:'Quale dei due sistemi è costruito per le query interattive, e quali dati sono piccoli?'},
  {q:'Quale di questi non è uno dei fattori critici di successo di un data lake indicati nella lezione?',o:['La data governance','Un filtro che rifiuta all\'ingresso i dati di qualità media','La gestione dei metadati','La formazione di data scientist e utenti finali'],a:1,
   e:'La lezione sconsiglia esplicitamente i filtri in ingresso: terrebbero fuori dati utili per alcune applicazioni. Il modo raccomandato sono le etichette di qualità sull\'output.',h:'Rileggi il paragrafo sul processo di qualità dei dati.'},
  {q:'Un\'azienda mette uno strato di virtualizzazione sopra il suo ERP. A fine mese, i report complessi che passano dallo strato rallentano l\'ERP stesso. Quale svantaggio è questo?',o:['L\'alto investimento iniziale','La virtualizzazione dei dati si affida allo spazio di archiviazione, alla memoria e alle CPU delle fonti, e può essere lenta per i compiti complessi','Non può gestire dati non strutturati','Duplica i dati'],a:1,
   e:'Lo strato non memorizza nulla, quindi il lavoro di ogni query lo fanno le fonti; le query pesanti caricano l\'ERP e possono essere lente.',h:'Nel secondo riquadro dell\'ultima figura, chi fa il lavoro?'},
  {q:'In quale ordine la lezione mette i quattro passi dell\'adozione di un data lake?',o:['Staging, data science, offloading, componente principale','Data science, staging, componente principale, offloading','Staging, offloading, data science, componente principale','Offloading, staging, data science, componente principale'],a:0,
   e:'Dalla base della piramide: area di staging e zona dei dati grezzi, ambiente di data science, sistema di offloading per i warehouse, componente principale del sistema informativo.',h:'Parti dall\'uso più economico e meno integrato.'},
  {q:'Nell\'era del data lake, che cosa contiene il data warehouse secondo la lezione?',o:['Tutti i dati grezzi, strutturati e non strutturati','Solo i dati freddi','I dati caldi dei processi ETL e i risultati distillati delle analisi eseguite sul lago','Niente: è sostituito dal lago'],a:2,
   e:'Il warehouse esiste ancora e contiene i dati caldi (dall\'ETL, direttamente dalle fonti o dal lago) e i dati distillati dalle analisi del lago, mantenendo le query a bassa latenza e i report esistenti.',h:'Il lago tiene i dati grezzi e quelli freddi.'}
];
