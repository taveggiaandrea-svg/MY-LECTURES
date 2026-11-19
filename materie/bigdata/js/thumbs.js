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
