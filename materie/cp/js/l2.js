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
