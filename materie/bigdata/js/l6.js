/* Lezione 6: Spark, RDD, DataFrame */
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
    a+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a1','lettura')+st(60,'passo 1')+v(94,108,'b6a1','scrittura')+cyl(130,110,80,40,'HDFS')+v(150,164,'b6a1','lettura')+st(166,'passo 2')+v(200,214,'b6a1','scrittura')+cyl(130,216,80,40,'HDFS');
    cell(duo,'MapReduce',a,340,262,'Traffico su disco di MapReduce','<b>4</b> operazioni su disco: HDFS prima e dopo ogni passo.');
    let b=ar('b6a2');
    b+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a2','lettura')+st(60,'passo 1')+v(94,112,'b6a2','')+chipM(120,116,100,30,'memoria')+v(151,164,'b6a2','')+st(166,'passo 2')+v(200,214,'b6a2','')+tx(170,236,'…',{s:20,f:GRAY});
    cell(duo,'Spark',b,340,262,'Traffico su disco di Spark','<b>1</b> lettura da disco: il passo 1 passa il suo risultato al passo 2 in memoria.');
  })();
  /* benchmarks */
  (function(){
    const duo=el('div','duo');$('#b6perf').append(duo);
    let s='';const L=80,R=300,X=v=>L+v/120*(R-L);
    [0,40,80,120].forEach(v=>{s+=line(X(v),14,X(v),112,'#222',1)+tx(X(v),130,v+' s',{s:13,f:GRAY})});
    [['Hadoop',110,'≈110 s'],['Spark',0.9,'0,9 s']].forEach(([l,v,t],i)=>{const y=24+i*46;s+=tx(L-10,y+20,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,Math.max(X(v)-X(0),2),30,i?'#fff':'#777')+tx(Math.max(X(v),X(0)+2)+8,y+20,t,{s:13.5,a:'start',f:'#fff'})});
    s+=tx(190,152,'tempo di esecuzione, regressione logistica',{s:13,f:GRAY});
    cell(duo,'Regressione logistica',s,340,166,'Benchmark della regressione logistica','Spark è più di <b>100 volte</b> più veloce in questo lavoro iterativo.');
    let t='';const rows=[['Tempo (min)',72,23],['Nodi',2100,206],['Core',50400,6592]];
    t+=tx(150,16,'2013 Hadoop, 102,5 TB',{s:12.5,f:GRAY,a:'start'});t+=tx(150,32,'2014 Spark, 100 TB',{s:12.5,f:'#fff',a:'start'});
    const th=v=>fi(v,0);rows.forEach(([l,h,sp],i)=>{const y=48+i*52,mx=h,W=126;t+=tx(140,y+22,l,{s:13.5,a:'end',f:'#fff'});
      t+=rect(150,y,W*h/mx,18,'#777')+tx(150+W+6,y+14,th(h),{s:13,a:'start',f:GRAY});
      t+=rect(150,y+21,Math.max(W*sp/mx,2),18,'#fff')+tx(150+Math.max(W*sp/mx,2)+6,y+35,th(sp),{s:13,a:'start',f:'#fff'})});
    cell(duo,'Benchmark di ordinamento',t,340,206,'Benchmark di ordinamento','Spark: circa <b>3 volte</b> più veloce con circa un decimo dei nodi.');
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
    s+=tx(250,58,'codice e task',{s:12.5,f:GRAY})+tx(250,250,'codice e task',{s:12.5,f:GRAY});
    s+=line(590,142,590,162,ORG,2.2,' marker-end="url(#b6r2)"')+line(610,162,610,142,ORG,2.2,' marker-end="url(#b6r2)"')+tx(622,157,'shuffle',{s:13,f:ORG,a:'start'});
    svgBox($('#b6arch'),720,302,s,'Architettura di un cluster Spark','46rem');
  })();
  /* RDD partitions */
  (function(){
    let s='';s+=tx(150,46,'RDD',{s:15,f:'#fff',a:'end',w:600});
    [0,1,2,3].forEach(i=>s+=partC(160+i*100,22,96,36,'partizione '+(i+1)));
    const nodes=[[40,[0,1]],[270,[2]],[500,[3]]];
    nodes.forEach(([x,ps])=>ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=line(208+p*100,58,cx+35,120,TEAL,1.3,' opacity=".7"')}));
    nodes.forEach(([x,ps],k)=>{s+=rect(x,120,190,104,'#0d0d0d','#666')+tx(x+95,140,'nodo '+(k+1),{s:13,f:GRAY})+rect(x+12,150,166,62,'#141414','#9a9a9a')+tx(x+22,168,'executor',{s:13,f:'#fff',a:'start'});
      ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=partC(cx,176,70,28,'P'+(p+1))})});
    svgBox($('#b6rdd'),720,232,s,'Un RDD di quattro partizioni su tre executor','46rem');
  })();
  /* lazy evaluation, animated */
  (function(){
    const root=$('#b6lazy'),W=720,H=346;root.append(legend([[TEAL,'partizione','box'],[ORG,'shuffle'],[PINK,'azione e risultato']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const dag=['textFile','flatMap','map','reduceByKey','collect()'],dx=i=>10+i*142;
    const P=[{y:92,line:'I scream you scream',w:['I','scream','you','scream']},{y:216,line:'lets all scream for icecream',w:['lets','all','scream','for','icecream']}];
    const RK=[['all','for','I'],['icecream','lets'],['scream','you']],ry=k=>92+k*80;
    const cnt={};P.forEach(p=>p.w.forEach(w=>cnt[w]=(cnt[w]||0)+1));
    const where=w=>{for(let k=0;k<3;k++){const j=RK[k].indexOf(w);if(j>=0)return [k,j]}};
    const res=['I','all','for','icecream','lets','scream','you'];
    const steps=[2.5,2.5,2.5,2.5,3,4.5,4.5,3,3];
    const msgs=['<b>textFile</b> aggiunge un passo al DAG. Non è ancora stato letto nulla.','<b>flatMap</b> aggiunge un passo: le righe diventeranno parole. Ancora nulla di calcolato.','<b>map</b> aggiunge un passo: le parole diventeranno coppie (parola, 1). Ancora nulla di calcolato.',
      '<b>reduceByKey</b> aggiunge un passo che richiede uno shuffle. Il DAG è completo, e nessun task è ancora partito.','<span style="color:var(--pink)"><b>collect()</b></span> è un\'azione: Spark taglia il DAG allo shuffle in due stage e comincia a eseguirlo.',
      '<b>Stage 1.</b> Ogni partizione, sul proprio executor, legge la sua riga, la divide in parole e trasforma ogni parola in (parola, 1).','<b>Shuffle.</b> Le coppie si spostano fra gli executor perché tutte le coppie di una parola finiscano nella stessa partizione, fra le 3 di output.',
      '<b>Stage 2.</b> In ogni partizione reduceByKey somma i valori di ogni parola: (scream, 3).','<b>Risultato.</b> collect() riporta le sette coppie al driver.'];
    const T=function(x,y,c,o,halo){return '<text x="'+x+'" y="'+y+'" font-size="13"'+(o!==undefined?' opacity="'+o+'"':'')+(halo?' style="paint-order:stroke;stroke:#000;stroke-width:5px"':'')+'>'+c+'</text>'};
    const pPos=(p,j)=>[22+(j%3)*104,P[p].y+46+Math.floor(j/3)*24];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b6d1',GRAY)+'</defs>';
      dag.forEach((d,k)=>{const vis=k<4?i>=k:i>=4;if(!vis)return;const a=(i>0&&(k===i||(k===4&&i===4)))?e:1,act=k===4;
        s+='<g opacity="'+a+'">'+rect(dx(k),8,128,34,act?'rgba(220,117,205,.2)':'#141414',act?PINK:'#9a9a9a')+tx(dx(k)+64,30,d,{s:13.5,f:act?PINK:'#fff'})+(k?line(dx(k)-13,25,dx(k)-2,25,GRAY,1.5,' marker-end="url(#b6d1)"'):'')+'</g>'});
      if(i>=4){const a=i===4?e:1;s+='<g opacity="'+a+'">'+line(10,50,422,50,i===5?'#fff':'#777',1.5)+tx(216,68,'stage 1',{s:13,f:i===5?'#fff':GRAY})+line(436,50,564,50,i===7?'#fff':'#777',1.5)+tx(500,68,'stage 2',{s:13,f:i===7?'#fff':GRAY})+line(429,4,429,74,ORG,1.5,' stroke-dasharray="4 3"')+'</g>'}
      if(i<4){s+=tx(360,200,'Cresce solo il piano: nessun dato letto, nessun task eseguito.',{s:14,f:GRAY});s+=tx(360,224,'task eseguiti finora: 0',{s:13,f:GRAY})}
      else{
        P.forEach((p,k)=>{s+=rect(10,p.y,320,110,'#0b0b0b',i===5?TEAL:'#3d6b60')+tx(20,p.y+18,'partizione '+(k+1)+' · executor '+(k+1),{s:12.5,f:TEAL,a:'start'});
          if(i===5&&u<.3)s+=tx(170,p.y+62,'"'+p.line+'"',{s:13.5,f:'#fff'});
          if(i===5&&u>=.3&&u<.62)p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,'<tspan style="fill:#fff">'+w+'</tspan>')});
          if((i===5&&u>=.62)||(i===6&&u<.02))p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,kvT(w,1))})});
        RK.forEach((ks,k)=>{s+=rect(420,ry(k),170,72,'#0b0b0b',i===7?TEAL:'#3d6b60')+tx(430,ry(k)+16,'partizione di output '+(k+1),{s:12.5,f:TEAL,a:'start'})});
        if(i===6){let g=0;P.forEach((p,k)=>p.w.forEach((w,j)=>{const st=g*.07,ek=ease(clamp((u-st)/.35,0,1)),[x0,y0]=pPos(k,j),[rk,rj]=where(w),x1=432,y1=ry(rk)+34+rj*16,x=lerp(x0,x1,ek),y=lerp(y0,y1,ek);
          if(ek>0&&ek<1)s=s.replace('</defs>','</defs>'+line(x0+40,y0-5,x+20,y-5,ORG,1.4,' opacity=".75"'));if(ek<1||u<.97)s+=T(x,y,kvT(w,1),undefined,1);g++}));}
        if(i===6&&u>=.97||i===7){RK.forEach((ks,k)=>ks.forEach((w,j)=>{const y=ry(k)+34+j*16,gr=kvT(w,'{'+Array(cnt[w]).fill(1).join(', ')+'}'),sm=kvT(w,cnt[w]);
          if(i===6||e<.5)s+=T(432,y,gr,i===6?1:1-2*e);else s+=T(432,y,sm,2*e-1)}))}
        if(i===8)RK.forEach((ks,k)=>ks.forEach((w,j)=>s+=T(432,ry(k)+34+j*16,kvT(w,cnt[w]))));
        s+=rect(606,92,108,232,'#0b0b0b',i>=8?PINK:'#5a3a55')+tx(660,110,'driver',{s:13,f:PINK});
        if(i===8)res.forEach((w,r)=>{const [rk,rj]=where(w),x0=432,y0=ry(rk)+34+rj*16,x1=614,y1=136+r*25,ek=ease(clamp((u-r*.08)/.4,0,1));
          if(ek>0&&ek<1)s+=line(560,y0-5,lerp(560,x1,ek),lerp(y0,y1,ek)-5,PINK,1.3,' opacity=".7"');if(ek>0)s+=T(lerp(x0,x1,ek),lerp(y0,y1,ek),kvT(w,cnt[w]),undefined,1)});
      }
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione dell\'esecuzione pigra">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 9. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* RDD vs DataFrame */
  (function(){
    const duo=el('div','duo');$('#b6df').append(duo);
    let a='';for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=30+c*96,y=14+r*58;a+=rect(x,y,84,44,'#2a2a2a','#555')+tx(x+42,y+27,'User',{s:13.5,f:'#ccc'})}
    cell(duo,'RDD[User]',a,340,190,'RDD di oggetti opachi','Spark non può vedere dentro ogni oggetto.');
    const rows=[['Ann','34','F'],['Bob','36','M'],['Cleo','30','F'],['Dan','29','M']];
    const t=sTab(40,14,[{t:'Name',w:100},{t:'Age',w:80,a:'e',c:BLUE},{t:'Sex',w:80,a:'m'}],rows);
    let b=t.s+tx(170,t.h+36,'schema: Name string, Age int, Sex string',{s:12.5,f:GRAY});
    cell(duo,'DataFrame',b,340,190,'DataFrame con uno schema','Spark conosce i nomi e i tipi delle colonne.');
  })();
  /* sales.csv */
  (function(){
    const raw=[[20160901,'ProdABD',100,1],[20160901,'ProdDEF',200,2],[20161001,'ProdXYZ',150,3],[20161015,'ProdABD',160,1],[20161031,'ProdXYZ',20,5],[20161101,'ProdABD',50,3],[20161115,'ProdXYZ',200,4],[20161130,'ProdABD',300,4],[20161201,'ProdDEF',160,1],[20161210,'ProdABD',670,2],[20161220,'ProdDEF',100,5]];
    const t1=sTab(10,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE},{t:'customer_id',w:100,a:'e'}],raw.map(r=>r.map(String)),{bg:i=>raw[i][2]>200?OKBG:null});
    const kept=raw.filter(r=>r[2]>200);const t2=sTab(410,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE}],kept.map(r=>[String(r[0]),r[1],String(r[2])]));
    const sum={};raw.forEach(r=>sum[r[1]]=(sum[r[1]]||0)+r[2]);
    const t3=sTab(410,170,[{t:'product',w:110},{t:'sum(value)',w:110,a:'e',c:BLUE}],Object.keys(sum).sort().map(k=>[k,String(sum[k])]));
    let s=t1.s+t2.s+t3.s+tx(10,18,'sales.csv',{s:14,f:'#fff',a:'start',w:500})+tx(410,18,'filter(value > 200)',{s:14,f:'#fff',a:'start',w:500})+tx(410,158,'groupBy("product").sum("value")',{s:14,f:'#fff',a:'start',w:500});
    $('#b6sales').append(legend([[GRN,'riga tenuta dal filtro','box']]));
    svgBox($('#b6sales'),720,30+t1.h+8,s,'La tabella delle vendite e due risultati','46rem');
  })();
  wideFigs(6);
};
QZ['6a']=()=>[{q:'Un job MapReduce ha 5 passi. Ogni passo legge il suo input da HDFS e scrive il suo output in HDFS. Quante letture e scritture su HDFS esegue il job?',o:['5','6','10','2'],a:2,
  e:'Ogni passo costa una lettura e una scrittura: 5 × 2 = 10 operazioni su disco. Spark leggerebbe una volta e terrebbe in memoria i risultati intermedi.',h:'Conta le operazioni su disco di un passo nel primo riquadro della figura, poi moltiplica.'}];
QZ['6b']=()=>[{q:'Il tuo portatile ha 8 core. Quanti worker usa Spark con master local[*], e quanti con local[2]?',o:['1 e 2','8 e 8','8 e 2','2 e 8'],a:2,
  e:'local[*] usa tanti worker quanti sono i core della macchina, qui 8; local[K] ne usa esattamente K, qui 2.',h:'Guarda le righe di local[K] e local[*] nella tabella dei valori di master.'}];
QZ['6c']=()=>[{q:'Uno script esegue rdd = sc.textFile("logs.txt").filter(...).map(...) e finisce lì. Quanti task esegue Spark?',o:['Uno per partizione, per ciascuno dei tre passi','Nessuno','Uno, per textFile','Dipende dal cluster manager'],a:1,
  e:'textFile, filter e map sono tutte trasformazioni: aggiungono solo passi al DAG. Senza un\'azione non viene eseguito nulla.',h:'Chiediti se lo script contiene un\'operazione che restituisce un valore.'}];
QZ['6d']=()=>[{q:'Sul file sales.csv del corso, che cosa restituisce spark.sql("select product, sum(value) from sales where value >= 200 group by product") per ProdABD?',o:['1280','970','670','300'],a:1,
  e:'ProdABD ha i valori 100, 160, 50, 300, 670. La clausola where tiene 300 e 670 (200 o più), e la loro somma è 970.',h:'Applica prima la clausola where alle righe di ProdABD, poi somma.'}];
QZ['6']=()=>[
  {q:'Nel benchmark di ordinamento, Hadoop ha ordinato 102,5 TB in 72 minuti su 2100 nodi; Spark ha ordinato 100 TB in 23 minuti su 206 nodi. All\'incirca, Spark è stato',o:['3 volte più veloce con 10 volte meno nodi','10 volte più veloce con 3 volte meno nodi','3 volte più veloce con gli stessi nodi','più o meno altrettanto veloce con 10 volte meno nodi'],a:0,
   e:'72 / 23 ≈ 3,1 per il tempo e 2100 / 206 ≈ 10,2 per i nodi, su quasi la stessa quantità di dati.',h:'Calcola due rapporti: tempo e nodi.'},
  {q:'Un programma esegue textFile → flatMap → map → reduceByKey → sortByKey → collect(). In quanti stage viene tagliato il suo DAG?',o:['1','2','3','5'],a:2,
   e:'Gli stage si tagliano a ogni shuffle. Aggregare (reduceByKey) e ordinare (sortByKey) ne richiedono uno ciascuno, quindi due shuffle danno tre stage.',h:'Conta le operazioni che richiedono di spostare dati fra gli executor.'},
  {q:'Nel conteggio delle parole della lezione, reduceByKey(..., 3) produce l\'output. Quale affermazione è vera?',o:['Ognuna delle 3 partizioni di output può contenere coppie della parola «scream»','Le 7 parole distinte sono sparse su 3 partizioni, e tutte le coppie di una parola finiscono nella stessa','L\'output ha 3 coppie, una per partizione','Lo shuffle avviene dopo che reduceByKey ha sommato i valori'],a:1,
   e:'Il 3 fissa il numero delle partizioni di output; lo shuffle manda ogni coppia di una parola alla stessa partizione, così la somma di ogni parola si calcola in un solo posto.',h:'Pensa a perché serve lo shuffle prima di poter calcolare le somme.'},
  {q:'Esegui sales.createOrReplaceTempView("sales") e sales.write.saveAsTable("bemacs_sales_table"), poi riavvii Spark e ti colleghi allo stesso metastore. Che cosa puoi ancora interrogare?',o:['Entrambe','Solo la vista temporanea sales','Solo bemacs_sales_table','Nessuna delle due'],a:2,
   e:'Una vista temporanea vive quanto la sessione; saveAsTable materializza una tabella persistente nel metastore di Hive, che sopravvive ai riavvii.',h:'Ricorda dove ciascuna delle due istruzioni tiene la sua tabella.'},
  {q:'Su sales.csv, sales.filter(sales["value"] > 150).groupBy("product").count() restituisce quali conteggi per ProdABD, ProdDEF e ProdXYZ?',o:['5, 3 e 3','3, 1 e 1','2, 2 e 1','3, 2 e 1'],a:3,
   e:'ProdABD tiene 160, 300, 670 (3); ProdDEF tiene 200, 160 (2); ProdXYZ tiene solo 200, perché 150 non è maggiore di 150 (1).',h:'Attenzione alla disuguaglianza stretta sul valore 150.'},
  {q:'Un ingegnere filtra un RDD di oggetti User con una lambda su u.age; un altro filtra un DataFrame con df["age"] > 40. Perché Spark può ottimizzare solo il secondo?',o:['I DataFrame sono sempre memorizzati su disco','Spark conosce lo schema del DataFrame, mentre gli elementi di un RDD sono oggetti opachi','Gli RDD non si possono filtrare','Le lambda girano solo sul driver'],a:1,
   e:'Un DataFrame è una collezione con uno schema noto a Spark SQL, quindi Spark può vedere quale colonna viene usata; dentro un RDD di oggetti User Spark non vede la struttura.',h:'Ricorda i due riquadri della figura RDD contro DataFrame.'}
];
/* mappa mentale del riepilogo */
MAPPA[6]={c:'Che cosa rende Spark così veloce?',r:[
  {t:'In memoria',c:BLUE,v:['Legge una volta e tiene in memoria i risultati intermedi','Veloce anche su disco','Regressione logistica: oltre 100 volte più veloce']},
  {t:'Cluster',c:ORG,v:['Driver: le istruzioni e la SparkSession','Cluster manager: YARN, Mesos, standalone','Worker ed executor eseguono i task','Shuffle: dati scambiati fra executor']},
  {t:'RDD',c:TEAL,v:['Collezione immutabile e distribuita','Partizioni elaborate in parallelo','Creato da un file system o da una collezione']},
  {t:'Esecuzione pigra',c:PINK,v:['Trasformazioni: aggiungono passi al DAG','Azioni: eseguono il DAG, come collect()','Stage tagliati a ogni shuffle']},
  {t:'DataFrame e Spark SQL',c:YEL,v:['Colonne con un nome e uno schema noto','select, filter, groupBy, sum','Vista temporanea o tabella persistente','Fonti: CSV, JSON, JDBC, Parquet']}]};
