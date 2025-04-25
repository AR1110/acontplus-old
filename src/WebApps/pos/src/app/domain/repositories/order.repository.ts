import { ApiResponse } from "@/domain/models/api-response";
import { Observable } from "rxjs";
import {
  GetFilterDataOrderResponse,
  GetIdOrderResponse,
  GetStatsOrderResponse,
  ListOrderResponse,
} from "@domain/models/order.model";

export abstract class OrderRepository {
  abstract getDataFilter():Observable<GetFilterDataOrderResponse>
  abstract list<T>(obj: T): Observable<ListOrderResponse>;
  abstract getOrderDocs(orderId: number): Observable<any[]>;
  abstract setAnul(id: number):Observable<ApiResponse>;
  abstract getId(id: number):Observable<GetIdOrderResponse>;
  abstract getStats<T>(obj: T): Observable<GetStatsOrderResponse>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, data: T):Observable<ApiResponse>;
}
