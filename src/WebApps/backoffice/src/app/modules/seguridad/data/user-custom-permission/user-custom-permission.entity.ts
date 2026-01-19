export interface UserCustomPermissionSaveEntity {
  id: number;
  menuId: number;
  actionId: number;
  securityType?: number | null;
}
