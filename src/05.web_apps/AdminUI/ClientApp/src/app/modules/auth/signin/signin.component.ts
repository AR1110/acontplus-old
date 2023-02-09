import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@app/services/seguridad/auth.service';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  loginForm!: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['admin@acontplus.com', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['admin', Validators.required]
    });
  }


  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      this.toast.warning('Usuario y Contraseña no válida !');
      return;

    } else {
      this.subs.sink = this.authService.login(this.f["email"].value, this.f["password"].value).subscribe(response => {
            if (response) {
              const token = this.authService.currentUserValue.token;
              if (token) {
                console.log(this.router)
                this.router.navigate(['admin']);
              }
            } else {
              this.toast.warning('Error')
            }
          },
          (error) => {
            this.toast.warning(error.error.message)
          }
        );
    }
  }
}
