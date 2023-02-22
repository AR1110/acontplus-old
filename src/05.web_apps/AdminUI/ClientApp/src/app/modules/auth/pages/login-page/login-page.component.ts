import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { JWTTokenService } from '@app/core/services/jwt-token.service';
import { AuthApiService } from '../../data/services/auth-api.service';
import { AuthModel } from '../../domain/models/auth.model';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {

    isLoggedIn = false;
    formLogin: FormGroup = new FormGroup({})

    constructor(
      private authApiSvc: AuthApiService,
      private jwtTokenSvc: JWTTokenService,
      private router: Router
    ){}


    ngOnInit(): void {

        let isLoggedIn = this.jwtTokenSvc.isLoggedIn();
        console.log(isLoggedIn)
        if(isLoggedIn){


            this.isLoggedIn = true;

            this.router.navigate(['/', 'home'])

        }


        this.formLogin = new FormGroup(
        {
            username: new FormControl('', [
                Validators.required
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(12)
            ])
        })
    }


    login(){
      this.authApiSvc.login( this.formLogin.value as AuthModel).subscribe(response=>{
           if(!response.access_token){
                console.log(response)
                return
            }

            this.jwtTokenSvc.saveSession(response.access_token)

            this.router.navigate(['/', 'home'])

        }, error=>{

            console.log(error)

        })
    }

}
