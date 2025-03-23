export interface UserCustomerPermissionParams {
  tipo: number;
  idUsuarioRol: number;
}

export interface UserCustomerPermissionSaveEntity {
  id: number
  userRoleId: number;
  permissionsData: string
}
