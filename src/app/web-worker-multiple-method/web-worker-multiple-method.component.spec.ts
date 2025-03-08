import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWorkerMultipleMethodComponent } from './web-worker-multiple-method.component';

describe('WebWorkerMultipleMethodComponent', () => {
  let component: WebWorkerMultipleMethodComponent;
  let fixture: ComponentFixture<WebWorkerMultipleMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebWorkerMultipleMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebWorkerMultipleMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
