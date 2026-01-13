import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import { TARIFA_SERVICE } from '@inventory/data/inventory-token';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { Button } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize } from 'rxjs/operators';

interface TarifaData {
  idTarifa: number;
  codigo: string | null;
  descripcion: string | null;
  estado: boolean;
  ventaPorMayor: boolean;
}

@Component({
  selector: 'app-tarifa-edit',
  templateUrl: './tarifa-edit.html',
  imports: [
    FormsModule,
    ToUpperCaseDirective,
    Button,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDialogActions,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarifaEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TarifaEdit>);
  readonly params = inject<Partial<TarifaData>>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private tarifaSvc = inject(TARIFA_SERVICE);

  btnText = 'Guardar';
  loading = signal(false);

  data: TarifaData = {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false,
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
    this.data = { ...this.data, ...this.params };

    if (this.data.idTarifa > 0) {
      this.btnText = 'Actualizar';
    }
  }

  save(): void {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.warning({ message: 'Ingrese la descripción' });
        return;
      }

      if (!isValidField(this.data.codigo)) {
        this.tS.warning({ message: 'Ingrese el código' });
        return;
      }

      this.loading.set(true);

      this.tarifaSvc
        .put(this.data.idTarifa, this.data)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
