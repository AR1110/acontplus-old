import { ClassProvider } from '@angular/core';
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";
import {UserCustomerRepositoryImpl} from "@modules/config/data/user-customer/user-customer-repository-impl";
import {UserCustomerRoleRepository} from "@modules/config/domain/repositories/user-customer-role.repository";
import {
  UserCustomerRoleRepositoryImpl
} from "@modules/config/data/user-customer-role/user-customer-role-repository-impl";
import {AsignacionEstabRepository} from "@modules/config/domain/repositories/asignacion-estab.repository";
import {AsignacionEstabRepositoryImpl} from "@modules/config/data/asignacion-estab/asignacion-estab-repository-impl";

export const userCustomerProvider: ClassProvider = {
  provide: UserCustomerRepository,
  useClass: UserCustomerRepositoryImpl,
};


export const userCustomerRoleProvider = {
  provide: UserCustomerRoleRepository,
  useClass: UserCustomerRoleRepositoryImpl
}

export const asignacionEstablecimientoProvider = {
  provide: AsignacionEstabRepository,
  useClass: AsignacionEstabRepositoryImpl
}
