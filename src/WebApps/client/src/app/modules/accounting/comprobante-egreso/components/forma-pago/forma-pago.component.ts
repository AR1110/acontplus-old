import {Component, computed, inject, model, signal} from '@angular/core';
import {
  CustomContainerDialogComponent
} from "@core/components/custom-container-dialog/custom-container-dialog.component";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {PaymentTypeCode} from "@accounting/enums/accounting.constants";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ComprobanteEgresoStore} from "@accounting/comprobante-egreso/comprobante-egreso.store";
import {FormsModule} from "@angular/forms";
import { ToasterService } from '@core/services/toaster.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-forma-pago',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        CustomContainerDialogComponent,
        FormsModule,
        NgxMaskDirective
    ],
    templateUrl: './forma-pago.component.html',
    providers: [provideNativeDateAdapter()],
    styles: ``
})
export class FormaPagoComponent {

  readonly dialogRef = inject(MatDialogRef<FormaPagoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private tS = inject(ToasterService)

  comprobanteEgresoStore = inject(ComprobanteEgresoStore)

  codigoEntidadFinanciera = signal<keyof typeof PaymentTypeCode>(PaymentTypeCode.EFE)

  valorAbono = model(this.comprobanteEgresoStore.saldo())

  esEfectivo = computed<boolean>(()=>{

    return true;
  })

  close(){
    this.dialogRef.close()
  }
}
