import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})


export class JWTTokenService {

    private readonly NAME_TOKEN = 'access_token';

    private decodedToken!: { [key: string]: string };


    constructor(private cookieSvc: CookieService) { }



    saveSession(jwtToken:any){
        this.cookieSvc.set(this.NAME_TOKEN, jwtToken, 4, '/')
    }

    getJWTToken(){
        return this.cookieSvc.get(this.NAME_TOKEN)
    }

    getDecodeToken(): {[key: string]: string}  | null {

        if(this.cookieSvc.check(this.NAME_TOKEN)){
            this.decodedToken = jwt_decode(this.getJWTToken())
        }

        return this.decodedToken;
    }



    isLoggedIn(): boolean {

        let token = this.getDecodeToken();
        console.log(token)
        if(!token){
            return false;
        }

        const tokenExpired = this.isTokenExpired();
        console.log(tokenExpired)
        return !tokenExpired;

    }


    //Verificamos si el token es expirado
    private isTokenExpired() {

        const jwtToken = this.getDecodeToken();

        const expiry = Number(jwtToken?.exp);

        return Date.now() > (expiry * 1000 )
    }


}
