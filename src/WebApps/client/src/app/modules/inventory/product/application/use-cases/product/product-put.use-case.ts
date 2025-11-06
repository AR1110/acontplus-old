import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ProductRepository } from '@inventory/product/domain/repositories/product.repository';
import { ProductDataForm } from '@inventory/product/domain/entities/product.entity';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductPutUseCase<T>
  implements BaseUseCase<ApiResponseLegacy, { id: number; data: T }>
{
  private repo = inject(ProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: { id: number; data: T }): Observable<ApiResponseLegacy> {
    return this.repo.put(params.id, params.data);
  }
}
