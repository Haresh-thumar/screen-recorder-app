import { Component } from '@angular/core';
import { VisibleOnScrollDirective } from './visible-on-scroll.directive';

@Component({
  selector: 'app-animation-example',
  imports: [VisibleOnScrollDirective],
  templateUrl: './animation-example.component.html',
  styleUrl: './animation-example.component.scss',
})
export class AnimationExampleComponent {
  /*-------------------------------------------------------
                      Fade-Up Animations
  -------------------------------------------------------*/
  fadeUpAnimationList: any[] = [
    {
      id: 1,
      animName: 'fadeUp',
      cardTitle: 'fadeUp 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'fadeUp',
      cardTitle: 'fadeUp 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'fadeUp',
      cardTitle: 'fadeUp 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'fadeUp',
      cardTitle: 'fadeUp 4',
      delay: 800,
    },
  ];

  /*-------------------------------------------------------
                      Fade-Down Animations
  -------------------------------------------------------*/
  fadeDownAnimationList: any[] = [
    {
      id: 1,
      animName: 'fadeDown',
      cardTitle: 'fadeDown 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'fadeDown',
      cardTitle: 'fadeDown 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'fadeDown',
      cardTitle: 'fadeDown 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'fadeDown',
      cardTitle: 'fadeDown 4',
      delay: 800,
    },
  ];

  /*-------------------------------------------------------
                    Slide-Left Animations
  -------------------------------------------------------*/
  slideLeftAnimationList: any[] = [
    {
      id: 1,
      animName: 'slideLeft',
      cardTitle: 'slideLeft 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'slideLeft',
      cardTitle: 'slideLeft 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'slideLeft',
      cardTitle: 'slideLeft 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'slideLeft',
      cardTitle: 'slideLeft 4',
      delay: 800,
    },
  ];

  /*-------------------------------------------------------
                    Slide-Left Animations
  -------------------------------------------------------*/
  slideRightAnimationList: any[] = [
    {
      id: 1,
      animName: 'slideRight',
      cardTitle: 'slideRight 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'slideRight',
      cardTitle: 'slideRight 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'slideRight',
      cardTitle: 'slideRight 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'slideRight',
      cardTitle: 'slideRight 4',
      delay: 800,
    },
  ];
  /*-------------------------------------------------------
                    Slide-Left Animations
  -------------------------------------------------------*/
  zoomInAnimationList: any[] = [
    {
      id: 1,
      animName: 'zoomIn',
      cardTitle: 'zoomIn 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'zoomIn',
      cardTitle: 'zoomIn 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'zoomIn',
      cardTitle: 'zoomIn 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'zoomIn',
      cardTitle: 'zoomIn 4',
      delay: 800,
    },
  ];
  /*-------------------------------------------------------
                    Slide-Left Animations
  -------------------------------------------------------*/
  zoomOutAnimationList: any[] = [
    {
      id: 1,
      animName: 'zoomOut',
      cardTitle: 'zoomOut 1',
      delay: 0,
    },
    {
      id: 2,
      animName: 'zoomOut',
      cardTitle: 'zoomOut 2',
      delay: 200,
    },
    {
      id: 3,
      animName: 'zoomOut',
      cardTitle: 'zoomOut 3',
      delay: 500,
    },
    {
      id: 4,
      animName: 'zoomOut',
      cardTitle: 'zoomOut 4',
      delay: 800,
    },
  ];
}
