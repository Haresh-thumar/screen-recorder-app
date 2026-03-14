import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-8',
  imports: [],
  templateUrl: './compo-8.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 700px;
    background: #2f82ffff;
    color: #ffffffff;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo8Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 8 load Successfull ! ----')
  }

}
