import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealConsumptionList } from './meal-consumption-list';

describe('MealConsumptionList', () => {
  let component: MealConsumptionList;
  let fixture: ComponentFixture<MealConsumptionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealConsumptionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealConsumptionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
