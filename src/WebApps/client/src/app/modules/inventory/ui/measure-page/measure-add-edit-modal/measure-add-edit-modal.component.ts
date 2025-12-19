import { Component, inject, Input, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { isValidField } from '@core/utils/utils';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MEASURE_SERVICE } from '@inventory/tokens/inventory-token';
import { finalize } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-measure-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ToUpperCaseDirective,
    MatCustomDialogComponent,
  ],
  templateUrl: './measure-add-edit-modal.component.html',
  styles: ``,
})
export class MeasureAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MeasureAddEditModalComponent>);
  readonly data = inject<{
    id: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);
  tS = inject(ToastrNotificationService);
  private measureService = inject(MEASURE_SERVICE);

  btnText = 'Guardar';
  titleModal = 'Nueva Medida';

  loading = signal(false);

  successReponse = {
    next: (response: any) => {
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
    },
    error(error: any) {
      console.log(error);
    },
  };

  ngOnInit() {
    if (this.data.id > 0) {
      this.btnText = 'Actualizar';
      this.titleModal = 'Editar Medida';
    }
  }

  save() {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la descripción',
        });
        return;
      }

      if (this.data.id > 0) {
        this.loading.set(true);
        this.measureService
          .put(this.data.id, this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }

      if (!(this.data.id > 0)) {
        this.loading.set(true);
        this.measureService
          .post(this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
