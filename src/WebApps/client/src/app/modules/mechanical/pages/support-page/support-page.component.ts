import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/class/pagination';
import { SupportService } from '@modules/mechanical/services/support.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbPagination,
    MatTableModule
  ],
  templateUrl: './support-page.component.html',
  styleUrl: './support-page.component.css',
})
export class SupportPageComponent implements OnInit {
  modalSvc = inject(ModalService);
  supportSvc = inject(SupportService)
  tS = inject(ToasterService)

  displayedColumns = ['position', 'op', 'secuencia', 'fechaEmision', 'placa', 'identificacion', 'cliente-conductor', 'encargado', 'estado'];
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
      if(result!==null && typeof result==='object'){
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


  resultModal(event: any) {
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




}
