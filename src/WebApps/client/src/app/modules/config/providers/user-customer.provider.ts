import { ClassProvider } from '@angular/core';
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";
import {UserCustomerRepositoryImpl} from "@modules/config/data/user-customer/user-customer-repository-impl";
import {UserCustomerRoleRepository} from "@modules/config/domain/repositories/user-customer-role.repository";
import {
  UserCustomerRoleRepositoryImpl
} from "@modules/config/data/user-customer-role/user-customer-role-repository-impl";
import {AsignacionEstabRepository} from "@modules/config/domain/repositories/asignacion-estab.repository";
import {AsignacionEstabRepositoryImpl} from "@modules/config/data/asignacion-estab/asignacion-estab-repository-impl";
import {
  AsignacionPuntoEmisionRepository
} from "@modules/config/domain/repositories/asignacion-punto-emision.repository";
import {
  AsignacionPuntoEmisionRepositoryImpl
} from "@modules/config/data/asignacion-punto-emision/asignacion-punto-emision-repository-impl";
import {AsignacionBodegaRepository} from "@modules/config/domain/repositories/asignacion-bodega.repository";
import {AsignacionBodegaRepositoryImpl} from "@modules/config/data/asignacion-bodega/asignacion-bodega-repository-impl";

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

export const asignacionPuntoEmisionProvider = {
  provide: AsignacionPuntoEmisionRepository,
  useClass: AsignacionPuntoEmisionRepositoryImpl
}

export const asignacionBodegaProvider = {
  provide: AsignacionBodegaRepository,
  useClass: AsignacionBodegaRepositoryImpl
}
