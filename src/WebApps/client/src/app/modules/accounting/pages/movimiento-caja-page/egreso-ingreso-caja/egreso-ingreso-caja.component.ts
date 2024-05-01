import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CODE_REPORT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovimientoCajaRead } from '@modules/accounting/models/movimiento-caja.model';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { EmployeeSearchComponent } from '@modules/sale/components/employee-search/employee-search.component';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ModalEgresoIngresoComponent } from './modal-egreso-ingreso/modal-egreso-ingreso.component';

@Component({
  selector: 'app-egreso-ingreso-caja',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule,NgbDropdownModule,NgbPagination, DateRangeSelectionComponent, EmployeeSearchComponent],
  templateUrl: './egreso-ingreso-caja.component.html',
})
export class EgresoIngresoCajaComponent {

  private modalSvc = inject(ModalService);
  private movCajaSvc = inject(MovimientoCajaService);
  private sharedSvc = inject(SharedService)
  private tS = inject(ToasterService)
  totalRecords = 0;

  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    codEstab: '',
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    employeeId: 0,
    codEstado: ''
  }
  page = 1;
  recordsQuantity = [25, 50, 100];


  establecimientos: Array<EstablecimientoSelectHtmlOnly> = []
  movimientosCaja: Array<MovimientoCajaRead> = [];

  isSearchEmployeeSimple = true;
  getMovimientosCaja() {

    let params = {
      codEstab: this.dataSearch.codEstab,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      checkBoxFecha: true,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      idEmpleado: isValidField(this.dataSearch.employeeId),
      codEstado: isValidField(this.dataSearch.codEstado)
    }
    this.movimientosCaja = [];
    this.movCajaSvc.getAll(params).subscribe({
      next: (response) => {

        this.movimientosCaja = response || [];
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0;
      },
      error(err) {

        console.log(err)
      },
    })
  }
  ngOnInit() {

    this.movCajaSvc.getDataFilter().subscribe({
      next: (response) => {

        this.establecimientos = response.establecimientos;
        if (this.establecimientos.length > 0) {
          let dataEstab = this.establecimientos.find(item => (item.predeterminado))
          if (dataEstab) {
            this.dataSearch.codEstab = dataEstab.codEstab;
            this.getMovimientosCaja()
          }
        }
      },
      error(err) {
        console.log(err)

      },
    })
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getMovimientosCaja()
  }

  refresh() {
    this.getMovimientosCaja()
  }

  onEmployeeSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.employeeId = data.idEmpleado;
  }
  employeeResultEmptyInput($event: any) {
    this.dataSearch.employeeId = 0;
  }

  openModal(params?: any) {
    const modalRef = this.modalSvc.openModalCustom(ModalEgresoIngresoComponent, { size: 'lg', backdrop: "static" });
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      if (typeof result === 'object') {
        this.getMovimientosCaja();
      }
    })
  }

  getPrint(item: MovimientoCajaRead) {
    let parameters = {
      idDocument: item.idMovimientoCaja,
      idTipoDocumento: item.idTipoDocumento,
      codEstab: item.codEstab,
      codDoc: item.codDoc,
      nroIdentificacion: item.nroIdentificacion
    }

    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters)
    })

  }

  getReport(item: MovimientoCajaRead) {
    try {
      let format = 'pdf';
      let dataParms = {
        id: item.idMovimientoCaja,
      }



      const parameters = {
        hasService: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: CODE_REPORT.RMIE,
          format,
          codEstab: item.codEstab,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataParms)
      }

      this.sharedSvc.getReport(parameters, "pdf", true)
    } catch (error) {
      console.log(error)
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
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {

          this.movCajaSvc.delete(item.idMovimientoCaja).subscribe({
            next: (response) => {

              if (isApiResponse(response)) {
                if (response.code === "0") {
                  this.tS.toastr({
                    type: 'warning',
                    message: response.message
                  })
                }
                if (response.code === "1") {
                  this.tS.toastr({
                    type: 'success',
                    message: response.message
                  })
                  this.getMovimientosCaja();
                }
              }
            }, error(err) {

              console.log(err)
            },
          })
        }
      })
    } catch (error) {

      console.log(error)
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
