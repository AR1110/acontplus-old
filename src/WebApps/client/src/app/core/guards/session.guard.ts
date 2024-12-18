import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const _tokenUseCase = inject(TokenUseCase);
  console.log(_tokenUseCase.isTokenExpired())
  if (_tokenUseCase.isTokenExpired()) {
    console.log('no auth');
    router.navigate(['/', 'auth'])
  }
  return true;
};
