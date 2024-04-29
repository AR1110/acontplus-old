import { Component, inject, Input, OnInit } from '@angular/core';
import { CODE_REPORT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
import { OrderService } from '@modules/technical-support/services/order.service';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';
import swal from 'sweetalert2';

import { OrderMaintenanceModalComponent } from '../order-maintenance-modal/order-maintenance-modal.component';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { MatTableModule } from '@angular/material/table';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { Pagination } from '@shared/models/pagination.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    MatTableModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbPaginationModule,
    PrimaryStatusPipe,
  ],
  templateUrl: './order-list.component.html',
  styles: ``,
})
export class OrderListComponent implements OnInit {
  @Input() orderStatusCode: any = '';
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private sharedService = inject(SharedService);
  private tS = inject(ToasterService);

  pagination = new Pagination();

  orders: any = [];
  recordsQuantity = [5, 10, 25, 50, 100];

  displayedColumns: string[] = [
    'position',
    'op',
    'fechaEmision',
    'serieComprobante',
    'razonSocialComprador',
    'discount',
    'total',
    'obs',
    'user',
    'status',
  ];

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
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.get();
            }
          }
        },
        error(err) {
          console.log(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    }
  }
  async askToDelivery(item: any) {
    const result = await swal.fire({
      icon: 'info',
      text: 'Esta seguro de entregar esta orden al cliente?',
      title: 'Aviso',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    });
    if (result.isConfirmed) {
      showLoader();
      this.orderService.delivery(item.id).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.get();
            }
          }
        },
        error(err) {
          console.log(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    }
  }

  onEdit(item: any) {
    const modalRef = this.modalService.openModalCustom(OrderModalComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.data = item;
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
    });
  }

  get() {
    showLoader();
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      orderStatusCode: ORDER_STATUS_CODE[this.orderStatusCode],
    };
    this.orderService.getAll(params).subscribe({
      next: (response) => {
        this.orders = response;
        if (this.orders.length > 0) {
          this.pagination.totalRecords = this.orders[0].totalRecords;
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

  getReport(item: any) {
    const parameters = {
      reportParams: JSON.stringify({
        codEstab: item.codEstab,
        codigo: CODE_REPORT.RTS,
        format: 'pdf',
      }),
      dataParams: JSON.stringify(item),
    };
    this.sharedService.getReport(parameters, 'pdf');
  }

  ngOnInit(): void {
    this.get();
  }
  onChangePageSize() {
    this.pagination.pageIndex = 1;
    this.get();
  }
  onPageChanged() {
    this.get();
  }
  openModalMaintenance(item: any) {
    if (!(item.assignedUserId > 0)) {
      return this.tS.toastr({
        type: 'warning',
        message:
          'Debe asignar esta orden a un responsable, antes de empezar los mantenimientos',
      });
    }
    const modalRef = this.modalService.openModalCustom(
      OrderMaintenanceModalComponent,
      { size: 'xl' }
    );
    modalRef.componentInstance.params = { id: item.id };

    modalRef.result.then((result) => {
      if (result !== null && typeof result === 'object') {
        this.get();
      }
    });
  }
}
