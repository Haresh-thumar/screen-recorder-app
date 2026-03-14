import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-1',
  imports: [],
  templateUrl: './compo-1.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 700px;
    background: #ff8989ff;
    color: #000;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo1Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 1 load Successfull ! ----')
  }

}
