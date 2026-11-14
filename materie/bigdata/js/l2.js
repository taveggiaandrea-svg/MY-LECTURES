/* Lesson 2: what exactly is a table */
INIT[2]=function(){
  codeHL($('#lezione-2'));
  /* four inserts into Sales */
  (function(){
    const root=$('#b2ins'),m=el('div','duo');root.append(legend([[GRN,'accepted row','box'],[RED,'refused row','box'],['#fff','cell that breaks a rule','dash']]),m);
    const C=[{t:'id',w:30,a:'e',c:PKC},{t:'date',w:56},{t:'cust',w:44,a:'e',c:FKC},{t:'prod',w:44},{t:'qty',w:40,a:'e'}];
    [['A sales_id that exists',[3,'09-04',2,'abc',4],0,false,'sales_id 3 is already there: the <span style="color:var(--yellow)">primary key</span> refuses a duplicate.'],
     ['A customer who does not exist',[7,'09-04',9,'abc',3],2,false,'There is no customer 9: the <span style="color:var(--pink)">foreign key</span> refuses it.'],
     ['A quantity of zero',[7,'09-04',2,'abc',0],4,false,'<span style="color:var(--orange)">quantity &gt; 0</span> is false: the CHECK constraint refuses it.'],
     ['An unknown customer',[7,'09-04',null,'abc',3],-1,true,'customer_id is NULL, which a foreign key allows.']].forEach(([title,row,bad,ok,note])=>{
      const t=sTab(4,4,C,[[6,'09-03',2,'xyz',3].map(v=>({v,f:GRAY})),row],{bg:i=>i===1?(ok?OKBG:BADBG):null});
      const ex=bad>=0?rect(colX(4,C,bad)+1,4+26+25+1,C[bad].w-2,23,'none','#fff',' stroke-width="2"'):'';
      tabCell(m,title,t,verdict(ok,note),300,ex)});
  })();
  /* CHAR versus VARCHAR, and DECIMAL(5,2) */
  (function(){
    const duo=el('div','duo');$('#b2types').append(duo);
    const q=v=>"'"+v+"'";
    const rows=[['',4],['ab',4],['abcd',4],['abcdefgh',4]].map(([v])=>{const c=v.slice(0,4);return [q(v),q(c.padEnd(4,'·')),4,q(c),c.length+1]});
    const t=sTab(4,4,[{t:'value',w:84},{t:'CHAR(4)',w:72},{t:'bytes',w:46,a:'e'},{t:'VARCHAR(4)',w:86},{t:'bytes',w:46,a:'e'}],rows.map(r=>[r[0],r[1],{v:r[2],f:MSC},r[3],{v:r[4],f:MSC}]),{rh:28});
    cell(duo,'Bytes used by text',t.s,t.w+8,t.h+8,'CHAR and VARCHAR storage','CHAR always takes 4 bytes; VARCHAR takes the length plus 1.');
    let s='';const bw=26;
    [[12.5,'12.50'],[999.99,'999.99'],[1000.5,'1000.50']].forEach(([n,str],i)=>{const y=26+i*58,[ip,dp]=str.split('.'),ok=ip.length<=3;
      s+=tx(52,y+19,fe(n),{s:15,f:'#fff',a:'end'});
      const digits=ip.padStart(3,' ').split('');const x0=112-(ip.length>3?(ip.length-3)*bw:0);
      digits.forEach((d,k)=>{const x=x0+k*bw,extra=ip.length>3&&k<ip.length-3;s+=rect(x,y,bw-3,28,'#0d0d0d',extra?RED:'#666')+tx(x+(bw-3)/2,y+20,d===' '?'0':d,{s:15,f:extra?RED:(d===' '?'#444':'#fff')})});
      const xp=x0+digits.length*bw;s+=tx(xp+4,y+22,'.',{s:16,f:'#fff'});
      dp.split('').forEach((d,k)=>{const x=xp+12+k*bw;s+=rect(x,y,bw-3,28,'#0d0d0d','#666')+tx(x+(bw-3)/2,y+20,d,{s:15,f:'#fff'})});
      s+=tx(272,y+19,ok?'fits':'does not fit',{s:14,f:ok?GRN:RED,a:'start'})});
    cell(duo,'Numbers in DECIMAL(5,2)',s,370,196,'DECIMAL(5,2) boxes','Room for 3 digits before the point: the largest value is 999.99.');
  })();
  /* full scan versus index */
  (function(){
    const duo=el('div','duo'),root=$('#b2idx');root.append(legend([['#8a8a8a','rows read','box'],[GRN,'row found','box']]),duo);
    const n=64,target=37,r=lcg(5),perm=[...Array(n).keys()].map(i=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}
    const pos=perm.indexOf(target);let lo=0,hi=n-1;const probes=[];while(lo<=hi){const mid=(lo+hi)>>1;probes.push(mid);if(mid+1===target)break;if(mid+1<target)lo=mid+1;else hi=mid-1}
    const grid=(lab,fill)=>{let s='';for(let i=0;i<n;i++){const x=6+(i%8)*36,y=6+Math.floor(i/8)*36,f=fill(i);s+=rect(x,y,33,33,f||'#1a1a1a')+tx(x+16.5,y+22,lab(i),{s:13,f:f===GRN||f==='#8a8a8a'?'#000':'#ccc'})}return s};
    cell(duo,'Full table scan',grid(i=>perm[i],i=>i<pos?'#8a8a8a':i===pos?GRN:null),300,300,'Full table scan grid','Reads <b>'+(pos+1)+'</b> rows of 64; in the worst case all 64.');
    cell(duo,'Search through the index',grid(i=>i+1,i=>{const k=probes.indexOf(i);return k<0?null:k===probes.length-1?GRN:'#8a8a8a'}),300,300,'Index search grid','Reads <b>'+probes.length+'</b> rows; never more than 7 for 64 rows.');
  })();
  /* update anomaly versus third normal form */
  (function(){
    const duo=el('div','duo');$('#b2anom').append(duo);const NEW='123-000000',OLD='123-456789';
    let s=mono(8,18,'UPDATE Employee')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">employee_id = 1</tspan>;');
    const C1=[{t:'emp_id',w:52,a:'e',c:PKC},{t:'name',w:52},{t:'dep_code',w:66},{t:'dep_name',w:70},{t:'dep_phone',w:96}];
    const t1=sTab(4,70,C1,[[1,'Mary','FIN','Finance',{v:NEW,f:'#fff',bg:BADBG}],[2,'John','FIN','Finance',{v:OLD,bg:BADBG}],[3,'Lucy','FIN','Finance',{v:OLD,bg:BADBG}]]);
    s+=t1.s;cell(duo,'One Employee table',s,344,70+t1.h+8,'Denormalized table after the update','<span class="bad">Finance now has 2 phone numbers.</span> Two rows were never updated.');
    s=mono(8,18,'UPDATE Department')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">dep_id = 1</tspan>;');
    const t2=sTab(4,70,[{t:'dep_id',w:52,a:'e',c:PKC},{t:'dep_code',w:68},{t:'dep_name',w:72},{t:'dep_phone',w:96}],[[1,'FIN','Finance',{v:NEW,bg:OKBG}]]);
    const t3=sTab(4,70+t2.h+16,[{t:'emp_id',w:52,a:'e',c:PKC},{t:'first',w:52},{t:'last',w:58},{t:'dep_id',w:52,a:'e',c:FKC}],[[1,'Mary','Johns',{v:1,f:FKC}],[2,'John','White',{v:1,f:FKC}],[3,'Lucy','Smith',{v:1,f:FKC}]]);
    s+=t2.s+t3.s;cell(duo,'Department + Employee (third normal form)',s,344,70+t2.h+16+t3.h+8,'Normalized tables after the update','<span class="ok">Finance has 1 phone number,</span> stored in one row.');
  })();
  /* OLTP schema versus warehouse schema */
  (function(){
    const duo=el('div','duo'),root=$('#b2shape');root.append(legend([[PRC,'tables and joins needed by the question'],['#555','other tables and links']]),duo);
    const draw=(nodes,edges,path,bw)=>{let s='';const P=new Set(path.flat());
      edges.forEach(([a,b])=>{const on=path.some(([u,v])=>(u===a&&v===b)||(u===b&&v===a));s+=line(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],on?PRC:'#555',on?3:1.5)});
      Object.entries(nodes).forEach(([k,[x,y]])=>{const on=P.has(k);s+=rect(x-bw/2,y-14,bw,28,'#0b0b0b',on?PRC:'#555',on?' stroke-width="2"':'')+tx(x,y+5,k,{s:14,f:on?'#fff':'#999'})});return s};
    const N1={Continents:[62,22],Countries:[62,74],Cities:[62,126],Addresses:[62,178],Shops:[62,238],Customers:[180,178],sales_header:[180,238],Colors:[180,126],Categories:[298,22],Subcategory:[298,74],Product:[298,126],sales_details:[298,178]};
    const E1=[['Continents','Countries'],['Countries','Cities'],['Cities','Addresses'],['Addresses','Customers'],['Addresses','Shops'],['Customers','sales_header'],['Shops','sales_header'],['sales_header','sales_details'],['sales_details','Product'],['Product','Colors'],['Product','Subcategory'],['Subcategory','Categories']];
    const P1=[['sales_details','sales_header'],['sales_header','Customers'],['Customers','Addresses'],['Addresses','Cities'],['Cities','Countries'],['Countries','Continents'],['sales_details','Product'],['Product','Subcategory'],['Subcategory','Categories']];
    cell(duo,'OLTP: 12 normalized tables',draw(N1,E1,P1,108),360,256,'OLTP schema','<b>10 tables, 9 joins.</b> Continent and category sit at the far ends of two chains.');
    const N2={'Fact Sales':[180,128],'Dim Customers':[70,40],'Dim Product':[290,40],'Dim Shops':[70,216],'Dim Date':[290,216],'Dim Time':[180,40]};
    const E2=[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product'],['Fact Sales','Dim Shops'],['Fact Sales','Dim Date'],['Fact Sales','Dim Time']];
    cell(duo,'Data warehouse: facts and dimensions',draw(N2,E2,[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product']],104),360,256,'Warehouse schema','<b>3 tables, 2 joins.</b> Continent is a column of Dim Customers, category a column of Dim Product.');
  })();
  /* one fact row read through its surrogate keys */
  (function(){
    const order=[5,2,4,1,3],dc=order.map((cid,i)=>{const c=CUST.find(x=>x[0]===cid);return [i+1,cid,capw(c[1])+' '+capw(c[2]),capw(c[3])]});
    const dd=[[1,'2018-09-01','Saturday'],[2,'2018-09-02','Sunday'],[3,'2018-09-03','Monday']],dp=[[1,'abc'],[2,'xyz']];
    const fact=SAL.map(r=>[dd.find(d=>d[1]===r[1])[0],dc.find(c=>c[1]===r[2])[0],dp.find(p=>p[1]===r[3])[0],r[4],r[4]*r[5]]);const sel=2,f=fact[sel];
    const K=v=>({v,f:PKC});let s='';
    const Cc=[{t:'cust_key',w:66,a:'e',c:PKC},{t:'business key',w:96,a:'e'},{t:'name',w:108},{t:'city',w:76}];
    const tc=sTab(6,26,Cc,dc.map(r=>[K(r[0]),r[1],r[2],r[3]]),{bg:i=>dc[i][0]===f[1]?HLBG:null});
    const Cp=[{t:'prod_key',w:68,a:'e',c:PKC},{t:'business key',w:96}],xp=372;
    const tp=sTab(xp,26,Cp,dp.map(r=>[K(r[0]),r[1]]),{bg:i=>dp[i][0]===f[2]?HLBG:null});
    const Cd=[{t:'date_key',w:66,a:'e',c:PKC},{t:'date',w:88},{t:'day',w:76}],xd=xp,yd=26+tp.h+46;
    const td=sTab(xd,yd,Cd,dd.map(r=>[K(r[0]),r[1],r[2]]),{bg:i=>dd[i][0]===f[0]?HLBG:null});
    s+=tc.s+tp.s+td.s+tx(6+173,16,'Customer dimension',{s:14,f:GRAY})+tx(xp+82,16,'Product dimension',{s:14,f:GRAY})+tx(xd+115,yd-8,'Date dimension',{s:14,f:GRAY});
    const Cf=[{t:'date_key',w:70,a:'e',c:FKC},{t:'cust_key',w:70,a:'e',c:FKC},{t:'prod_key',w:70,a:'e',c:FKC},{t:'quantity',w:70,a:'e',c:MSC},{t:'amount',w:70,a:'e',c:MSC}];
    const yf=288,xf=150,FK=v=>({v,f:FKC});
    const tf=sTab(xf,yf,Cf,fact.map(r=>[FK(r[0]),FK(r[1]),FK(r[2]),{v:r[3],f:MSC},{v:fe(r[4]),f:MSC}]),{bg:i=>i===sel?HLBG:null});
    s+=tf.s+tx(xf+175,yf-10,'Sales fact table',{s:14,f:GRAY});
    svgBox($('#b2star'),720,yf+tf.h+12,s,'A fact row linked to its dimension rows','46rem');
    $('#b2star').append(el('div','cellnote','The highlighted sale reads: on Sunday 2018-09-02, Mark Smith from Liverpool bought 10 units of xyz for 15. His surrogate key is 5, his business key 3.'));
  })();
  /* UPDATE and DELETE, with and without WHERE */
  (function(){
    const m=el('div','duo');$('#b2dml').append(m);const C=[{t:'id',w:30,a:'e',c:PKC},{t:'first',w:48},{t:'last',w:48},{t:'city',w:76}];
    const st=[[10,'mark','smith','liverpool'],[20,'mary','jane','london']];
    [['Start',['two rows inserted','by the script',''],st,[]],
     ['DELETE',['DELETE FROM Customers','WHERE <tspan style="fill:'+PRC+'">customer_id = 10</tspan>;',''],[st[1]],[]],
     ['UPDATE',['UPDATE Customers',"SET city = 'Milan'",'WHERE <tspan style="fill:'+PRC+'">customer_id = 20</tspan>;'],[[20,'mary','jane','Milan']],[0]],
     ['UPDATE without WHERE',['UPDATE Customers',"SET city = 'Milan';",''],[[10,'mark','smith','Milan'],[20,'mary','jane','Milan']],[0,1]]].forEach(([title,sql,rows,ch])=>{
      let s=sql.map((l,i)=>mono(4,16+i*18,l,{s:12.5,f:title==='Start'?GRAY:'#ddd'})).join('');
      const t=sTab(2,62,C,rows,{bg:i=>ch.includes(i)?(title.includes('without')?BADBG:HLBG):null});
      cell(m,title,'<g transform="translate(43,0)">'+s+t.s+'</g>',300,62+26+2*25+6,title,title==='Start'?'Both customers.':title==='DELETE'?'1 row deleted.':title==='UPDATE'?'1 row updated.':'<span class="bad">2 rows updated:</span> every row.')});
  })();
  /* CASE branches */
  (function(){
    const br=c=>c==='milan'?0:(c==='liverpool'||c==='london')?1:2,lab=['Italy','UK','N/A'],bgc=['rgba(255,255,255,.16)','rgba(255,255,255,.08)',null];
    const t=sTab(4,4,[{t:'customer_id',w:90,a:'e',c:PKC},{t:'last_name',w:84},{t:'city',w:84},{t:'Country',w:76},{t:'branch',w:150,c:PRC}],CUST.map(c=>[c[0],c[2],c[3],{v:lab[br(c[3])],b:1},{v:['WHEN city = \'milan\'','WHEN city IN (...)','ELSE'][br(c[3])],f:PRC}]),{bg:i=>bgc[br(CUST[i][3])]});
    svgBox($('#b2case'),t.w+8,t.h+8,t.s,'CASE query result','34rem');
  })();
  /* a SELECT step by step */
  (function(){
    let s='';const rows=SAL.map(r=>({id:r[0],d:r[1],p:r[3],q:r[4],pr:r[5],a:r[4]*r[5]})),keep=r=>r.p==='xyz';
    const C1=[{t:'id',w:28,a:'e'},{t:'product',w:62},{t:'qty',w:38,a:'e'},{t:'price',w:48,a:'e'}];
    const t1=sTab(2,44,C1,rows.map(r=>[r.id,r.p,r.q,r.pr.toFixed(2)]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    const kept=rows.filter(keep),C2=[{t:'sales_date',w:84},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'amount',w:58,a:'e',c:MSC}];
    const x2=206,t2=sTab(x2,44,C2,kept.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    const sorted=kept.slice().sort((a,b)=>b.q-a.q),x3=x2+238+28;
    const t3=sTab(x3,44,C2,sorted.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    s+=t1.s+t2.s+t3.s+tx(2+88,16,'1. FROM and WHERE',{s:14,f:'#fff',w:500})+tx(2+88,34,'3 of 6 rows kept',{s:13,f:GRAY})+tx(x2+119,16,'2. SELECT list',{s:14,f:'#fff',w:500})+tx(x2+119,34,'4 columns, amount computed',{s:13,f:GRAY})+
      tx(x3+119,16,'3. ORDER BY',{s:14,f:'#fff',w:500})+tx(x3+119,34,'quantity, largest first',{s:13,f:GRAY});
    s+=tx(x2-14,130,'→',{s:20,f:GRAY})+tx(x3-14,130,'→',{s:20,f:GRAY});
    svgBox($('#b2sel'),720,44+t1.h+8,s,'A SELECT query step by step','46rem');
  })();
};
QZ['2a']=()=>[{q:'Which kind of integrity does the constraint <code>CHECK (quantity &gt; 0)</code> protect?',o:['Entity integrity','Referential integrity','Domain integrity','None: CHECK is only a comment'],a:2,
  e:'CHECK, together with data types and NULL constraints, keeps all the values of a column inside the same domain.',h:'Recall the three kinds of integrity and which tool protects each one.'}];
QZ['2b']=()=>[{q:'The table Employee(employee_id, first_name, last_name, dep_code, dep_name, dep_phone) breaks which rule?',
  o:['First normal form, because some values are not atomic','Entity integrity, because duplicates are allowed','Third normal form, because of a transitive dependency','Domain integrity, because phones are text'],a:2,
  e:'Department name and phone depend on the department code, a non-key column, so the table has a transitive dependency and breaks third normal form.',h:'Ask, column by column, what each value depends on.'}];
QZ['2c']=()=>[{q:'On the six course sales, how many rows does <code>WHERE product_name = \'abc\' OR product_name = \'xyz\' AND quantity &gt; 5</code> return?',o:['1','3','6','4'],a:3,
  e:'AND binds tighter than OR, so the condition reads product = \'abc\' OR (product = \'xyz\' AND quantity &gt; 5). The three abc sales pass, plus sale 3 (xyz, 10): four rows.',h:'Evaluate AND before OR, then count the rows that satisfy either side.'}];
QZ['2d']=()=>[{q:'With the CASE query above on the five course customers, how many rows get Country = \'UK\'?',o:['2','1','3','5'],a:2,
  e:'doe and jane live in london, smith in liverpool: three rows match city IN (\'liverpool\', \'london\'). Rossi gets Italy, Bianchi (rome) gets N/A.',h:'Go through the five cities and see which WHEN each one matches first.'}];
QZ['2']=()=>[
  {q:'Which value does <b>not</b> fit in a DECIMAL(5,2) column?',o:['999.99','12.5','1000.5','-45.1'],a:2,
   e:'Five digits in total, two after the point, so at most three before it: 1000.5 needs four.',h:'DECIMAL(precision, scale): precision counts all digits, scale only those after the point.'},
  {q:'In a data warehouse, which tables are kept in third normal form?',o:['The fact tables','The dimensions','Both','Neither: a warehouse is never normalized'],a:0,
   e:'Dimensions are denormalized (first normal form) for simple reading; fact tables, with measures and keys, are normalized (third normal form).',h:'Think about which kind of table is long and thin, made of keys and numbers, and which collects every attribute of one entity.'},
  {q:'On the five course customers, after <code>UPDATE Customers SET city = \'milan\';</code> how many customers live in Milan?',o:['1','5','2','0, the statement is refused'],a:1,
   e:'With no WHERE, UPDATE sets the city of every row: all five customers now live in Milan.',h:'Which part of an UPDATE limits the rows it touches, and is it there?'},
  {q:'In <code>SELECT * FROM Sales WHERE price*quantity &gt; 10</code>, what is the predicate?',o:['price*quantity','WHERE','price*quantity &gt; 10','Sales'],a:2,
   e:'A predicate is a logical condition, true or false for each row; price*quantity alone is an expression, and WHERE is the clause.',h:'Recall the definitions of clause, expression and predicate.'},
  {q:'In the small warehouse of the lesson, which customer does surrogate key cust_key = 1 point to?',o:['Marco Rossi, business key 1','John Doe, business key 2','Mark Smith, business key 3','Mario Bianchi, business key 5'],a:3,
   e:'Surrogate keys follow the load order (Bianchi, Doe, Jane, Rossi, Smith), so key 1 is Mario Bianchi, whose business key is 5.',h:'A surrogate key is created by ETL in load order, not copied from the source.'}
];
