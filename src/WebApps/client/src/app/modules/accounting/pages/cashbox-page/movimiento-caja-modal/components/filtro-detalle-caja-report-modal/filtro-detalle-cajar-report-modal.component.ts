import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
import { CODE_REPORT } from "@core/constants/global.constants";
import { TipoDoc } from "@core/models/tipo-doc.model";
import { SharedService } from "@core/services/shared.service";
import { ToasterService } from "@core/services/toaster.service";
import { formatDateMoment } from "@core/utils/format-date-moment";
import { hideLoader } from "@core/utils/loader";
import { stringToDate } from "@core/utils/string-to-date";
import { isValidField } from "@core/utils/utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { EntidadFinanciera } from "@modules/accounting/models/entidad-financiera.model";
import { ControlCajaService } from "@modules/accounting/services/control-caja.service";
import { NgbActiveModal, NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-filtro-detalle-caja-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, NgbTimepickerModule, DateRangeSelectionComponent],
  templateUrl: './filtro-detalle-cajar-report-modal.component.html'
})
export class FiltroDetalleCajaReportModal {
  @Input("params") params = {
    id: 0,
    fechaApertura: '',
    fechaCierre: ''
  }


  private controlCajaSvc = inject(ControlCajaService);
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);


  activeModal = inject(NgbActiveModal);

  dataSearch = {
    idEntidadFinanciera: "",
    codDoc: "",
    fromDate: new Date(),
    toDate: new Date(),
    ckHora: true
  }

  entidadesFinanciera: Array<EntidadFinanciera> = [];
  tipoDocumentos: Array<TipoDoc> = [];

  dateRangeOptions = {
    timePicker: true,
    format: 'YYYY-MM-DD HH:mm'
  }


  ngOnInit() {
    let fromDate = stringToDate(this.params.fechaApertura, "dd/MM/yyyy HH:ii", "/");
    let toDate = this.params.fechaCierre && stringToDate(this.params.fechaCierre, "dd/MM/yyyy HH:ii", "/");

    this.dataSearch.fromDate = fromDate || new Date()
    this.dataSearch.toDate = toDate || new Date();

    try {
      this.controlCajaSvc.getDataForm().subscribe({
        next: (response) => {
          hideLoader();
          let { formaPagos, tipoDocumento } = response as { formaPagos: any, tipoDocumento: any }
          this.entidadesFinanciera = formaPagos;
          this.tipoDocumentos = tipoDocumento;
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    } catch (error) {
      console.log(error)
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
          message: 'id no proporcionado!'
        })
        return
      }


      let dataParams = {
        tipo: 2,
        idEntidadFinanciera: isValidField(this.dataSearch.idEntidadFinanciera),
        codDoc: isValidField(this.dataSearch.codDoc),
        id: this.params.id,
        horaInicio: formatDateMoment(this.dataSearch.fromDate),
        horaFin: formatDateMoment(this.dataSearch.toDate),
        ckHora: this.dataSearch.ckHora
      }

      console.log(dataParams)

      const parameters = {
        hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
        reportParams: JSON.stringify({
          codigo: CODE_REPORT.CDCC,
          format,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataParams)
      }

      this.sharedSvc.getReport(parameters, format, true)
    } catch (error) {
      console.log(error)
    }
  }

}
