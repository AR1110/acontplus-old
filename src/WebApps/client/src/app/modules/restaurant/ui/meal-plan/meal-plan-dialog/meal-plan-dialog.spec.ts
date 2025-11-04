import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanDialog } from './meal-plan-dialog';

describe('MealPlanDialog', () => {
  let component: MealPlanDialog;
  let fixture: ComponentFixture<MealPlanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealPlanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
