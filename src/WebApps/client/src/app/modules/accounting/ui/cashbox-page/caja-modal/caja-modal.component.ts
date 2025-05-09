import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@core/models/user.model';
import { ToasterService } from '@core/services/toaster.service';

import { Turno } from '@accounting/domain/models/turno.model';
import { CajaUseCase } from '@accounting/domain/use-cases/caja.use-case';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
  selector: 'app-caja-modal',
    imports: [ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatRadioModule,  ThemeButtonComponent,
    MatCustomDialogComponent

    ],
  templateUrl: './caja-modal.component.html',
})
export class CajaModalComponent {
  private _dialogRef = inject(MatDialogRef<CajaModalComponent>)
  private _cajaUseCase = inject(CajaUseCase);

  private tS = inject(ToasterService);
  readonly params = inject< {
    idCaja: 0,
    descripcion: '',
    idUsuario: 0,
    idTurno: 0,
}>(MAT_DIALOG_DATA);


  titleModal = 'Nueva Caja';
  btnIcon = 'save';
  btnText = 'Guardar';
  tipoRegistro = 1;

  usuarios: Array<User> = [];
  turnos: Array<Turno> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idUsuario: new FormControl(0, Validators.required),
    descripcion: new FormControl('', Validators.required),
    idTurno: new FormControl(0, Validators.required),
    estado: new FormControl(false),
  });

  idAsignacionCaja = 0;

  ngOnInit() {
    this._cajaUseCase.getDataForm().subscribe((response) => {
      let { turnos, usuarios } = response as { turnos: any; usuarios: any };

      this.usuarios = usuarios;
      this.turnos = turnos;

      if (typeof this.params === 'object' && this.params.idCaja > 0) {
        this._cajaUseCase.getId(this.params.idCaja).subscribe({
          next: (response) => {
            this.tipoRegistro = 2;
            this.titleModal = 'Editar Caja';
            this.btnIcon = 'edit';
            this.btnText = 'Actualizar';
            let { caja, asignaciones } = response;

            const dataAsignacion = asignaciones[0];

            this.idAsignacionCaja = dataAsignacion.idAsignacionCaja;
            this.dataForm.get('idCaja')?.setValue(caja.idCaja);
            this.dataForm.get('descripcion')?.setValue(caja.descripcion);
            this.dataForm.get('idUsuario')?.setValue(dataAsignacion.idUsuario);
            this.dataForm.get('idTurno')?.setValue(dataAsignacion.idTurno);
            this.dataForm.get('estado')?.setValue(caja.estado);
          },
          error: (err) => {
            this.tS.toastr({
              type: 'error',
              message: err,
            });
            this._dialogRef.close();
          },
        });
      }
    });
  }

  save() {
    try {
      let data = this.dataForm.value;
      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Complete todos los campos requeridos!',
        });
        return;
      }

      let paramsToApi = {
        descripcion: data.descripcion,
        asignacion: {
          idTurno: data.idTurno,
          idUsuario: data.idUsuario,
          idAsignacionCaja: this.idAsignacionCaja,
        },
      };

      if (data.idCaja && data.idCaja > 0) {
        this._cajaUseCase
          .update(data.idCaja, paramsToApi)
          .subscribe((response) => {
              if (response.code === '0') {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message,
                });
              }
              if (response.code === '1') {
                this.tS.toastr({
                  type: 'success',
                  message: response.message,
                });
                this._dialogRef.close(response);
              }
          });
      } else if (!(data.idCaja && data.idCaja > 0)) {
        this._cajaUseCase.create(paramsToApi).subscribe((response) => {
            if (response.code === '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
              this._dialogRef.close(response);
            }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this._dialogRef.close();
  }
}
