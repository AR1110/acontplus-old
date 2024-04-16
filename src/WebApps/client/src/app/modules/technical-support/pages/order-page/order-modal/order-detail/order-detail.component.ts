import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
import { OrderDetailService } from '@modules/technical-support/services/order-detail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [TabulatorComponent],
  templateUrl: './order-detail.component.html',
  styles: ``,
})
export class OrderDetailComponent {
  @Input() orderDetails: OrderDetail[] = [];
  private oDS = inject(OrderDetailService);
  private tS = inject(ToasterService);
  columnNames = [
    { title: 'id', field: 'id', width: 150, visible: false },
    { title: 'deviceId', field: 'deviceId', width: 150, visible: false },
    {
      title: 'deviceCustomerId',
      field: 'deviceCustomerId',
      width: 150,
      visible: false,
    },
    { title: 'Equipo', field: 'deviceName', width: 225 },
    { title: 'Serie', field: 'deviceSerie', width: 200, editor: true },
    {
      title: 'Garantia',
      field: 'deviceWarranty',
      width: 150,
      validator: ['numeric', 'min:0'],
      editor: true,
    },
    { title: 'Obs.', field: 'obs', width: 450, editor: true },
    {
      formatter: (cell: any) => {
        //let cellEl = cell.getElement();
        let rowDataMain = cell.getRow().getData();

        //create edit button
        let editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `${icon(faEdit).html.join('')}`;
        editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        editBtn.addEventListener('click', () => {
          let rowData = cell.getRow().getData();
          // this.openEditDetail(rowData);
        });

        //create delete button
        let delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        delBtn.addEventListener('click', () => {
          let rowData = cell.getRow().getData();
          console.log(rowData);
          if (rowData.id > 0) {
            this.askToDelete(rowData);
          } else {
            this.removeFromList(rowData.deviceId);
          }
        });

        let buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        buttonHolder.appendChild(editBtn);
        return buttonHolder;
      },
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];

  askToDelete(detail: OrderDetail) {
    Swal.fire({
      icon: 'warning',
      text: `Esta seguro de eliminar este detalle?`,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((response) => {
      if (response.isConfirmed) {
        this.oDS.delete(detail.id).subscribe({
          next: (response) => {
            if (isApiResponse(response)) {
              this.tS.toastr({
                type: response.code == '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code == '1') {
                this.orderDetails = this.orderDetails.filter(
                  (x) => x.id != detail.id
                );
              }
            }
          },
          error(err) {
            console.log(err);
          },
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderDetails']) {
      console.log('changing')
      this.orderDetails = this.orderDetails;
    }
  }

  removeFromList(deviceId: number) {
    let newArray = this.orderDetails.filter((x) => x.deviceId !== deviceId);
    this.orderDetails = newArray;
  }
}
