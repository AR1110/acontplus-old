import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { FormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { WarehouseList } from '@inventory/domain/models/warehouse.model';
import { Button } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { WAREHOUSE_SERVICE } from '@inventory/tokens/inventory-token';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-edit-warehouse',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatCustomDialogComponent,
    ToUpperCaseDirective,
    Button,
  ],
  templateUrl: './add-edit-warehouse.component.html',
  styles: ``,
})
export class AddEditWarehouseComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddEditWarehouseComponent>);
  private params = inject<WarehouseList>(MAT_DIALOG_DATA);
  private sharedSvc = inject(SharedService);
  private _tS = inject(ToastrNotificationService);
  private warehouseService = inject(WAREHOUSE_SERVICE);

  title = 'Nueva Bodega';
  btnText = 'Guardar';
  btnIcon = 'save';

  isUpdate = signal(false);

  estabs = signal<EstablecimientoSelectHtmlOnly[]>([]);

  data = {
    codEstab: '',
    descripcion: '',
    telefono: '',
    direccion: '',
  };

  ngOnInit() {
    this.sharedSvc.getEstabAsign().subscribe((response) => {
      this.estabs.set(response);
    });

    if (getValidId(this.params.idBodega)) {
      this.isUpdate.set(true);
      this.data = structuredClone(this.params);
    }
  }

  save() {
    if (!isValidField(this.data.codEstab)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }

    if (!isValidField(this.data.descripcion)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese la descripción',
      });
      return;
    }

    if (getValidId(this.params.idBodega)) {
      this.warehouseService.update(this.data).subscribe(this.successResponse);
      return;
    }
    this.warehouseService.create(this.data).subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this._tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this._tS.show({
        type: 'success',
        message: response.message,
      });
      this.dialogRef.close(response);
    }
  };
  close() {
    this.dialogRef.close();
  }
}
