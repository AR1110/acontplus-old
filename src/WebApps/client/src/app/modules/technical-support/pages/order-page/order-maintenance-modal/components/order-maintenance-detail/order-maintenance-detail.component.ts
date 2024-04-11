import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { GroupedEstabBodega } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faListAlt, faTimesRectangle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { ProductService } from '@modules/inventory/services/product.service';
import { ProductAddEditModalComponent } from '@modules/inventory/shared/components/product/product-add-edit-modal/product-add-edit-modal.component';
import { Tarifa } from '@modules/inventory/shared/models/tarifa.model';
import { OpenModalProductService } from '@modules/inventory/shared/services/open-modal-product.service';
import { DecimalSale } from '@modules/sale/shared/models/decimal-sale.model';
import { ColOrderMaintenance, OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';

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
})
export class OrderMaintenanceDetailComponent {
  @Input() orderDetails: any[] = []
  @Input() orderMaintenances: OrderMaintenance[] = [];
  @Input() bodegas: GroupedEstabBodega[] = []
  @Input() feeds: Tarifa[] = []
  @Input() taxes: Impuesto[] = []
  @Input() taxPercents: TarifaImpuesto[] = []
  @Input() decimal: DecimalSale = {
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

  @Output() drawTaxTotalEvent = new EventEmitter();

  private productSvc = inject(ProductService)
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);
  private openModalProductSvc = inject(OpenModalProductService)




  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  getTaxEditorParams = () => {
    const taxes = this.taxes;
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

  getBodegaEditorParams = () => {
    let bodegas = this.bodegas;
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
      let dataImpuesto = this.taxes.find(i => i.idImpuesto === Number(data.taxId));
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
      for (let b of this.bodegas) {
        let opt = document.createElement('option');
        opt.value = b.idBodega.toString();
        opt.innerHTML = b.descripcion
        editor.appendChild(opt);
      }
    }


    editor.style.padding = "3px";
    editor.style.width = "100%";
    editor.style.boxSizing = "border-box";

    editor.value = Number(cell.getValue());

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

  validatorNumber = ["required", "number"]

  askToDelete(data: OrderMaintenance) {
    try {
      Swal.fire({
        // title: "Are you sure?",
        html: `Esta seguro de eliminar este elemento <b>${data.descripcion}</b>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!",
        cancelButtonText: 'No!'
      }).then((result) => {
        if (result.isConfirmed) {
          let index = this.orderMaintenances.indexOf(data);
          this.orderMaintenances.splice(index, 1);
          this.tabulatorComponent.refTabulator.setData(this.orderMaintenances);
          this.drawTaxTotalEvent.emit()
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  openModalProductEdit(data: OrderMaintenance) {
    try {
      this.openModalProductSvc.open({ id: data.productId }).then(response => {
        console.log(response, 'closed produc')
      })
    } catch (error) {
      console.log(error)
    }
  }

  columnNames = [
    {
      formatter: "rownum", headerSort: false, hozAlign: "center",
    },
    {
      title: 'Op.',
      // formatter: function (cell: any, formatterParams: any) {
      //   const deleteButton = `<button class='btn btn-danger btn-sm delete-btn' title='Eliminar'>${icon(
      //     faTrashAlt
      //   ).html.join('')}</button>`;
      //   const editButton = `<button class='btn btn-success btn-sm edit-btn' title='Editar producto'>${icon(
      //     faEdit
      //   ).html.join('')}</button>`;
      //   return deleteButton + editButton;
      // },
      formatter: (cell: any) => {
        //let cellEl = cell.getElement();
        let rowData = cell.getRow().getData();

        //create edit button
        let editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.innerHTML = `${icon(faEdit).html.join('')}`
        editBtn.classList.add("btn", "btn-success", "btn-sm");
        editBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.openModalProductEdit(rowData)
        });

        //create delete button
        let delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add("btn", "btn-danger", "btn-sm");
        delBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.askToDelete(rowData)
        });

        //create kardex button
        let kardexBtn = document.createElement("button");
        kardexBtn.type = "button";
        kardexBtn.innerHTML = `${icon(faListAlt).html.join('')}`;
        kardexBtn.classList.add("btn", "btn-info", "btn-sm");
        kardexBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.askToDelete(rowData)
        });

        let buttonHolder = document.createElement("span");
        buttonHolder.appendChild(delBtn);
        buttonHolder.appendChild(editBtn);

        if (rowData.llevaInventario) {
          buttonHolder.appendChild(kardexBtn)
        }

        return buttonHolder;
      },
      width: 100,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
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
      validator: ["required", "number"],
      // editorEmptyValueFunc: (value: any, cl: any) => {
      //   console.log(cl)
      //   if (/\s/.test(value)) {
      //     console.log(value)

      //   }
      // }
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

      editorParams: () => this.taxes,
      formatter: function (cell: any, formatterParams: any) {
        for (var i = 0; i < formatterParams.length; i++) {

          if (formatterParams[i].idImpuesto == cell.getValue()) {
            return formatterParams[i].descripcion;
          }
        }
      },
      formatterParams: () => this.taxes,
      validator: "required"
    },
    {
      title: 'T. Imp.',
      field: 'taxPercentId',
      headerSort: false,
      headerHozAlign: "center",
      width: "8px",
      editor: this.comboEditor,
      editorParams: () => this.taxPercents,
      formatter: function (cell: any, formatterParams: any) {
        for (let ti of formatterParams) {
          if (ti.idTarifaImpuesto == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: () => this.taxPercents,
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
      editor: "input",
      validator: this.validatorNumber
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "8px",
      editor: "input",
      validator: this.validatorNumber
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      editor: "input",
      validator: this.validatorNumber
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      editor: "input",
      validator: this.validatorNumber
    },
    {
      title: 'Subtotal',
      field: 'precioTotalSinImpuesto',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
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
      width: "9px",
      editor: this.comboEditor,
      editorParams: () => this.bodegas,
      formatter: function (cell: any, formatterParams: any) {
        for (let ti of formatterParams) {
          if (ti.idBodega == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: () => this.bodegas,
      validator: "required"
    },

  ];


  onProductSelected($event: any) {
    let { data } = $event;
    if (data.idArticulo > 0) {
      this.productSvc
        .getForSale(data.idArticulo)
        .subscribe({
          next: (response) => {
            const { product, medidas, consolidacionesFecha } = response;
            let taxPercents = this.taxPercents;
            let dataOrderMaintenance = {} as OrderMaintenance;
            let dataTaxPercent = taxPercents.find(d => d.codigo === product.codigoPorcentaje);
            let dataMedida = medidas.find(m => m.defaultMedida);

            if (dataTaxPercent) {
              let dataTax = this.taxes.find(t => t.codigo === dataTaxPercent?.codImpuesto);
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
            let orderMaintenances = this.orderMaintenances
            orderMaintenances.push(dataOrderMaintenance);


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
  setCalculoTotales(column: any, data: OrderMaintenance, oldValue: string | number, row: any) {

    let obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      feeId: 1,
      decimal: this.decimal,
      columnDefs: this.tabulatorComponent.refTabulator.getColumnDefinitions()
    });

    row.update({
      ...row,
      ...obj
    })
    //recalculateTotalsSimple();
    this.drawTaxTotalEvent.emit()
  }

  cellEdited(cell: any) {

    let row = cell.getRow();
    let column: ColOrderMaintenance = cell.getColumn().getField();
    let oldValue = parseFloat(cell.getOldValue());
    let value = parseFloat(cell.getValue());

    let data = cell.getData();
    let quantity = parseFloat(data.quantity);
    let medidaId = parseInt(data.medidaId);
    let taxId = parseInt(data.taxId);
    let taxPercentId = parseInt(data.taxPercentId);
    let feeId = parseInt(data.feeId);
    let price = parseFloat(data.price);
    let precioConIva = parseFloat(data.precioConIva);
    let percentageDiscount = parseFloat(data.percentageDiscount);
    let discount = parseFloat(data.discount);

    if (column === "descripcion" || column === "obs") return

    if (value === oldValue) return

    if (isNaN(value) || cell.getValue() === "") {
      cell.setValue(oldValue);
      return
    }

    if (value < 0) {
      data[column] = oldValue;
    }

    if (column === "taxId") {
      if (!this.taxPercents.some(t => t.idImpuesto === Number(value))) {
        taxId = oldValue;
      } else {
        let cellInOtherColumn = row.getCell("taxPercentId");
        // Establecer el foco en la celda
        cellInOtherColumn.getElement().focus();
      }
    }

    if (column === 'quantity') {
      if (["", null, 0].includes(value)) {
        cell.getRow().deselect();
        cell.restoreOldValue();
      }
    }

    let cloneData = {
      ...data,
      quantity,
      medidaId,
      taxId,
      taxPercentId,
      feeId,
      price,
      precioConIva,
      percentageDiscount,
      discount,
    }

    this.setCalculoTotales(column, cloneData, oldValue, row);


  }


}
