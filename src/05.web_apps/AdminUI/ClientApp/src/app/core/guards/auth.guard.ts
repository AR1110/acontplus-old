import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTTokenService } from '../services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private jwtTokenSvc: JWTTokenService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      

        const jwtToken = this.jwtTokenSvc.getJWTToken();

        if(!jwtToken){

            this.router.navigate(['/', 'auth'])

            return false;
        }

        if(!this.jwtTokenSvc.isLoggedIn()){

            //sesion expirada
        }

        return true;
    }
}
