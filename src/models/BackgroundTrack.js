class BackgroundTrack {
  constructor(name, audio) {
    this.name = name;
    this.audioElement = audio;
    this.audioElement.loop=true;
  }

  play() {
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }

  changeSource(newAudio) {
    this.audioElement.pause();

    // Reset the audio element by removing the old source and adding the new one
    this.audioElement.src = '';
    this.audioElement.load();
    this.audioElement.src = newAudio.src;
    this.audioElement.load();
    
    this.audioElement.play();
  }
}

export default BackgroundTrack;
