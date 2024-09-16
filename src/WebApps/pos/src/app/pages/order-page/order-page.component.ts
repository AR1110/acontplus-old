import { formatDateToString } from '@/core/utils/date.util';
import { STATUS_ORDER } from '@/enums/main.enum';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

import { OrderListComponent } from './components/order-list/order-list.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    OrderListComponent
  ],
  templateUrl: './order-page.component.html',
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

