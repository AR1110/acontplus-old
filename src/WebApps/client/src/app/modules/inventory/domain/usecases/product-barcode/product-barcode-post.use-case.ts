import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import {ProductBarcodeRepository} from "@inventory/domain/repositories/product-barcode.repository";


@Injectable({
  providedIn: 'root',
})
export class ProductBarcodePostUseCase<T> implements BaseUseCase<ApiResponse, T> {
  constructor(private repo: ProductBarcodeRepository) {}

  execute (params: T): Observable<ApiResponse> {
    return this.repo.post(params);
  }
}
