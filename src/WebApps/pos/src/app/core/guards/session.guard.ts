import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenUseCase } from '@domain/use-cases/token.use-case';
import {PermissionStore} from "@ui/store/permission.store";

export const sessionGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const _tokenUseCase = inject(TokenUseCase);
  const $permissionStore = inject(PermissionStore);

  if (_tokenUseCase.isTokenExpired()) {
    router.navigate(['/', 'auth']).then();
  }


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
};
