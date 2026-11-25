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
  prev:'Lezione precedente',next:'Lezione successiva',toc:'In questa lezione',dl:'Scarica le lezioni (Markdown, per NotebookLM)',dlFig:'Figura',dlMap:'Mappa mentale',dlQuiz:'Quiz',dlAns:'Risposta giusta',dlExp:'Spiegazione',dlHint:'Suggerimento',dlLesson:'Lezione',dlInq:'Quiz nel testo',qnum:'Domanda',reveal:'Mostra la soluzione',expl:'Perché',noLang:'Questa lezione non è ancora disponibile in questa lingua',partTag:'Parte {p} · {d}',partEnd:'Fine della parte di {d}',partEndTxt:'Le lezioni da {a} a {b} sono di {d}. Dalla lezione {n} il corso passa a {d2}.',partStart:'Inizia la parte di {d}',partStartTxt:'Qui comincia la parte {p} del corso, tenuta da {d}.',partNav:'Parte {p}: {d}',toLight:'Passa al tema chiaro',toDark:'Passa al tema scuro',
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
    const box=el('div','q'),fin=!root.classList.contains('inq');box.append(el('p','',(fin?'<b class="qn">'+UI.qnum+' '+(qi+1)+'.</b> ':'')+q.q));
    const opts=el('div','opts'),fb=el('div','fb'),chk=btn(UI.check);chk.classList.add('solid','chk');fb.setAttribute('aria-live','polite');
    let sel=null;const key=quizKey(root,qi,q);
    const bsq=q.o.map((t,i)=>{const b=btn(t,true);b.onclick=()=>{sel=i;bsq.forEach((x,j)=>{press(x,j===i);x.classList.remove('right','wrong')});fb.innerHTML=''};opts.append(b);return b});
    const verify=save=>{if(sel===null){fb.innerHTML=UI.pickFirst;return}
      press(bsq[sel],false);bsq[sel].classList.add(sel===q.a?'right':'wrong');box.classList.add('done');
      const ex='<div class="expl"><b>'+UI.expl+'.</b> '+q.e+'</div>';
      if(sel===q.a)fb.innerHTML='<b>'+UI.right+'</b>'+ex;
      else{fb.innerHTML='<b>'+UI.wrong+'</b> '+q.h+' ';const rv=el('button','rev',UI.reveal);rv.type='button';
        rv.onclick=()=>{bsq[q.a].classList.add('right');fb.innerHTML='<b>'+UI.wrong+'</b> '+q.h+ex;renderMath(fb)};fb.append(rv)}
      if(typeof renderMath==='function')renderMath(fb);
      if(save)try{localStorage.setItem(key,String(sel))}catch(e){}};
    chk.onclick=()=>verify(true);
    box.append(opts,chk,fb);root.append(box);
    let v=null;try{v=localStorage.getItem(key)}catch(e){}
    if(v!==null&&+v>=0&&+v<bsq.length){sel=+v;verify(false)}
  });
}
const INIT={},QZ={},THUMB={},MAPPA={};
/* mappa mentale per i riepiloghi: MAPPA[k]={c:'centro', r:[{t:'ramo', c:COLORE, v:['voce','voce']}]}, nell'HTML <div class="w" data-mappa="k"></div>.
   Due disegni: largo (centro in mezzo, rami a destra e a sinistra) e stretto per i telefoni (centro in alto, rami in colonna); il CSS mostra quello giusto. */
function mappa(root,m){
  /* a capo stimando la larghezza del testo a 13 px: maiuscole più larghe, punteggiatura e lettere sottili più strette; n è la larghezza in caratteri medi */
  const wid=t=>[...t].reduce((a,c)=>a+(/[A-Z]/.test(c)?1.32:/[mwMW]/.test(c)?1.45:/[ilj.,:;'!|() frt]/.test(c)?.62:1),0);
  const wrap=(t,n)=>{const o=[];let l='';String(t).split(' ').forEach(w=>{if(l&&wid(l+' '+w)>n){o.push(l);l=w}else l=l?l+' '+w:w});if(l)o.push(l);return o};
  const card=(x,y,w,b,n)=>{const ls=b.v.map(v=>wrap(v,n));const h=40+ls.reduce((a,l)=>a+l.length*18+6,0)+4;
    let s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="#0d0d0d" stroke="'+b.c+'" stroke-width="1.6"/>'+tx(x+14,y+25,b.t,{s:14.5,a:'start',f:b.c,w:600});
    let yy=y+48;ls.forEach(l=>{s+='<circle cx="'+(x+17)+'" cy="'+(yy-4.5)+'" r="2.6" fill="'+b.c+'"/>';l.forEach((t,j)=>s+=tx(x+28,yy+j*18,t,{s:13,a:'start',f:'#e6e6e6'}));yy+=l.length*18+6});
    return {s,h}};
  const hdr=(cx,cy,w,cw)=>{const h=26+cw.length*19;let s='<rect x="'+(cx-w/2)+'" y="'+(cy-h/2)+'" width="'+w+'" height="'+h+'" rx="12" fill="#1c1c1c" stroke="#fff" stroke-width="1.8"/>';
    cw.forEach((t,j)=>s+=tx(cx,cy-h/2+30+j*19,t,{s:15,f:'#fff',w:600}));return {s,h}};
  /* largo: rami divisi fra destra e sinistra in modo da pareggiare le altezze, in senso orario */
  const W=720,cwid=236,g=14,hs=m.r.map(b=>card(0,0,cwid,b,28).h);let k=Math.ceil(m.r.length/2),best=1e9;
  for(let i=1;i<m.r.length;i++){const a=hs.slice(0,i).reduce((p,q)=>p+q+g,0),b=hs.slice(i).reduce((p,q)=>p+q+g,0);if(Math.abs(a-b)<best){best=Math.abs(a-b);k=i}}
  const R=m.r.slice(0,k),Lf=m.r.slice(k).reverse(),col=bs=>bs.reduce((p,b)=>p+card(0,0,cwid,b,28).h+g,-g);
  const H=Math.max(col(R),col(Lf),120)+20,cy=H/2,ce=hdr(W/2,cy,176,wrap(m.c,17)),sp=(i,n)=>n>1?(i/(n-1)-.5)*Math.min(ce.h-20,n*12):0;let s='',lines='';
  [[R,W-cwid-8,W/2+88,1],[Lf,8,W/2-88,-1]].forEach(([bs,x,ex,d])=>{let y=(H-col(bs))/2;bs.forEach((b,i)=>{const c=card(x,y,cwid,b,28),my=y+c.h/2,tx_=d>0?x:x+cwid,sy=cy+sp(d>0?i:bs.length-1-i,bs.length)*(d>0?1:-1);
    lines+='<path d="M'+ex+' '+sy+' C'+(ex+d*30)+' '+sy+','+(tx_-d*30)+' '+my+','+tx_+' '+my+'" fill="none" stroke="'+b.c+'" stroke-width="2" stroke-opacity=".8"/>';s+=c.s;y+=c.h+g})});
  const a=el('div','mm-w');a.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Mappa mentale: '+m.c+'">'+lines+ce.s+s+'</svg>';
  /* stretto: centro in alto, un tronco a sinistra, rami in colonna */
  const N=360,ch=hdr(N/2,0,N-24,wrap(m.c,34));let y=ch.h+22,sn='',ln='',lastY=0;
  m.r.forEach(b=>{const c=card(40,y,N-50,b,38);ln+='<path d="M22 '+(y+21)+' H40" stroke="'+b.c+'" stroke-width="2"/>';sn+=c.s;lastY=y;y+=c.h+12});
  ln='<path d="M22 '+(ch.h+4)+' V'+(lastY+21)+'" stroke="#777" stroke-width="2"/>'+ln;
  const b2=el('div','mm-n');b2.innerHTML='<svg viewBox="0 0 '+N+' '+(y-6)+'" role="img" aria-label="Mappa mentale: '+m.c+'">'+ln+'<g transform="translate(0,'+(ch.h/2+4)+')">'+ch.s+'</g>'+sn+'</svg>';
  const box=el('div','mmap');box.append(a,b2);root.append(box);
}

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
  THUMB[10]=sv('<line x1="10" y1="62" x2="100" y2="62" stroke="#555"/>'+[1371,698,568,479,453,423,364,384,416,404,450,1033].map((v,i)=>'<rect x="'+(12+i*7.4)+'" y="'+(62-v*0.036)+'" width="6" height="'+(v*0.036)+'" fill="#bbb"/>').join('')+'<line x1="52" y1="8" x2="52" y2="62" stroke="'+YEL+'" stroke-width="1.6"/>');
  THUMB[11]=sv('<rect x="14" y="10" width="80" height="52" fill="none" stroke="#555"/>'+[0,1,2,3].map(i=>'<line x1="14" y1="'+(23+i*13)+'" x2="94" y2="'+(23+i*13)+'" stroke="#333"/>').join('')+[[30,16],[62,29],[46,42],[78,55]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3.2" fill="'+PUR+'"/>').join('')+'<circle cx="86" cy="18" r="3.6" fill="'+RED+'"/>');
  THUMB[12]=sv('<line x1="14" y1="62" x2="94" y2="62" stroke="#666"/><line x1="14" y1="62" x2="14" y2="8" stroke="#666"/><line x1="14" y1="62" x2="94" y2="8" stroke="#555" stroke-dasharray="3 3"/><path d="M14 62 C 18 22, 34 12, 94 8" fill="none" stroke="'+GRN+'" stroke-width="2.4"/>');
  THUMB[13]=sv('<line x1="54" y1="16" x2="28" y2="40" stroke="#888"/><line x1="54" y1="16" x2="80" y2="40" stroke="#888"/><line x1="28" y1="40" x2="16" y2="62" stroke="#888"/><line x1="28" y1="40" x2="40" y2="62" stroke="#888"/><line x1="80" y1="40" x2="68" y2="62" stroke="#888"/><line x1="80" y1="40" x2="92" y2="62" stroke="#888"/>'+[[54,16,'#ddd'],[28,40,'#ddd'],[80,40,'#ddd'],[16,62,GRN],[40,62,'#666'],[68,62,GRN],[92,62,GRN]].map(([x,y,c])=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="'+c+'"/>').join(''));
  THUMB[14]=sv('<line x1="10" y1="62" x2="100" y2="62" stroke="#555"/>'+[[.942,'#8a8a8a'],[.682,GRN],[.911,'#8a8a8a'],[.752,GRN],[.754,'#8a8a8a'],[.762,GRN]].map(([v,c],i)=>'<rect x="'+(14+i*14+(i>>1)*4)+'" y="'+(62-(v-.4)*90)+'" width="11" height="'+((v-.4)*90)+'" fill="'+c+'"/>').join(''));
  THUMB[15]=sv('<rect x="10" y="12" width="56" height="8" fill="#666"/><rect x="10" y="26" width="76" height="8" fill="#666"/><rect x="10" y="40" width="44" height="8" fill="#666"/>'+'<rect x="72" y="12" width="26" height="8" fill="'+RED+'"/><rect x="60" y="40" width="20" height="8" fill="'+GRN+'"/><rect x="10" y="54" width="64" height="8" fill="'+BLUE+'"/>');
  THUMB[16]=sv('<circle cx="54" cy="36" r="26" fill="none" stroke="#bbb" stroke-width="5"/><circle cx="54" cy="36" r="11" fill="none" stroke="#bbb" stroke-width="4"/><circle cx="74" cy="24" r="3" fill="'+RED+'"/><circle cx="40" cy="54" r="2.4" fill="'+RED+'"/>');
  THUMB[108]=sv('<circle cx="54" cy="36" r="10" fill="none" stroke="#ddd" stroke-width="2"/>'+[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3,x=54+30*Math.cos(a),y=36+24*Math.sin(a);return '<line x1="'+(54+10*Math.cos(a))+'" y1="'+(36+10*Math.sin(a))+'" x2="'+x+'" y2="'+y+'" stroke="#666"/><rect x="'+(x-7)+'" y="'+(y-4)+'" width="14" height="8" rx="2" fill="'+[BLUE,YEL,PINK,ORG,GRN,TEAL][i]+'"/>'}).join(''));
  THUMB[116]=sv('<circle cx="54" cy="36" r="10" fill="none" stroke="#ddd" stroke-width="2"/>'+[0,1,2,3,4,5,6].map(i=>{const a=i*2*Math.PI/7,x=54+30*Math.cos(a),y=36+24*Math.sin(a);return '<line x1="'+(54+10*Math.cos(a))+'" y1="'+(36+10*Math.sin(a))+'" x2="'+x+'" y2="'+y+'" stroke="#666"/><rect x="'+(x-7)+'" y="'+(y-4)+'" width="14" height="8" rx="2" fill="'+[BLUE,YEL,PUR,GRN,PINK,ORG,TEAL][i]+'"/>'}).join(''));
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
/* mappa mentale del riepilogo */
MAPPA[1]={c:'Perché non basta il database operativo?',r:[
  {t:'Il problema',c:RED,v:['Gli stessi dati in più sistemi, con formati e versioni diversi','Progettato per scrivere singoli record, non per leggere milioni di righe','Report e transazioni si contendono la stessa macchina']},
  {t:'Cinque fasi',c:ORG,v:['RDBMS e SQL, anni Ottanta','Data warehouse, anni Novanta','OLAP, fine anni Novanta','Data mining, dal 2000','Big Data, dal 2012']},
  {t:'Report',c:YEL,v:['Operativo: ogni giorno, dettaglio più totali','Tattico: totali giornalieri o settimanali','Strategico: sintesi settimanale o mensile']},
  {t:'Data warehouse',c:BLUE,v:['Database analitico separato, unica fonte di verità','ETL: extract, transform, load, con un\'area di staging','Base della Business Intelligence']},
  {t:'OLAP',c:TEAL,v:['Cubi multidimensionali con metadati','Somme, medie e conteggi senza scrivere SQL','Report dinamici, come un\'enorme pivot']},
  {t:'Analisi',c:PINK,v:['Descrittiva: riassume il passato','Predittiva: stima la probabilità di esiti futuri','Data mining e machine learning']},
  {t:'Big Data',c:GRN,v:['Tre V: volume, velocità, varietà','Dati che un RDBMS non analizza in modo conveniente','Hadoop e Spark','Strutturati, semi-strutturati, non strutturati']}]};

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
/* mappa mentale del riepilogo */
MAPPA[2]={c:'Che cos\'è esattamente una tabella?',r:[
  {t:'Struttura',c:BLUE,v:['Tabella (relazione): record per righe, campi per colonne','Ogni campo: nome, tipo di dato, vincolo NULL','Tipi: CHAR, VARCHAR, DATE, INT, FLOAT, DECIMAL','Indice: trova un record senza leggere tutto']},
  {t:'Integrità',c:YEL,v:['Entità: chiave primaria, niente duplicati','Referenziale: chiave esterna, valore esistente o NULL','Dominio: tipi di dato, NULL e CHECK']},
  {t:'Normalizzazione',c:GRN,v:['Ogni fatto in un solo posto','Prima forma normale: valori atomici e chiave primaria','Terza forma normale: niente dipendenze transitive']},
  {t:'OLTP e data warehouse',c:ORG,v:['OLTP: normalizzato, transazioni senza errori','DWH: tabelle dei fatti (misure) e dimensioni (attributi)','Chiave surrogata dall\'ETL, chiave di business conservata']},
  {t:'SQL',c:PINK,v:['Dichiarativo: dici che cosa, l\'ottimizzatore sceglie come','Sottolinguaggi DQL, DDL, DCL, DML','UPDATE e DELETE senza WHERE toccano tutte le righe']},
  {t:'SELECT',c:TEAL,v:['Ordine: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY','Espressioni, alias, funzioni, DISTINCT','CASE: vince la prima condizione vera']}]};

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
/* mappa mentale del riepilogo */
MAPPA[3]={c:'Come si combinano due tabelle?',r:[
  {t:'Join',c:BLUE,v:['Prodotto cartesiano: tutte le coppie di righe','INNER JOIN: solo le coppie con ON vero','LEFT, RIGHT, FULL: anche le righe senza partner, con NULL']},
  {t:'UNION',c:GRN,v:['Aggiunge righe, non colonne','UNION elimina i duplicati, UNION ALL li tiene']},
  {t:'NULL',c:PUR,v:['Ogni confronto con NULL è UNKNOWN','ON, WHERE e HAVING tengono solo TRUE','IS NULL per verificare, COALESCE per sostituire']},
  {t:'Raggruppare',c:YEL,v:['SUM, AVG, COUNT, MIN, MAX: molte righe, un valore','GROUP BY: una riga per gruppo','WHERE filtra le righe prima, HAVING i gruppi dopo']},
  {t:'Sottoquery',c:PINK,v:['Una query dentro un\'altra: valore, elenco o tabella','Indipendente: eseguita una volta','Correlata: eseguita per ogni riga esterna','EXISTS: c\'è almeno una riga?']},
  {t:'Funzioni analitiche',c:TEAL,v:['Calcolano sul gruppo ma tengono ogni riga','OVER: PARTITION BY, ORDER BY, finestra','ROW_NUMBER, LAG e LEAD, media mobile, totale progressivo']}]};

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
/* mappa mentale del riepilogo */
MAPPA[4]={c:'E se una macchina non basta?',r:[
  {t:'Sistemi distribuiti',c:BLUE,v:['Nodo, rack, cluster','Scalabilità orizzontale: più server invece di uno più grande','Gli strumenti: Hadoop, Spark, NoSQL']},
  {t:'NoSQL',c:ORG,v:['Distribuiti, senza schema, scalabili','ACID: atomicità, coerenza, isolamento, durabilità','BASE: sempre disponibile, a coerenza finale']},
  {t:'Quattro famiglie',c:GRN,v:['Chiave-valore: DynamoDB','Documenti JSON o XML: MongoDB','A colonne: HBase, Cassandra','A grafo: Neo4j']},
  {t:'Compressione per colonne',c:YEL,v:['Una colonna: un solo tipo, valori ripetuti','Dizionario: ⌈log₂ k⌉ bit per codice','Run-length: terne, meglio se la colonna è ordinata']},
  {t:'Grafi',c:PINK,v:['Property graph: nodi e relazioni con proprietà','Relazioni orientate e con un nome','Cypher: si seguono gli archi invece dei join']},
  {t:'Database vettoriali',c:TEAL,v:['Embedding: significati simili, vettori vicini','Similarità del coseno','Indici ANN: HNSW, IVF','Ricerca semantica, raccomandazioni, RAG']}]};

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
/* mappa mentale del riepilogo */
MAPPA[5]={c:'Come si memorizza un file più grande di qualunque disco?',r:[
  {t:'Hadoop',c:BLUE,v:['HDFS per memorizzare, MapReduce per calcolare','Open source, migliaia di nodi, hardware comune','Tollerante ai guasti']},
  {t:'HDFS',c:GRN,v:['File tagliati in blocchi da 64 o 128 MB','Ogni blocco replicato 3 volte, su rack diversi','Name node: metadati; data node: letture e scritture','Erasure coding: sovraccarico del 50% invece del 200%']},
  {t:'MapReduce',c:YEL,v:['Map: coppie chiave/valore vicino ai dati','Shuffle: stessa chiave, stesso reducer','Reduce: calcolo per chiave, risultato in HDFS','Per job batch, non per query interattive']},
  {t:'Ecosistema',c:ORG,v:['Base: HDFS, YARN, MapReduce, Tez, Spark','Dati: Hive, Pig, HBase, Sqoop, Flume','Operativi: Ambari, Oozie, Zookeeper','Analisi: Mahout, Kylin, Spark, KNIME']},
  {t:'Oggi',c:PINK,v:['Hadoop: infrastruttura già installata','Object storage con Spark, Trino, Flink','Formati di tabella: Iceberg, Delta Lake','Da imparare: i concetti, non MapReduce']}]};

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
/* mappa mentale del riepilogo */
MAPPA[6]={c:'Che cosa rende Spark così veloce?',r:[
  {t:'In memoria',c:BLUE,v:['Legge una volta e tiene in memoria i risultati intermedi','Veloce anche su disco','Regressione logistica: oltre 100 volte più veloce']},
  {t:'Cluster',c:ORG,v:['Driver: le istruzioni e la SparkSession','Cluster manager: YARN, Mesos, standalone','Worker ed executor eseguono i task','Shuffle: dati scambiati fra executor']},
  {t:'RDD',c:TEAL,v:['Collezione immutabile e distribuita','Partizioni elaborate in parallelo','Creato da un file system o da una collezione']},
  {t:'Esecuzione pigra',c:PINK,v:['Trasformazioni: aggiungono passi al DAG','Azioni: eseguono il DAG, come collect()','Stage tagliati a ogni shuffle']},
  {t:'DataFrame e Spark SQL',c:YEL,v:['Colonne con un nome e uno schema noto','select, filter, groupBy, sum','Vista temporanea o tabella persistente','Fonti: CSV, JSON, JDBC, Parquet']}]};

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
/* mappa mentale del riepilogo */
MAPPA[7]={c:'Come gestisce Spark i dati che non smettono di arrivare?',r:[
  {t:'Structured Streaming',c:BLUE,v:['Un flusso è una tabella illimitata','La query si scrive una volta, come in batch','A ogni trigger si aggiorna la tabella dei risultati','readStream, window, writeStream']},
  {t:'Grafi',c:PINK,v:['Property graph: vertici e archi con proprietà','GraphX su RDD, GraphFrames su DataFrame','Gradi e sottografi','PageRank, componenti connesse, triangoli']},
  {t:'MLlib',c:GRN,v:['Regressione, classificazione, clustering, raccomandazione','Training set e test set','Preparare, addestrare, provare su dati nuovi']},
  {t:'Pipeline',c:YEL,v:['Transformer: aggiunge una colonna','Estimator: impara un modello','Evaluator: misura la qualità','Stessi passi per addestramento e prova']},
  {t:'Regressione logistica',c:TEAL,v:['Punteggio z = intercetta + somma dei pesi','Probabilità p = 1/(1 + e^(−z))','Sopra 0,5: etichetta 1']}]};

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
/* mappa mentale del riepilogo */
MAPPA[8]={c:'Dove vanno i dati grezzi?',r:[
  {t:'Data lake',c:BLUE,v:['Dati grezzi nel formato nativo, più dati elaborati','Strutturati, semistrutturati, non strutturati','Basato su Hadoop e Spark']},
  {t:'Lago e warehouse',c:ORG,v:['Warehouse: schema on write; lago: schema on read','Dati caldi nel warehouse, freddi nel lago','Il lago costa molto meno per terabyte']},
  {t:'Adozione in quattro passi',c:GRN,v:['Area di staging dei dati grezzi','Laboratorio di data science','Offloading dei dati freddi','Componente principale']},
  {t:'BI 2.0',c:YEL,v:['Le nuove fonti entrano direttamente nel lago','Parte dell\'ETL si sposta nel lago','Distillazione: risultati piccoli nel warehouse']},
  {t:'Governance',c:PINK,v:['Governance, qualità, metadati, formazione','I metadati rendono il lago ricercabile','Qualità: etichettare, non filtrare in ingresso']},
  {t:'Virtualizzazione',c:TEAL,v:['Uno strato logico, nessuna copia dei dati','Pro: costi minori, governance centrale','Contro: carica fonti e rete, lenta sui compiti complessi']}]};

/* Riepilogo delle lezioni 1-8 (A. Rezzani): mappe mentali e quiz misto */
INIT[108]=function(){codeHL($('#lezione-108'))};
MAPPA['108']={c:'Dove stanno i dati, e come si interrogano?',r:[
  {t:'1 · Evoluzione',c:BLUE,v:['Report sul database operativo','Warehouse, OLAP, data mining, Big Data','ETL e BI']},
  {t:'2-3 · SQL',c:YEL,v:['Tabelle, chiavi, normalizzazione','SELECT, join, GROUP BY','NULL, sottoquery, funzioni finestra']},
  {t:'4 · NoSQL',c:PINK,v:['Scalare in orizzontale','ACID contro BASE','Key-value, documenti, colonne, grafi']},
  {t:'5 · Hadoop',c:ORG,v:['HDFS: blocchi e repliche','MapReduce: map, shuffle, reduce','YARN, Hive, l\'ecosistema']},
  {t:'6-7 · Spark',c:GRN,v:['In memoria, DAG pigro','RDD e DataFrame','Streaming, grafi, MLlib']},
  {t:'8 · Data lake',c:TEAL,v:['Dati grezzi, schema on read','Accanto al warehouse','Governance o palude']}]};
MAPPA['108a']={c:'Dati per decidere',r:[
  {t:'Operativo',c:BLUE,v:['ERP, CRM','Scritture veloci, normalizzato','Dato attuale']},
  {t:'Warehouse',c:YEL,v:['Integrato e ripulito','Fatti e dimensioni','Unica fonte di verità']},
  {t:'ETL e BI',c:ORG,v:['Estrarre, trasformare, caricare','Report, OLAP, cruscotti']},
  {t:'Data lake',c:TEAL,v:['Grezzo, ogni formato','Schema on read','Distillazione verso il warehouse']}]};
MAPPA['108b']={c:'SQL',r:[
  {t:'Tabelle',c:YEL,v:['Chiave primaria ed esterna','NOT NULL, CHECK','1NF, 3NF']},
  {t:'Interrogare',c:BLUE,v:['FROM, WHERE, GROUP BY','HAVING, SELECT, ORDER BY']},
  {t:'Combinare',c:PINK,v:['INNER, LEFT, RIGHT, FULL','UNION e UNION ALL','EXISTS']},
  {t:'NULL',c:PUR,v:['Confronti: UNKNOWN','IS NULL, COALESCE','COUNT(*) conta tutto']},
  {t:'Finestre',c:TEAL,v:['OVER (PARTITION BY, ORDER BY)','ROWS BETWEEN','LAG, LEAD, ROW_NUMBER']}]};
MAPPA['108c']={c:'Quando una macchina non basta',r:[
  {t:'Distribuire',c:BLUE,v:['Nodi, rack, cluster','Scalabilità orizzontale']},
  {t:'Garanzie',c:YEL,v:['ACID: tutto o niente','BASE: coerenza alla fine']},
  {t:'NoSQL',c:PINK,v:['Key-value, documenti','Colonne (HBase), grafi (Neo4j)']},
  {t:'HDFS',c:ORG,v:['Blocchi da 128 MB','Replica 3, rack awareness','Name node e data node']},
  {t:'MapReduce',c:GRN,v:['Map, shuffle, reduce','Il calcolo va dai dati','Batch, non interattivo']}]};
MAPPA['108d']={c:'Spark',r:[
  {t:'Architettura',c:BLUE,v:['Driver e SparkSession','Executor e task','YARN, local[*]']},
  {t:'RDD',c:YEL,v:['Partizioni immutabili','Trasformazioni pigre, azioni','DAG, stage, shuffle']},
  {t:'DataFrame e SQL',c:GRN,v:['Colonne con schema','filter, groupBy, vista temporanea']},
  {t:'Stack',c:PINK,v:['Structured Streaming','GraphFrames','MLlib e pipeline']}]};
QZ['108']=()=>[
  {q:'Un\'analista vuole confrontare le vendite mensili degli ultimi dieci anni per regione, senza rallentare il sistema degli ordini. Dove dovrebbe lavorare?',o:['Sul database operativo, che ha i dati più aggiornati','Sul data warehouse, integrato e pensato per l\'analisi','Su un key-value store','Su un file CSV esportato a mano ogni mese'],a:1,
   e:'Il warehouse contiene lo storico integrato e ripulito, con dati aggregati, ed è separato dal sistema operativo: le analisi non competono con le transazioni.',h:'Ricorda i tre problemi dell\'analisi sul database operativo (lezione 1).'},
  {q:'Una query ha WHERE SUM(quantity) &gt; 10 e dà errore. Perché?',o:['SUM non esiste in SQL','WHERE filtra le righe prima del raggruppamento: una condizione su un\'aggregazione va in HAVING','Manca ORDER BY','quantity è NULL'],a:1,
   e:'Nell\'ordine logico WHERE viene prima di GROUP BY, quindi non può vedere le aggregazioni; HAVING filtra i gruppi dopo.',h:'Guarda la tabella dell\'ordine logico.'},
  {q:'La tabella Customers ha 5 clienti, di cui 2 senza vendite. Quante righe di clienti restituisce SELECT ... FROM Customers c INNER JOIN Sales s ON ... GROUP BY c.customer_id?',o:['5','3','2','0'],a:1,
   e:'L\'inner join tiene solo i clienti con almeno una vendita: 3. Per tenere tutti e 5 serve un LEFT JOIN, con i totali NULL (o 0 con COALESCE) per gli altri due.',h:'Che cosa fa l\'inner join alle righe senza partner?'},
  {q:'Che cosa restituisce SELECT COUNT(*), COUNT(city) su una tabella di 6 righe in cui city è NULL in 2 righe?',o:['6 e 6','4 e 4','6 e 4','4 e 6'],a:2,
   e:'COUNT(*) conta le righe, NULL compresi; COUNT(colonna) ignora i NULL.',h:'Solo una delle due forme ignora i NULL.'},
  {q:'Un file di 640 MB va in HDFS con blocchi da 128 MB e replica 3. Quanti blocchi vengono memorizzati in tutto, e quanto spazio occupano?',o:['5 blocchi, 640 MB','15 blocchi, 1.920 MB','15 blocchi, 640 MB','3 blocchi, 384 MB'],a:1,
   e:'640 / 128 = 5 blocchi, ciascuno copiato 3 volte: 15 blocchi, 640 × 3 = 1.920 MB.',h:'Prima i blocchi, poi moltiplica per la replica.'},
  {q:'In un programma Spark, quale riga fa partire davvero il calcolo?',o:['rdd.flatMap(...)','rdd.map(...)','counts.reduceByKey(...)','counts.collect()'],a:3,
   e:'flatMap, map e reduceByKey sono trasformazioni: allungano il DAG senza calcolare. collect è un\'azione e lo esegue.',h:'Trasformazioni o azioni?'},
  {q:'Una banca deve registrare un bonifico che toglie da un conto e aggiunge a un altro. Quale garanzia serve, e quale famiglia di database?',o:['BASE, un database di documenti','ACID, un database relazionale (o un sistema con transazioni ACID)','Nessuna, basta la replica di HDFS','Eventual consistency, un key-value store'],a:1,
   e:'Un bonifico non può restare a metà: serve l\'atomicità (tutto o niente) e la durabilità delle garanzie ACID.',h:'Che cosa succede se il sistema si ferma fra le due operazioni?'},
  {q:'Un\'azienda vuole conservare per anni log dei clic, immagini e recensioni, senza sapere ancora come li analizzerà. Che cosa propone la lezione 8?',o:['Normalizzarli in 3NF nel warehouse','Un data lake, con schema on read, accanto al warehouse','Cancellarli dopo un mese','Un cubo OLAP'],a:1,
   e:'Il lago tiene dati grezzi di ogni formato a basso costo e lascia decidere lo schema al momento della lettura; i risultati distillati possono poi passare nel warehouse.',h:'Schema on write o schema on read?'}
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
/* mappa mentale del riepilogo */
MAPPA[9]={c:'Perché un modello predittivo ha bisogno di un data warehouse?',r:[
  {t:'Predittiva e generativa',c:BLUE,v:['Predittiva: prevede un target dalle feature','Generativa: crea contenuti nuovi','Il valore viene ancora soprattutto dalla predittiva','Usano l\'AI l\'89%, high performer il 6%']},
  {t:'BI e data warehouse',c:YEL,v:['Raccogliere, ripulire, trasformare, presentare','Garbage in, garbage out','Inmon: integrato, orientato ai soggetti, non volatile, variabile nel tempo','Data mart, data mesh, lakehouse']},
  {t:'Big Data',c:GRN,v:['Cinque V: volume, varietà, velocità, valore, veridicità','Non solo volume, non solo web, non tutti','Fonti tradizionali ed emergenti, IoT','Fattori abilitanti e fattori scatenanti']},
  {t:'Dalla domanda al modello',c:PINK,v:['Ciclo: dati, analisi, conoscenze, decisioni','Target, dati storici, modello validato, KPI','Undici casi aziendali']},
  {t:'Insegnamenti dei casi',c:ORG,v:['Confrontarsi sempre con una baseline','Etica e diritto: GDPR, AI Act','Riaddestrare i modelli nel tempo']},
  {t:'Compiti tipici',c:TEAL,v:['Abbandono: classificazione binaria','Frodi: dati sbilanciati, anomalie','Vendite: regressione e serie storiche','Guasti: classificazione e sopravvivenza']}]};

/* Lezione 10: KNIME e analisi di base dei dati (dataset IBM Telco Customer Churn) */
const TELSC=[[31,639],[72,1849],[14,773],[21,416],[72,6130],[15,1071],[1,60],[66,1374],[5,426],[53,4872],[7,665],[57,1088],[4,191],[31,2484],[47,943],[9,191],[45,892],[43,3539],[45,929],[65,1293],[3,79],[62,4820],[56,3808],[6,487],[7,151],[17,1454],[29,602],[21,2158],[13,966],[37,3341],[1,45],[47,3650],[26,1407],[21,1559],[28,2290],[1,25],[47,949],[1,20],[56,5841],[63,6479],[17,1207],[3,246],[71,7532],[1,95],[63,4449],[17,1111],[1,19],[57,5012],[2,187],[63,5040],[29,2263],[4,365],[72,8436],[36,2498],[68,4911],[1,51],[8,412],[18,411],[1,20],[5,353],[35,1655],[71,7283],[19,1495],[57,2258],[56,4093],[20,434],[28,543],[44,2265],[72,8306],[1,93],[2,104],[2,109],[4,285],[23,454],[11,484],[35,2442],[55,1140],[62,7159],[47,4536],[26,1908],[8,438],[41,3089],[11,202],[10,857],[10,492],[71,1672],[63,6536],[8,446],[4,184],[46,4630],[15,1346],[25,2029],[7,344],[72,7898],[53,3046],[5,392],[1,49],[21,2254],[29,535],[12,224],[19,1376],[12,594],[68,1378],[30,2680],[50,4304],[43,2342],[72,7346],[17,1071],[2,97],[45,4192],[72,4575],[8,564],[27,805],[16,1391],[56,4261],[51,4473],[51,1529],[26,2089],[3,197],[71,5140],[1,90],[1,21],[72,8033],[40,1716],[28,1655],[47,4065],[62,2346],[28,2626],[25,1952],[68,5763],[36,1267],[1,69],[1,45],[22,472],[32,2954],[27,1894],[51,3121],[49,3472],[23,1677],[2,35],[6,124],[2,39],[71,1813],[42,3944],[4,215],[2,44],[18,358],[6,171],[2,185],[1,96],[14,1044],[30,1562],[27,2210],[9,714],[17,1166],[29,2830],[33,2990],[66,7384],[2,165],[45,2320],[15,309],[8,607],[10,914],[6,129],[53,4921],[1,45],[72,6735],[65,7246],[72,7790],[5,478],[67,5798],[71,5154],[52,2276],[70,5222],[35,3528],[31,1520],[1,94],[47,4042],[71,7904],[72,6369],[28,2434],[16,1449],[72,1751],[70,5264],[30,2624],[23,1222],[63,6110],[2,139],[1,54],[3,293],[1,87],[68,1396],[43,2907],[1,51],[1,19],[3,274],[23,1868],[7,481],[67,5884],[9,530],[13,357],[8,366],[52,4327],[48,4445],[33,641],[72,1779],[17,1323],[70,8152],[48,3545],[72,7286],[5,375],[20,1641],[1,50],[6,218],[72,8405],[35,739],[24,453],[34,2004],[24,2283],[27,1499],[3,189],[12,1000],[61,1552],[6,434],[47,3826],[19,1932],[4,221],[1,20],[22,2157],[2,132],[24,2231],[6,355],[26,1190],[10,1038],[60,1205],[24,1559],[39,1971],[71,6224],[19,1687],[22,413],[16,1483],[40,855],[1,20],[8,760],[55,3132],[55,3617],[1,43],[61,3779],[46,1489],[61,5527],[29,655],[10,187],[3,271],[12,1133],[68,5647],[9,296],[26,2515],[4,208],[69,4578],[12,356],[15,1400],[1,85],[62,1297],[60,3582],[47,3866],[5,114],[1,85],[29,2516],[45,4634],[31,3144],[51,4019],[66,4859],[2,116],[63,1209],[72,6689],[50,5348],[22,1049],[1,45],[17,1607],[6,495],[26,684],[45,4369],[60,3603],[71,7383],[46,3255],[40,3707],[2,179],[25,547],[32,2619],[63,3708],[1,44],[3,92],[32,2202],[18,392],[70,7842],[1,70],[5,420],[12,246],[2,194],[65,7082],[50,5190],[24,2542],[42,4323],[12,224],[7,673],[9,770],[31,2641],[29,1696],[37,695],[2,33],[72,6786],[13,1029],[1,44],[61,5321],[23,1284],[70,3370],[16,1213],[5,250],[2,38],[1,44]];
const CHY=ORG,CHN=BLUE,MEANC=YEL,MEDC=PINK;
/* simple statistics on arrays */
const st10={mean:a=>a.reduce((x,y)=>x+y,0)/a.length,
  median:a=>{const b=[...a].sort((x,y)=>x-y),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2},
  r:(xs,ys)=>{const mx=st10.mean(xs),my=st10.mean(ys);let sxy=0,sx=0,sy=0;xs.forEach((x,i)=>{sxy+=(x-mx)*(ys[i]-my);sx+=(x-mx)**2;sy+=(ys[i]-my)**2});return sxy/Math.sqrt(sx*sy)}};
const gauss10=r=>{const u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
INIT[10]=function(){
  /* node in its four states */
  (function(){
    const g=el('div','multi');$('#b10node').append(g);
    const st=[['Non configurato','red','In attesa di configurazione o di dati.'],['Configurato','yel','Pronto per l\'esecuzione.'],['Eseguito','grn','Risultati disponibili a valle.'],['Errore','err','L\'esecuzione è fallita.']];
    st.forEach(([t,k,n])=>{
      let s=tx(90,20,'Row Filter',{s:13,f:'#ddd'});
      s+='<path d="M28 52l10 6l-10 6z" fill="#000" stroke="#bbb" stroke-width="1.5"/><path d="M142 52l10 6l-10 6z" fill="#000" stroke="#bbb" stroke-width="1.5"/>';
      s+=line(10,58,28,58,'#777',1.5)+line(152,58,170,58,'#777',1.5);
      s+=rect(60,30,60,56,'#FFD94A','#000',' rx="8"')+line(72,46,108,46,'#000',3)+line(72,58,100,58,'#000',3)+line(72,70,92,70,'#000',3);
      s+=rect(56,96,68,22,'#1b1b1b','#555',' rx="11"');
      const on={red:RED,yel:YEL,grn:GRN};
      if(k==='err'){s+='<circle cx="90" cy="107" r="8" fill="'+RED+'"/>'+line(86,103,94,111,'#000',2)+line(94,103,86,111,'#000',2)}
      else ['red','yel','grn'].forEach((c,i)=>{s+='<circle cx="'+(70+i*20)+'" cy="107" r="6.5" fill="'+(c===k?on[c]:'#333')+'"/>'});
      s+=tx(16,46,'in',{s:12,f:GRAY,a:'start'})+tx(164,46,'out',{s:12,f:GRAY,a:'end'});
      cell(g,t,s,180,126,'Nodo: '+t,n);
    });
  })();
  /* workflow of the lesson */
  (function(){
    let s='<defs>'+arrowDef('b10ar','#888')+'</defs>';
    const src=[70,190];
    const nd=[['Statistics','posizione, variabilità, forma',BLUE],['Histogram','distribuzione della permanenza',BLUE],['Crosstab','tabella di contingenza, χ², V di Cramér',YEL],['Scatter Plot','permanenza e spesa totale',YEL],['Linear Correlation','matrice di r e test t',YEL],['Box Plot','permanenza per abbandono',YEL],['One-way ANOVA','permanenza per contratto, test F',YEL]];
    nd.forEach(([n,q,c],i)=>{const y=34+i*52,x=330;
      s+='<path d="M'+(src[0]+30)+' '+src[1]+' C 200 '+src[1]+', 230 '+y+', '+(x-34)+' '+y+'" fill="none" stroke="#888" stroke-width="1.4" marker-end="url(#b10ar)"/>';
      s+=rect(x-26,y-18,36,36,c,'#000',' rx="6"')+tx(x+24,y-3,n,{s:14,f:'#fff',a:'start'})+tx(x+24,y+14,q,{s:12.5,f:GRAY,a:'start'})});
    s+=rect(src[0]-30,src[1]-24,60,48,'#ccc','#000',' rx="7"')+tx(src[0],src[1]+44,'CSV Reader',{s:14,f:'#fff'})+tx(src[0],src[1]+61,'telco_customer_churn.csv',{s:11.5,f:GRAY});
    s+=line(src[0]-14,src[1]-8,src[0]+14,src[1]-8,'#000',2.5)+line(src[0]-14,src[1],src[0]+14,src[1],'#000',2.5)+line(src[0]-14,src[1]+8,src[0]+6,src[1]+8,'#000',2.5);
    svgBox($('#b10wf'),640,390,s,'Workflow della lezione 10','40rem');
  })();
  /* data types tree */
  (function(){
    let s='';const b=(x,y,w,t,c,o)=>rect(x-w/2,y-16,w,32,'#111',c,' rx="6"')+tx(x,y+5,t,{s:o||14,f:c});
    s+=b(360,24,120,'Dati','#fff');
    s+=line(360,40,180,72,'#666')+line(360,40,540,72,'#666');
    s+=b(180,88,190,'Quantitativi (numerici)',BLUE,13.5)+b(540,88,190,'Qualitativi (categorici)',PINK,13.5);
    [[90,180,BLUE,'Discreti'],[270,180,BLUE,'Continui'],[450,540,PINK,'Nominali'],[630,540,PINK,'Ordinali']].forEach(([x,px,c,t])=>{s+=line(px,104,x,136,'#666')+b(x,152,140,t,c)});
    const ex=[[90,['n. di stanze,','prodotti acquistati'],'tenure (mesi, 0-72)'],[270,['vendite, reddito,','spesa mensile'],'MonthlyCharges ($)'],[450,['genere, metodo di','pagamento, regione'],'gender, PaymentMethod'],[630,['durata del contratto,','istruzione, voto 1-5'],'Contract']];
    ex.forEach(([x,l,t])=>{s+=tx(x,192,l[0],{s:12.5,f:'#ccc'})+tx(x,208,l[1],{s:12.5,f:'#ccc'})+tx(x,236,t,{s:12.5,f:'#fff',w:600})});
    svgBox($('#b10types'),720,250,s,'Tipi di dati','44rem');
  })();
  /* measurement levels staircase */
  (function(){
    let s='';const L=[['NOMINALE','categorie senza ordine','=, ≠','moda, frequenze, χ²','#3d6f99'],['ORDINALE','categorie ordinate','+ <, >','+ mediana, percentili','#2c5a85'],['A INTERVALLI','differenze, nessuno zero vero','+ +, −','+ media, dev. standard, correlazione','#22476e'],['DI RAPPORTI','differenze, zero vero','+ ×, ÷','+ CV, rapporti, tassi di crescita','#173658']];
    s+=tx(468,18,'operazioni',{s:12.5,f:GRAY})+tx(540,18,'statistiche ammesse',{s:12.5,f:GRAY,a:'start'});
    L.forEach(([n,d,o,st_,c],i)=>{const x=10+i*40,y=30+i*58;s+=rect(x,y,300,46,c)+tx(x+12,y+20,n,{s:13.5,f:'#fff',w:600,a:'start'})+tx(x+12,y+37,d,{s:12.5,f:'#dfe9f2',a:'start'});
      s+=tx(468,y+28,o,{s:14,f:'#fff'})+tx(540,y+28,st_,{s:13,f:'#ddd',a:'start'})});
    svgBox($('#b10levels'),760,262,s,'Livelli di misura','46rem');
  })();
  /* tenure histogram */
  (function(){
    const H=[1371,698,568,479,453,423,364,384,416,404,450,1033];let s='';const L=60,R=700,T=20,B=250,X=v=>L+v/72*(R-L),Y=v=>B-v/1500*(B-T);
    [0,500,1000,1500].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#262626',1)+tx(L-8,Y(v)+4,fi(v,0),{s:12.5,f:GRAY,a:'end'})});
    H.forEach((v,i)=>{s+=rect(X(i*6)+1.5,Y(v),X(6)-X(0)-3,B-Y(v),'#9a9a9a')+tx(X(i*6+3),Y(v)-6,fi(v,0),{s:11.5,f:'#ddd'})});
    for(let v=0;v<=72;v+=12)s+=tx(X(v),B+18,String(v),{s:12.5,f:GRAY});
    s+=line(L,B,R,B,'#777',1.2);
    s+=line(X(32.4),T,X(32.4),B,MEANC,2)+lbl(X(32.4)+6,T+60,'media 32,4',MEANC,{a:'start',s:13})+line(X(29),T,X(29),B,MEDC,2,' stroke-dasharray="6 4"')+lbl(X(29)-6,T+60,'mediana 29',MEDC,{a:'end',s:13});
    s+=tx((L+R)/2,B+38,'mesi di permanenza (tenure)',{s:13,f:GRAY})+tx(16,(T+B)/2,'clienti',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(T+B)/2+')"'});
    svgBox($('#b10hist'),720,300,s,'Istogramma dei mesi di permanenza','44rem');
  })();
  /* mean vs median on three scales */
  (function(){
    let s='';const rows=[['tenure (mesi)',0,72,32.4,29,0],['MonthlyCharges ($)',18.25,118.75,64.8,70.4,1],['TotalCharges ($)',18.8,8684.8,2283,1397,0]];const L=40,R=680;
    rows.forEach(([n,lo,hi,mn,md,d],k)=>{const y=58+k*86,X=v=>L+(v-lo)/(hi-lo)*(R-L);
      s+=tx(L,y-36,n,{s:13.5,f:'#ddd',a:'start'})+line(L,y,R,y,'#666',1.5)+tx(L,y+20,fi(lo,d===1?2:1),{s:12,f:GRAY})+tx(R,y+20,fi(hi,d===1?2:1),{s:12,f:GRAY});
      const dx=X(mn)-X(md),near=Math.abs(dx)<70;
      s+='<circle cx="'+X(md)+'" cy="'+y+'" r="7" fill="'+MEDC+'"/><circle cx="'+X(mn)+'" cy="'+y+'" r="7" fill="none" stroke="'+MEANC+'" stroke-width="3"/>';
      const am=mn>md?'start':'end',ad=mn>md?'end':'start',om=mn>md?10:-10;
      s+=lbl(X(mn)+om,y-13,'media '+fi(mn,1),MEANC,{a:am,s:13})+lbl(X(md)-om,y-13,'mediana '+fi(md,1),MEDC,{a:ad,s:13});
    });
    svgBox($('#b10mm'),720,284,s,'Media e mediana di tre variabili','44rem');
  })();
  /* skewness: three simulated densities */
  (function(){
    const t=el('div','trio');$('#b10shape').append(t);
    const mk=(f,title,label,note)=>{const N=240,xs=[],ys=[];for(let i=0;i<=N;i++){const x=i/N;xs.push(x);ys.push(f(x))}
      const tot=ys.reduce((a,b)=>a+b,0),mean=xs.reduce((a,x,i)=>a+x*ys[i],0)/tot;let acc=0,med=0;for(let i=0;i<=N;i++){acc+=ys[i];if(acc>=tot/2){med=xs[i];break}}
      const mx=Math.max(...ys),X=x=>16+x*228,Y=y=>140-y/mx*118;let d='M'+X(0)+' 140';xs.forEach((x,i)=>d+=' L'+X(x).toFixed(1)+' '+Y(ys[i]).toFixed(1));d+=' L'+X(1)+' 140Z';
      let s='<path d="'+d+'" fill="rgba(255,255,255,.12)" stroke="#ddd" stroke-width="2"/>'+line(16,140,244,140,'#666',1.2);
      s+=line(X(mean),20,X(mean),140,MEANC,2.2)+line(X(med),20,X(med),140,MEDC,2.2,' stroke-dasharray="5 4"');
      cell(t,title,s,260,150,label,note)};
    const gam=(x,a,b)=>x<=0?0:Math.pow(x,a-1)*Math.exp(-x/b);
    mk(x=>gam(1-x,2.2,.12),'Asimmetria negativa','Coda a sinistra','<span style="color:var(--yellow)">media</span> &lt; <span style="color:var(--pink)">mediana</span>');
    mk(x=>Math.exp(-((x-.5)**2)/(2*.12*.12)),'Simmetrica','Simmetrica','<span style="color:var(--yellow)">media</span> = <span style="color:var(--pink)">mediana</span>');
    mk(x=>gam(x,2.2,.12),'Asimmetria positiva','Coda a destra','<span style="color:var(--yellow)">media</span> &gt; <span style="color:var(--pink)">mediana</span>');
  })();
  /* row vs column percentages */
  (function(){
    const duo=el('div','duo');$('#b10pct').append(duo);
    const C=[['Mensile',2220,1655],['Un anno',1307,166],['Due anni',1647,48]];
    let a='';C.forEach(([n,no,yes],i)=>{const y=26+i*58,tot=no+yes,w=220,wy=yes/tot*w;
      a+=tx(10,y+18,n,{s:13,f:'#ddd',a:'start'})+rect(90,y,w-wy,28,CHN)+rect(90+w-wy,y,wy,28,CHY)+tx(90+w+8,y+19,fi(yes/tot*100,1)+'%',{s:13.5,f:CHY,a:'start',w:600})});
    a+=rect(90,200,12,12,CHN)+tx(108,211,'resta',{s:12.5,f:'#ddd',a:'start'})+rect(160,200,12,12,CHY)+tx(178,211,'se ne va',{s:12.5,f:'#ddd',a:'start'});
    cell(duo,'Per riga: il tasso di abbandono',a,360,220,'Percentuali per riga','Dentro ogni contratto, quanti <b>se ne vanno</b>.');
    let b='';const cs=['#e6e6e6','#9a9a9a','#555'];const grp=[['se ne va',[1655,166,48]],['resta',[2220,1307,1647]]];
    grp.forEach(([n,v],k)=>{const x=70+k*150,tot=v[0]+v[1]+v[2],H=170;let y=24;
      b+=tx(x+35,16,n,{s:13,f:k?CHN:CHY});
      v.forEach((c,j)=>{const h=c/tot*H;b+=rect(x,y,70,h,cs[j],'#000');if(h>16)b+=tx(x+35,y+h/2+5,fi(c/tot*100,1)+'%',{s:12.5,f:j<2?'#000':'#fff'});y+=h})});
    [['mensile',cs[0]],['un anno',cs[1]],['due anni',cs[2]]].forEach(([n,c],j)=>{b+=rect(14+j*104,204,12,12,c)+tx(32+j*104,215,n,{s:12.5,f:'#ddd',a:'start'})});
    cell(duo,'Per colonna: chi sono i clienti persi',b,360,220,'Percentuali per colonna','Fra chi se ne va, l\'88,6% era <b>mensile</b>.');
  })();
  /* observed vs expected */
  (function(){
    const duo=el('div','duo');$('#b10chi').append(duo);
    const draw=(rows,title,note,lab)=>{let s='';const H=170,M=1700,Y=v=>190-v/M*H,w=40,gap=rows.length===2?120:90,x0=rows.length===2?90:50;
      [0,500,1000,1500].forEach(v=>{s+=line(30,Y(v),330,Y(v),'#222',1)+tx(26,Y(v)+4,fi(v,0),{s:11.5,f:GRAY,a:'end'})});
      rows.forEach(([n,o,e],i)=>{const x=x0+i*gap;s+=rect(x,Y(o),w,190-Y(o),CHY)+rect(x+w+6,Y(e),w,190-Y(e),'none',TEAL,' stroke-dasharray="5 3" stroke-width="2"');
        s+=tx(x+w/2,Y(o)-5,fi(o,0),{s:11.5,f:CHY})+tx(x+w*1.5+6,Y(e)-5,fi(e,0),{s:11.5,f:TEAL})+tx(x+w+3,208,n,{s:12.5,f:'#ddd'})});
      s+=line(30,190,330,190,'#777',1.2);
      cell(duo,title,s,340,216,lab,note)};
    draw([['Donne',939,925.6],['Uomini',930,943.4]],'Genere: se ne vanno','χ² = 0,5: <b>quasi nessuna distanza</b> dall\'indipendenza.','Osservati e attesi per genere');
    draw([['Mensile',1655,1028.3],['Un anno',166,390.9],['Due anni',48,449.8]],'Contratto: se ne vanno','χ² = 1.184,6: <b>lontanissimi</b> dall\'indipendenza.','Osservati e attesi per contratto');
    const lg=el('div','cellnote');lg.innerHTML='<span style="color:var(--orange)">■</span> osservati &nbsp; <span style="color:var(--teal)">⬚</span> attesi con indipendenza';$('#b10chi').append(lg);
  })();
  /* Cramér's V */
  (function(){
    const V=[['Contract',41],['TechSupport',34],['InternetService',32],['PaymentMethod',30],['PaperlessBilling',19],['Partner',15],['gender',1]];let s='';const L=150,R=640,X=v=>L+v/50*(R-L);
    s+=rect(L,14,X(10)-L,V.length*38+4,'rgba(255,255,255,.03)')+rect(X(10),14,X(25)-X(10),V.length*38+4,'rgba(255,255,255,.06)')+rect(X(25),14,R-X(25),V.length*38+4,'rgba(255,255,255,.1)');
    [[5,'bassa'],[17.5,'media'],[37.5,'alta']].forEach(([v,t])=>s+=tx(X(v),V.length*38+36,'forza '+t,{s:12.5,f:GRAY}));
    V.forEach(([n,v],i)=>{const y=20+i*38;s+=tx(L-10,y+18,n,{s:13,f:'#ddd',a:'end'})+rect(L,y+4,Math.max(2,X(v)-L),22,v>25?'#fff':v>=10?'#aaa':'#666')+tx(X(v)+8,y+20,v+'%',{s:13.5,f:'#fff',a:'start',w:600})});
    [10,25].forEach(v=>s+=line(X(v),14,X(v),V.length*38+18,'#555',1,' stroke-dasharray="4 4"')+tx(X(v),V.length*38+52,v+'%',{s:12,f:GRAY}));
    svgBox($('#b10cram'),680,V.length*38+62,s,'V di Cramér con l\'abbandono','42rem');
  })();
  /* scatter tenure vs total charges */
  (function(){
    let s='';const L=70,R=690,T=16,B=300,X=v=>L+v/72*(R-L),Y=v=>B-v/9000*(B-T);
    const mx=st10.mean(TELSC.map(p=>p[0])),my=st10.mean(TELSC.map(p=>p[1]));
    s+=rect(X(mx),T,R-X(mx),Y(my)-T,'rgba(131,193,103,.10)')+rect(L,Y(my),X(mx)-L,B-Y(my),'rgba(131,193,103,.10)');
    [0,3000,6000,9000].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+4,fi(v,0),{s:12.5,f:GRAY,a:'end'})});
    for(let v=0;v<=72;v+=12)s+=tx(X(v),B+18,String(v),{s:12.5,f:GRAY});
    TELSC.forEach(([a,b])=>s+='<circle cx="'+X(a).toFixed(1)+'" cy="'+Y(b).toFixed(1)+'" r="3.2" fill="'+BLUE+'" fill-opacity=".75"/>');
    s+=line(X(mx),T,X(mx),B,'#ddd',1.3,' stroke-dasharray="6 4"')+line(L,Y(my),R,Y(my),'#ddd',1.3,' stroke-dasharray="6 4"');
    s+=lbl(X(mx)+6,T+14,'media permanenza',null,{a:'start',s:12.5})+lbl(R-4,Y(my)-8,'media spesa totale',null,{a:'end',s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'mesi di permanenza (tenure)',{s:13,f:GRAY})+tx(16,(T+B)/2,'spesa totale ($)',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(T+B)/2+')"'});
    s+=lbl(L+12,T+20,'r del campione = '+fi(st10.r(TELSC.map(p=>p[0]),TELSC.map(p=>p[1])),2),'#fff',{a:'start',s:13.5});
    svgBox($('#b10scat'),720,350,s,'Permanenza e spesa totale','44rem');
  })();
  /* simulated correlations */
  (function(){
    const t=el('div','trio');$('#b10corr').append(t);const r=lcg(1010);
    const mk=(gen,title,label)=>{const P=[];for(let i=0;i<60;i++)P.push(gen());const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);
      const mnx=Math.min(...xs),mxx=Math.max(...xs),mny=Math.min(...ys),mxy=Math.max(...ys),X=v=>20+(v-mnx)/(mxx-mnx)*210,Y=v=>136-(v-mny)/(mxy-mny)*116;
      let s=line(14,142,240,142,'#666',1.2)+line(14,142,14,12,'#666',1.2)+tx(236,156,'X',{s:12,f:GRAY,a:'end'})+tx(8,20,'Y',{s:12,f:GRAY});
      P.forEach(([a,b])=>s+='<circle cx="'+X(a).toFixed(1)+'" cy="'+Y(b).toFixed(1)+'" r="3.4" fill="'+BLUE+'"/>');
      cell(t,title,s,250,160,label,'r = '+fi(st10.r(xs,ys),2))};
    mk(()=>{const x=r()*10;return [x,x+gauss10(r)*1.3]},'Positiva forte','Correlazione positiva');
    mk(()=>{const x=r()*10;return [x,-x+gauss10(r)*3.2]},'Negativa','Correlazione negativa');
    mk(()=>{const x=r()*10-5;return [x,x*x+gauss10(r)*1.4]},'Forte ma non lineare','Relazione a parabola');
  })();
  /* box plot tenure by churn */
  (function(){
    let s='';const L=110,R=690,X=v=>L+v/72*(R-L);
    const G=[['Churn = No',[0,15,38,61,72],37.6,CHN,50],['Churn = Yes',[1,2,10,29,72],18.0,CHY,140]];
    for(let v=0;v<=72;v+=12){s+=line(X(v),20,X(v),180,'#222',1)+tx(X(v),198,String(v),{s:12.5,f:GRAY})}
    G.forEach(([n,q,m,c,y])=>{s+=tx(L-12,y+5,n,{s:13,f:c,a:'end'})+line(X(q[0]),y,X(q[1]),y,'#bbb',1.5)+line(X(q[3]),y,X(q[4]),y,'#bbb',1.5)+line(X(q[0]),y-10,X(q[0]),y+10,'#bbb',1.5)+line(X(q[4]),y-10,X(q[4]),y+10,'#bbb',1.5);
      s+=rect(X(q[1]),y-20,X(q[3])-X(q[1]),40,'rgba(255,255,255,.06)',c,' stroke-width="2"')+line(X(q[2]),y-20,X(q[2]),y+20,'#fff',3)+'<circle cx="'+X(m)+'" cy="'+y+'" r="5.5" fill="'+MEANC+'"/>';
      s+=tx(X(q[2]),y-27,'mediana '+q[2],{s:12.5,f:'#fff'})});
    s+=tx((L+R)/2,222,'mesi di permanenza (tenure)',{s:13,f:GRAY});
    svgBox($('#b10box'),720,232,s,'Box plot della permanenza per abbandono','44rem');
  })();
  /* ANOVA: between vs within */
  (function(){
    const duo=el('div','duo');$('#b10anova').append(duo);const mus=[30,55,80];
    const mk=(sd,seed,title,label)=>{const r=lcg(seed),P=mus.map(m=>{const a=[];for(let i=0;i<12;i++)a.push(m+gauss10(r)*sd);return a});
      const all=P.flat(),gm=st10.mean(all),n=all.length,c=3;let ssb=0,ssw=0;P.forEach(a=>{const m=st10.mean(a);ssb+=a.length*(m-gm)**2;a.forEach(v=>ssw+=(v-m)**2)});
      const F=(ssb/(c-1))/(ssw/(n-c)),Y=v=>176-v/110*160;let s=line(20,Y(0),330,Y(0),'#555',1);
      P.forEach((a,g)=>{const x=70+g*100,m=st10.mean(a);a.forEach((v,i)=>s+='<circle cx="'+(x-22+(i%6)*9)+'" cy="'+Y(Math.max(2,Math.min(108,v))).toFixed(1)+'" r="3.6" fill="#ddd"/>');s+=line(x-32,Y(m),x+32,Y(m),MEANC,3)+tx(x,194,'gruppo '+(g+1),{s:12.5,f:GRAY})});
      cell(duo,title,s,340,202,label,'F = '+fi(F,1))};
    mk(5,77,'Poca variabilità dentro i gruppi','Gruppi compatti');
    mk(26,77,'Molta variabilità dentro i gruppi','Gruppi dispersi');
  })();
};
QZ['10a']=()=>[{q:'Hai collegato un nodo Statistics all\'uscita di un CSV Reader, ma non l\'hai ancora configurato né eseguito. Che luce mostra il semaforo del nodo Statistics?',o:['Verde: il nodo è collegato','Gialla: pronto per l\'esecuzione','Rossa: in attesa di configurazione o di dati','Croce rossa: errore'],a:2,
  e:'Un nodo appena aggiunto aspetta la configurazione o i dati in ingresso: luce rossa. Diventa giallo dopo la configurazione (F6) e verde dopo l\'esecuzione (F7).',h:'Il collegamento non basta: che cosa manca ancora?'}];
QZ['10b']=()=>[{q:'Il livello di soddisfazione di un cliente, espresso con un voto da 1 a 5, è una variabile...',o:['nominale: le categorie non hanno ordine','ordinale: c\'è un ordine, ma la distanza fra 4 e 5 non è definita','di rapporti: 4 è il doppio di 2','continua: può assumere qualsiasi valore'],a:1,
  e:'I voti sono ordinati, ma dicono solo quale categoria viene prima, non di quanto: è una variabile ordinale. Le slide la citano proprio come esempio di ordinale.',h:'Si può dire che un voto è migliore di un altro? E di quanto?'}];
QZ['10c']=()=>[{q:'Due variabili hanno media 64,8 e 2.283 e deviazione standard 30,1 e 2.267. Quale è relativamente più variabile?',o:['La prima, perché il suo CV è più alto','La seconda, con CV di circa 99% contro 46%','Sono ugualmente variabili','Non si può dire senza conoscere le unità di misura'],a:1,
  e:'CV = s / media × 100: 30,1 / 64,8 = 46% e 2.267 / 2.283 = 99%. Il CV è un numero puro, quindi il confronto ha senso anche fra grandezze diverse.',h:'Dividi ogni deviazione standard per la sua media.'}];
QZ['10d']=()=>[{q:'Con α = 5% un test dà p-value = 0,08. Che cosa concludi?',o:['Si rifiuta H₀','Non si rifiuta H₀','H₀ è dimostrata vera','Si commette sicuramente un errore di primo tipo'],a:1,
  e:'0,08 non è minore di 0,05, quindi non si rifiuta H₀. Non rifiutare non vuol dire dimostrare che H₀ è vera: i dati non bastano a escluderla.',h:'Confronta il p-value con α.'}];
QZ['10e']=()=>[{q:'Un manager legge che «l\'88,6% dei clienti persi aveva un contratto mensile» e conclude che chi ha un contratto mensile se ne va quasi sempre. Che cosa non va?',o:['Niente, le due frasi dicono la stessa cosa','L\'88,6% è una percentuale per colonna (la composizione dei clienti persi); il tasso di abbandono dei mensili è la percentuale per riga, 42,7%','Il dato giusto sarebbe il 55%','Bisognerebbe usare la V di Cramér'],a:1,
  e:'La percentuale per colonna dice chi sono i clienti persi; quella per riga dice quanti se ne vanno dentro ogni contratto. Fra i mensili se ne va il 42,7%, non quasi tutti.',h:'Su quale totale è calcolato l\'88,6%?'}];
QZ['10f']=()=>[{q:'Misuri la spesa in centesimi invece che in dollari. Che cosa succede a covarianza e correlazione con la permanenza?',o:['Cambiano tutte e due','La covarianza diventa 100 volte più grande, la correlazione resta uguale','Restano uguali tutte e due','La correlazione diventa 100 volte più grande'],a:1,
  e:'La covarianza dipende dalle unità di misura; r la divide per il prodotto delle deviazioni standard, che cambiano dello stesso fattore, quindi resta uguale.',h:'Quale dei due indici è standardizzato?'}];
QZ['10g']=()=>[{q:'Tre gruppi hanno medie molto diverse, ma dentro ogni gruppo i valori sono dispersissimi. Che cosa ti aspetti dall\'ANOVA?',o:['F grande, perché le medie sono diverse','F piccolo, perché la variabilità dentro i gruppi è grande rispetto a quella fra i gruppi','F = 0','Non si può fare l\'ANOVA con tre gruppi'],a:1,
  e:'F = MSB / MSW: una variabilità dentro i gruppi (MSW) grande abbassa F, come nel secondo riquadro della figura.',h:'Che cosa c\'è al denominatore di F?'}];
QZ['10']=()=>[
  {q:'Per i 7.043 clienti la tabella genere per abbandono ha totali di riga 3.488 (donne) e 3.555 (uomini), e 1.869 clienti persi in tutto. Quante donne perse ti aspetteresti se genere e abbandono fossero indipendenti?',o:['939','circa 926','circa 943','934,5'],a:1,
   e:'E = totale di riga × totale di colonna / N = 3.488 × 1.869 / 7.043 ≈ 925,6. Le osservate sono 939: molto vicine, da cui il χ² piccolo.',h:'Usa la formula della frequenza attesa.'},
  {q:'Con χ² = 1.184,6, N = 7.043 e una tabella 3 × 2, quanto vale la V di Cramér e come si legge?',o:['0,17: forza media','0,41: forza alta','0,84: quasi perfetta','1.184,6: non si può normalizzare'],a:1,
   e:'k è il minore fra righe e colonne, 2, quindi k − 1 = 1: V = √(1.184,6 / 7.043) = √0,168 ≈ 0,41, sopra la soglia del 25%: forza alta.',h:'k − 1 vale 1 in una tabella con due colonne.'},
  {q:'Qual è l\'IQR della permanenza dei clienti persi, se il loro 25° percentile è 2 mesi e il 75° è 29?',o:['10 mesi','27 mesi','71 mesi','29 mesi'],a:1,
   e:'IQR = 75° percentile − 25° percentile = 29 − 2 = 27 mesi. 10 è la mediana, 71 il campo di variazione (72 − 1).',h:'IQR non usa né il minimo né il massimo.'},
  {q:'Vuoi sapere se la spesa mensile media è diversa fra i quattro metodi di pagamento. Quale strumento scegli?',o:['Tabella di contingenza e χ²','Correlazione lineare e test t','ANOVA a un fattore e test F','V di Cramér'],a:2,
   e:'Una variabile quantitativa (spesa mensile) e una qualitativa (metodo di pagamento): si confrontano le medie con l\'ANOVA.',h:'Di che tipo sono le due variabili?'},
  {q:'Un analista trova r = 0,02 fra la temperatura esterna e il consumo di energia di un edificio e conclude che non c\'è alcun legame. Che cosa gli diresti?',o:['Ha ragione: r vicino a zero vuol dire nessuna relazione','r misura solo il legame lineare: il consumo potrebbe salire sia col freddo sia col caldo, una relazione a U; va guardato il diagramma','Dovrebbe calcolare la covarianza, che è più affidabile','Deve usare il test χ²'],a:1,
   e:'Un legame forte ma non lineare, come una parabola, può dare r ≈ 0. Per questo le slide insistono: guarda sempre il diagramma di dispersione.',h:'Ricorda il terzo riquadro della figura sulle correlazioni.'},
  {q:'Su 7.043 clienti un test trova una differenza significativa (p &lt; 0,001) fra due gruppi, ma la differenza fra le medie è di pochi giorni di permanenza. Come la leggi?',o:['È una scoperta importante, perché il p-value è piccolissimo','Con campioni molto grandi quasi ogni differenza è significativa: conta anche quanto è grande, e qui è trascurabile','Il test è sbagliato','Bisogna aumentare α'],a:1,
   e:'Le slide lo dicono nelle ipotesi dell\'ANOVA: con campioni molto grandi quasi ogni differenza diventa significativa, quindi si guarda sempre anche l\'ampiezza della differenza.',h:'Il p-value dice se un effetto esiste, non quanto è grande.'}
];
MAPPA[10]={c:'Che cosa dicono i dati prima di qualsiasi modello?',r:[
  {t:'KNIME',c:BLUE,v:['Nodi collegati in un workflow','Quattro stati: rosso, giallo, verde, errore','Configura con F6, esegui con F7','Metanodi e componenti; file .knwf e .knar']},
  {t:'Tipi di variabile',c:PINK,v:['Qualitative: nominali, ordinali','Quantitative: discrete, continue','Scale a intervalli e di rapporti','Ogni livello eredita le statistiche di sopra']},
  {t:'Una variabile',c:YEL,v:['Frequenze e istogramma','Media, mediana, moda','Range, IQR, deviazione standard, CV','Asimmetria e curtosi']},
  {t:'Test d\'ipotesi',c:ORG,v:['H₀ contro H₁','Errori di primo e secondo tipo','p-value minore di α: si rifiuta H₀','Grandi campioni: guarda anche l\'ampiezza']},
  {t:'Due qualitative',c:GRN,v:['Tabella di contingenza','Percentuali nella direzione dell\'indipendente','χ²: osservati contro attesi','V di Cramér: contratto 41%']},
  {t:'Quantitative',c:TEAL,v:['Scatter plot, covarianza, r','r = 0 non vuol dire nessun legame','Confronto fra medie: box plot','ANOVA: F = MSB / MSW']}]};

/* Lezione 11: preparazione dei dati (Telco Customer Churn) e caso delle prenotazioni alberghiere (Hotel Booking Demand) */
const MISSC=PUR,OUTC=RED,CANC=ORG,p1=v=>v.toFixed(1).replace('.',',');
/* vertical bar chart helper: bars [[label,value,colour]], returns svg string */
function vbars11(bars,o){o=o||{};const W=o.W||340,H=o.H||200,top=o.top||24,bot=o.bot||34,L=o.L||16,R=W-(o.R||16),max=o.max||Math.max(...bars.map(b=>b[1])),bw=o.bw||Math.min(70,(R-L)/bars.length*.62);
  let s='';const Y=v=>H-bot-v/max*(H-bot-top),step=(R-L)/bars.length;
  bars.forEach(([l,v,c],i)=>{const x=L+step*i+(step-bw)/2;s+=rect(x,Y(v),bw,H-bot-Y(v),c||'#9a9a9a')+tx(x+bw/2,Y(v)-6,o.fmt?o.fmt(v):p1(v)+'%',{s:13,f:'#fff',w:600});
    String(l).split('|').forEach((t,k)=>s+=tx(x+bw/2,H-bot+17+k*15,t,{s:12.5,f:'#ccc'}))});
  return s+line(L,H-bot,R,H-bot,'#777',1.2)}
INIT[11]=function(){
  /* time spent */
  (function(){
    const T=[['Caricare i dati',19,1],['Ripulire i dati',26,1],['Scegliere il modello',11,0],['Addestrare e valutare il modello',12,0],['Mettere in produzione',11,0],['Altro',21,0]];let s='';const L=270,R=640,X=v=>L+v/30*(R-L);
    T.forEach(([n,v,h],i)=>{const y=14+i*36;s+=tx(L-12,y+19,n,{s:13.5,f:h?'#fff':'#bbb',a:'end'})+rect(L,y+4,X(v)-L,22,h?ORG:'#777')+tx(X(v)+8,y+21,v+'%',{s:13.5,f:'#fff',a:'start',w:600})});
    s+=lbl(R-4,250,'caricare + ripulire ≈ 45%',ORG,{a:'end',s:14,w:600});
    svgBox($('#b11time'),660,262,s,'Tempo dei data scientist per attività','42rem');
  })();
  /* cricket example */
  (function(){
    const duo=el('div','duo');$('#b11cricket').append(duo);
    cell(duo,'Genere mancante non trattato',vbars11([['Femmine|(2)',50,PINK],['Maschi|(4)',50,BLUE],['Mancante|(2)',100,MISSC]],{max:110,H:210}),340,210,'Prima del trattamento','Sembra: <b>nessuna differenza</b>.');
    cell(duo,'Genere recuperato',vbars11([['Femmine|(4)',75,PINK],['Maschi|(4)',50,BLUE]],{max:110,H:210}),340,210,'Dopo il trattamento','Le femmine giocano <b>di più</b>.');
  })();
  /* listwise vs pairwise deletion */
  (function(){
    const duo=el('div','duo');$('#b11del').append(duo);
    const R=[['M',25,343],['F',null,280],['M',33,332],['M',null,272],['F',25,null],['M',29,326],[null,26,259],['M',32,297]];
    const cols=[{t:'Gender',w:80,a:'m'},{t:'Manpower',w:100,a:'m'},{t:'Sales',w:90,a:'m'}];
    const cellv=v=>v===null?{v:'·',f:MISSC,b:true}:String(v);
    const inc=r=>r.some(v=>v===null);
    const t1=sTab(0,0,cols,R.map(r=>r.map(cellv)),{op:i=>inc(R[i])?.28:1,bg:i=>inc(R[i])?'rgba(252,98,85,.10)':null});
    tabCell(duo,'Listwise',t1,'<b>n = 4</b> per ogni analisi: metà delle righe perse.',300,[40,130,225].map(x=>tx(x,t1.h+22,'n = 4',{s:13,f:RED})).join(''),t1.h+32);
    const t2=sTab(0,0,cols,R.map(r=>r.map(cellv)));
    let ns='';[['n = 7',40],['n = 6',130],['n = 7',225]].forEach(([t,x])=>ns+=tx(x,t2.h+22,t,{s:13,f:GRN}));
    tabCell(duo,'Pairwise',t2,'Ogni variabile usa <b>tutte le righe</b> in cui è presente.',300,ns,t2.h+32);
  })();
  /* multivariate outliers */
  (function(){
    let s='';const r=lcg(1111),L=70,R=640,T=16,B=290,X=v=>L+(v-150)/45*(R-L),Y=v=>B-(v-45)/45*(B-T);const P=[];
    for(let i=0;i<70;i++){const h=158+r()*30,w=-45+0.65*h+gauss10(r)*3.2;P.push([h,w])}
    const O=[[183,56],[186,59],[160,79]];
    [150,160,170,180,190].forEach(v=>s+=line(X(v),T,X(v),B,'#1d1d1d',1)+tx(X(v),B+18,String(v),{s:12.5,f:GRAY}));[50,60,70,80,90].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    const hs=P.map(p=>p[0]).concat(O.map(o=>o[0])),ws=P.map(p=>p[1]).concat(O.map(o=>o[1]));
    s+=rect(X(Math.min(...hs)),B-10,X(Math.max(...hs))-X(Math.min(...hs)),6,'rgba(255,255,255,.25)')+rect(L+4,Y(Math.max(...ws)),6,Y(Math.min(...ws))-Y(Math.max(...ws)),'rgba(255,255,255,.25)');
    P.forEach(([h,w])=>s+='<circle cx="'+X(h).toFixed(1)+'" cy="'+Y(w).toFixed(1)+'" r="4" fill="#ddd"/>');
    O.forEach(([h,w])=>s+='<circle cx="'+X(h)+'" cy="'+Y(w)+'" r="6.5" fill="'+OUTC+'"/>');
    s+=lbl(X(160)+12,Y(79)+5,'troppo pesante',OUTC,{a:'start',s:13})+lbl(X(184.5),Y(56)+26,'troppo leggeri',OUTC,{s:13});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'altezza (cm)',{s:13,f:GRAY})+tx(18,(T+B)/2,'peso (kg)',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    s+=tx(R,T+12,'fasce chiare sugli assi: intervallo dei valori',{s:12,f:GRAY,a:'end'});
    svgBox($('#b11multi'),680,340,s,'Anomali multivariati in altezza e peso','42rem');
  })();
  /* box plot rule on churners' TotalCharges */
  (function(){
    const OUTS=[5638,5639,5643,5686,5688,5743,5743,5746,5763,5770,5770,5786,5795,5813,5885,5893,5916,5919,5921,5941,5961,6010,6015,6018,6040,6056,6110,6125,6128,6137,6143,6145,6146,6206,6215,6220,6253,6254,6281,6283,6287,6341,6383,6396,6405,6414,6419,6428,6440,6441,6448,6465,6529,6548,6579,6582,6585,6603,6615,6710,6786,6822,6852,6860,6872,6874,6876,6886,6890,6903,6938,6941,6975,6980,6981,6986,7008,7041,7102,7133,7156,7177,7220,7250,7262,7300,7318,7349,7373,7432,7447,7482,7492,7532,7535,7548,7612,7675,7690,7691,7724,7724,7752,7804,7856,7969,8110,8128,8685];
    const q1=134.5,md=703.6,q3=2331.3,fen=q3+1.5*(q3-q1),mn=18.85;let s='';const L=30,R=690,X=v=>L+v/9000*(R-L),y=110;
    [0,3000,6000,9000].forEach(v=>s+=line(X(v),30,X(v),180,'#1d1d1d',1)+tx(X(v),198,fi(v,0),{s:12.5,f:GRAY}));
    s+=line(X(mn),y,X(q1),y,'#bbb',1.5)+line(X(q3),y,X(5626),y,'#bbb',1.5)+line(X(5626),y-10,X(5626),y+10,'#bbb',1.5);
    s+=rect(X(q1),y-22,X(q3)-X(q1),44,'rgba(255,134,47,.12)',CANC,' stroke-width="2"')+line(X(md),y-22,X(md),y+22,'#fff',3);
    s+=line(X(fen),34,X(fen),170,YEL,2,' stroke-dasharray="6 4"')+lbl(X(fen)+6,48,'staccionata ≈ 5.630 $',YEL,{a:'start',s:13});
    const r=lcg(77);OUTS.forEach(v=>s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+(y+(r()-.5)*34).toFixed(1)+'" r="3" fill="'+OUTC+'" fill-opacity=".85"/>');
    s+=tx(X(q1),y+40,'Q₁',{s:13,f:'#ddd'})+tx(X(q3),y+40,'Q₃',{s:13,f:'#ddd'})+tx(X(md),y-30,'mediana 704',{s:12.5,f:'#fff'});
    s+=tx((X(q3)+X(fen))/2,y-30,'1,5 × IQR',{s:12.5,f:GRAY})+line(X(q3),y-26,X(fen),y-26,'#666',1)+lbl(X(7200),y+48,'109 anomali',OUTC,{s:13});
    s+=tx((L+R)/2,222,'spesa totale dei clienti persi ($)',{s:13,f:GRAY});
    svgBox($('#b11fence'),720,232,s,'Regola del box plot','44rem');
  })();
  /* impact on statistics */
  (function(){
    const S=[['Media',5.45,30],['Mediana',5,5.5],['Moda',5,5],['Dev. standard',1.04,85.03]];let s='';const B=200,T=26,Y=v=>B-v/90*(B-T);
    [0,30,60,90].forEach(v=>s+=line(40,Y(v),680,Y(v),'#1d1d1d',1)+tx(34,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));
    S.forEach(([n,a,b],i)=>{const x=80+i*155;s+=rect(x,Y(a),46,B-Y(a),'#9a9a9a')+rect(x+54,Y(b),46,B-Y(b),OUTC)+tx(x+23,Y(a)-6,fi(a,2),{s:12.5,f:'#ddd'})+tx(x+77,Y(b)-6,fi(b,2),{s:12.5,f:OUTC,w:600})+tx(x+50,B+20,n,{s:13,f:'#ddd'})});
    s+=line(40,B,680,B,'#777',1.2)+rect(470,6,12,12,'#9a9a9a')+tx(488,17,'senza 300',{s:12.5,f:'#ddd',a:'start'})+rect(570,6,12,12,OUTC)+tx(588,17,'con 300',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b11stat'),700,232,s,'Effetto di un valore anomalo sulle statistiche','42rem');
  })();
  /* impact on regression */
  (function(){
    const r=lcg(2011),P=[];for(let i=0;i<12;i++){const x=.5+i*.8;P.push([x,2*x+2+gauss10(r)*1.1])}const O=[11.5,4];
    const fit=pts=>{const mx=st10.mean(pts.map(p=>p[0])),my=st10.mean(pts.map(p=>p[1]));let a=0,b=0;pts.forEach(([x,y])=>{a+=(x-mx)*(y-my);b+=(x-mx)**2});const sl=a/b;return [sl,my-sl*mx]};
    const [s1,i1]=fit(P),[s2,i2]=fit(P.concat([O]));let s='';const L=50,R=650,T=14,B=270,X=v=>L+v/12*(R-L),Y=v=>B-v/28*(B-T);
    [0,7,14,21,28].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));[0,2,4,6,8,10,12].forEach(v=>s+=tx(X(v),B+18,String(v),{s:12,f:GRAY}));
    s+='<clipPath id="b11rc"><rect x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/></clipPath><g clip-path="url(#b11rc)">'+line(X(0),Y(i1),X(12),Y(i1+12*s1),'#9a9a9a',2.5)+line(X(0),Y(i2),X(12),Y(i2+12*s2),OUTC,2.5,' stroke-dasharray="7 4"')+'</g>';
    P.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="5" fill="#fff"/>');s+='<circle cx="'+X(O[0])+'" cy="'+Y(O[1])+'" r="7" fill="'+OUTC+'"/>';
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2);
    s+=lbl(L+14,T+18,'pendenza senza l\'anomalo: '+fi(s1,2),'#ddd',{a:'start',s:13.5})+lbl(L+14,T+40,'pendenza con l\'anomalo: '+fi(s2,2),OUTC,{a:'start',s:13.5});
    svgBox($('#b11reg'),680,296,s,'Effetto di un valore anomalo sulla regressione','42rem');
  })();
  /* transformations */
  (function(){
    const t=el('div','trio');$('#b11tr').append(t);
    const H=[['Spesa totale ($)',[2439,1175,692,476,413,381,366,314,295,229,174,89],'0','8.685','+0,96'],['√ spesa totale',[458,873,772,753,831,619,506,505,525,521,435,245],'0','93,2','+0,31'],['ln(spesa totale + 1)',[11,0,0,42,213,510,406,646,913,1382,1318,1602],'0','9,07','−0,82']];
    H.forEach(([n,c,lo,hi,sk])=>{const mx=Math.max(...c);let s='';c.forEach((v,i)=>s+=rect(12+i*19.5,130-v/mx*112,17,v/mx*112,'#aaa'));s+=line(10,130,246,130,'#777',1.2)+tx(12,146,lo,{s:12,f:GRAY,a:'start'})+tx(246,146,hi,{s:12,f:GRAY,a:'end'});
      cell(t,n,s,256,152,n,'asimmetria <b>'+sk+'</b>')});
  })();
  /* one-hot */
  (function(){
    const rows=[['Month-to-month',1,0,0],['One year',0,1,0],['Month-to-month',1,0,0],['Two year',0,0,1],['One year',0,1,0]];
    const c1=[{t:'Contract',w:150}],c2=[{t:'Contract_M2M',w:120,a:'m',c:BLUE},{t:'Contract_1Y',w:110,a:'m',c:BLUE},{t:'Contract_2Y',w:110,a:'m',c:BLUE}];
    const a=sTab(10,10,c1,rows.map(r=>[r[0]])),b=sTab(250,10,c2,rows.map(r=>r.slice(1).map(v=>({v:String(v),f:v?'#fff':'#666',b:!!v,bg:v?'rgba(88,196,221,.22)':null}))));
    const s=a.s+b.s+'<defs>'+arrowDef('b11oh','#aaa')+'</defs>'+line(172,90,236,90,'#aaa',2,' marker-end="url(#b11oh)"')+tx(204,80,'One to Many',{s:12,f:GRAY});
    svgBox($('#b11onehot'),600,a.h+24,s,'Codifica one-hot del contratto','38rem');
  })();
  /* churn by tenure group */
  (function(){
    svgBox($('#b11tg'),420,220,vbars11([['0-12',47.4,CANC],['13-24',28.7,CANC],['25-48',20.4,CANC],['49-72',9.5,CANC]],{W:420,H:220,max:55,bot:40})+tx(210,214,'classe di permanenza (mesi)',{s:12.5,f:GRAY}),'Tasso di abbandono per classe di permanenza','28rem');
  })();
  /* leakage crosstab */
  (function(){
    const cols=[{t:'reservation_status',w:180},{t:'is_canceled = 0',w:140,a:'e'},{t:'is_canceled = 1',w:140,a:'e'}];
    const z={v:'0',f:'#555'},rows=[['Check-Out',{v:'75.166',f:'#fff',b:true,bg:'rgba(88,196,221,.22)'},z],['Canceled',z,{v:'43.017',f:'#fff',b:true,bg:'rgba(255,134,47,.25)'}],['No-Show',z,{v:'1.207',f:'#fff',b:true,bg:'rgba(255,134,47,.25)'}]];
    const t=sTab(10,8,cols,rows,{rh:30,fs:14});
    svgBox($('#b11leak'),490,t.h+20,t.s,'Stato della prenotazione e target','32rem');
  })();
  /* missing as predictor */
  (function(){
    let s='';const G=[['Agenzia',39.0,24.7],['Società',38.2,17.5],['Paese',37.1,13.7]];const B=190,Y=v=>B-v/45*(B-24);
    G.forEach(([n,p,m],i)=>{const x=60+i*200;s+=rect(x,Y(p),56,B-Y(p),'#9a9a9a')+rect(x+64,Y(m),56,B-Y(m),CANC)+tx(x+28,Y(p)-6,p1(p)+'%',{s:13,f:'#ddd'})+tx(x+92,Y(m)-6,p1(m)+'%',{s:13,f:CANC,w:600})+tx(x+60,B+20,n,{s:13.5,f:'#ddd'})});
    s+=line(30,B,650,B,'#777',1.2)+rect(390,4,12,12,'#9a9a9a')+tx(408,15,'valore presente',{s:12.5,f:'#ddd',a:'start'})+rect(530,4,12,12,CANC)+tx(548,15,'valore mancante',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b11flag'),680,220,s,'Cancellazioni per presenza del valore','42rem');
  })();
  /* signal of new features */
  (function(){
    const duo=el('div','duo');$('#b11sig').append(duo);
    cell(duo,'Per gruppo di paese',vbars11([['Portogallo',56.7,CANC],['Europa',22.1,'#9a9a9a'],['Resto del|mondo',31.3,'#9a9a9a'],['Sconosciuto',11.9,'#9a9a9a']],{max:65,H:220,bot:44}),340,220,'Cancellazioni per gruppo di paese','Portogallo: <b>più della metà</b>.');
    cell(duo,'Per anticipo (giorni)',vbars11([['0-7',9.6,'#9a9a9a'],['8-30',27.9,'#9a9a9a'],['31-90',37.7,'#9a9a9a'],['91-180',44.7,'#9a9a9a'],['181+',57.0,CANC]],{max:65,H:220,bot:44}),340,220,'Cancellazioni per anticipo','Più lontana, <b>più a rischio</b>.');
  })();
};
QZ['11a']=()=>[{q:'In una tabella di studenti ci sono Student_ID, Gender, Prev_Exam_Marks, Height, Weight e Play Cricket (0 o 1), e si vuole prevedere chi gioca a cricket. Quale affermazione è corretta?',o:['Play Cricket è un predittore numerico continuo','Student_ID è un buon predittore perché è diverso per ogni studente','Play Cricket è il target ed è categorica, anche se salvata come numero','Gender è il target'],a:2,
  e:'Il target è ciò che si vuole prevedere, Play Cricket; i suoi valori 0 e 1 sono codici di due categorie. Student_ID è un identificativo, non un predittore.',h:'Conta il livello di misura, non il formato di memorizzazione.'}];
QZ['11b']=()=>[{q:'Nella tabella dei venditori, con la sostituzione per genere, quale valore riceve un uomo con Manpower mancante, se gli uomini con il valore presente hanno 25, 33, 29 e 32?',o:['28,33','29,75','25','30,5'],a:1,
  e:'(25 + 33 + 29 + 32) / 4 = 119 / 4 = 29,75. 28,33 è la media generale dei 6 valori presenti.',h:'Media solo degli uomini.'}];
QZ['11c']=()=>[{q:'Per una variabile Q₁ = 9 e Q₃ = 55. Oltre quale valore un dato è anomalo secondo la regola del box plot?',o:['55','64','124','101,5'],a:2,
  e:'IQR = 55 − 9 = 46; staccionata superiore = 55 + 1,5 × 46 = 55 + 69 = 124. Sono i quartili della permanenza Telco: con un massimo di 72 mesi, nessun cliente è anomalo.',h:'Prima calcola l\'IQR, poi aggiungi 1,5 volte l\'IQR a Q₃.'}];
QZ['11d']=()=>[{q:'Il metodo di pagamento ha quattro categorie senza ordine. Come lo codifichi per una regressione logistica?',o:['Con gli interi 1, 2, 3, 4','Con quattro colonne 0/1 (one-hot)','Con la normalizzazione min-max','Lo lasci come testo'],a:1,
  e:'Per una variabile nominale serve la codifica one-hot: con 1, 2, 3, 4 il modello leggerebbe un ordine e distanze che non esistono.',h:'La variabile è nominale o ordinale?'}];
QZ['11e']=()=>[{q:'Perché la regola dell\'IQR non funziona sui giorni in lista d\'attesa?',o:['Perché la variabile è categorica','Perché il 97% dei valori è zero: Q₁ = Q₃ = 0, IQR = 0, e ogni attesa verrebbe considerata anomala','Perché i valori sono negativi','Perché gli alberi non accettano valori grandi'],a:1,
  e:'Con IQR = 0 entrambe le staccionate stanno a zero: le 3.693 prenotazioni che hanno atteso verrebbero azzerate. Meglio un indicatore, che conserva il segnale (63,9% contro 36,2% di cancellazioni).',h:'Quanto valgono Q₁ e Q₃ se quasi tutti i valori sono uguali?'}];
QZ['11']=()=>[
  {q:'Un\'azienda ha un questionario in cui chi ha un reddito basso tende a non rispondere alla domanda sul reddito. Come si classifica il meccanismo e che cosa conviene fare?',o:['MCAR: cancellare le righe','MAR: imputare la media','MNAR: la mancanza dipende dal valore stesso; aggiungere un indicatore o una categoria «non dichiarato»','Strutturale: mettere zero'],a:2,
   e:'La probabilità di mancare dipende dal valore mancante: è MNAR. Cancellare o imputare la media distorcerebbe il quadro; un indicatore conserva l\'informazione.',h:'Da che cosa dipende la probabilità che il reddito manchi?'},
  {q:'Undici valori fra 4 e 7 hanno media 5,45. Si aggiunge un dodicesimo valore, 300. Quanto diventa la media?',o:['5,50','30,00','85,03','27,72'],a:1,
   e:'La somma degli undici valori è 5,45 × 11 = 60; con 300 diventa 360, divisa per 12 dà 30. La mediana invece passa solo da 5 a 5,5.',h:'Ricava la somma dalla media, aggiungi 300, dividi per 12.'},
  {q:'Quale di queste colonne del dataset alberghiero è leakage per prevedere la cancellazione al momento della prenotazione?',o:['lead_time, i giorni fra prenotazione e arrivo','deposit_type, il tipo di caparra','assigned_room_type, la camera assegnata all\'arrivo','total_of_special_requests'],a:2,
   e:'La camera assegnata si decide all\'arrivo, quindi non si conosce quando si prenota; e chi cancella non arriva mai. Le altre tre sono note al momento della prenotazione.',h:'Per ogni colonna: la conoscerei quando serve la previsione?'},
  {q:'La colonna company manca nel 94% delle prenotazioni e chi ha una società cancella nel 17,5% dei casi contro il 38,2%. Che cosa fa il workflow?',o:['Cancella le righe senza società','Imputa la società più frequente','Crea l\'indicatore has_company e toglie il codice','Toglie la colonna e non ne tiene traccia'],a:2,
   e:'È un mancante strutturale (non è una prenotazione aziendale) e la sua presenza predice: l\'indicatore conserva il segnale, il codice con troppi valori si toglie.',h:'La mancanza qui è un\'informazione?'},
  {q:'Un modello di k-NN e una random forest vengono addestrati su dati con alcuni valori estremi ma veri. Per quale dei due conviene di più limitare gli estremi?',o:['Per la random forest, perché crea alberi profondi','Per il k-NN, perché un valore estremo altera le distanze e il vicinato','Per nessuno dei due','Per tutti e due allo stesso modo'],a:1,
   e:'I modelli basati sulle distanze soffrono molto gli anomali; gli alberi tagliano su soglie e guardano solo l\'ordine dei valori, quindi ne risentono poco.',h:'Ricorda la tabella dei modelli di machine learning.'},
  {q:'Per bilanciare i clienti persi uno studente applica SMOTE a tutto il dataset e poi divide in addestramento e test. Che cosa non va?',o:['Niente, SMOTE va sempre applicato prima','I casi sintetici finiscono anche nel test: la valutazione non è più fatta su dati veri','SMOTE funziona solo con le immagini','Bisognava usare la normalizzazione'],a:1,
   e:'La regola delle slide: si aumenta solo l\'insieme di addestramento, mai quello di test, e si valida sempre su dati veri al 100%.',h:'Su quali dati deve avvenire la valutazione?'}
];
MAPPA[11]={c:'Come si preparano i dati per un modello?',r:[
  {t:'I passi',c:BLUE,v:['Ruoli, livelli, uni e bivariata (lezione 10)','Mancanti, anomali, feature','Fino all\'80% del tempo di un progetto']},
  {t:'Valori mancanti',c:PUR,v:['Perché manca? MCAR, MAR, MNAR, strutturale','Cancellare: listwise o pairwise','Imputare: media, mediana, moda, modello','Telco: 11 clienti nuovi, spesa = 0']},
  {t:'Valori anomali',c:RED,v:['Univariati e multivariati','Box plot: oltre 1,5 IQR dai quartili','Spostano media e dev. standard, non la mediana','Errore o valore naturale?']},
  {t:'Trattamenti',c:ORG,v:['Cancellare, sostituire, limitare','Trasformare: radice, logaritmo','Gli alberi ne risentono poco']},
  {t:'Feature engineering',c:GRN,v:['One-hot e codifica ordinale','Min-max e z-score','Interazioni, classi, polinomi','GenAI propone, l\'uomo verifica; SMOTE solo sul training']},
  {t:'Caso alberghi',c:YEL,v:['119.390 prenotazioni, 37% cancellate','Leakage: reservation_status','Mancanti travestiti: NA, NULL, Undefined','Indicatori, gruppi, 187 righe errate tolte']}]};

/* Lezione 12: valutazione dei modelli predittivi (soggiorni alberghieri, target ricavo e high_value) */
const TRC='#9a9a9a',TSC=PINK,DTC='#9a9a9a',RFC=GRN;
/* 2x2 confusion matrix: m={tp,fn,fp,tn}, labels [pos,neg] */
function cm12(x,y,m,lab,o){o=o||{};const w=o.w||120,h=o.h||64;let s='';
  s+=tx(x+w,y-28,'classe prevista',{s:12.5,f:GRAY})+tx(x+w/2,y-8,lab[0],{s:13,f:'#ddd'})+tx(x+w*1.5,y-8,lab[1],{s:13,f:'#ddd'});
  s+=tx(x-12,y+h/2+5,lab[0],{s:13,f:'#ddd',a:'end'})+tx(x-12,y+h*1.5+5,lab[1],{s:13,f:'#ddd',a:'end'});
  if(!o.noside)s+=tx(x-70-(o.sx||0),y+h,'classe vera',{s:12.5,f:GRAY,x:' transform="rotate(-90 '+(x-70-(o.sx||0))+' '+(y+h)+')"'});
  const C=[['tp',0,0,OKBG,'TP'],['fn',1,0,BADBG,'FN'],['fp',0,1,BADBG,'FP'],['tn',1,1,OKBG,'TN']];
  C.forEach(([k,cx,cy,bg,n])=>{const X=x+cx*w,Y=y+cy*h;s+=rect(X,Y,w,h,bg,'#000')+tx(X+w/2,Y+h/2+(o.tag===false?6:0),fi(m[k],0),{s:o.fs||18,f:'#fff',w:600});
    if(o.tag!==false)s+=tx(X+w/2,Y+h/2+20,n,{s:12,f:GRAY})});
  return s}
INIT[12]=function(){
  /* training vs test error */
  (function(){
    let s='';const L=60,R=660,T=16,B=250,X=c=>L+(c-1)/9*(R-L),Y=e=>B-e/35*(B-T);
    const tr=c=>28*Math.exp(-.33*(c-1))+1.5,te=c=>tr(c)+0.55*(c-1)**1.55+2;
    [0,10,20,30].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    for(let c=1;c<=10;c++)s+=tx(X(c),B+18,String(c),{s:12.5,f:GRAY});
    const path=f=>{let d='';for(let c=1;c<=10.001;c+=.1)d+=(d?'L':'M')+X(c).toFixed(1)+' '+Y(f(c)).toFixed(1);return d};
    s+='<path d="'+path(tr)+'" fill="none" stroke="'+TRC+'" stroke-width="3"/><path d="'+path(te)+'" fill="none" stroke="'+TSC+'" stroke-width="3"/>';
    let best=1,bv=1e9;for(let c=1;c<=10;c+=.01){if(te(c)<bv){bv=te(c);best=c}}
    s+=line(X(best),T,X(best),B,'#666',1.2,' stroke-dasharray="5 4"')+lbl(X(best),T+12,'complessità migliore',null,{s:13});
    s+=lbl(X(9.6),Y(tr(9.6))-10,'errore sul training',TRC,{a:'end',s:13})+lbl(X(9.6),Y(te(9.6))-10,'errore sul test',TSC,{a:'end',s:13});
    s+=lbl(X(2.1),Y(te(2.1))-14,'il modello impara poco',GRAY,{a:'start',s:12.5})+lbl(X(7.2),Y(te(7.2))+28,'impara il rumore',GRAY,{s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'complessità del modello (per esempio profondità dell\'albero)',{s:13,f:GRAY})+tx(18,(T+B)/2,'errore',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b12over'),680,300,s,'Errore di training e di test','42rem');
  })();
  /* splits */
  (function(){
    const duo=el('div','duo');$('#b12split').append(duo);
    let a='';const P=[['Training',60,'#9a9a9a','costruisce il modello'],['Validazione',20,TEAL,'regola e sceglie'],['Test',20,TSC,'stima l\'errore sui dati nuovi']];let x=10;
    P.forEach(([n,v,c,d],k)=>{const w=v/100*320;a+=rect(x,24,w,46,c,'#000')+tx(x+w/2,52,v+'%',{s:15,f:'#000',w:600})+rect(14,92+k*22,12,12,c)+tx(34,103+k*22,n+': '+d,{s:12.5,f:'#ddd',a:'start'});x+=w});
    cell(duo,'Holdout: 60/20/20',a,340,156,'Divisione in training, validazione e test','Il test si usa <b>una volta sola</b>, alla fine.');
    let b='';for(let r=0;r<5;r++){for(let k=0;k<5;k++){b+=rect(30+k*56,14+r*24,54,20,k===r?TSC:'#555','#000')}b+=tx(20,29+r*24,String(r+1),{s:12,f:GRAY,a:'end'})}
    b+=tx(170,148,'parti dei dati',{s:12,f:GRAY});
    cell(duo,'Validazione incrociata, k = 5',b,340,154,'Validazione incrociata a 5 parti','Ogni parte fa da test <b>una volta</b>.');
  })();
  /* confusion matrix RF */
  (function(){
    svgBox($('#b12cm'),440,210,cm12(150,50,{tp:3792,fn:702,fp:396,tn:17127},['High','Standard'],{w:130,h:70}),'Matrice di confusione della random forest','30rem');
  })();
  /* lazy models */
  (function(){
    const duo=el('div','duo');$('#b12lazy').append(duo);
    cell(duo,'Frodi: sempre «legittima»',cm12(130,46,{tp:0,fn:1,fp:0,tn:99},['Frode','Legit'],{w:95,h:56,fs:17,sx:-14}),340,170,'Modello pigro sulle frodi','Accuratezza <b>99%</b>, frodi trovate <b>0%</b>.');
    cell(duo,'Soggiorni: sempre «Standard»',cm12(130,46,{tp:0,fn:4494,fp:0,tn:17523},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Modello pigro sui soggiorni','Accuratezza <b>79,6%</b>, soggiorni High trovati <b>0</b>.');
  })();
  /* DT vs RF indices */
  (function(){
    const I=[['Accuratezza',.928,.950],['Sensibilità',.810,.844],['Specificità',.958,.977],['Precisione',.832,.905],['F1',.821,.874],['Acc. bilanciata',.884,.911],['κ di Cohen',.776,.843],['MCC',.776,.843]];
    let s='';const L=150,R=600,X=v=>L+(v-.7)/.3*(R-L);
    [.7,.8,.9,1].forEach(v=>s+=line(X(v),10,X(v),I.length*40+14,'#1d1d1d',1)+tx(X(v),I.length*40+30,fi(v,1),{s:12,f:GRAY}));
    I.forEach(([n,a,b],i)=>{const y=14+i*40;s+=tx(L-12,y+18,n,{s:13,f:'#ddd',a:'end'})+rect(L,y,X(a)-L,14,DTC)+rect(L,y+16,X(b)-L,14,RFC)+tx(X(a)+6,y+12,fi(a,3),{s:11.5,f:'#ccc',a:'start'})+tx(X(b)+6,y+28,fi(b,3),{s:11.5,f:RFC,a:'start',w:600})});
    s+=rect(L,I.length*40+42,12,12,DTC)+tx(L+18,I.length*40+53,'albero di decisione',{s:12.5,f:'#ddd',a:'start'})+rect(L+180,I.length*40+42,12,12,RFC)+tx(L+198,I.length*40+53,'random forest',{s:12.5,f:'#ddd',a:'start'});
    s+=tx(R,I.length*40+30,'(l\'asse parte da 0,7)',{s:11.5,f:GRAY,a:'end'});
    svgBox($('#b12cmp'),660,I.length*40+64,s,'Albero e foresta sugli stessi indici','42rem');
  })();
  /* cut-off */
  (function(){
    const duo=el('div','duo');$('#b12cut').append(duo);
    const note=(r,p,a)=>'sensibilità <b>'+r+'</b> · precisione <b>'+p+'</b> · accuratezza '+a;
    cell(duo,'Soglia 0,5',cm12(130,46,{tp:3792,fn:702,fp:396,tn:17127},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Soglia 0,5',note('0,844','0,905','0,950'));
    cell(duo,'Soglia 0,2',cm12(130,46,{tp:4327,fn:167,fp:1305,tn:16218},['High','Std'],{w:95,h:56,fs:17,sx:-14}),340,170,'Soglia 0,2',note('0,963','0,768','0,933'));
  })();
  /* ROC illustrative */
  (function(){
    let s='';const L=70,S=300,T=16,X=v=>L+v*S,Y=v=>T+S-v*S;
    [0,.2,.4,.6,.8,1].forEach(v=>{s+=line(X(v),T,X(v),T+S,'#1d1d1d',1)+line(L,Y(v),L+S,Y(v),'#1d1d1d',1)+tx(X(v),T+S+18,fi(v,1),{s:12,f:GRAY})+tx(L-8,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'})});
    const roc=a=>{let d='',pts=[];for(let i=0;i<=10;i++){const x=i/10,y=1-Math.pow(1-x,a);pts.push([x,y]);d+=(d?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1)}return [d,pts]};
    const [d1,p1]=roc(4.5),[d2,p2]=roc(2);
    s+=line(X(0),Y(0),X(1),Y(1),'#777',1.5,' stroke-dasharray="6 5"')+'<path d="'+d2+'" fill="none" stroke="'+DTC+'" stroke-width="2.5"/><path d="'+d1+'" fill="none" stroke="'+RFC+'" stroke-width="3"/>';
    p1.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="3.5" fill="'+RFC+'"/>');p2.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="3" fill="'+DTC+'"/>');
    s+='<circle cx="'+X(0)+'" cy="'+Y(1)+'" r="6" fill="none" stroke="'+YEL+'" stroke-width="2"/>'+lbl(X(0)+12,Y(1)+5,'(0, 1) perfetto',YEL,{a:'start',s:13});
    s+=lbl(X(0)+10,Y(0)-8,'(0, 0) soglia 1',null,{a:'start',s:12.5})+lbl(X(1)+8,Y(1)+5,'(1, 1) soglia 0',null,{a:'start',s:12.5});
    s+=lbl(X(.62),Y(.5),'casuale',GRAY,{s:12.5});
    s+=line(L,T+S,L+S,T+S,'#777',1.2)+line(L,T,L,T+S,'#777',1.2)+tx(L+S/2,T+S+40,'tasso di falsi positivi (1 − specificità)',{s:13,f:GRAY})+tx(20,T+S/2,'sensibilità',{s:13,f:GRAY,x:' transform="rotate(-90 20 '+(T+S/2)+')"'});
    s+=rect(410,60,14,14,RFC)+tx(432,72,'modello 1',{s:13,f:'#ddd',a:'start'})+rect(410,88,14,14,DTC)+tx(432,100,'modello 2',{s:13,f:'#ddd',a:'start'})+line(410,124,424,124,'#777',1.5,' stroke-dasharray="4 3"')+tx(432,128,'casuale',{s:13,f:'#ddd',a:'start'})+tx(410,160,'ogni punto = una soglia',{s:12.5,f:GRAY,a:'start'});
    svgBox($('#b12roc'),580,370,s,'Curva ROC illustrativa','36rem');
  })();
  /* cumulative gain */
  (function(){
    const G=[0,47.9,87.2,98.4,99.6,99.8,99.9,99.9,100,100,100];let s='';const L=60,R=640,T=34,B=300,X=v=>L+v/100*(R-L),Y=v=>B-v/100*(B-T);
    [0,20,40,60,80,100].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,v+'%',{s:12,f:GRAY,a:'end'})});for(let v=0;v<=100;v+=10)s+=tx(X(v),B+18,v+'%',{s:12,f:GRAY});
    s+=line(X(0),Y(0),X(100),Y(100),'#777',1.5,' stroke-dasharray="6 5"')+'<polyline points="'+X(0)+','+Y(0)+' '+X(20.4)+','+Y(100)+' '+X(100)+','+Y(100)+'" fill="none" stroke="'+RFC+'" stroke-width="1.8" stroke-dasharray="3 4"/>';
    s+='<polyline points="'+G.map((g,i)=>X(i*10)+','+Y(g)).join(' ')+'" fill="none" stroke="#fff" stroke-width="3"/>';
    G.forEach((g,i)=>s+='<circle cx="'+X(i*10)+'" cy="'+Y(g)+'" r="4" fill="#fff"/>');
    s+=lbl(X(10)+8,Y(47.9)+16,'10% → 47,9%',null,{a:'start',s:13})+lbl(X(20)+8,Y(87.2)+18,'20% → 87,2%',null,{a:'start',s:13})+lbl(X(30)+6,Y(98.4)+22,'30% → 98,4%',null,{a:'start',s:13});
    s+=lbl(X(60),Y(55),'selezione casuale',GRAY,{s:12.5})+lbl(X(20.4)+6,Y(100)-8,'modello perfetto: 20,4%',RFC,{a:'start',s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+40,'quota di soggiorni contattati, in ordine di P(High)',{s:13,f:GRAY})+tx(14,(T+B)/2,'quota dei soggiorni High raccolti',{s:13,f:GRAY,x:' transform="rotate(-90 14 '+(T+B)/2+')"'});
    svgBox($('#b12gain'),680,354,s,'Gain cumulato della random forest','42rem');
  })();
  /* errors in regression (illustrative) */
  (function(){
    const r=lcg(1212),P=[];for(let i=0;i<22;i++){const p=80+r()*780,a=Math.max(40,Math.min(960,p+gauss10(r)*(40+p*.14)));P.push([p,a])}
    let s='';const L=70,S=300,T=16,X=v=>L+v/1000*S,Y=v=>T+S-v/1000*S;
    [0,200,400,600,800,1000].forEach(v=>{s+=line(X(v),T,X(v),T+S,'#1d1d1d',1)+line(L,Y(v),L+S,Y(v),'#1d1d1d',1)+tx(X(v),T+S+18,String(v),{s:12,f:GRAY})+tx(L-8,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'})});
    s+=line(X(0),Y(0),X(1000),Y(1000),'#888',1.5,' stroke-dasharray="6 5"');
    P.forEach(([p,a])=>s+=line(X(p),Y(p),X(p),Y(a),RED,1.6)+'<circle cx="'+X(p).toFixed(1)+'" cy="'+Y(a).toFixed(1)+'" r="4.5" fill="#fff"/>');
    s+=line(L,T+S,L+S,T+S,'#777',1.2)+line(L,T,L,T+S,'#777',1.2)+tx(L+S/2,T+S+40,'ricavo previsto ŷ (€)',{s:13,f:GRAY})+tx(20,T+S/2,'ricavo vero y (€)',{s:13,f:GRAY,x:' transform="rotate(-90 20 '+(T+S/2)+')"'});
    s+=line(410,70,424,70,RED,2)+tx(432,74,'errore e = y − ŷ',{s:13,f:'#ddd',a:'start'})+line(410,98,424,98,'#888',1.5,' stroke-dasharray="4 3"')+tx(432,102,'previsione perfetta',{s:13,f:'#ddd',a:'start'});
    svgBox($('#b12err'),580,370,s,'Errori di previsione','36rem');
  })();
  /* regression comparison */
  (function(){
    let s='';const B=230,T=24,Y=v=>B-v/320*(B-T);
    [0,100,200,300].forEach(v=>s+=line(50,Y(v),640,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));
    [['MAE',191.0,61.8],['RMSE',288.6,108.1]].forEach(([n,a,b],i)=>{const x=120+i*270;s+=rect(x,Y(a),70,B-Y(a),DTC)+rect(x+80,Y(b),70,B-Y(b),RFC)+tx(x+35,Y(a)+18,fi(a,1),{s:13,f:'#000',w:600})+tx(x+115,Y(b)+18,fi(b,1),{s:13,f:'#000',w:600})+tx(x+75,B+20,n,{s:13.5,f:'#ddd'})});
    s+=line(50,Y(214.1),640,Y(214.1),YEL,1.6,' stroke-dasharray="6 4"')+lbl(636,Y(214.1)-7,'MAE ingenuo 214,1',YEL,{a:'end',s:12.5});
    s+=line(50,B,640,B,'#777',1.2)+rect(370,2,12,12,DTC)+tx(388,13,'albero di regressione',{s:12.5,f:'#ddd',a:'start'})+rect(530,2,12,12,RFC)+tx(548,13,'random forest',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b12regc'),660,256,s,'Errori in euro dei due modelli','42rem');
  })();
};
QZ['12a']=()=>[{q:'Un analista prova dieci profondità diverse di un albero, sceglie quella con l\'errore più basso sull\'insieme di test e riporta quell\'errore come stima delle prestazioni in produzione. Che cosa non va?',o:['Niente, il test serve proprio a questo','Ha usato il test per scegliere il modello: la stima è ottimista; la scelta andava fatta sulla validazione, e il test usato una volta sola alla fine','Doveva usare più profondità','Doveva usare l\'errore sul training'],a:1,
  e:'La validazione serve a regolare i parametri e scegliere il modello; il test stima l\'errore su dati nuovi e si usa una volta sola. Scegliendo sul test, il test non è più indipendente.',h:'Ricorda i compiti dei tre insiemi.'}];
QZ['12b']=()=>[{q:'Una banca usa un modello per bloccare le transazioni sospette; ogni frode non bloccata costa migliaia di euro, ogni blocco sbagliato solo una telefonata al cliente. Quale indice deve essere alto prima di tutto?',o:['La precisione','La sensibilità (recall)','La specificità','L\'accuratezza'],a:1,
  e:'Qui costa caro il caso mancato (falso negativo): serve una sensibilità alta, anche al prezzo di qualche falso allarme in più.',h:'Quale errore costa di più: il falso allarme o il caso mancato?'}];
QZ['12c']=()=>[{q:'Un modello ha AUC = 0,52. Come lo leggi?',o:['Eccellente','Accettabile','Praticamente casuale: non distingue le classi','Dipende dalla soglia'],a:2,
  e:'0,5 è un modello casuale; 0,52 ci è appena sopra. L\'AUC non dipende dalla soglia.',h:'Ricorda la scala delle slide.'}];
QZ['12d']=()=>[{q:'Due modelli hanno lo stesso MAE di 60 euro; il primo ha RMSE 62, il secondo RMSE 150. Che cosa ne deduci?',o:['Sono equivalenti','Il secondo fa alcuni errori molto grandi; il primo sbaglia di quantità simili ovunque','Il primo ha errori più grandi','L\'RMSE non si può confrontare con il MAE'],a:1,
  e:'RMSE ≥ MAE sempre, uguali solo se gli errori hanno tutti la stessa dimensione. Un divario grande indica alcuni errori molto grandi, che il quadrato fa pesare.',h:'Che cosa fa il quadrato agli errori grandi?'}];
QZ['12e']=()=>[{q:'Un\'azienda può chiamare solo 2.000 clienti su 20.000 e vuole sapere quanti potenziali abbandoni raggiungerà chiamando i primi in classifica. Quale strumento risponde?',o:['La matrice di confusione con soglia 0,5','Il gain cumulato al primo decile','L\'R²','Il MAPE'],a:1,
  e:'2.000 su 20.000 è il 10%: il gain cumulato al primo decile dice quale quota di tutti i positivi si raccoglie contattando il 10% in cima.',h:'Si agisce solo su una parte della classifica.'}];
QZ['12']=()=>[
  {q:'Con la soglia 0,2 la random forest ha TP = 4.327 e FN = 167. Qual è la sensibilità?',o:['0,844','0,963','0,768','0,933'],a:1,
   e:'4.327 / (4.327 + 167) = 4.327 / 4.494 ≈ 0,963. 0,768 è la precisione, 0,933 l\'accuratezza.',h:'Sensibilità = TP / (TP + FN).'},
  {q:'Con TP = 3.792 e FP = 396, quanto vale la precisione?',o:['0,844','0,977','0,905','0,950'],a:2,
   e:'3.792 / (3.792 + 396) = 3.792 / 4.188 ≈ 0,905.',h:'Delle righe previste High, quante lo sono davvero?'},
  {q:'Il modello che prevede sempre «Standard» ha accuratezza 0,796. Quanto valgono la sua accuratezza bilanciata e la sua kappa?',o:['0,796 e 0,796','0,5 e 0','1 e 1','0 e −1'],a:1,
   e:'Sensibilità 0, specificità 1: media 0,5. Kappa 0: l\'accordo è esattamente quello atteso per caso. Per questo questi indici reggono le classi sbilanciate.',h:'Calcola sensibilità e specificità del modello pigro.'},
  {q:'Il primo decile di un modello contiene il 60% di positivi, mentre in tutto il test i positivi sono il 15%. Qual è il lift del primo decile?',o:['0,25','4','45','60'],a:1,
   e:'Lift = 60% / 15% = 4: il modello concentra i positivi quattro volte meglio di una scelta a caso.',h:'Dividi la quota nel decile per la quota complessiva.'},
  {q:'Un modello di regressione ha R² = −0,15 sull\'insieme di test. Che cosa significa?',o:['Un errore di calcolo: l\'R² non può essere negativo','Il modello fa peggio che prevedere sempre la media','Il modello spiega il 15% della varianza','Il modello è sovradattato ai dati di test'],a:1,
   e:'Sul test l\'R² può essere negativo: la somma degli errori al quadrato del modello supera quella di chi prevede sempre la media.',h:'Che cosa vuol dire R² = 0?'},
  {q:'Si vuole confrontare l\'errore di previsione delle vendite giornaliere di due negozi, ma in molti giorni le vendite di uno sono zero. Quale indice evitare?',o:['MAE','MASE','MAPE','RMSE'],a:2,
   e:'Il MAPE divide per il valore vero: con valori a zero esplode (divisione per zero). Il MASE non ha scala e non divide per i valori veri.',h:'Quale indice ha y al denominatore?'}
];
MAPPA[12]={c:'Come si misura se un modello prevede bene?',r:[
  {t:'Dati mai visti',c:BLUE,v:['Training, validazione, test','Holdout, validazione incrociata','Campionamento stratificato','Sovradattamento: il test lo rivela']},
  {t:'Matrice di confusione',c:GRN,v:['TP, FN, FP, TN','Accuratezza: inganna con classi rare','Sensibilità, specificità','Precisione, F1']},
  {t:'Classi sbilanciate',c:TEAL,v:['Accuratezza bilanciata','κ di Cohen','MCC']},
  {t:'Soglia e classifica',c:PINK,v:['La soglia è una scelta di business','ROC: tutte le soglie','AUC: 0,5 casuale, 1 perfetto','Gain e lift: il primo k%']},
  {t:'Errori in numeri',c:YEL,v:['MAE, MSE, RMSE','MPE: distorsione','MAPE: niente zeri','R², R² corretto, MASE']},
  {t:'Caso alberghi',c:ORG,v:['Foresta: accuratezza 0,950, AUC 0,987','Primo decile: lift 4,79','Ricavo: R² 0,877, MASE 0,29']}]};

/* Lezione 13: alberi di decisione, random forest, gradient boosting (soggiorni, target high_value) */
const HIC=GRN,CHU=ORG,STY=BLUE,BOOC=PINK;
/* a tree node box: x,y centre; title; share bar */
function node13(x,y,w,t1,t2,share,o){o=o||{};let s=rect(x-w/2,y-28,w,56,'#111',o.leaf?'#888':'#ddd',' rx="6"'+(o.leaf?' stroke-dasharray="4 3"':''));
  s+=tx(x,y-10,t1,{s:12.5,f:o.leaf?GRAY:'#ddd'})+tx(x,y+7,t2,{s:13,f:'#fff',w:600});
  if(share!==undefined)s+=rect(x-w/2+10,y+14,w-20,7,'#333')+rect(x-w/2+10,y+14,(w-20)*share,7,HIC);return s}
INIT[13]=function(){
  /* anatomy */
  (function(){
    let s='';const E=(x1,y1,x2,y2,t,a)=>line(x1,y1,x2,y2,'#777',1.5)+lbl((x1+x2)/2+(a||0),(y1+y2)/2+4,t,'#ccc',{s:12.5});
    s+=E(360,62,180,150,'notti ≤ 4,5',-40)+E(360,62,540,150,'notti &gt; 4,5',40)+E(180,206,90,292,'≤ 3,5',-24)+E(180,206,270,292,'&gt; 3,5',24);
    for(let k=0;k<6;k++)s+=line(540,206,430+k*44,292,'#555',1);
    s+=node13(360,34,170,'RADICE · 51.370','High 20,4%',.204)+node13(180,178,170,'NODO · 39.844','High 7,5%',.075)+node13(540,178,170,'NODO · 11.526','High 65,0%',.65);
    s+=node13(90,320,150,'FOGLIA','High 3,0%',.03,{leaf:1})+node13(270,320,150,'FOGLIA','High 26,3%',.263,{leaf:1});
    s+=rect(410,292,260,56,'none','#555',' rx="6" stroke-dasharray="4 3"')+tx(540,316,'12 figli, uno per mese',{s:13,f:'#ccc'})+tx(540,334,'(arrival_date_month)',{s:12,f:GRAY});
    s+=rect(458,140,276,224,'none',YEL,' rx="10" stroke-dasharray="6 5"')+tx(724,382,'un sottoalbero',{s:12.5,f:YEL,a:'end'});
    svgBox($('#b13anat'),740,392,s,'Anatomia di un albero','46rem');
  })();
  /* churn example tree */
  (function(){
    let s='';const N=(x,y,c,st,leaf,lab)=>{const w=120;let r=rect(x-w/2,y-24,w,48,'#111',leaf?'#888':'#ddd',' rx="6"'+(leaf?' stroke-dasharray="4 3"':''));
      r+=tx(x,y-6,'<tspan style="fill:'+CHU+'">'+c+' se ne vanno</tspan>',{s:12.5})+tx(x,y+12,'<tspan style="fill:'+STY+'">'+st+' restano</tspan>',{s:12.5});
      const tot=c+st;r+=rect(x-w/2+8,y+16,(w-16)*c/tot,5,CHU)+rect(x-w/2+8+(w-16)*c/tot,y+16,(w-16)*st/tot,5,STY);if(lab)r+=tx(x,y+40,lab,{s:12,f:lab==='se ne va'?CHU:STY,w:600});return r};
    const E=(x1,y1,x2,y2,t,dx)=>line(x1,y1,x2,y2,'#777',1.4)+lbl((x1+x2)/2+(dx||0),(y1+y2)/2+4,t,'#ccc',{s:12.5});
    s+=E(360,52,220,124,'tecnologia vecchia',-50)+E(360,52,560,124,'nuova',30)+E(220,148,120,224,'≤ 2,3 anni',-40)+E(220,148,330,224,'&gt; 2,3 anni',40)+E(120,248,60,324,'età ≤ 35',-30)+E(120,248,200,324,'&gt; 35',22);
    s+=N(360,30,50,50)+N(220,126,30,50)+N(560,126,20,0,1,'se ne va')+N(120,226,25,10)+N(330,226,5,40,1,'resta')+N(60,326,20,0,1,'se ne va')+N(200,326,5,10,1,'resta');
    svgBox($('#b13churn'),640,380,s,'Albero dei clienti che se ne vanno','40rem');
  })();
  /* Gini / entropy and split quality */
  (function(){
    const duo=el('div','duo');$('#b13gini').append(duo);
    let a='';const L=40,R=320,T=14,B=170,X=p=>L+p*(R-L),Y=v=>B-v*(B-T);
    [0,.5,1].forEach(v=>a+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-6,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));[0,.5,1].forEach(p=>a+=tx(X(p),B+16,fi(p,1),{s:12,f:GRAY}));
    const path=f=>{let d='';for(let i=0;i<=100;i++){const p=i/100;d+=(d?'L':'M')+X(p).toFixed(1)+' '+Y(f(p)).toFixed(1)}return d};
    const H=p=>p<=0||p>=1?0:-(p*Math.log2(p)+(1-p)*Math.log2(1-p)),G=p=>1-p*p-(1-p)*(1-p);
    a+='<path d="'+path(H)+'" fill="none" stroke="#fff" stroke-width="2.5"/><path d="'+path(p=>H(p)/2)+'" fill="none" stroke="#999" stroke-width="1.8" stroke-dasharray="5 4"/><path d="'+path(G)+'" fill="none" stroke="'+HIC+'" stroke-width="2.8"/>';
    a+=lbl(X(.5),Y(1)-4,'entropia',null,{s:12.5})+lbl(X(.5),Y(.5)+18,'Gini',HIC,{s:12.5})+line(L,B,R,B,'#777',1.2)+tx((L+R)/2,B+34,'quota p della prima classe',{s:12.5,f:GRAY});
    cell(duo,'Impurità di un nodo',a,340,210,'Gini ed entropia','Zero se il nodo è <b>puro</b>, massimo a p = 0,5.');
    const b=vbars11([['Radice|50 / 50',.5,'#9a9a9a'],['Tecnologia|30/50 · 20/0',.375,HIC],['Anni &gt; 2,3|35/20 · 15/30',.455,'#9a9a9a']],{max:.6,H:210,bot:44,fmt:v=>fi(v,3)});
    cell(duo,'Gini medio dopo il taglio',b,340,210,'Gini dei tagli possibili','Vince la tecnologia: <b>0,375</b>.');
  })();
  /* bias-variance targets */
  (function(){
    const g=el('div','multi');$('#b13bv').append(g);const r=lcg(1313);
    [['Bassa distorsione, bassa varianza',0,0,7,'l\'obiettivo'],['Bassa distorsione, alta varianza',0,0,26,'albero profondo'],['Alta distorsione, bassa varianza',24,-18,7,'troppo semplice'],['Alta distorsione, alta varianza',22,-16,26,'il caso peggiore']].forEach(([t,dx,dy,sd,n])=>{
      let s='';[64,46,28,12].forEach((rr,k)=>s+='<circle cx="80" cy="80" r="'+rr+'" fill="'+(k%2?'#1b1b1b':'#2a2a2a')+'" stroke="#444"/>');s+='<circle cx="80" cy="80" r="4" fill="'+YEL+'"/>';
      for(let i=0;i<12;i++){const x=80+dx+gauss10(r)*sd*.6,y=80+dy+gauss10(r)*sd*.6;s+='<circle cx="'+Math.max(10,Math.min(150,x)).toFixed(1)+'" cy="'+Math.max(10,Math.min(150,y)).toFixed(1)+'" r="3.6" fill="'+BOOC+'"/>'}
      cell(g,t,s,160,160,t,n)});
  })();
  /* bagging vs boosting */
  (function(){
    const duo=el('div','duo');$('#b13bag').append(duo);
    let a='<defs>'+arrowDef('b13a','#888')+'</defs>';[['campione 1',1190],['campione 2',1140],['campione 3',1170]].forEach(([n,v],i)=>{const x=60+i*110;
      a+=tx(x,20,n,{s:12,f:GRAY})+'<path d="M'+x+' 34l-26 40h52z" fill="none" stroke="#bbb" stroke-width="1.5"/>'+tx(x,66,'T'+(i+1),{s:13,f:'#fff'})+tx(x,96,fi(v,0)+' €',{s:13.5,f:'#fff',w:600})+line(x,104,170,150,'#666',1.2,' marker-end="url(#b13a)"')});
    a+=rect(90,154,160,34,'#111',HIC,' rx="6"')+tx(170,176,'media = 1.167 €',{s:14,f:HIC,w:600})+tx(170,210,'in parallelo, indipendenti',{s:12.5,f:GRAY});
    cell(duo,'Bagging: alberi in parallelo',a,340,220,'Bagging','Ogni albero prevede <b>l\'affitto</b>.');
    let b='<defs>'+arrowDef('b13b','#888')+'</defs>';const S=[['media',1418,''],['albero 1',1272.5,'−145,5'],['albero 2',1180,'−92,5'],['albero 3',1195.4,'+15,4']];
    S.forEach(([n,v,c],i)=>{const y=22+i*46;b+=tx(14,y+16,n,{s:12.5,f:'#ccc',a:'start'})+(c?tx(96,y+16,c,{s:13,f:BOOC,a:'start',w:600}):'')+tx(168,y+16,'→ '+fi(v,1).replace(/,0$/,'')+' €',{s:13.5,f:'#fff',a:'start',w:600})+tx(336,y+16,'errore '+fi(1160-v,1).replace(/,0$/,''),{s:11.5,f:GRAY,a:'end'});
      if(i<3)b+=line(60,y+22,60,y+42,'#666',1.2,' marker-end="url(#b13b)"')});
    b+=tx(170,212,'in sequenza: ogni albero impara l\'errore',{s:12.5,f:GRAY});
    cell(duo,'Boosting: alberi in sequenza',b,340,220,'Boosting','Ogni albero prevede <b>l\'errore che resta</b>.');
  })();
  /* boosting worked example, four panels */
  (function(){
    const g=el('div','multi');$('#b13boost').append(g);
    const xs=[750,800,850,900,950],ys=[1160,1200,1280,1450,2000];let F=xs.map(()=>1418);
    const steps=[null,925,825,925];const mse=a=>a.reduce((s,v,i)=>s+(ys[i]-v)**2,0)/5;
    steps.forEach((cut,k)=>{
      if(cut){const res=ys.map((y,i)=>y-F[i]);const L=xs.map((x,i)=>x<cut?i:-1).filter(i=>i>=0),R=xs.map((x,i)=>x>=cut?i:-1).filter(i=>i>=0);
        const ml=L.reduce((s,i)=>s+res[i],0)/L.length,mr=R.reduce((s,i)=>s+res[i],0)/R.length;F=F.map((f,i)=>f+(xs[i]<cut?ml:mr))}
      const X=x=>20+(x-725)/250*170,Y=v=>140-(v-1000)/1100*124;let s=line(14,140,196,140,'#666',1)+line(14,140,14,10,'#666',1);
      let d='';xs.forEach((x,i)=>{const x0=i?X((x+xs[i-1])/2):X(725),x1=i<4?X((x+xs[i+1])/2):X(975);d+=(d?'L':'M')+x0.toFixed(1)+' '+Y(F[i]).toFixed(1)+'L'+x1.toFixed(1)+' '+Y(F[i]).toFixed(1)});
      s+='<path d="'+d+'" fill="none" stroke="'+BOOC+'" stroke-width="2.6"/>';
      xs.forEach((x,i)=>s+=line(X(x),Y(ys[i]),X(x),Y(F[i]),'#666',1,' stroke-dasharray="2 2"')+'<circle cx="'+X(x)+'" cy="'+Y(ys[i])+'" r="4.5" fill="#fff"/>');
      if(cut)s+=line(X(cut),12,X(cut),140,YEL,1.2,' stroke-dasharray="4 3"')+tx(X(cut),10,'taglio '+cut,{s:11,f:YEL});
      cell(g,k?'Passo '+k:'Passo 0: la media',s,210,150,'Passo '+k,'MSE '+fi(Math.round(mse(F)),0));
    });
  })();
  /* sigmoid */
  (function(){
    let s='';const L=60,R=660,T=14,B=200,X=f=>L+(f+5)/10*(R-L),Y=p=>B-p*(B-T);
    [0,.5,1].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));for(let f=-5;f<=5;f++)s+=tx(X(f),B+18,f<0?'−'+(-f):String(f),{s:12,f:GRAY});
    let d='';for(let i=0;i<=200;i++){const f=-5+i/20;d+=(d?'L':'M')+X(f).toFixed(1)+' '+Y(1/(1+Math.exp(-f))).toFixed(1)}s+='<path d="'+d+'" fill="none" stroke="'+BOOC+'" stroke-width="3"/>';
    [[-2,.12],[0,.5],[1.5,.82],[3,.95]].forEach(([f,p])=>s+=line(X(f),B,X(f),Y(p),'#555',1,' stroke-dasharray="3 3"')+'<circle cx="'+X(f)+'" cy="'+Y(p)+'" r="5.5" fill="#fff"/>'+lbl(X(f)+(f<0?-10:10),Y(p)+(f<0?-8:18),fi(p,2),'#fff',{a:f<0?'end':'start',s:13.5}));
    s+=line(L,B,R,B,'#777',1.2)+tx((L+R)/2,B+38,'punteggio F (somma degli alberi)',{s:13,f:GRAY})+tx(18,(T+B)/2,'P(High)',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b13sig'),680,250,s,'Funzione logistica','42rem');
  })();
  /* results */
  (function(){
    const M=[['Albero',.810,.832,'#9a9a9a'],['Random forest',.844,.905,GRN],['Gradient boosting',.862,.894,PINK],['XGBoost',.850,.891,ORG]];let s='';const B=200,T=20,Y=v=>B-(v-.75)/.2*(B-T);
    [.75,.8,.85,.9,.95].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,2),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,r,p,c],i)=>{const x=80+i*148;s+=rect(x,Y(r),48,B-Y(r),c)+rect(x+56,Y(p),48,B-Y(p),c,null,' fill-opacity=".55"')+tx(x+24,Y(r)-6,fi(r,3),{s:12,f:'#fff'})+tx(x+80,Y(p)-6,fi(p,3),{s:12,f:'#fff'})+tx(x+52,B+18,n,{s:12.5,f:'#ddd'})+tx(x+24,B+34,'sens.',{s:11,f:GRAY})+tx(x+80,B+34,'prec.',{s:11,f:GRAY})});
    s+=line(50,B,660,B,'#777',1.2)+tx(660,12,'(l\'asse parte da 0,75)',{s:11.5,f:GRAY,a:'end'});
    svgBox($('#b13res'),680,246,s,'Sensibilità e precisione dei quattro modelli','42rem');
  })();
  /* importance */
  (function(){
    const duo=el('div','duo');$('#b13imp').append(duo);
    const hb=(rows,max,fmt,c)=>{let s='';rows.forEach(([n,v],i)=>{const y=8+i*25;s+=tx(152,y+15,n,{s:12,f:'#ddd',a:'end'})+rect(158,y+4,v/max*130,15,c)+tx(162+v/max*130,y+16,fmt(v),{s:11.5,f:'#fff',a:'start'})});return s};
    cell(duo,'Random forest: statistiche dei tagli',hb([['total_nights',2.88],['stays_in_week_nights',2.32],['stays_in_weekend_nights',1.84],['reserved_room_type',1.50],['arrival_date_month',1.48],['total_guests',1.45],['lead_time',.93],['adults',.72]],3,v=>fi(v,2),GRN),340,212,'Statistiche dei tagli','Massimo possibile: 3.');
    cell(duo,'XGBoost: media di |SHAP|',hb([['total_nights',.188],['arrival_date_month',.073],['hotel',.038],['market_segment',.031],['reserved_room_type',.030],['meal',.030],['lead_time',.019],['total_guests',.015]],.2,v=>fi(v,3),ORG),340,212,'Importanza SHAP','Su P(High), 300 prenotazioni.');
  })();
  /* SHAP by month */
  (function(){
    const V=[-.080,-.085,-.080,-.002,.033,.073,.135,.131,.046,-.036,-.096,-.054],Mn=['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];let s='';const Z=130,Y=v=>Z-v/.16*110;
    [-.1,0,.1].forEach(v=>s+=line(40,Y(v),680,Y(v),v?'#1d1d1d':'#777',v?1:1.2)+tx(34,Y(v)+4,(v>0?'+':'')+fi(v,1),{s:12,f:GRAY,a:'end'}));
    V.forEach((v,i)=>{const x=56+i*52;s+=rect(x,Math.min(Y(v),Z),38,Math.abs(Y(v)-Z),v>0?HIC:RED)+tx(x+19,v>0?Y(v)-6:Y(v)+16,(v>0?'+':'')+fi(v,3),{s:11.5,f:'#fff'})+tx(x+19,262,Mn[i],{s:12.5,f:'#ddd'})});
    svgBox($('#b13month'),700,274,s,'SHAP medio per mese di arrivo','44rem');
  })();
  /* waterfall single booking */
  (function(){
    const C=[['total_nights',.391],['arrival_date_month',.138],['total_guests',.117],['reserved_room_type',-.032],['market_segment',.025],['lead_time',.024],['altre variabili',.015]];
    let s='';const L=40,R=680,X=v=>L+v*(R-L);let cur=.17;
    [0,.25,.5,.75,1].forEach(v=>s+=line(X(v),10,X(v),C.length*30+66,'#1d1d1d',1)+tx(X(v),C.length*30+82,fi(v,2),{s:12,f:GRAY}));
    s+=rect(X(0),12,X(.17)-X(0),20,'#777')+tx(X(.17)+8,27,'previsione media 0,17',{s:12.5,f:'#ddd',a:'start'});
    C.forEach(([n,v],i)=>{const y=42+i*30,a=Math.min(cur,cur+v),b=Math.max(cur,cur+v);s+=rect(X(a),y,Math.max(2,X(b)-X(a)),20,v>0?HIC:RED)+tx(v>0?X(b)+8:X(a)-8,y+15,n+' '+(v>0?'+':'−')+fi(Math.abs(v),3),{s:12.5,f:'#ddd',a:v>0?'start':'end'});cur+=v});
    const y=42+C.length*30;s+=rect(X(0),y,X(.84)-X(0),20,'#fff')+tx(X(.84)-8,y+15,'previsione del modello ≈ 0,84',{s:12.5,f:'#000',a:'end',w:600});
    svgBox($('#b13water'),720,C.length*30+92,s,'Spiegazione SHAP di una prenotazione','44rem');
  })();
  /* partial dependence */
  (function(){
    const P=[[1,0],[2,0],[3,.1],[4,.25],[5,.40],[6,.58],[7,.70],[8,.77],[9,.81],[10,.83],[11,.84],[13,.88],[14,.88]];let s='';const L=60,R=660,T=14,B=230,X=v=>L+v/14*(R-L),Y=v=>B-v*(B-T);
    [0,.25,.5,.75,1].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,fi(v,2),{s:12,f:GRAY,a:'end'}));for(let v=0;v<=14;v+=2)s+=tx(X(v),B+18,String(v),{s:12,f:GRAY});
    s+='<polyline points="'+P.map(([v,p])=>X(v)+','+Y(p)).join(' ')+'" fill="none" stroke="'+TEAL+'" stroke-width="3"/>';P.forEach(([v,p])=>s+='<circle cx="'+X(v)+'" cy="'+Y(p)+'" r="4.5" fill="'+TEAL+'"/>');
    s+=line(X(5),B,X(5),Y(.4),YEL,1.3,' stroke-dasharray="4 3"')+line(L,Y(.4),X(5),Y(.4),YEL,1.3,' stroke-dasharray="4 3"')+lbl(X(5)+8,Y(.4)+16,'PD(5) = 0,40',YEL,{a:'start',s:13.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'notti totali imposte a ogni prenotazione',{s:13,f:GRAY})+tx(18,(T+B)/2,'P(High) media',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b13pdp'),680,280,s,'Dipendenza parziale delle notti','42rem');
  })();
};
QZ['13a']=()=>[{q:'Nell\'albero dei 100 clienti, un cliente ha la tecnologia vecchia, è cliente da 1 anno e ha 50 anni. In quale foglia finisce e come viene classificato?',o:['Nella foglia 20 / 0: se ne va','Nella foglia 5 / 10: resta','Nella foglia 5 / 40: resta','Nella foglia 20 / 0 della tecnologia nuova: se ne va'],a:1,
  e:'Vecchia, al massimo 2,3 anni, età oltre 35: foglia con 5 che se ne vanno e 10 che restano. La classe prevista è quella maggioritaria, resta.',h:'Segui i rami dall\'alto: tecnologia, poi anni, poi età.'}];
QZ['13b']=()=>[{q:'Un nodo contiene 20 clienti che se ne vanno e 20 che restano. Quanto vale il suo indice di Gini?',o:['0','0,25','0,5','1'],a:2,
  e:'p = 0,5 per entrambe le classi: 1 − (0,25 + 0,25) = 0,5, il massimo con due classi.',h:'Gini = 1 − somma dei quadrati delle quote.'}];
QZ['13c']=()=>[{q:'In una random forest, perché a ogni taglio si considera solo un sottoinsieme casuale di variabili?',o:['Per rendere ogni albero più accurato da solo','Per rendere gli alberi diversi fra loro, così la media riduce davvero la varianza','Per risparmiare memoria','Per ridurre la distorsione di ogni albero'],a:1,
  e:'Se una variabile fortissima fosse sempre disponibile, tutti gli alberi la userebbero in cima e si somiglierebbero. La media di alberi simili non riduce la varianza.',h:'Che cosa succede alla media di cento copie dello stesso albero?'}];
QZ['13d']=()=>[{q:'Aggiungi sempre più alberi a un gradient boosting con tasso di apprendimento fisso. Che cosa succede all\'errore sul test?',o:['Scende sempre, come in una random forest','Scende e poi può risalire: il numero di alberi va scelto sulla validazione','Resta costante','Sale fin dal primo albero'],a:1,
  e:'Ogni albero riduce l\'errore sul training; oltre un certo punto il modello comincia a imparare il rumore. Nella random forest invece più alberi non fanno male.',h:'Ricorda la tabella del confronto fra le due famiglie.'}];
QZ['13e']=()=>[{q:'Il manager chiede: «perché il modello dà 0,84 a questa specifica prenotazione?». Quale lente usi?',o:['Le statistiche dei tagli della foresta','I valori SHAP di quella prenotazione','La dipendenza parziale delle notti','L\'AUC'],a:1,
  e:'Solo SHAP spiega una singola previsione (portata locale), dividendola fra le variabili a partire dalla previsione media.',h:'Quale lente ha portata locale?'}];
QZ['13']=()=>[
  {q:'Un taglio divide un nodo di 100 unità in due figli: 60 unità con Gini 0,3 e 40 unità con Gini 0,1. Quanto vale il Gini del taglio?',o:['0,20','0,22','0,40','0,18'],a:1,
   e:'Media pesata: 0,6 × 0,3 + 0,4 × 0,1 = 0,18 + 0,04 = 0,22.',h:'Pesa ogni figlio con la sua quota di unità.'},
  {q:'Un taglio ha guadagno di informazione 0,40 e SplitINFO 2,0. Qual è il gain ratio, e a che cosa serve?',o:['0,80: premia i tagli con molti gruppi','0,20: penalizza i tagli in molti gruppi piccoli','2,40: somma le due misure','0,40: lo SplitINFO non conta'],a:1,
   e:'Gain ratio = IG / SplitINFO = 0,40 / 2,0 = 0,20. Lo SplitINFO cresce con il numero di gruppi, quindi il rapporto protegge da variabili come il mese o il paese.',h:'Si divide il guadagno per lo SplitINFO.'},
  {q:'Nell\'esempio degli affitti, dopo il passo 1 i residui sono −112,5, −72,5, 7,5, 177,5 e 0. Il secondo albero taglia a 825. Che cosa prevede per gli appartamenti di 750 e 800 piedi quadrati?',o:['−112,5','−92,5','−72,5','61,7'],a:1,
   e:'A sinistra del taglio ci sono i residui −112,5 e −72,5: la loro media è −92,5. A destra (7,5 + 177,5 + 0) / 3 ≈ 61,7.',h:'Una foglia prevede la media dei residui che contiene.'},
  {q:'Un albero di boosting dà a una prenotazione un punteggio complessivo F = 0. Qual è la probabilità prevista di High?',o:['0','0,12','0,50','1'],a:2,
   e:'p = 1 / (1 + e⁰) = 1 / 2 = 0,5.',h:'Usa la funzione logistica.'},
  {q:'Quale coppia descrive correttamente gli alberi singoli dentro i due tipi di insieme?',o:['Foresta: alberi bassi; boosting: alberi profondi','Foresta: alberi profondi non potati; boosting: alberi bassi, da 2 a 6 livelli','Tutti e due: alberi potati con MDL','Foresta: un solo albero; boosting: cento alberi uguali'],a:1,
   e:'La foresta media alberi profondi (bassa distorsione, alta varianza) per ridurre la varianza; il boosting somma alberi bassi (alta distorsione, bassa varianza) per ridurre la distorsione.',h:'Quale errore attacca ciascuna famiglia?'},
  {q:'La dipendenza parziale dice PD(5) = 0,40. Quale lettura è corretta?',o:['Il 40% delle prenotazioni dura 5 notti','Se ogni prenotazione durasse 5 notti, lasciando il resto com\'è, la probabilità media prevista di High sarebbe 0,40','Allungare un soggiorno a 5 notti causa un aumento del ricavo del 40%','Le prenotazioni di 5 notti sono High nel 40% dei dati'],a:1,
   e:'È la previsione media del modello con le notti forzate a 5 per tutte le prenotazioni. Non è una frequenza nei dati, e non è un effetto causale.',h:'Ricorda la formula di PD(v) e che importanza non vuol dire causalità.'}
];
MAPPA[13]={c:'Come decide un albero, e perché cento alberi decidono meglio?',r:[
  {t:'Alberi',c:GRN,v:['Radice, nodi, rami, foglie','Classificazione e regressione','Supervisionato, a differenza del clustering','Ricorsivo e avido']},
  {t:'Criteri di taglio',c:BLUE,v:['Gini: 1 − somma dei quadrati','Entropia e guadagno di informazione','Gain ratio contro i tagli in molti gruppi','Potatura MDL, minimo 20 unità']},
  {t:'Algoritmi',c:TEAL,v:['CART, C4.5, CHAID, QUEST','KNIME: Decision Tree Learner simile a C4.5','Ensemble basati su CART']},
  {t:'Distorsione e varianza',c:YEL,v:['Errore = distorsione² + varianza + rumore','Foresta: riduce la varianza','Boosting: riduce la distorsione']},
  {t:'Foresta e boosting',c:PINK,v:['Bootstrap e √p variabili per taglio','Alberi sui residui, tasso 0,1','XGBoost: perdita + complessità','Accuratezza: 0,928 albero, 0,950-0,951 insiemi']},
  {t:'Importanza',c:ORG,v:['Statistiche dei tagli','SHAP: contributi che sommano alla previsione','Dipendenza parziale: forma dell\'effetto','Importanza non è causalità']}]};

/* Lezione 14: casi applicati, cancellazioni alberghiere con tre modelli ad albero e abbandono dei clienti di una banca */
const LEFTC=ORG,KEEPC=BLUE,HONC=GRN;
INIT[14]=function(){
  /* three confusion matrices, hotel */
  (function(){
    const t=el('div','trio');$('#b14cm').append(t);
    [['Albero di decisione',{tp:9944,fn:3314,fp:2069,tn:20434}],['Random forest',{tp:10293,fn:2965,fp:1381,tn:21122}],['Gradient boosting',{tp:9790,fn:3468,fp:1690,tn:20813}]].forEach(([n,m])=>
      cell(t,n,cm12(70,46,m,['Yes','No'],{w:82,h:52,fs:15,noside:1}),250,160,'Matrice di confusione: '+n,'mancate <b>'+fi(m.fn,0)+'</b> · falsi allarmi <b>'+fi(m.fp,0)+'</b>'));
  })();
  /* errors by model */
  (function(){
    let s='';const M=[['Albero',3314,2069],['Random forest',2965,1381],['Gradient boosting',3468,1690]],B=200,T=24,Y=v=>B-v/4000*(B-T);
    [0,1000,2000,3000,4000].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,0),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,a,b],i)=>{const x=100+i*190;s+=rect(x,Y(a),60,B-Y(a),RED)+rect(x+68,Y(b),60,B-Y(b),ORG)+tx(x+30,Y(a)-6,fi(a,0),{s:12.5,f:'#fff'})+tx(x+98,Y(b)-6,fi(b,0),{s:12.5,f:'#fff'})+tx(x+64,B+20,n,{s:13,f:'#ddd'})});
    s+=line(50,B,660,B,'#777',1.2)+rect(330,4,12,12,RED)+tx(348,15,'cancellazioni mancate',{s:12.5,f:'#ddd',a:'start'})+rect(510,4,12,12,ORG)+tx(528,15,'falsi allarmi',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b14err'),680,230,s,'Errori dei tre modelli','42rem');
  })();
  /* special agreements split */
  (function(){
    let s='';const G=[['almeno un conto in convenzione',1581,5],['nessuna convenzione',2631,2101]];
    G.forEach(([n,tot,ch],i)=>{const y=30+i*84,w=560*tot/2631;s+=tx(20,y,n+' · '+fi(tot,0)+' clienti',{s:13.5,f:'#ddd',a:'start'});
      s+=rect(20,y+10,w*ch/tot,34,LEFTC)+rect(20+w*ch/tot,y+10,w*(1-ch/tot),34,KEEPC)+tx(20+w+10,y+33,fi(ch/tot*100,1)+'% se ne va',{s:14,f:LEFTC,a:'start',w:600})});
    s+=rect(20,200,12,12,LEFTC)+tx(38,211,'se ne va',{s:12.5,f:'#ddd',a:'start'})+rect(120,200,12,12,KEEPC)+tx(138,211,'resta',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b14conv'),720,222,s,'Abbandono per conti in convenzione','44rem');
  })();
  /* row flow */
  (function(){
    let s='<defs>'+arrowDef('b14a','#888')+'</defs>';
    const box=(x,y,w,t1,n,p,c)=>{let r=rect(x,y,w,62,'#111',c||'#bbb',' rx="6"')+tx(x+w/2,y+20,t1,{s:12.5,f:GRAY})+tx(x+w/2,y+40,fi(n,0)+' righe',{s:14,f:'#fff',w:600});
      r+=rect(x+10,y+48,(w-20)*p,6,LEFTC)+rect(x+10+(w-20)*p,y+48,(w-20)*(1-p),6,KEEPC)+tx(x+w/2,y+76,fi(p*100,1)+'% se ne va',{s:12,f:LEFTC});return r};
    s+=box(10,20,150,'come consegnato',4212,.5)+box(200,20,150,'solo conto corrente',3944,.534)+box(400,0,140,'training 70%',2760,.534)+box(400,110,140,'test 30%',1184,.534,YEL)+box(580,0,130,'training bilanciato',2572,.5,HONC);
    s+=line(160,51,196,51,'#888',1.5,' marker-end="url(#b14a)"')+line(350,45,396,31,'#888',1.5,' marker-end="url(#b14a)"')+line(350,60,396,140,'#888',1.5,' marker-end="url(#b14a)"')+line(540,31,576,31,'#888',1.5,' marker-end="url(#b14a)"');
    s+=tx(180,42,'−268',{s:12,f:GRAY})+tx(645,104,'Equal Size Sampling',{s:12,f:HONC})+tx(645,150,'il test resta',{s:12.5,f:YEL})+tx(645,168,'com\'è',{s:12.5,f:YEL});
    svgBox($('#b14flow'),720,196,s,'Righe a ogni passo della preparazione','46rem');
  })();
  /* before / after */
  (function(){
    let s='';const M=[['Albero di decisione',.942,.682],['Random forest / Tree Ensemble',.911,.752],['Gradient boosting (H2O)',.754,.762]],B=210,T=24,Y=v=>B-(v-.5)/.5*(B-T);
    [.5,.6,.7,.8,.9,1].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,a,b],i)=>{const x=90+i*195;s+=rect(x,Y(a),62,B-Y(a),'#8a8a8a')+rect(x+70,Y(b),62,B-Y(b),HONC)+tx(x+31,Y(a)-6,fi(a,3),{s:12.5,f:'#ddd'})+tx(x+101,Y(b)-6,fi(b,3),{s:12.5,f:HONC,w:600})+tx(x+66,B+20,n,{s:12.5,f:'#ddd'});
      const d=Math.round((b-a)*100);s+=tx(x+66,B+38,(d>0?'+':'−')+Math.abs(d)+(Math.abs(d)===1?' punto':' punti'),{s:12,f:d<0?RED:HONC})});
    s+=line(50,B,660,B,'#777',1.2)+rect(370,4,12,12,'#8a8a8a')+tx(388,15,'workflow consegnato',{s:12.5,f:'#ddd',a:'start'})+rect(530,4,12,12,HONC)+tx(548,15,'workflow corretto',{s:12.5,f:'#ddd',a:'start'})+tx(50,14,'(l\'asse parte da 0,5)',{s:11.5,f:GRAY,a:'start'});
    svgBox($('#b14ba'),680,260,s,'Accuratezza prima e dopo','42rem');
  })();
  /* GBM importance */
  (function(){
    const V=[['tenure (anzianità)',15.8,1],['contatore dei movimenti',6.3,1],['age (età)',5.9,1],['area',5.5,1],['carte e utenze',4.1,1],['indicatore di problematicità',4.0,1],['strategy (strategia)',2.4,1],['saldo passivo, trimestre −1',2.2,0],['accrediti di pensione o stipendio, trimestre −3',2.1,0],['movimenti di addebito, trimestre −3',2.1,0]];
    let s='';const L=330,X=v=>L+v/18*330;V.forEach(([n,v,p],i)=>{const y=8+i*28;s+=tx(L-10,y+16,n,{s:12.5,f:'#ddd',a:'end'})+rect(L,y+4,X(v)-L,17,p?BLUE:'#8a8a8a')+tx(X(v)+8,y+17,fi(v,1)+'%',{s:12.5,f:'#fff',a:'start'})});
    svgBox($('#b14imp'),720,V.length*28+14,s,'Importanza delle variabili nel GBM','44rem');
  })();
  /* three patterns */
  (function(){
    const t=el('div','trio');$('#b14pat').append(t);
    const P=[['Per prodotti posseduti',[['0',77.5],['1',56.0],['2',49.2],['3',49.0],['4+',36.5]],[0],[4]],['Per fascia d\'età',[['&lt;30',48.4],['30-40',52.2],['40-50',49.5],['50-60',53.7],['60+',62.7]],[4],[]],['Per anni di rapporto',[['0-2',48.9],['3-5',50.9],['6-8',44.9],['9-11',51.5],['12+',62.6]],[4],[2]]];
    P.forEach(([n,b,hi,lo])=>cell(t,n,vbars11(b.map(([l,v],i)=>[l,v,hi.includes(i)?RED:lo.includes(i)?GRN:'#8a8a8a']),{W:260,H:190,max:85,bw:34,L:6,R:6}),260,190,'Abbandono '+n,''));
  })();
  /* call list */
  (function(){
    let s='';const B=190,Y=v=>B-v/300*(B-20);
    [[ 'a caso',160,'#8a8a8a'],['primi 300 del modello',276,HONC]].forEach(([n,v,c],i)=>{const x=110+i*230;s+=rect(x,Y(300),120,B-Y(300),'none','#444',' stroke-dasharray="4 3"')+rect(x,Y(v),120,B-Y(v),c)+tx(x+60,Y(v)+24,'≈ '+v,{s:17,f:'#000',w:600})+tx(x+60,B+20,n,{s:13,f:'#ddd'})});
    s+=line(80,B,600,B,'#777',1.2)+tx(600,14,'300 chiamate (tratteggio)',{s:12,f:GRAY,a:'end'})+lbl(285,Y(218),'+116 clienti',HONC,{s:14,w:600});
    s+=tx(170,Y(300)-6,'clienti in uscita trovati',{s:12,f:GRAY});
    svgBox($('#b14call'),640,220,s,'Clienti trovati con 300 chiamate','40rem');
  })();
};
QZ['14a']=()=>[{q:'Sulle 35.761 prenotazioni di test, quante sono state cancellate davvero, e quale accuratezza otterrebbe un modello che prevede sempre «No»?',o:['13.258 e 0,629','22.503 e 0,371','13.258 e 0,500','10.293 e 0,878'],a:0,
  e:'Cancellazioni vere = TP + FN = 10.293 + 2.965 = 13.258 (37,1%). Prevedendo sempre No si indovinano le 22.503 non cancellate: 22.503 / 35.761 = 0,629.',h:'Somma la riga Yes di una matrice qualsiasi.'}];
QZ['14b']=()=>[{q:'Quale domanda permette di scartare una colonna come «conti aperti dopo l\'abbandono» anche se predice benissimo?',o:['Che cosa significa questa colonna?','Quando viene misurata, rispetto al momento della previsione?','Quanti valori mancanti ha?','È numerica o categorica?'],a:1,
  e:'Il leakage riguarda il momento della misura: una colonna misurata dopo l\'evento contiene la risposta e non sarà disponibile quando servirà prevedere.',h:'Le slide dicono: non che cosa significa, ma quando.'}];
QZ['14c']=()=>[{q:'Uno studente bilancia l\'intero dataset (50% e 50%) e poi lo divide in training e test. Che cosa non va?',o:['Niente, l\'ordine non conta','Il test ha una distribuzione delle classi che non esiste nella realtà: le misure non valgono per i dati veri','Il training ha troppe righe','Bisognava bilanciare solo il test'],a:1,
  e:'Prima si divide (in modo stratificato), poi si bilancia solo il training. Il test deve conservare la distribuzione naturale, perché è la misura che si riporta.',h:'Su quali dati deve essere misurato il modello?'}];
QZ['14d']=()=>[{q:'La filiale può fare 300 chiamate. Perché la lista si taglia a 300 invece di usare la soglia 0,5?',o:['Perché 0,5 è sempre sbagliata','Perché la lunghezza della lista la decide la capacità della filiale, non una soglia statistica','Perché il modello non dà probabilità','Perché 300 è il 25% dei clienti di test'],a:1,
  e:'Con la soglia 0,5 i clienti segnalati sarebbero 638, più delle chiamate possibili. Si ordinano per probabilità e si prendono i primi 300.',h:'Quanti clienti segnala la soglia 0,5?'}];
QZ['14']=()=>[
  {q:'Nel caso degli hotel la random forest ha TP = 10.293 e FP = 1.381. Quanto vale la precisione?',o:['0,776','0,882','0,939','0,878'],a:1,
   e:'10.293 / (10.293 + 1.381) = 10.293 / 11.674 ≈ 0,882.',h:'Delle prenotazioni previste cancellate, quante lo sono davvero?'},
  {q:'Se per l\'albergo un falso allarme (cliente da spostare in un altro albergo) costa più di una cancellazione mancata, come si muove la soglia?',o:['Si abbassa sotto 0,5','Si alza sopra 0,5','Resta 0,5','Si sceglie il modello con l\'accuratezza più alta'],a:1,
   e:'Alzando la soglia si segnalano meno prenotazioni: meno falsi allarmi, al prezzo di qualche cancellazione mancata in più.',h:'Quale soglia produce meno previsioni positive?'},
  {q:'Le 87 colonne z-score della banca sono copie standardizzate delle colonne grezze. Che effetto hanno su un albero?',o:['Lo migliorano, perché i dati sono normalizzati','Nessun guadagno: dividono l\'importanza fra gemelli identici e raddoppiano lo spazio delle variabili','Causano leakage','Rendono impossibile il bilanciamento'],a:1,
   e:'Una standardizzazione è lineare: correlazione 1,000, nessuna informazione nuova. Togliendole l\'accuratezza è rimasta uguale (0,904 → 0,909).',h:'Che correlazione hanno una colonna e il suo z-score?'},
  {q:'Quali due sintomi dovevano far sospettare del workflow consegnato?',o:['Accuratezza bassa e AUC bassa','Sensibilità 0,997 dell\'albero e l\'albero singolo che batte l\'insieme di alberi','Troppi valori mancanti e poche righe','Il boosting più lento della foresta'],a:1,
   e:'Niente nel comportamento dei clienti è prevedibile al 99,7%, e una media di alberi non può migliorare una colonna che è già la risposta.',h:'Rileggi il paragrafo sui numeri lusinghieri.'},
  {q:'Le slide notano che i cicli di ottimizzazione valutano sulla parte di test. Che cosa implica per l\'AUC migliore trovata?',o:['È pessimista','È ottimista: i parametri sono stati scelti guardando il test','È esatta','Non cambia nulla perché si usa l\'AUC e non l\'accuratezza'],a:1,
   e:'Un test usato per scegliere i parametri non è più indipendente. La versione pulita regola su una parte di validazione.',h:'Ricorda il ruolo dell\'insieme di validazione nella lezione 12.'},
  {q:'Con 300 chiamate il modello trova 276 clienti in uscita contro circa 160 a caso. Se il 30% dei clienti raggiunti accetta l\'offerta, quanti clienti in più trattiene il modello rispetto alla scelta casuale?',o:['Circa 35','Circa 83','Circa 116','Circa 48'],a:0,
   e:'Modello: 276 × 0,3 ≈ 83; a caso: 160 × 0,3 = 48. Differenza: circa 35 clienti trattenuti in più, cioè 116 × 0,3.',h:'Applica il 30% ai due numeri, poi sottrai.'}
];
MAPPA[14]={c:'Quando ci si può fidare di un modello?',r:[
  {t:'Caso hotel',c:BLUE,v:['Training 83.442, test 35.761, seme 42','Foresta migliore: 0,878, AUC 0,948','Sempre No: 0,629']},
  {t:'Dai punteggi alle decisioni',c:ORG,v:['Mancata: camera vuota','Falso allarme: ospite da spostare','Modello sull\'AUC, soglia sui costi']},
  {t:'Trappole della banca',c:RED,v:['87 copie z-score, correlazione 1','Convenzioni: 0,3% contro 79,9%','Colonne post-evento: leakage','Prova dell\'azione']},
  {t:'Dividere e bilanciare',c:YEL,v:['Prima stratificare 70/30','Poi bilanciare solo il training','Fissare i semi, regolare sulla validazione']},
  {t:'Risultati onesti',c:GRN,v:['Albero 0,942 → 0,682','GBM 0,762, AUC 0,844','Anzianità, età, prodotti, area']},
  {t:'Lista di chiamate',c:PINK,v:['Ordinare, tagliare, agire, misurare','300 chiamate: 276 contro 160','Costo delle chiamate contro margine']}]};

/* Lezione 15: text analytics, sentiment e topic sui tweet alle compagnie aeree (Twitter US Airline Sentiment) */
const NEGC=RED,NEUC='#9a9a9a',POSC=GRN,HUMC=BLUE,LEXC=YEL;
/* 3x3 confusion heat matrix with row percentages */
function cm15(rows,lab){let s='';const x0=120,y0=56,w=72,h=44;
  s+=tx(x0+1.5*w,y0-34,'classe prevista',{s:12,f:GRAY})+tx(20,y0+1.5*h,'classe umana',{s:12,f:GRAY,x:' transform="rotate(-90 20 '+(y0+1.5*h)+')"'});
  lab.forEach((l,j)=>{s+=tx(x0+j*w+w/2,y0-10,l,{s:12,f:'#ddd'})+tx(x0-8,y0+j*h+h/2+5,l,{s:12,f:'#ddd',a:'end'})});
  rows.forEach((r,i)=>{const tot=r.reduce((a,b)=>a+b,0);r.forEach((v,j)=>{const p=v/tot;s+=rect(x0+j*w,y0+i*h,w,h,i===j?'rgba(131,193,103,'+(0.15+p*.7).toFixed(2)+')':'rgba(252,98,85,'+(0.08+p*.7).toFixed(2)+')','#000');
    s+=tx(x0+j*w+w/2,y0+i*h+20,Math.round(p*100)+'%',{s:14,f:'#fff',w:600})+tx(x0+j*w+w/2,y0+i*h+36,fi(v,0),{s:11,f:'#ccc'})})});
  return s}
INIT[15]=function(){
  /* bag of words vs embeddings */
  (function(){
    const duo=el('div','duo');$('#b15bow').append(duo);
    const cols=[{t:'tweet',w:134},{t:'delayed',w:62,a:'m'},{t:'hours',w:54,a:'m'},{t:'bag',w:42,a:'m'},{t:'great',w:52,a:'m'}];
    const one=v=>({v:String(v),f:v?'#fff':'#555',b:!!v,bg:v?'rgba(88,196,221,.22)':null});
    const t=sTab(0,0,cols,[['«delayed 3 hours»',1,1,0,0],['«lost my bag»',0,0,1,0],['«great crew»',0,0,0,1]].map(r=>[r[0]].concat(r.slice(1).map(one))),{rh:30});
    tabCell(duo,'Bag of words',t,'Trasparente ma <b>sparso</b>: i sinonimi non si toccano.',340);
    let b=line(14,176,326,176,'#555',1)+line(14,176,14,10,'#555',1);
    [[['delayed',70,40],['late',110,58],['hours',62,78]],[['bag',230,52],['luggage',272,76],['suitcase',226,98]],[['great',110,140],['love',160,124],['thanks',188,152]]].forEach((g,k)=>{const c=[ORG,BLUE,GRN][k];
      g.forEach(([w,x,y])=>b+='<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+c+'"/>'+tx(x+8,y+4,w,{s:12.5,f:c,a:'start'}))});
    cell(duo,'Embedding (mappa illustrativa)',b,340,186,'Embedding','Significati simili stanno <b>vicini</b>.');
  })();
  /* LDA idea */
  (function(){
    let s='';const T=[['Topic A','delayed · gate · hours · plane',ORG],['Topic B','bag · lost · luggage · baggage',BLUE],['Topic C','cancelled · hold · phone · rebook',PINK]];
    T.forEach(([n,w,c],i)=>{const y=24+i*62;s+=rect(10,y,250,46,'#111',c,' rx="6"')+tx(22,y+19,n,{s:13,f:c,a:'start',w:600})+tx(22,y+37,w,{s:12,f:'#ccc',a:'start'})});
    const D=[['«Flight cancelled, 2 h on hold to rebook»',[[.15,0],[0,1],[.85,2]]],['«Sitting at the gate 3 hours, now my bag is lost»',[[.55,0],[.45,1]]],['«Lost luggage again, nobody answers the phone»',[[.7,1],[.3,2]]]];
    D.forEach(([t,mix],i)=>{const y=24+i*62;s+=tx(300,y+16,t,{s:12.5,f:'#ddd',a:'start'});let x=300;mix.forEach(([p,k])=>{if(p>0){s+=rect(x,y+26,p*400,14,T[k][2]);x+=p*400}})});
    s+=tx(135,14,'ogni topic: un miscuglio di parole',{s:12,f:GRAY})+tx(500,14,'ogni tweet: un miscuglio di topic',{s:12,f:GRAY});
    svgBox($('#b15lda'),720,212,s,'Idea della Latent Dirichlet Allocation','46rem');
  })();
  /* labels */
  (function(){
    const duo=el('div','duo');$('#b15lab').append(duo);
    cell(duo,'Etichette umane',vbars11([['negativo',62.7,NEGC],['neutro',21.2,NEUC],['positivo',16.1,POSC]],{max:72,H:200}),340,200,'Etichette umane','<b>9.084</b> tweet negativi su 14.485.');
    const R=[['Customer Service Issue',2883],['Late Flight',1652],['Can\'t Tell',1183],['Cancelled Flight',831],['Lost Luggage',718],['Bad Flight',573],['Flight Booking Problems',521]];
    let b='';R.forEach(([n,v],i)=>{const y=8+i*26;b+=tx(160,y+16,n,{s:12,f:'#ddd',a:'end'})+rect(166,y+4,v/2883*120,16,NEGC)+tx(172+v/2883*120,y+17,fi(v,0),{s:11.5,f:'#fff',a:'start'})});
    cell(duo,'Motivi dei tweet negativi',b,340,194,'Motivi dei tweet negativi','I sette motivi più frequenti.');
  })();
  /* confusion matrices */
  (function(){
    const duo=el('div','duo');$('#b15cm').append(duo);const L=['neg','neu','pos'];
    cell(duo,'Dizionario, 14.485 tweet',cm15([[3720,3856,1508],[346,2034,687],[119,699,1516]],L),340,196,'Dizionario','Accuratezza <b>50%</b>, κ 0,27.');
    cell(duo,'Random forest, 4.147 tweet di test',cm15([[2305,245,117],[368,346,107],[175,77,407]],L),340,196,'Random forest','Accuratezza <b>74%</b>, κ 0,48.');
  })();
  /* airlines humans vs lexicon */
  (function(){
    let s='';const A=[['US Airways',77.7,36],['American',71.7,30],['United',68.9,33],['Southwest',49.0,21],['Delta',43.0,21],['Virgin America',35.9,18]],B=210,T=20,Y=v=>B-v/85*(B-T);
    [0,20,40,60,80].forEach(v=>s+=line(40,Y(v),680,Y(v),'#1d1d1d',1)+tx(34,Y(v)+4,v+'%',{s:12,f:GRAY,a:'end'}));
    A.forEach(([n,h,l],i)=>{const x=60+i*104;s+=rect(x,Y(h),40,B-Y(h),HUMC)+rect(x+44,Y(l),40,B-Y(l),LEXC)+tx(x+20,Y(h)-6,Math.round(h)+'%',{s:12.5,f:'#fff'})+tx(x+64,Y(l)-6,l+'%',{s:12.5,f:'#fff'})+tx(x+42,B+20,n,{s:12.5,f:'#ddd'})});
    s+=line(40,B,680,B,'#777',1.2)+rect(470,2,12,12,HUMC)+tx(488,13,'persone',{s:12.5,f:'#ddd',a:'start'})+rect(570,2,12,12,LEXC)+tx(588,13,'dizionario',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b15air'),700,236,s,'Quota di tweet negativi per compagnia','44rem');
  })();
  /* topics negative share */
  (function(){
    const Tp=[['Ritardi e cancellazioni',72,36],['Attesa al telefono e riprenotazioni',70,24],['Assistenza e personale',67,38],['Bagagli',61,31],['Posti, miglia e upgrade',56,24],['Complimenti e promozioni',22,10]];
    let s='';const L=250,X=v=>L+v/80*400;Tp.forEach(([n,h,l],i)=>{const y=10+i*44;s+=tx(L-10,y+22,n,{s:12.5,f:'#ddd',a:'end'})+rect(L,y+4,X(h)-L,16,HUMC)+rect(L,y+22,X(l)-L,14,LEXC)+tx(X(h)+6,y+17,h+'%',{s:12,f:'#fff',a:'start'})+tx(X(l)+6,y+34,l+'%',{s:12,f:'#fff',a:'start'})});
    s+=rect(L,Tp.length*44+18,12,12,HUMC)+tx(L+18,Tp.length*44+29,'persone',{s:12.5,f:'#ddd',a:'start'})+rect(L+110,Tp.length*44+18,12,12,LEXC)+tx(L+128,Tp.length*44+29,'dizionario',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b15topic'),700,Tp.length*44+40,s,'Quota di tweet negativi per topic','44rem');
  })();
};
QZ['15a']=()=>[{q:'Il tweet «still no response from AA. great job guys!» contiene la parola «great». Che cosa conclude un dizionario, e perché sbaglia?',o:['Negativo: riconosce l\'ironia','Positivo: conta «great» e non vede l\'ironia','Neutro: non conosce «AA»','Non lo classifica: è troppo corto'],a:1,
  e:'Un dizionario conta le parole positive e negative senza contesto: «great» lo fa pendere verso il positivo, ma è ironico.',h:'Che cosa conta un dizionario?'}];
QZ['15b']=()=>[{q:'Un tweet ha 3 parole positive e 1 negativa del lessico. Quanto vale il punteggio del dizionario, e quale classe ne esce?',o:['0,75, positive','0,5, positive','2, positive','−0,5, negative'],a:1,
  e:'(3 − 1) / (3 + 1) = 2 / 4 = 0,5: maggiore di zero, quindi «positive».',h:'(positive − negative) / (positive + negative).'}];
QZ['15c']=()=>[{q:'Se il dizionario sottostima la negatività di tutte le compagnie, perché può ancora servire per un indicatore mensile del marchio?',o:['Perché il livello assoluto è giusto','Perché ordina le compagnie quasi come le persone (correlazione di rango 0,94): contano tendenza e classifica','Perché è più accurato della random forest','Non serve a nulla'],a:1,
  e:'Per confrontare concorrenti e seguire la tendenza conta l\'ordine, non il livello: e l\'ordine è quasi lo stesso degli annotatori.',h:'Guarda la figura delle compagnie.'}];
QZ['15d']=()=>[{q:'Quale risultato della lezione permette a un manager di agire, oltre a sapere che i clienti sono scontenti?',o:['L\'accuratezza del dizionario','Topic incrociati con il sentiment: che cosa non piace, e a chi','Il numero di termini nel bag of words','Il numero di iterazioni dell\'LDA'],a:1,
  e:'Topic per sentiment dice quali temi sono più negativi e per quale compagnia: un problema proprio o di tutto il settore.',h:'Rileggi la frase dopo la tabella dei topic per compagnia.'}];
QZ['15']=()=>[
  {q:'Su 14.485 tweet il dizionario ne classifica bene 3.720 negativi, 2.034 neutri e 1.516 positivi. Qual è la sua accuratezza?',o:['circa 26%','circa 50%','circa 63%','circa 74%'],a:1,
   e:'(3.720 + 2.034 + 1.516) / 14.485 = 7.270 / 14.485 ≈ 0,50.',h:'Somma la diagonale e dividi per il totale.'},
  {q:'Perché il workflow sostituisce «Cancelled Flightled» con «cancelled» prima di tutto il resto?',o:['Per accorciare i tweet','Perché l\'artefatto crea parole finte e fa trapelare nel testo l\'etichetta del motivo: un leakage','Perché KNIME non accetta le maiuscole','Per tradurre i tweet'],a:1,
   e:'Le etichette «Late Flight» e «Cancelled Flight» erano state scritte dentro 1.408 tweet: un modello avrebbe imparato l\'etichetta, non il linguaggio dei clienti.',h:'Ricorda la lezione 14 sulle colonne che conoscono la risposta.'},
  {q:'In quale ordine conviene applicare Dictionary Tagger e Stop Word Filter?',o:['Prima le parole vuote, poi il tagger','Prima il tagger, poi le parole vuote, altrimenti «not» e «no» spariscono','L\'ordine non conta','Il tagger non serve se si tolgono le parole vuote'],a:1,
   e:'Le liste di parole vuote contengono negazioni come «not» e «no», che contano per il sentiment: vanno marcate prima.',h:'Che cosa c\'è nelle liste di parole vuote?'},
  {q:'Quale differenza fra bag of words ed embedding è corretta?',o:['Il bag of words conserva l\'ordine delle parole','Negli embedding parole con significati simili hanno vettori vicini; nel bag of words i sinonimi sono colonne senza legame','Gli embedding sono più trasparenti','Il bag of words richiede un modello pre-addestrato'],a:1,
   e:'Il bag of words è trasparente e sparso, con una colonna per parola; gli embedding sono vettori densi in cui la vicinanza riflette il significato.',h:'Guarda i due riquadri della figura.'},
  {q:'Nel Topic Extractor si impostano α = 0,1 e β = 0,01. Che cosa vogliono dire valori così piccoli?',o:['Molti topic per tweet e molte parole per topic','Pochi topic per tweet e poche parole per topic','Pochi tweet per topic','Che le iterazioni sono poche'],a:1,
   e:'α piccolo concentra ogni documento su pochi topic, β piccolo concentra ogni topic su poche parole: adatto a tweet brevi e topic leggibili.',h:'α riguarda i documenti, β i topic.'},
  {q:'La random forest arriva al 74% di accuratezza contro il 50% del dizionario. Qual è il prezzo principale?',o:['È più lenta da eseguire su un tweet','Servono migliaia di tweet etichettati da persone, e va riaddestrata quando il linguaggio cambia','Non si può usare in KNIME','Non funziona sui tweet negativi'],a:1,
   e:'Il machine learning supervisionato impara il dominio dalle etichette umane: senza etichette non si addestra, e invecchia con il linguaggio.',h:'Riguarda la riga «Etichette necessarie» della tabella dei tre metodi.'}
];
MAPPA[15]={c:'Come si trasformano le parole in numeri?',r:[
  {t:'Perché il testo',c:BLUE,v:['I clienti spiegano a parole','Sentiment, topic, classificazione, entità','Uber COTA: 90% dei ticket']},
  {t:'Difficoltà',c:RED,v:['Ambiguità, dominio, negazione','Ironia, rumore, contesto','Artefatti nei dati: leggere i testi grezzi']},
  {t:'Rappresentazioni',c:TEAL,v:['Bag of words: trasparente, sparso','Embedding: significati vicini','Preprocessing: l\'ordine conta']},
  {t:'Sentiment',c:YEL,v:['Dizionario: 50%, κ 0,27','Random forest: 74%, κ 0,48','LLM: senza etichette, da controllare']},
  {t:'Topic',c:PINK,v:['LDA: documenti come miscugli di topic','k, α, β; i nomi li diamo noi','Sei topic come i motivi degli annotatori']},
  {t:'Decidere',c:GRN,v:['Topic per sentiment, per compagnia','Smistare, seguire, correggere la causa','Quali 50 tweet leggere oggi']}]};

/* Lezione 16: image analytics classica, ispezione dei pezzi di fonderia (casting) */
const IMG16={"ok":{"f":"cast_ok_0_2816.png","t":116,"n":2,"g":[[[0,24,14],[24,33,13],[57,7,14]],[[0,24,14],[24,33,13],[57,7,14]],[[0,22,14],[22,37,13],[59,5,14]],[[0,20,14],[20,39,13],[59,5,14]],[[0,17,14],[17,43,13],[60,4,14]],[[0,17,14],[17,43,13],[60,4,14]],[[0,16,14],[16,6,13],[22,1,12],[23,1,11],[24,4,10],[28,8,11],[36,2,12],[38,23,13],[61,3,14]],[[0,12,14],[12,1,13],[13,1,14],[14,5,13],[19,1,12],[20,1,10],[21,3,9],[24,2,8],[26,2,9],[28,7,10],[35,4,9],[39,1,10],[40,1,11],[41,1,12],[42,21,13],[63,1,14]],[[0,8,14],[8,2,13],[10,1,14],[11,5,13],[16,1,12],[17,1,11],[18,1,10],[19,1,9],[20,7,8],[27,1,9],[28,7,10],[35,4,9],[39,2,8],[41,1,9],[42,1,10],[43,1,11],[44,1,12],[45,19,13]],[[0,7,14],[7,2,13],[9,1,14],[10,4,13],[14,1,12],[15,1,11],[16,2,9],[18,9,8],[27,1,9],[28,7,10],[35,3,9],[38,6,8],[44,1,9],[45,1,11],[46,1,12],[47,17,13]],[[0,7,14],[7,6,13],[13,1,11],[14,2,9],[16,11,8],[27,1,9],[28,7,10],[35,3,9],[38,8,8],[46,1,9],[47,1,11],[48,16,13]],[[0,6,14],[6,5,13],[11,1,12],[12,1,10],[13,1,9],[14,13,8],[27,1,9],[28,7,10],[35,2,9],[37,10,8],[47,1,9],[48,1,10],[49,1,12],[50,14,13]],[[0,6,14],[6,4,13],[10,1,12],[11,1,10],[12,2,9],[14,14,8],[28,7,10],[35,3,9],[38,9,8],[47,2,9],[49,1,10],[50,1,12],[51,13,13]],[[0,6,14],[6,3,13],[9,1,12],[10,1,10],[11,4,9],[15,13,8],[28,2,10],[30,1,11],[31,4,10],[35,2,9],[37,9,8],[46,4,9],[50,1,10],[51,1,12],[52,12,13]],[[0,4,14],[4,4,13],[8,1,12],[9,1,10],[10,5,9],[15,13,8],[28,1,9],[29,1,10],[30,2,11],[32,3,10],[35,2,9],[37,9,8],[46,4,9],[50,2,10],[52,1,12],[53,11,13]],[[0,4,14],[4,3,13],[7,1,12],[8,1,10],[9,7,9],[16,8,8],[24,4,7],[28,1,9],[29,3,11],[32,2,10],[34,2,9],[36,9,8],[45,4,9],[49,4,10],[53,1,12],[54,10,13]],[[0,4,14],[4,2,13],[6,1,12],[7,2,10],[9,7,9],[16,6,8],[22,1,7],[23,2,8],[25,2,9],[27,1,11],[28,5,13],[33,1,12],[34,1,11],[35,1,9],[36,1,8],[37,4,7],[41,4,8],[45,4,9],[49,5,10],[54,1,11],[55,3,13],[58,1,12],[59,5,13]],[[0,4,14],[4,2,13],[6,1,11],[7,3,10],[10,7,9],[17,4,8],[21,2,9],[23,1,10],[24,4,9],[28,4,10],[32,2,11],[34,2,12],[36,1,11],[37,1,9],[38,1,8],[39,1,6],[40,2,7],[42,2,8],[44,5,9],[49,4,10],[53,1,9],[54,1,10],[55,1,12],[56,2,13],[58,3,12],[61,3,13]],[[0,4,14],[4,1,13],[5,1,11],[6,5,10],[11,6,9],[17,2,8],[19,4,9],[23,5,8],[28,8,9],[36,3,10],[39,1,8],[40,2,7],[42,2,8],[44,3,9],[47,4,10],[51,2,9],[53,3,10],[56,1,12],[57,1,13],[58,4,12],[62,2,13]],[[0,4,14],[4,1,12],[5,7,10],[12,6,9],[18,1,10],[19,2,9],[21,3,8],[24,1,7],[25,1,6],[26,1,5],[27,1,4],[28,3,5],[31,2,6],[33,1,7],[34,4,8],[38,1,9],[39,2,10],[41,1,9],[42,1,8],[43,3,9],[46,3,10],[49,3,9],[52,2,10],[54,2,9],[56,1,10],[57,1,12],[58,1,13],[59,3,12],[62,2,13]],[[0,3,14],[3,1,13],[4,1,11],[5,7,10],[12,4,9],[16,2,10],[18,1,9],[19,2,8],[21,1,7],[22,1,5],[23,1,3],[24,1,2],[25,1,3],[26,8,2],[34,1,3],[35,1,5],[36,1,7],[37,3,8],[40,1,10],[41,2,11],[43,1,10],[44,1,9],[45,3,10],[48,9,9],[57,1,11],[58,5,12],[63,1,13]],[[0,3,14],[3,1,13],[4,2,11],[6,10,10],[16,2,9],[18,1,8],[19,1,7],[20,1,4],[21,11,2],[32,4,3],[36,1,4],[37,1,6],[38,2,8],[40,1,9],[41,1,10],[42,2,12],[44,1,11],[45,2,10],[47,2,9],[49,1,10],[50,7,9],[57,1,10],[58,1,12],[59,1,13],[60,4,12]],[[0,3,14],[3,1,12],[4,3,11],[7,9,10],[16,1,9],[17,1,8],[18,1,6],[19,1,3],[20,12,2],[32,2,3],[34,3,2],[37,1,3],[38,1,4],[39,1,6],[40,2,9],[42,1,10],[43,1,12],[44,1,13],[45,1,11],[46,2,9],[48,1,10],[49,8,9],[57,1,10],[58,1,11],[59,5,12]],[[0,2,14],[2,1,13],[3,6,11],[9,4,10],[13,1,11],[14,1,10],[15,1,9],[16,1,8],[17,1,5],[18,3,2],[21,1,1],[22,6,2],[28,4,1],[32,8,2],[40,1,5],[41,2,9],[43,1,10],[44,2,12],[46,1,10],[47,8,9],[55,4,10],[59,5,12]],[[0,2,14],[2,1,13],[3,7,11],[10,2,10],[12,1,11],[13,1,10],[14,2,9],[16,1,5],[17,8,2],[25,2,1],[27,1,2],[28,10,1],[38,3,2],[41,1,5],[42,2,9],[44,1,10],[45,2,12],[47,1,9],[48,1,8],[49,6,9],[55,4,10],[59,1,11],[60,4,12]],[[0,2,14],[2,1,12],[3,10,11],[13,1,10],[14,1,9],[15,1,6],[16,8,2],[24,2,1],[26,7,2],[33,7,1],[40,2,2],[42,1,5],[43,2,9],[45,1,10],[46,1,11],[47,1,10],[48,6,9],[54,6,10],[60,4,12]],[[0,2,14],[2,1,12],[3,8,11],[11,1,12],[12,1,11],[13,1,10],[14,1,7],[15,1,4],[16,9,2],[25,1,3],[26,1,5],[27,1,7],[28,3,9],[31,1,7],[32,1,4],[33,4,2],[37,3,1],[40,3,2],[43,1,6],[44,2,9],[46,2,11],[48,1,10],[49,4,9],[53,6,10],[59,1,11],[60,4,12]],[[0,1,14],[1,1,13],[2,3,12],[5,5,11],[10,2,12],[12,1,10],[13,1,9],[14,1,4],[15,6,2],[21,1,1],[22,1,2],[23,1,4],[24,1,7],[25,3,9],[28,4,10],[32,1,9],[33,1,7],[34,1,4],[35,3,2],[38,3,1],[41,3,2],[44,1,8],[45,1,9],[46,1,10],[47,2,11],[49,3,9],[52,5,10],[57,2,11],[59,5,12]],[[0,1,14],[1,1,13],[2,9,12],[11,1,11],[12,1,10],[13,1,7],[14,8,2],[22,1,5],[23,3,9],[26,2,8],[28,3,9],[31,1,8],[32,2,9],[34,1,10],[35,1,6],[36,1,3],[37,3,2],[40,1,1],[41,3,2],[44,1,5],[45,1,9],[46,1,10],[47,2,11],[49,4,10],[53,7,11],[60,4,12]],[[0,1,14],[1,1,13],[2,9,12],[11,1,11],[12,1,10],[13,1,5],[14,7,2],[21,1,5],[22,3,9],[25,3,7],[28,4,8],[32,2,9],[34,1,10],[35,1,11],[36,1,7],[37,1,3],[38,7,2],[45,1,8],[46,2,10],[48,1,11],[49,1,12],[50,11,11],[61,3,12]],[[0,1,14],[1,1,13],[2,9,12],[11,1,11],[12,1,9],[13,1,4],[14,1,2],[15,1,1],[16,4,2],[20,1,4],[21,3,9],[24,1,7],[25,1,5],[26,1,6],[27,1,7],[28,5,8],[33,2,9],[35,2,10],[37,1,5],[38,1,3],[39,6,2],[45,1,6],[46,2,10],[48,2,12],[50,4,11],[54,7,10],[61,1,11],[62,2,12]],[[0,1,14],[1,1,13],[2,7,12],[9,1,13],[10,1,12],[11,1,11],[12,1,8],[13,1,3],[14,2,1],[16,4,2],[20,1,8],[21,1,10],[22,1,9],[23,1,7],[24,2,5],[26,2,7],[28,6,8],[34,3,10],[37,1,9],[38,1,3],[39,6,2],[45,1,4],[46,2,10],[48,2,11],[50,11,10],[61,1,11],[62,1,12],[63,1,13]],[[0,1,14],[1,2,13],[3,5,12],[8,2,13],[10,1,12],[11,1,11],[12,1,7],[13,6,2],[19,1,4],[20,2,10],[22,1,9],[23,1,6],[24,1,5],[25,1,6],[26,2,7],[28,6,8],[34,1,9],[35,3,10],[38,1,5],[39,6,2],[45,1,3],[46,1,9],[47,1,10],[48,2,11],[50,1,10],[51,1,9],[52,9,10],[61,1,11],[62,2,12]],[[0,1,14],[1,9,13],[10,1,12],[11,1,11],[12,1,7],[13,6,2],[19,1,5],[20,1,11],[21,1,10],[22,1,8],[23,1,5],[24,1,4],[25,1,5],[26,2,7],[28,7,8],[35,1,10],[36,2,11],[38,1,6],[39,1,3],[40,6,2],[46,1,8],[47,2,10],[49,1,11],[50,11,10],[61,1,11],[62,2,12]],[[0,1,14],[1,8,13],[9,1,14],[10,1,12],[11,1,11],[12,1,7],[13,5,2],[18,1,3],[19,1,6],[20,1,11],[21,1,10],[22,1,7],[23,3,5],[26,1,6],[27,8,7],[35,1,9],[36,2,11],[38,1,7],[39,1,3],[40,6,2],[46,1,8],[47,1,10],[48,3,11],[51,10,10],[61,1,11],[62,2,12]],[[0,1,14],[1,9,13],[10,1,12],[11,1,11],[12,1,7],[13,1,3],[14,5,2],[19,1,5],[20,1,11],[21,1,10],[22,1,8],[23,1,6],[24,1,5],[25,1,4],[26,1,5],[27,2,6],[29,5,7],[34,1,6],[35,1,9],[36,2,10],[38,1,7],[39,1,3],[40,6,2],[46,1,7],[47,1,10],[48,3,11],[51,10,10],[61,1,11],[62,2,12]],[[0,2,14],[2,9,13],[11,1,11],[12,1,8],[13,1,3],[14,5,2],[19,1,4],[20,2,10],[22,1,9],[23,1,6],[24,1,5],[25,2,4],[27,2,5],[29,6,6],[35,1,9],[36,2,10],[38,1,6],[39,7,2],[46,1,8],[47,1,10],[48,3,11],[51,10,10],[61,1,11],[62,2,12]],[[0,2,14],[2,9,13],[11,1,11],[12,1,9],[13,1,4],[14,1,2],[15,1,1],[16,4,2],[20,1,9],[21,2,10],[23,1,8],[24,1,6],[25,1,5],[26,3,4],[29,6,5],[35,3,10],[38,1,4],[39,7,2],[46,1,8],[47,1,10],[48,2,11],[50,11,10],[61,1,11],[62,2,12]],[[0,2,14],[2,9,13],[11,1,11],[12,1,10],[13,1,6],[14,1,3],[15,1,2],[16,1,1],[17,3,2],[20,1,5],[21,2,10],[23,1,9],[24,1,7],[25,1,6],[26,1,4],[27,3,3],[30,4,4],[34,1,7],[35,2,10],[37,1,8],[38,1,3],[39,3,2],[42,1,3],[43,1,2],[44,1,1],[45,1,3],[46,1,9],[47,2,10],[49,1,11],[50,11,10],[61,1,11],[62,2,12]],[[0,2,15],[2,6,13],[8,2,12],[10,1,13],[11,1,12],[12,1,11],[13,1,8],[14,2,3],[16,5,2],[21,1,7],[22,2,10],[24,1,9],[25,1,7],[26,2,5],[28,2,4],[30,2,3],[32,1,4],[33,1,6],[34,1,9],[35,1,10],[36,1,9],[37,1,4],[38,4,2],[42,1,3],[43,1,2],[44,1,1],[45,1,4],[46,2,10],[48,2,11],[50,11,10],[61,1,11],[62,2,12]],[[0,2,15],[2,1,14],[3,4,13],[7,4,12],[11,1,13],[12,1,11],[13,1,9],[14,1,5],[15,2,2],[17,1,3],[18,3,2],[21,1,3],[22,1,7],[23,1,10],[24,2,9],[26,3,8],[29,1,7],[30,1,6],[31,1,7],[32,1,8],[33,1,9],[34,1,10],[35,1,9],[36,1,5],[37,4,2],[41,2,3],[43,1,2],[44,1,1],[45,1,7],[46,2,10],[48,2,11],[50,11,10],[61,3,12]],[[0,3,14],[3,1,13],[4,7,12],[11,1,13],[12,1,11],[13,1,10],[14,1,8],[15,1,3],[16,6,2],[22,1,3],[23,1,6],[24,3,9],[27,2,10],[29,5,9],[34,1,8],[35,1,5],[36,5,2],[41,2,3],[43,1,1],[44,1,3],[45,1,9],[46,2,10],[48,1,11],[49,11,10],[60,2,11],[62,2,12]],[[0,1,15],[1,2,14],[3,1,13],[4,6,12],[10,1,11],[11,2,12],[13,1,11],[14,1,10],[15,1,6],[16,1,3],[17,2,1],[19,4,2],[23,1,3],[24,1,4],[25,1,6],[26,1,8],[27,5,9],[32,1,8],[33,1,6],[34,1,3],[35,5,2],[40,2,3],[42,1,2],[43,1,1],[44,1,7],[45,2,10],[47,2,11],[49,11,10],[60,3,11],[63,1,12]],[[0,1,15],[1,3,14],[4,5,12],[9,3,11],[12,1,12],[13,1,11],[14,1,10],[15,1,9],[16,1,5],[17,1,2],[18,4,1],[22,4,2],[26,1,3],[27,1,4],[28,3,5],[31,1,4],[32,1,3],[33,7,2],[40,2,3],[42,1,2],[43,1,4],[44,3,10],[47,1,11],[48,12,10],[60,3,11],[63,1,12]],[[0,1,15],[1,3,14],[4,1,13],[5,3,12],[8,7,11],[15,1,10],[16,1,9],[17,1,5],[18,1,2],[19,5,1],[24,8,2],[32,4,3],[36,3,2],[39,3,3],[42,1,4],[43,1,9],[44,15,10],[59,4,11],[63,1,12]],[[0,1,15],[1,3,14],[4,1,13],[5,2,12],[7,8,11],[15,2,10],[17,1,9],[18,1,5],[19,1,2],[20,4,1],[24,9,2],[33,2,3],[35,4,2],[39,2,3],[41,1,5],[42,1,8],[43,16,10],[59,4,11],[63,1,12]],[[0,1,15],[1,4,14],[5,1,12],[6,6,11],[12,3,10],[15,1,11],[16,2,10],[18,1,9],[19,1,6],[20,1,3],[21,13,2],[34,2,1],[36,3,2],[39,1,3],[40,1,6],[41,2,9],[43,16,10],[59,3,11],[62,2,12]],[[0,1,15],[1,5,14],[6,1,12],[7,5,11],[12,6,10],[18,2,9],[20,1,7],[21,1,4],[22,1,3],[23,9,2],[32,5,1],[37,1,2],[38,1,4],[39,1,7],[40,2,9],[42,16,10],[58,3,11],[61,3,12]],[[0,2,15],[2,4,14],[6,1,13],[7,4,11],[11,8,10],[19,2,9],[21,1,8],[22,1,7],[23,1,5],[24,1,4],[25,2,3],[27,2,2],[29,5,1],[34,2,2],[36,1,4],[37,1,6],[38,1,8],[39,3,9],[42,2,10],[44,2,9],[46,12,10],[58,3,11],[61,3,12]],[[0,2,15],[2,5,14],[7,1,12],[8,2,11],[10,6,10],[16,9,9],[25,1,8],[26,1,6],[27,2,5],[29,1,4],[30,2,3],[32,1,4],[33,1,5],[34,1,6],[35,1,8],[36,10,9],[46,11,10],[57,3,11],[60,4,12]],[[0,3,15],[3,4,14],[7,1,13],[8,1,12],[9,1,11],[10,5,10],[15,11,9],[26,3,10],[29,1,9],[30,2,8],[32,16,9],[48,8,10],[56,3,11],[59,5,12]],[[0,3,15],[3,5,14],[8,1,13],[9,1,11],[10,5,10],[15,24,9],[39,3,8],[42,7,9],[49,6,10],[55,3,11],[58,6,12]],[[0,4,15],[4,5,14],[9,1,13],[10,1,11],[11,3,10],[14,22,9],[36,7,8],[43,7,9],[50,4,10],[54,3,11],[57,7,12]],[[0,3,15],[3,7,14],[10,1,13],[11,1,11],[12,3,10],[15,6,9],[21,1,8],[22,7,9],[29,14,8],[43,8,9],[51,2,10],[53,2,11],[55,9,12]],[[0,3,15],[3,8,14],[11,1,13],[12,1,12],[13,2,10],[15,15,9],[30,13,8],[43,8,9],[51,1,10],[52,2,11],[54,10,12]],[[0,4,15],[4,9,14],[13,1,12],[14,1,10],[15,15,9],[30,13,8],[43,7,9],[50,1,10],[51,3,11],[54,10,12]],[[0,4,15],[4,10,14],[14,1,13],[15,1,11],[16,1,10],[17,14,9],[31,13,8],[44,5,9],[49,3,11],[52,1,12],[53,1,11],[54,9,12],[63,1,13]],[[0,5,15],[5,10,14],[15,2,13],[17,1,11],[18,13,9],[31,13,8],[44,3,9],[47,1,10],[48,1,11],[49,13,12],[62,2,13]],[[0,5,15],[5,12,14],[17,1,13],[18,1,12],[19,1,11],[20,1,10],[21,10,9],[31,12,8],[43,2,9],[45,1,10],[46,1,11],[47,14,12],[61,3,13]],[[0,5,15],[5,12,14],[17,4,13],[21,1,12],[22,1,11],[23,1,10],[24,7,9],[31,8,8],[39,3,9],[42,1,10],[43,2,11],[45,15,12],[60,4,13]],[[0,5,15],[5,12,14],[17,6,13],[23,2,12],[25,1,11],[26,3,10],[29,9,9],[38,2,10],[40,2,11],[42,18,12],[60,4,13]],[[0,5,15],[5,12,14],[17,10,13],[27,30,12],[57,7,13]],[[0,5,15],[5,12,14],[17,20,13],[37,1,12],[38,2,13],[40,5,12],[45,3,13],[48,2,12],[50,14,13]],[[0,5,15],[5,12,14],[17,20,13],[37,1,12],[38,2,13],[40,2,12],[42,1,13],[43,1,12],[44,20,13]]],"m":[[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,50,1],[56,72,1]],[[0,47,1],[51,77,1]],[[0,45,1],[47,26,1],[76,1,1],[79,49,1]],[[0,42,1],[44,31,1],[80,48,1]],[[0,78,1],[81,47,1]],[[0,79,1],[83,45,1]],[[0,82,1],[83,45,1]],[[0,54,1],[60,68,1]],[[0,48,1],[67,61,1]],[[0,45,1],[70,58,1]],[[0,43,1],[73,55,1]],[[0,41,1],[75,53,1]],[[0,39,1],[76,52,1]],[[0,37,1],[78,50,1]],[[0,36,1],[80,48,1]],[[0,35,1],[81,47,1]],[[0,34,1],[82,46,1]],[[0,33,1],[83,45,1]],[[0,32,1],[84,44,1]],[[0,31,1],[85,43,1]],[[0,30,1],[86,42,1]],[[0,30,1],[57,1,2],[87,41,1]],[[0,29,1],[52,12,2],[87,41,1]],[[0,29,1],[49,17,2],[88,40,1]],[[0,28,1],[47,21,2],[89,39,1]],[[0,28,1],[46,24,2],[89,39,1]],[[0,27,1],[45,26,2],[90,38,1]],[[0,27,1],[44,9,2],[54,18,2],[90,38,1]],[[0,26,1],[43,8,2],[54,19,2],[91,37,1]],[[0,26,1],[42,7,2],[53,21,2],[91,37,1]],[[0,26,1],[41,7,2],[53,21,2],[91,37,1]],[[0,26,1],[41,7,2],[52,23,2],[92,36,1]],[[0,25,1],[40,7,2],[52,24,2],[92,36,1]],[[0,25,1],[40,6,2],[52,24,2],[92,36,1]],[[0,25,1],[40,6,2],[52,24,2],[92,36,1]],[[0,25,1],[39,6,2],[52,24,2],[93,35,1]],[[0,25,1],[39,6,2],[52,25,2],[93,35,1]],[[0,25,1],[39,6,2],[54,23,2],[93,35,1]],[[0,25,1],[39,6,2],[57,13,2],[71,6,2],[93,35,1]],[[0,25,1],[39,6,2],[58,1,2],[62,4,2],[71,6,2],[93,35,1]],[[0,25,1],[39,6,2],[71,6,2],[93,35,1]],[[0,25,1],[40,6,2],[71,6,2],[93,35,1]],[[0,26,1],[40,6,2],[71,6,2],[93,35,1]],[[0,26,1],[40,7,2],[70,7,2],[93,35,1]],[[0,26,1],[41,7,2],[70,6,2],[92,36,1]],[[0,26,1],[41,9,2],[69,7,2],[92,36,1]],[[0,27,1],[42,8,2],[69,6,2],[92,36,1]],[[0,27,1],[42,8,2],[68,7,2],[92,36,1]],[[0,27,1],[43,8,2],[66,8,2],[91,37,1]],[[0,28,1],[44,10,2],[56,1,2],[65,8,2],[91,37,1]],[[0,28,1],[45,27,2],[91,37,1]],[[0,29,1],[46,25,2],[90,38,1]],[[0,30,1],[48,22,2],[90,38,1]],[[0,30,1],[50,18,2],[89,39,1]],[[0,31,1],[52,13,2],[89,39,1]],[[0,32,1],[57,4,2],[88,40,1]],[[0,33,1],[87,41,1]],[[0,34,1],[86,42,1]],[[0,35,1],[85,43,1]],[[0,35,1],[85,43,1]],[[0,37,1],[83,45,1]],[[0,38,1],[82,46,1]],[[0,39,1],[81,47,1]],[[0,40,1],[79,49,1]],[[0,42,1],[78,50,1]],[[0,44,1],[76,52,1]],[[0,47,1],[74,54,1]],[[0,50,1],[71,57,1]],[[0,56,1],[67,61,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]]],"h":[0,8,47,521,823,347,222,147,78,79,69,56,64,78,103,124,481,1046,1144,1039,1356,988,500,578,655,867,1482,1236,1358,543,338,7],"v":[0.0,0.0,0.0,8.6,14.0,30.7,97.6,266.4,827.2,1367.0,1679.8,1874.9,2032.7,2151.9,2241.8,2303.8,2358.7,2393.0,2417.1,2443.9,2465.0,2486.4,2497.9,2510.8,2518.7,2527.8,2535.5,2540.3,2543.8,2545.4,2544.4,2539.6,2529.5,2497.6,2451.3,2385.3,2332.9,2297.1,2269.5,2237.0,2200.3,2153.7,2110.1,2069.9,2043.5,2013.1,1981.4,1937.2,1872.8,1805.6,1714.3,1615.0,1466.2,1239.3,1060.1,908.9,682.4,459.1,285.6,198.4,113.3,25.3,2.3,1.0]},"def":{"f":"cast_def_0_4125.png","t":152,"n":6,"g":[[[0,22,14],[22,5,13],[27,1,14],[28,23,13],[51,13,14]],[[0,21,14],[21,4,13],[25,1,12],[26,2,11],[28,5,10],[33,1,9],[34,2,10],[36,1,11],[37,2,12],[39,13,13],[52,12,14]],[[0,17,14],[17,3,13],[20,1,12],[21,1,11],[22,3,9],[25,3,8],[28,1,9],[29,1,8],[30,2,9],[32,1,8],[33,5,7],[38,1,8],[39,1,9],[40,1,11],[41,1,12],[42,10,13],[52,12,14]],[[0,17,14],[17,1,13],[18,1,12],[19,1,10],[20,1,8],[21,2,6],[23,1,7],[24,4,8],[28,1,9],[29,3,8],[32,1,7],[33,1,8],[34,7,7],[41,1,8],[42,1,9],[43,1,11],[44,8,13],[52,12,14]],[[0,14,14],[14,2,13],[16,1,12],[17,1,10],[18,1,7],[19,4,6],[23,2,7],[25,2,8],[27,1,9],[28,2,8],[30,2,7],[32,1,8],[33,4,7],[37,3,6],[40,4,7],[44,1,9],[45,1,12],[46,7,13],[53,11,14]],[[0,12,14],[12,3,13],[15,1,11],[16,1,8],[17,1,7],[18,5,6],[23,2,7],[25,4,8],[29,1,9],[30,3,8],[33,3,7],[36,6,6],[42,3,7],[45,1,8],[46,1,10],[47,7,13],[54,10,14]],[[0,11,14],[11,2,13],[13,1,12],[14,1,9],[15,3,7],[18,6,6],[24,1,7],[25,5,8],[30,1,9],[31,1,8],[32,3,7],[35,8,6],[43,4,7],[47,1,9],[48,1,12],[49,6,13],[55,9,14]],[[0,10,14],[10,2,13],[12,1,11],[13,1,8],[14,4,7],[18,7,6],[25,1,7],[26,3,8],[29,1,7],[30,2,8],[32,2,7],[34,9,6],[43,4,7],[47,2,8],[49,1,11],[50,7,13],[57,2,14],[59,1,13],[60,4,14]],[[0,8,14],[8,3,13],[11,1,11],[12,1,7],[13,12,6],[25,1,7],[26,4,8],[30,5,7],[35,9,6],[44,3,7],[47,3,8],[50,1,11],[51,12,13],[63,1,14]],[[0,8,14],[8,2,13],[10,1,11],[11,1,7],[12,8,6],[20,1,5],[21,5,6],[26,1,8],[27,3,9],[30,3,8],[33,3,7],[36,2,6],[38,3,5],[41,3,6],[44,3,7],[47,4,8],[51,1,11],[52,12,13]],[[0,7,14],[7,2,13],[9,1,11],[10,1,8],[11,1,7],[12,6,6],[18,3,5],[21,5,6],[26,1,8],[27,5,9],[32,1,8],[33,3,7],[36,8,6],[44,3,7],[47,4,8],[51,1,9],[52,1,11],[53,11,13]],[[0,6,14],[6,2,13],[8,1,12],[9,1,8],[10,1,7],[11,6,6],[17,4,5],[21,4,6],[25,1,7],[26,1,10],[27,6,11],[33,1,10],[34,1,9],[35,1,8],[36,1,7],[37,7,6],[44,3,7],[47,6,8],[53,1,11],[54,10,13]],[[0,6,14],[6,2,13],[8,1,9],[9,2,7],[11,7,6],[18,2,5],[20,3,6],[23,1,7],[24,2,8],[26,1,9],[27,2,8],[29,4,7],[33,1,8],[34,1,9],[35,2,10],[37,1,9],[38,1,7],[39,4,6],[43,4,7],[47,7,8],[54,1,12],[55,9,13]],[[0,6,14],[6,1,13],[7,1,10],[8,3,7],[11,10,6],[21,2,7],[23,4,6],[27,2,7],[29,2,6],[31,1,7],[32,4,6],[36,1,7],[37,1,8],[38,2,9],[40,1,8],[41,6,7],[47,7,8],[54,1,9],[55,1,12],[56,8,13]],[[0,4,14],[4,1,13],[5,1,14],[6,1,12],[7,1,8],[8,4,7],[12,7,6],[19,1,7],[20,1,8],[21,1,6],[22,4,5],[26,2,4],[28,5,3],[33,1,4],[34,1,5],[35,3,6],[38,1,7],[39,1,8],[40,2,10],[42,2,8],[44,6,7],[50,5,8],[55,1,10],[56,8,13]],[[0,5,14],[5,1,13],[6,1,9],[7,5,7],[12,6,6],[18,1,8],[19,1,7],[20,3,5],[23,1,4],[24,6,2],[30,5,1],[35,1,2],[36,1,4],[37,2,6],[39,1,7],[40,1,8],[41,2,11],[43,1,9],[44,3,8],[47,3,7],[50,2,8],[52,3,7],[55,1,8],[56,1,11],[57,7,13]],[[0,3,14],[3,2,13],[5,1,11],[6,1,8],[7,4,7],[11,6,6],[17,1,8],[18,1,6],[19,2,5],[21,1,4],[22,1,2],[23,2,1],[25,4,2],[29,4,1],[33,4,2],[37,1,3],[38,1,5],[39,3,7],[42,1,10],[43,1,12],[44,1,10],[45,1,9],[46,1,8],[47,9,7],[56,1,9],[57,1,12],[58,6,13]],[[0,2,14],[2,3,13],[5,1,9],[6,5,7],[11,5,6],[16,1,8],[17,1,6],[18,2,5],[20,1,3],[21,4,1],[25,3,2],[28,4,1],[32,7,2],[39,1,3],[40,1,6],[41,2,7],[43,1,10],[44,1,12],[45,1,9],[46,1,8],[47,9,7],[56,1,8],[57,1,11],[58,6,13]],[[0,2,14],[2,2,13],[4,1,12],[5,1,8],[6,5,7],[11,4,6],[15,1,8],[16,1,7],[17,1,6],[18,1,5],[19,1,3],[20,1,2],[21,3,1],[24,3,2],[27,7,1],[34,3,2],[37,3,1],[40,1,2],[41,1,6],[42,1,7],[43,1,8],[44,1,10],[45,1,11],[46,1,9],[47,1,8],[48,2,7],[50,1,6],[51,4,7],[55,2,8],[57,1,9],[58,1,12],[59,5,13]],[[0,1,14],[1,3,13],[4,1,10],[5,1,8],[6,5,7],[11,3,6],[14,1,8],[15,1,7],[16,2,6],[18,1,3],[19,2,2],[21,2,1],[23,2,2],[25,16,1],[41,1,2],[42,1,6],[43,1,7],[44,1,8],[45,1,11],[46,1,10],[47,1,8],[48,2,7],[50,2,6],[52,2,7],[54,4,8],[58,1,11],[59,5,13]],[[0,2,14],[2,2,13],[4,1,9],[5,1,8],[6,8,7],[14,1,8],[15,2,6],[17,1,4],[18,2,2],[20,8,1],[28,4,2],[32,10,1],[42,1,2],[43,2,7],[45,1,8],[46,1,11],[47,1,9],[48,2,7],[50,2,6],[52,2,7],[54,4,8],[58,1,10],[59,5,13]],[[0,2,14],[2,1,13],[3,1,12],[4,1,9],[5,1,8],[6,7,7],[13,1,8],[14,1,7],[15,1,6],[16,1,5],[17,3,2],[20,5,1],[25,1,2],[26,1,3],[27,1,5],[28,1,8],[29,2,9],[31,1,8],[32,1,6],[33,1,3],[34,1,2],[35,8,1],[43,1,4],[44,1,8],[45,1,7],[46,1,9],[47,1,10],[48,6,7],[54,4,8],[58,1,9],[59,1,12],[60,4,13]],[[0,3,14],[3,1,11],[4,1,9],[5,3,8],[8,4,7],[12,1,8],[13,1,9],[14,1,7],[15,1,6],[16,1,3],[17,2,2],[19,5,1],[24,1,3],[25,1,6],[26,8,8],[34,1,6],[35,1,3],[36,1,2],[37,7,1],[44,1,6],[45,2,8],[47,1,11],[48,1,9],[49,5,7],[54,4,8],[58,1,9],[59,1,12],[60,4,13]],[[0,3,14],[3,1,10],[4,1,9],[5,4,8],[9,3,7],[12,2,8],[14,1,7],[15,1,5],[16,4,2],[20,3,1],[23,1,3],[24,2,7],[26,3,6],[29,1,7],[30,3,6],[33,1,7],[34,2,8],[36,1,4],[37,1,2],[38,6,1],[44,1,3],[45,1,8],[46,1,7],[47,2,10],[49,1,8],[50,4,7],[54,3,8],[57,2,9],[59,1,11],[60,2,13],[62,2,12]],[[0,3,14],[3,1,10],[4,1,9],[5,4,8],[9,2,7],[11,1,8],[12,1,9],[13,2,7],[15,1,3],[16,1,1],[17,3,2],[20,2,1],[22,1,3],[23,2,7],[25,2,6],[27,5,5],[32,1,6],[33,2,7],[35,2,8],[37,1,3],[38,1,2],[39,6,1],[45,1,6],[46,2,8],[48,1,11],[49,2,8],[51,2,7],[53,1,8],[54,4,9],[58,1,10],[59,1,11],[60,1,12],[61,1,13],[62,2,12]],[[0,3,14],[3,1,10],[4,1,9],[5,7,8],[12,1,9],[13,1,7],[14,1,6],[15,1,2],[16,1,1],[17,3,2],[20,1,1],[21,1,2],[22,1,6],[23,1,7],[24,2,6],[26,7,5],[33,1,6],[34,2,7],[36,1,8],[37,1,7],[38,2,2],[40,5,1],[45,1,4],[46,2,8],[48,1,11],[49,1,10],[50,5,9],[55,1,10],[56,2,9],[58,2,10],[60,1,12],[61,1,13],[62,2,12]],[[0,2,14],[2,1,13],[3,1,10],[4,3,9],[7,4,8],[11,2,9],[13,1,7],[14,1,5],[15,2,1],[17,3,2],[20,1,1],[21,1,3],[22,1,8],[23,2,6],[25,1,5],[26,1,4],[27,7,5],[34,1,6],[35,2,7],[37,1,8],[38,1,4],[39,1,2],[40,5,1],[45,1,3],[46,2,8],[48,2,11],[50,1,10],[51,8,9],[59,1,10],[60,1,12],[61,1,13],[62,2,12]],[[0,2,14],[2,1,13],[3,1,10],[4,4,9],[8,3,8],[11,1,10],[12,1,9],[13,1,7],[14,1,4],[15,3,1],[18,2,2],[20,1,1],[21,1,6],[22,1,8],[23,1,7],[24,1,6],[25,1,4],[26,1,5],[27,4,6],[31,4,5],[35,1,6],[36,1,7],[37,1,8],[38,1,6],[39,2,2],[41,4,1],[45,1,2],[46,1,7],[47,1,8],[48,1,10],[49,1,11],[50,1,9],[51,4,8],[55,1,9],[56,2,8],[58,2,9],[60,4,12]],[[0,2,14],[2,1,13],[3,1,10],[4,4,9],[8,3,8],[11,1,10],[12,1,9],[13,1,7],[14,1,4],[15,3,1],[18,1,2],[19,1,1],[20,1,2],[21,1,8],[22,2,7],[24,1,5],[25,1,4],[26,1,5],[27,4,6],[31,5,5],[36,2,8],[38,1,7],[39,2,2],[41,4,1],[45,1,2],[46,1,7],[47,1,8],[48,1,9],[49,1,10],[50,6,7],[56,1,8],[57,1,9],[58,2,8],[60,1,11],[61,3,12]],[[0,2,14],[2,1,13],[3,1,10],[4,5,9],[9,1,8],[10,1,9],[11,1,11],[12,1,8],[13,1,7],[14,1,4],[15,5,1],[20,1,2],[21,1,9],[22,2,7],[24,1,5],[25,1,4],[26,1,5],[27,4,6],[31,5,5],[36,3,7],[39,1,3],[40,1,2],[41,4,1],[45,1,2],[46,1,6],[47,1,7],[48,1,8],[49,1,10],[50,4,7],[54,1,6],[55,1,7],[56,1,9],[57,1,8],[58,1,7],[59,1,8],[60,1,11],[61,3,12]],[[0,2,14],[2,1,13],[3,2,10],[5,6,9],[11,1,11],[12,1,9],[13,1,8],[14,1,4],[15,1,2],[16,4,1],[20,1,2],[21,1,9],[22,2,8],[24,1,6],[25,2,5],[27,3,6],[30,4,5],[34,2,4],[36,3,7],[39,1,3],[40,1,2],[41,4,1],[45,1,2],[46,1,6],[47,1,7],[48,1,8],[49,1,10],[50,1,7],[51,1,6],[52,2,7],[54,1,6],[55,1,7],[56,2,8],[58,1,7],[59,1,8],[60,1,11],[61,2,12],[63,1,13]],[[0,3,14],[3,1,11],[4,3,10],[7,4,9],[11,1,11],[12,1,9],[13,1,8],[14,1,4],[15,1,2],[16,4,1],[20,1,2],[21,3,8],[24,1,7],[25,8,5],[33,3,4],[36,2,7],[38,1,6],[39,2,2],[41,4,1],[45,1,2],[46,1,6],[47,1,7],[48,1,8],[49,1,10],[50,2,7],[52,1,6],[53,4,7],[57,3,8],[60,1,11],[61,2,12],[63,1,13]],[[0,3,14],[3,1,11],[4,4,10],[8,2,9],[10,1,10],[11,1,11],[12,1,10],[13,1,8],[14,1,5],[15,1,2],[16,5,1],[21,1,6],[22,1,9],[23,1,8],[24,1,7],[25,1,5],[26,1,4],[27,5,5],[32,3,4],[35,1,5],[36,2,7],[38,1,5],[39,1,2],[40,5,1],[45,1,2],[46,1,6],[47,1,7],[48,1,8],[49,1,9],[50,6,7],[56,4,8],[60,2,12],[62,2,13]],[[0,3,14],[3,1,12],[4,7,10],[11,2,11],[13,1,9],[14,1,7],[15,2,2],[17,4,1],[21,1,4],[22,1,9],[23,2,8],[25,1,7],[26,1,5],[27,8,4],[35,3,6],[38,1,3],[39,1,2],[40,5,1],[45,1,2],[46,1,7],[47,1,6],[48,1,9],[49,1,8],[50,4,6],[54,4,7],[58,1,8],[59,1,9],[60,2,12],[62,2,13]],[[0,3,14],[3,1,12],[4,4,11],[8,3,10],[11,2,11],[13,1,9],[14,1,8],[15,1,3],[16,1,2],[17,4,1],[21,1,2],[22,1,7],[23,1,9],[24,1,8],[25,1,9],[26,1,7],[27,1,4],[28,2,3],[30,2,4],[32,1,3],[33,1,4],[34,1,5],[35,2,6],[37,1,5],[38,1,2],[39,3,1],[42,1,2],[43,2,1],[45,1,3],[46,1,7],[47,1,6],[48,1,9],[49,1,8],[50,4,6],[54,5,7],[59,1,9],[60,2,12],[62,2,13]],[[0,3,14],[3,1,13],[4,4,11],[8,4,10],[12,1,12],[13,1,10],[14,1,9],[15,1,5],[16,2,2],[18,4,1],[22,1,2],[23,1,7],[24,1,8],[25,1,7],[26,1,8],[27,1,6],[28,3,5],[31,1,4],[32,1,5],[33,4,6],[37,1,3],[38,1,2],[39,2,1],[41,2,2],[43,2,1],[45,1,5],[46,1,6],[47,1,7],[48,1,9],[49,1,7],[50,4,6],[54,5,7],[59,1,10],[60,4,12]],[[0,4,14],[4,4,11],[8,4,10],[12,2,11],[14,1,9],[15,1,7],[16,1,3],[17,5,2],[22,1,1],[23,1,3],[24,2,7],[26,1,6],[27,2,7],[29,1,8],[30,1,9],[31,1,7],[32,3,6],[35,1,5],[36,1,3],[37,1,2],[38,2,1],[40,3,2],[43,1,1],[44,1,2],[45,2,6],[47,1,8],[48,1,9],[49,5,6],[54,5,7],[59,1,10],[60,4,12]],[[0,1,14],[1,2,15],[3,1,14],[4,1,12],[5,3,11],[8,5,10],[13,1,12],[14,1,9],[15,1,8],[16,1,5],[17,6,2],[23,1,1],[24,1,2],[25,1,4],[26,4,6],[30,1,7],[31,3,6],[34,1,4],[35,2,2],[37,3,1],[40,3,2],[43,1,1],[44,1,4],[45,2,6],[47,1,9],[48,1,7],[49,5,6],[54,4,7],[58,1,8],[59,1,11],[60,4,12]],[[0,1,14],[1,1,15],[2,2,14],[4,1,13],[5,4,11],[9,4,10],[13,1,11],[14,1,10],[15,2,8],[17,1,3],[18,3,1],[21,3,2],[24,2,1],[26,1,2],[27,1,3],[28,4,5],[32,1,3],[33,2,2],[35,1,1],[36,1,2],[37,3,1],[40,2,2],[42,1,1],[43,1,2],[44,2,6],[46,1,7],[47,1,8],[48,6,6],[54,4,7],[58,1,9],[59,5,12]],[[0,5,14],[5,2,11],[7,1,10],[8,1,11],[9,2,10],[11,2,9],[13,1,10],[14,1,11],[15,1,9],[16,1,8],[17,1,7],[18,1,2],[19,5,1],[24,1,2],[25,10,1],[35,1,2],[36,3,1],[39,4,2],[43,1,5],[44,2,6],[46,1,8],[47,7,6],[54,4,7],[58,1,10],[59,5,12]],[[0,5,14],[5,1,12],[6,1,11],[7,4,10],[11,3,9],[14,1,10],[15,1,11],[16,2,8],[18,1,6],[19,1,2],[20,12,1],[32,4,2],[36,3,1],[39,3,2],[42,1,5],[43,2,6],[45,1,8],[46,1,7],[47,4,5],[51,3,6],[54,3,7],[57,1,8],[58,1,11],[59,5,12]],[[0,5,14],[5,1,13],[6,1,11],[7,4,10],[11,1,9],[12,2,8],[14,1,9],[15,2,10],[17,2,8],[19,1,6],[20,1,3],[21,9,1],[30,5,2],[35,3,1],[38,2,2],[40,1,3],[41,1,5],[42,2,6],[44,1,7],[45,1,8],[46,1,6],[47,4,5],[51,3,6],[54,3,7],[57,1,9],[58,6,12]],[[0,6,14],[6,1,12],[7,4,10],[11,1,9],[12,4,8],[16,2,9],[18,2,8],[20,1,6],[21,1,3],[22,12,2],[34,4,1],[38,1,2],[39,1,3],[40,2,6],[42,1,5],[43,1,7],[44,1,8],[45,1,6],[46,5,5],[51,3,6],[54,2,7],[56,1,8],[57,1,11],[58,6,12]],[[0,6,14],[6,1,13],[7,1,11],[8,1,10],[9,4,9],[13,4,8],[17,2,9],[19,1,8],[20,2,7],[22,1,5],[23,1,3],[24,8,2],[32,5,1],[37,1,2],[38,1,5],[39,3,6],[42,2,7],[44,1,6],[45,6,5],[51,4,6],[55,1,7],[56,1,9],[57,1,11],[58,6,12]],[[0,7,14],[7,1,12],[8,1,10],[9,4,9],[13,3,8],[16,2,7],[18,1,8],[19,1,9],[20,1,8],[21,2,7],[23,1,6],[24,1,5],[25,1,4],[26,1,3],[27,3,2],[30,4,1],[34,1,2],[35,1,3],[36,1,5],[37,4,6],[41,2,7],[43,1,6],[44,6,5],[50,5,6],[55,1,8],[56,1,11],[57,7,12]],[[0,1,15],[1,7,14],[8,1,11],[9,4,9],[13,3,8],[16,4,7],[20,2,8],[22,1,7],[23,1,6],[24,3,7],[27,2,6],[29,3,5],[32,8,6],[40,1,7],[41,1,6],[42,7,5],[49,5,6],[54,1,7],[55,1,10],[56,2,11],[58,6,12]],[[0,2,15],[2,6,14],[8,1,13],[9,1,10],[10,3,9],[13,3,8],[16,4,7],[20,1,6],[21,4,7],[25,3,6],[28,5,7],[33,7,6],[40,7,5],[47,6,6],[53,1,7],[54,1,9],[55,3,11],[58,6,12]],[[0,3,15],[3,6,14],[9,1,13],[10,1,10],[11,2,9],[13,3,8],[16,4,7],[20,4,6],[24,12,7],[36,2,6],[38,8,5],[46,7,6],[53,1,9],[54,3,11],[57,7,12]],[[0,3,15],[3,7,14],[10,1,12],[11,1,9],[12,5,8],[17,3,7],[20,4,6],[24,1,5],[25,3,6],[28,4,7],[32,3,6],[35,10,5],[45,7,6],[52,1,8],[53,3,11],[56,8,12]],[[0,4,15],[4,7,14],[11,1,12],[12,1,9],[13,5,8],[18,2,7],[20,7,6],[27,1,5],[28,1,6],[29,15,5],[44,4,6],[48,1,7],[49,2,6],[51,1,8],[52,4,11],[56,8,12]],[[0,5,15],[5,7,14],[12,1,12],[13,1,9],[14,4,8],[18,3,7],[21,9,6],[30,12,5],[42,4,6],[46,4,7],[50,1,8],[51,5,11],[56,7,12],[63,1,13]],[[0,5,15],[5,7,14],[12,1,13],[13,1,12],[14,1,10],[15,3,8],[18,4,7],[22,8,6],[30,11,5],[41,7,6],[48,1,7],[49,1,9],[50,4,11],[54,8,12],[62,2,13]],[[0,4,15],[4,8,14],[12,3,13],[15,1,11],[16,2,8],[18,4,7],[22,10,6],[32,7,5],[39,7,6],[46,1,7],[47,1,8],[48,1,10],[49,3,11],[52,9,12],[61,3,13]],[[0,4,15],[4,8,14],[12,2,13],[14,1,14],[15,1,13],[16,1,12],[17,1,9],[18,1,8],[19,4,7],[23,21,6],[44,2,7],[46,1,9],[47,3,11],[50,10,12],[60,4,13]],[[0,5,15],[5,7,14],[12,1,13],[13,3,14],[16,2,13],[18,1,11],[19,1,9],[20,5,7],[25,18,6],[43,1,7],[44,1,9],[45,1,10],[46,1,11],[47,12,12],[59,5,13]],[[0,5,15],[5,11,14],[16,3,13],[19,1,12],[20,1,11],[21,1,9],[22,1,8],[23,5,7],[28,12,6],[40,1,7],[41,1,8],[42,1,9],[43,1,11],[44,14,12],[58,6,13]],[[0,6,15],[6,10,14],[16,6,13],[22,1,12],[23,1,11],[24,1,10],[25,2,8],[27,6,7],[33,1,6],[34,4,7],[38,1,8],[39,1,9],[40,1,10],[41,1,11],[42,13,12],[55,9,13]],[[0,7,15],[7,9,14],[16,10,13],[26,1,12],[27,1,11],[28,8,10],[36,2,11],[38,10,12],[48,3,13],[51,1,12],[52,12,13]],[[0,7,15],[7,9,14],[16,12,13],[28,14,12],[42,22,13]],[[0,7,15],[7,10,14],[17,12,13],[29,3,12],[32,3,13],[35,6,12],[41,23,13]],[[0,7,15],[7,10,14],[17,4,13],[21,1,14],[22,8,13],[30,2,12],[32,32,13]],[[0,6,15],[6,13,14],[19,2,13],[21,1,14],[22,7,13],[29,2,12],[31,33,13]],[[0,6,15],[6,13,14],[19,45,13]],[[0,6,15],[6,2,14],[8,1,15],[9,10,14],[19,45,13]]],"m":[[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,53,1],[59,1,1],[73,55,1]],[[0,47,1],[78,50,1]],[[0,43,1],[81,47,1]],[[0,40,1],[84,44,1]],[[0,38,1],[86,42,1]],[[0,36,1],[88,40,1]],[[0,34,1],[90,38,1]],[[0,33,1],[92,36,1]],[[0,31,1],[94,34,1]],[[0,29,1],[95,33,1]],[[0,28,1],[96,32,1]],[[0,27,1],[98,30,1]],[[0,25,1],[99,29,1]],[[0,24,1],[100,28,1]],[[0,23,1],[101,27,1]],[[0,22,1],[102,26,1]],[[0,21,1],[103,25,1]],[[0,20,1],[104,24,1]],[[0,19,1],[105,23,1]],[[0,18,1],[55,11,2],[106,22,1]],[[0,18,1],[52,19,2],[107,21,1]],[[0,17,1],[49,5,2],[67,7,2],[108,20,1]],[[0,16,1],[72,4,2],[109,19,1]],[[0,15,1],[75,3,2],[109,19,1]],[[0,15,1],[77,3,2],[110,18,1]],[[0,14,1],[79,3,2],[111,17,1]],[[0,14,1],[80,4,2],[111,17,1]],[[0,13,1],[82,4,2],[112,16,1]],[[0,12,1],[83,4,2],[113,15,1]],[[0,12,1],[84,4,2],[113,15,1]],[[0,11,1],[85,4,2],[114,14,1]],[[0,11,1],[86,4,2],[114,14,1]],[[0,11,1],[87,4,2],[115,13,1]],[[0,10,1],[88,4,2],[115,13,1]],[[0,10,1],[89,4,2],[115,13,1]],[[0,9,1],[90,3,2],[116,12,1]],[[0,9,1],[91,3,2],[116,12,1]],[[0,9,1],[91,3,2],[116,12,1]],[[0,8,1],[92,3,2],[117,11,1]],[[0,8,1],[93,2,2],[117,11,1]],[[0,8,1],[55,10,3],[93,3,2],[118,10,1]],[[0,8,1],[26,1,1],[64,3,3],[94,2,2],[118,10,1]],[[0,7,1],[26,1,1],[94,3,2],[118,10,1]],[[0,7,1],[25,2,1],[69,2,4],[95,2,2],[118,10,1]],[[0,7,1],[25,1,1],[70,2,4],[95,3,2],[115,13,1]],[[0,7,1],[25,1,1],[71,2,4],[95,3,2],[113,15,1]],[[0,7,1],[24,2,1],[72,2,4],[96,2,2],[108,20,1]],[[0,7,1],[24,1,1],[73,2,4],[96,3,2],[108,5,1],[114,14,1]],[[0,7,1],[24,1,1],[74,1,4],[96,8,2],[108,9,1],[118,10,1]],[[0,9,1],[23,2,1],[96,6,2],[109,5,1],[116,12,1]],[[0,9,1],[23,2,1],[97,7,2],[107,4,1],[113,4,1],[119,9,1]],[[0,11,1],[23,2,1],[43,1,5],[93,1,6],[97,5,2],[111,3,1],[118,10,1]],[[0,9,1],[12,1,1],[23,2,1],[43,1,5],[93,1,6],[97,3,2],[120,8,1]],[[0,9,1],[11,2,1],[23,1,1],[43,1,5],[93,1,6],[97,2,2],[120,8,1]],[[0,10,1],[11,2,1],[23,1,1],[43,1,5],[93,1,6],[97,3,2],[120,8,1]],[[0,13,1],[23,1,1],[42,2,5],[93,1,6],[97,3,2],[120,8,1]],[[0,14,1],[22,2,1],[42,2,5],[93,1,6],[98,2,2],[120,8,1]],[[0,14,1],[22,2,1],[42,2,5],[93,1,6],[98,2,2],[120,8,1]],[[0,16,1],[22,3,1],[42,2,5],[93,1,6],[98,2,2],[120,8,1]],[[0,16,1],[20,5,1],[43,1,5],[93,1,6],[98,1,2],[120,8,1]],[[0,16,1],[17,2,1],[20,5,1],[43,1,5],[93,1,6],[98,1,2],[120,8,1]],[[0,25,1],[43,1,5],[97,2,2],[120,8,1]],[[0,25,1],[43,2,5],[97,2,2],[120,8,1]],[[0,25,1],[44,1,5],[97,2,2],[119,9,1]],[[0,26,1],[44,2,5],[97,2,2],[119,9,1]],[[0,26,1],[45,1,5],[97,1,2],[119,9,1]],[[0,26,1],[45,2,5],[96,2,2],[119,9,1]],[[0,26,1],[46,2,5],[96,2,2],[119,9,1]],[[0,27,1],[47,1,5],[96,2,2],[119,9,1]],[[0,27,1],[96,1,2],[119,9,1]],[[0,28,1],[95,2,2],[118,10,1]],[[0,28,1],[95,1,2],[118,10,1]],[[0,28,1],[94,2,2],[118,10,1]],[[0,29,1],[94,1,2],[117,11,1]],[[0,29,1],[93,2,2],[117,11,1]],[[0,30,1],[93,1,2],[117,11,1]],[[0,31,1],[116,12,1]],[[0,23,1],[24,4,1],[29,2,1],[116,12,1]],[[0,23,1],[30,2,1],[115,13,1]],[[0,23,1],[31,2,1],[115,13,1]],[[0,23,1],[32,2,1],[115,13,1]],[[0,24,1],[33,2,1],[114,14,1]],[[0,24,1],[34,2,1],[114,14,1]],[[0,23,1],[35,2,1],[113,15,1]],[[0,24,1],[36,2,1],[112,16,1]],[[0,24,1],[37,2,1],[112,16,1]],[[0,16,1],[17,4,1],[22,1,1],[111,17,1]],[[0,17,1],[18,3,1],[111,17,1]],[[0,21,1],[110,18,1]],[[0,18,1],[19,1,1],[109,19,1]],[[0,19,1],[108,20,1]],[[0,20,1],[108,20,1]],[[0,21,1],[107,21,1]],[[0,22,1],[106,22,1]],[[0,23,1],[105,23,1]],[[0,24,1],[104,24,1]],[[0,25,1],[103,25,1]],[[0,26,1],[102,26,1]],[[0,27,1],[101,27,1]],[[0,28,1],[99,29,1]],[[0,29,1],[98,30,1]],[[0,31,1],[97,31,1]],[[0,32,1],[95,33,1]],[[0,34,1],[94,34,1]],[[0,35,1],[92,36,1]],[[0,37,1],[90,38,1]],[[0,39,1],[89,39,1]],[[0,41,1],[86,42,1]],[[0,44,1],[84,44,1]],[[0,47,1],[81,47,1]],[[0,51,1],[77,51,1]],[[0,57,1],[71,57,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]],[[0,128,1]]],"h":[2,26,164,1201,502,166,64,60,65,79,249,740,1063,1143,990,886,677,556,376,299,274,216,218,206,481,599,1414,1040,1466,723,436,3],"v":[0.0,0.0,4.8,12.6,38.2,86.1,238.7,906.1,1443.8,1696.3,1846.4,1920.6,1973.4,1994.8,2010.7,2027.1,2047.4,2063.6,2080.4,2094.5,2110.5,2133.3,2189.1,2268.1,2367.7,2484.2,2615.0,2752.6,2875.8,2996.3,3095.4,3191.4,3272.0,3333.4,3378.6,3412.5,3437.8,3449.9,3454.2,3451.9,3443.4,3430.7,3409.8,3388.9,3362.9,3331.9,3300.1,3269.6,3202.3,3085.1,2973.0,2852.8,2597.8,2222.1,1895.5,1656.9,1302.8,878.4,572.0,379.8,205.7,31.1,0.7,0.0]},"patch":[[39,181,166,163,175,169,195,201],[34,135,189,161,179,175,182,207],[38,93,203,161,177,181,174,206],[33,60,194,172,166,177,172,195],[36,35,173,185,160,170,168,186],[43,22,142,198,159,169,167,178],[46,29,106,203,158,171,170,174],[45,36,84,207,159,171,173,174]]};
const SEGC=[BLUE,ORG,GRN,PINK,YEL,TEAL,PUR,RED];
INIT[16]=function(){
  /* grey image and a pixel patch */
  (function(){
    const duo=el('div','duo');$('#b16pix').append(duo);const G=IMG16.ok.g;let a='';
    G.forEach((row,y)=>row.forEach(([x,l,v])=>{const c=Math.round(v*17);a+='<rect x="'+(x*4)+'" y="'+(y*4)+'" width="'+(l*4)+'" height="4.4" fill="rgb('+c+','+c+','+c+')"/>'}));
    a+=rect(180,120,16,16,'none',YEL,' stroke-width="2"');
    cell(duo,'L\'immagine (64 × 64)','<g transform="translate(23,4)">'+a+'</g>',302,264,'Girante di pompa in grigi','Una griglia di pixel, ciascuno un grigio.');
    let b='';IMG16.patch.forEach((r,y)=>r.forEach((v,x)=>{b+=rect(10+x*35,6+y*31,35,31,'rgb('+v+','+v+','+v+')','#000')+tx(10+x*35+17.5,6+y*31+20,String(v),{s:11.5,f:v>140?'#000':'#fff'})}));
    cell(duo,'8 × 8 pixel, i numeri veri',b,300,264,'Valori dei pixel','0 = nero, 255 = bianco.');
  })();
  /* Otsu */
  (function(){
    const H=IMG16.ok.h,V=IMG16.ok.v,t=IMG16.ok.t;let s='';const L=50,R=670,T=16,B=220,X=g=>L+g/256*(R-L),mh=Math.max(...H),mv=Math.max(...V);
    H.forEach((h,i)=>s+=rect(X(i*8)+1,B-h/mh*(B-T),X(8)-X(0)-2,h/mh*(B-T),i*8+8<=t?'#555':'#bbb'));
    s+='<polyline points="'+V.map((v,i)=>X(i*4).toFixed(1)+','+(B-v/mv*(B-T)).toFixed(1)).join(' ')+'" fill="none" stroke="'+PINK+'" stroke-width="2.5"/>';
    s+=line(X(t),T,X(t),B,YEL,2,' stroke-dasharray="6 4"')+lbl(X(t)-8,T+14,'soglia di Otsu = '+t,YEL,{a:'end',s:13.5});
    s+=lbl(X(60),T+80,'sotto la soglia → 0',null,{s:12.5})+lbl(X(200),T+12,'sopra la soglia → 1',null,{s:12.5})+lbl(X(70),T+50,'varianza fra le classi',PINK,{s:12.5});
    [0,64,128,192,255].forEach(g=>s+=tx(X(g),B+18,String(g),{s:12,f:GRAY}));
    s+=line(L,B,R,B,'#777',1.2)+tx((L+R)/2,B+38,'livello di grigio',{s:13,f:GRAY});
    svgBox($('#b16otsu'),700,268,s,'Soglia di Otsu','44rem');
  })();
  /* segments */
  (function(){
    const duo=el('div','duo');$('#b16seg').append(duo);
    [['ok','Pezzo buono'],['def','Pezzo difettoso']].forEach(([k,n])=>{const D=IMG16[k];let s=rect(0,0,256,256,'#000');
      D.m.forEach((row,y)=>row.forEach(([x,l,v])=>s+='<rect x="'+(x*2)+'" y="'+(y*2)+'" width="'+(l*2)+'" height="2.2" fill="'+SEGC[(v-1)%SEGC.length]+'"/>'));
      cell(duo,n,'<g transform="translate(22,2)">'+s+'</g>',300,260,n+': segmenti',(D.n)+' segmenti · soglia '+D.t)});
  })();
  /* GLCM example */
  (function(){
    const duo=el('div','duo');$('#b16glcm').append(duo);
    const I=[[0,0,1,1],[0,0,1,1],[0,2,2,2],[2,2,1,0]],gc=['#222','#888','#eee'];let a='';
    I.forEach((r,y)=>r.forEach((v,x)=>a+=rect(60+x*45,10+y*45,45,45,gc[v],'#555')+tx(60+x*45+22.5,10+y*45+28,String(v),{s:15,f:v===2?'#000':'#fff',w:600})));
    a+=line(150,32,190,32,YEL,2)+tx(170,26,'vicino a destra',{s:11.5,f:YEL});
    cell(duo,'Immagine 4 × 4, tre grigi',a,320,196,'Immagine di esempio','');
    const M=[[0,0,0],[0,0,0],[0,0,0]];I.forEach(r=>{for(let x=0;x<3;x++)M[r[x]][r[x+1]]++});
    let b=tx(160,14,'pixel a destra (j)',{s:12,f:GRAY})+tx(24,110,'pixel a sinistra (i)',{s:12,f:GRAY,x:' transform="rotate(-90 24 110)"'});
    [0,1,2].forEach(j=>b+=tx(100+j*55+27,34,String(j),{s:13,f:'#ddd'})+tx(88,52+j*50+26,String(j),{s:13,f:'#ddd',a:'end'}));
    M.forEach((r,i)=>r.forEach((v,j)=>b+=rect(100+j*55,42+i*50,55,50,i===j?'rgba(131,193,103,'+(.15+v*.15)+')':'rgba(252,98,85,'+(.08+v*.18)+')','#000')+tx(100+j*55+27,42+i*50+31,String(v),{s:16,f:'#fff',w:600})));
    cell(duo,'Matrice di co-occorrenza',b,320,196,'GLCM','Diagonale: vicini uguali. Fuori: <b>contrasto</b>.');
  })();
  /* confusion matrix */
  (function(){svgBox($('#b16cm'),440,210,cm12(150,50,{tp:39,fn:6,fp:3,tn:42},['difettoso','buono'],{w:130,h:70}),'Matrice di confusione dei pezzi','30rem')})();
  /* importance */
  (function(){
    const V=[['cluster prominence (tessitura)',1.18,1],['media del grigio minimo dei segmenti',1.14,0],['75° percentile del grigio',1.05,0],['media del grigio medio dei segmenti',1.02,0],['massimo del grigio medio dei segmenti',1.02,0],['massimo del grigio minimo dei segmenti',.84,0],['ICM2 (tessitura)',.83,1],['deviazione standard del grigio',.81,0],['sum variance (tessitura)',.78,1],['cluster shade (tessitura)',.75,1]];
    let s='';const L=330,X=v=>L+v/1.3*320;V.forEach(([n,v,t],i)=>{const y=6+i*28;s+=tx(L-10,y+16,n,{s:12.5,f:'#ddd',a:'end'})+rect(L,y+4,X(v)-L,17,t?YEL:BLUE)+tx(X(v)+8,y+17,fi(v,2),{s:12.5,f:'#fff',a:'start'})});
    svgBox($('#b16imp'),720,V.length*28+12,s,'Importanza delle variabili','44rem');
  })();
  /* expected cost */
  (function(){
    const C=[[.50,6,3],[.40,3,3],[.35,2,4],[.30,2,5],[.25,1,11],[.20,1,16]];let s='';const B=230,T=24,Y=v=>B-v/2300*(B-T);
    [0,500,1000,1500,2000].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,0),{s:12,f:GRAY,a:'end'}));
    C.forEach(([c,miss,fa],i)=>{const m=50*miss/45*150,chk=(50*(45-miss)/45+950*fa/45)*5,x=80+i*98;
      s+=rect(x,Y(m),60,B-Y(m),RED)+rect(x,Y(m+chk),60,Y(m)-Y(m+chk),ORG)+tx(x+30,Y(m+chk)-6,fi(Math.round(m+chk),0)+' €',{s:12.5,f:c===.35?YEL:'#fff',w:c===.35?600:400})+tx(x+30,B+20,'soglia '+fi(c,2),{s:12.5,f:c===.35?YEL:'#ddd'})});
    s+=line(50,B,660,B,'#777',1.2)+rect(380,4,12,12,RED)+tx(398,15,'difetti mancati',{s:12.5,f:'#ddd',a:'start'})+rect(520,4,12,12,ORG)+tx(538,15,'controlli a mano',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b16cost'),680,256,s,'Costo atteso per 1.000 pezzi','42rem');
  })();
};
QZ['16a']=()=>[{q:'Un\'azienda vuole riconoscere centinaia di prodotti diversi negli scaffali dei supermercati, fotografati con telefoni diversi e luci diverse. Quale approccio suggeriscono le slide?',o:['Visione classica: è più spiegabile','Deep learning: scene variabili e molte classi','Nessuno dei due','Un dizionario di parole'],a:1,
  e:'Sfondi, angoli e luci diverse rompono le feature fatte a mano, e le classi sono molte: è il territorio del deep learning.',h:'Guarda le condizioni in cui l\'approccio classico è la scelta giusta.'}];
QZ['16b']=()=>[{q:'Perché il metodo di Otsu è meglio di una soglia fissa a 128 per tutte le immagini?',o:['Perché è più veloce','Perché sceglie per ogni immagine la soglia che separa meglio i due gruppi di pixel, adattandosi a foto più scure o più chiare','Perché usa i colori','Perché toglie la polvere'],a:1,
  e:'Otsu massimizza la varianza fra le classi per ogni immagine: se una foto è più scura, la soglia scende con lei.',h:'Che cosa succede a una soglia fissa se la luce cambia?'}];
QZ['16c']=()=>[{q:'Con 39 difettosi riconosciuti, 6 mancati e 3 pezzi buoni segnalati, qual è la precisione per la classe «difettoso»?',o:['86,7%','92,9%','90,0%','93,3%'],a:1,
  e:'Precisione = 39 / (39 + 3) = 39 / 42 ≈ 92,9%. 86,7% è la sensibilità (39 / 45).',h:'Dei pezzi segnalati come difettosi, quanti lo sono davvero?'}];
QZ['16d']=()=>[{q:'Con le ipotesi delle slide, perché scendere da 0,35 a 0,20 fa salire il costo atteso, anche se si manca un difetto in meno?',o:['Perché l\'accuratezza scende','Perché i pezzi buoni segnalati passano da 4 a 16 su 45: su 950 pezzi buoni sono centinaia di controlli a mano in più','Perché il modello va riaddestrato','Perché i difetti costano meno'],a:1,
  e:'Un difetto mancato in meno su 45 vale circa 1,1 difetti su 1.000 pezzi (167 euro risparmiati), ma 12 pezzi buoni segnalati in più su 45 sono circa 253 controlli in più (oltre 1.250 euro).',h:'Moltiplica le quote per 50 difettosi e 950 pezzi buoni.'}];
QZ['16']=()=>[
  {q:'Quanti numeri contiene un\'immagine a colori di 128 × 128 pixel?',o:['16.384','32.768','49.152','128'],a:2,
   e:'128 × 128 = 16.384 pixel, ciascuno con tre valori (rosso, verde, blu): 49.152 numeri. In grigi sarebbero 16.384.',h:'Tre griglie, una per colore.'},
  {q:'Che cosa fa Connected Component Analysis?',o:['Sceglie la soglia','Dà lo stesso identificativo ai pixel di primo piano che si toccano, formando i segmenti','Calcola la tessitura','Divide i dati in training e test'],a:1,
   e:'Ogni gruppo di pixel connessi diventa un segmento; il Labeling Filter toglie poi quelli sotto i 10 pixel.',h:'Pensa ai sottografi connessi.'},
  {q:'Due immagini hanno esattamente lo stesso istogramma dei grigi, ma una ha una superficie liscia e l\'altra graffiata. Quale famiglia di feature le distingue?',o:['Le statistiche del primo ordine','La tessitura, per esempio il contrasto di Haralick','Nessuna','Il numero di pixel'],a:1,
   e:'Le statistiche del primo ordine dipendono solo dall\'istogramma; la matrice di co-occorrenza guarda i vicini, e graffi e bordi aumentano il contrasto.',h:'Quale famiglia sa dove sta un pixel?'},
  {q:'Perché dopo Image Segment Features serve un GroupBy?',o:['Per togliere i valori mancanti','Perché ci sono più segmenti per immagine, e il modello vuole una riga per pezzo','Per bilanciare le classi','Per calcolare l\'AUC'],a:1,
   e:'863 segmenti per 300 immagini: il GroupBy per image_id calcola conteggio, media e massimo, una riga per pezzo.',h:'Quante righe per immagine produce il nodo?'},
  {q:'Il test ha 90 pezzi, metà difettosi. Perché le slide dicono di leggere l\'accuratezza come «circa il 90%»?',o:['Perché il modello è casuale','Perché un solo errore vale 1,1 punti: con così pochi pezzi l\'incertezza è ampia','Perché l\'AUC è 0,97','Perché la soglia è 0,5'],a:1,
   e:'1 / 90 ≈ 1,1%: spostare una sola previsione cambia l\'accuratezza di oltre un punto. Gli intervalli di confidenza sono larghi.',h:'Quanto vale un errore su 90?'},
  {q:'Sulla linea i difettosi sono il 5%, ma il test è bilanciato 50/50. Che cosa ne consegue?',o:['Niente','L\'accuratezza sul test non è quella che si vedrà sulla linea: i costi vanno calcolati con il tasso di difetti vero','Il modello va buttato','Bisogna bilanciare anche la linea'],a:1,
   e:'Con il 5% di difettosi pesano molto di più i pezzi buoni: per questo il calcolo dei costi usa 50 difettosi e 950 buoni su 1.000.',h:'Ricorda le scelte da discutere sui dati.'}
];
MAPPA[16]={c:'Come si trasforma un\'immagine in una tabella?',r:[
  {t:'Perché le immagini',c:BLUE,v:['Ricerca visiva, loghi, fabbrica, campi','Misurare, classificare, rilevare, cercare','Prima di tutto: buone immagini']},
  {t:'Classico o deep learning',c:PINK,v:['Classico: feature progettate, spiegabili','Deep: feature imparate, scene variabili','Spesso si combinano']},
  {t:'La catena in KNIME',c:TEAL,v:['Pixel: 0 nero, 255 bianco','Otsu: soglia per ogni immagine','Componenti connesse, filtro sotto 10 pixel','GroupBy: una riga per pezzo']},
  {t:'Feature',c:YEL,v:['Primo ordine: istogramma','Geometria dei segmenti','Tessitura: matrice di co-occorrenza']},
  {t:'Il caso fonderia',c:GRN,v:['300 immagini, 45 feature','Accuratezza circa 90%, AUC 0,97','In cima: cluster prominence']},
  {t:'Decidere',c:ORG,v:['Soglia 0,35: costo −35%','Persona nel giro, monitoraggio','Limiti: luce, risoluzione, campione']}]};

/* Riepilogo delle lezioni 9-16 (L. Molteni): mappe mentali e quiz misto */
MAPPA['116']={c:'Dalla domanda di business alla decisione',r:[
  {t:'Domanda e dati (9)',c:BLUE,v:['Target e KPI','Warehouse affidabile','Predittiva e generativa']},
  {t:'Esplorare (10)',c:YEL,v:['Tipi di variabile','χ², r, ANOVA','KNIME']},
  {t:'Preparare (11)',c:PUR,v:['Mancanti, anomali','Leakage','Feature, codifica, scala']},
  {t:'Modellare (13)',c:GRN,v:['Albero, foresta, boosting','Importanza: tagli, SHAP, PD']},
  {t:'Valutare (12, 14)',c:PINK,v:['Test mai visto','Matrice, AUC, lift','Risultati troppo belli']},
  {t:'Decidere (14, 16)',c:ORG,v:['Soglia sui costi','Lista grande quanto la capacità']},
  {t:'Testi e immagini (15, 16)',c:TEAL,v:['Bag of words, LDA','Otsu, segmenti, tessitura']}]};
MAPPA['116a']={c:'Leggere i dati',r:[
  {t:'Tipi',c:PINK,v:['Nominali, ordinali','Discrete, continue','Intervalli, rapporti']},
  {t:'Una variabile',c:YEL,v:['Media, mediana, moda','IQR, deviazione standard, CV','Asimmetria, curtosi']},
  {t:'Test',c:ORG,v:['H₀ e H₁','p-value minore di α: rifiuto','Errori di I e II tipo']},
  {t:'Due variabili',c:GRN,v:['Qualitative: χ², V','Quantitative: r, test t','Miste: ANOVA, F']}]};
MAPPA['116b']={c:'Preparare i dati',r:[
  {t:'Mancanti',c:PUR,v:['MCAR, MAR, MNAR, strutturali','Cancellare, imputare, segnalare','Travestiti: NA, NULL']},
  {t:'Anomali',c:RED,v:['Errore o valore vero?','Regola 1,5 IQR, per gruppo','Limitare o trasformare']},
  {t:'Leakage',c:ORG,v:['Quando è misurata la colonna?','Modello perfetto: allarme']},
  {t:'Feature',c:GRN,v:['One-hot, ordinale','Min-max, z-score','Indicatori, gruppi, tassi']}]};
MAPPA['116c']={c:'Valutare',r:[
  {t:'Dati',c:BLUE,v:['Training, validazione, test','Stratificare, fissare il seme','Validazione incrociata']},
  {t:'Classi',c:GRN,v:['Sensibilità, specificità','Precisione, F1','κ, MCC, acc. bilanciata']},
  {t:'Classifica',c:PINK,v:['Soglia','ROC e AUC','Gain e lift']},
  {t:'Numeri',c:YEL,v:['MAE, RMSE','MAPE, MPE','R², MASE']}]};
MAPPA['116d']={c:'Scegliere il modello',r:[
  {t:'Albero',c:GRN,v:['Gini, entropia, gain ratio','Potatura MDL','Regole leggibili, instabile']},
  {t:'Foresta',c:BLUE,v:['Bootstrap, √p variabili','Media: meno varianza']},
  {t:'Boosting',c:PINK,v:['Alberi sui residui','Tasso 0,1, profondità 4-6','Meno distorsione, va regolato']},
  {t:'Importanza',c:ORG,v:['Statistiche dei tagli','SHAP','Dipendenza parziale']}]};
MAPPA['116e']={c:'Dal modello alla decisione',r:[
  {t:'Soglia',c:ORG,v:['Costo = FN·c(FN) + FP·c(FP)','Caso mancato caro: soglia bassa']},
  {t:'Capacità',c:YEL,v:['Ordinare per probabilità','Tagliare a k casi','Gruppo di controllo']},
  {t:'Sospetti',c:RED,v:['Primo taglio','Semi, bilanciamento, test usato']},
  {t:'Testi',c:TEAL,v:['Pulire, bag of words','Dizionario, foresta, LDA']},
  {t:'Immagini',c:BLUE,v:['Otsu, segmenti','Primo ordine, forma, tessitura']}]};
QZ['116']=()=>[
  {q:'Vuoi sapere se il tipo di contratto (mensile, annuale, biennale) è legato all\'abbandono (sì o no). Quale strumento usi, e come misuri la forza del legame?',o:['Correlazione di Pearson e r','Tabella di contingenza con test χ², e V di Cramér','ANOVA e F','Regressione lineare e R²'],a:1,
   e:'Due variabili qualitative: tabella di contingenza e test χ² per l\'esistenza del legame, V di Cramér per la forza (nel caso Telco 0,41, alta).',h:'Di che tipo sono le due variabili?'},
  {q:'In un dataset il reddito manca soprattutto per chi guadagna poco, che non vuole dichiararlo. Che cosa conviene fare?',o:['Cancellare le righe senza reddito','Imputare la media del reddito','Aggiungere un indicatore o una categoria «non dichiarato»: la mancanza è MNAR e porta informazione','Imputare zero'],a:2,
   e:'La probabilità di mancare dipende dal valore stesso: cancellare o imputare la media distorcerebbe il quadro, l\'indicatore conserva il segnale.',h:'Da che cosa dipende la mancanza?'},
  {q:'Un modello di abbandono ha accuratezza 0,97 sul test, e il primo taglio dell\'albero è «numero di conti chiusi nell\'ultimo mese». Che cosa pensi?',o:['Ottimo modello, si può usare subito','Leakage: la colonna è misurata dopo l\'evento che si vuole prevedere','Serve più potatura','Bisogna aumentare il numero di alberi'],a:1,
   e:'Un conto chiuso è parte dell\'abbandono stesso: il modello legge la risposta. È il caso delle colonne post-evento della banca nella lezione 14.',h:'Quando è misurata quella colonna?'},
  {q:'Con TP = 40, FN = 10, FP = 20, TN = 130, quanto valgono sensibilità e precisione?',o:['0,80 e 0,667','0,667 e 0,80','0,85 e 0,867','0,80 e 0,867'],a:0,
   e:'Sensibilità = 40 / (40 + 10) = 0,80; precisione = 40 / (40 + 20) = 0,667. 0,85 è l\'accuratezza, 0,867 la specificità.',h:'Sensibilità guarda i positivi veri, precisione i previsti positivi.'},
  {q:'Su un dataset con il 2% di frodi, un modello dichiara tutto «legittimo». Quali indici smascherano subito che è inutile?',o:['Accuratezza e tasso di errore','Sensibilità, accuratezza bilanciata e κ di Cohen','Solo la specificità','Il MAPE'],a:1,
   e:'Accuratezza 98%, ma sensibilità 0, accuratezza bilanciata 0,5 e κ 0: gli indici robusti alle classi sbilanciate rivelano che non trova nessuna frode.',h:'Quali indici guardano la classe rara?'},
  {q:'Quale coppia descrive correttamente random forest e gradient boosting?',o:['Foresta: alberi in sequenza sui residui; boosting: media di alberi indipendenti','Foresta: media di alberi profondi su campioni bootstrap, riduce la varianza; boosting: alberi bassi in sequenza sui residui, riduce la distorsione','Tutti e due riducono solo la distorsione','Il boosting non ha parametri da regolare'],a:1,
   e:'È la distinzione centrale della lezione 13: parallelo e media contro sequenza e correzioni.',h:'Quale errore attacca ciascuno?'},
  {q:'Un pezzo difettoso non scoperto costa 150 euro, un controllo a mano 5 euro. Abbassando la soglia da 0,5 a 0,35 i difetti mancati per 1.000 pezzi scendono da circa 6,7 a 2,2, i controlli salgono da circa 107 a 132. Conviene?',o:['No, i controlli aumentano','Sì: il costo scende da circa 1.533 a circa 994 euro','È indifferente','Non si può dire senza l\'AUC'],a:1,
   e:'0,5: 6,7 × 150 + 107 × 5 ≈ 1.000 + 533 = 1.533 euro. 0,35: 2,2 × 150 + 132 × 5 ≈ 333 + 661 = 994 euro. Il costo atteso scende del 35%.',h:'Moltiplica ogni errore per il suo costo e somma.'},
  {q:'Che cosa hanno in comune l\'analisi dei tweet e quella delle immagini dei pezzi?',o:['Usano entrambe le reti convoluzionali','Trasformano i dati non tabellari in una tabella di colonne numeriche, su cui valgono i modelli e gli indici delle lezioni 12-14','Non richiedono etichette','Usano entrambe il test χ²'],a:1,
   e:'Bag of words per i testi, feature di primo ordine, forma e tessitura per le immagini: poi è una tabella come le altre, con divisione, random forest, Scorer e soglia.',h:'Che cosa diventa un testo o un\'immagine prima del modello?'}
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
/* ---------- Lingua: nelle materie con più lingue il selettore ricorda la scelta e riapre la stessa lezione nello stesso punto ----------
   Il punto si passa all'altra pagina in localStorage (lezione, sezione, frazione della sezione), senza cancelletto nell'indirizzo:
   così Chrome può usare la pagina già preparata in background (regole di speculazione scritte da build.py) e il cambio è immediato. */
document.querySelectorAll('.lang a[data-lang]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();if(a.classList.contains('off'))return;let j=null;const art=document.querySelector('.lesson:not([hidden])');
  if(art){const secs=[...art.querySelectorAll(':scope > section')],hd=(document.querySelector('.top')||{offsetHeight:0}).offsetHeight,y=window.scrollY+hd;
    let i=0;secs.forEach((x,k)=>{if(x.getBoundingClientRect().top+window.scrollY<=y+1)i=k});
    const x=secs[i],t=x?x.getBoundingClientRect().top+window.scrollY:0;
    j={mid:a.dataset.mid,n:+art.dataset.n,i,f:x&&x.offsetHeight?Math.max(0,Math.min(1,(y-t)/x.offsetHeight)):0,at:Date.now()}}
  try{localStorage.setItem('lingua-'+a.dataset.mid,a.dataset.lang);if(j)localStorage.setItem('salto-lingua',JSON.stringify(j))}catch(_){j=null}
  location.href=a.getAttribute('href')+(j?'':location.hash)}));
/* ---------- Navigazione fra le lezioni: una alla volta, figure montate alla prima apertura ---------- */
const lessons=[...document.querySelectorAll('.lesson')],links=[...document.querySelectorAll('.top nav a')];
/* le lezioni si cercano per numero (data-n), così una materia può cominciare da una lezione 0 */
const NUMS=lessons.map(l=>+l.dataset.n),byN=n=>lessons[NUMS.indexOf(n)],done={};
/* stacco fra docenti: se data-docente cambia fra una lezione e la successiva, etichetta nell'apertura, riquadro di chiusura e segno nel menu */
const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(_,k)=>String(o[k]).replace(/\. /g,'.\u00a0'));
(function(){let p=1,from=0;const parts=[];
  lessons.forEach((l,i)=>{const d=l.dataset.docente;if(!d)return;
    if(i>0&&lessons[i-1].dataset.docente&&lessons[i-1].dataset.docente!==d){p++;parts.push({i,p})}
    l.dataset.parte=p});
  if(!parts.length)return;
  const first={};lessons.forEach((l,i)=>{const q=l.dataset.parte;if(q&&!(q in first))first[q]=i});
  lessons.forEach((l,i)=>{const q=+l.dataset.parte;if(!q)return;const d=l.dataset.docente,col=l.querySelector('section.hero .col');
    if(col&&!col.querySelector('.parttag')){const t=el('p','parttag'+(q>1?' p'+Math.min(q,3):''),fill(UI.partTag,{p:q,d}));col.prepend(t)}
    const lk=links.find(a=>+a.dataset.go===+l.dataset.n);
    if(lk&&first[q]===i&&i>0){lk.classList.add('after','p'+Math.min(q,3));lk.title=fill(UI.partNav,{p:q,d})}
    const nx=lessons[i+1];
    if(nx&&nx.dataset.parte&&nx.dataset.parte!=l.dataset.parte){const ne=l.querySelector('.navend');
      if(ne&&!l.querySelector('.partend')){const a=+lessons[first[q]].dataset.n,b=+l.dataset.n;
        const box=el('div','partend','<b>'+fill(UI.partEnd,{d})+'</b>'+fill(UI.partEndTxt,{a,b,d,n:+nx.dataset.n,d2:nx.dataset.docente}));ne.before(box)}}
    if(first[q]===i&&i>0){const sec=l.querySelector('section.hero')?.nextElementSibling?.querySelector('.col');
      if(sec&&!sec.querySelector('.partstart')){const box=el('div','partstart p'+Math.min(q,3),'<b>'+fill(UI.partStart,{d})+'</b>'+fill(UI.partStartTxt,{p:q,d}));sec.prepend(box)}}
  })})();
lessons.forEach((l,i)=>{
  const nav=l.querySelector('.navend');if(!nav)return;
  const card=(m,cls,lab)=>{const t=byN(m).dataset.title,num=byN(m).dataset.label||m;
    return '<a class="'+cls+'" href="#lezione-'+m+'" data-go="'+m+'"><span class="th" aria-hidden="true">'+(THUMB[m]||'')+'</span><span class="tx"><small>'+lab+'</small>'+num+' · '+t+'</span></a>'};
  const nx=lessons[i+1],cross=nx&&l.dataset.parte&&nx.dataset.parte&&nx.dataset.parte!==l.dataset.parte;
  nav.innerHTML=(i>0?card(NUMS[i-1],'prev',UI.prev):'')+(i<NUMS.length-1?card(NUMS[i+1],'next'+(cross?' cross':''),cross?fill(UI.partStart,{d:nx.dataset.docente}):UI.next):'');
});
function show(n,scroll){
  lessons.forEach(l=>{l.hidden=+l.dataset.n!==n});
  /* lingua senza questa lezione (per esempio Big Data 10-16 solo in italiano): link spento */
  document.querySelectorAll('.lang a[data-nums]').forEach(a=>{if(a.hasAttribute('aria-current')||!a.dataset.nums)return;const off=!a.dataset.nums.split(',').includes(String(n));
    a.classList.toggle('off',off);if(off){a.title=UI.noLang;a.setAttribute('aria-disabled','true')}else{a.removeAttribute('title');a.removeAttribute('aria-disabled')}});
  links.forEach(a=>{if(+a.dataset.go===n){a.setAttribute('aria-current','page');try{a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(_){}}else a.removeAttribute('aria-current')});
  if(!done[n]){done[n]=true;const art=byN(n);
    renderMath(art);
    try{if(INIT[n])INIT[n]()}catch(e){console.error(e)}
    art.querySelectorAll('[data-quiz]').forEach(q=>{const f=QZ[q.dataset.quiz];if(f)quiz(q,f())});
    art.querySelectorAll('[data-mappa]').forEach(q=>{const m=MAPPA[q.dataset.mappa];if(m)try{mappa(q,m)}catch(e){console.error(e)}});
  }
  if(scroll)window.scrollTo(0,0);
  if(typeof paintBar==='function')paintBar();
  if(typeof paintThumb==='function')paintThumb();
  if(typeof paintProgress==='function')paintProgress();
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
/* ---------- Indice iniziale di ogni lezione: i titoli delle sezioni (h2), cliccabili, sotto il titolo della lezione ---------- */
lessons.forEach(l=>{
  const hs=[...l.querySelectorAll('h2')].filter(h=>!h.closest('.hero')),col=l.querySelector('section.hero .col');if(hs.length<2||!col)return;
  const t=el('nav','toc');t.setAttribute('aria-label',UI.toc);
  t.innerHTML='<div class="toch">'+UI.toc+'</div><div class="tocl">'+hs.map((h,k)=>'<a href="#" data-sec="'+k+'"><b>'+(k+1)+'</b><span>'+h.innerHTML+'</span></a>').join('')+'</div>';
  col.append(t);
  t.addEventListener('click',e=>{const a=e.target.closest('[data-sec]');if(!a)return;e.preventDefault();hs[+a.dataset.sec].scrollIntoView({behavior:'smooth',block:'start'})});
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m&&NUMS.includes(+m[1])?+m[1]:NUMS[0],false)})();
renderMath(document.querySelector('footer'));
/* arrivo dal selettore di lingua: stessa lezione, stesso punto (subito, o quando la pagina preparata in background diventa visibile) */
function applyJump(){let j=null;try{j=JSON.parse(localStorage.getItem('salto-lingua')||'null')}catch(_){}
  const me=(document.querySelector('.lang a[data-mid]')||{dataset:{}}).dataset.mid;
  if(!j||j.mid!==me||Date.now()-j.at>20000||!NUMS.includes(j.n))return;
  try{localStorage.removeItem('salto-lingua')}catch(_){}
  show(j.n,false);try{history.replaceState(null,'','#lezione-'+j.n)}catch(_){}
  const sec=byN(j.n).querySelectorAll(':scope > section')[j.i];if(!sec)return;
  const go=()=>{const hd=(document.querySelector('.top')||{offsetHeight:0}).offsetHeight;
    window.scrollTo({top:Math.max(0,sec.getBoundingClientRect().top+window.scrollY+j.f*sec.offsetHeight-hd),behavior:'instant'})};
  go();requestAnimationFrame(go);setTimeout(go,120)}
if(document.prerendering)document.addEventListener('prerenderingchange',applyJump,{once:true});else applyJump();

/* blocchi di esercizi di una lezione: i quiz nel testo e la sezione del quiz finale («Mettiti alla prova»), che conta tutta */
function exerciseBlocks(art){return [...art.querySelectorAll('.quiz')].map(q=>{const s=q.closest('section');
  return !q.classList.contains('inq')&&s&&s.querySelectorAll('.quiz').length===1&&!s.querySelector('figure')?s:q})}
/* ---------- Barra di scorrimento come mappa: domande in azzurro molto velato, riepiloghi in ambra velato, teoria nel colore della barra ----------
   La barra rappresenta tutta la pagina: un punto a quota y sta a y/altezza della pagina lungo la barra, la stessa regola del cursore.
   È una barra disegnata dal sito (.sbar, al posto di quella del browser): un clic o un tocco porta esattamente al punto toccato, il cursore si trascina. */
var paintBar=(function(){
  let raf=0;const root=document.documentElement;
  function paint(){raf=0;
    const art=lessons.find(l=>!l.hidden);if(!art)return;
    const cs=getComputedStyle(root),T=cs.getPropertyValue('--sb-text').trim(),Q=cs.getPropertyValue('--sb-quiz').trim()||cs.getPropertyValue('--theme').trim(),R=cs.getPropertyValue('--sb-recap').trim();
    const H=root.scrollHeight,sy=window.scrollY,parts=[];
    const add=(e,c)=>{const r=e.getBoundingClientRect();if(r.height>0)parts.push([(r.top+sy)/H*100,(r.bottom+sy)/H*100,c])};
    art.querySelectorAll(':scope > section.recap').forEach(s=>add(s,R));
    exerciseBlocks(art).forEach(e=>add(e,Q));
    parts.sort((a,b)=>a[0]-b[0]);
    let g=[],at=0;const f=v=>v.toFixed(3)+'%';
    parts.forEach(([a,b,c])=>{if(a>at)g.push(T+' '+f(at),T+' '+f(a));g.push(c+' '+f(Math.max(a,at)),c+' '+f(b));at=Math.max(at,b)});
    g.push(T+' '+f(at),T+' 100%');
    root.style.setProperty('--sbar','linear-gradient(to bottom,'+g.join(',')+')');
}
  const go=()=>{if(!raf)raf=requestAnimationFrame(paint)};
  try{new ResizeObserver(go).observe(document.body)}catch(e){}
  window.addEventListener('resize',go);
  try{new MutationObserver(go).observe(root,{attributes:true,attributeFilter:['data-theme']})}catch(e){}
  return go})();

var paintThumb=(function(){
  const root=document.documentElement;root.classList.add('lp');
  const bar=el('div','sbar'),th=el('div','sbth');bar.append(th);bar.setAttribute('aria-hidden','true');document.body.append(bar);
  let raf=0,drag=null;
  const geo=()=>{const H=root.scrollHeight,vh=window.innerHeight;return {H,vh,h:Math.min(vh,Math.max(40,vh*vh/H))}};
  function pos(){raf=0;const {H,vh,h}=geo();bar.hidden=H<=vh+1;if(bar.hidden)return;
    th.style.height=h+'px';th.style.transform='translateY('+Math.min(vh-h,window.scrollY/H*vh)+'px)'}
  const go=()=>{if(!raf)raf=requestAnimationFrame(pos)};
  window.addEventListener('scroll',go,{passive:true});window.addEventListener('resize',go);
  try{new ResizeObserver(go).observe(document.body)}catch(e){}
  /* il cursore con il bordo alto a quota top (in pixel dello schermo) corrisponde allo scorrimento top/altezza schermo × altezza pagina */
  const to=(top,smooth)=>{const {H,vh,h}=geo();top=Math.min(vh-h,Math.max(0,top));window.scrollTo({top:top/vh*H,behavior:smooth?'smooth':'instant'})};
  bar.addEventListener('pointerdown',e=>{e.preventDefault();try{bar.setPointerCapture(e.pointerId)}catch(_){}
    const r=th.getBoundingClientRect();
    if(e.clientY>=r.top&&e.clientY<=r.bottom)drag={off:e.clientY-r.top};
    else{drag={off:r.height/2,x:e.clientY};to(e.clientY-r.height/2,true)}
    bar.classList.add('on')});
  bar.addEventListener('pointermove',e=>{if(!drag)return;if(drag.x!==undefined){if(Math.abs(e.clientY-drag.x)<4)return;drag.x=undefined}to(e.clientY-drag.off,false)});
  const end=()=>{drag=null;bar.classList.remove('on')};bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);
  return go})();

/* ---------- Avanzamento della lezione: percentuale a decine (0%, 10%, … 100%) ----------
   Su schermi larghi l'etichetta segue il cursore della barra di scorrimento; su telefono sta in basso a sinistra.
   La percentuale conta solo il testo da studiare: della lezione aperta si tolgono i quiz, la sezione del quiz finale
   e i riquadri «lezione precedente / successiva», poi si misura quanta parte del resto è passata sopra il bordo inferiore dello schermo. */
var paintProgress=(function(){
  const tag=el('div','prog');tag.setAttribute('aria-hidden','true');document.body.append(tag);
  let raf=0;const root=document.documentElement;
  function paint(){raf=0;
    const art=lessons.find(l=>!l.hidden);if(!art){tag.hidden=true;return}tag.hidden=false;
    const sy=window.scrollY,vh=window.innerHeight,H=root.scrollHeight,r=art.getBoundingClientRect(),top=r.top+sy,bot=r.bottom+sy;
    /* tratti da escludere, uniti se si sovrappongono */
    const cut=[...exerciseBlocks(art),...art.querySelectorAll('.navend')].map(e=>{const b=e.getBoundingClientRect();return [b.top+sy,b.bottom+sy]})
      .filter(x=>x[1]>x[0]).sort((a,b)=>a[0]-b[0]).reduce((m,x)=>{const l=m[m.length-1];if(l&&x[0]<=l[1])l[1]=Math.max(l[1],x[1]);else m.push(x.slice());return m},[]);
    const study=y=>{const Y=Math.min(Math.max(y,top),bot);let v=Y-top;cut.forEach(([a,b])=>{v-=Math.max(0,Math.min(b,Y)-Math.max(a,top))});return v};
    const tot=study(bot),line=sy+vh;
    let p=tot>0?Math.min(1,Math.max(0,study(line)/tot)):0;if(line>=H-2)p=1;
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
    c.querySelectorAll('.stage,svg,canvas,script,style,button,input,select,.navend,.toc,.parttag,.partend,.partstart,.q,.ctl').forEach(x=>x.remove());
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
  /* i quiz della lezione aperta, con risposta giusta, spiegazione e risposta già data dallo studente (localStorage) */
  const plain=h=>{const d=document.createElement('div');d.innerHTML=h;d.querySelectorAll('.katex').forEach(k=>{const a=k.querySelector('annotation');k.replaceWith(a?'\\('+a.textContent+'\\)':k.textContent)});return d.textContent.replace(/\s+/g,' ').trim()};
  function quizText(art){const out=[];let inq=0;
    art.querySelectorAll('[data-quiz]').forEach(r=>{const f=QZ[r.dataset.quiz];if(!f)return;let qs;try{qs=f()}catch(_){return}
      const fin=!r.classList.contains('inq'),sec=r.closest('section'),h=sec&&sec.querySelector('h2,h3');
      qs.forEach((x,i)=>{let v=null;try{v=localStorage.getItem(quizKey(r,i,x))}catch(_){}
        const L='ABCDEFGH',st=v===null?'not answered yet':('answered '+L[+v]+(+v===x.a?' (correct)':' (wrong)'));
        out.push((fin?'FINAL QUIZ, '+UI.qnum+' '+(i+1):'IN-TEXT QUIZ '+(++inq)+(h?' (section «'+plain(h.innerHTML)+'»)':''))+': '+plain(x.q)+'\n'+
          x.o.map((o,j)=>L[j]+') '+plain(o)).join('\n')+'\nCorrect: '+L[x.a]+'. Explanation: '+plain(x.e)+' Hint: '+plain(x.h||'')+'\nStudent: '+st)})});
    return out.length?'QUIZZES OF THE OPEN LESSON (the student sees final-quiz questions numbered as below). If the student asks about a quiz they have not answered yet, guide them with hints and reasoning first and give the answer only if they explicitly ask for it; if they already answered, explain why the correct option is right and why theirs is wrong.\n'+out.join('\n\n'):''}
  function context(q,cur){index();
    const art=byN(cur),parts=['COURSE: '+document.title+'\nLESSONS:\n'+MAP,'OPEN LESSON '+cur+':\n'+clean(art).slice(0,40000)],qt=quizText(art);if(qt)parts.push(qt.slice(0,20000));
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

/* ---------- Scarica le lezioni in Markdown (fonte per NotebookLM e simili, che non possono entrare nel sito protetto) ----------
   Testo, tabelle, codice, formule in LaTeX, didascalie delle figure, mappe mentali e quiz con risposta e spiegazione. */
(function(){
  const tog=document.getElementById('tog');if(!tog||!lessons.length)return;
  const b=document.createElement('button');b.type='button';b.className='tog dlbtn';b.title=UI.dl;b.setAttribute('aria-label',UI.dl);
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 19h14"/></svg>';
  tog.parentNode.insertBefore(b,tog);
  const sp=t=>t.replace(/[ \t ]+/g,' ');
  function inl(n){let o='';n.childNodes.forEach(c=>{
    if(c.nodeType===3){o+=c.nodeValue;return}if(c.nodeType!==1)return;
    if(c.classList.contains('katex')||c.classList.contains('katex-display')){const a=c.querySelector('annotation');o+=a?(c.classList.contains('katex-display')?'\\['+a.textContent+'\\]':'\\('+a.textContent+'\\)'):c.textContent;return}
    const t=c.tagName;if(t==='BR'){o+='\n';return}
    const x=inl(c),w=(m)=>x.trim()?x.match(/^\s*/)[0]+m+x.trim()+m+x.match(/\s*$/)[0]:x;if(t==='STRONG'||t==='B')o+=w('**');else if(t==='EM'||t==='I')o+=w('*');else if(t==='CODE')o+='`'+c.textContent+'`';
    else if(t==='SUB')o+='_'+x;else if(t==='SUP')o+='^'+x;else o+=x});return sp(o)}
  const plain=h=>{const d=document.createElement('div');d.innerHTML=h;return inl(d).replace(/\s+/g,' ').trim()};
  function quizMd(r){const f=QZ[r.dataset.quiz];if(!f)return '';let qs;try{qs=f()}catch(_){return ''}const fin=!r.classList.contains('inq'),L='ABCDEFGH';
    return qs.map((q,i)=>'**'+(fin?UI.qnum+' '+(i+1):UI.dlInq)+'.** '+plain(q.q)+'\n\n'+q.o.map((o,j)=>L[j]+') '+plain(o)).join('\n')+'\n\n'+UI.dlAns+': '+L[q.a]+') '+plain(q.o[q.a])+'\n\n'+UI.dlExp+': '+plain(q.e)+'\n').join('\n')}
  function mapMd(k){const m=MAPPA[k];if(!m)return '';return '**'+UI.dlMap+': '+plain(m.c)+'**\n\n'+m.r.map(r=>'- '+plain(r.t)+'\n'+r.v.map(v=>'  - '+plain(v)).join('\n')).join('\n')+'\n'}
  function tableMd(t){const rows=[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>inl(c).replace(/\|/g,'/').replace(/\s+/g,' ').trim()));if(!rows.length)return '';
    const w=Math.max(...rows.map(r=>r.length));rows.forEach(r=>{while(r.length<w)r.push('')});
    return ['| '+rows[0].join(' | ')+' |','|'+rows[0].map(()=>' --- |').join('')].concat(rows.slice(1).map(r=>'| '+r.join(' | ')+' |')).join('\n')+'\n'}
  function block(n){let o='';[...n.children].forEach(c=>{const t=c.tagName,cl=c.classList;
    if(cl.contains('toc')||cl.contains('parttag')||cl.contains('navend')||cl.contains('partstart')||cl.contains('partend')||t==='SCRIPT')return;
    if(/^H[1-4]$/.test(t)){o+='#'.repeat(+t[1]+1)+' '+inl(c).trim()+'\n\n';return}
    if(t==='P'){const x=inl(c).trim();if(x)o+=x+'\n\n';return}
    if(t==='PRE'){o+='```\n'+c.textContent.replace(/\n+$/,'')+'\n```\n\n';return}
    if(t==='TABLE'){o+=tableMd(c)+'\n';return}
    if(t==='FIGURE'){const m=c.querySelector('[data-mappa]'),cap=c.querySelector('figcaption');if(m)o+=mapMd(m.dataset.mappa)+'\n';
      if(cap)o+='> '+(m?'':UI.dlFig+': ')+inl(cap).trim()+'\n\n';return}
    if(cl.contains('quiz')){o+=quizMd(c)+'\n';return}
    if(cl.contains('eq')){o+=inl(c).trim()+'\n\n';return}
    if(t==='DETAILS'){const s=c.querySelector('summary');o+=(s?'**'+inl(s).trim()+'**\n\n':'')+block(c);return}
    if(t==='SUMMARY')return;
    if(c.querySelector('table')&&cl.contains('scroll')){c.querySelectorAll('table').forEach(x=>o+=tableMd(x)+'\n');return}
    if(cl.contains('examend')){o+='> '+inl(c).trim()+'\n\n';return}
    o+=block(c)});return o}
  b.addEventListener('click',()=>{
    let md='# '+document.title+'\n\n';const fo=document.querySelector('footer');
    lessons.forEach(l=>{const lab=l.dataset.label||(UI.dlLesson+' '+l.dataset.n),d=l.dataset.docente;
      md+='\n---\n\n## '+lab+' · '+l.dataset.title+(d?' ('+d+')':'')+'\n\n';
      l.querySelectorAll(':scope > section').forEach(s=>{const c=s.querySelector('.col')||s;
        const h=s.classList.contains('hero');if(h){const ch=c.querySelector('.chap'),de=c.querySelector('.desc');md+=(ch?'*'+inl(ch).trim()+'*\n\n':'')+(de?inl(de).trim()+'\n\n':'');return}
        md+=block(c)})});
    if(fo)md+='\n---\n\n'+block(fo.querySelector('.col')||fo);
    md=md.replace(/\n{3,}/g,'\n\n');
    const mid=(document.querySelector('.lang a[data-mid]')||{dataset:{}}).dataset.mid||location.pathname.split('/').filter(Boolean)[0]||'lezioni';
    const lang=document.documentElement.lang||'it',a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown;charset=utf-8'}));a.download=mid+'-'+lang+'.md';document.body.append(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)});
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
