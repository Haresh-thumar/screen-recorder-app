import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentToPdfComponent } from './content-to-pdf.component';

describe('ContentToPdfComponent', () => {
  let component: ContentToPdfComponent;
  let fixture: ComponentFixture<ContentToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentToPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
