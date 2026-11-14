/* Lesson 5: greedy for the travelling salesman problem */
/* a small TSP simulator that follows the course code: random permutation, swap-paths move with rejection, 4-edge delta, reversal */
function tspMake(n,seed){const r=lcg(seed),x=[],y=[];for(let i=0;i<n;i++){x.push(r());y.push(r())}
  const d=[];for(let i=0;i<n;i++){d.push(new Float64Array(n));for(let j=0;j<n;j++)d[i][j]=Math.hypot(x[i]-x[j],y[i]-y[j])}return {n,x,y,d}}
const tspCost=(P,route)=>{let c=0;for(let i=0;i<P.n;i++)c+=P.d[route[i]][route[(i+1)%P.n]];return c};
function tspPerm(n,r){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function tspGreedy(P,iters,r,onAccept){const n=P.n,route=tspPerm(n,r);let c=tspCost(P,route);if(onAccept)onAccept(0,route,c);
  for(let t=1;t<=iters;t++){let e1,e2;
    while(true){e1=Math.floor(r()*n);e2=Math.floor(r()*n);if(e1>e2){const q=e1;e1=e2;e2=q}if(e1!==e2&&e1+1!==e2&&(e2+1)%n!==e1)break}
    const a=route[e1],b=route[(e1+1)%n],p=route[e2],q=route[(e2+1)%n],dc=P.d[a][p]+P.d[b][q]-P.d[a][b]-P.d[p][q];
    if(dc<=0){let i=e1+1,j=e2;while(i<j){const w=route[i];route[i]=route[j];route[j]=w;i++;j--}c+=dc;if(onAccept)onAccept(t,route,c)}}
  return {route,c}}
function tspNN(P,start){const n=P.n,seen=new Array(n).fill(false),route=[start];seen[start]=true;
  for(let k=1;k<n;k++){const u=route[k-1];let best=-1;for(let v=0;v<n;v++)if(!seen[v]&&(best<0||P.d[u][v]<P.d[u][best]))best=v;route.push(best);seen[best]=true}return route}
/* draw a route on a square map: returns svg pieces */
const tspMap=(P,route,o)=>{o=o||{};const m=o.m||14,S=o.S||300,X=v=>m+P.x[v]*S,Y=v=>m+S-P.y[v]*S;let s=rect(m,m,S,S,'none','#333');
  if(route)s+='<path d="'+route.concat([route[0]]).map((v,i)=>(i?'L':'M')+X(v).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+(o.c||PINK)+'" stroke-width="'+(o.w||2)+'" stroke-linejoin="round"/>';
  for(let i=0;i<P.n;i++)s+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(i).toFixed(1)+'" r="'+(o.r||3.2)+'" fill="#fff"/>';
  if(o.ring!==undefined)s+='<circle cx="'+X(o.ring).toFixed(1)+'" cy="'+Y(o.ring).toFixed(1)+'" r="8" fill="none" stroke="'+ORG+'" stroke-width="2.5"/>';
  return s};
INIT[5]=function(){
  codeHL($('#lezione-5'));
  const P40=tspMake(40,4242),hist=[],T=8000;
  const run40=tspGreedy(P40,T,lcg(777),(t,route,c)=>hist.push({t,route:route.slice(),c}));
  /* opening animation */
  (function(){
    const root=$('#c5anim');root.append(legend([[PINK,'current route'],[YEL,'cost (route length)']]));
    const box=el('div');box.style.cssText='width:100%;max-width:30rem';root.append(box);const o=out();
    const W=420,mapS=320,cy0=364,ch=110,cx0=46,cw=W-cx0-30,cmax=Math.ceil(hist[0].c),cmin=Math.floor(hist[hist.length-1].c*0.9);
    const CX=t=>cx0+t/T*cw,CY=c=>cy0+ch-(c-cmin)/(cmax-cmin)*ch;
    let curve='';hist.forEach((h,i)=>{const nx=i+1<hist.length?hist[i+1].t:T;curve+=(i?'L':'M')+CX(h.t).toFixed(1)+' '+CY(h.c).toFixed(1)+'H'+CX(nx).toFixed(1)});
    let axes=line(cx0,cy0,cx0,cy0+ch,'#888',1.3)+line(cx0,cy0+ch,cx0+cw,cy0+ch,'#888',1.3)+tx(cx0-6,CY(cmax)+4,cmax,{s:12.5,f:GRAY,a:'end'})+tx(cx0-6,CY(cmin)+4,cmin,{s:12.5,f:GRAY,a:'end'})+
      [0,2000,4000,6000,8000].map(t=>tx(CX(t),cy0+ch+17,fk(t),{s:12.5,f:GRAY})).join('')+tx(cx0+cw/2,cy0+ch+36,'iteration t',{s:13,f:GRAY})+'<path d="'+curve+'" fill="none" stroke="'+YEL+'" stroke-width="2"/>';
    const frame=t=>{let k=0;while(k+1<hist.length&&hist[k+1].t<=t)k++;const h=hist[k];
      box.innerHTML='<svg viewBox="0 0 '+W+' '+(cy0+ch+44)+'" role="img" aria-label="Greedy improving a route through 40 cities">'+'<g transform="translate('+((W-mapS)/2-14)+',0)">'+tspMap(P40,h.route,{S:mapS,w:2.2})+'</g>'+axes+
        '<circle cx="'+CX(t).toFixed(1)+'" cy="'+CY(h.c).toFixed(1)+'" r="5" fill="'+YEL+'" stroke="#000" stroke-width="1.5"/></svg>';
      o.innerHTML='Iteration <span class="num">'+fk(t)+'</span> of '+fk(T)+': '+k+' moves accepted so far, route length <span class="num">'+h.c.toFixed(3)+'</span>.'};
    root.append(o);player(root,20,p=>frame(Math.round(T*Math.pow(p/20,2))));
  })();
  /* nearest neighbour versus random-search greedy */
  (function(){
    const root=$('#c5nn'),duo=el('div','duo');root.append(legend([[ORG,'nearest neighbour'],[PINK,'random-search greedy']]),duo);
    const nn=tspNN(P40,0),cn=tspCost(P40,nn);
    cell(duo,'Nearest neighbour from city 0',tspMap(P40,nn,{c:ORG,ring:0}),328,328,'Nearest neighbour route','Length <b>'+cn.toFixed(2)+'</b>.');
    cell(duo,'Random-search greedy',tspMap(P40,run40.route),328,328,'Greedy route','Length <b>'+run40.c.toFixed(2)+'</b>.');
  })();
  /* a route as a permutation */
  (function(){
    const route=[3,0,4,1,5,2],n=6,W=560,H=400,ax=150,cw=44,pts=[];route.forEach((v,k)=>{const a=(210-60*k)*Math.PI/180;pts[v]=[0.5+0.42*Math.cos(a),0.5+0.42*Math.sin(a)]});let s=arrowM('c5p',PINK);
    s+=tx(ax-14,30,'position',{s:12.5,f:GRAY,a:'end'})+mono(ax-14,58,'route',{s:14,a:'end',f:'#fff'});
    route.forEach((v,i)=>{s+=tx(ax+i*cw+cw/2,30,i,{s:12.5,f:GRAY})+rect(ax+i*cw,38,cw,30,'rgba(220,117,205,.16)','#555')+tx(ax+i*cw+cw/2,58,v,{s:16,f:PINK,w:600})});
    const X=v=>W/2+(pts[v][0]-0.5)*330,Y=v=>244+(0.5-pts[v][1])*290;
    for(let e=0;e<n;e++){const a=route[e],b=route[(e+1)%n],x1=X(a),y1=Y(a),x2=X(b),y2=Y(b),L_=Math.hypot(x2-x1,y2-y1);
      s+=line(x1,y1,(x2-(x2-x1)/L_*16).toFixed(1),(y2-(y2-y1)/L_*16).toFixed(1),PINK,2.4,' marker-end="url(#c5p)"'+(e===n-1?' stroke-dasharray="6 5"':''));
      const mx=(x1+x2)/2,my=(y1+y2)/2,ox=mx-W/2,oy=my-244,ol=Math.hypot(ox,oy);s+=lbl((mx+ox/ol*24).toFixed(1),(my+oy/ol*24+5).toFixed(1),'e = '+e,'#bbb',{s:13})}
    pts.forEach((p,v)=>{s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="13" fill="#111" stroke="#fff" stroke-width="1.8"/>'+tx(X(v).toFixed(1),(Y(v)+5).toFixed(1),v,{s:14,f:'#fff',w:600})});
    svgBox($('#c5perm'),W,H,s,'A route as a permutation of six cities, with edges numbered','36rem');
  })();
  /* the swap-paths move on a small route with a crossing */
  (function(){
    const root=$('#c5swap'),duo=el('div','duo');root.append(legend([[RED,'removed edges'],[TEAL,'new edges'],[ORG,'reversed block','box']]),duo);
    const n=10,pts=[];for(let k=0;k<n;k++){const a=Math.PI/2-2*Math.PI*k/n,rr=k%2?0.42:0.38;pts.push([0.5+rr*Math.cos(a),0.5+rr*Math.sin(a)])}
    const before=[0,1,5,4,3,2,6,7,8,9],e1=1,e2=5,after=before.slice();after.splice(e1+1,e2-e1,...before.slice(e1+1,e2+1).reverse());
    const W=320,H=410,S=250,m=35,X=v=>m+pts[v][0]*S,Y=v=>m+(1-pts[v][1])*S;
    const panel=(route,old)=>{let s='';const oldE=[[before[e1],before[e1+1]],[before[e2],before[(e2+1)%n]]],newE=[[before[e1],before[e2]],[before[e1+1],before[(e2+1)%n]]];
      const isE=(a,b,L)=>L.some(([p,q])=>(p===a&&q===b)||(p===b&&q===a));
      for(let e=0;e<n;e++){const a=route[e],b=route[(e+1)%n],c=old&&isE(a,b,oldE)?RED:!old&&isE(a,b,newE)?TEAL:'#777';s+=line(X(a).toFixed(1),Y(a).toFixed(1),X(b).toFixed(1),Y(b).toFixed(1),c,c==='#777'?1.8:3.2)}
      const nm={};nm[before[e1]]='i';nm[before[e1+1]]='j';nm[before[e2]]='l';nm[before[(e2+1)%n]]='k';
      pts.forEach((p,v)=>{s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="11" fill="#111" stroke="#ddd" stroke-width="1.5"/>'+tx(X(v).toFixed(1),(Y(v)+4.5).toFixed(1),v,{s:12.5,f:'#fff'});
        if(nm[v]){const dx=(p[0]-0.5)*44,dy=-(p[1]-0.5)*44;s+=lbl((X(v)+dx).toFixed(1),(Y(v)+dy+5).toFixed(1),nm[v],'#fff',{s:15,w:600})}});
      const ay=338,cw=28,ax=(W-n*cw)/2;
      route.forEach((v,i)=>{const rev=i>e1&&i<=e2;s+=rect(ax+i*cw,ay,cw,28,rev?'rgba(255,134,47,.25)':'#0d0d0d',rev?ORG:'#555')+tx(ax+i*cw+cw/2,ay+19,v,{s:13.5,f:rev?ORG:'#eee'})+tx(ax+i*cw+cw/2,ay-6,i,{s:12.5,f:GRAY})});
      s+=tx(W/2,ay+50,old?'edges e1 = 1 and e2 = 5 marked':'positions 2 to 5 reversed',{s:13,f:GRAY});return s};
    cell(duo,'Before: route has a crossing',panel(before,true),W,H,'Route before the move','Old edges i → j and l → k (red).');
    cell(duo,'After: route[2:6] = route[5:1:-1]',panel(after,false),W,H,'Route after the move','New edges i → l and j → k (teal): the crossing is gone.');
  })();
  /* the distance matrix */
  (function(){
    const root=$('#c5dist'),duo=el('div','duo');root.append(duo);
    const P=tspMake(8,909),W=330,S=270,m=28;let s=rect(m,m,S,S,'none','#333');
    for(let i=0;i<8;i++){const x=m+P.x[i]*S,y=m+S-P.y[i]*S;s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="11" fill="#111" stroke="#fff" stroke-width="1.6"/>'+tx(x.toFixed(1),(y+4.5).toFixed(1),i,{s:12.5,f:'#fff'})}
    cell(duo,'Eight cities',s,W,W,'Eight random cities','Coordinates uniform in the unit square.');
    const cw=38,gx=32,gy=28,mx=Math.max(...P.d.map(r=>Math.max(...r)));let t='';
    for(let i=0;i<8;i++){t+=tx(gx-8,gy+i*cw+cw/2+4.5,i,{s:12.5,f:GRAY,a:'end'})+tx(gx+i*cw+cw/2,gy-8,i,{s:12.5,f:GRAY});
      for(let j=0;j<8;j++){const v=P.d[i][j],a=(v/mx);t+=rect(gx+j*cw,gy+i*cw,cw,cw,'rgba(88,196,221,'+(0.08+0.8*a).toFixed(2)+')','#222')+tx(gx+j*cw+cw/2,gy+i*cw+cw/2+4.5,v.toFixed(2).replace(/^0/,''),{s:12.5,f:a>0.55?'#000':'#fff'})}}
    cell(duo,'dist[i, j]',t,346,346,'Symmetric distance matrix with zero diagonal','Symmetric, zero diagonal. Values shown without the leading 0.');
  })();
  /* random restarts: 100 cities, 30 runs of 50,000 iterations */
  (function(){
    const root=$('#c5restart'),duo=el('div','duo');root.append(legend([[PINK,'best restart','box'],[BLUE,'other restarts','box']]),duo);
    const P=tspMake(100,456329),r=lcg(1282323),res=[];for(let k=0;k<30;k++)res.push(tspGreedy(P,50000,r));
    const best=res.reduce((a,b)=>b.c<a.c?b:a),cs=res.map(x=>x.c).sort((a,b)=>a-b);
    cell(duo,'Best of 30 restarts',tspMap(P,best.route,{r:2.6}),328,328,'Best route of 30 restarts on 100 cities','Length <b>'+best.c.toFixed(2)+'</b>.');
    const W=330,H=328,L0=48,B0=280,T0=16,lo=Math.floor(cs[0]*10)/10-0.1,hi=Math.ceil(cs[29]*10)/10+0.05,Y=v=>B0-(v-lo)/(hi-lo)*(B0-T0);let s='';
    const step=(hi-lo)>1?0.2:0.1;for(let v=Math.ceil(lo/step)*step;v<=hi+1e-9;v+=step)s+=line(L0,Y(v),W-8,Y(v),'#1e1e1e',1)+tx(L0-6,Y(v)+4.5,v.toFixed(1),{s:12.5,f:GRAY,a:'end'});
    cs.forEach((c,k)=>{const x=L0+8+k*9.2;s+='<circle cx="'+x.toFixed(1)+'" cy="'+Y(c).toFixed(1)+'" r="3.6" fill="'+(k===0?PINK:BLUE)+'"/>'});
    s+=line(L0,B0,W-8,B0,'#888',1.3)+tx((L0+W)/2,B0+22,'30 restarts, sorted by final cost',{s:13,f:GRAY})+tx(14,(T0+B0)/2,'final cost',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T0+B0)/2+')"'});
    cell(duo,'Final cost of each restart',s,W,H,'Final costs of 30 restarts, sorted','From <b>'+cs[0].toFixed(2)+'</b> to <b>'+cs[29].toFixed(2)+'</b>.');
  })();
};
QZ['5a']=()=>[
  {q:'How many different routes does a TSP with 6 cities have, counting a loop once whatever its starting city and direction?',
   o:['720','60','120','36'],a:1,
   e:'6! = 720 orderings, divided by 6 possible starting cities and 2 directions: 720 / 12 = 60.',
   h:'Count the orderings, then divide out the choices that describe the same loop.'}
];
QZ['5b']=()=>[
  {q:'<code>route = np.array([3, 0, 4, 1, 5, 2])</code>, so <code>n = 6</code>. Which two cities does edge <code>e = 5</code> join?',
   o:['2 and 3','5 and 2','2 and nothing: it is the last city','1 and 5'],a:0,
   e:'Edge e joins <code>route[e]</code> and <code>route[(e+1) % n]</code>: <code>route[5]</code> = 2 and <code>route[6 % 6]</code> = <code>route[0]</code> = 3. It is the comeback edge.',
   h:'Apply the formula with the modulus: what is (5 + 1) % 6?'}
];
QZ['5c']=()=>[
  {q:'<code>route = [0, 1, 2, 3, 4, 5, 6, 7]</code> and the move is (e1, e2) = (2, 6). What is <code>route</code> after <code>route[e1+1:e2+1] = route[e2:e1:-1]</code>?',
   o:['[0, 1, 6, 5, 4, 3, 2, 7]','[0, 1, 2, 6, 5, 4, 3, 7]','[0, 1, 2, 3, 6, 5, 4, 7]','[7, 6, 5, 4, 3, 2, 1, 0]'],a:1,
   e:'Positions 3 to 6 receive <code>route[6:2:-1]</code> = [6, 5, 4, 3]. Positions 0 to 2 and 7 are untouched: [0, 1, 2, 6, 5, 4, 3, 7].',
   h:'The slice on the left covers positions e1+1 to e2. The one on the right reads from e2 down to e1+1.'}
];
QZ['5d']=()=>[
  {q:'For a proposed move, the four distances are d(c11, c12) = 0.40, d(c21, c22) = 0.35 (the old edges), d(c11, c21) = 0.30 and d(c12, c22) = 0.50 (the new edges). What does greedy do?',
   o:['Accepts: Δc = −0.05','Rejects: Δc = +0.05','Accepts: Δc = +0.05','Rejects: Δc = −0.05'],a:1,
   e:'Δc = (0.30 + 0.50) − (0.40 + 0.35) = 0.80 − 0.75 = +0.05 &gt; 0: the route would get longer, so the move is rejected.',
   h:'New edges minus old edges; greedy accepts only when the result is ≤ 0.'}
];
QZ['5']=()=>[
  {q:'With n = 10 cities, the code draws e1 = 0 and e2 = 9. Why is the pair rejected?',
   o:['Because e1 must be positive','Because e2 is out of range','Because edges 9 and 0 are adjacent: they share the first city of the route','Because e2 − e1 is odd'],a:2,
   e:'Edge 9 joins <code>route[9]</code> to <code>route[0]</code>, and edge 0 starts at <code>route[0]</code>. The test <code>(e2+1) % n != e1</code> catches it: (9 + 1) % 10 = 0.',
   h:'Which city does edge n − 1 end at?'},
  {q:'Why does the efficient delta-cost not need to look at the reversed block of the route?',
   o:['Because the block is always short','Because distances are symmetric, so walking the block backwards gives the same length','Because the block is recomputed later in accept_move','Because the cost of the block is stored in the header'],a:1,
   e:'The block keeps the same edges, only traversed in the opposite direction, and d<sub>ij</sub> = d<sub>ji</sub>. Only the 4 edges at its two ends change.',
   h:'Compare the edges inside the block before and after the move.'},
  {q:'<code>x.shape</code> is <code>(n,)</code> and <code>xT = x.reshape((n,1))</code>. What is the shape of <code>xT - x</code>, and what is its element [i, j]?',
   o:['(n,), the element x<sub>i</sub> − x<sub>i</sub> = 0','(n, n), the element x<sub>j</sub> − x<sub>i</sub>','(n, 1), the element x<sub>i</sub> − x<sub>0</sub>','(n, n), the element x<sub>i</sub> − x<sub>j</sub>'],a:3,
   e:'(n, 1) with (n,) broadcasts to (n, n). Row i comes from xT (value x<sub>i</sub> repeated along the row), column j from x (value x<sub>j</sub>): element x<sub>i</sub> − x<sub>j</sub>.',
   h:'Recall lesson 3: which operand varies along the rows and which along the columns?'},
  {q:'Which statement about the nearest neighbour heuristic for the TSP is true, according to the slides?',
   o:['It is a partial buildup greedy: from the last chosen city it always goes to the closest unvisited one, and it works awfully','It always finds the optimal route','It is the random-search greedy with the swap-paths move','It needs the delta-cost to be O(1)'],a:0,
   e:'It builds the route one city at a time choosing the cheapest next step, with no way to undo early choices; the slides judge it very poor.',
   h:'Which of the two greedy families builds a configuration piece by piece?'},
  {q:'In the greedy loop, why does <code>c = c + delta_c</code> replace a call to <code>cost</code> after each accepted move?',
   o:['Because cost is wrong for long routes','Because delta_c is exact and O(1), while recomputing the cost from scratch is O(n)','Because the cost never changes','Because cost can only be called once'],a:1,
   e:'The delta-cost already gives the exact change, so the running cost stays correct without an O(n) recomputation.',
   h:'Compare the work done by the two expressions.'},
  {q:'The variable <code>best_c</code> starts at <code>np.inf</code>. Why?',
   o:['So that the first restart\'s cost is always stored as the best so far','Because costs are infinite at the start','To make the loop run forever','Because np.inf is the cost of a random route'],a:0,
   e:'Any real cost is smaller than infinity, so the test <code>c &lt; best_c</code> succeeds on the first restart and the best is initialized correctly.',
   h:'What happens to the comparison <code>c &lt; best_c</code> the first time it runs?'}
];
