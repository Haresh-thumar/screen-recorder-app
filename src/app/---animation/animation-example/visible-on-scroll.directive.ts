import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Input,
  Renderer2,
} from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { ANIMATION_DEFINITIONS } from './animation';

@Directive({
  selector: '[appVisibleOnScroll]', // Selector to apply this directive
  standalone: true, // Marks this directive as standalone
})
export class VisibleOnScrollDirective implements OnInit, OnDestroy {
  @Input('appVisibleOnScroll') animationName: string = ''; // The name of the animation to apply
  @Input() repeatAgain: boolean = false; // If true, animation repeats every time it enters view
  @Input() animationDelay: number = 0; // New: Delay in milliseconds before the animation starts

  private observer!: IntersectionObserver;
  private player: AnimationPlayer | null = null; // Stores the current animation player
  private hasAnimatedOnce: boolean = false; // Tracks if the 'in' animation has played

  constructor(
    private el: ElementRef,
    private builder: AnimationBuilder, // Inject AnimationBuilder
    private renderer: Renderer2 // Inject Renderer2 for initial style setting
  ) {}

  ngOnInit(): void {
    // Set initial styles to ensure elements are hidden before animation
    // This prevents a "flash" of content before the animation starts.
    // The specific 'from' styles for each animation are handled in ANIMATION_DEFINITIONS,
    // but setting initial opacity to 0 here ensures elements are hidden until the directive acts.
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');

    // Initialize IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is entering the viewport
            if (!this.hasAnimatedOnce || this.repeatAgain) {
              this.playAnimation('in');
              this.hasAnimatedOnce = true; // Mark as animated
            }
          } else {
            // Element is leaving the viewport
            // Only play 'out' animation if repeatAgain is true,
            // otherwise, once it's animated in, it stays in its final state.
            if (this.repeatAgain) {
              this.playAnimation('out');
              this.hasAnimatedOnce = false; // Reset for re-entry if repeating
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        // rootMargin: '0px 0px -100px 0px', // Optional: adjust to trigger earlier/later
      }
    );

    // Start observing the host element
    this.observer.observe(this.el.nativeElement);
  }

  /**
   * Plays the specified animation ('in' or 'out') on the host element.
   * @param state The animation state to play ('in' or 'out').
   */
  private playAnimation(state: 'in' | 'out'): void {
    // Stop any currently running animation to prevent conflicts
    if (this.player) {
      this.player.destroy();
    }

    // Get the animation metadata for the specified animation name and state
    const animationMetadata =
      ANIMATION_DEFINITIONS[this.animationName]?.[state];

    if (animationMetadata) {
      // Create an animation factory from the metadata
      const factory = this.builder.build(animationMetadata);
      // Create a player for the animation on the host element, passing the delay
      this.player = factory.create(this.el.nativeElement, {
        delay: this.animationDelay,
      });

      // Play the animation
      this.player.play();
    } else {
      console.warn(
        `Animation definition for '${this.animationName}' and state '${state}' not found.`
      );
    }
  }

  ngOnDestroy(): void {
    // Disconnect the observer when the directive is destroyed to prevent memory leaks
    this.observer?.disconnect();
    // Destroy the animation player to clean up resources
    if (this.player) {
      this.player.destroy();
    }
  }
}
