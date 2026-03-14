import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-change-detector',
  imports: [],
  templateUrl: './tab-change-detector.component.html',
  styleUrl: './tab-change-detector.component.scss'
})
export class TabChangeDetectorComponent implements OnInit, OnDestroy {

  // isTabActive: boolean = true;
  // focusCount: number = 0;
  // blurCount: number = 0;
  // totalActiveTime: number = 0;
  // lastActivityTime: Date = new Date();
  // private focusTime: number = 0;
  // private blurTime: number = 0;

  // activityLog: Array<{
  //   type: 'focus' | 'blur';
  //   timestamp: Date;
  //   details: string;
  // }> = [];

  // ngOnInit() {
  //   this.setupEventListeners();
  //   this.startTimeTracking();
  //   this.logActivity('focus', 'Application initialized - tab active');
  // }

  // ngOnDestroy() {
  //   this.cleanupEventListeners();
  //   this.stopTimeTracking();
  // }

  // private setupEventListeners() {
  //   // Visibility Change API (Modern browsers)
  //   document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
  //   // Window focus/blur events (Fallback)
  //   window.addEventListener('focus', this.handleWindowFocus.bind(this));
  //   window.addEventListener('blur', this.handleWindowBlur.bind(this));
    
  //   // Page show/hide events (Safari compatibility)
  //   window.addEventListener('pageshow', this.handlePageShow.bind(this));
  //   window.addEventListener('pagehide', this.handlePageHide.bind(this));
  // }

  // private cleanupEventListeners() {
  //   document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  //   window.removeEventListener('focus', this.handleWindowFocus.bind(this));
  //   window.removeEventListener('blur', this.handleWindowBlur.bind(this));
  //   window.removeEventListener('pageshow', this.handlePageShow.bind(this));
  //   window.removeEventListener('pagehide', this.handlePageHide.bind(this));
  // }

  // private handleVisibilityChange() {
  //   if (document.hidden) {
  //     this.handleTabBlur('visibilitychange - tab hidden');
  //   } else {
  //     this.handleTabFocus('visibilitychange - tab visible');
  //   }
  // }

  // private handleWindowFocus() {
  //   this.handleTabFocus('window focus gained');
  // }

  // private handleWindowBlur() {
  //   this.handleTabBlur('window focus lost');
  // }

  // private handlePageShow() {
  //   this.handleTabFocus('page shown');
  // }

  // private handlePageHide() {
  //   this.handleTabBlur('page hidden');
  // }

  // private handleTabFocus(details: string) {
  //   if (!this.isTabActive) {
  //     this.isTabActive = true;
  //     this.focusCount++;
  //     this.blurTime = Date.now();
  //     this.calculateActiveTime();
      
  //     console.log('🟢 TAB FOCUSED:', {
  //       timestamp: new Date().toISOString(),
  //       details: details,
  //       focusCount: this.focusCount,
  //       totalActiveTime: this.formatTime(this.totalActiveTime)
  //     });

  //     this.logActivity('focus', details);
  //   }
  // }

  // private handleTabBlur(details: string) {
  //   if (this.isTabActive) {
  //     this.isTabActive = false;
  //     this.blurCount++;
  //     this.focusTime = Date.now();
      
  //     console.log('🔴 TAB BLURRED:', {
  //       timestamp: new Date().toISOString(),
  //       details: details,
  //       blurCount: this.blurCount,
  //       totalActiveTime: this.formatTime(this.totalActiveTime)
  //     });

  //     this.logActivity('blur', details);
  //   }
  // }

  // private logActivity(type: 'focus' | 'blur', details: string) {
  //   this.lastActivityTime = new Date();
  //   this.activityLog.unshift({
  //     type,
  //     timestamp: new Date(),
  //     details
  //   });

  //   // Keep only last 50 log entries
  //   if (this.activityLog.length > 50) {
  //     this.activityLog.pop();
  //   }
  // }

  // private startTimeTracking() {
  //   this.focusTime = Date.now();
  // }

  // private stopTimeTracking() {
  //   if (this.isTabActive) {
  //     this.calculateActiveTime();
  //   }
  // }

  // private calculateActiveTime() {
  //   if (this.blurTime > 0 && this.focusTime > 0) {
  //     const sessionTime = this.blurTime - this.focusTime;
  //     this.totalActiveTime += Math.max(0, sessionTime);
  //   }
  //   this.focusTime = Date.now();
  //   this.blurTime = 0;
  // }

  // formatTime(milliseconds: number): string {
  //   const seconds = Math.floor(milliseconds / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);

  //   if (hours > 0) {
  //     return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  //   } else if (minutes > 0) {
  //     return `${minutes}m ${seconds % 60}s`;
  //   } else {
  //     return `${seconds}s`;
  //   }
  // }


  private isTabActive: boolean = true;

  ngOnInit() {
    this.setupEventListeners();
    console.log('🟢 TAB FOCUSED: Application initialized - tab active');
  }

  ngOnDestroy() {
    this.cleanupEventListeners();
  }

  private setupEventListeners() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    window.addEventListener('blur', this.handleWindowBlur.bind(this));
  }

  private cleanupEventListeners() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    window.removeEventListener('blur', this.handleWindowBlur.bind(this));
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      this.handleTabBlur('visibilitychange - tab hidden');
    } else {
      this.handleTabFocus('visibilitychange - tab visible');
    }
  }

  private handleWindowFocus() {
    this.handleTabFocus('window focus gained');
  }

  private handleWindowBlur() {
    this.handleTabBlur('window focus lost');
  }

  private handleTabFocus(details: string) {
    if (!this.isTabActive) {
      this.isTabActive = true;
      console.log('🟢 TAB FOCUSED:', {
        timestamp: new Date().toISOString(),
        details: details
      });
    }
  }

  private handleTabBlur(details: string) {
    if (this.isTabActive) {
      this.isTabActive = false;
      console.log('🔴 TAB BLURRED:', {
        timestamp: new Date().toISOString(),
        details: details
      });
    }
  }

}
