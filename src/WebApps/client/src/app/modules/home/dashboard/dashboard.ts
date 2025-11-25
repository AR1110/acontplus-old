import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  computed,
  ViewChild,
  effect,
} from '@angular/core';
import { CHARTS, ELEMENT_DATA, MESSAGES, STATS } from './data';
import { DynamicCard } from '@acontplus/ng-components';
import { SettingsService } from '@core/bootstrap';
import { Subscription } from 'rxjs';
import { AdminLayoutService } from '@core/services/admin-layout.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';

export interface Chart1Options {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
}

export interface Chart2Options {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
}

export interface Chart3Options {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: Partial<ApexYAxis>;
  xaxis: Partial<ApexXAxis>;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [DynamicCard, ChartComponent],
  // encapsulation: ViewEncapsulation.None
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly settings = inject(SettingsService);
  private adminLayoutSvc = inject(AdminLayoutService);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  messages = MESSAGES;

  @ViewChild('chart1') chart1!: ChartComponent;
  public chart1Options: Chart1Options = {
    series: [
      {
        data: [],
      },
    ],
    annotations: {
      points: [],
    },
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 20,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },

    grid: {
      row: {
        colors: ['#fff', '#f2f2f2'],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: [],
      tickPlacement: 'on',
    },
    yaxis: {},
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
  };

  @ViewChild('chart2') chart2!: ChartComponent;
  public chart2Options: Chart2Options = {
    series: [
      {
        name: 'basic',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
    },
  };

  @ViewChild('chart3') chart3!: ChartComponent;
  public chart3Options: Chart3Options = {
    series: [
      {
        name: 'Total',
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
      },
    },
    colors: [], // Will be set dynamically based on theme
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: [], // Will be set dynamically based on theme
          fontSize: '12px',
        },
      },
    },
    yaxis: {},
  };

  charts = CHARTS;

  stats = STATS;

  notifySubscription = Subscription.EMPTY;

  isShowAlert = true;

  introducingItems = [
    {
      name: 'Suscripción Básica',
      description:
        'Tu plan Básico está por vencer. Renueva ahora para mantener acceso a todas las funciones esenciales.',
      link: '/suscripciones/renovar?plan=basico',
    },
    {
      name: 'Suscripción Premium',
      description:
        'La suscripción Premium expirará pronto. Renueva para conservar tus beneficios exclusivos y soporte prioritario.',
      link: '/suscripciones/renovar?plan=premium',
    },
    {
      name: 'Suscripción Empresarial',
      description:
        'Tu plan Empresarial está próximo a finalizar. Asegura la continuidad del servicio para tu equipo sin interrupciones.',
      link: '/suscripciones/renovar?plan=empresarial',
    },
    {
      name: 'Suscripción de Prueba',
      description:
        'Tu periodo de prueba está a punto de terminar. Actualiza a un plan de pago para seguir disfrutando del servicio.',
      link: '/suscripciones/renovar?plan=trial',
    },
    {
      name: 'Recordatorio General',
      description:
        'Algunas de tus suscripciones están por vencer. Revisa tu panel de usuario y evita la suspensión del servicio.',
      link: '/suscripciones',
    },
  ];

  introducingItem = this.introducingItems[this.getRandom(0, 4)];

  statistics = computed(() => {
    const { userCount, supplierCount, customerCount, itemCount } =
      this.adminLayoutSvc.getStatistics();
    return [
      {
        title: 'Usuarios',
        count: userCount,
        progress: {
          value: 50,
        },
        color: 'bg-primary-container',
      },
      {
        title: 'Proveedor',
        count: supplierCount,
        progress: {
          value: 70,
        },
        color: 'bg-secondary-container',
      },
      {
        title: 'Clientes',
        count: customerCount,
        progress: {
          value: 80,
        },
        color: 'bg-tertiary-container',
      },
      {
        title: 'Productos',
        count: itemCount,
        progress: {
          value: 40,
        },
        color: 'bg-info',
      },
    ];
  });

  constructor() {
    effect(() => {
      this.renderChart1();
      this.renderChart2();
      this.renderChart3();
    });
  }

  renderChart1() {
    const newData = this.adminLayoutSvc.emittedDocuments().map((x: any) => x.total);
    const newLabels = this.adminLayoutSvc.emittedDocuments().map((x: any) => x.document);

    if (this.chart1) {
      const updatedOptions = {
        ...this.chart1Options, // mantiene todo
        series: [{ name: 'Documentos', data: newData }],
        xaxis: {
          ...this.chart1Options.xaxis,
          categories: newLabels,
          labels: {
            rotate: -45,
            rotateAlways: true,
          },
        },
      };

      this.chart1.updateOptions(updatedOptions, false, true);
    }
  }

  renderChart2() {
    const newData = this.adminLayoutSvc.anotherSalesDocs().map((x: any) => x.total);
    const newLabels = this.adminLayoutSvc.anotherSalesDocs().map((x: any) => x.document);

    if (this.chart2) {
      const updatedOptions = {
        ...this.chart2Options, // mantiene todo
        series: [{ name: 'Documentos', data: newData }],
        xaxis: { ...this.chart2Options.xaxis, categories: newLabels },
      };

      this.chart2.updateOptions(updatedOptions, false, true);
    }
  }

  renderChart3() {
    const newData = this.adminLayoutSvc.receivedDocuments().map((x: any) => x.total);
    const newLabels = this.adminLayoutSvc.receivedDocuments().map((x: any) => x.document);

    if (this.chart3) {
      const chartColors = this.getChartColors();
      const updatedOptions = {
        ...this.chart3Options, // mantiene todo
        series: [{ name: 'Total', data: newData }],
        colors: chartColors,
        xaxis: {
          ...this.chart3Options.xaxis,
          categories: newLabels,
          labels: {
            rotate: -45,
            rotateAlways: true,
            style: {
              colors: chartColors,
              fontSize: '12px',
            },
          },
        },
      };

      this.chart3.updateOptions(updatedOptions, false, true);
    }
  }

  ngOnInit() {
    this.notifySubscription = this.settings.notify.subscribe((opts) => {
      this.updateCharts();
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initCharts());

    const apexStyles = document.querySelectorAll('style[id^="apexcharts"]');
    apexStyles.forEach((s) => s.remove());
  }

  ngOnDestroy() {
    // this.chart1?.destroy();
    // this.chart2?.destroy();

    this.notifySubscription.unsubscribe();
  }

  initCharts() {
    // this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
    // this.chart1?.render();
    // this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
    // this.chart2?.render();

    this.updateCharts();
  }

  updateCharts() {
    // this.chart1?.updateOptions({
    //   chart: {
    //     foreColor: isDark ? '#ccc' : '#333',
    //   },
    //   tooltip: {
    //     theme: isDark ? 'dark' : 'light',
    //   },
    //   grid: {
    //     borderColor: isDark ? '#5a5a5a' : '#e1e1e1',
    //   },
    // });
    // this.chart2?.updateOptions({
    //   chart: {
    //     foreColor: isDark ? '#ccc' : '#333',
    //   },
    //   plotOptions: {
    //     radar: {
    //       polygons: {
    //         strokeColors: isDark ? '#5a5a5a' : '#e1e1e1',
    //         connectorColors: isDark ? '#5a5a5a' : '#e1e1e1',
    //         fill: {
    //           colors: isDark ? ['#2c2c2c', '#222'] : ['#f2f2f2', '#fff'],
    //         },
    //       },
    //     },
    //   },
    //   tooltip: {
    //     theme: isDark ? 'dark' : 'light',
    //   },
    // });
  }

  onAlertDismiss() {
    this.isShowAlert = false;
  }

  getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Gets chart colors from Material 3 CSS variables
   */
  private getChartColors(): string[] {
    const root = document.documentElement;
    const getColor = (varName: string) => getComputedStyle(root).getPropertyValue(varName).trim();

    return [
      getColor('--mat-sys-primary'),
      getColor('--mat-sys-secondary'),
      getColor('--mat-sys-tertiary'),
      getColor('--mat-sys-error'),
      getColor('--mat-sys-primary-container'),
      getColor('--mat-sys-secondary-container'),
      getColor('--mat-sys-tertiary-container'),
      getColor('--mat-sys-error-container'),
    ];
  }
}
