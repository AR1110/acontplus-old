
import { Order } from '@/features/orders/models/order.interface';
import { CompanyCustomerSearchComponent } from '@company-customers/components/company-customer-search/company-customer-search.component';
import { PosStoreService } from '@/features/pos/store/pos-store.service';
import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TableModalComponent } from '../table-modal/table-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { pricingCalculateUtil } from '@/shared/utils/princing-calculate.util';
import { DECIMALS } from '@/shared/enums/main.enum';
import { roundNumber } from '@/shared/utils/round-number.util';

@Component({
    selector: 'app-cart-header',
    imports: [
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        CompanyCustomerSearchComponent,
    ],
    templateUrl: './cart-header.component.html'
})
export class CartHeaderComponent {
  private posStoreSvc = inject(PosStoreService);
  public dialog = inject(Dialog)


  vendedores = computed(() => this.posStoreSvc.state().vendedores);
  tableDesc = computed(() => this.posStoreSvc.state().order.tableDesc ?? 'Seleccionar Mesa...')
  tarifas = computed(() => this.posStoreSvc.state().tarifas )

  order = computed(() => this.posStoreSvc.state().order)
  userId = computed(() => this.posStoreSvc.state().order?.userId)
  tarifaId = computed(() =>  this.posStoreSvc.state().tarifaId )

  onClickTable( ) {

    const dialogRef = this.dialog.open(TableModalComponent, {
      width: '100vw',
      height: '100vh',
   //   panelClass: 'full-screen-cdk-dialog',
    });
  }

  private updateOrder(partialOrder: Partial<Order>): void {
    this.posStoreSvc.state.update(state => ({
      ...state,
      order: {
        ...state.order,
        ...partialOrder
      }
    }));
  }


  onChangeVendedor(event: any): void {
    const userId = event.value;
    this.updateOrder({ userId });
  }

  onChangeTarifa(event:any){
    let tarifaId = Number(event.value) as any;

    this.posStoreSvc.setState({
      tarifaId
    })

    Swal.fire({
      icon: 'warning',
      html:  	`¿Estás seguro de aplicar esta tarifa en todo los items de detalle?`,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then(r=>{
      if(r.isConfirmed){
        let orderItems = this.posStoreSvc.state().orderItems.map(item=>{

          let dataTarifa = item.pvps.find(p=>p.idTarifa===tarifaId);
          let price = item.price;
          let precioConIva = item.precioConIva;
          if(dataTarifa){
            price = dataTarifa.precioVenta  ;
            precioConIva = dataTarifa.precioConIva  ;

          }

          let subtotalSinImpuesto = pricingCalculateUtil.calcularSubtotalSinImpuesto(price, item.quantity, item.discount);
          let taxValue = pricingCalculateUtil.calculateTaxValue(subtotalSinImpuesto, item.taxPercent);
          let total = pricingCalculateUtil.calcularTotalConImpuesto(subtotalSinImpuesto, item.taxValue);
          return {
            ...item,
            feeId: tarifaId,
            price,
            precioConIva,
            taxValue,
            precioTotalSinImpuesto: roundNumber(subtotalSinImpuesto, DECIMALS.GENERAL),
            total: roundNumber(total, DECIMALS.GENERAL)

          }
        })

        this.posStoreSvc.state.update(ps=>{
          return  {
            ...ps,
            orderItems
          }
        })
        console.log(this.posStoreSvc.state().orderItems)

      }else{
        this.posStoreSvc.setState({
          tarifaId: this.posStoreSvc.select("oldTarifaId")()
        })
      }
    })


  }

  onSelectCustomerCompany(event: any): void {
    const {
      razonSocialComprador: customerName, idCliente: customerCompanyId,
      codigoSri: tipoIdentificacionSri
    } = event;
    this.updateOrder({ customerName, customerCompanyId, tipoIdentificacionSri });
  }




}
