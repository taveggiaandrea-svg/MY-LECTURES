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
