import { CommonModule } from '@angular/common';
import {  Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportService } from '@modules/mechanical/services/support.service';
import { Chart, registerables } from 'chart.js';
import { SupportPageComponent } from '../support-page/support-page.component';
import { MECHANICAL_STATUS } from '@modules/mechanical/enums/mechanical.enum';
Chart.register(...registerables);
@Component({
  selector: 'app-mechanical-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SupportPageComponent
  ],
  templateUrl: './mechanical-dashboard.component.html',
})
export class MechanicalDashboardComponent   {
  @Input() valueStatus: MECHANICAL_STATUS | null = null;
  @Input() supportStatus: any[] = []

  chartSupports:any
  data = {
    quantitySupport: 0,
    quantityVehicleCompany: 0,
    quantityInspection: 0,
  };
  supportSvc = inject(SupportService)
  ngOnInit(): void {
    this.supportSvc.getDashboard().subscribe({
      next:(response) =>{
        this.data = response.data;
        let labels = response.barchart.map((i: any) => i.status)
        let data = response.barchart.map((i: any) => i.quantity)

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
      },
    })
   }

}
