import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routing-list',
  imports: [RouterLink, NgClass],
  templateUrl: './routing-list.component.html',
  styleUrl: './routing-list.component.scss'
})
export class RoutingListComponent {

  captureRecordingList: any[] = [
    {
      id: 1,
      title: 'Screen Recording',
      route: '/screen-recording'
    },
    {
      id: 2,
      title: 'Capture Simple',
      route: '/capture-simple'
    },
  ]

  imagePDFList: any[] = [
    {
      id: 1,
      title: 'Base64 Compress',
      route: '/base64-compress'
    },
    {
      id: 2,
      title: 'Img to PDF',
      route: '/img-to-PDF'
    },
    {
      id: 3,
      title: 'Content to PDF',
      route: '/content-to-PDF'
    },
  ]

  imageCaptureFileUploadList: any[] = [
    {
      id: 1,
      title: 'Annotation Tools',
      route: '/annotation-tools'
    },
    {
      id: 2,
      title: 'Img Capture',
      route: '/img-capture'
    },
    {
      id: 3,
      title: 'File Upload',
      route: '/file-upload'
    },
  ]

  JSPDFList: any[] = [
    {
      id: 1,
      title: 'HTML to SVG',
      route: '/html-to-svg'
    },
    {
      id: 2,
      title: 'Img-PDF to PDF',
      route: '/img-pdf-to-pdf'
    },
    {
      id: 3,
      title: 'Multiple Table',
      route: '/multiple-table'
    },
    {
      id: 4,
      title: 'Table to PDF',
      route: '/table-to-pdf'
    },
    {
      id: 5,
      title: 'JS-Autotable Print',
      route: '/js-autotable-print'
    },
    {
      id: 6,
      title: 'Print 1',
      route: '/print-1'
    },
  ]

  reactiveFormsList: any[] = [
    {
      id: 1,
      title: 'Dynamic Formarray',
      route: '/dynamic-formarray'
    },
    {
      id: 2,
      title: 'Days Calculation',
      route: '/days-calculation'
    },
  ]

  searchList: any[] = [
    {
      id: 1,
      title: 'Global Search',
      route: '/global-search'
    },
    {
      id: 2,
      title: 'Keyboard Search',
      route: '/keyboard-search'
    }
  ]

  webWorkersList: any[] = [
    {
      id: 1,
      title: 'Web Worker Img',
      route: '/web-worker-img'
    },
    {
      id: 2,
      title: 'Web Worker Array',
      route: '/web-worker-array'
    }
  ]

  toastrTooltipList: any[] = [
    {
      id: 1,
      title: 'Ngx Custom Toastr',
      route: '/ngx-custom-toastr'
    }
  ]

  animationsList: any[] = [
    {
      id: 1,
      title: 'Reusable Animation',
      route: '/reusable-animation'
    }
  ]

  detectWindowList: any[] = [
    {
      id: 1,
      title: 'Adblocker Detect',
      route: '/adblocker-detect'
    },
    {
      id: 2,
      title: 'Detect Browser Screen Zoom Level',
      route: '/detect-browser-screen-zoom-level'
    },
    {
      id: 3,
      title: 'Detect Display Screen Zoom Level',
      route: '/detect-display-screen-zoom-level'
    },
  ]

  editorList: any[] = [
    {
      id: 1,
      title: 'Dark Editor',
      route: '/dark-editor'
    },
    {
      id: 2,
      title: 'Dark Editor 2',
      route: '/dark-editor-2'
    },
    {
      id: 3,
      title: 'Editable Textarea',
      route: '/editable-textarea'
    },
  ]

  routingList: any[] = [
    {
      id: 1,
      title: 'cart/product-list',
      route: '/cart/product-list'
    },

  ]

  angularTutorialsList: any[] = [
    {
      id: 1,
      title: 'Reusable Templates',
      route: '/reusable-templates'
    },
    {
      id: 2,
      title: 'Content Childeren Template',
      route: '/content-childeren-template'
    },
    {
      id: 3,
      title: 'Create Embaded View',
      route: '/create-embaded-view'
    },
    {
      id: 4,
      title: 'Dynamic component',
      route: '/dynamic-component'
    },
    {
      id: 5,
      title: 'Dynamic Template',
      route: '/dynamic-template'
    },
    {
      id: 6,
      title: 'For-Loop If-Else',
      route: '/for-loop-if-else'
    },
    {
      id: 7,
      title: 'Host Decorator',
      route: '/host-decorator'
    },
    {
      id: 8,
      title: 'Host Directive',
      route: '/host-directive'
    },
    {
      id: 9,
      title: 'Lazy Loading Defer',
      route: '/lazy-loading-defer'
    },
    {
      id: 10,
      title: 'Let Directive',
      route: '/let-directive'
    },
    {
      id: 11,
      title: 'Optional Decorator',
      route: '/optional-decorator'
    },
    {
      id: 12,
      title: 'Skip-Skipself Decorator',
      route: '/skip-skipself-decorator'
    },
    {
      id: 13,
      title: 'Switch Case Template',
      route: '/switch-case-template'
    },
  ]

}
