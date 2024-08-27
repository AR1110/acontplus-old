import { CustomContainerDialogComponent } from "@/core/components/custom-container-dialog/custom-container-dialog.component";
import { PaymentComponent } from "@/core/components/payment/payment.component";
import { ActionEmailSendDirective } from "@/directives/action-email-send.directive";
import { ActionWhatsappSendDirective } from "@/directives/action-whatsapp-send.directive";
import { CODE_REPORT, DOC_TYPE } from "@/enums/main.enum";
import { OrderDocRed } from "@/models/order-doc.model";
import { DialogService } from "@/services/dialog.service";
import { OrderService } from "@/services/order.service";
import { SharedService } from "@/services/shared.service";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { CustomTableContainerComponent } from "@core/components/custom-table-container/custom-table-container.component";

@Component({
  selector: 'app-order-doc-modal',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CustomContainerDialogComponent,
    CustomTableContainerComponent,
    ActionWhatsappSendDirective,
    ActionEmailSendDirective
  ],
  templateUrl: './order-doc-modal.component.html',

})

export class OrderDocModalComponent {
  readonly dialogRef = inject(MatDialogRef<OrderDocModalComponent>);
  readonly data = inject<{ orderId: 0 }>(MAT_DIALOG_DATA);

  orderSvc = inject(OrderService);
  private sharedSvc = inject(SharedService);
  private dialogSvc = inject(DialogService)

  displayedColumns: string[] = ['index', 'op', 'tipoDoc', 'nroDoc', 'fechaEmision', 'cliente', 'total', 'abono', 'saldo', 'estado'];
  dataSource: OrderDocRed[] = []

  isLoadingResults = false;
  private getOrderDocs() {
    this.isLoadingResults = true;
    this.orderSvc.getOrderDocs(this.data.orderId).subscribe({
      next: response => {
        this.isLoadingResults = false;
        this.dataSource = response;
      },
      error: () => this.isLoadingResults = false
    })
  }
  ngOnInit() {
    this.getOrderDocs()
  }


  getReport(data: OrderDocRed) {
    try {
      const format = 'pdf';
      const dataParms = {
        id: data.documentoId,
        format,
        codEstab: data.codEstab,
      }

      if (data.docType === DOC_TYPE.NE) {
        const parameters = {
          hasService: true,
          reportParams: JSON.stringify({
            hasParams: true,
            codigo: CODE_REPORT.NE,
            codEstab: data.codEstab,
            format,
            aditionalParams: []
          }),
          dataParams: JSON.stringify(dataParms)
        }
        this.sharedSvc.getReport({
          data: parameters,
          isOldVersion: true
        })
      }

      if (data.docType === DOC_TYPE.FV) {
        const parameters = {
          hasService: true,
          reportParams: JSON.stringify({
            hasParams: true,
            codigo: CODE_REPORT.FV,
            codEstab: data.codEstab,
            format,
            aditionalParams: []
          }),
          dataParams: JSON.stringify(dataParms)
        }
        this.sharedSvc.getReport({
          data: parameters,
          isOldVersion: true
        })
      }
    } catch (error) {
      console.log(error)
      console.log(error)
    }
  }

  openCobroModal(data: OrderDocRed) {
    let modalRef = this.dialogSvc.open(PaymentComponent, {
      size: 'xl',

      data: {
        data
      }
    })
    modalRef.subscribe(result => {
      if (result && typeof result === 'object') {
        this.getOrderDocs()
      }
    })

  }


  closeDialog(){
    this.dialogRef.close()
  }



}
