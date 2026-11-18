// STARTER FILM (2D). A working 12 s skeleton on the square set: copy it, then replace the shots and the action.
// It shows the patterns that matter: one world with fixed positions, every shot a camera on it, a planted-foot walk,
// a prop driven from one function with the hands reaching it every frame, world lights that change over time, and the audit report.
const START=[560,880],STOP=[1280,880],WALK0=.6,WALK1=3.3,LIFT0=3.8,LIFT1=4.8,PLAY0=4.9,LIGHT0=8.1;
const inW=makeWalk({pts:[START,STOP],t0:WALK0,t1:WALK1,steps:6,scale:squareScale});
const lift=t=>easeIO(seg(t,LIFT0,LIFT1));
// the windows wake up one by one in a fixed, seeded order once the music has been going a while
const ORDER=(()=>{const r=rng(8),o=SQ_WIN.map((w,i)=>[r(),i]).sort((a,b)=>a[0]-b[0]);const k=[];o.forEach((q,n)=>k[q[1]]=n);return k})();
const lit=(i,t)=>ease(seg(t,LIGHT0+ORDER[i]*.045,LIGHT0+ORDER[i]*.045+.5));
const sil=(i,t)=>ORDER[i]%3==0?ease(seg(t,LIGHT0+ORDER[i]*.045+.4,LIGHT0+ORDER[i]*.045+.9)):0;
const bowU=t=>t<PLAY0?.35:.55+.2*Math.sin((t-PLAY0)*2.3);
function musician(t){const w=inW.at(t),s=w.s;const p={x:w.c[0],y:standY(w.c[1],s),s,face:1,breath:t*2,time:t,
  look:kf(t,[[0,.5],[3.5,.5],[4.2,.75],[11,.75]]),lookY:kf(t,[[0,.15],[10.6,.15],[11.2,-.75]]),
  blink:Math.max(blinkAt(t,[1.7,3.6]),kf(t,[[5.4,0],[5.8,1],[10.3,1],[10.5,0]])),
  brow:kf(t,[[0,.2],[5.5,.2],[6,.55],[10.4,.55],[10.8,.9]]),sad:kf(t,[[0,.35],[10.4,.35],[10.9,.1]]),
  mouth:kf(t,[[0,.35],[5.6,.35],[6.2,.6],[10.5,.6],[11,1]]),tilt:kf(t,[[0,0],[5,0],[5.4,.08],[10.4,.08],[10.9,-.06]])};
 walkPose(p,w,{arms:false});
 // resting hands: arms hang straight (near full reach) and swing against the legs while walking, less on the violin side
 const sw=w.moving?clamp((w.rW[0]-w.lW[0])/w.s/110,-1,1):0;p._rest={r:[72-sw*16,222],l:[-62+sw*24,216]};return p}
// the violin and the bow, from the pose: hanging from the right hand while walking, under the chin while playing
function violinNow(p,t){const k=lift(t),chin=[p.x+18*p.s,p.y-24*p.s];
 // hanging: the hand holds the neck at its natural resting point, the body hangs below it
 const hn=[p.x+p._rest.r[0]*p.s,p.y+p._rest.r[1]*p.s],hd=[Math.cos(-1.62),Math.sin(-1.62)],hang=violinGeo([hn[0]-(hd[0]*205-hd[1]*10)*p.s,hn[1]-(hd[1]*205+hd[0]*10)*p.s],-1.62,p.s),play=violinGeo(chin,.26,p.s);
 const tail=[lerp(hang.tail[0],play.tail[0],k),lerp(hang.tail[1],play.tail[1],k)];return violinGeo(tail,lerp(-1.62,.26,k),p.s)}
// the bow aims at the violin's playing position (not the half-raised one), so the hand's path stays in reach
function bowNow(p,V,t){const k=lift(t),play=bowGeo(violinGeo([p.x+18*p.s,p.y-24*p.s],.26,p.s),bowU(t));const hangFrog=[p.x+p._rest.l[0]*p.s,p.y+p._rest.l[1]*p.s],hangTip=[hangFrog[0]+30*p.s,hangFrog[1]+205*p.s];
 const frog=[lerp(hangFrog[0],play.frog[0],k),lerp(hangFrog[1],play.frog[1],k)],tip=[lerp(hangTip[0],play.tip[0],k),lerp(hangTip[1],play.tip[1],k)];
 const L_=Math.hypot(tip[0]-frog[0],tip[1]-frog[1])||1;return {frog,tip,d:[(tip[0]-frog[0])/L_,(tip[1]-frog[1])/L_]}}
FILM={dur:12,cuts:[0,105,165,240,315,360],fadeIn:.6,fadeOut:.8,
 cam(s,u,t){const c=[{x:lerp(1060,1180,ease(u)),y:530,z:lerp(.56,.6,u),b:[2,.4,0]},
  {x:1330,y:560,z:lerp(1.05,1.12,ease(u)),b:[5,2.4,0]},
  {x:1340,y:470,z:lerp(1.9,2.05,u),b:[14,9,0]},
  {x:lerp(1300,1240,ease(u)),y:lerp(470,520,ease(u)),z:lerp(.66,.58,ease(u)),b:[2,.4,0]},
  {x:1330,y:460,z:lerp(1.5,1.6,u),b:[10,6,0]}][s];return c},
 draw(t,cam){
  let x=layer('sky',cam,.35);squareSky(x,t);
  x=layer('fac',cam,.85);squareFacades(x,i=>lit(i,t),i=>sil(i,t));
  x=layer('gnd',cam);squareGround(x);
  const p=musician(t),V=violinNow(p,t),B=bowNow(p,V,t);
  // the hands reach the props every frame: right hand on the neck, left hand on the bow's frog
  p.hands={r:w2l(p,V.neckEnd),l:w2l(p,B.frog)};p.tuck={r:t>WALK1};p.showH={l:true,r:true};   // bow arm: no tuck, so its elbow hangs out to the side; violin arm: tucked once he stops (arm still straight, so no pop), so its elbow sits under the violin
  const a=layer('act',cam);squareLamp(a,SQ.LAMP,1,t);hatOnGround(a,1430,906,.8);softShadow(a,p.x,STOP[1]+6,120*p.s,16*p.s,.5);
  const h=layer('hero',cam),hp=actor(h,'musician',HERO,p,cam,'rgba(255,205,140,1)',1);
  drawViolin(h,V);drawBow(h,B,p.s);gripHand(h,V.neckEnd[0],V.neckEnd[1],V.a,HERO,p.s*.8);gripHand(h,B.frog[0],B.frog[1],Math.atan2(B.d[1],B.d[0]),HERO,p.s*.8);
  contact('hand-neck',h2w(hp,'r'),V.neckEnd);contact('hand-bow',h2w(hp,'l'),B.frog);
  x=layer('rain');drawRain(x,t,.55,900);groundHits(x,t,900,1080,10);
  comp([['sky',cam.b[0]],['fac',cam.b[1]]]);squareRefl(cam);blit(ctx,L.gnd,cam.b[1]*.4);blit(ctx,L.act,0);blit(ctx,L.hero,0);blit(ctx,L.rain,0)},
 warm(t){return .55*ease(seg(t,LIGHT0,LIGHT0+3))},
 plants(){return {musician:inW.plants()}}};
// sound timeline: sound events live on the same clock as the picture
say(LIFT0+.1,'cloth');say(PLAY0,'play');say(LIGHT0+.3,'windows');
