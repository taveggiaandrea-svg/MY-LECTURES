INIT[4]=function(){
/* Apertura: azione e obbligazione sulla linea del denaro */
(function(){
  const root=$('#ab4'),X=z=>40+z*48,W=560;
  let s='<line x1="'+X(0)+'" y1="92" x2="'+X(10)+'" y2="92" stroke="#fff" stroke-width="1.5"/>';
  for(let z=0;z<=10;z++)s+='<line x1="'+X(z)+'" y1="88" x2="'+X(z)+'" y2="96" stroke="#fff" stroke-width="1"/>'+tx(X(z),114,z,{s:13,f:GRAY});
  s+=tx(X(10)+4,134,'euro',{s:13,f:GRAY,a:'end'});
  [1,9].forEach(z=>{s+='<line x1="'+X(z)+'" y1="92" x2="'+X(z)+'" y2="52" stroke="'+TEAL+'" stroke-width="2"/><circle cx="'+X(z)+'" cy="46" r="9" fill="'+TEAL+'"/>'+tx(X(z),28,'½',{s:15,f:TEAL})});
  s+='<line x1="'+X(5)+'" y1="92" x2="'+X(5)+'" y2="52" stroke="'+PUR+'" stroke-width="2"/><circle cx="'+X(5)+'" cy="46" r="9" fill="'+PUR+'"/>'+tx(X(5),28,'certo',{s:14,f:PUR});
  root.append(legend([[TEAL,'azione: 1 o 9','dot'],[PUR,'obbligazione: 5','dot']]));
  svgBox(root,W,140,s,'Linea del denaro da 0 a 10 euro: l\'azione paga 1 o 9 con probabilità un mezzo, l\'obbligazione paga 5 con certezza','34rem');
  const tr=el('div','trio');
  [['Alice: il rischio non le piace','[5] \\spf \\Lp'],['Carlo: il rischio non gli importa','[5] \\ind \\Lp'],['Bianca: il rischio le piace','\\Lp \\spf [5]']].forEach(a=>{const d=el('div');d.append(el('h4','',a[0]),el('div','',K(a[1])));tr.append(d)});
  root.append(tr);
})();
/* Avversione al rischio */
(function(){
  const root=$('#risk');
  const V=[{t:'\\vv(z)=\\sqrt{z}',f:z=>Math.sqrt(z/100),n:'concava'},{t:'\\vv(z)=z',f:z=>z/100,n:'lineare'},{t:'\\vv(z)=z^2',f:z=>z*z/1e4,n:'convessa'}];
  let cur=0,x=10,y=90,al=.5;
  const bs=V.map((v,i)=>{const b=btn(K(v.t),true);b.onclick=()=>{cur=i;draw()};return b});const c=group('Scegli la funzione di Bernoulli',bs);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 640 360');svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Funzione di Bernoulli, lotteria fra x e y e suo valore atteso');svg.style.maxWidth='36rem';
  const o=out();
  root.append(c,legend([[YEL,'funzione v'],[TEAL,'corda fra x e y'],[YEL,'utilità del valore atteso certo','dot'],[TEAL,'utilità attesa della lotteria','dot']]),svg,slider('somma '+K('x'),0,100,1,x,v=>{x=v;draw()}),slider('somma '+K('y'),0,100,1,y,v=>{y=v;draw()}),slider('probabilità '+K('\\alf')+' di '+K('x'),0,1,0.05,al,v=>{al=v;draw()}),o);
  const X=z=>60+z/100*540,Y=v=>320-v*290;
  function draw(){
    bs.forEach((b,i)=>press(b,i===cur));
    const f=V[cur].f,E=al*x+(1-al)*y,vE=f(E),EU=al*f(x)+(1-al)*f(y);
    let d='';for(let z=0;z<=100;z+=1)d+=(z?'L':'M')+X(z).toFixed(1)+' '+Y(f(z)).toFixed(1);
    let s='<line x1="60" y1="320" x2="600" y2="320" stroke="#fff" stroke-width="1.5"/><line x1="60" y1="320" x2="60" y2="24" stroke="#fff" stroke-width="1.5"/>'+
      '<path d="'+d+'" fill="none" stroke="'+YEL+'" stroke-width="3"/>'+
      '<line x1="'+X(x)+'" y1="'+Y(f(x))+'" x2="'+X(y)+'" y2="'+Y(f(y))+'" stroke="'+TEAL+'" stroke-width="2.5"/>'+
      '<line x1="'+X(E)+'" y1="320" x2="'+X(E)+'" y2="'+Math.min(Y(vE),Y(EU))+'" stroke="#fff" stroke-width="1.2" stroke-dasharray="4 5"/>'+
      '<circle cx="'+X(x)+'" cy="'+Y(f(x))+'" r="5" fill="#fff"/><circle cx="'+X(y)+'" cy="'+Y(f(y))+'" r="5" fill="#fff"/>'+
      '<circle cx="'+X(E)+'" cy="'+Y(vE)+'" r="7" fill="'+YEL+'"/><circle cx="'+X(E)+'" cy="'+Y(EU)+'" r="7" fill="'+TEAL+'"/>';
    const tick=(z,t)=>'<text x="'+X(z)+'" y="344" text-anchor="middle" font-size="17" font-style="italic" style="font-family:var(--serif)">'+t+'</text>';
    s+=tick(x,'x')+tick(y,'y');
    if(Math.abs(E-x)>7&&Math.abs(E-y)>7)s+='<text x="'+X(E)+'" y="344" text-anchor="middle" font-size="15" style="font-family:var(--serif)"><tspan font-style="italic">E</tspan>[<tspan font-style="italic">p</tspan>]</text>';
    s+='<text class="g" x="600" y="306" font-size="14" text-anchor="end">denaro z</text><text x="52" y="22" font-size="17" font-style="italic" text-anchor="end" style="fill:'+YEL+';font-family:var(--serif)">v</text>';
    svg.innerHTML=s;
    const diff=vE-EU,rel=Math.abs(diff)<1e-9?'\\ind':diff>0?'\\spf':'\\wpf';
    o.innerHTML=K('E[\\Lp]='+tn(E)+'\\qquad \\vv(E[\\Lp])='+tn(vE)+'\\qquad \\UU(\\Lp)='+tn(EU))+'<br>'+K('[E[\\Lp]]\\ '+rel+'\\ \\Lp')+' &nbsp; '+
      (cur===0?'La curva sta sopra la corda: <span class="ok">avversa al rischio</span>.':cur===1?'Curva e corda coincidono: neutrale al rischio.':'La curva sta sotto la corda: <span class="bad">non avversa al rischio</span>.');
  }
  draw();
})();

/* Equivalente certo: costruzione geometrica per tre funzioni di Bernoulli */
(function(){
  const root=$('#ce4'),tr=el('div','trio');
  root.append(legend([[YEL,'funzione v'],[TEAL,'corda fra 1 e 9'],[TEAL,'utilità attesa','dot'],[ORG,'equivalente certo c']]),tr);
  const P=[['Alice:&nbsp;'+K('\\vv(z)=\\ln z'),z=>Math.log(z)/Math.log(10),3,'3'],['Carlo:&nbsp;'+K('\\vv(z)=z'),z=>z/10,5,'5'],['Bianca:&nbsp;'+K('\\vv(z)=z^2'),z=>z*z/100,Math.sqrt(41),'6,4']];
  P.forEach((p,k)=>{const f=p[1],X=z=>34+z/10*190,Y=v=>172-v*150;
    let d='';for(let z=1;z<=10.001;z+=.1)d+=(d?'L':'M')+X(z).toFixed(1)+' '+Y(f(z)).toFixed(1);
    if(k>0){d='';for(let z=0;z<=10.001;z+=.1)d+=(d?'L':'M')+X(z).toFixed(1)+' '+Y(f(z)).toFixed(1)}
    const eu=(f(1)+f(9))/2,c=p[2];
    let s='<defs>'+arrowDef('ce'+k,ORG)+'</defs><path d="M34 14V172H232" fill="none" stroke="#fff" stroke-width="1.5"/>';
    s+='<path d="'+d+'" fill="none" stroke="'+YEL+'" stroke-width="3"/>';
    s+='<line x1="'+X(1)+'" y1="'+Y(f(1))+'" x2="'+X(9)+'" y2="'+Y(f(9))+'" stroke="'+TEAL+'" stroke-width="2.2"/>';
    s+='<line x1="'+X(5)+'" y1="172" x2="'+X(5)+'" y2="'+Y(eu)+'" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 4"/>';
    if(Math.abs(c-5)>.05)s+='<line x1="'+X(5)+'" y1="'+Y(eu)+'" x2="'+(X(c)+(c<5?9:-9))+'" y2="'+Y(eu)+'" stroke="'+ORG+'" stroke-width="2.5" marker-end="url(#ce'+k+')"/>';
    s+='<line x1="'+X(c)+'" y1="'+Y(eu)+'" x2="'+X(c)+'" y2="172" stroke="'+ORG+'" stroke-width="2.5"'+(Math.abs(c-5)>.05?'':' stroke-dasharray="6 4"')+'/>';
    s+='<circle cx="'+X(1)+'" cy="'+Y(f(1))+'" r="4" fill="#fff"/><circle cx="'+X(9)+'" cy="'+Y(f(9))+'" r="4" fill="#fff"/><circle cx="'+X(5)+'" cy="'+Y(eu)+'" r="6" fill="'+TEAL+'"/>';
    s+=tx(X(1),190,'1',{s:13,f:GRAY})+tx(X(9),190,'9',{s:13,f:GRAY});
    if(Math.abs(c-5)>.05)s+=tx(X(5),190,'5',{s:13,f:GRAY});
    s+=tx(X(c),208,'c = '+p[3],{s:15,f:ORG})+tx(232,208,'euro',{s:12,f:GRAY,a:'end'});
    cell(tr,p[0],s,240,214,'Costruzione dell\'equivalente certo: '+p[3]+' euro');
  });
})();
/* Più concava, equivalente certo più basso */
(function(){
  const root=$('#ap4'),X=z=>40+z*48;
  let s='<defs>'+arrowDef('apA',GRAY)+'</defs><line x1="'+X(0)+'" y1="96" x2="'+X(10)+'" y2="96" stroke="#fff" stroke-width="1.5"/>';
  for(let z=0;z<=10;z++)s+='<line x1="'+X(z)+'" y1="92" x2="'+X(z)+'" y2="100" stroke="#fff" stroke-width="1"/>'+tx(X(z),118,z,{s:13,f:GRAY});
  s+='<line x1="'+X(5)+'" y1="124" x2="'+X(5)+'" y2="138" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 4"/>'+tx(X(5),154,'valore atteso',{s:13,f:GRAY});
  [[3,'ln z',-1],[4,'√z',1],[5,'z',-1],[Math.sqrt(41),'z²',1]].forEach(a=>{const up=a[2]<0;
    s+='<circle cx="'+X(a[0])+'" cy="96" r="8" fill="'+ORG+'" stroke="#000" stroke-width="1.5"/>'+tx(X(a[0]),up?74:62,a[1],{s:16,f:YEL,i:1})+
      '<line x1="'+X(a[0])+'" y1="'+(up?79:67)+'" x2="'+X(a[0])+'" y2="86" stroke="'+GRAY+'" stroke-width="1"/>'});
  s+='<line x1="'+X(4.6)+'" y1="22" x2="'+X(1.2)+'" y2="22" stroke="'+GRAY+'" stroke-width="1.6" marker-end="url(#apA)"/>'+tx(X(2.9),14,'più avversa al rischio',{s:13,f:GRAY});
  root.append(legend([[ORG,'equivalente certo della lotteria «1 o 9»','dot']]));
  svgBox(root,560,158,s,'Equivalenti certi della lotteria 1 o 9 alla pari: 3 per ln z, 4 per radice di z, 5 per z, circa 6,4 per z al quadrato','34rem');
})();
/* Dominanza stocastica: funzioni di ripartizione a gradini */
(function(){
  const root=$('#fosd4'),duo=el('div','duo');
  root.append(legend([[TEAL,'ripartizione di p'],[PUR,'ripartizione di q','dash']]),duo);
  const draw=(title,xs,xl,F,G,label,foot)=>{const X=k=>44+k*(206/(xs.length)),Y=v=>172-v*140;
    let s='<path d="M44 20V172H254" fill="none" stroke="#fff" stroke-width="1.5"/>';
    [0,.5,1].forEach(v=>{s+=tx(36,Y(v)+4,fmt(v),{s:13,f:GRAY,a:'end'})+(v?'<line x1="44" y1="'+Y(v)+'" x2="254" y2="'+Y(v)+'" stroke="#2a2a2a"/>':'')});
    xl.forEach(a=>{s+=tx(X(a[0]),190,a[1],{s:13,f:GRAY})+'<line x1="'+X(a[0])+'" y1="168" x2="'+X(a[0])+'" y2="176" stroke="#fff"/>'});
    const st=(V,c,dy,dash)=>{let d='M'+X(0)+' '+(Y(0)+dy);V.forEach(a=>{d+='H'+X(a[0])+'V'+(Y(a[1])+dy)});d+='H254';
      return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="3" '+(dash?'stroke-dasharray="7 4"':'')+'/>'};
    s+=st(G,PUR,-2,true)+st(F,TEAL,2,false)+tx(149,210,'premio',{s:13,f:GRAY});
    cell(duo,title,s,264,216,label,foot)};
  draw('Premi 1, 10, 100',[0,1,2,3],[[.6,'1'],[1.8,'10'],[3,'100']],[[1.8,.5],[3,1]],[[.6,.1],[1.8,.7],[3,1]],
    'Funzioni di ripartizione a gradini: quella di p sta sempre sotto o alla pari di quella di q',K('\\FF \\le \\GG')+' ovunque: <span class="ok">'+K('\\Lp')+' domina.</span>');
  draw('Azione (p) e obbligazione (q)',[0,1,2,3,4,5,6,7,8,9],[[1,'1'],[5,'5'],[9,'9']],[[1,.5],[9,1]],[[5,1]],
    'Funzioni di ripartizione dell\'azione e dell\'obbligazione: si incrociano','Fra 1 e 5 è più bassa '+K('\\GG')+', fra 5 e 9 è più bassa '+K('\\FF')+': <span class="bad">nessuna domina.</span>');
})();
};
QZ['4a']=()=>[
 {q:'Una persona ha '+K('\\vv(z)=\\sqrt z')+'. Qual è il suo equivalente certo della lotteria che dà 0 oppure 100 con probabilità un mezzo?',
  o:['50','25','10','5'],a:1,
  e:'L\'utilità attesa è '+K('\\tfrac12\\sqrt0+\\tfrac12\\sqrt{100}=5')+'. L\'equivalente certo risolve '+K('\\sqrt{\\ceq}=5')+', cioè '+K('\\ceq=25')+': la metà del valore atteso.',
  h:'Calcola prima l\'utilità attesa, poi cerca la somma certa che ha proprio quell\'utilità.'}
];
QZ['4b']=()=>[
 {q:'Quanto vale il coefficiente di Arrow–Pratt di '+K('\\vv(z)=\\ln z')+' in '+K('z=2')+'?',
  o:['2','0,5','−0,25','0'],a:1,
  e:K('\\vv\'(z)=1/z')+' e '+K('\\vv\'\'(z)=-1/z^2')+', quindi '+K('r_A(z)=1/z')+', che in 2 vale 0,5. L\'avversione assoluta scende al crescere della ricchezza.',
  h:'Calcola le prime due derivate di '+K('\\ln z')+' e fai il rapporto, cambiato di segno.'}
];
QZ['4c']=()=>[
 {q:'Premi 1, 10 e 100. '+K('\\Lp=(0{,}2;\\ 0{,}3;\\ 0{,}5)')+' e '+K('\\Lq=(0{,}3;\\ 0{,}3;\\ 0{,}4)')+'. '+K('\\Lp')+' domina stocasticamente '+K('\\Lq')+'?',
  o:['Sì: '+K('\\FF \\le \\GG')+' in ogni punto','No: le due funzioni di ripartizione si incrociano','No: è '+K('\\Lq')+' a dominare '+K('\\Lp'),'Dipende dalla funzione di Bernoulli'],a:0,
  e:'Le ripartizioni sono '+K('\\FF=(0{,}2;\\ 0{,}5;\\ 1)')+' e '+K('\\GG=(0{,}3;\\ 0{,}6;\\ 1)')+': quella di '+K('\\Lp')+' non supera mai l\'altra. La dominanza non dipende dalla funzione di Bernoulli: vale per tutte quelle non decrescenti.',
  h:'Somma le probabilità da sinistra per ottenere le due funzioni di ripartizione, poi confrontale premio per premio.'}
];
QZ['4']=()=>[
 {q:'Una persona ha funzione di Bernoulli '+K('\\vv(z)=\\sqrt{z}')+'. Quanto vale l\'utilità attesa della lotteria che dà 0 oppure 100 con probabilità un mezzo ciascuno?',
  o:['5','circa 7,07','10','50'],a:0,
  e:K('0{,}5\\cdot\\sqrt{0} + 0{,}5\\cdot\\sqrt{100} = 5')+'. Il valore atteso certo, 50, varrebbe '+K('\\sqrt{50} \\approx 7{,}07')+': di più, perché '+K('\\vv')+' è concava.',h:'Calcola prima '+K('\\vv')+' dei due premi, poi fai la media: non la radice della media.'},
 {q:'Con preferenze coerenti con l\'utilità attesa, l\'avversione al rischio equivale a una funzione di Bernoulli…',
  o:['crescente','lineare','convessa','concava'],a:3,
  e:'Concava: la curva sta sopra la corda, cioè il valore atteso certo vale almeno quanto la lotteria.',h:'Nella figura, confronta il punto sulla curva con quello sulla corda.'},
 {q:'Una persona ha '+K('\\vv(z)=z^2')+'. La lotteria dà 0 oppure 10 con probabilità un mezzo. Qual è il suo equivalente certo?',
  o:['5','circa 7,07','2,5','10'],a:1,
  e:K('\\ceq^2=\\tfrac12\\cdot 0+\\tfrac12\\cdot 100=50')+', quindi '+K('\\ceq=\\sqrt{50}\\approx 7{,}07')+'. È più del valore atteso, 5: chi ama il rischio chiede più del valore atteso per rinunciare alla lotteria.',
  h:'Risolvi '+K('\\vv(\\ceq)=\\tfrac12\\vv(0)+\\tfrac12\\vv(10)')+'.'},
 {q:K('\\vv_2')+' è più avversa al rischio di '+K('\\vv_1')+'. Che cosa vale per ogni lotteria '+K('\\Lp')+'?',
  o:[K('\\ceq(\\Lp,\\vv_2) \\ge \\ceq(\\Lp,\\vv_1)'),K('\\ceq(\\Lp,\\vv_2) \\le \\ceq(\\Lp,\\vv_1)'),K('\\ceq(\\Lp,\\vv_2) = E[\\Lp]'),'I due equivalenti certi non sono confrontabili'],a:1,
  e:'Chi è più avverso al rischio si accontenta di una somma certa più bassa. È una delle tre definizioni equivalenti, insieme a '+K('r_A')+' più alto ovunque e a '+K('\\vv_2=\\varphi(\\vv_1)')+' con '+K('\\varphi')+' crescente e concava.',
  h:'Pensa a '+K('\\ln z')+' e '+K('\\sqrt z')+' nella figura con la linea del denaro.'},
 {q:'L\'azione paga 1 o 9 alla pari, l\'obbligazione paga 5 di sicuro. Perché nessuna delle due domina stocasticamente l\'altra?',
  o:['Perché hanno lo stesso valore atteso','Perché le loro funzioni di ripartizione si incrociano','Perché una delle due è una lotteria degenere','Perché la dominanza vale solo fra lotterie con gli stessi premi'],a:1,
  e:'Con l\'azione è più probabile finire sotto 5, ma è anche più probabile finire sopra 5. Nessuna delle due ripartizioni sta sempre sotto l\'altra, e infatti Alice e Bianca le ordinano in modo opposto.',
  h:'Guarda il secondo riquadro della figura sulla dominanza stocastica.'}
];

