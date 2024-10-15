import { pricingCalculateUtil } from '@/core/utils/princing-calculate.util';
import { calculateCantidadStock, mergeStockQty } from '@/core/utils/product.util';
import { roundNumber } from '@/core/utils/round-number.util';
import { playBeepSound } from '@/core/utils/sound.util';
import { DECIMALS } from '@/enums/main.enum';
import { OrderItem } from '@/features/orders/models/order.interface';
import { ItemRead } from '@/models/item.model';
import { ProductService } from "@/services/external/product.service";
import { ToasterService } from "@/services/toaster.service";
import { MainStoreService } from "@/store/main-store.service";
import { PosStoreService } from '@/store/pos-store.service';
import { Component, computed, inject, input, signal } from '@angular/core';
import { generateUuidv4 } from "@core/utils/generate-uuidv4";
import { map, of, switchMap } from "rxjs";
import Swal from 'sweetalert2';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    ItemCardComponent
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {
  private tS = inject(ToasterService)
  private posStoreSvc = inject(PosStoreService);
  private productSvc = inject(ProductService)
  private mainStore = inject(MainStoreService)


  items = input<ItemRead[]>([]);

  isSelectedItem = computed(() => this.posStoreSvc.state().isSelectedItem);
  uniqueItemSelected = signal<string | null>(null)


  setIsSelectedItem(isSelectedItem: boolean) {
    this.posStoreSvc.state.update(e => ({
      ...e,
      isSelectedItem
    }))
  }

  private addRow() {
    let data: OrderItem = {
      uuid: generateUuidv4(),
      itemTypeCode: '',
      id: 0,
      menuId: 0,
      itemId: 0,
      taxId: 0,
      taxPercentId: 0,
      feeId: 0,
      taxValue: 0,
      quantity: 0,
      cost: 0,
      price: 0,
      discount: 0,
      total: 0,
      bodegaId: 0,
      medidaId: 0,
      codigoTarifaImpuesto: '',
      taxPercent: 0,
      productId: 0,
      code: '',
      precioConIva: 0,
      precioTotalSinImpuesto: 0,
      medida: '',
      descripcion: '',
      llevaInventario: false,
      medidas: [],
      pvps: [],
      consolidacionesFecha: [],
      costoFraccionado: 0,
      conversion: 1,
    }
    return data;
  }

  private getDataItem($event: ItemRead) {
    return this.productSvc.getForSale($event.productId, this.mainStore.state().bodegaId).pipe(
      switchMap((firstResponse) => {
        let dataAdded = this.addRow(), isAdd = false;
        let findIndexById = this.posStoreSvc.state().orderItems.findIndex(item => {
          return item.llevaInventario && item.productId === firstResponse.product.idArticulo;
        });

        if (findIndexById === -1) {
          dataAdded.quantity = 1;
          isAdd = true;
        } else {
          dataAdded = this.posStoreSvc.state().orderItems[findIndexById];
          dataAdded.quantity += 1;
        }

        let dataMedida = firstResponse.medidas.find(medida => medida.defaultMedida);

        dataAdded.itemId = $event.id;
        dataAdded.itemTypeCode = $event.itemTypeCode;
        // Asignaciones
        dataAdded.img = $event.img;
        dataAdded.productId = firstResponse.product.idArticulo;
        dataAdded.code = firstResponse.product.codigoArticulo;
        dataAdded.descripcion = firstResponse.product.descripcion;

        let tarifaImpuesto = this.posStoreSvc.state().taxRates[firstResponse.product.codigoPorcentaje];
        dataAdded.taxId = tarifaImpuesto.idImpuesto;
        dataAdded.taxPercentId = tarifaImpuesto.idTarifaImpuesto;
        dataAdded.taxPercent = tarifaImpuesto.porcentaje;

        dataAdded.bodegaId = this.mainStore.state().bodegaId;
        dataAdded.llevaInventario = firstResponse.product.llevaInventario;
        dataAdded.medidas = firstResponse.medidas;
        dataAdded.medidaId = dataMedida?.idMedida ?? 0; // Medida por defecto
        dataAdded.conversion = dataMedida?.conversion ?? 0;
        dataAdded.pvps = dataMedida?.pvps ?? [];
        dataAdded.consolidacionesFecha = firstResponse.productoConsolidaciones;


        const dataTarifa = dataMedida?.pvps.find(pvp => (pvp.default));
        dataAdded.conversion = dataMedida?.conversion ?? 1;
        dataAdded.cost = dataMedida?.precioCosto ?? 0;
        dataAdded.costoFraccionado = dataMedida?.precioCostoFraccionado ?? 0;
        dataAdded.feeId = dataTarifa?.idTarifa ?? 0;
        dataAdded.price = dataTarifa?.precioVenta ?? 0;
        dataAdded.precioConIva = dataTarifa?.precioConIva ?? 0;


        //totales
        let subtotalSinImpuesto = pricingCalculateUtil.calcularSubtotalSinImpuesto(dataAdded.price, dataAdded.quantity, dataAdded.discount);
        let taxValue = pricingCalculateUtil.calculateTaxValue(subtotalSinImpuesto, dataAdded.taxPercent);
        dataAdded.taxValue = roundNumber(taxValue, DECIMALS.CINCO)
        let total = pricingCalculateUtil.calcularTotalConImpuesto(subtotalSinImpuesto, dataAdded.taxValue);

        dataAdded.precioTotalSinImpuesto = roundNumber(subtotalSinImpuesto, DECIMALS.CINCO)
        dataAdded.total = roundNumber(total, DECIMALS.CINCO);

        if (firstResponse.product.llevaInventario) {
          let dataMergeStockQty = mergeStockQty([structuredClone(dataAdded)], {
            idArticulo: firstResponse.product.idArticulo,
            idBodega: this.mainStore.state().bodegaId
          });

          let paramsStock = {
            idArticulo: firstResponse.product.idArticulo,
            idBodega: this.mainStore.state().bodegaId,
            cantidad: calculateCantidadStock({
              cantidadStock: dataMergeStockQty.cantidadStock,
              idBodega: dataAdded.bodegaId,
              fechaEmision: this.posStoreSvc.state().order.createdAt,
              productoConsolidaciones: dataAdded.consolidacionesFecha
            })
          };

          return this.productSvc.checkNotificationStock(paramsStock).pipe(
            map(secondResponse => {
              return { dataAdded, secondResponse, isAdd }; // Retorna ambos valores
            })
          );
        } else {
          return of({
            dataAdded,
            secondResponse: null,
            isAdd
          }); // Si no lleva inventario, devuelve dataAdded y null como secondResponse
        }
      })
    )

  }

  private addItem(data: OrderItem) {
    this.posStoreSvc.state.update(e => {
      return {
        ...e,
        orderItems: [...e.orderItems, data]
      }
    })
    this.tS.toastr({
      type: 'success',
      message: 'Agregado Correctamente'
    })
  }

  private updateItem(data: OrderItem) {
    this.posStoreSvc.state.update(e => {
      return {
        ...e,
        orderItems: e.orderItems.map(item => {
          if (item.uuid === data.uuid) {
            return {
              ...item,
              ...data
            }
          } else {
            return item
          }
        })
      }
    })
  }

  // Función para manejar la confirmación del usuario y el código de respuesta
  private handleConfirmation(code: string, dataAdded: OrderItem, isAdd: boolean) {
    if (code === "0") {
      // Si el código es "0", restaura el valor anterior y realiza cálculos totales.
      // Aquí puedes añadir la lógica necesaria para restaurar el valor anterior.
    }
    if (code === "2") {
      if (isAdd) {
        this.addItem(dataAdded);
      } else {
        this.updateItem(dataAdded);
      }
      playBeepSound();
    }
  };

  onSelect($event: ItemRead) {
    if (this.isSelectedItem()) return
    this.setIsSelectedItem(true);
    this.uniqueItemSelected.set($event.uniqueItem);



    this.getDataItem($event).subscribe({
      next: async response => {

        try {
          this.uniqueItemSelected.set(null);
          this.setIsSelectedItem(false);

          const { dataAdded, isAdd } = response;

          if (!dataAdded.llevaInventario && isAdd) {
            playBeepSound();
            this.addItem(dataAdded);
            return;
          }

          const { code, message, titleSms } = response.secondResponse;


          // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
          if (code === "1") {
            if (isAdd) {
              this.addItem(dataAdded);
            } else {
              this.updateItem(dataAdded);
            }
            playBeepSound();
            return;
          }

          // Muestra un mensaje de advertencia y espera la confirmación del usuario.
          const { isConfirmed } = await Swal.fire({
            title: `<small>${titleSms}</small>`,
            icon: 'warning',
            html: `<small>${message}</small>`,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Según la confirmación, realiza acciones adicionales.
          if (isConfirmed) {
            this.handleConfirmation(code, dataAdded, isAdd);
          }

        } catch (err) {
          console.error('Error during item handling:', err);
          this.uniqueItemSelected.set(null);
          this.setIsSelectedItem(false);
        }
      },
      error: (err) => {
        console.error('Failed to get data item:', err);
        this.uniqueItemSelected.set(null);
        this.setIsSelectedItem(false);
      }
    });
  }


}
