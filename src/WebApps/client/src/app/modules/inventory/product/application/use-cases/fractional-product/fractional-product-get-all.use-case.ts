import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ProductRepository } from '@inventory/product/domain/repositories/product.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { FractionalProductRepository } from '@inventory/product/domain/repositories/fractional-product.repository';

interface Params {
  data: any;
  totalRecords: number;
}
@Injectable({
  providedIn: 'root',
})
export class FractionalProductGetAllUseCase<T>
  implements BaseUseCase<ApiResponseLegacy<Params>, T>
{
  private repo = inject(FractionalProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: T): Observable<ApiResponseLegacy<Params>> {
    return this.repo.getAll(params);
  }
}
