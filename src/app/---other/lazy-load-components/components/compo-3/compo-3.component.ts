import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-3',
  imports: [],
  templateUrl: './compo-3.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 300px;
    background: #6967ffff;
    color: #000;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo3Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 3 load Successfull ! ----')
  }

}
