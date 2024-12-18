import {ClassProvider} from "@angular/core";
import {OrderRepository} from "@domain/repositories/order.repository";
import {OrderWebRepository} from "@data/repositories/order/order-web.repository";


export const orderProvider:ClassProvider = {
  provide: OrderRepository,
  useClass: OrderWebRepository
}
