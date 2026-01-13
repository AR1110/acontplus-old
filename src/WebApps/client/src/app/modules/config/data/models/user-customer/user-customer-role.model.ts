export interface UserCustomerRole {
  userRoleId?: number;
  idUsuarioRol: number;
  idUsuario: number;
  idEntidad: number;
  username: string;
  nroIdentificacion: string;
  rucEmpresa: string;
  razonSocialEmpresa: string;
  estado: boolean;
  roleName: string;
  nombreCompleto?: string;
}

export interface UserCustomerRoleResponse {
  data: UserCustomerRole[];
}

export interface UserCustomerRoleAccessResponse {
  menus: any;
  actions: any;
}
