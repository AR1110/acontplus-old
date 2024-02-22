import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from '@core/components/product-search/product-search.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProductService } from '@modules/inventory/services/product.service';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-maintenance-modal',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAccordionModule,
    ProductSearchComponent,
    ReactiveFormsModule,
    TabulatorComponent,
  ],
  templateUrl: './order-maintenance-modal.component.html',
  styles: ``,
})
export class OrderMaintenanceModalComponent implements OnInit {
  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  bodegas: any = [];
  columnNames = [
    {
      field: 'id',
      visible: false,
    },
    {
      title: 'Producto / Servicio',
      field: 'productName',
      width: '250',
      editor: true,
    },
    {
      editor: this.selectBodega,
      formatter: this.formatterBodega,
      field: 'idBodega',
      hozAlign: 'center',
      title: 'Bodega',
      width: '250',
    },
    {
      editor: this.selectFee,
      formatter: this.formatterFee,
      cellEdited: this.calculateTotal,
      field: 'idTarifa',
      hozAlign: 'center',
      title: 'Tarifa',
      typeNumber: true,
      width: '250',
    },
    {
      title: 'Cantidad',
      field: 'quantity',
      width: '250',
      editor: true,
    },
    {
      title: 'Precio',
      field: 'price',
      width: '150',
    },
    {
      title: 'Impuesto',
      field: 'tax',
      width: '150',
      editor: true,
    },
    {
      title: 'Total',
      field: 'total',
      width: '150',
    },
    {
      cellClick: (e: any, cell: any) => {
        this.removeFromList(cell.getData().deviceId);
        cell.getRow().delete();
      },
      formatter: this.deleteButton,
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];
  establecimientos: any = [];
  medidas: any = [];
  orderDetails: any = [];
  orderMaintenances: any = [];
  params: any = {};

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
  closeModal() {
    this.modalRef.close();
  }
  deleteButton(cell: any, formatterParams: any) {
    //cell - the cell component
    //formatterParams - parameters set for the column

    //get the row data
    let data = cell.getRow().getData();

    //return the HTML code for the button, using Bootstrap classes and Angular routerLink
    return `<button class='btn btn-danger btn-sm' title='Eliminar'>${icon(
      faTrashAlt
    ).html.join('')}</button>
    <button class='btn btn-warning btn-sm' title='Editar producto'>${icon(
      faEdit
    ).html.join('')}</button>`;
  }

  formatterBodega(cell: any) {
    let bodegas = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (row.bodegas != undefined && value != undefined) {
      bodegas = row.bodegas;

      return bodegas.find((x: any) => x.idBodega == value).bodega;
    }
    return 'SELECCIONE';
  }

  formatterFee(cell: any) {
    let fees = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (row.fees != undefined && value != undefined) {
      fees = row.fees;

      return fees.find((x: any) => x.idTarifa == value).tarifa;
    }
    return '';
  }
  get() {
    showLoader();
    this.orderService
      .get(JSON.stringify({ tipo: 4, id: this.params.id }))
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            let dataTemp = JSON.parse(response.payload as string);
            console.log(dataTemp);
            this.orderDetails = dataTemp['orderDetails'];
            this.orderMaintenances = dataTemp['orderMaintenances'] || [];
            this.establecimientos = dataTemp['estabs'] || [];
            this.bodegas = dataTemp['bodegas'] || [];
            if (this.orderMaintenances.length > 0) {
              this.orderMaintenances = [...this.orderMaintenances];
            }
          }
        },
        complete() {
          hideLoader();
        },
        error(err) {
          console.log(err);
          hideLoader();
        },
      });
  }
  ngOnInit(): void {
    this.get();
  }
  onProductSelected($event: any) {
    let { data } = $event;
    console.log(data);
    if (data.idArticulo > 0) {
      this.productService
        .get(JSON.stringify({ idArticulo: data.idArticulo, tipo: 6 }))
        .subscribe({
          next: (response) => {
            if (isApiResponse(response)) {
              let productData = JSON.parse(response.payload as string);
              console.log(productData);
              let fees =
              this.orderMaintenances.push({
                productId: data.idArticulo,
                productName: data.descripcion,
                quantity: 1,
                bodegas: this.bodegas,
                fees: JSON.parse(productData[2][0]['tarifas']),
                price: 0,
              });
            }
          },
        });
    }
    // this.orderMaintenances.push({
    //   productId: data.idArticulo,
    //   productName: data.descripcion,
    // });
  }
  removeFromList(deviceId: number) {
    let newArray = this.orderMaintenances.filter(
      (x: { deviceId: number }) => x.deviceId !== deviceId
    );
    this.orderMaintenances = newArray;
  }

  selectBodega(cell: any, onRendered: any, success: any, cancel: any) {
    let bodegas = [];
    let rows = cell.getRow().getData();

    if (rows.bodegas != undefined || rows.bodegas != null) {
      bodegas = rows.bodegas;
    }

    let selectList = document.createElement('select');
    selectList.style.width = '100%';
    selectList.style.boxSizing = 'border-box';

    onRendered(function () {
      selectList.focus();
      selectList.style.height = '100%';
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.bodega = selectList.selectedOptions[0].text;
        cell.getElement().dataset.idBodega =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener('blur', onChange);

    for (let i = 0; i < bodegas.length; i++) {
      let option = document.createElement('option');

      option.value = bodegas[i].idBodega.toString();
      option.text = bodegas[i].bodega;
      if (bodegas[i].idBodega === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    console.log(selectList);
    return selectList;
  }

  selectFee(cell: any, onRendered: any, success: any, cancel: any) {
    let fees = [];
    let rows = cell.getRow().getData();

    if (rows.tarifas != undefined || rows.tarifas != null) {
      fees = rows.tarifas;
    }

    let selectList = document.createElement('select');
    selectList.style.width = '100%';
    selectList.style.boxSizing = 'border-box';

    onRendered(function () {
      selectList.focus();
      selectList.style.height = '100%';
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.tarifa = selectList.selectedOptions[0].text;
        cell.getElement().dataset.feeId = selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener('blur', onChange);

    for (let i = 0; i < fees.length; i++) {
      let option = document.createElement('option');

      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idTarifa === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  }
  save() {}
}
