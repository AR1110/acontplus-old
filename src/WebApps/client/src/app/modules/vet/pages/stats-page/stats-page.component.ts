import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { StatsService } from '@modules/vet/services/stats.service';
import { isApiResponse } from '@core/models/api-response';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-stats-page',
    imports: [BreadcrumbComponent, FaIconComponent],
    templateUrl: './stats-page.component.html',
    styles: ``
})
export class StatsPageComponent {
  totalPetTypes = [];
  totalBreeds = [];
  totalGenders = [];
  public chartPetType: any;
  public chartPetBreed: any;
  public chartPetSex: any;
  private readonly statsService = inject(StatsService);
  drawChartPetType = () => {
    if (this.chartPetType != null) {
      this.chartPetType.destroy();
    }
    let groupedPets = this.totalPetTypes.reduce((groups: any, item: any) => {
      const group = groups[item.name] || [];
      group.push(item);
      groups[item.name] = group;
      return groups;
    }, {});
    let labels = Object.keys(groupedPets);
    let lengths = labels.map((key) => groupedPets[key][0]['total']);

    this.chartPetType = new Chart('chartPetType', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: lengths,
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
            text: 'Distribución por especie',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  };

  drawChartPetBreed = () => {
    if (this.chartPetBreed != null) {
      this.chartPetBreed.destroy();
    }
    let groupedPets = this.totalBreeds.reduce((groups: any, item: any) => {
      const group = groups[item.name] || [];
      group.push(item);
      groups[item.name] = group;
      return groups;
    }, {});
    let labels = Object.keys(groupedPets);
    let lengths = labels.map((key) => groupedPets[key][0]['total']);

    this.chartPetBreed = new Chart('chartPetBreed', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: lengths,
            fill: false,
            borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function (value: any, index, values) {
                // Only return even numbers
                return value % 2 === 0 ? value : null;
              },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Raza',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  };
  drawChartPetSex = () => {
    if (this.chartPetSex != null) {
      this.chartPetSex.destroy();
    }
    let groupedPets = this.totalGenders.reduce((groups: any, item: any) => {
      const group = groups[item.name] || [];
      group.push(item);
      groups[item.name] = group;
      return groups;
    }, {});
    let labels = Object.keys(groupedPets);
    let lengths = labels.map((key) => groupedPets[key][0]['total']);

    this.chartPetSex = new Chart('chartPetSex', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: lengths,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Sexo',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  };

  loadStats() {
    this.statsService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { totalPetTypes, totalBreeds, totalGenders } = JSON.parse(
          response.payload as string,
        );
        this.totalPetTypes = totalPetTypes;
        this.totalBreeds = totalBreeds;
        this.totalGenders = totalGenders;
        this.drawChartPetType();
        this.drawChartPetBreed();
        this.drawChartPetSex();
      }
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }
}
