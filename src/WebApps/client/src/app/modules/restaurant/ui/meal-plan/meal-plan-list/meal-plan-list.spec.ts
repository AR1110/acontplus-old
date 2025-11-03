import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanList } from './meal-plan-list';

describe('MealPlanList', () => {
  let component: MealPlanList;
  let fixture: ComponentFixture<MealPlanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlanList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealPlanList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
