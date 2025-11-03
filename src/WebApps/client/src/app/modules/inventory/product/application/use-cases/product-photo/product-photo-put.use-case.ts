import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import { ProductPhotoSaveParam } from '@inventory/product/domain/entities/product-photo.model';
import { ProductPhotoRepository } from '@inventory/product/domain/repositories/product-photo.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoPutUseCase implements BaseUseCase<ApiResponse, ProductPhotoSaveParam> {
  private repo = inject(ProductPhotoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: ProductPhotoSaveParam): Observable<ApiResponse> {
    return this.repo.put(params);
  }
}
