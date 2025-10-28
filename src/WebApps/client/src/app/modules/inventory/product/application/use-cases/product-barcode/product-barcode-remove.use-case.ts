import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { ProductBarcodeRepository } from '@inventory/product/domain/repositories/product-barcode.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductBarcodeRemoveUseCase<T> implements BaseUseCase<ApiResponse, number> {
  constructor(private repo: ProductBarcodeRepository) {}

  execute(id: number): Observable<ApiResponse> {
    return this.repo.remove(id);
  }
}
