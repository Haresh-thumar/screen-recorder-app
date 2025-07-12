import { Component, Optional } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-optional-decorator',
  imports: [],
  templateUrl: './optional-decorator.component.html',
  styleUrl: './optional-decorator.component.scss'
})
export class OptionalDecoratorComponent {
  constructor(@Optional() private userService: UserService) {
    if (userService) {
      // userService is available, use it
      console.log('UserService is available');
    } else {
      // userService is not available, handle this case
      console.log('UserService is not available');
    }
  }
}
