import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureSimpleComponent } from './capture-simple.component';

describe('CaptureSimpleComponent', () => {
  let component: CaptureSimpleComponent;
  let fixture: ComponentFixture<CaptureSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
