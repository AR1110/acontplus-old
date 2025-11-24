import { Component, inject, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { SupportPageComponent } from '../support-page/support-page.component';
import { SupportUseCase } from '@mechanical/application/use-cases/support.use-case';
import { MechanicalStore } from '@mechanical/application/store/mechanical.store';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIcon } from '@angular/material/icon';
Chart.register(...registerables);
@Component({
  selector: 'app-mechanical-dashboard',
  imports: [SupportPageComponent, DynamicCard, MatIcon],
  templateUrl: './mechanical-dashboard.component.html',
})
export class MechanicalDashboardComponent implements OnInit {
  $store = inject(MechanicalStore);
  chartSupports: any;
  data = {
    quantitySupport: 0,
    quantityVehicleCompany: 0,
    quantityInspection: 0,
  };
  supportUseCase = inject(SupportUseCase);
  ngOnInit(): void {
    this.supportUseCase.getDashboard().subscribe((response) => {
      console.log(response);
      this.data = response.data;
      const labels = response.barchart.map((i: any) => i.status);
      const data = response.barchart.map((i: any) => i.quantity);

      this.chartSupports = new Chart('chartSupports', {
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
    });
  }
}
