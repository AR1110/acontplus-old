import { Component ,inject } from '@angular/core'; 
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";  
import { formatDateToString } from '@/core/utils/date.util'; 
import { OrderListComponent } from './components/order-list/order-list.component'; 
import { Router } from '@angular/router'; 
import { STATUS_ORDER } from '@/enums/main.enum';

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
  } 

  navigateToPos() {
    this.router.navigateByUrl('/pos')
  }


}

