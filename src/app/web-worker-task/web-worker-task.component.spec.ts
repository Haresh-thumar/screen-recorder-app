import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWorkerTaskComponent } from './web-worker-task.component';

describe('WebWorkerTaskComponent', () => {
  let component: WebWorkerTaskComponent;
  let fixture: ComponentFixture<WebWorkerTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebWorkerTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebWorkerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
