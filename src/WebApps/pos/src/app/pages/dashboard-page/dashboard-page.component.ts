import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private router = inject(Router)

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],

    datasets: [
      {
        data: [40, 45, 50, 55, 60, 65, 70, 75, 70, 60, 50, 45],
        label: 'Angular',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      },
      {
        data: [45, 50, 60, 70, 75, 65, 50, 60, 55, 50, 45, 45],
        label: 'React',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(0,255,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  public lineChartLegend = true;

  navigateToPos() {
    console.log(this)
    this.router.navigate(['pos'])
  }

}
