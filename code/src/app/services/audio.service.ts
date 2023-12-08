// audio.service.ts
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  snippetEnded$ = new EventEmitter<void>();

  constructor() {
    // Setup an event listener to emit an event when the audio ends
    this.audio.onended = () => {
      this.snippetEnded$.emit();
    };
  }

  playSnippet(songPath: string | undefined, startTime: number, duration: number) {
    // Set the source and playback starting point
    if(!songPath) return;
    this.audio.src = songPath;
    this.audio.currentTime = startTime;

    // Start playing the song snippet
    this.audio.play();

    // Set a timeout to stop playback when the snippet duration ends
    setTimeout(() => this.stopPlayback(), duration * 1000);
  }

  stopPlayback() {
    this.audio.pause();
    this.audio.currentTime = 0; // Reset the playback to the beginning
    // Note: The 'onended' event will trigger here as we pause the audio
  }

  // Cleanup method - stops the audio and remove event listeners
  cleanup() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.onended = null;
  }
}
