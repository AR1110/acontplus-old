import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtTokenService } from 'acontplus-utils';

export const sessionGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const jwtService = inject(JwtTokenService);
  if (!jwtService.isAuthenticated()) {
    authSvc.logout();
  }
  return true;
};
