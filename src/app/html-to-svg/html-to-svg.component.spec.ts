import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlToSvgComponent } from './html-to-svg.component';

describe('HtmlToSvgComponent', () => {
  let component: HtmlToSvgComponent;
  let fixture: ComponentFixture<HtmlToSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlToSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlToSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
