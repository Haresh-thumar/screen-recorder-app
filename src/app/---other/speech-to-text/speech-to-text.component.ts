import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// 1. Declare the standard and vendor-prefixed properties on the Window interface
declare global {
  interface Window {
    SpeechRecognition: any; // Use 'any' for simplicity with the API object
    webkitSpeechRecognition: any;
  }
}

// 2. Define the unified type (This is helpful but optional for the fix)
type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

@Component({
  selector: 'app-speech-to-text',
  imports: [FormsModule,],
  templateUrl: './speech-to-text.component.html',
  styleUrl: './speech-to-text.component.scss'
})
export class SpeechToTextComponent implements OnInit, OnDestroy {

  // Public properties for the template
  transcript: string = '';
  isListening: boolean = false;
  selectedLanguage: string = 'en-US'; // Default to English (US)
  errorMessage: string = '';

  // Internal properties
  private recognition: any;
  public languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'gu-IN', name: 'Gujarati (India)' },
  ];

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    // 1. Get the SpeechRecognition constructor, using type assertion to satisfy TS
    const SpeechRecognition: SpeechRecognitionType =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // 2. Check for browser support
    if (typeof SpeechRecognition === 'undefined') {
      this.errorMessage = 'Speech Recognition is not supported in this browser. Please use Google Chrome.';
      return;
    }

    // 3. Initialize the recognition object
    this.recognition = new SpeechRecognition();

    // 4. Set configuration
    this.recognition.continuous = true;      // Don't stop when silence is detected
    this.recognition.interimResults = true;  // Get results as the user speaks

    // Handle the 'result' event
    this.recognition.onresult = (event: SpeechRecognitionType) => {
      // Use ngZone.run to update the component properties inside Angular's zone
      this.ngZone.run(() => {
        let finalTranscript = '';

        // Loop through all new results
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            // Append only final result to the existing transcript
            finalTranscript += result[0].transcript;
          }
        }

        // Append the new final text, ensuring a space is added between segments
        if (finalTranscript.length > 0) {
          this.transcript = (this.transcript + ' ' + finalTranscript).trim();
        }
      });
    };

    // Handle the 'error' event
    this.recognition.onerror = (event: any) => {
      this.ngZone.run(() => {
        this.isListening = false;
        this.errorMessage = `Error: ${event.error}`;
        console.error('Speech Recognition Error:', event.error);
      });
    };

    // Handle the 'end' event
    this.recognition.onend = () => {
      this.ngZone.run(() => {
        // Only set listening to false if an error didn't already occur
        if (!this.errorMessage) {
          this.isListening = false;
        }
        console.log('Speech recognition service disconnected.');
      });
    };
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Toggles the speech recognition on and off.
   */
  toggleListening(): void {
    if (this.recognition) {
      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
        console.log('Listening stopped.');
      } else {
        // Clear any previous error message
        this.errorMessage = '';
        // Set the language
        this.recognition.lang = this.selectedLanguage;
        // Start the service
        this.recognition.start();
        this.isListening = true;
        console.log(`Listening started in ${this.selectedLanguage}...`);
      }
    }
  }

  /**
   * Clears the textarea value and stops listening.
   */
  clearTranscript(): void {
    if (this.isListening && this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
    this.transcript = '';
    this.errorMessage = '';
  }

}
