import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Component, inject, model, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { Router } from '@angular/router';
import { MainStoreService } from '@/domain/services/main-store.service';
import { DashboardStore } from '@/ui/store/dashboard.store';
import { SaleChartComponent } from './widgets/sale-chart.component';
import { TopProductsComponent } from './widgets/top-products.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

function getAnios() {
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

const paletaColores = [
  'rgba(255, 99, 132, 0.5)', // Rojo
  'rgba(54, 162, 235, 0.5)', // Azul
  'rgba(255, 206, 86, 0.5)', // Amarillo
  'rgba(75, 192, 192, 0.5)', // Verde agua
  'rgba(153, 102, 255, 0.5)', // Púrpura
  'rgba(255, 159, 64, 0.5)', // Naranja
];

function generarColorAleatorio() {
  const letras = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  return color;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MetricCardComponent,
    SaleChartComponent,
    TopProductsComponent,
    BaseChartDirective,
  ],
})
export class DashboardComponent {
  private router = inject(Router);
  private mainStoreSvc = inject(MainStoreService);
  dashboardStore = inject(DashboardStore);

  anios = signal(getAnios());

  sales = signal<any[]>([]);
  bestSellingProduct = signal<any[]>([]);

  dataSearch = model({
    anio: new Date().getFullYear(),
  });

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // To ensure it adapts to the container size
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  public lineChartLegend = true;

  onLoad() {
    let estabId = this.mainStoreSvc.state().establecimientoId;
    if (!estabId) {
      console.error('estab id', estabId);
      return;
    }
    this.dashboardStore.getStats(estabId);
  }
  ngOnInit(): void {
    let estabId = this.mainStoreSvc.state().establecimientoId;
    if (!estabId) {
      console.error('estab id', estabId);
      return;
    }
    this.dashboardStore.getStats(estabId);
  }

  refresh() {
    this.onLoad();
  }

  renderSale() {
    const tiposDocumentos = [
      ...new Set(this.dashboardStore.sales().map((item) => item.docNom)),
    ];

    // Crear un objeto para almacenar los datos por tipo de documento y mes
    const datosPorTipoYMes = tiposDocumentos.reduce((acc, tipo) => {
      acc[tipo] = new Array(12).fill(0);
      return acc;
    }, {});

    // Actualizar datosPorTipoYMes con los datos proporcionados
    this.dashboardStore.sales().forEach((item) => {
      datosPorTipoYMes[item.docNom][item.mes - 1] = item.totalVendido;
    });

    // Generar colores dinámicos o usar paleta predefinida
    const colores =
      paletaColores.length >= tiposDocumentos.length
        ? paletaColores
        : Array.from({ length: tiposDocumentos.length }, () =>
            generarColorAleatorio()
          );

    // Configurar datasets para cada tipo de documento con colores dinámicos
    const datasets = tiposDocumentos.map((tipo, index) => ({
      data: datosPorTipoYMes[tipo],
      label: tipo,
      fill: true,
      tension: 0.5,
      borderColor: colores[index],
      backgroundColor: colores[index],
    }));

    // Configuración del gráfico
    const lineChartData = {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      datasets: datasets,
    };

    this.lineChartData = lineChartData;
  }

  renderTopProducts() {}

  navigateToPos() {
    this.router.navigate(['pos']);
  }
}
