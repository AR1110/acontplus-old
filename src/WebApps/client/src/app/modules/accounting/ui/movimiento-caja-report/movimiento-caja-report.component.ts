import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { SharedService } from '@core/services/shared.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { FormsModule } from '@angular/forms';
import { REPORT_FORMAT } from '@core/constants/global.constants';
import { isValidField } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ACCOUNTING_CODE_REPORT } from '@accounting/shared/enums/accounting.constants';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-movimiento-caja-page-report',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    UserSearchComponent,
    Button,
    DynamicCard,
    MatCheckbox,
    MatDivider,
  ],
  templateUrl: './movimiento-caja-report.component.html',
  styles: ``,
})
export class MovimientoCajaReportComponent implements OnInit {
  isShowCompanyCustomer = false;
  isShowEmployee = true;
  sharedSvc = inject(SharedService);
  tS = inject(ToastrNotificationService);

  tiposDoc = [
    { codDoc: 'MC', descripcion: 'Movimiento Caja' },
    { codDoc: 'A', descripcion: 'Anticipo' },
  ];
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];

  dataSearch = {
    codEstab: null as string | null | undefined,
    codDoc: 'MC' as string | null,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    companyCustomerId: 0,
    employeeId: 0,
    format: '',
    checkboxCompanyCustomerEmployee: false,
    checkboxUser: false,
    userId: 0,
  };
  ngOnInit() {
    this.sharedSvc.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
      this.dataSearch.codEstab = this.establecimientos.find((e) => e.predeterminado)?.codEstab;
    });
  }

  onChangeTipoDoc() {
    if (this.dataSearch.codDoc === 'A') {
      this.isShowCompanyCustomer = true;
      this.isShowEmployee = false;
      this.dataSearch.employeeId = 0;
    }
    if (this.dataSearch.codDoc === 'MC') {
      this.isShowCompanyCustomer = false;
      this.isShowEmployee = true;
      this.dataSearch.companyCustomerId = 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  clearSearchCustomer() {
    this.dataSearch.companyCustomerId = 0;
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  emptyInputUser() {
    this.dataSearch.userId = 0;
  }

  onUserSelected({ data }: any) {
    console.log(data);
    this.dataSearch.userId = data.idUsuario;
  }
  getReportPdf() {
    this.dataSearch.format = REPORT_FORMAT.PDF;
    this.getReport();
  }

  getReportExcel() {
    this.dataSearch.format = REPORT_FORMAT.EXCEL;
    this.getReport();
  }

  protected getReport() {
    if (!isValidField(this.dataSearch.codEstab)) {
      this.tS.show({
        type: 'warning',
        message: 'Establecimiento es requerido!',
      });
      return;
    }

    if (!isValidField(this.dataSearch.codDoc)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el tipo documento!',
      });
      return;
    }

    if (this.dataSearch.checkboxCompanyCustomerEmployee) {
      if (!(this.dataSearch.companyCustomerId > 0 || this.dataSearch.employeeId > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el cliente/empleado!',
        });
        return;
      }
    }

    if (this.dataSearch.checkboxUser) {
      if (!this.dataSearch.userId) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el usuario!',
        });
        return;
      }
    }

    const companyCustomerId =
      (this.dataSearch.checkboxCompanyCustomerEmployee && this.dataSearch.companyCustomerId) || 0;
    const employeeId =
      (this.dataSearch.checkboxCompanyCustomerEmployee && this.dataSearch.employeeId) || 0;
    const userId = (this.dataSearch.checkboxUser && this.dataSearch.userId) || 0;

    const dataParams = {
      tipo: 2,
      codEstab: this.dataSearch.codEstab,
      tipoDoc: this.dataSearch.codDoc,
      checkBoxCliente: companyCustomerId > 0 && this.dataSearch.checkboxCompanyCustomerEmployee,
      idCliente: companyCustomerId > 0 ? companyCustomerId : null,
      checkBoxEmpleado: employeeId > 0 && this.dataSearch.checkboxCompanyCustomerEmployee,
      idEmpleado: employeeId || null,
      checkBoxUsuario: this.dataSearch.checkboxUser,
      idUsuario: userId || null,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
    };

    const reportParams = JSON.stringify({
      codEstab: this.dataSearch.codEstab,
      codigo: ACCOUNTING_CODE_REPORT.RMC,
      format: this.dataSearch.format,
      aditionalParams: [],
    });
    const parameters = {
      reportParams,
      dataParams: JSON.stringify(dataParams),
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.dataSearch.format,
    });
  }
}
