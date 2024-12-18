import { ApiResponse } from "@/domain/models/api-response";
import { Observable } from "rxjs";
import {Order} from "@domain/models/order.model";

export abstract class OrderRepository {
  abstract getDataFilter():Observable<any>
  abstract getAll<T>(obj: T): Observable<any[]>;
  abstract getOrderDocs(orderId: number): Observable<any[]>;
  abstract setAnul(id: number):Observable<ApiResponse>;
  abstract getId(id: number):Observable<{ order: Order }>;
  abstract getStats<T>(obj: T): Observable<{
    sales:   any[],
    productsTop:   any[],
    documentCounts:   any[],
  }>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, data: T):Observable<ApiResponse>;
}
