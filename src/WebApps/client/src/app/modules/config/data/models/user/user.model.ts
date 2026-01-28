import { Role } from '@modules/config/data/models/role.model';

export interface User {
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

export interface UserRead extends User {
  totalRecords: number;
}

export interface UserList {
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

export interface UserListResponse {
  data: UserList[];
  totalRecords: number;
}

export interface UserDataForm {
  roles: Role[];
}
