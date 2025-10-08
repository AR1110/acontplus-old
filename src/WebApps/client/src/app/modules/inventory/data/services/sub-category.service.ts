import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { getNoLoader } from '@core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.SUBCATEGORY}`;

  getAll<T>(data: T) {
    const params = JSON.stringify({ ...data, tipo: 1 });
    return this.http
      .get(`${this.url}?json=${params}`, {
        context: getNoLoader(),
      })
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            if (response.code === '0') {
              throw response;
            }
            if (response.code === '1') {
              const subCategorias = JSON.parse(response.payload as string) || [];
              const results = subCategorias.map((category: any) => {
                return {
                  idSubFamilia: category.idSubFamilia,
                  idFamilia: category.idFamilia,
                  descripcion: category.descripcion,
                  estado: category.estado,
                  siglas: category.siglas,
                  codigo: category.codigo,
                  montoObjetivo: category.montoObjetivo,
                  nombreFamilia: category.nombreFamilia,
                  ultimoSecuencial: category.ultimoSecuencial,
                  s3ObjectKey: category.s3ObjectKey,
                  s3ObjectUrl: category.s3ObjectUrl,
                  subcategoryPhotoId: category.subcategoryPhotoId,
                  totalRecords: category.totalRecords,
                };
              });
              return results;
            }
          }
          return [];
        }),
      );
  }

  post<T>(obj: T, file: Blob | string) {
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.url}?json=${json}`, formData);
  }

  put<T>(id: number, obj: T) {
    const json = JSON.stringify(obj);
    return this.http.put<ApiResponse>(`${this.url}${id}?json=${json}`, null);
  }

  updateStatus(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`);
  }
}
