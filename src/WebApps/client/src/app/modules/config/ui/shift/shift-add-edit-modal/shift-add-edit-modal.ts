import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ScheduleUseCase } from '@modules/config/application/use-cases/schedule/schedule.use.case';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ShiftUseCase } from '@modules/config/application/use-cases/shift/shift.use-case';
import { Shift, ShiftList } from '@modules/config/domain/models/shift.models';
import { ScheduleList } from '@modules/config/domain/models/schedule.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-shift-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    Button,
    MatCustomDialogComponent,
  ],
  templateUrl: './shift-add-edit-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftAddEditModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ShiftAddEditModalComponent>);
  private params = inject(MAT_DIALOG_DATA);
  private $scheduleUseCase = inject(ScheduleUseCase);
  private $shiftUseCase = inject(ShiftUseCase);

  schedules = signal<ScheduleList[]>([]);

  title = '';
  data: Shift = {
    descripcion: '',
    idUsuario: 0,
    idEntidad: 0,
    estado: false,
  };

  isEdit = false;

  ngOnInit() {
    if (this.params && this.params.idTurno) {
      this.isEdit = true;
      this.data = { ...this.params };
    }
    this.title = this.isEdit ? 'Editar Turno' : 'Agregar Turno';
  }

  showSwal(icon: 'success' | 'error' | 'warning' | 'info' | 'question', text: string) {
    Swal.fire({
      icon: icon,
      text: text,
    });
  }

  getSchedules() {
    this.schedules.set([]);

    this.$scheduleUseCase.listSchedules().subscribe((response) => {
      this.schedules.set(response.data);
    });
  }

  save() {
    if (!this.data.descripcion?.trim()) {
      this.showSwal('warning', 'Ingrese la descripción del turno');
      return;
    }

    const params: ShiftList = this.isEdit
      ? { ...this.data, index: this.params.index || 0, totalRecords: this.params.totalRecords || 0 }
      : { ...this.data, index: 0, totalRecords: 0 };

    const operation = this.isEdit
      ? this.$shiftUseCase.updateShift(params)
      : this.$shiftUseCase.createShift(params);

    operation.subscribe((response) => {
      if (response.code === '0') {
        this.showSwal('warning', response.message);
      }
      if (response.code === '1') {
        Swal.fire({
          icon: 'success',
          text: response.message,
          timer: 1000,
        });
        this.dialogRef.close(response);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
