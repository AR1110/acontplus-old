
import { DECIMALS } from '@/domain/enums/main.enum';
import { TarifaProducto } from '@/domain/models/inventory/tarifa.model';
import { ItemRead } from '@/domain/models/item.model';
import { OrderItem } from '@/domain/models/order.model';
import { ToasterService } from '@/domain/services/toaster.service';
import { generateUuidv4 } from '@/domain/utils/generate-uuidv4';
import { pricingCalculateUtil } from '@/domain/utils/princing-calculate.util';
import {
  mergeStockQty,
  calculateCantidadStock,
} from '@/domain/utils/product.util';
import { roundNumber } from '@/domain/utils/round-number.util';
import { playBeepSound } from '@/domain/utils/sound.util';
import { PosStoreService } from '@/ui/store/pos-store.service';
import { Component, computed, inject, input, signal } from '@angular/core';
import { switchMap, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductCardComponent } from '@ui/pos-sale/products/product-card/product-card.component';
import { GetSaleProductUseCase } from '@/domain/use-cases/product/get-sale-product.use-case';
import {CheckStockProductUseCase} from "@domain/use-cases/product/check-stock-product.use-case";
import {LayoutStore} from "@ui/store/layout.store";

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private tS = inject(ToasterService);
  private posStoreSvc = inject(PosStoreService);
  private $layoutStore = inject(LayoutStore)
  private $getSaleProductUsecase = inject(GetSaleProductUseCase);
  protected $checkStockUseCase = inject(CheckStockProductUseCase)

  products = input<ItemRead[]>([]);

  isSelectedItem = computed(() => this.posStoreSvc.state().isSelectedItem);
  uniqueItemSelected = signal<string | null>(null);

  private bodegaId = this.$layoutStore.bodegaId()

  setIsSelectedItem(isSelectedItem: boolean) {
    this.posStoreSvc.state.update((e) => ({
      ...e,
      isSelectedItem,
    }));
  }

  private addRow() {
    const data: OrderItem = {
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
    };
    return data;
  }

  private getDataItem($event: ItemRead) {
    return this.$getSaleProductUsecase
      .execute({
        productId: $event.productId,
        bodegaId: this.bodegaId,
      })
      .pipe(
        switchMap((firstResponse) => {
          let dataAdded = this.addRow(),
            isAdd = false;
          const findIndexById = this.posStoreSvc
            .state()
            .orderItems.findIndex((item) => {
              return (
                item.llevaInventario &&
                item.productId === firstResponse.product.idArticulo
              );
            });

          if (findIndexById === -1) {
            dataAdded.quantity = 1;
            isAdd = true;
          } else {
            dataAdded = this.posStoreSvc.state().orderItems[findIndexById];
            dataAdded.quantity += 1;
          }

          const dataMedida = firstResponse.medidas.find(
            (medida) => medida.defaultMedida
          );

          dataAdded.itemId = $event.id;
          dataAdded.itemTypeCode = $event.itemTypeCode;
          // Asignaciones
          dataAdded.img = $event.img;
          dataAdded.productId = firstResponse.product.idArticulo;
          dataAdded.code = firstResponse.product.codigoArticulo;
          dataAdded.descripcion = firstResponse.product.descripcion;

          const tarifaImpuesto =
            this.posStoreSvc.state().taxRates[
              firstResponse.product.codigoPorcentaje
            ];
          dataAdded.taxId = tarifaImpuesto.idImpuesto;
          dataAdded.taxPercentId = tarifaImpuesto.idTarifaImpuesto;
          dataAdded.taxPercent = tarifaImpuesto.porcentaje;

          dataAdded.bodegaId = this.bodegaId;
          dataAdded.llevaInventario = firstResponse.product.llevaInventario;
          dataAdded.medidas = firstResponse.medidas;
          dataAdded.medidaId = dataMedida?.idMedida ?? 0; // Medida por defecto
          dataAdded.conversion = dataMedida?.conversion ?? 0;
          dataAdded.pvps = dataMedida?.pvps ?? [];
          dataAdded.consolidacionesFecha =
            firstResponse.productoConsolidaciones;

          let dataTarifa = {} as TarifaProducto | undefined;
          if (this.posStoreSvc.state().tarifaId > 0) {
            dataTarifa = dataMedida?.pvps.find(
              (pvp) => pvp.idTarifa === this.posStoreSvc.state().tarifaId
            );
          } else {
            dataTarifa = dataMedida?.pvps.find((pvp) => pvp.default);
          }
          dataAdded.conversion = dataMedida?.conversion ?? 1;
          dataAdded.cost = dataMedida?.precioCosto ?? 0;
          dataAdded.costoFraccionado = dataMedida?.precioCostoFraccionado ?? 0;
          dataAdded.feeId = dataTarifa?.idTarifa ?? 0;
          dataAdded.price = dataTarifa?.precioVenta ?? 0;
          dataAdded.precioConIva = dataTarifa?.precioConIva ?? 0;

          //totales
          const subtotalSinImpuesto =
            pricingCalculateUtil.calcularSubtotalSinImpuesto(
              dataAdded.price,
              dataAdded.quantity,
              dataAdded.discount
            );
          const taxValue = pricingCalculateUtil.calculateTaxValue(
            subtotalSinImpuesto,
            dataAdded.taxPercent
          );
          dataAdded.taxValue = roundNumber(taxValue, DECIMALS.CINCO);
          const total = pricingCalculateUtil.calcularTotalConImpuesto(
            subtotalSinImpuesto,
            dataAdded.taxValue
          );

          dataAdded.precioTotalSinImpuesto = roundNumber(
            subtotalSinImpuesto,
            DECIMALS.CINCO
          );
          dataAdded.total = roundNumber(total, DECIMALS.CINCO);

          if (firstResponse.product.llevaInventario) {
            const dataMergeStockQty = mergeStockQty(
              [structuredClone(dataAdded)],
              {
                idArticulo: firstResponse.product.idArticulo,
                idBodega: this.bodegaId,
              }
            );

            const paramsStock = {
              idArticulo: firstResponse.product.idArticulo,
              idBodega: this.bodegaId,
              cantidad: calculateCantidadStock({
                cantidadStock: dataMergeStockQty.cantidadStock,
                idBodega: dataAdded.bodegaId,
                fechaEmision: this.posStoreSvc.state().order.createdAt,
                productoConsolidaciones: dataAdded.consolidacionesFecha,
              }),
            };

            return this.$checkStockUseCase.execute(paramsStock).pipe(
              map((secondResponse) => {
                return { dataAdded, secondResponse, isAdd }; // Retorna ambos valores
              })
            );
          } else {
            return of({
              dataAdded,
              secondResponse: null,
              isAdd,
            }); // Si no lleva inventario, devuelve dataAdded y null como secondResponse
          }
        })
      );
  }

  private addItem(data: OrderItem) {
    this.posStoreSvc.state.update((e) => {
      return {
        ...e,
        orderItems: [...e.orderItems, data],
      };
    });
    this.tS.toastr({
      type: 'success',
      message: 'Agregado Correctamente',
    });
  }

  private updateItem(data: OrderItem) {
    this.posStoreSvc.state.update((e) => {
      return {
        ...e,
        orderItems: e.orderItems.map((item) => {
          if (item.uuid === data.uuid) {
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        }),
      };
    });
  }

  // Función para manejar la confirmación del usuario y el código de respuesta
  private handleConfirmation(
    code: string,
    dataAdded: OrderItem,
    isAdd: boolean
  ) {
    if (code === '0') {
      // Si el código es "0", restaura el valor anterior y realiza cálculos totales.
      // Aquí puedes añadir la lógica necesaria para restaurar el valor anterior.
    }
    if (code === '2') {
      if (isAdd) {
        this.addItem(dataAdded);
      } else {
        this.updateItem(dataAdded);
      }
      playBeepSound();
    }
  }

  onSelect($event: ItemRead) {
    if (this.isSelectedItem()) return;
    this.setIsSelectedItem(true);
    this.uniqueItemSelected.set($event.uniqueItem);

    this.getDataItem($event).subscribe({
      next: async (response) => {
        try {
          this.uniqueItemSelected.set(null);
          this.setIsSelectedItem(false);

          const { dataAdded, isAdd } = response;

          if (!dataAdded.llevaInventario && isAdd) {
            playBeepSound();
            this.addItem(dataAdded);
            return;
          }

          const { code, message, titleSms } = response.secondResponse as any;

          // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
          if (code === '1') {
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
      },
    });
  }
}
