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
  {
    path: 'print-1',
    loadComponent: () =>
      import('./---jspdf/print-1/print-1.component').then(
        (m) => m.Print1Component
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
  {
    path: 'days-calculation',
    loadComponent: () =>
      import('./---reactive-forms/days-calculation/days-calculation.component').then(
        (m) => m.DaysCalculationComponent
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
                          Detect Browser
  ------------------------------------------------------------*/
  {
    path: 'adblocker-detect', loadComponent: () =>
      import(
        './---detect-browser/detect-adblocker/detect-adblocker.component'
      ).then((m) => m.DetectAdblockerComponent),
  },
  {
    path: 'detect-browser-screen-zoom-level', loadComponent: () =>
      import(
        './---detect-browser/detect-browser-window-size/detect-browser-window-size.component'
      ).then((m) => m.DetectBrowserWindowSizeComponent),
  },
  {
    path: 'detect-display-screen-zoom-level', loadComponent: () =>
      import(
        './---detect-browser/detect-display-screen-size/detect-display-screen-size.component'
      ).then((m) => m.DetectDisplayScreenSizeComponent),
  },

  /*------------------------------------------------------------
                          Editor
  ------------------------------------------------------------*/
  {
    path: 'dark-editor', loadComponent: () =>
      import(
        './---editor/dark-editor/dark-editor.component'
      ).then((m) => m.DarkEditorComponent),
  },
  {
    path: 'dark-editor-2', loadComponent: () =>
      import(
        './---editor/dark-editor-2/dark-editor-2.component'
      ).then((m) => m.DarkEditor2Component),
  },
  {
    path: 'editable-textarea', loadComponent: () =>
      import(
        './---editor/editable-textarea/editable-textarea.component'
      ).then((m) => m.EditableTextareaComponent),
  },

  /*------------------------------------------------------------
                          Routing
  ------------------------------------------------------------*/
  {
    path: 'cart/product-list', loadComponent: () =>
      import(
        './---routing/product-list/product-list.component'
      ).then((m) => m.ProductListComponent),
  },
  {
    path: 'cart/product-list-2', loadComponent: () =>
      import(
        './---routing/product-list-2/product-list-2.component'
      ).then((m) => m.ProductList2Component),
  },
  {
    path: 'cart/product-list-3', loadComponent: () =>
      import(
        './---routing/product-list-3/product-list-3.component'
      ).then((m) => m.ProductList3Component),
  },
  {
    path: 'cart/product-list-4', loadComponent: () =>
      import(
        './---routing/product-list-4/product-list-4.component'
      ).then((m) => m.ProductList4Component),
  },
  {
    path: 'cart/:listType/product',
    loadComponent: () =>
      import(
        './---routing/product-detail/product-detail.component'
      ).then((m) => m.ProductDetailComponent),
    data: { reuseComponent: true },
  },

  /*------------------------------------------------------------
                        Angular Tutorials
  ------------------------------------------------------------*/
  {
    path: 'angular-tutorials',
    loadComponent: () =>
      import(
        './---Angular-tutorials/reuse-template/reuse-template.component'
      ).then((m) => m.ReuseTemplateComponent),
  },
  {
    path: 'content-childeren-template',
    loadComponent: () =>
      import(
        './---Angular-tutorials/content-childeren-template/content-childeren-template.component'
      ).then((m) => m.ContentChilderenTemplateComponent),
  },
  {
    path: 'create-embaded-view',
    loadComponent: () =>
      import(
        './---Angular-tutorials/create-embaded-view/create-embaded-view.component'
      ).then((m) => m.CreateEmbadedViewComponent),
  },
  {
    path: 'dynamic-component',
    loadComponent: () =>
      import(
        './---Angular-tutorials/dynamic-component/dynamic-component.component'
      ).then((m) => m.DynamicComponentComponent),
  },
  {
    path: 'dynamic-template',
    loadComponent: () =>
      import(
        './---Angular-tutorials/dynamic-template/dynamic-template.component'
      ).then((m) => m.CardComponent),
  },
  {
    path: 'for-loop-if-else',
    loadComponent: () =>
      import(
        './---Angular-tutorials/for-loop-if-else/for-loop-if-else.component'
      ).then((m) => m.ForLoopIfElseComponent),
  },
  {
    path: 'host-decorator',
    loadComponent: () =>
      import(
        './---Angular-tutorials/host-decorator//host-decorator.component'
      ).then((m) => m.HostDecoratorComponent),
  },
  {
    path: 'host-directive',
    loadComponent: () =>
      import(
        './---Angular-tutorials/host-directive-example/host-directive-example.component'
      ).then((m) => m.HostDirectiveExampleComponent),
  },
  {
    path: 'lazy-loading-defer',
    loadComponent: () =>
      import(
        './---Angular-tutorials/lazy-loading-defer/lazy-loading-defer.component'
      ).then((m) => m.LazyLoadingDeferComponent),
  },
  {
    path: 'let-directive',
    loadComponent: () =>
      import(
        './---Angular-tutorials/let-directive/let-directive.component'
      ).then((m) => m.LetDirectiveComponent),
  },
  {
    path: 'optional-decorator',
    loadComponent: () =>
      import(
        './---Angular-tutorials/optional-decorator/optional-decorator.component'
      ).then((m) => m.OptionalDecoratorComponent),
  },
  {
    path: 'skip-skipself-decorator',
    loadComponent: () =>
      import(
        './---Angular-tutorials/skip-skipself-decorator/skip-skipself-decorator.component'
      ).then((m) => m.SkipSkipselfDecoratorComponent),
  },
  {
    path: 'switch-case-template',
    loadComponent: () =>
      import(
        './---Angular-tutorials/switch-case-template/switch-case-template.component'
      ).then((m) => m.SwitchCaseTemplateComponent),
  },

  /*------------------------------------------------------------
                              Others
  ------------------------------------------------------------*/
  {
    path: 'waveform-player',
    loadComponent: () =>
      import('./---other/custom-waveform-player/custom-waveform-player.component').then((m) => m.CustomWaveformPlayerComponent),
  },
  {
    path: 'multiselect-dropdown',
    loadComponent: () =>
      import('./---other/custom-multiselect-dropdown/custom-multiselect-dropdown.component').then((m) => m.CustomMultiselectDropdownComponent),
  },

];
