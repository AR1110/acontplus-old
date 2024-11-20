import { Component, inject, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { Role } from '@modules/config/models/role.model';
import { UserCustomerService } from '@modules/config/services/user-customer/user-customer.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
    selector: 'app-user-customer-add-edit-modal',
    imports: [FormsModule, ReactiveFormsModule, FaIconComponent],
    templateUrl: './user-customer-add-edit-modal.component.html'
})
export class UserCustomerAddEditModalComponent {
  @Input() params = {
    idUsuario: 0,
    email: '',
    username: '',
    firstName: null,
    lastName: null,
    nroIdentificacion: null,
    roleId: 0,
    estado: false,
  };
  titleModal = 'Nuevo Usuario';
  dataForm!: FormGroup;
  roles: Role[] = [];
  modalIcon: IconProp = 'plus';
  // user = {} as UserData;
  protected modal = inject(NgbActiveModal);
  protected tS = inject(ToasterService);
  private userCustomerSvc = inject(UserCustomerService);
  #authSvc = inject(AuthService);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userCustomerSvc.getDataForm().subscribe({
      next: (response: any) => {
        this.roles = response.roles;
      },
    });
    const decodedToken = this.#authSvc.getDecodedToken();
    // if (decodedToken) {
    //   this.user = decodedToken;
    // }
    if (this.params.idUsuario > 0) {
      this.modalIcon = 'edit';
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

    let data = {
      ...this.dataForm.value,
      roleCode: this.roles.find((i) => i.id === this.dataForm.value.roleId)
        ?.roleCode,
    };

    if (this.params.idUsuario > 0) {
      this.userCustomerSvc
        .put(this.params.idUsuario, data)
        .subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.modal.close(response);
            }
          }
        });
    }

    if (!(this.params.idUsuario > 0)) {
      this.userCustomerSvc.post(data).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.modal.close(response);
          }
        }
      });
    }
  }
}
