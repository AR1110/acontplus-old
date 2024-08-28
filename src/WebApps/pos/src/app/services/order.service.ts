import { inject, Injectable } from '@angular/core';
import { DOC_TYPE, PATHS, PATHS_API } from "@/enums/main.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { OrderRead } from "@/models/order.model";
import { GroupedEstab } from "@/models/estab.model";
import { UserSelectHtmlOnly } from "@/models/user.model";
import { groupEstabUtil } from "@core/utils/group-estab.util";
import { ApiResponse } from "@/models/api-response";
import { OrderAdapter } from "@/adapters/order.adapter";
import { groupRoomTableUtil } from '@/core/utils/group-room-table.util';
import { getNoLoader } from '@/core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = `${PATHS_API.RESTAURANT}${PATHS.ORDER}`;
  private http = inject(HttpClient);
  private orderAdapter = inject(OrderAdapter)


  getDataFilter() {
    let json = JSON.stringify({
      tipo: 4
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        let data = {
          estabs: [] as GroupedEstab[],
          tablesGroup: [] as any[],
          users: [] as UserSelectHtmlOnly[]
        }
        if (response.code === "1") {
          const { establecimientos, tables, usuarios } = JSON.parse(response.payload as string);

          data.estabs = groupEstabUtil({
            puntosEmisionEstab: establecimientos,
            isGroupPuntoEmision: true
          })

          const groupedItemsArray = groupRoomTableUtil(tables)
          data.tablesGroup = groupedItemsArray;
          data.users = usuarios;
        }
        return data;
      })
    )
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        let orders: OrderRead[] = [];
        if (response.code === "1") {
          orders = JSON.parse(response.payload as string).orders.map((item: any) => {
            return {
              id: item.id,
              codDoc: DOC_TYPE.OR,
              codEstab: item.codEstab,
              sequence: item.sequence,
              serie: item.serie,
              tax: item.tax,
              discount: item.discount,
              tip: item.tip,
              total: item.total,
              obs: item.obs,
              createdAt: item.createdAt,
              enabled: item.enabled,
              deleted: item.deleted,
              uuid: item.uuid,
              razonSocialComprador: item.nameFiscal,
              userName: item.userName,
              totalRecords: item.totalRecords,
              divided: item.divided,
              finished: item.finished,
              tableName: item.tableName,
            }
          })
        }

        return orders;
      })
    )
  }



  getOrderDocs(orderId: number) {
    let json = JSON.stringify({
      tipo: 3,
      id: orderId
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        let results = [];
        if (response.code === "1") {
          results = JSON.parse(response.payload as string).orderDocuments || [];
        }
        return results;
      })
    )
  }


  setAnul(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`)
  }


  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 2
    })
    return this.http.get<ApiResponse
    >(`${this.url}?json=${json}`).pipe(
      map((response) => {
        const { order, orderItems } = JSON.parse(response.payload as string)

        const params = {
          order: order[0],
          orderItems
        }
        return this.orderAdapter.getIdFrom(params)

      })
    )
  }



  post<T>(data: T) {
    return this.http.post<ApiResponse>(`${this.url}`, { data }).pipe(
      map(response => {

        let mainData = JSON.parse(response.payload as string)

        response.payload = mainData;
        return response;

      })
    )
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data })
  }

}
