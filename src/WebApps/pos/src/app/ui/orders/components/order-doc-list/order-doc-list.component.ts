import {PaymentComponent} from '@ui/components/payment/payment.component';
import {ActionEmailSendDirective} from '@ui/directives/action-email-send.directive';
import {ActionWhatsappSendDirective} from '@ui/directives/action-whatsapp-send.directive';
import {CODE_REPORT, DOC_TYPE} from '@domain/enums/main.enum';
import {OrderDocRed} from '@domain/models/order-doc.model';
import {DialogService} from '@domain/services/dialog.service';
import {SharedService} from '@domain/services/shared.service';
import {Component, inject, input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatTooltip} from "@angular/material/tooltip";
import {OrderUseCase} from "@domain/use-cases/order.use-case";

@Component({
    selector: 'app-order-doc-list',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        ActionWhatsappSendDirective,
        ActionEmailSendDirective,
        MatTooltip
    ],
    templateUrl: './order-doc-list.component.html'
})
export class OrderDocListComponent {
  readonly data = input.required<{ id: 0 }>();
  private _orderUseCase= inject(OrderUseCase);
  private sharedSvc = inject(SharedService);
  private dialogSvc = inject(DialogService)

  displayedColumns: string[] = ['index', 'op', 'tipoDoc', 'nroDoc', 'fechaEmision', 'cliente', 'total', 'abono', 'saldo', 'estado'];
  dataSource: OrderDocRed[] = []

  isLoadingResults = false;

  private getOrderDocs() {
    this.dataSource = [];
    this.isLoadingResults = true;
    this._orderUseCase.getOrderDocs(this.data().id).subscribe({
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

  documentPrint(data: OrderDocRed) {
    try {
      if (data.docType === DOC_TYPE.FV) {
        this.sharedSvc.askToPrint({
          id: data.orderId,
          documentoId: data.documentoId,
          tipo: 3
        })
      }
      if (data.docType === DOC_TYPE.NE) {
        this.sharedSvc.askToPrint({
          id: data.orderId,
          documentoId: data.documentoId,
          tipo: 4
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  ngOnDestroy() {
    this.dataSource = [];
  }
}
