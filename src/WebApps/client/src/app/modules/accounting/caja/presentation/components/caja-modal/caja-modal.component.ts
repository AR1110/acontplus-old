import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '@core/models/user.model';

import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { CajaUseCase } from '@accounting/caja/application/use-cases/caja.use-case';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Turno } from '@accounting/shared/models/turno.model';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caja-modal',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ThemeButtonComponent,
    MatCustomDialogComponent,
  ],
  templateUrl: './caja-modal.component.html',
})
export class CajaModalComponent implements OnInit {
  private _dialogRef = inject(MatDialogRef<CajaModalComponent>);
  private _cajaUseCase = inject(CajaUseCase);

  private tS = inject(ToastrNotificationService);
  readonly params = inject<{
    idCaja: 0;
    descripcion: '';
    idUsuario: 0;
    idTurno: 0;
  }>(MAT_DIALOG_DATA);

  titleModal = signal('Nueva Caja');
  btnIcon = 'save';
  btnText = 'Guardar';
  tipoRegistro = 1;

  usuarios = signal<User[]>([]);
  turnos = signal<Turno[]>([]);

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
      const { turnos, usuarios } = response as { turnos: any; usuarios: any };

      this.usuarios.set(usuarios);
      this.turnos.set(turnos);

      if (typeof this.params === 'object' && this.params.idCaja > 0) {
        this._cajaUseCase.getId(this.params.idCaja).subscribe((response) => {
          this.tipoRegistro = 2;
          this.titleModal.set('Editar Caja');
          this.btnIcon = 'edit';
          this.btnText = 'Actualizar';
          const { caja, asignaciones } = response;

          const dataAsignacion = asignaciones[0];

          this.idAsignacionCaja = dataAsignacion.idAsignacionCaja;
          this.dataForm.get('idCaja')?.setValue(caja.idCaja);
          this.dataForm.get('descripcion')?.setValue(caja.descripcion);
          this.dataForm.get('idUsuario')?.setValue(dataAsignacion.idUsuario);
          this.dataForm.get('idTurno')?.setValue(dataAsignacion.idTurno);
          this.dataForm.get('estado')?.setValue(caja.estado);
        });
      }
    });
  }

  commonResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      Swal.fire({
        icon: 'warning',
        html: response.message,
      });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        html: response.message,
      });
      this._dialogRef.close(response);
    }
  };

  save() {
    try {
      const data = this.dataForm.value;
      if (this.dataForm.invalid) {
        this.tS.show({
          type: 'warning',
          message: 'Complete todos los campos requeridos!',
        });
        return;
      }

      const paramsToApi = {
        descripcion: data.descripcion,
        asignacion: {
          idTurno: data.idTurno,
          idUsuario: data.idUsuario,
          idAsignacionCaja: this.idAsignacionCaja,
        },
      };

      if (data.idCaja && data.idCaja > 0) {
        this._cajaUseCase.update(data.idCaja, paramsToApi).subscribe(this.commonResponse);
      } else if (!(data.idCaja && data.idCaja > 0)) {
        this._cajaUseCase.create(paramsToApi).subscribe(this.commonResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this._dialogRef.close();
  }
}
