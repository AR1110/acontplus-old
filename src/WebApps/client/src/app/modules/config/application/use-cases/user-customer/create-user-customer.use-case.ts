import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { UserCustomerRepository } from '@modules/config/domain/repositories/user-customer.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserCustomerUseCase<T> implements BaseUseCase<ApiResponse, T> {
  constructor(private repo: UserCustomerRepository) {}

  execute(params: T) {
    return this.repo.create(params);
  }
}
