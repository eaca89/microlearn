# /cartoon: a Claude skill that turns a story into a cartoon

Give Claude a story and this skill makes a short cartoon film from code: outlined characters, a night palette with warm lit windows, camera moves and sound effects, delivered as an MP4. No AI video generator is used.

## Install in Claude (chat)
1. Download `cartoon.zip` and keep it zipped.
2. In Claude (claude.ai), click **Customize** on the left, then under **Skills** click **+ Add** → **Upload skill** and pick the zip. After a quick safety scan the skill appears with its switch on.
3. Start a new chat and type `/cartoon` followed by your story, or ask for a 10-second test first.

## Install in Claude Code
Put the `cartoon` folder in your project at `.claude/skills/cartoon/`, or hand the zip to Claude Code and ask it to install the skill. Then type `/cartoon` and your story.

## Good to know
- A full film is a lot of code and a long render, so the free plan's limits usually run out before one is finished. A paid Claude plan is the realistic way to use it.
- For a voiceover, write the script with the skill, make the audio in ElevenLabs or record your own voice, and give Claude the MP3 and the text. The film is then timed to the words.
- Ask for a storyboard first: changes are cheap before the render and slow after it.

License: MIT, see `LICENSE`.
