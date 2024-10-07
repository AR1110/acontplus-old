import { generateUuidv4 } from '@/core/utils/generate-uuidv4';
import { InputNumberDirective } from '@/directives/input-number.directive';
import { OrderItem } from '@/models/order.model';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, model, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    InputNumberDirective
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  orderItem = input.required<OrderItem>();
  onClickCartInfo = output<any>();
  onClickRemove = output<any>();
  onClickDecreaseQty = output<any>()
  onClickIncreaseQty = output<any>();
  changeInputQty = output<any>();
  isSelectedItem = input(false)

  quantity = model(0);

  isEditing: boolean = false;

  @ViewChild('quantityInput') quantityInput!: ElementRef;

  editQuantity() {
    this.isEditing = true;
    this.quantity.set(this.orderItem().quantity)
    setTimeout(() => {
      if (this.quantityInput) {
        this.quantityInput.nativeElement.focus();
        this.quantityInput.nativeElement.select();
      }
    }, 100);
  }

  saveQuantity() {
    this.isEditing = false;
    let isIncreaseQty = false;
    let inputQty = parseFloat(this.quantity() as any);
    if (isNaN(inputQty)) return

    if (inputQty === this.orderItem().quantity) return

    if (inputQty > this.orderItem().quantity) {
      isIncreaseQty = true;
    }
    let cloneOrderItem = structuredClone(this.orderItem())

    this.changeInputQty.emit({
      isIncreaseQty,
      orderItem: {
        ...cloneOrderItem,
        quantity: inputQty
      }
    })
  }


}
