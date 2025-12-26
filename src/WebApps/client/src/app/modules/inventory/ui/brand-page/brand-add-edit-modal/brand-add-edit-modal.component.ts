import { Component, inject, Input, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs/operators';
import { BRAND_SERVICE } from '@inventory/data/inventory-token';

@Component({
  selector: 'app-brand-add-edit-modal',
  templateUrl: './brand-add-edit-modal.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ToUpperCaseDirective,
    MatCustomDialogComponent,
  ],
})
export class BrandAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BrandAddEditModalComponent>);
  readonly data = inject<{
    idMarca: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  tS = inject(ToastrNotificationService);
  private brandService = inject(BRAND_SERVICE);

  btnText = 'Guardar';
  titleModal = 'Nueva Marca';

  loading = signal(false);

  successReponse = {
    next: (response: ApiResponseLegacy) => {
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
    if (this.data.idMarca > 0) {
      this.btnText = 'Actualizar';
      this.titleModal = 'Editar Marca';
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

      if (this.data.idMarca > 0) {
        this.loading.set(true);
        this.brandService
          .put(this.data.idMarca, this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }

      if (!(this.data.idMarca > 0)) {
        this.loading.set(true);

        this.brandService
          .post(this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
