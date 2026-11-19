/* Lesson 8: data lake architectures */
const HOT=ORG,COLD=BLUE;
const qChip8=(x,y,q,o)=>{o=o||{};const st=o.bad?RED:o.good?GRN:'#888';return rect(x,y,70,22,o.bad?'rgba(252,98,85,.12)':'#1a1a1a',st)+tx(x+35,y+16,q,{s:12.5,f:o.bad?'#c88':'#fff'})};
INIT[8]=function(){
  codeHL($('#lezione-8'));
  /* technologies by phase */
  (function(){
    let s='';const ph=[['Ingest','the raw data',['Spark SQL','Spark Streaming'],['Kafka, Flume','Storm, Sqoop']],['Transform','and integrate',['Spark SQL'],['Pig, Hive']],['Store','raw and processed',[],['HDFS']],['Analyze','to get insights',['Spark SQL, Spark ML','GraphX'],['Hive, Mahout']]];
    ph.forEach(([n,d,sp,hd],i)=>{const x=10+i*176,w=170;s+='<polygon points="'+[x,20,x+w-18,20,x+w,48,x+w-18,76,x,76,x+(i?18:0),48].join(' ')+'" fill="#1e1e1e" stroke="#9a9a9a"/>';
      s+=tx(x+w/2+(i?6:0),44,n,{s:15,f:'#fff',w:600})+tx(x+w/2+(i?6:0),63,d,{s:12.5,f:GRAY});
      s+=tx(x+w/2,104,'Spark',{s:13,f:GRAY});(sp.length?sp:['none']).forEach((l,j)=>s+=tx(x+w/2,124+j*18,l,{s:13.5,f:sp.length?'#fff':'#555'}));
      s+=tx(x+w/2,176,'Hadoop',{s:13,f:GRAY});hd.forEach((l,j)=>s+=tx(x+w/2,196+j*18,l,{s:13.5,f:'#fff'}))});
    s+=line(10,88,710,88,'#333',1)+line(10,160,710,160,'#333',1);
    svgBox($('#b8tech'),720,236,s,'Data lake technologies by phase','46rem');
  })();
  /* schema on write vs schema on read */
  (function(){
    const duo=el('div','duo');$('#b8schema').append(duo);
    const L=['20161130,ProdABD,300,4','20161205,ProdXYZ,n/a,7','20161210,ProdDEF,90,2'];
    let a=rect(10,6,320,46,'#141414','#9a9a9a')+mono(20,24,'CREATE TABLE sales (date INT,',{s:12.5})+mono(20,42,'  product VARCHAR, value INT, ...)',{s:12.5});
    a+=tx(170,74,'first the table, then the records',{s:12.5,f:GRAY});
    L.forEach((l,k)=>{const ok=k!==1,y=86+k*28;a+=rect(10,y,240,22,ok?OKBG:BADBG)+mono(18,y+16,l,{s:12.5})+tx(262,y+16,ok?'✓ loaded':'✗ rejected',{s:13,f:ok?GRN:RED,a:'start'})});
    const t=sTab(10,182,[{t:'date',w:86},{t:'product',w:86},{t:'value',w:60,a:'e',c:BLUE},{t:'cust.',w:56,a:'e'}],[['20161130','ProdABD','300','4'],['20161210','ProdDEF','90','2']],{rh:23,hh:24});
    a+=t.s;
    cell(duo,'Data warehouse: schema on write',a,340,262,'Schema on write','The bad record never enters: 2 rows of 3.');
    let b=rect(10,6,250,96,'#141414','#9a9a9a')+tx(20,24,'sales.csv in the lake (all 3 lines)',{s:12.5,f:GRAY,a:'start'});
    L.forEach((l,k)=>b+=mono(20,48+k*20,l,{s:12.5}));
    b+=tx(10,128,'reader A: value as INT',{s:13,f:'#fff',a:'start'})+tx(10,146,'"n/a" is read as NULL, the other values as numbers',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,180,'reader B: value as STRING',{s:13,f:'#fff',a:'start'})+tx(10,198,'keeps "n/a" as text, to find the bad records',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,232,'The schema lives in the reading code.',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Data lake: schema on read',b,340,262,'Schema on read','Everything is kept: 3 lines of 3.');
  })();
  /* cost per raw TB (approximate) */
  (function(){
    let s='';const L=150,R=600,X=v=>L+v/100*(R-L);
    [0,20,40,60,80,100].forEach(v=>{s+=line(X(v),8,X(v),214,'#222',1)+tx(X(v),234,'$'+(v?v+',000':'0'),{s:13,f:GRAY})});
    const rows=[['Cloud storage',0,1],['Hadoop',0,3],['NAS',12,18],['Engineered system',10,20],['MPP',21,80],['SAN',38,100]];
    rows.forEach(([l,lo,hi],k)=>{const y=14+k*34;s+=tx(L-10,y+16,l,{s:13.5,a:'end',f:k<2?'#fff':'#ccc',w:k<2?600:undefined});
      s+=rect(X(0),y,Math.max(X(lo)-X(0),0),22,'#2c2c2c')+rect(X(lo),y,Math.max(X(hi)-X(lo),3),22,k<2?'#fff':'#777');
      s+=tx(X(hi)+8,y+16,k<2?'a few $1,000':'≈ $'+lo+'k to $'+hi+'k',{s:12.5,f:GRAY,a:'start'})});
    s+=tx((L+R)/2,256,'fully loaded cost per raw TB, minimum to maximum (approximate)',{s:13,f:GRAY});
    svgBox($('#b8cost'),720,264,s,'Cost per raw terabyte by storage technology','46rem');
  })();
  /* four adoption steps */
  (function(){
    let s='';const st=[['01','Staging area and raw-data zone','low-cost, scalable landing place'],['02','Data-science environment','where machine learning experiments run'],['03','Offloading system for data warehouses','keeps the cold data of the DWH'],['04','Main component of the information system','involved in most data flows']];
    st.forEach(([n,l,d],k)=>{const y=200-k*56,hw=150-k*32,cx=160,top=hw-16;
      s+='<polygon points="'+[cx-hw,y+50,cx+hw,y+50,cx+top,y,cx-top,y].join(' ')+'" fill="'+['#2a2a2a','#383838','#474747','#5a5a5a'][k]+'" stroke="#111"/>'+tx(cx,y+32,n,{s:17,f:'#fff',w:600});
      s+=line(cx+top+8,y+25,330,y+25,'#555',1)+tx(340,y+22,l,{s:14,f:'#fff',a:'start',w:500})+tx(340,y+40,d,{s:12.5,f:GRAY,a:'start'})});
    svgBox($('#b8steps'),720,256,s,'Four steps of data lake adoption','46rem');
  })();
  /* traditional BI vs BI 2.0 */
  (function(){
    const duo=el('div','duo');$('#b8arch').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const up=(x,y1,y2,id)=>line(x,y1,x,y2,GRAY,1.6,' marker-end="url(#'+id+')"');
    let a=ar('b8u1');const cx=90,w=160;
    a+=box(cx,8,w,34,['Reporting'],{fs:14})+up(170,104,46,'b8u1')+box(cx,106,w,30,['Semantic layer'])+up(170,166,140,'b8u1');
    a+=box(cx,168,w,44,['Data warehouse','hot data'],{fs:14,c2:HOT,b:1})+up(170,252,216,'b8u1')+box(cx,254,w,28,['ETL'])+up(170,316,286,'b8u1')+box(cx,318,w,40,['Traditional sources','relational: ERP, CRM'],{fs:13.5});
    cell(duo,'Traditional BI',a,340,364,'Traditional BI','One path: ETL into the warehouse.');
    let b=ar('b8u2');const c1=10,c2=180,W=150;
    b+=box(10,8,320,34,['Reporting and advanced analytics'],{fs:14})+up(85,104,46,'b8u2')+up(255,104,46,'b8u2');
    b+=box(c1,106,W,30,['Semantic layer'])+box(c2,106,W,30,['Semantic layer'])+up(85,166,140,'b8u2')+up(255,158,140,'b8u2');
    b+=box(c1,168,W,44,['Data warehouse','hot, distilled'],{fs:14,c2:HOT,b:1})+rect(c2,160,W,78,'#0d0d0d','#666')+tx(255,180,'Data lake',{s:14,f:'#fff',w:600})+tx(255,198,'Hadoop, Spark',{s:13,f:GRAY})+tx(255,214,'raw, cold',{s:13,f:COLD})+tx(255,230,'quality, governance',{s:12.5,f:GRAY});
    b+=tx(170,197,'⇄',{s:18,f:'#ddd'});
    b+=up(85,252,216,'b8u2')+up(255,284,242,'b8u2')+box(c1,254,W,28,['ETL'])+box(c2,286,W,28,['Data ingestion']);
    b+=up(85,316,286,'b8u2')+up(255,342,318,'b8u2')+box(c1,318,W,40,['Traditional sources','relational'],{fs:13.5})+box(c2,320,W,40,['Emerging sources','logs, devices, social'],{fs:13.5});
    cell(duo,'BI 2.0, with a data lake',b,340,364,'BI 2.0','New sources land in the lake; results flow to the warehouse.');
  })();
  /* data distillation, animated */
  (function(){
    const root=$('#b8distill'),W=720,H=250;const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const rnd=lcg(8),D=[];for(let k=0;k<240;k++)D.push([24+rnd()*266,52+rnd()*170]);
    const steps=[3,4.5,3,3,3];
    const msgs=['The lake holds a large amount of raw data, with more detail and a longer history than the warehouse.','<b>Read.</b> A Spark job reads the raw data it needs; the data stay in the lake.','<b>Compute.</b> The result is small: a few rows, for example one indicator per customer segment.',
      '<b>Distil.</b> Being small, the result is loaded into the data warehouse.','<b>Use.</b> In the warehouse it joins the BI workflow: reports query it with low latency.'];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b8d1',GRAY)+'</defs>';
      s+=rect(14,26,286,206,'#0b0b0b','#666')+tx(157,44,'data lake: raw data',{s:13.5,f:'#fff'});
      D.forEach(([x,y])=>s+='<circle cx="'+x+'" cy="'+y+'" r="2.2" fill="#8a8a8a"/>');
      s+=rect(330,104,100,52,i===1||i===2?'#1e1e1e':'#141414',i===1||i===2?'#fff':'#777')+tx(380,126,'Spark job',{s:13.5,f:'#fff'})+tx(380,144,'in memory',{s:12.5,f:GRAY});
      s+=rect(466,40,140,180,'#0b0b0b',i>=3?'#fff':'#666')+tx(536,58,'data warehouse',{s:13.5,f:'#fff'})+tx(536,76,'hot data',{s:12.5,f:HOT});
      s+=rect(624,90,90,90,'#0b0b0b',i===4?'#fff':'#444')+tx(669,106,'BI report',{s:13,f:i===4?'#fff':'#666'});
      if(i===1){D.forEach(([x,y],k)=>{if(k%4)return;const st=(k/4)/60*.6,ek=clamp((u-st)/.4,0,1);if(ek>0&&ek<1){const xx=lerp(x,330,ease(ek)),yy=lerp(y,130,ease(ek));s+='<circle cx="'+xx+'" cy="'+yy+'" r="2.6" fill="#fff" opacity="'+(1-ek*.5)+'"/>'}})}
      const tbl=(x,y,a)=>{let r='<g opacity="'+a+'">'+rect(x,y,104,62,'#1e1e1e','#ddd');[0,1,2,3].forEach(j=>{r+=rect(x+8,y+8+j*13,24,8,'#777')+rect(x+38,y+8+j*13,[46,30,52,22][j],8,BLUE)});return r+'</g>'};
      if(i===2)s+=tbl(lerp(330,330,e),lerp(166,166,e),e)+tx(382,244,'a few rows',{s:12.5,f:GRAY});
      if(i===3)s+=tbl(lerp(330,484,e),lerp(166,100,e),1);
      if(i===4){s+=tbl(484,100,1);[46,30,52,22].forEach((v,j)=>s+=rect(640+j*18,170-v*e*1.2,12,v*e*1.2,BLUE))}
      if(i>=1)s+=line(302,130,326,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i>=3)s+=line(432,130,462,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i===4)s+=line(608,130,620,130,GRAY,1.5,' marker-end="url(#b8d1)"');
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Data distillation animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 5. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* input filter vs quality label */
  (function(){
    const duo=el('div','duo');$('#b8qual').append(duo);const Q=['high','medium','low','high','medium','high'];
    let a='';Q.forEach((q,k)=>a+=qChip8(10,14+k*34,q,{bad:q!=='high'}));
    a+=line(118,6,118,214,'#ddd',3)+tx(118,232,'filter: high only',{s:12.5,f:GRAY});
    a+=rect(150,6,180,208,'#0b0b0b','#666')+tx(240,26,'data lake',{s:13.5,f:'#fff'});
    Q.forEach((q,k)=>{const y=14+k*34;if(q==='high'){a+=line(82,y+11,110,y+11,GRN,1.4)+qChip8(205,36+Q.slice(0,k).filter(x=>x==='high').length*34,q,{good:1})}else a+=tx(98,y+16,'✗',{s:14,f:RED})});
    cell(duo,'Quality filter on input',a,340,240,'Input filter','<span class="bad">Medium records are lost</span>, even for users who could use them.');
    let b=rect(10,6,190,214,'#0b0b0b','#666')+tx(105,26,'data lake (all records)',{s:13,f:'#fff'});
    const pos=k=>[20+(k%2)*92,40+Math.floor(k/2)*40];
    b+=box(232,30,104,48,['Reporting','high only'],{fs:13.5})+box(232,140,104,48,['Data scientist','high, medium'],{fs:13.5});
    Q.forEach((q,k)=>{const [x,y]=pos(k);if(q==='high')b+=line(x+70,y+11,232,54,GRN,1,' opacity=".55"');if(q!=='low')b+=line(x+70,y+11,232,164,GRN,1,' opacity=".55"')});
    Q.forEach((q,k)=>{const [x,y]=pos(k);b+=qChip8(x,y,q)});
    cell(duo,'Quality label, user decides',b,340,240,'Quality label','Every record enters; <span class="ok">each user picks its level</span>.');
  })();
  /* ETL copy vs virtualization */
  (function(){
    const duo=el('div','duo');$('#b8virt').append(duo);const src=['ERP','CRM','web logs'];
    let a='<defs>'+arrowDef('b8v1',GRAY)+'</defs>';a+=box(120,6,100,34,['user query']);
    a+=line(170,42,170,62,GRAY,1.5,' marker-end="url(#b8v1)"')+cyl(110,66,120,46,'central store');
    src.forEach((n,k)=>{const x=20+k*110;a+=cyl(x,186,90,42,n)+line(x+45,184,170+(k-1)*30,118,GRAY,1.4,' marker-end="url(#b8v1)"')});
    a+=tx(260,154,'copy (ETL)',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Copy the data (ETL)',a,340,236,'ETL copy','A second copy of the data to load and keep in sync.');
    let b='<defs>'+arrowDef('b8v2',ORG)+'</defs>';b+=box(120,6,100,34,['user query']);
    b+=line(170,42,170,62,ORG,1.5,' marker-end="url(#b8v2)"')+rect(40,66,260,46,'#0d0d0d','#ddd',' stroke-dasharray="5 4"')+tx(170,86,'virtualization layer',{s:13.5,f:'#fff'})+tx(170,104,'no data stored',{s:12.5,f:GRAY});
    src.forEach((n,k)=>{const x=20+k*110;b+=cyl(x,186,90,42,n)+line(170+(k-1)*60,114,x+45,182,ORG,1.4,' marker-end="url(#b8v2)"')});
    b+=tx(330,154,'network',{s:12.5,f:ORG,a:'end'});
    cell(duo,'Query in place (virtualization)',b,340,236,'Data virtualization','No copies, but every query loads the sources and the network.');
  })();
  wideFigs(8);
};
QZ['8a']=()=>[{q:'A company collects raw sensor logs whose use is not decided yet: next year a model may need some fields, in a format nobody can define today. Where should they go, and why?',o:['Into the data lake, because with schema on read the structure can be defined when the data are needed','Into the DWH, because schema on write guarantees quality','Nowhere: data without a schema cannot be stored','Into the DWH, because it is the cheapest storage'],a:0,
  e:'The lake stores data in their native format and defines the schema at reading time; the DWH needs the tables defined before loading and is the more expensive storage.',h:'Ask which of the two needs to know the structure before writing.'}];
QZ['8b']=()=>[{q:'A bank moves ten years of rarely queried transaction history out of its data warehouse into the data lake, where it stays available. Which adoption step is this?',o:['Staging area and raw-data zone','Data-science environment','Offloading system for data warehouses','Main component of the information system'],a:2,
  e:'Using the lake\'s low storage cost to keep the warehouse\'s cold, rarely used data is the third step, offloading.',h:'Ask where the data come from and how often they are used.'}];
QZ['8c']=()=>[{q:'A daily dashboard shows last month\'s sales by store; the 2012 web logs are read once a year for a study. In the lecture\'s architecture,',o:['both belong in the data warehouse','the sales stay in the data lake, the logs go to the warehouse','the sales, hot data, belong in the warehouse; the logs, cold data, in the lake','both belong only in the source systems'],a:2,
  e:'Recent, often accessed data are hot and served by the warehouse with low latency; old, rarely accessed data are cold and stay in the lake, available with a longer latency.',h:'Recall the definitions of hot and cold data.'}];
QZ['8d']=()=>[{q:'Customer records arrive with addresses of medium quality: fine for a churn model, not for invoices. What does the lecture recommend?',o:['Reject them at the entrance of the lake','Correct them by hand before loading','Load them with a quality label, and let each user decide whether to use them','Store them only in the warehouse'],a:2,
  e:'Quality rules belong on the output: a quality label lets the invoicing report exclude them while the data scientist can still use them.',h:'Where, according to the lecture, should quality rules be applied?'}];
QZ['8']=()=>[
  {q:'A load of 1,000 records contains 30 with a text where an integer is expected. How many rows end up in a warehouse table with schema on write and a strict load, and how many lines in the lake?',o:['970 and 970','1,000 and 970','970 and 1,000','1,000 and 1,000'],a:2,
   e:'The warehouse table rejects the 30 records that do not fit its schema: 1,000 − 30 = 970. The lake writes all 1,000 lines as they are and leaves the schema to the readers.',h:'One system checks the schema when writing, the other when reading.'},
  {q:'A retailer runs a churn model in Spark on two years of raw clickstream in the lake and obtains one churn score per customer, which marketing dashboards must query interactively. What does the lecture\'s architecture suggest?',o:['Move the raw clickstream into the warehouse','Keep the raw clickstream in the lake and load the scores into the warehouse','Let the dashboards query the raw clickstream in the lake','Delete the clickstream once the scores are computed'],a:1,
   e:'This is data distillation: the heavy analysis runs on the lake, and the small result goes to the warehouse, which serves low-latency queries to the BI tools.',h:'Which of the two systems is built for interactive queries, and which data are small?'},
  {q:'Which of these is not one of the lecture\'s critical success factors for a data lake?',o:['Data governance','A filter that rejects medium-quality data at the entrance','Metadata management','Training data scientists and end users'],a:1,
   e:'The lecture explicitly advises against input filters: they would keep out data useful for some applications. Quality labels on the output are the recommended way.',h:'Reread the paragraph on the data quality process.'},
  {q:'A company puts a virtualization layer over its ERP. At month end, complex reports through the layer slow down the ERP itself. Which drawback is this?',o:['High initial investment','Data virtualization relies on the storage, memory and CPUs of the sources, and can be slow for complex tasks','It cannot handle unstructured data','It duplicates the data'],a:1,
   e:'The layer stores nothing, so the sources do the work of every query; heavy queries load the ERP and can be slow.',h:'In the second panel of the last figure, who does the work?'},
  {q:'In which order does the lecture place the four steps of data lake adoption?',o:['Staging, data science, offloading, main component','Data science, staging, main component, offloading','Staging, offloading, data science, main component','Offloading, staging, data science, main component'],a:0,
   e:'From the base of the pyramid: staging area and raw-data zone, data-science environment, offloading system for warehouses, main component of the information system.',h:'Start from the cheapest, least integrated use.'},
  {q:'In the data lake era, what does the data warehouse contain according to the lecture?',o:['All the raw data, structured and unstructured','Only the cold data','The hot data from ETL processes and the distilled results of analyses run on the lake','Nothing: it is replaced by the lake'],a:2,
   e:'The warehouse still exists and holds hot data (from ETL, directly from the sources or from the lake) and distilled data from the lake\'s analyses, keeping low-latency queries and existing reports.',h:'The lake keeps the raw and the cold data.'}
];
