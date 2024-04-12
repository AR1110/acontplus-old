import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from '@core/components/product-search/product-search.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Tarifa } from '@modules/inventory/shared/models/tarifa.model';
import { DecimalSale } from '@modules/sale/shared/models/decimal-sale.model';
import { OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DrawTaxTotalComponent } from '@shared/components/draw-tax-total/draw-tax-total.component';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';

import { OrderMaintenanceDetailComponent } from './components/order-maintenance-detail/order-maintenance-detail.component';

@Component({
  selector: 'app-order-maintenance-modal',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbAccordionModule,
    OrderMaintenanceDetailComponent,
    DrawTaxTotalComponent,
    ProductSearchComponent,
    ReactiveFormsModule,
    TabulatorComponent,
  ],
  templateUrl: './order-maintenance-modal.component.html',
})
export class OrderMaintenanceModalComponent implements OnInit {
  params = {
    id: 0
  };


  private modalRef = inject(NgbActiveModal);
  private orderSvc = inject(OrderService);

  private salesDetailCalculationSvc = inject(SalesDetailCalculationService)


  orderDetails: any[] = []
  orderMaintenances: OrderMaintenance[] = [];
  bodegas: GroupedEstabBodega[] = []
  feeds: Tarifa[] = []
  taxes: Impuesto[] = []
  taxPercents: TarifaImpuesto[] = []
  decimal: DecimalSale = {
    nroPrecio: 0,
    nroCantidad: 0,
    nroIva: 0,
    nroDescuentoDetalle: 0,
    nroTotalDetalle: 0,
    nroTotalSubTotal: 0,
    nroDescuento: 0,
    importeTotal: 0,
    nroIce: 0
  }


  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  order = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    total: 0,
    tip: 0,
    bodegaId: 0,
    feeId: 0
  }

  cloneOrder = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    total: 0,
    tip: 0,
    bodegaId: 0,
    feeId: 0
  }

  //Draw Totals Tax
  htmlImpuestoTotal = '';
  htmlIvaTotal = '';


  calculateTotal(cell: any) {
    let row = cell.getRow().getData();
    let column = cell.getColumn()._column.field;

    if (column == 'idTarifa') {
      let tarifa = row.tarifas.find((x: any) => x.idTarifa == row.idTarifa);

      cell.getRow().update({ priceIva: tarifa.precioConIva });
    }

    if (column == 'quantity') {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        let oldQuantity = cell.getOldValue();
        cell.getRow().update({ quantity: oldQuantity });
      }
    }
    let total = row.priceIva * row.quantity;
    cell.getRow().update({ total: total });
  }

  drawImpuestoTotales({ items }: any) {
    try {
      let {
        subTotalSinImpuesto,
        htmlImpuestoTotal,
        htmlIvaTotal,
        irbpnr,
        totalIce,
        importeTotal,
        discount,
        percentageDiscount,
        propina,
      } = this.salesDetailCalculationSvc.getTaxTotals({
        items: items,
        decimal: this.decimal,
        tarifasImpuesto: this.taxPercents,
      })

      this.order.subTotalSinImpuesto = subTotalSinImpuesto;
      this.order.total = importeTotal;
      this.order.discount = discount;
      this.order.percentageDiscount = percentageDiscount;
      this.order.tip = propina;
      this.htmlImpuestoTotal = htmlImpuestoTotal;
      this.htmlIvaTotal = htmlIvaTotal;
    } catch (error) {
      console.log(error);
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  getId() {

    this.orderSvc.getId(this.params.id).subscribe({
      next: (response) => {
        this.establecimientos = response.establecimientos;
        this.order = response.order;
        this.orderDetails = response.orderDetails;
        this.orderMaintenances = response.orderMaintenances;

        this.feeds = response.feeds;
        this.taxes = response.taxes;
        this.taxPercents = response.taxPercents;
        this.decimal = response.decimal;

        let dataEstab = this.establecimientos.find((e) => e.idEstablecimiento === this.order.establecimientoId)
        if (dataEstab) {
          this.puntosEmision = dataEstab.puntosEmision;
          this.bodegas = dataEstab.bodegas;
          let dataBodega = this.bodegas.find(b=>b.defaultBodega);
          if(dataBodega){
            this.order.bodegaId = dataBodega.idBodega;
            this.cloneOrder.bodegaId = this.order.bodegaId;
          }
        }

        let dataTarifa = this.feeds.find(t=>t.predeterminada)
        if(dataTarifa){
          this.order.feeId = dataTarifa.idTarifa;
          this.cloneOrder.feeId = dataTarifa.idTarifa;
        }

        this.drawImpuestoTotales({
          items: this.orderMaintenances
        });
      },
    })
  }

  ngOnInit(): void {
    this.getId();
  }

  save() { }
}
