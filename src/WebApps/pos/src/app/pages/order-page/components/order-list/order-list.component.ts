import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { CustomTableContainerComponent } from '@/core/components/custom-table-container/custom-table-container.component';
import { ActionWhatsappSendDirective } from '@/directives/action-whatsapp-send.directive';
import { OrderRead } from '@/models/order.model';
import { Pagination } from '@/models/pagination.model';
import { DialogService } from '@/services/dialog.service';
import { OrderService } from '@/services/order.service';
import { ToasterService } from '@/services/toaster.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';

import { OrderDivideModalComponent } from '../order-divide-modal/order-divide-modal.component';
import { OrderDocModalComponent } from '../order-doc-modal/order-doc-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '@/services/shared.service';
import { CODE_REPORT } from '@/enums/main.enum';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    CustomContainerDialogComponent,
    CustomTableContainerComponent,
    ActionWhatsappSendDirective
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  isLoadingResults = input(false)
  pagination = input.required<Pagination>();
  handlePageEvent = output<any>()
  dataSource = input<OrderRead[]>([])

  isFinished = input.required<boolean>()
  refresh = output()

  private dialogSvc = inject(DialogService)
  private orderSvc = inject(OrderService)
  private tS = inject(ToasterService)
  private sharedSvc = inject(SharedService)

  displayedColumns: string[] = ['index', 'op', 'nroDoc', 'fechaEmision', 'customer', 'importeTotal', 'tableName', 'obs', 'userName'];




  openOrderDocDialog(item: OrderRead) {
    this.dialogSvc.open(OrderDocModalComponent, {
      size: 'xl',
      data: {
        orderId: item.id
      },

    }).subscribe(result => {
      if (result) {
        console.log('User confirmed');
        // Perform action on confirmation
      } else {
        console.log('User canceled');
        // Handle cancelation
      }
    });
  }

  async askToAnul(row: OrderRead) {
    let { isConfirmed } = await Swal.fire({
      title: "Anular Orden",
      text: "¿Estas seguro de anular el pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
      cancelButtonText: 'No!'
    })
    if (isConfirmed) {
      this.orderSvc.setAnul(row.id).subscribe(response => {
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
          this.refresh.emit()
        }
      })
    }
  }


  openOrderDivideDialog(item: OrderRead) {
    const modalRef = this.dialogSvc.open(OrderDivideModalComponent, {
      size: 'xl',
      data: {
        orderId: item.id
      }
    })

    modalRef.subscribe(result => {
      if (result && (result.isReload)) {
        this.refresh.emit()
      }
    })

  }


  getReport(data: OrderRead) {

    const parameters = {
      dataParams: JSON.stringify({
        id: data.id
      }),
      reportParams: JSON.stringify({
        codEstab: data.codEstab,
        codigo: CODE_REPORT.OR,
        format: "pdf",
      }),
    };
    this.sharedSvc.getReport({
      data: parameters
    })

  };



}
