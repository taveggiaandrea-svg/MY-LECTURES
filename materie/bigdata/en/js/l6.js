/* Lesson 6: Spark, RDDs, DataFrames */
const kvT=(k,v)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
const cyl=(x,y,w,h,l)=>'<path d="M'+x+' '+(y+6)+'v'+(h-12)+'a'+(w/2)+' 6 0 0 0 '+w+' 0v'+(-(h-12))+'a'+(w/2)+' 6 0 0 0 '+(-w)+' 0a'+(w/2)+' 6 0 0 0 '+w+' 0" fill="#1a1a1a" stroke="#9a9a9a" stroke-width="1.3"/>'+tx(x+w/2,y+h/2+7,l,{s:13,f:'#fff'});
const chipM=(x,y,w,h,l)=>{let s=rect(x,y,w,h,'#1a1a1a','#9a9a9a');for(let i=1;i<6;i++){const px=x+i*w/6;s+=line(px,y-5,px,y,'#9a9a9a',1.3)+line(px,y+h,px,y+h+5,'#9a9a9a',1.3)}return s+tx(x+w/2,y+h/2+5,l,{s:13,f:'#fff'})};
const partC=(x,y,w,h,l)=>rect(x,y,w,h,'rgba(92,208,179,.22)',TEAL)+tx(x+w/2,y+h/2+5,l,{s:13,f:'#fff'});
INIT[6]=function(){
  codeHL($('#lezione-6'));
  /* MapReduce vs Spark disk traffic */
  (function(){
    const duo=el('div','duo');$('#b6io').append(duo);
    const ar=(id)=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const v=(y1,y2,id,l)=>line(170,y1,170,y2,GRAY,1.6,' marker-end="url(#'+id+')"')+(l?tx(180,(y1+y2)/2+5,l,{s:12.5,f:GRAY,a:'start'}):'');
    let a=ar('b6a1');const st=(y,l)=>box(110,y,120,34,[l],{fs:13.5});
    a+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a1','read')+st(60,'step 1')+v(94,108,'b6a1','write')+cyl(130,110,80,40,'HDFS')+v(150,164,'b6a1','read')+st(166,'step 2')+v(200,214,'b6a1','write')+cyl(130,216,80,40,'HDFS');
    cell(duo,'MapReduce',a,340,262,'MapReduce disk traffic','<b>4</b> disk operations: HDFS before and after each step.');
    let b=ar('b6a2');
    b+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a2','read')+st(60,'step 1')+v(94,112,'b6a2','')+chipM(120,116,100,30,'memory')+v(151,164,'b6a2','')+st(166,'step 2')+v(200,214,'b6a2','')+tx(170,236,'…',{s:20,f:GRAY});
    cell(duo,'Spark',b,340,262,'Spark disk traffic','<b>1</b> disk read: step 1 hands its result to step 2 in memory.');
  })();
  /* benchmarks */
  (function(){
    const duo=el('div','duo');$('#b6perf').append(duo);
    let s='';const L=80,R=300,X=v=>L+v/120*(R-L);
    [0,40,80,120].forEach(v=>{s+=line(X(v),14,X(v),112,'#222',1)+tx(X(v),130,v+' s',{s:13,f:GRAY})});
    [['Hadoop',110,'≈110 s'],['Spark',0.9,'0.9 s']].forEach(([l,v,t],i)=>{const y=24+i*46;s+=tx(L-10,y+20,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,Math.max(X(v)-X(0),2),30,i?'#fff':'#777')+tx(Math.max(X(v),X(0)+2)+8,y+20,t,{s:13.5,a:'start',f:'#fff'})});
    s+=tx(190,152,'running time, logistic regression',{s:13,f:GRAY});
    cell(duo,'Logistic regression',s,340,166,'Logistic regression benchmark','Spark is more than <b>100 times</b> faster on this iterative job.');
    let t='';const rows=[['Time (min)',72,23],['Nodes',2100,206],['Cores',50400,6592]];
    t+=tx(150,16,'2013 Hadoop, 102.5 TB',{s:12.5,f:GRAY,a:'start'});t+=tx(150,32,'2014 Spark, 100 TB',{s:12.5,f:'#fff',a:'start'});
    const th=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g,',');rows.forEach(([l,h,sp],i)=>{const y=48+i*52,mx=h,W=126;t+=tx(140,y+22,l,{s:13.5,a:'end',f:'#fff'});
      t+=rect(150,y,W*h/mx,18,'#777')+tx(150+W+6,y+14,th(h),{s:13,a:'start',f:GRAY});
      t+=rect(150,y+21,Math.max(W*sp/mx,2),18,'#fff')+tx(150+Math.max(W*sp/mx,2)+6,y+35,th(sp),{s:13,a:'start',f:'#fff'})});
    cell(duo,'Sort benchmark',t,340,206,'Sort benchmark','Spark: about <b>3 times</b> faster with about one tenth of the nodes.');
  })();
  /* architecture */
  (function(){
    let s='<defs>'+arrowDef('b6r1',GRAY)+arrowDef('b6r2',ORG)+'</defs>';
    s+=box(10,96,170,104,['Driver program','SparkSession','(SparkContext)'],{fs:14,b:1});
    s+=box(240,112,180,72,['Cluster manager','YARN, Mesos, standalone'],{fs:14,b:1});
    s+=line(180,148,238,148,GRAY,1.6,' marker-end="url(#b6r1)"');
    [10,166].forEach((y,k)=>{s+=rect(470,y,240,130,'#0d0d0d','#666')+tx(482,y+18,'Worker node '+(k+1),{s:13,f:GRAY,a:'start'});
      s+=rect(484,y+28,212,92,'#141414','#9a9a9a')+tx(494,y+46,'Executor',{s:13.5,f:'#fff',a:'start',w:600});
      s+=rect(494,y+58,70,50,'#1e1e1e','#555')+tx(529,y+88,'cache',{s:13,f:GRAY});
      s+=rect(574,y+58,52,50,'#1e1e1e','#777')+tx(600,y+88,'task',{s:13,f:'#fff'})+rect(634,y+58,52,50,'#1e1e1e','#777')+tx(660,y+88,'task',{s:13,f:'#fff'});
      s+=line(420,148,468,y+65,GRAY,1.6,' marker-end="url(#b6r1)"');});
    s+=line(95,96,468,40,GRAY,1.2,' stroke-dasharray="5 4" marker-end="url(#b6r1)"')+line(95,200,468,256,GRAY,1.2,' stroke-dasharray="5 4" marker-end="url(#b6r1)"');
    s+=tx(250,58,'code and tasks',{s:12.5,f:GRAY})+tx(250,250,'code and tasks',{s:12.5,f:GRAY});
    s+=line(590,142,590,162,ORG,2.2,' marker-end="url(#b6r2)"')+line(610,162,610,142,ORG,2.2,' marker-end="url(#b6r2)"')+tx(622,157,'shuffle',{s:13,f:ORG,a:'start'});
    svgBox($('#b6arch'),720,302,s,'Spark cluster architecture','46rem');
  })();
  /* RDD partitions */
  (function(){
    let s='';s+=tx(150,46,'RDD',{s:15,f:'#fff',a:'end',w:600});
    [0,1,2,3].forEach(i=>s+=partC(160+i*100,22,96,36,'partition '+(i+1)));
    const nodes=[[40,[0,1]],[270,[2]],[500,[3]]];
    nodes.forEach(([x,ps])=>ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=line(208+p*100,58,cx+35,120,TEAL,1.3,' opacity=".7"')}));
    nodes.forEach(([x,ps],k)=>{s+=rect(x,120,190,104,'#0d0d0d','#666')+tx(x+95,140,'node '+(k+1),{s:13,f:GRAY})+rect(x+12,150,166,62,'#141414','#9a9a9a')+tx(x+22,168,'executor',{s:13,f:'#fff',a:'start'});
      ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=partC(cx,176,70,28,'P'+(p+1))})});
    svgBox($('#b6rdd'),720,232,s,'An RDD of four partitions on three executors','46rem');
  })();
  /* lazy evaluation, animated */
  (function(){
    const root=$('#b6lazy'),W=720,H=346;root.append(legend([[TEAL,'partition','box'],[ORG,'shuffle'],[PINK,'action and result']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const dag=['textFile','flatMap','map','reduceByKey','collect()'],dx=i=>10+i*142;
    const P=[{y:92,line:'I scream you scream',w:['I','scream','you','scream']},{y:216,line:'lets all scream for icecream',w:['lets','all','scream','for','icecream']}];
    const RK=[['all','for','I'],['icecream','lets'],['scream','you']],ry=k=>92+k*80;
    const cnt={};P.forEach(p=>p.w.forEach(w=>cnt[w]=(cnt[w]||0)+1));
    const where=w=>{for(let k=0;k<3;k++){const j=RK[k].indexOf(w);if(j>=0)return [k,j]}};
    const res=['I','all','for','icecream','lets','scream','you'];
    const steps=[2.5,2.5,2.5,2.5,3,4.5,4.5,3,3];
    const msgs=['<b>textFile</b> adds a step to the DAG. Nothing has been read yet.','<b>flatMap</b> adds a step: lines will become words. Still nothing computed.','<b>map</b> adds a step: words will become (word, 1) pairs. Still nothing computed.',
      '<b>reduceByKey</b> adds a step that needs a shuffle. The DAG is complete, and no task has run yet.','<span style="color:var(--pink)"><b>collect()</b></span> is an action: Spark cuts the DAG at the shuffle into two stages and starts running it.',
      '<b>Stage 1.</b> Each partition, on its own executor, reads its line, splits it into words and maps each word to (word, 1).','<b>Shuffle.</b> Pairs move between executors so that all the pairs of one word end up in the same one of the 3 output partitions.',
      '<b>Stage 2.</b> In each partition reduceByKey adds up the values of each word: (scream, 3).','<b>Result.</b> collect() brings the seven pairs back to the driver.'];
    const T=function(x,y,c,o,halo){return '<text x="'+x+'" y="'+y+'" font-size="13"'+(o!==undefined?' opacity="'+o+'"':'')+(halo?' style="paint-order:stroke;stroke:#000;stroke-width:5px"':'')+'>'+c+'</text>'};
    const pPos=(p,j)=>[22+(j%3)*104,P[p].y+46+Math.floor(j/3)*24];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b6d1',GRAY)+'</defs>';
      dag.forEach((d,k)=>{const vis=k<4?i>=k:i>=4;if(!vis)return;const a=(i>0&&(k===i||(k===4&&i===4)))?e:1,act=k===4;
        s+='<g opacity="'+a+'">'+rect(dx(k),8,128,34,act?'rgba(220,117,205,.2)':'#141414',act?PINK:'#9a9a9a')+tx(dx(k)+64,30,d,{s:13.5,f:act?PINK:'#fff'})+(k?line(dx(k)-13,25,dx(k)-2,25,GRAY,1.5,' marker-end="url(#b6d1)"'):'')+'</g>'});
      if(i>=4){const a=i===4?e:1;s+='<g opacity="'+a+'">'+line(10,50,422,50,i===5?'#fff':'#777',1.5)+tx(216,68,'stage 1',{s:13,f:i===5?'#fff':GRAY})+line(436,50,564,50,i===7?'#fff':'#777',1.5)+tx(500,68,'stage 2',{s:13,f:i===7?'#fff':GRAY})+line(429,4,429,74,ORG,1.5,' stroke-dasharray="4 3"')+'</g>'}
      if(i<4){s+=tx(360,200,'Only the plan grows: no data has been read, no task has run.',{s:14,f:GRAY});s+=tx(360,224,'tasks run so far: 0',{s:13,f:GRAY})}
      else{
        P.forEach((p,k)=>{s+=rect(10,p.y,320,110,'#0b0b0b',i===5?TEAL:'#3d6b60')+tx(20,p.y+18,'partition '+(k+1)+' · executor '+(k+1),{s:12.5,f:TEAL,a:'start'});
          if(i===5&&u<.3)s+=tx(170,p.y+62,'"'+p.line+'"',{s:13.5,f:'#fff'});
          if(i===5&&u>=.3&&u<.62)p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,'<tspan style="fill:#fff">'+w+'</tspan>')});
          if((i===5&&u>=.62)||(i===6&&u<.02))p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,kvT(w,1))})});
        RK.forEach((ks,k)=>{s+=rect(420,ry(k),170,72,'#0b0b0b',i===7?TEAL:'#3d6b60')+tx(430,ry(k)+16,'output partition '+(k+1),{s:12.5,f:TEAL,a:'start'})});
        if(i===6){let g=0;P.forEach((p,k)=>p.w.forEach((w,j)=>{const st=g*.07,ek=ease(clamp((u-st)/.35,0,1)),[x0,y0]=pPos(k,j),[rk,rj]=where(w),x1=432,y1=ry(rk)+34+rj*16,x=lerp(x0,x1,ek),y=lerp(y0,y1,ek);
          if(ek>0&&ek<1)s=s.replace('</defs>','</defs>'+line(x0+40,y0-5,x+20,y-5,ORG,1.4,' opacity=".75"'));if(ek<1||u<.97)s+=T(x,y,kvT(w,1),undefined,1);g++}));}
        if(i===6&&u>=.97||i===7){RK.forEach((ks,k)=>ks.forEach((w,j)=>{const y=ry(k)+34+j*16,gr=kvT(w,'{'+Array(cnt[w]).fill(1).join(', ')+'}'),sm=kvT(w,cnt[w]);
          if(i===6||e<.5)s+=T(432,y,gr,i===6?1:1-2*e);else s+=T(432,y,sm,2*e-1)}))}
        if(i===8)RK.forEach((ks,k)=>ks.forEach((w,j)=>s+=T(432,ry(k)+34+j*16,kvT(w,cnt[w]))));
        s+=rect(606,92,108,232,'#0b0b0b',i>=8?PINK:'#5a3a55')+tx(660,110,'driver',{s:13,f:PINK});
        if(i===8)res.forEach((w,r)=>{const [rk,rj]=where(w),x0=432,y0=ry(rk)+34+rj*16,x1=614,y1=136+r*25,ek=ease(clamp((u-r*.08)/.4,0,1));
          if(ek>0&&ek<1)s+=line(560,y0-5,lerp(560,x1,ek),lerp(y0,y1,ek)-5,PINK,1.3,' opacity=".7"');if(ek>0)s+=T(lerp(x0,x1,ek),lerp(y0,y1,ek),kvT(w,cnt[w]),undefined,1)});
      }
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Lazy evaluation animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 9. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* RDD vs DataFrame */
  (function(){
    const duo=el('div','duo');$('#b6df').append(duo);
    let a='';for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=30+c*96,y=14+r*58;a+=rect(x,y,84,44,'#2a2a2a','#555')+tx(x+42,y+27,'User',{s:13.5,f:'#ccc'})}
    cell(duo,'RDD[User]',a,340,190,'RDD of opaque objects','Spark cannot see inside each object.');
    const rows=[['Ann','34','F'],['Bob','36','M'],['Cleo','30','F'],['Dan','29','M']];
    const t=sTab(40,14,[{t:'Name',w:100},{t:'Age',w:80,a:'e',c:BLUE},{t:'Sex',w:80,a:'m'}],rows);
    let b=t.s+tx(170,t.h+36,'schema: Name string, Age int, Sex string',{s:12.5,f:GRAY});
    cell(duo,'DataFrame',b,340,190,'DataFrame with a schema','Spark knows names and types of the columns.');
  })();
  /* sales.csv */
  (function(){
    const raw=[[20160901,'ProdABD',100,1],[20160901,'ProdDEF',200,2],[20161001,'ProdXYZ',150,3],[20161015,'ProdABD',160,1],[20161031,'ProdXYZ',20,5],[20161101,'ProdABD',50,3],[20161115,'ProdXYZ',200,4],[20161130,'ProdABD',300,4],[20161201,'ProdDEF',160,1],[20161210,'ProdABD',670,2],[20161220,'ProdDEF',100,5]];
    const t1=sTab(10,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE},{t:'customer_id',w:100,a:'e'}],raw.map(r=>r.map(String)),{bg:i=>raw[i][2]>200?OKBG:null});
    const kept=raw.filter(r=>r[2]>200);const t2=sTab(410,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE}],kept.map(r=>[String(r[0]),r[1],String(r[2])]));
    const sum={};raw.forEach(r=>sum[r[1]]=(sum[r[1]]||0)+r[2]);
    const t3=sTab(410,170,[{t:'product',w:110},{t:'sum(value)',w:110,a:'e',c:BLUE}],Object.keys(sum).sort().map(k=>[k,String(sum[k])]));
    let s=t1.s+t2.s+t3.s+tx(10,18,'sales.csv',{s:14,f:'#fff',a:'start',w:500})+tx(410,18,'filter(value > 200)',{s:14,f:'#fff',a:'start',w:500})+tx(410,158,'groupBy("product").sum("value")',{s:14,f:'#fff',a:'start',w:500});
    $('#b6sales').append(legend([[GRN,'row kept by the filter','box']]));
    svgBox($('#b6sales'),720,30+t1.h+8,s,'The sales table and two results','46rem');
  })();
  wideFigs(6);
};
QZ['6a']=()=>[{q:'A MapReduce job has 5 steps. Each step reads its input from HDFS and writes its output to HDFS. How many HDFS reads and writes does the job perform?',o:['5','6','10','2'],a:2,
  e:'Each step costs one read and one write: 5 × 2 = 10 disk operations. Spark would read once and keep the intermediate results in memory.',h:'Count the disk operations of one step in the first panel of the figure, then scale up.'}];
QZ['6b']=()=>[{q:'Your laptop has 8 cores. How many workers does Spark use with master local[*], and how many with local[2]?',o:['1 and 2','8 and 8','8 and 2','2 and 8'],a:2,
  e:'local[*] uses as many workers as the machine has cores, here 8; local[K] uses exactly K, here 2.',h:'Look at the rows for local[K] and local[*] in the master table.'}];
QZ['6c']=()=>[{q:'A script runs rdd = sc.textFile("logs.txt").filter(...).map(...) and ends there. How many tasks does Spark execute?',o:['One per partition, for each of the three steps','None','One, for textFile','It depends on the cluster manager'],a:1,
  e:'textFile, filter and map are all transformations: they only add steps to the DAG. Without an action nothing is executed.',h:'Ask whether the script contains any operation that returns a value.'}];
QZ['6d']=()=>[{q:'On the course\'s sales.csv, what does spark.sql("select product, sum(value) from sales where value >= 200 group by product") return for ProdABD?',o:['1280','970','670','300'],a:1,
  e:'ProdABD has values 100, 160, 50, 300, 670. The where clause keeps 300 and 670 (200 or more), and their sum is 970.',h:'Apply the where clause to the ProdABD rows first, then sum.'}];
QZ['6']=()=>[
  {q:'In the sort benchmark, Hadoop sorted 102.5 TB in 72 minutes on 2,100 nodes; Spark sorted 100 TB in 23 minutes on 206 nodes. Roughly, Spark was',o:['3 times faster with 10 times fewer nodes','10 times faster with 3 times fewer nodes','3 times faster with the same nodes','about as fast with 10 times fewer nodes'],a:0,
   e:'72 / 23 ≈ 3.1 for time and 2,100 / 206 ≈ 10.2 for nodes, on almost the same amount of data.',h:'Compute two ratios: time and nodes.'},
  {q:'A program runs textFile → flatMap → map → reduceByKey → sortByKey → collect(). Into how many stages is its DAG cut?',o:['1','2','3','5'],a:2,
   e:'Stages are cut at every shuffle. Aggregating (reduceByKey) and sorting (sortByKey) both need one, so two shuffles give three stages.',h:'Count the operations that need data to move between executors.'},
  {q:'In the lecture\'s word count, reduceByKey(..., 3) produces the output. Which statement is true?',o:['Each of the 3 output partitions can hold pairs of the word "scream"','The 7 distinct words are spread over 3 partitions, and all the pairs of one word end up in the same one','The output has 3 pairs, one per partition','The shuffle happens after reduceByKey has summed the values'],a:1,
   e:'The 3 sets the number of output partitions; the shuffle sends every pair of a word to the same partition, so the sum of each word is computed in one place.',h:'Think about why the shuffle is needed before the sums can be computed.'},
  {q:'You run sales.createOrReplaceTempView("sales") and sales.write.saveAsTable("bemacs_sales_table"), then restart Spark and connect to the same metastore. Which can you still query?',o:['Both','Only the temporary view sales','Only bemacs_sales_table','Neither'],a:2,
   e:'A temporary view lives as long as the session; saveAsTable materializes a persistent table in the Hive metastore, which survives restarts.',h:'Recall where each of the two statements keeps its table.'},
  {q:'On sales.csv, sales.filter(sales["value"] > 150).groupBy("product").count() returns which counts for ProdABD, ProdDEF and ProdXYZ?',o:['5, 3 and 3','3, 1 and 1','2, 2 and 1','3, 2 and 1'],a:3,
   e:'ProdABD keeps 160, 300, 670 (3); ProdDEF keeps 200, 160 (2); ProdXYZ keeps only 200, since 150 is not greater than 150 (1).',h:'Watch the strict inequality on the value 150.'},
  {q:'One engineer filters an RDD of User objects with a lambda on u.age; another filters a DataFrame with df["age"] > 40. Why can Spark optimize only the second?',o:['DataFrames are always stored on disk','Spark knows the DataFrame\'s schema, while RDD elements are opaque objects','RDDs cannot be filtered','Lambdas only run on the driver'],a:1,
   e:'A DataFrame is a collection with a schema known to Spark SQL, so Spark can see which column is used; inside an RDD of User objects Spark cannot see the structure.',h:'Recall the two panels of the RDD versus DataFrame figure.'}
];
