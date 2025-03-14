import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import {ProductUbicationRepository} from "@inventory/domain/repositories/product-ubication.repository";


@Injectable({
  providedIn: 'root',
})
export class ProductUbicationPostUseCase<T> implements BaseUseCase<ApiResponse, T> {
  constructor(private repo: ProductUbicationRepository) {}

  execute (params: T): Observable<ApiResponse> {
    return this.repo.post(params);
  }
}
