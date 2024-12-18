import {Component, inject, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthUseCase} from "@modules/auth/core/use-cases/auth.use-case";
import {ToasterService} from "@core/services/toaster.service";
import {DialogService} from "@core/services/dialog.service";
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
  private router = inject(Router)
  private tS = inject(ToasterService)
  private dialogSvc = inject(DialogService)

  hide = signal(true);

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  private openMultipleEstabs(dataEstab: any) {
    // let modalRef = this.dialogSvc.open(MultipleEstabsComponent, {
    //   size: 'lg',
    //   data: {
    //     multipleEstabs: dataEstab
    //   }
    // })
    //
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
    if (this.form.invalid) return


    this._authUseCase.login({
      username: this.form.value.username!,
      password: this.form.value.password!
    }).subscribe(response => {
      if (response.code === "0") {
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
        return
      }

      let dataPayload = JSON.parse(response.payload as string)
      const establecimientos = dataPayload.flatMap((userRole: any) => userRole.establecimientos)

      if (establecimientos.length > 1) {
        this.openMultipleEstabs(dataPayload)

      } else {

        const dataLogin = dataPayload[0];
        let dataEstab = establecimientos.find((e: any) => e.predeterminado);
        this.setDataLogin(dataLogin, dataEstab)

      }

    })
  }
}
