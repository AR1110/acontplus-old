
import { Order } from '@/features/orders/models/order.interface';
import { CompanyCustomerSearchComponent } from '@company-customers/components/company-customer-search/company-customer-search.component';
import { PosStoreService } from '@/store/pos-store.service';
import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TableModalComponent } from '../table-modal/table-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './cart-header.component.html',
  styleUrl: './cart-header.component.scss'
})
export class CartHeaderComponent {
  private posStoreSvc = inject(PosStoreService);
  public dialog = inject(Dialog)


  vendedores = computed(() => this.posStoreSvc.state().vendedores);
  tableDesc = computed(() => this.posStoreSvc.state().order.tableDesc ?? 'Seleccionar Mesa...')

  order = computed(() => this.posStoreSvc.state().order)
  userId = computed(() => this.posStoreSvc.state().order?.userId)

  onClickTable( ) {

    const dialogRef = this.dialog.open(TableModalComponent, {
      width: '100vw',
      height: '100vh',
   //   panelClass: 'full-screen-cdk-dialog',
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


  onChangeVendedor(event: any): void {
    const userId = event.value;
    this.updateOrder({ userId });
  }

  onSelectCustomerCompany(event: any): void {
    const {
      razonSocialComprador: customerName, idCliente: customerCompanyId,
      codigoSri: tipoIdentificacionSri
    } = event;
    this.updateOrder({ customerName, customerCompanyId, tipoIdentificacionSri });
  }


}
