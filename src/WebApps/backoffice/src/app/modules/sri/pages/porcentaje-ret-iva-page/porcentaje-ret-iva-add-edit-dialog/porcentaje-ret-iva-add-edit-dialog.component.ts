import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { isValidField } from '@core/utils/data-validation';
import { PorcentajeRetIvaRead } from '@modules/sri/models/porcentaje-ret-iva.model';
import { PorcentajeRetIvaService } from '@modules/sri/services/porcentaje-ret-iva.service';
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
  selector: 'app-porcentaje-ret-iva-add-edit-dialog',
  imports: [
    FormsModule,
    MatSlideToggle,
    ToUpperCaseDirective,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './porcentaje-ret-iva-add-edit-dialog.component.html',
  styles: ``,
})
export class PorcentajeRetIvaAddEditDialogComponent {
  @Input({ required: true }) params = {} as PorcentajeRetIvaRead;
  private dialogRef = inject(
    MatDialogRef<PorcentajeRetIvaAddEditDialogComponent>,
  );
  tS = inject(ToastrNotificationService);
  porcentaRetIvaSvc = inject(PorcentajeRetIvaService);

  dialogTitle = 'Nuevo Porcentaje Retención Iva';
  btnText = 'Guardar';

  data = {
    codigo: '',
    descripcion: '',
    porcentaje: 0,
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
    if (this.params.idPorcentajeRetIva > 0) {
      this.dialogTitle = 'Editar Porcentaje Retención Iva';
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

    if (!isValidField(this.data.descripcion)) {
      this.tS.show({
        type: 'warning',
        message: 'Campo Descripción es requerido',
      });
      return;
    }

    if (this.params.idPorcentajeRetIva > 0) {
      this.porcentaRetIvaSvc
        .put(this.params.idPorcentajeRetIva, this.data)
        .subscribe(this.commonResponse);
    }

    if (!(this.params.idPorcentajeRetIva > 0)) {
      this.porcentaRetIvaSvc.post(this.data).subscribe(this.commonResponse);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
