import {
  Component,
  inject,
  input,
  model,
  output,
  signal,
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
import { getValidId } from '@domain/utils/utils';
import { MatCardModule } from '@angular/material/card';
import { IconUserComponent } from '@ui/components/icons/icon-user/icon-user.component';
import { IconTablerShoppingCartDiscountComponent } from '@ui/components/icons/icon-tabler-shopping-cart-discount/icon-tabler-shopping-cart-discount.component';
import { LoadMoreComponent } from '@ui/pos-sale/load-more/load-more.component';
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
import {OrderStore} from "@ui/store/order.store";

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
export class TableOrdersComponent  {
  private $getFilterDataUseCase = inject(GetFilterDataOrderUseCase);
  private $anularUseCase = inject(AnularOrderUseCase);
  private $getIdUseCase = inject(GetIdOrderUseCase);
  private $getFormDataUseCase = inject(GetFormDataConfigUseCase)
  //Stores
  $permissionStore = inject(PermissionStore);
  private posStoreSvc = inject(PosStoreService);
  private $cartOverlaySvc = inject(CartOverlayService);
  private $layoutStore = inject(LayoutStore)
  $orderStore = inject(OrderStore)
  //services
  private _dialogSvc = inject(DialogService);
  private _sharedSvc = inject(SharedService);
  private _tS = inject(ToasterService);

  //angular
  private router = inject(Router)
  private _bottomSheet = inject(MatBottomSheet);

  isComingOfPos = input(false);
  closeDialog = output();

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

  ngOnInit() {

    this.$getFilterDataUseCase.execute().subscribe((response) => {
      this.rooms.set(response.tablesGroup);

      this.users = response.users;
      let dataRoom: any = {};

      //cuando proviene de modulo pos y mesas
      if(this.$orderStore.dataSearch.roomId()>0){
       dataRoom = this.rooms().find(r=>r.roomId===this.$orderStore.dataSearch.roomId()) || {};
      }else{
        dataRoom = this.rooms().length>0? this.rooms()[0]: {}
      }

      if (dataRoom.roomId > 0) {
        this.$orderStore.setPropDataSearch("roomId", dataRoom.roomId);
        this.handleFloorChange(null,this.$orderStore.dataSearch.tableId());
      }
    });
  }

  handleFloorChange(event?: any, tableId?: number): void {
    const selectedRoomId = event?.value;
    if (selectedRoomId) {
      this.$orderStore.setPropDataSearch("roomId", selectedRoomId);
    }

    const allTables = this.rooms().flatMap(room => room.tables);
    const filteredTables = allTables.filter(
      table => table.roomId === this.$orderStore.dataSearch.roomId()
    );

    this.tables.set(filteredTables);
    this.selectedIndex.set(0);

    let selectedTable = tableId
      ? filteredTables.find(table => table.id === this.$orderStore.dataSearch.tableId())
      : filteredTables[0];

    if (selectedTable?.id > 0) {
      this.$orderStore.setPropDataSearch("tableId", selectedTable.id);
      selectedTable.isActive = true;
      this.$orderStore.refresh();
    }
  }

  selectionChangeTable($event:any){
    this.$orderStore.setPropDataSearch("tableId", $event.value);
    this.$orderStore.refresh();
  }

  onChangeDateRange($event: any) {
    this.$orderStore.setPropDataSearch("startDate", $event.from)
    this.$orderStore.setPropDataSearch("endDate", $event.to)
    this.$orderStore.refresh();
  }

  selectionChangeUser($event:any){
    this.$orderStore.setPropDataSearch("userId", $event.value)
    this.$orderStore.refresh();
  }

  selectionChangeStatusOrder($event:any) {
    this.$orderStore.setPropDataSearch("selectedStatus", $event.value)
    if(this.$orderStore.dataSearch.selectedStatus()===STATUS_ORDER.FINALIZADO){
      this.$orderStore.setPropDataSearch("typeSearchCustomer", 'DOC');
    }else{
      this.$orderStore.setPropDataSearch("typeSearchCustomer", 'OR');
    }
    this.$orderStore.refresh();
  }

  clearCustomer() {
    this.$orderStore.setPropDataSearch("customerCompanyId", 0)
    this.$orderStore.refresh();
  }

  onSelectCustomer($event: any) {
    this.$orderStore.setPropDataSearch("customerCompanyId",  $event.idCliente)
    this.$orderStore.refresh();
  }

  onChangeTypeSearchCustomer($event:any) {
    this.$orderStore.setPropDataSearch("typeSearchCustomer", $event.value)
    if (getValidId(this.$orderStore.dataSearch.customerCompanyId())) {
      this.$orderStore.refresh();
    }
  }

  selectedIndexChange($event: number) {
    this.selectedIndex.set($event);
    const dataTable = this.tables().at($event);
    if (dataTable) {
      this.$orderStore.setPropDataSearch("tableId", dataTable.id)
      this.$orderStore.refresh();
    }
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
        this.$orderStore.refresh();
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
          this.$orderStore.refresh();
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

  ngOnDestroy(){
    this.$orderStore.resetState()
  }
}
