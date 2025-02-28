import {environment} from "@/env/environment";
import {HttpContext, HttpContextToken, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenUseCase} from "@domain/use-cases/token.use-case";

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);

export function getCustomUrlContext() {
  return new HttpContext().set(CUSTOM_URL, true);
}

export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  let _tokenUseCase = inject(TokenUseCase)

  const baseUrl = environment.API_URL
  let url = `${baseUrl}/gateway/${req.url}`;

  let externalUrl = req.context.get(CUSTOM_URL);

  const authToken = _tokenUseCase.getToken();

  if (!externalUrl) {
    req = req.clone({
      url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
        'X-Client-Id': 'acontplus-restaurant',
      },
    });
  } else {

    req = req.clone({
      url: req.url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
        'X-Client-Id': 'acontplus-restaurant',
      },
    });
  }


  return next(req);
};
