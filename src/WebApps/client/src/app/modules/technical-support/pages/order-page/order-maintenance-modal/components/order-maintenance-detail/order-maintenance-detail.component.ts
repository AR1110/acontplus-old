import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrderMaintenanceStateService } from '@technical-support/store/order-maintenance/order-maintenance-state.service';
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@modules/inventory/services/product.service';
import { OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';

@Component({
  selector: 'app-order-maintenance-detail',
  standalone: true,
  imports: [
    FormsModule,
    NgbAccordionModule,
    ProductSearchComponent,
    TabulatorComponent
  ],
  templateUrl: './order-maintenance-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderMaintenanceDetailComponent {

  private orderMaintenanceState = inject(OrderMaintenanceStateService);
  private productSvc = inject(ProductService)

  orderDetails = this.orderMaintenanceState.select('orderDetails');
  orderMaintenances = this.orderMaintenanceState.select('orderMaintenances');
  bodegas = this.orderMaintenanceState.select('bodegas');
  feeds = this.orderMaintenanceState.select('feeds');
  taxes = this.orderMaintenanceState.select('taxes');
  taxPercents = this.orderMaintenanceState.select('taxPercents');

  getTaxEditorParams = () => {
    const taxes = this.taxes();
    let values: any = {};
    for (let tax of taxes) {
      values[tax.idImpuesto] = tax.descripcion
    }
    return {
      values
    }
  }

  getTaxFormatterParams = () => {
    return this.getTaxEditorParams().values
  }

  getBodegaEditorParams = ()=>{
    let bodegas = this.bodegas();
    let values: any = {};
    for (let b of bodegas) {
      values[b.idBodega] = b.descripcion
    }
    return {
      values
    }
  }
  getBodegaFormatterParams = ()=>{
    return this.getBodegaEditorParams().values
  }

  columnNames = [
    {
      title: 'Nro',
      field: 'index',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",

    },
    {
      title: 'Código',
      field: 'codigo',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "10px",

    },
    {
      title: 'Producto / Servicio',
      field: 'productName',
      editor: true,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "30px",

    },
    {
      title: 'Cant.',
      field: 'cantidad',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: "center",
      width: "7px",
    },
    {
      title: 'Medida',
      field: 'medidaId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: "center",
      width: "10px",
    },
    {
      title: 'Impuesto',
      field: 'taxId',
      headerSort: false,
      headerHozAlign: "center",
      width: "6px",
      editor: "list",
      editorParams: this.getTaxEditorParams,
      formatter: "lookup",
      formatterParams: this.getTaxFormatterParams

    },
    {
      field: 'idBodega',
      title: 'Bodega',
      headerSort: false,
      headerHozAlign: "center",
      width: "6px",
      editor: "list",
      editorParams: this.getBodegaEditorParams,
      formatter: "lookup",
      formatterParams: this.getBodegaFormatterParams

    },
    {

      field: 'idTarifa',
      hozAlign: 'center',
      title: 'Tarifa',
      typeNumber: true,
      headerSort: false,
      headerHozAlign: "center",
      width: "6px",

    },
    {
      title: 'Cantidad',
      field: 'quantity',
      editor: true,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",

    },
    {
      title: 'Precio',
      field: 'price',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",

    },
    {
      title: 'Impuesto',
      field: 'tax',
      width: '150',
      editor: true,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",

    },
    {
      title: 'Total',
      field: 'total',
      width: '150',
      headerSort: false,
      hozAlign: "center",
    },
  ];


  onProductSelected($event: any) {
    let { data } = $event;
    console.log(data);
    if (data.idArticulo > 0) {
      this.productSvc
        .getForSale(data.idArticulo)
        .subscribe({
          next: (response) => {
            const {product, medidas, consolidacionesFecha} = response;
            let taxPercents = this.taxPercents();
            let dataOrderMaintenance = {} as OrderMaintenance;
            let dataTaxPercent = taxPercents.find(d => d.codigo === product.codigoPorcentaje);
            let dataMedida = medidas.find(m=>m.defaultMedida);

            if(dataTaxPercent){
              let dataTax = this.taxes().find(t=>t.codigo===dataTaxPercent?.codImpuesto);
              dataOrderMaintenance.taxPercentId = dataTaxPercent.idTarifaImpuesto;
              dataOrderMaintenance.taxId = dataTax?.idImpuesto ?? 0;
            }

            if(dataMedida){
              dataOrderMaintenance.tarifas = dataMedida.tarifas;
              dataOrderMaintenance.medidaId = dataMedida.idMedida;
              dataOrderMaintenance.cost = dataMedida.precioCosto;
              dataOrderMaintenance.costoFraccionado = dataMedida.precioCostoFraccionado;
              dataOrderMaintenance.conversion = dataMedida.conversion;

              let dataTarifa = dataOrderMaintenance.tarifas.find(t=>t.defaultTarifa);

              dataOrderMaintenance.feeId = dataTarifa?.idTarifa?? 0;
              dataOrderMaintenance.price = dataTarifa?.precioVenta ?? 0;
            }
            let orderMaintenances = this.orderMaintenances()
            orderMaintenances.push(dataOrderMaintenance);

            console.log(orderMaintenances)
            this.orderMaintenanceState.set('orderMaintenances', orderMaintenances)

          },
        });
    }
  }




}
