import {ClassProvider} from "@angular/core"; 
import {SriCustomerRepository} from "@customer/core/repositories/sri-customer.repository";
import {SriCustomerWebRepository} from "@customer/data/sri-customer/sri-customer-web.repository";


export const sriCustomerProvider:ClassProvider = {
  provide: SriCustomerRepository,
  useClass: SriCustomerWebRepository
}
