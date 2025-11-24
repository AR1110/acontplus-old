import { Component, inject, OnInit } from '@angular/core';
import { UserProfileService } from '@modules/config/services/user-profile.service';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styles: ``,
  imports: [
    MatTabsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    BreadcrumbComponent,
    DynamicCard,
    Button,
  ],
})
export class UserProfilePageComponent implements OnInit {
  private readonly userProfileService = inject(UserProfileService);
  private tS = inject(ToastrNotificationService);

  user: any = {};
  roles: any = [];
  isVerified = false;
  isShowPassword = false;

  passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.userProfileService.getAll({ tipo: 1 }).subscribe((response: any) => {
      const { user, roles } = JSON.parse(response.payload);
      this.user = user[0];
      this.roles = roles;
    });
  }

  // functions for verifying password
  verifyPassword() {
    const { password, confirmPassword } = this.passwordForm.value;

    if (!password || !confirmPassword) {
      this.tS.show({ type: 'info', message: 'Por favor, llene todos los campos' });
      return;
    }

    // verify length is greater than 6
    if (password.length < 6 || confirmPassword.length < 6) {
      this.tS.show({ type: 'warning', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Las contraseñas no coinciden
    if (password !== confirmPassword) {
      this.tS.show({ type: 'warning', message: 'Las contraseñas no coinciden' });
      return;
    }

    this.isVerified = true;
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  // Open swal modal
  confirmUpdate() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Actualizará la contraseña de tu cuenta y te desconectará de la sesión actual. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, actualizar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // clean spaces

        const password = {
          contrasenia: this.passwordForm.value.password?.trim(),
          confirmarContrasenia: this.passwordForm.value.confirmPassword?.trim(),
        };

        this.userProfileService
          .put(this.user.idUsuario, { perfil: password })
          .subscribe((response: any) => {
            if (response.code === '0') {
              this.tS.show({ type: 'error', message: response.message });
              return;
            }

            this.tS.show({ type: 'success', message: response.message });
            this.resetPasswordForm();
          });
      }
    });
  }

  resetPasswordForm() {
    this.passwordForm.reset();
    this.isVerified = false;
  }
}
