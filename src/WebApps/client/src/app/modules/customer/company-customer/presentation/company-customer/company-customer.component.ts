import { Component, inject, signal, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CompanyCustomerAddEditDirective } from '@company-customer/presentation/directives/company-customer-add-edit.directive';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isValidField } from '@core/utils/utils';

import { Pagination, Button, DynamicCard } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { ListCompanyCustomerUseCase } from '@company-customer/application/list-company-customer.use-case';
import { ListCompanyCustomer } from '@company-customer/domain/entities/company-customer.entity';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { ReportParamsBuilder } from '@shared/utils/report-params.builder';
import { CUSTOMER_CODE_REPORT } from '@customer/shared/enums/customer.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UpdateStateCompanyCustomerUseCase } from '@company-customer/application/update-state-company-customer.use-case';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { REPORT_FORMAT } from '@core/constants/global.constants';

@Component({
  selector: 'app-company-customer',
  imports: [
    BreadcrumbComponent,
    CompanyCustomerAddEditDirective,
    Button,
    DynamicCard,
    MatDynamicTableComponent,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatIconButton,
    MatButtonToggleModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './company-customer.component.html',
})
export class CompanyCustomerComponent implements OnInit {
  private $listUseCase = inject(ListCompanyCustomerUseCase);
  private generateReport = inject(GenerateReportUseCase);
  private $updateState = inject(UpdateStateCompanyCustomerUseCase);

  visibleColumns: string[] = [
    'op',
    'position',
    'ruc',
    'razonSocial',
    'direccion',
    'telefono',
    'estado',
  ];

  dataSearch = {
    textSearch: null as string | null,
  };
  dataSource = signal<ListCompanyCustomer[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'tipoIdentificacion', label: 'Tipo', type: 'string' },
    { key: 'identificacionComprador', label: 'Nro. Identificación', type: 'string' },
    { key: 'razonSocialComprador', label: 'Razón Social', type: 'string' },
    { key: 'nombreComercial', label: 'Nombre Comercial', type: 'string' },
    { key: 'direccion', label: 'Dirección', type: 'string' },
    { key: 'correo', label: 'Correo', type: 'string' },
    { key: 'telefono', label: 'Teléfono', type: 'string' },
    { key: 'nomValidationSri', label: 'Validación Sri', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  refresh() {
    this.getList();
  }

  getList() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      checkTextSearch: !!isValidField(this.dataSearch.textSearch),
      textSearch: isValidField(this.dataSearch.textSearch),
    };

    this.$listUseCase.execute(params).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pagination.update(
        (re) => new Pagination(re.pageIndex, re.pageSize, response.totalRecords),
      );
    });
  }

  ngOnInit(): void {
    this.getList();
  }

  async askToDelete(item: ListCompanyCustomer) {
    const { isConfirmed } = await Swal.fire({
      html: `<small>Esta Ud. seguro de Inactivar al Cliente <b>${item.razonSocialComprador}</b></small>?`,
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });
    if (!isConfirmed) return;

    this.$updateState.execute(item.idCliente).subscribe((response) => {
      if (response.code === '0') {
        Swal.fire({
          icon: 'warning',
          html: response.message,
        });
      }
      if (response.code === '1') {
        Swal.fire({
          icon: 'success',
          html: response.message,
          timer: 100,
        });
        setTimeout(() => {
          this.refresh();
        }, 1000);
      }
    });
  }

  getReport(format: string) {
    const additionalParams = {
      tipo: 4,
      format,
    };

    const reportParameters = ReportParamsBuilder.getReportParameters(
      CUSTOMER_CODE_REPORT.RCL,
      additionalParams,
    );

    this.generateReport.execute({
      data: reportParameters,
      format,
    });
  }

  exportExcel() {
    this.getReport(REPORT_FORMAT.EXCEL);
  }

  exportPdf() {
    this.getReport(REPORT_FORMAT.PDF);
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
