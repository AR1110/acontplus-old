import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { CustomTableContainerComponent } from '@/core/components/custom-table-container/custom-table-container.component';
import { ActionWhatsappSendDirective } from '@/directives/action-whatsapp-send.directive';
import { OrderRead } from '@/models/order.model';
import { Pagination } from '@/models/pagination.model';
import { DialogService } from '@/services/dialog.service';
import { OrderService } from '@/services/order.service';
import { ToasterService } from '@/services/toaster.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, input, model, output, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';

import { OrderDivideModalComponent } from '../order-divide-modal/order-divide-modal.component';
import { OrderDocModalComponent } from '../order-doc-modal/order-doc-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '@/services/shared.service';
import { CODE_REPORT, STATUS_ORDER } from '@/enums/main.enum';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@/core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@/pages/company-customer/components/company-customer-search/company-customer-search.component';
import { MainStoreService } from '@/store/main-store.service';
import { getValidId } from '@/core/utils/utils';
import { UserSelectHtmlOnly } from '@/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { PosStoreService } from '@/store/pos-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CustomContainerDialogComponent,
    CustomTableContainerComponent,
    ActionWhatsappSendDirective,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos
})
export class OrderListComponent {

  @Input({required: true}) dataSearch= {} as any;
  isComingOfPos = input(false)
  closeDialog = output()
 
  pagination = signal(new Pagination()) 
  

  private mainStore = inject(MainStoreService)
  
  private dialogSvc = inject(DialogService)
  private orderSvc = inject(OrderService)
  private tS = inject(ToasterService)
  private sharedSvc = inject(SharedService);
  private posStoreSvc = inject(PosStoreService)
  private router = inject(Router)

  displayedColumns: string[] = ['index', 'op', 'nroDoc', 'fechaEmision', 'customer', 'importeTotal', 'tableName', 'obs', 'userName'];


  isLoadingResults = signal(true)

  statusOrder = signal([
    { code: STATUS_ORDER.PENDIENTE, description: 'Pendiente' },
   // { code: STATUS_ORDER.PROCESO, description: 'En Proceso' },
    { code: STATUS_ORDER.FINALIZADO, description: 'Finalizado' },
    { code: STATUS_ORDER.ANULADO, description: 'Anulado' },
  ])
 

  users: UserSelectHtmlOnly[] = [];
  tablesGroup: any[] = [];
  
  dataSource = signal<OrderRead[]>([])
  
  selectedStatus = model('')

  isPending = computed(() => this.selectedStatus() === STATUS_ORDER.PENDIENTE)
  isFinished = computed(() => this.selectedStatus() === STATUS_ORDER.FINALIZADO)
  isDividing = computed(() => this.selectedStatus() === STATUS_ORDER.PROCESO)
  isDeleted = computed(() => this.selectedStatus() === STATUS_ORDER.ANULADO)



  getOrders() {
    let params = {
      isSearchDate: true,
      estabId: getValidId(this.mainStore.state().establecimientoId),
      puntoEmisionId: getValidId(this.mainStore.state().puntoEmisionId),
      startDate: this.dataSearch.startDate,
      endDate: this.dataSearch.endDate,
      customerCompanyId: getValidId(this.dataSearch.customerCompanyId),
      tableId: getValidId(this.dataSearch.tableId),
      userId: getValidId(this.dataSearch.userId),
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      isEnabled: !this.isDeleted(),
      finished: this.isFinished(),
      divided: this.isDividing(),
      deleted: this.isDeleted()
    }
    this.isLoadingResults.set(true)

    this.orderSvc.getAll(params).subscribe({
      next: (response) => {
        this.dataSource.set(response)
        this.pagination.update(e=>({
          ...e,
          totalRecords : this.dataSource.length > 0 ? this.dataSource()[0].totalRecords : 0
        }))
      },
      error: () => this.isLoadingResults.set(false),
      complete: () => {
        this.isLoadingResults.set(false);
      }
    })
  }

  ngOnInit() {
    this.selectedStatus.set(this.dataSearch.selectedStatus)
    this.orderSvc.getDataFilter().subscribe(response => {

      this.tablesGroup = response.tablesGroup;
      this.users = response.users;
      this.getOrders()
    })
  }

  refresh() {
    this.getOrders()
  }

  onChangeDateRange($event: any) {
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.refresh()
  }

  clearCustomer() {
    this.dataSearch.customerCompanyId = 0;
    this.refresh()
  }

  onSelectCustomer($event: any) {
    this.dataSearch.customerCompanyId = $event.idCliente;
    this.refresh()
  }

  selectionChangeStatusOrder(){
    this.refresh()
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update(dt=>{
      return {
        ...dt,
        totalRecords : e.length,
        pageSize : e.pageSize,
        pageIndex : e.pageIndex,
      }
    })
   
    this.refresh()
  }

  navigateToPos() {
    this.router.navigateByUrl('/pos')
  }

  onEdit(data: OrderRead) {
    this.orderSvc.getId(data.id).subscribe({
      next: response => {
        this.posStoreSvc.state.update(state => ({
          ...state,
          order: response.order,
          orderItems: response.order.items
        }));

        if (this.isComingOfPos()){
          this.closeDialog.emit()
        }else{
          this.navigateToPos()
        } 
      },
      error: err => {
        console.error('Error fetching order:', err);
      }
    });
  }

  openOrderDocDialog(item: OrderRead) {
    this.dialogSvc.open(OrderDocModalComponent, {
      size: 'xl',
      data: {
        orderId: item.id
      },

    }).subscribe(result => {
      if (result) {
        console.log('User confirmed');
        // Perform action on confirmation
      } else {
        console.log('User canceled');
        // Handle cancelation
      }
    });
  }

  async askToAnul(row: OrderRead) {
    let { isConfirmed } = await Swal.fire({
      title: "Anular Orden",
      text: "¿Estas seguro de anular el pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
      cancelButtonText: 'No!'
    })
    if (isConfirmed) {
      this.orderSvc.setAnul(row.id).subscribe(response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
          this.refresh()
        }
      })
    }
  }


  openOrderDivideDialog(item: OrderRead) {
    const modalRef = this.dialogSvc.open(OrderDivideModalComponent, {
      size: 'xl',
      data: {
        orderId: item.id
      }
    })

    modalRef.subscribe(result => {
      if (result && (result.isReload)) {
        this.refresh()
      }
    })

  }


  getReport(data: OrderRead) {

    const parameters = {
      dataParams: JSON.stringify({
        id: data.id
      }),
      reportParams: JSON.stringify({
        codEstab: data.codEstab,
        codigo: CODE_REPORT.OR,
        format: "pdf",
      }),
    };
    this.sharedSvc.getReport({
      data: parameters
    })

  };



}
