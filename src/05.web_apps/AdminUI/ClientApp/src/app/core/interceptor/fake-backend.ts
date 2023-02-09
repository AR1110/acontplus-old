import { Injectable } from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { mergeMap} from 'rxjs/operators';
import { User } from '@app/models/seguridad/user';

const users: User[] = [
  {
    id: 1,
    username: 'admin@acontplus.com',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
    token: 'admin-token'
  }
];

@Injectable()


export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const { url, method, headers, body } = request;

    // Simular la llamada a la API del servidor
    return of(null).pipe(mergeMap(handleRoute));

    function handleRoute() {
      switch (true) {
        case url.endsWith('/authenticate') && method === 'POST':
          return authenticate();
        default:
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Usuario y contraseña incorrecta');
      }

      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token
      });
    }

    function ok(body:any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message:any) {
      return throwError({ error: { message } });
    }
  }
}

export let fakeBackendProvider = {
  // use un backend falso en lugar del servicio Http para el desarrollo sin backend
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
