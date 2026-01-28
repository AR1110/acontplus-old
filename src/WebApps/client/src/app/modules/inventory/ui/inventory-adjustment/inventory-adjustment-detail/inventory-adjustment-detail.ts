import {
  INVENTORY_CODE_REPORT,
  REPORT_FORMAT,
  ReportFacade,
  ReportParamsBuilder,
} from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { DOC_TYPE } from '@core/constants/global.constants';
import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';

@Component({
  selector: 'app-inventory-adjustment-detail',
  imports: [MatDialogContent, MatDialogActions, DynamicCard, Button],
  templateUrl: './inventory-adjustment-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryAdjustmentDetail implements OnInit {
  private inventoryAdjustmentSvc = inject(InventoryAdjustmentService);
  private reportFacade = inject(ReportFacade);
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

    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.RCD,
      data: additionalParams,
      format: REPORT_FORMAT.EXCEL,
    });
    this.reportFacade.downloadExcel(reportOptions).subscribe();
  }

  close() {
    this.dialogRef.close();
  }
}
