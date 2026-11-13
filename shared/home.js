(function(){
  const b=document.getElementById('tog'),root=document.documentElement;
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  function paint(){const light=root.getAttribute('data-theme')==='light';b.innerHTML=light?moon:sun;b.setAttribute('aria-label',light?'Passa al tema scuro':'Passa al tema chiaro')}
  b.onclick=()=>{const light=root.getAttribute('data-theme')==='light';root.setAttribute('data-theme',light?'dark':'light');try{localStorage.setItem('tema',light?'dark':'light')}catch(e){}paint()};
  paint();
})();
