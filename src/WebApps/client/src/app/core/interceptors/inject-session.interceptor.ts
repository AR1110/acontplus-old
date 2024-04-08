import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();
    const parseJwt = this.authService.parseJwt();

    const baseUrl = parseJwt.urlGateway;

    // Define una expresión regular para verificar la presencia de 'rdlcProps', 'dataSources' y 'rdlcParams'
    //const regex = /(?:rdlcProps|dataSources|rdlcParams)/;

    // Usa el método test para verificar si alguna de las subcadenas está presente
    //const isUrlPrinter = regex.test(request.url);
    let isCustomUrl = false;
    if (request.context.get(CUSTOM_URL)) {
      isCustomUrl = true;
    }
    // console.log(baseUrl)
    // console.log(request.url)
    const url = isCustomUrl ? request.url : `${baseUrl}/gateway/${request.url}`;
    request = request.clone({
      url,
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return next.handle(request);
  }
}
