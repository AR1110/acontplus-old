import {
  userCustomPermissionProvider
} from "@modules/seguridad/providers/user-custom-permission.provider";
import {actionProvider} from "@modules/seguridad/providers/action.provider";

export const securityProvider = [
  userCustomPermissionProvider,
  actionProvider
  ]
