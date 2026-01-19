import { Component, inject, Input, input } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isValidField } from '@core/utils/data-validation';
import { ReportService } from '@modules/config/services/report.service';
import { ToastrNotificationService } from 'acontplus-utils';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatThemeButtonComponent} from "acontplus-ui-components";

@Component({
  selector: 'app-report-add-edit-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './report-add-edit-dialog.component.html',
  styles: ``,
})
export class ReportAddEditDialogComponent {
  @Input({ required: true }) params = {
    idReporte: 0,
    codigo: null as string | null,
    reportPath: null as string | null,
    storedProcedure: null as string | null,
    contentType: null as string | null,
    nombreReporte: null as string | null,
    estado: false,
  };

  private dialogRef = inject(MatDialogRef<ReportAddEditDialogComponent>);
  private tS = inject(ToastrNotificationService);
  private reportSvc = inject(ReportService);

  dialogTitle = 'Nuevo Reporte';
  btnText = 'Guardar';

  data = {
    codigo: null as string | null,
    reportPath: null as string | null,
    storedProcedure: null as string | null,
    contentType: null as string | null,
    nombreReporte: null as string | null,
    estado: false,
  };

  commonResponse = (response: any) => {
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
    if (this.params.idReporte > 0) {
      this.dialogTitle = 'Editar Reporte';
      this.btnText = 'Actualizar';

      this.data = structuredClone(this.params);
    }
  }

  save() {
    try {
      if (!isValidField(this.data.codigo)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el código',
        });
        return;
      }

      if (!isValidField(this.data.reportPath)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el report path',
        });
        return;
      }
      if (!isValidField(this.data.storedProcedure)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el storedProcedure',
        });
        return;
      }
      if (!isValidField(this.data.contentType)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el contentType',
        });
        return;
      }
      if (!isValidField(this.data.nombreReporte)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el nombreReporte',
        });
        return;
      }

      let params = {
        codigo: this.data.codigo,
        reportPath: this.data.reportPath,
        contentType: this.data.contentType,
        storedProcedure: this.data.storedProcedure,
        nombreReporte: this.data.nombreReporte,
        estado: this.data.estado,
      };

      if (!(this.params.idReporte > 0)) {
        this.reportSvc.post(params).subscribe(this.commonResponse);
      }

      if (this.params.idReporte > 0) {
        this.reportSvc
          .put(this.params.idReporte, params)
          .subscribe(this.commonResponse);
      }
    } catch (err) {
      console.log(err);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
