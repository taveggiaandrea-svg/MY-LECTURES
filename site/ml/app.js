(function(){
'use strict';
const R=String.raw;
const BLUE='#58C4DD',YEL='#FFFF00',PINK='#DC75CD',GRN='#83C167',ORG='#FF862F',TEAL='#5CD0B3',PUR='#CAA3E8',RED='#FC6255',GRAY='#8c8c8c';
const NAME={[BLUE]:'blue',[YEL]:'yellow',[PINK]:'pink',[GRN]:'green',[ORG]:'orange',[TEAL]:'teal',[PUR]:'purple',[RED]:'red'};
const col=(c,s)=>R`\htmlClass{k-${NAME[c]}}{${s}}`;
const MAC={
  '\\pf':R`\mathrel{${col(BLUE,R`\succsim`)}}`,'\\spf':R`\mathrel{${col(BLUE,R`\succ`)}}`,'\\ind':R`\mathrel{${col(BLUE,R`\sim`)}}`,
  '\\uu':col(YEL,'u'),'\\vv':col(YEL,'v'),'\\ww':col(YEL,'w'),'\\UU':col(YEL,'U'),
  '\\cf':col(PINK,'c'),
  '\\sA':col(GRN,'A'),'\\sB':col(GRN,'B'),'\\sX':col(GRN,'X'),
  '\\vs':col(ORG,'v^*'),'\\epsi':col(ORG,R`\varepsilon`),
  '\\wpf':R`\mathrel{${col(BLUE,R`\prec`)}}`,
  '\\Lp':col(TEAL,'p'),'\\Lq':col(PUR,'q'),'\\alf':col(TEAL,R`\alpha`),'\\bet':col(TEAL,R`\beta`),'\\lam':col(TEAL,R`\lambda`),
  '\\pu':col(ORG,'p_1'),'\\pd':col(ORG,'p_2'),'\\wl':col(ORG,'w'),'\\dx':col(PINK,'x'),'\\mrs':col(BLUE,R`\mathit{MRS}`),
  /* lezione 4: rischio */
  '\\ceq':col(ORG,'c'),'\\FF':col(TEAL,'F'),'\\GG':col(PUR,'G'),
  /* lezione 5: probabilità soggettive */
  '\\af':col(PINK,'f'),'\\ag':col(PUR,'g'),'\\ppi':col(TEAL,R`\pi`),'\\sO':col(GRN,R`\Omega`),'\\sF':col(GRN,'F'),
  /* lezioni 7 e 8: prezzi come vettore, spesa, domanda compensata */
  '\\pp':col(ORG,'p'),'\\ee':col(ORG,'e'),'\\hh':col(PINK,'h'),'\\ub':col(YEL,R`\bar u`),
  /* lezione 9: giungla */
  '\\pw':R`\mathrel{${col(ORG,R`\triangleright`)}}`,'\\sN':col(GRN,'N'),'\\sH':col(GRN,'H'),'\\aA':col(PINK,'a'),'\\aB':col(PUR,'b'),
  /* lezione 10: economia di scambio */
  '\\dd':col(PINK,'d'),'\\zd':col(PINK,'z'),
  /* lezioni 11 e 12: giochi */
  '\\sig':col(TEAL,R`\sigma`),'\\bel':col(PUR,R`\theta`),'\\sS':col(GRN,'S')
};
/* disegno statico: un SVG con viewBox dentro un contenitore a larghezza massima */
const svgBox=(root,w,h,inner,label,maxw)=>{const d=el('div');d.style.cssText='width:100%;max-width:'+(maxw||'34rem');
  d.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+label+'">'+inner+'</svg>';root.append(d);return d};
const SER='font-family:var(--serif)';
const tx=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||14)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+(o.i?' font-style="italic"':'')+
  ' style="'+(o.i||o.serif?SER+';':'')+(o.f?'fill:'+o.f:'')+'"'+(o.x||'')+'>'+t+'</text>'};
const arrowDef=(id,c)=>'<marker id="'+id+'" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+c+'"/></marker>';
const hasK=typeof katex!=='undefined';
const K=s=>hasK?katex.renderToString(s,{throwOnError:false,macros:MAC,trust:true,strict:'ignore'}):s;
function renderMath(root){
  if(typeof renderMathInElement==='undefined')return;
  renderMathInElement(root,{macros:MAC,throwOnError:false,trust:true,strict:'ignore',
    delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}]});
  root.querySelectorAll('.katex').forEach(k=>{
    if(k.closest('.katex-display'))return;const n=k.nextSibling;
    if(n&&n.nodeType===3){const m=n.nodeValue.match(/^[.,;:!?»)]+/);
      if(m){const w=document.createElement('span');w.style.whiteSpace='nowrap';k.parentNode.insertBefore(w,k);w.append(k,m[0]);n.nodeValue=n.nodeValue.slice(m[0].length)}}
  });
}
/* testi fissi dell'interfaccia: una materia in un'altra lingua li sovrascrive con Object.assign(UI,{...}) nel suo js/macro.js */
const UI={check:'Verifica',pickFirst:'Scegli prima una risposta.',right:'Esatto.',wrong:'Non proprio.',play:'Riproduci',pause:'Pausa',seek:'Posizione nell\'animazione',
  prev:'Lezione precedente',next:'Lezione successiva',toLight:'Passa al tema chiaro',toDark:'Passa al tema scuro',
  ask:'Chiedi all\'AI',askSend:'Chiedi',askKey:'Cambia chiave',askPrompt:'Chiave API di Gemini (resta solo in questo browser):',
  askSys:'Sei un tutor. Rispondi in italiano, in modo breve e chiaro, basandoti sulle lezioni fornite: prima la lezione aperta, poi la mappa del corso e gli estratti delle altre lezioni. Quando usi un\'altra lezione, indica quale. Se la domanda esce dal corso, dillo.',
  askSlow:'nessuna risposta in tempo, provo il modello successivo.',
  askFmt:'Scrivi le formule in LaTeX fra \\( \\) o \\[ \\], mai con il simbolo del dollaro.'};
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e};
const btn=(label,html)=>{const b=el('button','btn');b.type='button';if(html)b.innerHTML=label;else b.textContent=label;return b};
const press=(b,on)=>b.setAttribute('aria-pressed',on?'true':'false');
const fmt=v=>String(Math.round(v*100)/100).replace('-','−').replace('.',',');
const tn=v=>String(Math.round(v*100)/100).replace('.','{,}');
const out=()=>{const o=el('div','out');o.setAttribute('aria-live','polite');return o};
const slider=(label,min,max,step,val,on)=>{
  const l=el('label','sl'),s=el('span','',label),i=el('input'),v=el('span','v');
  i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;
  i.oninput=()=>{v.textContent=fmt(+i.value);on(+i.value)};v.textContent=fmt(val);
  l.append(s,i,v);l.input=i;l.val=v;l.set=x=>{i.value=x;v.textContent=fmt(+i.value)};return l;
};
/* legenda: [colore, testo, forma] con forma '' (linea), 'dot', 'box', 'dash' */
const legend=items=>el('div','legend',items.map(a=>'<span><i class="'+(a[2]||'')+'" style="'+(a[2]==='dash'?'border-color:':'background:')+a[0]+'"></i>'+a[1]+'</span>').join(''));
/* gruppo di pulsanti con la riga che dice che cosa si sta scegliendo */
const group=(label,buttons)=>{const g=el('div','grp');g.append(el('div','pick',label));const c=el('div','ctl');buttons.forEach(b=>c.append(b));g.append(c);return g};
const svgPoint=(svg,e,W,H)=>{const r=svg.getBoundingClientRect();return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]};
const drag=(node,move)=>{let down=false;
  node.addEventListener('pointerdown',e=>{down=true;try{node.setPointerCapture(e.pointerId)}catch(_){}move(e,true);e.preventDefault()});
  node.addEventListener('pointermove',e=>{if(down)move(e,false)});
  ['pointerup','pointercancel'].forEach(t=>node.addEventListener(t,()=>{down=false}));
};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
/* controlli in stile video: play/pausa, tempo, barra trascinabile. onFrame riceve il tempo in secondi */
function player(host,dur,onFrame){
  const IC={play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
    pause:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor"/></svg>'};
  const bar=el('div','player'),b=el('button','',IC.play),tm=el('span','tm'),sc=el('input');
  b.type='button';b.setAttribute('aria-label',UI.play);
  sc.type='range';sc.min=0;sc.max=dur;sc.step=0.01;sc.value=0;sc.setAttribute('aria-label',UI.seek);
  bar.append(b,tm,sc);host.append(bar);
  let pos=0,raf=null,last=0;const f=x=>{const s=Math.floor(x+1e-6);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  function show(){sc.value=pos;tm.textContent=f(pos)+' / '+f(dur);onFrame(pos)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}b.innerHTML=IC.play;b.setAttribute('aria-label',UI.play)}
  function tick(ts){if(!last)last=ts;pos=Math.min(dur,pos+Math.min(0.1,(ts-last)/1000));last=ts;show();if(pos>=dur){raf=null;stop()}else raf=requestAnimationFrame(tick)}
  function play(){if(pos>=dur)pos=0;last=0;b.innerHTML=IC.pause;b.setAttribute('aria-label',UI.pause);raf=requestAnimationFrame(tick)}
  b.addEventListener('click',()=>raf?stop():play());
  sc.addEventListener('input',()=>{stop();pos=+sc.value;show()});
  show();return {stop,play,seek(k){stop();pos=k;show()}};
}
/* quiz a scelta multipla: si sceglie, poi «Verifica» */
function quiz(root,qs){
  qs.forEach(q=>{
    const box=el('div','q');box.append(el('p','',q.q));
    const opts=el('div','opts'),fb=el('div','fb'),chk=btn(UI.check);chk.classList.add('solid','chk');fb.setAttribute('aria-live','polite');
    let sel=null;
    const bsq=q.o.map((t,i)=>{const b=btn(t,true);b.onclick=()=>{sel=i;bsq.forEach((x,j)=>{press(x,j===i);x.classList.remove('right','wrong')});fb.innerHTML=''};opts.append(b);return b});
    chk.onclick=()=>{if(sel===null){fb.innerHTML=UI.pickFirst;return}
      press(bsq[sel],false);bsq[sel].classList.add(sel===q.a?'right':'wrong');
      fb.innerHTML=sel===q.a?'<b>'+UI.right+'</b> '+q.e:'<b>'+UI.wrong+'</b> '+q.h};
    box.append(opts,chk,fb);root.append(box);
  });
}
const INIT={},QZ={},THUMB={};

/* strumenti condivisi dalle lezioni sul consumatore (7 e 8): piano dei panieri */
const NS='http://www.w3.org/2000/svg',S=400,x0=46,y0=14,L=340;
let pid=0;
const pt=p=>'('+tn(p[0])+';\\,'+tn(p[1])+')';
const r1=v=>Math.round(v*10)/10,r2=v=>Math.round(v*100)/100;
/* piano dei panieri: assi, ritaglio, tracciati */
function plane(Rg,ticks,label){
  const X=v=>x0+v/Rg*L,Y=v=>y0+L-v/Rg*L,id='p5'+(++pid);
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+S+' '+S);svg.setAttribute('role','img');svg.setAttribute('aria-label',label);
  svg.style.maxWidth='26rem';
  const defs='<defs><clipPath id="'+id+'"><rect x="'+x0+'" y="'+y0+'" width="'+L+'" height="'+L+'"/></clipPath></defs>';
  const axes=()=>{let s='<line x1="'+x0+'" y1="'+(y0+L)+'" x2="'+(x0+L)+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/>';
    ticks.forEach(v=>{s+='<text class="g" x="'+X(v)+'" y="'+(y0+L+20)+'" font-size="13" text-anchor="middle">'+fmt(v)+'</text>'+(v?'<text class="g" x="'+(x0-8)+'" y="'+(Y(v)+5)+'" font-size="13" text-anchor="end">'+fmt(v)+'</text>':'')});
    return s+'<text class="g" x="'+(x0+L/2)+'" y="'+(S-5)+'" font-size="14" text-anchor="middle">quantità del bene 1</text>'+
      '<text class="g" x="13" y="'+(y0+L/2)+'" font-size="14" text-anchor="middle" transform="rotate(-90 13 '+(y0+L/2)+')">quantità del bene 2</text>'};
  const path=pts=>pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
  const tri=(p1,p2,w,c,op)=>'<path d="'+path([[0,0],[w/p1,0],[0,w/p2]])+'Z" fill="'+c+'" fill-opacity="'+(op===undefined?.22:op)+'"/>';
  const bline=(p1,p2,w,c,extra)=>'<line x1="'+X(w/p1)+'" y1="'+Y(0)+'" x2="'+X(0)+'" y2="'+Y(w/p2)+'" stroke="'+c+'" stroke-width="3" '+(extra||'')+'/>';
  const clip=s=>'<g clip-path="url(#'+id+')">'+s+'</g>';
  const dot=(p,c,r)=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="'+(r||7)+'" fill="'+c+'" stroke="#000" stroke-width="2"/>';
  const lab=(p,n,dx,dy,c)=>'<text x="'+(X(p[0])+(dx===undefined?12:dx))+'" y="'+(Y(p[1])+(dy===undefined?-10:dy))+'" font-size="19" font-style="italic" style="font-family:var(--serif);paint-order:stroke;stroke:#000;stroke-width:4px'+(c?';fill:'+c:'')+'">'+n+'</text>';
  return {svg,X,Y,defs,axes,path,tri,bline,clip,dot,lab,Rg};
}
const hyp=(k,Rg)=>{const pts=[];if(k<=1e-9)return [[0,Rg],[0,0],[Rg,0]];for(let i=0;i<=80;i++){const x=k/Rg+(Rg-k/Rg)*Math.pow(i/80,2);pts.push([x,k/x])}return pts};
const qcurve=(k,Rg)=>{const pts=[];for(let i=0;i<=140;i++){const y=Rg*i/140;pts.push([k-Math.sqrt(y),y])}return pts};

/* piano piccolo per figure statiche a più riquadri: restituisce pezzi di SVG */
function mini(Rg,S){
  S=S||260;const m=30,Lm=S-m-14,X=v=>m+v/Rg*Lm,Y=v=>12+Lm-v/Rg*Lm,f=v=>v.toFixed(1);
  const P=p=>f(X(p[0]))+' '+f(Y(p[1]));
  return {S,X,Y,H:12+Lm+24,
    axes:(lx,ly)=>'<path d="M'+m+' 8V'+(12+Lm)+'H'+(S-6)+'" fill="none" stroke="#fff" stroke-width="1.5"/>'+
      tx(m+Lm/2,12+Lm+19,lx||'bene 1',{s:13,f:GRAY})+tx(12,12+Lm/2,ly||'bene 2',{s:13,f:GRAY,x:' transform="rotate(-90 12 '+(12+Lm/2)+')"'}),
    seg:(a,b,c,w,extra)=>'<line x1="'+f(X(a[0]))+'" y1="'+f(Y(a[1]))+'" x2="'+f(X(b[0]))+'" y2="'+f(Y(b[1]))+'" stroke="'+c+'" stroke-width="'+(w||2.5)+'" '+(extra||'')+'/>',
    bl:(p1,p2,w,c,sw,extra)=>'<line x1="'+f(X(w/p1))+'" y1="'+f(Y(0))+'" x2="'+f(X(0))+'" y2="'+f(Y(w/p2))+'" stroke="'+c+'" stroke-width="'+(sw||2.5)+'" '+(extra||'')+'/>',
    tri:(p1,p2,w,c,op)=>'<path d="M'+P([0,0])+'L'+P([w/p1,0])+'L'+P([0,w/p2])+'Z" fill="'+c+'" fill-opacity="'+(op===undefined?.22:op)+'"/>',
    dot:(p,c,r)=>'<circle cx="'+f(X(p[0]))+'" cy="'+f(Y(p[1]))+'" r="'+(r||6)+'" fill="'+c+'" stroke="#000" stroke-width="1.5"/>',
    lab:(p,t,dx,dy,c,s,a)=>'<text x="'+f(X(p[0])+(dx||0))+'" y="'+f(Y(p[1])+(dy||0))+'" font-size="'+(s||15)+'" text-anchor="'+(a||'start')+'" style="paint-order:stroke;stroke:#000;stroke-width:3px;fill:'+(c||'#fff')+'">'+t+'</text>',
    path:(pts,c,w,extra)=>'<path d="'+pts.map((p,i)=>(i?'L':'M')+P(p)).join('')+'" fill="none" stroke="'+c+'" stroke-width="'+(w||2.5)+'" '+(extra||'')+'/>',
    spline:(pts,c,w)=>{let d='M'+P(pts[0]);for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
      d+='C'+P([p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6])+' '+P([p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6])+' '+P(p2)}
      return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/>'}
  };
}
/* riquadro con titolo dentro una griglia .duo/.trio/.multi */
const cell=(host,title,svgInner,S,H,label,foot)=>{const d=el('div');if(title)d.append(el('h4','',title));
  const b=el('div');b.style.cssText='width:100%';b.innerHTML='<svg viewBox="0 0 '+S+' '+H+'" role="img" aria-label="'+label+'">'+svgInner+'</svg>';d.append(b);
  if(foot)d.append(el('div','cellnote',foot));host.append(d);return d};
/* alberi di gioco: nodi decisionali, rami con etichetta, foglie con payoff, insiemi di informazione tratteggiati */
const P1C=PINK,P2C=BLUE;
const payTxt=(x,y,v,s)=>{const f=a=>String(a).replace('.',',').replace('-','−');
  return '<text x="'+x+'" y="'+y+'" font-size="'+(s||14)+'" text-anchor="middle"><tspan style="fill:'+P1C+'">'+f(v[0])+'</tspan><tspan style="fill:#8c8c8c">, </tspan><tspan style="fill:'+P2C+'">'+f(v[1])+'</tspan></text>'};
function gameTree(spec){
  const N={};spec.nodes.forEach(n=>N[n.id]=n);let s='';
  (spec.infos||[]).forEach(g=>{for(let k=0;k<g.length-1;k++){const a=N[g[k]],b=N[g[k+1]];
    s+='<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 5"/>'}});
  spec.edges.forEach(([u,v,l,side])=>{const a=N[u],b=N[v];
    s+='<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="#bdbdbd" stroke-width="1.6"/>';
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x<a.x?-9:b.x>a.x?9:9;
    s+=tx(mx+(side||dx),my+(b.x===a.x?4:-2),l,{s:14,i:1,serif:1,a:(side||dx)<0?'end':'start'})});
  spec.nodes.forEach(n=>{
    if(n.pay){s+=payTxt(n.x,n.y+18,n.pay,spec.ps)}
    else{s+='<circle cx="'+n.x+'" cy="'+n.y+'" r="6" fill="#fff"/>';
      if(n.p)s+=tx(n.x+(n.lx||0),n.y+(n.ly||-12),n.p,{s:14,f:n.p==='1'?P1C:P2C,w:600})}
  });
  return s;
}
/* matrice di un gioco 2 giocatori: righe, colonne, celle [[u1,u2],...] */
function gameMatrix(rows,cols,cells,o){
  o=o||{};const cw=o.cw||74,rh=o.rh||40,x0=o.x0||56,y0=o.y0||30,W=x0+cols.length*cw+8,H=y0+rows.length*rh+8;
  let s='';
  if(o.title)s+=tx(W/2,14,o.title,{s:14,f:'#fff',w:500});
  cols.forEach((c,j)=>{s+=tx(x0+j*cw+cw/2,y0-8,c,{s:14,i:1,serif:1,f:P2C})});
  rows.forEach((r,i)=>{s+=tx(x0-10,y0+i*rh+rh/2+5,r,{s:14,i:1,serif:1,f:P1C,a:'end'});
    cols.forEach((c,j)=>{const x=x0+j*cw,y=y0+i*rh,hl=o.hl&&o.hl.some(h=>h[0]===i&&h[1]===j);
      s+='<rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+rh+'" fill="'+(hl?'rgba(255,134,47,.18)':'none')+'" stroke="#555"/>'+payTxt(x+cw/2,y+rh/2+5,cells[i][j],o.ps)})});
  return {s,W,H};
}


/* Machine Learning: macro KaTeX, un colore per variabile (pesi gialli, input blu, output verdi, loss rosa, passi e iperparametri arancioni) */
{const mc=(n,x)=>R`\htmlClass{k-${n}}{${x}}`;
Object.assign(MAC,{
  '\\Ws':mc('yellow','w'),'\\Wv':mc('yellow',String.raw`\mathbf{w}`),'\\Mm':mc('yellow','m'),'\\Bi':mc('yellow','b'),'\\Be':mc('yellow',String.raw`\beta`),
  '\\Xs':mc('blue','x'),'\\Xv':mc('blue',String.raw`\mathbf{x}`),'\\Xm':mc('blue','X'),'\\Ph':mc('blue',String.raw`\phi`),
  '\\Yy':mc('green','y'),'\\Yv':mc('green',String.raw`\mathbf{y}`),'\\Yh':mc('green',String.raw`\hat{y}`),
  '\\Ff':mc('green','f'),'\\Fh':mc('green',String.raw`\hat{f}`),'\\Fb':mc('green',String.raw`\bar{f}`),
  '\\cL':mc('pink',String.raw`\mathcal{L}`),'\\cl':mc('pink',String.raw`\ell`),
  '\\Et':mc('orange',String.raw`\eta`),'\\Kk':mc('orange','k'),'\\Bw':mc('orange',String.raw`\sigma`),'\\Rl':mc('orange',String.raw`\lambda`),
  '\\Eps':mc('purple',String.raw`\varepsilon`),'\\Sg':mc('purple',String.raw`\sigma`),
  '\\Gr':mc('teal',String.raw`\nabla`),
  '\\Al':mc('yellow',String.raw`\alpha`),'\\Sl':mc('pink',String.raw`\xi`),'\\Ka':mc('blue',String.raw`\kappa`),'\\Gk':mc('orange',String.raw`\gamma`)
});}

/* miniature: il diagramma più caratteristico di ogni lezione (viewBox 120x80, stesso rapporto 3:2 del sito) */
(function(){
/* miniature: il diagramma più caratteristico di ogni lezione */
const dots=(pts,c,r)=>pts.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="${r||2.6}" fill="${c}"/>`).join('');
const T={
 0:`<path d="M10 22L110 40" stroke="#FFFF00" stroke-width="1.2" opacity=".3" fill="none"/><path d="M10 40L110 38" stroke="#FFFF00" stroke-width="1.2" opacity=".55" fill="none"/><path d="M10 62L110 20" stroke="#FFFF00" stroke-width="2.4" fill="none"/>`+dots([[18,60],[30,50],[42,52],[55,40],[66,42],[78,30],[90,31],[102,22]],'#fff')+`<path d="M92 58a9 9 0 1 1 9 9" fill="none" stroke="#DC75CD" stroke-width="1.8"/><path d="M101 71l-4 -4.5 6 -1z" fill="#DC75CD"/>`,
 1:`<path d="M8 66C36 58 44 40 62 38S92 22 112 14" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="4 3" opacity=".7"/>`+dots([[18,20],[30,32],[40,16],[52,26],[26,46],[66,14],[80,12],[44,36]],'#FF862F')+dots([[70,52],[84,44],[96,56],[58,64],[102,36],[80,66],[44,68],[108,62]],'#58C4DD')+`<circle cx="60" cy="42" r="5" fill="#fff" stroke="#000" stroke-width="1.5"/>`,
 2:[10,19,28,37].map(r=>`<ellipse cx="60" cy="50" rx="${r}" ry="${r*1.9}" fill="none" stroke="#58C4DD" stroke-width="1" opacity=".55"/>`).join('')+`<path d="M96 8L44 20L72 30L51 38L66 44L57 48L61 50" fill="none" stroke="#fff" stroke-width="1.2"/>`+dots([[96,8],[44,20],[72,30],[51,38],[66,44],[57,48],[61,50]],'#FFFF00',2.4),
 3:[[18,64,58],[32,44,52],[46,56,46],[60,30,40],[74,44,34],[88,18,28],[102,30,22]].map(q=>`<path d="M${q[0]} ${q[1]}V${q[2]}" stroke="#DC75CD" stroke-width="1.4"/>`).join('')+`<path d="M8 62L112 18" stroke="#FFFF00" stroke-width="2.2"/>`+dots([[18,64],[32,44],[46,56],[60,30],[74,44],[88,18],[102,30]],'#83C167',3),
 5:[0,1,2,3,4].map(j=>[0,1,2,3,4].map(i=>`<rect x="${16+i*18}" y="${10+j*13}" width="15" height="9" fill="${i===j?'#FF862F':'#8c8c8c'}"/>`).join('')).join(''),
 6:[10,18,26].map(r=>`<ellipse cx="78" cy="28" rx="${r*1.5}" ry="${r*.75}" transform="rotate(-35 78 28)" fill="none" stroke="#DC75CD" stroke-width="1.2"/>`).join('')+`<path d="M40 30L64 54L40 78L16 54Z" fill="rgba(88,196,221,.25)" stroke="#58C4DD" stroke-width="1.5"/><circle cx="40" cy="30" r="4" fill="#FFFF00"/><path d="M4 54H116M40 6V78" stroke="#555"/>`,
 7:`<path d="M8 66C50 66 54 14 112 14" fill="none" stroke="#FFFF00" stroke-width="2.2"/>`+dots([[14,66],[24,66],[33,66],[42,66],[52,66],[66,66]],'#58C4DD')+dots([[58,14],[70,14],[80,14],[90,14],[100,14],[108,14]],'#FF862F'),
 8:`<path d="M22 78L98 2" stroke="#FFFF00" stroke-width="2.2"/><path d="M6 66L72 0M48 80L114 14" stroke="#fff" stroke-dasharray="4 3" opacity=".7"/>`+dots([[20,22],[30,34],[14,40],[40,12],[26,10]],'#FF862F',3.2)+dots([[84,58],[98,48],[92,70],[106,64],[76,72]],'#58C4DD',3.2),
 9:dots([[60,40],[54,36],[66,44],[58,46],[64,34]],'#FF862F',3)+dots([[60,10],[84,18],[94,40],[84,62],[60,70],[36,62],[26,40],[36,18]],'#58C4DD',3)+`<circle cx="60" cy="40" r="17" fill="none" stroke="#FFFF00" stroke-width="2"/>`,
 4:`<path d="M14 10V68H110" fill="none" stroke="#555"/><path d="M18 18C34 54 60 62 108 64" fill="none" stroke="#58C4DD" stroke-width="1.6"/><path d="M18 64C60 62 88 50 108 14" fill="none" stroke="#5CD0B3" stroke-width="1.6"/><path d="M18 14C36 46 62 50 74 46S98 30 108 8" fill="none" stroke="#FC6255" stroke-width="2.4"/>`
};
Object.assign(T,{
 10:`<path d="M60 14L30 40M60 14L90 40M30 40L16 66M30 40L44 66M90 40L76 66M90 40L104 66" stroke="#8c8c8c" stroke-width="1.5" fill="none"/>`+[[60,14,'#fff'],[30,40,'#fff'],[90,40,'#fff']].map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="6" fill="#000" stroke="${q[2]}" stroke-width="1.6"/>`).join('')+[[16,66,'#FF862F'],[44,66,'#58C4DD'],[76,66,'#58C4DD'],[104,66,'#FF862F']].map(q=>`<rect x="${q[0]-6}" y="${q[1]-6}" width="12" height="12" fill="${q[2]}"/>`).join(''),
 11:`<path d="M12 16L52 38M12 40H52M12 64L52 42" stroke="#58C4DD" stroke-width="2"/><circle cx="64" cy="40" r="14" fill="#000" stroke="#FFFF00" stroke-width="2.4"/><path d="M57 46H63V34H71" stroke="#FFFF00" stroke-width="1.8" fill="none"/><path d="M78 40H108M100 34l8 6-8 6" stroke="#83C167" stroke-width="2" fill="none"/>`,
 12:[[20,[18,40,62]],[60,[10,30,50,70]],[100,[28,52]]].map((L,k,A)=>k<2?L[1].map(y=>A[k+1][1].map(y2=>`<path d="M${L[0]} ${y}L${A[k+1][0]} ${y2}" stroke="#666" stroke-width=".9"/>`).join('')).join(''):'').join('')+[[20,[18,40,62],'#58C4DD'],[60,[10,30,50,70],'#FFFF00'],[100,[28,52],'#83C167']].map(L=>L[1].map(y=>`<circle cx="${L[0]}" cy="${y}" r="5.5" fill="${L[2]}"/>`).join('')).join(''),
 13:`<path d="M10 70H110" stroke="#555"/><rect x="18" y="52" width="22" height="18" fill="#58C4DD"/><rect x="49" y="14" width="22" height="56" fill="#FFFF00"/><rect x="80" y="60" width="22" height="10" fill="#FF862F"/>`,
 14:dots([[22,60],[30,50],[36,58],[44,44],[50,50],[56,38],[62,44],[70,30],[76,38],[84,24],[92,30],[98,18],[40,54],[66,36]],'#58C4DD',2.6)+`<path d="M10 70L110 10" stroke="#FFFF00" stroke-width="2.2"/><path d="M52 30L68 56" stroke="#DC75CD" stroke-width="1.6"/>`,
 15:dots([[20,20],[28,28],[16,32],[30,16],[24,36]],'#58C4DD',3)+dots([[84,22],[94,30],[100,18],[90,14],[104,28]],'#FF862F',3)+dots([[54,58],[62,66],[48,68],[66,56],[58,70]],'#83C167',3)+[[24,26],[94,22],[58,64]].map(q=>`<path d="M${q[0]-5} ${q[1]-5}l10 10m0-10l-10 10" stroke="#fff" stroke-width="2"/>`).join(''),
 16:`<path d="M12 10L50 30V50L12 70Z" fill="rgba(88,196,221,.3)" stroke="#58C4DD" stroke-width="1.6"/><path d="M108 10L70 30V50L108 70Z" fill="rgba(131,193,103,.3)" stroke="#83C167" stroke-width="1.6"/><rect x="54" y="30" width="12" height="20" fill="#FFFF00"/>`,
 17:`<path d="M10 72H110" stroke="#555"/>`+[[28,18,56,34,'#58C4DD'],[60,8,70,48,'#FFFF00'],[92,30,44,38,'#FF862F']].map(q=>`<path d="M${q[0]} ${q[1]}V${q[2]}M${q[0]-6} ${q[1]}h12M${q[0]-6} ${q[2]}h12" stroke="${q[4]}" stroke-width="2"/><circle cx="${q[0]}" cy="${q[3]}" r="4" fill="${q[4]}"/>`).join(''),
 18:[0,1,2,3].map(i=>[0,1,2].map(j=>`<rect x="${14+i*24}" y="${6+j*24}" width="21" height="21" fill="${i===3&&j===0?'#83C167':i===3&&j===1?'#FC6255':i===1&&j===1?'#444':i===0&&j===0?'#3f5a34':'#1c1c1c'}" stroke="#555"/>`).join('')).join('')+`<path d="M72.5 64V16.5H88" stroke="#FFFF00" stroke-width="2" fill="none"/><circle cx="72.5" cy="64" r="5" fill="#FFFF00"/>`
});
for(const k in T)THUMB[k]='<svg viewBox="0 0 120 80" aria-hidden="true">'+T[k]+'</svg>';
})();

/* Machine Learning: motore delle figure (grafici, player, costruzione delle formule) e adattamento al sito */

(function(){
'use strict';
/* ---------- KaTeX ---------- */
const col=(n,s)=>String.raw`\htmlClass{k-${n}}{${s}}`;
const MAC={
  '\\Ws':col('yellow','w'),'\\Wv':col('yellow',String.raw`\mathbf{w}`),'\\Mm':col('yellow','m'),'\\Bi':col('yellow','b'),'\\Be':col('yellow',String.raw`\beta`),
  '\\Xs':col('blue','x'),'\\Xv':col('blue',String.raw`\mathbf{x}`),'\\Xm':col('blue','X'),'\\Ph':col('blue',String.raw`\phi`),
  '\\Yy':col('green','y'),'\\Yv':col('green',String.raw`\mathbf{y}`),'\\Yh':col('green',String.raw`\hat{y}`),
  '\\Ff':col('green','f'),'\\Fh':col('green',String.raw`\hat{f}`),'\\Fb':col('green',String.raw`\bar{f}`),
  '\\cL':col('pink',String.raw`\mathcal{L}`),'\\cl':col('pink',String.raw`\ell`),
  '\\Et':col('orange',String.raw`\eta`),'\\Kk':col('orange','k'),'\\Bw':col('orange',String.raw`\sigma`),'\\Rl':col('orange',String.raw`\lambda`),
  '\\Eps':col('purple',String.raw`\varepsilon`),'\\Sg':col('purple',String.raw`\sigma`),
  '\\Gr':col('teal',String.raw`\nabla`),
  '\\Al':col('yellow',String.raw`\alpha`),'\\Sl':col('pink',String.raw`\xi`),'\\Ka':col('blue',String.raw`\kappa`),'\\Gk':col('orange',String.raw`\gamma`)
};
const KOPT={throwOnError:false,macros:MAC,trust:true,strict:'ignore'};
const K=s=>{try{return window.katex?katex.renderToString(s,Object.assign({},KOPT)):s}catch(e){return s}};

/* ---------- helpers ---------- */
const NS='http://www.w3.org/2000/svg';
function S(tag,at,par){const e=document.createElementNS(NS,tag);if(at)for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
function H(tag,at,par,html){const e=document.createElement(tag);if(at)for(const k in at){if(k==='class')e.className=at[k];else e.setAttribute(k,at[k])}if(html!=null)e.innerHTML=html;if(par)par.appendChild(e);return e}
const C={blue:'#58C4DD',yellow:'#FFFF00',pink:'#DC75CD',green:'#83C167',orange:'#FF862F',teal:'#5CD0B3',purple:'#CAA3E8',red:'#FC6255',gray:'#8c8c8c',lg:'#c9c9c9',white:'#fff'};
const nf=(x,d=2)=>{if(!isFinite(x))return '∞';let s=x.toFixed(d);if(parseFloat(s)===0)s=(0).toFixed(d);return s.replace('.',',').replace('-','−')};
const kn=(x,d=2)=>{let s=x.toFixed(d);if(parseFloat(s)===0)s=(0).toFixed(d);return s.replace('.','{,}')};
const big=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function rng(seed){let a=seed>>>0;const r=()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  r.n=()=>{let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r())};return r}

let uid=0;
function Plot(host,o){
  const W=o.W||600,Hh=o.H||400,m=o.m||[42,12,12,30];
  const svg=S('svg',{viewBox:`0 0 ${W} ${Hh}`,class:'plot',role:'img','aria-label':o.label||'Figura'},host);
  svg.style.maxWidth=(o.maxw||W)+'px';
  const id='cp'+(uid++),ax=m[0],ay=m[1],aw=W-m[0]-m[2],ah=Hh-m[1]-m[3];
  const defs=S('defs',null,svg),cp=S('clipPath',{id},defs);S('rect',{x:ax,y:ay,width:aw,height:ah},cp);
  const p={svg,W,H:Hh,ax,ay,aw,ah,xr:o.xr.slice(),yr:o.yr.slice()};
  p.bg=S('g',{'clip-path':`url(#${id})`},svg);p.g=S('g',{'clip-path':`url(#${id})`},svg);p.axg=S('g',null,svg);p.top=S('g',null,svg);
  p.sx=x=>ax+(x-p.xr[0])/(p.xr[1]-p.xr[0])*aw;
  p.sy=y=>ay+ah-(y-p.yr[0])/(p.yr[1]-p.yr[0])*ah;
  p.ix=px=>p.xr[0]+(px-ax)/aw*(p.xr[1]-p.xr[0]);
  p.iy=py=>p.yr[0]+(ay+ah-py)/ah*(p.yr[1]-p.yr[0]);
  p.axes=(xt,yt,xl,yl,fx,fy)=>{
    p.axg.textContent='';
    S('line',{x1:ax,y1:ay+ah,x2:ax+aw,y2:ay+ah,stroke:'#555','stroke-width':1},p.axg);
    S('line',{x1:ax,y1:ay,x2:ax,y2:ay+ah,stroke:'#555','stroke-width':1},p.axg);
    (xt||[]).forEach(v=>{const X=p.sx(v);S('line',{x1:X,y1:ay+ah,x2:X,y2:ay+ah+4,stroke:'#555'},p.axg);
      S('text',{x:X,y:ay+ah+18,'text-anchor':'middle'},p.axg).textContent=fx?fx(v):String(v).replace('.',',').replace('-','−')});
    (yt||[]).forEach(v=>{const Y=p.sy(v);S('line',{x1:ax-4,y1:Y,x2:ax,y2:Y,stroke:'#555'},p.axg);
      S('text',{x:ax-8,y:Y+4.5,'text-anchor':'end'},p.axg).textContent=fy?fy(v):String(v).replace('.',',').replace('-','−')});
    if(xl)S('text',{x:ax+aw/2,y:Hh-6,'text-anchor':'middle',class:'tag'},p.axg).textContent=xl;
    if(yl)S('text',{x:ax+6,y:ay+12,'text-anchor':'start',class:'tag'},p.axg).textContent=yl;
  };
  p.curve=(fn,x0,x1,n)=>{n=n||240;let d='',pen=false;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;let y=fn(x);
      if(!isFinite(y)){pen=false;continue}const Y=clamp(p.sy(y),-2000,3000);d+=(pen?'L':'M')+p.sx(x).toFixed(1)+' '+Y.toFixed(1);pen=true}return d};
  p.poly=pts=>pts.map((q,i)=>(i?'L':'M')+p.sx(q[0]).toFixed(1)+' '+clamp(p.sy(q[1]),-2000,3000).toFixed(1)).join('');
  p.image=(cv)=>{if(!p.img)p.img=S('image',{x:ax,y:ay,width:aw,height:ah,preserveAspectRatio:'none'},p.bg);p.img.setAttribute('href',cv.toDataURL())};
  return p;
}
function drag(p,target,cb,start){target.style.touchAction='none';
  target.addEventListener('pointerdown',e=>{
    const pos=ev=>{const r=p.svg.getBoundingClientRect();return [p.ix((ev.clientX-r.left)/r.width*p.W),p.iy((ev.clientY-r.top)/r.height*p.H)]};
    const s=pos(e);const tok=start?start(s[0],s[1]):null;if(tok===false)return;
    try{target.setPointerCapture(e.pointerId)}catch(_){}
    const mv=ev=>{const q=pos(ev);cb(q[0],q[1],tok)};
    const up=()=>{target.removeEventListener('pointermove',mv);target.removeEventListener('pointerup',up);target.removeEventListener('pointercancel',up)};
    target.addEventListener('pointermove',mv);target.addEventListener('pointerup',up);target.addEventListener('pointercancel',up);
    mv(e);e.preventDefault();
  });
}
function slider(host,label,min,max,step,val,fmt,cb){
  const l=H('label',{class:'sl'},host);H('span',null,l,label);
  const inp=H('input',{type:'range',min,max,step,value:val},l);const v=H('span',null,l,fmt(+val));
  inp.addEventListener('input',()=>{v.innerHTML=fmt(+inp.value);cb(+inp.value)});
  return {el:l,input:inp,set(x){inp.value=x;v.innerHTML=fmt(+inp.value)},get:()=>+inp.value};
}
function buttons(host,items,sel,cb){
  const r=H('div',{class:'row',role:'group'},host);const bs=items.map((t,i)=>{const b=H('button',{type:'button','aria-pressed':i===sel?'true':'false'},r,t);
    b.addEventListener('click',()=>{bs.forEach((x,j)=>x.setAttribute('aria-pressed',j===i?'true':'false'));cb(i)});return b});
  return {el:r,bs,set(i){bs.forEach((x,j)=>x.setAttribute('aria-pressed',j===i?'true':'false'))}};
}
function btn(host,text,cb){const b=H('button',{type:'button'},host,text);b.addEventListener('click',()=>cb(b));return b}
/* controlli in stile video: play/pausa, tempo, barra trascinabile */
function player(host,N,fps,onFrame){
  const IC={play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor"/></svg>'};
  const bar=H('div',{class:'player'},host),b=H('button',{type:'button','aria-label':'Riproduci'},bar,IC.play),tm=H('span',{class:'tm'},bar);
  const sc=H('input',{type:'range',min:0,max:N,step:0.01,value:0,'aria-label':'Posizione nell\'animazione'},bar);
  let pos=0,raf=null,last=0;const f=x=>{const s=Math.floor(x/fps+1e-6);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  function show(){sc.value=pos;tm.textContent=f(pos)+' / '+f(N);onFrame(pos)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}b.innerHTML=IC.play;b.setAttribute('aria-label','Riproduci')}
  function tick(ts){if(!last)last=ts;pos=Math.min(N,pos+Math.min(0.1,(ts-last)/1000)*fps);last=ts;show();if(pos>=N){raf=null;stop()}else raf=requestAnimationFrame(tick)}
  function play(){if(pos>=N)pos=0;last=0;b.innerHTML=IC.pause;b.setAttribute('aria-label','Pausa');raf=requestAnimationFrame(tick)}
  b.addEventListener('click',()=>raf?stop():play());
  sc.addEventListener('input',()=>{stop();pos=+sc.value;show()});
  show();return {stop,play,seek(k){stop();pos=k;show()}};
}
const out=host=>H('div',{class:'res','aria-live':'polite'},host);
const legend=(host,items)=>H('div',{class:'mini'},host,items.map(a=>`<span><i class="${a[2]||''}" style="background:${a[0]}${a[3]?';'+a[3]:''}"></i>${a[1]}</span>`).join(''));

/* ---------- numerica ---------- */
function lstsq(Phi,y){const N=Phi.length,k=Phi[0].length,Q=[],R=[];
  for(let j=0;j<k;j++){R.push(new Float64Array(k));const v=new Float64Array(N);for(let i=0;i<N;i++)v[i]=Phi[i][j];
    for(let pass=0;pass<2;pass++)for(let q=0;q<j;q++){let d=0;for(let i=0;i<N;i++)d+=Q[q][i]*v[i];R[q][j]+=d;for(let i=0;i<N;i++)v[i]-=d*Q[q][i]}
    let nr=0;for(let i=0;i<N;i++)nr+=v[i]*v[i];nr=Math.sqrt(nr);R[j][j]=nr;if(nr>1e-9)for(let i=0;i<N;i++)v[i]/=nr;else v.fill(0);Q.push(v)}
  const w=new Float64Array(k);for(let j=k-1;j>=0;j--){let s=0;for(let i=0;i<N;i++)s+=Q[j][i]*y[i];for(let q=j+1;q<k;q++)s-=R[j][q]*w[q];w[j]=R[j][j]>1e-9?s/R[j][j]:0}
  return w}
function cheb(x,deg,a,b){const t=(2*x-a-b)/(b-a),r=[1];if(deg>=1)r.push(t);for(let j=2;j<=deg;j++)r.push(2*t*r[j-1]-r[j-2]);return r}
function polyFit(xs,ys,deg,a,b){const w=lstsq(xs.map(x=>cheb(x,deg,a,b)),ys);return x=>{const c=cheb(x,deg,a,b);let s=0;for(let j=0;j<=deg;j++)s+=w[j]*c[j];return s}}
const mse=(fn,xs,ys)=>{let s=0;for(let i=0;i<xs.length;i++){const e=ys[i]-fn(xs[i]);s+=e*e}return s/xs.length};

const FIG={};
window.__ML={FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,cheb,polyFit,mse,KOPT,MAC};
})();
(function(){
'use strict';
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,polyFit,mse}=window.__ML;

/* ===== Lezione 0 ===== */
const PART={1:['#58C4DD','Supervised learning e valutazione dei modelli'],2:['#83C167','Unsupervised learning'],3:['#FF862F','Reinforcement learning'],0:['#8c8c8c','Sessione di programmazione']};
const LESS=[
 {n:'1',t:'Introduzione',p:1,go:1,f:'01-Introduction',d:'Che cos\'è il machine learning, i tre tipi di apprendimento, come si misura l\'errore, train/validation/test e un primo classificatore: k-NN.'},
 {n:'2',t:'Ottimizzazione',p:1,go:2,f:'02-optimization',d:'Funzioni di costo, minimi e convessità, gradient descent, step size, SGD, subgradienti e vincoli.'},
 {n:'3',t:'Minimi quadrati (OLS)',p:1,go:3,f:'03-OLS',d:'La retta migliore: formula chiusa, equazioni normali, proiezione ortogonale e massima verosimiglianza.'},
 {n:'4',t:'Bias e varianza',p:1,go:4,f:'04-bias variance',d:'Basis functions, underfitting e overfitting, decomposizione bias-varianza.'},
 {n:'5',t:'Model selection',p:1,go:5,f:'05-model selection',d:'Rischio vero ed empirico, hold-out, disuguaglianza di Hoeffding, k-fold cross-validation.'},
 {n:'6',t:'Regolarizzazione',p:1,go:6,f:'06-regularization & coding session',d:'Penalizzare i pesi grandi: ridge, lasso, e la loro lettura geometrica.'},
 {n:'7',t:'Regressione logistica',p:1,go:7,f:'07-Logistic regression',d:'Classificatori lineari, sigmoide, massima verosimiglianza, softmax, matrice di confusione e curva ROC.'},
 {n:'8',t:'SVM',p:1,go:8,f:'8-SVM',d:'Il separatore con il margine più largo, margine morbido e hinge loss.'},
 {n:'9',t:'Kernel methods',p:1,go:9,f:'9-Kernel methods',d:'Forma duale, vettori di supporto, kernel trick, kernel polinomiali e RBF.'},
 {n:'·',t:'Coding session 2',p:0,f:'Coding session 2'},
 {n:'10',t:'Entropia e alberi di decisione',p:1,go:10,f:'entropy_decision trees',d:'Informazione ed entropia, information gain, come cresce un albero, quando fermarlo, random forest.'},
 {n:'11',t:'k-NN e Perceptron',p:1,go:11,f:'Supervised learning intro, KNN & Perceptron',d:'Classificare con i vicini, il neurone artificiale, la regola di apprendimento del perceptron e la sua convergenza.'},
 {n:'12',t:'MLP e backpropagation',p:1,go:12,f:'MLP_backprop',d:'Il limite dello XOR, reti a più strati, funzioni di attivazione, backpropagation, SGD a mini-batch, early stopping.'},
 {n:'13',t:'Softmax',p:1,go:13,f:'softmax_lecture_notes',d:'Lo strato di uscita per molte classi, la cross-entropy e le regole di aggiornamento.'},
 {n:'14',t:'PCA',p:2,go:14,f:'Lecture_PCA',d:'Ridurre le dimensioni tenendo la varianza: direzioni principali, autovettori della covarianza, ricostruzione.'},
 {n:'15',t:'Clustering',p:2,go:15,f:'Lecture_Clustering',d:'Distanze, clustering gerarchico e dendrogrammi, k-means e i suoi limiti.'},
 {n:'·',t:'Coding session 3',p:0,f:'coding_session_3.ipynb.zip'},
 {n:'16',t:'Autoencoder e VAE',p:2,go:16,f:'AE_VAE, autoencoders_vae_lecture_notes',d:'Comprimere e ricostruire, il collo di bottiglia, rilevare anomalie, e generare dati nuovi con i VAE.'},
 {n:'17',t:'Bandits',p:3,go:17,f:'22-bandits',d:'Esplorare o sfruttare: regret, explore-then-commit, ε-greedy, UCB, Hedge ed EXP3.'},
 {n:'18',t:'Introduzione al RL',p:3,go:18,f:'23-rl',d:'Processi decisionali di Markov, funzioni valore, equazioni di Bellman, Q-learning.'}
];

window.__ML.LESS=LESS;window.__ML.PART=PART;

/* il ciclo di apprendimento in funzione */
FIG.loop=function(st){
  const r=rng(31),tr=[],te=[];for(let i=0;i<14;i++){const x=(i+r())/14;tr.push([x,0.55+1.5*x+0.22*r.n()])}for(let i=0;i<10;i++){const x=r();te.push([x,0.55+1.5*x+0.22*r.n()])}
  const eta=0.12,TMAX=60;
  const cost=(P,m,b)=>P.reduce((s,d)=>s+(m*(d[0]-.5)+b-d[1])**2,0)/P.length;
  const ST=[];{let m=-1.6,b=1.9;for(let t=0;t<=TMAX;t++){ST.push({m,b,tr:cost(tr,m,b),te:cost(te,m,b)});let gm=0,gb=0;tr.forEach(d=>{const e=m*(d[0]-.5)+b-d[1];gm+=2*e*(d[0]-.5);gb+=2*e});m-=eta*gm/tr.length*6;b-=eta*gb/tr.length}}
  legend(st,[['#fff','training','dot'],['transparent','test','dot','box-shadow:inset 0 0 0 1.5px #c9c9c9'],[C.yellow,'modello'],[C.pink,'errori'],[C.lg,'costo di training'],[C.red,'costo di test']]);
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:346,m:[34,10,10,42],xr:[0,1],yr:[-0.2,2.8],label:'Dati e retta del modello'});p.axes([0,0.5,1],[0,1,2],'input','output');
  const q=Plot(duo,{W:420,H:346,m:[40,10,12,42],xr:[0,TMAX],yr:[0,1.6],label:'Costo di training e di test a ogni giro'});q.axes([0,20,40,60],[0,0.5,1,1.5],'giri','costo');
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);
  function draw(tf){g.textContent='';gq.textContent='';const t=Math.min(TMAX,Math.floor(tf)),fr=tf-t,nx=ST[Math.min(TMAX,t+1)],L=(a,b)=>a+(b-a)*fr,s={m:L(ST[t].m,nx.m),b:L(ST[t].b,nx.b),tr:L(ST[t].tr,nx.tr),te:L(ST[t].te,nx.te)},f=x=>s.m*(x-.5)+s.b;
    tr.forEach(d=>S('line',{x1:p.sx(d[0]),x2:p.sx(d[0]),y1:p.sy(d[1]),y2:p.sy(f(d[0])),stroke:C.pink,'stroke-width':1.6},g));
    S('line',{x1:p.sx(0),y1:p.sy(f(0)),x2:p.sx(1),y2:p.sy(f(1)),stroke:C.yellow,'stroke-width':2.5},g);
    te.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:4,fill:'none',stroke:'#c9c9c9','stroke-width':1.5},g));
    tr.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:4.2,fill:'#fff'},g));
    const h=ST.slice(0,t+1).concat([s]),hx=i=>i<=t?i:tf;
    S('path',{d:q.poly(h.map((v,i)=>[hx(i),v.tr])),fill:'none',stroke:C.lg,'stroke-width':2},gq);S('path',{d:q.poly(h.map((v,i)=>[hx(i),v.te])),fill:'none',stroke:C.red,'stroke-width':2},gq);
    S('circle',{cx:q.sx(tf),cy:q.sy(s.tr),r:4.5,fill:C.lg},gq);S('circle',{cx:q.sx(tf),cy:q.sy(s.te),r:4.5,fill:C.red},gq);
    const d0=t?ST[t-1].tr-ST[t].tr:0;
    res.innerHTML=(t===0?'Giro 0: la retta è quella di partenza, scelta male apposta.':`Giro ${t}: la correzione ha abbassato il costo di ${nf(d0,4)}.`+(d0<0.0005?' <span class="ok">Ormai non c\'è quasi più niente da correggere.</span>':''))+
      `<br>Costo di training ${nf(ST[t].tr,3)} · costo di test <span style="color:${C.red}">${nf(ST[t].te,3)}</span> · pendenza ${nf(ST[t].m,2)}`}
  player(st,TMAX,4,draw);
};

/* ===== Lezione 1 ===== */
FIG.tradml=function(st){
  const r=rng(9),P=[];for(let i=0;i<9;i++)P.push([clamp(3.4+1.5*r.n(),0.4,9.6),0]);for(let i=0;i<9;i++)P.push([clamp(6.6+1.5*r.n(),0.4,9.6),1]);
  let mode=1,s=2.5;const CC=[C.orange,C.blue];
  buttons(st,['Programmazione tradizionale','Machine learning'],1,i=>{mode=i;draw()});
  const p=Plot(st,{W:600,H:210,m:[14,10,14,30],xr:[0,10],yr:[0,3],label:'Esempi etichettati lungo un asse e soglia della regola'});
  p.axes([0,2,4,6,8,10],null);
  const g=S('g',null,p.g),hd=S('circle',{r:9,fill:C.yellow,stroke:'#000','stroke-width':2},p.top),res=out(st);
  const errs=t=>P.reduce((n,q)=>n+((q[0]>t?1:0)!==q[1]?1:0),0);
  function learn(){const xs=P.map(q=>q[0]).sort((a,b)=>a-b);let best=0,be=1e9;for(let i=0;i<=xs.length;i++){const t=i===0?xs[0]-0.3:i===xs.length?xs[i-1]+0.3:(xs[i-1]+xs[i])/2,e=errs(t);if(e<be){be=e;best=t}}return best}
  function draw(){if(mode===1)s=learn();g.textContent='';
    S('rect',{x:p.sx(0),y:p.ay,width:p.sx(s)-p.sx(0),height:p.ah,fill:'rgba(255,134,47,.16)'},g);S('rect',{x:p.sx(s),y:p.ay,width:p.sx(10)-p.sx(s),height:p.ah,fill:'rgba(88,196,221,.16)'},g);
    S('line',{x1:p.sx(s),x2:p.sx(s),y1:p.ay,y2:p.ay+p.ah,stroke:C.yellow,'stroke-width':2.5},g);
    P.forEach(q=>{const wrong=(q[0]>s?1:0)!==q[1];S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]?1:2),r:6.5,fill:CC[q[1]],stroke:wrong?'#fff':'#000','stroke-width':wrong?2.5:1,class:mode===1?'hd':''},g)});
    hd.setAttribute('cx',p.sx(s));hd.setAttribute('cy',p.ay+p.ah);hd.setAttribute('display',mode===0?'':'none');
    const e=errs(s),rule=`se la misura supera <b style="color:${C.yellow}">${nf(s,1)}</b> allora blu, altrimenti arancione`;
    res.innerHTML=(mode===0?`Regola scritta da te: ${rule}.`:`Regola ricavata dai 18 esempi: ${rule}.`)+`<br>Esempi sbagliati (bordo bianco): ${e} su 18.`+(mode===0?'':' Trascina un esempio.')}
  drag(p,p.svg,(x,y,i)=>{if(mode===0)s=Math.round(clamp(x,0.2,9.8)*10)/10;else P[i][0]=Math.round(clamp(x,0.3,9.7)*10)/10;draw()},(x,y)=>{if(mode===0)return -1;let bi=0,bd=1e9;P.forEach((q,i)=>{const d=((q[0]-x)*p.aw/10)**2+(((q[1]?1:2)-y)*p.ah/3)**2;if(d<bd){bd=d;bi=i}});return bi});
  draw();
};
FIG.encode=function(st){
  let cat=2,mode=0;const names=['a','b','c'];
  buttons(st,names.map(n=>K(`x=\\text{${n}}`)),cat,i=>{cat=i;draw()});
  buttons(st,['One-hot','Dummy'],0,i=>{mode=i;draw()});
  const v=H('div',{class:'vec'},st),res=out(st);
  function draw(){const vec=mode===0?[0,1,2].map(j=>j===cat?1:0):[0,1].map(j=>j===cat?1:0);
    v.innerHTML=K(`o(x)=(${vec.join(',\\,')})`);
    res.innerHTML=mode===0?`Tre posizioni, una per categoria: vale 1 quella di «${names[cat]}». La somma delle tre è sempre 1.`
      :`Due posizioni, per «a» e «b»; «c» è la categoria di riferimento`+(cat===2?' e diventa il vettore di soli zeri.':`. Qui vale 1 la posizione di «${names[cat]}».`)}
  draw();
};

/* ---- k-NN ---- */
const KNN=(function(){
  const r=rng(11),XR=[-3,3],YR=[-2.15,2.15];
  const cen=[[[-1.5,0.5],[-0.3,1.25],[1.0,1.3]],[[0.3,-0.35],[1.6,0.1],[-0.9,-1.2]]];
  function draw(n){const P=[];for(let c=0;c<2;c++)for(let i=0;i<n;i++){let x,y;do{const m=cen[c][Math.floor(r()*3)];x=m[0]+0.62*r.n();y=m[1]+0.62*r.n()}while(x<XR[0]+.1||x>XR[1]-.1||y<YR[0]+.1||y>YR[1]-.1);P.push([x,y,c])}return P}
  const train=draw(100),test=draw(250);
  function order(x,y){const d=train.map((t,i)=>[(t[0]-x)**2+(t[1]-y)**2,i]);d.sort((a,b)=>a[0]-b[0]);return d.map(q=>q[1])}
  function cum(x,y){const o=order(x,y),c=new Uint8Array(o.length);let s=0;for(let i=0;i<o.length;i++){s+=train[o[i]][2];c[i]=s}return c}
  const KS=[1,3,5,7,9,11,15,21,31,45,65,95,135,199];
  let errs=null;
  function errors(){if(errs)return errs;const f=(set)=>{const cs=set.map(q=>cum(q[0],q[1]));return KS.map(k=>{let e=0;set.forEach((q,i)=>{const pred=cs[i][k-1]*2>k?1:0;if(pred!==q[2])e++});return e/set.length})};
    errs={tr:f(train),te:f(test)};return errs}
  let grid=null;const NX=120,NY=86;
  function regions(){if(grid)return grid;grid=[];for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const x=XR[0]+(i+.5)/NX*(XR[1]-XR[0]),y=YR[1]-(j+.5)/NY*(YR[1]-YR[0]);grid.push(cum(x,y))}return grid}
  return {train,test,order,KS,errors,regions,XR,YR,NX,NY};
})();
window.__ML.KNN=KNN;
FIG.knn=function(st,o){
  const CC=[C.orange,C.blue],NM=['arancione','blu'];
  let ki=Math.max(0,KNN.KS.indexOf(o.k||1)),tp=[-0.35,0.25];
  let sl=null;
  if(o.regions)sl=slider(st,K('\\Kk')+' (numero di vicini)',0,KNN.KS.length-1,1,ki,v=>KNN.KS[v],v=>{ki=v;redraw(true)});
  const p=Plot(st,{W:600,H:430,m:[0,0,0,0],xr:KNN.XR,yr:KNN.YR,label:'Punti arancioni e blu nel piano con un punto bianco da classificare'});
  S('rect',{x:.5,y:.5,width:599,height:429,fill:'none',stroke:'#333'},p.top);
  const gl=S('g',null,p.g),gp=S('g',null,p.g);
  const dots=KNN.train.map(t=>S('circle',{cx:p.sx(t[0]),cy:p.sy(t[1]),r:4.2,fill:CC[t[2]],stroke:'#000','stroke-width':1},gp));
  const me=S('circle',{r:9,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top);
  const res=out(st);
  let ep=null,mark=null;
  if(o.errors){
    legend(st,[[C.lg,'errore di training'],[C.red,'errore di test']]);
    ep=Plot(st,{W:600,H:230,m:[44,12,14,44],xr:[-0.5,KNN.KS.length-0.5],yr:[0,0.42],label:'Errore di training e di test al variare di k'});
    ep.axes(KNN.KS.map((_,i)=>i),[0,0.1,0.2,0.3,0.4],null,null,v=>KNN.KS[v]);S('text',{x:ep.ax+ep.aw,y:ep.ay+12,'text-anchor':'end',class:'tag'},ep.axg).textContent='frazione di errori';
    S('text',{x:ep.ax+ep.aw/2,y:ep.H-6,'text-anchor':'middle',class:'tag'},ep.axg).textContent='k';
    S('text',{x:ep.sx(0)+2,y:ep.H-6,'text-anchor':'start'},ep.axg).textContent='← overfitting';
    S('text',{x:ep.ax+ep.aw,y:ep.H-6,'text-anchor':'end'},ep.axg).textContent='underfitting →';
    const E=KNN.errors();
    [['tr',C.lg],['te',C.red]].forEach(a=>{S('path',{d:ep.poly(E[a[0]].map((v,i)=>[i,v])),fill:'none',stroke:a[1],'stroke-width':2},ep.g);
      E[a[0]].forEach((v,i)=>S('circle',{cx:ep.sx(i),cy:ep.sy(v),r:3,fill:a[1]},ep.top))});
    mark=S('line',{y1:ep.ay,y2:ep.ay+ep.ah,stroke:'#fff','stroke-dasharray':'4 4'},ep.top);
  }
  function redraw(full){
    const k=KNN.KS[ki];
    if(o.regions&&full){const G=KNN.regions(),cv=document.createElement('canvas');cv.width=KNN.NX;cv.height=KNN.NY;const c=cv.getContext('2d'),im=c.createImageData(KNN.NX,KNN.NY);
      for(let i=0;i<G.length;i++){const one=G[i][k-1]*2>k;im.data[4*i]=one?88:255;im.data[4*i+1]=one?196:134;im.data[4*i+2]=one?221:47;im.data[4*i+3]=52}
      c.putImageData(im,0,0);p.image(cv)}
    const ord=KNN.order(tp[0],tp[1]).slice(0,k);let n1=0;ord.forEach(i=>n1+=KNN.train[i][2]);const pred=n1*2>k?1:0;
    gl.textContent='';const show=ord.slice(0,25);
    show.forEach(i=>{const t=KNN.train[i];S('line',{x1:p.sx(tp[0]),y1:p.sy(tp[1]),x2:p.sx(t[0]),y2:p.sy(t[1]),stroke:'#fff','stroke-width':1,opacity:.7},gl)});
    if(k>25){const far=KNN.train[ord[k-1]],rad=Math.hypot(far[0]-tp[0],far[1]-tp[1])*p.aw/(p.xr[1]-p.xr[0]);S('circle',{cx:p.sx(tp[0]),cy:p.sy(tp[1]),r:rad,fill:'none',stroke:'#fff','stroke-dasharray':'4 4',opacity:.7},gl)}
    me.setAttribute('cx',p.sx(tp[0]));me.setAttribute('cy',p.sy(tp[1]));me.setAttribute('stroke',CC[pred]);me.setAttribute('stroke-width',4);
    let s=k===1?`Il punto di training più vicino è <b style="color:${CC[pred]}">${NM[pred]}</b>: il punto bianco viene classificato ${NM[pred]}.`
      :`Fra i ${k} più vicini: <span style="color:${C.orange}">${k-n1} arancioni</span>, <span style="color:${C.blue}">${n1} blu</span>. Vince la maggioranza: <b style="color:${CC[pred]}">${NM[pred]}</b>.`;
    if(o.errors){const E=KNN.errors();s+=`<br>Con ${K('\\Kk='+k)}: errore di training ${nf(E.tr[ki]*100,1)}%, errore di test <span style="color:${C.red}">${nf(E.te[ki]*100,1)}%</span>.`;
      mark.setAttribute('x1',ep.sx(ki));mark.setAttribute('x2',ep.sx(ki))}
    res.innerHTML=s;
  }
  drag(p,p.svg,(x,y)=>{tp=[clamp(x,KNN.XR[0]+.08,KNN.XR[1]-.08),clamp(y,KNN.YR[0]+.08,KNN.YR[1]-.08)];redraw(false)});
  redraw(true);
};

/* ---- flessibilità: train vs test ---- */
FIG.flex=function(st){
  const f=x=>Math.sin(2*Math.PI*x)+0.7*x,sd=0.38,r=rng(5);
  const N=30,xs=[],ys=[],xt=[],yt=[];
  for(let i=0;i<N;i++){const x=(i+0.15+0.7*r())/N;xs.push(x);ys.push(f(x)+sd*r.n())}
  for(let i=0;i<600;i++){const x=r();xt.push(x);yt.push(f(x)+sd*r.n())}
  const DMAX=14,fits=[],tr=[],te=[];
  for(let d=1;d<=DMAX;d++){const g=polyFit(xs,ys,d,0,1);fits.push(g);tr.push(mse(g,xs,ys));te.push(mse(g,xt,yt))}
  let d=1;
  const sl=slider(st,'Flessibilità (grado)',1,DMAX,1,d,v=>v,v=>{d=v;draw()});
  legend(st,[['#fff','vera '+K('\\Ff'),'','height:2px'],[C.yellow,'modello '+K('\\Fh')],[C.lg,'MSE di training'],[C.red,'MSE di test']]);
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:346,m:[34,10,10,42],xr:[0,1],yr:[-1.9,2.6],label:'Dati di training, funzione vera e modello adattato'});
  p.axes([0,0.5,1],[-1,0,1,2],'x','y');
  S('path',{d:p.curve(f,0,1),fill:'none',stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'5 4'},p.g);
  const fitp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g);
  xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:3.6,fill:'#fff'},p.g));
  const q=Plot(duo,{W:420,H:346,m:[40,10,12,42],xr:[0.5,DMAX+0.5],yr:[0,0.8],label:'MSE di training e di test al variare della flessibilità'});
  q.axes([1,4,7,10,13],[0,0.2,0.4,0.6,0.8],'flessibilità','MSE');
  S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(sd*sd),y2:q.sy(sd*sd),stroke:C.purple,'stroke-dasharray':'5 4'},q.g);
  S('path',{d:q.poly(tr.map((v,i)=>[i+1,v])),fill:'none',stroke:C.lg,'stroke-width':2},q.g);
  S('path',{d:q.poly(te.map((v,i)=>[i+1,v])),fill:'none',stroke:C.red,'stroke-width':2},q.g);
  const m1=S('circle',{r:5,fill:C.lg},q.g),m2=S('circle',{r:5,fill:C.red},q.g);
  const res=out(st);let best=0;te.forEach((v,i)=>{if(v<te[best])best=i});
  function draw(){fitp.setAttribute('d',p.curve(fits[d-1],0,1));
    m1.setAttribute('cx',q.sx(d));m1.setAttribute('cy',q.sy(tr[d-1]));m2.setAttribute('cx',q.sx(d));m2.setAttribute('cy',q.sy(Math.min(te[d-1],5)));
    const v=d<best+1?'Il modello è troppo rigido: sbaglia anche sul training.':d===best+1?'<span class="ok">Qui l\'errore di test è al minimo.</span>':'Il training continua a migliorare, il test peggiora: il modello sta inseguendo il rumore.';
    res.innerHTML=`MSE di training ${nf(tr[d-1],3)} · MSE di test <span style="color:${C.red}">${nf(te[d-1],3)}</span> · ${K('\\mathrm{Var}(\\Eps)='+kn(sd*sd,3))}<br>${v}`}
  draw();
};
})();
(function(){
'use strict';
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,out,legend}=window.__ML;

/* ---- esempio delle slide: y = 1,2,3,4 (+20) ---- */
FIG.cost=function(st,o){
  let five=!!o.five,w=4;
  const tb=btn(st,'',()=>{five=!five;setup()});
  const p=Plot(st,{W:600,H:150,m:[16,8,16,28],xr:[0,8],yr:[0,6],label:'Osservazioni sulla retta dei numeri e valore w del modello'});
  const q=Plot(st,{W:600,H:210,m:[16,10,16,10],xr:[0,8],yr:[0,1],label:'Costo al variare di w'});
  if(o.mae)legend(st,[[C.pink,'somma dei quadrati (MSE)'],[C.teal,'somma dei valori assoluti (MAE)']]);
  const tw=H('div',{class:'tw'},st),res=out(st);
  let Y,gd=S('g',null,p.g),gq=S('g',null,q.g),hw;
  const sse=v=>Y.reduce((s,y)=>s+(y-v)*(y-v),0),sae=v=>Y.reduce((s,y)=>s+Math.abs(y-v),0);
  function setup(){
    Y=five?[1,2,3,4,20]:[1,2,3,4];const hi=five?21:8;p.xr=[0,hi];q.xr=[0,hi];
    tb.innerHTML=five?'Togli '+K('\\Yy_5=20'):'Aggiungi '+K('\\Yy_5=20');tb.setAttribute('aria-pressed',five?'true':'false');
    p.axes(five?[0,5,10,15,20]:[0,1,2,3,4,5,6,7,8],null);q.axg.textContent='';
    S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.ay+q.ah,y2:q.ay+q.ah,stroke:'#555'},q.axg);
    w=clamp(w,0,hi);draw()}
  function draw(){
    gd.textContent='';p.top.textContent='';
    Y.forEach((y,i)=>{const yy=p.sy(1+i);S('line',{x1:p.sx(w),x2:p.sx(y),y1:yy,y2:yy,stroke:C.pink,'stroke-width':3},gd);
      S('circle',{cx:p.sx(y),cy:yy,r:5.5,fill:C.green},gd)});
    S('line',{x1:p.sx(w),x2:p.sx(w),y1:p.ay,y2:p.ay+p.ah,stroke:C.yellow,'stroke-width':2},gd);
    S('circle',{cx:p.sx(w),cy:p.ay+p.ah,r:9,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.top);
    gq.textContent='';
    const hi=p.xr[1],mx1=Math.max(sse(0),sse(hi)),mx2=Math.max(sae(0),sae(hi));
    S('path',{d:q.curve(v=>0.04+0.92*sse(v)/mx1,0,hi),fill:'none',stroke:C.pink,'stroke-width':2.5},gq);
    const mean=Y.reduce((a,b)=>a+b,0)/Y.length;
    S('circle',{cx:q.sx(mean),cy:q.sy(0.04+0.92*sse(mean)/mx1),r:4.5,fill:'none',stroke:C.pink,'stroke-width':2},gq);
    S('circle',{cx:q.sx(w),cy:q.sy(0.04+0.92*sse(w)/mx1),r:5.5,fill:C.pink},gq);
    if(o.mae){S('path',{d:q.curve(v=>0.04+0.92*sae(v)/mx2,0,hi,480),fill:'none',stroke:C.teal,'stroke-width':2.5},gq);
      const med=five?3:2.5;S('circle',{cx:q.sx(med),cy:q.sy(0.04+0.92*sae(med)/mx2),r:4.5,fill:'none',stroke:C.teal,'stroke-width':2},gq);
      S('circle',{cx:q.sx(w),cy:q.sy(0.04+0.92*sae(w)/mx2),r:5.5,fill:C.teal},gq)}
    S('line',{x1:q.sx(w),x2:q.sx(w),y1:q.ay,y2:q.ay+q.ah,stroke:C.yellow,'stroke-width':1,'stroke-dasharray':'3 4'},gq);
    let h='<table><thead><tr><th>'+K('\\Ws')+'</th>'+[1,2,3,4,5,6,7].map(v=>`<th>${v}</th>`).join('')+'</tr></thead><tbody>';
    h+='<tr><td>'+K('\\textstyle\\sum_i(\\Yy_i-\\Ws)^2')+'</td>'+[1,2,3,4,5,6,7].map(v=>`<td>${sse(v)}</td>`).join('')+'</tr>';
    if(o.mae)h+='<tr><td>'+K('\\textstyle\\sum_i|\\Yy_i-\\Ws|')+'</td>'+[1,2,3,4,5,6,7].map(v=>`<td>${sae(v)}</td>`).join('')+'</tr>';
    tw.innerHTML=h+'</tbody></table>';
    let s=`${K('\\Ws='+kn(w,1))}: somma dei quadrati <span style="color:${C.pink}">${nf(sse(w),2)}</span>`;
    if(o.mae)s+=`, somma dei valori assoluti <span style="color:${C.teal}">${nf(sae(w),1)}</span>`;
    s+=`.<br>Minimo dei quadrati in ${K('\\Ws='+kn(mean,1))}, la media dei dati`;
    if(o.mae)s+=five?`; minimo dei valori assoluti in ${K('\\Ws=3')}, la mediana.`:`; minimo dei valori assoluti ovunque fra 2 e 3.`;else s+='.';
    res.innerHTML=s;
  }
  drag(p,p.svg,x=>{w=Math.round(clamp(x,0,p.xr[1])*10)/10;draw()});
  drag(q,q.svg,x=>{w=Math.round(clamp(x,0,q.xr[1])*10)/10;draw()});
  setup();
};

/* ---- corda: convessa / non convessa ---- */
FIG.chord=function(st){
  const F=[x=>0.45*x*x-0.6,x=>0.32*x*x+1.5*Math.sin(2.6*x)+0.9];
  let k=1,a=-0.6,b=1.75;
  buttons(st,['Convessa','Non convessa'],1,i=>{k=i;draw()});
  const p=Plot(st,{W:600,H:340,m:[12,10,12,12],xr:[-3.2,3.2],yr:[-1.6,4.6],label:'Grafico di una funzione con una corda fra due punti'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
  const cur=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.5},p.g),gm=S('g',null,p.g),ch=S('line',{'stroke-width':3},p.g);
  const ha=S('circle',{r:8,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top),hb=S('circle',{r:8,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top);
  const res=out(st);
  function draw(){const f=F[k];cur.setAttribute('d',p.curve(f,-3.2,3.2,400));
    gm.textContent='';
    const mins=[];for(let i=1;i<640;i++){const x=-3.2+i*0.01;if(f(x)<f(x-0.01)&&f(x)<=f(x+0.01))mins.push(x)}
    let g=mins[0];mins.forEach(x=>{if(f(x)<f(g))g=x});
    mins.forEach(x=>{S('circle',{cx:p.sx(x),cy:p.sy(f(x)),r:3.5,fill:C.pink},gm);const t=S('text',{x:p.sx(x),y:p.sy(f(x))+20,'text-anchor':'middle'},gm);t.textContent=x===g?'min globale':'min locale'});
    let below=0;for(let i=1;i<200;i++){const t=i/200,x=a+(b-a)*t,c=f(a)+(f(b)-f(a))*t;below=Math.max(below,f(x)-c)}
    const ok=below<=1e-9;
    ch.setAttribute('x1',p.sx(a));ch.setAttribute('y1',p.sy(f(a)));ch.setAttribute('x2',p.sx(b));ch.setAttribute('y2',p.sy(f(b)));ch.setAttribute('stroke',ok?C.green:C.red);
    ha.setAttribute('cx',p.sx(a));ha.setAttribute('cy',p.sy(f(a)));hb.setAttribute('cx',p.sx(b));hb.setAttribute('cy',p.sy(f(b)));
    res.innerHTML=ok?(k===0?'<span class="ok">La corda sta sopra il grafico.</span> Per questa funzione succede con qualunque coppia di punti: è convessa, e ha un solo minimo.'
        :'<span class="ok">Per questa coppia la corda sta sopra il grafico</span>, ma non basta: la definizione chiede che valga per tutte le coppie. Prova a scavalcare una gobba.')
      :'<span class="ko">La corda passa sotto il grafico</span>: la funzione non è convessa. Infatti ha minimi locali che non sono globali.';
  }
  drag(p,p.svg,(x,y,tok)=>{x=Math.round(clamp(x,-3.1,3.1)*20)/20;if(tok==='a')a=x;else b=x;draw()},x=>Math.abs(x-a)<Math.abs(x-b)?'a':'b');
  draw();
};

/* ---- grid search ---- */
FIG.grid=function(st){
  let d=3;
  slider(st,'Numero di parametri '+K('d'),1,12,1,d,v=>v,v=>{d=v;draw()});
  const svg=S('svg',{viewBox:'0 0 600 70',class:'plot',role:'img','aria-label':'Barra in scala logaritmica del numero di valutazioni'},st);svg.style.maxWidth='600px';
  S('rect',{x:10,y:20,width:580,height:18,fill:'#1c1c1c'},svg);const bar=S('rect',{x:10,y:20,height:18,fill:C.pink},svg);
  [0,3,6,9,12].forEach(e=>{const x=10+580*e/12;S('line',{x1:x,x2:x,y1:38,y2:44,stroke:'#555'},svg);const t=S('text',{x,y:60,'text-anchor':e===0?'start':e===12?'end':'middle'},svg);t.textContent=e===0?'1':'10'+['','³','⁶','⁹','¹²'][e/3]});
  const res=out(st);
  function tm(n){const s=n/1e6;if(s<1)return 'meno di un secondo';if(s<120)return Math.round(s)+' secondi';if(s<7200)return Math.round(s/60)+' minuti';if(s<172800)return Math.round(s/3600)+' ore';if(s<63072000)return Math.round(s/86400)+' giorni';return big(s/31536000)+' anni'}
  function draw(){const n=Math.pow(10,d);bar.setAttribute('width',580*d/12);
    res.innerHTML=`${K('10^{'+d+'}')} = <span style="color:${C.pink}">${big(n)}</span> valutazioni di ${K('\\cL')}.<br>A un milione di valutazioni al secondo: ${tm(n)}.`}
  draw();
};

/* ---- GD in una dimensione (Example 4.1) ---- */
FIG.gd1=function(st){
  const Y=[1,2,3,4],mu=2.5,L=w=>0.5*Y.reduce((s,y)=>s+(y-w)*(y-w),0)/Y.length;
  let eta=0.3;const T=10;
  slider(st,'Step size '+K('\\Et'),0.05,2.3,0.05,eta,v=>nf(v,2),v=>{eta=v;draw()});
  const p=Plot(st,{W:600,H:352,m:[40,10,12,44],xr:[-4,9],yr:[0,22],label:'Parabola del costo con i passi del gradient descent'});
  p.axes([-4,-2,0,2,4,6,8],[0,5,10,15,20],'w','costo');
  S('path',{d:p.curve(L,-4,9),fill:'none',stroke:C.pink,'stroke-width':2.5},p.g);
  S('line',{x1:p.sx(mu),x2:p.sx(mu),y1:p.ay,y2:p.ay+p.ah,stroke:'#555','stroke-dasharray':'4 4'},p.g);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const ws=[0];for(let t=0;t<T;t++)ws.push(ws[t]-eta*(ws[t]-mu));
    S('path',{d:p.poly(ws.map(w=>[w,L(w)])),fill:'none',stroke:'#fff','stroke-width':1.2,opacity:.8},g);
    ws.forEach((w,t)=>S('circle',{cx:p.sx(w),cy:clamp(p.sy(L(w)),-50,900),r:t===0?6:4.5,fill:C.yellow,opacity:t===0?1:Math.max(.35,1-t*0.06)},g));
    const fac=1-eta,e=Math.round(eta*100)/100;
    const v=e<1?'<span class="ok">Converge</span> avvicinandosi sempre dallo stesso lato.':e===1?'<span class="ok">Arriva alla media in un solo passo.</span>':e<2?'<span class="ok">Converge</span>, ma scavalcando il minimo a ogni passo.':e===2?'<span class="ko">Rimbalza per sempre</span> fra gli stessi due punti.':'<span class="ko">Diverge</span>: ogni passo finisce più lontano del precedente.';
    res.innerHTML=`A ogni passo la distanza dalla media viene moltiplicata per ${K('1-\\Et='+kn(fac,2))}. Dopo ${T} passi: ${K('\\Ws='+kn(ws[T],2))}.<br>${v}`}
  draw();
};

/* ---- GD in due dimensioni (slide) ---- */
FIG.gd2=function(st,o){
  const PRE=[[2,0.105],[10,0.105],[10,0.055]];
  let pi=o.preset!=null?o.preset:0,a=PRE[pi][0],eps=PRE[pi][1],beta=0,w0=[2.6,4.4];const T=20;
  let pb=null;
  if(!o.mom)pb=buttons(st,[K('2\\Ws_1^2+\\Ws_2^2')+', step 0,105',K('10\\Ws_1^2+\\Ws_2^2')+', step 0,105',K('10\\Ws_1^2+\\Ws_2^2')+', step 0,055'],pi,i=>{a=PRE[i][0];eps=PRE[i][1];se.set(eps);draw()});
  const se=slider(st,'Step size',0.005,0.2,0.005,eps,v=>nf(v,3),v=>{eps=v;if(pb)pb.set(PRE.findIndex(q=>q[0]===a&&Math.abs(q[1]-eps)<1e-9));draw()});
  if(o.mom)slider(st,'Momentum '+K('\\beta'),0,0.9,0.05,beta,v=>nf(v,2),v=>{beta=v;draw()});
  const p=Plot(st,{W:600,H:470,m:[10,10,10,10],xr:[-4.35,4.35],yr:[-1.75,5],label:'Curve di livello e percorso del gradient descent'});
  const gc=S('g',null,p.g),gp=S('g',null,p.g),h0=S('circle',{r:8,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top);
  S('rect',{x:p.ax+.5,y:p.ay+.5,width:p.aw-1,height:p.ah-1,fill:'none',stroke:'#333'},p.top);
  const res=out(st),u=p.aw/(p.xr[1]-p.xr[0]);
  function draw(){gc.textContent='';gp.textContent='';
    for(let i=1;i<=14;i++){const c=0.35*i*i;S('ellipse',{cx:p.sx(0),cy:p.sy(0),rx:Math.sqrt(c/a)*u,ry:Math.sqrt(c)*u,fill:'none',stroke:C.blue,'stroke-width':1,opacity:.45},gc)}
    S('circle',{cx:p.sx(0),cy:p.sy(0),r:3,fill:C.pink},gc);
    const f=w=>a*w[0]*w[0]+w[1]*w[1];let w=w0.slice(),v=w0.slice();const path=[w.slice()];
    for(let t=0;t<T;t++){const nv=[w[0]-eps*2*a*w[0],w[1]-eps*2*w[1]];w=[nv[0]+beta*(nv[0]-v[0]),nv[1]+beta*(nv[1]-v[1])];v=nv;path.push(w.slice())}
    const cl=q=>[clamp(q[0],-60,60),clamp(q[1],-60,60)];
    S('path',{d:p.poly(path.map(cl)),fill:'none',stroke:'#fff','stroke-width':1.5},gp);
    path.forEach((q,t)=>{if(t)S('circle',{cx:p.sx(cl(q)[0]),cy:p.sy(cl(q)[1]),r:3.5,fill:C.yellow},gp)});
    h0.setAttribute('cx',p.sx(w0[0]));h0.setAttribute('cy',p.sy(w0[1]));
    const f1=1-2*a*eps,f2=1-2*eps,fin=f(path[T]),div=Math.abs(f1)>1+1e-9||Math.abs(f2)>1+1e-9;
    let s=o.mom?`Numero di condizionamento ${K('\\kappa='+a)}. `:'';
    if(!o.mom||beta===0)s+=`A ogni passo ${K('\\Ws_1')} viene moltiplicato per ${K(kn(f1,2))} e ${K('\\Ws_2')} per ${K(kn(f2,2))}.<br>`;else s+='<br>';
    s+=(!o.mom||beta===0)&&div?`<span class="ko">Lo step supera la soglia ${K('1/'+a+'='+kn(1/a,2))}: il percorso diverge.</span>`
      :`Dopo ${T} passi ${K('f(\\Wv)='+(fin<1e-4?fin.toExponential(1).replace('.','{,}').replace('e','\\cdot10^{')+'}':kn(fin,3)))}`+(fin>1e3?' <span class="ko">(diverge)</span>.':'.');
    res.innerHTML=s}
  drag(p,p.svg,(x,y)=>{w0=[Math.round(clamp(x,-4,4)*10)/10,Math.round(clamp(y,-1.4,4.7)*10)/10];draw()});
  draw();
};

/* ---- GD, mini-batch, SGD ---- */
FIG.sgd=function(st){
  const r0=rng(21),N=64,X=[],Y=[];for(let i=0;i<N;i++){const x=r0.n();X.push(x);Y.push(1+2*x+0.9*r0.n())}
  let sx=0,sy=0,sxx=0,sxy=0,syy=0;for(let i=0;i<N;i++){sx+=X[i];sy+=Y[i];sxx+=X[i]*X[i];sxy+=X[i]*Y[i];syy+=Y[i]*Y[i]}
  const L=(b,m)=>(syy-2*b*sy-2*m*sxy+N*b*b+2*b*m*sx+m*m*sxx)/N;
  const mS=(N*sxy-sx*sy)/(N*sxx-sx*sx),bS=(sy-mS*sx)/N,Lmin=L(bS,mS);
  const BS=[1,8,64];let bi=0,seed=3;const T=60,eta=0.08;
  buttons(st,['Batch 1 (SGD)','Batch 8','Batch 64 (gradiente completo)'],0,i=>{bi=i;draw()});
  btn(st,'Rilancia',()=>{seed++;draw()});
  const p=Plot(st,{W:600,H:434,m:[44,10,12,44],xr:[-2.6,4.2],yr:[-0.6,4.6],label:'Percorso nello spazio dei parametri'});
  p.axes([-2,-1,0,1,2,3,4],[0,1,2,3,4],'intercetta','pendenza');
  const cv=document.createElement('canvas');cv.width=200;cv.height=140;const c=cv.getContext('2d'),im=c.createImageData(200,140);
  for(let j=0;j<140;j++)for(let i=0;i<200;i++){const v=L(p.xr[0]+(i+.5)/200*(p.xr[1]-p.xr[0]),p.yr[1]-(j+.5)/140*(p.yr[1]-p.yr[0]));
    let t=Math.sqrt(Math.min(1,(v-Lmin)/22));t=Math.floor(t*12)/12;const k=4*(j*200+i);im.data[k]=8+50*t;im.data[k+1]=18+120*t;im.data[k+2]=30+150*t;im.data[k+3]=255}
  c.putImageData(im,0,0);p.image(cv);
  S('path',{d:`M${p.sx(bS)-6} ${p.sy(mS)}h12M${p.sx(bS)} ${p.sy(mS)-6}v12`,stroke:'#fff','stroke-width':2},p.g);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const B=BS[bi],r=rng(100+seed*7+bi);let w=[-2,4.1];const path=[w.slice()];
    let idx=[],ptr=N;
    for(let t=0;t<T;t++){let gb=0,gm=0;for(let j=0;j<B;j++){if(ptr>=N){idx=X.map((_,i)=>i);for(let i=N-1;i>0;i--){const k=Math.floor(r()*(i+1));[idx[i],idx[k]]=[idx[k],idx[i]]}ptr=0}
        const i=idx[ptr++],e=w[0]+w[1]*X[i]-Y[i];gb+=2*e;gm+=2*e*X[i]}
      w=[w[0]-eta*gb/B,w[1]-eta*gm/B];path.push(w.slice())}
    S('path',{d:p.poly(path),fill:'none',stroke:C.yellow,'stroke-width':1.6},g);
    S('circle',{cx:p.sx(path[0][0]),cy:p.sy(path[0][1]),r:5,fill:'#fff'},g);S('circle',{cx:p.sx(w[0]),cy:p.sy(w[1]),r:5,fill:C.yellow},g);
    res.innerHTML=`${T} passi con batch di ${B}: <b>${big(T*B)}</b> gradienti calcolati in tutto.<br>Costo finale ${nf(L(w[0],w[1]),3)}; il minimo possibile è ${nf(Lmin,3)}.`}
  draw();
};

/* ---- subgradiente di |w| ---- */
FIG.subg=function(st){
  let w=0,g=0.4;
  slider(st,'Pendenza '+K('g'),-2,2,0.1,g,v=>nf(v,1),v=>{g=v;draw()});
  const p=Plot(st,{W:600,H:320,m:[12,10,12,26],xr:[-3,3],yr:[-1.1,2.9],label:'Grafico del valore assoluto con una retta di pendenza g'});
  p.axes([-3,-2,-1,0,1,2,3],null);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);
  S('path',{d:p.poly([[-3,3],[0,0],[3,3]]),fill:'none',stroke:C.pink,'stroke-width':2.5},p.g);
  const ln=S('line',{'stroke-width':2.5},p.g),hd=S('circle',{r:8,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.top),res=out(st);
  function draw(){const y=Math.abs(w),gg=Math.round(g*10)/10;const ok=w<0?gg===-1:w>0?gg===1:Math.abs(gg)<=1;
    ln.setAttribute('x1',p.sx(-3));ln.setAttribute('y1',p.sy(y+gg*(-3-w)));ln.setAttribute('x2',p.sx(3));ln.setAttribute('y2',p.sy(y+gg*(3-w)));ln.setAttribute('stroke',ok?C.green:C.red);
    hd.setAttribute('cx',p.sx(w));hd.setAttribute('cy',p.sy(y));
    const set=w<0?'\\{-1\\}':w>0?'\\{1\\}':'[-1,1]';
    res.innerHTML=`In ${K('\\Ws='+kn(w,1))} il subdifferenziale è ${K(set)}.<br>`+(ok?`<span class="ok">${K('g='+kn(gg,1))} è un subgradiente</span>: la retta resta sotto il grafico.`:`<span class="ko">${K('g='+kn(gg,1))} non è un subgradiente</span>: la retta taglia il grafico.`)}
  drag(p,p.svg,x=>{x=Math.round(clamp(x,-2.8,2.8)*10)/10;if(Math.abs(x)<0.15)x=0;w=x;draw()});
  draw();
};

/* ---- proiezione su un insieme convesso ---- */
FIG.proj=function(st){
  const SETS=[{n:'Palla '+K('\\lVert\\Wv\\rVert_2\\le R'),pr:w=>{const n=Math.hypot(w[0],w[1]);return n<=1.5?w:[w[0]*1.5/n,w[1]*1.5/n]}},
    {n:'Scatola '+K('a_i\\le\\Ws_i\\le b_i'),pr:w=>[clamp(w[0],-1.6,1.2),clamp(w[1],-1,1.3)]},
    {n:'Non negatività '+K('\\Ws_i\\ge0'),pr:w=>[Math.max(0,w[0]),Math.max(0,w[1])]}];
  let k=0,w=[2.3,1.6];
  buttons(st,SETS.map(s=>s.n),0,i=>{k=i;draw()});
  const p=Plot(st,{W:600,H:440,m:[10,10,10,10],xr:[-3.1,3.1],yr:[-2.24,2.24],label:'Insieme ammissibile, punto e sua proiezione'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);
  const gs=S('g',null,p.g),gl=S('g',null,p.g),res=out(st),u=p.aw/6.2;
  const hw=S('circle',{r:8,fill:'#000',stroke:C.yellow,'stroke-width':3,class:'hd'},p.top);
  function draw(){gs.textContent='';gl.textContent='';const at={fill:'rgba(109,185,244,.22)',stroke:C.blue,'stroke-width':1.5};
    if(k===0)S('circle',Object.assign({cx:p.sx(0),cy:p.sy(0),r:1.5*u},at),gs);
    if(k===1)S('rect',Object.assign({x:p.sx(-1.6),y:p.sy(1.3),width:2.8*u,height:2.3*u},at),gs);
    if(k===2)S('rect',Object.assign({x:p.sx(0),y:p.sy(4),width:5*u,height:4*u},at),gs);
    const q=SETS[k].pr(w),d2=(w[0]-q[0])**2+(w[1]-q[1])**2;
    S('line',{x1:p.sx(w[0]),y1:p.sy(w[1]),x2:p.sx(q[0]),y2:p.sy(q[1]),stroke:'#fff','stroke-dasharray':'5 4'},gl);
    S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:6,fill:C.yellow},gl);
    hw.setAttribute('cx',p.sx(w[0]));hw.setAttribute('cy',p.sy(w[1]));
    res.innerHTML=`${K('\\Wv=('+kn(w[0],1)+';\\,'+kn(w[1],1)+')')} &nbsp; ${K('\\Pi_C(\\Wv)=('+kn(q[0],2)+';\\,'+kn(q[1],2)+')')}<br>`+
      (d2<1e-12?'<span class="ok">Il punto è ammissibile</span>: la proiezione non lo sposta e la penalità è zero.':`Il punto è fuori da ${K('C')}. Penalità ${K('\\lVert\\Wv-\\Pi_C(\\Wv)\\rVert^2='+kn(d2,2))}.`)}
  drag(p,p.svg,(x,y)=>{w=[Math.round(clamp(x,-2.9,2.9)*10)/10,Math.round(clamp(y,-2.1,2.1)*10)/10];draw()});
  draw();
};
})();
(function(){
'use strict';
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,out,legend,lstsq,polyFit,mse}=window.__ML;

/* ===== Lezione 3 ===== */
const BASE=(function(){const r=rng(8),P=[];[8,9,10,11,12,13,13,14,15,16,16,17,18,20].forEach(x=>P.push([x,Math.round(clamp(-9+3.3*x+7.5*r.n(),4,76))]));return P})();
function ols(P){const n=P.length;let sx=0,sy=0;P.forEach(q=>{sx+=q[0];sy+=q[1]});const mx=sx/n,my=sy/n;let c=0,v=0;P.forEach(q=>{c+=(q[0]-mx)*(q[1]-my);v+=(q[0]-mx)**2});
  const m=v>1e-12?c/v:0;return {m,b:my-m*mx,mx,my,cov:c/n,vr:v/n}}
const mseL=(P,m,b)=>P.reduce((s,q)=>s+(q[1]-m*q[0]-b)**2,0)/P.length;

FIG.line=function(st,o){
  const P=BASE.map(q=>q.slice()),XA=7,XB=21;let ya=46,yb=41,shown=false,sig=8;
  const best0=ols(P);if(o.lik){ya=22;yb=58}
  let bb=null;
  if(!o.ols)bb=btn(st,o.lik?'Vai alla retta dei minimi quadrati':'Mostra la retta dei minimi quadrati',()=>{if(o.lik){ya=best0.m*XA+best0.b;yb=best0.m*XB+best0.b}else{shown=!shown;bb.setAttribute('aria-pressed',shown?'true':'false')}draw()});
  if(o.lik)slider(st,'Rumore '+K('\\Sg'),3,16,1,sig,v=>v,v=>{sig=v;draw()});
  const p=Plot(st,{W:600,H:400,m:[46,10,12,44],xr:[6,22],yr:[0,80],label:'Anni di istruzione e reddito con una retta'});
  p.axes([6,10,14,18,22],[0,20,40,60,80]);
  S('text',{x:p.ax+p.aw/2,y:p.H-6,'text-anchor':'middle',class:'tag'},p.axg).textContent='anni di istruzione';
  S('text',{x:p.ax+6,y:p.ay+12,class:'tag'},p.axg).textContent='reddito (migliaia)';
  const gb=S('g',null,p.g),gl=S('g',null,p.g),gp=S('g',null,p.g),res=out(st);
  const ha=S('circle',{r:8,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.top),hb=S('circle',{r:8,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.top);
  if(o.ols){ha.setAttribute('display','none');hb.setAttribute('display','none')}
  function draw(){
    const B=ols(P);let m,b;if(o.ols){m=B.m;b=B.b}else{m=(yb-ya)/(XB-XA);b=ya-m*XA}
    gb.textContent='';gl.textContent='';gp.textContent='';
    const uy=p.ah/80;
    P.forEach(q=>{const yh=m*q[0]+b,X=p.sx(q[0]);
      if(o.squares){const side=Math.abs(q[1]-yh)*uy,top=Math.min(p.sy(q[1]),p.sy(yh));S('rect',{x:X+side>p.ax+p.aw?X-side:X,y:top,width:side,height:side,fill:'rgba(220,117,205,.22)',stroke:C.pink,'stroke-width':1},gb)}
      if(o.lik){let d='';for(let i=0;i<=40;i++){const t=-3*sig+6*sig*i/40,dx=30*Math.exp(-t*t/(2*sig*sig));d+=(i?'L':'M')+(X+dx).toFixed(1)+' '+p.sy(yh+t).toFixed(1)}
        S('path',{d,fill:'none',stroke:C.purple,'stroke-width':1.2,opacity:.8},gb);S('line',{x1:X,x2:X,y1:p.sy(yh-3*sig),y2:p.sy(yh+3*sig),stroke:C.purple,opacity:.35},gb);
        const e=q[1]-yh;S('line',{x1:X,x2:X+30*Math.exp(-e*e/(2*sig*sig)),y1:p.sy(q[1]),y2:p.sy(q[1]),stroke:C.purple,'stroke-width':3},gb)}
      else S('line',{x1:X,x2:X,y1:p.sy(q[1]),y2:p.sy(yh),stroke:C.pink,'stroke-width':1.5},gb)});
    if(shown)S('line',{x1:p.sx(XA),y1:p.sy(B.m*XA+B.b),x2:p.sx(XB),y2:p.sy(B.m*XB+B.b),stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 5'},gl);
    S('line',{x1:p.sx(6),y1:p.sy(m*6+b),x2:p.sx(22),y2:p.sy(m*22+b),stroke:C.yellow,'stroke-width':2.5},gl);
    if(o.ols)S('path',{d:`M${p.sx(B.mx)-9} ${p.sy(B.my)}h18M${p.sx(B.mx)} ${p.sy(B.my)-9}v18`,stroke:'#fff','stroke-width':2.5},gl);
    P.forEach(q=>S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:o.dragPts?6:5,fill:C.green,stroke:'#000','stroke-width':1},gp));
    ha.setAttribute('cx',p.sx(XA));ha.setAttribute('cy',p.sy(ya));hb.setAttribute('cx',p.sx(XB));hb.setAttribute('cy',p.sy(yb));
    const L=mseL(P,m,b),Lb=mseL(P,B.m,B.b);
    let s;
    if(o.ols)s=`${K('\\mathrm{Cov}(\\Xs,\\Yy)='+kn(B.cov,1))}, ${K('\\mathrm{Var}(\\Xs)='+kn(B.vr,1))}, quindi ${K('\\Mm^*='+kn(B.m,2))} e ${K('\\Bi^*='+kn(B.b,1))}.<br>Punto delle medie: ${K('(\\bar{\\Xs},\\bar{\\Yy})=('+kn(B.mx,1)+';\\,'+kn(B.my,1)+')')}.`;
    else if(o.lik){const n=P.length,ll=-n/2*Math.log(2*Math.PI*sig*sig)-L*n/(2*sig*sig),lm=-n/2*Math.log(2*Math.PI*sig*sig)-Lb*n/(2*sig*sig);
      s=`Somma dei quadrati ${nf(L*n,0)} (minimo possibile ${nf(Lb*n,0)}).<br>Log-verosimiglianza ${nf(ll,2)} (massimo possibile con questo ${K('\\Sg')}: ${nf(lm,2)}).`+(L-Lb<0.05?' <span class="ok">Coincidono.</span>':'')}
    else{s=`${K('\\Mm='+kn(m,2))}, ${K('\\Bi='+kn(b,1))}, ${K('\\cL='+kn(L,1))}`;
      s+=shown?`<br>La retta dei minimi quadrati (tratteggiata) ha ${K('\\cL='+kn(Lb,1))}`+(L-Lb<0.6?': <span class="ok">ci sei praticamente sopra.</span>':`: la tua costa ${nf(L/Lb,2)} volte tanto.`):'<br><span class="dim">Trascina i due estremi gialli.</span>'}
    res.innerHTML=s;
  }
  if(o.dragPts)drag(p,p.svg,(x,y,i)=>{P[i][1]=Math.round(clamp(y,1,79));P[i][0]=Math.round(clamp(x,6.5,21.5)*2)/2;draw()},(x,y)=>{let bi=0,bd=1e9;P.forEach((q,i)=>{const d=((q[0]-x)*p.aw/16)**2+((q[1]-y)*p.ah/80)**2;if(d<bd){bd=d;bi=i}});return bi});
  else if(!o.ols)drag(p,p.svg,(x,y,t)=>{y=Math.round(clamp(y,-10,90)*2)/2;if(t==='a')ya=y;else yb=y;draw()},x=>x<14?'a':'b');
  draw();
};

FIG.surface=function(st){
  const P=BASE,B=ols(P);let m=1.2,b=30;
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:356,m:[38,10,10,42],xr:[6,22],yr:[0,80],label:'Dati e retta corrispondente ai parametri scelti'});
  p.axes([6,14,22],[0,40,80],'x','y');
  P.forEach(q=>S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:4.5,fill:C.green},p.g));
  const ln=S('line',{stroke:C.yellow,'stroke-width':2.5},p.g);
  const q=Plot(duo,{W:420,H:356,m:[42,10,10,42],xr:[-3,9],yr:[-70,70],label:'Costo in funzione di pendenza e intercetta'});
  q.axes([-2,0,2,4,6,8],[-60,-30,0,30,60],'m','b');
  const nx=210,ny=150,cv=document.createElement('canvas');cv.width=nx;cv.height=ny;const c=cv.getContext('2d'),im=c.createImageData(nx,ny);
  const Lm=mseL(P,B.m,B.b),lmax=Math.log(1+mseL(P,9,70)/Lm);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const v=mseL(P,q.xr[0]+(i+.5)/nx*12,q.yr[1]-(j+.5)/ny*140);let t=Math.min(1,Math.log(v/Lm)/lmax);t=Math.floor(t*14)/14;const k=4*(j*nx+i);im.data[k]=6+60*t;im.data[k+1]=14+140*t;im.data[k+2]=26+170*t;im.data[k+3]=255}
  c.putImageData(im,0,0);q.image(cv);
  S('path',{d:`M${q.sx(B.m)-6} ${q.sy(B.b)}h12M${q.sx(B.m)} ${q.sy(B.b)-6}v12`,stroke:'#fff','stroke-width':2},q.g);
  const hd=S('circle',{r:8,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},q.top),res=out(st);
  function draw(){ln.setAttribute('x1',p.sx(6));ln.setAttribute('y1',p.sy(m*6+b));ln.setAttribute('x2',p.sx(22));ln.setAttribute('y2',p.sy(m*22+b));
    hd.setAttribute('cx',q.sx(m));hd.setAttribute('cy',q.sy(b));const L=mseL(P,m,b);
    res.innerHTML=`${K('\\Mm='+kn(m,2))}, ${K('\\Bi='+kn(b,1))}, ${K('\\cL='+kn(L,1))}. Il fondo (croce bianca) è in ${K('\\Mm^*='+kn(B.m,2))}, ${K('\\Bi^*='+kn(B.b,1))}, dove ${K('\\cL='+kn(Lm,1))}.<br>`+
      (L<Lm*1.05?'<span class="ok">Sei sul fondo.</span>':'La conca è una valle stretta e obliqua: pendenza e intercetta si compensano a vicenda.')}
  drag(q,q.svg,(x,y)=>{m=Math.round(clamp(x,-2.8,8.8)*20)/20;b=Math.round(clamp(y,-68,68));draw()});
  draw();
};

FIG.projy=function(st){
  const X=[2,1];let y=[1.2,2.4],w=0.3;
  const sl=slider(st,'Peso '+K('\\Ws'),-0.3,1.8,0.01,w,v=>nf(v,2),v=>{w=v;draw()});
  btn(st,'Vai a '+K('\\Ws^*'),()=>{w=ws();sl.set(w);draw()});
  const p=Plot(st,{W:600,H:420,m:[10,10,10,10],xr:[-1.2,4.6],yr:[-0.9,3.16],label:'Vettore y, retta generata dalla colonna di X e proiezione'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);
  S('text',{x:p.ax+p.aw-6,y:p.sy(0)-8,'text-anchor':'end'},p.bg).textContent='dato 1';S('text',{x:p.sx(0)+8,y:p.ay+16},p.bg).textContent='dato 2';
  S('line',{x1:p.sx(-2*2),y1:p.sy(-2),x2:p.sx(6),y2:p.sy(3),stroke:C.blue,'stroke-width':2},p.g);
  const g=S('g',null,p.g),hy=S('circle',{r:8,fill:C.green,stroke:'#000','stroke-width':2,class:'hd'},p.top),res=out(st);
  const ws=()=>(X[0]*y[0]+X[1]*y[1])/5;
  function arrow(a,b2,c,wd){const A=[p.sx(a[0]),p.sy(a[1])],Bq=[p.sx(b2[0]),p.sy(b2[1])];S('line',{x1:A[0],y1:A[1],x2:Bq[0],y2:Bq[1],stroke:c,'stroke-width':wd||2.5},g);
    const an=Math.atan2(Bq[1]-A[1],Bq[0]-A[0]);if(Math.hypot(Bq[0]-A[0],Bq[1]-A[1])>12)S('path',{d:`M${Bq[0]} ${Bq[1]}L${Bq[0]-11*Math.cos(an-0.4)} ${Bq[1]-11*Math.sin(an-0.4)}L${Bq[0]-11*Math.cos(an+0.4)} ${Bq[1]-11*Math.sin(an+0.4)}z`,fill:c},g)}
  function draw(){g.textContent='';const f=[X[0]*w,X[1]*w],r=[y[0]-f[0],y[1]-f[1]],opt=ws(),nr=Math.hypot(r[0],r[1]);
    arrow([0,0],X,C.blue,4);arrow([0,0],y,C.green);arrow([0,0],f,C.yellow);
    S('line',{x1:p.sx(f[0]),y1:p.sy(f[1]),x2:p.sx(y[0]),y2:p.sy(y[1]),stroke:C.pink,'stroke-width':2.5,'stroke-dasharray':'6 4'},g);
    const T=(t,q,c,dx,dy)=>{const e=S('text',{x:p.sx(q[0])+dx,y:p.sy(q[1])+dy,class:'lab',style:'fill:'+c},g);e.textContent=t};
    T('y',y,C.green,10,-8);T('Xw',f,C.yellow,6,22);T('col(X)',[4.0,2.0],C.blue,-18,26);
    const dot=r[0]*X[0]+r[1]*X[1],ang=nr<1e-9?90:Math.acos(clamp(dot/(nr*Math.sqrt(5)),-1,1))*180/Math.PI,at=Math.abs(w-opt)<0.006;
    if(at){const u=[X[0]/Math.sqrt(5),X[1]/Math.sqrt(5)],n=nr>1e-9?[r[0]/nr,r[1]/nr]:[0,0],s=0.16;
      S('path',{d:p.poly([[f[0]+u[0]*s,f[1]+u[1]*s],[f[0]+u[0]*s+n[0]*s,f[1]+u[1]*s+n[1]*s],[f[0]+n[0]*s,f[1]+n[1]*s]]),fill:'none',stroke:'#fff','stroke-width':1.5},g)}
    hy.setAttribute('cx',p.sx(y[0]));hy.setAttribute('cy',p.sy(y[1]));
    res.innerHTML=`Distanza ${K('\\lVert\\Yv-\\Xm\\Ws\\rVert='+kn(nr,3))}, angolo fra residuo e colonna ${nf(ang,1)}°. Il minimo è in ${K('\\Ws^*='+kn(opt,2))}.<br>`+
      (at?'<span class="ok">Residuo perpendicolare alla retta: questa è la proiezione ortogonale.</span>':'Il residuo non è perpendicolare: muovendo '+K('\\Ws')+' ci si può ancora avvicinare.')}
  drag(p,hy,(x,yy)=>{y=[Math.round(clamp(x,-1,4.4)*10)/10,Math.round(clamp(yy,-0.7,3)*10)/10];draw()});
  draw();
};

FIG.cost3=function(st){
  let ln=4,ld=2,lt=2;const f=v=>K('10^{'+v+'}');
  slider(st,'Dati '+K('N'),2,8,1,ln,f,v=>{ln=v;draw()});
  slider(st,'Features '+K('d'),1,5,1,ld,f,v=>{ld=v;draw()});
  slider(st,'Iterazioni di GD '+K('T'),1,5,1,lt,f,v=>{lt=v;draw()});
  const b=H('div',{class:'bars'},st),res=out(st);
  function row(n,v,c){return `<span>${n}</span><div class="bar"><i style="width:${Math.min(100,v/18*100)}%;background:${c}"></i></div><span>${K('\\approx10^{'+kn(v,1)+'}')}</span>`}
  function draw(){const cf=Math.log10(Math.pow(10,ln+2*ld)+Math.pow(10,3*ld)),gd=lt+ln+ld;
    b.innerHTML=row('Formula chiusa',cf,C.blue)+row('Gradient descent',gd,C.yellow);
    const r=Math.abs(cf-gd);res.innerHTML=r<0.05?'I due costi sono dello stesso ordine.':(cf<gd?'<b>Formula chiusa</b>':'<b>Gradient descent</b>')+` più economico di un fattore circa ${K('10^{'+kn(r,1)+'}')}.`+
      (ld>=ln?`<br><span class="ko">Attenzione: qui ${K('d\\ge N')}, quindi ${K('\\Xm^\\top\\Xm')} è singolare e la formula chiusa non si può usare così com'è.</span>`:'')}
  draw();
};

/* ===== Lezione 4 ===== */
const F4=x=>12*(x-0.4)*(x-0.4)-0.3;
function sample(r,N,sd){const xs=[],ys=[];for(let i=0;i<N;i++){const x=(i+r())/N;xs.push(x);ys.push(F4(x)+sd*r.n())}return [xs,ys]}

FIG.poly=function(st,o){
  let deg=o.deg||1,N=10,sd=0.4,seed=o.extra?41:27;
  const sdg=slider(st,'Grado del polinomio',1,9,1,deg,v=>v,v=>{deg=v;draw()});
  let sN=null;
  if(o.extra){const NS=[10,20,50,100,300];sN=slider(st,'Punti di training '+K('N'),0,4,1,0,v=>NS[v],v=>{N=NS[v];gen();draw()});
    slider(st,'Rumore '+K('\\Sg'),0,0.8,0.1,sd,v=>nf(v,1),v=>{sd=v;gen();draw()})}
  btn(st,'Nuovo dataset',()=>{seed++;gen();draw()});
  legend(st,[['#fff','training','dot'],['transparent','test','dot','box-shadow:inset 0 0 0 1.5px #c9c9c9'],[C.yellow,'modello '+K('\\Fh')],['#fff','vera '+K('\\Ff'),'','height:2px;opacity:.6']]);
  const p=Plot(st,{W:600,H:414,m:[40,10,12,44],xr:[0,1],yr:[-1.8,5.2],label:'Dati di training e test con il polinomio adattato'});
  p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2,3,4,5],'x','y');
  S('path',{d:p.curve(F4,0,1),fill:'none',stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'5 4',opacity:.75},p.g);
  const fp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g),g=S('g',null,p.g),res=out(st);
  let xs,ys,xt,yt;
  function gen(){const r=rng(seed*13+N);[xs,ys]=sample(r,N,sd);[xt,yt]=sample(r,400,sd)}
  function draw(){const d=Math.min(deg,N-1),fn=polyFit(xs,ys,d,0,1);fp.setAttribute('d',p.curve(fn,0,1,400));g.textContent='';
    for(let i=0;i<14;i++)S('circle',{cx:p.sx(xt[i*28+5]),cy:p.sy(yt[i*28+5]),r:4,fill:'none',stroke:'#c9c9c9','stroke-width':1.5},g);
    const rr=N>60?2.6:4.5;xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:rr,fill:'#fff'},g));
    const a=mse(fn,xs,ys),b=mse(fn,xt,yt),irr=sd*sd;
    const v=a>irr*2.2+0.15?'Errore alto su entrambi: <b>underfitting</b>.':(b>2.5*a&&b>irr*1.5+0.03)?'Training basso, test alto: <b>overfitting</b>.':'I due errori sono vicini fra loro e al rumore: il modello generalizza.';
    res.innerHTML=`Grado ${d}: MSE di training ${nf(a,3)} · MSE di test <span style="color:${C.red}">${b>999?'oltre 999':nf(b,3)}</span> · ${K('\\Sg^2='+kn(irr,2))}<br>${v}`}
  gen();draw();
};

FIG.basis=function(st){
  const r=rng(4),N=40,xs=[],ys=[],G=x=>x<0.5?0.6+2.4*x:1.8-2.6*(x-0.5)+1.4*Math.sin(9*(x-0.5))*(x-0.5);
  for(let i=0;i<N;i++){const x=(i+r())/N;xs.push(x);ys.push(G(x)+0.13*r.n())}
  let fam=0,deg=3,c=0.5,k=6,bw=0.12;
  buttons(st,['Polinomiale','Lineare a tratti','Radiale (RBF)'],0,i=>{fam=i;ctl();draw()});
  const cw=H('div',{style:'width:100%;display:flex;flex-direction:column;align-items:center;gap:.6rem;min-height:4.6rem;justify-content:center'},st);
  const p=Plot(st,{W:600,H:394,m:[40,10,12,44],xr:[0,1],yr:[-1.4,2.8],label:'Dati adattati con basis functions'});
  p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2],'x','y');
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);
  const gb=S('g',null,p.g),fp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g);
  xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:3.5,fill:'#fff'},p.g));
  const res=out(st);
  function ctl(){cw.textContent='';
    if(fam===0)slider(cw,'Grado '+K('p'),1,7,1,deg,v=>v,v=>{deg=v;draw()});
    if(fam===1)slider(cw,'Punto di rottura '+K('c'),0.1,0.9,0.05,c,v=>nf(v,2),v=>{c=v;draw()});
    if(fam===2){slider(cw,'Numero di funzioni '+K('\\Kk'),2,12,1,k,v=>v,v=>{k=v;draw()});slider(cw,'Bandwidth '+K('\\Bw'),0.02,0.5,0.01,bw,v=>nf(v,2),v=>{bw=v;draw()})}}
  function basis(){
    if(fam===0)return Array.from({length:deg+1},(_,j)=>x=>Math.pow(x,j));
    if(fam===1)return [x=>1,x=>x<=c?x:0,x=>x>c?x:0,x=>x>c?1:0];
    return Array.from({length:k},(_,j)=>{const mu=k===1?0.5:j/(k-1);return x=>Math.exp(-(x-mu)*(x-mu)/(2*bw*bw))})}
  function draw(){const B=basis(),w=lstsq(xs.map(x=>B.map(f=>f(x))),ys),fn=x=>{let s=0;for(let j=0;j<B.length;j++)s+=w[j]*B[j](x);return s};
    gb.textContent='';B.forEach((f,j)=>S('path',{d:p.curve(x=>w[j]*f(x),0,1,300),fill:'none',stroke:C.blue,'stroke-width':1,opacity:.55},gb));
    if(fam===1)S('line',{x1:p.sx(c),x2:p.sx(c),y1:p.ay,y2:p.ay+p.ah,stroke:'#555','stroke-dasharray':'4 4'},gb);
    fp.setAttribute('d',fam===1?p.curve(fn,0,c-1e-6,200)+p.curve(fn,c+1e-6,1,200):p.curve(fn,0,1,400));
    res.innerHTML=`${B.length} basis functions, quindi ${B.length} pesi da stimare. MSE di training ${nf(mse(fn,xs,ys),4)}.<br>`+
      ['Con il grado alto i singoli termini diventano enormi e si compensano fra loro: è il segnale dei problemi numerici.','Ogni tratto ha la sua retta: cambiare il punto di rottura sposta dove la pendenza può cambiare.','Ogni gaussiana agisce solo vicino al suo centro. Con '+K('\\Bw')+' piccola la curva si fa a punte; con '+K('\\Bw')+' grande le funzioni si sovrappongono e la curva si irrigidisce.'][fam]}
  ctl();draw();
};

function mc(deg,N,sd,M,seed){const r=rng(seed),G=40,gx=Array.from({length:G},(_,i)=>(i+.5)/G),sum=new Float64Array(G),sq=new Float64Array(G),fits=[];
  for(let s=0;s<M;s++){const [xs,ys]=sample(r,N,sd),fn=polyFit(xs,ys,deg,0,1);if(s<30)fits.push(fn);for(let i=0;i<G;i++){const v=fn(gx[i]);sum[i]+=v;sq[i]+=v*v}}
  let b2=0,vr=0;const mean=[];for(let i=0;i<G;i++){const mu=sum[i]/M;mean.push(mu);b2+=(mu-F4(gx[i]))**2;vr+=sq[i]/M-mu*mu}
  return {b2:b2/G,vr:vr/G,gx,mean,fits}}

FIG.spread=function(st){
  let deg=5,seed=1;const N=10,sd=0.4;
  slider(st,'Grado del polinomio',1,7,1,deg,v=>v,v=>{deg=v;draw()});
  btn(st,'Altri 30 dataset',()=>{seed++;draw()});
  legend(st,[[C.yellow,'modello su un dataset','','opacity:.45;height:2px'],[C.yellow,'modello medio '+K('\\Fb')],['#fff','vera '+K('\\Ff'),'','height:2px']]);
  const p=Plot(st,{W:600,H:414,m:[40,10,12,44],xr:[0,1],yr:[-1.8,5.2],label:'Modelli adattati a dataset diversi, loro media e funzione vera'});
  p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2,3,4,5],'x','y');
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const R=mc(deg,N,sd,400,seed*31+deg);
    R.fits.forEach(fn=>S('path',{d:p.curve(fn,0,1,160),fill:'none',stroke:C.yellow,'stroke-width':1,opacity:.3},g));
    S('path',{d:p.poly(R.gx.map((x,i)=>[x,R.mean[i]])),fill:'none',stroke:C.yellow,'stroke-width':3},g);
    S('path',{d:p.curve(F4,0,1),fill:'none',stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 5'},g);
    res.innerHTML=`Grado ${deg}, stime su 400 dataset: ${K('\\text{bias}^2\\approx'+kn(R.b2,3))}, ${K('\\text{varianza}\\approx'+(R.vr>999?'\\text{oltre }999':kn(R.vr,3)))}.<br>`+
      (deg===1?'Rette quasi identiche, tutte lontane dalla parabola.':deg===2?'La classe giusta: media sulla parabola, curve poco sparpagliate.':'La media resta sulla parabola, ma le singole curve si allontanano sempre di più.')}
  draw();
};

FIG.ucurve=function(st){
  const NS=[10,15,20,30,50,100],sd=0.4,D=[1,2,3,4,5,6,7];let ni=0;
  slider(st,'Punti di training '+K('N'),0,NS.length-1,1,ni,v=>NS[v],v=>{ni=v;draw()});
  legend(st,[[C.blue,'bias²'],[C.teal,'varianza'],[C.purple,'errore irriducibile '+K('\\Sg^2')],[C.red,'errore di test atteso']]);
  const p=Plot(st,{W:600,H:380,m:[42,10,12,44],xr:[0.6,7.4],yr:[0,1.5],label:'Bias al quadrato, varianza ed errore totale al variare del grado'});
  p.axes(D,[0,0.5,1,1.5]);
  S('text',{x:p.ax+p.aw/2,y:p.H-6,'text-anchor':'middle',class:'tag'},p.axg).textContent='grado del polinomio (complessità)';
  const g=S('g',null,p.g),res=out(st),cache={};
  function draw(){g.textContent='';const N=NS[ni];if(!cache[N])cache[N]=D.map(d=>mc(d,N,sd,500,77+d+N));const R=cache[N];
    const tot=R.map(q=>q.b2+q.vr+sd*sd);
    const L=(arr,c,wd)=>{S('path',{d:p.poly(arr.map((v,i)=>[D[i],Math.min(v,50)])),fill:'none',stroke:c,'stroke-width':wd||2},g);arr.forEach((v,i)=>S('circle',{cx:p.sx(D[i]),cy:p.sy(Math.min(v,50)),r:3.5,fill:c},g))};
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(sd*sd),y2:p.sy(sd*sd),stroke:C.purple,'stroke-width':2,'stroke-dasharray':'5 4'},g);
    L(R.map(q=>q.b2),C.blue);L(R.map(q=>q.vr),C.teal);L(tot,C.red,3);
    let bi=0;tot.forEach((v,i)=>{if(v<tot[bi])bi=i});S('circle',{cx:p.sx(D[bi]),cy:p.sy(tot[bi]),r:8,fill:'none',stroke:'#fff','stroke-width':2},g);
    const off=tot.filter(v=>v>1.5).length;
    res.innerHTML=`Con ${K('N='+N)} l'errore atteso è minimo al grado ${D[bi]}: ${nf(tot[bi],3)}, di cui ${nf(sd*sd,2)} irriducibile.<br>`+
      `Al grado 7 la varianza vale ${R[6].vr>999?'oltre 999':nf(R[6].vr,2)}`+(off?' (fuori scala).':'.')}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,polyFit,mse}=M;

/* ---------- helper condivisi ---------- */
function Svg(host,W,Hh,label,maxw){const s=S('svg',{viewBox:`0 0 ${W} ${Hh}`,class:'plot',role:'img','aria-label':label},host);s.style.maxWidth=(maxw||W)+'px';return s}
function proj3(az,el,cx,cy,sc,c0){const ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
  return q=>{const x=q[0]-c0[0],y=q[1]-c0[1],z=q[2]-c0[2],xr=x*ca+y*sa,yr=-x*sa+y*ca;return [cx+sc*xr,cy-sc*(z*ce+yr*se)]}}
function wire(g,P,fn,xr,yr,n,stroke,op){const L=(a)=>a.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join('');
  for(let i=0;i<=n;i++){const u=xr[0]+(xr[1]-xr[0])*i/n,a=[],b=[];for(let j=0;j<=n*2;j++){const v=yr[0]+(yr[1]-yr[0])*j/(n*2),v2=xr[0]+(xr[1]-xr[0])*j/(n*2);a.push(P([u,v,fn(u,v)]));b.push(P([v2,yr[0]+(yr[1]-yr[0])*i/n,fn(v2,yr[0]+(yr[1]-yr[0])*i/n)]))}
    S('path',{d:L(a),fill:'none',stroke,'stroke-width':1,opacity:op||.8},g);S('path',{d:L(b),fill:'none',stroke,'stroke-width':1,opacity:op||.8},g)}}
function heat(p,fn,vmax,nx){nx=nx||180;const ny=Math.round(nx*p.ah/p.aw),cv=document.createElement('canvas');cv.width=nx;cv.height=ny;const c=cv.getContext('2d'),im=c.createImageData(nx,ny);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const v=fn(p.xr[0]+(i+.5)/nx*(p.xr[1]-p.xr[0]),p.yr[1]-(j+.5)/ny*(p.yr[1]-p.yr[0]));let t=Math.sqrt(clamp(v/vmax,0,1));t=Math.floor(t*12)/12;const k=4*(j*nx+i);im.data[k]=8+50*t;im.data[k+1]=18+120*t;im.data[k+2]=30+150*t;im.data[k+3]=255}
  c.putImageData(im,0,0);p.image(cv)}
function arrow(g,x1,y1,x2,y2,c,w){S('line',{x1,y1,x2,y2,stroke:c,'stroke-width':w||2.5},g);const an=Math.atan2(y2-y1,x2-x1),h=6+2*(w||2.5);
  if(Math.hypot(x2-x1,y2-y1)>h)S('path',{d:`M${x2} ${y2}L${x2-h*Math.cos(an-.42)} ${y2-h*Math.sin(an-.42)}L${x2-h*Math.cos(an+.42)} ${y2-h*Math.sin(an+.42)}z`,fill:c},g)}
const cap=(host,t)=>H('div',{class:'sub'},host,t);
Object.assign(M,{Svg,proj3,wire,heat,arrow,cap});

/* ================= LEZIONE 1 ================= */
/* ECG schematici: dagli esempi etichettati alla previsione */
FIG.ecg=function(st){
  const W=600,Hh=372,svg=Svg(st,W,Hh,'Tre tracciati etichettati e un tracciato nuovo da classificare');
  const g=x=>Math.exp(-x*x);
  function trace(type,seed){const r=rng(seed),beats=[];let t=0.06;while(t<1.02){beats.push(t);t+=type===1?0.11+0.16*r():0.185}
    return x=>{let y=0;beats.forEach(b=>{const d=(x-b);
      if(type!==1)y+=0.12*g((d+0.045)/0.012);
      if(type===2)y+=0.55*g((d+0.006)/0.006)-0.25*g(d/0.004)+0.75*g((d-0.012)/0.007);
      else y+=1.0*g(d/0.0045)-0.16*g((d+0.011)/0.004)-0.2*g((d-0.011)/0.004);
      y+=0.2*g((d-0.06)/0.02)});
      if(type===1)y+=0.035*Math.sin(140*x+seed)+0.03*Math.sin(233*x);return y}}
  const rows=[{f:trace(0,3),l:'nessuna anomalia',y:52},{f:trace(1,5),l:'fibrillazione atriale',y:132},{f:trace(2,7),l:'blocco di branca destra',y:212},{f:trace(1,12),l:'fibrillazione atriale',y:330,nw:true}];
  const X0=14,X1=370,amp=44;
  S('line',{x1:X0,x2:W-14,y1:262,y2:262,stroke:'#333','stroke-dasharray':'4 5'},svg);
  const els=rows.map(r=>{const p=S('path',{fill:'none',stroke:r.nw?'#fff':C.blue,'stroke-width':1.6},svg);
    const t=S('text',{x:X1+28,y:r.y+5,style:`fill:${C.green};font-size:16px`},svg);t.textContent=r.l;
    const a=S('g',null,svg);arrow(a,X1+2,r.y,X1+16,r.y,r.nw?C.yellow:'#8c8c8c',1.5);return {p,t,a}});
  const q=S('text',{x:X1+28,y:335,style:'fill:#fff;font-size:18px'},svg);q.textContent='?';
  const tg=S('text',{x:X0,y:281,class:'tag'},svg);tg.textContent='tracciato nuovo, senza etichetta';
  const res=out(st);res.style.minHeight='3.4em';
  function path(f,y,frac){let d='';const n=Math.max(2,Math.round(420*frac));for(let i=0;i<=n;i++){const u=i/420;d+=(i?'L':'M')+(X0+u*(X1-X0)).toFixed(1)+' '+(y+12-amp*f(u)).toFixed(1)}return d}
  const N=96;
  function draw(i){const a=clamp(i/24,0,1),b=clamp((i-24)/27,0,1),c=clamp((i-54)/20,0,1),d=clamp((i-78)/10,0,1);
    rows.forEach((r,k)=>{const e=els[k];if(r.nw){e.p.setAttribute('d',c>0?path(r.f,r.y,c):'');e.t.setAttribute('opacity',d);e.a.setAttribute('opacity',d);q.setAttribute('opacity',c>=1&&d<1?1:0);tg.setAttribute('opacity',c>0?1:0)}
      else{e.p.setAttribute('d',path(r.f,r.y,a));const o=clamp(b*3-k,0,1);e.t.setAttribute('opacity',o);e.a.setAttribute('opacity',o)}});
    res.innerHTML=i<24?'Tre tracciati registrati: per ora sono solo <span style="color:#58C4DD">input</span>.':i<54?'Un cardiologo assegna a ciascuno la sua <span style="color:#83C167">etichetta</span>: ora sono coppie (input, output), cioè dati di training.':i<78?'Arriva un tracciato che nessuno ha etichettato.':'Il modello, regolato sugli esempi, <span style="color:#FFFF00">prevede</span> l\'etichetta: questo è generalizzare.'}
  player(st,N,6,draw).seek(N);
};

/* tre tipi di output */
FIG.outtypes=function(st){
  const r=rng(2),xs=[],lab=[];for(let i=0;i<16;i++){const x=(i+.2+.6*r())/16;xs.push(x);lab.push(r()<1/(1+Math.exp(-9*(x-.5)))?1:0)}
  const tri=H('div',{class:'trio'},st);
  const mk=(yl,yt,yr)=>{const d=H('div',null,tri),p=Plot(d,{W:230,H:190,m:[30,10,8,24],xr:[0,1],yr,label:yl});p.axes([0,1],yt,'input');return [p,d]};
  let [p,d]=mk('Classificazione',[0,1],[-.25,1.25]);
  S('path',{d:p.poly([[0,0],[.5,0],[.5,1],[1,1]]),fill:'none',stroke:C.yellow,'stroke-width':2.2},p.g);
  xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(lab[i]),r:4,fill:lab[i]?C.blue:C.orange},p.g));cap(d,'<b>Classificazione</b><br>l\'output è una categoria');
  [p,d]=mk('Regressione',[0,1,2],[-.3,2.4]);const f=x=>0.3+1.6*x+0.25*Math.sin(6*x);
  S('path',{d:p.curve(f,0,1),fill:'none',stroke:C.yellow,'stroke-width':2.2},p.g);
  xs.forEach(x=>S('circle',{cx:p.sx(x),cy:p.sy(f(x)+0.16*r.n()),r:4,fill:C.green},p.g));cap(d,'<b>Regressione</b><br>l\'output è un numero');
  [p,d]=mk('Stima di probabilità',[0,0.5,1],[-.25,1.25]);
  S('path',{d:p.curve(x=>1/(1+Math.exp(-9*(x-.5))),0,1),fill:'none',stroke:C.yellow,'stroke-width':2.2},p.g);
  xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(lab[i]),r:4,fill:lab[i]?C.blue:C.orange,opacity:.75},p.g));cap(d,'<b>Stima di probabilità</b><br>l\'output è fra 0 e 1');
};

/* i punti della slide stanno su un piano */
FIG.plane3d=function(st){
  const D=[[2,3,10],[5,8,2],[7,2,6],[9,8,-2],[8,1,6],[4,10,1],[8,8,-1],[8,1,6],[4,5,6],[3,10,2]];
  const W=600,Hh=400,svg=Svg(st,W,Hh,'Dieci punti nello spazio che stanno tutti sullo stesso piano'),g=S('g',null,svg),res=out(st);res.style.minHeight='3.4em';
  const N=80,L=q=>q.map((a,i)=>(i?'L':'M')+a[0].toFixed(1)+' '+a[1].toFixed(1)).join('');
  function draw(i){g.textContent='';const t=i/N,e=t*t*(3-2*t),az=(-25+70*e)*Math.PI/180,el=(28*(1-e))*Math.PI/180,P=proj3(az,el,300,205,21,[5.5,5.5,4]);
    const box=[[0,0],[11,0],[11,11],[0,11]];
    [-3,11].forEach(z=>S('path',{d:L(box.map(b=>P([b[0],b[1],z])))+'Z',fill:'none',stroke:'#3a3a3a'},g));
    box.forEach(b=>S('path',{d:L([P([b[0],b[1],-3]),P([b[0],b[1],11])]),stroke:'#3a3a3a',fill:'none'},g));
    S('path',{d:L([[1,1,13],[11,1,3],[11,11,-7+0],[1,11,3]].map(P))+'Z',fill:'rgba(88,196,221,.2)',stroke:C.blue,'stroke-width':1.2},g);
    D.forEach(q=>{const a=P(q);S('circle',{cx:a[0],cy:a[1],r:5,fill:'#fff'},g)});
    const cc=P([5.5,5.5,4]);[['X',[11,0,-3],1-e],['Y',[0,11,-3],1-e],['Z',[11,11,11],1]].forEach(a=>{const q=P(a[1]),dx=q[0]-cc[0],dy=q[1]-cc[1],n=Math.hypot(dx,dy)||1,e2=S('text',{x:q[0]+dx/n*16,y:q[1]+dy/n*16+6,class:'lab','text-anchor':'middle',opacity:a[2]},g);e2.textContent=a[0]});
    res.innerHTML=t<0.35?'Dieci righe della tabella, tre colonne: dieci punti nello spazio.':t<0.95?'Ruotando il punto di vista, i punti si allineano…':'Visti di taglio stanno tutti su una retta: nello spazio occupano un <b style="color:#58C4DD">piano</b>. Bastano due numeri per descriverli, non tre.'}
  player(st,N,7,draw);
};

/* reinforcement learning: una quadrupla per passo */
FIG.rlgrid=function(st){
  const W=600,Hh=250,svg=Svg(st,W,Hh,'Un agente si muove in una griglia e riceve una ricompensa all\'arrivo'),cs=62,ox=(W-5*cs)/2,oy=20;
  const path=[[0,2],[1,2],[1,1],[2,1],[3,1],[3,0],[4,0]],wall=[[2,2],[2,0]];
  for(let c=0;c<5;c++)for(let r=0;r<3;r++){const w=wall.some(q=>q[0]===c&&q[1]===r),goal=c===4&&r===0;
    S('rect',{x:ox+c*cs,y:oy+r*cs,width:cs,height:cs,fill:w?'#2a2a2a':goal?'rgba(131,193,103,.25)':'#000',stroke:'#444'},svg)}
  const gt=S('text',{x:ox+4.5*cs,y:oy+.5*cs+5,'text-anchor':'middle',style:`fill:${C.green};font-size:15px`},svg);gt.textContent='+1';
  const tr=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2,opacity:.5},svg),ag=S('circle',{r:13,fill:C.yellow},svg),res=out(st);res.style.minHeight='5em';
  const ctr=q=>[ox+(q[0]+.5)*cs,oy+(q[1]+.5)*cs],nm=q=>`(${q[0]+1},${3-q[1]})`;
  function draw(pf){const i0=Math.min(path.length-1,Math.floor(pf)),fr0=clamp((pf-i0)/0.45,0,1),fr=fr0*fr0*(3-2*fr0),A=ctr(path[i0]),B=ctr(path[Math.min(path.length-1,i0+1)]),c=[A[0]+(B[0]-A[0])*fr,A[1]+(B[1]-A[1])*fr],i=pf-i0>1e-9?Math.min(path.length-1,i0+1):i0;
    ag.setAttribute('cx',c[0]);ag.setAttribute('cy',c[1]);gt.setAttribute('opacity',i===path.length-1&&fr>0.6?0:1);
    tr.setAttribute('d',path.slice(0,i0+1).map((q,k)=>(k?'L':'M')+ctr(q).join(' ')).join('')+'L'+c.join(' '));
    if(i===0){res.innerHTML='L\'agente parte in basso a sinistra. Non sa dove sia il traguardo: lo scopre solo dalle ricompense.';return}
    const a=path[i-1],b=path[i],act=b[0]>a[0]?'destra':b[1]<a[1]?'su':'giù',rw=i===path.length-1?1:0;
    res.innerHTML=`Passo ${i}: ${K(`\\langle x,a,x',r\\rangle=\\langle`)} ${nm(a)}, ${act}, ${nm(b)}, <b style="color:${rw?C.green:'#fff'}">${rw}</b> ${K('\\rangle')}<br>`+
      (rw?'<span class="ok">Ricompensa.</span> Dai dati raccolti così si impara quale azione conviene in ogni casella.':'Nessuna ricompensa: il dato dice solo che cosa è successo, non che cosa era giusto fare.')}
  player(st,path.length-1,0.5,draw);
};

/* errore riducibile e irriducibile */
FIG.errsplit=function(st){
  const f=x=>1.1+1.3*Math.sin(2.4*x)+0.5*x,r=rng(14),N=22,xs=[],zs=[];for(let i=0;i<N;i++){xs.push((i+.15+.7*r())/N*3);zs.push(r.n())}
  let sg=0.35,x0=2.2;
  slider(st,'Rumore '+K('\\Sg'),0,0.8,0.05,sg,v=>nf(v,2),v=>{sg=v;draw()});
  legend(st,[['#fff','vera '+K('\\Ff'),'','height:2px'],[C.yellow,'stima '+K('\\Fh')],[C.pink,'parte riducibile'],[C.purple,'rumore '+K('\\Eps')]]);
  const p=Plot(st,{W:600,H:360,m:[40,10,12,42],xr:[0,3],yr:[-0.4,4.2],label:'Dati, funzione vera e stima lineare'});p.axes([0,1,2,3],[0,1,2,3,4],'x','y');
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const ys=xs.map((x,i)=>f(x)+sg*zs[i]),w=lstsq(xs.map(x=>[1,x]),ys),fh=x=>w[0]+w[1]*x;
    xs.forEach((x,i)=>S('line',{x1:p.sx(x),x2:p.sx(x),y1:p.sy(f(x)),y2:p.sy(ys[i]),stroke:C.purple,'stroke-width':2},g));
    S('path',{d:p.curve(f,0,3),fill:'none',stroke:'#fff','stroke-width':1.8,'stroke-dasharray':'6 4'},g);
    S('line',{x1:p.sx(0),y1:p.sy(fh(0)),x2:p.sx(3),y2:p.sy(fh(3)),stroke:C.yellow,'stroke-width':2.5},g);
    xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:4,fill:C.green},g));
    S('line',{x1:p.sx(x0),x2:p.sx(x0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555','stroke-dasharray':'3 4'},g);
    S('line',{x1:p.sx(x0),x2:p.sx(x0),y1:p.sy(f(x0)),y2:p.sy(fh(x0)),stroke:C.pink,'stroke-width':5},g);
    S('circle',{cx:p.sx(x0),cy:p.sy(f(x0)),r:5,fill:'#fff'},g);S('circle',{cx:p.sx(x0),cy:p.sy(fh(x0)),r:5,fill:C.yellow},g);
    const red=(f(x0)-fh(x0))**2;
    res.innerHTML=`In ${K('\\Xs='+kn(x0,1))}: parte riducibile ${K('[\\Ff-\\Fh]^2='+kn(red,3))}, parte irriducibile ${K('\\mathrm{Var}(\\Eps)='+kn(sg*sg,3))}.<br>`+
      (sg===0?'Senza rumore i dati stanno sulla curva vera, ma la retta sbaglia comunque: resta solo la parte riducibile.':'Trascina la linea verticale: la parte rosa cambia da punto a punto, quella viola no.')}
  drag(p,p.svg,x=>{x0=Math.round(clamp(x,0.05,2.95)*20)/20;draw()});draw();
};

/* piano contro superficie flessibile */
FIG.surf2=function(st){
  const r=rng(6),D=[];const tru=(e,s)=>20+28/(1+Math.exp(-(e-14)/1.6))+0.18*s+5*Math.sin(s/28);
  for(let i=0;i<26;i++){const e=10+12*r(),s=20+160*r();D.push([e,s,tru(e,s)+3*r.n()])}
  const wl=lstsq(D.map(d=>[1,d[0],d[1]]),D.map(d=>d[2])),lin=(e,s)=>wl[0]+wl[1]*e+wl[2]*s;
  const cen=[];for(let a=0;a<4;a++)for(let b=0;b<3;b++)cen.push([10+a*4,20+b*80]);
  const ph=(e,s)=>[1,e,s].concat(cen.map(c=>Math.exp(-(((e-c[0])/3.2)**2)-(((s-c[1])/60)**2))));
  const wf=lstsq(D.map(d=>ph(d[0],d[1])),D.map(d=>d[2])),flex=(e,s)=>{const v=ph(e,s);let t=0;for(let j=0;j<v.length;j++)t+=wf[j]*v[j];return t};
  const duo=H('div',{class:'duo'},st);
  [[lin,'Modello lineare: un piano'],[flex,'Modello più flessibile']].forEach(a=>{const d=H('div',null,duo),svg=Svg(d,420,330,a[1]),g=S('g',null,svg);
    const P0=proj3(-0.62,0.42,205,168,1,[0,0,0]),P=q=>P0([(q[0]-16)*21,(q[1]-100)*1.55,(q[2]-55)*2.7]);
    wire(g,P,a[0],[10,22],[20,180],8,C.yellow,.6);
    D.forEach(q=>{const u=P(q),v=P([q[0],q[1],a[0](q[0],q[1])]);S('line',{x1:u[0],y1:u[1],x2:v[0],y2:v[1],stroke:C.pink,'stroke-width':1.5},g);S('circle',{cx:u[0],cy:u[1],r:3.5,fill:C.green},g)});
    const T=(t,q,an)=>{const u=P(q),e=S('text',{x:u[0],y:u[1],'text-anchor':an},g);e.textContent=t};
    T('anni di istruzione',[16,20,18],'middle');T('anzianità',[23,110,22],'start');{const e=S('text',{x:8,y:22,'text-anchor':'start'},g);e.textContent='reddito'}
    const m=D.reduce((s,q)=>s+(q[2]-a[0](q[0],q[1]))**2,0)/D.length;cap(d,`<b>${a[1]}</b><br>errore quadratico medio sul training ${nf(m,1)}`)});
};

/* tre classificatori sugli stessi dati */
FIG.tript=function(st){
  const KNN=M.KNN,E=KNN.errors(),G=KNN.regions(),tri=H('div',{class:'trio'},st);
  [[1,'Troppo sensibile','insegue ogni singolo punto'],[15,'Equilibrato','coglie la forma, ignora il rumore'],[199,'Troppo rigido','non coglie la forma dei dati']].forEach(a=>{const k=a[0],ki=KNN.KS.indexOf(k),d=H('div',null,tri);
    const p=Plot(d,{W:230,H:166,m:[0,0,0,0],xr:KNN.XR,yr:KNN.YR,label:a[1]});
    const cv=document.createElement('canvas');cv.width=KNN.NX;cv.height=KNN.NY;const c=cv.getContext('2d'),im=c.createImageData(KNN.NX,KNN.NY);
    for(let i=0;i<G.length;i++){const one=G[i][k-1]*2>k;im.data[4*i]=one?88:255;im.data[4*i+1]=one?196:134;im.data[4*i+2]=one?221:47;im.data[4*i+3]=95}
    c.putImageData(im,0,0);p.image(cv);
    KNN.train.forEach(t=>S('circle',{cx:p.sx(t[0]),cy:p.sy(t[1]),r:2,fill:t[2]?C.blue:C.orange},p.g));
    S('rect',{x:.5,y:.5,width:229,height:165,fill:'none',stroke:'#333'},p.top);
    cap(d,`<b>${a[1]}</b><br>${a[2]}<br>training ${nf(E.tr[ki]*100,0)}% · test <span style="color:${C.red}">${nf(E.te[ki]*100,0)}%</span>`)});
};

/* scegliere k con il validation set */
FIG.valbars=function(st){
  const KNN=M.KNN,KS=[1,3,7,15,31,65,135];let seed=1;
  H('div',{class:'split',role:'img','aria-label':'160 punti di training, 40 di validazione, e a parte i punti di test',style:'max-width:36rem'},st,
    '<div style="flex:160;background:#c9c9c9">160 punti: training</div><div style="flex:40;background:#FF862F">40: validazione</div><div style="flex:60;background:#FC6255;margin-left:.6rem">test</div>');
  btn(st,'Rimescola',()=>{seed++;draw()});
  const p=Plot(st,{W:600,H:320,m:[48,26,14,48],xr:[-0.7,8.7],yr:[0,30],label:'Punti di validazione sbagliati per ogni valore di k, ed errore di test del valore scelto'});
  const g=S('g',null,p.g),res=out(st);
  p.axes([0,1,2,3,4,5,6],[0,10,20,30],null,null,v=>'k = '+KS[v],v=>v+'%');
  S('text',{x:p.ax+6,y:p.ay-10,class:'tag'},p.axg).textContent='punti classificati male';
  S('line',{x1:p.sx(7),x2:p.sx(7),y1:p.ay,y2:p.ay+p.ah,stroke:'#444','stroke-dasharray':'3 5'},p.axg);
  S('text',{x:p.sx(8),y:p.ay+p.ah+18,'text-anchor':'middle'},p.axg).textContent='sul test';
  function draw(){g.textContent='';const r=rng(seed*17),idx=KNN.train.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
    const va=idx.slice(0,40).map(i=>KNN.train[i]),tr=idx.slice(40).map(i=>KNN.train[i]);
    const wrong=(set,k)=>{let e=0;set.forEach(q=>{const d=tr.map(t=>[(t[0]-q[0])**2+(t[1]-q[1])**2,t[2]]).sort((a,b)=>a[0]-b[0]);let s=0;for(let i=0;i<k;i++)s+=d[i][1];if((s*2>k?1:0)!==q[2])e++});return e};
    const ev=KS.map(k=>wrong(va,k));let b=0;ev.forEach((v,i)=>{if(v<ev[b])b=i});const te=wrong(KNN.test,KS[b])/KNN.test.length*100;
    const bar=(x,v,c,op,lab,bold)=>{S('rect',{x:p.sx(x)-22,y:p.sy(v),width:44,height:Math.max(1,p.sy(0)-p.sy(v)),fill:c,opacity:op},g);const t=S('text',{x:p.sx(x),y:p.sy(v)-7,'text-anchor':'middle',style:`fill:${bold?'#fff':'#9a9a9a'}`},g);t.textContent=lab};
    ev.forEach((v,i)=>bar(i,v/40*100,C.orange,i===b?1:.4,nf(v/40*100,1).replace(',0','')+'%',i===b));
    const t=S('text',{x:p.sx(b),y:p.sy(ev[b]/40*100)-26,'text-anchor':'middle',style:'fill:#fff;font-size:15px'},g);t.textContent='scelto';
    bar(8,te,C.red,1,nf(te,1).replace(',0','')+'%',true);
    res.innerHTML=`Vince ${K('\\Kk='+KS[b])}: sbaglia ${ev[b]} punti di validazione su 40, cioè il ${nf(ev[b]/40*100,1)}%.<br>Messo alla prova sui 500 punti di test, sbaglia il <span style="color:${C.red}">${nf(te,1)}%</span>.`}
  draw();
};

/* la scala delle features decide chi è vicino */
FIG.scale=function(st){
  const r=rng(23),P=[];for(let i=0;i<16;i++)P.push([22+46*r(),20+120*r()]);let q=[45,80];
  const sd=a=>{const m=a.reduce((s,v)=>s+v,0)/a.length;return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length)},sa=sd(P.map(d=>d[0])),sr=sd(P.map(d=>d[1]*1000));
  legend(st,[[C.red,'più vicino con le unità originali'],[C.green,'più vicino dopo la normalizzazione']]);
  const p=Plot(st,{W:600,H:360,m:[52,10,14,44],xr:[18,72],yr:[10,150],label:'Persone per età e stipendio, con il punto più vicino secondo due distanze'});
  p.axes([20,30,40,50,60,70],[20,60,100,140],'età (anni)','stipendio (migliaia)');
  const g=S('g',null,p.g),hd=S('circle',{r:9,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top),res=out(st);
  function draw(){g.textContent='';let a=0,b=0,da=1e99,db=1e99;P.forEach((d,i)=>{const u=(d[0]-q[0])**2+((d[1]-q[1])*1000)**2,v=((d[0]-q[0])/sa)**2+((d[1]-q[1])*1000/sr)**2;if(u<da){da=u;a=i}if(v<db){db=v;b=i}});
    S('line',{x1:p.sx(q[0]),y1:p.sy(q[1]),x2:p.sx(P[a][0]),y2:p.sy(P[a][1]),stroke:C.red,'stroke-width':2.5},g);
    S('line',{x1:p.sx(q[0]),y1:p.sy(q[1]),x2:p.sx(P[b][0]),y2:p.sy(P[b][1]),stroke:C.green,'stroke-width':2.5,'stroke-dasharray':a===b?'5 5':''},g);
    P.forEach((d,i)=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:5.5,fill:C.blue,stroke:i===a?C.red:i===b?C.green:'#000','stroke-width':i===a||i===b?3:1},g));
    hd.setAttribute('cx',p.sx(q[0]));hd.setAttribute('cy',p.sy(q[1]));
    res.innerHTML=`Con lo stipendio in euro e l'età in anni, un anno di differenza pesa quanto un euro: il vicino <span style="color:${C.red}">rosso</span> è semplicemente quello con lo stipendio più simile (${nf(Math.abs(P[a][1]-q[1]),1)} mila euro di distanza, ${nf(Math.abs(P[a][0]-q[0]),0)} anni).<br>`+
      (a===b?'Qui le due distanze sono d\'accordo.':`Normalizzando le due features, il più vicino diventa il <span style="color:${C.green}">verde</span>.`)}
  drag(p,p.svg,(x,y)=>{q=[Math.round(clamp(x,20,70)),Math.round(clamp(y,15,145))];draw()});
  (function(){for(let x=30;x<=60;x+=1)for(let y=40;y<=120;y+=2){let a=0,b=0,da=1e99,db=1e99;P.forEach((d,i)=>{const u=(d[0]-x)**2+((d[1]-y)*1000)**2,v=((d[0]-x)/sa)**2+((d[1]-y)*1000/sr)**2;if(u<da){da=u;a=i}if(v<db){db=v;b=i}});if(a!==b&&Math.abs(P[a][0]-x)>12){q=[x,y];return}}})();
  draw();
};

/* ================= LEZIONE 2 ================= */
FIG.losses=function(st){
  const hub=e=>{const d=1.345,a=Math.abs(e);return a<=d?e*e/2:d*a-d*d/2},tuk=e=>{const c=4.685,a=Math.abs(e);return a>=c?c*c/6:c*c/6*(1-Math.pow(1-(a/c)**2,3))};
  const F=[[e=>e*e,C.pink,'quadrato'],[e=>Math.abs(e),C.teal,'valore assoluto'],[hub,C.orange,'Huber'],[tuk,C.blue,'Tukey']];let e0=3;
  legend(st,F.map(f=>[f[1],f[2]]));
  const p=Plot(st,{W:600,H:340,m:[40,10,12,42],xr:[-6,6],yr:[0,6.5],label:'Quattro funzioni di costo in funzione dell\'errore'});p.axes([-6,-4,-2,0,2,4,6],[0,2,4,6],'errore e','costo');
  F.forEach(f=>S('path',{d:p.curve(f[0],-6,6,400),fill:'none',stroke:f[1],'stroke-width':2.3},p.g));
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';S('line',{x1:p.sx(e0),x2:p.sx(e0),y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-dasharray':'3 4'},g);
    F.forEach(f=>S('circle',{cx:p.sx(e0),cy:p.sy(f[0](e0)),r:5,fill:f[1]},g));
    res.innerHTML=`Un errore di ${K('e='+kn(e0,1))} costa `+F.map(f=>`<span style="color:${f[1]}">${nf(f[0](e0),2)}</span>`).join(' · ')+'.<br>Vicino a zero quadrato, Huber e Tukey quasi coincidono; lontano da zero il quadrato esplode, Huber cresce in linea retta, Tukey smette di crescere.'}
  drag(p,p.svg,x=>{e0=Math.round(clamp(x,-5.9,5.9)*10)/10;draw()});draw();
};

FIG.minima3=function(st){
  const tri=H('div',{class:'trio'},st);
  [[x=>0.5*x*x+0.4,'Un solo minimo globale'],[x=>Math.abs(x)<1.2?0.5:0.5+1.3*(Math.abs(x)-1.2)**1.5,'Infiniti minimi globali'],[x=>0.32*x*x+1.5*Math.sin(2.6*x)+0.9+0.5,'Minimi locali e un minimo globale']].forEach((a,k)=>{const d=H('div',null,tri),f=a[0];
    const p=Plot(d,{W:230,H:170,m:[8,8,8,8],xr:[-3.1,3.1],yr:[-1.4,4.6],label:a[1]});
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
    S('path',{d:p.curve(f,-3.1,3.1,300),fill:'none',stroke:C.pink,'stroke-width':2.3},p.g);
    if(k===1)S('line',{x1:p.sx(-1.2),x2:p.sx(1.2),y1:p.sy(.5),y2:p.sy(.5),stroke:'#fff','stroke-width':4},p.g);
    else{const ms=[];for(let i=1;i<620;i++){const x=-3.1+i*.01;if(f(x)<f(x-.01)&&f(x)<=f(x+.01))ms.push(x)}let gm=ms[0];ms.forEach(x=>{if(f(x)<f(gm))gm=x});
      ms.forEach(x=>S('circle',{cx:p.sx(x),cy:p.sy(f(x)),r:x===gm?5.5:4,fill:x===gm?'#fff':'none',stroke:'#fff','stroke-width':1.8},p.g))}
    cap(d,'<b>'+a[1]+'</b>'+(k===2?'<br>pieno: globale · vuoto: locale':''))});
};

FIG.tangent=function(st){
  const f=x=>0.35*x*x+0.25*Math.exp(0.7*x),df=x=>0.7*x+0.175*Math.exp(0.7*x);let x0=-1.4;
  const p=Plot(st,{W:600,H:320,m:[12,10,12,12],xr:[-3.2,3.2],yr:[-1.2,5],label:'Funzione convessa con la tangente in un punto'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
  S('path',{d:p.curve(f,-3.2,3.2,300),fill:'none',stroke:C.pink,'stroke-width':2.5},p.g);
  const ln=S('line',{stroke:C.teal,'stroke-width':2.5},p.g),hd=S('circle',{r:8,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top),res=out(st);res.style.minHeight='1.7em';
  function draw(){const y=f(x0),m=df(x0);ln.setAttribute('x1',p.sx(-3.2));ln.setAttribute('y1',p.sy(y+m*(-3.2-x0)));ln.setAttribute('x2',p.sx(3.2));ln.setAttribute('y2',p.sy(y+m*(3.2-x0)));
    hd.setAttribute('cx',p.sx(x0));hd.setAttribute('cy',p.sy(y));res.innerHTML=`Pendenza della tangente ${nf(m,2)}. Ovunque la sposti, la tangente tocca il grafico in un punto e per il resto gli sta sotto.`}
  drag(p,p.svg,x=>{x0=Math.round(clamp(x,-3,3)*20)/20;draw()});draw();
};

FIG.stat3=function(st){
  const tri=H('div',{class:'trio'},st);
  [[(x,y)=>x*x+y*y,'Minimo locale'],[(x,y)=>2-x*x-y*y,'Massimo locale'],[(x,y)=>1+x*x-y*y,'Punto di sella']].forEach((a,k)=>{const d=H('div',null,tri),svg=Svg(d,230,180,a[1]),g=S('g',null,svg);
    const P=proj3(-0.7,0.5,115,k===1?104:k===0?132:96,52,[0,0,k===2?1:k===1?2:0]);wire(g,P,a[0],[-1,1],[-1,1],7,C.blue,.7);
    const c=P([0,0,a[0](0,0)]);S('circle',{cx:c[0],cy:c[1],r:5,fill:C.pink,stroke:'#000'},g);cap(d,'<b>'+a[1]+'</b>')});
};

FIG.gridpts=function(st){
  const tri=H('div',{class:'trio'},st);
  [1,2,3].forEach(dm=>{const d=H('div',null,tri),svg=Svg(d,230,180,'Griglia in '+dm+' dimensioni');
    if(dm===1)for(let i=0;i<10;i++)S('circle',{cx:25+i*20,cy:90,r:4,fill:C.pink},svg);
    if(dm===2)for(let i=0;i<10;i++)for(let j=0;j<10;j++)S('circle',{cx:43+i*16,cy:18+j*16,r:3,fill:C.pink},svg);
    if(dm===3){const P=proj3(-0.5,0.45,115,92,13.5,[4.5,4.5,4.5]);const pts=[];for(let i=0;i<10;i++)for(let j=0;j<10;j++)for(let k=0;k<10;k++)pts.push([i,j,k]);
      pts.sort((a,b)=>(a[1]*Math.cos(.5)+a[0]*Math.sin(.5))-(b[1]*Math.cos(.5)+b[0]*Math.sin(.5))).reverse().forEach(q=>{const u=P(q);S('circle',{cx:u[0],cy:u[1],r:1.7,fill:C.pink,opacity:.75},svg)})}
    cap(d,`<b>${dm} parametr${dm===1?'o':'i'}</b><br>${big(Math.pow(10,dm))} valutazioni`)});
};

/* direzioni di discesa */
FIG.descdir=function(st){
  const w0=[1.7,1.0],gr=[2*w0[0],4*w0[1]],gn=Math.hypot(gr[0],gr[1]);let th=3.5;
  legend(st,[[C.teal,'gradiente'],[C.yellow,'direzione scelta'],['rgba(131,193,103,.5)','direzioni di discesa','dot']]);
  const p=Plot(st,{W:600,H:400,m:[10,10,10,10],xr:[-1.2,4.2],yr:[-0.9,2.7],label:'Curve di livello, gradiente e direzione scelta'}),u=p.aw/5.4;
  for(let i=1;i<=12;i++){const c=0.5*i*i;S('ellipse',{cx:p.sx(0),cy:p.sy(0),rx:Math.sqrt(c)*u,ry:Math.sqrt(c/2)*u,fill:'none',stroke:C.blue,opacity:.4},p.g)}
  S('circle',{cx:p.sx(0),cy:p.sy(0),r:3.5,fill:C.pink},p.g);
  const cx=p.sx(w0[0]),cy=p.sy(w0[1]),R=120,ga=Math.atan2(-gr[1],gr[0]);
  S('path',{d:`M${cx+R*Math.cos(ga+Math.PI/2)} ${cy+R*Math.sin(ga+Math.PI/2)}A${R} ${R} 0 0 1 ${cx+R*Math.cos(ga-Math.PI/2)} ${cy+R*Math.sin(ga-Math.PI/2)}Z`,fill:'rgba(131,193,103,.2)'},p.g);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const ux=Math.cos(th),uy=Math.sin(th),dot=ux*gr[0]+uy*gr[1];
    arrow(g,cx,cy,cx+95*gr[0]/gn,cy-95*gr[1]/gn,C.teal,3);arrow(g,cx,cy,cx+105*ux,cy-105*uy,C.yellow,3);S('circle',{cx,cy,r:5,fill:'#fff'},g);
    S('circle',{cx:cx+105*ux,cy:cy-105*uy,r:9,fill:C.yellow,opacity:.25,class:'hd'},g);
    res.innerHTML=`Angolo con il gradiente: <b>${Math.round(Math.acos(clamp(dot/gn,-1,1))*180/Math.PI)}°</b>. `+(dot<-1e-6?'<span class="ok">Più di 90°: direzione di discesa.</span> Un passo abbastanza piccolo porta su una curva di livello più bassa.':'<span class="ko">Non più di 90°: da questa parte il costo non scende.</span>')+
      (Math.abs(dot+gn)<0.06?'<br>È esattamente l\'opposto del gradiente: la discesa più ripida.':'<br>Tutte le direzioni nella metà verde vanno bene; la più ripida è l\'opposto del gradiente.')}
  drag(p,p.svg,(x,y)=>{th=Math.atan2(y-w0[1],x-w0[0]);draw()});draw();
};

/* il punto di partenza conta */
FIG.init=function(st){
  const f=x=>0.32*x*x+1.5*Math.sin(2.6*x)+1.4,df=x=>0.64*x+3.9*Math.cos(2.6*x);let x0=2.6;
  const p=Plot(st,{W:600,H:330,m:[12,10,12,12],xr:[-3.2,3.2],yr:[-1.0,5.4],label:'Funzione non convessa e percorso del gradient descent'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
  S('path',{d:p.curve(f,-3.2,3.2,400),fill:'none',stroke:C.pink,'stroke-width':2.5},p.g);
  let gm=0;for(let i=0;i<640;i++){const x=-3.2+i*.01;if(f(x)<f(gm))gm=x}
  const g=S('g',null,p.g),hd=S('circle',{r:8,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},p.top),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';let x=x0;const pts=[x];for(let t=0;t<300;t++){x-=0.04*df(x);if(t<40)pts.push(x)}
    S('path',{d:p.poly(pts.map(v=>[v,f(v)])),fill:'none',stroke:'#fff','stroke-width':1,opacity:.7},g);pts.forEach(v=>S('circle',{cx:p.sx(v),cy:p.sy(f(v)),r:3.2,fill:C.yellow},g));
    S('circle',{cx:p.sx(x),cy:p.sy(f(x)),r:6,fill:'none',stroke:C.yellow,'stroke-width':2.5},g);hd.setAttribute('cx',p.sx(x0));hd.setAttribute('cy',p.sy(f(x0)));
    const glob=Math.abs(x-gm)<0.05;res.innerHTML=`Partendo da ${K('\\Ws_0='+kn(x0,2))} si arriva in ${K('\\Ws='+kn(x,2))}, dove il costo vale ${nf(f(x),2)}.<br>`+(glob?'<span class="ok">È il minimo globale.</span>':'<span class="ko">È un minimo locale</span>: il minimo globale è altrove, ma da qui la pendenza non lo fa vedere.')}
  drag(p,p.svg,x=>{x0=Math.round(clamp(x,-3.1,3.1)*20)/20;draw()});draw();
};

FIG.sched=function(st){
  const F=[[t=>0.5,'#fff','costante'],[t=>0.5/Math.sqrt(t),C.orange,K('c/\\sqrt{t}')],[t=>0.5/t,C.blue,K('c/t')],[t=>0.5*Math.pow(0.8,Math.floor((t-1)/10)),C.yellow,'step decay ('+K('\\gamma=0{,}8')+', ogni 10 passi)']];
  legend(st,F.map(f=>[f[1],f[2]]));
  const p=Plot(st,{W:600,H:300,m:[44,10,12,42],xr:[1,60],yr:[0,0.56],label:'Step size nel tempo secondo quattro regole'});p.axes([1,10,20,30,40,50,60],[0,0.1,0.2,0.3,0.4,0.5],'passo t','step size');
  F.forEach((f,k)=>{const pts=[];for(let t=1;t<=60;t++){pts.push([t,f[0](t)]);if(k===3&&t<60)pts.push([t+1,f[0](t)])}S('path',{d:p.poly(pts),fill:'none',stroke:f[1],'stroke-width':2.3},p.g)});
};

/* normalizzare le features cambia la forma della valle */
FIG.normfeat=function(st){
  const r=rng(77),N=60,X=[];for(let i=0;i<N;i++){X.push([r.n(),4*r.n()])}const y=X.map(x=>1.5*x[0]+0.4*x[1]+0.3*r.n());
  const duo=H('div',{class:'duo'},st);
  [[1,1,'Features su scale diverse'],[1,4,'Features normalizzate']].forEach(a=>{const Z=X.map(x=>[x[0]/a[0],x[1]/a[1]]);
    let A=0,B=0,Cc=0,d1=0,d2=0;Z.forEach((z,i)=>{A+=z[0]*z[0];B+=z[0]*z[1];Cc+=z[1]*z[1];d1+=z[0]*y[i];d2+=z[1]*y[i]});A/=N;B/=N;Cc/=N;d1/=N;d2/=N;
    const det=A*Cc-B*B,ws=[(Cc*d1-B*d2)/det,(A*d2-B*d1)/det],L=(u,v)=>{const a1=u-ws[0],a2=v-ws[1];return A*a1*a1+2*B*a1*a2+Cc*a2*a2};
    const tr=A+Cc,l1=tr/2+Math.sqrt(tr*tr/4-det),l2=tr/2-Math.sqrt(tr*tr/4-det),eta=0.9/(2*l1)*1;
    const d=H('div',null,duo),p=Plot(d,{W:420,H:330,m:[8,8,8,8],xr:[ws[0]-2.2,ws[0]+2.2],yr:[ws[1]-1.7,ws[1]+1.7],label:a[2]});
    heat(p,L,L(ws[0]+2.2,ws[1]+1.7)*1.1,150);
    let w=[ws[0]-1.8,ws[1]+1.4];const pts=[w.slice()];for(let t=0;t<25;t++){const g1=2*(A*(w[0]-ws[0])+B*(w[1]-ws[1])),g2=2*(B*(w[0]-ws[0])+Cc*(w[1]-ws[1]));w=[w[0]-eta*g1,w[1]-eta*g2];pts.push(w.slice())}
    S('path',{d:p.poly(pts),fill:'none',stroke:'#fff','stroke-width':1.3},p.g);pts.forEach(q=>S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:3,fill:C.yellow},p.g));
    S('path',{d:`M${p.sx(ws[0])-6} ${p.sy(ws[1])}h12M${p.sx(ws[0])} ${p.sy(ws[1])-6}v12`,stroke:'#fff','stroke-width':2},p.g);
    cap(d,`<b>${a[2]}</b><br>${K('\\kappa\\approx'+kn(l1/l2,1))} · dopo 25 passi il costo in eccesso è ${L(w[0],w[1])<1e-4?'praticamente zero':nf(L(w[0],w[1]),3)}`)});
};

/* gradienti dei singoli esempi, media di un batch, gradiente vero */
FIG.gradarrows=function(st){
  const r0=rng(21),N=64,X=[],Y=[];for(let i=0;i<N;i++){const x=r0.n();X.push(x);Y.push(1+2*x+0.9*r0.n())}
  const w=[-0.4,3.2],G=X.map((x,i)=>{const e=w[0]+w[1]*x-Y[i];return [2*e,2*e*x]}),full=[G.reduce((s,q)=>s+q[0],0)/N,G.reduce((s,q)=>s+q[1],0)/N];
  const BS=[1,2,4,8,16,64];let bi=0,seed=1;
  slider(st,'Dimensione del batch '+K('B'),0,5,1,bi,v=>BS[v],v=>{bi=v;draw()});btn(st,'Estrai altri batch',()=>{seed++;draw()});
  legend(st,[['#777','gradiente di un singolo esempio'],[C.yellow,'media su un batch','dot'],[C.teal,'gradiente completo']]);
  const p=Plot(st,{W:600,H:380,m:[10,10,10,10],xr:[-9,5],yr:[-3.2,5.67],label:'Vettori gradiente dei singoli esempi e loro medie'});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#333'},p.bg);
  G.forEach(q=>S('line',{x1:p.sx(0),y1:p.sy(0),x2:p.sx(clamp(q[0],-20,20)),y2:p.sy(clamp(q[1],-20,20)),stroke:'#777','stroke-width':1,opacity:.7},p.g));
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const B=BS[bi],r=rng(seed*31+bi);let sd=0;const M2=60;
    for(let k=0;k<M2;k++){let a=0,b=0;const idx=X.map((_,i)=>i);for(let j=0;j<B;j++){const t=j+Math.floor(r()*(N-j));[idx[j],idx[t]]=[idx[t],idx[j]];a+=G[idx[j]][0];b+=G[idx[j]][1]}a/=B;b/=B;sd+=(a-full[0])**2+(b-full[1])**2;
      S('circle',{cx:p.sx(clamp(a,-20,20)),cy:p.sy(clamp(b,-20,20)),r:4,fill:C.yellow,opacity:.75},g)}
    arrow(g,p.sx(0),p.sy(0),p.sx(full[0]),p.sy(full[1]),C.teal,3.5);
    res.innerHTML=`60 batch da ${B} esempi${B===1?'o':''}: i punti gialli sono le loro medie. Distanza quadratica media dal gradiente completo: ${nf(sd/M2,2)}.<br>`+(B===N?'Con '+K('B=N')+' ogni batch è l\'intero dataset: nessun rumore.':'Si sparpagliano attorno alla punta della freccia: in media ci cadono sopra, e più il batch è grande più le stanno vicine.')}
  draw();
};

FIG.hinge=function(st){
  const p=Plot(st,{W:600,H:260,m:[40,10,12,42],xr:[-2,3],yr:[0,3.2],label:'Hinge loss in funzione del prodotto y per y cappello'});p.axes([-2,-1,0,1,2,3],[0,1,2,3],'y · ŷ','hinge loss');
  S('path',{d:p.poly([[-2,3],[1,0],[3,0]]),fill:'none',stroke:C.pink,'stroke-width':2.5},p.g);
  S('circle',{cx:p.sx(1),cy:p.sy(0),r:6,fill:'#fff'},p.g);const t=S('text',{x:p.sx(1)+8,y:p.sy(0)-14,class:'tag'},p.g);t.textContent='spigolo';
};

/* projected gradient descent */
FIG.pgd=function(st){
  const c=[2.4,1.5],R=1.5,L=w=>(w[0]-c[0])**2+2*(w[1]-c[1])**2,eta=0.22,pr=w=>{const n=Math.hypot(w[0],w[1]);return n<=R?w:[w[0]*R/n,w[1]*R/n]};
  const fr=[[-1.1,-0.6]];let w=fr[0];for(let t=0;t<5;t++){const v=[w[0]-eta*2*(w[0]-c[0]),w[1]-eta*4*(w[1]-c[1])];fr.push(v);w=pr(v);fr.push(w)}
  legend(st,[[C.yellow,'passo di discesa'],['#fff','proiezione su '+K('C')],[C.pink,'minimo senza vincoli','dot']]);
  const p=Plot(st,{W:600,H:400,m:[10,10,10,10],xr:[-2.6,3.9],yr:[-1.9,2.43],label:'Percorso del projected gradient descent'}),u=p.aw/6.5;
  for(let i=1;i<=12;i++){const k=0.3*i*i;S('ellipse',{cx:p.sx(c[0]),cy:p.sy(c[1]),rx:Math.sqrt(k)*u,ry:Math.sqrt(k/2)*u,fill:'none',stroke:C.blue,opacity:.35},p.g)}
  S('circle',{cx:p.sx(0),cy:p.sy(0),r:R*u,fill:'rgba(109,185,244,.2)',stroke:C.blue,'stroke-width':1.5},p.g);S('circle',{cx:p.sx(c[0]),cy:p.sy(c[1]),r:4.5,fill:C.pink},p.g);
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(pf){g.textContent='';const i0=Math.min(fr.length-1,Math.floor(pf)),f0=clamp((pf-i0)/0.5,0,1),ff=f0*f0*(3-2*f0),i=pf-i0>1e-9?Math.min(fr.length-1,i0+1):i0,cur=i>i0?[fr[i0][0]+(fr[i][0]-fr[i0][0])*ff,fr[i0][1]+(fr[i][1]-fr[i0][1])*ff]:fr[i0];
    for(let k=1;k<=i;k++){const a=fr[k-1],b=k===i&&i>i0?cur:fr[k],st2=k%2===1;S('line',{x1:p.sx(a[0]),y1:p.sy(a[1]),x2:p.sx(b[0]),y2:p.sy(b[1]),stroke:st2?C.yellow:'#fff','stroke-width':st2?2:1.5,'stroke-dasharray':st2?'':'4 3'},g)}
    for(let k=0;k<=i0;k++)S('circle',{cx:p.sx(fr[k][0]),cy:p.sy(fr[k][1]),r:3.2,fill:k%2?'#000':C.yellow,stroke:C.yellow,'stroke-width':1.5},g);S('circle',{cx:p.sx(cur[0]),cy:p.sy(cur[1]),r:6,fill:C.yellow,stroke:'#000','stroke-width':1.5},g);
    const out2=Math.hypot(fr[i][0],fr[i][1])>R+1e-9;res.innerHTML=i===0?'Si parte da un punto ammissibile.':i%2?`Passo ${(i+1)/2}: discesa lungo l'opposto del gradiente. `+(out2?'<span class="ko">Il punto è uscito dall\'insieme.</span>':'Il punto è ancora dentro.'):`Passo ${i/2}: proiezione. `+(i>=8?'<span class="ok">Il percorso si è fermato sul bordo, nel punto ammissibile con il costo più basso.</span>':'Si rientra nel punto dell\'insieme più vicino.')}
  player(st,fr.length-1,0.7,draw);
};

/* penalità: all'aumentare di rho ci si avvicina all'ottimo vincolato */
FIG.penalty=function(st){
  let lr=0;const L=w=>(w-3)*(w-3),P=w=>{const d=Math.max(0,Math.abs(w)-1);return d*d};
  slider(st,'Severità '+K('\\rho'),-1,2.5,0.05,lr,v=>nf(Math.pow(10,v),v<1?2:0),v=>{lr=v;draw()});
  legend(st,[[C.pink,K('\\cL(\\Ws)')],['#fff',K('\\cL(\\Ws)+\\rho P(\\Ws)')],['rgba(109,185,244,.5)','insieme ammissibile '+K('C=[-1,1]'),'dot']]);
  const p=Plot(st,{W:600,H:330,m:[40,10,12,42],xr:[-2,4.5],yr:[0,14],label:'Costo originale e costo penalizzato'});p.axes([-2,-1,0,1,2,3,4],[0,4,8,12],'w','costo');
  S('rect',{x:p.sx(-1),y:p.ay,width:p.sx(1)-p.sx(-1),height:p.ah,fill:'rgba(109,185,244,.18)'},p.g);
  S('path',{d:p.curve(L,-2,4.5),fill:'none',stroke:C.pink,'stroke-width':2.2},p.g);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const rho=Math.pow(10,lr),J=w=>L(w)+rho*P(w),ws=(3+rho)/(1+rho);
    S('path',{d:p.curve(J,-2,4.5,400),fill:'none',stroke:'#fff','stroke-width':2.2},g);S('circle',{cx:p.sx(ws),cy:p.sy(J(ws)),r:6,fill:C.yellow},g);
    S('circle',{cx:p.sx(1),cy:p.sy(L(1)),r:6,fill:'none',stroke:C.yellow,'stroke-width':2},g);
    res.innerHTML=`Il minimo del problema penalizzato è in ${K('\\Ws='+kn(ws,3))}; l'ottimo vincolato (cerchio vuoto) è in ${K('\\Ws=1')}.<br>La violazione vale ${nf(ws-1,3)}: più la multa è severa, più si restringe.`}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,polyFit,mse,Svg,proj3,wire,heat,arrow,cap}=M;

/* ================= LEZIONE 3 ================= */
const BASE=(function(){const r=rng(8),P=[];[8,9,10,11,12,13,13,14,15,16,16,17,18,20].forEach(x=>P.push([x,Math.round(clamp(-9+3.3*x+7.5*r.n(),4,76))]));return P})();
function ols(P){const n=P.length;let sx=0,sy=0;P.forEach(q=>{sx+=q[0];sy+=q[1]});const mx=sx/n,my=sy/n;let c=0,v=0;P.forEach(q=>{c+=(q[0]-mx)*(q[1]-my);v+=(q[0]-mx)**2});const m=v>1e-12?c/v:0;return {m,b:my-m*mx,mx,my,cov:c/n,vr:v/n}}
const mseL=(P,m,b)=>P.reduce((s,q)=>s+(q[1]-m*q[0]-b)**2,0)/P.length;
function scatter(host,o){const p=Plot(host,Object.assign({W:600,H:380,m:[46,10,12,44],xr:[6,22],yr:[0,80],label:'Anni di istruzione e reddito'},o||{}));
  p.axes([6,10,14,18,22],[0,20,40,60,80],'anni di istruzione','reddito (migliaia)');return p}

/* la classe di ipotesi: tante rette, e ognuna è un punto (m, b) */
FIG.fan=function(st){
  const r=rng(3),Ls=[];for(let i=0;i<28;i++)Ls.push([-2+9*r(),0]);Ls.forEach(l=>{l[1]=36-l[0]*14+26*(r()-.5)});let sel=5;
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:346,m:[38,10,10,42],xr:[6,22],yr:[0,80],label:'Dati con molte rette candidate'});p.axes([6,14,22],[0,40,80],'x','y');
  const q=Plot(duo,{W:420,H:346,m:[42,10,10,42],xr:[-3,8],yr:[-80,80],label:'Ogni retta come punto nel piano dei parametri'});q.axes([-2,0,2,4,6,8],[-60,-30,0,30,60],'m','b');
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';gq.textContent='';
    Ls.forEach((l,i)=>{if(i!==sel)S('line',{x1:p.sx(6),y1:p.sy(l[0]*6+l[1]),x2:p.sx(22),y2:p.sy(l[0]*22+l[1]),stroke:C.yellow,'stroke-width':1,opacity:.28},g)});
    const l=Ls[sel];S('line',{x1:p.sx(6),y1:p.sy(l[0]*6+l[1]),x2:p.sx(22),y2:p.sy(l[0]*22+l[1]),stroke:C.yellow,'stroke-width':2.8},g);
    BASE.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:4.5,fill:C.green},g));
    Ls.forEach((l2,i)=>S('circle',{cx:q.sx(l2[0]),cy:q.sy(l2[1]),r:i===sel?8:5,fill:C.yellow,opacity:i===sel?1:.4,class:'hd'},gq));
    res.innerHTML=`La retta evidenziata è il punto ${K('(\\Mm,\\Bi)=('+kn(l[0],2)+';\\,'+kn(l[1],1)+')')}. Scegline un altro a destra.`}
  drag(q,q.svg,(x,y)=>{let b=0,bd=1e9;Ls.forEach((l,i)=>{const d=((l[0]-x)*q.aw/11)**2+((l[1]-y)*q.ah/160)**2;if(d<bd){bd=d;b=i}});sel=b;draw()});draw();
};

/* legge dei grandi numeri: il rischio empirico converge a quello vero */
FIG.lln=function(st){
  const m=2.6,b=2,gen=r=>{const x=8+12*r(),y=-9+3.3*x+7.5*r.n();return (y-m*x-b)**2};
  const rt=rng(999);let R=0;for(let i=0;i<60000;i++)R+=gen(rt);R/=60000;let seed=1;
  btn(st,'Altri cinque campioni',()=>{seed++;draw()});
  legend(st,[[C.lg,'rischio empirico di un campione'],[C.pink,'rischio vero '+K('R')]]);
  const NMAX=2000,lx=n=>Math.log10(n);
  const p=Plot(st,{W:600,H:330,m:[48,10,14,42],xr:[0,lx(NMAX)],yr:[0,R*2.4],label:'Rischio empirico al crescere del numero di dati'});
  p.axes([0,1,2,3],[0,Math.round(R/10)*10,Math.round(R/10)*20],'numero di dati N',null,v=>big(Math.pow(10,v)));
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(R),y2:p.sy(R),stroke:C.pink,'stroke-width':2,'stroke-dasharray':'6 4'},p.g);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';let last=[];for(let k=0;k<5;k++){const r=rng(seed*100+k);let s=0;const pts=[];for(let n=1;n<=NMAX;n++){s+=gen(r);if(n<40||n%5===0)pts.push([lx(n),s/n])}last.push(s/NMAX);
      S('path',{d:p.poly(pts),fill:'none',stroke:C.lg,'stroke-width':1.3,opacity:.8},g)}
    res.innerHTML=`Una retta fissata, cinque campioni diversi. Con 10 dati il rischio empirico può sbagliare di molto; con ${big(NMAX)} i cinque valori stanno fra ${nf(Math.min(...last),1)} e ${nf(Math.max(...last),1)}, attorno al rischio vero ${nf(R,1)}.`}
  draw();
};

/* le due derivate parziali come pendenze di due sezioni della conca */
FIG.slices=function(st){
  const P=BASE,B=ols(P);let m=1.5,b=20;
  const sm=slider(st,'Pendenza '+K('\\Mm'),-1,7,0.05,m,v=>nf(v,2),v=>{m=v;draw()}),sb=slider(st,'Intercetta '+K('\\Bi'),-60,60,1,b,v=>nf(v,0),v=>{b=v;draw()});
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:320,m:[50,10,10,42],xr:[-1,7],yr:[0,1500],label:'Costo al variare della pendenza'});p.axes([0,2,4,6],[0,500,1000,1500],'m (con b fermo)','costo');
  const q=Plot(duo,{W:420,H:320,m:[50,10,10,42],xr:[-60,60],yr:[0,1500],label:'Costo al variare dell\'intercetta'});q.axes([-60,-30,0,30,60],[0,500,1000,1500],'b (con m fermo)','costo');
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);
  const n=P.length,dm=()=>2/n*P.reduce((s,d)=>s+(m*d[0]+b-d[1])*d[0],0),db=()=>2/n*P.reduce((s,d)=>s+(m*d[0]+b-d[1]),0);
  function draw(){g.textContent='';gq.textContent='';const L=mseL(P,m,b),gm=dm(),gb=db();
    S('path',{d:p.curve(v=>mseL(P,v,b),-1,7),fill:'none',stroke:C.pink,'stroke-width':2.3},g);S('path',{d:q.curve(v=>mseL(P,m,v),-60,60),fill:'none',stroke:C.pink,'stroke-width':2.3},gq);
    S('line',{x1:p.sx(m-1.2),y1:p.sy(L-1.2*gm),x2:p.sx(m+1.2),y2:p.sy(L+1.2*gm),stroke:C.teal,'stroke-width':2.5},g);S('circle',{cx:p.sx(m),cy:p.sy(L),r:5.5,fill:C.yellow},g);
    S('line',{x1:q.sx(b-18),y1:q.sy(L-18*gb),x2:q.sx(b+18),y2:q.sy(L+18*gb),stroke:C.teal,'stroke-width':2.5},gq);S('circle',{cx:q.sx(b),cy:q.sy(L),r:5.5,fill:C.yellow},gq);
    const z=Math.abs(gm)<4&&Math.abs(gb)<0.3;
    res.innerHTML=`${K('\\partial\\cL/\\partial\\Mm='+kn(gm,1))}, ${K('\\partial\\cL/\\partial\\Bi='+kn(gb,2))}.<br>`+(z?'<span class="ok">Entrambe le tangenti sono piatte: sei nel minimo.</span>':'Le due pendenze si annullano insieme solo nel fondo della conca.')}
  btn(st,'Vai al minimo',()=>{m=Math.round(B.m*20)/20;b=Math.round(B.b);m=B.m;b=B.b;sm.set(m);sb.set(b);draw()});draw();
};

/* covarianza come area con segno */
FIG.covrect=function(st){
  const P=BASE.map(q=>q.slice());
  legend(st,[['rgba(131,193,103,.55)','prodotto positivo','dot'],['rgba(252,98,85,.55)','prodotto negativo','dot'],[C.yellow,'retta dei minimi quadrati']]);
  const p=scatter(st),g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const B=ols(P);
    P.forEach(d=>{const x1=Math.min(p.sx(d[0]),p.sx(B.mx)),y1=Math.min(p.sy(d[1]),p.sy(B.my)),pos=(d[0]-B.mx)*(d[1]-B.my)>=0;
      S('rect',{x:x1,y:y1,width:Math.abs(p.sx(d[0])-p.sx(B.mx)),height:Math.abs(p.sy(d[1])-p.sy(B.my)),fill:pos?'rgba(131,193,103,.2)':'rgba(252,98,85,.25)',stroke:pos?C.green:C.red,'stroke-width':.8},g)});
    S('line',{x1:p.sx(B.mx),x2:p.sx(B.mx),y1:p.ay,y2:p.ay+p.ah,stroke:'#777','stroke-dasharray':'4 4'},g);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(B.my),y2:p.sy(B.my),stroke:'#777','stroke-dasharray':'4 4'},g);
    S('line',{x1:p.sx(6),y1:p.sy(B.m*6+B.b),x2:p.sx(22),y2:p.sy(B.m*22+B.b),stroke:C.yellow,'stroke-width':2.5},g);
    P.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:6,fill:'#fff',stroke:'#000',class:'hd'},g));
    res.innerHTML=`Ogni rettangolo ha area ${K('(\\Xs_i-\\bar{\\Xs})(\\Yy_i-\\bar{\\Yy})')}. La loro media con segno è ${K('\\mathrm{Cov}='+kn(B.cov,1))}; divisa per ${K('\\mathrm{Var}(\\Xs)='+kn(B.vr,1))} dà ${K('\\Mm^*='+kn(B.m,2))}.`}
  drag(p,p.svg,(x,y,i)=>{P[i][1]=Math.round(clamp(y,1,79));P[i][0]=Math.round(clamp(x,6.5,21.5)*2)/2;draw()},(x,y)=>{let bi=0,bd=1e9;P.forEach((q,i)=>{const d=((q[0]-x)*p.aw/16)**2+((q[1]-y)*p.ah/80)**2;if(d<bd){bd=d;bi=i}});return bi});draw();
};

/* due features: il modello è un piano */
FIG.plane2=function(st){
  const r=rng(12),D=[];for(let i=0;i<22;i++){const a=4*r(),b=4*r();D.push([a,b,1+0.9*a-0.6*b+0.45*r.n()])}
  const w=lstsq(D.map(d=>[1,d[0],d[1]]),D.map(d=>d[2])),f=(a,b)=>w[0]+w[1]*a+w[2]*b;
  const svg=Svg(st,600,400,'Punti nello spazio e piano dei minimi quadrati'),g=S('g',null,svg),res=out(st);res.style.minHeight='1.7em';
  const N=120;
  function draw(i){g.textContent='';const az=(-38+34*Math.sin(2*Math.PI*i/N))*Math.PI/180,P=proj3(az,0.42,300,215,62,[2,2,1.6]);
    wire(g,P,f,[0,4],[0,4],8,C.yellow,.55);
    D.forEach(d=>{const u=P(d),v=P([d[0],d[1],f(d[0],d[1])]);S('line',{x1:u[0],y1:u[1],x2:v[0],y2:v[1],stroke:C.pink,'stroke-width':1.8},g);S('circle',{cx:u[0],cy:u[1],r:4.5,fill:C.green},g)});
    [['x₁',[4.5,0,f(4.5,0)]],['x₂',[0,4.5,f(0,4.5)]]].forEach(a=>{const u=P(a[1]),e=S('text',{x:u[0],y:u[1],class:'lab','text-anchor':'middle',style:'fill:'+C.blue},g);e.textContent=a[0]});
    res.innerHTML=`${K('\\Yh='+kn(w[0],2)+(w[1]<0?'':'+')+kn(w[1],2)+'\\,\\Xs_1'+(w[2]<0?'':'+')+kn(w[2],2)+'\\,\\Xs_2')}: tre pesi, trovati con la stessa formula.`}
  player(st,N,8,draw);
};

/* una riga della design matrix per volta */
FIG.matmul=function(st){
  const X=[[1,2,5],[1,4,1],[1,3,3],[1,6,2]],w=[1,2,-1];let sel=1;
  const wrap=H('div',{class:'mm'},st),res=out(st);res.style.minHeight='1.7em';
  function draw(){const yh=X.map(r=>r.reduce((s,v,j)=>s+v*w[j],0));
    const col=(vals,c,click)=>'<div class="mcol">'+vals.map((v,i)=>`<span class="${click?'mrow':''}${click&&i===sel?' on':''}" ${click?`data-i="${i}"`:''} style="color:${c}">${v}</span>`).join('')+'</div>';
    wrap.innerHTML=`<div class="mlab">${K('\\Xm')}</div>`+col(X.map(r=>r.join('&nbsp;&nbsp;&nbsp;')),C.blue,true)+'<div class="mop">·</div>'+`<div class="mlab">${K('\\Wv')}</div>`+col(w.map(String),C.yellow)+'<div class="mop">=</div>'+`<div class="mlab">${K('\\hat{\\Yv}')}</div>`+col(yh.map((v,i)=>i===sel?'<b>'+v+'</b>':v),C.green);
    wrap.querySelectorAll('.mrow').forEach(e=>e.addEventListener('click',()=>{sel=+e.dataset.i;draw()}));
    const r=X[sel];res.innerHTML=`Riga ${sel+1}: ${K('\\Yh_'+(sel+1)+'='+r.map((v,j)=>'\\htmlClass{k-blue}{'+v+'}\\cdot\\htmlClass{k-yellow}{'+(w[j]<0?'('+w[j]+')':w[j])+'}').join('+')+'='+yh[sel])}. La prima colonna di uni moltiplica l'intercetta.`}
  draw();
};

/* features correlate: la conca diventa un canale; ridge lo richiude */
FIG.collin=function(st){
  const r=rng(5),N=50,Z=[];for(let i=0;i<N;i++)Z.push([r.n(),r.n(),r.n()]);let rho=0.6,ll=-3;
  slider(st,'Correlazione fra le due features',0,1,0.01,rho,v=>nf(v,2),v=>{rho=v;draw()});
  slider(st,'Ridge '+K('\\Rl'),-3,0,0.05,ll,v=>v<=-3?'0':nf(Math.pow(10,v),3),v=>{ll=v;draw()});
  const p=Plot(st,{W:600,H:400,m:[44,10,12,44],xr:[-2,4],yr:[-2,4],label:'Costo in funzione dei due pesi'});p.axes([-2,0,2,4],[-2,0,2,4],'peso della feature 1','peso della feature 2');
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const lam=ll<=-3?0:Math.pow(10,ll),s=Math.sqrt(1-rho*rho);let A=0,B=0,Cc=0,d1=0,d2=0;
    Z.forEach(z=>{const x1=z[0],x2=rho*z[0]+s*z[1],y=x1+x2+0.3*z[2];A+=x1*x1;B+=x1*x2;Cc+=x2*x2;d1+=x1*y;d2+=x2*y});A=A/N+lam;B/=N;Cc=Cc/N+lam;d1/=N;d2/=N;
    const det=A*Cc-B*B,sing=det<1e-9;let ws=sing?[1,1]:[(Cc*d1-B*d2)/det,(A*d2-B*d1)/det];
    const L=(u,v)=>{const a=u-ws[0],b=v-ws[1];return A*a*a+2*B*a*b+Cc*b*b};heat(p,L,8,170);
    if(sing)S('line',{x1:p.sx(-2),y1:p.sy(4),x2:p.sx(4),y2:p.sy(-2),stroke:'#fff','stroke-width':3},g);
    else S('path',{d:`M${p.sx(ws[0])-7} ${p.sy(ws[1])}h14M${p.sx(ws[0])} ${p.sy(ws[1])-7}v14`,stroke:'#fff','stroke-width':2.5},g);
    const tr=A+Cc,l2=tr/2-Math.sqrt(Math.max(0,tr*tr/4-det)),l1=tr-l2;
    res.innerHTML=sing?'<span class="ko">Features perfettamente collineari:</span> il fondo non è più un punto ma un\'intera retta di minimi (in bianco). '+K('\\Xm^\\top\\Xm')+' non è invertibile.'
      :`Minimo unico in (${nf(ws[0],2)}; ${nf(ws[1],2)}). Numero di condizionamento ${K('\\kappa\\approx'+(l1/l2>9999?'10^{'+Math.round(Math.log10(l1/l2))+'}':kn(l1/l2,1)))}.<br>`+(lam>0?'Il termine ridge alza le pareti del canale: il minimo torna unico, anche con correlazione 1.':'Porta la correlazione a 1 e guarda che cosa succede al fondo.')}
  draw();
};

/* dal rumore alla loss */
FIG.noise2loss=function(st){
  legend(st,[[C.pink,'rumore gaussiano'],[C.teal,'rumore di Laplace']]);
  const duo=H('div',{class:'duo'},st),gs=e=>Math.exp(-e*e/2)/Math.sqrt(2*Math.PI),lp=e=>Math.exp(-Math.abs(e)/0.75)/1.5;
  let d=H('div',null,duo),p=Plot(d,{W:420,H:300,m:[40,10,10,42],xr:[-4,4],yr:[0,0.72],label:'Densità del rumore'});p.axes([-4,-2,0,2,4],[0,0.2,0.4,0.6],'errore','densità');
  S('path',{d:p.curve(gs,-4,4),fill:'none',stroke:C.pink,'stroke-width':2.3},p.g);S('path',{d:p.curve(lp,-4,4,400),fill:'none',stroke:C.teal,'stroke-width':2.3},p.g);cap(d,'<b>Quanto è probabile ogni errore</b>');
  d=H('div',null,duo);p=Plot(d,{W:420,H:300,m:[40,10,10,42],xr:[-4,4],yr:[0,8],label:'Meno logaritmo della densità'});p.axes([-4,-2,0,2,4],[0,2,4,6,8],'errore','−log densità');
  S('path',{d:p.curve(e=>-Math.log(gs(e))+Math.log(gs(0)),-4,4),fill:'none',stroke:C.pink,'stroke-width':2.3},p.g);S('path',{d:p.curve(e=>-Math.log(lp(e))+Math.log(lp(0)),-4,4,400),fill:'none',stroke:C.teal,'stroke-width':2.3},p.g);cap(d,'<b>Quanto costa ogni errore</b><br>una parabola e un valore assoluto');
};

/* ================= LEZIONE 4 ================= */
const F4=x=>12*(x-0.4)*(x-0.4)-0.3;
function sample(r,N,sd){const xs=[],ys=[];for(let i=0;i<N;i++){const x=(i+r())/N;xs.push(x);ys.push(F4(x)+sd*r.n())}return [xs,ys]}

/* la stessa nuvola vista contro x e contro x al quadrato */
FIG.lift=function(st){
  const r=rng(9),xs=[],ys=[];for(let i=0;i<26;i++){const x=-1+2*(i+r())/26;xs.push(x);ys.push(0.4+1.8*x*x+0.12*r.n())}
  const w=lstsq(xs.map(x=>[1,x*x]),ys),duo=H('div',{class:'duo'},st);
  let d=H('div',null,duo),p=Plot(d,{W:420,H:320,m:[40,10,10,42],xr:[-1.1,1.1],yr:[0,2.6],label:'I dati contro x'});p.axes([-1,0,1],[0,1,2],'x','y');
  S('path',{d:p.curve(x=>w[0]+w[1]*x*x,-1.1,1.1),fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g);xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:4,fill:C.green},p.g));cap(d,'<b>Contro '+K('\\Xs')+'</b><br>serve una curva');
  d=H('div',null,duo);p=Plot(d,{W:420,H:320,m:[40,10,10,42],xr:[-0.1,1.1],yr:[0,2.6],label:'Gli stessi dati contro x al quadrato'});p.axes([0,0.5,1],[0,1,2],'φ(x) = x²','y');
  S('line',{x1:p.sx(-0.1),y1:p.sy(w[0]-0.1*w[1]),x2:p.sx(1.1),y2:p.sy(w[0]+1.1*w[1]),stroke:C.yellow,'stroke-width':2.5},p.g);xs.forEach((x,i)=>S('circle',{cx:p.sx(x*x),cy:p.sy(ys[i]),r:4,fill:C.green},p.g));cap(d,'<b>Contro '+K('\\Ph(\\Xs)=\\Xs^2')+'</b><br>basta una retta');
};

FIG.monos=function(st){
  const p=Plot(st,{W:600,H:300,m:[40,10,60,42],xr:[-1,1],yr:[-1.15,1.15],label:'Le funzioni 1, x, x al quadrato fino a x alla quinta'});p.axes([-1,-0.5,0,0.5,1],[-1,0,1],'x');
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);
  for(let j=0;j<=5;j++){S('path',{d:p.curve(x=>Math.pow(x,j),-1,1),fill:'none',stroke:C.blue,'stroke-width':2,opacity:1-j*0.13},p.g);
    const t=S('text',{x:p.ax+p.aw+6,y:p.sy(j===0?1:Math.pow(0.86,j))+(j===0?4:8+j*3),class:'tag'},p.axg);t.textContent=j===0?'1':j===1?'x':'x'+'²³⁴⁵'[j-2]}
};

FIG.terms=function(st){
  let d=2,pp=2;const binom=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
  slider(st,'Variabili '+K('d'),1,20,1,d,v=>v,v=>{d=v;draw()});slider(st,'Grado '+K('p'),1,8,1,pp,v=>v,v=>{pp=v;draw()});
  const svg=Svg(st,600,64,'Barra in scala logaritmica del numero di termini');S('rect',{x:10,y:16,width:580,height:18,fill:'#1c1c1c'},svg);const bar=S('rect',{x:10,y:16,height:18,fill:C.blue},svg);
  [0,2,4,6].forEach(e=>{const x=10+580*e/6.5;S('line',{x1:x,x2:x,y1:34,y2:40,stroke:'#555'},svg);const t=S('text',{x,y:56,'text-anchor':e===0?'start':'middle'},svg);t.textContent=e===0?'1':'10'+['','²','⁴','⁶'][e/2]});
  const res=out(st);res.style.minHeight='1.7em';
  function draw(){const n=binom(d+pp,pp);bar.setAttribute('width',580*Math.min(1,Math.log10(n)/6.5));res.innerHTML=`Con ${d} variabil${d===1?'e':'i'} e grado ${pp}: <span style="color:${C.blue}">${big(n)}</span> basis functions, e altrettanti pesi da stimare.`}
  draw();
};

FIG.pwbasis=function(st){
  const c=0.5,F=[[x=>1,'\\Ph_1=1'],[x=>x<=c?x:0,'\\Ph_2=\\Xs\\cdot\\mathbb 1(\\Xs\\le c)'],[x=>x>c?x:0,'\\Ph_3=\\Xs\\cdot\\mathbb 1(\\Xs>c)'],[x=>x>c?1:0,'\\Ph_4=\\mathbb 1(\\Xs>c)']];
  const q=H('div',{class:'quad'},st);
  F.forEach(f=>{const d=H('div',null,q),p=Plot(d,{W:200,H:150,m:[8,8,8,8],xr:[0,1],yr:[-0.15,1.2],label:'Basis function a tratti'});
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);S('line',{x1:p.sx(c),x2:p.sx(c),y1:p.ay,y2:p.ay+p.ah,stroke:'#555','stroke-dasharray':'3 4'},p.bg);
    S('path',{d:p.curve(f[0],0,c-1e-6,60)+p.curve(f[0],c+1e-6,1,60),fill:'none',stroke:C.blue,'stroke-width':2.5},p.g);cap(d,K(f[1]))});
};

FIG.rbf1=function(st){
  let bw=0.08;const mus=[0.1,0.3,0.5,0.7,0.9];
  slider(st,'Bandwidth '+K('\\Bw'),0.02,0.4,0.01,bw,v=>nf(v,2),v=>{bw=v;draw()});
  const p=Plot(st,{W:600,H:260,m:[40,10,12,42],xr:[0,1],yr:[0,1.15],label:'Cinque funzioni radiali gaussiane'});p.axes([0,0.1,0.3,0.5,0.7,0.9,1],[0,0.5,1],'x');
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';mus.forEach((mu,j)=>{S('path',{d:p.curve(x=>Math.exp(-(x-mu)*(x-mu)/(2*bw*bw)),0,1,300),fill:'none',stroke:C.blue,'stroke-width':j===2?2.8:1.6,opacity:j===2?1:.6},g);S('line',{x1:p.sx(mu),x2:p.sx(mu),y1:p.sy(0),y2:p.sy(0)-7,stroke:'#fff','stroke-width':2},g)});
    const ov=Math.exp(-(0.1*0.1)/(2*bw*bw));res.innerHTML=`A metà strada fra due centri vicini ogni funzione vale ${nf(ov,2)}: `+(ov<0.1?'le funzioni quasi non si toccano, ciascuna vede solo i dati attorno al proprio centro.':ov<0.75?'le funzioni si sovrappongono quanto basta per raccordarsi in modo liscio.':'le funzioni sono quasi indistinguibili: tante basi, poca flessibilità.')}
  draw();
};

/* tre gradi sugli stessi dati */
FIG.fit3=function(st){
  const r=rng(27*13+10),[xs,ys]=sample(r,10,0.4),[xt,yt]=sample(r,400,0.4),tri=H('div',{class:'trio'},st);
  [[1,'Underfitting'],[2,'Giusto'],[7,'Overfitting']].forEach(a=>{const d=H('div',null,tri),fn=polyFit(xs,ys,a[0],0,1),p=Plot(d,{W:230,H:190,m:[8,8,8,8],xr:[0,1],yr:[-1.8,5.2],label:a[1]});
    S('path',{d:p.curve(F4,0,1),fill:'none',stroke:'#fff','stroke-dasharray':'4 4',opacity:.6},p.g);S('path',{d:p.curve(fn,0,1,300),fill:'none',stroke:C.yellow,'stroke-width':2.2},p.g);
    for(let i=0;i<12;i++)S('circle',{cx:p.sx(xt[i*33+7]),cy:p.sy(yt[i*33+7]),r:3,fill:'none',stroke:'#c9c9c9'},p.g);xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:3.6,fill:'#fff'},p.g));
    cap(d,`<b>${a[1]}</b> · grado ${a[0]}<br>training ${nf(mse(fn,xs,ys),2)} · test <span style="color:${C.red}">${nf(mse(fn,xt,yt),2)}</span>`)});
};

/* il modello medio si costruisce un dataset alla volta */
FIG.avg=function(st){
  const deg=5,NF=60,r=rng(4242),G=60,gx=Array.from({length:G},(_,i)=>i/(G-1)),fits=[];for(let k=0;k<NF;k++){const [xs,ys]=sample(r,10,0.4),fn=polyFit(xs,ys,deg,0,1);fits.push(gx.map(fn))}
  legend(st,[[C.yellow,'un dataset, un modello','','opacity:.45;height:2px'],[C.yellow,'media dei modelli visti finora'],['#fff','vera '+K('\\Ff'),'','height:2px']]);
  const p=Plot(st,{W:600,H:400,m:[40,10,12,42],xr:[0,1],yr:[-1.8,5.2],label:'I modelli si accumulano e la loro media si stabilizza'});p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2,3,4,5],'x','y');
  const g=S('g',null,p.g),res=out(st);res.style.cssText='min-height:6.7em!important';
  function draw(pf){g.textContent='';const k=Math.max(1,Math.min(NF,Math.floor(pf))),fq=k<NF?clamp(pf-k,0,1):0,mk=n=>gx.map((_,j)=>{let s=0;for(let a=0;a<n;a++)s+=fits[a][j];return s/n}),m1=mk(k),m2=fq>0?mk(k+1):m1,mean=m1.map((v,j)=>v+(m2[j]-v)*fq);
    for(let a=0;a<k;a++)S('path',{d:p.poly(gx.map((x,j)=>[x,fits[a][j]])),fill:'none',stroke:C.yellow,'stroke-width':1,opacity:a===k-1?.22+.68*(1-fq):.22},g);
    if(fq>0)S('path',{d:p.poly(gx.map((x,j)=>[x,fits[k][j]])),fill:'none',stroke:C.yellow,'stroke-width':1.6,opacity:.9*fq},g);
    S('path',{d:p.curve(F4,0,1),fill:'none',stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 5'},g);S('path',{d:p.poly(gx.map((x,j)=>[x,mean[j]])),fill:'none',stroke:C.yellow,'stroke-width':3.2},g);
    let d2=0;gx.forEach((x,j)=>d2+=(mean[j]-F4(x))**2);d2/=G;
    res.innerHTML=`${k} dataset${k===1?'':' diversi'}, ${k} polinomi${k===1?'o':''} di grado ${deg}. Distanza quadratica media fra la loro media e la verità: ${nf(d2,3)}.<br>`+(k<4?'Con pochi modelli la media è ancora una curva qualsiasi.':k<25?'Le oscillazioni di un modello vengono compensate da quelle degli altri.':'La media si è assestata sulla parabola: è '+K('\\Fb')+', e mostra che il bias di questo modello è quasi nullo.')}
  player(st,NF,2.5,draw);
};

/* bias e varianza in un solo punto */
FIG.pointwise=function(st){
  let deg=5,x0=0.9;const NF=80;
  slider(st,'Grado del polinomio',1,7,1,deg,v=>v,v=>{deg=v;fit();draw()});
  legend(st,[[C.yellow,K('\\Fh_S(\\Xs)')+' per 80 dataset','dot','opacity:.6'],[C.yellow,K('\\Fb(\\Xs)')],['#fff',K('\\Ff(\\Xs)')],[C.pink,'bias']]);
  const p=Plot(st,{W:600,H:400,m:[40,10,12,42],xr:[0,1],yr:[-1.8,5.2],label:'Previsioni di molti modelli nello stesso punto'});p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2,3,4,5],'x','y');
  const g=S('g',null,p.g),res=out(st);let fns=[];
  function fit(){const r=rng(900+deg);fns=[];for(let k=0;k<NF;k++){const [xs,ys]=sample(r,10,0.4);fns.push(polyFit(xs,ys,deg,0,1))}}
  function draw(){g.textContent='';fns.slice(0,25).forEach(fn=>S('path',{d:p.curve(fn,0,1,120),fill:'none',stroke:C.yellow,'stroke-width':1,opacity:.16},g));
    S('path',{d:p.curve(F4,0,1),fill:'none',stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 5'},g);
    const v=fns.map(fn=>fn(x0)),mu=v.reduce((s,a)=>s+a,0)/NF,vr=v.reduce((s,a)=>s+(a-mu)**2,0)/NF,X=p.sx(x0);
    S('line',{x1:X,x2:X,y1:p.ay,y2:p.ay+p.ah,stroke:'#666'},g);v.forEach(a=>S('circle',{cx:X,cy:p.sy(a),r:3.2,fill:C.yellow,opacity:.55},g));
    S('line',{x1:X+9,x2:X+9,y1:p.sy(mu),y2:p.sy(F4(x0)),stroke:C.pink,'stroke-width':4},g);
    S('line',{x1:X-12,x2:X+12,y1:p.sy(mu),y2:p.sy(mu),stroke:C.yellow,'stroke-width':3.5},g);S('line',{x1:X-12,x2:X+12,y1:p.sy(F4(x0)),y2:p.sy(F4(x0)),stroke:'#fff','stroke-width':3.5},g);
    res.innerHTML=`In ${K('\\Xs='+kn(x0,2))}: ${K('\\text{bias}^2='+kn((mu-F4(x0))**2,3))}, ${K('\\text{varianza}='+kn(vr,3))}.<br>Trascina la linea: con il grado alto la varianza è maggiore ai bordi; con il grado 1 il bias cambia da punto a punto.`}
  drag(p,p.svg,x=>{x0=Math.round(clamp(x,0.02,0.98)*50)/50;draw()});fit();draw();
};

/* curve di apprendimento: errore atteso al crescere dei dati */
FIG.learn=function(st){
  const NS=[8,10,14,20,30,50,100,200],sd=0.4,G=40,gx=Array.from({length:G},(_,i)=>(i+.5)/G);
  function ex(deg,N){const r=rng(31*deg+N);let s=0;const Mm=300;for(let k=0;k<Mm;k++){const [xs,ys]=sample(r,N,sd),fn=polyFit(xs,ys,deg,0,1);gx.forEach(x=>{s+=(fn(x)-F4(x))**2})}return s/(Mm*G)+sd*sd}
  const A=NS.map(N=>ex(1,N)),B=NS.map(N=>ex(6,N));
  legend(st,[[C.blue,'modello semplice (grado 1)'],[C.yellow,'modello complesso (grado 6)'],[C.purple,'errore irriducibile']]);
  const lx=n=>Math.log10(n),p=Plot(st,{W:600,H:330,m:[44,10,14,42],xr:[lx(7),lx(220)],yr:[0,1.6],label:'Errore di test atteso al crescere dei dati di training'});
  p.axes(NS.map(lx),[0,0.5,1,1.5],'punti di training N','errore di test atteso',v=>Math.round(Math.pow(10,v)));
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(sd*sd),y2:p.sy(sd*sd),stroke:C.purple,'stroke-width':2,'stroke-dasharray':'5 4'},p.g);
  [[A,C.blue],[B,C.yellow]].forEach(a=>{S('path',{d:p.poly(a[0].map((v,i)=>[lx(NS[i]),Math.min(v,20)])),fill:'none',stroke:a[1],'stroke-width':2.5},p.g);a[0].forEach((v,i)=>S('circle',{cx:p.sx(lx(NS[i])),cy:p.sy(Math.min(v,20)),r:3.5,fill:a[1]},p.g))});
  const res=out(st);const cross=NS.find((n,i)=>B[i]<A[i]);
  res.innerHTML=`Con ${NS[0]} punti il modello complesso ha errore ${nf(B[0],2)}, quello semplice ${nf(A[0],2)}. Da ${cross} punti in su il complesso è il migliore, e con 200 arriva a ${nf(B[7],2)}: quasi solo errore irriducibile.<br>Il modello semplice si ferma a ${nf(A[7],2)}: più dati non tolgono il suo bias.`;
};

/* double descent: schema qualitativo */
FIG.dd=function(st){
  const p=Plot(st,{W:600,H:300,m:[14,10,14,40],xr:[0,10],yr:[0,3],label:'Schema qualitativo della double descent'});
  S('line',{x1:p.ax,y1:p.ay+p.ah,x2:p.ax+p.aw,y2:p.ay+p.ah,stroke:'#555'},p.axg);S('line',{x1:p.ax,y1:p.ay,x2:p.ax,y2:p.ay+p.ah,stroke:'#555'},p.axg);
  const f=x=>x<5?0.9+1.3*Math.pow((x-2.2)/2.8,2)+ (x>3.6?1.1*Math.pow((x-3.6)/1.4,3):0):0.55+2.75*Math.exp(-(x-5)*1.1);
  S('path',{d:p.curve(f,0.2,9.8,400),fill:'none',stroke:C.red,'stroke-width':2.8},p.g);
  S('line',{x1:p.sx(5),x2:p.sx(5),y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-dasharray':'4 4'},p.g);
  const T=(x,y,t,an)=>{const e=S('text',{x:p.sx(x),y,class:'tag','text-anchor':an||'middle'},p.axg);e.textContent=t};
  T(2.5,p.H-12,'regime classico (d < N)');T(7.5,p.H-12,'regime sovra-parametrizzato (d ≫ N)');T(5.15,p.ay+p.ah-12,'d ≈ N','start');T(0.3,p.ay+14,'errore di test','start');
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,polyFit,mse,Svg,proj3,wire,heat,arrow,cap}=M;

/* il costo è la media dei costi dei singoli esempi */
FIG.permean=function(st){
  const r=rng(15),D=[];for(let i=0;i<8;i++){const x=0.5+i*0.5+0.2*(r()-.5);D.push([x,0.6+0.8*x+0.45*r.n()])}let w=0.4;
  slider(st,'Parametro '+K('\\Ws')+' (pendenza)',0,1.6,0.02,w,v=>nf(v,2),v=>{w=v;draw()});
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:320,m:[36,10,10,42],xr:[0,4.6],yr:[0,5],label:'Dati, modello ed errori'});p.axes([0,1,2,3,4],[0,2,4],'x','y');
  const q=Plot(duo,{W:420,H:320,m:[40,10,10,42],xr:[0.3,8.7],yr:[0,4],label:'Costo di ciascun esempio e loro media'});q.axes([1,2,3,4,5,6,7,8],[0,1,2,3,4],'esempio i','costo');
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);
  function draw(){g.textContent='';gq.textContent='';const f=x=>0.6+w*x;let s=0;
    D.forEach((d,i)=>{const e=d[1]-f(d[0]);s+=e*e;S('line',{x1:p.sx(d[0]),x2:p.sx(d[0]),y1:p.sy(d[1]),y2:p.sy(f(d[0])),stroke:C.pink,'stroke-width':2.5},g);
      S('rect',{x:q.sx(i+1)-13,y:q.sy(Math.min(e*e,4)),width:26,height:Math.max(0.5,q.sy(0)-q.sy(Math.min(e*e,4))),fill:C.pink,opacity:.8},gq)});
    S('line',{x1:p.sx(0),y1:p.sy(f(0)),x2:p.sx(4.6),y2:p.sy(f(4.6)),stroke:C.yellow,'stroke-width':2.5},g);D.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:4.5,fill:C.green},g));
    const L=s/D.length;S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(Math.min(L,4)),y2:q.sy(Math.min(L,4)),stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 4'},gq);
    res.innerHTML=`Ogni barra è ${K('\\cl(e_i)=e_i^2')} per un esempio; la linea tratteggiata è la loro media, ${K('\\cL(\\Ws)='+kn(L,3))}.`}
  draw();
};

/* i quattro tipi di vincolo dell'elenco */
FIG.csets=function(st){
  const q=H('div',{class:'quad'},st),at={fill:'rgba(109,185,244,.28)',stroke:C.blue,'stroke-width':1.5};
  [['Non negatività',p=>S('rect',Object.assign({x:p.sx(0),y:p.sy(3),width:p.sx(3)-p.sx(0),height:p.sy(0)-p.sy(3)},at),p.g)],
   ['Norma limitata',p=>S('circle',Object.assign({cx:p.sx(0),cy:p.sy(0),r:p.sx(1.3)-p.sx(0)},at),p.g)],
   ['Simplesso',p=>S('line',{x1:p.sx(1.5),y1:p.sy(0),x2:p.sx(0),y2:p.sy(1.5),stroke:C.blue,'stroke-width':5,'stroke-linecap':'round'},p.g)],
   ['Scatola',p=>S('rect',Object.assign({x:p.sx(-1.2),y:p.sy(1.4),width:p.sx(1.6)-p.sx(-1.2),height:p.sy(-0.8)-p.sy(1.4)},at),p.g)]].forEach(a=>{const d=H('div',null,q),p=Plot(d,{W:200,H:200,m:[6,6,6,6],xr:[-2,2],yr:[-2,2],label:a[0]});
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#555'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555'},p.bg);a[1](p);cap(d,'<b>'+a[0]+'</b>')});
};

/* prodotto di densità contro somma di logaritmi */
FIG.logsum=function(st){
  const r=rng(77),NM=1500,lp=[];for(let i=0;i<NM;i++){const e=r.n();lp.push(-0.5*Math.log(2*Math.PI)-e*e/2)}let ln=2.9;
  slider(st,'Numero di dati '+K('N'),1,Math.log10(NM),0.01,ln,v=>big(Math.round(Math.pow(10,v))),v=>{ln=v;draw()});
  legend(st,[[C.purple,K('\\log_{10}')+' del prodotto delle densità'],['#fff','sotto questa soglia il computer scrive 0']]);
  const p=Plot(st,{W:600,H:300,m:[52,10,26,42],xr:[0,NM],yr:[-700,20],label:'Logaritmo del prodotto delle densità al crescere dei dati'});p.axes([0,500,1000,1500],[0,-200,-400,-600],'numero di dati','log₁₀ del prodotto',null,v=>String(v).replace('-','−'));
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(-323.3),y2:p.sy(-323.3),stroke:'#fff','stroke-dasharray':'6 4'},p.g);
  const cum=[0];lp.forEach(v=>cum.push(cum[cum.length-1]+v));
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const N=Math.round(Math.pow(10,ln));const pts=[];for(let k=0;k<=N;k+=Math.max(1,Math.floor(N/200)))pts.push([k,cum[k]/Math.LN10]);pts.push([N,cum[N]/Math.LN10]);
    S('path',{d:p.poly(pts),fill:'none',stroke:C.purple,'stroke-width':2.5},g);S('circle',{cx:p.sx(N),cy:p.sy(cum[N]/Math.LN10),r:5,fill:C.purple},g);
    let prod=1;for(let k=0;k<N;k++)prod*=Math.exp(lp[k]);
    res.innerHTML=`Con ${big(N)} dati: prodotto delle densità calcolato dal computer = <b>${prod===0?'<span class="ko">0</span>':K(prod.toExponential(2).replace('.','{,}').replace(/e([+-]?\d+)/,'\\cdot10^{$1}'))}</b>; somma dei logaritmi = <b>${nf(cum[N],1)}</b>.<br>`+(prod===0?'Il prodotto è diventato troppo piccolo per essere rappresentato, e ogni confronto fra modelli è perso. La somma dei logaritmi resta un numero qualsiasi.':'Ogni fattore è minore di 1, quindi il prodotto si rimpicciolisce a ogni dato in più.')}
  draw();
};

/* i tre pezzi dell'errore, per tre gradi */
FIG.stack3=function(st){
  const F4=x=>12*(x-0.4)*(x-0.4)-0.3,sd=0.4,G=40,gx=Array.from({length:G},(_,i)=>(i+.5)/G);
  function mc(deg){const r=rng(500+deg),Mm=500,sum=new Float64Array(G),sq=new Float64Array(G);for(let k=0;k<Mm;k++){const xs=[],ys=[];for(let i=0;i<10;i++){const x=(i+r())/10;xs.push(x);ys.push(F4(x)+sd*r.n())}const fn=polyFit(xs,ys,deg,0,1);gx.forEach((x,j)=>{const v=fn(x);sum[j]+=v;sq[j]+=v*v})}
    let b=0,v=0;gx.forEach((x,j)=>{const mu=sum[j]/Mm;b+=(mu-F4(x))**2;v+=sq[j]/Mm-mu*mu});return [b/G,v/G]}
  legend(st,[[C.blue,'bias²'],[C.teal,'varianza'],[C.purple,'errore irriducibile']]);
  const wrap=H('div',{class:'bars',style:'max-width:38rem'},st);let h='';
  [1,2,5].forEach(d=>{const [b,v]=mc(d),tot=b+v+sd*sd,sc=100/1.1;h+=`<span>Grado ${d}</span><div class="bar" style="display:flex"><i style="width:${b*sc}%;background:${C.blue}"></i><i style="width:${v*sc}%;background:${C.teal}"></i><i style="width:${sd*sd*sc}%;background:${C.purple}"></i></div><span>${nf(tot,2)}</span>`});
  wrap.innerHTML=h;
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,Svg,proj3,wire,arrow,cap}=M;

/* iris: dalle quattro misure alla specie (righe della tabella delle slide) */
FIG.iris=function(st){
  const R=[[4.3,3.0,1.1,0.1,'setosa'],[5.0,3.3,1.4,0.2,'setosa'],[7.7,3.8,6.7,2.2,'virginica'],[5.5,2.5,4.0,1.3,'versicolor']];
  const W=600,Hh=330,svg=Svg(st,W,Hh,'Un fiore di iris stilizzato con le quattro misure e la specie'),g=S('g',null,svg),res=out(st);res.style.minHeight='1.7em';
  const cx=175,cy=168,sc=17,SEG=24,N=SEG*3;
  const leaf=(ang,len,wid,fill,op)=>{const a=ang*Math.PI/180,L=len*sc,Wd=wid*sc/2,ux=Math.cos(a),uy=-Math.sin(a),px=-uy,py=ux;
    const P=(t,s)=>[(cx+ux*L*t+px*Wd*s).toFixed(1),(cy+uy*L*t+py*Wd*s).toFixed(1)].join(' ');
    S('path',{d:`M${cx} ${cy}C${P(.25,1.25)} ${P(.8,1.1)} ${P(1,0)}C${P(.8,-1.1)} ${P(.25,-1.25)} ${cx} ${cy}Z`,fill,opacity:op,stroke:'#000','stroke-width':1},g)};
  function dim(ang,len,off,label){const a=ang*Math.PI/180,ux=Math.cos(a),uy=-Math.sin(a),px=-uy,py=ux,x1=cx+px*off,y1=cy+py*off,x2=x1+ux*len*sc,y2=y1+uy*len*sc;
    S('line',{x1,y1,x2,y2,stroke:C.blue,'stroke-width':1.5},g);[[x1,y1],[x2,y2]].forEach(q=>S('line',{x1:q[0]-px*4,y1:q[1]-py*4,x2:q[0]+px*4,y2:q[1]+py*4,stroke:C.blue,'stroke-width':1.5},g))}
  function draw(i){g.textContent='';const k=Math.min(2,Math.floor(i/SEG)),t0=clamp((i-k*SEG-10)/14,0,1),t=i>=N?1:t0*t0*(3-2*t0),a=R[k],b=R[Math.min(3,k+1)],v=[0,1,2,3].map(j=>a[j]+(b[j]-a[j])*t),cur=t<0.5?a:b;
    [90,210,330].forEach(an=>leaf(an,v[0],v[1],'#7745b5',.95));[30,150,270].forEach(an=>leaf(an,v[2],v[3],'#CAA3E8',.95));S('circle',{cx,cy,r:5,fill:C.yellow},g);
    dim(90,v[0],-v[1]*sc/2-10,'');dim(30,v[2],v[3]*sc/2+8,'');
    const X=370,rows=[['lunghezza del sepalo',v[0]],['larghezza del sepalo',v[1]],['lunghezza del petalo',v[2]],['larghezza del petalo',v[3]]];
    rows.forEach((r,j)=>{const y=70+j*34,e=S('text',{x:X,y,class:'tag'},g);e.textContent=r[0];const n=S('text',{x:W-16,y,'text-anchor':'end',style:`fill:${C.blue};font-size:17px`},g);n.textContent=nf(r[1],1)+' cm'});
    S('line',{x1:X,x2:W-16,y1:210,y2:210,stroke:'#444'},g);const e=S('text',{x:X,y:244,class:'tag'},g);e.textContent='specie';
    const sp=S('text',{x:W-16,y:244,'text-anchor':'end',style:`fill:${C.green};font-size:19px;font-style:italic`,opacity:Math.abs(t-.5)*2},g);sp.textContent=cur[4];
    const l1=S('text',{x:cx,y:22,'text-anchor':'middle',style:'fill:#7745b5;font-size:14px'},g);l1.textContent='sepali (scuri)';const l2=S('text',{x:cx,y:Hh-8,'text-anchor':'middle',style:'fill:#CAA3E8;font-size:14px'},g);l2.textContent='petali (chiari)';
    res.innerHTML=`Riga ${Math.min(4,Math.floor((i+7)/SEG)+1)} della tabella: quattro numeri in ingresso, una categoria in uscita.`}
  player(st,N,6,draw);
};

/* dalle features scritte a mano all'apprendimento end-to-end */
FIG.pipes=function(st){
  const W=600,Hh=210,svg=Svg(st,W,Hh,'Schema: features fissate a mano e classificatore appreso, oppure tutto appreso'),g=S('g',null,svg),res=out(st);res.style.minHeight='3.4em';
  const N=40,mix=(a,b,t)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';
  function draw(i){g.textContent='';const t0=clamp((i/N-0.35)/0.4,0,1),t=t0*t0*(3-2*t0),x0=120,x1=470,y0=45,h=110,nb=6;
    const tx=S('text',{x:60,y:104,'text-anchor':'middle',style:'fill:'+C.blue+';font-size:16px'},g);tx.textContent='immagine';arrow(g,96,100,x0-4,100,'#fff',1.6);
    for(let k=0;k<nb;k++){const bw=(x1-x0)/nb,last=k===nb-1,col=last?C.yellow:mix([90,90,90],[255,255,0],t),gap=last?4:4*t,sh=1-0.07*k;
      S('rect',{x:x0+k*bw+gap/2,y:y0+h*(1-sh)/2,width:bw-gap,height:h*sh,fill:col,opacity:last?1:.55+.45*t},g);
      const lb=S('text',{x:x0+(k+.5)*bw,y:104,'text-anchor':'middle',style:'fill:#000;font-size:15px;font-style:italic',opacity:last?1:clamp((t-0.6)/0.4,0,1)},g);lb.textContent='θ'+(last?(t>.5?'L':''):'₁₂₃₄₅'[k])}
    const f=S('text',{x:x0+(x1-x0)*5/12,y:104,'text-anchor':'middle',style:'fill:#fff;font-size:15px',opacity:clamp(1-t/0.4,0,1)},g);f.textContent='estrazione delle features, fissata a mano';
    arrow(g,x1+4,100,x1+34,100,'#fff',1.6);const an=S('text',{x:x1+40,y:104,style:'fill:'+C.green+';font-size:16px'},g);an.textContent='gatto / cane';
    const bx=x0+(x1-x0)*(5/6)*(1-t);S('path',{d:`M${bx} 170v8H${x1}v-8`,fill:'none',stroke:C.yellow,'stroke-width':1.5},g);
    const lt=S('text',{x:(bx+x1)/2,y:198,'text-anchor':'middle',style:'fill:'+C.yellow+';font-size:15px'},g);lt.textContent=t<.5?'parte appresa':'tutto appreso, da un capo all\'altro';
    res.innerHTML=t<.5?'<b>«Good Old Fashioned AI».</b> Le features sono scelte da una persona; dai dati si impara solo il classificatore finale. Il problema di ottimizzazione è tipicamente <em>convesso</em>: ha un solo fondo da trovare (lezione 2).':'<b>Deep learning.</b> Ogni strato ha i suoi parametri e si impara tutto insieme (<em>end-to-end</em>). Il problema di ottimizzazione non è più convesso: i fondi possibili sono tanti.'}
  player(st,N,6,draw);
};

/* perché non numerare le categorie */
FIG.enc2=function(st){
  const r=rng(4),mu=[5,1,4],D=[];for(let c=0;c<3;c++)for(let i=0;i<7;i++)D.push([c,mu[c]+0.5*r.n()]);
  const gm=[0,1,2].map(c=>{const v=D.filter(d=>d[0]===c).map(d=>d[1]);return v.reduce((s,x)=>s+x,0)/v.length});
  const w=lstsq(D.map(d=>[1,d[0]+1]),D.map(d=>d[1])),lin=c=>w[0]+w[1]*(c+1);
  const duo=H('div',{class:'duo'},st),nm=['a','b','c'];
  [['Numeri interi: a = 1, b = 2, c = 3',lin],['Una posizione per categoria',c=>gm[c]]].forEach((a,k)=>{const d=H('div',null,duo),p=Plot(d,{W:420,H:300,m:[36,10,10,30],xr:[0.4,3.6],yr:[-0.5,6.5],label:a[0]});
    p.axes([1,2,3],[0,2,4,6],null,'risposta',v=>nm[v-1]);
    if(k===0)S('line',{x1:p.sx(0.5),y1:p.sy(w[0]+w[1]*0.5),x2:p.sx(3.5),y2:p.sy(w[0]+w[1]*3.5),stroke:C.yellow,'stroke-width':2.5},p.g);
    D.forEach((q,i)=>S('circle',{cx:p.sx(q[0]+1)+((i%7)-3)*5,cy:p.sy(q[1]),r:3.5,fill:C.green,opacity:.8},p.g));
    [0,1,2].forEach(c=>S('line',{x1:p.sx(c+1)-26,x2:p.sx(c+1)+26,y1:p.sy(a[1](c)),y2:p.sy(a[1](c)),stroke:C.yellow,'stroke-width':4},p.g));
    const m=D.reduce((s,q)=>s+Math.abs(q[1]-a[1](q[0])),0)/D.length;cap(d,`<b>${a[0]}</b><br>in media il modello sbaglia di ${nf(m,2)}`)});
};

/* le due codifiche, fianco a fianco */
FIG.encode=function(st){
  let cat=0;const nm=['a','b','c'];
  const lab=H('div',{class:'ctl'},st);H('span',{class:'ctl-l'},lab,'Scegli la categoria di '+K('x'));
  buttons(lab,nm.map(n=>'«'+n+'»'),cat,i=>{cat=i;draw()});
  const duo=H('div',{class:'duo panels'},st),A=H('div',{class:'panel'},duo),B=H('div',{class:'panel'},duo);
  function vec(v,heads){return '<div class="vrow">'+v.map((x,j)=>`<div class="vcell${x?' on':''}"><small>${heads[j]}</small>${x}</div>`).join('')+'</div>'}
  function draw(){const oh=[0,1,2].map(j=>j===cat?1:0),du=[0,1].map(j=>j===cat?1:0);
    A.innerHTML='<div class="ptitle">Codifica one-hot</div>'+vec(oh,['è a?','è b?','è c?'])+'<div class="sub">tre posizioni, esattamente un 1</div>';
    B.innerHTML='<div class="ptitle">Codifica dummy</div>'+vec(du,['è a?','è b?'])+`<div class="sub">due posizioni; «c» è il riferimento${cat===2?': <b>tutti zeri</b>':''}</div>`}
  draw();
};

/* la ridondanza della one-hot con l'intercetta */
FIG.redund=function(st){
  let t=0;const mu=[5,1,4],nm=['a','b','c'];
  slider(st,'Intercetta',-2,6,0.5,t,v=>nf(v,1),v=>{t=v;draw()});
  legend(st,[['#fff','intercetta'],[C.yellow,'peso della categoria'],[C.green,'previsione','dot']]);
  const p=Plot(st,{W:600,H:300,m:[40,10,12,30],xr:[0.4,3.6],yr:[-2.5,6.8],label:'Intercetta più peso per ciascuna categoria'});p.axes([1,2,3],[-2,0,2,4,6],null,null,v=>nm[v-1]);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#555'},p.bg);
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';mu.forEach((m,c)=>{const X=p.sx(c+1);
      arrow(g,X-16,p.sy(0),X-16,p.sy(t)+(t===0?0:0),'#fff',3);arrow(g,X+16,p.sy(t),X+16,p.sy(m),C.yellow,3);
      S('line',{x1:X-30,x2:X+30,y1:p.sy(t),y2:p.sy(t),stroke:'#777','stroke-dasharray':'3 4'},g);S('circle',{cx:X+16,cy:p.sy(m),r:6,fill:C.green},g)});
    res.innerHTML=`Intercetta ${nf(t,1)}, pesi (${mu.map(m=>nf(m-t,1)).join('; ')}): le previsioni restano <span style="color:${C.green}">5; 1; 4</span>.<br>`+(t===4?'<span class="ok">Con l\'intercetta a 4 il peso di «c» è zero: è esattamente la codifica dummy con «c» come riferimento.</span>':'Qualunque valore dell\'intercetta va bene: i dati non possono sceglierne uno.')}
  draw();
};

/* un paesaggio non convesso */
FIG.landscape=function(st){
  const svg=Svg(st,600,330,'Superficie con molti picchi e avvallamenti'),g=S('g',null,svg);
  const f=(x,y)=>0.35*(x*x+y*y)*0.25+0.55*Math.sin(2.1*x+0.5)*Math.cos(1.7*y)+0.35*Math.sin(3.3*y+x)+0.25*Math.cos(4*x-1.3*y);
  const P=proj3(-0.65,0.62,300,150,62,[0,0,0.4]);wire(g,P,f,[-3,3],[-3,3],22,C.blue,.6);
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,clamp,Plot,drag,slider,player,out,legend,arrow,cap}=M;
const ez=t=>t*t*(3-2*t);
/* piano con la stessa scala sui due assi e curve di livello di a·w1² + b·w2² */
function plane(host,o){const W=o.W||600,Hh=o.H||400,m=[10,10,10,10],aw=W-20,ah=Hh-20,sp=(o.xr[1]-o.xr[0])*ah/aw,p=Plot(host,{W,H:Hh,m,xr:o.xr,yr:[o.yc-sp/2,o.yc+sp/2],label:o.label}),u=aw/(o.xr[1]-o.xr[0]);
  for(let i=1;i<=(o.n||14);i++){const c=(o.k||0.5)*i*i;S('ellipse',{cx:p.sx(0),cy:p.sy(0),rx:Math.sqrt(c/o.a)*u,ry:Math.sqrt(c/o.b)*u,fill:'none',stroke:C.blue,opacity:.65},p.bg)}
  S('circle',{cx:p.sx(0),cy:p.sy(0),r:4,fill:C.pink},p.bg);S('rect',{x:p.ax+.5,y:p.ay+.5,width:aw-1,height:ah-1,fill:'none',stroke:'#333'},p.top);p.u=u;return p}
const lab=(g,x,y,t,c,an)=>{const e=S('text',{x,y,'text-anchor':an||'middle'},g);e.style.fill=c||'#ddd';e.style.fontSize='14px';e.textContent=t;return e};

/* ---------- minimo locale e minimo globale ---------- */
FIG.locglob=function(st){
  const f=x=>0.15*x*x*x*x-0.9*x*x+0.35*x+2.5,MIN=[];for(let x=-2.9;x<2.9;x+=0.001)if(f(x)<f(x-0.001)&&f(x)<f(x+0.001))MIN.push(x);
  const gmin=MIN.reduce((a,b)=>f(a)<f(b)?a:b);let x0=MIN.find(x=>x!==gmin),r=0.8;
  slider(st,'Ampiezza del vicinato',0.2,3,0.05,r,v=>nf(v,2),v=>{r=v;draw()});
  const p=Plot(st,{W:600,H:320,m:[14,12,14,36],xr:[-3,3],yr:[0,4.8],label:'Una curva con due avvallamenti e un punto trascinabile'});p.axes([-3,-2,-1,0,1,2,3],null,'valore del parametro');
  const band=S('rect',{y:p.ay,height:p.ah,fill:'rgba(255,255,0,.10)',stroke:'rgba(255,255,0,.35)'},p.g);S('path',{d:p.curve(f,-3,3,400),fill:'none',stroke:C.pink,'stroke-width':2.6},p.g);
  const low=S('circle',{r:6,fill:C.red,stroke:'#000'},p.g),pt=S('circle',{r:9,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){const a=Math.max(-3,x0-r),b=Math.min(3,x0+r);band.setAttribute('x',p.sx(a));band.setAttribute('width',p.sx(b)-p.sx(a));pt.setAttribute('cx',p.sx(x0));pt.setAttribute('cy',p.sy(f(x0)));
    let bx=x0;for(let x=a;x<=b;x+=0.002)if(f(x)<f(bx))bx=x;const isLow=f(bx)>f(x0)-0.004,isG=Math.abs(x0-gmin)<1e-6;low.setAttribute('opacity',isLow?0:1);low.setAttribute('cx',p.sx(bx));low.setAttribute('cy',p.sy(f(bx)));
    res.innerHTML=isLow?(isG?'<span class="ok">Nel vicinato giallo nessun punto è più basso, e resta vero comunque lo si allarghi: è il minimo globale.</span>':'<span class="ok">Nel vicinato giallo nessun punto è più basso: è un minimo locale.</span> Allarga il vicinato e guarda se resta vero.')
      :'<span class="ko">Nel vicinato giallo c\'è un punto più basso</span> (in rosso): '+(MIN.some(m=>Math.abs(m-x0)<1e-6)?'questo minimo è solo locale, non globale.':'qui non c\'è un minimo.')}
  drag(p,p.svg,(x)=>{x0=clamp(x,-2.9,2.9);const s=MIN.find(m=>Math.abs(m-x0)<0.09);if(s!=null)x0=s;draw()});draw();
};

/* ---------- la derivata come effetto di una piccola spinta ---------- */
FIG.nudge1=function(st){
  const f=w=>(w-2.5)*(w-2.5)+1.25,d=w=>2*(w-2.5);let w0=1,h=0.8;
  slider(st,'Spostamento di '+K('\\Ws'),0.02,1,0.02,h,v=>nf(v,2),v=>{h=v;draw()});
  legend(st,[[C.yellow,'spostamento del parametro'],[C.pink,'variazione del costo'],[C.teal,'retta tangente: la pendenza']]);
  const p=Plot(st,{W:600,H:340,m:[40,12,14,40],xr:[0,5],yr:[0,8],label:'Il costo del modello costante e l\'effetto di un piccolo spostamento'});p.axes([0,1,2,3,4,5],[0,2,4,6,8],'parametro w','costo');
  S('path',{d:p.curve(f,0,5,300),fill:'none',stroke:'#bbb','stroke-width':2.2},p.g);
  const tan=S('line',{stroke:C.teal,'stroke-width':2.2},p.g),hs=S('line',{stroke:C.yellow,'stroke-width':4},p.g),vs=S('line',{stroke:C.pink,'stroke-width':4},p.g),q=S('circle',{r:5,fill:'#fff'},p.g),pt=S('circle',{r:9,fill:C.yellow,stroke:'#000','stroke-width':2,class:'hd'},p.g),res=out(st);res.style.minHeight='5em';
  function draw(){const y0=f(w0),w1=w0+h,y1=f(w1),s=d(w0);pt.setAttribute('cx',p.sx(w0));pt.setAttribute('cy',p.sy(y0));
    hs.setAttribute('x1',p.sx(w0));hs.setAttribute('x2',p.sx(w1));hs.setAttribute('y1',p.sy(y0));hs.setAttribute('y2',p.sy(y0));vs.setAttribute('x1',p.sx(w1));vs.setAttribute('x2',p.sx(w1));vs.setAttribute('y1',p.sy(y0));vs.setAttribute('y2',p.sy(y1));q.setAttribute('cx',p.sx(w1));q.setAttribute('cy',p.sy(y1));
    tan.setAttribute('x1',p.sx(w0-1.6));tan.setAttribute('x2',p.sx(w0+1.6));tan.setAttribute('y1',p.sy(y0-1.6*s));tan.setAttribute('y2',p.sy(y0+1.6*s));
    const dy=y1-y0;res.innerHTML=`Spostando ${K('\\Ws')} di ${nf(h,2)} il costo cambia di <b>${nf(dy,2)}</b>: ${nf(dy/h,2)} per ogni unità di spostamento. Con spostamenti sempre più piccoli questo rapporto tende a <b>${nf(s,2)}</b>, la pendenza della curva in quel punto.<br>${Math.abs(s)<0.05?'Pendenza zero: siamo sul fondo.':s<0?'Pendenza negativa: andando a destra il costo scende.':'Pendenza positiva: andando a destra il costo sale.'}`}
  drag(p,p.svg,(x)=>{w0=Math.round(clamp(x,0.2,3.9)*20)/20;draw()});draw();
};

/* ---------- il gradiente: una sensibilità per parametro ---------- */
FIG.gradparts=function(st){
  let w=[1.9,0.9];legend(st,[[C.yellow,'sensibilità a '+K('\\Ws_1')],[C.orange,'sensibilità a '+K('\\Ws_2')],[C.teal,'gradiente']]);
  const p=plane(st,{xr:[-1.4,4.4],yc:0.7,a:1,b:2,label:'Curve di livello del costo e gradiente in un punto trascinabile'}),g=S('g',null,p.g),res=out(st);res.style.minHeight='5em';
  lab(p.top,p.ax+p.aw-10,p.sy(0)-8,'w₁','#999','end');lab(p.top,p.sx(0)+8,p.ay+18,'w₂','#999','start');S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#333'},p.bg);
  function draw(){g.textContent='';const gr=[2*w[0],4*w[1]],k=0.22,cx=p.sx(w[0]),cy=p.sy(w[1]),ex=cx+gr[0]*k*p.u,ey=cy-gr[1]*k*p.u;
    S('line',{x1:ex,y1:cy,x2:ex,y2:ey,stroke:C.orange,'stroke-width':1.5,'stroke-dasharray':'4 4'},g);S('line',{x1:cx,y1:ey,x2:ex,y2:ey,stroke:C.yellow,'stroke-width':1.5,'stroke-dasharray':'4 4'},g);
    if(Math.abs(gr[0])>0.15)arrow(g,cx,cy,ex,cy,C.yellow,3);if(Math.abs(gr[1])>0.15)arrow(g,cx,cy,cx,ey,C.orange,3);arrow(g,cx,cy,ex,ey,C.teal,3.5);S('circle',{cx,cy,r:9,fill:'#fff',stroke:'#000','stroke-width':2,class:'hd'},g);
    res.innerHTML=`Spostando solo ${K('\\Ws_1')} di 0,1 il costo cambia di circa ${nf(gr[0]*0.1,2)}; spostando solo ${K('\\Ws_2')} di 0,1, di circa ${nf(gr[1]*0.1,2)}.<br>Il gradiente è la freccia che ha queste due sensibilità come componenti: <b>(${nf(gr[0],1)}; ${nf(gr[1],1)})</b>. Punta dove il costo sale più in fretta.`}
  drag(p,p.svg,(x,y)=>{w=[Math.round(clamp(x,-1.1,3.2)*10)/10,Math.round(clamp(y,-0.9,2.0)*10)/10];draw()});draw();
};

/* ---------- quanto lungo: il costo lungo la direzione opposta al gradiente ---------- */
FIG.steplen=function(st){
  const w0=[1.7,1.0],gr=[3.4,4],f=q=>q[0]*q[0]+2*q[1]*q[1],at=e=>[w0[0]-e*gr[0],w0[1]-e*gr[1]],L0=f(w0);let eta=0.1;
  slider(st,'Lunghezza del passo',0,0.8,0.01,eta,v=>nf(v,2),v=>{eta=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const p=plane(dl,{W:420,H:330,xr:[-2.6,2.6],yc:-0.4,a:1,b:2,n:10,label:'Il passo sulla mappa delle curve di livello'}),g=S('g',null,p.g);
  S('line',{x1:p.sx(at(-0.1)[0]),y1:p.sy(at(-0.1)[1]),x2:p.sx(at(0.85)[0]),y2:p.sy(at(0.85)[1]),stroke:'#666','stroke-dasharray':'4 4'},p.bg);
  const q=Plot(dr,{W:420,H:330,m:[40,12,12,40],xr:[0,0.8],yr:[0,9],label:'Il costo al variare della lunghezza del passo'});q.axes([0,0.2,0.4,0.6,0.8],[0,3,6,9],'lunghezza del passo','costo');
  S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(L0),y2:q.sy(L0),stroke:'#888','stroke-dasharray':'5 4'},q.g);lab(q.g,q.sx(0.32),q.sy(L0)-7,'costo di partenza','#aaa');
  S('path',{d:q.curve(e=>f(at(e)),0,0.8,200),fill:'none',stroke:C.pink,'stroke-width':2.6},q.g);const dq=S('circle',{r:7,fill:C.yellow,stroke:'#000'},q.g);
  cap(dl,'<b>la mappa</b>: il passo va in direzione opposta al gradiente');cap(dr,'<b>il costo</b> nel punto di arrivo');const res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const e=at(eta),L=f(e);arrow(g,p.sx(w0[0]),p.sy(w0[1]),p.sx(e[0]),p.sy(e[1]),C.yellow,3);S('circle',{cx:p.sx(w0[0]),cy:p.sy(w0[1]),r:6,fill:'#fff',stroke:'#000'},g);S('circle',{cx:p.sx(e[0]),cy:p.sy(e[1]),r:6,fill:C.yellow,stroke:'#000'},g);
    dq.setAttribute('cx',q.sx(eta));dq.setAttribute('cy',q.sy(L));
    res.innerHTML=`Costo di partenza ${nf(L0,2)}, dopo il passo <b>${nf(L,2)}</b>. `+(eta===0?'':L<L0-1e-9?(eta<0.25?'<span class="ok">Il costo scende.</span>':'<span class="ok">Il costo è ancora più basso di prima</span>, ma il passo ha già scavalcato il punto più basso della direzione.'):'<span class="ko">Il passo è troppo lungo: si finisce più in alto di prima.</span>')}
  draw();
};

/* ---------- gradient descent, un passo alla volta ---------- */
FIG.gdsteps=function(st){
  const eta=0.15,f=q=>q[0]*q[0]+2*q[1]*q[1],P=[[3.0,1.6]];for(let t=0;t<9;t++){const w=P[t];P.push([w[0]-eta*2*w[0],w[1]-eta*4*w[1]])}
  legend(st,[[C.teal,'gradiente: la salita più ripida'],[C.yellow,'passo: dalla parte opposta']]);
  const p=plane(st,{xr:[-1.4,4.4],yc:0.9,a:1,b:2,label:'Gradient descent passo per passo'}),g=S('g',null,p.g),res=out(st),PER=18,n=P.length-1;
  player(st,n*PER+6,8,pos=>{g.textContent='';const fin=pos>=n*PER,k=Math.min(n-1,Math.floor(pos/PER)),fr=fin?1:pos/PER-k,w=P[k],v=P[k+1],sx=q=>p.sx(q[0]),sy=q=>p.sy(q[1]);
    const d=P.slice(0,k+1);if(d.length>1)S('path',{d:p.poly(d),fill:'none',stroke:'#fff','stroke-width':1.5,opacity:.7},g);d.forEach(q=>S('circle',{cx:sx(q),cy:sy(q),r:3.5,fill:'#fff'},g));
    const a1=ez(clamp(fr/0.3,0,1)),a2=ez(clamp((fr-0.3)/0.3,0,1)),a3=ez(clamp((fr-0.62)/0.38,0,1)),up=[w[0]+(w[0]-v[0]),w[1]+(w[1]-v[1])],cur=[w[0]+(v[0]-w[0])*a3,w[1]+(v[1]-w[1])*a3];
    if(!fin){const gA=S('g',{opacity:a1*(1-a3*0.75)},g);arrow(gA,sx(w),sy(w),sx(w)+(sx(up)-sx(w))*a1,sy(w)+(sy(up)-sy(w))*a1,C.teal,3);
      if(a2>0){const gB=S('g',{opacity:a2},g);arrow(gB,sx(w),sy(w),sx(w)+(sx(v)-sx(w))*a2,sy(w)+(sy(v)-sy(w))*a2,C.yellow,3)}}
    else S('path',{d:p.poly(P),fill:'none',stroke:'#fff','stroke-width':1.5,opacity:.7},g);
    S('circle',{cx:sx(fin?P[n]:cur),cy:sy(fin?P[n]:cur),r:8,fill:C.yellow,stroke:'#000','stroke-width':2},g);
    res.innerHTML=fin?`Dopo ${n} passi il costo è sceso da ${nf(f(P[0]),2)} a <b>${nf(f(P[n]),2)}</b>. I passi si accorciano da soli: vicino al fondo la pendenza è piccola.`
      :`<b>Passo ${k+1}.</b> ${fr<0.3?'Si calcola il gradiente nel punto in cui ci si trova.':fr<0.62?'Si prende la direzione opposta, accorciata dallo step size (qui 0,15).':'Ci si sposta.'} Costo: ${nf(f(cur),2)}.`});
};

/* ---------- una direzione per volta: perché la valle stretta rallenta ---------- */
FIG.percoord=function(st){
  let eta=0.055;const T=9,X0=[2.6,4.4];
  slider(st,'Step size '+K('\\Et'),0.005,0.12,0.005,eta,v=>nf(v,3),v=>{eta=v;draw()});
  const sv=M.Svg(st,600,300,'Le due coordinate del punto, ciascuna sulla sua retta, passo dopo passo'),g=S('g',null,sv),res=out(st);res.style.minHeight='5em';
  const R=[{t:'direzione ripida (curvatura 20)',c:C.yellow,y:92,lim:3.2,cv:20},{t:'direzione piatta (curvatura 2)',c:C.orange,y:232,lim:5,cv:2}];
  const X=(v,lim)=>300+v/lim*270;
  function draw(){g.textContent='';const msg=[];R.forEach((r,i)=>{const fac=1-eta*r.cv;lab(g,30,r.y-58,r.t,'#ddd','start');S('line',{x1:30,x2:570,y1:r.y,y2:r.y,stroke:'#777'},g);S('line',{x1:X(0,r.lim),x2:X(0,r.lim),y1:r.y-9,y2:r.y+9,stroke:C.pink,'stroke-width':3},g);lab(g,X(0,r.lim),r.y+30,'minimo',C.pink);
      let x=X0[i];for(let t=0;t<T;t++){const nx=x*fac,a=X(clamp(x,-r.lim,r.lim),r.lim),b=X(clamp(nx,-r.lim,r.lim),r.lim),hh=Math.min(42,10+Math.abs(b-a)*0.4);
        S('path',{d:`M${a} ${r.y}Q${(a+b)/2} ${r.y-hh*1.9} ${b} ${r.y}`,fill:'none',stroke:r.c,'stroke-width':1.6,opacity:Math.max(0.25,1-t*0.09)},g);S('circle',{cx:a,cy:r.y,r:t?4:7,fill:t?r.c:'#fff',stroke:'#000'},g);x=nx}
      S('circle',{cx:X(clamp(x,-r.lim,r.lim),r.lim),cy:r.y,r:4,fill:r.c,stroke:'#000'},g);
      msg.push(`${i?'Direzione piatta':'Direzione ripida'}: a ogni passo la distanza dal minimo viene moltiplicata per <b>${nf(fac,2)}</b>`+(Math.abs(fac)>1+1e-9?' <span class="ko">(si allontana: diverge)</span>':fac<-1e-9?' (cambia lato ogni volta: rimbalza)':fac>0.8?' (si avvicina, ma piano)':'')+'.')});
    res.innerHTML=msg.join('<br>')}
  draw();
};
/* ================= formule spiegate nel riquadro ================= */
const FORM=M.FORM={};
const tx=t=>t.replace(/\\\((.+?)\\\)/g,(m,a)=>K(a));
FIG.formula=function(st,o){const sp=FORM[o.id];if(!sp){st.textContent='Formula non disponibile.';return}
  const tex=sp.tex.replace(/⟦(\d+)\|([^⟧]*)⟧/g,(m,k,t)=>`\\htmlClass{fp fp${k}}{${t}}`),box=H('div',{class:'fx'},st,K('\\displaystyle '+tex)),res=out(st),n=sp.parts.length,PER=30,els=sp.parts.map((q,k)=>[...box.querySelectorAll('.fp'+k)]);
  let last=-9;const pl=player(st,(n+2)*PER,8,pos=>{const k=Math.min(n+1,Math.floor(pos/PER))-1;if(k===last)return;last=k;
    els.forEach((a,i)=>a.forEach(e=>{e.classList.toggle('on',i===k);e.classList.toggle('dim',k>=0&&k<n&&i!==k)}));box.classList.toggle('focus',k>=0&&k<n);
    res.innerHTML=k<0?tx(sp.intro):k>=n?tx(sp.ex):`<b>${tx(sp.parts[k].n)}.</b> ${tx(sp.parts[k].e)}`});
  els.forEach((a,i)=>a.forEach(e=>{e.style.cursor='pointer';e.addEventListener('click',()=>pl.seek((i+1)*PER+1))}));
};
const R=String.raw;
FORM.cost={tex:R`⟦0|\cL(\Wv)⟧\;=\;⟦1|\frac1N\sum_{i=1}^{N}⟧\ ⟦2|\cl(e_i)⟧`,intro:'Premi play, o tocca un pezzo della formula per vedere che cosa dice.',
  parts:[{n:'Il costo',e:'Un solo numero che dice quanto vanno male i parametri \\(\\Wv\\). È quello che vogliamo rendere piccolo.'},{n:'La media sui dati',e:'Si sommano i contributi di tutti gli \\(N\\) dati e si divide per \\(N\\).'},{n:'Il costo di un errore',e:'\\(e_i\\) è l\'errore sul dato \\(i\\): risposta giusta meno previsione. La loss \\(\\cl\\) lo trasforma in un costo.'}],
  ex:'<b>Esempio.</b> Tre dati con errori 1, −2 e 3 e loss «errore al quadrato»: i costi sono 1, 4 e 9, la media è 4,67.'};
FORM.msemae={tex:R`\begin{aligned}\cL_{\text{mse}}(\Wv)&=⟦0|\frac1N\sum_{i=1}^{N}⟧\ ⟦2|\big(⟧⟦1|\Yy_i-\Ff_{\Wv}(\Xs_i)⟧⟦2|\big)^2⟧\\[.5em]\cL_{\text{mae}}(\Wv)&=⟦0|\frac1N\sum_{i=1}^{N}⟧\ ⟦3|\big|⟧⟦1|\Yy_i-\Ff_{\Wv}(\Xs_i)⟧⟦3|\big|⟧\end{aligned}`,intro:'Le due formule sono uguali tranne che in un punto. Premi play per vederlo.',
  parts:[{n:'La media',e:'Uguale nelle due formule: si fa la media su tutti i dati.'},{n:'L\'errore',e:'Uguale anche questo: la risposta giusta \\(\\Yy_i\\) meno la previsione del modello \\(\\Ff_{\\Wv}(\\Xs_i)\\).'},{n:'MSE: il quadrato',e:'Un errore di 2 costa 4, uno di 14 costa 196. Gli errori grandi pesano moltissimo.'},{n:'MAE: il valore assoluto',e:'Un errore di 2 costa 2, uno di 14 costa 14. Il costo cresce in proporzione all\'errore.'}],
  ex:'<b>Esempio.</b> Errori 1, 1, 1, 14. MSE: (1 + 1 + 1 + 196) / 4 = 49,75, quasi tutto dovuto a un solo dato. MAE: (1 + 1 + 1 + 14) / 4 = 4,25.'};
FORM.convex={tex:R`⟦0|f\big(⟧⟦2|(1-\alpha)x+\alpha y⟧⟦0|\big)⟧\;\le\;⟦1|(1-\alpha)f(x)+\alpha f(y)⟧`,intro:'È la frase sulla corda scritta in simboli. Premi play.',
  parts:[{n:'L\'altezza del grafico',e:'Il valore della funzione in un punto fra \\(x\\) e \\(y\\).'},{n:'L\'altezza della corda',e:'La stessa miscela, ma fatta sulle due altezze \\(f(x)\\) e \\(f(y)\\): è il punto corrispondente sul segmento che unisce i due punti del grafico.'},{n:'Il punto intermedio',e:'\\(\\alpha\\) va da 0 a 1: con 0 si è in \\(x\\), con 1 in \\(y\\), con 0,5 a metà strada.'}],
  ex:'<b>Esempio</b> con \\(f(x)=x^2\\), fra 0 e 2, a metà strada: il grafico vale \\(1^2=1\\), la corda vale \\((0+4)/2=2\\). Il grafico sta sotto.'};
FORM.grad={tex:R`⟦0|\Gr\cL(\Wv)⟧\;=\;\Big(⟦1|\frac{\partial\cL}{\partial\Ws_1}⟧,\ ⟦2|\frac{\partial\cL}{\partial\Ws_2}⟧,\ ⟦3|\dots⟧\Big)`,intro:'Il gradiente scritto in simboli. Premi play.',
  parts:[{n:'Il gradiente',e:'Si scrive con un triangolo rovesciato, «nabla». È un vettore: una freccia nello spazio dei parametri.'},{n:'La sensibilità al primo parametro',e:'Di quanto cambia il costo spostando di poco solo \\(\\Ws_1\\). Il simbolo \\(\\partial\\) ricorda che gli altri parametri restano fermi.'},{n:'La sensibilità al secondo',e:'Lo stesso, spostando solo \\(\\Ws_2\\).'},{n:'E così via',e:'Una componente per ogni parametro: con un milione di parametri il gradiente ha un milione di numeri.'}],
  ex:'<b>Esempio.</b> Nella figura qui sopra, nel punto di partenza, le due sensibilità sono 3,8 e 3,6: il gradiente è la freccia (3,8; 3,6).'};
FORM.gd={tex:R`⟦0|\Wv_{t+1}⟧\;=\;⟦1|\Wv_t⟧\;⟦2|-⟧\;⟦3|\Et⟧\;⟦4|\Gr\cL(\Wv_t)⟧`,intro:'Un passo di gradient descent in simboli. Premi play.',
  parts:[{n:'Il nuovo punto',e:'I parametri dopo il passo.'},{n:'Il punto attuale',e:'I parametri prima del passo. L\'indice \\(t\\) conta i passi.'},{n:'Il segno meno',e:'Si va dalla parte opposta al gradiente, perché il gradiente punta in salita.'},{n:'Lo step size',e:'Un numero positivo, di solito piccolo, che accorcia il passo.'},{n:'Il gradiente',e:'Calcolato nel punto attuale: dice dove il costo sale più in fretta.'}],
  ex:'<b>Esempio</b> dall\'animazione: punto (3,0; 1,6), gradiente (6,0; 6,4), step size 0,15. Nuovo punto: (3,0 − 0,9; 1,6 − 0,96) = (2,1; 0,64).'};
FORM.factor={tex:R`⟦0|\tilde{\Ws}_i^{(t+1)}⟧\;=\;⟦1|(1-\Et\lambda_i)⟧\ ⟦2|\tilde{\Ws}_i^{(t)}⟧`,intro:'La regola che la figura mostra, per una direzione. Premi play.',
  parts:[{n:'La distanza dopo il passo',e:'Quanto si è lontani dal minimo lungo la direzione \\(i\\), dopo il passo.'},{n:'Il fattore',e:'\\(\\lambda_i\\) è la curvatura della valle in quella direzione. Più è grande, più il fattore si allontana da 1, fino a diventare negativo.'},{n:'La distanza prima',e:'Quanto si era lontani prima del passo.'}],
  ex:'<b>Esempio</b> con step size 0,055. Direzione ripida, curvatura 20: fattore 1 − 1,1 = −0,1. Direzione piatta, curvatura 2: fattore 1 − 0,11 = 0,89.'};
FORM.mom={tex:R`\begin{aligned}⟦0|v_{t+1}⟧&=⟦1|\Wv_t-\alpha\,\Gr f(\Wv_t)⟧\\[.4em]⟦3|\Wv_{t+1}⟧&=⟦0|v_{t+1}⟧+⟦2|\beta\,(v_{t+1}-v_t)⟧\end{aligned}`,intro:'Il momentum in due righe. Premi play.',
  parts:[{n:'Il punto «di prova»',e:'Dove porterebbe il normale passo di discesa.'},{n:'Il normale passo di discesa',e:'Quello di prima, con step size \\(\\alpha\\).'},{n:'La spinta',e:'Una frazione \\(\\beta\\) dello spostamento fra gli ultimi due punti di prova. Se i passi vanno sempre dalla stessa parte, le spinte si sommano; se rimbalzano, si cancellano.'},{n:'Il nuovo punto',e:'Il punto di prova più la spinta.'}],
  ex:'Con \\(\\beta=0\\) la spinta sparisce e si torna al gradient descent di prima.'};
FORM.sgd={tex:R`⟦0|\Wv_{t+1}⟧\;=\;⟦0|\Wv_t⟧-⟦0|\Et⟧\ ⟦1|\Gr\cl_{⟧⟦2|i_t⟧⟦1|}(\Wv_t)⟧`,intro:'Un passo di SGD. Cambia una sola cosa rispetto al gradient descent. Premi play.',
  parts:[{n:'Come prima',e:'Nuovo punto, punto attuale e step size sono quelli del gradient descent.'},{n:'Il gradiente di un solo esempio',e:'Non il gradiente del costo medio \\(\\cL\\), ma quello della loss \\(\\cl\\) su un dato soltanto.'},{n:'Quale esempio',e:'L\'indice \\(i_t\\) viene estratto a caso a ogni passo, con la stessa probabilità per tutti i dati.'}],
  ex:'Con un milione di dati, un passo di SGD costa un milionesimo di un passo di gradient descent.'};
FORM.pen={tex:R`\min_{\Wv}\ \ ⟦0|\cL(\Wv)⟧+⟦1|\rho⟧\ ⟦2|P(\Wv)⟧`,intro:'Il problema con la penalità. Premi play.',
  parts:[{n:'Il costo',e:'Quello di sempre.'},{n:'La severità',e:'Un numero positivo: quanto si fa pagare ogni uscita dall\'insieme.'},{n:'La penalità',e:'Vale zero dentro l\'insieme ammesso e cresce allontanandosi. Una scelta comune è il quadrato della distanza dall\'insieme.'}],
  ex:'Alzando la severità, il minimo di questa somma si avvicina al minimo del problema con il vincolo.'};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,clamp,rng,Plot,player,out,arrow,Svg}=M;
const ez=t=>t*t*(3-2*t),R=String.raw,tx=t=>t.replace(/\\\((.+?)\\\)/g,(m,a)=>K(a));
const lab=(g,x,y,t,c,an,sz)=>{const e=S('text',{x,y,'text-anchor':an||'middle'},g);e.style.fill=c||'#ddd';e.style.fontSize=(sz||14)+'px';e.textContent=t;return e};
const BUILD=M.BUILD={};

/* Una formula costruita un pezzo alla volta: a ogni passo una domanda (perché serve il pezzo),
   una scena concreta con i numeri, e il pezzo nuovo che compare nella formula. */
FIG.build=function(st,o){const sp=BUILD[o.id];if(!sp){st.textContent='Figura non disponibile.';return}
  const q=H('div',{class:'bq'},st),host=H('div',{class:'bs'},st),upd=sp.scene(host);
  const tex=sp.tex.replace(/⟦(\d+)\|([^⟧]*)⟧/g,(m,k,t)=>`\\htmlClass{fp fp${k}}{${t}}`),box=H('div',{class:'fx'},st,K('\\displaystyle '+tex)),res=out(st);
  const ids=[...new Set([].concat(...sp.steps.map(s=>s.add)))],els={};ids.forEach(k=>els[k]=[...box.querySelectorAll('.fp'+k)]);
  const n=sp.steps.length,PER=44;let last=-9;
  player(st,n*PER+10,8,pos=>{const fin=pos>=n*PER,k=Math.min(n-1,Math.floor(pos/PER)),fr=fin?1:pos/PER-k,key=fin?99:k;
    if(key!==last){last=key;const vis=new Set([].concat(...sp.steps.slice(0,k+1).map(s=>s.add))),hot=new Set(fin?[]:sp.steps[k].add);
      ids.forEach(i=>els[i].forEach(e=>{e.classList.toggle('off',!vis.has(i));e.classList.toggle('on',hot.has(i))}));
      q.innerHTML=tx(fin&&sp.end?sp.end:sp.steps[k].q);res.innerHTML=tx(sp.steps[k].say)}
    upd(k,fr,fin)});
};

/* ---------- 1. il costo: errore → loss → somma → media ---------- */
BUILD.cost={tex:R`⟦5|\cL(\Wv)\;=\;⟧⟦4|\frac1N⟧⟦3|\sum_{i=1}^{N}⟧\ ⟦2|\cl\big(⟧⟦1|e_i⟧⟦2|\big)⟧`,end:'Ecco il costo: la media dei costi dei singoli errori.',
  steps:[{q:'Il modello prevede sempre 2. Quanto sbaglia su un dato?',add:[1],say:'L\'<b>errore</b> sul dato numero \\(i\\): la risposta giusta meno la previsione. Sul dato 4 l\'errore è 4 − 2 = 2.'},
    {q:'Sbagliare di −1 o di +1 è ugualmente grave. Come si trasformano gli errori in costi?',add:[2],say:'Con una funzione, la <b>loss</b>. Qui il quadrato: gli errori −1, 0, 1, 2 diventano i costi 1, 0, 1, 4.'},
    {q:'I dati sono quattro. Come si tiene conto di tutti?',add:[3],say:'Si <b>sommano</b> i costi di tutti i dati: 1 + 0 + 1 + 4 = 6.'},
    {q:'Con il doppio dei dati la somma raddoppierebbe, anche senza sbagliare di più.',add:[4],say:'Si divide per il numero di dati \\(N\\): la <b>media</b>. Qui 6 / 4 = 1,5.'},
    {q:'Cambiando la previsione cambia il risultato.',add:[5],say:'È il <b>costo</b> dei parametri \\(\\Wv\\): un numero per ogni scelta possibile. Con la previsione 2 vale 1,5.'}],
  scene(host){const sv=Svg(host,600,250,'Quattro dati, una previsione, gli errori e i loro costi'),g=S('g',null,sv),X=v=>70+v*92,B=176,D=[1,2,3,4],w=2,U=26;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.45,0,1));S('line',{x1:X(0),x2:X(5),y1:B,y2:B,stroke:'#777'},g);[0,1,2,3,4,5].forEach(v=>lab(g,X(v),B+20,String(v),'#888',null,13));
      S('line',{x1:X(w),x2:X(w),y1:B-140,y2:B+6,stroke:C.yellow,'stroke-width':2,'stroke-dasharray':'5 4'},g);lab(g,X(w),B-148,'previsione',C.yellow);
      D.forEach(d=>{const e=d-w,c=e*e,es=String(e).replace('-','−');if(k>=1){const h=c*U*(k===1?t:1);S('rect',{x:X(d)-15,y:B-h,width:30,height:h,fill:C.pink,opacity:.85},g);lab(g,X(d),B+60,'costo '+c,C.pink,null,13)}
        if(k===0&&d===4){S('line',{x1:X(w),x2:X(w)+(X(d)-X(w))*t,y1:B-26,y2:B-26,stroke:'#fff','stroke-width':3},g);lab(g,X(3),B-36,'4 − 2 = 2','#fff',null,14)}
        if(k>=1||d===4)lab(g,X(d),B+42,'errore '+es,'#fff',null,13);
        S('circle',{cx:X(d),cy:B,r:6,fill:C.green,stroke:'#000'},g)});
      if(k>=2)lab(g,560,60,'somma = 6',C.pink,'end',16);
      if(k>=3){const y=B-1.5*U,a=k===3?t:1;S('line',{x1:X(0.6),x2:X(0.6)+(X(4.4)-X(0.6))*a,y1:y,y2:y,stroke:'#fff','stroke-dasharray':'6 4'},g);lab(g,560,84,'media = 1,5','#fff','end',16)}}}};

/* ---------- 2. MSE e MAE ---------- */
BUILD.msemae={tex:R`\begin{aligned}⟦2|\cL_{\text{mse}}(\Wv)⟧&⟦2|=\frac1N\sum_{i=1}^{N}⟧\ ⟦1|\big(⟧⟦0|\Yy_i-\Ff_{\Wv}(\Xs_i)⟧⟦1|\big)^2⟧\\[.5em]⟦4|\cL_{\text{mae}}(\Wv)⟧&⟦4|=\frac1N\sum_{i=1}^{N}⟧\ ⟦3|\big|⟧⟦3|\Yy_i-\Ff_{\Wv}(\Xs_i)⟧⟦3|\big|⟧\end{aligned}`,end:'Stessa media, loss diversa: l\'MSE è dominato dall\'errore più grande, il MAE no.',
  steps:[{q:'Quattro dati: su tre il modello sbaglia di 1, su uno di 14. Che cos\'è l\'errore, per esteso?',add:[0],say:'La risposta giusta \\(\\Yy_i\\) meno la previsione del modello, \\(\\Ff_{\\Wv}(\\Xs_i)\\).'},
    {q:'Prima scelta: gli errori grandi devono costare moltissimo.',add:[1],say:'Si eleva l\'errore al <b>quadrato</b>: 1 resta 1, ma 14 diventa 196.'},
    {q:'Poi la media, come prima.',add:[2],say:'È l\'<b>MSE</b>, errore quadratico medio: (1 + 1 + 1 + 196) / 4 = 49,75. Quasi tutto viene da un solo dato.'},
    {q:'Seconda scelta: ogni errore costa in proporzione a quanto è grande.',add:[3],say:'Si prende il <b>valore assoluto</b>: 1 resta 1 e 14 resta 14.'},
    {q:'Di nuovo la media.',add:[4],say:'È il <b>MAE</b>, errore assoluto medio: (1 + 1 + 1 + 14) / 4 = 4,25.'}],
  scene(host){const sv=Svg(host,600,230,'I costi di quattro errori con il quadrato e con il valore assoluto'),g=S('g',null,sv),E=[1,1,1,14],B=188,sc=160/196,X=i=>110+i*125;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));S('line',{x1:40,x2:560,y1:B,y2:B,stroke:'#777'},g);
      E.forEach((e,i)=>{lab(g,X(i),B+22,'errore '+e,'#fff',null,14);
        if(k>=1){const h=Math.max(1.5,e*e*sc*(k===1?t:1));S('rect',{x:X(i)-34,y:B-h,width:30,height:h,fill:C.pink},g);if(e>1||k<3)lab(g,X(i)-19,B-h-6,String(e*e),C.pink,null,13)}
        if(k>=3){const h=Math.max(1.5,e*sc*(k===3?t:1));S('rect',{x:X(i)+4,y:B-h,width:30,height:h,fill:C.orange},g);if(e>1)lab(g,X(i)+19,B-h-6,String(e),C.orange,null,13)}});
      if(k>=2){const y=B-49.75*sc;S('line',{x1:40,x2:40+(520)*(k===2?t:1),y1:y,y2:y,stroke:C.pink,'stroke-dasharray':'6 4'},g);lab(g,46,y-7,'media dei quadrati: 49,75',C.pink,'start',13)}
      if(k>=4){const y=B-4.25*sc;S('line',{x1:40,x2:40+520*(k===4?t:1),y1:y,y2:y,stroke:C.orange,'stroke-dasharray':'6 4'},g);lab(g,46,y-9,'media dei valori assoluti: 4,25',C.orange,'start',13)}}}};

/* ---------- 3. convessità ---------- */
BUILD.convex={tex:R`⟦1|f\big(⟧⟦0|(1-\alpha)\,x+\alpha\,y⟧⟦1|\big)⟧\;⟦3|\le⟧\;⟦2|(1-\alpha)\,f(x)+\alpha\,f(y)⟧`,end:'Convessa: fra due punti qualsiasi, il grafico resta sotto la corda.',
  steps:[{q:'Due punti sull\'asse, \\(x\\) e \\(y\\). Come si indica un punto qualunque fra i due?',add:[0],say:'Con un numero \\(\\alpha\\) fra 0 e 1 che dice a che punto del percorso siamo: 0 vuol dire \\(x\\), 1 vuol dire \\(y\\), 0,5 a metà.'},
    {q:'Quanto è alto il grafico sopra quel punto?',add:[1],say:'Si applica la funzione \\(f\\) al punto intermedio: è l\'<b>altezza del grafico</b>.'},
    {q:'E quanto è alta la corda, sopra lo stesso punto?',add:[2],say:'La stessa miscela, fatta però sulle due altezze \\(f(x)\\) e \\(f(y)\\): è l\'<b>altezza della corda</b>.'},
    {q:'Che cosa chiediamo a una funzione convessa?',add:[3],say:'Che il grafico non superi mai la corda, per ogni coppia di punti e ogni \\(\\alpha\\).'}],
  scene(host){const sv=Svg(host,600,260,'Una curva, una corda e un punto che scorre fra i due estremi'),g=S('g',null,sv),f=t=>0.3*(t-1.7)*(t-1.7)+0.3,X=t=>70+t*118,Y=v=>226-v*88,x=0.4,y=3.7;let d='';for(let i=0;i<=100;i++){const t=i/25;d+=(i?'L':'M')+X(t)+' '+Y(f(t))}
    return (k,fr)=>{g.textContent='';const al=0.5-0.38*Math.cos(2*Math.PI*fr),m=(1-al)*x+al*y,ch=(1-al)*f(x)+al*f(y);S('line',{x1:X(0),x2:X(4),y1:Y(0),y2:Y(0),stroke:'#777'},g);S('path',{d,fill:'none',stroke:'#bbb','stroke-width':2.2},g);
      [[x,'x'],[y,'y']].forEach(q=>{S('line',{x1:X(q[0]),x2:X(q[0]),y1:Y(0),y2:Y(f(q[0])),stroke:'#555','stroke-dasharray':'3 4'},g);S('circle',{cx:X(q[0]),cy:Y(f(q[0])),r:5,fill:'#fff'},g);const e=lab(g,X(q[0]),Y(0)+20,q[1],'#fff',null,17);e.style.fontStyle='italic'});
      if(k>=2)S('line',{x1:X(x),y1:Y(f(x)),x2:X(y),y2:Y(f(y)),stroke:C.teal,'stroke-width':2.2},g);
      if(k>=3)S('line',{x1:X(m),x2:X(m),y1:Y(f(m)),y2:Y(ch),stroke:C.green,'stroke-width':5,opacity:.8},g);
      else if(k>=1)S('line',{x1:X(m),x2:X(m),y1:Y(0),y2:Y(k>=2?ch:f(m)),stroke:'#777','stroke-dasharray':'3 4'},g);
      if(k>=1){S('circle',{cx:X(m),cy:Y(f(m)),r:6.5,fill:C.pink,stroke:'#000'},g);if(k===1)lab(g,X(m)+12,Y(f(m))+22,'grafico',C.pink,'start')}
      if(k>=2){S('circle',{cx:X(m),cy:Y(ch),r:6.5,fill:C.teal,stroke:'#000'},g);if(k===2)lab(g,X(m)+12,Y(ch)-10,'corda',C.teal,'start')}
      S('circle',{cx:X(m),cy:Y(0),r:6.5,fill:C.yellow,stroke:'#000'},g);lab(g,X(m),Y(0)-12,'α = '+nf(al,2),C.yellow,null,13)}}};

/* piano con curve di livello di w1² + 2·w2² e stessa scala sui due assi */
function plane(host,W,Hh,xr,yc,label){const m=[10,10,10,10],aw=W-20,ah=Hh-20,sp=(xr[1]-xr[0])*ah/aw,p=Plot(host,{W,H:Hh,m,xr,yr:[yc-sp/2,yc+sp/2],label}),u=aw/(xr[1]-xr[0]);
  for(let i=1;i<=14;i++){const c=0.5*i*i;S('ellipse',{cx:p.sx(0),cy:p.sy(0),rx:Math.sqrt(c)*u,ry:Math.sqrt(c/2)*u,fill:'none',stroke:C.blue,opacity:.6},p.bg)}
  S('circle',{cx:p.sx(0),cy:p.sy(0),r:4,fill:C.pink},p.bg);S('rect',{x:p.ax+.5,y:p.ay+.5,width:aw-1,height:ah-1,fill:'none',stroke:'#333'},p.top);return p}

M.bld={lab,plane,ez,tx};
/* ---------- 4. il gradiente ---------- */
BUILD.grad={tex:R`⟦3|\Gr\cL(\Wv)\;=\;\Big(⟧⟦1|\frac{\partial\cL}{\partial\Ws_1}⟧⟦3|\,,\ ⟧⟦2|\frac{\partial\cL}{\partial\Ws_2}⟧⟦3|\Big)⟧`,end:'Il gradiente: una sensibilità per ogni parametro, raccolte in una freccia.',
  steps:[{q:'Sposto di poco solo il primo parametro. Di quanto cambia il costo?',add:[1],say:'È la <b>derivata parziale</b> rispetto a \\(\\Ws_1\\): il simbolo \\(\\partial\\) ricorda che l\'altro parametro resta fermo. In questo punto vale 3,8.'},
    {q:'E se sposto solo il secondo?',add:[2],say:'La derivata parziale rispetto a \\(\\Ws_2\\). Qui vale 3,6.'},
    {q:'Due numeri che dicono come reagisce il costo. Come tenerli insieme?',add:[3],say:'Si mettono in un vettore: il <b>gradiente</b>, qui (3,8; 3,6). È la freccia che punta dove il costo sale più in fretta.'}],
  scene(host){const p=plane(host,600,330,[-1.4,4.4],0.9,'Una mappa del costo e le due sensibilità in un punto'),g=S('g',null,p.g),w=[1.9,0.9],gr=[3.8,3.6],s=0.3,cx=p.sx(w[0]),cy=p.sy(w[1]),ex=p.sx(w[0]+gr[0]*s),ey=p.sy(w[1]+gr[1]*s);
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),a=k===0?t:1,b=k===1?t:k>1?1:0,c=k===2?t:0;
      if(a>0.02){arrow(g,cx,cy,cx+(ex-cx)*a,cy,C.yellow,3);if(a>0.9)lab(g,(cx+ex)/2,cy+20,'3,8',C.yellow,null,15)}
      if(b>0.02){arrow(g,cx,cy,cx,cy+(ey-cy)*b,C.orange,3);if(b>0.9)lab(g,cx-10,(cy+ey)/2+5,'3,6',C.orange,'end',15)}
      if(c>0.02){S('line',{x1:ex,y1:cy,x2:ex,y2:ey,stroke:'#888','stroke-dasharray':'4 4'},g);S('line',{x1:cx,y1:ey,x2:ex,y2:ey,stroke:'#888','stroke-dasharray':'4 4'},g);arrow(g,cx,cy,cx+(ex-cx)*c,cy+(ey-cy)*c,C.teal,3.5)}
      S('circle',{cx,cy,r:7,fill:'#fff',stroke:'#000','stroke-width':2},g)}}};

/* ---------- 5. il passo di gradient descent ---------- */
BUILD.gd={tex:R`⟦4|\Wv_{t+1}\;=\;⟧⟦0|\Wv_t⟧\;⟦2|-⟧\;⟦3|\Et\,⟧⟦1|\Gr\cL(\Wv_t)⟧`,end:'Un passo di gradient descent. Dal nuovo punto si ricomincia.',
  steps:[{q:'Siamo in un punto della mappa e vogliamo scendere.',add:[0],say:'Il <b>punto attuale</b>: i parametri dopo \\(t\\) passi. Qui (1,0; 0,5), dove il costo vale 1,5.'},
    {q:'Da che parte sale il costo, qui?',add:[1],say:'Lo dice il <b>gradiente</b> calcolato nel punto attuale: (2; 2).'},
    {q:'Ma noi vogliamo scendere.',add:[2],say:'Il <b>segno meno</b> gira la freccia dalla parte opposta.'},
    {q:'Un passo così lungo porterebbe dall\'altra parte della valle, dove il costo è 5,5: peggio di prima.',add:[3],say:'Lo <b>step size</b> accorcia la freccia. Con 0,25 lo spostamento diventa (−0,5; −0,5).'},
    {q:'Dove si arriva?',add:[4],say:'Al <b>nuovo punto</b>: (1,0 − 0,5; 0,5 − 0,5) = (0,5; 0). Il costo è sceso da 1,5 a 0,25.'}],
  scene(host){const p=plane(host,440,440,[-1.6,3.4],0.5,'Un passo di gradient descent costruito pezzo per pezzo'),g=S('g',null,p.g),w=[1,0.5],gr=[2,2],eta=0.25,P=q=>[p.sx(q[0]),p.sy(q[1])],c=P(w);p.svg.style.maxWidth='440px';
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1));
      if(k===1){const e=P([w[0]+gr[0]*t,w[1]+gr[1]*t]);arrow(g,c[0],c[1],e[0],e[1],C.teal,3.5)}
      if(k===2){const an=Math.PI*t,dx=gr[0]*Math.cos(an)-gr[1]*Math.sin(an),dy=gr[0]*Math.sin(an)+gr[1]*Math.cos(an),e=P([w[0]+dx,w[1]+dy]);arrow(g,c[0],c[1],e[0],e[1],t>0.5?C.yellow:C.teal,3.5)}
      if(k>=3){const sc=k===3?1-(1-eta)*t:eta,e=P([w[0]-gr[0]*sc,w[1]-gr[1]*sc]);if(k===3){const f=P([w[0]-gr[0],w[1]-gr[1]]);S('line',{x1:c[0],y1:c[1],x2:f[0],y2:f[1],stroke:'#666','stroke-dasharray':'4 4'},g)}arrow(g,c[0],c[1],e[0],e[1],C.yellow,3.5)}
      const pos=k===4?P([w[0]-gr[0]*eta*t,w[1]-gr[1]*eta*t]):c;if(k===4)S('circle',{cx:c[0],cy:c[1],r:5,fill:'none',stroke:'#fff'},g);
      S('circle',{cx:pos[0],cy:pos[1],r:8,fill:'#fff',stroke:'#000','stroke-width':2},g)}}};

/* ---------- 6. una direzione per volta ---------- */
BUILD.factor={tex:R`⟦3|\tilde{\Ws}^{(t+1)}\;=\;⟧⟦2|(1-⟧⟦1|\Et\lambda⟧⟦2|)\;⟧⟦0|\tilde{\Ws}^{(t)}⟧`,end:'A ogni passo la distanza dal minimo viene moltiplicata per lo stesso fattore.',
  steps:[{q:'Guardiamo una sola direzione della valle. Quanto siamo lontani dal fondo?',add:[0],say:'La <b>distanza dal minimo</b> lungo quella direzione dopo \\(t\\) passi. Qui 2.'},
    {q:'Di quanto ci avvicina un passo?',add:[1],say:'Di una frazione della distanza: step size \\(\\Et\\) per <b>curvatura</b> \\(\\lambda\\) della valle in quella direzione. Con 0,055 e curvatura 2 fa l\'11%.'},
    {q:'Quanta strada resta?',add:[2],say:'Quello che non è stato percorso: 1 − 0,11 = 0,89 della distanza.'},
    {q:'E al passo dopo?',add:[3],say:'Lo stesso fattore, ogni volta: 2 → 1,78 → 1,58 → 1,41… Con curvatura 20 il fattore sarebbe 1 − 1,1 = −0,1: si finisce dall\'altra parte del minimo.'}],
  scene(host){const sv=Svg(host,600,150,'La distanza dal minimo lungo una direzione, passo dopo passo'),g=S('g',null,sv),X=v=>70+v*215,Y=92,f=0.89;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));S('line',{x1:40,x2:570,y1:Y,y2:Y,stroke:'#777'},g);S('line',{x1:X(0),x2:X(0),y1:Y-10,y2:Y+10,stroke:C.pink,'stroke-width':3},g);lab(g,X(0),Y+30,'minimo',C.pink);
      if(k===1||k===2){arrow(g,X(2),Y-22,X(2)-(X(2)-X(2*f))*(k===1?t:1),Y-22,C.orange,3);lab(g,X(1.89),Y-34,'11%',C.orange)}
      if(k===2){S('line',{x1:X(0),x2:X(0)+(X(2*f)-X(0))*t,y1:Y+46,y2:Y+46,stroke:C.yellow,'stroke-width':3},g);if(t>0.8)lab(g,X(0.89),Y+42-8+24,'resta l\'89%',C.yellow)}
      if(k===3){let x=2;const n=Math.floor(fr*9)+1;for(let i=0;i<n&&i<8;i++){const nx=x*f,a=X(x),b=X(nx);S('path',{d:`M${a} ${Y}Q${(a+b)/2} ${Y-34} ${b} ${Y}`,fill:'none',stroke:C.yellow,'stroke-width':1.8},g);S('circle',{cx:b,cy:Y,r:4.5,fill:C.yellow,stroke:'#000'},g);x=nx}}
      S('circle',{cx:X(2),cy:Y,r:7.5,fill:'#fff',stroke:'#000','stroke-width':2},g);lab(g,X(2),Y+30,'distanza 2','#fff')}}};

/* ---------- 7. momentum ---------- */
BUILD.mom={tex:R`\begin{aligned}⟦0|v_{t+1}⟧&⟦0|=\Wv_t-\alpha\,\Gr f(\Wv_t)⟧\\[.4em]⟦2|\Wv_{t+1}⟧&⟦2|=v_{t+1}⟧\;⟦1|+\,\beta\,(v_{t+1}-v_t)⟧\end{aligned}`,end:'Il passo normale, più una spinta nella direzione in cui ci si stava già muovendo.',
  steps:[{q:'Si comincia con il passo di sempre.',add:[0],say:'Chiamiamo \\(v_{t+1}\\) il <b>punto di prova</b>: dove porta il normale passo di discesa. Qui da 3,2 a 2,8.'},
    {q:'Ma stavamo già andando da quella parte: il punto di prova precedente era 4,0.',add:[1],say:'Si aggiunge una <b>spinta</b>: una frazione \\(\\beta\\) dello spostamento fra gli ultimi due punti di prova. Con \\(\\beta=0{,}5\\): metà di (2,8 − 4,0), cioè −0,6.'},
    {q:'Dove si finisce?',add:[2],say:'Nel <b>nuovo punto</b>: 2,8 − 0,6 = 2,2. Se invece i passi rimbalzassero avanti e indietro, le spinte si cancellerebbero.'}],
  scene(host){const sv=Svg(host,600,170,'Passo normale e spinta del momentum lungo una retta'),g=S('g',null,sv),X=v=>60+(v-1.6)*178,Y=96;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));S('line',{x1:40,x2:570,y1:Y,y2:Y,stroke:'#777'},g);
      S('circle',{cx:X(4),cy:Y,r:6,fill:'#888',stroke:'#000'},g);lab(g,X(4),Y+26,'prova precedente 4,0','#aaa',null,13);
      arrow(g,X(3.2),Y-20,X(3.2)-(X(3.2)-X(2.8))*(k===0?t:1),Y-20,C.yellow,3);if(k>0||t>0.8)lab(g,X(3.0),Y-32,'passo normale',C.yellow,null,13);
      if(k>=1){S('path',{d:`M${X(4)} ${Y-46}H${X(2.8)}`,stroke:'#999','stroke-dasharray':'4 4',fill:'none'},g);lab(g,X(3.4),Y-54,'spostamento fra i punti di prova: −1,2','#bbb',null,13);
        arrow(g,X(2.8),Y-20,X(2.8)-(X(2.8)-X(2.2))*(k===1?t:1),Y-20,C.orange,3);if(k>1||t>0.8)lab(g,X(2.5),Y-32,'spinta −0,6',C.orange,null,13)}
      S('circle',{cx:X(2.8),cy:Y,r:5,fill:C.yellow,stroke:'#000'},g);lab(g,X(2.8),Y+26,'prova 2,8',C.yellow,null,13);
      const cur=k===2?3.2-(3.2-2.2)*t:3.2;if(k===2&&t>0.9)lab(g,X(2.2),Y+26,'nuovo punto 2,2','#fff',null,13);else lab(g,X(3.2),Y+46,'punto attuale 3,2','#fff',null,13);
      S('circle',{cx:X(cur),cy:Y,r:7.5,fill:'#fff',stroke:'#000','stroke-width':2},g)}}};

/* ---------- 8. SGD ---------- */
BUILD.sgd={tex:R`\begin{aligned}⟦0|\Gr\cL(\Wv_t)⟧&⟦0|=\frac1N\sum_{n=1}^{N}\Gr\cl_n(\Wv_t)⟧\\[.5em]⟦3|\Wv_{t+1}⟧&⟦3|=\Wv_t-\Et\,⟧⟦1|\Gr\cl⟧_{⟦2|i_t⟧}⟦1|(\Wv_t)⟧\end{aligned}`,end:'SGD: lo stesso passo di prima, ma con il gradiente di un solo esempio estratto a caso.',
  steps:[{q:'Il costo è una media sui dati. E il suo gradiente?',add:[0],say:'È la media dei gradienti dei singoli esempi: ogni freccia grigia è la spinta di un dato, la freccia verde acqua è la loro <b>media</b>. Con un milione di dati sono un milione di frecce da calcolare, a ogni passo.'},
    {q:'E se ne calcolassimo una sola?',add:[1],say:'Il gradiente della loss su <b>un solo esempio</b>: costa un milionesimo.'},
    {q:'Quale esempio?',add:[2],say:'Uno <b>estratto a caso</b> a ogni passo, l\'indice \\(i_t\\). Ogni singola freccia sbaglia direzione, ma in media puntano come quella vera.'},
    {q:'Il resto non cambia.',add:[3],say:'Si fa il <b>passo</b> dalla parte opposta alla freccia estratta, accorciato dallo step size.'}],
  scene(host){const sv=Svg(host,600,250,'I gradienti dei singoli esempi, la loro media e uno estratto a caso'),g=S('g',null,sv),r=rng(41),A=[],cx=300,cy=140;for(let i=0;i<14;i++)A.push([70+55*r.n(),-38+48*r.n()]);const mx=A.reduce((s,a)=>s+a[0],0)/14,my=A.reduce((s,a)=>s+a[1],0)/14,PK=[3,9,6,12,1];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.4,0,1)),a=k===0?t:1,pk=PK[Math.min(4,Math.floor(fr*5))];
      A.forEach((v,i)=>{const hot=k>=2&&i===pk||k===1&&i===3;arrow(g,cx,cy,cx+v[0]*a,cy+v[1]*a,hot?C.yellow:'#777',hot?3:1.4)});
      const gm=S('g',{opacity:k>=1?.45:1},g);arrow(gm,cx,cy,cx+mx*a,cy+my*a,C.teal,3.5);
      if(k===3){const v=A[pk];arrow(g,cx,cy,cx-v[0]*0.5,cy-v[1]*0.5,'#fff',3);lab(g,cx-v[0]*0.5-8,cy-v[1]*0.5+22,'passo','#fff','end',13)}
      S('circle',{cx,cy,r:7,fill:'#fff',stroke:'#000','stroke-width':2},g)}}};

/* ---------- 9. penalità ---------- */
BUILD.pen={tex:R`⟦3|\min_{\Wv}\ \ ⟧⟦0|\cL(\Wv)⟧⟦1|\;+\;⟧⟦2|\rho\,⟧⟦1|P(\Wv)⟧`,end:'Costo più penalità: più la severità è alta, più il minimo si avvicina all\'intervallo ammesso.',
  steps:[{q:'Il parametro deve restare fra −1 e 1, ma il costo ha il minimo in 3.',add:[0],say:'Il <b>costo</b> di sempre. Da solo porterebbe fuori dall\'intervallo ammesso.'},
    {q:'Serve qualcosa che cresca quando si esce.',add:[1],say:'La <b>penalità</b> \\(P\\): vale zero dentro l\'intervallo e, fuori, il quadrato della distanza dal bordo. La si somma al costo.'},
    {q:'Quanto deve pesare l\'uscita rispetto al costo?',add:[2],say:'Lo decide la <b>severità</b> \\(\\rho\\). Guarda il minimo della somma mentre \\(\\rho\\) sale da 0 a 10: da 3 scende verso 1.'},
    {q:'Che cosa si calcola, alla fine?',add:[3],say:'Il <b>minimo</b> della somma, senza più vincoli: con \\(\\rho=10\\) è in 1,18, appena fuori dall\'intervallo.'}],
  scene(host){const p=Plot(host,{W:600,H:270,m:[40,12,14,38],xr:[-2,4.5],yr:[0,12],label:'Costo, penalità e la loro somma al variare della severità'});p.axes([-2,-1,0,1,2,3,4],[0,4,8,12],'parametro','');const L=w=>(w-3)*(w-3),Pn=w=>{const d=Math.max(0,Math.abs(w)-1);return d*d};
    S('rect',{x:p.sx(-1),y:p.ay,width:p.sx(1)-p.sx(-1),height:p.ah,fill:'rgba(131,193,103,.16)'},p.bg);lab(p.bg,p.sx(0),p.ay+p.ah-10,'ammesso',C.green,null,13);const note=H('div',{class:'sub'},host.parentNode);note.style.minHeight='1.5em';note.style.color=C.yellow;S('path',{d:p.curve(L,-2,4.5),fill:'none',stroke:C.pink,'stroke-width':2.4},p.g);const g=S('g',null,p.g);
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.8,0,1));if(k===0)S('circle',{cx:p.sx(3),cy:p.sy(0),r:6,fill:C.pink,stroke:'#000'},g);
      if(k>=1)S('path',{d:p.curve(Pn,-2,4.5),fill:'none',stroke:C.orange,'stroke-width':2.2,opacity:k===1?t:1},g);
      if(k>=2){const rho=k===2?10*t:10,wm=(3+rho)/(1+rho);S('path',{d:p.curve(w=>L(w)+rho*Pn(w),-2,4.5,300),fill:'none',stroke:C.yellow,'stroke-width':2.8},g);S('circle',{cx:p.sx(wm),cy:p.sy(L(wm)+rho*Pn(wm)),r:6.5,fill:C.yellow,stroke:'#000'},g);note.textContent='severità '+nf(rho,1)+' · minimo della somma in '+nf(wm,2)}else note.textContent=''}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. errore riducibile e irriducibile ---------- */
BUILD.l01_irr={
  tex:R`\begin{aligned}⟦1|\Yy⟧&⟦1|=\Ff(\Xs)⟧⟦2|\;+\;\Eps⟧\\[.35em]⟦3|\Yh⟧&⟦3|=\Fh(\Xs)⟧\\[.35em]⟦6|\mathbb E[(\Yy-\Yh)^2]⟧&⟦6|=⟧⟦4|[\Ff(\Xs)-\Fh(\Xs)]^2⟧⟦5|+\mathrm{Var}(\Eps)⟧\end{aligned}`,
  end:'Due pezzi: il primo si riduce con un modello migliore, il secondo resta anche con il modello perfetto.',
  steps:[
    {q:'Vogliamo prevedere una risposta a partire dalle features. Se le features dicessero tutto, come sarebbero fatti i dati?',add:[1],say:'Ci sarebbe una funzione \\(\\Ff\\), la <b>regola vera</b>, che trasforma l\'input \\(\\Xs\\) nella risposta \\(\\Yy\\). I dati starebbero tutti sulla curva bianca.'},
    {q:'I dati veri non stanno mai su una curva: due persone con le stesse features hanno risposte diverse.',add:[2],say:'Si aggiunge il <b>rumore</b> \\(\\Eps\\): tutto ciò che influisce sulla risposta e che le features non vedono. In media vale zero; qui sposta ogni punto, tipicamente, di 0,5.'},
    {q:'La regola vera non la conosciamo. Che cosa usiamo al suo posto?',add:[3],say:'Una <b>stima</b> \\(\\Fh\\) ricavata dai dati, qui la retta gialla. La previsione \\(\\Yh\\) è ciò che la stima risponde.'},
    {q:'Fermiamoci sull\'input 7. Di quanto sbaglia la stima rispetto alla regola vera?',add:[4],say:'La regola vera dice 4,0 e la stima 3,2: la distanza è 0,8, e al quadrato fa 0,64. È l\'errore <b>riducibile</b>: una stima migliore lo accorcia.'},
    {q:'E se la stima fosse perfetta? Le risposte per l\'input 7 continuerebbero a cadere un po\' sopra e un po\' sotto.',add:[5],say:'Quanto si sparpagliano lo misura la <b>varianza del rumore</b>: qui 0,5² = 0,25. È l\'errore <b>irriducibile</b>: nessuna stima può toglierlo.'},
    {q:'Quanto sbaglieremo in media, allora, prevedendo con la retta gialla?',add:[6],say:'L\'<b>errore quadratico atteso</b> è la somma dei due pezzi: 0,64 + 0,25 = 0,89. Con la stima perfetta resterebbe 0,25.'}],
  scene(host){
    const p=Plot(host,{W:600,H:290,m:[38,12,14,36],xr:[0,10],yr:[0,5.6],label:'La regola vera, i dati con il rumore, la stima e i due pezzi dell\'errore'});
    p.axes([0,2,4,6,8,10],[0,1,2,3,4,5],'input','risposta');
    const f=x=>4-0.06*(x-7)*(x-7),fh=x=>1.1+0.3*x,r=rng(7),D=[],Q=[];
    for(let i=0;i<13;i++){const x=0.5+i*0.72+(i>8?0.35:0);D.push([x,0.5*clamp(r.n(),-1.8,1.8)])}
    for(let i=0;i<11;i++)Q.push(0.5*clamp(r.n(),-2,2));
    S('path',{d:p.curve(f,0,10),fill:'none',stroke:'#fff','stroke-width':2.4},p.bg);
    const g=S('g',null,p.g),x0=7,X0=p.sx(x0);
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      if(k<=2)lab(g,p.sx(2.2),p.sy(4.55),'regola vera','#fff',null,14);
      const a=k===0?0:k===1?t:1,dim=k>=3,dop=k>=4?.14:.3;
      D.forEach(d=>{const y0=f(d[0]),y=y0+d[1]*a;
        if(a>0.02)S('line',{x1:p.sx(d[0]),x2:p.sx(d[0]),y1:p.sy(y0),y2:p.sy(y),stroke:C.purple,'stroke-width':2,opacity:dim?dop:.95},g);
        S('circle',{cx:p.sx(d[0]),cy:p.sy(y),r:5,fill:C.green,stroke:'#000',opacity:dim?dop:1},g)});
      if(k>=2){const e=k===2?t:1;S('line',{x1:p.sx(0),y1:p.sy(fh(0)),x2:p.sx(10*e),y2:p.sy(fh(10*e)),stroke:C.yellow,'stroke-width':2.6},g);
        if(k===2&&t>0.8)lab(g,p.sx(8.6),p.sy(fh(8.6))+24,'stima',C.yellow,null,14)}
      if(k>=3){S('line',{x1:X0,x2:X0,y1:p.sy(0),y2:p.sy(5.4),stroke:'#666','stroke-dasharray':'4 4'},g);
        const e=k===3?t:1,ya=p.sy(f(x0)),yb=p.sy(fh(x0));
        S('line',{x1:X0,x2:X0,y1:ya,y2:ya+(yb-ya)*e,stroke:C.pink,'stroke-width':6},g);
        S('circle',{cx:X0,cy:ya,r:4.5,fill:'#fff',stroke:'#000'},g);S('circle',{cx:X0,cy:yb,r:4.5,fill:C.yellow,stroke:'#000'},g);
        if(e>0.8)lab(g,X0-12,(ya+yb)/2+5,'0,8',C.pink,'end',15)}
      if(k>=4){const e=k===4?t:1,xc=X0+26;
        Q.forEach((q,i)=>S('circle',{cx:xc+(i%3)*9,cy:p.sy(f(x0)+q*e),r:3.6,fill:C.purple,stroke:'#000'},g));
        if(e>0.8){const xb=xc+34;S('path',{d:`M${xb} ${p.sy(f(x0)+0.5)}h7V${p.sy(f(x0)-0.5)}h-7`,fill:'none',stroke:C.purple,'stroke-width':1.6},g);lab(g,xb+12,p.sy(4.55)+5,'± 0,5',C.purple,'start',14)}}
      if(k>=5){const e=k===5?t:1,o=S('g',{opacity:e},g);lab(o,p.sx(0.5),p.sy(4.4),'0,64 + 0,25 = 0,89','#fff','start',17)}}}
};

/* ---------- 2. dal vicino più vicino ai k vicini ---------- */
BUILD.l01_knn={
  tex:R`\begin{aligned}⟦2|i^*⟧&⟦2|=\arg\min_{i}\ ⟧⟦1|\lVert\Xs_*-\Xs_i\rVert_2⟧\\[.35em]⟦3|\Yh_*⟧&⟦3|=\Yy_{i^*}⟧\\[.35em]⟦4|\Yh_*⟧&⟦4|=\text{maggioranza dei }\Kk\text{ vicini}⟧\end{aligned}`,
  end:'Un vicino solo copia anche le etichette atipiche; con più vicini decide la maggioranza.',
  steps:[
    {q:'Il punto bianco è nuovo e non ha colore. Per guardare «chi c\'è intorno» serve prima sapere quanto è lontano ciascun punto.',add:[1],say:'La <b>distanza</b> fra il punto nuovo \\(\\Xs_*\\) e il punto di training numero \\(i\\): la lunghezza del segmento che li unisce. Le tre più corte qui sono 0,67, 1,00 e 1,08.'},
    {q:'Fra tutti i punti di training, quale conta?',add:[2],say:'Quello con la distanza più piccola. La scritta \\(\\arg\\min\\) vuol dire «l\'indice per cui la distanza è minima»: lo chiamiamo \\(i^*\\). Qui è il punto arancione a 0,67.'},
    {q:'Che colore diamo al punto nuovo?',add:[3],say:'Gli si <b>copia l\'etichetta</b> del più vicino: arancione. È la regola 1-NN. Ma tutto intorno è blu: ha deciso un solo punto atipico.'},
    {q:'Come si evita che un punto atipico decida da solo?',add:[4],say:'Si guardano i \\(\\Kk\\) punti più vicini e si va a <b>maggioranza</b>. Con \\(\\Kk=3\\) votano un arancione e due blu: il punto nuovo diventa blu.'}],
  scene(host){
    const sv=Svg(host,600,300,'Un punto nuovo, le distanze dai punti di training, il più vicino e i tre più vicini'),g=S('g',null,sv),U=58,X=v=>20+v*U,Y=v=>292-v*U,T=[4,3];
    const P=[[4.6,3.3,1],[3.2,2.4,0],[3.4,3.9,0],[2.5,3.3,0],[4.4,1.5,0],[1.8,2.0,0],[2.2,4.4,0],[1.0,3.4,0],[3.0,0.9,0],[5.3,4.5,0],
      [7.0,3.0,1],[7.8,4.2,1],[6.6,1.8,1],[8.4,2.6,1],[6.3,4.3,1],[8.8,4.4,1],[7.6,1.2,1],[9.3,1.7,1]].map(q=>({x:q[0],y:q[1],c:q[2],d:Math.hypot(q[0]-T[0],q[1]-T[1])}));
    const col=c=>c?C.orange:C.blue;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      if(k===3){S('circle',{cx:X(T[0]),cy:Y(T[1]),r:1.2*U*t,fill:'rgba(255,255,255,.07)',stroke:'#bbb','stroke-dasharray':'5 4'},g)}
      P.forEach((q,i)=>{const near=i<3,a=k===0?t:1;let op=k===0?.75:k===1?(i===0?1:.75-.6*t):k===2?(i===0?1:.15):(near?1:0);
        if(op>0.02)S('line',{x1:X(T[0]),y1:Y(T[1]),x2:X(T[0])+(X(q.x)-X(T[0]))*a,y2:Y(T[1])+(Y(q.y)-Y(T[1]))*a,stroke:near&&k===3?col(q.c):i===0&&k>=1?C.orange:'#aaa','stroke-width':i===0&&k>=1||near&&k===3?2.6:1.2,opacity:op},g)});
      P.forEach((q,i)=>{S('circle',{cx:X(q.x),cy:Y(q.y),r:6.5,fill:col(q.c),stroke:'#000'},g);
        if(i===0&&(k===1||k===2))S('circle',{cx:X(q.x),cy:Y(q.y),r:11,fill:'none',stroke:'#fff','stroke-width':2},g)});
      if(k===0&&t>0.85||k>=1){lab(g,X(4.6)+12,Y(3.3)-9,'0,67','#fff','start',14);if(k===0||k===3){lab(g,X(3.2)-8,Y(2.4)+22,'1,00','#fff','end',14);lab(g,X(3.4)-8,Y(3.9)-12,'1,08','#fff','end',14)}}
      let fc='#fff';if(k===2)fc=t>0.5?C.orange:'#fff';if(k===3)fc=t>0.6?C.blue:C.orange;
      S('circle',{cx:X(T[0]),cy:Y(T[1]),r:9,fill:fc,stroke:'#fff','stroke-width':2.5},g);
      if(k===3&&t>0.85)lab(g,X(4.9),Y(0.45),'voti: 2 blu, 1 arancione','#fff','start',15)}}
};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* I quattro dati usati in tutti i build della lezione: (1,2) (2,2) (3,4) (4,4).
   Retta «di prova» m=0,5 b=1,5 (costo 0,375); retta dei minimi quadrati m=0,8 b=1 (costo 0,2). */
const D=[[1,2],[2,2],[3,4],[4,4]],G=[0.5,1.5],O=[0.8,1],U=54,X=v=>50+v*U,Y=v=>286-v*U;
const mix=(t)=>[G[0]+(O[0]-G[0])*t,G[1]+(O[1]-G[1])*t];
const num=(v,d)=>nf(v,d==null?2:d),short=v=>nf(v,2).replace(/0+$/,'').replace(/,$/,'');
function axes(g){S('line',{x1:X(0),x2:X(5),y1:Y(0),y2:Y(0),stroke:'#666'},g);S('line',{x1:X(0),x2:X(0),y1:Y(0),y2:Y(5),stroke:'#666'},g);
  [1,2,3,4,5].forEach(v=>{lab(g,X(v),Y(0)+18,String(v),'#888',null,13);lab(g,X(0)-10,Y(v)+5,String(v),'#888','end',13)})}
function line(g,m,b,c,w,dash){const a={x1:X(0),y1:Y(b),x2:X(5),y2:Y(5*m+b),stroke:c||C.yellow,'stroke-width':w||2.6};if(dash)a['stroke-dasharray']=dash;return S('line',a,g)}
function pts(g){D.forEach(d=>S('circle',{cx:X(d[0]),cy:Y(d[1]),r:6,fill:C.green,stroke:'#000'},g))}
const CX=[452,494,536,578];
function row(g,y,name,vals,c,sz){lab(g,346,y,name,c,'start',14);vals.forEach((v,i)=>{if(v!=null)lab(g,CX[i],y,v,c,null,sz||14)})}

/* ---------- 1. un numero per ogni retta ---------- */
BUILD.l03_sse={
  tex:R`⟦5|\cL(\Mm,\Bi)\;=\;⟧⟦4|\frac1N⟧⟦3|\sum_{i=1}^{N}⟧⟦2|\big(⟧⟦1|\Yy_i-⟧⟦0|(\Mm\Xs_i+\Bi)⟧⟦2|\big)^2⟧`,
  end:'Un numero per ogni retta: più è basso, meglio la retta spiega i dati.',
  steps:[
    {q:'Quattro dati e una retta di prova, con pendenza 0,5 e intercetta 1,5. Che cosa risponde la retta sul dato numero \\(i\\)?',add:[0],say:'La <b>previsione</b>: l\'input \\(\\Xs_i\\) per la pendenza \\(\\Mm\\), più l\'intercetta \\(\\Bi\\). Sul terzo dato, che ha input 3: 0,5 · 3 + 1,5 = 3.'},
    {q:'La risposta giusta del terzo dato però è 4. Di quanto ha sbagliato la retta?',add:[1],say:'L\'<b>errore</b> (o residuo): la risposta giusta \\(\\Yy_i\\) meno la previsione. Sui quattro dati: 0; −0,5; 1; 0,5. Sono i segmenti rosa.'},
    {q:'Sommandoli così, gli errori positivi e negativi si cancellerebbero. Come li rendiamo tutti costi?',add:[2],say:'Si eleva ogni errore al <b>quadrato</b>: 0; 0,25; 1; 0,25. Sul disegno è l\'area del quadrato costruito sul segmento.'},
    {q:'Serve un giudizio sulla retta intera, non su un dato solo.',add:[3],say:'Si <b>sommano</b> i quadrati di tutti gli \\(N\\) dati: 0 + 0,25 + 1 + 0,25 = 1,5.'},
    {q:'Con il doppio dei dati la somma raddoppierebbe, anche con la stessa retta.',add:[4],say:'Si divide per il numero di dati: la <b>media</b>, 1,5 / 4 = 0,375. È l\'area media dei quadrati.'},
    {q:'Che cosa succede a questo numero se cambiamo retta?',add:[5],say:'Cambia: è il <b>costo</b> della retta, una funzione di pendenza e intercetta. Con pendenza 0,8 e intercetta 1 scende da 0,375 a 0,2.'}],
  scene(host){const sv=Svg(host,600,310,'Quattro dati, una retta, gli errori e i quadrati costruiti sugli errori'),bg=S('g',null,sv),g=S('g',null,sv);axes(bg);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),mv=k===5?ez(clamp(fr/0.75,0,1)):0,w=mix(mv),m=w[0],b=w[1];
      const pr=D.map(d=>m*d[0]+b),e=D.map((d,i)=>d[1]-pr[i]),sq=e.map(v=>v*v),sum=sq.reduce((a,c)=>a+c,0),f=k===5?(v=>num(v,2)):short,sz=k===5?13:14;
      if(k>=2)D.forEach((d,i)=>{const s=Math.abs(e[i])*U*(k===2?t:1);if(s>0.5)S('rect',{x:X(d[0]),y:Math.min(Y(d[1]),Y(pr[i])),width:s,height:Math.abs(e[i])*U,fill:C.pink,opacity:.38,stroke:C.pink},g)});
      line(g,m,b);
      if(k===0){const a=t;S('line',{x1:X(3),x2:X(3),y1:Y(0),y2:Y(0)+(Y(pr[2])-Y(0))*a,stroke:C.yellow,'stroke-dasharray':'4 4'},g);if(a>0.8){S('circle',{cx:X(3),cy:Y(pr[2]),r:5,fill:C.yellow,stroke:'#000'},g);lab(g,X(3)+10,Y(pr[2])+20,'previsione 3',C.yellow,'start',14)}}
      if(k>=1)D.forEach((d,i)=>{const a=k===1?t:1;S('line',{x1:X(d[0]),x2:X(d[0]),y1:Y(pr[i]),y2:Y(pr[i])+(Y(d[1])-Y(pr[i]))*a,stroke:C.pink,'stroke-width':3.5},g)});
      pts(g);
      row(g,34,'dato',['1','2','3','4'],'#999');
      row(g,66,'previsione',pr.map(f),C.yellow,sz);
      if(k>=1)row(g,98,'errore',e.map(f),'#fff',sz);
      if(k>=2)row(g,130,'quadrato',sq.map(f),C.pink,sz);
      if(k>=3)lab(g,346,176,'somma dei quadrati: '+(k===5?num(sum,2):'1,5'),C.pink,'start',15);
      if(k>=4)lab(g,346,206,'media: '+(k===5?num(sum/4,3):'0,375'),'#fff','start',16);
      if(k===5)lab(g,346,250,'pendenza '+num(m,2)+' · intercetta '+num(b,2),C.yellow,'start',14)}}
};

/* ---------- 2. il fondo della conca: le due sensibilità a zero ---------- */
BUILD.l03_norm={
  tex:R`\begin{aligned}⟦1|\frac{\partial\cL}{\partial\Bi}⟧&⟦1|=\frac2N\sum_{i=1}^{N}(\Mm\Xs_i+\Bi-\Yy_i)⟧⟦3|\;=0⟧\\[.3em]⟦2|\frac{\partial\cL}{\partial\Mm}⟧&⟦2|=\frac2N\sum_{i=1}^{N}(\Mm\Xs_i+\Bi-\Yy_i)\,\Xs_i⟧⟦3|\;=0⟧\\[.5em]⟦4|\Bi^*⟧&⟦4|=\bar{\Yy}-\Mm^*\,\bar{\Xs}⟧\\[.3em]⟦5|\Mm^*⟧&⟦5|=\frac{\sum_i(\Xs_i-\bar{\Xs})(\Yy_i-\bar{\Yy})}{\sum_i(\Xs_i-\bar{\Xs})^2}⟧\end{aligned}`,
  end:'Due sensibilità messe a zero, due formule: la retta dei minimi quadrati.',
  steps:[
    {q:'Siamo sulla retta di prova. Alzo di poco l\'intercetta: tutta la retta sale. Di quanto cambia il costo?',add:[1],say:'Ogni previsione sale della stessa quantità, e ogni quadrato reagisce in proporzione al doppio del suo errore. Gli errori, previsione meno risposta, sono 0; 0,5; −1; −0,5: sommano a −1, e la <b>sensibilità all\'intercetta</b> vale 2/4 · (−1) = −0,5. È negativa: alzando la retta il costo scende.'},
    {q:'E se aumento di poco la pendenza, tenendo ferma l\'intercetta?',add:[2],say:'La retta ruota: sul dato \\(i\\) la previsione sale in proporzione al suo input \\(\\Xs_i\\), quindi ogni errore conta moltiplicato per \\(\\Xs_i\\). Qui 0 · 1 + 0,5 · 2 − 1 · 3 − 0,5 · 4 = −4, e la <b>sensibilità alla pendenza</b> vale 2/4 · (−4) = −2.'},
    {q:'Finché una delle due sensibilità non è zero, una piccola spinta fa ancora scendere. E sul fondo della conca?',add:[3],say:'Lì nessuna spinta aiuta: le due sensibilità valgono <b>zero insieme</b>. Sono due equazioni nelle due incognite pendenza e intercetta. Guarda i due numeri mentre la retta va verso il fondo.'},
    {q:'Che cosa dice la prima equazione?',add:[4],say:'Che gli errori sommano a zero: la retta passa per il <b>punto delle medie</b>. La barra indica una media: qui la media degli input è 2,5 e quella delle risposte 3. Nota la pendenza, l\'intercetta è già decisa.'},
    {q:'E la seconda, una volta sostituita l\'intercetta?',add:[5],say:'Dà la <b>pendenza</b>. Gli scarti degli input dalla media sono −1,5; −0,5; 0,5; 1,5, quelli delle risposte −1; −1; 1; 1. Sopra, la somma dei prodotti: 4. Sotto, la somma dei quadrati: 5. Quindi 4 / 5 = 0,8, e l\'intercetta è 3 − 0,8 · 2,5 = 1.'}],
  scene(host){const sv=Svg(host,600,310,'La retta di prova spostata e ruotata di poco, poi la retta dei minimi quadrati'),bg=S('g',null,sv),g=S('g',null,sv);axes(bg);
    const T=(y,s,c,sz)=>lab(g,346,y,s,c||'#fff','start',sz||14);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),mv=k===2?ez(clamp(fr/0.8,0,1)):k>2?1:0,w=mix(mv),m=w[0],b=w[1];
      const er=D.map(d=>m*d[0]+b-d[1]),db=er.reduce((a,c)=>a+c,0)/2,dm=er.reduce((a,c,i)=>a+c*D[i][0],0)/2,cost=er.reduce((a,c)=>a+c*c,0)/4;
      D.forEach((d,i)=>S('line',{x1:X(d[0]),x2:X(d[0]),y1:Y(d[1]),y2:Y(m*d[0]+b),stroke:C.pink,'stroke-width':3,opacity:.85},g));
      if(k===0){const s=0.5-0.5*Math.cos(2*Math.PI*fr),db2=0.35*s;line(g,m,b+db2,C.orange,2,'6 4');D.forEach(d=>{if(db2>0.06)arrow(g,X(d[0])+12,Y(m*d[0]+b),X(d[0])+12,Y(m*d[0]+b+db2),C.orange,2)})}
      if(k===1){const s=0.5-0.5*Math.cos(2*Math.PI*fr),dm2=0.11*s;line(g,m+dm2,b,C.orange,2,'6 4');D.forEach(d=>{if(dm2*d[0]>0.06)arrow(g,X(d[0])+12,Y(m*d[0]+b),X(d[0])+12,Y((m+dm2)*d[0]+b),C.orange,2)})}
      line(g,m,b);
      if(k>=3){const a=k===3?t:1,cx=X(2.5),cy=Y(3);S('line',{x1:cx,x2:cx,y1:Y(0),y2:cy,stroke:'#888','stroke-dasharray':'3 4',opacity:a},g);S('line',{x1:X(0),x2:cx,y1:cy,y2:cy,stroke:'#888','stroke-dasharray':'3 4',opacity:a},g);
        S('path',{d:`M${cx-9} ${cy}h18M${cx} ${cy-9}v18`,stroke:'#fff','stroke-width':3,opacity:a},g)}
      if(k===4){const a=t,x1=X(2.5),y1=Y(3),x2=X(3.5),y2=Y(3.8);S('line',{x1,y1,x2:x1+(x2-x1)*a,y2:y1,stroke:C.teal,'stroke-width':2.5},g);if(a>0.5){const c=(a-0.5)*2;S('line',{x1:x2,y1,x2,y2:y1+(y2-y1)*c,stroke:C.teal,'stroke-width':2.5},g)}
        if(a>0.9){lab(g,(x1+x2)/2,y1+18,'1',C.teal,null,14);lab(g,x2+8,(y1+y2)/2+5,'0,8',C.teal,'start',14)}}
      pts(g);
      if(k===0){T(40,'errori (previsione − risposta)','#bbb');['0','0,5','−1','−0,5'].forEach((v,i)=>lab(g,362+i*58,68,v,C.pink,null,15));if(t>0.5){T(110,'somma: −1');T(140,'per 2/4:  −0,5',C.orange,16)}}
      if(k===1){T(40,'errori, ciascuno per il suo input','#bbb');['0 · 1','0,5 · 2','−1 · 3','−0,5 · 4'].forEach((v,i)=>lab(g,366+i*64,68,v,C.pink,null,14));if(t>0.5){T(110,'somma: 0 + 1 − 3 − 2 = −4');T(140,'per 2/4:  −2',C.orange,16)}}
      if(k>=2){T(40,'sensibilità all\'intercetta: '+num(db,2),C.orange,15);T(70,'sensibilità alla pendenza: '+num(dm,2),C.orange,15);T(112,'costo: '+num(cost,3),C.pink,15);T(142,'pendenza '+num(m,2)+' · intercetta '+num(b,2),C.yellow)}
      if(k>=3){T(190,'media degli input: 2,5','#fff');T(216,'media delle risposte: 3','#fff')}
      if(k===4&&t>0.6)T(258,'pendenza = 4 / 5 = 0,8',C.teal,15)}}
};

/* ---------- 3. le equazioni normali in forma di matrice ---------- */
BUILD.l03_mat={
  tex:R`\begin{aligned}⟦3|\Gr\cL(\Wv)⟧&⟦3|=2\,⟧⟦2|\Xm^\top(⟧⟦1|\Xm\Wv-\Yv⟧⟦2|)⟧⟦4|\;=\mathbf 0⟧\\[.4em]⟦4|\Xm^\top\Xm\,\Wv⟧&⟦4|=\Xm^\top\Yv⟧\\[.4em]⟦5|\Wv^*⟧&⟦5|=(\Xm^\top\Xm)^{-1}\,\Xm^\top\Yv⟧\end{aligned}`,
  end:'Le equazioni normali e la loro soluzione: la stessa retta di prima, scritta per un numero qualsiasi di features.',
  steps:[
    {q:'Gli stessi quattro dati, in tabella. La colonna di 1 serve per l\'intercetta, che è il primo peso. Quanto sbaglia il modello su tutti i dati insieme?',add:[1],say:'Il prodotto \\(\\Xm\\Wv\\) dà tutte le previsioni in un colpo; togliendo le risposte \\(\\Yv\\) resta il <b>vettore degli errori</b>. Con i pesi di prova (1,5; 0,5): 0; 0,5; −1; −0,5.'},
    {q:'Quanto è sensibile il costo a ciascun peso? Nel caso della retta ogni errore contava moltiplicato per il suo input.',add:[2],say:'Qui è lo stesso, una colonna per volta: \\(\\Xm^\\top\\) moltiplica ogni <b>colonna di \\(\\Xm\\) per gli errori</b> e somma. La colonna di 1 dà −1, la colonna degli input dà −4: i due numeri di prima.'},
    {q:'Manca solo il 2 che viene dal quadrato.',add:[3],say:'È il <b>gradiente</b> della somma dei quadrati: una sensibilità per ogni peso. Qui 2 · (−1; −4) = (−2; −8).'},
    {q:'Sul fondo della conca tutte le sensibilità sono zero. Che equazioni ne escono?',add:[4],say:'Portando le risposte dall\'altra parte si ottengono le <b>equazioni normali</b>, una per peso. Qui \\(\\Xm^\\top\\Xm\\) contiene 4 (il numero di dati), 10 (la somma degli input) e 30 (la somma dei loro quadrati); \\(\\Xm^\\top\\Yv\\) contiene 12 e 34.'},
    {q:'Come si ricavano i pesi?',add:[5],say:'Si risolve il sistema: in simboli, si moltiplica per l\'<b>inversa</b> di \\(\\Xm^\\top\\Xm\\), quando esiste. Esce intercetta 1 e pendenza 0,8: 4 · 1 + 10 · 0,8 = 12 e 10 · 1 + 30 · 0,8 = 34. Gli errori ora danno zero con entrambe le colonne.'}],
  scene(host){const sv=Svg(host,600,290,'La tabella dei quattro dati con previsioni ed errori, e il sistema delle equazioni normali'),g=S('g',null,sv),cx=[100,160,285,400,510],ry=[92,120,148,176];
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),mv=k===4?ez(clamp(fr/0.75,0,1)):0,w=mix(mv),m=w[0],b=w[1],f=k===4?(v=>num(v,2)):short;
      const pr=D.map(d=>m*d[0]+b),er=D.map((d,i)=>pr[i]-d[1]),s1=er.reduce((a,c)=>a+c,0),s2=er.reduce((a,c,i)=>a+c*D[i][0],0);
      lab(g,300,26,'pesi: intercetta '+num(b,2)+' · pendenza '+num(m,2),C.yellow,null,15);
      const hot=k===1?(fr<0.5?0:1):-1;
      [0,1].forEach(j=>{if(hot===j)S('rect',{x:cx[j]-22,y:44,width:44,height:142,rx:6,fill:'rgba(88,196,221,.18)'},g)});
      if(k===1)S('rect',{x:cx[4]-34,y:44,width:68,height:142,rx:6,fill:'rgba(220,117,205,.18)'},g);
      lab(g,130,62,'colonne di X',C.blue,null,13);lab(g,cx[2],62,'previsione',C.yellow,null,13);lab(g,cx[3],62,'risposta',C.green,null,13);lab(g,cx[4],62,'errore',C.pink,null,13);
      S('line',{x1:60,x2:550,y1:70,y2:70,stroke:'#444'},g);
      D.forEach((d,i)=>{lab(g,cx[0],ry[i],'1',C.blue,null,15);lab(g,cx[1],ry[i],String(d[0]),C.blue,null,15);lab(g,cx[2],ry[i],f(pr[i]),C.yellow,null,15);lab(g,cx[3],ry[i],String(d[1]),C.green,null,15);
        const e=lab(g,cx[4],ry[i],f(er[i]),C.pink,null,15);if(k===0)e.setAttribute('opacity',t)});
      if(k===1||k===2){lab(g,60,216,'colonna di 1 per gli errori:  0 + 0,5 − 1 − 0,5 = −1',hot===0||k===2?'#fff':'#777','start',14);
        if(fr>=0.5||k===2)lab(g,60,242,'colonna degli input per gli errori:  0 + 1 − 3 − 2 = −4','#fff','start',14)}
      if(k===2){const o=S('g',{opacity:t},g);lab(o,60,272,'gradiente = 2 · (−1; −4) = (−2; −8)',C.teal,'start',15)}
      if(k>=3){const o=S('g',{opacity:k===3?t:1},g);lab(o,300,216,'4 · intercetta + 10 · pendenza = 12','#fff',null,15);lab(o,300,242,'10 · intercetta + 30 · pendenza = 34','#fff',null,15)}
      if(k===4)lab(g,300,272,'colonne per errori:  '+num(s1,2)+'  e  '+num(s2,2),C.teal,null,15)}}
};

/* ---------- 4. dalla campana alla somma dei quadrati ---------- */
BUILD.l03_mle={
  tex:R`\begin{aligned}⟦2|p(\Yv\mid\Xm,\Wv)⟧&⟦2|=\prod_{i=1}^{N}⟧⟦1|\frac{1}{\sqrt{2\pi\Sg^2}}\exp\!\Big(\!-\frac{(\Yy_i-\Wv^\top\Xv_i)^2}{2\Sg^2}\Big)⟧\\[.5em]⟦3|\log p⟧&⟦3|=⟧⟦4|-\tfrac N2\log(2\pi\Sg^2)⟧⟦5|\,-\,\tfrac{1}{2\Sg^2}\sum_{i}(\Yy_i-\Wv^\top\Xv_i)^2⟧\end{aligned}`,
  end:'Rendere massima la verosimiglianza gaussiana è rendere minima la somma dei quadrati degli errori.',
  steps:[
    {q:'Ogni dato ha la sua campana, centrata sulla retta. Quanto è «probabile» il terzo dato, che dista 1 dalla retta di prova?',add:[1],say:'Lo dice la <b>densità</b> della campana all\'altezza del punto: la barra bianca. Nell\'esponente c\'è l\'errore al quadrato, con il segno meno: più il punto è lontano dalla retta, più la barra è corta. Con \\(\\Sg=1\\) qui vale 0,24.'},
    {q:'E l\'intero dataset?',add:[2],say:'I rumori sono indipendenti, quindi le densità si <b>moltiplicano</b>: 0,40 · 0,35 · 0,24 · 0,35 = 0,012. È la verosimiglianza di questa retta.'},
    {q:'Un prodotto di tanti numeri piccoli è scomodo da maneggiare. Come lo si trasforma in una somma?',add:[3,4],say:'Con il <b>logaritmo</b>: è crescente, quindi il punto di massimo non si sposta. Il primo pezzo raccoglie le costanti che stanno davanti alle campane: non contiene i pesi. Qui vale −3,68.'},
    {q:'E gli esponenti?',add:[5],say:'Il logaritmo cancella l\'esponenziale: restano gli <b>errori al quadrato</b>, sommati e cambiati di segno. Qui −1,5 / 2 = −0,75. In tutto −3,68 − 0,75 = −4,43, che è proprio il logaritmo di 0,012.'},
    {q:'Quale retta rende più grande questo numero?',add:[],say:'Solo il secondo pezzo dipende dalla retta, e ha il segno meno: per alzare il totale bisogna <b>abbassare la somma dei quadrati</b>. Sulla retta dei minimi quadrati la somma scende a 0,8 e il totale sale a −4,08.'}],
  scene(host){const sv=Svg(host,600,310,'Una campana gaussiana su ogni dato, centrata sulla retta, e la densità di ciascun punto'),bg=S('g',null,sv),g=S('g',null,sv);axes(bg);
    const A=92,phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI),cid='l03c'+Math.round(Math.random()*1e6),cp=S('clipPath',{id:cid},S('defs',null,sv));S('rect',{x:X(0),y:Y(5.2),width:5*U+10,height:5.2*U},cp);
    const T=(y,s,c,sz)=>lab(g,346,y,s,c||'#fff','start',sz||14);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),mv=k===4?ez(clamp(fr/0.75,0,1)):0,w=mix(mv),m=w[0],b=w[1];
      const pr=D.map(d=>m*d[0]+b),de=D.map((d,i)=>phi(d[1]-pr[i])),prod=de.reduce((a,c)=>a*c,1),sse=D.reduce((a,d,i)=>a+(d[1]-pr[i])*(d[1]-pr[i]),0),c0=-2*Math.log(2*Math.PI),gc=S('g',{'clip-path':`url(#${cid})`},g);
      D.forEach((d,i)=>{const on=k>=1||i===2,a=k===0?(i===2?t:0):k===1&&i!==2?t:1;if(!on||a<0.02)return;let p='';for(let j=0;j<=60;j++){const z=-3+j/10;p+=(j?'L':'M')+(X(d[0])+A*phi(z)*a).toFixed(1)+' '+Y(pr[i]+z).toFixed(1)}
        S('path',{d:p+`L${X(d[0])} ${Y(pr[i]+3)}L${X(d[0])} ${Y(pr[i]-3)}Z`,fill:'rgba(202,163,232,.2)',stroke:C.purple,'stroke-width':1.5},gc);
        S('line',{x1:X(d[0]),x2:X(d[0])+A*de[i]*a,y1:Y(d[1]),y2:Y(d[1]),stroke:'#fff','stroke-width':3.5},gc)});
      line(g,m,b);pts(g);
      row(g,34,'dato',['1','2','3','4'],'#999');
      row(g,64,'densità',de.map((v,i)=>k>=1||i===2?num(v,2):null),'#fff',13);
      if(k>=1)T(104,'prodotto: '+num(prod,3),C.purple,15);
      if(k>=2)T(146,'costanti: '+num(c0,2),'#bbb',15);
      if(k>=3){T(174,'− somma dei quadrati / 2: '+num(-sse/2,2),C.pink,15);T(212,'logaritmo del prodotto: '+num(c0-sse/2,2),'#fff',15)}
      if(k===4)T(254,'somma dei quadrati: '+num(sse,2),C.pink,15)}}
};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
/* etichetta con alone nero, per restare leggibile sopra le curve */
const labh=(g,x,y,t,c,an,sz)=>{const e=lab(g,x,y,t,c,an,sz);e.style.paintOrder='stroke';e.style.stroke='#000';e.style.strokeWidth='6px';e.style.strokeLinejoin='round';return e};

/* ---------- 1. il modello con le basis functions ---------- */
BUILD.l04_feat={
  tex:R`⟦4|\Yh\;=\;⟧⟦3|\sum_{j=1}^{k}⟧\ ⟦2|\Ws_j\,⟧⟦1|\Ph_j(\Xs)⟧`,
  end:'Una curva rispetto all\'input, ma ogni peso compare solo moltiplicato per un numero: il modello resta lineare nei pesi.',
  steps:[
    {q:'Una retta non può piegarsi. Che cosa possiamo dare in più al modello?',add:[1],say:'Delle <b>basis functions</b> \\(\\Ph_j\\): nuove features calcolate a partire dall\'input. Qui sono tre: 1, \\(\\Xs\\) e \\(\\Xs^2\\). Per \\(\\Xs=0{,}5\\) valgono 1; 0,5; 0,25.'},
    {q:'Quanto deve contare ciascuna feature?',add:[2],say:'Lo dice un <b>peso</b> per ognuna, come nella lezione 3. Con i pesi 1,62; −9,6; 12 i tre contributi in 0,5 diventano 1,62; −4,8; 3.'},
    {q:'Come si passa dai contributi alla previsione?',add:[3],say:'Si <b>sommano</b>: 1,62 − 4,8 + 3 = −0,18. In ogni punto la curva gialla è la somma delle tre curve azzurre.'},
    {q:'Che cosa abbiamo ottenuto?',add:[4],say:'La <b>previsione</b> \\(\\Yh\\): una parabola, costruita con la stessa ricetta della retta. Sono cambiate le features, non il modo di combinarle.'}],
  scene(host){
    const p=Plot(host,{W:600,H:300,m:[44,12,14,38],xr:[0,1],yr:[-0.35,1.3],label:'Tre basis functions, i loro contributi pesati e la somma'}),g=S('g',null,p.g);
    const B=[x=>1,x=>x,x=>x*x],Wt=[1.62,-9.6,12],x0=0.5,N1=['1','0,5','0,25'],N2=['1,62','−4,8','3'];
    return (k,fr,fin)=>{g.textContent='';
      const t=k===1?ez(clamp(fr/0.6,0,1)):k>1?1:0,grow=k===0?ez(clamp(fr/0.4,0,1)):1;
      p.yr=[-0.35+(-5.6+0.35)*t,1.3+(12.6-1.3)*t];
      const tk=t<0.02?[0,0.5,1]:t>0.98?[-4,0,4,8,12]:[0];p.axes([0,0.25,0.5,0.75,1],tk,'input x','');
      S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},g);
      S('line',{x1:p.sx(x0),x2:p.sx(x0),y1:p.ay,y2:p.ay+p.ah,stroke:'#666','stroke-dasharray':'4 4'},g);
      B.forEach((f,j)=>{const w=1+(Wt[j]-1)*t;
        S('path',{d:p.curve(x=>w*f(x),0,grow,120),fill:'none',stroke:C.blue,'stroke-width':2,opacity:k>=2?.75:1},g);
        if(grow>0.6){S('circle',{cx:p.sx(x0),cy:p.sy(w*f(x0)),r:5,fill:C.blue,stroke:'#000'},g);
          if(k===0||t>0.95)labh(g,p.sx(x0)+9,p.sy(w*f(x0))+5,k===0?N1[j]:N2[j],C.blue,'start',14)}});
      if(k>=2){const a=k===2?ez(clamp(fr/0.6,0,1)):1,fn=x=>Wt[0]+Wt[1]*x+Wt[2]*x*x;
        S('path',{d:p.curve(fn,0,a,160),fill:'none',stroke:C.yellow,'stroke-width':3},g);
        if(a>=0.5){S('circle',{cx:p.sx(x0),cy:p.sy(fn(x0)),r:6,fill:C.yellow,stroke:'#000'},g);labh(g,p.sx(x0)-11,p.sy(fn(x0))+19,'somma −0,18',C.yellow,'end',14)}}}}
};

/* ---------- 2. la gaussiana radiale ---------- */
BUILD.l04_rbf={
  tex:R`⟦5|\Ph_j(\Xs)\;=\;⟧⟦4|\exp\!\Big(-⟧⟦3|\frac{1}{2\Bw^2}\,⟧⟦2|\lVert⟧⟦1|\Xs-\mu_j⟧⟦2|\rVert^2⟧⟦4|\Big)⟧`,
  end:'Una campana attorno al centro: vale 1 nel centro e si spegne allontanandosi, tanto più in fretta quanto più la bandwidth è piccola.',
  steps:[
    {q:'Vogliamo una funzione che «si accenda» solo vicino a un punto scelto, il centro. Da che cosa deve dipendere?',add:[1],say:'Dallo <b>scarto dal centro</b> \\(\\mu_j\\). Con il centro in 0,5 e l\'input in 0,7 lo scarto è 0,2.'},
    {q:'Stare da una parte o dall\'altra del centro deve contare uguale.',add:[2],say:'Si prende la <b>distanza al quadrato</b>: 0,2² = 0,04. Le doppie barre indicano la lunghezza di un vettore: servono quando l\'input ha più coordinate.'},
    {q:'Vicino o lontano rispetto a che cosa? Serve un\'unità di misura.',add:[3],say:'Si divide per \\(2\\Bw^2\\), dove \\(\\Bw\\) è la <b>bandwidth</b>, la larghezza tipica della funzione (il 2 è una convenzione). Con \\(\\Bw=0{,}2\\): 0,04 / 0,08 = 0,5.'},
    {q:'Questo numero vale 0 nel centro e cresce allontanandosi. A noi serve il contrario.',add:[4],say:'L\'<b>esponenziale</b> con il segno meno lo ribalta: nel centro vale 1, e in 0,7 vale \\(e^{-0{,}5}\\), cioè circa 0,61.'},
    {q:'E se la bandwidth si dimezza?',add:[5],say:'La <b>basis function</b> si stringe. Con \\(\\Bw=0{,}1\\) il conto in 0,7 diventa 0,04 / 0,02 = 2, e il valore scende da 0,61 a circa 0,14.'}],
  scene(host){
    const p=Plot(host,{W:600,H:280,m:[44,12,14,38],xr:[0,1],yr:[-0.6,1.25],label:'La funzione radiale costruita a partire dallo scarto dal centro'}),g=S('g',null,p.g),mu=0.5,x0=0.7;
    p.axes([0,0.25,0.5,0.75,1],[-0.5,0,0.5,1],'input x','');
    const F=[x=>x-mu,x=>(x-mu)*(x-mu),x=>(x-mu)*(x-mu)/0.08,x=>Math.exp(-(x-mu)*(x-mu)/0.08)];
    const NM=['scarto:','al quadrato:','diviso per 2σ²:','valore:'];
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1));let fn,nm;
      if(k===0){fn=F[0];nm=NM[0]}
      else if(k<=3){const a=F[k-1],b=F[k];fn=x=>a(x)+(b(x)-a(x))*t;nm=t<0.5?NM[k-1]:NM[k]}
      else{const s=0.2-0.1*ez(clamp((fr-0.15)/0.6,0,1)),d=2*s*s;fn=x=>Math.exp(-(x-mu)*(x-mu)/d);nm='σ = '+nf(s,2)+' · valore:'}
      S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},g);
      S('line',{x1:p.sx(mu),x2:p.sx(mu),y1:p.ay,y2:p.ay+p.ah,stroke:C.orange,'stroke-dasharray':'5 4'},g);lab(g,p.sx(mu)-8,p.ay+p.ah-10,'centro 0,5',C.orange,'end',13);
      S('line',{x1:p.sx(x0),x2:p.sx(x0),y1:p.sy(0),y2:p.sy(Math.min(fn(x0),1.25)),stroke:'#888','stroke-dasharray':'3 4'},g);
      S('path',{d:p.curve(fn,0,k===0?ez(clamp(fr/0.4,0,1)):1,240),fill:'none',stroke:C.blue,'stroke-width':2.6},g);
      const v=fn(x0);S('circle',{cx:p.sx(x0),cy:p.sy(v),r:6,fill:'#fff',stroke:'#000'},g);
      labh(g,p.sx(x0)+12,p.sy(v)+5,nm+' '+nf(v,2),'#fff','start',14)}}
};

/* ---------- 3. la decomposizione bias-varianza in un punto ---------- */
BUILD.l04_bv={
  tex:R`\begin{aligned}&⟦2|\mathbb E_{S,\Yy}\big[⟧⟦1|(\Yy-\Fh_S(\Xs))^2⟧⟦2|\big]⟧\\[.25em]&⟦3|=\;\Sg^2\quad\small\text{(rumore)}⟧\\[.25em]&⟦4|+\;\big(\Ff(\Xs)-\Fb(\Xs)\big)^2\quad\small\text{(bias}^2\text{)}⟧\\[.25em]&⟦5|+\;\mathbb E_S\big[(\Fh_S(\Xs)-\Fb(\Xs))^2\big]\quad\small\text{(varianza)}⟧\end{aligned}`,
  end:'L\'errore atteso in un punto è la somma di tre pezzi: 0,16 + 1 + 0,32 = 1,48.',
  steps:[
    {q:'Fissiamo un input. Quanto sbaglia una previsione su un dato nuovo?',add:[1],say:'L\'<b>errore al quadrato</b>: output osservato \\(\\Yy\\) meno previsione \\(\\Fh_S(\\Xs)\\) del modello allenato sul dataset \\(S\\). Qui il dato nuovo vale 2,3 e il modello prevede 3,4: (2,3 − 3,4)² = 1,21.'},
    {q:'Quel numero dipende da quale dataset è capitato e da quale dato nuovo arriva. Come si giudica l\'algoritmo in generale?',add:[2],say:'Con la <b>media</b> su tutti i dataset \\(S\\) e su tutti i dati nuovi \\(\\Yy\\). Qui cinque dataset danno le previsioni 2,2; 2,6; 3,0; 3,4; 3,8 e l\'errore al quadrato medio è 1,48. Da dove viene?'},
    {q:'Primo colpevole: i dati nuovi ballano attorno alla verità, che qui vale 2. Anche un modello perfetto sbaglierebbe.',add:[3],say:'La <b>varianza del rumore</b> \\(\\Sg^2\\). Qui il rumore ha ampiezza tipica 0,4, quindi 0,4² = 0,16. Non dipende dal modello.'},
    {q:'Secondo colpevole: anche facendo la media di tutti i modelli non si arriva alla verità.',add:[4],say:'Il <b>bias</b> al quadrato: la distanza fra la verità \\(\\Ff(\\Xs)\\) e il modello medio \\(\\Fb(\\Xs)\\). Qui la media delle cinque previsioni è 3: (2 − 3)² = 1.'},
    {q:'Terzo colpevole: i singoli modelli non coincidono con la loro media.',add:[5],say:'La <b>varianza</b>: la media dei quadrati degli scarti dal modello medio. Gli scarti sono −0,8; −0,4; 0; 0,4; 0,8, i quadrati 0,64; 0,16; 0; 0,16; 0,64, la loro media 0,32.'}],
  scene(host){
    const sv=Svg(host,600,300,'In un punto: dati nuovi, previsioni di cinque modelli, verità e modello medio'),g=S('g',null,sv);
    const X=v=>60+(v-1)*140,AY=150,P=[2.2,2.6,3.0,3.4,3.8],r=rng(7),D=[];
    for(let i=0;i<26;i++)D.push([clamp(2+0.4*r.n(),1.15,2.95),62+((i*37)%44)]);
    D[0]=[2.3,96];
    const BX=150,U=220,BY=262;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),on=j=>k>j?1:k===j?t:0;
      S('line',{x1:X(1),x2:X(4.5),y1:AY,y2:AY,stroke:'#777'},g);[1,2,3,4].forEach(v=>{S('line',{x1:X(v),x2:X(v),y1:AY,y2:AY+5,stroke:'#777'},g);lab(g,X(v),AY+21,String(v),'#888',null,13)});
      /* dati nuovi */
      const nd=k===0?1:k===1?1+Math.floor(25*clamp(fr/0.7,0,1)):26;
      for(let i=0;i<nd;i++)S('circle',{cx:X(D[i][0]),cy:D[i][1],r:4.2,fill:C.purple,opacity:k>=3?.35:(k===2||i===0&&k===0?1:.8)},g);
      /* previsioni */
      const np=k===0?1:k===1?1+Math.floor(4.99*clamp(fr/0.6,0,1)):5,ord=[3,0,1,2,4];
      for(let i=0;i<np;i++)S('circle',{cx:X(P[ord[i]]),cy:AY,r:6.5,fill:C.yellow,stroke:'#000',opacity:k===2?.4:1},g);
      if(k===0){lab(g,X(2.3),50,'dato nuovo: 2,3',C.purple,null,14);lab(g,X(3.4),AY+44,'un modello prevede 3,4',C.yellow,null,14);
        S('line',{x1:X(2.3),x2:X(2.3)+(X(3.4)-X(2.3))*t,y1:122,y2:122,stroke:'#fff','stroke-width':3},g);if(t>0.8)lab(g,X(2.85),112,'(2,3 − 3,4)² = 1,21','#fff',null,14)}
      if(k===1){lab(g,X(2),50,'tanti dati nuovi',C.purple,null,14);lab(g,X(3),AY+44,'cinque dataset, cinque previsioni',C.yellow,null,14)}
      /* verità */
      if(k>=2){const a=on(2);S('line',{x1:X(2),x2:X(2),y1:AY+8-(AY+8-52)*a,y2:AY+8,stroke:'#fff','stroke-width':2.5},g);lab(g,X(2),AY+44,'verità 2','#fff',null,14)}
      if(k===2){const a=t;S('line',{x1:X(2)-56*a,x2:X(2)+56*a,y1:38,y2:38,stroke:C.purple,'stroke-width':3},g);[-1,1].forEach(s=>S('line',{x1:X(2)+s*56*a,x2:X(2)+s*56*a,y1:32,y2:44,stroke:C.purple,'stroke-width':3},g));lab(g,X(2),24,'ampiezza tipica del rumore: ± 0,4',C.purple,null,14)}
      /* modello medio e bias */
      if(k>=3){const a=on(3);S('line',{x1:X(3),x2:X(3),y1:AY-28,y2:AY+8,stroke:C.yellow,'stroke-width':3.5,opacity:a},g);lab(g,X(3)+70,AY+44,'media dei modelli 3',C.yellow,null,14);
        S('line',{x1:X(2),x2:X(2)+(X(3)-X(2))*a,y1:AY-22,y2:AY-22,stroke:C.blue,'stroke-width':4},g);if(a>0.8)lab(g,X(2.5),AY-31,'bias 1',C.blue,null,14)}
      /* scarti dalla media */
      if(k>=4){const a=on(4);P.forEach((v,i)=>{const y=208+i*8;S('line',{x1:X(3),x2:X(3)+(X(v)-X(3))*a,y1:y,y2:y,stroke:C.teal,'stroke-width':3.5},g);S('circle',{cx:X(3)+(X(v)-X(3))*a,cy:y,r:3.5,fill:C.teal},g)});
        lab(g,X(3)-125,230,'scarti dalla media',C.teal,'end',14)}
      /* barra dei tre pezzi */
      if(k>=1){const a=k===1?t:1;S('rect',{x:BX,y:BY,width:1.48*U*a,height:24,fill:'none',stroke:'#aaa'},g);lab(g,BX-10,BY+17,'errore atteso','#ddd','end',14);if(a>0.9)lab(g,BX+1.48*U+10,BY+17,'1,48','#fff','start',15)}
      [[2,0,0.16,C.purple,'0,16'],[3,0.16,1,C.blue,'1'],[4,1.16,0.32,C.teal,'0,32']].forEach(q=>{const a=on(q[0]);if(a<=0)return;
        S('rect',{x:BX+q[1]*U,y:BY,width:q[2]*U*a,height:24,fill:q[3]},g);if(a>0.9){const e=lab(g,BX+(q[1]+q[2]/2)*U,BY+17,q[4],'#000',null,14);e.style.fontWeight='600'}})}}
};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
/* etichetta con alone nero, per restare leggibile sopra le curve */
const labh=(g,x,y,t,c,an,sz)=>{const e=lab(g,x,y,t,c,an,sz);e.style.paintOrder='stroke';e.style.stroke='#000';e.style.strokeWidth='6px';e.style.strokeLinejoin='round';return e};

/* ---------- 1. la fascia attorno all'errore di test ---------- */
BUILD.l05_band={
  tex:R`\begin{aligned}&⟦1|\big|\cL_{\mathcal D}(\Ff)-\cL_{S_{te}}(\Ff)\big|⟧\\[.3em]&⟦2|\le\;\frac{1}{\sqrt{N_{te}}}⟧⟦3|\;\cdot\sqrt{\tfrac12\log(2/\delta)}⟧⟦4|\;\cdot\,(b-a)⟧\end{aligned}`,
  end:'Con probabilità almeno \\(1-\\delta\\), errore di test e rischio vero distano meno di così.',
  steps:[
    {q:'Un classificatore sbaglia davvero il 20% delle volte. Lo proviamo su un test set di 200 punti: quanto si allontana l\'errore di test dal rischio vero?',add:[1],say:'La <b>distanza</b> fra il rischio vero e l\'errore di test. Dipende dal test set capitato: qui uno dà 0,24, cioè 0,04 di distanza. La collina grigia mostra dove cadono gli errori di tanti test set diversi.'},
    {q:'Di quanto può essere grande, al massimo? Più punti di test ci sono, più la media si stabilizza.',add:[2],say:'La fascia si stringe come <b>uno diviso la radice</b> del numero di punti di test \\(N_{te}\\). Con 200 punti fa 0,071; con 800, quattro volte tanti, fa 0,035: solo la metà.'},
    {q:'«Al massimo» con quale sicurezza? Qualche test set sfortunato cadrà sempre fuori.',add:[3],say:'Si fissa \\(\\delta\\), la <b>probabilità di cadere fuori</b> che siamo disposti a tollerare. Con \\(\\delta=0{,}05\\) il fattore vale 1,36 e la fascia diventa 0,096. Con \\(\\delta=0{,}01\\) sale solo a 1,63: il logaritmo cresce piano.'},
    {q:'E se la loss non fosse uno 0 o un 1?',add:[4],say:'Conta la <b>scala della loss</b>: \\(a\\) è il valore più piccolo che può assumere su un punto, \\(b\\) il più grande. Qui vale 0 o 1, quindi \\(b-a=1\\) e non cambia nulla. Con una loss fra 0 e 4 la fascia sarebbe quattro volte più larga.'}],
  scene(host){
    const p=Plot(host,{W:600,H:270,m:[14,34,14,40],xr:[0,0.4],yr:[0,1.1],label:'Dove cadono gli errori di test e la fascia garantita attorno al rischio vero'}),g=S('g',null,p.g),tp=S('g',null,p.top),pt=0.2;
    p.axes([0,0.1,0.2,0.3,0.4],null,'errore di test');
    return (k,fr,fin)=>{g.textContent='';tp.textContent='';const t=ez(clamp(fr/0.6,0,1));
      let N=200,c=1;
      if(k===1){const u=fr<0.5?ez(clamp((fr-0.08)/0.37,0,1)):1-ez(clamp((fr-0.58)/0.37,0,1));N=200*Math.pow(4,u)}
      let dl=2*Math.exp(-2);if(k>=2){dl=dl*Math.pow(0.05/dl,k===2?t:1);c=Math.sqrt(0.5*Math.log(2/dl))}
      const sd=Math.sqrt(pt*(1-pt)/N),hh=k===0?ez(clamp(fr/0.45,0,1)):1,bell=x=>0.9*hh*Math.exp(-(x-pt)*(x-pt)/(2*sd*sd)),eps=c/Math.sqrt(N);
      if(k>=1){const a=k===1?clamp(fr/0.08,0,1):1,x1=p.sx(pt-eps),x2=p.sx(pt+eps);S('rect',{x:x1,y:p.ay,width:x2-x1,height:p.ah,fill:'rgba(88,196,221,.2)',opacity:a},g);
        [x1,x2].forEach(x=>S('line',{x1:x,x2:x,y1:p.ay,y2:p.ay+p.ah,stroke:C.blue,'stroke-width':2,opacity:a},g))}
      S('path',{d:p.curve(bell,0,0.4,300)+`L${p.sx(0.4)} ${p.sy(0)}L${p.sx(0)} ${p.sy(0)}Z`,fill:'rgba(201,201,201,.45)',stroke:C.lg,'stroke-width':1.5},g);
      S('line',{x1:p.sx(pt),x2:p.sx(pt),y1:p.ay,y2:p.ay+p.ah,stroke:C.red,'stroke-width':2.5},g);lab(tp,p.sx(pt),p.ay-12,'rischio vero 0,20',C.red,null,14);
      if(k===0){const X=p.sx(0.24),Y=p.sy(1.0);S('line',{x1:X,x2:X,y1:p.sy(0),y2:Y,stroke:C.orange,'stroke-dasharray':'4 4'},g);S('circle',{cx:X,cy:p.sy(0)-7,r:6,fill:C.orange,stroke:'#000'},g);
        if(hh>0.9){const a=ez(clamp((fr-0.45)/0.3,0,1));S('line',{x1:p.sx(pt),x2:p.sx(pt)+(X-p.sx(pt))*a,y1:Y,y2:Y,stroke:'#fff','stroke-width':3},g);if(a>0.8)labh(g,X+9,Y+5,'distanza 0,04','#fff','start',14)}
        labh(g,X+12,p.sy(0)-14,'un test set: 0,24',C.orange,'start',14)}
      const xr=p.ax+p.aw-8;lab(g,xr,p.ay+18,'punti di test: '+Math.round(N),'#ddd','end',14);
      if(k>=1)lab(g,xr,p.ay+40,'fascia: ± '+nf(eps,3),C.blue,'end',14);
      if(k>=2)lab(g,xr,p.ay+62,'δ = '+nf(dl,2),'#ddd','end',14);
      if(k>=3)lab(g,xr,p.ay+84,'loss fra 0 e 1','#ddd','end',14)}}
};

/* ---------- 2. la garanzia per la scelta fra p modelli ---------- */
BUILD.l05_sel={
  tex:R`\begin{aligned}⟦1|\cL_{\mathcal D}\big(\Ff^{(\hat m)}\big)⟧\;&⟦2|\le\;\cL_{\mathcal D}\big(\Ff^{(m^*)}\big)⟧⟦3|\;+\;2\,\epsilon⟧\\[.5em]⟦4|\epsilon\;⟧&⟦4|=\;\sqrt{\frac{(b-a)^2\,\log(2p/\delta)}{2\,|S_{te}|}}⟧\end{aligned}`,
  end:'Il modello scelto può essere peggiore del migliore, ma al più di due fasce. E la fascia cresce pochissimo con il numero di modelli.',
  steps:[
    {q:'Fra tanti modelli teniamo quello con l\'errore di test più basso. Che cosa ci interessa davvero di lui?',add:[1],say:'Il suo <b>rischio vero</b>. Chiamiamo \\(\\hat m\\) il modello scelto: qui ha l\'errore di test più basso, 0,22, ma il suo rischio vero (che non vediamo) è 0,27. È stato un po\' fortunato.'},
    {q:'Con che cosa lo confrontiamo?',add:[2],say:'Con il <b>modello migliore</b> in assoluto, \\(m^*\\): quello con il rischio vero più basso, qui 0,20. Sul test set gli è andata peggio, 0,25, e per questo non è stato scelto.'},
    {q:'Di quanto può essere peggiore il modello scelto?',add:[3],say:'Di <b>due fasce</b>. Sia \\(\\epsilon\\) la mezza larghezza della fascia in cui errore di test e rischio vero stanno insieme. Il rischio di \\(\\hat m\\) supera il suo errore di test al più di \\(\\epsilon\\); quell\'errore è il più basso di tutti; e quello di \\(m^*\\) supera il suo rischio al più di \\(\\epsilon\\).'},
    {q:'Ma la fascia deve valere per tutti i \\(p\\) modelli insieme, non per uno solo.',add:[4],say:'È la fascia di prima con \\(p\\) dentro il <b>logaritmo</b>. Con 500 punti di test e \\(\\delta=0{,}05\\) vale 0,061 per un modello e 0,077 per dieci. Il tetto è 0,20 + 2 · 0,077, cioè circa 0,35. Con mille modelli la fascia sarebbe 0,103.'}],
  scene(host){
    const sv=Svg(host,600,250,'Errore di test e rischio vero del modello scelto e del modello migliore'),g=S('g',null,sv),X=v=>60+(v-0.1)*1650,Y1=92,Y2=160,AY=205;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1));
      S('circle',{cx:96,cy:20,r:6,fill:C.orange},g);lab(g,108,25,'errore di test (lo vediamo)',C.orange,'start',14);S('circle',{cx:330,cy:20,r:6,fill:C.red},g);lab(g,342,25,'rischio vero (non lo vediamo)',C.red,'start',14);
      S('line',{x1:X(0.1),x2:X(0.42),y1:AY,y2:AY,stroke:'#777'},g);[0.1,0.2,0.3,0.4].forEach(v=>{S('line',{x1:X(v),x2:X(v),y1:AY,y2:AY+5,stroke:'#777'},g);lab(g,X(v),AY+22,nf(v,1),'#999',null,13)});lab(g,X(0.26),AY+40,'errore','#999',null,13);
      lab(g,16,Y1-4,'modello','#ddd','start',14);lab(g,16,Y1+14,'scelto','#ddd','start',14);lab(g,16,Y2-4,'modello','#ddd','start',14);lab(g,16,Y2+14,'migliore','#ddd','start',14);
      const eps=k<3?0.0607:k===3?0.0607+(0.0774-0.0607)*t:0.0774,ba=k===2?t:k>2?1:0;
      if(ba>0)[[0.22,Y1],[0.25,Y2]].forEach(q=>{S('rect',{x:X(q[0]-eps*ba),y:q[1]-11,width:(X(q[0]+eps*ba)-X(q[0]-eps*ba)),height:22,fill:'rgba(255,134,47,.22)',stroke:C.orange,'stroke-opacity':.6},g)});
      /* test */
      [[0.22,Y1,'0,22'],[0.25,Y2,'0,25']].forEach(q=>{S('circle',{cx:X(q[0]),cy:q[1],r:7,fill:C.orange,stroke:'#000'},g);lab(g,X(q[0]),q[1]-18,q[2],C.orange,null,14)});
      /* rischio vero */
      const a1=k===0?t:1,a2=k===1?t:k>1?1:0;
      const dm=(x,y,a,tt)=>{if(a<=0)return;S('rect',{x:X(x)-6,y:y-6,width:12,height:12,fill:C.red,stroke:'#000',opacity:a,transform:`rotate(45 ${X(x)} ${y})`},g);if(a>0.5)lab(g,X(x),y+30,tt,C.red,null,14)};
      dm(0.27,Y1,a1,'0,27');dm(0.20,Y2,a2,'0,20');
      if(k>=2&&ba>0.9){const xc=X(0.20+2*eps),ao=k===2?clamp((fr-0.5)/0.2,0,1):1;S('line',{x1:xc,x2:xc,y1:54,y2:AY,stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 4',opacity:ao},g);
        if(ao>0.5)lab(g,Math.min(xc,470),46,'tetto: 0,20 + 2ε'+(k>=3?' = '+nf(0.20+2*eps,2):''),'#fff',null,14)}}}
};

/* ---------- 3. l'errore di cross-validation ---------- */
BUILD.l05_cv={
  tex:R`⟦4|\cL_{\text{cv}}\;=\;⟧⟦3|\frac1k\sum_{j=1}^{k}⟧\ ⟦1|\cL⟧_{⟦2|S_j⟧}⟦1|\big(\Ff⟧_{⟦2|S\setminus S_j⟧}⟦1|\big)⟧`,
  end:'L\'errore di cross-validation: la media degli errori ottenuti mettendo da parte un fold alla volta.',
  steps:[
    {q:'Partiamo da ciò che sappiamo già fare: un modello, una loss, un errore.',add:[1],say:'L\'<b>errore di un modello</b> su dei dati. Per ora è un hold-out: il grado 3 allenato su 24 punti e provato sui 6 messi da parte sbaglia 0,193.'},
    {q:'Quei 6 punti sono capitati per caso. E se a turno toccasse a tutti?',add:[2],say:'I pedici dicono chi fa che cosa nel giro \\(j\\): il fold \\(S_j\\) fa da <b>test</b>, e il modello è allenato su tutto il resto, \\(S\\setminus S_j\\) (cioè \\(S\\) senza il fold \\(j\\)). Gli altri quattro giri danno 0,152; 0,149; 0,038; 0,264.'},
    {q:'Cinque giri, cinque errori molto diversi. Quale teniamo?',add:[3],say:'Nessuno in particolare: la loro <b>media</b>. Qui (0,193 + 0,152 + 0,149 + 0,038 + 0,264) / 5 = 0,159.'},
    {q:'Che cosa abbiamo ottenuto?',add:[4],say:'Un solo numero per il modello, l\'<b>errore di cross-validation</b>. Ogni punto è stato usato per il test una volta sola e per il training tutte le altre.'}],
  scene(host){
    const sv=Svg(host,600,250,'Cinque giri di cross-validation: in ognuno un fold diverso è messo da parte'),g=S('g',null,sv),E=['0,193','0,152','0,149','0,038','0,264'],EV=[0.193,0.152,0.149,0.038,0.264],BX=92,BW=66,GAP=6,RY=j=>36+j*35;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      S('rect',{x:BX,y:8,width:14,height:14,fill:C.orange},g);lab(g,BX+20,20,'fold di test',C.orange,'start',13);S('rect',{x:BX+130,y:8,width:14,height:14,fill:'#8c8c8c'},g);lab(g,BX+150,20,'training','#bbb','start',13);
      const rows=k===0?1:k===1?1+4*clamp(fr/0.8,0,1):5;
      for(let j=0;j<5;j++){const a=clamp(rows-j,0,1);if(a<=0)continue;const gr=S('g',{opacity:a},g),y=RY(j);
        lab(gr,16,y+19,'giro '+(j+1),'#ddd','start',14);
        for(let i=0;i<5;i++){const te=i===j;S('rect',{x:BX+i*(BW+GAP),y,width:BW,height:26,rx:3,fill:te?C.orange:'#8c8c8c',opacity:te?1:.55},gr);if(te){const e=lab(gr,BX+i*(BW+GAP)+BW/2,y+18,'6 punti','#000',null,13);e.style.fontWeight='600'}}
        const bx=BX+5*(BW+GAP)+8;S('rect',{x:bx,y:y+5,width:EV[j]*160,height:16,fill:C.pink,opacity:.85},gr);lab(gr,bx+52,y+18,E[j],C.pink,'start',14)}
      if(k>=2){const bx=BX+5*(BW+GAP)+8,xm=bx+0.159*160,a=k===2?t:1;S('line',{x1:xm,x2:xm,y1:RY(0)-4,y2:RY(0)-4+(RY(4)+30-RY(0)+4)*a,stroke:'#fff','stroke-width':2,'stroke-dasharray':'5 4'},g);
        if(a>0.8)lab(g,300,236,'media dei cinque errori: 0,796 / 5 = 0,159','#fff',null,15)}}}
};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. il costo ridge: errore + lambda · somma dei quadrati dei pesi ---------- */
BUILD.l06_ridge={
  tex:R`⟦4|\min_{\Wv}\ \ ⟧⟦0|\frac{1}{2N}\sum_{i=1}^{N}\big(\Yy_i-\Xv_i^\top\Wv\big)^2⟧⟦1|\;+\;⟧⟦3|\Rl⟧⟦2|\sum_{j=1}^{d}\Ws_j^2⟧`,
  end:'La ridge regression: l\'errore sui dati, più una multa che cresce con il quadrato dei pesi.',
  steps:[
    {q:'Due modelli candidati per gli stessi dati. Guardando solo i dati, quale preferire?',add:[0],say:'L\'<b>errore</b> di sempre: la media dei quadrati degli scarti fra le risposte \\(\\Yy_i\\) e le previsioni \\(\\Xv_i^\\top\\Wv\\), divisa per due. Il modello A sbaglia 0,2 e il B 0,8: fin qui vince A.'},
    {q:'Ma A usa pesi grandi, 3 e −4; B usa pesi piccoli, 1 e −1. Serve un numero che dica quanto sono grandi i pesi.',add:[2],say:'La <b>somma dei quadrati dei pesi</b>. Il quadrato cancella il segno e fa contare molto i pesi grandi: per A fa 9 + 16 = 25, per B fa 1 + 1 = 2.'},
    {q:'Quanto deve contare la grandezza dei pesi rispetto all\'errore?',add:[1,3],say:'Lo decide \\(\\Rl\\), un numero positivo scelto da noi: moltiplica la somma dei quadrati, e il risultato (la <b>multa</b>) si aggiunge all\'errore. Con \\(\\Rl=0{,}1\\): A paga 0,2 + 2,5 = 2,7; B paga 0,8 + 0,2 = 1,0.'},
    {q:'Chi vince, adesso?',add:[4],say:'Si cerca il <b>minimo</b> del totale fra tutti i pesi possibili. Fra i nostri due candidati ora vince B: A sbaglia meno, ma il guadagno non ripaga la multa.'}],
  scene(host){const sv=Svg(host,600,275,'Due modelli candidati: errore, somma dei quadrati dei pesi e multa'),g=S('g',null,sv),B=218,U=44,q=13,
      MD=[{n:'Modello A',w:[3,-4],e:0.2,x:112},{n:'Modello B',w:[1,-1],e:0.8,x:400}];
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1)),lam=k<2?0:k===2?0.1*t:0.1;
      S('line',{x1:40,x2:560,y1:B,y2:B,stroke:'#777'},g);
      MD.forEach((m,i)=>{const ss=m.w[0]*m.w[0]+m.w[1]*m.w[1],he=m.e*U*(k===0?t:1),hp=lam*ss*U,x=m.x,win=k>=3&&i===1;
        lab(g,x+50,22,m.n,'#fff',null,16);lab(g,x+50,42,'pesi '+String(m.w[0])+' e '+String(m.w[1]).replace('-','−'),C.yellow,null,14);
        S('rect',{x:x-22,y:B-he,width:44,height:he,fill:C.pink},g);
        if(hp>0.3)S('rect',{x:x-22,y:B-he-hp,width:44,height:hp,fill:C.orange},g);
        if(win){const a=ez(clamp(fr/0.5,0,1));S('rect',{x:x-28,y:B-he-hp-6,width:56,height:he+hp+6,fill:'none',stroke:'#fff','stroke-width':2.5,opacity:a,rx:4},g)}
        lab(g,x,B+20,'errore '+nf(m.e,1),C.pink,null,14);
        if(k>=2){lab(g,x,B+40,'multa '+nf(lam*ss,2),C.orange,null,14);lab(g,x,B-he-hp-(win?14:8),'totale '+nf(m.e+lam*ss,2),'#fff',null,14)}
        if(k>=1){const a=k===1?t:1;let sx=x+44;m.w.forEach(v=>{const s=Math.abs(v)*q;S('rect',{x:sx,y:B-s,width:s,height:s,fill:C.orange,opacity:.5*a,stroke:C.orange,'stroke-width':1.5},g);sx+=s+8});
          const e=lab(g,x+44,B+20,m.w.map(v=>v*v).join(' + ')+' = '+ss,C.orange,'start',14);e.style.opacity=a}});
      if(k>=2)lab(g,300,104,'λ = '+nf(lam,2),C.orange,null,17)}}};

/* ---------- scena comune: un solo peso, pendenza dell'errore contro pendenza della multa ---------- */
function pull(host,label){
  const p=Plot(host,{W:600,H:322,m:[40,12,14,98],xr:[-0.6,3.2],yr:[-0.2,3.2],label});p.axes([0,1,2,3],[0,1,2,3]);lab(p.top,p.ax+p.aw-4,p.ay+16,'costo','#c9c9c9','end',14);
  S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);
  const g=S('g',null,p.g),s=S('g',null,p.top),note=H('div',{class:'sub'},host.parentNode);note.style.minHeight='1.5em';note.style.color='#fff';
  lab(p.top,p.ax+p.aw,p.ay+p.ah+36,'peso w','#c9c9c9','end',14);
  const KP=90,Y1=276,Y2=304;
  /* o: a, w, err(w), pen(w) oppure null, dpen (pendenza della multa in w), sum (mostra la somma), op (opacità multa), os (opacità somma), eq */
  function draw(o){g.textContent='';s.textContent='';const X=p.sx(o.w),tot=w=>o.err(w)+(o.pen?o.pen(w):0);
    S('line',{x1:p.sx(o.a),x2:p.sx(o.a),y1:p.ay,y2:p.ay+p.ah,stroke:C.pink,'stroke-dasharray':'4 4',opacity:.7},g);
    S('path',{d:p.curve(o.err,-0.6,3.2,200),fill:'none',stroke:C.pink,'stroke-width':2.2},g);
    if(o.pen)S('path',{d:p.curve(o.pen,-0.6,3.2,200),fill:'none',stroke:C.orange,'stroke-width':2.2,opacity:o.op},g);
    if(o.sum)S('path',{d:p.curve(tot,-0.6,3.2,400),fill:'none',stroke:'#fff','stroke-width':2.8,opacity:o.os},g);
    const yv=o.sum?tot(o.w):o.err(o.w),Y=p.sy(yv);
    S('line',{x1:X,x2:X,y1:Y,y2:p.ay+p.ah,stroke:'#999','stroke-dasharray':'3 4'},g);
    S('circle',{cx:X,cy:Y,r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},g);
    if(o.eq)lab(g,X,Y-16,'equilibrio','#fff',null,14);
    const de=o.w-o.a,L1=-de*KP;
    if(Math.abs(L1)>3)arrow(s,X,Y1,X+L1,Y1,C.pink,3);S('circle',{cx:X,cy:Y1,r:4,fill:'#fff'},s);
    lab(s,Math.max(X,X+L1)+10,Y1+5,'errore: pendenza '+nf(de,2),C.pink,'start',14);
    if(o.pen&&o.op>0.05){const L2=o.dpen*KP*o.op;if(L2>3)arrow(s,X,Y2,X-L2,Y2,C.orange,3);S('circle',{cx:X,cy:Y2,r:4,fill:'#fff'},s);
      lab(s,X+10,Y2+5,'multa: pendenza +'+nf(o.dpen,2),C.orange,'start',14)}
    note.textContent=o.note||''}
  return draw}

/* ---------- 2. ridge su un peso solo: le due pendenze si bilanciano, il peso viene diviso ---------- */
BUILD.l06_shrink={
  tex:R`\begin{gathered}⟦0|(\Ws-a)⟧⟦1|\;+\;2\,\Rl\,\Ws⟧⟦2|\;=\;0⟧\\[.6em]⟦3|\Ws^*\;=\;\frac{a}{1+2\,\Rl}⟧\end{gathered}`,
  end:'Ridge divide il peso per un numero maggiore di 1: lo rimpicciolisce, ma non lo azzera.',
  steps:[
    {q:'Un solo peso. Senza multa il valore migliore è 2. Se lo sposto di poco, di quanto cambia l\'errore?',add:[0],say:'Della <b>pendenza dell\'errore</b>: la distanza \\(\\Ws-a\\) dal valore migliore \\(a\\). In 2 è zero; in 1 vale −1: lì aumentare il peso farebbe scendere l\'errore. La freccia rosa indica da che parte l\'errore scende.'},
    {q:'E la multa, di quanto cambia con lo stesso spostamento?',add:[1],say:'Della <b>pendenza della multa</b> \\(\\Rl\\Ws^2\\), che è \\(2\\Rl\\Ws\\): proporzionale al peso. Con \\(\\Rl=0{,}5\\), in 1 vale +1: la multa scende andando verso lo zero (freccia arancione).'},
    {q:'Dove si ferma il peso?',add:[2],say:'Dove le due pendenze <b>si annullano</b> a vicenda, e spostarsi non conviene più in nessun verso. Qui succede in 1: −1 + 1 = 0. È il fondo della curva bianca, la somma di errore e multa.'},
    {q:'Quanto vale quel punto, in generale?',add:[3],say:'Risolvendo si trova il valore senza multa <b>diviso per</b> \\(1+2\\Rl\\). Con \\(\\Rl=0{,}5\\): 2 / 2 = 1. Guarda \\(\\Rl\\) salire fino a 2: il peso scende a 0,4, ma dividere non dà mai zero.'}],
  scene(host){const draw=pull(host,'Costo, multa ridge e loro somma in funzione di un solo peso'),a=2,err=w=>0.5*(w-a)*(w-a);
    return (k,fr,fin)=>{const t=ez(clamp(fr/0.6,0,1));
      if(k===0)return draw({a,w:2-t,err});
      let lam=0.5;if(k===3)lam=fr<0.25?0.5*(1-ez(fr/0.25)):2*ez(clamp((fr-0.25)/0.65,0,1));
      const w=k===3?a/(1+2*lam):1,pen=x=>lam*x*x;
      draw({a,w,err,pen,dpen:2*lam*w,op:k===1?t:1,sum:k>=2,os:k===2?t:1,eq:k===2&&fr>0.5,
        note:k===3?'λ = '+nf(lam,2)+' · peso migliore: 2 / '+nf(1+2*lam,2)+' = '+nf(w,2):''})}}};

/* ---------- 3. lasso su un peso solo: la multa spinge sempre con la stessa forza ---------- */
BUILD.l06_lasso={
  tex:R`\begin{gathered}⟦0|(\Ws-a)⟧⟦1|\;+\;\Rl⟧⟦2|\;=\;0⟧\\[.6em]⟦2|\Ws^*\;=\;a-\Rl⟧⟦3|\qquad\text{ma}\quad\Ws^*=0\ \ \text{se}\ \ a\le\Rl⟧\end{gathered}`,
  end:'Il lasso toglie al peso una quantità fissa; se il peso è più piccolo di quella quantità, lo azzera.',
  steps:[
    {q:'Lo stesso peso di prima: senza multa il valore migliore è 2. La pendenza dell\'errore non è cambiata.',add:[0],say:'È ancora la distanza \\(\\Ws-a\\) dal valore migliore. In 1,5 vale −0,5: l\'errore scende andando verso 2.'},
    {q:'Ora la multa è il valore assoluto del peso, per \\(\\Rl\\). Qual è la sua pendenza?',add:[1],say:'Per un peso positivo è sempre <b>la stessa</b>, \\(\\Rl\\): qui 0,5, lontano da zero come a un passo da zero. Guarda la freccia arancione mentre il peso si muove: non si accorcia mai. Con ridge, vicino a zero, spariva.'},
    {q:'Dove si ferma il peso?',add:[2],say:'Dove le due pendenze si annullano: \\(\\Ws-a=-\\Rl\\). Il peso è il valore senza multa <b>meno</b> \\(\\Rl\\): 2 − 0,5 = 1,5. Una quantità fissa in meno, non una divisione.'},
    {q:'E se il valore senza multa è più piccolo di \\(\\Rl\\)?',add:[3],say:'Sottraendo si andrebbe sotto zero, ma il peso <b>si ferma a zero</b>. Con \\(a=0{,}3\\) l\'errore tira verso destra al massimo con 0,3, la multa verso zero con 0,5: vince la multa, fino in fondo.'}],
  scene(host){const draw=pull(host,'Costo, multa lasso e loro somma in funzione di un solo peso'),lam=0.5,pen=x=>lam*Math.abs(x);
    return (k,fr,fin)=>{const t=ez(clamp(fr/0.6,0,1));let a=2;const err=w=>0.5*(w-a)*(w-a);
      if(k===0)return draw({a,w:2-0.5*t,err});
      if(k===1){const u=Math.sin(Math.PI*clamp(fr/0.9,0,1));return draw({a,w:1.5-1.2*u*u,err,pen,dpen:lam,op:ez(clamp(fr/0.25,0,1))})}
      if(k===2)return draw({a,w:1.5,err,pen,dpen:lam,op:1,sum:true,os:t,eq:fr>0.5});
      a=2-1.7*ez(clamp(fr/0.85,0,1));const w=Math.max(0,a-lam);
      draw({a,w,err,pen,dpen:lam,op:1,sum:true,os:1,note:'senza multa: '+nf(a,2)+' · con la multa: '+(w>1e-9?nf(a,2)+' − 0,50 = '+nf(w,2):'zero esatto')})}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const sig=z=>1/(1+Math.exp(-z));

/* ---------- 1. dal punteggio alla probabilità: la sigmoide in tre mosse ---------- */
BUILD.l07_sigmoid={
  tex:R`\begin{gathered}⟦0|z⟧⟦1|\to e^{-z}⟧⟦2|\,\to 1{+}e^{-z}⟧⟦3|\,\to\frac{1}{1{+}e^{-z}}⟧⟦4|\,=\sigma(z)⟧\\[.7em]⟦5|P(\Yy=1\mid\Xv)\;=\;\sigma(\Wv^\top\Xv+\Ws_0)⟧\end{gathered}`,
  end:'La regressione logistica: il punteggio lineare, passato attraverso la sigmoide, diventa una probabilità.',
  steps:[
    {q:'Il punteggio può essere un numero qualsiasi, anche negativo o maggiore di 1. Una probabilità no.',add:[0],say:'Chiamiamo \\(z\\) il <b>punteggio</b>. Seguiamo due esempi, \\(z=1\\) e \\(z=-1\\): così com\'è, il secondo cade fuori dalla fascia verde fra 0 e 1, dove stanno le probabilità.'},
    {q:'Prima mossa: liberarsi dei numeri negativi.',add:[1],say:'L\'<b>esponenziale</b> è sempre positivo. Lo si applica a \\(-z\\), così i punteggi alti danno numeri piccoli: 1 diventa 0,37 e −1 diventa 2,72.'},
    {q:'Un numero maggiore di 1 ha un pregio: il suo reciproco sta fra 0 e 1. Portiamo tutto sopra 1.',add:[2],say:'Si <b>aggiunge 1</b>: 0,37 diventa 1,37 e 2,72 diventa 3,72. Adesso tutta la curva sta sopra 1.'},
    {q:'Ultima mossa: rovesciare.',add:[3],say:'Si prende il <b>reciproco</b>: 1 / 1,37 = 0,73 e 1 / 3,72 = 0,27. Tutta la curva è entrata nella fascia fra 0 e 1, e i punteggi alti danno valori vicini a 1.'},
    {q:'Questa funzione ha un nome.',add:[4],say:'È la <b>sigmoide</b>, indicata con \\(\\sigma\\). In \\(z=0\\) vale 1 / (1 + 1) = ½. È simmetrica: i due esempi insieme fanno 1, perché 0,73 + 0,27 = 1.'},
    {q:'Che cosa ci mettiamo dentro?',add:[5],say:'Il punteggio lineare del cliente. Con peso 4 e intercetta −6, un saldo di 2 (migliaia di dollari) dà \\(z=4\\cdot 2-6=2\\): la <b>probabilità</b> di insolvenza è \\(\\sigma(2)=0{,}88\\).'}],
  scene(host){const p=Plot(host,{W:600,H:300,m:[40,12,14,40],xr:[-6,6],yr:[-1.5,4.2],label:'Dal punteggio alla sigmoide: esponenziale, più uno, reciproco'}),g=S('g',null,p.g);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1)),zoom=k>3?1:k===3?ez(clamp((fr-0.5)/0.4,0,1)):0,u=ez(clamp(fr/0.45,0,1));
      const f=k===0?z=>z:k===1?z=>(1-t)*z+t*Math.exp(-z):k===2?z=>Math.exp(-z)+t:k===3?z=>{const q=1+Math.exp(-z);return (1-u)*q+u/q}:sig;
      p.yr[0]=-1.5+1.38*zoom;p.yr[1]=4.2-3*zoom;p.axes([-6,-4,-2,0,2,4,6],zoom>0.5?[0,0.5,1]:[-1,0,1,2,3,4],'punteggio z');
      S('rect',{x:p.ax,y:p.sy(1),width:p.aw,height:p.sy(0)-p.sy(1),fill:'rgba(131,193,103,.16)'},g);
      [0,1].forEach(v=>S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(v),y2:p.sy(v),stroke:C.green,'stroke-dasharray':'4 4',opacity:.8},g));
      if(!(k===3&&u>0.01&&u<0.99))lab(g,p.ax+10,p.sy(0.5)+5,'le probabilità stanno qui',C.green,'start',13);
      S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},g);
      S('path',{d:p.curve(f,-6,6,300),fill:'none',stroke:C.yellow,'stroke-width':2.8},g);
      if(k<5)[1,-1].forEach(z0=>{const v=f(z0),X=p.sx(z0),Y=p.sy(v),inc=f(z0+0.05)>f(z0-0.05);
        S('line',{x1:X,x2:X,y1:Y,y2:p.ay+p.ah,stroke:'#888','stroke-dasharray':'3 4'},g);S('circle',{cx:X,cy:Y,r:6,fill:'#fff',stroke:'#000','stroke-width':1.5},g);
        if(z0>0)lab(g,X+11,inc?Y+21:Y-10,nf(v,2),'#fff','start',15);else lab(g,X-11,inc?Y-10:Y+21,nf(v,2),'#fff','end',15)});
      else{const X=p.sx(2),Y=p.sy(sig(2)),a=ez(clamp(fr/0.5,0,1));
        S('path',{d:`M${X} ${p.ay+p.ah}V${Y}H${p.ax}`,fill:'none',stroke:'#aaa','stroke-dasharray':'3 4',opacity:a},g);
        S('circle',{cx:X,cy:Y,r:7,fill:'#fff',stroke:'#000','stroke-width':1.5},g);
        const e=lab(g,X+14,p.sy(0.45),'z = 2  →  σ(2) = 0,88','#fff','start',15);e.style.opacity=a}}}};

/* ---------- 2. dalla probabilità dei dati alla log loss ---------- */
BUILD.l07_logloss={
  tex:R`⟦4|\cL(\Wv)\;=\;-⟧⟦3|\sum_{i=1}^{N}⟧⟦1|\Big[\,\Yy_i\,⟧⟦2|\log⟧⟦0|p_i⟧⟦1|\;+\;(1-\Yy_i)\,⟧⟦2|\log⟧⟦0|(1-p_i)⟧⟦1|\,\Big]⟧`,
  end:'La log loss: quanto poco il modello credeva alle risposte vere, sommato su tutti i clienti.',
  steps:[
    {q:'Quattro clienti, e per ciascuno la probabilità di insolvenza \\(p\\) detta dal modello. Quanta probabilità aveva dato alla risposta vera?',add:[0],say:'Se il cliente è insolvente è proprio \\(p_i\\); se è solvente è il resto, \\(1-p_i\\). Per i quattro clienti: 0,9; 0,6; 0,8; 0,3. L\'ultimo è un errore: il modello dava l\'insolvenza al 70% e il cliente era solvente.'},
    {q:'Due casi, due espressioni. Si possono scrivere in una sola?',add:[1],say:'Sì, usando la risposta come <b>interruttore</b>: \\(\\Yy_i\\) vale 1 o 0, e \\(1-\\Yy_i\\) il contrario. Uno dei due addendi si spegne sempre: con \\(\\Yy_i=1\\) resta \\(p_i\\), con \\(\\Yy_i=0\\) resta \\(1-p_i\\).'},
    {q:'Un buon modello ci prende su tutti i clienti insieme: si moltiplica, 0,9 × 0,6 × 0,8 × 0,3 ≈ 0,13. Con mille clienti, però, il prodotto sarebbe un numero minuscolo.',add:[2],say:'Si passa al <b>logaritmo</b> (naturale), che trasforma i prodotti in somme senza cambiare quali pesi sono i migliori. Le quattro probabilità diventano −0,11; −0,51; −0,22; −1,20: più la probabilità è bassa, più il numero è negativo.'},
    {q:'Il logaritmo di un prodotto è la somma dei logaritmi.',add:[3],say:'Si <b>sommano</b> i contributi dei clienti: −0,11 − 0,51 − 0,22 − 1,20 = −2,04, che è proprio il logaritmo di 0,13. I pesi migliori sono quelli che portano questo numero più in alto.'},
    {q:'Siamo abituati a minimizzare un costo, non a massimizzare.',add:[4],say:'Basta <b>cambiare segno</b>: ecco la <b>log loss</b>, qui 2,04. Ogni cliente paga \\(-\\log\\) della probabilità data alla sua risposta vera. Quello sbagliato con sicurezza paga 1,20: più degli altri tre messi insieme (0,84).'}],
  scene(host){const sv=Svg(host,600,300,'Quattro clienti: probabilità della risposta vera, logaritmo e costo'),g=S('g',null,sv),D=[{y:1,p:0.9},{y:1,p:0.6},{y:0,p:0.2},{y:0,p:0.7}],X=i=>105+i*130,B=168,UP=95,UL=55;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1));S('line',{x1:30,x2:570,y1:B,y2:B,stroke:'#777'},g);
      D.forEach((d,i)=>{const q=d.y?d.p:1-d.p,L=-Math.log(q),x=X(i);
        lab(g,x,20,d.y?'insolvente, y = 1':'solvente, y = 0',d.y?C.orange:C.blue,null,14);lab(g,x,40,'modello: p = '+nf(d.p,1),'#ddd',null,14);
        if(k<4||t<1){const h=q*UP*(k===0?t:1),o=k===4?1-t:1;S('rect',{x:x-20,y:B-h,width:40,height:h,fill:C.green,opacity:o},g);
          const e=lab(g,x,B-h-7,(d.y?'p = ':'1 − p = ')+nf(q,1),C.green,null,14);e.style.opacity=o}
        if(k===1){const e=lab(g,x,B+22,d.y+' · '+nf(d.p,1)+' + '+(1-d.y)+' · '+nf(1-d.p,1),'#fff',null,14);e.style.opacity=t}
        if(k===2||k===3){const len=L*UL*(k===2?t:1);S('rect',{x:x-20,y:B,width:40,height:len,fill:C.teal},g);lab(g,x,B+len+18,nf(-L,2),C.teal,null,14)}
        if(k===4){const s=-1+2*t,len=Math.abs(s)*L*UL;
          if(s<0){S('rect',{x:x-20,y:B,width:40,height:len,fill:C.teal},g);lab(g,x,B+len+18,nf(-L,2),C.teal,null,14)}
          else{S('rect',{x:x-20,y:B-len,width:40,height:len,fill:C.pink},g);if(t>0.9)lab(g,x,B-len-7,nf(L,2),C.pink,null,14)}}});
      if(k===2)lab(g,300,286,'tutti insieme: 0,9 × 0,6 × 0,8 × 0,3 ≈ 0,13','#fff',null,15);
      if(k===3)lab(g,300,286,'somma dei logaritmi: −2,04 = log 0,13','#fff',null,15);
      if(k===4&&t>0.5)lab(g,300,286,'log loss: 0,11 + 0,51 + 0,22 + 1,20 = 2,04',C.pink,null,15)}}};

/* ---------- 3. il gradiente: tre sensibilità in catena ---------- */
BUILD.l07_grad={
  tex:R`\begin{gathered}⟦3|\frac{\partial\cl_i}{\partial\Ws}\;=\;⟧⟦0|\Xs_i⟧⟦1|\;\cdot\;p_i(1-p_i)⟧⟦2|\;\cdot\;\frac{p_i-\Yy_i}{p_i(1-p_i)}⟧\\[.5em]⟦4|=\;(p_i-\Yy_i)\,\Xs_i⟧\\[.7em]⟦5|\Gr\cL(\Wv)\;=\;\sum_{i=1}^{N}\big(\sigma(\Wv^\top\Xv_i)-\Yy_i\big)\,\Xv_i⟧\end{gathered}`,
  end:'Il gradiente della log loss: per ogni cliente, (previsione − risposta) × input.',
  steps:[
    {q:'Il costo dipende dal peso attraverso una catena: peso, punteggio, probabilità, costo. Primo anello: se sposto di poco il peso, di quanto cambia il punteggio?',add:[0],say:'Il punteggio è peso × input + intercetta, quindi cambia di <b>\\(\\Xs_i\\) volte tanto</b>. Questo cliente ha saldo 2: portando il peso da 4 a 4,01 il punteggio sale di 0,02.'},
    {q:'Secondo anello: quanto è sensibile la probabilità al punteggio?',add:[1],say:'È la pendenza della sigmoide, che vale <b>\\(p(1-p)\\)</b>: grande a metà salita, quasi nulla alle estremità. Qui 0,881 × 0,119 ≈ 0,105, e la probabilità sale di 0,02 × 0,105 ≈ 0,0021.'},
    {q:'Terzo anello: quanto è sensibile il costo alla probabilità?',add:[2],say:'È la pendenza della log loss. Per un cliente con \\(\\Yy=1\\) il costo è \\(-\\log p\\) e la frazione si riduce a \\(-1/p\\): qui −1,14. Alzare la probabilità abbassa il costo, di circa 0,0024.'},
    {q:'Tre sensibilità in fila. Qual è l\'effetto complessivo del peso sul costo \\(\\cl_i\\) di questo cliente?',add:[3],say:'Si <b>moltiplicano</b>, anello dopo anello: 2 × 0,105 × (−1,14) ≈ −0,24. È negativo: aumentare il peso fa scendere il costo di questo cliente.'},
    {q:'Nel prodotto c\'è un termine che compare sia sopra sia sotto.',add:[4],say:'\\(p(1-p)\\) <b>si cancella</b>, e resta (previsione − risposta) × input: (0,88 − 1) × 2 = −0,24. Lo stesso numero, senza passare dalla catena.'},
    {q:'Fin qui un cliente e un peso. E con tutti?',add:[5],say:'Si <b>somma</b> sui clienti e si ripete per ogni peso: le sensibilità si raccolgono in un vettore, il gradiente della log loss. Al posto di \\(p_i\\) c\'è scritto per esteso \\(\\sigma(\\Wv^\\top\\Xv_i)\\).'}],
  scene(host){const sv=Svg(host,600,232,'La catena peso, punteggio, probabilità, costo e come si propaga un piccolo spostamento'),g=S('g',null,sv),X=[75,225,375,525],
      T=['peso w','punteggio z','probabilità p','costo'],V0=[4,2,0.8808,0.1269],V1=[4.01,2.02,0.8829,0.1246],DG=[2,2,3,3],CL=[C.yellow,'#fff',C.green,C.pink],
      MU=['× 2','× 0,105','× (−1,14)'],DL=['+0,01','+0,02','+0,0021','−0,0024'],
      CP=['il peso sale di 0,01  →  il punteggio sale di 0,02','il punteggio sale di 0,02  →  la probabilità sale di 0,0021','la probabilità sale di 0,0021  →  il costo scende di 0,0024','2 × 0,105 × (−1,14) ≈ −0,24','(0,88 − 1) × 2 = −0,24','(previsione − risposta) × input, sommato su tutti i clienti'];
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1)),nud=i=>k>=3||i<=k||(i===k+1&&t>0.9);
      for(let j=0;j<3;j++){const act=k>=3||j===k,x1=X[j]+62,x2=X[j+1]-62;arrow(g,x1,78,x2,78,act?'#fff':'#777',2.5);
        if(j<=k||k>=3){const e=lab(g,(X[j]+X[j+1])/2,32,MU[j],k===4&&j>0?'#999':'#fff',null,15);e.style.opacity=j===k&&k<3?t:1}
        if(j===k&&k<3&&t<1)S('circle',{cx:X[j]+58+(X[j+1]-X[j]-116)*t,cy:78,r:5,fill:C.orange},g)}
      X.forEach((x,i)=>{const n=nud(i);S('rect',{x:x-58,y:46,width:116,height:64,rx:8,fill:'#161616',stroke:n?CL[i]:'#666','stroke-width':n?2:1.2},g);
        lab(g,x,68,T[i],'#bbb',null,14);lab(g,x,96,nf(n?V1[i]:V0[i],DG[i]),CL[i],null,19);
        if(n)lab(g,x,132,DL[i],CL[i],null,15)});
      const e=lab(g,300,176,CP[k],'#fff',null,16);e.style.opacity=k>=3?ez(clamp(fr/0.4,0,1)):1;
      lab(g,300,214,'cliente insolvente (y = 1), saldo x = 2; modello con peso 4 e intercetta −6','#c9c9c9',null,14)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. il margine di un punto: punteggio → distanza → per l'etichetta ---------- */
BUILD.l8_margin={
  tex:R`⟦4|\Gk_i\;=\;⟧⟦3|\Yy_i\,\big(⟧⟦1|\Wv^\top\Xv_i+\Bi⟧⟦3|\big)⟧⟦2|\;\big/\;\lVert\Wv\rVert⟧`,
  end:'Il margine di un punto: quanto dista dal confine, con il segno più se sta dalla parte giusta.',
  steps:[
    {q:'Un confine e due punti: A di classe +1, B di classe −1. Da che parte del confine sta ciascuno?',add:[1],say:'Lo dice il <b>punteggio</b>: pesi per features, più l\'intercetta. Con \\(\\Wv=(3;\\,4)\\) e \\(\\Bi=-10\\), per A = (4; 2) vale 3·4 + 4·2 − 10 = 10, per B = (1; 0,5) vale 3 + 2 − 10 = −5. Segno più: lato verso cui punta \\(\\Wv\\).'},
    {q:'Ma 10 non è una distanza: raddoppiando pesi e intercetta il confine resta dov\'è e il punteggio diventa 20.',add:[2],say:'Si divide per la <b>lunghezza dei pesi</b>, qui \\(\\sqrt{3^2+4^2}=5\\). Ora il numero non dipende più dalla scala: A dista 10 / 5 = 2, B dista −5 / 5 = −1. È la distanza con segno.'},
    {q:'B è dalla parte giusta, eppure la sua distanza è negativa. Come si dice «dalla parte giusta» con un solo numero?',add:[3],say:'Si moltiplica per l\'<b>etichetta</b>. Per B: (−1) · (−1) = 1. Per A: (+1) · 2 = 2. Positivo vuol dire parte giusta, qualunque sia la classe.'},
    {q:'Che nome diamo a questo numero?',add:[4],say:'È il <b>margine</b> del punto. Il più piccolo fra tutti, qui quello di B che vale 1, è il margine del classificatore: metà della larghezza della strada.'}],
  scene(host){const sv=Svg(host,600,300,'Un confine, due punti e le loro distanze dal confine'),g=S('g',null,sv),u=52,X=x=>40+(x+0.5)*u,Y=y=>268-(y+0.6)*u;
    const A=[4,2],B=[1,0.5],fA=[2.8,0.4],fB=[1.6,1.3],L1=[-0.5,2.875],L2=[4.1333,-0.6],n=[0.6,0.8];
    const row=(y,t,c,o)=>{const e=lab(g,400,y,t,c,'start',14);if(o!=null)e.style.opacity=o;return e};
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      if(k>=3){const h=k===3?t:1,P=[[L1[0]+n[0]*h,L1[1]+n[1]*h],[L2[0]+n[0]*h,L2[1]+n[1]*h],[L2[0]-n[0]*h,L2[1]-n[1]*h],[L1[0]-n[0]*h,L1[1]-n[1]*h]];
        S('path',{d:'M'+P.map(q=>X(q[0])+' '+Y(q[1])).join('L')+'Z',fill:'rgba(255,255,0,.16)'},g)}
      S('line',{x1:X(L1[0]),y1:Y(L1[1]),x2:X(L2[0]),y2:Y(L2[1]),stroke:'#fff','stroke-width':2.4},g);lab(g,X(3.25),Y(0.5),'confine','#ddd','start',13);
      arrow(g,X(0.4),Y(2.2),X(0.4+n[0]*1.3),Y(2.2+n[1]*1.3),C.yellow,3);lab(g,X(1.18)+12,Y(3.24)+12,'w',C.yellow,'start',16).style.fontWeight='700';
      if(k>=1){const a=k===1?t:1;[[A,fA],[B,fB]].forEach(q=>S('line',{x1:X(q[0][0]),y1:Y(q[0][1]),x2:X(q[0][0]+(q[1][0]-q[0][0])*a),y2:Y(q[0][1]+(q[1][1]-q[0][1])*a),stroke:C.pink,'stroke-width':3},g))}
      if(k>=3)S('circle',{cx:X(B[0]),cy:Y(B[1]),r:8+7*(k===3?t:1),fill:'none',stroke:C.yellow,'stroke-width':2.5},g);
      S('circle',{cx:X(A[0]),cy:Y(A[1]),r:8,fill:C.orange,stroke:'#000','stroke-width':1.5},g);lab(g,X(A[0])+14,Y(A[1])-10,'A',C.orange,'start',16);
      S('circle',{cx:X(B[0]),cy:Y(B[1]),r:8,fill:C.blue,stroke:'#000','stroke-width':1.5},g);lab(g,X(B[0])-14,Y(B[1])+20,'B',C.blue,'end',16);
      const o1=k===1?t:1,o2=k===2?t:1;
      row(44,'A, classe +1',C.orange).style.fontWeight='700';row(68,'punteggio 10','#fff',k===0?t:1);
      if(k>=1)row(92,'distanza 10 / 5 = 2',C.pink,o1);if(k>=2)row(116,'margine (+1) · 2 = 2','#fff',o2);
      row(170,'B, classe −1',C.blue).style.fontWeight='700';row(194,'punteggio −5','#fff',k===0?t:1);
      if(k>=1)row(218,'distanza −5 / 5 = −1',C.pink,o1);if(k>=2)row(242,'margine (−1) · (−1) = 1','#fff',o2);
      if(k>=3)row(278,'margine del classificatore: 1',C.yellow,k===3?t:1)}}};

/* ---------- 2. SVM a margine rigido: vincoli → lunghezza dei pesi → minimo ---------- */
BUILD.l8_hard={
  tex:R`\begin{gathered}⟦3|\min_{\Wv,\,\Bi}\ ⟧⟦4|\frac12⟧⟦2|\lVert\Wv\rVert⟧⟦4|{}^2⟧\\[.5em]⟦1|\text{con}\quad \Yy_i\,(\Wv^\top\Xv_i+\Bi)\ \ge\ 1\quad\text{per ogni } i⟧\end{gathered}`,
  end:'La SVM a margine rigido: i pesi più corti che tengono ogni punto fuori dalla strada.',
  steps:[
    {q:'Moltiplicare pesi e intercetta per un numero non sposta il confine. Quale scala scegliamo, fra le infinite possibili?',add:[1],say:'Quella in cui i bordi della strada hanno punteggio +1 e −1. Il <b>vincolo</b> chiede a ogni punto di stare dalla parte giusta e fuori dalla strada: etichetta per punteggio almeno 1. Qui il punto più vicino ha punteggio 2: vincolo rispettato.'},
    {q:'In questa scala, quanto è larga la strada?',add:[2],say:'Dipende solo dalla <b>lunghezza dei pesi</b>: ogni bordo dista dal confine 1 diviso la lunghezza. Con lunghezza 1 la strada è larga 2; con lunghezza 2 si stringe a 1. Pesi corti, strada larga.'},
    {q:'Vogliamo la strada più larga possibile.',add:[3],say:'Quindi cerchiamo i pesi <b>più corti</b> che rispettano tutti i vincoli. Qui si scende fino a 0,5: la strada è larga 4 e tocca i punti più vicini. Sotto 0,5 quei punti finirebbero dentro.'},
    {q:'Un ultimo ritocco, solo per comodità di calcolo.',add:[4],say:'Il <b>quadrato</b> e il fattore ½ non cambiano il vincitore: i pesi più corti hanno anche il quadrato più piccolo. In cambio il problema diventa facile da derivare. Qui il minimo vale ½ · 0,5² = 0,125.'}],
  scene(host){const sv=Svg(host,600,290,'Una strada attorno al confine che si allarga quando i pesi si accorciano'),g=S('g',null,sv),X=x=>300+x*62,Y=y=>142-y*60;
    const P=[[-2,0.5,-1],[-2.9,-0.8,-1],[-3.6,0.9,-1],[-2.6,1.4,-1],[-3.9,-0.3,-1],[2,-0.4,1],[2.7,1.0,1],[3.5,-1.0,1],[3.1,0.2,1],[4.0,1.3,1]];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1));let nw=1;
      if(k===1)nw=1+Math.sin(Math.PI*clamp(fr/0.85,0,1));if(k===2)nw=1-0.5*t;if(k===3)nw=0.5;
      const e=1/nw;S('rect',{x:X(-e),y:36,width:X(e)-X(-e),height:212,fill:'rgba(255,255,0,.16)'},g);
      [-e,e].forEach(x=>S('line',{x1:X(x),x2:X(x),y1:36,y2:248,stroke:C.yellow,'stroke-width':1.5,'stroke-dasharray':'5 4'},g));
      S('line',{x1:X(0),x2:X(0),y1:36,y2:248,stroke:'#fff','stroke-width':2.4},g);
      lab(g,20,26,'punteggio','#bbb','start',13);lab(g,X(-e),26,'−1',C.yellow,null,14);lab(g,X(0),26,'0','#fff',null,14);lab(g,X(e),26,'+1',C.yellow,null,14);
      P.forEach(d=>{if(k>=2&&Math.abs(d[0])===2)S('circle',{cx:X(d[0]),cy:Y(d[1]),r:12,fill:'none',stroke:C.yellow,'stroke-width':2.5,opacity:k===2?t:1},g);
        S('circle',{cx:X(d[0]),cy:Y(d[1]),r:7,fill:d[2]>0?C.orange:C.blue,stroke:'#000','stroke-width':1.5},g)});
      if(k===0){const a=t;S('line',{x1:X(0),x2:X(0)+(X(2)-X(0))*a,y1:Y(-0.4)+20,y2:Y(-0.4)+20,stroke:C.pink,'stroke-width':3},g);if(a>0.9)lab(g,X(1.5),Y(-0.4)+40,'punteggio 2',C.pink,null,13)}
      lab(g,300,274,'lunghezza dei pesi '+nf(nw,2)+'  ·  strada larga '+nf(2/nw,2),'#fff',null,16)}}};

/* ---------- 3. hinge loss e obiettivo della SVM a margine morbido ---------- */
BUILD.l8_hinge={
  tex:R`⟦4|\frac1N\sum_{i=1}^{N}⟧⟦3|\max\!\big\{0,\ ⟧⟦2|1-⟧⟦1|\Yy_i(\Wv^\top\Xv_i+\Bi)⟧⟦3|\big\}⟧⟦5|\;+\;\frac{\Rl}{2}\lVert\Wv\rVert^2⟧`,
  end:'L\'obiettivo della SVM a margine morbido: una loss media, la hinge, più una multa sui pesi.',
  steps:[
    {q:'Quattro punti. Per ciascuno, un solo numero che dica da che parte sta e quanto è lontano dal confine?',add:[1],say:'L\'<b>etichetta per il punteggio</b>, che chiamiamo \\(m\\). Qui vale −0,5 (parte sbagliata), 0,4 (parte giusta, ma dentro la strada), 1,2 e 2 (oltre il bordo, che sta a \\(m=1\\)).'},
    {q:'Il vincolo chiedeva di arrivare almeno a 1. Quanto manca a ciascuno?',add:[2],say:'<b>Uno meno \\(m\\)</b>: al primo punto manca 1,5, al secondo 0,6. Agli altri due non manca niente: il conto dà −0,2 e −1.'},
    {q:'Chi è già oltre il bordo non deve ricevere un premio: il suo slack è zero, non negativo.',add:[3],say:'Si prende il <b>più grande fra zero e quel numero</b>. È lo slack minimo indispensabile, e si chiama hinge loss: 1,5; 0,6; 0; 0.'},
    {q:'Come si tiene conto di tutti i punti?',add:[4],say:'Con la <b>media</b>, come per ogni loss: (1,5 + 0,6 + 0 + 0) / 4 = 0,525.'},
    {q:'E la strada larga, che fine ha fatto?',add:[5],say:'È la <b>multa</b> sui pesi: pesi corti, strada larga. Con \\(\\Rl=0{,}1\\) e pesi lunghi 2 vale 0,05 · 4 = 0,2. In tutto 0,525 + 0,2 = 0,725.'}],
  scene(host){const sv=Svg(host,600,312,'Quattro punti ordinati per etichetta per punteggio e quanto manca a ciascuno per arrivare al bordo'),g=S('g',null,sv),X=m=>60+(m+1)*128,Ms=[-0.5,0.4,1.2,2],RY=[58,98,138,178],B=206;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      S('rect',{x:X(-1),y:34,width:X(1)-X(-1),height:B-34,fill:'rgba(255,255,0,.07)'},g);
      S('line',{x1:X(-1.2),x2:X(2.5),y1:B,y2:B,stroke:'#777'},g);[-1,0,1,2].forEach(v=>lab(g,X(v),B+18,String(v).replace('-','−'),'#aaa',null,13));
      S('line',{x1:X(0),x2:X(0),y1:34,y2:B,stroke:'#fff','stroke-width':2},g);lab(g,X(0),26,'confine','#fff',null,13);
      S('line',{x1:X(1),x2:X(1),y1:34,y2:B,stroke:C.yellow,'stroke-width':1.5,'stroke-dasharray':'5 4'},g);lab(g,X(1),26,'bordo della strada',C.yellow,null,13);
      lab(g,X(-1.2),B+38,'m = etichetta × punteggio','#bbb','start',13);
      Ms.forEach((m,i)=>{const y=RY[i],gap=1-m,viol=gap>0;
        if(k>=1){const a=k===1?t:1,fade=!viol&&k>=2?(k===2?1-t:0):1;if(fade>0.02){const x2=X(m)+(X(1)-X(m))*a;S('line',{x1:X(m),x2,y1:y,y2:y,stroke:viol?C.pink:'#999','stroke-width':viol?4:3,opacity:fade,'stroke-dasharray':viol?'':'4 4'},g)}}
        S('circle',{cx:X(m),cy:y,r:7,fill:'#fff',stroke:'#000','stroke-width':1.5},g);
        const txt=k===0?'m = '+nf(m,1):k===1?'1 − m = '+nf(gap,1):'loss '+(viol?nf(gap,1):'0');
        lab(g,590,y+5,txt,k>=1&&viol?C.pink:'#ddd','end',14)});
      if(k>=3){const e=lab(g,X(-1.2),274,'media: (1,5 + 0,6 + 0 + 0) / 4 = 0,525',C.pink,'start',15);e.style.opacity=k===3?t:1}
      if(k>=4){const e=lab(g,X(-1.2),298,'multa: 0,05 · 2² = 0,2',C.orange,'start',15),e2=lab(g,590,298,'totale 0,725','#fff','end',15);e.style.opacity=t;e2.style.opacity=t}}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. la previsione usa i dati solo dentro prodotti scalari → kernel ---------- */
BUILD.l9_dots={
  tex:R`\begin{aligned}⟦0|\Yh(\Xv)⟧&⟦0|=\Wv^\top\Xv⟧\\[.35em]&⟦1|=\Big(\sum_{i}\Al_i\,\Xv_i\Big)^{\!\top}\Xv⟧\\[.35em]&⟦2|=\sum_{i}\Al_i\,\big(\Xv_i^\top\Xv\big)⟧\\[.35em]&⟦3|\longrightarrow\ \sum_{i}\Al_i\,\Ka(\Xv_i,\Xv)⟧\end{aligned}`,
  end:'Dei dati servono soltanto i prodotti scalari. Sostituirli con un kernel cambia lo spazio senza cambiare il conto.',
  steps:[
    {q:'Arriva un punto nuovo, \\(\\Xv=(2;\\,1)\\). Come si calcola la previsione?',add:[0],say:'Con i <b>pesi</b>, come sempre: pesi per features. Con \\(\\Wv=(-2{,}5;\\ 3)\\) viene (−2,5) · 2 + 3 · 1 = −2.'},
    {q:'Ma da dove vengono quei pesi?',add:[1],say:'Dalla forma duale: sono una <b>somma dei dati</b>, ciascuno con il suo coefficiente. Qui 0,5 · (1; 2) − 1 · (3; 0) + 2 · (0; 1) = (−2,5; 3).'},
    {q:'Allora i pesi si possono anche non calcolare: si porta il punto nuovo dentro la somma.',add:[2],say:'Resta, per ogni dato, il <b>prodotto scalare</b> con il punto nuovo: 4, 6 e 1. La previsione è 0,5 · 4 − 1 · 6 + 2 · 1 = −2, la stessa di prima.'},
    {q:'Con una feature map, al posto di quei tre numeri servirebbero i prodotti scalari fra vettori di milioni di coordinate.',add:[3],say:'Li calcola una <b>funzione kernel</b>, direttamente dai punti originali. Esempio: il quadrato del prodotto scalare dà 16, 36 e 1, e la previsione diventa 0,5 · 16 − 1 · 36 + 2 · 1 = −26. È un altro modello, in uno spazio più grande.'}],
  scene(host){const sv=Svg(host,600,250,'Tre dati con i loro coefficienti, un punto nuovo e i prodotti scalari fra loro'),g=S('g',null,sv);
    const D=[['x₁ = (1; 2)','α₁ = 0,5','1·2 + 2·1 = 4','4² = 16'],['x₂ = (3; 0)','α₂ = −1','3·2 + 0·1 = 6','6² = 36'],['x₃ = (0; 1)','α₃ = 2','0·2 + 1·1 = 1','1² = 1']],CX=[82,218,372,528],
      HD=['dato','coefficiente','prodotto scalare con x','kernel'],CL=[C.blue,C.yellow,'#fff',C.orange],
      RES=['previsione: (−2,5) · 2 + 3 · 1 = −2','w = 0,5 · (1; 2) − 1 · (3; 0) + 2 · (0; 1) = (−2,5; 3)','previsione: 0,5 · 4 − 1 · 6 + 2 · 1 = −2','con il kernel: 0,5 · 16 − 1 · 36 + 2 · 1 = −26'];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      lab(g,170,30,'punto nuovo  x = (2; 1)',C.blue,null,15);const w=lab(g,430,30,'pesi  w = (−2,5; 3)',C.yellow,null,15);w.style.opacity=k>=2?(k===2?1-0.65*t:0.35):1;
      S('line',{x1:20,x2:580,y1:46,y2:46,stroke:'#444'},g);
      const nc=k===0?0:k===1?2:k===2?3:4;
      for(let c=0;c<nc;c++){const isNew=(k===1&&c<2)||(k===2&&c===2)||(k===3&&c===3);
        const h=lab(g,CX[c],72,HD[c],'#aaa',null,13);if(isNew)h.style.opacity=t;
        D.forEach((r,i)=>{const o=isNew?ez(clamp((fr-0.12*i)/0.4,0,1)):1,e=lab(g,CX[c],104+i*30,r[c],CL[c],null,15);e.style.opacity=o;if(k===3&&c===2)e.style.opacity=1-0.6*t})}
      if(nc>0)S('line',{x1:20,x2:580,y1:184,y2:184,stroke:'#444'},g);
      const e=lab(g,300,k===0?130:220,RES[k],k===3?C.orange:'#fff',null,16);e.style.opacity=ez(clamp((fr-(k===0?0:0.35))/0.4,0,1))}}};

/* ---------- 2. il kernel RBF: distanza → meno gamma → esponenziale ---------- */
BUILD.l9_rbf={
  tex:R`⟦4|\Ka(\Xv,\Xv')\;=\;⟧⟦3|\exp\!\big(⟧⟦2|-\Gk\,⟧⟦1|\lVert\Xv-\Xv'\rVert^2⟧⟦3|\big)⟧`,
  end:'Il kernel RBF: una somiglianza che vale 1 per due punti uguali e scende verso 0 quando si allontanano.',
  steps:[
    {q:'Vogliamo un numero che dica quanto due punti si somigliano. Da che cosa partire?',add:[1],say:'Dalla loro <b>distanza al quadrato</b>: la differenza fra i due punti, coordinata per coordinata, elevata al quadrato e sommata. Punti a distanza 0, 1 e 3 danno 0, 1 e 9.'},
    {q:'Ma così il numero è grande per i punti lontani. A una somiglianza serve il contrario.',add:[2],say:'Il <b>segno meno</b> capovolge l\'ordine, e il parametro \\(\\Gk\\) decide quanto pesa la distanza. Con \\(\\Gk=0{,}5\\): 0; −0,5; −4,5.'},
    {q:'Numeri negativi senza un fondo sono scomodi da leggere come somiglianze.',add:[3],say:'L\'<b>esponenziale</b> li porta fra 0 e 1: zero diventa 1, mentre −0,5 diventa 0,61 e −4,5 diventa 0,01.'},
    {q:'Che cosa cambia scegliendo un altro \\(\\Gk\\)?',add:[4],say:'È il <b>kernel RBF</b>, una campana attorno a ogni punto. Con \\(\\Gk\\) grande la campana è stretta: somigliano solo i punti vicinissimi. Con \\(\\Gk\\) piccolo è larga.'}],
  scene(host){const sv=Svg(host,600,285,'La somiglianza fra due punti al variare della loro distanza'),g=S('g',null,sv),X=d=>80+d*125,DM=3.6,T=50,B=230;
    const F=[d=>d*d,d=>-0.5*d*d,d=>Math.exp(-0.5*d*d)],YY=[v=>B-v*18,v=>T-v*36,v=>B-v*180],BL=[B,T,B],COL=[C.blue,C.pink,C.yellow],NM=['distanza al quadrato','meno γ per la distanza al quadrato','somiglianza'];
    const path=(f,Yf,dm)=>{let s='';for(let i=0;i<=80;i++){const d=dm*i/80;s+=(i?'L':'M')+X(d).toFixed(1)+' '+clamp(Yf(f(d)),T-14,B+2).toFixed(1)}return s};
    return (k,fr)=>{g.textContent='';const j=Math.min(k,2),t=ez(clamp(fr/0.6,0,1)),a=k<=2?t:1,f=F[j],Yf=YY[j];
      S('line',{x1:X(0),x2:X(DM),y1:BL[j],y2:BL[j],stroke:'#777'},g);S('line',{x1:X(0),x2:X(0),y1:T-14,y2:B,stroke:'#555'},g);
      [0,1,2,3].forEach(d=>lab(g,X(d),B+22,String(d),'#aaa',null,13));lab(g,X(1.8),B+44,'distanza fra i due punti','#bbb',null,13);
      lab(g,590,26,NM[j],COL[j],'end',14);
      if(k===3){const o=t;[[2,'γ = 2',0.14,0.3],[0.1,'γ = 0,1',2.6,0.6]].forEach(q=>{const e=S('path',{d:path(d=>Math.exp(-q[0]*d*d),YY[2],DM),fill:'none',stroke:'#aaa','stroke-width':1.8,'stroke-dasharray':'6 4',opacity:o},g);lab(g,X(q[2]),YY[2](q[3]),q[1],'#ccc','start',14).style.opacity=o});
        lab(g,X(1.62),YY[2](0.36),'γ = 0,5',C.yellow,'start',14)}
      S('path',{d:path(f,Yf,DM*a),fill:'none',stroke:COL[j],'stroke-width':2.6},g);
      [0,1,3].forEach(d=>{if(d>DM*a+0.01)return;const v=f(d),y=Yf(v);S('circle',{cx:X(d),cy:y,r:6,fill:'#fff',stroke:'#000','stroke-width':1.5},g);
        lab(g,X(d)+10,j===1?y+20:y-10,nf(v,j===0?0:j===1?1:2).replace(/^1,00$/,'1').replace(/^0,0$/,'0'),'#fff','start',14)})}}};

/* ---------- 3. il punteggio della SVM con kernel: somiglianza → voto → peso → somma ---------- */
BUILD.l9_score={
  tex:R`⟦5|\Ff(\Xv)\;=\;⟧⟦4|\sum_{i}\ ⟧⟦3|\Al_i\,⟧⟦2|\Yy_i\,⟧⟦1|\Ka(\Xv_i,\Xv)⟧⟦4|\;+\;\Bi⟧`,
  end:'Il punteggio della SVM con kernel: una somma di somiglianze con i vettori di supporto, ognuna con il suo segno e il suo peso.',
  steps:[
    {q:'Arriva un punto nuovo (bianco). A quali vettori di supporto somiglia, e quanto?',add:[1],say:'Lo dice il <b>kernel</b>, calcolato fra il punto nuovo e ciascun vettore di supporto. Con il kernel RBF e \\(\\Gk=0{,}5\\), a distanza 1, 2 e 3 si ottiene 0,61; 0,14; 0,01.'},
    {q:'Ogni vettore di supporto tira il punto nuovo verso la propria classe.',add:[2],say:'L\'<b>etichetta</b> dà il segno al voto: +0,61 dal punto arancione (classe +1), −0,14 e −0,01 dai due blu (classe −1).'},
    {q:'Non tutti i vettori di supporto contano allo stesso modo.',add:[3],say:'Ogni voto è moltiplicato per il <b>coefficiente</b> del suo dato, quello trovato risolvendo il duale. Con 1; 2 e 0,5 i voti diventano +0,61; −0,27; −0,01.'},
    {q:'Qual è il verdetto?',add:[4],say:'Si <b>sommano</b> i voti e si aggiunge l\'intercetta, qui −0,1: 0,61 − 0,27 − 0,01 − 0,1 = 0,23.'},
    {q:'Che cosa si fa di questo numero?',add:[5],say:'È il <b>punteggio</b> del punto nuovo. È positivo, quindi la classe prevista è +1: ha vinto il vettore di supporto più vicino, anche se pesava meno.'}],
  scene(host){const sv=Svg(host,600,300,'Un punto nuovo, tre vettori di supporto e i loro voti'),g=S('g',null,sv),cx=170,cy=160,u=45;
    const V=[{p:[cx+u*Math.cos(-0.5),cy+u*Math.sin(-0.5)],y:1,d:1,a:1,nm:'arancione'},{p:[cx+2*u*Math.cos(4.2),cy+2*u*Math.sin(4.2)],y:-1,d:2,a:2,nm:'blu vicino'},{p:[cx+3*u*Math.cos(2.75),cy+3*u*Math.sin(2.75)],y:-1,d:3,a:0.5,nm:'blu lontano'}];
    V.forEach(v=>v.k=Math.exp(-0.5*v.d*v.d));const X0=452,SC=150,RY=[70,128,186],sg=x=>(x>0?'+':'')+nf(x,2);
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1));
      V.forEach((v,i)=>{const a=k===0?ez(clamp((fr-0.1*i)/0.4,0,1)):1,col=v.y>0?C.orange:C.blue;
        S('line',{x1:cx,y1:cy,x2:cx+(v.p[0]-cx)*a,y2:cy+(v.p[1]-cy)*a,stroke:'#888','stroke-dasharray':'4 4'},g);
        S('circle',{cx:v.p[0],cy:v.p[1],r:k>=2?5+3*Math.sqrt(v.a)*(k===2?t:1)+3*(k===2?1-t:0):8,fill:col,stroke:'#000','stroke-width':1.5},g)});
      lab(g,V[0].p[0]+14,V[0].p[1]-8,'distanza 1','#ccc','start',13);lab(g,V[1].p[0]+14,V[1].p[1]+2,'distanza 2','#ccc','start',13);lab(g,V[2].p[0]-6,V[2].p[1]+26,'distanza 3','#ccc','start',13);
      S('circle',{cx,cy,r:8,fill:'#fff',stroke:'#000','stroke-width':1.5},g);lab(g,cx+2,cy+28,'punto nuovo','#fff',null,13);
      RY.concat(k>=3?[244]:[]).forEach(y=>S('line',{x1:X0,x2:X0,y1:y-3,y2:y+19,stroke:'#888'},g));
      V.forEach((v,i)=>{const col=v.y>0?C.orange:C.blue,y=RY[i];let val,txt,bc='#ddd';
        if(k===0){val=v.k*ez(clamp((fr-0.1*i)/0.4,0,1));txt='somiglianza '+nf(v.k,2)}
        else if(k===1){val=v.k*(1+(v.y-1)*t);txt='voto '+sg(v.y*v.k);bc=col}
        else if(k===2){val=v.y*v.k*(1+(v.a-1)*t);txt=nf(v.a,v.a===0.5?1:0)+' × ('+sg(v.y*v.k)+') = '+sg(v.y*v.k*v.a);bc=col}
        else{val=v.y*v.k*v.a;txt='voto pesato '+sg(val);bc=col}
        lab(g,350,y-8,txt,k===0?'#ddd':col,'start',14);const w=val*SC;S('rect',{x:Math.min(X0,X0+w),y,width:Math.max(1.5,Math.abs(w)),height:16,fill:bc},g)});
      if(k>=3){const tot=0.2303,a=k===3?t:1;lab(g,350,236,k===3?'somma + intercetta = 0,23':'punteggio 0,23: classe +1','#fff','start',14);S('rect',{x:X0,y:244,width:Math.max(1.5,tot*SC*a),height:16,fill:'#fff'},g)}}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. il contenuto informativo: 1/P → log2 → bit ---------- */
BUILD.l10_bit={
  tex:R`⟦3|h(x)\;=\;⟧⟦2|\log_2⟧⟦1|\frac{1}{P(x)}⟧`,
  end:'Il contenuto informativo: il logaritmo in base 2 dell\'inverso della probabilità.',
  steps:[
    {q:'Una testa ha probabilità 1/2, due teste di fila 1/4, tre 1/8. Serve un numero che cresca quando l\'evento è più raro.',add:[1],
     say:'Il candidato più semplice è l\'<b>inverso della probabilità</b>: 2, 4 e 8. Un evento certo darebbe 1.'},
    {q:'Ma tre monete dovrebbero dire il triplo di una, non il quadruplo: le probabilità si moltiplicano, l\'informazione dovrebbe sommarsi.',add:[2],
     say:'Il <b>logaritmo in base 2</b> trasforma i prodotti in somme: 2, 4 e 8 diventano 1, 2 e 3. E l\'evento certo passa da 1 a 0.'},
    {q:'Che nome diamo a questo numero?',add:[3],
     say:'È il <b>contenuto informativo</b> dell\'evento \\(x\\), e si misura in <b>bit</b>: qui un bit per ogni moneta.'}],
  scene(host){const sv=Svg(host,600,250,'Una, due e tre monete: probabilità, inverso della probabilità e bit'),g=S('g',null,sv),B=226,X=[110,300,490];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));S('line',{x1:30,x2:570,y1:B,y2:B,stroke:'#777'},g);
      X.forEach((x,i)=>{const n=i+1,inv=Math.pow(2,n);
        for(let j=0;j<n;j++){const cx=x+(j-(n-1)/2)*36;S('circle',{cx,cy:30,r:15,fill:C.yellow,stroke:'#000'},g);const e=lab(g,cx,35.5,'T','#000',null,15);e.style.fontWeight='700'}
        lab(g,x,72,'probabilità 1/'+inv,'#ddd',null,14);
        const h0=inv*12,h1=n*30,h=k===0?h0*t:k===1?h0+(h1-h0)*t:h1,pink=k>=2||k===1&&t>0.5;
        S('rect',{x:x-27,y:B-Math.max(1.5,h),width:54,height:Math.max(1.5,h),fill:pink?C.pink:C.lg,opacity:.9},g);
        if(k>0||t>0.6)lab(g,x,B-h-9,pink?'log₂ '+inv+' = '+n+(k>=2?' bit':''):'1/P = '+inv,pink?C.pink:'#fff',null,15)})}}};

/* ---------- 2. l'entropia: sorpresa → peso → somma ---------- */
BUILD.l10_ent={
  tex:R`⟦4|H(Y)\;=\;⟧⟦3|\sum_{k}⟧⟦2|P(Y=k)\,⟧⟦1|\log_2\frac{1}{P(Y=k)}⟧`,
  end:'L\'entropia: la sorpresa media, pesando ogni valore con la sua probabilità.',
  steps:[
    {q:'Un sacchetto con 6 palline blu e 2 arancioni. Ne peschi una: quanto ti sorprende ciascun colore?',add:[1],
     say:'La <b>sorpresa</b> di ogni valore \\(k\\), calcolata come prima. Il blu ha probabilità 3/4 e porta 0,415 bit; l\'arancione ha probabilità 1/4 e porta 2 bit.'},
    {q:'Ma l\'arancione esce solo una volta su quattro. Quanto conta davvero ciascuna sorpresa?',add:[2],
     say:'Si moltiplica ogni sorpresa per la <b>probabilità</b> con cui capita: 0,75 · 0,415 = 0,31 per il blu, 0,25 · 2 = 0,50 per l\'arancione.'},
    {q:'E la sorpresa che ci si aspetta da una pescata, senza sapere il colore?',add:[3],
     say:'Si <b>sommano</b> i contributi di tutti i valori possibili: 0,31 + 0,50 = 0,81 bit.'},
    {q:'Che nome diamo al risultato?',add:[4],
     say:'È l\'<b>entropia</b> di \\(Y\\), il colore pescato: 0,81 bit. Con 4 palline per colore sarebbe 1 bit; con 8 palline blu sarebbe 0.'}],
  scene(host){const sv=Svg(host,600,250,'Un sacchetto di otto palline e la sorpresa di ciascun colore'),g=S('g',null,sv),U=92,X0=318,
      ROW=[{c:C.blue,p:0.75,s:Math.log2(4/3),y:92,pt:'P = 3/4',st:'0,415 bit',wt:'0,75 · 0,415 = 0,31'},{c:C.orange,p:0.25,s:2,y:178,pt:'P = 1/4',st:'2 bit',wt:'0,25 · 2 = 0,50'}];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));
      lab(g,104,40,'il sacchetto','#ddd',null,14);S('rect',{x:24,y:56,width:160,height:92,rx:12,fill:'#0c0c0c',stroke:'#777'},g);
      for(let i=0;i<8;i++)S('circle',{cx:50+(i%4)*36,cy:84+Math.floor(i/4)*36,r:13,fill:i<6?C.blue:C.orange,stroke:'#000'},g);
      lab(g,104,172,'6 blu, 2 arancioni','#ddd',null,14);
      lab(g,X0,40,k===0?'sorpresa di ciascun colore':'larghezza = sorpresa, altezza = probabilità','#bbb','start',13);
      ROW.forEach(r=>{S('circle',{cx:226,cy:r.y,r:11,fill:r.c,stroke:'#000'},g);lab(g,244,r.y+5,r.pt,'#fff','start',14);
        const w=r.s*U*(k===0?t:1),h=k===0?8:k===1?8+(r.p*60-8)*t:r.p*60;
        S('rect',{x:X0,y:r.y-h/2,width:Math.max(1.5,w),height:h,fill:r.c,opacity:.9},g);
        if(k>0||t>0.6)lab(g,X0,r.y-h/2-8,k===0?r.st:r.wt,r.c,'start',14)});
      if(k>=2){const a=k===2?t:1,e=lab(g,X0,236,'0,31 + 0,50 = 0,81 bit','#fff','start',16);e.style.opacity=a;e.style.fontWeight='700'}}}};

/* ---------- 3. information gain: prima − media pesata del dopo ---------- */
BUILD.l10_ig={
  tex:R`\begin{aligned}⟦3|IG(X)⟧&⟦3|=\;⟧⟦0|H(Y)⟧\\[.1em]&⟦3|\;\;-\;⟧⟦2|\sum_{x}P(X=x)\,⟧⟦1|H(Y\mid X=x)⟧\end{aligned}`,
  end:'L\'information gain: l\'incertezza di prima meno quella che resta, in media, dopo la domanda.',
  steps:[
    {q:'Sei esempi: cinque con risposta V, uno con risposta F. Quanta incertezza c\'è prima di fare domande?',add:[0],
     say:'L\'<b>entropia di partenza</b> delle risposte \\(Y\\): con probabilità 5/6 e 1/6 vale 0,65 bit.'},
    {q:'Facciamo la domanda \\(X_1\\): gli esempi si dividono in due gruppi. Quanto è incerto ciascun gruppo?',add:[1],
     say:'L\'<b>entropia dentro un gruppo</b>: quella di \\(Y\\) contando solo gli esempi che hanno dato la risposta \\(x\\). Il gruppo da quattro è puro, 0 bit. Quello da due è metà e metà, 1 bit.'},
    {q:'Due numeri, ma il primo gruppo è grande il doppio del secondo. Quanta incertezza resta in media?',add:[2],
     say:'Si pesa ogni gruppo con la sua <b>quota di esempi</b> e si somma: 4/6 · 0 + 2/6 · 1 = 0,33 bit.'},
    {q:'Quanto ci ha fatto guadagnare la domanda?',add:[3],
     say:'La <b>differenza</b> fra prima e dopo: 0,65 − 0,33 = 0,32 bit. È l\'<b>information gain</b> della domanda \\(X\\).'}],
  scene(host){const sv=Svg(host,600,290,'Sei esempi divisi in due gruppi da una domanda'),g=S('g',null,sv),Y=[1,1,1,1,1,0],col=y=>y?C.green:C.red,
      TOP=i=>[300+(i-2.5)*32,52],DST=i=>i<4?[150+(i-1.5)*32,158]:[450+(i-4.5)*32,158],GX=[150,450];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),m=k===0?0:k===1?t:1;
      lab(g,300,24,'prima della domanda: entropia 0,65 bit','#fff',null,15);
      Y.forEach((y,i)=>{const a=TOP(i);S('rect',{x:a[0]-12,y:a[1]-12,width:24,height:24,fill:k===0?col(y):'none',stroke:col(y),'stroke-width':1.5,opacity:k===0?1:.55},g);
        const e=lab(g,a[0],a[1]+5,y?'V':'F',k===0?'#000':col(y),null,14);e.style.fontWeight='700';if(k>0)e.style.opacity=.55});
      if(k>=1){GX.forEach((x,j)=>{S('line',{x1:300+(j?40:-40),y1:72,x2:300+(x-300)*m+(j?40:-40)*(1-m),y2:72+50*m,stroke:'#777','stroke-width':1.5},g)});
        Y.forEach((y,i)=>{const a=TOP(i),b=DST(i),x=a[0]+(b[0]-a[0])*m,yy=a[1]+(b[1]-a[1])*m;S('rect',{x:x-12,y:yy-12,width:24,height:24,fill:col(y)},g);const e=lab(g,x,yy+5,y?'V':'F','#000',null,14);e.style.fontWeight='700'});
        if(m>0.9){lab(g,300,104,'X₁ ?','#fff',null,15);lab(g,GX[0],196,'X₁ = V · entropia 0 bit','#ddd',null,14);lab(g,GX[1],196,'X₁ = F · entropia 1 bit','#ddd',null,14)}}
      if(k>=2){const a=k===2?t:1;[['4 esempi su 6',GX[0]],['2 esempi su 6',GX[1]]].forEach(q=>{const e=lab(g,q[1],218,q[0],C.yellow,null,14);e.style.opacity=a});
        const e=lab(g,300,250,'dopo la domanda, in media: 4/6 · 0 + 2/6 · 1 = 0,33 bit','#fff',null,15);e.style.opacity=a}
      if(k>=3){const e=lab(g,300,278,'guadagno: 0,65 − 0,33 = 0,32 bit',C.yellow,null,16);e.style.opacity=t;e.style.fontWeight='700'}}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. il neurone: input → somma pesata → bias → gradino ---------- */
BUILD.l11_neuron={
  tex:R`\begin{aligned}⟦3|a⟧&⟦3|=⟧⟦1|\sum_{i=1}^{N}\Ws_i\,⟧⟦0|\Xs_i⟧⟦2|\;+\;\Bi⟧\\[.5em]⟦3|f(a)⟧&⟦3|=\begin{cases}1&\text{se } a\gt 0\\0&\text{altrimenti}\end{cases}⟧\end{aligned}`,
  end:'Il neurone artificiale: una somma pesata degli input, un bias e un gradino.',
  steps:[
    {q:'Un neurone riceve tre segnali. Come li rappresentiamo?',add:[0],
     say:'Con dei numeri, gli <b>input</b> \\(\\Xs_i\\): uno per ogni segnale in arrivo. Qui valgono 1; 0,5 e 0,8.'},
    {q:'Non tutti i collegamenti contano allo stesso modo, e qualcuno frena invece di spingere.',add:[1],
     say:'Ogni input viene moltiplicato per il suo <b>peso</b> \\(\\Ws_i\\), che può essere negativo, e i prodotti si sommano: 0,8 − 0,6 + 0,48 = 0,68.'},
    {q:'Quanto deve essere grande la somma perché il neurone si attivi? Serve una soglia che si possa regolare.',add:[2],
     say:'Si aggiunge una costante, il <b>bias</b> \\(\\Bi\\). Qui vale −0,3: la somma pesata deve superare 0,3 per dare un risultato positivo. 0,68 − 0,3 = 0,38.'},
    {q:'La risposta di un neurone vero è «tutto o niente». Come si ottiene?',add:[3],
     say:'Chiamiamo \\(a\\), <b>attivazione</b>, il numero ottenuto, e gli applichiamo un <b>gradino</b> \\(f\\): 1 se \\(a\\) è positivo, 0 altrimenti. Qui 0,38 è positivo: l\'output è 1.'}],
  scene(host){const sv=Svg(host,600,300,'Un neurone con tre input costruito un pezzo alla volta'),g=S('g',null,sv),x=[1,0.5,0.8],w=[0.8,-1.2,0.6],b=-0.3,ys=[56,150,244],cx=340,cy=150,
      PL=['× 0,8 = 0,80','× (−1,2) = −0,60','× 0,6 = 0,48'],LY=[26,122,282];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),a=k===0?0:k===1?t:1;
      x.forEach((v,i)=>{const pr=w[i]*v,x2=cx-50,y2=cy+(ys[i]-cy)*0.3;
        S('line',{x1:92,y1:ys[i],x2:92+(x2-92)*(k===0?1:1),y2,stroke:k===0?'#555':w[i]>0?C.yellow:C.red,'stroke-width':k===0?1.2:1.2+7*Math.abs(pr)*a,opacity:.85},g);
        S('circle',{cx:70,cy:ys[i],r:22,fill:'#000',stroke:C.blue,'stroke-width':2},g);lab(g,70,ys[i]+5,nf(v,v===1?0:1),C.blue,null,15);
        if(k>=1&&a>0.5)lab(g,100,LY[i],PL[i],w[i]>0?C.yellow:C.red,'start',14)});
      if(k===0)lab(g,70,ys[0]-32,'input','#ddd',null,14);
      S('circle',{cx,cy,r:50,fill:'#000',stroke:k===0?'#666':'#fff','stroke-width':2.4},g);
      if(k>=1){const val=k===1?0.68*t:k===2?0.68+b*t:0.38;lab(g,cx,cy-12,k===1?'somma':k===2?'somma + bias':'attivazione','#bbb',null,13);const e=lab(g,cx,cy+14,nf(val,2),'#fff',null,21);e.style.fontWeight='700'}
      if(k>=2){const o=k===2?t:1,gb=S('g',{opacity:o},g);arrow(gb,cx,cy+94,cx,cy+56,C.yellow,2.5);lab(gb,cx,cy+116,'bias −0,3',C.yellow,null,14)}
      if(k>=3){const on=t>0.6;arrow(g,cx+54,cy,cx+54+92*t,cy,on?C.green:'#888',on?4:2);
        S('circle',{cx:cx+184,cy,r:30,fill:on?C.green:'#000',stroke:C.green,'stroke-width':2},g);const e=lab(g,cx+184,cy+8,on?'1':'?',on?'#000':C.green,null,22);e.style.fontWeight='700';
        lab(g,cx+184,cy+56,'output','#ddd',null,14);lab(g,cx+100,cy-14,'0,38 > 0','#ddd',null,14)}}}};

/* ---------- 2. la regola di aggiornamento del perceptron ---------- */
BUILD.l11_update={
  tex:R`⟦3|\Wv\ \leftarrow\ ⟧⟦0|\Wv⟧⟦1|\;+\;⟧⟦2|\Et\,⟧⟦1|\Yy_k\,\Xv_k⟧`,
  end:'La regola del perceptron: si corregge solo quando si sbaglia, spostando i pesi verso la classe giusta.',
  steps:[
    {q:'Il punto cerchiato è di classe −1, ma con i pesi attuali sta nella zona in cui si prevede +1.',add:[0],
     say:'I <b>pesi attuali</b>: (0; 1; 0,5), dove il primo fa da bias. Il punto (2; −2), con il suo input costante 1, riceve il punteggio 0 · 1 + 1 · 2 + 0,5 · (−2) = 1. Dovrebbe essere negativo.'},
    {q:'In che direzione spostare i pesi per far scendere proprio quel punteggio?',add:[1],
     say:'Il punteggio è la somma dei pesi per gli input del punto: se ai pesi aggiungi l\'<b>input stesso</b> \\(\\Xv_k\\) sale, se lo togli scende. La <b>classe</b> \\(\\Yy_k\\) sceglie il verso: qui è −1, quindi si toglie (1; 2; −2).'},
    {q:'Quanto deve essere lungo il passo?',add:[2],
     say:'Lo decide il <b>learning rate</b> \\(\\Et\\), un numero positivo. Con 0,2 la correzione diventa −0,2 · (1; 2; −2) = (−0,2; −0,4; 0,4).'},
    {q:'Dove finiscono i pesi, e il punto?',add:[3],
     say:'I <b>nuovi pesi</b>: (0; 1; 0,5) + (−0,2; −0,4; 0,4) = (−0,2; 0,6; 0,9). Il punteggio del punto scende da 1 a −0,8, cioè di 0,2 · 9: il 9 è 1² + 2² + (−2)², la lunghezza al quadrato del suo input.'}],
  scene(host){const yr=[-2.6,2.7],xh=(yr[1]-yr[0])*556/292/2,p=Plot(host,{W:600,H:340,m:[34,10,10,38],xr:[-xh,xh],yr,label:'Una correzione del perceptron costruita pezzo per pezzo'});
    p.axes([-4,-2,0,2,4],[-2,-1,0,1,2],'input x₁','input x₂');
    const ALL=[[-2,1,1],[1,1,1],[1.5,-0.5,1],[-2,-1,-1],[-1,-1.5,-1],[2,-2,-1]],pt=[2,-2],w0=[0,1,0.5],w1=[-0.2,0.6,0.9],eta=0.2;
    const zone=S('path',{fill:'rgba(255,134,47,.13)'},p.bg),g=S('g',null,p.g),note=H('div',{class:'sub'},host.parentNode);note.style.minHeight='1.5em';
    const P=q=>[p.sx(q[0]),p.sy(q[1])];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),m=k===3?t:0,w=w0.map((v,i)=>v+(w1[i]-v)*m),n2=w[1]*w[1]+w[2]*w[2],n=Math.sqrt(n2),
        f=[-w[0]*w[1]/n2,-w[0]*w[2]/n2],d=[-w[2]/n,w[1]/n],u=[w[1]/n,w[2]/n],A=[f[0]+d[0]*20,f[1]+d[1]*20],B=[f[0]-d[0]*20,f[1]-d[1]*20];
      zone.setAttribute('d',p.poly([A,B,[B[0]+u[0]*20,B[1]+u[1]*20],[A[0]+u[0]*20,A[1]+u[1]*20]])+'Z');
      S('path',{d:p.poly([A,B]),fill:'none',stroke:'#fff','stroke-width':2.2},g);
      lab(g,p.sx(3.4),p.sy(2.2),'qui si prevede +1',C.orange,null,13);
      ALL.forEach(q=>{const c=P(q);S('circle',{cx:c[0],cy:c[1],r:7,fill:q[2]>0?C.orange:C.blue,stroke:'#000'},g)});
      const c=P(pt),sc=w[0]+w[1]*pt[0]+w[2]*pt[1];S('circle',{cx:c[0],cy:c[1],r:16,fill:'none',stroke:sc>0?C.red:C.green,'stroke-width':3},g);
      if(k>=1&&k<3){const o=P([0,0]);const gi=S('g',{opacity:.9},g);arrow(gi,o[0],o[1],o[0]+(c[0]-o[0])*0.86,o[1]+(c[1]-o[1])*0.86,C.blue,2);lab(g,p.sx(0.35),p.sy(-1.25),'input del punto',C.blue,'end',13)}
      const a=P(f),tip=[f[0]+w[1],f[1]+w[2]],b=P(tip);arrow(g,a[0],a[1],b[0],b[1],C.yellow,3);
      if(k===0)lab(g,b[0]+10,b[1]-4,'pesi (w₁; w₂)',C.yellow,'start',13);
      if(k===1||k===2){const s=k===1?t:1-(1-eta)*t,e=P([tip[0]-2*s,tip[1]+2*s]);
        if(k===2){const ff=P([tip[0]-2,tip[1]+2]);S('line',{x1:b[0],y1:b[1],x2:ff[0],y2:ff[1],stroke:'#777','stroke-dasharray':'4 4'},g)}
        if(s>0.03)arrow(g,b[0],b[1],e[0],e[1],k===2?C.orange:'#fff',3);
        const far=P([tip[0]-2,tip[1]+2]);lab(g,far[0]+14,far[1]+5,k===1?'si toglie l\'input':'accorciato a 0,2',k===2?C.orange:'#fff','start',13)}
      note.innerHTML='punteggio del punto cerchiato: <b style="color:'+(sc>0?C.red:C.green)+'">'+nf(sc,2)+'</b> '+(sc>0?'(positivo: sbagliato)':'(negativo: corretto)')}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* La rete minima della lezione: tre unità in fila, una per strato.
   z0 = 1 --w1=0,4--> a1, z1=σ(a1) --w2=1,5--> a2, z2=σ(a2); risposta giusta y = 1; loss ½(y − z2)². */
const sg=x=>1/(1+Math.exp(-x));
const Z0=1,W1=0.4,W2=1.5,Y=1;
const A1=W1*Z0,Z1=sg(A1),A2=W2*Z1,Z2=sg(A2),L0=0.5*(Y-Z2)*(Y-Z2);
const S2=Z2*(1-Z2),E2=Z2-Y,D2=S2*E2,G2=Z1*D2;          // σ'(a2), ∂ℓ/∂z2, δ2, ∂ℓ/∂w2
const S1=Z1*(1-Z1),DZ1=W2*D2,D1=S1*DZ1,G1=D1*Z0;       // σ'(a1), ∂ℓ/∂z1, δ1, ∂ℓ/∂w1

/* una casella con nome (colorato) e valore */
function box(g,x,y,name,val,col,o){o=o||{};const w=o.w||104,h=50,gg=S('g',{opacity:o.op==null?1:o.op},g);
  S('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:8,fill:o.hot?'#262626':'#000',stroke:col,'stroke-width':o.hot?3:1.8},gg);
  lab(gg,x,y-5,name,col,null,14);const e=lab(gg,x,y+16,val,'#fff',null,16);e.style.fontWeight='700';
  if(o.sub)lab(gg,x,y+h/2+18,o.sub,'#aaa',null,13);return gg}
function link(g,x1,y1,x2,y2,col,op,w){const gg=S('g',{opacity:op==null?1:op},g);arrow(gg,x1,y1,x2,y2,col||'#888',w||1.8);return gg}

/* ---------- 1. da che cosa dipende il costo ---------- */
BUILD.l12_dep={
  tex:R`\begin{aligned}⟦1|\cl⟧&⟦1|=\tfrac12\big(\Yy-z^{(2)}\big)^2⟧\\[.45em]⟦2|z^{(2)}⟧&⟦2|=\sigma\big(a^{(2)}\big)⟧\\[.45em]⟦3|a^{(2)}⟧&⟦3|=\Ws^{(2)}\,z^{(1)}⟧\end{aligned}`,
  end:'Il peso non tocca il costo direttamente: passa per la somma pesata, poi per l\'output.',
  steps:[
    {q:'Su questo esempio la rete risponde 0,711 e la risposta giusta è 1. Quanto costa lo sbaglio?',add:[1],say:'La <b>loss</b> quadratica: metà del quadrato della distanza fra la risposta giusta \\(\\Yy\\) e l\'output \\(z^{(2)}\\) dell\'ultima unità (il 2 fra parentesi è il numero dello strato). Qui ½ · (1 − 0,711)² = 0,042.'},
    {q:'Per abbassare il costo bisogna spostare l\'output. Da che cosa dipende l\'output?',add:[2],say:'È la logistica \\(\\sigma\\) applicata a un numero solo, che chiamiamo \\(a^{(2)}\\). Qui \\(\\sigma(0{,}898)=0{,}711\\).'},
    {q:'E quel numero, da dove viene?',add:[3],say:'È la <b>somma pesata</b> dell\'unità: il peso \\(\\Ws^{(2)}\\) per l\'output \\(z^{(1)}\\) dell\'unità precedente. Qui 1,5 · 0,599 ≈ 0,898.'},
    {q:'Proviamo: alzo il peso da 1,5 a 1,6 e ricalcolo tutto.',add:[],say:'La spinta scende lungo la catena: la somma pesata sale da 0,898 a 0,958, l\'output da 0,711 a 0,723, e il costo cala da 0,0419 a 0,0384. Ma rifare tutti i conti per ogni peso costerebbe troppo: serve una scorciatoia.'}],
  scene(host){const sv=Svg(host,600,270,'La catena delle dipendenze: peso e output precedente, somma pesata, output, costo'),g=S('g',null,sv);
    const xw=72,xa=222,xz=372,xl=522,ym=120;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.45,0,1)),ap=s=>fin||k>s?1:k===s?t:0;
      let w=W2;if(k===3&&!fin){w=W2+0.1*ez(clamp((fr-0.12)/0.55,0,1))}else if(fin)w=W2+0.1;
      const a=w*Z1,z=sg(a),l=0.5*(Y-z)*(Y-z),mv=k===3||fin,ph=k===3&&!fin?clamp((fr-0.12)/0.55,0,1):0;
      /* frecce */
      link(g,xz+56,ym,xl-58,ym,'#999');link(g,xl,ym+84,xl,ym+30,C.green);
      link(g,xa+56,ym,xz-58,ym,'#999',ap(1));if(ap(1)>0.6)lab(g,(xa+xz)/2,ym-10,'σ','#ccc',null,15);
      link(g,xw+56,ym-52,xa-58,ym-10,'#999',ap(2));link(g,xw+56,ym+52,xa-58,ym+10,'#999',ap(2));
      /* caselle */
      box(g,xl,ym,'costo ℓ',nf(l,mv?4:3),C.pink,{hot:k===0&&!fin||mv&&ph>0.75});
      box(g,xz,ym,'output z⁽²⁾',nf(z,3),'#fff',{hot:k===1||mv&&ph>0.5&&ph<=0.75});
      box(g,xl,ym+110,'risposta y',nf(Y,0),C.green);
      box(g,xa,ym,'somma a⁽²⁾',nf(a,3),'#fff',{op:ap(1),hot:k===2||mv&&ph>0.25&&ph<=0.5});
      box(g,xw,ym-62,'peso w⁽²⁾',nf(w,2),C.yellow,{op:ap(2),hot:mv&&ph>0&&ph<=0.25});
      box(g,xw,ym+62,'output z⁽¹⁾',nf(Z1,3),C.blue,{op:ap(2)});
      if(k===0&&!fin)lab(g,300,34,'½ · (1 − 0,711)² = 0,042',C.pink,null,16);
      if(k===1)lab(g,300,34,'σ(0,898) = 0,711','#fff',null,16);
      if(k===2&&t>0.5)lab(g,300,34,'1,5 · 0,599 ≈ 0,898',C.yellow,null,16);
      if(mv)lab(g,300,34,'peso '+nf(w,2)+'  →  costo '+nf(l,4),C.yellow,null,16)}}};

/* ---------- 2. tre sensibilità moltiplicate ---------- */
BUILD.l12_sens={
  tex:R`\begin{aligned}⟦0|\frac{\partial\cl}{\partial\Ws^{(2)}}⟧&⟦1|=\frac{\partial a^{(2)}}{\partial\Ws^{(2)}}⟧⟦2|\cdot\frac{\partial z^{(2)}}{\partial a^{(2)}}⟧⟦3|\cdot\frac{\partial\cl}{\partial z^{(2)}}⟧\\[.55em]&⟦1|=\;z^{(1)}⟧⟦2|\,\cdot\,\sigma'\big(a^{(2)}\big)⟧⟦3|\,\cdot\,\big(z^{(2)}-\Yy\big)⟧\\[.45em]&⟦4|=\;z^{(1)}\,\delta^{(2)}⟧\end{aligned}`,
  end:'La derivata rispetto a un peso: tre sensibilità in fila, moltiplicate.',
  steps:[
    {q:'Sposto il peso di poco. Di quanto cambia il costo?',add:[0],say:'È la <b>derivata</b> del costo rispetto al peso: quante unità di costo per ogni unità di spinta. La spinta fa tre tappe, e a ogni tappa viene moltiplicata per un numero.'},
    {q:'Prima tappa: sposto il peso, di quanto cambia la somma pesata?',add:[1],say:'La somma è peso per \\(z^{(1)}\\): ogni spinta al peso arriva moltiplicata per \\(z^{(1)}\\), che qui vale 0,599. Una spinta di 0,1 diventa 0,060.'},
    {q:'Seconda tappa: la somma si è spostata, di quanto cambia l\'output?',add:[2],say:'Dipende da quanto è ripida la logistica in quel punto: la sua pendenza \\(\\sigma\'\\) vale output per (1 − output), qui 0,711 · 0,289 ≈ 0,206. La spinta diventa 0,060 · 0,206 = 0,012.'},
    {q:'Terza tappa: l\'output si è spostato, di quanto cambia il costo?',add:[3],say:'La loss è metà di un quadrato, quindi la sua pendenza è la distanza stessa: output meno risposta giusta, 0,711 − 1 = −0,289. È negativa: alzare l\'output abbassa il costo, di circa 0,0036.'},
    {q:'I due fattori che non riguardano il peso si possono calcolare una volta per tutte.',add:[4],say:'Il loro prodotto è il <b>segnale di errore</b> \\(\\delta^{(2)}\\) dell\'unità: 0,206 · (−0,289) = −0,0595. La derivata è allora 0,599 · (−0,0595) = −0,0356: alzare il peso abbassa il costo.'}],
  scene(host){const sv=Svg(host,600,240,'Una spinta al peso attraversa somma pesata, output e costo'),g=S('g',null,sv);
    const X=[75,225,375,525],yb=72,NM=['peso w⁽²⁾','somma a⁽²⁾','output z⁽²⁾','costo ℓ'],VL=[nf(W2,2),nf(A2,3),nf(Z2,3),nf(L0,3)],CL=[C.yellow,'#fff','#fff',C.pink];
    const MU=['× 0,599','× 0,206','× (−0,289)'],DV=[0.1,0.1*Z1,0.1*Z1*S2,0.1*Z1*S2*E2],DT=['+0,100','+0,060','+0,012','−0,0036'];
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),kk=fin?4:k;
      for(let i=0;i<3;i++){const on=kk>i,hot=kk===i+1&&!fin,x1=X[i]+56,x2=X[i+1]-58,xe=hot?x1+(x2-x1)*Math.max(t,0.25):x2;
        arrow(g,x1,yb,on?xe:x2,yb,on?C.orange:'#666',on?2.6:1.6);
        if(on){const e=lab(g,(X[i]+X[i+1])/2,yb-36,MU[i],C.orange,null,15);e.style.fontWeight='700';if(hot)e.setAttribute('opacity',t)}}
      X.forEach((x,i)=>{box(g,x,yb,NM[i],VL[i],CL[i],{hot:!fin&&(kk===i||kk===0&&i===0)});
        if(i<=Math.min(kk,3)){const a=(i===kk&&i>0&&!fin)?t:1,neg=DV[i]<0,c=neg?C.pink:'#fff',len=Math.max(2,Math.abs(DV[i])*460*a),gg=S('g',{opacity:Math.max(a,0.05)},g);
          lab(gg,x,yb+52,DT[i],c,null,15);S('rect',{x:x-len/2,y:yb+62,width:len,height:7,rx:2,fill:c},gg)}});
      lab(g,X[0],yb+92,'spinta','#aaa',null,13);
      if(kk>=4){const a=fin?1:t,gg=S('g',{opacity:a},g),xl=X[1]+20,xr=X[3]-20,yy=178;
        S('path',{d:`M${xl} ${yy-8}V${yy}H${xr}V${yy-8}`,fill:'none',stroke:C.pink,'stroke-width':1.8},gg);
        lab(gg,(xl+xr)/2,yy+22,'δ⁽²⁾ = 0,206 · (−0,289) = −0,0595',C.pink,null,15);
        lab(gg,300,yy+48,'derivata = 0,599 · (−0,0595) = −0,0356',C.teal,null,15)}}}};

/* ---------- 3. un passo all'indietro ---------- */
BUILD.l12_back={
  tex:R`\begin{aligned}⟦2|\delta^{(1)}⟧&⟦2|=\;⟧⟦1|\sigma'\big(a^{(1)}\big)\,\cdot\,⟧⟦0|\Ws^{(2)}\,\delta^{(2)}⟧\\[.55em]⟦3|\frac{\partial\cl}{\partial\Ws^{(1)}}⟧&⟦3|=\;\delta^{(1)}\,z^{(0)}⟧\end{aligned}`,
  end:'L\'errore dell\'ultima unità, portato indietro di uno strato, dà l\'errore di quella prima.',
  steps:[
    {q:'Ora il peso del primo strato. Agisce sul costo solo spostando \\(z^{(1)}\\). Se sposto \\(z^{(1)}\\) di poco, di quanto cambia il costo?',add:[0],say:'\\(z^{(1)}\\) entra nella somma pesata dell\'ultima unità moltiplicato per il peso \\(\\Ws^{(2)}\\), e da lì in poi la strada è già fatta: è \\(\\delta^{(2)}\\). Quindi 1,5 · (−0,0595) = −0,089.'},
    {q:'E se sposto di poco la somma pesata \\(a^{(1)}\\) dell\'unità nascosta?',add:[1],say:'Fra la somma e l\'output c\'è la logistica: si moltiplica per la sua pendenza in quel punto, 0,599 · 0,401 ≈ 0,240. Risultato: 0,240 · (−0,089) ≈ −0,021.'},
    {q:'Che cosa abbiamo calcolato?',add:[2],say:'Il <b>segnale di errore</b> dell\'unità nascosta, \\(\\delta^{(1)}\\): quanto cambia il costo se cambia la sua somma pesata. È stato ricavato da quello dello strato dopo: l\'errore viaggia all\'indietro.'},
    {q:'E la derivata rispetto al peso \\(\\Ws^{(1)}\\)?',add:[3],say:'Stessa regola di prima: errore dell\'unità di arrivo per output dell\'unità di partenza. Qui −0,021 · 1 = −0,021. Con un altro strato davanti si ripeterebbe lo stesso passo.'}],
  scene(host){const sv=Svg(host,600,250,'Tre unità in fila: il segnale di errore passa dall\'ultima a quella prima'),g=S('g',null,sv);
    const X=[90,290,490],yn=84,r=42;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),ap=s=>fin||k>s?1:k===s?t:0;
      /* collegamenti e pesi */
      [[0,'w⁽¹⁾ = 0,4'],[1,'w⁽²⁾ = 1,5']].forEach(q=>{const i=q[0];S('line',{x1:X[i]+r,y1:yn,x2:X[i+1]-r,y2:yn,stroke:'#777','stroke-width':1.6},g);lab(g,(X[i]+X[i+1])/2,yn-12,q[1],C.yellow,null,14)});
      /* il segnale che torna indietro */
      if(k===0&&!fin){const x1=X[2]-r-2,x2=X[1]+r+10;arrow(g,x1,yn+14,x1+(x2-x1)*Math.max(t,0.15),yn+14,C.pink,3)}
      else arrow(g,X[2]-r-2,yn+14,X[1]+r+10,yn+14,C.pink,2.2);
      if(ap(3)>0){const x1=X[1]-r-2,x2=X[0]+r+10,a=ap(3);arrow(g,x1,yn+14,x1+(x2-x1)*Math.max(a,0.15),yn+14,C.pink,2.2)}
      /* unità */
      S('circle',{cx:X[0],cy:yn,r,fill:'#000',stroke:C.blue,'stroke-width':2.2},g);lab(g,X[0],yn+5,'z⁽⁰⁾ = 1',C.blue,null,15);
      [[1,A1,Z1,'¹'],[2,A2,Z2,'²']].forEach(q=>{S('circle',{cx:X[q[0]],cy:yn,r,fill:'#000',stroke:'#fff','stroke-width':2.2},g);
        lab(g,X[q[0]],yn-6,'a = '+nf(q[1],3),'#ddd',null,13.5);const e=lab(g,X[q[0]],yn+14,'z = '+nf(q[2],3),'#fff',null,13.5);e.style.fontWeight='700'});
      lab(g,X[2]+r+8,yn+5,'y = 1',C.green,'start',15);
      lab(g,X[0],26,'input','#aaa',null,13);lab(g,X[1],26,'strato 1','#aaa',null,13);lab(g,X[2],26,'strato 2','#aaa',null,13);
      /* numeri sotto */
      const e2=lab(g,X[2],yn+r+26,'δ⁽²⁾ = −0,0595',C.pink,null,15);e2.style.fontWeight='700';
      const row=(y,s,c,a,b)=>{const e=lab(g,X[1],y,s,c,null,15);e.setAttribute('opacity',a);if(b)e.style.fontWeight='700'};
      const kk=fin?3:k;
      if(kk===0)row(yn+r+26,'1,5 · (−0,0595) = −0,089','#fff',ap(0));
      if(kk===1){row(yn+r+26,'pendenza σ′ = 0,240',C.orange,1);row(yn+r+50,'0,240 · (−0,089) ≈ −0,021','#fff',ap(1))}
      if(kk>=2)row(yn+r+26,'δ⁽¹⁾ = −0,021',C.pink,ap(2),true);
      if(kk>=3){const a=ap(3),e=lab(g,(X[0]+X[1])/2,yn+r+62,'derivata: −0,021 · 1 = −0,021',C.teal,null,15);e.setAttribute('opacity',a);
        const f=lab(g,(X[1]+X[2])/2+30,yn+r+86,'derivata: 0,599 · (−0,0595) = −0,0356',C.teal,null,15);f.setAttribute('opacity',a)}}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const KC=[C.blue,C.green,C.orange,C.purple];
const sm=a=>{const e=a.map(Math.exp),s=e.reduce((u,v)=>u+v,0);return e.map(v=>v/s)};
const bold=e=>{e.style.fontWeight='700';return e};

/* ---------- 1. softmax: punteggi → positivi → sommano a 1 ---------- */
BUILD.l13_softmax={
  tex:R`⟦3|p_k\;=\;⟧\begin{array}{c}⟦1|e^{a_k}⟧\\[-.5em]⟦2|\rule{4.6em}{.045em}⟧\\[-.28em]⟦2|\displaystyle\sum_{i=1}^{K}e^{a_i}⟧\end{array}`,
  end:'La softmax: esponenziale di ogni punteggio, diviso per la somma di tutti gli esponenziali.',
  steps:[
    {q:'Tre punteggi: 2,5, 2,0 e −1. Una probabilità non può essere negativa. Come li rendo tutti positivi?',add:[1],say:'Con l\'<b>esponenziale</b> del punteggio \\(a_k\\) della classe \\(k\\): è sempre positivo e rispetta l\'ordine, a punteggio più alto corrisponde un numero più grande. Diventano 12,18, 7,39 e 0,37. Il quadrato non andrebbe bene: darebbe a −3 più peso che a 2.'},
    {q:'Ora sono positivi, ma la loro somma fa 19,94. Le probabilità devono sommare a 1.',add:[2],say:'Si <b>divide per la somma</b> di tutti gli esponenziali, uno per ciascuna delle \\(K\\) classi. Ogni numero diventa la sua quota del totale: 12,18 / 19,94 = 0,61, e così gli altri.'},
    {q:'Che cosa abbiamo ottenuto?',add:[3],say:'La probabilità \\(p_k\\) che la rete assegna alla classe \\(k\\). Sono tre numeri fra 0 e 1 e la somma fa 1: 0,61 + 0,37 + 0,02.'},
    {q:'Le classi ora si parlano. Che cosa succede se alzo solo il terzo punteggio, da −1 a 3?',add:[],say:'La sua probabilità sale da 0,02 a 0,51. Gli altri due punteggi non sono cambiati, ma le loro probabilità scendono, da 0,61 a 0,31 e da 0,37 a 0,19: il totale da dividere resta 1.'}],
  scene(host){const sv=Svg(host,600,290,'Tre punteggi diventano esponenziali e poi probabilità'),g=S('g',null,sv);
    const A=[2.5,2,-1],E=A.map(Math.exp),SUM=E.reduce((u,v)=>u+v,0),P=E.map(v=>v/SUM),X=[130,300,470],B=198,bw=74;
    const US=28,UE=11.5,UP=160;   // pixel per unità: punteggi, esponenziali, probabilità
    return (k,fr,fin)=>{g.textContent='';const kk=fin?3:k;let h,txt,top='',note='';
      const m=ez(clamp((fr-0.18)/0.5,0,1)),sc3=kk===3?(fin?3:-1+4*ez(clamp((fr-0.1)/0.65,0,1))):-1;
      if(kk===0){h=A.map((a,i)=>a*US*(1-m)+E[i]*UE*m);txt=A.map((a,i)=>m<0.5?nf(a,1):'e^'+nf(a,1)+' = '+nf(E[i],2));top=m<0.5?'i punteggi':'gli esponenziali: tutti positivi'}
      else if(kk===1){h=E.map((e,i)=>e*UE*(1-m)+P[i]*UP*m);txt=E.map((e,i)=>m<0.5?nf(e,2):nf(e,2)+' / 19,94 = '+nf(P[i],2));top=m<0.5?'somma = 12,18 + 7,39 + 0,37 = 19,94':'ognuno diviso per 19,94'}
      else{const p=sm([A[0],A[1],sc3]);h=p.map(v=>v*UP);txt=p.map((v,i)=>'p'+'₁₂₃'[i]+' = '+nf(v,2));top='somma delle tre probabilità = 1'}
      S('line',{x1:60,x2:540,y1:B,y2:B,stroke:'#888'},g);
      X.forEach((x,i)=>{const hh=h[i],up=hh>=0;S('rect',{x:x-bw/2,y:up?B-hh:B,width:bw,height:Math.max(1.5,Math.abs(hh)),fill:KC[i]},g);
        lab(g,x,up?B-hh-9:B-9,txt[i],'#fff',null,14.5);
        const sc=i===2?sc3:A[i];bold(lab(g,x,B+50,'classe '+(i+1),KC[i],null,14));lab(g,x,B+70,'punteggio '+nf(sc,1),i===2&&kk===3?C.yellow:'#bbb',null,13.5)});
      lab(g,300,24,top,C.yellow,null,15)}}};

/* ---------- 2. cross-entropy ---------- */
BUILD.l13_ce={
  tex:R`\begin{aligned}⟦2|\cL⟧&⟦2|=\;⟧⟦1|-\log⟧⟦0|\,p_t⟧\\[.5em]&⟦3|=\;-\sum_{k=1}^{K}\Yy_k\log p_k⟧\end{aligned}`,
  end:'La cross-entropy: meno il logaritmo della probabilità data alla classe vera.',
  steps:[
    {q:'La rete ha dato queste quattro probabilità, e la classe vera è la terza. Quale numero dice se ha fatto bene?',add:[0],say:'La probabilità assegnata alla <b>classe vera</b>, che chiamiamo \\(p_t\\) (\\(t\\) è il numero della classe vera). Qui 0,58. Le altre tre barre non contano.'},
    {q:'Vogliamo un costo: piccolo se \\(p_t\\) è vicina a 1, grande se è vicina a 0.',add:[1],say:'Si prende il <b>logaritmo e si cambia segno</b>. Il logaritmo di 1 è zero, e quello dei numeri più piccoli di 1 è negativo: con il meno davanti viene un costo positivo. Qui −log 0,58 = 0,54.'},
    {q:'Quanto è severo questo costo con chi sbaglia?',add:[2],say:'È la <b>cross-entropy</b> \\(\\cL\\). Segui il punto: con \\(p_t=0{,}9\\) costa 0,11; con 0,05 costa 3,00, e continua a salire senza limite quando \\(p_t\\) va verso zero. Essere sicuri della risposta sbagliata costa carissimo.'},
    {q:'Si può scrivere senza dire in anticipo qual è la classe vera?',add:[3],say:'Sì, con il bersaglio one-hot \\(\\Yy_k\\): si sommano i logaritmi di tutte le classi, ciascuno moltiplicato per il suo \\(\\Yy_k\\). Tre termini sono moltiplicati per 0 e spariscono; resta quello della classe vera, moltiplicato per 1.'}],
  scene(host){const sv=Svg(host,600,280,'Quattro probabilità, la classe vera, e la curva di meno logaritmo'),g=S('g',null,sv);
    const P=sm([1.2,0.3,2.0,-0.5]),T=2,X=[52,112,172,232],B=196,UP=170,bw=40;
    const x0=345,x1=572,yb=196,yt=36,LM=3.3,px=p=>x0+(x1-x0)*p,py=l=>yb-(yb-yt)*Math.min(l,LM)/LM,f=p=>-Math.log(p);
    return (k,fr,fin)=>{g.textContent='';const kk=fin?3:k,t=ez(clamp(fr/0.5,0,1));
      /* barre */
      S('line',{x1:24,x2:262,y1:B,y2:B,stroke:'#888'},g);
      P.forEach((v,i)=>{const hot=i===T;S('rect',{x:X[i]-bw/2,y:B-v*UP,width:bw,height:v*UP,fill:C.yellow,opacity:hot?1:.35},g);
        const e=lab(g,X[i],B-v*UP-8,nf(v,2),hot?'#fff':'#aaa',null,14);if(hot)bold(e);lab(g,X[i],B+20,'classe '+(i+1),hot?'#fff':'#aaa',null,13);
        if(kk>=3){const a=fin?1:t,e2=bold(lab(g,X[i],B+62,hot?'1':'0',C.green,null,17));e2.setAttribute('opacity',hot?a:a*0.8)}});
      lab(g,X[T],B+40,'vera',C.green,null,13);
      if(kk>=3)lab(g,143,B+82,'bersaglio one-hot',C.green,null,13).setAttribute('opacity',fin?1:t);
      lab(g,143,22,'probabilità previste',C.yellow,null,14);
      /* curva */
      if(kk>=1){const a=kk===1?t:1;S('line',{x1:x0,x2:x1,y1:yb,y2:yb,stroke:'#888'},g);S('line',{x1:x0,x2:x0,y1:yb,y2:yt-6,stroke:'#888'},g);
        [0,0.5,1].forEach(v=>{S('line',{x1:px(v),x2:px(v),y1:yb,y2:yb+4,stroke:'#888'},g);lab(g,px(v),yb+20,nf(v,v===0.5?1:0),'#aaa',null,13)});
        [1,2,3].forEach(v=>{S('line',{x1:x0-4,x2:x0,y1:py(v),y2:py(v),stroke:'#888'},g);lab(g,x0-9,py(v)+5,String(v),'#aaa','end',13)});
        lab(g,(x0+x1)/2,yb+42,'probabilità della classe vera','#bbb',null,13);lab(g,x0+10,yt-14,'costo',C.pink,'start',13);
        let d='';const pe=0.037+(1-0.037)*a;for(let i=0;i<=120;i++){const p=0.037+(pe-0.037)*i/120;d+=(i?'L':'M')+px(p).toFixed(1)+' '+py(f(p)).toFixed(1)}
        S('path',{d,fill:'none',stroke:C.pink,'stroke-width':2.6},g);
        let p=P[T];if(kk===2&&!fin){const u=fr;p=u<0.1?P[T]:u<0.4?P[T]+(0.9-P[T])*ez((u-0.1)/0.3):u<0.5?0.9:u<0.9?0.9+(0.05-0.9)*ez((u-0.5)/0.4):0.05}
        if(kk>1||a>0.75){const cx=px(p),cy=py(f(p));S('line',{x1:cx,x2:cx,y1:yb,y2:cy,stroke:'#777','stroke-dasharray':'3 4'},g);S('circle',{cx,cy,r:6.5,fill:'#fff',stroke:'#000','stroke-width':2},g);
          bold(lab(g,460,yt+22,'−log '+nf(p,2)+' = '+nf(f(p),2),'#fff',null,15))}}}}};

/* ---------- 3. la derivata rispetto ai punteggi: p − y ---------- */
BUILD.l13_pmy={
  tex:R`⟦3|\delta_k\;=\;⟧⟦0|\frac{\partial\cL}{\partial a_k}⟧⟦1|\;=\;p_k⟧⟦2|\;-\;\Yy_k⟧`,
  end:'Probabilità prevista meno bersaglio: è tutto quello che serve all\'ultimo strato.',
  steps:[
    {q:'Tre punteggi, e la classe vera è la prima. Sposto di poco un punteggio: di quanto cambia la loss?',add:[0],say:'È la <b>derivata</b> della loss rispetto al punteggio \\(a_k\\). Ce n\'è una per classe. Si parte da qui: la rete dà alla classe vera solo 0,19, e la loss vale 1,64.'},
    {q:'Alzo di 0,1 il punteggio della seconda classe, che è sbagliata.',add:[1],say:'La sua probabilità cresce a spese delle altre, e quella della classe vera cala: la loss sale di 0,072. In rapporto alla spinta fa circa 0,7, ed è proprio la probabilità \\(p_k\\) di quella classe, 0,71. Più una classe sbagliata era creduta, più conta.'},
    {q:'Alzo invece di 0,1 il punteggio della classe vera.',add:[2],say:'La loss scende di 0,080: in rapporto alla spinta circa −0,8, cioè 0,19 − 1. Vale la stessa regola, ma si sottrae il bersaglio \\(\\Yy_k\\), che è 1 solo per la classe vera.'},
    {q:'Mettiamo insieme le tre classi.',add:[3],say:'Sono i <b>segnali di errore</b> \\(\\delta_k\\) dell\'ultimo strato: −0,81, 0,71 e 0,10. Il gradient descent va dalla parte opposta: alza il punteggio della classe vera e abbassa gli altri, di più quello che era più alto.'}],
  scene(host){const sv=Svg(host,600,290,'Tre punteggi: spostandone uno, la loss cambia'),g=S('g',null,sv);
    const A=[0.3,1.6,-0.4],P0=sm(A),L0=-Math.log(P0[0]),X=[120,300,480],B=190,UP=130,bw=70,NM=['classe 1 (vera)','classe 2','classe 3'];
    return (k,fr,fin)=>{g.textContent='';const kk=fin?3:k,t=ez(clamp((fr-0.1)/0.55,0,1)),a=A.slice(),j=kk===1?1:kk===2?0:-1;
      if(j>=0)a[j]+=0.1*t;const p=sm(a),L=-Math.log(p[0]);
      S('line',{x1:40,x2:560,y1:B,y2:B,stroke:'#888'},g);
      X.forEach((x,i)=>{const hot=i===j,h=p[i]*UP;
        if(j>=0){S('line',{x1:x-bw/2-8,x2:x+bw/2+8,y1:B-P0[i]*UP,y2:B-P0[i]*UP,stroke:'#fff','stroke-dasharray':'4 4',opacity:.7},g)}
        S('rect',{x:x-bw/2,y:B-h,width:bw,height:h,fill:KC[i]},g);lab(g,x,B-Math.max(h,P0[i]*UP)-10,'p = '+nf(p[i],kk===0||kk===3?2:3),'#fff',null,14.5);
        bold(lab(g,x,B+22,NM[i],KC[i],null,14));const e=lab(g,x,B+42,'punteggio '+nf(a[i],2),hot?C.yellow:'#bbb',null,13.5);if(hot)bold(e);
        if(kk===3){const d=P0[i]-(i===0?1:0),ap=fin?1:t,gg=S('g',{opacity:Math.max(ap,0.05)},g);bold(lab(gg,x,B+68,nf(P0[i],2)+' − '+(i===0?1:0)+' = '+nf(d,2),C.pink,null,15));
          const len=14+Math.abs(d)*34,xa=x+bw/2+26,ym=B-52;arrow(gg,xa,ym+(d<0?len/2:-len/2),xa,ym+(d<0?-len/2:len/2),C.yellow,3)}});
      if(kk===1||kk===2){const dl=L-L0;bold(lab(g,300,B+72,'loss: '+nf(L0,3)+' → '+nf(L,3)+'   ('+(dl>=0?'+':'')+nf(dl,3)+')',C.pink,null,15));lab(g,300,24,'linea tratteggiata: le probabilità prima della spinta','#bbb',null,13)}
      else if(kk===0)bold(lab(g,300,24,'loss = −log 0,194 = 1,64',C.pink,null,15));
      else lab(g,300,24,'frecce gialle: dove il gradient descent sposta ogni punteggio',C.yellow,null,13.5)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const ln=(g,x1,y1,x2,y2,c,w,dash,op)=>{const a={x1,y1,x2,y2,stroke:c,'stroke-width':w||1.5};if(dash)a['stroke-dasharray']=dash;if(op!=null)a.opacity=op;return S('line',a,g)};
const dotc=(g,x,y,r,c)=>S('circle',{cx:x,cy:y,r,fill:c,stroke:'#000','stroke-width':1},g);

/* ---------- 1. codice, ricostruzione, scarto: un dato e una direzione ---------- */
BUILD.l14_code={
  tex:R`\begin{aligned}⟦2|z⟧&⟦2|=⟧⟦1|\mathbf b^\top⟧⟦0|\Xv⟧\\[.45em]⟦3|\tilde{\Xv}⟧&⟦3|=\mathbf b\,z⟧\\[.45em]⟦4|\lVert\Xv\rVert^2⟧&⟦4|=z^2+\lVert\Xv-\tilde{\Xv}\rVert^2⟧\end{aligned}`,
  end:'Un numero per comprimere, una moltiplicazione per tornare indietro, e Pitagora per dire quanto si è perso.',
  steps:[
    {q:'Un dato ha due coordinate, 5 e 5. Vogliamo descriverlo con un numero solo.',add:[0],say:'Il <b>dato</b> \\(\\Xv\\): il punto (5; 5) del piano. Per ora servono due numeri per dire dov\'è.'},
    {q:'Scegliamo una retta per l\'origine lungo cui misurarlo. Come si indica la sua direzione?',add:[1],say:'Con un vettore \\(\\mathbf b\\) lungo 1: qui (0,8; 0,6), e infatti 0,64 + 0,36 = 1. La scrittura \\(\\mathbf b^\\top\\Xv\\) vuol dire: moltiplica le coordinate a due a due e somma.'},
    {q:'Di quanto bisogna avanzare lungo la retta per arrivare all\'altezza del dato?',add:[2],say:'0,8 · 5 + 0,6 · 5 = 7. È il <b>codice</b> \\(z\\) del dato: la sua coordinata lungo la retta. Si conserva solo questo numero.'},
    {q:'Chi riceve soltanto il 7, come torna a un punto del piano?',add:[3],say:'Fa \\(z\\) passi lungo \\(\\mathbf b\\): 7 · (0,8; 0,6) = (5,6; 4,2). È la <b>ricostruzione</b> \\(\\tilde{\\Xv}\\), cioè la proiezione del dato sulla retta.'},
    {q:'Quanto si è perso per strada?',add:[4],say:'Lo <b>scarto</b> fra dato e ricostruzione è lungo 1. Codice e scarto sono i cateti di un triangolo rettangolo che ha il dato per ipotenusa: 7² + 1² = 50, la lunghezza del dato al quadrato. Più è grande il codice, più è piccolo lo scarto.'}],
  scene(host){const sv=Svg(host,600,300,'Un punto, una retta per l\'origine, la proiezione del punto e lo scarto'),bg=S('g',null,sv),g=S('g',null,sv),O=[56,262],u=40,X=v=>O[0]+v*u,Y=v=>O[1]-v*u,b=[0.8,0.6],x=[5,5],z=7,xr=[5.6,4.2],PX=352;
    ln(bg,X(0),Y(0),X(6.7),Y(0),'#777');ln(bg,X(0),Y(0),X(0),Y(5.7),'#777');for(let i=1;i<=6;i++){ln(bg,X(i),Y(0),X(i),Y(0)+5,'#777');lab(bg,X(i),Y(0)+20,String(i),'#888',null,13)}for(let i=1;i<=5;i++){ln(bg,X(0)-5,Y(i),X(0),Y(i),'#777');lab(bg,X(0)-10,Y(i)+5,String(i),'#888','end',13)}
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),on=j=>k>j?1:k===j?t:0;
      /* guide delle coordinate */
      if(k===0){const a=on(0);ln(g,X(5),Y(0),X(5),Y(0)+(Y(5)-Y(0))*a,C.blue,1.2,'4 4',.8);ln(g,X(0),Y(5),X(0)+(X(5)-X(0))*a,Y(5),C.blue,1.2,'4 4',.8)}
      /* la retta e la direzione */
      if(k>=1){const a=on(1);ln(g,X(-0.5*b[0]),Y(-0.5*b[1]),X((-0.5+8.2*a)*b[0]),Y((-0.5+8.2*a)*b[1]),'#bbb',1.6)}
      /* ipotenusa */
      if(k>=4){const a=on(4);ln(g,X(0),Y(0),X(x[0]*a),Y(x[1]*a),'#fff',2)}
      /* scarto */
      if(k>=2){const a=k===2?t:1;ln(g,X(x[0]),Y(x[1]),X(x[0]+(xr[0]-x[0])*a),Y(x[1]+(xr[1]-x[1])*a),C.pink,k>=4?3.5:2,k>=4?null:'5 4')}
      /* codice: misura lungo la retta, spostata di lato */
      if(k===2||k>=4){const a=k===2?t:1,ox=7,oy=9;ln(g,X(0)+ox,Y(0)+oy,X(z*a*b[0])+ox,Y(z*a*b[1])+oy,C.orange,3.5);ln(g,X(0)+ox-4,Y(0)+oy-5,X(0)+ox+4,Y(0)+oy+5,C.orange,2);if(a>0.97){ln(g,X(xr[0])+ox-4,Y(xr[1])+oy-5,X(xr[0])+ox+4,Y(xr[1])+oy+5,C.orange,2);lab(g,X(2.8)+24,Y(2.1)+34,k>=4?'7':'z = 7',C.orange,'start',16)}}
      /* ricostruzione: z passi lungo b */
      if(k===3){const n=z*t;for(let i=0;i<Math.floor(n+1e-6);i++)arrow(g,X(i*b[0]),Y(i*b[1]),X((i+1)*b[0]),Y((i+1)*b[1]),C.orange,3);const f=n-Math.floor(n+1e-6);if(f>0.25&&n<z)ln(g,X(Math.floor(n)*b[0]),Y(Math.floor(n)*b[1]),X(n*b[0]),Y(n*b[1]),C.orange,3);if(t>0.97)lab(g,X(2.8)+24,Y(2.1)+34,'7 passi lunghi 1',C.orange,'start',15)}
      if(k>=1&&k!==3){arrow(g,X(0),Y(0),X(b[0]),Y(b[1]),'#fff',3.5);if(k===1&&t>0.6)lab(g,X(0.4),Y(0.95),'b','#fff',null,17)}
      if(k>=3){const a=k===3?(t>0.97?1:0):1;if(a)dotc(g,X(xr[0]),Y(xr[1]),6.5,C.orange)}
      dotc(g,X(x[0]),Y(x[1]),7,C.blue);lab(g,X(x[0])-12,Y(x[1])-8,'x',C.blue,'end',17);
      /* riquadro dei numeri */
      lab(g,PX,64,'dato: x = (5; 5)',C.blue,'start',15);
      if(k>=1)lab(g,PX,94,'direzione: b = (0,8; 0,6)','#fff','start',15).setAttribute('opacity',on(1));
      if(k>=2)lab(g,PX,124,'codice: z = 4 + 3 = 7',C.orange,'start',15).setAttribute('opacity',on(2));
      if(k>=3)lab(g,PX,154,'ricostruzione: (5,6; 4,2)',C.orange,'start',15).setAttribute('opacity',on(3));
      if(k>=4){lab(g,PX,184,'scarto: lungo 1',C.pink,'start',15).setAttribute('opacity',on(4));lab(g,PX,214,'7² + 1² = 50 = 5² + 5²','#fff','start',15).setAttribute('opacity',on(4))}}}};

/* ---------- 2. la varianza lungo una direzione ---------- */
BUILD.l14_var={
  tex:R`\begin{aligned}⟦3|V⟧&⟦3|=⟧⟦2|\frac1N\sum_{n=1}^{N}⟧⟦1|\big(⟧⟦0|\mathbf b^\top\Xv_n⟧⟦1|\big)^2⟧⟦5|\;=\;\mathbf b^\top S\,\mathbf b⟧\\[.4em]⟦4|S⟧&⟦4|=\frac1N\sum_{n=1}^{N}\Xv_n\Xv_n^\top⟧\end{aligned}`,
  end:'La varianza lungo una direzione dipende dai dati solo attraverso la tabella S. Il massimo, 8, è a 45°: come trovarlo senza provare?',
  steps:[
    {q:'Quattro dati con media zero e una direzione, la stessa di prima: (0,8; 0,6). Dove cadono le proiezioni?',add:[0],say:'Il <b>codice</b> del dato numero \\(n\\), calcolato come prima. Per i quattro dati: 3; 2,6; −3; −2,6.'},
    {q:'Quanto sono sparse attorno all\'origine? Il segno non deve contare: −3 è lontano quanto 3.',add:[1],say:'Si eleva ogni codice al <b>quadrato</b>: 9; 6,76; 9; 6,76.'},
    {q:'Serve un numero solo per tutti i dati.',add:[2,3],say:'La <b>media</b> dei quadrati sugli \\(N\\) dati: (9 + 6,76 + 9 + 6,76) / 4 = 7,88. È la varianza \\(V\\) delle proiezioni lungo \\(\\mathbf b\\).'},
    {q:'Per provare un\'altra direzione bisognerebbe riproiettare tutti i dati. Si può guardarli una volta sola?',add:[4],say:'Sì: li si riassume in una tabella, la <b>matrice di covarianza</b> \\(S\\). Sulla diagonale la varianza di ciascuna coordinata, 5 e 5; fuori, quanto le due coordinate variano insieme: 3.'},
    {q:'E la varianza lungo \\(\\mathbf b\\), come esce dalla tabella?',add:[5],say:'Moltiplicando \\(S\\) per \\(\\mathbf b\\) da tutte e due le parti: 5 · 0,64 + 2 · 3 · 0,48 + 5 · 0,36 = 7,88. Lo stesso numero di prima, senza più toccare i dati.'},
    {q:'Ora cambiare direzione costa poco. Quale dà di più?',add:[],say:'Ruotando \\(\\mathbf b\\) la varianza va da un minimo di 2 a un massimo di 8. Il massimo è a 45°, la direzione lungo cui la nuvola è allungata.'}],
  scene(host){const sv=Svg(host,600,320,'Quattro punti proiettati su una retta, i quadrati delle proiezioni e la matrice di covarianza'),bg=S('g',null,sv),g=S('g',null,sv),O=[158,160],u=38,X=v=>O[0]+v*u,Y=v=>O[1]-v*u,P=[[3,1],[1,3],[-3,-1],[-1,-3]],TH=Math.atan2(0.6,0.8),PX=342;
    ln(bg,X(-3.9),Y(0),X(3.9),Y(0),'#555');ln(bg,X(0),Y(-3.9),X(0),Y(3.9),'#555');[-3,-2,-1,1,2,3].forEach(i=>{ln(bg,X(i),Y(0)-3,X(i),Y(0)+3,'#666');ln(bg,X(0)-3,Y(i),X(0)+3,Y(i),'#666')});lab(bg,X(3),Y(0)+19,'3','#888',null,13);lab(bg,X(0)-9,Y(3)+5,'3','#888','end',13);
    const V=a=>5+3*Math.sin(2*a),GX=d=>PX+14+d/180*220,GY=v=>272-v*22;
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),on=j=>k>j?1:k===j?t:0;
      let th=TH;if(k===5){const a=ez(clamp(fr/0.2,0,1)),c=ez(clamp((fr-0.34)/0.5,0,1));th=TH+(Math.PI/4-TH)*a+(Math.PI/2)*c;if(fin)th=Math.PI/4}
      const b=[Math.cos(th),Math.sin(th)],pj=k===0?t:1;
      ln(g,X(-4*b[0]),Y(-4*b[1]),X(4*b[0]),Y(4*b[1]),'#ddd',1.7);
      P.forEach(q=>{const z=q[0]*b[0]+q[1]*b[1];ln(g,X(q[0]),Y(q[1]),X(q[0]+(z*b[0]-q[0])*pj),Y(q[1]+(z*b[1]-q[1])*pj),C.pink,1.3)});
      P.forEach(q=>{const z=q[0]*b[0]+q[1]*b[1];if(pj>0.02)dotc(g,X(q[0]+(z*b[0]-q[0])*pj),Y(q[1]+(z*b[1]-q[1])*pj),5,C.orange);dotc(g,X(q[0]),Y(q[1]),6,C.blue)});
      arrow(g,X(0),Y(0),X(b[0]),Y(b[1]),'#fff',3.2);
      if(k<=2){const Z=[3,2.6,-3,-2.6],T0=['3','2,6','−3','−2,6'],T1=['3² = 9','2,6² = 6,76','(−3)² = 9','(−2,6)² = 6,76'],bx=PX+118,sc=12.5;
        lab(g,PX,52,k===0?'i codici dei quattro dati':'i codici al quadrato','#ddd','start',14);
        Z.forEach((zz,i)=>{const y=86+i*34;lab(g,PX,y+5,k===0?'z = '+T0[i]:T1[i],C.orange,'start',15);if(k>=1){const w=zz*zz*sc*(k===1?t:1);S('rect',{x:bx,y:y-9,width:w,height:18,fill:C.orange,opacity:.85},g)}});
        if(k===2){const xm=bx+7.88*sc;ln(g,xm,70,xm,70+142*t,'#fff',2,'5 4');if(t>0.9)lab(g,PX+248,240,'media = 7,88','#fff','end',16)}}
      else{const cx=PX+92,cy=40,cw=52,vals=[[5,3],[3,5]],a3=on(3);
        if(k<5){lab(g,cx-16,cy+cw+7,'S =','#fff','end',18).setAttribute('opacity',a3);
        vals.forEach((r,i)=>r.forEach((v,j)=>{S('rect',{x:cx+j*cw,y:cy+i*cw,width:cw-4,height:cw-4,fill:i===j?'#2b2b2b':'#181818',stroke:'#555',opacity:a3},g);lab(g,cx+j*cw+cw/2-2,cy+i*cw+cw/2+5,String(v),i===j?C.blue:C.teal,null,20).setAttribute('opacity',a3)}))}
        if(k===3){lab(g,PX,178,'5 e 5: le varianze di x₁ e di x₂',C.blue,'start',14).setAttribute('opacity',a3);lab(g,PX,204,'3: quanto variano insieme',C.teal,'start',14).setAttribute('opacity',a3)}
        if(k===4){lab(g,PX,186,'5·0,64 + 2·3·0,48 + 5·0,36','#ddd','start',15).setAttribute('opacity',t);lab(g,PX,216,'= 3,2 + 2,88 + 1,8 = 7,88',C.orange,'start',16).setAttribute('opacity',t)}
        if(k===5){let d='';for(let i=0;i<=90;i++){const a=i*2;d+=(i?'L':'M')+GX(a).toFixed(1)+' '+GY(V(a*Math.PI/180)).toFixed(1)}
          ln(g,GX(0),GY(0),GX(180),GY(0),'#777');[0,45,90,135,180].forEach(a=>{ln(g,GX(a),GY(0),GX(a),GY(0)+4,'#777');lab(g,GX(a),GY(0)+19,a+'°','#888',null,13)});
          [[2,'2'],[8,'8']].forEach(q=>{ln(g,GX(0),GY(q[0]),GX(180),GY(q[0]),'#555',1,'3 4');lab(g,GX(0)-6,GY(q[0])+5,q[1],'#aaa','end',13)});
          S('path',{d,fill:'none',stroke:C.orange,'stroke-width':2.4},g);const deg=((th*180/Math.PI)%180+180)%180;ln(g,GX(deg),GY(0),GX(deg),GY(V(th)),'#fff',1,'4 4');dotc(g,GX(deg),GY(V(th)),6,C.orange);
          lab(g,PX+14,52,'direzione '+nf(deg,0)+'° · varianza '+nf(V(th),2),C.orange,'start',15)}}}}};

/* ---------- 3. autovettore e autovalore ---------- */
BUILD.l14_eig={
  tex:R`\begin{aligned}⟦0|S\,\mathbf b⟧&⟦1|=\Rl\,\mathbf b⟧\\[.5em]⟦2|\mathbf b^\top S\,\mathbf b⟧&⟦2|=⟧⟦3|\Rl\,\mathbf b^\top\mathbf b⟧⟦4|\;=\Rl⟧\end{aligned}`,
  end:'La direzione di massima varianza è un autovettore di S, e la varianza lungo di essa è il suo autovalore.',
  steps:[
    {q:'Che cosa fa la tabella \\(S\\) a un vettore? Proviamo con \\(\\mathbf b\\) = (1; 0).',add:[0],say:'Moltiplicando \\(S\\) per \\(\\mathbf b\\) esce un altro vettore, (5; 3): <b>più lungo e ruotato</b> rispetto a \\(\\mathbf b\\).'},
    {q:'Ruotiamo \\(\\mathbf b\\). C\'è una direzione in cui \\(S\\) allunga senza ruotare?',add:[1],say:'Sì, a 45°. Lì \\(\\mathbf b\\) = (0,71; 0,71) e ne esce (5,66; 5,66): lo stesso vettore, 8 volte più lungo. Un vettore così è un <b>autovettore</b> di \\(S\\), e il fattore \\(\\Rl\\) = 8 è il suo <b>autovalore</b>.'},
    {q:'Intanto la varianza lungo \\(\\mathbf b\\) è salita da 5 a 8, il suo massimo. È un caso?',add:[],say:'No. \\(S\\mathbf b\\) pende sempre dalla parte verso cui la varianza cresce; il tratto verde acqua mostra di quanto. Finché pende, ruotando \\(\\mathbf b\\) da quella parte si guadagna. Al massimo non resta nulla da guadagnare: \\(S\\mathbf b\\) è allineato a \\(\\mathbf b\\).'},
    {q:'Quanto vale la varianza lungo un autovettore?',add:[2,3],say:'Nella formula della varianza si scrive \\(\\Rl\\mathbf b\\) al posto di \\(S\\mathbf b\\). \\(\\Rl\\) è un numero e si porta davanti.'},
    {q:'E quel che resta, \\(\\mathbf b^\\top\\mathbf b\\)?',add:[4],say:'È la lunghezza di \\(\\mathbf b\\) al quadrato: 0,5 + 0,5 = 1. Resta solo \\(\\Rl\\): la varianza lungo un autovettore è il suo autovalore, qui 8.'}],
  scene(host){const sv=Svg(host,600,320,'Un vettore di lunghezza 1 e il vettore che la matrice di covarianza ne ricava'),bg=S('g',null,sv),g=S('g',null,sv),O=[112,276],u=30,X=v=>O[0]+v*u,Y=v=>O[1]-v*u,PX=352,Sb=b=>[5*b[0]+3*b[1],3*b[0]+5*b[1]];
    ln(bg,X(-2.6),Y(0),X(7.4),Y(0),'#555');ln(bg,X(0),Y(-1),X(0),Y(8.2),'#555');S('circle',{cx:X(0),cy:Y(0),r:u,fill:'none',stroke:'#777','stroke-dasharray':'3 4'},bg);
    const cx=PX+70,cy=30,cw=42;lab(bg,cx-14,cy+cw+5,'S =','#fff','end',17);[[5,3],[3,5]].forEach((r,i)=>r.forEach((v,j)=>{S('rect',{x:cx+j*cw,y:cy+i*cw,width:cw-4,height:cw-4,fill:i===j?'#2b2b2b':'#181818',stroke:'#555'},bg);lab(bg,cx+j*cw+cw/2-2,cy+i*cw+cw/2+4,String(v),i===j?C.blue:C.teal,null,18)}));
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1));let deg=45,grow=1;
      if(k===0){deg=0;grow=t}else if(k===1)deg=45*ez(clamp(fr/0.75,0,1));else if(k===2&&!fin)deg=45+32*Math.sin(2*Math.PI*clamp(fr/0.92,0,1));
      const a=deg*Math.PI/180,b=[Math.cos(a),Math.sin(a)],s=Sb(b),v=b[0]*s[0]+b[1]*s[1],al=Math.abs(deg-45)<0.6;
      ln(g,X(0),Y(0),X(7*b[0]),Y(7*b[1]),'#888',1,'5 5');
      const e=[b[0]+(s[0]-b[0])*grow,b[1]+(s[1]-b[1])*grow];
      if(k===2&&!al)ln(g,X(v*b[0]),Y(v*b[1]),X(s[0]),Y(s[1]),C.teal,3.5);
      arrow(g,X(0),Y(0),X(e[0]),Y(e[1]),C.yellow,3.2);arrow(g,X(0),Y(0),X(b[0]),Y(b[1]),'#fff',3.6);
      lab(g,PX,150,'b = ('+nf(b[0],2)+'; '+nf(b[1],2)+')','#fff','start',15);
      if(grow>0.6)lab(g,PX,178,'S b = ('+nf(s[0],2)+'; '+nf(s[1],2)+')',C.yellow,'start',15);
      if(k>=1)lab(g,PX,206,'varianza lungo b: '+nf(v,2),C.orange,'start',15);
      if(k===1&&al||k>=3)lab(g,PX,240,'S b = 8 · b : stessa direzione',C.yellow,'start',15);
      if(k===2&&!al)lab(g,PX,240,'S b pende verso i 45°',C.teal,'start',15);
      if(k===2&&al)lab(g,PX,240,'allineati: massimo',C.teal,'start',15);
      if(k>=3)lab(g,PX,268,k===3?'bᵀ S b = 8 · bᵀ b':'bᵀ S b = 8 · 1 = 8',C.orange,'start',15)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const ln=(g,x1,y1,x2,y2,c,w,dash,op)=>{const a={x1,y1,x2,y2,stroke:c,'stroke-width':w||1.5};if(dash)a['stroke-dasharray']=dash;if(op!=null)a.opacity=op;return S('line',a,g)};
const dotc=(g,x,y,r,c)=>S('circle',{cx:x,cy:y,r,fill:c,stroke:'#000','stroke-width':1},g);

/* ---------- 1. la distanza di Minkowski ---------- */
BUILD.l15_mink={
  tex:R`⟦4|d_p(\Xv,\mathbf y)\;=\;⟧⟦3|\Big(⟧⟦1|\sum_{k=1}^{D}⟧⟦0|\lvert\Xs_k-y_k\rvert⟧^{⟦2|p⟧}⟦3|\Big)^{1/p}⟧`,
  end:'Una famiglia di distanze: cambia solo l\'esponente, cioè quanto pesano le differenze grandi.',
  steps:[
    {q:'Due punti del piano: \\(\\Xv\\) = (1; 1) e \\(\\mathbf y\\) = (5; 4). Di quanto differiscono, una coordinata per volta?',add:[0],say:'La <b>differenza</b> sulla coordinata numero \\(k\\), in valore assoluto perché conta di quanto si differisce e non in che verso: 4 sulla prima coordinata, 3 sulla seconda.'},
    {q:'Due numeri sono troppi: ne serve uno. La cosa più semplice?',add:[1],say:'<b>Sommare</b> le differenze di tutte le \\(D\\) coordinate: 4 + 3 = 7. È la strada di chi può muoversi solo lungo gli assi, come fra gli isolati di una città: la distanza di Manhattan.'},
    {q:'In linea d\'aria però la strada è più corta. Come si calcola?',add:[2,3],say:'Con il teorema di Pitagora: ogni differenza al <b>quadrato</b>, poi la somma, poi la radice: √(16 + 9) = 5. È la distanza euclidea. Con un esponente \\(p\\) qualsiasi al posto del 2, e la potenza \\(1/p\\) al posto della radice, si ha una famiglia intera.'},
    {q:'Che cosa succede alzando \\(p\\)?',add:[],say:'La differenza più grande pesa sempre di più: con \\(p\\) = 3 la distanza è 4,50, con \\(p\\) = 10 è 4,02. Al limite conta solo lei, 4: è la distanza di Chebyshev.'},
    {q:'Serve un nome per tutta la famiglia.',add:[4],say:'La <b>distanza di Minkowski</b> di esponente \\(p\\). Sulla stessa coppia di punti vale 7 con \\(p\\) = 1, 5 con \\(p\\) = 2, e scende verso 4 al crescere di \\(p\\).'}],
  scene(host){const sv=Svg(host,600,300,'Due punti su una griglia: il percorso lungo gli assi, quello in linea d\'aria e la distanza al variare dell\'esponente'),bg=S('g',null,sv),g=S('g',null,sv),O=[40,268],u=44,X=v=>O[0]+v*u,Y=v=>O[1]-v*u,a=[1,1],b=[5,4],PX=338,GX=d=>PX+16+(d-4)*72,GY=226;
    for(let i=0;i<=6;i++)ln(bg,X(i),Y(0),X(i),Y(5),'#2c2c2c');for(let i=0;i<=5;i++)ln(bg,X(0),Y(i),X(6),Y(i),'#2c2c2c');
    for(let i=1;i<=6;i++)lab(bg,X(i),Y(0)+18,String(i),'#888',null,13);for(let i=1;i<=5;i++)lab(bg,X(0)-9,Y(i)+5,String(i),'#888','end',13);
    const dp=p=>Math.pow(Math.pow(4,p)+Math.pow(3,p),1/p);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1)),on=j=>k>j?1:k===j?t:0,hot=k===1;
      /* i due tratti lungo gli assi */
      const a0=k===0?clamp(t*2,0,1):1,a1=k===0?clamp(t*2-1,0,1):1;
      ln(g,X(a[0]),Y(a[1]),X(a[0]+4*a0),Y(a[1]),C.orange,hot?4.5:3,null,k>=2?.75:1);if(a1>0)ln(g,X(b[0]),Y(a[1]),X(b[0]),Y(a[1]+3*a1),C.orange,hot?4.5:3,null,k>=2?.75:1);
      if(a0>0.95)lab(g,X(3),Y(1)+21,'4',C.orange,null,17);if(a1>0.95)lab(g,X(5)+13,Y(2.5)+6,'3',C.orange,'start',17);
      /* linea d'aria */
      if(k>=2){const e=on(2);ln(g,X(a[0]),Y(a[1]),X(a[0]+4*e),Y(a[1]+3*e),C.teal,3.5);if(e>0.95)lab(g,X(2.8)-10,Y(2.35)-10,'5',C.teal,'end',17)}
      dotc(g,X(a[0]),Y(a[1]),7.5,C.blue);lab(g,X(a[0])-12,Y(a[1])-10,'x',C.blue,'end',17);dotc(g,X(b[0]),Y(b[1]),7.5,'#fff');lab(g,X(b[0])+12,Y(b[1])-8,'y','#fff','start',17);
      /* riquadro dei numeri */
      lab(g,PX,52,'differenze: 4 e 3',C.orange,'start',15).setAttribute('opacity',k===0?clamp(t*2-1,0,1):1);
      if(k>=1)lab(g,PX,82,'p = 1, Manhattan: 4 + 3 = 7',C.orange,'start',15).setAttribute('opacity',on(1));
      if(k>=2)lab(g,PX,112,'p = 2, euclidea: √(16 + 9) = 5',C.teal,'start',15).setAttribute('opacity',on(2));
      if(k>=3){let p;if(fin)p=2;else if(k===3)p=2+10*ez(clamp(fr/0.85,0,1));else{const s=clamp(fr/0.9,0,1);p=1+11*s*s}
        const d=dp(p),o=on(3);
        if(!fin)lab(g,PX,152,'p = '+nf(p,1)+'  →  distanza '+nf(d,2),C.yellow,'start',16);else lab(g,PX,152,'p → ∞, Chebyshev: 4',C.pink,'start',15);
        const gg=S('g',{opacity:o},g);ln(gg,GX(3.85),GY,GX(7.15),GY,'#888',1.5);
        [[4,C.pink,'4'],[5,C.teal,'5'],[7,C.orange,'7']].forEach(q=>{ln(gg,GX(q[0]),GY-7,GX(q[0]),GY+7,q[1],2.5);lab(gg,GX(q[0]),GY+25,q[2],q[1],null,15)});
        lab(gg,GX(4)-10,GY+46,'Chebyshev',C.pink,'start',14);lab(gg,GX(5),GY-16,'euclidea',C.teal,null,14);lab(gg,GX(7)+10,GY+46,'Manhattan',C.orange,'end',14);
        if(!fin)dotc(gg,GX(d),GY,7,C.yellow)}}}};

/* ---------- 2. la distorsione di k-means ---------- */
BUILD.l15_J={
  tex:R`⟦4|J(c,\boldsymbol\mu)\;=\;⟧⟦3|\sum_{i=1}^{N}⟧⟦2|\lVert⟧⟦0|\Xv_i⟧⟦1|-\boldsymbol\mu_{c_i}⟧⟦2|\rVert^2⟧`,
  end:'La distorsione e le due mosse che la abbassano: sono i due passi dell\'algoritmo.',
  steps:[
    {q:'Cinque dati su una retta: 1, 2, 3, 6, 8. Due centroidi provvisori, in 4 e in 9. Quanto è buona questa scelta? Partiamo da un dato.',add:[0],say:'Il <b>dato</b> numero \\(i\\). Seguiamo quello che vale 6.'},
    {q:'Chi lo rappresenta, e quanto gli è lontano?',add:[1],say:'Ogni dato va con il centroide più vicino: \\(c_i\\) è il numero del suo gruppo, \\(\\boldsymbol\\mu_{c_i}\\) il centroide di quel gruppo. Il 6 va con il centroide in 4, perché 9 è più lontano. La <b>differenza</b> è 2.'},
    {q:'A sinistra o a destra del centroide è lo stesso: il segno non deve contare.',add:[2],say:'Si prende il <b>quadrato della distanza</b>, come per gli errori nella lezione 2. Per il 6 fa 4; per i cinque dati, nell\'ordine: 9, 4, 1, 4 e 1.'},
    {q:'Serve un numero solo per tutta la scelta.',add:[3,4],say:'La <b>somma</b> sugli \\(N\\) dati: 9 + 4 + 1 + 4 + 1 = 19. È la <b>distorsione</b> \\(J\\), che dipende dai gruppi \\(c\\) e dai centroidi \\(\\boldsymbol\\mu\\). Più è bassa, più i dati stanno stretti attorno ai loro centroidi.'},
    {q:'Come si abbassa? Prima mossa: gruppi fermi, si spostano i centroidi.',add:[],say:'Ogni centroide va nella <b>media</b> dei suoi dati: (1 + 2 + 3 + 6) / 4 = 3, e l\'altro in 8. Ora \\(J\\) = 4 + 1 + 0 + 9 + 0 = 14.'},
    {q:'Seconda mossa: centroidi fermi, si rivedono i gruppi.',add:[],say:'Il 6 ora dista 3 dal suo centroide e solo 2 dall\'altro: <b>cambia gruppo</b>, e il suo quadrato scende da 9 a 4. \\(J\\) = 4 + 1 + 0 + 4 + 0 = 9.'},
    {q:'Di nuovo le medie.',add:[],say:'I centroidi vanno in 2 e in 7: \\(J\\) = 1 + 0 + 1 + 1 + 1 = 4. Riassegnando i dati nessuno cambia più gruppo: ci si ferma.'}],
  scene(host){const sv=Svg(host,600,290,'Cinque dati su una retta, due centroidi e i quadrati delle distanze'),bg=S('g',null,sv),g=S('g',null,sv),X=v=>45+v*51,B=178,D=[1,2,3,6,8],U=11,COL=[C.blue,C.orange];
    ln(bg,X(0),B,X(10),B,'#777');for(let i=0;i<=10;i++){ln(bg,X(i),B-4,X(i),B+4,'#777');lab(bg,X(i),B+24,String(i),D.includes(i)?'#fff':'#777',null,14)}
    lab(bg,X(0)-6,B+59,'centroidi','#bbb','start',13);
    const cross=(x,y,c)=>{S('path',{d:`M${x-8} ${y-8}L${x+8} ${y+8}M${x-8} ${y+8}L${x+8} ${y-8}`,stroke:c,'stroke-width':3.5,'stroke-linecap':'round'},g)};
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.6,0,1));
      let mu=[4,9],sw=0;const c=[0,0,0,0,1];/* sw: avanzamento del cambio di gruppo del dato 6 */
      if(k===4)mu=[4-t,9-t];else if(k===5){mu=[3,8];sw=t}else if(k>=6){sw=1;mu=[3-t,8-t]}
      const grp=i=>i===3?(sw>0.5?1:0):c[i];
      /* quadrati */
      let J=0;const sq=D.map((d,i)=>{let v;if(i===3){const v0=(d-mu[0])**2,v1=(d-mu[1])**2;v=v0+(v1-v0)*sw}else v=(d-mu[c[i]])**2;J+=v;return v});
      if(k>=2)D.forEach((d,i)=>{const h=sq[i]*U*(k===2?t:1);S('rect',{x:X(d)-13,y:B-12-h,width:26,height:Math.max(h,0.5),fill:C.pink,opacity:.9},g);if(k>2||t>0.9)lab(g,X(d),B-12-h-7,nf(sq[i],Math.abs(sq[i]-Math.round(sq[i]))<0.005?0:1),C.pink,null,15)});
      /* il dato seguito e la sua distanza dal centroide */
      if(k===0)S('circle',{cx:X(6),cy:B,r:13+2*Math.sin(fr*12),fill:'none',stroke:'#fff','stroke-width':2},g);
      if(k===1){const m=mu[0];ln(g,X(6),B-22,X(6)+(X(m)-X(6))*t,B-22,'#fff',3);ln(g,X(6),B-28,X(6),B-16,'#fff',2);if(t>0.9){ln(g,X(m),B-28,X(m),B-16,'#fff',2);lab(g,X(5),B-32,'2','#fff',null,16)}}
      /* centroidi: croci sotto la retta, con un filo fino alla loro posizione */
      mu.forEach((m,j)=>{ln(g,X(m),B+30,X(m),B+44,COL[j],1.2,'3 3');cross(X(m),B+54,COL[j]);lab(g,X(m),B+86,nf(m,Math.abs(m-Math.round(m))<0.005?0:1),COL[j],null,15)});
      /* dati */
      D.forEach((d,i)=>{const col=k===0?C.lg:COL[grp(i)];dotc(g,X(d),B,7.5,k===1&&t<0.5?C.lg:col)});
      if(k>=3){const a=k===3?t:1;lab(g,580,34,'J = '+nf(J,Math.abs(J-Math.round(J))<0.005?0:1),C.pink,'end',19).setAttribute('opacity',a)}}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const gs=(x,m,s)=>Math.exp(-0.5*((x-m)/s)**2)/(s*2.5066);
const bell=(X,Y0,sc,m,s,a,b)=>{let d='';for(let i=0;i<=160;i++){const x=a+(b-a)*i/160;d+=(i?'L':'M')+X(x).toFixed(1)+' '+(Y0-sc*gs(x,m,s)).toFixed(1)}return d};

/* ---------- 1. l'obiettivo dell'autoencoder: dato → codice → ricostruzione → confronto → media → minimo ---------- */
BUILD.l16_ae={
  tex:R`⟦5|\min\ \ ⟧⟦4|\frac1N\sum_{i=1}^{N}\ ⟧⟦3|\cl\big(\Xv_i,\ ⟧⟦2|f\big(⟧⟦1|g(⟧⟦0|\Xv_i⟧⟦1|)⟧⟦2|\big)⟧⟦3|\big)⟧`,
  end:'L\'obiettivo dell\'autoencoder: rendere piccola, in media, la distanza fra ogni dato e la sua ricostruzione.',
  steps:[
    {q:'Non ci sono etichette. Da che cosa si parte?',add:[0],say:'Da un <b>dato</b>, e basta: \\(\\Xv_i\\) è l\'immagine numero \\(i\\), una griglia di 12 × 12 pixel, cioè 144 numeri fra 0 e 1.'},
    {q:'L\'immagine deve passare per la strettoia. Chi la riassume?',add:[1],say:'L\'<b>encoder</b>, che chiamiamo \\(g\\): una rete che trasforma i 144 numeri nel <b>codice</b>, qui otto numeri (le barre gialle).'},
    {q:'Dal codice bisogna tornare a un\'immagine.',add:[2],say:'Lo fa il <b>decoder</b>, che chiamiamo \\(f\\): riceve solo gli otto numeri e produce 144 pixel, la <b>ricostruzione</b>.'},
    {q:'È venuta bene? Serve un numero che lo dica.',add:[3],say:'Una <b>loss</b> \\(\\cl\\) confronta il dato con la sua ricostruzione, pixel per pixel.'},
    {q:'Un\'immagine sola non basta per giudicare la rete.',add:[4],say:'Si fa la <b>media</b> della loss su tutti gli \\(N\\) dati.'},
    {q:'Che cosa si può cambiare per abbassare quel numero?',add:[5],say:'I pesi delle due reti. Allenare l\'autoencoder significa cercare i pesi di \\(g\\) e di \\(f\\) che rendono <b>minima</b> la loss media: un problema supervisionato in cui la risposta giusta è l\'input stesso.'}],
  scene(host){
    const P=M.pic,W=M.AEW,sv=Svg(host,600,318,'Un\'immagine attraversa encoder e decoder e viene confrontata con la sua ricostruzione');
    if(!P||!W){lab(sv,300,160,'Figura non disponibile.');return ()=>{}}
    const G=P.G,D=P.D,o=W.ae8,bin=atob(o.b),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const a=new Int16Array(u.buffer);let q=0;const Wm=[],bb=[];
    for(let l=1;l<o.sizes.length;l++){const w=[];for(let j=0;j<o.sizes[l];j++){const r=new Float64Array(o.sizes[l-1]);for(let i=0;i<r.length;i++)r[i]=a[q++]/o.sc;w.push(r)}const b=new Float64Array(o.sizes[l]);for(let j=0;j<b.length;j++)b[j]=a[q++]/o.sc;Wm.push(w);bb.push(b)}
    const layer=(l,z,last)=>Wm[l].map((row,j)=>{let s=bb[l][j];for(let i=0;i<row.length;i++)s+=row[i]*z[i];return last?1/(1+Math.exp(-s)):Math.tanh(s)});
    const img=i=>Float64Array.from(P.IMGS[i],x=>clamp(x,0,1)),mse=(x,y)=>{let s=0;for(let k=0;k<D;k++)s+=(x[k]-y[k])**2;return s/D};
    const ids=[150,151,152,153,154,155,160,163],X=ids.map(img),Z=X.map(x=>layer(0,x,false)),XR=Z.map(z=>layer(1,z,true)),E=X.map((x,i)=>mse(x,XR[i])),mean=E.reduce((s,e)=>s+e,0)/E.length,emax=Math.max(...E);
    const st=BUILD.l16_ae.steps,d0=2;
    st[3].say=`Una <b>loss</b> \\(\\cl\\) confronta il dato con la sua ricostruzione, pixel per pixel. Qui la media dei quadrati delle differenze: per questa immagine vale ${nf(E[d0],3)}. Zero vorrebbe dire copia perfetta.`;
    st[4].say=`Si fa la <b>media</b> della loss su tutti gli \\(N\\) dati. Sulle otto immagini della figura gli errori vanno da ${nf(Math.min(...E),3)} a ${nf(emax,3)}, e la media è ${nf(mean,3)}.`;
    const draw=(g,v,x,y,px)=>{for(let k=0;k<D;k++){const c=Math.round(255*clamp(v[k],0,1));S('rect',{x:x+(k%G)*px,y:y+Math.floor(k/G)*px,width:px+0.4,height:px+0.4,fill:`rgb(${c},${c},${c})`},g)}S('rect',{x,y,width:G*px,height:G*px,fill:'none',stroke:'#555'},g)};
    const gI=S('g',null,sv),gR=S('g',null,sv),gT=S('g',null,sv),g=S('g',null,sv),PX=10,IY=22,IW=G*PX;
    draw(gI,X[d0],30,IY,PX);draw(gR,XR[d0],450,IY,PX);const TX=i=>132+i*54;ids.forEach((id,i)=>draw(gT,X[i],TX(i)+6,278,3));
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),hot=k===5&&!fin?C.yellow:'#bbb';
      gR.setAttribute('opacity',k>2?1:k===2?t:0);gT.setAttribute('opacity',k>4?1:k===4?t:0);
      lab(g,30+IW/2,IY+IW+19,'dato: 144 numeri',C.blue,null,14);
      if(k>=1){const a1=k===1?t:1;arrow(g,160,IY+IW/2,160+52*a1,IY+IW/2,hot,2.6);lab(g,186,IY+IW/2-12,'encoder g',hot,null,13);
        S('line',{x1:226,x2:374,y1:IY+IW/2,y2:IY+IW/2,stroke:'#666'},g);Z[d0].forEach((v,j)=>{const h=Math.abs(v)*50*a1;S('rect',{x:233+j*17.5,y:v>0?IY+IW/2-h:IY+IW/2,width:12,height:h,fill:C.yellow},g)});
        lab(g,300,IY+IW+19,'codice: 8 numeri',C.yellow,null,14)}
      if(k>=2){const a2=k===2?t:1;arrow(g,386,IY+IW/2,386+52*a2,IY+IW/2,hot,2.6);lab(g,412,IY+IW/2-12,'decoder f',hot,null,13);lab(g,450+IW/2,IY+IW+19,'ricostruzione',C.green,null,14)}
      if(k>=3){const a3=k===3?t:1,y=IY+IW+34;S('path',{d:`M${30+IW/2} ${y}v9H${30+IW/2+(420)*a3}${a3>0.98?'v-9':''}`,fill:'none',stroke:C.pink,'stroke-width':2},g);
        if(a3>0.5)lab(g,300,y+27,'loss di questa immagine: '+nf(E[d0],3),C.pink,null,14)}
      if(k>=4){const a4=k===4?t:1,B=272,sc=42/emax;E.forEach((e,i)=>{const h=e*sc*a4;S('rect',{x:TX(i)+12,y:B-h,width:24,height:h,fill:C.pink,opacity:i===d0?1:0.55},g)});
        const ym=B-mean*sc;S('line',{x1:126,x2:126+440*a4,y1:ym,y2:ym,stroke:'#fff','stroke-dasharray':'6 4'},g);
        lab(g,118,B-22,'loss media',k===5&&!fin?C.yellow:'#fff','end',13);lab(g,118,B-4,nf(mean,3),k===5&&!fin?C.yellow:'#fff','end',15)}}}};

/* ---------- 2. la loss del VAE: ricostruzione + KL ---------- */
BUILD.l16_vae={
  tex:R`⟦4|\cL\;=\;⟧⟦0|\lVert\Xv-\tilde{\Xv}\rVert^2⟧⟦1|\;+\;⟧⟦4|\sum_{j}⟧⟦3|\tfrac12\big(⟧⟦1|\mu_j^2⟧⟦2|\,+\,\sigma_j^2-1-\log\sigma_j^2⟧⟦3|\big)⟧`,
  end:'La loss del VAE: ricostruire bene, ma con campane che restano vicine alla gaussiana standard.',
  steps:[
    {q:'Ora per ogni immagine l\'encoder produce una campana, e il codice viene estratto da lì. Che cosa chiede il decoder?',add:[0],say:'L\'<b>errore di ricostruzione</b>, come prima. Da solo però spingerebbe l\'encoder a stringere la campana fino a farne un punto: meno caso c\'è, più è facile ricostruire. Si tornerebbe all\'autoencoder normale.'},
    {q:'Serve una penalità che tenga le campane vicine a quella standard (tratteggiata). Primo difetto possibile: essere lontana da zero.',add:[1],say:'Si paga il <b>quadrato della media</b>. Qui la campana gialla ha media \\(\\mu=1{,}5\\): costa 1,5² = 2,25. Con media zero non costa nulla.'},
    {q:'Secondo difetto possibile: essere troppo stretta, o troppo larga.',add:[2],say:'Un termine che dipende solo dalla <b>deviazione standard</b> \\(\\sigma\\): vale zero quando \\(\\sigma=1\\) e cresce sia stringendo sia allargando. Con \\(\\sigma=0{,}6\\): 0,36 − 1 + 1,02 = 0,38 (il logaritmo di 0,36 è −1,02).'},
    {q:'Quanto costa in tutto questa campana?',add:[3],say:'La metà della somma: ½ · (2,25 + 0,38) = 1,32. È la <b>divergenza KL</b> fra la campana gialla e quella standard; il fattore ½ viene dalla sua formula esatta per due gaussiane.'},
    {q:'Il codice ha più coordinate, e ognuna ha la sua campana.',add:[4],say:'Si <b>sommano</b> le penalità di tutte le coordinate \\(j\\) del codice, e il totale si aggiunge all\'errore di ricostruzione: è la loss \\(\\cL\\) del VAE.'}],
  scene(host){const sv=Svg(host,600,272,'La campana prodotta dall\'encoder a confronto con la gaussiana standard'),g=S('g',null,sv),X=v=>30+(v+4)*49,B=222,SC=150,mu=1.5;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),sd=k===0?0.6-0.3*Math.sin(Math.PI*clamp(fr/0.9,0,1)):0.6;
      S('line',{x1:X(-4),x2:X(4),y1:B,y2:B,stroke:'#777'},g);[-4,-2,0,2,4].forEach(v=>{S('line',{x1:X(v),x2:X(v),y1:B,y2:B+5,stroke:'#777'},g);lab(g,X(v),B+21,String(v).replace('-','−'),'#999',null,13)});lab(g,X(0),B+42,'valore del codice','#999',null,13);
      if(k>=1)S('path',{d:bell(X,B,SC,0,1,-4,4),fill:'none',stroke:'#fff','stroke-width':1.8,'stroke-dasharray':'5 4',opacity:k===1?t:1},g);
      S('path',{d:bell(X,B,SC,mu,sd,-4,4)+`L${X(4)} ${B}L${X(-4)} ${B}Z`,fill:'rgba(255,255,0,.12)',stroke:C.yellow,'stroke-width':2.6},g);
      if(k===0){lab(g,440,60,'solo ricostruzione:','#ddd','start',14);lab(g,440,82,'σ = '+nf(sd,2),C.yellow,'start',15)}
      if(k>=1){const a=k===1?t:1;arrow(g,X(0),B-10,X(0)+(X(mu)-X(0))*a,B-10,C.orange,2.6);if(a>0.6)lab(g,X(0)-8,B-6,'μ = 1,5',C.orange,'end',13);lab(g,440,60,'μ² = 2,25',C.orange,'start',15)}
      if(k>=2){const a=k===2?t:1,y1=B-SC*gs(mu+0.6,mu,0.6),y0=B-SC*gs(1,0,1);
        S('line',{x1:X(mu),x2:X(mu)+(X(mu+0.6)-X(mu))*a,y1,y2:y1,stroke:C.purple,'stroke-width':3},g);lab(g,X(mu+0.6)+8,y1+5,'σ = 0,6',C.purple,'start',13);
        S('line',{x1:X(0),x2:X(0)-(X(0)-X(-1))*a,y1:y0,y2:y0,stroke:'#fff','stroke-width':3},g);lab(g,X(-1)-18,y0-3,'σ = 1','#fff','end',13);
        lab(g,440,88,'σ² − 1 − log σ² = 0,38',C.purple,'start',14)}
      if(k>=3){S('line',{x1:440,x2:590,y1:102,y2:102,stroke:'#666'},g);lab(g,440,126,'penalità KL = 1,32',C.pink,'start',16)}
      if(k>=4){lab(g,440,158,'una per ogni coordinata','#bbb','start',13);lab(g,440,176,'del codice, sommate','#bbb','start',13)}}}};

/* ---------- 3. il reparameterization trick ---------- */
BUILD.l16_rep={
  tex:R`⟦3|z\;=\;⟧⟦2|\mu\;+\;⟧⟦1|\sigma\cdot⟧⟦0|\Eps⟧⟦0|\,,\qquad\Eps\sim\mathcal N(0,1)⟧`,
  end:'Il caso entra da fuori; il codice è una formula ordinaria di media e deviazione standard.',
  steps:[
    {q:'Estrarre un numero a caso non si può derivare. Si può almeno estrarlo senza usare i parametri della rete?',add:[0],say:'Sì: si estrae un <b>rumore</b> \\(\\Eps\\) dalla gaussiana standard, che ha sempre media 0 e deviazione standard 1 (è quello che dice la scritta \\(\\Eps\\sim\\mathcal N(0,1)\\)). Qui è uscito 0,3.'},
    {q:'L\'encoder però voleva una campana larga \\(\\sigma=2\\).',add:[1],say:'Si <b>moltiplica</b> il rumore per \\(\\sigma\\): la campana si allarga del doppio, e il punto va in 2 · 0,3 = 0,6.'},
    {q:'E la voleva centrata in \\(\\mu=5\\).',add:[2],say:'Si <b>somma</b> \\(\\mu\\): tutta la campana si sposta, e il punto arriva in 5 + 0,6 = 5,6.'},
    {q:'Che cosa abbiamo guadagnato?',add:[3],say:'Il <b>codice</b> \\(z\\) ha la stessa distribuzione di prima, ma ora risponde in modo liscio ai parametri. Sposto \\(\\mu\\) di 1: \\(z\\) si sposta di 1. Sposto \\(\\sigma\\) di 1: \\(z\\) si sposta di 0,3, cioè di \\(\\Eps\\). Il rumore resta fermo.'}],
  scene(host){const sv=Svg(host,600,292,'Il rumore standard e il codice che se ne ricava'),g=S('g',null,sv),X=v=>30+(v+4)*33.75,B1=104,B2=236,eps=0.3;
    const axis=(B,tt)=>{S('line',{x1:X(-4),x2:X(12),y1:B,y2:B,stroke:'#777'},g);for(let v=-4;v<=12;v+=2){S('line',{x1:X(v),x2:X(v),y1:B,y2:B+5,stroke:'#777'},g);lab(g,X(v),B+20,String(v).replace('-','−'),'#999',null,13)}};
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.55,0,1));let mu=0,sd=1,note='';
      if(k===1)sd=1+t;if(k>=2)sd=2;if(k===2)mu=5*t;if(k>=3)mu=5;
      if(k===3){if(fr<0.5){mu=5+Math.sin(Math.PI*clamp(fr/0.45,0,1));note='sposto μ: z si sposta della stessa quantità'}else{sd=2+Math.sin(Math.PI*clamp((fr-0.5)/0.45,0,1));note='sposto σ: z si sposta di ε volte tanto'}}
      const z=mu+sd*eps;axis(B1);lab(g,X(-4),20,'rumore ε, estratto dalla gaussiana standard',C.purple,'start',13);
      S('path',{d:bell(X,B1,150,0,1,-4,12)+`L${X(12)} ${B1}L${X(-4)} ${B1}Z`,fill:'rgba(202,163,232,.14)',stroke:C.purple,'stroke-width':2},g);
      const dy=k===0?B1-70*(1-t):B1;S('circle',{cx:X(eps),cy:dy,r:7,fill:C.purple,stroke:'#000'},g);lab(g,X(2.6),B1-34,'ε = 0,3',C.purple,'start',15);
      if(k>=1){axis(B2);lab(g,X(12),B2+44,'codice z','#bbb','end',13);
        S('path',{d:bell(X,B2,170,mu,sd,-4,12)+`L${X(12)} ${B2}L${X(-4)} ${B2}Z`,fill:'rgba(255,255,0,.10)',stroke:C.yellow,'stroke-width':2.2},g);
        S('line',{x1:X(eps),y1:B1+26,x2:X(z),y2:B2-8,stroke:'#888','stroke-dasharray':'4 4'},g);S('circle',{cx:X(z),cy:B2,r:7,fill:C.yellow,stroke:'#000'},g);
        const sr=Math.round(sd*10)/10,mr=Math.round(mu*10)/10,tx2=k===1?'σ · ε = '+nf(sr,1)+' · 0,3 = '+nf(sr*eps+1e-9,2):'μ + σ · ε = '+nf(mr,1)+' + '+nf(sr,1)+' · 0,3 = '+nf(mr+sr*eps+1e-9,2);lab(g,X(12),B1+44,tx2,C.yellow,'end',14);
        if(note)lab(g,X(-4),B2+44,note,'#fff','start',13)}
      else lab(g,X(4),B2-40,'il codice si calcola qui sotto, a partire da questo numero','#888',null,13)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;

/* ---------- 1. il regret: da «quanto avrei vinto» a gap × tiri ---------- */
BUILD.l17_regret={
  tex:R`⟦2|R_T\;=\;⟧⟦0|T\mu^*⟧⟦1|\;-\;\mathbb E\Big[\sum_{t=1}^{T}r_t\Big]⟧⟦4|\;=\;\sum_{a}⟧⟦3|\Delta_a⟧⟦4|\,\mathbb E[N_a(T)]⟧`,
  end:'Il regret si accumula solo tirando bracci sbagliati: per ciascuno, gap per numero di tiri.',
  steps:[
    {q:'Trenta round, tre macchine con medie 0,7, 0,5 e 0,3. Quanto vincerebbe chi sapesse già qual è la migliore?',add:[0],say:'Giocherebbe sempre quella. In media incassa il <b>numero di round</b> \\(T\\) per la media del braccio migliore, \\(\\mu^*\\): 30 · 0,7 = 21.'},
    {q:'Noi invece abbiamo tirato 15 volte la prima, 10 la seconda e 5 la terza.',add:[1],say:'La <b>ricompensa totale attesa</b>: \\(r_t\\) è la ricompensa del round \\(t\\), la somma le raccoglie tutte, e \\(\\mathbb E\\) indica la media su tutti gli esiti possibili del caso. Qui 15 · 0,7 + 10 · 0,5 + 5 · 0,3 = 17.'},
    {q:'Quanto ci è costato non sapere?',add:[2],say:'La differenza è il <b>regret</b> dopo \\(T\\) round: 21 − 17 = 4.'},
    {q:'Da dove vengono quei 4 punti? Guardiamo un tiro alla volta.',add:[3],say:'Ogni tiro di un braccio \\(a\\) perde in media il suo <b>gap</b> \\(\\Delta_a\\), la distanza dalla media del migliore: 0 per la prima macchina, 0,2 per la seconda, 0,4 per la terza.'},
    {q:'Allora basta contare i tiri di ogni braccio.',add:[4],say:'\\(N_a(T)\\) è il <b>numero di tiri</b> ricevuti dal braccio \\(a\\) nei \\(T\\) round. Gap per tiri, sommati su tutti i bracci: 0 · 15 + 0,2 · 10 + 0,4 · 5 = 4. Lo stesso numero di prima.'}],
  scene(host){const sv=Svg(host,600,268,'Trenta tiri divisi fra tre macchine e quello che si è perso rispetto alla migliore'),g=S('g',null,sv),B=206,U=214,X0=64,W=496/30,MU=[0.7,0.5,0.3],N=[15,10,5],CL=[C.blue,C.orange,C.green],ST=[0,15,25];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),yT=B-0.7*U;
      S('line',{x1:X0-6,x2:X0+496,y1:B,y2:B,stroke:'#777'},g);
      const a0=k===0?t:1;S('rect',{x:X0,y:yT,width:496*a0,height:0.7*U,fill:'rgba(255,255,255,.05)',stroke:'none'},g);S('line',{x1:X0,x2:X0+496*a0,y1:yT,y2:yT,stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 4'},g);
      lab(g,X0-10,yT+5,'0,7','#fff','end',13);lab(g,X0-10,B+5,'0','#999','end',13);lab(g,X0,24,'chi sa tutto: 30 · 0,7 = 21','#fff','start',14);
      if(k===0)lab(g,X0+248,B+22,'30 round, sempre la macchina migliore','#bbb',null,13);
      if(k>=1){const a1=k===1?t:1;for(let i=0;i<30;i++){const j=i<15?0:i<25?1:2,h=MU[j]*U*a1;S('rect',{x:X0+i*W+1.2,y:B-h,width:W-2.4,height:h,fill:CL[j],opacity:.85},g)}
        MU.forEach((m,j)=>{const cx=X0+(ST[j]+N[j]/2)*W;lab(g,cx,B+20,N[j]+' tiri',CL[j],null,14);lab(g,cx,B+39,'media '+nf(m,1),CL[j],null,13)});lab(g,340,24,'noi: 17','#ddd',null,14)}
      if(k>=2){const a2=k===2?t:1;[1,2].forEach(j=>{const x=X0+ST[j]*W,w=N[j]*W,h=(0.7-MU[j])*U;S('rect',{x:x+1,y:yT+1,width:w-2,height:(h-2)*a2,fill:C.pink,opacity:.5},g);
          if(k===3){const a3=t,xa=x+13;S('line',{x1:xa,x2:xa,y1:yT+3,y2:yT+3+(h-6)*a3,stroke:'#fff','stroke-width':2.4},g);if(a3>0.6)lab(g,xa+8,yT+h/2+5,'gap '+nf(0.7-MU[j],1),'#fff','start',13)}
          if(k>=4)lab(g,x+w/2,yT+h/2+5,nf(0.7-MU[j],1)+' · '+N[j]+' = 2','#fff',null,13)});
        lab(g,X0+496,24,k>=4?'regret: 2 + 2 = 4':'regret: 21 − 17 = 4',C.pink,'end',14)}}}};

/* ---------- 2. l'indice UCB: media + margine di incertezza ---------- */
BUILD.l17_ucb={
  tex:R`⟦2|\mathrm{UCB}_t(a)\;=\;⟧⟦0|\hat\mu_t(a)⟧⟦2|\;+\;⟧⟦1|\sqrt{\frac{2\log T}{N_t(a)}}⟧`,
  end:'L\'indice UCB: la media osservata più un margine che si stringe a ogni tiro. Si gioca il braccio con l\'indice più alto.',
  steps:[
    {q:'Due macchine, cento round in tutto. La A è stata provata 50 volte, la B solo 2. Quale sembra migliore?',add:[0],say:'La <b>media osservata</b> \\(\\hat\\mu_t(a)\\) del braccio \\(a\\) prima del round \\(t\\): 0,60 per A, 0,50 per B. A sembra meglio, ma su B abbiamo due tiri soltanto.'},
    {q:'Quanto ci si può fidare di una media fatta su pochi tiri?',add:[1],say:'Lo dice un <b>margine di incertezza</b> che si stringe con il numero di tiri \\(N_t(a)\\) del braccio. Con \\(T=100\\) il numeratore vale 9,21: per A il margine è 0,43, per B è 2,15. Il termine \\(\\log T\\) lo tiene abbastanza largo da contenere quasi certamente il valore vero in tutti i round.'},
    {q:'Dentro la fascia il valore vero può stare ovunque. A quale estremo credere?',add:[2],say:'A quello <b>in alto</b>: è l\'ottimismo davanti all\'incertezza. L\'indice di A è 0,60 + 0,43 = 1,03, quello di B è 0,50 + 2,15 = 2,65. Si gioca B, proprio perché se ne sa poco.'},
    {q:'E se B, provata ancora, non mantiene la promessa?',add:[],say:'Ogni tiro stringe la sua fascia. Dopo 40 tiri, con una media di 0,45, il margine di B è sceso a 0,48 e l\'indice a 0,93: meno di 1,03. Si torna ad A. L\'ottimismo si è corretto da solo, senza sprecare altri tiri.'}],
  scene(host){const sv=Svg(host,600,300,'Media osservata e fascia di incertezza di due macchine'),g=S('g',null,sv),Y=v=>244-v*72,L=2*Math.log(100),XA=210,XB=420;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),u=k===3?ez(clamp(fr/0.8,0,1)):0,nB=k===3?Math.round(2+38*u):2,mB=k===3?0.5-0.05*u:0.5,a1=k===0?0:k===1?t:1;
      S('line',{x1:90,x2:540,y1:Y(0),y2:Y(0),stroke:'#777'},g);[0,1,2].forEach(v=>{S('line',{x1:84,x2:90,y1:Y(v),y2:Y(v),stroke:'#777'},g);lab(g,78,Y(v)+5,String(v),'#999','end',13)});S('line',{x1:90,x2:90,y1:Y(0),y2:Y(2.8),stroke:'#777'},g);
      const D=[[XA,0.6,50,C.blue,'A'],[XB,mB,nB,C.orange,'B']].map(d=>{const mg=Math.sqrt(L/d[2]);return {x:d[0],m:d[1],n:d[2],c:d[3],nm:d[4],mg,ix:d[1]+mg}}),best=D[0].ix>=D[1].ix?0:1;
      D.forEach((d,j)=>{const hi=d.m+d.mg*a1,lo=Math.max(0,d.m-d.mg*a1);
        if(a1>0){S('rect',{x:d.x-15,y:Y(hi),width:30,height:Y(lo)-Y(hi),rx:4,fill:d.c,opacity:.45},g);if(a1>0.7)lab(g,d.x+26,(Y(hi)+Y(d.m))/2+5,'± '+nf(d.mg,2),d.c,'start',14)}
        if(k>=2){const a2=k===2?t:1;S('line',{x1:d.x-24*a2,x2:d.x+24*a2,y1:Y(hi),y2:Y(hi),stroke:C.yellow,'stroke-width':3.5},g);lab(g,d.x-30,Y(hi)+5,nf(d.ix,2),C.yellow,'end',15);
          if(j===best&&(k>2||t>0.6))S('rect',{x:d.x-88,y:26,width:176,height:270,rx:9,fill:'none',stroke:C.yellow,'stroke-width':2},g)}
        S('circle',{cx:d.x,cy:Y(d.m),r:6.5,fill:'#fff',stroke:'#000'},g);if(k<2)lab(g,d.x-24,Y(d.m)+5,nf(d.m,2),'#fff','end',14);
        lab(g,d.x,Y(0)+21,'macchina '+d.nm+': media '+nf(d.m,2),d.c,null,14);lab(g,d.x,Y(0)+40,d.n+' tiri','#ccc',null,13)})}}};

/* ---------- 3. l'aggiornamento di Hedge ---------- */
BUILD.l17_hedge={
  tex:R`⟦3|w_{t+1}(a)\;=\;⟧⟦0|w_t(a)⟧⟦1|\;e⟧^{⟦1|-⟧⟦2|\Et\,⟧⟦1|\cl_t(a)⟧}`,
  end:'Hedge: a ogni round il peso di un braccio si riduce tanto più quanto il braccio ha perso.',
  steps:[
    {q:'Due macchine e un peso per ciascuna, all\'inizio 1 e 1. Con che probabilità si gioca ognuna?',add:[0],say:'\\(w_t(a)\\) è il <b>peso</b> del braccio \\(a\\) al round \\(t\\). Si gioca ogni braccio in proporzione al suo peso: qui 1 / (1 + 1), cioè 50% a testa.'},
    {q:'Arrivano le perdite del round: la macchina 1 ha perso 1, la 2 ha perso 0. Chi ha perso deve contare di meno.',add:[1],say:'Si <b>moltiplica</b> il peso per \\(e\\) elevato a meno la perdita \\(\\cl_t(a)\\): con perdita 0 il fattore è 1 e il peso resta intatto; con perdita 1 è 0,37. Moltiplicare, e non sottrarre, tiene i pesi sempre positivi.'},
    {q:'Un solo round sfortunato, e la macchina 1 ha perso quasi due terzi del peso. Non è troppo?',add:[2],say:'La reazione si dosa con il <b>tasso di apprendimento</b> \\(\\Et\\), che moltiplica la perdita. Con \\(\\Et=0{,}5\\) il fattore diventa \\(e^{-0{,}5}\\), cioè 0,61: una punizione più leggera.'},
    {q:'Che cosa cambia al prossimo round?',add:[3],say:'I <b>nuovi pesi</b> sono 0,61 e 1. La macchina 1 verrà giocata con probabilità 0,61 / 1,61, cioè il 38%; la 2 con il 62%. Nessuna delle due è esclusa: l\'avversario non può prevedere la scelta.'}],
  scene(host){const sv=Svg(host,600,282,'I pesi di due macchine prima e dopo le perdite, e le probabilità di gioco'),g=S('g',null,sv),B=176,U=110,XS=[150,390],CL=[C.blue,C.green];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),e1=Math.exp(-1),e5=Math.exp(-0.5),w1=k===0?1:k===1?1-(1-e1)*t:k===2?e1+(e5-e1)*t:e5,W=[w1,1],p1=k<3?0.5:0.5+(e5/(1+e5)-0.5)*t;
      S('line',{x1:60,x2:540,y1:B,y2:B,stroke:'#777'},g);
      XS.forEach((x,j)=>{S('rect',{x:x-32,y:B-U,width:64,height:U,fill:'none',stroke:'#666','stroke-dasharray':'4 4'},g);S('rect',{x:x-32,y:B-W[j]*U,width:64,height:W[j]*U,fill:CL[j],opacity:.85},g);
        lab(g,x,B+20,'macchina '+(j+1),CL[j],null,14);lab(g,x-40,B-W[j]*U+5,'peso '+nf(W[j],2),'#fff','end',14);
        if(k>=1)lab(g,x,30,'perdita '+(j?'0':'1'),j?'#bbb':C.red,null,15)});
      if(k===1){lab(g,XS[0]+42,B-U/2,'× 0,37','#fff','start',15);lab(g,XS[0]+42,B-U/2+19,'(e alla −1)','#bbb','start',13)}
      if(k>=2){lab(g,XS[0]+42,B-U/2,'× 0,61','#fff','start',15);lab(g,XS[0]+42,B-U/2+19,'(e alla −0,5)','#bbb','start',13)}
      if(k>=1)lab(g,XS[1]+42,B-U/2,'× 1','#fff','start',15);
      const SX=60,SW=480,SY=234;lab(g,300,SY-9,k<3?'probabilità di gioco in questo round':'probabilità di gioco al prossimo round','#ccc',null,13);
      S('rect',{x:SX,y:SY,width:SW*p1,height:28,fill:CL[0],opacity:.85},g);S('rect',{x:SX+SW*p1,y:SY,width:SW*(1-p1),height:28,fill:CL[1],opacity:.85},g);
      lab(g,SX+SW*p1/2,SY+19,'macchina 1: '+Math.round(p1*100)+'%','#000',null,14);lab(g,SX+SW*p1+SW*(1-p1)/2,SY+19,'macchina 2: '+Math.round((1-p1)*100)+'%','#000',null,14)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {K,S,H,C,nf,kn,clamp,rng,Plot,arrow,Svg}=M,{lab,plane,ez,tx}=M.bld,BUILD=M.BUILD,R=String.raw;
const vcol=v=>v>=0?`rgba(131,193,103,${clamp(0.04+0.8*v,0,0.9)})`:`rgba(252,98,85,${clamp(-0.85*v,0,0.9)})`;
const DX=[0,1,0,-1],DY=[-1,0,1,0];

/* ---------- 1. il ritorno scontato ---------- */
BUILD.l18_ret={
  tex:R`⟦3|G\;=\;⟧⟦0|r_0⟧⟦1|\;+\;\Gk\,r_1⟧⟦2|\;+\;\Gk^2r_2⟧⟦3|\;+\;\dots⟧⟦4|\;=\;\sum_{t\ge0}\Gk^t\,r_t⟧`,
  end:'Il ritorno: tutte le ricompense che verranno, ciascuna scontata una volta per ogni passo di attesa.',
  steps:[
    {q:'Lo studente decide di studiare tre volte di fila: −2, −2, +10. Quanto vale questo piano? Cominciamo dalla prima mossa.',add:[0],say:'La <b>ricompensa immediata</b>, \\(r_0\\): −2. Chi guardasse solo questa non studierebbe mai.'},
    {q:'La ricompensa della mossa dopo conta quanto quella di adesso?',add:[1],say:'Un po\' meno: la si moltiplica per il <b>fattore di sconto</b> \\(\\Gk\\), un numero fra 0 e 1. Con \\(\\Gk=0{,}9\\) il secondo −2 pesa 0,9 · (−2) = −1,8.'},
    {q:'E quella che arriva due mosse dopo?',add:[2],say:'Si sconta <b>due volte</b>: 0,9 · 0,9 = 0,81. Il +10 finale conta 8,1.'},
    {q:'Ora si può dare un voto al piano intero.',add:[3],say:'Il <b>ritorno</b> \\(G\\) è la somma delle ricompense scontate: −2 − 1,8 + 8,1 = 4,3. I puntini dicono che, se la storia continua, ogni mossa in più porta uno sconto in più.'},
    {q:'Si può scrivere in modo più compatto?',add:[4],say:'Sì: la ricompensa \\(r_t\\) ricevuta dopo \\(t\\) passi pesa \\(\\Gk^t\\), e si sommano tutte. Per \\(t=0\\) il peso è 1: la ricompensa immediata conta per intero.'}],
  scene(host){const sv=Svg(host,600,262,'Tre ricompense e il loro valore dopo lo sconto'),g=S('g',null,sv),B=168,U=12.5,XS=[130,290,450],RW=[-2,-2,10],WT=[1,0.9,0.81],WL=['1','0,9','0,81'],DL=['−2','−1,8','+8,1'];
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1));S('line',{x1:60,x2:560,y1:B,y2:B,stroke:'#777'},g);
      RW.forEach((v,i)=>{const x=XS[i],bar=(x0,val,col,op)=>S('rect',{x:x0,y:B-Math.max(0,val)*U,width:38,height:Math.abs(val)*U,fill:col,opacity:op},g);
        bar(x-42,v,'#888',1);lab(g,x-23,v>0?B-v*U-8:B-8,String(v).replace('-','−').replace(/^(\d)/,'+$1'),'#ccc',null,14);
        if(k>=i){const a=k===i?t:1,d=v*(1+(WT[i]-1)*a);bar(x+4,d,C.yellow,.95);if(a>0.5)lab(g,x+23,v>0?B-d*U-8:B-8,DL[i],C.yellow,null,14)}
        lab(g,x,B+46,'mossa '+(i+1),'#ccc',null,14);if(k>=i)lab(g,x,B+66,'peso '+WL[i],C.orange,null,14)});
      if(k>=3){lab(g,560,B+46,'…','#aaa','end',20);lab(g,60,26,'G = −2 − 1,8 + 8,1 = 4,3',C.yellow,'start',16)}
      else lab(g,60,26,'grigio: ricompensa · giallo: ricompensa scontata','#aaa','start',13)}}};

/* ---------- 2. l'equazione di Bellman su una casella ---------- */
BUILD.l18_bell={
  tex:R`⟦4|V^*(s)\;=\;⟧⟦3|\max_a\Big(⟧⟦0|r(s,a)⟧⟦1|\;+\;⟧⟦2|\Gk⟧⟦1|\sum_{s'}p(s,a,s')\,V^*(s')⟧⟦3|\Big)⟧`,
  end:'L\'equazione di Bellman: il valore di uno stato è il meglio, fra le azioni, di «ricompensa subito più valore scontato di dove arrivo».',
  steps:[
    {q:'Sei nella casella accanto alla buca, e le altre caselle hanno già il loro valore. Provi una mossa: su. Che cosa ricevi subito?',add:[0],say:'La <b>ricompensa immediata</b> \\(r(s,a)\\) dell\'azione \\(a\\) fatta nello stato \\(s\\). Salendo non si entra in nessuna casella con un premio: 0.'},
    {q:'Però la mossa ti porta in un\'altra casella, e da lì la partita continua.',add:[1],say:'Si aggiunge il <b>valore dello stato di arrivo</b>, \\(V^*(s\')\\): salendo arrivi nella casella che vale 1,00. La somma pesata con le probabilità \\(p\\) serve quando l\'esito è incerto: fa la media sugli arrivi possibili. Qui l\'arrivo è certo e resta un termine solo.'},
    {q:'Quel valore, però, lo incasserai una mossa più tardi.',add:[2],say:'Quindi lo si <b>sconta</b>: 0,9 · 1,00 = 0,90. La mossa «su» vale in tutto 0 + 0,90 = 0,90.'},
    {q:'E le altre tre mosse?',add:[3],say:'Stesso conto: destra finisce nella buca, −1; giù vale 0,9 · 0,81 = 0,73; a sinistra c\'è il muro, si resta fermi e la mossa vale 0,9 volte questa stessa casella. Chi gioca al meglio sceglie la <b>migliore</b>: il massimo fra le azioni.'},
    {q:'Quanto vale, allora, questa casella?',add:[4],say:'Il massimo, 0,90: è il suo <b>valore ottimo</b> \\(V^*(s)\\). La mossa a sinistra vale quindi 0,9 · 0,90 = 0,81. La stessa equazione vale in ogni casella: ognuna è definita a partire dalle vicine.'}],
  scene(host){const sv=Svg(host,600,276,'Il mondo a griglia e il confronto fra le quattro mosse da una casella'),CS=80,GX=14,GY=18;
    if(!M.rl){lab(sv,300,140,'Figura non disponibile.');return ()=>{}}
    const step=M.rl.step,TERM={3:1,7:-1,0:0.2},WALL=5,free=s=>s!==WALL&&!(s in TERM),X=s=>GX+(s%4)*CS,Y=s=>GY+Math.floor(s/4)*CS;
    let V=new Float64Array(12);for(let n=0;n<60;n++){const N=new Float64Array(12);for(let s=0;s<12;s++){if(!free(s))continue;let b=-1e9;for(let a=0;a<4;a++){const q=step(s,a);b=Math.max(b,q[1]+0.9*V[q[0]])}N[s]=b}V=N}
    const sel=6,bg=S('g',null,sv),g=S('g',null,sv),cx=X(sel)+CS/2,cy=Y(sel)+CS/2,AN=['su','destra','giù','sinistra'];
    for(let s=0;s<12;s++){S('rect',{x:X(s)+2,y:Y(s)+2,width:CS-4,height:CS-4,rx:5,fill:s===WALL?'#3a3a3a':s in TERM?vcol(TERM[s]*(TERM[s]>0&&TERM[s]<1?2.2:1)):s===sel?'#101010':vcol(V[s]*0.6),stroke:'#555'},bg);
      if(s in TERM)lab(bg,X(s)+CS/2,Y(s)+CS/2+7,(TERM[s]>0?'+':'−')+nf(Math.abs(TERM[s]),TERM[s]%1?1:0),'#fff',null,20).style.fontWeight='600';
      else if(s===WALL)lab(bg,X(s)+CS/2,Y(s)+CS/2+5,'muro','#aaa',null,14);else if(s!==sel)lab(bg,X(s)+CS/2,Y(s)+CS/2+6,nf(V[s],2),'#fff',null,16)}
    const Q=[0,1,2,3].map(a=>{const q=step(sel,a);return {r:q[1],to:q[0],v:V[q[0]],tot:q[1]+0.9*V[q[0]]}}),PX=352,sg=v=>v<0?'−'+nf(-v,0):nf(v,0);
    return (k,fr,fin)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),nOther=k<3?0:k===3?Math.min(3,Math.floor(fr*3.6)+1):3;
      S('rect',{x:X(sel)+2,y:Y(sel)+2,width:CS-4,height:CS-4,rx:5,fill:k>=4?vcol(V[sel]*0.6):'none',stroke:C.yellow,'stroke-width':3},g);
      lab(g,cx,cy+6,k>=4?nf(V[sel],2):'?',k>=4?C.yellow:'#fff',null,k>=4?17:20).style.fontWeight='600';
      const ar=(a,col,len)=>arrow(g,cx+DX[a]*20,cy+DY[a]*20-(DY[a]?0:-18),cx+DX[a]*(20+len),cy+DY[a]*(20+len)-(DY[a]?0:-18),col,2.6);
      ar(0,C.yellow,k===0?34*t:34);
      if(k===1||k===2)S('rect',{x:X(2)+2,y:Y(2)+2,width:CS-4,height:CS-4,rx:5,fill:'none',stroke:C.teal,'stroke-width':3,opacity:k===1?t:1},g);
      for(let i=1;i<=nOther;i++)ar(i,k>=4?'#777':'#ccc',30);
      const line=(i,txt,col,w)=>{const e=lab(g,PX,62+i*30,txt,col,'start',14);if(w)e.style.fontWeight='600';return e};
      const up=k===0?'su: 0':k===1?'su: 0 + … · 1,00':'su: 0 + 0,9 · 1,00 = 0,90';line(0,up,C.yellow,k>=4);
      for(let i=1;i<=nOther;i++){const q=Q[i],self=q.to===sel;line(i,AN[i]+': '+sg(q.r)+' + 0,9 · '+(self&&k<4?'?':nf(q.v,2))+(self&&k<4?'':' = '+nf(q.tot,2)),k>=4?'#999':'#ddd')}
      lab(g,PX,34,'quanto vale ogni mossa','#aaa','start',13);
      if(k>=3&&(k>3||fr>0.85)){S('line',{x1:PX,x2:586,y1:62+3.55*30,y2:62+3.55*30,stroke:'#666'},g);lab(g,PX,62+4.5*30,'il massimo: 0,90 (su)',C.yellow,'start',15).style.fontWeight='600'}}}};

/* ---------- 3. la regola di Q-learning ---------- */
BUILD.l18_q={
  tex:R`⟦3|Q(s,a)\;\leftarrow\;⟧⟦2|(1-\Et)\,⟧⟦0|Q(s,a)⟧⟦2|\;+\;\Et⟧⟦1|\Big(r+\Gk\max_{a'}Q(s',a')\Big)⟧`,
  end:'Q-learning: a ogni mossa il vecchio valore si sposta verso il bersaglio di una frazione pari al tasso di apprendimento.',
  steps:[
    {q:'Un momento qualsiasi dell\'allenamento. L\'agente è nella casella accanto alla buca e sta per salire. Che cosa dice oggi la tabella di questa mossa?',add:[0],say:'Il <b>vecchio valore</b> \\(Q(s,a)\\): la stima corrente di quanto rende fare l\'azione \\(a\\) nello stato \\(s\\). Per «su» da questa casella, supponiamo 0,40.'},
    {q:'La mossa è fatta: ricompensa 0, e l\'agente è in una casella nuova. Che cosa suggerisce questa esperienza?',add:[1],say:'Un <b>bersaglio</b>: la ricompensa \\(r\\) appena ricevuta, più lo sconto \\(\\Gk\\) per il valore della mossa migliore nello stato di arrivo \\(s\'\\), letto dalla tabella. Qui la migliore è «destra», 0,80: il bersaglio è 0 + 0,9 · 0,80 = 0,72.'},
    {q:'Il bersaglio viene da una sola esperienza e da stime ancora incerte. Ci si può fidare del tutto?',add:[2],say:'No: ci si sposta verso il bersaglio solo di una frazione \\(\\Et\\), il <b>tasso di apprendimento</b>. Con \\(\\Et=0{,}5\\) si tiene metà del vecchio valore e metà del bersaglio: 0,5 · 0,40 + 0,5 · 0,72 = 0,56.'},
    {q:'Che cosa cambia nella tabella?',add:[3],say:'La freccia \\(\\leftarrow\\) significa «diventa»: il numero per «su» in quella casella passa da 0,40 a 0,56. Tutti gli altri restano come sono. Una mossa, un numero aggiornato.'}],
  scene(host){const sv=Svg(host,600,272,'Due caselle della tabella Q, una mossa e l\'aggiornamento del valore'),bg=S('g',null,sv),g=S('g',null,sv),CS=116,GX=14,GY=20,cell=(c,r)=>[GX+c*CS,GY+r*CS];
    const QA=[0,0.8,0.2,0.1],QB=[0.4,-0.5,0,0],wedge=(par,x,y,a,v,st)=>{const d=CS-6,x0=x+3,y0=y+3,mx=x0+d/2,my=y0+d/2,P=[[x0,y0,x0+d,y0],[x0+d,y0,x0+d,y0+d],[x0+d,y0+d,x0,y0+d],[x0,y0+d,x0,y0]][a];
      return S('path',{d:`M${mx} ${my}L${P[0]} ${P[1]}L${P[2]} ${P[3]}z`,fill:Math.abs(v)<1e-4?'#101010':vcol(v),stroke:st||'#333','stroke-width':st?3:1},par)};
    [[1,0,1,'+1'],[1,1,-1,'−1']].forEach(o=>{const p=cell(o[0],o[1]);S('rect',{x:p[0]+2,y:p[1]+2,width:CS-4,height:CS-4,rx:6,fill:vcol(o[2]),stroke:'#555'},bg);lab(bg,p[0]+CS/2,p[1]+CS/2+9,o[3],'#fff',null,26).style.fontWeight='600'});
    const pA=cell(0,0),pB=cell(0,1),num=(p,a,v,col,w)=>{const e=lab(g,p[0]+CS/2+DX[a]*36,p[1]+CS/2+DY[a]*36+5,nf(v,2),col||'#eee',null,14);if(w)e.style.fontWeight='700'};
    const LX=v=>312+v*262,LY=150;
    return (k,fr)=>{g.textContent='';const t=ez(clamp(fr/0.5,0,1)),nv=k<3?0.4:0.4+0.16*t;
      QA.forEach((v,a)=>wedge(g,pA[0],pA[1],a,v));QB.forEach((v,a)=>wedge(g,pB[0],pB[1],a,a===0?nv:v));
      if(k===0||k===3)wedge(g,pB[0],pB[1],0,nv,k===3?C.yellow:'#fff');if(k>=1&&k<3)wedge(g,pA[0],pA[1],1,0.8,C.teal);
      QA.forEach((v,a)=>num(pA,a,v,k>=1&&k<3&&a===1?'#fff':'#ddd',k>=1&&k<3&&a===1));QB.forEach((v,a)=>num(pB,a,a===0?nv:v,a===0&&k===3?C.yellow:'#ddd',a===0&&(k===0||k===3)));
      const m=k===0?0:k===1?t:1,ax=pB[0]+CS/2,ay=pB[1]+CS/2-(CS)*m;S('circle',{cx:ax,cy:ay,r:11,fill:C.yellow,stroke:'#000','stroke-width':2},g);
      S('line',{x1:LX(0),x2:LX(1),y1:LY,y2:LY,stroke:'#777'},g);[0,0.5,1].forEach(v=>{S('line',{x1:LX(v),x2:LX(v),y1:LY,y2:LY+6,stroke:'#777'},g);lab(g,LX(v),LY+22,nf(v,1),'#888',null,13)});
      S('circle',{cx:LX(0.4),cy:LY,r:6.5,fill:'#fff',stroke:'#000'},g);lab(g,LX(0.4)+4,LY-16,'vecchio 0,40','#fff','end',14);
      if(k>=1){S('circle',{cx:LX(0.72),cy:LY,r:6.5,fill:C.teal,stroke:'#000',opacity:k===1?t:1},g);lab(g,LX(0.72)-4,LY-16,'bersaglio 0,72',C.teal,'start',14);lab(g,LX(0.5),50,'bersaglio = 0 + 0,9 · 0,80 = 0,72',C.teal,null,14)}
      if(k>=2){const a=k===2?t:1,x=LX(0.4+0.16*a);arrow(g,LX(0.4)+8,LY,Math.max(LX(0.4)+9,x-8),LY,C.yellow,2.6);S('circle',{cx:x,cy:LY,r:7,fill:C.yellow,stroke:'#000'},g);
        if(a>0.7){lab(g,LX(0.56),LY+46,'nuovo 0,56',C.yellow,null,14);lab(g,LX(0.5),LY+84,'0,5 · 0,40 + 0,5 · 0,72 = 0,56',C.yellow,null,14)}}
      else lab(g,LX(0.5),LY+84,'la riga dei valori possibili per questa mossa','#888',null,13)}}};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,polyFit,mse,Svg,arrow,cap}=M;

const F5=x=>0.9*Math.sin(2*Math.PI*x)+1.3*x,SD=0.3;
const DS=(function(){const r=rng(52),xs=[],ys=[];for(let i=0;i<30;i++){const x=(i+r())/30;xs.push(x);ys.push(F5(x)+SD*r.n())}
  const xf=[],yf=[];for(let i=0;i<4000;i++){const x=r();xf.push(x);yf.push(F5(x)+SD*r.n())}return {xs,ys,xf,yf}})();
const DEG=[1,2,3,4,5,6,7,8];
function shuffle(n,r){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const pick=(a,idx)=>idx.map(i=>a[i]);
function scat(host,o){const p=Plot(host,Object.assign({W:420,H:330,m:[34,10,10,42],xr:[0,1],yr:[-1.2,2.8],label:'Dati e polinomio adattato'},o||{}));p.axes([0,0.5,1],[-1,0,1,2],'x','y');return p}
function bars(host,o){const p=Plot(host,Object.assign({W:420,H:330,m:[44,10,10,42],xr:[0.4,8.6],yr:[0,0.5],label:'Errore per ogni grado'},o||{}));p.axes(DEG,[0,0.1,0.2,0.3,0.4,0.5],'grado del polinomio');return p}

FIG.trainonly=function(st){
  let d=3;slider(st,'Grado del polinomio',1,10,1,d,v=>v,v=>{d=v;draw()});
  const p=Plot(st,{W:600,H:380,m:[40,10,12,42],xr:[0,1],yr:[-1.2,2.8],label:'Trenta punti e polinomio adattato'});p.axes([0,0.2,0.4,0.6,0.8,1],[-1,0,1,2],'x','y');
  const fp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g);DS.xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(DS.ys[i]),r:4.2,fill:'#fff'},p.g));
  const res=out(st);res.style.minHeight='1.7em';
  function draw(){const fn=polyFit(DS.xs,DS.ys,d,0,1);fp.setAttribute('d',p.curve(fn,0,1,400));res.innerHTML=`Grado ${d}: errore quadratico medio sui trenta punti ${nf(mse(fn,DS.xs,DS.ys),3)}.`}
  draw();
};

FIG.gap=function(st){
  legend(st,[[C.lg,'errore di training'],[C.red,'errore vero']]);
  const p=bars(st,{W:600,H:320,m:[48,10,12,42]}),res=out(st);res.style.minHeight='1.7em';let best=0,bv=9;
  DEG.forEach(d=>{const fn=polyFit(DS.xs,DS.ys,d,0,1),a=mse(fn,DS.xs,DS.ys),b=mse(fn,DS.xf,DS.yf);if(b<bv){bv=b;best=d}
    S('rect',{x:p.sx(d)-21,y:p.sy(Math.min(a,.5)),width:19,height:p.sy(0)-p.sy(Math.min(a,.5)),fill:C.lg},p.g);S('rect',{x:p.sx(d)+2,y:p.sy(Math.min(b,.5)),width:19,height:p.sy(0)-p.sy(Math.min(b,.5)),fill:C.red},p.g)});
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(SD*SD),y2:p.sy(SD*SD),stroke:C.purple,'stroke-dasharray':'5 4'},p.g);
  res.innerHTML=`L'errore di training indicherebbe il grado 8; l'errore vero è minimo al grado ${best}. La linea viola è il rumore dei dati, sotto cui nessun modello può scendere.`;
};

FIG.holdsel=function(st){
  let seed=1;btn(st,'Rimescola',()=>{seed++;draw()});
  const duo=H('div',{class:'duo'},st),p=scat(duo),q=bars(duo,{label:'Errore sui punti messi da parte, per ogni grado'});
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);
  function draw(){g.textContent='';gq.textContent='';const idx=shuffle(30,rng(seed*7+3)),te=idx.slice(0,6),tr=idx.slice(6),xt=pick(DS.xs,tr),yt=pick(DS.ys,tr),xe=pick(DS.xs,te),ye=pick(DS.ys,te);
    const er=DEG.map(d=>mse(polyFit(xt,yt,d,0,1),xe,ye));let b=0;er.forEach((v,i)=>{if(v<er[b])b=i});
    S('path',{d:p.curve(polyFit(xt,yt,DEG[b],0,1),0,1,300),fill:'none',stroke:C.yellow,'stroke-width':2.5},g);
    tr.forEach(i=>S('circle',{cx:p.sx(DS.xs[i]),cy:p.sy(DS.ys[i]),r:4,fill:'#fff'},g));te.forEach(i=>S('circle',{cx:p.sx(DS.xs[i]),cy:p.sy(DS.ys[i]),r:5.5,fill:C.orange,stroke:'#000'},g));
    er.forEach((v,i)=>S('rect',{x:q.sx(DEG[i])-15,y:q.sy(Math.min(v,.5)),width:30,height:q.sy(0)-q.sy(Math.min(v,.5)),fill:C.orange,opacity:i===b?1:.4},gq));
    res.innerHTML=`Con questa suddivisione vince il grado ${DEG[b]}: errore ${nf(er[b],3)} sui 6 punti messi da parte.`}
  draw();
};

FIG.splitprice=function(st){
  const r=rng(77),N=40,xs=[],ys=[];for(let i=0;i<N;i++){const x=(i+r())/N;xs.push(x);ys.push(F5(x)+SD*r.n())}
  const FR=[0.1,0.2,0.3,0.4,0.5,0.6,0.7],xf=DS.xf.slice(0,500),yf=DS.yf.slice(0,500),R=FR.map(fr=>{const nt=Math.round(N*fr),est=[];let tru=0;
    for(let k=0;k<300;k++){const idx=shuffle(N,r),te=idx.slice(0,nt),tr=idx.slice(nt),fn=polyFit(pick(xs,tr),pick(ys,tr),3,0,1);est.push(mse(fn,pick(xs,te),pick(ys,te)));tru+=mse(fn,xf,yf)}
    est.sort((a,b)=>a-b);return {lo:est[30],hi:est[270],tru:tru/300}});
  legend(st,[['rgba(255,134,47,.5)','dove cade la stima (8 volte su 10)','dot'],[C.red,'errore vero del modello']]);
  const p=Plot(st,{W:600,H:320,m:[48,10,12,42],xr:[0.05,0.75],yr:[0,0.4],label:'Stima dell\'errore ed errore vero al variare della quota di dati messa da parte'});
  p.axes(FR,[0,0.1,0.2,0.3,0.4],'quota di dati messa da parte per il test','errore',v=>Math.round(v*100)+'%');
  S('path',{d:p.poly(R.map((q,i)=>[FR[i],q.hi]).concat(R.map((q,i)=>[FR[i],q.lo]).reverse()))+'Z',fill:'rgba(255,134,47,.3)',stroke:'none'},p.g);
  S('path',{d:p.poly(R.map((q,i)=>[FR[i],q.tru])),fill:'none',stroke:C.red,'stroke-width':2.5},p.g);R.forEach((q,i)=>S('circle',{cx:p.sx(FR[i]),cy:p.sy(q.tru),r:4,fill:C.red},p.g));
};

FIG.hoeff=function(st){
  let ln=2.3,dl=0.05;const pt=0.2,T=2000;
  slider(st,'Punti nel test set '+K('N_{te}'),1.7,3.3,0.05,ln,v=>big(Math.round(Math.pow(10,v))),v=>{ln=v;draw()});
  slider(st,'Probabilità tollerata '+K('\\delta'),0.01,0.3,0.01,dl,v=>nf(v,2),v=>{dl=v;draw()});
  const p=Plot(st,{W:600,H:300,m:[14,10,14,42],xr:[0,0.4],yr:[0,1],label:'Istogramma degli errori di test su molti test set'});p.axes([0,0.1,0.2,0.3,0.4],null,'errore di test');
  const g=S('g',null,p.g),res=out(st);
  function draw(){g.textContent='';const N=Math.round(Math.pow(10,ln)),eps=Math.sqrt(Math.log(2/dl)/(2*N)),r=rng(N*13+7),stp=Math.max(1,Math.round(N*0.4/50)),B=Math.ceil(N*0.4/stp),h=new Array(B).fill(0);let outn=0;const sd=Math.sqrt(pt*(1-pt)/N);
    for(let t=0;t<T;t++){let e;if(N<=400){let c=0;for(let i=0;i<N;i++)if(r()<pt)c++;e=c/N}else e=Math.round((pt+sd*r.n())*N)/N;if(Math.abs(e-pt)>eps)outn++;const b=Math.floor(Math.round(e*N)/stp);if(b>=0&&b<B)h[b]++}
    const mx=Math.max(...h);
    S('rect',{x:p.sx(Math.max(0,pt-eps)),y:p.ay,width:p.sx(Math.min(.4,pt+eps))-p.sx(Math.max(0,pt-eps)),height:p.ah,fill:'rgba(109,185,244,.18)'},g);
    const bwd=p.sx(stp/N)-p.sx(0);h.forEach((c,b)=>{if(c)S('rect',{x:p.sx(b*stp/N)+.5,y:p.sy(c/mx*0.95),width:Math.max(1,bwd-1),height:p.sy(0)-p.sy(c/mx*0.95),fill:C.lg},g)});
    S('line',{x1:p.sx(pt),x2:p.sx(pt),y1:p.ay,y2:p.ay+p.ah,stroke:C.red,'stroke-width':2},g);
    res.innerHTML=`Con ${K('N_{te}='+N)} e ${K('\\delta='+kn(dl,2))} la fascia è ${K('0{,}20\\pm'+kn(eps,3))}.<br>Su ${big(T)} test set, ne cadono fuori ${outn} (${nf(outn/T*100,1)}%): la formula garantiva al più il ${nf(dl*100,0)}%.`}
  draw();
};

FIG.logp=function(st){
  let ln=2.7;slider(st,'Punti nel test set',2,3.7,0.05,ln,v=>big(Math.round(Math.pow(10,v))),v=>{ln=v;draw()});
  const p=Plot(st,{W:600,H:280,m:[48,10,14,42],xr:[0,4],yr:[0,0.5],label:'Penalità al crescere del numero di modelli confrontati'});
  p.axes([0,1,2,3,4],[0,0.1,0.2,0.3,0.4,0.5],'numero di modelli confrontati p','penalità',v=>big(Math.pow(10,v)));
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const N=Math.round(Math.pow(10,ln)),f=lp=>2*Math.sqrt(Math.log(2*Math.pow(10,lp)/0.05)/(2*N));
    S('path',{d:p.curve(f,0,4),fill:'none',stroke:C.pink,'stroke-width':2.5},g);[1,3].forEach(l=>S('circle',{cx:p.sx(l),cy:p.sy(f(l)),r:5,fill:C.pink},g));
    res.innerHTML=`Con ${big(N)} punti di test e ${K('\\delta=0{,}05')} (loss fra 0 e 1): penalità ${nf(f(1),3)} per 10 modelli, ${nf(f(3),3)} per 1000.`}
  draw();
};

FIG.kfold=function(st){
  const k=5,idx=shuffle(30,rng(11)),folds=Array.from({length:k},(_,j)=>idx.slice(j*6,j*6+6)),R=folds.map(te=>{const tr=idx.filter(i=>!te.includes(i)),fn=polyFit(pick(DS.xs,tr),pick(DS.ys,tr),3,0,1);return {fn,err:mse(fn,pick(DS.xs,te),pick(DS.ys,te))}});
  const mean=R.reduce((s,q)=>s+q.err,0)/k;
  const duo=H('div',{class:'duo'},st),p=scat(duo),q=Plot(duo,{W:420,H:330,m:[44,10,10,42],xr:[0.4,5.6],yr:[0,0.3],label:'Errore di ciascun fold'});q.axes([1,2,3,4,5],[0,0.1,0.2,0.3],'giro','errore sul fold messo da parte');
  const g=S('g',null,p.g),gq=S('g',null,q.g),res=out(st);
  function draw(pf){g.textContent='';gq.textContent='';const j=Math.min(k-1,Math.floor(pf)),fr=pf-j,done=pf>=k;
    if(!done)S('path',{d:p.curve(R[j].fn,0,1,300),fill:'none',stroke:C.yellow,'stroke-width':2.5,opacity:clamp(fr/0.25,0,1)},g);
    idx.forEach(i=>{const inF=!done&&folds[j].includes(i);S('circle',{cx:p.sx(DS.xs[i]),cy:p.sy(DS.ys[i]),r:inF?5.5:4,fill:inF?C.orange:'#fff',stroke:'#000'},g)});
    R.forEach((r2,i)=>{const h=i<j||done?1:i===j?clamp((fr-0.3)/0.4,0,1):0;if(h>0)S('rect',{x:q.sx(i+1)-20,y:q.sy(r2.err*h),width:40,height:q.sy(0)-q.sy(r2.err*h),fill:C.orange,opacity:i===j&&!done?1:.55},gq)});
    if(done)S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(mean),y2:q.sy(mean),stroke:'#fff','stroke-width':2,'stroke-dasharray':'6 4'},gq);
    res.innerHTML=done?`Cinque giri, cinque errori. La loro media, ${nf(mean,3)}, è la stima dell'errore del grado 3. Ogni punto è stato usato per il test una volta sola.`:`Giro ${j+1} di ${k}: i 6 punti arancioni sono messi da parte, il polinomio è adattato sugli altri 24.`+(fr>0.5?` Errore sui 6 punti: ${nf(R[j].err,3)}.`:'')}
  player(st,k+0.6,0.4,draw);
};

FIG.cvsel=function(st){
  let seed=1;btn(st,'Altri venti rimescolamenti',()=>{seed++;draw()});
  const duo=H('div',{class:'duo'},st),A=H('div',null,duo),B=H('div',null,duo),p=bars(A,{label:'Errore stimato con un hold-out'}),q=bars(B,{label:'Errore stimato con la 5-fold'});
  const ca=cap(A,''),cb=cap(B,''),g=S('g',null,p.g),gq=S('g',null,q.g);
  function draw(){g.textContent='';gq.textContent='';const r=rng(seed*91),ch=[[],[]];
    for(let t=0;t<20;t++){const idx=shuffle(30,r);
      const ho=DEG.map(d=>{const te=idx.slice(0,6),tr=idx.slice(6);return mse(polyFit(pick(DS.xs,tr),pick(DS.ys,tr),d,0,1),pick(DS.xs,te),pick(DS.ys,te))});
      const cv=DEG.map(d=>{let s=0;for(let j=0;j<5;j++){const te=idx.slice(j*6,j*6+6),tr=idx.filter(i=>!te.includes(i));s+=mse(polyFit(pick(DS.xs,tr),pick(DS.ys,tr),d,0,1),pick(DS.xs,te),pick(DS.ys,te))}return s/5});
      [[ho,g,p,0],[cv,gq,q,1]].forEach(a=>{S('path',{d:a[2].poly(a[0].map((v,i)=>[DEG[i],Math.min(v,2)])),fill:'none',stroke:C.orange,'stroke-width':1.2,opacity:.55},a[1]);let b=0;a[0].forEach((v,i)=>{if(v<a[0][b])b=i});ch[a[3]].push(DEG[b])})}
    const cnt=a=>{const m={};a.forEach(v=>m[v]=(m[v]||0)+1);return Object.keys(m).sort((x,y)=>m[y]-m[x]).map(k2=>`grado ${k2}: ${m[k2]} volte`).join(' · ')};
    ca.innerHTML='<b>Un solo hold-out (24 + 6)</b><br>scelte: '+cnt(ch[0]);cb.innerHTML='<b>Cross-validation a 5 fold</b><br>scelte: '+cnt(ch[1])}
  draw();
};

FIG.strat=function(st){
  let seed=2;btn(st,'Rimescola',()=>{seed++;draw()});
  const duo=H('div',{class:'duo'},st),A=H('div',null,duo),B=H('div',null,duo);
  function grid(host,folds,title){host.textContent='';const svg=Svg(host,300,210,title);folds.forEach((f,j)=>{const t=S('text',{x:8,y:32+j*38,class:'tag'},svg);t.textContent='fold '+(j+1);
      f.forEach((c,i)=>S('circle',{cx:86+i*30,cy:27+j*38,r:10,fill:c?C.orange:C.blue},svg));const n=f.reduce((s,c)=>s+c,0),e=S('text',{x:286,y:32+j*38,'text-anchor':'end',style:'fill:'+(n===0?C.red:'#c9c9c9')},svg);e.textContent=n});
    cap(host,'<b>'+title+'</b>')}
  function draw(){const r=rng(seed*5),lab=Array.from({length:30},(_,i)=>i<6?1:0),idx=shuffle(30,r),rnd=Array.from({length:5},(_,j)=>idx.slice(j*6,j*6+6).map(i=>lab[i]));
    const pos=shuffle(6,r),neg=shuffle(24,r),sf=Array.from({length:5},()=>[]);pos.forEach((_,i)=>sf[i%5].push(1));neg.forEach((_,i)=>sf[(i+1)%5].push(0));
    grid(A,rnd,'Divisione casuale');grid(B,sf.map(f=>f.sort((a,b)=>b-a)),'Divisione stratificata')}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,polyFit,mse,Svg,proj3,wire,arrow,cap}=M;

/* ---------- polinomio di grado 9 con ridge ---------- */
const F6=x=>0.9*Math.sin(2*Math.PI*x)+1.3*x,SD=0.3,DG=9,NP=12;
const feat=x=>{const t=2*x-1,r=[1];for(let j=1;j<=DG;j++)r.push(r[j-1]*t);return r};
function ridgeW(xs,ys,lam){const k=Math.sqrt(2*xs.length*lam),Phi=xs.map(feat),y=ys.slice();
  for(let j=1;j<=DG;j++){const row=new Array(DG+1).fill(0);row[j]=k;Phi.push(row);y.push(0)}return lstsq(Phi,y)}
const evalW=w=>x=>{const f=feat(x);let s=0;for(let j=0;j<=DG;j++)s+=w[j]*f[j];return s};
function sample(r){const xs=[],ys=[];for(let i=0;i<NP;i++){const x=(i+0.15+0.7*r())/NP;xs.push(x);ys.push(F6(x)+SD*r.n())}return {xs,ys}}
const D6=sample(rng(64));
const lamFmt=v=>{const l=Math.pow(10,v);return l<0.001?l.toExponential(0).replace('e-','·10⁻').replace('⁻7','⁻⁷').replace('⁻6','⁻⁶').replace('⁻5','⁻⁵').replace('⁻4','⁻⁴'):nf(l,l<0.1?3:2)};

FIG.ridgefit=function(st){
  let lv=-7;slider(st,'Forza della multa '+K('\\Rl'),-7,1,0.05,lv,lamFmt,v=>{lv=v;draw()});
  const duo=H('div',{class:'duo'},st);
  const p=Plot(duo,{W:420,H:330,m:[34,10,10,42],xr:[0,1],yr:[-1.4,3],label:'Dodici punti e polinomio di grado 9'});p.axes([0,0.5,1],[-1,0,1,2],'x','y');
  const sl=v=>Math.sign(v)*Math.log10(1+Math.abs(v)),TK=[-1000,-100,-10,0,10,100,1000];
  const q=Plot(duo,{W:420,H:330,m:[52,10,10,42],xr:[-0.6,9.6],yr:[-3.6,3.6],label:'Valore dei dieci pesi'});
  q.axes([0,1,2,3,4,5,6,7,8,9],TK.map(sl),'peso numero j','valore del peso',null,v=>{const x=Math.round(Math.sign(v)*(Math.pow(10,Math.abs(v))-1));return (x<0?'−':'')+big(Math.abs(x))});
  S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(0),y2:q.sy(0),stroke:'#777'},q.bg);
  S('path',{d:p.curve(F6,0,1,200),fill:'none',stroke:C.green,'stroke-width':1.5,'stroke-dasharray':'5 4',opacity:.8},p.g);
  const fp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g);D6.xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(D6.ys[i]),r:4.5,fill:'#fff'},p.g));
  const bs=[];for(let j=0;j<=DG;j++)bs.push(S('rect',{x:q.sx(j)-12,width:24,fill:C.yellow},q.g));
  const res=out(st);res.style.minHeight='3.4em';
  function draw(){const w=ridgeW(D6.xs,D6.ys,Math.pow(10,lv));fp.setAttribute('d',p.curve(evalW(w),0,1,400));let mx=0,nr=0;
    for(let j=0;j<=DG;j++){const y=q.sy(sl(w[j])),z=q.sy(0);bs[j].setAttribute('y',Math.min(y,z));bs[j].setAttribute('height',Math.max(1,Math.abs(y-z)));if(j){mx=Math.max(mx,Math.abs(w[j]));nr+=w[j]*w[j]}}
    res.innerHTML=`Peso più grande in valore assoluto: ${nf(mx,mx<10?2:0)}. Somma dei quadrati dei pesi: ${nf(nr,nr<10?2:0)}.<br>Errore sui dodici punti: ${nf(mse(evalW(w),D6.xs,D6.ys),3)}. La linea tratteggiata verde è la funzione vera.`}
  draw();
};

/* ---------- bias, varianza, errore al variare di lambda ---------- */
FIG.lamU=function(st){
  const LV=[];for(let v=-7;v<=1.001;v+=0.4)LV.push(v);
  const r=rng(606),T=300,G=40,gx=Array.from({length:G},(_,i)=>(i+.5)/G),sum=LV.map(()=>new Float64Array(G)),sq=LV.map(()=>new Float64Array(G));
  for(let t=0;t<T;t++){const d=sample(r);LV.forEach((v,k)=>{const f=evalW(ridgeW(d.xs,d.ys,Math.pow(10,v)));for(let i=0;i<G;i++){const y=f(gx[i]);sum[k][i]+=y;sq[k][i]+=y*y}})}
  const R=LV.map((v,k)=>{let b=0,va=0;for(let i=0;i<G;i++){const m=sum[k][i]/T;b+=(m-F6(gx[i]))**2;va+=sq[k][i]/T-m*m}return {b:b/G,v:va/G,e:b/G+va/G+SD*SD}});
  let bi=0;R.forEach((q,i)=>{if(q.e<R[bi].e)bi=i});
  legend(st,[[C.blue,'bias²'],[C.teal,'varianza'],[C.red,'errore di test atteso'],[C.purple,'errore irriducibile']]);
  const p=Plot(st,{W:600,H:330,m:[48,10,14,42],xr:[-7,1],yr:[0,0.6],label:'Bias, varianza ed errore di test al variare di lambda'});
  p.axes([-7,-5,-3,-1,1],[0,0.1,0.2,0.3,0.4,0.5,0.6],'forza della multa λ (scala logaritmica)',null,v=>['10⁻⁷','','10⁻⁵','','10⁻³','','10⁻¹','','10'][v+7]);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(SD*SD),y2:p.sy(SD*SD),stroke:C.purple,'stroke-dasharray':'5 4'},p.g);
  [['b',C.blue,2],['v',C.teal,2],['e',C.red,2.8]].forEach(a=>S('path',{d:p.poly(R.map((q,i)=>[LV[i],q[a[0]]])),fill:'none',stroke:a[1],'stroke-width':a[2]},p.g));
  const X=p.sx(LV[bi]),Y=p.sy(R[bi].e);S('path',{d:`M${X-7} ${Y-7}L${X+7} ${Y+7}M${X-7} ${Y+7}L${X+7} ${Y-7}`,stroke:'#fff','stroke-width':2.5},p.g);
  const T2=(x,t,an)=>{const e=S('text',{x,y:p.ay+16,'text-anchor':an,class:'tag'},p.top);e.textContent=t};T2(p.ax+90,'poca multa: overfitting','start');T2(p.ax+p.aw-6,'troppa multa: underfitting','end');
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`Errore minimo ${nf(R[bi].e,3)} con ${K('\\Rl\\approx'+kn(Math.pow(10,LV[bi]),3))}; senza multa (a sinistra) l'errore supera ${nf(Math.min(R[0].e,99),1)}.`;
};

/* ---------- dieci features, tre utili ---------- */
const P10=(function(){const r=rng(610),N=60,d=10,X=[],y=[],tw=[3,-2,1.5,0,0,0,0,0,0,0];
  for(let i=0;i<N;i++){const z=r.n(),row=[];for(let j=0;j<d;j++)row.push(0.45*z+0.9*r.n());X.push(row)}
  for(let j=0;j<d;j++){let m=0,s=0;for(let i=0;i<N;i++)m+=X[i][j];m/=N;for(let i=0;i<N;i++){X[i][j]-=m;s+=X[i][j]**2}s=Math.sqrt(s/N);for(let i=0;i<N;i++)X[i][j]/=s}
  let my=0;for(let i=0;i<N;i++){let s=0;for(let j=0;j<d;j++)s+=tw[j]*X[i][j];y.push(s+1.6*r.n());my+=y[i]}my/=N;for(let i=0;i<N;i++)y[i]-=my;
  const LV=[];for(let v=-3;v<=2.001;v+=0.05)LV.push(v);
  const ridge=LV.map(v=>{const k=Math.sqrt(2*N*Math.pow(10,v)),A=X.map(r=>r.slice()),b=y.slice();for(let j=0;j<d;j++){const row=new Array(d).fill(0);row[j]=k;A.push(row);b.push(0)}return Array.from(lstsq(A,b))});
  const w=new Float64Array(d),res=y.slice(),lasso=new Array(LV.length);
  for(let q=LV.length-1;q>=0;q--){const lam=Math.pow(10,LV[q]);
    for(let it=0;it<400;it++){let ch=0;for(let j=0;j<d;j++){let rho=0;for(let i=0;i<N;i++)rho+=X[i][j]*(res[i]+X[i][j]*w[j]);rho/=N;const nw=Math.sign(rho)*Math.max(0,Math.abs(rho)-lam),dl=nw-w[j];if(dl){for(let i=0;i<N;i++)res[i]-=X[i][j]*dl;w[j]=nw;ch=Math.max(ch,Math.abs(dl))}}if(ch<1e-7)break}
    lasso[q]=Array.from(w)}
  return {LV,ridge,lasso,d}})();
const PC=[C.yellow,C.blue,C.green];
function pathPlot(host,W,paths,title){
  const p=Plot(host,{W,H:330,m:[40,10,12,42],xr:[-3,2],yr:[-2.6,3.4],label:title});
  p.axes([-3,-2,-1,0,1,2],[-2,-1,0,1,2,3],'forza della multa λ (scala logaritmica)',null,v=>['0,001','0,01','0,1','1','10','100'][v+3]);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#777'},p.bg);
  for(let j=P10.d-1;j>=0;j--)S('path',{d:p.poly(paths.map((w,i)=>[P10.LV[i],w[j]])),fill:'none',stroke:j<3?PC[j]:C.gray,'stroke-width':j<3?2.5:1.3,opacity:j<3?1:.8},p.g);
  return p}

FIG.ridgepath=function(st){
  legend(st,[[C.yellow,'feature utile 1'],[C.blue,'feature utile 2'],[C.green,'feature utile 3'],[C.gray,'le sette features inutili']]);
  pathPlot(st,600,P10.ridge,'Pesi di ridge al variare di lambda');
};

FIG.paths2=function(st){
  let lv=-1;slider(st,'Forza della multa '+K('\\Rl'),-3,2,0.05,lv,v=>nf(Math.pow(10,v),Math.pow(10,v)<0.1?3:2),v=>{lv=v;draw()});
  legend(st,[[C.yellow,'utile 1'],[C.blue,'utile 2'],[C.green,'utile 3'],[C.gray,'le sette inutili']]);
  const duo=H('div',{class:'duo'},st),PP=[['ridge','Ridge: multa sui quadrati'],['lasso','Lasso: multa sui valori assoluti']].map(a=>{const d=H('div',null,duo),p=pathPlot(d,420,P10[a[0]],a[1]);
    const ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'4 3'},p.g),c=cap(d,'');return {p,ln,c,k:a[0],t:a[1]}});
  function draw(){const i=Math.round((lv+3)/0.05);PP.forEach(o=>{const X=o.p.sx(lv);o.ln.setAttribute('x1',X);o.ln.setAttribute('x2',X);const w=P10[o.k][i],nz=w.filter(v=>Math.abs(v)>1e-9).length;
    o.c.innerHTML=`<b>${o.t}</b><br>pesi diversi da zero: <b>${nz} su 10</b>`})}
  draw();
};

/* ---------- canale e conca ---------- */
FIG.valley2=function(st){
  const duo=H('div',{class:'duo'},st),lam=0.45;
  [[(a,b)=>0.5*(a+b-2)**2,'Minimi quadrati: un canale',0],[(a,b)=>0.5*(a+b-2)**2+lam*(a*a+b*b),'Con ridge: una conca',1]].forEach(a=>{const d=H('div',null,duo),svg=Svg(d,420,330,a[1]),g=S('g',null,svg),f=a[0];
    const P0=proj3(0.5,0.62,210,225,1,[0,0,0]),P=q=>P0([(q[0]-1)*56,(q[1]-1)*56,q[2]*15]);
    wire(g,P,f,[-1,3],[-1,3],10,C.pink,.55);
    if(!a[2]){const u=P([3,-1,0]),v=P([-1,3,0]);S('line',{x1:u[0],y1:u[1],x2:v[0],y2:v[1],stroke:'#fff','stroke-width':4,'stroke-linecap':'round'},g)}
    else{const m=1/(2+lam)*2/1,w=2/(2+2*lam)*1;const ws=1/(1+lam);const u=P([ws,ws,f(ws,ws)]);S('circle',{cx:u[0],cy:u[1],r:6,fill:'#fff',stroke:'#000'},g)}
    const T=(t,q,an,dy)=>{const u=P(q),e=S('text',{x:u[0],y:u[1]+(dy||0),'text-anchor':an,class:'tag'},g);e.innerHTML=t};
    T('peso w₁',[1.6,-1,0],'middle',30);T('peso w₂',[3,0.6,0],'start',22);
    cap(d,'<b>'+a[1]+'</b><br>'+(a[2]?'il punto bianco è l\'unico minimo':'ogni punto della linea bianca è un minimo'))});
};

/* ---------- un solo peso: soglia contro rimpicciolimento ---------- */
FIG.shrink1d=function(st){
  let a=1.6,lam=0.8;
  slider(st,'Valore migliore senza multa '+K('a'),-2.5,2.5,0.05,a,v=>nf(v,2),v=>{a=v;draw()});
  slider(st,'Forza della multa '+K('\\Rl'),0,2,0.05,lam,v=>nf(v,2),v=>{lam=v;draw()});
  legend(st,[[C.pink,'costo senza multa'],[C.orange,'multa'],['#fff','costo totale']]);
  const duo=H('div',{class:'duo'},st),PP=[['Lasso',w=>Math.abs(w),()=>Math.sign(a)*Math.max(0,Math.abs(a)-lam)],['Ridge',w=>w*w,()=>a/(1+2*lam)]].map(o=>{const d=H('div',null,duo);
    const p=Plot(d,{W:420,H:300,m:[14,10,14,42],xr:[-3,3],yr:[0,4.5],label:o[0]+': costo in funzione del peso'});p.axes([-3,-2,-1,0,1,2,3],null,'peso w');
    S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555'},p.bg);
    const mk=(c,w,ds)=>S('path',{fill:'none',stroke:c,'stroke-width':w,'stroke-dasharray':ds||''},p.g);
    const e={p,o,va:S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:C.pink,'stroke-dasharray':'4 4',opacity:.8},p.g),c0:mk(C.pink,1.8),c1:mk(C.orange,1.8),c2:mk('#fff',2.8),dot:S('circle',{r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},p.g),c:cap(d,'')};return e});
  function draw(){PP.forEach(e=>{const p=e.p,pen=e.o[1],ws=e.o[2](),tot=w=>0.5*(w-a)**2+lam*pen(w);
    e.va.setAttribute('x1',p.sx(a));e.va.setAttribute('x2',p.sx(a));
    e.c0.setAttribute('d',p.curve(w=>0.5*(w-a)**2,-3,3,240));e.c1.setAttribute('d',p.curve(w=>lam*pen(w),-3,3,240));e.c2.setAttribute('d',p.curve(tot,-3,3,480));
    e.dot.setAttribute('cx',p.sx(ws));e.dot.setAttribute('cy',p.sy(tot(ws)));
    e.c.innerHTML=`<b>${e.o[0]}</b><br>il minimo è in ${K('\\Ws='+kn(ws,2))}`+(Math.abs(ws)<1e-9&&Math.abs(a)>1e-9?' <b>(esattamente zero)</b>':'')})}
  draw();
};

/* ---------- cerchio contro rombo ---------- */
FIG.budget=function(st){
  let t=1.5;const wh=[1.8,0.7],A=[[1,0.4],[0.4,1]];
  const E=(x,y)=>{const u=x-wh[0],v=y-wh[1];return A[0][0]*u*u+2*A[0][1]*u*v+A[1][1]*v*v};
  const l11=Math.sqrt(A[0][0]),l21=A[0][1]/l11,l22=Math.sqrt(A[1][1]-l21*l21);
  const ell=(p,c)=>{let d='';for(let i=0;i<=120;i++){const th=i/120*2*Math.PI,z1=Math.sqrt(c)*Math.cos(th),z2=Math.sqrt(c)*Math.sin(th),v=z2/l22,u=(z1-l21*v)/l11;d+=(i?'L':'M')+p.sx(wh[0]+u).toFixed(1)+' '+p.sy(wh[1]+v).toFixed(1)}return d+'Z'};
  slider(st,'Budget (grandezza della zona azzurra)',0.3,2.4,0.02,t,v=>nf(v,2),v=>{t=v;draw()});
  const duo=H('div',{class:'duo'},st);
  const PP=[['Ridge: la zona ammessa è un cerchio',0],['Lasso: la zona ammessa è un rombo',1]].map(o=>{const d=H('div',null,duo);
    const p=Plot(d,{W:420,H:380,m:[34,10,10,41],xr:[-1.3,2.7],yr:[-1.5,2],label:o[0]});p.axes([-1,0,1,2],[-1,0,1,2],'peso w₁','peso w₂');
    S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#555'},p.bg);
    [0.15,0.6,1.35,2.4,3.75].forEach(c=>S('path',{d:ell(p,c),fill:'none',stroke:C.pink,'stroke-width':1,opacity:.45},p.g));
    S('circle',{cx:p.sx(wh[0]),cy:p.sy(wh[1]),r:4,fill:C.pink},p.g);
    const reg=S('path',{fill:'rgba(88,196,221,.25)',stroke:C.blue,'stroke-width':1.8},p.g),te=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},p.g),dot=S('circle',{r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},p.g);
    return {p,k:o[1],t:o[0],reg,te,dot,c:cap(d,'')}});
  function draw(){PP.forEach(e=>{const p=e.p;let best=null,bv=1e9,d='';const n=2400;
    const inside=e.k?Math.abs(wh[0])+Math.abs(wh[1])<=t:Math.hypot(wh[0],wh[1])<=t;
    for(let i=0;i<=n;i++){const th=i/n*2*Math.PI;let x,y;if(!e.k){x=t*Math.cos(th);y=t*Math.sin(th)}else{const s=i/n*4,k=Math.floor(s)%4,f=s-Math.floor(s),c=[[t,0],[0,t],[-t,0],[0,-t]],u=c[k],v=c[(k+1)%4];x=u[0]+(v[0]-u[0])*f;y=u[1]+(v[1]-u[1])*f}
      if(e.k?i%(n/4)===0:i%20===0)d+=(d?'L':'M')+p.sx(x).toFixed(1)+' '+p.sy(y).toFixed(1);const v=E(x,y);if(v<bv-1e-12){bv=v;best=[x,y]}}
    if(inside){best=wh.slice();bv=0}
    e.reg.setAttribute('d',d+'Z');e.te.setAttribute('d',bv>1e-6?ell(p,bv):'');e.dot.setAttribute('cx',p.sx(best[0]));e.dot.setAttribute('cy',p.sy(best[1]));
    const z=Math.abs(best[1])<2e-3;if(z)best[1]=0;
    e.c.innerHTML=`<b>${e.t}</b><br>soluzione: ${K('\\Ws_1='+kn(best[0],2)+',\\ \\Ws_2='+kn(best[1],2))}`+(z&&e.k?' <b>(esattamente zero)</b>':'')})}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,Svg,arrow,cap}=M;
const sig=z=>1/(1+Math.exp(-z)),CC=[C.blue,C.orange];
const pct=(v,d)=>nf(100*v,d==null?0:d)+'%';
const ring=(g,x,y,c,wrong,r)=>S('circle',{cx:x,cy:y,r:r||4.6,fill:c,stroke:wrong?'#fff':'#000','stroke-width':wrong?2.2:.8},g);

/* clienti simulati sul modello del dataset Default */
const DEF=(function(){const r=rng(707),a=[];
  for(let i=0;i<200;i++)a.push({b:clamp(0.8+0.42*r.n(),0.02,2.62),inc:clamp(33+13*r.n(),6,70),y:0});
  for(let i=0;i<40;i++)a.push({b:clamp(1.8+0.33*r.n(),0.3,2.65),inc:clamp(31+13*r.n(),6,70),y:1});return a})();
/* regressione logistica a una feature (Newton) */
function fit1(xs,ys){let w=0,b=0;for(let it=0;it<40;it++){let g0=0,g1=0,h00=0,h01=0,h11=0;for(let i=0;i<xs.length;i++){const p=sig(w*xs[i]+b),e=p-ys[i],s=p*(1-p)+1e-9;g0+=e;g1+=e*xs[i];h00+=s;h01+=s*xs[i];h11+=s*xs[i]*xs[i]}
    const det=h00*h11-h01*h01;b-=(h11*g0-h01*g1)/det;w-=(-h01*g0+h00*g1)/det}return [w,b]}
const nll=(w,b,xs,ys)=>{let s=0;for(let i=0;i<xs.length;i++){const z=w*xs[i]+b;s+=Math.log(1+Math.exp(-Math.abs(z)))+Math.max(z,0)-ys[i]*z}return s/xs.length};
const DX=DEF.map(d=>d.b),DY=DEF.map(d=>d.y),FIT=fit1(DX,DY);
const jit=(function(){const r=rng(71);return DEF.map(()=>r()-.5)})();

FIG.defscat=function(st){
  let s=1.4;slider(st,'Soglia sul saldo',0.2,2.6,0.02,s,v=>big(v*1000)+' $',v=>{s=v;draw()});
  legend(st,[[C.blue,'solvente','dot'],[C.orange,'insolvente','dot']]);
  const p=Plot(st,{W:600,H:380,m:[44,10,12,42],xr:[0,2.7],yr:[0,75],label:'Clienti per saldo e reddito'});p.axes([0,0.5,1,1.5,2,2.5],[0,20,40,60],'saldo della carta (migliaia di $)','reddito (migliaia di $)');
  const zone=S('rect',{y:p.ay,height:p.ah,fill:'rgba(255,134,47,.13)'},p.bg),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':2},p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const X=p.sx(s);zone.setAttribute('x',X);zone.setAttribute('width',Math.max(0,p.ax+p.aw-X));ln.setAttribute('x1',X);ln.setAttribute('x2',X);let fp=0,fn=0;
    DEF.forEach(d=>{const pr=d.b>s?1:0,w=pr!==d.y;if(w){if(pr)fp++;else fn++}ring(g,p.sx(d.b),p.sy(d.inc),CC[d.y],w,4.2)});
    res.innerHTML=`Con la soglia a ${big(s*1000)} $ sbagli ${fp+fn} clienti su 240 (bordo bianco):<br>${fp} solventi segnalati per errore e ${fn} insolventi non visti.`}
  draw();
};

/* due nuvole in due dimensioni */
const LB=(function(){const r=rng(72),a=[];for(let i=0;i<30;i++)a.push([-1+0.8*r.n(),-0.55+0.8*r.n(),0]);for(let i=0;i<30;i++)a.push([1.05+0.8*r.n(),0.7+0.8*r.n(),1]);return a})();
function lbPlot(host){const p=Plot(host,{W:600,H:413,m:[34,10,10,42],xr:[-4,4],yr:[-2.6,2.6],label:'Punti di due classi e confine di decisione'});p.axes([-4,-2,0,2,4],[-2,0,2],'feature x₁','feature x₂');return p}
/* striscia di confine: i punti con w·x+w0=c dentro al riquadro */
function hline(p,w,w0,c){const n=Math.hypot(w[0],w[1]),u=[w[0]/n,w[1]/n],k=(c-w0)/n,b=[u[0]*k,u[1]*k],L=12;return [[b[0]-u[1]*L,b[1]+u[0]*L],[b[0]+u[1]*L,b[1]-u[0]*L],u,b]}

Object.assign(M,{hline,ring,sig,CC,lbPlot,pct});
FIG.linbound=function(st){
  let th=100,w0=0.6;
  slider(st,'Direzione di '+K('\\Wv'),0,360,1,th,v=>v+'°',v=>{th=v;draw()});
  slider(st,'Intercetta '+K('\\Ws_0'),-3,3,0.05,w0,v=>nf(v,2),v=>{w0=v;draw()});
  legend(st,[[C.blue,'classe 0','dot'],[C.orange,'classe 1','dot'],['rgba(255,134,47,.35)','zona in cui si prevede 1']]);
  const p=lbPlot(st),zone=S('path',{fill:'rgba(255,134,47,.13)'},p.bg),ln=S('path',{fill:'none',stroke:'#fff','stroke-width':2},p.g),ga=S('g',null,p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';ga.textContent='';const w=[Math.cos(th*Math.PI/180),Math.sin(th*Math.PI/180)],q=hline(p,w,w0,0),u=q[2],b=q[3];
    ln.setAttribute('d',p.poly([q[0],q[1]]));zone.setAttribute('d',p.poly([q[0],q[1],[q[1][0]+u[0]*20,q[1][1]+u[1]*20],[q[0][0]+u[0]*20,q[0][1]+u[1]*20]])+'Z');
    arrow(ga,p.sx(b[0]),p.sy(b[1]),p.sx(b[0]+u[0]*1.1),p.sy(b[1]+u[1]*1.1),C.yellow,3);let e=0;
    LB.forEach(d=>{const pr=w[0]*d[0]+w[1]*d[1]+w0>=0?1:0;if(pr!==d[2])e++;ring(g,p.sx(d[0]),p.sy(d[1]),CC[d[2]],pr!==d[2],5)});
    res.innerHTML=`${K('\\Wv=('+kn(w[0],2)+',\\,'+kn(w[1],2)+')')}, ${K('\\Ws_0='+kn(w0,2))}: errori ${e} su 60.`}
  draw();
};

/* minimi quadrati su risposte 0/1 */
FIG.olsclass=function(st){
  const r=rng(73),B=[];for(let i=0;i<14;i++)B.push([0.3+1.9*(i+r())/14,0]);for(let i=0;i<10;i++)B.push([1.9+1.4*(i+r())/10,1]);
  let k=0;slider(st,'Insolventi con saldo altissimo aggiunti',0,12,1,k,v=>v,v=>{k=v;draw()});
  const p=Plot(st,{W:600,H:340,m:[40,10,12,42],xr:[0,7],yr:[-0.5,1.7],label:'Retta dei minimi quadrati su risposte zero e uno'});p.axes([0,1,2,3,4,5,6,7],[0,0.5,1],'saldo (migliaia di $)','risposta');
  [[1,1.7],[-0.5,0]].forEach(a=>S('rect',{x:p.ax,width:p.aw,y:p.sy(a[1]),height:p.sy(a[0])-p.sy(a[1]),fill:'rgba(252,98,85,.10)'},p.bg));
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(.5),y2:p.sy(.5),stroke:'#666','stroke-dasharray':'3 4'},p.bg);
  const t1=S('text',{x:p.ax+p.aw-6,y:p.sy(1.45),'text-anchor':'end',class:'tag'},p.top);t1.textContent='sopra 1: non è una probabilità';
  const ln=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.5},p.g),th=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'5 4'},p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const D=B.concat(Array.from({length:k},(_,i)=>[4.6+0.19*i,1])),n=D.length;let sx=0,sy=0,sxx=0,sxy=0;D.forEach(d=>{sx+=d[0];sy+=d[1];sxx+=d[0]*d[0];sxy+=d[0]*d[1]});
    const m=(n*sxy-sx*sy)/(n*sxx-sx*sx),b=(sy-m*sx)/n,s=(0.5-b)/m;ln.setAttribute('d',p.poly([[0,b],[7,b+7*m]]));th.setAttribute('x1',p.sx(s));th.setAttribute('x2',p.sx(s));let e=0;
    D.forEach((d,i)=>{const w=(d[0]>s?1:0)!==d[1];if(w&&i<24)e++;ring(g,p.sx(d[0]),p.sy(d[1]),CC[d[1]],w,5.2)});
    res.innerHTML=`La retta supera 0,5 a un saldo di ${big(s*1000)} $: errori sui 24 clienti di partenza ${e}.`}
  draw();
};

/* la loss 0-1 è una scala */
FIG.zeroone=function(st){
  const D=DEF.filter((d,i)=>i%5===2).map(d=>[d.b,d.y]);let s=1.2;
  slider(st,'Soglia sul saldo',0.1,2.6,0.01,s,v=>big(v*1000)+' $',v=>{s=v;draw()});
  const p=Plot(st,{W:600,H:96,m:[40,8,12,8],xr:[0,2.7],yr:[0,1],label:'Clienti lungo l\'asse del saldo'}),q=Plot(st,{W:600,H:250,m:[40,10,12,42],xr:[0,2.7],yr:[0,44],label:'Numero di errori per ogni soglia'});
  q.axes([0,0.5,1,1.5,2,2.5],[0,10,20,30,40],'soglia sul saldo (migliaia di $)');
  const err=x=>D.reduce((a,d)=>a+((d[0]>x?1:0)!==d[1]?1:0),0);
  S('path',{d:q.curve(err,0,2.7,1350),fill:'none',stroke:C.pink,'stroke-width':2.3},q.g);
  const zone=S('rect',{y:p.ay,height:p.ah,fill:'rgba(255,134,47,.13)'},p.bg),l1=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':2},p.g),l2=S('line',{y1:q.ay,y2:q.ay+q.ah,stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'5 4'},q.g),dot=S('circle',{r:6,fill:C.yellow,stroke:'#000'},q.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const X=p.sx(s);zone.setAttribute('x',X);zone.setAttribute('width',p.ax+p.aw-X);[l1,l2].forEach(l=>{l.setAttribute('x1',X);l.setAttribute('x2',X)});
    D.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]?0.72:0.28),CC[d[1]],(d[0]>s?1:0)!==d[1],5));const e=err(s);dot.setAttribute('cx',X);dot.setAttribute('cy',q.sy(e));
    res.innerHTML=`Soglia a ${big(s*1000)} $: ${e} errori su ${D.length}. Spostandola di poco il numero non cambia: la pendenza è zero.`}
  draw();
};

/* classificatore di Bayes */
FIG.bayes=function(st){
  let pi=0.3;slider(st,'Quota di insolventi fra i clienti',0.05,0.6,0.01,pi,v=>pct(v),v=>{pi=v;draw()});
  legend(st,[[C.blue,'solventi'],[C.orange,'insolventi'],['rgba(255,255,255,.55)','errori inevitabili'],[C.yellow,'probabilità di insolvenza']]);
  const gs=(x,m,s)=>Math.exp(-0.5*((x-m)/s)**2)/(s*2.5066),f0=x=>(1-pi)*gs(x,0.85,0.42),f1=x=>pi*gs(x,1.8,0.36),po=x=>f1(x)/(f0(x)+f1(x));
  const p=Plot(st,{W:600,H:190,m:[40,10,12,10],xr:[0,2.7],yr:[0,1],label:'Distribuzione del saldo nelle due classi'}),q=Plot(st,{W:600,H:210,m:[40,10,12,42],xr:[0,2.7],yr:[0,1.05],label:'Probabilità di insolvenza dato il saldo'});
  q.axes([0,0.5,1,1.5,2,2.5],[0,0.5,1],'saldo (migliaia di $)');S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(.5),y2:q.sy(.5),stroke:'#777','stroke-dasharray':'3 4'},q.bg);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.ay+p.ah,y2:p.ay+p.ah,stroke:'#555'},p.axg);
  const er=S('path',{fill:'rgba(255,255,255,.5)'},p.g),c0=S('path',{fill:'none',stroke:C.blue,'stroke-width':2},p.g),c1=S('path',{fill:'none',stroke:C.orange,'stroke-width':2},p.g),cp=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.6},q.g);
  const L=[p,q].map(o=>S('line',{y1:o.ay,y2:o.ay+o.ah,stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'5 4'},o.g)),res=out(st);res.style.minHeight='1.7em';
  function draw(){p.yr[1]=1.05;c0.setAttribute('d',p.curve(f0,0,2.7,300));c1.setAttribute('d',p.curve(f1,0,2.7,300));er.setAttribute('d',p.curve(x=>Math.min(f0(x),f1(x)),0,2.7,300)+`L${p.sx(2.7)} ${p.sy(0)}L${p.sx(0)} ${p.sy(0)}Z`);
    cp.setAttribute('d',q.curve(po,0,2.7,300));let xs=2.7,e=0;for(let i=0;i<2700;i++){const x=(i+.5)/1000;e+=Math.min(f0(x),f1(x))/1000;if(xs===2.7&&po(x)>=0.5)xs=x}
    L.forEach((l,i)=>{const o=i?q:p;l.setAttribute('x1',o.sx(xs));l.setAttribute('x2',o.sx(xs))});
    res.innerHTML=`Soglia di Bayes: saldo di ${big(xs*1000)} $. Errore minimo possibile: ${pct(e,1)} dei clienti.`}
  draw();
};

FIG.sigmoid=function(st){
  let z=2;slider(st,'Punteggio '+K('z'),-8,8,0.1,z,v=>nf(v,1),v=>{z=v;draw()});
  const p=Plot(st,{W:600,H:300,m:[40,10,12,42],xr:[-8,8],yr:[-0.06,1.08],label:'La funzione sigmoide'});p.axes([-8,-6,-4,-2,0,2,4,6,8],[0,0.5,1],'punteggio z','σ(z)');
  [0,1].forEach(v=>S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(v),y2:p.sy(v),stroke:'#555','stroke-dasharray':'3 4'},p.bg));S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);
  S('path',{d:p.curve(sig,-8,8,300),fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g);
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';[[z,C.yellow,'#000'],[-z,'#000',C.yellow]].forEach(a=>{const X=p.sx(a[0]),Y=p.sy(sig(a[0]));S('path',{d:`M${X} ${p.sy(-0.06)}V${Y}H${p.ax}`,fill:'none',stroke:'#999','stroke-dasharray':'3 3'},g);S('circle',{cx:X,cy:Y,r:6.5,fill:a[1],stroke:a[2],'stroke-width':2},g)});
    res.innerHTML=`${K('\\sigma('+kn(z,1)+')='+kn(sig(z),3))} (punto pieno), ${K('\\sigma('+kn(-z,1)+')='+kn(sig(-z),3))} (punto vuoto): insieme fanno 1.`}
  draw();
};

function strip(p,g,xs,ys,xf,wrong){xs.forEach((x,i)=>ring(g,p.sx(xf?xf(x):x),p.sy(ys[i]?1:0)+jit[i%jit.length]*16,CC[ys[i]],wrong?wrong(i):false,3.8))}
function p01(host,W,label){const p=Plot(host,{W,H:330,m:[40,10,12,42],xr:[0,2.7],yr:[-0.14,1.14],label});p.axes([0,0.5,1,1.5,2,2.5],[0,0.5,1],'saldo (migliaia di $)','probabilità');
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(.5),y2:p.sy(.5),stroke:'#555','stroke-dasharray':'3 4'},p.bg);return p}

FIG.logit1d=function(st){
  let w=2,b=-2;
  slider(st,'Peso '+K('\\Ws'),0,12,0.1,w,v=>nf(v,1),v=>{w=v;draw()});
  slider(st,'Intercetta '+K('\\Ws_0'),-18,0,0.1,b,v=>nf(v,1),v=>{b=v;draw()});
  const p=p01(st,600,'Clienti e curva logistica'),g=S('g',null,p.g);strip(p,g,DX,DY);
  const cv=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'5 4'},p.g),res=out(st);res.style.minHeight='3.4em';
  const best=nll(FIT[0],FIT[1],DX,DY);
  function draw(){cv.setAttribute('d',p.curve(x=>sig(w*x+b),0,2.7,300));const c=w>0?-b/w:99;ln.setAttribute('x1',p.sx(c));ln.setAttribute('x2',p.sx(c));ln.style.display=c>=0&&c<=2.7?'':'none';
    res.innerHTML=`La curva vale ½ a un saldo di ${w>0?big(c*1000)+' $':'n.d.'}.<br>Disaccordo con i dati (log loss media): <b>${nf(nll(w,b,DX,DY),3)}</b>. Il minimo raggiungibile è ${nf(best,3)}.`}
  draw();
};

/* probabilità in due dimensioni */
const W2=(function(){let w=[0,0],b=0;for(let it=0;it<3000;it++){let g0=0,g1=0,gb=0;LB.forEach(d=>{const e=sig(w[0]*d[0]+w[1]*d[1]+b)-d[2];g0+=e*d[0];g1+=e*d[1];gb+=e});w[0]-=0.3*(g0/60+0.02*w[0]);w[1]-=0.3*(g1/60+0.02*w[1]);b-=0.3*gb/60}return {w,b}})();
FIG.logit2d=function(st){
  let c=1,t=0.5;
  slider(st,'Tutti i pesi moltiplicati per',0.25,5,0.05,c,v=>nf(v,2),v=>{c=v;draw()});
  slider(st,'Soglia '+K('t'),0.05,0.95,0.01,t,v=>nf(v,2),v=>{t=v;draw()});
  const p=lbPlot(st),cvs=document.createElement('canvas'),nx=150,ny=Math.round(nx*p.ah/p.aw);cvs.width=nx;cvs.height=ny;const ctx=cvs.getContext('2d'),im=ctx.createImageData(nx,ny);
  const l5=S('path',{fill:'none',stroke:'#bbb','stroke-width':1.3,'stroke-dasharray':'5 4'},p.g),lt=S('path',{fill:'none',stroke:'#fff','stroke-width':2.4},p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  LB.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]),CC[d[2]],false,4.6));
  function draw(){const w=[W2.w[0]*c,W2.w[1]*c],b=W2.b*c;
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=p.xr[0]+(i+.5)/nx*8,y=p.yr[1]-(j+.5)/ny*5.2,pr=sig(w[0]*x+w[1]*y+b),a=Math.abs(pr-.5)*2,k=4*(j*nx+i),col=pr>.5?[255,134,47]:[88,196,221];
      im.data[k]=14+col[0]*a*.5;im.data[k+1]=14+col[1]*a*.5;im.data[k+2]=14+col[2]*a*.5;im.data[k+3]=255}
    ctx.putImageData(im,0,0);p.image(cvs);const lg=Math.log(t/(1-t)),a=hline(p,w,b,0),q=hline(p,w,b,lg);l5.setAttribute('d',p.poly([a[0],a[1]]));lt.setAttribute('d',p.poly([q[0],q[1]]));
    let n1=0;LB.forEach(d=>{if(sig(w[0]*d[0]+w[1]*d[1]+b)>=t)n1++});
    res.innerHTML=`Si prevede 1 dove il punteggio supera ${K('\\log\\frac{t}{1-t}='+kn(lg,2))}: ${n1} punti su 60.<br>La linea tratteggiata è il confine a ${K('t=\\tfrac12')}.`}
  draw();
};

FIG.logloss=function(st){
  let pv=0.7;slider(st,'Probabilità data alla risposta giusta '+K('p'),0.01,0.99,0.01,pv,v=>nf(v,2),v=>{pv=v;draw()});
  legend(st,[[C.pink,'log loss'],[C.lg,'loss quadratica']]);
  const p=Plot(st,{W:600,H:310,m:[40,10,12,42],xr:[0,1],yr:[0,5],label:'Log loss e loss quadratica per un punto con risposta uno'});p.axes([0,0.25,0.5,0.75,1],[0,1,2,3,4,5],'probabilità p assegnata alla risposta giusta','costo');
  S('path',{d:p.curve(x=>(1-x)**2,0,1,200),fill:'none',stroke:C.lg,'stroke-width':2},p.g);S('path',{d:p.curve(x=>-Math.log(x),0.004,1,400),fill:'none',stroke:C.pink,'stroke-width':2.8},p.g);
  const d1=S('circle',{r:6,fill:C.pink,stroke:'#000'},p.g),d2=S('circle',{r:5,fill:C.lg,stroke:'#000'},p.g),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#777','stroke-dasharray':'3 4'},p.bg),res=out(st);res.style.minHeight='1.7em';
  function draw(){const X=p.sx(pv);ln.setAttribute('x1',X);ln.setAttribute('x2',X);d1.setAttribute('cx',X);d1.setAttribute('cy',p.sy(Math.min(5.2,-Math.log(pv))));d2.setAttribute('cx',X);d2.setAttribute('cy',p.sy((1-pv)**2));
    res.innerHTML=`Con ${K('p='+kn(pv,2))}: log loss ${K('-\\log p='+kn(-Math.log(pv),2))}, loss quadratica ${K('(1-p)^2='+kn((1-pv)**2,2))}.`}
  draw();
};

FIG.logitgd=function(st){
  const mu=DX.reduce((a,b)=>a+b,0)/DX.length,sd=Math.sqrt(DX.reduce((a,b)=>a+(b-mu)**2,0)/DX.length),Z=DX.map(x=>(x-mu)/sd),T=80,ST=[];
  {let w=0,b=0;for(let t=0;t<=T;t++){ST.push([w,b,nll(w,b,Z,DY)]);let g0=0,g1=0;Z.forEach((z,i)=>{const e=sig(w*z+b)-DY[i];g0+=e;g1+=e*z});w-=1.2*g1/Z.length;b-=1.2*g0/Z.length}}
  const duo=H('div',{class:'duo'},st),p=p01(duo,420,'Clienti e curva logistica durante il gradient descent'),q=Plot(duo,{W:420,H:330,m:[44,10,12,42],xr:[0,T],yr:[0,0.75],label:'Log loss media a ogni passo'});
  q.axes([0,20,40,60,80],[0,0.25,0.5,0.75],'passi di gradient descent','log loss media');
  const g=S('g',null,p.g);strip(p,g,DX,DY);const cv=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g),lc=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},q.g),dot=S('circle',{r:5.5,fill:C.pink,stroke:'#000'},q.g),res=out(st);
  player(st,T,6,tf=>{const t=Math.min(T-1,Math.floor(tf)),fr=tf-t,a=ST[t],b=ST[Math.min(T,t+1)],L=i=>a[i]+(b[i]-a[i])*fr,w=L(0),b0=L(1),l=L(2);
    cv.setAttribute('d',p.curve(x=>sig(w*(x-mu)/sd+b0),0,2.7,200));const pts=[];for(let i=0;i<=t;i++)pts.push([i,ST[i][2]]);pts.push([tf,l]);lc.setAttribute('d',q.poly(pts));dot.setAttribute('cx',q.sx(tf));dot.setAttribute('cy',q.sy(l));
    res.innerHTML=`Passo ${Math.round(tf)}: log loss media ${nf(l,3)}.`});
};

FIG.separable=function(st){
  const X=[0.3,0.5,0.7,0.9,1.1,1.25,1.6,1.75,1.9,2.1,2.3,2.5],Y=[0,0,0,0,0,0,1,1,1,1,1,1],c0=1.425,NF=60,lam=0.01;
  const run=l=>{const R=[];let w=0,it=0;for(let k=0;k<=NF;k++){const tg=Math.round(Math.pow(10,k/15));while(it<tg){let g=0;X.forEach((x,i)=>{g+=(sig(w*(x-c0))-Y[i])*(x-c0)});w-=1.0*(g/X.length+2*l*w);it++}R.push(w)}return R},A=run(0),B=run(lam);
  legend(st,[[C.yellow,'senza multa'],[C.orange,'con multa ridge']]);
  const duo=H('div',{class:'duo'},st),p=Plot(duo,{W:420,H:330,m:[40,10,12,42],xr:[0,2.8],yr:[-0.14,1.14],label:'Dati separabili e curve logistiche'});p.axes([0,0.5,1,1.5,2,2.5],[0,0.5,1],'feature x','probabilità');
  const q=Plot(duo,{W:420,H:330,m:[44,10,30,42],xr:[0,4],yr:[0,20],label:'Grandezza del peso al crescere dei passi'});q.axes([0,1,2,3,4],[0,5,10,15,20],'passi di gradient descent','grandezza del peso',v=>['1','10','100','1 000','10 000'][v]);
  const g=S('g',null,p.g);X.forEach((x,i)=>ring(g,p.sx(x),p.sy(Y[i]),CC[Y[i]],false,5));
  const ca=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.6},p.g),cb=S('path',{fill:'none',stroke:C.orange,'stroke-width':2.2},p.g),la=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.4},q.g),lb=S('path',{fill:'none',stroke:C.orange,'stroke-width':2.4},q.g),res=out(st);
  player(st,NF,5,tf=>{const t=Math.min(NF-1,Math.floor(tf)),fr=tf-t,wa=A[t]+(A[t+1]-A[t])*fr,wb=B[t]+(B[t+1]-B[t])*fr;
    ca.setAttribute('d',p.curve(x=>sig(wa*(x-c0)),0,2.8,300));cb.setAttribute('d',p.curve(x=>sig(wb*(x-c0)),0,2.8,300));
    const pa=[],pb=[];for(let i=0;i<=t;i++){pa.push([i/15,A[i]]);pb.push([i/15,B[i]])}pa.push([tf/15,wa]);pb.push([tf/15,wb]);la.setAttribute('d',q.poly(pa));lb.setAttribute('d',q.poly(pb));
    res.innerHTML=`Dopo ${big(Math.pow(10,tf/15))} passi: peso senza multa ${nf(wa,1)}, con multa ${nf(wb,1)}.`});
};

FIG.softmax=function(st){
  const z=[2,1,0],nm=['setosa','versicolor','virginica'],cl=[C.blue,C.green,C.orange];
  nm.forEach((n,k)=>slider(st,'Punteggio di '+n,-3,5,0.1,z[k],v=>nf(v,1),v=>{z[k]=v;draw()}));
  const p=Plot(st,{W:600,H:260,m:[40,22,12,30],xr:[0.4,3.6],yr:[0,1],label:'Probabilità delle tre classi'});p.axes(null,[0,0.5,1],null,null);
  nm.forEach((n,k)=>{const e=S('text',{x:p.sx(k+1),y:p.ay+p.ah+20,'text-anchor':'middle'},p.axg);e.textContent=n});
  const bs=nm.map((n,k)=>S('rect',{x:p.sx(k+1)-50,width:100,fill:cl[k]},p.g)),ts=nm.map((n,k)=>S('text',{x:p.sx(k+1),'text-anchor':'middle',style:'fill:#fff;font-size:16px'},p.top)),res=out(st);res.style.minHeight='1.7em';
  function draw(){const e=z.map(Math.exp),s=e[0]+e[1]+e[2];e.forEach((v,k)=>{const Y=p.sy(v/s);bs[k].setAttribute('y',Y);bs[k].setAttribute('height',Math.max(0,p.sy(0)-Y));ts[k].setAttribute('y',Y-7);ts[k].textContent=pct(v/s,1)});
    res.innerHTML=`${K('e^{z}')} vale ${e.map(v=>nf(v,2)).join(', ')}; la somma è ${nf(s,2)}. Ogni probabilità è la sua quota sulla somma.`}
  draw();
};

/* matrice di confusione dal vivo */
const PR=DX.map(x=>sig(FIT[0]*x+FIT[1]));
function cmat(host){const d=H('div',{class:'cmat'},host);d.style.cssText='display:grid;grid-template-columns:auto 1fr 1fr;gap:6px;max-width:440px;margin:10px auto 4px;font-family:Figtree,sans-serif;font-size:15px;text-align:center;align-items:center';
  const cell=(t,bg)=>{const e=H('div',null,d,t);e.style.cssText='padding:8px 6px;border-radius:6px;line-height:1.3;'+(bg?'background:'+bg+';color:#fff':'color:#c9c9c9');return e};
  cell('');cell('previsto <b>0</b>');cell('previsto <b>1</b>');cell('era <b>0</b>');const tn=cell('','rgba(131,193,103,.28)'),fp=cell('','rgba(252,98,85,.3)');cell('era <b>1</b>');const fn=cell('','rgba(252,98,85,.3)'),tp=cell('','rgba(131,193,103,.28)');
  return v=>{tn.innerHTML=`<b>${v.tn}</b><br>veri negativi`;fp.innerHTML=`<b>${v.fp}</b><br>falsi positivi`;fn.innerHTML=`<b>${v.fn}</b><br>falsi negativi`;tp.innerHTML=`<b>${v.tp}</b><br>veri positivi`}}
const frac=(a,b)=>b?pct(a/b):'n.d.';

FIG.confusion=function(st){
  let t=0.5;slider(st,'Soglia '+K('t'),0.02,0.98,0.01,t,v=>nf(v,2),v=>{t=v;draw()});
  legend(st,[[C.blue,'solvente (0)','dot'],[C.orange,'insolvente (1)','dot'],['rgba(255,134,47,.35)','previsti insolventi']]);
  const p=Plot(st,{W:600,H:170,m:[14,10,14,42],xr:[0,1],yr:[0,1],label:'Clienti ordinati per probabilità prevista'});p.axes([0,0.25,0.5,0.75,1],null,'probabilità di insolvenza prevista dal modello');
  const zone=S('rect',{y:p.ay,height:p.ah,fill:'rgba(255,134,47,.13)'},p.bg),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':2},p.g),g=S('g',null,p.g),set=cmat(st),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const X=p.sx(t);zone.setAttribute('x',X);zone.setAttribute('width',p.ax+p.aw-X);ln.setAttribute('x1',X);ln.setAttribute('x2',X);const v={tp:0,tn:0,fp:0,fn:0};
    PR.forEach((pr,i)=>{const y=DY[i],ph=pr>=t?1:0;v[ph?(y?'tp':'fp'):(y?'fn':'tn')]++;ring(g,p.sx(pr),p.sy(y?0.74:0.3)+jit[i]*42,CC[y],ph!==y,3.8)});set(v);
    res.innerHTML=`accuratezza ${frac(v.tp+v.tn,240)} · recall ${frac(v.tp,v.tp+v.fn)} · precision ${frac(v.tp,v.tp+v.fp)}<br>specificità ${frac(v.tn,v.tn+v.fp)} · tasso di falsi positivi ${frac(v.fp,v.tn+v.fp)}`}
  draw();
};

const Phi=x=>{const t=1/(1+0.2316419*Math.abs(x)),d=0.3989423*Math.exp(-x*x/2),q=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>=0?1-q:q};
FIG.roc=function(st){
  let d=2,s=1;
  slider(st,'Soglia sul punteggio',-3,6,0.05,s,v=>nf(v,2),v=>{s=v;draw()});
  slider(st,'Distanza fra le due classi',0,4,0.05,d,v=>nf(v,2),v=>{d=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),gs=(x,m)=>Math.exp(-0.5*(x-m)**2)/2.5066;
  const p=Plot(dl,{W:420,H:330,m:[14,10,14,42],xr:[-3.5,7],yr:[0,0.46],label:'Punteggi delle due classi e soglia'});p.axes([-2,0,2,4,6],null,'punteggio del modello');
  const q=Plot(dr,{W:420,H:330,m:[66,10,48,42],xr:[0,1],yr:[0,1],label:'Curva ROC'});q.axes([0,0.5,1],[0,0.5,1],'tasso di falsi positivi','recall');
  S('line',{x1:q.sx(0),y1:q.sy(0),x2:q.sx(1),y2:q.sy(1),stroke:'#777','stroke-dasharray':'4 4'},q.g);
  const a1=S('path',{fill:'rgba(255,134,47,.3)'},p.g),a0=S('path',{fill:'rgba(88,196,221,.35)'},p.g),c0=S('path',{d:p.curve(x=>gs(x,0),-3.5,7,300),fill:'none',stroke:C.blue,'stroke-width':2},p.g),c1=S('path',{fill:'none',stroke:C.orange,'stroke-width':2},p.g),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':2},p.g);
  const au=S('path',{fill:'rgba(255,255,0,.12)'},q.g),rc=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.6},q.g),dot=S('circle',{r:6.5,fill:'#fff',stroke:'#000','stroke-width':1.5},q.g);
  const ca=cap(dl,''),cb=cap(dr,''),res=out(st);res.style.minHeight='1.7em';
  const area=(m,x0)=>{let s2=`M${p.sx(x0)} ${p.sy(0)}`;for(let i=0;i<=120;i++){const x=x0+(7-x0)*i/120;s2+=`L${p.sx(x).toFixed(1)} ${p.sy(gs(x,m)).toFixed(1)}`}return s2+`L${p.sx(7)} ${p.sy(0)}Z`};
  function draw(){c1.setAttribute('d',p.curve(x=>gs(x,d),-3.5,7,300));ln.setAttribute('x1',p.sx(s));ln.setAttribute('x2',p.sx(s));a1.setAttribute('d',area(d,s));a0.setAttribute('d',area(0,s));
    const pts=[];for(let i=0;i<=200;i++){const u=-5+13*i/200;pts.push([1-Phi(u),1-Phi(u-d)])}pts.reverse();rc.setAttribute('d',q.poly(pts));au.setAttribute('d',q.poly(pts)+`L${q.sx(1)} ${q.sy(0)}L${q.sx(0)} ${q.sy(0)}Z`);
    const fpr=1-Phi(s),tpr=1-Phi(s-d);dot.setAttribute('cx',q.sx(fpr));dot.setAttribute('cy',q.sy(tpr));
    ca.innerHTML='a destra della soglia si prevede 1:<br>area arancione = recall, area blu = falsi positivi';cb.innerHTML=`<b>Curva ROC</b><br>il punto bianco è la soglia scelta`;
    res.innerHTML=`Recall ${pct(tpr)}, tasso di falsi positivi ${pct(fpr)}. Area sotto la curva (AUC): <b>${nf(Phi(d/Math.SQRT2),2)}</b>.`}
  draw();
};

FIG.imbal=function(st){
  let be=1;slider(st,'Peso della recall '+K('\\beta'),0.25,4,0.05,be,v=>nf(v,2),v=>{be=v;draw()});
  legend(st,[['#3a3a3a','vero negativo'],[C.red,'falso negativo (sfuggito)'],[C.green,'vero positivo'],[C.orange,'falso positivo (falso allarme)']]);
  const r=rng(79),idx=Array.from({length:1000},(_,i)=>i);for(let i=999;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
  const pos=new Set(idx.slice(0,10)),hit=new Set(idx.slice(0,8)),fa=new Set(idx.slice(10,32)),duo=H('div',{class:'duo'},st);
  const PP=[['Dice sempre «solvente»',{tp:0,fn:10,fp:0,tn:990},i=>pos.has(i)?C.red:'#3a3a3a'],['Segnala 30 clienti',{tp:8,fn:2,fp:22,tn:968},i=>hit.has(i)?C.green:pos.has(i)?C.red:fa.has(i)?C.orange:'#3a3a3a']].map(o=>{const d=H('div',null,duo),svg=Svg(d,420,268,o[0]);
    for(let i=0;i<1000;i++){const c=o[2](i),bigc=c!=='#3a3a3a';S('rect',{x:10+(i%40)*10+(bigc?-1:0),y:9+Math.floor(i/40)*10+(bigc?-1:0),width:bigc?10:8,height:bigc?10:8,fill:c},svg)}return {o,c:cap(d,'')}});
  function draw(){PP.forEach(e=>{const v=e.o[1],R=v.tp/(v.tp+v.fn),P=v.tp+v.fp?v.tp/(v.tp+v.fp):null,F=b=>P&&R?(1+b*b)*P*R/(b*b*P+R):0;
    e.c.innerHTML=`<b>${e.o[0]}</b><br>accuratezza ${pct((v.tp+v.tn)/1000,1)} · recall ${pct(R)} · precision ${P==null?'n.d.':pct(P)}<br>${K('F_1='+kn(F(1),2))} · ${K('F_\\beta='+kn(F(be),2))}`})}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,hline,ring,CC,lbPlot,pct}=M;
const col=y=>CC[y>0?1:0];

/* ---------- SMO: duale della SVM con kernel qualsiasi ---------- */
function smo(Km,y,Cc,maxIt){const n=y.length,a=new Float64Array(n),f=new Float64Array(n);let m=0,Mx=0;
  for(let it=0;it<(maxIt||20000);it++){let i=-1,j=-1;m=-1e18;Mx=1e18;
    for(let t=0;t<n;t++){const v=y[t]-f[t];if(((y[t]>0&&a[t]<Cc-1e-12)||(y[t]<0&&a[t]>1e-12))&&v>m){m=v;i=t}if(((y[t]>0&&a[t]>1e-12)||(y[t]<0&&a[t]<Cc-1e-12))&&v<Mx){Mx=v;j=t}}
    if(i<0||j<0||m-Mx<1e-4)break;
    const s=y[i]*y[j];let L,Hh;if(s<0){L=Math.max(0,a[j]-a[i]);Hh=Math.min(Cc,Cc+a[j]-a[i])}else{L=Math.max(0,a[i]+a[j]-Cc);Hh=Math.min(Cc,a[i]+a[j])}
    const eta=Math.max(1e-12,Km[i][i]+Km[j][j]-2*Km[i][j]),aj=clamp(a[j]+y[j]*((f[i]-y[i])-(f[j]-y[j]))/eta,L,Hh),dj=aj-a[j],di=-s*dj;if(Math.abs(dj)<1e-14)break;
    a[j]=aj;a[i]+=di;for(let k=0;k<n;k++)f[k]+=y[i]*di*Km[i][k]+y[j]*dj*Km[j][k]}
  return {a,b:(m+Mx)/2,f}}
M.smo=smo;
const dotK=P=>P.map(p=>P.map(q=>p[0]*q[0]+p[1]*q[1]));
/* SVM lineare in due dimensioni: restituisce w, b, alpha, slack */
function svm2(P,Cc){const y=P.map(p=>p[2]),r=smo(dotK(P),y,Cc),w=[0,0];P.forEach((p,i)=>{w[0]+=r.a[i]*y[i]*p[0];w[1]+=r.a[i]*y[i]*p[1]});
  const xi=P.map(p=>Math.max(0,1-p[2]*(w[0]*p[0]+w[1]*p[1]+r.b)));return {w,b:r.b,a:r.a,xi,n:Math.hypot(w[0],w[1])}}
M.svm2=svm2;

let SEP,BEST;for(let sd=81;sd<140;sd++){const r=rng(sd),a=[];for(let i=0;i<12;i++)a.push([-1.5+0.6*r.n(),-0.8+0.6*r.n(),-1]);for(let i=0;i<12;i++)a.push([1.5+0.6*r.n(),0.9+0.6*r.n(),1]);const s=svm2(a,1e4);SEP=a;BEST=s;if(Math.max(...s.xi)<1e-3&&1/s.n>0.6&&1/s.n<0.85)break}
/* strada attorno al confine w·x+b=0 con bordi a punteggio ±k */
function road(p,o){const g=S('g',null,p.g);o=o||{};const band=S('path',{fill:o.fill||'rgba(255,255,0,.14)'},g),l0=S('path',{fill:'none',stroke:'#fff','stroke-width':2.2},g),la=S('path',{fill:'none',stroke:C.yellow,'stroke-width':1.3,'stroke-dasharray':'5 4'},g),lb=S('path',{fill:'none',stroke:C.yellow,'stroke-width':1.3,'stroke-dasharray':'5 4'},g);
  return (w,b,k)=>{if(!w){[band,l0,la,lb].forEach(e=>e.setAttribute('d',''));return}const q=hline(p,w,b,0),A=hline(p,w,b,k),B=hline(p,w,b,-k);l0.setAttribute('d',p.poly([q[0],q[1]]));
    if(k>1e-9){la.setAttribute('d',p.poly([A[0],A[1]]));lb.setAttribute('d',p.poly([B[0],B[1]]));band.setAttribute('d',p.poly([A[0],A[1],B[1],B[0]])+'Z')}else{la.setAttribute('d','');lb.setAttribute('d','');band.setAttribute('d','')}}}
const pts=(p,g,P,wrong,r)=>P.forEach((d,i)=>ring(g,p.sx(d[0]),p.sy(d[1]),col(d[2]),wrong?wrong(d,i):false,r||5.5));
const LEG=[[C.blue,'classe −1','dot'],[C.orange,'classe +1','dot']];

FIG.manylines=function(st){
  const a0=Math.atan2(BEST.w[1],BEST.w[0])*180/Math.PI;let th=Math.round(a0)-22,off=0.15;
  slider(st,'Rotazione del confine',Math.round(a0)-60,Math.round(a0)+60,1,th,v=>(v-Math.round(a0)>0?'+':'')+(v-Math.round(a0))+'°',v=>{th=v;draw()});
  slider(st,'Spostamento del confine',-1.5,1.5,0.02,off,v=>nf(v,2),v=>{off=v;draw()});
  legend(st,LEG.concat([['rgba(255,255,0,.4)','strada libera attorno al confine']]));
  const p=lbPlot(st),rd=road(p),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const w=[Math.cos(th*Math.PI/180),Math.sin(th*Math.PI/180)],b=-off;let mn=1e9,e=0;SEP.forEach(d=>{const m=d[2]*(w[0]*d[0]+w[1]*d[1]+b);if(m<0)e++;mn=Math.min(mn,m)});
    rd(w,b,e?0:mn);pts(p,g,SEP,d=>d[2]*(w[0]*d[0]+w[1]*d[1]+b)<0);
    res.innerHTML=e?`Questo confine sbaglia ${e} ${e===1?'punto':'punti'}: non separa le classi.`:`Separa senza errori. Larghezza della strada: <b>${nf(2*mn,2)}</b>. La più larga possibile è ${nf(2/BEST.n,2)}.`}
  draw();
};

FIG.distance=function(st){
  let c=1,pt=[1.6,1.2];const w0=[0.8,0.6],b0=-0.4;
  slider(st,K('\\Wv')+' e '+K('\\Bi')+' moltiplicati per',0.5,3,0.05,c,v=>nf(v,2),v=>{c=v;draw()});
  const p=lbPlot(st);const q=hline(p,w0,b0,0);S('path',{d:p.poly([q[0],q[1]]),fill:'none',stroke:'#fff','stroke-width':2.2},p.g);
  S('path',{d:p.poly([q[0],q[1],[q[1][0]+w0[0]*20,q[1][1]+w0[1]*20],[q[0][0]+w0[0]*20,q[0][1]+w0[1]*20]])+'Z',fill:'rgba(255,134,47,.10)'},p.bg);
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  drag(p,p.svg,(x,y)=>{pt=[clamp(x,-3.8,3.8),clamp(y,-2.4,2.4)];draw()});
  function draw(){g.textContent='';const sc=w0[0]*pt[0]+w0[1]*pt[1]+b0,foot=[pt[0]-sc*w0[0],pt[1]-sc*w0[1]],bb=q[3];
    {const o=[bb[0]+w0[1]*1.6,bb[1]-w0[0]*1.6];arrow(g,p.sx(o[0]),p.sy(o[1]),p.sx(o[0]+w0[0]*0.7*c),p.sy(o[1]+w0[1]*0.7*c),C.yellow,3)}
    S('line',{x1:p.sx(pt[0]),y1:p.sy(pt[1]),x2:p.sx(foot[0]),y2:p.sy(foot[1]),stroke:C.pink,'stroke-width':2.5},g);S('circle',{cx:p.sx(pt[0]),cy:p.sy(pt[1]),r:8,fill:'#fff',stroke:'#000','stroke-width':1.5,style:'cursor:grab'},g);
    res.innerHTML=`Punteggio ${K('\\Wv^\\top\\Xv+\\Bi='+kn(sc*c,2))}, lunghezza ${K('\\lVert\\Wv\\rVert='+kn(c,2))}.<br>Distanza con segno (segmento rosa): ${K(kn(sc*c,2)+'/'+kn(c,2)+'=')} <b>${nf(sc,2)}</b>.`}
  draw();
};

/* un separatore con margine stretto */
const NARROW=(function(){const a0=Math.atan2(BEST.w[1],BEST.w[0]);for(let k=0;k<40;k++){const da=(0.9-0.04*(k>>1))*(k%2?-1:1);const w=[Math.cos(a0+da),Math.sin(a0+da)];let lo=1e9,hi=-1e9;SEP.forEach(d=>{const s=w[0]*d[0]+w[1]*d[1];if(d[2]>0)lo=Math.min(lo,s);else hi=Math.max(hi,s)});
    if(lo-hi>0.16){const b=-(hi+0.3*(lo-hi));let mn=1e9;SEP.forEach(d=>{mn=Math.min(mn,d[2]*(w[0]*d[0]+w[1]*d[1]+b))});return {w,b,m:mn}}}return null})();
FIG.noise=function(st){
  let r=0.3;slider(st,'Errore di misura '+K('r'),0,1.2,0.01,r,v=>nf(v,2),v=>{r=v;draw()});
  const duo=H('div',{class:'duo'},st),PP=[[NARROW.w,NARROW.b,NARROW.m,'Confine vicino ai punti'],[[BEST.w[0]/BEST.n,BEST.w[1]/BEST.n],BEST.b/BEST.n,1/BEST.n,'Confine con il margine più largo']].map(o=>{const d=H('div',null,duo);
    const p=Plot(d,{W:420,H:330,m:[10,10,10,10],xr:[-3.4,3.4],yr:[-2.62,2.62],label:o[3]});const q=hline(p,o[0],o[1],0);S('path',{d:p.poly([q[0],q[1]]),fill:'none',stroke:'#fff','stroke-width':2.2},p.g);
    const g=S('g',null,p.g);return {p,g,o,c:cap(d,'')}});
  function draw(){PP.forEach(e=>{e.g.textContent='';const p=e.p,o=e.o,R=p.sx(r)-p.sx(0);let n=0;
    SEP.forEach(d=>{const m=d[2]*(o[0][0]*d[0]+o[0][1]*d[1]+o[1]),bad=r>m;if(bad)n++;S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:R,fill:bad?'rgba(252,98,85,.22)':'rgba(255,255,255,.07)',stroke:bad?C.red:'#777','stroke-width':bad?1.8:1},e.g)});
    SEP.forEach(d=>ring(e.g,p.sx(d[0]),p.sy(d[1]),col(d[2]),false,4));
    e.c.innerHTML=`<b>${o[3]}</b><br>margine ${nf(o[2],2)}: ${n?n+(n===1?' punto può':' punti possono')+' finire dalla parte sbagliata':'nessun punto può finire dalla parte sbagliata'}`})}
  draw();
};

FIG.rescale=function(st){
  let nw=3;const u=[BEST.w[0]/BEST.n,BEST.w[1]/BEST.n],b0=BEST.b/BEST.n;
  slider(st,'Lunghezza dei pesi '+K('\\lVert\\Wv\\rVert'),0.4,4,0.02,nw,v=>nf(v,2),v=>{nw=v;draw()});
  legend(st,LEG.concat([[C.yellow,'bordi della strada: punteggio ±1']]));
  const p=lbPlot(st),rd=road(p),g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const w=[u[0]*nw,u[1]*nw],b=b0*nw;let v=0;rd(w,b,1);pts(p,g,SEP,d=>{const bad=d[2]*(w[0]*d[0]+w[1]*d[1]+b)<1-1e-6;if(bad)v++;return bad});
    res.innerHTML=`Larghezza della strada ${K('2/\\lVert\\Wv\\rVert='+kn(2/nw,2))}. Vincoli violati: <b>${v}</b>.<br>Il valore più piccolo di ${K('\\lVert\\Wv\\rVert')} senza violazioni è ${nf(BEST.n,2)}.`}
  draw();
};

FIG.sv=function(st){
  const P=SEP.map(d=>d.slice());legend(st,LEG.concat([[C.yellow,'vettore di supporto','dot','background:transparent;box-shadow:inset 0 0 0 2px #FFFF00']]));
  const p=lbPlot(st),rd=road(p),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';p.svg.style.cursor='grab';
  drag(p,p.svg,(x,y,i)=>{P[i][0]=clamp(x,-3.8,3.8);P[i][1]=clamp(y,-2.4,2.4);draw()},(x,y)=>{let bi=0,bd=1e9;P.forEach((q,i)=>{const d=(p.sx(q[0])-p.sx(x))**2+(p.sy(q[1])-p.sy(y))**2;if(d<bd){bd=d;bi=i}});return bd<900?bi:false});
  function draw(){g.textContent='';const s=svm2(P,1e4),ok=Math.max(...s.xi)<1e-2;let k=0;
    if(ok){rd(s.w,s.b,1);P.forEach((d,i)=>{if(s.a[i]>1e-5){k++;S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:11,fill:'none',stroke:C.yellow,'stroke-width':2.5},g)}})}else rd(null);
    pts(p,g,P,null,6);
    res.innerHTML=ok?`Vettori di supporto: <b>${k}</b> su ${P.length}. Larghezza della strada: ${nf(2/s.n,2)}.`:'Così le classi non sono più separabili: il margine rigido non ha soluzione.'}
  draw();
};

FIG.outlier=function(st){
  let t=0;slider(st,'Posizione del punto anomalo',0,1,0.01,t,v=>pct(v),v=>{t=v;draw()});
  const p=lbPlot(st),rd=road(p),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const o=[1.2-2.9*t,0.9-1.75*t,1],P=SEP.concat([o]),s=svm2(P,1e4),ok=Math.max(...s.xi)<1e-2;
    if(ok)rd(s.w,s.b,1);else rd(null);S('circle',{cx:p.sx(o[0]),cy:p.sy(o[1]),r:11,fill:'none',stroke:'#fff','stroke-width':2},g);pts(p,g,P,null,5.5);
    res.innerHTML=ok?`Larghezza della strada: <b>${nf(2/s.n,2)}</b> (senza il punto anomalo era ${nf(2/BEST.n,2)}).`:'Nessuna retta separa le due classi: il margine rigido non ha soluzione.'}
  draw();
};

const OVL=(function(){const r=rng(85),a=[];for(let i=0;i<20;i++)a.push([-0.95+0.85*r.n(),-0.5+0.85*r.n(),-1]);for(let i=0;i<20;i++)a.push([0.95+0.85*r.n(),0.6+0.85*r.n(),1]);return a.map(d=>[clamp(d[0],-3.7,3.7),clamp(d[1],-2.4,2.4),d[2]])})();
M.OVL=OVL;
FIG.soft=function(st){
  let lv=-1.5;slider(st,'Peso della strada larga '+K('\\Rl'),-3,0.5,0.05,lv,v=>nf(Math.pow(10,v),3),v=>{lv=v;draw()});
  legend(st,LEG.concat([[C.pink,'slack']]));
  const p=lbPlot(st),rd=road(p),g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const s=svm2(OVL,1/(Math.pow(10,lv)*OVL.length));rd(s.w,s.b,1);let v=0,e=0,sm=0;const u=[s.w[0]/s.n,s.w[1]/s.n];
    OVL.forEach((d,i)=>{const x=s.xi[i];if(x>1e-4){v++;sm+=x;if(x>1)e++;const L=x/s.n*d[2];S('line',{x1:p.sx(d[0]),y1:p.sy(d[1]),x2:p.sx(d[0]+u[0]*L),y2:p.sy(d[1]+u[1]*L),stroke:C.pink,'stroke-width':2},g)}});
    pts(p,g,OVL,(d,i)=>s.xi[i]>1,5);
    res.innerHTML=`Larghezza della strada ${nf(2/s.n,2)}. Punti che violano il margine: <b>${v}</b> su 40, di cui ${e} dalla parte sbagliata (bordo bianco).<br>Somma degli slack: ${nf(sm,2)}.`}
  draw();
};

FIG.hingecmp=function(st){
  let m=0.4;slider(st,'Etichetta × punteggio '+K('m'),-3,3,0.05,m,v=>nf(v,2),v=>{m=v;draw()});
  legend(st,[[C.lg,'loss 0-1'],[C.pink,'hinge loss'],[C.blue,'log loss']]);
  const p=Plot(st,{W:600,H:320,m:[40,10,12,42],xr:[-3,3],yr:[0,4.2],label:'Loss zero-uno, hinge e logistica'});p.axes([-3,-2,-1,0,1,2,3],[0,1,2,3,4],'m = etichetta × punteggio','costo');
  S('rect',{x:p.sx(0),width:p.sx(1)-p.sx(0),y:p.ay,height:p.ah,fill:'rgba(255,255,0,.08)'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555'},p.bg);
  S('path',{d:`M${p.sx(-3)} ${p.sy(1)}L${p.sx(0)} ${p.sy(1)}L${p.sx(0)} ${p.sy(0)}L${p.sx(3)} ${p.sy(0)}`,fill:'none',stroke:C.lg,'stroke-width':2},p.g);
  const lg=x=>Math.log(1+Math.exp(-x)),hg=x=>Math.max(0,1-x);S('path',{d:p.curve(lg,-3,3,200),fill:'none',stroke:C.blue,'stroke-width':2},p.g);S('path',{d:p.curve(hg,-3,3,300),fill:'none',stroke:C.pink,'stroke-width':2.8},p.g);
  const ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#999','stroke-dasharray':'3 4'},p.g),d1=S('circle',{r:6.5,fill:C.pink,stroke:'#000'},p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){const X=p.sx(m);ln.setAttribute('x1',X);ln.setAttribute('x2',X);d1.setAttribute('cx',X);d1.setAttribute('cy',p.sy(hg(m)));
    res.innerHTML=(m>=1?'Punto dalla parte giusta e fuori dalla strada: slack zero.':m>=0?'Punto dalla parte giusta ma dentro la strada (fascia gialla): slack fra 0 e 1.':'Punto dalla parte sbagliata: slack maggiore di 1.')+`<br>Hinge ${nf(hg(m),2)} · log loss ${nf(lg(m),2)} · loss 0-1 ${m<0?1:0}.`}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,proj3,wire,arrow,cap,hline,ring,CC,lbPlot,pct,smo,svm2,OVL}=M;
const col=y=>CC[y>0?1:0];
/* SVM con kernel: restituisce la funzione punteggio */
function ksvm(P,kf,Cc){const y=P.map(p=>p[2]),Km=P.map(p=>P.map(q=>kf(p,q))),r=smo(Km,y,Cc,30000);
  const sv=[];P.forEach((p,i)=>{if(r.a[i]>1e-7)sv.push([p,r.a[i]*y[i]])});return {a:r.a,b:r.b,nsv:sv.length,f:x=>{let s=r.b;for(let k=0;k<sv.length;k++)s+=sv[k][1]*kf(sv[k][0],x);return s}}}
function heatClass(p,f,nx){const ny=Math.round(nx*p.ah/p.aw),cv=p._cv||(p._cv=document.createElement('canvas'));cv.width=nx;cv.height=ny;const c=cv.getContext('2d'),im=c.createImageData(nx,ny);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const v=f([p.xr[0]+(i+.5)/nx*(p.xr[1]-p.xr[0]),p.yr[1]-(j+.5)/ny*(p.yr[1]-p.yr[0])]),a=0.12+0.34*clamp(Math.abs(v),0,1),q=v>0?[255,134,47]:[88,196,221],k=4*(j*nx+i);
    im.data[k]=10+q[0]*a;im.data[k+1]=10+q[1]*a;im.data[k+2]=10+q[2]*a;im.data[k+3]=255}c.putImageData(im,0,0);p.image(cv)}
const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2,dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const RING=(function(){const r=rng(91),a=[];for(let i=0;i<16;i++){const t=2*Math.PI*r(),q=0.8*Math.sqrt(r());a.push([q*Math.cos(t),q*Math.sin(t),1])}
  for(let i=0;i<24;i++){const t=2*Math.PI*(i+r())/24,q=1.75+0.45*r();a.push([q*Math.cos(t),q*Math.sin(t),-1])}return a})();

FIG.ring=function(st){
  const W=600,Hh=410,svg=Svg(st,W,Hh,'Punti ad anello sollevati in tre dimensioni'),g=S('g',null,svg),res=out(st);
  const P0=proj3(0.55,0.42,300,296,1,[0,0,0]),P=q=>P0([q[0]*82,q[1]*82,q[2]*33]),R=2.5,zc=1.75,ez=t=>t*t*(3-2*t);
  const ptsOf=(t,hi)=>RING.forEach(d=>{const z=t*(d[0]*d[0]+d[1]*d[1]);if((z>zc)!==hi&&t>0)return;if(t===0&&hi)return;const u=P([d[0],d[1],z]),v=P([d[0],d[1],0]);
    if(z>0.02)S('line',{x1:u[0],y1:u[1],x2:v[0],y2:v[1],stroke:'#666','stroke-width':1},g);S('circle',{cx:u[0],cy:u[1],r:5,fill:col(d[2]),stroke:'#000','stroke-width':.8},g)});
  player(st,100,8,pos=>{g.textContent='';const t=ez(clamp((pos-8)/50,0,1)),a=ez(clamp((pos-66)/22,0,1));
    wire(g,P,()=>0,[-R,R],[-R,R],5,'#777',.45);if(t>0.02){const Lp=a=>a.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join('');for(let k=1;k<=5;k++){const rr=k*0.5,c=[];for(let i=0;i<=48;i++){const an=i/48*2*Math.PI;c.push(P([rr*Math.cos(an),rr*Math.sin(an),t*rr*rr]))}S('path',{d:Lp(c),fill:'none',stroke:C.pink,'stroke-width':1,opacity:0.3*t},g)}for(let i=0;i<12;i++){const an=i/12*2*Math.PI,c=[];for(let k=0;k<=10;k++){const rr=k*0.25;c.push(P([rr*Math.cos(an),rr*Math.sin(an),t*rr*rr]))}S('path',{d:Lp(c),fill:'none',stroke:C.pink,'stroke-width':1,opacity:0.3*t},g)}}
    ptsOf(t,false);
    if(a>0){const q=[[-R,-R],[R,-R],[R,R],[-R,R]].map(c=>P([c[0],c[1],zc]));S('path',{d:'M'+q.map(c=>c[0].toFixed(1)+' '+c[1].toFixed(1)).join('L')+'Z',fill:`rgba(255,255,0,${0.2*a})`,stroke:C.yellow,'stroke-width':1.5,opacity:a},g)}
    ptsOf(t,true);
    const e=(x,y,tx,an)=>{const u=P([x,y,0]),el=S('text',{x:u[0],y:u[1],'text-anchor':an,class:'tag'},g);el.textContent=tx};e(0.4,-R-0.42,'feature x₁','middle');e(R+0.25,0.2,'feature x₂','start');
    if(t>0.3){const el=S('text',{x:16,y:26,class:'tag',opacity:clamp((t-.3)*3,0,1)},g);el.textContent='altezza di ogni punto: x₁² + x₂²'}
    res.innerHTML=pos<8?'Nel piano, la classe arancione è circondata dalla blu: nessuna retta le separa.':a<=0?'Ogni punto sale di una quantità pari al quadrato della sua distanza dal centro.':'Un piano orizzontale ora separa le classi. Visto dall\'alto, quel piano è un cerchio.'});
};

FIG.kdim=function(st){
  let d=10,pp=2;const cnt=(d,p)=>{let c=1;for(let i=1;i<=p;i++)c=c*(d+i)/i;return Math.round(c)-1};
  slider(st,'Features di partenza '+K('d'),2,100,1,d,v=>v,v=>{d=v;draw()});slider(st,'Grado massimo dei prodotti',1,6,1,pp,v=>v,v=>{pp=v;draw()});
  const p=Plot(st,{W:600,H:300,m:[52,10,14,42],xr:[0.6,6.4],yr:[0,10],label:'Numero di features al crescere del grado'});p.axes([1,2,3,4,5,6],[0,2,4,6,8,10],'grado massimo','numero di features',null,v=>['1','100','10⁴','10⁶','10⁸','10¹⁰'][v/2]);
  const ln=S('path',{fill:'none',stroke:C.blue,'stroke-width':2.2},p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const pts=[1,2,3,4,5,6].map(q=>[q,Math.log10(cnt(d,q))]);ln.setAttribute('d',p.poly(pts));pts.forEach(q=>S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:q[0]===pp?7.5:4,fill:q[0]===pp?C.yellow:C.blue,stroke:'#000'},g));
    res.innerHTML=`Da ${d} features, con tutti i prodotti fino al grado ${pp}: <b>${big(cnt(d,pp))}</b> features.`}
  draw();
};

FIG.svtypes=function(st){
  let lv=-1.5;slider(st,'Peso della strada larga '+K('\\Rl'),-3,0.5,0.05,lv,v=>nf(Math.pow(10,v),3),v=>{lv=v;draw()});
  legend(st,[[C.blue,'classe −1','dot'],[C.orange,'classe +1','dot'],[C.yellow,'sul bordo','dot','background:transparent;box-shadow:inset 0 0 0 2px #FFFF00'],[C.pink,'α al massimo','dot','background:transparent;box-shadow:inset 0 0 0 2px #DC75CD']]);
  const p=lbPlot(st),gr=S('g',null,p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';gr.textContent='';const Cc=1/(Math.pow(10,lv)*OVL.length),s=svm2(OVL,Cc);
    [[0,'#fff',2.2,''],[1,C.yellow,1.3,'5 4'],[-1,C.yellow,1.3,'5 4']].forEach(a=>{const q=hline(p,s.w,s.b,a[0]);S('path',{d:p.poly([q[0],q[1]]),fill:'none',stroke:a[1],'stroke-width':a[2],'stroke-dasharray':a[3]},gr)});
    let n0=0,n1=0,n2=0;OVL.forEach((d,i)=>{const a=s.a[i];if(a<Cc*1e-4)n0++;else{const bd=a>Cc*(1-1e-4);if(bd)n2++;else n1++;S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:10,fill:'none',stroke:bd?C.pink:C.yellow,'stroke-width':2.4},g)}ring(g,p.sx(d[0]),p.sy(d[1]),col(d[2]),false,5)});
    res.innerHTML=`Su 40 punti: ${n0} con ${K('\\Al_i=0')}, ${n1} sul bordo, ${n2} con ${K('\\Al_i')} al massimo.`}
  draw();
};

FIG.span=function(st){
  let th=35,lam=0.5;const yv=2.4,L=1.5;
  slider(st,'Direzione del dato '+K('\\Xv'),0,180,1,th,v=>v+'°',v=>{th=v;draw()});slider(st,'Forza della multa '+K('\\Rl'),0,3,0.05,lam,v=>nf(v,2),v=>{lam=v;draw()});
  const p=Plot(st,{W:600,H:400,m:[34,10,10,42],xr:[-4.3,4.3],yr:[-2.69,2.69],label:'Piano dei pesi con un solo dato'});p.axes([-4,-2,0,2,4],[-2,0,2],'peso w₁','peso w₂');
  S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const x=[L*Math.cos(th*Math.PI/180),L*Math.sin(th*Math.PI/180)],al=yv/(L*L+lam),w=[al*x[0],al*x[1]];
    [-2,-1,1,2].forEach(k=>{const q=hline(p,x,0,yv+k*1.1);S('path',{d:p.poly([q[0],q[1]]),fill:'none',stroke:C.pink,'stroke-width':1,opacity:.3},g)});
    const q=hline(p,x,0,yv);S('path',{d:p.poly([q[0],q[1]]),fill:'none',stroke:C.pink,'stroke-width':2.4},g);
    const ex=[-80,80].map(k=>[x[0]*k,x[1]*k]);S('path',{d:p.poly(ex),fill:'none',stroke:C.blue,'stroke-width':1,'stroke-dasharray':'4 4',opacity:.6},g);
    const R=p.sx(Math.hypot(w[0],w[1]))-p.sx(0);S('circle',{cx:p.sx(0),cy:p.sy(0),r:R,fill:'none',stroke:C.orange,'stroke-width':1.2,opacity:.7},g);
    arrow(g,p.sx(0),p.sy(0),p.sx(x[0]),p.sy(x[1]),C.blue,3);
    const o=[q[3][0]-q[2][1]*1.5,q[3][1]+q[2][0]*1.5];S('line',{x1:p.sx(0),y1:p.sy(0),x2:p.sx(o[0]),y2:p.sy(o[1]),stroke:'#999','stroke-dasharray':'3 3'},g);S('circle',{cx:p.sx(o[0]),cy:p.sy(o[1]),r:6,fill:'#000',stroke:'#fff','stroke-width':2},g);
    S('circle',{cx:p.sx(w[0]),cy:p.sy(w[1]),r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},g);
    res.innerHTML=`Soluzione di ridge: ${K('\\Wv^*=\\Al\\,\\Xv')} con ${K('\\Al='+kn(al,2))}, lunghezza ${nf(Math.hypot(w[0],w[1]),2)} (cerchio arancione).<br>Il punto vuoto dà la previsione esatta ma è lungo ${nf(Math.hypot(o[0],o[1]),2)}: la parte perpendicolare a ${K('\\Xv')} è solo multa in più.`}
  draw();
};

FIG.dualcost=function(st){
  let ln=3,ld=2;const f=v=>'10'+['⁰','¹','²','³','⁴','⁵','⁶','⁷'][Math.round(v)]||'';
  slider(st,'Numero di dati '+K('N'),1,6,1,ln,v=>big(Math.pow(10,v)),v=>{ln=v;draw()});slider(st,'Numero di features '+K('d'),1,7,1,ld,v=>big(Math.pow(10,v)),v=>{ld=v;draw()});
  const p=Plot(st,{W:600,H:190,m:[14,10,14,42],xr:[0,22],yr:[0,2],label:'Costo delle due formule'});p.axes([0,3,6,9,12,15,18,21],null,'numero di operazioni (ordine di grandezza)',null,v=>v?'10'+String(v).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join(''):'1');
  const B=[[C.yellow,1.5,'formula nei pesi: matrice d × d'],[C.blue,0.55,'formula nei dati: matrice N × N']].map(a=>{const r=S('rect',{x:p.sx(0),y:p.sy(a[1])-4,height:26,fill:a[0]},p.g),t=S('text',{x:p.sx(0)+4,y:p.sy(a[1])-11,class:'tag'},p.top);t.textContent=a[2];return r}),res=out(st);res.style.minHeight='1.7em';
  function draw(){const N=Math.pow(10,ln),d=Math.pow(10,ld),c=[Math.log10(d**3+N*d*d),Math.log10(N**3+d*N*N)];B.forEach((r,i)=>r.setAttribute('width',p.sx(c[i])-p.sx(0)));
    const df=Math.abs(c[0]-c[1]);res.innerHTML=df<0.05?'Le due formule costano più o meno lo stesso.':`Conviene la formula ${c[0]<c[1]?'nei pesi':'nei dati'}: circa ${big(Math.pow(10,Math.round(df)))} volte meno operazioni.`}
  draw();
};

FIG.ktrick=function(st){
  let sd=3;btn(st,'Nuovi vettori',()=>{sd++;draw()});
  const duo=H('div',{class:'duo'},st),A=H('div',null,duo),B=H('div',null,duo);[A,B].forEach(e=>{e.style.cssText='font-family:Figtree,sans-serif;font-size:.95rem;line-height:1.9;text-align:left;padding:.4rem .6rem;border:1px solid #333;border-radius:8px'});
  const v3=a=>'('+a.map(x=>nf(x,0)).join(', ')+')',r2=Math.SQRT2,phi=a=>[a[0]*a[0],a[1]*a[1],a[2]*a[2],r2*a[0]*a[1],r2*a[0]*a[2],r2*a[1]*a[2]];
  function draw(){const r=rng(sd*17),gen=()=>[0,1,2].map(()=>{let v=0;while(!v)v=Math.round(r()*6-3);return v}),x=gen(),z=gen(),px=phi(x),pz=phi(z),s=x[0]*z[0]+x[1]*z[1]+x[2]*z[2],V=px.reduce((a,v,i)=>a+v*pz[i],0),f6=a=>'['+a.map(v=>nf(v,Number.isInteger(v)?0:2)).join('; ')+']';
    const head=`${K('\\Xv='+v3(x).replace(/−/g,'-'))} &nbsp; ${K("\\Xv'="+v3(z).replace(/−/g,'-'))}`;
    A.innerHTML=`<b>Strada lunga: passare per le sei features</b><br>${head}<br>${K('\\Ph(\\Xv)')} = ${f6(px)}<br>${K("\\Ph(\\Xv')")} = ${f6(pz)}<br>prodotto scalare, sei termini: <b style="color:${C.yellow}">${nf(V,0)}</b>`;
    B.innerHTML=`<b>Scorciatoia: il kernel</b><br>${head}<br>${K("\\Xv^\\top\\Xv'")} = ${x.map((v,i)=>'('+nf(v,0)+')·('+nf(z[i],0)+')').join(' + ')} = ${nf(s,0)}<br>al quadrato: <b style="color:${C.yellow}">${nf(s*s,0)}</b>`}
  draw();
};

FIG.gram=function(st){
  let lg=0;slider(st,'Parametro '+K('\\Gk'),-1.5,1.5,0.05,lg,v=>nf(Math.pow(10,v),2),v=>{lg=v;draw()});
  const r=rng(93),P=[];for(let i=0;i<6;i++)P.push([-1.2+0.5*r.n(),0.6+0.5*r.n()]);for(let i=0;i<6;i++)P.push([1.2+0.5*r.n(),-0.5+0.5*r.n()]);
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=Plot(dl,{W:420,H:360,m:[10,10,10,10],xr:[-3,3],yr:[-2.5,2.5],label:'Dodici punti in due gruppi'});
  P.forEach((d,i)=>{S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:11,fill:i<6?C.blue:C.orange,stroke:'#000'},p.g);const t=S('text',{x:p.sx(d[0]),y:p.sy(d[1])+4.5,'text-anchor':'middle',style:'fill:#000;font-size:12px;font-weight:700'},p.g);t.textContent=i+1});
  const svg=Svg(dr,420,360,'Matrice kernel dei dodici punti'),cs=26,x0=62,y0=30,cells=[];
  for(let i=0;i<12;i++){[[x0+i*cs+cs/2,y0-8,'middle'],[x0-8,y0+i*cs+cs/2+4,'end']].forEach(a=>{const t=S('text',{x:a[0],y:a[1],'text-anchor':a[2],style:`fill:${i<6?C.blue:C.orange};font-size:12px`},svg);t.textContent=i+1});
    for(let j=0;j<12;j++)cells.push(S('rect',{x:x0+j*cs,y:y0+i*cs,width:cs-1.5,height:cs-1.5},svg))}
  cap(dl,'i punti, numerati');const cr=cap(dr,'');
  function draw(){const gm=Math.pow(10,lg);for(let i=0;i<12;i++)for(let j=0;j<12;j++){const v=Math.exp(-gm*d2(P[i],P[j]));cells[i*12+j].setAttribute('fill',`rgb(${Math.round(24+231*v)},${Math.round(24+231*v)},${Math.round(24-10*v)})`)}
    cr.innerHTML=`matrice kernel: giallo = 1 (identici), scuro = 0`}
  draw();
};

FIG.ktrio=function(st){
  const tri=H('div',{class:'trio'},st);
  [['Kernel lineare',(a,b)=>dot(a,b),K("\\Xv^\\top\\Xv'")],['Kernel polinomiale, grado 2',(a,b)=>dot(a,b)**2,K("(\\Xv^\\top\\Xv')^2")],['Kernel RBF',(a,b)=>Math.exp(-d2(a,b)),K("e^{-\\lVert\\Xv-\\Xv'\\rVert^2}")]].forEach(o=>{const d=H('div',null,tri),p=Plot(d,{W:230,H:230,m:[4,4,4,4],xr:[-2.7,2.7],yr:[-2.7,2.7],label:o[0]});
    const s=ksvm(RING,o[1],10);heatClass(p,s.f,90);let e=0;RING.forEach(q=>{const w=s.f(q)*q[2]<0;if(w)e++;ring(p.g,p.sx(q[0]),p.sy(q[1]),col(q[2]),w,4)});
    cap(d,`<b>${o[0]}</b><br>${o[2]}<br>errori: ${e} su ${RING.length}`)});
};

const MOON=(function(){const r=rng(95),a=[];for(let i=0;i<30;i++){const t=Math.PI*(i+r())/30;a.push([1.5*Math.cos(t)-0.75+0.24*r.n(),1.5*Math.sin(t)-0.45+0.24*r.n(),1]);a.push([0.75-1.5*Math.cos(t)+0.24*r.n(),0.45-1.5*Math.sin(t)+0.24*r.n(),-1])}return a})();
FIG.rbfsvm=function(st){
  let lg=0,ll=-2;
  slider(st,'Parametro del kernel '+K('\\Gk'),-1.5,2,0.05,lg,v=>nf(Math.pow(10,v),2),v=>{lg=v;draw()});slider(st,'Regolarizzazione '+K('\\Rl'),-4,0,0.1,ll,v=>nf(Math.pow(10,v),4),v=>{ll=v;draw()});
  const p=Plot(st,{W:600,H:412,m:[34,10,10,42],xr:[-3.4,3.4],yr:[-2.2,2.2],label:'SVM con kernel RBF su due mezzelune'});p.axes([-2,0,2],[-2,0,2],'feature x₁','feature x₂');
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const gm=Math.pow(10,lg),s=ksvm(MOON,(a,b)=>Math.exp(-gm*d2(a,b)),1/(Math.pow(10,ll)*MOON.length));heatClass(p,s.f,130);let e=0;
    MOON.forEach(q=>{const w=s.f(q)*q[2]<0;if(w)e++;ring(g,p.sx(q[0]),p.sy(q[1]),col(q[2]),w,4.6)});
    res.innerHTML=`Errori sui dati di training: ${e} su 60. Vettori di supporto: ${s.nsv}.`}
  draw();
};

function solve(A,b){const n=b.length,Mx=A.map((r,i)=>r.concat([b[i]]));for(let c=0;c<n;c++){let pv=c;for(let r=c+1;r<n;r++)if(Math.abs(Mx[r][c])>Math.abs(Mx[pv][c]))pv=r;[Mx[c],Mx[pv]]=[Mx[pv],Mx[c]];
    for(let r=c+1;r<n;r++){const f=Mx[r][c]/Mx[c][c];for(let k=c;k<=n;k++)Mx[r][k]-=f*Mx[c][k]}}const x=new Array(n);for(let i=n-1;i>=0;i--){let s=Mx[i][n];for(let k=i+1;k<n;k++)s-=Mx[i][k]*x[k];x[i]=s/Mx[i][i]}return x}
FIG.kridge=function(st){
  let lg=0;slider(st,'Parametro del kernel '+K('\\Gk'),-1,1.5,0.05,lg,v=>nf(Math.pow(10,v),2),v=>{lg=v;draw()});
  const r=rng(97),xs=[],ys=[];for(let i=0;i<9;i++){const x=0.4+5.2*(i+0.2+0.6*r())/9;xs.push(x);ys.push(1.2*Math.sin(1.25*x)+0.12*r.n())}
  legend(st,[['#fff','dati','dot'],[C.blue,'contributo di ogni dato'],[C.yellow,'previsione (somma)']]);
  const p=Plot(st,{W:600,H:340,m:[40,10,12,42],xr:[0,6],yr:[-2.2,2.2],label:'Ridge con kernel RBF in una dimensione'});p.axes([0,1,2,3,4,5,6],[-2,-1,0,1,2],'x','y');S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#555'},p.bg);
  const gb=S('g',null,p.g),sm=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g);xs.forEach((x,i)=>S('circle',{cx:p.sx(x),cy:p.sy(ys[i]),r:5,fill:'#fff',stroke:'#000'},p.g));const res=out(st);res.style.minHeight='1.7em';
  function draw(){gb.textContent='';const gm=Math.pow(10,lg),kf=(a,b)=>Math.exp(-gm*(a-b)**2),A=xs.map((a,i)=>xs.map((b,j)=>kf(a,b)+(i===j?0.02*9:0))),al=solve(A,ys);
    al.forEach((a,i)=>S('path',{d:p.curve(x=>a*kf(xs[i],x),0,6,240),fill:'none',stroke:C.blue,'stroke-width':1.2,opacity:.75},gb));sm.setAttribute('d',p.curve(x=>al.reduce((s,a,i)=>s+a*kf(xs[i],x),0),0,6,400));
    res.innerHTML=gm>6?'Campane strette: la previsione tocca i dati e torna a zero fra l\'uno e l\'altro.':gm<0.25?'Campane larghissime: i contributi si sovrappongono molto e la curva è quasi rigida.':'Campane di larghezza intermedia: la somma segue i dati in modo liscio.'}
  draw();
};

FIG.mercer=function(st){
  let sd=1;btn(st,'Nuovi punti e nuovi numeri',()=>{sd++;draw()});
  const tri=H('div',{class:'trio'},st),PP=[['Kernel RBF',K("e^{-\\lVert\\Xv-\\Xv'\\rVert^2}"),(a,b)=>Math.exp(-d2(a,b))],['Kernel polinomiale',K("(\\Xv^\\top\\Xv')^2"),(a,b)=>dot(a,b)**2],['Candidata',K("-\\lVert\\Xv-\\Xv'\\rVert^2"),(a,b)=>-d2(a,b)]].map(o=>{const d=H('div',null,tri),p=Plot(d,{W:230,H:150,m:[6,6,6,22],xr:[-1.1,1.1],yr:[0,1],label:o[0]});p.axes([0],null);
    S('rect',{x:p.ax,y:p.ay,width:p.sx(0)-p.ax,height:p.ah,fill:'rgba(252,98,85,.14)'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#888'},p.bg);return {o,p,g:S('g',null,p.g),c:cap(d,'')}});
  function draw(){const r=rng(sd*31+5),X=Array.from({length:7},()=>[3*r()-1.5,3*r()-1.5]),Cs=Array.from({length:300},()=>X.map(()=>r.n())),J=Cs.map(()=>r());
    PP.forEach(e=>{e.g.textContent='';const Km=X.map(a=>X.map(b=>e.o[2](a,b))),v=Cs.map(c=>{let s=0;for(let i=0;i<7;i++)for(let j=0;j<7;j++)s+=c[i]*c[j]*Km[i][j];return s}),mx=Math.max(...v.map(Math.abs)),neg=v.filter(x=>x<-1e-9).length;
      v.forEach((x,i)=>S('circle',{cx:e.p.sx(x/mx),cy:e.p.sy(0.08+0.84*J[i]),r:2.6,fill:x<0?C.red:C.green,opacity:.85},e.g));
      e.c.innerHTML=`<b>${e.o[0]}</b><br>${e.o[1]}<br>${neg?`<span style="color:${C.red}">${neg} valori negativi: non è un kernel</span>`:'nessun valore negativo'}`})}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,ring,CC,pct}=M;
const lg2=x=>Math.log(x)/Math.LN2;
const ent=ps=>ps.reduce((s,p)=>s+(p>0?p*lg2(1/p):0),0),ent2=(a,b)=>a+b?ent([a/(a+b),b/(a+b)]):0;
const ez=t=>t*t*(3-2*t);

/* ---------- l'idea di un albero: i punti scendono e si separano ---------- */
FIG.treeidea=function(st){
  const W=600,Hh=380,svg=Svg(st,W,Hh,'Un albero di decisione separa i dati in gruppi sempre più puri');
  const NB={r:[300,50,200,62],a:[150,180,150,62],b:[450,180,150,62],aa:[70,318,110,50],ab:[215,318,90,50],ba:[385,318,90,50],bb:[530,318,120,50]};
  [['r','a'],['r','b'],['a','aa'],['a','ab'],['b','ba'],['b','bb']].forEach(e=>{const p=NB[e[0]],q=NB[e[1]];S('line',{x1:p[0],y1:p[1]+p[3]/2,x2:q[0],y2:q[1]-q[3]/2,stroke:'#666','stroke-width':1.5},svg)});
  Object.keys(NB).forEach(k=>{const b=NB[k];S('rect',{x:b[0]-b[2]/2,y:b[1]-b[3]/2,width:b[2],height:b[3],rx:9,fill:'#0c0c0c',stroke:k.length===2?'#fff':'#999','stroke-width':1.5},svg)});
  const lab=(x,y,t,an)=>{const e=S('text',{x,y,'text-anchor':an||'middle',class:'tag'},svg);e.textContent=t;return e};
  lab(410,44,'radice: tutti i dati','start');const l1=lab(16,120,'una domanda li divide','start'),l1b=lab(16,138,'in due nodi figli','start'),l2=lab(300,366,'foglie: qui si legge la previsione');
  const paths=[];[['a','aa',1,5],['a','ab',1,1],['a','ab',0,2],['b','ba',1,2],['b','bb',0,6]].forEach(q=>{for(let i=0;i<q[3];i++)paths.push({p:['r',q[0],q[1]],c:q[2]})});
  const slot=(k,i,n)=>{const b=NB[k],cols=Math.min(n,k==='r'?8:k.length===1?4:3),rows=Math.ceil(n/cols),c=i%cols,r=Math.floor(i/cols);return [b[0]+(c-(cols-1)/2)*19,b[1]+(r-(rows-1)/2)*19]};
  const cnt={},idx=paths.map(()=>[]);[0,1,2].forEach(l=>{paths.forEach((d,i)=>{const k=d.p[l];cnt[k]=cnt[k]||0;idx[i][l]=cnt[k]++})});
  const dots=paths.map(d=>S('circle',{r:7,fill:CC[d.c],stroke:'#000'},svg)),res=out(st);
  player(st,100,8,pos=>{const t1=ez(clamp((pos-10)/30,0,1)),t2=ez(clamp((pos-55)/30,0,1));
    paths.forEach((d,i)=>{const a=slot(d.p[0],idx[i][0],cnt[d.p[0]]),b=slot(d.p[1],idx[i][1],cnt[d.p[1]]),c=slot(d.p[2],idx[i][2],cnt[d.p[2]]),x=a[0]+(b[0]-a[0])*t1+(c[0]-b[0])*t2,y=a[1]+(b[1]-a[1])*t1+(c[1]-b[1])*t2;dots[i].setAttribute('cx',x);dots[i].setAttribute('cy',y)});
    l1.setAttribute('opacity',t1);l1b.setAttribute('opacity',t1);l2.setAttribute('opacity',t2);
    res.innerHTML=pos<10?'Nella radice le due classi sono mescolate: 8 arancioni e 8 blu.':pos<55?'Dopo la prima domanda ogni figlio è meno mescolato della radice: 6 contro 2 a sinistra, 2 contro 6 a destra.':'Dopo la seconda domanda tre foglie su quattro contengono una sola classe.'});
};

/* ---------- contenuto informativo ---------- */
FIG.surprise=function(st){
  let lp=-1;slider(st,'Probabilità dell\'evento '+K('p'),-3.3,0,0.01,lp,v=>{const p=Math.pow(10,v);return p<0.01?nf(p,4):nf(p,3)},v=>{lp=v;draw()});
  const p=Plot(st,{W:600,H:320,m:[40,10,14,42],xr:[0,1],yr:[0,11.5],label:'Contenuto informativo in funzione della probabilità'});p.axes([0,0.25,0.5,0.75,1],[0,2,4,6,8,10],'probabilità p dell\'evento','bit');
  S('path',{d:p.curve(x=>lg2(1/x),0.0004,1,900),fill:'none',stroke:C.pink,'stroke-width':2.8},p.g);
  [[0.5,'testa con una moneta: 1 bit',12,4],[1/6,'un 6 con un dado: 2,6 bit',12,4],[1/52,'una carta precisa da un mazzo di 52: 5,7 bit',12,4]].forEach(a=>{S('circle',{cx:p.sx(a[0]),cy:p.sy(lg2(1/a[0])),r:4.5,fill:'#fff',stroke:'#000'},p.g);const t=S('text',{x:p.sx(a[0])+a[2],y:p.sy(lg2(1/a[0]))+a[3],class:'tag'},p.top);t.textContent=a[1]});
  const dot=S('circle',{r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){const q=Math.pow(10,lp);dot.setAttribute('cx',p.sx(q));dot.setAttribute('cy',p.sy(lg2(1/q)));
    res.innerHTML=`Un evento con probabilità ${nf(q,q<0.01?4:3)} (uno su ${big(1/q)}) porta ${K('\\log_2\\frac1p='+kn(lg2(1/q),2))} bit.`}
  draw();
};

const LET='abcdefghijklmnopqrstuvwxyz␣',LP=[.0575,.0128,.0263,.0285,.0913,.0173,.0133,.0313,.0599,.0006,.0084,.0335,.0235,.0596,.0689,.0192,.0008,.0508,.0567,.0706,.0334,.0069,.0119,.0073,.0164,.0007,.1928];
FIG.letters=function(st){
  let sel=4;slider(st,'Lettera',0,26,1,sel,v=>'«'+(v===26?'spazio':LET[v])+'»',v=>{sel=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const mk=(d,yr,yt,label)=>{const p=Plot(d,{W:420,H:300,m:[42,10,8,30],xr:[-0.7,26.7],yr,label});p.axes(null,yt);LET.split('').forEach((c,i)=>{const t=S('text',{x:p.sx(i),y:p.ay+p.ah+16,'text-anchor':'middle',style:'font-size:11px'},p.axg);t.textContent=c});return p};
  const p=mk(dl,[0,0.2],[0,0.05,0.1,0.15,0.2],'Probabilità delle lettere'),q=mk(dr,[0,11],[0,2,4,6,8,10],'Contenuto informativo delle lettere');
  const b1=LP.map((v,i)=>S('rect',{x:p.sx(i)-5,width:10,y:p.sy(v),height:p.sy(0)-p.sy(v)},p.g)),b2=LP.map((v,i)=>S('rect',{x:q.sx(i)-5,width:10,y:q.sy(lg2(1/v)),height:q.sy(0)-q.sy(lg2(1/v))},q.g));
  const Hh=ent(LP);S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(Hh),y2:q.sy(Hh),stroke:'#fff','stroke-dasharray':'5 4','stroke-width':1.5},q.g);
  cap(dl,'<b>quanto è frequente</b> ogni lettera');cap(dr,'<b>quanti bit porta</b> ogni lettera<br>linea tratteggiata: la media pesata, '+nf(Hh,1)+' bit');
  const res=out(st);res.style.minHeight='1.7em';
  function draw(){b1.forEach((b,i)=>b.setAttribute('fill',i===sel?C.yellow:C.blue));b2.forEach((b,i)=>b.setAttribute('fill',i===sel?C.yellow:C.pink));
    res.innerHTML=`«${sel===26?'spazio':LET[sel]}»: probabilità ${pct(LP[sel],2)}, contenuto informativo ${K('\\log_2\\frac{1}{'+kn(LP[sel],4)+'}='+kn(lg2(1/LP[sel]),1))} bit.`}
  draw();
};

FIG.coin=function(st){
  let pv=0.5;slider(st,'Probabilità di testa '+K('p'),0,1,0.01,pv,v=>nf(v,2),v=>{pv=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const p=Plot(dl,{W:420,H:300,m:[40,10,12,42],xr:[0,1],yr:[0,1.08],label:'Entropia di una moneta'});p.axes([0,0.25,0.5,0.75,1],[0,0.5,1],'probabilità di testa','entropia (bit)');
  S('path',{d:p.curve(x=>ent([x,1-x]),0,1,300),fill:'none',stroke:C.pink,'stroke-width':2.8},p.g);const dot=S('circle',{r:7,fill:C.yellow,stroke:'#000','stroke-width':1.5},p.g),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#777','stroke-dasharray':'3 4'},p.bg);
  const svg=Svg(dr,420,300,'Quaranta lanci simulati'),cells=[];for(let i=0;i<40;i++)cells.push([S('circle',{cx:50+(i%8)*46,cy:46+Math.floor(i/8)*52,r:17,stroke:'#000'},svg),S('text',{x:50+(i%8)*46,y:52+Math.floor(i/8)*52,'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:#000'},svg)]);
  const U=(function(){const r=rng(104);return Array.from({length:40},()=>r())})();cap(dl,'<b>entropia</b> al variare di p');const cr=cap(dr,''),res=out(st);res.style.minHeight='1.7em';
  function draw(){const h=ent([pv,1-pv]);dot.setAttribute('cx',p.sx(pv));dot.setAttribute('cy',p.sy(h));ln.setAttribute('x1',p.sx(pv));ln.setAttribute('x2',p.sx(pv));let nt=0;
    cells.forEach((c,i)=>{const t=U[i]<pv;if(t)nt++;c[0].setAttribute('fill',t?C.yellow:C.lg);c[1].textContent=t?'T':'C'});cr.innerHTML=`<b>quaranta lanci</b> di questa moneta: ${nt} teste, ${40-nt} croci`;
    res.innerHTML=`Entropia: <b>${nf(h,2)} bit</b>. `+(h>0.97?'I lanci sono il più imprevedibili possibile.':h<0.3?'Quasi sempre la stessa faccia: poca sorpresa in media.':'Una faccia esce più spesso: si indovina più di una volta su due.')}
  draw();
};

/* ---------- information gain su una tabellina ---------- */
FIG.igtable=function(st){
  const D=[[1,1,1],[1,0,1],[1,1,1],[1,0,1],[0,1,1],[0,0,0]],W=600,Hh=346,svg=Svg(st,W,Hh,'Tabella di sei esempi e information gain delle due features'),TF=v=>v?'V':'F',col=y=>y?C.green:C.red;
  const T=(x,y,t,o)=>{const e=S('text',Object.assign({x,y,'text-anchor':'middle',style:'font-size:15px;fill:#ddd'},o||{}),svg);e.innerHTML=t;return e};
  ['X₁','X₂','Y'].forEach((h,j)=>T(40+j*44,26,h,{style:'font-size:15px;fill:#fff;font-weight:700'}));
  const yc=D.map((d,i)=>{[0,1].forEach(j=>{S('rect',{x:20+j*44,y:38+i*36,width:40,height:32,fill:'#161616',stroke:'#444'},svg);T(40+j*44,59+i*36,TF(d[j]))});
    const r=S('rect',{x:108,y:38+i*36,width:40,height:32,stroke:'#fff','stroke-width':1.2,style:'cursor:pointer',tabindex:0,role:'button','aria-label':'Cambia la risposta della riga '+(i+1)},svg),t=T(128,59+i*36,'',{style:'font-size:15px;fill:#000;font-weight:700;pointer-events:none'});
    const flip=()=>{d[2]=1-d[2];draw()};r.addEventListener('click',flip);r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}});return [r,t]});
  {const e=S('text',{x:20,y:278,class:'tag'},svg);e.textContent='clicca su una Y';const e2=S('text',{x:20,y:296,class:'tag'},svg);e2.textContent='per cambiarla'}
  const g=S('g',null,svg),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';yc.forEach((c,i)=>{c[0].setAttribute('fill',col(D[i][2]));c[1].textContent=TF(D[i][2])});const n1=D.filter(d=>d[2]).length,HY=ent2(n1,6-n1),IG=[];
    [0,1].forEach(j=>{const x0=190+j*208,e=(t,o)=>{const el=S('text',Object.assign({x:x0+95,'text-anchor':'middle',style:'font-size:14.5px;fill:#ddd'},o),g);el.innerHTML=t;return el};
      e(`Dividere secondo X${'₁₂'[j]}`,{y:26,style:'font-size:15px;fill:#fff;font-weight:700'});let hc=0;
      [1,0].forEach((v,k)=>{const rows=D.filter(d=>d[j]===v),a=rows.filter(d=>d[2]).length,h=ent2(a,rows.length-a),y0=42+k*120;hc+=rows.length/6*h;
        S('rect',{x:x0,y:y0,width:190,height:106,rx:8,fill:'#0e0e0e',stroke:'#555'},g);e(`X${'₁₂'[j]} = ${TF(v)} · ${rows.length} righe su 6`,{y:y0+22});
        rows.forEach((d,i)=>S('rect',{x:x0+95-rows.length*13+i*26,y:y0+34,width:22,height:22,fill:col(d[2])},g));e(rows.length?`entropia ${nf(h,2)} bit`:'nessuna riga',{y:y0+84})});
      IG.push(HY-hc);e(`entropia media pesata: ${nf(hc,2)}`,{y:302});e(`information gain: <tspan style="fill:${C.yellow};font-weight:700">${nf(HY-hc,2)} bit</tspan>`,{y:330,style:'font-size:16px;fill:#fff'})});
    res.innerHTML=`Entropia di Y prima di dividere: ${nf(HY,2)} bit. `+(Math.abs(IG[0]-IG[1])<1e-9?'Le due features danno lo stesso guadagno.':`Conviene dividere secondo ${K('X_'+(IG[0]>IG[1]?1:2))}.`)}
  draw();
};

/* ---------- l'esempio delle forme ---------- */
FIG.shapes=function(st){
  const E=[['Rosso','Quadrato','Grande',1,'#FC6255'],['Blu','Quadrato','Grande',1,'#58C4DD'],['Rosso','Cerchio','Grande',1,'#FC6255'],['Rosso','Cerchio','Piccolo',0,'#FC6255'],['Verde','Quadrato','Piccolo',0,'#83C167'],['Verde','Quadrato','Grande',0,'#83C167']];
  const shp=(g,x,y,e)=>{const s=e[2]==='Grande'?15:8;if(e[1]==='Quadrato')S('rect',{x:x-s,y:y-s,width:2*s,height:2*s,fill:e[4]},g);else S('circle',{cx:x,cy:y,r:s,fill:e[4]},g);const t=S('text',{x,y:y+34,'text-anchor':'middle',style:'font-size:17px;fill:#fff;font-weight:700'},g);t.textContent=e[3]?'+':'−'};
  const top=Svg(st,600,84,'I sei esempi con la loro classe');E.forEach((e,i)=>shp(top,60+i*96,28,e));cap(st,'i sei esempi: sotto ciascuno la sua classe');
  const tri=H('div',{class:'trio'},st);
  [['Colore',0],['Forma',1],['Dimensione',2]].forEach(f=>{const d=H('div',null,tri),svg=Svg(d,230,290,'Divisione secondo '+f[0]),vals=[...new Set(E.map(e=>e[f[1]]))];let hc=0,y=4;
    vals.forEach(v=>{const rows=E.filter(e=>e[f[1]]===v),a=rows.filter(e=>e[3]).length,h=ent2(a,rows.length-a);hc+=rows.length/6*h;const hh=vals.length===3?88:136,oy=vals.length===3?0:22;
      S('rect',{x:4,y,width:222,height:hh,rx:8,fill:'#0e0e0e',stroke:'#555'},svg);rows.forEach((e,i)=>shp(svg,116-(rows.length-1)*24+i*48,y+22+oy,e));
      const t2=S('text',{x:116,y:y+hh-9,'text-anchor':'middle',style:'font-size:12.5px;fill:#bbb'},svg);t2.textContent=v+': entropia '+nf(h,2)+' bit';y+=hh+8});
    cap(d,`<b>${f[0]}</b><br>entropia media pesata ${nf(hc,2)}<br>information gain <b style="color:${C.yellow}">${nf(1-hc,2)} bit</b>`)});
};

/* ---------- dati in due dimensioni e costruzione greedy ---------- */
const lab2=(x,y)=>((x>0.55&&y>0.42)||(x<0.3&&y<0.36))?1:0;
function gen2(n,seed,noise){const r=rng(seed),a=[];for(let i=0;i<n;i++){const x=r(),y=r();let c=lab2(x,y);if(r()<noise)c=1-c;a.push([x,y,c])}return a}
const TR=gen2(130,101,0.1),TE=gen2(600,102,0.1);
function best(P,feats){const n=P.length,n1=P.reduce((s,d)=>s+d[2],0),H0=ent2(n1,n-n1);let b=null;
  feats.forEach(f=>{const s=P.slice().sort((a,c)=>a[f]-c[f]);let l1=0;for(let i=1;i<n;i++){l1+=s[i-1][2];if(s[i][f]===s[i-1][f])continue;const g=H0-(i/n*ent2(l1,i-l1)+(n-i)/n*ent2(n1-l1,n-i-(n1-l1)));if(!b||g>b.g+1e-12)b={f,v:(s[i][f]+s[i-1][f])/2,g}}});return b}
function grow(P,maxD,opt,d){d=d||0;opt=opt||{};const n1=P.reduce((s,q)=>s+q[2],0),leaf={leaf:1,c:n1*2>=P.length?1:0,n:P.length,n1};
  if(d>=maxD||n1===0||n1===P.length||P.length<2)return leaf;const feats=opt.r?[opt.r()<0.5?0:1]:[0,1],b=best(P,feats);if(!b||b.g<=1e-9)return leaf;
  return {f:b.f,v:b.v,n:P.length,n1,l:grow(P.filter(q=>q[b.f]<b.v),maxD,opt,d+1),r:grow(P.filter(q=>q[b.f]>=b.v),maxD,opt,d+1)}}
const pred=(t,x)=>{while(!t.leaf)t=x[t.f]<t.v?t.l:t.r;return t.c},errOf=(t,P)=>P.reduce((s,q)=>s+(pred(t,q)!==q[2]?1:0),0)/P.length;
function boxes(t,b,o){if(t.leaf){o.push([b,t.c]);return}const l=b.slice(),r=b.slice();if(t.f===0){l[1]=t.v;r[0]=t.v}else{l[3]=t.v;r[2]=t.v}boxes(t.l,l,o);boxes(t.r,r,o)}
function sq(host,W,label){const p=Plot(host,{W,H:W-10,m:[34,10,10,42],xr:[0,1],yr:[0,1],label});p.axes([0,0.5,1],[0,0.5,1],'feature x₁','feature x₂');return p}

FIG.sweep=function(st){
  const P=(function(){const r=rng(107),a=[];for(let i=0;i<40;i++){const x=(i+r())/40;let c=x>0.58?1:0;if(r()<0.13)c=1-c;a.push([x,0,c])}return a})(),xs=P.map(d=>d[0]).sort((a,b)=>a-b),cand=[];for(let i=1;i<xs.length;i++)cand.push((xs[i]+xs[i-1])/2);
  const n=P.length,n1=P.reduce((s,d)=>s+d[2],0),H0=ent2(n1,n-n1),ig=v=>{const L=P.filter(d=>d[0]<v),l1=L.reduce((s,d)=>s+d[2],0);return [H0-(L.length/n*ent2(l1,L.length-l1)+(n-L.length)/n*ent2(n1-l1,n-L.length-(n1-l1))),L.length,l1]};
  let v=0.3;slider(st,'Soglia '+K('v')+' sulla feature '+K('\\Xs_1'),0.02,0.98,0.005,v,x=>nf(x,2),x=>{v=x;draw()});
  const p=Plot(st,{W:600,H:84,m:[40,8,12,8],xr:[0,1],yr:[0,1],label:'Quaranta punti lungo la feature x1'}),q=Plot(st,{W:600,H:240,m:[40,10,12,42],xr:[0,1],yr:[0,0.8],label:'Information gain per ogni soglia candidata'});
  q.axes([0,0.25,0.5,0.75,1],[0,0.2,0.4,0.6,0.8],'soglia v sulla feature x₁','information gain (bit)');
  const jj=rng(5);P.forEach(d=>ring(p.g,p.sx(d[0]),p.sy(d[2]?0.7:0.3)+(jj()-.5)*14,CC[d[2]],false,4.6));
  let bi=0;const gs=cand.map(c=>ig(c)[0]);gs.forEach((g,i)=>{if(g>gs[bi])bi=i});
  S('path',{d:q.poly(cand.map((c,i)=>[c,gs[i]])),fill:'none',stroke:C.pink,'stroke-width':1.3,opacity:.6},q.g);cand.forEach((c,i)=>S('circle',{cx:q.sx(c),cy:q.sy(gs[i]),r:i===bi?6:3.2,fill:i===bi?'#fff':C.pink,stroke:'#000'},q.g));
  const zl=S('rect',{y:p.ay,height:p.ah,x:p.ax,fill:'rgba(255,255,255,.09)'},p.bg),l1=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-width':2},p.g),l2=S('line',{y1:q.ay,y2:q.ay+q.ah,stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'5 4'},q.g),dot=S('circle',{r:6,fill:C.yellow,stroke:'#000'},q.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){const X=p.sx(v),r=ig(v);zl.setAttribute('width',X-p.ax);[l1,l2].forEach(l=>{l.setAttribute('x1',X);l.setAttribute('x2',X)});dot.setAttribute('cx',X);dot.setAttribute('cy',q.sy(r[0]));
    res.innerHTML=`A sinistra di ${K('v='+kn(v,2))}: ${r[1]} punti (${r[2]} arancioni). A destra: ${n-r[1]} punti (${n1-r[2]} arancioni).<br>Information gain: <b>${nf(r[0],3)} bit</b>. Il massimo, ${nf(gs[bi],3)}, si ha con ${K('v='+kn(cand[bi],2))} (punto bianco).`}
  draw();
};

FIG.rects=function(st){
  let dp=1;slider(st,'Profondità massima dell\'albero',0,6,1,dp,v=>v,v=>{dp=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=sq(dl,420,'Lo spazio delle features diviso in rettangoli'),gb=S('g',null,p.bg),gp=S('g',null,p.g);
  TR.forEach(d=>ring(gp,p.sx(d[0]),p.sy(d[1]),CC[d[2]],false,4));const svg=Svg(dr,420,410,'L\'albero corrispondente'),g=S('g',null,svg);
  cap(dl,'<b>lo spazio delle features</b>: il colore di ogni zona è la classe prevista');const cr=cap(dr,''),res=out(st);res.style.minHeight='1.7em';
  function draw(){gb.textContent='';g.textContent='';const t=grow(TR,dp),bx=[];boxes(t,[0,1,0,1],bx);
    bx.forEach(b=>S('rect',{x:p.sx(b[0][0]),y:p.sy(b[0][3]),width:p.sx(b[0][1])-p.sx(b[0][0]),height:p.sy(b[0][2])-p.sy(b[0][3]),fill:b[1]?'rgba(255,134,47,.28)':'rgba(88,196,221,.24)',stroke:'#000','stroke-width':1},gb));
    let li=0;const nl=bx.length,pos=(nd,d)=>{if(nd.leaf){nd.x=24+(nl>1?li*(372/(nl-1)):186);li++;nd.y=34+d*56;return}pos(nd.l,d+1);pos(nd.r,d+1);nd.x=(nd.l.x+nd.r.x)/2;nd.y=34+d*56};pos(t,0);
    const drawN=(nd,d)=>{if(!nd.leaf){[nd.l,nd.r].forEach(c=>{S('line',{x1:nd.x,y1:nd.y,x2:c.x,y2:c.y,stroke:'#777','stroke-width':1.3},g);drawN(c,d+1)});
        if(d<2){const w=112;S('rect',{x:nd.x-w/2,y:nd.y-14,width:w,height:28,rx:14,fill:'#000',stroke:'#fff','stroke-width':1.4},g);const tx=S('text',{x:nd.x,y:nd.y+5,'text-anchor':'middle',style:'font-size:15.5px;fill:#fff'},g);tx.textContent=`x${'₁₂'[nd.f]} < ${nf(nd.v,2)} ?`}
        else S('circle',{cx:nd.x,cy:nd.y,r:5,fill:'#000',stroke:'#fff','stroke-width':1.4},g)}
      else{const s=nl>20?4.5:7;S('rect',{x:nd.x-s,y:nd.y-s,width:2*s,height:2*s,fill:CC[nd.c],stroke:'#000'},g)}};drawN(t,0);
    cr.innerHTML=`<b>l'albero</b>: a sinistra «sì», a destra «no»; ${nl} ${nl===1?'foglia':'foglie'}`;
    res.innerHTML=`Errore sui 130 punti di training: ${pct(errOf(t,TR),1)}. Errore su 600 punti nuovi: ${pct(errOf(t,TE),1)}.`}
  draw();
};

FIG.depthU=function(st){
  legend(st,[[C.lg,'errore di training'],[C.red,'errore di test']]);
  const p=Plot(st,{W:600,H:300,m:[44,10,12,42],xr:[0,12],yr:[0,0.5],label:'Errore di training e di test al crescere della profondità'});p.axes([0,2,4,6,8,10,12],[0,0.1,0.2,0.3,0.4,0.5],'profondità massima dell\'albero',null,null,v=>Math.round(v*100)+'%');
  const R=[];for(let d=0;d<=12;d++){const t=grow(TR,d);R.push([errOf(t,TR),errOf(t,TE)])}let bi=0;R.forEach((r,i)=>{if(r[1]<R[bi][1])bi=i});
  [[0,C.lg,2],[1,C.red,2.8]].forEach(a=>{S('path',{d:p.poly(R.map((r,i)=>[i,r[a[0]]])),fill:'none',stroke:a[1],'stroke-width':a[2]},p.g);R.forEach((r,i)=>S('circle',{cx:p.sx(i),cy:p.sy(r[a[0]]),r:3.5,fill:a[1]},p.g))});
  const X=p.sx(bi),Y=p.sy(R[bi][1]);S('path',{d:`M${X-7} ${Y-7}L${X+7} ${Y+7}M${X-7} ${Y+7}L${X+7} ${Y-7}`,stroke:'#fff','stroke-width':2.5},p.g);
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`L'errore di test è minimo a profondità ${bi} (${pct(R[bi][1],1)}); l'albero completo arriva a ${pct(R[12][0],1)} sul training ma a ${pct(R[12][1],1)} sul test.`;
};

FIG.forest=function(st){
  const NT=60,r=rng(1010),trees=[];for(let k=0;k<NT;k++){const bs=Array.from({length:TR.length},()=>TR[Math.floor(r()*TR.length)]);trees.push(grow(bs,12,{r}))}
  const single=grow(TR,12);let n=1;slider(st,'Numero di alberi nella foresta',1,NT,1,n,v=>v,v=>{n=v;draw()});
  const duo=H('div',{class:'duo'},st),PP=[0,1].map(k=>{const d=H('div',null,duo),p=sq(d,420,k?'Voto della foresta':'Un solo albero profondo'),g=S('g',null,p.g);TR.forEach(q=>ring(g,p.sx(q[0]),p.sy(q[1]),CC[q[2]],false,3.4));return {p,c:cap(d,''),cv:document.createElement('canvas')}});
  const paint=(o,f)=>{const nx=96,cv=o.cv;cv.width=nx;cv.height=nx;const c=cv.getContext('2d'),im=c.createImageData(nx,nx);for(let j=0;j<nx;j++)for(let i=0;i<nx;i++){const v=f([(i+.5)/nx,1-(j+.5)/nx]),a=Math.abs(v-.5)*2,q=v>=.5?[255,134,47]:[88,196,221],k=4*(j*nx+i);im.data[k]=12+q[0]*a*.42;im.data[k+1]=12+q[1]*a*.42;im.data[k+2]=12+q[2]*a*.42;im.data[k+3]=255}c.putImageData(im,0,0);o.p.image(cv)};
  paint(PP[0],x=>pred(single,x));PP[0].c.innerHTML=`<b>un solo albero profondo</b><br>errore su punti nuovi: ${pct(errOf(single,TE),1)}`;const res=out(st);res.style.minHeight='1.7em';
  function draw(){const f=x=>{let s=0;for(let k=0;k<n;k++)s+=pred(trees[k],x);return s/n},e=TE.reduce((s,q)=>s+((f(q)>=.5?1:0)!==q[2]?1:0),0)/TE.length;paint(PP[1],f);
    PP[1].c.innerHTML=`<b>foresta di ${n} ${n===1?'albero':'alberi'}</b>: vota la maggioranza<br>errore su punti nuovi: ${pct(e,1)}`;res.innerHTML='Il colore più intenso indica zone in cui gli alberi sono più d\'accordo.'}
  draw();
};
M.tree={grow,pred,errOf,ent,ent2,lg2};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,ring,CC,pct,hline}=M;
const ez=t=>t*t*(3-2*t),FC=['#FFFF00','#FF862F'];/* limoni, arance */

/* ---------- limoni e arance ---------- */
function fruit(n,seed,noisy){const r=rng(seed),a=[];for(let i=0;i<n;i++){const w=7.7+0.55*r.n();a.push([w,w-0.4+0.35*r.n(),1])}for(let i=0;i<n;i++){const w=5.8+0.45*r.n();a.push([w,w+2.2+0.5*r.n(),0])}
  if(noisy)noisy.forEach(q=>a.push(q));return a.map(d=>[clamp(d[0],4.3,9.7),clamp(d[1],4.3,9.7),d[2]])}
const FR=fruit(20,111,[[7.9,7.4,0]]);
function knnVote(P,x,y,k){const d=P.map((q,i)=>[(q[0]-x)**2+(q[1]-y)**2,i]).sort((a,b)=>a[0]-b[0]);let s=0;for(let i=0;i<k;i++)s+=P[d[i][1]][2];return [s*2>k?1:0,d[0][1]]}

FIG.voronoi=function(st){
  let k=1;slider(st,'Numero di vicini '+K('\\Kk'),1,9,2,k,v=>v,v=>{k=v;draw()});
  legend(st,[[FC[0],'limoni','dot'],[FC[1],'arance','dot']]);
  const p=Plot(st,{W:470,H:462,m:[40,10,10,42],xr:[4,10],yr:[4,10],label:'Regioni di decisione del classificatore k-NN'});p.axes([4,6,8,10],[4,6,8,10],'larghezza (cm)','altezza (cm)');
  const nx=150,cv=document.createElement('canvas');cv.width=nx;cv.height=nx;const ctx=cv.getContext('2d'),im=ctx.createImageData(nx,nx),g=S('g',null,p.g);
  FR.forEach((d,i)=>{S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:i===FR.length-1?7:5,fill:FC[d[2]],stroke:i===FR.length-1?'#fff':'#000','stroke-width':i===FR.length-1?2.2:1},g)});
  const res=out(st);res.style.minHeight='3.4em';
  function draw(){const V=[],N=[];for(let j=0;j<nx;j++)for(let i=0;i<nx;i++){const r=knnVote(FR,4+(i+.5)/nx*6,10-(j+.5)/nx*6,k);V.push(r[0]);N.push(r[1])}
    for(let j=0;j<nx;j++)for(let i=0;i<nx;i++){const q=j*nx+i,c=V[q]?[255,134,47]:[255,255,0],a=V[q]?0.30:0.17;let e=0;
      if(i<nx-1&&j<nx-1){if(V[q]!==V[q+1]||V[q]!==V[q+nx])e=2;else if(k===1&&(N[q]!==N[q+1]||N[q]!==N[q+nx]))e=1}
      const b=e===2?[255,255,255,1]:e===1?[c[0],c[1],c[2],a*0.45]:[c[0],c[1],c[2],a];im.data[4*q]=10+b[0]*b[3]*.9;im.data[4*q+1]=10+b[1]*b[3]*.9;im.data[4*q+2]=10+b[2]*b[3]*.9;im.data[4*q+3]=255}
    ctx.putImageData(im,0,0);p.image(cv);
    res.innerHTML=k===1?'Con un solo vicino ogni punto di training comanda una cella (bordi scuri). Il limone anomalo, con il bordo bianco, si ritaglia un\'isola gialla in mezzo alle arance.':`Con ${k} vicini che votano, il limone anomalo è messo in minoranza: l'isola sparisce e il confine (linea bianca) si liscia.`}
  draw();
};

FIG.kchoice=function(st){
  const gen=(n,seed)=>{const r=rng(seed),a=[];for(let i=0;i<n;i++){const x=4+6*r(),y=4+6*r();let c=y<7+1.3*Math.sin(1.4*x)?1:0;if(r()<0.12)c=1-c;a.push([x,y,c])}return a},tr=gen(160,112),va=gen(500,113),KS=[];for(let k=1;k<=121;k+=4)KS.push(k);
  const err=(P,k)=>P.reduce((s,q)=>s+(knnVote(tr,q[0],q[1],k)[0]!==q[2]?1:0),0)/P.length,R=KS.map(k=>[err(tr,k),err(va,k)]);let bi=0;R.forEach((r,i)=>{if(r[1]<R[bi][1])bi=i});
  legend(st,[[C.lg,'errore di training'],[C.red,'errore di validation']]);
  const p=Plot(st,{W:600,H:300,m:[44,10,12,42],xr:[0,123],yr:[0,0.4],label:'Errore di training e di validation al variare di K'});p.axes([1,21,41,61,81,101,121],[0,0.1,0.2,0.3,0.4],'numero di vicini K',null,null,v=>Math.round(v*100)+'%');
  [[0,C.lg,2],[1,C.red,2.8]].forEach(a=>S('path',{d:p.poly(R.map((r,i)=>[KS[i],r[a[0]]])),fill:'none',stroke:a[1],'stroke-width':a[2]},p.g));
  const X=p.sx(KS[bi]),Y=p.sy(R[bi][1]);S('path',{d:`M${X-7} ${Y-7}L${X+7} ${Y+7}M${X-7} ${Y+7}L${X+7} ${Y-7}`,stroke:'#fff','stroke-width':2.5},p.g);
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`Su questi dati l'errore di validation è minimo con ${K('\\Kk='+KS[bi])} (${pct(R[bi][1],1)}). Con ${K('\\Kk=1')} l'errore di training è zero, ma quello di validation è ${pct(R[0][1],1)}.`;
};

FIG.curse=function(st){
  const DS=[1,2,3,5,10,20,50,100,200,500,1000],r=rng(115),R=DS.map(d=>{const ds=[];for(let i=0;i<200;i++){let s=0;for(let j=0;j<d;j++){const u=r()-r();s+=u*u}ds.push(Math.sqrt(s))}ds.sort((a,b)=>a-b);return ds});
  let di=1;slider(st,'Numero di features '+K('d'),0,DS.length-1,1,di,v=>big(DS[v]),v=>{di=v;draw()});
  const p=Plot(st,{W:600,H:86,m:[14,8,70,26],xr:[0,1],yr:[0,1],label:'Distanze dei duecento punti dal punto di riferimento'});p.axes([0,0.5,1],null,null,null,v=>v===0?'0':v===1?'il più lontano':'metà strada');
  const q=Plot(st,{W:600,H:230,m:[44,10,34,42],xr:[0,3],yr:[0,1.05],label:'Rapporto fra distanza del più vicino e del più lontano'});q.axes([0,1,2,3],[0,0.5,1],'numero di features d','distanza del più vicino ÷ distanza del più lontano',v=>big(Math.pow(10,v)));
  S('path',{d:q.poly(DS.map((d,i)=>[Math.log10(d),R[i][0]/R[i][199]])),fill:'none',stroke:C.pink,'stroke-width':2.6},q.g);
  const g=S('g',null,p.g),dot=S('circle',{r:6.5,fill:C.yellow,stroke:'#000'},q.g),res=out(st);res.style.minHeight='1.7em';const J=Array.from({length:200},()=>r());
  function draw(){g.textContent='';const ds=R[di],mx=ds[199];ds.forEach((v,i)=>S('circle',{cx:p.sx(v/mx),cy:p.sy(0.15+0.7*J[i]),r:3,fill:i===0?'#fff':C.blue,opacity:i===0?1:.75},g));
    dot.setAttribute('cx',q.sx(Math.log10(DS[di])));dot.setAttribute('cy',q.sy(ds[0]/mx));res.innerHTML=`Con ${big(DS[di])} features il punto più vicino (bianco) è a ${pct(ds[0]/mx)} della distanza del più lontano.`}
  draw();
};

FIG.mnisterr=function(st){
  const D=[['classificatore lineare',12.0,0],['rete neurale a 2 strati, 300 unità nascoste',4.7,0],['k-NN, distanza euclidea',5.0,1],['k-NN su immagini raddrizzate',2.4,1],['k-NN con distanza «tangente»',1.1,1],['SVM con kernel polinomiale di grado 4',1.1,0],['rete convoluzionale LeNet-5',0.8,0]];
  const W=600,rh=40,svg=Svg(st,W,D.length*rh+34,'Errore di test su MNIST per diversi metodi');
  D.forEach((d,i)=>{const y=8+i*rh,w=d[1]/12*330;const t=S('text',{x:8,y:y+13,class:'tag'},svg);t.textContent=d[0];S('rect',{x:8,y:y+19,width:w,height:13,fill:d[2]?C.yellow:C.lg},svg);const v=S('text',{x:16+w,y:y+31,style:'font-size:14px;fill:#fff'},svg);v.textContent=nf(d[1],1)+'%'});
  const t=S('text',{x:8,y:D.length*rh+26,class:'tag'},svg);t.textContent='errore sul test set (più corto è meglio); in giallo le varianti di k-NN';
};

/* ---------- il neurone ---------- */
FIG.allornone=function(st){
  let s=0.35;const th=0.6;slider(st,'Intensità dello stimolo',0,1,0.01,s,v=>nf(v,2),v=>{s=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const p=Plot(dl,{W:420,H:250,m:[20,10,20,12],xr:[0,1],yr:[0,1.05],label:'Stimolo e soglia'});S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.ay+p.ah,y2:p.ay+p.ah,stroke:'#555'},p.axg);
  const bar=S('rect',{x:p.sx(0.38),width:p.sx(0.62)-p.sx(0.38),fill:C.blue},p.g);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(th),y2:p.sy(th),stroke:'#fff','stroke-dasharray':'6 4','stroke-width':1.6},p.g);const tl=S('text',{x:p.ax+6,y:p.sy(th)-7,class:'tag'},p.top);tl.textContent='soglia';
  const q=Plot(dr,{W:420,H:250,m:[20,10,20,12],xr:[0,1],yr:[-0.1,1.2],label:'Risposta del neurone'});S('line',{x1:q.ax,x2:q.ax+q.aw,y1:q.sy(0),y2:q.sy(0),stroke:'#555'},q.axg);
  const tr=S('path',{fill:'none',stroke:C.green,'stroke-width':2.6},q.g);cap(dl,'<b>stimolo</b> che arriva al neurone');const cr=cap(dr,'');
  function draw(){bar.setAttribute('y',p.sy(s));bar.setAttribute('height',p.sy(0)-p.sy(s));const on=s>=th;bar.setAttribute('fill',on?C.orange:C.blue);
    tr.setAttribute('d',q.curve(x=>on?[0.2,0.5,0.8].reduce((a,c)=>a+Math.exp(-(((x-c)/0.018)**2)),0):0,0,1,600));cr.innerHTML=on?'<b>risposta</b>: impulsi di ampiezza piena':'<b>risposta</b>: nessuna'}
  draw();
};

FIG.neuron=function(st){
  const x=[1,0.5,0.8],w=[0.8,-1.2,0.6],b=-0.3;
  x.forEach((v,i)=>slider(st,'Input '+K('\\Xs_'+(i+1)),0,1,0.05,v,u=>nf(u,2),u=>{x[i]=u;draw()}));
  const W=600,Hh=300,svg=Svg(st,W,Hh,'Un neurone artificiale con tre input'),g=S('g',null,svg),res=out(st);res.style.minHeight='1.7em';
  const T=(xx,y,t,o)=>{const e=S('text',Object.assign({x:xx,y,'text-anchor':'middle',style:'font-size:15px;fill:#fff'},o||{}),g);e.textContent=t;return e};
  function draw(){g.textContent='';const ys=[60,150,240],cx=330,cy=150;let a=b;
    x.forEach((v,i)=>{const pr=w[i]*v;a+=pr;S('line',{x1:92,y1:ys[i],x2:cx-52,y2:cy+(ys[i]-cy)*0.3,stroke:w[i]>0?C.yellow:C.red,'stroke-width':1.2+7*Math.abs(pr),opacity:.85},g);
      S('circle',{cx:70,cy:ys[i],r:22,fill:'#000',stroke:C.blue,'stroke-width':2},g);T(70,ys[i]+5,nf(v,2),{style:`font-size:15px;fill:${C.blue}`});
      T(102,ys[i]+(i===2?40:-30),`× ${nf(w[i],1)} = ${nf(pr,2)}`,{style:'font-size:14px;fill:#ddd','text-anchor':'start'})});
    S('circle',{cx,cy,r:52,fill:'#000',stroke:'#fff','stroke-width':2.4},g);T(cx,cy-14,'somma + b',{class:'tag',style:''});T(cx,cy+12,nf(a,2),{style:'font-size:20px;fill:#fff;font-weight:700'});T(cx,cy+92,`b = ${nf(b,1)}`,{class:'tag',style:''});S('line',{x1:cx,y1:cy+78,x2:cx,y2:cy+54,stroke:'#999'},g);
    const on=a>0;arrow(g,cx+54,cy,cx+150,cy,on?C.green:'#666',on?4:2);S('circle',{cx:cx+186,cy,r:30,fill:on?C.green:'#000',stroke:C.green,'stroke-width':2},g);T(cx+186,cy+7,on?'1':'0',{style:`font-size:22px;font-weight:700;fill:${on?'#000':C.green}`});T(cx+186,cy+56,'output',{class:'tag',style:''});
    res.innerHTML=`${K('a='+x.map((v,i)=>'('+kn(w[i],1)+')('+kn(v,2)+')').join('+')+kn(b,1)+'='+kn(a,2))}: ${on?'supera lo zero, il neurone si attiva.':'non supera lo zero, il neurone resta spento.'}`}
  draw();
};

/* ---------- XOR: nessuna retta ---------- */
FIG.xor=function(st){
  let th=45,off=0.7;const P=[[0,0,-1],[1,1,-1],[0,1,1],[1,0,1]];
  slider(st,'Rotazione della retta',0,360,1,th,v=>v+'°',v=>{th=v;draw()});slider(st,'Spostamento della retta',-1.5,1.5,0.02,off,v=>nf(v,2),v=>{off=v;draw()});
  const p=Plot(st,{W:470,H:462,m:[40,10,10,42],xr:[-0.7,1.7],yr:[-0.7,1.7],label:'I quattro punti dello XOR e una retta'});p.axes([0,1],[0,1],'input x₁','input x₂');
  const zone=S('path',{fill:'rgba(255,134,47,.14)'},p.bg),ln=S('path',{fill:'none',stroke:'#fff','stroke-width':2.2},p.g),g=S('g',null,p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const w=[Math.cos(th*Math.PI/180),Math.sin(th*Math.PI/180)],q=hline(p,w,-off,0),u=q[2];ln.setAttribute('d',p.poly([q[0],q[1]]));
    zone.setAttribute('d',p.poly([q[0],q[1],[q[1][0]+u[0]*20,q[1][1]+u[1]*20],[q[0][0]+u[0]*20,q[0][1]+u[1]*20]])+'Z');let e=0;
    P.forEach(d=>{const bad=(w[0]*d[0]+w[1]*d[1]-off>0?1:-1)!==d[2];if(bad)e++;ring(g,p.sx(d[0]),p.sy(d[1]),d[2]>0?C.orange:C.blue,bad,13);const t=S('text',{x:p.sx(d[0]),y:p.sy(d[1])+6,'text-anchor':'middle',style:'font-size:17px;font-weight:700;fill:#000'},g);t.textContent=d[2]>0?'1':'0'});
    res.innerHTML=`Punti dalla parte sbagliata: <b>${e}</b> su 4. Con una retta non si scende mai sotto 1.`}
  draw();
};

/* ---------- l'esempio di apprendimento delle slide ---------- */
FIG.plearn=function(st){
  const eta=0.2,SEQ=[[1,1,1],[2,-2,-1],[-1,-1.5,-1],[-2,-1,-1],[-2,1,1],[1.5,-0.5,1]],ALL=[[-2,1,1],[1,1,1],[1.5,-0.5,1],[-2,-1,-1],[-1,-1.5,-1],[2,-2,-1]];
  const ST=[];{let w=[0,1,0.5];SEQ.forEach(x=>{const s=w[0]+w[1]*x[0]+w[2]*x[1],ok=(s>0?1:-1)===x[2],nw=ok?w.slice():[w[0]+eta*x[2],w[1]+eta*x[2]*x[0],w[2]+eta*x[2]*x[1]];ST.push({x,w:w.slice(),nw,s,ok});w=nw});ST.push({fin:1,w:w.slice(),nw:w.slice()})}
  const p=Plot(st,{W:600,H:462,m:[34,10,10,42],xr:[-3.2,3.2],yr:[-2.42,2.42],label:'Il perceptron impara a separare sei punti'});p.axes([-2,-1,0,1,2],[-2,-1,0,1,2],'input x₁','input x₂');
  legend(st,[[C.orange,'classe +1','dot'],[C.blue,'classe −1','dot'],[C.yellow,'vettore dei pesi (w₁, w₂)']]);
  const zone=S('path',{fill:'rgba(255,134,47,.12)'},p.bg),ln=S('path',{fill:'none',stroke:'#fff','stroke-width':2.2},p.g),ga=S('g',null,p.g),g=S('g',null,p.g),res=out(st),PER=18;
  const f2=v=>nf(v,1),vec=w=>'('+w.map(f2).join('; ')+')';
  player(st,ST.length*PER,8,pos=>{const k=Math.min(ST.length-1,Math.floor(pos/PER)),fr=pos/PER-k,s=ST[k],t=s.fin||s.ok?0:ez(clamp((fr-0.45)/0.45,0,1)),w=s.w.map((v,i)=>v+(s.nw[i]-v)*t);
    g.textContent='';ga.textContent='';const q=hline(p,[w[1],w[2]],w[0],0),u=q[2];ln.setAttribute('d',p.poly([q[0],q[1]]));zone.setAttribute('d',p.poly([q[0],q[1],[q[1][0]+u[0]*20,q[1][1]+u[1]*20],[q[0][0]+u[0]*20,q[0][1]+u[1]*20]])+'Z');
    arrow(ga,p.sx(q[3][0]),p.sy(q[3][1]),p.sx(q[3][0]+w[1]),p.sy(q[3][1]+w[2]),C.yellow,3);
    if(!s.fin){const a=clamp(fr/0.2,0,1);S('circle',{cx:p.sx(s.x[0]),cy:p.sy(s.x[1]),r:16,fill:'none',stroke:s.ok?C.green:C.red,'stroke-width':3,opacity:a},g)}
    ALL.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]),d[2]>0?C.orange:C.blue,false,7));
    res.innerHTML=s.fin?`Pesi finali ${K('\\Wv='+vec(s.w).replace(/−/g,'-').replace(/,/g,'{,}'))}: tutti e sei i punti sono dalla parte giusta. L'algoritmo si ferma.`:
      `Passo ${k+1}: punto (${f2(s.x[0])}; ${f2(s.x[1])}) di classe ${s.x[2]>0?'+1':'−1'}. Punteggio ${nf(s.s,2)}: `+(s.ok?'<b style="color:#83C167">corretto</b>, i pesi non cambiano.':`<b style="color:#FC6255">sbagliato</b>.<br>Nuovi pesi: ${vec(s.w)} ${s.x[2]>0?'+':'−'} 0,2 · (1; ${f2(s.x[0])}; ${f2(s.x[1])}) = <b>${vec(s.nw)}</b>`)});
};

/* ---------- teorema di convergenza ---------- */
FIG.pbound=function(st){
  const ws=[Math.cos(0.5),Math.sin(0.5)],r=rng(118),BASE=[];for(let i=0;i<40;i++){const y=i<20?1:-1;BASE.push([Math.abs(r.n())*0.7,2.6*(r()-0.5),y])}
  const mk=gap=>BASE.map(b=>{const a=(gap/2+b[0])*b[2];return [a*ws[0]-b[1]*ws[1],a*ws[1]+b[1]*ws[0],b[2]]});
  const run=P=>{let w=[0,0],k=0;for(let ep=0;ep<3000;ep++){let ch=0;P.forEach(d=>{const s=w[0]*d[0]+w[1]*d[1];if((s>=0?1:-1)!==d[2]){w=[w[0]+d[2]*d[0],w[1]+d[2]*d[1]];k++;ch=1}});if(!ch)break}return [w,k]};
  const stat=gap=>{const P=mk(gap),R=Math.max(...P.map(d=>Math.hypot(d[0],d[1]))),gm=Math.min(...P.map(d=>d[2]*(ws[0]*d[0]+ws[1]*d[1]))),o=run(P);return {P,R,gm,w:o[0],k:o[1],bd:R*R/(gm*gm)}};
  let gap=0.3;slider(st,'Distanza fra le due classi',0.04,1.5,0.01,gap,v=>nf(v,2),v=>{gap=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=Plot(dl,{W:420,H:330,m:[10,10,10,10],xr:[-4.2,4.2],yr:[-3.2,3.2],label:'Due classi separabili e la retta trovata'}),g=S('g',null,p.g);
  const GS=[];for(let x=0.04;x<=1.501;x+=0.02)GS.push(x);const CU=GS.map(x=>stat(x));
  const q=Plot(dr,{W:420,H:330,m:[62,10,12,42],xr:[0,1.5],yr:[0,5],label:'Errori commessi e limite teorico'});q.axes([0,0.5,1,1.5],[0,1,2,3,4,5],'distanza fra le classi',null,null,v=>big(Math.pow(10,v)));
  S('path',{d:q.poly(CU.map((c,i)=>[GS[i],Math.log10(c.bd)])),fill:'none',stroke:C.pink,'stroke-width':2.4},q.g);S('path',{d:q.poly(CU.map((c,i)=>[GS[i],Math.log10(Math.max(1,c.k))])),fill:'none',stroke:C.yellow,'stroke-width':2.4},q.g);
  const l2=S('line',{y1:q.ay,y2:q.ay+q.ah,stroke:'#fff','stroke-dasharray':'5 4'},q.g);cap(dl,'<b>i dati</b> e la retta trovata dal perceptron');cap(dr,`<b style="color:${C.yellow}">errori commessi</b> e <b style="color:${C.pink}">limite ${K('R^2/\\gamma^2')}</b> (scala logaritmica)`);
  const res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';const s=stat(gap),ql=hline(p,s.w,0,0);S('path',{d:p.poly([ql[0],ql[1]]),fill:'none',stroke:'#fff','stroke-width':2.2},g);S('circle',{cx:p.sx(0),cy:p.sy(0),r:p.sx(s.R)-p.sx(0),fill:'none',stroke:'#666','stroke-dasharray':'4 4'},g);
    s.P.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]),d[2]>0?C.orange:C.blue,false,4.2));l2.setAttribute('x1',q.sx(gap));l2.setAttribute('x2',q.sx(gap));
    res.innerHTML=`${K('R='+kn(s.R,2))} (cerchio tratteggiato), ${K('\\gamma='+kn(s.gm,2))}: al più ${big(Math.floor(s.bd))} errori. Il perceptron ne ha commessi <b>${s.k}</b>.`}
  draw();
};
/* ---------- motivi traslati: nessun classificatore lineare ---------- */
FIG.shiftpat=function(st){
  const A=[0,1,2,5],B=[0,1,4,5],N=16;let sh=3;slider(st,'Traslazione',0,15,1,sh,v=>v+' caselle',v=>{sh=v;draw()});
  const W=600,Hh=250,svg=Svg(st,W,Hh,'Due motivi traslati e la media delle loro traslazioni'),g=S('g',null,svg),cw=30,x0=96;
  const row=(y,vals,lab,col)=>{const t=S('text',{x:x0-12,y:y+20,'text-anchor':'end',style:`font-size:15px;fill:${col||'#fff'}`},g);t.textContent=lab;vals.forEach((v,i)=>{const c=Math.round(20+235*v);S('rect',{x:x0+i*cw,y,width:cw-3,height:28,fill:`rgb(${c},${c},${c})`,stroke:'#555'},g)})};
  function draw(){g.textContent='';const pat=P=>Array.from({length:N},(_,i)=>P.includes(((i-sh)%N+N)%N)?1:0);
    row(14,pat(A),'motivo A',C.orange);row(58,pat(B),'motivo B',C.blue);const t=S('text',{x:x0,y:128,class:'tag'},g);t.textContent='media su tutte le 16 traslazioni (ogni casella vale ¼):';
    row(142,new Array(N).fill(0.25),'media di A',C.orange);row(186,new Array(N).fill(0.25),'media di B',C.blue)}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,lstsq,Svg,proj3,wire,arrow,cap,ring,CC,pct,hline,sig}=M;
const ez=t=>t*t*(3-2*t);
function pick(host,label,items,sel,cb){const c=H('div',{class:'ctl'},host);H('span',{class:'ctl-l'},c,label);return buttons(c,items,sel,cb)}

/* ---------- piccola libreria per reti a strati ---------- */
const ACT={tanh:[Math.tanh,(a,z)=>1-z*z],sig:[sig,(a,z)=>z*(1-z)],relu:[a=>Math.max(0,a),a=>a>0?1:0],lin:[a=>a,()=>1]};
function mk(sizes,seed,scale){const r=rng(seed),W=[],b=[];for(let l=1;l<sizes.length;l++){const s=(scale||1)/Math.sqrt(sizes[l-1]);W.push(Array.from({length:sizes[l]},()=>Array.from({length:sizes[l-1]},()=>s*r.n())));b.push(Array.from({length:sizes[l]},()=>0.1*s*r.n()))}return {sizes,W,b}}
function fwd(net,x,act){const zs=[x],as=[];let z=x;const L=net.W.length;for(let l=0;l<L;l++){const a=net.W[l].map((row,j)=>{let s=net.b[l][j];for(let i=0;i<row.length;i++)s+=row[i]*z[i];return s});as.push(a);z=l<L-1?a.map(ACT[act][0]):a;zs.push(z)}return {as,zs}}
function bwd(net,c,d,act){const L=net.W.length,gW=[],gb=[];for(let l=L-1;l>=0;l--){gW[l]=d.map(dj=>c.zs[l].map(zi=>dj*zi));gb[l]=d;if(l>0){const prev=c.zs[l],nd=new Array(prev.length);for(let i=0;i<prev.length;i++){let s=0;for(let j=0;j<d.length;j++)s+=net.W[l][j][i]*d[j];nd[i]=s*ACT[act][1](c.as[l-1][i],prev[i])}d=nd}}return {gW,gb}}
/* un passo di discesa su un gruppo di esempi; delta(aOut,y) → [delta, loss] */
function step(net,X,Y,act,lr,delta,l2){const L=net.W.length,GW=net.W.map(w=>w.map(r=>r.map(()=>0))),GB=net.b.map(b=>b.map(()=>0));let loss=0;
  for(let n=0;n<X.length;n++){const c=fwd(net,X[n],act),dl=delta(c.as[L-1],Y[n]);loss+=dl[1];const g=bwd(net,c,dl[0],act);for(let l=0;l<L;l++)for(let j=0;j<GW[l].length;j++){GB[l][j]+=g.gb[l][j];const gr=g.gW[l][j],G=GW[l][j];for(let i=0;i<G.length;i++)G[i]+=gr[i]}}
  const k=lr/X.length;for(let l=0;l<L;l++)for(let j=0;j<GW[l].length;j++){net.b[l][j]-=k*GB[l][j];const w=net.W[l][j],G=GW[l][j];for(let i=0;i<w.length;i++)w[i]-=k*G[i]+(l2?lr*l2*w[i]:0)}return loss/X.length}
const dMSE=(a,y)=>{const d=a.map((v,i)=>v-y[i]);return [d,0.5*d.reduce((s,v)=>s+v*v,0)]};
const dBCE=(a,y)=>{const p=sig(a[0]);return [[p-y[0]],-(y[0]*Math.log(p+1e-12)+(1-y[0])*Math.log(1-p+1e-12))]};
const dCE=(a,y)=>{const m=Math.max(...a),e=a.map(v=>Math.exp(v-m)),s=e.reduce((u,v)=>u+v,0),p=e.map(v=>v/s);let l=0;const d=p.map((v,i)=>{if(y[i])l-=Math.log(v+1e-12);return v-y[i]});return [d,l]};
const clone=n=>({sizes:n.sizes,W:n.W.map(w=>w.map(r=>r.slice())),b:n.b.map(b=>b.slice())});
const lerpNet=(A,B,t)=>({sizes:A.sizes,W:A.W.map((w,l)=>w.map((r,j)=>r.map((v,i)=>v+(B.W[l][j][i]-v)*t))),b:A.b.map((b,l)=>b.map((v,j)=>v+(B.b[l][j]-v)*t))});
M.nn={ACT,mk,fwd,bwd,step,dMSE,dBCE,dCE,clone,lerpNet};M.pick=pick;

/* ---------- XOR con uno strato nascosto ---------- */
const XP=[[0,0],[0,1],[1,0],[1,1]],gr=v=>v>0?1:0,xh=x=>[gr(x[0]+x[1]-0.5),gr(x[0]+x[1]-1.5)],xy=h=>gr(h[0]-h[1]-0.5);
FIG.xornet=function(st){
  let sel=1;pick(st,'Scegli l\'input '+K('(\\Xs_1,\\Xs_2)'),['(0, 0)','(0, 1)','(1, 0)','(1, 1)'],sel,i=>{sel=i;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const p=Plot(dl,{W:420,H:412,m:[36,10,10,42],xr:[-0.6,1.6],yr:[-0.6,1.6],label:'Il piano degli input con le rette dei due neuroni nascosti'});p.axes([0,1],[0,1],'input x₁','input x₂');
  S('path',{d:p.poly([[-0.6,1.1],[1.1,-0.6],[1.6,-0.1],[1.6,-0.1],[-0.1,1.6],[-0.6,1.6]])+'Z',fill:'rgba(255,134,47,.0)'},p.bg);
  S('path',{d:p.poly([[-0.6,1.1],[1.1,-0.6],[1.6,-0.6],[1.6,-0.1],[-0.1,1.6],[-0.6,1.6]])+'Z',fill:'rgba(255,134,47,.16)'},p.bg);
  [[0.5,C.yellow],[1.5,C.pink]].forEach(a=>S('path',{d:p.poly([[-0.6,a[0]+0.6],[1.6,a[0]-1.6]]),fill:'none',stroke:a[1],'stroke-width':2.2},p.g));
  const gp=S('g',null,p.g),svg=Svg(dr,420,412,'La rete che calcola lo XOR'),g=S('g',null,svg);
  cap(dl,`<b>il piano degli input</b>: retta gialla ${K('h_1')}, retta rosa ${K('h_2')}; nella fascia arancione l'output è 1`);cap(dr,'<b>la rete</b>: sui collegamenti i pesi, accanto ai nodi i bias');
  const res=out(st);res.style.minHeight='3.4em';
  const N={x1:[70,120],x2:[70,290],h1:[220,120],h2:[220,290],y:[360,205]},E=[['x1','h1',1],['x2','h1',1],['x1','h2',1],['x2','h2',1],['h1','y',1],['h2','y',-1]];
  function draw(){gp.textContent='';g.textContent='';const x=XP[sel],h=xh(x),y=xy(h),val={x1:x[0],x2:x[1],h1:h[0],h2:h[1],y};
    XP.forEach((q,i)=>{const o=xy(xh(q));if(i===sel)S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:19,fill:'none',stroke:'#fff','stroke-width':2.5},gp);ring(gp,p.sx(q[0]),p.sy(q[1]),o?C.orange:C.blue,false,12);const t=S('text',{x:p.sx(q[0]),y:p.sy(q[1])+5.5,'text-anchor':'middle',style:'font-size:16px;font-weight:700;fill:#000'},gp);t.textContent=o});
    E.forEach((e,k)=>{const a=N[e[0]],b=N[e[1]],on=val[e[0]]===1;S('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:on?(e[2]>0?C.yellow:C.red):'#555','stroke-width':on?3:1.5},g);
      const f=k<4?(k===1||k===2?0.24:0.5):0.5,tx=a[0]+(b[0]-a[0])*f,ty=a[1]+(b[1]-a[1])*f+(k===1?-8:k===2?22:k===5?22:-9);const t=S('text',{x:tx,y:ty,'text-anchor':'middle',style:'font-size:15px;fill:#ddd'},g);t.textContent=e[2]>0?'1':'−1'});
    [['x1','x₁',C.blue,''],['x2','x₂',C.blue,''],['h1','h₁',C.yellow,'−0,5'],['h2','h₂',C.pink,'−1,5'],['y','y',C.green,'−0,5']].forEach(n=>{const q=N[n[0]],v=val[n[0]];S('circle',{cx:q[0],cy:q[1],r:26,fill:v?n[2]:'#000',stroke:n[2],'stroke-width':2.4},g);
      const t=S('text',{x:q[0],y:q[1]+7,'text-anchor':'middle',style:`font-size:20px;font-weight:700;fill:${v?'#000':n[2]}`},g);t.textContent=v;const l=S('text',{x:q[0],y:q[1]-36,'text-anchor':'middle',class:'tag'},g);l.textContent=n[1]+(n[3]?'   bias '+n[3]:'')});
    res.innerHTML=`${K('h_1')}: ${x[0]} + ${x[1]} − 0,5 = ${nf(x[0]+x[1]-0.5,1)} → <b>${h[0]}</b>. &nbsp; ${K('h_2')}: ${x[0]} + ${x[1]} − 1,5 = ${nf(x[0]+x[1]-1.5,1)} → <b>${h[1]}</b>.<br>Output: ${h[0]} − ${h[1]} − 0,5 = ${nf(h[0]-h[1]-0.5,1)} → <b>${y}</b>, che è lo XOR di ${x[0]} e ${x[1]}.`}
  draw();
};

FIG.featspace=function(st){
  const p=Plot(st,{W:470,H:462,m:[40,10,10,42],xr:[-0.6,1.6],yr:[-0.6,1.6],label:'I quattro punti dello XOR passano dallo spazio degli input a quello delle unità nascoste'});
  p.axes([0,1],[0,1]);const ax=S('g',null,p.axg),g=S('g',null,p.g),ln=S('path',{d:p.poly([[-0.6,-1.1],[1.6,1.1]]),fill:'none',stroke:'#fff','stroke-width':2.2},p.g),zn=S('path',{d:p.poly([[-0.1,-0.6],[1.6,1.1],[1.6,-0.6]])+'Z',fill:'rgba(255,134,47,.16)'},p.bg),res=out(st);
  const la=S('text',{x:p.ax+p.aw/2,y:p.H-6,'text-anchor':'middle',class:'tag'},ax),lb=S('text',{x:p.ax+8,y:p.ay+14,class:'tag'},ax);
  const off=[[0,0],[-0.07,0.07],[0.07,-0.07],[0,0]];
  player(st,100,8,pos=>{g.textContent='';const t=ez(clamp((pos-12)/45,0,1)),a=ez(clamp((pos-66)/22,0,1));la.textContent=t<0.5?'input x₁':'unità nascosta h₁';lb.textContent=t<0.5?'input x₂':'unità nascosta h₂';[la,lb].forEach(e=>e.setAttribute('opacity',Math.abs(t-0.5)*2));
    ln.setAttribute('opacity',a);zn.setAttribute('opacity',a);
    XP.forEach((q,i)=>{const h=xh(q),x=q[0]+(h[0]+off[i][0]*1-q[0])*t,y=q[1]+(h[1]+off[i][1]*1-q[1])*t,o=xy(h);ring(g,p.sx(x),p.sy(y),o?C.orange:C.blue,false,13);const tx=S('text',{x:p.sx(x),y:p.sy(y)+6,'text-anchor':'middle',style:'font-size:16px;font-weight:700;fill:#000'},g);tx.textContent=o});
    res.innerHTML=pos<12?'Nello spazio degli input i due punti arancioni stanno su angoli opposti: nessuna retta li isola.':a<=0?'Ogni punto si sposta nella posizione data dalle due unità nascoste. I due punti arancioni finiscono entrambi in (1, 0).':'Nel nuovo spazio una retta separa le classi: è quella che calcola il neurone di output.'});
};

FIG.mlpdiag=function(st){
  let L=2,U=4;slider(st,'Strati nascosti',1,3,1,L,v=>v,v=>{L=v;draw()});slider(st,'Unità per strato nascosto',2,8,1,U,v=>v,v=>{U=v;draw()});
  const W=600,Hh=330,svg=Svg(st,W,Hh,'Schema di un multilayer perceptron'),g=S('g',null,svg),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const sz=[3].concat(Array(L).fill(U),[2]),n=sz.length,X=i=>70+i*(460/(n-1)),Y=(k,m)=>150+(k-(m-1)/2)*Math.min(46,250/m);
    for(let l=0;l<n-1;l++)for(let i=0;i<sz[l];i++)for(let j=0;j<sz[l+1];j++)S('line',{x1:X(l),y1:Y(i,sz[l]),x2:X(l+1),y2:Y(j,sz[l+1]),stroke:'#777','stroke-width':.9},g);
    sz.forEach((m,l)=>{for(let k=0;k<m;k++)S('circle',{cx:X(l),cy:Y(k,m),r:12,fill:l===0?C.blue:l===n-1?C.green:C.yellow,stroke:'#000'},g);const t=S('text',{x:X(l),y:316,'text-anchor':'middle',class:'tag'},g);t.textContent=l===0?'input':l===n-1?'output':'nascosto '+l});
    let w=0,b=0;const parts=[];for(let l=0;l<n-1;l++){w+=sz[l]*sz[l+1];b+=sz[l+1];parts.push(sz[l+1]+'×'+sz[l])}
    res.innerHTML=`Matrici dei pesi: ${parts.join(', ')} → ${w} pesi, più ${b} bias.<br>In tutto <b>${w+b} parametri</b> da imparare.`}
  draw();
};

FIG.activ=function(st){
  const F=[['Lineare',K('y=a'),z=>z],['ReLU',K('y=\\max(0,a)'),z=>Math.max(0,z)],['Soft ReLU',K('y=\\log(1+e^{a})'),z=>Math.log(1+Math.exp(z))],['Gradino',K('y=1 \\text{ se } a\\gt 0'),z=>z>0?1:0],['Logistica',K('y=\\frac{1}{1+e^{-a}}'),sig],['Tangente iperbolica',K('y=\\tanh a'),Math.tanh]];
  [0,1].forEach(r=>{const tri=H('div',{class:'trio'},st);if(r)tri.style.marginTop='.6rem';F.slice(r*3,r*3+3).forEach((f,k)=>{const d=H('div',null,tri),p=Plot(d,{W:230,H:150,m:[8,8,8,8],xr:[-4,4],yr:r?[-1.5,1.6]:[-2.2,4.2],label:f[0]});
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#555'},p.bg);S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#555'},p.bg);
    if(r===1&&k===0){S('path',{d:`M${p.sx(-4)} ${p.sy(0)}L${p.sx(0)} ${p.sy(0)}M${p.sx(0)} ${p.sy(1)}L${p.sx(4)} ${p.sy(1)}`,fill:'none',stroke:C.yellow,'stroke-width':2.6},p.g)}else S('path',{d:p.curve(f[2],-4,4,200),fill:'none',stroke:C.yellow,'stroke-width':2.6},p.g);
    cap(d,`<b>${f[0]}</b><br>${f[1]}`)})});
};

FIG.linstack=function(st){
  let seed=3;btn(st,'Nuovi pesi a caso',()=>{seed++;draw()});
  const duo=H('div',{class:'duo'},st),PP=[['lin','Attivazione lineare'],['relu','Attivazione ReLU']].map(o=>{const d=H('div',null,duo),p=Plot(d,{W:420,H:300,m:[34,10,10,42],xr:[-3,3],yr:[-4,4],label:o[1]});p.axes([-2,0,2],[-4,-2,0,2,4],'input x','output y');
    S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);return {a:o[0],t:o[1],p,c:S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.6},p.g),cp:cap(d,'')}});
  function draw(){const net=mk([1,4,4,1],seed*7+1,1.6);PP.forEach(e=>{const f=x=>fwd(net,[x],e.a).zs[3][0];e.c.setAttribute('d',e.p.curve(f,-3,3,400));
    e.cp.innerHTML=`<b>${e.t}</b><br>${e.a==='lin'?'due strati nascosti, ma l\'output è sempre una retta':'gli stessi pesi: l\'output si piega'}`})}
  draw();
};

FIG.beta=function(st){
  let lb=0;slider(st,'Fattore '+K('\\beta')+' che moltiplica pesi e bias',-0.3,1.5,0.02,lb,v=>nf(Math.pow(10,v),1),v=>{lb=v;draw()});
  const p=Plot(st,{W:600,H:260,m:[40,10,12,42],xr:[-4,4],yr:[-0.08,1.1],label:'La logistica si avvicina al gradino al crescere di beta'});p.axes([-4,-2,0,2,4],[0,0.5,1],'z');
  S('path',{d:`M${p.sx(-4)} ${p.sy(0)}L${p.sx(0)} ${p.sy(0)}L${p.sx(0)} ${p.sy(1)}L${p.sx(4)} ${p.sy(1)}`,fill:'none',stroke:'#fff','stroke-width':1.4,'stroke-dasharray':'5 4'},p.g);
  const c=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g);legend(st,[[C.yellow,'σ(βz)'],['#fff','gradino']]);
  function draw(){const b=Math.pow(10,lb);c.setAttribute('d',p.curve(z=>sig(b*z),-4,4,500))}
  draw();
};

FIG.univ=function(st){
  let Hn=4;const f=x=>Math.sin(1.5*x)+0.45*Math.sin(4*x)+0.25*x,xs=Array.from({length:240},(_,i)=>-3+6*(i+.5)/240),ys=xs.map(f);
  slider(st,'Unità nello strato nascosto',1,30,1,Hn,v=>v,v=>{Hn=v;draw()});
  legend(st,[[C.green,'funzione da approssimare','','opacity:.9'],[C.blue,'contributo di ogni unità nascosta'],[C.yellow,'output della rete']]);
  const p=Plot(st,{W:600,H:340,m:[40,10,12,42],xr:[-3,3],yr:[-2.6,2.6],label:'Una rete con uno strato nascosto approssima una funzione'});p.axes([-3,-2,-1,0,1,2,3],[-2,-1,0,1,2],'input x');
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);S('path',{d:p.curve(f,-3,3,400),fill:'none',stroke:C.green,'stroke-width':2,'stroke-dasharray':'6 4'},p.g);
  const gb=S('g',null,p.g),c=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8},p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){gb.textContent='';const be=Math.max(2,Hn*0.9),cs=Array.from({length:Hn},(_,j)=>-3+6*(j+.5)/Hn),ph=x=>[1].concat(cs.map(cc=>sig(be*(x-cc)))),w=lstsq(xs.map(ph),ys),h=x=>{const v=ph(x);let s=0;for(let j=0;j<v.length;j++)s+=w[j]*v[j];return s};
    cs.forEach((cc,j)=>S('path',{d:p.curve(x=>w[j+1]*sig(be*(x-cc)),-3,3,200),fill:'none',stroke:C.blue,'stroke-width':1,opacity:.55},gb));c.setAttribute('d',p.curve(h,-3,3,400));
    let mx=0;xs.forEach((x,i)=>{mx=Math.max(mx,Math.abs(h(x)-ys[i]))});res.innerHTML=`Con ${Hn} unità nascoste lo scarto più grande fra rete e funzione è ${nf(mx,2)}.`}
  draw();
};

/* ---------- backpropagation passo per passo ---------- */
FIG.backprop=function(st){
  const x=[1,0.5],y=1,W1=[[0.5,-0.6],[0.3,0.8]],W2=[0.7,-0.4],eta=0.5;
  const a=W1.map(r=>r[0]*x[0]+r[1]*x[1]),z=a.map(sig),yh=W2[0]*z[0]+W2[1]*z[1],dO=-(y-yh),dH=z.map((v,j)=>v*(1-v)*W2[j]*dO),g2=z.map(v=>dO*v),g1=dH.map(d=>x.map(v=>d*v));
  const nW1=W1.map((r,j)=>r.map((v,i)=>v-eta*g1[j][i])),nW2=W2.map((v,j)=>v-eta*g2[j]),na=nW1.map(r=>r[0]*x[0]+r[1]*x[1]),nyh=nW2[0]*sig(na[0])+nW2[1]*sig(na[1]);
  const W=600,Hh=350,svg=Svg(st,W,Hh,'Backpropagation su una rete due-due-uno'),g=S('g',null,svg),res=out(st);
  const N={x0:[80,105],x1:[80,245],h0:[300,105],h1:[300,245],o:[520,175]},f3=v=>nf(v,3),f2=v=>nf(v,2);
  const T=(xx,yy,t,o)=>{const e=S('text',Object.assign({x:xx,y:yy,'text-anchor':'middle',style:'font-size:14.5px;fill:#fff'},o||{}),g);e.textContent=t;return e};
  const PER=22,NS=7;
  player(st,NS*PER,8,pos=>{g.textContent='';const k=Math.min(NS-1,Math.floor(pos/PER)),fr=clamp((pos/PER-k)/0.35,0,1),al=s=>k>s?1:k===s?fr:0;
    const edge=(A,B,lab,gl,nl,dy,fpos)=>{const p=N[A],q=N[B];S('line',{x1:p[0]+36,y1:p[1],x2:q[0]-42,y2:q[1],stroke:'#777','stroke-width':1.4},g);
      if(al(1)>0&&al(3)<1&&k<3)S('line',{x1:p[0]+34,y1:p[1],x2:p[0]+34+(q[0]-p[0]-68)*al(B==='o'?2:1),y2:p[1]+(q[1]-p[1])*al(B==='o'?2:1),stroke:C.blue,'stroke-width':3,opacity:.8},g);
      if(k>=3&&k<5&&(B==='o'?al(3)>0:al(4)>0)){const t=B==='o'?al(3):al(4);S('line',{x1:q[0]-34,y1:q[1],x2:q[0]-34-(q[0]-p[0]-68)*t,y2:q[1]-(q[1]-p[1])*t,stroke:C.pink,'stroke-width':3,opacity:.8},g)}
      const tx=p[0]+34+(q[0]-p[0]-68)*fpos,ty=p[1]+(q[1]-p[1])*fpos+dy;
      if(k<5)T(tx,ty,'w = '+f2(lab),{style:`font-size:14px;fill:${C.yellow}`});else if(k===5){T(tx,ty,'w = '+f2(lab),{style:`font-size:14px;fill:${C.yellow}`,opacity:1-0.6*fr});T(tx,ty+17,'∂ = '+f3(gl),{style:`font-size:14px;fill:${C.teal};font-weight:700`,opacity:fr})}
      else{T(tx,ty,'w = '+f2(lab+(nl-lab)*fr),{style:`font-size:14px;fill:${C.yellow};font-weight:700`})}};
    edge('x0','h0',W1[0][0],g1[0][0],nW1[0][0],-10,0.5);edge('x1','h0',W1[0][1],g1[0][1],nW1[0][1],-20,0.2);edge('x0','h1',W1[1][0],g1[1][0],nW1[1][0],12,0.2);edge('x1','h1',W1[1][1],g1[1][1],nW1[1][1],22,0.5);
    edge('h0','o',W2[0],g2[0],nW2[0],-12,0.5);edge('h1','o',W2[1],g2[1],nW2[1],24,0.5);
    [['x0',x[0]],['x1',x[1]]].forEach(n=>{const q=N[n[0]];S('circle',{cx:q[0],cy:q[1],r:34,fill:'#000',stroke:C.blue,'stroke-width':2.2},g);T(q[0],q[1]+6,'x = '+nf(n[1],1),{style:`font-size:15px;fill:${C.blue}`})});
    [0,1].forEach(j=>{const q=N['h'+j];S('circle',{cx:q[0],cy:q[1],r:40,fill:'#000',stroke:'#fff','stroke-width':2.2},g);
      T(q[0],q[1]-5,'a = '+f3(a[j]),{opacity:al(1),style:'font-size:13.5px;fill:#fff'});T(q[0],q[1]+14,'z = '+f3(z[j]),{opacity:al(1),style:'font-size:13.5px;fill:#fff;font-weight:700'});
      T(q[0],q[1]+(j?62:-50),'δ = '+f3(dH[j]),{opacity:al(4),style:`font-size:15px;fill:${C.pink};font-weight:700`})});
    {const q=N.o;S('circle',{cx:q[0],cy:q[1],r:40,fill:'#000',stroke:C.green,'stroke-width':2.2},g);T(q[0],q[1]+6,'ŷ = '+f3(k<6?yh:yh+(nyh-yh)*fr),{opacity:al(2),style:`font-size:15px;fill:${C.green};font-weight:700`});
      T(q[0],q[1]-52,'δ = '+f3(dO),{opacity:k<6?al(3):1-fr,style:`font-size:15px;fill:${C.pink};font-weight:700`});T(q[0],q[1]+62,'risposta y = 1',{class:'tag',style:''})}
    T(190,24,'strato 1',{class:'tag',style:''});T(410,24,'strato 2',{class:'tag',style:''});
    res.innerHTML=['Una rete piccola: due input, due unità nascoste con la logistica, un output lineare. Sui collegamenti i pesi di partenza.',
      `<b>In avanti, strato 1.</b> Ogni unità nascosta calcola la somma pesata ${K('a')} e poi ${K('z=\\sigma(a)')}. Per la prima: ${K('0{,}5\\cdot1-0{,}6\\cdot0{,}5='+kn(a[0],1))}.`,
      `<b>In avanti, output.</b> ${K('\\Yh='+kn(W2[0],1)+'\\cdot'+kn(z[0],3)+kn(W2[1],1)+'\\cdot'+kn(z[1],3)+'='+kn(yh,3))}. Il costo è ${K('\\tfrac12(1-\\Yh)^2='+kn(0.5*(1-yh)**2,3))}.`,
      `<b>All'indietro, output.</b> Il segnale di errore dell'output è ${K('\\delta=-(\\Yy-\\Yh)='+kn(dO,3))}.`,
      `<b>All'indietro, strato nascosto.</b> Ogni unità riceve il ${K('\\delta')} dell'output attraverso il suo peso: ${K("\\delta_j=\\sigma'(a_j)\\,w_j\\,\\delta")}. Per la prima: ${K(kn(z[0]*(1-z[0]),3)+'\\cdot'+kn(W2[0],1)+'\\cdot('+kn(dO,3)+')='+kn(dH[0],3))}.`,
      `<b>Le derivate.</b> Per ogni peso: ${K('\\delta')} del nodo di arrivo × valore del nodo di partenza. Sono i numeri verdi.`,
      `<b>Un passo di discesa</b> con ${K('\\Et=0{,}5')}: ogni peso si sposta contro la sua derivata. L'output passa da ${f3(yh)} a ${f3(nyh)}, più vicino a 1.`][k]});
};

/* ---------- una rete che impara ---------- */
const BLOB=(function(){const r=rng(121),a=[];[[-1,-1,0],[1,1,0],[-1,1,1],[1,-1,1]].forEach(c=>{for(let i=0;i<16;i++)a.push([c[0]+0.42*r.n(),c[1]+0.42*r.n(),c[2]])});return a})();
function heatP(p,f,nx){const ny=Math.round(nx*p.ah/p.aw),cv=p._cv||(p._cv=document.createElement('canvas'));cv.width=nx;cv.height=ny;const c=cv.getContext('2d'),im=c.createImageData(nx,ny);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const pr=f([p.xr[0]+(i+.5)/nx*(p.xr[1]-p.xr[0]),p.yr[1]-(j+.5)/ny*(p.yr[1]-p.yr[0])]),a=Math.abs(pr-.5)*2,q=pr>.5?[255,134,47]:[88,196,221],k=4*(j*nx+i);im.data[k]=12+q[0]*a*.45;im.data[k+1]=12+q[1]*a*.45;im.data[k+2]=12+q[2]*a*.45;im.data[k+3]=255}c.putImageData(im,0,0);p.image(cv)}
M.heatP=heatP;
FIG.bptrain=function(st){
  const X=BLOB.map(d=>[d[0],d[1]]),Y=BLOB.map(d=>[d[2]]),net=mk([2,4,1],5,1.2),SN=[],LS=[],NF=100,EV=2;
  for(let f=0;f<=NF;f++){SN.push(clone(net));let l=0;BLOB.forEach(d=>{l+=dBCE(fwd(net,[d[0],d[1]],'tanh').as[1],[d[2]])[1]});LS.push(l/BLOB.length);for(let e=0;e<EV;e++)step(net,X,Y,'tanh',0.45,dBCE)}
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=Plot(dl,{W:420,H:330,m:[10,10,10,10],xr:[-2.4,2.4],yr:[-2.0,2.0],label:'Probabilità prevista dalla rete durante l\'allenamento'}),g=S('g',null,p.g);
  BLOB.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]),CC[d[2]],false,4.2));
  const q=Plot(dr,{W:420,H:330,m:[44,10,12,42],xr:[0,NF*EV],yr:[0,0.8],label:'Costo a ogni passo'});q.axes([0,50,100,150,200],[0,0.2,0.4,0.6,0.8],'passi di gradient descent');
  const lc=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},q.g),dot=S('circle',{r:5.5,fill:C.pink,stroke:'#000'},q.g);cap(dl,'<b>lo sfondo</b> è la classe prevista in ogni punto');cap(dr,'<b>il costo</b> scende passo dopo passo');const res=out(st);
  player(st,NF,8,tf=>{const t=Math.min(NF-1,Math.floor(tf)),fr=tf-t,nt=lerpNet(SN[t],SN[t+1],fr),l=LS[t]+(LS[t+1]-LS[t])*fr;heatP(p,x=>sig(fwd(nt,x,'tanh').as[1][0]),72);
    const pts=[];for(let i=0;i<=t;i++)pts.push([i*EV,LS[i]]);pts.push([tf*EV,l]);lc.setAttribute('d',q.poly(pts));dot.setAttribute('cx',q.sx(tf*EV));dot.setAttribute('cy',q.sy(l));
    let e=0;BLOB.forEach(d=>{if((fwd(nt,[d[0],d[1]],'tanh').as[1][0]>0?1:0)!==d[2])e++});res.innerHTML=`Passo ${Math.round(tf*EV)}: log loss ${nf(l,3)}, punti sbagliati ${e} su ${BLOB.length}.`});
};

FIG.saddle=function(st){
  const tri=H('div',{class:'trio'},st);
  [['Minimo locale',(x,y)=>0.5*(x*x+y*y),0],['Massimo locale',(x,y)=>4-0.5*(x*x+y*y),4],['Punto di sella',(x,y)=>2+0.5*(x*x-y*y),2]].forEach(o=>{const d=H('div',null,tri),svg=Svg(d,230,200,o[0]),g=S('g',null,svg),P0=proj3(0.6,0.5,115,150,1,[0,0,0]),P=q=>P0([q[0]*34,q[1]*34,q[2]*22]);
    wire(g,P,o[1],[-2,2],[-2,2],8,C.pink,.6);const u=P([0,0,o[2]]);S('circle',{cx:u[0],cy:u[1],r:5.5,fill:'#fff',stroke:'#000'},g);cap(d,`<b>${o[0]}</b>`)});
};

FIG.inits=function(st){
  const r=rng(123),X=[],Y=[];for(let i=0;i<12;i++){const x=-2.5+5*(i+.5)/12;X.push([x]);Y.push([Math.sin(2.2*x)+0.5*Math.cos(0.9*x)])}
  const NR=8,IT=60,EV=25,R=[];for(let s=0;s<NR;s++){const net=mk([1,3,1],200+s*11,2.2),ls=[];for(let i=0;i<=IT;i++){let l=0;X.forEach((x,k)=>{l+=dMSE(fwd(net,x,'tanh').as[1],Y[k])[1]});ls.push(l/X.length);for(let e=0;e<EV;e++)step(net,X,Y,'tanh',0.08,dMSE)}R.push(ls)}
  const fin=R.map(l=>l[IT]),lo=Math.min(...fin),hi=Math.max(...fin);
  const p=Plot(st,{W:600,H:300,m:[48,10,26,42],xr:[0,IT*EV],yr:[0,0.5],label:'Costo durante l\'allenamento per otto inizializzazioni diverse'});p.axes([0,500,1000,1500],[0,0.1,0.2,0.3,0.4,0.5],'passi di gradient descent');
  R.forEach((ls,s)=>S('path',{d:p.poly(ls.map((l,i)=>[i*EV,l])),fill:'none',stroke:fin[s]<=lo+1e-6?C.yellow:C.lg,'stroke-width':fin[s]<=lo+1e-6?2.8:1.6,opacity:fin[s]<=lo+1e-6?1:.8},p.g));
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`Stessa rete, stessi dati, otto punti di partenza casuali. Il costo finale va da ${nf(lo,3)} (linea gialla) a ${nf(hi,3)}.`;
};

FIG.minibatch=function(st){
  const r=rng(125),N=256,D=[];for(let i=0;i<N;i++){const x=2*r()-1;D.push([x,1.4*x+0.5+0.6*r.n()])}
  const cost=(w,b)=>D.reduce((s,d)=>s+0.5*(d[1]-w*d[0]-b)**2,0)/N,MS=[1,4,16,64,256];let mi=0;
  slider(st,'Esempi per mini-batch '+K('m'),0,MS.length-1,1,mi,v=>MS[v],v=>{mi=v;draw()});
  legend(st,[[C.yellow,'mini-batch scelto'],[C.lg,'tutti i dati a ogni passo']]);
  const p=Plot(st,{W:600,H:300,m:[48,10,12,42],xr:[0,120],yr:[0.15,0.9],label:'Costo a ogni aggiornamento per la dimensione di mini-batch scelta'});p.axes([0,20,40,60,80,100,120],[0.2,0.4,0.6,0.8],'numero di aggiornamenti dei pesi');
  const base=S('path',{fill:'none',stroke:C.lg,'stroke-width':1.6,'stroke-dasharray':'5 4'},p.g),c=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.4},p.g),res=out(st);res.style.minHeight='1.7em';
  const run=m=>{const rr=rng(77+m);let w=-1,b=1.6;const ls=[cost(w,b)];for(let t=0;t<120;t++){let gw=0,gb=0;for(let k=0;k<m;k++){const d=m===N?D[k]:D[Math.floor(rr()*N)],e=w*d[0]+b-d[1];gw+=e*d[0];gb+=e}w-=0.25*gw/m;b-=0.25*gb/m;ls.push(cost(w,b))}return ls};
  base.setAttribute('d',p.poly(run(N).map((l,i)=>[i,l])));
  function draw(){const m=MS[mi],ls=run(m);c.setAttribute('d',p.poly(ls.map((l,i)=>[i,l])));res.innerHTML=`Ogni aggiornamento usa ${m} ${m===1?'esempio':'esempi'} su ${N}: 120 aggiornamenti costano ${big(120*m)} gradienti invece di ${big(120*N)}.`}
  draw();
};

FIG.earlystop=function(st){
  const r=rng(127),f=x=>Math.sin(1.6*x),X=[],Y=[],XV=[],YV=[];for(let i=0;i<14;i++){const x=-2.6+5.2*(i+r())/14;X.push([x]);Y.push([f(x)+0.35*r.n()])}for(let i=0;i<80;i++){const x=-2.6+5.2*r();XV.push([x]);YV.push([f(x)+0.35*r.n()])}
  const net=mk([1,24,1],31,2.5),rm=(A,B)=>Math.sqrt(A.reduce((s,x,k)=>s+(fwd(net,x,'tanh').as[1][0]-B[k][0])**2,0)/A.length),NP=90,R=[];let it=0;
  for(let k=0;k<=NP;k++){const tg=Math.round(Math.pow(10,k/NP*4.3));while(it<tg){step(net,X,Y,'tanh',0.05,dMSE);it++}R.push([Math.log10(tg),rm(X,Y),rm(XV,YV)])}
  let bi=0;R.forEach((q,i)=>{if(q[2]<R[bi][2])bi=i});
  legend(st,[[C.lg,'errore di training'],[C.red,'errore di validation']]);
  const p=Plot(st,{W:600,H:300,m:[48,10,24,42],xr:[0,4.3],yr:[0,1],label:'Errore di training e di validation durante l\'allenamento'});p.axes([0,1,2,3,4],[0,0.25,0.5,0.75,1],'passi di gradient descent (scala logaritmica)',null,v=>big(Math.pow(10,v)));
  [[1,C.lg,2],[2,C.red,2.8]].forEach(a=>S('path',{d:p.poly(R.map(q=>[q[0],q[a[0]]])),fill:'none',stroke:a[1],'stroke-width':a[2]},p.g));
  S('line',{x1:p.sx(R[bi][0]),x2:p.sx(R[bi][0]),y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-dasharray':'5 4'},p.g);const t=S('text',{x:p.sx(R[bi][0])-6,y:p.ay+p.ah-10,'text-anchor':'end',class:'tag'},p.top);t.textContent='fermarsi qui';
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`L'errore di validation è minimo dopo circa ${big(Math.pow(10,R[bi][0]))} passi (${nf(R[bi][2],2)}); continuando fino a ${big(Math.pow(10,4.3))} passi sale a ${nf(R[NP][2],2)}, mentre quello di training scende a ${nf(R[NP][1],2)}.`;
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,slider,buttons,btn,player,out,legend,Svg,arrow,cap,ring,pct,sig,nn,pick}=M;
const ez=t=>t*t*(3-2*t),KC=[C.blue,C.green,C.orange,C.purple],sm=a=>{const m=Math.max(...a),e=a.map(v=>Math.exp(v-m)),s=e.reduce((u,v)=>u+v,0);return e.map(v=>v/s)};
function barsP(host,W,Hh,n,label,names){const p=Plot(host,{W,H:Hh,m:[36,22,10,28],xr:[0.4,n+0.6],yr:[0,1.05],label});p.axes(null,[0,0.5,1]);(names||[]).forEach((t,k)=>{const e=S('text',{x:p.sx(k+1),y:p.ay+p.ah+19,'text-anchor':'middle'},p.axg);e.textContent=t});return p}

FIG.ovr=function(st){
  const a=[2.5,2.0,-1],nm=['classe 1','classe 2','classe 3'];nm.forEach((n,k)=>slider(st,'Punteggio della '+n,-3,5,0.1,a[k],v=>nf(v,1),v=>{a[k]=v;draw()}));
  const duo=H('div',{class:'duo'},st),PP=[['Tre sigmoidi separate (uno contro tutti)',x=>x.map(sig)],['Softmax',sm]].map(o=>{const d=H('div',null,duo),p=barsP(d,420,270,3,o[0],nm),bs=nm.map((n,k)=>S('rect',{x:p.sx(k+1)-38,width:76,fill:KC[k]},p.g)),ts=nm.map((n,k)=>S('text',{x:p.sx(k+1),'text-anchor':'middle',style:'font-size:15px;fill:#fff'},p.top));return {o,p,bs,ts,c:cap(d,'')}});
  function draw(){PP.forEach(e=>{const v=e.o[1](a),s=v.reduce((u,w)=>u+w,0);v.forEach((x,k)=>{const Y=e.p.sy(x);e.bs[k].setAttribute('y',Y);e.bs[k].setAttribute('height',Math.max(0,e.p.sy(0)-Y));e.ts[k].setAttribute('y',Y-6);e.ts[k].textContent=nf(x,2)});
    e.c.innerHTML=`<b>${e.o[0]}</b><br>somma delle tre uscite: <b style="color:${Math.abs(s-1)<1e-6?C.green:C.red}">${nf(s,2)}</b>`})}
  draw();
};

FIG.celoss=function(st){
  const a=[1.2,0.3,2.0,-0.5],p=sm(a),nm=['classe 1','classe 2','classe 3','classe 4'];let t=2;
  pick(st,'Scegli la classe vera',nm,t,i=>{t=i;draw()});legend(st,[[C.yellow,'probabilità prevista p'],[C.green,'bersaglio y (one-hot)']]);
  const pl=barsP(st,600,280,4,'Probabilità previste e vettore bersaglio',nm),g=S('g',null,pl.top),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';p.forEach((v,k)=>{const x=pl.sx(k+1),y=k===t?1:0;S('rect',{x:x-44,y:pl.sy(v),width:40,height:pl.sy(0)-pl.sy(v),fill:C.yellow,opacity:k===t?1:.45},g);S('rect',{x:x+4,y:pl.sy(y),width:40,height:Math.max(2,pl.sy(0)-pl.sy(y)),fill:C.green,opacity:y?1:.45},g);
      const e=S('text',{x:x-24,y:pl.sy(v)-6,'text-anchor':'middle',style:'font-size:14px;fill:#fff'},g);e.textContent=nf(v,2);const e2=S('text',{x:x+24,y:pl.sy(y)-6,'text-anchor':'middle',style:'font-size:14px;fill:#fff'},g);e2.textContent=y});
    const yv='('+nm.map((n,k)=>k===t?1:0).join(',\\,')+')';res.innerHTML=`Bersaglio ${K('\\Yv='+yv)}. Probabilità data alla classe vera: ${K('p_'+(t+1)+'='+kn(p[t],2))}.<br>Loss: ${K('-\\log '+kn(p[t],2)+'=')} <b>${nf(-Math.log(p[t]),2)}</b>.`}
  draw();
};

FIG.delta=function(st){
  const eta=0.5,NS=40,ST=[];{let a=[0.3,1.6,-0.4];for(let i=0;i<=NS;i++){const p=sm(a);ST.push({a:a.slice(),p});a=a.map((v,k)=>v-eta*(p[k]-(k===0?1:0)))}}
  legend(st,[['#fff','bersaglio'],[C.pink,'verso in cui si sposta il punteggio']]);
  const nm=['classe 1 (vera)','classe 2','classe 3'],pl=barsP(st,600,300,3,'Le probabilità si spostano verso il bersaglio',nm),g=S('g',null,pl.top),res=out(st);
  player(st,NS*2,8,pos=>{g.textContent='';const tf=pos/2,i=Math.min(NS-1,Math.floor(tf)),fr=tf-i,A=ST[i],B=ST[i+1],p=A.p.map((v,k)=>v+(B.p[k]-v)*fr),a=A.a.map((v,k)=>v+(B.a[k]-v)*fr);
    p.forEach((v,k)=>{const x=pl.sx(k+1),y=k===0?1:0;S('rect',{x:x-42,y:pl.sy(v),width:84,height:pl.sy(0)-pl.sy(v),fill:KC[k]},g);S('line',{x1:x-54,x2:x+54,y1:pl.sy(y),y2:pl.sy(y),stroke:'#fff','stroke-width':2.5},g);
      if(Math.abs(v-y)>0.03)arrow(g,x+66,pl.sy(v),x+66,pl.sy(v)+(y>v?-1:1)*Math.min(46,Math.abs(v-y)*110+10),C.pink,2.5);
      const ins=v>0.8,e=S('text',{x,y:ins?pl.sy(v)+22:pl.sy(v)-8,'text-anchor':'middle',style:`font-size:15px;fill:${ins?'#000':'#fff'};font-weight:${ins?700:400}`},g);e.textContent='p = '+nf(v,2);const e2=S('text',{x,y:pl.ay+pl.ah+38,'text-anchor':'middle',class:'tag'},pl.top);});
    res.innerHTML=`Passo ${Math.round(tf)}: punteggi (${a.map(v=>nf(v,2)).join('; ')}), loss ${K('-\\log p_1=')} ${nf(-Math.log(p[0]),2)}.<br>${K('p-y')} = (${p.map((v,k)=>nf(v-(k===0?1:0),2)).join('; ')})`});
};

FIG.outer=function(st){
  const z=[0.9,0.2,0.6,0.0],p=sm([1.0,0.4,-0.2]);let t=1;pick(st,'Scegli la classe vera',['classe 1','classe 2','classe 3'],t,i=>{t=i;draw()});
  const W=600,Hh=300,svg=Svg(st,W,Hh,'Aggiornamento dei pesi dell\'ultimo strato'),g=S('g',null,svg),res=out(st);res.style.minHeight='1.7em';
  const T=(x,y,s,o)=>{const e=S('text',Object.assign({x,y,'text-anchor':'middle',style:'font-size:15px;fill:#fff'},o||{}),g);e.innerHTML=s;return e};
  function draw(){g.textContent='';const d=p.map((v,k)=>v-(k===t?1:0)),x0=250,y0=96,cw=78,ch=56;
    T(x0+2*cw,22,'output delle unità nascoste z',{class:'tag',style:''});z.forEach((v,j)=>{S('rect',{x:x0+j*cw+6,y:34,width:cw-12,height:40,rx:6,fill:'#000',stroke:C.blue,'stroke-width':1.6},g);T(x0+j*cw+cw/2,60,nf(v,1),{style:`font-size:16px;fill:${C.blue}`})});
    T(145,84,'errore p − y di ogni classe',{class:'tag',style:''});
    d.forEach((v,k)=>{S('rect',{x:70,y:y0+k*ch+6,width:150,height:ch-12,rx:6,fill:'#000',stroke:C.pink,'stroke-width':1.6},g);T(145,y0+k*ch+ch/2+6,nf(p[k],2)+' − '+(k===t?1:0)+' = '+nf(v,2),{style:`font-size:15px;fill:${C.pink}`});T(36,y0+k*ch+ch/2+5,'cl. '+(k+1),{class:'tag',style:''});
      z.forEach((zz,j)=>{const u=-v*zz,a=clamp(Math.abs(u)/0.8,0,1);S('rect',{x:x0+j*cw+3,y:y0+k*ch+3,width:cw-6,height:ch-6,rx:5,fill:u>0?`rgba(131,193,103,${0.15+0.75*a})`:u<0?`rgba(252,98,85,${0.15+0.75*a})`:'#1a1a1a'},g);T(x0+j*cw+cw/2,y0+k*ch+ch/2+6,(u>0?'+':'')+nf(u,2))})});
    T(x0+2*cw,y0+3*ch+26,'variazione di ogni peso: −η (p − y) z, con η = 1',{class:'tag',style:''});
    res.innerHTML=`La riga della classe vera (${t+1}) è verde: i suoi pesi crescono. Le altre calano, di più dove ${K('p_k')} era alta. L'ultima colonna resta ferma perché ${K('z_4=0')}.`}
  draw();
};

FIG.smtrain=function(st){
  const r=rng(131),D=[];for(let c=0;c<3;c++)for(let i=0;i<28;i++){const t=i/28,rad=0.25+1.6*t,an=2*Math.PI*c/3+2.2*t+0.18*r.n();D.push([rad*Math.cos(an),rad*Math.sin(an),c])}
  const X=D.map(d=>[d[0],d[1]]),Y=D.map(d=>[0,1,2].map(k=>k===d[2]?1:0)),net=nn.mk([2,10,3],9,1.3),SN=[],LS=[],NF=100,EV=4;
  for(let f=0;f<=NF;f++){SN.push(nn.clone(net));let l=0;D.forEach((d,i)=>{l+=nn.dCE(nn.fwd(net,X[i],'tanh').as[1],Y[i])[1]});LS.push(l/D.length);for(let e=0;e<EV;e++)nn.step(net,X,Y,'tanh',0.35,nn.dCE)}
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=Plot(dl,{W:420,H:330,m:[10,10,10,10],xr:[-2.6,2.6],yr:[-2.1,2.1],label:'Regioni delle tre classi durante l\'allenamento'}),g=S('g',null,p.g);
  D.forEach(d=>ring(g,p.sx(d[0]),p.sy(d[1]),KC[d[2]],false,4.2));const RGB=[[88,196,221],[131,193,103],[255,134,47]],cv=document.createElement('canvas'),nx=72,ny=Math.round(nx*p.ah/p.aw);cv.width=nx;cv.height=ny;const ctx=cv.getContext('2d'),im=ctx.createImageData(nx,ny);
  const q=Plot(dr,{W:420,H:330,m:[44,10,24,42],xr:[0,NF*EV],yr:[0,1.2],label:'Cross-entropy a ogni passo'});q.axes([0,100,200,300,400],[0,0.4,0.8,1.2],'passi di gradient descent');
  const lc=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},q.g),dot=S('circle',{r:5.5,fill:C.pink,stroke:'#000'},q.g);cap(dl,'<b>lo sfondo</b> è la classe più probabile in ogni punto');cap(dr,'<b>la cross-entropy</b> scende');const res=out(st);
  player(st,NF,8,tf=>{const t=Math.min(NF-1,Math.floor(tf)),fr=tf-t,nt=nn.lerpNet(SN[t],SN[t+1],fr),l=LS[t]+(LS[t+1]-LS[t])*fr;
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const pr=sm(nn.fwd(nt,[p.xr[0]+(i+.5)/nx*5.2,p.yr[1]-(j+.5)/ny*4.2],'tanh').as[1]);let b=0;if(pr[1]>pr[b])b=1;if(pr[2]>pr[b])b=2;const a=0.1+0.36*clamp((pr[b]-1/3)*1.5,0,1),k=4*(j*nx+i);im.data[k]=12+RGB[b][0]*a;im.data[k+1]=12+RGB[b][1]*a;im.data[k+2]=12+RGB[b][2]*a;im.data[k+3]=255}
    ctx.putImageData(im,0,0);p.image(cv);const pts=[];for(let i=0;i<=t;i++)pts.push([i*EV,LS[i]]);pts.push([tf*EV,l]);lc.setAttribute('d',q.poly(pts));dot.setAttribute('cx',q.sx(tf*EV));dot.setAttribute('cy',q.sy(l));
    let e=0;D.forEach((d,i)=>{const a=nn.fwd(nt,X[i],'tanh').as[1];let b=0;if(a[1]>a[b])b=1;if(a[2]>a[b])b=2;if(b!==d[2])e++});res.innerHTML=`Passo ${Math.round(tf*EV)}: cross-entropy ${nf(l,3)}, punti sbagliati ${e} su ${D.length}.`});
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,ring,pct,hline}=M;
const ez=t=>t*t*(3-2*t);
/* ---------- algebra ---------- */
function cov2(P){const n=P.length;let a=0,b=0,c=0;P.forEach(p=>{a+=p[0]*p[0];b+=p[0]*p[1];c+=p[1]*p[1]});return [a/n,b/n,c/n]}
function eig2(s){const tr=s[0]+s[2],d=Math.sqrt(((s[0]-s[2])/2)**2+s[1]*s[1]),l1=tr/2+d,l2=tr/2-d,th=0.5*Math.atan2(2*s[1],s[0]-s[2]);return {l1,l2,th,b1:[Math.cos(th),Math.sin(th)],b2:[-Math.sin(th),Math.cos(th)]}}
/* autovalori e autovettori di una matrice simmetrica (metodo di Jacobi) */
function jacobi(A){const n=A.length,V=Array.from({length:n},(_,i)=>{const r=new Float64Array(n);r[i]=1;return r});A=A.map(r=>Float64Array.from(r));
  for(let sw=0;sw<9;sw++){let off=0;for(let p=0;p<n;p++)for(let q=p+1;q<n;q++)off+=A[p][q]*A[p][q];if(off<1e-14)break;
    for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(A[p][q])<1e-13)continue;const th=(A[q][q]-A[p][p])/(2*A[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<n;k++){const akp=A[k][p],akq=A[k][q];A[k][p]=c*akp-s*akq;A[k][q]=s*akp+c*akq}
      for(let k=0;k<n;k++){const apk=A[p][k],aqk=A[q][k];A[p][k]=c*apk-s*aqk;A[q][k]=s*apk+c*aqk}
      for(let k=0;k<n;k++){const vkp=V[k][p],vkq=V[k][q];V[k][p]=c*vkp-s*vkq;V[k][q]=s*vkp+c*vkq}}}
  const idx=Array.from({length:n},(_,i)=>i).sort((a,b)=>A[b][b]-A[a][a]);return {val:idx.map(i=>A[i][i]),vec:idx.map(i=>{const v=new Float64Array(n);for(let k=0;k<n;k++)v[k]=V[k][i];return v})}}
M.lin={cov2,eig2,jacobi};

function cloud(n,seed,s1,s2,ang){const r=rng(seed),P=[];for(let i=0;i<n;i++){const a=s1*r.n(),b=s2*r.n();P.push([a*Math.cos(ang)-b*Math.sin(ang),a*Math.sin(ang)+b*Math.cos(ang)])}let mx=0,my=0;P.forEach(p=>{mx+=p[0];my+=p[1]});P.forEach(p=>{p[0]-=mx/n;p[1]-=my/n});return P}
function plane(host,W,xr,yr,label,lab){const pxu=(W-34-10)/(xr[1]-xr[0]),p=Plot(host,{W,H:Math.round(pxu*(yr[1]-yr[0]))+52,m:[34,10,10,42],xr,yr,label});p.axes([Math.ceil(xr[0]),0,Math.floor(xr[1])].filter((v,i,a)=>a.indexOf(v)===i),[Math.ceil(yr[0]),0,Math.floor(yr[1])].filter((v,i,a)=>a.indexOf(v)===i),lab?lab[0]:'x₁',lab?lab[1]:'x₂');
  S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);return p}

FIG.drop=function(st){
  const P=cloud(70,141,2.0,0.16,0),p=plane(st,600,[-5,5],[-3,3],'Una nuvola quasi piatta proiettata su un asse e poi sull\'altro'),g=S('g',null,p.g),res=out(st);
  const e1=P.reduce((s,q)=>s+q[1]*q[1],0)/P.length,e2=P.reduce((s,q)=>s+q[0]*q[0],0)/P.length;
  player(st,120,8,pos=>{g.textContent='';const a=ez(clamp((pos-10)/28,0,1))-ez(clamp((pos-58)/12,0,1)),b=ez(clamp((pos-72)/28,0,1));
    P.forEach(q=>{const x=q[0]*(1-b),y=q[1]*(1-a);if(a>0.02||b>0.02)S('line',{x1:p.sx(q[0]),y1:p.sy(q[1]),x2:p.sx(x),y2:p.sy(y),stroke:C.pink,'stroke-width':1,opacity:.7},g);S('circle',{cx:p.sx(x),cy:p.sy(y),r:4,fill:a>0.5||b>0.5?C.orange:C.blue,stroke:'#000','stroke-width':.6},g)});
    res.innerHTML=pos<10?'Settanta punti con due coordinate. Quasi tutta la variazione sta lungo x₁.':pos<58?`Si butta x₂ e si tiene solo x₁: ogni punto si sposta di pochissimo. Errore quadratico medio: <b>${nf(e1,2)}</b>.`:pos<72?'Torniamo ai dati di partenza e proviamo il contrario.':`Si butta x₁ e si tiene solo x₂: i punti finiscono ammucchiati. Errore quadratico medio: <b>${nf(e2,2)}</b>.`});
};

const CL=cloud(60,142,1.6,0.5,0.62),SC=cov2(CL),EC=eig2(SC);
FIG.proj1=function(st){
  let an=5;slider(st,'Direzione della retta',0,180,1,an,v=>v+'°',v=>{an=v;draw()});
  legend(st,[[C.blue,'dati','dot'],[C.orange,'proiezioni','dot'],[C.pink,'scarto']]);
  const p=plane(st,600,[-4.6,4.6],[-2.8,2.8],'Punti proiettati su una retta per l\'origine'),g=S('g',null,p.g);
  legend(st,[[C.orange,'varianza delle proiezioni'],[C.pink,'errore di ricostruzione']]);
  const q=Plot(st,{W:600,H:190,m:[40,10,12,42],xr:[0,180],yr:[0,3.4],label:'Varianza delle proiezioni ed errore al variare della direzione'});q.axes([0,45,90,135,180],[0,1,2,3],'direzione della retta (gradi)',null,v=>v+'°');
  const tot=SC[0]+SC[2],vr=a=>{const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);return c*c*SC[0]+2*c*s*SC[1]+s*s*SC[2]};
  S('path',{d:q.curve(vr,0,180,180),fill:'none',stroke:C.orange,'stroke-width':2.4},q.g);S('path',{d:q.curve(a=>tot-vr(a),0,180,180),fill:'none',stroke:C.pink,'stroke-width':2.4},q.g);
  const ln=S('line',{y1:q.ay,y2:q.ay+q.ah,stroke:'#fff','stroke-dasharray':'5 4'},q.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const b=[Math.cos(an*Math.PI/180),Math.sin(an*Math.PI/180)];S('line',{x1:p.sx(-9*b[0]),y1:p.sy(-9*b[1]),x2:p.sx(9*b[0]),y2:p.sy(9*b[1]),stroke:'#fff','stroke-width':1.8},g);
    CL.forEach(d=>{const z=d[0]*b[0]+d[1]*b[1];S('line',{x1:p.sx(d[0]),y1:p.sy(d[1]),x2:p.sx(z*b[0]),y2:p.sy(z*b[1]),stroke:C.pink,'stroke-width':1.3},g)});
    CL.forEach(d=>{const z=d[0]*b[0]+d[1]*b[1];S('circle',{cx:p.sx(z*b[0]),cy:p.sy(z*b[1]),r:3.4,fill:C.orange},g);S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:4,fill:C.blue,stroke:'#000','stroke-width':.6},g)});
    ln.setAttribute('x1',q.sx(an));ln.setAttribute('x2',q.sx(an));const v=vr(an);
    res.innerHTML=`Varianza delle proiezioni: <b>${nf(v,2)}</b>. Errore quadratico medio di ricostruzione: <b>${nf(tot-v,2)}</b>.<br>La somma è sempre ${nf(tot,2)}, la varianza totale dei dati.`}
  draw();
};

FIG.encdec=function(st){
  let pt=[1.9,2.0];const b=EC.b1,duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo);
  const p=plane(dl,420,[-4.2,4.2],[-3.3,3.3],'Un punto, la sua proiezione e la direzione principale'),g=S('g',null,p.g);
  CL.forEach(d=>S('circle',{cx:p.sx(d[0]),cy:p.sy(d[1]),r:3,fill:C.blue,opacity:.45},p.bg));S('line',{x1:p.sx(-9*b[0]),y1:p.sy(-9*b[1]),x2:p.sx(9*b[0]),y2:p.sy(9*b[1]),stroke:'#fff','stroke-width':1.6},p.bg);
  const svg=Svg(dr,420,320,'Dal dato al codice e ritorno'),gs=S('g',null,svg);cap(dl,'<b>trascina il punto bianco</b>: in arancione la sua ricostruzione');cap(dr,'<b>codifica e decodifica</b> con una sola direzione');
  drag(p,p.svg,(x,y)=>{pt=[clamp(x,-4,4),clamp(y,-3.1,3.1)];draw()});
  const T=(x,y,t,o)=>{const e=S('text',Object.assign({x,y,'text-anchor':'middle',style:'font-size:15px;fill:#fff'},o||{}),gs);e.textContent=t;return e};
  function draw(){g.textContent='';gs.textContent='';const z=pt[0]*b[0]+pt[1]*b[1],xr=[z*b[0],z*b[1]];
    S('line',{x1:p.sx(pt[0]),y1:p.sy(pt[1]),x2:p.sx(xr[0]),y2:p.sy(xr[1]),stroke:C.pink,'stroke-width':2},g);S('circle',{cx:p.sx(xr[0]),cy:p.sy(xr[1]),r:6.5,fill:C.orange,stroke:'#000'},g);S('circle',{cx:p.sx(pt[0]),cy:p.sy(pt[1]),r:8,fill:'#fff',stroke:'#000','stroke-width':1.5,style:'cursor:grab'},g);
    const box=(x,w,h,c,lab,vals,sub)=>{S('rect',{x:x-w/2,y:160-h/2,width:w,height:h,rx:8,fill:c,opacity:.9},gs);vals.forEach((v,i)=>T(x,160+(i-(vals.length-1)/2)*30+6,nf(v,2),{style:'font-size:17px;fill:#000;font-weight:700'}));T(x,160-h/2-12,lab,{style:'font-size:15px;fill:#fff'});T(x,160+h/2+22,sub,{class:'tag',style:''})};
    box(64,84,120,C.yellow,'dato x',pt,'2 numeri');box(210,84,60,C.blue,'codice z',[z],'1 numero');box(356,84,120,C.yellow,'ricostruzione x̃',xr,'2 numeri');
    arrow(gs,112,160,162,160,'#fff',2);arrow(gs,258,160,308,160,'#fff',2);T(137,146,'bᵀx',{class:'tag',style:''});T(283,146,'b·z',{class:'tag',style:''});
    T(210,292,`scarto fra x e x̃: ${nf(Math.hypot(pt[0]-xr[0],pt[1]-xr[1]),2)}`,{style:`font-size:15px;fill:${C.pink}`})}
  draw();
};

FIG.eig=function(st){
  let an=10;slider(st,'Direzione del vettore '+K('\\mathbf{b}'),0,180,0.5,an,v=>nf(v,1)+'°',v=>{an=v;draw()});
  legend(st,[['#fff','vettore b, lungo 1'],[C.yellow,'il vettore S b'],[C.gray,'direzioni degli autovettori']]);
  const p=plane(st,470,[-2.9,2.9],[-2.9,2.9],'L\'azione della matrice di covarianza su un vettore',['','']),g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  const Sb=b=>[SC[0]*b[0]+SC[1]*b[1],SC[1]*b[0]+SC[2]*b[1]];let d='',e='';for(let i=0;i<=120;i++){const t=i/120*2*Math.PI,b=[Math.cos(t),Math.sin(t)],s=Sb(b);d+=(i?'L':'M')+p.sx(b[0]).toFixed(1)+' '+p.sy(b[1]).toFixed(1);e+=(i?'L':'M')+p.sx(s[0]).toFixed(1)+' '+p.sy(s[1]).toFixed(1)}
  S('path',{d,fill:'none',stroke:'#777','stroke-dasharray':'3 4'},p.bg);S('path',{d:e,fill:'none',stroke:C.yellow,'stroke-width':1,opacity:.45},p.bg);
  [EC.b1,EC.b2].forEach(b=>S('line',{x1:p.sx(-4*b[0]),y1:p.sy(-4*b[1]),x2:p.sx(4*b[0]),y2:p.sy(4*b[1]),stroke:C.gray,'stroke-dasharray':'6 5'},p.bg));
  function draw(){g.textContent='';const b=[Math.cos(an*Math.PI/180),Math.sin(an*Math.PI/180)],s=Sb(b),v=b[0]*s[0]+b[1]*s[1],cr=Math.abs(b[0]*s[1]-b[1]*s[0]);
    arrow(g,p.sx(0),p.sy(0),p.sx(s[0]),p.sy(s[1]),C.yellow,3.2);arrow(g,p.sx(0),p.sy(0),p.sx(b[0]),p.sy(b[1]),'#fff',2.6);
    res.innerHTML=`${K('\\mathbf{b}^\\top S\\,\\mathbf{b}='+kn(v,2))}: la varianza dei dati proiettati lungo ${K('\\mathbf{b}')}.<br>`+(cr<0.03?`<b>${K('S\\mathbf{b}')} è parallelo a ${K('\\mathbf{b}')}</b>: è un autovettore, con autovalore ${K('\\lambda='+kn(v,2))}.`:`${K('S\\mathbf{b}')} punta in un'altra direzione: ${K('\\mathbf{b}')} non è un autovettore.`)}
  draw();
};

FIG.steps=function(st){
  const r=rng(145),RAW=[];for(let i=0;i<70;i++){const a=r.n(),b=r.n();RAW.push([2.6+1.5*a,2.1-0.55*a+0.32*b])}
  const n=RAW.length,mu=[0,1].map(k=>RAW.reduce((s,q)=>s+q[k],0)/n),sd=[0,1].map(k=>Math.sqrt(RAW.reduce((s,q)=>s+(q[k]-mu[k])**2,0)/n)),Z=RAW.map(q=>[(q[0]-mu[0])/sd[0],(q[1]-mu[1])/sd[1]]),E=eig2(cov2(Z));
  const p=plane(st,600,[-3.6,5.8],[-2.6,3.6],'I quattro passi della PCA'),g=S('g',null,p.g),res=out(st);
  player(st,120,8,pos=>{g.textContent='';const a=ez(clamp((pos-8)/20,0,1)),b=ez(clamp((pos-38)/20,0,1)),c=ez(clamp((pos-68)/12,0,1)),d=ez(clamp((pos-90)/22,0,1));
    if(c>0){[[E.b1,E.l1,C.yellow],[E.b2,E.l2,C.gray]].forEach(e=>{const L=2*Math.sqrt(e[1]);S('line',{x1:p.sx(-L*e[0][0]),y1:p.sy(-L*e[0][1]),x2:p.sx(L*e[0][0]),y2:p.sy(L*e[0][1]),stroke:e[2],'stroke-width':2.6,opacity:c},g)})}
    RAW.forEach((q,i)=>{let x=q[0]-mu[0]*a,y=q[1]-mu[1]*a;x=x*(1-b)+Z[i][0]*b*(a>=1?1:0)+(a<1?x*b*0:0);y=y*(1-b)+Z[i][1]*b;if(b>0){x=(q[0]-mu[0])*(1-b)+Z[i][0]*b;y=(q[1]-mu[1])*(1-b)+Z[i][1]*b}
      if(d>0){const z=Z[i][0]*E.b1[0]+Z[i][1]*E.b1[1],px=z*E.b1[0],py=z*E.b1[1];S('line',{x1:p.sx(x),y1:p.sy(y),x2:p.sx(x+(px-x)*d),y2:p.sy(y+(py-y)*d),stroke:C.pink,'stroke-width':1,opacity:.7},g);S('circle',{cx:p.sx(x+(px-x)*d),cy:p.sy(y+(py-y)*d),r:3.4,fill:C.orange},g)}
      S('circle',{cx:p.sx(x),cy:p.sy(y),r:3.8,fill:C.blue,stroke:'#000','stroke-width':.6,opacity:d>0?1-0.6*d:1},g)});
    res.innerHTML=pos<8?'I dati di partenza: lontani dall\'origine, e molto più sparsi lungo x₁ che lungo x₂.':pos<38?'<b>1. Si sottrae la media.</b> La nuvola si sposta sull\'origine.':pos<68?'<b>2. Si standardizza.</b> Ogni coordinata viene divisa per la sua deviazione standard: ora ciascuna ha varianza 1 e non dipende dall\'unità di misura.':pos<90?'<b>3. Autovettori della covarianza.</b> In giallo la direzione con l\'autovalore più grande: è la prima componente principale.':'<b>4. Proiezione.</b> Ogni punto viene sostituito dalla sua proiezione sulla prima componente.'});
};

/* ---------- immagini sintetiche di cifre ---------- */
const G=12,D=G*G;
const IMGS=(function(){const r=rng(147),A=[],seg=(x,y,x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1,t=clamp(((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-x1-t*dx,y-y1-t*dy)};
  for(let i=0;i<180;i++){const k=i%3,ox=5.5+0.45*r.n(),oy=5.5+0.4*r.n(),th=0.85+0.3*r(),sz=3.3+0.6*r(),sl=0.8*r.n(),v=new Float64Array(D);
    for(let y=0;y<G;y++)for(let x=0;x<G;x++){let d;if(k===0)d=Math.abs(Math.hypot((x-ox)/0.82,y-oy)-sz);else if(k===1)d=seg(x,y,ox+sl,oy-sz-0.6,ox-sl,oy+sz+0.6);else d=Math.min(seg(x,y,ox-sz*0.8,oy-sz,ox+sz*0.8,oy-sz),seg(x,y,ox+sz*0.8,oy-sz,ox-sz*0.3+sl,oy+sz+0.6));
      v[y*G+x]=clamp(1.35-d/th,0,1)+0.015*r.n()}A.push(v)}return A})();
const PCA=(function(){let c=null;return ()=>{if(c)return c;const n=IMGS.length,mu=new Float64Array(D);IMGS.forEach(v=>{for(let j=0;j<D;j++)mu[j]+=v[j]/n});const X=IMGS.map(v=>v.map((x,j)=>x-mu[j])),Sm=Array.from({length:D},()=>new Float64Array(D));
  X.forEach(v=>{for(let a=0;a<D;a++){const va=v[a];if(va===0)continue;const row=Sm[a];for(let b=a;b<D;b++)row[b]+=va*v[b]/n}});for(let a=0;a<D;a++)for(let b=0;b<a;b++)Sm[a][b]=Sm[b][a];
  const e=jacobi(Sm),tot=e.val.reduce((s,v)=>s+Math.max(v,0),0);c={mu,X,val:e.val,vec:e.vec,tot};return c}})();
function pic(host,v,px,mode){const cv=H('canvas',{width:G,height:G,role:'img','aria-label':'immagine'},host);cv.style.cssText=`width:${px}px;height:${px}px;image-rendering:pixelated;border:1px solid #333`;const c=cv.getContext('2d'),im=c.createImageData(G,G);let mx=0;if(mode)for(let j=0;j<D;j++)mx=Math.max(mx,Math.abs(v[j]));
  for(let j=0;j<D;j++){let col;if(mode){const t=v[j]/mx,a=Math.abs(t);col=t>0?[20+235*a,20+114*a,20+27*a]:[20+68*a,20+176*a,20+201*a]}else{const g=Math.round(255*clamp(v[j],0,1));col=[g,g,g]}im.data[4*j]=col[0];im.data[4*j+1]=col[1];im.data[4*j+2]=col[2];im.data[4*j+3]=255}c.putImageData(im,0,0);return cv}
const rowDiv=(host,gap)=>{const d=H('div',null,host);d.style.cssText=`display:flex;flex-wrap:wrap;justify-content:center;gap:${gap||8}px;margin:.3rem 0`;return d};
const cell=(row,v,px,mode,lab)=>{const d=H('div',null,row);d.style.cssText='display:flex;flex-direction:column;align-items:center;font-family:Figtree,sans-serif;font-size:.8rem;color:#bbb;line-height:1.5';pic(d,v,px,mode);if(lab)H('span',null,d,lab);return d};

FIG.eigimg=function(st){
  const P=PCA();cap(st,'<b>dodici delle 180 immagini</b> (12 × 12 pixel, quindi 144 numeri ciascuna)');const r0=rowDiv(st,6);for(let i=0;i<12;i++)cell(r0,IMGS[i*7],44);
  cap(st,'<b>l\'immagine media e le prime cinque componenti principali</b>');const r1=rowDiv(st,10);cell(r1,P.mu,76,0,'media');for(let k=0;k<5;k++)cell(r1,P.vec[k],76,1,'componente '+(k+1));
  legend(st,[[C.orange,'pixel che la componente accende'],[C.blue,'pixel che spegne']]);
};

FIG.scree=function(st){
  const P=PCA(),n=24,fr=P.val.slice(0,n).map(v=>v/P.tot);let cum=0;const cs=fr.map(v=>cum+=v);
  legend(st,[[C.yellow,'varianza catturata da ogni componente'],[C.pink,'varianza cumulata']]);
  const p=Plot(st,{W:600,H:300,m:[48,10,12,42],xr:[0.3,n+0.7],yr:[0,1.02],label:'Varianza catturata dalle prime componenti principali'});p.axes([1,4,8,12,16,20,24],[0,0.25,0.5,0.75,1],'componente principale',null,null,v=>Math.round(v*100)+'%');
  fr.forEach((v,i)=>S('rect',{x:p.sx(i+1)-8,y:p.sy(v),width:16,height:p.sy(0)-p.sy(v),fill:C.yellow},p.g));S('path',{d:p.poly(cs.map((v,i)=>[i+1,v])),fill:'none',stroke:C.pink,'stroke-width':2.4},p.g);cs.forEach((v,i)=>S('circle',{cx:p.sx(i+1),cy:p.sy(v),r:3,fill:C.pink},p.g));
  let c9=0,k90=0;for(let k=0;k<P.val.length;k++){c9+=Math.max(P.val[k],0)/P.tot;if(c9>=0.9){k90=k+1;break}}const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`La prima componente da sola cattura il ${pct(fr[0])} della varianza; ne bastano ${k90} su 144 per arrivare al 90%.`;
};

FIG.recon=function(st){
  const P=PCA(),MS=[0,1,2,3,5,8,12,20,40,144];let mi=3;slider(st,'Componenti principali tenute '+K('M'),0,MS.length-1,1,mi,v=>MS[v],v=>{mi=v;draw()});
  const ids=[0,3,1,4,2,5,6,10];cap(st,'<b>originali</b>');const r0=rowDiv(st,8);ids.forEach(i=>cell(r0,IMGS[i],60));const c1=cap(st,''),r1=rowDiv(st,8),res=out(st);res.style.minHeight='1.7em';
  function draw(){r1.textContent='';const m=MS[mi];let err=0;ids.forEach(i=>{const x=P.X[i],v=Float64Array.from(P.mu);for(let k=0;k<m;k++){let z=0;const b=P.vec[k];for(let j=0;j<D;j++)z+=b[j]*x[j];for(let j=0;j<D;j++)v[j]+=z*b[j]}cell(r1,v,60);for(let j=0;j<D;j++)err+=(v[j]-IMGS[i][j])**2});
    let kept=0;for(let k=0;k<m;k++)kept+=P.val[k];c1.innerHTML=`<b>ricostruzioni con ${m} ${m===1?'numero':'numeri'} per immagine</b> invece di 144`;
    res.innerHTML=m===0?'Con zero componenti ogni immagine è ricostruita come l\'immagine media.':`Varianza conservata: <b>${pct(kept/P.tot)}</b>. Ogni immagine è la media più ${m} ${m===1?'componente':'componenti'}, ciascuna con il suo coefficiente.`}
  draw();
};
M.pic={IMGS,PCA,pic,rowDiv,cell,G,D};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,ring,pct}=M;
const ez=t=>t*t*(3-2*t),PAL=[C.blue,C.orange,C.green,C.pink,C.yellow,C.purple,C.teal,C.red,'#fff','#9aa','#c96','#69c'];
const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2,de=(a,b)=>Math.sqrt(d2(a,b));
function blob(r,n,cx,cy,s){const a=[];for(let i=0;i<n;i++)a.push([cx+s*r.n(),cy+s*r.n()]);return a}
function sqp(host,W,xr,yr,label,noax){const pxu=(W-20)/(xr[1]-xr[0]),p=Plot(host,{W,H:Math.round(pxu*(yr[1]-yr[0]))+20,m:[10,10,10,10],xr,yr,label});if(!noax)S('rect',{x:p.ax,y:p.ay,width:p.aw,height:p.ah,fill:'none',stroke:'#333'},p.bg);return p}
const dot=(g,p,q,c,r)=>S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:r||4.2,fill:c,stroke:'#000','stroke-width':.7},g);
const cross=(g,p,q,c)=>{const x=p.sx(q[0]),y=p.sy(q[1]);S('path',{d:`M${x-8} ${y-8}L${x+8} ${y+8}M${x-8} ${y+8}L${x+8} ${y-8}`,stroke:'#000','stroke-width':6,'stroke-linecap':'round'},g);S('path',{d:`M${x-8} ${y-8}L${x+8} ${y+8}M${x-8} ${y+8}L${x+8} ${y-8}`,stroke:c,'stroke-width':3,'stroke-linecap':'round'},g)};

/* ---------- che cos'è un gruppo ---------- */
FIG.whatis=function(st){
  const r=rng(151),G=[blob(r,34,-3.4,1.2,0.5),blob(r,34,-3.0,-1.5,0.45),[],blob(r,22,2.4,0,0.4)];for(let i=0;i<46;i++){const t=2*Math.PI*i/46,q=2.1+0.12*r.n();G[2].push([2.4+q*Math.cos(t),q*Math.sin(t)])}
  const duo=H('div',{class:'duo'},st);[['i dati, senza etichette',0],['i gruppi che vorremmo trovare',1]].forEach(o=>{const d=H('div',null,duo),p=sqp(d,420,[-5.2,5.2],[-3,3],o[0]);G.forEach((g,k)=>g.forEach(q=>dot(p.g,p,q,o[1]?PAL[k]:C.lg,3.4)));cap(d,'<b>'+o[0]+'</b>')});
};

/* ---------- distanze ---------- */
FIG.unitballs=function(st){
  const PS=[1,1.5,2,3,6,Infinity];let pi=2,B=[1.5,0.9];
  slider(st,'Esponente '+K('p')+' della distanza',0,PS.length-1,1,pi,v=>isFinite(PS[v])?String(PS[v]).replace('.',','):'∞',v=>{pi=v;draw()});
  const pxu=420/5.2,p=Plot(st,{W:470,H:462,m:[40,10,10,42],xr:[-2.6,2.6],yr:[-2.6,2.6],label:'Punti alla stessa distanza da A al variare della metrica'});p.axes([-2,-1,0,1,2],[-2,-1,0,1,2],'x₁','x₂');
  S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#444'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#444'},p.bg);
  const g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';const dp=(q,pp)=>isFinite(pp)?Math.pow(Math.pow(Math.abs(q[0]),pp)+Math.pow(Math.abs(q[1]),pp),1/pp):Math.max(Math.abs(q[0]),Math.abs(q[1]));
  drag(p,p.svg,(x,y)=>{B=[clamp(x,-2.4,2.4),clamp(y,-2.4,2.4)];draw()});
  function draw(){g.textContent='';const pp=PS[pi],d=dp(B,pp);let s='';for(let i=0;i<=240;i++){const t=i/240*2*Math.PI,c=Math.cos(t),sn=Math.sin(t),k=d/dp([c,sn],pp);s+=(i?'L':'M')+p.sx(c*k).toFixed(1)+' '+p.sy(sn*k).toFixed(1)}
    S('path',{d:s+'Z',fill:'rgba(255,255,0,.10)',stroke:C.yellow,'stroke-width':2.2},g);S('line',{x1:p.sx(0),y1:p.sy(0),x2:p.sx(B[0]),y2:p.sy(B[1]),stroke:'#888','stroke-dasharray':'4 4'},g);
    [[0,0,'A'],[B[0],B[1],'B']].forEach(q=>{S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:11,fill:'#fff',stroke:'#000','stroke-width':1.5,style:q[2]==='B'?'cursor:grab':''},g);const t=S('text',{x:p.sx(q[0]),y:p.sy(q[1])+5,'text-anchor':'middle',style:'font-size:13px;font-weight:700;fill:#000'},g);t.textContent=q[2]});
    res.innerHTML=`Distanza fra A e B: Manhattan <b>${nf(dp(B,1),2)}</b> · euclidea <b>${nf(dp(B,2),2)}</b> · Chebyshev <b>${nf(dp(B,Infinity),2)}</b>.<br>La linea gialla passa per tutti i punti che, con l'esponente scelto, distano da A quanto B.`}
  draw();
};

/* ---------- clustering gerarchico ---------- */
function hc(P,mode,dist){dist=dist||de;let cl=P.map((q,i)=>({id:i,m:[i]}));const mg=[];let nid=P.length;const D=(a,b)=>{let mn=1e9,mx=0,s=0;a.m.forEach(i=>b.m.forEach(j=>{const d=dist(P[i],P[j]);mn=Math.min(mn,d);mx=Math.max(mx,d);s+=d}));return mode==='single'?mn:mode==='complete'?mx:s/(a.m.length*b.m.length)};
  while(cl.length>1){let bi=0,bj=1,bd=1e9;for(let i=0;i<cl.length;i++)for(let j=i+1;j<cl.length;j++){const d=D(cl[i],cl[j]);if(d<bd-1e-12){bd=d;bi=i;bj=j}}
    const a=cl[bi],b=cl[bj],n={id:nid++,m:a.m.concat(b.m),l:a,r:b,h:bd};mg.push(n);cl=cl.filter((c,k)=>k!==bi&&k!==bj);cl.push(n)}return mg}
/* disegna un dendrogramma dato l'elenco delle fusioni; restituisce la posizione delle foglie */
function dendro(g,mg,n,box,hmax,labels,upTo,frac,colorOf){const root=mg[mg.length-1],order=[];(function w(c){if(c.l){w(c.l);w(c.r)}else order.push(c.id)})(root);
  const X=i=>box[0]+(n>1?order.indexOf(i)*(box[2]/(n-1)):box[2]/2),Y=h=>box[1]+box[3]-h/hmax*box[3],pos={};order.forEach(i=>pos[i]=[X(i),0]);
  mg.forEach((c,k)=>{const a=pos[c.l.id],b=pos[c.r.id];pos[c.id]=[(a[0]+b[0])/2,c.h];if(upTo!=null&&k>upTo)return;const f=upTo!=null&&k===upTo?frac:1,col=colorOf?colorOf(c,k):'#fff';
    const ya=Y(a[1]),yb=Y(b[1]),yt=Y(c.h);S('path',{d:`M${a[0]} ${ya}L${a[0]} ${ya+(yt-ya)*f}`+(f>=1?`L${b[0]} ${yt}`:'')+`M${b[0]} ${yb}L${b[0]} ${yb+(yt-yb)*f}`,fill:'none',stroke:col,'stroke-width':2},g)});
  order.forEach(i=>{const t=S('text',{x:X(i),y:box[1]+box[3]+17,'text-anchor':'middle',style:'font-size:13px;fill:#ddd'},g);t.textContent=labels?labels[i]:i+1});return {X,Y,order}}

FIG.linkage=function(st){
  const A=[[-2.2,0.5],[-1.5,1.2],[-1.6,-0.4],[-2.6,-0.5],[-0.9,0.3]],B=[[1.2,0.9],[2.1,0.2],[1.6,-0.7],[2.6,1.0]],tri=H('div',{class:'trio'},st),prs=[];A.forEach(a=>B.forEach(b=>prs.push([a,b,de(a,b)])));prs.sort((x,y)=>x[2]-y[2]);
  [['Single linkage','la coppia più vicina',[prs[0]]],['Complete linkage','la coppia più lontana',[prs[prs.length-1]]],['Average linkage','la media su tutte le coppie',prs]].forEach((o,k)=>{const d=H('div',null,tri),p=sqp(d,230,[-3.4,3.4],[-2,2],o[0],1);
    o[2].forEach(s=>S('line',{x1:p.sx(s[0][0]),y1:p.sy(s[0][1]),x2:p.sx(s[1][0]),y2:p.sy(s[1][1]),stroke:C.yellow,'stroke-width':k===2?1:2.6,opacity:k===2?.5:1},p.g));A.forEach(q=>dot(p.g,p,q,C.blue,5));B.forEach(q=>dot(p.g,p,q,C.orange,5));
    const v=k===2?prs.reduce((s,x)=>s+x[2],0)/prs.length:o[2][0][2];cap(d,`<b>${o[0]}</b><br>${o[1]}<br>distanza fra i gruppi: ${nf(v,2)}`)});
};

const HP=(function(){const r=rng(153);return blob(r,5,-2.4,1.0,0.45).concat(blob(r,4,-1.2,-1.4,0.4),blob(r,5,2.2,0.3,0.55))})();
FIG.agglo=function(st){
  const mg=hc(HP,'average'),n=HP.length,duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=sqp(dl,420,[-4.2,4.2],[-3.2,3.2],'Quattordici punti che si fondono in gruppi'),g=S('g',null,p.g);
  const svg=Svg(dr,420,330,'Il dendrogramma che cresce'),gd=S('g',null,svg);cap(dl,'<b>i punti</b>: stesso colore, stesso gruppo');cap(dr,'<b>il dendrogramma</b>: l\'altezza di ogni fusione è la distanza fra i due gruppi uniti');
  const res=out(st),PER=11,hmax=mg[n-2].h*1.05,cen=m=>[m.reduce((s,i)=>s+HP[i][0],0)/m.length,m.reduce((s,i)=>s+HP[i][1],0)/m.length];
  player(st,(n-1)*PER+8,8,pos=>{g.textContent='';gd.textContent='';const k=Math.min(n-2,Math.floor(pos/PER)),fr=clamp((pos/PER-k)/0.7,0,1),done=pos>=(n-1)*PER;
    let cl=HP.map((q,i)=>({id:i,m:[i]}));for(let j=0;j<k+(done||fr>=1?1:0);j++){const c=mg[j];cl=cl.filter(x=>x.id!==c.l.id&&x.id!==c.r.id);cl.push(c)}
    const cur=mg[k];if(!done&&fr<1){const a=cen(cur.l.m),b=cen(cur.r.m);S('line',{x1:p.sx(a[0]),y1:p.sy(a[1]),x2:p.sx(b[0]),y2:p.sy(b[1]),stroke:'#fff','stroke-width':2,'stroke-dasharray':'5 4',opacity:fr},g)}
    cl.forEach(c=>{const col=PAL[Math.min(...c.m)%PAL.length],ce=cen(c.m);if(c.m.length>1)c.m.forEach(i=>S('line',{x1:p.sx(HP[i][0]),y1:p.sy(HP[i][1]),x2:p.sx(ce[0]),y2:p.sy(ce[1]),stroke:col,'stroke-width':1.3,opacity:.7},g));c.m.forEach(i=>dot(g,p,HP[i],col,5.5))});
    dendro(gd,mg,n,[30,16,360,270],hmax,null,done?n-2:k,done?1:fr);
    res.innerHTML=done?'Tutti i punti sono in un solo gruppo: il dendrogramma è completo.':`Fusione ${k+1} di ${n-1}: si uniscono i due gruppi più vicini, a distanza ${nf(cur.h,2)}. Restano ${n-k-(fr>=1?1:0)} gruppi.`});
};

FIG.abcd=function(st){
  const P=[[1,6],[1,4],[1,1],[5,1]],L=['A','B','C','D'],man=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),leaf=i=>({id:i,m:[i]});
  const mk=seq=>{const nodes=[0,1,2,3].map(leaf),mg=[];seq.forEach((s,k)=>{const n={id:4+k,l:nodes[s[0]],r:nodes[s[1]],h:s[2],m:nodes[s[0]].m.concat(nodes[s[1]].m)};nodes.push(n);mg.push(n)});return mg};
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=Plot(dl,{W:420,H:300,m:[34,10,10,42],xr:[0,6],yr:[0,7],label:'I quattro punti dell\'esempio'});p.axes([0,1,2,3,4,5,6],[0,1,2,3,4,5,6,7],'x₁','x₂');
  P.forEach((q,i)=>{S('circle',{cx:p.sx(q[0]),cy:p.sy(q[1]),r:13,fill:C.orange,stroke:'#000'},p.g);const t=S('text',{x:p.sx(q[0]),y:p.sy(q[1])+5.5,'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:#000'},p.g);t.textContent=L[i]});
  const sv=Svg(dr,420,300,'Matrice delle distanze di Manhattan'),cw=62,x0=110,y0=62;L.forEach((l,i)=>{[[x0+i*cw+cw/2,y0-14],[x0-22,y0+i*cw*0.8+32]].forEach(q=>{const t=S('text',{x:q[0],y:q[1],'text-anchor':'middle',style:`font-size:17px;fill:${C.orange};font-weight:700`},sv);t.textContent=l});
    L.forEach((m,j)=>{const v=man(P[i],P[j]);S('rect',{x:x0+j*cw,y:y0+i*cw*0.8,width:cw-4,height:cw*0.8-4,fill:i===j?'#161616':'#222',stroke:'#444'},sv);const t=S('text',{x:x0+j*cw+cw/2-2,y:y0+i*cw*0.8+31,'text-anchor':'middle',style:'font-size:17px;fill:#fff'},sv);t.textContent=v})});
  cap(dl,'<b>quattro punti</b>');cap(dr,'<b>distanze di Manhattan</b> fra ogni coppia');
  const tri=H('div',{class:'trio'},st);tri.style.marginTop='.8rem';
  [['Single linkage',[[0,1,2],[4,2,3],[5,3,4]],'{A,B} con C a 3, poi D a 4'],['Complete linkage',[[0,1,2],[2,3,4],[4,5,9]],'C con D a 4, poi tutto a 9'],['Average linkage',[[0,1,2],[2,3,4],[4,5,6]],'C con D a 4, poi tutto a 6']].forEach(o=>{const d=H('div',null,tri),s=Svg(d,230,220,o[0]),g=S('g',null,s),mg=mk(o[1]),info=dendro(g,mg,4,[56,14,140,170],10,L);
    [0,2,4,6,8,10].forEach(h=>{const y=info.Y(h);S('line',{x1:34,x2:38,y1:y,y2:y,stroke:'#666'},g);const t=S('text',{x:30,y:y+4,'text-anchor':'end',style:'font-size:11px;fill:#aaa'},g);t.textContent=h});S('line',{x1:38,x2:38,y1:info.Y(0),y2:info.Y(10),stroke:'#666'},g);
    cap(d,`<b>${o[0]}</b><br>${o[2]}`)});
};

const CUTP=(function(){const r=rng(155);return blob(r,9,-2.3,-0.6,0.5).concat(blob(r,9,1.2,1.0,0.5),[[3.6,-2.4]])})();
FIG.cut=function(st){
  const mg=hc(CUTP,'average'),n=CUTP.length,hmax=mg[n-2].h*1.06;let h=hmax*0.55;
  slider(st,'Altezza del taglio',0.05,hmax*0.98,0.02,h,v=>nf(v,2),v=>{h=v;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=sqp(dl,420,[-4.4,4.8],[-3.4,2.8],'I punti colorati secondo il taglio'),g=S('g',null,p.g),svg=Svg(dr,420,300,'Dendrogramma con la linea di taglio'),gd=S('g',null,svg);
  cap(dl,'<b>i gruppi</b> che risultano dal taglio');cap(dr,'<b>il dendrogramma</b> e la linea di taglio');const res=out(st);res.style.minHeight='1.7em';
  function draw(){g.textContent='';gd.textContent='';const top=new Map();(function w(c){if(!c.l||c.h<=h){const key=Math.min(...c.m);c.m.forEach(i=>top.set(i,key));return}w(c.l);w(c.r)})(mg[n-2]);const keys=[...new Set(top.values())].sort((a,b)=>a-b);
    CUTP.forEach((q,i)=>dot(g,p,q,PAL[keys.indexOf(top.get(i))%PAL.length],5.5));
    const info=dendro(gd,mg,n,[26,14,370,250],hmax,CUTP.map(()=>''),null,1,c=>c.h<=h?PAL[keys.indexOf(top.get(c.m[0]))%PAL.length]:'#777');S('line',{x1:10,x2:410,y1:info.Y(h),y2:info.Y(h),stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'6 4'},gd);
    res.innerHTML=`Tagliando a questa altezza si ottengono <b>${keys.length}</b> ${keys.length===1?'gruppo':'gruppi'}.`+(keys.length===3?' Il punto isolato in basso a destra forma un gruppo da solo: è un candidato outlier.':'')}
  draw();
};

/* ---------- k-means ---------- */
function assign(P,mu){return P.map(q=>{let b=0;for(let j=1;j<mu.length;j++)if(d2(q,mu[j])<d2(q,mu[b]))b=j;return b})}
function update(P,c,mu){return mu.map((m,j)=>{let x=0,y=0,n=0;P.forEach((q,i)=>{if(c[i]===j){x+=q[0];y+=q[1];n++}});return n?[x/n,y/n]:m.slice()})}
const Jof=(P,c,mu)=>P.reduce((s,q,i)=>s+d2(q,mu[c[i]]),0);
function kmeans(P,mu,maxIt){let c=assign(P,mu);for(let it=0;it<(maxIt||100);it++){const nm=update(P,c,mu),nc=assign(P,nm);const same=nc.every((v,i)=>v===c[i]);mu=nm;c=nc;if(same)break}return {c,mu,J:Jof(P,c,mu)}}
const KP=(function(){const r=rng(157);return blob(r,24,-2.2,1.2,0.6).concat(blob(r,24,2.0,1.4,0.6),blob(r,24,0.2,-1.6,0.65))})();

FIG.kmeans=function(st){
  const ST=[];{let mu=[[-3.2,-2.2],[-2.4,-2.6],[3.4,-2.4]],c=null;ST.push({t:'i',mu,c:null});for(let it=0;it<12;it++){const nc=assign(KP,mu);if(c&&nc.every((v,i)=>v===c[i]))break;c=nc;ST.push({t:'a',mu,c,J:Jof(KP,c,mu)});const nm=update(KP,c,mu);ST.push({t:'u',mu:nm,pm:mu,c,J:Jof(KP,c,nm)});mu=nm}}
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=sqp(dl,420,[-4.4,4.4],[-3.4,3.4],'k-means passo per passo'),g=S('g',null,p.g);
  const Jm=Math.max(...ST.filter(s=>s.J).map(s=>s.J))*1.08,q=Plot(dr,{W:420,H:330,m:[48,10,12,42],xr:[0,ST.length-1],yr:[0,Jm],label:'La distorsione a ogni mezzo passo'});q.axes(ST.map((s,i)=>i).filter(i=>i%2===1),[0,Math.round(Jm/2/10)*10,Math.round(Jm/10)*10],'mezzi passi dell\'algoritmo','distorsione J');
  const lc=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},q.g),gq=S('g',null,q.g);cap(dl,'<b>punti e centroidi</b> (le croci)');cap(dr,'<b>la distorsione</b> non sale mai');const res=out(st),PER=14;
  player(st,(ST.length-1)*PER+10,8,pos=>{g.textContent='';gq.textContent='';const fin=pos>=(ST.length-1)*PER,k=Math.min(ST.length-2,Math.floor(pos/PER)),t=fin?1:ez(clamp((pos/PER-k)/0.6,0,1)),prev=ST[k],s=ST[k+1];
    const mu=s.t==='u'?s.mu.map((m,j)=>[s.pm[j][0]+(m[0]-s.pm[j][0])*t,s.pm[j][1]+(m[1]-s.pm[j][1])*t]):s.mu;
    KP.forEach((pt,i)=>{const cc=s.t==='a'?(t>0.5?s.c[i]:(prev.c?prev.c[i]:-1)):s.c[i];if(s.t==='a'&&!fin&&t>0.15)S('line',{x1:p.sx(pt[0]),y1:p.sy(pt[1]),x2:p.sx(mu[s.c[i]][0]),y2:p.sy(mu[s.c[i]][1]),stroke:PAL[s.c[i]],'stroke-width':.8,opacity:.45},g);dot(g,p,pt,cc<0?C.lg:PAL[cc],4)});
    mu.forEach((m,j)=>cross(g,p,m,PAL[j]));const nd=k+(t>=1?1:0),done=[];for(let i=1;i<=nd;i++)done.push([i,ST[i].J]);lc.setAttribute('d',done.length>1?q.poly(done):'');done.forEach(d=>S('circle',{cx:q.sx(d[0]),cy:q.sy(d[1]),r:4,fill:C.pink},gq));
    res.innerHTML=fin?`I gruppi non cambiano più: l'algoritmo si ferma. Distorsione finale ${nf(ST[ST.length-1].J,1)}.`:s.t==='a'?`<b>Assegnazione.</b> Ogni punto prende il colore del centroide più vicino. ${K('J='+kn(s.J,1))}.`:`<b>Aggiornamento.</b> Ogni centroide si sposta nella media dei suoi punti. ${K('J='+kn(s.J,1))}.`});
};

const KP4=(function(){const r=rng(159);return blob(r,20,-2.6,1.6,0.5).concat(blob(r,20,2.4,1.7,0.5),blob(r,20,-2.2,-1.7,0.5),blob(r,20,2.6,-1.5,0.5))})();
FIG.kinit=function(st){
  let seed=2;const hist=[];btn(st,'Nuova inizializzazione casuale',()=>{seed++;draw()});
  const duo=H('div',{class:'duo'},st),dl=H('div',null,duo),dr=H('div',null,duo),p=sqp(dl,420,[-4.4,4.4],[-3.2,3.2],'Risultato di k-means da un\'inizializzazione casuale'),g=S('g',null,p.g);
  const q=Plot(dr,{W:420,H:310,m:[48,10,12,42],xr:[0.5,12.5],yr:[0,260],label:'Distorsione finale di ogni tentativo'});q.axes([1,3,5,7,9,11],[0,100,200],'tentativo','distorsione finale J');const gq=S('g',null,q.g),c1=cap(dl,''),res=out(st);cap(dr,'<b>distorsione finale</b> di ogni tentativo');res.style.minHeight='1.7em';
  function draw(){g.textContent='';gq.textContent='';const r=rng(seed*13+1),idx=[];while(idx.length<4){const i=Math.floor(r()*KP4.length);if(!idx.includes(i))idx.push(i)}const init=idx.map(i=>KP4[i].slice()),o=kmeans(KP4,init);
    init.forEach(m=>S('circle',{cx:p.sx(m[0]),cy:p.sy(m[1]),r:11,fill:'none',stroke:'#fff','stroke-width':2,'stroke-dasharray':'3 3'},g));KP4.forEach((pt,i)=>dot(g,p,pt,PAL[o.c[i]],4));o.mu.forEach((m,j)=>cross(g,p,m,PAL[j]));
    hist.push(o.J);if(hist.length>12)hist.shift();const mn=Math.min(...hist);hist.forEach((v,i)=>S('rect',{x:q.sx(i+1)-10,y:q.sy(Math.min(v,260)),width:20,height:q.sy(0)-q.sy(Math.min(v,260)),fill:Math.abs(v-mn)<1e-6?C.yellow:C.lg},gq));
    c1.innerHTML='<b>cerchi tratteggiati</b>: centroidi iniziali · <b>croci</b>: centroidi finali';res.innerHTML=`Questo tentativo: ${K('J='+kn(o.J,1))}. Il migliore finora: ${nf(mn,1)}`+(o.J>mn*1.2?'. Qui l\'algoritmo si è fermato in un minimo locale.':'.')}
  draw();
};

FIG.elbow=function(st){
  const r=rng(161),R=[];for(let k=1;k<=8;k++){let b=1e9;for(let t=0;t<12;t++){const idx=[];while(idx.length<k){const i=Math.floor(r()*KP.length);if(!idx.includes(i))idx.push(i)}b=Math.min(b,kmeans(KP,idx.map(i=>KP[i].slice())).J)}R.push(b)}
  const p=Plot(st,{W:600,H:300,m:[52,10,12,42],xr:[0.5,8.5],yr:[0,R[0]*1.06],label:'Distorsione minima al variare del numero di gruppi'});p.axes([1,2,3,4,5,6,7,8],[0,Math.round(R[0]/2/10)*10,Math.round(R[0]/10)*10],'numero di gruppi K','distorsione J');
  S('path',{d:p.poly(R.map((v,i)=>[i+1,v])),fill:'none',stroke:C.pink,'stroke-width':2.6},p.g);R.forEach((v,i)=>S('circle',{cx:p.sx(i+1),cy:p.sy(v),r:i===2?7:4.5,fill:i===2?C.yellow:C.pink,stroke:'#000'},p.g));
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`Da ${K('K=1')} a ${K('K=3')} la distorsione crolla da ${nf(R[0],0)} a ${nf(R[2],0)}; da 3 a 4 scende solo a ${nf(R[3],0)}. Il «gomito» suggerisce tre gruppi.`;
};

FIG.kfail=function(st){
  const r=rng(163),A=blob(r,40,0,0,0.45);for(let i=0;i<70;i++){const t=2*Math.PI*i/70,q=2.5+0.12*r.n();A.push([q*Math.cos(t),q*Math.sin(t)])}
  const B=blob(r,70,-1.6,0,1.15).concat(blob(r,26,2.3,1.3,0.28),blob(r,26,2.5,-1.3,0.28));
  const run=(P,k)=>{let best=null;const rr=rng(5);for(let t=0;t<15;t++){const idx=[];while(idx.length<k){const i=Math.floor(rr()*P.length);if(!idx.includes(i))idx.push(i)}const o=kmeans(P,idx.map(i=>P[i].slice()));if(!best||o.J<best.J)best=o}return best};
  const duo=H('div',{class:'duo'},st);[[A,2,'Un anello attorno a un gruppo','k-means con K = 2 taglia a metà: non può mettere l\'anello in un gruppo solo'],[B,3,'Un gruppo largo e due piccoli e fitti','k-means con K = 3 spezza il gruppo largo invece di separare i due piccoli']].forEach(o=>{const d=H('div',null,duo),p=sqp(d,420,[-4.4,4.4],[-3.2,3.2],o[2]),res=run(o[0],o[1]);
    o[0].forEach((q,i)=>dot(p.g,p,q,PAL[res.c[i]],3.4));res.mu.forEach((m,j)=>cross(p.g,p,m,PAL[j]));cap(d,`<b>${o[2]}</b><br>${o[3]}`)});
};
M.clu={hc,dendro,kmeans,blob,PAL};
})();
window.__ML.AEW={"ae8":{"sizes":[144,8,144],"sc":8329.405137054733,"b":"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"},"ae2":{"sizes":[144,32,2,32,144],"sc":2868.2152028999512,"b":"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"},"ae2s":{"sizes":[144,2,144],"sc":7015.940996491286,"b":"FxEBC0v8l/5xA7UA0AJ0BRkF8wmK79P6f/CU//EC/AFNANT/CAXAA+z8VvtQ/2cgw/CM+Pv59P0LAFcCcwTFAPv8yf00/xP8DQCS+4EAo/n1+xcD/wNN/DT6AP8h+sv9+/EA/UL/SP6l/7EGUQQa/uz9wfsjAeEH1QtrApr9VfoJAFEFJP7T/i/+Q//qAYIHKQeq/V/42P20/r4O9P6F/LT9kvuI/owDZPbXArz+NQBA+iANIwOBANr8+fyIAEz+OxH3AdIBPf0Z/70F4gEZ/dT+Kv7KBSj/ShteCmcAiP0l/pL/NQcK/7z7fgdxAvAGdA6x/yT/i/wwARYBAQKcASn9J/KQIIcDD/wU/V0GvAalAZkGdwVZDT/9gecaE2UCrguxCTgAjgAHAXUEngHp+UD81vktAdIL9A31E/H+ivX9AX4FcAQf/Yf1Lv8A/LkL2ONW+nT3UPsm/PwI+QbJ/6X57/38ABsKjfLiAyXyUAAtAmoEm/88AJsBA/vO+VD9+wGtAa8FTgGX/qQO2f6G/GsBoAF77eEMjQax/PYFYAO5BoQH0AMH/KD9/gDN7P/mFwUwALf+BwT2++wC1AHI+ncBOwEw7iIALRFP/U/+2wXi+/oGLgN8/JsENPrp/cgXYwKZBKX5UgU9BGECBQWGAaT9vvg5/BECpBbI6dzzqvwy/dQCiAq8CjD5+fwi+b7rzhGXCt79Df3L/IUC5gW2+bDyHewTDyQd9e/iCgv++v1NAa4EXwJa/5D5CQauCQMElQqECGjhSrMn5UGuJe0Sniv4c59KCRzM8ROi2TUSPNiP+JvDJvMDumrwO5Uh5x6z/t0snUvujL5I4sq4ZRxjsB8MX7fGAC7mfQESAJsCyfte/4fajAxpq04Kgroi7dak2uN2xDzcL6Qz82Gu8Q9qxgbtwtEN2Wn1YOdAEGfklge81Evo8/JUzPsFC9LZ7SyyFOVpvBfdCsLM5N6hB+X+5zm9YRDI2mkLKBKoDKoQ/A/84ZjsC8yL5BPli88+4wGzpuMSspvipKX31pTBfqy37kGFN+8l6DzsAESVAJxOr/AVBYnNhbzq5y29h94F2ajAn9ztlxPdCaZozRK+Ap+C7JCKzuoW+C/chFGo+Q5ixtzDDyLKJb8995Sbkd4w5A3VEuCPsHPcWbus4lHQupls4iWWl/W/+O7Xo2IJ5EhfEtDRBWvYY68y//CYQ+wC3l+srvUZy0rVja3Q142rnq1N4wCDPgpw7pHmZFnP2wBEV+B/70T4rpPn+/KXjso9zb+YpOJVnY3eFLyG4+mvxLkpv7+WWvh/1zn3uhjS7SgPJhCdzfsaspkN6gmxk8by2em4N9+duADdGZ+c4JG5+9PVtJPXlNZQ3WfnkOsdFGXa3SVJzSMQJbkR2sTU77M95I+4oOC8uNXjZcL729+qifcLrwUKM7PDBE3S4gAs/uP7Gw8g95n1pOj6x7jeK6FZ6P2YQtT7v+rU9M4R3f6viOz4jQb6Pa3rAibD+QVc4L8EOeNLAtTGBN4opQXhHq/o2VSbn+DI0fW/7cM/yZPLcMz0yY/JTMlbxVfPM8NyyNW+nb7N3uH6tvq/+0j++v1s/k/qq9SjuNi/2cZU9oIbASSXIvEoLy0yHST04duRv+G1SMwP51DzuvbP8NftgRYiJ5j+0cvFvkbFacRO2BTmDeLBxXrTvBR0JIbxmsEnyF2/YM7w37vdYNZLw7rjYw1XAvPooMCNwlC6eMX85ePb49i/zyD6OwLv7vbXYdSJuaS83M0K4M/TF+n96D3+CfNz7QDlFdKeym+6HcM752fo0QWeEgH5UO7b8GrZdLrDudHFcr2Bzoz2eBqPEjoE9vEf4k/MOb81vP6638FSz7fs2APJ9+vlSODkznPEbcWdtEKvUcJC1D3UPtevzzrMJsiwwpDAmMSwsg=="},"ae32":{"sizes":[144,32,144],"sc":10478.159618601632,"b":"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"},"dae":{"sizes":[144,24,144],"sc":11328.998724832547,"b":"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"},"venc":{"sizes":[144,32,4],"sc":20568.617321429803,"b":"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"},"vdec":{"sizes":[2,32,144],"sc":4887.896729095054,"b":"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"},"snaps":[{"ep":0,"loss":0.21871,"b":"a32Dh4dsa62gd6mTqF+HY2l4dn6fg4ZJdGJ0j3+vc62AdHGIl4xrepGBnZynnG59hnNnUH5vjHaWTbFemKOWhKF/gXqZg3WOpYVQXGJ0sJeOd4OTaGuna312jWawj2WefICfWWZiaUmikaeSfrVXUX+kkIJrqXN8d2ugi35vdXSmdHqCj4VTZ2KdenShh6xqgXF9e3ZmWamxdp6llWxyW5CBh26WjI1Af2ZzeYaXb5SMZ26WqWZ5bJh+fpmwk3GHZoBVWoeImm2NWqFQjKOglKKBeoiLfYaQqpNVYG2ImpeUdJWadmmYdHWKi3SrrU2Sj4GYS2OEYFyblMCporhhWo6fk2NwrmuBcWO8ln2CYGagjXqVpIZPaFqjh3mYkLdoZYSDi451kIRuf4d9nm6We2GJc4WJb4OBc3SAmHOZfJJqinp6caF1h3uFmoN3lH13k2WIcHZoboOJbZWRkYNzeYV3iXWShWuIe3Ztc2tmonyCfHV6cnyKbH5zhHiQZY+NdXuCiIJhfGaIgGprXoVyb26DfJ14hISAhoZwf3lxiImaZX1zfXuGf4mGdHmHbn9/bYaJhoh8jIV0coZ9jG+MeW6Kdo2Fc3p+gIV8k3aPepZqfoOFeJ10kHCDm4CEi4Zwj3R/fnN0c32McISJiId0gnd4iHR/hHmGeIBzb2xnk317i4Bthn6Ef4Z4gniJcYaMeXaBh39mhXh/fHJuYYd6gG+Edph+gYKAg35xfnV4fomGbXh4en6Hg4eBenSFeIWMXImNlppxg5yEdJh+qGaYe1COcpiNcoZybmeNqHytfLJdfH13cKRteHWDrYyZo4JsoGZ2Znxng4yUUrWPlpGBgI1jkoCYjGSgi4ZdaFZct4SIjIV9Z4akaIBxkm2lW3yLZ3yPdGpOilWXfGdtWKFdZnGfjpl5k42Gd3xxfIByhY+bZXlugYB3b4CAeX+QcJKCWJaWm5qMl4tqa55pl2aXgUZ2XqKXe2aAfY1/o2ysh7huiYZ0cLxnpnaBvouDkYJnqnCOc2VXbYWbXpyVkY10bnJzkWWNjmaFfHpmaGVTq5B3nXdnc3yYfopyhmeVVZynY2+YjoNJkF2Ie1JcQ4xud1mSba9/gZJ2iIRXZ31klJSDW3RpYoJ8d4V4eW6ZfYCJ"},{"ep":1,"loss":0.19078,"b":"TXBxYHNnjXRmaYCQpUSeaWWOkoCFU3ptgXBwl2atX4tCf3mmap9snE6ioHtxilxijkN2alB8P1KXXlyPlJJfkmKDnVJ8eFKQVlRPTFxGllV1eWU5lVh8goBpZW2XZZqIim9oiZxbbG1xioVYNWlna1OQWbt0kW1qoG5vjVZpWXqwZGRefISHnX6TZmt5T3KAY250Y2hzf3N3aYCZjFaEY4CGkXOGZ3RhjoRrfmmZZX1eeXmlh4V5m2eXj4J8fmBvdFtwdlmGT02TbVZ/ipdzlWWJkll2eGSIamZXV3BYgmh8gHZJllh1j3t+ZneVhomPlW9zfZx3ZntxjZhvVHFzdV+LXaB9lG1qm2qMiWF1V3OgfWZ1hod3k3KVeWx+Z4J7U21pZXNdlnFdfnCPrU+kbGqYk299So57b2B0l2ygYHZCinOXYp1yg1idjnRhk2Fui0CAZ2B5Q2CHaWiVmIVZiXWBll+KdlWMWFNaXl5UnU57YF1QhGN2Z3pjbnaOYZ13iHpckZliaGx3hn5WQmRpY2N/arVsiGx1m3tvll9tZX66YG9hhXqUnYyVX3FwR2x7VnBvY29hlHZic3GNok+daHKblHV6Sol5eGtwlm+ZX3xCgHqfZp5viFGbkXFtjmpoikl3cF+BSF+JaGCOkohZjm1/lF58d2GLV1xdW1xVlU93amZKkWZ0dIFkcXaKapN2h3Zdj5RjcXdzgYNXRGlsbmWBa7Nvhmt3lXRul1tzX3+sZWtkg3qVnoySYmtvTXOGRHRzdYpWkntfdnuGt0mvdFCeiod/S42AaVGGrm61apI6hnGMUqdqfVOdoXdvoWhjnDd4X19qS3WRVYmimYFWhndnoGqRf0iiV1lOVkxFslR9bmVOeGyHXHdlfG+aRpZ3dHNjholQelt9fl9OM3NcXliTcrhri3x8kH1ejF9oa4O8U2xXgnmTkY2JXnhzQG18RHl2d4VhoW5PdXeBrU2uc1Oag4WCSoGMdGZ/qWOrbYhAkHWQVLNrk1ScpHBfmWxjnDmEbFZnQHKQYXSoln5Lf2lun16JgU2WTVdVWFVCqFd2dGJIg2Z4Z3preXGNSKSDdmtilptUe2VxfFREL2VrakyEX8Buf396m4RViF5mbYS1UmpZeXeempWJX25yQ2WC"},{"ep":2,"loss":0.16342,"b":"NllfR2hLcGtnUmyPqSyaYlOYooJqO3tYa0p2nnfHW50nY2ykTYNffDiroH2KiUdHiClWWkODP0qaP1aRjIxXnk9nqlhyZzOnQ0Q3ODs4nT1uc14eilJ9dXBlZWGeRYRffWdNcIZWfWVmenlIH1tGWlqzarltlGBdkFNhh0dsQXK0W09DeX95k21/Vm5fMGJ3Ql9oTF1hcm1wUXKOmTaHYFyLnnxvRXJRdWRvj3e7W580ZXeiYYRkg0KhooSRgUhMgj1bY0eIREKZR1GJi5pomk1zpFFxaD2ZVE4+QEhAlEhufGQkiVV/hXZnY2KcWYhqgW1YdYxdfG5ofIZOKV1LYWKtbLJ3lGJXkU9sgFZyR3mhblBNdIVtjWl+ZWppQm18PVRTSF5BgmlYbl6StDOgWWCdol5pMZJhWz5rlXe2WHkudWKbTohkaEqmhnVtkUdafidkUlF9PFKFTlqLlIFNkGpzm1uDZTuURj5ASEJMozd1S042eVFxV2pdbWmTUYtXgXJDfpBkaF9vfYNHLlVKTGyXeLVci1dnkWFpmk9rSm7FVltLhnCGmHyRTGlaLGFsPlhZS2BDg21aZ2GPrTSeWGOgn2ZpMo1jYEVrmHqyWoEucGeeT41hbEWii3J2j1FWgSxgWVGAQVaHTlmIkIJMkmVvml17Z0OURUZDR0BLnzpyU1U1glVxXnBfc2mQVIRYfm9FfYpicmZteIBGL1tNU2yYebNdiFlri19lmU1uSnC7VlpNg3CKmH6NTmVaMGZ1MGFhYIQ8fHZaZG2AvDKvakGhjoRsOI1tUzKHtX/MbqQrcWCGO5ZaZEegnnqBoVdNmCJeS1JlTXmTO4mbknZKh21SpHOLcDGsRkg5QTI+u0d1YFo4aWKGSmhjhGKbMIBaZGlPbnJNiEx0b1JBIWtCSl6ugrRciW5zfmlPiFJmV3bAQ1xAfG6HhX58S3NgKmBvL2BgXoI7g29RZGiAuTKxZ0WkjoFsNYp1WDWDs3jIbpordF+LOZpbbUWim3N2nllNliBgUE1lRniRQHyfj3BBh2dSpW+FcTOqPUY7QTM8tkRyYFk0cl57TGhog2WUMINcZ2NLdHxShlJub049IGRJT1and7dag251hG1MikxlVXPBQVpBfWuRjYN+SW9cKFtx"},{"ep":3,"loss":0.1345,"b":"Jz9EL1QtXk9NRE6Lnh2USlybomhUKHFOXTBjjn7NZYokUE+mN2ZSdjqrgnWBdjY5ahZBVDB8OkiQOzeCdW49mz1ao1VeWCWfJi8vLi07ijFjWUwTiThaaFd1ZFyMOmtGd00xYYpwe2tSa2k4FkI+TVq2aa9UgUlThUZUhTNlM1O5RT00dmd4k194PltCG0phLkVNNEo/Y1JVQlOJkSODTF6SoWdWLWtJZUVhhn/EYZApVF6jRWxWeD6ki3uLczg6ayFFXTWDPD+QPzaCeYBKmTphok5fWSuYMjgzNTM9hjZjZVIVhj9hdmByY1yORnNMeFU4aY9vfnNUanI4GkM+VGK0bq5hhE5Oh0JafkBtN2CnVz06cW9vjl90TFpJJVNrKTw8MksrakxFWEaOqSKWRl+cok1TI4JRTylghnvDY28pYkmXOWhYX0uncnRrfzJGYhRLSzp2N0x/Qz6FgGs6jVBhnVdyViWVKyswOjFIli5qP0AfcDhXTlBya2GJPnZCeFgtaZR7aV9ZbWw1HT08P2ildKtNfkdWiE9cjz9lOlTIRkQ4gF97kWeCO1s/GUlVKj9BNVAsalBHVEmLpSOVSF+eoFVUJX9TUyxii37DZXgpXkyYOWxXY0ild3NzgDhDZxZJTjt3O1CDQkGEfWs7j01dnVpuWCiYLDAxODBGljFpRkYfdTxZUlRzb2GIPXFDdVYvaI53cWNZamg2HUI9RGandqpPfUpZhE5ZjT5nO1fCRkQ5fmB9kGl/PVtBG0xbIkJEPW4kW1hMUFKBtR+lVkWflXBVKoFWRx16pojZdZomWUWIKmlRXEalhH2DjTk8eBFEQDtjR2yQMWSOfGA8i1NGpHJ4XB2uKy8qMCU8qzpsT0oeZURsQ010e1yUJWZAY1M1VXJlhU5fZkw3FlA0PF++f6dMglVedlFLgD5hQFbGN0UvemB3gGNxOWpEF0hUIUFCO28hXVdIT1CCtB6pVEihlHBVKYFaSRx2pobYdZUlWEKNKWpPYUSngXl+izs8dxBDQThjRW2PM16MeVs2jFJHonFzXB+sJi4rLyU8pzlqTUgcbEFlRE12e1yQJmRBZU4zV3Rng1BcZkw3FU83Plu7ealIf1JgeFRJgzhfPlLIM0Qve119hWRzNWZCFkZU"},{"ep":5,"loss":0.09128,"b":"FSEiGjAYPignLihmeRFtLlmBiD41GlAyNhdAZpPMjoQ3PSl4Hjs5ZVqRa3l5URwlOgouRyNcRlF6Nx5eTT8rcChRhk1SPhN1ExgsMh5VeDpONSkMVR0ySzR+dE5jKkcnUi0aTX+ehm0/Rj0eDSEmM2+zhYkzVCo0YC02YTdoRDOnJyMeVjtVaz5VIzgiDCczGCYqHywjQysuLSxocBVhMlZ9ikI2HU0wPSNFZZPHiI43QDV2JUE+ZVmNeH+HVB4lPw4xUiZkSEl/OCBoU1E2cyZQi0hVQBV6Gh4uNyFPeDxQQzANVCM7WTp7cU9pLlAqUjQeU4OXjHVBRkAdDyIlOnS2iYxBWjIyYys6W0VyRUGXNSQiU0VQaEFQLzwnEC4+FB0dGiwVPyQiNiJogRJuLFeBiDAyF1gxLBI/YJDJkHE6RSJqHDY7UmqRYXlpVRgpMwgwPiZXRVRuOCFhUDooZjBThU9eOxByFBQoNx5ehDZRJyIQQhsvOSyDd09hJ0ojUC8XTIWneV9BRzocDh0iKXarjIMuUikzYDA5Yz9nSDG3JSQeWzZSZj5YITkfCiQpFB4eGy4VPyUkNiRoghJvLVaChzMzGFgxLRJBY5HKkXY5RCNqHDY7U2iQY3ptVxkpNQgwPiZWR1ZwNyJiUDopZzBRhVFePBB1FBUpNh5dhDhRKSQQQxwxOi2DeVBjJkgjTy8YS4GlfF9CRjkcDh8iKnWujIMvUyo0XzA5Yz5oSDK1JSUeWzdTZT5XITogCiUrEh8fHD4SNSwpMipjjg97NEuCgkQ1HFoxKg1Ldp3ZmJM3PSFnGDQ3VWCQaYN/XRolPgcsNSVNUGl9LS9fTzYrajNFhmJhPA+CFBUmLRhWjkBTLSYPQx47Ni19fk1sHT8jSS4bP2qXilZFRzQhDCcfKHK+kYEsWCs2VjA0XjljSS+3HyYbWThPXzlSHkIiCiUpEiAfG0QQMy8qMSxhkQ6CNUuDf0s3HVozKgxLfKDcm5o3OiBrFjQ0W1yQaYOBXBwkQQcrMyRKU2+BKzFaTTIpbDREhGddPQ+CEhUnKhdWjUJSLiYOSR47Ni57gExrHTokSSwcPGOUjVVGRzUjDCsgKHDAkIEqWCo5VDEyYDJfSSy4GycaWTdRYThTHEEjCiUq"},{"ep":8,"loss":0.06753,"b":"DRMUDxUXKxUTFxQ2Nws3Il12dz0oFyYbIRQoWJe5sZBeNBtJEyUoc2J7fHKBMBITHQkoVR9WU1B4PAwxKCUrSBVac0RHNA83CxA5PBlga0dAMxcHNBAfWTF1e01ALykXLRcSUXunkn44JiIOCRAYNnqnkWslKBYbNxccOUNqVC1dFxISKx8xQScwGRkSCRYgERkdFRQnMhgbGBg9NRAtKFJyfT4oGSgbKCUzWJm2pZ1VOCtGGywzamR4jIGXOBQVJA8uZyZgUkSBPQ9HMj1DUBVPfT9VORBHFBg8ShxRbUdJSSAILxgsbDdudE9PMzgZLiAXXYOZmog/JyQOChEWQIWxnXE8MyEaPRciNGB8V0ZPKxMWLCsuPSwsKiEXDR0tCg4ODhYPIRIQGhAzRAk5I1F0dDIlFysXFAksXJvEvYdjOBEyDRonUXR8cnl1NAwTGAUlOCFIW2FtMRAwJhsnOxtVdlZZLQk5CgssORVtiUpEIBAJHQ0eNCN+h05BHyMRJRYPP26uils7IxoNCA4QI4GpnlocJxMYLhcbNU1mXCZ3EREOLBgnMiAtExsPBhETCg4ODhYOIBIQGxAzRQk6JFF1dDMlFywXFAktXZzFvYljOBEyDRknUXN8cnp2NQwUGAUlOCFHXGNuMREwJxsoOxxUdlhaLQk6CgssOBRsiktEIBAJHQ0fMyN+iE5CHyMRJRYPPmyui1s7JBoNCA4QI4GqnlkcJxMYLhcbNU1mXCZ3EREOLBknMiAtExwPBhETCQ8PDh0NHRUTGhMzTghDKU12cUEoGy0YFAczbabRwKBhNRE0DBklVmp6dYKHOQ0THAUjMR9AYnJ7KhUuJxopPh1LdWZbLQlBCgsqMBJmj1RGIhIIIA4kMiN4i05IGh8RJBYRN1yllVc9JRoPBxIQI3+3n1kbKxQaLBcaNUZjWiN6DxINLRonMR4tEh8QBhITCREQDicLGhoXGRgyVwhPL0x3b1UsIC8ZFQY4frDawbZhMBE7CxojX194d4iWPA8SIgUiLR47aIKIJhorJxkqRB9Fc3VZLglICgwrKBBhkF5GJRQIJhApMyVxjk1NGBwTJRYUMU2boFY+JxwTBxcRI3vAnlsZLxQdKhkZNz1eWCB8DRQNLhwpNB4uECITBhMV"},{"ep":12,"loss":0.05532,"b":"DBASDAwdKBANDQ8hFwkeHGB4fT4lFBQTHxweTI6utI1jLBw6ESInlGF+fmmDJxEMFAwvfCNiRTd9UgUeGB8xTA5eaCs/QxMcCA9NThxUSzdESxQFMQwdhkRrZEZBSR4THw8TbpaciptBHBoIBwoWSHiljnsrGBASJg4TKjVlUDUkFAsPGBYlMiEjGQ4OChIgDxYeFAw2LhMYEBMqGxEWI0RugDcfFBkSIjIwUZy1p6dOMjEtGyc7eXV3lZCpNREOHBY+lDRkRTCQTgtBKEVsWQ9AcSlsTw42FxxVcx48VTRidCAGHhk+mUFZV0xpRzQTHx0dhJ2BjqBaHhkJCQwQVJe+soNZJyARLQ4aImyHX2IhMw0SHCYdJyYcNhsUDxotBQgHCA0MFAsJDwkZIgUgIk11djEjFhcMCgUqW5LDyntwOQoYBw4iSXGEc3FmLAcKDAMhLSBMYV9gLAoXEw4gLBVeflVUKQYbBgYlMhJ3lkVAGQkGDgcZKCKKjEo8GRIJEgwMN2mwhk05FQ0HBQgJHnelmVAUEwoNFwwPIUVhWiI+CAkIFgwUGhMbDg8IAwkJBQgHCA4MFAsJDwkZIwUhI012djEjFhcMCgUrXZLEy3txOQoXBw0iR3CEcnJmLQcKDAMhLCBLYmFgKwoXEw0gLBVdf1hUKQYcBgYlMRF3mEZAGQkGDgcaJyGLjko8GBEJEgwMNmiwh0s5FQ0HBQgJHXemmU4UFAoNFgwPIUZhWiE/CAkIFgwUGRMbDQ8IAwkJBgkJCRYKEQ8MDw0aLQUtME95dE0sHxoOCwQ4e6bVzaV1OAsdBw8iUV58dH+FNAkKEgMfIxw/aH14Iw8XFQ4iMBZNfXRXKAYkBgcjJA5qnltCGwsFEwkgJiKAlk5CExALEw0PK0+kmkk4Fw8KBAwKHnO4lk0SGAsQFg4PJD9fVB5FBwsIGA8WHBMdDRMKBAsLBgwMCioJDxkTDxUdPwRFRlR/c348MR8RDQNLpL3lztB7NQ0oBxEgYUZwdY+sPg0LHQQcGxgyb6KZGxgWFw8jNxg8eppYJgcyBgkiFwtao3tEHw8FHgwrJiRxoVNKDg4OFg4VITSUskk2HBMRBBcMIG3LkEsQIQ0VFxAPKTVcSxlNBg4IGxMaIRQhCxoPBQ4O"},{"ep":20,"loss":0.04071,"b":"Cg0QCQgbJAwKCAwWCwgPDlJ6ejkVCgwOGhoPPp69t6NQGRkrDx0mv4R3cXOZIw8IEA1JtjRTLSGYdgQWERtMdw5DOxFVbhYSBw93gCMxHR1pdhMDKAstv1g6MEBtcxgPFgsaobh/d8RyHxQGBgcTT4+7t6s+EQwMGwkOHiRXWz0OEAgMDhIaJBkaGAsLCg8dCxAUDggiIA4RCg0bDgwLETZvcysPCQ8MFhsYS7HNubo9Gh4cEhs7pqJwgaa2LQwJFBJlwUlGLCauaQgsGzKUhhAnOxOWfw0iEReEpx0hIhyWkxgFExRhxUIqJkyiZyQNFBQstblgc8KZIxEGBggNW7XT17JpHBYLHQkSF0pyc1wQIAkMERoSGRkUJxQOCxIeAwMDBAgKDgUECAQLDgMRFkVwcSEaDgsGBAIgPXK0xlFgNQUJAwYaMWmeg1U8IgQFBQIUFh5oeks5HQUJCAUOHRSCkUQ4GwMKAwMUGxOYpTcqCwQDBQMPEh+hmT4qDQcECAUHH1e5ijwpDQYDAwMFE2CUlkUKCAQGCgYIGEJhYyEdAwQECgUJDAwUCwgEAgQDAwMDBAgKDgUECAQLDwMSF0VwcSEaDgsGBAIgPnK0xlFgNgUJAwYaL2mehFY8IwQFBQIUFR5oe005HAUJCAUOHRSCkkY4GgMKAwMTGxOZpzgqCgQDBQMPER+imz4pDAcECAUHHlW5ijsoDQYDAwMFE2CUlkQKCAQGCQYIGENiYyAdAwQECgUJDAwUCwgEAgQDAwYHBxYKDA0KCQoOHQMtQ2B9eF5ALREJBgJPla/XzbeMSwoSBAkiQUB0dYCTPQgGDQISCxI7bp18FQsLDAgPGxJIkZxKEwQWBAUSCwtruX4tCwcDDQYWDh2QuVcpBwcHCwcMEzexrzodDwoIAwoHGme1fDIIDwcLDAgKIk5rRxcmAwcFDgkNEhAYCw4HAwcHBAkJCCIJDBQPCQ8QJwNEZnGEe4hdShULCAJuvMbiz9ihVw0ZBAsmSy9hbZK6TQsGFAMRCA0rab+fExAMDQkPGRE0kMFSEQUfBAYRBwlXwaMuCwoDFAkZDR2IxmMoBQcJDQkPDiyvvjoYEAwMAhAIHWjCbSsHFAgODQoLKlFvOhQqAwkFEAwQFhMcChIKBAkJ"},{"ep":35,"loss":0.0325,"b":"BQcIBQkQFgkGBQcLBwQLC1iJhlMSCAcIDQsISr7VzshoEw4ZBw8bxo5hUXS5LAoECQdAujQpGh+1hgMJCQxBiREhHg5mfxQJAwhpiCAZDhp5fQwCGAYnw14fHkKGcAsJDAYUnLqAd8aJJAsEAwUNOZDFx7s6CwYIDgYIFBVHVDAKBgUHCAkPFg8UDwcGBQgNBQgIBgcREQgHBgcNCAUGCDFubSgHBAgHCQkIScXf08g/DgwOBwwwvL1wcKzAKwcFCglt2VEiFyHGdwYSDRaYrRYSFgywoQoQBw2PxhgOCxWzog4DCgpp2TwREFPHeREHCgkryLtUbc3DLwgDBAUKTbja6NBuEAkGDgUJDShmfU4LCwUGCQsKDQwQGAwHBAgLAQICAwgSEQMCBAIEBgIKDTRvciMQCAUDAgISHVGrrzg9IwMEAgMMGFa3nzogFQICAgEGDCSXoTMZEQMEBAIEERiqsC8WDwIEAgEHDxm4tiYQBgICAgEGCCW0qicVBwMCAwIDDT+zli4YCQIBAgIDDkSUlkAJBAIDBAMFEjhpbTEPAgICBAIEBgkSEQYCAQIBAQICAwgSEQMCBAIEBgIKDTRuciMRCAUDAgITHlGrrzc9IwMDAQMMGFa3nzsfFQICAgEGCyOXojQYEAMEBAIEERiqsTAWDgIEAgEHDhm4uCYQBgICAgEGByS2qygUBwMCAwIDDT6zly0XCAIBAgIDDkSUlj8JBAIDBAMFEjlqbTEPAQICBAIEBgkSEQYCAQIBAgQFBhEPDQoHBgYHDgIvVnCBe2RSOQwFBANprsLVzsekYwwJAgYqOzhkbpGpQgYDBwMNBAsrYreEEAYGBgUJCQsyn71GBwMLAwQLAwhizZQgBAQCBgQNBRqfzVwVAgQEBgUJDD+/rTMLBwUEAgUFIXa0Zx0ECAQGBgUIK2xxNhUSAgQDBwUIDRQWDAkEAgQEAgQGBxQODQwJBwcIEAJBdIWIgX1wUw0FBAODxs7Y0de7eA8LAgcvQi5VYpe9TQcECQMMAggiXcuWEAcGBwYIBwoqotNGBQMMAwULAgdd1a0eAwQCCQUMBBqm2GQQAgQFBgUJCT3HszEIBgYFAgcFI3e0UxYDCAQHBwUJNXFtKxATAgUDCAYJDxgYCwkFAwUF"},{"ep":60,"loss":0.02704,"b":"AwQEAwcJDQYDAwQGBAIIDmGip3gWDAUFBgYGU8/g4+KTGgsMAwcQsX09MWDTQwcCBQMusSMODxbEmQIEBAYyhw4MEQtwihEEAgRJiB0MCRl/gwoBDAMYvF8ZFkWSWAYFBgMKf8GRd8KLHgUCAgMII4TEyrcrBgMEBwMFDRA0RSEHAwMEBAQJDQgMCAQDAwQGAwMDAwUICAQDAwMGBQMDBB5aWRgDAgUDAwMGQ8Pk5scxCgUFAwUuwsuIjcLAJgQDBQZi4EUODybTXQYIBg2VuRIHDAy8ngUIAwmJyg4GBhi1owkCAwZr3CUKDFTRYwgDBAUqyK1Qc8TOMAMCAgMHUbri7tJuCgQDBgMFByp9iUQKBAIDBQUEBggNEgkDAgQEAgICAgsbGgYCBAIEBQIJCTJteCUNBQYCAQMKDkirkzQnEwQDAgMEDEy9njAXEgICAgECCTC9tCAKDwMCBAICESLNtRwIDQQCAgEDDSLNthoFBwICAgEDBjCvpRsLDAMCAwMCBzWqkCoWCwQCAgICCkaYnkYOBAECAwIHFC9pcj8OAgICAwIDBgkbGwoCAgIBAQEBAgsWFAMBAwECAwEHCSdwdSoKBQMBAQIMDzyztTUpEwMCAQIEDUm+rDUVDwEBAQEBCBymuTALDAICAgEBDBKuxicHCwICAQECCRa7vyEFBwIBAQECBB/Hsh4JBQIBAgECBTa2nycOBgEBAQECDDSkjToMAgECAgIEDTFvazEKAQEBAgEDBAcSFwgBAQEBAQIDBQsNCgYFBAMEBgIlSV53d1E8KQgCAgRvssTW3MigWgoDAgMtPD1le62nNAMCAwMLAwUWXcWECwQEAwUJBAUbp8dGBAEFAgQKAgRU05McAgIBAgMLAxCly10SAQMCAwMJDEfFqjIGAwICAQIEJoPCaBUDBAIDAwIHJnx4MA0JAgICAwMECBMSCgcCAgICAgIEBg4NCwgGBQMEBgJJhYySkYiBXgoDAgWY0tPV3NzQjBEFAgQrOCNCVZzASQUCBAMJAQIRXNWNDAMDAwQFAgMaueA7AgIFAgQHAQRk5LAWAQIBBAMHARXA4GQKAAIDAwMGBkjYsSwDAgMDAQMEH3i0QQsBAwIDAwMIOntgHQgIAgICBAMGDRkSBwUCAgIC"},{"ep":100,"loss":0.0173,"b":"AQEBAQMDBAIBAQEDAgECCmC1w3ILBwMCAgIDWefn7u2TFAYEAQIKmHMkG1rmSQMBAgEovhwEBgrWlwICAgNEogsDBQWWmgYCAQJFqw4EAg+jiQcBBAEWzEkOCEm8SAMCAwEFesKffs2mEQIBAQECEZfj4rAfBAECAwECAww7OhUEAQEBAgIDBAIFAwIBAQECAQEBAQIDAgEBAQEDAgEBARhYWAwBAAIBAQEERNfk8MUcBAICAQIu1c+QltTLGQIBAgNd6jUFByTjRwMEAgegyQkBAwnKjQIEAQWezQQCAhLHlQUBAQNs5hgFB1TbUgMBAgIf1aZbgNLTGQEBAQEESc7x88xTBgIBAgECAyWTdCwHAgEBAgICAwQKCAQBAQEBAwMDAg8YFQoFBAQFCAMKCC1MUysMBAQCAgYICE6vcjUnBwMFBAMCCHzLgzoUDAIDBAEBB1ncohoDDwUCBgMBE0byrgYCDAYCBAEBC1v0kAUBDQUCAwEBBWrsUwQFFAcEBQQCB3nWPgkSFAcEAgMDGXetQiQXCQICBgINHFBnVScUAwMDBAQDCQcfIRMFBAQCAAABAQUJBwEBAQABAQEDBBVajysEAgEBAQEICji/1kggBgEBAAACCUTAt0EaCQABAQAABQyfuyUHCAEBAQAACQepyhcCBQABAAABBQvDtQ4CBQEAAQAAAxTdoQ0EAgEBAQAAAjvilBMHAwAAAAABBz3dfRUGAQEBAQECBTONQg4FAQABAQEBAgMLDQYBAAAAAQIDBAkLBwUFBAQDBQMoOC0+ZVo0IAQCAgaLuKrS6d2/TgcDAgM4bVNuqNq0JwICAwMKAgIKatyNCgMEAwYJAgIZucYwAwEEAwMIAQVk24QOAgIBAgMKBBXOuikLAQQEAwMKDnLigA0EAgIDAQIFNqrgLgcCBAMCBAIKKa+NIgQIAgICAgQDCxYWCAUDAgIBAQIDBQgJBwcIBQMDBQJZkpWIl5eNVwkBAgat3t7P2uXghw4EAgMoLiEzPa3JOwICAwMGAAELWtx9BwICAwUFAQIhwdopAQEDAgMEAAWa6X8MAAEBAwIFASDk2C8GAAIDAwMEBWvxjw4BAQMDAQIDIqnOIwMAAwICAwIMT59mDwIFAgICAwMEDxgSBAMCAgIC"},{"ep":160,"loss":0.01228,"b":"AQEBAAEDBAIBAQECAQEBB0260pQOBgMBAQEDZO7p8vewFQYCAQEHqWwUD1vuTAIBAQEuzBYCAgrboAIBAQJSvg0BAQSguQYCAQFEzxQCAQmuogYBAgES3lsLBDrNTgIBAgECf9yxec60DQEBAQEBC5zv4qQVAwEBAgEBAQ85LwsDAQEBAQECAgEDAgEBAQEBAQEAAAEBAgEAAAECAQEAAAxMTgcAAAEBAQEDO9/p8bYLAQEBAQEr49GVqtelCgEBAQJq8DQGAybdKAECAQS30ggBAQfScwECAQO10QQCAQzdggIBAQJ+6xMEBFDnOgEBAQEd3aBfkeTVDAEAAQEDO77499Q7BAEBAQEBAiSbex4GAQABAQEBAgMKBwIBAAEBAQICAwwXJgwEAwIDAwIGBR9idDwIAgIBAgQDBTKQhzYUAgEDAgIBA2m1ejULBAEBAgAACVTYwRgBBwUCAwEAGVTzyQIBDAcCAgABDnX5kAEAEwcBAgEBBJn6OQEDGAQCAwEBBq3tIwIPEwMCAQICG62tHw4UBwECAwEKGldSKxANAgECAgIDBgQODAgCAgIBAAAAAAMJEAIBAAABAQECAghPqzwDAQAAAAEFBhqY41cTAgABAAABBDaqykUSBAAAAAAABQqg2SsDBAEBAAAACgjD3AwBBAEBAAAABg/lxgQABAIAAAAAAh7ypAMCAgEAAQAAAT/zgAMFAwAAAAAAA1DpXQYEAQABAQACA0OUKQUEAQAAAQABAgMLBwMAAAAAAQIDBAQHCQUEAwICAwMZFxguUzcTCQMBAgaMvKq86+W9LAQCAgNNf2h4xPHOIAICAgMHAwEFb/GRCgIDAgUIAwENsNknAwEDAgMIAgNu1GgGAwIBAQIJBxfdtRAEAQICAgIGGY7rYQIDAgECAQEEVezhHgICAwICAwINTtajEwIFAgEBAgMFDycZBQMCAgEBAQEDBggLDAkIBQICAwN6tLassK+jWAgBAge35OLK1ujpbwsDAgIjHBEcJKnCIgIBAgIEAAAHWeRZBQECAgMDAAIiyNcUAQECAgICAAay7WIDAAEBAgICASv22xUCAAECAgICBI36hgIAAAICAQICHdLQDwAAAQECAgELUqlYBgACAgEBAgIFDxQMAgEBAQIB"},{"ep":250,"loss":0.01037,"b":"AQEBAAEDBQIBAQEBAQEBBE/J4a8SBQMBAQECZfHo8/rGFQUBAQEFtl4LCmPzTQIBAQEx1BEBAQvbrQMBAQFWzg0BAAOgyQcBAQBD3hkBAASusgUBAgAQ520LATbSXAIBAQECi+y2ctW5DAEBAQEACqvz458SAwEBAQEBAQ8vJgYCAQEBAQEBAQEBAQABAQEBAQEAAAABAQAAAAABAQEAAAY3PwUAAAABAQECOubq88oKAQEBAQEo7uKUr9uzBwEAAQF18zsFASzaKwEBAQO/3wkBAAjRdwECAQK/2gUCAAnjhAEBAQGH7xYEA0LrOgEBAQEd5K5fiuXXCgEAAQACOMH6+No0AwEBAQEBAiyiihoEAQABAQEBAQILCQIBAAEAAQECAgcWNxMDAgECAQICAhVznlcHAQEBAQMBAx+Ln0QNAQECAQEAAlGZYy0GAQABAQAACT3R0REBAwYBAQAAHVTyyQEADgkBAgAAFIr5cAAAFgkBAQAACLj8HgABGAMCAQEABMz1GQAOEAIBAQEADb+1EwUQBgECAQEGDkpDGgcIAQEBAQECAwIHBQMBAQEBAAAAAAEKHgIAAAABAAEBAQROv0wDAAAAAAEDAw2I6VkHAAAAAAAAAySWz0QGAQAAAAAAAwew5ykBAQEBAAAABwfd4AYAAgEBAQAABRLywAEAAgEAAAAAAiv5mwEBAQABAAAAAEX5fwECAgAAAAAAAVLwVQICAQABAAABAUKTIgIDAAAAAAABAQIMBQIAAAAAAQECAgMFBQMDAgEBAgMTDxYpQicLBAIBAQeWurPB6eC2FQMBAQNReWR/xfHKDAEBAQIFAgEGa/N4BAECAQMFAgEUsNkXAgECAgIFAgKV1lMCAgEBAQIFBRbuvAgBAQECAQIDFpbyWgECAQEBAQEDWPbnEwEBAgEBAQEMXNyqDgACAgEBAQIFECQbBAEBAgEBAQEDBgkRDgcHBQIBAQSUyM3EysSxWAcBAQm/5OPJ2ertTQYCAQIjGQgQGqO2DgEBAQMDAAAEWeJCAgEBAQMCAAEk1MwKAQEBAgIBAASx8lgBAAEBAQIBASv63g4AAAEBAQIBA6L8igEAAAICAQEBFOHUCQAAAQEBAQEHM5xFAwABAgEBAQEECQsGAQEBAgEB"}]};
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,big,clamp,rng,Plot,drag,slider,buttons,btn,player,out,legend,Svg,arrow,cap,pct,sig,nn,pick}=M;
const {IMGS,pic,rowDiv,cell,G,D}=M.pic,W=M.AEW,TC=[C.blue,C.orange,C.green],TN=['«0»','«1»','«7»'];
const X=IMGS.map(v=>Float64Array.from(v,x=>clamp(x,0,1)));
function unpack(o){const bin=atob(o.b),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const a=new Int16Array(u.buffer);let k=0;const Wm=[],b=[];
  for(let l=1;l<o.sizes.length;l++){const w=[];for(let j=0;j<o.sizes[l];j++){const r=new Float64Array(o.sizes[l-1]);for(let i=0;i<r.length;i++)r[i]=a[k++]/o.sc;w.push(r)}const bb=new Float64Array(o.sizes[l]);for(let j=0;j<bb.length;j++)bb[j]=a[k++]/o.sc;Wm.push(w);b.push(bb)}return {sizes:o.sizes,W:Wm,b}}
const NET={};const net=k=>NET[k]||(NET[k]=unpack(W[k]));
const lay=(n,l,z,last)=>n.W[l].map((row,j)=>{let s=n.b[l][j];for(let i=0;i<row.length;i++)s+=row[i]*z[i];return last?sig(s):Math.tanh(s)});
function run(n,x,from,to){let z=x;const L=n.W.length;for(let l=from||0;l<(to==null?L:to);l++)z=lay(n,l,z,l===L-1);return z}
const mse=(a,b)=>{let s=0;for(let k=0;k<D;k++)s+=(a[k]-b[k])**2;return s/D};
const TEST=Array.from({length:30},(_,i)=>150+i);
const big2=(host,v,px,lab)=>{const d=H('div',null,host);d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:.25rem;font-family:Figtree,sans-serif;font-size:.85rem;color:#ccc';pic(d,v,px);H('span',null,d,lab);return d};

FIG.aeidea=function(st){
  const ids=[150,151,152,153,154,155,160,163];let sel=0;const lab=H('div',{class:'ctl'},st);H('span',{class:'ctl-l'},lab,'Scegli un\'immagine');const row=rowDiv(lab,6),bs=ids.map((id,i)=>{const b=H('button',{type:'button','aria-label':'immagine '+(i+1),'aria-pressed':'false'},row);b.style.cssText='padding:3px;line-height:0';pic(b,X[id],40);b.addEventListener('click',()=>{sel=i;draw()});return b});
  const flow=H('div',null,st);flow.style.cssText='display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem;margin-top:.8rem';const res=out(st);res.style.minHeight='1.7em';
  function draw(){bs.forEach((b,i)=>b.setAttribute('aria-pressed',i===sel?'true':'false'));flow.textContent='';const n=net('ae8'),x=X[ids[sel]],z=run(n,x,0,1),xr=run(n,z,1);
    big2(flow,x,120,'input: 144 numeri');const ar=t=>{const d=H('div',null,flow,`<div style="font-family:Figtree,sans-serif;font-size:.8rem;color:#bbb;text-align:center">${t}<br><span style="font-size:1.3rem;color:#fff">→</span></div>`);return d};ar('encoder');
    const d=H('div',null,flow);d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:.25rem;font-family:Figtree,sans-serif;font-size:.85rem;color:#ccc';const sv=Svg(d,150,120,'Il codice: otto numeri');sv.style.width='150px';
    S('line',{x1:6,x2:144,y1:60,y2:60,stroke:'#666'},sv);z.forEach((v,k)=>S('rect',{x:10+k*17,y:v>0?60-v*52:60,width:12,height:Math.abs(v)*52,fill:C.yellow},sv));H('span',null,d,'codice: 8 numeri');ar('decoder');
    big2(flow,xr,120,'ricostruzione: 144 numeri');res.innerHTML=`Errore di ricostruzione (media dei quadrati delle differenze, pixel per pixel): <b>${nf(mse(x,xr),3)}</b>.`}
  draw();
};

FIG.aetrain=function(st){
  const SN=W.snaps.map(s=>{const bin=atob(s.b),ims=[];for(let i=0;i<6;i++){const v=new Float64Array(D);for(let k=0;k<D;k++)v[k]=bin.charCodeAt(i*D+k)/255;ims.push(v)}return {ep:s.ep,loss:s.loss,ims}}),ids=[0,3,1,4,2,5],n=SN.length;
  cap(st,'<b>sei immagini di training</b>');const r0=rowDiv(st,8);ids.forEach(i=>cell(r0,X[i],64));const c1=cap(st,''),r1=rowDiv(st,8),cvs=ids.map(()=>{const d=H('div',null,r1);return pic(d,X[0],64)});
  const p=Plot(st,{W:600,H:210,m:[48,10,14,42],xr:[0,n-1],yr:[0,0.23],label:'Errore di ricostruzione durante l\'allenamento'});p.axes(SN.map((s,i)=>i),[0,0.05,0.1,0.15,0.2],'epoche di allenamento (ogni epoca passa una volta su tutti i dati)',null,v=>SN[v].ep);
  const lc=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.4},p.g),dt=S('circle',{r:5.5,fill:C.pink,stroke:'#000'},p.g),PER=10;
  player(st,(n-1)*PER,8,pos=>{const k=Math.min(n-2,Math.floor(pos/PER)),fr=pos/PER-k,A=SN[k],B=SN[k+1],im=new ImageData(G,G);
    cvs.forEach((cv,i)=>{const c=cv.getContext('2d');for(let j=0;j<D;j++){const g=Math.round(255*(A.ims[i][j]+(B.ims[i][j]-A.ims[i][j])*fr));im.data[4*j]=g;im.data[4*j+1]=g;im.data[4*j+2]=g;im.data[4*j+3]=255}c.putImageData(im,0,0)});
    const l=A.loss+(B.loss-A.loss)*fr,pts=[];for(let i=0;i<=k;i++)pts.push([i,SN[i].loss]);pts.push([k+fr,l]);lc.setAttribute('d',p.poly(pts));dt.setAttribute('cx',p.sx(k+fr));dt.setAttribute('cy',p.sy(l));
    c1.innerHTML=`<b>le loro ricostruzioni dopo ${Math.round(A.ep+(B.ep-A.ep)*fr)} epoche</b> · errore ${nf(l,3)}`});
};

FIG.bottleneck=function(st){
  const ids=[150,151,152,153,154,155,160,163];cap(st,'<b>originali</b> (immagini mai viste in allenamento)');const r0=rowDiv(st,8);ids.forEach(i=>cell(r0,X[i],58));
  [['ae2s',2],['ae8',8],['ae32',32]].forEach(o=>{const n=net(o[0]),e=TEST.reduce((s,i)=>s+mse(X[i],run(n,X[i])),0)/TEST.length;cap(st,`<b>collo di bottiglia di ${o[1]} numeri</b> · errore medio ${nf(e,3)}`);const r=rowDiv(st,8);ids.forEach(i=>cell(r,run(n,X[i]),58))});
};

FIG.bce1=function(st){
  let x=0.7;slider(st,'Valore vero del pixel '+K('\\Xs'),0.02,0.98,0.01,x,v=>nf(v,2),v=>{x=v;draw()});legend(st,[[C.pink,'binary cross-entropy'],[C.lg,'errore quadratico']]);
  const p=Plot(st,{W:600,H:300,m:[40,10,12,42],xr:[0,1],yr:[0,2.4],label:'Le due loss per un pixel al variare del valore ricostruito'});p.axes([0,0.25,0.5,0.75,1],[0,1,2],'valore ricostruito x̃');
  const c1=S('path',{fill:'none',stroke:C.pink,'stroke-width':2.8},p.g),c2=S('path',{fill:'none',stroke:C.lg,'stroke-width':2},p.g),ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-dasharray':'5 4'},p.g),d1=S('circle',{r:6,fill:C.pink,stroke:'#000'},p.g),d2=S('circle',{r:5,fill:C.lg,stroke:'#000'},p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){const b=t=>-(x*Math.log(t)+(1-x)*Math.log(1-t));c1.setAttribute('d',p.curve(b,0.004,0.996,400));c2.setAttribute('d',p.curve(t=>(t-x)**2,0,1,200));ln.setAttribute('x1',p.sx(x));ln.setAttribute('x2',p.sx(x));d1.setAttribute('cx',p.sx(x));d1.setAttribute('cy',p.sy(b(x)));d2.setAttribute('cx',p.sx(x));d2.setAttribute('cy',p.sy(0));
    res.innerHTML=`Entrambe le curve hanno il minimo dove la ricostruzione è uguale al valore vero, ${K('\\tilde{\\Xs}='+kn(x,2))}.`}
  draw();
};

const BOOT=(function(){const v=new Float64Array(D),seg=(x,y,x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1,t=clamp(((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-x1-t*dx,y-y1-t*dy)};
  for(let y=0;y<G;y++)for(let x=0;x<G;x++){const d=Math.min(seg(x,y,3.2,1.5,3.2,8.5)-0.9,seg(x,y,3.2,8.6,9,8.6)-1.1,seg(x,y,5,6.6,8.6,7.6)-0.7);v[y*G+x]=clamp(1.2-d/0.8,0,1)}return v})();
FIG.anomaly=function(st){
  const n=net('ae8'),R=TEST.map(i=>({i,e:mse(X[i],run(n,X[i])),x:X[i]}));R.push({i:-1,e:mse(BOOT,run(n,BOOT)),x:BOOT});R.sort((a,b)=>a.e-b.e);const an=R.find(r=>r.i<0),worst=R.filter(r=>r.i>=0).pop();
  const p=Plot(st,{W:600,H:250,m:[48,10,12,42],xr:[0.3,R.length+0.7],yr:[0,Math.max(an.e*1.1,0.05)],label:'Errore di ricostruzione di trentuno immagini, in ordine crescente'});p.axes(null,[0,0.05,0.1,0.15,0.2,0.25].filter(v=>v<=p.yr[1]),'31 immagini di test, ordinate per errore di ricostruzione','errore di ricostruzione');
  R.forEach((r,k)=>S('rect',{x:p.sx(k+1)-6.5,y:p.sy(r.e),width:13,height:p.sy(0)-p.sy(r.e),fill:r.i<0?C.red:C.lg},p.g));
  const row=rowDiv(st,14);cell(row,worst.x,84,0,'la cifra peggiore');cell(row,run(n,worst.x),84,0,'ricostruita · errore '+nf(worst.e,3));H('div',null,row).style.width='18px';cell(row,an.x,84,0,'la scarpa');cell(row,run(n,an.x),84,0,'ricostruita · errore '+nf(an.e,3));
  const res=out(st);res.style.minHeight='1.7em';res.innerHTML=`La barra rossa è la scarpa: il suo errore è ${nf(an.e/worst.e,1)} volte quello della cifra ricostruita peggio.`;
};

FIG.denoise=function(st){
  let seed=1;btn(st,'Altre immagini',()=>{seed++;draw()});const n=net('dae'),box=H('div',null,st);
  function draw(){box.textContent='';const r=rng(seed*19+3),ids=[];while(ids.length<7){const i=150+Math.floor(r()*30);if(!ids.includes(i))ids.push(i)}const noisy=ids.map(i=>X[i].map(v=>clamp(v+0.3*r.n(),0,1)));
    cap(box,'<b>immagini sporcate con rumore</b>: quello che entra nella rete');const r0=rowDiv(box,8);noisy.forEach(v=>cell(r0,v,62));cap(box,'<b>quello che esce</b>');const r1=rowDiv(box,8);noisy.forEach(v=>cell(r1,run(n,v),62));cap(box,'<b>le immagini pulite</b>, che la rete non ha mai visto');const r2=rowDiv(box,8);ids.forEach(i=>cell(r2,X[i],62))}
  draw();
};

/* ---------- spazio latente: autoencoder e VAE ---------- */
FIG.vaelatent=function(st){
  legend(st,TN.map((t,k)=>[TC[k],'immagini di '+t,'dot']));const duo=H('div',{class:'duo'},st);
  const mk=(title,R,codes,dec,start,extra)=>{const d=H('div',null,duo),p=Plot(d,{W:420,H:412,m:[36,10,10,42],xr:[-R,R],yr:[-R,R],label:title});p.axes([-Math.floor(R),0,Math.floor(R)],[-Math.floor(R),0,Math.floor(R)],'primo numero del codice','secondo numero');
    S('line',{x1:p.sx(0),x2:p.sx(0),y1:p.ay,y2:p.ay+p.ah,stroke:'#333'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#333'},p.bg);if(extra)extra(p);
    codes.forEach((c,i)=>S('circle',{cx:p.sx(c[0]),cy:p.sy(c[1]),r:3.4,fill:TC[i%3],opacity:.85},p.g));const cur=S('circle',{r:9,fill:'#fff',stroke:'#000','stroke-width':2,style:'cursor:grab'},p.g);let z=start;
    const row=rowDiv(d,10),holder=H('div',null,row),c=cap(d,'');const draw=()=>{cur.setAttribute('cx',p.sx(z[0]));cur.setAttribute('cy',p.sy(z[1]));holder.textContent='';pic(holder,dec(z),96);c.innerHTML=`<b>${title}</b><br>il punto bianco (${nf(z[0],2)}; ${nf(z[1],2)}) decodificato`};
    drag(p,p.svg,(x,y)=>{z=[clamp(x,-R*0.97,R*0.97),clamp(y,-R*0.97,R*0.97)];draw()});draw()};
  const a=net('ae2'),ve=net('venc'),vd=net('vdec');
  mk('Autoencoder',1.1,X.map(x=>run(a,x,0,2)),z=>run(a,z,2),[-0.6,-0.62]);
  mk('VAE',3.2,X.map(x=>{const o=ve.W[1].map((row,j)=>{const h=lay(ve,0,x,false);let s=ve.b[1][j];for(let i=0;i<row.length;i++)s+=row[i]*h[i];return s});return [o[0],o[1]]}),z=>run(vd,z),[0.3,-0.4],p=>{[1,2].forEach(r=>S('circle',{cx:p.sx(0),cy:p.sy(0),r:p.sx(r)-p.sx(0),fill:'none',stroke:'#777','stroke-dasharray':'4 4'},p.bg))});
};

const gs=(x,m,s)=>Math.exp(-0.5*((x-m)/s)**2)/(s*2.5066);
FIG.kl=function(st){
  let mu=1.5,sd=0.6;slider(st,'Media '+K('\\mu'),-3,3,0.05,mu,v=>nf(v,2),v=>{mu=v;draw()});slider(st,'Deviazione standard '+K('\\sigma'),0.2,2.5,0.05,sd,v=>nf(v,2),v=>{sd=v;draw()});
  legend(st,[[C.yellow,'distribuzione prodotta dall\'encoder'],['#fff','gaussiana standard N(0, 1)']]);
  const p=Plot(st,{W:600,H:270,m:[14,10,14,42],xr:[-5,5],yr:[0,2.1],label:'La distribuzione dell\'encoder e la gaussiana standard'});p.axes([-4,-2,0,2,4],null,'valore del codice z');
  S('path',{d:p.curve(x=>gs(x,0,1),-5,5,300),fill:'none',stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'5 4'},p.g);const c=S('path',{fill:'rgba(255,255,0,.12)',stroke:C.yellow,'stroke-width':2.6},p.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){c.setAttribute('d',p.curve(x=>gs(x,mu,sd),-5,5,500)+`L${p.sx(5)} ${p.sy(0)}L${p.sx(-5)} ${p.sy(0)}Z`);const kl=0.5*(mu*mu+sd*sd-1-Math.log(sd*sd));res.innerHTML=`Divergenza KL: <b>${nf(kl,2)}</b>. Vale zero solo quando le due curve coincidono (${K('\\mu=0')}, ${K('\\sigma=1')}).`}
  draw();
};

FIG.reparam=function(st){
  let mu=5,sd=2,eps=0.3,k=0;const E=[0.3,-1.1,0.8,-0.4,1.6,-1.9,0.1];
  slider(st,'Media '+K('\\mu')+' prodotta dall\'encoder',0,8,0.1,mu,v=>nf(v,1),v=>{mu=v;draw()});slider(st,'Deviazione standard '+K('\\sigma')+' prodotta dall\'encoder',0.3,3,0.1,sd,v=>nf(v,1),v=>{sd=v;draw()});btn(st,'Nuovo rumore ε',()=>{k=(k+1)%E.length;eps=E[k];draw()});
  const mkp=(H2,lab,xl)=>{const p=Plot(st,{W:600,H:H2,m:[14,10,14,42],xr:[-4,12],yr:[0,0.46],label:lab});p.axes([-4,-2,0,2,4,6,8,10,12],null,xl);return p};
  const p=mkp(150,'Il rumore standard','rumore ε, estratto da N(0, 1)'),q=mkp(170,'Il codice ottenuto','codice z = μ + σ · ε');
  S('path',{d:p.curve(x=>gs(x,0,1),-4,12,500),fill:'rgba(202,163,232,.14)',stroke:C.purple,'stroke-width':2},p.g);const c=S('path',{fill:'rgba(255,255,0,.10)',stroke:C.yellow,'stroke-width':2.2},q.g),d1=S('circle',{r:7,fill:C.purple,stroke:'#000'},p.g),d2=S('circle',{r:7,fill:C.yellow,stroke:'#000'},q.g),l1=S('line',{stroke:C.purple,'stroke-dasharray':'3 3'},p.g),l2=S('line',{stroke:C.yellow,'stroke-dasharray':'3 3'},q.g),res=out(st);res.style.minHeight='1.7em';
  function draw(){const z=mu+sd*eps;c.setAttribute('d',q.curve(x=>gs(x,mu,sd),-4,12,500));d1.setAttribute('cx',p.sx(eps));d1.setAttribute('cy',p.sy(0));d2.setAttribute('cx',q.sx(z));d2.setAttribute('cy',q.sy(0));
    [[l1,p,eps,gs(eps,0,1)],[l2,q,z,gs(z,mu,sd)]].forEach(a=>{a[0].setAttribute('x1',a[1].sx(a[2]));a[0].setAttribute('x2',a[1].sx(a[2]));a[0].setAttribute('y1',a[1].sy(0));a[0].setAttribute('y2',a[1].sy(a[3]))});
    res.innerHTML=`${K('\\Eps='+kn(eps,1))}, quindi ${K('z='+kn(mu,1)+'+'+kn(sd,1)+'\\cdot('+kn(eps,1)+')=')} <b>${nf(z,2)}</b>.`}
  draw();
};

FIG.manifold=function(st){
  const vd=net('vdec'),n=9,wrap=H('div',null,st);wrap.style.cssText='display:grid;grid-template-columns:repeat(9,auto);gap:2px;justify-content:center;line-height:0';
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const z=[-2+4*i/(n-1),2-4*j/(n-1)],d=H('div',null,wrap);pic(d,run(vd,z),40).style.border='0'}
  cap(st,'da sinistra a destra il primo numero del codice va da −2 a 2; dal basso verso l\'alto, il secondo');
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,clamp,rng,Plot,slider,btn,player,out,legend,cap}=M;
const AC=[C.blue,C.orange,C.green],AN=['A','B','C'];
const ez=t=>t*t*(3-2*t);
const Phi=x=>{const t=1/(1+0.2316419*Math.abs(x)),d=0.3989423*Math.exp(-x*x/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p};

/* ---------- tre macchine da provare ---------- */
FIG.slots=function(st){
  let seed=3,G;const N=30;
  const row=H('div',null,st);row.style.cssText='display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center;width:100%';
  const res=out(st);res.style.minHeight='3.4em';btn(st,'Ricomincia con tre macchine nuove',()=>{seed++;start()});
  function start(){const r=rng(seed*77+5),P=[0.35,0.55,0.75];for(let i=2;i>0;i--){const j=Math.floor(r()*(i+1));const t=P[i];P[i]=P[j];P[j]=t}G={r,P,n:[0,0,0],w:[0,0,0],h:[[],[],[]],t:0,reg:0};draw()}
  function draw(){row.textContent='';const end=G.t>=N,best=Math.max(...G.P);
    AN.forEach((nm,a)=>{const c=H('div',null,row);c.style.cssText='flex:1 1 150px;max-width:200px;border:1px solid #444;border-radius:10px;padding:.6rem;text-align:center;font-family:Figtree,sans-serif;color:#ddd;font-size:.92rem;line-height:1.5';
      H('div',null,c,`<b style="color:${AC[a]};font-size:1.05rem">Macchina ${nm}</b>`);
      const b=H('button',{type:'button'},c,'Tira la leva');b.style.margin='.45rem 0';b.disabled=end;
      b.addEventListener('click',()=>{const win=G.r()<G.P[a]?1:0;G.n[a]++;G.w[a]+=win;G.h[a].push(win);G.t++;G.reg+=best-G.P[a];draw()});
      const d=H('div',null,c);d.style.cssText='display:flex;flex-wrap:wrap;gap:3px;justify-content:center;min-height:30px;margin:.2rem 0';
      G.h[a].forEach(v=>{const i=H('i',null,d);i.style.cssText=`width:10px;height:10px;border-radius:50%;background:${v?C.green:'#555'}`});
      H('div',null,c,G.n[a]?`${G.w[a]} vincite su ${G.n[a]}<br>media osservata <b style="color:#fff">${nf(G.w[a]/G.n[a],2)}</b>`:'mai provata<br>&nbsp;');
      if(end)H('div',null,c,`probabilità vera <b style="color:${C.yellow}">${nf(G.P[a],2)}</b>`)});
    const tot=G.w[0]+G.w[1]+G.w[2];
    res.innerHTML=end?`Hai vinto <b>${tot}</b> volte su ${N}. Giocando sempre la macchina migliore ne avresti vinte in media ${nf(N*best,1)}; con le tue scelte il valore atteso era ${nf(N*best-G.reg,1)}. La differenza, <b>${nf(G.reg,1)}</b>, è il tuo regret.`
      :`Hai ${N-G.t} tiri. Ogni pallino verde è una vincita. Vincite finora: <b>${tot}</b>.`}
  start();
};

/* ---------- follow the leader si blocca ---------- */
FIG.ftl=function(st){
  let seed=2;const T=60,R=20;btn(st,'Altre venti partite',()=>{seed++;draw()});
  legend(st,[[C.yellow,'follow the leader, venti partite'],[C.blue,'esplorazione uniforme']]);
  const p=Plot(st,{W:600,H:300,m:[44,10,14,42],xr:[0,T],yr:[0,16],label:'Regret di follow the leader in venti partite'});p.axes([0,10,20,30,40,50,60],[0,5,10,15],'round','regret accumulato');
  S('path',{d:p.poly([[0,0],[T,T/8]]),fill:'none',stroke:C.blue,'stroke-width':2.4,'stroke-dasharray':'6 4'},p.g);const g=S('g',null,p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';const r=rng(seed*131+7);let stuck=0;
    for(let k=0;k<R;k++){let n1=0,s1=0,reg=0;const pts=[[0,0]];
      for(let t=1;t<=T;t++){let a;if(t===1)a=1;else if(t===2)a=2;else a=(s1/n1>=0.25)?1:2;if(a===1){n1++;s1+=r()<0.5?1:0}else reg+=0.25;pts.push([t,reg+ (k-R/2)*0.05])}
      if(reg>T/8)stuck++;S('path',{d:p.poly(pts),fill:'none',stroke:C.yellow,'stroke-width':1.2,opacity:.7},g)}
    res.innerHTML=`In <b>${stuck}</b> partite su ${R} la macchina 1 ha deluso all'inizio e non è più stata toccata: il regret sale di ¼ a ogni round, senza fine.`}
  draw();
};

/* ---------- explore then commit: quanto esplorare ---------- */
FIG.etc=function(st){
  const T=1000,D=0.2,MX=150,pw=[0];
  (function(){const pm=(m,q)=>{const a=new Float64Array(m+1);a[0]=Math.pow(1-q,m);for(let k=1;k<=m;k++)a[k]=a[k-1]*(m-k+1)/k*q/(1-q);return a};
    for(let m=1;m<=MX;m++){const a=pm(m,0.5),b=pm(m,0.7);let cb=0,s=0;for(let k=0;k<=m;k++){s+=a[k]*(cb+b[k]/2);cb+=b[k]}pw.push(s)}})();
  const ex=m=>m*D,er=m=>(T-2*m)*D*pw[m];let m=10;
  slider(st,'Tiri di prova per macchina '+K('T_0'),1,MX,1,m,v=>String(v),v=>{m=v;draw()});
  legend(st,[[C.blue,'costo dell\'esplorazione'],[C.orange,'costo di una scelta finale sbagliata'],[C.yellow,'regret atteso totale']]);
  const p=Plot(st,{W:600,H:300,m:[44,10,14,42],xr:[0,MX],yr:[0,90],label:'Regret atteso di explore-then-commit al variare dei tiri di prova'});p.axes([0,25,50,75,100,125,150],[0,20,40,60,80],'tiri di prova per macchina',null);
  const ms=Array.from({length:MX},(_,i)=>i+1);
  S('path',{d:p.poly(ms.map(v=>[v,ex(v)])),fill:'none',stroke:C.blue,'stroke-width':2},p.g);S('path',{d:p.poly(ms.map(v=>[v,er(v)])),fill:'none',stroke:C.orange,'stroke-width':2},p.g);S('path',{d:p.poly(ms.map(v=>[v,ex(v)+er(v)])),fill:'none',stroke:C.yellow,'stroke-width':3},p.g);
  const ln=S('line',{y1:p.ay,y2:p.ay+p.ah,stroke:'#fff','stroke-dasharray':'5 4'},p.g),dt=S('circle',{r:6,fill:C.yellow,stroke:'#000'},p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){ln.setAttribute('x1',p.sx(m));ln.setAttribute('x2',p.sx(m));dt.setAttribute('cx',p.sx(m));dt.setAttribute('cy',p.sy(ex(m)+er(m)));
    res.innerHTML=`Con ${m} tiri di prova a testa la macchina sbagliata viene scelta nel <b>${nf(100*pw[m],1)}%</b> dei casi. Regret atteso: ${nf(ex(m),1)} + ${nf(er(m),1)} = <b>${nf(ex(m)+er(m),1)}</b>.`}
  draw();
};

/* ---------- UCB: gli intervalli che si stringono ---------- */
FIG.ucb=function(st){
  const mu=[0.3,0.5,0.7],T=120,r=rng(2024),n=[0,0,0],s=[0,0,0],ST=[];
  const ub=(n,s,k)=>n[k]?s[k]/n[k]+Math.sqrt(2*Math.log(T)/n[k]):9;
  for(let t=0;t<T;t++){let a=0;if(t<3)a=t;else for(let k=1;k<3;k++)if(ub(n,s,k)>ub(n,s,a))a=k;const rew=r()<mu[a]?1:0;ST.push({a,rew,n:n.slice(),s:s.slice()});n[a]++;s[a]+=rew}ST.push({a:-1,n:n.slice(),s:s.slice()});
  legend(st,[['#fff','media osservata','dot'],[C.lg,'intervallo di confidenza'],[C.yellow,'media vera, nascosta a chi gioca','','height:0;border-top:2px dashed '+C.yellow+';background:none']]);
  const p=Plot(st,{W:600,H:340,m:[40,14,12,46],xr:[0.4,3.6],yr:[0,2.3],label:'Gli intervalli di confidenza di UCB durante il gioco'});p.axes(null,[0,0.5,1,1.5,2],null,null);
  const xl=[1,2,3].map((x,k)=>{const t=S('text',{x:p.sx(x),y:p.H-26,'text-anchor':'middle'},p.axg);t.style.fontWeight='600';t.style.fill=AC[k];t.textContent='Macchina '+AN[k];return S('text',{x:p.sx(x),y:p.H-8,'text-anchor':'middle',class:'tag'},p.axg)});
  mu.forEach((v,k)=>S('line',{x1:p.sx(k+1)-46,x2:p.sx(k+1)+46,y1:p.sy(v),y2:p.sy(v),stroke:C.yellow,'stroke-width':2,'stroke-dasharray':'5 4'},p.g));
  const bar=[0,1,2].map(k=>S('rect',{x:p.sx(k+1)-13,width:26,rx:4,fill:AC[k],opacity:.5},p.g)),top=[0,1,2].map(k=>S('line',{x1:p.sx(k+1)-22,x2:p.sx(k+1)+22,stroke:AC[k],'stroke-width':3},p.g)),dot=[0,1,2].map(k=>S('circle',{cx:p.sx(k+1),r:6,fill:'#fff',stroke:'#000'},p.g)),hl=S('rect',{width:112,y:p.ay,height:p.ah,rx:8,fill:'none',stroke:C.yellow,'stroke-width':2},p.bg);
  const res=out(st),PER=2;
  const iv=(q,k)=>{if(!q.n[k])return [0.5,0,9];const m=q.s[k]/q.n[k],b=Math.sqrt(2*Math.log(T)/q.n[k]);return [m,m-b,m+b]};
  player(st,T*PER,10,pos=>{const fin=pos>=T*PER,k=Math.min(T-1,Math.floor(pos/PER)),fr=fin?1:pos/PER-k,A=ST[k],B=ST[k+1],t=ez(clamp((fr-0.4)/0.6,0,1));
    for(let j=0;j<3;j++){const a=iv(A,j),b=iv(B,j),m=a[0]+(b[0]-a[0])*t,lo=Math.max(0,a[1]+(b[1]-a[1])*t),hi=Math.min(4,a[2]+(b[2]-a[2])*t),none=!B.n[j]&&!A.n[j];
      bar[j].setAttribute('y',p.sy(hi));bar[j].setAttribute('height',Math.max(0,p.sy(lo)-p.sy(hi)));bar[j].setAttribute('opacity',none?.18:.5);top[j].setAttribute('y1',p.sy(hi));top[j].setAttribute('y2',p.sy(hi));dot[j].setAttribute('cy',p.sy(m));dot[j].setAttribute('opacity',(t>0.5?B.n[j]:A.n[j])?1:0);
      const nn=(t>0.5||fin)?B.n[j]:A.n[j];xl[j].textContent=nn?`giocata ${nn} volt${nn===1?'a':'e'}`:'mai giocata'}
    hl.setAttribute('x',p.sx(A.a+1)-56);hl.setAttribute('opacity',fin?0:1);
    res.innerHTML=fin?`Dopo ${T} round: A giocata ${B.n[0]} volte, B ${B.n[1]}, C ${B.n[2]}. Le macchine peggiori sono state provate quanto basta per escluderle.`
      :`<b>Round ${k+1}.</b> ${k<3?'Primo giro: ogni macchina viene provata una volta.':'Il limite superiore più alto è quello della macchina '+AN[A.a]+' ('+nf(ub(A.n,A.s,A.a),2)+').'} Gioca <b style="color:${AC[A.a]}">${AN[A.a]}</b> e ${A.rew?'vince':'perde'}.`});
};

/* ---------- regret al variare del gap: ETC e UCB ---------- */
FIG.etcucb=function(st){
  const T=1000,DS=Array.from({length:41},(_,i)=>i*0.025),MS=[[25,'#2f7d92'],[50,'#58C4DD'],[100,'#bfe9f3']];
  const etc=(m,d)=>m*d+(T-2*m)*d*Phi(-d*Math.sqrt(m/2));
  const ucb=d=>{let tot=0;const R=120;for(let q=0;q<R;q++){const r=rng(900+q),n=[1,1],s=[r.n(),d+r.n()];let reg=d;for(let t=2;t<T;t++){const b=2*Math.log(T),a=(s[1]/n[1]+Math.sqrt(b/n[1])>=s[0]/n[0]+Math.sqrt(b/n[0]))?1:0;n[a]++;s[a]+=(a?d:0)+r.n();if(!a)reg+=d}tot+=reg}return tot/R};
  legend(st,MS.map(a=>[a[1],'ETC con '+a[0]+' tiri di prova']).concat([[C.yellow,'UCB']]));
  const p=Plot(st,{W:600,H:310,m:[44,10,14,42],xr:[0,1],yr:[0,110],label:'Regret atteso al variare del gap fra le due macchine'});p.axes([0,0.2,0.4,0.6,0.8,1],[0,25,50,75,100],'gap Δ fra le medie delle due macchine',null);
  MS.forEach(a=>S('path',{d:p.poly(DS.map(d=>[d,etc(a[0],d)])),fill:'none',stroke:a[1],'stroke-width':2},p.g));
  const U=DS.map(d=>[d,ucb(d)]),sm=U.map((q,i)=>[q[0],(U[Math.max(0,i-1)][1]+q[1]*2+U[Math.min(U.length-1,i+1)][1])/4]);sm[0][1]=0;
  S('path',{d:p.poly(sm),fill:'none',stroke:C.yellow,'stroke-width':3},p.g);
};

/* ---------- confronto: regret nel tempo ---------- */
FIG.compare=function(st){
  const mu=[0.3,0.5,0.7],T=20000,STP=200,R=24,best=0.7,NP=T/STP;
  const sim=(pol)=>{const acc=new Float64Array(NP+1);for(let q=0;q<R;q++){const r=rng(31+q*17),n=[0,0,0],s=[0,0,0];let reg=0;const ctx={};for(let t=0;t<T;t++){const a=pol(t,n,s,r,ctx);n[a]++;s[a]+=r()<mu[a]?1:0;reg+=best-mu[a];if((t+1)%STP===0)acc[(t+1)/STP]+=reg/R}}return Array.from(acc,(v,i)=>[i*STP,v])};
  const am=(n,s)=>{let a=0;for(let k=1;k<3;k++)if(s[k]/n[k]>s[a]/n[a])a=k;return a};
  const L2=2*Math.log(T),T0=Math.round(Math.pow(T/3,2/3)*Math.pow(Math.log(T),1/3));
  const eps=(t,n,s,r)=>t<3?t:(r()<0.1?Math.floor(r()*3):am(n,s));
  const etc=(t,n,s,r,c)=>{if(t<3*T0)return t%3;if(c.a==null)c.a=am(n,s);return c.a};
  const ucb=(t,n,s)=>{if(t<3)return t;let a=0,b=-1;for(let k=0;k<3;k++){const u=s[k]/n[k]+Math.sqrt(L2/n[k]);if(u>b){b=u;a=k}}return a};
  legend(st,[[C.orange,'ε-greedy con ε = 0,1'],[C.blue,'explore-then-commit'],[C.yellow,'UCB']]);
  const p=Plot(st,{W:600,H:310,m:[48,10,34,42],xr:[0,T],yr:[0,520],label:'Regret accumulato da tre strategie'});p.axes([0,5000,10000,15000,20000],[0,100,200,300,400,500],'round',null,v=>v?v/1000+' mila':'0');
  [[eps,C.orange],[etc,C.blue],[ucb,C.yellow]].forEach(a=>S('path',{d:p.poly(sim(a[0])),fill:'none',stroke:a[1],'stroke-width':2.6},p.g));
  cap(st,`tre macchine con probabilità di vincita 0,3, 0,5 e 0,7 · media su ${R} partite · explore-then-commit prova ogni macchina ${T0} volte`);
};

/* ---------- avversario contro una strategia deterministica ---------- */
FIG.advdet=function(st){
  const T=12,ST=[];{const c=[0,0];let me=0;for(let t=0;t<T;t++){const a=c[0]<=c[1]?0:1;ST.push({a,c:c.slice(),me});c[a]++;me++}ST.push({a:-1,c:c.slice(),me})}
  legend(st,[[C.red,'chi impara'],[C.blue,'macchina 1'],[C.green,'macchina 2']]);
  const p=Plot(st,{W:600,H:300,m:[40,12,14,42],xr:[0,T],yr:[0,T+0.5],label:'Perdita accumulata contro un avversario'});p.axes([0,2,4,6,8,10,12],[0,3,6,9,12],'round','perdita accumulata');
  const L=[C.blue,C.green,C.red].map(c=>S('path',{fill:'none',stroke:c,'stroke-width':c===C.red?3:2.4},p.g)),res=out(st),PER=10;
  player(st,T*PER,8,pos=>{const fin=pos>=T*PER,k=Math.min(T-1,Math.floor(pos/PER)),fr=fin?1:ez(clamp((pos/PER-k)/0.6,0,1)),pt=[[],[],[]];
    for(let i=0;i<=k;i++){pt[0].push([i,ST[i].c[0]-0.06]);pt[1].push([i,ST[i].c[1]+0.06]);pt[2].push([i,ST[i].me])}
    const A=ST[k],B=ST[k+1];pt[0].push([k+fr,A.c[0]-0.06+(B.c[0]-A.c[0])*fr]);pt[1].push([k+fr,A.c[1]+0.06+(B.c[1]-A.c[1])*fr]);pt[2].push([k+fr,A.me+fr]);L.forEach((l,i)=>l.setAttribute('d',p.poly(pt[i])));
    res.innerHTML=fin?`Dopo ${T} round chi impara ha perso <b>${T}</b>, ciascuna macchina solo <b>${T/2}</b>. Il regret è ${T/2}, la metà dei round: cresce in modo lineare.`
      :`<b>Round ${k+1}.</b> Chi impara sceglie la macchina ${A.a+1}, quella con meno perdite finora${A.c[0]===A.c[1]?' (a pari merito, la 1)':''}. L'avversario lo aveva previsto: perdita 1 lì, 0 sull'altra.`});
};

/* ---------- Hedge e il tasso di apprendimento ---------- */
FIG.hedge=function(st){
  const T=40,LS=[];for(let t=0;t<T;t++)LS.push(t===0?[0.5,0]:t<20?(t%2?[0,1]:[1,0]):[0,1]);
  const cum=[0,0];LS.forEach(l=>{cum[0]+=l[0];cum[1]+=l[1]});const bestL=Math.min(cum[0],cum[1]);let eta=0.5;
  slider(st,'Tasso di apprendimento '+K('\\Et'),0.02,4,0.02,eta,v=>nf(v,2),v=>{eta=v;draw()});
  const p=Plot(st,{W:600,H:250,m:[44,12,14,20],xr:[0,T],yr:[0,1],label:'Probabilità con cui Hedge gioca la macchina 1'});p.axes([0,10,20,30,40],[0,0.5,1],null,'probabilità di giocare la macchina 1');
  S('line',{x1:p.sx(20),x2:p.sx(20),y1:p.ay,y2:p.ay+p.ah,stroke:'#555','stroke-dasharray':'4 4'},p.bg);S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0.5),y2:p.sy(0.5),stroke:'#333'},p.bg);
  const ln=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.8,'stroke-linejoin':'round'},p.g);
  const sv=M.Svg(st,600,74,'Le perdite decise dall\'avversario, round per round');
  [0,1].forEach(a=>{S('text',{x:38,y:20+a*24,'text-anchor':'end',class:'tag',fill:'#ccc'},sv).textContent='m. '+(a+1);LS.forEach((l,t)=>S('rect',{x:p.sx(t)+1.5,y:8+a*24,width:p.aw/T-3,height:16,rx:2,fill:C.red,opacity:0.12+0.88*l[a]},sv))});
  S('text',{x:p.ax+p.aw/2,y:70,'text-anchor':'middle',class:'tag',fill:'#ccc'},sv).textContent='round (rosso pieno = perdita 1 in quel round)';
  const res=out(st);res.style.minHeight='3.4em';
  function draw(){const w=[1,1],pts=[];let loss=0;LS.forEach((l,t)=>{const x=w[0]/(w[0]+w[1]);pts.push([t,x],[t+1,x]);loss+=x*l[0]+(1-x)*l[1];w[0]*=Math.exp(-eta*l[0]);w[1]*=Math.exp(-eta*l[1]);const z=w[0]+w[1];w[0]/=z;w[1]/=z});
    ln.setAttribute('d',p.poly(pts));res.innerHTML=`Perdita attesa di Hedge: ${nf(loss,1)}. Perdita della macchina migliore (la 1): ${nf(bestL,1)}. Regret: <b>${nf(loss-bestL,1)}</b>.`}
  draw();
};
/* ---------- EXP3: una stima rumorosa ma giusta in media ---------- */
FIG.ipw=function(st){
  let x=0.2;const T=300,L=0.5,U=(function(){const r=rng(77),a=[];for(let i=0;i<T;i++)a.push(r());return a})();
  slider(st,'Probabilità con cui il braccio viene giocato',0.1,1,0.05,x,v=>nf(v,2),v=>{x=v;draw()});
  legend(st,[[C.lg,'stima a ogni round'],[C.yellow,'media delle stime fin lì'],[C.pink,'perdita vera, 0,5','','height:0;border-top:2px dashed '+C.pink+';background:none']]);
  const p=Plot(st,{W:600,H:290,m:[40,12,14,42],xr:[0,T],yr:[0,5.3],label:'Le stime di EXP3 per un braccio e la loro media'});p.axes([0,100,200,300],[0,1,2,3,4,5],'round',null);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(L),y2:p.sy(L),stroke:C.pink,'stroke-width':2,'stroke-dasharray':'6 4'},p.g);const g=S('g',null,p.g),ln=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2.6},p.g),res=out(st);res.style.minHeight='3.4em';
  function draw(){g.textContent='';let sum=0,n=0;const pts=[];for(let t=0;t<T;t++){const est=U[t]<x?L/x:0;if(est){n++;S('line',{x1:p.sx(t+0.5),x2:p.sx(t+0.5),y1:p.sy(0),y2:p.sy(est),stroke:C.lg,'stroke-width':1.6,opacity:.7},g)}sum+=est;pts.push([t+1,sum/(t+1)])}ln.setAttribute('d',p.poly(pts));
    res.innerHTML=`Il braccio è stato giocato ${n} volte su ${T}. Ogni volta la stima vale ${K('0{,}5/'+kn(x,2)+'='+kn(L/x,2))}, le altre volte 0. Media finale: <b>${nf(sum/T,2)}</b>.`}
  draw();
};
})();
(function(){
'use strict';
const M=window.__ML;
const {FIG,K,S,H,C,nf,kn,clamp,rng,Plot,slider,btn,player,out,legend,Svg,arrow,cap}=M;
const ez=t=>t*t*(3-2*t),sg=(v,d)=>(v>0?'+':'')+nf(v,d==null?0:d);

/* ================= lo studente (MDP di David Silver) ================= */
const SP={FB:[110,84],C1:[110,250],C2:[300,250],C3:[490,250],SL:[300,84]},SN={FB:'Facebook',C1:'Lezione 1',C2:'Lezione 2',C3:'Lezione 3',SL:'A letto'};
const ACT={C1:[{n:'Studia',r:-2,to:'C2'},{n:'Facebook',r:-1,to:'FB'}],FB:[{n:'Resta su Facebook',r:-1,to:'FB'},{n:'Smetti',r:0,to:'C1'}],C2:[{n:'Studia',r:-2,to:'C3'},{n:'Vai a dormire',r:0,to:'SL'}],C3:[{n:'Studia',r:10,to:'SL'},{n:'Vai al pub',r:1,to:[['C1',0.2],['C2',0.4],['C3',0.4]]}],SL:[]};
FIG.student=function(st){
  const sv=Svg(st,600,400,'Il processo decisionale dello studente'),g=S('g',null,sv),R=36,col='#8a8a8a';
  const lab=(x,y,t,an,c)=>{const e=S('text',{x,y,'text-anchor':an||'middle',class:'tag'},g);if(c)e.style.fill=c;e.textContent=t;return e};
  const shrink=(a,b,ra,rb)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/d,(b[1]-a[1])/d];return [a[0]+u[0]*ra,a[1]+u[1]*ra,b[0]-u[0]*rb,b[1]-u[1]*rb]};
  const ar=(a,b,ra,rb)=>{const q=shrink(a,b,ra==null?R+3:ra,rb==null?R+5:rb);arrow(g,q[0],q[1],q[2],q[3],col,2)};
  ar(SP.C1,SP.C2);lab(205,240,'Studia −2');ar(SP.C2,SP.C3);lab(395,240,'Studia −2');
  ar([SP.C2[0],SP.C2[1]],[SP.SL[0],SP.SL[1]]);lab(310,172,'Dormi 0','start');
  ar(SP.C3,SP.SL);lab(412,150,'Studia +10','start');
  arrow(g,122,250-R-3,122,84+R+5,col,2);lab(132,172,'Facebook −1','start');arrow(g,98,84+R+3,98,250-R-5,col,2);lab(88,172,'Smetti 0','end');
  S('path',{d:'M88 54C60 6 160 6 132 54',fill:'none',stroke:col,'stroke-width':2},g);S('path',{d:'M132 54l-1 -11l9 5z',fill:col},g);lab(110,16,'Facebook −1');
  const PB=[410,352];ar(SP.C3,PB,R+3,7);lab(466,318,'Pub +1','start');S('circle',{cx:PB[0],cy:PB[1],r:6,fill:col},g);
  const cv=(d,x,y,t)=>{S('path',{d,fill:'none',stroke:col,'stroke-width':1.6,'stroke-dasharray':'5 4'},g);lab(x,y,t,'middle','#9a9a9a')};
  const hd=(x,y,fx,fy)=>{const an=Math.atan2(y-fy,x-fx);S('path',{d:`M${x} ${y}L${x-10*Math.cos(an-.4)} ${y-10*Math.sin(an-.4)}L${x-10*Math.cos(an+.4)} ${y-10*Math.sin(an+.4)}z`,fill:col},g)};
  cv(`M${PB[0]-7} ${PB[1]+2}Q230 400 128 289`,226,394,'0,2');hd(128,289,160,330);cv(`M${PB[0]-6} ${PB[1]-4}L326 283`,352,336,'0,4');hd(326,283,PB[0],PB[1]);cv(`M${PB[0]+7} ${PB[1]+2}Q570 384 520 284`,566,340,'0,4');hd(520,284,540,322);
  const node={};Object.keys(SP).forEach(k=>{const p=SP[k];node[k]=k==='SL'?S('rect',{x:p[0]-R,y:p[1]-R,width:2*R,height:2*R,rx:8,fill:'#111',stroke:'#aaa','stroke-width':2},g):S('circle',{cx:p[0],cy:p[1],r:R,fill:'#111',stroke:'#aaa','stroke-width':2},g);
    const w=SN[k].split(' ');w.forEach((t,i)=>{const e=S('text',{x:p[0],y:p[1]+5+(i-(w.length-1)/2)*17,'text-anchor':'middle'},g);e.style.fill='#fff';e.style.fontSize='14px';e.textContent=t})});
  const ctl=H('div',{class:'row'},st),res=out(st);res.style.minHeight='5em';let s,tot,log;const r=rng(12);
  function start(){s='C1';tot=0;log=[];draw()}
  function draw(){Object.keys(node).forEach(k=>{node[k].setAttribute('stroke',k===s?C.yellow:'#aaa');node[k].setAttribute('stroke-width',k===s?4.5:2);node[k].setAttribute('fill',k===s?'#3a3a00':'#111')});ctl.textContent='';
    if(s==='SL'){btn(ctl,'Ricomincia da Lezione 1',start)}else ACT[s].forEach(a=>btn(ctl,`${a.n} (${sg(a.r)})`,()=>{let to=a.to;if(Array.isArray(to)){let u=r(),i=0;while(u>to[i][1]&&i<to.length-1){u-=to[i][1];i++}to=to[i][0]}tot+=a.r;log.push(`${a.n} ${sg(a.r)}`);s=to;draw()}));
    const tail=log.slice(-5).join(' · ');
    res.innerHTML=s==='SL'?`Episodio finito in ${log.length} mosse. Ricompensa totale: <b>${sg(tot)}</b>.`:`Sei in <b>${SN[s]}</b>. ${log.length?`Ultime mosse: ${tail}. `:''}Ricompensa totale finora: <b>${sg(tot)}</b>.`}
  start();
};

/* ---------- lo sconto ---------- */
FIG.discount=function(st){
  let ga=0.9;const RW=[-2,-2,10],NM=['Studia','Studia','Studia'];slider(st,'Fattore di sconto '+K('\\gamma'),0,1,0.01,ga,v=>nf(v,2),v=>{ga=v;draw()});
  legend(st,[['#777','ricompensa'],[C.yellow,'ricompensa scontata']]);
  const p=Plot(st,{W:600,H:280,m:[40,12,14,46],xr:[-0.6,2.6],yr:[-3,10.5],label:'Le tre ricompense del piano «studia sempre» prima e dopo lo sconto'});p.axes(null,[-2,0,2,4,6,8,10],null,null);
  S('line',{x1:p.ax,x2:p.ax+p.aw,y1:p.sy(0),y2:p.sy(0),stroke:'#777'},p.g);
  RW.forEach((v,t)=>{S('rect',{x:p.sx(t)-40,width:36,y:p.sy(Math.max(0,v)),height:Math.abs(p.sy(v)-p.sy(0)),fill:'#777'},p.g);S('text',{x:p.sx(t),y:p.H-24,'text-anchor':'middle',class:'tag'},p.axg).textContent=`mossa ${t+1}: ${NM[t]}`});
  const bars=RW.map((v,t)=>S('rect',{x:p.sx(t)+4,width:36,fill:C.yellow},p.g)),tx=RW.map((v,t)=>{const e=S('text',{x:p.sx(t),y:p.H-6,'text-anchor':'middle'},p.axg);return e}),res=out(st);res.style.minHeight='3.4em';
  function draw(){let G=0;RW.forEach((v,t)=>{const d=v*Math.pow(ga,t);G+=d;bars[t].setAttribute('y',p.sy(Math.max(0,d)));bars[t].setAttribute('height',Math.abs(p.sy(d)-p.sy(0)));tx[t].textContent=`peso ${nf(Math.pow(ga,t),2)} → ${nf(d,2)}`});
    res.innerHTML=`Ritorno di «studia sempre»: <b>${nf(G,2)}</b>. Studiare una volta e poi andare a dormire dà −2. ${G>-2+1e-9?'Conviene studiare fino in fondo.':G<-2-1e-9?'Con uno sconto così forte il +10 finale non ripaga la seconda lezione.':'I due piani si equivalgono.'}`}
  draw();
};

/* ---------- il topo: che cosa mettere nello stato ---------- */
FIG.rat=function(st){
  const SEQ=[[0,0,1,2],[2,0,1,1],[1,0,1,2]],OUT=['scossa','formaggio','?'],NM=['luce','leva','campanello'],NP=['luci','leve','campanelli'],IC=[C.yellow,C.orange,C.blue];let mode=0;
  M.pick(st,'Scegli che cosa conta come stato',['gli ultimi tre segnali','quanti segnali di ogni tipo','tutta la sequenza'],mode,i=>{mode=i;draw()});
  legend(st,NM.map((n,i)=>[IC[i],n,'dot']));
  const sv=Svg(st,600,236,'Tre sequenze di segnali viste da un topo e il loro esito'),g=S('g',null,sv),res=out(st);res.style.minHeight='3.4em';
  const ix=i=>150+i*74,ry=r=>44+r*74;
  function icon(k,x,y){if(k===0)S('circle',{cx:x,cy:y,r:14,fill:IC[0]},g);else if(k===1){S('rect',{x:x-15,y:y+4,width:30,height:9,rx:2,fill:IC[1]},g);S('line',{x1:x,y1:y+6,x2:x+11,y2:y-14,stroke:IC[1],'stroke-width':5,'stroke-linecap':'round'},g)}else S('path',{d:`M${x-14} ${y+11}Q${x-12} ${y-16} ${x} ${y-16}Q${x+12} ${y-16} ${x+14} ${y+11}z`,fill:IC[2]},g)}
  function draw(){g.textContent='';const key=q=>mode===0?q.slice(1).join():mode===1?[0,1,2].map(k=>q.filter(v=>v===k).length).join():q.join(),k3=key(SEQ[2]),m=[0,1].filter(r=>key(SEQ[r])===k3);
    SEQ.forEach((q,r)=>{const y=ry(r),hit=r===2||m.includes(r),t=S('text',{x:30,y:y+6,'text-anchor':'start',class:'tag'},g);t.textContent=r<2?'giorno '+(r+1):'oggi';
      q.forEach((k,i)=>icon(k,ix(i),y));
      if(mode!==1)S('rect',{x:ix(mode===0?1:0)-30,y:y-24,width:(mode===0?2:3)*74+60,height:48,rx:10,fill:'none',stroke:hit?C.yellow:'#555','stroke-width':hit?2.6:1.4},g);
      else{const e=S('text',{x:ix(1.5),y:y+36,'text-anchor':'middle'},g);e.style.fontSize='13px';e.style.fill=hit?C.yellow:'#9a9a9a';e.textContent=[0,1,2].map(k=>{const n=q.filter(v=>v===k).length;return n+' '+(n===1?NM[k]:NP[k])}).join(' · ')}
      arrow(g,ix(3)+44,y,ix(3)+84,y,'#888',2);const o=S('text',{x:ix(3)+96,y:y+6,'text-anchor':'start'},g);o.style.fontWeight='600';const ot=r<2?OUT[r]:(m.length?OUT[m[0]]:'?');o.style.fill=ot==='scossa'?C.red:ot==='formaggio'?C.green:C.yellow;o.textContent=ot+(r===2&&m.length?'?':'')});
    res.innerHTML=m.length?`Con questo stato, oggi il topo è nella stessa situazione del giorno ${m[0]+1}: si aspetta <b>${m[0]===0?'la scossa':'il formaggio'}</b>.`:`Con questo stato la situazione di oggi non è mai stata vista: il topo non può prevedere nulla.`}
  draw();
};

/* ================= il mondo a griglia ================= */
const NC=4,NR=3,NS=12,WALL=5,TERM={3:1,7:-1,0:0.2},START=10,DX=[0,1,0,-1],DY=[-1,0,1,0],GA=0.9,AN=['su','destra','giù','sinistra'],CS=118,W0=NC*CS+16,H0=NR*CS+16;
const X=s=>8+(s%NC)*CS,Y=s=>8+Math.floor(s/NC)*CS;
function step(s,a){const c=s%NC+DX[a],r=Math.floor(s/NC)+DY[a];let t=r*NC+c;if(c<0||c>=NC||r<0||r>=NR||t===WALL)t=s;return [t,TERM[t]||0,t in TERM]}
const free=s=>s!==WALL&&!(s in TERM);
const vcol=v=>v>=0?`rgba(131,193,103,${clamp(0.04+0.8*v,0,0.9)})`:`rgba(252,98,85,${clamp(-0.85*v,0,0.9)})`;
function world(host,label,noStart){const sv=Svg(host,W0,H0,label,W0),bg=S('g',null,sv),g=S('g',null,sv),top=S('g',null,sv),cell=[];
  for(let s=0;s<NS;s++){const r=S('rect',{x:X(s)+2,y:Y(s)+2,width:CS-4,height:CS-4,rx:6,fill:s===WALL?'#3a3a3a':s in TERM?vcol(TERM[s]*(TERM[s]<1&&TERM[s]>0?2.2:1)):'#101010',stroke:'#555'},bg);cell.push(r);
    if(s in TERM){const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS/2+9,'text-anchor':'middle'},top);e.style.fill='#fff';e.style.fontSize='26px';e.style.fontWeight='600';e.textContent=sg(TERM[s],TERM[s]%1?1:0)}
    if(s===WALL){const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS/2+5,'text-anchor':'middle'},top);e.textContent='muro'}
    if(s===START&&!noStart){const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS-10,'text-anchor':'middle'},top);e.style.fontSize='13px';e.textContent='partenza'}}
  return {sv,bg,g,top,cell}}
const VSTAR=(function(){let V=new Float64Array(NS);const all=[V];for(let n=0;n<30;n++){const N=new Float64Array(NS);let ch=0;for(let s=0;s<NS;s++){if(!free(s))continue;let b=-1e9;for(let a=0;a<4;a++){const q=step(s,a);b=Math.max(b,q[1]+GA*V[q[0]])}N[s]=b;ch=Math.max(ch,Math.abs(b-V[s]))}if(ch<1e-9)break;all.push(N);V=N}return all})();
const qv=(V,s,a)=>{const q=step(s,a);return q[1]+GA*V[q[0]]};
function darrow(g,s,a,c,len){const cx=X(s)+CS/2,cy=Y(s)+CS/2-12,l=(len||30)/2;arrow(g,cx-DX[a]*l,cy-DY[a]*l,cx+DX[a]*l,cy+DY[a]*l,c||C.yellow,2.4)}

/* ---------- lo stesso mondo, due policy ---------- */
FIG.vpi=function(st){
  const VR=(function(){let V=new Float64Array(NS);for(let n=0;n<400;n++){const N=new Float64Array(NS);for(let s=0;s<NS;s++){if(!free(s))continue;let v=0;for(let a=0;a<4;a++)v+=qv(V,s,a)/4;N[s]=v}V=N}return V})(),VS=VSTAR[VSTAR.length-1],duo=H('div',{class:'duo'},st);
  [[VR,'policy casuale: ogni mossa con probabilità ¼',false],[VS,'policy ottima: si seguono le frecce',true]].forEach(o=>{const d=H('div',null,duo),w=world(d,'Valore di ogni casella con la '+o[1],true);
    for(let s=0;s<NS;s++){if(!free(s))continue;const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS-14,'text-anchor':'middle'},w.top);e.style.fill='#fff';e.style.fontSize='22px';e.textContent=nf(o[0][s],2);w.cell[s].setAttribute('fill',vcol(o[0][s]*(o[0][s]<0?1.6:0.6)));
      if(o[2]){const q=[0,1,2,3].map(a=>qv(VS,s,a)),b=Math.max(...q);q.forEach((x,a)=>{if(Math.abs(x-b)<1e-9)darrow(w.g,s,a,C.yellow,40)})}}
    cap(d,'<b>'+o[1]+'</b>')});
};

/* ---------- l'equazione di Bellman in una casella ---------- */
FIG.bellman=function(st){
  const V=VSTAR[VSTAR.length-1],w=world(st,'I valori ottimi delle caselle e il confronto fra le quattro mosse',true);let sel=6;
  const txt=[];for(let s=0;s<NS;s++){if(!free(s)){txt.push(null);continue}const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS/2+7,'text-anchor':'middle'},w.top);e.style.fill='#fff';e.style.fontSize='19px';e.textContent=nf(V[s],2);txt.push(e);
    w.cell[s].setAttribute('fill',vcol(V[s]*0.6));w.cell[s].style.cursor='pointer';e.style.pointerEvents='none';w.cell[s].addEventListener('click',()=>{sel=s;draw()})}
  const res=out(st);res.style.minHeight='5em';
  function draw(){w.g.textContent='';for(let s=0;s<NS;s++)if(free(s)){w.cell[s].setAttribute('stroke',s===sel?C.yellow:'#555');w.cell[s].setAttribute('stroke-width',s===sel?4:1)}
    const q=[0,1,2,3].map(a=>qv(V,sel,a)),b=Math.max(...q);q.forEach((v,a)=>{const best=Math.abs(v-b)<1e-9,cx=X(sel)+CS/2+DX[a]*40,cy=Y(sel)+CS/2+DY[a]*40+5,e=S('text',{x:cx,y:cy,'text-anchor':'middle'},w.g);e.style.fill=best?C.yellow:'#aaa';e.style.fontSize='12.5px';e.style.fontWeight=best?'700':'400';e.style.pointerEvents='none';e.textContent=nf(v,2)});
    res.innerHTML=`Dalla casella scelta: `+q.map((v,a)=>{const t=step(sel,a);return `${AN[a]} ${K(sg(t[1],t[1]%1?1:0).replace(',','{,}').replace('−','-')+'+0{,}9\\cdot'+kn(V[t[0]],2)+'='+kn(v,2))}`}).join('; ')+`. Il massimo, <b>${nf(b,2)}</b>, è il valore della casella.`}
  draw();
};

/* ---------- value iteration ---------- */
FIG.vi=function(st){
  const w=world(st,'Value iteration sul mondo a griglia',true),n=VSTAR.length-1,txt=[];
  for(let s=0;s<NS;s++){if(!free(s)){txt.push(null);continue}const e=S('text',{x:X(s)+CS/2,y:Y(s)+CS-14,'text-anchor':'middle'},w.top);e.style.fill='#fff';e.style.fontSize='18px';txt.push(e)}
  const res=out(st),PER=18;
  player(st,n*PER+8,8,pos=>{const fin=pos>=n*PER,k=Math.min(n-1,Math.floor(pos/PER)),t=fin?1:ez(clamp((pos/PER-k)/0.55,0,1)),A=VSTAR[k],B=VSTAR[k+1],Vd=t>=0.5?B:A;w.g.textContent='';
    for(let s=0;s<NS;s++){if(!free(s))continue;const v=A[s]+(B[s]-A[s])*t;txt[s].textContent=nf(v,2);w.cell[s].setAttribute('fill',vcol(v*0.6));
      if(Vd[s]>1e-9){const q=[0,1,2,3].map(a=>qv(Vd,s,a)),b=Math.max(...q);q.forEach((x,a)=>{if(Math.abs(x-b)<1e-9&&b>1e-9)darrow(w.g,s,a,C.yellow,34)})}}
    res.innerHTML=fin?`Dopo ${n} passaggi i valori non cambiano più: sono i valori ottimi ${K('V^*')}. Seguendo le frecce da qualsiasi casella si arriva al premio grande.`
      :`<b>Passaggio ${k+1} di ${n}.</b> ${k===0?'Si parte da tutti zeri: acquistano un valore solo le caselle accanto a un premio.':'Ogni casella guarda le vicine e tiene il meglio di «ricompensa + 0,9 × valore della vicina». L\'informazione si allarga di una casella.'}`});
};

/* ---------- Q-learning ---------- */
function greedy(Q,s,r){let b=-1e9,l=[];for(let a=0;a<4;a++){const v=Q[s*4+a];if(v>b+1e-12){b=v;l=[a]}else if(Math.abs(v-b)<=1e-12)l.push(a)}return l[Math.floor(r()*l.length)]}
function ql(eps,E,seed,eta,capn,keep){const r=rng(seed),Q=new Float64Array(NS*4),log=[];for(let e=0;e<E;e++){let s=START;for(let k=0;k<capn;k++){const ex=r()<eps,a=ex?Math.floor(r()*4):greedy(Q,s,r),q=step(s,a);let m=0;if(!q[2]){m=-1e9;for(let b=0;b<4;b++)m=Math.max(m,Q[q[0]*4+b])}const nv=(1-eta)*Q[s*4+a]+eta*(q[1]+GA*m);if(keep){let mx=-1e9,nt=0;for(let b=0;b<4;b++)mx=Math.max(mx,Q[s*4+b]);for(let b=0;b<4;b++)if(Math.abs(Q[s*4+b]-mx)<=1e-12)nt++;log.push({e,k,s,a,t:q[0],rew:q[1],ex,tie:nt>1,old:Q[s*4+a],m,nv,done:q[2]})}Q[s*4+a]=nv;s=q[0];if(q[2])break}}return {Q,log}}
function endOf(Q){let s=START;for(let k=0;k<40;k++){let a=0;for(let b=1;b<4;b++)if(Q[s*4+b]>Q[s*4+a])a=b;const q=step(s,a);s=q[0];if(q[2])return TERM[s]}return 0}
M.rl={ql,endOf,step};
const QSEED=68,QEP=22;
FIG.qlearn=function(st){
  const L=ql(0.2,QEP,QSEED,0.5,40,true).log,n=L.length,w=world(st,'Q-learning sul mondo a griglia'),tri=[];
  legend(st,[['rgba(131,193,103,.85)','Q alto: mossa promettente'],['rgba(252,98,85,.85)','Q negativo: mossa da evitare'],[C.yellow,'l\'agente','dot']]);st.insertBefore(st.lastChild,w.sv);
  for(let s=0;s<NS;s++){if(!free(s)){tri.push(null);continue}const x=X(s)+3,y=Y(s)+3,d=CS-6,cx=x+d/2,cy=y+d/2,P=[[x,y,x+d,y],[x+d,y,x+d,y+d],[x+d,y+d,x,y+d],[x,y+d,x,y]];w.cell[s].setAttribute('fill','none');
    tri.push(P.map(q=>S('path',{d:`M${cx} ${cy}L${q[0]} ${q[1]}L${q[2]} ${q[3]}z`,fill:'#101010',stroke:'#2a2a2a'},w.bg)))}
  const trail=S('path',{fill:'none',stroke:C.yellow,'stroke-width':2,opacity:.45,'stroke-linejoin':'round'},w.g),ag=S('circle',{r:13,fill:C.yellow,stroke:'#000','stroke-width':2},w.g),res=out(st);
  const cx=s=>X(s)+CS/2,cy=s=>Y(s)+CS/2;
  player(st,n,5,pos=>{const fin=pos>=n,k=Math.min(n-1,Math.floor(pos)),fr=fin?1:pos-k,e=L[k],Q=new Float64Array(NS*4);for(let i=0;i<k+(fr>0.6?1:0);i++)Q[L[i].s*4+L[i].a]=L[i].nv;
    for(let s=0;s<NS;s++)if(tri[s])for(let a=0;a<4;a++)tri[s][a].setAttribute('fill',Math.abs(Q[s*4+a])<1e-4?'#101010':vcol(Q[s*4+a]));
    const t=ez(clamp(fr/0.6,0,1)),px=cx(e.s)+(cx(e.t)-cx(e.s))*t,py=cy(e.s)+(cy(e.t)-cy(e.s))*t;ag.setAttribute('cx',px);ag.setAttribute('cy',py);
    let d='';for(let i=k-e.k;i<k;i++)d+=(d?'L':'M')+cx(L[i].s)+' '+cy(L[i].s);d+=(d?'L':'M')+cx(e.s)+' '+cy(e.s)+'L'+px.toFixed(1)+' '+py.toFixed(1);trail.setAttribute('d',d);
    res.innerHTML=`<b>Episodio ${e.e+1} di ${QEP}, mossa ${e.k+1}: ${AN[e.a]}</b> (${e.ex?'scelta a caso, per esplorare':e.tie?'a caso fra le migliori a pari merito':'la migliore secondo Q'}). ${e.t===e.s?'Sbatte e resta ferma. ':''}Ricompensa ${sg(e.rew,e.rew%1?1:0)}. Nuovo valore: ${K('0{,}5\\cdot'+kn(e.old,2).replace('-','-')+'+0{,}5\\cdot('+kn(e.rew,e.rew%1?1:0)+'+0{,}9\\cdot'+kn(e.m,2)+')='+kn(e.nv,2))}.`});
};

/* ---------- quanto esplorare ---------- */
FIG.explore=function(st){
  const EP=[0,0.1,0.2,0.3,0.4,0.5],R=200,res=EP.map(eps=>{let big=0,small=0;for(let sd=1;sd<=R;sd++){const e=endOf(ql(eps,300,sd,0.5,60,false).Q);if(e===1)big++;else if(e===0.2)small++}return [big/R,small/R]});
  legend(st,[[C.green,'arriva al premio grande (+1)'],[C.orange,'si accontenta del premio piccolo (+0,2)']]);
  const p=Plot(st,{W:600,H:290,m:[48,12,14,46],xr:[-0.6,5.6],yr:[0,1],label:'Che cosa impara Q-learning al variare di epsilon'});p.axes(EP.map((e,i)=>i),[0,0.25,0.5,0.75,1],'probabilità ε di fare una mossa a caso',null,i=>nf(EP[i],1),v=>Math.round(v*100)+'%');
  res.forEach((q,i)=>{const x=p.sx(i)-26;S('rect',{x,width:52,y:p.sy(q[0]),height:p.sy(0)-p.sy(q[0]),fill:C.green},p.g);S('rect',{x,width:52,y:p.sy(q[0]+q[1]),height:p.sy(q[0])-p.sy(q[0]+q[1]),fill:C.orange},p.g);
    const e=S('text',{x:p.sx(i),y:p.sy(q[0])+20,'text-anchor':'middle'},p.g);e.style.fill='#000';e.style.fontWeight='600';e.textContent=Math.round(q[0]*100)+'%'});
  cap(st,`${R} prove per ogni valore di ε, 300 episodi ciascuna; poi si segue la strategia imparata, senza più mosse a caso`);
};
})();
/* ---------- adattamento al sito: quiz in QZ, figure in INIT, mappa del corso ---------- */
(function(){
'use strict';
const {FIG,K,LESS,PART}=window.__ML;
/* le formule dei quiz si scrivono già pronte, perché il sito monta i quiz dopo aver reso le formule della lezione */
const pre=s=>String(s).replace(/\\\((.+?)\\\)/g,(m,x)=>K(x));
const QUIZ={
'2a':[{q:'In un punto il gradiente del costo è \\((3;\\,-1)\\). Quale di questi piccoli spostamenti dei due parametri fa scendere il costo più in fretta?',
  o:['\\((3;\\,-1)\\)','\\((-3;\\,1)\\)','\\((1;\\,3)\\)','\\((3;\\,1)\\)'],a:1,
  ok:'È l\'opposto del gradiente: la discesa più ripida. \\((1;3)\\) è perpendicolare al gradiente, quindi lungo quella direzione il costo quasi non cambia; le altre due formano con il gradiente un angolo minore di 90° e fanno salire.',hint:'Il gradiente punta dove il costo sale più in fretta. Da che parte bisogna andare?'}],
'18a':[{q:'In una griglia come quella della lezione, una casella ha a destra il premio +1 e sopra una casella di valore 0,9. Con \\(\\gamma=0{,}9\\), quanto vale?',
  o:['0,81','0,9','1','1,81'],a:2,
  ok:'Andare a destra vale \\(1+0{,}9\\cdot0=1\\) (il premio chiude l\'episodio, dopo non c\'è altro); andare su vale \\(0+0{,}9\\cdot0{,}9=0{,}81\\). L\'equazione di Bellman prende il massimo: 1.',hint:'Calcola ricompensa + 0,9 × valore di arrivo per ciascuna delle due mosse, poi prendi il massimo.'}],
'18b':[{q:'\\(Q(s,a)=0{,}2\\). L\'agente fa \\(a\\), riceve ricompensa 0 e arriva in uno stato dove il \\(Q\\) più alto è 1. Con \\(\\Et=0{,}5\\) e \\(\\gamma=0{,}9\\), qual è il nuovo \\(Q(s,a)\\)?',
  o:['0,45','0,55','0,9','1,1'],a:1,
  ok:'Il bersaglio è \\(0+0{,}9\\cdot1=0{,}9\\). Il nuovo valore è a metà strada fra il vecchio e il bersaglio: \\(0{,}5\\cdot0{,}2+0{,}5\\cdot0{,}9=0{,}55\\).',hint:'Calcola prima il bersaglio \\(r+\\gamma\\max Q\\), poi la media pesata con il valore vecchio.'}],
18:[
 {q:'Che cosa afferma la proprietà di Markov?',
  o:['Che le ricompense sono sempre positive','Che, dato lo stato presente, il futuro non dipende dalla storia passata','Che le azioni hanno sempre un esito certo','Che la policy ottima è casuale'],a:1,
  ok:'Lo stato riassume tutto ciò che serve. Per questo una policy può limitarsi a guardare lo stato presente.',hint:'Ripensa allo studente nello stato «Lezione 2»: conta da dove è arrivato?'},
 {q:'Un agente riceve le ricompense 1, 1, 1 nei primi tre passi e poi nulla. Con \\(\\gamma=0{,}5\\), quanto vale il ritorno?',
  o:['1','1,5','1,75','3'],a:2,
  ok:'\\(1+0{,}5\\cdot1+0{,}25\\cdot1=1{,}75\\). Ogni passo di ritardo dimezza il peso della ricompensa.',hint:'I pesi sono \\(\\gamma^0,\\gamma^1,\\gamma^2\\).'},
 {q:'Perché value iteration non si può usare quando l\'ambiente è sconosciuto?',
  o:['Perché non converge','Perché l\'aggiornamento richiede le ricompense e le probabilità di transizione di ogni azione','Perché serve una rete neurale','Perché funziona solo senza sconto'],a:1,
  ok:'La formula contiene \\(r(s,a)\\) e \\(p(s,a,s\')\\) per tutte le azioni e tutti gli stati. È pianificazione: si calcola, non si prova.',hint:'Guarda quali quantità compaiono nel lato destro della formula.'},
 {q:'Perché Q-learning impara \\(Q(s,a)\\) invece di \\(V(s)\\)?',
  o:['Perché \\(Q\\) occupa meno memoria','Perché con \\(Q\\) si sceglie l\'azione migliore senza conoscere dove portano le azioni','Perché \\(V\\) non esiste senza sconto','Perché \\(Q\\) non ha bisogno di ricompense'],a:1,
  ok:'Con \\(V\\) bisognerebbe sapere in quale stato porta ogni azione per confrontarle. Con \\(Q\\) basta prendere il massimo sulla riga della tabella.',hint:'Che cosa serve per scegliere un\'azione avendo solo i valori degli stati?'},
 {q:'Che cosa significa che Q-learning è off-policy?',
  o:['Che non usa alcuna policy','Che impara il valore della policy ottima anche mentre l\'agente si comporta in altro modo, per esempio esplorando','Che funziona solo offline','Che ignora le ricompense'],a:1,
  ok:'Il bersaglio usa \\(\\max_{a\'}Q(s\',a\')\\), l\'azione migliore, qualunque sia quella che l\'agente farà davvero.',hint:'Quale azione compare nel bersaglio: quella migliore o quella effettivamente scelta dopo?'},
 {q:'A che cosa serve la replay memory in DQN?',
  o:['A ricordare la policy ottima','Ad allenare la rete su transizioni estratte a caso dal passato, meno correlate di quelle consecutive','A ridurre il numero di stati','A eliminare l\'esplorazione'],a:1,
  ok:'Le transizioni consecutive si somigliano molto. Mescolarle rende i mini-batch più simili a dati indipendenti, e l\'allenamento più stabile.',hint:'Che difetto hanno i dati raccolti uno dopo l\'altro dallo stesso agente?'}],
'17a':[{q:'Tre macchine hanno medie 0,8, 0,6 e 0,3. In 100 round hai giocato la prima 70 volte, la seconda 20, la terza 10. Quanto vale il regret?',
  o:['4','9','30','80'],a:1,
  ok:'I gap sono 0, 0,2 e 0,5. Il regret è \\(20\\cdot0{,}2+10\\cdot0{,}5=4+5=9\\). I tiri sulla macchina migliore non costano nulla.',hint:'Moltiplica il numero di tiri di ogni macchina per il suo gap e somma.'}],
'17b':[{q:'Due macchine hanno la stessa media osservata, 0,6. La prima è stata giocata 4 volte, la seconda 100. Quale sceglie UCB?',
  o:['La prima','La seconda','Una a caso','Nessuna: si ferma'],a:0,
  ok:'A parità di media conta il termine di esplorazione \\(\\sqrt{2\\log T/N}\\), più grande dove \\(N\\) è piccolo. La prima potrebbe essere molto migliore di quanto sembra; della seconda si sa già abbastanza.',hint:'Quale dei due intervalli di confidenza è più largo?'}],
17:[
 {q:'Che cosa rende un problema di bandit diverso dall\'apprendimento supervisionato?',
  o:['Ci sono più dati','Si osserva solo l\'esito dell\'azione scelta, e le scelte determinano quali dati si vedono','Le ricompense sono sempre negative','Non serve alcun algoritmo'],a:1,
  ok:'È il feedback «bandit»: del braccio non giocato non si sa nulla. Per questo bisogna decidere anche che cosa vale la pena osservare.',hint:'Ripensa al medico: che cosa viene a sapere delle terapie che non ha scelto?'},
 {q:'Perché follow the leader ha regret lineare nell\'esempio delle due macchine?',
  o:['Perché esplora troppo','Perché un primo risultato sfortunato può far scartare per sempre la macchina migliore','Perché le ricompense sono negative','Perché non calcola le medie'],a:1,
  ok:'Chi non gioca più un braccio non può correggere la stima che ne ha. Con probabilità ½ si resta sulla macchina peggiore, perdendo ¼ a ogni round.',hint:'Che cosa succede se il primo tiro della macchina 1 dà 0?'},
 {q:'In explore-then-commit, che cosa succede aumentando molto i tiri di prova \\(T_0\\)?',
  o:['Il regret scende sempre','La scelta finale diventa più sicura, ma cresce il costo dei tiri spesi sulle macchine peggiori','La scelta finale diventa meno sicura','Non cambia nulla'],a:1,
  ok:'Sono le due curve della figura: una scende, l\'altra sale. Il regret totale ha un minimo nel mezzo, e dove sta dipende dal gap.',hint:'Ripensa alle due componenti del regret nella figura con il cursore.'},
 {q:'Perché ε-greedy con \\(\\Eps\\) costante ha regret lineare?',
  o:['Perché non esplora mai','Perché continua a giocare a caso una frazione fissa dei round, anche quando conosce già il braccio migliore','Perché si blocca come follow the leader','Perché usa intervalli troppo larghi'],a:1,
  ok:'Una frazione \\(\\Eps\\) dei round è spesa a caso per sempre: il regret cresce con pendenza proporzionale a \\(\\Eps\\).',hint:'Che cosa fa l\'algoritmo al round un milione?'},
 {q:'Contro un avversario, perché una strategia deterministica non può avere regret sublineare?',
  o:['Perché l\'avversario può prevedere la scelta e mettere la perdita proprio su quel braccio','Perché le perdite sono casuali','Perché i bracci sono troppi','Perché non si conosce \\(T\\)'],a:0,
  ok:'Chi impara perde 1 a ogni round, mentre il migliore dei due bracci perde al più \\(T/2\\). Scegliere a caso toglie all\'avversario questa possibilità.',hint:'Ripensa all\'animazione con le due macchine.'},
 {q:'In EXP3 un braccio viene giocato con probabilità 0,25 e si osserva una perdita 0,4. Qual è la stima usata per aggiornare il suo peso?',
  o:['0,1','0,4','1,6','0'],a:2,
  ok:'\\(0{,}4/0{,}25=1{,}6\\). Dividere per la probabilità compensa le volte in cui il braccio non viene osservato: in media la stima vale 0,4.',hint:'La perdita osservata si divide per la probabilità con cui il braccio è stato scelto.'}],
'16a':[{q:'Un autoencoder ha un codice di 200 numeri per immagini di 144 pixel, e nessun\'altra restrizione. Che cosa rischia di imparare?',
  o:['A copiare l\'input senza estrarne alcuna struttura','Nulla: non può essere allenato','A classificare le cifre','A generare immagini nuove'],a:0,
  ok:'Senza strettoia la rete può far passare ogni pixel così com\'è. L\'errore va a zero, ma il codice non riassume niente.',hint:'Che cosa costringe la rete a trovare le caratteristiche importanti?'}],
'16b':[{q:'Si allena un VAE togliendo dalla loss il termine KL. Che cosa succede?',
  o:['L\'encoder sceglie \\(\\sigma\\) vicine a zero e il VAE torna a comportarsi come un autoencoder normale','Tutte le immagini ricevono lo stesso codice','Le immagini generate diventano più varie','Non cambia nulla'],a:0,
  ok:'Il rumore nel codice peggiora la ricostruzione. Se nulla lo impedisce, la rete lo elimina portando \\(\\sigma\\) a zero, e lo spazio latente torna irregolare.',hint:'Quale dei due termini ha interesse a tenere \\(\\sigma\\) lontana da zero?'}],
16:[
 {q:'Qual è la «risposta giusta» con cui si allena un autoencoder?',
  o:['L\'etichetta della classe','L\'input stesso','Il codice latente corretto','Un\'immagine scelta a caso'],a:1,
  ok:'La rete deve restituire quello che ha ricevuto. Per questo non servono etichette.',hint:'Ripensa alla formula del problema di minimo: che cosa viene confrontato con \\(f(g(\\Xv))\\)?'},
 {q:'Un autoencoder allenato su cifre riceve tre immagini e le ricostruisce con errore 0,010, 0,014 e 0,060. Quale sospetti che non sia una cifra?',
  o:['La prima','La seconda','La terza','Non si può dire nulla'],a:2,
  ok:'Un errore molto più alto del solito indica un dato diverso da quelli visti in allenamento: la rete non ha un codice adatto a descriverlo.',hint:'L\'autoencoder ricostruisce bene solo ciò che somiglia ai dati di allenamento.'},
 {q:'In un denoising autoencoder, che cosa entra nella rete e con che cosa si confronta l\'uscita?',
  o:['Entra l\'immagine pulita, si confronta con quella sporca','Entra l\'immagine sporca, si confronta con quella pulita','Entra e si confronta con l\'immagine sporca','Entra e si confronta con l\'immagine pulita'],a:1,
  ok:'L\'input è rumoroso, il bersaglio è pulito. Copiare l\'input non basta più: la rete deve togliere il rumore.',hint:'Quale delle due immagini la rete deve imparare a produrre?'},
 {q:'L\'encoder di un VAE produce \\(\\mu=2\\) e \\(\\sigma=0{,}5\\), e il rumore estratto è \\(\\Eps=-1\\). Quanto vale il codice \\(z\\)?',
  o:['1,5','2,5','2','−1'],a:0,
  ok:'\\(z=\\mu+\\sigma\\cdot\\Eps=2+0{,}5\\cdot(-1)=1{,}5\\).',hint:'Applica la formula del reparameterization trick.'},
 {q:'Perché serve il reparameterization trick?',
  o:['Per rendere le immagini più nitide','Perché un\'estrazione a caso non si può derivare, mentre \\(\\mu+\\sigma\\Eps\\) sì','Per ridurre il numero di parametri','Per eliminare il termine KL'],a:1,
  ok:'Il caso viene spostato in \\(\\Eps\\), che non dipende dai parametri. Così il gradiente può risalire fino a \\(\\mu\\) e \\(\\sigma\\), cioè fino all\'encoder.',hint:'Che cosa blocca la backpropagation fra encoder e decoder?'},
 {q:'Come si genera un\'immagine nuova con un VAE allenato?',
  o:['Si passa un\'immagine all\'encoder','Si estrae \\(\\mathbf z\\) da \\(\\mathcal N(0,I)\\) e lo si passa al decoder','Si sommano due immagini di training','Si allena di nuovo la rete'],a:1,
  ok:'Il termine KL ha spinto i codici dei dati veri a riempire la regione della gaussiana standard: un codice estratto lì cade in una zona che il decoder conosce.',hint:'Quale metà della rete trasforma codici in immagini?'}],
'15a':[{q:'Nell\'esempio dei quattro punti, dopo aver unito A e B, quanto dista il gruppo {A,B} dal punto D con il complete linkage?',
  o:['4','7','8','9'],a:3,
  ok:'Il complete linkage guarda la coppia più lontana: \\(d(A,D)=9\\) e \\(d(B,D)=7\\), quindi 9. Con il single linkage sarebbe 7, con l\'average 8.',hint:'Leggi nella tabella le distanze di A e di B da D, e prendi quella che il criterio richiede.'}],
15:[
 {q:'Quanto vale la distanza di Manhattan fra \\((1,6)\\) e \\((5,1)\\)?',
  o:['4','5','Circa 6,4','9'],a:3,
  ok:'\\(|1-5|+|6-1|=4+5=9\\). La distanza euclidea sarebbe \\(\\sqrt{41}\\approx6{,}4\\), quella di Chebyshev 5.',hint:'Somma le differenze, in valore assoluto, coordinata per coordinata.'},
 {q:'Quale criterio di linkage tende a produrre gruppi lunghi e sottili, a catena?',
  o:['Single linkage','Complete linkage','Average linkage','Tutti allo stesso modo'],a:0,
  ok:'Con il single linkage basta una sola coppia di punti vicini per unire due gruppi: i gruppi si allungano un punto alla volta.',hint:'Quale criterio guarda soltanto la coppia più vicina?'},
 {q:'Perché la distorsione \\(J\\) di k-means non può mai aumentare da un passo al successivo?',
  o:['Perché i centroidi non si muovono','Perché sia l\'assegnazione sia l\'aggiornamento minimizzano \\(J\\) rispetto a una parte delle variabili, tenendo ferma l\'altra','Perché \\(J\\) è convessa','Perché \\(K\\) cresce a ogni passo'],a:1,
  ok:'Assegnare al centroide più vicino è la scelta migliore dei gruppi a centroidi fissi; la media è la scelta migliore dei centroidi a gruppi fissi. Nessuno dei due passi può peggiorare \\(J\\).',hint:'Considera separatamente i due passi: che cosa ottimizza ciascuno?'},
 {q:'Esegui k-means due volte sugli stessi dati con lo stesso \\(K\\) e ottieni due raggruppamenti diversi. Perché?',
  o:['Perché k-means è sbagliato','Perché \\(J\\) ha più minimi locali e l\'arrivo dipende dai centroidi iniziali','Perché i dati sono cambiati','Perché la distanza euclidea non è simmetrica'],a:1,
  ok:'k-means scende sempre, ma si ferma nel minimo locale più vicino al punto di partenza. Per questo lo si ripete e si tiene il risultato con \\(J\\) più bassa.',hint:'Ripensa alla figura con il pulsante «Nuova inizializzazione».'},
 {q:'I dati formano un anello attorno a una nuvola centrale. Che cosa fa k-means con \\(K=2\\)?',
  o:['Separa l\'anello dalla nuvola','Taglia tutto a metà con un confine dritto','Mette tutti i punti in un gruppo','Non converge'],a:1,
  ok:'Il confine fra due centroidi è la retta equidistante da entrambi. Un anello non può stare tutto da una parte di una retta lasciando il centro dall\'altra.',hint:'Che forma ha il confine fra i punti più vicini a un centroide e quelli più vicini all\'altro?'}],
'14a':[{q:'Una nuvola di punti ha varianza totale 5. Lungo la direzione scelta, le proiezioni hanno varianza 4. Quanto vale l\'errore quadratico medio di ricostruzione?',
  o:['0,8','1','4','9'],a:1,
  ok:'Varianza delle proiezioni ed errore sommano sempre alla varianza totale: \\(5-4=1\\). Si è conservato l\'80% della varianza.',hint:'Nella figura qui sopra, che cosa succede alla somma delle due quantità quando ruoti la retta?'}],
14:[
 {q:'Perché, prima di cercare la direzione di massima varianza, si impone che \\(\\mathbf b\\) abbia lunghezza 1?',
  o:['Per rendere \\(S\\) simmetrica','Perché altrimenti basterebbe allungare \\(\\mathbf b\\) per aumentare \\(\\mathbf b^\\top S\\mathbf b\\) senza limite','Perché gli autovalori devono essere positivi','Per centrare i dati'],a:1,
  ok:'\\(\\mathbf b^\\top S\\mathbf b\\) cresce con il quadrato della lunghezza di \\(\\mathbf b\\). Quello che interessa è la direzione, non la lunghezza.',hint:'Che cosa succede a \\(\\mathbf b^\\top S\\mathbf b\\) se raddoppi \\(\\mathbf b\\)?'},
 {q:'La matrice di covarianza di un dataset a due dimensioni ha autovalori 9 e 1. Che quota della varianza conserva la prima componente principale?',
  o:['10%','50%','90%','100%'],a:2,
  ok:'La varianza lungo una componente è il suo autovalore, e la varianza totale è la somma: \\(9/(9+1)=90\\%\\).',hint:'La varianza totale è la somma degli autovalori.'},
 {q:'I dati hanno \\(D=784\\) coordinate e si tengono \\(M=30\\) componenti. Che dimensioni hanno il codice \\(\\mathbf z\\) e la ricostruzione \\(\\tilde{\\Xv}\\)?',
  o:['30 e 30','30 e 784','784 e 30','784 e 784'],a:1,
  ok:'\\(\\mathbf z=B^\\top\\Xv\\) ha un numero per ogni componente tenuta; \\(\\tilde{\\Xv}=B\\mathbf z\\) torna nello spazio di partenza.',hint:'Il codice ha una coordinata per ogni direzione scelta; la ricostruzione vive nello spazio originale.'},
 {q:'Una feature è misurata in grammi e un\'altra in tonnellate. Che cosa succede se si fa la PCA senza standardizzare?',
  o:['Niente: la PCA non dipende dalle unità','La feature in grammi, con numeri molto più grandi, domina la prima componente','La feature in tonnellate domina la prima componente','La PCA non si può calcolare'],a:1,
  ok:'La PCA cerca la varianza più grande, e la varianza dipende dall\'unità di misura. Dividendo ogni feature per la sua deviazione standard le si mette sullo stesso piano.',hint:'Quale delle due features ha i valori numericamente più grandi, e quindi la varianza più grande?'}],
'13a':[{q:'Quattro classi; la rete prevede \\(p=(0{,}1;\\ 0{,}2;\\ 0{,}6;\\ 0{,}1)\\) e la classe vera è la terza. Quanto vale la cross-entropy (logaritmo naturale)?',
  o:['Circa 0,22','Circa 0,51','0,6','Circa 2,30'],a:1,
  ok:'\\(-\\log 0{,}6\\approx0{,}51\\). Le altre tre probabilità non entrano nel conto: conta solo quella data alla classe vera.',hint:'La loss è \\(-\\log p_t\\), dove \\(t\\) è la classe vera.'}],
13:[
 {q:'Perché per classi che si escludono a vicenda si preferisce la softmax a \\(K\\) sigmoidi separate?',
  o:['Perché è più veloce da calcolare','Perché produce probabilità che sommano a 1, facendo competere le classi fra loro','Perché non richiede pesi','Perché evita la backpropagation'],a:1,
  ok:'Con le sigmoidi ogni classe è giudicata da sola e le uscite possono sommare a più o a meno di 1. La softmax divide ogni esponenziale per la somma di tutti.',hint:'Ripensa alla somma delle tre uscite nelle due versioni della prima figura.'},
 {q:'Tre classi, \\(p=(0{,}7;\\ 0{,}2;\\ 0{,}1)\\), classe vera la seconda. Quanto vale \\(\\partial\\cL/\\partial a_k\\) per le tre classi?',
  o:['\\((0{,}7;\\ 0{,}2;\\ 0{,}1)\\)','\\((0{,}7;\\ -0{,}8;\\ 0{,}1)\\)','\\((-0{,}3;\\ 0{,}2;\\ 0{,}1)\\)','\\((0;\\ -1;\\ 0)\\)'],a:1,
  ok:'\\(p-\\Yv=(0{,}7-0;\\ 0{,}2-1;\\ 0{,}1-0)\\). Il punteggio della classe vera sale, gli altri scendono, il primo più del terzo.',hint:'Sottrai il vettore one-hot \\((0,1,0)\\) dalle probabilità.'},
 {q:'Nella regola \\(\\Ws_{kj}\\leftarrow\\Ws_{kj}-\\Et(p_k-\\Yy_k)z_j\\), che cosa succede ai pesi che partono da un\'unità nascosta con \\(z_j=0\\)?',
  o:['Crescono tutti','Calano tutti','Non cambiano','Vengono azzerati'],a:2,
  ok:'La variazione è proporzionale a \\(z_j\\): un\'unità spenta non ha contribuito al punteggio, quindi i suoi pesi in uscita non vengono corretti per questo esempio.',hint:'Guarda che cosa moltiplica l\'errore nella formula.'},
 {q:'La classe vera ha ricevuto probabilità \\(p_t=0{,}99\\). Come sarà l\'aggiornamento dei pesi dell\'ultimo strato?',
  o:['Grande, perché la rete è molto sicura','Quasi nullo, perché \\(p-\\Yv\\) è quasi zero per tutte le classi','Nullo solo per la classe vera','Negativo per tutti i pesi'],a:1,
  ok:'Per la classe vera \\(p_t-1=-0{,}01\\); le altre classi si dividono lo \\(0{,}01\\) rimasto. Quando la previsione è già giusta c\'è poco da correggere.',hint:'Quanto vale \\(p_k-\\Yy_k\\) per la classe vera? E quanta probabilità resta per le altre?'}],
'12a':[{q:'Una rete ha tre strati nascosti, tutti con attivazione lineare \\(y=z\\). Che cosa può rappresentare?',
  o:['Qualunque funzione continua','Solo funzioni lineari dell\'input, come un singolo strato','Solo lo XOR','Funzioni a gradini'],a:1,
  ok:'Il prodotto di più matrici è una matrice: \\(W^{(3)}W^{(2)}W^{(1)}\\Xv=W\'\\Xv\\). Senza una non linearità fra gli strati, la profondità non aggiunge nulla.',hint:'Che cosa si ottiene moltiplicando fra loro le matrici dei tre strati?'}],
12:[
 {q:'Nella rete dello XOR vista all\'inizio, che cosa calcola l\'unità nascosta \\(h_2\\), con pesi \\((1,1)\\) e bias \\(-1{,}5\\)?',
  o:['1 se almeno un input vale 1','1 solo se entrambi gli input valgono 1','1 se gli input sono diversi','Sempre 0'],a:1,
  ok:'La somma \\(\\Xs_1+\\Xs_2-1{,}5\\) è positiva solo quando \\(\\Xs_1=\\Xs_2=1\\). È un AND; \\(h_1\\), con bias \\(-0{,}5\\), è un OR.',hint:'Prova i quattro input e guarda quando \\(\\Xs_1+\\Xs_2-1{,}5\\) supera lo zero.'},
 {q:'Uno strato fully connected ha 5 input e 3 unità. Quanti parametri ha, contando i bias?',
  o:['8','15','18','20'],a:2,
  ok:'La matrice dei pesi è \\(3\\times5=15\\), più un bias per ciascuna delle 3 unità: 18.',hint:'Ogni unità ha un peso per ogni input, più un bias.'},
 {q:'Che cosa garantisce il teorema di approssimazione universale?',
  o:['Che il gradient descent trova sempre i pesi migliori','Che esiste una rete con uno strato nascosto abbastanza grande capace di approssimare una funzione continua quanto si vuole','Che bastano poche unità nascoste','Che il costo di una rete è convesso'],a:1,
  ok:'È un risultato di esistenza: non dice quante unità servono, né come trovare i pesi.',hint:'Il teorema parla di ciò che una rete può rappresentare, non di come la si allena.'},
 {q:'Nella backpropagation, quanto vale la derivata della loss rispetto al peso \\(\\Ws_{ji}^{(l)}\\)?',
  o:['\\(\\delta_j^{(l)}\\,z_i^{(l-1)}\\): l\'errore dell\'unità di arrivo per l\'output dell\'unità di partenza','\\(\\delta_i^{(l-1)}\\,z_j^{(l)}\\)','\\(\\sigma\'(a_j^{(l)})\\)','\\(\\Ws_{ji}^{(l)}\\,\\delta_j^{(l)}\\)'],a:0,
  ok:'Il peso entra nella loss solo attraverso \\(a_j^{(l)}=\\sum_i\\Ws_{ji}^{(l)}z_i^{(l-1)}\\): la derivata di \\(a_j^{(l)}\\) rispetto al peso è \\(z_i^{(l-1)}\\), e quella della loss rispetto ad \\(a_j^{(l)}\\) è \\(\\delta_j^{(l)}\\).',hint:'Nell\'esempio numerico: \\(\\delta\\) del nodo di arrivo per il valore del nodo di partenza.'},
 {q:'Durante l\'allenamento l\'errore di training continua a scendere, mentre quello di validation ha iniziato a salire. Che cosa conviene fare?',
  o:['Continuare: prima o poi scenderà anche quello di validation','Fermarsi e tenere i pesi del momento in cui l\'errore di validation era minimo','Aumentare lo step size','Togliere il validation set'],a:1,
  ok:'È l\'early stopping. Da quel punto in poi la rete sta imparando il rumore del training set.',hint:'Quale dei due errori dice come andrà la rete su dati nuovi?'}],
'11a':[{q:'Hai 100 punti di training, 60 arance e 40 limoni, e scegli \\(\\Kk=100\\). Che cosa prevede k-NN per un frutto nuovo?',
  o:['Dipende da dove si trova il frutto','Sempre «arancia»','Sempre «limone»','Non può decidere'],a:1,
  ok:'I 100 vicini sono tutti i dati, ovunque si trovi il punto: vince sempre la classe più numerosa. È il caso estremo di un \\(\\Kk\\) troppo grande.',hint:'Quali punti finiscono fra i 100 più vicini, se i dati sono 100 in tutto?'}],
'11b':[{q:'I pesi sono \\((\\Ws_0;\\Ws_1;\\Ws_2)=(0;\\,1;\\,0{,}5)\\) e \\(\\Et=0{,}2\\). Arriva il punto \\((\\Xs_1,\\Xs_2)=(2,-2)\\) di classe \\(-1\\). Che cosa succede?',
  o:['È classificato bene: i pesi restano uguali','È sbagliato: i nuovi pesi sono \\((-0{,}2;\\,0{,}6;\\,0{,}9)\\)','È sbagliato: i nuovi pesi sono \\((0{,}2;\\,1{,}4;\\,0{,}1)\\)','È sbagliato: i nuovi pesi sono \\((0;\\,-1;\\,-0{,}5)\\)'],a:1,
  ok:'Il punteggio è \\(0+1\\cdot2+0{,}5\\cdot(-2)=1\\gt 0\\): previsto \\(+1\\), ma la classe è \\(-1\\). Si sottrae \\(0{,}2\\cdot(1;\\,2;\\,-2)\\): \\((0-0{,}2;\\ 1-0{,}4;\\ 0{,}5+0{,}4)\\).',hint:'Calcola prima il punteggio \\(\\Ws_0+\\Ws_1\\Xs_1+\\Ws_2\\Xs_2\\). Se il segno è sbagliato, somma \\(\\Et\\Yy\\Xv\\) con \\(\\Xv=(1;\\,2;\\,-2)\\).'}],
11:[
 {q:'Perché con \\(\\Kk=1\\) l\'errore di training di k-NN è sempre zero?',
  o:['Perché il modello è lineare','Perché il vicino più prossimo di ogni punto di training è il punto stesso','Perché i dati sono separabili','Perché non ci sono iperparametri'],a:1,
  ok:'Ogni punto di training si trova a distanza zero da se stesso, quindi si «vota» da solo. Per questo l\'errore di training non dice nulla sulla scelta di \\(\\Kk\\).',hint:'Chi è il punto più vicino a un punto che fa già parte dei dati?'},
 {q:'Perché k-NN funziona male quando le features sono centinaia?',
  o:['Perché non può essere calcolato','Perché tutti i punti finiscono quasi alla stessa distanza, e «il più vicino» perde significato','Perché il confine diventa una retta','Perché servono etichette numeriche'],a:1,
  ok:'In molte dimensioni le distanze si concentrano: il punto più vicino è poco più vicino del più lontano, e somigliare al più vicino non è più un\'informazione.',hint:'Ripensa al rapporto fra la distanza del più vicino e quella del più lontano.'},
 {q:'Un perceptron ha pesi \\(\\Wv=(2,-1)\\) e bias \\(\\Bi=-1\\), con funzione a gradino. Che output dà per \\(\\Xv=(1,2)\\)?',
  o:['1, perché la somma è positiva','0, perché la somma è \\(2-2-1=-1\\)','0, perché la somma è zero','Non si può dire senza il learning rate'],a:1,
  ok:'\\(a=2\\cdot1+(-1)\\cdot2-1=-1\\), che non supera lo zero: il neurone resta spento.',hint:'Calcola \\(a=\\Ws_1\\Xs_1+\\Ws_2\\Xs_2+\\Bi\\) e guarda il segno.'},
 {q:'I punti stanno entro distanza \\(R=4\\) dall\'origine e sono separabili con margine \\(\\Gk=0{,}5\\). Quanti errori può commettere al massimo il perceptron?',
  o:['8','16','64','Dipende dal numero di punti'],a:2,
  ok:'\\(R^2/\\Gk^2=16/0{,}25=64\\). Il numero di punti non compare nel limite.',hint:'Il limite è \\(R^2/\\Gk^2\\).'},
 {q:'Che cosa succede se si allena un perceptron sui quattro punti dello XOR?',
  o:['Converge dopo quattro errori','Converge, ma lentamente','Non si ferma mai: nessuna retta li classifica tutti','Trova una retta che ne classifica bene quattro su quattro'],a:2,
  ok:'Lo XOR non è linearmente separabile: qualunque retta sbaglia almeno un punto, quindi c\'è sempre un errore da correggere e i pesi continuano a cambiare.',hint:'La garanzia di convergenza vale solo per dati linearmente separabili.'}],
'10a':[{q:'Lanci due monete equilibrate ed escono due teste, un evento con probabilità ¼. Quanti bit di informazione porta?',
  o:['¼ di bit','1 bit','2 bit','4 bit'],a:2,
  ok:'\\(\\log_2\\frac{1}{1/4}=2\\). È la somma di un bit per ciascuna moneta: per eventi indipendenti le probabilità si moltiplicano e i bit si sommano.',hint:'Ogni moneta, da sola, porta un bit. Che cosa succede ai bit di due eventi indipendenti?'}],
'10b':[{q:'Hai 20 email normali e 10 di spam. Una domanda le divide in due gruppi: 12 normali e 6 spam da una parte, 8 normali e 4 spam dall\'altra. Quanto vale l\'information gain?',
  o:['Zero','Circa 0,33 bit','Circa 0,92 bit','1 bit'],a:0,
  ok:'In entrambi i gruppi lo spam è un terzo, esattamente come prima di dividere. L\'entropia di ogni gruppo è uguale a quella di partenza, quindi la domanda non ha ridotto l\'incertezza.',hint:'Confronta la quota di spam nei due gruppi con la quota di spam all\'inizio.'}],
10:[
 {q:'Quale di questi eventi ha il contenuto informativo più alto?',
  o:['Un evento con probabilità 1','Un evento con probabilità ½','Un evento con probabilità 1/8','Un evento con probabilità 0,9'],a:2,
  ok:'\\(\\log_2 8=3\\) bit. Meno un evento è probabile, più bit porta: quello certo ne porta zero.',hint:'Il contenuto informativo è \\(\\log_2(1/P)\\): cresce quando \\(P\\) scende.'},
 {q:'Un nodo contiene 8 punti: 4 di una classe e 4 dell\'altra. Quanto vale la sua entropia?',
  o:['0 bit','0,5 bit','1 bit','4 bit'],a:2,
  ok:'Con due classi equiprobabili \\(H=\\tfrac12\\log_22+\\tfrac12\\log_22=1\\) bit: è il nodo più mescolato possibile.',hint:'È la stessa situazione di una moneta equilibrata.'},
 {q:'Una divisione manda 4 punti su 6 in un gruppo puro (entropia 0) e 2 in un gruppo metà e metà (entropia 1). Quanto vale l\'entropia condizionata?',
  o:['0','Circa 0,33 bit','0,5 bit','1 bit'],a:1,
  ok:'\\(\\tfrac46\\cdot0+\\tfrac26\\cdot1\\approx0{,}33\\). Ogni gruppo pesa in proporzione a quanti punti contiene.',hint:'Fai la media delle due entropie, pesando ciascuna per la quota di punti del suo gruppo.'},
 {q:'Lasci crescere un albero finché ogni foglia contiene un solo punto di training. Che cosa ti aspetti?',
  o:['Errore di training e di test entrambi a zero','Errore di training zero, errore di test più alto che con un albero meno profondo','Errore di training alto, errore di test basso','L\'albero smette di essere un classificatore'],a:1,
  ok:'L\'albero ha imparato a memoria anche i punti rumorosi. Sul training è perfetto, ma su dati nuovi i rettangoli costruiti attorno al rumore sbagliano.',hint:'Ripensa alla figura con le due curve di errore al crescere della profondità.'},
 {q:'Perché in una random forest ogni albero viene allenato su un campione diverso e con features estratte a caso?',
  o:['Per rendere ogni albero più accurato','Per rendere gli alberi diversi fra loro: la media riduce la varianza solo se gli errori non sono tutti uguali','Per ridurre la profondità degli alberi','Per poter usare features categoriche'],a:1,
  ok:'Se tutti gli alberi fossero uguali, il voto darebbe lo stesso risultato di un albero solo. La varianza della media scende come \\(\\sigma^2/n\\) solo se le previsioni sono poco correlate.',hint:'Che cosa succederebbe al voto se i sessanta alberi fossero identici?'}],
'9a':[{q:'Con due features, \\(\\Xv=(1,2)\\) e \\(\\Xv\'=(3,1)\\). Quanto vale il kernel \\(\\Ka(\\Xv,\\Xv\')=(\\Xv^\\top\\Xv\')^2\\)?',
  o:['5','10','25','50'],a:2,
  ok:'\\(\\Xv^\\top\\Xv\'=1\\cdot3+2\\cdot1=5\\), e \\(5^2=25\\). Nessuna feature al quadrato è stata calcolata.',hint:'Prima il prodotto scalare, poi il quadrato.'}],
9:[
 {q:'Nella soluzione duale di una SVM, un dato ha \\(\\Al_i=0\\). Che cosa significa?',
  o:['Che è classificato male','Che sta esattamente sul bordo della strada','Che sta oltre il margine dalla parte giusta e non influenza il confine','Che è un outlier'],a:2,
  ok:'I pesi sono \\(\\sum_i\\Al_i\\Yy_i\\Xv_i\\): un dato con \\(\\Al_i=0\\) non contribuisce, e si potrebbe togliere senza cambiare la soluzione.',hint:'Guarda la formula che ricostruisce \\(\\Wv^*\\) dagli \\(\\Al_i\\).'},
 {q:'Devi risolvere una ridge regression con \\(N=100\\) dati e \\(d=1\\,000\\,000\\) features. Quale formula conviene?',
  o:['Quella nei pesi: inverte una matrice \\(d\\times d\\)','Quella nei dati: inverte una matrice \\(N\\times N\\)','Sono equivalenti anche come costo','Nessuna: serve il gradient descent'],a:1,
  ok:'Invertire una matrice \\(100\\times100\\) è immediato; una \\(10^6\\times10^6\\) è fuori portata. Il costo della forma nei dati cresce con \\(N\\), non con \\(d\\).',hint:'Confronta le dimensioni delle due matrici da invertire.'},
 {q:'Perché si può sostituire il prodotto scalare con un kernel senza cambiare l\'algoritmo?',
  o:['Perché il kernel è sempre più veloce','Perché nella forma duale i dati compaiono solo attraverso prodotti scalari fra coppie di punti','Perché il kernel rende i dati separabili','Perché il kernel elimina gli iperparametri'],a:1,
  ok:'Sia il problema duale sia la previsione usano i dati solo dentro \\(\\Xv_i^\\top\\Xv_j\\). Mettere al loro posto \\(\\Ka(\\Xv_i,\\Xv_j)\\) equivale a lavorare nello spazio delle features \\(\\Ph\\).',hint:'In quale forma compaiono i dati nel problema duale?'},
 {q:'In una SVM con kernel RBF aumenti molto \\(\\Gk\\). Che cosa ti aspetti?',
  o:['Il confine diventa una retta','Il confine si stringe attorno ai singoli punti di training: rischio di overfitting','Il numero di vettori di supporto scende a due','L\'errore di training sale'],a:1,
  ok:'Con \\(\\Gk\\) grande la somiglianza crolla appena ci si allontana: ogni punto influenza solo il suo immediato intorno e il modello impara a memoria.',hint:'Ripensa alla matrice kernel con \\(\\Gk\\) grande: a chi somiglia ogni punto?'},
 {q:'Quali proprietà deve avere una funzione per essere un kernel valido (condizioni di Mercer)?',
  o:['Essere sempre positiva','Essere simmetrica e dare matrici kernel semidefinite positive','Essere derivabile','Valere 1 quando i due punti coincidono'],a:1,
  ok:'Sono le proprietà di ogni prodotto scalare. Un kernel può anche assumere valori negativi (quello lineare lo fa), e non deve valere 1 sulla diagonale.',hint:'Sono due condizioni: una sullo scambio dei due argomenti, una sulla somma \\(\\sum_{i,j}c_ic_j\\Ka(\\Xv_i,\\Xv_j)\\).'}],
'8a':[{q:'Una SVM ha \\(\\Wv=(2,-1)\\) e \\(\\Bi=1\\). Dove si trova il punto \\((0,2)\\)?',
  o:['Sul confine','Esattamente sul bordo della strada, dal lato della classe −1','Dentro la strada','Oltre la strada, dal lato della classe +1'],a:1,
  ok:'Il punteggio è \\(2\\cdot0-1\\cdot2+1=-1\\): proprio il valore dei punti sul bordo, dal lato −1. Per confronto, \\((2,1)\\) ha punteggio \\(4-1+1=4\\): classe +1, ben oltre la strada.',hint:'Calcola \\(\\Wv^\\top\\Xv+\\Bi\\). I bordi della strada sono i punti con punteggio \\(+1\\) e \\(-1\\).'}],
8:[
 {q:'Nella SVM a margine rigido, quanto è larga la strada?',
  o:['\\(\\lVert\\Wv\\rVert\\)','\\(1/\\lVert\\Wv\\rVert\\)','\\(2/\\lVert\\Wv\\rVert\\)','\\(2\\lVert\\Wv\\rVert\\)'],a:2,
  ok:'I bordi sono a punteggio \\(\\pm1\\), cioè a distanza \\(1/\\lVert\\Wv\\rVert\\) dal confine, uno per parte. Per questo minimizzare \\(\\lVert\\Wv\\rVert\\) allarga la strada.',hint:'La distanza è il punteggio diviso per \\(\\lVert\\Wv\\rVert\\). Che punteggio hanno i due bordi?'},
 {q:'Togli dal dataset un punto che non è un vettore di supporto e alleni di nuovo la SVM. Che cosa cambia?',
  o:['Il confine ruota leggermente','La strada si allarga','Niente: la soluzione dipende solo dai vettori di supporto','Il problema diventa non separabile'],a:2,
  ok:'Quel punto rispettava il suo vincolo con spazio in più: non stava «spingendo» contro la strada, quindi toglierlo non libera nulla.',hint:'Nella figura con i punti trascinabili, che cosa succedeva muovendo un punto lontano dalla strada?'},
 {q:'Nel margine morbido un punto ha slack \\(\\Sl_i=1{,}4\\). Dove si trova?',
  o:['Fuori dalla strada, dalla parte giusta','Sul bordo della strada','Dentro la strada, ma dalla parte giusta del confine','Dalla parte sbagliata del confine'],a:3,
  ok:'\\(\\Sl_i=1-\\Yy_i(\\Wv^\\top\\Xv_i+\\Bi)\\gt 1\\) significa che etichetta × punteggio è negativo: il punto è classificato male.',hint:'Lo slack è \\(1-m\\), dove \\(m\\) è etichetta × punteggio. Che segno ha \\(m\\) se lo slack supera 1?'},
 {q:'Aumenti \\(\\Rl\\) nella SVM a margine morbido. Che cosa succede?',
  o:['La strada si stringe e le violazioni diminuiscono','La strada si allarga e le violazioni aumentano','Il confine smette di essere una retta','Niente, se i dati sono separabili'],a:1,
  ok:'\\(\\Rl\\) pesa il termine \\(\\lVert\\Wv\\rVert^2\\): più è grande, più conviene avere pesi piccoli, cioè una strada larga, accettando più punti al suo interno.',hint:'Quale dei due termini della funzione da minimizzare diventa più importante?'}],
'7a':[{q:'Un modello ha \\(\\Wv=(2,-1)\\) e \\(\\Ws_0=-1\\). Che probabilità assegna alla classe 1 per il punto \\(\\Xv=(1,1)\\)?',
  o:['0','Circa 0,27','0,5','Circa 0,73'],a:2,
  ok:'Il punteggio è \\(2\\cdot1-1\\cdot1-1=0\\), e \\(\\sigma(0)=\\tfrac12\\): il punto sta esattamente sul confine.',hint:'Calcola prima il punteggio \\(\\Wv^\\top\\Xv+\\Ws_0\\), poi ricorda quanto vale la sigmoide in quel valore.'}],
'7b':[{q:'Su 100 clienti un modello ottiene TP = 8, FN = 2, FP = 12, TN = 78. Quanto vale la recall?',
  o:['10%','40%','80%','86%'],a:2,
  ok:'Gli insolventi veri sono \\(TP+FN=10\\), e il modello ne ha trovati 8: recall 80%. Il 40% è la precision (8 allarmi giusti su 20), l\'86% è l\'accuratezza.',hint:'La recall guarda solo i positivi veri: quanti sono in tutto, e quanti ne ha trovati il modello?'}],
7:[
 {q:'Perché i minimi quadrati sono una cattiva scelta per classificare?',
  o:['Perché non hanno una formula chiusa','Perché la loss quadratica punisce anche le previsioni molto oltre la risposta giusta, e punti facili spostano il confine','Perché funzionano solo con una feature','Perché il gradiente è sempre zero'],a:1,
  ok:'Per la loss quadratica prevedere 3 quando la risposta è 1 è un errore grave. Così punti lontani e ovvi tirano la retta e spostano la soglia.',hint:'Ripensa a che cosa succedeva aggiungendo i clienti con saldo altissimo.'},
 {q:'Perché non si minimizza direttamente il numero di errori (loss 0-1)?',
  o:['Perché è una funzione a gradini: il gradiente è zero quasi ovunque e non indica una direzione','Perché è sempre uguale a zero','Perché non è definita per due classi','Perché dà troppo peso agli outlier'],a:0,
  ok:'Spostando di poco i pesi il numero di errori non cambia. Senza pendenza il gradient descent non può muoversi.',hint:'Che forma aveva la curva degli errori al variare della soglia?'},
 {q:'Alleni una regressione logistica senza multa su dati perfettamente separabili. Che cosa succede ai pesi?',
  o:['Convergono a zero','Convergono a un valore finito','Continuano a crescere: la log loss scende sempre senza mai raggiungere un minimo','Oscillano'],a:2,
  ok:'Ingrandire i pesi rende la sigmoide più ripida e ogni probabilità più vicina alla risposta giusta. Serve una multa sui pesi per fermarli.',hint:'Se nessun punto è dalla parte sbagliata, che effetto ha raddoppiare tutti i pesi?'},
 {q:'Abbassi la soglia \\(t\\) da 0,5 a 0,2. Che cosa ti aspetti?',
  o:['Recall e precision salgono entrambe','La recall sale, la precision tende a scendere','La recall scende, la precision sale','Non cambia nulla: il confine è lo stesso'],a:1,
  ok:'Più clienti vengono segnalati: si trovano più insolventi veri (recall più alta), ma fra i segnalati aumentano i falsi allarmi (precision più bassa).',hint:'Con una soglia più bassa i clienti segnalati aumentano o diminuiscono?'},
 {q:'Un modello ha AUC = 0,5. Che cosa significa?',
  o:['Che sbaglia metà dei positivi','Che i suoi punteggi non distinguono le classi meglio del caso','Che è il modello perfetto','Che la soglia migliore è 0,5'],a:1,
  ok:'La curva ROC coincide con la diagonale: un positivo ha la stessa probabilità di un negativo di ricevere il punteggio più alto.',hint:'A quale curva della figura ROC corrisponde un\'area di 0,5?'}],
'6a':[{q:'Guarda il grafico qui sopra. Perché, a destra, l\'errore di test torna a salire?',
  o:['Perché la varianza esplode','Perché i pesi sono così schiacciati che il modello non segue più la funzione vera: cresce il bias','Perché aumenta l\'errore irriducibile','Perché il polinomio cambia grado'],a:1,
  ok:'Con \\(\\Rl\\) enorme la curva diventa quasi una retta orizzontale: stabile (varianza bassa) ma lontana dalla verità (bias alto). È underfitting.',hint:'Segui le due curve sottili: a destra, quale delle due sale?'}],
6:[
 {q:'Perché nella multa di ridge non compare l\'intercetta \\(\\Ws_0\\)?',
  o:['Perché è sempre zero','Perché sposta la curva in alto o in basso senza renderla più complessa','Perché non si può derivare','Perché renderebbe il problema non convesso'],a:1,
  ok:'L\'intercetta fissa solo il livello medio delle previsioni. Penalizzarla costringerebbe il modello verso lo zero senza alcun guadagno in semplicità.',hint:'Che cosa cambia nella forma della curva se aumenti solo \\(\\Ws_0\\)?'},
 {q:'Due features del dataset sono identiche. Che cosa succede con i minimi quadrati e con ridge?',
  o:['Entrambi hanno un\'unica soluzione','Minimi quadrati: infinite soluzioni; ridge: una sola','Minimi quadrati: una sola soluzione; ridge: infinite','Nessuno dei due ha soluzione'],a:1,
  ok:'Senza multa il costo ha un canale piatto di minimi. Il termine \\(\\Rl\\lVert\\Wv\\rVert_2^2\\) lo trasforma in una conca: fra tutte le soluzioni equivalenti resta quella con i pesi più piccoli.',hint:'Ripensa alla figura del canale e della conca.'},
 {q:'Hai 200 features e sospetti che ne servano una decina. Vuoi che sia il modello a dirti quali. Che cosa usi?',
  o:['Minimi quadrati','Ridge','Lasso','Ridge con \\(\\Rl\\) molto grande'],a:2,
  ok:'Il lasso azzera esattamente i pesi delle features che non servono: quelle che restano con peso diverso da zero sono la selezione. Ridge le terrebbe tutte, con pesi piccoli.',hint:'Quale dei due metodi produce pesi esattamente nulli?'},
 {q:'Un solo peso: senza multa il valore migliore è \\(a=0{,}5\\) e il costo è \\(\\tfrac12(\\Ws-a)^2\\). Con la multa del lasso e \\(\\Rl=1\\), dove sta il minimo?',
  o:['In \\(\\Ws=0{,}5\\)','In \\(\\Ws\\approx0{,}17\\)','In \\(\\Ws=0\\)','In \\(\\Ws=-0{,}5\\)'],a:2,
  ok:'Il lasso toglie \\(\\Rl\\) al valore assoluto del peso e, se non basta, azzera: \\(0{,}5-1\\lt 0\\), quindi \\(\\Ws=0\\). Con ridge sarebbe \\(0{,}5/(1+2)\\approx0{,}17\\).',hint:'Prova nella figura dei due pannelli: \\(a=0{,}5\\) e \\(\\Rl=1\\).'}],
'5a':[{q:'Un test set di 1000 punti, una loss con valori fra 0 e 1, e \\(\\delta=0{,}05\\). Di quanto può distare, al più, l\'errore di test dal rischio vero?',
  o:['Circa 0,004','Circa 0,043','Circa 0,14','Circa 0,43'],a:1,
  ok:'\\(\\sqrt{\\log(2/0{,}05)/(2\\cdot1000)}=\\sqrt{3{,}69/2000}\\approx0{,}043\\). Con probabilità 95% l\'errore vero sta entro 4,3 punti percentuali da quello misurato.',hint:'Sostituisci nella formula: \\((b-a)^2=1\\), \\(\\log(2/\\delta)=\\log 40\\approx3{,}69\\), e \\(2N_{te}=2000\\).'}],
'5b':[{q:'Hai 100 dati e 8 modelli candidati. Quanti training richiede in tutto la leave-one-out?',
  o:['8','100','108','800'],a:3,
  ok:'Ogni modello va allenato una volta per ogni punto lasciato fuori: 100 training per modello, per 8 modelli.',hint:'Quanti giri fa la leave-one-out per un singolo modello? E quanti modelli ci sono?'}],
5:[
 {q:'Perché l\'errore di training non è una buona stima dell\'errore su dati nuovi?',
  o:['Perché è calcolato su troppo pochi dati','Perché gli stessi dati sono usati sia per costruire il modello sia per giudicarlo','Perché usa la loss sbagliata','Perché dipende dal grado del polinomio'],a:1,
  ok:'Il modello è stato scelto proprio per andare bene su quei dati: la stima è ottimistica, tanto più quanto più il modello è flessibile.',hint:'Pensa al compito corretto conoscendo già le risposte.'},
 {q:'Passi da un test set di 500 punti a uno di 2000. Come cambia la larghezza della fascia di Hoeffding?',
  o:['Resta uguale','Si dimezza','Diventa un quarto','Raddoppia'],a:1,
  ok:'La larghezza va come \\(1/\\sqrt{N_{te}}\\): con quattro volte i dati si dimezza.',hint:'Guarda dove compare \\(N_{te}\\) nella formula, e sotto quale segno.'},
 {q:'Rispetto a un solo hold-out, la 5-fold cross-validation:',
  o:['Costa meno tempo e dà una stima più stabile','Costa più tempo e dà una stima più stabile','Costa più tempo e dà una stima meno stabile','Usa meno dati per il training in ogni giro'],a:1,
  ok:'Ogni modello va allenato cinque volte, ma la media su cinque suddivisioni dipende meno dal caso.',hint:'Quante volte viene allenato ogni modello? E che cosa succede facendo la media di più stime?'},
 {q:'In un dataset il 3% degli esempi è della classe positiva. Quale accorgimento serve nella cross-validation?',
  o:['Usare la leave-one-out','Usare fold stratificati, che conservano le proporzioni delle classi','Usare un solo fold molto grande','Nessuno: la divisione casuale basta sempre'],a:1,
  ok:'Con una divisione casuale alcuni fold potrebbero restare quasi senza positivi; la stratificazione garantisce che ogni fold rispecchi il dataset.',hint:'Che cosa può succedere a un fold se i positivi sono pochissimi e li si distribuisce a caso?'}],
'1a':[{q:'Vuoi prevedere il reddito di una persona dagli anni di istruzione. Che problema è?',
  o:['Classificazione','Regressione','Stima di probabilità','Unsupervised learning'],a:1,
  ok:'Il reddito è un output continuo. Prevedere se la persona restituirà un prestito (sì o no) sarebbe classificazione; prevedere la probabilità che lo restituisca, stima di probabilità.',hint:'Chiediti che tipo di valore è il reddito: una categoria, un numero qualsiasi o una probabilità?'}],
'3a':[{q:'Nella figura qui sopra, prendi il punto più a destra e trascinalo molto in alto. Che cosa succede alla retta?',
  o:['Quasi niente: è un punto su quattordici','Si sposta tutta verso l\'alto, restando parallela a se stessa','Ruota verso quel punto, anche se gli altri tredici non si sono mossi','Smette di passare per il punto delle medie'],a:2,
  ok:'L\'errore è elevato al quadrato, quindi un punto lontano pesa moltissimo: è lo stesso effetto dell\'outlier della lezione 2. In più quel punto è lontano da \\(\\bar{\\Xs}\\), il suo rettangolo è grande e ha molta «leva» sulla pendenza.',hint:'Provalo nella figura, e guarda quanto è grande il rettangolo di quel punto rispetto agli altri.'}],
'4a':[{q:'Nella figura, lascia il grado 1 e porta i punti di training al massimo; poi azzera il rumore. La retta migliora?',
  o:['Sì: con abbastanza dati qualunque modello arriva alla verità','Sì, ma solo togliendo il rumore','No: sbaglia su training e test, con qualunque quantità di dati','No sul training, sì sul test'],a:2,
  ok:'La vera funzione è una parabola e una retta non può rappresentarla. È underfitting, e non si cura raccogliendo più dati né togliendo il rumore.',hint:'Fai la prova e guarda i due errori: scendono verso \\(\\Sg^2\\) o restano alti?'}],
'4b':[{q:'Ora riporta i punti a 10 e il rumore al valore iniziale, scegli il grado 5 e premi più volte «Nuovo dataset». Poi aumenta i punti. Che cosa osservi?',
  o:['La curva è sempre la stessa: il grado 5 è stabile','Con pochi punti la curva cambia forma a ogni dataset; con molti diventa liscia e si avvicina alla parabola','Con molti punti la curva oscilla sempre di più','L\'errore di test è sempre più basso di quello di training'],a:1,
  ok:'Con pochi punti il modello passa vicinissimo ai dati di training ma oscilla fra l\'uno e l\'altro, e cambia a ogni campione: errore di training basso, errore di test alto. È overfitting. Con molti punti la curva si assesta sulla parabola.',hint:'Guarda la forma della curva gialla mentre premi «Nuovo dataset» con 10 punti, poi con 300.'}],
1:[
 {q:'Vuoi prevedere la specie di un fiore di iris a partire da quattro misure in centimetri. Che tipo di problema è?',
  o:['Regressione','Classificazione','Unsupervised learning','Reinforcement learning'],a:1,
  ok:'L\'output è una categoria (una di tre specie), quindi è classificazione; e ci sono le etichette, quindi è supervised.',hint:'Guarda che tipo di valore ha l\'output, e se nei dati di training è presente.'},
 {q:'Un modello ha errore di training quasi nullo ed errore di validazione alto. Che cosa sta succedendo?',
  o:['Underfitting: il modello è troppo rigido','Overfitting: il modello è troppo sensibile a pattern spuri del training','L\'errore irriducibile è molto alto','Il validation set è troppo grande'],a:1,
  ok:'Training basso e validazione alta è la firma dell\'overfitting: il modello ha imparato anche il rumore dei dati di training.',hint:'Se fosse un modello troppo rigido, come sarebbe l\'errore di training?'},
 {q:'A che cosa serve il validation set?',
  o:['A imparare i pesi del modello','A scegliere fra modelli o iperparametri diversi','A dare la valutazione finale del modello scelto','A stimare la varianza del rumore'],a:1,
  ok:'I pesi si imparano sul training set; il validation set serve a scegliere modello e iperparametri; la valutazione finale si fa sul test set.',hint:'Ripensa ai tre errori: ognuno ha un compito diverso.'},
 {q:'Con \\(\\Kk=1\\), qual è l\'errore di training di k-NN?',
  o:['Zero: ogni punto di training è il più vicino a se stesso','Uguale all\'errore di test','Il massimo possibile','Dipende dalla normalizzazione delle features'],a:0,
  ok:'Ogni punto di training ha distanza zero da se stesso e quindi copia la propria etichetta. Accuratezza perfetta sul training, ma generalizzazione scarsa.',hint:'Chiediti chi è il punto di training più vicino a un punto di training.'}],
2:[
 {q:'I dati sono 1, 2, 3, 4 e 20, e il modello prevede una costante \\(\\Ws\\). Quale valore minimizza l\'MSE?',
  o:['3','6','20','2,5'],a:1,
  ok:'L\'MSE di un modello costante è minimo nella media: (1+2+3+4+20)/5 = 6. Il valore 3, la mediana, minimizza invece il MAE.',hint:'Nella prima figura, dove finiva il minimo dopo aver aggiunto il quinto dato?'},
 {q:'\\(\\cL\\) è convessa e derivabile, e hai trovato un punto in cui \\(\\Gr\\cL(\\Wv)=0\\). Che cosa puoi concludere?',
  o:['È un minimo locale, ma potrebbe non essere globale','È un minimo globale','Potrebbe essere un punto di sella','Nulla, senza guardare le derivate seconde'],a:1,
  ok:'Per una funzione convessa e derivabile, gradiente nullo equivale a minimo globale. È il motivo per cui la convessità è così comoda.',hint:'Che cosa cambia, per i punti stazionari, quando la funzione è convessa?'},
 {q:'\\(\\cL(\\Wv)=\\tfrac12\\Wv^\\top A\\Wv\\) con autovalori di \\(A\\) pari a 1 e 50. Per quali step size costanti il gradient descent converge?',
  o:['\\(\\Et<2\\)','\\(\\Et<2/50\\)','\\(\\Et<1/2\\)','Per qualunque \\(\\Et>0\\)'],a:1,
  ok:'Serve \\(|1-\\Et\\lambda_i|<1\\) per ogni autovalore, cioè \\(\\Et<2/\\lambda_{\\max}=2/50\\). Comanda la direzione più ripida.',hint:'Lo step deve andare bene per tutte le direzioni contemporaneamente: quale è la più esigente?'},
 {q:'Perché SGD funziona, pur usando un solo esempio per passo?',
  o:['Perché ogni passo fa comunque diminuire il costo','Perché il gradiente stocastico è, in media, uguale a quello vero','Perché rende convessa la funzione di costo','Perché non ha bisogno di uno step size'],a:1,
  ok:'Il gradiente su un esempio estratto a caso è una stima non distorta del gradiente completo. I singoli passi possono anche peggiorare il costo.',hint:'Un singolo passo di SGD può far salire il costo. Che cosa succede invece in media?'}],
3:[
 {q:'Per quale punto passa sempre la retta dei minimi quadrati?',
  o:['L\'origine','Il punto delle medie \\((\\bar{\\Xs},\\bar{\\Yy})\\)','Il dato con \\(\\Xs\\) più grande','Il punto delle mediane'],a:1,
  ok:'Da \\(\\Bi^*=\\bar{\\Yy}-\\Mm^*\\bar{\\Xs}\\) segue che in \\(\\Xs=\\bar{\\Xs}\\) la retta vale esattamente \\(\\bar{\\Yy}\\).',hint:'Riguarda la formula dell\'intercetta e sostituisci \\(\\Xs=\\bar{\\Xs}\\) nella retta.'},
 {q:'Se \\(\\Xs\\) e \\(\\Yy\\) sono scorrelate nel campione, com\'è la retta dei minimi quadrati?',
  o:['Orizzontale, all\'altezza di \\(\\bar{\\Yy}\\)','Con pendenza 1','Non è definita','Verticale'],a:0,
  ok:'\\(\\Mm^*=\\mathrm{Cov}/\\mathrm{Var}=0\\) e \\(\\Bi^*=\\bar{\\Yy}\\): la previsione migliore è la media, qualunque sia \\(\\Xs\\).',hint:'Che cosa diventa il numeratore della formula della pendenza?'},
 {q:'Codifichi una feature con tre categorie in one-hot (tre colonne) e aggiungi anche la colonna dell\'intercetta. Che cosa succede a \\(\\Xm^\\top\\Xm\\)?',
  o:['Resta invertibile','È singolare: le tre colonne sommano alla colonna dell\'intercetta','È singolare solo se \\(N<3\\)','Diventa diagonale'],a:1,
  ok:'Le colonne non sono linearmente indipendenti, quindi \\(\\Xm^\\top\\Xm\\) non è invertibile. La codifica dummy, con una colonna in meno, risolve.',hint:'Prova a sommare le tre colonne one-hot, riga per riga.'},
 {q:'Se si assume un rumore di Laplace invece che gaussiano, a quale loss porta la massima verosimiglianza?',
  o:['Ancora all\'errore quadratico','All\'errore assoluto (loss \\(\\ell_1\\))','Alla hinge loss','A nessuna: la verosimiglianza non si può più massimizzare'],a:1,
  ok:'Ogni ipotesi sul rumore produce una loss diversa: gaussiano dà i quadrati, Laplace dà i valori assoluti.',hint:'I quadrati venivano dall\'esponente della gaussiana. Le dispense dicono a che cosa porta Laplace.'}],
4:[
 {q:'Il modello \\(\\Yh=\\Ws_0+\\Ws_1\\Xs+\\Ws_2\\Xs^2\\) disegna una parabola. Perché si chiama ancora regressione lineare?',
  o:['Perché è lineare in \\(\\Xs\\)','Perché è lineare nei pesi \\(\\Wv\\)','Perché il grado è basso','Perché il suo grafico è una retta a tratti'],a:1,
  ok:'La linearità che conta per i minimi quadrati è quella nei parametri: \\(\\Yh=\\Wv^\\top\\Ph(\\Xs)\\). Gli input possono essere trasformati come si vuole.',hint:'Rispetto a quale variabile si deriva quando si cercano i minimi quadrati?'},
 {q:'Errore di training alto ed errore di test alto. Diagnosi e rimedio?',
  o:['Overfitting: servono più dati','Underfitting: serve una classe di modelli più espressiva','È solo rumore: non c\'è niente da fare','Overfitting: bisogna ridurre la complessità'],a:1,
  ok:'Errore alto su entrambi è underfitting. Più dati non lo curano: va cambiata la classe di ipotesi.',hint:'Un modello in overfitting, sul training, come se la cava?'},
 {q:'Raccogli molti più dati di training, tenendo lo stesso modello. Quale componente dell\'errore atteso diminuisce soprattutto?',
  o:['Il bias','La varianza','L\'errore irriducibile','Tutte e tre allo stesso modo'],a:1,
  ok:'Con più dati il modello imparato dipende meno dal campione: scende la varianza. Il bias è, informalmente, l\'errore che resta con infiniti dati, e il rumore non si tocca.',hint:'Quale dei tre pezzi misura la dipendenza dal particolare training set?'},
 {q:'Adatti un polinomio di grado 5 a dati generati da una parabola più rumore. Com\'è il suo bias?',
  o:['Alto, perché il grado è sbagliato','Basso: la classe contiene la parabola vera','Uguale a quello della retta','Dipende dalla quantità di rumore'],a:1,
  ok:'Un polinomio di grado 5 può rappresentare una parabola (basta azzerare i pesi di grado 3, 4 e 5), quindi il modello medio coincide con la verità. Il suo problema è la varianza.',hint:'Il bias riguarda il modello medio su tanti dataset, non la singola curva.'}]
};
for(const k in QUIZ)QZ[k]=()=>QUIZ[k].map(Q=>({q:pre(Q.q),o:Q.o.map(pre),a:Q.a,e:pre(Q.ok),h:pre(Q.hint)}));
const thumb=n=>'<span class="th" aria-hidden="true">'+(THUMB[n]||'')+'</span>';
function mountFigs(root){root.querySelectorAll('figure[data-fig]').forEach(f=>{
  const st=document.createElement('div');st.className='stage';f.insertBefore(st,f.firstChild);
  let o={};try{o=JSON.parse(f.dataset.opts||'{}')}catch(e){}
  try{FIG[f.dataset.fig](st,o)}catch(e){st.textContent='Figura non disponibile.';console.error(f.dataset.fig,e)}
  renderMath(st);
})}
const TITLES={};
document.querySelectorAll('article.lesson').forEach(a=>{const n=+a.dataset.n;TITLES[n]=a.dataset.title;
  INIT[n]=function(){mountFigs(a);if(n===0)map0()}});
function map0(){
document.querySelectorAll('[data-cards]').forEach(c=>{c.innerHTML=LESS.filter(L=>L.go&&TITLES[L.go]).map(L=>`<a href="#lezione-${L.go}" data-go="${L.go}">${thumb(L.go)}<small>Lezione ${L.go} · ${L.t}</small><span>${TITLES[L.go]}</span><span class="d">${L.d}</span></a>`).join('')});
document.querySelectorAll('[data-upcoming]').forEach(t=>{const rest=LESS.filter(L=>!(L.go&&TITLES[L.go])&&L.p);const wrap=t.closest('[data-upwrap]');if(!rest.length){if(wrap)wrap.hidden=true;return}t.innerHTML='<thead><tr><th>Su Blackboard</th><th>Argomento</th><th>Parte del corso</th></tr></thead><tbody>'+
  rest.map(L=>`<tr><td>${L.f}</td><td>${L.t}</td><td><span class="sw" style="background:${PART[L.p][0]}"></span>${PART[L.p][1]}</td></tr>`).join('')+'</tbody>'});
}
document.querySelectorAll('.lesson:not([data-n="0"])>section.hero').forEach(h=>{const a=document.createElement('a');a.className='back';a.href='#lezione-0';a.dataset.go='0';a.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>Mappa del corso';h.insertBefore(a,h.firstChild)});
})();

/* ---------- Riquadri: ogni figura in un fotogramma nero ---------- */
document.querySelectorAll('figure').forEach(f=>{
  const kids=[...f.children].filter(c=>c.tagName!=='FIGCAPTION'&&!c.classList.contains('scroll'));
  if(!kids.length)return;const st=el('div','stage');f.insertBefore(st,kids[0]);kids.forEach(k=>st.append(k));
});
/* ---------- Tema chiaro / scuro ---------- */
(function(){
  const b=$('#tog'),root=document.documentElement;
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  function paint(){const light=root.getAttribute('data-theme')==='light';
    b.innerHTML=light?moon:sun;b.setAttribute('aria-label',light?UI.toDark:UI.toLight)}
  b.onclick=()=>{const light=root.getAttribute('data-theme')==='light';
    root.setAttribute('data-theme',light?'dark':'light');
    try{localStorage.setItem('tema',light?'dark':'light')}catch(e){}paint()};
  try{new MutationObserver(paint).observe(root,{attributes:true,attributeFilter:['data-theme']})}catch(e){}
  paint();
})();
/* ---------- Navigazione fra le lezioni: una alla volta, figure montate alla prima apertura ---------- */
const lessons=[...document.querySelectorAll('.lesson')],links=[...document.querySelectorAll('.top nav a')];
/* le lezioni si cercano per numero (data-n), così una materia può cominciare da una lezione 0 */
const NUMS=lessons.map(l=>+l.dataset.n),byN=n=>lessons[NUMS.indexOf(n)],done={};
lessons.forEach((l,i)=>{
  const nav=l.querySelector('.navend');if(!nav)return;
  const card=(m,cls,lab)=>{const t=byN(m).dataset.title;
    return '<a class="'+cls+'" href="#lezione-'+m+'" data-go="'+m+'"><span class="th" aria-hidden="true">'+(THUMB[m]||'')+'</span><span class="tx"><small>'+lab+'</small>'+m+' · '+t+'</span></a>'};
  nav.innerHTML=(i>0?card(NUMS[i-1],'prev',UI.prev):'')+(i<NUMS.length-1?card(NUMS[i+1],'next',UI.next):'');
});
function show(n,scroll){
  lessons.forEach(l=>{l.hidden=+l.dataset.n!==n});
  links.forEach(a=>{if(+a.dataset.go===n){a.setAttribute('aria-current','page');try{a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(_){}}else a.removeAttribute('aria-current')});
  if(!done[n]){done[n]=true;const art=byN(n);
    renderMath(art);
    try{if(INIT[n])INIT[n]()}catch(e){console.error(e)}
    art.querySelectorAll('[data-quiz]').forEach(q=>{const f=QZ[q.dataset.quiz];if(f)quiz(q,f())});
  }
  if(scroll)window.scrollTo(0,0);
  if(typeof paintBar==='function')paintBar();
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m&&NUMS.includes(+m[1])?+m[1]:NUMS[0],false)})();
renderMath(document.querySelector('footer'));

/* ---------- Barra di scorrimento come mappa: domande in azzurro, riepiloghi in grigio azzurrato, teoria nel colore della barra ----------
   La barra rappresenta tutta la pagina: un punto a quota y sta a y/altezza della pagina lungo la barra, la stessa regola del cursore. */
var paintBar=(function(){
  let raf=0;const root=document.documentElement;
  function paint(){raf=0;
    const art=lessons.find(l=>!l.hidden);if(!art)return;
    const cs=getComputedStyle(root),T=cs.getPropertyValue('--sb-text').trim(),Q=cs.getPropertyValue('--theme').trim(),R=cs.getPropertyValue('--sb-recap').trim();
    const H=root.scrollHeight,sy=window.scrollY,parts=[];
    const add=(e,c)=>{const r=e.getBoundingClientRect();if(r.height>0)parts.push([(r.top+sy)/H*100,(r.bottom+sy)/H*100,c])};
    art.querySelectorAll(':scope > section.recap').forEach(s=>add(s,R));
    art.querySelectorAll('.quiz').forEach(q=>{const s=q.closest('section');
      /* il quiz finale colora tutta la sua sezione («Mettiti alla prova»), quelli nel testo solo il proprio blocco */
      add(!q.classList.contains('inq')&&s&&s.querySelectorAll('.quiz').length===1&&!s.querySelector('figure')?s:q,Q)});
    parts.sort((a,b)=>a[0]-b[0]);
    let g=[],at=0;const f=v=>v.toFixed(3)+'%';
    parts.forEach(([a,b,c])=>{if(a>at)g.push(T+' '+f(at),T+' '+f(a));g.push(c+' '+f(Math.max(a,at)),c+' '+f(b));at=Math.max(at,b)});
    g.push(T+' '+f(at),T+' 100%');
    root.style.setProperty('--sbar','linear-gradient(to bottom,'+g.join(',')+')');
    /* Chrome non ridisegna la barra quando cambia solo la variabile: un cambio di overflow la forza */
    const y=window.scrollY;root.style.overflowY='hidden';void root.offsetWidth;root.style.overflowY='';if(window.scrollY!==y)window.scrollTo(0,y)}
  const go=()=>{if(!raf)raf=requestAnimationFrame(paint)};
  try{new ResizeObserver(go).observe(document.body)}catch(e){}
  window.addEventListener('resize',go);
  try{new MutationObserver(go).observe(root,{attributes:true,attributeFilter:['data-theme']})}catch(e){}
  return go})();

/* ---------- Ask AI: domande a Gemini sulle lezioni della materia; la chiave resta solo in questo browser ----------
   Veloce: risposta in streaming (il testo compare mentre arriva), ragionamento al livello «low»,
   modelli non disponibili ricordati e saltati. Contesto: la lezione aperta per intero, la mappa del corso
   e i passaggi delle altre lezioni più vicini alla domanda (o le lezioni citate per numero), così la richiesta resta piccola. */
(function(){
  const b=el('button','askbtn',UI.ask),p=el('div','askp');b.type='button';p.hidden=true;
  p.innerHTML='<div class="askh"><b>'+UI.ask+'</b><button type="button" class="askx" aria-label="×">×</button></div><div class="asko" aria-live="polite"></div>'+
    '<textarea rows="3" aria-label="'+UI.ask+'"></textarea><div class="ctl"><button type="button" class="btn solid">'+UI.askSend+'</button><button type="button" class="btn askk">'+UI.askKey+'</button></div>';
  document.body.append(b,p);
  const o=p.querySelector('.asko'),ta=p.querySelector('textarea'),go=p.querySelector('.solid');
  const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return ''}};
  const key=ask=>{let k=ls('gemini-key');if(!k||ask){k=(prompt(UI.askPrompt)||'').trim();if(k)ls('gemini-key',k)}return k};
  b.onclick=()=>{p.hidden=!p.hidden;if(!p.hidden)ta.focus()};
  p.querySelector('.askx').onclick=()=>{p.hidden=true};
  p.querySelector('.askk').onclick=()=>{ls('gemini-skip','');key(true)};

  /* testo pulito di un nodo: niente figure, pulsanti o quiz; le formule già disegnate tornano in TeX */
  const BLK='p,h1,h2,h3,h4,li,div,figcaption,summary,tr,td,th,br,section,details';
  function clean(node){const c=node.cloneNode(true);
    c.querySelectorAll('.stage,svg,canvas,script,style,button,input,select,.navend,.q,.ctl').forEach(x=>x.remove());
    c.querySelectorAll('.katex-display,.katex').forEach(k=>{if(!k.isConnected&&!c.contains(k))return;
      const a=k.querySelector('annotation'),d=k.classList.contains('katex-display');
      k.replaceWith(a?(d?'\\['+a.textContent+'\\]':'\\('+a.textContent+'\\)'):k.textContent)});
    c.querySelectorAll(BLK).forEach(x=>x.append('\n'));
    return c.textContent.replace(/[ \t ]+/g,' ').replace(/\s*\n\s*/g,'\n').trim()}
  /* le lezioni a pezzi (una <section> ciascuno), calcolate una volta sola */
  let CH=null,MAP='';
  function index(){if(CH)return;CH=[];
    MAP=lessons.map(l=>{const hs=[...l.querySelectorAll('h2')].map(h=>h.textContent.trim()).join('; ');
      return l.dataset.n+' · '+l.dataset.title+(hs?' ('+hs+')':'')}).join('\n');
    lessons.forEach(l=>l.querySelectorAll(':scope > section').forEach(s=>{const t=clean(s);if(t.length>80)CH.push({n:+l.dataset.n,t})}))}
  /* ricerca per parole: radici di 5 lettere, pesate per rarità */
  const words=t=>(t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').match(/[a-z0-9]{4,}/g)||[]).map(w=>w.slice(0,5));
  function related(q,cur,budget){
    const qs=[...new Set(words(q))];if(!qs.length)return [];
    const df={};CH.forEach(c=>{c.w=c.w||new Set(words(c.t));qs.forEach(w=>{if(c.w.has(w))df[w]=(df[w]||0)+1})});
    return CH.filter(c=>c.n!==cur).map(c=>({c,s:qs.reduce((a,w)=>a+(c.w.has(w)?Math.log(1+CH.length/df[w]):0),0)/Math.sqrt(1+c.t.length/1500)}))
      .filter(x=>x.s>0).sort((a,b)=>b.s-a.s).filter(x=>(budget-=x.c.t.length)>0).map(x=>x.c)}
  function context(q,cur){index();
    const art=byN(cur),parts=['COURSE: '+document.title+'\nLESSONS:\n'+MAP,'OPEN LESSON '+cur+':\n'+clean(art).slice(0,40000)];
    /* lezioni citate per numero nella domanda: intere */
    const named=[...new Set([...q.matchAll(/\b(?:lezione|lezioni|lesson|lessons|lez\.?|l)\s*(\d{1,2})\b/gi)].map(m=>+m[1]))].filter(n=>n!==cur&&NUMS.includes(n)).slice(0,3);
    named.forEach(n=>parts.push('LESSON '+n+':\n'+clean(byN(n)).slice(0,30000)));
    if(!named.length){const r=related(q,cur,14000);
      if(r.length)parts.push('EXCERPTS FROM OTHER LESSONS:\n'+r.map(c=>'[lesson '+c.n+'] '+c.t).join('\n\n'))}
    return parts.join('\n\n')}

  /* risposta leggibile: grassetto, codice, elenchi, formule con KaTeX */
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function show(t,final){if(!final){o.textContent=t;return}
    o.innerHTML=esc(t).replace(/```[a-z]*\n?([\s\S]*?)```/g,'<code class="askc">$1</code>').replace(/`([^`\n]+)`/g,'<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/^[ \t]*[*-] /gm,'• ').replace(/^#{1,4} +(.*)$/gm,'<b>$1</b>');
    renderMath(o)}

  /* modelli in ordine di preferenza, scelti misurando i tempi con la chiave vera (23 novembre 2026, contesto di una lezione, circa 8.000 token):
     gemini-3.5-flash-lite prima parola in 0,7-1 s; gemini-3.1-flash-lite circa 1 s; gemini-3.5-flash 6-13 s;
     gemini-4-hydrogen nessuna risposta dopo oltre 40 s anche per una domanda di una riga; gemini-3.8-flash e 3.6-flash spesso 503 (troppa richiesta).
     Se un modello non manda la prima parola entro WAIT ms si passa al successivo; quelli che rispondono «non esiste» vengono ricordati e saltati. */
  const MODELS=[['gemini-3.5-flash-lite',{thinkingLevel:'low'}],['gemini-3.1-flash-lite',{thinkingLevel:'low'}],['gemini-3.5-flash',{thinkingLevel:'low'}]],WAIT=8000;
  let hist=[],histN=null,ctrl=null;
  go.onclick=async()=>{const q=ta.value.trim(),k=q&&key();if(!k)return;
    const cur=(lessons.find(l=>!l.hidden)||lessons[0]).dataset.n|0;
    if(histN!==cur){hist=[];histN=cur}
    if(ctrl)ctrl.abort();ctrl=new AbortController();const sig=ctrl.signal;
    o.textContent='…';go.disabled=true;ta.value='';
    const contents=[{role:'user',parts:[{text:context(q,cur)}]},{role:'model',parts:[{text:'OK.'}]},...hist,{role:'user',parts:[{text:q}]}];
    const skip=ls('gemini-skip').split(',');let txt='',err='';
    try{for(const [m,th] of MODELS){if(skip.includes(m))continue;if(sig.aborted)break;
        /* ogni modello ha il suo interruttore: si spegne se la prima parola non arriva entro WAIT ms */
        const one=new AbortController(),stop=()=>one.abort();sig.addEventListener('abort',stop);
        let slow=false,timer=setTimeout(()=>{slow=true;one.abort()},WAIT);
        try{
        const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':streamGenerateContent?alt=sse',{method:'POST',signal:one.signal,
          headers:{'Content-Type':'application/json','x-goog-api-key':k},
          body:JSON.stringify({systemInstruction:{parts:[{text:UI.askSys+' '+UI.askFmt}]},contents,generationConfig:{thinkingConfig:th,maxOutputTokens:2048}})});
        if(!r.ok){let j={};try{j=await r.json()}catch(e){}err=(j.error&&j.error.message)||('HTTP '+r.status);
          if(/api key/i.test(err))break;
          if(r.status===404){skip.push(m);ls('gemini-skip',skip.filter(Boolean).join(','))}
          if([400,404,429,500,503].includes(r.status))continue;break}
        err='';const rd=r.body.getReader(),dec=new TextDecoder();let buf='';
        for(;;){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});
          let i;while((i=buf.indexOf('\n'))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);
            if(!line.startsWith('data:'))continue;
            try{const j=JSON.parse(line.slice(5)),c=j.candidates&&j.candidates[0];
              if(c&&c.content&&c.content.parts)txt+=c.content.parts.filter(x=>!x.thought).map(x=>x.text||'').join('');
              if(j.error)err=j.error.message}catch(e){}}
          if(txt&&timer){clearTimeout(timer);timer=0}
          show(txt,false)}
        break}
        catch(e){if(sig.aborted)throw e;if(txt)break;err=slow?m+': '+UI.askSlow:String(e)}
        finally{clearTimeout(timer);sig.removeEventListener('abort',stop)}}
      if(txt){show(txt,true);hist.push({role:'user',parts:[{text:q}]},{role:'model',parts:[{text:txt}]});hist=hist.slice(-6)}
      else o.textContent=err||'Error'}
    catch(e){if(e.name!=='AbortError')o.textContent=txt||String(e)}
    if(!sig.aborted)go.disabled=false};
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();go.click()}});
})();

/* griglia animata nella barra: una griglia che subisce lentamente trasformazioni lineari */
(function(){const top=document.querySelector('.top');if(!top)return;const cv=document.createElement('canvas');if(!cv.getContext)return;cv.className='tg';cv.setAttribute('aria-hidden','true');top.insertBefore(cv,top.firstChild);const c=cv.getContext('2d');
  const MS=[[1,0,0,1],[1,.9,0,1],[.82,.5,-.5,.82],[1.25,.25,.35,.8],[.7,-.45,.6,1.05],[1,0,0,1]],SEG=7,HOLD=1.6,TOT=(MS.length-1)*(SEG+HOLD);
  const ez=t=>t*t*t*(t*(6*t-15)+10);let W=0,Hh=0,raf=null,t0=null;
  function size(){const d=Math.min(2,window.devicePixelRatio||1);W=cv.clientWidth;Hh=cv.clientHeight;cv.width=W*d;cv.height=Hh*d;c.setTransform(d,0,0,d,0,0)}
  function draw(sec){const u=sec%TOT,k=Math.floor(u/(SEG+HOLD)),f=ez(Math.min(1,(u-k*(SEG+HOLD))/SEG)),A=MS[k],B=MS[k+1],m=A.map((v,i)=>v+(B[i]-v)*f);
    c.clearRect(0,0,W,Hh);const s=34,ox=W*.2,oy=Hh/2+6,sk=-.32,P=(x,y)=>{const X=m[0]*x+m[1]*y,Y=m[2]*x+m[3]*y;return [ox+s*(X+sk*Y),oy-s*Y*.62]};
    for(let pass=0;pass<2;pass++)for(let i=-64;i<=64;i++){const main=i%4===0;if((pass===1)!==main)continue;c.strokeStyle=main?'rgba(88,160,230,.42)':'rgba(255,255,255,.13)';c.lineWidth=main?1.2:1;
      let a=P(i,-90),b=P(i,90);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();a=P(-90,i);b=P(90,i);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}}
  function tick(ts){if(t0==null)t0=ts;draw((ts-t0)/1000);raf=requestAnimationFrame(tick)}
  const still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){if(!raf&&!still&&!document.hidden)raf=requestAnimationFrame(tick)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}}
  size();draw(0);start();window.addEventListener('resize',()=>{size();draw(0)});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
})();

})();
