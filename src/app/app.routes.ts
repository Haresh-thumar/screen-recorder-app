import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'routing-list',
    pathMatch: 'full'
  },
  {
    path: 'routing-list',
    loadComponent: () => import('./routing-list/routing-list.component').then((m) => m.RoutingListComponent),
  },
  /*------------------------------------------------------------
                      Capture & Recording
  ------------------------------------------------------------*/
  {
    path: 'screen-recording',
    loadComponent: () => import('./---capture-&-recording/screen-recording/screen-recording.component').then((m) => m.ScreenRecordingComponent),
  },
  {
    path: 'capture-simple',
    loadComponent: () => import('./---capture-&-recording/capture-simple/capture-simple.component').then((m) => m.CaptureSimpleComponent),
  },

  /*------------------------------------------------------------
                          Image & PDF
  ------------------------------------------------------------*/
  {
    path: 'base64-compress',
    loadComponent: () => import('./---image-&-pdf/base64-compress/base64-compress.component').then((m) => m.Base64CompressComponent),
  },
  {
    path: 'img-to-PDF',
    loadComponent: () => import('./---image-&-pdf/browse-img-pdf/browse-img-pdf.component').then((m) => m.BrowseImgPdfComponent),
  },
  {
    path: 'content-to-PDF',
    loadComponent: () => import('./---image-&-pdf/content-to-pdf/content-to-pdf.component').then((m) => m.ContentToPdfComponent),
  },

  /*------------------------------------------------------------
                  Image-Capture & File Upload
  ------------------------------------------------------------*/
  {
    path: 'annotation-tools',
    loadComponent: () =>
      import('./---img-capture-&-file-upload/annotation-tools/annotation-tools.component').then(
        (m) => m.AnnotationToolsComponent
      ),
  },
  {
    path: 'img-capture',
    loadComponent: () =>
      import('./---img-capture-&-file-upload/img-capture/img-capture.component').then(
        (m) => m.ImgCaptureComponent
      ),
  },

  {
    path: 'file-upload',
    loadComponent: () =>
      import('./---img-capture-&-file-upload/file-upload/file-upload.component').then(
        (m) => m.FileUploadComponent
      ),
  },

  /*------------------------------------------------------------
                              JSPDF
  ------------------------------------------------------------*/
  {
    path: 'html-to-svg',
    loadComponent: () =>
      import('./---jspdf/html-to-svg/html-to-svg.component').then(
        (m) => m.HtmlToSvgComponent
      ),
  },
  {
    path: 'img-pdf-to-pdf',
    loadComponent: () =>
      import('./---jspdf/img-pdf-to-pdf/img-pdf-to-pdf.component').then(
        (m) => m.ImgPdfToPdfComponent
      ),
  },
  {
    path: 'multiple-table',
    loadComponent: () =>
      import('./---jspdf/multiple-table/multiple-table.component').then(
        (m) => m.MultipleTableComponent
      ),
  },
  {
    path: 'table-to-pdf',
    loadComponent: () =>
      import('./---jspdf/table-to-pdf/table-to-pdf.component').then(
        (m) => m.TableToPdfComponent
      ),
  },


  /*------------------------------------------------------------
                          Reactive Forms
  ------------------------------------------------------------*/
  {
    path: 'dynamic-formarray',
    loadComponent: () =>
      import('./---reactive-forms/dynamic-formcontrols/dynamic-formcontrols.component').then(
        (m) => m.DynamicFormcontrolsComponent
      ),
  },

  /*------------------------------------------------------------
                              Search
  ------------------------------------------------------------*/
  {
    path: 'global-search',
    loadComponent: () =>
      import('./---search/global-search/global-search.component').then(
        (m) => m.GlobalSearchComponent
      ),
  },
  {
    path: 'keyboard-search',
    loadComponent: () =>
      import('./---search/keyboard-search/keyboard-search.component').then(
        (m) => m.KeyboardSearchComponent
      ),
  },

  /*------------------------------------------------------------
                            Web-Workers
  ------------------------------------------------------------*/
  {
    path: 'web-worker-img',
    loadComponent: () =>
      import('./---web-workers/web-worker-task/web-worker-task.component').then(
        (m) => m.WebWorkerTaskComponent
      ),
  },
  {
    path: 'web-worker-array',
    loadComponent: () =>
      import('./---web-workers/web-worker-array-task/web-worker-array-task.component').then(
        (m) => m.WebWorkerArrayTaskComponent
      ),
  },
  {
    path: 'web-worker-multi-method',
    loadComponent: () => import('./---web-workers/web-worker-multiple-method/web-worker-multiple-method.component').then((m) => m.WebWorkerMultipleMethodComponent),
  },

  /*------------------------------------------------------------
                        Toastr & Tooltip
  ------------------------------------------------------------*/
  {
    path: 'ngx-custom-toastr',
    loadComponent: () =>
      import('./---toaster/show-toastr/show-toastr.component').then((m) => m.ShowToastrComponent),
  },

  /*------------------------------------------------------------
                        Reusable Animation
  ------------------------------------------------------------*/
  {
    path: 'reusable-animation',
    loadComponent: () =>
      import('./---animation/animation-example/animation-example.component').then((m) => m.AnimationExampleComponent),
  },

  /*------------------------------------------------------------
                            Others
  ------------------------------------------------------------*/
  {
    path: 'reusable-templates',
    loadComponent: () =>
      import(
        './---others/reuse-template/reuse-template.component'
      ).then((m) => m.ReuseTemplateComponent),
  },

];
