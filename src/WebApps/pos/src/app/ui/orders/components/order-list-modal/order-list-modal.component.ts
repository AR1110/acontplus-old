import { CustomContainerDialogComponent } from '@ui/components/custom-container-dialog/custom-container-dialog.component';
import { formatDateToString } from '@domain/utils/date.util';
import { Component, inject  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { OrderListComponent } from '@ui/orders/components/order-list/order-list.component';
import { STATUS_ORDER } from '@domain/enums/main.enum';

@Component({
    selector: 'app-order-list-modal',
    imports: [
        MatButtonModule,
        MatIconModule,
        OrderListComponent,
        CustomContainerDialogComponent
    ],
    templateUrl: './order-list-modal.component.html'
})
export class OrderListModalComponent {
  readonly matDialogData = inject<{ tableId: 0 }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<OrderListModalComponent>);

  dataSearch = {
    userId: 0,
    tableId: 0,
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    selectedStatus: STATUS_ORDER.PENDIENTE,
    typeSearchCustomer: 'OR'
  }

  ngOnInit(){
    this.dataSearch.tableId = this.matDialogData.tableId
  }



  closeDialog() {
    this.dialogRef.close()
  }
}
