import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@modules/auth/services';

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();
    const parseJwt = this.authService.parseJwt();
    console.log(authToken)
    const baseUrl = parseJwt.urlGateway;
    console.log(baseUrl)
    console.log(request.url)
    request = request.clone({
      url: `${baseUrl}/gateway/${request.url}`, 
      setHeaders: {
        Authorization: "Bearer " + authToken
      }
    });
    return next.handle(request);
  }
}
