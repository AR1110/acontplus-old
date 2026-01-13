import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { ReportParamsBuilder } from '@shared/utils/report-params.builder';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { INVENTORY_CODE_REPORT } from '@inventory/inventory.const';
import { DOC_TYPE, REPORT_FORMAT } from '@core/constants/global.constants';
import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';

@Component({
  selector: 'app-inventory-adjustment-detail',
  imports: [MatDialogContent, MatDialogActions, DynamicCard, Button],
  templateUrl: './inventory-adjustment-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryAdjustmentDetail implements OnInit {
  private inventoryAdjustmentSvc = inject(InventoryAdjustmentService);
  #generateReport = inject(GenerateReportUseCase);

  private dialogRef = inject(MatDialogRef<InventoryAdjustmentDetail>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');

  header = {} as any;
  items = signal<any[]>([]);

  ngOnInit() {
    this.inventoryAdjustmentSvc.viewDetail(this.params.id).subscribe((response) => {
      console.log(response);
      this.header = response.header;
      this.items.set(response.items);
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
