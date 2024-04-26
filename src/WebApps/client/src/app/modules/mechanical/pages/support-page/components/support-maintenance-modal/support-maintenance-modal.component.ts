import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faListAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProductSale } from '@modules/inventory/models/product.model';
import { ProductService } from '@modules/inventory/services/product.service';
import { ProductSearchComponent } from '@modules/inventory/shared/components/product/product-search/product-search.component';
import { ProductSearchPopupDirective } from '@modules/inventory/shared/directives/product/product-search-popup.directive';
import { ConsolidacionBodega } from '@modules/inventory/shared/models/consolidacion-bodega.model';
import { MedidaProducto } from '@modules/inventory/shared/models/measure.model';
import { OpenModalProductService } from '@modules/inventory/shared/services/open-modal-product.service';
import { getCantidadStock, mergeProductStock } from '@modules/inventory/utils/product-stock.util';
import { ColSupportMaintenanceDetail, SupportMaintenanceDetail } from '@modules/mechanical/models/support-maintenance.model';
import { SupportDetailService } from '@modules/mechanical/services/support-detail.service';
import { DecimalSale } from '@modules/sale/shared/models/decimal-sale.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-maintenance-modal',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    TabulatorComponent,
    ProductSearchComponent,
    ProductSearchPopupDirective
  ],
  templateUrl: './support-maintenance-modal.component.html',
})
export class SupportMaintenanceModalComponent {
  @Input() params = {
    id: 0
  }

  modal = inject(NgbActiveModal)
  private productSvc = inject(ProductService);
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);
  private openModalProductSvc = inject(OpenModalProductService)

  supportDetailSvc = inject(SupportDetailService)

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  data = {
    id: 0,
    puntoEmisionId: 0,
    establecimientoId: 0,
    vehicleCompanyId: 0,
    customerId: 0,
    fechaEmision: new Date(),
    sequence: "",
    obs: null,
    userAssignedId: 0,
    businessName: "",
    idCard: "",
    address: null,
    telephone: null,
    email: null,
    codEstab: "",
    bodegaId: 0,
    feeId: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    total: 0
  }
  cloneData = {
    bodegaId: 0
  }
  details: SupportMaintenanceDetail[] = [];

  estabs: GroupedEstab[] = []
  bodegas: GroupedEstabBodega[] = []
  taxes: any[] = []
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

  //Draw Totals Tax
  htmlImpuestoTotal = '';
  htmlIvaTotal = '';

  productSearch = {
    textSearch: ''
  }

  products: any[] = [
    {
      showHeader: true,
      idArticulo: 224602,
      codigo: '*CASALT4200CBBK',
      descripcion: 'CASE ALTEK MID-TOWER 4200 TEC-MOU-PAR USB3.0 NEGRO',
      iva: '12%',
      stock: 0,
      subFamilia: 'REPUESTOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":42.00000},{"tarifa":"DSTO","precio":38.00000},{"tarifa":"TAR","precio":48.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 235252,
      codigo: '*CASGAZCMB3405BK',
      descripcion: 'CASE GAZAL COMBO 3405-1 TECL. PARL. MOUSE. NEGRO',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":45.00000},{"tarifa":"DSTO","precio":42.00000},{"tarifa":"TAR","precio":48.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 224607,
      codigo: '*ID225XTK20',
      descripcion: 'COMBO TECLADO MOUSE XTECH MULTIMEDIA WIRLESS SPANISH XTK-309S',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":19.50000},{"tarifa":"DSTO","precio":18.00000},{"tarifa":"TAR","precio":22.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 249447,
      codigo: '*GENCOMUSB31330003401',
      descripcion: 'COMBO TECLADO Y MOUSE GENIUS KM-200 USB NEGRO',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":15.00000},{"tarifa":"DSTO","precio":14.00000},{"tarifa":"TAR","precio":16.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/10873054-6645-416c-b4de-1bc48925a833.webp',
      s3ObjectKey: '2293530915001/articulos/10873054-6645-416c-b4de-1bc48925a833.webp',
      totalRecords: 24
    },
    {
      idArticulo: 249449,
      codigo: '*GENMOUWIR31340014401',
      descripcion: 'COMBO TECLADO Y MOUSE GENIUS KM-8101 WIRELESS NEGRO/RF 2.4GHZ',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":22.00000},{"tarifa":"DSTO","precio":20.00000},{"tarifa":"TAR","precio":24.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/2db6d504-1468-4aa3-a060-879acaf70226.jpg',
      s3ObjectKey: '2293530915001/articulos/2db6d504-1468-4aa3-a060-879acaf70226.jpg',
      totalRecords: 24
    },
    {
      idArticulo: 249448,
      codigo: '*GENCOMUSB31330007401',
      descripcion: 'COMBO TECLADO Y MOUSE GENIUS SLIMSTAR C126 USB NEGRO / SMART KEY',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":16.00000},{"tarifa":"DSTO","precio":15.00000},{"tarifa":"TAR","precio":17.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/37b9557b-bde7-4cf2-9472-360c9dcbb0c2.webp',
      s3ObjectKey: '2293530915001/articulos/37b9557b-bde7-4cf2-9472-360c9dcbb0c2.webp',
      totalRecords: 24
    },
    {
      idArticulo: 224611,
      codigo: '*KEYQUAQC4400UBK',
      descripcion: 'COMBO TECLADO-MOUSE QUASAD Wired 1.5mts QC-4400U Negro',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":12.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 256984,
      codigo: '*ASUCOMPORX1504ZA-NJ726',
      descripcion: 'COMPUTADOR ASUS X1504ZA-NJ726 CORE I7-1255U/16GB/512GB/15.6FHD/NO OS/MOUSE/BLUE',
      iva: '12%',
      stock: 1,
      subFamilia: 'EQUIPOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":855.00000},{"tarifa":"DSTO","precio":0.00000},{"tarifa":"TAR","precio":0.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 199513,
      codigo: '*ACC3',
      descripcion: 'GEL MOUSE PAD XTA526 XTECH',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":7.00000},{"tarifa":"DSTO","precio":0.00000},{"tarifa":"TAR","precio":0.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 199485,
      codigo: '*MOUGENDX110UBG5',
      descripcion: 'MOUSE GENIUS DX-110 USB Negro G5',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":5.00000},{"tarifa":"DSTO","precio":4.00000},{"tarifa":"TAR","precio":6.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 249414,
      codigo: '*MOUGENERG8200SI',
      descripcion: 'MOUSE GENIUS ERGO-8200S Wireless Silent Iron Gray',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":15.00000},{"tarifa":"DSTO","precio":13.00000},{"tarifa":"TAR","precio":17.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/4607f08d-a4b3-4716-815b-801d66be42b4.png',
      s3ObjectKey: '2293530915001/articulos/4607f08d-a4b3-4716-815b-801d66be42b4.png',
      totalRecords: 24
    },
    {
      idArticulo: 228496,
      codigo: '*MOUGENMT900SBKN',
      descripcion: 'MOUSE GENIUS MICRO TRAVELER 900S WIRELESS USB Negro NP',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":18.00000},{"tarifa":"DSTO","precio":16.00000},{"tarifa":"TAR","precio":20.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 199488,
      codigo: '*MOUGENNX7005BLK',
      descripcion: 'MOUSE GENIUS NX-7005 Wireless Negro',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":9.00000},{"tarifa":"DSTO","precio":8.00000},{"tarifa":"TAR","precio":10.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: null,
      s3ObjectKey: null,
      totalRecords: 24
    },
    {
      idArticulo: 246274,
      codigo: '*MOUGENNX7015CHO',
      descripcion: 'MOUSE GENIUS NX-7015 CHOCOLATE Wireless New Package',
      iva: '12%',
      stock: 0,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: 'badge badge-danger',
      priceSale: '[{"tarifa":"CONT","precio":12.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/da404feb-1c8b-424e-ba01-356e62014324.jpg',
      s3ObjectKey: '2293530915001/articulos/da404feb-1c8b-424e-ba01-356e62014324.jpg',
      totalRecords: 24
    },
    {
      idArticulo: 246273,
      codigo: '*MOUGENNX7015UIG',
      descripcion: 'MOUSE GENIUS NX-7015 Wireless IRON-GGRAY BLISTER',
      iva: '12%',
      stock: 1,
      subFamilia: 'ACCESORIOS',
      marca: null,
      medida: 'UNI',
      fraccionado: '',
      style: '',
      priceSale: '[{"tarifa":"CONT","precio":10.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
      warehouses: '[{"ubicacion":"SN"}]',
      precioSinSubsidio: 0,
      s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/8bbb9144-91ec-4d42-a06b-ab220dccdd70.webp',
      s3ObjectKey: '2293530915001/articulos/8bbb9144-91ec-4d42-a06b-ab220dccdd70.webp',
      totalRecords: 24
    }
  ];


  validatorNumber = ["required", "number"]

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    let column: any = cell.getColumn().getField();
    let data: any = cell.getData();
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


  columns = [

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
          //this.openModalProductEdit(rowData)
        });

        //create delete button
        let delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add("btn", "btn-danger", "btn-xs");
        delBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          // this.askToDelete(rowData)
        });

        //create kardex button
        let kardexBtn = document.createElement("button");
        kardexBtn.type = "button";
        kardexBtn.innerHTML = `${icon(faListAlt).html.join('')}`;
        kardexBtn.classList.add("btn", "btn-info", "btn-xs");
        kardexBtn.addEventListener("click", () => {
          let rowData = cell.getRow().getData();
          //this.openModalProductKardex(rowData)
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
      validator: "required",

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
      validator: "required",

    },
    {
      title: 'Precio U.',
      field: 'price',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "9px",
      validator: ["required"],
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      },
    },
    {
      title: 'Precio Iva.',
      field: 'precioConIva',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "9px",
      validator: ["required"],
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      },
    },
    {
      title: '%',
      field: 'percentageDiscount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      validator: ["required"],
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      },
    },
    {
      title: 'Desc.',
      field: 'discount',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: "6px",
      validator: ["required"],
      editor: "number", editorParams: {
        selectContents: true,
        verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
      },
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
    columns: this.columns,
    height: 0,
    layout: "fitDataStretch",
  }


  ngOnInit(): void {
    showLoader()
    this.supportDetailSvc.getId(this.params.id).subscribe({
      next: (response) => {
        hideLoader()
        this.data = response.data;
        this.estabs = response.estabs;
        this.taxPercents = response.tarifasImpuesto;
        let dataEstab = this.estabs.find(e => e.idEstablecimiento === this.data.establecimientoId);
        if (dataEstab) {
          this.bodegas = dataEstab.bodegas;
          let dataBodega = this.bodegas.find(b => b.defaultBodega);
          if (dataBodega) {
            this.data.bodegaId = dataBodega.idBodega;
          }
        }
        console.log(response)
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })


  }

  getDataRowEmpty() {
    let details = new SupportMaintenanceDetail()
    return details;
  }

  onResultSelectedProduct(response: any) {

    console.log(this.getDataRowEmpty())
    let product = response.product as ProductSale;
    let medidas = response.medidas as MedidaProducto[];
    let consolidacionesFecha = response.consolidacionesFecha as ConsolidacionBodega[]

    let row = this.getDataRowEmpty();
    let dataTaxPercent = this.taxPercents.find(d => d.codigo === product.codigoPorcentaje);



    let findDataProduct = this.details.find(item => item.llevaInventario && item.productId === product.idArticulo);



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

    let dataMedida = medidas.find(m => m.defaultMedida);

    if (dataMedida) {
      row.medidas = medidas;
      row.quantity = 1;
      row.tarifas = dataMedida.tarifas;
      row.medidaId = dataMedida.idMedida;
      row.cost = dataMedida.precioCosto;
      row.costoFraccionado = dataMedida.precioCostoFraccionado;
      row.conversion = dataMedida.conversion;

      let dataTarifa = row.tarifas.find(t => t.defaultTarifa);


      row.feeId = dataTarifa?.idTarifa ?? 0;
      row.price = dataTarifa?.precioVenta ?? 0;
      row.precioConIva = dataTarifa?.precioConIva ?? 0;

    }




    //Producto de tipo Servicio
    if (!product.llevaInventario) {
      this.details.push(row);
      this.setCalculoTotales("quantity", row, undefined)
      return
    }

    //Producto que lleva inventario
    if (product.llevaInventario) {
      let oldValue = 1;
      let productsDuplicated = structuredClone(this.details).filter(item => (
        item.llevaInventario && item.productId === product.idArticulo
      ))

      productsDuplicated.push({ ...row })


      // let cloneOrderMaintenances = structuredClone(this.orderMaintenances);
      // let findDataProduct = this.orderMaintenances.find(item => item.llevaInventario && item.productId === product.idArticulo);

      if (findDataProduct) {
        oldValue = findDataProduct.quantity;
        row = findDataProduct;
        row.quantity += 1;
      } else {
        this.details.push(row)
      }

      console.log(productsDuplicated)
      let dataProductMerge = mergeProductStock({
        rows: structuredClone(productsDuplicated),
        row: structuredClone(row)
      });

      console.log(dataProductMerge)


      let cantidadStock = getCantidadStock({
        fechaEmision: this.data.fechaEmision,
        bodegaId: this.data.bodegaId,
        cantidadStock: dataProductMerge.cantidadStock,
        consolidacionesFecha: row.consolidacionesBodega
      });

      showLoader();
      this.productSvc.checkNotificationStock({
        idArticulo: row.productId,
        idBodega: this.data.bodegaId,
        idMedida: row.medidaId,
        cantidad: cantidadStock
      }).subscribe({
        next: async (response) => {
          hideLoader();

          if (isApiResponse(response)) {

            let { code, message, titleSms } = response;

            if (code === "1") {
              console.log(row)
              this.setCalculoTotales("quantity", row, oldValue)
              return
            }

            let { isConfirmed } = await Swal.fire({
              title: `<small>${titleSms}</small>`,
              icon: 'warning',
              html: `<small>${message}</small>`,
              allowOutsideClick: false,
              allowEscapeKey: false,
            })

            if (isConfirmed) {
              if (code === "0") {
                row.quantity = oldValue;
                this.setCalculoTotales("quantity", row, oldValue)
              }
              if (code === "2") {

                this.setCalculoTotales("quantity", row, undefined);
              }
            }

          }
        },
        error(error) {
          hideLoader();
          console.log(error)
        }
      })

    }
  }

  /**
      *
      * @param {*} column nombre de la columnas
      * @param {*} data  data row
      * @param {*} oldValue valor anterior de la columna
      */
  setCalculoTotales(column: any, data: SupportMaintenanceDetail, oldValue?: string | number) {

    let obj = this.salesDetailCalculationSvc.calculateColDef({
      data: data,
      column,
      oldValue,
      generalFeeId: this.data.feeId,
      decimal: this.decimal,
      columnDefs: this.tabulatorOptions.columns
    });

    let row = this.tabulatorComponent.refTabulator.getRows().find(function (row) {
      return row.getData().rowguid === data.rowguid;
    });

    if (row) {
      row.update({
        data,
        ...obj
      })
    }


    this.drawImpuestoTotales();
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
        items: this.details,
        decimal: this.decimal,
        tarifasImpuesto: this.taxPercents,
      })

      this.data.subTotalSinImpuesto = subTotalSinImpuesto;
      this.data.total = importeTotal;
      this.data.discount = discount;
      this.data.percentageDiscount = percentageDiscount;
      // this.data.tip = propina;
      this.htmlImpuestoTotal = htmlImpuestoTotal;
      this.htmlIvaTotal = htmlIvaTotal;
    } catch (error) {
      console.log(error);
    }
  }

  cellEdited(cell: any) {
    let row = cell.getRow();
    let column: ColSupportMaintenanceDetail = cell.getColumn().getField();
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

}
