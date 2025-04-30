import {
  Component,
  computed,
  inject,
  input,
  Input,
  model,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GetFilterDataOrderUseCase } from '@domain/use-cases/order/get-filter-data-order.use-case';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ActionWhatsappSendDirective } from '@ui/directives/action-whatsapp-send.directive';
import { MatMenuModule } from '@angular/material/menu';
import { PermissionStore } from '@ui/store/permission.store';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderList } from '@domain/models/order.model';
import { CODE_REPORT, DOC_TYPE, STATUS_ORDER } from '@domain/enums/main.enum';
import { DateRangeSelectionComponent } from '@ui/components/date-range-selection/date-range-selection.component';
import { ListOrderUseCase } from '@domain/use-cases/order/list-order.use-case';
import { getValidId } from '@domain/utils/utils';
import { Pagination } from '@domain/models/pagination.model';
import { PageNumber } from '@domain/value-objects/page-number.vo';
import { PageSize } from '@domain/value-objects/page-size.vo';
import { PaginationParams } from '@domain/value-objects/pagination-params';
import { MatCardModule } from '@angular/material/card';
import { IconUserComponent } from '@ui/components/icons/icon-user/icon-user.component';
import { IconTablerShoppingCartDiscountComponent } from '@ui/components/icons/icon-tabler-shopping-cart-discount/icon-tabler-shopping-cart-discount.component';
import { LoadMoreComponent } from '@ui/pos-sale/load-more/load-more.component';
import { finalize } from 'rxjs';
import { CompanyCustomerSearchComponent } from '@ui/company-customer/components/company-customer-search/company-customer-search.component';
import { UserSelectHtmlOnly } from '@domain/models/user.model';
import { OrderDivideModalComponent } from '@ui/orders/components/order-divide-modal/order-divide-modal.component';
import { DialogService } from '@domain/services/dialog.service';
import { SharedService } from '@domain/services/shared.service';
import { GetIdOrderUseCase } from '@domain/use-cases/order/get-id-order.use-case';
import { Router } from '@angular/router';
import { PosStoreService } from '@ui/store/pos-store.service';
import { CartOverlayService } from '@ui/store/cart-overlay.service';
import Swal from 'sweetalert2';
import { AnularOrderUseCase } from '@domain/use-cases/order/anular-order.use-case';
import { ToasterService } from 'acontplus-utils';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {BottomSheetDocsComponent} from "@ui/orders/components/bottom-sheet-docs/bottom-sheet-docs.component";
import {LayoutStore} from "@ui/store/layout.store";
import {GetFormDataConfigUseCase} from "@domain/use-cases/config/get-form-data-config.use-case";

@Component({
  selector: 'app-table-orders',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    CurrencyPipe,
    ActionWhatsappSendDirective,
    MatIconModule,
    MatMenuModule,
    MatTooltip,
    MatButtonModule,
    NgClass,
    DateRangeSelectionComponent,
    IconUserComponent,
    IconTablerShoppingCartDiscountComponent,
    LoadMoreComponent,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './table-orders.component.html',
  styleUrl: './table-orders.component.scss',
})
export class TableOrdersComponent implements OnInit {
  private $getFilterDataUseCase = inject(GetFilterDataOrderUseCase);
  private $listUseCase = inject(ListOrderUseCase);
  private $anularUseCase = inject(AnularOrderUseCase);
  private $getIdUseCase = inject(GetIdOrderUseCase);
  private $getFormDataUseCase = inject(GetFormDataConfigUseCase)
  //Stores
  $permissionStore = inject(PermissionStore);
  private posStoreSvc = inject(PosStoreService);
  private $cartOverlaySvc = inject(CartOverlayService);
  private $layoutStore = inject(LayoutStore)
  //services
  private _dialogSvc = inject(DialogService);
  private _sharedSvc = inject(SharedService);
  private _tS = inject(ToasterService);

  //angular
  private router = inject(Router);
  private _bottomSheet = inject(MatBottomSheet);

  @Input({ required: true }) dataSearch = {} as any;
  isComingOfPos = input(false);
  moreFilter = input(false);
  closeDialog = output();

  selectedStatus = model('');
  rooms = signal<any[]>([]);
  tables = signal<any[]>([]);
  selectedIndex = signal(0);

  users: UserSelectHtmlOnly[] = [];
  dataSource = signal<OrderList[]>([]);

  statusOrder = signal([
    { code: STATUS_ORDER.PENDIENTE, description: 'Pendiente' },
    // { code: STATUS_ORDER.PROCESO, description: 'En Proceso' },
    { code: STATUS_ORDER.FINALIZADO, description: 'Finalizado' },
    { code: STATUS_ORDER.ANULADO, description: 'Anulado' },
  ]);

  isPending = computed(() => this.selectedStatus() === STATUS_ORDER.PENDIENTE);
  isFinished = computed(
    () => this.selectedStatus() === STATUS_ORDER.FINALIZADO
  );
  isDividing = computed(() => this.selectedStatus() === STATUS_ORDER.PROCESO);
  isDeleted = computed(() => this.selectedStatus() === STATUS_ORDER.ANULADO);

  pagination = signal(new Pagination());
  loading = signal(false);

  private getParams() {
    const pagination = new PaginationParams(
      PageNumber.create(this.pagination().pageIndex + 1),
      PageSize.create(this.pagination().pageSize)
    );

    const query = pagination.toQuery();

    return {
      isSearchDate: true,
      estabId: getValidId(this.$layoutStore.establecimientoId()),
      puntoEmisionId: getValidId(this.$layoutStore.puntoEmisionId()),
      startDate: this.dataSearch.startDate,
      endDate: this.dataSearch.endDate,
      customerCompanyId: getValidId(this.dataSearch.customerCompanyId),
      tableId: getValidId(this.dataSearch.tableId),
      userId: getValidId(this.dataSearch.userId),
      pageIndex: query.page,
      pageSize: query.pageSize,
      isEnabled: !this.isDeleted(),
      finished: this.isFinished(),
      divided: this.isDividing(),
      deleted: this.isDeleted(),
      typeSearchCustomer: this.dataSearch.typeSearchCustomer,
    };
  }
  private getList() {
    this.$listUseCase.execute(this.getParams()).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pagination.update((item) => {
        return {
          ...item,
          totalRecords: response.totalRecords,
        };
      });
    });
  }

  ngOnInit() {
    this.selectedStatus.set(this.dataSearch.selectedStatus);

    this.$getFilterDataUseCase.execute().subscribe((response) => {
      this.rooms.set(response.tablesGroup);

      this.users = response.users;
      const dataRoom = this.rooms().length > 0 ? this.rooms()[0] : {};
      if (dataRoom.roomId > 0) {
        this.dataSearch.roomId = dataRoom.roomId;
        this.handleFloorChange();
      }
    });
  }

  handleFloorChange() {
    const tables = this.rooms().flatMap((r) => r.tables);

    const tablesFiltered = tables.filter(
      (t) => t.roomId === this.dataSearch.roomId
    );
    this.tables.set([]);
    this.tables.set(tablesFiltered);

    this.selectedIndex.set(0);
    const dataTable = this.tables().length > 0 ? this.tables()[0] : {};
    if (dataTable.id > 0) {
      this.dataSearch.tableId = dataTable.id;
      dataTable.isActive = true;
      this.getList();
    }
  }
  refresh() {
    this.getList();
  }

  onChangeDateRange($event: any) {
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.refresh();
  }
  selectionChangeStatusOrder() {
    this.refresh();
  }

  clearCustomer() {
    this.dataSearch.customerCompanyId = 0;
    this.refresh();
  }

  onSelectCustomer($event: any) {
    this.dataSearch.customerCompanyId = $event.idCliente;
    this.refresh();
  }

  onChangeTypeSearchCustomer() {
    if (getValidId(this.dataSearch.customerCompanyId)) {
      this.refresh();
    }
  }

  selectedIndexChange($event: number) {
    this.selectedIndex.set($event);
    const dataTable = this.tables().at($event);
    if (dataTable) {
      this.dataSearch.tableId = dataTable.id;

      this.refresh();
    }
  }

  onLoadMore() {
    this.pagination.update((dp) => {
      return {
        ...dp,
        pageIndex: dp.pageIndex + 1,
      };
    });
    this.loading.set(true);
    this.$listUseCase
      .execute(this.getParams())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response)=>{
        this.dataSource.set([...this.dataSource(), ...response.data]);
        this.pagination.update((item) => {
          return {
            ...item,
            totalRecords: response.totalRecords,
          };
        })
      })
  }

  openOrderDivideDialog(item: OrderList) {
    const modalRef = this._dialogSvc.open(OrderDivideModalComponent, {
      size: 'xl',
      data: {
        orderId: item.id,
      },
    });

    modalRef.subscribe((result) => {
      if (result && result.isReload) {
        this.refresh();
        this.refreshGetFormData()
      }
    });
  }

  private refreshGetFormData(){
    let params = {
      codEstab: this.$layoutStore.codEstab(),
      idEstablecimiento: this.$layoutStore.establecimientoId(),
    };
    this.$getFormDataUseCase.execute(params).subscribe(response=>{
      this.posStoreSvc.state.update((e) => {

        return {
          ...e,
          pendingOrders: response.pendingOrders,
        };
      });
    })
  }

  printOrder(data: OrderList) {
    try {
      this._sharedSvc.askToPrint({
        id: data.id,
        documentoId: 0,
        tipo: 2,
        codDoc: DOC_TYPE.OR,
      });
    } catch (error) {
      console.log(error);
    }
  }

  private navigateToPos() {
    this.router.navigateByUrl('/pos').then();
  }

  onEdit(data: OrderList) {
    this.$getIdUseCase.execute(data.id).subscribe((response) => {
      this.posStoreSvc.state.update((state) => ({
        ...state,
        order: response.order,
        orderItems: response.order.items,
      }));

      if (this.isComingOfPos()) {
        this.closeDialog.emit();
        setTimeout(() => {
          if (data.id > 0 && !this.$cartOverlaySvc.overlayState()) {
            document.getElementById('cart-button-id')?.click();
          }
        }, 1000);
      } else {
        this.navigateToPos();
      }
    });
  }

  async askToAnul(row: OrderList) {
    const { isConfirmed } = await Swal.fire({
      title: 'Anular Orden',
      text: '¿Estas seguro de anular el pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
    });
    if (isConfirmed) {
      this.$anularUseCase.execute(row.id).subscribe((response) => {
        if (response.code === '0') {
          this._tS.toastr({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this._tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.refresh();
        }
      });
    }
  }

  getReport(data: OrderList) {
    const parameters = {
      dataParams: JSON.stringify({
        id: data.id,
      }),
      reportParams: JSON.stringify({
        codEstab: data.codEstab,
        codigo: CODE_REPORT.OR,
        format: 'pdf',
      }),
    };
    this._sharedSvc.getReport({
      data: parameters,
    });
  }

  showDocs(data: OrderList){
    this._bottomSheet.open(BottomSheetDocsComponent, {
      data
    });
  }
}
