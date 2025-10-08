import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}
export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  const _tokenUseCase = inject(TokenUseCase);

  const authToken = _tokenUseCase.getToken();
  const parseJwt = _tokenUseCase.parseJwt();

  const baseUrl = environment.API_URL;

  const isCustomUrl = req.context.get(CUSTOM_URL) || false;

  req = req.clone({
    url: isCustomUrl ? req.url : `${baseUrl}/${req.url}`,
    setHeaders: {
      Authorization: 'Bearer ' + authToken,
      'Client-Id': environment.clientId,
    },
  });

  return next(req);
};
