/* Lesson 5: Hadoop, HDFS and MapReduce */
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
    s+=rect(430,8,270,98,'#0d0d0d','#9a9a9a')+tx(565,28,'name node (metadata)',{s:14,f:'#fff',w:500});
    Object.keys(PLACE).forEach((b,i)=>{s+=tx(448,50+i*15,b+' → nodes '+PLACE[b].join(', '),{s:12.5,f:GRAY,a:'start'})});
    for(let r=0;r<3;r++){const rx=12+r*236;s+=rect(rx,130,224,196,'none','#444')+tx(rx+112,320,'rack '+(r+1),{s:13,f:GRAY});
      for(let k=0;k<3;k++){const n=r*3+k+1,nx=rx+8+k*72;s+=rect(nx,140,66,160,'#111','#666')+tx(nx+33,160,'node '+n,{s:13,f:'#fff'});
        onNode(n).forEach((b,j)=>s+=chip(nx+10,172+j*30,b))}}
    svgBox($('#b5hdfs'),720,332,s,'HDFS blocks and replicas on three racks','46rem');
  })();
  /* rack failure */
  (function(){
    const duo=el('div','duo');$('#b5fail').append(legend([[GRN,'block still readable','box'],[RED,'failed rack','box']]),duo);
    [0,2].forEach(dead=>{let s='';
      for(let r=0;r<3;r++){const rx=6+r*112,isDead=r+1===dead;s+=rect(rx,6,104,214,isDead?'rgba(252,98,85,.12)':'none',isDead?RED:'#444',isDead?' stroke-width="2"':'')+tx(rx+52,24,'rack '+(r+1)+(isDead?' (down)':''),{s:13,f:isDead?RED:GRAY});
        for(let k=0;k<3;k++){const n=r*3+k+1,ny=34+k*61;s+=rect(rx+6,ny,92,55,isDead?'#1a0d0d':'#111',isDead?'#5a2a2a':'#555')+tx(rx+52,ny+16,'node '+n,{s:12.5,f:isDead?'#7a4a4a':'#ccc'});
          {const two=onNode(n).length===2;onNode(n).forEach((b,j)=>s+=chip(two?rx+9+j*46:rx+29,ny+26,b,{dead:isDead,w:two?42:46}))}}}
      ['B1','B2','B3','B4'].forEach((b,i)=>{const alive=PLACE[b].some(n=>Math.ceil(n/3)!==dead);s+=tx(40+i*80,246,b+(alive?' ✓':' ✗'),{s:14,f:alive?GRN:RED,w:600})});
      cell(duo,dead?'Rack 2 fails':'All racks working',s,342,258,'Cluster state',dead?'Every block keeps at least one copy outside rack 2: <span class="ok">no data lost</span>.':'Each block has three copies on two racks.')});
  })();
  /* replication versus erasure coding */
  (function(){
    let s='';const L=180,R=600,X=v=>L+v/3*(R-L);
    [0,1,2,3].forEach(v=>{s+=line(X(v),16,X(v),118,'#222',1)+tx(X(v),136,v+' GB',{s:13,f:GRAY})});
    [['Replication factor 3',2,'3 GB stored'],['Erasure coding',0.5,'1.5 GB stored']].forEach(([l,o,t],i)=>{const y=26+i*48;
      s+=tx(L-12,y+21,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,X(1)-X(0),32,'#e6e6e6')+tx((X(0)+X(1))/2,y+21,'file',{s:13,f:'#000'})+rect(X(1),y,X(1+o)-X(1),32,'#6a6a6a')+tx((X(1)+X(1+o))/2,y+21,'+'+(o*100)+'%',{s:13,f:'#fff'})+tx(X(1+o)+8,y+21,t,{s:13.5,a:'start',f:'#fff'})});
    svgBox($('#b5ec'),720,146,s,'Storage of a 1 GB file with replication and erasure coding','46rem');
  })();
  /* MapReduce on A C B C A, animated */
  (function(){
    const root=$('#b5mr'),W=720,H=330;root.append(legend([[YEL,'key'],[BLUE,'value'],[ORG,'shuffle: pairs moving to their reducer']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const inp=['A','C','B','C','A'],keys=['A','B','C'],gy={A:70,B:165,C:260};
    const kv=(k,v,f)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
    const steps=[3,4,6,4,3],msgs=['The input "A C B C A" is split among five map tasks, each on the node that holds its part.','<b>Map.</b> Each task emits one pair: the letter as <span style="color:var(--yellow)">key</span>, 1 as <span style="color:var(--blue)">value</span>.',
      '<b>Sort, shuffle and group.</b> The system moves every pair to the reducer of its key and puts the values of the same key together: (A, {1, 1}), (B, {1}), (C, {1, 1}).','<b>Reduce.</b> Each reducer adds up the values of its key.','<b>Output.</b> (A, 2), (B, 1), (C, 2) are written to a file in HDFS.'];
    const iy=i=>45+i*58;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='';
      s+=tx(40,22,'input',{s:13,f:GRAY})+tx(170,22,'map',{s:13,f:GRAY})+tx(470,22,'sort and group by key',{s:13,f:GRAY})+tx(600,22,'reduce',{s:13,f:GRAY})+tx(686,22,'output',{s:13,f:GRAY});
      inp.forEach((c,k)=>{s+=tx(40,iy(k)+20,c,{s:18,f:'#fff',w:600});s+=rect(130,iy(k),80,32,'#111',i>=1?'#9a9a9a':'#444')+tx(170,iy(k)+21,'map',{s:13,f:i>=1?'#fff':'#666'})});
      keys.forEach(k=>{s+=rect(415,gy[k]-28,120,56,'#0d0d0d',i>=2?'#666':'#2a2a2a');s+=rect(568,gy[k]-18,64,36,'#111',i>=3?'#9a9a9a':'#333')+tx(600,gy[k]+5,'reduce',{s:12.5,f:i>=3?'#fff':'#555'})});
      inp.forEach((c,k)=>{const slot=inp.slice(0,k).filter(x=>x===c).length,many=inp.filter(x=>x===c).length>1,tx0=232,ty0=iy(k)+21,tx1=450,ty1=gy[c]+(many?(slot?16:-4):5);
        if(i===1){s+='<text x="'+tx0+'" y="'+ty0+'" font-size="14" opacity="'+e+'">'+kv(c,1)+'</text>'}
        if(i===2&&u<.97){const st=k*.15,ek=ease(clamp((u-st)/.3,0,1)),x=lerp(tx0,tx1,ek),y=lerp(ty0,ty1,ek);if(ek>0)s=line(212,ty0-5,x,y-5,ORG,1.5,' opacity=".8"')+s;s+='<text x="'+x+'" y="'+y+'" font-size="14" style="paint-order:stroke;stroke:#000;stroke-width:5px">'+kv(c,1)+'</text>'}});
      if(i>=3||(i===2&&u>=.97)){keys.forEach(k=>{const n=inp.filter(x=>x===k).length;s+='<text x="475" y="'+(gy[k]+5)+'" font-size="14" text-anchor="middle">'+kv(k,'{'+Array(n).fill(1).join(', ')+'}')+'</text>'})}
      if(i>=3){keys.forEach(k=>{const n=inp.filter(x=>x===k).length,a=i===3?e:1;s+='<text x="686" y="'+(gy[k]+5)+'" font-size="15" text-anchor="middle" opacity="'+a+'">'+kv(k,n)+'</text>'+line(634,gy[k],652,gy[k],'#777',1.5,' opacity="'+a+'"')})}
      if(i===4)s+=rect(650,40,72,250,'none','#9a9a9a',' stroke-dasharray="4 4"')+tx(686,312,'HDFS file',{s:12.5,f:GRAY});
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="MapReduce animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 5. '+msgs[i]}
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
    const C=(a,b)=>[{t:'key',w:a,c:YEL},{t:'value',w:b,c:BLUE,a:'e'}];
    let s='';const t1=sTab(10,30,C(110,60),m),t2=sTab(262,30,C(100,70),g),t3=sTab(514,30,C(110,60),r);
    s+=t1.s+t2.s+t3.s+tx(95,18,'Mapper output',{s:14,f:'#fff',w:500})+tx(347,18,'Sort and aggregate',{s:14,f:'#fff',w:500})+tx(599,18,'Reducer output',{s:14,f:'#fff',w:500});
    s+=tx(232,150,'→',{s:22,f:GRAY})+tx(486,150,'→',{s:22,f:GRAY});
    svgBox($('#b5wc'),720,30+t2.h+10,s,'Word count tables','46rem');
    $('#b5wc').append(el('div','cellnote',words.length+' words in the sentence, '+ks.length+' distinct keys: the reducer writes '+ks.length+' pairs.'));
  })();
  /* latency scale */
  (function(){
    let s='';const L=40,R=690,lo=Math.log10(0.1),hi=Math.log10(36000),X=v=>L+(Math.log10(v)-lo)/(hi-lo)*(R-L);
    s+=line(L,80,R,80,'#777',1.5);
    [[0.1,'0.1 s'],[1,'1 s'],[10,'10 s'],[60,'1 min'],[600,'10 min'],[3600,'1 h'],[36000,'10 h']].forEach(([v,l])=>{s+=line(X(v),74,X(v),86,'#777',1.5)+tx(X(v),106,l,{s:13,f:GRAY})});
    s+=rect(X(0.1),38,X(5)-X(0.1),26,'rgba(88,196,221,.35)',BLUE)+tx((X(0.1)+X(5))/2,56,'interactive query',{s:13,f:'#fff'});
    s+=rect(X(60),38,X(36000)-X(60),26,'rgba(255,134,47,.3)',ORG)+tx((X(60)+X(36000))/2,56,'MapReduce batch job: minutes to hours',{s:13,f:'#fff'});
    s+=tx((L+R)/2,132,'response time, logarithmic scale',{s:13,f:GRAY});
    svgBox($('#b5lat'),720,140,s,'Response times of interactive queries and batch jobs','46rem');
  })();
  /* the ecosystem */
  (function(){
    let s='';const B=(x,y,w,h,l,f,st)=>rect(x,y,w,h,f||'#141414',st||'#555')+tx(x+w/2,y+h/2+5,l,{s:13.5,f:'#fff'});
    s+=B(130,292,580,30,'HDFS · distributed file system','#1e1e1e','#9a9a9a')+B(130,256,580,30,'YARN · resource negotiator','#1e1e1e','#9a9a9a');
    s+=B(130,220,190,30,'MapReduce')+B(325,220,190,30,'Tez')+B(520,220,190,30,'Spark');
    s+=tx(10,258,'Core',{s:13,f:GRAY,a:'start'})+tx(10,276,'services',{s:13,f:GRAY,a:'start'});
    s+=rect(130,108,580,104,'none','#444')+tx(140,126,'Data services',{s:13,f:GRAY,a:'start'});
    ['Hive','Pig','HBase','HCatalog'].forEach((l,i)=>s+=B(140+i*142,136,132,30,l));['Storm','Flume','Sqoop'].forEach((l,i)=>s+=B(140+i*142,174,132,30,l));
    s+=rect(10,108,112,104,'none','#444')+tx(66,126,'Operational',{s:13,f:GRAY});['Ambari','Oozie','Zookeeper'].forEach((l,i)=>s+=B(18,134+i*26,96,22,l));
    s+=rect(10,8,700,92,'none','#444')+tx(20,26,'Analytic tools',{s:13,f:GRAY,a:'start'});
    {let x=20;[['Giraph',76],['Mahout',76],['Kylin',70],['Elastic Search',108],['Spark',70],['SAS',70],['R',60],['KNIME',76]].forEach(([l,w])=>{s+=B(x,40,w,30,l);x+=w+8});}
    s+=tx(133,90,'inside Hadoop only',{s:12.5,f:GRAY})+tx(357,90,'distributed tools',{s:12.5,f:GRAY})+tx(578,90,'connect from outside',{s:12.5,f:GRAY});
    svgBox($('#b5eco'),720,330,s,'The Hadoop ecosystem in four layers','46rem');
  })();
  /* legacy versus modern stack */
  (function(){
    const duo=el('div','duo');$('#b5stack').append(duo);
    const chain=(items)=>{let s='<defs>'+arrowDef('b5ar'+items.length,GRAY)+'</defs>';const n=items.length;items.forEach((l,i)=>{const y=200-i*58;s+=box(60,y,220,40,[l],{fs:14});if(i<n-1)s+=line(170,y,170,y-14,GRAY,2,' marker-end="url(#b5ar'+n+')"')});return s};
    cell(duo,'Legacy, installed base',chain(['HDFS','YARN','Hive','Spark']),340,246,'Legacy stack','Still found in many existing installations.');
    cell(duo,'Modern, hybrid direction',chain(['Object storage','Spark / Trino / Flink','Iceberg / Delta']),340,246,'Modern stack','Cloud storage, newer engines, open table formats.');
  })();
  wideFigs(5);
};
QZ['5a']=()=>[{q:'A 1 GB file (1,024 MB) is stored in HDFS with 128 MB blocks and the default replication factor. How many block copies end up on the data nodes?',o:['8','3','24','1,024'],a:2,
  e:'1,024 / 128 = 8 blocks, each stored 3 times: 8 × 3 = 24 block copies.',h:'First count the blocks, then remember how many copies of each block HDFS keeps by default.'}];
QZ['5b']=()=>[{q:'In the figure, which single rack failure would make block B3 unreadable?',o:['Rack 1','Rack 2','Rack 3','None of them'],a:3,
  e:'B3 has copies on node 6 (rack 2) and on nodes 8 and 9 (rack 3). Losing any one rack leaves at least one copy.',h:'Find the racks that hold copies of B3, and ask whether one rack holds all of them.'}];
QZ['5c']=()=>[{q:'A MapReduce word count runs on the text "to be or not to be". How many key/value pairs do the mappers emit, and how many does the reducer write?',o:['4 and 6','6 and 6','6 and 4','4 and 4'],a:2,
  e:'The mappers emit one (word, 1) pair per word: 6. The reducer writes one pair per distinct word: (be, 2), (not, 1), (or, 1), (to, 2), so 4.',h:'Mappers work word by word; the reducer works key by key.'}];
QZ['5d']=()=>[{q:'A marketing analyst wants to query data stored in Hadoop with SQL, from the BI tool she already uses. Which component makes it possible?',o:['Sqoop','Hive, through an ODBC driver','Oozie','Zookeeper'],a:1,
  e:'Hive is the SQL interface to Hadoop, and the ODBC drivers of the distributions let any BI or reporting tool connect to it like an RDBMS.',h:'Recall which data service BI tools can reach through a standard driver.'}];
QZ['5e']=()=>[{q:'Why can Kylin answer some Hive queries much faster than Hive on its own?',o:['It keeps a copy of all the raw data in memory','It saves precomputed aggregations in HBase and answers from them','It replaces HDFS with a faster file system','It runs the queries on the client\'s laptop'],a:1,
  e:'Kylin is an OLAP tool that stores aggregations in HBase\'s columnar storage and uses them to answer Hive queries, instead of recomputing the sums from the detail rows.',h:'Recall what OLAP tools prepare in advance.'}];
QZ['5']=()=>[
  {q:'A company stores 10 TB of data. How much disk space does it need with replication factor 3, and how much with erasure coding at 50% overhead?',o:['30 TB and 15 TB','30 TB and 5 TB','13 TB and 15 TB','20 TB and 10 TB'],a:0,
   e:'Replication keeps three full copies: 3 × 10 = 30 TB. Erasure coding adds 50%: 10 + 5 = 15 TB.',h:'Overhead is the space beyond the data itself: compute stored = data × (1 + overhead).'},
  {q:'MapReduce counts the letters of "B A B C B A". What does the reducer write?',o:['(A, 2), (B, 2), (C, 2)','(A, 2), (B, 3), (C, 1)','(A, {1, 1}), (B, {1, 1, 1}), (C, {1})','(B, 3)'],a:1,
   e:'Grouping gives (A, {1, 1}), (B, {1, 1, 1}), (C, {1}); the reducer sums each list: (A, 2), (B, 3), (C, 1).',h:'One option is the output of the grouping step, not of the reducer.'},
  {q:'With the placement rule of the figure (one copy on one rack, two on another), at least how many racks must fail at the same time to make some block unreadable?',o:['1','3','It can never happen','2'],a:3,
   e:'Each block lives on exactly two racks; if both fail together, its three copies are gone. One rack failure is never enough.',h:'Count on how many different racks the copies of a single block are spread.'},
  {q:'Which of these jobs is MapReduce designed for?',o:['Refreshing a sales dashboard every second','Looking up one customer by id','Aggregating a year of web server logs overnight','Answering analysts\' ad hoc SQL questions in real time'],a:2,
   e:'MapReduce is built for batch workloads on huge data, completing in minutes or hours; the other three are interactive workloads.',h:'Think about how long a MapReduce job takes and how long each of these users would accept to wait.'},
  {q:'Every night a company imports the customers table from its Oracle database into Hadoop, then runs a Hive job on it. Which two tools fit?',o:['Flume to import, Ambari to schedule','Sqoop to import, Oozie to orchestrate the two jobs','Storm to import, Zookeeper to schedule','HBase to import, Kylin to orchestrate'],a:1,
   e:'Sqoop moves data between an RDBMS and Hadoop; Oozie orchestrates the execution of different jobs, such as a Sqoop import followed by a Hive job.',h:'One tool is the bridge to relational databases, the other is the workflow tool.'},
  {q:'In the modern direction described in the lecture, what takes the place of HDFS and of MapReduce?',o:['YARN and Hive','Kafka and Zookeeper','HBase and Pig','Object storage, and engines such as Spark, Trino or Flink'],a:3,
   e:'The modern path is object storage → Spark / Trino / Flink → Iceberg / Delta: cloud storage replaces HDFS, newer engines replace MapReduce.',h:'Compare the two panels of the stack figure layer by layer.'}
];
