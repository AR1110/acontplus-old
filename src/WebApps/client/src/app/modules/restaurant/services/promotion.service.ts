import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { imgDefault } from '@core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTION}`;
  private http = inject(HttpClient);


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response => {
        let result = {
          days: [] as any[],
          promotions: [] as any[]
        }
        if (response.code === "1") {
          let { days, promotions: promotionsTemp } = JSON.parse(response.payload as string);
          result.days = days || [];
          let promotions = promotionsTemp || [];
          result.promotions = promotions.map((item: any) => {
            let { s3ObjectUrl, ...rest } = item;
            return {
              ...rest,
              img: s3ObjectUrl || imgDefault()
            }
          })

        }
        return result;
      })
    )
  }


  post<T>(obj: T, file: any) {
    let json = JSON.stringify(obj)
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.url}?json=${json}`, formData)
  }

  put<T>(id: number, obj: T) {
    return this.http.post<ApiResponse>(`${this.url}${id}`, { data: obj })
  }

}
