import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-5',
  imports: [],
  templateUrl: './compo-5.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 900px;
    background: #ff4545ff;
    color: #ffffffff;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo5Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 5 load Successfull ! ----')
  }

}
