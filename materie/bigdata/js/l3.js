/* Lesson 3: how do you combine two tables */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  /* cartesian product with the ON predicate */
  (function(){
    let s='';const x0=150,cw=106,y0=58,rh=42;
    BSL.forEach((sl,j)=>{const x=x0+j*cw+cw/2;s+=tx(x,20,'qty '+sl[2],{s:13.5,f:GRAY})+tx(x,40,'buyer_id '+sl[0],{s:13.5,f:FKC})});
    BUY.forEach((b,i)=>{const y=y0+i*rh;s+=tx(x0-12,y+18,b[0],{s:14,a:'end',f:'#fff'})+tx(x0-12,y+35,'buyer_id '+b[1],{s:13,a:'end',f:PKC});
      BSL.forEach((sl,j)=>{const m=b[1]===sl[0],x=x0+j*cw;s+=rect(x+4,y+3,cw-8,rh-6,m?'rgba(255,134,47,.85)':'#141414',m?PRC:'#2a2a2a')+tx(x+cw/2,y+26,b[1]+' = '+sl[0],{s:14,f:m?'#000':'#666'})})});
    svgBox($('#b3cart'),720,y0+4*rh+8,s,'Cartesian product of buyers and sales','46rem');
    $('#b3cart').append(el('div','cellnote','20 pairs, 5 with a true predicate. Lucy Thin\'s row has no orange cell: she bought nothing.'));
  })();
  /* four joins */
  (function(){
    const duo=el('div','duo'),root=$('#b3joins');root.append(legend([[PUR,'NULL: no partner found','box']]),duo);
    const sales=BSL.concat([[9,4,7]]),C=[{t:'buyer_name',w:84},{t:'b.id',w:42,a:'e',c:PKC},{t:'s.id',w:42,a:'e',c:FKC},{t:'qty',w:48,a:'e'}];
    const inner=[];BUY.forEach(b=>sales.forEach(sl=>{if(b[1]===sl[0])inner.push([b[0],b[1],sl[0],sl[2]])}));
    const lostB=BUY.filter(b=>!sales.some(sl=>sl[0]===b[1])).map(b=>[b[0],b[1],null,null]);
    const lostS=sales.filter(sl=>!BUY.some(b=>b[1]===sl[0])).map(sl=>[null,null,sl[0],sl[2]]);
    const maxRows=inner.length+lostB.length+lostS.length;
    [['INNER JOIN',inner,'only matching pairs'],['LEFT OUTER JOIN',inner.concat(lostB),'every buyer kept'],['RIGHT OUTER JOIN',inner.concat(lostS),'every sale kept'],['FULL OUTER JOIN',inner.concat(lostB,lostS),'both sides kept']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows,{bg:i=>i>=inner.length?'rgba(202,163,232,.16)':null});
      tabCell(duo,title,t,'<b>'+rows.length+' rows:</b> '+note+'.',330,'',26+maxRows*25+8)});
  })();
  /* UNION and UNION ALL */
  (function(){
    const duo=el('div','duo');$('#b3union').append(duo);const C=[{t:'id',w:40,a:'e'},{t:'descr',w:60},{t:'from',w:70}];
    [['UNION',[[1,'a','t1 and t2'],[2,'b','t1'],[3,'c','t2']],'3 rows: the duplicate is removed.'],['UNION ALL',[[1,'a','t1'],[2,'b','t1'],[1,'a','t2'],[3,'c','t2']],'4 rows: the duplicate stays.']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows.map(r=>[r[0],r[1],{v:r[2],f:GRAY}]),{bg:i=>rows[i][0]===1?HLBG:null});tabCell(duo,title,t,note,330,'',26+4*25+8)});
  })();
  /* three valued logic and a left join */
  (function(){
    let s='';const V=v=>v===null?{v:'UNKNOWN',f:NLC}:v?{v:'TRUE',f:GRN}:{v:'FALSE',f:RED};
    const t1=sTab(4,30,[{t:'comparison',w:130},{t:'outcome',w:90}],[['5 &gt; 2',V(true)],['1 = 1',V(true)],[{v:'NULL &gt; 99'},V(null)],[{v:'NULL = NULL'},V(null)],[{v:'5 &lt;&gt; NULL'},V(null)]]);
    s+=t1.s+tx(114,18,'Comparisons',{s:14,f:'#fff',w:500});
    const rows=[];CUST.forEach(c=>{const ss=SAL.filter(r=>r[2]===c[0]);if(ss.length)ss.forEach(r=>rows.push([c[2],r[2],r[3],r[4]]));else rows.push([c[2],null,null,null])});
    const C=[{t:'last_name',w:78},{t:'s.cust_id',w:66,a:'e',c:FKC},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'= NULL',w:82,a:'m',c:PRC},{t:'IS NULL',w:66,a:'m',c:PRC}];
    const t2=sTab(262,30,C,rows.map(r=>[r[0],r[1],r[2],r[3],V(null),V(r[1]===null)]),{bg:i=>rows[i][1]===null?'rgba(202,163,232,.16)':null});
    s+=t2.s+tx(262+194,18,'Customers c LEFT JOIN Sales s',{s:14,f:'#fff',w:500});
    svgBox($('#b3null'),720,30+t2.h+8,s,'Three valued logic and a left join','46rem');
    $('#b3null').append(el('div','cellnote','<code>WHERE s.customer_id = NULL</code> keeps <span class="bad">0</span> rows: every row is UNKNOWN. <code>WHERE s.customer_id IS NULL</code> keeps <span class="ok">1</span>: Bianchi, the customer with no sales.'));
  })();
  /* how GROUP BY works */
  (function(){
    const rows=[[43659,29825],[43660,29672],[43661,29734],[43662,29994],[43663,29565],[51803,30097],[69427,30097],[44529,30098],[46063,30098],[75123,18759]];
    const keep=r=>r[1]===30097||r[1]===30098;let s='';
    const C=[{t:'OrderID',w:70,a:'e'},{t:'CustomerID',w:86,a:'e'}];
    const t1=sTab(4,30,C,rows.map(r=>[r[0],{v:r[1],f:keep(r)?'#fff':GRAY}]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    s+=t1.s+tx(82,18,'Orders',{s:14,f:'#fff',w:500});
    s+=tx(222,104,'WHERE',{s:13.5,f:PRC})+tx(222,122,'CustomerID IN',{s:13,f:PRC})+tx(222,140,'(30097, 30098)',{s:13,f:PRC})+tx(222,166,'→',{s:20,f:GRAY});
    const g=[[[51803,30097],[69427,30097]],[[44529,30098],[46063,30098]]];
    g.forEach((gr,k)=>{const y=60+k*110;const t=sTab(306,y,C,gr);s+=t.s+'<path d="M300 '+(y+30)+'h-6v'+(t.h-30)+'h6" fill="none" stroke="'+MSC+'" stroke-width="2"/>'});
    s+=tx(384,46,'GROUP BY CustomerID',{s:13.5,f:'#fff',w:500});
    s+=tx(520,166,'COUNT(*)',{s:13.5,f:MSC})+tx(520,188,'→',{s:20,f:GRAY});
    const t3=sTab(560,124,[{t:'CustomerID',w:86,a:'e'},{t:'COUNT(*)',w:70,a:'e',c:MSC}],[[30097,{v:2,f:MSC}],[30098,{v:2,f:MSC}]]);
    s+=t3.s+tx(638,112,'Result',{s:14,f:'#fff',w:500});
    svgBox($('#b3group'),720,30+t1.h+8,s,'How GROUP BY works','46rem');
  })();
  /* HAVING with and without WHERE */
  (function(){
    const duo=el('div','duo'),root=$('#b3having');root.append(legend([[GRN,'product that passes HAVING','box'],['#555','product filtered out','box'],[PRC,'HAVING SUM(quantity) &gt; 60']]),duo);
    const names={1:'Chai',2:'Chang',3:'Aniseed Syrup',4:'Cajun'};
    [['All items',0],['WHERE quantity &gt; 10',10]].forEach(([title,w])=>{
      const W=340,L=104,R=318,X=v=>L+v/80*(R-L);let s='';
      [0,20,40,60,80].forEach(v=>{s+=line(X(v),10,X(v),182,'#222',1)+tx(X(v),200,v,{s:13,f:GRAY})});
      [1,2,3,4].forEach((p,i)=>{const its=ITEMS.filter(it=>it[1]===p&&it[2]>w),sum=its.reduce((a,it)=>a+it[2],0),ok=sum>60,y=20+i*42;
        s+=tx(L-8,y+19,names[p],{s:13.5,a:'end',f:'#fff'})+rect(L,y+2,X(sum)-L,26,ok?GRN:'#555')+lbl(X(sum)+6,y+20,sum,ok?GRN:GRAY,{a:'start'})});
      s+=line(X(60),6,X(60),186,PRC,2.5)+tx((L+R)/2,218,'total quantity',{s:13,f:GRAY});
      cell(duo,title,s,W,226,title,w?'Only <b>Cajun (65)</b> passes: its items are large.':'<b>Chang (71)</b> and <b>Cajun (65)</b> pass.')});
  })();
  /* self-contained versus correlated subquery */
  (function(){
    const duo=el('div','duo');$('#b3subq').append(duo);
    const rows=ORD.slice().sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]-b[1]);const max=rows.reduce((m,r)=>r[0]>m?r[0]:m,'');
    const last=cid=>rows.filter(r=>r[1]===cid).reduce((m,r)=>r[0]>m?r[0]:m,'');
    let t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'inner result',w:96,c:MSC}],rows.map(r=>[r[2],r[0],{v:max,f:MSC}]),{bg:i=>rows[i][0]===max?OKBG:null,op:i=>rows[i][0]===max?1:.45});
    cell(duo,'Self-contained: runs once',t.s,t.w+8,t.h+8,'Self-contained subquery','<b>1 row:</b> Anders, who placed the last order (2018-07-15).');
    t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'inner result',w:96,c:MSC}],rows.map(r=>[r[2],r[0],{v:last(r[1]),f:MSC}]),{bg:i=>rows[i][0]===last(rows[i][1])?OKBG:null,op:i=>rows[i][0]===last(rows[i][1])?1:.45});
    cell(duo,'Correlated: runs once per order',t.s,t.w+8,t.h+8,'Correlated subquery','<b>2 rows:</b> the last order of each customer.');
  })();
  /* four window functions */
  (function(){
    const duo=el('div','duo'),root=$('#b3win');root.append(legend([[WNC,'rows in the window of the marked row','box'],['#fff','marked row','dash']]),duo);
    const C=[{t:'name',w:68},{t:'date',w:50},{t:'amount',w:66,a:'e'},{t:'',w:84,a:'e',c:WNC}];
    const byDate=ORD.slice();const part=cid=>byDate.filter(r=>r[1]===cid);
    const panel=(title,colname,rows,vals,winOf,mark,extra,note)=>{const cc=C.map((c,j)=>j===3?{...c,t:colname}:c);
      const t=sTab(4,4,cc,rows.map((r,i)=>[r[2],r[0].slice(5),fe(r[3]),{v:fe(vals[i]),f:WNC}]),{bg:i=>i===mark?'rgba(92,208,179,.45)':winOf.includes(i)?WINBG:null});
      let s=t.s+(mark>=0?rect(4,4+26+mark*25,t.w,25,'none','#fff',' stroke-width="1.5" stroke-dasharray="4 3"'):'')+(extra||'');
      cell(duo,title,s,t.w+40,t.h+8,title,note)};
    /* ROW_NUMBER over amount descending */
    const rn=[1,2].flatMap(c=>part(c).slice().sort((a,b)=>b[3]-a[3]));const rnv=rn.map(r=>rn.filter(x=>x[1]===r[1]).indexOf(r)+1);
    panel('ROW_NUMBER()','rn',rn,rnv,[],-1,'','ORDER BY TotalAmount DESC: rn = 1 is each customer\'s largest order.');
    /* LAG */
    const lag=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return k?p[k-1][3]:0});
    let ar='<defs>'+arrowDef('b3la',GRAY)+'</defs>';byDate.forEach((r,i)=>{const p=part(r[1]),k=p.indexOf(r);if(k){const y1=4+26+(i-1)*25+13,y2=y1+25;ar+='<path d="M'+(4+186)+' '+(y1-2)+' L'+(4+206)+' '+(y2-4)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2" marker-end="url(#b3la)"/>'}});
    panel('LAG(TotalAmount, 1, 0)','Previous',byDate,lag,[],-1,ar,'Each row gets the previous amount of the same customer; the first gets the default 0.');
    /* moving average and running total */
    const avg=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r),w=p.slice(Math.max(0,k-2),k+1);return w.reduce((a,x)=>a+x[3],0)/w.length});
    panel('AVG, 2 PRECEDING to CURRENT ROW','MovingAvg',byDate,avg,[0,1],2,'','Window of Anders\' third order: his first three orders, average 974.6.');
    const run=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return p.slice(0,k+1).reduce((a,x)=>a+x[3],0)});
    panel('SUM, UNBOUNDED PRECEDING','RunningTotal',byDate,run,[0,1,2],3,'','Window of Anders\' fourth order: all his orders so far, total 3549.');
  })();
};
QZ['3a']=()=>[{q:'After <code>Customers c LEFT JOIN Sales s ON c.customer_id = s.customer_id</code>, how many rows does <code>WHERE s.customer_id = NULL</code> keep?',
  o:['1, Bianchi, who has no sales','7','0','An error is raised'],a:2,
  e:'s.customer_id = NULL is UNKNOWN on every row, Bianchi\'s included, and WHERE drops UNKNOWN: zero rows. IS NULL would return Bianchi.',h:'What does comparing anything with NULL using = return, and which outcomes does WHERE keep?'}];
QZ['3b']=()=>[{q:'Same moving average. What is its value on Anders\' fourth order (625.2)?',o:['974.6','1036.33','887.25','625.2'],a:1,
  e:'The window holds his orders 2, 3 and 4: (1813 + 670.8 + 625.2) / 3 = 1036.33.',h:'Work out which of his orders fall in the window of the fourth one, then average them.'}];
QZ['3']=()=>[
  {q:'With the lecture\'s buyers and sales (no extra sale), how many rows does <code>buyers LEFT OUTER JOIN sales</code> return?',o:['4','5','6','20'],a:2,
   e:'Adam and Pil have two sales each, Eva one, and Lucy none but still one row with NULLs: 2 + 2 + 1 + 1 = 6.',h:'Count the result rows buyer by buyer; a buyer with no sales still appears once.'},
  {q:'With t1 = {(1,\'a\'), (2,\'b\')} and t2 = {(1,\'a\'), (3,\'c\')}, how many rows do UNION and UNION ALL return?',o:['4 and 4','3 and 3','2 and 4','3 and 4'],a:3,
   e:'Both tables contain (1, \'a\'): UNION ALL keeps all four rows, UNION removes the duplicate and returns three.',h:'Write out the four rows and look for one that appears in both tables.'},
  {q:'Why can\'t you write <code>WHERE SUM(quantity) &gt; 60</code> to keep the products sold in more than 60 units?',
   o:['Because WHERE filters rows before the aggregation, when the sums do not exist yet.','Because SUM ignores NULL values.','Because SUM can only appear in ORDER BY.','You can: WHERE and HAVING are interchangeable.'],a:0,
   e:'WHERE runs before grouping and cannot see aggregates. A condition on SUM goes in HAVING, which runs after GROUP BY.',h:'Think about the order in which the clauses are processed.'},
  {q:'<code>WHERE o.orderdate = (SELECT MAX(orderdate) FROM Orders o2 WHERE o2.customerid = o.customerid)</code> contains which kind of subquery?',o:['Self-contained','An EXISTS test','Table-valued','Correlated'],a:3,
   e:'The inner query uses o.customerid from the outer row, so it is correlated and evaluated again for each outer row.',h:'Look for a column of the outer query used inside the inner one.'},
  {q:'In the lecture\'s LAG example, what is PreviousPurchase on Trujillo\'s order of 1444.8?',o:['1863.4','3730','0','2490.5'],a:1,
   e:'Trujillo\'s orders in date order are 1863.4, 3730, 1444.8, 2490.5. On the third, LAG(TotalAmount, 1, 0) returns the second: 3730.',h:'LAG with n = 1 looks one row back inside the same partition, in OrderDate order.'}
];
