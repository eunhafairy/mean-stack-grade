import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddSubjectComponent } from './dialog-add-subject.component';

describe('DialogAddSubjectComponent', () => {
  let component: DialogAddSubjectComponent;
  let fixture: ComponentFixture<DialogAddSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
