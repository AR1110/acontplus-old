import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CompanyCustomerAddEditDirective } from '@company-customer/directives/company-customer-add-edit.directive';
import { CompanyCustomerService } from '@company-customer/services/company-customer.service';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Pagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-customer-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatTableModule,
    FontAwesomeModule,
    MatPaginatorModule,
    BreadcrumbComponent,
    CompanyCustomerAddEditDirective,
    PrimaryStatusPipe,
  ],
  templateUrl: './company-customer-page.component.html',
})
export class CompanyCustomerPageComponent {
  companyCustomerSvc = inject(CompanyCustomerService);
  tS = inject(ToasterService);
  sharedSvc = inject(SharedService);

  displayedColumns: string[] = [
    'op',
    'position',
    'ruc',
    'razonSocial',
    'direccion',
    'telefono',
    'estado',
  ];

  pagination = new Pagination();

  dataSearch = {
    textSearch: null as string | null,
  };
  dataSource: any[] = [];

  onResultModal() {
    this.getCompanyCustomers();
  }

  search(value: string) {
    this.dataSearch.textSearch = value;
    this.getCompanyCustomers();
  }

  getCompanyCustomers() {
    try {
      let params = {
        pageIndex: this.pagination.pageIndex + 1,
        pageSize: this.pagination.pageSize,
        checkTextSearch: isValidField(this.dataSearch.textSearch)
          ? true
          : false,
        textSearch: isValidField(this.dataSearch.textSearch),
      };
      this.companyCustomerSvc.getAll(params).subscribe((response) => {
        this.dataSource = response;

        if (this.dataSource.length > 0) {
          let dataResult = this.dataSource[0];
          this.pagination.totalRecords = dataResult.totalRecords;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    this.getCompanyCustomers();
  }

  refresh() {
    this.dataSearch.textSearch = null;
    this.getCompanyCustomers();
  }

  onPageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.pageIndex = event.pageIndex;
    this.getCompanyCustomers();
  }

  async askToDelete(item: any) {
    try {
      let { isConfirmed } = await Swal.fire({
        html: `<small>Esta Ud. seguro de Inactivar al Cliente <b>${item.razonSocial}</b></small>?`,
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Sí, inactivar!',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar!',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.companyCustomerSvc
          .updateState(item.idCliente)
          .subscribe((response) => {
            if (isApiResponse(response)) {
              if (response.code === '0') {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message,
                });
              }
              if (response.code === '1') {
                this.tS.toastr({
                  type: 'success',
                  message: response.message,
                });
                this.getCompanyCustomers();
              }
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  getReport(format: string) {
    let dataParms = {
      tipo: 4,
    };

    const parameters = {
      hasService: false,
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: 'RCL',
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: format,
      isOldVersion: true,
    });
  }
}
