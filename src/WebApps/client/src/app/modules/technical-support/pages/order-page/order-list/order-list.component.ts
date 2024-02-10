import { Component, Input, OnInit, inject, input } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
import { OrderService } from '@modules/technical-support/services/order.service';
import { AppModule } from 'src/app/app.module';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { ModalService } from '@core/services/modal.service';
import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { OrderMaintenanceModalComponent } from '../order-maintenance-modal/order-maintenance-modal.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [AppModule],
  templateUrl: './order-list.component.html',
  styles: ``,
})
export class OrderListComponent implements OnInit {
  @Input() orderStatusCode: any = '';
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);
  dataSearch: any = {
    maxSize: 5,
    pageIndex: 1,
    pageSize: 25,
    totalRecords: 0,
  };
  orders: any = [];
  recordsQuantity = [5, 10, 25, 50, 100];

  async askToDelete(item: any) {
    const result = await swal.fire({
      icon: 'warning',
      text: 'Esta seguro de eliminar esta orden?',
      title: 'Aviso',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    });
    if (result.isConfirmed) {
      showLoader();
      this.orderService.delete(item.id).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code == '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
              this.get();
            }
          }
        },
        complete() {
          hideLoader();
        },
        error(err) {
          console.log(err);
          hideLoader();
        },
      });
    }
  }

  edit(item: any) {
    const modalRef = this.modalService.openModalCustom(OrderModalComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.data = item;
  }

  get() {
    showLoader();
    this.orderService
      .get(
        JSON.stringify({
          tipo: 2,
          orderStatusCode: ORDER_STATUS_CODE[this.orderStatusCode],
          ...this.dataSearch,
        })
      )
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            const { orders } = JSON.parse(response.payload as string);
            this.orders = orders;
            this.dataSearch.totalRecords = this.orders[0].totalRecords;
          }
        },
        complete() {
          hideLoader();
        },
        error(error) {
          console.log(error);
          hideLoader();
        },
      });
  }

  ngOnInit(): void {
    this.get();
  }
  onChangePageSize() {
    this.dataSearch.pageIndex = 1;
    this.get();
  }
  onPageChanged() {
    this.get();
  }
  openModalMaintenance(id: number) {
    const modalRef = this.modalService.openModalCustom(
      OrderMaintenanceModalComponent,
      { centered: true, size: 'lg' }
    );
    modalRef.componentInstance.params = { id };
  }
}
