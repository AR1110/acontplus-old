import { Component, inject, Input } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { isValidField } from '@core/utils/data-validation';
import { CodigoRetencionService } from '@modules/sri/services/codigo-retencion.service';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { CodigoRetencioRead } from '@modules/sri/models/codigo-retencion.model';
import {
  MatThemeButtonComponent,
  ToUpperCaseDirective,
} from 'acontplus-ui-components';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-codigo-retencion-add-edit-dialog',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    ToUpperCaseDirective,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './codigo-retencion-add-edit-dialog.component.html',
  styles: ``,
})
export class CodigoRetencionAddEditDialogComponent {
  @Input({ required: true }) params = {} as CodigoRetencioRead;
  private dialogRef = inject(
    MatDialogRef<CodigoRetencionAddEditDialogComponent>,
  );
  tS = inject(ToastrNotificationService);
  codigoRetencionSvc = inject(CodigoRetencionService);

  dialogTitle = 'Nuevo Código Retención';
  btnText = 'Guardar';

  data = {
    codigo: '',
    concepto: '',
    porcentajeMin: 0,
    porcentajeMax: 0,
    estado: true,
  };

  commonResponse = (response: ApiResponse) => {
    if (response) {
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
    }
  };

  ngOnInit() {
    if (this.params.idCodigoRetencion > 0) {
      this.dialogTitle = 'Editar Código Retención';
      this.btnText = 'Actualizar';
      this.data = this.params;
    }
  }

  save() {
    if (!isValidField(this.data.codigo)) {
      this.tS.show({
        type: 'warning',
        message: 'Campo Código es requerido',
      });
      return;
    }

    if (!isValidField(this.data.concepto)) {
      this.tS.show({
        type: 'warning',
        message: 'Campo Concepto es requerido',
      });
      return;
    }

    if (this.params.idCodigoRetencion > 0) {
      this.codigoRetencionSvc
        .put(this.params.idCodigoRetencion, this.data)
        .subscribe(this.commonResponse);
    }

    if (!(this.params.idCodigoRetencion > 0)) {
      this.codigoRetencionSvc.post(this.data).subscribe(this.commonResponse);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
