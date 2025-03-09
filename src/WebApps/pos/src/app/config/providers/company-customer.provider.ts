import {ClassProvider} from "@angular/core";
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";
import {CompanyCustomerRepositoryImpl} from "@data/repositories/company-customer/company-customer-repository-impl";


export const companyCustomerProvider:ClassProvider = {
  provide: CompanyCustomerRepository,
  useClass: CompanyCustomerRepositoryImpl
}
