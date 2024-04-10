import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { map } from 'rxjs';

import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.ORDER}`;
  private http = inject(HttpClient);
  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  getId(id: number) {
    let json = JSON.stringify({
      id,
      tipo: 4
    })
    return this.http
      .get(`${this.url}?json=${json}`)
      .pipe(
        map((response) => {
          let data = {
            order: {} as any,
            establecimientos: [] as Array<GroupedEstab>,
            orderMaintenances: [] as any,
            orderDetails: [] as any,
            feeds: [] as any,
            taxes: [] as any[],
            taxPercents: [] as any[]
          }
          if(isApiResponse(response)){
            if(response.code==="1"){
              let {
                order,
                orderDetails,
                orderMaintenances,
                estabs,
                bodegas,
                feeds,
                taxes,
                taxPercents
              } = JSON.parse(response.payload as string)

              data.order = order[0];
              data.orderDetails = orderDetails;
              data.orderMaintenances = orderMaintenances;

              console.log(orderMaintenances)

              data.feeds = feeds;
              data.taxes = taxes;
              data.taxPercents = taxPercents;
              data.establecimientos = groupEstabUtil({
                estabs,
                bodegas,
                isGroupPuntoEmision: true,
                isGroupBodega: true
              })

            }
          }
          return data;
        }));
  }

  get(params: any) {
    return this.http
      .get(`${this.url}?json=${params}`)
      .pipe(map((response) => response));
  }

  convert(data: any) {
    return this.http
      .post(`${this.url}Convert`, data)
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
