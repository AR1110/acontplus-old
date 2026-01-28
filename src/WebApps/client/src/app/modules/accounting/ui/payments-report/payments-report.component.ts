import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import { COMPROBANTE_EGRESO_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { Banco } from '@accounting/shared/models/banco.interface';
import { ACCOUNTING_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { FormsModule } from '@angular/forms';
import { REPORT_FORMAT } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { Subscription } from 'rxjs';

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
  private comprobanteEgresoHttp = inject(COMPROBANTE_EGRESO_HTTP_TOKEN);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private reportFacade = inject(ReportFacade);
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
    this.subscription$ = this.comprobanteEgresoHttp.getFilterData().subscribe((response) => {
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
    const codDoc = this.filterParams.documentCode === 'all' ? null : this.filterParams.documentCode;
    const additionalParams = {
      establecimientoId: this.filterParams.establecimientoId,
      userId: getValidId(this.filterParams.userId),
      codDoc: codDoc ?? undefined,
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
      const reportOptions = ReportParamsBuilder.build({
        codeReport: ACCOUNTING_CODE_REPORT.ACELC,
        data: additionalParams,
        format: this.format as any,
      });
      this.reportFacade.open(reportOptions).subscribe();
      return;
    }
    if (ReportTypeEnum.FormasPagoDetalle === this.filterParams.reportTypeCode) {
      additionalParams.tipo = 3;
      const reportOptions = ReportParamsBuilder.build({
        codeReport: ACCOUNTING_CODE_REPORT.ACEDFP,
        data: additionalParams,
        format: this.format as any,
      });
      this.reportFacade.open(reportOptions).subscribe();
      return;
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
