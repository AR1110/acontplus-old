import { Injectable } from '@angular/core';
import { ProductPhotoRepository } from '@inventory/product/domain/repositories/product-photo.repository';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoPutStatusUseCase implements BaseUseCase<ApiResponseLegacy, number> {
  constructor(private repo: ProductPhotoRepository) {}

  execute(id: number) {
    return this.repo.putStatus(id);
  }
}
