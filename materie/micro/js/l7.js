INIT[7]=function(){
/* L'insieme di bilancio */
(function(){
  const root=$('#budget5'),pl=plane(20,[0,10,20],'Insieme di bilancio al variare di prezzo, ricchezza e scala');
  const st={p1:2,w:12,l:1},o=out();
  root.append(legend([[GRN,'insieme di bilancio','box'],[GRN,'retta di bilancio']]),pl.svg,
    slider('prezzo del bene 1',0.5,4,0.1,st.p1,v=>{st.p1=v;draw()}),
    slider('ricchezza',4,20,1,st.w,v=>{st.w=v;draw()}),
    slider('moltiplica tutto per '+K('\\lam'),0.5,3,0.1,st.l,v=>{st.l=v;draw()}),o);
  function draw(){
    const p1=st.p1*st.l,p2=st.l,w=st.w*st.l,i1=w/p1,i2=w/p2;
    let s=pl.tri(p1,p2,w,GRN)+pl.bline(p1,p2,w,GRN),m='';
    if(i1<=20)m+='<circle cx="'+pl.X(i1)+'" cy="'+pl.Y(0)+'" r="4.5" fill="'+ORG+'"/>';
    if(i2<=20)m+='<circle cx="'+pl.X(0)+'" cy="'+pl.Y(i2)+'" r="4.5" fill="'+ORG+'"/>';
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+m;
    o.innerHTML=K('\\pu='+tn(p1)+'\\qquad \\pd='+tn(p2)+'\\qquad \\wl='+tn(w))+'<br>La retta taglia gli assi in '+K('\\wl/\\pu='+tn(i1))+' e '+K('\\wl/\\pd='+tn(i2))+
      ' (i punti arancioni) e ha pendenza '+K('-\\pu/\\pd=-'+tn(p1/p2))+'.';
  }
  draw();
})();

/* Quattro regole di comportamento */
(function(){
  const root=$('#rules5'),W=12,pl=plane(20,[0,10,20],'Paniere scelto da una regola di comportamento al variare dei prezzi');
  const RU=[
    {t:'tutto sul bene meno caro',f:(a,b)=>Math.abs(a-b)<1e-9?[W/(2*a),W/(2*b)]:a<b?[W/a,0]:[0,W/b],d:'Se i prezzi sono uguali, divide la ricchezza a metà.'},
    {t:'stesse quantità dei due beni',f:(a,b)=>[W/(a+b),W/(a+b)],d:'Compra '+'la stessa quantità dei due beni e spende tutto.'},
    {t:'metà della ricchezza per bene',f:(a,b)=>[W/(2*a),W/(2*b)],d:'Spende 6 per ciascun bene, qualunque siano i prezzi.'},
    {t:'bene 1 fino a 7 unità, poi bene 2',f:(a,b)=>W/a<=7?[W/a,0]:[7,(W-7*a)/b],d:'Compra bene 1 finché arriva a 7 unità; quello che avanza va nel bene 2.'}];
  const st={r:0,p1:1,p2:1.5},o=out();
  const bs=RU.map((r,i)=>{const b=btn(r.t);b.onclick=()=>{st.r=i;draw()};return b});
  root.append(group('Scegli la regola di comportamento',bs),legend([[GRN,'insieme di bilancio','box'],[PINK,'paniere scelto','dot']]),pl.svg,
    slider('prezzo del bene 1',0.6,3,0.1,st.p1,v=>{st.p1=v;draw()}),slider('prezzo del bene 2',0.6,3,0.1,st.p2,v=>{st.p2=v;draw()}),o);
  function draw(){
    bs.forEach((b,i)=>press(b,i===st.r));
    const x=RU[st.r].f(st.p1,st.p2);
    pl.svg.innerHTML=pl.defs+pl.clip(pl.tri(st.p1,st.p2,W,GRN)+pl.bline(st.p1,st.p2,W,GRN))+pl.axes()+pl.dot(x,PINK,8);
    o.innerHTML=RU[st.r].d+'<br>'+K('\\dx((\\pu,\\pd),\\wl)='+pt(x))+': spende '+fmt(st.p1*x[0])+' per il bene 1 e '+fmt(st.p2*x[1])+' per il bene 2.';
  }
  draw();
})();

/* Domanda regolare, domanda incrociata, funzione di Engel */
(function(){
  const root=$('#curves5');
  const C=[
    {t:'metà per bene: x₁ · x₂',f:(p,w)=>[w/(2*p),w/2],d:'Se il bene 1 rincara ne compra meno (bene regolare), mentre la quantità del bene 2 non reagisce. Se la ricchezza sale compra più bene 1 (bene normale).'},
    {t:'complementari: min{x₁, x₂}',f:(p,w)=>[w/(p+1),w/(p+1)],d:'Le due quantità sono sempre uguali: se il bene 1 rincara scendono entrambe. Se la ricchezza sale compra più bene 1 (bene normale).'},
    {t:'x₁ + √x₂',f:(p,w)=>2*Math.sqrt(w)>=p?[w/p-p/4,p*p/4]:[0,w],d:'Se il bene 1 rincara ne compra meno e passa al bene 2: la domanda incrociata sale, finché il bene 1 sparisce dal paniere. Dove ne compra, la funzione di Engel sale; dove non ne compra, resta a zero.'}];
  const st={c:0,p:2,w:12},o=out();o.style.minHeight='5.2em';
  const bs=C.map((r,i)=>{const b=btn(r.t);b.onclick=()=>{st.c=i;draw()};return b});
  const trio=el('div','trio');
  const panels=[['Domanda regolare del bene 1','prezzo del bene 1','bene 1'],['Domanda incrociata del bene 2','prezzo del bene 1','bene 2'],['Funzione di Engel del bene 1','ricchezza','bene 1']].map(([t,xl,yl])=>{
    const d=el('div');d.append(el('h4','',t));const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 240 214');svg.setAttribute('role','img');svg.setAttribute('aria-label',t);
    d.append(svg);trio.append(d);return {svg,xl,yl}});
  root.append(group('Scegli il consumatore',bs),legend([[PINK,'quantità domandata'],['#fff','valori correnti','dot']]),trio,
    slider('prezzo del bene 1',0.5,4,0.1,st.p,v=>{st.p=v;draw()}),slider('ricchezza',2,20,1,st.w,v=>{st.w=v;draw()}),o);
  const nice=m=>{const e=Math.pow(10,Math.floor(Math.log10(m))),f=m/e;return (f<=1?1:f<=2?2:f<=5?5:10)*e};
  function panel(P,fn,lo,hi,cur){
    const ax=40,ay=12,aw=186,ah=154,N=70,pts=[];let mx=0;
    for(let i=0;i<=N;i++){const t=lo+(hi-lo)*i/N,v=fn(t);pts.push([t,v]);mx=Math.max(mx,v)}
    const ym=nice(Math.max(mx,1)*1.05),X=t=>ax+(t-lo)/(hi-lo)*aw,Y=v=>ay+ah-v/ym*ah;
    let s='<line x1="'+ax+'" y1="'+(ay+ah)+'" x2="'+(ax+aw)+'" y2="'+(ay+ah)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+ax+'" y1="'+ay+'" x2="'+ax+'" y2="'+(ay+ah)+'" stroke="#fff" stroke-width="1.5"/>';
    s+='<text class="g" x="'+(ax-6)+'" y="'+(ay+6)+'" font-size="14" text-anchor="end">'+fmt(ym)+'</text><text class="g" x="'+(ax-6)+'" y="'+(ay+ah+4)+'" font-size="14" text-anchor="end">0</text>';
    s+='<text class="g" x="'+ax+'" y="'+(ay+ah+18)+'" font-size="14" text-anchor="middle">'+fmt(lo)+'</text><text class="g" x="'+(ax+aw)+'" y="'+(ay+ah+18)+'" font-size="14" text-anchor="middle">'+fmt(hi)+'</text>';
    s+='<text class="g" x="'+(ax+aw/2)+'" y="'+(ay+ah+38)+'" font-size="15" text-anchor="middle">'+P.xl+'</text>';
    s+='<text class="g" x="13" y="'+(ay+ah/2)+'" font-size="15" text-anchor="middle" transform="rotate(-90 13 '+(ay+ah/2)+')">'+P.yl+'</text>';
    s+='<path d="'+pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('')+'" fill="none" stroke="'+PINK+'" stroke-width="3"/>';
    s+='<circle cx="'+X(cur)+'" cy="'+Y(fn(cur))+'" r="6" fill="#fff" stroke="#000" stroke-width="2"/>';
    P.svg.innerHTML=s;
  }
  function draw(){
    bs.forEach((b,i)=>press(b,i===st.c));
    const f=C[st.c].f;
    panel(panels[0],p=>f(p,st.w)[0],0.5,4,st.p);
    panel(panels[1],p=>f(p,st.w)[1],0.5,4,st.p);
    panel(panels[2],w=>f(st.p,w)[0],2,20,st.w);
    o.innerHTML=K('\\dx(('+tn(st.p)+',\\,1),\\,'+tn(st.w)+')='+pt(f(st.p,st.w)))+'<br>'+C[st.c].d;
  }
  draw();
})();

/* Sentiero di espansione della ricchezza e curva di offerta (qualitativi, ridisegnati dalle slide) */
(function(){
  const root=$('#paths7'),duo=el('div','duo');
  root.append(legend([[GRN,'rette di bilancio'],[PINK,'panieri scelti','dot'],[BLUE,'curva che li unisce'],[RED,'tratto in cui la quantità scende']]),duo);
  /* sinistra: prezzi (1,1), ricchezza 6, 10, 14 */
  (function(){const m=mini(15,280);let s='';
    [6,10,14].forEach(w=>{s+=m.bl(1,1,w,GRN,2)});
    s+=m.spline([[0,0],[2.4,1],[4,2],[5.5,4.5]],BLUE)+m.spline([[5.5,4.5],[5.2,7],[4.5,9.5]],RED,3.4);
    [[4,2,'w'],[5.5,4.5,'w′'],[4.5,9.5,'w″']].forEach(q=>{s+=m.dot(q,PINK)+m.lab(q,q[2],10,-6)});
    s+=m.lab([6.1,7.6],'bene 1 inferiore',0,0,RED,13);
    cell(duo,'La ricchezza sale: '+K('\\wl \\lt \\wl\' \\lt \\wl\'\''),m.axes()+s,m.S,m.H,'Tre rette di bilancio parallele e il sentiero di espansione della ricchezza che piega verso sinistra nell\'ultimo tratto',
      'Fra '+K('\\wl\'')+' e '+K('\\wl\'\'')+' la quantità del bene 1 scende: lì il bene 1 è inferiore.');
  })();
  /* destra: w=10, p1=1, p2 = 2, 1,25, 0,8 */
  (function(){const m=mini(14,280);let s='';
    [2,1.25,0.8].forEach(p=>{s+=m.bl(1,p,10,GRN,2)});
    s+=m.spline([[9,0.4],[6,2],[3.75,5]],BLUE)+m.spline([[3.75,5],[5.2,4.8],[6.8,4]],RED,3.4);
    [[6,2],[3.75,5],[6.8,4]].forEach(q=>{s+=m.dot(q,PINK)});
    s+=m.lab([0.9,4.55],'p₂',4,-7,ORG,14)+m.lab([0.9,7.28],'p₂′',4,-7,ORG,14)+m.lab([0.9,11.4],'p₂″',4,-7,ORG,14);
    s+=m.lab([3.75,5],'x₂ = 5',8,-10,'#fff',13)+m.lab([6.8,4],'x₂ = 4',10,2,'#fff',13)+m.lab([6,2],'x₂ = 2',-10,16,'#fff',13,'end');
    s+=tx(m.X(10),m.Y(0)+17,'w/p₁',{s:13,f:GRAY});
    cell(duo,'Il prezzo del bene 2 scende: '+K('\\pd \\gt \\pd\' \\gt \\pd\'\''),m.axes()+s,m.S,m.H,'Tre rette di bilancio che ruotano attorno a w su p1 e la curva di offerta che nell\'ultimo tratto torna verso il basso',
      'Da '+K('\\pd\'')+' a '+K('\\pd\'\'')+' il bene 2 costa meno, eppure se ne compra meno: da 5 a 4.');
  })();
})();
/* Esempio: tutto sul bene più caro */
(function(){
  const root=$('#exp5'),pl=plane(2.4,[0,1,2],'Due insiemi di bilancio e i panieri scelti da ciascuno');
  const st={r:0},o=out();
  const bs=['tutto sul bene più caro','tutto sul bene meno caro'].map((t,i)=>{const b=btn(t);b.onclick=()=>{st.r=i;draw()};return b});
  root.append(group('Scegli la regola di comportamento',bs),legend([[GRN,'bilancio con prezzi (1, 2)','box'],[PUR,'bilancio con prezzi (2, 1)','box'],['#fff','panieri scelti','dot']]),pl.svg,o);
  function draw(){
    bs.forEach((b,i)=>press(b,i===st.r));
    const a=st.r===0?[0,1]:[2,0],b=st.r===0?[1,0]:[0,2];
    const s=pl.tri(1,2,2,GRN,.3)+pl.tri(2,1,2,PUR,.3)+pl.bline(1,2,2,GRN)+pl.bline(2,1,2,PUR);
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(a,'#fff',8)+pl.dot(b,'#fff',8)+
      (st.r===0?pl.lab(a,'a',14,-8)+pl.lab(b,'b',10,-14):pl.lab(a,'a',-4,-16)+pl.lab(b,'b',14,6));
    o.innerHTML=st.r===0
      ?K('a='+pt(a))+' è scelto dal verde, '+K('b='+pt(b))+' dal viola.<br><span class="bad">Contraddizione:</span> '+K('b')+' sta all\'interno del verde, quindi '+K('a \\spf b')+'; ma '+K('a')+' sta all\'interno del viola, quindi '+K('b \\spf a')+'.'
      :K('a='+pt(a))+' è scelto dal verde, '+K('b='+pt(b))+' dal viola.<br><span class="ok">Nessun conflitto:</span> '+K('b')+' non è acquistabile nel verde e '+K('a')+' non lo è nel viola. La regola è razionalizzata da '+K('\\uu=x_1+x_2')+'.';
  }
  draw();
})();

/* Assioma debole delle preferenze rivelate */
(function(){
  const root=$('#warp5'),pl=plane(10,[0,5,10],'Due insiemi di bilancio con le scelte a e b trascinabili sulle rispettive rette');
  pl.svg.style.touchAction='none';pl.svg.style.cursor='grab';
  const st={a:1,b:1},o=out();o.style.minHeight='6.8em';
  root.append(legend([[GRN,'bilancio con prezzi (1, 2)','box'],[PUR,'bilancio con prezzi (2, 1)','box'],['#fff','scelte a e b','dot']]),pl.svg,o);
  const A=()=>[st.a,(10-st.a)/2],B=()=>[(10-st.b)/2,st.b];
  function draw(){
    const a=A(),b=B(),cb=r2(b[0]+2*b[1]),ca=r2(2*a[0]+a[1]),e=1e-6;
    const s=pl.tri(1,2,10,GRN,.3)+pl.tri(2,1,10,PUR,.3)+pl.bline(1,2,10,GRN)+pl.bline(2,1,10,PUR);
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(a,'#fff',9)+pl.dot(b,'#fff',9)+pl.lab(a,'a',12,-12)+pl.lab(b,'b',12,-12);
    const aRb=cb<=10+e,aPb=cb<10-e,bRa=ca<=10+e,bPa=ca<10-e;
    const line=(x,y,c,R,P)=>'Ai prezzi del '+c+' '+K(y)+' costa '+fmt(x)+': '+(P?K(R)+' è rivelato migliore di '+K(y)+'.':Rr(x)?K(R)+' è rivelato buono almeno quanto '+K(y)+'.':'non era acquistabile, e la scelta di '+K(R)+' non rivela nulla.');
    const Rr=x=>x<=10+e;
    const viol=(aRb&&bPa)||(bRa&&aPb);
    o.innerHTML=K('a='+pt(a)+'\\qquad b='+pt(b))+'<br>'+line(cb,'b','verde','a',aPb)+'<br>'+line(ca,'a','viola','b',bPa)+'<br>'+
      (viol?'<span class="bad">L\'assioma debole è violato.</span>':'<span class="ok">L\'assioma debole è rispettato.</span>');
  }
  let who='a';
  drag(pl.svg,(e,start)=>{const [px,py]=svgPoint(pl.svg,e,S,S),vx=(px-x0)/L*10,vy=(y0+L-py)/L*10;
    if(start){const a=A(),b=B();who=Math.hypot(vx-a[0],vy-a[1])<=Math.hypot(vx-b[0],vy-b[1])?'a':'b'}
    if(who==='a')st.a=r1(clamp((vx+2.5-vy/2)/1.25,0,10));else st.b=r1(clamp((vy+2.5-vx/2)/1.25,0,10));
    draw()});
  draw();
})();

/* Assioma debole: le cinque situazioni della figura delle slide */
(function(){
  const root=$('#warpEx7'),g=el('div','multi');
  root.append(legend([[GRN,'bilancio da cui si sceglie x′','box'],[PUR,'bilancio da cui si sceglie x″','box']]),g);
  const X=[10/3,10/3],lo=[4.4,1.2],hi=[1,8],fr=[7,1.5],fl=[1.5,4.25];
  const C=[
    ['(a)',lo,fr,true,K('x\'')+' era acquistabile nel viola; '+K('x\'\'')+' non lo era nel verde.'],
    ['(b)',hi,fr,true,'Nessuno dei due era acquistabile nell\'altro bilancio: le scelte non rivelano nulla.'],
    ['(c)',X,fr,true,K('x\'')+' sta sulla retta viola; '+K('x\'\'')+' non era acquistabile nel verde.'],
    ['(d)',X,fl,false,K('x\'\'')+' era acquistabile nel verde e '+K('x\'')+' nel viola.'],
    ['(e)',lo,fl,false,'Ciascuno dei due era acquistabile, con margine, nell\'altro bilancio.']];
  C.forEach(c=>{const m=mini(11,220);
    let s=m.tri(2,1,10,GRN,.28)+m.tri(1,2,10,PUR,.28)+m.bl(2,1,10,GRN)+m.bl(1,2,10,PUR);
    s+=m.dot(c[1],'#fff')+m.dot(c[2],'#fff');
    s+=c[1]===lo?m.lab(c[1],'x′',-9,6,'#fff',15,'end'):m.lab(c[1],'x′',c[1]===hi?10:8,-8,'#fff',15,'start');
    s+=m.lab(c[2],'x″',c[2]===fl?2:6,c[2]===fl?31:-10,'#fff',15,'start');
    cell(g,c[0],m.axes()+s,m.S,m.H,'Situazione '+c[0]+': assioma debole '+(c[3]?'rispettato':'violato'),
      '<span class="'+(c[3]?'ok':'bad')+'">'+(c[3]?'Rispettato.':'Violato.')+'</span> '+c[4]);
  });
})();
/* Compensazione di Slutsky: un solo disegno */
(function(){
  const root=$('#slut7'),pl=plane(20,[0,10,20],'Aumento del prezzo del bene 1 con ricchezza compensata: la nuova retta passa per il vecchio paniere a');
  const a=[6,6],b=[4.5,9];
  let s=pl.tri(2,1,18,GRN)+pl.bline(1,1,12,GRAY,'stroke-dasharray="6 6"').replace('stroke-width="3"','stroke-width="2"')+pl.bline(2,1,18,GRN);
  s+='<line x1="'+pl.X(6)+'" y1="'+pl.Y(6)+'" x2="'+pl.X(9)+'" y2="'+pl.Y(0)+'" stroke="'+RED+'" stroke-width="5" stroke-linecap="round"/>';
  pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(a,'#fff',9)+pl.lab(a,'a',14,4)+pl.dot(b,PINK,8)+pl.lab(b,'b',14,-8,PINK)+
     '<text class="g" x="'+(pl.X(12)+7)+'" y="'+(pl.Y(0)-8)+'" font-size="13" text-anchor="start" style="paint-order:stroke;stroke:#000;stroke-width:4px">prima</text>'+
    '<text x="'+(pl.X(2.2)+8)+'" y="'+(pl.Y(13.6))+'" font-size="13" style="fill:'+GRN+';paint-order:stroke;stroke:#000;stroke-width:4px">dopo, compensata</text>';
  root.append(legend([[GRAY,'retta di bilancio di partenza','dash'],[GRN,'bilancio compensato','box'],['#fff','vecchia scelta a','dot'],[PINK,'nuova scelta b','dot'],[RED,'tratto vietato dall\'assioma debole']]),pl.svg);
})();
/* Beatty e Crawford: quote che superano il test e insiemi annidati */
(function(){
  const root=$('#bc7');
  const W=520,rows=[['famiglie vere',95.7,'95,7%',PINK],['famiglie simulate, scelte a caso',91.2,'circa 91%',GRAY]];
  let s='';rows.forEach((r,k)=>{const y=14+k*52;
    s+=tx(0,y+12,r[0],{a:'start',s:14,f:'#fff'})+'<rect x="0" y="'+(y+20)+'" width="'+(W-90)+'" height="16" fill="#1c1c1c"/><rect x="0" y="'+(y+20)+'" width="'+((W-90)*r[1]/100).toFixed(1)+'" height="16" fill="'+r[3]+'"/>'+tx(W-80,y+34,r[2],{a:'start',s:15,f:'#fff'})});
  svgBox(root,W,116,s,'Quota di famiglie che supera il test di razionalità: 95,7 per cento delle famiglie vere, circa 91 per cento di quelle simulate','32rem');
  const duo=el('div','duo');root.append(legend([[GRN,'primo bilancio','box'],[PUR,'secondo bilancio','box'],['#fff','scelte','dot']]),duo);
  (function(){const m=mini(11,240);
    const s=m.tri(1,1.1,10,PUR,.25)+m.tri(1,1,6,GRN,.4)+m.bl(1,1.1,10,PUR)+m.bl(1,1,6,GRN)+m.dot([2,4],'#fff')+m.dot([6.7,3],'#fff')+m.dot([4.5,1.5],'#fff',4)+m.dot([1,5],'#fff',4)+m.dot([3.4,6],'#fff',4)+m.dot([8.2,1.64],'#fff',4);
    cell(duo,'Uno dentro l\'altro',m.axes()+s,m.S,m.H,'Due insiemi di bilancio annidati','Ovunque cadano le due scelte, quella dal bilancio grande non era acquistabile nel piccolo: <span class="ok">mai una violazione.</span>')})();
  (function(){const m=mini(11,240);
    const s=m.tri(2,1,10,GRN,.28)+m.tri(1,2,10,PUR,.28)+m.bl(2,1,10,GRN)+m.bl(1,2,10,PUR)+m.dot([4.4,1.2],'#fff')+m.dot([1.5,4.25],'#fff');
    cell(duo,'Che si incrociano',m.axes()+s,m.S,m.H,'Due insiemi di bilancio che si incrociano','Qui due scelte possono contraddirsi: <span class="bad">il test può fallire.</span>')})();
})();
};
QZ['7a']=()=>[
 {q:'I prezzi sono '+K('(\\pu,\\pd)=(2,\\,4)')+' e la ricchezza è '+K('\\wl=20')+'. Quale di questi panieri sta sulla retta di bilancio?',
  o:[K('(5;\\,3)'),K('(4;\\,3)'),K('(2;\\,2)'),K('(10;\\,5)')],a:1,
  e:K('2\\cdot 4+4\\cdot 3=20')+': costa esattamente tutta la ricchezza.',h:'Calcola il costo '+K('\\pu x_1+\\pd x_2')+' di ogni paniere: sulla retta deve fare esattamente 20.'}
];

QZ['7b']=()=>[
 {q:'Nell\'esempio qui sopra prendi '+K('\\bet=1/2')+', prezzi '+K('(1,\\,1)')+' e ricchezza 10. Quanto spende in tutto il consumatore?',
  o:['10','5','7,5','2,5'],a:2,
  e:'Compra '+K('\\dx_1=\\tfrac12\\cdot 10=5')+' e '+K('\\dx_2=\\tfrac14\\cdot 10=2{,}5')+': spende 7,5 e ne avanza 2,5. La legge di Walras è violata, l\'omogeneità di grado zero no.',
  h:'Calcola le due quantità con la formula, poi il costo ai prezzi '+K('(1,\\,1)')+'.'}
];
QZ['7c']=()=>[
 {q:'Nel riquadro di destra, quando il prezzo del bene 2 scende da '+K('\\pd\'')+' a '+K('\\pd\'\'')+' la quantità comprata del bene 2 passa da 5 a 4. In quel tratto il bene 2 è…',
  o:['normale','un bene di Giffen','regolare: rispetta la legge della domanda','inferiore, perché la ricchezza è scesa'],a:1,
  e:'Prezzo e quantità si muovono nella stessa direzione: '+K('\\partial \\dx_2/\\partial \\pd \\gt 0')+'. È la definizione di bene di Giffen. La ricchezza in denaro non è cambiata.',
  h:'Confronta il verso in cui si muove il prezzo con quello in cui si muove la quantità.'}
];
QZ['7']=()=>[
 {q:'I due prezzi e la ricchezza triplicano. Che cosa succede all\'insieme di bilancio?',
  o:['Diventa tre volte più grande','Diventa tre volte più piccolo','Resta identico','La retta di bilancio diventa più ripida'],a:2,
  e:'Moltiplicare per 3 i due lati della disuguaglianza non cambia quali panieri la soddisfano: contano solo i rapporti.',h:'Riguarda il terzo cursore nella figura dell\'insieme di bilancio.'},
 {q:'Con prezzi '+K('(1,\\,2)')+' e ricchezza 10 un consumatore sceglie '+K('a=(2;\\,4)')+'. Con prezzi '+K('(2,\\,1)')+' e ricchezza 10 sceglie '+K('b=(4;\\,2)')+'. L\'assioma debole è rispettato?',
  o:['Sì: i due panieri costano uguale','Sì: '+K('b')+' non era acquistabile nel primo bilancio','Non si può dire senza conoscere le preferenze','No: ciascuno dei due panieri è rivelato migliore dell\'altro'],a:3,
  e:'Ai primi prezzi '+K('b')+' costa '+K('4+4=8 \\lt 10')+'; ai secondi '+K('a')+' costa '+K('4+4=8 \\lt 10')+'. Ognuno era acquistabile, con margine, quando è stato scelto l\'altro.',h:'Calcola quanto costa '+K('b')+' ai prezzi del primo bilancio e quanto costa '+K('a')+' ai prezzi del secondo.'},
 {q:'Un consumatore sceglie '+K('a=(4;\\,8)')+' con prezzi '+K('(2,\\,1)')+' e ricchezza 16. Il prezzo del bene 1 sale a 3. Quale ricchezza compensata '+K('\\wl\'')+' gli permette di ricomprare esattamente '+K('a')+'?',
  o:['16','20','24','12'],a:1,
  e:K('\\wl\'=3\\cdot 4+1\\cdot 8=20')+': il costo del vecchio paniere ai nuovi prezzi.',h:'Ricalcola il costo di '+K('a')+' con il nuovo prezzo del bene 1.'},
 {q:'Due insiemi di bilancio hanno gli stessi prezzi e ricchezze diverse, 8 e 12. Un consumatore sceglie un paniere sulla retta di ciascuno. Può violare l\'assioma debole?',
  o:['Sì, se dal bilancio grande sceglie un paniere con meno bene 1','Sì, se i due panieri sono diversi','No, qualunque cosa scelga','Dipende dalle sue preferenze'],a:2,
  e:'Il paniere scelto dal bilancio grande costa 12: nel piccolo non era acquistabile. Quindi non può mai essere vero che ciascuno dei due era acquistabile quando è stato scelto l\'altro. È il motivo per cui nei dati di Beatty e Crawford passano il test anche le scelte casuali.',
  h:'Il paniere scelto dalla retta più alta quanto costa? Era acquistabile con ricchezza 8?'},
 {q:'Quando un bene si dice normale?',
  o:['Quando la sua funzione di Engel è crescente','Quando la sua domanda regolare è decrescente','Quando la sua domanda incrociata è costante','Quando il saggio marginale di sostituzione è pari al rapporto fra i prezzi'],a:0,
  e:'Normale riguarda la ricchezza: se sale, la quantità domandata sale. La reazione al proprio prezzo distingue invece i beni regolari da quelli di Giffen.',h:'Delle tre funzioni viste, una sola tiene fermi i prezzi e muove la ricchezza.'}
];

