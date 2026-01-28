import {
  UserCustomPermissionRepositoryImpl
} from "@modules/seguridad/data/user-custom-permission/user-custom-permission-repository-impl";
import {UserCustomPermissionRepository} from "@modules/seguridad/domain/repositories/user-custom-permission.repository";

export const userCustomPermissionProvider = {
  provide: UserCustomPermissionRepository,
  useClass: UserCustomPermissionRepositoryImpl,
};
