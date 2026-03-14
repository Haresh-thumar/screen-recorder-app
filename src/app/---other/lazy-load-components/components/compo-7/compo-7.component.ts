import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-7',
  imports: [],
  templateUrl: './compo-7.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 700px;
    background: #f71cffff;
    color: #ffffffff;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo7Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 7 load Successfull ! ----')
  }

}
