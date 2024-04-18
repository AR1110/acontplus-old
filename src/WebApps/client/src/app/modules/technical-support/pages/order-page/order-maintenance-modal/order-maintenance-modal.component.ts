import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faListAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { ProductService } from '@modules/inventory/services/product.service';
import { Tarifa } from '@modules/inventory/shared/models/tarifa.model';
import { OpenModalProductService } from '@modules/inventory/shared/services/open-modal-product.service';
import { DecimalSale } from '@modules/sale/shared/models/decimal-sale.model';
import { orderMaintenanceAdapter } from '@modules/technical-support/adapters/order-maintenance.adapter';
import { ColOrderMaintenance, OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { OrderMaintenanceService } from '@modules/technical-support/services/order-maintenance.service';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DrawTaxTotalComponent } from '@shared/components/draw-tax-total/draw-tax-total.component';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-maintenance-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgbAccordionModule,
    DrawTaxTotalComponent,
    ProductSearchComponent,
    ReactiveFormsModule,
    TabulatorComponent,
    ProductSearchComponent
  ],
  templateUrl: './order-maintenance-modal.component.html',
})
export class OrderMaintenanceModalComponent implements OnInit {
  params = {
    id: 0
  };


  private modalRef = inject(NgbActiveModal);
  private orderSvc = inject(OrderService);
  private tS = inject(ToasterService);

  private productSvc = inject(ProductService)
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);
  private openModalProductSvc = inject(OpenModalProductService)
  private orderMaintenanceSvc = inject(OrderMaintenanceService);

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;


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
    feeId: 0,
    fechaEmision: '',
    orderDetailId: null
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




  validatorNumber = ["required", "number"]

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    let column: ColOrderMaintenance = cell.getColumn().getField();
    let data: OrderMaintenance = cell.getData();
    // let oldValue = cell.getOldValue();
    // let value = cell.getValue();

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
      let taxPercents = editorParams.filter((ti: any) => ti.idImpuesto === Number(data.taxId));

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

  columnNames = [
    { headerSort: false, resizable: false, minWidth: 30, width: 30, rowHandle: true, formatter: "handle" },
    {
      formatter: "rownum", headerSort: false, hozAlign: "center",
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        //let cellEl = cell.getElement();
        let rowDataMain = cell.getRow().getData();

        //create edit button
        let editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.innerHTML = `${icon(faEdit).html.join('')}`
        editBtn.classList.add("btn", "btn-success", "btn-xs");
        editBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.openModalProductEdit(rowData)
        });

        //create delete button
        let delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add("btn", "btn-danger", "btn-xs");
        delBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.askToDelete(rowData)
        });

        //create kardex button
        let kardexBtn = document.createElement("button");
        kardexBtn.type = "button";
        kardexBtn.innerHTML = `${icon(faListAlt).html.join('')}`;
        kardexBtn.classList.add("btn", "btn-info", "btn-xs");
        kardexBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          this.openModalProductKardex(rowData)
        });

        let buttonHolder = document.createElement("span");
        buttonHolder.appendChild(delBtn);
        buttonHolder.appendChild(editBtn);

        if (rowDataMain.llevaInventario) {
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

      validator: ["required"],
      editor: "number", editorParams: {

        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      }
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
      validator: this.validatorNumber,
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      }
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "8px",
      validator: this.validatorNumber,
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      }
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      validator: this.validatorNumber,
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      }
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      validator: this.validatorNumber,
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      }
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

  tabulatorOptions = {
    width: null,
    movableRows: true,
    // groupStartOpen: false,
    groupBy: "orderDetailId",
    groupValues: [[]] as any,
    groupHeader: (value: any, count: any) => {
      let dataOrderDetail = this.orderDetails.find(od => od.orderDetailId === value);

      if (dataOrderDetail) {
        return `${dataOrderDetail.deviceName} (${count} items)`;
      }
      return null;
    },
    columns: this.columnNames,
  };


  getId() {
    showLoader();
    this.orderSvc.getId(this.params.id).subscribe({
      next: (response) => {
        hideLoader();
        this.establecimientos = response.establecimientos;
        this.order = response.order;
        this.orderDetails = response.orderDetails;
        this.orderMaintenances = response.orderMaintenances.map((d: any) => {
          let od = this.orderDetails.find(od => od.orderDetailId === d.orderDetailId);
          return {
            ...d,
            deviceName: od.deviceName
          }
        });


        this.feeds = response.feeds;
        this.taxes = response.taxes;
        this.taxPercents = response.taxPercents;
        this.decimal = response.decimal;

        let dataEstab = this.establecimientos.find((e) => e.idEstablecimiento === this.order.establecimientoId)
        if (dataEstab) {
          this.puntosEmision = dataEstab.puntosEmision;
          this.bodegas = dataEstab.bodegas;
          let dataBodega = this.bodegas.find(b => b.defaultBodega);
          if (dataBodega) {
            this.order.bodegaId = dataBodega.idBodega;
            this.cloneOrder.bodegaId = this.order.bodegaId;
          }
          this.cloneOrder.establecimientoId = this.order.establecimientoId;

        }

        let dataTarifa = this.feeds.find(t => t.predeterminada)
        if (dataTarifa) {
          this.order.feeId = dataTarifa.idTarifa;
          this.cloneOrder.feeId = dataTarifa.idTarifa;
        }

        this.order.orderDetailId = this.orderDetails[0].orderDetailId;
        //  this.tabulatorOptions.groupValues = [[...this.orderDetails.map(t => t.deviceName)]]

        // Obtener valores únicos para "orderDetailId"
        const uniqueOrderDetailIds = Array.from(new Set(this.orderDetails.map((item: any) => item.orderDetailId)));

        // Crear groupValues con valores únicos de "orderDetailId"
        const groupValues = uniqueOrderDetailIds.map((id: number) => id);

        this.tabulatorOptions.groupValues = [groupValues]

        this.drawImpuestoTotales();
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }



  ngOnInit(): void {
    this.getId();
  }


  setIdBodegaInDetalle() {
    for (let item of this.orderMaintenances) {
      item.bodegaId = this.order.bodegaId;
    }
  }

  resetCantidadToZeroAndRecalculateTotals() {
    try {
      for (let row of this.orderMaintenances) {
        if (!row.llevaInventario) continue;

        row.quantity = 0;

        this.setCalculoTotales("quantity", row, undefined)

      }
    } catch (error) {
      console.log(error);
    }

  }


  async onChangeEstablecimiento() {
    try {
      let { isConfirmed } = await Swal.fire({
        title: '<small>Cambiar Establecimiento?</small>',
        html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cambiar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      })

      if (!isConfirmed) {
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return
      }

      let dataEstab = this.establecimientos.find(item => item.idEstablecimiento === this.order.establecimientoId);
      if (!dataEstab) return

      this.puntosEmision = dataEstab.puntosEmision;
      this.bodegas = dataEstab.bodegas;

      if (this.puntosEmision.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No tienes Puntos de Emisión asignado a este establecimiento'
        })
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return
      }
      if (this.bodegas.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No tienes bodegas asignado a este establecimiento'
        })
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return
      }

      let dataPtoEmi = this.puntosEmision.find(item => (item.defaultPtoEmi));
      if (dataPtoEmi) {
        this.order.puntoEmisionId = dataPtoEmi.idPuntoEmision;
      }

      //Bodegas
      let dataBodega = this.bodegas.find(item => (item.defaultBodega));
      if (dataBodega) {
        this.order.bodegaId = dataBodega.idBodega;

      }
      console.log(this.order)
      this.cloneOrder.establecimientoId = this.order.establecimientoId;

      this.setIdBodegaInDetalle();
      this.resetCantidadToZeroAndRecalculateTotals();


    } catch (error) {
      console.log(error)
    }
  }

  async onChangeBodega() {
    try {
      let bodega = this.bodegas.find(item => item.idBodega === this.order.bodegaId);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger ml-2'
        },
        buttonsStyling: false
      })

      let {
        isConfirmed
      } = await swalWithBootstrapButtons.fire({
        title: '<small>Cambiar Bodega</small>',
        html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega?.descripcion}</b>  en el detalle del Documento?</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Si, cambiar!`,
        cancelButtonText: 'No, cancelar!',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      })

      if (isConfirmed) {
        this.cloneOrder.bodegaId = this.order.bodegaId

        if (this.orderMaintenances.length === 0) return

        this.setIdBodegaInDetalle();
        this.resetCantidadToZeroAndRecalculateTotals();
      } else {
        this.order.bodegaId = this.cloneOrder.bodegaId;
      }
    } catch (error) {
      console.log(error)
    }
  }


  async onChangeFee() {
    try {

      // if (!$scope.permisoComprobanteVenta.tarifa) {
      //   $scope.data.idTarifa = $scope.dataClone.idTarifa;
      //   tS.toastr('warning', 'No tienes permiso para realizar esta acción');
      //   return
      // }

      let tarifa = this.feeds.find(item => item.idTarifa === this.order.feeId);
      let {
        isConfirmed
      } = await Swal.fire({
        html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa?.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: `Sí, cambiar!`,
        cancelButtonText: 'No, cancelar!',
        allowOutsideClick: false,
      })

      if (isConfirmed) {

        this.cloneOrder.feeId = this.order.feeId;

        if (this.orderMaintenances.length === 0) return

        this.salesDetailCalculationSvc.setFeeInDetail({
          generalFeeId: this.order.feeId,
          items: this.orderMaintenances,
          decimal: this.decimal,
          columnDefs: this.tabulatorOptions.columns,
          tarifasImpuesto: this.taxPercents
        })

        this.drawImpuestoTotales()

      } else {
        this.order.feeId = this.cloneOrder.feeId;
      }

    } catch (error) {
      console.log(error)
    }
  }

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
          let rows = this.orderMaintenances.filter(r => r.rowguid !== data.rowguid);
          this.orderMaintenances = rows;
          this.drawImpuestoTotales()
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

  openModalProductKardex(data: OrderMaintenance) {
    try {
      this.openModalProductSvc.openKardex({ id: data.productId })
    } catch (error) {
      console.log(error)
    }
  }


  getDataRowEmpty() {
    let dataOrderMaintenance: OrderMaintenance = {
      rowguid: generateUuidv4(),
      bodegaId: 0,
      feeId: 0,
      medidaId: 0,
      orderDetailId: 0,
      productId: 0,
      descripcion: '',
      codigo: '',
      taxId: 0,
      taxPercentId: 0,
      quantity: 1,
      cost: 0,
      precioConIva: 0,
      taxValue: 0,
      price: 0,
      percentageDiscount: 0,
      discount: 0,
      precioTotalSinImpuesto: 0,
      total: 0,
      obs: '',
      medidas: [],
      tarifas: [],
      consolidacionesBodega: [],
      costoFraccionado: 0,
      conversion: 0,
      llevaInventario: false
    }
    return dataOrderMaintenance;
  }

  addItem() {

  }

  setItem() {

  }

  onProductSelected($event: any) {
    let { data } = $event;
    if (data.idArticulo > 0) {
      this.productSvc
        .getForSale(data.idArticulo)
        .subscribe({
          next: (response) => {
            const { product, medidas, consolidacionesFecha } = response;
            let index = 0;
            let taxPercents = this.taxPercents;
            let row = this.getDataRowEmpty();
            let dataTaxPercent = taxPercents.find(d => d.codigo === product.codigoPorcentaje);
            let dataOrderDetail = this.orderDetails.find(od => od.orderDetailId === this.order.orderDetailId)

            let findIndexById = this.orderMaintenances.findIndex(item => item.llevaInventario && item.productId === product.idArticulo);

            if (findIndexById === -1) {
              row.productId = product.idArticulo;
              row.codigo = product.codigoArticulo;
              row.descripcion = product.descripcion;
              row.bodegaId = this.order.bodegaId;
              row.llevaInventario = product.llevaInventario;

              if (dataTaxPercent) {
                row.taxPercentId = dataTaxPercent.idTarifaImpuesto;
                row.taxId = dataTaxPercent.idImpuesto;
              }

              let dataMedida = medidas.find(m => m.defaultMedida);


              if (dataMedida) {
                row.medidas = medidas;
                row.quantity = 1;
                row.tarifas = dataMedida.tarifas;
                row.medidaId = dataMedida.idMedida;
                row.cost = dataMedida.precioCosto;
                row.costoFraccionado = dataMedida.precioCostoFraccionado;
                row.conversion = dataMedida.conversion;
                row.deviceName = dataOrderDetail.deviceName;
                row.orderDetailId = dataOrderDetail.orderDetailId;

                let dataTarifa = row.tarifas.find(t => t.defaultTarifa);


                row.feeId = dataTarifa?.idTarifa ?? 0;
                row.price = dataTarifa?.precioVenta ?? 0;
                row.precioConIva = dataTarifa?.precioConIva ?? 0;

              }

              this.orderMaintenances.push(row);

            } else {
              index = findIndexById;
              row = this.orderMaintenances[index];
              row.quantity = row.quantity + 1;

              let dataMedida = medidas.find(m => m.idMedida === row.medidaId);

              if (dataMedida) {
                row.medidas = medidas;
                row.tarifas = dataMedida.tarifas;
                row.cost = dataMedida.precioCosto;
                row.costoFraccionado = dataMedida.precioCostoFraccionado;
                row.conversion = dataMedida.conversion;
              }
            }

            this.setCalculoTotales("quantity", row, undefined)
            this.tabulatorComponent.refTabulator.setGroupBy(["orderDetailId"]);


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
  setCalculoTotales(column: any, data: OrderMaintenance, oldValue?: string | number) {

    let obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      generalFeeId: this.order.feeId,
      decimal: this.decimal,
      columnDefs: this.tabulatorOptions.columns
    });

    let row = this.tabulatorComponent.refTabulator.getRows().find(function (row) {
      return row.getData().rowguid === data.rowguid;
    });

    if(row){
      row.update({
        data,
        ...obj
      })
    }


    this.drawImpuestoTotales();
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

    if (value === oldValue) {
      cell.setValue(oldValue);
      return
    }

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
        cellInOtherColumn.edit()
        cellInOtherColumn.getElement().focus();
        return
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

    this.setCalculoTotales(column, cloneData, oldValue);


  }



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

  drawImpuestoTotales() {
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
        items: this.orderMaintenances,
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


  save(codDoc?: string) {
    try {
      if (!(this.order.establecimientoId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Establecimiento'
        })
        return
      }

      if (!(this.order.puntoEmisionId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Punto de emisión'
        })
        return
      }

      let obj = {
        order: {
          ...this.order,
          codDoc,
        },
        detalles: this.orderMaintenances
      }
      let params = orderMaintenanceAdapter.to(obj);

      this.orderMaintenanceSvc.post(params).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
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
              this.modalRef.close(response);
            }
          }
        },
      })

    } catch (error) {
      console.log(error)
    }
  }


}
