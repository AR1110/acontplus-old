import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { ProductUbicationRepository } from '@inventory/product/domain/repositories/product-ubication.repository';

interface Params<T> {
  id: number;
  data: T;
}
@Injectable({
  providedIn: 'root',
})
export class ProductUbicationPutUseCase<T> implements BaseUseCase<ApiResponseLegacy, Params<T>> {
  private repo = inject(ProductUbicationRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Params<T>): Observable<ApiResponseLegacy> {
    return this.repo.put(params.id, params.data);
  }
}
