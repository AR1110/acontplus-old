import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CompanyCustomerAddEditDirective } from '@company-customer/presentation/directives/company-customer-add-edit.directive';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isValidField } from '@core/utils/utils';

import { Pagination, Button, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-company-customer-page',
  imports: [
    BreadcrumbComponent,
    CompanyCustomerAddEditDirective,
    Button,
    DataGrid,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './company-customer-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCustomerPage implements OnInit {
  private $listUseCase = inject(ListCompanyCustomerUseCase);
  private generateReport = inject(GenerateReportUseCase);
  private $updateState = inject(UpdateStateCompanyCustomerUseCase);

  dataSearch = {
    textSearch: null as string | null,
  };
  dataSource = signal<ListCompanyCustomer[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'tipoIdentificacion', header: 'Tipo' },
    { field: 'identificacionComprador', header: 'Nro. Identificación' },
    { field: 'razonSocialComprador', header: 'Razón Social' },
    { field: 'nombreComercial', header: 'Nombre Comercial' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'correo', header: 'Correo' },
    { field: 'telefono', header: 'Teléfono' },
    { field: 'nomValidationSri', header: 'Validación Sri' },
    { field: 'nomEstado', header: 'Estado' },
  ];

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

    this.$listUseCase.execute(params).subscribe((response: any) => {
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

    this.$updateState.execute(item.idCliente).subscribe((response: any) => {
      if (response.code === '0') {
        void Swal.fire({
          icon: 'warning',
          html: response.message,
        });
      }
      if (response.code === '1') {
        void Swal.fire({
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
