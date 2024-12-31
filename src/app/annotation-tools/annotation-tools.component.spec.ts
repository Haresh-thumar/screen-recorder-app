import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationToolsComponent } from './annotation-tools.component';

describe('AnnotationToolsComponent', () => {
  let component: AnnotationToolsComponent;
  let fixture: ComponentFixture<AnnotationToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
