import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-4',
  imports: [],
  templateUrl: './compo-4.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 700px;
    background: #ff8b2cff;
    color: #000;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo4Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 4 load Successfull ! ----')
  }

}
