import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@modules/auth/services';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authSvc = inject(AuthService);
  if (authSvc.isLoggedIn !== true) {
    console.log('no auth')
    //router.navigate(['/', 'auth'])
  }
  console.log('auth')
  return true;
};
