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


/* miniature delle lezioni: richiamano la figura principale di ciascuna */
(function(){
  const sv=s=>'<svg viewBox="0 0 108 72" aria-hidden="true">'+s+'</svg>';
  const ar='<defs><marker id="tha" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+BLUE+'"/></marker></defs>';
  THUMB[1]=sv(ar+'<g stroke="'+BLUE+'" stroke-width="2.5" marker-end="url(#tha)"><line x1="48" y1="20" x2="33" y2="46"/><line x1="36" y1="54" x2="68" y2="54"/><line x1="75" y1="46" x2="60" y2="20"/></g>'+
    '<g fill="#fff"><circle cx="54" cy="14" r="5"/><circle cx="28" cy="54" r="5"/><circle cx="80" cy="54" r="5"/></g>');
  THUMB[2]=sv('<line x1="12" y1="36" x2="96" y2="36" stroke="'+GRAY+'" stroke-width="2"/><g fill="'+GRN+'"><circle cx="20" cy="36" r="5"/><circle cx="37" cy="36" r="5"/><circle cx="54" cy="36" r="5"/><circle cx="71" cy="36" r="5"/><circle cx="88" cy="36" r="5"/></g>'+
    '<circle cx="54" cy="36" r="11" fill="none" stroke="'+PINK+'" stroke-width="2.5"/>');
  THUMB[3]=sv('<polygon points="54,8 14,64 94,64" fill="none" stroke="#fff" stroke-width="2"/><g stroke="'+YEL+'" stroke-width="1.2" opacity=".7"><line x1="30" y1="64" x2="46" y2="19"/><line x1="52" y1="64" x2="65" y2="24"/><line x1="74" y1="64" x2="80" y2="44"/></g>'+
    '<circle cx="46" cy="44" r="6" fill="'+TEAL+'"/><circle cx="68" cy="52" r="6" fill="'+PUR+'"/>');
  THUMB[4]=sv('<path d="M14 8V62H98" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M16 60Q30 18 94 12" fill="none" stroke="'+YEL+'" stroke-width="2.5"/><line x1="24" y1="43" x2="84" y2="13.5" stroke="'+TEAL+'" stroke-width="2"/>'+
    '<circle cx="54" cy="28" r="5" fill="'+TEAL+'"/><circle cx="54" cy="19" r="5" fill="'+YEL+'"/>');
  THUMB[5]=sv('<path d="M14 64L54 8L64 64Z" fill="'+PINK+'" fill-opacity=".4"/><path d="M54 8L94 64L64 64Z" fill="'+PUR+'" fill-opacity=".4"/><polygon points="54,8 14,64 94,64" fill="none" stroke="#fff" stroke-width="2"/><line x1="54" y1="8" x2="64" y2="64" stroke="#fff" stroke-width="2"/>'+
    '<circle cx="46" cy="46" r="5" fill="#fff"/><circle cx="72" cy="50" r="5" fill="#fff"/>');
  THUMB[6]=sv('<path d="M14 8V62H98" fill="none" stroke="#fff" stroke-width="1.5"/><g fill="none" stroke="'+GRAY+'" stroke-width="1.3"><path d="M20 30Q26 54 60 58"/><path d="M48 10Q58 40 96 46"/></g>'+
    '<path d="M32 12Q40 46 90 52" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/><circle cx="46" cy="38" r="5" fill="#fff"/>');
  THUMB[7]=sv('<path d="M14 62L14 20L56 62Z" fill="'+GRN+'" fill-opacity=".3"/><path d="M14 62L14 41L98 62Z" fill="'+PUR+'" fill-opacity=".3"/><path d="M14 8V62H98" fill="none" stroke="#fff" stroke-width="1.5"/>'+
    '<line x1="14" y1="20" x2="56" y2="62" stroke="'+GRN+'" stroke-width="2.5"/><line x1="14" y1="41" x2="98" y2="62" stroke="'+PUR+'" stroke-width="2.5"/><circle cx="24" cy="30" r="5" fill="#fff"/><circle cx="74" cy="56" r="5" fill="#fff"/>');
  THUMB[8]=sv('<path d="M14 62L14 14L86 62Z" fill="'+GRN+'" fill-opacity=".28"/><path d="M14 8V62H98" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="14" y1="14" x2="86" y2="62" stroke="'+GRN+'" stroke-width="2.5"/>'+
    '<path d="M30 8Q38 44 98 52" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/><circle cx="48" cy="37" r="5" fill="'+PINK+'"/>');
  THUMB[10]=sv('<rect x="24" y="8" width="60" height="56" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="36" y1="8" x2="84" y2="64" stroke="'+GRN+'" stroke-width="2.5"/>'+
    '<path d="M42 10Q52 46 84 52" fill="none" stroke="'+YEL+'" stroke-width="2"/><path d="M24 22Q58 26 70 62" fill="none" stroke="'+PUR+'" stroke-width="2"/><circle cx="64" cy="41" r="5" fill="'+PINK+'"/>');
  THUMB[11]=sv('<g stroke="#bdbdbd" stroke-width="1.6"><line x1="54" y1="10" x2="30" y2="36"/><line x1="54" y1="10" x2="78" y2="36"/><line x1="30" y1="36" x2="18" y2="62"/><line x1="30" y1="36" x2="42" y2="62"/><line x1="78" y1="36" x2="66" y2="62"/><line x1="78" y1="36" x2="90" y2="62"/></g>'+
    '<line x1="30" y1="36" x2="78" y2="36" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="54" cy="10" r="5" fill="'+PINK+'"/><circle cx="30" cy="36" r="5" fill="'+BLUE+'"/><circle cx="78" cy="36" r="5" fill="'+BLUE+'"/>');
  THUMB[12]=sv('<rect x="30" y="10" width="24" height="24" fill="'+PINK+'" fill-opacity=".8"/><rect x="54" y="10" width="24" height="24" fill="'+PINK+'" fill-opacity=".25"/><rect x="30" y="34" width="24" height="24" fill="'+PINK+'" fill-opacity=".25"/><rect x="54" y="34" width="24" height="24" fill="'+PINK+'" fill-opacity=".55"/>'+
    '<g fill="none" stroke="#555"><rect x="30" y="10" width="48" height="48"/><line x1="54" y1="10" x2="54" y2="58"/><line x1="30" y1="34" x2="78" y2="34"/></g>');
  THUMB[9]=sv([0,1,2,3].map(c=>[0,1,2,3].map(r=>{const on=[0,1,0,2][c]===r;return '<rect x="'+(17+c*20)+'" y="'+(6+r*15.5)+'" width="14" height="11" rx="2" fill="'+(on?PINK:'none')+'" stroke="'+(on?PINK:'#777')+'" stroke-width="1.3"/>'}).join('')).join(''));
})();


INIT[1]=function(){
function analyse(items,pairs,ans){
  const n=items.length;
  const Rel=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j));
  pairs.forEach(([i,j],k)=>{Rel[i][j]=ans[k]!=='<';Rel[j][i]=ans[k]!=='>';});
  let viol=null;
  for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++)
    if(!viol&&Rel[x][y]&&Rel[y][z]&&!Rel[x][z])viol=[x,y,z];
  let levels=null;
  if(!viol){
    levels=[];let rem=items.map((_,i)=>i);
    while(rem.length){
      const m=rem.filter(x=>rem.every(y=>Rel[y][x]));
      if(!m.length)break;
      levels.push(m);rem=rem.filter(x=>!m.includes(x));
    }
  }
  const rel=(x,y)=>items[x]+(Rel[x][y]&&Rel[y][x]?' \\ind ':' \\spf ')+items[y];
  const rank=levels?levels.slice().reverse().map(l=>l.map(i=>items[i]).join(' \\ind ')).join(' \\spf '):'';
  return {viol,levels,rel,rank,items};
}
function questionnaire(root,items,init,render){
  const pairs=[];
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)pairs.push([i,j]);
  const ans=init.slice();
  const rows=el('div','pairs'),o=out();root.append(rows,o);
  const segs=pairs.map(([i,j],k)=>{
    const row=el('div','pair');
    [['>','preferisco '+items[i]],['=','indifferente'],['<','preferisco '+items[j]]].forEach(([v,t])=>{
      const b=btn(t);b.dataset.v=v;b.onclick=()=>{ans[k]=v;upd()};row.append(b);
    });
    rows.append(row);return row;
  });
  function upd(){
    segs.forEach((s,k)=>s.querySelectorAll('button').forEach(b=>press(b,b.dataset.v===ans[k])));
    o.innerHTML=render(analyse(items,pairs,ans));
  }
  upd();
}
const violText=r=>{const [x,y,z]=r.viol;
  return '<span class="bad">Non è una relazione di preferenza.</span> Hai detto '+K(r.rel(x,y))+' e '+K(r.rel(y,z))+
    ', ma anche '+K(r.items[z]+' \\spf '+r.items[x])+': la transitività salta.'};

questionnaire($('#hero'),['a','b','c'],['>','<','>'],r=>
  r.viol?violText(r):'<span class="ok">È una relazione di preferenza.</span> L\'ordine è '+K(r.rank)+'.');

questionnaire($('#build'),['a','b','c','d'],['>','>','>','=','>','>'],r=>{
  if(r.viol)return violText(r)+' Senza transitività può non esserci nessuna minimale da cui partire.';
  const lv=r.levels.map((l,k)=>'<div class="lv"><b>'+l.map(i=>r.items[i]).join(', ')+'</b><i>u = '+(k+1)+'</i><small>M<sub>'+(k+1)+'</sub></small></div>')
    .join('<span class="lt" aria-hidden="true">≺</span>');
  return 'Preferenze: '+K(r.rank)+'<div class="levels">'+lv+'</div>';
});

/* Condorcet */
(function(){
  const root=$('#cond');
  const P=[['a','b','c'],['a','c','b'],['b','a','c'],['b','c','a'],['c','a','b'],['c','b','a']];
  const idx=[0,3,4];let mode='maj';
  const bM=btn('maggioranza'),bU=btn('unanimità');const top=group('Scegli la regola con cui unire i tre criteri',[bM,bU]);
  bM.onclick=()=>{mode='maj';upd()};bU.onclick=()=>{mode='una';upd()};
  const crit=[0,1,2].map(i=>{const b=btn('',true);b.setAttribute('aria-label','Cambia il criterio '+(i+1));
    b.onclick=()=>{idx[i]=(idx[i]+1)%6;upd()};return b});
  const crow=group('I tre criteri: tocca un criterio per passare all\'ordinamento successivo',crit);
  const svg=el('div');svg.style.cssText='width:100%;max-width:20rem';
  const o=out();root.append(top,crow,legend([[BLUE,'batte'],[GRAY,'coppia senza risposta','dash']]),svg,o);
  const pos={a:[160,42],b:[66,196],c:[254,196]};
  const cut=(p,q,r1,r2)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);
    return [p[0]+dx/d*r1,p[1]+dy/d*r1,q[0]-dx/d*r2,q[1]-dy/d*r2].map(v=>v.toFixed(1))};
  function upd(){
    press(bM,mode==='maj');press(bU,mode==='una');
    crit.forEach((b,i)=>b.innerHTML=K(P[idx[i]].join(' \\spf_'+(i+1)+' ')));
    const above=(x,y)=>idx.filter(k=>P[k].indexOf(x)<P[k].indexOf(y)).length;
    const need=mode==='maj'?2:3;
    let lines='';const wins={a:0,b:0,c:0},beats=[],inc=[];
    [['a','b'],['b','c'],['a','c']].forEach(([x,y])=>{
      const n=above(x,y);let w=null,l=null;
      if(n>=need){w=x;l=y}else if(3-n>=need){w=y;l=x}
      if(w){wins[w]++;beats.push(w+' \\spf '+l);
        const s=cut(pos[w],pos[l],28,35);
        lines+='<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+BLUE+'" stroke-width="3" marker-end="url(#arw)"/>';
      }else{inc.push(x+' e '+y);
        const s=cut(pos[x],pos[y],28,28);
        lines+='<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+GRAY+'" stroke-width="2" stroke-dasharray="5 7"/>';
      }
    });
    const nodes=Object.keys(pos).map(k=>'<text x="'+pos[k][0]+'" y="'+(pos[k][1]+10)+'" text-anchor="middle" font-size="30" font-style="italic" style="font-family:var(--serif)">'+k+'</text>').join('');
    svg.innerHTML='<svg viewBox="0 0 320 240" role="img" aria-label="Confronti a coppie fra a, b e c"><defs><marker id="arw" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+BLUE+'"/></marker></defs>'+lines+nodes+'</svg>';
    const order=Object.keys(wins).sort((p,q)=>wins[q]-wins[p]).join(' \\spf ');
    if(mode==='maj'){
      const cyc=wins.a===1&&wins.b===1&&wins.c===1;
      o.innerHTML=cyc?'<span class="bad">Completa, ma non transitiva.</span> '+beats.map(K).join(', ')+': un ciclo.'
        :'<span class="ok">Completa e transitiva.</span> Ne esce '+K(order)+'.';
    }else{
      o.innerHTML=inc.length?'<span class="bad">Transitiva, ma non completa.</span> I criteri non sono unanimi su '+inc.join(', su ')+': quelle coppie restano senza risposta.'
        :'<span class="ok">Completa e transitiva.</span> I tre criteri coincidono: '+K(order)+'.';
    }
  }
  upd();
})();

/* Cinema: la ricetta «togli i peggiori» passo per passo */
(function(){
  const g=$('#seats'),o=$('#seatOut');let sel=null,selInfo=null,k=100;
  $('#cinemaLeg').append(legend([['rgba(255,255,0,.25)','utilità bassa','box'],[YEL,'utilità alta','box'],['#2a2a2a','non ancora tolto','box'],[PINK,'posto selezionato','dash']]));
  const seats=[];
  for(let r=1;r<=10;r++)for(let c=1;c<=10;c++){
    const u=10*r-c+1,b=el('button','seat');b.type='button';b.dataset.u=u;
    b.setAttribute('aria-label','Fila '+r+', colonna '+c);
    b.onclick=()=>{if(sel)press(sel,false);sel=b;selInfo=[r,c,u];press(b,true);pl.seek(DUR)};
    g.append(b);seats.push(b);if(r===7&&c===4){sel=b;selInfo=[r,c,u];press(b,true)}
  }
  function showSeat(r,c,u){
    o.innerHTML='Fila '+r+', colonna '+c+': '+K('\\uu = 10\\cdot'+r+' - '+c+' + 1 = '+u)+
      '. Lo preferisce ad altri <span class="num">'+(u-1)+'</span> posti; <span class="num">'+(100-u)+'</span> sono migliori.';
  }
  const DUR=20;
  function frame(t){
    k=Math.round(t/DUR*100);
    seats.forEach(b=>{const u=+b.dataset.u;
      if(u<=k){b.style.background='';b.style.setProperty('--a',(0.08+0.92*u/100).toFixed(3))}else b.style.background='#2a2a2a';
      b.style.boxShadow=(u===k&&k<100)?'0 0 0 2px #fff':''});
    if(k>=100)showSeat.apply(null,selInfo);
    else if(k===0)o.innerHTML='All\'inizio nessun posto ha ancora un numero. La ricetta cerca il posto peggiore di tutti: prima fila, il più lontano dall\'uscita.';
    else{const r=Math.ceil(k/10),c=10*r-k+1;
      o.innerHTML='Passo <span class="num">'+k+'</span> di 100. Fra i posti rimasti il peggiore è quello in fila '+r+', colonna '+c+': viene tolto e riceve '+K('\\uu = '+k)+'.'}
  }
  const pl=player($('#cinemaPlay'),DUR,frame);pl.seek(DUR);
})();

/* Lessicografiche sul quadrato */
(function(){
  const svg=$('#sq'),s1=$('#z1'),s2=$('#z2');
  $('#sqLeg').append(legend([[BLUE,'preferite a z','box'],['#fff','escluse (stessa prima coordinata, più in basso)','dash']]));
  const X=v=>40+280*v,Y=v=>300-280*v;
  function draw(){
    const a=+s1.value,b=+s2.value,x=X(a),y=Y(b);
    $('#z1v').textContent=fmt(a);$('#z2v').textContent=fmt(b);
    svg.innerHTML=
      '<rect x="'+x+'" y="20" width="'+(320-x)+'" height="280" fill="'+BLUE+'" fill-opacity=".3"/>'+
      '<rect x="40" y="20" width="280" height="280" fill="none" stroke="'+GRAY+'" stroke-width="1.5"/>'+
      '<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="20" stroke="'+BLUE+'" stroke-width="3.5"/>'+
      '<line x1="'+x+'" y1="300" x2="'+x+'" y2="'+y+'" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 6"/>'+
      '<circle cx="'+x+'" cy="'+y+'" r="7" fill="#fff"/>'+
      '<text x="'+(x+(a>.8?-14:14))+'" y="'+(y+(b<.12?-10:22))+'" font-size="18" font-style="italic" text-anchor="'+(a>.8?'end':'start')+'" style="font-family:var(--serif)">z</text>'+
      '<text class="g" x="40" y="322" font-size="14" text-anchor="middle">0</text>'+
      '<text class="g" x="320" y="322" font-size="14" text-anchor="middle">1</text>'+
      '<text class="g" x="30" y="26" font-size="14" text-anchor="end">1</text>'+
      '<text class="g" x="180" y="334" font-size="14" text-anchor="middle">prima coordinata x₁</text>'+
      '<text class="g" x="14" y="160" font-size="14" text-anchor="middle" transform="rotate(-90 14 160)">seconda coordinata x₂</text>';
  }
  drag(svg,e=>{const [px,py]=svgPoint(svg,e,340,340);
    s1.value=Math.min(1,Math.max(0,(px-40)/280)).toFixed(2);
    s2.value=Math.min(1,Math.max(0,(300-py)/280)).toFixed(2);draw()});
  s1.oninput=draw;s2.oninput=draw;draw();
})();

/* Trasformazioni dell'utilità */
(function(){
  const U={a:5,b:-1,c:-1,d:-17},names=Object.keys(U);
  const F=[
    {t:'3\\uu-7',f:u=>3*u-7,inc:true},{t:'\\uu^3',f:u=>u*u*u,inc:true},{t:'e^{\\uu/5}',f:u=>Math.exp(u/5),inc:true},
    {t:'-\\uu',f:u=>-u,inc:false},{t:'\\uu^2',f:u=>u*u,inc:false}
  ];
  $('#trLeg').append(legend([[YEL,'valore di un\'alternativa','dot'],[YEL,'stessa alternativa prima e dopo']]));
  let cur=0;const bs=F.map((o,i)=>{const b=btn(K('f(\\uu)='+o.t),true);b.onclick=()=>{cur=i;draw()};$('#fbtns').append(b);return b});
  const order=v=>{const vals=[...new Set(names.map(n=>v[n]))].sort((p,q)=>q-p);
    return vals.map(x=>names.filter(n=>v[n]===x).join(' \\ind ')).join(' \\spf ')};
  function axis(v,y,below){
    const vs=names.map(n=>v[n]),mn=Math.min(...vs),mx=Math.max(...vs);
    const X=x=>70+(mx===mn?.5:(x-mn)/(mx-mn))*500;
    const groups=[...new Set(vs)].sort((p,q)=>p-q);
    let s='<line x1="70" y1="'+y+'" x2="570" y2="'+y+'" stroke="'+GRAY+'" stroke-width="1.5"/>';
    groups.forEach((g,i)=>{
      const ty=below?y+26+(i%2)*19:y-14-(i%2)*19;
      s+='<circle cx="'+X(g)+'" cy="'+y+'" r="6" fill="'+YEL+'"/>'+
        '<text x="'+X(g)+'" y="'+ty+'" font-size="16" text-anchor="middle"><tspan font-style="italic" style="font-family:var(--serif)">'+
        names.filter(n=>v[n]===g).join(', ')+'</tspan><tspan class="g" dx="7" font-size="14">'+fmt(g)+'</tspan></text>';
    });
    return {s,X};
  }
  function draw(){
    bs.forEach((b,i)=>press(b,i===cur));
    const W={};names.forEach(n=>W[n]=F[cur].f(U[n]));
    const A=axis(U,62,false),B=axis(W,150,true);
    let l='';names.forEach(n=>{l+='<line x1="'+A.X(U[n])+'" y1="62" x2="'+B.X(W[n])+'" y2="150" stroke="'+YEL+'" stroke-opacity=".45" stroke-width="1.5"/>'});
    $('#tr').innerHTML='<text x="28" y="68" font-size="19" font-style="italic" fill="'+YEL+'" style="fill:'+YEL+';font-family:var(--serif)">u</text><text x="26" y="156" font-size="19" font-style="italic" style="fill:'+YEL+';font-family:var(--serif)">w</text>'+l+A.s+B.s;
    const same=names.every(p=>names.every(q=>Math.sign(W[p]-W[q])===Math.sign(U[p]-U[q])));
    $('#trOut').innerHTML=same
      ?'<span class="ok">'+(F[cur].inc?'Crescente.':'Stesso ordine.')+'</span> L\'ordine resta '+K(order(W))+': '+K('\\ww')+' rappresenta le stesse preferenze.'
      :'<span class="bad">Non crescente.</span> La garanzia cade, e qui l\'ordine diventa '+K(order(W))+': '+K('\\ww')+' descrive preferenze diverse.';
  }
  draw();
})();

/* Relazione come tabella di sì e di no */
(function(){
  const root=$('#relgrid'),N=['a','b','c'];
  const Rl=[[1,1,0],[0,1,0],[0,0,1]];
  const pre=[['mancano risposte',[[1,1,0],[0,1,0],[0,0,1]]],['gira in tondo',[[1,1,0],[0,1,1],[1,0,1]]],['preferenza',[[1,1,1],[0,1,1],[0,1,1]]]];
  const pb=pre.map(([t,m])=>{const b=btn(t);b.onclick=()=>{m.forEach((r,i)=>r.forEach((v,j)=>Rl[i][j]=v));upd()};return b});
  const g=el('div','grid3'),o=out();
  root.append(group('Carica un esempio, poi modifica le caselle',pb),legend([[BLUE,'sì: la riga vale almeno quanto la colonna','box'],['#333','no','box']]),g,o);
  g.append(el('span','',''));N.forEach(n=>g.append(el('span','hd',n)));
  const cells=[];
  N.forEach((n,i)=>{g.append(el('span','hd',n));cells.push(N.map((m,j)=>{const b=el('button','btn');b.type='button';
    if(i===j)b.disabled=true;else b.onclick=()=>{Rl[i][j]=1-Rl[i][j];upd()};g.append(b);return b}))});
  function upd(){
    N.forEach((n,i)=>N.forEach((m,j)=>{const b=cells[i][j];b.className='btn '+(Rl[i][j]?'yes':'no');b.textContent=Rl[i][j]?'sì':'no';
      b.setAttribute('aria-label',n+' almeno quanto '+m+': '+(Rl[i][j]?'sì':'no'))}));
    let miss=null,viol=null;
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)if(!miss&&!Rl[i][j]&&!Rl[j][i])miss=[i,j];
    for(let x=0;x<3;x++)for(let y=0;y<3;y++)for(let z=0;z<3;z++)if(!viol&&x!==y&&y!==z&&Rl[x][y]&&Rl[y][z]&&!Rl[x][z])viol=[x,y,z];
    let h=miss?'<span class="bad">Non completa:</span> fra '+K(N[miss[0]])+' e '+K(N[miss[1]])+' non c\'è nessun sì.'
              :'<span class="ok">Completa:</span> ogni coppia ha almeno un sì.';
    h+='<br>'+(viol?'<span class="bad">Non transitiva:</span> '+K(N[viol[0]]+' \\pf '+N[viol[1]])+' e '+K(N[viol[1]]+' \\pf '+N[viol[2]])+', ma non '+K(N[viol[0]]+' \\pf '+N[viol[2]])+'.'
              :'<span class="ok">Transitiva:</span> i sì si incastrano.');
    if(!miss&&!viol){const sc=N.map((_,i)=>Rl[i].reduce((p,q)=>p+q,0)),ord=[0,1,2].sort((p,q)=>sc[q]-sc[p]);
      let t=N[ord[0]];for(let k=1;k<3;k++)t+=(Rl[ord[k]][ord[k-1]]?' \\ind ':' \\spf ')+N[ord[k]];
      h+='<br>È una relazione di preferenza: '+K(t)+'.'}
    o.innerHTML=h;
  }
  upd();
})();

/* Scala di Mohs: dieci minerali in ordine, nessuna distanza */
(function(){
  const root=$('#mohs'),M=['talco','gesso','calcite','fluorite','apatite','ortoclasio','quarzo','topazio','corindone','diamante'],X=k=>40+k*64,W=656;
  let s='<defs>'+arrowDef('moA',GRAY)+'</defs><line x1="'+X(0)+'" y1="50" x2="'+X(9)+'" y2="50" stroke="#555" stroke-width="2"/>';
  M.forEach((m,k)=>{s+='<circle cx="'+X(k)+'" cy="50" r="15" fill="#000" stroke="'+YEL+'" stroke-width="2"/>'+tx(X(k),56,k+1,{s:16,f:YEL})+tx(X(k),k%2?104:86,m,{s:13,f:'#e6e6e6'})+(k%2?'<line x1="'+X(k)+'" y1="68" x2="'+X(k)+'" y2="90" stroke="#555"/>':'')});
  s+='<line x1="'+X(2.5)+'" y1="16" x2="'+X(6.5)+'" y2="16" stroke="'+GRAY+'" stroke-width="1.6" marker-end="url(#moA)"/>'+tx(X(1.2),21,'più tenero',{s:13,f:GRAY})+tx(X(7.8),21,'più duro',{s:13,f:GRAY});
  svgBox(root,W,114,s,'Scala di Mohs: talco 1, gesso 2, calcite 3, fluorite 4, apatite 5, ortoclasio 6, quarzo 7, topazio 8, corindone 9, diamante 10','38rem');
})();
};
QZ['1b']=()=>[
 {q:'Una relazione completa è per forza riflessiva?',
  o:['Sì: basta applicare la completezza alla coppia '+K('(x,x)'),'No: la completezza riguarda solo coppie di alternative diverse','Solo se è anche transitiva','Solo se l\'insieme è finito'],a:0,
  e:'La completezza vale per ogni '+K('x')+' e '+K('y')+', anche uguali: con '+K('y=x')+' dice «'+K('x \\pf x')+' oppure '+K('x \\pf x')+'», cioè '+K('x \\pf x')+'.',
  h:'Nella definizione di completezza, '+K('x')+' e '+K('y')+' devono essere diversi?'}
];
QZ['1a']=()=>[
 {q:'Una persona ha una relazione di preferenza e ti dice '+K('a \\spf b')+' e '+K('b \\ind c')+'. Che cosa puoi concludere su '+K('a')+' e '+K('c')+'?',
  o:[K('a \\spf c'),K('a \\ind c'),K('c \\spf a'),'Niente: dipende dalla persona'],a:0,
  e:'Per transitività '+K('a \\pf c')+'. Se valesse anche '+K('c \\pf a')+', da '+K('b \\pf c')+' seguirebbe '+K('b \\pf a')+', contro '+K('a \\spf b')+'.',
  h:'Usa la transitività due volte: una per ottenere '+K('a \\pf c')+', una per escludere '+K('c \\pf a')+'.'}
];
QZ['1']=()=>[
 {q:'Quali due proprietà definiscono una relazione di preferenza?',
  o:['Riflessività e simmetria','Completezza e transitività','Transitività e antisimmetria','Completezza e simmetria'],a:1,
  e:'Completa: ogni coppia è confrontabile. Transitiva: i confronti si incastrano.',h:'Pensa alle due richieste fatte alle risposte del questionario.'},
 {q:'Tre criteri senza pareggi, aggregati a maggioranza. La relazione che ne esce è…',
  o:['sempre completa e transitiva','sempre transitiva, ma non necessariamente completa','sempre completa, ma non necessariamente transitiva','né completa né transitiva'],a:2,
  e:'Su ogni coppia almeno due criteri su tre sono d\'accordo, quindi è completa. Il paradosso di Condorcet mostra che può girare in tondo.',h:'Torna alla figura di Condorcet e guarda che cosa manca con ciascuna regola.'},
 {q:K('\\uu')+' rappresenta '+K('\\pf')+'. Quale di queste funzioni la rappresenta di sicuro?',
  o:[K('\\ww = -\\uu'),K('\\ww = \\uu^2'),K('\\ww = 3\\uu - 7'),K('\\ww = |\\uu|')],a:2,
  e:K('3\\uu-7')+' è una funzione crescente di '+K('\\uu')+', quindi conserva l\'ordine.',h:'Serve una trasformazione crescente.'},
 {q:'Nel cinema del libro, 40 file per 50 colonne, quanto vale l\'utilità del posto in fila 2, colonna 50?',
  o:['2','50','51','99'],a:2,
  e:K('\\uu = 50\\cdot 2 - 50 + 1 = 51')+': è il primo posto della seconda fila a essere tolto, subito dopo i 50 della prima.',h:'Applica '+K('\\uu(x) = 50\\,r(x) - c(x) + 1')+' con '+K('r=2')+' e '+K('c=50')+'.'},
 {q:'Le preferenze lessicografiche sul quadrato unitario…',
  o:['non sono complete','non sono transitive','sono una relazione di preferenza, ma nessuna funzione di utilità le rappresenta','sono rappresentate da '+K('\\uu(x_1,x_2)=x_1+x_2')],a:2,
  e:'Sono complete e transitive. Ma servirebbe un intervallo di numeri separato per ogni valore di '+K('x_1')+', e non ce ne sono abbastanza.',h:'Completezza e transitività qui valgono: il problema è un altro.'}
];


INIT[2]=function(){
(function(){
  const root=$('#choice');
  const probs=[['a','b'],['a','c'],['b','c'],['a','b','c']];
  let ch=['a','a','b','a'];
  const set=p=>'\\{'+p.join(',')+'\\}';
  const pre=group('Carica un esempio',[['primo: razionale',['a','a','b','a']],['secondo: vincitore battuto',['b','a','b','a']],['terzo: ciclo',['a','c','b','a']]].map(([t,v])=>{
    const b=btn(t);b.onclick=()=>{ch=v.slice();upd()};return b}));
  const rows=el('div','pairs');root.append(pre,el('div','pick','Oppure decidi tu la scelta da ogni insieme'),rows);
  const segs=probs.map((p,k)=>{
    const row=el('div','pair');row.append(el('span','lab',K('\\cf('+set(p)+')=')));
    p.forEach(x=>{const b=btn(K(x),true);b.dataset.x=x;b.style.minWidth='2.8rem';
      b.setAttribute('aria-label','Da '+p.join(', ')+' sceglie '+x);
      b.onclick=()=>{ch[k]=x;upd()};row.append(b)});
    rows.append(row);return row;
  });
  const o=out();root.append(o);
  const perms=[['a','b','c'],['a','c','b'],['b','a','c'],['b','c','a'],['c','a','b'],['c','b','a']];
  function upd(){
    segs.forEach((r,k)=>r.querySelectorAll('button').forEach(b=>press(b,b.dataset.x===ch[k])));
    const ok=perms.find(p=>probs.every((A,k)=>p.find(x=>A.includes(x))===ch[k]));
    if(ok){o.innerHTML='<span class="ok">Razionalizzabile.</span> Si comporta come se massimizzasse '+K(ok.join(' \\spf '))+'.';return}
    const top=ch[3];let msg='';
    probs.slice(0,3).forEach((B,k)=>{if(!msg&&B.includes(top)&&ch[k]!==top)
      msg='Da '+K(set(probs[3]))+' sceglie '+K(top)+', che sta anche in '+K(set(B))+'; ma da lì sceglie '+K(ch[k])+'.'});
    o.innerHTML='<span class="bad">Non razionalizzabile.</span> '+msg+' È una violazione della proprietà α.';
  }
  upd();
})();

/* Mediana */
(function(){
  const root=$('#median');let on=[true,true,true,true,true];
  const pre=group('Carica un insieme di alternative disponibili',[['tutte e cinque',[1,1,1,1,1]],['solo a₃, a₄, a₅',[0,0,1,1,1]]].map(([t,v])=>{const b=btn(t);b.onclick=()=>{on=v.map(Boolean);upd()};return b}));
  const svg=el('div');svg.style.cssText='width:100%;max-width:32rem;cursor:pointer';
  const o=out();root.append(pre,legend([[GRN,'disponibile','dot'],[GRAY,'tolta','dot'],[PINK,'scelta: la mediana']]),svg,o);
  const X=i=>70+i*100;
  function upd(){
    const av=on.map((v,i)=>v?i:-1).filter(i=>i>=0),pick=av[Math.floor((av.length-1)/2)];
    let s='<line x1="30" y1="50" x2="510" y2="50" stroke="'+GRAY+'" stroke-width="2"/>';
    on.forEach((v,i)=>{
      s+='<g data-i="'+i+'" tabindex="0" role="button" aria-pressed="'+v+'" aria-label="Alternativa a'+(i+1)+(v?', disponibile':', non disponibile')+'" style="cursor:pointer">'+
        '<rect x="'+(X(i)-45)+'" y="5" width="90" height="100" fill="transparent"/>'+
        (i===pick?'<circle cx="'+X(i)+'" cy="50" r="19" fill="none" stroke="'+PINK+'" stroke-width="3.5"/>':'')+
        '<circle cx="'+X(i)+'" cy="50" r="10" fill="'+(v?GRN:'#000')+'" stroke="'+(v?GRN:GRAY)+'" stroke-width="2"/>'+
        '<text x="'+X(i)+'" y="98" text-anchor="middle" font-size="20" font-style="italic" style="font-family:var(--serif);'+(v?'':'fill:'+GRAY)+'">a<tspan font-size="14" dy="5">'+(i+1)+'</tspan></text></g>';
    });
    svg.innerHTML='<svg viewBox="0 0 540 112" role="group" aria-label="Alternative da a1 ad a5: tocca per togliere o rimettere">'+s+'</svg>';
    svg.querySelectorAll('g').forEach(g=>{const t=()=>{const i=+g.dataset.i;if(on[i]&&on.filter(Boolean).length===1)return;on[i]=!on[i];upd()};
      g.onclick=t;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}}});
    let t='Sceglie '+K('a_'+(pick+1))+', la mediana di '+av.length+(av.length===1?' alternativa':' alternative')+
      (av.length%2===0?' (la più a sinistra delle due centrali)':'')+'.';
    if(on[2]&&pick!==2)t+=' <span class="bad">Violazione della proprietà α:</span> da tutte e cinque sceglieva '+K('a_3')+', che è ancora disponibile.';
    else if(av.length<5)t+=' Nessuna violazione rispetto alla scelta dall\'insieme completo.';
    o.innerHTML=t;
  }
  upd();
})();

/* Satisficing */
(function(){
  const names=['a','b','c','d'],v=[-1,-2,1,3];let on=[true,true,true,true];
  const sl=$('#vstar'),svg=$('#sat'),o=$('#satOut'),row=$('#satAvail');
  const bs=names.map((n,i)=>{const b=btn(K(n),true);b.style.minWidth='2.8rem';b.setAttribute('aria-label','Candidato '+n);
    b.onclick=()=>{if(on[i]&&on.filter(Boolean).length===1)return;on[i]=!on[i];draw()};row.append(b);return b});
  $('#satLeg').append(legend([[YEL,'soddisfacente','box'],['#5a5a5a','insoddisfacente','box'],[PINK,'scelta'],[ORG,'livello di aspirazione','dash']]));
  const Y=x=>24+(4.5-x)/8*200,cx=i=>140+i*120;
  function draw(){
    const t=+sl.value;$('#vstarv').textContent=fmt(t);
    bs.forEach((b,i)=>press(b,on[i]));
    const av=names.map((_,i)=>i).filter(i=>on[i]);
    let pick=av.find(i=>v[i]>=t);if(pick===undefined)pick=av[av.length-1];
    let s='';
    [-2,0,2,4].forEach(g=>{s+='<text class="g" x="58" y="'+(Y(g)+5)+'" font-size="14" text-anchor="end">'+fmt(g)+'</text>'});
    s+='<text class="g" x="16" y="'+Y(1)+'" font-size="14" text-anchor="middle" transform="rotate(-90 16 '+Y(1)+')">valutazione v</text>';
    names.forEach((n,i)=>{
      const y0=Y(0),y1=Y(v[i]),sat=v[i]>=t,op=on[i]?1:.2;
      s+='<g opacity="'+op+'"><rect x="'+(cx(i)-34)+'" y="'+Math.min(y0,y1)+'" width="68" height="'+Math.abs(y1-y0)+'" fill="'+(sat?YEL:'#5a5a5a')+'"'+
        (i===pick?' stroke="'+PINK+'" stroke-width="4"':'')+'/>'+
        '<text x="'+cx(i)+'" y="'+(v[i]>=0?y1-10:y1+21)+'" font-size="15" text-anchor="middle">'+fmt(v[i])+'</text>'+
        '<text x="'+cx(i)+'" y="250" font-size="21" text-anchor="middle" font-style="italic" style="font-family:var(--serif)">'+n+'</text></g>';
      if(i===pick)s+='<text x="'+cx(i)+'" y="268" font-size="14" text-anchor="middle" style="fill:'+PINK+'">scelta</text>';
    });
    s+='<line x1="70" y1="'+Y(0)+'" x2="590" y2="'+Y(0)+'" stroke="#fff" stroke-width="1.5"/>'+
       '<line x1="70" y1="'+Y(t)+'" x2="590" y2="'+Y(t)+'" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="8 6"/>'+
       '<text x="598" y="'+(Y(t)+6)+'" font-size="18" font-style="italic" style="fill:'+ORG+';font-family:var(--serif)">v*</text>';
    svg.innerHTML=s;
    const idx=names.map((_,i)=>i),satL=idx.filter(i=>v[i]>=t),unL=idx.filter(i=>v[i]<t).reverse();
    const pref=satL.concat(unL).map(i=>names[i]).join(' \\spf ');
    const why=av.some(i=>v[i]>=t)?'è il primo disponibile con '+K('\\vv \\ge \\vs'):'nessun disponibile raggiunge '+K('\\vs')+', quindi è l\'ultimo esaminato';
    o.innerHTML='Sceglie '+K(names[pick])+': '+why+'.<br>Preferenza che razionalizza: '+K(pref);
  }
  sl.oninput=draw;draw();
})();

/* Pompa di denaro: il ciclo degli scambi, leggibile a colpo d'occhio */
(function(){
  const root=$('#pump'),P={a:[320,74],c:[492,300],b:[148,300]},r=36;
  const cut=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);return [p[0]+dx/d*(r+8),p[1]+dy/d*(r+8),q[0]-dx/d*(r+16),q[1]-dy/d*(r+16)].map(v=>v.toFixed(1))};
  const arrow=(x,y)=>{const s=cut(P[x],P[y]);return '<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+PINK+'" stroke-width="3.5" marker-end="url(#pmp)"/>'};
  const it=t=>'<tspan font-style="italic" style="font-family:var(--serif)">'+t+'</tspan>';
  const lab=(x,y,anc,x1,x2,to)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anc+'" font-size="16">da {'+it(x1)+', '+it(x2)+'} sceglie '+it(to)+'</text>'+
    '<text x="'+x+'" y="'+(y+24)+'" text-anchor="'+anc+'" font-size="17" font-weight="500" style="fill:'+RED+'">paga 1 $</text>';
  let s='<defs><marker id="pmp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+PINK+'"/></marker></defs>';
  s+=arrow('a','c')+arrow('c','b')+arrow('b','a');
  Object.keys(P).forEach(k=>{s+='<circle cx="'+P[k][0]+'" cy="'+P[k][1]+'" r="'+r+'" fill="#000" stroke="'+(k==='a'?'#fff':GRAY)+'" stroke-width="'+(k==='a'?3:2)+'"/>'+
    '<text x="'+P[k][0]+'" y="'+(P[k][1]+10)+'" text-anchor="middle" font-size="30" font-style="italic" style="font-family:var(--serif)">'+k+'</text>'});
  s+='<text class="g" x="320" y="22" text-anchor="middle" font-size="14">parte da qui</text>';
  s+=lab(446,170,'start','a','c','c')+lab(320,372,'middle','b','c','b')+lab(194,170,'end','a','b','a');
  s+='<text class="g" x="320" y="222" text-anchor="middle" font-size="15">un giro completo</text>'+
     '<text x="320" y="262" text-anchor="middle" font-size="34" font-weight="500" style="fill:'+RED+'">−3 $</text>';
  const svg=el('div');svg.style.cssText='width:100%;max-width:36rem';
  svg.innerHTML='<svg viewBox="0 0 640 410" role="img" aria-label="Ciclo della pompa di denaro: da a passa a c, da c a b, da b di nuovo ad a, pagando un dollaro a ogni scambio">'+s+'</svg>';
  root.append(legend([[PINK,'scambio accettato'],[RED,'quanto paga a ogni scambio','box']]),svg);
})();
};
QZ['2a']=()=>[
 {q:'Perché nessuna preferenza sui quattro piatti (salmone, bistecca, lumache, cosce di rana) razionalizza il cliente?',
  o:['Perché detesta lumache e cosce di rana','Perché i prezzi dei piatti sono diversi','Perché servirebbe salmone sopra bistecca e, insieme, bistecca sopra salmone','Perché non conosce la città'],a:2,
  e:'Dalla coppia sceglie il salmone, dal menu completo la bistecca: le due scelte chiedono ordini opposti.',h:'Confronta la scelta dal menu corto con quella dal menu lungo.'}
];
QZ['2c']=()=>[
 {q:'Le slide chiedono: un trader convinto che '+K('2+3=6')+' può sopravvivere a lungo sul mercato?',
  o:['Sì: un errore di calcolo non c\'entra con le preferenze','No: chi se ne accorge può guadagnare a sue spese quante volte vuole','Sì, purché le sue scelte soddisfino la completezza','Dipende dalla sua avversione al rischio'],a:1,
  e:'È la logica della pompa di denaro: basta vendergli, separati, due e tre oggetti al prezzo che lui ritiene giusto per sei, e ripetere. Un\'incoerenza sistematica è un\'occasione di guadagno per gli altri. Le slide lasciano la domanda aperta: questa è la risposta che suggerisce l\'argomento.',
  h:'Pensa a che cosa gli proporresti tu, sapendo come fa i conti.'}
];
QZ['2b']=()=>[
 {q:'Le alternative sono '+K('a, b, c, d')+' e '+K('\\cf(\\{a,b,c,d\\}) = b')+'. Se la funzione di scelta soddisfa la proprietà α, quale di queste scelte è obbligata?',
  o:[K('\\cf(\\{a,b\\}) = b'),K('\\cf(\\{a,c,d\\}) = a'),K('\\cf(\\{c,d\\}) = c'),'Nessuna: la proprietà α riguarda solo l\'insieme completo'],a:0,
  e:K('b')+' è scelto dall\'insieme grande e sta ancora in '+K('\\{a,b\\}')+': deve essere scelto anche da lì. Sugli insiemi senza '+K('b')+' la proprietà, da questa sola informazione, non dice nulla.',
  h:'La proprietà scatta solo per i sottoinsiemi che contengono ancora l\'alternativa scelta dall\'insieme grande.'}
];
QZ['2']=()=>[
 {q:'Con tre alternative ci sono 24 funzioni di scelta. Quante sono razionalizzabili?',o:['3','6','12','24'],a:1,
  e:'Una per ciascuno dei 6 ordinamenti stretti di tre alternative.',h:'Quanti modi ci sono di mettere in fila tre alternative?'},
 {q:'Che cosa richiede la proprietà α?',
  o:['Se '+K('\\cf(\\sA) \\in \\sB \\subset \\sA')+', allora '+K('\\cf(\\sB) = \\cf(\\sA)'),'Se '+K('\\sB \\subset \\sA')+', allora '+K('\\cf(\\sB) = \\cf(\\sA)'),
     K('\\cf(\\sA)')+' è l\'alternativa con il valore più alto in '+K('\\sA'),'Se '+K('\\cf(\\sB) \\in \\sA')+', allora '+K('\\cf(\\sA) \\in \\sB')],a:0,
  e:'Vale solo quando la scelta dall\'insieme grande è ancora disponibile in quello piccolo.',h:'La condizione scatta solo se il prescelto di '+K('\\sA')+' sta ancora in '+K('\\sB')+'.'},
 {q:'La procedura «prendo il primo abbastanza buono, altrimenti l\'ultimo» è razionalizzabile?',
  o:['Mai','Solo se il livello di aspirazione è più basso di tutte le valutazioni','Solo se l\'ordine di esame coincide con l\'ordine di qualità','Sempre'],a:3,
  e:'La preferenza: prima i soddisfacenti nell\'ordine di esame, poi gli insoddisfacenti in ordine inverso.',h:'Guarda la preferenza che la figura mostra al variare della soglia.'},
 {q:'I candidati dell\'esempio hanno '+K('\\vv(a)=-1')+', '+K('\\vv(b)=-2')+', '+K('\\vv(c)=1')+', '+K('\\vv(d)=3')+' e sono esaminati in ordine alfabetico. Con livello di aspirazione '+K('\\vs = 2')+', chi viene scelto da '+K('\\{a,b,c\\}')+'?',
  o:[K('a'),K('b'),K('c'),'Nessuno: la procedura non sceglie'],a:2,
  e:'Nessuno dei tre raggiunge 2, quindi la regola prende l\'ultimo nell\'ordine di esame. Che sia anche il migliore dei tre è un caso.',h:'Controlla prima se qualcuno dei tre raggiunge la soglia; poi applica la seconda parte della regola.'},
 {q:'Nella pompa di denaro, la persona parte con '+K('a')+' e accetta tre scambi da un dollaro. Che cosa ha in mano alla fine?',
  o:[K('a')+', e tre dollari in meno',K('b')+', e tre dollari in meno',K('c')+', e tre dollari in meno',K('a')+', e nessuna perdita'],a:0,
  e:'Passa da '+K('a')+' a '+K('c')+', da '+K('c')+' a '+K('b')+' e da '+K('b')+' di nuovo ad '+K('a')+', pagando ogni volta.',h:'Segui i tre scambi nella figura della pompa di denaro.'}
];


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


INIT[5]=function(){
/* Stati del mondo e atti: la tabella delle slide in un solo disegno */
(function(){
  const root=$('#states5'),ST=['ABC','ACB','BAC','BCA','CAB','CBA'],rh=40,W=560,y0=44;
  let s=tx(40,26,'stato',{s:13,f:GRAY})+tx(190,26,'ordine d\'arrivo',{s:13,f:GRAY})+tx(380,26,'atto f',{s:15,f:PINK,i:1})+tx(490,26,'atto g',{s:15,f:PUR,i:1});
  ST.forEach((o,k)=>{const y=y0+k*rh,fw=o[0]==='A',gw=o[0]==='C';
    s+='<line x1="10" y1="'+y+'" x2="'+(W-10)+'" y2="'+y+'" stroke="#2a2a2a"/>'+tx(40,y+rh/2+5,k+1,{s:15});
    o.split('').forEach((h,i)=>{const cx=140+i*50;
      s+='<circle cx="'+cx+'" cy="'+(y+rh/2)+'" r="'+(i?12:15)+'" fill="'+(i?'none':'#fff')+'" stroke="'+(i?'#777':'#fff')+'" stroke-width="1.5"/>'+tx(cx,y+rh/2+5,h,{s:i?14:16,f:i?'#c9c9c9':'#000',w:i?400:600})});
    [[380,fw,'+10'],[490,gw,'+20']].forEach(a=>{s+='<rect x="'+(a[0]-36)+'" y="'+(y+6)+'" width="72" height="'+(rh-12)+'" rx="4" fill="'+(a[1]?GRN:'none')+'" stroke="'+(a[1]?GRN:RED)+'" stroke-width="1.4"/>'+tx(a[0],y+rh/2+5,a[1]?a[2]:'−10',{s:15,f:a[1]?'#000':RED})});
  });
  s+=tx(140,y0+6*rh+20,'1°',{s:13,f:GRAY})+tx(190,y0+6*rh+20,'2°',{s:13,f:GRAY})+tx(240,y0+6*rh+20,'3°',{s:13,f:GRAY});
  root.append(legend([['#fff','il cavallo che vince','dot'],[GRN,'la scommessa paga (euro)','box'],[RED,'la scommessa perde (euro)','dash']]));
  svgBox(root,W,y0+6*rh+28,s,'Tabella dei sei stati del mondo con i pagamenti degli atti f e g: f paga 10 quando vince Ace, g paga 20 quando vince Challenger, altrimenti si perdono 10','34rem');
})();
/* Il triangolo delle convinzioni: chi sceglie f e chi sceglie g */
(function(){
  const root=$('#seu5'),A=[60,330],C=[500,330],B=[280,36];
  const P=(a,b,c)=>[a*A[0]+b*B[0]+c*C[0],a*A[1]+b*B[1]+c*C[1]];
  const M=P(.6,0,.4),pp=p=>p[0].toFixed(1)+' '+p[1].toFixed(1);
  let s='<path d="M'+pp(A)+'L'+pp(B)+'L'+pp(M)+'Z" fill="'+PINK+'" fill-opacity=".28"/><path d="M'+pp(B)+'L'+pp(C)+'L'+pp(M)+'Z" fill="'+PUR+'" fill-opacity=".28"/>';
  s+='<path d="M'+pp(A)+'L'+pp(B)+'L'+pp(C)+'Z" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="'+B[0]+'" y1="'+B[1]+'" x2="'+M[0]+'" y2="'+M[1]+'" stroke="#fff" stroke-width="2.5"/>';
  s+=tx(A[0]-8,A[1]+22,'vince Ace di sicuro',{s:13,f:GRAY,a:'start'})+tx(C[0]+8,C[1]+22,'vince Challenger di sicuro',{s:13,f:GRAY,a:'end'})+tx(B[0],B[1]-12,'vince Bolt di sicuro',{s:13,f:GRAY});
  s+=tx(150,314,'sceglie f',{s:17,f:PINK})+tx(372,314,'sceglie g',{s:17,f:PUR});
  const D=P(.5,.3,.2),E=P(.3,.3,.4);
  s+='<circle cx="'+D[0]+'" cy="'+D[1]+'" r="7" fill="#fff" stroke="#000" stroke-width="1.5"/>'+tx(D[0]-12,D[1]-4,'Dario',{s:14,a:'end'})+tx(D[0]-12,D[1]+14,'A 50%, B 30%, C 20%',{s:12,f:'#c9c9c9',a:'end'});
  s+='<circle cx="'+E[0]+'" cy="'+E[1]+'" r="7" fill="#fff" stroke="#000" stroke-width="1.5"/>'+tx(E[0]+12,E[1]-4,'Elena',{s:14,a:'start'})+tx(E[0]+12,E[1]+14,'A 30%, B 30%, C 40%',{s:12,f:'#c9c9c9',a:'start'});
  s+=tx(M[0],M[1]+20,'A 60%, C 40%',{s:12,f:GRAY});
  root.append(legend([[PINK,'convinzioni per cui conviene f','box'],[PUR,'convinzioni per cui conviene g','box'],['#fff','confine: π(vince A) = 1,5 · π(vince C)']]));
  svgBox(root,560,360,s,'Triangolo delle probabilità soggettive di vittoria dei tre cavalli, diviso dalla retta in cui la probabilità di Ace è una volta e mezza quella di Challenger','34rem');
})();
};
QZ['5a']=()=>[
 {q:'Un terzo atto: 10 euro alla pari su Bolt. In quanti dei sei stati del mondo fa vincere 10 euro?',
  o:['Uno','Due','Tre','Dipende dalle probabilità'],a:1,
  e:'Bolt vince negli stati BAC e BCA. Per descrivere l\'atto bastano gli stati e i premi: le probabilità non servono.',
  h:'Scorri la colonna dell\'ordine d\'arrivo e conta le righe in cui Bolt è primo.'}
];
QZ['5b']=()=>[
 {q:'Una persona neutrale al rischio crede che Ace vinca con probabilità 0,4, Bolt con 0,3 e Challenger con 0,3. Quale atto sceglie?',
  o:[K('\\af')+', perché Ace è il favorito',K('\\ag')+', perché ha l\'utilità attesa più alta','È indifferente','Non si può dire senza le probabilità oggettive'],a:1,
  e:K('\\UU(\\af)=0{,}4\\cdot 10-0{,}6\\cdot 10=-2')+' e '+K('\\UU(\\ag)=0{,}3\\cdot 20-0{,}7\\cdot 10=-1')+'. Infatti '+K('0{,}4/0{,}3\\approx 1{,}33 \\lt 1{,}5')+': Ace è favorito, ma non abbastanza da compensare il premio doppio su Challenger.',
  h:'Calcola le due utilità attese con '+K('\\vv(z)=z')+', oppure confronta '+K('0{,}4/0{,}3')+' con '+K('3/2')+'.'}
];
QZ['5']=()=>[
 {q:'Che cos\'è un atto?',
  o:['Una distribuzione di probabilità sui premi','Una funzione che a ogni stato del mondo associa un premio','Una probabilità per ogni stato del mondo','Una funzione di utilità sui premi'],a:1,
  e:'Un atto dice che cosa si ottiene in ciascuno stato. La prima risposta descrive una lotteria, la terza le convinzioni '+K('\\ppi')+'.',
  h:'Nella tabella della corsa, un atto è una colonna intera.'},
 {q:'Perché per la corsa dei cavalli non bastano le lotterie delle lezioni 3 e 4?',
  o:['Perché i premi non sono in denaro','Perché gli esiti possibili sono più di due','Perché le probabilità non sono note né osservabili','Perché gli scommettitori non sono razionali'],a:2,
  e:'Una lotteria è un elenco di premi con le loro probabilità. Per il SuperEnalotto quei numeri esistono; per una corsa no.',
  h:'Che cosa serve per scrivere una lotteria, oltre ai premi?'},
 {q:'Due persone hanno la stessa funzione '+K('\\vv')+' e davanti agli stessi due atti scelgono in modo diverso. Secondo la SEU, perché?',
  o:['Almeno una delle due non è razionale','Attribuiscono probabilità diverse agli stati del mondo','Gli atti danno premi diversi alle due persone','Non può succedere'],a:1,
  e:'Nella SEU le probabilità '+K('\\ppi')+' sono soggettive: con la stessa '+K('\\vv')+', convinzioni diverse bastano a cambiare la scelta. È il caso di Dario ed Elena.',
  h:'Nella formula della SEU ci sono due ingredienti personali. Uno è '+K('\\vv')+'; l\'altro?'},
 {q:'Con '+K('\\vv')+' lineare, per chi crede che Challenger vinca con probabilità 0,2 l\'atto '+K('\\af')+' è preferito a '+K('\\ag')+' quando la probabilità di vittoria di Ace è almeno…',
  o:['0,2','0,3','0,4','0,5'],a:1,
  e:'Serve '+K('\\ppi(\\text{vince A}) \\ge \\tfrac32\\cdot 0{,}2=0{,}3')+'.',
  h:'Usa la soglia: la probabilità di Ace deve essere almeno una volta e mezza quella di Challenger.'}
];


INIT[6]=function(){
const D=20,ID=[12,9];
const PREFS={
  lin:{name:'Scambio costante',u:(p,s)=>s.r*p[0]+p[1],tex:s=>'\\uu = \\vv_1x_1+\\vv_2x_2,\\quad \\vv_1/\\vv_2='+tn(s.r),
    desc:'Ogni unità del bene 1 vale sempre lo stesso numero di unità del bene 2. Le curve di indifferenza sono rette parallele.',
    bg:[[3,3],[6,6],[9,9],[12,12],[15,15]],mono:[1,1],why:'Con entrambi i valori positivi, più di un bene qualsiasi migliora sempre.',
    curve:(a,s)=>{const u0=s.r*a[0]+a[1];return [[[Math.max(0,(u0-D)/s.r),Math.min(D,u0)],[Math.min(D,u0/s.r),Math.max(0,u0-s.r*D)]]]}},
  only2:{name:'Conta solo il bene 2',u:p=>p[1],tex:()=>'\\uu = x_2',
    desc:'Il bene 1 le è del tutto indifferente. Le curve di indifferenza sono rette orizzontali.',
    bg:[[0,4],[0,8],[0,12],[0,16]],mono:[1,0],why:'Più bene 1 da solo lascia indifferenti: monotona, ma non fortemente.',
    curve:a=>[[[0,a[1]],[D,a[1]]]]},
  min1:{name:'Prima 10 del bene 1',u:p=>p[0]<=10?p[0]:11+p[1],tex:()=>'\\uu = \\begin{cases}x_1 & \\text{se } x_1\\le 10\\\\ 11+x_2 & \\text{se } x_1>10\\end{cases}',
    desc:'Finché il bene 1 non supera 10 conta solo quello; oltre, conta solo il bene 2. Sopra la soglia le curve sono semirette orizzontali, aperte a sinistra.',
    bg:[[2.5,0],[5,0],[7.5,0],[10,0],[15,4],[15,8],[15,12],[15,16]],mono:[1,0],why:'Sotto la soglia, più bene 2 non serve; sopra, più bene 1 non serve. Monotona, ma non fortemente.',
    curve:a=>a[0]<=10?[[[a[0],0],[a[0],D]]]:[[[10,a[1]],[D,a[1]]]],open:a=>a[0]>10?[10,a[1]]:null},
  comp:{name:'Complementari',u:p=>Math.min(p[0],p[1]),tex:()=>'\\uu = \\min\\{x_1,x_2\\}',
    desc:'Vuole i due beni nella stessa quantità, come scarpe destre e sinistre. Le curve sono a forma di L.',
    bg:[[4,4],[8,8],[12,12],[16,16]],mono:[1,0],why:'Una scarpa in più senza l\'altra non cambia nulla: monotona, ma non fortemente.',
    curve:a=>{const m=Math.min(a[0],a[1]);return [[[m,D],[m,m],[D,m]]]}},
  ideal:{name:'Paniere ideale',u:p=>-(Math.abs(p[0]-ID[0])+Math.abs(p[1]-ID[1])),tex:()=>'\\uu = -\\big(|x_1-x_1^*|+|x_2-x_2^*|\\big)',
    desc:'Ha in mente un paniere ideale e preferisce i panieri che gli sono più vicini, sommando le differenze nei due beni. Le curve sono rombi attorno all\'ideale.',
    bg:[[ID[0]+3,ID[1]],[ID[0]+6,ID[1]],[ID[0]+9,ID[1]],[ID[0]+12,ID[1]]],mono:[0,0],why:'Superato l\'ideale, avere di più peggiora: non è monotona.',
    curve:a=>{const d=Math.abs(a[0]-ID[0])+Math.abs(a[1]-ID[1]);return [[[ID[0]+d,ID[1]],[ID[0],ID[1]+d],[ID[0]-d,ID[1]],[ID[0],ID[1]-d],[ID[0]+d,ID[1]]]]},star:true},
  lex:{name:'Lessicografiche',geq:(p,q)=>p[0]>q[0]+1e-9||(Math.abs(p[0]-q[0])<=1e-9&&p[1]>=q[1]-1e-9),tex:()=>'\\text{nessuna funzione di utilità}',
    desc:'Conta prima di tutto il bene 1; a parità, il bene 2. Ogni insieme di indifferenza è un solo punto.',
    bg:[],mono:[1,1],why:'Più di un bene qualsiasi migliora sempre: fortemente monotona.',
    curve:a=>[[[a[0],a[1]],[a[0],D]]]},
  prod:{name:'x₁ · x₂',u:p=>p[0]*p[1],tex:()=>'\\uu = x_1x_2',desc:'',
    bg:[[4,4],[8,8],[12,12],[16,16]],
    curve:a=>{const k=a[0]*a[1];if(k<=1e-9)return [[[0,D],[0,0],[D,0]]];const pts=[];for(let i=0;i<=80;i++){const x=k/D+(D-k/D)*Math.pow(i/80,2);pts.push([x,k/x])}return [pts]}},
  max:{name:'max{x₁, x₂}',u:p=>Math.max(p[0],p[1]),tex:()=>'\\uu = \\max\\{x_1,x_2\\}',desc:'',
    bg:[[4,4],[8,8],[12,12],[16,16]],
    curve:a=>{const m=Math.max(a[0],a[1]);return [[[0,m],[m,m],[m,0]]]}}
};
let plotId=0;
function prefPlot(root,o){
  const id='pp'+(++plotId),S=400,x0=46,y0=14,L=340;
  const X=v=>x0+v/D*L,Y=v=>y0+L-v/D*L;
  const st={pref:o.prefs[0],a:o.a.slice(),b:o.b?o.b.slice():null,r:4/3,th:35};
  let bs=[];
  if(o.prefs.length>1){bs=o.prefs.map(k=>{const b=btn(PREFS[k].name);b.onclick=()=>{st.pref=k;draw()};return b});root.append(group(o.pick||'Scegli il consumatore',bs))}
  if(o.legend)root.append(legend(o.legend));
  const wrap=el('div','plot'),cv=el('canvas');cv.width=cv.height=170;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+S+' '+S);svg.setAttribute('role','img');
  svg.setAttribute('aria-label',o.label||'Mappa di indifferenza con paniere trascinabile');
  wrap.append(cv,svg);root.append(wrap);
  let rs=null;
  if(o.prefs.includes('lin')){rs=slider('rapporto '+K('\\vv_1/\\vv_2'),0.25,4,0.05,st.r,v=>{st.r=v;draw()});root.append(rs)}
  if(o.tangent){root.append(slider('direzione (gradi)',0,355,5,st.th,v=>{st.th=v;draw()}))}
  const ot=out();root.append(ot);
  const ctx=cv.getContext('2d');
  const geq=(p,q)=>{const P=PREFS[st.pref];return P.geq?P.geq(p,q):P.u(p,st)>=P.u(q,st)-1e-9};
  const path=(pts)=>pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
  function draw(){
    const P=PREFS[st.pref];
    bs.forEach((b,i)=>press(b,o.prefs[i]===st.pref));
    if(rs)rs.hidden=st.pref!=='lin';
    let ref=st.a,refName='a';
    if(o.seg&&geq(st.a,st.b)){ref=st.b;refName='b'}
    ctx.clearRect(0,0,170,170);ctx.fillStyle='rgba(88,196,221,.3)';
    const N=85;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const p=[(i+.5)/N*D,(N-j-.5)/N*D];if(geq(p,ref))ctx.fillRect(i*2,j*2,2,2)}
    let s='<defs><clipPath id="'+id+'c"><rect x="'+x0+'" y="'+y0+'" width="'+L+'" height="'+L+'"/></clipPath>'+
      '<marker id="'+id+'g" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+GRN+'"/></marker>'+
      '<marker id="'+id+'r" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+RED+'"/></marker></defs>';
    s+='<g clip-path="url(#'+id+'c)">';
    P.bg.forEach(q=>{P.curve(q,st).forEach(c=>{s+='<path d="'+path(c)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2"/>'})});
    P.curve(ref,st).forEach(c=>{s+='<path d="'+path(c)+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>'});
    if(o.quad){s+='<rect x="'+X(st.a[0])+'" y="'+Y(D)+'" width="'+(X(D)-X(st.a[0]))+'" height="'+(Y(st.a[1])-Y(D))+'" fill="none" stroke="'+GRN+'" stroke-width="2.5" stroke-dasharray="7 6"/>'}
    let fails=false;
    if(o.seg){const M=60;for(let i=0;i<M;i++){const t0=i/M,t1=(i+1)/M,tm=(t0+t1)/2;
        const p0=[st.a[0]+(st.b[0]-st.a[0])*t0,st.a[1]+(st.b[1]-st.a[1])*t0],p1=[st.a[0]+(st.b[0]-st.a[0])*t1,st.a[1]+(st.b[1]-st.a[1])*t1],pm=[st.a[0]+(st.b[0]-st.a[0])*tm,st.a[1]+(st.b[1]-st.a[1])*tm];
        const good=geq(pm,ref);if(!good)fails=true;
        s+='<line x1="'+X(p0[0]).toFixed(1)+'" y1="'+Y(p0[1]).toFixed(1)+'" x2="'+X(p1[0]).toFixed(1)+'" y2="'+Y(p1[1]).toFixed(1)+'" stroke="'+(good?GRN:RED)+'" stroke-width="4.5" stroke-linecap="round"/>'}}
    let val=0;
    if(o.tangent){const z=st.a,n=Math.hypot(z[0],z[1]),tx=z[0]/n*30,ty=-z[1]/n*30;
      s+='<line x1="'+X(z[0]-tx)+'" y1="'+Y(z[1]-ty)+'" x2="'+X(z[0]+tx)+'" y2="'+Y(z[1]+ty)+'" stroke="#fff" stroke-width="1.8"/>';
      const th=st.th*Math.PI/180,dx=Math.cos(th),dy=Math.sin(th);val=z[1]*dx+z[0]*dy;st.delta=[dx,dy];st.val=val;
      const good=val>1e-9;
      s+='<line x1="'+X(z[0])+'" y1="'+Y(z[1])+'" x2="'+X(z[0]+dx*3.6)+'" y2="'+Y(z[1]+dy*3.6)+'" stroke="'+(good?GRN:RED)+'" stroke-width="3.5" marker-end="url(#'+id+(good?'g':'r')+')"/>'}
    s+='</g>';
    if(P.open){const q=P.open(ref);if(q)s+='<circle cx="'+X(q[0])+'" cy="'+Y(q[1])+'" r="4.5" fill="#000" stroke="'+BLUE+'" stroke-width="2"/>'}
    if(P.star)s+='<circle cx="'+X(ID[0])+'" cy="'+Y(ID[1])+'" r="4" fill="'+YEL+'"/><text x="'+(X(ID[0])+8)+'" y="'+(Y(ID[1])-7)+'" font-size="16" font-style="italic" style="fill:'+YEL+';font-family:var(--serif)">x*</text>';
    s+='<line x1="'+x0+'" y1="'+(y0+L)+'" x2="'+(x0+L)+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/>';
    [0,10,20].forEach(v=>{s+='<text class="g" x="'+X(v)+'" y="'+(y0+L+20)+'" font-size="13" text-anchor="middle">'+v+'</text>'+(v?'<text class="g" x="'+(x0-8)+'" y="'+(Y(v)+5)+'" font-size="13" text-anchor="end">'+v+'</text>':'')});
    s+='<text class="g" x="'+(x0+L/2)+'" y="'+(S-5)+'" font-size="14" text-anchor="middle">quantità del bene 1</text>'+
       '<text class="g" x="13" y="'+(y0+L/2)+'" font-size="14" text-anchor="middle" transform="rotate(-90 13 '+(y0+L/2)+')">quantità del bene 2</text>';
    const handle=(p,n)=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="9" fill="#fff" stroke="#000" stroke-width="2"/>'+
      '<text x="'+(X(p[0])+(p[0]>17?-14:14))+'" y="'+(Y(p[1])+(p[1]>18?24:-10))+'" font-size="19" font-style="italic" text-anchor="'+(p[0]>17?'end':'start')+'" style="font-family:var(--serif);paint-order:stroke;stroke:#000;stroke-width:4px">'+n+'</text>';
    if(st.b)s+=handle(st.b,'b');
    s+=handle(st.a,o.tangent?'z':'a');
    svg.innerHTML=s;
    ot.innerHTML=o.read(st,P,{fails,refName,geq});
  }
  let who='a';
  drag(wrap,(e,start)=>{const [px,py]=svgPoint(svg,e,S,S);
    const lo=o.tangent?1:0,p=[Math.min(D,Math.max(lo,(px-x0)/L*D)),Math.min(D,Math.max(lo,(y0+L-py)/L*D))].map(v=>Math.round(v*10)/10);
    if(start&&st.b){const da=Math.hypot(px-X(st.a[0]),py-Y(st.a[1])),db=Math.hypot(px-X(st.b[0]),py-Y(st.b[1]));who=da<=db?'a':'b'}
    st[who]=p;draw()});
  draw();
}
const SIX=['lin','only2','min1','comp','ideal','lex'];
const bt=p=>'('+tn(p[0])+';\\,'+tn(p[1])+')';
prefPlot($('#map1'),{prefs:SIX,a:[8,6],legend:[[GRAY,'curve di indifferenza'],[BLUE,'curva che passa per a'],['rgba(88,196,221,.45)','buoni almeno quanto a','box']],read:(st,P)=>P.desc+'<br>'+K(P.tex(st))+(P.u?' &nbsp; '+K('a='+bt(st.a)+',\\ \\uu(a)='+tn(P.u(st.a,st))):' &nbsp; '+K('a='+bt(st.a)))});
prefPlot($('#map2'),{prefs:SIX,a:[8,6],quad:true,legend:[[GRAY,'curve di indifferenza'],[BLUE,'curva che passa per a'],['rgba(88,196,221,.45)','buoni almeno quanto a','box'],[GRN,'più di entrambi i beni','dash']],label:'Mappa di indifferenza con il rettangolo dei panieri che hanno più di entrambi i beni',
  read:(st,P)=>'Monotona: <span class="'+(P.mono[0]?'ok">sì':'bad">no')+'</span> &nbsp;·&nbsp; fortemente monotona: <span class="'+(P.mono[1]?'ok">sì':'bad">no')+'</span><br>'+P.why});
prefPlot($('#map3'),{prefs:['prod','comp','lin','ideal','max'],a:[3,15],b:[16,4],seg:true,pick:'Scegli la preferenza',legend:[['rgba(88,196,221,.45)','buoni almeno quanto il peggiore dei due','box'],[GRN,'tratto che resta dentro'],[RED,'tratto che esce']],label:'Due panieri e il segmento che li unisce',
  read:(st,P,x)=>{const w=K(x.refName);
    if(x.fails)return '<span class="bad">Non convessa.</span> Un tratto del segmento è peggiore di '+w+', anche se l\'altro estremo è buono almeno quanto '+w+'.';
    if(st.pref==='max')return 'Qui il segmento resta dentro. Prova a mettere '+K('a')+' e '+K('b')+' ai lati opposti della diagonale: questa preferenza (dal Problema 2 del capitolo) non è convessa.';
    return '<span class="ok">Tutto il segmento è buono almeno quanto '+w+'.</span> Succede per ogni coppia di panieri: la preferenza è convessa.'}});
prefPlot($('#map4'),{prefs:['prod'],a:[7,9],tangent:true,legend:[[BLUE,'curva di indifferenza per z'],['#fff','retta delle valutazioni locali'],[GRN,'spostamento che migliora'],[RED,'spostamento che non migliora']],label:'Curva di indifferenza per z con la retta delle valutazioni locali',
  read:(st)=>{const z=st.a,d=st.delta;
    return K('z='+bt(z)+'\\qquad (\\vv_1,\\vv_2)=(z_2,z_1)='+bt([z[1],z[0]]))+'<br>'+
      K('\\vv_1\\delta_1+\\vv_2\\delta_2 = '+tn(st.val))+' &nbsp; '+(st.val>1e-9?'<span class="ok">Positivo:</span> un piccolo passo in questa direzione porta a un paniere preferito a '+K('z')+'.'
      :'<span class="bad">Non positivo:</span> nessun piccolo passo in questa direzione migliora.')}});

/* Continuità (panieri, lessicografiche) */
(function(){
  const root=$('#cont4');let e=.5;
  const svg=el('div');svg.style.cssText='width:100%;max-width:22rem';
  const sl=slider('raggio '+K('\\epsi'),0.05,0.6,0.05,e,v=>{e=v;draw()}),o=out();root.append(legend([[ORG,'panieri a distanza minore di ε','box'],[RED,'il paniere a','dot']]),svg,sl,o);
  const X=v=>50+v*110,Y=v=>300-v*110;
  function draw(){
    const ax=1-e/2;
    let s='<defs><clipPath id="c4c"><rect x="50" y="10" width="290" height="290"/></clipPath></defs>'+
      '<line x1="50" y1="300" x2="330" y2="300" stroke="#fff" stroke-width="1.5"/><line x1="50" y1="300" x2="50" y2="14" stroke="#fff" stroke-width="1.5"/>'+
      '<line x1="'+X(1)+'" y1="300" x2="'+X(1)+'" y2="14" stroke="'+GRAY+'" stroke-width="1.2" stroke-dasharray="4 6"/>'+
      '<g clip-path="url(#c4c)"><circle cx="'+X(1)+'" cy="'+Y(2)+'" r="'+e*110+'" fill="'+ORG+'" fill-opacity=".18" stroke="'+ORG+'" stroke-width="2"/>'+
      '<circle cx="'+X(1)+'" cy="'+Y(0)+'" r="'+e*110+'" fill="'+ORG+'" fill-opacity=".18" stroke="'+ORG+'" stroke-width="2"/></g>'+
      '<circle cx="'+X(1)+'" cy="'+Y(2)+'" r="6" fill="#fff"/><circle cx="'+X(1)+'" cy="'+Y(0)+'" r="6" fill="#fff"/>'+
      '<circle cx="'+X(ax)+'" cy="'+Y(2)+'" r="6" fill="'+RED+'"/>'+
      '<text x="'+(X(1)+12)+'" y="'+(Y(2)-10)+'" font-size="19" font-style="italic" style="font-family:var(--serif)">x</text>'+
      '<text x="'+(X(1)+12)+'" y="'+(Y(0)-12)+'" font-size="19" font-style="italic" style="font-family:var(--serif)">y</text>'+
      '<text x="'+(X(ax)-10)+'" y="'+(Y(2)-10)+'" font-size="19" font-style="italic" text-anchor="end" style="fill:'+RED+';font-family:var(--serif)">a</text>'+
      '<text class="g" x="'+X(1)+'" y="320" font-size="13" text-anchor="middle">1</text><text class="g" x="'+X(2)+'" y="320" font-size="13" text-anchor="middle">2</text>'+
      '<text class="g" x="40" y="'+(Y(2)+5)+'" font-size="13" text-anchor="end">2</text><text class="g" x="40" y="'+(Y(1)+5)+'" font-size="13" text-anchor="end">1</text>'+
      '<text class="g" x="200" y="341" font-size="14" text-anchor="middle">quantità del bene 1</text>'+
      '<text class="g" x="13" y="160" font-size="14" text-anchor="middle" transform="rotate(-90 13 160)">quantità del bene 2</text>';
    svg.innerHTML='<svg viewBox="0 0 350 346" role="img" aria-label="I panieri x e y con i loro intorni di raggio epsilon">'+s+'</svg>';
    o.innerHTML=K('a=('+tn(ax)+';\\,2)')+' dista '+K('\\epsi/2='+tn(e/2))+' da '+K('x')+', eppure '+K('y \\spf a')+': ha meno del bene 1.';
  }
  draw();
})();

/* Operazioni sui panieri: il segmento fra x e y */
(function(){
  const root=$('#bund'),S=400,x0=46,y0=14,L=340;
  const X=v=>x0+v/D*L,Y=v=>y0+L-v/D*L;
  const st={x:[4,15],y:[16,5],l:.25};
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+S+' '+S);svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Due panieri x e y e il paniere intermedio sul segmento che li unisce');svg.style.cssText='max-width:26rem;touch-action:none;cursor:grab';
  const o=out();
  root.append(legend([['#fff','panieri x e y','dot'],[TEAL,'paniere intermedio','dot']]),svg,slider('peso '+K('\\lam')+' su '+K('x'),0,1,0.05,st.l,v=>{st.l=v;draw()}),o);
  function draw(){
    const z=[st.l*st.x[0]+(1-st.l)*st.y[0],st.l*st.x[1]+(1-st.l)*st.y[1]];
    let s='<line x1="'+x0+'" y1="'+(y0+L)+'" x2="'+(x0+L)+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+(y0+L)+'" stroke="#fff" stroke-width="1.5"/>';
    [0,10,20].forEach(v=>{s+='<text class="g" x="'+X(v)+'" y="'+(y0+L+20)+'" font-size="13" text-anchor="middle">'+v+'</text>'+(v?'<text class="g" x="'+(x0-8)+'" y="'+(Y(v)+5)+'" font-size="13" text-anchor="end">'+v+'</text>':'')});
    s+='<text class="g" x="'+(x0+L/2)+'" y="'+(S-5)+'" font-size="14" text-anchor="middle">quantità del bene 1</text>'+
       '<text class="g" x="13" y="'+(y0+L/2)+'" font-size="14" text-anchor="middle" transform="rotate(-90 13 '+(y0+L/2)+')">quantità del bene 2</text>';
    s+='<line x1="'+X(st.x[0])+'" y1="'+Y(st.x[1])+'" x2="'+X(st.y[0])+'" y2="'+Y(st.y[1])+'" stroke="'+GRAY+'" stroke-width="2"/>';
    const h=(p,n)=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="9" fill="#fff" stroke="#000" stroke-width="2"/>'+
      '<text x="'+(X(p[0])+(p[0]>17?-14:14))+'" y="'+(Y(p[1])+(p[1]>18?24:-10))+'" font-size="19" font-style="italic" text-anchor="'+(p[0]>17?'end':'start')+'" style="font-family:var(--serif);paint-order:stroke;stroke:#000;stroke-width:4px">'+n+'</text>';
    s+=h(st.x,'x')+h(st.y,'y')+'<circle cx="'+X(z[0])+'" cy="'+Y(z[1])+'" r="7" fill="'+TEAL+'" stroke="#000" stroke-width="2"/>';
    svg.innerHTML=s;
    o.innerHTML=K('x='+bt(st.x)+'\\qquad y='+bt(st.y))+'<br>'+K(tn(st.l)+'\\,x+'+tn(1-st.l)+'\\,y='+bt(z));
  }
  let who='x';
  drag(svg,(e,start)=>{const [px,py]=svgPoint(svg,e,S,S);
    const p=[clamp((px-x0)/L*D,0,D),clamp((y0+L-py)/L*D,0,D)].map(v=>Math.round(v*2)/2);
    if(start){const da=Math.hypot(px-X(st.x[0]),py-Y(st.x[1])),db=Math.hypot(px-X(st.y[0]),py-Y(st.y[1]));who=da<=db?'x':'y'}
    st[who]=p;draw()});
  draw();
})();
};
QZ['6a']=()=>[
 {q:'Che cos\'altro ti senti di concludere sulle sue preferenze?',
  o:['Preferisce C a B','Preferisce A a C','Preferisce D ad A','Preferisce E a B'],a:0,
  e:'C sta a metà strada fra B e A: se andare fino ad A migliora, è naturale che migliori anche fermarsi in C.',h:'Pensa a un candidato che sta fra i due che la persona ha già confrontato.'}
];
QZ['6']=()=>[
 {q:'Quale dei sei esempi non è monotono?',
  o:['Complementari','Paniere ideale','Lessicografiche','Conta solo il bene 2'],a:1,
  e:'Oltre il paniere ideale, avere di più di entrambi i beni allontana dall\'ideale.',h:'Cerca la mappa in cui il rettangolo tratteggiato esce dall\'area azzurra.'},
 {q:'Le preferenze lessicografiche sui panieri sono…',
  o:['fortemente monotone e convesse, ma non continue','continue, ma non monotone','monotone e continue, ma non convesse','né monotone né convesse'],a:0,
  e:'Più di un bene migliora sempre e le vie di mezzo non peggiorano; ma un passo minuscolo a sinistra ribalta il confronto.',h:'Due delle quattro proprietà valgono, le altre due no.'},
 {q:'Che cosa chiede la convessità?',
  o:['Se '+K('a \\pf b')+', ogni paniere sul segmento fra '+K('a')+' e '+K('b')+' è buono almeno quanto '+K('b'),'Se '+K('a \\pf b')+', ogni paniere sul segmento è buono almeno quanto '+K('a'),
     'Le curve di indifferenza sono rette','La funzione di utilità è concava'],a:0,
  e:'Andare da '+K('b')+' verso qualcosa di almeno altrettanto buono non peggiora, nemmeno fermandosi a metà.',h:'Il confronto è con il peggiore dei due estremi.'},
 {q:'Per la preferenza rappresentata da '+K('\\uu = x_1x_2')+', una coppia di valutazioni locali in '+K('z')+' è…',
  o:[K('(z_1,\\,z_2)'),K('(z_2,\\,z_1)'),K('(1,\\,1)'),K('(1,\\,0)')],a:1,
  e:'Sono le derivate parziali di '+K('\\uu')+': rispetto a '+K('x_1')+' viene '+K('x_2')+', e viceversa.',h:'Calcola le due derivate parziali di '+K('x_1x_2')+'.'},
 {q:'Sempre con '+K('\\uu = x_1x_2')+', nel paniere '+K('z=(7,\\,9)')+' il consumatore fa un piccolo passo nella direzione '+K('(\\delta_1,\\delta_2)=(1,\\,-1)')+': un po\' più di bene 1, altrettanto meno di bene 2. Quanto vale '+K('\\vv_1(z)\\delta_1+\\vv_2(z)\\delta_2')+', e che cosa significa?',
  o:['2: il passo migliora','−2: il passo non migliora','0: resta indifferente','16: il passo migliora'],a:0,
  e:'Le valutazioni locali sono '+K('(9,\\,7)')+', quindi '+K('9\\cdot 1+7\\cdot(-1)=2 > 0')+': un passo abbastanza piccolo porta a un paniere preferito.',h:'Le valutazioni locali in '+K('z')+' sono '+K('(z_2,\\,z_1)')+': moltiplicale per le due componenti dello spostamento e somma.'},
 {q:'Quale proprietà di una funzione di utilità '+K('\\uu')+' equivale alla convessità della preferenza che rappresenta?',
  o:['Essere concava','Essere quasi-concava','Essere crescente in entrambi i beni','Essere continua'],a:1,
  e:'Una '+K('\\uu')+' concava basta, ma non è necessaria: '+K('(\\min\\{x_1,x_2\\})^2')+' non è concava e rappresenta una preferenza convessa. La condizione esatta è '+K('\\uu(\\lam a+(1-\\lam)b) \\ge \\min\\{\\uu(a),\\uu(b)\\}')+'.',
  h:'Una delle risposte è sufficiente ma non necessaria. Quale resiste a qualunque trasformazione crescente di '+K('\\uu')+'?'}
];


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


INIT[8]=function(){
/* Apertura e ritorno: cercare il paniere migliore sulla retta di bilancio */
function chase(root,withMrs){
  const P1=2,P2=1,W=20,pl=plane(20,[0,10,20],'Insieme di bilancio, curva di indifferenza e paniere z trascinabile sulla retta di bilancio');
  pl.svg.style.touchAction='none';pl.svg.style.cursor='grab';
  const st={x:withMrs?2:8},o=out();
  const lg=[[GRN,'panieri acquistabili','box'],[BLUE,'curva di indifferenza di z'],[TEAL,'acquistabili e migliori di z','box']];
  if(withMrs)lg.push(['#fff','retta con pendenza −MRS(z)']);
  root.append(legend(lg),pl.svg,o);
  function draw(){
    const z=[st.x,W-P1*st.x],u=z[0]*z[1],best=Math.abs(st.x-5)<1e-9;
    let s=pl.tri(P1,P2,W,GRN);
    if(!best){const d=Math.sqrt(400-8*u),a=(20-d)/4,b=(20+d)/4,pts=[[a,W-P1*a],[b,W-P1*b]];
      for(let i=0;i<=40;i++){const x=b+(a-b)*i/40;pts.push([x,u/x])}
      s+='<path d="'+pl.path(pts)+'Z" fill="'+TEAL+'" fill-opacity=".5"/>'}
    s+='<path d="'+pl.path(hyp(u,20))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>'+pl.bline(P1,P2,W,GRN);
    if(withMrs){const m=z[1]/z[0],n=Math.hypot(1,m),dx=6/n,dy=6*m/n;
      s+='<line x1="'+pl.X(z[0]-dx)+'" y1="'+pl.Y(z[1]+dy)+'" x2="'+pl.X(z[0]+dx)+'" y2="'+pl.Y(z[1]-dy)+'" stroke="#fff" stroke-width="2"/>'}
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(z,'#fff',9)+pl.lab(z,'z',14,-12);
    let h;
    if(!withMrs){
      h=K('z='+pt(z))+' costa '+K('2\\cdot'+tn(z[0])+'+1\\cdot'+tn(z[1])+'=20')+', e vale '+K('\\uu(z)='+tn(u))+'.<br>'+
        (best?'<span class="ok">Nessun paniere acquistabile è migliore di questo.</span> La curva tocca la retta senza attraversarla.'
             :'Puoi permetterti di meglio: spostati verso '+(st.x>5?'meno bene 1 e più bene 2':'più bene 1 e meno bene 2')+'.');
    }else{
      const m=z[1]/z[0];
      h=K('\\mrs(z)=z_2/z_1='+tn(m)+'\\qquad \\pu/\\pd=2')+'<br>'+
        (best?'<span class="ok">I due tassi coincidono:</span> nessuno scambio conviene. È la soluzione, '+K('(5;\\,10)')+'.'
         :m<2?'Per te un\'unità del bene 1 vale '+fmt(m)+' unità del bene 2, ma al mercato ne costa 2: conviene cedere bene 1.'
             :'Per te un\'unità del bene 1 vale '+fmt(m)+' unità del bene 2 e al mercato ne costa solo 2: conviene comprarne ancora.');
    }
    o.innerHTML=h;
  }
  drag(pl.svg,e=>{const [px,py]=svgPoint(pl.svg,e,S,S),vx=(px-x0)/L*20,vy=(y0+L-py)/L*20;
    st.x=r1(clamp((vx+40-2*vy)/5,0.5,9.5));draw()});
  draw();
}
chase($('#open5'),false);
chase($('#mrs5'),true);

/* Il problema del consumatore per tre preferenze */
(function(){
  const root=$('#opt5'),W=12,Rg=20,pl=plane(Rg,[0,10,20],'Soluzione del problema del consumatore per tre preferenze');
  const PF=[
    {t:'complementari: min{x₁, x₂}',bg:[3,6,9,12,15].map(m=>[[m,Rg],[m,m],[Rg,m]]),cur:x=>{const m=Math.min(x[0],x[1]);return [[m,Rg],[m,m],[Rg,m]]}},
    {t:'sostituti: x₁ + x₂',bg:[5,10,15,20,25,30].map(k=>[[0,k],[k,0]]),cur:x=>{const k=x[0]+x[1];return [[0,k],[k,0]]}},
    {t:'x₁ · x₂',bg:[4,16,49,100,169].map(k=>hyp(k,Rg)),cur:x=>hyp(x[0]*x[1],Rg)}];
  const st={f:0,p1:1,p2:2},o=out();
  const bs=PF.map((r,i)=>{const b=btn(r.t);b.onclick=()=>{st.f=i;draw()};return b});
  root.append(group('Scegli il consumatore',bs),legend([[GRN,'insieme di bilancio','box'],[GRAY,'curve di indifferenza'],[BLUE,'curva della soluzione'],[PINK,'soluzione','dot']]),pl.svg,
    slider('prezzo del bene 1',0.6,3,0.1,st.p1,v=>{st.p1=v;draw()}),slider('prezzo del bene 2',0.6,3,0.1,st.p2,v=>{st.p2=v;draw()}),o);
  function draw(){
    bs.forEach((b,i)=>press(b,i===st.f));
    const a=st.p1,b=st.p2,eq=Math.abs(a-b)<1e-9;let x,all=false,h;
    if(st.f===0){x=[W/(a+b),W/(a+b)];h=K('x^*='+pt(x))+': quantità uguali, '+K('\\wl/(\\pu+\\pd)=12/'+tn(a+b))+'.'}
    else if(st.f===1){if(eq){all=true;x=[W/(2*a),W/(2*b)];h='I due prezzi sono uguali: <span class="ok">ogni paniere della retta di bilancio è una soluzione.</span>'}
      else{x=a<b?[W/a,0]:[0,W/b];h=K('x^*='+pt(x))+': il bene '+(a<b?1:2)+' costa meno, e tutta la ricchezza va lì.'}}
    else{x=[W/(2*a),W/(2*b)];h=K('x^*='+pt(x))+': metà della ricchezza per ciascun bene, '+K('\\wl/(2\\pu)')+' e '+K('\\wl/(2\\pd)')+'.'}
    let s=pl.tri(a,b,W,GRN);
    PF[st.f].bg.forEach(c=>{s+='<path d="'+pl.path(c)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2"/>'});
    s+=pl.bline(a,b,W,GRN)+'<path d="'+pl.path(PF[st.f].cur(x))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"'+(all?' stroke-dasharray="2 7"':'')+'/>';
    if(all)s+=pl.bline(a,b,W,PINK,'stroke-linecap="round" stroke-width="6"').replace('stroke-width="3"','');
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+(all?'':pl.dot(x,PINK,8));
    o.innerHTML=h;
  }
  draw();
})();

/* Soluzione interna o d'angolo: u = x1 + radice di x2 */
(function(){
  const root=$('#corner5'),W=6,Rg=7,pl=plane(Rg,[0,2,4,6],'Soluzione del problema del consumatore con utilità x1 più radice di x2');
  const st={p1:2},o=out();
  root.append(legend([[GRN,'insieme di bilancio','box'],[GRAY,'curve di indifferenza'],[BLUE,'curva della soluzione'],[PINK,'soluzione','dot']]),pl.svg,
    slider('prezzo del bene 1',1,8,0.1,st.p1,v=>{st.p1=v;draw()}),o);
  function draw(){
    const p=st.p1,inner=2*Math.sqrt(W)>=p,x=inner?[W/p-p/4,p*p/4]:[0,W],m=2*Math.sqrt(x[1]);
    let s=pl.tri(p,1,W,GRN);
    [1.5,3,4.5,6,7.5].forEach(k=>{s+='<path d="'+pl.path(qcurve(k,Rg))+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2"/>'});
    s+=pl.bline(p,1,W,GRN)+'<path d="'+pl.path(qcurve(x[0]+Math.sqrt(x[1]),Rg))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>';
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(x,PINK,8);
    o.innerHTML=K('x^*='+pt(x)+'\\qquad \\mrs(x^*)=2\\sqrt{x_2^*}='+tn(m)+'\\qquad \\pu/\\pd='+tn(p))+'<br>'+
      (inner?'<span class="ok">Soluzione interna:</span> il saggio marginale di sostituzione è pari al rapporto fra i prezzi.'
            :'<span class="bad">Soluzione d\'angolo:</span> tutta la ricchezza nel bene 2, e '+K('\\mrs(x^*) \\lt \\pu/\\pd')+'. Venderebbe altro bene 1, ma non ne ha.');
  }
  draw();
})();

/* UMP ed EMP: lo stesso punto visto da due problemi */
(function(){
  const root=$('#dual8'),duo=el('div','duo'),Rg=5.4;
  const hp=k=>{const a=[];for(let i=0;i<=60;i++){const x=k/Rg+(Rg-k/Rg)*Math.pow(i/60,2);a.push([x,k/x])}return a};
  root.append(legend([[GRN,'ciò che è fissato'],[GRAY,'ciò che si fa variare'],[BLUE,'il livello ottimo'],[PINK,'soluzione','dot']]),duo);
  (function(){const m=mini(Rg,280);
    let s=m.tri(2,1,4,GRN,.25);[1,3.4].forEach(k=>{s+=m.path(hp(k),GRAY,1.5)});
    s+=m.path(hp(2),BLUE,3)+m.bl(2,1,4,GRN,3)+m.dot([1,2],PINK,7);
    s+=m.lab([3.4,1.5],'u = 2',0,0,BLUE,13)+m.lab([1,2],'(1, 2)',10,-6,PINK,14);
    cell(duo,'Massimo dell\'utilità',m.axes()+s,m.S,m.H,'Insieme di bilancio con ricchezza 4 e tre curve di indifferenza: la più alta che lo tocca passa per (1, 2)',
      'Ricchezza fissa a 4: la curva più alta che tocca il triangolo è '+K('\\uu=2')+'.')})();
  (function(){const m=mini(Rg,280);
    const up=hp(2);let d='M'+up.map(p=>m.X(p[0]).toFixed(1)+' '+m.Y(p[1]).toFixed(1)).join('L')+'L'+m.X(Rg).toFixed(1)+' '+m.Y(Rg).toFixed(1)+'Z';
    let s='<path d="'+d+'" fill="'+GRN+'" fill-opacity=".22"/>';
    s+=m.bl(2,1,3,GRAY,1.5)+m.bl(2,1,5,GRAY,1.5)+m.bl(2,1,4,BLUE,3)+m.path(up,GRN,3)+m.dot([1,2],PINK,7);
    s+=m.lab([1.5,0],'3',-4,-8,GRAY,13,'end')+m.lab([2,0],'4',2,-8,BLUE,13)+m.lab([2.5,0],'5',6,-8,GRAY,13);
    s+=m.lab([3.2,3.6],'utilità ≥ 2',0,0,GRN,13,'middle')+m.lab([1,2],'(1, 2)',10,-6,PINK,14)+tx(m.X(2),m.Y(0)+0,'',{});
    cell(duo,'Minimo della spesa',m.axes()+s,m.S,m.H,'Regione con utilità almeno 2 e tre rette di spesa 3, 4 e 5: la più bassa che la tocca passa per (1, 2)',
      'Utilità fissa a 2: la retta di spesa più bassa che tocca la regione è quella da 4.')})();
})();
/* Compensazione di Hicks */
(function(){
  const root=$('#hicks8'),pl=plane(26,[0,12,24],'Compensazione di Hicks dopo un aumento del prezzo del bene 2');
  const A=[6,6],B=[12,3],C=[6,1.5];
  let s=pl.tri(1,4,24,GRN,.2)+pl.bline(1,1,12,GRAY,'stroke-dasharray="6 6"').replace('stroke-width="3"','stroke-width="2"')+
    pl.bline(1,4,12,GRN).replace('stroke-width="3"','stroke-width="1.6"')+pl.bline(1,4,24,GRN)+
    '<path d="'+pl.path(hyp(36,26))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>';
  const T=(p,t,dx,dy,c,a)=>'<text x="'+(pl.X(p[0])+dx)+'" y="'+(pl.Y(p[1])+dy)+'" font-size="14" text-anchor="'+(a||'start')+'" style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+c+'">'+t+'</text>';
  pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(A,'#fff',8)+pl.dot(B,PINK,8)+pl.dot(C,PUR,7)+
    T(A,'(6, 6)',12,-10,'#fff')+T(B,'(12, 3)',6,-14,PINK)+T([2.6,13.8],'utilità 36',8,0,BLUE);
  root.append(legend([[GRAY,'retta di partenza, prezzi (1, 1)','dash'],[GRN,'nuovi prezzi (1, 4): sottile con ricchezza 12, spessa con 24'],[BLUE,'curva di indifferenza di partenza'],['#fff','scelta di partenza','dot'],[PINK,'domanda compensata','dot'],[PUR,'domanda senza compensazione','dot']]),pl.svg);
})();
};
QZ['8a']=()=>[
 {q:'Un consumatore con '+K('\\uu=\\min\\{x_1,x_2\\}')+' ha ricchezza 18 e affronta i prezzi '+K('(2,\\,1)')+'. Quale paniere compra?',
  o:[K('(9;\\,0)'),K('(4{,}5;\\,9)'),K('(6;\\,6)'),K('(0;\\,18)')],a:2,
  e:'Quantità uguali, spendendo tutto: '+K('\\wl/(\\pu+\\pd)=18/3=6')+' di ciascun bene.',h:'La soluzione ha la stessa quantità dei due beni e sta sulla retta di bilancio.'}
];
QZ['8b']=()=>[
 {q:'Un consumatore con '+K('\\uu=x_1x_2')+' ha ricchezza 12 e affronta i prezzi '+K('(2,\\,1)')+'. Quale paniere compra?',
  o:[K('(6;\\,6)'),K('(4;\\,4)'),K('(6;\\,0)'),K('(3;\\,6)')],a:3,
  e:'Spende 6 per ciascun bene: '+K('6/2=3')+' e '+K('6/1=6')+'. Infatti '+K('\\mrs=x_2/x_1=6/3=2=\\pu/\\pd')+'.',h:'Con questa utilità la ricchezza si divide a metà fra i due beni: quante unità compra con ciascuna metà?'}
];
QZ['8c']=()=>[
 {q:'In un paniere '+K('z')+' sulla retta di bilancio vale '+K('\\mrs(z)=3')+', mentre '+K('\\pu/\\pd=2')+'. Che cosa conviene fare?',
  o:['Niente: '+K('z')+' è già la soluzione','Cedere bene 1 e comprare più bene 2','Comprare più bene 1 cedendo bene 2','Spendere meno di tutta la ricchezza'],a:2,
  e:'Per il consumatore un\'unità del bene 1 vale 3 unità del bene 2, ma al mercato ne costa solo 2: ogni unità in più del bene 1 è un affare.',
  h:'Confronta quanto vale per te un\'unità del bene 1 con quanto costa, tutto misurato in unità del bene 2.'}
];
QZ['8d']=()=>[
 {q:'Stessi prezzi '+K('(2,\\,1)')+' e stessa utilità '+K('\\uu=x_1x_2')+', ma ora l\'utilità richiesta è 8. Qual è la spesa minima?',
  o:['4','6','8','16'],a:2,
  e:'Nel punto ottimo '+K('\\mrs=x_2/x_1=2')+', quindi '+K('x_2=2x_1')+'; con '+K('x_1x_2=8')+' si ottiene '+K('(2;\\,4)')+', che costa '+K('2\\cdot 2+4=8')+'.',
  h:'Anche qui la curva tocca la retta dove '+K('\\mrs=\\pu/\\pd')+'. Trova il punto della curva '+K('x_1x_2=8')+' con '+K('x_2/x_1=2')+'.'}
];
QZ['8']=()=>[
 {q:'La preferenza è monotona, convessa e differenziabile, e nella soluzione '+K('x^*')+' il consumatore non compra il bene 1: '+K('x^*_1=0')+'. Che cosa si può dire di sicuro?',
  o:[K('\\mrs(x^*) = \\pu/\\pd'),K('\\mrs(x^*) \\le \\pu/\\pd'),K('\\mrs(x^*) \\ge \\pu/\\pd'),'Niente: nell\'angolo il saggio marginale di sostituzione non è definito'],a:1,
  e:'Il bene 1 vale per lui al più quanto costa. Non può venderne altro, quindi l\'uguaglianza non è garantita.',h:'Pensa all\'esempio con '+K('\\uu=x_1+\\sqrt{x_2}')+' quando il bene 1 è molto caro.'},
 {q:'Un consumatore con '+K('\\uu=x_1^{1/2}x_2^{1/2}')+' ha ricchezza 12 e affronta i prezzi '+K('(1,\\,4)')+'. Quanto vale l\'utilità indiretta '+K('\\vv(\\pp,\\wl)')+'?',
  o:['3','6','9','12'],a:0,
  e:'Spende 6 per bene: compra '+K('(6;\\,1{,}5)')+', e '+K('\\sqrt{6\\cdot 1{,}5}=\\sqrt{9}=3')+'. Con la formula: '+K('\\tfrac12\\cdot 12/(1^{1/2}\\cdot 4^{1/2})=3')+'.',
  h:'Trova prima il paniere domandato (metà della ricchezza per bene), poi calcola la sua utilità.'},
 {q:'Tutti i prezzi raddoppiano e l\'utilità richiesta '+K('\\ub')+' resta la stessa. Che cosa succede alla domanda compensata e alla funzione di spesa?',
  o:[K('\\hh')+' raddoppia, '+K('\\ee')+' resta uguale',K('\\hh')+' resta uguale, '+K('\\ee')+' raddoppia','Raddoppiano entrambe','Restano uguali entrambe'],a:1,
  e:'Il paniere meno caro è lo stesso, ma costa il doppio: '+K('\\hh')+' è omogenea di grado zero nei prezzi, '+K('\\ee')+' di grado uno.',
  h:'Se tutti i prezzi raddoppiano, cambia quale paniere è il meno caro? E quanto costa?'},
 {q:'A che cosa è uguale '+K('\\hh(\\pp,\\,\\vv(\\pp,\\wl))')+'?',
  o:[K('\\ee(\\pp,\\wl)'),K('\\dx(\\pp,\\wl)'),K('\\wl'),K('\\vv(\\pp,\\wl)')],a:1,
  e:'Chiedere il modo meno caro di raggiungere proprio l\'utilità massima ottenibile con '+K('\\wl')+' riporta al paniere che la massimizza.',
  h:'È una delle due identità che legano domanda walrasiana e domanda hicksiana.'},
 {q:'Si sostituisce l\'utilità '+K('\\uu')+' con '+K('\\uu^3')+', che rappresenta la stessa preferenza. Che cosa cambia?',
  o:['La domanda walrasiana','L\'utilità indiretta','Entrambe','Nessuna delle due'],a:1,
  e:'Il paniere migliore è lo stesso, quindi '+K('\\dx(\\pp,\\wl)')+' non cambia. Il valore del massimo sì: diventa '+K('\\vv^3')+'.',
  h:'Quale dei due oggetti è un paniere, e quale è un numero di utilità?'}
];


INIT[9]=function(){
/* preferenze del gioco: per ogni individuo le caverne dalla preferita all'ultima */
const P={1:['B','C','D','A'],2:['B','D','A','C'],3:['A','B','C','D'],4:['B','C','A','D']};
const IND=[1,2,3,4];
const holder=(al,h)=>IND.find(i=>al[i-1]===h);
const rank=(i,h)=>P[i].indexOf(h);

/* tabella delle preferenze con un'allocazione evidenziata.
   mode 'envy': per ogni caverna preferita alla propria dice di chi è (più debole = rosso, più forte = grigio)
   mode 'plain': solo l'allocazione */
function prefTable(al,mode){
  const cw=64,ch=48,x0=62,y0=64,W=x0+4*cw+10,H=y0+4*ch+8;
  let s='<defs>'+arrowDef('pwA',ORG)+'</defs>';
  s+=tx(x0+2,16,'più forte',{a:'start',f:ORG,s:13})+tx(x0+4*cw-6,16,'più debole',{a:'end',f:ORG,s:13});
  s+='<line x1="'+(x0+68)+'" y1="12" x2="'+(x0+4*cw-82)+'" y2="12" stroke="'+ORG+'" stroke-width="2" marker-end="url(#pwA)"/>';
  IND.forEach((i,c)=>{const cx=x0+c*cw+cw/2-3;
    s+='<circle cx="'+cx+'" cy="42" r="14" fill="none" stroke="#fff" stroke-width="1.5"/>'+tx(cx,47,i,{s:16})});
  ['1ª','2ª','3ª','4ª'].forEach((t,r)=>{s+=tx(x0-12,y0+r*ch+ch/2+3,t,{a:'end',f:GRAY,s:13})});
  s+=tx(14,y0+2*ch,'scelta',{f:GRAY,s:13,x:' transform="rotate(-90 14 '+(y0+2*ch)+')"'});
  IND.forEach((i,c)=>{const mine=rank(i,al[i-1]);
    P[i].forEach((h,r)=>{const x=x0+c*cw,y=y0+r*ch,cx=x+cw/2-3;
      let fill='none',stroke='none',col='#6b6b6b',tag='',tcol=GRAY;
      if(r===mine){fill=PINK;col='#000'}
      else if(r<mine&&mode==='envy'){const k=holder(al,h);
        if(k>i){fill=RED;col='#000';tcol='#000';tag='è di '+k}else{stroke='#777';col='#e6e6e6';tag='è di '+k}}
      else if(r<mine){col='#e6e6e6'}
      s+='<rect x="'+(x+1)+'" y="'+(y+2)+'" width="'+(cw-8)+'" height="'+(ch-6)+'" rx="4" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.3"/>';
      s+=tx(cx,y+(tag?21:ch/2+5),h,{s:18,f:col,serif:1,i:1});
      if(tag)s+=tx(cx,y+38,tag,{s:13,f:tcol});
    })});
  return {s,W,H};
}
const ENVY_LEG=[[PINK,'la caverna che occupa','box'],[RED,'la preferisce, ed è di uno più debole: può prenderla','box'],['#777','la preferisce, ma è di uno più forte','dash']];
const alName=al=>'('+al.join(',\\,')+')';

/* Apertura: l'allocazione di partenza del gioco */
(function(){
  const root=$('#jun0'),t=prefTable(['D','A','C','B'],'envy');
  root.append(legend(ENVY_LEG));svgBox(root,t.W,t.H,t.s,'Tabella delle preferenze dei quattro giocatori con l\'allocazione di partenza D, A, C, B','21rem');
})();

/* Due partite del gioco, passo per passo */
(function(){
  const root=$('#junPlay');
  const games=[
    {t:'Partenza (D, A, C, B)',rows:[
      {who:null,c:{A:2,B:4,C:3,D:1},out:[]},
      {who:1,to:'B',c:{A:2,B:1,C:3,D:0},out:[4]},
      {who:2,to:'D',c:{A:0,B:1,C:3,D:2},out:[4]},
      {who:3,to:'A',c:{A:3,B:1,C:0,D:2},out:[4]},
      {who:4,to:'C',c:{A:3,B:1,C:4,D:2},out:[]}]},
    {t:'Partenza (A, B, D, C)',rows:[
      {who:null,c:{A:1,B:2,C:4,D:3},out:[]},
      {who:3,to:'C',c:{A:1,B:2,C:3,D:0},out:[4]},
      {who:4,to:'D',c:{A:1,B:2,C:3,D:4},out:[]},
      {who:1,to:'B',c:{A:0,B:1,C:3,D:4},out:[2]},
      {who:2,to:'D',c:{A:0,B:1,C:3,D:2},out:[4]},
      {who:3,to:'A',c:{A:3,B:1,C:0,D:2},out:[4]},
      {who:4,to:'C',c:{A:3,B:1,C:4,D:2},out:[]}]}];
  root.append(legend([[PINK,'chi si è appena mosso','box'],[RED,'rimasto senza caverna','box'],['#555','caverna vuota','dash']]));
  const duo=el('div','duo');root.append(duo);
  games.forEach(g=>{
    const d=el('div');d.append(el('h4','',g.t));duo.append(d);
    const lw=78,cw=44,rh=38,y0=34,W=lw+4*cw+62,H=y0+g.rows.length*rh+6;
    let s='';['A','B','C','D'].forEach((h,c)=>{s+=tx(lw+c*cw+cw/2,22,h,{s:17,serif:1,i:1})});
    s+=tx(lw+4*cw+33,22,'fuori',{s:13,f:GRAY});
    g.rows.forEach((r,k)=>{const y=y0+k*rh,last=k===g.rows.length-1;
      s+=tx(lw-10,y+rh/2+5,r.who?'tocca a '+r.who:'inizio',{a:'end',s:13,f:r.who?'#fff':GRAY});
      ['A','B','C','D'].forEach((h,c)=>{const v=r.c[h],x=lw+c*cw,mv=r.who&&r.to===h;
        s+='<rect x="'+(x+3)+'" y="'+(y+3)+'" width="'+(cw-6)+'" height="'+(rh-6)+'" rx="4" fill="'+(mv?PINK:'none')+'" stroke="'+(mv?PINK:(v?(last?'#fff':'#777'):'#555'))+'" stroke-width="'+(last&&v?1.8:1.2)+'"'+(v?'':' stroke-dasharray="3 4"')+'/>';
        if(v)s+=tx(x+cw/2,y+rh/2+5,v,{s:16,f:mv?'#000':'#fff'})});
      r.out.forEach((o,q)=>{const x=lw+4*cw+16+q*30;
        s+='<rect x="'+x+'" y="'+(y+5)+'" width="30" height="'+(rh-10)+'" rx="4" fill="'+RED+'"/>'+tx(x+15,y+rh/2+5,o,{s:16,f:'#000'})});
    });
    svgBox(d,W,H,s,'Sequenza di mosse del gioco della giungla: '+g.t,'21rem');
  });
  const o=out();o.innerHTML='Le due partite partono da allocazioni diverse e fanno un numero diverso di mosse, ma finiscono nello stesso punto: '+K('(B,\\,D,\\,A,\\,C)')+'.';root.append(o);
})();

/* Assegnazione e allocazione */
(function(){
  const root=$('#junAssign'),duo=el('div','duo');root.append(legend([['#fff','individui','dot'],[GRN,'case','box'],[RED,'casa assegnata due volte','box']]),duo);
  [{t:'Un\'assegnazione che non è un\'allocazione',m:['A','B','B','D']},{t:'Un\'allocazione',m:['D','A','C','B']}].forEach(g=>{
    const d=el('div');d.append(el('h4','',g.t));duo.append(d);
    const Y=k=>34+k*50,xl=70,xr=230;let s='';
    const cnt={};g.m.forEach(h=>cnt[h]=(cnt[h]||0)+1);
    g.m.forEach((h,i)=>{const k='ABCD'.indexOf(h);s+='<line x1="'+(xl+16)+'" y1="'+Y(i)+'" x2="'+(xr-18)+'" y2="'+Y(k)+'" stroke="'+(cnt[h]>1?RED:'#fff')+'" stroke-width="2"/>'});
    IND.forEach((i,k)=>{s+='<circle cx="'+xl+'" cy="'+Y(k)+'" r="15" fill="#000" stroke="#fff" stroke-width="1.5"/>'+tx(xl,Y(k)+5,i,{s:16})});
    'ABCD'.split('').forEach((h,k)=>{const c=cnt[h]>1?RED:GRN;
      s+='<rect x="'+(xr-16)+'" y="'+(Y(k)-16)+'" width="32" height="32" rx="4" fill="'+(cnt[h]?c:'none')+'" stroke="'+c+'" stroke-width="1.6"'+(cnt[h]?'':' stroke-dasharray="3 4"')+'/>'+tx(xr,Y(k)+6,h,{s:17,serif:1,i:1,f:cnt[h]?'#000':GRN})});
    svgBox(d,300,222,s,g.t,'18rem');
  });
})();

/* Equilibrio: l'allocazione di partenza e quella finale a confronto */
(function(){
  const root=$('#junEq'),duo=el('div','duo');root.append(legend(ENVY_LEG),duo);
  [['D','A','C','B'],['B','D','A','C']].forEach((al,k)=>{
    const d=el('div');d.append(el('h4','',K(alName(al))+(k?': un equilibrio':': non è un equilibrio')));duo.append(d);
    const t=prefTable(al,'envy');svgBox(d,t.W,t.H,t.s,'Tabella delle preferenze con l\'allocazione '+al.join(', '),'21rem');
  });
})();

/* Dittatura seriale */
(function(){
  const root=$('#junSerial');
  const cw=128,ch=44,x0=30,y0=70,W=x0+4*cw,H=y0+4*ch+50;
  let s='<defs>'+arrowDef('sdA','#fff')+'</defs>',taken=[];
  IND.forEach((i,c)=>{const x=x0+c*cw,cx=x+44;
    s+=tx(cx,20,(c+1)+'° a scegliere',{s:13,f:GRAY});
    s+='<circle cx="'+cx+'" cy="46" r="14" fill="none" stroke="#fff" stroke-width="1.5"/>'+tx(cx,51,i,{s:16});
    const pick=P[i].find(h=>!taken.includes(h));
    P[i].forEach((h,r)=>{const y=y0+r*ch,gone=taken.includes(h),me=h===pick;
      s+='<rect x="'+(cx-26)+'" y="'+(y+3)+'" width="52" height="'+(ch-8)+'" rx="4" fill="'+(me?PINK:'none')+'" stroke="'+(me?PINK:'none')+'"/>';
      s+=tx(cx,y+ch/2+5,h,{s:18,serif:1,i:1,f:me?'#000':gone?'#777':'#cfcfcf'});
      if(gone)s+='<line x1="'+(cx-17)+'" y1="'+(y+ch/2-1)+'" x2="'+(cx+17)+'" y2="'+(y+ch/2-1)+'" stroke="'+RED+'" stroke-width="2.5"/>'});
    s+=tx(cx,y0+4*ch+26,'prende '+pick,{s:14,f:PINK});
    if(c<3)s+='<line x1="'+(cx+38)+'" y1="46" x2="'+(cx+cw-42)+'" y2="46" stroke="#fff" stroke-width="1.8" marker-end="url(#sdA)"/>';
    taken.push(pick);
  });
  root.append(legend([[PINK,'la casa che prende','box'],[RED,'già presa da chi ha scelto prima']]));
  svgBox(root,W,H,s,'Dittatura seriale: gli individui scelgono in ordine di forza la casa migliore fra quelle rimaste','36rem');
})();

/* Schema della dimostrazione di unicità */
(function(){
  const root=$('#junUniq');
  const X=[70,120,194,268,342,416,490,564],lab=['1','2','…','i*−1','i*','j','k','n'],cw=58;
  let s=tx(22,30,'i',{i:1,s:16})+tx(22,74,'a(i)',{i:1,s:16,f:PINK})+tx(22,118,'b(i)',{i:1,s:16,f:PUR});
  X.forEach((x,c)=>{s+=tx(x,30,lab[c],{s:15,i:1});
    [[62,'a'],[106,'b']].forEach(([y,row])=>{
      let f='#3a3a3a';
      if(c===4)f=row==='a'?ORG:BLUE;
      if(c===5&&row==='b')f=ORG;
      if(c===6&&row==='a')f=BLUE;
      if(c===2){s+=tx(x,y+6,'…',{s:15,f:GRAY});return}
      s+='<rect x="'+(x-cw/2+4)+'" y="'+(y-16)+'" width="'+(cw-8)+'" height="30" rx="4" fill="'+f+'"/>';
      if(c<4)s+=tx(x,y+5,'=',{s:14,f:GRAY});
    })});
  s+=tx(157,150,'qui a e b coincidono',{s:13,f:GRAY})+tx(453,150,'tutti più deboli di i*',{s:13,f:GRAY});
  root.append(legend([[ORG,'la casa a(i*)','box'],[BLUE,'la casa b(i*)','box'],['#3a3a3a','altre case','box']]));
  svgBox(root,600,162,s,'Le due allocazioni a e b coincidono fino a i* meno 1; la casa a di i* tocca in b a un individuo j più debole, e la casa b di i* tocca in a a un individuo k più debole','36rem');
})();

/* Clan, primo round: i sei scambi a due */
(function(){
  const root=$('#clanSwap'),al=['D','A','C','B'];
  const pairs=[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]],rh=40,W=560,H=34+pairs.length*rh+6;
  let s=tx(60,20,'scambio',{s:13,f:GRAY})+tx(220,20,'il primo',{s:13,f:GRAY})+tx(420,20,'il secondo',{s:13,f:GRAY});
  pairs.forEach(([i,j],k)=>{const y=34+k*rh;
    s+='<line x1="10" y1="'+y+'" x2="'+(W-10)+'" y2="'+y+'" stroke="#333"/>';
    s+=tx(60,y+rh/2+5,i+' ↔ '+j,{s:16});
    [[i,j,220],[j,i,420]].forEach(([me,ot,x])=>{const from=al[me-1],to=al[ot-1],good=rank(me,to)<rank(me,from),c=good?GRN:RED;
      s+=tx(x-12,y+rh/2+5,me+':  '+from+' → '+to,{s:16,f:c});
      s+=tx(x+62,y+rh/2+5,good?'ci guadagna':'ci perde',{s:13,f:c,a:'start'})});
  });
  root.append(legend([[GRN,'riceve una caverna che preferisce','box'],[RED,'riceve una caverna peggiore','box']]));
  svgBox(root,W,H,s,'I sei scambi possibili fra due giocatori a partire da D, A, C, B: in ognuno uno dei due ci perde','34rem');
})();

/* Clan, secondo round: la rotazione a tre */
(function(){
  const root=$('#clanCycle'),N={1:[320,78],3:[492,300],2:[148,300]},r=34;
  const cut=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);return [p[0]+dx/d*(r+8),p[1]+dy/d*(r+8),q[0]-dx/d*(r+16),q[1]-dy/d*(r+16)].map(v=>v.toFixed(1))};
  const arr=(a,b)=>{const c=cut(N[a],N[b]);return '<line x1="'+c[0]+'" y1="'+c[1]+'" x2="'+c[2]+'" y2="'+c[3]+'" stroke="'+GRN+'" stroke-width="3.5" marker-end="url(#ccA)"/>'};
  let s='<defs>'+arrowDef('ccA',GRN)+'</defs>'+arr(1,3)+arr(3,2)+arr(2,1);
  const house={1:'D',2:'A',3:'C'};
  [1,2,3].forEach(i=>{s+='<circle cx="'+N[i][0]+'" cy="'+N[i][1]+'" r="'+r+'" fill="#000" stroke="#fff" stroke-width="2"/>'+tx(N[i][0],N[i][1]-2,i,{s:22})+tx(N[i][0],N[i][1]+19,'in '+house[i],{s:13,f:GRAY})});
  s+=tx(444,166,'1 passa in C',{s:16,a:'start',f:GRN})+tx(444,188,'la preferisce a D',{s:13,a:'start',f:GRAY});
  s+=tx(320,362,'3 passa in A',{s:16,f:GRN})+tx(320,384,'la preferisce a C',{s:13,f:GRAY});
  s+=tx(196,166,'2 passa in D',{s:16,a:'end',f:GRN})+tx(196,188,'la preferisce ad A',{s:13,a:'end',f:GRAY});
  s+='<circle cx="578" cy="46" r="26" fill="#000" stroke="'+GRAY+'" stroke-width="2"/>'+tx(578,44,4,{s:20,f:'#c9c9c9'})+tx(578,60,'in B',{s:13,f:GRAY})+tx(578,92,'resta dov\'è',{s:13,f:GRAY});
  s+=tx(320,220,'tre ci guadagnano',{s:15,f:GRN})+tx(320,244,'nessuno ci perde',{s:15,f:'#fff'});
  root.append(legend([[GRN,'va nella caverna di…']]));
  svgBox(root,640,400,s,'Rotazione a tre: 1 passa nella caverna C di 3, 3 nella caverna A di 2, 2 nella caverna D di 1; 4 resta in B','34rem');
})();

/* Da un'allocazione a un'altra: chi sale e chi scende nella propria classifica */
function rankChart(root,alA,alB,nA,nB){
  const X=i=>120+(i-1)*118,Y=r=>50+r*66,W=560,H=346;
  let s='<defs>'+arrowDef('rkG',GRN)+arrowDef('rkR',RED)+'</defs>';
  ['1ª scelta','2ª scelta','3ª scelta','4ª scelta'].forEach((t,r)=>{s+='<line x1="70" y1="'+Y(r)+'" x2="'+(W-14)+'" y2="'+Y(r)+'" stroke="#2a2a2a"/>'+tx(62,Y(r)+5,t,{a:'end',s:13,f:GRAY})});
  IND.forEach(i=>{const a=alA[i-1],b=alB[i-1],ra=rank(i,a),rb=rank(i,b),x=X(i);
    s+=tx(x,H-30,i,{s:17})+tx(x,H-10,ra===rb?'resta in '+a:(rb<ra?'sta meglio':'sta peggio'),{s:13,f:ra===rb?GRAY:rb<ra?GRN:RED});
    if(ra===rb){s+='<circle cx="'+x+'" cy="'+Y(ra)+'" r="17" fill="'+PUR+'" stroke="#fff" stroke-width="2.5"/>'+tx(x,Y(ra)+6,a,{s:17,serif:1,i:1,f:'#000'});return}
    const up=rb<ra,c=up?GRN:RED,d=up?-1:1;
    s+='<line x1="'+x+'" y1="'+(Y(ra)+d*19)+'" x2="'+x+'" y2="'+(Y(rb)-d*26)+'" stroke="'+c+'" stroke-width="3.5" marker-end="url(#'+(up?'rkG':'rkR')+')"/>';
    s+='<circle cx="'+x+'" cy="'+Y(ra)+'" r="17" fill="#000" stroke="#fff" stroke-width="2"/>'+tx(x,Y(ra)+6,a,{s:17,serif:1,i:1});
    s+='<circle cx="'+x+'" cy="'+Y(rb)+'" r="17" fill="'+PUR+'"/>'+tx(x,Y(rb)+6,b,{s:17,serif:1,i:1,f:'#000'});
  });
  s+=tx(W/2+28,H-52,'individuo',{s:13,f:GRAY});
  root.append(legend([['#fff',nA,'dash'],[PUR,nB,'dot'],[GRN,'sta meglio'],[RED,'sta peggio']]));
  svgBox(root,W,H,s,'Posizione, nella classifica di ciascun individuo, della casa ricevuta in '+nA+' e in '+nB,'34rem');
}
rankChart($('#parDom'),['D','A','C','B'],['C','D','A','B'],'a = (D, A, C, B)','b = (C, D, A, B)');
rankChart($('#parCmp'),['B','D','A','C'],['C','D','A','B'],'esito della giungla (B, D, A, C)','esito del clan (C, D, A, B)');

/* L'esito del clan visto con gli occhi della giungla */
(function(){
  const root=$('#clanEnvy'),t=prefTable(['C','D','A','B'],'envy');
  root.append(legend(ENVY_LEG));svgBox(root,t.W,t.H,t.s,'Tabella delle preferenze con l\'esito del clan C, D, A, B: gli individui 1 e 2 preferiscono B, che è del più debole 4','21rem');
})();
};
QZ['9a']=()=>[
 {q:'Si parte da '+K('(D,\\,A,\\,C,\\,B)')+'. Quali giocatori possono prendersi subito una caverna che preferiscono alla propria?',
  o:['Solo il giocatore 1','I giocatori 1, 2 e 3','Tutti e quattro','Nessuno: ognuno ha già una caverna'],a:1,
  e:'Tutti e tre preferiscono B, che è del più debole 4; in più 1 preferisce anche C, che è di 3. Il giocatore 4 ha già la sua preferita, e comunque non ha nessuno sotto di sé.',
  h:'Guarda le caselle rosse nella tabella: in quali colonne compaiono?'}
];
QZ['9b']=()=>[
 {q:'In '+K('(B,\\,D,\\,A,\\,C)')+' l\'individuo 2 occupa D, ma preferirebbe B. Perché l\'allocazione è comunque un equilibrio?',
  o:['Perché 2 è indifferente fra B e D','Perché B è occupata da 1, che è più forte di 2','Perché 2 ha già cambiato caverna una volta','Perché in un equilibrio ognuno ha la sua caverna preferita'],a:1,
  e:'L\'equilibrio vieta solo di preferire la casa di qualcuno più debole. Desiderare la casa di uno più forte non destabilizza niente: non la si può prendere.',
  h:'Rileggi la definizione: di chi deve essere la casa che l\'individuo preferisce, perché l\'equilibrio salti?'}
];
QZ['9c']=()=>[
 {q:'Terzo round: si riparte dall\'esito della giungla, '+K('(B,\\,D,\\,A,\\,C)')+', con le regole del clan. Il gruppo riesce a concordare un cambiamento?',
  o:['Sì: 2 e 4 si scambiano D e C','Sì: basta una rotazione a tre come nel secondo round','No: ogni cambiamento farebbe stare peggio qualcuno','No: le regole del clan vietano di toccare un equilibrio'],a:2,
  e:'1 e 3 hanno già la loro caverna preferita, quindi non possono cambiare senza perderci. Restano 2 e 4, con D e C: lo scambio darebbe a 2 la caverna C, che per lui è l\'ultima.',
  h:'Parti da chi ha già la caverna preferita: può essere spostato? Poi guarda che cosa resta agli altri.'}
];
QZ['9']=()=>[
 {q:'Stesse preferenze del gioco, ma con la forza rovesciata: '+K('4 \\pw 3 \\pw 2 \\pw 1')+'. Qual è l\'equilibrio della giungla?',
  o:[K('(B,\\,D,\\,A,\\,C)'),K('(D,\\,A,\\,C,\\,B)'),K('(C,\\,D,\\,A,\\,B)'),K('(A,\\,B,\\,C,\\,D)')],a:2,
  e:'Dittatura seriale nell\'ordine 4, 3, 2, 1: 4 prende B; 3 prende A; 2 trova B occupata e prende D; a 1 resta C. È proprio l\'esito del gioco del clan.',
  h:'Applica la dittatura seriale partendo dal più forte, che ora è 4.'},
 {q:'Un\'allocazione è un equilibrio della giungla quando…',
  o:['ogni individuo occupa la sua casa preferita','nessun individuo preferisce alla propria la casa di qualcuno più debole','nessun individuo preferisce alla propria la casa di qualcun altro','nessun\'altra allocazione la domina nel senso di Pareto'],a:1,
  e:'Conta solo l\'invidia verso i più deboli, perché solo a loro si può portare via la casa.',
  h:'Quali case un individuo può davvero ottenere, in una giungla?'},
 {q:'Perché '+K('\\aB=(C,\\,D,\\,A,\\,B)')+' domina nel senso di Pareto '+K('\\aA=(D,\\,A,\\,C,\\,B)')+'?',
  o:['Perché in '+K('\\aB')+' tutti hanno la loro casa preferita','Perché 1, 2 e 3 stanno meglio in '+K('\\aB')+' e 4 non sta peggio','Perché '+K('\\aB')+' è un equilibrio della giungla e '+K('\\aA')+' no','Perché la maggioranza preferisce '+K('\\aB')],a:1,
  e:'1 passa da D a C, 2 da A a D, 3 da C ad A: tre miglioramenti. 4 resta in B. Nessuno peggiora e almeno uno migliora.',
  h:'La dominanza di Pareto chiede due cose: nessuno peggiora, e almeno uno migliora.'},
 {q:'Quale di queste affermazioni è vera, per una giungla con preferenze strette?',
  o:['Ogni allocazione Pareto stabile è l\'equilibrio della giungla','L\'equilibrio è unico ed è Pareto stabile, ma possono esserci altre allocazioni Pareto stabili','Possono esserci più equilibri, tutti Pareto stabili','L\'equilibrio è unico, ma può non essere Pareto stabile'],a:1,
  e:'L\'equilibrio è quello della dittatura seriale nell\'ordine di forza, ed è Pareto stabile. L\'esito del clan mostra che esistono allocazioni Pareto stabili diverse dall\'equilibrio.',
  h:'Confronta l\'esito della giungla con quello del clan: sono due allocazioni diverse. Che proprietà hanno in comune?'},
 {q:'Nell\'esito del clan, '+K('(C,\\,D,\\,A,\\,B)')+', con la forza '+K('1 \\pw 2 \\pw 3 \\pw 4')+', che cosa farebbe saltare l\'equilibrio?',
  o:['2 prenderebbe C a 1','1 prenderebbe B a 4','3 prenderebbe B a 4','Niente: è un equilibrio'],a:1,
  e:'1 occupa C ma preferisce B, che è di 4, il più debole: gli basta presentarsi. Lo stesso vale per 2, che occupa D e preferisce B. Invece 3 ha già la sua preferita, e 2 non può togliere niente a 1.',
  h:'Cerca le caselle rosse nella tabella dell\'esito del clan: in quali colonne stanno, e di chi è la caverna?'}
];


INIT[10]=function(){
/* Scatola di Edgeworth: r = 2 (le scelte non combaciano) e r = 1 (equilibrio) */
(function(){
  const root=$('#edge10'),duo=el('div','duo');
  root.append(legend([[GRN,'retta di bilancio'],['#fff','dotazione','dot'],[YEL,'curva di Ann'],[PUR,'curva di Bob'],[PINK,'scelta di Ann','dot'],[TEAL,'scelta di Bob','dot']]),duo);
  const S=260,m=34,L=192,X=v=>m+v/6*L,Y=v=>m+L-v/6*L,f=v=>v.toFixed(1);
  const curve=(fn,lo,hi)=>{let d='';for(let i=0;i<=80;i++){const x=lo+(hi-lo)*i/80,y=fn(x);if(y<0||y>6)continue;d+=(d?'L':'M')+f(X(x))+' '+f(Y(y))}return d};
  [[2,[4,4],[5,2],'r = 2: le richieste non combaciano'],[1,[4,2],[4,2],'r = 1: equilibrio']].forEach(([r,A,B,t])=>{
    let s='<rect x="'+m+'" y="'+m+'" width="'+L+'" height="'+L+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
    s+=tx(m-4,m+L+16,'Ann',{s:13,f:YEL,a:'end'})+tx(m+L+4,m-6,'Bob',{s:13,f:PUR,a:'start'});
    s+=tx(m+L/2,m+L+18,'mele di Ann →',{s:12,f:GRAY})+tx(m+L/2,m-8,'← mele di Bob',{s:12,f:GRAY});
    s+=tx(m-8,m+L/2,'banane di Ann',{s:12,f:GRAY,x:' transform="rotate(-90 '+(m-8)+' '+(m+L/2)+')"'});
    /* retta di bilancio: r x1 + x2 = 6r */
    const x0=Math.max(0,6-6/r);s+='<line x1="'+f(X(x0))+'" y1="'+f(Y(6*r-r*x0))+'" x2="'+f(X(6))+'" y2="'+f(Y(0))+'" stroke="'+GRN+'" stroke-width="2.5"/>';
    const kA=Math.pow(A[0],2)*A[1];s+='<path d="'+curve(x=>kA/(x*x),0.3,6)+'" fill="none" stroke="'+YEL+'" stroke-width="2"/>';
    const yB=[6-B[0],6-B[1]],kB=yB[0]*yB[1]*yB[1];s+='<path d="'+curve(x=>6-Math.sqrt(kB/(6-x)),0,5.9)+'" fill="none" stroke="'+PUR+'" stroke-width="2"/>';
    s+='<circle cx="'+X(6)+'" cy="'+Y(0)+'" r="6" fill="#fff" stroke="#000" stroke-width="1.5"/>';
    if(r===1)s+='<circle cx="'+X(4)+'" cy="'+Y(2)+'" r="7" fill="'+PINK+'" stroke="#000" stroke-width="1.5"/><circle cx="'+X(4)+'" cy="'+Y(2)+'" r="3.5" fill="'+TEAL+'"/>';
    else s+='<circle cx="'+X(A[0])+'" cy="'+Y(A[1])+'" r="7" fill="'+PINK+'" stroke="#000" stroke-width="1.5"/><circle cx="'+X(B[0])+'" cy="'+Y(B[1])+'" r="7" fill="'+TEAL+'" stroke="#000" stroke-width="1.5"/>';
    const note=r===1?'Ann chiede (4, 2), Bob (2, 4): in tutto <span class="ok">(6, 6)</span>.':'Ann chiede (4, 4), Bob (1, 4): in tutto <span class="bad">5 mele e 8 banane</span>.';
    cell(duo,t,s,S+20,S+12,'Scatola di Edgeworth con '+t,note);
  });
})();
/* Domanda in eccesso di mele nel gioco */
(function(){
  const root=$('#z10'),W=560,H=300+20,ax=60,ay=20,aw=470,ah=230,lo=0.25,hi=4,ymin=-3,ymax=6;
  const X=r=>ax+(r-lo)/(hi-lo)*aw,Y=v=>ay+(ymax-v)/(ymax-ymin)*ah,f=v=>v.toFixed(1);
  let s='<line x1="'+ax+'" y1="'+Y(0)+'" x2="'+(ax+aw)+'" y2="'+Y(0)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+ax+'" y1="'+ay+'" x2="'+ax+'" y2="'+(ay+ah)+'" stroke="#fff" stroke-width="1.5"/>';
  [-2,0,2,4,6].forEach(v=>{s+=tx(ax-8,Y(v)+5,fmt(v),{s:13,f:GRAY,a:'end'})});
  [1,2,3,4].forEach(r=>{s+=tx(X(r),Y(0)+18,fmt(r),{s:13,f:GRAY})+'<line x1="'+X(r)+'" y1="'+(Y(0)-4)+'" x2="'+X(r)+'" y2="'+(Y(0)+4)+'" stroke="#fff"/>'});
  s+=tx(ax+aw,ay+ah+40,'prezzo relativo delle mele r',{s:13,f:GRAY,a:'end'});
  const path=fn=>{let d='';for(let i=0;i<=120;i++){const r=lo+(hi-lo)*i/120,v=fn(r);if(v>ymax)continue;d+=(d?'L':'M')+f(X(r))+' '+f(Y(v))}return d};
  s+='<path d="'+path(r=>-2)+'" fill="none" stroke="'+YEL+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
  s+='<path d="'+path(r=>2/r)+'" fill="none" stroke="'+PUR+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
  s+='<path d="'+path(r=>2/r-2)+'" fill="none" stroke="'+PINK+'" stroke-width="3.5"/>';
  s+='<circle cx="'+X(1)+'" cy="'+Y(0)+'" r="7" fill="'+ORG+'" stroke="#000" stroke-width="1.5"/>'+tx(X(1)-10,Y(0)+22,'equilibrio: r = 1',{s:14,f:ORG,a:'end'});
  s+=tx(X(3.2),Y(-2)+20,'Ann: −2',{s:13,f:YEL})+tx(X(0.62),Y(4.6),'Bob: 2/r',{s:13,f:PUR,a:'start'})+tx(X(1.7),Y(0.75),'totale: 2/r − 2',{s:13,f:PINK,a:'start'});
  root.append(legend([[YEL,'eccesso di Ann','dash'],[PUR,'eccesso di Bob','dash'],[PINK,'domanda in eccesso totale'],[ORG,'prezzo di equilibrio','dot']]));
  svgBox(root,W,H,s,'Domanda in eccesso di mele: Ann sempre meno 2, Bob 2 diviso r, totale 2 diviso r meno 2, che si annulla in r uguale 1','34rem');
})();
};
QZ['10a']=()=>[
 {q:'Il moderatore annuncia '+K('r=1/2')+'. Che cosa succede sul mercato delle mele?',
  o:['Torna: domanda totale 6','Domanda in eccesso: se ne chiedono 8','Offerta in eccesso: se ne chiedono 5','Nessuno vuole mele'],a:1,
  e:'Ann chiede sempre 4 mele, Bob '+K('2/r=4')+': in tutto 8, ma ce ne sono 6. Il prezzo delle mele va alzato.',
  h:'Usa le domande '+K('(4,\\ 2r)')+' e '+K('(2/r,\\ 4)')+'.'}
];
QZ['10b']=()=>[
 {q:'Con i prezzi '+K('(r,1)')+', quanto vale la ricchezza di Ann se '+K('r=3')+'?',
  o:['6','18','3','2'],a:1,
  e:'La ricchezza è il valore della dotazione: '+K('\\pp\\cdot e(\\text{Ann}) = 3\\cdot 6 + 1\\cdot 0 = 18')+'. Se le mele rincarano, Ann diventa più ricca.',
  h:'Ann possiede 6 mele e nessuna banana. Quanto valgono a quei prezzi?'}
];
QZ['10c']=()=>[
 {q:'Perché nell\'esempio con l\'esternalità l\'equilibrio non è Pareto stabile?',
  o:['Perché i prezzi non sono positivi','Perché l\'individuo 1 subisce un danno dal consumo dell\'altro, che nessun prezzo tiene in conto','Perché le preferenze non sono monotone','Perché c\'è un solo bene'],a:1,
  e:'Il secondo sceglie il bene 2 guardando solo ai prezzi e al proprio piacere; il danno che quel consumo fa al primo non entra nella sua scelta. Dando al primo metà del bene 2 e al secondo tutto il bene 1 stanno meglio entrambi: il primo passa da −1 a −0,5, il secondo da 3 a 3,5.',
  h:'Quale ipotesi usa la dimostrazione del teorema, e quale ipotesi del modello viene a mancare?'}
];
QZ['10']=()=>[
 {q:'In un\'economia con due beni e prezzi positivi tutti spendono esattamente il valore della propria dotazione, e il mercato delle mele torna. Che cosa si può dire di quello delle banane?',
  o:['Torna anch\'esso','Non si può dire nulla','Ha per forza una domanda in eccesso','Torna solo se le preferenze sono Cobb–Douglas'],a:0,
  e:'Sommando i vincoli di bilancio, '+K('\\pu\\cdot(\\text{eccesso di mele}) = -\\pd\\cdot(\\text{eccesso di banane})')+'. Con prezzi positivi, se il primo è zero lo è anche il secondo.',
  h:'Somma i vincoli di bilancio di tutti gli individui.'},
 {q:'Il gioco delle mele non soddisfa le ipotesi della proposizione di esistenza, eppure ha un equilibrio. Perché non c\'è contraddizione?',
  o:['Perché il gioco ha due soli individui','Perché le ipotesi sono sufficienti, non necessarie','Perché la domanda di Bob non è continua','Perché l\'equilibrio trovato è sbagliato'],a:1,
  e:'La proposizione dice: se valgono le ipotesi, un equilibrio esiste. Non dice che senza di esse non esiste.',
  h:'Che tipo di condizione è un «se… allora…»?'},
 {q:'Che cosa afferma il primo teorema dell\'economia del benessere?',
  o:['Ogni allocazione Pareto stabile è un equilibrio','Ogni allocazione di equilibrio è Pareto stabile','L\'equilibrio è equo','L\'equilibrio è unico'],a:1,
  e:'Dice solo che in equilibrio non si spreca nulla. Non dice niente su equità o unicità.',
  h:'In quale verso va il collegamento fra equilibrio e Pareto?'},
 {q:'Se '+K('(\\pp,\\aA)')+' è un equilibrio concorrenziale, quale di questi lo è di sicuro?',
  o:[K('(2\\pp,\\ \\aA)'),K('(\\pp,\\ 2\\aA)'),K('(\\pp + (1,1),\\ \\aA)'),K('(\\pp,\\ e)')],a:0,
  e:'Moltiplicare tutti i prezzi per lo stesso numero positivo non cambia nessun insieme di bilancio, quindi né le scelte né la realizzabilità.',
  h:'Che cosa lascia invariato l\'insieme di bilancio '+K('\\pp\\cdot x \\le \\pp\\cdot e(i)')+'?'},
 {q:'Dalla simulazione d\'esame: '+K('\\uu_A=x_1x_2')+', '+K('\\uu_B=x_1^2x_2')+', '+K('e_A=(2,3)')+', '+K('e_B=(5,4)')+', prezzi '+K('(\\pu,1)')+'. Qual è il prezzo di equilibrio del bene 1?',
  o:['1',K('25/16'),K('7/9'),'2'],a:1,
  e:'A spende metà della ricchezza '+K('2\\pu+3')+' sul bene 1: '+K('(2\\pu+3)/(2\\pu)')+'. B ne spende due terzi di '+K('5\\pu+4')+': '+K('2(5\\pu+4)/(3\\pu)')+'. Ponendo la somma uguale a 7 e moltiplicando per '+K('6\\pu')+': '+K('6\\pu+9+20\\pu+16=42\\pu')+', cioè '+K('\\pu=25/16')+'.',
  h:'Con '+K('x_1^\\alpha x_2^\\beta')+' la quota di ricchezza spesa sul bene 1 è '+K('\\alpha/(\\alpha+\\beta)')+'. Poi fai tornare il mercato del bene 1: in tutto ce ne sono 7.'}
];


INIT[11]=function(){
const pleg=()=>legend([[P1C,'giocatore 1 (payoff e nodi)','box'],[P2C,'giocatore 2','box'],['#fff','insieme di informazione con più nodi','dash']]);
/* Gioco dei prezzi: sequenziale e simultaneo */
(function(){
  const root=$('#price11'),duo=el('div','duo');root.append(pleg(),duo);
  [[false,'Sequenziale: 2 vede la scelta di 1'],[true,'Simultaneo: 2 non la vede']].forEach(([sim,t])=>{
    const n=[{id:'r',x:150,y:34,p:'1'},{id:'a',x:75,y:112,p:'2',lx:-14,ly:-4},{id:'b',x:225,y:112,p:'2',lx:14,ly:-4},
      {id:'aa',x:38,y:188,pay:[1,1]},{id:'ab',x:112,y:188,pay:[0,2]},{id:'ba',x:188,y:188,pay:[2,0]},{id:'bb',x:262,y:188,pay:[0.5,0.5]}];
    const p=sim?'':'′';
    const s=gameTree({nodes:n,edges:[['r','a','H',-9],['r','b','L',9],['a','aa','H',-9],['a','ab','L',9],['b','ba','H'+p,-9],['b','bb','L'+p,9]],infos:sim?[['a','b']]:[]});
    cell(duo,t,s,300,222,'Albero del gioco dei prezzi, versione '+(sim?'simultanea':'sequenziale'));
  });
})();
/* Sasso, carta, forbici */
(function(){
  const root=$('#rps11'),A=['R','P','S'],beats={R:'S',S:'P',P:'R'};
  const nodes=[{id:'r',x:300,y:34,p:'1'}],edges=[];
  A.forEach((a,i)=>{const cx=100+i*200;nodes.push({id:a,x:cx,y:112,p:i===0?'2':'',lx:-14,ly:-4});edges.push(['r',a,a,i===0?-9:i===2?9:9]);
    A.forEach((b,j)=>{const id=a+b,v=a===b?0:beats[a]===b?1:-1;nodes.push({id,x:cx-62+j*62,y:190,pay:[v,-v]});edges.push([a,id,b,j===0?-8:8])})});
  root.append(pleg());
  svgBox(root,600,224,gameTree({nodes,edges,infos:[['R','P','S']]}),'Albero di sasso, carta, forbici con il giocatore 2 in un unico insieme di informazione','36rem');
})();
/* Il gioco con tre decisioni */
(function(){
  const root=$('#tree11');
  const nodes=[{id:'r',x:50,y:70,p:'1'},{id:'o1',x:50,y:160,pay:[2,2]},{id:'n2',x:180,y:70,p:'2'},{id:'o2',x:180,y:160,pay:[1,3]},
    {id:'n3',x:310,y:70,p:'1'},{id:'a',x:270,y:160,pay:[4,2]},{id:'b',x:350,y:160,pay:[3,4]}];
  const edges=[['r','o1','O',9],['r','n2','I',0],['n2','o2','O',9],['n2','n3','I',0],['n3','a','A',-9],['n3','b','B',9]];
  let s=gameTree({nodes,edges}).replace(/<text x="115" y="68"/,'<text x="115" y="60"');
  root.append(pleg());
  svgBox(root,400,196,s,'Albero: il giocatore 1 sceglie O o I; dopo I il giocatore 2 sceglie O o I; dopo I il giocatore 1 sceglie A o B','28rem');
})();
/* Strategie come funzioni: il progetto benefico */
(function(){
  const root=$('#charity11'),W=420,H=330,ax=58,ay=16,L=260,X=v=>ax+v/600*L,Y=v=>ay+L-v/600*L,f=v=>v.toFixed(1);
  let s='<path d="M'+ax+' '+ay+'V'+(ay+L)+'H'+(ax+L)+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
  [0,300,600].forEach(v=>{s+=tx(X(v),ay+L+18,v,{s:13,f:GRAY})+(v?tx(ax-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'}):'')});
  s+=tx(ax+L/2,ay+L+38,'contributo osservato x',{s:13,f:GRAY})+tx(16,ay+L/2,'risposta y = s₂(x)',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(ay+L/2)+')"'});
  s+='<line x1="'+X(300)+'" y1="'+Y(600)+'" x2="'+X(600)+'" y2="'+Y(300)+'" stroke="#777" stroke-width="1.4" stroke-dasharray="5 5"/>'+tx(X(290),Y(560),'x + y = 900',{s:12,f:GRAY,a:'end'});
  s+='<path d="M'+f(X(0))+' '+f(Y(0))+'H'+f(X(300))+'M'+f(X(300))+' '+f(Y(600))+'L'+f(X(600))+' '+f(Y(300))+'" fill="none" stroke="'+P2C+'" stroke-width="3.5"/>';
  s+='<circle cx="'+X(300)+'" cy="'+Y(0)+'" r="4" fill="#000" stroke="'+P2C+'" stroke-width="2"/>';
  s+='<line x1="'+X(0)+'" y1="'+Y(300)+'" x2="'+X(600)+'" y2="'+Y(300)+'" stroke="'+TEAL+'" stroke-width="3" stroke-dasharray="9 5"/>';
  root.append(legend([[P2C,'«completo quello che manca, se posso»'],[TEAL,'«verso sempre 300»','dash']]));
  svgBox(root,W,H,s,'Due strategie del giocatore 2 come funzioni del contributo osservato','26rem');
})();
/* Forma normale del gioco con tre decisioni */
(function(){
  const m=gameMatrix(['OA','OB','IA','IB'],['O','I'],[[[2,2],[2,2]],[[2,2],[2,2]],[[1,3],[4,2]],[[1,3],[3,4]]],{cw:84,x0:60});
  svgBox($('#nf11'),m.W,m.H,m.s,'Matrice del gioco con tre decisioni','16rem');
})();
/* Gioco dei prezzi in forma normale */
(function(){
  const root=$('#nfp11'),duo=el('div','duo');root.append(duo);
  const a=gameMatrix(['H','L'],["HH′","HL′","LH′","LL′"],[[[1,1],[1,1],[0,2],[0,2]],[[2,0],[0.5,0.5],[2,0],[0.5,0.5]]],{cw:66,x0:40,ps:13});
  const b=gameMatrix(['H','L'],['H','L'],[[[1,1],[0,2]],[[2,0],[0.5,0.5]]],{cw:80,x0:40});
  cell(duo,'Sequenziale',a.s,a.W,a.H,'Matrice 2 per 4 del gioco dei prezzi sequenziale');
  cell(duo,'Simultaneo',b.s,b.W,b.H,'Matrice 2 per 2 del gioco dei prezzi simultaneo');
})();
/* Giochi classici */
(function(){
  const root=$('#classic11'),g=el('div','multi');root.append(g);
  [['Matching pennies',['T','C'],['T','C'],[[[1,-1],[-1,1]],[[-1,1],[1,-1]]]],
   ['Dilemma del prigioniero',['C','D'],['C','D'],[[[2,2],[0,3]],[[3,0],[1,1]]]],
   ['Battaglia dei sessi',['A','B'],['A','B'],[[[2,1],[0,0]],[[0,0],[1,2]]]],
   ['Falco e colomba',['H','D'],['H','D'],[[[0,0],[3,1]],[[1,3],[2,2]]]],
   ['Coordinamento',['A','B'],['A','B'],[[[1,1],[0,0]],[[0,0],[1,1]]]],
   ['Coordinamento di Pareto',['A','B'],['A','B'],[[[2,2],[0,0]],[[0,0],[1,1]]]]].forEach(([t,r,c,v])=>{
    const m=gameMatrix(r,c,v,{cw:66,x0:34,y0:24});cell(g,t,m.s,m.W,m.H,t)});
})();
};
QZ['11a']=()=>[
 {q:'Nella versione simultanea del gioco dei prezzi, quanti insiemi di informazione ha l\'impresa 2, e quante scelte deve specificare?',
  o:['Due insiemi, due scelte','Un insieme, una scelta','Due insiemi, una scelta','Un insieme, due scelte'],a:1,
  e:'I suoi due nodi sono uniti da un unico insieme di informazione: non sa dove si trova, quindi può decidere una cosa sola. Nella versione sequenziale gli insiemi sono due, e le scelte due.',
  h:'Conta i gruppi di nodi che l\'impresa 2 non sa distinguere.'}
];
QZ['11b']=()=>[
 {q:'Nel gioco con tre decisioni, quanti profili di strategie ci sono?',
  o:['4','6','8','3'],a:2,
  e:'Il giocatore 1 ha 4 strategie ('+K('OA, OB, IA, IB')+'), il giocatore 2 ne ha 2 ('+K('O, I')+'): i profili sono '+K('4\\times 2=8')+', le celle della matrice.',
  h:'L\'insieme dei profili è il prodotto cartesiano dei due spazi di strategie.'}
];
QZ['11']=()=>[
 {q:'Che cos\'è una strategia?',
  o:['L\'azione che il giocatore sceglie per prima','Un piano che dice che cosa fare in ogni insieme di informazione del giocatore','Una distribuzione di probabilità sulle azioni','Il cammino seguito nell\'albero durante la partita'],a:1,
  e:'È un piano completo e contingente, anche per gli insiemi di informazione che il piano stesso non raggiunge.',
  h:'Ricorda perché '+K('O')+' da solo non basta come strategia.'},
 {q:'In un gioco delle slide '+K('\\sS_1=\\{O,A,P\\}')+' e '+K('\\sS_2=\\{A,P\\}')+'. Quanti profili di strategie ci sono?',
  o:['5','6','9','3'],a:1,
  e:K('3\\times 2=6')+'.',
  h:'Moltiplica il numero di strategie dei due giocatori.'},
 {q:'Nell\'albero con tre decisioni, quale profilo dà al giocatore 1 il payoff 4?',
  o:[K('(OA,\\ I)'),K('(IA,\\ I)'),K('(IA,\\ O)'),K('(IB,\\ I)')],a:1,
  e:'Il giocatore 1 entra, il 2 entra, il 1 sceglie '+K('A')+': si arriva alla foglia '+K('(4,2)')+'. È l\'esempio delle slide, '+K('\\uu_1(IA,I)=4')+'.',
  h:'Parti dalla radice e segui le azioni prescritte.'},
 {q:'Il passaggio fra forma estesa e forma normale…',
  o:['è unico in entrambi i versi','è unico dalla forma estesa alla normale, ma non al contrario','è unico dalla normale all\'estesa, ma non al contrario','non è mai unico'],a:1,
  e:'A ogni albero corrisponde una sola matrice; la stessa matrice può venire da alberi diversi, come il gioco dei prezzi simultaneo con l\'una o l\'altra impresa alla radice.',
  h:'Pensa a sasso, carta, forbici con l\'uno o l\'altro giocatore alla radice.'},
 {q:'Nel progetto benefico il giocatore 2 osserva il contributo '+K('x')+' prima di scegliere. Che cos\'è una sua strategia?',
  o:['Un numero in '+K('[0,600]'),'Una coppia di numeri','Una funzione che a ogni '+K('x')+' associa un '+K('y')+' in '+K('[0,600]'),'Una probabilità su '+K('[0,600]')],a:2,
  e:'Ha un insieme di informazione per ogni '+K('x')+' possibile, e il piano deve dire che cosa fa in ciascuno.',
  h:'Quanti insiemi di informazione ha il giocatore 2?'}
];


INIT[12]=function(){
const BOS=[[[2,1],[0,0]],[[0,0],[1,2]]];
/* Battaglia dei sessi e scelta in funzione della convinzione */
(function(){
  const root=$('#bos12'),duo=el('div','duo');root.append(duo);
  const m=gameMatrix(['A','B'],['A','B'],BOS,{cw:80,x0:40});
  cell(duo,'Battaglia dei sessi',m.s,m.W,m.H,'Matrice della battaglia dei sessi');
  const W=300,H=230,ax=40,ay=14,aw=240,ah=170,X=q=>ax+q*aw,Y=v=>ay+ah-v/2*ah;
  let s='<path d="M'+ax+' '+ay+'V'+(ay+ah)+'H'+(ax+aw)+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
  [0,1,2].forEach(v=>{s+=tx(ax-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'})});
  [[0,'0'],[1/3,'1/3'],[1,'1']].forEach(([q,t])=>{s+=tx(X(q),ay+ah+18,t,{s:13,f:GRAY})});
  s+=tx(ax+aw/2,ay+ah+36,'q = probabilità che 2 scelga A',{s:12,f:GRAY});
  s+='<line x1="'+X(1/3)+'" y1="'+ay+'" x2="'+X(1/3)+'" y2="'+(ay+ah)+'" stroke="#777" stroke-dasharray="4 5"/>';
  s+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(1)+'" y2="'+Y(2)+'" stroke="'+PINK+'" stroke-width="3"/>'+tx(X(.86)-6,Y(1.72)-8,'A: 2q',{s:13,f:PINK,a:'end'});
  s+='<line x1="'+X(0)+'" y1="'+Y(1)+'" x2="'+X(1)+'" y2="'+Y(0)+'" stroke="'+ORG+'" stroke-width="3"/>'+tx(X(.08),Y(.92)-10,'B: 1 − q',{s:13,f:ORG,a:'start'});
  s+=tx(X(.17),Y(1.85),'conviene B',{s:12,f:ORG})+tx(X(.7),Y(.8),'conviene A',{s:12,f:PINK});
  cell(duo,'Payoff atteso del giocatore 1',s,W,H,'Payoff atteso del giocatore 1 da A e da B in funzione della probabilità q di A: le rette si incrociano in un terzo');
})();
/* I tre casi di payoff atteso */
(function(){
  const root=$('#eu12'),g=el('div','multi');root.append(legend([[PINK,'peso della cella: più intenso, più probabile','box']]),g);
  [[[.5,.5],[1,0]],[[1,0],[.5,.5]],[[.5,.5],[.5,.5]]].forEach(([sg,th])=>{
    const cw=72,rh=46,x0=44,y0=46;let s='',tot=0;
    s+=tx(x0+cw,14,'θ: A '+fmt(th[0])+' · B '+fmt(th[1]),{s:12,f:PUR});
    ['A','B'].forEach((c,j)=>{s+=tx(x0+j*cw+cw/2,y0-8,c,{s:14,i:1,serif:1,f:P2C})});
    ['A','B'].forEach((r,i)=>{s+=tx(x0-8,y0+i*rh+rh/2+5,r,{s:14,i:1,serif:1,f:P1C,a:'end'})+tx(10,y0+i*rh+rh/2+5,fmt(sg[i]),{s:12,f:TEAL,a:'start'});
      ['A','B'].forEach((c,j)=>{const w=sg[i]*th[j],u=BOS[i][j][0];tot+=w*u;
        s+='<rect x="'+(x0+j*cw)+'" y="'+(y0+i*rh)+'" width="'+cw+'" height="'+rh+'" fill="rgba(220,117,205,'+(w*0.9).toFixed(2)+')" stroke="#555"/>'+
          tx(x0+j*cw+cw/2,y0+i*rh+20,u,{s:16,f:w>.3?'#000':P1C,w:600})+tx(x0+j*cw+cw/2,y0+i*rh+37,'peso '+fmt(w),{s:11,f:w>.3?'#000':GRAY})})});
    s+=tx(16,y0-8,'σ',{s:13,f:TEAL,i:1,serif:1});
    cell(g,'σ₁ = ('+fmt(sg[0])+', '+fmt(sg[1])+')',s,x0+2*cw+8,y0+2*rh+8,'Matrice pesata','payoff atteso = <b>'+fmt(tot)+'</b>');
  });
})();
/* L'isola degli occhi azzurri: induzione su 1, 2, 3 */
(function(){
  const root=$('#eyes12'),W=560,cw=176,rh=58,y0=46;let s='';
  [1,2,3].forEach((k,c)=>{const x=10+c*cw;s+=tx(x+cw/2,20,k+(k===1?' persona':' persone')+' con occhi azzurri',{s:13,f:'#fff'});
    for(let d=1;d<=3;d++){const y=y0+(d-1)*rh,hit=d===k,after=d>k;
      s+='<rect x="'+(x+6)+'" y="'+y+'" width="'+(cw-12)+'" height="'+(rh-10)+'" rx="5" fill="'+(hit?'rgba(88,196,221,.18)':'none')+'" stroke="'+(hit?BLUE:'#333')+'"/>';
      for(let j=0;j<k;j++){const cx=x+cw/2-(k-1)*16+j*32;s+='<circle cx="'+cx+'" cy="'+(y+18)+'" r="10" fill="'+(after?'#333':BLUE)+'" stroke="'+(hit?'#fff':'none')+'" stroke-width="2"/>'}
      s+=tx(x+cw/2,y+42,after?'—':hit?(k===1?'compie il rito':'compiono il rito'):'nessun rito',{s:12,f:hit?BLUE:GRAY});
    }});
  s+=tx(W/2,y0+3*rh+8,'riga 1: primo giorno dopo l\'annuncio · riga 2: secondo giorno · riga 3: terzo giorno',{s:12,f:GRAY});
  root.append(legend([[BLUE,'persona con gli occhi azzurri','dot'],[BLUE,'giorno del rito','box']]));
  svgBox(root,W,y0+3*rh+16,s,'Con k persone dagli occhi azzurri, tutte compiono il rito il giorno k dopo l\'annuncio','34rem');
})();
};
QZ['12a']=()=>[
 {q:'Battaglia dei sessi: il giocatore 1 gioca '+K('\\sig_1=(1/4,\\ 3/4)')+' e crede '+K('\\bel_{-1}=(1/2,\\ 1/2)')+'. Qual è il suo payoff atteso?',
  o:['0,5','0,625','0,75','1'],a:1,
  e:K('\\tfrac14\\cdot\\tfrac12\\cdot 2+\\tfrac34\\cdot\\tfrac12\\cdot 1=0{,}25+0{,}375=0{,}625')+'. Le celle fuori diagonale danno 0.',
  h:'Contano solo le celle '+K('(A,A)')+' e '+K('(B,B)')+': moltiplica i due pesi per il payoff.'}
];
QZ['12b']=()=>[
 {q:'Che cosa ha aggiunto, di nuovo, l\'annuncio dello straniero?',
  o:['Il fatto che sull\'isola ci sono persone con gli occhi azzurri','Il numero esatto di persone con gli occhi azzurri','Il fatto che «c\'è almeno una persona con gli occhi azzurri» è conoscenza comune','Niente: non ha effetto'],a:2,
  e:'Tutti sapevano già che c\'erano occhi azzurri: ognuno ne vede almeno 99. Non sapevano che tutti sanno che tutti sanno… L\'annuncio pubblico lo rende conoscenza comune, e l\'induzione può partire.',
  h:'Che cosa sa una persona con gli occhi azzurri prima dell\'annuncio? E che cosa sa di ciò che sanno gli altri?'}
];
QZ['12']=()=>[
 {q:'Che cos\'è una convinzione '+K('\\bel_{-i}')+'?',
  o:['La strategia mista di '+K('i'),'Una distribuzione di probabilità sulle strategie degli altri','La strategia che gli altri giocano davvero','Il payoff atteso di '+K('i')],a:1,
  e:'È ciò che '+K('i')+' crede delle scelte altrui. Può essere sbagliata, ed è soggettiva.',
  h:'Di chi sono le strategie su cui è definita?'},
 {q:'Battaglia dei sessi, '+K('\\sig_1=(1,0)')+' e '+K('\\bel_{-1}=(1/2,1/2)')+'. Payoff atteso del giocatore 1?',
  o:['2','1','0,75','0,5'],a:1,
  e:'Gioca '+K('A')+' di sicuro: con probabilità ½ prende 2, con ½ prende 0. Media 1.',
  h:'Guarda solo la riga '+K('A')+'.'},
 {q:'Il giocatore 1 della battaglia dei sessi crede che il 2 scelga '+K('A')+' con probabilità '+K('q=1/4')+'. Che cosa gli conviene?',
  o:[K('A'),K('B'),'È indifferente','Dipende dal giocatore 2'],a:1,
  e:K('A')+' gli dà '+K('2q=0{,}5')+', '+K('B')+' gli dà '+K('1-q=0{,}75')+'. Conviene '+K('A')+' solo per '+K('q \\gt 1/3')+'.',
  h:'Confronta '+K('2q')+' con '+K('1-q')+'.'},
 {q:'Quale di queste affermazioni sulla razionalità in teoria dei giochi è corretta?',
  o:['Un giocatore razionale massimizza il proprio guadagno in denaro','La razionalità esclude preferenze per l\'equità','Un giocatore razionale massimizza il suo payoff atteso soggettivo, qualunque cosa misurino i payoff','Un giocatore razionale conosce le strategie degli altri'],a:2,
  e:'La teoria accoglie ogni preferenza coerente rappresentabile con numeri. Le strategie altrui non le conosce: ha solo convinzioni.',
  h:'Che cosa possono rappresentare i payoff?'},
 {q:'Un fatto è conoscenza comune quando…',
  o:['tutti lo sanno','la maggioranza lo sa','tutti lo sanno, tutti sanno che tutti lo sanno, e così via all\'infinito','è stato annunciato'],a:2,
  e:'Il primo livello non basta, come mostra l\'isola: tutti sapevano degli occhi azzurri, ma non era conoscenza comune.',
  h:'Ripensa all\'effetto dell\'annuncio sull\'isola.'}
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
