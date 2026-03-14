import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-2',
  imports: [],
  templateUrl: './compo-2.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 700px;
    background: #00eb89ff;
    color: #000;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo2Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 2 load Successfull ! ----')
  }

}
