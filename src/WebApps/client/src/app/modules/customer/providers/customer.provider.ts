import {ClassProvider} from "@angular/core";
import {CustomerRepository} from "@customer/domain/repositories/customer.repository";
import {CustomerWebRepository} from "@customer/data/customer/customer-web.repository";


export const customerProvider:ClassProvider = {
  provide: CustomerRepository,
  useClass: CustomerWebRepository
}
