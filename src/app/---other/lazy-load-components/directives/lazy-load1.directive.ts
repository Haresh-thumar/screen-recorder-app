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
  signal,
} from "@angular/core";

export interface LazyLoadState {
  id: string | number;
  isLoaded: boolean;
  isVisible: boolean;
}

@Directive({
  selector: "[appLazyLoad]",
  standalone: true,
})
export class LazyLoad1Directive implements OnInit, AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  appLazyLoad = input.required<string | number>();
  rootMargin = input<string>("100px");
  threshold = input<number>(0.2);
  loadingDelay = input<number>(300); // ms
  resetTrigger = input<boolean>(false);
  stateChange = output<LazyLoadState>();

  private observer?: IntersectionObserver;
  private isLoaded = signal(false);
  private isVisible = signal(false);
  private loadingTimeout?: number;
  private placeholderElement?: HTMLElement;

  constructor() {
    // Load when visible
    effect(() => {
      if (this.isLoaded()) {
        this.loadContent();
        this.emitStateChange();
      }
    });

    // Reset logic
    effect(() => {
      if (this.resetTrigger()) {
        this.reset();
      }
    });

    // Visibility/loaded change emit
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

  /**
   * Create placeholder div with spinner and estimated height.
   * Content/template is not rendered until visible.
   */
  private createPlaceholder(): void {
    const estimatedHeight = 200; // fallback height (can be made configurable)
    this.placeholderElement = document.createElement("div");
    this.placeholderElement.className = "lazy-load-placeholder";
    this.placeholderElement.style.cssText = `
      height: ${estimatedHeight}px;
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
      parent.insertBefore(
        this.placeholderElement,
        this.elementRef.nativeElement
      );
    }
    // Ensure template is NOT created until loaded
    this.viewContainer.clear();
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      rootMargin: this.rootMargin(),
      threshold: this.threshold(),
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
    // Remove placeholder
    if (this.placeholderElement?.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
    }

    // Insert real template
    const embeddedView = this.viewContainer.createEmbeddedView(
      this.templateRef
    );

    // Animate entry
    embeddedView.rootNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s ease";

        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      }
    });

    // Stop observing
    this.observer?.disconnect();
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
    this.observer?.disconnect();
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    if (this.placeholderElement?.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
    }
  }

  private emitStateChange(): void {
    this.stateChange.emit({
      id: this.appLazyLoad(),
      isLoaded: this.isLoaded(),
      isVisible: this.isVisible(),
    });
  }
}
