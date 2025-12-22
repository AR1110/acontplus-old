import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { INVENTORY_PATHS } from '@inventory/inventory.const';

import { ProductPhotoRepository } from '@inventory/data/repositories/product-photo.repository';
import {
  ProductPhotoGetId,
  ProductPhotoSaveParam,
} from '@inventory/data/models/product-photo.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductPhotoHttp implements ProductPhotoRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_PHOTO}`;
  private _http = inject(HttpClient);

  getByProductId(productId: number) {
    return this._http.get<ApiResponseLegacy>(`${this._url}${productId}`).pipe(
      map((response) => {
        const result = new ApiResponseLegacy<ProductPhotoGetId>();
        let productPhotos = [] as any[];
        if (response.code === '1') {
          const mainData = response.payload as any[];
          productPhotos = mainData.map((item: any) => {
            return {
              productId: item.productId,
              s3ObjectKey: item.s3ObjectKey,
              s3ObjectUrl: item.s3ObjectUrl,
              isDefault: item.isDefault,
              id: item.id,
            };
          });
        }
        result.payload = {
          productPhotos,
        };
        return result;
      }),
    );
  }

  post(params: ProductPhotoSaveParam) {
    const formData = new FormData();
    formData.append('file', params.file);
    return this._http.post<ApiResponseLegacy>(`${this._url}${params.productId}`, formData);
  }

  put(params: ProductPhotoSaveParam) {
    const formData = new FormData();
    formData.append('file', params.file);
    const json = JSON.stringify(params.data);
    return this._http.post<ApiResponseLegacy>(
      `${this._url}Put/${params.id}?json=${json}`,
      formData,
    );
  }

  setDefault(id: number, isDefault: boolean) {
    return this._http.put<ApiResponseLegacy>(`${this._url}SetDefault/${id}/${isDefault}`, null);
  }

  putStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }
}
