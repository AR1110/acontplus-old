import { INVENTORY_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DOC_TYPE, REPORT_FORMAT } from '@core/constants/global.constants';
import { WAREHOUSE_TRANSFER_SERVICE } from '@inventory/data/inventory-token';
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

  private dialogRef = inject(MatDialogRef<WarehouseTransferDetail>);
  private params = inject(MAT_DIALOG_DATA);
  private reportFacade = inject(ReportFacade);
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

    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.RCD,
      format: REPORT_FORMAT.EXCEL,
      data: additionalParams,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  close() {
    this.dialogRef.close();
  }
}
