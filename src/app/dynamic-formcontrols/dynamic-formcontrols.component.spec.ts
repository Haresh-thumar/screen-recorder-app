import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormcontrolsComponent } from './dynamic-formcontrols.component';

describe('DynamicFormcontrolsComponent', () => {
  let component: DynamicFormcontrolsComponent;
  let fixture: ComponentFixture<DynamicFormcontrolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormcontrolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormcontrolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
