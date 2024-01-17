import { Component, OnInit, inject } from '@angular/core';
import { hideLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderService } from '@modules/technical-support/services/order.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  orders: any = [];
  totalCustomers: number = 300;
  totalEmployes: number = 10;
  totalOrders: number = 0;

  private orderService = inject(OrderService);
  public chartOrders: any;

  drawChartOrders() {
    const self = this;
  }

  get() {
    const self = this;
    this.orderService.get(JSON.stringify({ tipo: 3 })).subscribe({
      next(response) {
        console.log(response);
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
    const self = this;
    self.totalOrders = 300;
    // let labels = self.documents.map((item: { comprobante: any; }) => item.comprobante)
    //     let data = self.documents.map((item: { total: any; }) => item.total);
    let labels = ['Por entregar', 'Entregadas'];
    let data = [100, 200];
    self.chartOrders = new Chart('chartOrders', {
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
}
