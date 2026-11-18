#!/usr/bin/env python3
"""Create a film folder from the engine. usage: new_film.py <folder>"""
import argparse, shutil
from pathlib import Path
from common import SKILL

a = argparse.ArgumentParser(); a.add_argument("folder")
o = a.parse_args(); d = Path(o.folder)
if d.exists() and any(d.iterdir()):
    raise SystemExit(f"{d} is not empty")
d.mkdir(parents=True, exist_ok=True)
shutil.copytree(SKILL / "engine", d, dirs_exist_ok=True)
shutil.copy(SKILL / "templates" / "film_2d.js", d / "film.js")
shutil.copy(SKILL / "templates" / "audio_mix.py", d / "audio_mix.py")
print("film folder ready:", d.resolve())
