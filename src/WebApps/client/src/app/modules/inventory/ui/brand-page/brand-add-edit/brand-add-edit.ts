import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Button } from '@acontplus/ng-components';
import { finalize } from 'rxjs/operators';
import { BRAND_HTTP_TOKEN } from '@inventory/data/inventory-token';

@Component({
  selector: 'app-brand-add-edit',
  templateUrl: './brand-add-edit.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ToUpperCaseDirective,
    MatDialogActions,
    MatDialogContent,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandAddEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BrandAddEdit>);
  readonly data = inject<{
    idMarca: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private brandService = inject(BRAND_HTTP_TOKEN);

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
    if (this.data.idMarca > 0) {
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
        this.data.idMarca > 0
          ? this.brandService.put(this.data.idMarca, this.data)
          : this.brandService.post(this.data);

      operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
