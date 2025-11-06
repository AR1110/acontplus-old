import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GetMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/get-meal-consumption-use-case';
import { PaginationParams } from '@acontplus/core';
import { Pagination } from '@acontplus/ng-components';
import { MealConsumption } from '@restaurant/domain/models/meal-consumption';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-meal-consumption-list',
  imports: [],
  templateUrl: './meal-consumption-list.html',
  styleUrl: './meal-consumption-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealConsumptionList {
  private readonly get = inject(GetMealConsumptionUseCase);
  paginationParams = signal(
    new PaginationParams({
      pageIndex: 1,
      pageSize: 10,
    }),
  );
  mealConsumptionConfig = signal(new Pagination(0, 10, 5, 0, [5, 10, 25, 50]));
  mealConsumptions = signal<MealConsumption[]>([]);
  load() {
    return this.get.execute(this.paginationParams()).subscribe((response) => {
      this.mealConsumptions.set(response.items);
      this.mealConsumptionConfig.update((current) => {
        current.totalRecords = response.totalCount;
        current.pageIndex = response.pageIndex - 1; // API uses 1-based, Material uses 0-based
        current.pageSize = response.pageSize;
        return current;
      });
    });
  }
  onPageChange(event: PageEvent): void {
    this.paginationParams.update((current) => {
      current.pageIndex = event.pageIndex + 1;
      current.pageSize = event.pageSize;
      return current;
    });
    this.mealConsumptionConfig.update((current) => {
      current.pageIndex = event.pageIndex;
      current.pageSize = event.pageSize;
      return current;
    });
    this.load();
  }
}
