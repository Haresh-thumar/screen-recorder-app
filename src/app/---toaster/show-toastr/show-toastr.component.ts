import { Component, inject } from '@angular/core';
import { ToastrComponent } from "../toastr/toastr.component";
import { ToastrService } from '../toastr/toastr.service';

@Component({
  selector: 'app-show-toastr',
  imports: [ToastrComponent],
  templateUrl: './show-toastr.component.html',
  styleUrl: './show-toastr.component.scss'
})
export class ShowToastrComponent {

  private toastrService = inject(ToastrService);

  /*---------------------------------------------------------
                      Custom Toaster
  ---------------------------------------------------------*/
  showToast1() {
    this.toastrService.success('Success', 'This is a success message');
  }

  showToast2() {
    this.toastrService.error('Error', 'This is an error message');
  }

  showToast3() {
    this.toastrService.info('Info', 'This is an info message');
  }

  showToast4() {
    this.toastrService.warning('Warning', 'This is a warning message');
  }

}
