/* Lezione 5: Hadoop, HDFS e MapReduce */
/* rack aware placement of four blocks, three copies each: one rack holds one copy, another rack two */
const PLACE={B1:[1,4,5],B2:[2,7,8],B3:[6,8,9],B4:[7,2,3]};
const onNode=n=>Object.keys(PLACE).filter(b=>PLACE[b].includes(n));
const chip=(x,y,b,o)=>{o=o||{};const w=o.w||46;return rect(x,y,w,22,o.dead?'#2a1515':'#e6e6e6',o.dead?'#5a2a2a':'none')+tx(x+w/2,y+16,b,{s:13,f:o.dead?'#7a4a4a':'#000',w:600})};
INIT[5]=function(){
  codeHL($('#lezione-5'));
  /* HDFS: blocks, replicas, name node */
  (function(){
    let s='';
    s+=tx(40,18,'file.csv, 512 MB',{s:14,f:'#fff',a:'start'});
    ['B1','B2','B3','B4'].forEach((b,i)=>{s+=rect(40+i*82,26,80,30,'#e6e6e6')+tx(80+i*82,46,b+' · 128 MB',{s:13,f:'#000'})});
    s+=rect(430,8,270,98,'#0d0d0d','#9a9a9a')+tx(565,28,'name node (metadati)',{s:14,f:'#fff',w:500});
    Object.keys(PLACE).forEach((b,i)=>{s+=tx(448,50+i*15,b+' → nodi '+PLACE[b].join(', '),{s:12.5,f:GRAY,a:'start'})});
    for(let r=0;r<3;r++){const rx=12+r*236;s+=rect(rx,130,224,196,'none','#444')+tx(rx+112,320,'rack '+(r+1),{s:13,f:GRAY});
      for(let k=0;k<3;k++){const n=r*3+k+1,nx=rx+8+k*72;s+=rect(nx,140,66,160,'#111','#666')+tx(nx+33,160,'nodo '+n,{s:13,f:'#fff'});
        onNode(n).forEach((b,j)=>s+=chip(nx+10,172+j*30,b))}}
    svgBox($('#b5hdfs'),720,332,s,'Blocchi e repliche di HDFS su tre rack','46rem');
  })();
  /* rack failure */
  (function(){
    const duo=el('div','duo');$('#b5fail').append(legend([[GRN,'blocco ancora leggibile','box'],[RED,'rack guasto','box']]),duo);
    [0,2].forEach(dead=>{let s='';
      for(let r=0;r<3;r++){const rx=6+r*112,isDead=r+1===dead;s+=rect(rx,6,104,214,isDead?'rgba(252,98,85,.12)':'none',isDead?RED:'#444',isDead?' stroke-width="2"':'')+tx(rx+52,24,'rack '+(r+1)+(isDead?' (guasto)':''),{s:13,f:isDead?RED:GRAY});
        for(let k=0;k<3;k++){const n=r*3+k+1,ny=34+k*61;s+=rect(rx+6,ny,92,55,isDead?'#1a0d0d':'#111',isDead?'#5a2a2a':'#555')+tx(rx+52,ny+16,'nodo '+n,{s:12.5,f:isDead?'#7a4a4a':'#ccc'});
          {const two=onNode(n).length===2;onNode(n).forEach((b,j)=>s+=chip(two?rx+9+j*46:rx+29,ny+26,b,{dead:isDead,w:two?42:46}))}}}
      ['B1','B2','B3','B4'].forEach((b,i)=>{const alive=PLACE[b].some(n=>Math.ceil(n/3)!==dead);s+=tx(40+i*80,246,b+(alive?' ✓':' ✗'),{s:14,f:alive?GRN:RED,w:600})});
      cell(duo,dead?'Il rack 2 si guasta':'Tutti i rack funzionano',s,342,258,'Stato del cluster',dead?'Ogni blocco conserva almeno una copia fuori dal rack 2: <span class="ok">nessun dato perso</span>.':'Ogni blocco ha tre copie su due rack.')});
  })();
  /* replication versus erasure coding */
  (function(){
    let s='';const L=180,R=600,X=v=>L+v/3*(R-L);
    [0,1,2,3].forEach(v=>{s+=line(X(v),16,X(v),118,'#222',1)+tx(X(v),136,v+' GB',{s:13,f:GRAY})});
    [['Fattore di replica 3',2,'3 GB occupati'],['Erasure coding',0.5,'1,5 GB occupati']].forEach(([l,o,t],i)=>{const y=26+i*48;
      s+=tx(L-12,y+21,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,X(1)-X(0),32,'#e6e6e6')+tx((X(0)+X(1))/2,y+21,'file',{s:13,f:'#000'})+rect(X(1),y,X(1+o)-X(1),32,'#6a6a6a')+tx((X(1)+X(1+o))/2,y+21,'+'+(o*100)+'%',{s:13,f:'#fff'})+tx(X(1+o)+8,y+21,t,{s:13.5,a:'start',f:'#fff'})});
    svgBox($('#b5ec'),720,146,s,'Spazio occupato da un file da 1 GB con replica ed erasure coding','46rem');
  })();
  /* MapReduce on A C B C A, animated */
  (function(){
    const root=$('#b5mr'),W=720,H=330;root.append(legend([[YEL,'chiave'],[BLUE,'valore'],[ORG,'shuffle: coppie che vanno al loro reducer']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const inp=['A','C','B','C','A'],keys=['A','B','C'],gy={A:70,B:165,C:260};
    const kv=(k,v,f)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
    const steps=[3,4,6,4,3],msgs=['L\'input «A C B C A» è diviso fra cinque task di map, ciascuno sul nodo che contiene la sua parte.','<b>Map.</b> Ogni task emette una coppia: la lettera come <span style="color:var(--yellow)">chiave</span>, 1 come <span style="color:var(--blue)">valore</span>.',
      '<b>Ordinamento, shuffle e raggruppamento.</b> Il sistema sposta ogni coppia al reducer della sua chiave e mette insieme i valori della stessa chiave: (A, {1, 1}), (B, {1}), (C, {1, 1}).','<b>Reduce.</b> Ogni reducer somma i valori della sua chiave.','<b>Output.</b> (A, 2), (B, 1), (C, 2) vengono scritti in un file in HDFS.'];
    const iy=i=>45+i*58;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='';
      s+=tx(40,22,'input',{s:13,f:GRAY})+tx(170,22,'map',{s:13,f:GRAY})+tx(470,22,'ordina e raggruppa per chiave',{s:13,f:GRAY})+tx(600,22,'reduce',{s:13,f:GRAY})+tx(686,22,'output',{s:13,f:GRAY});
      inp.forEach((c,k)=>{s+=tx(40,iy(k)+20,c,{s:18,f:'#fff',w:600});s+=rect(130,iy(k),80,32,'#111',i>=1?'#9a9a9a':'#444')+tx(170,iy(k)+21,'map',{s:13,f:i>=1?'#fff':'#666'})});
      keys.forEach(k=>{s+=rect(415,gy[k]-28,120,56,'#0d0d0d',i>=2?'#666':'#2a2a2a');s+=rect(568,gy[k]-18,64,36,'#111',i>=3?'#9a9a9a':'#333')+tx(600,gy[k]+5,'reduce',{s:12.5,f:i>=3?'#fff':'#555'})});
      inp.forEach((c,k)=>{const slot=inp.slice(0,k).filter(x=>x===c).length,many=inp.filter(x=>x===c).length>1,tx0=232,ty0=iy(k)+21,tx1=450,ty1=gy[c]+(many?(slot?16:-4):5);
        if(i===1){s+='<text x="'+tx0+'" y="'+ty0+'" font-size="14" opacity="'+e+'">'+kv(c,1)+'</text>'}
        if(i===2&&u<.97){const st=k*.15,ek=ease(clamp((u-st)/.3,0,1)),x=lerp(tx0,tx1,ek),y=lerp(ty0,ty1,ek);if(ek>0)s=line(212,ty0-5,x,y-5,ORG,1.5,' opacity=".8"')+s;s+='<text x="'+x+'" y="'+y+'" font-size="14" style="paint-order:stroke;stroke:#000;stroke-width:5px">'+kv(c,1)+'</text>'}});
      if(i>=3||(i===2&&u>=.97)){keys.forEach(k=>{const n=inp.filter(x=>x===k).length;s+='<text x="475" y="'+(gy[k]+5)+'" font-size="14" text-anchor="middle">'+kv(k,'{'+Array(n).fill(1).join(', ')+'}')+'</text>'})}
      if(i>=3){keys.forEach(k=>{const n=inp.filter(x=>x===k).length,a=i===3?e:1;s+='<text x="686" y="'+(gy[k]+5)+'" font-size="15" text-anchor="middle" opacity="'+a+'">'+kv(k,n)+'</text>'+line(634,gy[k],652,gy[k],'#777',1.5,' opacity="'+a+'"')})}
      if(i===4)s+=rect(650,40,72,250,'none','#9a9a9a',' stroke-dasharray="4 4"')+tx(686,312,'file HDFS',{s:12.5,f:GRAY});
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione di MapReduce">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 5. '+msgs[i]}
    player(root,20,frame);
  })();
  /* word count, as in the slide */
  (function(){
    const words='The Apache Hadoop software library is a framework that allows for the distributed processing of large data sets across clusters of computers using simple programming models'.split(' ');
    const cnt={};words.forEach(w=>{const k=w.toLowerCase();cnt[k]=(cnt[k]||0)+1});const ks=Object.keys(cnt).sort();
    const K=v=>({v,f:YEL}),V=v=>({v,f:BLUE}),dots=[{v:'…',f:GRAY},{v:'',f:GRAY}];
    const m=words.slice(0,8).map(w=>[K(w),V(1)]).concat([dots]);
    const pick=['a','across','allows','apache','…','of','…','that','the','using'];
    const g=pick.map(k=>k==='…'?dots:[K(k),V(Array(cnt[k]).fill(1).join(', '))]),r=pick.map(k=>k==='…'?dots:[K(k),V(cnt[k])]);
    const C=(a,b)=>[{t:'chiave',w:a,c:YEL},{t:'valore',w:b,c:BLUE,a:'e'}];
    let s='';const t1=sTab(10,30,C(110,60),m),t2=sTab(262,30,C(100,70),g),t3=sTab(514,30,C(110,60),r);
    s+=t1.s+t2.s+t3.s+tx(95,18,'Output del mapper',{s:14,f:'#fff',w:500})+tx(347,18,'Ordina e aggrega',{s:14,f:'#fff',w:500})+tx(599,18,'Output del reducer',{s:14,f:'#fff',w:500});
    s+=tx(232,150,'→',{s:22,f:GRAY})+tx(486,150,'→',{s:22,f:GRAY});
    svgBox($('#b5wc'),720,30+t2.h+10,s,'Tabelle del conteggio delle parole','46rem');
    $('#b5wc').append(el('div','cellnote',words.length+' parole nella frase, '+ks.length+' chiavi distinte: il reducer scrive '+ks.length+' coppie.'));
  })();
  /* latency scale */
  (function(){
    let s='';const L=40,R=690,lo=Math.log10(0.1),hi=Math.log10(36000),X=v=>L+(Math.log10(v)-lo)/(hi-lo)*(R-L);
    s+=line(L,80,R,80,'#777',1.5);
    [[0.1,'0,1 s'],[1,'1 s'],[10,'10 s'],[60,'1 min'],[600,'10 min'],[3600,'1 h'],[36000,'10 h']].forEach(([v,l])=>{s+=line(X(v),74,X(v),86,'#777',1.5)+tx(X(v),106,l,{s:13,f:GRAY})});
    s+=rect(X(0.1),38,X(5)-X(0.1),26,'rgba(88,196,221,.35)',BLUE)+tx((X(0.1)+X(5))/2,56,'query interattiva',{s:13,f:'#fff'});
    s+=rect(X(60),38,X(36000)-X(60),26,'rgba(255,134,47,.3)',ORG)+tx((X(60)+X(36000))/2,56,'job batch di MapReduce: da minuti a ore',{s:13,f:'#fff'});
    s+=tx((L+R)/2,132,'tempo di risposta, scala logaritmica',{s:13,f:GRAY});
    svgBox($('#b5lat'),720,140,s,'Tempi di risposta delle query interattive e dei job batch','46rem');
  })();
  /* the ecosystem */
  (function(){
    let s='';const B=(x,y,w,h,l,f,st)=>rect(x,y,w,h,f||'#141414',st||'#555')+tx(x+w/2,y+h/2+5,l,{s:13.5,f:'#fff'});
    s+=B(130,292,580,30,'HDFS · file system distribuito','#1e1e1e','#9a9a9a')+B(130,256,580,30,'YARN · negoziatore di risorse','#1e1e1e','#9a9a9a');
    s+=B(130,220,190,30,'MapReduce')+B(325,220,190,30,'Tez')+B(520,220,190,30,'Spark');
    s+=tx(10,258,'Servizi',{s:13,f:GRAY,a:'start'})+tx(10,276,'di base',{s:13,f:GRAY,a:'start'});
    s+=rect(130,108,580,104,'none','#444')+tx(140,126,'Servizi per i dati',{s:13,f:GRAY,a:'start'});
    ['Hive','Pig','HBase','HCatalog'].forEach((l,i)=>s+=B(140+i*142,136,132,30,l));['Storm','Flume','Sqoop'].forEach((l,i)=>s+=B(140+i*142,174,132,30,l));
    s+=rect(10,108,112,104,'none','#444')+tx(66,126,'Operativi',{s:13,f:GRAY});['Ambari','Oozie','Zookeeper'].forEach((l,i)=>s+=B(18,134+i*26,96,22,l));
    s+=rect(10,8,700,92,'none','#444')+tx(20,26,'Strumenti di analisi',{s:13,f:GRAY,a:'start'});
    {let x=20;[['Giraph',76],['Mahout',76],['Kylin',70],['Elastic Search',108],['Spark',70],['SAS',70],['R',60],['KNIME',76]].forEach(([l,w])=>{s+=B(x,40,w,30,l);x+=w+8});}
    s+=tx(133,90,'solo dentro Hadoop',{s:12.5,f:GRAY})+tx(357,90,'strumenti distribuiti',{s:12.5,f:GRAY})+tx(578,90,'si collegano da fuori',{s:12.5,f:GRAY});
    svgBox($('#b5eco'),720,330,s,'L\'ecosistema Hadoop in quattro strati','46rem');
  })();
  /* legacy versus modern stack */
  (function(){
    const duo=el('div','duo');$('#b5stack').append(duo);
    const chain=(items)=>{let s='<defs>'+arrowDef('b5ar'+items.length,GRAY)+'</defs>';const n=items.length;items.forEach((l,i)=>{const y=200-i*58;s+=box(60,y,220,40,[l],{fs:14});if(i<n-1)s+=line(170,y,170,y-14,GRAY,2,' marker-end="url(#b5ar'+n+')"')});return s};
    cell(duo,'Legacy, base installata',chain(['HDFS','YARN','Hive','Spark']),340,246,'Stack legacy','Si trova ancora in molte installazioni esistenti.');
    cell(duo,'Direzione moderna, ibrida',chain(['Object storage','Spark / Trino / Flink','Iceberg / Delta']),340,246,'Stack moderno','Storage nel cloud, motori più recenti, formati di tabella aperti.');
  })();
  wideFigs(5);
};
QZ['5a']=()=>[{q:'Un file da 1 GB (1024 MB) è memorizzato in HDFS con blocchi da 128 MB e il fattore di replica predefinito. Quante copie di blocchi finiscono sui data node?',o:['8','3','24','1024'],a:2,
  e:'1024 / 128 = 8 blocchi, ciascuno memorizzato 3 volte: 8 × 3 = 24 copie di blocchi.',h:'Conta prima i blocchi, poi ricorda quante copie di ogni blocco tiene HDFS per impostazione predefinita.'}];
QZ['5b']=()=>[{q:'Nella figura, il guasto di quale singolo rack renderebbe illeggibile il blocco B3?',o:['Rack 1','Rack 2','Rack 3','Nessuno'],a:3,
  e:'B3 ha copie sul nodo 6 (rack 2) e sui nodi 8 e 9 (rack 3). Perdere un rack qualunque lascia almeno una copia.',h:'Trova i rack che contengono copie di B3, e chiediti se un solo rack le contiene tutte.'}];
QZ['5c']=()=>[{q:'Un conteggio delle parole con MapReduce gira sul testo «to be or not to be». Quante coppie chiave/valore emettono i mapper, e quante ne scrive il reducer?',o:['4 e 6','6 e 6','6 e 4','4 e 4'],a:2,
  e:'I mapper emettono una coppia (parola, 1) per ogni parola: 6. Il reducer scrive una coppia per ogni parola distinta: (be, 2), (not, 1), (or, 1), (to, 2), quindi 4.',h:'I mapper lavorano parola per parola; il reducer chiave per chiave.'}];
QZ['5d']=()=>[{q:'Un\'analista di marketing vuole interrogare in SQL dati memorizzati in Hadoop, dallo strumento di BI che usa già. Quale componente lo rende possibile?',o:['Sqoop','Hive, attraverso un driver ODBC','Oozie','Zookeeper'],a:1,
  e:'Hive è l\'interfaccia SQL di Hadoop, e i driver ODBC delle distribuzioni permettono a qualunque strumento di BI o di reportistica di collegarsi a Hive come a un RDBMS.',h:'Ricorda quale servizio per i dati possono raggiungere gli strumenti di BI attraverso un driver standard.'}];
QZ['5e']=()=>[{q:'Perché Kylin può rispondere ad alcune query di Hive molto più in fretta di Hive da solo?',o:['Tiene in memoria una copia di tutti i dati grezzi','Salva in HBase aggregazioni precalcolate e risponde a partire da quelle','Sostituisce HDFS con un file system più veloce','Esegue le query sul portatile dell\'utente'],a:1,
  e:'Kylin è uno strumento OLAP che memorizza le aggregazioni nella memorizzazione a colonne di HBase e le usa per rispondere alle query di Hive, invece di ricalcolare le somme dalle righe di dettaglio.',h:'Ricorda che cosa preparano in anticipo gli strumenti OLAP.'}];
QZ['5']=()=>[
  {q:'Un\'azienda memorizza 10 TB di dati. Quanto spazio su disco le serve con fattore di replica 3, e quanto con l\'erasure coding al 50% di sovraccarico?',o:['30 TB e 15 TB','30 TB e 5 TB','13 TB e 15 TB','20 TB e 10 TB'],a:0,
   e:'La replica tiene tre copie complete: 3 × 10 = 30 TB. L\'erasure coding aggiunge il 50%: 10 + 5 = 15 TB.',h:'Il sovraccarico è lo spazio oltre ai dati stessi: calcola spazio occupato = dati × (1 + sovraccarico).'},
  {q:'MapReduce conta le lettere di «B A B C B A». Che cosa scrive il reducer?',o:['(A, 2), (B, 2), (C, 2)','(A, 2), (B, 3), (C, 1)','(A, {1, 1}), (B, {1, 1, 1}), (C, {1})','(B, 3)'],a:1,
   e:'Il raggruppamento dà (A, {1, 1}), (B, {1, 1, 1}), (C, {1}); il reducer somma ogni elenco: (A, 2), (B, 3), (C, 1).',h:'Una delle opzioni è l\'output del passo di raggruppamento, non del reducer.'},
  {q:'Con la regola di disposizione della figura (una copia su un rack, due su un altro), quanti rack devono guastarsi contemporaneamente, come minimo, perché qualche blocco diventi illeggibile?',o:['1','3','Non può mai succedere','2'],a:3,
   e:'Ogni blocco vive esattamente su due rack; se si guastano entrambi insieme, le sue tre copie spariscono. Il guasto di un solo rack non basta mai.',h:'Conta su quanti rack diversi sono sparse le copie di un singolo blocco.'},
  {q:'Per quale di questi lavori è progettato MapReduce?',o:['Aggiornare ogni secondo una dashboard delle vendite','Cercare un cliente per id','Aggregare di notte un anno di log di un server web','Rispondere in tempo reale alle domande SQL estemporanee degli analisti'],a:2,
   e:'MapReduce è costruito per carichi batch su dati enormi, che finiscono in minuti od ore; gli altri tre sono carichi interattivi.',h:'Pensa a quanto dura un job MapReduce e a quanto accetterebbe di aspettare ciascuno di questi utenti.'},
  {q:'Ogni notte un\'azienda importa la tabella dei clienti dal suo database Oracle in Hadoop, poi esegue su di essa un job Hive. Quali due strumenti sono adatti?',o:['Flume per importare, Ambari per pianificare','Sqoop per importare, Oozie per orchestrare i due job','Storm per importare, Zookeeper per pianificare','HBase per importare, Kylin per orchestrare'],a:1,
   e:'Sqoop sposta i dati fra un RDBMS e Hadoop; Oozie orchestra l\'esecuzione di job diversi, come un\'importazione con Sqoop seguita da un job Hive.',h:'Uno strumento è il ponte verso i database relazionali, l\'altro è lo strumento di workflow.'},
  {q:'Nella direzione moderna descritta nella lezione, che cosa prende il posto di HDFS e di MapReduce?',o:['YARN e Hive','Kafka e Zookeeper','HBase e Pig','L\'object storage, e motori come Spark, Trino o Flink'],a:3,
   e:'Il percorso moderno è object storage → Spark / Trino / Flink → Iceberg / Delta: lo storage nel cloud sostituisce HDFS, i motori più recenti sostituiscono MapReduce.',h:'Confronta i due riquadri della figura sugli stack strato per strato.'}
];
/* mappa mentale del riepilogo */
MAPPA[5]={c:'Come si memorizza un file più grande di qualunque disco?',r:[
  {t:'Hadoop',c:BLUE,v:['HDFS per memorizzare, MapReduce per calcolare','Open source, migliaia di nodi, hardware comune','Tollerante ai guasti']},
  {t:'HDFS',c:GRN,v:['File tagliati in blocchi da 64 o 128 MB','Ogni blocco replicato 3 volte, su rack diversi','Name node: metadati; data node: letture e scritture','Erasure coding: sovraccarico del 50% invece del 200%']},
  {t:'MapReduce',c:YEL,v:['Map: coppie chiave/valore vicino ai dati','Shuffle: stessa chiave, stesso reducer','Reduce: calcolo per chiave, risultato in HDFS','Per job batch, non per query interattive']},
  {t:'Ecosistema',c:ORG,v:['Base: HDFS, YARN, MapReduce, Tez, Spark','Dati: Hive, Pig, HBase, Sqoop, Flume','Operativi: Ambari, Oozie, Zookeeper','Analisi: Mahout, Kylin, Spark, KNIME']},
  {t:'Oggi',c:PINK,v:['Hadoop: infrastruttura già installata','Object storage con Spark, Trino, Flink','Formati di tabella: Iceberg, Delta Lake','Da imparare: i concetti, non MapReduce']}]};
