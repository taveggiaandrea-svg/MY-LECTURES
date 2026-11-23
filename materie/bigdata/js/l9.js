/* Lezione 9: AI predittiva e generativa, strutture di dati, casi d'uso */
const PREDC=BLUE,GENC=PINK;
const gauss9=r=>{const u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
INIT[9]=function(){
  codeHL($('#lezione-9'));
  /* predictive vs generative */
  (function(){
    const duo=el('div','duo');$('#b9pg').append(duo);const r=lcg(9);
    const A=[],B=[];for(let k=0;k<22;k++){A.push([110+gauss9(r)*26,150+gauss9(r)*22]);B.push([220+gauss9(r)*26,80+gauss9(r)*22])}
    const ax=(s)=>s+line(30,210,320,210,'#666',1.2)+line(30,210,30,14,'#666',1.2)+tx(110,228,'feature 1',{s:12.5,f:GRAY})+tx(24,112,'feature 2',{s:12.5,f:GRAY,a:'middle',x:' transform="rotate(-90 24 112)"'});
    let a='<clipPath id="b9c1"><rect x="30" y="14" width="290" height="196"/></clipPath><g clip-path="url(#b9c1)">';
    A.forEach(([x,y])=>a+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>');B.forEach(([x,y])=>a+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff"/>');
    a+=line(60,20,300,210,'#ddd',1.6,' stroke-dasharray="6 4"')+'</g>';
    a+='<circle cx="196" cy="112" r="8" fill="none" stroke="'+PREDC+'" stroke-width="2.5"/>'+line(203,119,236,146,PREDC,1.2)+tx(238,160,'cliente nuovo?',{s:12.5,f:PREDC,a:'start'})+tx(238,176,'previsto: se ne va',{s:12.5,f:PREDC,a:'start'});
    a+='<circle cx="184" cy="224" r="5" fill="#fff"/>'+tx(193,228,'uscito',{s:12.5,f:'#fff',a:'start'})+'<circle cx="250" cy="224" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>'+tx(259,228,'rimasto',{s:12.5,f:'#ccc',a:'start'});
    cell(duo,'Predittivo: impara un confine',ax(a),340,236,'Modello predittivo','Entrano le feature, esce il target: <b>se ne va o resta</b>.');
    let b='';[[110,150],[220,80]].forEach(([cx,cy])=>{[[62,52,.35],[38,32,.6]].forEach(([rx,ry,o])=>b+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+GENC+'" stroke-opacity="'+o+'" stroke-width="1.5"/>')});
    A.concat(B).forEach(([x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#777"/>');
    const r2=lcg(31);for(let k=0;k<8;k++){const c=k%2?[220,80]:[110,150];b+='<circle cx="'+(c[0]+gauss9(r2)*22)+'" cy="'+(c[1]+gauss9(r2)*18)+'" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'}
    b+='<circle cx="190" cy="224" r="3.5" fill="#777"/>'+tx(198,228,'dati',{s:12.5,f:GRAY,a:'start'})+'<circle cx="240" cy="224" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'+tx(249,228,'generati',{s:12.5,f:'#fff',a:'start'});
    cell(duo,'Generativo: impara la forma',ax(b),340,236,'Modello generativo','Nessun target: <b>osservazioni nuove</b> simili ai dati.');
  })();
  /* McKinsey ranges */
  (function(){
    let s='';const L=20,R=500,X=v=>L+v/30*(R-L);
    [0,5,10,15,20,25,30].forEach(v=>{s+=line(X(v),22,X(v),272,'#222',1)+tx(X(v),290,String(v),{s:13,f:GRAY})});
    const rows=[['Analisi avanzata, ML tradizionale e deep learning',11.0,17.7,PREDC],['Nuovi casi d\'uso dell\'AI generativa',2.6,4.4,GENC],['Potenziale totale dei casi d\'uso',13.6,22.1,'#9a9a9a'],['Produttività dei lavoratori resa possibile dall\'AI generativa',6.1,7.9,GENC],['Potenziale economico totale dell\'AI',17.1,25.6,'#fff']];
    rows.forEach(([l,lo,hi,c],k)=>{const y=26+k*50;s+=tx(L,y+10,l,{s:13,f:'#ddd',a:'start'})+rect(X(lo),y+16,X(hi)-X(lo),20,c)+tx(X(hi)+8,y+31,'da '+lo.toFixed(1).replace('.',',')+' a '+hi.toFixed(1).replace('.',','),{s:13,f:'#fff',a:'start'})});
    s+=tx(260,308,'migliaia di miliardi di dollari l\'anno',{s:13,f:GRAY});
    s+=tx(640,22,'quota del totale',{s:13,f:GRAY});const top=34,H=238;
    s+=rect(610,top,60,H*.325,GENC)+rect(610,top+H*.325,60,H*.675,PREDC)+tx(604,top+H*.16+5,'30-35%',{s:13,f:'#fff',a:'end'})+tx(604,top+H*.325+H*.34+5,'65-70%',{s:13,f:'#fff',a:'end'});
    s+=tx(640,top+H+20,'generativa',{s:12.5,f:GENC})+tx(640,top+H+36,'predittiva',{s:12.5,f:PREDC});
    svgBox($('#b9mck'),720,316,s,'Potenziale economico dell\'AI, McKinsey 2023','46rem');
  })();
  /* State of AI 2026 */
  (function(){
    let s='';const rows=[[89,'usano l\'AI in almeno una funzione aziendale'],[44,'stanno estendendo l\'AI a tutta l\'azienda'],[37,'riportano un impatto positivo dell\'AI sull\'EBIT'],[6,'sono AI high performer (almeno il 5% dell\'EBIT dall\'AI)']];
    rows.forEach(([v,l],k)=>{const y=14+k*52;s+=tx(20,y+12,l,{s:13,f:'#ddd',a:'start'})+rect(20,y+18,v/100*560,24,k===3?'#fff':'#777')+tx(20+v/100*560+10,y+37,v+'%',{s:17,f:'#fff',w:600,a:'start'})});
    svgBox($('#b9adopt'),720,222,s,'Quota di organizzazioni per stadio di adozione dell\'AI','46rem');
  })();
  /* eight phases and five milestones */
  (function(){
    let s='';const ph=[['OLTP, SQL','','report','statici'],['DWH, SQL','','report','statici'],['DWH, BI,','OLAP','report','dinamici'],['DWH, OLAP,','data mining','analisi','predittiva'],['Cloud,','collaborazione','analisi','avanzata'],['Hadoop,','Big Data','analisi','prescrittiva'],['AI','generativa','LLM,','copilot'],['AI','agentica','AI che','agisce']];
    ph.forEach(([a,b,c,c2],i)=>{const x=6+i*89,w=86;s+='<polygon points="'+[x,8,x+w-10,8,x+w,25,x+w-10,42,x,42,x+(i?10:0),25].join(' ')+'" fill="'+(i>=6?'#2a2a2a':'#1a1a1a')+'" stroke="#9a9a9a"/>'+tx(x+w/2+(i?3:0),30,'Fase '+(i+1),{s:13,f:'#fff',w:600});
      s+=tx(x+w/2,62,a,{s:12.5,f:'#fff'})+(b?tx(x+w/2,78,b,{s:12.5,f:'#fff'}):'')+tx(x+w/2,98,c,{s:12.5,f:GRAY})+tx(x+w/2,113,c2,{s:12.5,f:GRAY})});
    const ms=[['primi anni Novanta',['strumenti di BI'],['attenzione agli','strumenti']],['2005',['applicazioni di','business analytics'],['attenzione alle','applicazioni']],['2012',['Big Data'],['attenzione ai dati']],['2022',['piattaforme di','AI generativa'],['attenzione al','linguaggio naturale']],['2025',['agenti AI,','flussi agentici'],['attenzione','all\'azione autonoma']]];
    ms.forEach(([yr,ln,fc],k)=>{const x=8+k*142,y=300-k*36,w=132;s+=rect(x,y,w,40,k>=3?'#2a2a2a':'#1a1a1a','#bbb');
      ln.forEach((l,j)=>s+=tx(x+w/2,y+(ln.length===1?25:17+j*16),l,{s:12.5,f:'#fff'}));
      s+=tx(x+4,y-8,yr,{s:13,f:'#fff',w:600,a:'start'})+line(x+w/2,y+40,x+w/2,352,'#444',1,' stroke-dasharray="3 3"');
      fc.forEach((l,j)=>s+=tx(x+w/2,370+j*16,l,{s:12.5,f:GRAY}))});
    s+=tx(10,140,'Business intelligence → AI',{s:13,f:GRAY,a:'start'});
    svgBox($('#b9evo'),720,394,s,'Otto fasi delle tecniche e degli strumenti di analisi','46rem');
  })();
  /* elements of a BI system */
  (function(){
    let s='<defs>'+arrowDef('b9b1',GRAY)+'</defs>';const A=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,GRAY,1.4,' marker-end="url(#b9b1)"');
    s+=tx(70,18,'Fonti operative',{s:13,f:GRAY});['CRM','ERP','Sistemi legacy','File, web, IoT'].forEach((l,k)=>s+=box(10,28+k*48,120,38,[l]));
    s+=box(178,92,96,56,['Area di','staging'],{fs:14});[0,1,2,3].forEach(k=>s+=A(132,47+k*48,176,120));s+=tx(156,26,'ETL',{s:12.5,f:GRAY});
    s+=cyl(318,82,110,76,'');s+=tx(373,116,'Enterprise',{s:13.5,f:'#fff'})+tx(373,134,'data warehouse',{s:13.5,f:'#fff'});s+=A(276,120,316,120)+tx(296,110,'ETL',{s:12.5,f:GRAY});
    s+=tx(520,18,'Data mart',{s:13,f:GRAY});['Marketing','Finanza','Vendite'].forEach((l,k)=>{s+=box(470,40+k*56,100,40,[l]);s+=A(430,120,468,60+k*56)});
    s+=tx(650,18,'Strumenti client',{s:13,f:GRAY});['OLAP','Report, dashboard','Data mining, ML','Copilot AI'].forEach((l,k)=>{s+=box(590,28+k*48,126,38,[l],{fs:12.5});});
    s+=A(572,120,588,120);
    s+=rect(10,236,704,34,'#141414','#9a9a9a',' stroke-dasharray="5 4"')+tx(362,258,'Governance: master data, qualità dei dati, metadati e lineage, sicurezza e privacy (GDPR)',{s:13,f:'#ddd'});
    svgBox($('#b9bi'),720,276,s,'Elementi di un sistema di BI','46rem');
  })();
  /* Inmon's four properties */
  (function(){
    const duo=el('div','duo');$('#b9inmon').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    let a=ar('b9i1');[['ERP','"M. Rossi"'],['CRM','"Mario Rossi"'],['web','"mrossi"']].forEach(([n,v],k)=>{a+=box(10,8+k*48,130,40,[n,v],{fs:13});a+=line(142,28+k*48,196,80,GRAY,1.4,' marker-end="url(#b9i1)"')});
    a+=box(200,52,130,56,['cliente 1042','Mario Rossi'],{fs:13.5,st:'#fff',sw:2});
    cell(duo,'Integrato',a,340,156,'Integrato','Fonti diverse, un solo contenitore omogeneo.');
    let b=ar('b9i2');['vendite','prestiti','traffico in uscita'].forEach((n,k)=>b+=box(10,8+k*48,120,38,[n],{fs:13,f:'#141414',st:'#555'}));['clienti','prodotti','canali'].forEach((n,k)=>b+=box(210,8+k*48,120,38,[n],{fs:13.5,st:'#fff'}));
    b+=tx(70,160,'applicazioni',{s:12.5,f:GRAY})+tx(270,160,'soggetti',{s:12.5,f:'#fff'})+line(134,76,204,76,GRAY,1.6,' marker-end="url(#b9i2)"');
    cell(duo,'Orientato ai soggetti',b,340,166,'Orientato ai soggetti','Organizzato per soggetto, non per applicazione.');
    let c='';['gen','feb','mar','apr','mag'].forEach((m,k)=>{c+=rect(40,128-k*26,150,22,k===4?'#3a3a3a':'#1e1e1e','#9a9a9a')+tx(115,143-k*26,'caricamento di '+m,{s:12.5,f:'#fff'})});
    c+=box(220,50,110,56,['utenti','sola lettura'],{fs:13.5})+tx(275,124,'niente modifiche',{s:12.5,f:GRAY})+tx(275,140,'né cancellazioni',{s:12.5,f:GRAY});
    cell(duo,'Non volatile',c,340,156,'Non volatile','Cresce con caricamenti regolari; gli utenti non possono modificarlo.');
    let d=line(20,120,320,120,'#777',1.5);[2022,2023,2024,2025,2026].forEach((y,k)=>{const x=40+k*65;d+=rect(x-24,40,48,60,'#1a1a1a','#9a9a9a');[0,1,2].forEach(j=>d+=rect(x-16,50+j*14,32,7,'#555'));d+=line(x,100,x,120,'#777',1)+tx(x,140,String(y),{s:12.5,f:GRAY})});
    cell(duo,'Variabile nel tempo',d,340,156,'Variabile nel tempo','Istantanee periodiche che coprono più anni.');
  })();
  /* IDC Global DataSphere */
  (function(){
    let s='';const U=[['ZB','10²¹ byte','1 miliardo di TB'],['EB','10¹⁸','traffico mobile mensile di un grande paese'],['PB','10¹⁵','il DWH di una grande azienda'],['TB','10¹²','il disco di un portatile'],['GB','10⁹','un film in HD']];
    U.forEach(([u,p,e],k)=>{const y=14+k*52;s+=rect(10,y,40,40,k?'#1a1a1a':'#2c2c2c','#9a9a9a')+tx(30,y+25,u,{s:14,f:'#fff',w:600})+tx(58,y+16,p,{s:12.5,f:'#fff',a:'start'});
      const words=e.split(' ');let l1=e,l2='';if(e.length>24){const m=Math.ceil(words.length/2);l1=words.slice(0,m).join(' ');l2=words.slice(m).join(' ')}s+=tx(58,y+31,l1,{s:12.5,f:GRAY,a:'start'})+(l2?tx(58,y+45,l2,{s:12.5,f:GRAY,a:'start'}):'')});
    s+=tx(130,284,'× 1000 a ogni gradino',{s:12.5,f:GRAY});
    const D=[['2010',2],['2012',7],['2014',13],['2016',18],['2018',33],['2020',64],['2021',79],['2022',97],['2023',120],['2024',149],['2025',181],['2028',394]];
    const x0=262,bw=30,gap=7.5,Y=v=>262-v/400*226;
    [0,100,200,300,400].forEach(v=>{s+=line(x0-6,Y(v),712,Y(v),'#222',1)+tx(x0-10,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'})});
    D.forEach(([y,v],k)=>{const x=x0+k*(bw+gap),f=k===11;s+=rect(x,Y(v),bw,262-Y(v),f?'none':(k>=9?'#9a9a9a':'#ddd'),f?'#ddd':'none',f?' stroke-dasharray="4 3" stroke-width="1.5"':'')+tx(x+bw/2,Y(v)-6,String(v),{s:12.5,f:'#fff'})+tx(x+bw/2,280,y==='2028'?'2028P':"'"+y.slice(2),{s:12.5,f:GRAY})});
    s+=tx(486,298,'zettabyte all\'anno; 2024 e 2025 stime, 2028 previsione (P)',{s:12.5,f:GRAY});
    svgBox($('#b9idc'),720,306,s,'Global DataSphere in zettabyte, IDC','46rem');
  })();
  /* volume and complexity */
  (function(){
    let s='';const lv={MB:290,GB:215,TB:135,PB:55};
    Object.keys(lv).forEach(k=>{s+=tx(52,lv[k]+5,k,{s:14,f:'#fff',w:600,a:'end'})+line(62,lv[k],700,lv[k],'#1c1c1c',1)});
    s+=line(64,324,700,324,'#777',1.4)+line(64,324,64,20,'#777',1.4)+tx(30,22,'volume',{s:12.5,f:GRAY,a:'start'});
    [['complessità bassa',190],['complessità media',400],['complessità alta',610]].forEach(([l,x])=>s+=tx(x,344,l,{s:13,f:GRAY}));
    const B=[['SCM','',150,285,30,0],['ERP','ordini, vendite',192,215,40,0],['CRM','campagne',262,252,34,0],['Transazioni','finanziarie',178,135,38,1],['DCS,','sensori',292,58,34,1],['Log web','clickstream',392,135,40,1],['Dati','scientifici',402,55,36,1],['Documenti','Word, Excel, PDF',512,212,48,2],['Audio,','video, foto',604,140,40,2],['Social','network, UGC',614,54,46,2]];
    B.forEach(([a,b,x,y,r,t])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.6"/>';const c=t?'#fff':'#000';
      s+=tx(x,y+(b?-1:5),a,{s:12.5,f:c,w:600})+(b?tx(x,y+14,b,{s:11,f:t?'#ddd':'#333'}):'')});
    const lg=[['strutturati',0],['semi-strutturati',1],['non strutturati',2]];lg.forEach(([l,t],k)=>{const x=200+k*140;s+='<circle cx="'+x+'" cy="'+366+'" r="7" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.4"/>'+tx(x+12,370,l,{s:12.5,f:'#ddd',a:'start'})});
    svgBox($('#b9vc'),720,378,s,'Fonti di dati per volume e complessità','46rem');
  })();
  /* IoT */
  (function(){
    const duo=el('div','duo');$('#b9iot').append(duo);
    let a='';const Y=v=>200-v/40*170;[0,10,20,30,40].forEach(v=>a+=line(60,Y(v),320,Y(v),'#222',1)+tx(52,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    a+=rect(90,Y(21.1),70,200-Y(21.1),'#ddd')+tx(125,Y(21.1)-8,'21,1',{s:14,f:'#fff',w:600})+tx(125,220,'2025',{s:13,f:GRAY});
    a+=rect(220,Y(39),70,200-Y(39),'none','#ddd',' stroke-dasharray="4 3" stroke-width="1.5"')+tx(255,Y(39)-8,'39',{s:14,f:'#fff',w:600})+tx(255,220,'2030 (atteso)',{s:13,f:GRAY});
    a+=tx(160,Y(31),'≈ 13% l\'anno',{s:12.5,f:GRAY});
    cell(duo,'Dispositivi connessi, miliardi',a,340,230,'Dispositivi IoT','Quasi il doppio in cinque anni.');
    let b='';[['Wi-Fi',32],['Bluetooth',24],['Rete cellulare',22],['Altre',22]].forEach(([l,v],k)=>{const y=14+k*46;b+=tx(100,y+20,l,{s:13.5,f:k<3?'#fff':GRAY,a:'end'})+rect(110,y+4,v*6,24,k<3?'#9a9a9a':'#333')+tx(116+v*6,y+21,v+'%',{s:13.5,f:'#fff',a:'start'})});
    b+=tx(170,210,'Wi-Fi, Bluetooth e reti cellulari: circa il 78%',{s:12.5,f:GRAY});
    cell(duo,'Quota delle connessioni IoT',b,340,230,'Connettività IoT','Tre tecnologie portano la maggior parte delle connessioni.');
  })();
  /* analysis loop */
  (function(){
    let s='<defs>'+arrowDef('b9l1',GRAY)+arrowDef('b9l2','#ddd')+'</defs>';const st=[['Generare dati','persone, macchine,','transazioni, IoT'],['Acquisizione','batch, streaming:','ETL, ELT, API, Kafka'],['Memorizzare','DWH, data lake,','lakehouse'],['Analizzare','BI, statistica, ML:','KNIME, Python, R, Spark'],['Conoscenze','decisioni, azioni,','agenti AI']];
    s+='<path d="M650 70 C 650 30, 640 26, 600 26 L 120 26 C 80 26, 73 34, 73 66" fill="none" stroke="#ddd" stroke-width="1.6" marker-end="url(#b9l2)"/>';
    s+=tx(360,50,'le conoscenze cambiano le decisioni, le decisioni generano nuovi dati',{s:13,f:'#fff'});
    st.forEach(([a,b,c],k)=>{const x=6+k*143;s+=rect(x,70,134,40,'#1a1a1a','#bbb')+tx(x+67,95,a,{s:14,f:'#fff',w:600})+tx(x+67,130,b,{s:12.5,f:GRAY})+tx(x+67,146,c,{s:12.5,f:GRAY});if(k<4)s+=line(x+135,90,x+141,90,GRAY,1.5,' marker-end="url(#b9l1)"')});
    s+=tx(360,178,'quindi i modelli vanno monitorati e riaddestrati nel tempo',{s:12.5,f:GRAY});
    svgBox($('#b9loop'),720,188,s,'Il processo di analisi come ciclo','46rem');
  })();
  /* Zalando forecast error */
  (function(){
    let s='';const L=170,R=640,X=v=>L+v/0.7*(R-L);[0,0.2,0.4,0.6].forEach(v=>s+=line(X(v),10,X(v),140,'#222',1)+tx(X(v),158,fi(v,1),{s:12.5,f:GRAY}));
    [['previsione ingenua',0.603,'#555'],['LightGBM',0.489,'#9a9a9a'],['transformer',0.449,'#fff']].forEach(([l,v,c],k)=>{const y=16+k*42;s+=tx(L-10,y+19,l,{s:13.5,f:'#fff',a:'end'})+rect(X(0),y,X(v)-X(0),28,c)+tx(X(v)+8,y+19,fi(v,3),{s:13.5,f:'#fff',a:'start'})});
    s+=tx((L+R)/2,176,'errore di previsione della domanda, dati 2022 (più basso è meglio)',{s:12.5,f:GRAY});
    svgBox($('#b9zal'),720,184,s,'Errore di previsione della domanda di Zalando per modello','46rem');
  })();
  wideFigs(9);
};
QZ['9a']=()=>[{q:'Quale di questi è un compito predittivo nel senso della lezione?',o:['Scrivere un\'e-mail personalizzata per ogni segmento di clienti','Stimare la probabilità di ogni cliente di andarsene il mese prossimo','Generare nuove immagini di prodotto per una campagna','Abbozzare le risposte alle recensioni dei clienti'],a:1,
  e:'Un modello predittivo impara una funzione dalle feature a un target, qui «se ne andrà» con una probabilità. Gli altri tre creano contenuti nuovi: AI generativa.',h:'Cerca una variabile target da stimare.'}];
QZ['9b']=()=>[{q:'Usando gli estremi superiori di McKinsey, che quota del potenziale economico totale dell\'AI (25,6 migliaia di miliardi di dollari) viene dalla produttività resa possibile dall\'AI generativa (7,9)?',o:['17%','69%','31%','45%'],a:2,
  e:'7,9 / 25,6 ≈ 0,31, quindi circa il 31%, dentro l\'intervallo dal 30 al 35% del grafico; il restante 69% è predittivo.',h:'Dividi la parte generativa per il totale.'}];
QZ['9c']=()=>[{q:'Un data warehouse tiene istantanee mensili dei saldi dei clienti degli ultimi dieci anni. Quale proprietà di Inmon illustra?',o:['Integrato','Orientato ai soggetti','Non volatile','Variabile nel tempo'],a:3,
  e:'Variabile nel tempo significa che i dati sono istantanee periodiche dell\'attività che coprono diversi anni di storia.',h:'Confronta la descrizione con le quattro definizioni una per una.'}];
QZ['9d']=()=>[{q:'Da 2 ZB nel 2010 a circa 181 ZB nel 2025: all\'incirca quante volte è cresciuto il volume annuo, e quanti terabyte ci sono in uno zettabyte?',o:['Circa 90 volte; un miliardo di TB','Circa 9 volte; un milione di TB','Circa 180 volte; un miliardo di TB','Circa 90 volte; mille TB'],a:0,
  e:'181 / 2 ≈ 90. Uno zettabyte è 10²¹ byte e un terabyte 10¹², quindi 1 ZB = 10⁹ TB, un miliardo di terabyte.',h:'Conta i gradini da mille fra TB e ZB sulla scala.'}];
QZ['9e']=()=>[{q:'Il transformer di Zalando ha un errore di 0,449, contro 0,489 di LightGBM e 0,603 di una previsione ingenua. Di quanto riduce, in termini relativi, l\'errore di LightGBM e quello della previsione ingenua?',o:['Circa il 4% e il 15%','Circa l\'8% e il 26%','Circa il 40% e il 15%','Circa il 9% e il 34%'],a:1,
  e:'(0,489 − 0,449) / 0,489 ≈ 0,082, circa l\'8%; (0,603 − 0,449) / 0,603 ≈ 0,255, circa il 26%. Una baseline ad alberi con gradient boosting cattura già la maggior parte del guadagno rispetto alla previsione ingenua.',h:'Riduzione relativa = (vecchio − nuovo) / vecchio.'}];
QZ['9']=()=>[
  {q:'I dispositivi IoT erano 21,1 miliardi nel 2025. Crescendo di circa il 13% l\'anno, quanti saranno all\'incirca nel 2030?',o:['Circa 39 miliardi','Circa 35 miliardi','Circa 24 miliardi','Circa 60 miliardi'],a:0,
   e:'La crescita è composta: 21,1 × 1,13⁵ ≈ 21,1 × 1,84 ≈ 38,9 miliardi, i 39 miliardi della previsione. Aggiungere cinque volte il 13% di 21,1 (35 miliardi) dimentica l\'effetto composto.',h:'Applica il 13% a una base che cresce ogni anno.'},
  {q:'Trenitalia si aspetta un taglio dell\'8% dei costi di manutenzione, che ammontano a circa 1,3 miliardi di euro l\'anno, a fronte di un investimento di circa 50 milioni di euro. Qual è il risparmio annuo, e in quanto tempo all\'incirca si recupera l\'investimento?',o:['10,4 milioni di euro; circa 5 anni','104 milioni di euro; circa 6 mesi','104 milioni di euro; circa 2 anni','1,04 miliardi di euro; circa 2 settimane'],a:1,
   e:'0,08 × 1300 = 104 milioni di euro l\'anno, gli «oltre 100 milioni» della lezione. 50 milioni / 104 milioni ≈ 0,48 anni, circa sei mesi.',h:'Prima l\'8% di 1,3 miliardi, poi dividi l\'investimento per il risparmio annuo.'},
  {q:'Nell\'indagine State of AI, su 1000 organizzazioni, quante sono AI high performer, e che quota sono delle organizzazioni che usano l\'AI?',o:['6, circa lo 0,7%','60, circa il 6,7%','60, circa il 13,6%','440, circa il 49%'],a:1,
   e:'Il 6% di 1000 è 60; chi usa l\'AI è l\'89%, cioè 890 organizzazioni, e 60 / 890 ≈ 6,7%.',h:'Gli high performer sono il 6% di tutte le organizzazioni, non di quelle che usano l\'AI.'},
  {q:'Un sistema degli ordini deve mostrare la giacenza di ogni articolo, aggiornata a ogni vendita; un analista ha bisogno di dieci anni di vendite mensili per regione. Quali sistemi sono adatti?',o:['Il data warehouse per entrambi','Il database operativo per entrambi','Il database operativo per la giacenza, il data warehouse per lo storico delle vendite','Il data warehouse per la giacenza, il database operativo per lo storico'],a:2,
   e:'I database operativi contengono dati completi e attuali aggiornati in tempo reale per le operazioni quotidiane; il warehouse contiene la storia aggregata come istantanee periodiche per l\'analisi.',h:'Ricorda le righe «Dati» e «Uso» della tabella di confronto.'},
  {q:'Un\'azienda dice di non avere Big Data perché i suoi database arrivano in tutto a soli 2 TB, anche se riceve un flusso continuo di letture di sensori e migliaia di recensioni in testo libero. Che cosa risponderebbe la lezione?',o:['Ha ragione: sotto il petabyte non ci sono Big Data','I Big Data non sono solo volume: varietà e velocità spesso contano di più','Contano come Big Data solo i dati del web','Dovrebbe prima raccogliere tutti i dati del mondo'],a:1,
   e:'La slide della lezione che chiarisce il concetto fa notare che la varietà (recensioni non strutturate) e la velocità (sensori in streaming) spesso contano più del volume, e che contano i dati pertinenti.',h:'Ricorda la slide della lezione che chiarisce il concetto di Big Data.'},
  {q:'Una banca vuole segnalare le transazioni con carta fraudolente, che sono circa lo 0,1% di tutte le transazioni. Quale impostazione corrisponde alla tabella della lezione?',o:['Regressione sull\'importo di ogni transazione','Clustering dei clienti in segmenti','Classificazione su dati molto sbilanciati, con individuazione delle anomalie e tecniche come SMOTE','Previsione su serie storiche delle transazioni della settimana prossima'],a:2,
   e:'L\'individuazione delle frodi è una classificazione con una classe positiva molto rara: modelli come i gradient boosted trees, con SMOTE per creare frodi sintetiche, e individuazione delle anomalie.',h:'Guarda l\'ultima tabella della lezione.'}
];
