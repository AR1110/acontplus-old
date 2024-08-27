import { Component, computed, inject, model, } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
import { Pagination } from "@/models/pagination.model";
import { MatSelectModule } from "@angular/material/select";
import {
  CompanyCustomerSearchComponent
} from "@/pages/company-customer/components/company-customer-search/company-customer-search.component";
import { FormsModule  } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { OrderService } from "@/services/order.service";
import { OrderRead } from "@/models/order.model";
import { UserSelectHtmlOnly } from "@/models/user.model";
import { DialogService } from '@/services/dialog.service';
import { formatDateToString } from '@/core/utils/date.util';
import { getValidId } from '@/core/utils/utils';
import { ToasterService } from "@/services/toaster.service";
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './components/order-list/order-list.component';
import { MainStoreService } from '@/store/main-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    OrderListComponent
  ],
  templateUrl: './order-page.component.html',
})
export class OrderPageComponent {

  data: OrderRead[] = [];

  isLoadingResults = true;

  pagination = new Pagination()
  orderSvc = inject(OrderService)
  dialogSvc = inject(DialogService)
  private tS = inject(ToasterService)
  private mainStore = inject(MainStoreService)
  private router = inject(Router)
  users: UserSelectHtmlOnly[] = [];
  tablesGroup: any[] = [];

  dataSearch = {
    userId: 0,
    tableId: 0,
    typeListOrder: 'SD',
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    customerCompanyId: 0,
  }
  isFinished = computed(() => this.typeListOrder() === 'CD')
  typeListOrder = model('SD')

  getOrders() {
    let params = {
      isSearchDate: true,
      establecimientoId: getValidId(this.mainStore.state().establecimientoId),
      puntoEmisionId: getValidId(this.mainStore.state().puntoEmisionId),
      startDate: this.dataSearch.startDate,
      endDate: this.dataSearch.endDate,
      customerCompanyId: getValidId(this.dataSearch.customerCompanyId),
      tableId: getValidId(this.dataSearch.tableId),
      userId: getValidId(this.dataSearch.userId),
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize,
     finished: this.isFinished()
    }
    this.isLoadingResults = true;

    this.orderSvc.getAll(params).subscribe({
      next: (response) => {
        this.data = response;
        this.pagination.totalRecords = this.data.length > 0 ? this.data[0].totalRecords : 0
      },
      error: () => this.isLoadingResults = false,
      complete: () => {
        this.isLoadingResults = false
      }
    })
  }

  ngOnInit() {
    this.orderSvc.getDataFilter().subscribe(response => {

      this.tablesGroup = response.tablesGroup;
      this.users = response.users;
      this.getOrders()
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.totalRecords = e.length;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.refresh()
  }

  refresh() {
    this.getOrders()
  }

  clearCustomer() {
    this.dataSearch.customerCompanyId = 0;
    this.refresh()
  }

  onSelectCustomer($event: any) {
    this.dataSearch.customerCompanyId = $event.idCliente;
    this.refresh()
  }

  onChangeDateRange($event: any) {
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.refresh()
  }

  onChangeTypeListOrder() {
    if (this.isLoadingResults) return
    this.pagination = new Pagination()
    this.refresh()
  }

  navigateToPos() {
    this.router.navigateByUrl('/pos')
  }


}

