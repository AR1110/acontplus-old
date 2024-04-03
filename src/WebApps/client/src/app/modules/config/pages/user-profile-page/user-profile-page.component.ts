import { Component, inject } from '@angular/core';
import { PurchaseModule } from "../../../purchase/purchase.module";
import { UserProfileService } from '@modules/config/services/user-profile.service';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { S } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-user-profile-page',
    standalone: true,
    templateUrl: './user-profile-page.component.html',
    styles: ``,
    imports: [
        PurchaseModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
    ]
})
export class UserProfilePageComponent {
    private readonly userProfileService = inject(UserProfileService);
    private tS = inject(ToasterService);

    user: any = {};
    roles: any = [];
    isVerified = false;
    isShowPassword = false;

    passwordForm = new FormGroup({
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
    });

    ngOnInit() {
        this.getAll()
    }

    getAll() {
        showLoader();
        this.userProfileService.getAll({ tipo: 1 }).subscribe({
            next: (response: any) => {
                hideLoader();
                const { user, roles } = JSON.parse(response.payload);
                this.user = user[0];
                this.roles = roles;
            },
            error(err) {
                console.log(err)
            },
            complete() {
                hideLoader();
            },
        })
    }

    // functions for verifying password
    verifyPassword() {
        const { password, confirmPassword } = this.passwordForm.value;

        if (!password || !confirmPassword) {
            this.tS.toastr({ type: 'info', message: 'Por favor, llene todos los campos' });
            return;
        }

        // verify length is greater than 6
        if (password.length < 6 || confirmPassword.length < 6) {
            this.tS.toastr({ type: 'warning', message: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        // Las contraseñas no coinciden
        if (password !== confirmPassword) {
            this.tS.toastr({ type: 'warning', message: 'Las contraseñas no coinciden' });
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
            text: "Actualizará la contraseña de tu cuenta y te desconectará de la sesión actual. ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, actualizar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                showLoader();

                // clean spaces

                let password = {
                    contrasenia: this.passwordForm.value.password?.trim(),
                    confirmarContrasenia: this.passwordForm.value.confirmPassword?.trim(),
                }

                this.userProfileService.put(this.user.idUsuario, { perfil: password }).subscribe({
                    next: (response: any) => {
                        hideLoader();

                        if (response.code === "0") {
                            this.tS.toastr({ type: 'error', message: response.message });
                            return;
                        }

                        this.tS.toastr({ type: 'success', message: response.message });
                        this.resetPasswordForm();
                    },
                    error(err) {
                        console.log(err)
                    },
                    complete() {
                        hideLoader();
                    },
                })
            }
        })
    }

    resetPasswordForm() {
        this.passwordForm.reset();
        this.isVerified = false;
    };
}