import {Component, inject, signal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { Role } from '@modules/config/domain/models/role.model';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {CreateUserCustomerUseCase} from "@modules/config/application/use-cases/user-customer/create-user-customer.use-case";
import {UpdateUserCustomerUseCase} from "@modules/config/application/use-cases/user-customer/update-user-customer.use-case";
import {
  GetUserCustomerFormDataUseCase
} from "@modules/config/application/use-cases/user-customer/get-user-customer-form-data.use-case.";
import {MatRadioModule} from "@angular/material/radio";

@Component({
    selector: 'app-user-customer-add-edit-modal',
  imports: [FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,

    MatCustomDialogComponent, ThemeButtonComponent
  ],
    templateUrl: './user-customer-add-edit-modal.component.html'
})
export class UserCustomerAddEditModalComponent {

  private $createUserCustomerUseCase = inject(CreateUserCustomerUseCase)
  private $updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase)
  private $getUserCustomerDataFormUseCase = inject(GetUserCustomerFormDataUseCase)
  private dialogRef = inject(MatDialogRef<UserCustomerAddEditModalComponent>)
  titleModal = 'Nuevo Usuario';
  dataForm!: FormGroup;
  roles= signal<Role[]>([]);
  protected tS = inject(ToasterService);
  private fb = inject(FormBuilder);
  readonly params = inject<{
    idUsuario: 0,
    email: '',
    username: '',
    firstName: null,
    lastName: null,
    nroIdentificacion: null,
    roleId: 0,
    estado: false,
  }>(MAT_DIALOG_DATA);



  isUpdate(){
    return this.params.idUsuario>0
  }
  isAdd(){
    return !(this.params.idUsuario>0)
  }


  ngOnInit() {
    this.$getUserCustomerDataFormUseCase.execute().subscribe(  (response: any) => {
        this.roles.set(response.roles)
      } );

    if (this.params.idUsuario > 0) {
      this.titleModal = 'Editar Usuario';
      this.dataForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        nroIdentificacion: [
          '',
          [Validators.required, Validators.minLength(10)],
        ],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        estado: [false, Validators.required],
      });

      this.dataForm.get('email')?.setValue(this.params.email);
      this.dataForm.get('username')?.setValue(this.params.username);
      this.dataForm
        .get('nroIdentificacion')
        ?.setValue(this.params.nroIdentificacion);
      this.dataForm.get('firstName')?.setValue(this.params.firstName);
      this.dataForm.get('lastName')?.setValue(this.params.lastName);
      this.dataForm.get('estado')?.setValue(this.params.estado);
    } else {
      this.dataForm = this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          username: ['', Validators.required],
          nroIdentificacion: [''],
          firstName: [''],
          lastName: [''],
          roleId: [0, Validators.required],
          contrasena: ['', Validators.required],
          confirmContrasena: ['', Validators.required],
        },
        {
          validators: this.passwordMatchValidator(
            'contrasena',
            'confirmContrasena',
          ),
        },
      );
    }
  }

  passwordMatchValidator(
    controlName: string,
    matchingControlName: string,
  ): ValidatorFn {
    return (
      abstractControl: AbstractControl,
    ): { [key: string]: any } | null => {
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
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese todos los campos correctamente!',
      });
      return;
    }

    const data = {
      ...this.dataForm.value,
      roleCode: this.roles().find((i) => i.id === this.dataForm.value.roleId)
        ?.roleCode,
    };

    if (this.isUpdate()) {
      this.$updateUserCustomerUseCase.execute({
        id: this.params.idUsuario,
        data
      }).subscribe((response) => {
            this.tS.toastr({
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
          this.tS.toastr({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.dialogRef.close(response);
          }
      });
    }
  }

  close(){
    this.dialogRef.close()
  }
}
