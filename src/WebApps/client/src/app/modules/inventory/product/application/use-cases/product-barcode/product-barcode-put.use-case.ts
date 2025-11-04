import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { ProductBarcodeRepository } from '@inventory/product/domain/repositories/product-barcode.repository';

interface Params<T> {
  id: number;
  data: T;
}
@Injectable({
  providedIn: 'root',
})
export class ProductBarcodePutUseCase<T> implements BaseUseCase<ApiResponse, Params<T>> {
  private repo = inject(ProductBarcodeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Params<T>): Observable<ApiResponse> {
    return this.repo.put(params.id, params.data);
  }
}
