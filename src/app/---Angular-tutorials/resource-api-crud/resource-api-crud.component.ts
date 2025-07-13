import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-resource-api-crud',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './resource-api-crud.component.html',
  styleUrl: './resource-api-crud.component.scss'
})
export class ResourceApiCrudComponent {

}

