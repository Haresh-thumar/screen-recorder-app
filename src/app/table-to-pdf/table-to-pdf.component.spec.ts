import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableToPdfComponent } from './table-to-pdf.component';

describe('TableToPdfComponent', () => {
  let component: TableToPdfComponent;
  let fixture: ComponentFixture<TableToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableToPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
