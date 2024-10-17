import {Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Pagination} from "@/models/pagination.model";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CustomTableContainerComponent} from "@core/components/custom-table-container/custom-table-container.component";
import {MatTableModule} from "@angular/material/table";
import {CompanyCustomerService} from "@/features/company-customers/services/company-customer.service";
import {MatButtonModule} from "@angular/material/button";
import {CompanyCustomerRead} from "@/features/company-customers/models/company-customer.model";
import {PrimaryStatusPipe} from "@core/pipes/primary-status.pipe";
import {ActionCompanyCustomerAddEditModalDirective} from "@/directives/action-company-customer-add-edit.directive";


@Component({
  selector: 'app-company-customer-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    CustomTableContainerComponent,
    PrimaryStatusPipe,
    ActionCompanyCustomerAddEditModalDirective
  ],
  templateUrl: './company-customer-page.component.html',
})
export class CompanyCustomerPageComponent {
  private companyCustomerSvc = inject(CompanyCustomerService)
  displayedColumns: string[] = ['index','op', 'ruc', 'razonSocial', 'nombreComercial','direccion','correo','telefono','estado'];

  data: CompanyCustomerRead[] = [];

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pagination = new Pagination()



  getCompanyCustomers(){
    let params = {
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize
    }
    this.isLoadingResults=true;
    this.companyCustomerSvc.getAll(params).subscribe({
      next: response=>{
        this.isLoadingResults = false;
        console.log(response)
        this.data = response;
        this.pagination.totalRecords = this.data.length>0?this.data[0].totalRecords: 0
      },
      error:()=>this.isLoadingResults=false
    })
  }

  ngOnInit(){
    this.getCompanyCustomers()
  }

  refresh(){
    this.getCompanyCustomers()
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.totalRecords = e.length;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.getCompanyCustomers()
  }
}
