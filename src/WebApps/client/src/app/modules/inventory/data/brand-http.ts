import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TagMapper } from '@inventory/data/mappers/tag.mapper';
import { BrandRepository } from '@inventory/domain/repositories/brand.repository';

@Injectable({
  providedIn: 'root',
})
export class BrandHttp implements BrandRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.BRAND}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const result = {
            brands: [] as any[],
          };
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            const brands = mainData.marcas || [];
            result.brands = brands.map((item: any) => {
              return {
                idMarca: item.idMarca,
                descripcion: item.descripcion,
                estado: item.estado,
                codigo: item.codigo,
                totalRecords: item.totalRecords,
              };
            });
          }
          return result;
        }),
      );
  }
  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(
      `${this._url}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }
  put<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}${id}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }
}
