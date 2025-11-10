import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { ProductPhotoSaveParam } from '@inventory/product/domain/entities/product-photo.model';
import { ProductPhotoRepository } from '@inventory/product/domain/repositories/product-photo.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoPutUseCase
  implements BaseUseCase<ApiResponseLegacy, ProductPhotoSaveParam>
{
  private repo = inject(ProductPhotoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: ProductPhotoSaveParam): Observable<ApiResponseLegacy> {
    return this.repo.put(params);
  }
}
