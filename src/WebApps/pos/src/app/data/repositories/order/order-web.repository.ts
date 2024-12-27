import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {DOC_TYPE, PATHS, PATHS_API} from "@domain/enums/main.enum";
import {ApiResponse} from "@domain/models/api-response";
import {OrderMapper} from "@data/repositories/order/order.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {map} from "rxjs/operators";
import {UserSelectHtmlOnly} from "@domain/models/user.model";
import {groupRoomTableUtil} from "@domain/utils/group-room-table.util";
import {OrderRead} from "@domain/models/order.model";
import {fetchLimitUtil} from "@domain/utils/fetch-limit.util";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root'
})
export class OrderWebRepository implements OrderRepository {
  private _url = `${PATHS_API.RESTAURANT}${PATHS.ORDER}`;
  private http = inject(HttpClient);

  // Método para obtener datos filtrados
  getDataFilter() {
    const json = JSON.stringify({ tipo: 4 });
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`, {
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
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`, {
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
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`, {
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
    return this.http.delete<ApiResponse>(`${this._url}${id}`);
  }

  // Método para obtener una orden por ID
  getId(id: number) {
    const json = JSON.stringify({ id, tipo: 2 });
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        const { order, orderItems } = JSON.parse(response.payload as string);
        return OrderMapper.fromApiData({ order: order[0], orderItems });
      })
    );
  }

  // Método para obtener estadísticas
  getStats<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 5 });
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map(response => {
        const result = {
          sales: [] as any[],
          productsTop: [] as any[],
          documentCounts: [] as any[],
        };

        if (response.code === "1" && response.payload) {
          const mainData = JSON.parse(response.payload as string);
          // Desestructuración para mejorar la legibilidad
          const { order = [], docs = [], productsTop = [], documentCounts = [] } = mainData;

          // Asignación de datos
          result.sales = [...order, ...docs];
          result.productsTop = productsTop;


          result.documentCounts =  documentCounts;
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
  private executePost<T>(data: T) {
    return this.http.post<ApiResponse>(`${this._url}`, { data }).pipe(
      map(response => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      })
    );
  }

  // Método para realizar una solicitud PUT
  private executePut<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this._url}${id}`, { data }).pipe(
      map(response => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      })
    );
  }

  // Usar el utilitario para manejar la solicitud POST
  public post = fetchLimitUtil(<T>(data: T) => this.executePost(data));

  // Usar el utilitario para manejar la solicitud PUT
  public put = fetchLimitUtil(<T extends {orderDocument: any, items:any[]}>(id: number, data: T) => this.executePut(id, data));


}
