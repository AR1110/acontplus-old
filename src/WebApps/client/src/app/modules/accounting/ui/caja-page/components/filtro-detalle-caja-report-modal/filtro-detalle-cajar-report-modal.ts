import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { REPORT_CODE } from '@core/constants/global.constants';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { stringToDate } from '@core/utils/string-to-date';
import { isValidField } from '@core/utils/utils';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { formatDateToString } from '@core/utils/date.util';
import { CONTROL_CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Button } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {ACCOUNTING_CODE_REPORT, REPORT_FORMAT, ReportFacade, ReportParamsBuilder} from '@acontplus/ng-common';

@Component({
  selector: 'app-filtro-detalle-caja-page-report-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTimepickerModule,
    Button,
    MatSlideToggle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './filtro-detalle-cajar-report-modal.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltroDetalleCajaReportModal implements OnInit {
  private dialogRef = inject(MatDialogRef<FiltroDetalleCajaReportModal>);
  params = inject<{
    data: {
      id: 0;
      fechaApertura: '';
      fechaCierre: '';
    };
  }>(MAT_DIALOG_DATA);

  dataSearch = {
    idEntidadFinanciera: '',
    codDoc: '',
    fromDate: new Date(),
    toDate: new Date(),
    ckHora: true,
  };
  entidadesFinanciera: EntidadFinanciera[] = [];
  tipoDocumentos: TipoDoc[] = [];

  private _controlCajaUseCase = inject(CONTROL_CAJA_HTTP_TOKEN);

  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);
  private reportFacade = inject(ReportFacade)

  ngOnInit() {
    const fromDate = stringToDate(this.params.data.fechaApertura, 'dd/MM/yyyy HH:ii', '/');
    const toDate =
      this.params.data.fechaCierre &&
      stringToDate(this.params.data.fechaCierre, 'dd/MM/yyyy HH:ii', '/');

    this.dataSearch.fromDate = fromDate || new Date();
    this.dataSearch.toDate = toDate || new Date();

    try {
      this._controlCajaUseCase.getDataForm().subscribe({
        next: (response) => {
          const { formaPagos, tipoDocumento } = response as {
            formaPagos: any;
            tipoDocumento: any;
          };
          this.entidadesFinanciera = formaPagos;
          this.tipoDocumentos = tipoDocumento;
        },
        error(err) {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  onTimeChange(event: Event, fromDate: boolean): void {
    const inputElement = event.target as HTMLInputElement;
    const timeStr = inputElement.value;
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Actualiza solo la hora y el minuto manteniendo la fecha actual
    if (fromDate) {
      this.dataSearch.fromDate.setHours(hours);
      this.dataSearch.fromDate.setMinutes(minutes);
    } else {
      this.dataSearch.toDate.setHours(hours);
      this.dataSearch.toDate.setMinutes(minutes);
    }
  }

  reportPdf() {
    this.getReport(REPORT_FORMAT.PDF);
  }
  reportExcel() {
    this.getReport(REPORT_FORMAT.EXCEL);
  }

  getReport(format: REPORT_FORMAT) {
    try {
      if (!(this.params.data.id > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'id no proporcionado!',
        });
        return;
      }

      const dataParams = {
        tipo: 2,
        idEntidadFinanciera: isValidField(this.dataSearch.idEntidadFinanciera),
        codDoc: isValidField(this.dataSearch.codDoc)?? undefined,
        id: this.params.data.id,
        horaInicio: formatDateToString(this.dataSearch.fromDate),
        horaFin: formatDateToString(this.dataSearch.toDate),
        ckHora: this.dataSearch.ckHora,
      };

      const parameters = {
        hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
        reportParams: JSON.stringify({
          codigo: REPORT_CODE.CDCC,
          format,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParams),
      };

      this.sharedSvc.getReport({
        data: parameters,
        format: format,
        isOldVersion: true,
      });
      const reportOptions = ReportParamsBuilder.build({
        codeReport: ACCOUNTING_CODE_REPORT.CDCC,
        data: dataParams,
        format
      });
      this.reportFacade.open(reportOptions).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
