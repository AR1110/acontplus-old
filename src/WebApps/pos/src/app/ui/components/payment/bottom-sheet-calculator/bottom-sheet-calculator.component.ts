import {Component, inject, Inject} from '@angular/core';
import {PaymentCalculatorComponent} from "@ui/components/payment/payment-calculator/payment-calculator.component";

import {MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-bottom-sheet-calculator',
  imports: [
    PaymentCalculatorComponent,
    MatButton
  ],
  templateUrl: './bottom-sheet-calculator.component.html',
})
export class BottomSheetCalculatorComponent {
  readonly dialogRef = inject(MatDialogRef<BottomSheetCalculatorComponent>);


  calculate(value: string){
    this.dialogRef.close(value)
  }

}
