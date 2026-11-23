/* Lesson 9: predictive and generative AI, data structures, use cases */
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
    a+='<circle cx="196" cy="112" r="8" fill="none" stroke="'+PREDC+'" stroke-width="2.5"/>'+line(203,119,236,146,PREDC,1.2)+tx(238,160,'new customer?',{s:12.5,f:PREDC,a:'start'})+tx(238,176,'predicted: leaves',{s:12.5,f:PREDC,a:'start'});
    a+='<circle cx="200" cy="224" r="5" fill="#fff"/>'+tx(209,228,'left',{s:12.5,f:'#fff',a:'start'})+'<circle cx="250" cy="224" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>'+tx(259,228,'stayed',{s:12.5,f:'#ccc',a:'start'});
    cell(duo,'Predictive: learn a boundary',ax(a),340,236,'Predictive model','Features in, target out: <b>leave or stay</b>.');
    let b='';[[110,150],[220,80]].forEach(([cx,cy])=>{[[62,52,.35],[38,32,.6]].forEach(([rx,ry,o])=>b+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+GENC+'" stroke-opacity="'+o+'" stroke-width="1.5"/>')});
    A.concat(B).forEach(([x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#777"/>');
    const r2=lcg(31);for(let k=0;k<8;k++){const c=k%2?[220,80]:[110,150];b+='<circle cx="'+(c[0]+gauss9(r2)*22)+'" cy="'+(c[1]+gauss9(r2)*18)+'" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'}
    b+='<circle cx="190" cy="224" r="3.5" fill="#777"/>'+tx(198,228,'data',{s:12.5,f:GRAY,a:'start'})+'<circle cx="240" cy="224" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'+tx(249,228,'generated',{s:12.5,f:'#fff',a:'start'});
    cell(duo,'Generative: learn the shape',ax(b),340,236,'Generative model','No target: <b>new observations</b> like the data.');
  })();
  /* McKinsey ranges */
  (function(){
    let s='';const L=20,R=500,X=v=>L+v/30*(R-L);
    [0,5,10,15,20,25,30].forEach(v=>{s+=line(X(v),22,X(v),272,'#222',1)+tx(X(v),290,String(v),{s:13,f:GRAY})});
    const rows=[['Advanced analytics, traditional ML and deep learning',11.0,17.7,PREDC],['New generative AI use cases',2.6,4.4,GENC],['Total use-case driven potential',13.6,22.1,'#9a9a9a'],['Worker productivity enabled by generative AI',6.1,7.9,GENC],['Total AI economic potential',17.1,25.6,'#fff']];
    rows.forEach(([l,lo,hi,c],k)=>{const y=26+k*50;s+=tx(L,y+10,l,{s:13,f:'#ddd',a:'start'})+rect(X(lo),y+16,X(hi)-X(lo),20,c)+tx(X(hi)+8,y+31,lo.toFixed(1)+' to '+hi.toFixed(1),{s:13,f:'#fff',a:'start'})});
    s+=tx(260,308,'trillion $ per year',{s:13,f:GRAY});
    s+=tx(640,22,'share of the total',{s:13,f:GRAY});const top=34,H=238;
    s+=rect(610,top,60,H*.325,GENC)+rect(610,top+H*.325,60,H*.675,PREDC)+tx(604,top+H*.16+5,'30 to 35%',{s:13,f:'#fff',a:'end'})+tx(604,top+H*.325+H*.34+5,'65 to 70%',{s:13,f:'#fff',a:'end'});
    s+=tx(640,top+H+20,'generative',{s:12.5,f:GENC})+tx(640,top+H+36,'predictive',{s:12.5,f:PREDC});
    svgBox($('#b9mck'),720,316,s,'Economic potential of AI, McKinsey 2023','46rem');
  })();
  /* State of AI 2026 */
  (function(){
    let s='';const rows=[[89,'use AI in at least one business function'],[44,'are scaling AI across the enterprise'],[37,'report a positive EBIT impact from AI'],[6,'are AI high performers (at least 5% of EBIT from AI)']];
    rows.forEach(([v,l],k)=>{const y=14+k*52;s+=tx(20,y+12,l,{s:13,f:'#ddd',a:'start'})+rect(20,y+18,v/100*560,24,k===3?'#fff':'#777')+tx(20+v/100*560+10,y+37,v+'%',{s:17,f:'#fff',w:600,a:'start'})});
    svgBox($('#b9adopt'),720,222,s,'Share of organizations by AI stage','46rem');
  })();
  /* eight phases and five milestones */
  (function(){
    let s='';const ph=[['OLTP, SQL','','static','reports'],['DWH, SQL','','static','reports'],['DWH, BI,','OLAP','dynamic','reports'],['DWH, OLAP,','data mining','predictive','analytics'],['Collaboration,','cloud','advanced','analytics'],['Hadoop,','Big Data','prescriptive','analytics'],['Generative','AI','LLMs,','copilots'],['Agentic','AI','AI that','acts']];
    ph.forEach(([a,b,c,c2],i)=>{const x=6+i*89,w=86;s+='<polygon points="'+[x,8,x+w-10,8,x+w,25,x+w-10,42,x,42,x+(i?10:0),25].join(' ')+'" fill="'+(i>=6?'#2a2a2a':'#1a1a1a')+'" stroke="#9a9a9a"/>'+tx(x+w/2+(i?3:0),30,'Phase '+(i+1),{s:13,f:'#fff',w:600});
      s+=tx(x+w/2,62,a,{s:12.5,f:'#fff'})+(b?tx(x+w/2,78,b,{s:12.5,f:'#fff'}):'')+tx(x+w/2,98,c,{s:12.5,f:GRAY})+tx(x+w/2,113,c2,{s:12.5,f:GRAY})});
    const ms=[['early 1990s',['BI tools'],['focus on tools']],['2005',['business analytic','applications'],['focus on','applications']],['2012',['Big Data'],['focus on data']],['2022',['generative AI','platforms'],['focus on natural','language']],['2025',['AI agents,','agentic workflows'],['focus on','autonomous action']]];
    ms.forEach(([yr,ln,fc],k)=>{const x=8+k*142,y=300-k*36,w=132;s+=rect(x,y,w,40,k>=3?'#2a2a2a':'#1a1a1a','#bbb');
      ln.forEach((l,j)=>s+=tx(x+w/2,y+(ln.length===1?25:17+j*16),l,{s:12.5,f:'#fff'}));
      s+=tx(x+4,y-8,yr,{s:13,f:'#fff',w:600,a:'start'})+line(x+w/2,y+40,x+w/2,352,'#444',1,' stroke-dasharray="3 3"');
      fc.forEach((l,j)=>s+=tx(x+w/2,370+j*16,l,{s:12.5,f:GRAY}))});
    s+=tx(10,140,'Business intelligence → AI',{s:13,f:GRAY,a:'start'});
    svgBox($('#b9evo'),720,394,s,'Eight phases of analysis techniques and tools','46rem');
  })();
  /* elements of a BI system */
  (function(){
    let s='<defs>'+arrowDef('b9b1',GRAY)+'</defs>';const A=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,GRAY,1.4,' marker-end="url(#b9b1)"');
    s+=tx(70,18,'Operational sources',{s:13,f:GRAY});['CRM','ERP','Legacy systems','Files, web, IoT'].forEach((l,k)=>s+=box(10,28+k*48,120,38,[l]));
    s+=box(178,92,96,56,['Staging','area'],{fs:14});[0,1,2,3].forEach(k=>s+=A(132,47+k*48,176,120));s+=tx(156,26,'ETL',{s:12.5,f:GRAY});
    s+=cyl(318,82,110,76,'');s+=tx(373,116,'Enterprise',{s:13.5,f:'#fff'})+tx(373,134,'data warehouse',{s:13.5,f:'#fff'});s+=A(276,120,316,120)+tx(296,110,'ETL',{s:12.5,f:GRAY});
    s+=tx(520,18,'Data marts',{s:13,f:GRAY});['Marketing','Finance','Sales'].forEach((l,k)=>{s+=box(470,40+k*56,100,40,[l]);s+=A(430,120,468,60+k*56)});
    s+=tx(650,18,'Client tools',{s:13,f:GRAY});['OLAP','Reports, dashboards','Data mining, ML','AI copilots'].forEach((l,k)=>{s+=box(590,28+k*48,126,38,[l],{fs:12.5});});
    s+=A(572,120,588,120);
    s+=rect(10,236,704,34,'#141414','#9a9a9a',' stroke-dasharray="5 4"')+tx(362,258,'Governance: master data, data quality, metadata and lineage, security and privacy (GDPR)',{s:13,f:'#ddd'});
    svgBox($('#b9bi'),720,276,s,'Elements of a BI system','46rem');
  })();
  /* Inmon's four properties */
  (function(){
    const duo=el('div','duo');$('#b9inmon').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    let a=ar('b9i1');[['ERP','"M. Rossi"'],['CRM','"Mario Rossi"'],['web','"mrossi"']].forEach(([n,v],k)=>{a+=box(10,8+k*48,130,40,[n,v],{fs:13});a+=line(142,28+k*48,196,80,GRAY,1.4,' marker-end="url(#b9i1)"')});
    a+=box(200,52,130,56,['customer 1042','Mario Rossi'],{fs:13.5,st:'#fff',sw:2});
    cell(duo,'Integrated',a,340,156,'Integrated','Different sources, one homogeneous container.');
    let b=ar('b9i2');['sales','loans','outbound traffic'].forEach((n,k)=>b+=box(10,8+k*48,120,38,[n],{fs:13,f:'#141414',st:'#555'}));['customers','products','channels'].forEach((n,k)=>b+=box(210,8+k*48,120,38,[n],{fs:13.5,st:'#fff'}));
    b+=tx(70,160,'applications',{s:12.5,f:GRAY})+tx(270,160,'subjects',{s:12.5,f:'#fff'})+line(134,76,204,76,GRAY,1.6,' marker-end="url(#b9i2)"');
    cell(duo,'Subject-oriented',b,340,166,'Subject-oriented','Organized by subject, not by application.');
    let c='';['Jan','Feb','Mar','Apr','May'].forEach((m,k)=>{c+=rect(40,128-k*26,150,22,k===4?'#3a3a3a':'#1e1e1e','#9a9a9a')+tx(115,143-k*26,m+' load',{s:12.5,f:'#fff'})});
    c+=box(220,50,110,56,['users','read only'],{fs:13.5})+tx(275,124,'no updates,',{s:12.5,f:GRAY})+tx(275,140,'no deletes',{s:12.5,f:GRAY});
    cell(duo,'Non-volatile',c,340,156,'Non-volatile','Regular loads make it grow; users cannot change it.');
    let d=line(20,120,320,120,'#777',1.5);[2022,2023,2024,2025,2026].forEach((y,k)=>{const x=40+k*65;d+=rect(x-24,40,48,60,'#1a1a1a','#9a9a9a');[0,1,2].forEach(j=>d+=rect(x-16,50+j*14,32,7,'#555'));d+=line(x,100,x,120,'#777',1)+tx(x,140,String(y),{s:12.5,f:GRAY})});
    cell(duo,'Time-variant',d,340,156,'Time-variant','Periodic snapshots covering several years.');
  })();
  /* IDC Global DataSphere */
  (function(){
    let s='';const U=[['ZB','10²¹ bytes','1 billion TB'],['EB','10¹⁸','monthly mobile traffic of a big country'],['PB','10¹⁵','a large company DWH'],['TB','10¹²','a laptop disk'],['GB','10⁹','a film in HD']];
    U.forEach(([u,p,e],k)=>{const y=14+k*52;s+=rect(10,y,40,40,k?'#1a1a1a':'#2c2c2c','#9a9a9a')+tx(30,y+25,u,{s:14,f:'#fff',w:600})+tx(58,y+16,p,{s:12.5,f:'#fff',a:'start'});
      const words=e.split(' ');let l1=e,l2='';if(e.length>24){const m=Math.ceil(words.length/2);l1=words.slice(0,m).join(' ');l2=words.slice(m).join(' ')}s+=tx(58,y+31,l1,{s:12.5,f:GRAY,a:'start'})+(l2?tx(58,y+45,l2,{s:12.5,f:GRAY,a:'start'}):'')});
    s+=tx(130,284,'× 1,000 at each step',{s:12.5,f:GRAY});
    const D=[['2010',2],['2012',7],['2014',13],['2016',18],['2018',33],['2020',64],['2021',79],['2022',97],['2023',120],['2024',149],['2025',181],['2028',394]];
    const x0=262,bw=30,gap=7.5,Y=v=>262-v/400*226;
    [0,100,200,300,400].forEach(v=>{s+=line(x0-6,Y(v),712,Y(v),'#222',1)+tx(x0-10,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'})});
    D.forEach(([y,v],k)=>{const x=x0+k*(bw+gap),f=k===11;s+=rect(x,Y(v),bw,262-Y(v),f?'none':(k>=9?'#9a9a9a':'#ddd'),f?'#ddd':'none',f?' stroke-dasharray="4 3" stroke-width="1.5"':'')+tx(x+bw/2,Y(v)-6,String(v),{s:12.5,f:'#fff'})+tx(x+bw/2,280,y==='2028'?'2028F':"'"+y.slice(2),{s:12.5,f:GRAY})});
    s+=tx(486,298,'zettabytes per year; 2024 and 2025 estimates, 2028 forecast',{s:12.5,f:GRAY});
    svgBox($('#b9idc'),720,306,s,'Global DataSphere in zettabytes, IDC','46rem');
  })();
  /* volume and complexity */
  (function(){
    let s='';const lv={MB:290,GB:215,TB:135,PB:55};
    Object.keys(lv).forEach(k=>{s+=tx(52,lv[k]+5,k,{s:14,f:'#fff',w:600,a:'end'})+line(62,lv[k],700,lv[k],'#1c1c1c',1)});
    s+=line(64,324,700,324,'#777',1.4)+line(64,324,64,20,'#777',1.4)+tx(30,22,'volume',{s:12.5,f:GRAY,a:'start'});
    [['low complexity',190],['medium complexity',400],['high complexity',610]].forEach(([l,x])=>s+=tx(x,344,l,{s:13,f:GRAY}));
    const B=[['SCM','',150,285,30,0],['ERP','orders, sales',192,215,40,0],['CRM','campaigns',262,252,34,0],['Financial','transactions',178,135,38,1],['DCS,','sensors',292,58,34,1],['Web logs','click stream',392,135,40,1],['Scientific','data',402,55,36,1],['Documents','Word, Excel, PDF',512,212,48,2],['Audio,','video, photo',604,140,40,2],['Social','networks, UGC',614,54,46,2]];
    B.forEach(([a,b,x,y,r,t])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.6"/>';const c=t?'#fff':'#000';
      s+=tx(x,y+(b?-1:5),a,{s:12.5,f:c,w:600})+(b?tx(x,y+14,b,{s:11,f:t?'#ddd':'#333'}):'')});
    const lg=[['structured',0],['semi-structured',1],['unstructured',2]];lg.forEach(([l,t],k)=>{const x=200+k*140;s+='<circle cx="'+x+'" cy="'+366+'" r="7" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.4"/>'+tx(x+12,370,l,{s:12.5,f:'#ddd',a:'start'})});
    svgBox($('#b9vc'),720,378,s,'Data sources by volume and complexity','46rem');
  })();
  /* IoT */
  (function(){
    const duo=el('div','duo');$('#b9iot').append(duo);
    let a='';const Y=v=>200-v/40*170;[0,10,20,30,40].forEach(v=>a+=line(60,Y(v),320,Y(v),'#222',1)+tx(52,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    a+=rect(90,Y(21.1),70,200-Y(21.1),'#ddd')+tx(125,Y(21.1)-8,'21.1',{s:14,f:'#fff',w:600})+tx(125,220,'2025',{s:13,f:GRAY});
    a+=rect(220,Y(39),70,200-Y(39),'none','#ddd',' stroke-dasharray="4 3" stroke-width="1.5"')+tx(255,Y(39)-8,'39',{s:14,f:'#fff',w:600})+tx(255,220,'2030 (expected)',{s:13,f:GRAY});
    a+=tx(160,Y(31),'≈ 13% a year',{s:12.5,f:GRAY});
    cell(duo,'Connected devices, billions',a,340,230,'IoT devices','Almost twice as many in five years.');
    let b='';[['Wi-Fi',32],['Bluetooth',24],['Cellular',22],['Other',22]].forEach(([l,v],k)=>{const y=14+k*46;b+=tx(100,y+20,l,{s:13.5,f:k<3?'#fff':GRAY,a:'end'})+rect(110,y+4,v*6,24,k<3?'#9a9a9a':'#333')+tx(116+v*6,y+21,v+'%',{s:13.5,f:'#fff',a:'start'})});
    b+=tx(170,210,'Wi-Fi, Bluetooth and cellular: about 78%',{s:12.5,f:GRAY});
    cell(duo,'Share of IoT connections',b,340,230,'IoT connectivity','Three technologies carry most connections.');
  })();
  /* analysis loop */
  (function(){
    let s='<defs>'+arrowDef('b9l1',GRAY)+arrowDef('b9l2','#ddd')+'</defs>';const st=[['Generate data','people, machines,','transactions, IoT'],['Ingestion','batch, streaming:','ETL, ELT, APIs, Kafka'],['Store','DWH, data lake,','lakehouse'],['Analyze','BI, statistics, ML:','KNIME, Python, R, Spark'],['Get insights','decisions, actions,','AI agents']];
    s+='<path d="M650 70 C 650 30, 640 26, 600 26 L 120 26 C 80 26, 73 34, 73 66" fill="none" stroke="#ddd" stroke-width="1.6" marker-end="url(#b9l2)"/>';
    s+=tx(360,50,'insights change decisions, decisions generate new data',{s:13,f:'#fff'});
    st.forEach(([a,b,c],k)=>{const x=6+k*143;s+=rect(x,70,134,40,'#1a1a1a','#bbb')+tx(x+67,95,a,{s:14,f:'#fff',w:600})+tx(x+67,130,b,{s:12.5,f:GRAY})+tx(x+67,146,c,{s:12.5,f:GRAY});if(k<4)s+=line(x+135,90,x+141,90,GRAY,1.5,' marker-end="url(#b9l1)"')});
    s+=tx(360,178,'so the models must be monitored and retrained over time',{s:12.5,f:GRAY});
    svgBox($('#b9loop'),720,188,s,'The analysis process as a loop','46rem');
  })();
  /* Zalando forecast error */
  (function(){
    let s='';const L=170,R=640,X=v=>L+v/0.7*(R-L);[0,0.2,0.4,0.6].forEach(v=>s+=line(X(v),10,X(v),140,'#222',1)+tx(X(v),158,fe(v,1),{s:12.5,f:GRAY}));
    [['naive forecast',0.603,'#555'],['LightGBM',0.489,'#9a9a9a'],['transformer',0.449,'#fff']].forEach(([l,v,c],k)=>{const y=16+k*42;s+=tx(L-10,y+19,l,{s:13.5,f:'#fff',a:'end'})+rect(X(0),y,X(v)-X(0),28,c)+tx(X(v)+8,y+19,fe(v,3),{s:13.5,f:'#fff',a:'start'})});
    s+=tx((L+R)/2,176,'demand forecast error, 2022 data (lower is better)',{s:12.5,f:GRAY});
    svgBox($('#b9zal'),720,184,s,'Zalando demand forecast error by model','46rem');
  })();
  wideFigs(9);
};
QZ['9a']=()=>[{q:'Which of these is a predictive task in the lecture\'s sense?',o:['Writing a personalised e-mail for each customer segment','Estimating each customer\'s probability of leaving next month','Generating new product images for a campaign','Drafting replies to customer reviews'],a:1,
  e:'A predictive model learns a function from features to a target, here "will leave" with a probability. The other three create new content: generative AI.',h:'Look for a target variable to estimate.'}];
QZ['9b']=()=>[{q:'Using McKinsey\'s upper bounds, what share of the total AI economic potential (25.6 trillion dollars) comes from the productivity enabled by generative AI (7.9)?',o:['17%','69%','31%','45%'],a:2,
  e:'7.9 / 25.6 ≈ 0.31, so about 31%, inside the 30 to 35% range of the chart; the remaining 69% is predictive.',h:'Divide the generative part by the total.'}];
QZ['9c']=()=>[{q:'A data warehouse keeps monthly snapshots of customer balances for the last ten years. Which of Inmon\'s properties does this illustrate?',o:['Integrated','Subject-oriented','Non-volatile','Time-variant'],a:3,
  e:'Time-variant means the data are periodic snapshots of the business covering several years of history.',h:'Match the description against the four definitions one by one.'}];
QZ['9d']=()=>[{q:'From 2 ZB in 2010 to about 181 ZB in 2025: roughly how many times did the yearly volume grow, and how many terabytes are in one zettabyte?',o:['About 90 times; one billion TB','About 9 times; one million TB','About 180 times; one billion TB','About 90 times; one thousand TB'],a:0,
  e:'181 / 2 ≈ 90. A zettabyte is 10²¹ bytes and a terabyte 10¹², so 1 ZB = 10⁹ TB, one billion terabytes.',h:'Count the steps of a thousand between TB and ZB on the ladder.'}];
QZ['9e']=()=>[{q:'Zalando\'s transformer has an error of 0.449, against 0.489 for LightGBM and 0.603 for a naive forecast. By how much, in relative terms, does it reduce the error of LightGBM and of the naive forecast?',o:['About 4% and 15%','About 8% and 26%','About 40% and 15%','About 9% and 34%'],a:1,
  e:'(0.489 − 0.449) / 0.489 ≈ 0.082, about 8%; (0.603 − 0.449) / 0.603 ≈ 0.255, about 26%. A gradient-boosted tree baseline already captures most of the gain over the naive forecast.',h:'Relative reduction = (old − new) / old.'}];
QZ['9']=()=>[
  {q:'IoT devices were 21.1 billion in 2025. Growing at about 13% a year, roughly how many will there be in 2030?',o:['About 39 billion','About 35 billion','About 24 billion','About 60 billion'],a:0,
   e:'Growth compounds: 21.1 × 1.13⁵ ≈ 21.1 × 1.84 ≈ 38.9 billion, the 39 billion of the forecast. Adding 13% of 21.1 five times (35 billion) forgets the compounding.',h:'Apply 13% to a base that grows every year.'},
  {q:'Trenitalia expects an 8% cut of maintenance costs of about €1.3 billion a year, against an investment of about €50 million. What is the yearly saving, and roughly how long does it take to recover the investment?',o:['€10.4 million; about 5 years','€104 million; about 6 months','€104 million; about 2 years','€1.04 billion; about 2 weeks'],a:1,
   e:'0.08 × 1,300 = €104 million a year, the "€100+ million" of the lecture. €50 million / €104 million ≈ 0.48 years, about six months.',h:'First 8% of 1.3 billion, then divide the investment by the yearly saving.'},
  {q:'In the State of AI survey, out of 1,000 organizations, how many are AI high performers, and what share of the organizations that use AI is that?',o:['6, about 0.7%','60, about 6.7%','60, about 13.6%','440, about 49%'],a:1,
   e:'6% of 1,000 is 60; the users are 89%, 890 organizations, and 60 / 890 ≈ 6.7%.',h:'High performers are 6% of all organizations, not of the users.'},
  {q:'An order system must show each item\'s stock level, updated at every sale; an analyst needs ten years of monthly sales by region. Which systems fit?',o:['The data warehouse for both','The operational database for both','The operational database for the stock level, the data warehouse for the sales history','The data warehouse for the stock level, the operational database for the history'],a:2,
   e:'Operational databases hold complete, current data updated in real time for daily operations; the warehouse holds aggregated history as periodic snapshots for analysis.',h:'Recall the "Data" and "Use" rows of the comparison table.'},
  {q:'A company says it has no Big Data because its databases total only 2 TB, although it receives a continuous stream of sensor readings and thousands of free-text reviews. What would the lecture answer?',o:['It is right: below a petabyte there is no Big Data','Big Data are not only volume: variety and velocity often matter more','Only web data count as Big Data','It should first collect all the data in the world'],a:1,
   e:'The lecture\'s "let\'s clarify" points out that variety (unstructured reviews) and velocity (streaming sensors) often matter more than volume, and that the relevant data are what matters.',h:'Recall the lecture\'s "let\'s clarify" slide.'},
  {q:'A bank wants to flag fraudulent card transactions, which are about 0.1% of all transactions. Which framing matches the lecture\'s table?',o:['Regression on the amount of each transaction','Clustering of customers into segments','Classification on highly imbalanced data, with anomaly detection and techniques such as SMOTE','Time-series forecasting of next week\'s transactions'],a:2,
   e:'Fraud detection is classification with a very rare positive class: models such as gradient boosted trees, with SMOTE to create synthetic frauds, and anomaly detection.',h:'Look at the last table of the lesson.'}
];
