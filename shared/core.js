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
  b.type='button';b.setAttribute('aria-label','Riproduci');
  sc.type='range';sc.min=0;sc.max=dur;sc.step=0.01;sc.value=0;sc.setAttribute('aria-label','Posizione nell\'animazione');
  bar.append(b,tm,sc);host.append(bar);
  let pos=0,raf=null,last=0;const f=x=>{const s=Math.floor(x+1e-6);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  function show(){sc.value=pos;tm.textContent=f(pos)+' / '+f(dur);onFrame(pos)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}b.innerHTML=IC.play;b.setAttribute('aria-label','Riproduci')}
  function tick(ts){if(!last)last=ts;pos=Math.min(dur,pos+Math.min(0.1,(ts-last)/1000));last=ts;show();if(pos>=dur){raf=null;stop()}else raf=requestAnimationFrame(tick)}
  function play(){if(pos>=dur)pos=0;last=0;b.innerHTML=IC.pause;b.setAttribute('aria-label','Pausa');raf=requestAnimationFrame(tick)}
  b.addEventListener('click',()=>raf?stop():play());
  sc.addEventListener('input',()=>{stop();pos=+sc.value;show()});
  show();return {stop,play,seek(k){stop();pos=k;show()}};
}
/* quiz a scelta multipla: si sceglie, poi «Verifica» */
function quiz(root,qs){
  qs.forEach(q=>{
    const box=el('div','q');box.append(el('p','',q.q));
    const opts=el('div','opts'),fb=el('div','fb'),chk=btn('Verifica');chk.classList.add('solid','chk');fb.setAttribute('aria-live','polite');
    let sel=null;
    const bsq=q.o.map((t,i)=>{const b=btn(t,true);b.onclick=()=>{sel=i;bsq.forEach((x,j)=>{press(x,j===i);x.classList.remove('right','wrong')});fb.innerHTML=''};opts.append(b);return b});
    chk.onclick=()=>{if(sel===null){fb.innerHTML='Scegli prima una risposta.';return}
      press(bsq[sel],false);bsq[sel].classList.add(sel===q.a?'right':'wrong');
      fb.innerHTML=sel===q.a?'<b>Esatto.</b> '+q.e:'<b>Non proprio.</b> '+q.h};
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

