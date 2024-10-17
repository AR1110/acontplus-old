import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { CustomTableContainerComponent } from '@/core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@/core/components/date-range-selection/date-range-selection.component';
import { getValidId } from '@/core/utils/utils';
import { ActionWhatsappSendDirective } from '@/directives/action-whatsapp-send.directive';
import { CODE_REPORT, STATUS_ORDER } from '@/enums/main.enum';
import { Pagination } from '@/models/pagination.model';
import { UserSelectHtmlOnly } from '@/models/user.model';
import { CompanyCustomerSearchComponent } from '@company-customers/components/company-customer-search/company-customer-search.component';
import { DialogService } from '@/services/dialog.service';
import { OrderService } from '@/features/orders/services/order.service';
import { SharedService } from '@/services/shared.service';
import { ToasterService } from '@/services/toaster.service';
import { MainStoreService } from '@/store/main-store.service';
import { PosStoreService } from '@/store/pos-store.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Input, model, output, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { OrderDivideModalComponent } from '../order-divide-modal/order-divide-modal.component';
import { OrderDocListComponent } from '../order-doc-list/order-doc-list.component';
import { OrderRead } from '@orders/models/order.interface';

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
    OrderDocListComponent
  ],
  templateUrl: './order-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrl: './order-list.component.scss',
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos
})
export class OrderListComponent {

  @Input({ required: true }) dataSearch = {} as any;
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

  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  expandedElement: any | null;

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
      deleted: this.isDeleted(),
      typeSearchCustomer: this.dataSearch.typeSearchCustomer
    }


    this.isLoadingResults.set(true)

    this.dataSource.set([])
    this.orderSvc.getAll(params).subscribe({
      next: (response) => {
        this.dataSource.set(response.map((_, i) => ({ ..._, index: i + 1 })))
        this.pagination.update(e => ({
          ...e,
          totalRecords: this.dataSource().length > 0 ? this.dataSource()[0].totalRecords : 0
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

  onChangeTypeSearchCustomer(){
    if (getValidId(this.dataSearch.customerCompanyId)){
      this.refresh()
    }
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

  selectionChangeStatusOrder() {
    this.refresh()
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update(dt => {
      return {
        ...dt,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
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

        if (this.isComingOfPos()) {
          this.closeDialog.emit()
        } else {
          this.navigateToPos()
        }
      },
      error: err => {
        console.error('Error fetching order:', err);
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


  printOrder(data: OrderRead) {
    try {
      this.sharedSvc.askToPrint({
        id: data.id,
        documentoId: 0,
        tipo: 2
      })
    } catch (error) {
      console.log(error)
    }
  }



}
