import {Component, inject, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "@/services/auth.service";
import {Router} from "@angular/router";
import {ToasterService} from "@/services/toaster.service";
import {DialogService} from '@/services/dialog.service';
import {MultipleEstabsComponent} from "@/pages/auth-page/components/multiple-estabs/multiple-estabs.component";

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  authSvc = inject(AuthService)
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
    let modalRef = this.dialogSvc.open(MultipleEstabsComponent, {
      size: 'lg',
      data: {
        multipleEstabs: dataEstab
      }
    })

    modalRef.subscribe(result => {
        if (result && typeof result === 'object') {
          this.setDataLogin(result.dataLogin, result.dataEstab)
        }
      }
    )
  }


  private setDataLogin(dataLogin: any, dataEstab: any) {
    this.authSvc.setToken(dataLogin.token);
    this.authSvc.setUserData(dataLogin);
    this.authSvc.setDataEstab(dataEstab);
    this.router.navigateByUrl('/dashboard')
  }

  login() {
    if (this.form.invalid) return


    this.authSvc.login(this.form.value.username!, this.form.value.password!).subscribe(response => {
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
