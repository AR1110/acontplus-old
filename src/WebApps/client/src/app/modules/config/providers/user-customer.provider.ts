import { ClassProvider } from '@angular/core';
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";
import {UserCustomerRepositoryImpl} from "@modules/config/data/user-customer/user-customer-repository-impl";

export const userCustomerProvider: ClassProvider = {
  provide: UserCustomerRepository,
  useClass: UserCustomerRepositoryImpl,
};
