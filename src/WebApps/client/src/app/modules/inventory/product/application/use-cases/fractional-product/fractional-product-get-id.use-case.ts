import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { FractionalProductRepository } from '@inventory/product/domain/repositories/fractional-product.repository';
import { FractionalProductDataGetId } from '@inventory/product/domain/entities/fractional-product.model';

@Injectable({
  providedIn: 'root',
})
export class FractionalProductGetIdUseCase
  implements BaseUseCase<ApiResponse<FractionalProductDataGetId>, number>
{
  private repo = inject(FractionalProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: number): Observable<ApiResponse<FractionalProductDataGetId>> {
    return this.repo.getId(params);
  }
}
