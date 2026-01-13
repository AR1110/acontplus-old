import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SubCategorySelectHtmlOnly } from '@accounting/data/models/subcategory';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { REPORT_FORMAT, TIPO_TRANSACCION } from '@core/constants/global.constants';
import { SharedService } from '@core/services/shared.service';
import { getValidId } from '@core/utils/utils';
import { ACCOUNTING_CODE_REPORT } from '@accounting/shared/enums/accounting.constants';
import { ResumenContableUseCase } from '@accounting/resumen-contable/application/resumen-contable.use-case';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
  private sharedSvc = inject(SharedService);
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

    const reportParams = JSON.stringify({
      hasParams: false,
      codigo: ACCOUNTING_CODE_REPORT.RAAM,
      format: this.format,
      aditionalParams: [],
    });

    const parameters = {
      hasIdUsuarioRol: true,
      reportParams,
      dataParams: JSON.stringify(dataParams),
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,
    });
  }
}
