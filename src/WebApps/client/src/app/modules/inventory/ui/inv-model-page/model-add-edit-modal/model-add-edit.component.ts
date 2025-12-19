import { Component, inject, Input, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { BrandAddEditDirective } from '@inventory/ui/directives/brand-add-edit.directive';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { PRODUCT_SERVICE, INVENTARIO_MODELO_SERVICE } from '@inventory/tokens/inventory-token';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-add-edit-modal',
  templateUrl: './model-add-edit.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    BrandAddEditDirective,
    ToUpperCaseDirective,
    MatCustomDialogComponent,
  ],
})
export class ModelAddEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModelAddEditComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  tS = inject(ToastrNotificationService);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);
  private modeloService = inject(INVENTARIO_MODELO_SERVICE);

  btnText = 'Guardar';
  titleModal = signal('Nuevo');

  data = {
    idModelo: 0,
    idMarca: 0,
    descripcion: null,
    estado: true,
  };

  marcas = signal<any[]>([]);
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
    this.getDataForm();

    this.data = { ...this.data, ...this.params };
    if (!getValidId(this.data.idMarca)) {
      this.data.idMarca = 0;
    }

    if (this.data.idModelo > 0) {
      this.btnText = 'Actualizar';
      this.titleModal.set('Editar ');
    }
  }

  private getDataForm() {
    this._PRODUCT_SERVICE.getDataForm().subscribe((response) => {
      this.marcas.set(response.marcas);
    });
  }
  refreshMarca() {
    this.getDataForm();
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

      if (this.data.idModelo > 0) {
        this.loading.set(true);
        this.modeloService
          .put(this.data.idModelo, this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }

      if (!(this.data.idModelo > 0)) {
        this.loading.set(true);
        this.modeloService
          .post(this.data)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe(this.successReponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
