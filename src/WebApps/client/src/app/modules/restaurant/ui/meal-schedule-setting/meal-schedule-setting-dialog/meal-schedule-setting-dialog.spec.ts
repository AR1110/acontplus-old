import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealScheduleSettingDialog } from './meal-schedule-setting-dialog';

describe('MealScheduleSettingDialog', () => {
  let component: MealScheduleSettingDialog;
  let fixture: ComponentFixture<MealScheduleSettingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealScheduleSettingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealScheduleSettingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
