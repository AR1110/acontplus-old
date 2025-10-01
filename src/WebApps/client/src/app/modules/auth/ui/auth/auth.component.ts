import {Component, inject, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthUseCase} from "@modules/auth/domain/use-cases/auth.use-case";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import {DialogService} from "@core/services/dialog.service";
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

import { UAParser } from 'ua-parser-js';
import {RoleSelectionModalComponent} from "@modules/auth/ui/auth/role-selection-modal/role-selection-modal.component";
@Component({
  selector: 'app-auth',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styles: `

.button-login {
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  background-color: #d61672;
  border: 2px solid #d61672;
  border-radius: 50px;
  outline: none;
  transition: 0.4s;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 15px;
  cursor: pointer;
  font-family: "Figtree", sans-serif;
}

.button-login:hover {
  background-color: #d61672;
  border: 2px solid #d61672;
}

  `
})
export class AuthComponent {
  private _authUseCase= inject(AuthUseCase)
  private _tokenUseCase = inject(TokenUseCase)
  private router = inject(Router)
  private tS = inject(ToastrNotificationService)
  private dialogSvc = inject(DialogService);

  hide = signal(true);

  private parser = new UAParser(navigator.userAgent)
  private parserResults = this.parser.getResult();

   customerIp = "";
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnInit(){
    console.log(this.parser)
    console.log(this.parserResults);
    this.getPublicIP()
    this.openRoleSeleccionModal({})
  }

  private getPublicIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response=>response.json())
      .then( response=>{
       this.customerIp = response.ip;
      })
  };

  private openRoleSeleccionModal(userRoles: any) {
    let modalRef = this.dialogSvc.open(RoleSelectionModalComponent, {
      size: 'lg',
      data: {
        roles: userRoles
      }
    })

    // modalRef.subscribe(result => {
    //     if (result && typeof result === 'object') {
    //       this.setDataLogin(result.dataLogin, result.dataEstab)
    //     }
    //   }
    // )
  }


  private setDataLogin(dataLogin: any, dataEstab: any) {
    // this.authSvc.setToken(dataLogin.token);
    // this.authSvc.setUserData(dataLogin);
    // this.authSvc.setDataEstab(dataEstab);
    // this.router.navigateByUrl('/dashboard')
  }

  login() {
    const {username, password} = this.form.value;
    if(!username){
      this.tS.show({
        type: 'warning',
        message: 'Ingrese su usuario'
      })
      return;
    }

    if(!password){
      this.tS.show({
        type: 'warning',
        message: 'Ingrese su contraseña'
      })
      return
    }


    const userAgent = JSON.stringify({
      userAgent: JSON.stringify(this.parserResults),
      ipAddress: this.customerIp
    });

    this._authUseCase.login({
      username: username!,
      password: password!,
      userAgent
    }).subscribe(response => {
      if (!response.success) {
        this.tS.show({
          type: 'warning',
          message: response.message
        })
        return
      }

      const userRoles = response.userRoles;
      console.log(userRoles)
      if (userRoles.length > 0) {
        this.openRoleSeleccionModal(userRoles)

        return
      }
        const dataLogin = userRoles[0];

      if(dataLogin.needAuthorization){


      }


        console.log(dataLogin)
     //   let dataEstab = establecimientos.find((e: any) => e.predeterminado);
     //   this.setDataLogin(dataLogin, dataEstab)
   //  this.router.navigateByUrl('/')



    })
  }
}
