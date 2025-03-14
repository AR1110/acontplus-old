import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderListComponent } from '@modules/technical-support/pages/order-page/order-list/order-list.component';
import { OrderService } from '@modules/technical-support/services/order.service';
import { StatsService } from '@modules/technical-support/services/stats.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    imports: [FontAwesomeModule, OrderListComponent],
    templateUrl: './dashboard.component.html',
    styles: ``
})
export class DashboardComponent implements OnInit {
  orders: any = [];
  totalCustomers: number = 0;
  totalEmployes: number = 0;
  totalOrders: number = 0;

  private statsService = inject(StatsService);
  public chartOrders: any;

  drawChartOrders() {
    const self = this;
  }

  get() {
    this.statsService.get({}).subscribe({
      next: (response) => {
        if (isApiResponse(response) && response.code == '1') {
          const { stats, totalOrders, totalCustomers, totalEmployes } =
            JSON.parse(response.payload as string);
          this.totalOrders = totalOrders;
          this.totalCustomers = totalCustomers;
          this.totalEmployes = totalEmployes;
          const labels = stats.map((item: { name: string }) => item.name);
          const data = stats.map((item: { total: number }) => item.total);
          this.chartOrders = new Chart('chartOrders', {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Cantidad',
                  data: data,
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  ticks: {},
                },
                x: {
                  ticks: {
                    autoSkip: false,
                  },
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Total Ordenes',
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
              },
              responsive: true,
            },
          });
        }
      },
      complete() {
        
      },
      error(error) {
        console.log(error);
        
      },
    });
  }

  ngOnInit(): void {
    this.get();
  }
}
