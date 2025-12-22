import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonHabitualPurchase } from './non-habitual-purchase';

describe('NonHabitualPurchase', () => {
  let component: NonHabitualPurchase;
  let fixture: ComponentFixture<NonHabitualPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonHabitualPurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonHabitualPurchase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
