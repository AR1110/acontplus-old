import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-meal-plan-dialog',
  imports: [],
  templateUrl: './meal-plan-dialog.html',
  styleUrl: './meal-plan-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealPlanDialog {}
