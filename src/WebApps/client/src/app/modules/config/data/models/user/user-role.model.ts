export interface UserRole {
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

export interface UserRoleResponse {
  data: UserRole[];
}

export interface UserRoleAccessResponse {
  menus: any;
  actions: any;
}
