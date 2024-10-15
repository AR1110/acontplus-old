import { Component, input, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-best-selling-product-stats',
  standalone: true,
  imports: [
    MatCardModule,
    BaseChartDirective
  ],
  templateUrl: './best-selling-product-stats.component.html',
  styleUrl: './best-selling-product-stats.component.scss'
})
export class BestSellingProductStatsComponent {
  bestSellingProduct = input.required<any[]>()

  public barChartOptions: any = {
    responsive: true,
    indexAxis: 'y',

  };
  public barChartLabels: string[] = [];
  public barChartType: any = 'bar';
  public barChartLegend = false;
  public barChartData:any[] = [
  ];


  constructor() {
    effect(() => {

      this.barChartLabels = this.bestSellingProduct().map((item: any) => item.descripcion);
      this.barChartData = [{
        data: this.bestSellingProduct().map((item: any) => item.vecesVendido)
      }]

    })

  }

}
