import {Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {
  InventoryAdjustmentDetailUseCase
} from "@inventory/inventory-adjustment/application/inventory-adjustment-detail.use-case";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {ReportParamsBuilder} from "@shared/utils/report-params.builder";
import {GenerateReportUseCase} from "@modules/api/reports/application/generate-report.use-case";
import {INVENTORY_CODE_REPORT} from "@inventory/domain/enums/inventory.enum";
import {DOC_TYPE, REPORT_FORMAT} from "@core/constants/global.constants";

@Component({
  selector: 'app-inventory-adjustment-detail',
  imports: [
    MatCustomDialogComponent,
    MatDynamicCardComponent,
    ThemeButtonComponent,
  ],
  templateUrl: './inventory-adjustment-detail.component.html',
  styles: ``
})
export class InventoryAdjustmentDetailComponent {
  #detailUseCase = inject(InventoryAdjustmentDetailUseCase)
  #generateReport = inject(GenerateReportUseCase);

  private dialogRef = inject(MatDialogRef<InventoryAdjustmentDetailComponent>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');

  header = {} as any;
  items = signal<any[]>([])

  ngOnInit() {
    this.#detailUseCase.execute(this.params.id).subscribe(response => {
      console.log(response);
      this.header = response.header;
      this.items.set(response.items)
    })
  }

  exportToExcel(){
    const additionalParams = {
      codDoc: DOC_TYPE.CI,
      id: this.params.id,
    };

    const reportParameters = ReportParamsBuilder.getReportParameters(INVENTORY_CODE_REPORT.RCD, additionalParams)

    this.#generateReport.execute({
      data: reportParameters,
      format: REPORT_FORMAT.EXCEL
    })
  }

  close(){
    this.dialogRef.close();
  }
}
