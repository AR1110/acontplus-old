export interface UserPermissionParams {
  tipo: number;
  idUsuarioRol: number;
}

export interface UserPermissionSaveEntity {
  id: number;
  userRoleId: number;
  permissionsData: string;
}
