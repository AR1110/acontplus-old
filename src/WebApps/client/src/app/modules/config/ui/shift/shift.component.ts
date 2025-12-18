
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ShiftUseCase } from '@modules/config/application/use-cases/shift/shift.use-case';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ShiftList } from '@modules/config/domain/models/shift.models';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DialogService } from '@core/services/dialog.service';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { ShiftAddEditModalComponent } from './shift-add-edit-modal/shift-add-edit-modal';

@Component({
  selector: 'app-shift',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    DynamicCard,
    Button,
  ],
  templateUrl: './shift.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftComponent implements OnInit {
  private readonly $shiftUseCase = inject(ShiftUseCase);
  private readonly _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);

  shifts = signal<ShiftList[]>([]);

  ngOnInit() {
    this.getShifts();
  }

  resetShifts() {
    this.getShifts();
  }

  getShifts() {
    this.shifts.set([]);
    this.$shiftUseCase.listShifts({ pageIndex: 1, pageSize: 10 }).subscribe((response) => {
      this.shifts.set(response.data);
    });
  }

  openModalAddUpdate(item?: ShiftList) {
    const ref = this._dialogSvc.open(ShiftAddEditModalComponent, {
      size: 'lg',
      data: structuredClone(item) || {},
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.resetShifts();
      }
    });
  }

  askToDelete(item: ShiftList) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `<small>Esta acción eliminará el turno "${item.descripcion}". ¿Desea continuar?</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.$shiftUseCase.deleteShift({ idTurno: item.idTurno }).subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              text: response.message,
            });
          }

          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              text: response.message,
              timer: 1000,
            });
            setTimeout(() => {
              this.getShifts();
            }, 1000);
          }
        });
      }
    });
  }
}
