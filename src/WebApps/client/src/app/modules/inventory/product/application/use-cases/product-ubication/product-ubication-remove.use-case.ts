import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { ProductUbicationRepository } from '@inventory/product/domain/repositories/product-ubication.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductUbicationRemoveUseCase<T> implements BaseUseCase<ApiResponseLegacy, number> {
  private repo = inject(ProductUbicationRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(id: number): Observable<ApiResponseLegacy> {
    return this.repo.remove(id);
  }
}
