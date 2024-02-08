import { Component, Input, OnInit, inject, input } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
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
  @Input() orderStatusCode: any = ""

  private orderService = inject(OrderService);

  orders: any = [];

  get() {
    showLoader();
    this.orderService.get(JSON.stringify({ tipo: 2, orderStatusCode: ORDER_STATUS_CODE[this.orderStatusCode]})).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          const order = JSON.parse(response.payload as string);
          this.orders = order['orders'];
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
