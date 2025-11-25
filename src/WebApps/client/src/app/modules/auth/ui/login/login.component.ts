import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DynamicCard } from '@acontplus/ng-components';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DialogService } from '@core/services/dialog.service';
import { RoleSelectionComponent } from '@modules/auth/ui/login/role-selection/role-selection.component';
import { AuthService } from '@modules/auth/domain/auth.service';
import { AccessAuthorizationComponent } from '@modules/auth/ui/login/access-authorization/access-authorization.component';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DynamicCard,
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
  private authSvc = inject(AuthService);

  hide = signal(true);

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

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
    this.authSvc.getPublicIP();
  }

  private openRoleSeleccionModal() {
    this.dialogSvc.open(RoleSelectionComponent, {
      size: 'lg',
    });
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
      userAgent: JSON.stringify(this.authSvc.parserResults),
      ipAddress: this.authSvc.customerIp(),
    });

    this._authUseCase
      .login({
        username: username,
        password: password,
        userAgent,
      })
      .subscribe((response) => {
        if (!response.success) {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }
        const userRoles = response.userRoles;
        const userRolesOriginal = response.userRolesOriginal;

        this.authSvc.setUserRole(userRoles, userRolesOriginal);

        if (userRoles.length > 1) {
          this.openRoleSeleccionModal();
          return;
        }
        const dataLogin = userRoles[0];

        if (dataLogin.needAuthorization) {
          const modalRef = this.dialogSvc.open(AccessAuthorizationComponent, {
            size: 'lg',
          });
          modalRef.subscribe((result) => {
            if (result && typeof result === 'object') {
              this.authSvc.createToken();
            }
          });
          return;
        }

        this._tokenUseCase.saveSession(dataLogin);
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.authSvc.goToDashboard();
      });
  }
}
