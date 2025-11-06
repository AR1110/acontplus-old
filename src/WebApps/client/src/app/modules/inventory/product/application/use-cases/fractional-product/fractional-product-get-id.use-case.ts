import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { FractionalProductRepository } from '@inventory/product/domain/repositories/fractional-product.repository';
import { FractionalProductDataGetId } from '@inventory/product/domain/entities/fractional-product.model';

@Injectable({
  providedIn: 'root',
})
export class FractionalProductGetIdUseCase
  implements BaseUseCase<ApiResponseLegacy<FractionalProductDataGetId>, number>
{
  private repo = inject(FractionalProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: number): Observable<ApiResponseLegacy<FractionalProductDataGetId>> {
    return this.repo.getId(params);
  }
}
