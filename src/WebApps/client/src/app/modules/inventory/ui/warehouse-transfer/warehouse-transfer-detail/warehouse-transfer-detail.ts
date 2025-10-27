import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { ReportParamsBuilder } from '@shared/utils/report-params.builder';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { INVENTORY_CODE_REPORT } from '@inventory/domain/enums/inventory.enum';
import { DOC_TYPE, REPORT_FORMAT } from '@core/constants/global.constants';
import {WarehouseTransferViewDetailUseCase} from "@inventory/domain/usecases/warehouse-transfer.use-case";
import {DataGridColumn} from "@shared/components/data-grid/types";
import {DataGrid} from "@shared/components/data-grid/data-grid";

@Component({
  selector: 'app-inventory-adjustment-detail',
  imports: [MatCustomDialogComponent, MatDynamicCardComponent, ThemeButtonComponent, DataGrid],
  templateUrl: './warehouse-transfer-detail.html',
  styles: ``,
})
export class WarehouseTransferDetail implements OnInit {
  private viewDetailUseCase = inject(WarehouseTransferViewDetailUseCase);
  #generateReport = inject(GenerateReportUseCase);

  private dialogRef = inject(MatDialogRef<WarehouseTransferDetail>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Detalle Transferencia de Bodega');

  header = {} as any;
  list = signal<any[]>([]);

  columns: DataGridColumn[] = [
    { header: 'Name', field: 'name' },
    {
      header: 'Weight',
      field: 'weight',
      type: 'number',
      typeParameter: {
        digitsInfo: '1.2-2',
      },
    },
    { header: 'Gender', field: 'gender' },
    { header: 'Mobile', field: 'mobile' },
    { header: 'City', field: 'city' },
    {
      header: 'Date',
      field: 'date',
      type: 'date',
      typeParameter: {
        format: 'yyyy-MM-dd',
      },
    },
  ];


  ngOnInit() {
    this.viewDetailUseCase.execute(this.params.id).subscribe(response => {

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
