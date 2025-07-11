import { animate, AnimationMetadata, style } from '@angular/animations';

export const ANIMATION_DEFINITIONS: {
  [key: string]: { in: AnimationMetadata[]; out: AnimationMetadata[] };
} = {
  // 1. Fade Animation
  fade: {
    in: [
      style({ opacity: 0 }),
      animate('500ms ease-in-out', style({ opacity: 1 })),
    ],
    out: [
      style({ opacity: 1 }),
      animate('300ms ease-in-out', style({ opacity: 0 })),
    ],
  },

  // 2. Fade Up Animation
  fadeUp: {
    in: [
      style({ transform: 'translateY(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateY(20px)', opacity: 0 })
      ),
    ],
  },

  // 3. Fade Down Animation
  fadeDown: {
    in: [
      style({ transform: 'translateY(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateY(-20px)', opacity: 0 })
      ),
    ],
  },

  // 4. Fade Left Animation
  fadeLeft: {
    in: [
      style({ transform: 'translateX(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateX(20px)', opacity: 0 })
      ),
    ],
  },

  // 5. Fade Right Animation
  fadeRight: {
    in: [
      style({ transform: 'translateX(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateX(-20px)', opacity: 0 })
      ),
    ],
  },

  // 6. Fade Up Right Animation
  fadeUpRight: {
    in: [
      style({ transform: 'translate(20px, 20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translate(0, 0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translate(0, 0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translate(20px, 20px)', opacity: 0 })
      ),
    ],
  },

  // 7. Fade Up Left Animation
  fadeUpLeft: {
    in: [
      style({ transform: 'translate(-20px, 20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translate(0, 0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translate(0, 0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translate(-20px, 20px)', opacity: 0 })
      ),
    ],
  },

  // 8. Fade Down Right Animation
  fadeDownRight: {
    in: [
      style({ transform: 'translate(20px, -20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translate(0, 0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translate(0, 0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translate(20px, -20px)', opacity: 0 })
      ),
    ],
  },

  // 9. Fade Down Left Animation
  fadeDownLeft: {
    in: [
      style({ transform: 'translate(-20px, -20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translate(0, 0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translate(0, 0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translate(-20px, -20px)', opacity: 0 })
      ),
    ],
  },

  // 10. Flip Up Animation (Rotate X)
  flipUp: {
    in: [
      style({ transform: 'rotateX(-90deg)', opacity: 0 }),
      animate(
        '600ms ease-out',
        style({ transform: 'rotateX(0deg)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'rotateX(0deg)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'rotateX(-90deg)', opacity: 0 })
      ),
    ],
  },

  // 11. Flip Down Animation (Rotate X)
  flipDown: {
    in: [
      style({ transform: 'rotateX(90deg)', opacity: 0 }),
      animate(
        '600ms ease-out',
        style({ transform: 'rotateX(0deg)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'rotateX(0deg)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'rotateX(90deg)', opacity: 0 })
      ),
    ],
  },

  // 12. Flip Left Animation (Rotate Y)
  flipLeft: {
    in: [
      style({ transform: 'rotateY(-90deg)', opacity: 0 }),
      animate(
        '600ms ease-out',
        style({ transform: 'rotateY(0deg)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'rotateY(0deg)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'rotateY(-90deg)', opacity: 0 })
      ),
    ],
  },

  // 13. Flip Right Animation (Rotate Y)
  flipRight: {
    in: [
      style({ transform: 'rotateY(90deg)', opacity: 0 }),
      animate(
        '600ms ease-out',
        style({ transform: 'rotateY(0deg)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'rotateY(0deg)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'rotateY(90deg)', opacity: 0 })
      ),
    ],
  },

  // 14. Slide Up Animation
  slideUp: {
    in: [
      style({ transform: 'translateY(100%)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateY(100%)', opacity: 0 })
      ),
    ],
  },

  // 15. Slide Down Animation
  slideDown: {
    in: [
      style({ transform: 'translateY(-100%)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateY(-100%)', opacity: 0 })
      ),
    ],
  },

  // 16. Slide Left Animation
  slideLeft: {
    in: [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateX(100%)', opacity: 0 })
      ),
    ],
  },

  // 17. Slide Right Animation
  slideRight: {
    in: [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'translateX(-100%)', opacity: 0 })
      ),
    ],
  },

  // 18. Zoom In Animation
  zoomIn: {
    in: [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
    ],
    out: [
      style({ transform: 'scale(1)', opacity: 1 }),
      animate('300ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 })),
    ],
  },

  // 19. Zoom In Up Animation
  zoomInUp: {
    in: [
      style({ transform: 'scale(0.5) translateY(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(0.5) translateY(20px)', opacity: 0 })
      ),
    ],
  },

  // 20. Zoom In Down Animation
  zoomInDown: {
    in: [
      style({ transform: 'scale(0.5) translateY(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(0.5) translateY(-20px)', opacity: 0 })
      ),
    ],
  },

  // 21. Zoom In Left Animation
  zoomInLeft: {
    in: [
      style({ transform: 'scale(0.5) translateX(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(0.5) translateX(20px)', opacity: 0 })
      ),
    ],
  },

  // 22. Zoom In Right Animation
  zoomInRight: {
    in: [
      style({ transform: 'scale(0.5) translateX(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(0.5) translateX(-20px)', opacity: 0 })
      ),
    ],
  },

  // 23. Zoom Out Animation (reinterpreted for 'in' state: zooms in from slightly larger)
  zoomOut: {
    in: [
      style({ transform: 'scale(1.2)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
    ],
    out: [
      style({ transform: 'scale(1)', opacity: 1 }),
      animate('300ms ease-in', style({ transform: 'scale(1.2)', opacity: 0 })),
    ],
  },

  // 24. Zoom Out Up Animation (reinterpreted for 'in' state: zooms in from larger + up)
  zoomOutUp: {
    in: [
      style({ transform: 'scale(1.2) translateY(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(1.2) translateY(-20px)', opacity: 0 })
      ),
    ],
  },

  // 25. Zoom Out Down Animation (reinterpreted for 'in' state: zooms in from larger + down)
  zoomOutDown: {
    in: [
      style({ transform: 'scale(1.2) translateY(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateY(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateY(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(1.2) translateY(20px)', opacity: 0 })
      ),
    ],
  },

  // 26. Zoom Out Left Animation (reinterpreted for 'in' state: zooms in from larger + left)
  zoomOutLeft: {
    in: [
      style({ transform: 'scale(1.2) translateX(20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(1.2) translateX(20px)', opacity: 0 })
      ),
    ],
  },

  // 27. Zoom Out Right Animation (reinterpreted for 'in' state: zooms in from larger + right)
  zoomOutRight: {
    in: [
      style({ transform: 'scale(1.2) translateX(-20px)', opacity: 0 }),
      animate(
        '500ms ease-out',
        style({ transform: 'scale(1) translateX(0)', opacity: 1 })
      ),
    ],
    out: [
      style({ transform: 'scale(1) translateX(0)', opacity: 1 }),
      animate(
        '300ms ease-in',
        style({ transform: 'scale(1.2) translateX(-20px)', opacity: 0 })
      ),
    ],
  },
};
