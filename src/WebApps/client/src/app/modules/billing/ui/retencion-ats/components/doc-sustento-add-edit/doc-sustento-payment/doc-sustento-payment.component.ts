import { Component, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormaPago } from '@sri/domain/models/forma-pago';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-doc-sustento-payment',
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatSelectModule,
    ThemeButtonComponent,
  ],
  templateUrl: './doc-sustento-payment.component.html',
  styles: ``,
})
export class DocSustentoPaymentComponent {
  indexDoc = input.required<number>();
  indexPayment = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  paymentGroup = input.required<any>();
  formasPago = input.required<FormaPago[]>();

  removePayment() {
    const taxesArray = this.docSustentoArray()
      .at(this.indexDoc())
      .get('payments') as FormArray;

    if (this.indexPayment() >= 0 && this.indexPayment() < taxesArray.length) {
      taxesArray.removeAt(this.indexPayment());
    }
  }
}
