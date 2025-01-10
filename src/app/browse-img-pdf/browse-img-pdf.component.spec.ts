import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseImgPdfComponent } from './browse-img-pdf.component';

describe('BrowseImgPdfComponent', () => {
  let component: BrowseImgPdfComponent;
  let fixture: ComponentFixture<BrowseImgPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseImgPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseImgPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
