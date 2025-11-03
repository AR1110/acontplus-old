import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { ProductUbicationRepository } from '@inventory/product/domain/repositories/product-ubication.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductUbicationRemoveUseCase<T> implements BaseUseCase<ApiResponse, number> {
  private repo = inject(ProductUbicationRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(id: number): Observable<ApiResponse> {
    return this.repo.remove(id);
  }
}
