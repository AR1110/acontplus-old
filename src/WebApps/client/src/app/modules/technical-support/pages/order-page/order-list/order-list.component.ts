import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { REPORT_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
import { OrderService } from '@modules/technical-support/services/order.service';
import swal from 'sweetalert2';

import { OrderMaintenanceModalComponent } from '../order-maintenance-modal/order-maintenance-modal.component';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatPagination } from '@shared/models/pagination.model';
import { OrderDocumentComponent } from '../order-document/order-document.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { OrderDeliveryModalComponent } from '../order-delivery-modal/order-delivery-modal.component';
import { formatDateToString } from '@core/utils/date.util';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '@core/services/dialog.service';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-order-list',
  imports: [
    DateRangeSelectionComponent,
    FormsModule,
    MatTableModule,
    MatButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatDynamicTableComponent,
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
  private tS = inject(ToastrNotificationService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serie', label: 'Serie Comprobante', type: 'string' },
    { key: 'razonSocialComprador', label: 'Cliente', type: 'string' },
    { key: 'discount', label: 'Descuento', type: 'number' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'userName', label: 'Usuario Asignado', type: 'string' },
    { key: 'orderStatusName', label: 'Estado Orden', type: 'string' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map(colDef => colDef.key);

  pagination = signal(new MatPagination());

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
        next: response => {
          if (isApiResponse(response)) {
            this.tS.show({
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
    this.orderService.getAll(clonedParams).subscribe(response => {
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
        this.pagination.update(prev => {
          return {
            ...prev,
            totalRecords: response.orders[0].totalRecords,
          };
        });
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
    modalRef.subscribe(response => {
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
    modalResp.subscribe(response => {
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

    modalRef.subscribe(response => {
      if (response.code === '1') {
        this.get();
      }
    });
  }

  openModalMaintenance(item: any) {
    if (!(item.assignedUserId > 0)) {
      return this.tS.show({
        type: 'warning',
        message: 'Debe asignar esta orden a un responsable, antes de empezar los mantenimientos',
      });
    }
    const modalRef = this.modalService.open(OrderMaintenanceModalComponent, {
      size: 'xl',
      data: {
        id: item.id,
      },
    });

    modalRef.subscribe(result => {
      if (result !== null && typeof result === 'object') {
        this.get();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update(pag => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }
}
