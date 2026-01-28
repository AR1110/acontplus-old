import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DashboardService } from '@modules/config/services/dashboard.service';
import * as XLSX from 'xlsx';

import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatCard,
    MatCardContent,
    MatIcon,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService = inject(DashboardService);
  title: string = 'Dashboard';
  totalCompanies: number = 0;
  public chartDocuments: any;
  public licensesChart: any;

  documents: any[] = [];
  licenses: any[] = [];
  drawMain() {
    const labels = this.documents.map(
      (item: { comprobante: any }) => item.comprobante,
    );
    const data = this.documents.map((item: { total: any }) => item.total);
    this.chartDocuments = new Chart('chartDocuments', {
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
        responsive: true, // Makes the chart responsive
        maintainAspectRatio: false, // Ensures the chart doesn't maintain aspect ratio
        scales: {
          y: {
            ticks: {
              // Customize y-axis ticks if needed
            },
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
            text: 'Total Documentos Tributarios',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  }
  drawLicenses() {
    const labels = this.licenses.map(
      (item: { license: string }) => item.license,
    );
    const data = this.licenses.map((item: { total: any }) => item.total);
    this.licensesChart = new Chart('licensesChart', {
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
        responsive: true, // Makes the chart responsive
        maintainAspectRatio: false, // Ensures the chart doesn't maintain aspect ratio
        scales: {
          y: {
            ticks: {
              // Customize y-axis ticks if needed
            },
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
            text: 'Total Suscripciones',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  }
  // Method to export documents data to Excel
  exportDocumentsToExcel() {
    const worksheetData = this.documents.map((item) => {
      return {
        Comprobante: item.comprobante,
        Cantidad: item.total,
      };
    });
    // Calculate the total of all "Cantidad"
    const cantidadTotal = this.documents.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    // Add a "Cantidad Total" row at the end
    worksheetData.push({
      Comprobante: 'Cantidad Total',
      Cantidad: cantidadTotal,
    });
    // Create a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Documents Data': worksheet },
      SheetNames: ['Documents Data'],
    };

    // Export to Excel
    XLSX.writeFile(workbook, 'DocumentsData.xlsx');
  }

  // Method to export licenses data to Excel
  exportLicensesToExcel() {
    const worksheetData = this.licenses.map((item) => {
      return {
        Licencia: item.license,
        Cantidad: item.total,
      };
    });
    // Calculate the total of all "Cantidad"
    const cantidadTotal = this.licenses.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    // Add a "Cantidad Total" row at the end
    worksheetData.push({ Licencia: 'Cantidad Total', Cantidad: cantidadTotal });
    // Create a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Licenses Data': worksheet },
      SheetNames: ['Licenses Data'],
    };

    // Export to Excel
    XLSX.writeFile(workbook, 'LicensesData.xlsx');
  }
  get() {
    this._dashboardService.get().subscribe((response) => {
      this.totalCompanies = response.companies[0].totalCompanies || 0;
      this.documents = response.documents;
      this.licenses = response.licenses;
      if (this.documents.length > 0) {
        this.drawMain();
      }
      if (this.licenses.length > 0) {
        this.drawLicenses();
      }
    });
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    this.get();
  }
}
