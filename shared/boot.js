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
    art.querySelectorAll('[data-mappa]').forEach(q=>{const m=MAPPA[q.dataset.mappa];if(m)try{mappa(q,m)}catch(e){console.error(e)}});
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

/* blocchi di esercizi di una lezione: i quiz nel testo e la sezione del quiz finale («Mettiti alla prova»), che conta tutta */
function exerciseBlocks(art){return [...art.querySelectorAll('.quiz')].map(q=>{const s=q.closest('section');
  return !q.classList.contains('inq')&&s&&s.querySelectorAll('.quiz').length===1&&!s.querySelector('figure')?s:q})}
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
    exerciseBlocks(art).forEach(e=>add(e,Q));
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
