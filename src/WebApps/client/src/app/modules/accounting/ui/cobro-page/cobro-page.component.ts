import { Component, inject } from '@angular/core';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { ComprobanteIngreso } from '@accounting/core/domain/comp-ingreso.model';
import { ComprobanteIngresoService } from '@accounting/services/comprobante-ingreso.service';
import { EmployeeSearchComponent } from '@sale/components/employee-search/employee-search.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyCustomerSearchComponent } from '@company-customer/components/company-customer-search/company-customer-search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { formatDateToString } from '@core/utils/date.util';

@Component({
    selector: 'app-cobro-page',
    imports: [
        FormsModule,
        DateRangeSelectionComponent,
        FontAwesomeModule,
        EmployeeSearchComponent,
        NgbPaginationModule,
        CompanyCustomerSearchComponent,
        BreadcrumbComponent,
    ],
    templateUrl: './cobro-page.component.html',
    styles: ``
})
export class CobroPageComponent {
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  comprobantesIngreso: Array<ComprobanteIngreso> = [];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codEstab: '',
    totalRecords: 0,
    maxSize: 5,
    byTipoPersona: '',
    identificacionComprador: null,
    byEstado: '',
  };
  moreSearchOptions = false;
  isCustomerSearchSimple = true;
  companyCustomerSearchName = '';
  recordsQuantity = [25, 50, 100];
  tiposPersona = [
    { codigo: 1, descripcion: 'Cliente' },
    { codigo: 2, descripcion: 'Empleado' },
  ];
  disabledTempInputPersona = false;
  showCliente = false;
  showEmpleado = false;
  isSearchEmployeeSimple = true;
  private compIngresoSvc = inject(ComprobanteIngresoService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

  getComprobantesIngreso() {
    let checkBoxEstado = typeof this.dataSearch.byEstado === 'number';
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
    };
    this.comprobantesIngreso = [];

    this.compIngresoSvc.getAll(params).subscribe((response) => {
      this.comprobantesIngreso = response;
    });
  }

  ngOnInit() {
    this.sharedSvc.getEstabAsign().subscribe((establecimientos) => {
      this.establecimientos =
        establecimientos as Array<EstablecimientoSelectHtmlOnly>;
      if (this.establecimientos.length > 0) {
        let dataEstab = this.establecimientos.find(
          (estab) => estab.predeterminado,
        );
        this.dataSearch.codEstab = dataEstab?.codEstab || '';
        this.getComprobantesIngreso();
      }
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getComprobantesIngreso();
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
    this.companyCustomerSearchName = '';
    if (
      typeof this.dataSearch.byTipoPersona === 'number' &&
      this.dataSearch.byTipoPersona === 1
    ) {
      this.showCliente = true;
      this.showEmpleado = false;
    }
    if (
      typeof this.dataSearch.byTipoPersona === 'number' &&
      this.dataSearch.byTipoPersona === 2
    ) {
      this.showCliente = false;
      this.showEmpleado = true;
    }
  }

  onCustomerSelected<T extends { data: any }>($event: T) {
    let { data } = $event;
    this.dataSearch.identificacionComprador = data.identificacionComprador;
    this.companyCustomerSearchName = data.razonSocialComprador;
  }

  resultCustomerEmptyInput($event: any) {
    this.dataSearch.identificacionComprador = null;
    this.companyCustomerSearchName = '';
  }

  filterValidation() {
    if (typeof this.dataSearch.byTipoPersona === 'number') {
      if (!isValidField(this.dataSearch.identificacionComprador)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el cliente o el empleado',
        });
        return;
      }
    }

    this.getComprobantesIngreso();
  }

  onEmployeeSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.identificacionComprador = data.nroIdentificacion;
    this.companyCustomerSearchName = data.nombreCompleto;
  }

  employeeResultEmptyInput($event: any) {
    this.dataSearch.identificacionComprador = null;
    this.companyCustomerSearchName = '';
  }

  sendMail() {
    this.sharedSvc.openModalSendMail({});
  }
}
