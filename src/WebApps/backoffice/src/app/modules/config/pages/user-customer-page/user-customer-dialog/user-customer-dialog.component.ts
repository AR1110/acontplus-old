import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';

import { UserCustomer } from '@modules/config/models/user-customer.model';
import { UserCustomerService } from '@modules/config/services/user-customer.service';

import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

export const validateRePassword: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const passwordKey = control.get('password');
  const passwordConfirmationKey = control.get('confirmPassword');
  return (group: FormGroup) => {
    let passwordInput = passwordKey?.value,
      passwordConfirmationInput = passwordConfirmationKey?.value;
    if (passwordInput.value !== passwordConfirmationInput.value) {
      return passwordConfirmationInput.setErrors({ notEquivalent: true });
    } else {
      return passwordConfirmationInput.setErrors(null);
    }
  };
};

@Component({
  selector: 'app-user-customer-dialog',
  imports: [
    ReactiveFormsModule,
    FormsModule,

    MatDialogContent,
    MatFormField,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    MatIconButton,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
  ],
  templateUrl: './user-customer-dialog.component.html',
  styles: `
    mat-form-field {
      width: 100%;
    }

    .flex-password-container {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
  `,
})
export class UserCustomerDialogComponent {
  private dialogRef = inject(MatDialogRef<UserCustomerDialogComponent>);
  data = inject<UserCustomer>(MAT_DIALOG_DATA);
  private tS = inject(ToastrNotificationService);
  private userCustomerSvc = inject(UserCustomerService);
  hide: boolean = true;
  titleDialog = 'Nuevo Usuario';
  titleBtn = 'Guardar';
  userForm!: FormGroup;
  dialogIcon = 'add';

  ngOnInit(): void {
    if (!this.data) {
      this.userForm = new FormGroup(
        {
          id: new FormControl(0, []),
          idCard: new FormControl('', Validators.required),
          firstName: new FormControl('', Validators.required),
          email: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
          username: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
          confirmPassword: new FormControl('', [Validators.required]),
          estado: new FormControl(false),
        },
        {
          validators: validateRePassword,
        },
      );
    }

    if (this.data && this.data.id > 0) {
      this.dialogIcon = 'edit';
      this.userForm = new FormGroup({
        id: new FormControl(0, []),
        username: new FormControl('', Validators.required),
        idCard: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        isActive: new FormControl(false),
      });
      this.titleDialog = 'Editar Usuario';
      this.titleBtn = 'Actualizar';
      this.userForm.patchValue(this.data);
    }
  }

  save() {
    let { idCard } = this.userForm.value;

    if (!idCard) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese número de identificación correcta!',
      });
      return;
    }

    const data = {
      ...this.userForm.value,
      idCard: this.userForm.value.idCard.toString(),
    };

    if (data.id > 0) {
      this.userCustomerSvc.put(data.id, data).subscribe({
        next: this.commonResponse,
        error() {},
      });
    }

    if (!(data.id > 0)) {
      this.userCustomerSvc.post(data).subscribe({
        next: this.commonResponse,
        error() {},
      });
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this.dialogRef.close(response);
      }
    }
  };

  close() {
    this.dialogRef.close();
  }
}
