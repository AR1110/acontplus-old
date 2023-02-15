import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JWTTokenService } from '@app/modules';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private jwtTokenSvc: JWTTokenService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log(state.url)

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
