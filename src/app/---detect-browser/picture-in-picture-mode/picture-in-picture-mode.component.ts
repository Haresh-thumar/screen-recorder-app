import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-picture-in-picture-mode',
  imports: [],
  templateUrl: './picture-in-picture-mode.component.html',
  styleUrl: './picture-in-picture-mode.component.scss'
})
export class PictureInPictureModeComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  private pipPrimed = false; // user gesture unlock
  private isRequestingPiP = false;

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;

    if (!document.pictureInPictureEnabled) {
      console.warn('❌ Picture-in-Picture not supported in this browser');
      return;
    }

    // Tab switch listener
    document.addEventListener('visibilitychange', async () => {
      if (!this.pipPrimed) return;

      if (document.hidden) {
        // User left tab → enter PiP if not already in PiP and video playing
        if (!document.pictureInPictureElement && !video.ended) {
          await this.enterPiP(video);
        }
      } else {
        // User returned → exit PiP but do NOT pause video
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      }
    });

    // Unlock PiP on first gesture (play or manual toggle)
    video.addEventListener('play', () => {
      if (!this.pipPrimed) {
        this.pipPrimed = true;
        console.log('🔓 PiP unlocked by play gesture');
      }
    });

    // Optional: log PiP events
    video.addEventListener('enterpictureinpicture', () => console.log('✅ Video entered PiP'));
    video.addEventListener('leavepictureinpicture', () => console.log('✅ Video exited PiP'));
  }

  private async enterPiP(video: HTMLVideoElement) {
    try {
      if (this.isRequestingPiP) return;
      this.isRequestingPiP = true;

      if (!document.pictureInPictureElement && !video.paused && !video.ended) {
        video.requestPictureInPicture();
        console.log('🎬 Entered PiP');
      }
    } catch (err) {
      console.error('⚠️ Error entering PiP:', err);
    } finally {
      this.isRequestingPiP = false;
    }
  }

  // Optional: manual toggle
  async togglePiP(video: HTMLVideoElement) {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.enterPiP(video);
        this.pipPrimed = true;
      }
    } catch (err) {
      console.error('⚠️ Toggle PiP error:', err);
    }
  }
}