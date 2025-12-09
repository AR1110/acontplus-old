import { DynamicCard } from '@acontplus/ng-components';
import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response-legacy';

import { OrderListComponent } from '@modules/technical-support/pages/order-page/order-list/order-list.component';
import { StatsService } from '@modules/technical-support/services/stats.service';
import { Chart, registerables } from 'chart.js';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [DynamicCard, OrderListComponent, MatIcon],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalEmployes = 0;
  totalOrders = 0;

  private statsService = inject(StatsService);
  public chartOrders: any;

  drawChartOrders() {
    const self = this;
  }

  get() {
    this.statsService.get({}).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { stats, totalOrders, totalCustomers, totalEmployes } = JSON.parse(
          response.payload as string,
        );
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
    });
  }

  ngOnInit(): void {
    this.get();
  }
}
