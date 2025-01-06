import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Base64CompressComponent } from './base64-compress.component';

describe('Base64CompressComponent', () => {
  let component: Base64CompressComponent;
  let fixture: ComponentFixture<Base64CompressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Base64CompressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Base64CompressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
