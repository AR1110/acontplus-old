import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportParamsBuilder } from '@shared/utils/report-params.builder';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { INVENTORY_CODE_REPORT } from '@inventory/inventory.const';
import { DOC_TYPE, REPORT_FORMAT } from '@core/constants/global.constants';
import { WAREHOUSE_TRANSFER_SERVICE } from '@inventory/data/inventory-token';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-inventory-adjustment-detail',
  imports: [MatCustomDialogComponent, DataGrid, DecimalPipe, DatePipe, MatCard, MatIcon],
  templateUrl: './warehouse-transfer-detail.html',
  styles: `
    .header-card {
      background-color: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface);
      border-radius: 1rem;
      border: 1px solid var(--mat-sys-outline-variant);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      padding: 1rem;

      .label {
        font-weight: 600;
        color: var(--mat-sys-outline);
      }

      .fw-semibold {
        font-weight: 600;
      }

      .total {
        color: var(--mat-sys-primary);
        font-size: 1.1rem;
      }

      .text-primary {
        color: var(--mat-sys-primary);
      }

      mat-icon {
        display: block;
        margin: 0 auto;
      }

      .header-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;

        .header-column {
          flex: 1 1 200px; // crece hasta 1, mínimo 200px
        }

        .header-icon {
          flex: 0 0 auto; // no se estira
        }
      }

      // Media queries para móvil
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: 0.75rem;

          .header-column,
          .header-icon {
            text-align: left !important;
            flex: 1 1 100%;
          }
        }
      }
    }
  `,
})
export class WarehouseTransferDetail implements OnInit {
  private warehouseTransferService = inject(WAREHOUSE_TRANSFER_SERVICE);
  #generateReport = inject(GenerateReportUseCase);

  private dialogRef = inject(MatDialogRef<WarehouseTransferDetail>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Detalle Transferencia de Bodega');

  header = {} as any;
  list = signal<any[]>([]);

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Código', field: 'code' },
    { header: 'Descripción', field: 'description' },
    { header: 'Medida', field: 'measure' },
    {
      header: 'Cantidad',
      field: 'quantity',
      type: 'number',
      typeParameter: {
        digitsInfo: '1.2-2',
      },
    },
    {
      header: 'Precio Costo',
      field: 'costPrice',
      type: 'number',
      typeParameter: {
        digitsInfo: '1.2-2',
      },
    },
    {
      header: 'Total',
      field: 'total',
      type: 'number',
      typeParameter: {
        digitsInfo: '1.2-2',
      },
    },
  ];

  ngOnInit() {
    this.warehouseTransferService.viewDetail(this.params.id).subscribe((response: any) => {
      this.header = response.header;
      this.list.set(response.details);
    });
  }

  exportToExcel() {
    const additionalParams = {
      codDoc: DOC_TYPE.CI,
      id: this.params.id,
    };

    const reportParameters = ReportParamsBuilder.getReportParameters(
      INVENTORY_CODE_REPORT.RCD,
      additionalParams,
    );

    this.#generateReport.execute({
      data: reportParameters,
      format: REPORT_FORMAT.EXCEL,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
