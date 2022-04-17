import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestVerdictComponent } from './dialog-request-verdict.component';

describe('DialogRequestVerdictComponent', () => {
  let component: DialogRequestVerdictComponent;
  let fixture: ComponentFixture<DialogRequestVerdictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRequestVerdictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRequestVerdictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
