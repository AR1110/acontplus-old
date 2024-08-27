import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import {environment} from "@/env/environment";


const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
export function isCustomUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}
export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  let authSvc = inject(AuthService)

  const baseUrl = environment.API_URL
  let url = `${baseUrl}/gateway/${req.url}`;

  if(!req.context.get(CUSTOM_URL)){
    const authToken = authSvc.getToken();
    const parseJwt = authSvc.parseJwt();

   // const baseUrl = parseJwt.urlGateway;

    req = req.clone({
      url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
  }else{

    req = req.clone({
      url,
    });
  }



  return next(req);
};
