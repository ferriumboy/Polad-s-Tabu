

import { Language } from "../types";

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      // Bind events
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // We want to check both partial (fast) and final results
        const textToCheck = (finalTranscript + ' ' + interimTranscript).trim();
        if (this.onResultCallback && textToCheck) {
          this.onResultCallback(textToCheck);
        }
      };

      this.recognition.onerror = (event: any) => {
        // Ignore 'no-speech' errors as they are common when pausing
        if (event.error === 'no-speech') return;

        console.warn('Speech Recognition Error:', event.error);
        if (this.onErrorCallback) this.onErrorCallback(event.error);
      };

      this.recognition.onend = () => {
        // Auto-restart if it stops unexpectedly while supposed to be listening
        if (this.isListening) {
           try {
             this.recognition.start();
           } catch (e) {
             // Ignore errors during auto-restart
           }
        }
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  start(language: Language, onResult: (text: string) => void, onError?: (err: string) => void) {
    if (!this.recognition) return;

    // Map internal language to BCP 47 tags
    const langMap: Record<Language, string> = {
      AZ: 'az-AZ',
      EN: 'en-US',
      RU: 'ru-RU',
      ES: 'es-ES',
      FR: 'fr-FR',
      PT: 'pt-PT',
      AR: 'ar-SA'
    };

    this.recognition.lang = langMap[language];
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.isListening = true;

    try {
      this.recognition.start();
      console.log(`Speech recognition started in ${this.recognition.lang}`);
    } catch (e: any) {
      // Handle the "already started" error gracefully
      if (e.message && e.message.includes('already started')) {
        console.log("Speech recognition is already active. Updated callbacks.");
        // We don't need to do anything else; callbacks are updated.
      } else if (e.name === 'NotAllowedError' || e.name === 'SecurityError') {
         console.error("Mic Access Denied", e);
         if (onError) onError("MIC_DENIED");
      } else {
        console.error("Error starting speech recognition", e);
      }
    }
  }

  stop() {
    if (!this.recognition) return;
    this.isListening = false;
    this.onResultCallback = null;
    try {
      // abort() stops immediately and does not return a final result, 
      // which is better for cleaning up between cards or game states.
      this.recognition.abort(); 
    } catch (e) {
      // ignore
    }
  }

  abort() {
     this.stop();
  }
}

export const speechService = new SpeechService();