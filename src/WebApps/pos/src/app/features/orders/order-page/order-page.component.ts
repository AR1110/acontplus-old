import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderListComponent } from '../components/order-list/order-list.component';
import { Router } from '@angular/router';
import { formatDateToString } from '@/shared/utils/date.util';
import { STATUS_ORDER } from '@/shared/enums/main.enum';

@Component({
    selector: 'app-order-page',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        OrderListComponent
    ],
    templateUrl: './order-page.component.html',
    styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
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
