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

