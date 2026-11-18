"""Sound mix for one film. build.py runs this inside the film folder.
Edit the marked block only. Plants and EVENTS come from film.js, so sound stays on the picture's clock."""
import json, os, sys
sys.path.insert(0, os.environ["CARTOON_SCRIPTS"])
from audio_kit import Mix

info = json.load(open("film.json"))
m = Mix(info["dur"], seed=9)

# ---- EDIT FROM HERE: set this from the sound brief ----
SFX, MUSIC, VOICE = True, False, None     # VOICE = "vo.mp3" to lay in a voiceover

if SFX:
    m.rain_bed([(0, .9), (info["dur"], .9)])
    m.drone([(0, 0), (4, .12), (8, .25), (info["dur"], .1)])
    for t in info["plants"].get("musician", []):
        m.step(t - .02, pan=-.1, g=.3, surface="concrete")
    for e in info["events"]:
        t, k = e["t"], e["k"]
        if k == "cloth": m.cloth(t, pan=0, g=.1)
        elif k == "play":       # the violin line (code-made, no samples): A minor, slow and warm
            m.melody(t, [(69, 1), (72, 1), (76, 2), (74, 1), (72, 1), (71, 2), (69, 1), (72, 1), (76, 1), (79, 1), (77, 2), (76, 3)], g=.12)
        elif k == "windows": m.sfx("impactbell-heavy-000", t, 1.6, 2600, .05, .3, .6)
if MUSIC:
    m.music(mood="warm")                  # or m.music_file("track.mp3") if the person supplied one
if VOICE:
    m.voice(VOICE, at=.5)
# ---- TO HERE ----
m.write("audio.wav")
