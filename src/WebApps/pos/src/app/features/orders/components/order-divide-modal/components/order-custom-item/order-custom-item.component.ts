import { Component, inject, model, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { ProductSearchComponent } from "@/shared/components/product-search/product-search.component";
import {
  CustomContainerDialogComponent
} from '@/shared/components/custom-container-dialog/custom-container-dialog.component';

import { ProductService } from '@/shared/services/product/product.service';
import { ToasterService } from "@/shared/services/toaster.service";
import { ToUpperCaseDirective } from '@/shared/directives/to-upper-case.directive';

import { getValidId, isValidField } from '@/shared/utils/utils';
import { roundNumber } from '@/shared/utils/round-number.util';
import { pricingCalculateUtil } from '@/shared/utils/princing-calculate.util';
import { generateUuidv4 } from '@/shared/utils/generate-uuidv4';

import { DECIMALS, DOC_TYPE, ITEM_TYPE_CODE } from '@/shared/enums/main.enum';
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { OrderAdapter } from "@/features/orders/adapters/order.adapter";
import { OrderService } from "@/features/orders/services/order.service";
import { DialogService } from '@/shared/services/dialog.service';
import { PaymentComponent } from '@/shared/components/payment/payment.component';
import { OrderData, OrderDivideItem, OrderItem } from '@/features/orders/models/order.interface';

type Props = {
  dataForm: any,
  orderData: OrderData,
  selectedRows: OrderDivideItem[]
}

@Component({
  selector: 'app-order-custom-item',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CustomContainerDialogComponent,
    ProductSearchComponent,
    ToUpperCaseDirective
  ],
  templateUrl: './order-custom-item.component.html',
  styleUrl: './order-custom-item.component.scss'
})
export class OrderCustomItemComponent {
  readonly dialogRef = inject(MatDialogRef<OrderCustomItemComponent>);
  readonly matDialogData = inject<Props>(MAT_DIALOG_DATA);

  private productSvc = inject(ProductService);
  private tS = inject(ToasterService);
  private orderAdapter = inject(OrderAdapter)
  private orderSvc = inject(OrderService)
  private dialogSvc = inject(DialogService)

  orderItemCustom = signal({
    quantity: 1,
    price: 0,
    precioConIva: 0,

  } as OrderItem);

  descriptionCustom = model('');

  importeTotal = this.matDialogData.orderData.order.total;



  onSelectProduct<T extends { idArticulo: number }>({ idArticulo }: T) {
    try {
      if (!getValidId(idArticulo)) return;


      this.productSvc.getForSale(idArticulo).subscribe(response => {
        const { product, medidas } = response;
        if (product.llevaInventario) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione un articulo de tipo servicio!'
          })
          return
        }
        const dataMedida = medidas.find(m => m.idMedida === product.idMedida);
        if (!dataMedida) {
          throw new Error(`dataMedida: ${dataMedida}`)
        }

        const { dataForm, orderData } = this.matDialogData;
        const { idTarifaImpuesto, codImpuesto, porcentaje, codigo } = dataForm.taxRates[product.codigoPorcentaje];
        const taxId = dataForm.taxes[codImpuesto].idImpuesto
        const dataTarifa = dataMedida.pvps.find(t => t.default)

        const totalIncluidoIva = this.matDialogData.orderData.order.total;
        const price = pricingCalculateUtil.calculatePriceSale(totalIncluidoIva, porcentaje);
        const taxValue = totalIncluidoIva - price;

        this.orderItemCustom.set({
          uuid: generateUuidv4(),
          itemTypeCode: ITEM_TYPE_CODE.ITEM,
          id: 0,
          itemId: 0,
          menuId: 0,
          taxId,
          taxPercentId: idTarifaImpuesto,
          feeId: dataTarifa?.idTarifa || 0,
          taxValue: roundNumber(taxValue, DECIMALS.CINCO),
          quantity: 1,
          cost: dataMedida.precioCosto,
          price,
          discount: this.matDialogData.orderData.order.discount,
          total: totalIncluidoIva,
          obs: "",
          bodegaId: orderData.order.items[0]?.bodegaId || 0,
          medidaId: dataMedida?.idMedida || 0,
          medida: '',

          codigoTarifaImpuesto: codigo,
          taxPercent: porcentaje,
          //Campos adicionales
          productId: product.idArticulo,
          code: product.codigoArticulo,
          precioConIva: totalIncluidoIva,
          precioTotalSinImpuesto: price,
          descripcion: product.descripcion,
          medidas,
          pvps: [],
          llevaInventario: false,
          consolidacionesFecha: [],
          costoFraccionado: dataMedida.precioCostoFraccionado,
          conversion: dataMedida.conversion,
          itemTypeId: 0
        })

        this.descriptionCustom.set(product.descripcion)

      })
    } catch (error) {
      console.log(error)
    }
  }

  async saveInvoice() {
    try {
      const { orderData } = structuredClone(this.matDialogData);
      const { order } = orderData;

      const data = {
        ...order,
        subtotalSinImpuestos: roundNumber(this.orderItemCustom().price),
        discount: this.orderItemCustom().discount,
        tax: 0, //remover mas adelante
        total: this.importeTotal,
      }


      if (!(order.customerCompanyId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el cliente'
        })
        return
      }

      if (!getValidId(this.orderItemCustom().productId)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el artículo de tipo servicio'
        })
        return
      }
      if (!isValidField(this.descriptionCustom())) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese una descripción personalizada!'
        })
        return
      }

      if (!(data.subtotalSinImpuestos > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: '¡El subtotal sin impuestos no puede ser 0!'
        });
        return;
      }

      if (!(data.total > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: '¡El total no puede ser 0!'
        });
        return;
      }


      const { isConfirmed } = await Swal.fire({
        title: `Guardar`,
        html: `Esta seguro de guardar como Factura? </br>
                <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'No, cancelar!'
      })

      if (!isConfirmed) return

      let orderItems = [
        {
          ...this.orderItemCustom(),
          descripcion: this.descriptionCustom()
        }
      ]

      const orderResult = this.orderAdapter.toApiOrder(data);
      const customDetail = this.orderAdapter.toApiItems(orderItems)
      const taxes = this.orderAdapter.toApiTaxes(orderItems)

      const objData = {
        ...orderResult,
        updateOrder: false,
        saveDoc: true,
        codDoc: DOC_TYPE.FV,
        quickSale: true,
        items: [],
        customDetail,
        taxes
      }

      let params = this.orderAdapter.toApiParams(objData);

      this.orderSvc.fetchPutData(orderResult.orderId, params).subscribe( response => {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })


            // Se ha guardado la orden + el documento (Nota Entrega, Factura)
            if (Array.isArray(response.payload)) {
              const dataSave = response.payload[0] as any;

              // Si el pago es automático
              if (dataSave.payAutomatic) {
                const modalRef = this.dialogSvc.open(PaymentComponent, {
                  size: 'xl',
                  data: {
                    data: structuredClone(dataSave),
                    codDoc: DOC_TYPE.FV,
                  },
                });

                modalRef.subscribe(result => {
                  this.dialogRef.close({
                    isReload: true
                  })
                });

                return;
              }
            }

            this.dialogRef.close({
              isReload: true
            })
          }
        } )
    } catch (error) {
      console.log(error)
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
