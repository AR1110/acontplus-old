import { Component, inject, Input } from '@angular/core';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faListAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProductSearchPopupComponent } from '@modules/inventory/shared/components/product/product-search-popup/product-search-popup.component';
import { ProductSearchComponent } from '@modules/inventory/shared/components/product/product-search/product-search.component';
import { SupportDetailService } from '@modules/mechanical/services/support-detail.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-support-maintenance-modal',
  standalone: true,
  imports: [
    FontAwesomeModule,
    TabulatorComponent,
    ProductSearchComponent,

    ProductSearchPopupComponent
  ],
  templateUrl: './support-maintenance-modal.component.html',
})
export class SupportMaintenanceModalComponent {
  @Input() params = {
    id: 0
  }
  modal = inject(NgbActiveModal)

  supportDetailSvc = inject(SupportDetailService)

  details: any[] = [];

  bodegas: any = []
  taxes: any[] = []
  taxPercents: any[] = []



  products: any[] =  [
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
      validator: "required",
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
        console.log(response)
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })


  }


  cellEdited($event: any) {

  }

}
