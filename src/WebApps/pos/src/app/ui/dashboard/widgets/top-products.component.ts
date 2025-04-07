import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardStore } from '@ui/store/dashboard.store';

@Component({
  selector: 'app-top-products',
  imports: [BaseChartDirective],
  template: `
    <!-- <div class="d-flex gap-2 align-items-center">
    <p class="stat">25.02</p>
    <mat-icon class="text-green">arrow_circle_up</mat-icon>
   </div> -->
    <div class="chart-container">
      <canvas
        baseChart
        [datasets]="barChartData"
        [labels]="barChartLabels"
        [options]="barChartOptions"
        [legend]="barChartLegend"
        [type]="barChartType"
      >
      </canvas>
    </div>
  `,
  styles: `
  .chart-container {
    // height: calc(100% - 100px);
    width: 100%;
  }
  `,
})
export class TopProductsComponent {
  private dashboardStore = inject(DashboardStore);

  public barChartOptions: any = {
    //responsive: false,
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, // To ensure it adapts to the container size
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };
  public barChartLabels: string[] = [];
  public barChartType: any = 'bar';
  public barChartLegend = false;
  public barChartData: any[] = [];

  //chart = viewChild.required<ElementRef>('chart')

  constructor() {
    effect(() => {
      this.barChartLabels = this.dashboardStore
        .topProducts()
        .map((item: any) => item.descripcion);
      this.barChartData = [
        {
          data: this.dashboardStore
            .topProducts()
            .map((item: any) => item.vecesVendido),
        },
      ];

      // new Chart(this.chart().nativeElement, {
      //   type: 'bar',
      //   data: {
      //     labels
      //   }
      // }) s
    });
  }
}
