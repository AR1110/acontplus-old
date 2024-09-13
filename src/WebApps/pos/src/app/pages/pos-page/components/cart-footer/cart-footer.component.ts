import { PaymentComponent } from '@/core/components/payment/payment.component';
import { OrderAdapter } from '@/adapters/order.adapter';
import { plus } from '@/core/utils/decimal.util';
import { roundNumber } from '@/core/utils/round-number.util';
import { playClearSound } from '@/core/utils/sound.util';
import { consumirFinalSuperaElValorPermitido, getValidId, messageSuperaElValorTotalPermitido } from '@/core/utils/utils';
import { DECIMALS, DOC_TYPE } from '@/enums/main.enum';
import { DialogService } from '@/services/dialog.service';
import { OrderService } from '@/services/order.service';
import { SharedService } from '@/services/shared.service';
import { ToasterService } from '@/services/toaster.service';
import { orderInitialState, PosStoreService } from '@/store/pos-store.service';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@/directives/to-upper-case.directive';
import { generateUuidv4 } from '@/core/utils/generate-uuidv4';
import { TableModalComponent } from '../table-modal/table-modal.component';
import { Dialog } from '@angular/cdk/dialog';

const messageSave: { [key: string]: string } = {
  [DOC_TYPE.FV]: `
    Esta seguro de guardar el pedido como Factura? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
  [DOC_TYPE.NE]: `
    Esta seguro de guardar el pedido como Nota de Entrega? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
  [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
    <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`
}

@Component({
  selector: 'app-cart-footer',
  standalone: true,
  imports: [
    FormsModule,
    ToUpperCaseDirective
  ],
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss'
})
export class CartFooterComponent {
  private posStore = inject(PosStoreService);
  private tS = inject(ToasterService);
  private orderAdapter = inject(OrderAdapter);
  private orderSvc = inject(OrderService);
  private sharedSvc = inject(SharedService);
  private dialogSvc = inject(DialogService)
  public dialog = inject(Dialog)

  private subtotalSinImpuestos = 0;
  private tax = 0;
  private discount = 0;
  private total = 0;

  obs = computed(() => this.posStore.state().order?.obs)
  orderId = computed(() => this.posStore.state().order?.orderId)

  htmlContentTotals = computed(() => {
    let dataTotals = this.calculateTotals();

    let drawTotalsHtml = `
        ${dataTotals.htmlSubtotalImpuesto}
    `
    if (dataTotals.totalDescuento > 0) {
      drawTotalsHtml += `${dataTotals.htmlDiscount}`
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

  })


  private calculateTotals() {
    const { orderItems, taxRates } = this.posStore.state();

    let sumTotalIva = 0;
    const totalPrecioTotalSinImpuesto = orderItems.reduce((acc, item) => {
      acc = plus(acc, roundNumber(item.precioTotalSinImpuesto), DECIMALS.CINCO)
      return acc;
    }, 0)

    const totalDescuento = orderItems.reduce((acc, item) =>
      plus(acc, item.discount, DECIMALS.CINCO), 0);

    // Calcular totales específicos por tarifa de impuesto y generar HTML
    const htmlIvaTotal = Object.values(taxRates)
      .filter(tarifa => tarifa.porcentaje > 0)
      .map(tarifa => {
        const totalIva = orderItems
          .filter(item => item.taxPercentId === tarifa.idTarifaImpuesto)
          .reduce((acc, item) => plus(acc, roundNumber(item.taxValue), DECIMALS.DOS), 0);

        sumTotalIva += totalIva;

        return totalIva > 0 ? `
        <div class="d-flex justify-content-between">
          <div class="flex-fill">
            <small class="text-muted">${tarifa.descripcion}</small>
          </div>
          <div>
            <small class="text-muted">$${roundNumber(totalIva, 2)}</small>
          </div>
        </div>` : '';
      })
      .join('');

    const importeTotal = totalPrecioTotalSinImpuesto + sumTotalIva;

    const htmlSubtotalImpuesto = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <small class="text-muted">Subtotal:</small>
      </div>
      <div>
        <small class="text-muted">$${roundNumber(totalPrecioTotalSinImpuesto)}</small>
      </div>
    </div>`;

    const htmlDiscount = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <small class="text-danger">Desc:</small>
      </div>
      <div>
        <small class="text-danger">$${roundNumber(totalDescuento)}</small>
      </div>
    </div>`;

    const htmlTotal = `
    <div class="d-flex justify-content-between">
      <div class="flex-fill">
        <span class="fw-semibold">Total:</span>
      </div>
      <div>
        <span class="fw-semibold">$${roundNumber(importeTotal)}</span>
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
    this.posStore.state.update(e => {
      let dataOrder = {
        ...e.order,
        obs: $event.target.value
      }
      return {
        ...e,
        order: dataOrder
      }
    })
  }

  clean() {
    this.posStore.state.update(e => {
      let order = structuredClone(e.order);
      order.tableId = 0;
      order.obs = null;
      order.customerName = orderInitialState().customerName;
      order.customerCompanyId = 0;
      order.orderId = 0;
      order.tableDesc = null;
      order.uuid = generateUuidv4()
      return {
        ...e,
        order: order,
        orderItems: []
      }
    })
    playClearSound()
  }

  saveOrder() {
    this.save(DOC_TYPE.OR)
  }

  saveInvoice() {
    this.save(DOC_TYPE.FV)
  }

  saveNotaEntrega() {
    this.save(DOC_TYPE.NE)
  }


  openTableModal() {
    // this.dialogSvc.open(TableModalComponent, {
    //   size: 'md'
    // })
    this.dialog.open(TableModalComponent, {
      width: '600px',
      height: '80vh',
      panelClass: 'full-screen-cdk-dialog',
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
          message: `Seleccione la Mesa`
        })
        this.openTableModal()
        return
      }

      if (!(order.puntoEmisionId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `No se ha seleccionado el Punto de Emisión`
        })
        return
      }
      if (!(order.establecimientoId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `No se ha seleccionado el Establecimiento`
        })
        return
      }
      if (orderItems.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: `Agregue al menos un Item`
        })
        return
      }
      if (orderItems.some(i => !getValidId(i.quantity))) {
        this.tS.toastr({
          type: 'warning',
          message: 'La cantidad de todos los items debe ser mayor a 0.'
        })
        return
      }

      if (orderItems.some(i => !getValidId(i.bodegaId))) {
        this.tS.toastr({
          type: 'warning',
          message: `bodegaId is undefined`
        })
        return
      }

      if (orderItems.some(i => !getValidId(i.taxId))) {
        this.tS.toastr({
          type: 'warning',
          message: `taxId is undefined`
        })
        return
      }
      if (orderItems.some(i => !getValidId(i.taxPercentId))) {
        this.tS.toastr({
          type: 'warning',
          message: `taxPercentId is undefined`
        })
        return
      }


      if ((order.subtotalSinImpuestos <= 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `subtotalSinImpuestos no tiene que ser 0`
        })
        return
      }

      if ((order.total <= 0)) {
        this.tS.toastr({
          type: 'warning',
          message: `total no tiene que ser 0`
        })
        return
      }

      if (codDoc === DOC_TYPE.FV && consumirFinalSuperaElValorPermitido(order.tipoIdentificacionSri, order.total)) {
        this.tS.toastr({
          type: 'warning',
          message: messageSuperaElValorTotalPermitido
        })
        return
      }


      const { isConfirmed } = await Swal.fire({
        title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
        html: messageSave[codDoc],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
        cancelButtonText: 'No, cancelar!'
      })

      if (!isConfirmed) return

      const orderResult = this.orderAdapter.orderTo(order);
      const itemsResult = this.orderAdapter.itemsTo(orderItems)
      const taxesResult = this.orderAdapter.taxesTo(orderItems);


      const data = {
        ...orderResult,
        updateOrder: (order.orderId > 0) && codDoc === DOC_TYPE.OR,
        saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
        codDoc,
        quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
        items: itemsResult,
        taxes: taxesResult
      }
      if (order.orderId > 0) {
        // showLoader();
        this.orderSvc.put(order.orderId, data).subscribe({
          next: response => {
            if (response.code === "0") {
              Swal.fire({
                icon: 'warning',
                html: response.message
              })
            }
            if (response.code === "1") {
              Swal.fire({
                icon: 'success',
                html: response.message,
                timer: 1000
              })
              this.clean();

            }
          },
          error: err => {
            console.error('Error en la solicitud:', err);
          }
        })
      } else {

        this.orderSvc.post(data).subscribe({
          next: response => {
            // Manejo de respuesta con código "0"
            if (response.code === "0") {
              Swal.fire({
                icon: 'warning',
                html: response.message,
              });
              return;
            }

            // Manejo de respuesta con código "1"
            if (response.code === "1") {
              Swal.fire({
                icon: 'success',
                html: response.message,
                timer: 1000,
              });

              // Se ha guardado como orden
              if (codDoc === DOC_TYPE.OR) {
                const orderId = response.payload as number;
                this.sharedSvc.getPrinterOrder(orderId);
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

                  modalRef.subscribe(result => {
                    if (result && typeof result === 'object') {
                      if (dataSave.printerAutomatic) {
                        this.sharedSvc.printerDoc(dataSave, codDoc);
                      }
                    }
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
          },
          error: err => {
            // Manejo de errores
            console.error('Error en la solicitud:', err);
          },
        });



      }
    } catch (error) {
      console.log(error)
    }
  }

}
