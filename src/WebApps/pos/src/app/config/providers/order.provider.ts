import {ClassProvider} from "@angular/core";
import {OrderRepository} from "@domain/repositories/order.repository";
import {OrderRepositoryImpl} from "@data/repositories/order/order-repository.impl";


export const orderProvider:ClassProvider = {
  provide: OrderRepository,
  useClass: OrderRepositoryImpl
}
