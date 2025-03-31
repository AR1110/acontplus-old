import {Role} from "@modules/config/domain/models/role.model";

export interface UserCustomer {
  idUsuario: number;
  nroIdentificacion: string;
  username: string;
  email: string;
  nombreCompleto: string;
  firstName: string;
  lastName: string;
}

export interface UserCustomerRead extends UserCustomer {
  totalRecords: number;
}

export interface UserCustomerList {
  idUsuario: number
  nroIdentificacion:string
  username: string
  email:string
  firstName: string
  lastName: string
  nombreCompleto: string
  totalRecords: number
  roleId: number
  nomEstado: string
  estado: boolean
}

export interface UserCustomerResponse {
  data: UserCustomerList[];
  totalRecords: number;
}

export interface UserCustomerParamsUpdate {
  data: any,
  id: number
}

export interface UserCustomerDataForm {
  roles: Role[]
}
