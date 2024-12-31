import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'screen-recording',
    loadComponent: () =>
      import('./screen-recording/screen-recording.component').then(
        (m) => m.ScreenRecordingComponent
      ),
  },
  {
    path: 'annotation-tools',
    loadComponent: () =>
      import('./annotation-tools/annotation-tools.component').then(
        (m) => m.AnnotationToolsComponent
      ),
  },
];
