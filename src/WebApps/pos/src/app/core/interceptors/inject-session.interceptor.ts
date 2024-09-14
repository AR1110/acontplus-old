import {environment} from "@/env/environment";
import {AuthService} from '@/services/auth.service';
import {HttpContext, HttpContextToken, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);

export function getCustomUrlContext() {
  return new HttpContext().set(CUSTOM_URL, true);
}

export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  let authSvc = inject(AuthService)

  const baseUrl = environment.API_URL
  let url = `${baseUrl}/gateway/${req.url}`;

  let externalUrl = req.context.get(CUSTOM_URL);

  const authToken = authSvc.getToken();

  if (!externalUrl) {
    req = req.clone({
      url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
  } else {

    req = req.clone({
      url: req.url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
  }


  return next(req);
};
