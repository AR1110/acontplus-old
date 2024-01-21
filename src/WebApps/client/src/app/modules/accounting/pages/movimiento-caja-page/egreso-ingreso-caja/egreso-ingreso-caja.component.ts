import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { ModalEgresoIngresoComponent } from './modal-egreso-ingreso/modal-egreso-ingreso.component';
import { MovimientoCajaRead } from '@modules/accounting/models/movimiento-caja.model';
import { hideLoader, showLoader } from '@core/utils/loader';
import { CODE_REPORT } from '@core/constants/global.constants';
import { SharedService } from '@core/services/shared.service';
import Swal from 'sweetalert2';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { isValidField } from '@core/utils/utils';
import { EmployeeSearchComponent } from '@modules/sale/components/employee-search/employee-search.component';

@Component({
  selector: 'app-egreso-ingreso-caja',
  standalone: true,
  imports: [AppModule, DateRangeSelectionComponent, EmployeeSearchComponent],
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
    fromDate: '',
    toDate: '',
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
    showLoader();
    this.movCajaSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        this.movimientosCaja = response || [];
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }
  ngOnInit() {
    showLoader()
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
        hideLoader()
      },
    })
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
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
          showLoader();
          this.movCajaSvc.delete(item.idMovimientoCaja).subscribe({
            next: (response) => {
              hideLoader();
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
              hideLoader();
              console.log(err)
            },
          })
        }
      })
    } catch (error) {
      hideLoader();
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
