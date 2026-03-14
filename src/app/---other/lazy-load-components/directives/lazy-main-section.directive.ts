import {
  Directive,
  effect,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";

// Define the structure of the data the directive will provide to the template
interface DirectiveData {
  items: string[];
  dropdownOptions: string[];
}

// Define the context object exposed to the template
interface LazySectionContext {
  $implicit: boolean; // True when content is loaded
  data: DirectiveData | null; // The simulated API data
  loadTime: string; // The time the data was loaded
}

@Directive({
  standalone: true,
  selector: "[appLazySection]",
  host: {
    // Set display block so min-height applies correctly
    style: "display: block; box-sizing: border-box;",
  },
})
export class LazySectionDirective<T> implements OnInit, OnDestroy {
  // Inject necessary services
  private templateRef = inject(TemplateRef<LazySectionContext>);
  private viewContainer = inject(ViewContainerRef);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  // FIX for ERROR 1: Get the PARENT element. The ElementRef of a structural
  // directive (*appLazySection) points to an invisible comment node, which cannot
  // be observed or styled. The parent is the actual <div> or <section>.
  private hostElement: HTMLElement = this.elementRef.nativeElement
    .parentElement as HTMLElement;

  // INPUTS: Only configuration is passed in
  @Input() root: HTMLElement | null = null; // Remove { required: true }
  @Input() rootMargin: string = "0px";

  // INTERNAL STATE: Signals managed by the directive
  private isLoaded = signal(false);
  private isLoading = signal(false);
  private sectionData = signal<DirectiveData | null>(null);
  private loadTimestamp = signal("");

  private observer?: IntersectionObserver;
  private loaderElement: HTMLElement | null = null;
  // Estimated height for the placeholder space
  private initialHeight: number = 300;

  constructor() {
    // FIX for deprecated flag warning: 'allowSignalWrites' is now the default
    effect(() => {
      const loaded = this.isLoaded();
      const loading = this.isLoading();

      if (loaded) {
        // 1. Content Loaded: Clear loader, render content
        this.removeLoader();
        this.viewContainer.clear();

        // Render content with data from the directive
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: true,
          data: this.sectionData(),
          loadTime: this.loadTimestamp(),
        });

        this.observer?.unobserve(this.hostElement);
        this.renderer.removeStyle(this.hostElement, "min-height");
        this.isLoading.set(false);
      } else if (loading) {
        // 2. Loading: Show loader
        this.viewContainer.clear();
        this.showLoader();
      } else {
        // 3. Initial State: Set placeholder height (FIX for Error 2 timing issues)
        this.viewContainer.clear();
        // Set placeholder height to prevent scroll jumps
        this.renderer.setStyle(
          this.hostElement,
          "min-height",
          `${this.initialHeight}px`
        );
      }
    });
  }

  ngOnInit(): void {
    // Check if the host element was correctly resolved before setting up the observer
    if (!this.hostElement) {
      console.error(
        "LazySectionDirective: Host element could not be found (parent element is missing)."
      );
      return;
    }

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoaded()) {
            this.isLoading.set(true);
            this.simulateApiCall().then((result: DirectiveData) => {
              this.sectionData.set(result);
              this.loadTimestamp.set(new Date().toLocaleTimeString());
              this.isLoaded.set(true);
            });
          }
        });
      },
      {
        root: this.root, // Will be null if not provided = viewport
        rootMargin: this.rootMargin,
        threshold: 0,
      }
    );

    // Start observing the corrected host element (the <section> itself)
    this.observer.observe(this.hostElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.removeLoader();
  }

  // --- Loader Management Functions (Managed by Directive) ---
  private showLoader(): void {
    if (!this.loaderElement) {
      this.loaderElement = this.renderer.createElement("div");
      this.renderer.setStyle(this.loaderElement, "display", "flex");
      this.renderer.setStyle(this.loaderElement, "justify-content", "center");
      this.renderer.setStyle(this.loaderElement, "align-items", "center");
      this.renderer.setStyle(this.loaderElement, "background", "#e3f2fd");
      this.renderer.setStyle(this.loaderElement, "color", "#1565c0");
      this.renderer.setStyle(this.loaderElement, "font-weight", "bold");
      // Ensure the loader fills the placeholder height
      this.renderer.setStyle(
        this.loaderElement,
        "min-height",
        `${this.initialHeight}px`
      );

      const text = this.renderer.createText("🚀 Loading Section Data...");
      this.renderer.appendChild(this.loaderElement, text);
      this.renderer.appendChild(this.hostElement, this.loaderElement);
    }
  }

  private removeLoader(): void {
    if (this.loaderElement) {
      this.renderer.removeChild(this.hostElement, this.loaderElement);
      this.loaderElement = null;
    }
  }

  // --- Data Simulation ---
  private simulateApiCall(): Promise<DirectiveData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [
            "Data A from Directive",
            "Data B from Directive",
            "Data C from Directive",
          ],
          dropdownOptions: [
            "Directive Option 1",
            "Directive Option 2",
            "Directive Option 3",
          ],
        });
      }, 700);
    });
  }

  // Type guard for template type checking
  static ngTemplateContextGuard<T>(
    dir: LazySectionDirective<T>,
    ctx: unknown
  ): ctx is LazySectionContext {
    return true;
  }
}
