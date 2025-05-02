import { CustomContainerDialogComponent } from '@ui/components/custom-container-dialog/custom-container-dialog.component';

import {Component, inject, OnInit, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TableOrdersComponent } from '@ui/orders/components/table-orders/table-orders.component';
import {OrderStore} from "@ui/store/order.store";

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
  $orderStore = inject(OrderStore)

  ngOnInit() {
    this.$orderStore.setPropDataSearch("tableId", this.matDialogData.tableId);
    this.$orderStore.setPropDataSearch("roomId", this.matDialogData.roomId);
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
