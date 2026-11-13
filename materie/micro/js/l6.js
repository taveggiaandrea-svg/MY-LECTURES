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

