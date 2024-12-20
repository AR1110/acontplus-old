import { Injectable } from '@angular/core';
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root'
})
export class OrderUseCase {
  constructor(
    private repo: OrderRepository,
  ) {}


   getDataFilter() {
    return this.repo.getDataFilter();
   }

   getAll<T>(obj: T){
    return this.repo.getAll<T>(obj);
   }

   getOrderDocs(orderId: number) {
    return this.repo.getOrderDocs(orderId);
   }

   setAnul(id: number) {
    return this.repo.setAnul(id);
   }

   getId(id: number) {
    return this.repo.getId(id);
   }

   getStats<T>(obj: T) {
    return this.repo.getStats<T>(obj);
   }

   post<T>(obj: T) {
    return this.repo.post<T>(obj);
   }

   put<T>(id: number, data: T) {
    return this.repo.put(id, data);
   }
}
