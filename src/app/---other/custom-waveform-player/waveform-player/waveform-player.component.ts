import { Component, ElementRef, HostListener, inject, Input, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-waveform-player',
  imports: [],
  templateUrl: './waveform-player.component.html',
  styleUrl: './waveform-player.component.scss'
})
export class WaveformPlayerComponent {

  private ngZone = inject(NgZone)

  @Input() audioUrl: string = '';
  @Input() trackHeight: number = 50;
  @Input() trackColor: string = '#eee';
  @Input() activeTrackColor: string = '#d81b60';
  @Input() trackBeatWidth: number = 1.5;
  @Input() trackBeatSpacing: number = 1.5;

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;

  private ctx!: CanvasRenderingContext2D;
  private audioContext: AudioContext | null = null;
  private buffer: AudioBuffer | null = null;
  private peaks: number[] = [];
  private animationFrameId: number = 0;
  private loadAttempts: number = 0;
  private maxLoadAttempts: number = 3;

  isPlaying: boolean = false;
  isLoading: boolean = true;
  loadError: boolean = false;

  ngAfterViewInit() {
    // Delay initialization slightly to ensure DOM is fully rendered
    setTimeout(() => {
      this.setupAudio();
    }, 100);
  }

  setupAudio() {
    const audio = this.audioRef.nativeElement;
    // Set up event listeners
    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.drawWaveform(1); // fill waveform fully
    });
    audio.addEventListener('canplaythrough', () => {
      // Only load audio context after the audio element is ready
      if (!this.audioContext) {
        this.loadAudio();
      }
    });
    audio.addEventListener('error', (e) => {
      console.error('Audio element error:', e);
      this.retryLoadAudio();
    });
    // Force the audio to load
    audio.load();
  }

  retryLoadAudio() {
    this.loadAttempts++;
    if (this.loadAttempts < this.maxLoadAttempts) {
      console.log(`Retrying audio load (attempt ${this.loadAttempts})`);
      setTimeout(() => {
        this.loadAudio();
      }, 1000);
    } else {
      console.error('Max load attempts reached');
      this.isLoading = false;
      this.loadError = true;
    }
  }

  async loadAudio() {
    try {
      this.isLoading = true;
      this.loadError = false;
      // Create new AudioContext only when needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      // Fetch the audio file
      const response = await fetch(this.audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      // Decode the audio data
      this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      // Initialize the canvas
      this.resizeCanvas();
      this.extractPeaks();
      this.drawWaveform(0);
      this.isLoading = false;
    } catch (err) {
      console.error('Error loading audio:', err);
      this.retryLoadAudio();
    }
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = this.trackHeight;
    // Set physical canvas size
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    // Get context and set scaling
    this.ctx = canvas.getContext('2d')!;
    if (this.ctx) {
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  extractPeaks() {
    if (!this.buffer || !this.canvasRef) return;
    const channelData = this.buffer.getChannelData(0);
    const canvas = this.canvasRef.nativeElement;
    const canvasWidth = canvas.clientWidth || 1000; // Fallback width
    const totalBeats = Math.floor(canvasWidth / (this.trackBeatWidth + this.trackBeatSpacing));
    const step = Math.floor(channelData.length / totalBeats) || 1; // Ensure step is at least 1
    this.peaks = [];
    for (let i = 0; i < channelData.length; i += step) {
      const endIndex = Math.min(i + step, channelData.length);
      const slice = channelData.slice(i, endIndex);
      // Find min and max safely
      let min = 0, max = 0;
      for (let j = 0; j < slice.length; j++) {
        min = Math.min(min, slice[j]);
        max = Math.max(max, slice[j]);
      }
      this.peaks.push((max - min) / 2);
    }
  }

  drawWaveform(progress: number) {
    if (!this.ctx || !this.canvasRef || this.peaks.length === 0) return;
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const halfHeight = this.trackHeight / 2;
    this.ctx.clearRect(0, 0, width, this.trackHeight);
    const progressWidth = progress * width;
    let x = 0;
    for (let i = 0; i < this.peaks.length; i++) {
      const h = this.peaks[i] * this.trackHeight;
      this.ctx.fillStyle = x <= progressWidth ? this.activeTrackColor : this.trackColor;
      this.ctx.fillRect(x, halfHeight - h / 2, this.trackBeatWidth, h);
      x += this.trackBeatWidth + this.trackBeatSpacing;
    }
  }

  playAudio() {
    if (!this.audioRef) return;
    const audio = this.audioRef.nativeElement;
    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    // Reset if playback was completed
    if (audio.ended || audio.currentTime === audio.duration) {
      audio.currentTime = 0;
    }
    // Play the audio
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Play error:', error);
        this.isPlaying = false;
      });
    }
    this.isPlaying = true;
    // Use NgZone to run animation outside Angular's change detection for better performance
    this.ngZone.runOutsideAngular(() => {
      this.trackPlayback();
    });
  }

  stopAudio() {
    if (!this.audioRef) return;
    const audio = this.audioRef.nativeElement;
    audio.pause();
    this.isPlaying = false;
    cancelAnimationFrame(this.animationFrameId);
    this.drawWaveform(audio.currentTime / audio.duration);
  }

  trackPlayback = () => {
    if (!this.audioRef) return;
    const audio = this.audioRef.nativeElement;
    const progress = audio.currentTime / audio.duration;
    this.drawWaveform(progress);
    if (!audio.paused && !audio.ended) {
      this.animationFrameId = requestAnimationFrame(this.trackPlayback);
    } else if (audio.ended) {
      this.ngZone.run(() => {
        this.isPlaying = false;
      });
      this.drawWaveform(1);
    }
  };

  onCanvasClick(event: MouseEvent) {
    if (!this.audioRef || !this.canvasRef) return;
    const audio = this.audioRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progress = clickX / canvas.clientWidth;
    audio.currentTime = progress * audio.duration;
    this.drawWaveform(progress);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.buffer) {
      this.resizeCanvas();
      this.extractPeaks();
      if (this.audioRef) {
        const audio = this.audioRef.nativeElement;
        this.drawWaveform(audio.currentTime / audio.duration);
      }
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.audioContext) {
      this.audioContext.close();
    }
  }


}
