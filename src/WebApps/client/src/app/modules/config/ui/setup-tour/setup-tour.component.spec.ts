import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTourComponent } from './setup-tour.component';

describe('SetupTourComponent', () => {
  let component: SetupTourComponent;
  let fixture: ComponentFixture<SetupTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
