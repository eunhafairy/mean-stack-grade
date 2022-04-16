import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddRequestComponent } from './dialog-add-request.component';

describe('DialogAddRequestComponent', () => {
  let component: DialogAddRequestComponent;
  let fixture: ComponentFixture<DialogAddRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
