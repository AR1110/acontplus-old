import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { getValidId, isValidField } from '@core/utils/utils';
import { BrandAddEditDirective } from '@inventory/ui/directives/brand-add-edit.directive';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { PRODUCT_SERVICE, INVENTARIO_MODELO_SERVICE } from '@inventory/data/inventory-token';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Button } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

interface Brand {
  idMarca: number;
  descripcion: string;
}

interface ModelData {
  idModelo: number;
  idMarca: number;
  descripcion: string | null;
  estado: boolean;
}

@Component({
  selector: 'app-model-add-edit',
  templateUrl: './model-add-edit.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    BrandAddEditDirective,
    ToUpperCaseDirective,
    Button,
    MatDialogActions,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelAddEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModelAddEdit>);
  readonly params = inject<Partial<ModelData>>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);
  private modeloService = inject(INVENTARIO_MODELO_SERVICE);

  btnText = 'Guardar';

  data: ModelData = {
    idModelo: 0,
    idMarca: 0,
    descripcion: null,
    estado: true,
  };

  marcas = signal<Brand[]>([]);
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
    this.getDataForm();

    this.data = { ...this.data, ...this.params };
    if (!getValidId(this.data.idMarca)) {
      this.data.idMarca = 0;
    }

    if (this.data.idModelo > 0) {
      this.btnText = 'Actualizar';
    }
  }

  private getDataForm(): void {
    this._PRODUCT_SERVICE.getDataForm().subscribe((response: { marcas: Brand[] }) => {
      this.marcas.set(response.marcas);
    });
  }

  refreshMarca(): void {
    this.getDataForm();
  }

  save(): void {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.warning({ message: 'Ingrese la descripción' });
        return;
      }

      this.loading.set(true);
      const operation =
        this.data.idModelo > 0
          ? this.modeloService.put(this.data.idModelo, this.data)
          : this.modeloService.post(this.data);

      operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
