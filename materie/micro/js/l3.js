INIT[3]=function(){
const lotTex=(w,names)=>{const t=[];w.forEach((v,i)=>{if(v>1e-9)t.push([v,names[i]])});
  return t.length===1?'['+t[0][1]+']':t.map(([v,n])=>tn(v)+'\\cdot '+n).join(' \\oplus ')};
const relPQ=c=>c>0?'\\Lp \\spf \\Lq':c<0?'\\Lq \\spf \\Lp':'\\Lp \\ind \\Lq';

function simplex(root,mode){
  const W=420,H=372,A=[210,34],B=[44,322],C=[376,322];
  const st=mode==='rules'?{p:[.6,.4,0],q:[0,1,0],vb:.6}:mode==='one'?{p:[.5,.2,.3],q:null,vb:.6}:{p:[.3,.2,.5],q:[.1,.7,.2],vb:.6};
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('class','tri');svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Triangolo delle lotterie su tre premi, con le lotterie p e q trascinabili');
  const o=out();
  root.append(legend(mode==='one'?[[TEAL,'lotteria p','dot']]:mode==='eu'?[[TEAL,'lotteria p','dot'],[PUR,'lotteria q','dot'],[YEL,'stessa utilità attesa']]:[[TEAL,'lotteria p','dot'],[PUR,'lotteria q','dot']]));
  root.append(svg);
  let sl=null;
  if(mode==='eu'){sl=slider('valore '+K('\\vv(b)'),0.05,0.95,0.05,st.vb,v=>{st.vb=v;draw()});root.append(sl)}
  root.append(o);
  const xy=w=>[w[0]*A[0]+w[1]*B[0]+w[2]*C[0],w[0]*A[1]+w[1]*B[1]+w[2]*C[1]];
  const det=(B[1]-C[1])*(A[0]-C[0])+(C[0]-B[0])*(A[1]-C[1]);
  function bary(x,y){
    let l0=((B[1]-C[1])*(x-C[0])+(C[0]-B[0])*(y-C[1]))/det,l1=((C[1]-A[1])*(x-C[0])+(A[0]-C[0])*(y-C[1]))/det,l2=1-l0-l1;
    let w=[l0,l1,l2].map(v=>v<0.045?0:v);let s=w[0]+w[1]+w[2];if(s<=0)return [1/3,1/3,1/3];
    w=w.map(v=>v/s);
    const r=[Math.round(w[0]*100)/100,Math.round(w[1]*100)/100,0];
    r[2]=Math.round((1-r[0]-r[1])*100)/100;if(r[2]<0){r[1]=Math.round((r[1]+r[2])*100)/100;r[2]=0}
    return r;
  }
  const U=w=>w[0]+w[1]*st.vb;
  function draw(){
    let s='';
    if(mode==='eu'){
      const vb=st.vb,line=(k,thick)=>{
        const P=xy([k,0,1-k]);let Q;
        if(k>=vb){const pa=(k-vb)/(1-vb);Q=xy([pa,1-pa,0])}else{const pb=k/vb;Q=xy([0,pb,1-pb])}
        return '<line x1="'+P[0].toFixed(1)+'" y1="'+P[1].toFixed(1)+'" x2="'+Q[0].toFixed(1)+'" y2="'+Q[1].toFixed(1)+'" stroke="'+YEL+'" stroke-width="'+(thick?3:1.2)+'" stroke-opacity="'+(thick?1:.55)+'"/>';
      };
      for(let k=1;k<10;k++)s+=line(k/10,false);
      s+=line(vb,true);
      const M=xy([vb,0,1-vb]);
      s+='<circle cx="'+M[0]+'" cy="'+M[1]+'" r="4.5" fill="'+YEL+'"/>';
    }
    s+='<polygon points="'+[A,B,C].map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#fff" stroke-width="2"/>';
    const lab=(P,t,dx,dy,anc)=>'<text x="'+(P[0]+dx)+'" y="'+(P[1]+dy)+'" font-size="20" text-anchor="'+anc+'" style="font-family:var(--serif)">[<tspan font-style="italic">'+t+'</tspan>]</text>';
    s+=lab(A,'a',0,-12,'middle')+lab(B,'b',-6,30,'middle')+lab(C,'c',6,30,'middle');
    [['q',PUR],['p',TEAL]].forEach(([k,c])=>{if(!st[k])return;const P=xy(st[k]);
      s+='<circle cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="11" fill="'+c+'" stroke="#000" stroke-width="2"/>'+
         '<text x="'+P[0].toFixed(1)+'" y="'+(P[1]+6).toFixed(1)+'" text-anchor="middle" font-size="17" font-style="italic" style="fill:#000;font-family:var(--serif)">'+k+'</text>'});
    svg.innerHTML=s;
    const names=['a','b','c'],p=st.p,q=st.q;
    if(mode==='one'){
      o.innerHTML=K('\\Lp = '+lotTex(p,names))+'<div class="bars" style="margin:.6rem auto 0;max-width:22rem">'+names.map((n,i)=>'<div class="bar" style="grid-template-columns:7rem 1fr 3rem"><span>probabilità di '+n+'</span><i style="--w:'+(p[i]*100)+'%"></i><b>'+fmt(p[i])+'</b></div>').join('')+'</div>';
      return;
    }
    let h=K('\\Lp = '+lotTex(p,names))+' &nbsp;&nbsp; '+K('\\Lq = '+lotTex(q,names))+'<br>';
    if(mode==='rules'){
      const worst=w=>w[2]>0?2:w[1]>0?1:0,supp=w=>w.filter(v=>v>0).length,G=w=>Math.round((w[0]+w[1])*100)/100;
      h+='<div class="scroll"><table style="margin-top:.6rem"><tbody>'+
        '<tr><td>Pessimista</td><td>peggior premio: '+K(names[worst(p)])+' e '+K(names[worst(q)])+'</td><td class="n">'+K(relPQ(worst(q)-worst(p)))+'</td></tr>'+
        '<tr><td>Buoni e cattivi</td><td>'+K('G(\\Lp)='+tn(G(p))+',\\ G(\\Lq)='+tn(G(q)))+'</td><td class="n">'+K(relPQ(G(p)-G(q)))+'</td></tr>'+
        '<tr><td>Meno esiti possibili</td><td>premi possibili: '+supp(p)+' e '+supp(q)+'</td><td class="n">'+K(relPQ(supp(q)-supp(p)))+'</td></tr>'+
        '</tbody></table></div>';
    }else{
      const up=Math.round(U(p)*1000)/1000,uq=Math.round(U(q)*1000)/1000;
      h+=K('\\UU(\\Lp)='+tn(up)+'\\qquad \\UU(\\Lq)='+tn(uq)+'\\qquad '+relPQ(up-uq));
    }
    o.innerHTML=h;
  }
  let who='p';
  drag(svg,(e,start)=>{const [x,y]=svgPoint(svg,e,W,H);
    if(start&&st.q){const dp=xy(st.p),dq=xy(st.q);who=Math.hypot(x-dp[0],y-dp[1])<=Math.hypot(x-dq[0],y-dq[1])?'p':'q'}
    st[who]=bary(x,y);draw()});
  draw();
}
simplex($('#simOne'),'one');
simplex($('#simRules'),'rules');
simplex($('#simEU'),'eu');

/* Continuità (lotterie) */
(function(){
  const root=$('#cont3');let kind='eu',al=.6;
  const b1=btn('utilità attesa, con v(b) = 0,6'),b2=btn('pessimista');const c=group('Scegli la persona che confronta',[b1,b2]);
  b1.onclick=()=>{kind='eu';draw()};b2.onclick=()=>{kind='pes';draw()};
  const svg=el('div');svg.style.cssText='width:100%;max-width:34rem';
  const sl=slider('peso '+K('\\alf')+' su '+K('a'),0,1,0.01,al,v=>{al=v;draw()}),o=out();
  root.append(c,legend([[TEAL,'la miscela','dot'],[YEL,'punto di indifferenza con b certo']]),svg,sl,o);
  function draw(){
    press(b1,kind==='eu');press(b2,kind==='pes');
    const X=v=>50+v*460;let cmp;
    if(kind==='eu')cmp=Math.abs(al-.6)<.005?0:al>.6?1:-1;else cmp=al>=1?1:-1;
    let s='<line x1="50" y1="40" x2="510" y2="40" stroke="#fff" stroke-width="2"/>';
    if(kind==='eu')s+='<line x1="'+X(.6)+'" y1="26" x2="'+X(.6)+'" y2="54" stroke="'+YEL+'" stroke-width="3"/><text x="'+X(.6)+'" y="18" text-anchor="middle" font-size="14" style="fill:'+YEL+'">indifferente a [b]</text>';
    s+='<circle cx="'+X(al)+'" cy="40" r="9" fill="'+TEAL+'"/>'+
       '<text x="50" y="76" text-anchor="middle" font-size="18" style="font-family:var(--serif)">[<tspan font-style="italic">c</tspan>]</text>'+
       '<text x="510" y="76" text-anchor="middle" font-size="18" style="font-family:var(--serif)">[<tspan font-style="italic">a</tspan>]</text>';
    svg.innerHTML='<svg viewBox="0 0 560 86" role="img" aria-label="Miscela fra c e a al variare di alfa">'+s+'</svg>';
    const mix=al>=1?'[a]':al<=0?'[c]':tn(al)+'\\cdot a \\oplus '+tn(1-al)+'\\cdot c';
    const rel=cmp>0?'\\spf':cmp<0?'\\wpf':'\\ind';
    o.innerHTML=K(mix+'\\ '+rel+'\\ [b]')+'<br>'+(kind==='eu'
      ?(cmp===0?'<span class="ok">Ecco il punto di indifferenza:</span> '+K('\\alf = \\vv(b) = 0{,}6')+'.':'Avvicinati a '+K('\\alf=0{,}6')+'.')
      :(al>=1?'Solo con '+K('\\alf=1')+' la miscela supera '+K('[b]')+': si salta da peggio a meglio senza passare per l\'indifferenza.':'<span class="bad">Nessun punto di indifferenza:</span> finché '+K('c')+' è possibile, il peggior premio è '+K('c')+'.'));
  }
  draw();
})();

/* Lotteria composta */
(function(){
  const root=$('#comp3');let al=.5;
  const p=[.6,0,.4],q=[.2,.3,.5],cols=[GRN,'#bdbdbd',RED],nm=['W','D','L'];
  const box=el('div','stack'),sl=slider('peso '+K('\\alf')+' su '+K('\\Lp'),0,1,0.05,al,v=>{al=v;draw()}),o=out();
  root.append(legend([[GRN,'vittoria W','box'],['#bdbdbd','pareggio D','box'],[RED,'sconfitta L','box']]),box,sl,o);
  const bar=w=>'<div class="s">'+w.map((v,i)=>v>0?'<span style="width:'+(v*100)+'%;background:'+cols[i]+'">'+(v>=.08?nm[i]+' '+fmt(v):'')+'</span>':'').join('')+'</div>';
  function draw(){
    const m=p.map((v,i)=>Math.round((al*v+(1-al)*q[i])*1000)/1000);
    box.innerHTML='<span>'+K('\\Lp')+'</span>'+bar(p)+'<span>'+K('\\Lq')+'</span>'+bar(q)+'<span>composta</span>'+bar(m);
    o.innerHTML=K(tn(al)+'\\cdot\\Lp \\oplus '+tn(1-al)+'\\cdot\\Lq \\;=\\; '+lotTex(m,nm));
  }
  draw();
})();

/* Allais */
(function(){
  const ans=[null,null];
  const Q=[{t:'Quale scegli?',o:[['L₁','4.000 dollari con probabilità 0,2; altrimenti nulla'],['R₁','3.000 dollari con probabilità 0,25; altrimenti nulla']]},
           {t:'E fra queste due?',o:[['L₂','4.000 dollari con probabilità 0,8; altrimenti nulla'],['R₂','3.000 dollari con certezza']]}];
  const roots=[$('#allaisQ'),$('#allaisR')],views=[];
  roots.forEach((root,ri)=>{
    const wrap=el('div','quiz');wrap.style.width='100%';
    const groups=Q.map((q,k)=>{const g=el('div','q');g.append(el('p','',q.t));const os=el('div','opts');
      q.o.forEach(([n,d],i)=>{const b=btn('<b>'+n+'</b> &nbsp;'+d,true);b.onclick=()=>{ans[k]=i;views.forEach(f=>f())};os.append(b)});
      g.append(os);wrap.append(g);return os});
    const res=el('div','w');
    root.append(wrap);if(ri===1)root.append(res);
    views.push(()=>{
      groups.forEach((os,k)=>[...os.children].forEach((b,i)=>press(b,ans[k]===i)));
      if(ri!==1)return;
      const data=[['L₁ e L₂',20,0,0],['L₁ e R₂',44,0,1],['R₁ e L₂',5,1,0],['R₁ e R₂',31,1,1]];
      let h='<div class="bars">'+data.map(d=>{const me=ans[0]===d[2]&&ans[1]===d[3];
        return '<div class="bar"><span>'+d[0]+(me?' (tu)':'')+'</span><i style="--w:'+d[1]+'%"></i><b>'+d[1]+'%</b></div>'}).join('')+'</div>';
      if(ans[0]===null||ans[1]===null)h+='<div class="out">Rispondi alle due domande per vedere dove ti collochi.</div>';
      else{const cons=ans[0]===ans[1];
        h+='<div class="out">'+(cons?'<span class="ok">Le tue risposte sono compatibili con l\'utilità attesa.</span>':'<span class="bad">Le tue risposte violano l\'indipendenza,</span> come quelle di quasi metà dei partecipanti.')+'</div>'}
      res.innerHTML=h;
    });
  });
  views.forEach(f=>f());
  /* i due confronti sotto l'utilità attesa */
  const root=$('#allaisEU');let t=.7;
  const box=el('div','bars'),sl=slider('valore '+K('\\vv(3000)'),0.5,1,0.01,t,v=>{t=v;draw()}),o=out();
  box.style.maxWidth='34rem';root.append(box,sl,o);
  function draw(){
    const r=(n,u)=>'<div class="bar"><span>'+K(n)+'</span><i style="--w:'+(u*100)+'%"></i><b>'+fmt(u)+'</b></div>';
    box.innerHTML='<h4>Prima domanda</h4>'+r('\\UU(L_1)',.2)+r('\\UU(R_1)',.25*t)+'<h4>Seconda domanda</h4>'+r('\\UU(L_2)',.8)+r('\\UU(R_2)',t);
    const c=Math.abs(t-.8)<.005?0:t<.8?1:-1;
    o.innerHTML=c===0?'Indifferente in entrambe le domande.':c>0?'Sceglie '+K('L_1')+' e '+K('L_2')+': '+K('0{,}2 > 0{,}25\\cdot'+tn(t))+' e '+K('0{,}8 > '+tn(t))+'.'
      :'Sceglie '+K('R_1')+' e '+K('R_2')+': '+K('0{,}25\\cdot'+tn(t)+' > 0{,}2')+' e '+K(tn(t)+' > 0{,}8')+'.';
  }
  draw();
})();


/* Le tre lotterie dell'apertura delle slide: barre di probabilità */
function probBars(root,rows,W,label,maxw){
  const x0=64,bw=W-x0-118,rh=58;let s='';
  rows.forEach((r,k)=>{const y=10+k*rh;let x=x0;
    s+=tx(x0-12,y+30,r.n,{a:'end',s:16,i:r.it});
    r.seg.forEach(g=>{const w=g[0]*bw;
      s+='<rect x="'+x.toFixed(1)+'" y="'+(y+10)+'" width="'+Math.max(w-2,1).toFixed(1)+'" height="30" fill="'+g[2]+'"/>';
      if(w>8*String(g[1]).length+8)s+=tx(x+w/2,y+31,g[1],{s:13,f:g[3]||'#000'});
      s+=tx(x+w/2,y+5,fmt(g[0]),{s:12,f:GRAY});x+=w});
    if(r.mark)s+='<rect x="'+(x0-4)+'" y="'+(y+6)+'" width="'+(bw+6)+'" height="38" fill="none" stroke="'+PINK+'" stroke-width="2.5"/>';
    if(r.r)s+=tx(x0+bw+12,y+31,r.r,{a:'start',s:13,f:'#e6e6e6'});
  });
  svgBox(root,W,10+rows.length*rh,s,label,maxw||'38rem');
}
(function(){
  const sh=v=>'rgba(92,208,179,'+(0.25+0.75*v/1102).toFixed(2)+')';
  const mk=a=>a.map(([p,z])=>[p,'$'+z,z?sh(z):'#3a3a3a',z?'#000':'#e6e6e6']);
  probBars($('#three3'),[
    {n:'(a)',seg:mk([[.57,117],[.22,377],[.21,781]]),r:'media ≈ 314'},
    {n:'(b)',seg:mk([[.27,0],[.73,456]]),r:'media ≈ 333'},
    {n:'(c)',seg:mk([[.07,167],[.62,310],[.25,689],[.06,1102]]),r:'media ≈ 442'}],640,
    'Tre lotterie: (a) 117 dollari con probabilità 0,57, 377 con 0,22, 781 con 0,21; (b) 0 con 0,27, 456 con 0,73; (c) 167 con 0,07, 310 con 0,62, 689 con 0,25, 1102 con 0,06');
})();
/* Allais, versione originale */
(function(){
  const root=$('#allaisO'),Y=[YEL,'#000'],T=[TEAL,'#000'],Z=['#3a3a3a','#e6e6e6'];
  const sg=(a,b,c)=>[[a,'2,5 mln',...Y],[b,'500 000',...T],[c,'0',...Z]].filter(g=>g[0]>0);
  root.append(legend([[YEL,'2 500 000','box'],[TEAL,'500 000','box'],['#3a3a3a','0','box'],[PINK,'la scelta più comune','dash']]));
  probBars(root,[{n:'A₁',seg:sg(0,1,0),mark:1},{n:'A₁′',seg:sg(.10,.89,.01)},{n:'A₂',seg:sg(0,.11,.89)},{n:'A₂′',seg:sg(.10,0,.90),mark:1}],600,
    'Le quattro lotterie di Allais come barre di probabilità sui premi 2 500 000, 500 000 e 0','34rem');
})();
};
QZ['3b']=()=>[
 {q:'Stessi premi, 100, 10 e 1 dollaro. La persona che vuole «meno esiti possibili» confronta '+K('\\Lp=(0;\\ 0;\\ 1)')+' e '+K('\\Lq=(0{,}5;\\ 0{,}5;\\ 0)')+'. Quale preferisce?',
  o:[K('\\Lq')+', perché non dà mai il premio peggiore',K('\\Lp')+', perché ha un solo esito possibile','È indifferente','Non sono confrontabili'],a:1,
  e:'Il supporto di '+K('\\Lp')+' ha un premio solo, quello di '+K('\\Lq')+' ne ha due. A lei non importa che il premio sicuro sia il peggiore dei tre.',
  h:'Conta i premi che hanno probabilità positiva in ciascuna lotteria.'}
];
QZ['3a']=()=>[
 {q:'Con le lotterie della figura, '+K('\\Lp = 0{,}6 \\cdot W \\oplus 0{,}4 \\cdot L')+' e '+K('\\Lq = 0{,}2 \\cdot W \\oplus 0{,}3 \\cdot D \\oplus 0{,}5 \\cdot L')+', con quale probabilità la lotteria composta '+K('0{,}5 \\cdot \\Lp \\oplus 0{,}5 \\cdot \\Lq')+' dà la vittoria '+K('W')+'?',
  o:['0,3','0,4','0,6','0,8'],a:1,
  e:K('0{,}5 \\cdot 0{,}6 + 0{,}5 \\cdot 0{,}2 = 0{,}4')+': la media pesata delle due probabilità di vittoria.',h:'Pesa la probabilità di '+K('W')+' in ciascuna lotteria con la probabilità di giocare quella lotteria.'}
];
QZ['3']=()=>[
 {q:'Con almeno tre premi, quali proprietà violano le preferenze della pessimista?',
  o:['Solo la continuità','Solo l\'indipendenza','Sia la continuità sia l\'indipendenza','Nessuna delle due'],a:2,
  e:'Non c\'è mai una miscela indifferente al premio intermedio, e sostituire un premio con uno migliore può lasciarla indifferente.',h:'Riguarda la figura sulla continuità e l\'esempio con 0,6 e 0,4.'},
 {q:K('\\vv')+' è una funzione di Bernoulli per certe preferenze. Quale di queste lo è di sicuro per le stesse preferenze?',
  o:[K('\\vv^2'),K('2\\vv+3'),K('-\\vv'),K('\\sqrt{\\vv}')],a:1,
  e:'Le funzioni di Bernoulli per le stesse preferenze sono tutte e sole quelle della forma '+K('k\\vv+h')+' con '+K('k>0')+'.',h:'Qui non basta una trasformazione crescente qualsiasi.'},
 {q:'La coppia di risposte più frequente alle domande di Allais, '+K('L_1')+' e '+K('R_2')+', è in conflitto con…',
  o:['la completezza','la transitività','l\'indipendenza','l\'avversione al rischio'],a:2,
  e:'La prima domanda è la seconda diluita con la stessa lotteria: per l\'indipendenza le due risposte devono andare nello stesso verso.',h:'Pensa a come '+K('L_1')+' e '+K('R_1')+' si scrivono usando '+K('L_2')+' e '+K('R_2')+'.'},
 {q:'Premi 100, 10 e 1 dollaro, con '+K('\\Lp=(\\tfrac12,0,\\tfrac12)')+' e '+K('\\Lq=[10]')+'. Quale lotteria sui premi è la composta '+K('\\tfrac14\\cdot\\Lp\\oplus\\tfrac34\\cdot\\Lq')+'?',
  o:[K('(\\tfrac14,\\tfrac12,\\tfrac14)'),K('(\\tfrac18,\\tfrac34,\\tfrac18)'),K('(\\tfrac12,\\tfrac14,\\tfrac14)'),K('(\\tfrac18,\\tfrac18,\\tfrac34)')],a:1,
  e:'Ogni probabilità è la media pesata: '+K('\\tfrac14\\cdot\\tfrac12=\\tfrac18')+' per 100 e per 1, e '+K('\\tfrac34\\cdot 1=\\tfrac34')+' per 10.',
  h:'Moltiplica le probabilità di '+K('\\Lp')+' per un quarto, quelle di '+K('\\Lq')+' per tre quarti, e somma premio per premio.'},
 {q:'Nell\'Allais originale, chi sceglie '+K('A_1')+' e '+K('A_2\'')+' ha una relazione di preferenza? Ed è coerente con l\'utilità attesa?',
  o:['Né l\'una né l\'altra cosa','Può avere una relazione di preferenza, ma non coerente con l\'utilità attesa','È coerente con l\'utilità attesa, ma viola la transitività','Entrambe le cose, con una '+K('\\vv')+' abbastanza concava'],a:1,
  e:'Completezza e transitività non sono in discussione: '+K('A_1 \\spf A_1\' \\spf A_2\' \\spf A_2')+' è un ordinamento legittimo. Ma le due scelte chiedono a '+K('\\vv')+' due disuguaglianze opposte, e nessuna funzione di Bernoulli le soddisfa entrambe.',
  h:'Razionale, nel senso delle prime due lezioni, vuol dire solo avere una preferenza completa e transitiva.'}
];

