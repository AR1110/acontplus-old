import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { formatDateToString } from '@/core/utils/date.util';
import { getValidId } from '@/core/utils/utils';
import { OrderRead } from '@/models/order.model';
import { Pagination } from '@/models/pagination.model';
import { OrderService } from '@/services/order.service';
import { MainStoreService } from '@/store/main-store.service';
import { Component, computed, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';

import { OrderListComponent } from '../order-list/order-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    OrderListComponent,
    CustomContainerDialogComponent
  ],
  templateUrl: './order-list-modal.component.html',
  styleUrl: './order-list-modal.component.scss'
})
export class OrderListModalComponent {
  readonly dialogRef = inject(MatDialogRef<OrderListModalComponent>);
  private mainStoreSvc = inject(MainStoreService)
  private orderSvc = inject(OrderService)
  data: OrderRead[] = [];

  isLoadingResults = false;

  pagination = new Pagination();

  isFinished = computed(() => this.typeListOrder() === 'CD')
  typeListOrder = model('SD')

  dataSearch = {
    userId: 0,
    tableId: 0,
    typeListOrder: 'SD',
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
  }

  getOrders() {
    let params = {
      isSearchDate: true,
      establecimientoId: getValidId(this.mainStoreSvc.state().establecimientoId),
      puntoEmisionId: getValidId(this.mainStoreSvc.state().puntoEmisionId),
      startDate: this.dataSearch.startDate,
      endDate: this.dataSearch.endDate,
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize,
      finished: this.isFinished()
    }
    this.isLoadingResults = true;

    this.orderSvc.getAll(params).subscribe({
      next: (response) => {
        this.data = response;
        this.pagination.totalRecords = this.data.length > 0 ? this.data[0].totalRecords : 0
      },
      error: () => this.isLoadingResults = false,
      complete: () => {
        this.isLoadingResults = false
      }
    })
  }

  refresh() {
    this.getOrders()
  }
  ngOnInit(){
    this.getOrders()
  }




  handlePageEvent(e: PageEvent) {
    this.pagination.totalRecords = e.length;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;

    this.refresh()
  }

  onChangeTypeListOrder() {
    if (this.isLoadingResults) return
    this.pagination = new Pagination()
    this.refresh()
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
