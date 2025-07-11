import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastrComponent } from './---toaster/toastr/toastr.component';
import { ToastrService } from './---toaster/toastr/toastr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ToastrComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'video-recorder';
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
