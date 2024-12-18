import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderListComponent } from '@ui/views/order-list/order-list.component';
import { Router } from '@angular/router';
import { formatDateToString } from '@domain/utils/utils/date.util';
import { STATUS_ORDER } from '@domain/enums/main.enum';

@Component({
    selector: 'app-orders',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        OrderListComponent
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  private router = inject(Router)

  dataSearch = {
    userId: 0,
    tableId: 0,
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    customerCompanyId: 0,
    selectedStatus: STATUS_ORDER.PENDIENTE,
    typeSearchCustomer: 'OR'
  }

  navigateToPos() {
    this.router.navigateByUrl('/pos')
  }
}
