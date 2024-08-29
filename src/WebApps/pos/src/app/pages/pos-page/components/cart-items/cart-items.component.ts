import { PosStoreService } from '@/store/pos-store.service';
import { Component, computed, inject } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { DialogService } from "@/services/dialog.service";
import { CartInfoComponent } from "@/pages/pos-page/components/cart-info/cart-info.component";
import { Order, OrderItem } from '@/models/order.model';
import Swal from "sweetalert2";
import { playBeepSound, playClearSound } from "@core/utils/sound.util";
import { calculateCantidadStock, mergeStockQty } from '@/core/utils/product.util';
import { MainStoreService } from '@/store/main-store.service';
import { ProductService } from '@/services/external/product.service';
import { pricingCalculateUtil } from '@/core/utils/princing-calculate.util';
import { roundNumber } from '@/core/utils/round-number.util';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [
    CartComponent
  ],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.scss'
})
export class CartItemsComponent {
  private dialogSvc = inject(DialogService)
  private posStoreSvc = inject(PosStoreService);
  private mainStore = inject(MainStoreService)
  private productSvc = inject(ProductService)

  orderItems = computed(() => this.posStoreSvc.state().orderItems);
  isSelectedItem = computed(() => {
    return this.posStoreSvc.state().isSelectedItem
  });


  setIsSelectedItem(isSelectedItem: boolean) {
    this.posStoreSvc.state.update(e => ({
      ...e,
      isSelectedItem
    }))
  }



  onClickCartInfo($event: OrderItem) {
    let dialogRef = this.dialogSvc.open(CartInfoComponent,
      {
        size: 'md',
        data: {
          taxRates: Object.values(this.posStoreSvc.state().taxRates),
          data: structuredClone($event)
        },
        disableClose: true,

      })
    dialogRef.subscribe((result: OrderItem) => {
      if (result && typeof result === 'object') {
        this.posStoreSvc.state.update(e => {
          return {
            ...e,
            orderItems: e.orderItems.map(item => {
              if (item.uuid === $event.uuid) {
                return {
                  ...item,
                  ...result
                };
              }
              return item;
            })
          };
        });
      }
    })
  }

  private updateQty($event: OrderItem, change: number, isReplaceQty: boolean) {
    playBeepSound();
    this.posStoreSvc.state.update(state => {
      const updatedItems = state.orderItems.map(item => {
        if (item.uuid === $event.uuid) {
          item.quantity = isReplaceQty ? change : item.quantity + change;

          const subtotalSinImpuesto = pricingCalculateUtil.calcularSubtotalSinImpuesto(item.price, item.quantity, item.discount);
          item.taxValue = pricingCalculateUtil.calculateTaxValue(subtotalSinImpuesto, item.taxPercent);
          item.precioTotalSinImpuesto = roundNumber(subtotalSinImpuesto, 5);
          item.total = roundNumber(pricingCalculateUtil.calcularTotalConImpuesto(subtotalSinImpuesto, item.taxValue), 5);

          return { ...item };
        }
        return item;
      });

      return { ...state, orderItems: updatedItems };
    });
  }

  onClickDecreaseQty($event: OrderItem) {
    this.updateQty($event, -1, false);
  }

  private validateStock($event: OrderItem, cloneOrderItems: OrderItem[], changeQty: number, isReplaceQty: boolean) {
    const dataMergeStockQty = mergeStockQty(cloneOrderItems, {
      idArticulo: $event.productId,
      idBodega: $event.bodegaId
    });

    const cantidad = calculateCantidadStock({
      cantidadStock: dataMergeStockQty.cantidadStock,
      idBodega: $event.bodegaId,
      fechaEmision: this.posStoreSvc.state().order.createdAt,
      productoConsolidaciones: $event.consolidacionesFecha
    });

    const paramsStock = {
      idArticulo: $event.productId,
      idBodega: $event.bodegaId,
      cantidad
    };

    this.setIsSelectedItem(true);
    this.productSvc.checkNotificationStock(paramsStock).subscribe({
      next: async response => {
        this.setIsSelectedItem(false);
        if (response.code === "1" || (response.code === "2" && await this.confirmStockUpdate(response))) {
          this.updateQty($event, changeQty, isReplaceQty);
        }
      },
      error: () => {
        this.setIsSelectedItem(false);
      }
    });
  }

  private async confirmStockUpdate(response: any) {
    let { isConfirmed } = await Swal.fire({
      title: `<small>${response.titleSms}</small>`,
      icon: 'warning',
      html: `<small>${response.message}</small>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
    return isConfirmed;
  }

  onClickIncreaseQty($event: OrderItem) {
    if (!$event.llevaInventario) {
      this.updateQty($event, 1, false);
      return;
    }

    const cloneOrderItems = this.orderItems().map(item =>
      item.uuid === $event.uuid ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.validateStock($event, cloneOrderItems, 1, false);
  }

  changeInputQty<T extends { isIncreaseQty: boolean, orderItem: OrderItem }>($event: T) {
    const { isIncreaseQty, orderItem } = $event;

    if (!orderItem.llevaInventario || !isIncreaseQty) {
      this.updateQty(orderItem, orderItem.quantity, true);
      return;
    }

    const cloneOrderItems = this.orderItems().map(item =>
      item.uuid === orderItem.uuid ? { ...item, quantity: orderItem.quantity } : item
    );

    this.validateStock(orderItem, cloneOrderItems, orderItem.quantity, true);
  }



  async onClickRemove($event: OrderItem) {
    let { isConfirmed } = await Swal.fire({
      text: "¿Estas seguro de quitar este item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí!",
      cancelButtonText: 'No!'
    })

    if (isConfirmed) {
      let index = this.orderItems().findIndex(i => i.uuid === $event.uuid);
      if (index !== -1) {
        this.posStoreSvc.state.update(e => {
          const newOrderItems = structuredClone(this.orderItems());
          newOrderItems.splice(index, 1);
          return {
            ...e,
            orderItems: newOrderItems
          };
        });
      }

      playClearSound()


    }

  }

}
