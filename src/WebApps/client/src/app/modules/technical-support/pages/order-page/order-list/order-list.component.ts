import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { OrderService } from '@modules/technical-support/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [],
  templateUrl: './order-list.component.html',
  styles: ``,
})
export class OrderListComponent implements OnInit {
  orders: any = [];
  private orderService = inject(OrderService);

  get() {
    showLoader();
    this.orderService.get(JSON.stringify({ tipo: 2 })).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          console.log(response);
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
