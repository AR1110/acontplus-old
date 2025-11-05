import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealScheduleSettingList } from './meal-schedule-setting-list';

describe('MealScheduleSettingList', () => {
  let component: MealScheduleSettingList;
  let fixture: ComponentFixture<MealScheduleSettingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealScheduleSettingList],
    }).compileComponents();

    fixture = TestBed.createComponent(MealScheduleSettingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
