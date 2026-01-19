import {
  Component,
  ElementRef,
  Inject,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { SuscripcionService } from '@modules/sales/services/suscripcion.service';
import { SuscripcionReport } from '@modules/sales/models/suscripcion';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { MatCard, MatCardContent } from '@angular/material/card';
import { getRandomColor } from 'acontplus-utils';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { formatDate, formatDateString } from '@core/utils/date.util';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Chart } from 'chart.js';
import { ColumnDefinition, Pagination } from 'acontplus-ui-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-suscription-report-page',
  imports: [
    FormsModule,
    MatButton,

    MatCard,
    MatCardContent,
    MatAccordion,
    MatExpansionModule,
    MatPaginator,
    BreadcrumbComponent,
    MatIcon,
  ],
  templateUrl: './suscripcion-report-page.component.html',
  styles: ``,
})
export class SuscripcionReportPageComponent {
  @ViewChild('documentChart') documentChart!: ElementRef<HTMLCanvasElement>;

  private readonly _suscripcionService = inject(SuscripcionService);

  subscriptions: SuscripcionReport[] = [];

  data = {
    startDate: '',
    endDate: '',
    textSearch: '',
    pageIndex: 0,
    pageSize: 0,
  };
  columnDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'company', label: 'Empresa', type: 'string' },
  ];
  columns: string[] = this.columnDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());
  pageEvent!: PageEvent;
  panelOpenState = -1;

  chartInstance!: Chart;

  constructor(@Inject('chart-setup') private chart: Chart) {} // Use globally configured Chart

  loadData() {
    this.data.pageIndex = this.pagination().pageIndex + 1;
    this.data.pageSize = this.pagination().pageSize;
    const obj = {
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      tipo: 4,
    };
    this._suscripcionService.get(obj).subscribe((response) => {
      this.subscriptions = response.suscripciones;
      // this.pagination.update((e) => {
      //   return {
      //     ...e,
      //     totalRecords: this.subscriptions[0]?.totalRecords || 0,
      //   };
      // });
      this.pagination.set({
        totalRecords: this.subscriptions[0]?.totalRecords || 0,
        pageSize: this.data.pageSize,
        pageIndex: this.data.pageIndex - 1,
        maxSize: 0,
        pageSizeOptions: [],
        getTotalPages: function (): number {
          throw new Error('Function not implemented.');
        },
        updatePageSize: function (newPageSize: number): void {
          throw new Error('Function not implemented.');
        },
        updateFromPaginatorEvent: function (event: any): void {
          throw new Error('Function not implemented.');
        },
      });
    });
  }
  ngOnInit() {
    const currentYear = new Date().getFullYear();

    // Format the start and end dates as "yyyy-MM-dd"
    this.data.startDate = formatDateString(new Date(currentYear, 0, 1)); // January 1st
    this.data.endDate = formatDateString(new Date(currentYear, 11, 31)); // December 31st
  }

  onSearch($event: any) {
    const textSearch = $event.target.value;
    if (textSearch.length >= 3) {
      this.data.textSearch = textSearch;
      this.loadData();
    }
    if (!textSearch || textSearch === '' || textSearch.length === 0) {
      this.data.textSearch = '';
      this.loadData();
    }
  }

  onPageChanged($event: PageEvent) {
    this.pageEvent = $event;
    // this.pagination.update((pag) => {
    //   return {
    //     ...pag,
    //     totalRecords: $event.length,
    //     pageSize: $event.pageSize,
    //     pageIndex: $event.pageIndex,
    //   };
    // });

    this.pagination.set({
      totalRecords: $event.length,
      pageSize: $event.pageSize,
      pageIndex: $event.pageIndex,
      maxSize: 0,
      pageSizeOptions: [],
      getTotalPages: function (): number {
        throw new Error('Function not implemented.');
      },
      updatePageSize: function (newPageSize: number): void {
        throw new Error('Function not implemented.');
      },
      updateFromPaginatorEvent: function (event: any): void {
        throw new Error('Function not implemented.');
      },
    });

    this.loadData();
  }

  onSearchClear(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.data.textSearch = '';
    this.loadData();
  }

  setPanelOpen(index: number, companyId: number) {
    this.panelOpenState = index;
    if (index >= 0) {
      this._suscripcionService
        .get({ companyId, tipo: 5 })
        .subscribe((response) => {
          let labels: any[] = [];
          let totals: any[] = [];
          let backgroundColors: any[] = [];
          let borderColors: any[] = [];
          let { emittedDocuments } = response.payload;
          // Loop through the documents and extract the type and total for each
          emittedDocuments.forEach(function (doc: any) {
            labels.push(doc.document); // Document type (e.g., "Invoices", "Credit Notes")
            totals.push(doc.total); // Total for the document type
            backgroundColors.push(getRandomColor(0.2)); // Random background color with 0.2 opacity
            borderColors.push(getRandomColor(1)); // Random border color with full opacity
          });
          this.renderChart(labels, totals, backgroundColors, borderColors);
        });
    }
  }
  renderChart(
    labels: any[],
    totals: any[],
    backgroundColors: any[],
    borderColors: any[],
  ): void {
    const ctx = this.documentChart.nativeElement.getContext('2d');
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Documentos Emitidos',
            data: totals,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}
