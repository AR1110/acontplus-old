import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Button } from '@acontplus/ng-components';
import { finalize } from 'rxjs/operators';
import { CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { User } from '@core/models/user.model';
import { Turno } from '@accounting/shared/models/turno.model';

@Component({
  selector: 'app-caja-modal',
  templateUrl: './caja-modal.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogActions,
    MatDialogContent,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CajaModalComponent>);
  readonly data = inject<{
    idCaja: number;
    descripcion: string;
    idUsuario: number;
    idTurno: number;
    estado: boolean;
  }>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private cajaService = inject(CAJA_HTTP_TOKEN);

  btnText = 'Guardar';
  loading = signal(false);
  usuarios = signal<User[]>([]);
  turnos = signal<Turno[]>([]);
  idAsignacionCaja = 0;

  private successResponse = {
    next: (response: ApiResponseLegacy) => {
      if (response.code === '0') {
        this.tS.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.tS.success({ message: response.message });
        this.dialogRef.close(response);
      }
    },
    error: (error: unknown) => {
      console.error(error);
    },
  };

  ngOnInit(): void {
    if (this.data.idCaja > 0) {
      this.btnText = 'Actualizar';
    }
    this.cajaService.getDataForm().subscribe((response) => {
      const { turnos, usuarios } = response as { turnos: any; usuarios: any };

      this.usuarios.set(usuarios);
      this.turnos.set(turnos);

      if (this.data.idCaja > 0) {
        this.cajaService.getId(this.data.idCaja).subscribe((response) => {
          const { caja, asignaciones } = response;
          const dataAsignacion = asignaciones[0];

          this.idAsignacionCaja = dataAsignacion.idAsignacionCaja;
          this.data.descripcion = caja.descripcion;
          this.data.idUsuario = dataAsignacion.idUsuario;
          this.data.idTurno = dataAsignacion.idTurno;
          this.data.estado = caja.estado;
        });
      }
    });
  }

  save(): void {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.warning({ message: 'Ingrese la descripción' });
        return;
      }

      if (!this.data.idUsuario || this.data.idUsuario === 0) {
        this.tS.warning({ message: 'Seleccione un usuario' });
        return;
      }

      if (!this.data.idTurno || this.data.idTurno === 0) {
        this.tS.warning({ message: 'Seleccione un turno' });
        return;
      }

      this.loading.set(true);

      const paramsToApi = {
        descripcion: this.data.descripcion,
        asignacion: {
          idTurno: this.data.idTurno,
          idUsuario: this.data.idUsuario,
          idAsignacionCaja: this.idAsignacionCaja,
        },
      };

      const operation =
        this.data.idCaja > 0
          ? this.cajaService.update(this.data.idCaja, paramsToApi)
          : this.cajaService.create(paramsToApi);

      operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}

export default CajaModalComponent;
