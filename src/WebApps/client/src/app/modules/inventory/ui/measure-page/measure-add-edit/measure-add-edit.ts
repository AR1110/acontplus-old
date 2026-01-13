import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Button } from '@acontplus/ng-components';
import { MEASURE_SERVICE } from '@inventory/data/inventory-token';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-measure-add-edit',
  templateUrl: './measure-add-edit.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ToUpperCaseDirective,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureAddEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MeasureAddEdit>);
  readonly data = inject<{
    idMedida: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private measureService = inject(MEASURE_SERVICE);

  btnText = 'Guardar';
  loading = signal(false);

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
    if (this.data.idMedida > 0) {
      this.btnText = 'Actualizar';
    }
  }

  save(): void {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.warning({ message: 'Ingrese la descripción' });
        return;
      }

      this.loading.set(true);
      const operation =
        this.data.idMedida > 0
          ? this.measureService.put(this.data.idMedida, this.data)
          : this.measureService.post(this.data);

      operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
