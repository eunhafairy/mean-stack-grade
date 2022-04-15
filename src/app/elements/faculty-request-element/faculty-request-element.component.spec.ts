import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyRequestElementComponent } from './faculty-request-element.component';

describe('FacultyRequestElementComponent', () => {
  let component: FacultyRequestElementComponent;
  let fixture: ComponentFixture<FacultyRequestElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyRequestElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyRequestElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
