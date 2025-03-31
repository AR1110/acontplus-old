import { PATHS, PATHS_API } from '@domain/enums/main.enum';
import { ApiResponse } from '@domain/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { withoutSpinner } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.RESTAURANT}${PATHS.PROMOTION}`;
  constructor() {}

  getPromotions<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 2,
      ...obj,
    });

    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => {
          let promotions = [] as any;
          if (response.code === '1' && response.payload) {
            let mainData =
              (response.payload && JSON.parse(response.payload as string)) ||
              {};
            promotions = mainData.promotions_pos.map((item: any) => {
              return {
                id: item.id,
                description: item.description,
                img: item.s3ObjectUrl,
              };
            });
          }
          return promotions;
        }),
      );
  }
}
