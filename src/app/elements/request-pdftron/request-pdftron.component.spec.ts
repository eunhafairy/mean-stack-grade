import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPdftronComponent } from './request-pdftron.component';

describe('RequestPdftronComponent', () => {
  let component: RequestPdftronComponent;
  let fixture: ComponentFixture<RequestPdftronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPdftronComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPdftronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
