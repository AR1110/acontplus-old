import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { isApiResponse } from '@core/models/api-response';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovimientoCajaRead } from '@accounting/core/domain/movimiento-caja.model';
import { MovimientoCajaService } from '@accounting/services/movimiento-caja.service';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ModalEgresoIngresoComponent } from '@accounting/ui/movimiento-caja-page/egreso-ingreso-caja/modal-egreso-ingreso/modal-egreso-ingreso.component';
import {
  CompanyCustomerSearchComponent
} from "@company-customer/components/company-customer-search/company-customer-search.component";
import {ACCOUNTING_CODE_REPORT} from "@accounting/core/enums/accounting.constants";
import { ActionAnularDirective } from '@shared/directives/permission/action-anular.directive';
import { ActionReportDirective } from '@shared/directives/permission/action-report.directive';
import { formatDateToString } from '@core/utils/date.util';

@Component({
    selector: 'app-egreso-ingreso-caja',
    imports: [
        FormsModule,
        FontAwesomeModule,
        NgbDropdownModule,
        NgbPagination,
        DateRangeSelectionComponent,
        CompanyCustomerSearchComponent,
        ActionAnularDirective,
        ActionReportDirective
    ],
    templateUrl: './egreso-ingreso-caja.component.html'
})
export class EgresoIngresoCajaComponent {
  totalRecords = 0;
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    codEstab: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    customerId: 0,
    codEstado: '',
  };
  page = 1;
  recordsQuantity = [25, 50, 100];
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  movimientosCaja: Array<MovimientoCajaRead> = [];
  private modalSvc = inject(ModalService);
  private movCajaSvc = inject(MovimientoCajaService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

  getMovimientosCaja() {
    let params = {
      codEstab: this.dataSearch.codEstab,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      checkBoxFecha: true,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      customerId: isValidField(this.dataSearch.customerId),
      codEstado: isValidField(this.dataSearch.codEstado),
    };
    this.movimientosCaja = [];
    this.movCajaSvc.getAll(params).subscribe( (response) => {
        this.movimientosCaja = response || [];
        this.totalRecords =
          this.movimientosCaja.length > 0  ? this.movimientosCaja[0].totalRecords : 0;
    });
  }

  ngOnInit() {
    this.movCajaSvc.getDataFilter().subscribe( (response) => {
        this.establecimientos = response.establecimientos;
        if (this.establecimientos.length > 0) {
          let dataEstab = this.establecimientos.find(
            (item) => item.predeterminado,
          );
          if (dataEstab) {
            this.dataSearch.codEstab = dataEstab.codEstab;
            this.getMovimientosCaja();
          }
        }
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getMovimientosCaja();
  }

  refresh() {
    this.getMovimientosCaja();
  }

  onSelectCustomer<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.customerId = data.customerId;
    this.getMovimientosCaja()
  }

  onEmptyCustomer() {
    this.dataSearch.customerId = 0;
  }

  openModal(params?: any) {
    const modalRef = this.modalSvc.openModalCustom(
      ModalEgresoIngresoComponent,
      { size: 'lg', backdrop: 'static' },
    );
    modalRef.componentInstance.params = params || {};
    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getMovimientosCaja();
      }
    });
  }

  getPrint(item: MovimientoCajaRead) {
    let parameters = {
      idDocument: item.idMovimientoCaja,
      idTipoDocumento: item.idTipoDocumento,
      codEstab: item.codEstab,
      codDoc: item.codDoc,
      nroIdentificacion: item.nroIdentificacion,
    };

    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters),
    });
  }

  getReport(item: MovimientoCajaRead) {
    try {
      let format = 'pdf';
      let dataParms = {
        tipo: 1,
        id: item.idMovimientoCaja,
      };

      const parameters = {
        reportParams: JSON.stringify({
          codigo: ACCOUNTING_CODE_REPORT.RMIE,
          format,
          codEstab: item.codEstab,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParms),
      };

      this.sharedSvc.getReport({
        data: parameters,
        format: 'pdf',
      });
    } catch (error) {
      console.log(error);
    }
  }

  askToDelete(item: MovimientoCajaRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar  ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.movCajaSvc.delete(item.idMovimientoCaja).subscribe( (response) => {
              if (isApiResponse(response)) {
                if (response.code === '0') {
                  this.tS.toastr({
                    type: 'warning',
                    message: response.message,
                  });
                }
                if (response.code === '1') {
                  this.tS.toastr({
                    type: 'success',
                    message: response.message,
                  });
                  this.getMovimientosCaja();
                }
              }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  pageChanged(): void {
    this.getMovimientosCaja();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getMovimientosCaja();
  }
}
