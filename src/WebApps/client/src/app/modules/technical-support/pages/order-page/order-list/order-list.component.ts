import { Component, Input, OnInit, inject, input } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { ORDER_STATUS_CODE } from '@modules/technical-support/constants/tech-support.constants';
import { OrderService } from '@modules/technical-support/services/order.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [AppModule],
  templateUrl: './order-list.component.html',
  styles: ``,
})
export class OrderListComponent implements OnInit {
  @Input() orderStatusCode: any = '';
  private orderService = inject(OrderService);
  dataSearch: any = {
    maxSize: 5,
    pageIndex: 1,
    pageSize: 25,
    totalRecords: 0,
  };
  orders: any = [];
  recordsQuantity = [5, 10, 25, 50, 100];

  get() {
    showLoader();
    this.orderService
      .get(
        JSON.stringify({
          tipo: 2,
          orderStatusCode: ORDER_STATUS_CODE[this.orderStatusCode],
          ...this.dataSearch,
        })
      )
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            const { orders } = JSON.parse(response.payload as string);
            this.orders = orders;
            this.dataSearch.totalRecords = this.orders[0].totalRecords;
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
  onChangePageSize() {
    this.dataSearch.pageIndex = 1;
    this.get();
  }
  onPageChanged() {
    this.get();
  }
}
