/* Lesson 6: a generic optimizer, in-place changes, shallow and deep copies, fair moves, Latin squares */
INIT[6]=function(){
  codeHL($('#lezione-6'));
  const BBG='rgba(88,196,221,.14)',PBG='rgba(220,117,205,.2)',GBG='rgba(131,193,103,.22)',RBG='rgba(252,98,85,.22)';
  const arr=(x,y,vals,o)=>{o=o||{};const cw=o.cw||30;let s='';vals.forEach((v,i)=>{s+=rect(x+i*cw,y,cw,28,o.bg||BBG,o.st||'#555')+tx(x+i*cw+cw/2,y+19,v,{s:14,f:o.f||'#eee'})});return s};
  const name=(x,y,t,c)=>rect(x,y,96,28,'#141414',c||'#888')+mono(x+48,y+19,t,{s:13.5,a:'middle',f:'#fff'});
  const curve=(x1,y1,x2,y2,c,id,dash)=>'<path d="M'+x1+' '+y1+'C'+(x1+40)+' '+y1+' '+(x2-40)+' '+y2+' '+(x2-6)+' '+y2+'" fill="none" stroke="'+c+'" stroke-width="2"'+(dash?' stroke-dasharray="4 4"':'')+' marker-end="url(#'+id+')"/>';
  /* two names, one array */
  (function(){
    const root=$('#c6alias'),trio=el('div','trio');root.append(legend([[PINK,'name refers to'],[BLUE,'array data','box'],[ORG,'value written','box']]),trio);
    const W=290,H=190;
    const panel=(k,id)=>{let s=arrowM(id,PINK)+arrowM(id+'g','#666');
      s+=name(6,30,'self.route',PINK)+name(6,110,'route',PINK);
      const A=k===1?[7,7,7,7]:[3,0,2,1];s+=arr(170,66,A,{bg:k===1?'rgba(255,134,47,.22)':BBG,st:k===1?ORG:'#555',f:k===1?ORG:'#eee',cw:28});
      s+=curve(102,44,170,80,PINK,id);
      if(k===2){s+=arr(170,146,[9,9,9,9],{cw:28})+curve(102,124,170,160,PINK,id)+curve(102,124,170,86,'#666',id+'g',true)}
      else s+=curve(102,124,170,84,PINK,id);
      return s};
    cell(trio,'route = self.route',panel(0,'c6a1'),W,H,'Two names refer to the same array','One array, two names.');
    cell(trio,'route[:] = 7',panel(1,'c6a2'),W,H,'Writing through route changes the shared array','The shared data change: <code>self.route</code> sees 7s.');
    cell(trio,'route = np.full(4, 9)',panel(2,'c6a3'),W,H,'Rebinding route leaves self.route unchanged','Only the name moves: <code>self.route</code> is unchanged.');
  })();
  /* three ways to save the best object */
  (function(){
    const root=$('#c6copy'),trio=el('div','trio');root.append(legend([[PINK,'refers to'],[RED,'saved route overwritten','box'],[GRN,'saved route intact','box']]),trio);
    const W=290,H=260;
    const obj=(x,y,t,c)=>rect(x,y,104,58,'#141414',c)+mono(x+52,y+18,t,{s:13,a:'middle',f:c})+mono(x+12,y+44,'.route',{s:13,f:'#bbb'})+'<circle cx="'+(x+88)+'" cy="'+(y+40)+'" r="4" fill="'+PINK+'"/>';
    const panel=(k,id)=>{let s=arrowM(id,PINK);
      s+=name(4,18,'probl','#888')+name(4,206,'best_probl','#888');
      const newR=[5,2,0,4,1,3],oldR=[1,3,5,0,2,4];
      if(k===0){s+=obj(132,96,'TSP object','#bbb')+curve(100,32,132,112,PINK,id)+curve(100,220,132,126,PINK,id)+arr(132,186,newR,{cw:26,bg:RBG,st:RED,f:RED})+curve(220,136,200,186,PINK,id)}
      else{s+=obj(132,14,'TSP object','#bbb')+obj(132,126,k===1?'shallow copy':'deep copy','#bbb')+curve(100,32,132,30,PINK,id)+curve(100,220,132,146,PINK,id);
        s+=arr(132,82,newR,{cw:26,bg:k===1?RBG:BBG,st:k===1?RED:'#555',f:k===1?RED:'#eee'});
        s+=curve(220,54,214,82,PINK,id);
        if(k===1)s+='<path d="M220 166C262 166 262 116 238 112" fill="none" stroke="'+PINK+'" stroke-width="2" marker-end="url(#'+id+')"/>';
        else{s+=arr(132,200,oldR,{cw:26,bg:GBG,st:GRN,f:GRN})+curve(220,166,214,200,PINK,id)}}
      return s};
    cell(trio,'best_probl = probl',panel(0,'c6c1'),W,H,'No copy: one object with two names','<span class="bad">Lost:</span> one object, overwritten by the next restart.');
    cell(trio,'copy.copy(probl)',panel(1,'c6c2'),W,H,'Shallow copy shares the route array','<span class="bad">Lost:</span> two objects, one shared route.');
    cell(trio,'copy.deepcopy(probl)',panel(2,'c6c3'),W,H,'Deep copy owns its route','<span class="ok">Safe:</span> the copy has its own route.');
  })();
  /* moves without rejection: the ring of edges */
  (function(){
    const root=$('#c6ring');root.append(legend([[RED,'invalid partner for e1','box'],[TEAL,'valid e2, one per value of r','box']]));
    const n=10,e1=8,W=420,H=410,cx=210,cy=180,R=140,ang=k=>(-90+k*36)*Math.PI/180;let s=arrowM('c6r','#888');
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#333" stroke-width="2"/>';
    for(let k=0;k<n;k++){const bad=k===e1||k===(e1+1)%n||k===(e1+n-1)%n,x=cx+R*Math.cos(ang(k)),y=cy+R*Math.sin(ang(k));
      s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="17" fill="'+(bad?RBG:'rgba(92,208,179,.2)')+'" stroke="'+(bad?RED:TEAL)+'" stroke-width="2.2"/>'+tx(x.toFixed(1),(y+5).toFixed(1),k,{s:15,f:'#fff',w:600});
      if(!bad){const r=(k-e1-2+2*n)%n,ix=cx+(R-84)*Math.cos(ang(k)),iy=cy+(R-84)*Math.sin(ang(k)),sx=cx+(R-62)*Math.cos(ang(k)),sy=cy+(R-62)*Math.sin(ang(k));
        s+=line(sx.toFixed(1),sy.toFixed(1),(cx+(R-22)*Math.cos(ang(k))).toFixed(1),(cy+(R-22)*Math.sin(ang(k))).toFixed(1),'#666',1.5,' marker-end="url(#c6r)"')+lbl(ix.toFixed(1),(iy+5).toFixed(1),'r = '+r,TEAL,{s:13})}}
    s+=tx(cx,cy+6,'e1 = 8',{s:16,f:'#fff',w:600})+mono(cx,cy+R+46,'e2 = (e1 + 2 + r) % 10',{s:14,a:'middle',f:'#bbb'});
    svgBox(root,W,H,s,'Ring of ten edges: the seven valid partners of edge 8, one for each random value','28rem');
  })();
  /* exercise 2: exact pair probabilities */
  (function(){
    const root=$('#c6wrong'),duo=el('div','duo');root.append(legend([[PINK,'probability of the pair (brighter = more likely)','box']]),duo);
    const n=10,p1=(i,j)=>i<j?2/(n*n-n):0,p2=(i,j)=>i<j&&i<n-1?1/(n-1)/(n-1-i):0,mx=p2(n-2,n-1),cw=30,gx=30,gy=26,W=gx+n*cw+8;
    const panel=f=>{let s='';for(let i=0;i<n;i++){s+=tx(gx-7,gy+i*cw+cw/2+4.5,i,{s:12.5,f:GRAY,a:'end'});
      for(let j=0;j<n;j++){const p=f(i,j);s+=rect(gx+j*cw,gy+i*cw,cw,cw,p?'rgba(220,117,205,'+(0.06+0.9*p/mx).toFixed(3)+')':'#0b0b0b','#1e1e1e');
        if(p&&(j===n-1||(i===0&&j===1)))s+=tx(gx+j*cw+cw/2,gy+i*cw+cw/2+4.5,Math.round(p*1000)/10,{s:12,f:p/mx>0.55?'#000':'#fff'})}}
      for(let j=0;j<n;j++)s+=tx(gx+j*cw+cw/2,gy-8,j,{s:12.5,f:GRAY});
      s+=tx(gx+n*cw/2,gy+n*cw+22,'e2 (columns), e1 (rows); numbers in %',{s:12.5,f:GRAY});return s};
    cell(duo,'Draw, reject, sort (correct)',panel(p1),W,gy+n*cw+30,'Uniform probability over all valid pairs','Every pair: <b>2.2%</b>. Uniform.');
    cell(duo,'randint(n-1), then randint(e1+1, n)',panel(p2),W,gy+n*cw+30,'Biased probabilities: large e1 pairs are favoured','From <b>1.2%</b> (row 0) to <b>11.1%</b> (pair 8, 9).');
  })();
  /* Latin squares: the exercise's example and two cost functions for a row */
  (function(){
    const root=$('#c6latin'),duo=el('div','duo');root.append(legend([[GRN,'row or column valid','box'],[RED,'violates the rule','box']]),duo);
    const T=[[0,1,2],[1,2,2],[1,0,2]],n=3,cw=46,gx=86,gy=30,ok=a=>new Set(a).size===a.length;
    let s='';const rows=T.map(ok),cols=[0,1,2].map(j=>ok(T.map(r=>r[j])));
    T.forEach((r,i)=>r.forEach((v,j)=>{s+=rect(gx+j*cw,gy+i*cw,cw,cw,!rows[i]||!cols[j]?'rgba(252,98,85,.28)':'#0d0d0d','#555')+tx(gx+j*cw+cw/2,gy+i*cw+cw/2+6,v,{s:18,f:'#fff'})}));
    rows.forEach((o,i)=>{s+=tx(gx+n*cw+18,gy+i*cw+cw/2+6,o?'✓':'✕',{s:18,f:o?GRN:RED,w:600})});
    cols.forEach((o,j)=>{s+=tx(gx+j*cw+cw/2,gy+n*cw+24,o?'✓':'✕',{s:18,f:o?GRN:RED,w:600})});
    [0,1,2].forEach(i=>{s+=tx(gx-12,gy+i*cw+cw/2+5,'row '+i,{s:12.5,f:GRAY,a:'end'})});
    const cost=rows.filter(o=>!o).length+cols.filter(o=>!o).length;
    s+=tx(gx+n*cw/2,gy+n*cw+56,'cost = '+cost,{s:16,f:YEL,w:600});
    cell(duo,'Cost: rows and columns that violate',s,300,250,'A 3 by 3 table with cost 3','Row 1 and columns 0 and 2: cost <b>'+cost+'</b>.');
    const R=[[0,0,0,0,0],[0,4,2,1,1]],c1=a=>a.length!==new Set(a).size?1:0,c3=a=>a.length-new Set(a).size;
    let t=tx(150,24,'exercises 4, 5',{s:12.5,f:GRAY})+tx(230,24,'exercise 6',{s:12.5,f:GRAY});
    R.forEach((r,k)=>{const y=42+k*86;r.forEach((v,j)=>{t+=rect(10+j*24,y,24,30,'#0d0d0d','#555')+tx(22+j*24,y+20,v,{s:14,f:'#fff'})});
      t+=tx(150,y+21,c1(r),{s:18,f:YEL,w:600})+tx(230,y+21,c3(r),{s:18,f:YEL,w:600})+tx(70,y+50,k?'almost correct':'completely wrong',{s:12.5,f:GRAY})});
    t+=tx(150,224,'1 if wrong',{s:12.5,f:GRAY})+tx(230,224,'n − distinct',{s:12.5,f:GRAY});
    cell(duo,'Two costs for one row (n = 5)',t,280,236,'Two rows of length 5 under two cost functions','The refined cost tells them apart: <b>4</b> versus <b>1</b>.');
  })();
};
QZ['6a']=()=>[
  {q:'You write a new class for a different problem and want to use the course\'s <code>greedy</code> unchanged. What must the class provide?',
   o:['A subclass of TSP','A route attribute and a dist matrix','The methods init_config, cost, propose_move, compute_delta_cost, accept_move and copy (display is optional)','A function called greedy'],a:2,
   e:'The optimizer only calls these methods, so any object that implements them, with the same meaning, can be optimized. Nothing about routes or distances is required.',
   h:'Read which calls appear inside the greedy loop.'}
];
QZ['6b']=()=>[
  {q:'Inside a method: <code>route = self.route</code>, then <code>route = np.random.permutation(self.n)</code>. What happens to <code>self.route</code>?',
   o:['It is unchanged: the second line only gives the name route a new array','It becomes the new permutation','It is deleted','It becomes a view of the new permutation'],a:0,
   e:'Assigning to a name rebinds the name. To change the shared data you must write into it, as <code>init_config</code> does with <code>self.route[:] = ...</code>.',
   h:'Is the second line writing into an array, or giving a name a new value?'}
];
QZ['6c']=()=>[
  {q:'Why would <code>best_probl = copy.copy(probl)</code> (a shallow copy) still lose the best route?',
   o:['Because copy.copy only copies numbers','Because the copy and the original share the same route array, which the next restart overwrites in place','Because shallow copies are read-only','Because copy.copy returns the same object'],a:1,
   e:'A shallow copy is a new object whose attributes refer to the same values; its <code>route</code> is the very array that <code>init_config</code> and <code>accept_move</code> modify in place.',
   h:'Which attributes are duplicated by a shallow copy, and which are only shared?'}
];
QZ['6d']=()=>[
  {q:'With n = 10, the line <code>e2 = (e1 + 2 + np.random.randint(n-3)) % n</code> is run with <code>e1 = 8</code>. Which values can e2 take?',
   o:['0 to 9 except 8','10 to 16','2 to 8','0 to 6'],a:3,
   e:'<code>np.random.randint(7)</code> gives 0 to 6, so e1 + 2 + that is 10 to 16, and modulo 10 that is 0 to 6. The excluded values are 7, 8 and 9: e1 itself and its two neighbours on the ring.',
   h:'Find the smallest and largest value before the modulus is applied.'}
];
QZ['6e']=()=>[
  {q:'Exercise 5 starts from a table whose columns are all 0, 1, …, n−1 in order. What is its cost (rows plus columns that violate the rule), for n &gt; 1?',
   o:['0','2n','n','1'],a:2,
   e:'Every column is valid. Each row repeats one value n times, so every row is wrong: cost n, one per row.',
   h:'Write the table for n = 3 and check rows and columns separately.'}
];
QZ['6']=()=>[
  {q:'Exercise 3: the move swaps two cities that are <em>not</em> adjacent along the route, say the route goes … a, i, b … c, j, d …. How many edges change length in the delta-cost?',
   o:['2','4','6','All n'],a:1,
   e:'The edges (a, i), (i, b), (c, j) and (j, d) are replaced by (a, j), (j, b), (c, i) and (i, d): four edges out, four in. If i and j are adjacent the edge between them survives, which is one of the special cases the exercise warns about.',
   h:'Write the route around each of the two cities before and after the swap, and compare the edges.'},
  {q:'Why does version 4 make <code>propose_move</code> return a tuple <code>(e1, e2)</code> instead of a new route?',
   o:['Because tuples are faster to print','Because most proposals are rejected, and encoding a move is O(1) while building a new route is O(n)','Because routes cannot be returned from methods','Because the tuple is the new route'],a:1,
   e:'The move is evaluated by compute_delta_cost before anything is changed; the O(n) work of accept_move is paid only for accepted moves.',
   h:'Compare the work spent on a rejected proposal in the two designs.'},
  {q:'What does the <code>debug_delta_cost</code> option check?',
   o:['That the cost is positive','That the move is valid','That the current cost plus delta_c equals the cost of a copy on which the move was really accepted','That copy() returns a deep copy'],a:2,
   e:'It applies the move to a copy and compares the cost from scratch with c + delta_c, within 1e-10. It tests the fast formula against the slow, obvious one.',
   h:'Read the assert line in the code.'},
  {q:'<code>a = np.zeros(3)</code>; <code>b = a</code>; <code>b[0] = 5</code>; <code>b = np.ones(3)</code>. What is <code>a</code>?',
   o:['[0, 0, 0]','[5, 0, 0]','[1, 1, 1]','[5, 1, 1]'],a:1,
   e:'<code>b[0] = 5</code> writes into the array that both names share, so a[0] becomes 5. Then <code>b = np.ones(3)</code> only moves the name b; a is left as [5, 0, 0].',
   h:'Separate the line that writes into an array from the line that rebinds a name.'},
  {q:'In exercise 2\'s shortcut, <code>e1 = np.random.randint(n-1)</code> and <code>e2 = np.random.randint(e1+1, n)</code>, with n = 10. What is the probability of the pair (8, 9)?',
   o:['1/9, about 11%','1/45, about 2.2%','1/90','1/10'],a:0,
   e:'e1 = 8 has probability 1/9; then e2 must be drawn from {9} only, probability 1. So 1/9 ≈ 11.1%, five times the fair 1/45.',
   h:'Multiply the probability of e1 = 8 by the probability of e2 = 9 given e1 = 8.'},
  {q:'Exercise 6 changes the cost of a row from "1 if wrong" to "n minus the number of distinct values". What is the cost of the row [0, 4, 2, 1, 1] (n = 5) under the new rule?',
   o:['0','4','1','2'],a:2,
   e:'Its distinct values are 0, 1, 2, 4: four of them, so the cost is 5 − 4 = 1. The row [0, 0, 0, 0, 0] costs 5 − 1 = 4.',
   h:'Count the distinct values and subtract from n.'},
  {q:'According to the exercise sheet, what made the Latin square solver dramatically better in exercises 5 and 6?',
   o:['More iterations and more restarts','A faster computer','Changing the greedy loop','A smaller search space with moves that keep columns valid, and a cost that measures how wrong a row is'],a:3,
   e:'The loop never changed. Exercise 5 changed the representation and the moves, exercise 6 the cost function: the sheet calls this the importance of choosing a suitable representation, moves and cost.',
   h:'Which parts of the code were modified between exercises 4, 5 and 6?'}
];
