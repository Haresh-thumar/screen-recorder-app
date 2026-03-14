// import {
//   AfterViewInit,
//   Directive,
//   ElementRef,
//   OnDestroy,
//   OnInit,
//   TemplateRef,
//   ViewContainerRef,
//   effect,
//   inject,
//   input,
//   output,
//   signal
// } from '@angular/core';

// export interface LazyLoadState {
//   id: string | number;
//   isLoaded: boolean;
//   isVisible: boolean;
// }

// @Directive({
//   selector: '[appLazyLoad]',
//   standalone: true
// })
// export class LazyLoadDirective implements OnInit, OnDestroy, AfterViewInit {
//   private elementRef = inject(ElementRef);
//   private templateRef = inject(TemplateRef);
//   private viewContainer = inject(ViewContainerRef);

//   // Inputs using new Angular 17+ syntax
//   appLazyLoad = input.required<string | number>(); // Unique ID
//   rootMargin = input<string>('100px');
//   threshold = input<number>(0.2);
//   loadingDelay = input<number>(500);
//   resetTrigger = input<boolean>(false); // New input to trigger reset

//   // Output to notify parent when state changes
//   stateChange = output<LazyLoadState>();

//   private observer?: IntersectionObserver;
//   private isLoaded = signal(false);
//   private isVisible = signal(false);
//   private loadingTimeout?: number;
//   private placeholderElement?: HTMLElement;

//   constructor() {
//     // Effect to handle lazy loading when signals change
//     effect(() => {
//       if (this.isLoaded()) {
//         this.loadContent();
//         this.emitStateChange();
//       }
//     });

//     // Effect to handle reset trigger
//     effect(() => {
//       if (this.resetTrigger()) {
//         this.reset();
//       }
//     });

//     // Effect to emit state changes
//     effect(() => {
//       this.emitStateChange();
//     });
//   }

//   ngOnInit(): void {
//     this.createPlaceholder();
//   }

//   ngAfterViewInit(): void {
//     this.setupIntersectionObserver();
//   }

//   ngOnDestroy(): void {
//     this.cleanup();
//   }

//   private createPlaceholder(): void {
//     this.placeholderElement = document.createElement('div');
//     this.placeholderElement.className = 'lazy-load-placeholder';
//     this.placeholderElement.style.cssText = `
//       min-height: 300px;
//       background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       color: #666;
//       font-size: 16px;
//       font-weight: 500;
//       border: 2px dashed #ddd;
//       border-radius: 12px;
//       margin: 20px 0;
//       transition: all 0.3s ease;
//       position: relative;
//       overflow: hidden;
//     `;

//     // Add animated loading indicator
//     this.placeholderElement.innerHTML = `
//       <div style="text-align: center;">
//         <div style="
//           width: 40px;
//           height: 40px;
//           border: 3px solid #f3f3f3;
//           border-top: 3px solid #667eea;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin: 0 auto 15px;
//         "></div>
//         <div>Loading Component ${this.appLazyLoad()}</div>
//         <div style="font-size: 12px; color: #999; margin-top: 5px;">Scroll into view to load</div>
//       </div>
//       <style>
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       </style>
//     `;

//     // Insert placeholder
//     const parent = this.elementRef.nativeElement.parentNode;
//     if (parent) {
//       parent.insertBefore(this.placeholderElement, this.elementRef.nativeElement);
//     }
//   }

//   private setupIntersectionObserver(): void {
//     const options: IntersectionObserverInit = {
//       rootMargin: this.rootMargin(),
//       threshold: this.threshold()
//     };

//     this.observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         this.isVisible.set(entry.isIntersecting);

//         if (entry.isIntersecting && !this.isLoaded()) {
//           this.startLoading();
//         }
//       });
//     }, options);

//     if (this.placeholderElement) {
//       this.observer.observe(this.placeholderElement);
//     }
//   }

//   private startLoading(): void {
//     if (this.placeholderElement) {
//       this.placeholderElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
//       this.placeholderElement.style.color = 'white';
//       this.placeholderElement.innerHTML = `
//         <div style="text-align: center;">
//           <div style="
//             width: 40px;
//             height: 40px;
//             border: 3px solid rgba(255,255,255,0.3);
//             border-top: 3px solid white;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//             margin: 0 auto 15px;
//           "></div>
//           <div>Loading Component ${this.appLazyLoad()}...</div>
//         </div>
//         <style>
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         </style>
//       `;
//     }

//     this.loadingTimeout = window.setTimeout(() => {
//       this.isLoaded.set(true);
//     }, this.loadingDelay());
//   }

//   private loadContent(): void {
//     // Remove placeholder
//     if (this.placeholderElement && this.placeholderElement.parentNode) {
//       this.placeholderElement.parentNode.removeChild(this.placeholderElement);
//     }

//     // Load the actual content with animation
//     const embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);

//     // Add fade-in animation
//     embeddedView.rootNodes.forEach(node => {
//       if (node.nodeType === Node.ELEMENT_NODE) {
//         const element = node as HTMLElement;
//         element.style.opacity = '0';
//         element.style.transform = 'translateY(20px)';
//         element.style.transition = 'all 0.6s ease';

//         // Trigger animation on next frame
//         requestAnimationFrame(() => {
//           element.style.opacity = '1';
//           element.style.transform = 'translateY(0)';
//         });
//       }
//     });

//     // Disconnect observer as content is now loaded
//     if (this.observer) {
//       this.observer.disconnect();
//     }
//   }

//   private reset(): void {
//     this.cleanup();
//     this.isLoaded.set(false);
//     this.isVisible.set(false);

//     // Clear the view container
//     this.viewContainer.clear();

//     // Recreate placeholder and observer
//     this.createPlaceholder();
//     this.setupIntersectionObserver();
//   }

//   private cleanup(): void {
//     if (this.observer) {
//       this.observer.disconnect();
//     }
//     if (this.loadingTimeout) {
//       clearTimeout(this.loadingTimeout);
//     }
//     if (this.placeholderElement && this.placeholderElement.parentNode) {
//       this.placeholderElement.parentNode.removeChild(this.placeholderElement);
//     }
//   }

//   private emitStateChange(): void {
//     this.stateChange.emit({
//       id: this.appLazyLoad(),
//       isLoaded: this.isLoaded(),
//       isVisible: this.isVisible()
//     });
//   }
// }



import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';

export interface LazyLoadState {
  id: string | number;
  isLoaded: boolean;
  isVisible: boolean;
}

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy, AfterViewInit {
  private elementRef = inject(ElementRef);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  appLazyLoad = input.required<string | number>();
  rootMargin = input<string>('100px');
  threshold = input<number>(0.2);
  loadingDelay = input<number>(500);
  resetTrigger = input<boolean>(false);

  stateChange = output<LazyLoadState>();

  private observer?: IntersectionObserver;
  private isLoaded = signal(false);
  private isVisible = signal(false);
  private loadingTimeout?: number;
  private placeholderElement?: HTMLElement;

  constructor() {
    effect(() => {
      if (this.isLoaded()) {
        this.loadContent();
        this.emitStateChange();
      }
    });

    effect(() => {
      if (this.resetTrigger()) {
        this.reset();
      }
    });

    effect(() => {
      this.emitStateChange();
    });
  }

  ngOnInit(): void {
    this.createPlaceholder();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

private calculateContentHeight(): number {
  // Render template hidden
  const preview = this.viewContainer.createEmbeddedView(this.templateRef);
  this.viewContainer.detach(0); // keep it in memory, not DOM
  let height = 200; // fallback

  // Create a temporary container to measure
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = `
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    width: 100%;
  `;

  preview.rootNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      tempDiv.appendChild(node.cloneNode(true));
    }
  });

  document.body.appendChild(tempDiv);
  height = tempDiv.getBoundingClientRect().height || height;
  document.body.removeChild(tempDiv);
  return height;
}


private createPlaceholder(): void {
  const estimatedHeight = this.calculateContentHeight();
  this.placeholderElement = document.createElement('div');
  this.placeholderElement.className = 'lazy-load-placeholder';
  this.placeholderElement.style.cssText = `
    height: ${estimatedHeight}px;   /* dynamic height */
    border-radius: 12px;
    margin: 20px 0;
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // PrimeNG-like spinner
  this.placeholderElement.innerHTML = `
    <div class="primeng-spinner"></div>
    <style>
      .primeng-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 123, 255, 0.2);
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: primeng-spin 1s linear infinite;
      }
      @keyframes primeng-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  const parent = this.elementRef.nativeElement.parentNode;
  if (parent) {
    parent.insertBefore(this.placeholderElement, this.elementRef.nativeElement);
  }
}

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      rootMargin: this.rootMargin(),
      threshold: this.threshold()
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible.set(entry.isIntersecting);

        if (entry.isIntersecting && !this.isLoaded()) {
          this.startLoading();
        }
      });
    }, options);

    if (this.placeholderElement) {
      this.observer.observe(this.placeholderElement);
    }
  }

  private startLoading(): void {
    this.loadingTimeout = window.setTimeout(() => {
      this.isLoaded.set(true);
    }, this.loadingDelay());
  }

  private loadContent(): void {
    if (this.placeholderElement && this.placeholderElement.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
    }

    const embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);

    embeddedView.rootNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';

        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }
    });

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private reset(): void {
    this.cleanup();
    this.isLoaded.set(false);
    this.isVisible.set(false);

    this.viewContainer.clear();
    this.createPlaceholder();
    this.setupIntersectionObserver();
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    if (this.placeholderElement && this.placeholderElement.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
    }
  }

  private emitStateChange(): void {
    this.stateChange.emit({
      id: this.appLazyLoad(),
      isLoaded: this.isLoaded(),
      isVisible: this.isVisible()
    });
  }
}
