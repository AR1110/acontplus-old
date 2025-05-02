import {Component, inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderListComponent } from '@ui/orders/components/order-list/order-list.component';
import { Router } from '@angular/router';
import {ROUTES_PATH} from '@domain/enums/main.enum';
import {PermissionStore} from "@ui/store/permission.store";
import {TableOrdersComponent} from "@ui/orders/components/table-orders/table-orders.component";
import {OrderStore} from "@ui/store/order.store";

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
  $orderStore = inject(OrderStore)

  navigateToPos() {
    this.router.navigateByUrl(ROUTES_PATH.POS).then()
  }

  ngOnInit(){
    this.$permissionStore.loadActions(ROUTES_PATH.ORDER)
  }

}
