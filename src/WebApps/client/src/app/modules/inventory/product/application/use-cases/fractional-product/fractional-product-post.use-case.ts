import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { FractionalProductDataSave } from '@inventory/product/domain/entities/fractional-product.model';
import { FractionalProductRepository } from '@inventory/product/domain/repositories/fractional-product.repository';

@Injectable({
  providedIn: 'root',
})
export class FractionalProductPostUseCase
  implements BaseUseCase<ApiResponse, FractionalProductDataSave>
{
  private repo = inject(FractionalProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: FractionalProductDataSave): Observable<ApiResponse> {
    return this.repo.post(params);
  }
}
