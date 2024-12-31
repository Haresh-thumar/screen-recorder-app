import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCaptureComponent } from './img-capture.component';

describe('ImgCaptureComponent', () => {
  let component: ImgCaptureComponent;
  let fixture: ComponentFixture<ImgCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgCaptureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
