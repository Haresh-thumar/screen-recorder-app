import { Component } from '@angular/core';
import { Compo1Component } from "../components/compo-1/compo-1.component";
import { Compo2Component } from "../components/compo-2/compo-2.component";
import { Compo3Component } from "../components/compo-3/compo-3.component";
import { Compo4Component } from "../components/compo-4/compo-4.component";
import { Compo5Component } from "../components/compo-5/compo-5.component";
import { Compo6Component } from "../components/compo-6/compo-6.component";
import { Compo7Component } from '../components/compo-7/compo-7.component';
import { Compo8Component } from "../components/compo-8/compo-8.component";
import { LazyLoadDirective } from '../directives/lazy-load.directive';

@Component({
  selector: 'app-main-lazy-load-compo',
  imports: [Compo1Component, Compo2Component, Compo3Component, Compo4Component, Compo5Component, Compo6Component, Compo7Component, Compo8Component, LazyLoadDirective],
  templateUrl: './main-lazy-load-compo.component.html',
  styles: [`
    .container {
      width: 1400px;
      margin: 50px auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .header {
      text-align: center;
      padding: 30px 0 50px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      margin-bottom: 50px;
    }

    .header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    .header p {
      margin: 0 0 20px 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .reset-btn {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      border-radius: 25px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .reset-btn:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
    }

    .component-wrapper {
      margin-bottom: 50px;
      // position: relative;
    }
    `]
})
export class MainLazyLoadCompoComponent {

  resetAll(): void {
    window.location.reload();
  }

}
