import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { imgDefault } from '@core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTIONS}`;
  private http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });

    return this.http.get<ApiResponseLegacy>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        const result = {
          days: [] as any[],
          promotions: [] as any[],
        };
        if (response.code === '1') {
          const { days, promotions: promotionsTemp } = JSON.parse(response.payload as string);
          result.days = days || [];
          const promotions = promotionsTemp || [];
          result.promotions = promotions.map((item: any) => {
            const { s3ObjectUrl, ...rest } = item;
            return {
              ...rest,
              img: s3ObjectUrl || imgDefault(),
            };
          });
        }
        return result;
      }),
    );
  }

  post<T>(obj: T, file: any) {
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponseLegacy>(`${this.url}?json=${json}`, formData);
  }

  put<T>(id: number, obj: T, file: any) {
    const json = JSON.stringify(obj);

    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<ApiResponseLegacy>(`${this.url}${id}?json=${json}`, formData);
  }
}
