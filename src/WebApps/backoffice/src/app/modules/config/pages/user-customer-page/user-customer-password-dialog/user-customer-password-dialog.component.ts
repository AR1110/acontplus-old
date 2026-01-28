import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { matchValidator } from '@core/utils/match-validator';
import { UserCustomer } from '@modules/config/models/user-customer.model';
import { UserCustomerService } from '@modules/config/services/user-customer.service';

import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-user-customer-password-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './user-customer-password-dialog.component.html',
  styles: ``,
})
export class UserCustomerPasswordDialogComponent {
  resetPasswordForm: FormGroup;
  data = {} as UserCustomer;

  constructor(
    private dialogRef: MatDialogRef<UserCustomerPasswordDialogComponent>,
    private formBuilder: FormBuilder,
    private userCustomer: UserCustomerService,
    private tS: ToastrNotificationService,
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: matchValidator('password', 'confirmPassword'),
      },
    );
  }

  save() {
    if (!this.resetPasswordForm?.valid) {
      return;
    }
    let password = this.resetPasswordForm.value;
    this.data.passwordReset = true;
    this.data.password = password.confirmPassword;
    this.userCustomer.passwordReset(this.data.id, this.data).subscribe({
      next: this.commonResponse,
      error() {},
    });
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '0') {
        this.tS.show({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.dialogRef.close(response);
      }
    }
  };

  dialogClose() {
    this.dialogRef.close();
  }
}
