import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { ProductPhotoRepository } from '@inventory/product/domain/repositories/product-photo.repository';
import { ProductPhotoGetId } from '@inventory/product/domain/entities/product-photo.model';

@Injectable({
  providedIn: 'root',
})
export class GetProductPhotoUseCase implements BaseUseCase<ApiResponse<ProductPhotoGetId>, number> {
  constructor(private repo: ProductPhotoRepository) {}

  execute(productId: number) {
    return this.repo.getByProductId(productId);
  }
}
