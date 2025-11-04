import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { ProductBarcodeRepository } from '@inventory/product/domain/repositories/product-barcode.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductBarcodePostUseCase<T> implements BaseUseCase<ApiResponse, T> {
  private repo = inject(ProductBarcodeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: T): Observable<ApiResponse> {
    return this.repo.post(params);
  }
}
