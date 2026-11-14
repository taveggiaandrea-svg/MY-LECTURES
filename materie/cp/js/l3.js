/* Lesson 3: Monte Carlo pi, broadcasting, indexing, views and copies */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  const BBG='rgba(88,196,221,.14)',PBG='rgba(220,117,205,.2)',TBG='rgba(92,208,179,.2)',OBG='rgba(255,134,47,.2)',RBG='rgba(252,98,85,.22)';
  /* Monte Carlo estimate of pi with a slider on the number of points */
  (function(){
    const root=$('#c3mc'),N=10000,rnd=lcg(31415),P=new Float64Array(2*N),cum=new Int32Array(N+1);
    for(let i=0;i<N;i++){P[2*i]=rnd();P[2*i+1]=rnd();cum[i+1]=cum[i]+(P[2*i]*P[2*i]+P[2*i+1]*P[2*i+1]<=1?1:0)}
    root.append(legend([[BLUE,'inside: x² + y² ≤ 1','dot'],['#777','outside','dot'],[YEL,'quarter circle']]));
    const box=el('div');box.style.cssText='width:100%;max-width:24rem';const cv=el('canvas');cv.width=720;cv.height=720;
    cv.style.cssText='width:100%;height:auto;display:block';cv.setAttribute('role','img');cv.setAttribute('aria-label','Random points in the unit square, coloured by whether they fall inside the quarter circle');
    box.append(cv);root.append(box);const o=out();
    const ctx=cv.getContext('2d'),m=56,S=720-2*m;
    function draw(n){
      if(!ctx)return;ctx.fillStyle='#000';ctx.fillRect(0,0,720,720);
      const r=n<=100?8:n<=1000?4.5:2.6;
      for(let i=0;i<n;i++){const x=P[2*i],y=P[2*i+1];ctx.fillStyle=x*x+y*y<=1?BLUE:'#6a6a6a';ctx.beginPath();ctx.arc(m+x*S,m+S-y*S,r,0,2*Math.PI);ctx.fill()}
      ctx.strokeStyle='#bbb';ctx.lineWidth=2;ctx.strokeRect(m,m,S,S);
      ctx.strokeStyle=YEL;ctx.lineWidth=5;ctx.beginPath();ctx.arc(m,m+S,S,-Math.PI/2,0);ctx.stroke();
      ctx.fillStyle='#8c8c8c';ctx.font='26px Figtree, system-ui, sans-serif';ctx.textAlign='center';
      [0,0.5,1].forEach(v=>{ctx.fillText(String(v),m+v*S,m+S+34)});ctx.textAlign='right';[0.5,1].forEach(v=>{ctx.fillText(String(v),m-18,m+S-v*S+9)});
      const nin=cum[n],est=4*nin/n;
      o.innerHTML=K('\\Npts')+' = '+fk(n)+' points, '+K('\\Nin')+' = '+fk(nin)+' inside: '+K('\\piest = 4\\cdot '+nin+'/'+n+' = '+est.toFixed(4))+', off by <span class="num">'+Math.abs(est-Math.PI).toFixed(4)+'</span> from π.';
    }
    const nOf=k=>Math.round(Math.pow(10,1+k/10));
    root.append(sld('number of points n',0,30,1,20,k=>draw(nOf(k)),k=>fk(nOf(k))),o);draw(nOf(20));
  })();
  /* the vectorized line on eight points */
  (function(){
    const px=[0.12,0.85,0.40,0.93,0.55,0.20,0.71,0.66],py=[0.30,0.62,0.77,0.45,0.18,0.95,0.60,0.40];
    const r2=px.map((x,i)=>x*x+py[i]*py[i]),ins=r2.map(v=>v<=1),k=ins.filter(Boolean).length;
    const lx=200,cw=58,ch=34,y0_=34,W=lx+8*cw+14,H=y0_+4*ch+86;let s='';
    for(let j=0;j<8;j++)s+=tx(lx+j*cw+cw/2,22,'point '+(j+1),{s:12.5,f:GRAY});
    const rows=[['pxs',px.map(v=>v.toFixed(2)),()=>'#eee'],['pys',py.map(v=>v.toFixed(2)),()=>'#eee'],['pxs**2 + pys**2',r2.map(v=>v.toFixed(3)),()=>'#eee'],['… &lt;= 1',ins.map(b=>b?'True':'False'),j=>ins[j]?BLUE:'#8a8a8a']];
    rows.forEach((r,i)=>{const y=y0_+i*ch;s+=mono(lx-12,y+ch/2+5,r[0],{s:13.5,a:'end',f:'#fff'});
      r[1].forEach((v,j)=>{s+=rect(lx+j*cw,y,cw,ch,i===3?(ins[j]?BBG:'#111'):'#0d0d0d','#3a3a3a')+mono(lx+j*cw+cw/2,y+ch/2+5,v,{s:13,a:'middle',f:r[2](j)})})});
    const yb=y0_+4*ch+30;
    s+=mono(lx-12,yb,'np.sum(…)',{s:13.5,a:'end',f:'#fff'})+tx(lx,yb,'→ '+k+'  (each True counts as 1)',{s:14,a:'start',f:PTR})+
      mono(lx-12,yb+32,'4 * ninside / n_mc',{s:13.5,a:'end',f:'#fff'})+tx(lx,yb+32,'→ 4 · '+k+' / 8 = '+(4*k/8).toFixed(1),{s:14,a:'start',f:YEL});
    svgBox($('#c3mask'),W,H,s,'Eight points, their squared distance, the boolean comparison and the count','44rem');
  })();
  /* element-wise: same shape, and a function applied to each cell */
  (function(){
    const root=$('#c3same'),duo=el('div','duo');root.append(legend([[ARR,'first operand','box'],[LST,'second operand','box'],[PTR,'result','box']]),duo);
    const A=[[3,4,0],[1,2,2]],B=[[1,3,2],[2,5,1]],C=A.map((r,i)=>r.map((v,j)=>v*B[i][j]));
    const W=380,H=128,gy=30;
    let s=grid(8,gy,A,{f:ARR})+tx(124,gy+36,'*',{s:22,f:'#fff'})+grid(138,gy,B,{f:LST})+tx(254,gy+37,'=',{s:22,f:'#fff'})+grid(270,gy,C,{f:PTR,fill:()=>PBG});
    s+=tx(59,gy+84,'(2, 3)',{s:12.5,f:GRAY})+tx(189,gy+84,'(2, 3)',{s:12.5,f:GRAY})+tx(321,gy+84,'(2, 3)',{s:12.5,f:GRAY});
    cell(duo,'a * b, same shape',s,W,H,'Element-wise product of two 2 by 3 arrays','Cell by cell, e.g. 4 · 3 = 12. Not a matrix product.');
    const D=[[2,4,1],[1,2,2]],E=D.map(r=>r.map(v=>Math.log2(v).toFixed(1)));
    s=mono(8,gy+36,'np.log2(',{s:15,f:'#fff'})+grid(92,gy,D,{f:ARR})+mono(196,gy+36,')',{s:15,f:'#fff'})+tx(226,gy+37,'=',{s:22,f:'#fff'})+grid(244,gy,E,{f:PTR,fill:()=>PBG,cw:40});
    cell(duo,'np.log2(a), one function per cell',s,W,H,'log2 applied to each element of a 2 by 3 array','Each cell separately, e.g. log2(4) = 2.0.');
  })();
  /* three broadcasting cases: scalar, row, column */
  (function(){
    const root=$('#c3bc');root.append(legend([[ARR,'first operand','box'],[LST,'second operand','box'],['#777','virtual copy, never stored','dash'],[PTR,'result','box']]));
    const a=[[3,4,0],[1,2,2]],W=640,rh=114,gA=196,gB=342,gC=500;let s='';
    const rows=[
      {lab:'a * 3',sub:'3 is a scalar',A:a,dA:()=>false,B:[[3,3,3],[3,3,3]],dB:(i,j)=>i||j,shA:'(2, 3)',shB:'scalar → (2, 3)'},
      {lab:'a * b',sub:'b = [2, 4, 0]',A:a,dA:()=>false,B:[[2,4,0],[2,4,0]],dB:i=>i>0,shA:'(2, 3)',shB:'(3,) → (2, 3)'},
      {lab:'c * b',sub:'c = [[3], [1]]',A:[[3,3,3],[1,1,1]],dA:(i,j)=>j>0,B:[[2,4,0],[2,4,0]],dB:i=>i>0,shA:'(2, 1) → (2, 3)',shB:'(3,) → (2, 3)'}];
    rows.forEach((r,k)=>{const y=18+k*rh,C=r.A.map((row,i)=>row.map((v,j)=>v*r.B[i][j]));
      s+=mono(10,y+26,r.lab,{s:16,f:'#fff'})+mono(10,y+48,r.sub,{s:13,f:GRAY});
      s+=grid(gA,y,r.A,{f:ARR,dash:r.dA})+tx(gA+122,y+36,'*',{s:22,f:'#fff'})+grid(gB,y,r.B,{f:LST,dash:r.dB})+tx(gB+124,y+37,'=',{s:22,f:'#fff'})+grid(gC,y,C,{f:PTR,fill:()=>PBG});
      s+=tx(gA+51,y+82,r.shA,{s:12.5,f:GRAY})+tx(gB+51,y+82,r.shB,{s:12.5,f:GRAY})+tx(gC+51,y+82,'(2, 3)',{s:12.5,f:GRAY});
      if(k<2)s+=line(10,y+rh-12,W-10,y+rh-12,'#1f1f1f',1)});
    svgBox(root,W,18+3*rh-10,s,'Broadcasting a scalar, a row and a column against a 2 by 3 array','44rem');
  })();
  /* the general rules: align on the right, pad, stretch */
  (function(){
    const root=$('#c3rules'),duo=el('div','duo');root.append(legend([[HDR,'padded size 1','box'],[VW,'size 1 stretched','box'],[PTR,'result','box'],[RED,'incompatible','box']]),duo);
    const W=330,H=244,cx=128,cw=56,ch=32;
    const c=(col,row,v,o)=>{o=o||{};const x=cx+col*cw,y=22+row*54;return rect(x,y,cw-6,ch,o.bg||'#0d0d0d',o.st||'#555')+tx(x+(cw-6)/2,y+ch/2+5,v,{s:15,f:o.f||'#eee'})+(o.note?tx(x+(cw-6)/2,y+ch+13,o.note,{s:13,f:o.nf||VW}):'')};
    const lab=(row,t)=>mono(cx-12,22+row*54+ch/2+5,t,{s:13.5,a:'end',f:'#fff'});
    let s=lab(0,'a')+c(0,0,3)+c(1,0,2)+c(2,0,1,{bg:TBG,st:VW,f:VW,note:'→ 4'});
    s+=lab(1,'b')+c(1,1,2)+c(2,1,4);
    s+=lab(2,'b padded')+c(0,2,1,{bg:OBG,st:HDR,f:HDR,note:'→ 3'})+c(1,2,2)+c(2,2,4);
    s+=lab(3,'a + b')+c(0,3,3,{bg:PBG,st:PTR,f:PTR})+c(1,3,2,{bg:PBG,st:PTR,f:PTR})+c(2,3,4,{bg:PBG,st:PTR,f:PTR});
    cell(duo,'(3, 2, 1) + (2, 4)',s,W,H,'Shapes 3,2,1 and 2,4 broadcast to 3,2,4','<span class="ok">Works:</span> result shape (3, 2, 4).');
    s=lab(0,'a')+c(1,0,2)+c(2,0,3,{bg:RBG,st:RED,f:RED});
    s+=lab(1,'b')+c(2,1,2,{bg:RBG,st:RED,f:RED});
    s+=lab(2,'b padded')+c(1,2,1,{bg:OBG,st:HDR,f:HDR,note:'→ 2'})+c(2,2,2,{bg:RBG,st:RED,f:RED});
    s+=lab(3,'a + b')+c(1,3,2,{bg:PBG,st:PTR,f:PTR})+c(2,3,'✕',{bg:RBG,st:RED,f:RED});
    cell(duo,'(2, 3) + (2,)',s,W,H,'Shapes 2,3 and 2 cannot be broadcast','<span class="bad">Error:</span> 3 and 2 on the last axis, neither is 1.');
  })();
  /* scaling analysis of the Monte Carlo estimate */
  (function(){
    const root=$('#c3scale'),duo=el('div','duo');root.append(legend([[BLUE,'mean ± one standard deviation'],[RED,'π ± 1.7/√n'],['#fff','π','dash']]),duo);
    const gam=x=>Math.abs(x-1)<1e-9?1:Math.abs(x-0.5)<1e-9?Math.sqrt(Math.PI):(x-1)*gam(x-1);
    const est=(n,d,rnd)=>{let k=0;for(let i=0;i<n;i++){let q=0;for(let t=0;t<d;t++){const u=rnd();q+=u*u}if(q<=1)k++}
      return k?Math.pow(Math.pow(2,d)*gam(d/2+1)*k/n,2/d):0};
    const stats=v=>{const m=v.reduce((a,b)=>a+b,0)/v.length,sd=Math.sqrt(v.reduce((a,b)=>a+(b-m)*(b-m),0)/v.length);return [m,sd]};
    const rnd=lcg(2718);
    const ns=[];for(let k=0;k<8;k++)ns.push(Math.round(Math.pow(10,2+3*k/7)));
    const r1_=ns.map(n=>stats(Array.from({length:50},()=>est(n,2,rnd))));
    const ds=[2,3,4,5,6,7,8,9,10],r2_=ds.map(d=>stats(Array.from({length:10},()=>est(10000,d,rnd))));
    const W=330,H=262,L0=50,R0=W-12,T0=12,B0=H-48,ylo=2.7,yhi=3.6,Y=v=>B0-(clamp(v,ylo,yhi)-ylo)/(yhi-ylo)*(B0-T0);
    const frame=(xt,xl)=>{let s='';[2.8,3,3.2,3.4,3.6].forEach(v=>{s+=line(L0,Y(v),R0,Y(v),'#1c1c1c',1)+tx(L0-7,Y(v)+4.5,v.toFixed(1),{s:12.5,f:GRAY,a:'end'})});
      xt.forEach(([x,t])=>{s+=tx(x,B0+18,t,{s:12.5,f:GRAY})});
      s+='<path d="M'+L0+' '+T0+'V'+B0+'H'+R0+'" fill="none" stroke="#fff" stroke-width="1.3"/>'+line(L0,Y(Math.PI),R0,Y(Math.PI),'#fff',1.2,' stroke-dasharray="5 4" opacity=".75"');
      return s+tx((L0+R0)/2,H-8,xl,{s:13,f:GRAY})+tx(14,(T0+B0)/2,'estimate of π',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T0+B0)/2+')"'})};
    const bar=(x,[m,sd])=>line(x,Y(m-sd),x,Y(m+sd),BLUE,2.2)+line(x-4,Y(m-sd),x+4,Y(m-sd),BLUE,2)+line(x-4,Y(m+sd),x+4,Y(m+sd),BLUE,2)+'<circle cx="'+x.toFixed(1)+'" cy="'+Y(m).toFixed(1)+'" r="3.8" fill="'+BLUE+'"/>';
    const X1=n=>L0+12+(Math.log10(n)-2)/3*(R0-L0-24);
    let s=frame([[X1(100),'100'],[X1(1000),'1,000'],[X1(10000),'10,000'],[X1(100000),'100,000']],'number of points n (log scale)');
    [1,-1].forEach(sg=>{const pts=[];for(let k=0;k<=60;k++){const n=Math.pow(10,2+3*k/60);pts.push(X1(n).toFixed(1)+' '+Y(Math.PI+sg*1.7/Math.sqrt(n)).toFixed(1))}s+='<path d="M'+pts.join('L')+'" fill="none" stroke="'+RED+'" stroke-width="1.8"/>'});
    ns.forEach((n,k)=>{s+=bar(X1(n),r1_[k])});
    cell(duo,'d = 2, more and more points',s,W,H,'Mean and spread of the estimate of pi as the number of points grows','Bars shrink like 1/√n.');
    const X2=d=>L0+14+(d-2)/8*(R0-L0-28);
    s=frame(ds.map(d=>[X2(d),String(d)]),'dimension d (n = 10,000)');
    ds.forEach((d,k)=>{s+=bar(X2(d),r2_[k])});
    cell(duo,'n = 10,000, more and more dimensions',s,W,H,'Mean and spread of the estimate of pi as the dimension grows','Bars grow with d: fewer points fall inside.');
  })();
  /* views and copies: the same write into three kinds of result */
  (function(){
    const root=$('#c3view'),trio=el('div','trio');root.append(legend([[VW,'view: shares the data of a','box'],[ARR,'independent copy','box'],[PTR,'the value written','box']]),trio);
    const W=250,H=214,cw=40,ax=25,ay=40,bx=65,by=150,ch=32;
    const panel=(view,mask,id)=>{let s='';const A=[0,1,view?999:2,3,4],src=[0,2,4];
      src.forEach((j,k)=>{const x1=bx+k*cw+cw/2,x2=ax+j*cw+cw/2;
        s+=view?line(x1,by,x2,ay+ch,VW,2):line(x2,ay+ch+(mask?22:4),x1,by-4,'#555',1.3,' stroke-dasharray="4 4"')});
      s+=mono(ax-8,ay+ch/2+5,'a',{s:15,a:'end',f:'#fff'});
      A.forEach((v,j)=>{const hit=view&&j===2;s+=rect(ax+j*cw,ay,cw,ch,hit?TBG:'#0d0d0d',hit?VW:'#555')+tx(ax+j*cw+cw/2,ay+ch/2+5,v,{s:v>99?12.5:15,f:hit?VW:'#eee',w:hit?600:null})});
      if(mask)'TFTFT'.split('').forEach((t,j)=>{s+=mono(ax+j*cw+cw/2,ay+ch+17,t,{s:13,a:'middle',f:t==='T'?BLUE:'#777'})});
      s+=mono(bx-8,by+ch/2+5,'b',{s:15,a:'end',f:'#fff'});
      [0,999,4].forEach((v,k)=>{const w=k===1;s+=rect(bx+k*cw,by,cw,ch,w?PBG:(view?TBG:BBG),w?PTR:(view?VW:ARR))+tx(bx+k*cw+cw/2,by+ch/2+5,v,{s:v>99?12.5:15,f:w?PTR:'#eee',w:w?600:null})});
      s+=mono(W/2,by+ch+26,'b[1] = 999',{s:13,a:'middle',f:'#bbb'});
      return s};
    cell(trio,'b = a[0:5:2]',panel(true,false),W,H,'A slice is a view: writing into b changes a','<span style="color:var(--teal);font-weight:600">View:</span> <code>b.base is a</code>. Now <code>a[2]</code> is 999.');
    cell(trio,'b = a[[0, 2, 4]]',panel(false,false),W,H,'Indexing with a list copies: a is unchanged','<b>Copy:</b> <code>b.base</code> is None. <code>a</code> is unchanged.');
    cell(trio,'b = a[a % 2 == 0]',panel(false,true),W,H,'Indexing with a mask copies: a is unchanged','<b>Copy:</b> the mask picks 0, 2, 4. <code>a</code> is unchanged.');
  })();
};
QZ['3a']=()=>[
  {q:'<code>v = np.array([3, -1, 2, 5])</code>. What does <code>np.sum(v &gt; 0)</code> give?',
   o:['9','[True, False, True, True]','3','4'],a:2,
   e:'<code>v &gt; 0</code> is [True, False, True, True]; summing booleans counts the Trues: 3.',
   h:'First work out the boolean array, then remember what True and False are worth in a sum.'}
];
QZ['3b']=()=>[
  {q:'Exercise 5 of the course: you rebuilt an array <code>b</code> of length 6 and want to check that it equals the original <code>a</code>. Which check works?',
   o:['<code>assert a == b</code>','<code>assert a is b</code>','<code>assert np.array_equal(a, b)</code>','<code>assert a + b</code>'],a:2,
   e:'<code>a == b</code> broadcasts and returns six booleans, which assert cannot turn into one truth value (numpy raises an error). <code>a is b</code> asks whether they are the same object, which they are not. <code>np.array_equal</code>, or <code>np.all(a == b)</code>, compares the whole arrays.',
   h:'What kind of object does <code>==</code> return when both sides are arrays?'}
];
QZ['3c']=()=>[
  {q:'Arrays with shapes (4, 1) and (3,) are added. What is the shape of the result?',
   o:['(4, 1)','(4, 3)','(3, 4)','An error'],a:1,
   e:'(3,) is padded to (1, 3). Axis 0: 4 and 1, so 4. Axis 1: 1 and 3, so 3. Result (4, 3), like the column times row case in the figure.',
   h:'Align the shapes on the right and pad the shorter one with 1 at the front.'}
];
QZ['3d']=()=>[
  {q:'With n = 10,000 points, why does the estimate of π get worse as the dimension d grows?',
   o:['Because the formula for the volume of the ball is wrong for large d','Because random numbers are less random in many dimensions','Because numpy overflows when d is large','Because the fraction of the cube inside the ball shrinks fast, so very few points are inside to count'],a:3,
   e:'The fraction is V<sub>d</sub>/2<sup>d</sup>: about 0.79 for d = 2 but 0.0025 for d = 10, about 25 points out of 10,000. A count of 25 fluctuates a lot, and the estimate with it.',
   h:'Compare how many of the 10,000 points fall inside the ball in 2 and in 10 dimensions.'}
];
QZ['3e']=()=>[
  {q:'A theory question of the course: <code>x = np.arange(10)</code>, <code>y = x[[1,3,5,7,9]]</code>, <code>z = x[1::2]</code>. What is the main difference between <code>y</code> and <code>z</code>?',
   o:['They hold different values','<code>y</code> is a view and <code>z</code> a copy','<code>y</code> has 5 elements and <code>z</code> has 4','They hold the same values, but <code>y</code> is an independent copy and <code>z</code> is a view of <code>x</code>'],a:3,
   e:'Both contain 1, 3, 5, 7, 9. Indexing with a list gives independent data; the slice gives a view, so writing into <code>z</code> changes <code>x</code>.',
   h:'Look at the rules table: which kind of index produces a view?'}
];
QZ['3f']=()=>[
  {q:'A theory question of the course: <code>y</code> is a view of <code>x</code>. How can you check it, and what happens to <code>x</code> if you change an element of <code>y</code>?',
   o:['<code>y.base is x</code> is True, and the change also appears in <code>x</code>','<code>y == x</code> is True, and <code>x</code> does not change','<code>y.copy() is x</code>, and the change appears in <code>x</code>','<code>x.base is y</code> is True, and <code>x</code> does not change'],a:0,
   e:'A view stores a reference to the array it views in <code>.base</code>. Since it shares the data, writing into the view writes into the original.',
   h:'Which attribute points from a view to the array that owns the data?'}
];
QZ['3g']=()=>[
  {q:'Exercise 4: which of these does <em>not</em> build an integer array of length <code>n</code> filled with −1?',
   o:['<code>np.full(n, -1)</code>','<code>-np.ones(n, dtype=int)</code>','<code>np.array([-1]) * n</code>','<code>np.zeros(n, dtype=int) - 1</code>'],a:2,
   e:'<code>np.array([-1]) * n</code> multiplies the single element by n, giving the one-element array [−n]. The other three are among the ways in the official solution: a dedicated constructor, a negation, and a broadcast subtraction.',
   h:'For an array, <code>*</code> with a number is not repetition, as it would be for a list.'},
  {q:'Exercise 7: <code>a = np.array([4, 3, 6, 8, 9])</code>, <code>n = 5</code>. Which single slice gives the first half in reverse, [3, 4]? (With n odd the middle element belongs to the second half.)',
   o:['<code>a[:n//2:-1]</code>','<code>a[(n//2-1)::-1]</code>','<code>a[n//2::-1]</code>','<code>a[::-1][:n//2]</code>'],a:1,
   e:'With a negative step you start from the last element of the first half, index n//2 − 1 = 1, and go down to the beginning: [3, 4]. <code>a[n//2::-1]</code> would include the middle 6, and the other two read from the end of the array.',
   h:'With step −1 the start index is the first element you get. Which index is the last element of the first half?'},
  {q:'Exercise 8: <code>x = np.array([4, 6, 1])</code>. What is <code>x[[2, 0, 1, 0, 0, 1]]</code>?',
   o:['An error: the index list is longer than the array','[1, 4, 6]','[1, 4, 6, 4, 4, 6]','[4, 6, 1, 4, 6, 1]'],a:2,
   e:'Each entry of the index list picks one element, repetitions included, so the result has 6 elements: x[2], x[0], x[1], x[0], x[0], x[1].',
   h:'Indexing with a list builds a new array with one element per entry of the list.'},
  {q:'Exercise 12: <code>a = np.zeros(5, dtype=int)</code>, then <code>a[0] = 5.7</code>. What is <code>a[0]</code>?',
   o:['5','5.7','6','An error'],a:0,
   e:'The array keeps its integer type, so the float is converted on assignment by dropping the decimal part: 5, as in the official solution. The array does not change type to fit the value.',
   h:'Can an assignment change the dtype of an existing array?'},
  {q:'Exercise 15: which line makes every element of <code>a</code> non-negative, using masks both to read and to assign?',
   o:['<code>a = a[a &gt;= 0]</code>','<code>a[a &lt; 0] = 0</code>','<code>a = -a</code>','<code>mask = a &lt; 0; a[mask] = -a[mask]</code>'],a:3,
   e:'The mask marks the negative entries; <code>-a[mask]</code> reads them and flips their sign, and the assignment writes them back in the same places. The first option drops elements, the second changes values, the third flips the positive ones too.',
   h:'You want to keep every element and its size, and only change the sign of some.'}
];
QZ['3']=()=>[
  {q:'Exercise 16 of the course: <code>a = np.zeros(7)</code>, then <code>a[1::2] = 1</code>. What is <code>a</code>?',
   o:['[1, 0, 1, 0, 1, 0, 1]','[0, 1, 0, 1, 0, 1, 0]','[0, 1, 1, 1, 1, 1, 1]','An error: 1 is a scalar and the slice has 3 elements'],a:1,
   e:'<code>1::2</code> selects the odd positions 1, 3, 5; the scalar 1 is broadcast into all of them (and converted to 1.0).',
   h:'Which positions does <code>1::2</code> select in an array of length 7? And can a scalar be assigned to several cells at once?'},
  {q:'Exercise 11 of the course: <code>s = np.random.rand(10)</code> and <code>a[s &lt; 0.3]</code> picks elements of a length-10 array. Over many calls, what is the average length of the result?',
   o:['0.3','10','7','3'],a:3,
   e:'Each element is kept with probability 0.3, so the expected length is n · r = 10 · 0.3 = 3.',
   h:'A uniform number in [0, 1) is below 0.3 with probability 0.3.'},
  {q:'<code>x = np.arange(10)</code>, <code>z = x[::-1]</code>, <code>z[0] = 100</code>. What is <code>x[9]</code>?',
   o:['9','100','0','An error'],a:1,
   e:'<code>x[::-1]</code> is a slice, so a view that reads <code>x</code> backwards. <code>z[0]</code> is the same memory as <code>x[9]</code>, which becomes 100.',
   h:'Is a reversed slice a view or a copy? Which element of x does z[0] point to?'},
  {q:'Exercise 23 of the course: <code>t = np.arange(5) + np.arange(3).reshape(3,1)</code>. What is <code>t[2,4]</code>?',
   o:['6','8','4','2'],a:0,
   e:'Shapes (5,) and (3, 1) broadcast to (3, 5), and <code>t[i,j] = j + i</code>. So <code>t[2,4]</code> = 4 + 2 = 6.',
   h:'Work out the shape first, then which numbers are added in row 2, column 4.'},
  {q:'You estimate π in 2 dimensions with n = 10,000 points. Following the solution\'s curves, about how far from π is a typical estimate?',
   o:['about 0.17','about 0.0017','about 0.017','about 1.7'],a:2,
   e:'The spread is about 1.7/√n = 1.7/100 = 0.017.',
   h:'The red curves in the scaling figure give the typical spread as a function of n.'},
  {q:'What does <code>np.sqrt(-2.0)</code> do?',
   o:['Raises an error, like math.sqrt','Returns nan and prints a RuntimeWarning','Returns the complex number 1.414j','Returns −1.414'],a:1,
   e:'numpy returns nan (not a number) with a warning instead of stopping. That is why the slides insist: never ignore warnings.',
   h:'numpy prefers not to stop the program when a value falls outside a function\'s domain. What special value could it return instead?'}
];
