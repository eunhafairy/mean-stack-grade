import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDashboardUserComponent } from './header-dashboard-user.component';

describe('HeaderDashboardUserComponent', () => {
  let component: HeaderDashboardUserComponent;
  let fixture: ComponentFixture<HeaderDashboardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderDashboardUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDashboardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
