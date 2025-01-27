import {companyCustomerProvider} from "@customer/providers/company-customer.provider";
import {supplierProvider} from "@customer/providers/supplier.provider";
import {customerProvider} from "@customer/providers/customer.provider";
import {sriCustomerProvider} from "@customer/providers/sri-customer.provider";


export const customerMainProviders = [
  companyCustomerProvider,
  supplierProvider,
  customerProvider,
  sriCustomerProvider
]
