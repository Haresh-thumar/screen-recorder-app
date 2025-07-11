import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-screen-recording',
    imports: [],
    templateUrl: './screen-recording.component.html',
    styleUrl: './screen-recording.component.scss'
})
export class ScreenRecordingComponent {
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;

  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];
  recordedBlob: Blob | null = null;

  isRecording: boolean = false;
  isDownloading: boolean = false;

  async startRecording() {
    try {
      // Request screen capture
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
        audio: true, // Include audio if needed
      });

      // Preview the screen recording in the video element
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();

      this.mediaRecorder = new MediaRecorder(stream);

      // Collect recorded chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // Handle the stop event
      this.mediaRecorder.onstop = () => {
        this.recordedBlob = new Blob(this.recordedChunks, {
          type: 'video/webm',
        });
        this.recordedChunks = [];
        this.previewRecording();
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;

      // Stop all media tracks
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  previewRecording() {
    if (this.recordedBlob) {
      const videoURL = URL.createObjectURL(this.recordedBlob);
      this.videoElement.nativeElement.srcObject = null; // Clear the live stream
      this.videoElement.nativeElement.src = videoURL; // Set the recorded video
      this.videoElement.nativeElement.play();
    }
  }

  downloadRecording() {
    if (this.recordedBlob) {
      this.isDownloading = true;
      const a = document.createElement('a');
      const videoURL = URL.createObjectURL(this.recordedBlob);
      a.href = videoURL;
      a.download = 'screen-recording.mp4';
      document.body.appendChild(a); // Required for Firefox
      a.click();
      document.body.removeChild(a);
      this.isDownloading = false;
    }
  }
}
