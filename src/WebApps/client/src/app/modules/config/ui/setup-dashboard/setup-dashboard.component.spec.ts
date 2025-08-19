import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDashboardComponent } from './setup-dashboard.component';

describe('SetupDashboardComponent', () => {
  let component: SetupDashboardComponent;
  let fixture: ComponentFixture<SetupDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
