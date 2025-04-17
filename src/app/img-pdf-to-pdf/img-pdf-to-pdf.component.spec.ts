import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgPdfToPdfComponent } from './img-pdf-to-pdf.component';

describe('ImgPdfToPdfComponent', () => {
  let component: ImgPdfToPdfComponent;
  let fixture: ComponentFixture<ImgPdfToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgPdfToPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgPdfToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
