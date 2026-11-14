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
