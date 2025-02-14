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
  {
    path: 'img-capture',
    loadComponent: () =>
      import('./img-capture/img-capture.component').then(
        (m) => m.ImgCaptureComponent
      ),
  },
  {
    path: 'capture-simple',
    loadComponent: () =>
      import('./capture-simple/capture-simple.component').then(
        (m) => m.CaptureSimpleComponent
      ),
  },
  {
    path: 'file-upload',
    loadComponent: () =>
      import('./file-upload/file-upload.component').then(
        (m) => m.FileUploadComponent
      ),
  },
  {
    path: 'base64-compress',
    loadComponent: () =>
      import('./base64-compress/base64-compress.component').then(
        (m) => m.Base64CompressComponent
      ),
  },
  {
    path: 'dynamic-formarray',
    loadComponent: () =>
      import('./dynamic-formcontrols/dynamic-formcontrols.component').then(
        (m) => m.DynamicFormcontrolsComponent
      ),
  },
  {
    path: 'img-to-PDF',
    loadComponent: () =>
      import('./browse-img-pdf/browse-img-pdf.component').then(
        (m) => m.BrowseImgPdfComponent
      ),
  },
  {
    path: 'content-to-PDF',
    loadComponent: () =>
      import('./content-to-pdf/content-to-pdf.component').then(
        (m) => m.ContentToPdfComponent
      ),
  },
  {
    path: 'html-to-svg',
    loadComponent: () =>
      import('./html-to-svg/html-to-svg.component').then(
        (m) => m.HtmlToSvgComponent
      ),
  },
  {
    path: 'table-to-pdf',
    loadComponent: () =>
      import('./table-to-pdf/table-to-pdf.component').then(
        (m) => m.TableToPdfComponent
      ),
  },
  {
    path: 'multiple-table',
    loadComponent: () =>
      import('./multiple-table/multiple-table.component').then(
        (m) => m.MultipleTableComponent
      ),
  },
];
