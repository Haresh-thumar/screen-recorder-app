import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWorkerArrayTaskComponent } from './web-worker-array-task.component';

describe('WebWorkerArrayTaskComponent', () => {
  let component: WebWorkerArrayTaskComponent;
  let fixture: ComponentFixture<WebWorkerArrayTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebWorkerArrayTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebWorkerArrayTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
