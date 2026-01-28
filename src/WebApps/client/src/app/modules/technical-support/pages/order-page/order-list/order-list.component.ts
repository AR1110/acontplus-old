import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { REPORT_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { SharedService } from '@core/services/shared.service';

import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
import { OrderService } from '@modules/technical-support/services/order.service';
import swal from 'sweetalert2';

import { OrderMaintenanceModalComponent } from '../order-maintenance-modal/order-maintenance-modal.component';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { Pagination, DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { OrderDocumentComponent } from '../order-document/order-document.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { OrderDeliveryModalComponent } from '../order-delivery-modal/order-delivery-modal.component';
import { formatDateToString } from '@core/utils/date.util';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '@core/services/dialog.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-order-list',
  imports: [
    DateRangeSelectionComponent,
    FormsModule,
    DataGrid,
    Button,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
  ],
  templateUrl: './order-list.component.html',
  styles: `
    .row {
      display: flex;
      align-items: center;
    }
  `,
})
export class OrderListComponent implements OnInit {
  @Input() orderStatusCode: any = '';
  dataSearch = {
    assignedUserId: 0,
    customer: '',
    endDate: formatDateToString(new Date()),
    startDate: formatDateToString(new Date()),
  };
  visibleColumns: string[] = [
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
    'orderStatusName',
  ];
  orders = signal<any>([]);
  startDate = '';
  users: any = [];
  private modalService = inject(DialogService);
  private orderService = inject(OrderService);
  private sharedService = inject(SharedService);
  private notification = inject(NotificationService);

  columns: DataGridColumn[] = [
    { header: '#', field: 'index', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Fecha Emisión', field: 'fechaEmision', sortable: true },
    { header: 'Serie Comprobante', field: 'serie', sortable: true },
    { header: 'Cliente', field: 'razonSocialComprador', sortable: true },
    { header: 'Descuento', field: 'discount', sortable: true },
    { header: 'Total', field: 'total', sortable: true },
    { header: 'Usuario Asignado', field: 'userName', sortable: true },
    { header: 'Estado Orden', field: 'orderStatusName', sortable: true },
    { header: 'Estado', field: 'nombreEstado', sortable: true },
  ];

  pagination = signal(new Pagination());

  async askToCancel(item: any) {
    const result = await swal.fire({
      icon: 'warning',
      text: 'Esta seguro de anular esta orden?',
      title: 'Aviso',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.orderService.delete(item.id).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code == '1') {
              this.notification.success({ message: response.message });
              this.get();
            } else {
              this.notification.warning({ message: response.message });
            }
          }
        },
        error(err) {
          console.log(err);
        },
        complete() {},
      });
    }
  }

  get() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      orderStatusCode: ORDER_STATUS_CODE[this.orderStatusCode],
      startDate: this.startDate,
    };
    const clonedParams = Object.assign(params, this.dataSearch);
    this.orderService.getAll(clonedParams).subscribe((response) => {
      const orders = (response.orders || []).map((order: any, index: number) => {
        return {
          ...order,
          index: index + 1,
          nombreEstado: order.enabled ? 'Activo' : 'Inactivo',
        };
      });
      this.orders.set(orders);
      this.users = response.users;
      if (this.orders().length > 0) {
        this.pagination.update(
          (prev) => new Pagination(prev.pageIndex, prev.pageSize, response.orders[0].totalRecords),
        );
      }
    });
  }

  getReport(item: any) {
    const parameters = {
      reportParams: JSON.stringify({
        codEstab: item.codEstab,
        codigo: REPORT_CODE.RTS,
        format: 'pdf',
      }),
      dataParams: JSON.stringify(item),
    };
    this.sharedService.getReport({ data: parameters, format: 'pdf' });
  }

  refresh() {
    this.get();
  }
  ngOnInit(): void {
    this.get();
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.endDate = range.to;
    this.dataSearch.startDate = range.from;
    this.get();
  }

  onEdit(item: any) {
    const modalRef = this.modalService.open(OrderModalComponent, {
      size: 'xl',
      data: item || {},
    });
    modalRef.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
    });
  }

  onModalOpen() {
    const modalResp = this.modalService.open(OrderModalComponent, {
      size: 'xl',
      data: {},
    });
    modalResp.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
    });
  }

  onOpenDocument(item: any) {
    this.modalService.open(OrderDocumentComponent, {
      size: 'xl',
      data: structuredClone(item),
    });
  }

  askToDelivery(item: any) {
    const modalRef = this.modalService.open(OrderDeliveryModalComponent, {
      data: structuredClone(item) || {},
    });

    modalRef.subscribe((response) => {
      if (response.code === '1') {
        this.get();
      }
    });
  }

  openModalMaintenance(item: any) {
    if (!(item.assignedUserId > 0)) {
      return this.notification.warning({
        message: 'Debe asignar esta orden a un responsable, antes de empezar los mantenimientos',
      });
    }
    const modalRef = this.modalService.open(OrderMaintenanceModalComponent, {
      size: 'xl',
      data: {
        id: item.id,
      },
    });

    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.get();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
