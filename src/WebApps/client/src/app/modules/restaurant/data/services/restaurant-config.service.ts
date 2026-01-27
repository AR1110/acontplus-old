import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable({
  providedIn: 'root',
})
export class RestaurantConfigService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.CONFIG}`;
  private http = inject(HttpClient);

  getMainData() {
    const json = JSON.stringify({
      tipo: 1,
    });
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}` )
      .pipe(
        map((response) => {
          const result = {
            estabs: [] as GroupedEstab[],
          };
          if (response.code === '1') {
            const { puntosEmision, bodegas } = JSON.parse(response.payload as string);

            const obj = {
              estabs: puntosEmision,
              bodegas: bodegas,
              isGroupBodega: true,
              isGroupPuntoEmision: true,
            };
            result.estabs = groupEstabUtil(obj);
          }
          return result;
        }),
      );
  }
}
