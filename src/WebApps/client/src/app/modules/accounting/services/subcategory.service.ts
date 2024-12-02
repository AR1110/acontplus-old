import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ACCOUNTING_PATHS } from '@modules/accounting/enums/accounting.constants';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUBCATEGORY}`;

  get<T extends { tipo: number }>(parameters: T) {
    const handleResponse = (tipo: number, payload: any) => {
      switch ((parameters as any)?.tipo) {
        case 2:
          return { categories: payload.categories || [] };
        default:
          return {
            subcategories: payload.subcategories || [],
          };
      }
    };

    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return handleResponse(parameters.tipo, {});
          }
          try {
            const parsedPayload = JSON.parse(response.payload as string);
            return handleResponse(parameters.tipo, parsedPayload);
          } catch (error) {
            console.warn('Failed to parse response payload:', error);
            return handleResponse(parameters.tipo, {});
          }
        }),
      );
  }

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  post(data: any) {
    return this.http
      .post(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
