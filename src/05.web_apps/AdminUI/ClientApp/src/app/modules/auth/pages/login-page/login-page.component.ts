import { Component } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { JWTTokenService } from '../../services';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {

    isLoggedIn = false;
    formLogin: FormGroup = new FormGroup({})

    constructor(
        private authSvc: AuthService,
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
            Username: new FormControl('', [
                Validators.required
            ]),
            Password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(12)
            ])
        })
    }


    login(){

        let {Username, Password} = this.formLogin.value;

        this.authSvc.login(Username, Password).subscribe(response=>{

            let {jwtToken }= response;

            if(!jwtToken){
                console.log(response)
                return
            }

            this.jwtTokenSvc.saveSession(jwtToken)

            this.router.navigate(['/', 'home'])

        }, error=>{

            console.log(error)

        })
    }

}
