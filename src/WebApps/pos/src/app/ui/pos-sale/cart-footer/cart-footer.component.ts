import { PaymentComponent } from '@ui/components/payment/payment.component';
import { OrderMapper } from '@data/repositories/order/order.mapper';
import { plus } from '@domain/utils/decimal.util';
import { roundNumber } from '@domain/utils/round-number.util';
import { playClearSound } from '@domain/utils/sound.util';
import {
  consumirFinalSuperaElValorPermitido,
  getValidId,
  messageSuperaElValorTotalPermitido,
} from '@domain/utils/utils';
import { DECIMALS, DOC_TYPE } from '@domain/enums/main.enum';
import { DialogService } from '@domain/services/dialog.service';
import { SharedService } from '@domain/services/shared.service';
import { ToasterService } from '@domain/services/toaster.service';
import {
  orderInitialState,
  PosStoreService,
} from '@ui/store/pos-store.service';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@ui/directives/to-upper-case.directive';
import { generateUuidv4 } from '@domain/utils/generate-uuidv4';
import { TableModalComponent } from '@/ui/pos-sale/table-modal/table-modal.component';
import { MatInputModule } from '@angular/material/input';
import { OrderUseCase } from '@domain/use-cases/order.use-case';

const messageSave: { [key: string]: string } = {
  [DOC_TYPE.FV]: `
    Esta seguro de guardar el pedido como Factura? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
  [DOC_TYPE.NE]: `
    Esta seguro de guardar el pedido como Nota de Entrega? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
  [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
    <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`,
};

@Component({
  selector: 'app-cart-footer',
  imports: [FormsModule, MatInputModule, ToUpperCaseDirective],
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss',
})
export class CartFooterComponent {
  private posStore = inject(PosStoreService);
  private tS = inject(ToasterService);
  private _orderUseCase = inject(OrderUseCase);
  private sharedSvc = inject(SharedService);
  private dialogSvc = inject(DialogService);
  public dialog = inject(DialogService);

  private subtotalSinImpuestos = 0;
  private tax = 0;
  private discount = 0;
  private total = 0;

  obs = computed(() => this.posStore.state().order?.obs);
  orderId = computed(() => this.posStore.state().order?.orderId);

  htmlContentTotals = computed(() => {
    let dataTotals = this.calculateTotals();

    let drawTotalsHtml = `
        ${dataTotals.htmlSubtotalImpuesto}
    `;
    if (dataTotals.totalDescuento > 0) {
      drawTotalsHtml += `${dataTotals.htmlDiscount}`;
    }
    drawTotalsHtml += `
      ${dataTotals.htmlIvaTotal}
      ${dataTotals.htmlTotal}
    `;
    this.subtotalSinImpuestos = dataTotals.subTotalSinImpuestos;
    this.tax = dataTotals.tax;
    this.discount = dataTotals.totalDescuento;
    this.total = dataTotals.total;
    return drawTotalsHtml;
  });

  private calculateTotals() {
    const { orderItems, taxRates } = this.posStore.state();

    let sumTotalIva = 0;
    const totalPrecioTotalSinImpuesto = orderItems.reduce((acc, item) => {
      acc = plus(acc, roundNumber(item.precioTotalSinImpuesto), DECIMALS.CINCO);
      return acc;
    }, 0);

    const totalDescuento = orderItems.reduce(
      (acc, item) => plus(acc, item.discount, DECIMALS.CINCO),
      0
    );

    // Calcular totales específicos por tarifa de impuesto y generar HTML
    const htmlIvaTotal = Object.values(taxRates)
      .filter((tarifa) => tarifa.porcentaje > 0)
      .map((tarifa) => {
        const totalIva = orderItems
          .filter((item) => item.taxPercentId === tarifa.idTarifaImpuesto)
          .reduce(
            (acc, item) => plus(acc, roundNumber(item.taxValue), DECIMALS.DOS),
            0
          );

        sumTotalIva += totalIva;

        return totalIva > 0
          ? `
        <div class="d-flex justify-content-between">
          <div class="flex-fill">
            <small  >${tarifa.descripcion}</small>
          </div>
          <div>
            <small  " >$${roundNumber(totalIva, 2)}</small>
          </div>
        </div>`
          : '';
      })
      .join('');

    const importeTotal = totalPrecioTotalSinImpuesto + sumTotalIva;

    const htmlSubtotalImpuesto = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <small  >Subtotal:</small>
      </div>
      <div>
        <small  >$${roundNumber(totalPrecioTotalSinImpuesto)}</small>
      </div>
    </div>`;

    const htmlDiscount = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <span class="text-danger">Desc:</span>
      </div>
      <div>
        <span class="text-danger">$${roundNumber(totalDescuento)}</span>
      </div>
    </div>`;

    const htmlTotal = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <span class="importe-total">
        <b>Total: </b>
        </span>
      </div>
      <div class="importe-total">
        <span   >
        <b>$${roundNumber(importeTotal)}</b>
        </span>
      </div>
    </div>`;

    return {
      subTotalSinImpuestos: roundNumber(totalPrecioTotalSinImpuesto),
      totalDescuento: roundNumber(totalDescuento),
      htmlSubtotalImpuesto,
      htmlDiscount,
      htmlIvaTotal,
      htmlTotal,
      tax: roundNumber(sumTotalIva),
      total: roundNumber(importeTotal),
    };
  }

  onBlurObs($event: any) {
    this.posStore.state.update((e) => {
      let dataOrder = {
        ...e.order,
        obs: $event.target.value,
      };
      return {
        ...e,
        order: dataOrder,
      };
    });
  }

  clean() {
    this.posStore.state.update((e) => {
      let order = structuredClone(e.order);
      order.tableId = 0;
      order.obs = null;
      order.customerName = orderInitialState().customerName;
      order.customerCompanyId = 0;
      order.orderId = 0;
      order.tableDesc = null;
      order.uuid = generateUuidv4();
      return {
        ...e,
        order: order,
        orderItems: [],
      };
    });
    playClearSound();
  }

  saveOrder() {
    this.save(DOC_TYPE.OR);
  }

  saveInvoice() {
    this.save(DOC_TYPE.FV);
  }

  saveNotaEntrega() {
    this.save(DOC_TYPE.NE);
  }

  openTableModal() {
    // this.dialogSvc.open(TableModalComponent, {
    //   size: 'md'
    // })
    this.dialog.open(TableModalComponent, {
      size: 'xl',
    });
  }

  async save(codDoc: string) {
    try {
      const { orderItems } = this.posStore.state();
      let order = structuredClone(this.posStore.state().order);

      order.subtotalSinImpuestos = this.subtotalSinImpuestos;
      order.tax = this.tax;
      order.discount = this.discount;
      order.total = this.total;

      if (!(order.tableId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `Seleccione la Mesa`,
        });
        this.openTableModal();
        return;
      }

      if (!(order.puntoEmisionId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `No se ha seleccionado el Punto de Emisión`,
        });
        return;
      }
      if (!(order.establecimientoId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `No se ha seleccionado el Establecimiento`,
        });
        return;
      }
      if (orderItems.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: `Agregue al menos un Item`,
        });
        return;
      }
      if (orderItems.some((i) => !getValidId(i.quantity))) {
        this.tS.toastr({
          type: 'warning',
          message: 'La cantidad de todos los items debe ser mayor a 0.',
        });
        return;
      }

      if (orderItems.some((i) => !getValidId(i.bodegaId))) {
        this.tS.toastr({
          type: 'warning',
          message: `bodegaId is undefined`,
        });
        return;
      }

      if (orderItems.some((i) => !getValidId(i.taxId))) {
        this.tS.toastr({
          type: 'warning',
          message: `taxId is undefined`,
        });
        return;
      }
      if (orderItems.some((i) => !getValidId(i.taxPercentId))) {
        this.tS.toastr({
          type: 'warning',
          message: `taxPercentId is undefined`,
        });
        return;
      }

      if (order.subtotalSinImpuestos <= 0) {
        this.tS.toastr({
          type: 'warning',
          message: `subtotalSinImpuestos no tiene que ser 0`,
        });
        return;
      }

      if (order.total <= 0) {
        this.tS.toastr({
          type: 'warning',
          message: `total no tiene que ser 0`,
        });
        return;
      }

      if (
        codDoc === DOC_TYPE.FV &&
        consumirFinalSuperaElValorPermitido(
          order.tipoIdentificacionSri,
          order.total
        )
      ) {
        this.tS.toastr({
          type: 'warning',
          message: messageSuperaElValorTotalPermitido,
        });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
        html: messageSave[codDoc],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
        cancelButtonText: 'No, cancelar!',
        didOpen() {},
      });

      if (!isConfirmed) return;

      const orderResult = OrderMapper.toApiOrder(order);
      const itemsResult = OrderMapper.toApiItems(orderItems);
      const taxesResult = OrderMapper.toApiTaxes(orderItems);

      const data = {
        ...orderResult,
        updateOrder: order.orderId > 0 && codDoc === DOC_TYPE.OR,
        saveDoc: codDoc === DOC_TYPE.FV || codDoc === DOC_TYPE.NE,
        codDoc,
        quickSale: codDoc === DOC_TYPE.FV || codDoc === DOC_TYPE.NE,
        items: itemsResult,
        taxes: taxesResult,
      };
      let params = OrderMapper.toApiParams(data);

      if (order.orderId > 0) {
        this._orderUseCase.put(order.orderId, params).subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: response.message,
            });
          }
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              html: response.message,
              timer: 1000,
            });
            this.clean();
          }
        });
      } else {
        this._orderUseCase.post(params).subscribe((response) => {
          // Manejo de respuesta con código "0"
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: response.message,
            });
            return;
          }

          // Manejo de respuesta con código "1"
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              html: response.message,
              timer: 1000,
            });

            // Se ha guardado como orden
            if (codDoc === DOC_TYPE.OR) {
              const orderId = response.payload as number;
              this.sharedSvc.createOrderPrint(orderId);
              this.clean();
              return;
            }

            // Se ha guardado la orden + el documento (Nota Entrega, Factura)
            if (Array.isArray(response.payload)) {
              const dataSave = response.payload[0] as any;
              // Si el pago es automático
              if (dataSave.payAutomatic) {
                const modalRef = this.dialogSvc.open(PaymentComponent, {
                  size: 'xl',
                  data: {
                    data: structuredClone(dataSave),
                    codDoc,
                  },
                });

                modalRef.subscribe((result) => {
                  // if (result && typeof result === 'object') {
                  if (dataSave.printerAutomatic) {
                    this.sharedSvc.printerDoc(dataSave, codDoc);
                  }
                  // }
                  this.clean();
                });
                return;
              }

              // Si la impresión es automática
              if (dataSave.printerAutomatic) {
                this.sharedSvc.printerDoc(dataSave, codDoc);
              }
              this.clean();
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
