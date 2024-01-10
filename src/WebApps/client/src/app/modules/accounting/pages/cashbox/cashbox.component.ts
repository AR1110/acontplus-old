import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { Cashbox } from '@modules/accounting/models/cashbox.model';
import { CashboxService } from '@modules/accounting/services/cashbox.service';
import { AppModule } from 'src/app/app.module';
import Swal from 'sweetalert2';
import { CashboxModalComponent } from './cashbox-modal/cashbox-modal.component';
import { AperturaCajaModalComponent } from './apertura-caja-modal/apertura-caja-modal.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { MovimientoCajaModalComponent } from './movimiento-caja-modal/movimiento-caja-modal.component';

@Component({
  selector: 'app-cashbox',
  standalone: true,
  imports: [AppModule, AccountingModule],
  templateUrl: './cashbox.component.html',
  styleUrl: './cashbox.component.scss'
})
export class CashboxComponent {

  private modalSvc = inject(ModalService);
  private cashboxSvc = inject(CashboxService);
  private tS = inject(ToasterService);

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
    showLoader();
    this.cashboxSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        let { cajas } = response as { cajas: any };
        this.cashboxs = cajas || [];
        this.totalRecords = this.cashboxs.length > 0 ? this.cashboxs[0]?.totalRecords : 0;
      },
      error: (err) => {
        hideLoader();
        console.log(err)
        this.totalRecords = 0;
      },
    })
  }


  ngOnInit() {
    console.log('init')
    console.log(localStorage.getItem("userData"))
    this.getCashboxs()
  }

  openModalAddUpdate(params?: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(CashboxModalComponent);
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
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
          showLoader();
          this.cashboxSvc.delete(id).subscribe({
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
                  this.getCashboxs();
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

  openModalAperturar(params: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(AperturaCajaModalComponent);
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
      if (typeof result === 'object') {
        this.getCashboxs();
      }
    })
  }

  openModalMovimiento(params: Cashbox) {
    const modalRef = this.modalSvc.openModalCustom(MovimientoCajaModalComponent, { size: 'xl', fullscreen: 'xxl', windowClass: 'uibModalFullScreen'});
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
      if (typeof result === 'object') {
        this.getCashboxs();
      }
    })
  }


}
