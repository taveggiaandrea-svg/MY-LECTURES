/* Lesson 4: the Big Data toolbox */
INIT[4]=function(){
  codeHL($('#lezione-4'));
  /* nodes, racks, clusters */
  (function(){
    const trio=el('div','trio');$('#b4clus').append(legend([['#e6e6e6','block of 0.25 TB','box'],['#9a9a9a','active node']]),trio);
    [1,4,16].forEach(n=>{let s='';const racks=2;
      for(let r=0;r<racks;r++){const rx=8+r*114;s+=rect(rx,8,106,212,'none','#444')+tx(rx+53,238,'rack '+(r+1),{s:13,f:GRAY});
        for(let k=0;k<8;k++){const id=r*8+k,on=id<n,y=14+k*25.5;s+=rect(rx+5,y,96,21,on?'#1c1c1c':'#0d0d0d',on?'#9a9a9a':'#262626');
          if(on){const mine=Math.ceil((40-id)/n)>0?[...Array(40).keys()].filter(b=>b%n===id).length:0;
            for(let b=0;b<Math.min(mine,mine>10?7:10);b++)s+=rect(rx+9+b*9,y+5,6,11,'#e6e6e6');if(mine>10)s+=tx(rx+98,y+15,'×'+mine,{s:12.5,a:'end',f:'#e6e6e6'})}}}
      const k=Math.ceil(40/n),h=k*0.5;
      cell(trio,n+(n>1?' nodes':' node'),s,236,246,n+' nodes',k+' block'+(k>1?'s':'')+' on the busiest node: <b>'+(h>=1?fe(h,1)+' hours':Math.round(h*60)+' minutes')+'</b>.')});
  })();
  /* eventual consistency at three moments */
  (function(){
    const root=$('#b4base');root.append(legend([[GRN,'up to date','box'],[RED,'outdated value','box'],['#fff','replication message']]));
    let s='<defs>'+arrowDef('b4m','#fff')+'</defs>';
    const titles=['1. Write on node 1','2. Read on node 3','3. After replication'],notes=['Node 1 confirms at once:','Node 3 answers with the old','All replicas agree:'],notes2=['basically available','value: soft state','eventual consistency'];
    [[['London','Liverpool','Liverpool'],[],'write: city = London',''],[['London','Liverpool','Liverpool'],[[0,1],[0,2]],'','read → Liverpool'],[['London','London','London'],[],'','']].forEach(([v,msg,w,rd],ix)=>{
      const ox=ix*242,N=[[ox+58,74,'Node 1'],[ox+182,74,'Node 2'],[ox+120,170,'Node 3']];
      s+=tx(ox+120,18,titles[ix],{s:14.5,f:'#fff',w:500});
      [[0,1],[0,2],[1,2]].forEach(([a,b])=>s+=line(N[a][0],N[a][1],N[b][0],N[b][1],'#333',1.5));
      msg.forEach(([a,b])=>{const x1=N[a][0],y1=N[a][1],x2=N[b][0],y2=N[b][1];s+='<line x1="'+(x1+(x2-x1)*.42)+'" y1="'+(y1+(y2-y1)*.42)+'" x2="'+(x1+(x2-x1)*.62)+'" y2="'+(y1+(y2-y1)*.62)+'" stroke="#fff" stroke-width="2.5" marker-end="url(#b4m)"/>'});
      N.forEach(([x,y,l],j)=>{const ok=v[j]===v[0];s+=rect(x-52,y-23,104,46,'#0d0d0d',ok?GRN:RED,' stroke-width="2"')+tx(x,y-5,l,{s:13,f:GRAY})+tx(x,y+15,v[j],{s:14.5,f:ok?'#fff':RED})});
      if(w)s+=lbl(ox+8,42,w,'#fff',{s:13,a:'start'});if(rd)s+=lbl(ox+120,212,rd,RED,{s:13});
      s+=tx(ox+120,240,notes[ix],{s:13.5,f:GRAY})+tx(ox+120,258,notes2[ix],{s:13.5,f:'#fff',w:600});
    });
    svgBox(root,724,266,s,'Eventual consistency at three moments','46rem');
  })();
  /* one customer in four NoSQL models */
  (function(){
    const duo=el('div','duo');$('#b4models').append(duo);
    let t=sTab(4,4,[{t:'key',w:120,c:PKC},{t:'value',w:120}],[[{v:'first_name',f:PKC},'Mary'],[{v:'last_name',f:PKC},'Smith'],[{v:'city',f:PKC},'Liverpool'],[{v:'street_address',f:PKC},'123, Main St.']],{rh:28});
    tabCell(duo,'Key-value',t,'Just pairs, found by key. Tools: DynamoDB, BerkeleyDB, Project Voldemort.',330,'',206);
    let s=['{','  <tspan style="fill:'+PKC+'">"_id"</tspan>: "xyz123456",','  "first_name": "John",','  "last_name": "Doe",','  "address": {','    "street": "105, Main Street",','    "city": "London",','    "Country": "UK"','  }','}'].map((l,i)=>mono(40,22+i*19,l.replace(/^ +/,m=>'&#160;'.repeat(m.length)),{s:13})).join('');
    cell(duo,'Document',s,330,206,'Document','One self-describing JSON document, which can nest. Tools: MongoDB, CouchDB.');
    s='';let cy=12;[['cust:1001',['first_name = Mary','last_name = Smith','city = Liverpool']],['cust:1002',['first_name = John','city = London']],['cust:1003',['last_name = Doe','email = jd@mail.com']]].forEach(([k,cols])=>{
      s+=tx(8,cy+16,k,{s:13.5,a:'start',f:PKC});let x=80,yy=cy;cols.forEach(c=>{const w=c.length*6.3+12;if(x+w>328){x=80;yy+=25}s+=rect(x,yy,w,22,'#141414','#444')+tx(x+w/2,yy+16,c,{s:12.5,f:'#fff'});x+=w+5});cy=yy+34});
    cell(duo,'Column-oriented',s,330,190,'Column family','Each row key holds its own set of column = value pairs. Tools: HBase, Cassandra.');
    s='';const nd=[[80,96,'Person','Mary Smith','#bbb'],[256,46,'City','Liverpool','#888'],[256,150,'Street','123, Main St.','#888']];
    [[0,1,'LIVES_IN'],[0,2,'LIVES_AT']].forEach(([a,b,l])=>{s+=line(nd[a][0],nd[a][1],nd[b][0],nd[b][1],'#777',2)+lbl((nd[a][0]+nd[b][0])/2-18,(nd[a][1]+nd[b][1])/2+(b===1?-10:22),l,GRAY,{s:12.5})});
    nd.forEach(([x,y,t_,l,c])=>{s+='<ellipse cx="'+x+'" cy="'+y+'" rx="62" ry="28" fill="#111" stroke="'+c+'" stroke-width="2"/>'+tx(x,y-4,t_,{s:12.5,f:GRAY})+tx(x,y+14,l,{s:13.5,f:'#fff'})});
    cell(duo,'Graph',s,330,190,'Graph','Places become nodes, linked by named relationships. Tool: Neo4j.');
  })();
  /* dictionary encoding, as in the slide */
  (function(){
    const col=[2009,2010,2012,2009,2011,2009,2009,2009,2010,2012,2011,2011],dict=[2009,2010,2011,2012];let s='';
    s+=tx(110,18,'Year',{s:14,f:GRAY})+tx(380,18,'code',{s:14,f:GRAY})+tx(590,18,'dictionary',{s:14,f:GRAY});
    col.forEach((y,i)=>{const yy=28+i*28,c=dict.indexOf(y);s+=rect(60,yy,100,24,'#141414','#666')+tx(110,yy+17,y,{s:14,f:'#fff'})+line(166,yy+12,326,yy+12,'#444',1,' stroke-dasharray="4 4"')+rect(330,yy,100,24,'#141414','#666')+tx(380,yy+17,c.toString(2).padStart(2,'0'),{s:14,f:MSC})});
    dict.forEach((y,j)=>{const yy=28+j*28;s+=rect(510,yy,160,24,'#141414','#666')+tx(590,yy+17,j+' ('+j.toString(2).padStart(2,'0')+')  →  '+y,{s:14,f:'#fff'})});
    s+=tx(590,28+4*28+26,'4 distinct values',{s:13.5,f:GRAY})+tx(590,28+4*28+46,'= 2 bits per code',{s:13.5,f:MSC});
    svgBox($('#b4dict'),720,28+12*28+6,s,'Dictionary encoding of a Year column','40rem');
  })();
  /* run-length encoding, unsorted and sorted */
  (function(){
    const duo=el('div','duo');$('#b4rle').append(duo);const r=lcg(21),vals=Array.from({length:24},()=>Math.floor(r()*4)),sorted=vals.slice().sort((a,b)=>a-b);
    const shade=['#f0f0f0','#b4b4b4','#7a7a7a','#4a4a4a'];
    const runs=a=>{const o=[];a.forEach((v,i)=>{const l=o[o.length-1];if(l&&l[0]===v)l[2]++;else o.push([v,i+1,1])});return o};
    [['Unsorted',vals],['Sorted',sorted]].forEach(([title,a])=>{let s='';
      a.forEach((v,i)=>{const x=20+(i%8)*37,y=10+Math.floor(i/8)*40;s+=rect(x,y,34,34,shade[v])+tx(x+17,y+23,v,{s:15,f:v<2?'#000':'#fff'})});
      const rr=runs(a);rr.forEach((t,k)=>{s+=mono(14+(k%3)*104,150+Math.floor(k/3)*20,'('+t.join(', ')+')',{s:12.5,f:'#ddd'})});
      cell(duo,title,s,330,150+6*20+6,title,'<b>'+rr.length+' triples</b> for 24 values.')});
  })();
  /* property graph model */
  (function(){
    let s='<defs>'+arrowDef('b4pa','#ccc')+'</defs>';const E=[100,104],Co=[380,104],Ci=[640,104];
    s+=line(Co[0]-58,104,E[0]+60,104,'#ccc',2.5,' marker-end="url(#b4pa)"')+line(Co[0]+56,104,Ci[0]-62,104,'#ccc',2.5,' marker-end="url(#b4pa)"');
    s+=lbl(240,80,':HAS_CEO',FKC,{s:14,w:600})+tx(240,96,'start_date: 2008-01-20',{s:13,f:GRAY})+lbl(510,94,':LOCATED_IN',FKC,{s:14,w:600});
    [[E,'Employee'],[Co,'Company'],[Ci,'City']].forEach(([[x,y],l])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="54" fill="#111" stroke="#bbb" stroke-width="2"/>'+tx(x,y+5,l,{s:15,f:'#fff'})});
    s+=tx(100,184,'name: Amy Peters',{s:13,f:GRAY})+tx(100,202,'date_of_birth: 1984-03-01',{s:13,f:GRAY})+tx(100,220,'employee_ID: 1',{s:13,f:GRAY});
    s+=tx(510,184,'relationships have a direction',{s:13,f:GRAY});
    svgBox($('#b4pg'),720,228,s,'Property graph with an employee, a company and a city','44rem');
  })();
  /* traversal: films directed by Ava Reyes with their actors */
  (function(){
    const P=[['ava','Ava Reyes',110,90],['omar','Omar Diaz',110,290],['leo','Leo Marsh',610,60],['nina','Nina Park',620,170],['sara','Sara Kim',610,290]];
    const M=[['hl','Harbor Lights',360,70],['pm','Paper Moons',360,180],['qe','Quiet Engines',360,290]];
    const E=[['ava','hl','DIRECTED'],['ava','pm','DIRECTED'],['omar','qe','DIRECTED'],['leo','hl','ACTED_IN'],['nina','hl','ACTED_IN'],['nina','pm','ACTED_IN'],['sara','pm','ACTED_IN'],['leo','qe','ACTED_IN'],['sara','qe','ACTED_IN']];
    const all={};P.concat(M).forEach(n=>all[n[0]]=n);
    const hitE=E.filter(e=>(e[0]==='ava')||(e[2]==='ACTED_IN'&&(e[1]==='hl'||e[1]==='pm')));const hitN=new Set(hitE.flat());
    let s='';E.forEach(e=>{const a=all[e[0]],b=all[e[1]],on=hitE.includes(e);s+=line(a[2],a[3],b[2],b[3],on?PRC:'#333',on?3:1.5)});
    hitE.forEach(e=>{const a=all[e[0]],b=all[e[1]];s+=lbl((a[2]+b[2])/2,(a[3]+b[3])/2+4,e[2],PRC,{s:12.5})});
    P.concat(M).forEach(n=>{const on=hitN.has(n[0]),mv=n[0].length===2;s+='<ellipse cx="'+n[2]+'" cy="'+n[3]+'" rx="'+(mv?70:56)+'" ry="24" fill="#111" stroke="'+(on?PRC:'#444')+'" stroke-width="2"/>'+tx(n[2],n[3]+5,n[1],{s:14,f:on?'#fff':'#777'})});
    $('#b4trav').append(legend([[PRC,'pattern matched by the query'],['#444','rest of the graph']]));
    svgBox($('#b4trav'),720,320,s,'Graph of people and films with a traversal','44rem');
    $('#b4trav').append(el('div','cellnote','Result: Harbor Lights with Leo Marsh and Nina Park; Paper Moons with Nina Park and Sara Kim.'));
  })();
  /* vector database flow */
  (function(){
    const st=[['1. Content','text or image'],['2. Embedding','ML model'],['3. Record','id + vector','+ metadata'],['4. ANN index','structure','for proximity'],['5. Search','top k','neighbors']];let s='<defs>'+arrowDef('b4fa',GRAY)+'</defs>';
    st.forEach((x,i)=>{const cx=72+i*144;s+=rect(cx-62,20,124,78,'#0d0d0d',i===4?BLUE:'#666')+tx(cx,44,x[0],{s:14,f:'#fff',w:500});x.slice(1).forEach((l,j)=>s+=tx(cx,66+j*18,l,{s:13,f:GRAY}));
      if(i<4)s+=line(cx+64,59,cx+78,59,GRAY,2,' marker-end="url(#b4fa)"')});
    s+=tx(360,128,'query "Italian cities" → embedding → vector → nearest records, ranked by similarity',{s:13.5,f:GRAY});
    svgBox($('#b4flow'),720,140,s,'Flow of a vector database','46rem');
  })();
  /* vectors: drag the query */
  (function(){
    const pts=[['Rome',.62,.38],['Milan',.7,.44],['Paris',.52,.52],['Berlin',.4,.6],['Madrid',.78,.3],['pizza',-.32,.64],['pasta',-.22,.74],['risotto',-.45,.56],['sushi',-.62,.42],['puppy',-.6,-.42],['kitten',-.48,-.55],['horse',-.75,-.22],['parrot',-.3,-.68],['car',.52,-.5],['truck',.68,-.64],['bicycle',.32,-.42]];
    const root=$('#b4vec'),W=520,H=520,X=v=>W/2+v*230,Y=v=>H/2-v*230;let q=[.66,.2];
    root.append(legend([[ORG,'query (drag it)','dot'],[BLUE,'three most similar','dot'],['#777','other stored vectors','dot']]));
    const box=el('div');box.style.cssText='width:100%;max-width:30rem;touch-action:none;cursor:grab';root.append(box);const o=out();root.append(o);
    function draw(){const sc=pts.map(p=>({p,c:(p[1]*q[0]+p[2]*q[1])/(Math.hypot(p[1],p[2])*Math.hypot(q[0],q[1]))})).sort((a,b)=>b.c-a.c);const top=new Set(sc.slice(0,3).map(x=>x.p[0]));
      let s=line(20,H/2,W-20,H/2,'#333',1)+line(W/2,20,W/2,H-20,'#333',1)+tx(W-22,H/2+20,'dimension 1',{s:13,f:GRAY,a:'end'})+tx(W/2+8,32,'dimension 2',{s:13,f:GRAY,a:'start'});
      s+=line(W/2,H/2,X(q[0]),Y(q[1]),ORG,2);sc.slice(0,3).forEach(x=>s+=line(W/2,H/2,X(x.p[1]),Y(x.p[2]),BLUE,1.5,' stroke-dasharray="4 4"'));
      pts.forEach(p=>{const on=top.has(p[0]);s+='<circle cx="'+X(p[1])+'" cy="'+Y(p[2])+'" r="'+(on?7:5)+'" fill="'+(on?BLUE:'#777')+'"/>'+(p[0]==='Rome'?lbl(X(p[1])-10,Y(p[2])+14,p[0],on?'#fff':'#999',{a:'end',s:14}):lbl(X(p[1])+10,Y(p[2])+5,p[0],on?'#fff':'#999',{a:'start',s:14}))});
      s+='<circle cx="'+X(q[0])+'" cy="'+Y(q[1])+'" r="12" fill="'+ORG+'"/>'+lbl(X(q[0])+16,Y(q[1])+24,'query',ORG,{a:'start',s:14});
      box.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Two dimensional vector space with a draggable query">'+s+'</svg>';
      o.innerHTML='Closest by cosine similarity: '+sc.slice(0,3).map(x=>'<b>'+x.p[0]+'</b> <span style="color:var(--blue)">'+x.c.toFixed(3)+'</span>').join(', ')+'.'}
    drag(box,e=>{const sv=box.querySelector('svg'),[x,y]=svgPoint(sv,e,W,H);let a=clamp(Math.round((x-W/2)/230*100)/100,-1,1),b=clamp(Math.round((H/2-y)/230*100)/100,-1,1);if(Math.hypot(a,b)<.06)a=.06;q=[a,b];draw()});
    draw();
  })();
};
QZ['4a']=()=>[{q:'A BASE system has just accepted a new address on node 1. A read on node 3 a moment later returns the old address. Is the system broken?',
  o:['Yes: it violated basic availability.','No: that is eventual consistency at work, and node 3 will catch up.','Yes: every NoSQL system guarantees ACID transactions.','No, because node 3 should have refused to answer.'],a:1,
  e:'Under eventual consistency a node may hold the old value right after a write; it answers anyway and converges once replication completes.',h:'Recall the three words of BASE and the second panel of the figure.'}];
QZ['4b']=()=>[{q:'A Year column contains the years 2009 to 2013. How many bits does each dictionary code need?',o:['2','5','13','3'],a:3,
  e:'Five distinct values: 2 bits give only 4 codes, 3 bits give 8, so the ceiling of log₂ 5 is 3.',h:'How many different codes can 2 bits write, and is that enough?'}];
QZ['4']=()=>[
  {q:'A NoSQL database is called horizontally scalable because…',o:['its tables can have as many columns as needed','it can be moved to a more powerful server','adding servers increases computing power and storage','it compresses columns'],a:2,
   e:'Horizontal scalability means adding servers to the cluster to gain power and storage.',h:'Look back at the cluster figure: what changed from one panel to the next?'},
  {q:'A transfer withdraws 100 from A, then the server crashes before the deposit to B. Which ACID property makes sure the withdrawal is undone?',o:['Atomicity','Durability','Isolation','Consistency'],a:0,
   e:'Atomicity is the all or nothing property: either both the withdrawal and the deposit happen, or neither does.',h:'Reread the four one-line meanings and match each to what went wrong here.'},
  {q:'In which NoSQL family does each record carry its own field names, can contain nested records, and need not match the structure of the others?',o:['Key-value','Graph oriented','Column-oriented','Document oriented'],a:3,
   e:'Self-describing, nestable records with no schema constraints are documents in JSON or XML, as in MongoDB and CouchDB.',h:'Compare the four panels of the models figure.'},
  {q:'A column of 1,200 rows holds the codes 0, 1, 2 and 3, 300 times each. Sorted, how many run-length triples does it need?',o:['1,200','300','2','4'],a:3,
   e:'Sorted, the column is 300 zeros, then 300 ones, 300 twos and 300 threes: four runs, four triples.',h:'Picture the sorted column: where does a new run start?'},
  {q:'Two vectors point in exactly the same direction, but one is twice as long. What is their cosine similarity?',o:['1','0.5','2','0'],a:0,
   e:'Cosine similarity depends only on the angle, which is zero here, so it is 1; the Euclidean distance instead grows with the length.',h:'Which part of the formula would change if one vector were made longer?'}
];
