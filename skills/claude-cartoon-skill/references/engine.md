# Engine toolkit

Reuse this. Writing the film is only `film.js` and a few lines of `audio_mix.py`.

## Film structure
`film.js` sets a global `FILM`, then lists sound events:

```js
FILM={dur:30,cuts:[0,90,150,...,900],fadeIn:.5,fadeOut:.6,
 cam(shot,u,t){return {x,y,z,b:[...]}},   // u is 0..1 through the shot
 draw(t,cam,shot,u){...},                 // paints layers, then composites
 warm(t){return 0},                        // optional golden grade 0..1
 plants(){return {name:walk.plants()}}};  // footfall times for the mix
say(3.2,'door');                           // sound event on the picture's clock
```

`cuts` are frames at 30 fps. The first is 0 and the last equals `dur*30`. All pose values are pure functions of `t`.

## Core (`core.js`)
- `layer(name,cam,parallax)` clears a named layer and returns its context with the camera applied.
- `comp([[name,blur,alpha],...])` draws layers to the screen, bottom first. `blit(ctx,L.name,blur)` adds another.
- `reflect(name,floorY,cam)` adds a wet-floor reflection.
- `kf`, `lerp`, `ease`, `easeIO`, `seg`, `clamp`, `rng(seed)`.
- `report(id,p)` and `contact(name,a,b)` feed the audit. `REPORT.sym=1` marks a symbolic frame.

## Characters (`chars.js`)
`HERO, FRIEND, WOMAN, STRANGER, GUEST_A, GUEST_B`. Add new ones by copying a colour object. Optional keys: `hair`, `coat`.

`actor(x,id,CHAR,pose,cam,rimColour,rimSide)` draws with rim light and reports to the audit. It returns the pose, with `p._h` holding hands. `h2w(p,'r')` gives a hand's world position and `w2l(p,[x,y])` converts back.

Pose keys are listed at the top of `drawPerson`. Seated figures use `noLegs:true` behind a table. Standing on floor line `y`: `y:standY(y,s)`.

## Motion (`motion.js`)
```js
const w=makeWalk({pts:[[x0,y0],[x1,y1]],t0:2,t1:5,steps:6,scale:cafeScale}); // or s:.66
function who(t){const q=w.at(t),p={x:q.c[0],y:standY(q.c[1],q.s),s:q.s,face:1,breath:t*2};return walkPose(p,q)}
```
`walkPose` gives planted feet and swinging arms, and sets `p.walk`. Pass `{arms:false}` when hands hold something. Also: `ramp`, `blinkAt(t,[times])`, `talk(t,a,b)` for a speaking mouth.

## Props (`props.js`)
`drawUmbrella` with `umbrellaGeo`, `drawCup`, `saucer`, `cupGrip`, `gripHand`, `openHand`, `sideTable`, `sideChair`, `drawClock`, `drawRain`, `rainHits`, `groundHits`, `softShadow`.

## Sets (`sets/`)
- `square.js` (the starter film's set): an old-town square at night. `squareSky(x,t)` at parallax .35, `squareFacades(x,lit,sil)` at .85 (`lit(i)` and `sil(i)` light window `i` of `SQ_WIN` and put a listener in it), `squareGround`, `squareLamp(x,lx,on,t)`, `squareRefl(cam)` (needs the facades on layer `fac`), `squareScale(y)`, `hatOnGround`. Floor from 660 down; a figure at y 880 has `s` about .75. Violin: `violinGeo(chin,angle,s)` gives `tail`, `bridge`, `neckEnd`; `drawViolin`, `bowGeo(V,u)` and `drawBow`.
- `street.js`: `streetSky(x,sun)` at parallax .35, `streetBuildings` at .65, `streetGround`, `stopPole`, `drawBus(x,X)`. Floor line `GY`=930, with `s` about .66.
- `cafe.js`: `cafeOutside`, `cafeRain`, `cafeWall`, `cafeFloor`, `pendant`, `doorLeaf`, `doorLight`, `backTable`, `cafeRefl`, `cafeScale(y)`, `DOOR`. The room spans x -900 to 3700 and the floor runs from 642 down. Any shot at any x works, because it is one room.
- `room.js`: `drawRoom(x,night,t)`, `drawRoomTable` for waist-up scenes across a table, plus `drawLift` and `drawHall`. Seated figures: `x` about 650 and 1270, `y` 560, `s` 1, drawn before the table.
- `symbolic.js`: `drawVoid`, `slab`, `drawSils`, `makeChunks`, `drawChunks`, and silhouettes. See `symbolic-beats.md`.

New sets follow the same rule: flat shapes, the night palette, ink outlines on characters, one world. Add new sets rather than reworking the existing ones.

## Patterns worth copying from the starter film
- One function per prop (`violinNow`, `bowNow`) drives both the prop and the hands that hold it, every frame.
- `contact()` on every held prop.
- World lights that change over time (`lit(i,t)`), in a fixed seeded order so every shot agrees.

## Scripts
| Script | Does |
|---|---|
| `doctor.py` | Checks and installs what is needed |
| `new_film.py <folder>` | Creates a film folder |
| `stills.py <folder> <out.jpg> <times>` | Contact sheet of chosen times |
| `build.py <folder> --out x.mp4 [--shots ...] [--audio-only] [--jobs N] [--crf N]` | Everything from render to audit |
| `storyboard.py <folder>` | Numbered preview of every shot, before rendering |
| `audit.py <folder> <file.mp4>` | The audit alone |
| `align.py <folder> <mp3> <script.txt>` | Word timings from a voiceover |
| `bundle_player.py <folder>` | One-file HTML player with WebM export |
