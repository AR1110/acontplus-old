import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {PermissionStore} from "@ui/store/permission.store";

export const permissionGuard: CanActivateFn = (route, state) => {
  const $permissionStore = inject(PermissionStore);
  const router: Router = inject(Router);
  // Verificar permisos si la ruta los requiere
  if (route.data['permissions']) {
    const { resource  } = route.data['permissions'];

    const hasPermission =  $permissionStore.submenus().find(p => p.url === resource);

    if (!hasPermission) {
      router.navigate(['/forbidden']);
      return false;
    }
  }

  return true;

}
