import { Role } from '@modules/config/data/models/role.model';

export interface UserCustomer {
  id: number;
  idCard: string;
  username: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface UserCustomerRead extends UserCustomer {
  totalRecords: number;
}

export interface UserCustomerList {
  idUsuario: number;
  nroIdentificacion: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  nombreCompleto: string;
  totalRecords: number;
  roleId: number;
  nomEstado: string;
  estado: boolean;
}

export interface UserCustomerResponse {
  data: UserCustomerList[];
  totalRecords: number;
}

export interface UserCustomerDataForm {
  roles: Role[];
}
