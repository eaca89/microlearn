// ===== SET: an old-town square at night in the rain. One world: facades along the back, a lamp, wet cobblestones. =====
// World x runs -900..3700. The facades stand on y=640; the square's floor runs from 660 down to the frame's bottom.
const SQ={XA:-900,XB:3700,BASE:640,LAMP:1680};
const squareScale=y=>lerp(.5,.82,(y-660)/(940-660));
// Buildings and windows are fixed by a seeded random, so every shot sees the same square.
// SQ_WIN[i] = {x,y,w,h,b} in world units; a film lights them with its own lit(i,t) function.
const SQ_BLD=[],SQ_WIN=[];
(()=>{const r=rng(41),cols=['#1E2A47','#25335A','#1B2540','#2C3B63','#222F50'];let px=SQ.XA;let b=0;
 while(px<SQ.XB){const w=300+Math.floor(r()*220),h=380+Math.floor(r()*190),col=cols[Math.floor(r()*cols.length)],roof=r(),door=r()<.45;
  SQ_BLD.push({x:px,w,h,col,roof,door});const rows=Math.max(2,Math.floor((h-120)/150)),n=Math.max(2,Math.floor((w-60)/110));
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++){const ww=62,wh=86,gx=(w-n*ww)/(n+1);const wx=px+gx+i*(ww+gx),wy=SQ.BASE-h+70+j*150;
   if(door&&j==rows-1&&i==Math.floor(n/2))continue;SQ_WIN.push({x:wx,y:wy,w:ww,h:wh,b})}
  px+=w+6;b++}})();
function squareSky(x,t=0){let g=x.createLinearGradient(0,-500,0,660);g.addColorStop(0,'#070C1C');g.addColorStop(.55,'#101A36');g.addColorStop(.88,'#1E2B52');g.addColorStop(1,'#3A3F5E');x.fillStyle=g;x.fillRect(-1600,-1400,7400,2200);
 // low clouds: long soft bands, never discs
 x.fillStyle='rgba(44,58,96,.55)';for(const c of [[200,-120,900,60],[1400,-200,1100,70],[2700,-90,900,55],[800,60,1300,40],[2200,120,1000,36]]){x.beginPath();x.ellipse(c[0]+((t*6)%400),c[1],c[2],c[3],0,0,7);x.fill()}
 // far rooftops
 const r=rng(12);let px=-1600;x.fillStyle='#141D36';while(px<5800){const bw=80+r()*140,bh=120+r()*200;x.fillRect(px,SQ.BASE-260-bh,bw,bh+400);if(r()<.3){x.fillRect(px+bw*.3,SQ.BASE-300-bh,18,50)}px+=bw}}
// lit(i) returns 0..1 for window i; sil(i) returns 0..1 for a listener's silhouette in it.
function squareFacades(x,lit=()=>0,sil=()=>0){
 for(const B of SQ_BLD){const top=SQ.BASE-B.h;x.fillStyle=B.col;x.fillRect(B.x,top,B.w,B.h+30);
  // cornice and roof
  x.fillStyle='#121A30';x.fillRect(B.x-8,top-14,B.w+16,18);if(B.roof<.5){x.beginPath();x.moveTo(B.x-4,top-14);x.lineTo(B.x+B.w/2,top-14-60-B.roof*80);x.lineTo(B.x+B.w+4,top-14);x.closePath();x.fill()}
  else{x.fillRect(B.x+B.w*.68,top-70,26,60)}
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(B.x+B.w-10,top,10,B.h+30);
  if(B.door){const dx=B.x+B.w/2-44,dy=SQ.BASE-150;x.fillStyle='#0E1426';x.beginPath();x.moveTo(dx,SQ.BASE);x.lineTo(dx,dy+40);x.arc(dx+44,dy+40,44,Math.PI,0);x.lineTo(dx+88,SQ.BASE);x.closePath();x.fill();x.fillStyle='#3B2A22';x.fillRect(dx+8,dy+40,72,SQ.BASE-dy-40)}}
 for(let i=0;i<SQ_WIN.length;i++){const w=SQ_WIN[i],L_=clamp(lit(i)),S=clamp(sil(i));
  x.fillStyle='#0D1428';x.fillRect(w.x-7,w.y-7,w.w+14,w.h+14);
  if(L_>0){const g=x.createLinearGradient(0,w.y,0,w.y+w.h);g.addColorStop(0,`rgba(255,214,140,${L_})`);g.addColorStop(1,`rgba(255,160,90,${L_})`);x.fillStyle='#16203A';x.fillRect(w.x,w.y,w.w,w.h);x.fillStyle=g;x.fillRect(w.x,w.y,w.w,w.h);
   // the glow spills a little onto the wall
   x.save();x.globalAlpha=.22*L_;x.filter='blur(14px)';x.fillStyle='#FFC07A';x.fillRect(w.x-16,w.y-10,w.w+32,w.h+30);x.restore()}
  else{x.fillStyle='#16203A';x.fillRect(w.x,w.y,w.w,w.h)}
  if(S>0){x.save();x.globalAlpha=S;x.fillStyle='#1A1420';const cx=w.x+w.w/2,cy=w.y+w.h;x.beginPath();x.arc(cx,cy-46,15,0,7);x.fill();x.beginPath();x.roundRect(cx-24,cy-30,48,34,[14,14,0,0]);x.fill();x.restore()}
  x.strokeStyle='#0D1428';x.lineWidth=5;x.beginPath();x.moveTo(w.x+w.w/2,w.y);x.lineTo(w.x+w.w/2,w.y+w.h);x.moveTo(w.x,w.y+w.h*.45);x.lineTo(w.x+w.w,w.y+w.h*.45);x.stroke();
  x.fillStyle='#121A30';x.fillRect(w.x-12,w.y+w.h+7,w.w+24,9)}}
// the street lamp: pole at world x, with its warm pool of light on the stones
function squareLamp(x,lx=SQ.LAMP,on=1,t=0){const fl=1-.04*Math.max(0,Math.sin(t*23)*Math.sin(t*7.1));x.fillStyle='#0C1222';x.fillRect(lx-9,300,18,560);x.fillRect(lx-26,850,52,16);x.beginPath();x.moveTo(lx-30,300);x.lineTo(lx+30,300);x.lineTo(lx+20,250);x.lineTo(lx-20,250);x.closePath();x.fill();
 x.fillStyle=`rgba(255,215,150,${.95*on*fl})`;x.fillRect(lx-18,254,36,42);x.fillStyle='#0C1222';x.fillRect(lx-24,244,48,10);
 let g=x.createLinearGradient(0,300,0,980);g.addColorStop(0,`rgba(255,210,140,${.22*on*fl})`);g.addColorStop(1,'rgba(255,190,120,0)');x.fillStyle=g;x.beginPath();x.moveTo(lx-22,300);x.lineTo(lx+22,300);x.lineTo(lx+420,980);x.lineTo(lx-420,980);x.closePath();x.fill();
 g=x.createRadialGradient(lx,900,10,lx,900,460);g.addColorStop(0,`rgba(255,200,130,${.26*on*fl})`);g.addColorStop(1,'rgba(255,200,130,0)');x.fillStyle=g;x.beginPath();x.ellipse(lx,900,460,90,0,0,7);x.fill()}
function squareGround(x){let g=x.createLinearGradient(0,SQ.BASE,0,1200);g.addColorStop(0,'#1A2443');g.addColorStop(1,'#0E1529');x.fillStyle=g;x.fillRect(SQ.XA-800,SQ.BASE,SQ.XB-SQ.XA+1600,700);
 x.fillStyle='#2A3557';x.fillRect(SQ.XA-800,SQ.BASE,SQ.XB-SQ.XA+1600,14);x.fillStyle='#141B33';x.fillRect(SQ.XA-800,SQ.BASE+14,SQ.XB-SQ.XA+1600,8);
 // cobblestones: rows get taller toward the viewer
 const r=rng(55);let y=SQ.BASE+30;let row=0;while(y<1220){const hgt=10+row*2.2,wd=40+row*7;let px=SQ.XA-800+(row%2)*wd/2;x.fillStyle='rgba(8,12,26,.55)';
  while(px<SQ.XB+800){x.beginPath();x.roundRect(px+2,y+1,wd-5+r()*4,hgt-3,Math.min(8,hgt/2));x.globalAlpha=.25+r()*.2;x.fill();px+=wd}x.globalAlpha=1;y+=hgt+2;row++}
 // wet sheen bands
 x.fillStyle='rgba(120,150,210,.05)';for(let i=0;i<6;i++)x.fillRect(SQ.XA-800,700+i*70,SQ.XB-SQ.XA+1600,6)}
// wet-stone reflection of the facade layer (its windows) about the base line
function squareRefl(cam,a=.22){reflect('fac',SQ.BASE+12,cam,a,7)}
// ---- violin and bow. a = violin axis angle (0 points right). Returns the points a film needs for hands. -----
function violinGeo(chin,a,s,face=1){const d=[Math.cos(a)*face,Math.sin(a)],n=[-d[1],d[0]],at=(u,v=0)=>[chin[0]+d[0]*u*s+n[0]*v*s,chin[1]+d[1]*u*s+n[1]*v*s];
 return {d,n,a,s,face,tail:at(0),body:at(70),bridge:at(92),neckEnd:at(205,10),scroll:at(268),at}}
function drawViolin(x,V){const {a,s,face}=V,ang=Math.atan2(V.d[1],V.d[0]);x.save();x.translate(V.body[0],V.body[1]);x.rotate(ang);x.scale(s,s);
 x.lineWidth=6;x.strokeStyle=INK;x.fillStyle='#B4602B';
 x.beginPath();x.ellipse(-34,0,40,46,0,0,7);x.fill();x.stroke();x.beginPath();x.ellipse(34,0,34,40,0,0,7);x.fill();x.stroke();
 x.fillStyle='#B4602B';x.fillRect(-30,-26,60,52);x.fillStyle='#8A4520';x.beginPath();x.ellipse(-34,0,26,30,0,0,7);x.fill();
 x.fillStyle='#1A1210';x.fillRect(40,-9,150,18);x.beginPath();x.arc(198,0,14,0,7);x.fill();
 x.strokeStyle='#E8D9B8';x.lineWidth=1.6;for(const v of [-6,-2,2,6]){x.beginPath();x.moveTo(-60,v*.6);x.lineTo(190,v);x.stroke()}
 x.fillStyle='#E8D9B8';x.fillRect(18,-14,6,28);x.restore()}
// bow: crosses the strings at the bridge; u (0..1) is how far the bow has travelled
function bowGeo(V,u,len=210,tilt=-1.05){const ang=Math.atan2(V.d[1],V.d[0])+tilt*V.face,d=[Math.cos(ang),Math.sin(ang)];
 const frog=[V.bridge[0]-d[0]*len*u*V.s,V.bridge[1]-d[1]*len*u*V.s];return {frog,tip:[frog[0]+d[0]*len*V.s,frog[1]+d[1]*len*V.s],d}}
function drawBow(x,G,s){x.save();x.lineCap='round';x.strokeStyle=INK;x.lineWidth=9*s;x.beginPath();x.moveTo(G.frog[0],G.frog[1]);x.lineTo(G.tip[0],G.tip[1]);x.stroke();x.strokeStyle='#5A3A22';x.lineWidth=4.5*s;x.stroke();
 x.strokeStyle='rgba(240,232,210,.9)';x.lineWidth=2*s;const o=[-G.d[1]*9*s,G.d[0]*9*s];x.beginPath();x.moveTo(G.frog[0]+o[0],G.frog[1]+o[1]);x.lineTo(G.tip[0]+o[0]*.3,G.tip[1]+o[1]*.3);x.stroke();x.restore()}
// a hat on the stones, for coins
function hatOnGround(x,cx,y,s){x.save();x.translate(cx,y);x.scale(s,s);x.fillStyle='#3A4568';x.strokeStyle=INK;x.lineWidth=5;x.beginPath();x.ellipse(0,0,70,16,0,0,7);x.fill();x.stroke();x.beginPath();x.ellipse(0,-6,44,12,0,Math.PI,0);x.lineTo(44,-6);x.fill();x.restore()}
