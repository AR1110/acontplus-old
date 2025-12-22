import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TabulatorTable } from '@acontplus/ng-components';
import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { isApiResponse } from '@core/models/api-response-legacy';
import { FormsModule } from '@angular/forms';

import { ProductSearchOverlayComponent } from '@inventory/ui/product/components/product-search-overlay/product-search-overlay.component';
import {
  ColSupportMaintenanceDetail,
  SupportMaintenanceDetail,
} from '@mechanical/domain/models/support-maintenance.model';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DrawTaxTotalComponent } from '@shared/components/draw-tax-total/draw-tax-total.component';
import { SupportMaintenanceAdapter } from '@mechanical/data/adapters/support-maintenance.adapter';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import { SupportDetailUseCase } from '@mechanical/application/use-cases/support-detail.use-case';
import { getCantidadStock, mergeProductStock } from '@inventory/utils/product-stock.util';
import { Button } from '@acontplus/ng-components';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { ConsolidacionBodega } from '@inventory/data/models/consolidacion-bodega.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { DecimalSale } from '@sale/domain/models/decimal-sale.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Tarifa } from '@inventory/data/models/tarifa.model';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-maintenance-modal',
  imports: [
    FormsModule,
    MatIcon,
    TabulatorTable,
    DrawTaxTotalComponent,
    ProductSearchOverlayComponent,
    MatButtonModule,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Button,
  ],
  templateUrl: './support-maintenance-modal.component.html',
})
export class SupportMaintenanceModalComponent implements OnInit {
  params = inject<{
    id: 0;
  }>(MAT_DIALOG_DATA);

  modal = inject(MatDialogRef<SupportMaintenanceModalComponent>);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);

  private supportDetailUseCase = inject(SupportDetailUseCase);
  private tS = inject(ToastrNotificationService);

  readonly tabulatorComponent = viewChild.required(TabulatorTable);

  data = {
    id: 0,
    puntoEmisionId: 0,
    ptoEmi: null,
    establecimiento: null,
    establecimientoId: 0,
    vehicleCompanyId: 0,
    customerId: 0,
    fechaEmision: new Date(),
    sequence: '',
    obs: null,
    userAssignedId: 0,
    businessName: '',
    idCard: '',
    address: null,
    telephone: null,
    email: null,
    codEstab: '',
    bodegaId: 0,
    feeId: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    total: 0,
  };
  cloneData = {
    bodegaId: 0,
    feeId: 0,
  };
  details = signal<SupportMaintenanceDetail[]>([]);
  detailsDeleted = signal<SupportMaintenanceDetail[]>([]);

  estabs = signal<GroupedEstab[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);
  taxes = signal<any[]>([]);
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

  companyCustomer: any = {};
  vehicle = signal<any>({});

  //Draw Totals Tax
  htmlImpuestoTotal = signal('');
  htmlIvaTotal = signal('');

  productSearch = {
    textSearch: '',
  };

  feeds = signal<Tarifa[]>([]);
  validatorNumber = ['required', 'number'];

  fechaLegible = '';

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

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

  askToDelete(data: SupportMaintenanceDetail) {
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
          const details = structuredClone(this.details());
          const index = details.findIndex((r) => r.rowguid === data.rowguid);
          details.splice(index, 1);
          this.details.set(details);

          if (data.id > 0) {
            this.detailsDeleted.update((prev) => [
              ...prev,
              {
                ...data,
                enabled: false,
                deleted: true,
              },
            ]);
          }

          this.drawImpuestoTotales();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  columns = [
    {
      formatter: 'rownum',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `x`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-xs', 'btn-sm');
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          this.askToDelete(rowData);
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);

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
      // formatter: (cell:any) =>{
      //   return cell.getValue().toUpperCase();
      // },
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
    },

    // {
    //   title: 'Imp.',
    //   field: 'taxId',
    //   headerSort: false,
    //   headerHozAlign: "center",
    //   width: "7px",
    //   editor: this.comboEditor,

    //   editorParams: () => this.taxes,
    //   formatter: function (cell: any, formatterParams: any) {
    //     for (var i = 0; i < formatterParams.length; i++) {

    //       if (formatterParams[i].idImpuesto == cell.getValue()) {
    //         return formatterParams[i].descripcion;
    //       }
    //     }
    //   },
    //   formatterParams: () => this.taxes,
    //   validator: "required",
    // },
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
    },
    {
      title: 'Precio U.',
      field: 'price',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      formatterParams: { precision: false },
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      formatterParams: { stars: 6 },
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
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

  tabulatorOptions = {
    // movableRows: true,
    height: '100%',
  };

  ngOnInit(): void {
    this.supportDetailUseCase.getId(this.params.id).subscribe((response) => {
      this.data = {
        ...this.data,
        ...response.data,
      };

      this.fechaLegible = new Date(this.data.fechaEmision).toLocaleDateString('es-ES');

      this.estabs.set(response.estabs);
      this.taxPercents.set(response.tarifasImpuesto);
      this.feeds.set(response.feeds);
      this.vehicle.set(response.vehicle);
      this.decimal = response.decimal;

      this.details.set(response.details);
      const dataEstab = this.estabs().find(
        (e) => e.idEstablecimiento === this.data.establecimientoId,
      );
      if (dataEstab) {
        this.bodegas.set(dataEstab.bodegas);
        const dataBodega = this.bodegas().find((b) => b.defaultBodega);
        if (dataBodega) {
          this.data.bodegaId = dataBodega.idBodega;
        }
      }

      const dataTarifa = this.feeds().find((t) => t.predeterminada);
      if (dataTarifa) {
        this.data.feeId = dataTarifa.idTarifa;
        this.cloneData.feeId = dataTarifa.idTarifa;
      }

      this.drawImpuestoTotales();
    });
  }

  showVehicleInfo(): void {
    Swal.fire({
      title: 'Información del Vehículo',
      html: `
        <p><strong>Marca:</strong> ${this.vehicle().brand}</p>
        <p><strong>Modelo:</strong> ${this.vehicle().model}</p>
        <p><strong>Año de Fabricación:</strong> ${this.vehicle().year}</p>
        <p><strong>Color:</strong> ${this.vehicle().color}</p>
        <p><strong>Motor:</strong> ${this.vehicle().engine}</p>
        <p><strong>Chasis:</strong> ${this.vehicle().chassis}</p>
        <p><strong>Cilindraje:</strong> ${this.vehicle().cylindraje}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  }

  showClientInfo(): void {
    Swal.fire({
      title: 'Información del Cliente',
      html: `
        <p><strong>RUC/Cédula:</strong> ${this.data.idCard}</p>
        <p><strong>Dirección:</strong> ${this.data.address}</p>
        <p><strong>Correo:</strong> ${this.data.email}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  }

  getDataRowEmpty() {
    return new SupportMaintenanceDetail();
  }

  onResultSelectedProduct(response: any) {
    const tempDetails = structuredClone(this.details());

    const product = response.product;
    const medidas = response.medidas as MedidaProducto[];
    const consolidacionesFecha = response.consolidacionesFecha as ConsolidacionBodega[];

    let row = this.getDataRowEmpty();
    const dataTaxPercent = this.taxPercents().find((d) => d.codigo === product.codigoPorcentaje);

    const findDataProduct = tempDetails.find(
      (item) => item.llevaInventario && item.productId === product.idArticulo,
    );

    row.productId = product.idArticulo;
    row.codigo = product.codigoArticulo;
    row.descripcion = product.descripcion;
    row.bodegaId = this.data.bodegaId;
    row.llevaInventario = product.llevaInventario;
    row.consolidacionesBodega = consolidacionesFecha;

    if (dataTaxPercent) {
      row.taxPercentId = dataTaxPercent.idTarifaImpuesto;
      row.taxId = dataTaxPercent.idImpuesto;
    }

    const dataMedida = medidas.find((m) => m.defaultMedida);

    if (dataMedida) {
      row.medidas = medidas;
      row.quantity = 1;
      row.tarifas = dataMedida.tarifas;
      row.medidaId = dataMedida.idMedida;
      row.cost = dataMedida.precioCosto;
      row.costoFraccionado = dataMedida.precioCostoFraccionado;
      row.conversion = dataMedida.conversion;

      const dataTarifa = row.tarifas.find((t) => t.defaultTarifa);

      row.feeId = dataTarifa?.idTarifa ?? 0;
      row.price = dataTarifa?.precioVenta ?? 0;
      row.precioConIva = dataTarifa?.precioConIva ?? 0;
    }

    //Producto de tipo Servicio
    if (!product.llevaInventario) {
      tempDetails.push(row);
      this.details.set(tempDetails);
      this.setCalculoTotales('quantity', row, undefined);
      return;
    }

    //Producto que lleva inventario
    if (product.llevaInventario) {
      let oldValue = 1;
      const productsDuplicated = structuredClone(tempDetails).filter(
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
        tempDetails.push(row);
        this.details.set(tempDetails);
      }

      const dataProductMerge = mergeProductStock({
        rows: structuredClone(productsDuplicated),
        row: structuredClone(row),
      });

      const cantidadStock = getCantidadStock({
        fechaEmision: this.data.fechaEmision,
        bodegaId: this.data.bodegaId,
        cantidadStock: dataProductMerge.cantidadStock,
        consolidacionesFecha: row.consolidacionesBodega,
      });
      this._PRODUCT_SERVICE
        .checkNotificationStock({
          idArticulo: row.productId,
          idBodega: this.data.bodegaId,
          idMedida: row.medidaId,
          cantidad: cantidadStock,
        })
        .subscribe({
          next: async (response) => {
            if (isApiResponse(response)) {
              const { code, message, titleSms } = response;

              if (code === '1') {
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
                }
              }
            }
          },
          error(error) {
            console.log(error);
          },
        });
    }
  }

  async onChangeBodega() {
    try {
      const bodega = this.bodegas().find((item) => item.idBodega === this.data.bodegaId);
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

      if (!isConfirmed) {
        this.data.bodegaId = this.cloneData.bodegaId;
        return;
      }

      this.cloneData.bodegaId = this.data.bodegaId;

      if (this.details().length === 0) return;

      this.setIdBodegaInDetalle();
      this.resetCantidadToZeroAndRecalculateTotals();
    } catch (error) {
      console.log(error);
    }
  }

  setIdBodegaInDetalle() {
    for (const item of this.details()) {
      item.bodegaId = this.data.bodegaId;
    }
  }

  resetCantidadToZeroAndRecalculateTotals() {
    try {
      for (const row of this.details()) {
        if (!row.llevaInventario) continue;

        row.quantity = 0;

        this.setCalculoTotales('quantity', row, undefined);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onChangeFee() {
    try {
      // if (!$scope.permisoComprobanteVenta.tarifa) {
      //   $scope.infrastructure.idTarifa = $scope.dataClone.idTarifa;
      //   tS.toastr('warning', 'No tienes permiso para realizar esta acción');
      //   return
      // }

      const tarifa = this.feeds().find((item) => item.idTarifa === this.data.feeId);
      const { isConfirmed } = await Swal.fire({
        html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa?.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: `Sí, cambiar!`,
        cancelButtonText: 'No, cancelar!',
        allowOutsideClick: false,
      });

      if (!isConfirmed) {
        this.data.feeId = this.cloneData.feeId;
        return;
      }

      this.cloneData.feeId = this.data.feeId;

      if (this.details().length === 0) return;

      this.salesDetailCalculationSvc.setFeeInDetail({
        generalFeeId: this.data.feeId,
        items: this.details(),
        decimal: this.decimal,
        columnDefs: this.columns,
        tarifasImpuesto: this.taxPercents(),
      });

      this.drawImpuestoTotales();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * @param {*} column nombre de la columnas
   * @param {*} data  infrastructure row
   * @param {*} oldValue valor anterior de la columna
   */
  setCalculoTotales(column: any, data: SupportMaintenanceDetail, oldValue?: string | number) {
    const obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      generalFeeId: this.data.feeId,
      decimal: this.decimal,
      columnDefs: this.columns,
    });

    const row = this.tabulatorComponent()
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

  drawImpuestoTotales() {
    try {
      const {
        subTotalSinImpuesto,
        htmlImpuestoTotal,
        htmlIvaTotal,

        importeTotal,
        discount,
        percentageDiscount,
      } = this.salesDetailCalculationSvc.getTaxTotals({
        items: this.details(),
        decimal: this.decimal,
        tarifasImpuesto: this.taxPercents(),
      });

      this.data.subTotalSinImpuesto = subTotalSinImpuesto;
      this.data.total = importeTotal;
      this.data.discount = discount;
      this.data.percentageDiscount = percentageDiscount;
      // this.infrastructure.tip = propina;
      this.htmlImpuestoTotal.set(htmlImpuestoTotal);
      this.htmlIvaTotal.set(htmlIvaTotal);
    } catch (error) {
      console.log(error);
    }
  }

  cellEdited(cell: any) {
    const row = cell.getRow();
    const column: ColSupportMaintenanceDetail = cell.getColumn().getField();
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

  private isValidForm() {
    if (this.details().length === 0) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese al menos un artículo en el detalle',
      });
      return;
    }

    if (this.details().some((row) => row.llevaInventario && row.quantity === 0)) {
      this.tS.show({
        type: 'warning',
        message: 'No es posible vender artículos con inventario cuando la cantidad es igual a 0.',
      });
      return;
    }

    if (this.details().some((row) => !(row.bodegaId > 0))) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la bodega en el detalle de los artículos',
      });
      return;
    }

    if (this.data.total <= 0) {
      this.tS.show({
        type: 'warning',
        message: 'No se puede generar el documento con valor total 0!',
      });
      return;
    }

    return true;
  }

  async save() {
    try {
      if (!this.isValidForm()) return;

      const { isConfirmed } = await Swal.fire({
        text: '¿Estás seguro de que deseas guardar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });

      if (!isConfirmed) return;

      const obj = {
        data: structuredClone(this.data),
        details: this.details(),
        detailsDeleted: this.detailsDeleted(),
      };
      const params = SupportMaintenanceAdapter.to(obj);

      this.supportDetailUseCase.post(params).subscribe((response) => {
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
            this.modal.close(response);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
