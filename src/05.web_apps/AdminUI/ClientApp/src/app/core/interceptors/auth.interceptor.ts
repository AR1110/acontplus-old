
import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JWTTokenService } from '@app/modules';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private jwtTokenSvc: JWTTokenService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        try {

            const isLoggedIn = this.jwtTokenSvc.isLoggedIn();

            if(isLoggedIn){

                let token = this.jwtTokenSvc.getJWTToken();
                console.log(token)
                if(token){

                  request = request.clone({
                            setHeaders: {
                              Authorization: `Bearer ${token}`,
                            }
                        })

                }
            }


            return next.handle(request);

        } catch (e) {
            console.log("Error", e)
            return next.handle(request);
        }
    }
}
