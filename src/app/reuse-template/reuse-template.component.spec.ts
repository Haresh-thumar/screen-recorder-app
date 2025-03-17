import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseTemplateComponent } from './reuse-template.component';

describe('ReuseTemplateComponent', () => {
  let component: ReuseTemplateComponent;
  let fixture: ComponentFixture<ReuseTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuseTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuseTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
