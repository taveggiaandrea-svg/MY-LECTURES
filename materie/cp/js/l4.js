/* Lesson 4: optimization problems and greedy approaches */
/* the slides' configuration graph: costs, neighbours, positions (slide pixels) */
const G4={cost:{1:.7,2:1.2,3:1.1,4:.3,5:.8,6:.5,7:.5,8:1.0,9:.2,10:.6,11:2.5,12:2.5,13:.3},
  E:[[1,2],[1,6],[2,5],[3,5],[3,4],[5,6],[5,7],[5,9],[5,10],[4,7],[7,9],[7,11],[6,8],[6,10],[8,12],[10,12],[9,10],[9,13],[11,13]],
  P:{1:[253,340],2:[430,282],3:[750,240],4:[966,338],5:[575,386],6:[381,478],7:[806,463],8:[220,572],9:[714,566],10:[490,620],11:[968,672],12:[345,743],13:[661,803]},
  L:{1:[-6,-22],2:[0,-24],3:[30,-14],4:[0,-24],5:[0,-24],6:[2,-24],7:[-26,-20],8:[-14,-24],9:[36,6],10:[0,34],11:[24,-22],12:[-40,6],13:[-30,-18]}};
G4.nb=(()=>{const nb={};Object.keys(G4.cost).forEach(v=>nb[v]=[]);G4.E.forEach(([a,b])=>{nb[a].push(b);nb[b].push(a)});return nb})();
/* probability of ending at 9 when each proposal is a uniformly random neighbour (rejections only repeat) */
G4.p9=(()=>{const m={};const f=v=>{if(m[v]!==undefined)return m[v];const b=G4.nb[v].filter(w=>G4.cost[w]<=G4.cost[v]);
  m[v]=b.length?b.reduce((a,w)=>a+f(w),0)/b.length:(+v===9?1:0);return m[v]};Object.keys(G4.cost).forEach(f);return m})();
INIT[4]=function(){
  codeHL($('#lezione-4'));
  const isLoc=v=>G4.nb[v].every(w=>G4.cost[w]>G4.cost[v]);
  /* draw the graph: o.sc scale, o.fill(v) node fill, o.extra(X,Y) extra layers, o.lab(v) label under node */
  const graph=o=>{const sc=o.sc||0.78,X=v=>(G4.P[v][0]-190)*sc+18,Y=v=>(G4.P[v][1]-215)*sc+30,r=o.r||15;let s='';
    G4.E.forEach(([a,b])=>{s+=line(X(a).toFixed(1),Y(a).toFixed(1),X(b).toFixed(1),Y(b).toFixed(1),'#666',2)});
    if(o.under)s+=o.under(X,Y);
    Object.keys(G4.cost).forEach(v=>{const lc=isLoc(v),gl=+v===9;
      s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="'+r+'" fill="'+(o.fill?o.fill(v):'#111')+'" stroke="'+(gl?PINK:lc?PUR:'#bbb')+'" stroke-width="'+(gl||lc?3.5:1.5)+'"/>'+
        tx(X(v).toFixed(1),(Y(v)+5).toFixed(1),v,{s:o.fs||14,f:'#fff',w:600});
      const [dx,dy]=G4.L[v];s+=lbl((X(v)+dx*sc*1.15).toFixed(1),(Y(v)+dy*sc*1.15+5).toFixed(1),o.lab?o.lab(v):G4.cost[v].toFixed(1),o.lab?PINK:YEL,{s:o.ls||14,w:600})});
    if(o.over)s+=o.over(X,Y);return s};
  /* opening: the greedy walk from 12 */
  (function(){
    const root=$('#c4walk');root.append(legend([[YEL,'cost','box'],[GRN,'move accepted'],[RED,'move rejected'],[PUR,'local minimum','dot'],[PINK,'global minimum','dot']]));
    const W=680,H=520;
    const arc=(X,Y,a,b,c,k,id,dash)=>{const x1=X(a),y1=Y(a),x2=X(b),y2=Y(b),dx=x2-x1,dy=y2-y1,L_=Math.hypot(dx,dy),ux=dx/L_,uy=dy/L_,nx=-uy*k,ny=ux*k;
      const sx=x1+ux*20+nx*.35,sy=y1+uy*20+ny*.35,ex=x2-ux*22+nx*.35,ey=y2-uy*22+ny*.35,cx=(x1+x2)/2+nx,cy=(y1+y2)/2+ny;
      return {d:'<path d="M'+sx.toFixed(1)+' '+sy.toFixed(1)+'Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+ex.toFixed(1)+' '+ey.toFixed(1)+'" fill="none" stroke="'+c+'" stroke-width="2.6"'+(dash?' stroke-dasharray="5 4"':'')+' marker-end="url(#'+id+')"/>',mx:(sx+2*cx+ex)/4,my:(sy+2*cy+ey)/4}};
    const badge=(x,y,t,c)=>'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="10" fill="#000" stroke="'+c+'" stroke-width="2"/>'+tx(x.toFixed(1),(y+4.5).toFixed(1),t,{s:12.5,f:c,w:600});
    const s=arrowM('c4ok',GRN)+arrowM('c4no',RED)+graph({over:(X,Y)=>{let o='';
      const steps=[[12,10,GRN,'c4ok','1',-28],[10,5,RED,'c4no','2',-30],[10,6,GRN,'c4ok','3',-30]];
      steps.forEach(([a,b,c,id,t,k])=>{const r=arc(X,Y,a,b,c,k,id,c===RED);o+=r.d+badge(r.mx,r.my,t,c)});
      [1,5,8,10].forEach(b=>{const r=arc(X,Y,6,b,RED,b===10?-30:22,'c4no',true);o+=r.d+lbl(r.mx.toFixed(1),(r.my+5).toFixed(1),'✕',RED,{s:14,w:600})});
      o+=lbl(X(12),Y(12)+36,'start',ORG,{s:14,w:600})+lbl(X(6)-2,Y(6)+38,'end',ORG,{s:14,w:600})+lbl(X(9)+8,Y(9)+40,'global minimum',PINK,{s:13.5,w:600})+lbl(X(4),Y(4)+38,'local minimum',PUR,{s:13.5,w:600});
      return o}});
    svgBox(root,W,H,s,'Graph of 13 configurations with costs and the greedy walk from 12 to 6','42rem');
  })();
  /* time to check all 2^n strings */
  (function(){
    const rows=[10,20,30,40,50,60],W=620,lx=92,rx=W-110,lo=-7,hi=10,Xl=v=>lx+(v-lo)/(hi-lo)*(rx-lx);let s='';
    const fmtT=t=>t<1e-3?fe(t*1e6,1)+' µs':t<1?fe(t*1e3,1)+' ms':t<60?fe(t,1)+' s':t<3600?Math.round(t/60)+' minutes':t<86400?fe(t/3600,1)+' hours':t<86400*365.25?Math.round(t/86400)+' days':fe(t/86400/365.25,1)+' years';
    [[-6,'1 µs'],[-3,'1 ms'],[0,'1 s'],[Math.log10(86400),'1 day'],[Math.log10(86400*365.25),'1 year']].forEach(([v,t])=>{s+=line(Xl(v),14,Xl(v),246,'#222',1)+tx(Xl(v),266,t,{s:12.5,f:GRAY})});
    rows.forEach((n,k)=>{const t=Math.pow(2,n)/1e9,y=22+k*38;s+=tx(lx-12,y+19,'n = '+n,{s:14,f:'#fff',a:'end'})+rect(lx,y,Xl(Math.log10(t))-lx,26,k>3?RED:BLUE)+tx(Xl(Math.log10(t))+8,y+18,fmtT(t),{s:14,f:'#fff',a:'start'})});
    s+=line(lx,14,lx,246,'#888',1.5)+tx((lx+rx)/2,288,'time to check all 2ⁿ strings (logarithmic scale)',{s:13,f:GRAY});
    svgBox($('#c4grow'),W,298,s,'Time to check all binary strings of length n at a billion per second','40rem');
  })();
  /* the 3-bit cube */
  (function(){
    const W=420,H=300,pos={'000':[90,230],'100':[250,230],'010':[90,90],'110':[250,90],'001':[170,270],'101':[330,270],'011':[170,130],'111':[330,130]};
    const ks=Object.keys(pos),diff=(a,b)=>[0,1,2].filter(i=>a[i]!==b[i]);let s='';const c='010';
    ks.forEach(a=>ks.forEach(b=>{if(a<b&&diff(a,b).length===1){const hi=a===c||b===c;s+=line(pos[a][0],pos[a][1],pos[b][0],pos[b][1],hi?PINK:'#555',hi?3:1.8)}}));
    ks.forEach(a=>{const hi=a===c,nb=diff(a,c).length===1,[x,y]=pos[a];
      s+=rect(x-30,y-17,60,34,hi?'#3a1d36':'#111',hi?PINK:nb?PINK:'#777',hi||nb?' stroke-width="2"':'');
      const ch=a.split('').map((b,i)=>'<tspan'+(nb&&b!==c[i]?' style="fill:'+PINK+';font-weight:700"':'')+'>'+b+'</tspan>').join('');
      s+=mono(x,y+6,ch,{s:17,a:'middle',f:'#fff'})});
    svgBox($('#c4cube'),W,H,s,'The eight 3-bit strings joined when they differ in one bit','28rem');
  })();
  /* restarts: probability of reaching 9 from each start, and with k restarts */
  (function(){
    const root=$('#c4restart');root.append(legend([[PINK,'probability of ending at 9','box']]));
    const s=graph({fill:v=>'rgba(220,117,205,'+(0.08+0.8*G4.p9[v]).toFixed(2)+')',lab:v=>Math.round(100*G4.p9[v])+'%'});
    svgBox(root,680,526,s,'Probability of reaching the global minimum from each start','40rem');
    const pbar=Object.values(G4.p9).reduce((a,b)=>a+b,0)/13,W=620,H=220,L0=56,B0=176,T0=14,bw=40;let t='';
    [0,0.25,0.5,0.75,1].forEach(v=>{const y=B0-v*(B0-T0);t+=line(L0,y,W-10,y,'#1e1e1e',1)+tx(L0-8,y+4.5,Math.round(v*100)+'%',{s:12.5,f:GRAY,a:'end'})});
    for(let k=1;k<=10;k++){const p=1-Math.pow(1-pbar,k),x=L0+16+(k-1)*55,y=B0-p*(B0-T0);t+=rect(x,y,bw,B0-y,PINK)+tx(x+bw/2,y-6,Math.round(p*100)+'%',{s:12.5,f:'#fff'})+tx(x+bw/2,B0+18,k,{s:13,f:GRAY})}
    t+=line(L0,B0,W-10,B0,'#888',1.5)+tx((L0+W)/2,H-6,'number of restarts k',{s:13,f:GRAY});
    svgBox(root,W,H,t,'Probability that at least one of k restarts reaches the global minimum','40rem');
  })();
  /* a local move on a route: four pieces change */
  (function(){
    const W=640,H=224,P={A:[30,120],d1:[110,120],X:[200,120],Y:[300,44],W:[300,176],Z:[400,120],d2:[490,120],B:[600,120]};let s='';
    s+=line(P.A[0],120,P.X[0],120,'#777',2,' stroke-dasharray="2 6"')+line(P.Z[0],120,P.B[0],120,'#777',2,' stroke-dasharray="2 6"');
    s+=line(P.X[0],P.X[1],P.Y[0],P.Y[1],RED,3)+line(P.Y[0],P.Y[1],P.Z[0],P.Z[1],RED,3);
    s+=line(P.X[0],P.X[1],P.W[0],P.W[1],TEAL,3)+line(P.W[0],P.W[1],P.Z[0],P.Z[1],TEAL,3);
    ['A','X','Y','W','Z','B'].forEach(k=>{const [x,y]=P[k];s+='<circle cx="'+x+'" cy="'+y+'" r="17" fill="#111" stroke="'+(k==='Y'?RED:k==='W'?TEAL:'#bbb')+'" stroke-width="2"/>'+tx(x,y+5.5,k,{s:15,f:'#fff',w:600})});
    s+=lbl(300,20,'old: X → Y → Z',RED,{s:14})+lbl(300,222,'new: X → W → Z',TEAL,{s:14})+tx(115,104,'…',{s:20,f:GRAY})+tx(495,104,'…',{s:20,f:GRAY});
    svgBox($('#c4delta'),W,H+10,s,'Replacing one intermediate node changes four pieces of the route','40rem');
  })();
  /* partial buildup on the layered graph */
  (function(){
    const root=$('#c4layer'),duo=el('div','duo');root.append(legend([[YEL,'edge cost','box'],[ORG,'partial buildup'],[BLUE,'optimal path']]),duo);
    const N={S1:[107,407],S2:[107,541],A:[355,314],B:[355,473],C:[355,632],D:[603,314],E:[603,420],F:[603,526],G:[603,632],H:[851,314],I:[851,473],J:[851,632],F1:[1098,407],F2:[1098,541]};
    const Ed=[['S1','A',1.0],['S1','C',0.5],['S2','B',0.3],['S2','C',1.2],['A','E',0.9],['B','D',0.8],['B','G',1.1],['C','E',1.0],['C','F',0.3],['D','H',1.2],['D','I',0.3],['E','J',0.6],['F','H',0.5],['G','I',0.8],['H','F1',0.3],['H','F2',1.0],['I','F1',1.2],['J','F1',0.5]];
    const out=v=>Ed.filter(e=>e[0]===v);
    /* partial buildup: cheapest first edge among both starts, then cheapest outgoing edge */
    const gp=[];let cur=Ed.filter(e=>e[0][0]==='S'&&e[0].length===2).reduce((a,e)=>e[2]<a[2]?e:a);gp.push(cur);
    while(out(cur[1]).length){cur=out(cur[1]).reduce((a,e)=>e[2]<a[2]?e:a);gp.push(cur)}
    /* optimal: best total over all complete paths (exhaustive, the graph is tiny) */
    const paths=[];const walk=(v,acc)=>{const o=out(v);if(!o.length){if(v[0]==='F')paths.push(acc);return}o.forEach(e=>walk(e[1],acc.concat([e])))};
    walk('S1',[]);walk('S2',[]);const tot=p=>p.reduce((a,e)=>a+e[2],0),op=paths.reduce((a,p)=>tot(p)<tot(a)?p:a);
    const W=340,H=272,X=v=>(N[v][0]-107)/991*286+26,Y=v=>(N[v][1]-314)/318*190+44;
    const panel=(path,c,id)=>{let s=arrowM(id,c);const on=e=>path.includes(e);
      Ed.forEach(e=>{if(!on(e))s+=line(X(e[0]),Y(e[0]),X(e[1]),Y(e[1]),'#555',1.6)});
      path.forEach(e=>{const x1=X(e[0]),y1=Y(e[0]),x2=X(e[1]),y2=Y(e[1]),L_=Math.hypot(x2-x1,y2-y1);
        s+=line(x1,y1,(x2-(x2-x1)/L_*11).toFixed(1),(y2-(y2-y1)/L_*11).toFixed(1),c,3,' marker-end="url(#'+id+')"')});
      Ed.forEach(e=>{const x1=X(e[0]),y1=Y(e[0]),x2=X(e[1]),y2=Y(e[1]),L_=Math.hypot(x2-x1,y2-y1),nx=(y2-y1)/L_,ny=-(x2-x1)/L_;s+=lbl((x1+(x2-x1)*0.3+nx*9).toFixed(1),(y1+(y2-y1)*0.3+ny*9+4).toFixed(1),e[2].toFixed(1),on(e)?c:YEL,{s:12.5,w:600})});
      Object.keys(N).forEach(v=>{const inP=path.some(e=>e[0]===v||e[1]===v);s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="8.5" fill="#000" stroke="'+(inP?c:'#bbb')+'" stroke-width="2.2"/>'});
      s+=tx(18,24,'start',{s:13,f:GRAY,a:'start'})+tx(W-8,24,'finish',{s:13,f:GRAY,a:'end'});
      return s};
    cell(duo,'Partial buildup',panel(gp,ORG,'c4l1'),W,H,'Greedy partial buildup path','Cheapest edge each time: total <b>'+fe(tot(gp),1)+'</b>.');
    cell(duo,'Optimal path',panel(op,BLUE,'c4l2'),W,H,'Optimal path','Best of all '+paths.length+' complete paths: total <b>'+fe(tot(op),1)+'</b>.');
  })();
};
QZ['4a']=()=>[
  {q:'A configuration is a sequence of 20 yes or no decisions. How many configurations are there?',
   o:['400','40','1,048,576','20!'],a:2,
   e:'Each of the 20 positions has 2 choices, independently: 2<sup>20</sup> = 1,048,576.',
   h:'Count the choices for the first decision, then for the first two, then for the first three.'}
];
QZ['4b']=()=>[
  {q:'In the opening graph, greedy starts at configuration 3 (cost 1.1). At which configurations can it end, depending on the random proposals?',
   o:['Only 9','4, 6 or 9','Only 4','3, 4 or 5'],a:1,
   e:'From 3 it can go to 4 (stuck) or 5. From 5 every lower neighbour is possible: 6 (stuck), 7, 9, 10. From 7 it reaches 4 or 9, from 10 it reaches 6 or 9. So the possible ends are the three minima 4, 6 and 9.',
   h:'Follow every downhill path from 3 until you reach a node whose neighbours are all more expensive.'}
];
QZ['4c']=()=>[
  {q:'In the left-to-right example, suppose partial buildup is forced to start from the upper start node. What total cost does it reach?',
   o:['2.6','2.0','3.0','1.6'],a:3,
   e:'From the upper node the cheapest edge is 0.5, then 0.3, then the only edge 0.5, then 0.3 rather than 1.0: total 1.6, which happens to be the optimum. Greedy is not always wrong; it just has no guarantee.',
   h:'Repeat the rule "take the cheapest edge out of the current node" from the upper start, reading the costs on the figure.'}
];
QZ['4']=()=>[
  {q:'You want to <em>maximize</em> a profit p(x). How do you state it as the problem of the slides?',
   o:['Minimize 1/p(x)','Minimize −p(x)','Minimize p(x) and take the last value','It cannot be stated that way'],a:1,
   e:'The x that makes p(x) largest is the one that makes −p(x) smallest. (1/p would fail for negative or zero profits.)',
   h:'Which transformation turns the largest value into the smallest, for any sign?'},
  {q:'In the opening graph greedy starts at 10, and each proposal is a neighbour picked uniformly at random. What is the probability that it ends at the global minimum 9?',
   o:['0.25','1','0.5','0.6'],a:2,
   e:'The lower neighbours of 10 (cost 0.6) are 6 (0.5) and 9 (0.2); 5 and 12 are rejected and just cause another draw. So the first accepted move goes to 6 or 9 with equal probability, and 6 is a dead end: 0.5.',
   h:'Think about what a rejected proposal does, and which accepted moves lead to a dead end.'},
  {q:'Which of these configurations of the opening graph is <em>not</em> a local minimum?',
   o:['6 (0.5)','4 (0.3)','9 (0.2)','13 (0.3)'],a:3,
   e:'13 has the neighbour 9, which costs less (0.2), so greedy can still move from 13. The other three have only more expensive neighbours.',
   h:'For each candidate, compare its cost with those of its neighbours.'},
  {q:'A route from A to B has 1,000 intermediate nodes, and a move replaces one of them. How many pieces of the route enter the delta-cost?',
   o:['4','1,001','2','It depends on the length'],a:0,
   e:'Two pieces are removed (X to Y and Y to Z) and two are added (X to W and W to Z); all the others cancel in the difference, so the work is O(1).',
   h:'Draw X → Y → Z and X → W → Z: which pieces differ?'},
  {q:'At a billion configurations per second, roughly how long does checking all binary strings of length 40 take?',
   o:['About a second','About 18 minutes','About 13 days','About 37 years'],a:1,
   e:'2<sup>40</sup> ≈ 1.1 · 10<sup>12</sup> strings, divided by 10<sup>9</sup> per second, is about 1,100 seconds: 18 minutes. Ten more bits multiply this by 1,024.',
   h:'2<sup>10</sup> is about a thousand, so 2<sup>40</sup> is about 10<sup>12</sup>.'},
  {q:'What does the slides\' "things might need to get worse before they get better" mean for the opening graph?',
   o:['That greedy should start from the most expensive configuration','That costs change over time','That to go from the local minimum 6 to 9 the search must first accept an uphill step, which greedy never does','That restarts make the cost worse'],a:2,
   e:'Every path from 6 to 9 passes through 5 or 10, both more expensive than 6. A method that sometimes accepts uphill moves can escape; this is the idea behind simulated annealing.',
   h:'Look at the neighbours of 6 and ask how greedy could ever leave it.'}
];
