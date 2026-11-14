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
  prev:'Lezione precedente',next:'Lezione successiva',toLight:'Passa al tema chiaro',toDark:'Passa al tema scuro'};
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


/* Big Data and Databases: interface in English and small drawing helpers shared by the four lessons */
Object.assign(UI,{check:'Check',pickFirst:'Pick an answer first.',right:'Correct.',wrong:'Not quite.',play:'Play',pause:'Pause',seek:'Position in the animation',
  prev:'Previous lesson',next:'Next lesson',toLight:'Switch to light theme',toDark:'Switch to dark theme'});
/* colour roles of this subject: primary key YEL, foreign key PINK, conditions ORG, NULL PUR, measures BLUE, windows TEAL, accepted GRN, rejected RED */
const PKC=YEL,FKC=PINK,PRC=ORG,NLC=PUR,MSC=BLUE,WNC=TEAL;
Object.assign(MAC,{'\\kk':col(BLUE,'k'),'\\qv':col(ORG,'q'),'\\vb':col(BLUE,'v')});
/* numbers in English: point as decimal separator, trailing zeros removed */
const fe=(v,d)=>{if(v===null||v===undefined)return 'NULL';const p=Math.pow(10,d===undefined?2:d);return String(Math.round(v*p)/p)};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* a table drawn in SVG. cols: [{t:header, w:width, a:'s'|'e', c:header colour}]; rows: arrays of cells, a cell is a string or
   {v:text, f:colour, b:bold, st:struck}; o.bg(i) row background, o.op(i) row opacity. Returns {s,w,h}. */
function sTab(x,y,cols,rows,o){
  o=o||{};const rh=o.rh||25,hh=o.hh||26,fs=o.fs||13.5;let s='',cx=x;const w=cols.reduce((a,c)=>a+c.w,0);
  const pos=c=>c.a==='e'?[cx+c.w-7,'end']:c.a==='m'?[cx+c.w/2,'middle']:[cx+7,'start'];
  cols.forEach(c=>{const [tx_,an]=pos(c);s+='<text x="'+tx_+'" y="'+(y+hh-9)+'" font-size="'+(fs-.5)+'" text-anchor="'+an+'" style="fill:'+(c.c||GRAY)+'">'+c.t+'</text>';cx+=c.w});
  s+='<line x1="'+x+'" y1="'+(y+hh)+'" x2="'+(x+w)+'" y2="'+(y+hh)+'" stroke="#555"/>';
  rows.forEach((r,i)=>{const ry=y+hh+i*rh,bg=o.bg?o.bg(i):null,op=o.op?o.op(i):1;
    if(bg)s+='<rect x="'+x+'" y="'+ry+'" width="'+w+'" height="'+rh+'" fill="'+bg+'"/>';
    s+='<g opacity="'+op+'">';cx=x;
    r.forEach((cell,j)=>{const c=cols[j],v=typeof cell==='object'&&cell!==null?cell:{v:cell};const [tx_,an]=pos(c);
      const txt=v.v===null?'NULL':v.v,fill=v.f||(v.v===null?PUR:'#fff');if(v.bg)s+='<rect x="'+cx+'" y="'+ry+'" width="'+c.w+'" height="'+rh+'" fill="'+v.bg+'"/>';
      s+='<text x="'+tx_+'" y="'+(ry+rh-8)+'" font-size="'+fs+'" text-anchor="'+an+'"'+(v.b?' font-weight="600"':'')+(v.st?' text-decoration="line-through"':'')+' style="fill:'+fill+'">'+txt+'</text>';cx+=c.w});
    s+='</g><line x1="'+x+'" y1="'+(ry+rh)+'" x2="'+(x+w)+'" y2="'+(ry+rh)+'" stroke="#262626"/>'});
  return {s,w,h:hh+rows.length*rh};
}
/* rounded label with outline, readable over lines */
const lbl=(x,y,t,c,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13.5)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+(c||'#fff')+'">'+t+'</text>'};
const rect=(x,y,w,h,f,st,o)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(st?' stroke="'+st+'"':'')+(o||'')+'/>';
const line=(x1,y1,x2,y2,c,w,o)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||1.5)+'"'+(o||'')+'/>';
const verdict=(ok,t)=>'<span class="'+(ok?'ok':'bad')+'">'+(ok?'Accepted.':'Rejected.')+'</span> '+t;
const OKBG='rgba(131,193,103,.22)',BADBG='rgba(252,98,85,.24)',HLBG='rgba(255,255,255,.1)',WINBG='rgba(92,208,179,.22)';
/* datasets from the course scripts and slides */
const CUST=[[1,'marco','rossi','milan'],[2,'john','doe','london'],[3,'mark','smith','liverpool'],[4,'mary','jane','london'],[5,'mario','bianchi','rome']];
const SAL=[[1,'2018-09-01',1,'xyz',5,1.5],[2,'2018-09-01',2,'abc',2,2],[3,'2018-09-02',3,'xyz',10,1.5],[4,'2018-09-02',4,'abc',4,2],[5,'2018-09-03',1,'abc',2,2.2],[6,'2018-09-03',2,'xyz',3,1.5]];
const ORD=[['2018-07-04',1,'Anders',440],['2018-07-05',1,'Anders',1813],['2018-07-05',1,'Anders',670.8],['2018-07-08',1,'Anders',625.2],['2018-07-15',1,'Anders',517.8],
  ['2018-07-04',2,'Trujillo',1863.4],['2018-07-06',2,'Trujillo',3730],['2018-07-07',2,'Trujillo',1444.8],['2018-07-09',2,'Trujillo',2490.5]];
const BUY=[['Adam Brun',1],['Lucy Thin',2],['Eva Unirt',3],['Pil Trun',4]];
const BSL=[[1,2,25],[1,3,5],[4,1,65],[3,5,11],[4,2,1003]];
const PRODS=[[1,'Chai'],[2,'Chang'],[3,'Aniseed Syrup'],[4,"Chef Anton's Cajun Seasoning"],[5,"Chef Anton's Gumbo Mix"]];
const ITEMS=[[1,1,12],[1,2,10],[1,3,5],[2,1,9],[2,2,40],[3,3,10],[3,4,35],[4,1,15],[4,2,6],[5,3,35],[5,4,15],[6,1,6],[6,2,15],[7,3,6],[8,4,15],[9,1,6]]; /* order, product, quantity */
const capw=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* SQL keywords in pre.code blocks (text nodes outside coloured spans only) */
const KWS=/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT INTO|VALUES|UPDATE|SET|DELETE|CREATE TABLE|DROP TABLE|NOT NULL|NULL|AND|OR|NOT|AS|ON|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|UNION|ALL|DISTINCT|IS|EXISTS|OVER|PARTITION BY|ROWS BETWEEN|PRECEDING|FOLLOWING|CURRENT ROW|UNBOUNDED|DESC|ASC|COUNT|SUM|AVG|MAX|MIN|COALESCE|ROW_NUMBER|LAG|LEAD|INT|VARCHAR|DECIMAL|DATE|MATCH|RETURN)\b/g;
function codeHL(root){root.querySelectorAll('pre.code:not([data-hl])').forEach(pre=>{pre.dataset.hl=1;
  const w=document.createTreeWalker(pre,NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);
  ns.forEach(n=>{if(n.parentElement!==pre)return;const t=n.nodeValue;KWS.lastIndex=0;if(!KWS.test(t))return;KWS.lastIndex=0;
    const sp=document.createElement('span');sp.innerHTML=esc(t).replace(KWS,m=>'<span class="kw">'+m+'</span>');n.replaceWith(...sp.childNodes)})})}
const mono=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13)+'" text-anchor="'+(o.a||'start')+'" style="font-family:ui-monospace,Menlo,Consolas,monospace;fill:'+(o.f||'#ddd')+'">'+t+'</text>'};
const lcg=seed=>{let x=seed;return()=>{x=(x*16807)%2147483647;return x/2147483647}};
/* x of column j in a sTab starting at x0 */
const colX=(x0,cols,j)=>x0+cols.slice(0,j).reduce((a,c)=>a+c.w,0);
/* a table panel inside a .duo/.trio grid, centred in a viewBox at least minW wide so text keeps the same size across panels */
function tabCell(host,title,t,note,minW,extra,H){const W=Math.max(minW||330,t.w+8),dx=(W-t.w)/2-4;
  return cell(host,title,'<g transform="translate('+dx+',0)">'+t.s+(extra||'')+'</g>',W,H||t.h+8,title,note)}

/* miniature: each one recalls the main figure of its lesson */
(function(){
  const sv=s=>'<svg viewBox="0 0 108 72" aria-hidden="true">'+s+'</svg>';
  let t='<line x1="10" y1="60" x2="98" y2="60" stroke="#555" stroke-width="2"/>';
  for(let k=0;k<5;k++){const x=16+k*19;for(let j=0;j<=k;j++)t+='<rect x="'+(x-7)+'" y="'+(50-j*9)+'" width="14" height="7" fill="'+(j===k?'#6db9f4':'#17303d')+'"/>';t+='<circle cx="'+x+'" cy="60" r="2.5" fill="#6db9f4"/>'}
  THUMB[1]=sv(t);
  THUMB[2]=sv('<rect x="12" y="12" width="84" height="48" fill="none" stroke="#666"/><line x1="12" y1="24" x2="96" y2="24" stroke="#666"/><line x1="34" y1="12" x2="34" y2="60" stroke="#666"/><line x1="66" y1="12" x2="66" y2="60" stroke="#666"/>'+
    '<rect x="13" y="25" width="20" height="34" fill="'+YEL+'" fill-opacity=".45"/><rect x="67" y="25" width="28" height="34" fill="'+PINK+'" fill-opacity=".4"/>');
  THUMB[3]=sv('<rect x="10" y="14" width="34" height="44" fill="none" stroke="#666"/><rect x="64" y="14" width="34" height="44" fill="none" stroke="#666"/>'+
    [0,1,2].map(i=>'<line x1="44" y1="'+(24+i*13)+'" x2="64" y2="'+(28+i*11)+'" stroke="'+ORG+'" stroke-width="2"/>').join('')+'<rect x="11" y="50" width="32" height="7" fill="'+PUR+'" fill-opacity=".6"/>');
  THUMB[4]=sv('<g stroke="#666" stroke-width="2"><line x1="28" y1="40" x2="56" y2="18"/><line x1="56" y1="18" x2="86" y2="38"/><line x1="28" y1="40" x2="58" y2="60"/><line x1="86" y1="38" x2="58" y2="60"/></g>'+
    '<circle cx="28" cy="40" r="8" fill="#bbb"/><circle cx="56" cy="18" r="8" fill="#888"/><circle cx="86" cy="38" r="8" fill="#bbb"/><circle cx="58" cy="60" r="8" fill="#888"/>');
})();

/* Lesson 1: the data analytics timeline */
const ERP1=[[1,'ROSSI MARCO','Milano',0],[2,'DOE JOHN','London',1],[3,'SMITH MARK','Liverpool',2],[4,'JANE MARY','London',3],[5,'BIANCHI MARIO','Roma',4]];
const CRM1=[[101,'Marco','Rossi','Milan',0],[102,'John','Doe','LONDON',1],[103,'Mary','Jane','Manchester',3],[104,'Mary','Jane','London',3],[105,'Mark','Smith','Liverpool',2],[106,'Mario','Bianchi','Rome',4]];
INIT[1]=function(){
  codeHL($('#lezione-1'));
  /* two systems, one customer base */
  (function(){
    const duo=el('div','duo');$('#b1src').append(duo);
    const t1=sTab(6,6,[{t:'id',w:34,a:'e'},{t:'name',w:130},{t:'city',w:88}],ERP1.map(r=>[r[0],r[1],r[2]==='Milano'?{v:r[2],bg:BADBG}:r[2]]));
    cell(duo,'Sales system (ERP)',t1.s,t1.w+12,t1.h+12,'ERP customer table','Searching for the city \'Milan\' finds <span class="bad">0</span> customers. Counting records gives 5.');
    const t2=sTab(6,6,[{t:'id',w:40,a:'e'},{t:'first',w:58},{t:'last',w:64},{t:'city',w:92}],CRM1.map(r=>[r[0],r[1],r[2],r[0]===103?{v:r[3],bg:BADBG}:r[3]]),{bg:i=>CRM1[i][4]===3?HLBG:null});
    cell(duo,'Customer system (CRM)',t2.s,t2.w+12,t2.h+12,'CRM contact table','Searching for \'Milan\' finds 1. Counting records gives <span class="bad">6</span>: Mary Jane appears twice, in two cities.');
  })();
  /* timeline: five phases, one layer each */
  (function(){
    const ph=[['1980s','Operational DBs','Static reports'],['1990s','Data warehouse','Static reports'],['late 1990s','OLAP','Dynamic reports'],['2000s','Data mining','Predictive analytics'],['2012 onwards','Hadoop, Spark','Big Data platforms']];
    let s=line(20,206,680,206,'#555',2);
    ph.forEach((p,k)=>{const cx=70+k*140;
      for(let j=0;j<=k;j++){const y=170-j*32,top=j===k;
        s+=rect(cx-62,y,124,28,top?'#6db9f4':'#17303d',top?'#6db9f4':'#2c5468')+tx(cx,y+19,ph[j][1],{s:13,f:top?'#000':'#cfe6f5'})}
      s+='<circle cx="'+cx+'" cy="206" r="6" fill="#6db9f4"/>'+tx(cx,232,'Phase '+(k+1),{s:14,f:'#fff',w:500})+tx(cx,252,p[0],{s:13,f:GRAY})+tx(cx,272,p[2],{s:13,f:GRAY})});
    svgBox($('#b1time'),700,284,s,'Five phases of the data analytics timeline, each adding a layer','44rem');
  })();
  /* three reports of the same six sales */
  (function(){
    const trio=el('div','trio');$('#b1rep').append(trio);
    const rows=SAL.map(r=>({d:r[1],p:r[3],q:r[4],a:r[4]*r[5]}));const days=[...new Set(rows.map(r=>r.d))];
    const sh=d=>d.slice(5);
    const op=[];days.forEach(d=>{const ds=rows.filter(r=>r.d===d);ds.forEach(r=>op.push([sh(r.d),r.p,r.q,{v:fe(r.a),f:MSC}]));
      op.push([{v:sh(d),f:GRAY},{v:'total',f:GRAY},{v:ds.reduce((a,r)=>a+r.q,0),f:GRAY},{v:fe(ds.reduce((a,r)=>a+r.a,0)),f:MSC,b:1}])});
    const C4=[{t:'date',w:56},{t:'product',w:62},{t:'qty',w:38,a:'e'},{t:'amount',w:66,a:'e'}];
    let t=sTab(4,4,C4,op,{bg:i=>(i%3===2)?HLBG:null,fs:13});cell(trio,'Operational',t.s,t.w+8,t.h+8,'Operational report','Every sale plus daily subtotals: 9 lines. Built every day.');
    const ta=days.map(d=>{const ds=rows.filter(r=>r.d===d);return [sh(d),ds.length,ds.reduce((a,r)=>a+r.q,0),{v:fe(ds.reduce((a,r)=>a+r.a,0)),f:MSC}]});
    t=sTab(4,4,[{t:'date',w:56},{t:'sales',w:50,a:'e'},{t:'qty',w:50,a:'e'},{t:'amount',w:66,a:'e'}],ta,{fs:13});cell(trio,'Tactical',t.s,t.w+8,t.h+8,'Tactical report','One line per day: 3 lines. Built daily or weekly.');
    t=sTab(4,4,[{t:'period',w:70},{t:'sales',w:44,a:'e'},{t:'qty',w:42,a:'e'},{t:'amount',w:66,a:'e'}],[['Sep 2018',6,26,{v:'43.4',f:MSC}]],{fs:13});cell(trio,'Strategic',t.s,t.w+8,t.h+8,'Strategic report','One line for the period. Built weekly or monthly.');
  })();
  /* illustrative workload model */
  (function(){
    const trio=el('div','trio');const root=$('#b1load');root.append(legend([[BLUE,'time to save one order','box'],[RED,'above 15 ms','box']]),trio);
    const rnd=(()=>{let x=7;return()=>{x=(x*16807)%2147483647;return x/2147483647}})(),jit=Array.from({length:12},()=>0.6+0.8*rnd());
    [['No reports',0.3],['8 reports on the same server',0.82],['8 reports on a copy',0.3]].forEach(([title,u])=>{
      const mean=4/(1-u),W=230,H=180,L=34,B=150,T=12,Y=v=>B-v/40*(B-T);let s='';
      [0,10,20,30,40].forEach(v=>{s+=line(L,Y(v),W-6,Y(v),'#222',1)+tx(L-6,Y(v)+4,v,{s:13,f:GRAY,a:'end'})});
      const avg=jit.reduce((a,j)=>a+Math.min(39.5,mean*j),0)/jit.length;s+=tx(12,(T+B)/2,'ms',{s:13,f:GRAY,x:' transform="rotate(-90 12 '+(T+B)/2+')"'});
      jit.forEach((j,i)=>{const v=Math.min(39.5,mean*j),bw=(W-6-L)/12;s+=rect(L+i*bw+2,Y(v),bw-4,B-Y(v),v>15?RED:BLUE)});
      s+=line(L,B,W-6,B,'#777',1.5)+tx((L+W)/2,B+20,'incoming orders',{s:13,f:GRAY});
      cell(trio,title,s,W,H,title,'Average <b>'+fe(avg,1)+' ms</b> per order.')});
  })();
  /* ETL: staging, transformed, warehouse */
  (function(){
    const W=720,H=372;let s='';
    [[0,'Staging area (extract)'],[244,'Transformed'],[488,'Data warehouse (load)']].forEach(([x,t])=>{s+=rect(x+2,30,228,H-34,'#0b0b0b','#2a2a2a')+tx(x+116,20,t,{s:14,f:GRAY})});
    const all=ERP1.map(r=>({src:'ERP',raw:r[0]+' · '+r[1]+' · '+r[2],clean:capw(r[1].split(' ')[1].toLowerCase())+' '+capw(r[1].split(' ')[0].toLowerCase())+' · '+({Milano:'Milan',Roma:'Rome'}[r[2]]||r[2]),p:r[3],id:r[0]}))
      .concat(CRM1.map(r=>({src:'CRM',raw:r[0]+' · '+r[1]+' '+r[2]+' · '+r[3],clean:r[1]+' '+r[2]+' · '+capw(r[3].toLowerCase()),p:r[4],id:r[0],drop:r[0]===103})));
    const wy=p=>70+p*62;
    all.forEach((c,j)=>{const y=54+j*28;s+=tx(10,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(46,y+5,esc(c.raw),{s:13,a:'start',f:'#fff'})});
    const ord=all.slice().sort((a,b)=>a.p-b.p||(a.src<b.src?1:a.src>b.src?-1:a.id-b.id));
    ord.forEach((c,j)=>{const y=54+j*28;
      s+=tx(254,y+5,c.src,{s:12.5,f:GRAY,a:'start'})+tx(290,y+5,esc(c.clean),{s:13,a:'start',f:c.drop?RED:'#fff',x:c.drop?' text-decoration="line-through"':''});
      if(!c.drop)s+=line(458,y,496,wy(c.p)-4,'#666',1.2);
    });
    [0,1,2,3,4].forEach(p=>{const e=ERP1.find(r=>r[3]===p),c=CRM1.find(r=>r[4]===p&&r[0]!==103),cl=all.find(a=>a.src==='ERP'&&a.p===p).clean;
      s+=tx(508,wy(p),p+1,{s:15,f:PKC,w:600})+tx(524,wy(p),esc(cl),{s:14,a:'start',f:'#fff'})+tx(524,wy(p)+19,'ERP id '+e[0]+' · CRM id '+c[0],{s:12.5,a:'start',f:GRAY})});
    svgBox($('#b1etl'),W,H,s,'ETL from two sources into one warehouse table','46rem');
  })();
  /* the cube, one slice per date, and a pivot */
  (function(){
    const cities=['Milan','London','Liverpool'],prods=['abc','xyz'],dates=['2018-09-01','2018-09-02','2018-09-03'];
    const cityOf=id=>capw(CUST.find(c=>c[0]===id)[3]);
    const q=(c,p,d)=>SAL.filter(r=>cityOf(r[2])===c&&r[3]===p&&(!d||r[1]===d)).reduce((a,r)=>a+r[4],0);
    let s='';const cw=46,rh=30,y0=64;
    cities.forEach((c,i)=>{s+=tx(76,y0+i*rh+20,c,{s:13.5,a:'end',f:'#fff'})});
    dates.forEach((d,k)=>{const x=86+k*(2*cw+20);s+=tx(x+cw,22,d.slice(5),{s:13.5,f:GRAY});
      prods.forEach((p,j)=>{s+=tx(x+j*cw+cw/2,y0-8,p,{s:13,f:GRAY})});
      cities.forEach((c,i)=>prods.forEach((p,j)=>{const v=q(c,p,d);s+=rect(x+j*cw,y0+i*rh,cw,rh,v?'rgba(88,196,221,.22)':'#0d0d0d','#333')+(v?tx(x+j*cw+cw/2,y0+i*rh+20,v,{s:14,f:MSC}):'')}))});
    s+=tx(86+(2*cw+20)*1.5-10,y0+3*rh+28,'one slice per date (quantity)',{s:13,f:GRAY});
    const px=436;s+=tx(px+20,y0+rh*1.5+8,'→',{s:22,f:GRAY});
    const pr=cities.map(c=>[c,{v:q(c,'abc'),f:MSC},{v:q(c,'xyz'),f:MSC},{v:q(c,'abc')+q(c,'xyz'),f:MSC,b:1}]);
    pr.push([{v:'total',f:GRAY},{v:8,f:MSC,b:1},{v:18,f:MSC,b:1},{v:26,f:MSC,b:1}]);
    const t=sTab(px+44,y0-26,[{t:'city',w:76},{t:'abc',w:44,a:'e'},{t:'xyz',w:44,a:'e'},{t:'total',w:52,a:'e'}],pr,{rh:28,bg:i=>i===3?HLBG:null});
    s+=t.s+tx(px+44+108,y0+4*28+30,'pivot: dates added up',{s:13,f:GRAY});
    svgBox($('#b1olap'),720,226,s,'Sales cube sliced by date and a pivot by city and product','46rem');
  })();
  /* simulated sales and forecast */
  (function(){
    const N=36,now=24;let x=11;const rnd=()=>{x=(x*16807)%2147483647;return x/2147483647};
    const y=Array.from({length:N},(_,t)=>100+1.6*t+16*Math.sin(2*Math.PI*(t-2)/12)+(rnd()-.5)*12);
    const W=700,H=300,L=56,R=686,T=14,B=250,X=t=>L+t/(N-1)*(R-L),Y=v=>B-(v-60)/(200-60)*(B-T);let s='';
    for(let v=60;v<=200;v+=35)s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'});
    for(let t=0;t<N;t+=6)s+=tx(X(t),B+20,t+1,{s:13,f:GRAY});
    s+=tx((L+R)/2,H-6,'month',{s:13,f:GRAY})+tx(14,(T+B)/2,'sales, thousand units',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    const k=now-1,m1=y.slice(now-12,now).reduce((a,b)=>a+b)/12,m0=y.slice(now-24,now-12).reduce((a,b)=>a+b)/12,dr=m1-m0;
    const f=[{t:k,v:y[k],w:0}];for(let h=1;h<=6;h++)f.push({t:k+h,v:y[k+h-12]+dr,w:6+2.5*h});
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v+p.w).toFixed(1)).join('')+f.slice().reverse().map(p=>'L'+X(p.t).toFixed(1)+' '+Y(p.v-p.w).toFixed(1)).join('')+'Z" fill="'+ORG+'" fill-opacity=".18"/>';
    s+='<path d="'+y.slice(0,now).map((v,t)=>(t?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/>';
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v).toFixed(1)).join('')+'" fill="none" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
    s+=line(X(k),T,X(k),B,'#fff',1,' stroke-dasharray="3 4"')+lbl(X(k),T+12,'today','#fff');
    const r=$('#b1fc');r.append(legend([[BLUE,'known past: descriptive'],[ORG,'forecast and uncertainty band: predictive','dash']]));
    svgBox(r,W,H,s,'Monthly sales with a six month forecast','44rem');
  })();
  /* a post: what you see and what is stored */
  (function(){
    const root=$('#b1post'),duo=el('div','duo');root.append(legend([['#fff','key/value pair, fits a column','box'],[GRAY,'free content, no fixed structure','box']]),duo);
    const S='color:#fff',U='color:#8c8c8c;font-style:italic';
    const a=el('div');a.append(el('h4','','What you see'));
    a.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:var(--sans);line-height:1.6;display:flex;flex-direction:column;gap:.5rem;width:100%">'+
      '<div style="display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap"><b style="'+S+'">Milano Bites</b><span style="'+S+'">30 Sep 2026, 18:42</span></div>'+
      '<span style="'+S+'">Milan, Italy</span><span style="'+U+'">Best risotto in town tonight, the saffron was unreal! Queue was long but worth it.</span>'+
      '<svg viewBox="0 0 200 64" style="max-width:200px"><rect width="200" height="64" fill="#1d1d1d"/><circle cx="58" cy="34" r="18" fill="#8c8c8c"/><path d="M110 54L140 18L174 54Z" fill="#555"/></svg>'+
      '<span style="'+S+'">♥ 128</span></div>'));
    const b=el('div');b.append(el('h4','','What is stored'));
    const kv=(k,v,u,last)=>'<div style="padding-left:1.4em;text-indent:-1.2em;'+(u?U:S)+'">"'+k+'": '+v+(last?'':',')+'</div>';
    b.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:ui-monospace,Menlo,monospace;font-size:.82rem;line-height:1.75;width:100%;overflow-wrap:anywhere">{'+
      kv('author','"@milano_bites"')+kv('created_at','"2026-09-30T18:42:00Z"')+kv('location','"Milan, IT"')+kv('text','"Best risotto in town tonight, the saffron..."',1)+kv('media','["photo_8841.jpg"]',1)+kv('likes','128',0,1)+'}</div>'));
    duo.append(a,b);
    root.append(el('div','cellnote','Author, date, place and likes are labeled values; the text and the picture are not. One object mixing both is <b>semi-structured</b>.'));
  })();
};
QZ['1a']=()=>[{q:'With the six course sales, a tactical report shows the total amount per day. What does it show for 2 September 2018?',o:['15','43.4','23','11.5'],a:2,
  e:'On 2 September there are two sales: 10 units of xyz at 1.5 (15) and 4 units of abc at 2 (8), so 15 + 8 = 23.',h:'Take only the rows dated 2018-09-02 and add quantity times price for each.'}];
QZ['1b']=()=>[{q:'A company copies its operational database to a second server every night and runs all reports there, changing nothing else. Which problem does this solve?',
  o:['The same city is written in two different ways in the ERP and in the CRM.','The CRM keeps an old address next to the new one for the same customer.','Heavy reports slow down the insertion of new orders.','None of the three.'],a:2,
  e:'A copy on another server removes the competition between massive reads and writes, which is how the first data warehouses started. It does nothing about formats or versions, because it copies them too.',
  h:'A copy contains the same values as the original. Which of the problems is about the values, and which about the machine?'}];
QZ['1c']=()=>[{q:'Compared with querying the data warehouse in SQL, what does OLAP add?',
  o:['It predicts next month\'s values from the historical ones.','The user can aggregate along dimensions without knowing the table relationships, and aggregates come back faster.','It removes the need for ETL, since it reads the operational databases directly.','It stores the data in normalized tables.'],a:1,
  e:'OLAP combines data with metadata, so the user does not need to know how tables relate, and it answers aggregate questions much faster than a relational database.',
  h:'Think about what a user had to know in phase 2 to get a total by city, and what changes when the engine already knows how the tables connect.'}];
QZ['1']=()=>[
  {q:'In which step of ETL are business rules and data quality checks applied?',o:['Extract','Transform','Load','In the OLAP client, after loading'],a:1,
   e:'ETL extracts the data, transforms them with business rules and data quality checks, then loads them.',h:'Recall what each of the three steps does to the data.'},
  {q:'In the pivot of the OLAP figure, what is the total quantity bought by London customers?',o:['6','3','10','9'],a:3,
   e:'London customers bought abc twice (2 and 4) and xyz once (3): 2 + 4 + 3 = 9.',h:'Find the London sales in the three date slices and add their quantities.'},
  {q:'Which of these is the lecture\'s example of semi-structured data?',o:['A tweet','The invoice table of an ERP','An X-ray image','A printed strategic report'],a:0,
   e:'A post mixes free text with key/value pairs such as author, date and location: that is what semi-structured means.',h:'Look for the item that contains both free content and labeled fields.'},
  {q:'Which of these is predictive rather than descriptive analytics?',o:['A monthly report of sales by region','An OLAP pivot of last year\'s margins','An estimate of next month\'s energy cost','A dashboard of yesterday\'s orders'],a:2,
   e:'Estimating the likelihood of a future value is predictive; the other three summarize what already happened.',h:'Recall the lecture\'s split: one kind of analytics describes, the other estimates.'},
  {q:'Which definition of Big Data does the lecturer prefer to the three V?',o:['Any data set larger than one terabyte','Data produced by social networks','Data stored in Hadoop','Data we cannot analyze, or have no convenience to analyze, with traditional tools'],a:3,
   e:'The preferred definition is relative to the tools: data we cannot analyze, or have no convenience to analyze, with traditional tools such as relational databases.',h:'The lecturer prefers a definition that does not depend on a fixed size or source.'}
];

/* Lesson 2: what exactly is a table */
INIT[2]=function(){
  codeHL($('#lezione-2'));
  /* four inserts into Sales */
  (function(){
    const root=$('#b2ins'),m=el('div','duo');root.append(legend([[GRN,'accepted row','box'],[RED,'refused row','box'],['#fff','cell that breaks a rule','dash']]),m);
    const C=[{t:'id',w:30,a:'e',c:PKC},{t:'date',w:56},{t:'cust',w:44,a:'e',c:FKC},{t:'prod',w:44},{t:'qty',w:40,a:'e'}];
    [['A sales_id that exists',[3,'09-04',2,'abc',4],0,false,'sales_id 3 is already there: the <span style="color:var(--yellow)">primary key</span> refuses a duplicate.'],
     ['A customer who does not exist',[7,'09-04',9,'abc',3],2,false,'There is no customer 9: the <span style="color:var(--pink)">foreign key</span> refuses it.'],
     ['A quantity of zero',[7,'09-04',2,'abc',0],4,false,'<span style="color:var(--orange)">quantity &gt; 0</span> is false: the CHECK constraint refuses it.'],
     ['An unknown customer',[7,'09-04',null,'abc',3],-1,true,'customer_id is NULL, which a foreign key allows.']].forEach(([title,row,bad,ok,note])=>{
      const t=sTab(4,4,C,[[6,'09-03',2,'xyz',3].map(v=>({v,f:GRAY})),row],{bg:i=>i===1?(ok?OKBG:BADBG):null});
      const ex=bad>=0?rect(colX(4,C,bad)+1,4+26+25+1,C[bad].w-2,23,'none','#fff',' stroke-width="2"'):'';
      tabCell(m,title,t,verdict(ok,note),300,ex)});
  })();
  /* CHAR versus VARCHAR, and DECIMAL(5,2) */
  (function(){
    const duo=el('div','duo');$('#b2types').append(duo);
    const q=v=>"'"+v+"'";
    const rows=[['',4],['ab',4],['abcd',4],['abcdefgh',4]].map(([v])=>{const c=v.slice(0,4);return [q(v),q(c.padEnd(4,'·')),4,q(c),c.length+1]});
    const t=sTab(4,4,[{t:'value',w:84},{t:'CHAR(4)',w:72},{t:'bytes',w:46,a:'e'},{t:'VARCHAR(4)',w:86},{t:'bytes',w:46,a:'e'}],rows.map(r=>[r[0],r[1],{v:r[2],f:MSC},r[3],{v:r[4],f:MSC}]),{rh:28});
    cell(duo,'Bytes used by text',t.s,t.w+8,t.h+8,'CHAR and VARCHAR storage','CHAR always takes 4 bytes; VARCHAR takes the length plus 1.');
    let s='';const bw=26;
    [[12.5,'12.50'],[999.99,'999.99'],[1000.5,'1000.50']].forEach(([n,str],i)=>{const y=26+i*58,[ip,dp]=str.split('.'),ok=ip.length<=3;
      s+=tx(52,y+19,fe(n),{s:15,f:'#fff',a:'end'});
      const digits=ip.padStart(3,' ').split('');const x0=112-(ip.length>3?(ip.length-3)*bw:0);
      digits.forEach((d,k)=>{const x=x0+k*bw,extra=ip.length>3&&k<ip.length-3;s+=rect(x,y,bw-3,28,'#0d0d0d',extra?RED:'#666')+tx(x+(bw-3)/2,y+20,d===' '?'0':d,{s:15,f:extra?RED:(d===' '?'#444':'#fff')})});
      const xp=x0+digits.length*bw;s+=tx(xp+4,y+22,'.',{s:16,f:'#fff'});
      dp.split('').forEach((d,k)=>{const x=xp+12+k*bw;s+=rect(x,y,bw-3,28,'#0d0d0d','#666')+tx(x+(bw-3)/2,y+20,d,{s:15,f:'#fff'})});
      s+=tx(272,y+19,ok?'fits':'does not fit',{s:14,f:ok?GRN:RED,a:'start'})});
    cell(duo,'Numbers in DECIMAL(5,2)',s,370,196,'DECIMAL(5,2) boxes','Room for 3 digits before the point: the largest value is 999.99.');
  })();
  /* full scan versus index */
  (function(){
    const duo=el('div','duo'),root=$('#b2idx');root.append(legend([['#8a8a8a','rows read','box'],[GRN,'row found','box']]),duo);
    const n=64,target=37,r=lcg(5),perm=[...Array(n).keys()].map(i=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}
    const pos=perm.indexOf(target);let lo=0,hi=n-1;const probes=[];while(lo<=hi){const mid=(lo+hi)>>1;probes.push(mid);if(mid+1===target)break;if(mid+1<target)lo=mid+1;else hi=mid-1}
    const grid=(lab,fill)=>{let s='';for(let i=0;i<n;i++){const x=6+(i%8)*36,y=6+Math.floor(i/8)*36,f=fill(i);s+=rect(x,y,33,33,f||'#1a1a1a')+tx(x+16.5,y+22,lab(i),{s:13,f:f===GRN||f==='#8a8a8a'?'#000':'#ccc'})}return s};
    cell(duo,'Full table scan',grid(i=>perm[i],i=>i<pos?'#8a8a8a':i===pos?GRN:null),300,300,'Full table scan grid','Reads <b>'+(pos+1)+'</b> rows of 64; in the worst case all 64.');
    cell(duo,'Search through the index',grid(i=>i+1,i=>{const k=probes.indexOf(i);return k<0?null:k===probes.length-1?GRN:'#8a8a8a'}),300,300,'Index search grid','Reads <b>'+probes.length+'</b> rows; never more than 7 for 64 rows.');
  })();
  /* update anomaly versus third normal form */
  (function(){
    const duo=el('div','duo');$('#b2anom').append(duo);const NEW='123-000000',OLD='123-456789';
    let s=mono(8,18,'UPDATE Employee')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">employee_id = 1</tspan>;');
    const C1=[{t:'emp_id',w:52,a:'e',c:PKC},{t:'name',w:52},{t:'dep_code',w:66},{t:'dep_name',w:70},{t:'dep_phone',w:96}];
    const t1=sTab(4,70,C1,[[1,'Mary','FIN','Finance',{v:NEW,f:'#fff',bg:BADBG}],[2,'John','FIN','Finance',{v:OLD,bg:BADBG}],[3,'Lucy','FIN','Finance',{v:OLD,bg:BADBG}]]);
    s+=t1.s;cell(duo,'One Employee table',s,344,70+t1.h+8,'Denormalized table after the update','<span class="bad">Finance now has 2 phone numbers.</span> Two rows were never updated.');
    s=mono(8,18,'UPDATE Department')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">dep_id = 1</tspan>;');
    const t2=sTab(4,70,[{t:'dep_id',w:52,a:'e',c:PKC},{t:'dep_code',w:68},{t:'dep_name',w:72},{t:'dep_phone',w:96}],[[1,'FIN','Finance',{v:NEW,bg:OKBG}]]);
    const t3=sTab(4,70+t2.h+16,[{t:'emp_id',w:52,a:'e',c:PKC},{t:'first',w:52},{t:'last',w:58},{t:'dep_id',w:52,a:'e',c:FKC}],[[1,'Mary','Johns',{v:1,f:FKC}],[2,'John','White',{v:1,f:FKC}],[3,'Lucy','Smith',{v:1,f:FKC}]]);
    s+=t2.s+t3.s;cell(duo,'Department + Employee (third normal form)',s,344,70+t2.h+16+t3.h+8,'Normalized tables after the update','<span class="ok">Finance has 1 phone number,</span> stored in one row.');
  })();
  /* OLTP schema versus warehouse schema */
  (function(){
    const duo=el('div','duo'),root=$('#b2shape');root.append(legend([[PRC,'tables and joins needed by the question'],['#555','other tables and links']]),duo);
    const draw=(nodes,edges,path,bw)=>{let s='';const P=new Set(path.flat());
      edges.forEach(([a,b])=>{const on=path.some(([u,v])=>(u===a&&v===b)||(u===b&&v===a));s+=line(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],on?PRC:'#555',on?3:1.5)});
      Object.entries(nodes).forEach(([k,[x,y]])=>{const on=P.has(k);s+=rect(x-bw/2,y-14,bw,28,'#0b0b0b',on?PRC:'#555',on?' stroke-width="2"':'')+tx(x,y+5,k,{s:14,f:on?'#fff':'#999'})});return s};
    const N1={Continents:[62,22],Countries:[62,74],Cities:[62,126],Addresses:[62,178],Shops:[62,238],Customers:[180,178],sales_header:[180,238],Colors:[180,126],Categories:[298,22],Subcategory:[298,74],Product:[298,126],sales_details:[298,178]};
    const E1=[['Continents','Countries'],['Countries','Cities'],['Cities','Addresses'],['Addresses','Customers'],['Addresses','Shops'],['Customers','sales_header'],['Shops','sales_header'],['sales_header','sales_details'],['sales_details','Product'],['Product','Colors'],['Product','Subcategory'],['Subcategory','Categories']];
    const P1=[['sales_details','sales_header'],['sales_header','Customers'],['Customers','Addresses'],['Addresses','Cities'],['Cities','Countries'],['Countries','Continents'],['sales_details','Product'],['Product','Subcategory'],['Subcategory','Categories']];
    cell(duo,'OLTP: 12 normalized tables',draw(N1,E1,P1,108),360,256,'OLTP schema','<b>10 tables, 9 joins.</b> Continent and category sit at the far ends of two chains.');
    const N2={'Fact Sales':[180,128],'Dim Customers':[70,40],'Dim Product':[290,40],'Dim Shops':[70,216],'Dim Date':[290,216],'Dim Time':[180,40]};
    const E2=[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product'],['Fact Sales','Dim Shops'],['Fact Sales','Dim Date'],['Fact Sales','Dim Time']];
    cell(duo,'Data warehouse: facts and dimensions',draw(N2,E2,[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product']],104),360,256,'Warehouse schema','<b>3 tables, 2 joins.</b> Continent is a column of Dim Customers, category a column of Dim Product.');
  })();
  /* one fact row read through its surrogate keys */
  (function(){
    const order=[5,2,4,1,3],dc=order.map((cid,i)=>{const c=CUST.find(x=>x[0]===cid);return [i+1,cid,capw(c[1])+' '+capw(c[2]),capw(c[3])]});
    const dd=[[1,'2018-09-01','Saturday'],[2,'2018-09-02','Sunday'],[3,'2018-09-03','Monday']],dp=[[1,'abc'],[2,'xyz']];
    const fact=SAL.map(r=>[dd.find(d=>d[1]===r[1])[0],dc.find(c=>c[1]===r[2])[0],dp.find(p=>p[1]===r[3])[0],r[4],r[4]*r[5]]);const sel=2,f=fact[sel];
    const K=v=>({v,f:PKC});let s='';
    const Cc=[{t:'cust_key',w:66,a:'e',c:PKC},{t:'business key',w:96,a:'e'},{t:'name',w:108},{t:'city',w:76}];
    const tc=sTab(6,26,Cc,dc.map(r=>[K(r[0]),r[1],r[2],r[3]]),{bg:i=>dc[i][0]===f[1]?HLBG:null});
    const Cp=[{t:'prod_key',w:68,a:'e',c:PKC},{t:'business key',w:96}],xp=372;
    const tp=sTab(xp,26,Cp,dp.map(r=>[K(r[0]),r[1]]),{bg:i=>dp[i][0]===f[2]?HLBG:null});
    const Cd=[{t:'date_key',w:66,a:'e',c:PKC},{t:'date',w:88},{t:'day',w:76}],xd=xp,yd=26+tp.h+46;
    const td=sTab(xd,yd,Cd,dd.map(r=>[K(r[0]),r[1],r[2]]),{bg:i=>dd[i][0]===f[0]?HLBG:null});
    s+=tc.s+tp.s+td.s+tx(6+173,16,'Customer dimension',{s:14,f:GRAY})+tx(xp+82,16,'Product dimension',{s:14,f:GRAY})+tx(xd+115,yd-8,'Date dimension',{s:14,f:GRAY});
    const Cf=[{t:'date_key',w:70,a:'e',c:FKC},{t:'cust_key',w:70,a:'e',c:FKC},{t:'prod_key',w:70,a:'e',c:FKC},{t:'quantity',w:70,a:'e',c:MSC},{t:'amount',w:70,a:'e',c:MSC}];
    const yf=288,xf=150,FK=v=>({v,f:FKC});
    const tf=sTab(xf,yf,Cf,fact.map(r=>[FK(r[0]),FK(r[1]),FK(r[2]),{v:r[3],f:MSC},{v:fe(r[4]),f:MSC}]),{bg:i=>i===sel?HLBG:null});
    s+=tf.s+tx(xf+175,yf-10,'Sales fact table',{s:14,f:GRAY});
    svgBox($('#b2star'),720,yf+tf.h+12,s,'A fact row linked to its dimension rows','46rem');
    $('#b2star').append(el('div','cellnote','The highlighted sale reads: on Sunday 2018-09-02, Mark Smith from Liverpool bought 10 units of xyz for 15. His surrogate key is 5, his business key 3.'));
  })();
  /* UPDATE and DELETE, with and without WHERE */
  (function(){
    const m=el('div','duo');$('#b2dml').append(m);const C=[{t:'id',w:30,a:'e',c:PKC},{t:'first',w:48},{t:'last',w:48},{t:'city',w:76}];
    const st=[[10,'mark','smith','liverpool'],[20,'mary','jane','london']];
    [['Start',['two rows inserted','by the script',''],st,[]],
     ['DELETE',['DELETE FROM Customers','WHERE <tspan style="fill:'+PRC+'">customer_id = 10</tspan>;',''],[st[1]],[]],
     ['UPDATE',['UPDATE Customers',"SET city = 'Milan'",'WHERE <tspan style="fill:'+PRC+'">customer_id = 20</tspan>;'],[[20,'mary','jane','Milan']],[0]],
     ['UPDATE without WHERE',['UPDATE Customers',"SET city = 'Milan';",''],[[10,'mark','smith','Milan'],[20,'mary','jane','Milan']],[0,1]]].forEach(([title,sql,rows,ch])=>{
      let s=sql.map((l,i)=>mono(4,16+i*18,l,{s:12.5,f:title==='Start'?GRAY:'#ddd'})).join('');
      const t=sTab(2,62,C,rows,{bg:i=>ch.includes(i)?(title.includes('without')?BADBG:HLBG):null});
      cell(m,title,'<g transform="translate(43,0)">'+s+t.s+'</g>',300,62+26+2*25+6,title,title==='Start'?'Both customers.':title==='DELETE'?'1 row deleted.':title==='UPDATE'?'1 row updated.':'<span class="bad">2 rows updated:</span> every row.')});
  })();
  /* CASE branches */
  (function(){
    const br=c=>c==='milan'?0:(c==='liverpool'||c==='london')?1:2,lab=['Italy','UK','N/A'],bgc=['rgba(255,255,255,.16)','rgba(255,255,255,.08)',null];
    const t=sTab(4,4,[{t:'customer_id',w:90,a:'e',c:PKC},{t:'last_name',w:84},{t:'city',w:84},{t:'Country',w:76},{t:'branch',w:150,c:PRC}],CUST.map(c=>[c[0],c[2],c[3],{v:lab[br(c[3])],b:1},{v:['WHEN city = \'milan\'','WHEN city IN (...)','ELSE'][br(c[3])],f:PRC}]),{bg:i=>bgc[br(CUST[i][3])]});
    svgBox($('#b2case'),t.w+8,t.h+8,t.s,'CASE query result','34rem');
  })();
  /* a SELECT step by step */
  (function(){
    let s='';const rows=SAL.map(r=>({id:r[0],d:r[1],p:r[3],q:r[4],pr:r[5],a:r[4]*r[5]})),keep=r=>r.p==='xyz';
    const C1=[{t:'id',w:28,a:'e'},{t:'product',w:62},{t:'qty',w:38,a:'e'},{t:'price',w:48,a:'e'}];
    const t1=sTab(2,44,C1,rows.map(r=>[r.id,r.p,r.q,r.pr.toFixed(2)]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    const kept=rows.filter(keep),C2=[{t:'sales_date',w:84},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'amount',w:58,a:'e',c:MSC}];
    const x2=206,t2=sTab(x2,44,C2,kept.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    const sorted=kept.slice().sort((a,b)=>b.q-a.q),x3=x2+238+28;
    const t3=sTab(x3,44,C2,sorted.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    s+=t1.s+t2.s+t3.s+tx(2+88,16,'1. FROM and WHERE',{s:14,f:'#fff',w:500})+tx(2+88,34,'3 of 6 rows kept',{s:13,f:GRAY})+tx(x2+119,16,'2. SELECT list',{s:14,f:'#fff',w:500})+tx(x2+119,34,'4 columns, amount computed',{s:13,f:GRAY})+
      tx(x3+119,16,'3. ORDER BY',{s:14,f:'#fff',w:500})+tx(x3+119,34,'quantity, largest first',{s:13,f:GRAY});
    s+=tx(x2-14,130,'→',{s:20,f:GRAY})+tx(x3-14,130,'→',{s:20,f:GRAY});
    svgBox($('#b2sel'),720,44+t1.h+8,s,'A SELECT query step by step','46rem');
  })();
};
QZ['2a']=()=>[{q:'Which kind of integrity does the constraint <code>CHECK (quantity &gt; 0)</code> protect?',o:['Entity integrity','Referential integrity','Domain integrity','None: CHECK is only a comment'],a:2,
  e:'CHECK, together with data types and NULL constraints, keeps all the values of a column inside the same domain.',h:'Recall the three kinds of integrity and which tool protects each one.'}];
QZ['2b']=()=>[{q:'The table Employee(employee_id, first_name, last_name, dep_code, dep_name, dep_phone) breaks which rule?',
  o:['First normal form, because some values are not atomic','Entity integrity, because duplicates are allowed','Third normal form, because of a transitive dependency','Domain integrity, because phones are text'],a:2,
  e:'Department name and phone depend on the department code, a non-key column, so the table has a transitive dependency and breaks third normal form.',h:'Ask, column by column, what each value depends on.'}];
QZ['2c']=()=>[{q:'On the six course sales, how many rows does <code>WHERE product_name = \'abc\' OR product_name = \'xyz\' AND quantity &gt; 5</code> return?',o:['1','3','6','4'],a:3,
  e:'AND binds tighter than OR, so the condition reads product = \'abc\' OR (product = \'xyz\' AND quantity &gt; 5). The three abc sales pass, plus sale 3 (xyz, 10): four rows.',h:'Evaluate AND before OR, then count the rows that satisfy either side.'}];
QZ['2d']=()=>[{q:'With the CASE query above on the five course customers, how many rows get Country = \'UK\'?',o:['2','1','3','5'],a:2,
  e:'doe and jane live in london, smith in liverpool: three rows match city IN (\'liverpool\', \'london\'). Rossi gets Italy, Bianchi (rome) gets N/A.',h:'Go through the five cities and see which WHEN each one matches first.'}];
QZ['2']=()=>[
  {q:'Which value does <b>not</b> fit in a DECIMAL(5,2) column?',o:['999.99','12.5','1000.5','-45.1'],a:2,
   e:'Five digits in total, two after the point, so at most three before it: 1000.5 needs four.',h:'DECIMAL(precision, scale): precision counts all digits, scale only those after the point.'},
  {q:'In a data warehouse, which tables are kept in third normal form?',o:['The fact tables','The dimensions','Both','Neither: a warehouse is never normalized'],a:0,
   e:'Dimensions are denormalized (first normal form) for simple reading; fact tables, with measures and keys, are normalized (third normal form).',h:'Think about which kind of table is long and thin, made of keys and numbers, and which collects every attribute of one entity.'},
  {q:'On the five course customers, after <code>UPDATE Customers SET city = \'milan\';</code> how many customers live in Milan?',o:['1','5','2','0, the statement is refused'],a:1,
   e:'With no WHERE, UPDATE sets the city of every row: all five customers now live in Milan.',h:'Which part of an UPDATE limits the rows it touches, and is it there?'},
  {q:'In <code>SELECT * FROM Sales WHERE price*quantity &gt; 10</code>, what is the predicate?',o:['price*quantity','WHERE','price*quantity &gt; 10','Sales'],a:2,
   e:'A predicate is a logical condition, true or false for each row; price*quantity alone is an expression, and WHERE is the clause.',h:'Recall the definitions of clause, expression and predicate.'},
  {q:'In the small warehouse of the lesson, which customer does surrogate key cust_key = 1 point to?',o:['Marco Rossi, business key 1','John Doe, business key 2','Mark Smith, business key 3','Mario Bianchi, business key 5'],a:3,
   e:'Surrogate keys follow the load order (Bianchi, Doe, Jane, Rossi, Smith), so key 1 is Mario Bianchi, whose business key is 5.',h:'A surrogate key is created by ETL in load order, not copied from the source.'}
];

/* Lesson 3: how do you combine two tables */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  /* cartesian product with the ON predicate */
  (function(){
    let s='';const x0=150,cw=106,y0=58,rh=42;
    BSL.forEach((sl,j)=>{const x=x0+j*cw+cw/2;s+=tx(x,20,'qty '+sl[2],{s:13.5,f:GRAY})+tx(x,40,'buyer_id '+sl[0],{s:13.5,f:FKC})});
    BUY.forEach((b,i)=>{const y=y0+i*rh;s+=tx(x0-12,y+18,b[0],{s:14,a:'end',f:'#fff'})+tx(x0-12,y+35,'buyer_id '+b[1],{s:13,a:'end',f:PKC});
      BSL.forEach((sl,j)=>{const m=b[1]===sl[0],x=x0+j*cw;s+=rect(x+4,y+3,cw-8,rh-6,m?'rgba(255,134,47,.85)':'#141414',m?PRC:'#2a2a2a')+tx(x+cw/2,y+26,b[1]+' = '+sl[0],{s:14,f:m?'#000':'#666'})})});
    svgBox($('#b3cart'),720,y0+4*rh+8,s,'Cartesian product of buyers and sales','46rem');
    $('#b3cart').append(el('div','cellnote','20 pairs, 5 with a true predicate. Lucy Thin\'s row has no orange cell: she bought nothing.'));
  })();
  /* four joins */
  (function(){
    const duo=el('div','duo'),root=$('#b3joins');root.append(legend([[PUR,'NULL: no partner found','box']]),duo);
    const sales=BSL.concat([[9,4,7]]),C=[{t:'buyer_name',w:84},{t:'b.id',w:42,a:'e',c:PKC},{t:'s.id',w:42,a:'e',c:FKC},{t:'qty',w:48,a:'e'}];
    const inner=[];BUY.forEach(b=>sales.forEach(sl=>{if(b[1]===sl[0])inner.push([b[0],b[1],sl[0],sl[2]])}));
    const lostB=BUY.filter(b=>!sales.some(sl=>sl[0]===b[1])).map(b=>[b[0],b[1],null,null]);
    const lostS=sales.filter(sl=>!BUY.some(b=>b[1]===sl[0])).map(sl=>[null,null,sl[0],sl[2]]);
    const maxRows=inner.length+lostB.length+lostS.length;
    [['INNER JOIN',inner,'only matching pairs'],['LEFT OUTER JOIN',inner.concat(lostB),'every buyer kept'],['RIGHT OUTER JOIN',inner.concat(lostS),'every sale kept'],['FULL OUTER JOIN',inner.concat(lostB,lostS),'both sides kept']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows,{bg:i=>i>=inner.length?'rgba(202,163,232,.16)':null});
      tabCell(duo,title,t,'<b>'+rows.length+' rows:</b> '+note+'.',330,'',26+maxRows*25+8)});
  })();
  /* UNION and UNION ALL */
  (function(){
    const duo=el('div','duo');$('#b3union').append(duo);const C=[{t:'id',w:40,a:'e'},{t:'descr',w:60},{t:'from',w:70}];
    [['UNION',[[1,'a','t1 and t2'],[2,'b','t1'],[3,'c','t2']],'3 rows: the duplicate is removed.'],['UNION ALL',[[1,'a','t1'],[2,'b','t1'],[1,'a','t2'],[3,'c','t2']],'4 rows: the duplicate stays.']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows.map(r=>[r[0],r[1],{v:r[2],f:GRAY}]),{bg:i=>rows[i][0]===1?HLBG:null});tabCell(duo,title,t,note,330,'',26+4*25+8)});
  })();
  /* three valued logic and a left join */
  (function(){
    let s='';const V=v=>v===null?{v:'UNKNOWN',f:NLC}:v?{v:'TRUE',f:GRN}:{v:'FALSE',f:RED};
    const t1=sTab(4,30,[{t:'comparison',w:130},{t:'outcome',w:90}],[['5 &gt; 2',V(true)],['1 = 1',V(true)],[{v:'NULL &gt; 99'},V(null)],[{v:'NULL = NULL'},V(null)],[{v:'5 &lt;&gt; NULL'},V(null)]]);
    s+=t1.s+tx(114,18,'Comparisons',{s:14,f:'#fff',w:500});
    const rows=[];CUST.forEach(c=>{const ss=SAL.filter(r=>r[2]===c[0]);if(ss.length)ss.forEach(r=>rows.push([c[2],r[2],r[3],r[4]]));else rows.push([c[2],null,null,null])});
    const C=[{t:'last_name',w:78},{t:'s.cust_id',w:66,a:'e',c:FKC},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'= NULL',w:82,a:'m',c:PRC},{t:'IS NULL',w:66,a:'m',c:PRC}];
    const t2=sTab(262,30,C,rows.map(r=>[r[0],r[1],r[2],r[3],V(null),V(r[1]===null)]),{bg:i=>rows[i][1]===null?'rgba(202,163,232,.16)':null});
    s+=t2.s+tx(262+194,18,'Customers c LEFT JOIN Sales s',{s:14,f:'#fff',w:500});
    svgBox($('#b3null'),720,30+t2.h+8,s,'Three valued logic and a left join','46rem');
    $('#b3null').append(el('div','cellnote','<code>WHERE s.customer_id = NULL</code> keeps <span class="bad">0</span> rows: every row is UNKNOWN. <code>WHERE s.customer_id IS NULL</code> keeps <span class="ok">1</span>: Bianchi, the customer with no sales.'));
  })();
  /* how GROUP BY works */
  (function(){
    const rows=[[43659,29825],[43660,29672],[43661,29734],[43662,29994],[43663,29565],[51803,30097],[69427,30097],[44529,30098],[46063,30098],[75123,18759]];
    const keep=r=>r[1]===30097||r[1]===30098;let s='';
    const C=[{t:'OrderID',w:70,a:'e'},{t:'CustomerID',w:86,a:'e'}];
    const t1=sTab(4,30,C,rows.map(r=>[r[0],{v:r[1],f:keep(r)?'#fff':GRAY}]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    s+=t1.s+tx(82,18,'Orders',{s:14,f:'#fff',w:500});
    s+=tx(222,104,'WHERE',{s:13.5,f:PRC})+tx(222,122,'CustomerID IN',{s:13,f:PRC})+tx(222,140,'(30097, 30098)',{s:13,f:PRC})+tx(222,166,'→',{s:20,f:GRAY});
    const g=[[[51803,30097],[69427,30097]],[[44529,30098],[46063,30098]]];
    g.forEach((gr,k)=>{const y=60+k*110;const t=sTab(306,y,C,gr);s+=t.s+'<path d="M300 '+(y+30)+'h-6v'+(t.h-30)+'h6" fill="none" stroke="'+MSC+'" stroke-width="2"/>'});
    s+=tx(384,46,'GROUP BY CustomerID',{s:13.5,f:'#fff',w:500});
    s+=tx(520,166,'COUNT(*)',{s:13.5,f:MSC})+tx(520,188,'→',{s:20,f:GRAY});
    const t3=sTab(560,124,[{t:'CustomerID',w:86,a:'e'},{t:'COUNT(*)',w:70,a:'e',c:MSC}],[[30097,{v:2,f:MSC}],[30098,{v:2,f:MSC}]]);
    s+=t3.s+tx(638,112,'Result',{s:14,f:'#fff',w:500});
    svgBox($('#b3group'),720,30+t1.h+8,s,'How GROUP BY works','46rem');
  })();
  /* HAVING with and without WHERE */
  (function(){
    const duo=el('div','duo'),root=$('#b3having');root.append(legend([[GRN,'product that passes HAVING','box'],['#555','product filtered out','box'],[PRC,'HAVING SUM(quantity) &gt; 60']]),duo);
    const names={1:'Chai',2:'Chang',3:'Aniseed Syrup',4:'Cajun'};
    [['All items',0],['WHERE quantity &gt; 10',10]].forEach(([title,w])=>{
      const W=340,L=104,R=318,X=v=>L+v/80*(R-L);let s='';
      [0,20,40,60,80].forEach(v=>{s+=line(X(v),10,X(v),182,'#222',1)+tx(X(v),200,v,{s:13,f:GRAY})});
      [1,2,3,4].forEach((p,i)=>{const its=ITEMS.filter(it=>it[1]===p&&it[2]>w),sum=its.reduce((a,it)=>a+it[2],0),ok=sum>60,y=20+i*42;
        s+=tx(L-8,y+19,names[p],{s:13.5,a:'end',f:'#fff'})+rect(L,y+2,X(sum)-L,26,ok?GRN:'#555')+lbl(X(sum)+6,y+20,sum,ok?GRN:GRAY,{a:'start'})});
      s+=line(X(60),6,X(60),186,PRC,2.5)+tx((L+R)/2,218,'total quantity',{s:13,f:GRAY});
      cell(duo,title,s,W,226,title,w?'Only <b>Cajun (65)</b> passes: its items are large.':'<b>Chang (71)</b> and <b>Cajun (65)</b> pass.')});
  })();
  /* self-contained versus correlated subquery */
  (function(){
    const duo=el('div','duo');$('#b3subq').append(duo);
    const rows=ORD.slice().sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]-b[1]);const max=rows.reduce((m,r)=>r[0]>m?r[0]:m,'');
    const last=cid=>rows.filter(r=>r[1]===cid).reduce((m,r)=>r[0]>m?r[0]:m,'');
    let t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'inner result',w:96,c:MSC}],rows.map(r=>[r[2],r[0],{v:max,f:MSC}]),{bg:i=>rows[i][0]===max?OKBG:null,op:i=>rows[i][0]===max?1:.45});
    cell(duo,'Self-contained: runs once',t.s,t.w+8,t.h+8,'Self-contained subquery','<b>1 row:</b> Anders, who placed the last order (2018-07-15).');
    t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'inner result',w:96,c:MSC}],rows.map(r=>[r[2],r[0],{v:last(r[1]),f:MSC}]),{bg:i=>rows[i][0]===last(rows[i][1])?OKBG:null,op:i=>rows[i][0]===last(rows[i][1])?1:.45});
    cell(duo,'Correlated: runs once per order',t.s,t.w+8,t.h+8,'Correlated subquery','<b>2 rows:</b> the last order of each customer.');
  })();
  /* four window functions */
  (function(){
    const duo=el('div','duo'),root=$('#b3win');root.append(legend([[WNC,'rows in the window of the marked row','box'],['#fff','marked row','dash']]),duo);
    const C=[{t:'name',w:68},{t:'date',w:50},{t:'amount',w:66,a:'e'},{t:'',w:84,a:'e',c:WNC}];
    const byDate=ORD.slice();const part=cid=>byDate.filter(r=>r[1]===cid);
    const panel=(title,colname,rows,vals,winOf,mark,extra,note)=>{const cc=C.map((c,j)=>j===3?{...c,t:colname}:c);
      const t=sTab(4,4,cc,rows.map((r,i)=>[r[2],r[0].slice(5),fe(r[3]),{v:fe(vals[i]),f:WNC}]),{bg:i=>i===mark?'rgba(92,208,179,.45)':winOf.includes(i)?WINBG:null});
      let s=t.s+(mark>=0?rect(4,4+26+mark*25,t.w,25,'none','#fff',' stroke-width="1.5" stroke-dasharray="4 3"'):'')+(extra||'');
      cell(duo,title,s,t.w+40,t.h+8,title,note)};
    /* ROW_NUMBER over amount descending */
    const rn=[1,2].flatMap(c=>part(c).slice().sort((a,b)=>b[3]-a[3]));const rnv=rn.map(r=>rn.filter(x=>x[1]===r[1]).indexOf(r)+1);
    panel('ROW_NUMBER()','rn',rn,rnv,[],-1,'','ORDER BY TotalAmount DESC: rn = 1 is each customer\'s largest order.');
    /* LAG */
    const lag=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return k?p[k-1][3]:0});
    let ar='<defs>'+arrowDef('b3la',GRAY)+'</defs>';byDate.forEach((r,i)=>{const p=part(r[1]),k=p.indexOf(r);if(k){const y1=4+26+(i-1)*25+13,y2=y1+25;ar+='<path d="M'+(4+186)+' '+(y1-2)+' L'+(4+206)+' '+(y2-4)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2" marker-end="url(#b3la)"/>'}});
    panel('LAG(TotalAmount, 1, 0)','Previous',byDate,lag,[],-1,ar,'Each row gets the previous amount of the same customer; the first gets the default 0.');
    /* moving average and running total */
    const avg=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r),w=p.slice(Math.max(0,k-2),k+1);return w.reduce((a,x)=>a+x[3],0)/w.length});
    panel('AVG, 2 PRECEDING to CURRENT ROW','MovingAvg',byDate,avg,[0,1],2,'','Window of Anders\' third order: his first three orders, average 974.6.');
    const run=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return p.slice(0,k+1).reduce((a,x)=>a+x[3],0)});
    panel('SUM, UNBOUNDED PRECEDING','RunningTotal',byDate,run,[0,1,2],3,'','Window of Anders\' fourth order: all his orders so far, total 3549.');
  })();
};
QZ['3a']=()=>[{q:'After <code>Customers c LEFT JOIN Sales s ON c.customer_id = s.customer_id</code>, how many rows does <code>WHERE s.customer_id = NULL</code> keep?',
  o:['1, Bianchi, who has no sales','7','0','An error is raised'],a:2,
  e:'s.customer_id = NULL is UNKNOWN on every row, Bianchi\'s included, and WHERE drops UNKNOWN: zero rows. IS NULL would return Bianchi.',h:'What does comparing anything with NULL using = return, and which outcomes does WHERE keep?'}];
QZ['3b']=()=>[{q:'Same moving average. What is its value on Anders\' fourth order (625.2)?',o:['974.6','1036.33','887.25','625.2'],a:1,
  e:'The window holds his orders 2, 3 and 4: (1813 + 670.8 + 625.2) / 3 = 1036.33.',h:'Work out which of his orders fall in the window of the fourth one, then average them.'}];
QZ['3']=()=>[
  {q:'With the lecture\'s buyers and sales (no extra sale), how many rows does <code>buyers LEFT OUTER JOIN sales</code> return?',o:['4','5','6','20'],a:2,
   e:'Adam and Pil have two sales each, Eva one, and Lucy none but still one row with NULLs: 2 + 2 + 1 + 1 = 6.',h:'Count the result rows buyer by buyer; a buyer with no sales still appears once.'},
  {q:'With t1 = {(1,\'a\'), (2,\'b\')} and t2 = {(1,\'a\'), (3,\'c\')}, how many rows do UNION and UNION ALL return?',o:['4 and 4','3 and 3','2 and 4','3 and 4'],a:3,
   e:'Both tables contain (1, \'a\'): UNION ALL keeps all four rows, UNION removes the duplicate and returns three.',h:'Write out the four rows and look for one that appears in both tables.'},
  {q:'Why can\'t you write <code>WHERE SUM(quantity) &gt; 60</code> to keep the products sold in more than 60 units?',
   o:['Because WHERE filters rows before the aggregation, when the sums do not exist yet.','Because SUM ignores NULL values.','Because SUM can only appear in ORDER BY.','You can: WHERE and HAVING are interchangeable.'],a:0,
   e:'WHERE runs before grouping and cannot see aggregates. A condition on SUM goes in HAVING, which runs after GROUP BY.',h:'Think about the order in which the clauses are processed.'},
  {q:'<code>WHERE o.orderdate = (SELECT MAX(orderdate) FROM Orders o2 WHERE o2.customerid = o.customerid)</code> contains which kind of subquery?',o:['Self-contained','An EXISTS test','Table-valued','Correlated'],a:3,
   e:'The inner query uses o.customerid from the outer row, so it is correlated and evaluated again for each outer row.',h:'Look for a column of the outer query used inside the inner one.'},
  {q:'In the lecture\'s LAG example, what is PreviousPurchase on Trujillo\'s order of 1444.8?',o:['1863.4','3730','0','2490.5'],a:1,
   e:'Trujillo\'s orders in date order are 1863.4, 3730, 1444.8, 2490.5. On the third, LAG(TotalAmount, 1, 0) returns the second: 3730.',h:'LAG with n = 1 looks one row back inside the same partition, in OrderDate order.'}
];

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
const LAST=lessons.length,done={};
lessons.forEach(l=>{
  const n=+l.dataset.n,nav=l.querySelector('.navend');if(!nav)return;
  const card=(m,cls,lab)=>{const t=lessons[m-1].dataset.title;
    return '<a class="'+cls+'" href="#lezione-'+m+'" data-go="'+m+'"><span class="th" aria-hidden="true">'+(THUMB[m]||'')+'</span><span class="tx"><small>'+lab+'</small>'+m+' · '+t+'</span></a>'};
  nav.innerHTML=(n>1?card(n-1,'prev',UI.prev):'')+(n<LAST?card(n+1,'next',UI.next):'');
});
function show(n,scroll){
  lessons.forEach(l=>{l.hidden=+l.dataset.n!==n});
  links.forEach(a=>{if(+a.dataset.go===n){a.setAttribute('aria-current','page');try{a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(_){}}else a.removeAttribute('aria-current')});
  if(!done[n]){done[n]=true;const art=lessons[n-1];
    renderMath(art);
    try{if(INIT[n])INIT[n]()}catch(e){console.error(e)}
    art.querySelectorAll('[data-quiz]').forEach(q=>{const f=QZ[q.dataset.quiz];if(f)quiz(q,f())});
  }
  if(scroll)window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m?clamp(+m[1],1,LAST):1,false)})();
renderMath(document.querySelector('footer'));

})();
