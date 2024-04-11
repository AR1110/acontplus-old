import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { ProductService } from '@modules/inventory/services/product.service';
import { ColOrderMaintenance, OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Impuesto } from '@shared/models/impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import { OrderMaintenanceStateService } from '@technical-support/store/order-maintenance/order-maintenance-state.service';

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
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService)

  orderDetails = this.orderMaintenanceState.select('orderDetails');
  orderMaintenances = this.orderMaintenanceState.select('orderMaintenances');
  bodegas = this.orderMaintenanceState.select('bodegas');
  feeds = this.orderMaintenanceState.select('feeds');
  taxes = this.orderMaintenanceState.select('taxes');
  taxPercents = this.orderMaintenanceState.select('taxPercents');
  decimal = this.orderMaintenanceState.select('decimal');


  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  getTaxEditorParams = () => {
    const taxes = this.taxes();
    let values: any = {};
    for (let tax of taxes) {
      values[tax.idImpuesto] = tax.descripcion
    }
    console.log(values)
    return {
      values
    }
  }

  getTaxFormatterParams = () => {
    return this.getTaxEditorParams().values
  }

  getBodegaEditorParams = () => {
    let bodegas = this.bodegas();
    let values: any = {};
    for (let b of bodegas) {
      values[b.idBodega] = b.descripcion
    }
    return {
      values
    }
  }
  getBodegaFormatterParams = () => {
    return this.getBodegaEditorParams().values
  }

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    let column: ColOrderMaintenance = cell.getColumn().getField();
    let data: OrderMaintenance = cell.getData();
    let oldValue = cell.getOldValue();
    let value = cell.getValue();


    console.log(data)
    let editor: any = document.createElement("select");

    if (column === "medidaId") {
      for (let m of data.medidas) {
        let opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === 'taxId') {
      for (let i of editorParams) {
        let opt = document.createElement('option');
        opt.value = i.idImpuesto;
        opt.innerHTML = i.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === "taxPercentId") {
      let dataImpuesto = this.taxes().find(i => i.idImpuesto === Number(data.taxId));
      let taxPercents = editorParams.filter((ti: any) => ti.codImpuesto === dataImpuesto?.codigo);

      for (let ti of taxPercents) {
        let opt = document.createElement('option');
        opt.value = ti.idTarifaImpuesto;
        opt.innerHTML = ti.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === "feeId") {
      for (let t of data.tarifas) {
        let opt = document.createElement('option');
        opt.value = t.idTarifa.toString();
        opt.innerHTML = t.descripcion + ' - $' + t.precioConIva
        editor.appendChild(opt);
      }
    }

    if (column === "bodegaId") {
      for (let b of this.bodegas()) {
        let opt = document.createElement('option');
        opt.value = b.idBodega.toString();
        opt.innerHTML = b.descripcion
        editor.appendChild(opt);
      }
    }


    editor.style.padding = "3px";
    editor.style.width = "100%";
    editor.style.boxSizing = "border-box";

    editor.value = cell.getValue();

    onRendered(function () {
      editor.focus();
      editor.style.css = "100%";
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener("change", successFunc);
    editor.addEventListener("blur", successFunc);

    return editor;
  };

  columnNames = [
    {
      title: 'Op.',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",

    },
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
      width: "7px",

    },
    {
      title: 'Producto / Servicio',
      field: 'descripcion',
      editor: true,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "20px",
      editable: function (cell: any) {
        let data = cell.getRow().getData();
        return !data.llevaInventario
      }

    },
    {
      title: 'Cant.',
      field: 'quantity',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: "center",
      width: "7px",
      editor: "input",
      validator: ["required", "numeric", "max:5"]
    },
    {
      title: 'Medida',
      field: 'medidaId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: "center",
      editor: this.comboEditor,
      formatter: function (cell: any) {
        let data = cell.getData();
        for (let m of data.medidas) {
          console.log(cell.getValue())
          console.log(m.idMedida == cell.getValue())
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
          }
        }
      },
      validator: "required",
      width: "9px",
    },
    {
      title: 'Imp.',
      field: 'taxId',
      headerSort: false,
      headerHozAlign: "center",
      width: "7px",
      editor: this.comboEditor,

      editorParams: this.taxes,
      formatter: function (cell: any, formatterParams: any) {
        for (var i = 0; i < formatterParams.length; i++) {

          if (formatterParams[i].idImpuesto == cell.getValue()) {
            return formatterParams[i].descripcion;
          }
        }
      },
      formatterParams: this.taxes,
      validator: "required"
    },
    {
      title: 'Tipo Iva',
      field: 'taxPercentId',
      headerSort: false,
      headerHozAlign: "center",
      width: "8px",
      editor: this.comboEditor,
      editorParams: this.taxPercents,
      formatter: function (cell: any, formatterParams: any) {
        for (let ti of formatterParams) {
          if (ti.idTarifaImpuesto == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: this.taxPercents,
      validator: "required"
    },
    {
      title: 'Tarifa',
      field: 'feeId',
      headerSort: false,
      headerHozAlign: "center",
      width: "8px",
      editor: this.comboEditor,
      formatter: function (cell: any) {
        let data = cell.getData();

        for (let t of data.tarifas) {
          console.log(cell.getValue())
          console.log(t.idTarifa)
          console.log(t.idTarifa == cell.getValue())
          if (t.idTarifa == cell.getValue()) {
            return t.descripcion;
          }
        }
      },
      validator: "required"
    },
    {
      title: 'Precio U.',
      field: 'price',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "8px",
      editor: "input"
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "8px",
      editor: "input"
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      editor: "input"
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      editor: "input"
    },
    {
      title: 'Subtotal',
      field: 'precioTotalSinImpuesto',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      editor: "input"
    },
    {
      title: 'Iva',
      field: 'taxValue',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
    },
    {
      title: 'Total',
      field: 'total',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
    },
    {
      title: 'Nota',
      field: 'obs',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "8px",
      editor: "input"
    },
    {
      title: 'Bodega',
      field: 'bodegaId',
      headerSort: false,
      headerHozAlign: "center",
      width: "8px",
      editor: this.comboEditor,
      editorParams: this.bodegas,
      formatter: function (cell: any, formatterParams: any) {
        for (let ti of formatterParams) {
          if (ti.idBodega == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: this.bodegas,
      validator: "required"
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
            const { product, medidas, consolidacionesFecha } = response;
            let taxPercents = this.taxPercents;
            let dataOrderMaintenance = {} as OrderMaintenance;
            let dataTaxPercent = taxPercents().find(d => d.codigo === product.codigoPorcentaje);
            let dataMedida = medidas.find(m => m.defaultMedida);

            if (dataTaxPercent) {
              let dataTax = this.taxes().find(t => t.codigo === dataTaxPercent?.codImpuesto);
              dataOrderMaintenance.taxPercentId = dataTaxPercent.idTarifaImpuesto;
              dataOrderMaintenance.taxId = dataTax?.idImpuesto ?? 0;
            }

            if (dataMedida) {
              dataOrderMaintenance.tarifas = dataMedida.tarifas;
              dataOrderMaintenance.medidaId = dataMedida.idMedida;
              dataOrderMaintenance.cost = dataMedida.precioCosto;
              dataOrderMaintenance.costoFraccionado = dataMedida.precioCostoFraccionado;
              dataOrderMaintenance.conversion = dataMedida.conversion;

              let dataTarifa = dataOrderMaintenance.tarifas.find(t => t.defaultTarifa);

              dataOrderMaintenance.feeId = dataTarifa?.idTarifa ?? 0;
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


  /**
        *
        * @param {*} column nombre de la columnas
        * @param {*} data  data row
        * @param {*} oldValue valor anterior de la columna
        */
  setCalculoTotales(column: keyof Pick<OrderMaintenance, "feeId">, data: OrderMaintenance, oldValue: string | number, row:any) {

    //calculoColDef recibbe params obj: {rowEntity, oldValue, decimal, idTarifa, columnDefs}
    let obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      feeId: 1,
      decimal: this.decimal(),
      columnDefs: this.tabulatorComponent.refTabulator.getColumnDefinitions()
    });

    row.update({
      ...row,
      ...obj
    })
    //recalculateTotalsSimple();
  }

  cellEdited(cell: any) {
    let row = cell.getRow();
    let column = cell.getColumn().getField();
    let oldValue = parseFloat(cell.getOldValue());
    let value = parseFloat(cell.getValue());

    let data = cell.getData();
    let taxId = Number(data.taxId);

    if (typeof data[column] === null || data[column] === undefined) {
      cell.getData()[column] = oldValue;
    }

    if (['quantity', 'price', 'precioConIva', 'discount', 'percentageDiscount'].includes(column) && (value < 0 || value===oldValue) ) {
      cell.getData()[column] = oldValue;
    }

    if (column === 'quantity' ) {
      // Validamos los datos según tus requisitos
      if (["", null,0].includes(value)) {
        // Si el campo está vacío, puedes mostrar un mensaje de error

        // Deseleccionamos la celda para que el usuario tenga que corregir el valor
        cell.getRow().deselect();
        // Revertimos los cambios para que el valor no se actualice en la tabla
        cell.restoreOldValue();
      }
      // data[column] = 1;
    }

    this.setCalculoTotales(column, data, oldValue, row);




    // row.update({
    //   ...row,
    //   ...obj
    // })

  }


}
