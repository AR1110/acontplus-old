import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GetUserCustomerFormDataUseCase } from '@modules/config/application/use-cases/user-customer/get-user-customer-form-data.use-case.';
import { UpdateUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/update-user-customer.use-case';
import { CreateUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/create-user-customer.use-case';
import { Button } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Role } from '@modules/config/data/models/role.model';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-customer-add-edit-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './user-customer-add-edit-modal.html',
})
export class UserCustomerAddEditModal implements OnInit {
  private readonly $createUserCustomerUseCase = inject(CreateUserCustomerUseCase);
  private readonly $updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase);
  private readonly $getUserCustomerDataFormUseCase = inject(GetUserCustomerFormDataUseCase);
  private readonly dialogRef = inject(MatDialogRef<UserCustomerAddEditModal>);
  titleModal = 'Nuevo Usuario';
  dataForm!: FormGroup;
  roles = signal<Role[]>([]);
  protected tS = inject(ToastrNotificationService);
  private readonly fb = inject(FormBuilder);
  readonly params = inject<{
    data: {
      idUsuario: number;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      idCard: string;
      roleId: number;
      isActive: boolean;
    };
  }>(MAT_DIALOG_DATA);

  private get getParamsData() {
    return this.params.data;
  }

  isUpdate() {
    return this.getParamsData.idUsuario > 0;
  }
  isAdd() {
    return !(this.getParamsData.idUsuario > 0);
  }

  ngOnInit() {
    this.$getUserCustomerDataFormUseCase.execute().subscribe((response: any) => {
      this.roles.set(response.roles);
    });

    if (this.getParamsData.idUsuario > 0) {
      this.titleModal = 'Editar Usuario';
      this.dataForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        idCard: ['', [Validators.required, Validators.minLength(10)]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        isActive: [false, Validators.required],
      });

      this.dataForm.get('email')?.setValue(this.getParamsData.email);
      this.dataForm.get('username')?.setValue(this.getParamsData.username);
      this.dataForm.get('idCard')?.setValue(this.getParamsData.idCard);
      this.dataForm.get('firstName')?.setValue(this.getParamsData.firstName);
      this.dataForm.get('lastName')?.setValue(this.getParamsData.lastName);
      this.dataForm.get('isActive')?.setValue(this.getParamsData.isActive);
    } else {
      this.dataForm = this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          username: ['', Validators.required],
          idCard: [''],
          firstName: [''],
          lastName: [''],
          roleId: [0, Validators.required],
          contrasena: ['', Validators.required],
          confirmContrasena: ['', Validators.required],
        },
        {
          validators: this.passwordMatchValidator('contrasena', 'confirmContrasena'),
        },
      );
    }
  }

  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl): Record<string, any> | null => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ matchValidator: true });
        return { matchValidator: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese todos los campos correctamente!',
      });
      return;
    }

    const data = {
      ...this.dataForm.value,
      idUsuario: this.getParamsData.idUsuario,
      roleCode: this.roles().find((i) => i.id === this.dataForm.value.roleId)?.roleCode,
    };

    if (this.isUpdate()) {
      this.$updateUserCustomerUseCase.execute(data).subscribe((response) => {
        this.tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this.dialogRef.close(response);
        }
      });
    }

    if (this.isAdd()) {
      this.$createUserCustomerUseCase.execute(data).subscribe((response) => {
        this.tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this.dialogRef.close(response);
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
