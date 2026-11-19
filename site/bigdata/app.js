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
  askSys:'Sei un tutor. Rispondi in italiano, in modo breve e chiaro, basandoti sulla lezione fornita. Se la domanda esce dalla lezione, dillo.'};
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
  prev:'Previous lesson',next:'Next lesson',toLight:'Switch to light theme',toDark:'Switch to dark theme',ask:'Ask AI',askSend:'Ask',askKey:'Change key',askPrompt:'Gemini API key (kept only in this browser):',
  askSys:'You are a tutor. Answer in English, briefly and clearly, based on the lesson provided. If the question goes beyond the lesson, say so.'});
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
/* lessons 5 to 9: animation helpers */
const lerp=(a,b,t)=>a+(b-a)*t;
const stepAt=(steps,t)=>{let acc=0;for(let i=0;i<steps.length;i++){if(t<acc+steps[i]||i===steps.length-1)return {i,u:clamp((t-acc)/steps[i],0,1)};acc+=steps[i]}};
const OKC=GRN,FAILC=RED,SHC=ORG,ACTC=PINK;
/* a small box with centred text lines */
const box=(x,y,w,h,lines,o)=>{o=o||{};let s=rect(x,y,w,h,o.f||'#0d0d0d',o.st||'#666',o.sw?' stroke-width="'+o.sw+'"':'');const n=lines.length,fs=o.fs||13.5;
  lines.forEach((l,i)=>{s+=tx(x+w/2,y+h/2+(i-(n-1)/2)*(fs+4)+fs*.36,l,{s:i===0?fs:fs-1,f:i===0?(o.c||'#fff'):(o.c2||GRAY),w:i===0&&o.b?600:undefined})});return s};
/* lessons 5 to 9: wide single figures keep a readable size on phones */
const wideFigs=n=>$('#lezione-'+n).querySelectorAll('figure .w > div').forEach(d=>{if(d.querySelector(':scope > svg'))d.classList.add('wscroll')});

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
  THUMB[5]=sv([0,1,2].map(r=>'<rect x="'+(8+r*34)+'" y="10" width="30" height="52" fill="none" stroke="#666"/>').join('')+
    [[12,16],[46,30],[80,16],[12,44],[46,44],[80,30]].map(([x,y])=>'<rect x="'+x+'" y="'+y+'" width="22" height="10" fill="#e6e6e6"/>').join(''));
  THUMB[6]=sv('<rect x="8" y="10" width="20" height="14" fill="#141414" stroke="#9a9a9a"/><rect x="36" y="10" width="20" height="14" fill="#141414" stroke="#9a9a9a"/><rect x="64" y="10" width="20" height="14" fill="#141414" stroke="#9a9a9a"/><rect x="86" y="10" width="16" height="14" fill="none" stroke="'+PINK+'"/>'+
    '<line x1="60" y1="6" x2="60" y2="66" stroke="'+ORG+'" stroke-dasharray="3 2"/>'+[0,1].map(i=>'<rect x="10" y="'+(34+i*16)+'" width="40" height="12" fill="rgba(92,208,179,.25)" stroke="'+TEAL+'"/>').join('')+[0,1,2].map(i=>'<rect x="70" y="'+(32+i*12)+'" width="30" height="9" fill="rgba(92,208,179,.25)" stroke="'+TEAL+'"/>').join(''));
  THUMB[7]=sv('<g stroke="#fff" stroke-width="1.6"><line x1="24" y1="24" x2="54" y2="12"/><line x1="24" y1="24" x2="24" y2="56"/><line x1="24" y1="56" x2="54" y2="56"/><line x1="24" y1="24" x2="54" y2="56"/></g><g stroke="#9a9a9a" stroke-dasharray="3 2"><line x1="54" y1="12" x2="84" y2="24"/><line x1="84" y1="24" x2="84" y2="56"/><line x1="54" y1="56" x2="84" y2="56"/></g>'+
    [[24,24],[54,12],[84,24],[24,56],[54,56],[84,56]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="6" fill="#1a1a1a" stroke="#bbb"/>').join(''));
  THUMB[8]=sv('<rect x="8" y="12" width="52" height="48" fill="none" stroke="#666"/>'+Array.from({length:30},(_,i)=>'<circle cx="'+(14+(i*37)%42)+'" cy="'+(18+(i*23)%38)+'" r="1.6" fill="#8a8a8a"/>').join('')+
    '<line x1="62" y1="36" x2="72" y2="36" stroke="#777"/><rect x="74" y="20" width="28" height="32" fill="none" stroke="#bbb"/><rect x="79" y="27" width="18" height="4" fill="'+BLUE+'"/><rect x="79" y="35" width="12" height="4" fill="'+BLUE+'"/><rect x="79" y="43" width="15" height="4" fill="'+BLUE+'"/>');
  THUMB[9]=sv('<line x1="10" y1="62" x2="100" y2="62" stroke="#555"/>'+[2,7,13,18,33,64,97,149,181].map((v,i)=>'<rect x="'+(12+i*9.5)+'" y="'+(62-v*0.26)+'" width="7" height="'+(v*0.26)+'" fill="'+(i>6?'#9a9a9a':'#ddd')+'"/>').join(''));
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
QZ['1d']=()=>[{q:'A utility receives one reading every 15 minutes from each of 2 million smart meters, as a record with meter id, timestamp, kWh and a free-text technician note. How many readings arrive per day, and what kind of data is each record?',o:['192 million; semi-structured','2 million; structured','192 million; unstructured','48 million; semi-structured'],a:0,
  e:'A day has 24 × 4 = 96 quarter hours, so 2,000,000 × 96 = 192 million readings. Each record mixes fields that fit table columns with free text: semi-structured.',h:'Count the quarter hours in a day, then look at what each record contains.'}];
QZ['1']=()=>[
  {q:'On the six course sales, what is the revenue (quantity × price) of product abc, and what is the revenue of the customers who live in London?',o:['8 and 9','16.4 and 16.5','16.4 and 12','12.4 and 16.5'],a:1,
   e:'abc: 2 × 2 + 4 × 2 + 2 × 2.2 = 4 + 8 + 4.4 = 16.4. London is John Doe (customer 2) and Mary Jane (customer 4): sales 2, 4 and 6, so 4 + 8 + 4.5 = 16.5.',h:'Compute the amount of each sale first; then pick the rows by product, and by the city of the customer.'},
  {q:'In the pivot of the OLAP figure, what is the total quantity bought by London customers?',o:['6','3','10','9'],a:3,
   e:'London customers bought abc twice (2 and 4) and xyz once (3): 2 + 4 + 3 = 9.',h:'Find the London sales in the three date slices and add their quantities.'},
  {q:'Which of these is the lecture\'s example of semi-structured data?',o:['A tweet','The invoice table of an ERP','An X-ray image','A printed strategic report'],a:0,
   e:'A post mixes free text with key/value pairs such as author, date and location: that is what semi-structured means.',h:'Look for the item that contains both free content and labeled fields.'},
  {q:'Which of these is predictive rather than descriptive analytics?',o:['A monthly report of sales by region','An OLAP pivot of last year\'s margins','An estimate of next month\'s energy cost','A dashboard of yesterday\'s orders'],a:2,
   e:'Estimating the likelihood of a future value is predictive; the other three summarize what already happened.',h:'Recall the lecture\'s split: one kind of analytics describes, the other estimates.'},
  {q:'A retailer keeps 50 GB of sales in a relational database, and all its reports run in a few seconds. Under the lecturer\'s preferred definition, are these Big Data?',o:['Yes, because sales are generated continuously','Yes, because 50 GB is more than a laptop can hold','No, because they can be analyzed conveniently with traditional tools','No, because only social media data are Big Data'],a:2,
   e:'The lecturer defines Big Data as data we cannot analyze, or have no convenience to analyze, with traditional tools such as relational databases. Here the RDBMS copes well, so they are not Big Data.',h:'The preferred definition depends on the tools, not on a fixed size.'},
  {q:'The ERP lists 5 customers; the CRM lists 6, because Mary Jane appears twice, in Manchester and in London. In which ETL step are the two records merged, and how many customers should the warehouse count?',o:['Extract; 6','Load; 11','Transform; 6','Transform; 5'],a:3,
   e:'Deduplication and integration are business rules and quality checks, applied in the Transform step; both systems describe the same five people, so the warehouse counts 5.',h:'Match each customer of the CRM to one of the ERP.'}
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
  {q:'On the six course sales, how many rows does <code>WHERE price*quantity &gt; 4 AND customer_id &lt;&gt; 1 OR product_name = \'abc\'</code> return?',o:['3','4','5','6'],a:2,
   e:'AND is evaluated before OR. The AND part holds for sales 3 (15), 4 (8) and 6 (4.5); sale 2 has amount exactly 4 and sales 1 and 5 belong to customer 1. The OR adds the abc sales 2, 4 and 5. Together: sales 2, 3, 4, 5 and 6, five rows; only sale 1 is left out.',h:'Evaluate AND before OR, and compute each amount; watch the sale whose amount is exactly 4.'},
  {q:'In the small warehouse of the lesson, which customer does surrogate key cust_key = 1 point to?',o:['Marco Rossi, business key 1','John Doe, business key 2','Mark Smith, business key 3','Mario Bianchi, business key 5'],a:3,
   e:'Surrogate keys follow the load order (Bianchi, Doe, Jane, Rossi, Smith), so key 1 is Mario Bianchi, whose business key is 5.',h:'A surrogate key is created by ETL in load order, not copied from the source.'},
  {q:'With the Sales table defined in the lesson and customers 1 to 5, how many constraints does <code>INSERT INTO Sales VALUES (7, \'2018-09-04\', 9, \'abc\', 0, 2.00)</code> break?',o:['None','One','Two','Three'],a:2,
   e:'Customer 9 does not exist, so the foreign key (referential integrity) fails; quantity 0 breaks CHECK (quantity &gt; 0) (domain integrity). sales_id 7 is new, so the primary key is fine: two constraints.',h:'Check the new row column by column against the CREATE TABLE.'}
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
QZ['3c']=()=>[{q:'If the WHERE of the second panel were <code>quantity &gt;= 10</code> instead of <code>quantity &gt; 10</code>, which products would pass <code>HAVING SUM(i.quantity) &gt; 60</code>?',o:['Only Chef Anton\'s Cajun Seasoning','Chang and Chef Anton\'s Cajun Seasoning','Chai, Chang and Chef Anton\'s Cajun Seasoning','None'],a:1,
  e:'With >= 10 the items of exactly 10 come back: Chang becomes 10 + 40 + 15 = 65, Chai 12 + 15 = 27, Aniseed Syrup 10 + 35 = 45, Cajun stays 65. Chang and Cajun pass.',h:'Find the items with quantity exactly 10 and add them back to their products.'}];
QZ['3']=()=>[
  {q:'With the lecture\'s buyers and sales (no extra sale), how many rows does <code>buyers LEFT OUTER JOIN sales</code> return?',o:['4','5','6','20'],a:2,
   e:'Adam and Pil have two sales each, Eva one, and Lucy none but still one row with NULLs: 2 + 2 + 1 + 1 = 6.',h:'Count the result rows buyer by buyer; a buyer with no sales still appears once.'},
  {q:'With t1 = {(1,\'a\'), (2,\'b\')} and t2 = {(1,\'a\'), (3,\'c\')}, how many rows do UNION and UNION ALL return?',o:['4 and 4','3 and 3','2 and 4','3 and 4'],a:3,
   e:'Both tables contain (1, \'a\'): UNION ALL keeps all four rows, UNION removes the duplicate and returns three.',h:'Write out the four rows and look for one that appears in both tables.'},
  {q:'On the course OrderItem table, <code>SELECT orderid, SUM(quantity) FROM OrderItem GROUP BY orderid HAVING COUNT(*) &gt;= 2</code> returns how many rows, and which order has the largest sum?',o:['9 rows; order 2','6 rows; order 5','6 rows; order 2','3 rows; order 5'],a:1,
   e:'Orders 1 to 6 have two or more items (order 1 has three); orders 7, 8 and 9 have one item each and are dropped by HAVING. The sums are 27, 49, 45, 21, 50 and 21: order 5 (35 + 15 = 50) is the largest, just above order 2 (49).',h:'Count the items of each order first, then add their quantities.'},
  {q:'<code>WHERE o.orderdate = (SELECT MAX(orderdate) FROM Orders o2 WHERE o2.customerid = o.customerid)</code> contains which kind of subquery?',o:['Self-contained','An EXISTS test','Table-valued','Correlated'],a:3,
   e:'The inner query uses o.customerid from the outer row, so it is correlated and evaluated again for each outer row.',h:'Look for a column of the outer query used inside the inner one.'},
  {q:'In the lecture\'s LAG example, what is PreviousPurchase on Trujillo\'s order of 1444.8?',o:['1863.4','3730','0','2490.5'],a:1,
   e:'Trujillo\'s orders in date order are 1863.4, 3730, 1444.8, 2490.5. On the third, LAG(TotalAmount, 1, 0) returns the second: 3730.',h:'LAG with n = 1 looks one row back inside the same partition, in OrderDate order.'},
  {q:'On Trujillo\'s third order, what is the running total <code>SUM(TotalAmount) OVER (PARTITION BY customerid ORDER BY OrderDate ROWS UNBOUNDED PRECEDING)</code>, and what share is it of <code>SUM(TotalAmount) OVER (PARTITION BY customerid)</code> on the same row?',o:['7038.2, about 74%','5593.4, about 59%','7038.2, about 52%','9528.7, 100%'],a:0,
   e:'Running total: 1863.4 + 3730 + 1444.8 = 7038.2. The partition total is Trujillo\'s whole 9528.7, and 7038.2 / 9528.7 ≈ 0.74.',h:'The first window stops at the current row; the second covers the whole partition.'}
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
QZ['4c']=()=>[{q:'In a relational schema with tables Person, Movie, Directed (person_id, movie_id) and ActedIn (person_id, movie_id), how many JOINs does the query "films directed by Ava Reyes, with their actors" need?',o:['1','2','4','6'],a:2,
  e:'Person (director) → Directed → Movie → ActedIn → Person (actor): five table references, four joins. A graph database follows the two kinds of edges directly.',h:'Write the chain of tables from the director to the actors.'}];
QZ['4']=()=>[
  {q:'A Country column has 1,000,000 rows and 200 distinct values. With dictionary encoding, how many bits does each code need, and about how much space do the codes take?',o:['200 bits; about 25 MB','7 bits; about 0.9 MB','8 bits; about 1 MB','8 bits; about 8 MB'],a:2,
   e:'7 bits give only 128 codes, so 200 values need ⌈log₂ 200⌉ = 8 bits, one byte: 1,000,000 codes take about 1,000,000 bytes, 1 MB, plus a small dictionary.',h:'Find the smallest power of 2 that reaches 200, then convert bits to bytes.'},
  {q:'A transfer withdraws 100 from A, then the server crashes before the deposit to B. Which ACID property makes sure the withdrawal is undone?',o:['Atomicity','Durability','Isolation','Consistency'],a:0,
   e:'Atomicity is the all or nothing property: either both the withdrawal and the deposit happen, or neither does.',h:'Reread the four one-line meanings and match each to what went wrong here.'},
  {q:'In which NoSQL family does each record carry its own field names, can contain nested records, and need not match the structure of the others?',o:['Key-value','Graph oriented','Column-oriented','Document oriented'],a:3,
   e:'Self-describing, nestable records with no schema constraints are documents in JSON or XML, as in MongoDB and CouchDB.',h:'Compare the four panels of the models figure.'},
  {q:'A column of 1,200 rows holds the codes 0, 1, 2 and 3, 300 times each. Sorted, how many run-length triples does it need?',o:['1,200','300','2','4'],a:3,
   e:'Sorted, the column is 300 zeros, then 300 ones, 300 twos and 300 threes: four runs, four triples.',h:'Picture the sorted column: where does a new run start?'},
  {q:'Take a = (3, 4), b = (6, 8) and c = (4, −3). Which statement is true?',o:['b is closer to a than c both by cosine and by distance, with cosine 0.5','a and c have cosine similarity 1','a and b have cosine 1 and Euclidean distance 5; a and c have cosine 0','All three have the same cosine similarity'],a:2,
   e:'b = 2a points the same way: cosine 1, distance √(3² + 4²) = 5. a · c = 12 − 12 = 0, so a and c are perpendicular: cosine 0.',h:'Check whether b is a multiple of a, and compute the dot product of a and c.'},
  {q:'Which pairing of data and consistency model fits the lesson\'s discussion?',o:['Bank balances: BASE; social likes: ACID','Bank balances: ACID; a counter of likes on a social network: BASE','Both need BASE','Both need ACID, or the data are lost'],a:1,
   e:'A transfer must be all or nothing and always consistent (ACID); a like counter can be briefly stale on some nodes and become consistent later (BASE), in exchange for availability and scale.',h:'Ask where a temporarily wrong value would be acceptable.'}
];

/* Lesson 5: Hadoop, HDFS and MapReduce */
/* rack aware placement of four blocks, three copies each: one rack holds one copy, another rack two */
const PLACE={B1:[1,4,5],B2:[2,7,8],B3:[6,8,9],B4:[7,2,3]};
const onNode=n=>Object.keys(PLACE).filter(b=>PLACE[b].includes(n));
const chip=(x,y,b,o)=>{o=o||{};const w=o.w||46;return rect(x,y,w,22,o.dead?'#2a1515':'#e6e6e6',o.dead?'#5a2a2a':'none')+tx(x+w/2,y+16,b,{s:13,f:o.dead?'#7a4a4a':'#000',w:600})};
INIT[5]=function(){
  codeHL($('#lezione-5'));
  /* HDFS: blocks, replicas, name node */
  (function(){
    let s='';
    s+=tx(40,18,'file.csv, 512 MB',{s:14,f:'#fff',a:'start'});
    ['B1','B2','B3','B4'].forEach((b,i)=>{s+=rect(40+i*82,26,80,30,'#e6e6e6')+tx(80+i*82,46,b+' · 128 MB',{s:13,f:'#000'})});
    s+=rect(430,8,270,98,'#0d0d0d','#9a9a9a')+tx(565,28,'name node (metadata)',{s:14,f:'#fff',w:500});
    Object.keys(PLACE).forEach((b,i)=>{s+=tx(448,50+i*15,b+' → nodes '+PLACE[b].join(', '),{s:12.5,f:GRAY,a:'start'})});
    for(let r=0;r<3;r++){const rx=12+r*236;s+=rect(rx,130,224,196,'none','#444')+tx(rx+112,320,'rack '+(r+1),{s:13,f:GRAY});
      for(let k=0;k<3;k++){const n=r*3+k+1,nx=rx+8+k*72;s+=rect(nx,140,66,160,'#111','#666')+tx(nx+33,160,'node '+n,{s:13,f:'#fff'});
        onNode(n).forEach((b,j)=>s+=chip(nx+10,172+j*30,b))}}
    svgBox($('#b5hdfs'),720,332,s,'HDFS blocks and replicas on three racks','46rem');
  })();
  /* rack failure */
  (function(){
    const duo=el('div','duo');$('#b5fail').append(legend([[GRN,'block still readable','box'],[RED,'failed rack','box']]),duo);
    [0,2].forEach(dead=>{let s='';
      for(let r=0;r<3;r++){const rx=6+r*112,isDead=r+1===dead;s+=rect(rx,6,104,214,isDead?'rgba(252,98,85,.12)':'none',isDead?RED:'#444',isDead?' stroke-width="2"':'')+tx(rx+52,24,'rack '+(r+1)+(isDead?' (down)':''),{s:13,f:isDead?RED:GRAY});
        for(let k=0;k<3;k++){const n=r*3+k+1,ny=34+k*61;s+=rect(rx+6,ny,92,55,isDead?'#1a0d0d':'#111',isDead?'#5a2a2a':'#555')+tx(rx+52,ny+16,'node '+n,{s:12.5,f:isDead?'#7a4a4a':'#ccc'});
          {const two=onNode(n).length===2;onNode(n).forEach((b,j)=>s+=chip(two?rx+9+j*46:rx+29,ny+26,b,{dead:isDead,w:two?42:46}))}}}
      ['B1','B2','B3','B4'].forEach((b,i)=>{const alive=PLACE[b].some(n=>Math.ceil(n/3)!==dead);s+=tx(40+i*80,246,b+(alive?' ✓':' ✗'),{s:14,f:alive?GRN:RED,w:600})});
      cell(duo,dead?'Rack 2 fails':'All racks working',s,342,258,'Cluster state',dead?'Every block keeps at least one copy outside rack 2: <span class="ok">no data lost</span>.':'Each block has three copies on two racks.')});
  })();
  /* replication versus erasure coding */
  (function(){
    let s='';const L=180,R=600,X=v=>L+v/3*(R-L);
    [0,1,2,3].forEach(v=>{s+=line(X(v),16,X(v),118,'#222',1)+tx(X(v),136,v+' GB',{s:13,f:GRAY})});
    [['Replication factor 3',2,'3 GB stored'],['Erasure coding',0.5,'1.5 GB stored']].forEach(([l,o,t],i)=>{const y=26+i*48;
      s+=tx(L-12,y+21,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,X(1)-X(0),32,'#e6e6e6')+tx((X(0)+X(1))/2,y+21,'file',{s:13,f:'#000'})+rect(X(1),y,X(1+o)-X(1),32,'#6a6a6a')+tx((X(1)+X(1+o))/2,y+21,'+'+(o*100)+'%',{s:13,f:'#fff'})+tx(X(1+o)+8,y+21,t,{s:13.5,a:'start',f:'#fff'})});
    svgBox($('#b5ec'),720,146,s,'Storage of a 1 GB file with replication and erasure coding','46rem');
  })();
  /* MapReduce on A C B C A, animated */
  (function(){
    const root=$('#b5mr'),W=720,H=330;root.append(legend([[YEL,'key'],[BLUE,'value'],[ORG,'shuffle: pairs moving to their reducer']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const inp=['A','C','B','C','A'],keys=['A','B','C'],gy={A:70,B:165,C:260};
    const kv=(k,v,f)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
    const steps=[3,4,6,4,3],msgs=['The input "A C B C A" is split among five map tasks, each on the node that holds its part.','<b>Map.</b> Each task emits one pair: the letter as <span style="color:var(--yellow)">key</span>, 1 as <span style="color:var(--blue)">value</span>.',
      '<b>Sort, shuffle and group.</b> The system moves every pair to the reducer of its key and puts the values of the same key together: (A, {1, 1}), (B, {1}), (C, {1, 1}).','<b>Reduce.</b> Each reducer adds up the values of its key.','<b>Output.</b> (A, 2), (B, 1), (C, 2) are written to a file in HDFS.'];
    const iy=i=>45+i*58;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='';
      s+=tx(40,22,'input',{s:13,f:GRAY})+tx(170,22,'map',{s:13,f:GRAY})+tx(470,22,'sort and group by key',{s:13,f:GRAY})+tx(600,22,'reduce',{s:13,f:GRAY})+tx(686,22,'output',{s:13,f:GRAY});
      inp.forEach((c,k)=>{s+=tx(40,iy(k)+20,c,{s:18,f:'#fff',w:600});s+=rect(130,iy(k),80,32,'#111',i>=1?'#9a9a9a':'#444')+tx(170,iy(k)+21,'map',{s:13,f:i>=1?'#fff':'#666'})});
      keys.forEach(k=>{s+=rect(415,gy[k]-28,120,56,'#0d0d0d',i>=2?'#666':'#2a2a2a');s+=rect(568,gy[k]-18,64,36,'#111',i>=3?'#9a9a9a':'#333')+tx(600,gy[k]+5,'reduce',{s:12.5,f:i>=3?'#fff':'#555'})});
      inp.forEach((c,k)=>{const slot=inp.slice(0,k).filter(x=>x===c).length,many=inp.filter(x=>x===c).length>1,tx0=232,ty0=iy(k)+21,tx1=450,ty1=gy[c]+(many?(slot?16:-4):5);
        if(i===1){s+='<text x="'+tx0+'" y="'+ty0+'" font-size="14" opacity="'+e+'">'+kv(c,1)+'</text>'}
        if(i===2&&u<.97){const st=k*.15,ek=ease(clamp((u-st)/.3,0,1)),x=lerp(tx0,tx1,ek),y=lerp(ty0,ty1,ek);if(ek>0)s=line(212,ty0-5,x,y-5,ORG,1.5,' opacity=".8"')+s;s+='<text x="'+x+'" y="'+y+'" font-size="14" style="paint-order:stroke;stroke:#000;stroke-width:5px">'+kv(c,1)+'</text>'}});
      if(i>=3||(i===2&&u>=.97)){keys.forEach(k=>{const n=inp.filter(x=>x===k).length;s+='<text x="475" y="'+(gy[k]+5)+'" font-size="14" text-anchor="middle">'+kv(k,'{'+Array(n).fill(1).join(', ')+'}')+'</text>'})}
      if(i>=3){keys.forEach(k=>{const n=inp.filter(x=>x===k).length,a=i===3?e:1;s+='<text x="686" y="'+(gy[k]+5)+'" font-size="15" text-anchor="middle" opacity="'+a+'">'+kv(k,n)+'</text>'+line(634,gy[k],652,gy[k],'#777',1.5,' opacity="'+a+'"')})}
      if(i===4)s+=rect(650,40,72,250,'none','#9a9a9a',' stroke-dasharray="4 4"')+tx(686,312,'HDFS file',{s:12.5,f:GRAY});
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="MapReduce animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 5. '+msgs[i]}
    player(root,20,frame);
  })();
  /* word count, as in the slide */
  (function(){
    const words='The Apache Hadoop software library is a framework that allows for the distributed processing of large data sets across clusters of computers using simple programming models'.split(' ');
    const cnt={};words.forEach(w=>{const k=w.toLowerCase();cnt[k]=(cnt[k]||0)+1});const ks=Object.keys(cnt).sort();
    const K=v=>({v,f:YEL}),V=v=>({v,f:BLUE}),dots=[{v:'…',f:GRAY},{v:'',f:GRAY}];
    const m=words.slice(0,8).map(w=>[K(w),V(1)]).concat([dots]);
    const pick=['a','across','allows','apache','…','of','…','that','the','using'];
    const g=pick.map(k=>k==='…'?dots:[K(k),V(Array(cnt[k]).fill(1).join(', '))]),r=pick.map(k=>k==='…'?dots:[K(k),V(cnt[k])]);
    const C=(a,b)=>[{t:'key',w:a,c:YEL},{t:'value',w:b,c:BLUE,a:'e'}];
    let s='';const t1=sTab(10,30,C(110,60),m),t2=sTab(262,30,C(100,70),g),t3=sTab(514,30,C(110,60),r);
    s+=t1.s+t2.s+t3.s+tx(95,18,'Mapper output',{s:14,f:'#fff',w:500})+tx(347,18,'Sort and aggregate',{s:14,f:'#fff',w:500})+tx(599,18,'Reducer output',{s:14,f:'#fff',w:500});
    s+=tx(232,150,'→',{s:22,f:GRAY})+tx(486,150,'→',{s:22,f:GRAY});
    svgBox($('#b5wc'),720,30+t2.h+10,s,'Word count tables','46rem');
    $('#b5wc').append(el('div','cellnote',words.length+' words in the sentence, '+ks.length+' distinct keys: the reducer writes '+ks.length+' pairs.'));
  })();
  /* latency scale */
  (function(){
    let s='';const L=40,R=690,lo=Math.log10(0.1),hi=Math.log10(36000),X=v=>L+(Math.log10(v)-lo)/(hi-lo)*(R-L);
    s+=line(L,80,R,80,'#777',1.5);
    [[0.1,'0.1 s'],[1,'1 s'],[10,'10 s'],[60,'1 min'],[600,'10 min'],[3600,'1 h'],[36000,'10 h']].forEach(([v,l])=>{s+=line(X(v),74,X(v),86,'#777',1.5)+tx(X(v),106,l,{s:13,f:GRAY})});
    s+=rect(X(0.1),38,X(5)-X(0.1),26,'rgba(88,196,221,.35)',BLUE)+tx((X(0.1)+X(5))/2,56,'interactive query',{s:13,f:'#fff'});
    s+=rect(X(60),38,X(36000)-X(60),26,'rgba(255,134,47,.3)',ORG)+tx((X(60)+X(36000))/2,56,'MapReduce batch job: minutes to hours',{s:13,f:'#fff'});
    s+=tx((L+R)/2,132,'response time, logarithmic scale',{s:13,f:GRAY});
    svgBox($('#b5lat'),720,140,s,'Response times of interactive queries and batch jobs','46rem');
  })();
  /* the ecosystem */
  (function(){
    let s='';const B=(x,y,w,h,l,f,st)=>rect(x,y,w,h,f||'#141414',st||'#555')+tx(x+w/2,y+h/2+5,l,{s:13.5,f:'#fff'});
    s+=B(130,292,580,30,'HDFS · distributed file system','#1e1e1e','#9a9a9a')+B(130,256,580,30,'YARN · resource negotiator','#1e1e1e','#9a9a9a');
    s+=B(130,220,190,30,'MapReduce')+B(325,220,190,30,'Tez')+B(520,220,190,30,'Spark');
    s+=tx(10,258,'Core',{s:13,f:GRAY,a:'start'})+tx(10,276,'services',{s:13,f:GRAY,a:'start'});
    s+=rect(130,108,580,104,'none','#444')+tx(140,126,'Data services',{s:13,f:GRAY,a:'start'});
    ['Hive','Pig','HBase','HCatalog'].forEach((l,i)=>s+=B(140+i*142,136,132,30,l));['Storm','Flume','Sqoop'].forEach((l,i)=>s+=B(140+i*142,174,132,30,l));
    s+=rect(10,108,112,104,'none','#444')+tx(66,126,'Operational',{s:13,f:GRAY});['Ambari','Oozie','Zookeeper'].forEach((l,i)=>s+=B(18,134+i*26,96,22,l));
    s+=rect(10,8,700,92,'none','#444')+tx(20,26,'Analytic tools',{s:13,f:GRAY,a:'start'});
    {let x=20;[['Giraph',76],['Mahout',76],['Kylin',70],['Elastic Search',108],['Spark',70],['SAS',70],['R',60],['KNIME',76]].forEach(([l,w])=>{s+=B(x,40,w,30,l);x+=w+8});}
    s+=tx(133,90,'inside Hadoop only',{s:12.5,f:GRAY})+tx(357,90,'distributed tools',{s:12.5,f:GRAY})+tx(578,90,'connect from outside',{s:12.5,f:GRAY});
    svgBox($('#b5eco'),720,330,s,'The Hadoop ecosystem in four layers','46rem');
  })();
  /* legacy versus modern stack */
  (function(){
    const duo=el('div','duo');$('#b5stack').append(duo);
    const chain=(items)=>{let s='<defs>'+arrowDef('b5ar'+items.length,GRAY)+'</defs>';const n=items.length;items.forEach((l,i)=>{const y=200-i*58;s+=box(60,y,220,40,[l],{fs:14});if(i<n-1)s+=line(170,y,170,y-14,GRAY,2,' marker-end="url(#b5ar'+n+')"')});return s};
    cell(duo,'Legacy, installed base',chain(['HDFS','YARN','Hive','Spark']),340,246,'Legacy stack','Still found in many existing installations.');
    cell(duo,'Modern, hybrid direction',chain(['Object storage','Spark / Trino / Flink','Iceberg / Delta']),340,246,'Modern stack','Cloud storage, newer engines, open table formats.');
  })();
  wideFigs(5);
};
QZ['5a']=()=>[{q:'A 1 GB file (1,024 MB) is stored in HDFS with 128 MB blocks and the default replication factor. How many block copies end up on the data nodes?',o:['8','3','24','1,024'],a:2,
  e:'1,024 / 128 = 8 blocks, each stored 3 times: 8 × 3 = 24 block copies.',h:'First count the blocks, then remember how many copies of each block HDFS keeps by default.'}];
QZ['5b']=()=>[{q:'In the figure, which single rack failure would make block B3 unreadable?',o:['Rack 1','Rack 2','Rack 3','None of them'],a:3,
  e:'B3 has copies on node 6 (rack 2) and on nodes 8 and 9 (rack 3). Losing any one rack leaves at least one copy.',h:'Find the racks that hold copies of B3, and ask whether one rack holds all of them.'}];
QZ['5c']=()=>[{q:'A MapReduce word count runs on the text "to be or not to be". How many key/value pairs do the mappers emit, and how many does the reducer write?',o:['4 and 6','6 and 6','6 and 4','4 and 4'],a:2,
  e:'The mappers emit one (word, 1) pair per word: 6. The reducer writes one pair per distinct word: (be, 2), (not, 1), (or, 1), (to, 2), so 4.',h:'Mappers work word by word; the reducer works key by key.'}];
QZ['5d']=()=>[{q:'A marketing analyst wants to query data stored in Hadoop with SQL, from the BI tool she already uses. Which component makes it possible?',o:['Sqoop','Hive, through an ODBC driver','Oozie','Zookeeper'],a:1,
  e:'Hive is the SQL interface to Hadoop, and the ODBC drivers of the distributions let any BI or reporting tool connect to it like an RDBMS.',h:'Recall which data service BI tools can reach through a standard driver.'}];
QZ['5e']=()=>[{q:'Why can Kylin answer some Hive queries much faster than Hive on its own?',o:['It keeps a copy of all the raw data in memory','It saves precomputed aggregations in HBase and answers from them','It replaces HDFS with a faster file system','It runs the queries on the client\'s laptop'],a:1,
  e:'Kylin is an OLAP tool that stores aggregations in HBase\'s columnar storage and uses them to answer Hive queries, instead of recomputing the sums from the detail rows.',h:'Recall what OLAP tools prepare in advance.'}];
QZ['5']=()=>[
  {q:'A company stores 10 TB of data. How much disk space does it need with replication factor 3, and how much with erasure coding at 50% overhead?',o:['30 TB and 15 TB','30 TB and 5 TB','13 TB and 15 TB','20 TB and 10 TB'],a:0,
   e:'Replication keeps three full copies: 3 × 10 = 30 TB. Erasure coding adds 50%: 10 + 5 = 15 TB.',h:'Overhead is the space beyond the data itself: compute stored = data × (1 + overhead).'},
  {q:'MapReduce counts the letters of "B A B C B A". What does the reducer write?',o:['(A, 2), (B, 2), (C, 2)','(A, 2), (B, 3), (C, 1)','(A, {1, 1}), (B, {1, 1, 1}), (C, {1})','(B, 3)'],a:1,
   e:'Grouping gives (A, {1, 1}), (B, {1, 1, 1}), (C, {1}); the reducer sums each list: (A, 2), (B, 3), (C, 1).',h:'One option is the output of the grouping step, not of the reducer.'},
  {q:'With the placement rule of the figure (one copy on one rack, two on another), at least how many racks must fail at the same time to make some block unreadable?',o:['1','3','It can never happen','2'],a:3,
   e:'Each block lives on exactly two racks; if both fail together, its three copies are gone. One rack failure is never enough.',h:'Count on how many different racks the copies of a single block are spread.'},
  {q:'Which of these jobs is MapReduce designed for?',o:['Refreshing a sales dashboard every second','Looking up one customer by id','Aggregating a year of web server logs overnight','Answering analysts\' ad hoc SQL questions in real time'],a:2,
   e:'MapReduce is built for batch workloads on huge data, completing in minutes or hours; the other three are interactive workloads.',h:'Think about how long a MapReduce job takes and how long each of these users would accept to wait.'},
  {q:'Every night a company imports the customers table from its Oracle database into Hadoop, then runs a Hive job on it. Which two tools fit?',o:['Flume to import, Ambari to schedule','Sqoop to import, Oozie to orchestrate the two jobs','Storm to import, Zookeeper to schedule','HBase to import, Kylin to orchestrate'],a:1,
   e:'Sqoop moves data between an RDBMS and Hadoop; Oozie orchestrates the execution of different jobs, such as a Sqoop import followed by a Hive job.',h:'One tool is the bridge to relational databases, the other is the workflow tool.'},
  {q:'In the modern direction described in the lecture, what takes the place of HDFS and of MapReduce?',o:['YARN and Hive','Kafka and Zookeeper','HBase and Pig','Object storage, and engines such as Spark, Trino or Flink'],a:3,
   e:'The modern path is object storage → Spark / Trino / Flink → Iceberg / Delta: cloud storage replaces HDFS, newer engines replace MapReduce.',h:'Compare the two panels of the stack figure layer by layer.'}
];

/* Lesson 6: Spark, RDDs, DataFrames */
const kvT=(k,v)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
const cyl=(x,y,w,h,l)=>'<path d="M'+x+' '+(y+6)+'v'+(h-12)+'a'+(w/2)+' 6 0 0 0 '+w+' 0v'+(-(h-12))+'a'+(w/2)+' 6 0 0 0 '+(-w)+' 0a'+(w/2)+' 6 0 0 0 '+w+' 0" fill="#1a1a1a" stroke="#9a9a9a" stroke-width="1.3"/>'+tx(x+w/2,y+h/2+7,l,{s:13,f:'#fff'});
const chipM=(x,y,w,h,l)=>{let s=rect(x,y,w,h,'#1a1a1a','#9a9a9a');for(let i=1;i<6;i++){const px=x+i*w/6;s+=line(px,y-5,px,y,'#9a9a9a',1.3)+line(px,y+h,px,y+h+5,'#9a9a9a',1.3)}return s+tx(x+w/2,y+h/2+5,l,{s:13,f:'#fff'})};
const partC=(x,y,w,h,l)=>rect(x,y,w,h,'rgba(92,208,179,.22)',TEAL)+tx(x+w/2,y+h/2+5,l,{s:13,f:'#fff'});
INIT[6]=function(){
  codeHL($('#lezione-6'));
  /* MapReduce vs Spark disk traffic */
  (function(){
    const duo=el('div','duo');$('#b6io').append(duo);
    const ar=(id)=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const v=(y1,y2,id,l)=>line(170,y1,170,y2,GRAY,1.6,' marker-end="url(#'+id+')"')+(l?tx(180,(y1+y2)/2+5,l,{s:12.5,f:GRAY,a:'start'}):'');
    let a=ar('b6a1');const st=(y,l)=>box(110,y,120,34,[l],{fs:13.5});
    a+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a1','read')+st(60,'step 1')+v(94,108,'b6a1','write')+cyl(130,110,80,40,'HDFS')+v(150,164,'b6a1','read')+st(166,'step 2')+v(200,214,'b6a1','write')+cyl(130,216,80,40,'HDFS');
    cell(duo,'MapReduce',a,340,262,'MapReduce disk traffic','<b>4</b> disk operations: HDFS before and after each step.');
    let b=ar('b6a2');
    b+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a2','read')+st(60,'step 1')+v(94,112,'b6a2','')+chipM(120,116,100,30,'memory')+v(151,164,'b6a2','')+st(166,'step 2')+v(200,214,'b6a2','')+tx(170,236,'…',{s:20,f:GRAY});
    cell(duo,'Spark',b,340,262,'Spark disk traffic','<b>1</b> disk read: step 1 hands its result to step 2 in memory.');
  })();
  /* benchmarks */
  (function(){
    const duo=el('div','duo');$('#b6perf').append(duo);
    let s='';const L=80,R=300,X=v=>L+v/120*(R-L);
    [0,40,80,120].forEach(v=>{s+=line(X(v),14,X(v),112,'#222',1)+tx(X(v),130,v+' s',{s:13,f:GRAY})});
    [['Hadoop',110,'≈110 s'],['Spark',0.9,'0.9 s']].forEach(([l,v,t],i)=>{const y=24+i*46;s+=tx(L-10,y+20,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,Math.max(X(v)-X(0),2),30,i?'#fff':'#777')+tx(Math.max(X(v),X(0)+2)+8,y+20,t,{s:13.5,a:'start',f:'#fff'})});
    s+=tx(190,152,'running time, logistic regression',{s:13,f:GRAY});
    cell(duo,'Logistic regression',s,340,166,'Logistic regression benchmark','Spark is more than <b>100 times</b> faster on this iterative job.');
    let t='';const rows=[['Time (min)',72,23],['Nodes',2100,206],['Cores',50400,6592]];
    t+=tx(150,16,'2013 Hadoop, 102.5 TB',{s:12.5,f:GRAY,a:'start'});t+=tx(150,32,'2014 Spark, 100 TB',{s:12.5,f:'#fff',a:'start'});
    const th=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g,',');rows.forEach(([l,h,sp],i)=>{const y=48+i*52,mx=h,W=126;t+=tx(140,y+22,l,{s:13.5,a:'end',f:'#fff'});
      t+=rect(150,y,W*h/mx,18,'#777')+tx(150+W+6,y+14,th(h),{s:13,a:'start',f:GRAY});
      t+=rect(150,y+21,Math.max(W*sp/mx,2),18,'#fff')+tx(150+Math.max(W*sp/mx,2)+6,y+35,th(sp),{s:13,a:'start',f:'#fff'})});
    cell(duo,'Sort benchmark',t,340,206,'Sort benchmark','Spark: about <b>3 times</b> faster with about one tenth of the nodes.');
  })();
  /* architecture */
  (function(){
    let s='<defs>'+arrowDef('b6r1',GRAY)+arrowDef('b6r2',ORG)+'</defs>';
    s+=box(10,96,170,104,['Driver program','SparkSession','(SparkContext)'],{fs:14,b:1});
    s+=box(240,112,180,72,['Cluster manager','YARN, Mesos, standalone'],{fs:14,b:1});
    s+=line(180,148,238,148,GRAY,1.6,' marker-end="url(#b6r1)"');
    [10,166].forEach((y,k)=>{s+=rect(470,y,240,130,'#0d0d0d','#666')+tx(482,y+18,'Worker node '+(k+1),{s:13,f:GRAY,a:'start'});
      s+=rect(484,y+28,212,92,'#141414','#9a9a9a')+tx(494,y+46,'Executor',{s:13.5,f:'#fff',a:'start',w:600});
      s+=rect(494,y+58,70,50,'#1e1e1e','#555')+tx(529,y+88,'cache',{s:13,f:GRAY});
      s+=rect(574,y+58,52,50,'#1e1e1e','#777')+tx(600,y+88,'task',{s:13,f:'#fff'})+rect(634,y+58,52,50,'#1e1e1e','#777')+tx(660,y+88,'task',{s:13,f:'#fff'});
      s+=line(420,148,468,y+65,GRAY,1.6,' marker-end="url(#b6r1)"');});
    s+=line(95,96,468,40,GRAY,1.2,' stroke-dasharray="5 4" marker-end="url(#b6r1)"')+line(95,200,468,256,GRAY,1.2,' stroke-dasharray="5 4" marker-end="url(#b6r1)"');
    s+=tx(250,58,'code and tasks',{s:12.5,f:GRAY})+tx(250,250,'code and tasks',{s:12.5,f:GRAY});
    s+=line(590,142,590,162,ORG,2.2,' marker-end="url(#b6r2)"')+line(610,162,610,142,ORG,2.2,' marker-end="url(#b6r2)"')+tx(622,157,'shuffle',{s:13,f:ORG,a:'start'});
    svgBox($('#b6arch'),720,302,s,'Spark cluster architecture','46rem');
  })();
  /* RDD partitions */
  (function(){
    let s='';s+=tx(150,46,'RDD',{s:15,f:'#fff',a:'end',w:600});
    [0,1,2,3].forEach(i=>s+=partC(160+i*100,22,96,36,'partition '+(i+1)));
    const nodes=[[40,[0,1]],[270,[2]],[500,[3]]];
    nodes.forEach(([x,ps])=>ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=line(208+p*100,58,cx+35,120,TEAL,1.3,' opacity=".7"')}));
    nodes.forEach(([x,ps],k)=>{s+=rect(x,120,190,104,'#0d0d0d','#666')+tx(x+95,140,'node '+(k+1),{s:13,f:GRAY})+rect(x+12,150,166,62,'#141414','#9a9a9a')+tx(x+22,168,'executor',{s:13,f:'#fff',a:'start'});
      ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=partC(cx,176,70,28,'P'+(p+1))})});
    svgBox($('#b6rdd'),720,232,s,'An RDD of four partitions on three executors','46rem');
  })();
  /* lazy evaluation, animated */
  (function(){
    const root=$('#b6lazy'),W=720,H=346;root.append(legend([[TEAL,'partition','box'],[ORG,'shuffle'],[PINK,'action and result']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const dag=['textFile','flatMap','map','reduceByKey','collect()'],dx=i=>10+i*142;
    const P=[{y:92,line:'I scream you scream',w:['I','scream','you','scream']},{y:216,line:'lets all scream for icecream',w:['lets','all','scream','for','icecream']}];
    const RK=[['all','for','I'],['icecream','lets'],['scream','you']],ry=k=>92+k*80;
    const cnt={};P.forEach(p=>p.w.forEach(w=>cnt[w]=(cnt[w]||0)+1));
    const where=w=>{for(let k=0;k<3;k++){const j=RK[k].indexOf(w);if(j>=0)return [k,j]}};
    const res=['I','all','for','icecream','lets','scream','you'];
    const steps=[2.5,2.5,2.5,2.5,3,4.5,4.5,3,3];
    const msgs=['<b>textFile</b> adds a step to the DAG. Nothing has been read yet.','<b>flatMap</b> adds a step: lines will become words. Still nothing computed.','<b>map</b> adds a step: words will become (word, 1) pairs. Still nothing computed.',
      '<b>reduceByKey</b> adds a step that needs a shuffle. The DAG is complete, and no task has run yet.','<span style="color:var(--pink)"><b>collect()</b></span> is an action: Spark cuts the DAG at the shuffle into two stages and starts running it.',
      '<b>Stage 1.</b> Each partition, on its own executor, reads its line, splits it into words and maps each word to (word, 1).','<b>Shuffle.</b> Pairs move between executors so that all the pairs of one word end up in the same one of the 3 output partitions.',
      '<b>Stage 2.</b> In each partition reduceByKey adds up the values of each word: (scream, 3).','<b>Result.</b> collect() brings the seven pairs back to the driver.'];
    const T=function(x,y,c,o,halo){return '<text x="'+x+'" y="'+y+'" font-size="13"'+(o!==undefined?' opacity="'+o+'"':'')+(halo?' style="paint-order:stroke;stroke:#000;stroke-width:5px"':'')+'>'+c+'</text>'};
    const pPos=(p,j)=>[22+(j%3)*104,P[p].y+46+Math.floor(j/3)*24];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b6d1',GRAY)+'</defs>';
      dag.forEach((d,k)=>{const vis=k<4?i>=k:i>=4;if(!vis)return;const a=(i>0&&(k===i||(k===4&&i===4)))?e:1,act=k===4;
        s+='<g opacity="'+a+'">'+rect(dx(k),8,128,34,act?'rgba(220,117,205,.2)':'#141414',act?PINK:'#9a9a9a')+tx(dx(k)+64,30,d,{s:13.5,f:act?PINK:'#fff'})+(k?line(dx(k)-13,25,dx(k)-2,25,GRAY,1.5,' marker-end="url(#b6d1)"'):'')+'</g>'});
      if(i>=4){const a=i===4?e:1;s+='<g opacity="'+a+'">'+line(10,50,422,50,i===5?'#fff':'#777',1.5)+tx(216,68,'stage 1',{s:13,f:i===5?'#fff':GRAY})+line(436,50,564,50,i===7?'#fff':'#777',1.5)+tx(500,68,'stage 2',{s:13,f:i===7?'#fff':GRAY})+line(429,4,429,74,ORG,1.5,' stroke-dasharray="4 3"')+'</g>'}
      if(i<4){s+=tx(360,200,'Only the plan grows: no data has been read, no task has run.',{s:14,f:GRAY});s+=tx(360,224,'tasks run so far: 0',{s:13,f:GRAY})}
      else{
        P.forEach((p,k)=>{s+=rect(10,p.y,320,110,'#0b0b0b',i===5?TEAL:'#3d6b60')+tx(20,p.y+18,'partition '+(k+1)+' · executor '+(k+1),{s:12.5,f:TEAL,a:'start'});
          if(i===5&&u<.3)s+=tx(170,p.y+62,'"'+p.line+'"',{s:13.5,f:'#fff'});
          if(i===5&&u>=.3&&u<.62)p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,'<tspan style="fill:#fff">'+w+'</tspan>')});
          if((i===5&&u>=.62)||(i===6&&u<.02))p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,kvT(w,1))})});
        RK.forEach((ks,k)=>{s+=rect(420,ry(k),170,72,'#0b0b0b',i===7?TEAL:'#3d6b60')+tx(430,ry(k)+16,'output partition '+(k+1),{s:12.5,f:TEAL,a:'start'})});
        if(i===6){let g=0;P.forEach((p,k)=>p.w.forEach((w,j)=>{const st=g*.07,ek=ease(clamp((u-st)/.35,0,1)),[x0,y0]=pPos(k,j),[rk,rj]=where(w),x1=432,y1=ry(rk)+34+rj*16,x=lerp(x0,x1,ek),y=lerp(y0,y1,ek);
          if(ek>0&&ek<1)s=s.replace('</defs>','</defs>'+line(x0+40,y0-5,x+20,y-5,ORG,1.4,' opacity=".75"'));if(ek<1||u<.97)s+=T(x,y,kvT(w,1),undefined,1);g++}));}
        if(i===6&&u>=.97||i===7){RK.forEach((ks,k)=>ks.forEach((w,j)=>{const y=ry(k)+34+j*16,gr=kvT(w,'{'+Array(cnt[w]).fill(1).join(', ')+'}'),sm=kvT(w,cnt[w]);
          if(i===6||e<.5)s+=T(432,y,gr,i===6?1:1-2*e);else s+=T(432,y,sm,2*e-1)}))}
        if(i===8)RK.forEach((ks,k)=>ks.forEach((w,j)=>s+=T(432,ry(k)+34+j*16,kvT(w,cnt[w]))));
        s+=rect(606,92,108,232,'#0b0b0b',i>=8?PINK:'#5a3a55')+tx(660,110,'driver',{s:13,f:PINK});
        if(i===8)res.forEach((w,r)=>{const [rk,rj]=where(w),x0=432,y0=ry(rk)+34+rj*16,x1=614,y1=136+r*25,ek=ease(clamp((u-r*.08)/.4,0,1));
          if(ek>0&&ek<1)s+=line(560,y0-5,lerp(560,x1,ek),lerp(y0,y1,ek)-5,PINK,1.3,' opacity=".7"');if(ek>0)s+=T(lerp(x0,x1,ek),lerp(y0,y1,ek),kvT(w,cnt[w]),undefined,1)});
      }
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Lazy evaluation animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 9. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* RDD vs DataFrame */
  (function(){
    const duo=el('div','duo');$('#b6df').append(duo);
    let a='';for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=30+c*96,y=14+r*58;a+=rect(x,y,84,44,'#2a2a2a','#555')+tx(x+42,y+27,'User',{s:13.5,f:'#ccc'})}
    cell(duo,'RDD[User]',a,340,190,'RDD of opaque objects','Spark cannot see inside each object.');
    const rows=[['Ann','34','F'],['Bob','36','M'],['Cleo','30','F'],['Dan','29','M']];
    const t=sTab(40,14,[{t:'Name',w:100},{t:'Age',w:80,a:'e',c:BLUE},{t:'Sex',w:80,a:'m'}],rows);
    let b=t.s+tx(170,t.h+36,'schema: Name string, Age int, Sex string',{s:12.5,f:GRAY});
    cell(duo,'DataFrame',b,340,190,'DataFrame with a schema','Spark knows names and types of the columns.');
  })();
  /* sales.csv */
  (function(){
    const raw=[[20160901,'ProdABD',100,1],[20160901,'ProdDEF',200,2],[20161001,'ProdXYZ',150,3],[20161015,'ProdABD',160,1],[20161031,'ProdXYZ',20,5],[20161101,'ProdABD',50,3],[20161115,'ProdXYZ',200,4],[20161130,'ProdABD',300,4],[20161201,'ProdDEF',160,1],[20161210,'ProdABD',670,2],[20161220,'ProdDEF',100,5]];
    const t1=sTab(10,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE},{t:'customer_id',w:100,a:'e'}],raw.map(r=>r.map(String)),{bg:i=>raw[i][2]>200?OKBG:null});
    const kept=raw.filter(r=>r[2]>200);const t2=sTab(410,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE}],kept.map(r=>[String(r[0]),r[1],String(r[2])]));
    const sum={};raw.forEach(r=>sum[r[1]]=(sum[r[1]]||0)+r[2]);
    const t3=sTab(410,170,[{t:'product',w:110},{t:'sum(value)',w:110,a:'e',c:BLUE}],Object.keys(sum).sort().map(k=>[k,String(sum[k])]));
    let s=t1.s+t2.s+t3.s+tx(10,18,'sales.csv',{s:14,f:'#fff',a:'start',w:500})+tx(410,18,'filter(value > 200)',{s:14,f:'#fff',a:'start',w:500})+tx(410,158,'groupBy("product").sum("value")',{s:14,f:'#fff',a:'start',w:500});
    $('#b6sales').append(legend([[GRN,'row kept by the filter','box']]));
    svgBox($('#b6sales'),720,30+t1.h+8,s,'The sales table and two results','46rem');
  })();
  wideFigs(6);
};
QZ['6a']=()=>[{q:'A MapReduce job has 5 steps. Each step reads its input from HDFS and writes its output to HDFS. How many HDFS reads and writes does the job perform?',o:['5','6','10','2'],a:2,
  e:'Each step costs one read and one write: 5 × 2 = 10 disk operations. Spark would read once and keep the intermediate results in memory.',h:'Count the disk operations of one step in the first panel of the figure, then scale up.'}];
QZ['6b']=()=>[{q:'Your laptop has 8 cores. How many workers does Spark use with master local[*], and how many with local[2]?',o:['1 and 2','8 and 8','8 and 2','2 and 8'],a:2,
  e:'local[*] uses as many workers as the machine has cores, here 8; local[K] uses exactly K, here 2.',h:'Look at the rows for local[K] and local[*] in the master table.'}];
QZ['6c']=()=>[{q:'A script runs rdd = sc.textFile("logs.txt").filter(...).map(...) and ends there. How many tasks does Spark execute?',o:['One per partition, for each of the three steps','None','One, for textFile','It depends on the cluster manager'],a:1,
  e:'textFile, filter and map are all transformations: they only add steps to the DAG. Without an action nothing is executed.',h:'Ask whether the script contains any operation that returns a value.'}];
QZ['6d']=()=>[{q:'On the course\'s sales.csv, what does spark.sql("select product, sum(value) from sales where value >= 200 group by product") return for ProdABD?',o:['1280','970','670','300'],a:1,
  e:'ProdABD has values 100, 160, 50, 300, 670. The where clause keeps 300 and 670 (200 or more), and their sum is 970.',h:'Apply the where clause to the ProdABD rows first, then sum.'}];
QZ['6']=()=>[
  {q:'In the sort benchmark, Hadoop sorted 102.5 TB in 72 minutes on 2,100 nodes; Spark sorted 100 TB in 23 minutes on 206 nodes. Roughly, Spark was',o:['3 times faster with 10 times fewer nodes','10 times faster with 3 times fewer nodes','3 times faster with the same nodes','about as fast with 10 times fewer nodes'],a:0,
   e:'72 / 23 ≈ 3.1 for time and 2,100 / 206 ≈ 10.2 for nodes, on almost the same amount of data.',h:'Compute two ratios: time and nodes.'},
  {q:'A program runs textFile → flatMap → map → reduceByKey → sortByKey → collect(). Into how many stages is its DAG cut?',o:['1','2','3','5'],a:2,
   e:'Stages are cut at every shuffle. Aggregating (reduceByKey) and sorting (sortByKey) both need one, so two shuffles give three stages.',h:'Count the operations that need data to move between executors.'},
  {q:'In the lecture\'s word count, reduceByKey(..., 3) produces the output. Which statement is true?',o:['Each of the 3 output partitions can hold pairs of the word "scream"','The 7 distinct words are spread over 3 partitions, and all the pairs of one word end up in the same one','The output has 3 pairs, one per partition','The shuffle happens after reduceByKey has summed the values'],a:1,
   e:'The 3 sets the number of output partitions; the shuffle sends every pair of a word to the same partition, so the sum of each word is computed in one place.',h:'Think about why the shuffle is needed before the sums can be computed.'},
  {q:'You run sales.createOrReplaceTempView("sales") and sales.write.saveAsTable("bemacs_sales_table"), then restart Spark and connect to the same metastore. Which can you still query?',o:['Both','Only the temporary view sales','Only bemacs_sales_table','Neither'],a:2,
   e:'A temporary view lives as long as the session; saveAsTable materializes a persistent table in the Hive metastore, which survives restarts.',h:'Recall where each of the two statements keeps its table.'},
  {q:'On sales.csv, sales.filter(sales["value"] > 150).groupBy("product").count() returns which counts for ProdABD, ProdDEF and ProdXYZ?',o:['5, 3 and 3','3, 1 and 1','2, 2 and 1','3, 2 and 1'],a:3,
   e:'ProdABD keeps 160, 300, 670 (3); ProdDEF keeps 200, 160 (2); ProdXYZ keeps only 200, since 150 is not greater than 150 (1).',h:'Watch the strict inequality on the value 150.'},
  {q:'One engineer filters an RDD of User objects with a lambda on u.age; another filters a DataFrame with df["age"] > 40. Why can Spark optimize only the second?',o:['DataFrames are always stored on disk','Spark knows the DataFrame\'s schema, while RDD elements are opaque objects','RDDs cannot be filtered','Lambdas only run on the driver'],a:1,
   e:'A DataFrame is a collection with a schema known to Spark SQL, so Spark can see which column is used; inside an RDD of User objects Spark cannot see the structure.',h:'Recall the two panels of the RDD versus DataFrame figure.'}
];

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

/* Lesson 8: data lake architectures */
const HOT=ORG,COLD=BLUE;
const qChip8=(x,y,q,o)=>{o=o||{};const st=o.bad?RED:o.good?GRN:'#888';return rect(x,y,70,22,o.bad?'rgba(252,98,85,.12)':'#1a1a1a',st)+tx(x+35,y+16,q,{s:12.5,f:o.bad?'#c88':'#fff'})};
INIT[8]=function(){
  codeHL($('#lezione-8'));
  /* technologies by phase */
  (function(){
    let s='';const ph=[['Ingest','the raw data',['Spark SQL','Spark Streaming'],['Kafka, Flume','Storm, Sqoop']],['Transform','and integrate',['Spark SQL'],['Pig, Hive']],['Store','raw and processed',[],['HDFS']],['Analyze','to get insights',['Spark SQL, Spark ML','GraphX'],['Hive, Mahout']]];
    ph.forEach(([n,d,sp,hd],i)=>{const x=10+i*176,w=170;s+='<polygon points="'+[x,20,x+w-18,20,x+w,48,x+w-18,76,x,76,x+(i?18:0),48].join(' ')+'" fill="#1e1e1e" stroke="#9a9a9a"/>';
      s+=tx(x+w/2+(i?6:0),44,n,{s:15,f:'#fff',w:600})+tx(x+w/2+(i?6:0),63,d,{s:12.5,f:GRAY});
      s+=tx(x+w/2,104,'Spark',{s:13,f:GRAY});(sp.length?sp:['none']).forEach((l,j)=>s+=tx(x+w/2,124+j*18,l,{s:13.5,f:sp.length?'#fff':'#555'}));
      s+=tx(x+w/2,176,'Hadoop',{s:13,f:GRAY});hd.forEach((l,j)=>s+=tx(x+w/2,196+j*18,l,{s:13.5,f:'#fff'}))});
    s+=line(10,88,710,88,'#333',1)+line(10,160,710,160,'#333',1);
    svgBox($('#b8tech'),720,236,s,'Data lake technologies by phase','46rem');
  })();
  /* schema on write vs schema on read */
  (function(){
    const duo=el('div','duo');$('#b8schema').append(duo);
    const L=['20161130,ProdABD,300,4','20161205,ProdXYZ,n/a,7','20161210,ProdDEF,90,2'];
    let a=rect(10,6,320,46,'#141414','#9a9a9a')+mono(20,24,'CREATE TABLE sales (date INT,',{s:12.5})+mono(20,42,'  product VARCHAR, value INT, ...)',{s:12.5});
    a+=tx(170,74,'first the table, then the records',{s:12.5,f:GRAY});
    L.forEach((l,k)=>{const ok=k!==1,y=86+k*28;a+=rect(10,y,240,22,ok?OKBG:BADBG)+mono(18,y+16,l,{s:12.5})+tx(262,y+16,ok?'✓ loaded':'✗ rejected',{s:13,f:ok?GRN:RED,a:'start'})});
    const t=sTab(10,182,[{t:'date',w:86},{t:'product',w:86},{t:'value',w:60,a:'e',c:BLUE},{t:'cust.',w:56,a:'e'}],[['20161130','ProdABD','300','4'],['20161210','ProdDEF','90','2']],{rh:23,hh:24});
    a+=t.s;
    cell(duo,'Data warehouse: schema on write',a,340,262,'Schema on write','The bad record never enters: 2 rows of 3.');
    let b=rect(10,6,250,96,'#141414','#9a9a9a')+tx(20,24,'sales.csv in the lake (all 3 lines)',{s:12.5,f:GRAY,a:'start'});
    L.forEach((l,k)=>b+=mono(20,48+k*20,l,{s:12.5}));
    b+=tx(10,128,'reader A: value as INT',{s:13,f:'#fff',a:'start'})+tx(10,146,'"n/a" is read as NULL, the other values as numbers',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,180,'reader B: value as STRING',{s:13,f:'#fff',a:'start'})+tx(10,198,'keeps "n/a" as text, to find the bad records',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,232,'The schema lives in the reading code.',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Data lake: schema on read',b,340,262,'Schema on read','Everything is kept: 3 lines of 3.');
  })();
  /* cost per raw TB (approximate) */
  (function(){
    let s='';const L=150,R=600,X=v=>L+v/100*(R-L);
    [0,20,40,60,80,100].forEach(v=>{s+=line(X(v),8,X(v),214,'#222',1)+tx(X(v),234,'$'+(v?v+',000':'0'),{s:13,f:GRAY})});
    const rows=[['Cloud storage',0,1],['Hadoop',0,3],['NAS',12,18],['Engineered system',10,20],['MPP',21,80],['SAN',38,100]];
    rows.forEach(([l,lo,hi],k)=>{const y=14+k*34;s+=tx(L-10,y+16,l,{s:13.5,a:'end',f:k<2?'#fff':'#ccc',w:k<2?600:undefined});
      s+=rect(X(0),y,Math.max(X(lo)-X(0),0),22,'#2c2c2c')+rect(X(lo),y,Math.max(X(hi)-X(lo),3),22,k<2?'#fff':'#777');
      s+=tx(X(hi)+8,y+16,k<2?'a few $1,000':'≈ $'+lo+'k to $'+hi+'k',{s:12.5,f:GRAY,a:'start'})});
    s+=tx((L+R)/2,256,'fully loaded cost per raw TB, minimum to maximum (approximate)',{s:13,f:GRAY});
    svgBox($('#b8cost'),720,264,s,'Cost per raw terabyte by storage technology','46rem');
  })();
  /* four adoption steps */
  (function(){
    let s='';const st=[['01','Staging area and raw-data zone','low-cost, scalable landing place'],['02','Data-science environment','where machine learning experiments run'],['03','Offloading system for data warehouses','keeps the cold data of the DWH'],['04','Main component of the information system','involved in most data flows']];
    st.forEach(([n,l,d],k)=>{const y=200-k*56,hw=150-k*32,cx=160,top=hw-16;
      s+='<polygon points="'+[cx-hw,y+50,cx+hw,y+50,cx+top,y,cx-top,y].join(' ')+'" fill="'+['#2a2a2a','#383838','#474747','#5a5a5a'][k]+'" stroke="#111"/>'+tx(cx,y+32,n,{s:17,f:'#fff',w:600});
      s+=line(cx+top+8,y+25,330,y+25,'#555',1)+tx(340,y+22,l,{s:14,f:'#fff',a:'start',w:500})+tx(340,y+40,d,{s:12.5,f:GRAY,a:'start'})});
    svgBox($('#b8steps'),720,256,s,'Four steps of data lake adoption','46rem');
  })();
  /* traditional BI vs BI 2.0 */
  (function(){
    const duo=el('div','duo');$('#b8arch').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const up=(x,y1,y2,id)=>line(x,y1,x,y2,GRAY,1.6,' marker-end="url(#'+id+')"');
    let a=ar('b8u1');const cx=90,w=160;
    a+=box(cx,8,w,34,['Reporting'],{fs:14})+up(170,104,46,'b8u1')+box(cx,106,w,30,['Semantic layer'])+up(170,166,140,'b8u1');
    a+=box(cx,168,w,44,['Data warehouse','hot data'],{fs:14,c2:HOT,b:1})+up(170,252,216,'b8u1')+box(cx,254,w,28,['ETL'])+up(170,316,286,'b8u1')+box(cx,318,w,40,['Traditional sources','relational: ERP, CRM'],{fs:13.5});
    cell(duo,'Traditional BI',a,340,364,'Traditional BI','One path: ETL into the warehouse.');
    let b=ar('b8u2');const c1=10,c2=180,W=150;
    b+=box(10,8,320,34,['Reporting and advanced analytics'],{fs:14})+up(85,104,46,'b8u2')+up(255,104,46,'b8u2');
    b+=box(c1,106,W,30,['Semantic layer'])+box(c2,106,W,30,['Semantic layer'])+up(85,166,140,'b8u2')+up(255,158,140,'b8u2');
    b+=box(c1,168,W,44,['Data warehouse','hot, distilled'],{fs:14,c2:HOT,b:1})+rect(c2,160,W,78,'#0d0d0d','#666')+tx(255,180,'Data lake',{s:14,f:'#fff',w:600})+tx(255,198,'Hadoop, Spark',{s:13,f:GRAY})+tx(255,214,'raw, cold',{s:13,f:COLD})+tx(255,230,'quality, governance',{s:12.5,f:GRAY});
    b+=tx(170,197,'⇄',{s:18,f:'#ddd'});
    b+=up(85,252,216,'b8u2')+up(255,284,242,'b8u2')+box(c1,254,W,28,['ETL'])+box(c2,286,W,28,['Data ingestion']);
    b+=up(85,316,286,'b8u2')+up(255,342,318,'b8u2')+box(c1,318,W,40,['Traditional sources','relational'],{fs:13.5})+box(c2,320,W,40,['Emerging sources','logs, devices, social'],{fs:13.5});
    cell(duo,'BI 2.0, with a data lake',b,340,364,'BI 2.0','New sources land in the lake; results flow to the warehouse.');
  })();
  /* data distillation, animated */
  (function(){
    const root=$('#b8distill'),W=720,H=250;const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const rnd=lcg(8),D=[];for(let k=0;k<240;k++)D.push([24+rnd()*266,52+rnd()*170]);
    const steps=[3,4.5,3,3,3];
    const msgs=['The lake holds a large amount of raw data, with more detail and a longer history than the warehouse.','<b>Read.</b> A Spark job reads the raw data it needs; the data stay in the lake.','<b>Compute.</b> The result is small: a few rows, for example one indicator per customer segment.',
      '<b>Distil.</b> Being small, the result is loaded into the data warehouse.','<b>Use.</b> In the warehouse it joins the BI workflow: reports query it with low latency.'];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b8d1',GRAY)+'</defs>';
      s+=rect(14,26,286,206,'#0b0b0b','#666')+tx(157,44,'data lake: raw data',{s:13.5,f:'#fff'});
      D.forEach(([x,y])=>s+='<circle cx="'+x+'" cy="'+y+'" r="2.2" fill="#8a8a8a"/>');
      s+=rect(330,104,100,52,i===1||i===2?'#1e1e1e':'#141414',i===1||i===2?'#fff':'#777')+tx(380,126,'Spark job',{s:13.5,f:'#fff'})+tx(380,144,'in memory',{s:12.5,f:GRAY});
      s+=rect(466,40,140,180,'#0b0b0b',i>=3?'#fff':'#666')+tx(536,58,'data warehouse',{s:13.5,f:'#fff'})+tx(536,76,'hot data',{s:12.5,f:HOT});
      s+=rect(624,90,90,90,'#0b0b0b',i===4?'#fff':'#444')+tx(669,106,'BI report',{s:13,f:i===4?'#fff':'#666'});
      if(i===1){D.forEach(([x,y],k)=>{if(k%4)return;const st=(k/4)/60*.6,ek=clamp((u-st)/.4,0,1);if(ek>0&&ek<1){const xx=lerp(x,330,ease(ek)),yy=lerp(y,130,ease(ek));s+='<circle cx="'+xx+'" cy="'+yy+'" r="2.6" fill="#fff" opacity="'+(1-ek*.5)+'"/>'}})}
      const tbl=(x,y,a)=>{let r='<g opacity="'+a+'">'+rect(x,y,104,62,'#1e1e1e','#ddd');[0,1,2,3].forEach(j=>{r+=rect(x+8,y+8+j*13,24,8,'#777')+rect(x+38,y+8+j*13,[46,30,52,22][j],8,BLUE)});return r+'</g>'};
      if(i===2)s+=tbl(lerp(330,330,e),lerp(166,166,e),e)+tx(382,244,'a few rows',{s:12.5,f:GRAY});
      if(i===3)s+=tbl(lerp(330,484,e),lerp(166,100,e),1);
      if(i===4){s+=tbl(484,100,1);[46,30,52,22].forEach((v,j)=>s+=rect(640+j*18,170-v*e*1.2,12,v*e*1.2,BLUE))}
      if(i>=1)s+=line(302,130,326,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i>=3)s+=line(432,130,462,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i===4)s+=line(608,130,620,130,GRAY,1.5,' marker-end="url(#b8d1)"');
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Data distillation animation">'+s+'</svg>';o.innerHTML='Step '+(i+1)+' of 5. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* input filter vs quality label */
  (function(){
    const duo=el('div','duo');$('#b8qual').append(duo);const Q=['high','medium','low','high','medium','high'];
    let a='';Q.forEach((q,k)=>a+=qChip8(10,14+k*34,q,{bad:q!=='high'}));
    a+=line(118,6,118,214,'#ddd',3)+tx(118,232,'filter: high only',{s:12.5,f:GRAY});
    a+=rect(150,6,180,208,'#0b0b0b','#666')+tx(240,26,'data lake',{s:13.5,f:'#fff'});
    Q.forEach((q,k)=>{const y=14+k*34;if(q==='high'){a+=line(82,y+11,110,y+11,GRN,1.4)+qChip8(205,36+Q.slice(0,k).filter(x=>x==='high').length*34,q,{good:1})}else a+=tx(98,y+16,'✗',{s:14,f:RED})});
    cell(duo,'Quality filter on input',a,340,240,'Input filter','<span class="bad">Medium records are lost</span>, even for users who could use them.');
    let b=rect(10,6,190,214,'#0b0b0b','#666')+tx(105,26,'data lake (all records)',{s:13,f:'#fff'});
    const pos=k=>[20+(k%2)*92,40+Math.floor(k/2)*40];
    b+=box(232,30,104,48,['Reporting','high only'],{fs:13.5})+box(232,140,104,48,['Data scientist','high, medium'],{fs:13.5});
    Q.forEach((q,k)=>{const [x,y]=pos(k);if(q==='high')b+=line(x+70,y+11,232,54,GRN,1,' opacity=".55"');if(q!=='low')b+=line(x+70,y+11,232,164,GRN,1,' opacity=".55"')});
    Q.forEach((q,k)=>{const [x,y]=pos(k);b+=qChip8(x,y,q)});
    cell(duo,'Quality label, user decides',b,340,240,'Quality label','Every record enters; <span class="ok">each user picks its level</span>.');
  })();
  /* ETL copy vs virtualization */
  (function(){
    const duo=el('div','duo');$('#b8virt').append(duo);const src=['ERP','CRM','web logs'];
    let a='<defs>'+arrowDef('b8v1',GRAY)+'</defs>';a+=box(120,6,100,34,['user query']);
    a+=line(170,42,170,62,GRAY,1.5,' marker-end="url(#b8v1)"')+cyl(110,66,120,46,'central store');
    src.forEach((n,k)=>{const x=20+k*110;a+=cyl(x,186,90,42,n)+line(x+45,184,170+(k-1)*30,118,GRAY,1.4,' marker-end="url(#b8v1)"')});
    a+=tx(260,154,'copy (ETL)',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Copy the data (ETL)',a,340,236,'ETL copy','A second copy of the data to load and keep in sync.');
    let b='<defs>'+arrowDef('b8v2',ORG)+'</defs>';b+=box(120,6,100,34,['user query']);
    b+=line(170,42,170,62,ORG,1.5,' marker-end="url(#b8v2)"')+rect(40,66,260,46,'#0d0d0d','#ddd',' stroke-dasharray="5 4"')+tx(170,86,'virtualization layer',{s:13.5,f:'#fff'})+tx(170,104,'no data stored',{s:12.5,f:GRAY});
    src.forEach((n,k)=>{const x=20+k*110;b+=cyl(x,186,90,42,n)+line(170+(k-1)*60,114,x+45,182,ORG,1.4,' marker-end="url(#b8v2)"')});
    b+=tx(330,154,'network',{s:12.5,f:ORG,a:'end'});
    cell(duo,'Query in place (virtualization)',b,340,236,'Data virtualization','No copies, but every query loads the sources and the network.');
  })();
  wideFigs(8);
};
QZ['8a']=()=>[{q:'A company collects raw sensor logs whose use is not decided yet: next year a model may need some fields, in a format nobody can define today. Where should they go, and why?',o:['Into the data lake, because with schema on read the structure can be defined when the data are needed','Into the DWH, because schema on write guarantees quality','Nowhere: data without a schema cannot be stored','Into the DWH, because it is the cheapest storage'],a:0,
  e:'The lake stores data in their native format and defines the schema at reading time; the DWH needs the tables defined before loading and is the more expensive storage.',h:'Ask which of the two needs to know the structure before writing.'}];
QZ['8b']=()=>[{q:'A bank moves ten years of rarely queried transaction history out of its data warehouse into the data lake, where it stays available. Which adoption step is this?',o:['Staging area and raw-data zone','Data-science environment','Offloading system for data warehouses','Main component of the information system'],a:2,
  e:'Using the lake\'s low storage cost to keep the warehouse\'s cold, rarely used data is the third step, offloading.',h:'Ask where the data come from and how often they are used.'}];
QZ['8c']=()=>[{q:'A daily dashboard shows last month\'s sales by store; the 2012 web logs are read once a year for a study. In the lecture\'s architecture,',o:['both belong in the data warehouse','the sales stay in the data lake, the logs go to the warehouse','the sales, hot data, belong in the warehouse; the logs, cold data, in the lake','both belong only in the source systems'],a:2,
  e:'Recent, often accessed data are hot and served by the warehouse with low latency; old, rarely accessed data are cold and stay in the lake, available with a longer latency.',h:'Recall the definitions of hot and cold data.'}];
QZ['8d']=()=>[{q:'Customer records arrive with addresses of medium quality: fine for a churn model, not for invoices. What does the lecture recommend?',o:['Reject them at the entrance of the lake','Correct them by hand before loading','Load them with a quality label, and let each user decide whether to use them','Store them only in the warehouse'],a:2,
  e:'Quality rules belong on the output: a quality label lets the invoicing report exclude them while the data scientist can still use them.',h:'Where, according to the lecture, should quality rules be applied?'}];
QZ['8']=()=>[
  {q:'A load of 1,000 records contains 30 with a text where an integer is expected. How many rows end up in a warehouse table with schema on write and a strict load, and how many lines in the lake?',o:['970 and 970','1,000 and 970','970 and 1,000','1,000 and 1,000'],a:2,
   e:'The warehouse table rejects the 30 records that do not fit its schema: 1,000 − 30 = 970. The lake writes all 1,000 lines as they are and leaves the schema to the readers.',h:'One system checks the schema when writing, the other when reading.'},
  {q:'A retailer runs a churn model in Spark on two years of raw clickstream in the lake and obtains one churn score per customer, which marketing dashboards must query interactively. What does the lecture\'s architecture suggest?',o:['Move the raw clickstream into the warehouse','Keep the raw clickstream in the lake and load the scores into the warehouse','Let the dashboards query the raw clickstream in the lake','Delete the clickstream once the scores are computed'],a:1,
   e:'This is data distillation: the heavy analysis runs on the lake, and the small result goes to the warehouse, which serves low-latency queries to the BI tools.',h:'Which of the two systems is built for interactive queries, and which data are small?'},
  {q:'Which of these is not one of the lecture\'s critical success factors for a data lake?',o:['Data governance','A filter that rejects medium-quality data at the entrance','Metadata management','Training data scientists and end users'],a:1,
   e:'The lecture explicitly advises against input filters: they would keep out data useful for some applications. Quality labels on the output are the recommended way.',h:'Reread the paragraph on the data quality process.'},
  {q:'A company puts a virtualization layer over its ERP. At month end, complex reports through the layer slow down the ERP itself. Which drawback is this?',o:['High initial investment','Data virtualization relies on the storage, memory and CPUs of the sources, and can be slow for complex tasks','It cannot handle unstructured data','It duplicates the data'],a:1,
   e:'The layer stores nothing, so the sources do the work of every query; heavy queries load the ERP and can be slow.',h:'In the second panel of the last figure, who does the work?'},
  {q:'In which order does the lecture place the four steps of data lake adoption?',o:['Staging, data science, offloading, main component','Data science, staging, main component, offloading','Staging, offloading, data science, main component','Offloading, staging, data science, main component'],a:0,
   e:'From the base of the pyramid: staging area and raw-data zone, data-science environment, offloading system for warehouses, main component of the information system.',h:'Start from the cheapest, least integrated use.'},
  {q:'In the data lake era, what does the data warehouse contain according to the lecture?',o:['All the raw data, structured and unstructured','Only the cold data','The hot data from ETL processes and the distilled results of analyses run on the lake','Nothing: it is replaced by the lake'],a:2,
   e:'The warehouse still exists and holds hot data (from ETL, directly from the sources or from the lake) and distilled data from the lake\'s analyses, keeping low-latency queries and existing reports.',h:'The lake keeps the raw and the cold data.'}
];

/* Lesson 9: predictive and generative AI, data structures, use cases */
const PREDC=BLUE,GENC=PINK;
const gauss9=r=>{const u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
INIT[9]=function(){
  codeHL($('#lezione-9'));
  /* predictive vs generative */
  (function(){
    const duo=el('div','duo');$('#b9pg').append(duo);const r=lcg(9);
    const A=[],B=[];for(let k=0;k<22;k++){A.push([110+gauss9(r)*26,150+gauss9(r)*22]);B.push([220+gauss9(r)*26,80+gauss9(r)*22])}
    const ax=(s)=>s+line(30,210,320,210,'#666',1.2)+line(30,210,30,14,'#666',1.2)+tx(110,228,'feature 1',{s:12.5,f:GRAY})+tx(24,112,'feature 2',{s:12.5,f:GRAY,a:'middle',x:' transform="rotate(-90 24 112)"'});
    let a='<clipPath id="b9c1"><rect x="30" y="14" width="290" height="196"/></clipPath><g clip-path="url(#b9c1)">';
    A.forEach(([x,y])=>a+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>');B.forEach(([x,y])=>a+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff"/>');
    a+=line(60,20,300,210,'#ddd',1.6,' stroke-dasharray="6 4"')+'</g>';
    a+='<circle cx="196" cy="112" r="8" fill="none" stroke="'+PREDC+'" stroke-width="2.5"/>'+line(203,119,236,146,PREDC,1.2)+tx(238,160,'new customer?',{s:12.5,f:PREDC,a:'start'})+tx(238,176,'predicted: leaves',{s:12.5,f:PREDC,a:'start'});
    a+='<circle cx="200" cy="224" r="5" fill="#fff"/>'+tx(209,228,'left',{s:12.5,f:'#fff',a:'start'})+'<circle cx="250" cy="224" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>'+tx(259,228,'stayed',{s:12.5,f:'#ccc',a:'start'});
    cell(duo,'Predictive: learn a boundary',ax(a),340,236,'Predictive model','Features in, target out: <b>leave or stay</b>.');
    let b='';[[110,150],[220,80]].forEach(([cx,cy])=>{[[62,52,.35],[38,32,.6]].forEach(([rx,ry,o])=>b+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+GENC+'" stroke-opacity="'+o+'" stroke-width="1.5"/>')});
    A.concat(B).forEach(([x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#777"/>');
    const r2=lcg(31);for(let k=0;k<8;k++){const c=k%2?[220,80]:[110,150];b+='<circle cx="'+(c[0]+gauss9(r2)*22)+'" cy="'+(c[1]+gauss9(r2)*18)+'" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'}
    b+='<circle cx="190" cy="224" r="3.5" fill="#777"/>'+tx(198,228,'data',{s:12.5,f:GRAY,a:'start'})+'<circle cx="240" cy="224" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'+tx(249,228,'generated',{s:12.5,f:'#fff',a:'start'});
    cell(duo,'Generative: learn the shape',ax(b),340,236,'Generative model','No target: <b>new observations</b> like the data.');
  })();
  /* McKinsey ranges */
  (function(){
    let s='';const L=20,R=500,X=v=>L+v/30*(R-L);
    [0,5,10,15,20,25,30].forEach(v=>{s+=line(X(v),22,X(v),272,'#222',1)+tx(X(v),290,String(v),{s:13,f:GRAY})});
    const rows=[['Advanced analytics, traditional ML and deep learning',11.0,17.7,PREDC],['New generative AI use cases',2.6,4.4,GENC],['Total use-case driven potential',13.6,22.1,'#9a9a9a'],['Worker productivity enabled by generative AI',6.1,7.9,GENC],['Total AI economic potential',17.1,25.6,'#fff']];
    rows.forEach(([l,lo,hi,c],k)=>{const y=26+k*50;s+=tx(L,y+10,l,{s:13,f:'#ddd',a:'start'})+rect(X(lo),y+16,X(hi)-X(lo),20,c)+tx(X(hi)+8,y+31,lo.toFixed(1)+' to '+hi.toFixed(1),{s:13,f:'#fff',a:'start'})});
    s+=tx(260,308,'trillion $ per year',{s:13,f:GRAY});
    s+=tx(640,22,'share of the total',{s:13,f:GRAY});const top=34,H=238;
    s+=rect(610,top,60,H*.325,GENC)+rect(610,top+H*.325,60,H*.675,PREDC)+tx(604,top+H*.16+5,'30 to 35%',{s:13,f:'#fff',a:'end'})+tx(604,top+H*.325+H*.34+5,'65 to 70%',{s:13,f:'#fff',a:'end'});
    s+=tx(640,top+H+20,'generative',{s:12.5,f:GENC})+tx(640,top+H+36,'predictive',{s:12.5,f:PREDC});
    svgBox($('#b9mck'),720,316,s,'Economic potential of AI, McKinsey 2023','46rem');
  })();
  /* State of AI 2026 */
  (function(){
    let s='';const rows=[[89,'use AI in at least one business function'],[44,'are scaling AI across the enterprise'],[37,'report a positive EBIT impact from AI'],[6,'are AI high performers (at least 5% of EBIT from AI)']];
    rows.forEach(([v,l],k)=>{const y=14+k*52;s+=tx(20,y+12,l,{s:13,f:'#ddd',a:'start'})+rect(20,y+18,v/100*560,24,k===3?'#fff':'#777')+tx(20+v/100*560+10,y+37,v+'%',{s:17,f:'#fff',w:600,a:'start'})});
    svgBox($('#b9adopt'),720,222,s,'Share of organizations by AI stage','46rem');
  })();
  /* eight phases and five milestones */
  (function(){
    let s='';const ph=[['OLTP, SQL','','static','reports'],['DWH, SQL','','static','reports'],['DWH, BI,','OLAP','dynamic','reports'],['DWH, OLAP,','data mining','predictive','analytics'],['Collaboration,','cloud','advanced','analytics'],['Hadoop,','Big Data','prescriptive','analytics'],['Generative','AI','LLMs,','copilots'],['Agentic','AI','AI that','acts']];
    ph.forEach(([a,b,c,c2],i)=>{const x=6+i*89,w=86;s+='<polygon points="'+[x,8,x+w-10,8,x+w,25,x+w-10,42,x,42,x+(i?10:0),25].join(' ')+'" fill="'+(i>=6?'#2a2a2a':'#1a1a1a')+'" stroke="#9a9a9a"/>'+tx(x+w/2+(i?3:0),30,'Phase '+(i+1),{s:13,f:'#fff',w:600});
      s+=tx(x+w/2,62,a,{s:12.5,f:'#fff'})+(b?tx(x+w/2,78,b,{s:12.5,f:'#fff'}):'')+tx(x+w/2,98,c,{s:12.5,f:GRAY})+tx(x+w/2,113,c2,{s:12.5,f:GRAY})});
    const ms=[['early 1990s',['BI tools'],['focus on tools']],['2005',['business analytic','applications'],['focus on','applications']],['2012',['Big Data'],['focus on data']],['2022',['generative AI','platforms'],['focus on natural','language']],['2025',['AI agents,','agentic workflows'],['focus on','autonomous action']]];
    ms.forEach(([yr,ln,fc],k)=>{const x=8+k*142,y=300-k*36,w=132;s+=rect(x,y,w,40,k>=3?'#2a2a2a':'#1a1a1a','#bbb');
      ln.forEach((l,j)=>s+=tx(x+w/2,y+(ln.length===1?25:17+j*16),l,{s:12.5,f:'#fff'}));
      s+=tx(x+4,y-8,yr,{s:13,f:'#fff',w:600,a:'start'})+line(x+w/2,y+40,x+w/2,352,'#444',1,' stroke-dasharray="3 3"');
      fc.forEach((l,j)=>s+=tx(x+w/2,370+j*16,l,{s:12.5,f:GRAY}))});
    s+=tx(10,140,'Business intelligence → AI',{s:13,f:GRAY,a:'start'});
    svgBox($('#b9evo'),720,394,s,'Eight phases of analysis techniques and tools','46rem');
  })();
  /* elements of a BI system */
  (function(){
    let s='<defs>'+arrowDef('b9b1',GRAY)+'</defs>';const A=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,GRAY,1.4,' marker-end="url(#b9b1)"');
    s+=tx(70,18,'Operational sources',{s:13,f:GRAY});['CRM','ERP','Legacy systems','Files, web, IoT'].forEach((l,k)=>s+=box(10,28+k*48,120,38,[l]));
    s+=box(178,92,96,56,['Staging','area'],{fs:14});[0,1,2,3].forEach(k=>s+=A(132,47+k*48,176,120));s+=tx(156,26,'ETL',{s:12.5,f:GRAY});
    s+=cyl(318,82,110,76,'');s+=tx(373,116,'Enterprise',{s:13.5,f:'#fff'})+tx(373,134,'data warehouse',{s:13.5,f:'#fff'});s+=A(276,120,316,120)+tx(296,110,'ETL',{s:12.5,f:GRAY});
    s+=tx(520,18,'Data marts',{s:13,f:GRAY});['Marketing','Finance','Sales'].forEach((l,k)=>{s+=box(470,40+k*56,100,40,[l]);s+=A(430,120,468,60+k*56)});
    s+=tx(650,18,'Client tools',{s:13,f:GRAY});['OLAP','Reports, dashboards','Data mining, ML','AI copilots'].forEach((l,k)=>{s+=box(590,28+k*48,126,38,[l],{fs:12.5});});
    s+=A(572,120,588,120);
    s+=rect(10,236,704,34,'#141414','#9a9a9a',' stroke-dasharray="5 4"')+tx(362,258,'Governance: master data, data quality, metadata and lineage, security and privacy (GDPR)',{s:13,f:'#ddd'});
    svgBox($('#b9bi'),720,276,s,'Elements of a BI system','46rem');
  })();
  /* Inmon's four properties */
  (function(){
    const duo=el('div','duo');$('#b9inmon').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    let a=ar('b9i1');[['ERP','"M. Rossi"'],['CRM','"Mario Rossi"'],['web','"mrossi"']].forEach(([n,v],k)=>{a+=box(10,8+k*48,130,40,[n,v],{fs:13});a+=line(142,28+k*48,196,80,GRAY,1.4,' marker-end="url(#b9i1)"')});
    a+=box(200,52,130,56,['customer 1042','Mario Rossi'],{fs:13.5,st:'#fff',sw:2});
    cell(duo,'Integrated',a,340,156,'Integrated','Different sources, one homogeneous container.');
    let b=ar('b9i2');['sales','loans','outbound traffic'].forEach((n,k)=>b+=box(10,8+k*48,120,38,[n],{fs:13,f:'#141414',st:'#555'}));['customers','products','channels'].forEach((n,k)=>b+=box(210,8+k*48,120,38,[n],{fs:13.5,st:'#fff'}));
    b+=tx(70,160,'applications',{s:12.5,f:GRAY})+tx(270,160,'subjects',{s:12.5,f:'#fff'})+line(134,76,204,76,GRAY,1.6,' marker-end="url(#b9i2)"');
    cell(duo,'Subject-oriented',b,340,166,'Subject-oriented','Organized by subject, not by application.');
    let c='';['Jan','Feb','Mar','Apr','May'].forEach((m,k)=>{c+=rect(40,128-k*26,150,22,k===4?'#3a3a3a':'#1e1e1e','#9a9a9a')+tx(115,143-k*26,m+' load',{s:12.5,f:'#fff'})});
    c+=box(220,50,110,56,['users','read only'],{fs:13.5})+tx(275,124,'no updates,',{s:12.5,f:GRAY})+tx(275,140,'no deletes',{s:12.5,f:GRAY});
    cell(duo,'Non-volatile',c,340,156,'Non-volatile','Regular loads make it grow; users cannot change it.');
    let d=line(20,120,320,120,'#777',1.5);[2022,2023,2024,2025,2026].forEach((y,k)=>{const x=40+k*65;d+=rect(x-24,40,48,60,'#1a1a1a','#9a9a9a');[0,1,2].forEach(j=>d+=rect(x-16,50+j*14,32,7,'#555'));d+=line(x,100,x,120,'#777',1)+tx(x,140,String(y),{s:12.5,f:GRAY})});
    cell(duo,'Time-variant',d,340,156,'Time-variant','Periodic snapshots covering several years.');
  })();
  /* IDC Global DataSphere */
  (function(){
    let s='';const U=[['ZB','10²¹ bytes','1 billion TB'],['EB','10¹⁸','monthly mobile traffic of a big country'],['PB','10¹⁵','a large company DWH'],['TB','10¹²','a laptop disk'],['GB','10⁹','a film in HD']];
    U.forEach(([u,p,e],k)=>{const y=14+k*52;s+=rect(10,y,40,40,k?'#1a1a1a':'#2c2c2c','#9a9a9a')+tx(30,y+25,u,{s:14,f:'#fff',w:600})+tx(58,y+16,p,{s:12.5,f:'#fff',a:'start'});
      const words=e.split(' ');let l1=e,l2='';if(e.length>24){const m=Math.ceil(words.length/2);l1=words.slice(0,m).join(' ');l2=words.slice(m).join(' ')}s+=tx(58,y+31,l1,{s:12.5,f:GRAY,a:'start'})+(l2?tx(58,y+45,l2,{s:12.5,f:GRAY,a:'start'}):'')});
    s+=tx(130,284,'× 1,000 at each step',{s:12.5,f:GRAY});
    const D=[['2010',2],['2012',7],['2014',13],['2016',18],['2018',33],['2020',64],['2021',79],['2022',97],['2023',120],['2024',149],['2025',181],['2028',394]];
    const x0=262,bw=30,gap=7.5,Y=v=>262-v/400*226;
    [0,100,200,300,400].forEach(v=>{s+=line(x0-6,Y(v),712,Y(v),'#222',1)+tx(x0-10,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'})});
    D.forEach(([y,v],k)=>{const x=x0+k*(bw+gap),f=k===11;s+=rect(x,Y(v),bw,262-Y(v),f?'none':(k>=9?'#9a9a9a':'#ddd'),f?'#ddd':'none',f?' stroke-dasharray="4 3" stroke-width="1.5"':'')+tx(x+bw/2,Y(v)-6,String(v),{s:12.5,f:'#fff'})+tx(x+bw/2,280,y==='2028'?'2028F':"'"+y.slice(2),{s:12.5,f:GRAY})});
    s+=tx(486,298,'zettabytes per year; 2024 and 2025 estimates, 2028 forecast',{s:12.5,f:GRAY});
    svgBox($('#b9idc'),720,306,s,'Global DataSphere in zettabytes, IDC','46rem');
  })();
  /* volume and complexity */
  (function(){
    let s='';const lv={MB:290,GB:215,TB:135,PB:55};
    Object.keys(lv).forEach(k=>{s+=tx(52,lv[k]+5,k,{s:14,f:'#fff',w:600,a:'end'})+line(62,lv[k],700,lv[k],'#1c1c1c',1)});
    s+=line(64,324,700,324,'#777',1.4)+line(64,324,64,20,'#777',1.4)+tx(30,22,'volume',{s:12.5,f:GRAY,a:'start'});
    [['low complexity',190],['medium complexity',400],['high complexity',610]].forEach(([l,x])=>s+=tx(x,344,l,{s:13,f:GRAY}));
    const B=[['SCM','',150,285,30,0],['ERP','orders, sales',192,215,40,0],['CRM','campaigns',262,252,34,0],['Financial','transactions',178,135,38,1],['DCS,','sensors',292,58,34,1],['Web logs','click stream',392,135,40,1],['Scientific','data',402,55,36,1],['Documents','Word, Excel, PDF',512,212,48,2],['Audio,','video, photo',604,140,40,2],['Social','networks, UGC',614,54,46,2]];
    B.forEach(([a,b,x,y,r,t])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.6"/>';const c=t?'#fff':'#000';
      s+=tx(x,y+(b?-1:5),a,{s:12.5,f:c,w:600})+(b?tx(x,y+14,b,{s:11,f:t?'#ddd':'#333'}):'')});
    const lg=[['structured',0],['semi-structured',1],['unstructured',2]];lg.forEach(([l,t],k)=>{const x=200+k*140;s+='<circle cx="'+x+'" cy="'+366+'" r="7" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.4"/>'+tx(x+12,370,l,{s:12.5,f:'#ddd',a:'start'})});
    svgBox($('#b9vc'),720,378,s,'Data sources by volume and complexity','46rem');
  })();
  /* IoT */
  (function(){
    const duo=el('div','duo');$('#b9iot').append(duo);
    let a='';const Y=v=>200-v/40*170;[0,10,20,30,40].forEach(v=>a+=line(60,Y(v),320,Y(v),'#222',1)+tx(52,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    a+=rect(90,Y(21.1),70,200-Y(21.1),'#ddd')+tx(125,Y(21.1)-8,'21.1',{s:14,f:'#fff',w:600})+tx(125,220,'2025',{s:13,f:GRAY});
    a+=rect(220,Y(39),70,200-Y(39),'none','#ddd',' stroke-dasharray="4 3" stroke-width="1.5"')+tx(255,Y(39)-8,'39',{s:14,f:'#fff',w:600})+tx(255,220,'2030 (expected)',{s:13,f:GRAY});
    a+=tx(160,Y(31),'≈ 13% a year',{s:12.5,f:GRAY});
    cell(duo,'Connected devices, billions',a,340,230,'IoT devices','Almost twice as many in five years.');
    let b='';[['Wi-Fi',32],['Bluetooth',24],['Cellular',22],['Other',22]].forEach(([l,v],k)=>{const y=14+k*46;b+=tx(100,y+20,l,{s:13.5,f:k<3?'#fff':GRAY,a:'end'})+rect(110,y+4,v*6,24,k<3?'#9a9a9a':'#333')+tx(116+v*6,y+21,v+'%',{s:13.5,f:'#fff',a:'start'})});
    b+=tx(170,210,'Wi-Fi, Bluetooth and cellular: about 78%',{s:12.5,f:GRAY});
    cell(duo,'Share of IoT connections',b,340,230,'IoT connectivity','Three technologies carry most connections.');
  })();
  /* analysis loop */
  (function(){
    let s='<defs>'+arrowDef('b9l1',GRAY)+arrowDef('b9l2','#ddd')+'</defs>';const st=[['Generate data','people, machines,','transactions, IoT'],['Ingestion','batch, streaming:','ETL, ELT, APIs, Kafka'],['Store','DWH, data lake,','lakehouse'],['Analyze','BI, statistics, ML:','KNIME, Python, R, Spark'],['Get insights','decisions, actions,','AI agents']];
    s+='<path d="M650 70 C 650 30, 640 26, 600 26 L 120 26 C 80 26, 73 34, 73 66" fill="none" stroke="#ddd" stroke-width="1.6" marker-end="url(#b9l2)"/>';
    s+=tx(360,50,'insights change decisions, decisions generate new data',{s:13,f:'#fff'});
    st.forEach(([a,b,c],k)=>{const x=6+k*143;s+=rect(x,70,134,40,'#1a1a1a','#bbb')+tx(x+67,95,a,{s:14,f:'#fff',w:600})+tx(x+67,130,b,{s:12.5,f:GRAY})+tx(x+67,146,c,{s:12.5,f:GRAY});if(k<4)s+=line(x+135,90,x+141,90,GRAY,1.5,' marker-end="url(#b9l1)"')});
    s+=tx(360,178,'so the models must be monitored and retrained over time',{s:12.5,f:GRAY});
    svgBox($('#b9loop'),720,188,s,'The analysis process as a loop','46rem');
  })();
  /* Zalando forecast error */
  (function(){
    let s='';const L=170,R=640,X=v=>L+v/0.7*(R-L);[0,0.2,0.4,0.6].forEach(v=>s+=line(X(v),10,X(v),140,'#222',1)+tx(X(v),158,fe(v,1),{s:12.5,f:GRAY}));
    [['naive forecast',0.603,'#555'],['LightGBM',0.489,'#9a9a9a'],['transformer',0.449,'#fff']].forEach(([l,v,c],k)=>{const y=16+k*42;s+=tx(L-10,y+19,l,{s:13.5,f:'#fff',a:'end'})+rect(X(0),y,X(v)-X(0),28,c)+tx(X(v)+8,y+19,fe(v,3),{s:13.5,f:'#fff',a:'start'})});
    s+=tx((L+R)/2,176,'demand forecast error, 2022 data (lower is better)',{s:12.5,f:GRAY});
    svgBox($('#b9zal'),720,184,s,'Zalando demand forecast error by model','46rem');
  })();
  wideFigs(9);
};
QZ['9a']=()=>[{q:'Which of these is a predictive task in the lecture\'s sense?',o:['Writing a personalised e-mail for each customer segment','Estimating each customer\'s probability of leaving next month','Generating new product images for a campaign','Drafting replies to customer reviews'],a:1,
  e:'A predictive model learns a function from features to a target, here "will leave" with a probability. The other three create new content: generative AI.',h:'Look for a target variable to estimate.'}];
QZ['9b']=()=>[{q:'Using McKinsey\'s upper bounds, what share of the total AI economic potential (25.6 trillion dollars) comes from the productivity enabled by generative AI (7.9)?',o:['17%','69%','31%','45%'],a:2,
  e:'7.9 / 25.6 ≈ 0.31, so about 31%, inside the 30 to 35% range of the chart; the remaining 69% is predictive.',h:'Divide the generative part by the total.'}];
QZ['9c']=()=>[{q:'A data warehouse keeps monthly snapshots of customer balances for the last ten years. Which of Inmon\'s properties does this illustrate?',o:['Integrated','Subject-oriented','Non-volatile','Time-variant'],a:3,
  e:'Time-variant means the data are periodic snapshots of the business covering several years of history.',h:'Match the description against the four definitions one by one.'}];
QZ['9d']=()=>[{q:'From 2 ZB in 2010 to about 181 ZB in 2025: roughly how many times did the yearly volume grow, and how many terabytes are in one zettabyte?',o:['About 90 times; one billion TB','About 9 times; one million TB','About 180 times; one billion TB','About 90 times; one thousand TB'],a:0,
  e:'181 / 2 ≈ 90. A zettabyte is 10²¹ bytes and a terabyte 10¹², so 1 ZB = 10⁹ TB, one billion terabytes.',h:'Count the steps of a thousand between TB and ZB on the ladder.'}];
QZ['9e']=()=>[{q:'Zalando\'s transformer has an error of 0.449, against 0.489 for LightGBM and 0.603 for a naive forecast. By how much, in relative terms, does it reduce the error of LightGBM and of the naive forecast?',o:['About 4% and 15%','About 8% and 26%','About 40% and 15%','About 9% and 34%'],a:1,
  e:'(0.489 − 0.449) / 0.489 ≈ 0.082, about 8%; (0.603 − 0.449) / 0.603 ≈ 0.255, about 26%. A gradient-boosted tree baseline already captures most of the gain over the naive forecast.',h:'Relative reduction = (old − new) / old.'}];
QZ['9']=()=>[
  {q:'IoT devices were 21.1 billion in 2025. Growing at about 13% a year, roughly how many will there be in 2030?',o:['About 39 billion','About 35 billion','About 24 billion','About 60 billion'],a:0,
   e:'Growth compounds: 21.1 × 1.13⁵ ≈ 21.1 × 1.84 ≈ 38.9 billion, the 39 billion of the forecast. Adding 13% of 21.1 five times (35 billion) forgets the compounding.',h:'Apply 13% to a base that grows every year.'},
  {q:'Trenitalia expects an 8% cut of maintenance costs of about €1.3 billion a year, against an investment of about €50 million. What is the yearly saving, and roughly how long does it take to recover the investment?',o:['€10.4 million; about 5 years','€104 million; about 6 months','€104 million; about 2 years','€1.04 billion; about 2 weeks'],a:1,
   e:'0.08 × 1,300 = €104 million a year, the "€100+ million" of the lecture. €50 million / €104 million ≈ 0.48 years, about six months.',h:'First 8% of 1.3 billion, then divide the investment by the yearly saving.'},
  {q:'In the State of AI survey, out of 1,000 organizations, how many are AI high performers, and what share of the organizations that use AI is that?',o:['6, about 0.7%','60, about 6.7%','60, about 13.6%','440, about 49%'],a:1,
   e:'6% of 1,000 is 60; the users are 89%, 890 organizations, and 60 / 890 ≈ 6.7%.',h:'High performers are 6% of all organizations, not of the users.'},
  {q:'An order system must show each item\'s stock level, updated at every sale; an analyst needs ten years of monthly sales by region. Which systems fit?',o:['The data warehouse for both','The operational database for both','The operational database for the stock level, the data warehouse for the sales history','The data warehouse for the stock level, the operational database for the history'],a:2,
   e:'Operational databases hold complete, current data updated in real time for daily operations; the warehouse holds aggregated history as periodic snapshots for analysis.',h:'Recall the "Data" and "Use" rows of the comparison table.'},
  {q:'A company says it has no Big Data because its databases total only 2 TB, although it receives a continuous stream of sensor readings and thousands of free-text reviews. What would the lecture answer?',o:['It is right: below a petabyte there is no Big Data','Big Data are not only volume: variety and velocity often matter more','Only web data count as Big Data','It should first collect all the data in the world'],a:1,
   e:'The lecture\'s "let\'s clarify" points out that variety (unstructured reviews) and velocity (streaming sensors) often matter more than volume, and that the relevant data are what matters.',h:'Recall the lecture\'s "let\'s clarify" slide.'},
  {q:'A bank wants to flag fraudulent card transactions, which are about 0.1% of all transactions. Which framing matches the lecture\'s table?',o:['Regression on the amount of each transaction','Clustering of customers into segments','Classification on highly imbalanced data, with anomaly detection and techniques such as SMOTE','Time-series forecasting of next week\'s transactions'],a:2,
   e:'Fraud detection is classification with a very rare positive class: models such as gradient boosted trees, with SMOTE to create synthetic frauds, and anomaly detection.',h:'Look at the last table of the lesson.'}
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
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m&&NUMS.includes(+m[1])?+m[1]:NUMS[0],false)})();
renderMath(document.querySelector('footer'));

/* ---------- Ask AI: domande a Gemini sulla lezione aperta; la chiave resta solo in questo browser ---------- */
(function(){
  const b=el('button','askbtn',UI.ask),p=el('div','askp');b.type='button';p.hidden=true;
  p.innerHTML='<div class="askh"><b>'+UI.ask+'</b><button type="button" class="askx" aria-label="×">×</button></div><div class="asko" aria-live="polite"></div>'+
    '<textarea rows="3" aria-label="'+UI.ask+'"></textarea><div class="ctl"><button type="button" class="btn solid">'+UI.askSend+'</button><button type="button" class="btn askk">'+UI.askKey+'</button></div>';
  document.body.append(b,p);
  const o=p.querySelector('.asko'),ta=p.querySelector('textarea'),go=p.querySelector('.solid');
  const key=ask=>{let k='';try{k=localStorage.getItem('gemini-key')||''}catch(e){}
    if(!k||ask){k=(prompt(UI.askPrompt)||'').trim();if(k)try{localStorage.setItem('gemini-key',k)}catch(e){}}return k};
  b.onclick=()=>{p.hidden=!p.hidden;if(!p.hidden)ta.focus()};
  p.querySelector('.askx').onclick=()=>{p.hidden=true};
  p.querySelector('.askk').onclick=()=>key(true);
  go.onclick=async()=>{const q=ta.value.trim(),k=q&&key();if(!k)return;
    const art=lessons.find(l=>!l.hidden),ctx=(art?art.innerText:'').slice(0,30000);
    o.textContent='…';go.disabled=true;
    try{let j;const body=JSON.stringify({systemInstruction:{parts:[{text:UI.askSys}]},contents:[{role:'user',parts:[{text:'LESSON:\n'+ctx+'\n\nQUESTION: '+q}]}]});
      /* modelli in ordine di preferenza: se uno non esiste o non è disponibile si passa al successivo */
      for(const m of ['gemini-4-hydrogen','gemini-3.5-flash','gemini-2.5-flash']){
        const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':k},body});
        j=await r.json();if(r.ok||(r.status!==404&&r.status!==400))break}
      o.textContent=j.candidates&&j.candidates[0].content?j.candidates[0].content.parts.map(x=>x.text||'').join(''):((j.error&&j.error.message)||'Error')}
    catch(e){o.textContent=String(e)}
    go.disabled=false};
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();go.click()}});
})();

})();
