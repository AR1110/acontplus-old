import {Provider} from "@angular/core";
import {SriCustomerRepository} from "@customer/domain/repositories/sri-customer.repository";
import {SriCustomerWebRepository} from "@customer/data/sri-customer/sri-customer-web.repository";
import {SupplierRepository} from "@customer/domain/repositories/supplier.repository";
import {SupplierWebRepository} from "@customer/data/supplier/supplier-web.repository";
import {CustomerRepository} from "@customer/domain/repositories/customer.repository";
import {CustomerWebRepository} from "@customer/data/customer/customer-web.repository";
import {CompanyCustomerRepository} from "@customer/domain/repositories/company-customer.repository";
import {CompanyCustomerWebRepository} from "@customer/data/company-customer/company-customer-web.repository";

export const DATA_CUSTOMER_IOC:Provider[]=[
  {
    provide: SriCustomerRepository,
    useClass: SriCustomerWebRepository
  },
  {
    provide: SupplierRepository,
    useClass: SupplierWebRepository,
  },
  {
    provide: CustomerRepository,
    useClass: CustomerWebRepository
  },
  {
    provide: CompanyCustomerRepository,
    useClass: CompanyCustomerWebRepository
  }
]
