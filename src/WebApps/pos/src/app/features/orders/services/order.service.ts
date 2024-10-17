import { OrderAdapter } from "@/features/orders/adapters/order.adapter";
import { getNoLoader } from '@/core/interceptors/loader.interceptor';
import { groupRoomTableUtil } from '@/core/utils/group-room-table.util';
import { DOC_TYPE, PATHS, PATHS_API } from "@/enums/main.enum";
import { ApiResponse } from "@/models/api-response";
import { UserSelectHtmlOnly } from "@/models/user.model";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { fetchLimitUtil } from '@/core/utils/fetch-limit.util'; // Asegúrate de que la ruta sea correcta
import { OrderRead } from "../models/order.interface";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = `${PATHS_API.RESTAURANT}${PATHS.ORDER}`;
  private http = inject(HttpClient);
  private orderAdapter = inject(OrderAdapter);

  // Método para obtener datos filtrados
  getDataFilter() {
    const json = JSON.stringify({ tipo: 4 });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        const data = {
          tablesGroup: [] as any[],
          users: [] as UserSelectHtmlOnly[]
        };
        if (response.code === "1") {
          const { tables, usuarios } = JSON.parse(response.payload as string);
          data.tablesGroup = groupRoomTableUtil(tables);
          data.users = usuarios;
        }
        return data;
      })
    );
  }

  // Método para obtener todas las órdenes
  getAll<T>(obj: T) {
    const json = JSON.stringify({ tipo: 1, ...obj });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        if (response.code === "1") {
          return JSON.parse(response.payload as string).orders.map((item: any) => ({
            id: item.id,
            codDoc: DOC_TYPE.OR,
            codEstab: item.codEstab,
            serie: item.serie,
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
          })) as OrderRead[];
        }
        return [];
      })
    );
  }

  // Método para obtener documentos de la orden
  getOrderDocs(orderId: number) {
    const json = JSON.stringify({ tipo: 3, id: orderId });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => {
        if (response.code === "1") {
          return JSON.parse(response.payload as string).orderDocuments || [];
        }
        return [];
      })
    );
  }

  // Método para anular una orden
  setAnul(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`);
  }

  // Método para obtener una orden por ID
  getId(id: number) {
    const json = JSON.stringify({ id, tipo: 2 });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        const { order, orderItems } = JSON.parse(response.payload as string);
        return this.orderAdapter.fromApiData({ order: order[0], orderItems });
      })
    );
  }

  // Método para obtener estadísticas
  getStats<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 5 });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response => {
        const result = {
          sales: [] as any[],
          productsTop: [] as any[]
        };
        if (response.code === "1" && response.payload) {
          const mainData = JSON.parse(response.payload as string);
          result.sales = [...mainData.order, ...(mainData.docs || [])];
          result.productsTop = mainData.productsTop || [];
        }
        return result;
      })
    );
  }

  public getQueryParams(obj:any){
    const {items, taxes, ...rest} = obj;
    return {
      orderDocument: rest,
      taxes,
      items
    }
  }

  // Método para realizar una solicitud POST
  private post<T>(data: T) {
    return this.http.post<ApiResponse>(`${this.url}`, { data }).pipe(
      map(response => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      })
    );
  }

  // Método para realizar una solicitud PUT
  private put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data }).pipe(
      map(response => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      })
    );
  }

  // Usar el utilitario para manejar la solicitud POST
  public fetchPostData = fetchLimitUtil(<T>(data: T) => this.post(data));

  // Usar el utilitario para manejar la solicitud PUT
  public fetchPutData = fetchLimitUtil(<T extends {orderDocument: any, items:any[]}>(id: number, data: T) => this.put(id, data));
}
