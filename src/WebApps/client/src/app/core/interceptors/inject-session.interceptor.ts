import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { environment } from 'src/environments/environment';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}
export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  let _tokenUseCase = inject(TokenUseCase)

  const authToken = _tokenUseCase.getToken();
  const parseJwt = _tokenUseCase.parseJwt();

  const baseUrl = parseJwt?.['urlGateway'];

  let isCustomUrl = req.context.get(CUSTOM_URL) || false;

  req = req.clone({
    url: isCustomUrl ? req.url : `${baseUrl}/gateway/${req.url}`,
    setHeaders: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return next(req);
};
