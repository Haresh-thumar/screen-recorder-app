import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildParagraphComponent } from './child-paragraph.component';

describe('ChildParagraphComponent', () => {
  let component: ChildParagraphComponent;
  let fixture: ComponentFixture<ChildParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildParagraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
