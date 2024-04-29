import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportService } from '@modules/mechanical/services/support.service';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';
import { SupportMaintenanceModalComponent } from './components/support-maintenance-modal/support-maintenance-modal.component';
import { Pagination } from '@shared/models/pagination.model';
import { InspectionModalComponent } from '../inspection-page/components/inspection-modal/inspection-modal.component';
import { SharedService } from '@core/services/shared.service';
import { MECHANICAL_CODE_REPORT } from '@modules/mechanical/enums/mechanical.enum';


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

  ],
  templateUrl: './support-page.component.html',
})
export class SupportPageComponent {
  @Input() status = 0;
  modalSvc = inject(ModalService);
  supportSvc = inject(SupportService)
  tS = inject(ToasterService)
  sharedSvc = inject(SharedService)

  displayedColumns = ['position', 'op', 'secuencia', 'fechaEmision', 'placa', 'identificacion', 'cliente-conductor', 'encargado', 'obs', 'estado'];
  pagination = new Pagination()

  dataSource: any[] = [];

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

  getSupports() {
    try {
      let params = {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }
      showLoader();
      this.supportSvc.getAll(params).subscribe({
        next: (response) => {
          hideLoader()
          this.dataSource = response;
          if (this.dataSource.length > 0) {
            this.pagination.totalRecords = this.dataSource[0].totalRecords;
          }
          console.log(response)
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

  ngOnInit(): void {
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
          showLoader()
          this.supportSvc.remove(id).subscribe({
            next: (response) => {
              hideLoader()
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
              hideLoader()
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
      size: 'xl'
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
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      supportId: id
    }
  }


  // For report
  getReport(item: any) {
    let format = 'pdf';
    let dataParams = { supportId: item.id };
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

    this.sharedSvc.getReport(params, 'pdf', true);
  }



}
