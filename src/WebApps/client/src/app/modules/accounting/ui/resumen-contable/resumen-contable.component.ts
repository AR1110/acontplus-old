import { SubCategorySelectHtmlOnly } from '@accounting/data/models/subcategory';
import { ResumenContableUseCase } from '@accounting/data/resumen-contable.use-case';
import { ACCOUNTING_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { REPORT_FORMAT, TIPO_TRANSACCION } from '@core/constants/global.constants';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';

@Component({
  selector: 'app-resumen-contable',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    Button,
    DynamicCard,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './resumen-contable.component.html',
  styles: ``,
})
export class ResumenContableComponent implements OnInit {
  private _resumenContableCaseUse = inject(ResumenContableUseCase);
  private reportFacade = inject(ReportFacade);
  subcategories = signal<SubCategorySelectHtmlOnly[]>([]);
  transactionTypes = signal<any[]>([]);

  isPurchase = false;

  private format = '';

  dataSearch = {
    idTipoTransaccion: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    idSubcategoria: 0,
  };
  getDataFilter() {
    this._resumenContableCaseUse.getDataFilter().subscribe((response) => {
      this.subcategories.set(response.subCategories);
      this.transactionTypes.set(response.transactionTypes);
      const dataTipoTransaccion = this.transactionTypes().find(
        (tt) => tt.codigo === TIPO_TRANSACCION.V,
      );
      this.dataSearch.idTipoTransaccion = dataTipoTransaccion?.idTipoTransaccion ?? 0;
    });
  }

  ngOnInit() {
    this.getDataFilter();
  }

  public onChangeTypeTransaccion() {
    this.isPurchase = this.transactionTypes().some(
      (tt) =>
        tt.idTipoTransaccion === this.dataSearch.idTipoTransaccion &&
        tt.codigo === TIPO_TRANSACCION.C,
    );
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  reportPdf() {
    this.format = REPORT_FORMAT.PDF;
    this.getReport();
  }

  reportExcel() {
    this.format = REPORT_FORMAT.EXCEL;
    this.getReport();
  }

  private getReport() {
    const dataParams = {
      tipo: 1,
      ckFecha: true,
      tipoTransaccionId: getValidId(this.dataSearch.idTipoTransaccion),
      subCategoryId: getValidId(this.dataSearch.idSubcategoria),
      fromDate: this.dataSearch.fromDate,
      toDate: this.dataSearch.toDate,
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: ACCOUNTING_CODE_REPORT.RAAM,
      data: dataParams,
      format: this.format as any,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }
}
