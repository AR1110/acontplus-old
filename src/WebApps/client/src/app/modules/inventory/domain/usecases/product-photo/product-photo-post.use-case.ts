import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import {ProductPhotoSaveParam} from "@inventory/domain/models/product-photo.model";
import {ProductPhotoRepository} from "@inventory/domain/repositories/product-photo.repository";


@Injectable({
  providedIn: 'root',
})
export class ProductPhotoPostUseCase implements BaseUseCase<ApiResponse, ProductPhotoSaveParam> {
  constructor(private repo: ProductPhotoRepository) {}

  execute(params: ProductPhotoSaveParam): Observable<ApiResponse> {
    return this.repo.post(params);
  }
}
