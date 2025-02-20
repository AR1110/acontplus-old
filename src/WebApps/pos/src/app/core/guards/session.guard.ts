import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenUseCase } from '@domain/use-cases/token.use-case';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const _tokenUseCase = inject(TokenUseCase);
  console.log(_tokenUseCase.isTokenExpired());
  if (_tokenUseCase.isTokenExpired()) {
    router.navigate(['/', 'auth']).then();
  }
  return true;
};
