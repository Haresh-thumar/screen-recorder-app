import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferChildComponent } from './defer-child.component';

describe('DeferChildComponent', () => {
  let component: DeferChildComponent;
  let fixture: ComponentFixture<DeferChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeferChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeferChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
