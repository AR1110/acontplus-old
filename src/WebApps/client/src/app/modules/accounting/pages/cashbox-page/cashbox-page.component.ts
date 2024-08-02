import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';

import { getPermisosLocal } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Cashbox } from '@modules/accounting/models/cashbox.model';
import { CashboxService } from '@modules/accounting/services/cashbox.service';
import { NgbDropdownModule, NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { ActionAperturaCajaDirective } from '@shared/directives/permission/action-apertura-caja.directive';
import { ActionDeleteDirective } from '@shared/directives/permission/action-delete.directive';
import { ActionEditDirective } from '@shared/directives/permission/action-edit.directive';
import { ActionMovCajaDirective } from '@shared/directives/permission/action-mov-caja.directive';
import Swal from 'sweetalert2';

import { AperturaCajaModalComponent } from './apertura-caja-modal/apertura-caja-modal.component';
import { CashboxModalComponent } from './cashbox-modal/cashbox-modal.component';
import { MovimientoCajaModalComponent } from './movimiento-caja-modal/movimiento-caja-modal.component';

@Component({
  selector: 'app-cashbox',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbDropdownModule,
    NgbTooltipModule,
    BreadcrumbComponent,
    FormsModule,
    NgbPagination,
    ActionAddDirective,
    ActionEditDirective,
    ActionDeleteDirective,
    ActionAperturaCajaDirective,
    ActionMovCajaDirective
  ],
  templateUrl: './cashbox-page.component.html',
})
export class CashboxPageComponent {

  private modalSvc = inject(ModalService);
  private cashboxSvc = inject(CashboxService);
  private tS = inject(ToasterService);

  acciones: any = {}

  cashboxs: Array<Cashbox> = [];

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5

  }

  page = 1;

  totalRecords = 0;
  recordsQuantity = [10, 25, 50, 100, 200, 500];


  getCashboxs() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    this.cashboxSvc.getAll(params).subscribe({
      next: (response) => {
        let { cajas } = response as { cajas: any };
        this.cashboxs = cajas || [];
        this.totalRecords = this.cashboxs.length > 0 ? this.cashboxs[0]?.totalRecords : 0;
      },
      error: (err) => {
        console.log(err)
        this.totalRecords = 0;
      },
    })
  }


  ngOnInit() {

    this.getCashboxs()

    let getDataPermiso: any = getPermisosLocal();

    if (getDataPermiso) {
      this.acciones = getDataPermiso.acciones;
    }
  }

  openModalAddUpdate(params?: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(CashboxModalComponent);
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {

      if (typeof result === 'object') {
        this.getCashboxs();
      }
    })
  }


  pageChanged(): void {
    this.getCashboxs();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getCashboxs();
  }


  askToDelete(id: number) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {
          this.cashboxSvc.delete(id).subscribe({
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
                  this.getCashboxs();
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

  openModalAperturar(params: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(AperturaCajaModalComponent);
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {

      if (typeof result === 'object') {
        this.getCashboxs();
      }
    })
  }

  openModalMovimiento(params: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(MovimientoCajaModalComponent, {
      size: 'xl',
      centered: true
    });
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {

      if (result) {
        this.getCashboxs();
      }
    })
  }


}
