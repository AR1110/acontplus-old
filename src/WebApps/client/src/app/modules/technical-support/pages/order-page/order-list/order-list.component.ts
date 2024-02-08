import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { OrderService } from '@modules/technical-support/services/order.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    AppModule,
  ],
  templateUrl: './order-list.component.html',
  styles: ``,
})
export class OrderListComponent implements OnInit {
  orders: any = [];
  private orderService = inject(OrderService);

  get() {
    showLoader();
    const self = this;
    this.orderService.get(JSON.stringify({ tipo: 2 })).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          const order = JSON.parse(response.payload as string);
          console.log(order);
          self.orders = order['orders'];
          console.log(self.orders);
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }

  ngOnInit(): void {
    this.get();
  }
}
