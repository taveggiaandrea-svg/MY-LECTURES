/* Lesson 7: Structured Streaming, graphs, MLlib */
const GV={a:['Alice',34],b:['Bob',36],c:['Charlie',30],d:['David',29],e:['Esther',32],f:['Fanny',36],g:['Gabby',60]};
const GE=[['a','b','friend'],['b','c','follow'],['c','b','follow'],['f','c','follow'],['e','f','follow'],['e','d','friend'],['d','a','friend'],['a','e','friend']];
const GU={a:[60,72],b:[150,26],c:[240,72],d:[60,172],e:[150,172],f:[240,172],g:[312,30]};
/* an edge between two circles, shortened, with an offset for the pair b, c */
const gEdge=(P,s,d,r,st,mk)=>{let [x1,y1]=P[s],[x2,y2]=P[d];const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const both=GE.some(e=>e[0]===d&&e[1]===s),off=both?5:0,ox=-uy*off,oy=ux*off;
  return '<line x1="'+(x1+ux*r+ox)+'" y1="'+(y1+uy*r+oy)+'" x2="'+(x2-ux*(r+4)+ox)+'" y2="'+(y2-uy*(r+4)+oy)+'" '+st+(mk?' marker-end="url(#'+mk+')"':'')+'/>'};
const FRI='stroke="#fff" stroke-width="1.8"',FOL='stroke="#9a9a9a" stroke-width="1.6" stroke-dasharray="5 4"';
const gNode=(x,y,r,l,o)=>{o=o||{};return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(o.f||'#1a1a1a')+'" stroke="'+(o.st||'#bbb')+'" stroke-width="1.5"/>'+tx(x,y+r*.36,l,{s:o.s||14,f:o.c||'#fff',w:600})};
INIT[7]=function(){
  codeHL($('#lezione-7'));
  /* streaming word count, animated */
  (function(){
    const root=$('#b7stream'),W=720,H=212;
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const L=[[1,'cat dog'],[1,'dog dog'],[2,'owl cat'],[3,'dog'],[3,'owl']];
    const R={1:{cat:1,dog:3},2:{cat:2,dog:3,owl:1},3:{cat:2,dog:4,owl:2}};
    const steps=[2.5,3,3,3,3,3,3.5];
    const msgs=['The query, count the words, is written once. The stream starts.','<b>Time 1.</b> Two lines arrive and are appended to the input table as new rows.','<b>Result at time 1:</b> cat 1, dog 3. The whole result table is written out.',
      '<b>Time 2.</b> One new line, "owl cat", becomes one new row.','<b>Result at time 2:</b> cat goes to 2 and owl appears with 1; dog does not change.','<b>Time 3.</b> Two new lines, "dog" and "owl".','<b>Result at time 3:</b> dog 4 and owl 2. Only the new rows had to be processed.'];
    const ry=r=>84+r*28;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b7a1',GRAY)+'</defs>';
      const now=i===0?0:Math.ceil(i/2);
      s+=rect(14,70,136,104,'#0d0d0d','#666')+tx(82,90,'data stream',{s:13.5,f:'#fff'})+tx(82,112,now?'time '+now:'waiting',{s:13,f:GRAY});
      s+=line(152,122,180,122,GRAY,1.6,' marker-end="url(#b7a1)"');
      s+=tx(280,26,'Input table (unbounded)',{s:14,f:'#fff',w:500})+tx(574,26,'Result table',{s:14,f:'#fff',w:500});
      s+=tx(196,62,'time',{s:13,f:GRAY,a:'start'})+tx(256,62,'line',{s:13,f:GRAY,a:'start'})+line(190,68,370,68,'#555',1);
      s+=tx(484,62,'word',{s:13,f:GRAY,a:'start'})+tx(664,62,'count',{s:13,f:BLUE,a:'end'})+line(478,68,670,68,'#555',1);
      s+=line(380,122,468,122,GRAY,1.6,' marker-end="url(#b7a1)"')+tx(424,108,'query:',{s:12.5,f:GRAY})+tx(424,144,'count words',{s:12.5,f:GRAY});
      L.forEach(([tt,l],r)=>{if(tt>now)return;const arriving=i%2===1&&tt===now,x=arriving?lerp(30,196,e):196,a=arriving?e:1,c=tt===now?'#fff':'#8a8a8a';
        s+='<g opacity="'+a+'">'+tx(x,ry(r)+5,String(tt),{s:13.5,f:c,a:'start'})+tx(x+60,ry(r)+5,l,{s:13.5,f:c,a:'start'})+'</g>';if(!arriving)s+=line(190,ry(r)+14,370,ry(r)+14,'#222',1)});
      const shown=i===0?0:(i%2===0?now:now-1);
      if(shown){const cur=R[shown],prev=R[shown-1]||{},fresh=i%2===0;
        Object.keys(cur).sort().forEach((w,r)=>{const ch=fresh&&cur[w]!==prev[w];if(ch)s+=rect(478,ry(r)-14,192,26,'rgba(255,255,255,.12)');
          s+=tx(484,ry(r)+5,w,{s:13.5,f:'#fff',a:'start'})+tx(664,ry(r)+5,String(cur[w]),{s:13.5,f:BLUE,a:'end',w:ch?600:undefined})+line(478,ry(r)+14,670,ry(r)+14,'#222',1)})}
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Streaming word count animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 7. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* GraphX property graph */
  (function(){
    const N={3:[95,56,'rxin','student'],7:[325,56,'jgonzal','postdoc'],5:[210,180,'franklin','professor'],2:[210,292,'istoica','professor']};
    const E=[[3,7,'Collaborator'],[5,3,'Advisor'],[2,5,'Colleague'],[5,7,'PI']],hw=62,hh=24;
    const clip=(ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,t=Math.min(hw/Math.abs(dx||1e-9),hh/Math.abs(dy||1e-9));return [ax+dx*t,ay+dy*t]};
    let s='<defs>'+arrowDef('b7g1','#ddd')+'</defs>';
    E.forEach(([a,b,l])=>{const [x1,y1]=clip(N[a][0],N[a][1],N[b][0],N[b][1]),[x2,y2]=clip(N[b][0],N[b][1],N[a][0],N[a][1]);
      s+=line(x1,y1,x2+(x1-x2)*.04,y2+(y1-y2)*.04,'#ddd',1.6,' marker-end="url(#b7g1)"');s+=lbl((x1+x2)/2,(y1+y2)/2+4,l,'#ccc',{s:13})});
    Object.keys(N).forEach(k=>{const [x,y,n,r]=N[k];s+=box(x-hw,y-hh,hw*2,hh*2,[k+' · '+n,r],{fs:13.5})});
    const tv=sTab(440,24,[{t:'Id',w:40},{t:'Property (V)',w:170}],[['3','(rxin, student)'],['7','(jgonzal, postdoc)'],['5','(franklin, professor)'],['2','(istoica, professor)']]);
    const te=sTab(440,182,[{t:'SrcId',w:56},{t:'DstId',w:56},{t:'Property (E)',w:110}],[['3','7','Collaborator'],['5','3','Advisor'],['2','5','Colleague'],['5','7','PI']]);
    s+=tv.s+te.s+tx(440,14,'Vertex table',{s:13,f:GRAY,a:'start'})+tx(440,172,'Edge table',{s:13,f:GRAY,a:'start'});
    svgBox($('#b7pg'),720,322,s,'GraphX property graph example','46rem');
  })();
  /* the GraphFrames graph */
  (function(){
    const sc=2,ox=10,oy=24,P={};Object.keys(GU).forEach(k=>P[k]=[GU[k][0]*sc+ox,GU[k][1]*sc+oy]);
    let s='<defs>'+arrowDef('b7f1','#fff')+arrowDef('b7f2','#9a9a9a')+'</defs>';
    s+=line(200,14,240,14,'#fff',1.8)+tx(248,19,'friend',{s:13,f:'#fff',a:'start'})+'<line x1="330" y1="14" x2="370" y2="14" '+FOL+'/>'+tx(378,19,'follow',{s:13,f:'#ccc',a:'start'});
    GE.forEach(([a,b,t])=>s+=gEdge(P,a,b,24,t==='friend'?FRI:FOL,t==='friend'?'b7f1':'b7f2'));
    const lp={a:[-34,5,'end'],b:[0,-34,'middle'],c:[34,5,'start'],d:[-34,5,'end'],e:[0,44,'middle'],f:[34,5,'start'],g:[0,44,'middle']};
    Object.keys(P).forEach(k=>{const [x,y]=P[k],[dx,dy,an]=lp[k];s+=gNode(x,y,24,k,{s:16})+tx(x+dx,y+dy,GV[k][0]+', '+GV[k][1],{s:13.5,f:GRAY,a:an})});
    svgBox($('#b7gf'),720,414,s,'Social graph of the GraphFrames notebook','46rem');
  })();
  /* query results, four panels */
  (function(){
    const duo=el('div','duo');$('#b7gq').append(duo);const P=GU,r=16;let n=0;
    const base=(fade)=>{n++;let s='<defs>'+arrowDef('b7q'+n+'a','#fff')+arrowDef('b7q'+n+'b','#9a9a9a')+arrowDef('b7q'+n+'c','#3a3a3a')+'</defs>';
      GE.forEach(e=>{const f=fade&&fade(e);s+=gEdge(P,e[0],e[1],r,f?'stroke="#3a3a3a" stroke-width="1.4"'+(e[2]==='follow'?' stroke-dasharray="5 4"':''):(e[2]==='friend'?FRI:FOL),f?'b7q'+n+'c':(e[2]==='friend'?'b7q'+n+'a':'b7q'+n+'b'))});return s};
    const deg={};Object.keys(GV).forEach(k=>deg[k]=[0,0]);GE.forEach(([a,b])=>{deg[a][1]++;deg[b][0]++});
    const rows=Object.keys(GV).filter(k=>deg[k][0]+deg[k][1]).map(k=>[GV[k][0]+' ('+k+')',String(deg[k][0]),String(deg[k][1]),String(deg[k][0]+deg[k][1])]);
    const t=sTab(20,8,[{t:'vertex',w:110},{t:'in',w:56,a:'e',c:BLUE},{t:'out',w:56,a:'e',c:BLUE},{t:'degree',w:70,a:'e',c:BLUE}],rows);
    cell(duo,'inDegrees, outDegrees, degrees',t.s,340,200,'Degrees','In-degrees add up to 8, like out-degrees: one per edge.');
    const OFF={a:[-24,5,'end'],b:[22,-10,'start'],c:[22,5,'start'],d:[-24,5,'end'],e:[0,36,'middle'],f:[22,5,'start'],g:[0,34,'middle']};
    const keep=['a','b','e'];let s=base(e=>!(e[2]==='friend'&&keep.includes(e[0])&&keep.includes(e[1])));
    Object.keys(P).forEach(k=>{const [x,y]=P[k],on=keep.includes(k);s+=gNode(x,y,r,k,{st:on?'#fff':'#444',c:on?'#fff':'#555',f:on?'#1a1a1a':'#0d0d0d'})+tx(x+OFF[k][0],y+OFF[k][1],String(GV[k][1]),{s:13,f:on?'#fff':'#555',a:OFF[k][2]})});
    cell(duo,'Subgraph: friends, age over 30',s,340,214,'Subgraph','Alice, Bob and Esther remain, with two edges.');
    s=base()+'<rect x="30" y="6" width="234" height="196" rx="16" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>'+'<rect x="290" y="6" width="44" height="58" rx="14" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>';
    Object.keys(P).forEach(k=>s+=gNode(P[k][0],P[k][1],r,k));s+=tx(147,218,'component 1',{s:13,f:GRAY})+tx(338,82,'component 2',{s:12.5,f:GRAY,a:'end'});
    cell(duo,'Connected components',s,340,228,'Connected components','Two components: everyone else, and Gabby alone.');
    s='<polygon points="'+['a','d','e'].map(k=>P[k].join(',')).join(' ')+'" fill="rgba(255,255,255,.13)"/>'+base();
    const tri={a:1,d:1,e:1};Object.keys(P).forEach(k=>{const [x,y]=P[k];s+=gNode(x,y,r,k)+tx(x+OFF[k][0],y+OFF[k][1],String(tri[k]||0),{s:14,f:tri[k]?'#fff':'#666',w:600,a:OFF[k][2]})});
    cell(duo,'Triangle count',s,340,214,'Triangle count','Alice, David and Esther each lie on one triangle.');
  })();
  /* ML pipeline */
  (function(){
    let s='<defs>'+arrowDef('b7p1',GRAY)+'</defs>';const cx=c=>10+c*118,W=100,H=56;
    const B=(c,y,l,k,o)=>box(cx(c),y,W,H,[l,k],Object.assign({fs:13.5},o||{}));
    const A=(c,y)=>line(cx(c)+W+2,y+H/2,cx(c+1)-3,y+H/2,GRAY,1.5,' marker-end="url(#b7p1)"');
    s+=tx(10,22,'pipeline.fit(training)',{s:14,f:'#fff',a:'start',w:500});
    const y1=34;s+=B(0,y1,'training','DataFrame',{f:'#141414',st:'#555'})+B(1,y1,'Tokenizer','transformer')+B(2,y1,'HashingTF','transformer')+rect(cx(3),y1,W,H,'#0d0d0d','#fff',' stroke-width="2"')+tx(cx(3)+W/2,y1+16,'Logistic',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+32,'Regression',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+48,'estimator',{s:12.5,f:GRAY})+B(4,y1,'model','transformer');
    [0,1,2,3].forEach(c=>s+=A(c,y1));
    [['"sugar flour eggs"','label 1'],['sugar, flour,','eggs'],['positions 864,','351, 289'],['learns one weight','per position'],['tokenizer, hashing','and weights']].forEach(([a,b],c)=>{s+=tx(cx(c)+W/2,y1+H+20,a,{s:12.5,f:GRAY})+tx(cx(c)+W/2,y1+H+36,b,{s:12.5,f:GRAY})});
    const y2=206;s+=tx(10,194,'model.transform(test), then evaluate',{s:14,f:'#fff',a:'start',w:500});
    s+=B(0,y2,'test','DataFrame',{f:'#141414',st:'#555'})+B(1,y2,'Tokenizer','transformer')+B(2,y2,'HashingTF','transformer')+B(3,y2,'LR model','transformer')+B(4,y2,'predictions','DataFrame',{f:'#141414',st:'#555'})+B(5,y2,'Evaluator','evaluator',{sw:2,st:'#fff'});
    [0,1,2,3,4].forEach(c=>s+=A(c,y2));
    s+=line(cx(4)+W/2,y1+H+44,cx(3)+W/2+6,y2-4,GRAY,1.3,' stroke-dasharray="5 4" marker-end="url(#b7p1)"');
    s+=tx(cx(3)+W/2,y2+H+20,'score and',{s:12.5,f:GRAY})+tx(cx(3)+W/2,y2+H+36,'probability',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+20,'adds a',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+36,'prediction column',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+20,'accuracy,',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+36,'F1, AUC',{s:12.5,f:GRAY});
    svgBox($('#b7pipe'),720,306,s,'The logistic regression pipeline','46rem');
  })();
  /* predictions on the test set */
  (function(){
    const rows=[[4,'I like fried eggs','eggs +1.52',0.38,0.59,1,1],[5,'he day trip to the island was so exhausting','trip −1.52, exhausting +1.52',-1.14,0.24,0,0],
      [6,'I like the sea, the sun and I like swimming','none',-1.14,0.24,0,0],[7,'eggs sea flour','eggs +1.52, sea −1.52, flour +2.28',1.14,0.76,1,1]];
    const X=[14,50,410,480,570,660],hd=['id','sentence, and the words with a weight','score','P(label 1)','prediction','label'];
    let s='';hd.forEach((h,j)=>s+=tx(X[j]+(j>1?50:0),20,h,{s:13,f:j===3?BLUE:GRAY,a:j>1?'end':'start'}));s+=line(10,28,710,28,'#555',1);
    rows.forEach((r,k)=>{const y=34+k*54;
      s+=tx(X[0],y+20,String(r[0]),{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+20,'"'+r[1]+'"',{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+40,r[2],{s:12.5,f:GRAY,a:'start'});
      s+=tx(X[2]+50,y+28,fe(r[3],2).replace('-','−'),{s:13.5,f:'#fff',a:'end'})+tx(X[3]+50,y+28,fe(r[4],2),{s:13.5,f:BLUE,a:'end'})+tx(X[4]+50,y+28,r[5]+' ✓',{s:13.5,f:GRN,a:'end'})+tx(X[5]+50,y+28,String(r[6]),{s:13.5,f:'#fff',a:'end'});
      s+=line(10,y+52,710,y+52,'#222',1)});
    svgBox($('#b7pred'),720,34+4*54+4,s,'Predictions on the test set','46rem');
  })();
  wideFigs(7);
};
QZ['7a']=()=>[{q:'After time 3 in the figure, the line "owl owl cat" arrives at time 4. In complete mode, which result table is written?',o:['cat 1, owl 2','cat 3, owl 4','cat 3, dog 4, owl 4','cat 3, dog 0, owl 4'],a:2,
  e:'The new line adds 2 to owl (2 + 2 = 4) and 1 to cat (2 + 1 = 3); dog stays at 4. Complete mode writes the whole table, unchanged rows included.',h:'Start from the result at time 3 and add only the words of the new line.'}];
QZ['7b']=()=>[{q:'In the GraphFrames graph, what are the in-degree of Bob (b) and the out-degree of Esther (e)?',o:['1 and 2','2 and 2','2 and 1','3 and 2'],a:1,
  e:'Bob receives edges from Alice (friend) and Charlie (follow): in-degree 2. Esther sends edges to Fanny (follow) and David (friend): out-degree 2.',h:'Count arrowheads pointing at b, and arrows leaving e.'}];
QZ['7c']=()=>[{q:'In the course pipeline, which stage is an estimator, and what does pipeline.fit(training) return?',o:['Tokenizer; a DataFrame of words','HashingTF; a vector of 1,000 numbers','LogisticRegression; a model, which is a transformer','LogisticRegression; the accuracy on the test set'],a:2,
  e:'LogisticRegression is the learning algorithm, the estimator. Fitting the pipeline returns a model, a transformer that adds predictions to any DataFrame; accuracy comes later, from an evaluator.',h:'Recall what an estimator produces when it is fitted.'}];
QZ['7d']=()=>[{q:'Test sentence 6 contains no word with a non-zero weight. What decides its prediction?',o:['Nothing: Spark refuses to predict','The intercept alone: score −1.14, probability 0.24, label 0','The word "sea", which pushes towards label 0','The longest word in the sentence'],a:1,
  e:'With no weighted words the score is the intercept, −1.14, and 1/(1 + e^1.14) ≈ 0.24, below 0.5. "sea," with a comma is a different word from "sea", so it carries no weight.',h:'Look closely at how the tokenizer splits "the sea, the sun".'}];
QZ['7']=()=>[
  {q:'After time 3 in the streaming example (cat 2, dog 4, owl 2), the line "cat cat" arrives at time 4. In complete mode, how many rows does the written result table have, and what is the count of cat?',o:['1 row, cat 2','3 rows, cat 4','3 rows, cat 2','4 rows, cat 4'],a:1,
   e:'Complete mode writes the whole table: still three words, so three rows, and cat becomes 2 + 2 = 4.',h:'Start from the result at time 3 and recall what complete mode writes.'},
  {q:'In the course notebook, what changes between the static query on the event files and the streaming one?',o:['The streaming query needs a different groupBy','readStream replaces read, with an option to pick one file per trigger; the query is the same','Streaming queries cannot use windows','The streaming query must be written in SQL'],a:1,
   e:'Structured Streaming lets you write the computation as on static data: only readStream (with maxFilesPerTrigger 1 to replay the files) and the writeStream sink are new.',h:'Recall what Structured Streaming promises about how you express a computation.'},
  {q:'In the GraphFrames notebook, the subgraph is built with filterVertices("age > 30"). Which vertices remain if the filter is "age > 28" instead (still friend edges only, isolated vertices dropped)?',o:['Alice, Bob, Esther','Alice, Bob, David, Esther','Alice, Bob, Charlie, David, Esther','All seven'],a:1,
   e:'The friend edges are a→b, e→d, d→a, a→e. With David (29) now kept, all four survive, linking Alice, Bob, David and Esther. Charlie, Fanny and Gabby have no friend edge left, so they are dropped.',h:'List the friend edges first, then check the ages of their ends.'},
  {q:'Suppose Gabby starts following Alice (a new edge g→a of type follow). How many connected components does the graph have, and how many follow edges?',o:['2 components, 5 follow edges','1 component, 4 follow edges','1 component, 5 follow edges','2 components, 4 follow edges'],a:2,
   e:'The new edge links Gabby to the rest, so everyone is in one component; follow edges go from 4 to 5.',h:'Gabby was a component on her own only because she had no edges.'},
  {q:'With the weights learned by the course pipeline (intercept −1.14, flour +2.28, sea −1.52), what does the model predict for the new sentence "flour sea"?',o:['Probability about 0.41, label 0','Probability about 0.59, label 1','Probability about 0.76, label 1','Probability 0.5, no prediction'],a:0,
   e:'Score = −1.14 + 2.28 − 1.52 = −0.38, and 1/(1 + e^0.38) ≈ 0.41, below 0.5: label 0.',h:'Add the intercept and the two weights, then ask whether the score is positive or negative.'},
  {q:'In the course\'s second example, VectorAssembler, LinearRegression and RegressionEvaluator are, in this order,',o:['estimator, transformer, evaluator','transformer, transformer, estimator','evaluator, estimator, transformer','transformer, estimator, evaluator'],a:3,
   e:'VectorAssembler turns a DataFrame into another by adding the features column (transformer); LinearRegression fits a model (estimator); RegressionEvaluator computes a metric of the predictions (evaluator).',h:'Ask of each one: does it add a column, learn from data, or score predictions?'}
];
