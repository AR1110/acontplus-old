import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatLabel,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    MatCardFooter,
    MatTooltip,
    MatAnchor,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  signinForm: FormGroup; //login
  signupForm: FormGroup; //registrarse

  constructor(
    public fb: FormBuilder,
    public authSvc: AuthService,
    public router: Router,
  ) {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  signIn() {
    this.authSvc.signIn(this.signinForm.value);
  }

  registerUser() {
    this.authSvc.signUp(this.signupForm.value).subscribe((res) => {
      if (res.result) {
        this.signupForm.reset();
        this.router.navigate(['log-in']);
      }
    });
  }
}
