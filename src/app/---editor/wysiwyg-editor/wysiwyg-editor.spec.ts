import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygEditor } from './wysiwyg-editor';

describe('WysiwygEditor', () => {
  let component: WysiwygEditor;
  let fixture: ComponentFixture<WysiwygEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
