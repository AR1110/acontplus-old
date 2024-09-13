import { Order } from '@/models/order.model';
import { CompanyCustomerSearchComponent } from '@/pages/company-customer/components/company-customer-search/company-customer-search.component';
import { TableModalComponent } from "@/pages/pos-page/components/table-modal/table-modal.component";
import { DialogService } from "@/services/dialog.service";
import { PosStoreService } from '@/store/pos-store.service';
import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [
    FormsModule,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './cart-header.component.html',
  styleUrl: './cart-header.component.scss'
})
export class CartHeaderComponent {


  private dialogSvc = inject(DialogService)
  private posStoreSvc = inject(PosStoreService);
  public dialog = inject(Dialog)


  vendedores = computed(() => this.posStoreSvc.state().vendedores);
  tableDesc = computed(() => this.posStoreSvc.state().order.tableDesc ?? 'Seleccionar Mesa...')

  order = computed(() => this.posStoreSvc.state().order)
  userId = computed(() => this.posStoreSvc.state().order?.userId)

  onClickTable() {
    // this.dialogSvc.open(TableModalComponent, {
    //   size: 'md',
    //   isFullScreen: true
    // })

    const dialogRef = this.dialog.open(TableModalComponent, {
      width: '100vw',
      height: '100vh',
      panelClass: 'full-screen-cdk-dialog',
    });
  }

  private updateOrder(partialOrder: Partial<Order>): void {
    this.posStoreSvc.state.update(state => ({
      ...state,
      order: {
        ...state.order,
        ...partialOrder
      }
    }));
  }


  onChangeVendedor(event: Event): void {
    const userId = Number((event.target as HTMLSelectElement).value);
    this.updateOrder({ userId });
  }

  onSelectCustomerCompany(event: any): void {
    console.log(event)
    const {
      razonSocialComprador: customerName, idCliente: customerCompanyId,
      codigoSri: tipoIdentificacionSri
    } = event;
    this.updateOrder({ customerName, customerCompanyId, tipoIdentificacionSri });
  }


}
