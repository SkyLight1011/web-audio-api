# web-audio-api
Playing around with Web Audio API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

This is just an experiment to build a Synth with Web Audio API

# Start the static server
Use `npm start` to run a static server (probably will be updated later to "not-so-static")
then open `http://localhost:4321/` in browser.

# Ideas
* Synth (probably modular)
  * Single or multivoice, with variable number of generators
  * Standard `sine`, `triangle`, `sawtooth` and `square` waveforms plus Noize
  * Can have one or more modulators (envelope or LFO)
* Mixer
  * Should be able to add effects to a synth by linking it to different effect nodes
  * Each track should have own volume control
  * (TBD) Should be able to assign multiple instruments to a single mixer track
* Sequencer
  * Should have multiple tracks, able to assign a synth to track
  * Should be able to play notes in sequence
* Server
  * Add ability to save presets and tunes (describe file format)
