
import { Component, inject } from '@angular/core';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ComprobanteIngreso } from '@modules/accounting/models/comp-ingreso.model';
import { ComprobanteIngresoService } from '@modules/accounting/services/comprobante-ingreso.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-cobro-page',
  standalone: true,
  imports: [AppModule, AccountingModule, DateRangeSelectionComponent],
  templateUrl: './cobro-page.component.html',
  styles: ``
})
export class CobroPageComponent {
  private compIngresoSvc = inject(ComprobanteIngresoService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService)

  establecimientos: Array<EstablecimientoSelectHtmlOnly> = []
  comprobantesIngreso: Array<ComprobanteIngreso> = [];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    codEstab: '',
    totalRecords: 0,
    maxSize: 5,
    byTipoPersona: "",
    identificacionComprador: null,
    byEstado: ""
  }
  moreSearchOptions = false;
  isCustomerSearchSimple = true;
  companyCustomerSearchName = ''

  recordsQuantity = [25, 50, 100];

  tiposPersona = [
    { codigo: 1, descripcion: 'Cliente' },
    { codigo: 2, descripcion: 'Empleado' },
  ]
  disabledTempInputPersona = false;
  showCliente = false;
  showEmpleado = false;


  getComprobantesIngreso() {
    let checkBoxEstado = typeof this.dataSearch.byEstado === "number";
    let checkBoxPersona = typeof this.dataSearch.byTipoPersona === 'number';
    const params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      codEstab: isValidField(this.dataSearch.codEstab),
      checkBoxEstado: checkBoxEstado,
      byEstado: isValidField(this.dataSearch.byEstado),
      checkBoxPersona,
      nroIdentificacion: isValidField(this.dataSearch.identificacionComprador),
    }
    this.comprobantesIngreso = []
    showLoader()
    this.compIngresoSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader()
        this.comprobantesIngreso = response;
        console.log(response)
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })
  }

  ngOnInit() {
    showLoader()
    this.sharedSvc.getEstabAsign().subscribe({
      next: (establecimientos) => {
        hideLoader()
        this.establecimientos = establecimientos as Array<EstablecimientoSelectHtmlOnly>
        if (this.establecimientos.length > 0) {
          let dataEstab = this.establecimientos.find(estab => estab.predeterminado)
          this.dataSearch.codEstab = dataEstab?.codEstab || '';
          this.getComprobantesIngreso()
        }
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })
  }

  onDateRangeSelection(range: { from: string, to: string }) {

    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getComprobantesIngreso()
  }

  pageChanged(): void {
    this.getComprobantesIngreso();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getComprobantesIngreso();
  }


  onClickBtnMore() {
    this.moreSearchOptions = !this.moreSearchOptions;
  }

  onChangePersona() {
    this.showCliente = false;
    this.showEmpleado = false;
    this.dataSearch.identificacionComprador = null;
    if (typeof this.dataSearch.byTipoPersona === 'number' && this.dataSearch.byTipoPersona === 1) {
      this.showCliente = true;
      this.showEmpleado = false;
    }
    if (typeof this.dataSearch.byTipoPersona === 'number' && this.dataSearch.byTipoPersona === 2) {
      this.showCliente = false;
      this.showEmpleado = true;
    }
  }

  onCustomerSelected<T extends { data: any }>($event: T) {
    let { data } = $event;
    this.dataSearch.identificacionComprador = data.identificacionComprador;
    this.companyCustomerSearchName = data.razonSocialComprador
  }
  resultCustomerEmptyInput($event: any) {
    this.dataSearch.identificacionComprador = null
    this.companyCustomerSearchName = ''
  }


  filterValidation() {
    if (typeof this.dataSearch.byTipoPersona === "number") {
      if (!isValidField(this.dataSearch.identificacionComprador)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el cliente o el empleado'
        });
        return
      }
    }

    this.getComprobantesIngreso()
  }

}
