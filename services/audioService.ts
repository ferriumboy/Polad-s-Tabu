
export const SOUND_URLS = {
  CORRECT: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
  TABOO: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
  PASS: 'https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3',
  TIME_UP: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
  CLICK: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'
};

class AudioService {
  private sfxCache: Record<string, HTMLAudioElement> = {};
  private isMuted: boolean = false;

  constructor() {
    // Preload SFX
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.5;
      this.sfxCache[key] = audio;
    });
  }

  playSFX(key: keyof typeof SOUND_URLS) {
    if (this.isMuted) return;
    
    if (this.sfxCache[key]) {
      const sound = this.sfxCache[key];
      // Clone/Reset to allow rapid firing of the same sound
      sound.currentTime = 0; 
      sound.play().catch(e => console.warn("SFX play error", e));
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const audioService = new AudioService();