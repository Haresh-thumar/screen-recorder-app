import { Component, SkipSelf } from '@angular/core';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-skip-skipself-decorator',
  imports: [],
  templateUrl: './skip-skipself-decorator.component.html',
  styleUrl: './skip-skipself-decorator.component.scss'
})
export class SkipSkipselfDecoratorComponent {

  constructor(@SkipSelf() private configService: ConfigService) {
    // This will use the ConfigService from parent, not the local one
    console.log('Using parent config:', configService.getConfig());
  }

}



