import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MECHANICAL_CODE_REPORT } from '@modules/mechanical/enums/mechanical.enum';
import { SupportService } from '@modules/mechanical/services/support.service';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/models/pagination.model';
import Swal from 'sweetalert2';

import { InspectionModalComponent } from '../inspection-page/components/inspection-modal/inspection-modal.component';
import { ConvertDocModalComponent } from './components/convert-doc-modal/convert-doc-modal.component';
import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';
import { SupportMaintenanceModalComponent } from './components/support-maintenance-modal/support-maintenance-modal.component';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@company-customer/components/company-customer-search/company-customer-search.component';
import { isValidField } from '@core/utils/utils';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbPagination,
    MatTableModule,
    MatCheckboxModule,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent
  ],
  templateUrl: './support-page.component.html',
})
export class SupportPageComponent {
  @Input() status = 0;
  modalSvc = inject(ModalService);
  supportSvc = inject(SupportService)
  tS = inject(ToasterService)
  sharedSvc = inject(SharedService)

  displayedColumns = ['position', 'op', 'secuencia', 'fechaEmision', 'placa', 'identificacion', 'cliente-conductor', 'encargado', 'obs', 'estado', 'entregar'];
  pagination = new Pagination()

  dataSource: any[] = [];

  statusDoc = [
    { status: null, description: 'Todos' },
    { status: 0, description: 'En proceso' },
    { status: 1, description: 'Entregado' },
    { status: 2, description: 'Aprobado' },
    { status: 3, description: 'Anulado' },
  ]

  openModal(id?: number) {
    const modalRef = this.modalSvc.open(SupportAddEditModalComponent, {
      size: 'lg'
    })
    modalRef.componentInstance.params = {
      id: id
    }
    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.getSupports()
      }
    })
  }

  dataSearch = {
    ckDate: true,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    customerId: null as number | null,
    licensePlate: null as string | null,
    assigned: false,
    status: this.status
  }

  onChangeRequiredDate(value: boolean) {
    this.dataSearch.ckDate = value;
    this.getSupports();
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getSupports();
  }

  //Customer
  searchEmptyCompanyCustomer() {
    this.dataSearch.customerId = null;
    this.getSupports();
  }

  onCustomerSelected({ data }: any) {
    this.dataSearch.customerId = data.idCliente;
    this.getSupports();
  }

  getSupports() {
    try {
      /**
       * si status es 0 la pagina support-page carga en dasboard
       */


      let params = {
        ckDate: this.dataSearch.ckDate,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        status: this.dataSearch.status >= 0 ? this.dataSearch.status : null,
        fromDate: this.dataSearch.fromDate,
        toDate: this.dataSearch.toDate,
        customerId: this.dataSearch.customerId,
        licensePlate: isValidField(this.dataSearch.licensePlate)
      }
      this.dataSource = [];
      this.supportSvc.getAll(params).subscribe({
        next: (response) => {

          this.dataSource = response;
          if (this.dataSource.length > 0) {
            this.pagination.totalRecords = this.dataSource[0].totalRecords;
          }
          console.log(response)
        },
        error(err) {
          ;
          console.log(err)
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit(): void {
    let status = this.status === 0 ? this.status : this.status - 1;
    console.log(status)
    this.dataSearch.status = status;
    this.getSupports();
  }

  pageChanged(): void {
    this.getSupports();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
    this.getSupports();
  }


  askToDelete(id: number) {
    try {
      Swal.fire({
        // title: "Are you sure?",
        text: "¿Estás seguro de anular este documento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí!",
        cancelButtonText: 'No!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.supportSvc.remove(id).subscribe({
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
                  this.getSupports();
                }
              }
            },
            error(err) {

              console.log(err)
            },
          })
        }
      });
    } catch (error) {
      console.log(error)
    }
  }


  openMaintenance(id: number) {
    let modalRef = this.modalSvc.open(SupportMaintenanceModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    })
    modalRef.componentInstance.params = {
      id
    }
    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.getSupports();
      }
    })
  }


  openModalInspection(id: number) {
    let modalRef = this.modalSvc.open(InspectionModalComponent, {
      size: 'xl',
    })
    modalRef.componentInstance.params = {
      supportId: id
    }
  }

  askToConvertToDoc(id: number) {
    this.supportSvc.getConvertToAprobDoc(id).subscribe({
      next: (response) => {

        let modalRef = this.modalSvc.open(ConvertDocModalComponent)
        modalRef.componentInstance.params = response;

        modalRef.result.then(result => {
          if (result !== null && typeof result === 'object') {
            this.getSupports();
          }
        })
      }
    })

  }


  // For report
  getReport(item: any) {
    let format = 'pdf';
    let dataParams = { supportId: item.id, tipo: 1 };
    const params = {
      reportParams: JSON.stringify({
        hasParams: true,
        codigo: MECHANICAL_CODE_REPORT.MS,
        codEstab: item.codEstab,
        format,
        additionalParams: []
      }),
      hasService: false,
      hasIdUsuarioRol: true,
      dataParams: JSON.stringify(dataParams)
    };

    this.sharedSvc.getReport(params, 'pdf');
  }

  //Status Support
  putState(id: number, status: number) {
    try {
      Swal.fire({
        // title: "Are you sure?",
        text: "¿Estás seguro de Entregar este documento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí!",
        cancelButtonText: 'No!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.supportSvc.putState(id, status).subscribe({
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
                  this.getSupports();
                }
              }
            },
            error(err) {

              console.log(err)
            },
          })
        } else {
          this.getSupports()
        }
      });
    } catch (error) {
      console.log(error)
    }
  };
}

