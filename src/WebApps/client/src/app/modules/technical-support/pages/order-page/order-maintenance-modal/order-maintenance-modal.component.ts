import { Component, OnInit, inject } from '@angular/core';
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
    TabulatorComponent,
  ],
  templateUrl: './order-maintenance-modal.component.html',
  styles: ``,
})
export class OrderMaintenanceModalComponent implements OnInit {
  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
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
      title: 'Cantidad',
      field: 'quantity',
      width: '250',
      editor: true,
    },
    {
      title: 'Precio',
      field: 'cost',
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

  orderDetails: any = [];
  orderMaintenances: any = [];
  params: any = {};
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
  get() {
    showLoader();
    this.orderService
      .get(JSON.stringify({ tipo: 4, id: this.params.id }))
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            let { orderDetails, orderMaintenances } = JSON.parse(
              response.payload as string
            );
            this.orderDetails = orderDetails;
            this.orderMaintenances = orderMaintenances;
            // if (this.orderMaintenances.length == 0) {
            //   this.orderMaintenances.push({
            //     id: 0,
            //     productName: 'test',
            //   });
            // }
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
              console.log(JSON.parse(response.payload as string));
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
  save() {}
}
