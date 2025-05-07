import {ClassProvider} from "@angular/core";
import {CompanyCustomerRepository} from "@customer/domain/repositories/company-customer.repository";
import {CompanyCustomerWebRepository} from "@customer/data/company-customer/company-customer-web.repository";


export const companyCustomerProvider:ClassProvider = {
  provide: CompanyCustomerRepository,
  useClass: CompanyCustomerWebRepository
}
