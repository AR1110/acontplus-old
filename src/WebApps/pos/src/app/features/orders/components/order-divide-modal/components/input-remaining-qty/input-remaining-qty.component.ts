import { isValidField } from '@/shared/utils/utils';
import { OrderDivideItem } from '@/features/orders/models/order.interface';
import {Component, input, output, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-input-remaining-qty',
    imports: [
        FormsModule
    ],
    templateUrl: './input-remaining-qty.component.html'
})
export class InputRemainingQtyComponent {
  row = input.required<OrderDivideItem>()
  changeInputQuantity = output<any>()

  remainingQuantity =  signal(0);

  valueInput = signal(0);

  ngOnInit(){
    this.remainingQuantity.set(this.row().remainingQuantity || 0)
    this.valueInput.set(this.remainingQuantity())
  }

  onBlurInput($ev: any) {

    const numericValue = Number($ev.value);
        if (numericValue === this.remainingQuantity()) return;

        if (isValidField($ev) && !isNaN(numericValue) && numericValue !== 0) {

          this.valueInput.update(()=>numericValue)

          if (numericValue <= this.row().remainingQuantityReal) {
                this.remainingQuantity.set(numericValue);
                this.changeInputQuantity.emit({
                  uuid: this.row().uuid,
                  value: numericValue
                })
            } else {
            this.valueInput.update(()=>this.remainingQuantity())
            }
        } else {
          this.valueInput.update(()=>this.remainingQuantity())
        }
  }

}
