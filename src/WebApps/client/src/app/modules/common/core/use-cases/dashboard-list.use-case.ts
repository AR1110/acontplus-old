import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { DashboardRepository } from '@modules/common/core/repositories/dashboard.repository';

@Injectable({
  providedIn: 'root',
})
export class DashboardListUseCase implements BaseUseCase<any, any> {
  private readonly repo = inject(DashboardRepository);

  execute<T>(parameters: T) {
    return this.repo.list<T>(parameters);
  }
}
