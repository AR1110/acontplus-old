import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { Button, DynamicCard } from '@acontplus/ng-components';

import { DataFilterComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/data-filter-comprobante-egreso.use-case';
import { Subscription } from 'rxjs';
import { GroupedEstab } from '@core/models/estab.model';
import { Banco } from '@accounting/shared/models/banco.interface';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/sub-entidad-financiera/domain/subentidad-financiera.interface';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { REPORT_FORMAT } from '@core/constants/global.constants';
import { ReportParameters, ReportParamsBuilder } from '@shared/utils/report-params.builder';
import { ACCOUNTING_CODE_REPORT } from '@accounting/shared/enums/accounting.constants';
import { getValidId } from '@core/utils/utils';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

enum ReportTypeEnum {
  Comprobantes = 'LC',
  FormasPagoDetalle = 'DFP',
}

@Component({
  selector: 'app-payments-report',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateRangeSelectionComponent,
    MatCheckbox,
    MatDivider,
    Button,
    FormsModule,
  ],
  templateUrl: './payments-report.component.html',
  styles: ``,
})
export class PaymentsReportComponent implements OnInit, OnDestroy {
  private $dataFilterUseCase = inject(DataFilterComprobanteEgresoUseCase);
  private $generateReportUseCase = inject(GenerateReportUseCase);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private subscription$!: Subscription;

  private format!: string;

  reportTypes = [
    { code: ReportTypeEnum.Comprobantes, name: 'Listado de comprobantes' },
    { code: ReportTypeEnum.FormasPagoDetalle, name: 'Detalle formas de pago' },
  ];

  estabs = signal<GroupedEstab[]>([]);
  users = signal<any[]>([]);
  bancos = signal<Banco[]>([]);
  tiposDoc = signal<any[]>([]);
  subEntidadesFinanciera = signal<SubEntidadFinancieraSelectHtmlOnly[]>([]);

  filterParams = {
    establecimientoId: 0,
    userId: 0,
    documentCode: 'all',
    paymentMethodId: 0,
    bankId: 0,
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    useDateFilter: true,
    reportTypeCode: ReportTypeEnum.Comprobantes,
  };

  ngOnInit() {
    this.subscription$ = this.$dataFilterUseCase.execute().subscribe((response) => {
      console.log(response);
      this.estabs.set(response.estabs);
      this.users.set(response.users);
      this.bancos.set(response.bancos);
      this.tiposDoc.set(response.tiposDoc);
      this.subEntidadesFinanciera.set(response.subEntidadesFinanciera);

      const dataEstab = this.estabs().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.filterParams.establecimientoId = dataEstab.idEstablecimiento;
      }
    });
  }

  changeDateRange($event: any) {
    console.log($event);
  }

  exportPdf() {
    this.format = REPORT_FORMAT.PDF;
    this.generateReport();
  }
  exportExcel() {
    this.format = REPORT_FORMAT.EXCEL;
    this.generateReport();
  }

  generateReport() {
    let reportParameters = {} as ReportParameters | undefined;
    const codDoc = this.filterParams.documentCode === 'all' ? null : this.filterParams.documentCode;
    const additionalParams = {
      establecimientoId: this.filterParams.establecimientoId,
      userId: getValidId(this.filterParams.userId),
      codDoc,
      paymentMethodId: getValidId(this.filterParams.paymentMethodId),
      bankId: getValidId(this.filterParams.bankId),
      startDate: this.filterParams.startDate,
      endDate: this.filterParams.endDate,
      useDateFilter: this.filterParams.useDateFilter,
      reportTypeCode: this.filterParams.reportTypeCode,
      tipo: 0,
      userRoleId: this._tokenUseCase.getUserRoleId(),
    };

    if (ReportTypeEnum.Comprobantes === this.filterParams.reportTypeCode) {
      additionalParams.tipo = 2;
      reportParameters = ReportParamsBuilder.getReportParameters(
        ACCOUNTING_CODE_REPORT.ACELC,
        additionalParams,
      );
    }
    if (ReportTypeEnum.FormasPagoDetalle === this.filterParams.reportTypeCode) {
      additionalParams.tipo = 3;
      reportParameters = ReportParamsBuilder.getReportParameters(
        ACCOUNTING_CODE_REPORT.ACEDFP,
        additionalParams,
      );
    }

    console.log(reportParameters);

    this.$generateReportUseCase.execute({
      data: reportParameters,
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
