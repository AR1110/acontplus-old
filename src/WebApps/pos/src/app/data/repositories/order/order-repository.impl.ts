import {inject, Injectable, OnInit} from "@angular/core";
import {OrderRepository} from "@domain/repositories/order.repository";
import {PATHS, PATHS_API} from "@domain/enums/main.enum";
import {HttpClient} from "@angular/common/http";
import { ApiResponse } from "@/domain/models/api-response";
import { GetFilterDataOrderResponse, Order } from "@/domain/models/order.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderRepositoryImpl implements OrderRepository {
   getDataFilter(): Observable<GetFilterDataOrderResponse> {
      throw new Error("Method not implemented.");
  }
   getAll<T>(obj: T): Observable<any[]> {
      throw new Error("Method not implemented.");
  }
   getOrderDocs(orderId: number): Observable<any[]> {
      throw new Error("Method not implemented.");
  }
   setAnul(id: number): Observable<ApiResponse> {
      throw new Error("Method not implemented.");
  }
   getId(id: number): Observable<{ order: Order; }> {
      throw new Error("Method not implemented.");
  }
   getStats<T>(obj: T): Observable<{ sales: any[]; productsTop: any[]; documentCounts: any[]; }> {
      throw new Error("Method not implemented.");
  }
   post<T>(obj: T): Observable<ApiResponse> {
      throw new Error("Method not implemented.");
  }
   put<T>(id: number, data: T): Observable<ApiResponse> {
      throw new Error("Method not implemented.");
  }
  private _url = `${PATHS_API.RESTAURANT}${PATHS.ORDER}`;
  private http = inject(HttpClient);
}
