import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
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
            tipo: 1
        })
        return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
            context: getNoLoader()
        }).pipe(
            map(response => {
                console.log(response)
                let result = {
                    estabs: [] as GroupedEstab[]
                }
                if (response.code === "1") {
                    let { puntosEmision, bodegas } = JSON.parse(response.payload as string)
              
                    let obj = {
                        estabs: puntosEmision,
                        bodegas: bodegas,
                        isGroupBodega: true,
                        isGroupPuntoEmision: true,
                    };
                    result.estabs = groupEstabUtil(obj)
                }
                console.log(result)
                return result;
            })
        )
    }
}
