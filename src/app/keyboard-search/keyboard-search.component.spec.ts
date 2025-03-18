import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardSearchComponent } from './keyboard-search.component';

describe('KeyboardSearchComponent', () => {
  let component: KeyboardSearchComponent;
  let fixture: ComponentFixture<KeyboardSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
