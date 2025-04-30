import {Component, inject, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderListComponent } from '@ui/orders/components/order-list/order-list.component';
import { Router } from '@angular/router';
import { formatDateToString } from '@domain/utils/date.util';
import {ROUTES_PATH, STATUS_ORDER} from '@domain/enums/main.enum';
import {PermissionStore} from "@ui/store/permission.store";
import {TableOrdersComponent} from "@ui/orders/components/table-orders/table-orders.component";

@Component({
    selector: 'app-orders',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        OrderListComponent,
      TableOrdersComponent
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  private router = inject(Router)
  $permissionStore = inject(PermissionStore)

  moreFilter = signal(false)

  oldTableId = 0;

  dataSearch = {
    userId: 0,
    tableId: 0,
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    customerCompanyId: 0,
    selectedStatus: STATUS_ORDER.PENDIENTE,
    typeSearchCustomer: 'OR',
    roomId: 0
  }

  navigateToPos() {
    this.router.navigateByUrl(ROUTES_PATH.POS).then()
  }

  ngOnInit(){
    this.$permissionStore.loadActions(ROUTES_PATH.ORDER)
  }

  handleChangeMoreFilter() {
    this.moreFilter.set(!this.moreFilter())
    if(this.moreFilter()){
      this.oldTableId = this.dataSearch.tableId;
      this.dataSearch.tableId = 0;
    }else{
    this.dataSearch.tableId = this.oldTableId;
    }
  }
}
