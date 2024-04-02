import { Component, inject, Input } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { Role } from '@modules/config/models/role.model';
import { UserCustomerService } from '@modules/config/services/user-customer/user-customer.service';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-user-customer-add-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-customer-add-edit-modal.component.html'
})
export class UserCustomerAddEditModalComponent {

  @Input() params = {
    idUsuario: 0,
    correo: '',
    nombreCompleto: null,
    nroIdentificacion: null,
    roleId: 0,
    estado: false
  }

  private userCustomerSvc = inject(UserCustomerService)
  protected modal = inject(NgbActiveModal);
  protected tS = inject(ToasterService);

  titleModal = 'Nuevo Usuario';
  textBtn = 'Guardar';

  dataForm!: FormGroup;

  roles: Role[] = [];

  constructor(private fb: FormBuilder) {



  }

  ngOnInit() {
    try {
      showLoader();
      this.userCustomerSvc.getDataForm().subscribe({
        next: (response: any) => {
          hideLoader();
          this.roles = response.roles;
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
      if (this.params.idUsuario > 0) {
        this.titleModal = 'Editar Usuario';
        this.textBtn = 'Actualizar';
        this.dataForm = this.fb.group(
          {
            correo: ['', [Validators.required, Validators.email]],
            nroIdentificacion: ['', [Validators.required, Validators.minLength(10)]],
            nombreCompleto: ['', Validators.required],
            estado: [false, Validators.required],
          },
        );

        this.dataForm.get('correo')?.setValue(this.params.correo)
        this.dataForm.get('nroIdentificacion')?.setValue(this.params.nroIdentificacion)
        this.dataForm.get('nombreCompleto')?.setValue(this.params.nombreCompleto)
        this.dataForm.get('estado')?.setValue(this.params.estado)


      }else{
        this.dataForm = this.fb.group(
          {
            correo: ['', [Validators.required, Validators.email]],
            nombreUsuario: ['', Validators.required],
            nroIdentificacion: ['', [Validators.required, Validators.minLength(10)]],
            nombreCompleto: ['', Validators.required],
            roleId: [0, Validators.required],
            contrasena: ['', Validators.required],
            confirmContrasena: ['', Validators.required],
          },
          {
            validators: this.passwordMatchValidator('contrasena', 'confirmContrasena'),
          }
        );
      }
    } catch (error) {
      hideLoader();
    }
  }

  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl): { [key: string]: any } | null => {
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
        message: 'Ingrese todos los campos correctamente!'
      })
      return
    }

    let data = {
      ...this.dataForm.value,
      roleCode: this.roles.find(i => i.id === this.dataForm.value.roleId)?.roleCode
    }

    if (this.params.idUsuario > 0) {
      showLoader();
      this.userCustomerSvc.put(this.params.idUsuario, data).subscribe({
        next: (response) => {
          hideLoader()
          if (isApiResponse(response)) {
            if (response.code === "0") {
              this.tS.toastr({
                type: 'warning',
                message: response.message
              })
            }
            if (response.code === "1") {
              this.tS.toastr({
                type: 'success',
                message: response.message
              })
              this.modal.close(response)
            }
          }

        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    }

    if (!(this.params.idUsuario > 0)) {
      showLoader();
      this.userCustomerSvc.post(data).subscribe({
        next: (response) => {
          hideLoader();
          if (isApiResponse(response)) {
            if (response.code === "0") {
              this.tS.toastr({
                type: 'warning',
                message: response.message
              })
            }
            if (response.code === "1") {
              this.tS.toastr({
                type: 'success',
                message: response.message
              })
              this.modal.close(response)
            }
          }

        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    }


  }
}
