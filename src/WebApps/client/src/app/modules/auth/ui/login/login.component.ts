import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { UAParser } from 'ua-parser-js';
import { MatIcon } from '@angular/material/icon';
import { RoleSelectionModalComponent } from '@modules/auth/ui/auth/role-selection-modal/role-selection-modal.component';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private _authUseCase = inject(AuthUseCase);
  private _tokenUseCase = inject(TokenUseCase);
  private tS = inject(ToastrNotificationService);
  private dialogSvc = inject(DialogService);

  hide = signal(true);

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  private parser = new UAParser(navigator.userAgent);
  private parserResults = this.parser.getResult();

  customerIp = '';
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  ngOnInit() {
    this.getPublicIP();
  }

  private getPublicIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(response => {
        this.customerIp = response.ip;
      });
  }

  private openRoleSeleccionModal(userRoles: any) {
    const modalRef = this.dialogSvc.open(RoleSelectionModalComponent, {
      size: 'lg',
      data: {
        roles: userRoles,
      },
    });

    // modalRef.subscribe(result => {
    //     if (result && typeof result === 'object') {
    //       this.setDataLogin(result.dataLogin, result.dataEstab)
    //     }
    //   }
    // )
  }

  login() {
    this.isSubmitting = true;

    const { username, password } = this.loginForm.value;
    if (!username) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese su usuario',
      });
      return;
    }

    if (!password) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese su contraseña',
      });
      return;
    }

    const userAgent = JSON.stringify({
      userAgent: JSON.stringify(this.parserResults),
      ipAddress: this.customerIp,
    });

    this._authUseCase
      .login({
        username: username,
        password: password,
        userAgent,
      })
      .subscribe(response => {
        if (!response.success) {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }

        const userRoles = response.userRoles;
        console.log(userRoles);
        if (userRoles.length > 1) {
          this.openRoleSeleccionModal(userRoles);

          return;
        }
        const dataLogin = userRoles[0];

        if (dataLogin.needAuthorization) {
          return;
        }

        this._tokenUseCase.saveSession(dataLogin);
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.router.navigateByUrl('/').then();
      });
  }
}
