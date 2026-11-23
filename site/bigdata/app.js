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
/* quiz a scelta multipla: si sceglie, poi «Verifica».
   La risposta verificata resta salvata in questo browser (localStorage) e alla visita successiva ricompare già verificata;
   la chiave contiene materia, quiz e domanda, più un'impronta del testo, così una domanda riscritta non eredita la vecchia risposta. */
const quizKey=(root,i,q)=>{let h=5381;for(const c of q.q+'|'+q.o.join('|'))h=(h*33^c.charCodeAt(0))>>>0;
  return 'quiz|'+(location.pathname.split('/').filter(Boolean)[0]||'')+'|'+(root.dataset.quiz||'')+'|'+i+'|'+h.toString(36)};
function quiz(root,qs){
  qs.forEach((q,qi)=>{
    const box=el('div','q');box.append(el('p','',q.q));
    const opts=el('div','opts'),fb=el('div','fb'),chk=btn(UI.check);chk.classList.add('solid','chk');fb.setAttribute('aria-live','polite');
    let sel=null;const key=quizKey(root,qi,q);
    const bsq=q.o.map((t,i)=>{const b=btn(t,true);b.onclick=()=>{sel=i;bsq.forEach((x,j)=>{press(x,j===i);x.classList.remove('right','wrong')});fb.innerHTML=''};opts.append(b);return b});
    const verify=save=>{if(sel===null){fb.innerHTML=UI.pickFirst;return}
      press(bsq[sel],false);bsq[sel].classList.add(sel===q.a?'right':'wrong');box.classList.add('done');
      fb.innerHTML=sel===q.a?'<b>'+UI.right+'</b> '+q.e:'<b>'+UI.wrong+'</b> '+q.h;
      if(save)try{localStorage.setItem(key,String(sel))}catch(e){}};
    chk.onclick=()=>verify(true);
    box.append(opts,chk,fb);root.append(box);
    let v=null;try{v=localStorage.getItem(key)}catch(e){}
    if(v!==null&&+v>=0&&+v<bsq.length){sel=+v;verify(false)}
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


/* Big Data and Databases, versione italiana: l'interfaccia usa i testi italiani di core.js; piccoli strumenti di disegno comuni alle lezioni.
   La versione inglese sta in en/js/macro.js: le due copie vanno tenute allineate. */
/* colour roles of this subject: primary key YEL, foreign key PINK, conditions ORG, NULL PUR, measures BLUE, windows TEAL, accepted GRN, rejected RED */
const PKC=YEL,FKC=PINK,PRC=ORG,NLC=PUR,MSC=BLUE,WNC=TEAL;
Object.assign(MAC,{'\\kk':col(BLUE,'k'),'\\qv':col(ORG,'q'),'\\vb':col(BLUE,'v')});
/* numeri: fe con il punto decimale, come li scrivono SQL e Spark (codice, contenuto delle tabelle, risultati delle query);
   fi con la virgola decimale e il punto delle migliaia dalle cinque cifre in su, per testo, report, assi e note in italiano */
const fe=(v,d)=>{if(v===null||v===undefined)return 'NULL';const p=Math.pow(10,d===undefined?2:d);return String(Math.round(v*p)/p)};
const fi=(v,d)=>{if(v===null||v===undefined)return 'NULL';const p=Math.pow(10,d===undefined?2:d),r=Math.round(v*p)/p,[i,f]=String(Math.abs(r)).split('.');
  return (r<0?'−':'')+(i.length>4?i.replace(/\B(?=(\d{3})+(?!\d))/g,'.'):i)+(f?','+f:'')};
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
const verdict=(ok,t)=>'<span class="'+(ok?'ok':'bad')+'">'+(ok?'Accettato.':'Rifiutato.')+'</span> '+t;
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

/* Lezione 1: l'evoluzione dell'analisi dei dati */
const ERP1=[[1,'ROSSI MARCO','Milano',0],[2,'DOE JOHN','London',1],[3,'SMITH MARK','Liverpool',2],[4,'JANE MARY','London',3],[5,'BIANCHI MARIO','Roma',4]];
const CRM1=[[101,'Marco','Rossi','Milan',0],[102,'John','Doe','LONDON',1],[103,'Mary','Jane','Manchester',3],[104,'Mary','Jane','London',3],[105,'Mark','Smith','Liverpool',2],[106,'Mario','Bianchi','Rome',4]];
INIT[1]=function(){
  codeHL($('#lezione-1'));
  /* two systems, one customer base */
  (function(){
    const duo=el('div','duo');$('#b1src').append(duo);
    const t1=sTab(6,6,[{t:'id',w:34,a:'e'},{t:'nominativo',w:130},{t:'città',w:88}],ERP1.map(r=>[r[0],r[1],r[2]==='Milano'?{v:r[2],bg:BADBG}:r[2]]));
    cell(duo,'Sistema delle vendite (ERP)',t1.s,t1.w+12,t1.h+12,'Tabella clienti dell\'ERP','Cercando la città \'Milan\' si trovano <span class="bad">0</span> clienti. Contando i record si ottiene 5.');
    const t2=sTab(6,6,[{t:'id',w:40,a:'e'},{t:'nome',w:58},{t:'cognome',w:74},{t:'città',w:92}],CRM1.map(r=>[r[0],r[1],r[2],r[0]===103?{v:r[3],bg:BADBG}:r[3]]),{bg:i=>CRM1[i][4]===3?HLBG:null});
    cell(duo,'Sistema dei clienti (CRM)',t2.s,t2.w+12,t2.h+12,'Tabella contatti del CRM','Cercando \'Milan\' se ne trova 1. Contando i record si ottiene <span class="bad">6</span>: Mary Jane compare due volte, in due città.');
  })();
  /* linea del tempo: cinque fasi, uno strato ciascuna */
  (function(){
    const ph=[['anni Ottanta','DB operativi','Report statici'],['anni Novanta','Data warehouse','Report statici'],['fine anni Novanta','OLAP','Report dinamici'],['anni Duemila','Data mining','Analisi predittiva'],['dal 2012','Hadoop, Spark','Piattaforme Big Data']];
    let s=line(20,206,680,206,'#555',2);
    ph.forEach((p,k)=>{const cx=70+k*140;
      for(let j=0;j<=k;j++){const y=170-j*32,top=j===k;
        s+=rect(cx-62,y,124,28,top?'#6db9f4':'#17303d',top?'#6db9f4':'#2c5468')+tx(cx,y+19,ph[j][1],{s:13,f:top?'#000':'#cfe6f5'})}
      s+='<circle cx="'+cx+'" cy="206" r="6" fill="#6db9f4"/>'+tx(cx,232,'Fase '+(k+1),{s:14,f:'#fff',w:500})+tx(cx,252,p[0],{s:13,f:GRAY})+tx(cx,272,p[2],{s:13,f:GRAY})});
    svgBox($('#b1time'),700,284,s,'Cinque fasi dell\'evoluzione dell\'analisi dei dati, ognuna aggiunge uno strato','44rem');
  })();
  /* tre report delle stesse sei vendite */
  (function(){
    const trio=el('div','trio');$('#b1rep').append(trio);
    const rows=SAL.map(r=>({d:r[1],p:r[3],q:r[4],a:r[4]*r[5]}));const days=[...new Set(rows.map(r=>r.d))];
    const sh=d=>d.slice(8)+'/'+d.slice(5,7);
    const op=[];days.forEach(d=>{const ds=rows.filter(r=>r.d===d);ds.forEach(r=>op.push([sh(r.d),r.p,r.q,{v:fi(r.a),f:MSC}]));
      op.push([{v:sh(d),f:GRAY},{v:'totale',f:GRAY},{v:ds.reduce((a,r)=>a+r.q,0),f:GRAY},{v:fi(ds.reduce((a,r)=>a+r.a,0)),f:MSC,b:1}])});
    const C4=[{t:'data',w:56},{t:'prodotto',w:66},{t:'qtà',w:38,a:'e'},{t:'importo',w:66,a:'e'}];
    let t=sTab(4,4,C4,op,{bg:i=>(i%3===2)?HLBG:null,fs:13});cell(trio,'Operativo',t.s,t.w+8,t.h+8,'Report operativo','Ogni vendita più i subtotali giornalieri: 9 righe. Prodotto ogni giorno.');
    const ta=days.map(d=>{const ds=rows.filter(r=>r.d===d);return [sh(d),ds.length,ds.reduce((a,r)=>a+r.q,0),{v:fi(ds.reduce((a,r)=>a+r.a,0)),f:MSC}]});
    t=sTab(4,4,[{t:'data',w:56},{t:'vendite',w:56,a:'e'},{t:'qtà',w:44,a:'e'},{t:'importo',w:66,a:'e'}],ta,{fs:13});cell(trio,'Tattico',t.s,t.w+8,t.h+8,'Report tattico','Una riga al giorno: 3 righe. Prodotto ogni giorno o ogni settimana.');
    t=sTab(4,4,[{t:'periodo',w:70},{t:'vendite',w:56,a:'e'},{t:'qtà',w:36,a:'e'},{t:'importo',w:66,a:'e'}],[['set 2018',6,26,{v:'43,4',f:MSC}]],{fs:13});cell(trio,'Strategico',t.s,t.w+8,t.h+8,'Report strategico','Una riga per il periodo. Prodotto ogni settimana o ogni mese.');
  })();
  /* modello illustrativo del carico di lavoro */
  (function(){
    const trio=el('div','trio');const root=$('#b1load');root.append(legend([[BLUE,'tempo per salvare un ordine','box'],[RED,'sopra i 15 ms','box']]),trio);
    const rnd=(()=>{let x=7;return()=>{x=(x*16807)%2147483647;return x/2147483647}})(),jit=Array.from({length:12},()=>0.6+0.8*rnd());
    [['Nessun report',0.3],['8 report sullo stesso server',0.82],['8 report su una copia',0.3]].forEach(([title,u])=>{
      const mean=4/(1-u),W=230,H=180,L=34,B=150,T=12,Y=v=>B-v/40*(B-T);let s='';
      [0,10,20,30,40].forEach(v=>{s+=line(L,Y(v),W-6,Y(v),'#222',1)+tx(L-6,Y(v)+4,v,{s:13,f:GRAY,a:'end'})});
      const avg=jit.reduce((a,j)=>a+Math.min(39.5,mean*j),0)/jit.length;s+=tx(12,(T+B)/2,'ms',{s:13,f:GRAY,x:' transform="rotate(-90 12 '+(T+B)/2+')"'});
      jit.forEach((j,i)=>{const v=Math.min(39.5,mean*j),bw=(W-6-L)/12;s+=rect(L+i*bw+2,Y(v),bw-4,B-Y(v),v>15?RED:BLUE)});
      s+=line(L,B,W-6,B,'#777',1.5)+tx((L+W)/2,B+20,'ordini in arrivo',{s:13,f:GRAY});
      cell(trio,title,s,W,H,title,'In media <b>'+fi(avg,1)+' ms</b> per ordine.')});
  })();
  /* ETL: staging, trasformazione, warehouse */
  (function(){
    const W=720,H=372;let s='';
    [[0,'Area di staging (extract)'],[244,'Trasformati (transform)'],[488,'Data warehouse (load)']].forEach(([x,t])=>{s+=rect(x+2,30,228,H-34,'#0b0b0b','#2a2a2a')+tx(x+116,20,t,{s:14,f:GRAY})});
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
    svgBox($('#b1etl'),W,H,s,'ETL da due fonti a una sola tabella del warehouse','46rem');
  })();
  /* il cubo, una fetta per data, e una pivot */
  (function(){
    const cities=['Milan','London','Liverpool'],cityIt={Milan:'Milano',London:'Londra',Liverpool:'Liverpool'},prods=['abc','xyz'],dates=['2018-09-01','2018-09-02','2018-09-03'];
    const cityOf=id=>capw(CUST.find(c=>c[0]===id)[3]);
    const q=(c,p,d)=>SAL.filter(r=>cityOf(r[2])===c&&r[3]===p&&(!d||r[1]===d)).reduce((a,r)=>a+r[4],0);
    let s='';const cw=46,rh=30,y0=64;
    cities.forEach((c,i)=>{s+=tx(76,y0+i*rh+20,cityIt[c],{s:13.5,a:'end',f:'#fff'})});
    dates.forEach((d,k)=>{const x=86+k*(2*cw+20);s+=tx(x+cw,22,d.slice(8)+'/'+d.slice(5,7),{s:13.5,f:GRAY});
      prods.forEach((p,j)=>{s+=tx(x+j*cw+cw/2,y0-8,p,{s:13,f:GRAY})});
      cities.forEach((c,i)=>prods.forEach((p,j)=>{const v=q(c,p,d);s+=rect(x+j*cw,y0+i*rh,cw,rh,v?'rgba(88,196,221,.22)':'#0d0d0d','#333')+(v?tx(x+j*cw+cw/2,y0+i*rh+20,v,{s:14,f:MSC}):'')}))});
    s+=tx(86+(2*cw+20)*1.5-10,y0+3*rh+28,'una fetta per data (quantità)',{s:13,f:GRAY});
    const px=436;s+=tx(px+20,y0+rh*1.5+8,'→',{s:22,f:GRAY});
    const pr=cities.map(c=>[cityIt[c],{v:q(c,'abc'),f:MSC},{v:q(c,'xyz'),f:MSC},{v:q(c,'abc')+q(c,'xyz'),f:MSC,b:1}]);
    pr.push([{v:'totale',f:GRAY},{v:8,f:MSC,b:1},{v:18,f:MSC,b:1},{v:26,f:MSC,b:1}]);
    const t=sTab(px+44,y0-26,[{t:'città',w:76},{t:'abc',w:44,a:'e'},{t:'xyz',w:44,a:'e'},{t:'totale',w:52,a:'e'}],pr,{rh:28,bg:i=>i===3?HLBG:null});
    s+=t.s+tx(px+44+108,y0+4*28+30,'pivot: date sommate',{s:13,f:GRAY});
    svgBox($('#b1olap'),720,226,s,'Cubo delle vendite tagliato per data e pivot per città e prodotto','46rem');
  })();
  /* vendite simulate e previsione */
  (function(){
    const N=36,now=24;let x=11;const rnd=()=>{x=(x*16807)%2147483647;return x/2147483647};
    const y=Array.from({length:N},(_,t)=>100+1.6*t+16*Math.sin(2*Math.PI*(t-2)/12)+(rnd()-.5)*12);
    const W=700,H=300,L=56,R=686,T=14,B=250,X=t=>L+t/(N-1)*(R-L),Y=v=>B-(v-60)/(200-60)*(B-T);let s='';
    for(let v=60;v<=200;v+=35)s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'});
    for(let t=0;t<N;t+=6)s+=tx(X(t),B+20,t+1,{s:13,f:GRAY});
    s+=tx((L+R)/2,H-6,'mese',{s:13,f:GRAY})+tx(14,(T+B)/2,'vendite, migliaia di unità',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    const k=now-1,m1=y.slice(now-12,now).reduce((a,b)=>a+b)/12,m0=y.slice(now-24,now-12).reduce((a,b)=>a+b)/12,dr=m1-m0;
    const f=[{t:k,v:y[k],w:0}];for(let h=1;h<=6;h++)f.push({t:k+h,v:y[k+h-12]+dr,w:6+2.5*h});
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v+p.w).toFixed(1)).join('')+f.slice().reverse().map(p=>'L'+X(p.t).toFixed(1)+' '+Y(p.v-p.w).toFixed(1)).join('')+'Z" fill="'+ORG+'" fill-opacity=".18"/>';
    s+='<path d="'+y.slice(0,now).map((v,t)=>(t?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+BLUE+'" stroke-width="2.5"/>';
    s+='<path d="'+f.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.v).toFixed(1)).join('')+'" fill="none" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
    s+=line(X(k),T,X(k),B,'#fff',1,' stroke-dasharray="3 4"')+lbl(X(k),T+12,'oggi','#fff');
    const r=$('#b1fc');r.append(legend([[BLUE,'passato noto: analisi descrittiva'],[ORG,'previsione e fascia di incertezza: analisi predittiva','dash']]));
    svgBox(r,W,H,s,'Vendite mensili con una previsione a sei mesi','44rem');
  })();
  /* un post: che cosa vedi e che cosa viene memorizzato */
  (function(){
    const root=$('#b1post'),duo=el('div','duo');root.append(legend([['#fff','coppia chiave/valore, sta in una colonna','box'],[GRAY,'contenuto libero, senza struttura fissa','box']]),duo);
    const S='color:#fff',U='color:#8c8c8c;font-style:italic';
    const a=el('div');a.append(el('h4','','Che cosa vedi'));
    a.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:var(--sans);line-height:1.6;display:flex;flex-direction:column;gap:.5rem;width:100%">'+
      '<div style="display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap"><b style="'+S+'">Milano Bites</b><span style="'+S+'">30 set 2026, 18:42</span></div>'+
      '<span style="'+S+'">Milano, Italia</span><span style="'+U+'">Il miglior risotto della città stasera, lo zafferano era incredibile! Coda lunga ma ne valeva la pena.</span>'+
      '<svg viewBox="0 0 200 64" style="max-width:200px"><rect width="200" height="64" fill="#1d1d1d"/><circle cx="58" cy="34" r="18" fill="#8c8c8c"/><path d="M110 54L140 18L174 54Z" fill="#555"/></svg>'+
      '<span style="'+S+'">♥ 128</span></div>'));
    const b=el('div');b.append(el('h4','','Che cosa viene memorizzato'));
    const kv=(k,v,u,last)=>'<div style="padding-left:1.4em;text-indent:-1.2em;'+(u?U:S)+'">"'+k+'": '+v+(last?'':',')+'</div>';
    b.append(el('div','','<div style="background:#0e0e0e;border:1px solid #333;padding:1rem;font-family:ui-monospace,Menlo,monospace;font-size:.82rem;line-height:1.75;width:100%;overflow-wrap:anywhere">{'+
      kv('author','"@milano_bites"')+kv('created_at','"2026-09-30T18:42:00Z"')+kv('location','"Milano, IT"')+kv('text','"Il miglior risotto della città stasera, lo zafferano..."',1)+kv('media','["photo_8841.jpg"]',1)+kv('likes','128',0,1)+'}</div>'));
    duo.append(a,b);
    root.append(el('div','cellnote','Autore, data, luogo e like sono valori con un\'etichetta; il testo e la foto no. Un oggetto che mescola le due cose è <b>semi-strutturato</b>.'));
  })();
};
QZ['1a']=()=>[{q:'Con le sei vendite del corso, un report tattico mostra l\'importo totale per giorno. Che cosa mostra per il 2 settembre 2018?',o:['15','43,4','23','11,5'],a:2,
  e:'Il 2 settembre ci sono due vendite: 10 unità di xyz a 1,5 (15) e 4 unità di abc a 2 (8), quindi 15 + 8 = 23.',h:'Prendi solo le righe con data 2018-09-02 e somma, per ciascuna, quantità per prezzo.'}];
QZ['1b']=()=>[{q:'Un\'azienda copia ogni notte il suo database operativo su un secondo server e fa girare lì tutti i report, senza cambiare nient\'altro. Quale problema risolve?',
  o:['La stessa città è scritta in due modi diversi nell\'ERP e nel CRM.','Il CRM tiene un vecchio indirizzo accanto a quello nuovo per lo stesso cliente.','I report pesanti rallentano l\'inserimento dei nuovi ordini.','Nessuno dei tre.'],a:2,
  e:'Una copia su un altro server elimina la competizione fra letture massicce e scritture: è così che sono nati i primi data warehouse. Non fa nulla per i formati o le versioni, perché copia anche quelli.',
  h:'Una copia contiene gli stessi valori dell\'originale. Quale dei problemi riguarda i valori, e quale la macchina?'}];
QZ['1c']=()=>[{q:'Rispetto a interrogare il data warehouse in SQL, che cosa aggiunge l\'OLAP?',
  o:['Prevede i valori del mese prossimo a partire da quelli storici.','L\'utente può aggregare lungo le dimensioni senza conoscere le relazioni fra le tabelle, e le aggregazioni arrivano più in fretta.','Elimina il bisogno dell\'ETL, perché legge direttamente i database operativi.','Memorizza i dati in tabelle normalizzate.'],a:1,
  e:'L\'OLAP unisce ai dati i metadati, così l\'utente non deve sapere come sono collegate le tabelle, e risponde alle domande di aggregazione molto più velocemente di un database relazionale.',
  h:'Pensa a che cosa doveva sapere un utente nella fase 2 per ottenere un totale per città, e a che cosa cambia quando il motore sa già come sono collegate le tabelle.'}];
QZ['1d']=()=>[{q:'Un\'azienda energetica riceve una lettura ogni 15 minuti da ciascuno di 2 milioni di contatori intelligenti, come record con id del contatore, data e ora, kWh e una nota libera del tecnico. Quante letture arrivano al giorno, e che tipo di dati è ogni record?',o:['192 milioni; semi-strutturati','2 milioni; strutturati','192 milioni; non strutturati','48 milioni; semi-strutturati'],a:0,
  e:'Un giorno ha 24 × 4 = 96 quarti d\'ora, quindi 2.000.000 × 96 = 192 milioni di letture. Ogni record mescola campi che stanno in colonne di una tabella e testo libero: semi-strutturato.',h:'Conta i quarti d\'ora in un giorno, poi guarda che cosa contiene ogni record.'}];
QZ['1']=()=>[
  {q:'Sulle sei vendite del corso, qual è il ricavo (quantità × prezzo) del prodotto abc, e qual è il ricavo dei clienti che abitano a Londra?',o:['8 e 9','16,4 e 16,5','16,4 e 12','12,4 e 16,5'],a:1,
   e:'abc: 2 × 2 + 4 × 2 + 2 × 2,2 = 4 + 8 + 4,4 = 16,4. A Londra abitano John Doe (cliente 2) e Mary Jane (cliente 4): vendite 2, 4 e 6, quindi 4 + 8 + 4,5 = 16,5.',h:'Calcola prima l\'importo di ogni vendita; poi scegli le righe per prodotto, e per città del cliente.'},
  {q:'Nella pivot della figura sull\'OLAP, qual è la quantità totale comprata dai clienti di Londra?',o:['6','3','10','9'],a:3,
   e:'I clienti di Londra hanno comprato abc due volte (2 e 4) e xyz una volta (3): 2 + 4 + 3 = 9.',h:'Trova le vendite di Londra nelle tre fette per data e somma le loro quantità.'},
  {q:'Quale di questi è l\'esempio di dati semi-strutturati dato a lezione?',o:['Un tweet','La tabella delle fatture di un ERP','Un\'immagine a raggi X','Un report strategico stampato'],a:0,
   e:'Un post mescola testo libero e coppie chiave/valore come autore, data e luogo: è questo che vuol dire semi-strutturato.',h:'Cerca l\'elemento che contiene sia contenuto libero sia campi con un\'etichetta.'},
  {q:'Quale di questi è analisi predittiva e non descrittiva?',o:['Un report mensile delle vendite per regione','Una pivot OLAP dei margini dell\'anno scorso','Una stima del costo dell\'energia del mese prossimo','Una dashboard degli ordini di ieri'],a:2,
   e:'Stimare quanto è probabile un valore futuro è analisi predittiva; gli altri tre riassumono ciò che è già successo.',h:'Ricorda la divisione della lezione: un tipo di analisi descrive, l\'altro stima.'},
  {q:'Un rivenditore tiene 50 GB di vendite in un database relazionale, e tutti i suoi report girano in pochi secondi. Secondo la definizione preferita dal docente, sono Big Data?',o:['Sì, perché le vendite si generano di continuo','Sì, perché 50 GB sono più di quanto un portatile possa contenere','No, perché si possono analizzare comodamente con gli strumenti tradizionali','No, perché solo i dati dei social network sono Big Data'],a:2,
   e:'Il docente definisce Big Data i dati che non possiamo analizzare, o che non conviene analizzare, con gli strumenti tradizionali come i database relazionali. Qui l\'RDBMS se la cava bene, quindi non sono Big Data.',h:'La definizione preferita dipende dagli strumenti, non da una dimensione fissa.'},
  {q:'L\'ERP elenca 5 clienti; il CRM ne elenca 6, perché Mary Jane compare due volte, a Manchester e a Londra. In quale passo dell\'ETL si fondono i due record, e quanti clienti dovrebbe contare il warehouse?',o:['Extract; 6','Load; 11','Transform; 6','Transform; 5'],a:3,
   e:'L\'eliminazione dei duplicati e l\'integrazione sono regole di business e controlli di qualità, applicati nel passo Transform; entrambi i sistemi descrivono le stesse cinque persone, quindi il warehouse ne conta 5.',h:'Abbina ogni cliente del CRM a uno dell\'ERP.'}
];

/* Lezione 2: che cos'è esattamente una tabella */
INIT[2]=function(){
  codeHL($('#lezione-2'));
  /* four inserts into Sales */
  (function(){
    const root=$('#b2ins'),m=el('div','duo');root.append(legend([[GRN,'riga accettata','box'],[RED,'riga rifiutata','box'],['#fff','cella che viola una regola','dash']]),m);
    const C=[{t:'id',w:30,a:'e',c:PKC},{t:'data',w:56},{t:'cliente',w:52,a:'e',c:FKC},{t:'prod',w:44},{t:'qtà',w:40,a:'e'}];
    [['Un sales_id che esiste già',[3,'09-04',2,'abc',4],0,false,'sales_id 3 c\'è già: la <span style="color:var(--yellow)">chiave primaria</span> rifiuta un duplicato.'],
     ['Un cliente che non esiste',[7,'09-04',9,'abc',3],2,false,'Il cliente 9 non c\'è: la <span style="color:var(--pink)">chiave esterna</span> lo rifiuta.'],
     ['Una quantità pari a zero',[7,'09-04',2,'abc',0],4,false,'<span style="color:var(--orange)">quantity &gt; 0</span> è falso: il vincolo CHECK la rifiuta.'],
     ['Un cliente sconosciuto',[7,'09-04',null,'abc',3],-1,true,'customer_id è NULL, e una chiave esterna lo permette.']].forEach(([title,row,bad,ok,note])=>{
      const t=sTab(4,4,C,[[6,'09-03',2,'xyz',3].map(v=>({v,f:GRAY})),row],{bg:i=>i===1?(ok?OKBG:BADBG):null});
      const ex=bad>=0?rect(colX(4,C,bad)+1,4+26+25+1,C[bad].w-2,23,'none','#fff',' stroke-width="2"'):'';
      tabCell(m,title,t,verdict(ok,note),300,ex)});
  })();
  /* CHAR versus VARCHAR, and DECIMAL(5,2) */
  (function(){
    const duo=el('div','duo');$('#b2types').append(duo);
    const q=v=>"'"+v+"'";
    const rows=[['',4],['ab',4],['abcd',4],['abcdefgh',4]].map(([v])=>{const c=v.slice(0,4);return [q(v),q(c.padEnd(4,'·')),4,q(c),c.length+1]});
    const t=sTab(4,4,[{t:'valore',w:84},{t:'CHAR(4)',w:72},{t:'byte',w:46,a:'e'},{t:'VARCHAR(4)',w:86},{t:'byte',w:46,a:'e'}],rows.map(r=>[r[0],r[1],{v:r[2],f:MSC},r[3],{v:r[4],f:MSC}]),{rh:28});
    cell(duo,'Byte occupati dal testo',t.s,t.w+8,t.h+8,'Memorizzazione di CHAR e VARCHAR','CHAR occupa sempre 4 byte; VARCHAR occupa la lunghezza più 1.');
    let s='';const bw=26;
    [[12.5,'12.50'],[999.99,'999.99'],[1000.5,'1000.50']].forEach(([n,str],i)=>{const y=26+i*58,[ip,dp]=str.split('.'),ok=ip.length<=3;
      s+=tx(52,y+19,fe(n),{s:15,f:'#fff',a:'end'});
      const digits=ip.padStart(3,' ').split('');const x0=112-(ip.length>3?(ip.length-3)*bw:0);
      digits.forEach((d,k)=>{const x=x0+k*bw,extra=ip.length>3&&k<ip.length-3;s+=rect(x,y,bw-3,28,'#0d0d0d',extra?RED:'#666')+tx(x+(bw-3)/2,y+20,d===' '?'0':d,{s:15,f:extra?RED:(d===' '?'#444':'#fff')})});
      const xp=x0+digits.length*bw;s+=tx(xp+4,y+22,'.',{s:16,f:'#fff'});
      dp.split('').forEach((d,k)=>{const x=xp+12+k*bw;s+=rect(x,y,bw-3,28,'#0d0d0d','#666')+tx(x+(bw-3)/2,y+20,d,{s:15,f:'#fff'})});
      s+=tx(272,y+19,ok?'ci sta':'non ci sta',{s:14,f:ok?GRN:RED,a:'start'})});
    cell(duo,'Numeri in DECIMAL(5,2)',s,370,196,'Caselle di DECIMAL(5,2)','Posto per 3 cifre prima del punto decimale: il valore massimo è 999.99.');
  })();
  /* full scan versus index */
  (function(){
    const duo=el('div','duo'),root=$('#b2idx');root.append(legend([['#8a8a8a','righe lette','box'],[GRN,'riga trovata','box']]),duo);
    const n=64,target=37,r=lcg(5),perm=[...Array(n).keys()].map(i=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}
    const pos=perm.indexOf(target);let lo=0,hi=n-1;const probes=[];while(lo<=hi){const mid=(lo+hi)>>1;probes.push(mid);if(mid+1===target)break;if(mid+1<target)lo=mid+1;else hi=mid-1}
    const grid=(lab,fill)=>{let s='';for(let i=0;i<n;i++){const x=6+(i%8)*36,y=6+Math.floor(i/8)*36,f=fill(i);s+=rect(x,y,33,33,f||'#1a1a1a')+tx(x+16.5,y+22,lab(i),{s:13,f:f===GRN||f==='#8a8a8a'?'#000':'#ccc'})}return s};
    cell(duo,'Scansione di tutta la tabella',grid(i=>perm[i],i=>i<pos?'#8a8a8a':i===pos?GRN:null),300,300,'Griglia della scansione completa','Legge <b>'+(pos+1)+'</b> righe su 64; nel caso peggiore tutte e 64.');
    cell(duo,'Ricerca attraverso l\'indice',grid(i=>i+1,i=>{const k=probes.indexOf(i);return k<0?null:k===probes.length-1?GRN:'#8a8a8a'}),300,300,'Griglia della ricerca con indice','Legge <b>'+probes.length+'</b> righe; mai più di 7 su 64 righe.');
  })();
  /* update anomaly versus third normal form */
  (function(){
    const duo=el('div','duo');$('#b2anom').append(duo);const NEW='123-000000',OLD='123-456789';
    let s=mono(8,18,'UPDATE Employee')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">employee_id = 1</tspan>;');
    const C1=[{t:'emp_id',w:52,a:'e',c:PKC},{t:'name',w:52},{t:'dep_code',w:66},{t:'dep_name',w:70},{t:'dep_phone',w:96}];
    const t1=sTab(4,70,C1,[[1,'Mary','FIN','Finance',{v:NEW,f:'#fff',bg:BADBG}],[2,'John','FIN','Finance',{v:OLD,bg:BADBG}],[3,'Lucy','FIN','Finance',{v:OLD,bg:BADBG}]]);
    s+=t1.s;cell(duo,'Una sola tabella Employee',s,344,70+t1.h+8,'Tabella denormalizzata dopo l\'aggiornamento','<span class="bad">Ora Finance ha 2 numeri di telefono.</span> Due righe non sono mai state aggiornate.');
    s=mono(8,18,'UPDATE Department')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">dep_id = 1</tspan>;');
    const t2=sTab(4,70,[{t:'dep_id',w:52,a:'e',c:PKC},{t:'dep_code',w:68},{t:'dep_name',w:72},{t:'dep_phone',w:96}],[[1,'FIN','Finance',{v:NEW,bg:OKBG}]]);
    const t3=sTab(4,70+t2.h+16,[{t:'emp_id',w:52,a:'e',c:PKC},{t:'first',w:52},{t:'last',w:58},{t:'dep_id',w:52,a:'e',c:FKC}],[[1,'Mary','Johns',{v:1,f:FKC}],[2,'John','White',{v:1,f:FKC}],[3,'Lucy','Smith',{v:1,f:FKC}]]);
    s+=t2.s+t3.s;cell(duo,'Department + Employee (terza forma normale)',s,344,70+t2.h+16+t3.h+8,'Tabelle normalizzate dopo l\'aggiornamento','<span class="ok">Finance ha 1 numero di telefono,</span> memorizzato in una sola riga.');
  })();
  /* OLTP schema versus warehouse schema */
  (function(){
    const duo=el('div','duo'),root=$('#b2shape');root.append(legend([[PRC,'tabelle e join che servono alla domanda'],['#555','altre tabelle e collegamenti']]),duo);
    const draw=(nodes,edges,path,bw)=>{let s='';const P=new Set(path.flat());
      edges.forEach(([a,b])=>{const on=path.some(([u,v])=>(u===a&&v===b)||(u===b&&v===a));s+=line(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],on?PRC:'#555',on?3:1.5)});
      Object.entries(nodes).forEach(([k,[x,y]])=>{const on=P.has(k);s+=rect(x-bw/2,y-14,bw,28,'#0b0b0b',on?PRC:'#555',on?' stroke-width="2"':'')+tx(x,y+5,k,{s:14,f:on?'#fff':'#999'})});return s};
    const N1={Continents:[62,22],Countries:[62,74],Cities:[62,126],Addresses:[62,178],Shops:[62,238],Customers:[180,178],sales_header:[180,238],Colors:[180,126],Categories:[298,22],Subcategory:[298,74],Product:[298,126],sales_details:[298,178]};
    const E1=[['Continents','Countries'],['Countries','Cities'],['Cities','Addresses'],['Addresses','Customers'],['Addresses','Shops'],['Customers','sales_header'],['Shops','sales_header'],['sales_header','sales_details'],['sales_details','Product'],['Product','Colors'],['Product','Subcategory'],['Subcategory','Categories']];
    const P1=[['sales_details','sales_header'],['sales_header','Customers'],['Customers','Addresses'],['Addresses','Cities'],['Cities','Countries'],['Countries','Continents'],['sales_details','Product'],['Product','Subcategory'],['Subcategory','Categories']];
    cell(duo,'OLTP: 12 tabelle normalizzate',draw(N1,E1,P1,108),360,256,'Schema OLTP','<b>10 tabelle, 9 join.</b> Continente e categoria stanno alle estremità di due catene.');
    const N2={'Fact Sales':[180,128],'Dim Customers':[70,40],'Dim Product':[290,40],'Dim Shops':[70,216],'Dim Date':[290,216],'Dim Time':[180,40]};
    const E2=[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product'],['Fact Sales','Dim Shops'],['Fact Sales','Dim Date'],['Fact Sales','Dim Time']];
    cell(duo,'Data warehouse: fatti e dimensioni',draw(N2,E2,[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product']],104),360,256,'Schema del warehouse','<b>3 tabelle, 2 join.</b> Il continente è una colonna di Dim Customers, la categoria una colonna di Dim Product.');
  })();
  /* one fact row read through its surrogate keys */
  (function(){
    const order=[5,2,4,1,3],dc=order.map((cid,i)=>{const c=CUST.find(x=>x[0]===cid);return [i+1,cid,capw(c[1])+' '+capw(c[2]),capw(c[3])]});
    const dd=[[1,'2018-09-01','sabato'],[2,'2018-09-02','domenica'],[3,'2018-09-03','lunedì']],dp=[[1,'abc'],[2,'xyz']];
    const fact=SAL.map(r=>[dd.find(d=>d[1]===r[1])[0],dc.find(c=>c[1]===r[2])[0],dp.find(p=>p[1]===r[3])[0],r[4],r[4]*r[5]]);const sel=2,f=fact[sel];
    const K=v=>({v,f:PKC});let s='';
    const Cc=[{t:'cust_key',w:66,a:'e',c:PKC},{t:'chiave di business',w:124,a:'e'},{t:'nome',w:96},{t:'città',w:68}];
    const tc=sTab(6,26,Cc,dc.map(r=>[K(r[0]),r[1],r[2],r[3]]),{bg:i=>dc[i][0]===f[1]?HLBG:null});
    const Cp=[{t:'prod_key',w:68,a:'e',c:PKC},{t:'chiave di business',w:124}],xp=372;
    const tp=sTab(xp,26,Cp,dp.map(r=>[K(r[0]),r[1]]),{bg:i=>dp[i][0]===f[2]?HLBG:null});
    const Cd=[{t:'date_key',w:66,a:'e',c:PKC},{t:'data',w:88},{t:'giorno',w:76}],xd=xp,yd=26+tp.h+46;
    const td=sTab(xd,yd,Cd,dd.map(r=>[K(r[0]),r[1],r[2]]),{bg:i=>dd[i][0]===f[0]?HLBG:null});
    s+=tc.s+tp.s+td.s+tx(6+173,16,'Dimensione cliente',{s:14,f:GRAY})+tx(xp+90,16,'Dimensione prodotto',{s:14,f:GRAY})+tx(xd+115,yd-8,'Dimensione data',{s:14,f:GRAY});
    const Cf=[{t:'date_key',w:70,a:'e',c:FKC},{t:'cust_key',w:70,a:'e',c:FKC},{t:'prod_key',w:70,a:'e',c:FKC},{t:'quantità',w:70,a:'e',c:MSC},{t:'importo',w:70,a:'e',c:MSC}];
    const yf=288,xf=150,FK=v=>({v,f:FKC});
    const tf=sTab(xf,yf,Cf,fact.map(r=>[FK(r[0]),FK(r[1]),FK(r[2]),{v:r[3],f:MSC},{v:fe(r[4]),f:MSC}]),{bg:i=>i===sel?HLBG:null});
    s+=tf.s+tx(xf+175,yf-10,'Tabella dei fatti delle vendite',{s:14,f:GRAY});
    svgBox($('#b2star'),720,yf+tf.h+12,s,'Una riga dei fatti collegata alle sue righe di dimensione','46rem');
    $('#b2star').append(el('div','cellnote','La vendita evidenziata si legge così: domenica 2 settembre 2018 Mark Smith di Liverpool ha comprato 10 unità di xyz per 15. La sua chiave surrogata è 5, la sua chiave di business 3.'));
  })();
  /* UPDATE and DELETE, with and without WHERE */
  (function(){
    const m=el('div','duo');$('#b2dml').append(m);const C=[{t:'id',w:30,a:'e',c:PKC},{t:'first',w:48},{t:'last',w:48},{t:'city',w:76}];
    const st=[[10,'mark','smith','liverpool'],[20,'mary','jane','london']];
    [['Partenza',['due righe inserite','dallo script',''],st,[]],
     ['DELETE',['DELETE FROM Customers','WHERE <tspan style="fill:'+PRC+'">customer_id = 10</tspan>;',''],[st[1]],[]],
     ['UPDATE',['UPDATE Customers',"SET city = 'Milan'",'WHERE <tspan style="fill:'+PRC+'">customer_id = 20</tspan>;'],[[20,'mary','jane','Milan']],[0]],
     ['UPDATE senza WHERE',['UPDATE Customers',"SET city = 'Milan';",''],[[10,'mark','smith','Milan'],[20,'mary','jane','Milan']],[0,1]]].forEach(([title,sql,rows,ch])=>{
      let s=sql.map((l,i)=>mono(4,16+i*18,l,{s:12.5,f:title==='Partenza'?GRAY:'#ddd'})).join('');
      const t=sTab(2,62,C,rows,{bg:i=>ch.includes(i)?(title.includes('senza')?BADBG:HLBG):null});
      cell(m,title,'<g transform="translate(43,0)">'+s+t.s+'</g>',300,62+26+2*25+6,title,title==='Partenza'?'Entrambi i clienti.':title==='DELETE'?'1 riga cancellata.':title==='UPDATE'?'1 riga aggiornata.':'<span class="bad">2 righe aggiornate:</span> tutte.')});
  })();
  /* CASE branches */
  (function(){
    const br=c=>c==='milan'?0:(c==='liverpool'||c==='london')?1:2,lab=['Italy','UK','N/A'],bgc=['rgba(255,255,255,.16)','rgba(255,255,255,.08)',null];
    const t=sTab(4,4,[{t:'customer_id',w:90,a:'e',c:PKC},{t:'last_name',w:84},{t:'city',w:84},{t:'Country',w:76},{t:'ramo',w:150,c:PRC}],CUST.map(c=>[c[0],c[2],c[3],{v:lab[br(c[3])],b:1},{v:['WHEN city = \'milan\'','WHEN city IN (...)','ELSE'][br(c[3])],f:PRC}]),{bg:i=>bgc[br(CUST[i][3])]});
    svgBox($('#b2case'),t.w+8,t.h+8,t.s,'Risultato della query con CASE','34rem');
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
    s+=t1.s+t2.s+t3.s+tx(2+88,16,'1. FROM e WHERE',{s:14,f:'#fff',w:500})+tx(2+88,34,'3 righe su 6 tenute',{s:13,f:GRAY})+tx(x2+119,16,'2. Select list',{s:14,f:'#fff',w:500})+tx(x2+119,34,'4 colonne, amount calcolato',{s:13,f:GRAY})+
      tx(x3+119,16,'3. ORDER BY',{s:14,f:'#fff',w:500})+tx(x3+119,34,'quantity, dalla più grande',{s:13,f:GRAY});
    s+=tx(x2-14,130,'→',{s:20,f:GRAY})+tx(x3-14,130,'→',{s:20,f:GRAY});
    svgBox($('#b2sel'),720,44+t1.h+8,s,'Una query SELECT passo per passo','46rem');
  })();
};
QZ['2a']=()=>[{q:'Quale tipo di integrità protegge il vincolo <code>CHECK (quantity &gt; 0)</code>?',o:['L\'integrità dell\'entità','L\'integrità referenziale','L\'integrità del dominio','Nessuna: CHECK è solo un commento'],a:2,
  e:'CHECK, insieme ai tipi di dato e ai vincoli NULL, tiene tutti i valori di una colonna dentro lo stesso dominio.',h:'Ricorda i tre tipi di integrità e quale strumento protegge ciascuno.'}];
QZ['2b']=()=>[{q:'Quale regola viola la tabella Employee(employee_id, first_name, last_name, dep_code, dep_name, dep_phone)?',
  o:['La prima forma normale, perché alcuni valori non sono atomici','L\'integrità dell\'entità, perché i duplicati sono permessi','La terza forma normale, per via di una dipendenza transitiva','L\'integrità del dominio, perché i telefoni sono testo'],a:2,
  e:'Il nome e il telefono del reparto dipendono dal codice del reparto, una colonna non chiave, quindi la tabella ha una dipendenza transitiva e viola la terza forma normale.',h:'Chiediti, colonna per colonna, da che cosa dipende ogni valore.'}];
QZ['2c']=()=>[{q:'Sulle sei vendite del corso, quante righe restituisce <code>WHERE product_name = \'abc\' OR product_name = \'xyz\' AND quantity &gt; 5</code>?',o:['1','3','6','4'],a:3,
  e:'AND ha la precedenza su OR, quindi la condizione si legge product = \'abc\' OR (product = \'xyz\' AND quantity &gt; 5). Passano le tre vendite di abc, più la vendita 3 (xyz, 10): quattro righe.',h:'Valuta AND prima di OR, poi conta le righe che soddisfano almeno uno dei due lati.'}];
QZ['2d']=()=>[{q:'Con la query CASE qui sopra sui cinque clienti del corso, quante righe ottengono Country = \'UK\'?',o:['2','1','3','5'],a:2,
  e:'doe e jane abitano a london, smith a liverpool: tre righe soddisfano city IN (\'liverpool\', \'london\'). Rossi ottiene Italy, Bianchi (rome) ottiene N/A.',h:'Scorri le cinque città e guarda quale WHEN viene soddisfatto per primo da ciascuna.'}];
QZ['2']=()=>[
  {q:'Quale valore <b>non</b> sta in una colonna DECIMAL(5,2)? (I valori sono scritti come in SQL, con il punto decimale.)',o:['999.99','12.5','1000.5','-45.1'],a:2,
   e:'Cinque cifre in tutto, due dopo il punto decimale, quindi al massimo tre prima: 1000.5 ne richiede quattro.',h:'DECIMAL(precision, scale): precision conta tutte le cifre, scale solo quelle dopo il punto decimale.'},
  {q:'In un data warehouse, quali tabelle sono tenute in terza forma normale?',o:['Le tabelle dei fatti','Le dimensioni','Entrambe','Nessuna: un warehouse non è mai normalizzato'],a:0,
   e:'Le dimensioni sono denormalizzate (prima forma normale) per essere lette facilmente; le tabelle dei fatti, con misure e chiavi, sono normalizzate (terza forma normale).',h:'Pensa a quale tipo di tabella è lunga e stretta, fatta di chiavi e numeri, e quale raccoglie tutti gli attributi di un\'entità.'},
  {q:'Sui cinque clienti del corso, dopo <code>UPDATE Customers SET city = \'milan\';</code> quanti clienti abitano a Milano?',o:['1','5','2','0, l\'istruzione viene rifiutata'],a:1,
   e:'Senza WHERE, UPDATE imposta la città di ogni riga: ora tutti e cinque i clienti abitano a Milano.',h:'Quale parte di un UPDATE limita le righe che tocca, e c\'è?'},
  {q:'Sulle sei vendite del corso, quante righe restituisce <code>WHERE price*quantity &gt; 4 AND customer_id &lt;&gt; 1 OR product_name = \'abc\'</code>?',o:['3','4','5','6'],a:2,
   e:'AND si valuta prima di OR. La parte con AND vale per le vendite 3 (15), 4 (8) e 6 (4,5); la vendita 2 ha importo esattamente 4 e le vendite 1 e 5 sono del cliente 1. L\'OR aggiunge le vendite di abc 2, 4 e 5. In tutto: vendite 2, 3, 4, 5 e 6, cinque righe; resta fuori solo la vendita 1.',h:'Valuta AND prima di OR, e calcola ogni importo; attenzione alla vendita con importo esattamente 4.'},
  {q:'Nel piccolo warehouse della lezione, a quale cliente punta la chiave surrogata cust_key = 1?',o:['Marco Rossi, chiave di business 1','John Doe, chiave di business 2','Mark Smith, chiave di business 3','Mario Bianchi, chiave di business 5'],a:3,
   e:'Le chiavi surrogate seguono l\'ordine di caricamento (Bianchi, Doe, Jane, Rossi, Smith), quindi la chiave 1 è Mario Bianchi, la cui chiave di business è 5.',h:'Una chiave surrogata la crea l\'ETL nell\'ordine di caricamento, non la copia dalla fonte.'},
  {q:'Con la tabella Sales definita nella lezione e i clienti da 1 a 5, quanti vincoli viola <code>INSERT INTO Sales VALUES (7, \'2018-09-04\', 9, \'abc\', 0, 2.00)</code>?',o:['Nessuno','Uno','Due','Tre'],a:2,
   e:'Il cliente 9 non esiste, quindi la chiave esterna (integrità referenziale) non è rispettata; la quantità 0 viola CHECK (quantity &gt; 0) (integrità del dominio). sales_id 7 è nuovo, quindi la chiave primaria va bene: due vincoli.',h:'Controlla la riga nuova colonna per colonna rispetto al CREATE TABLE.'}
];

/* Lezione 3: come si combinano due tabelle */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  /* cartesian product with the ON predicate */
  (function(){
    let s='';const x0=150,cw=106,y0=58,rh=42;
    BSL.forEach((sl,j)=>{const x=x0+j*cw+cw/2;s+=tx(x,20,'qty '+sl[2],{s:13.5,f:GRAY})+tx(x,40,'buyer_id '+sl[0],{s:13.5,f:FKC})});
    BUY.forEach((b,i)=>{const y=y0+i*rh;s+=tx(x0-12,y+18,b[0],{s:14,a:'end',f:'#fff'})+tx(x0-12,y+35,'buyer_id '+b[1],{s:13,a:'end',f:PKC});
      BSL.forEach((sl,j)=>{const m=b[1]===sl[0],x=x0+j*cw;s+=rect(x+4,y+3,cw-8,rh-6,m?'rgba(255,134,47,.85)':'#141414',m?PRC:'#2a2a2a')+tx(x+cw/2,y+26,b[1]+' = '+sl[0],{s:14,f:m?'#000':'#666'})})});
    svgBox($('#b3cart'),720,y0+4*rh+8,s,'Prodotto cartesiano di acquirenti e vendite','46rem');
    $('#b3cart').append(el('div','cellnote','20 coppie, 5 con il predicato vero. La riga di Lucy Thin non ha celle arancioni: non ha comprato nulla.'));
  })();
  /* four joins */
  (function(){
    const duo=el('div','duo'),root=$('#b3joins');root.append(legend([[PUR,'NULL: nessun partner trovato','box']]),duo);
    const sales=BSL.concat([[9,4,7]]),C=[{t:'buyer_name',w:84},{t:'b.id',w:42,a:'e',c:PKC},{t:'s.id',w:42,a:'e',c:FKC},{t:'qty',w:48,a:'e'}];
    const inner=[];BUY.forEach(b=>sales.forEach(sl=>{if(b[1]===sl[0])inner.push([b[0],b[1],sl[0],sl[2]])}));
    const lostB=BUY.filter(b=>!sales.some(sl=>sl[0]===b[1])).map(b=>[b[0],b[1],null,null]);
    const lostS=sales.filter(sl=>!BUY.some(b=>b[1]===sl[0])).map(sl=>[null,null,sl[0],sl[2]]);
    const maxRows=inner.length+lostB.length+lostS.length;
    [['INNER JOIN',inner,'solo le coppie che si abbinano'],['LEFT OUTER JOIN',inner.concat(lostB),'ogni acquirente tenuto'],['RIGHT OUTER JOIN',inner.concat(lostS),'ogni vendita tenuta'],['FULL OUTER JOIN',inner.concat(lostB,lostS),'entrambi i lati tenuti']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows,{bg:i=>i>=inner.length?'rgba(202,163,232,.16)':null});
      tabCell(duo,title,t,'<b>'+rows.length+' righe:</b> '+note+'.',330,'',26+maxRows*25+8)});
  })();
  /* UNION and UNION ALL */
  (function(){
    const duo=el('div','duo');$('#b3union').append(duo);const C=[{t:'id',w:40,a:'e'},{t:'descr',w:60},{t:'origine',w:70}];
    [['UNION',[[1,'a','t1 e t2'],[2,'b','t1'],[3,'c','t2']],'3 righe: il duplicato viene eliminato.'],['UNION ALL',[[1,'a','t1'],[2,'b','t1'],[1,'a','t2'],[3,'c','t2']],'4 righe: il duplicato resta.']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows.map(r=>[r[0],r[1],{v:r[2],f:GRAY}]),{bg:i=>rows[i][0]===1?HLBG:null});tabCell(duo,title,t,note,330,'',26+4*25+8)});
  })();
  /* three valued logic and a left join */
  (function(){
    let s='';const V=v=>v===null?{v:'UNKNOWN',f:NLC}:v?{v:'TRUE',f:GRN}:{v:'FALSE',f:RED};
    const t1=sTab(4,30,[{t:'confronto',w:130},{t:'esito',w:90}],[['5 &gt; 2',V(true)],['1 = 1',V(true)],[{v:'NULL &gt; 99'},V(null)],[{v:'NULL = NULL'},V(null)],[{v:'5 &lt;&gt; NULL'},V(null)]]);
    s+=t1.s+tx(114,18,'Confronti',{s:14,f:'#fff',w:500});
    const rows=[];CUST.forEach(c=>{const ss=SAL.filter(r=>r[2]===c[0]);if(ss.length)ss.forEach(r=>rows.push([c[2],r[2],r[3],r[4]]));else rows.push([c[2],null,null,null])});
    const C=[{t:'last_name',w:78},{t:'s.cust_id',w:66,a:'e',c:FKC},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'= NULL',w:82,a:'m',c:PRC},{t:'IS NULL',w:66,a:'m',c:PRC}];
    const t2=sTab(262,30,C,rows.map(r=>[r[0],r[1],r[2],r[3],V(null),V(r[1]===null)]),{bg:i=>rows[i][1]===null?'rgba(202,163,232,.16)':null});
    s+=t2.s+tx(262+194,18,'Customers c LEFT JOIN Sales s',{s:14,f:'#fff',w:500});
    svgBox($('#b3null'),720,30+t2.h+8,s,'Logica a tre valori e un left join','46rem');
    $('#b3null').append(el('div','cellnote','<code>WHERE s.customer_id = NULL</code> tiene <span class="bad">0</span> righe: ogni riga è UNKNOWN. <code>WHERE s.customer_id IS NULL</code> ne tiene <span class="ok">1</span>: Bianchi, il cliente senza vendite.'));
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
    s+=t3.s+tx(638,112,'Risultato',{s:14,f:'#fff',w:500});
    svgBox($('#b3group'),720,30+t1.h+8,s,'Come funziona GROUP BY','46rem');
  })();
  /* HAVING with and without WHERE */
  (function(){
    const duo=el('div','duo'),root=$('#b3having');root.append(legend([[GRN,'prodotto che supera HAVING','box'],['#555','prodotto escluso','box'],[PRC,'HAVING SUM(quantity) &gt; 60']]),duo);
    const names={1:'Chai',2:'Chang',3:'Aniseed Syrup',4:'Cajun'};
    [['Tutte le voci',0],['WHERE quantity &gt; 10',10]].forEach(([title,w])=>{
      const W=340,L=104,R=318,X=v=>L+v/80*(R-L);let s='';
      [0,20,40,60,80].forEach(v=>{s+=line(X(v),10,X(v),182,'#222',1)+tx(X(v),200,v,{s:13,f:GRAY})});
      [1,2,3,4].forEach((p,i)=>{const its=ITEMS.filter(it=>it[1]===p&&it[2]>w),sum=its.reduce((a,it)=>a+it[2],0),ok=sum>60,y=20+i*42;
        s+=tx(L-8,y+19,names[p],{s:13.5,a:'end',f:'#fff'})+rect(L,y+2,X(sum)-L,26,ok?GRN:'#555')+lbl(X(sum)+6,y+20,sum,ok?GRN:GRAY,{a:'start'})});
      s+=line(X(60),6,X(60),186,PRC,2.5)+tx((L+R)/2,218,'quantità totale',{s:13,f:GRAY});
      cell(duo,title,s,W,226,title,w?'Passa solo <b>Cajun (65)</b>: le sue voci sono grandi.':'Passano <b>Chang (71)</b> e <b>Cajun (65)</b>.')});
  })();
  /* self-contained versus correlated subquery */
  (function(){
    const duo=el('div','duo');$('#b3subq').append(duo);
    const rows=ORD.slice().sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]-b[1]);const max=rows.reduce((m,r)=>r[0]>m?r[0]:m,'');
    const last=cid=>rows.filter(r=>r[1]===cid).reduce((m,r)=>r[0]>m?r[0]:m,'');
    let t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'risultato interno',w:120,c:MSC}],rows.map(r=>[r[2],r[0],{v:max,f:MSC}]),{bg:i=>rows[i][0]===max?OKBG:null,op:i=>rows[i][0]===max?1:.45});
    cell(duo,'Indipendente: eseguita una volta',t.s,t.w+8,t.h+8,'Sottoquery indipendente','<b>1 riga:</b> Anders, che ha fatto l\'ultimo ordine (15 luglio 2018).');
    t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'risultato interno',w:120,c:MSC}],rows.map(r=>[r[2],r[0],{v:last(r[1]),f:MSC}]),{bg:i=>rows[i][0]===last(rows[i][1])?OKBG:null,op:i=>rows[i][0]===last(rows[i][1])?1:.45});
    cell(duo,'Correlata: eseguita una volta per ordine',t.s,t.w+8,t.h+8,'Sottoquery correlata','<b>2 righe:</b> l\'ultimo ordine di ogni cliente.');
  })();
  /* four window functions */
  (function(){
    const duo=el('div','duo'),root=$('#b3win');root.append(legend([[WNC,'righe nella finestra della riga segnata','box'],['#fff','riga segnata','dash']]),duo);
    const C=[{t:'nome',w:68},{t:'data',w:50},{t:'importo',w:66,a:'e'},{t:'',w:84,a:'e',c:WNC}];
    const byDate=ORD.slice();const part=cid=>byDate.filter(r=>r[1]===cid);
    const panel=(title,colname,rows,vals,winOf,mark,extra,note)=>{const cc=C.map((c,j)=>j===3?{...c,t:colname}:c);
      const t=sTab(4,4,cc,rows.map((r,i)=>[r[2],r[0].slice(8)+'/'+r[0].slice(5,7),fe(r[3]),{v:fe(vals[i]),f:WNC}]),{bg:i=>i===mark?'rgba(92,208,179,.45)':winOf.includes(i)?WINBG:null});
      let s=t.s+(mark>=0?rect(4,4+26+mark*25,t.w,25,'none','#fff',' stroke-width="1.5" stroke-dasharray="4 3"'):'')+(extra||'');
      cell(duo,title,s,t.w+40,t.h+8,title,note)};
    /* ROW_NUMBER over amount descending */
    const rn=[1,2].flatMap(c=>part(c).slice().sort((a,b)=>b[3]-a[3]));const rnv=rn.map(r=>rn.filter(x=>x[1]===r[1]).indexOf(r)+1);
    panel('ROW_NUMBER()','rn',rn,rnv,[],-1,'','ORDER BY TotalAmount DESC: rn = 1 è l\'ordine più grande di ogni cliente.');
    /* LAG */
    const lag=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return k?p[k-1][3]:0});
    let ar='<defs>'+arrowDef('b3la',GRAY)+'</defs>';byDate.forEach((r,i)=>{const p=part(r[1]),k=p.indexOf(r);if(k){const y1=4+26+(i-1)*25+13,y2=y1+25;ar+='<path d="M'+(4+186)+' '+(y1-2)+' L'+(4+206)+' '+(y2-4)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2" marker-end="url(#b3la)"/>'}});
    panel('LAG(TotalAmount, 1, 0)','Previous',byDate,lag,[],-1,ar,'Ogni riga riceve l\'importo precedente dello stesso cliente; la prima riceve il valore predefinito 0.');
    /* moving average and running total */
    const avg=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r),w=p.slice(Math.max(0,k-2),k+1);return w.reduce((a,x)=>a+x[3],0)/w.length});
    panel('AVG, da 2 PRECEDING a CURRENT ROW','MovingAvg',byDate,avg,[0,1],2,'','Finestra del terzo ordine di Anders: i suoi primi tre ordini, media 974,6.');
    const run=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return p.slice(0,k+1).reduce((a,x)=>a+x[3],0)});
    panel('SUM, UNBOUNDED PRECEDING','RunningTotal',byDate,run,[0,1,2],3,'','Finestra del quarto ordine di Anders: tutti i suoi ordini fino a lì, totale 3549.');
  })();
};
QZ['3a']=()=>[{q:'Dopo <code>Customers c LEFT JOIN Sales s ON c.customer_id = s.customer_id</code>, quante righe tiene <code>WHERE s.customer_id = NULL</code>?',
  o:['1, Bianchi, che non ha vendite','7','0','L\'RDBMS restituisce un errore'],a:2,
  e:'s.customer_id = NULL è UNKNOWN su ogni riga, compresa quella di Bianchi, e WHERE scarta UNKNOWN: zero righe. IS NULL restituirebbe Bianchi.',h:'Che cosa restituisce il confronto di qualunque cosa con NULL usando =, e quali esiti tiene WHERE?'}];
QZ['3b']=()=>[{q:'Stessa media mobile. Quanto vale sul quarto ordine di Anders (625,2)?',o:['974,6','1036,33','887,25','625,2'],a:1,
  e:'La finestra contiene i suoi ordini 2, 3 e 4: (1813 + 670,8 + 625,2) / 3 = 1036,33.',h:'Trova quali dei suoi ordini cadono nella finestra del quarto, poi fanne la media.'}];
QZ['3c']=()=>[{q:'Se il WHERE del secondo riquadro fosse <code>quantity &gt;= 10</code> invece di <code>quantity &gt; 10</code>, quali prodotti supererebbero <code>HAVING SUM(i.quantity) &gt; 60</code>?',o:['Solo Chef Anton\'s Cajun Seasoning','Chang e Chef Anton\'s Cajun Seasoning','Chai, Chang e Chef Anton\'s Cajun Seasoning','Nessuno'],a:1,
  e:'Con >= 10 tornano le voci pari esattamente a 10: Chang diventa 10 + 40 + 15 = 65, Chai 12 + 15 = 27, Aniseed Syrup 10 + 35 = 45, Cajun resta 65. Passano Chang e Cajun.',h:'Trova le voci con quantità esattamente 10 e riaggiungile ai loro prodotti.'}];
QZ['3']=()=>[
  {q:'Con gli acquirenti e le vendite della lezione (senza la vendita in più), quante righe restituisce <code>buyers LEFT OUTER JOIN sales</code>?',o:['4','5','6','20'],a:2,
   e:'Adam e Pil hanno due vendite ciascuno, Eva una, e Lucy nessuna ma comunque una riga con dei NULL: 2 + 2 + 1 + 1 = 6.',h:'Conta le righe del risultato acquirente per acquirente; un acquirente senza vendite compare comunque una volta.'},
  {q:'Con t1 = {(1,\'a\'), (2,\'b\')} e t2 = {(1,\'a\'), (3,\'c\')}, quante righe restituiscono UNION e UNION ALL?',o:['4 e 4','3 e 3','2 e 4','3 e 4'],a:3,
   e:'Entrambe le tabelle contengono (1, \'a\'): UNION ALL tiene tutte e quattro le righe, UNION elimina il duplicato e ne restituisce tre.',h:'Scrivi le quattro righe e cerca quella che compare in entrambe le tabelle.'},
  {q:'Sulla tabella OrderItem del corso, quante righe restituisce <code>SELECT orderid, SUM(quantity) FROM OrderItem GROUP BY orderid HAVING COUNT(*) &gt;= 2</code>, e quale ordine ha la somma più grande?',o:['9 righe; l\'ordine 2','6 righe; l\'ordine 5','6 righe; l\'ordine 2','3 righe; l\'ordine 5'],a:1,
   e:'Gli ordini da 1 a 6 hanno due o più voci (l\'ordine 1 ne ha tre); gli ordini 7, 8 e 9 hanno una voce ciascuno e vengono scartati da HAVING. Le somme sono 27, 49, 45, 21, 50 e 21: l\'ordine 5 (35 + 15 = 50) è il più grande, appena sopra l\'ordine 2 (49).',h:'Conta prima le voci di ogni ordine, poi somma le loro quantità.'},
  {q:'Che tipo di sottoquery contiene <code>WHERE o.orderdate = (SELECT MAX(orderdate) FROM Orders o2 WHERE o2.customerid = o.customerid)</code>?',o:['Indipendente','Una verifica EXISTS','Che restituisce una tabella','Correlata'],a:3,
   e:'La query interna usa o.customerid della riga esterna, quindi è correlata e viene valutata di nuovo per ogni riga esterna.',h:'Cerca una colonna della query esterna usata dentro quella interna.'},
  {q:'Nell\'esempio di LAG della lezione, quanto vale PreviousPurchase sull\'ordine di Trujillo da 1444,8?',o:['1863,4','3730','0','2490,5'],a:1,
   e:'Gli ordini di Trujillo in ordine di data sono 1863,4, 3730, 1444,8, 2490,5. Sul terzo, LAG(TotalAmount, 1, 0) restituisce il secondo: 3730.',h:'LAG con n = 1 guarda una riga indietro dentro la stessa partizione, in ordine di OrderDate.'},
  {q:'Sul terzo ordine di Trujillo, quanto vale il totale progressivo <code>SUM(TotalAmount) OVER (PARTITION BY customerid ORDER BY OrderDate ROWS UNBOUNDED PRECEDING)</code>, e che quota è di <code>SUM(TotalAmount) OVER (PARTITION BY customerid)</code> sulla stessa riga?',o:['7038,2, circa il 74%','5593,4, circa il 59%','7038,2, circa il 52%','9528,7, il 100%'],a:0,
   e:'Totale progressivo: 1863,4 + 3730 + 1444,8 = 7038,2. Il totale della partizione è l\'intero 9528,7 di Trujillo, e 7038,2 / 9528,7 ≈ 0,74.',h:'La prima finestra si ferma alla riga corrente; la seconda copre tutta la partizione.'}
];

/* Lezione 4: gli strumenti dei Big Data */
INIT[4]=function(){
  codeHL($('#lezione-4'));
  /* nodes, racks, clusters */
  (function(){
    const trio=el('div','trio');$('#b4clus').append(legend([['#e6e6e6','blocco da 0,25 TB','box'],['#9a9a9a','nodo attivo']]),trio);
    [1,4,16].forEach(n=>{let s='';const racks=2;
      for(let r=0;r<racks;r++){const rx=8+r*114;s+=rect(rx,8,106,212,'none','#444')+tx(rx+53,238,'rack '+(r+1),{s:13,f:GRAY});
        for(let k=0;k<8;k++){const id=r*8+k,on=id<n,y=14+k*25.5;s+=rect(rx+5,y,96,21,on?'#1c1c1c':'#0d0d0d',on?'#9a9a9a':'#262626');
          if(on){const mine=Math.ceil((40-id)/n)>0?[...Array(40).keys()].filter(b=>b%n===id).length:0;
            for(let b=0;b<Math.min(mine,mine>10?7:10);b++)s+=rect(rx+9+b*9,y+5,6,11,'#e6e6e6');if(mine>10)s+=tx(rx+98,y+15,'×'+mine,{s:12.5,a:'end',f:'#e6e6e6'})}}}
      const k=Math.ceil(40/n),h=k*0.5;
      cell(trio,n+(n>1?' nodi':' nodo'),s,236,246,n+(n>1?' nodi':' nodo'),k+' blocc'+(k>1?'hi':'o')+' sul nodo più carico: <b>'+(h>=1?fi(h,1)+(h===1?' ora':' ore'):Math.round(h*60)+' minuti')+'</b>.')});
  })();
  /* eventual consistency at three moments */
  (function(){
    const root=$('#b4base');root.append(legend([[GRN,'aggiornato','box'],[RED,'valore superato','box'],['#fff','messaggio di replica']]));
    let s='<defs>'+arrowDef('b4m','#fff')+'</defs>';
    const titles=['1. Scrittura sul nodo 1','2. Lettura sul nodo 3','3. Dopo la replica'],notes=['Il nodo 1 conferma subito:','Il nodo 3 dà il valore vecchio:','Tutte le repliche concordano:'],notes2=['basically available','soft state','eventual consistency'];
    [[['London','Liverpool','Liverpool'],[],'scrittura: city = London',''],[['London','Liverpool','Liverpool'],[[0,1],[0,2]],'','lettura → Liverpool'],[['London','London','London'],[],'','']].forEach(([v,msg,w,rd],ix)=>{
      const ox=ix*242,N=[[ox+58,74,'Nodo 1'],[ox+182,74,'Nodo 2'],[ox+120,170,'Nodo 3']];
      s+=tx(ox+120,18,titles[ix],{s:14.5,f:'#fff',w:500});
      [[0,1],[0,2],[1,2]].forEach(([a,b])=>s+=line(N[a][0],N[a][1],N[b][0],N[b][1],'#333',1.5));
      msg.forEach(([a,b])=>{const x1=N[a][0],y1=N[a][1],x2=N[b][0],y2=N[b][1];s+='<line x1="'+(x1+(x2-x1)*.42)+'" y1="'+(y1+(y2-y1)*.42)+'" x2="'+(x1+(x2-x1)*.62)+'" y2="'+(y1+(y2-y1)*.62)+'" stroke="#fff" stroke-width="2.5" marker-end="url(#b4m)"/>'});
      N.forEach(([x,y,l],j)=>{const ok=v[j]===v[0];s+=rect(x-52,y-23,104,46,'#0d0d0d',ok?GRN:RED,' stroke-width="2"')+tx(x,y-5,l,{s:13,f:GRAY})+tx(x,y+15,v[j],{s:14.5,f:ok?'#fff':RED})});
      if(w)s+=lbl(ox+8,42,w,'#fff',{s:13,a:'start'});if(rd)s+=lbl(ox+120,212,rd,RED,{s:13});
      s+=tx(ox+120,240,notes[ix],{s:13.5,f:GRAY})+tx(ox+120,258,notes2[ix],{s:13.5,f:'#fff',w:600});
    });
    svgBox(root,724,266,s,'Coerenza finale in tre momenti','46rem');
  })();
  /* one customer in four NoSQL models */
  (function(){
    const duo=el('div','duo');$('#b4models').append(duo);
    let t=sTab(4,4,[{t:'chiave',w:120,c:PKC},{t:'valore',w:120}],[[{v:'first_name',f:PKC},'Mary'],[{v:'last_name',f:PKC},'Smith'],[{v:'city',f:PKC},'Liverpool'],[{v:'street_address',f:PKC},'123, Main St.']],{rh:28});
    tabCell(duo,'Chiave-valore',t,'Solo coppie, trovate per chiave. Strumenti: DynamoDB, BerkeleyDB, Project Voldemort.',330,'',206);
    let s=['{','  <tspan style="fill:'+PKC+'">"_id"</tspan>: "xyz123456",','  "first_name": "John",','  "last_name": "Doe",','  "address": {','    "street": "105, Main Street",','    "city": "London",','    "Country": "UK"','  }','}'].map((l,i)=>mono(40,22+i*19,l.replace(/^ +/,m=>'&#160;'.repeat(m.length)),{s:13})).join('');
    cell(duo,'Documento',s,330,206,'Documento','Un documento JSON che descrive se stesso e può contenere annidamenti. Strumenti: MongoDB, CouchDB.');
    s='';let cy=12;[['cust:1001',['first_name = Mary','last_name = Smith','city = Liverpool']],['cust:1002',['first_name = John','city = London']],['cust:1003',['last_name = Doe','email = jd@mail.com']]].forEach(([k,cols])=>{
      s+=tx(8,cy+16,k,{s:13.5,a:'start',f:PKC});let x=80,yy=cy;cols.forEach(c=>{const w=c.length*6.3+12;if(x+w>328){x=80;yy+=25}s+=rect(x,yy,w,22,'#141414','#444')+tx(x+w/2,yy+16,c,{s:12.5,f:'#fff'});x+=w+5});cy=yy+34});
    cell(duo,'Orientato alle colonne',s,330,190,'Famiglia di colonne','Ogni chiave di riga ha il proprio insieme di coppie colonna = valore. Strumenti: HBase, Cassandra.');
    s='';const nd=[[80,96,'Person','Mary Smith','#bbb'],[256,46,'City','Liverpool','#888'],[256,150,'Street','123, Main St.','#888']];
    [[0,1,'LIVES_IN'],[0,2,'LIVES_AT']].forEach(([a,b,l])=>{s+=line(nd[a][0],nd[a][1],nd[b][0],nd[b][1],'#777',2)+lbl((nd[a][0]+nd[b][0])/2-18,(nd[a][1]+nd[b][1])/2+(b===1?-10:22),l,GRAY,{s:12.5})});
    nd.forEach(([x,y,t_,l,c])=>{s+='<ellipse cx="'+x+'" cy="'+y+'" rx="62" ry="28" fill="#111" stroke="'+c+'" stroke-width="2"/>'+tx(x,y-4,t_,{s:12.5,f:GRAY})+tx(x,y+14,l,{s:13.5,f:'#fff'})});
    cell(duo,'Grafo',s,330,190,'Grafo','I luoghi diventano nodi, collegati da relazioni con un nome. Strumento: Neo4j.');
  })();
  /* dictionary encoding, as in the slide */
  (function(){
    const col=[2009,2010,2012,2009,2011,2009,2009,2009,2010,2012,2011,2011],dict=[2009,2010,2011,2012];let s='';
    s+=tx(110,18,'Year',{s:14,f:GRAY})+tx(380,18,'codice',{s:14,f:GRAY})+tx(590,18,'dizionario',{s:14,f:GRAY});
    col.forEach((y,i)=>{const yy=28+i*28,c=dict.indexOf(y);s+=rect(60,yy,100,24,'#141414','#666')+tx(110,yy+17,y,{s:14,f:'#fff'})+line(166,yy+12,326,yy+12,'#444',1,' stroke-dasharray="4 4"')+rect(330,yy,100,24,'#141414','#666')+tx(380,yy+17,c.toString(2).padStart(2,'0'),{s:14,f:MSC})});
    dict.forEach((y,j)=>{const yy=28+j*28;s+=rect(510,yy,160,24,'#141414','#666')+tx(590,yy+17,j+' ('+j.toString(2).padStart(2,'0')+')  →  '+y,{s:14,f:'#fff'})});
    s+=tx(590,28+4*28+26,'4 valori distinti',{s:13.5,f:GRAY})+tx(590,28+4*28+46,'= 2 bit per codice',{s:13.5,f:MSC});
    svgBox($('#b4dict'),720,28+12*28+6,s,'Codifica a dizionario di una colonna Year','40rem');
  })();
  /* run-length encoding, unsorted and sorted */
  (function(){
    const duo=el('div','duo');$('#b4rle').append(duo);const r=lcg(21),vals=Array.from({length:24},()=>Math.floor(r()*4)),sorted=vals.slice().sort((a,b)=>a-b);
    const shade=['#f0f0f0','#b4b4b4','#7a7a7a','#4a4a4a'];
    const runs=a=>{const o=[];a.forEach((v,i)=>{const l=o[o.length-1];if(l&&l[0]===v)l[2]++;else o.push([v,i+1,1])});return o};
    [['Non ordinata',vals],['Ordinata',sorted]].forEach(([title,a])=>{let s='';
      a.forEach((v,i)=>{const x=20+(i%8)*37,y=10+Math.floor(i/8)*40;s+=rect(x,y,34,34,shade[v])+tx(x+17,y+23,v,{s:15,f:v<2?'#000':'#fff'})});
      const rr=runs(a);rr.forEach((t,k)=>{s+=mono(14+(k%3)*104,150+Math.floor(k/3)*20,'('+t.join(', ')+')',{s:12.5,f:'#ddd'})});
      cell(duo,title,s,330,150+6*20+6,title,'<b>'+rr.length+' terne</b> per 24 valori.')});
  })();
  /* property graph model */
  (function(){
    let s='<defs>'+arrowDef('b4pa','#ccc')+'</defs>';const E=[100,104],Co=[380,104],Ci=[640,104];
    s+=line(Co[0]-58,104,E[0]+60,104,'#ccc',2.5,' marker-end="url(#b4pa)"')+line(Co[0]+56,104,Ci[0]-62,104,'#ccc',2.5,' marker-end="url(#b4pa)"');
    s+=lbl(240,80,':HAS_CEO',FKC,{s:14,w:600})+tx(240,96,'start_date: 2008-01-20',{s:13,f:GRAY})+lbl(510,94,':LOCATED_IN',FKC,{s:14,w:600});
    [[E,'Employee'],[Co,'Company'],[Ci,'City']].forEach(([[x,y],l])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="54" fill="#111" stroke="#bbb" stroke-width="2"/>'+tx(x,y+5,l,{s:15,f:'#fff'})});
    s+=tx(100,184,'name: Amy Peters',{s:13,f:GRAY})+tx(100,202,'date_of_birth: 1984-03-01',{s:13,f:GRAY})+tx(100,220,'employee_ID: 1',{s:13,f:GRAY});
    s+=tx(510,184,'le relazioni hanno una direzione',{s:13,f:GRAY});
    svgBox($('#b4pg'),720,228,s,'Property graph con un dipendente, un\'azienda e una città','44rem');
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
    $('#b4trav').append(legend([[PRC,'pattern trovato dalla query'],['#444','resto del grafo']]));
    svgBox($('#b4trav'),720,320,s,'Grafo di persone e film con un attraversamento','44rem');
    $('#b4trav').append(el('div','cellnote','Risultato: Harbor Lights con Leo Marsh e Nina Park; Paper Moons con Nina Park e Sara Kim.'));
  })();
  /* vector database flow */
  (function(){
    const st=[['1. Contenuto','testo o immagine'],['2. Embedding','modello di ML'],['3. Record','id + vettore','+ metadati'],['4. Indice ANN','struttura','per la vicinanza'],['5. Ricerca','primi k','vicini']];let s='<defs>'+arrowDef('b4fa',GRAY)+'</defs>';
    st.forEach((x,i)=>{const cx=72+i*144;s+=rect(cx-62,20,124,78,'#0d0d0d',i===4?BLUE:'#666')+tx(cx,44,x[0],{s:14,f:'#fff',w:500});x.slice(1).forEach((l,j)=>s+=tx(cx,66+j*18,l,{s:13,f:GRAY}));
      if(i<4)s+=line(cx+64,59,cx+78,59,GRAY,2,' marker-end="url(#b4fa)"')});
    s+=tx(360,128,'richiesta «città italiane» → embedding → vettore → record più vicini, ordinati per similarità',{s:13.5,f:GRAY});
    svgBox($('#b4flow'),720,140,s,'Flusso di un database vettoriale','46rem');
  })();
  /* vectors: drag the query */
  (function(){
    const pts=[['Roma',.62,.38],['Milano',.7,.44],['Parigi',.52,.52],['Berlino',.4,.6],['Madrid',.78,.3],['pizza',-.32,.64],['pasta',-.22,.74],['risotto',-.45,.56],['sushi',-.62,.42],['cucciolo',-.6,-.42],['gattino',-.48,-.55],['cavallo',-.75,-.22],['pappagallo',-.3,-.68],['auto',.52,-.5],['camion',.68,-.64],['bicicletta',.32,-.42]];
    const root=$('#b4vec'),W=520,H=520,X=v=>W/2+v*230,Y=v=>H/2-v*230;let q=[.66,.2];
    root.append(legend([[ORG,'richiesta (trascinala)','dot'],[BLUE,'i tre più simili','dot'],['#777','altri vettori memorizzati','dot']]));
    const box=el('div');box.style.cssText='width:100%;max-width:30rem;touch-action:none;cursor:grab';root.append(box);const o=out();root.append(o);
    function draw(){const sc=pts.map(p=>({p,c:(p[1]*q[0]+p[2]*q[1])/(Math.hypot(p[1],p[2])*Math.hypot(q[0],q[1]))})).sort((a,b)=>b.c-a.c);const top=new Set(sc.slice(0,3).map(x=>x.p[0]));
      let s=line(20,H/2,W-20,H/2,'#333',1)+line(W/2,20,W/2,H-20,'#333',1)+tx(W-22,H/2+20,'dimensione 1',{s:13,f:GRAY,a:'end'})+tx(W/2+8,32,'dimensione 2',{s:13,f:GRAY,a:'start'});
      s+=line(W/2,H/2,X(q[0]),Y(q[1]),ORG,2);sc.slice(0,3).forEach(x=>s+=line(W/2,H/2,X(x.p[1]),Y(x.p[2]),BLUE,1.5,' stroke-dasharray="4 4"'));
      pts.forEach(p=>{const on=top.has(p[0]);s+='<circle cx="'+X(p[1])+'" cy="'+Y(p[2])+'" r="'+(on?7:5)+'" fill="'+(on?BLUE:'#777')+'"/>'+(p[0]==='Roma'?lbl(X(p[1])-10,Y(p[2])+14,p[0],on?'#fff':'#999',{a:'end',s:14}):lbl(X(p[1])+10,Y(p[2])+5,p[0],on?'#fff':'#999',{a:'start',s:14}))});
      s+='<circle cx="'+X(q[0])+'" cy="'+Y(q[1])+'" r="12" fill="'+ORG+'"/>'+lbl(X(q[0])+16,Y(q[1])+24,'richiesta',ORG,{a:'start',s:14});
      box.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Spazio vettoriale a due dimensioni con una richiesta trascinabile">'+s+'</svg>';
      o.innerHTML='I più vicini per similarità del coseno: '+sc.slice(0,3).map(x=>'<b>'+x.p[0]+'</b> <span style="color:var(--blue)">'+x.c.toFixed(3).replace('.',',').replace('-','−')+'</span>').join('; ')+'.'}
    drag(box,e=>{const sv=box.querySelector('svg'),[x,y]=svgPoint(sv,e,W,H);let a=clamp(Math.round((x-W/2)/230*100)/100,-1,1),b=clamp(Math.round((H/2-y)/230*100)/100,-1,1);if(Math.hypot(a,b)<.06)a=.06;q=[a,b];draw()});
    draw();
  })();
};
QZ['4a']=()=>[{q:'Un sistema BASE ha appena accettato un nuovo indirizzo sul nodo 1. Una lettura sul nodo 3 un attimo dopo restituisce l\'indirizzo vecchio. Il sistema è guasto?',
  o:['Sì: ha violato la disponibilità di base.','No: è la coerenza finale all\'opera, e il nodo 3 si allineerà.','Sì: ogni sistema NoSQL garantisce transazioni ACID.','No, perché il nodo 3 avrebbe dovuto rifiutarsi di rispondere.'],a:1,
  e:'Con la coerenza finale un nodo può avere il valore vecchio subito dopo una scrittura; risponde comunque e si allinea quando la replica è completa.',h:'Ricorda le tre parole di BASE e il secondo riquadro della figura.'}];
QZ['4b']=()=>[{q:'Una colonna Year contiene gli anni dal 2009 al 2013. Quanti bit servono a ogni codice del dizionario?',o:['2','5','13','3'],a:3,
  e:'Cinque valori distinti: 2 bit danno solo 4 codici, 3 bit ne danno 8, quindi l\'arrotondamento per eccesso di log₂ 5 è 3.',h:'Quanti codici diversi si possono scrivere con 2 bit, e bastano?'}];
QZ['4c']=()=>[{q:'In uno schema relazionale con le tabelle Person, Movie, Directed (person_id, movie_id) e ActedIn (person_id, movie_id), quanti JOIN servono alla query «film diretti da Ava Reyes, con i loro attori»?',o:['1','2','4','6'],a:2,
  e:'Person (regista) → Directed → Movie → ActedIn → Person (attore): cinque riferimenti a tabelle, quattro join. Un database a grafo segue direttamente i due tipi di archi.',h:'Scrivi la catena di tabelle dal regista agli attori.'}];
QZ['4']=()=>[
  {q:'Una colonna Country ha 1.000.000 di righe e 200 valori distinti. Con la codifica a dizionario, quanti bit servono a ogni codice, e quanto spazio occupano all\'incirca i codici?',o:['200 bit; circa 25 MB','7 bit; circa 0,9 MB','8 bit; circa 1 MB','8 bit; circa 8 MB'],a:2,
   e:'7 bit danno solo 128 codici, quindi 200 valori richiedono ⌈log₂ 200⌉ = 8 bit, un byte: 1.000.000 di codici occupano circa 1.000.000 di byte, 1 MB, più un piccolo dizionario.',h:'Trova la più piccola potenza di 2 che arriva a 200, poi converti i bit in byte.'},
  {q:'Un bonifico preleva 100 da A, poi il server si guasta prima del versamento su B. Quale proprietà ACID garantisce che il prelievo venga annullato?',o:['Atomicità','Durabilità','Isolamento','Coerenza'],a:0,
   e:'L\'atomicità è la proprietà del tutto o niente: o avvengono sia il prelievo sia il versamento, o non avviene nessuno dei due.',h:'Rileggi i quattro significati in una riga e abbina ciascuno a ciò che è andato storto qui.'},
  {q:'In quale famiglia NoSQL ogni record porta con sé i nomi dei propri campi, può contenere record annidati e non deve avere la stessa struttura degli altri?',o:['Chiave-valore','Orientata ai grafi','Orientata alle colonne','Orientata ai documenti'],a:3,
   e:'Record che descrivono se stessi, annidabili e senza vincoli di schema sono documenti in JSON o XML, come in MongoDB e CouchDB.',h:'Confronta i quattro riquadri della figura sui modelli.'},
  {q:'Una colonna di 1200 righe contiene i codici 0, 1, 2 e 3, 300 volte ciascuno. Ordinata, quante terne run-length le servono?',o:['1200','300','2','4'],a:3,
   e:'Ordinata, la colonna è 300 zeri, poi 300 uno, 300 due e 300 tre: quattro sequenze, quattro terne.',h:'Immagina la colonna ordinata: dove comincia una sequenza nuova?'},
  {q:'Prendi a = (3, 4), b = (6, 8) e c = (4, −3). Quale affermazione è vera?',o:['b è più vicino ad a di c sia per coseno sia per distanza, con coseno 0,5','a e c hanno similarità del coseno 1','a e b hanno coseno 1 e distanza euclidea 5; a e c hanno coseno 0','Tutti e tre hanno la stessa similarità del coseno'],a:2,
   e:'b = 2a punta nella stessa direzione: coseno 1, distanza √(3² + 4²) = 5. a · c = 12 − 12 = 0, quindi a e c sono perpendicolari: coseno 0.',h:'Controlla se b è un multiplo di a, e calcola il prodotto scalare di a e c.'},
  {q:'Quale abbinamento fra dati e modello di coerenza è in linea con la discussione della lezione?',o:['Saldi bancari: BASE; like sui social: ACID','Saldi bancari: ACID; un contatore di like su un social network: BASE','Entrambi richiedono BASE','Entrambi richiedono ACID, altrimenti i dati vanno persi'],a:1,
   e:'Un bonifico deve essere tutto o niente e sempre coerente (ACID); un contatore di like può essere per un attimo non aggiornato su alcuni nodi e diventare coerente dopo (BASE), in cambio di disponibilità e scala.',h:'Chiediti dove un valore temporaneamente sbagliato sarebbe accettabile.'}
];

/* Lezione 5: Hadoop, HDFS e MapReduce */
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
    s+=rect(430,8,270,98,'#0d0d0d','#9a9a9a')+tx(565,28,'name node (metadati)',{s:14,f:'#fff',w:500});
    Object.keys(PLACE).forEach((b,i)=>{s+=tx(448,50+i*15,b+' → nodi '+PLACE[b].join(', '),{s:12.5,f:GRAY,a:'start'})});
    for(let r=0;r<3;r++){const rx=12+r*236;s+=rect(rx,130,224,196,'none','#444')+tx(rx+112,320,'rack '+(r+1),{s:13,f:GRAY});
      for(let k=0;k<3;k++){const n=r*3+k+1,nx=rx+8+k*72;s+=rect(nx,140,66,160,'#111','#666')+tx(nx+33,160,'nodo '+n,{s:13,f:'#fff'});
        onNode(n).forEach((b,j)=>s+=chip(nx+10,172+j*30,b))}}
    svgBox($('#b5hdfs'),720,332,s,'Blocchi e repliche di HDFS su tre rack','46rem');
  })();
  /* rack failure */
  (function(){
    const duo=el('div','duo');$('#b5fail').append(legend([[GRN,'blocco ancora leggibile','box'],[RED,'rack guasto','box']]),duo);
    [0,2].forEach(dead=>{let s='';
      for(let r=0;r<3;r++){const rx=6+r*112,isDead=r+1===dead;s+=rect(rx,6,104,214,isDead?'rgba(252,98,85,.12)':'none',isDead?RED:'#444',isDead?' stroke-width="2"':'')+tx(rx+52,24,'rack '+(r+1)+(isDead?' (guasto)':''),{s:13,f:isDead?RED:GRAY});
        for(let k=0;k<3;k++){const n=r*3+k+1,ny=34+k*61;s+=rect(rx+6,ny,92,55,isDead?'#1a0d0d':'#111',isDead?'#5a2a2a':'#555')+tx(rx+52,ny+16,'nodo '+n,{s:12.5,f:isDead?'#7a4a4a':'#ccc'});
          {const two=onNode(n).length===2;onNode(n).forEach((b,j)=>s+=chip(two?rx+9+j*46:rx+29,ny+26,b,{dead:isDead,w:two?42:46}))}}}
      ['B1','B2','B3','B4'].forEach((b,i)=>{const alive=PLACE[b].some(n=>Math.ceil(n/3)!==dead);s+=tx(40+i*80,246,b+(alive?' ✓':' ✗'),{s:14,f:alive?GRN:RED,w:600})});
      cell(duo,dead?'Il rack 2 si guasta':'Tutti i rack funzionano',s,342,258,'Stato del cluster',dead?'Ogni blocco conserva almeno una copia fuori dal rack 2: <span class="ok">nessun dato perso</span>.':'Ogni blocco ha tre copie su due rack.')});
  })();
  /* replication versus erasure coding */
  (function(){
    let s='';const L=180,R=600,X=v=>L+v/3*(R-L);
    [0,1,2,3].forEach(v=>{s+=line(X(v),16,X(v),118,'#222',1)+tx(X(v),136,v+' GB',{s:13,f:GRAY})});
    [['Fattore di replica 3',2,'3 GB occupati'],['Erasure coding',0.5,'1,5 GB occupati']].forEach(([l,o,t],i)=>{const y=26+i*48;
      s+=tx(L-12,y+21,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,X(1)-X(0),32,'#e6e6e6')+tx((X(0)+X(1))/2,y+21,'file',{s:13,f:'#000'})+rect(X(1),y,X(1+o)-X(1),32,'#6a6a6a')+tx((X(1)+X(1+o))/2,y+21,'+'+(o*100)+'%',{s:13,f:'#fff'})+tx(X(1+o)+8,y+21,t,{s:13.5,a:'start',f:'#fff'})});
    svgBox($('#b5ec'),720,146,s,'Spazio occupato da un file da 1 GB con replica ed erasure coding','46rem');
  })();
  /* MapReduce on A C B C A, animated */
  (function(){
    const root=$('#b5mr'),W=720,H=330;root.append(legend([[YEL,'chiave'],[BLUE,'valore'],[ORG,'shuffle: coppie che vanno al loro reducer']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const inp=['A','C','B','C','A'],keys=['A','B','C'],gy={A:70,B:165,C:260};
    const kv=(k,v,f)=>'<tspan style="fill:#ccc">(</tspan><tspan style="fill:'+YEL+'">'+k+'</tspan><tspan style="fill:#ccc">, </tspan><tspan style="fill:'+BLUE+'">'+v+'</tspan><tspan style="fill:#ccc">)</tspan>';
    const steps=[3,4,6,4,3],msgs=['L\'input «A C B C A» è diviso fra cinque task di map, ciascuno sul nodo che contiene la sua parte.','<b>Map.</b> Ogni task emette una coppia: la lettera come <span style="color:var(--yellow)">chiave</span>, 1 come <span style="color:var(--blue)">valore</span>.',
      '<b>Ordinamento, shuffle e raggruppamento.</b> Il sistema sposta ogni coppia al reducer della sua chiave e mette insieme i valori della stessa chiave: (A, {1, 1}), (B, {1}), (C, {1, 1}).','<b>Reduce.</b> Ogni reducer somma i valori della sua chiave.','<b>Output.</b> (A, 2), (B, 1), (C, 2) vengono scritti in un file in HDFS.'];
    const iy=i=>45+i*58;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='';
      s+=tx(40,22,'input',{s:13,f:GRAY})+tx(170,22,'map',{s:13,f:GRAY})+tx(470,22,'ordina e raggruppa per chiave',{s:13,f:GRAY})+tx(600,22,'reduce',{s:13,f:GRAY})+tx(686,22,'output',{s:13,f:GRAY});
      inp.forEach((c,k)=>{s+=tx(40,iy(k)+20,c,{s:18,f:'#fff',w:600});s+=rect(130,iy(k),80,32,'#111',i>=1?'#9a9a9a':'#444')+tx(170,iy(k)+21,'map',{s:13,f:i>=1?'#fff':'#666'})});
      keys.forEach(k=>{s+=rect(415,gy[k]-28,120,56,'#0d0d0d',i>=2?'#666':'#2a2a2a');s+=rect(568,gy[k]-18,64,36,'#111',i>=3?'#9a9a9a':'#333')+tx(600,gy[k]+5,'reduce',{s:12.5,f:i>=3?'#fff':'#555'})});
      inp.forEach((c,k)=>{const slot=inp.slice(0,k).filter(x=>x===c).length,many=inp.filter(x=>x===c).length>1,tx0=232,ty0=iy(k)+21,tx1=450,ty1=gy[c]+(many?(slot?16:-4):5);
        if(i===1){s+='<text x="'+tx0+'" y="'+ty0+'" font-size="14" opacity="'+e+'">'+kv(c,1)+'</text>'}
        if(i===2&&u<.97){const st=k*.15,ek=ease(clamp((u-st)/.3,0,1)),x=lerp(tx0,tx1,ek),y=lerp(ty0,ty1,ek);if(ek>0)s=line(212,ty0-5,x,y-5,ORG,1.5,' opacity=".8"')+s;s+='<text x="'+x+'" y="'+y+'" font-size="14" style="paint-order:stroke;stroke:#000;stroke-width:5px">'+kv(c,1)+'</text>'}});
      if(i>=3||(i===2&&u>=.97)){keys.forEach(k=>{const n=inp.filter(x=>x===k).length;s+='<text x="475" y="'+(gy[k]+5)+'" font-size="14" text-anchor="middle">'+kv(k,'{'+Array(n).fill(1).join(', ')+'}')+'</text>'})}
      if(i>=3){keys.forEach(k=>{const n=inp.filter(x=>x===k).length,a=i===3?e:1;s+='<text x="686" y="'+(gy[k]+5)+'" font-size="15" text-anchor="middle" opacity="'+a+'">'+kv(k,n)+'</text>'+line(634,gy[k],652,gy[k],'#777',1.5,' opacity="'+a+'"')})}
      if(i===4)s+=rect(650,40,72,250,'none','#9a9a9a',' stroke-dasharray="4 4"')+tx(686,312,'file HDFS',{s:12.5,f:GRAY});
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione di MapReduce">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 5. '+msgs[i]}
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
    const C=(a,b)=>[{t:'chiave',w:a,c:YEL},{t:'valore',w:b,c:BLUE,a:'e'}];
    let s='';const t1=sTab(10,30,C(110,60),m),t2=sTab(262,30,C(100,70),g),t3=sTab(514,30,C(110,60),r);
    s+=t1.s+t2.s+t3.s+tx(95,18,'Output del mapper',{s:14,f:'#fff',w:500})+tx(347,18,'Ordina e aggrega',{s:14,f:'#fff',w:500})+tx(599,18,'Output del reducer',{s:14,f:'#fff',w:500});
    s+=tx(232,150,'→',{s:22,f:GRAY})+tx(486,150,'→',{s:22,f:GRAY});
    svgBox($('#b5wc'),720,30+t2.h+10,s,'Tabelle del conteggio delle parole','46rem');
    $('#b5wc').append(el('div','cellnote',words.length+' parole nella frase, '+ks.length+' chiavi distinte: il reducer scrive '+ks.length+' coppie.'));
  })();
  /* latency scale */
  (function(){
    let s='';const L=40,R=690,lo=Math.log10(0.1),hi=Math.log10(36000),X=v=>L+(Math.log10(v)-lo)/(hi-lo)*(R-L);
    s+=line(L,80,R,80,'#777',1.5);
    [[0.1,'0,1 s'],[1,'1 s'],[10,'10 s'],[60,'1 min'],[600,'10 min'],[3600,'1 h'],[36000,'10 h']].forEach(([v,l])=>{s+=line(X(v),74,X(v),86,'#777',1.5)+tx(X(v),106,l,{s:13,f:GRAY})});
    s+=rect(X(0.1),38,X(5)-X(0.1),26,'rgba(88,196,221,.35)',BLUE)+tx((X(0.1)+X(5))/2,56,'query interattiva',{s:13,f:'#fff'});
    s+=rect(X(60),38,X(36000)-X(60),26,'rgba(255,134,47,.3)',ORG)+tx((X(60)+X(36000))/2,56,'job batch di MapReduce: da minuti a ore',{s:13,f:'#fff'});
    s+=tx((L+R)/2,132,'tempo di risposta, scala logaritmica',{s:13,f:GRAY});
    svgBox($('#b5lat'),720,140,s,'Tempi di risposta delle query interattive e dei job batch','46rem');
  })();
  /* the ecosystem */
  (function(){
    let s='';const B=(x,y,w,h,l,f,st)=>rect(x,y,w,h,f||'#141414',st||'#555')+tx(x+w/2,y+h/2+5,l,{s:13.5,f:'#fff'});
    s+=B(130,292,580,30,'HDFS · file system distribuito','#1e1e1e','#9a9a9a')+B(130,256,580,30,'YARN · negoziatore di risorse','#1e1e1e','#9a9a9a');
    s+=B(130,220,190,30,'MapReduce')+B(325,220,190,30,'Tez')+B(520,220,190,30,'Spark');
    s+=tx(10,258,'Servizi',{s:13,f:GRAY,a:'start'})+tx(10,276,'di base',{s:13,f:GRAY,a:'start'});
    s+=rect(130,108,580,104,'none','#444')+tx(140,126,'Servizi per i dati',{s:13,f:GRAY,a:'start'});
    ['Hive','Pig','HBase','HCatalog'].forEach((l,i)=>s+=B(140+i*142,136,132,30,l));['Storm','Flume','Sqoop'].forEach((l,i)=>s+=B(140+i*142,174,132,30,l));
    s+=rect(10,108,112,104,'none','#444')+tx(66,126,'Operativi',{s:13,f:GRAY});['Ambari','Oozie','Zookeeper'].forEach((l,i)=>s+=B(18,134+i*26,96,22,l));
    s+=rect(10,8,700,92,'none','#444')+tx(20,26,'Strumenti di analisi',{s:13,f:GRAY,a:'start'});
    {let x=20;[['Giraph',76],['Mahout',76],['Kylin',70],['Elastic Search',108],['Spark',70],['SAS',70],['R',60],['KNIME',76]].forEach(([l,w])=>{s+=B(x,40,w,30,l);x+=w+8});}
    s+=tx(133,90,'solo dentro Hadoop',{s:12.5,f:GRAY})+tx(357,90,'strumenti distribuiti',{s:12.5,f:GRAY})+tx(578,90,'si collegano da fuori',{s:12.5,f:GRAY});
    svgBox($('#b5eco'),720,330,s,'L\'ecosistema Hadoop in quattro strati','46rem');
  })();
  /* legacy versus modern stack */
  (function(){
    const duo=el('div','duo');$('#b5stack').append(duo);
    const chain=(items)=>{let s='<defs>'+arrowDef('b5ar'+items.length,GRAY)+'</defs>';const n=items.length;items.forEach((l,i)=>{const y=200-i*58;s+=box(60,y,220,40,[l],{fs:14});if(i<n-1)s+=line(170,y,170,y-14,GRAY,2,' marker-end="url(#b5ar'+n+')"')});return s};
    cell(duo,'Legacy, base installata',chain(['HDFS','YARN','Hive','Spark']),340,246,'Stack legacy','Si trova ancora in molte installazioni esistenti.');
    cell(duo,'Direzione moderna, ibrida',chain(['Object storage','Spark / Trino / Flink','Iceberg / Delta']),340,246,'Stack moderno','Storage nel cloud, motori più recenti, formati di tabella aperti.');
  })();
  wideFigs(5);
};
QZ['5a']=()=>[{q:'Un file da 1 GB (1024 MB) è memorizzato in HDFS con blocchi da 128 MB e il fattore di replica predefinito. Quante copie di blocchi finiscono sui data node?',o:['8','3','24','1024'],a:2,
  e:'1024 / 128 = 8 blocchi, ciascuno memorizzato 3 volte: 8 × 3 = 24 copie di blocchi.',h:'Conta prima i blocchi, poi ricorda quante copie di ogni blocco tiene HDFS per impostazione predefinita.'}];
QZ['5b']=()=>[{q:'Nella figura, il guasto di quale singolo rack renderebbe illeggibile il blocco B3?',o:['Rack 1','Rack 2','Rack 3','Nessuno'],a:3,
  e:'B3 ha copie sul nodo 6 (rack 2) e sui nodi 8 e 9 (rack 3). Perdere un rack qualunque lascia almeno una copia.',h:'Trova i rack che contengono copie di B3, e chiediti se un solo rack le contiene tutte.'}];
QZ['5c']=()=>[{q:'Un conteggio delle parole con MapReduce gira sul testo «to be or not to be». Quante coppie chiave/valore emettono i mapper, e quante ne scrive il reducer?',o:['4 e 6','6 e 6','6 e 4','4 e 4'],a:2,
  e:'I mapper emettono una coppia (parola, 1) per ogni parola: 6. Il reducer scrive una coppia per ogni parola distinta: (be, 2), (not, 1), (or, 1), (to, 2), quindi 4.',h:'I mapper lavorano parola per parola; il reducer chiave per chiave.'}];
QZ['5d']=()=>[{q:'Un\'analista di marketing vuole interrogare in SQL dati memorizzati in Hadoop, dallo strumento di BI che usa già. Quale componente lo rende possibile?',o:['Sqoop','Hive, attraverso un driver ODBC','Oozie','Zookeeper'],a:1,
  e:'Hive è l\'interfaccia SQL di Hadoop, e i driver ODBC delle distribuzioni permettono a qualunque strumento di BI o di reportistica di collegarsi a Hive come a un RDBMS.',h:'Ricorda quale servizio per i dati possono raggiungere gli strumenti di BI attraverso un driver standard.'}];
QZ['5e']=()=>[{q:'Perché Kylin può rispondere ad alcune query di Hive molto più in fretta di Hive da solo?',o:['Tiene in memoria una copia di tutti i dati grezzi','Salva in HBase aggregazioni precalcolate e risponde a partire da quelle','Sostituisce HDFS con un file system più veloce','Esegue le query sul portatile dell\'utente'],a:1,
  e:'Kylin è uno strumento OLAP che memorizza le aggregazioni nella memorizzazione a colonne di HBase e le usa per rispondere alle query di Hive, invece di ricalcolare le somme dalle righe di dettaglio.',h:'Ricorda che cosa preparano in anticipo gli strumenti OLAP.'}];
QZ['5']=()=>[
  {q:'Un\'azienda memorizza 10 TB di dati. Quanto spazio su disco le serve con fattore di replica 3, e quanto con l\'erasure coding al 50% di sovraccarico?',o:['30 TB e 15 TB','30 TB e 5 TB','13 TB e 15 TB','20 TB e 10 TB'],a:0,
   e:'La replica tiene tre copie complete: 3 × 10 = 30 TB. L\'erasure coding aggiunge il 50%: 10 + 5 = 15 TB.',h:'Il sovraccarico è lo spazio oltre ai dati stessi: calcola spazio occupato = dati × (1 + sovraccarico).'},
  {q:'MapReduce conta le lettere di «B A B C B A». Che cosa scrive il reducer?',o:['(A, 2), (B, 2), (C, 2)','(A, 2), (B, 3), (C, 1)','(A, {1, 1}), (B, {1, 1, 1}), (C, {1})','(B, 3)'],a:1,
   e:'Il raggruppamento dà (A, {1, 1}), (B, {1, 1, 1}), (C, {1}); il reducer somma ogni elenco: (A, 2), (B, 3), (C, 1).',h:'Una delle opzioni è l\'output del passo di raggruppamento, non del reducer.'},
  {q:'Con la regola di disposizione della figura (una copia su un rack, due su un altro), quanti rack devono guastarsi contemporaneamente, come minimo, perché qualche blocco diventi illeggibile?',o:['1','3','Non può mai succedere','2'],a:3,
   e:'Ogni blocco vive esattamente su due rack; se si guastano entrambi insieme, le sue tre copie spariscono. Il guasto di un solo rack non basta mai.',h:'Conta su quanti rack diversi sono sparse le copie di un singolo blocco.'},
  {q:'Per quale di questi lavori è progettato MapReduce?',o:['Aggiornare ogni secondo una dashboard delle vendite','Cercare un cliente per id','Aggregare di notte un anno di log di un server web','Rispondere in tempo reale alle domande SQL estemporanee degli analisti'],a:2,
   e:'MapReduce è costruito per carichi batch su dati enormi, che finiscono in minuti od ore; gli altri tre sono carichi interattivi.',h:'Pensa a quanto dura un job MapReduce e a quanto accetterebbe di aspettare ciascuno di questi utenti.'},
  {q:'Ogni notte un\'azienda importa la tabella dei clienti dal suo database Oracle in Hadoop, poi esegue su di essa un job Hive. Quali due strumenti sono adatti?',o:['Flume per importare, Ambari per pianificare','Sqoop per importare, Oozie per orchestrare i due job','Storm per importare, Zookeeper per pianificare','HBase per importare, Kylin per orchestrare'],a:1,
   e:'Sqoop sposta i dati fra un RDBMS e Hadoop; Oozie orchestra l\'esecuzione di job diversi, come un\'importazione con Sqoop seguita da un job Hive.',h:'Uno strumento è il ponte verso i database relazionali, l\'altro è lo strumento di workflow.'},
  {q:'Nella direzione moderna descritta nella lezione, che cosa prende il posto di HDFS e di MapReduce?',o:['YARN e Hive','Kafka e Zookeeper','HBase e Pig','L\'object storage, e motori come Spark, Trino o Flink'],a:3,
   e:'Il percorso moderno è object storage → Spark / Trino / Flink → Iceberg / Delta: lo storage nel cloud sostituisce HDFS, i motori più recenti sostituiscono MapReduce.',h:'Confronta i due riquadri della figura sugli stack strato per strato.'}
];

/* Lezione 6: Spark, RDD, DataFrame */
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
    a+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a1','lettura')+st(60,'passo 1')+v(94,108,'b6a1','scrittura')+cyl(130,110,80,40,'HDFS')+v(150,164,'b6a1','lettura')+st(166,'passo 2')+v(200,214,'b6a1','scrittura')+cyl(130,216,80,40,'HDFS');
    cell(duo,'MapReduce',a,340,262,'Traffico su disco di MapReduce','<b>4</b> operazioni su disco: HDFS prima e dopo ogni passo.');
    let b=ar('b6a2');
    b+=cyl(130,4,80,40,'HDFS')+v(44,58,'b6a2','lettura')+st(60,'passo 1')+v(94,112,'b6a2','')+chipM(120,116,100,30,'memoria')+v(151,164,'b6a2','')+st(166,'passo 2')+v(200,214,'b6a2','')+tx(170,236,'…',{s:20,f:GRAY});
    cell(duo,'Spark',b,340,262,'Traffico su disco di Spark','<b>1</b> lettura da disco: il passo 1 passa il suo risultato al passo 2 in memoria.');
  })();
  /* benchmarks */
  (function(){
    const duo=el('div','duo');$('#b6perf').append(duo);
    let s='';const L=80,R=300,X=v=>L+v/120*(R-L);
    [0,40,80,120].forEach(v=>{s+=line(X(v),14,X(v),112,'#222',1)+tx(X(v),130,v+' s',{s:13,f:GRAY})});
    [['Hadoop',110,'≈110 s'],['Spark',0.9,'0,9 s']].forEach(([l,v,t],i)=>{const y=24+i*46;s+=tx(L-10,y+20,l,{s:14,a:'end',f:'#fff'})+rect(X(0),y,Math.max(X(v)-X(0),2),30,i?'#fff':'#777')+tx(Math.max(X(v),X(0)+2)+8,y+20,t,{s:13.5,a:'start',f:'#fff'})});
    s+=tx(190,152,'tempo di esecuzione, regressione logistica',{s:13,f:GRAY});
    cell(duo,'Regressione logistica',s,340,166,'Benchmark della regressione logistica','Spark è più di <b>100 volte</b> più veloce in questo lavoro iterativo.');
    let t='';const rows=[['Tempo (min)',72,23],['Nodi',2100,206],['Core',50400,6592]];
    t+=tx(150,16,'2013 Hadoop, 102,5 TB',{s:12.5,f:GRAY,a:'start'});t+=tx(150,32,'2014 Spark, 100 TB',{s:12.5,f:'#fff',a:'start'});
    const th=v=>fi(v,0);rows.forEach(([l,h,sp],i)=>{const y=48+i*52,mx=h,W=126;t+=tx(140,y+22,l,{s:13.5,a:'end',f:'#fff'});
      t+=rect(150,y,W*h/mx,18,'#777')+tx(150+W+6,y+14,th(h),{s:13,a:'start',f:GRAY});
      t+=rect(150,y+21,Math.max(W*sp/mx,2),18,'#fff')+tx(150+Math.max(W*sp/mx,2)+6,y+35,th(sp),{s:13,a:'start',f:'#fff'})});
    cell(duo,'Benchmark di ordinamento',t,340,206,'Benchmark di ordinamento','Spark: circa <b>3 volte</b> più veloce con circa un decimo dei nodi.');
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
    s+=tx(250,58,'codice e task',{s:12.5,f:GRAY})+tx(250,250,'codice e task',{s:12.5,f:GRAY});
    s+=line(590,142,590,162,ORG,2.2,' marker-end="url(#b6r2)"')+line(610,162,610,142,ORG,2.2,' marker-end="url(#b6r2)"')+tx(622,157,'shuffle',{s:13,f:ORG,a:'start'});
    svgBox($('#b6arch'),720,302,s,'Architettura di un cluster Spark','46rem');
  })();
  /* RDD partitions */
  (function(){
    let s='';s+=tx(150,46,'RDD',{s:15,f:'#fff',a:'end',w:600});
    [0,1,2,3].forEach(i=>s+=partC(160+i*100,22,96,36,'partizione '+(i+1)));
    const nodes=[[40,[0,1]],[270,[2]],[500,[3]]];
    nodes.forEach(([x,ps])=>ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=line(208+p*100,58,cx+35,120,TEAL,1.3,' opacity=".7"')}));
    nodes.forEach(([x,ps],k)=>{s+=rect(x,120,190,104,'#0d0d0d','#666')+tx(x+95,140,'nodo '+(k+1),{s:13,f:GRAY})+rect(x+12,150,166,62,'#141414','#9a9a9a')+tx(x+22,168,'executor',{s:13,f:'#fff',a:'start'});
      ps.forEach((p,j)=>{const cx=x+(ps.length===2?20+j*76:57);s+=partC(cx,176,70,28,'P'+(p+1))})});
    svgBox($('#b6rdd'),720,232,s,'Un RDD di quattro partizioni su tre executor','46rem');
  })();
  /* lazy evaluation, animated */
  (function(){
    const root=$('#b6lazy'),W=720,H=346;root.append(legend([[TEAL,'partizione','box'],[ORG,'shuffle'],[PINK,'azione e risultato']]));
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const dag=['textFile','flatMap','map','reduceByKey','collect()'],dx=i=>10+i*142;
    const P=[{y:92,line:'I scream you scream',w:['I','scream','you','scream']},{y:216,line:'lets all scream for icecream',w:['lets','all','scream','for','icecream']}];
    const RK=[['all','for','I'],['icecream','lets'],['scream','you']],ry=k=>92+k*80;
    const cnt={};P.forEach(p=>p.w.forEach(w=>cnt[w]=(cnt[w]||0)+1));
    const where=w=>{for(let k=0;k<3;k++){const j=RK[k].indexOf(w);if(j>=0)return [k,j]}};
    const res=['I','all','for','icecream','lets','scream','you'];
    const steps=[2.5,2.5,2.5,2.5,3,4.5,4.5,3,3];
    const msgs=['<b>textFile</b> aggiunge un passo al DAG. Non è ancora stato letto nulla.','<b>flatMap</b> aggiunge un passo: le righe diventeranno parole. Ancora nulla di calcolato.','<b>map</b> aggiunge un passo: le parole diventeranno coppie (parola, 1). Ancora nulla di calcolato.',
      '<b>reduceByKey</b> aggiunge un passo che richiede uno shuffle. Il DAG è completo, e nessun task è ancora partito.','<span style="color:var(--pink)"><b>collect()</b></span> è un\'azione: Spark taglia il DAG allo shuffle in due stage e comincia a eseguirlo.',
      '<b>Stage 1.</b> Ogni partizione, sul proprio executor, legge la sua riga, la divide in parole e trasforma ogni parola in (parola, 1).','<b>Shuffle.</b> Le coppie si spostano fra gli executor perché tutte le coppie di una parola finiscano nella stessa partizione, fra le 3 di output.',
      '<b>Stage 2.</b> In ogni partizione reduceByKey somma i valori di ogni parola: (scream, 3).','<b>Risultato.</b> collect() riporta le sette coppie al driver.'];
    const T=function(x,y,c,o,halo){return '<text x="'+x+'" y="'+y+'" font-size="13"'+(o!==undefined?' opacity="'+o+'"':'')+(halo?' style="paint-order:stroke;stroke:#000;stroke-width:5px"':'')+'>'+c+'</text>'};
    const pPos=(p,j)=>[22+(j%3)*104,P[p].y+46+Math.floor(j/3)*24];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b6d1',GRAY)+'</defs>';
      dag.forEach((d,k)=>{const vis=k<4?i>=k:i>=4;if(!vis)return;const a=(i>0&&(k===i||(k===4&&i===4)))?e:1,act=k===4;
        s+='<g opacity="'+a+'">'+rect(dx(k),8,128,34,act?'rgba(220,117,205,.2)':'#141414',act?PINK:'#9a9a9a')+tx(dx(k)+64,30,d,{s:13.5,f:act?PINK:'#fff'})+(k?line(dx(k)-13,25,dx(k)-2,25,GRAY,1.5,' marker-end="url(#b6d1)"'):'')+'</g>'});
      if(i>=4){const a=i===4?e:1;s+='<g opacity="'+a+'">'+line(10,50,422,50,i===5?'#fff':'#777',1.5)+tx(216,68,'stage 1',{s:13,f:i===5?'#fff':GRAY})+line(436,50,564,50,i===7?'#fff':'#777',1.5)+tx(500,68,'stage 2',{s:13,f:i===7?'#fff':GRAY})+line(429,4,429,74,ORG,1.5,' stroke-dasharray="4 3"')+'</g>'}
      if(i<4){s+=tx(360,200,'Cresce solo il piano: nessun dato letto, nessun task eseguito.',{s:14,f:GRAY});s+=tx(360,224,'task eseguiti finora: 0',{s:13,f:GRAY})}
      else{
        P.forEach((p,k)=>{s+=rect(10,p.y,320,110,'#0b0b0b',i===5?TEAL:'#3d6b60')+tx(20,p.y+18,'partizione '+(k+1)+' · executor '+(k+1),{s:12.5,f:TEAL,a:'start'});
          if(i===5&&u<.3)s+=tx(170,p.y+62,'"'+p.line+'"',{s:13.5,f:'#fff'});
          if(i===5&&u>=.3&&u<.62)p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,'<tspan style="fill:#fff">'+w+'</tspan>')});
          if((i===5&&u>=.62)||(i===6&&u<.02))p.w.forEach((w,j)=>{const [x,y]=pPos(k,j);s+=T(x,y,kvT(w,1))})});
        RK.forEach((ks,k)=>{s+=rect(420,ry(k),170,72,'#0b0b0b',i===7?TEAL:'#3d6b60')+tx(430,ry(k)+16,'partizione di output '+(k+1),{s:12.5,f:TEAL,a:'start'})});
        if(i===6){let g=0;P.forEach((p,k)=>p.w.forEach((w,j)=>{const st=g*.07,ek=ease(clamp((u-st)/.35,0,1)),[x0,y0]=pPos(k,j),[rk,rj]=where(w),x1=432,y1=ry(rk)+34+rj*16,x=lerp(x0,x1,ek),y=lerp(y0,y1,ek);
          if(ek>0&&ek<1)s=s.replace('</defs>','</defs>'+line(x0+40,y0-5,x+20,y-5,ORG,1.4,' opacity=".75"'));if(ek<1||u<.97)s+=T(x,y,kvT(w,1),undefined,1);g++}));}
        if(i===6&&u>=.97||i===7){RK.forEach((ks,k)=>ks.forEach((w,j)=>{const y=ry(k)+34+j*16,gr=kvT(w,'{'+Array(cnt[w]).fill(1).join(', ')+'}'),sm=kvT(w,cnt[w]);
          if(i===6||e<.5)s+=T(432,y,gr,i===6?1:1-2*e);else s+=T(432,y,sm,2*e-1)}))}
        if(i===8)RK.forEach((ks,k)=>ks.forEach((w,j)=>s+=T(432,ry(k)+34+j*16,kvT(w,cnt[w]))));
        s+=rect(606,92,108,232,'#0b0b0b',i>=8?PINK:'#5a3a55')+tx(660,110,'driver',{s:13,f:PINK});
        if(i===8)res.forEach((w,r)=>{const [rk,rj]=where(w),x0=432,y0=ry(rk)+34+rj*16,x1=614,y1=136+r*25,ek=ease(clamp((u-r*.08)/.4,0,1));
          if(ek>0&&ek<1)s+=line(560,y0-5,lerp(560,x1,ek),lerp(y0,y1,ek)-5,PINK,1.3,' opacity=".7"');if(ek>0)s+=T(lerp(x0,x1,ek),lerp(y0,y1,ek),kvT(w,cnt[w]),undefined,1)});
      }
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione dell\'esecuzione pigra">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 9. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* RDD vs DataFrame */
  (function(){
    const duo=el('div','duo');$('#b6df').append(duo);
    let a='';for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=30+c*96,y=14+r*58;a+=rect(x,y,84,44,'#2a2a2a','#555')+tx(x+42,y+27,'User',{s:13.5,f:'#ccc'})}
    cell(duo,'RDD[User]',a,340,190,'RDD di oggetti opachi','Spark non può vedere dentro ogni oggetto.');
    const rows=[['Ann','34','F'],['Bob','36','M'],['Cleo','30','F'],['Dan','29','M']];
    const t=sTab(40,14,[{t:'Name',w:100},{t:'Age',w:80,a:'e',c:BLUE},{t:'Sex',w:80,a:'m'}],rows);
    let b=t.s+tx(170,t.h+36,'schema: Name string, Age int, Sex string',{s:12.5,f:GRAY});
    cell(duo,'DataFrame',b,340,190,'DataFrame con uno schema','Spark conosce i nomi e i tipi delle colonne.');
  })();
  /* sales.csv */
  (function(){
    const raw=[[20160901,'ProdABD',100,1],[20160901,'ProdDEF',200,2],[20161001,'ProdXYZ',150,3],[20161015,'ProdABD',160,1],[20161031,'ProdXYZ',20,5],[20161101,'ProdABD',50,3],[20161115,'ProdXYZ',200,4],[20161130,'ProdABD',300,4],[20161201,'ProdDEF',160,1],[20161210,'ProdABD',670,2],[20161220,'ProdDEF',100,5]];
    const t1=sTab(10,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE},{t:'customer_id',w:100,a:'e'}],raw.map(r=>r.map(String)),{bg:i=>raw[i][2]>200?OKBG:null});
    const kept=raw.filter(r=>r[2]>200);const t2=sTab(410,30,[{t:'date',w:96},{t:'product',w:92},{t:'value',w:66,a:'e',c:BLUE}],kept.map(r=>[String(r[0]),r[1],String(r[2])]));
    const sum={};raw.forEach(r=>sum[r[1]]=(sum[r[1]]||0)+r[2]);
    const t3=sTab(410,170,[{t:'product',w:110},{t:'sum(value)',w:110,a:'e',c:BLUE}],Object.keys(sum).sort().map(k=>[k,String(sum[k])]));
    let s=t1.s+t2.s+t3.s+tx(10,18,'sales.csv',{s:14,f:'#fff',a:'start',w:500})+tx(410,18,'filter(value > 200)',{s:14,f:'#fff',a:'start',w:500})+tx(410,158,'groupBy("product").sum("value")',{s:14,f:'#fff',a:'start',w:500});
    $('#b6sales').append(legend([[GRN,'riga tenuta dal filtro','box']]));
    svgBox($('#b6sales'),720,30+t1.h+8,s,'La tabella delle vendite e due risultati','46rem');
  })();
  wideFigs(6);
};
QZ['6a']=()=>[{q:'Un job MapReduce ha 5 passi. Ogni passo legge il suo input da HDFS e scrive il suo output in HDFS. Quante letture e scritture su HDFS esegue il job?',o:['5','6','10','2'],a:2,
  e:'Ogni passo costa una lettura e una scrittura: 5 × 2 = 10 operazioni su disco. Spark leggerebbe una volta e terrebbe in memoria i risultati intermedi.',h:'Conta le operazioni su disco di un passo nel primo riquadro della figura, poi moltiplica.'}];
QZ['6b']=()=>[{q:'Il tuo portatile ha 8 core. Quanti worker usa Spark con master local[*], e quanti con local[2]?',o:['1 e 2','8 e 8','8 e 2','2 e 8'],a:2,
  e:'local[*] usa tanti worker quanti sono i core della macchina, qui 8; local[K] ne usa esattamente K, qui 2.',h:'Guarda le righe di local[K] e local[*] nella tabella dei valori di master.'}];
QZ['6c']=()=>[{q:'Uno script esegue rdd = sc.textFile("logs.txt").filter(...).map(...) e finisce lì. Quanti task esegue Spark?',o:['Uno per partizione, per ciascuno dei tre passi','Nessuno','Uno, per textFile','Dipende dal cluster manager'],a:1,
  e:'textFile, filter e map sono tutte trasformazioni: aggiungono solo passi al DAG. Senza un\'azione non viene eseguito nulla.',h:'Chiediti se lo script contiene un\'operazione che restituisce un valore.'}];
QZ['6d']=()=>[{q:'Sul file sales.csv del corso, che cosa restituisce spark.sql("select product, sum(value) from sales where value >= 200 group by product") per ProdABD?',o:['1280','970','670','300'],a:1,
  e:'ProdABD ha i valori 100, 160, 50, 300, 670. La clausola where tiene 300 e 670 (200 o più), e la loro somma è 970.',h:'Applica prima la clausola where alle righe di ProdABD, poi somma.'}];
QZ['6']=()=>[
  {q:'Nel benchmark di ordinamento, Hadoop ha ordinato 102,5 TB in 72 minuti su 2100 nodi; Spark ha ordinato 100 TB in 23 minuti su 206 nodi. All\'incirca, Spark è stato',o:['3 volte più veloce con 10 volte meno nodi','10 volte più veloce con 3 volte meno nodi','3 volte più veloce con gli stessi nodi','più o meno altrettanto veloce con 10 volte meno nodi'],a:0,
   e:'72 / 23 ≈ 3,1 per il tempo e 2100 / 206 ≈ 10,2 per i nodi, su quasi la stessa quantità di dati.',h:'Calcola due rapporti: tempo e nodi.'},
  {q:'Un programma esegue textFile → flatMap → map → reduceByKey → sortByKey → collect(). In quanti stage viene tagliato il suo DAG?',o:['1','2','3','5'],a:2,
   e:'Gli stage si tagliano a ogni shuffle. Aggregare (reduceByKey) e ordinare (sortByKey) ne richiedono uno ciascuno, quindi due shuffle danno tre stage.',h:'Conta le operazioni che richiedono di spostare dati fra gli executor.'},
  {q:'Nel conteggio delle parole della lezione, reduceByKey(..., 3) produce l\'output. Quale affermazione è vera?',o:['Ognuna delle 3 partizioni di output può contenere coppie della parola «scream»','Le 7 parole distinte sono sparse su 3 partizioni, e tutte le coppie di una parola finiscono nella stessa','L\'output ha 3 coppie, una per partizione','Lo shuffle avviene dopo che reduceByKey ha sommato i valori'],a:1,
   e:'Il 3 fissa il numero delle partizioni di output; lo shuffle manda ogni coppia di una parola alla stessa partizione, così la somma di ogni parola si calcola in un solo posto.',h:'Pensa a perché serve lo shuffle prima di poter calcolare le somme.'},
  {q:'Esegui sales.createOrReplaceTempView("sales") e sales.write.saveAsTable("bemacs_sales_table"), poi riavvii Spark e ti colleghi allo stesso metastore. Che cosa puoi ancora interrogare?',o:['Entrambe','Solo la vista temporanea sales','Solo bemacs_sales_table','Nessuna delle due'],a:2,
   e:'Una vista temporanea vive quanto la sessione; saveAsTable materializza una tabella persistente nel metastore di Hive, che sopravvive ai riavvii.',h:'Ricorda dove ciascuna delle due istruzioni tiene la sua tabella.'},
  {q:'Su sales.csv, sales.filter(sales["value"] > 150).groupBy("product").count() restituisce quali conteggi per ProdABD, ProdDEF e ProdXYZ?',o:['5, 3 e 3','3, 1 e 1','2, 2 e 1','3, 2 e 1'],a:3,
   e:'ProdABD tiene 160, 300, 670 (3); ProdDEF tiene 200, 160 (2); ProdXYZ tiene solo 200, perché 150 non è maggiore di 150 (1).',h:'Attenzione alla disuguaglianza stretta sul valore 150.'},
  {q:'Un ingegnere filtra un RDD di oggetti User con una lambda su u.age; un altro filtra un DataFrame con df["age"] > 40. Perché Spark può ottimizzare solo il secondo?',o:['I DataFrame sono sempre memorizzati su disco','Spark conosce lo schema del DataFrame, mentre gli elementi di un RDD sono oggetti opachi','Gli RDD non si possono filtrare','Le lambda girano solo sul driver'],a:1,
   e:'Un DataFrame è una collezione con uno schema noto a Spark SQL, quindi Spark può vedere quale colonna viene usata; dentro un RDD di oggetti User Spark non vede la struttura.',h:'Ricorda i due riquadri della figura RDD contro DataFrame.'}
];

/* Lezione 7: Structured Streaming, grafi, MLlib */
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
    const msgs=['La query, contare le parole, si scrive una volta sola. Il flusso comincia.','<b>Tempo 1.</b> Arrivano due righe e vengono aggiunte alla tabella di input come righe nuove.','<b>Risultato al tempo 1:</b> cat 1, dog 3. Viene scritta l\'intera tabella dei risultati.',
      '<b>Tempo 2.</b> Una nuova riga di testo, «owl cat», diventa una nuova riga della tabella.','<b>Risultato al tempo 2:</b> cat passa a 2 e owl compare con 1; dog non cambia.','<b>Tempo 3.</b> Due righe nuove, «dog» e «owl».','<b>Risultato al tempo 3:</b> dog 4 e owl 2. Sono state elaborate solo le righe nuove.'];
    const ry=r=>84+r*28;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b7a1',GRAY)+'</defs>';
      const now=i===0?0:Math.ceil(i/2);
      s+=rect(14,70,136,104,'#0d0d0d','#666')+tx(82,90,'flusso di dati',{s:13.5,f:'#fff'})+tx(82,112,now?'tempo '+now:'in attesa',{s:13,f:GRAY});
      s+=line(152,122,180,122,GRAY,1.6,' marker-end="url(#b7a1)"');
      s+=tx(280,26,'Tabella di input (illimitata)',{s:14,f:'#fff',w:500})+tx(574,26,'Tabella dei risultati',{s:14,f:'#fff',w:500});
      s+=tx(196,62,'tempo',{s:13,f:GRAY,a:'start'})+tx(256,62,'riga',{s:13,f:GRAY,a:'start'})+line(190,68,370,68,'#555',1);
      s+=tx(484,62,'parola',{s:13,f:GRAY,a:'start'})+tx(664,62,'conteggio',{s:13,f:BLUE,a:'end'})+line(478,68,670,68,'#555',1);
      s+=line(380,122,468,122,GRAY,1.6,' marker-end="url(#b7a1)"')+tx(424,108,'query:',{s:12.5,f:GRAY})+tx(424,144,'conta parole',{s:12.5,f:GRAY});
      L.forEach(([tt,l],r)=>{if(tt>now)return;const arriving=i%2===1&&tt===now,x=arriving?lerp(30,196,e):196,a=arriving?e:1,c=tt===now?'#fff':'#8a8a8a';
        s+='<g opacity="'+a+'">'+tx(x,ry(r)+5,String(tt),{s:13.5,f:c,a:'start'})+tx(x+60,ry(r)+5,l,{s:13.5,f:c,a:'start'})+'</g>';if(!arriving)s+=line(190,ry(r)+14,370,ry(r)+14,'#222',1)});
      const shown=i===0?0:(i%2===0?now:now-1);
      if(shown){const cur=R[shown],prev=R[shown-1]||{},fresh=i%2===0;
        Object.keys(cur).sort().forEach((w,r)=>{const ch=fresh&&cur[w]!==prev[w];if(ch)s+=rect(478,ry(r)-14,192,26,'rgba(255,255,255,.12)');
          s+=tx(484,ry(r)+5,w,{s:13.5,f:'#fff',a:'start'})+tx(664,ry(r)+5,String(cur[w]),{s:13.5,f:BLUE,a:'end',w:ch?600:undefined})+line(478,ry(r)+14,670,ry(r)+14,'#222',1)})}
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione del conteggio delle parole in streaming">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 7. '+msgs[i]}
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
    const tv=sTab(440,24,[{t:'Id',w:40},{t:'Proprietà (V)',w:170}],[['3','(rxin, student)'],['7','(jgonzal, postdoc)'],['5','(franklin, professor)'],['2','(istoica, professor)']]);
    const te=sTab(440,182,[{t:'SrcId',w:56},{t:'DstId',w:56},{t:'Proprietà (E)',w:110}],[['3','7','Collaborator'],['5','3','Advisor'],['2','5','Colleague'],['5','7','PI']]);
    s+=tv.s+te.s+tx(440,14,'Tabella dei vertici',{s:13,f:GRAY,a:'start'})+tx(440,172,'Tabella degli archi',{s:13,f:GRAY,a:'start'});
    svgBox($('#b7pg'),720,322,s,'Esempio di property graph in GraphX','46rem');
  })();
  /* the GraphFrames graph */
  (function(){
    const sc=2,ox=10,oy=24,P={};Object.keys(GU).forEach(k=>P[k]=[GU[k][0]*sc+ox,GU[k][1]*sc+oy]);
    let s='<defs>'+arrowDef('b7f1','#fff')+arrowDef('b7f2','#9a9a9a')+'</defs>';
    s+=line(200,14,240,14,'#fff',1.8)+tx(248,19,'friend',{s:13,f:'#fff',a:'start'})+'<line x1="330" y1="14" x2="370" y2="14" '+FOL+'/>'+tx(378,19,'follow',{s:13,f:'#ccc',a:'start'});
    GE.forEach(([a,b,t])=>s+=gEdge(P,a,b,24,t==='friend'?FRI:FOL,t==='friend'?'b7f1':'b7f2'));
    const lp={a:[-34,5,'end'],b:[0,-34,'middle'],c:[34,5,'start'],d:[-34,5,'end'],e:[0,44,'middle'],f:[34,5,'start'],g:[0,44,'middle']};
    Object.keys(P).forEach(k=>{const [x,y]=P[k],[dx,dy,an]=lp[k];s+=gNode(x,y,24,k,{s:16})+tx(x+dx,y+dy,GV[k][0]+', '+GV[k][1],{s:13.5,f:GRAY,a:an})});
    svgBox($('#b7gf'),720,414,s,'Grafo sociale del notebook su GraphFrames','46rem');
  })();
  /* query results, four panels */
  (function(){
    const duo=el('div','duo');$('#b7gq').append(duo);const P=GU,r=16;let n=0;
    const base=(fade)=>{n++;let s='<defs>'+arrowDef('b7q'+n+'a','#fff')+arrowDef('b7q'+n+'b','#9a9a9a')+arrowDef('b7q'+n+'c','#3a3a3a')+'</defs>';
      GE.forEach(e=>{const f=fade&&fade(e);s+=gEdge(P,e[0],e[1],r,f?'stroke="#3a3a3a" stroke-width="1.4"'+(e[2]==='follow'?' stroke-dasharray="5 4"':''):(e[2]==='friend'?FRI:FOL),f?'b7q'+n+'c':(e[2]==='friend'?'b7q'+n+'a':'b7q'+n+'b'))});return s};
    const deg={};Object.keys(GV).forEach(k=>deg[k]=[0,0]);GE.forEach(([a,b])=>{deg[a][1]++;deg[b][0]++});
    const rows=Object.keys(GV).filter(k=>deg[k][0]+deg[k][1]).map(k=>[GV[k][0]+' ('+k+')',String(deg[k][0]),String(deg[k][1]),String(deg[k][0]+deg[k][1])]);
    const t=sTab(20,8,[{t:'vertice',w:110},{t:'entrante',w:66,a:'e',c:BLUE},{t:'uscente',w:62,a:'e',c:BLUE},{t:'grado',w:54,a:'e',c:BLUE}],rows);
    cell(duo,'inDegrees, outDegrees, degrees',t.s,340,200,'Gradi','I gradi entranti sommano a 8, come quelli uscenti: uno per arco.');
    const OFF={a:[-24,5,'end'],b:[22,-10,'start'],c:[22,5,'start'],d:[-24,5,'end'],e:[0,36,'middle'],f:[22,5,'start'],g:[0,34,'middle']};
    const keep=['a','b','e'];let s=base(e=>!(e[2]==='friend'&&keep.includes(e[0])&&keep.includes(e[1])));
    Object.keys(P).forEach(k=>{const [x,y]=P[k],on=keep.includes(k);s+=gNode(x,y,r,k,{st:on?'#fff':'#444',c:on?'#fff':'#555',f:on?'#1a1a1a':'#0d0d0d'})+tx(x+OFF[k][0],y+OFF[k][1],String(GV[k][1]),{s:13,f:on?'#fff':'#555',a:OFF[k][2]})});
    cell(duo,'Sottografo: amici con più di 30 anni',s,340,214,'Sottografo','Restano Alice, Bob ed Esther, con due archi.');
    s=base()+'<rect x="30" y="6" width="234" height="196" rx="16" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>'+'<rect x="290" y="6" width="44" height="58" rx="14" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>';
    Object.keys(P).forEach(k=>s+=gNode(P[k][0],P[k][1],r,k));s+=tx(147,218,'componente 1',{s:13,f:GRAY})+tx(268,82,'componente 2',{s:12,f:GRAY,a:'start'});
    cell(duo,'Componenti connesse',s,340,228,'Componenti connesse','Due componenti: tutti gli altri, e Gabby da sola.');
    s='<polygon points="'+['a','d','e'].map(k=>P[k].join(',')).join(' ')+'" fill="rgba(255,255,255,.13)"/>'+base();
    const tri={a:1,d:1,e:1};Object.keys(P).forEach(k=>{const [x,y]=P[k];s+=gNode(x,y,r,k)+tx(x+OFF[k][0],y+OFF[k][1],String(tri[k]||0),{s:14,f:tri[k]?'#fff':'#666',w:600,a:OFF[k][2]})});
    cell(duo,'Conteggio dei triangoli',s,340,214,'Conteggio dei triangoli','Alice, David ed Esther stanno ciascuno su un triangolo.');
  })();
  /* ML pipeline */
  (function(){
    let s='<defs>'+arrowDef('b7p1',GRAY)+'</defs>';const cx=c=>10+c*118,W=100,H=56;
    const B=(c,y,l,k,o)=>box(cx(c),y,W,H,[l,k],Object.assign({fs:13.5},o||{}));
    const A=(c,y)=>line(cx(c)+W+2,y+H/2,cx(c+1)-3,y+H/2,GRAY,1.5,' marker-end="url(#b7p1)"');
    s+=tx(10,22,'pipeline.fit(training)',{s:14,f:'#fff',a:'start',w:500});
    const y1=34;s+=B(0,y1,'training','DataFrame',{f:'#141414',st:'#555'})+B(1,y1,'Tokenizer','transformer')+B(2,y1,'HashingTF','transformer')+rect(cx(3),y1,W,H,'#0d0d0d','#fff',' stroke-width="2"')+tx(cx(3)+W/2,y1+16,'Logistic',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+32,'Regression',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+48,'estimator',{s:12.5,f:GRAY})+B(4,y1,'modello','transformer');
    [0,1,2,3].forEach(c=>s+=A(c,y1));
    [['«sugar flour eggs»','etichetta 1'],['sugar, flour,','eggs'],['posizioni 864,','351, 289'],['impara un peso','per posizione'],['tokenizer, hashing','e pesi']].forEach(([a,b],c)=>{s+=tx(cx(c)+W/2,y1+H+20,a,{s:12.5,f:GRAY})+tx(cx(c)+W/2,y1+H+36,b,{s:12.5,f:GRAY})});
    const y2=206;s+=tx(10,194,'model.transform(test), poi valutazione',{s:14,f:'#fff',a:'start',w:500});
    s+=B(0,y2,'test','DataFrame',{f:'#141414',st:'#555'})+B(1,y2,'Tokenizer','transformer')+B(2,y2,'HashingTF','transformer')+B(3,y2,'modello LR','transformer')+B(4,y2,'previsioni','DataFrame',{f:'#141414',st:'#555'})+B(5,y2,'Evaluator','evaluator',{sw:2,st:'#fff'});
    [0,1,2,3,4].forEach(c=>s+=A(c,y2));
    s+=line(cx(4)+W/2,y1+H+44,cx(3)+W/2+6,y2-4,GRAY,1.3,' stroke-dasharray="5 4" marker-end="url(#b7p1)"');
    s+=tx(cx(3)+W/2,y2+H+20,'punteggio e',{s:12.5,f:GRAY})+tx(cx(3)+W/2,y2+H+36,'probabilità',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+20,'aggiunge la colonna',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+36,'prediction',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+20,'accuratezza,',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+36,'F1, AUC',{s:12.5,f:GRAY});
    svgBox($('#b7pipe'),720,306,s,'La pipeline di regressione logistica','46rem');
  })();
  /* predictions on the test set */
  (function(){
    const rows=[[4,'I like fried eggs','eggs +1,52',0.38,0.59,1,1],[5,'he day trip to the island was so exhausting','trip −1,52, exhausting +1,52',-1.14,0.24,0,0],
      [6,'I like the sea, the sun and I like swimming','nessuna',-1.14,0.24,0,0],[7,'eggs sea flour','eggs +1,52, sea −1,52, flour +2,28',1.14,0.76,1,1]];
    const X=[14,50,410,480,570,660],hd=['id','frase, e le parole con un peso','punteggio','P(etich. 1)','previsione','etichetta'];
    let s='';hd.forEach((h,j)=>s+=tx(X[j]+(j>1?50:0),20,h,{s:13,f:j===3?BLUE:GRAY,a:j>1?'end':'start'}));s+=line(10,28,710,28,'#555',1);
    rows.forEach((r,k)=>{const y=34+k*54;
      s+=tx(X[0],y+20,String(r[0]),{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+20,'"'+r[1]+'"',{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+40,r[2],{s:12.5,f:GRAY,a:'start'});
      s+=tx(X[2]+50,y+28,fi(r[3],2),{s:13.5,f:'#fff',a:'end'})+tx(X[3]+50,y+28,fi(r[4],2),{s:13.5,f:BLUE,a:'end'})+tx(X[4]+50,y+28,r[5]+' ✓',{s:13.5,f:GRN,a:'end'})+tx(X[5]+50,y+28,String(r[6]),{s:13.5,f:'#fff',a:'end'});
      s+=line(10,y+52,710,y+52,'#222',1)});
    svgBox($('#b7pred'),720,34+4*54+4,s,'Previsioni sul test set','46rem');
  })();
  wideFigs(7);
};
QZ['7a']=()=>[{q:'Dopo il tempo 3 della figura, al tempo 4 arriva la riga «owl owl cat». In modalità complete, quale tabella dei risultati viene scritta?',o:['cat 1, owl 2','cat 3, owl 4','cat 3, dog 4, owl 4','cat 3, dog 0, owl 4'],a:2,
  e:'La riga nuova aggiunge 2 a owl (2 + 2 = 4) e 1 a cat (2 + 1 = 3); dog resta a 4. La modalità complete scrive l\'intera tabella, comprese le righe che non cambiano.',h:'Parti dal risultato al tempo 3 e aggiungi solo le parole della riga nuova.'}];
QZ['7b']=()=>[{q:'Nel grafo di GraphFrames, quanto valgono il grado entrante di Bob (b) e il grado uscente di Esther (e)?',o:['1 e 2','2 e 2','2 e 1','3 e 2'],a:1,
  e:'Bob riceve archi da Alice (friend) e da Charlie (follow): grado entrante 2. Esther manda archi a Fanny (follow) e a David (friend): grado uscente 2.',h:'Conta le punte di freccia che arrivano su b, e le frecce che partono da e.'}];
QZ['7c']=()=>[{q:'Nella pipeline del corso, quale stadio è un estimator, e che cosa restituisce pipeline.fit(training)?',o:['Tokenizer; un DataFrame di parole','HashingTF; un vettore di 1000 numeri','LogisticRegression; un modello, che è un transformer','LogisticRegression; l\'accuratezza sul test set'],a:2,
  e:'LogisticRegression è l\'algoritmo di apprendimento, l\'estimator. Adattare la pipeline restituisce un modello, un transformer che aggiunge le previsioni a qualunque DataFrame; l\'accuratezza viene dopo, da un evaluator.',h:'Ricorda che cosa produce un estimator quando viene adattato ai dati.'}];
QZ['7d']=()=>[{q:'La frase di prova 6 non contiene nessuna parola con peso diverso da zero. Che cosa decide la sua previsione?',o:['Niente: Spark si rifiuta di prevedere','La sola intercetta: punteggio −1,14, probabilità 0,24, etichetta 0','La parola «sea», che spinge verso l\'etichetta 0','La parola più lunga della frase'],a:1,
  e:'Senza parole con un peso il punteggio è l\'intercetta, −1,14, e 1/(1 + e^1,14) ≈ 0,24, sotto 0,5. «sea,» con la virgola è una parola diversa da «sea», quindi non porta alcun peso.',h:'Guarda bene come il tokenizer divide «the sea, the sun».'}];
QZ['7']=()=>[
  {q:'Dopo il tempo 3 dell\'esempio in streaming (cat 2, dog 4, owl 2), al tempo 4 arriva la riga «cat cat». In modalità complete, quante righe ha la tabella dei risultati scritta, e quanto vale il conteggio di cat?',o:['1 riga, cat 2','3 righe, cat 4','3 righe, cat 2','4 righe, cat 4'],a:1,
   e:'La modalità complete scrive l\'intera tabella: sempre tre parole, quindi tre righe, e cat diventa 2 + 2 = 4.',h:'Parti dal risultato al tempo 3 e ricorda che cosa scrive la modalità complete.'},
  {q:'Nel notebook del corso, che cosa cambia fra la query statica sui file di eventi e quella in streaming?',o:['La query in streaming richiede un groupBy diverso','readStream sostituisce read, con un\'opzione per prendere un file per trigger; la query è la stessa','Le query in streaming non possono usare le finestre','La query in streaming va scritta in SQL'],a:1,
   e:'Structured Streaming permette di scrivere il calcolo come sui dati statici: sono nuovi solo readStream (con maxFilesPerTrigger 1 per riprodurre i file) e la destinazione di writeStream.',h:'Ricorda che cosa promette Structured Streaming sul modo di esprimere un calcolo.'},
  {q:'Nel notebook su GraphFrames, il sottografo si costruisce con filterVertices("age > 30"). Quali vertici restano se il filtro è invece "age > 28" (sempre solo archi friend, vertici isolati eliminati)?',o:['Alice, Bob, Esther','Alice, Bob, David, Esther','Alice, Bob, Charlie, David, Esther','Tutti e sette'],a:1,
   e:'Gli archi friend sono a→b, e→d, d→a, a→e. Con David (29) ora tenuto, sopravvivono tutti e quattro, e collegano Alice, Bob, David ed Esther. Charlie, Fanny e Gabby non hanno più archi friend, quindi vengono eliminati.',h:'Elenca prima gli archi friend, poi controlla le età dei loro estremi.'},
  {q:'Supponi che Gabby cominci a seguire Alice (un nuovo arco g→a di tipo follow). Quante componenti connesse ha il grafo, e quanti archi follow?',o:['2 componenti, 5 archi follow','1 componente, 4 archi follow','1 componente, 5 archi follow','2 componenti, 4 archi follow'],a:2,
   e:'Il nuovo arco collega Gabby al resto, quindi tutti stanno in una sola componente; gli archi follow passano da 4 a 5.',h:'Gabby era una componente a sé solo perché non aveva archi.'},
  {q:'Con i pesi appresi dalla pipeline del corso (intercetta −1,14, flour +2,28, sea −1,52), che cosa prevede il modello per la nuova frase «flour sea»?',o:['Probabilità circa 0,41, etichetta 0','Probabilità circa 0,59, etichetta 1','Probabilità circa 0,76, etichetta 1','Probabilità 0,5, nessuna previsione'],a:0,
   e:'Punteggio = −1,14 + 2,28 − 1,52 = −0,38, e 1/(1 + e^0,38) ≈ 0,41, sotto 0,5: etichetta 0.',h:'Somma l\'intercetta e i due pesi, poi chiediti se il punteggio è positivo o negativo.'},
  {q:'Nel secondo esempio del corso, VectorAssembler, LinearRegression e RegressionEvaluator sono, in quest\'ordine,',o:['estimator, transformer, evaluator','transformer, transformer, estimator','evaluator, estimator, transformer','transformer, estimator, evaluator'],a:3,
   e:'VectorAssembler trasforma un DataFrame in un altro aggiungendo la colonna features (transformer); LinearRegression adatta un modello (estimator); RegressionEvaluator calcola una metrica delle previsioni (evaluator).',h:'Chiediti di ciascuno: aggiunge una colonna, impara dai dati, o dà un punteggio alle previsioni?'}
];

/* Lezione 8: architetture con data lake */
const HOT=ORG,COLD=BLUE;
const qChip8=(x,y,q,o)=>{o=o||{};const st=o.bad?RED:o.good?GRN:'#888';return rect(x,y,70,22,o.bad?'rgba(252,98,85,.12)':'#1a1a1a',st)+tx(x+35,y+16,q,{s:12.5,f:o.bad?'#c88':'#fff'})};
INIT[8]=function(){
  codeHL($('#lezione-8'));
  /* technologies by phase */
  (function(){
    let s='';const ph=[['Acquisire','i dati grezzi',['Spark SQL','Spark Streaming'],['Kafka, Flume','Storm, Sqoop']],['Trasformare','e integrare',['Spark SQL'],['Pig, Hive']],['Memorizzare','grezzi ed elaborati',[],['HDFS']],['Analizzare','per capire i dati',['Spark SQL, Spark ML','GraphX'],['Hive, Mahout']]];
    ph.forEach(([n,d,sp,hd],i)=>{const x=10+i*176,w=170;s+='<polygon points="'+[x,20,x+w-18,20,x+w,48,x+w-18,76,x,76,x+(i?18:0),48].join(' ')+'" fill="#1e1e1e" stroke="#9a9a9a"/>';
      s+=tx(x+w/2+(i?6:0),44,n,{s:15,f:'#fff',w:600})+tx(x+w/2+(i?6:0),63,d,{s:12.5,f:GRAY});
      s+=tx(x+w/2,104,'Spark',{s:13,f:GRAY});(sp.length?sp:['nessuno']).forEach((l,j)=>s+=tx(x+w/2,124+j*18,l,{s:13.5,f:sp.length?'#fff':'#555'}));
      s+=tx(x+w/2,176,'Hadoop',{s:13,f:GRAY});hd.forEach((l,j)=>s+=tx(x+w/2,196+j*18,l,{s:13.5,f:'#fff'}))});
    s+=line(10,88,710,88,'#333',1)+line(10,160,710,160,'#333',1);
    svgBox($('#b8tech'),720,236,s,'Tecnologie del data lake per fase','46rem');
  })();
  /* schema on write vs schema on read */
  (function(){
    const duo=el('div','duo');$('#b8schema').append(duo);
    const L=['20161130,ProdABD,300,4','20161205,ProdXYZ,n/a,7','20161210,ProdDEF,90,2'];
    let a=rect(10,6,320,46,'#141414','#9a9a9a')+mono(20,24,'CREATE TABLE sales (date INT,',{s:12.5})+mono(20,42,'  product VARCHAR, value INT, ...)',{s:12.5});
    a+=tx(170,74,'prima la tabella, poi i record',{s:12.5,f:GRAY});
    L.forEach((l,k)=>{const ok=k!==1,y=86+k*28;a+=rect(10,y,240,22,ok?OKBG:BADBG)+mono(18,y+16,l,{s:12.5})+tx(262,y+16,ok?'✓ caricato':'✗ rifiutato',{s:13,f:ok?GRN:RED,a:'start'})});
    const t=sTab(10,182,[{t:'date',w:86},{t:'product',w:86},{t:'value',w:60,a:'e',c:BLUE},{t:'cust.',w:56,a:'e'}],[['20161130','ProdABD','300','4'],['20161210','ProdDEF','90','2']],{rh:23,hh:24});
    a+=t.s;
    cell(duo,'Data warehouse: schema on write',a,340,262,'Schema on write','Il record sbagliato non entra mai: 2 righe su 3.');
    let b=rect(10,6,250,96,'#141414','#9a9a9a')+tx(20,24,'sales.csv nel lago (tutte e 3 le righe)',{s:12.5,f:GRAY,a:'start'});
    L.forEach((l,k)=>b+=mono(20,48+k*20,l,{s:12.5}));
    b+=tx(10,128,'lettore A: value come INT',{s:13,f:'#fff',a:'start'})+tx(10,146,'«n/a» viene letto come NULL, gli altri valori come numeri',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,180,'lettore B: value come STRING',{s:13,f:'#fff',a:'start'})+tx(10,198,'tiene «n/a» come testo, per trovare i record sbagliati',{s:12.5,f:GRAY,a:'start'});
    b+=tx(10,232,'Lo schema sta nel codice che legge.',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Data lake: schema on read',b,340,262,'Schema on read','Si tiene tutto: 3 righe su 3.');
  })();
  /* cost per raw TB (approximate) */
  (function(){
    let s='';const L=150,R=600,X=v=>L+v/100*(R-L);
    [0,20,40,60,80,100].forEach(v=>{s+=line(X(v),8,X(v),214,'#222',1)+tx(X(v),234,'$'+(v?v+'.000':'0'),{s:13,f:GRAY})});
    const rows=[['Storage nel cloud',0,1],['Hadoop',0,3],['NAS',12,18],['Engineered system',10,20],['MPP',21,80],['SAN',38,100]];
    rows.forEach(([l,lo,hi],k)=>{const y=14+k*34;s+=tx(L-10,y+16,l,{s:13.5,a:'end',f:k<2?'#fff':'#ccc',w:k<2?600:undefined});
      s+=rect(X(0),y,Math.max(X(lo)-X(0),0),22,'#2c2c2c')+rect(X(lo),y,Math.max(X(hi)-X(lo),3),22,k<2?'#fff':'#777');
      s+=tx(X(hi)+8,y+16,k<2?'qualche migliaio di $':'≈ '+lo+'-'+hi+' mila $',{s:12.5,f:GRAY,a:'start'})});
    s+=tx((L+R)/2,256,'costo complessivo per TB grezzo, dal minimo al massimo (approssimato)',{s:13,f:GRAY});
    svgBox($('#b8cost'),720,264,s,'Costo per terabyte grezzo secondo la tecnologia di memorizzazione','46rem');
  })();
  /* four adoption steps */
  (function(){
    let s='';const st=[['01','Area di staging e zona dei dati grezzi','luogo di atterraggio economico e scalabile'],['02','Ambiente di data science','dove girano gli esperimenti di machine learning'],['03','Sistema di offloading per i data warehouse','tiene i dati freddi del DWH'],['04','Componente principale del sistema informativo','coinvolto nella maggior parte dei flussi di dati']];
    st.forEach(([n,l,d],k)=>{const y=200-k*56,hw=150-k*32,cx=160,top=hw-16;
      s+='<polygon points="'+[cx-hw,y+50,cx+hw,y+50,cx+top,y,cx-top,y].join(' ')+'" fill="'+['#2a2a2a','#383838','#474747','#5a5a5a'][k]+'" stroke="#111"/>'+tx(cx,y+32,n,{s:17,f:'#fff',w:600});
      s+=line(cx+top+8,y+25,330,y+25,'#555',1)+tx(340,y+22,l,{s:14,f:'#fff',a:'start',w:500})+tx(340,y+40,d,{s:12.5,f:GRAY,a:'start'})});
    svgBox($('#b8steps'),720,256,s,'Quattro passi dell\'adozione di un data lake','46rem');
  })();
  /* traditional BI vs BI 2.0 */
  (function(){
    const duo=el('div','duo');$('#b8arch').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    const up=(x,y1,y2,id)=>line(x,y1,x,y2,GRAY,1.6,' marker-end="url(#'+id+')"');
    let a=ar('b8u1');const cx=90,w=160;
    a+=box(cx,8,w,34,['Reportistica'],{fs:14})+up(170,104,46,'b8u1')+box(cx,106,w,30,['Strato semantico'])+up(170,166,140,'b8u1');
    a+=box(cx,168,w,44,['Data warehouse','dati caldi'],{fs:14,c2:HOT,b:1})+up(170,252,216,'b8u1')+box(cx,254,w,28,['ETL'])+up(170,316,286,'b8u1')+box(cx,318,w,40,['Fonti tradizionali','relazionali: ERP, CRM'],{fs:13.5});
    cell(duo,'BI tradizionale',a,340,364,'BI tradizionale','Un solo percorso: ETL verso il warehouse.');
    let b=ar('b8u2');const c1=10,c2=180,W=150;
    b+=box(10,8,320,34,['Reportistica e analisi avanzate'],{fs:14})+up(85,104,46,'b8u2')+up(255,104,46,'b8u2');
    b+=box(c1,106,W,30,['Strato semantico'])+box(c2,106,W,30,['Strato semantico'])+up(85,166,140,'b8u2')+up(255,158,140,'b8u2');
    b+=box(c1,168,W,44,['Data warehouse','caldi, distillati'],{fs:14,c2:HOT,b:1})+rect(c2,160,W,78,'#0d0d0d','#666')+tx(255,180,'Data lake',{s:14,f:'#fff',w:600})+tx(255,198,'Hadoop, Spark',{s:13,f:GRAY})+tx(255,214,'grezzi, freddi',{s:13,f:COLD})+tx(255,230,'qualità, governance',{s:12.5,f:GRAY});
    b+=tx(170,197,'⇄',{s:18,f:'#ddd'});
    b+=up(85,252,216,'b8u2')+up(255,284,242,'b8u2')+box(c1,254,W,28,['ETL'])+box(c2,286,W,28,['Data ingestion']);
    b+=up(85,316,286,'b8u2')+up(255,342,318,'b8u2')+box(c1,318,W,40,['Fonti tradizionali','relazionali'],{fs:13.5})+box(c2,320,W,40,['Fonti emergenti','log, dispositivi, social'],{fs:13.5});
    cell(duo,'BI 2.0, con un data lake',b,340,364,'BI 2.0','Le nuove fonti atterrano nel lago; i risultati passano al warehouse.');
  })();
  /* data distillation, animated */
  (function(){
    const root=$('#b8distill'),W=720,H=250;const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const rnd=lcg(8),D=[];for(let k=0;k<240;k++)D.push([24+rnd()*266,52+rnd()*170]);
    const steps=[3,4.5,3,3,3];
    const msgs=['Il lago contiene una grande quantità di dati grezzi, con più dettaglio e una storia più lunga del warehouse.','<b>Lettura.</b> Un job Spark legge i dati grezzi che gli servono; i dati restano nel lago.','<b>Calcolo.</b> Il risultato è piccolo: poche righe, per esempio un indicatore per ogni segmento di clienti.',
      '<b>Distillazione.</b> Essendo piccolo, il risultato viene caricato nel data warehouse.','<b>Uso.</b> Nel warehouse entra nel flusso di lavoro della BI: i report lo interrogano con bassa latenza.'];
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b8d1',GRAY)+'</defs>';
      s+=rect(14,26,286,206,'#0b0b0b','#666')+tx(157,44,'data lake: dati grezzi',{s:13.5,f:'#fff'});
      D.forEach(([x,y])=>s+='<circle cx="'+x+'" cy="'+y+'" r="2.2" fill="#8a8a8a"/>');
      s+=rect(330,104,100,52,i===1||i===2?'#1e1e1e':'#141414',i===1||i===2?'#fff':'#777')+tx(380,126,'job Spark',{s:13.5,f:'#fff'})+tx(380,144,'in memoria',{s:12.5,f:GRAY});
      s+=rect(466,40,140,180,'#0b0b0b',i>=3?'#fff':'#666')+tx(536,58,'data warehouse',{s:13.5,f:'#fff'})+tx(536,76,'dati caldi',{s:12.5,f:HOT});
      s+=rect(624,90,90,90,'#0b0b0b',i===4?'#fff':'#444')+tx(669,106,'report BI',{s:13,f:i===4?'#fff':'#666'});
      if(i===1){D.forEach(([x,y],k)=>{if(k%4)return;const st=(k/4)/60*.6,ek=clamp((u-st)/.4,0,1);if(ek>0&&ek<1){const xx=lerp(x,330,ease(ek)),yy=lerp(y,130,ease(ek));s+='<circle cx="'+xx+'" cy="'+yy+'" r="2.6" fill="#fff" opacity="'+(1-ek*.5)+'"/>'}})}
      const tbl=(x,y,a)=>{let r='<g opacity="'+a+'">'+rect(x,y,104,62,'#1e1e1e','#ddd');[0,1,2,3].forEach(j=>{r+=rect(x+8,y+8+j*13,24,8,'#777')+rect(x+38,y+8+j*13,[46,30,52,22][j],8,BLUE)});return r+'</g>'};
      if(i===2)s+=tbl(lerp(330,330,e),lerp(166,166,e),e)+tx(382,244,'poche righe',{s:12.5,f:GRAY});
      if(i===3)s+=tbl(lerp(330,484,e),lerp(166,100,e),1);
      if(i===4){s+=tbl(484,100,1);[46,30,52,22].forEach((v,j)=>s+=rect(640+j*18,170-v*e*1.2,12,v*e*1.2,BLUE))}
      if(i>=1)s+=line(302,130,326,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i>=3)s+=line(432,130,462,130,GRAY,1.5,' marker-end="url(#b8d1)"');if(i===4)s+=line(608,130,620,130,GRAY,1.5,' marker-end="url(#b8d1)"');
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione della distillazione dei dati">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 5. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* input filter vs quality label */
  (function(){
    const duo=el('div','duo');$('#b8qual').append(duo);const Q=['alta','media','bassa','alta','media','alta'];
    let a='';Q.forEach((q,k)=>a+=qChip8(10,14+k*34,q,{bad:q!=='alta'}));
    a+=line(118,6,118,214,'#ddd',3)+tx(118,232,'filtro: solo alta',{s:12.5,f:GRAY});
    a+=rect(150,6,180,208,'#0b0b0b','#666')+tx(240,26,'data lake',{s:13.5,f:'#fff'});
    Q.forEach((q,k)=>{const y=14+k*34;if(q==='alta'){a+=line(82,y+11,110,y+11,GRN,1.4)+qChip8(205,36+Q.slice(0,k).filter(x=>x==='alta').length*34,q,{good:1})}else a+=tx(98,y+16,'✗',{s:14,f:RED})});
    cell(duo,'Filtro di qualità in ingresso',a,340,240,'Filtro in ingresso','<span class="bad">I record di qualità media vanno persi</span>, anche per chi potrebbe usarli.');
    let b=rect(10,6,190,214,'#0b0b0b','#666')+tx(105,26,'data lake (tutti i record)',{s:13,f:'#fff'});
    const pos=k=>[20+(k%2)*92,40+Math.floor(k/2)*40];
    b+=box(232,30,104,48,['Reportistica','solo alta'],{fs:13.5})+box(232,140,104,48,['Data scientist','alta, media'],{fs:13.5});
    Q.forEach((q,k)=>{const [x,y]=pos(k);if(q==='alta')b+=line(x+70,y+11,232,54,GRN,1,' opacity=".55"');if(q!=='bassa')b+=line(x+70,y+11,232,164,GRN,1,' opacity=".55"')});
    Q.forEach((q,k)=>{const [x,y]=pos(k);b+=qChip8(x,y,q)});
    cell(duo,'Etichetta di qualità, decide l\'utente',b,340,240,'Etichetta di qualità','Ogni record entra; <span class="ok">ogni utente sceglie il suo livello</span>.');
  })();
  /* ETL copy vs virtualization */
  (function(){
    const duo=el('div','duo');$('#b8virt').append(duo);const src=['ERP','CRM','log web'];
    let a='<defs>'+arrowDef('b8v1',GRAY)+'</defs>';a+=box(120,6,100,34,['query utente']);
    a+=line(170,42,170,62,GRAY,1.5,' marker-end="url(#b8v1)"')+cyl(110,66,120,46,'archivio centrale');
    src.forEach((n,k)=>{const x=20+k*110;a+=cyl(x,186,90,42,n)+line(x+45,184,170+(k-1)*30,118,GRAY,1.4,' marker-end="url(#b8v1)"')});
    a+=tx(260,154,'copia (ETL)',{s:12.5,f:GRAY,a:'start'});
    cell(duo,'Copiare i dati (ETL)',a,340,236,'Copia con ETL','Una seconda copia dei dati da caricare e tenere allineata.');
    let b='<defs>'+arrowDef('b8v2',ORG)+'</defs>';b+=box(120,6,100,34,['query utente']);
    b+=line(170,42,170,62,ORG,1.5,' marker-end="url(#b8v2)"')+rect(40,66,260,46,'#0d0d0d','#ddd',' stroke-dasharray="5 4"')+tx(170,86,'strato di virtualizzazione',{s:13.5,f:'#fff'})+tx(170,104,'nessun dato memorizzato',{s:12.5,f:GRAY});
    src.forEach((n,k)=>{const x=20+k*110;b+=cyl(x,186,90,42,n)+line(170+(k-1)*60,114,x+45,182,ORG,1.4,' marker-end="url(#b8v2)"')});
    b+=tx(330,154,'rete',{s:12.5,f:ORG,a:'end'});
    cell(duo,'Query sul posto (virtualizzazione)',b,340,236,'Virtualizzazione dei dati','Nessuna copia, ma ogni query carica le fonti e la rete.');
  })();
  wideFigs(8);
};
QZ['8a']=()=>[{q:'Un\'azienda raccoglie log grezzi di sensori il cui uso non è ancora deciso: l\'anno prossimo un modello potrebbe aver bisogno di alcuni campi, in un formato che oggi nessuno sa definire. Dove dovrebbero andare, e perché?',o:['Nel data lake, perché con lo schema on read la struttura si può definire quando i dati servono','Nel DWH, perché lo schema on write garantisce la qualità','Da nessuna parte: i dati senza schema non si possono memorizzare','Nel DWH, perché è la memorizzazione più economica'],a:0,
  e:'Il lago memorizza i dati nel loro formato nativo e definisce lo schema al momento della lettura; il DWH ha bisogno delle tabelle definite prima del caricamento ed è la memorizzazione più costosa.',h:'Chiediti quale dei due deve conoscere la struttura prima di scrivere.'}];
QZ['8b']=()=>[{q:'Una banca sposta dieci anni di storico delle transazioni, consultato di rado, dal suo data warehouse al data lake, dove resta disponibile. Quale passo dell\'adozione è questo?',o:['Area di staging e zona dei dati grezzi','Ambiente di data science','Sistema di offloading per i data warehouse','Componente principale del sistema informativo'],a:2,
  e:'Usare il basso costo di memorizzazione del lago per tenere i dati freddi e usati di rado del warehouse è il terzo passo, l\'offloading.',h:'Chiediti da dove vengono i dati e quanto spesso vengono usati.'}];
QZ['8c']=()=>[{q:'Una dashboard giornaliera mostra le vendite del mese scorso per negozio; i log web del 2012 vengono letti una volta all\'anno per uno studio. Nell\'architettura della lezione,',o:['entrambi stanno nel data warehouse','le vendite restano nel data lake, i log vanno nel warehouse','le vendite, dati caldi, stanno nel warehouse; i log, dati freddi, nel lago','entrambi stanno solo nei sistemi di origine'],a:2,
  e:'I dati recenti e consultati spesso sono caldi e li serve il warehouse con bassa latenza; i dati vecchi e consultati di rado sono freddi e restano nel lago, disponibili con una latenza maggiore.',h:'Ricorda le definizioni di dati caldi e freddi.'}];
QZ['8d']=()=>[{q:'Arrivano record di clienti con indirizzi di qualità media: vanno bene per un modello di abbandono, non per le fatture. Che cosa raccomanda la lezione?',o:['Rifiutarli all\'ingresso del lago','Correggerli a mano prima di caricarli','Caricarli con un\'etichetta di qualità, e lasciare che ogni utente decida se usarli','Memorizzarli solo nel warehouse'],a:2,
  e:'Le regole di qualità vanno sull\'output: un\'etichetta di qualità permette al report delle fatture di escluderli mentre il data scientist può comunque usarli.',h:'Dove vanno applicate le regole di qualità, secondo la lezione?'}];
QZ['8']=()=>[
  {q:'Un caricamento di 1000 record ne contiene 30 con un testo dove ci si aspetta un intero. Quante righe finiscono in una tabella del warehouse con schema on write e caricamento rigoroso, e quante righe nel lago?',o:['970 e 970','1000 e 970','970 e 1000','1000 e 1000'],a:2,
   e:'La tabella del warehouse rifiuta i 30 record che non rispettano il suo schema: 1000 − 30 = 970. Il lago scrive tutte le 1000 righe così come sono e lascia lo schema ai lettori.',h:'Un sistema controlla lo schema quando scrive, l\'altro quando legge.'},
  {q:'Un rivenditore esegue in Spark un modello di abbandono su due anni di clickstream grezzo nel lago e ottiene un punteggio di abbandono per cliente, che le dashboard del marketing devono interrogare in modo interattivo. Che cosa suggerisce l\'architettura della lezione?',o:['Spostare il clickstream grezzo nel warehouse','Tenere il clickstream grezzo nel lago e caricare i punteggi nel warehouse','Far interrogare alle dashboard il clickstream grezzo nel lago','Cancellare il clickstream una volta calcolati i punteggi'],a:1,
   e:'È la distillazione dei dati: l\'analisi pesante gira sul lago, e il risultato piccolo va nel warehouse, che serve query a bassa latenza agli strumenti di BI.',h:'Quale dei due sistemi è costruito per le query interattive, e quali dati sono piccoli?'},
  {q:'Quale di questi non è uno dei fattori critici di successo di un data lake indicati nella lezione?',o:['La data governance','Un filtro che rifiuta all\'ingresso i dati di qualità media','La gestione dei metadati','La formazione di data scientist e utenti finali'],a:1,
   e:'La lezione sconsiglia esplicitamente i filtri in ingresso: terrebbero fuori dati utili per alcune applicazioni. Il modo raccomandato sono le etichette di qualità sull\'output.',h:'Rileggi il paragrafo sul processo di qualità dei dati.'},
  {q:'Un\'azienda mette uno strato di virtualizzazione sopra il suo ERP. A fine mese, i report complessi che passano dallo strato rallentano l\'ERP stesso. Quale svantaggio è questo?',o:['L\'alto investimento iniziale','La virtualizzazione dei dati si affida allo spazio di archiviazione, alla memoria e alle CPU delle fonti, e può essere lenta per i compiti complessi','Non può gestire dati non strutturati','Duplica i dati'],a:1,
   e:'Lo strato non memorizza nulla, quindi il lavoro di ogni query lo fanno le fonti; le query pesanti caricano l\'ERP e possono essere lente.',h:'Nel secondo riquadro dell\'ultima figura, chi fa il lavoro?'},
  {q:'In quale ordine la lezione mette i quattro passi dell\'adozione di un data lake?',o:['Staging, data science, offloading, componente principale','Data science, staging, componente principale, offloading','Staging, offloading, data science, componente principale','Offloading, staging, data science, componente principale'],a:0,
   e:'Dalla base della piramide: area di staging e zona dei dati grezzi, ambiente di data science, sistema di offloading per i warehouse, componente principale del sistema informativo.',h:'Parti dall\'uso più economico e meno integrato.'},
  {q:'Nell\'era del data lake, che cosa contiene il data warehouse secondo la lezione?',o:['Tutti i dati grezzi, strutturati e non strutturati','Solo i dati freddi','I dati caldi dei processi ETL e i risultati distillati delle analisi eseguite sul lago','Niente: è sostituito dal lago'],a:2,
   e:'Il warehouse esiste ancora e contiene i dati caldi (dall\'ETL, direttamente dalle fonti o dal lago) e i dati distillati dalle analisi del lago, mantenendo le query a bassa latenza e i report esistenti.',h:'Il lago tiene i dati grezzi e quelli freddi.'}
];

/* Lezione 9: AI predittiva e generativa, strutture di dati, casi d'uso */
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
    a+='<circle cx="196" cy="112" r="8" fill="none" stroke="'+PREDC+'" stroke-width="2.5"/>'+line(203,119,236,146,PREDC,1.2)+tx(238,160,'cliente nuovo?',{s:12.5,f:PREDC,a:'start'})+tx(238,176,'previsto: se ne va',{s:12.5,f:PREDC,a:'start'});
    a+='<circle cx="184" cy="224" r="5" fill="#fff"/>'+tx(193,228,'uscito',{s:12.5,f:'#fff',a:'start'})+'<circle cx="250" cy="224" r="5" fill="none" stroke="#aaa" stroke-width="1.5"/>'+tx(259,228,'rimasto',{s:12.5,f:'#ccc',a:'start'});
    cell(duo,'Predittivo: impara un confine',ax(a),340,236,'Modello predittivo','Entrano le feature, esce il target: <b>se ne va o resta</b>.');
    let b='';[[110,150],[220,80]].forEach(([cx,cy])=>{[[62,52,.35],[38,32,.6]].forEach(([rx,ry,o])=>b+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+GENC+'" stroke-opacity="'+o+'" stroke-width="1.5"/>')});
    A.concat(B).forEach(([x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#777"/>');
    const r2=lcg(31);for(let k=0;k<8;k++){const c=k%2?[220,80]:[110,150];b+='<circle cx="'+(c[0]+gauss9(r2)*22)+'" cy="'+(c[1]+gauss9(r2)*18)+'" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'}
    b+='<circle cx="190" cy="224" r="3.5" fill="#777"/>'+tx(198,228,'dati',{s:12.5,f:GRAY,a:'start'})+'<circle cx="240" cy="224" r="5.5" fill="#fff" stroke="'+GENC+'" stroke-width="1.5"/>'+tx(249,228,'generati',{s:12.5,f:'#fff',a:'start'});
    cell(duo,'Generativo: impara la forma',ax(b),340,236,'Modello generativo','Nessun target: <b>osservazioni nuove</b> simili ai dati.');
  })();
  /* McKinsey ranges */
  (function(){
    let s='';const L=20,R=500,X=v=>L+v/30*(R-L);
    [0,5,10,15,20,25,30].forEach(v=>{s+=line(X(v),22,X(v),272,'#222',1)+tx(X(v),290,String(v),{s:13,f:GRAY})});
    const rows=[['Analisi avanzata, ML tradizionale e deep learning',11.0,17.7,PREDC],['Nuovi casi d\'uso dell\'AI generativa',2.6,4.4,GENC],['Potenziale totale dei casi d\'uso',13.6,22.1,'#9a9a9a'],['Produttività dei lavoratori resa possibile dall\'AI generativa',6.1,7.9,GENC],['Potenziale economico totale dell\'AI',17.1,25.6,'#fff']];
    rows.forEach(([l,lo,hi,c],k)=>{const y=26+k*50;s+=tx(L,y+10,l,{s:13,f:'#ddd',a:'start'})+rect(X(lo),y+16,X(hi)-X(lo),20,c)+tx(X(hi)+8,y+31,'da '+lo.toFixed(1).replace('.',',')+' a '+hi.toFixed(1).replace('.',','),{s:13,f:'#fff',a:'start'})});
    s+=tx(260,308,'migliaia di miliardi di dollari l\'anno',{s:13,f:GRAY});
    s+=tx(640,22,'quota del totale',{s:13,f:GRAY});const top=34,H=238;
    s+=rect(610,top,60,H*.325,GENC)+rect(610,top+H*.325,60,H*.675,PREDC)+tx(604,top+H*.16+5,'30-35%',{s:13,f:'#fff',a:'end'})+tx(604,top+H*.325+H*.34+5,'65-70%',{s:13,f:'#fff',a:'end'});
    s+=tx(640,top+H+20,'generativa',{s:12.5,f:GENC})+tx(640,top+H+36,'predittiva',{s:12.5,f:PREDC});
    svgBox($('#b9mck'),720,316,s,'Potenziale economico dell\'AI, McKinsey 2023','46rem');
  })();
  /* State of AI 2026 */
  (function(){
    let s='';const rows=[[89,'usano l\'AI in almeno una funzione aziendale'],[44,'stanno estendendo l\'AI a tutta l\'azienda'],[37,'riportano un impatto positivo dell\'AI sull\'EBIT'],[6,'sono AI high performer (almeno il 5% dell\'EBIT dall\'AI)']];
    rows.forEach(([v,l],k)=>{const y=14+k*52;s+=tx(20,y+12,l,{s:13,f:'#ddd',a:'start'})+rect(20,y+18,v/100*560,24,k===3?'#fff':'#777')+tx(20+v/100*560+10,y+37,v+'%',{s:17,f:'#fff',w:600,a:'start'})});
    svgBox($('#b9adopt'),720,222,s,'Quota di organizzazioni per stadio di adozione dell\'AI','46rem');
  })();
  /* eight phases and five milestones */
  (function(){
    let s='';const ph=[['OLTP, SQL','','report','statici'],['DWH, SQL','','report','statici'],['DWH, BI,','OLAP','report','dinamici'],['DWH, OLAP,','data mining','analisi','predittiva'],['Cloud,','collaborazione','analisi','avanzata'],['Hadoop,','Big Data','analisi','prescrittiva'],['AI','generativa','LLM,','copilot'],['AI','agentica','AI che','agisce']];
    ph.forEach(([a,b,c,c2],i)=>{const x=6+i*89,w=86;s+='<polygon points="'+[x,8,x+w-10,8,x+w,25,x+w-10,42,x,42,x+(i?10:0),25].join(' ')+'" fill="'+(i>=6?'#2a2a2a':'#1a1a1a')+'" stroke="#9a9a9a"/>'+tx(x+w/2+(i?3:0),30,'Fase '+(i+1),{s:13,f:'#fff',w:600});
      s+=tx(x+w/2,62,a,{s:12.5,f:'#fff'})+(b?tx(x+w/2,78,b,{s:12.5,f:'#fff'}):'')+tx(x+w/2,98,c,{s:12.5,f:GRAY})+tx(x+w/2,113,c2,{s:12.5,f:GRAY})});
    const ms=[['primi anni Novanta',['strumenti di BI'],['attenzione agli','strumenti']],['2005',['applicazioni di','business analytics'],['attenzione alle','applicazioni']],['2012',['Big Data'],['attenzione ai dati']],['2022',['piattaforme di','AI generativa'],['attenzione al','linguaggio naturale']],['2025',['agenti AI,','flussi agentici'],['attenzione','all\'azione autonoma']]];
    ms.forEach(([yr,ln,fc],k)=>{const x=8+k*142,y=300-k*36,w=132;s+=rect(x,y,w,40,k>=3?'#2a2a2a':'#1a1a1a','#bbb');
      ln.forEach((l,j)=>s+=tx(x+w/2,y+(ln.length===1?25:17+j*16),l,{s:12.5,f:'#fff'}));
      s+=tx(x+4,y-8,yr,{s:13,f:'#fff',w:600,a:'start'})+line(x+w/2,y+40,x+w/2,352,'#444',1,' stroke-dasharray="3 3"');
      fc.forEach((l,j)=>s+=tx(x+w/2,370+j*16,l,{s:12.5,f:GRAY}))});
    s+=tx(10,140,'Business intelligence → AI',{s:13,f:GRAY,a:'start'});
    svgBox($('#b9evo'),720,394,s,'Otto fasi delle tecniche e degli strumenti di analisi','46rem');
  })();
  /* elements of a BI system */
  (function(){
    let s='<defs>'+arrowDef('b9b1',GRAY)+'</defs>';const A=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,GRAY,1.4,' marker-end="url(#b9b1)"');
    s+=tx(70,18,'Fonti operative',{s:13,f:GRAY});['CRM','ERP','Sistemi legacy','File, web, IoT'].forEach((l,k)=>s+=box(10,28+k*48,120,38,[l]));
    s+=box(178,92,96,56,['Area di','staging'],{fs:14});[0,1,2,3].forEach(k=>s+=A(132,47+k*48,176,120));s+=tx(156,26,'ETL',{s:12.5,f:GRAY});
    s+=cyl(318,82,110,76,'');s+=tx(373,116,'Enterprise',{s:13.5,f:'#fff'})+tx(373,134,'data warehouse',{s:13.5,f:'#fff'});s+=A(276,120,316,120)+tx(296,110,'ETL',{s:12.5,f:GRAY});
    s+=tx(520,18,'Data mart',{s:13,f:GRAY});['Marketing','Finanza','Vendite'].forEach((l,k)=>{s+=box(470,40+k*56,100,40,[l]);s+=A(430,120,468,60+k*56)});
    s+=tx(650,18,'Strumenti client',{s:13,f:GRAY});['OLAP','Report, dashboard','Data mining, ML','Copilot AI'].forEach((l,k)=>{s+=box(590,28+k*48,126,38,[l],{fs:12.5});});
    s+=A(572,120,588,120);
    s+=rect(10,236,704,34,'#141414','#9a9a9a',' stroke-dasharray="5 4"')+tx(362,258,'Governance: master data, qualità dei dati, metadati e lineage, sicurezza e privacy (GDPR)',{s:13,f:'#ddd'});
    svgBox($('#b9bi'),720,276,s,'Elementi di un sistema di BI','46rem');
  })();
  /* Inmon's four properties */
  (function(){
    const duo=el('div','duo');$('#b9inmon').append(duo);const ar=id=>'<defs>'+arrowDef(id,GRAY)+'</defs>';
    let a=ar('b9i1');[['ERP','"M. Rossi"'],['CRM','"Mario Rossi"'],['web','"mrossi"']].forEach(([n,v],k)=>{a+=box(10,8+k*48,130,40,[n,v],{fs:13});a+=line(142,28+k*48,196,80,GRAY,1.4,' marker-end="url(#b9i1)"')});
    a+=box(200,52,130,56,['cliente 1042','Mario Rossi'],{fs:13.5,st:'#fff',sw:2});
    cell(duo,'Integrato',a,340,156,'Integrato','Fonti diverse, un solo contenitore omogeneo.');
    let b=ar('b9i2');['vendite','prestiti','traffico in uscita'].forEach((n,k)=>b+=box(10,8+k*48,120,38,[n],{fs:13,f:'#141414',st:'#555'}));['clienti','prodotti','canali'].forEach((n,k)=>b+=box(210,8+k*48,120,38,[n],{fs:13.5,st:'#fff'}));
    b+=tx(70,160,'applicazioni',{s:12.5,f:GRAY})+tx(270,160,'soggetti',{s:12.5,f:'#fff'})+line(134,76,204,76,GRAY,1.6,' marker-end="url(#b9i2)"');
    cell(duo,'Orientato ai soggetti',b,340,166,'Orientato ai soggetti','Organizzato per soggetto, non per applicazione.');
    let c='';['gen','feb','mar','apr','mag'].forEach((m,k)=>{c+=rect(40,128-k*26,150,22,k===4?'#3a3a3a':'#1e1e1e','#9a9a9a')+tx(115,143-k*26,'caricamento di '+m,{s:12.5,f:'#fff'})});
    c+=box(220,50,110,56,['utenti','sola lettura'],{fs:13.5})+tx(275,124,'niente modifiche',{s:12.5,f:GRAY})+tx(275,140,'né cancellazioni',{s:12.5,f:GRAY});
    cell(duo,'Non volatile',c,340,156,'Non volatile','Cresce con caricamenti regolari; gli utenti non possono modificarlo.');
    let d=line(20,120,320,120,'#777',1.5);[2022,2023,2024,2025,2026].forEach((y,k)=>{const x=40+k*65;d+=rect(x-24,40,48,60,'#1a1a1a','#9a9a9a');[0,1,2].forEach(j=>d+=rect(x-16,50+j*14,32,7,'#555'));d+=line(x,100,x,120,'#777',1)+tx(x,140,String(y),{s:12.5,f:GRAY})});
    cell(duo,'Variabile nel tempo',d,340,156,'Variabile nel tempo','Istantanee periodiche che coprono più anni.');
  })();
  /* IDC Global DataSphere */
  (function(){
    let s='';const U=[['ZB','10²¹ byte','1 miliardo di TB'],['EB','10¹⁸','traffico mobile mensile di un grande paese'],['PB','10¹⁵','il DWH di una grande azienda'],['TB','10¹²','il disco di un portatile'],['GB','10⁹','un film in HD']];
    U.forEach(([u,p,e],k)=>{const y=14+k*52;s+=rect(10,y,40,40,k?'#1a1a1a':'#2c2c2c','#9a9a9a')+tx(30,y+25,u,{s:14,f:'#fff',w:600})+tx(58,y+16,p,{s:12.5,f:'#fff',a:'start'});
      const words=e.split(' ');let l1=e,l2='';if(e.length>24){const m=Math.ceil(words.length/2);l1=words.slice(0,m).join(' ');l2=words.slice(m).join(' ')}s+=tx(58,y+31,l1,{s:12.5,f:GRAY,a:'start'})+(l2?tx(58,y+45,l2,{s:12.5,f:GRAY,a:'start'}):'')});
    s+=tx(130,284,'× 1000 a ogni gradino',{s:12.5,f:GRAY});
    const D=[['2010',2],['2012',7],['2014',13],['2016',18],['2018',33],['2020',64],['2021',79],['2022',97],['2023',120],['2024',149],['2025',181],['2028',394]];
    const x0=262,bw=30,gap=7.5,Y=v=>262-v/400*226;
    [0,100,200,300,400].forEach(v=>{s+=line(x0-6,Y(v),712,Y(v),'#222',1)+tx(x0-10,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'})});
    D.forEach(([y,v],k)=>{const x=x0+k*(bw+gap),f=k===11;s+=rect(x,Y(v),bw,262-Y(v),f?'none':(k>=9?'#9a9a9a':'#ddd'),f?'#ddd':'none',f?' stroke-dasharray="4 3" stroke-width="1.5"':'')+tx(x+bw/2,Y(v)-6,String(v),{s:12.5,f:'#fff'})+tx(x+bw/2,280,y==='2028'?'2028P':"'"+y.slice(2),{s:12.5,f:GRAY})});
    s+=tx(486,298,'zettabyte all\'anno; 2024 e 2025 stime, 2028 previsione (P)',{s:12.5,f:GRAY});
    svgBox($('#b9idc'),720,306,s,'Global DataSphere in zettabyte, IDC','46rem');
  })();
  /* volume and complexity */
  (function(){
    let s='';const lv={MB:290,GB:215,TB:135,PB:55};
    Object.keys(lv).forEach(k=>{s+=tx(52,lv[k]+5,k,{s:14,f:'#fff',w:600,a:'end'})+line(62,lv[k],700,lv[k],'#1c1c1c',1)});
    s+=line(64,324,700,324,'#777',1.4)+line(64,324,64,20,'#777',1.4)+tx(30,22,'volume',{s:12.5,f:GRAY,a:'start'});
    [['complessità bassa',190],['complessità media',400],['complessità alta',610]].forEach(([l,x])=>s+=tx(x,344,l,{s:13,f:GRAY}));
    const B=[['SCM','',150,285,30,0],['ERP','ordini, vendite',192,215,40,0],['CRM','campagne',262,252,34,0],['Transazioni','finanziarie',178,135,38,1],['DCS,','sensori',292,58,34,1],['Log web','clickstream',392,135,40,1],['Dati','scientifici',402,55,36,1],['Documenti','Word, Excel, PDF',512,212,48,2],['Audio,','video, foto',604,140,40,2],['Social','network, UGC',614,54,46,2]];
    B.forEach(([a,b,x,y,r,t])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.6"/>';const c=t?'#fff':'#000';
      s+=tx(x,y+(b?-1:5),a,{s:12.5,f:c,w:600})+(b?tx(x,y+14,b,{s:11,f:t?'#ddd':'#333'}):'')});
    const lg=[['strutturati',0],['semi-strutturati',1],['non strutturati',2]];lg.forEach(([l,t],k)=>{const x=200+k*140;s+='<circle cx="'+x+'" cy="'+366+'" r="7" fill="'+['#e6e6e6','#5e5e5e','#000'][t]+'" stroke="'+(t===2?'#fff':'none')+'" stroke-width="1.4"/>'+tx(x+12,370,l,{s:12.5,f:'#ddd',a:'start'})});
    svgBox($('#b9vc'),720,378,s,'Fonti di dati per volume e complessità','46rem');
  })();
  /* IoT */
  (function(){
    const duo=el('div','duo');$('#b9iot').append(duo);
    let a='';const Y=v=>200-v/40*170;[0,10,20,30,40].forEach(v=>a+=line(60,Y(v),320,Y(v),'#222',1)+tx(52,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    a+=rect(90,Y(21.1),70,200-Y(21.1),'#ddd')+tx(125,Y(21.1)-8,'21,1',{s:14,f:'#fff',w:600})+tx(125,220,'2025',{s:13,f:GRAY});
    a+=rect(220,Y(39),70,200-Y(39),'none','#ddd',' stroke-dasharray="4 3" stroke-width="1.5"')+tx(255,Y(39)-8,'39',{s:14,f:'#fff',w:600})+tx(255,220,'2030 (atteso)',{s:13,f:GRAY});
    a+=tx(160,Y(31),'≈ 13% l\'anno',{s:12.5,f:GRAY});
    cell(duo,'Dispositivi connessi, miliardi',a,340,230,'Dispositivi IoT','Quasi il doppio in cinque anni.');
    let b='';[['Wi-Fi',32],['Bluetooth',24],['Rete cellulare',22],['Altre',22]].forEach(([l,v],k)=>{const y=14+k*46;b+=tx(100,y+20,l,{s:13.5,f:k<3?'#fff':GRAY,a:'end'})+rect(110,y+4,v*6,24,k<3?'#9a9a9a':'#333')+tx(116+v*6,y+21,v+'%',{s:13.5,f:'#fff',a:'start'})});
    b+=tx(170,210,'Wi-Fi, Bluetooth e reti cellulari: circa il 78%',{s:12.5,f:GRAY});
    cell(duo,'Quota delle connessioni IoT',b,340,230,'Connettività IoT','Tre tecnologie portano la maggior parte delle connessioni.');
  })();
  /* analysis loop */
  (function(){
    let s='<defs>'+arrowDef('b9l1',GRAY)+arrowDef('b9l2','#ddd')+'</defs>';const st=[['Generare dati','persone, macchine,','transazioni, IoT'],['Acquisizione','batch, streaming:','ETL, ELT, API, Kafka'],['Memorizzare','DWH, data lake,','lakehouse'],['Analizzare','BI, statistica, ML:','KNIME, Python, R, Spark'],['Conoscenze','decisioni, azioni,','agenti AI']];
    s+='<path d="M650 70 C 650 30, 640 26, 600 26 L 120 26 C 80 26, 73 34, 73 66" fill="none" stroke="#ddd" stroke-width="1.6" marker-end="url(#b9l2)"/>';
    s+=tx(360,50,'le conoscenze cambiano le decisioni, le decisioni generano nuovi dati',{s:13,f:'#fff'});
    st.forEach(([a,b,c],k)=>{const x=6+k*143;s+=rect(x,70,134,40,'#1a1a1a','#bbb')+tx(x+67,95,a,{s:14,f:'#fff',w:600})+tx(x+67,130,b,{s:12.5,f:GRAY})+tx(x+67,146,c,{s:12.5,f:GRAY});if(k<4)s+=line(x+135,90,x+141,90,GRAY,1.5,' marker-end="url(#b9l1)"')});
    s+=tx(360,178,'quindi i modelli vanno monitorati e riaddestrati nel tempo',{s:12.5,f:GRAY});
    svgBox($('#b9loop'),720,188,s,'Il processo di analisi come ciclo','46rem');
  })();
  /* Zalando forecast error */
  (function(){
    let s='';const L=170,R=640,X=v=>L+v/0.7*(R-L);[0,0.2,0.4,0.6].forEach(v=>s+=line(X(v),10,X(v),140,'#222',1)+tx(X(v),158,fi(v,1),{s:12.5,f:GRAY}));
    [['previsione ingenua',0.603,'#555'],['LightGBM',0.489,'#9a9a9a'],['transformer',0.449,'#fff']].forEach(([l,v,c],k)=>{const y=16+k*42;s+=tx(L-10,y+19,l,{s:13.5,f:'#fff',a:'end'})+rect(X(0),y,X(v)-X(0),28,c)+tx(X(v)+8,y+19,fi(v,3),{s:13.5,f:'#fff',a:'start'})});
    s+=tx((L+R)/2,176,'errore di previsione della domanda, dati 2022 (più basso è meglio)',{s:12.5,f:GRAY});
    svgBox($('#b9zal'),720,184,s,'Errore di previsione della domanda di Zalando per modello','46rem');
  })();
  wideFigs(9);
};
QZ['9a']=()=>[{q:'Quale di questi è un compito predittivo nel senso della lezione?',o:['Scrivere un\'e-mail personalizzata per ogni segmento di clienti','Stimare la probabilità di ogni cliente di andarsene il mese prossimo','Generare nuove immagini di prodotto per una campagna','Abbozzare le risposte alle recensioni dei clienti'],a:1,
  e:'Un modello predittivo impara una funzione dalle feature a un target, qui «se ne andrà» con una probabilità. Gli altri tre creano contenuti nuovi: AI generativa.',h:'Cerca una variabile target da stimare.'}];
QZ['9b']=()=>[{q:'Usando gli estremi superiori di McKinsey, che quota del potenziale economico totale dell\'AI (25,6 migliaia di miliardi di dollari) viene dalla produttività resa possibile dall\'AI generativa (7,9)?',o:['17%','69%','31%','45%'],a:2,
  e:'7,9 / 25,6 ≈ 0,31, quindi circa il 31%, dentro l\'intervallo dal 30 al 35% del grafico; il restante 69% è predittivo.',h:'Dividi la parte generativa per il totale.'}];
QZ['9c']=()=>[{q:'Un data warehouse tiene istantanee mensili dei saldi dei clienti degli ultimi dieci anni. Quale proprietà di Inmon illustra?',o:['Integrato','Orientato ai soggetti','Non volatile','Variabile nel tempo'],a:3,
  e:'Variabile nel tempo significa che i dati sono istantanee periodiche dell\'attività che coprono diversi anni di storia.',h:'Confronta la descrizione con le quattro definizioni una per una.'}];
QZ['9d']=()=>[{q:'Da 2 ZB nel 2010 a circa 181 ZB nel 2025: all\'incirca quante volte è cresciuto il volume annuo, e quanti terabyte ci sono in uno zettabyte?',o:['Circa 90 volte; un miliardo di TB','Circa 9 volte; un milione di TB','Circa 180 volte; un miliardo di TB','Circa 90 volte; mille TB'],a:0,
  e:'181 / 2 ≈ 90. Uno zettabyte è 10²¹ byte e un terabyte 10¹², quindi 1 ZB = 10⁹ TB, un miliardo di terabyte.',h:'Conta i gradini da mille fra TB e ZB sulla scala.'}];
QZ['9e']=()=>[{q:'Il transformer di Zalando ha un errore di 0,449, contro 0,489 di LightGBM e 0,603 di una previsione ingenua. Di quanto riduce, in termini relativi, l\'errore di LightGBM e quello della previsione ingenua?',o:['Circa il 4% e il 15%','Circa l\'8% e il 26%','Circa il 40% e il 15%','Circa il 9% e il 34%'],a:1,
  e:'(0,489 − 0,449) / 0,489 ≈ 0,082, circa l\'8%; (0,603 − 0,449) / 0,603 ≈ 0,255, circa il 26%. Una baseline ad alberi con gradient boosting cattura già la maggior parte del guadagno rispetto alla previsione ingenua.',h:'Riduzione relativa = (vecchio − nuovo) / vecchio.'}];
QZ['9']=()=>[
  {q:'I dispositivi IoT erano 21,1 miliardi nel 2025. Crescendo di circa il 13% l\'anno, quanti saranno all\'incirca nel 2030?',o:['Circa 39 miliardi','Circa 35 miliardi','Circa 24 miliardi','Circa 60 miliardi'],a:0,
   e:'La crescita è composta: 21,1 × 1,13⁵ ≈ 21,1 × 1,84 ≈ 38,9 miliardi, i 39 miliardi della previsione. Aggiungere cinque volte il 13% di 21,1 (35 miliardi) dimentica l\'effetto composto.',h:'Applica il 13% a una base che cresce ogni anno.'},
  {q:'Trenitalia si aspetta un taglio dell\'8% dei costi di manutenzione, che ammontano a circa 1,3 miliardi di euro l\'anno, a fronte di un investimento di circa 50 milioni di euro. Qual è il risparmio annuo, e in quanto tempo all\'incirca si recupera l\'investimento?',o:['10,4 milioni di euro; circa 5 anni','104 milioni di euro; circa 6 mesi','104 milioni di euro; circa 2 anni','1,04 miliardi di euro; circa 2 settimane'],a:1,
   e:'0,08 × 1300 = 104 milioni di euro l\'anno, gli «oltre 100 milioni» della lezione. 50 milioni / 104 milioni ≈ 0,48 anni, circa sei mesi.',h:'Prima l\'8% di 1,3 miliardi, poi dividi l\'investimento per il risparmio annuo.'},
  {q:'Nell\'indagine State of AI, su 1000 organizzazioni, quante sono AI high performer, e che quota sono delle organizzazioni che usano l\'AI?',o:['6, circa lo 0,7%','60, circa il 6,7%','60, circa il 13,6%','440, circa il 49%'],a:1,
   e:'Il 6% di 1000 è 60; chi usa l\'AI è l\'89%, cioè 890 organizzazioni, e 60 / 890 ≈ 6,7%.',h:'Gli high performer sono il 6% di tutte le organizzazioni, non di quelle che usano l\'AI.'},
  {q:'Un sistema degli ordini deve mostrare la giacenza di ogni articolo, aggiornata a ogni vendita; un analista ha bisogno di dieci anni di vendite mensili per regione. Quali sistemi sono adatti?',o:['Il data warehouse per entrambi','Il database operativo per entrambi','Il database operativo per la giacenza, il data warehouse per lo storico delle vendite','Il data warehouse per la giacenza, il database operativo per lo storico'],a:2,
   e:'I database operativi contengono dati completi e attuali aggiornati in tempo reale per le operazioni quotidiane; il warehouse contiene la storia aggregata come istantanee periodiche per l\'analisi.',h:'Ricorda le righe «Dati» e «Uso» della tabella di confronto.'},
  {q:'Un\'azienda dice di non avere Big Data perché i suoi database arrivano in tutto a soli 2 TB, anche se riceve un flusso continuo di letture di sensori e migliaia di recensioni in testo libero. Che cosa risponderebbe la lezione?',o:['Ha ragione: sotto il petabyte non ci sono Big Data','I Big Data non sono solo volume: varietà e velocità spesso contano di più','Contano come Big Data solo i dati del web','Dovrebbe prima raccogliere tutti i dati del mondo'],a:1,
   e:'La slide della lezione che chiarisce il concetto fa notare che la varietà (recensioni non strutturate) e la velocità (sensori in streaming) spesso contano più del volume, e che contano i dati pertinenti.',h:'Ricorda la slide della lezione che chiarisce il concetto di Big Data.'},
  {q:'Una banca vuole segnalare le transazioni con carta fraudolente, che sono circa lo 0,1% di tutte le transazioni. Quale impostazione corrisponde alla tabella della lezione?',o:['Regressione sull\'importo di ogni transazione','Clustering dei clienti in segmenti','Classificazione su dati molto sbilanciati, con individuazione delle anomalie e tecniche come SMOTE','Previsione su serie storiche delle transazioni della settimana prossima'],a:2,
   e:'L\'individuazione delle frodi è una classificazione con una classe positiva molto rara: modelli come i gradient boosted trees, con SMOTE per creare frodi sintetiche, e individuazione delle anomalie.',h:'Guarda l\'ultima tabella della lezione.'}
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
/* ---------- Lingua: nelle materie con più lingue il selettore ricorda la scelta e porta alla stessa lezione ---------- */
document.querySelectorAll('.lang a[data-lang]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();try{localStorage.setItem('lingua-'+a.dataset.mid,a.dataset.lang)}catch(_){}
  location.href=a.getAttribute('href')+location.hash}));
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
  if(typeof paintProgress==='function')paintProgress();
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m&&NUMS.includes(+m[1])?+m[1]:NUMS[0],false)})();
renderMath(document.querySelector('footer'));

/* ---------- Barra di scorrimento come mappa: domande in azzurro molto velato, riepiloghi in ambra velato, teoria nel colore della barra ----------
   La barra rappresenta tutta la pagina: un punto a quota y sta a y/altezza della pagina lungo la barra, la stessa regola del cursore. */
var paintBar=(function(){
  let raf=0;const root=document.documentElement;
  function paint(){raf=0;
    const art=lessons.find(l=>!l.hidden);if(!art)return;
    const cs=getComputedStyle(root),T=cs.getPropertyValue('--sb-text').trim(),Q=cs.getPropertyValue('--sb-quiz').trim()||cs.getPropertyValue('--theme').trim(),R=cs.getPropertyValue('--sb-recap').trim();
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

/* ---------- Avanzamento della lezione: percentuale a decine (0%, 10%, … 100%) ----------
   Su schermi larghi l'etichetta segue il cursore della barra di scorrimento; su telefono sta in basso a sinistra.
   La percentuale misura quanto della lezione aperta è passato sopra il bordo inferiore dello schermo. */
var paintProgress=(function(){
  const tag=el('div','prog');tag.setAttribute('aria-hidden','true');document.body.append(tag);
  let raf=0;const root=document.documentElement;
  function paint(){raf=0;
    const art=lessons.find(l=>!l.hidden);if(!art){tag.hidden=true;return}tag.hidden=false;
    const sy=window.scrollY,vh=window.innerHeight,H=root.scrollHeight,top=art.getBoundingClientRect().top+sy,h=art.offsetHeight;
    let p=Math.min(1,Math.max(0,(sy+vh-top)/h));if(sy+vh>=H-2)p=1;
    tag.textContent=Math.floor(p*10+1e-9)*10+'%';
    if(window.innerWidth>=900){
      /* centro del cursore: (scroll + metà schermo) / altezza pagina, riportato all'altezza dello schermo */
      const c=(sy+vh/2)/H*vh,hd=(document.querySelector('.top')||{offsetHeight:0}).offsetHeight;
      tag.style.top=Math.round(Math.min(vh-72,Math.max(hd+8,c-14)))+'px';tag.classList.remove('low')}
    else{tag.style.top='';tag.classList.add('low')}}
  const go=()=>{if(!raf)raf=requestAnimationFrame(paint)};
  window.addEventListener('scroll',go,{passive:true});window.addEventListener('resize',go);
  try{new ResizeObserver(go).observe(document.body)}catch(e){}
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
  /* archivio: ogni domanda, con la lezione da cui nasce e la risposta, va a /api/domande sul server del sito
     (dietro la stessa password); serve a capire che domande sorgono e a migliorare le lezioni future */
  function save(q,n,ans,model,err){try{const l=byN(n);
    fetch('/api/domande',{method:'POST',keepalive:ans.length<60000,headers:{'Content-Type':'application/json'},
      body:JSON.stringify({materia:location.pathname.split('/').filter(Boolean)[0]||'',corso:document.title,lezione:n,titolo:l?l.dataset.title:'',domanda:q,risposta:ans,modello:model,errore:err})}).catch(()=>{})}catch(e){}}
  go.onclick=async()=>{const q=ta.value.trim(),k=q&&key();if(!k)return;
    const cur=(lessons.find(l=>!l.hidden)||lessons[0]).dataset.n|0;
    if(histN!==cur){hist=[];histN=cur}
    if(ctrl)ctrl.abort();ctrl=new AbortController();const sig=ctrl.signal;
    o.textContent='…';go.disabled=true;ta.value='';
    const contents=[{role:'user',parts:[{text:context(q,cur)}]},{role:'model',parts:[{text:'OK.'}]},...hist,{role:'user',parts:[{text:q}]}];
    const skip=ls('gemini-skip').split(',');let txt='',err='',used='';
    try{for(const [m,th] of MODELS){if(skip.includes(m))continue;if(sig.aborted)break;used=m;
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
    catch(e){if(e.name!=='AbortError'){o.textContent=txt||String(e);err=err||String(e)}}
    save(q,cur,txt,used,txt?'':err)
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
