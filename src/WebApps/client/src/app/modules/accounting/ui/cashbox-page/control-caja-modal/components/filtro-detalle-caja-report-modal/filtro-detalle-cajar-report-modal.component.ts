import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CODE_REPORT } from '@core/constants/global.constants';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';

import { stringToDate } from '@core/utils/string-to-date';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbActiveModal,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import {EntidadFinanciera} from "@accounting/core/models/entidad-financiera.interface";
import { formatDateToString } from '@core/utils/date.util';
import {ControlCajaUseCase} from "@accounting/core/use-cases/control-caja.use-case";

@Component({
    selector: 'app-filtro-detalle-caja-report-modal',
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NgbTimepickerModule,
    ],
    templateUrl: './filtro-detalle-cajar-report-modal.component.html'
})
export class FiltroDetalleCajaReportModal {
  @Input('params') params = {
    id: 0,
    fechaApertura: '',
    fechaCierre: '',
  };
  activeModal = inject(NgbActiveModal);
  dataSearch = {
    idEntidadFinanciera: '',
    codDoc: '',
    fromDate: new Date(),
    toDate: new Date(),
    ckHora: true,
  };
  entidadesFinanciera: Array<EntidadFinanciera> = [];
  tipoDocumentos: Array<TipoDoc> = [];
  dateRangeOptions = {
    timePicker: true,
    format: 'YYYY-MM-DD HH:mm',
  };
  private _controlCajaUseCase = inject(ControlCajaUseCase)

  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);

  ngOnInit() {
    let fromDate = stringToDate(
      this.params.fechaApertura,
      'dd/MM/yyyy HH:ii',
      '/',
    );
    let toDate =
      this.params.fechaCierre &&
      stringToDate(this.params.fechaCierre, 'dd/MM/yyyy HH:ii', '/');

    this.dataSearch.fromDate = fromDate || new Date();
    this.dataSearch.toDate = toDate || new Date();

    try {
      this._controlCajaUseCase.getDataForm().subscribe({
        next: (response) => {

          let { formaPagos, tipoDocumento } = response as {
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
    const timeString = inputElement.value;
    const [hours, minutes] = timeString.split(':').map(Number);

    // Actualiza solo la hora y el minuto manteniendo la fecha actual
    if (fromDate) {
      this.dataSearch.fromDate.setHours(hours);
      this.dataSearch.fromDate.setMinutes(minutes);
    } else {
      this.dataSearch.toDate.setHours(hours);
      this.dataSearch.toDate.setMinutes(minutes);
    }
  }

  // onDateRangeSelection(range: { from: string, to: string }) {

  //   this.dataSearch.fromDate = range.from;
  //   this.dataSearch.toDate = range.to;
  // }

  getReport(format: 'pdf' | 'excel') {
    try {
      if (!(this.params.id > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'id no proporcionado!',
        });
        return;
      }

      let dataParams = {
        tipo: 2,
        idEntidadFinanciera: isValidField(this.dataSearch.idEntidadFinanciera),
        codDoc: isValidField(this.dataSearch.codDoc),
        id: this.params.id,
        horaInicio: formatDateToString(this.dataSearch.fromDate),
        horaFin: formatDateToString(this.dataSearch.toDate),
        ckHora: this.dataSearch.ckHora,
      };


      const parameters = {
        hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
        reportParams: JSON.stringify({
          codigo: CODE_REPORT.CDCC,
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
    } catch (error) {
      console.log(error);
    }
  }
}
