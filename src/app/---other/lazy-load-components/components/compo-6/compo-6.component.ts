import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compo-6',
  imports: [],
  templateUrl: './compo-6.component.html',
  styles: `
  .box-content {
    width: 100%;
    height: 400px;
    background: #2fe7ffff;
    color: #000;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }`
})
export class Compo6Component implements OnInit {

  ngOnInit() {
    console.log('---- Component 6 load Successfull ! ----')
  }

}
