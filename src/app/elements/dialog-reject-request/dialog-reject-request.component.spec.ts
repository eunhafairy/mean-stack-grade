import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRejectRequestComponent } from './dialog-reject-request.component';

describe('DialogRejectRequestComponent', () => {
  let component: DialogRejectRequestComponent;
  let fixture: ComponentFixture<DialogRejectRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRejectRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRejectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
