import {inject, Injectable} from "@angular/core";
import {OrderRepository} from "@domain/repositories/order.repository";
import { PATHS, PATHS_API} from "@domain/enums/main.enum";
import {HttpClient} from "@angular/common/http";
import { ApiResponse } from "@/domain/models/api-response";
import { ListOrderResponse} from "@/domain/models/order.model";
import {Observable} from "rxjs";
import {withoutSpinner} from "acontplus-utils";
import {map} from "rxjs/operators";
import {UserSelectHtmlOnly} from "@domain/models/user.model";
import {groupRoomTableUtil} from "@domain/utils/group-room-table.util";
import {fetchLimitUtil} from "@domain/utils/fetch-limit.util";
import {ListOrderMapper} from "@data/repositories/order/list-order.mapper";
import {GetIdOrderMapper} from "@data/repositories/order/get-id-order.mapper";
import {GetStatsOrderMapper} from "@data/repositories/order/get-stats-order.mapper";

@Injectable({
  providedIn: 'root'
})
export class OrderRepositoryImpl implements OrderRepository {
  list<T>(obj: T): Observable<ListOrderResponse> {
    const json = ListOrderMapper.toJson(obj)
    return this.http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map((response) => ListOrderMapper.fromJson(response)),
      );
  }
  getDataFilter() {
    const json = JSON.stringify({ tipo: 4 });
    return this.http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map((response) => {
          const data = {
            tablesGroup: [] as any[],
            users: [] as UserSelectHtmlOnly[],
          };
          if (response.code === '1') {
            const { tables, usuarios } = JSON.parse(response.payload as string);
            data.tablesGroup = groupRoomTableUtil(tables);
            data.users = usuarios;
          }
          return data;
        }),
      );
  }


  // Método para obtener documentos de la orden
  getOrderDocs(orderId: number) {
    const json = JSON.stringify({ tipo: 3, id: orderId });
    return this.http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => {
          if (response.code === '1') {
            return JSON.parse(response.payload as string).orderDocuments || [];
          }
          return [];
        }),
      );
  }

  // Método para anular una orden
  setAnul(id: number) {
    return this.http.delete<ApiResponse>(`${this._url}${id}`);
  }

  // Método para obtener una orden por ID
  getId(id: number) {
    const json = GetIdOrderMapper.toJson(id);
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => GetIdOrderMapper.fromJson(response)),
    );
  }

  // Método para obtener estadísticas
  getStats<T>(obj: T) {
    const json = GetStatsOrderMapper.toJson(obj)
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) =>GetStatsOrderMapper.fromJson(response)),
    );
  }

  // Método para realizar una solicitud POST
  private executePost<T>(data: T) {
    return this.http.post<ApiResponse>(`${this._url}`, { data }).pipe(
      map((response) => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      }),
    );
  }

  // Método para realizar una solicitud PUT
  private executePut<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this._url}${id}`, { data }).pipe(
      map((response) => {
        const mainData = JSON.parse(response.payload as string);
        return { ...response, payload: mainData };
      }),
    );
  }

  // Usar el utilitario para manejar la solicitud POST
  public post = fetchLimitUtil(<T>(data: T) => this.executePost(data));

  // Usar el utilitario para manejar la solicitud PUT
  public put = fetchLimitUtil(
    <T extends { orderDocument: any; items: any[] }>(id: number, data: T) =>
      this.executePut(id, data),
  );
  private _url = `${PATHS_API.RESTAURANT}${PATHS.ORDER}`;
  private http = inject(HttpClient);
}
