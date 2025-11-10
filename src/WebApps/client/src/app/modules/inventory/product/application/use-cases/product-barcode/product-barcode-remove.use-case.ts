import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { ProductBarcodeRepository } from '@inventory/product/domain/repositories/product-barcode.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductBarcodeRemoveUseCase<T> implements BaseUseCase<ApiResponseLegacy, number> {
  constructor(private repo: ProductBarcodeRepository) {}

  execute(id: number): Observable<ApiResponseLegacy> {
    return this.repo.remove(id);
  }
}
