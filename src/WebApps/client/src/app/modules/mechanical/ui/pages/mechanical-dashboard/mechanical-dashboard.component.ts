import { CommonModule } from '@angular/common';
import {  Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Chart, registerables } from 'chart.js';
import { SupportPageComponent } from '../support-page/support-page.component';
import { MECHANICAL_STATUS } from '@mechanical/domain/enums/mechanical.enum';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import {SupportUseCase} from "@mechanical/domain/use-cases/support.use-case";
Chart.register(...registerables);
@Component({
    selector: 'app-mechanical-dashboard',
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatDynamicCardComponent,
        SupportPageComponent
    ],
    templateUrl: './mechanical-dashboard.component.html'
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
  supportUseCase = inject(SupportUseCase)
  ngOnInit(): void {
    this.supportUseCase.getDashboard().subscribe( (response) =>{
      console.log(response)
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
      } )
   }

}
