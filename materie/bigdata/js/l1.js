/* Lesson 1: the data analytics timeline */
const ERP1=[[1,'ROSSI MARCO','Milano',0],[2,'DOE JOHN','London',1],[3,'SMITH MARK','Liverpool',2],[4,'JANE MARY','London',3],[5,'BIANCHI MARIO','Roma',4]];
const CRM1=[[101,'Marco','Rossi','Milan',0],[102,'John','Doe','LONDON',1],[103,'Mary','Jane','Manchester',3],[104,'Mary','Jane','London',3],[105,'Mark','Smith','Liverpool',2],[106,'Mario','Bianchi','Rome',4]];
INIT[1]=function(){
  codeHL($('#lezione-1'));
  /* two systems, one customer base */
  (function(){
    const duo=el('div','duo');$('#b1src').append(duo);
    const t1=sTab(6,6,[{t:'id',w:34,a:'e'},{t:'name',w:130},{t:'city',w:88}],ERP1.map(r=>[r[0],r[1],r[2]==='Milano'?{v:r[2],bg:BADBG}:r[2]]));
    cell(duo,'Sales system (ERP)',t1.s,t1.w+12,t1.h+12,'ERP customer table','Searching for the city \'Milan\' finds <span class="bad">0</span> customers. Counting records gives 5.');
    const t2=sTab(6,6,[{t:'id',w:40,a:'e'},{t:'first',w:58},{t:'last',w:64},{t:'city',w:92}],CRM1.map(r=>[r[0],r[1],r[2],r[0]===103?{v:r[3],bg:BADBG}:r[3]]),{bg:i=>CRM1[i][4]===3?HLBG:null});
    cell(duo,'Customer system (CRM)',t2.s,t2.w+12,t2.h+12,'CRM contact table','Searching for \'Milan\' finds 1. Counting records gives <span class="bad">6</span>: Mary Jane appears twice, in two cities.');
  })();
  /* timeline: five phases, one layer each */
  (function(){
    const ph=[['1980s','Operational DBs','Static reports'],['1990s','Data warehouse','Static reports'],['late 1990s','OLAP','Dynamic reports'],['2000s','Data mining','Predictive analytics'],['2012 onwards','Hadoop, Spark','Big Data platforms']];
    let s=line(20,206,680,206,'#555',2);
    ph.forEach((p,k)=>{const cx=70+k*140;
      for(let j=0;j<=k;j++){const y=170-j*32,top=j===k;
        s+=rect(cx-62,y,124,28,top?'#6db9f4':'#17303d',top?'#6db9f4':'#2c5468')+tx(cx,y+19,ph[j][1],{s:13,f:top?'#000':'#cfe6f5'})}
      s+='<circle cx="'+cx+'" cy="206" r="6" fill="#6db9f4"/>'+tx(cx,232,'Phase '+(k+1),{s:14,f:'#fff',w:500})+tx(cx,252,p[0],{s:13,f:GRAY})+tx(cx,272,p[2],{s:13,f:GRAY})});
    svgBox($('#b1time'),700,284,s,'Five phases of the data analytics timeline, each adding a layer','44rem');
  })();
  /* three reports of the same six sales */
  (function(){
    const trio=el('div','trio');$('#b1rep').append(trio);
    const rows=SAL.map(r=>({d:r[1],p:r[3],q:r[4],a:r[4]*r[5]}));const days=[...new Set(rows.map(r=>r.d))];
    const sh=d=>d.slice(5);
    const op=[];days.forEach(d=>{const ds=rows.filter(r=>r.d===d);ds.forEach(r=>op.push([sh(r.d),r.p,r.q,{v:fe(r.a),f:MSC}]));
      op.push([{v:sh(d),f:GRAY},{v:'total',f:GRAY},{v:ds.reduce((a,r)=>a+r.q,0),f:GRAY},{v:fe(ds.reduce((a,r)=>a+r.a,0)),f:MSC,b:1}])});
    const C4=[{t:'date',w:56},{t:'product',w:62},{t:'qty',w:38,a:'e'},{t:'amount',w:66,a:'e'}];
    let t=sTab(4,4,C4,op,{bg:i=>(i%3===2)?HLBG:null,fs:13});cell(trio,'Operational',t.s,t.w+8,t.h+8,'Operational report','Every sale plus daily subtotals: 9 lines. Built every day.');
    const ta=days.map(d=>{const ds=rows.filter(r=>r.d===d);return [sh(d),ds.length,ds.reduce((a,r)=>a+r.q,0),{v:fe(ds.reduce((a,r)=>a+r.a,0)),f:MSC}]});
    t=sTab(4,4,[{t:'date',w:56},{t:'sales',w:50,a:'e'},{t:'qty',w:50,a:'e'},{t:'amount',w:66,a:'e'}],ta,{fs:13});cell(trio,'Tactical',t.s,t.w+8,t.h+8,'Tactical report','One line per day: 3 lines. Built daily or weekly.');
    t=sTab(4,4,[{t:'period',w:70},{t:'sales',w:44,a:'e'},{t:'qty',w:42,a:'e'},{t:'amount',w:66,a:'e'}],[['Sep 2018',6,26,{v:'43.4',f:MSC}]],{fs:13});cell(trio,'Strategic',t.s,t.w+8,t.h+8,'Strategic report','One line for the period. Built weekly or monthly.');
  })();
  /* illustrative workload model */
  (function(){
    const trio=el('div','trio');const root=$('#b1load');root.append(legend([[BLUE,'time to save one order','box'],[RED,'above 15 ms','box']]),trio);
    const rnd=(()=>{let x=7;return()=>{x=(x*16807)%2147483647;return x/2147483647}})(),jit=Array.from({length:12},()=>0.6+0.8*rnd());
    [['No reports',0.3],['8 reports on the same server',0.82],['8 reports on a copy',0.3]].forEach(([title,u])=>{
      const mean=4/(1-u),W=230,H=180,L=34,B=150,T=12,Y=v=>B-v/40*(B-T);let s='';
      [0,10,20,30,40].forEach(v=>{s+=line(L,Y(v),W-6,Y(v),'#222',1)+tx(L-6,Y(v)+4,v,{s:13,f:GRAY,a:'end'})});
      const avg=jit.reduce((a,j)=>a+Math.min(39.5,mean*j),0)/jit.length;s+=tx(12,(T+B)/2,'ms',{s:13,f:GRAY,x:' transform="rotate(-90 12 '+(T+B)/2+')"'});
      jit.forEach((j,i)=>{const v=Math.min(39.5,mean*j),bw=(W-6-L)/12;s+=rect(L+i*bw+2,Y(v),bw-4,B-Y(v),v>15?RED:BLUE)});
      s+=line(L,B,W-6,B,'#777',1.5)+tx((L+W)/2,B+20,'incoming orders',{s:13,f:GRAY});
      cell(trio,title,s,W,H,title,'Average <b>'+fe(avg,1)+' ms</b> per order.')});
  })();
  /* ETL: staging, transformed, warehouse */
  (function(){
    const W=720,H=372;let s='';
    [[0,'Staging area (extract)'],[244,'Transformed'],[488,'Data warehouse (load)']].forEach(([x,t])=>{s+=rect(x+2,30,228,H-34,'#0b0b0b','#2a2a2a')+tx(x+116,20,t,{s:14,f:GRAY})});
    const all=ERP1.map(r=>({src:'ERP',raw:r[0]+' · '+r[1]+' · '+r[2],clean:capw(r[1].split(' ')[1].toLowerCase())+' '+capw(r[1].split(' ')[0].toLowerCase())+' · '+({Milano:'Milan',Roma:'Rome'}[r[2]]||r[2]),p:r[3],id:r[0]}))
      .concat(CRM1.map(r=>({src:'CRM',raw:r[0]+' · '+r[1]+' '+r[2]+' · '+r[3],clean:r[1]+' '+r[2]+' · '+capw(r[3].toLowerCase()),p:r[4],id:r[0],drop:r[0]===103})));
    const wy=p=>70+p*62;
    all.forEach((c,j)=>{const y=54+j*28;s+=tx(10,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(46,y+5,esc(c.raw),{s:13,a:'start',f:'#fff'})});
    const ord=all.slice().sort((a,b)=>a.p-b.p||(a.src<b.src?1:a.src>b.src?-1:a.id-b.id));
    ord.forEach((c,j)=>{const y=54+j*28;
      s+=tx(254,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(290,y+5,esc(c.clean),{s:13,a:'start',f:c.drop?RED:'#fff',x:c.drop?' text-decoration="line-through"':''});
      if(!c.drop)s+=line(458,y,496,wy(c.p)-4,'#666',1.2);
    });
    [0,1,2,3,4].forEach(p=>{const e=ERP1.find(r=>r[3]===p),c=CRM1.find(r=>r[4]===p&&r[0]!==103),cl=all.find(a=>a.src==='ERP'&&a.p===p).clean;
      s+=tx(508,wy(p),p+1,{s:15,f:PKC,w:600})+tx(524,wy(p),esc(cl),{s:14,a:'start',f:'#fff'})+tx(524,wy(p)+19,'ERP id '+e[0]+' · CRM id '+c[0],{s:12.5,a:'start',f:GRAY})});
    svgBox($('#b1etl'),W,H,s,'ETL from two sources into one warehouse table','46rem');
  })();
  /* the cube, one slice per date, and a pivot */
  (function(){
    const cities=['Milan','London','Liverpool'],prods=['abc','xyz'],dates=['2018-09-01','2018-09-02','2018-09-03'];
    const cityOf=id=>capw(CUST.find(c=>c[0]===id)[3]);
    const q=(c,p,d)=>SAL.filter(r=>cityOf(r[2])===c&&r[3]===p&&(!d||r[1]===d)).reduce((a,r)=>a+r[4],0);
    let s='';const cw=46,rh=30,y0=64;
    cities.forEach((c,i)=>{s+=tx(76,y0+i*rh+20,c,{s:13.5,a:'end',f:'#fff'})});
    dates.forEach((d,k)=>{const x=86+k*(2*cw+20);s+=tx(x+cw,22,d.slice(5),{s:13.5,f:GRAY});
      prods.forEach((p,j)=>{s+=tx(x+j*cw+cw/2,y0-8,p,{s:13,f:GRAY})});
      cities.forEach((c,i)=>prods.forEach((p,j)=>{const v=q(c,p,d);s+=rect(x+j*cw,y0+i*rh,cw,rh,v?'rgba(88,196,221,.22)':'#0d0d0d','#333')+(v?tx(x+j*cw+cw/2,y0+i*rh+20,v,{s:14,f:MSC}):'')}))});
    s+=tx(86+(2*cw+20)*1.5-10,y0+3*rh+28,'one slice per date (quantity)',{s:13,f:GRAY});
    const px=436;s+=tx(px+20,y0+rh*1.5+8,'→',{s:22,f:GRAY});
    const pr=cities.map(c=>[c,{v:q(c,'abc'),f:MSC},{v:q(c,'xyz'),f:MSC},{v:q(c,'abc')+q(c,'xyz'),f:MSC,b:1}]);
    pr.push([{v:'total',f:GRAY},{v:8,f:MSC,b:1},{v:18,f:MSC,b:1},{v:26,f:MSC,b:1}]);
    const t=sTab(px+44,y0-26,[{t:'city',w:76},{t:'abc',w:44,a:'e'},{t:'xyz',w:44,a:'e'},{t:'total',w:52,a:'e'}],pr,{rh:28,bg:i=>i===3?HLBG:null});
    s+=t.s+tx(px+44+108,y0+4*28+30,'pivot: dates added up',{s:13,f:GRAY});
    svgBox($('#b1olap'),720,226,s,'Sales cube sliced by date and a pivot by city and product','46rem');
  })();
  /* simulated sales and forecast */
  (function(){
    const N=36,now=24;let x=11;const rnd=()=>{x=(x*16807)%2147483647;return x/2147483647};
    const y=Array.from({length:N},(_,t)=>100+1.6*t+16*Math.sin(2*Math.PI*(t-2)/12)+(rnd()-.5)*12);
    const W=700,H=300,L=56,R=686,T=14,B=250,X=t=>L+t/(N-1)*(R-L),Y=v=>B-(v-60)/(200-60)*(B-T);let s='';
    for(let v=60;v<=200;v+=35)s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'});
    for(let t=0;t<N;t+=6)s+=tx(X(t),B+20,t+1,{s:13,f:GRAY});
    s+=tx((L+R)/2,H-6,'month',{s:13,f:GRAY})+tx(14,(T+B)/2,'sales, thousand units',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    const k=now-1,m1=y.slice(now-12,now).reduce((a,b)=>a+b)/12,m0=y.slice(now-24,now-12).reduce((a,b)=>a+b)/12,dr=m1-m0;
    const f=[{t:k,v:y[k],w:0}];for(let h=1;h<=6;h++)f.push({t:k+h,v:y[k+h-12]+dr,w:6+2.5*h});
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v+p.w).toFixed(1)).join('')+f.slice().reverse().map(p=>'L'+X(p.t).toFixed(1)+' '+Y(p.v-p.w).toFixed(1)).join('')+'Z" fill="'+ORG+'" fill-opacity=".18"/>';
    s+='<path d="'+y.slice(0,now).map((v,t)=>(t?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/>';
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v).toFixed(1)).join('')+'" fill="none" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
    s+=line(X(k),T,X(k),B,'#fff',1,' stroke-dasharray="3 4"')+lbl(X(k),T+12,'today','#fff');
    const r=$('#b1fc');r.append(legend([[BLUE,'known past: descriptive'],[ORG,'forecast and uncertainty band: predictive','dash']]));
    svgBox(r,W,H,s,'Monthly sales with a six month forecast','44rem');
  })();
  /* a post: what you see and what is stored */
  (function(){
    const root=$('#b1post'),duo=el('div','duo');root.append(legend([['#fff','key/value pair, fits a column','box'],[GRAY,'free content, no fixed structure','box']]),duo);
    const S='color:#fff',U='color:#8c8c8c;font-style:italic';
    const a=el('div');a.append(el('h4','','What you see'));
    a.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:var(--sans);line-height:1.6;display:flex;flex-direction:column;gap:.5rem;width:100%">'+
      '<div style="display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap"><b style="'+S+'">Milano Bites</b><span style="'+S+'">30 Sep 2026, 18:42</span></div>'+
      '<span style="'+S+'">Milan, Italy</span><span style="'+U+'">Best risotto in town tonight, the saffron was unreal! Queue was long but worth it.</span>'+
      '<svg viewBox="0 0 200 64" style="max-width:200px"><rect width="200" height="64" fill="#1d1d1d"/><circle cx="58" cy="34" r="18" fill="#8c8c8c"/><path d="M110 54L140 18L174 54Z" fill="#555"/></svg>'+
      '<span style="'+S+'">♥ 128</span></div>'));
    const b=el('div');b.append(el('h4','','What is stored'));
    const kv=(k,v,u,last)=>'<div style="padding-left:1.4em;text-indent:-1.2em;'+(u?U:S)+'">"'+k+'": '+v+(last?'':',')+'</div>';
    b.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:ui-monospace,Menlo,monospace;font-size:.82rem;line-height:1.75;width:100%;overflow-wrap:anywhere">{'+
      kv('author','"@milano_bites"')+kv('created_at','"2026-09-30T18:42:00Z"')+kv('location','"Milan, IT"')+kv('text','"Best risotto in town tonight, the saffron..."',1)+kv('media','["photo_8841.jpg"]',1)+kv('likes','128',0,1)+'}</div>'));
    duo.append(a,b);
    root.append(el('div','cellnote','Author, date, place and likes are labeled values; the text and the picture are not. One object mixing both is <b>semi-structured</b>.'));
  })();
};
QZ['1a']=()=>[{q:'With the six course sales, a tactical report shows the total amount per day. What does it show for 2 September 2018?',o:['15','43.4','23','11.5'],a:2,
  e:'On 2 September there are two sales: 10 units of xyz at 1.5 (15) and 4 units of abc at 2 (8), so 15 + 8 = 23.',h:'Take only the rows dated 2018-09-02 and add quantity times price for each.'}];
QZ['1b']=()=>[{q:'A company copies its operational database to a second server every night and runs all reports there, changing nothing else. Which problem does this solve?',
  o:['The same city is written in two different ways in the ERP and in the CRM.','The CRM keeps an old address next to the new one for the same customer.','Heavy reports slow down the insertion of new orders.','None of the three.'],a:2,
  e:'A copy on another server removes the competition between massive reads and writes, which is how the first data warehouses started. It does nothing about formats or versions, because it copies them too.',
  h:'A copy contains the same values as the original. Which of the problems is about the values, and which about the machine?'}];
QZ['1c']=()=>[{q:'Compared with querying the data warehouse in SQL, what does OLAP add?',
  o:['It predicts next month\'s values from the historical ones.','The user can aggregate along dimensions without knowing the table relationships, and aggregates come back faster.','It removes the need for ETL, since it reads the operational databases directly.','It stores the data in normalized tables.'],a:1,
  e:'OLAP combines data with metadata, so the user does not need to know how tables relate, and it answers aggregate questions much faster than a relational database.',
  h:'Think about what a user had to know in phase 2 to get a total by city, and what changes when the engine already knows how the tables connect.'}];
QZ['1']=()=>[
  {q:'In which step of ETL are business rules and data quality checks applied?',o:['Extract','Transform','Load','In the OLAP client, after loading'],a:1,
   e:'ETL extracts the data, transforms them with business rules and data quality checks, then loads them.',h:'Recall what each of the three steps does to the data.'},
  {q:'In the pivot of the OLAP figure, what is the total quantity bought by London customers?',o:['6','3','10','9'],a:3,
   e:'London customers bought abc twice (2 and 4) and xyz once (3): 2 + 4 + 3 = 9.',h:'Find the London sales in the three date slices and add their quantities.'},
  {q:'Which of these is the lecture\'s example of semi-structured data?',o:['A tweet','The invoice table of an ERP','An X-ray image','A printed strategic report'],a:0,
   e:'A post mixes free text with key/value pairs such as author, date and location: that is what semi-structured means.',h:'Look for the item that contains both free content and labeled fields.'},
  {q:'Which of these is predictive rather than descriptive analytics?',o:['A monthly report of sales by region','An OLAP pivot of last year\'s margins','An estimate of next month\'s energy cost','A dashboard of yesterday\'s orders'],a:2,
   e:'Estimating the likelihood of a future value is predictive; the other three summarize what already happened.',h:'Recall the lecture\'s split: one kind of analytics describes, the other estimates.'},
  {q:'Which definition of Big Data does the lecturer prefer to the three V?',o:['Any data set larger than one terabyte','Data produced by social networks','Data stored in Hadoop','Data we cannot analyze, or have no convenience to analyze, with traditional tools'],a:3,
   e:'The preferred definition is relative to the tools: data we cannot analyze, or have no convenience to analyze, with traditional tools such as relational databases.',h:'The lecturer prefers a definition that does not depend on a fixed size or source.'}
];
