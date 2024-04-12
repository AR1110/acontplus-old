import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-convert-modal',
  standalone: true,
  imports: [
    AppModule, CommonModule
  ],
  templateUrl: './order-convert-modal.component.html',
  styles: ``
})
export class OrderConvertModalComponent {
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService)
  private tS = inject(ToasterService);
  @Input() data = {}

  fbConvertDoc = this.fb.group({
    code: ['', Validators.required]
  })

  tipoDocumento = [
    { 'code': 'FV', 'name': 'Factura' },
    { 'code': 'NE', 'name': 'Nota de Entrega' },
  ]

  convert() {
    const data = {
      ...this.fbConvertDoc.value,
      ...this.data,
    }

    showLoader();
    this.orderService.convert({ data: data }).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          console.log("==============response======================")
          console.log(response)

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

  closeModal() {
    this.modalRef.close();
  }
}
