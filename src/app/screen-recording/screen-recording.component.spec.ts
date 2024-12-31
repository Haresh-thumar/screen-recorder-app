import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenRecordingComponent } from './screen-recording.component';

describe('ScreenRecordingComponent', () => {
  let component: ScreenRecordingComponent;
  let fixture: ComponentFixture<ScreenRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenRecordingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
