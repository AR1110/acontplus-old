import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}
export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {
  let authSvc = inject(AuthService)

  const authToken = authSvc.getToken();
  const parseJwt = authSvc.parseJwt();

  const baseUrl = parseJwt.urlGateway;

  // Define una expresión regular para verificar la presencia de 'rdlcProps', 'dataSources' y 'rdlcParams'
  //const regex = /(?:rdlcProps|dataSources|rdlcParams)/;

  // Usa el método test para verificar si alguna de las subcadenas está presente
  //const isUrlPrinter = regex.test(request.url);
  let isCustomUrl = false;
  if (req.context.get(CUSTOM_URL)) {
    isCustomUrl = true;
  }
  // console.log(baseUrl)
  // console.log(request.url)
  const url = isCustomUrl ? req.url : `${baseUrl}/gateway/${req.url}`;
  req = req.clone({
    url,
    setHeaders: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return next(req);
};
