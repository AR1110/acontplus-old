import {
  Component,
  computed,
  inject,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { PromotionMenuService } from '@data/repositories/promotion-menu/promotion-menu.service';
import { ItemRead } from '@domain/models/item.model';
import { PosStoreService } from '@ui/store/pos-store.service';
import { MainStoreService } from '@domain/services/main-store.service';
import { map, of, switchMap } from 'rxjs';
import { pricingCalculateUtil } from '@domain/utils/princing-calculate.util';
import { roundNumber } from '@domain/utils/round-number.util';
import { DECIMALS } from '@domain/enums/main.enum';
import {
  calculateCantidadStock,
  mergeStockQty,
} from '@domain/utils/product.util';
import { ToasterService } from '@domain/services/toaster.service';
import { playBeepSound } from '@domain/utils/sound.util';
import Swal from 'sweetalert2';
import { OrderItem } from '@domain/models/order.model';
import { TarifaProducto } from '@domain/models/inventory/tarifa.model';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { GetSaleProductUseCase } from '@/domain/use-cases/product/get-sale-product.use-case';
import {CheckStockProductUseCase} from "@domain/use-cases/product/check-stock-product.use-case";

@Component({
  selector: 'app-promotions-item',
  imports: [ProductCardComponent],
  templateUrl: './promotions-item.component.html',
  styleUrl: './promotions-item.component.scss',
})
export class PromotionsItemComponent implements OnInit {
  promotionId = input(0);
  private promotionItemSvc = inject(PromotionMenuService);
  private posStoreSvc = inject(PosStoreService);
  private mainStore = inject(MainStoreService);
  private tS = inject(ToasterService);
  private $getSaleProductUsecase = inject(GetSaleProductUseCase);
  protected $checkStockUseCase = inject(CheckStockProductUseCase)

  isSelectedItem = computed(() => this.posStoreSvc.state().isSelectedItem);
  uniqueItemSelected = signal<string | null>(null);
  items = signal<ItemRead[]>([]);

  setIsSelectedItem(isSelectedItem: boolean) {
    this.posStoreSvc.state.update((e) => ({
      ...e,
      isSelectedItem,
    }));
  }

  private getPromotionsMenu() {
    this.promotionItemSvc
      .getByPromotionId({
        promotionId: this.promotionId(),
      })
      .subscribe((response) => {
        this.items.set(response.items);
      });
  }

  ngOnInit(): void {
    this.getPromotionsMenu();
  }

  private getDataItem($event: ItemRead) {
    return this.$getSaleProductUsecase
      .execute({
        productId: $event.productId,
        bodegaId: this.mainStore.state().bodegaId,
      })
      .pipe(
        switchMap((firstResponse) => {
          let dataAdded = this.posStoreSvc.addRow(),
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

          dataAdded.bodegaId = this.mainStore.state().bodegaId;
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
                idBodega: this.mainStore.state().bodegaId,
              }
            );

            const paramsStock = {
              idArticulo: firstResponse.product.idArticulo,
              idBodega: this.mainStore.state().bodegaId,
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
