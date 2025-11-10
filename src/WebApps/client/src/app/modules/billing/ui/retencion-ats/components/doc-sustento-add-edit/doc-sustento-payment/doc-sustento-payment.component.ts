import { Component, inject, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormaPago } from '@sri/domain/models/forma-pago';
import { Button } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DocSustentoPaymentUseCase } from '@billing/domain/use-cases/retencion-ats/doc-sustento-payment.use-case';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doc-sustento-payment',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatSelectModule, Button],
  templateUrl: './doc-sustento-payment.component.html',
  styles: ``,
})
export class DocSustentoPaymentComponent {
  indexDoc = input.required<number>();
  indexPayment = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  paymentGroup = input.required<any>();
  formasPago = input.required<FormaPago[]>();

  private readonly _docSustentoPaymentUseCase = inject(DocSustentoPaymentUseCase);
  private readonly _tS = inject(ToastrNotificationService);

  async removePayment() {
    const payments = this.docSustentoArray().at(this.indexDoc()).get('payments') as FormArray;

    const paymentSelected = payments.controls[this.indexPayment()].value;

    if (paymentSelected.idRetencionAtsPago > 0) {
      const { isConfirmed } = await Swal.fire({
        title: 'Eliminar Pago',
        icon: 'warning',
        text: `Esta seguro(a) de eliminar este pago, de manera permanente?`,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });
      if (isConfirmed) {
        this._docSustentoPaymentUseCase
          .delete(paymentSelected.idRetencionAtsPago)
          .subscribe((response) => {
            this._tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.removeByIndex();
            }
          });
      }
    } else {
      await this.removeByIndex();
    }
  }

  async removeByIndex() {
    const payments = this.docSustentoArray().at(this.indexDoc()).get('payments') as FormArray;

    if (this.indexPayment() >= 0 && this.indexPayment() < payments.length) {
      payments.removeAt(this.indexPayment());
    }
  }

  onSave() {
    const payments = this.docSustentoArray().at(this.indexDoc()).get('payments') as FormArray;

    const paymentSelected = payments.controls[this.indexPayment()].value;

    if (paymentSelected.idRetencionAtsPago > 0) {
      this._docSustentoPaymentUseCase
        .update(paymentSelected.idRetencionAtsPago, paymentSelected)
        .subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
        });
    } else {
      this._docSustentoPaymentUseCase.create(paymentSelected).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
      });
    }
  }
}
