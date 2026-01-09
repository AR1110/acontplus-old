import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { FormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { WarehouseList } from '@inventory/data/models/warehouse.model';
import { Button } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { WAREHOUSE_SERVICE } from '@inventory/data/inventory-token';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { finalize } from 'rxjs/operators';

interface WarehouseData {
  idBodega?: number;
  codEstab: string;
  descripcion: string;
  telefono: string;
  direccion: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-edit-warehouse-page',
  templateUrl: './add-edit-warehouse.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ToUpperCaseDirective,
    Button,
    MatDialogActions,
    MatDialogContent,
  ],
})
export class AddEditWarehouse implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditWarehouse>);
  readonly params = inject<Partial<WarehouseList>>(MAT_DIALOG_DATA);

  private sharedSvc = inject(SharedService);
  private tS = inject(NotificationService);
  private warehouseService = inject(WAREHOUSE_SERVICE);

  btnText = 'Guardar';
  btnIcon = 'save';
  loading = signal(false);
  isUpdate = signal(false);
  estabs = signal<EstablecimientoSelectHtmlOnly[]>([]);

  data: WarehouseData = {
    codEstab: '',
    descripcion: '',
    telefono: '',
    direccion: '',
  };

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
    this.sharedSvc.getEstabAsign().subscribe((response: EstablecimientoSelectHtmlOnly[]) => {
      this.estabs.set(response);
    });

    if (getValidId(this.params.idBodega)) {
      this.isUpdate.set(true);
      this.btnText = 'Actualizar';
      this.data = structuredClone(this.params) as WarehouseData;
    }
  }

  save(): void {
    if (!isValidField(this.data.codEstab)) {
      this.tS.warning({ message: 'Seleccione el Establecimiento' });
      return;
    }

    if (!isValidField(this.data.descripcion)) {
      this.tS.warning({ message: 'Ingrese la descripción' });
      return;
    }

    this.loading.set(true);
    const operation = getValidId(this.params.idBodega)
      ? this.warehouseService.update(this.data)
      : this.warehouseService.create(this.data);

    operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
  }
}
