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


/* Computer Programming: interface in English and small drawing helpers shared by the lessons */
Object.assign(UI,{check:'Check',pickFirst:'Pick an answer first.',right:'Correct.',wrong:'Not quite.',play:'Play',pause:'Pause',seek:'Position in the animation',
  prev:'Previous lesson',next:'Next lesson',toLight:'Switch to light theme',toDark:'Switch to dark theme'});
/* colour roles of this subject: ndarray and its data BLUE, Python list PUR, header and metadata ORG, pointers and results PINK,
   bits set to 1 and the estimate of pi YEL, views TEAL, correct GRN, overflow and errors RED, virtual copies dashed grey */
const ARR=BLUE,LST=PUR,HDR=ORG,PTR=PINK,ONE=YEL,VW=TEAL;
Object.assign(MAC,{'\\bits':col(ORG,'b'),'\\Npts':col(ORG,'n'),'\\Nin':col(PINK,R`n_{\text{in}}`),'\\piest':col(YEL,R`\hat\pi`),'\\dimd':col(ORG,'d')});
/* numbers in English: point as decimal separator, trailing zeros removed; fk adds thousands separators */
const fe=(v,d)=>{const p=Math.pow(10,d===undefined?2:d);return String(Math.round(v*p)/p).replace('-','−')};
const fk=v=>Math.round(v).toLocaleString('en-US');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const rect=(x,y,w,h,f,st,o)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(st?' stroke="'+st+'"':'')+(o||'')+'/>';
const line=(x1,y1,x2,y2,c,w,o)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||1.5)+'"'+(o||'')+'/>';
/* label with a black outline, readable over lines */
const lbl=(x,y,t,c,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13.5)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+(c||'#fff')+'">'+t+'</text>'};
const MONO='font-family:ui-monospace,Menlo,Consolas,monospace';
const mono=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13)+'" text-anchor="'+(o.a||'start')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="'+MONO+';fill:'+(o.f||'#ddd')+'">'+t+'</text>'};
/* seeded random numbers, so every figure shows the same sample on every visit */
const lcg=seed=>{let x=seed;return()=>{x=(x*16807)%2147483647;return (x-1)/2147483646}};
/* English slider: label, value on the right formatted by show(v) */
const sld=(label,min,max,step,val,on,show)=>{
  const l=el('label','sl'),s=el('span','',label),i=el('input'),v=el('span','v');
  i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;
  i.oninput=()=>{v.textContent=show(+i.value);on(+i.value)};v.textContent=show(val);
  l.append(s,i,v);return l;
};
/* a grid of cells with numbers. vals: 2-d array; o: cw, ch, f (text colour), fill(i,j), dash(i,j) for virtual cells, s font size */
function grid(x,y,vals,o){
  o=o||{};const cw=o.cw||34,ch=o.ch||30,fs=o.s||14;let s='';
  vals.forEach((row,i)=>row.forEach((v,j)=>{const X=x+j*cw,Y=y+i*ch,dv=o.dash&&o.dash(i,j);
    s+=rect(X,Y,cw,ch,(o.fill&&o.fill(i,j))||'#0d0d0d',dv?'#666':'#555',dv?' stroke-dasharray="3 3"':'')+
      (v===''||v===null||v===undefined?'':tx(X+cw/2,Y+ch/2+fs*0.36,v,{s:fs,f:dv?'#7a7a7a':(o.fc&&o.fc(i,j))||o.f||'#fff'}))}));
  return s;
}
/* python keywords in pre.code blocks, comments in grey (text nodes outside coloured spans only) */
const PYK=/\b(import|from|as|for|in|if|else|def|return|while|True|False|None|and|or|not|print)\b/g;
function codeHL(root){root.querySelectorAll('pre.code:not([data-hl])').forEach(pre=>{pre.dataset.hl=1;
  [...pre.childNodes].forEach(n=>{if(n.nodeType!==3)return;
    const html=n.nodeValue.split('\n').map(ln=>{const k=ln.indexOf('#');const a=k<0?ln:ln.slice(0,k),c=k<0?'':ln.slice(k);
      return esc(a).replace(PYK,m=>'<span class="kw">'+m+'</span>')+(c?'<span style="color:var(--dim)">'+esc(c)+'</span>':'')}).join('\n');
    const sp=document.createElement('span');sp.innerHTML=html;n.replaceWith(...sp.childNodes)})})}
/* arrow markers, one id per figure */
const arrowM=(id,c)=>'<defs>'+arrowDef(id,c)+'</defs>';

/* miniatures: each one recalls the main figure of its lesson */
(function(){
  const sv=s=>'<svg viewBox="0 0 108 72" aria-hidden="true">'+s+'</svg>';
  /* lesson 1: the 4-bit wheel with the seam between 7 and -8 */
  let t='<circle cx="54" cy="36" r="24" fill="none" stroke="#555" stroke-width="2"/>';
  for(let k=0;k<16;k++){const a=(-90+k*22.5)*Math.PI/180;t+='<circle cx="'+(54+24*Math.cos(a)).toFixed(1)+'" cy="'+(36+24*Math.sin(a)).toFixed(1)+'" r="2.6" fill="'+(k<8?BLUE:PUR)+'"/>'}
  const s1=(-90+7.5*22.5)*Math.PI/180;t+='<line x1="'+(54+14*Math.cos(s1)).toFixed(1)+'" y1="'+(36+14*Math.sin(s1)).toFixed(1)+'" x2="'+(54+33*Math.cos(s1)).toFixed(1)+'" y2="'+(36+33*Math.sin(s1)).toFixed(1)+'" stroke="'+RED+'" stroke-width="2.5"/>';
  THUMB[1]=sv(t);
  /* lesson 2: pointer, header, contiguous data */
  t='<line x1="6" y1="44" x2="102" y2="44" stroke="#444"/><line x1="6" y1="58" x2="102" y2="58" stroke="#444"/>'+
    '<rect x="12" y="44" width="12" height="14" fill="'+PINK+'" fill-opacity=".7"/><rect x="50" y="44" width="14" height="14" fill="'+ORG+'" fill-opacity=".8"/>';
  for(let k=0;k<4;k++)t+='<rect x="'+(66+k*9)+'" y="45" width="7" height="12" fill="'+BLUE+'" fill-opacity=".75"/>';
  t+='<path d="M18 44C18 18 52 18 56 40" fill="none" stroke="'+PINK+'" stroke-width="2"/>';
  THUMB[2]=sv(t);
  /* lesson 3: Monte Carlo points and the quarter circle */
  t='<rect x="30" y="8" width="56" height="56" fill="none" stroke="#666"/>';
  let sd=11;const r=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646};for(let k=0;k<70;k++){const x=r(),y=r();t+='<circle cx="'+(30+x*56).toFixed(1)+'" cy="'+(64-y*56).toFixed(1)+'" r="1.6" fill="'+(x*x+y*y<=1?BLUE:'#666')+'"/>'}
  t+='<path d="M86 64A56 56 0 0 0 30 8" fill="none" stroke="'+YEL+'" stroke-width="2"/>';
  THUMB[3]=sv(t);
})();

/* Lesson 1: why numpy, fixed-width integers, the ndarray */
INIT[1]=function(){
  codeHL($('#lezione-1'));
  /* the matplotlib example of the slides: two plt.plot calls on the same axes */
  (function(){
    const root=$('#c1plot');
    root.append(legend([[BLUE,'<code>plt.plot([1,2,3], [6,2,8])</code>'],[ORG,'<code>plt.plot([0,2,4], [0,10,10])</code>']]));
    const W=460,H=290,L0=46,R0=W-16,T0=14,B0=H-44,X=v=>L0+v/4*(R0-L0),Y=v=>B0-v/10*(B0-T0);let s='';
    [0,2,4,6,8,10].forEach(v=>{s+=line(L0,Y(v),R0,Y(v),'#1e1e1e',1)+tx(L0-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'})});
    [0,1,2,3,4].forEach(v=>{s+=tx(X(v),B0+20,v,{s:13,f:GRAY})});
    s+='<path d="M'+L0+' '+T0+'V'+B0+'H'+R0+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
    s+=tx((L0+R0)/2,H-6,'x values',{s:13,f:GRAY})+tx(14,(T0+B0)/2,'y values',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T0+B0)/2+')"'});
    const pl=(pts,c)=>'<path d="'+pts.map((p,i)=>(i?'L':'M')+X(p[0])+' '+Y(p[1])).join('')+'" fill="none" stroke="'+c+'" stroke-width="3"/>'+pts.map(p=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="4.5" fill="'+c+'"/>').join('');
    s+=pl([[1,6],[2,2],[3,8]],BLUE)+pl([[0,0],[2,10],[4,10]],ORG);
    svgBox(root,W,H,s,'Two line plots drawn on the same axes','30rem');
  })();
  /* the 4-bit wheel: signed and unsigned readings of the same 16 patterns */
  (function(){
    const root=$('#c1wheel'),duo=el('div','duo');
    root.append(legend([[BLUE,'non-negative value','dot'],[PUR,'negative value','dot'],[RED,'where +1 wraps around'],[PINK,'5 · 4 lands here','dot']]),duo);
    const W=320,cx=160,cy=160,ang=k=>(-90+k*22.5)*Math.PI/180,P=(k,r)=>[cx+r*Math.cos(ang(k)),cy+r*Math.sin(ang(k))];
    const bits=k=>k.toString(2).padStart(4,'0');
    const wheel=(signed,id)=>{
      let s=arrowM(id,'#fff')+'<circle cx="'+cx+'" cy="'+cy+'" r="112" fill="none" stroke="#444" stroke-width="2"/>';
      for(let k=0;k<16;k++){const v=signed&&k>7?k-16:k,c=v<0?PUR:BLUE,[bx,by]=P(k,84),[vx,vy]=P(k,136),[dx,dy]=P(k,112);
        s+='<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="5" fill="'+c+'"/>'+mono(bx.toFixed(1),(by+4.5).toFixed(1),bits(k),{s:12,a:'middle',f:'#bbb'})+
          tx(vx.toFixed(1),(vy+5.5).toFixed(1),String(v).replace('-','−'),{s:16,f:c,w:600})}
      const seam=signed?7.5:15.5,[a1,b1]=P(seam,100),[a2,b2]=P(seam,152);
      s+=line(a1.toFixed(1),b1.toFixed(1),a2.toFixed(1),b2.toFixed(1),RED,3);
      const k0=signed?7:15,[sx,sy]=P(k0+0.02,56),[ex,ey]=P(k0+0.98,56);
      s+='<path d="M'+sx.toFixed(1)+' '+sy.toFixed(1)+'A56 56 0 0 1 '+ex.toFixed(1)+' '+ey.toFixed(1)+'" fill="none" stroke="#fff" stroke-width="2" marker-end="url(#'+id+')"/>';
      s+=tx(cx,cy-4,signed?'7 + 1':'15 + 1',{s:16,f:'#fff'})+tx(cx,cy+20,signed?'→ −8':'→ 0',{s:16,f:RED,w:600});
      if(!signed){const [px,py]=P(4,112);s+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="8.5" fill="none" stroke="'+PINK+'" stroke-width="3"/>'}
      return s};
    cell(duo,'Signed: int4, from −8 to 7',wheel(true,'c1a1'),W,W,'Wheel of 16 bit patterns read as signed numbers','The first half of the patterns is 0 to 7, the second half −8 to −1. Past 7 comes <span class="bad">−8</span>.');
    cell(duo,'Unsigned: uint4, from 0 to 15',wheel(false,'c1a2'),W,W,'Wheel of 16 bit patterns read as unsigned numbers','All 16 patterns are 0 to 15. Past 15 comes <span class="bad">0</span>, and 5 · 4 = 20 gives <span class="bad">4</span>.');
  })();
  /* np.int64(3)**k for k = 1..100, computed exactly with BigInt */
  (function(){
    const root=$('#c1pow');root.append(legend([[BLUE,'equals the true power','dot'],[PUR,'wrapped around','dot'],[PINK,'k = 100','dot']]));
    const W=620,H=320,L0=58,R0=W-14,T0=44,B0=H-46,X=k=>L0+(k-1)/99*(R0-L0),Y=f=>B0-(f+1)/2*(B0-T0);
    const M=2n**64n,H63=2n**63n,MAXI=Number(H63-1n);let s=arrowM('c1pw',BLUE);
    [-1,-0.5,0,0.5,1].forEach(f=>{s+=line(L0,Y(f),R0,Y(f),f===0?'#3a3a3a':'#1c1c1c',1)+tx(L0-8,Y(f)+5,f===1?'max':f===-1?'min':String(f).replace('-','−'),{s:13,f:GRAY,a:'end'})});
    [1,20,40,60,80,100].forEach(k=>{s+=tx(X(k),B0+20,k,{s:13,f:GRAY})});
    s+='<path d="M'+L0+' '+T0+'V'+B0+'H'+R0+'" fill="none" stroke="#fff" stroke-width="1.3"/>';
    s+=tx((L0+R0)/2,H-6,'exponent k',{s:13,f:GRAY})+tx(14,(T0+B0)/2,'value / largest int64',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T0+B0)/2+')"'});
    const xb=X(39.5);s+=line(xb,T0-26,xb,B0,'#888',1.2,' stroke-dasharray="4 4"')+lbl(xb+10,T0-16,'from k = 40: 3<tspan dy="-6" font-size="10">k</tspan><tspan dy="6"> &gt; max</tspan>',GRAY,{a:'start',s:13});
    s+=line(X(39),Y(0.5),X(39),T0-24,BLUE,1.6,' stroke-dasharray="3 3" marker-end="url(#c1pw)"')+lbl(X(39)-12,T0-16,'true value keeps growing',BLUE,{a:'end',s:13});
    let p=1n;for(let k=1;k<=100;k++){p*=3n;let v=p%M;if(v>=H63)v-=M;const f=Number(v)/MAXI,c=k<40?BLUE:PUR;
      s+='<circle cx="'+X(k).toFixed(1)+'" cy="'+Y(f).toFixed(1)+'" r="3.6" fill="'+c+'"/>';
      if(k===100)s+='<circle cx="'+X(k).toFixed(1)+'" cy="'+Y(f).toFixed(1)+'" r="8" fill="none" stroke="'+PINK+'" stroke-width="2.5"/>'}
    svgBox(root,W,H,s,'np.int64(3) to the power k, as a fraction of the int64 maximum, for k from 1 to 100','40rem');
  })();
  /* exercise 2: one dtype for the whole array */
  (function(){
    const root=$('#c1dtype');root.append(legend([[LST,'list element (a Python object)','box'],[ARR,'array element','box'],[HDR,'converted to the array\'s type','box']]));
    const cases=[{code:'np.array([1, 3, 5, 7])',inp:[['1','int'],['3','int'],['5','int'],['7','int']],outv:['1','3','5','7'],conv:[0,0,0,0],dt:'int64'},
      {code:'np.array([1, 2.0, 3, 4.0])',inp:[['1','int'],['2.0','float'],['3','int'],['4.0','float']],outv:['1.','2.','3.','4.'],conv:[1,0,1,0],dt:'float64'},
      {code:'np.array([1, 2.0, 3, 4.0, \'hello\'])',inp:[['1','int'],['2.0','float'],['3','int'],['4.0','float'],['\'hello\'','str']],outv:['\'1\'','\'2.0\'','\'3\'','\'4.0\'','\'hello\''],conv:[1,1,1,1,0],dt:'&lt;U32'}];
    const W=710,rh=118,cw=64,lx=10,ax=376;let s=arrowM('c1dt','#888');
    cases.forEach((c,k)=>{const y=k*rh+34;
      s+=mono(lx,y-12,esc(c.code),{s:14,f:'#fff'});
      c.inp.forEach((e,j)=>{const x=lx+j*cw;s+=rect(x,y,cw,36,'rgba(202,163,232,.16)',LST)+mono(x+cw/2,y+23,e[0],{s:13.5,a:'middle',f:'#eee'})+tx(x+cw/2,y+56,e[1],{s:13,f:GRAY})});
      s+=line(lx+5*cw+8,y+18,ax-10,y+18,'#888',1.5,' marker-end="url(#c1dt)"');
      c.outv.forEach((v,j)=>{const x=ax+j*cw,cv=c.conv[j];s+=rect(x,y,cw,36,'rgba(88,196,221,.14)',cv?HDR:'#555',cv?' stroke-width="2.2"':'')+mono(x+cw/2,y+23,v,{s:13.5,a:'middle',f:'#eee'})});
      s+=mono(ax,y+58,'dtype: <tspan style="fill:'+HDR+'">'+c.dt+'</tspan>',{s:14,f:'#fff'});
      if(k<2)s+=line(lx,y+rh-40,W-10,y+rh-40,'#1f1f1f',1)});
    svgBox(root,W,3*rh-6,s,'Three lists converted to arrays, each ending with a single dtype','44rem');
  })();
  /* the 2-d array of the slides with its axes and attributes */
  (function(){
    const W=580,H=250,gx=150,gy=74,cw=64,ch=50,A=[[4,5,6],[2,3,1]];let s=arrowM('c1ax','#bbb');
    s+=grid(gx,gy,A,{cw,ch,s:20,fill:(i,j)=>i===0&&j===1?'rgba(220,117,205,.35)':'rgba(88,196,221,.12)',fc:(i,j)=>i===0&&j===1?PINK:'#fff'});
    [0,1,2].forEach(j=>{s+=tx(gx+j*cw+cw/2,gy-10,j,{s:14,f:GRAY})});
    [0,1].forEach(i=>{s+=tx(gx-12,gy+i*ch+ch/2+5,i,{s:14,f:GRAY,a:'end'})});
    s+=line(gx,gy-34,gx+3*cw-6,gy-34,'#bbb',1.5,' marker-end="url(#c1ax)"')+tx(gx+1.5*cw,gy-44,'axis 1: columns, 3 of them',{s:13.5,f:GRAY});
    s+=line(gx-44,gy,gx-44,gy+2*ch-6,'#bbb',1.5,' marker-end="url(#c1ax)"')+tx(gx-56,gy+ch,'axis 0: rows, 2',{s:13.5,f:GRAY,a:'end'});
    s+=mono(gx+cw*1.5,gy+2*ch+34,'a[0,1] → <tspan style="fill:'+PINK+'">5</tspan>',{s:15,a:'middle',f:'#fff'});
    const ax=gx+3*cw+40;
    [['a.ndim','2'],['a.shape','(2, 3)'],['a.size','6']].forEach((r,k)=>{s+=mono(ax,gy+18+k*30,r[0],{s:15,f:'#fff'})+mono(ax+86,gy+18+k*30,'→ <tspan style="fill:'+HDR+'">'+r[1]+'</tspan>',{s:15,f:'#bbb'})});
    svgBox($('#c1nd'),W,H,s,'A 2 by 3 array with its axes, an indexed element and its attributes','34rem');
  })();
};
QZ['1a']=()=>[
  {q:'You need the special function <code>erf</code>. Which line gives you access to it the way the slides show?',
   o:['<code>import numpy as erf</code>','<code>from scipy import special</code>, then <code>special.erf(1.5)</code>','<code>import matplotlib.pyplot as plt</code>, then <code>plt.erf(1.5)</code>','<code>np.log(4 + np.exp(3))</code>'],a:1,
   e:'scipy is a collection of submodules, and special functions such as erf live in <code>scipy.special</code>.',
   h:'Special functions belong to the library that collects algorithms for scientific computing, organized in submodules.'}
];
QZ['1b']=()=>[
  {q:'In the hypothetical signed 4-bit type, what is 6 + 3?',
   o:['9','−8','−7','1'],a:2,
   e:'The true sum is 9, which is past the maximum 7. The pattern of 9 is 1001, which the signed type reads as 9 − 16 = −7: two steps past the red line on the wheel.',
   h:'Count 3 steps clockwise from 6 on the first wheel. What happens after 7?'}
];
QZ['1c']=()=>[
  {q:'In the spirit of exercise 1 of the course: <code>x = np.int16(32767)</code>. What does <code>x + np.int16(1)</code> give?',
   o:['32768','−32768','0','An error: the result does not fit'],a:1,
   e:'32,767 = 2<sup>15</sup> − 1 is the maximum of int16. One step past it wraps to the minimum, −2<sup>15</sup> = −32,768 (numpy also prints an overflow warning).',
   h:'Compute the range of a signed 16-bit integer from the formula, then think of the wheel.'}
];
QZ['1']=()=>[
  {q:'Which pair is the range of <code>np.int8</code>?',
   o:['0 to 255','−127 to 127','−128 to 127','−256 to 255'],a:2,
   e:'With b = 8 the signed range is −2<sup>7</sup> = −128 to 2<sup>7</sup> − 1 = 127: 256 values in total.',
   h:'Use −2<sup>b−1</sup> and 2<sup>b−1</sup> − 1 with b = 8.'},
  {q:'<code>np.uint8(250) + np.uint8(10)</code> gives what?',
   o:['260','4','−6','255'],a:1,
   e:'uint8 computes modulo 256: 260 − 256 = 4.',
   h:'An unsigned 8-bit integer has 256 values, from 0 to 255. What happens one step past 255?'},
  {q:'<code>a = np.ones((3,5,2), dtype=np.int64)</code>. What are <code>a.ndim</code> and <code>a.size</code>?',
   o:['3 and 30','2 and 30','3 and 10','30 and 3'],a:0,
   e:'The shape tuple has three entries, so ndim = 3; the total number of elements is 3 × 5 × 2 = 30.',
   h:'ndim counts the entries of the shape tuple; size multiplies them.'},
  {q:'A theory question of the course: why is it a good idea to fix the data type of a structure, as ndarrays do?',
   o:['Because it lets an array hold strings and numbers together','Because every element then takes a known number of bits, so the CPU can process elements with single instructions and skip type checks','Because fixed types make integers unlimited, like Python\'s','Because it avoids the need for a header'],a:1,
   e:'A fixed type gives each element a predictable size and a known machine operation, so numpy can work in bulk on contiguous memory instead of checking each element.',
   h:'Think of what the CPU needs to know before it can add two numbers, and how often a list must find it out.'},
  {q:'<code>a = 3</code> and <code>b = np.int64(3)</code>. <code>a == b</code> is True, but <code>a**100</code> and <code>b**100</code> differ. Why?',
   o:['Python integers overflow at 64 bits and numpy integers don\'t','The comparison <code>==</code> is broken for numpy types','numpy computes powers with floating point numbers','<code>a</code> and <code>b</code> have the same value but different types: numpy keeps only 64 bits of the result'],a:3,
   e:'Equality is not identity: a Python int grows as needed, while an int64 keeps the last 64 bits of the result, which here read as a negative number.',
   h:'Ask which of the two types has a fixed number of bits.'},
  {q:'Following the slides, which statement about a 1-dimensional ndarray is true?',
   o:['Its size can grow with append, like a list','Its elements can have different types, like a list','All its elements have the same type and its size is fixed','Indexing it starts from 1'],a:2,
   e:'A 1-d ndarray is homogeneous and has a fixed size; it is indexed like a list, starting from 0.',
   h:'The slides list two differences from a Python list.'}
];

/* Lesson 2: storing arrays and lists in memory */
INIT[2]=function(){
  codeHL($('#lezione-2'));
  const OBG='rgba(255,134,47,.16)',BBG='rgba(88,196,221,.14)',PBG='rgba(220,117,205,.2)',LBG='rgba(202,163,232,.16)';
  const b8=v=>v.toString(2).padStart(8,'0');
  /* nine bytes of RAM: the list is there, but nothing marks it */
  (function(){
    const rnd=lcg(20251),cw=78,x0_=20,y=64,h=40,W=x0_*2+9*cw,H=196;let s='';
    const bytes=[0,1,2].map(()=>Math.floor(rnd()*256)).concat([2,14,3,8]).concat([0,1].map(()=>Math.floor(rnd()*256)));
    s+=line(6,y,W-6,y,'#555',1.5)+line(6,y+h,W-6,y+h,'#555',1.5);
    bytes.forEach((v,k)=>{const x=x0_+k*cw;
      s+=line(x,y,x,y+h,'#555',1.5)+tx(x+cw/2,y-12,k,{s:13,f:GRAY})+mono(x+cw/2,y+h/2+5,b8(v),{s:12.5,a:'middle',f:'#eee'})+tx(x+cw/2,y+h+22,v,{s:14,f:k>=3&&k<=6?'#fff':GRAY})});
    s+=line(x0_+9*cw,y,x0_+9*cw,y+h,'#555',1.5)+tx(x0_+cw*4.5,y-36,'address',{s:13,f:GRAY});
    s+=tx(x0_+3*cw,y+h+52,'start?',{s:15,f:HDR,w:600})+tx(x0_+7*cw,y+h+52,'end?',{s:15,f:HDR,w:600});
    s+=line(x0_+3*cw,y+h+4,x0_+3*cw,y+h+36,HDR,1.5,' stroke-dasharray="3 3"')+line(x0_+7*cw,y+h+4,x0_+7*cw,y+h+36,HDR,1.5,' stroke-dasharray="3 3"');
    s+=tx(x0_+5*cw,y+h+74,'the list [2, 14, 3, 8] was written here',{s:13,f:GRAY});
    svgBox($('#c2ram'),W,H,s,'Nine bytes of memory with addresses; four of them hold the list but nothing marks its boundaries','44rem');
  })();
  /* binary representation of the four numbers */
  (function(){
    const cw=44,ch=36,gx=70,gy=62,W=gx+8*cw+190,H=gy+4*ch+16;let s='';
    for(let p=0;p<8;p++){const x=gx+p*cw+cw/2,e=7-p;s+=tx(x,22,'2<tspan dy="-7" font-size="10">'+e+'</tspan>',{s:14,f:GRAY})+tx(x,46,Math.pow(2,e),{s:14,f:'#fff'})}
    [2,14,3,8].forEach((v,r)=>{const y=gy+r*ch,bs=b8(v);s+=tx(gx-16,y+ch/2+5,v,{s:16,f:'#fff',a:'end',w:600});
      for(let p=0;p<8;p++){const on=bs[p]==='1';s+=rect(gx+p*cw,y,cw,ch,on?'rgba(255,255,0,.28)':'#0d0d0d','#444')+mono(gx+p*cw+cw/2,y+ch/2+5,bs[p],{s:15,a:'middle',f:on?YEL:'#777'})}
      const parts=[];for(let p=0;p<8;p++)if(bs[p]==='1')parts.push(Math.pow(2,7-p));
      s+=tx(gx+8*cw+14,y+ch/2+5,'= '+parts.join(' + '),{s:14,f:GRAY,a:'start'})});
    svgBox($('#c2bin'),W,H,s,'Place value table: 2, 14, 3 and 8 written as 8 bits each','36rem');
  })();
  /* header + data: the type decides how the same bytes are read */
  (function(){
    const root=$('#c2hdr'),duo=el('div','duo');root.append(legend([[PTR,'pointer','box'],[HDR,'header','box'],[ARR,'values read','box']]),duo);
    const W=340,H=236,y=110,h=40,hx=16,hw=104,dx=hx+hw+4,cw=50,data=[2,14,3,8];
    const panel=(type,len,id)=>{let s=arrowM(id,PTR);
      s+=rect(14,14,34,30,PBG,PTR)+tx(31,35,'a',{s:16,f:PTR,i:1});
      s+='<path d="M48 29C80 29 '+(hx+hw/2)+' 40 '+(hx+hw/2)+' '+(y-6)+'" fill="none" stroke="'+PTR+'" stroke-width="2" marker-end="url(#'+id+')"/>';
      s+=tx(hx+hw/2,y+h+20,'header',{s:12.5,f:GRAY});
      s+=rect(hx,y,hw,h,OBG,HDR)+tx(hx+hw/2,y+17,type,{s:13,f:HDR})+tx(hx+hw/2,y+33,'length '+len,{s:13,f:HDR});
      s+=tx(dx+2*cw,y-10,'data',{s:12.5,f:GRAY});
      data.forEach((v,k)=>{s+=rect(dx+k*cw,y,cw,h,'#0d0d0d','#555')+tx(dx+k*cw+cw/2,y+h/2+5,v,{s:15,f:'#eee'})});
      const by=y+h+10;
      if(len===4)data.forEach((v,k)=>{const x=dx+k*cw;s+='<path d="M'+(x+4)+' '+by+'v6H'+(x+cw-4)+'v-6" fill="none" stroke="'+ARR+'" stroke-width="1.5"/>'+tx(x+cw/2,by+28,v,{s:16,f:ARR,w:600})});
      else s+='<path d="M'+(dx+4)+' '+by+'v6H'+(dx+4*cw-4)+'v-6" fill="none" stroke="'+ARR+'" stroke-width="1.5"/>'+tx(dx+2*cw,by+28,'134,417,922',{s:16,f:ARR,w:600});
      return s};
    cell(duo,'Header: uint8, length 4',panel('uint8',4,'c2h1'),W,H,'Four bytes read as four uint8 values','1 byte per element: [2, 14, 3, 8].');
    cell(duo,'Header: uint32, length 1',panel('uint32',1,'c2h2'),W,H,'Four bytes read as one uint32 value','4 bytes per element: one number. Added on this page.');
  })();
  /* replacing 3 with 3**100: compact layout versus array of pointers */
  (function(){
    const root=$('#c2list'),duo=el('div','duo');root.append(legend([[HDR,'header','box'],[PTR,'pointer','box'],[RED,'entries that must move']]),duo);
    const W=340,H=262;
    /* compact */
    let s=arrowM('c2l1',RED);const cw=44,ch=34,xs=12;
    const row=(y,cells)=>{let x=xs,r='';cells.forEach(c=>{const w=c.w||cw;r+=rect(x,y,w,ch,c.bg||'#0d0d0d',c.st||'#555')+tx(x+w/2,y+ch/2+5,c.t,{s:c.s||14,f:c.f||'#eee'});c.x=x;x+=w});return r};
    const before=[{t:'h',bg:OBG,st:HDR,f:HDR,w:30},{t:'2'},{t:'14'},{t:'3'},{t:'8'},{t:'…',f:GRAY}];
    const after=[{t:'h',bg:OBG,st:HDR,f:HDR,w:30},{t:'2'},{t:'14'},{t:'3**100 (20 bytes)',w:124,s:12.5,f:PTR,bg:PBG,st:PTR},{t:'8',st:RED,f:RED},{t:'…',f:RED,w:36}];
    s+=tx(xs,38,'before',{s:13,f:GRAY,a:'start'})+row(48,before)+tx(xs,134,'after',{s:13,f:GRAY,a:'start'})+row(144,after);
    s+=line(before[4].x+cw/2,48+ch+4,after[4].x+cw/2-4,144-6,RED,2,' marker-end="url(#c2l1)"');
    s+=line(before[5].x+cw/2,48+ch+4,after[5].x+18,144-6,RED,2,' marker-end="url(#c2l1)"');
    s+=tx(W/2,214,'8 and every later entry move:',{s:13.5,f:RED})+tx(W/2,234,'cost O(N)',{s:13.5,f:RED,w:600});
    cell(duo,'Compact layout',s,W,H,'In a compact layout the large value pushes every later entry to the right','<span class="bad">Does not work</span> for a list: assignment would cost O(N), and a new type could not be read.');
    /* pointers */
    s=arrowM('c2l2',PTR)+arrowM('c2l3','#666');const py=26,pw=40,px=70;
    s+=rect(px-34,py,30,ch,OBG,HDR)+tx(px-19,py+22,'h',{s:14,f:HDR});
    for(let k=0;k<4;k++)s+=rect(px+k*pw,py,pw,ch,PBG,PTR)+'<circle cx="'+(px+k*pw+pw/2)+'" cy="'+(py+ch/2)+'" r="4" fill="'+PTR+'"/>';
    s+=tx(px+2*pw,py-8,'array of pointers, 64 bits each',{s:12.5,f:GRAY});
    const obj=(x,y,t,v,o)=>{o=o||{};const vw=o.vw||40;return '<g opacity="'+(o.op||1)+'">'+rect(x,y,34,ch,'#161616','#555')+tx(x+17,y+22,t,{s:12.5,f:GRAY})+rect(x+34,y,vw,ch,o.bg||'#0d0d0d',o.st||'#555')+tx(x+34+vw/2,y+22,v,{s:o.s||14,f:o.f||'#eee'})+'</g>'};
    const O=[[8,118,'2'],[66,196,'14'],[176,118,'3'],[262,196,'8']];
    O.forEach((o,k)=>{s+=obj(o[0],o[1],'int',o[2],k===2?{op:.35}:{})});
    s+=obj(146,196,'int','3**100',{vw:70,s:12.5,f:PTR,bg:PBG,st:PTR});
    const from=k=>[px+k*pw+pw/2,py+ch/2+5];
    const arr=(k,tx_,ty_,c,id,d)=>{const [fx,fy]=from(k);return '<path d="M'+fx+' '+fy+'C'+fx+' '+(fy+40)+' '+tx_+' '+(ty_-40)+' '+tx_+' '+(ty_-6)+'" fill="none" stroke="'+c+'" stroke-width="2"'+(d?' stroke-dasharray="4 4"':'')+' marker-end="url(#'+id+')"/>'};
    s+=arr(0,42,118,'#666','c2l3')+arr(1,100,196,'#666','c2l3')+arr(3,296,196,'#666','c2l3')+arr(2,211,118,'#666','c2l3',true)+arr(2,170,196,PTR,'c2l2');
    s+=tx(W/2,252,'one pointer rewritten: cost O(1)',{s:13.5,f:PTR,w:600});
    cell(duo,'Python list: array of pointers',s,W,H,'A list is an array of pointers to objects; assignment rewrites one pointer','<span class="ok">Works.</span> Each object carries its own type; reading an element takes two jumps.');
  })();
  /* a 2 by 3 matrix: list of lists versus one numpy block */
  (function(){
    const root=$('#c2two'),duo=el('div','duo');root.append(legend([[PTR,'pointer','box'],[HDR,'header','box'],[ARR,'data','box']]),duo);
    const W=340,H=236,ch=34;
    let s=arrowM('c2t1',PTR);
    s+=rect(14,26,34,ch,PBG,PTR)+rect(48,26,34,ch,PBG,PTR)+'<circle cx="31" cy="43" r="4" fill="'+PTR+'"/><circle cx="65" cy="43" r="4" fill="'+PTR+'"/>'+tx(48,18,'array of pointers',{s:12.5,f:GRAY});
    const vec=(x,y,vals,lab)=>{let r=rect(x,y,28,ch,OBG,HDR)+tx(x+14,y+22,'h',{s:14,f:HDR});vals.forEach((v,k)=>{r+=rect(x+28+k*36,y,36,ch,BBG,'#555')+tx(x+28+k*36+18,y+22,v,{s:15,f:'#eee'})});return r+tx(x+(28+36*3)/2,y+ch+18,lab,{s:12.5,f:GRAY})};
    s+=vec(110,96,[1,2,5],'row 0, stored apart')+vec(170,170,[3,14,7],'row 1, stored apart');
    s+='<path d="M31 64C31 110 70 113 104 113" fill="none" stroke="'+PTR+'" stroke-width="2" marker-end="url(#c2t1)"/>';
    s+='<path d="M65 64C65 170 120 187 164 187" fill="none" stroke="'+PTR+'" stroke-width="2" marker-end="url(#c2t1)"/>';
    cell(duo,'Rows linked by pointers (not numpy)',s,W,H,'Each row stored as a separate vector, linked by pointers','Like a Python list of lists: one more layer of pointers, so one more jump.');
    s='';const hy=40;
    s+=rect(14,hy,124,112,OBG,HDR);[['type','int64'],['size','6'],['dim','2'],['shape','(2, 3)']].forEach((r,k)=>{s+=tx(24,hy+26+k*25,r[0],{s:13,f:GRAY,a:'start'})+tx(128,hy+26+k*25,r[1],{s:13.5,f:HDR,a:'end',w:600})});
    s+=tx(76,hy-12,'one header',{s:12.5,f:GRAY});
    const dx=142,dy=hy+38;[1,2,5,3,14,7].forEach((v,k)=>{s+=rect(dx+k*32,dy,32,ch,BBG,'#555')+tx(dx+k*32+16,dy+22,v,{s:15,f:'#eee'})});
    s+=line(dx+96,dy-12,dx+96,dy+ch+12,'#bbb',1.5,' stroke-dasharray="3 3"')+tx(dx+48,dy-16,'row 0',{s:12.5,f:GRAY})+tx(dx+144,dy-16,'row 1',{s:12.5,f:GRAY});
    s+=tx(dx+96,dy+ch+30,'contiguous data',{s:12.5,f:GRAY});
    cell(duo,'numpy: one header, one block',s,W,H,'numpy stores the matrix as one header followed by all six values','All entries in contiguous slots; the header now also needs dim and shape.');
  })();
  /* row-major and column-major order */
  (function(){
    const root=$('#c2order'),duo=el('div','duo');root.append(legend([[PTR,'order of writing'],[ARR,'data block','box']]),duo);
    const M=[[1,2,5],[3,14,7]],W=300,H=274,cw=68,ch=56,gx=48,gy=14;
    const panel=(path,id)=>{let s=arrowM(id,PTR)+grid(gx,gy,M,{cw,ch,s:17,fill:()=>'#0d0d0d'});
      const c=([i,j])=>[gx+j*cw+cw/2,gy+i*ch+ch/2];
      for(let k=0;k<path.length-1;k++){const [x1,y1]=c(path[k]),[x2,y2]=c(path[k+1]),dxl=x2-x1,dyl=y2-y1,L_=Math.hypot(dxl,dyl),ux=dxl/L_,uy=dyl/L_;
        s+=line((x1+ux*17).toFixed(1),(y1+uy*17).toFixed(1),(x2-ux*19).toFixed(1),(y2-uy*19).toFixed(1),PTR,2.2,' marker-end="url(#'+id+')"')}
      const sy=gy+2*ch+48,sx=18;path.forEach(([i,j],k)=>{s+=rect(sx+k*44,sy,44,36,BBG,'#555')+tx(sx+k*44+22,sy+23,M[i][j],{s:15,f:'#eee'})+tx(sx+k*44+22,sy+54,k,{s:12.5,f:GRAY})});
      s+=tx(W/2,sy-12,'data block',{s:12.5,f:GRAY});return s};
    cell(duo,'Row-major (C, C++, Python)',panel([[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]],'c2o1'),W,H,'Row-major order: 1 2 5 3 14 7','Row by row: 1, 2, 5, 3, 14, 7.');
    cell(duo,'Column-major (Fortran, MATLAB, Julia)',panel([[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]],'c2o2'),W,H,'Column-major order: 1 3 2 14 5 7','Column by column: 1, 3, 2, 14, 5, 7.');
  })();
  /* the timings of the first demo */
  (function(){
    const root=$('#c2time'),duo=el('div','duo');root.append(legend([[LST,'Python list','box'],[ARR,'numpy array','box']]),duo);
    const W=330,H=150,bx=66,bw=190;
    const panel=(vals,mx,ticks)=>{let s='';
      ticks.forEach(t=>{const x=bx+t/mx*bw;s+=line(x,16,x,104,'#222',1)+tx(x,124,t,{s:12.5,f:GRAY})});
      vals.forEach((v,k)=>{const y=24+k*42;s+=tx(bx-10,y+20,k?'array':'list',{s:13.5,f:'#fff',a:'end'})+rect(bx,y,Math.max(1.5,v/mx*bw),28,k?ARR:LST)+tx(bx+v/mx*bw+6,y+19,v.toFixed(1)+' ms',{s:13.5,f:'#fff',a:'start'})});
      s+=line(bx,16,bx,104,'#888',1.5)+tx(bx+bw/2,144,'milliseconds',{s:12.5,f:GRAY});return s};
    cell(duo,'Create 1,000,000 random numbers',panel([109.8,9.4],140,[0,40,80,120]),W,H,'Creating a million random numbers: list 110 ms, array 9.4 ms','The array is about <b>12 times</b> faster.');
    cell(duo,'Sum them',panel([9.0,1.0],12,[0,4,8,12]),W,H,'Summing a million numbers: list 9.0 ms, array 1.0 ms','The array is about <b>9 times</b> faster.');
  })();
  /* sum with and without axis */
  (function(){
    const root=$('#c2axis'),trio=el('div','trio');root.append(trio);
    const W=230,H=200,cw=46,ch=40,A=[[1,2],[3,4]];
    const res=(x,y,vals,vert)=>vals.map((v,k)=>rect(vert?x:x+k*cw,vert?y+k*ch:y,cw,ch,PBG,PTR)+tx((vert?x:x+k*cw)+cw/2,(vert?y+k*ch:y)+ch/2+6,v,{s:17,f:PTR,w:600})).join('');
    let s=arrowM('c2s1','#bbb')+grid(70,16,A,{cw,ch,s:17,fill:()=>BBG});
    s+=line(116,106,116,128,'#bbb',1.5,' marker-end="url(#c2s1)"')+res(93,138,[10]);
    cell(trio,'a.sum()',s,W,H,'Sum of all elements: 10','Everything: 10.');
    s=arrowM('c2s2',PTR)+grid(70,16,A,{cw,ch,s:17,fill:()=>BBG});
    [0,1].forEach(j=>{const x=70+j*cw+cw/2+15;s+=line(x,22,x,126,PTR,2,' marker-end="url(#c2s2)" opacity=".85"')});
    s+=res(70,138,[4,6]);
    cell(trio,'a.sum(axis=0)',s,W,H,'Sum down each column: 4 and 6','Down each column: [4, 6].');
    s=arrowM('c2s3',PTR)+grid(30,40,A,{cw,ch,s:17,fill:()=>BBG});
    [0,1].forEach(i=>{const y=40+i*ch+ch/2+13;s+=line(34,y,150,y,PTR,2,' marker-end="url(#c2s3)" opacity=".85"')});
    s+=res(160,40,[3,7],true);
    cell(trio,'a.sum(axis=1)',s,W,H,'Sum along each row: 3 and 7','Along each row: [3, 7], returned as a 1-d array.');
  })();
  /* quarter circle from equally spaced angles */
  (function(){
    const root=$('#c2arc'),duo=el('div','duo');root.append(legend([[YEL,'plt.plot(xs, ys)'],['#fff','unit square']]),duo);
    const W=250,H=250,L0=34,B0=222,Sz=196,X=v=>L0+v*Sz,Y=v=>B0-v*Sz;
    const panel=n=>{let s=rect(X(0),Y(1),Sz,Sz,'none','#bbb');
      [0,0.5,1].forEach(v=>{s+=tx(X(v),B0+18,v,{s:12.5,f:GRAY})+(v?tx(L0-13,Y(v)+4,v,{s:12.5,f:GRAY,a:'end'}):'')});
      const pts=[];for(let k=0;k<n;k++){const t=Math.PI/2*k/(n-1);pts.push([Math.cos(t),Math.sin(t)])}
      s+='<path d="'+pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('')+'" fill="none" stroke="'+YEL+'" stroke-width="2.5"/>';
      pts.forEach(p=>{s+='<circle cx="'+X(p[0]).toFixed(1)+'" cy="'+Y(p[1]).toFixed(1)+'" r="'+(n<10?5:1.8)+'" fill="'+YEL+'"/>'});return s};
    cell(duo,'num_points = 5',panel(5),W,H,'Quarter circle drawn with 5 points: a visible polygon','5 angles: four straight segments.');
    cell(duo,'num_points = 100',panel(100),W,H,'Quarter circle drawn with 100 points: looks round','100 angles: the segments are too short to see.');
  })();
};
QZ['2a']=()=>[
  {q:'Which number does the byte 00010011 represent?',
   o:['13','19','35','11'],a:1,
   e:'The 1s sit at the places 16, 2 and 1: 16 + 2 + 1 = 19.',
   h:'Write the place values 128, 64, 32, 16, 8, 4, 2, 1 above the bits and add those under a 1.'}
];
QZ['2b']=()=>[
  {q:'A theory question of the course: why is a Python list more flexible about the types of its elements than an ndarray, and what does the array gain by giving that up?',
   o:['A list stores its values side by side with one type in the header; the array uses pointers and is slower','A list stores pointers to objects that each carry their own type; the array stores same-sized values in one contiguous block, so it needs no type checks and no jumps','A list converts all elements to strings; the array keeps them as numbers','There is no difference in memory, only in syntax'],a:1,
   e:'Each list element is a separate object reached through a pointer, so any type fits and assignment is O(1). The ndarray stores raw values of one type behind one header: faster to read and process in bulk, but homogeneous and of fixed size.',
   h:'Think of the second panel of the figure above, and of what the header of an ndarray holds.'}
];
QZ['2c']=()=>[
  {q:'An array has shape (2, 3) and is stored in row-major order. At which position of the data block, counting from 0, is <code>a[1,2]</code>?',
   o:['3','4','5','6'],a:2,
   e:'Row 0 fills positions 0 to 2; row 1 starts at 3, so column 2 of row 1 is at 3 · 1 + 2 = 5, the last of the six positions.',
   h:'Each complete row before row 1 takes 3 positions.'}
];
QZ['2d']=()=>[
  {q:'Exercise 18: you want the 4 values 0, 0.25, 0.5, 0.75: from 0 to 1 at regular steps, end point excluded. Which call gives them?',
   o:['<code>np.linspace(0, 1, 4)</code>','<code>np.arange(0, 1, 1/4)</code>','<code>np.arange(4)</code>','<code>np.linspace(0, 0.75, 3)</code>'],a:1,
   e:'arange works like range and excludes the end. <code>np.linspace(0, 1, 4)</code> includes both ends, so it gives 0, 1/3, 2/3, 1.',
   h:'One of the two constructors includes the end point, the other does not.'},
  {q:'<code>np.linspace(1.0, 2.0, 6)</code> returns six equally spaced values. What is the step between them?',
   o:['1/6','0.25','0.1','0.2'],a:3,
   e:'Both ends are included, so six values make five intervals: (2.0 − 1.0) / 5 = 0.2, giving 1.0, 1.2, 1.4, 1.6, 1.8, 2.0.',
   h:'linspace includes the end point. How many gaps are there between six points?'}
];
QZ['2']=()=>[
  {q:'An ndarray of type <code>uint32</code> has 1,000 elements. How many bytes does its data block take?',
   o:['1,000','4,000','32,000','It depends on the values'],a:1,
   e:'Each uint32 element takes 32 bits, i.e. 4 bytes, whatever its value: 1,000 · 4 = 4,000 bytes.',
   h:'A byte is 8 bits, and every element of an ndarray has the same size.'},
  {q:'Why does assignment to a Python list element cost O(1) even when the new value is much larger than the old one?',
   o:['Because Python moves all later elements very quickly','Because lists have a fixed size','Because the new object is written elsewhere in memory and only one pointer is updated','Because Python converts the value to 64 bits'],a:2,
   e:'The list holds pointers of fixed size. The new value gets its own object anywhere in memory, and only the pointer in the list changes.',
   h:'Recall what the list actually stores in its slots.'},
  {q:'In which order does column-major storage write the matrix <code>[[1,2,5],[3,14,7]]</code>?',
   o:['1, 3, 2, 14, 5, 7','1, 2, 5, 3, 14, 7','7, 14, 3, 5, 2, 1','1, 14, 2, 7, 3, 5'],a:0,
   e:'Column by column: first column 1, 3, then 2, 14, then 5, 7.',
   h:'Go down the first column, then the second, then the third.'},
  {q:'<code>a = np.array([[1,2],[3,4]])</code>. What is <code>a.sum(axis=0)</code>?',
   o:['10','[3, 7]','[1, 2]','[4, 6]'],a:3,
   e:'Summing along axis 0 combines the two rows, one column at a time: 1 + 3 = 4 and 2 + 4 = 6. Axis 0 disappears from the result.',
   h:'Axis 0 runs over the rows. Which entries are combined when you move along it?'},
  {q:'<code>a = np.zeros((3,3)); a.fill(5)</code>. What is <code>a[0,0]</code>?',
   o:['5, an integer','5.0, a float','An error: 5 is not a float','0.0'],a:1,
   e:'zeros builds a float array by default, and fill converts the value to the type of the array: 5 becomes 5.0.',
   h:'Which default type does np.zeros use, and what does fill do with a value of another type?'},
  {q:'According to the notes, what does the single header of a 2-d numpy array hold?',
   o:['Only the length and the type','The type, the size (total entries), the number of dimensions and the shape','A pointer to each row','The values of the first row'],a:1,
   e:'With all data in one contiguous block, the header needs the type, the total size, dim = 2 and the shape (rows, columns).',
   h:'In 1-d the header had length and type. What more is needed to read a table out of a single row of values?'}
];

/* Lesson 3: Monte Carlo pi, broadcasting, indexing, views and copies */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  const BBG='rgba(88,196,221,.14)',PBG='rgba(220,117,205,.2)',TBG='rgba(92,208,179,.2)',OBG='rgba(255,134,47,.2)',RBG='rgba(252,98,85,.22)';
  /* Monte Carlo estimate of pi with a slider on the number of points */
  (function(){
    const root=$('#c3mc'),N=10000,rnd=lcg(31415),P=new Float64Array(2*N),cum=new Int32Array(N+1);
    for(let i=0;i<N;i++){P[2*i]=rnd();P[2*i+1]=rnd();cum[i+1]=cum[i]+(P[2*i]*P[2*i]+P[2*i+1]*P[2*i+1]<=1?1:0)}
    root.append(legend([[BLUE,'inside: x² + y² ≤ 1','dot'],['#777','outside','dot'],[YEL,'quarter circle']]));
    const box=el('div');box.style.cssText='width:100%;max-width:24rem';const cv=el('canvas');cv.width=720;cv.height=720;
    cv.style.cssText='width:100%;height:auto;display:block';cv.setAttribute('role','img');cv.setAttribute('aria-label','Random points in the unit square, coloured by whether they fall inside the quarter circle');
    box.append(cv);root.append(box);const o=out();
    const ctx=cv.getContext('2d'),m=56,S=720-2*m;
    function draw(n){
      if(!ctx)return;ctx.fillStyle='#000';ctx.fillRect(0,0,720,720);
      const r=n<=100?8:n<=1000?4.5:2.6;
      for(let i=0;i<n;i++){const x=P[2*i],y=P[2*i+1];ctx.fillStyle=x*x+y*y<=1?BLUE:'#6a6a6a';ctx.beginPath();ctx.arc(m+x*S,m+S-y*S,r,0,2*Math.PI);ctx.fill()}
      ctx.strokeStyle='#bbb';ctx.lineWidth=2;ctx.strokeRect(m,m,S,S);
      ctx.strokeStyle=YEL;ctx.lineWidth=5;ctx.beginPath();ctx.arc(m,m+S,S,-Math.PI/2,0);ctx.stroke();
      ctx.fillStyle='#8c8c8c';ctx.font='26px Figtree, system-ui, sans-serif';ctx.textAlign='center';
      [0,0.5,1].forEach(v=>{ctx.fillText(String(v),m+v*S,m+S+34)});ctx.textAlign='right';[0.5,1].forEach(v=>{ctx.fillText(String(v),m-18,m+S-v*S+9)});
      const nin=cum[n],est=4*nin/n;
      o.innerHTML=K('\\Npts')+' = '+fk(n)+' points, '+K('\\Nin')+' = '+fk(nin)+' inside: '+K('\\piest = 4\\cdot '+nin+'/'+n+' = '+est.toFixed(4))+', off by <span class="num">'+Math.abs(est-Math.PI).toFixed(4)+'</span> from π.';
    }
    const nOf=k=>Math.round(Math.pow(10,1+k/10));
    root.append(sld('number of points n',0,30,1,20,k=>draw(nOf(k)),k=>fk(nOf(k))),o);draw(nOf(20));
  })();
  /* the vectorized line on eight points */
  (function(){
    const px=[0.12,0.85,0.40,0.93,0.55,0.20,0.71,0.66],py=[0.30,0.62,0.77,0.45,0.18,0.95,0.60,0.40];
    const r2=px.map((x,i)=>x*x+py[i]*py[i]),ins=r2.map(v=>v<=1),k=ins.filter(Boolean).length;
    const lx=200,cw=58,ch=34,y0_=34,W=lx+8*cw+14,H=y0_+4*ch+86;let s='';
    for(let j=0;j<8;j++)s+=tx(lx+j*cw+cw/2,22,'point '+(j+1),{s:12.5,f:GRAY});
    const rows=[['pxs',px.map(v=>v.toFixed(2)),()=>'#eee'],['pys',py.map(v=>v.toFixed(2)),()=>'#eee'],['pxs**2 + pys**2',r2.map(v=>v.toFixed(3)),()=>'#eee'],['… &lt;= 1',ins.map(b=>b?'True':'False'),j=>ins[j]?BLUE:'#8a8a8a']];
    rows.forEach((r,i)=>{const y=y0_+i*ch;s+=mono(lx-12,y+ch/2+5,r[0],{s:13.5,a:'end',f:'#fff'});
      r[1].forEach((v,j)=>{s+=rect(lx+j*cw,y,cw,ch,i===3?(ins[j]?BBG:'#111'):'#0d0d0d','#3a3a3a')+mono(lx+j*cw+cw/2,y+ch/2+5,v,{s:13,a:'middle',f:r[2](j)})})});
    const yb=y0_+4*ch+30;
    s+=mono(lx-12,yb,'np.sum(…)',{s:13.5,a:'end',f:'#fff'})+tx(lx,yb,'→ '+k+'  (each True counts as 1)',{s:14,a:'start',f:PTR})+
      mono(lx-12,yb+32,'4 * ninside / n_mc',{s:13.5,a:'end',f:'#fff'})+tx(lx,yb+32,'→ 4 · '+k+' / 8 = '+(4*k/8).toFixed(1),{s:14,a:'start',f:YEL});
    svgBox($('#c3mask'),W,H,s,'Eight points, their squared distance, the boolean comparison and the count','44rem');
  })();
  /* element-wise: same shape, and a function applied to each cell */
  (function(){
    const root=$('#c3same'),duo=el('div','duo');root.append(legend([[ARR,'first operand','box'],[LST,'second operand','box'],[PTR,'result','box']]),duo);
    const A=[[3,4,0],[1,2,2]],B=[[1,3,2],[2,5,1]],C=A.map((r,i)=>r.map((v,j)=>v*B[i][j]));
    const W=380,H=128,gy=30;
    let s=grid(8,gy,A,{f:ARR})+tx(124,gy+36,'*',{s:22,f:'#fff'})+grid(138,gy,B,{f:LST})+tx(254,gy+37,'=',{s:22,f:'#fff'})+grid(270,gy,C,{f:PTR,fill:()=>PBG});
    s+=tx(59,gy+84,'(2, 3)',{s:12.5,f:GRAY})+tx(189,gy+84,'(2, 3)',{s:12.5,f:GRAY})+tx(321,gy+84,'(2, 3)',{s:12.5,f:GRAY});
    cell(duo,'a * b, same shape',s,W,H,'Element-wise product of two 2 by 3 arrays','Cell by cell, e.g. 4 · 3 = 12. Not a matrix product.');
    const D=[[2,4,1],[1,2,2]],E=D.map(r=>r.map(v=>Math.log2(v).toFixed(1)));
    s=mono(8,gy+36,'np.log2(',{s:15,f:'#fff'})+grid(92,gy,D,{f:ARR})+mono(196,gy+36,')',{s:15,f:'#fff'})+tx(226,gy+37,'=',{s:22,f:'#fff'})+grid(244,gy,E,{f:PTR,fill:()=>PBG,cw:40});
    cell(duo,'np.log2(a), one function per cell',s,W,H,'log2 applied to each element of a 2 by 3 array','Each cell separately, e.g. log2(4) = 2.0.');
  })();
  /* three broadcasting cases: scalar, row, column */
  (function(){
    const root=$('#c3bc');root.append(legend([[ARR,'first operand','box'],[LST,'second operand','box'],['#777','virtual copy, never stored','dash'],[PTR,'result','box']]));
    const a=[[3,4,0],[1,2,2]],W=640,rh=114,gA=196,gB=342,gC=500;let s='';
    const rows=[
      {lab:'a * 3',sub:'3 is a scalar',A:a,dA:()=>false,B:[[3,3,3],[3,3,3]],dB:(i,j)=>i||j,shA:'(2, 3)',shB:'scalar → (2, 3)'},
      {lab:'a * b',sub:'b = [2, 4, 0]',A:a,dA:()=>false,B:[[2,4,0],[2,4,0]],dB:i=>i>0,shA:'(2, 3)',shB:'(3,) → (2, 3)'},
      {lab:'c * b',sub:'c = [[3], [1]]',A:[[3,3,3],[1,1,1]],dA:(i,j)=>j>0,B:[[2,4,0],[2,4,0]],dB:i=>i>0,shA:'(2, 1) → (2, 3)',shB:'(3,) → (2, 3)'}];
    rows.forEach((r,k)=>{const y=18+k*rh,C=r.A.map((row,i)=>row.map((v,j)=>v*r.B[i][j]));
      s+=mono(10,y+26,r.lab,{s:16,f:'#fff'})+mono(10,y+48,r.sub,{s:13,f:GRAY});
      s+=grid(gA,y,r.A,{f:ARR,dash:r.dA})+tx(gA+122,y+36,'*',{s:22,f:'#fff'})+grid(gB,y,r.B,{f:LST,dash:r.dB})+tx(gB+124,y+37,'=',{s:22,f:'#fff'})+grid(gC,y,C,{f:PTR,fill:()=>PBG});
      s+=tx(gA+51,y+82,r.shA,{s:12.5,f:GRAY})+tx(gB+51,y+82,r.shB,{s:12.5,f:GRAY})+tx(gC+51,y+82,'(2, 3)',{s:12.5,f:GRAY});
      if(k<2)s+=line(10,y+rh-12,W-10,y+rh-12,'#1f1f1f',1)});
    svgBox(root,W,18+3*rh-10,s,'Broadcasting a scalar, a row and a column against a 2 by 3 array','44rem');
  })();
  /* the general rules: align on the right, pad, stretch */
  (function(){
    const root=$('#c3rules'),duo=el('div','duo');root.append(legend([[HDR,'padded size 1','box'],[VW,'size 1 stretched','box'],[PTR,'result','box'],[RED,'incompatible','box']]),duo);
    const W=330,H=244,cx=128,cw=56,ch=32;
    const c=(col,row,v,o)=>{o=o||{};const x=cx+col*cw,y=22+row*54;return rect(x,y,cw-6,ch,o.bg||'#0d0d0d',o.st||'#555')+tx(x+(cw-6)/2,y+ch/2+5,v,{s:15,f:o.f||'#eee'})+(o.note?tx(x+(cw-6)/2,y+ch+13,o.note,{s:13,f:o.nf||VW}):'')};
    const lab=(row,t)=>mono(cx-12,22+row*54+ch/2+5,t,{s:13.5,a:'end',f:'#fff'});
    let s=lab(0,'a')+c(0,0,3)+c(1,0,2)+c(2,0,1,{bg:TBG,st:VW,f:VW,note:'→ 4'});
    s+=lab(1,'b')+c(1,1,2)+c(2,1,4);
    s+=lab(2,'b padded')+c(0,2,1,{bg:OBG,st:HDR,f:HDR,note:'→ 3'})+c(1,2,2)+c(2,2,4);
    s+=lab(3,'a + b')+c(0,3,3,{bg:PBG,st:PTR,f:PTR})+c(1,3,2,{bg:PBG,st:PTR,f:PTR})+c(2,3,4,{bg:PBG,st:PTR,f:PTR});
    cell(duo,'(3, 2, 1) + (2, 4)',s,W,H,'Shapes 3,2,1 and 2,4 broadcast to 3,2,4','<span class="ok">Works:</span> result shape (3, 2, 4).');
    s=lab(0,'a')+c(1,0,2)+c(2,0,3,{bg:RBG,st:RED,f:RED});
    s+=lab(1,'b')+c(2,1,2,{bg:RBG,st:RED,f:RED});
    s+=lab(2,'b padded')+c(1,2,1,{bg:OBG,st:HDR,f:HDR,note:'→ 2'})+c(2,2,2,{bg:RBG,st:RED,f:RED});
    s+=lab(3,'a + b')+c(1,3,2,{bg:PBG,st:PTR,f:PTR})+c(2,3,'✕',{bg:RBG,st:RED,f:RED});
    cell(duo,'(2, 3) + (2,)',s,W,H,'Shapes 2,3 and 2 cannot be broadcast','<span class="bad">Error:</span> 3 and 2 on the last axis, neither is 1.');
  })();
  /* scaling analysis of the Monte Carlo estimate */
  (function(){
    const root=$('#c3scale'),duo=el('div','duo');root.append(legend([[BLUE,'mean ± one standard deviation'],[RED,'π ± 1.7/√n'],['#fff','π','dash']]),duo);
    const gam=x=>Math.abs(x-1)<1e-9?1:Math.abs(x-0.5)<1e-9?Math.sqrt(Math.PI):(x-1)*gam(x-1);
    const est=(n,d,rnd)=>{let k=0;for(let i=0;i<n;i++){let q=0;for(let t=0;t<d;t++){const u=rnd();q+=u*u}if(q<=1)k++}
      return k?Math.pow(Math.pow(2,d)*gam(d/2+1)*k/n,2/d):0};
    const stats=v=>{const m=v.reduce((a,b)=>a+b,0)/v.length,sd=Math.sqrt(v.reduce((a,b)=>a+(b-m)*(b-m),0)/v.length);return [m,sd]};
    const rnd=lcg(2718);
    const ns=[];for(let k=0;k<8;k++)ns.push(Math.round(Math.pow(10,2+3*k/7)));
    const r1_=ns.map(n=>stats(Array.from({length:50},()=>est(n,2,rnd))));
    const ds=[2,3,4,5,6,7,8,9,10],r2_=ds.map(d=>stats(Array.from({length:10},()=>est(10000,d,rnd))));
    const W=330,H=262,L0=50,R0=W-12,T0=12,B0=H-48,ylo=2.7,yhi=3.6,Y=v=>B0-(clamp(v,ylo,yhi)-ylo)/(yhi-ylo)*(B0-T0);
    const frame=(xt,xl)=>{let s='';[2.8,3,3.2,3.4,3.6].forEach(v=>{s+=line(L0,Y(v),R0,Y(v),'#1c1c1c',1)+tx(L0-7,Y(v)+4.5,v.toFixed(1),{s:12.5,f:GRAY,a:'end'})});
      xt.forEach(([x,t])=>{s+=tx(x,B0+18,t,{s:12.5,f:GRAY})});
      s+='<path d="M'+L0+' '+T0+'V'+B0+'H'+R0+'" fill="none" stroke="#fff" stroke-width="1.3"/>'+line(L0,Y(Math.PI),R0,Y(Math.PI),'#fff',1.2,' stroke-dasharray="5 4" opacity=".75"');
      return s+tx((L0+R0)/2,H-8,xl,{s:13,f:GRAY})+tx(14,(T0+B0)/2,'estimate of π',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T0+B0)/2+')"'})};
    const bar=(x,[m,sd])=>line(x,Y(m-sd),x,Y(m+sd),BLUE,2.2)+line(x-4,Y(m-sd),x+4,Y(m-sd),BLUE,2)+line(x-4,Y(m+sd),x+4,Y(m+sd),BLUE,2)+'<circle cx="'+x.toFixed(1)+'" cy="'+Y(m).toFixed(1)+'" r="3.8" fill="'+BLUE+'"/>';
    const X1=n=>L0+12+(Math.log10(n)-2)/3*(R0-L0-24);
    let s=frame([[X1(100),'100'],[X1(1000),'1,000'],[X1(10000),'10,000'],[X1(100000),'100,000']],'number of points n (log scale)');
    [1,-1].forEach(sg=>{const pts=[];for(let k=0;k<=60;k++){const n=Math.pow(10,2+3*k/60);pts.push(X1(n).toFixed(1)+' '+Y(Math.PI+sg*1.7/Math.sqrt(n)).toFixed(1))}s+='<path d="M'+pts.join('L')+'" fill="none" stroke="'+RED+'" stroke-width="1.8"/>'});
    ns.forEach((n,k)=>{s+=bar(X1(n),r1_[k])});
    cell(duo,'d = 2, more and more points',s,W,H,'Mean and spread of the estimate of pi as the number of points grows','Bars shrink like 1/√n.');
    const X2=d=>L0+14+(d-2)/8*(R0-L0-28);
    s=frame(ds.map(d=>[X2(d),String(d)]),'dimension d (n = 10,000)');
    ds.forEach((d,k)=>{s+=bar(X2(d),r2_[k])});
    cell(duo,'n = 10,000, more and more dimensions',s,W,H,'Mean and spread of the estimate of pi as the dimension grows','Bars grow with d: fewer points fall inside.');
  })();
  /* views and copies: the same write into three kinds of result */
  (function(){
    const root=$('#c3view'),trio=el('div','trio');root.append(legend([[VW,'view: shares the data of a','box'],[ARR,'independent copy','box'],[PTR,'the value written','box']]),trio);
    const W=250,H=214,cw=40,ax=25,ay=40,bx=65,by=150,ch=32;
    const panel=(view,mask,id)=>{let s='';const A=[0,1,view?999:2,3,4],src=[0,2,4];
      src.forEach((j,k)=>{const x1=bx+k*cw+cw/2,x2=ax+j*cw+cw/2;
        s+=view?line(x1,by,x2,ay+ch,VW,2):line(x2,ay+ch+(mask?22:4),x1,by-4,'#555',1.3,' stroke-dasharray="4 4"')});
      s+=mono(ax-8,ay+ch/2+5,'a',{s:15,a:'end',f:'#fff'});
      A.forEach((v,j)=>{const hit=view&&j===2;s+=rect(ax+j*cw,ay,cw,ch,hit?TBG:'#0d0d0d',hit?VW:'#555')+tx(ax+j*cw+cw/2,ay+ch/2+5,v,{s:v>99?12.5:15,f:hit?VW:'#eee',w:hit?600:null})});
      if(mask)'TFTFT'.split('').forEach((t,j)=>{s+=mono(ax+j*cw+cw/2,ay+ch+17,t,{s:13,a:'middle',f:t==='T'?BLUE:'#777'})});
      s+=mono(bx-8,by+ch/2+5,'b',{s:15,a:'end',f:'#fff'});
      [0,999,4].forEach((v,k)=>{const w=k===1;s+=rect(bx+k*cw,by,cw,ch,w?PBG:(view?TBG:BBG),w?PTR:(view?VW:ARR))+tx(bx+k*cw+cw/2,by+ch/2+5,v,{s:v>99?12.5:15,f:w?PTR:'#eee',w:w?600:null})});
      s+=mono(W/2,by+ch+26,'b[1] = 999',{s:13,a:'middle',f:'#bbb'});
      return s};
    cell(trio,'b = a[0:5:2]',panel(true,false),W,H,'A slice is a view: writing into b changes a','<span style="color:var(--teal);font-weight:600">View:</span> <code>b.base is a</code>. Now <code>a[2]</code> is 999.');
    cell(trio,'b = a[[0, 2, 4]]',panel(false,false),W,H,'Indexing with a list copies: a is unchanged','<b>Copy:</b> <code>b.base</code> is None. <code>a</code> is unchanged.');
    cell(trio,'b = a[a % 2 == 0]',panel(false,true),W,H,'Indexing with a mask copies: a is unchanged','<b>Copy:</b> the mask picks 0, 2, 4. <code>a</code> is unchanged.');
  })();
};
QZ['3a']=()=>[
  {q:'<code>v = np.array([3, -1, 2, 5])</code>. What does <code>np.sum(v &gt; 0)</code> give?',
   o:['9','[True, False, True, True]','3','4'],a:2,
   e:'<code>v &gt; 0</code> is [True, False, True, True]; summing booleans counts the Trues: 3.',
   h:'First work out the boolean array, then remember what True and False are worth in a sum.'}
];
QZ['3b']=()=>[
  {q:'Exercise 5 of the course: you rebuilt an array <code>b</code> of length 6 and want to check that it equals the original <code>a</code>. Which check works?',
   o:['<code>assert a == b</code>','<code>assert a is b</code>','<code>assert np.array_equal(a, b)</code>','<code>assert a + b</code>'],a:2,
   e:'<code>a == b</code> broadcasts and returns six booleans, which assert cannot turn into one truth value (numpy raises an error). <code>a is b</code> asks whether they are the same object, which they are not. <code>np.array_equal</code>, or <code>np.all(a == b)</code>, compares the whole arrays.',
   h:'What kind of object does <code>==</code> return when both sides are arrays?'}
];
QZ['3c']=()=>[
  {q:'Arrays with shapes (4, 1) and (3,) are added. What is the shape of the result?',
   o:['(4, 1)','(4, 3)','(3, 4)','An error'],a:1,
   e:'(3,) is padded to (1, 3). Axis 0: 4 and 1, so 4. Axis 1: 1 and 3, so 3. Result (4, 3), like the column times row case in the figure.',
   h:'Align the shapes on the right and pad the shorter one with 1 at the front.'}
];
QZ['3d']=()=>[
  {q:'With n = 10,000 points, why does the estimate of π get worse as the dimension d grows?',
   o:['Because the formula for the volume of the ball is wrong for large d','Because random numbers are less random in many dimensions','Because numpy overflows when d is large','Because the fraction of the cube inside the ball shrinks fast, so very few points are inside to count'],a:3,
   e:'The fraction is V<sub>d</sub>/2<sup>d</sup>: about 0.79 for d = 2 but 0.0025 for d = 10, about 25 points out of 10,000. A count of 25 fluctuates a lot, and the estimate with it.',
   h:'Compare how many of the 10,000 points fall inside the ball in 2 and in 10 dimensions.'}
];
QZ['3e']=()=>[
  {q:'A theory question of the course: <code>x = np.arange(10)</code>, <code>y = x[[1,3,5,7,9]]</code>, <code>z = x[1::2]</code>. What is the main difference between <code>y</code> and <code>z</code>?',
   o:['They hold different values','<code>y</code> is a view and <code>z</code> a copy','<code>y</code> has 5 elements and <code>z</code> has 4','They hold the same values, but <code>y</code> is an independent copy and <code>z</code> is a view of <code>x</code>'],a:3,
   e:'Both contain 1, 3, 5, 7, 9. Indexing with a list gives independent data; the slice gives a view, so writing into <code>z</code> changes <code>x</code>.',
   h:'Look at the rules table: which kind of index produces a view?'}
];
QZ['3f']=()=>[
  {q:'A theory question of the course: <code>y</code> is a view of <code>x</code>. How can you check it, and what happens to <code>x</code> if you change an element of <code>y</code>?',
   o:['<code>y.base is x</code> is True, and the change also appears in <code>x</code>','<code>y == x</code> is True, and <code>x</code> does not change','<code>y.copy() is x</code>, and the change appears in <code>x</code>','<code>x.base is y</code> is True, and <code>x</code> does not change'],a:0,
   e:'A view stores a reference to the array it views in <code>.base</code>. Since it shares the data, writing into the view writes into the original.',
   h:'Which attribute points from a view to the array that owns the data?'}
];
QZ['3g']=()=>[
  {q:'Exercise 4: which of these does <em>not</em> build an integer array of length <code>n</code> filled with −1?',
   o:['<code>np.full(n, -1)</code>','<code>-np.ones(n, dtype=int)</code>','<code>np.array([-1]) * n</code>','<code>np.zeros(n, dtype=int) - 1</code>'],a:2,
   e:'<code>np.array([-1]) * n</code> multiplies the single element by n, giving the one-element array [−n]. The other three are among the ways in the official solution: a dedicated constructor, a negation, and a broadcast subtraction.',
   h:'For an array, <code>*</code> with a number is not repetition, as it would be for a list.'},
  {q:'Exercise 7: <code>a = np.array([4, 3, 6, 8, 9])</code>, <code>n = 5</code>. Which single slice gives the first half in reverse, [3, 4]? (With n odd the middle element belongs to the second half.)',
   o:['<code>a[:n//2:-1]</code>','<code>a[(n//2-1)::-1]</code>','<code>a[n//2::-1]</code>','<code>a[::-1][:n//2]</code>'],a:1,
   e:'With a negative step you start from the last element of the first half, index n//2 − 1 = 1, and go down to the beginning: [3, 4]. <code>a[n//2::-1]</code> would include the middle 6, and the other two read from the end of the array.',
   h:'With step −1 the start index is the first element you get. Which index is the last element of the first half?'},
  {q:'Exercise 8: <code>x = np.array([4, 6, 1])</code>. What is <code>x[[2, 0, 1, 0, 0, 1]]</code>?',
   o:['An error: the index list is longer than the array','[1, 4, 6]','[1, 4, 6, 4, 4, 6]','[4, 6, 1, 4, 6, 1]'],a:2,
   e:'Each entry of the index list picks one element, repetitions included, so the result has 6 elements: x[2], x[0], x[1], x[0], x[0], x[1].',
   h:'Indexing with a list builds a new array with one element per entry of the list.'},
  {q:'Exercise 12: <code>a = np.zeros(5, dtype=int)</code>, then <code>a[0] = 5.7</code>. What is <code>a[0]</code>?',
   o:['5','5.7','6','An error'],a:0,
   e:'The array keeps its integer type, so the float is converted on assignment by dropping the decimal part: 5, as in the official solution. The array does not change type to fit the value.',
   h:'Can an assignment change the dtype of an existing array?'},
  {q:'Exercise 15: which line makes every element of <code>a</code> non-negative, using masks both to read and to assign?',
   o:['<code>a = a[a &gt;= 0]</code>','<code>a[a &lt; 0] = 0</code>','<code>a = -a</code>','<code>mask = a &lt; 0; a[mask] = -a[mask]</code>'],a:3,
   e:'The mask marks the negative entries; <code>-a[mask]</code> reads them and flips their sign, and the assignment writes them back in the same places. The first option drops elements, the second changes values, the third flips the positive ones too.',
   h:'You want to keep every element and its size, and only change the sign of some.'}
];
QZ['3']=()=>[
  {q:'Exercise 16 of the course: <code>a = np.zeros(7)</code>, then <code>a[1::2] = 1</code>. What is <code>a</code>?',
   o:['[1, 0, 1, 0, 1, 0, 1]','[0, 1, 0, 1, 0, 1, 0]','[0, 1, 1, 1, 1, 1, 1]','An error: 1 is a scalar and the slice has 3 elements'],a:1,
   e:'<code>1::2</code> selects the odd positions 1, 3, 5; the scalar 1 is broadcast into all of them (and converted to 1.0).',
   h:'Which positions does <code>1::2</code> select in an array of length 7? And can a scalar be assigned to several cells at once?'},
  {q:'Exercise 11 of the course: <code>s = np.random.rand(10)</code> and <code>a[s &lt; 0.3]</code> picks elements of a length-10 array. Over many calls, what is the average length of the result?',
   o:['0.3','10','7','3'],a:3,
   e:'Each element is kept with probability 0.3, so the expected length is n · r = 10 · 0.3 = 3.',
   h:'A uniform number in [0, 1) is below 0.3 with probability 0.3.'},
  {q:'<code>x = np.arange(10)</code>, <code>z = x[::-1]</code>, <code>z[0] = 100</code>. What is <code>x[9]</code>?',
   o:['9','100','0','An error'],a:1,
   e:'<code>x[::-1]</code> is a slice, so a view that reads <code>x</code> backwards. <code>z[0]</code> is the same memory as <code>x[9]</code>, which becomes 100.',
   h:'Is a reversed slice a view or a copy? Which element of x does z[0] point to?'},
  {q:'Exercise 23 of the course: <code>t = np.arange(5) + np.arange(3).reshape(3,1)</code>. What is <code>t[2,4]</code>?',
   o:['6','8','4','2'],a:0,
   e:'Shapes (5,) and (3, 1) broadcast to (3, 5), and <code>t[i,j] = j + i</code>. So <code>t[2,4]</code> = 4 + 2 = 6.',
   h:'Work out the shape first, then which numbers are added in row 2, column 4.'},
  {q:'You estimate π in 2 dimensions with n = 10,000 points. Following the solution\'s curves, about how far from π is a typical estimate?',
   o:['about 0.17','about 0.0017','about 0.017','about 1.7'],a:2,
   e:'The spread is about 1.7/√n = 1.7/100 = 0.017.',
   h:'The red curves in the scaling figure give the typical spread as a function of n.'},
  {q:'What does <code>np.sqrt(-2.0)</code> do?',
   o:['Raises an error, like math.sqrt','Returns nan and prints a RuntimeWarning','Returns the complex number 1.414j','Returns −1.414'],a:1,
   e:'numpy returns nan (not a number) with a warning instead of stopping. That is why the slides insist: never ignore warnings.',
   h:'numpy prefers not to stop the program when a value falls outside a function\'s domain. What special value could it return instead?'}
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
