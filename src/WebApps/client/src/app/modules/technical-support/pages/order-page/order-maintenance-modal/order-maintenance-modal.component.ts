import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabulatorTable, Button } from '@acontplus/ng-components';
import { DOC_TYPE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import {
  GroupedEstab,
  GroupedEstabBodega,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import {
  ajustarFechaEmisionModificada,
  dateIsAfterCurrentDate,
  isDateValid,
} from '@core/utils/date.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';

import { ProductSearchOverlayComponent } from '@inventory/ui/product/components/product-search-overlay/product-search-overlay.component';
import { Tarifa } from '@inventory/domain/models/tarifa.model';
import { OpenModalProductService } from '@inventory/domain/services/open-modal-product.service';
import { getCantidadStock, mergeProductStock } from '@inventory/domain/utils/product-stock.util';
import { DecimalSale } from '@sale/domain/models/decimal-sale.model';
import { orderMaintenanceAdapter } from '@modules/technical-support/adapters/order-maintenance.adapter';
import {
  ColOrderMaintenance,
  OrderMaintenance,
} from '@modules/technical-support/models/order-maintenance.model';
import { OrderMaintenanceService } from '@modules/technical-support/services/order-maintenance.service';
import { OrderService } from '@modules/technical-support/services/order.service';
import { DrawTaxTotalComponent } from '@shared/components/draw-tax-total/draw-tax-total.component';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';
import { PRODUCT_SERVICE } from '@inventory/tokens/inventory-token';
import { MatIcon } from '@angular/material/icon';

import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-order-maintenance-modal',
  imports: [
    FormsModule,
    DrawTaxTotalComponent,
    ReactiveFormsModule,
    TabulatorTable,
    ProductSearchOverlayComponent,
    InputDateComponent,
    MatIcon,
    Button,
    MatButton,
    MatCustomDialogComponent,
  ],
  templateUrl: './order-maintenance-modal.component.html',
})
export class OrderMaintenanceModalComponent implements OnInit {
  params = inject<{
    id: 0;
  }>(MAT_DIALOG_DATA);

  factura = DOC_TYPE.FV;
  notaEntrega = DOC_TYPE.NE;

  codDoc: DOC_TYPE | undefined = undefined;

  private modalRef = inject(MatDialogRef<OrderMaintenanceModalComponent>);
  private orderSvc = inject(OrderService);
  private tS = inject(ToastrNotificationService);

  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);
  private openModalProductSvc = inject(OpenModalProductService);
  private orderMaintenanceSvc = inject(OrderMaintenanceService);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  @ViewChild(TabulatorTable) tabulatorComponent!: TabulatorTable;

  orderDetails = signal<any[]>([]);
  cloneOrderMaintenances = signal<OrderMaintenance[]>([]);
  orderMaintenances = signal<OrderMaintenance[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);
  feeds = signal<Tarifa[]>([]);
  taxes = signal<Impuesto[]>([]);
  taxPercents = signal<TarifaImpuesto[]>([]);
  decimal: DecimalSale = {
    nroPrecio: 0,
    nroCantidad: 0,
    nroIva: 0,
    nroDescuentoDetalle: 0,
    nroTotalDetalle: 0,
    nroTotalSubTotal: 0,
    nroDescuento: 0,
    importeTotal: 0,
    nroIce: 0,
  };

  checkboxDetailCustom = false;
  detailCustom = false;

  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
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
    fechaEmision: new Date(),
    fechaEmisionDocCreado: null as Date | null,
    orderDetailId: null,
    customerCompanyId: 0,
    obs: '',
    deviceWarranty: '',
  };

  cloneOrder = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    total: 0,
    tip: 0,
    bodegaId: 0,
    feeId: 0,
  };

  //Draw Totals Tax
  htmlImpuestoTotal = '';
  htmlIvaTotal = '';

  // se usa cuando se realiza detalle personalizado
  importeTotal = 0;

  validatorNumber = ['required', 'number'];

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: ColOrderMaintenance = cell.getColumn().getField();
    const data: OrderMaintenance = cell.getData();
    // let oldValue = cell.getOldValue();
    // let value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'medidaId') {
      for (const m of data.medidas) {
        const opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === 'taxId') {
      for (const i of editorParams) {
        const opt = document.createElement('option');
        opt.value = i.idImpuesto;
        opt.innerHTML = i.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === 'taxPercentId') {
      const taxPercents = editorParams.filter((ti: any) => ti.idImpuesto === Number(data.taxId));

      for (const ti of taxPercents) {
        const opt = document.createElement('option');
        opt.value = ti.idTarifaImpuesto;
        opt.innerHTML = ti.descripcion;
        editor.appendChild(opt);
      }
    }

    if (column === 'feeId') {
      for (const t of data.tarifas) {
        const opt = document.createElement('option');
        opt.value = t.idTarifa.toString();
        opt.innerHTML = t.descripcion + ' - $' + t.precioConIva;
        editor.appendChild(opt);
      }
    }

    if (column === 'bodegaId') {
      for (const b of this.bodegas()) {
        const opt = document.createElement('option');
        opt.value = b.idBodega.toString();
        opt.innerHTML = b.descripcion;
        editor.appendChild(opt);
      }
    }

    editor.style.padding = '3px';
    editor.style.width = '100%';
    editor.style.boxSizing = 'border-box';

    editor.value = Number(cell.getValue());

    onRendered(function () {
      editor.focus();
      editor.style.css = '100%';
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener('change', successFunc);
    editor.addEventListener('blur', successFunc);

    return editor;
  };

  columnsMain = [
    {
      formatter: 'rownum',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        //let cellEl = cell.getElement();
        const rowDataMain = cell.getRow().getData();

        //create edit button
        // let editBtn = document.createElement('button');
        // editBtn.type = 'button';
        // editBtn.innerHTML = `${icon(faEdit).html.join('')}`;
        // editBtn.classList.add('btn', 'btn-success', 'btn-xs');
        // editBtn.addEventListener('click', () => {
        //   let rowData = cell.getRow().getData();
        //   this.openModalProductEdit(rowData);
        // });

        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">delete</i>`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-xs');
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          console.log(rowData);
          this.askToDelete(rowData);
        });

        //create kardex button
        const kardexBtn = document.createElement('button');
        kardexBtn.type = 'button';
        kardexBtn.innerHTML = `$<i class="material-icons" style="cursor:pointer;">menu</i>`;
        kardexBtn.classList.add('btn', 'btn-info', 'btn-xs');
        kardexBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          this.openModalProductKardex(rowData);
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        // buttonHolder.appendChild(editBtn);

        if (rowDataMain.llevaInventario) {
          buttonHolder.appendChild(kardexBtn);
        }

        return buttonHolder;
      },
      width: 100,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
    },
    {
      title: 'Código',
      field: 'codigo',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '7px',
    },
    {
      title: 'Producto / Servicio',
      field: 'descripcion',
      editor: true,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '20px',
      editable: function (cell: any) {
        const data = cell.getRow().getData();
        return !data.llevaInventario;
      },
    },
    {
      title: 'Cant.',
      field: 'quantity',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      width: '7px',

      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      editable: () => !this.detailCustom,
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
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.medidas) {
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
          }
        }
      },
      validator: 'required',
      width: '9px',
      editable: () => !this.detailCustom,
    },

    {
      title: 'Imp.',
      field: 'taxId',
      headerSort: false,
      headerHozAlign: 'center',
      width: '7px',
      editor: this.comboEditor,

      editorParams: () => this.taxes,
      formatter: function (cell: any, formatterParams: any) {
        for (let i = 0; i < formatterParams.length; i++) {
          if (formatterParams[i].idImpuesto == cell.getValue()) {
            return formatterParams[i].descripcion;
          }
        }
      },
      formatterParams: () => this.taxes,
      validator: 'required',
      editable: () => !this.detailCustom,
    },
    {
      title: 'T. Imp.',
      field: 'taxPercentId',
      headerSort: false,
      headerHozAlign: 'center',
      width: '8px',
      editor: this.comboEditor,
      editorParams: () => this.taxPercents(),
      formatter: function (cell: any, formatterParams: any) {
        for (const ti of formatterParams) {
          if (ti.idTarifaImpuesto == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: () => this.taxPercents(),
      validator: 'required',
      editable: () => !this.detailCustom,
    },
    {
      title: 'Tarifa',
      field: 'feeId',
      headerSort: false,
      headerHozAlign: 'center',
      width: '8px',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const t of data.tarifas) {
          if (t.idTarifa == cell.getValue()) {
            return t.descripcion;
          }
        }
      },
      validator: 'required',
      editable: () => !this.detailCustom,
    },
    {
      title: 'Precio U.',
      field: 'price',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: this.validatorNumber,
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      editable: () => !this.detailCustom,
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: this.validatorNumber,
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      editable: () => !this.detailCustom,
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
      validator: this.validatorNumber,
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      editable: () => !this.detailCustom,
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
      validator: this.validatorNumber,
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      editable: () => !this.detailCustom,
    },
    {
      title: 'Subtotal',
      field: 'precioTotalSinImpuesto',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
    {
      title: 'Iva',
      field: 'taxValue',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
    {
      title: 'Total',
      field: 'total',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
    {
      title: 'Nota',
      field: 'obs',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '8px',
      editor: 'input',
    },
    {
      title: 'Bodega',
      field: 'bodegaId',
      headerSort: false,
      headerHozAlign: 'center',
      width: '9px',
      editor: this.comboEditor,
      editorParams: () => this.bodegas(),
      formatter: function (cell: any, formatterParams: any) {
        for (const ti of formatterParams) {
          if (ti.idBodega == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: () => this.bodegas(),
      validator: 'required',
    },
  ];

  columnsGroup = [
    {
      headerSort: false,
      resizable: false,
      minWidth: 30,
      width: 30,
      rowHandle: true,
      formatter: 'handle',
    },
    ...this.columnsMain,
  ];

  tabGroupOptions: any = {
    width: null,
    movableRows: true,
    // groupStartOpen: false,
    groupBy: 'orderDetailId',
    groupValues: [[]] as any,
    groupHeader: (value: any, count: any) => {
      const dataOrderDetail = this.orderDetails().find((od) => od.orderDetailId === value);

      if (dataOrderDetail) {
        return `${dataOrderDetail.deviceName} (${count} items)`;
      }
      return null;
    },
  };

  tabulatorOptions = {
    ...this.tabGroupOptions,
    columns: this.columnsGroup,
  };

  getId() {
    this.orderSvc.getId(this.params.id).subscribe({
      next: (response) => {
        this.establecimientos.set(response.establecimientos);
        this.order = response.order;
        this.orderDetails.set(response.orderDetails);
        const orderMaintenances = response.orderMaintenances.map((d: any) => {
          const od = this.orderDetails().find((od) => od.orderDetailId === d.orderDetailId);
          return {
            ...d,
            deviceName: od.deviceName,
          };
        });
        this.orderMaintenances.set(orderMaintenances);

        this.feeds.set(response.feeds);
        this.taxes.set(response.taxes);
        this.taxPercents.set(response.taxPercents);
        this.decimal = response.decimal;

        const dataEstab = this.establecimientos().find(
          (e) => e.idEstablecimiento === this.order.establecimientoId,
        );
        if (dataEstab) {
          this.puntosEmision.set(dataEstab.puntosEmision);
          this.bodegas.set(dataEstab.bodegas);
          const dataBodega = this.bodegas().find((b) => b.defaultBodega);
          if (dataBodega) {
            this.order.bodegaId = dataBodega.idBodega;
            this.cloneOrder.bodegaId = this.order.bodegaId;
          }
          this.cloneOrder.establecimientoId = this.order.establecimientoId;
        }

        const dataTarifa = this.feeds().find((t) => t.predeterminada);
        if (dataTarifa) {
          this.order.feeId = dataTarifa.idTarifa;
          this.cloneOrder.feeId = dataTarifa.idTarifa;
        }

        const dataOrderDetail = this.orderDetails()[0];

        this.order.orderDetailId = dataOrderDetail?.orderDetailId;
        this.order.deviceWarranty = dataOrderDetail?.deviceWarranty;
        this.order.obs = dataOrderDetail?.obs;
        //  this.tabulatorOptions.groupValues = [[...this.orderDetails.map(t => t.deviceName)]]

        this.setGroupValues();

        this.drawImpuestoTotales();
      },
      error(err) {
        console.log(err);
      },
    });
  }

  setGroupValues() {
    // Obtener valores únicos para "orderDetailId"
    const uniqueOrderDetailIds = Array.from(
      new Set(this.orderDetails().map((item: any) => item.orderDetailId)),
    );

    // Crear groupValues con valores únicos de "orderDetailId"
    const groupValues = uniqueOrderDetailIds.map((id: number) => id);

    this.tabulatorOptions.groupValues = [groupValues];
  }

  ngOnInit(): void {
    this.getId();
  }

  onChangeOrderDetail() {
    this.order.obs = this.orderDetails().find(
      (x) => x.orderDetailId == this.order.orderDetailId,
    ).obs;
  }

  setIdBodegaInDetalle() {
    for (const item of this.orderMaintenances()) {
      item.bodegaId = this.order.bodegaId;
    }
  }

  resetCantidadToZeroAndRecalculateTotals() {
    try {
      for (const row of this.orderMaintenances()) {
        if (!row.llevaInventario) continue;

        row.quantity = 0;

        this.setCalculoTotales('quantity', row, undefined);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onChangeEstablecimiento() {
    try {
      const { isConfirmed } = await Swal.fire({
        title: '<small>Cambiar Establecimiento?</small>',
        html: '<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cambiar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (!isConfirmed) {
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return;
      }

      const dataEstab = this.establecimientos().find(
        (item) => item.idEstablecimiento === this.order.establecimientoId,
      );
      if (!dataEstab) return;

      this.puntosEmision.set(dataEstab.puntosEmision);
      this.bodegas.set(dataEstab.bodegas);

      if (this.puntosEmision().length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'No tienes Puntos de Emisión asignado a este establecimiento',
        });
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return;
      }
      if (this.bodegas().length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'No tienes bodegas asignado a este establecimiento',
        });
        this.order.establecimientoId = this.cloneOrder.establecimientoId;
        return;
      }

      const dataPtoEmi = this.puntosEmision().find((item) => item.defaultPtoEmi);
      if (dataPtoEmi) {
        this.order.puntoEmisionId = dataPtoEmi.idPuntoEmision;
      }

      //Bodegas
      const dataBodega = this.bodegas().find((item) => item.defaultBodega);
      if (dataBodega) {
        this.order.bodegaId = dataBodega.idBodega;
      }
      console.log(this.order);
      this.cloneOrder.establecimientoId = this.order.establecimientoId;

      this.setIdBodegaInDetalle();
      this.resetCantidadToZeroAndRecalculateTotals();
    } catch (error) {
      console.log(error);
    }
  }

  async onChangeBodega() {
    try {
      const bodega = this.bodegas().find((item) => item.idBodega === this.order.bodegaId);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger ml-2',
        },
        buttonsStyling: false,
      });

      const { isConfirmed } = await swalWithBootstrapButtons.fire({
        title: '<small>Cambiar Bodega</small>',
        html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega?.descripcion}</b>  en el detalle del Documento?</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Si, cambiar!`,
        cancelButtonText: 'No, cancelar!',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (isConfirmed) {
        this.cloneOrder.bodegaId = this.order.bodegaId;

        if (this.orderMaintenances().length === 0) return;

        this.setIdBodegaInDetalle();
        this.resetCantidadToZeroAndRecalculateTotals();
      } else {
        this.order.bodegaId = this.cloneOrder.bodegaId;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onChangeCheckboxDetailCustom() {
    if (this.checkboxDetailCustom) {
      Swal.fire({
        title: 'Detalle Personalizado',
        text: '¿Estás seguro de que deseas agrupar todos los detalles en un solo producto de tipo servicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.tS.show({
            type: 'info',
            message: 'Seleccione el producto de tipo servicio ',
          });

          this.tabulatorOptions = {
            columns: this.columnsMain,
          };
          this.cloneOrderMaintenances.set(structuredClone(this.orderMaintenances()));
          this.orderMaintenances.set([]);
          this.detailCustom = true;

          this.importeTotal = this.order.total;
          this.drawImpuestoTotales();
        } else {
          this.checkboxDetailCustom = false;
          this.detailCustom = false;
        }
      });
    } else {
      this.importeTotal = 0;
      this.detailCustom = false;
      this.tabulatorOptions = {
        ...this.tabGroupOptions,
        columns: this.columnsGroup,
      };
      this.orderMaintenances.set(structuredClone(this.cloneOrderMaintenances()));
      this.setGroupValues();
      this.tabulatorComponent.getInstance().setGroupBy(['orderDetailId']);

      this.drawImpuestoTotales();
    }
  }

  async onChangeFee() {
    try {
      // if (!$scope.permisoComprobanteVenta.tarifa) {
      //   $scope.infrastructure.idTarifa = $scope.dataClone.idTarifa;
      //   tS.toastr('warning', 'No tienes permiso para realizar esta acción');
      //   return
      // }

      const tarifa = this.feeds().find((item) => item.idTarifa === this.order.feeId);
      const { isConfirmed } = await Swal.fire({
        html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa?.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: `Sí, cambiar!`,
        cancelButtonText: 'No, cancelar!',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.cloneOrder.feeId = this.order.feeId;

        if (this.orderMaintenances().length === 0) return;

        this.salesDetailCalculationSvc.setFeeInDetail({
          generalFeeId: this.order.feeId,
          items: this.orderMaintenances(),
          decimal: this.decimal,
          columnDefs: this.tabulatorOptions.columns,
          tarifasImpuesto: this.taxPercents(),
        });

        this.drawImpuestoTotales();
      } else {
        this.order.feeId = this.cloneOrder.feeId;
      }
    } catch (error) {
      console.log(error);
    }
  }

  askToDelete(data: OrderMaintenance) {
    try {
      Swal.fire({
        html: `Esta seguro de eliminar este elemento <b>${data.descripcion}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.orderMaintenances().findIndex((r) => r.rowguid === data.rowguid);
          this.orderMaintenances().splice(index, 1);

          this.drawImpuestoTotales();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openModalProductEdit(data: OrderMaintenance) {
    try {
      this.openModalProductSvc.open({ id: data.productId }).then((response) => {
        console.log(response, 'closed produc');
      });
    } catch (error) {
      console.log(error);
    }
  }

  openModalProductKardex(data: OrderMaintenance) {
    try {
      this.openModalProductSvc.openKardex({ id: data.productId });
    } catch (error) {
      console.log(error);
    }
  }

  getDataRowEmpty() {
    const dataOrderMaintenance: OrderMaintenance = {
      id: 0,
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
      quantity: 0,
      cost: 0,
      precioConIva: 0,
      taxValue: 0,
      price: 0,
      percentageDiscount: 0,
      discount: 0,
      precioTotalSinImpuesto: 0,
      total: 0,
      obs: null,
      medidas: [],
      tarifas: [],
      consolidacionesBodega: [],
      costoFraccionado: 0,
      conversion: 0,
      llevaInventario: false,
    };
    return dataOrderMaintenance;
  }

  addItemNoInventario() {}

  setItem() {}

  checkNotificationStock(rows: OrderMaintenance[], row: OrderMaintenance, oldValue: number) {
    try {
      // Realiza la fusión de elementos en la lista de artículos clonada.
      const dataProductMerge = mergeProductStock({
        rows: rows,
        row,
      });
      console.log(dataProductMerge);
    } catch (error) {
      console.log(error);
    }
  }

  setProductNoInventoryDetailCustom(response: any) {}

  onProductSelected($event: any) {
    const { product, medidas, consolidacionesFecha } = $event;

    const taxPercents = this.taxPercents();
    let row = this.getDataRowEmpty();
    const dataTaxPercent = taxPercents.find((d) => d.codigo === product.codigoPorcentaje);
    const dataOrderDetail = this.orderDetails().find(
      (od) => od.orderDetailId === this.order.orderDetailId,
    );

    const findDataProduct = this.orderMaintenances().find(
      (item) => item.llevaInventario && item.productId === product.idArticulo,
    );

    row.productId = product.idArticulo;
    row.codigo = product.codigoArticulo;
    row.descripcion = product.descripcion;
    row.bodegaId = this.order.bodegaId;
    row.llevaInventario = product.llevaInventario;
    row.consolidacionesBodega = consolidacionesFecha;

    if (dataTaxPercent) {
      row.taxPercentId = dataTaxPercent.idTarifaImpuesto;
      row.taxId = dataTaxPercent.idImpuesto;
    }

    const dataMedida = medidas.find((m: { defaultMedida: any }) => m.defaultMedida);

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

      const dataTarifa = row.tarifas.find((t) => t.defaultTarifa);

      row.feeId = dataTarifa?.idTarifa ?? 0;
      row.price = dataTarifa?.precioVenta ?? 0;
      row.precioConIva = dataTarifa?.precioConIva ?? 0;
    }

    //cuando es detalle personalizado el producto tiene que ser de tipo servicio
    if (this.detailCustom && product.llevaInventario) {
      this.tS.show({
        type: 'warning',
        message:
          'Cuando la opción es Detalle Personlizado el producto tiene que ser de tipo servicio',
      });
      return;
    }

    //cuando el detalle es personalizado
    if (this.detailCustom) {
      this.orderMaintenances.set([]);

      row.price = pricingCalculateUtil.calculatePriceSale(
        this.importeTotal,
        dataTaxPercent?.porcentaje ?? 0,
      );
      row.precioConIva = this.importeTotal;
      row.taxValue = this.importeTotal - row.price;

      this.orderMaintenances.update((r) => [...r, row]);
      this.setCalculoTotales('quantity', row, undefined);
      return;
    }

    //Producto de tipo Servicio
    if (!product.llevaInventario) {
      this.orderMaintenances.update((r) => [...r, row]);

      this.setCalculoTotales('quantity', row, undefined);
      this.tabulatorComponent.getInstance().setGroupBy(['orderDetailId']);
      return;
    }

    //Producto que lleva inventario
    if (product.llevaInventario) {
      let oldValue = 1;
      const productsDuplicated = structuredClone(this.orderMaintenances()).filter(
        (item) => item.llevaInventario && item.productId === product.idArticulo,
      );

      productsDuplicated.push({ ...row });

      // let cloneOrderMaintenances = structuredClone(this.orderMaintenances);
      // let findDataProduct = this.orderMaintenances.find(item => item.llevaInventario && item.productId === product.idArticulo);

      if (findDataProduct) {
        oldValue = findDataProduct.quantity;
        row = findDataProduct;
        row.quantity += 1;
      } else {
        this.orderMaintenances.update((r) => [...r, row]);
      }

      const dataProductMerge = mergeProductStock({
        rows: structuredClone(productsDuplicated),
        row: structuredClone(row),
      });

      const cantidadStock = getCantidadStock({
        fechaEmision: this.order.fechaEmision,
        bodegaId: this.order.bodegaId,
        cantidadStock: dataProductMerge.cantidadStock,
        consolidacionesFecha: row.consolidacionesBodega,
      });

      this._PRODUCT_SERVICE
        .checkNotificationStock({
          idArticulo: row.productId,
          idBodega: this.order.bodegaId,
          idMedida: row.medidaId,
          cantidad: cantidadStock,
        })
        .subscribe({
          next: async (response) => {
            if (isApiResponse(response)) {
              const { code, message, titleSms } = response;

              if (code === '1') {
                console.log(row);
                this.setCalculoTotales('quantity', row, oldValue);
                return;
              }

              const { isConfirmed } = await Swal.fire({
                title: `<small>${titleSms}</small>`,
                icon: 'warning',
                html: `<small>${message}</small>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
              });

              if (isConfirmed) {
                if (code === '0') {
                  row.quantity = oldValue;
                  this.setCalculoTotales('quantity', row, oldValue);
                }
                if (code === '2') {
                  this.setCalculoTotales('quantity', row, undefined);
                  this.tabulatorComponent.getInstance().setGroupBy(['orderDetailId']);
                }
              }
            }
          },
          error(error) {
            console.log(error);
          },
        });

      // let oldValue = 0;
      // if (findDataProduct) {
      //   row.quantity = row.quantity + 1;
      // } else {
      //   row = findDataProduct ?? row;
      //   oldValue = row.quantity;
      //   row.quantity = row.quantity + 1;
      //   let dataMedida = medidas.find(m => m.idMedida === row.medidaId);

      //   if (dataMedida) {
      //     row.medidas = medidas;
      //     row.tarifas = dataMedida.tarifas;
      //     row.cost = dataMedida.precioCosto;
      //     row.costoFraccionado = dataMedida.precioCostoFraccionado;
      //     row.conversion = dataMedida.conversion;
      //   }
      // }

      // let cloneRows = this.orderMaintenances.slice().push()

      // this.checkNotificationStock(row, oldValue);
    }

    // if (findIndexById === -1) {

    // } else {
    //   index = findIndexById;
    //   row = this.orderMaintenances[index];
    //   row.quantity = row.quantity + 1;

    //   let dataMedida = medidas.find(m => m.idMedida === row.medidaId);

    //   if (dataMedida) {
    //     row.medidas = medidas;
    //     row.tarifas = dataMedida.tarifas;
    //     row.cost = dataMedida.precioCosto;
    //     row.costoFraccionado = dataMedida.precioCostoFraccionado;
    //     row.conversion = dataMedida.conversion;
    //   }
    // }

    // this.setCalculoTotales("quantity", row, undefined)
    this.tabulatorComponent.getInstance().setGroupBy(['orderDetailId']);
  }

  /**
   *
   * @param {*} column nombre de la columnas
   * @param {*} data  infrastructure row
   * @param {*} oldValue valor anterior de la columna
   */
  setCalculoTotales(column: any, data: OrderMaintenance, oldValue?: string | number) {
    const obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      generalFeeId: this.order.feeId,
      decimal: this.decimal,
      columnDefs: this.tabulatorOptions.columns,
    });

    const row = this.tabulatorComponent
      .getInstance()
      .getRows()
      .find(function (row) {
        return row.getData()['rowguid'] === data.rowguid;
      });

    if (row) {
      row.update({
        data,
        ...obj,
      });
    }

    this.drawImpuestoTotales();
  }

  cellEdited(cell: any) {
    const row = cell.getRow();
    const column: ColOrderMaintenance = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const value = parseFloat(cell.getValue());

    const data = cell.getData();
    const quantity = parseFloat(data.quantity);
    const medidaId = parseInt(data.medidaId);
    let taxId = parseInt(data.taxId);
    const taxPercentId = parseInt(data.taxPercentId);
    const feeId = parseInt(data.feeId);
    const price = parseFloat(data.price);
    const precioConIva = parseFloat(data.precioConIva);
    const percentageDiscount = parseFloat(data.percentageDiscount);
    const discount = parseFloat(data.discount);

    if (column === 'descripcion' || column === 'obs') return;

    if (value === oldValue) {
      cell.setValue(oldValue);
      return;
    }

    if (isNaN(value) || cell.getValue() === '') {
      cell.setValue(oldValue);
      return;
    }

    if (value < 0) {
      data[column] = oldValue;
    }

    if (column === 'taxId') {
      if (!this.taxPercents().some((t) => t.idImpuesto === Number(value))) {
        taxId = oldValue;
      } else {
        const cellInOtherColumn = row.getCell('taxPercentId');
        // Establecer el foco en la celda
        cellInOtherColumn.edit();
        cellInOtherColumn.getElement().focus();
        return;
      }
    }

    if (column === 'quantity') {
      if (['', null, 0].includes(value)) {
        cell.getRow().deselect();
        cell.restoreOldValue();
      }
    }

    const cloneData = {
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
    };

    this.setCalculoTotales(column, cloneData, oldValue);
  }

  calculateTotal(cell: any) {
    const row = cell.getRow().getData();
    const column = cell.getColumn()._column.field;

    if (column == 'idTarifa') {
      const tarifa = row.tarifas.find((x: any) => x.idTarifa == row.idTarifa);

      cell.getRow().update({ priceIva: tarifa.precioConIva });
    }

    if (column == 'quantity') {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        const oldQuantity = cell.getOldValue();
        cell.getRow().update({ quantity: oldQuantity });
      }
    }
    const total = row.priceIva * row.quantity;
    cell.getRow().update({ total: total });
  }

  drawImpuestoTotales() {
    try {
      const {
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
        items: this.orderMaintenances(),
        decimal: this.decimal,
        tarifasImpuesto: this.taxPercents(),
      });

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

  onModalClose() {
    this.modalRef.close();
  }

  isValidForm() {
    if (!(this.order.establecimientoId > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }

    if (!(this.order.puntoEmisionId > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Punto de emisión',
      });
      return;
    }

    if (!(this.order.customerCompanyId > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el cliente',
      });
      return;
    }

    if (!isDateValid(this.order.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(this.order.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
      });
      return;
    }

    const ajusteFechaEmision = ajustarFechaEmisionModificada({
      fechaEmision: this.order.fechaEmision,
      fechaEmisionDocCreado: this.order.fechaEmisionDocCreado,
      setHoursZero: true,
    });

    if (ajusteFechaEmision) {
      this.order.fechaEmision = ajusteFechaEmision;
    } else {
      console.log('Error al justar la fecha de Emisión');
      return;
    }

    if (this.orderMaintenances().length === 0) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese al menos un artículo en el detalle',
      });
      return;
    }

    if (this.orderMaintenances().some((row) => row.llevaInventario && row.quantity === 0)) {
      this.tS.show({
        type: 'warning',
        message: 'No es posible vender artículos con inventario cuando la cantidad es igual a 0.',
      });
      return;
    }

    if (this.orderMaintenances().some((row) => !(row.bodegaId > 0))) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la bodega en el detalle de los artículos',
      });
      return;
    }

    if ((!this.detailCustom && this.codDoc === DOC_TYPE.FV) || this.codDoc === DOC_TYPE.NE) {
      if (
        !this.orderDetails().every((od) =>
          this.orderMaintenances().some((item) => item.orderDetailId === od.orderDetailId),
        )
      ) {
        this.tS.show({
          type: 'warning',
          message:
            'Cuando el orden se guarda como documento, todos los equipos deben tener al menos un producto agregado.',
        });
        return;
      }
    }

    if (this.order.total <= 0) {
      this.tS.show({
        type: 'warning',
        message: 'No se puede generar el documento con valor total 0!',
      });
      return;
    }

    return true;
  }

  saveOptions(codDoc?: DOC_TYPE) {
    this.codDoc = codDoc;
    if (!this.isValidForm()) return;

    Swal.fire({
      text: '¿Estás seguro de que deseas guardar este documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.save();
      }
    });
  }

  save() {
    try {
      let detalles: any[] = [];
      let customDetails: any[] = [];

      if (this.detailCustom) {
        detalles = this.cloneOrderMaintenances().map((item) => {
          return {
            ...item,
            envioSri: false,
          };
        });

        customDetails = this.orderMaintenances().map((item) => {
          return {
            ...item,
            envioSri: true,
            isGroup: true,
          };
        });
      } else {
        detalles = this.orderMaintenances().map((item) => {
          return {
            ...item,
            envioSri: true,
          };
        });
      }

      const obj = {
        order: {
          ...this.order,
          codDoc: this.codDoc,
        },
        detalles,
        customDetails,
      };
      const params = orderMaintenanceAdapter.to(obj);
      console.log(params);

      this.orderMaintenanceSvc.post(params).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code === '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.show({
                type: 'success',
                message: response.message,
              });
              this.modalRef.close(response);
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
