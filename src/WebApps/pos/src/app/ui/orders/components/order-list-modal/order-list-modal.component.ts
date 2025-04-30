import { CustomContainerDialogComponent } from '@ui/components/custom-container-dialog/custom-container-dialog.component';
import { formatDateToString } from '@domain/utils/date.util';
import {Component, inject, OnInit, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { STATUS_ORDER } from '@domain/enums/main.enum';
import { TableOrdersComponent } from '@ui/orders/components/table-orders/table-orders.component';

@Component({
  selector: 'app-order-list-modal',
  imports: [
    MatButtonModule,
    MatIconModule,
    CustomContainerDialogComponent,
    TableOrdersComponent,
  ],
  templateUrl: './order-list-modal.component.html',
})
export class OrderListModalComponent implements OnInit {
  readonly matDialogData = inject<{ tableId: 0, roomId: 0 }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<OrderListModalComponent>);
   moreFilter = signal(false)
  private  oldTableId = 0;
  dataSearch = {
    userId: 0,
    tableId: 0,
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    selectedStatus: STATUS_ORDER.PENDIENTE,
    typeSearchCustomer: 'OR',
    customerCompanyId: 0,
    roomId: 0
  };

  ngOnInit() {
    this.dataSearch.tableId = this.matDialogData.tableId;
    this.dataSearch.roomId = this.matDialogData.roomId;
  }

  handleChangeMoreFilter() {
    this.moreFilter.set(!this.moreFilter())
    if(this.moreFilter()){
      this.oldTableId = this.dataSearch.tableId;
      this.dataSearch.tableId = 0;
    }else{
      this.dataSearch.tableId = this.oldTableId;
      this.dataSearch.customerCompanyId = 0;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
