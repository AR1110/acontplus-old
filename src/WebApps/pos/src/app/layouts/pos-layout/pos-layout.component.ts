import { NavUserInfoToggleComponent } from '@/core/components/nav-user-info-toggle/nav-user-info-toggle.component';
import { PaymentComponent } from '@/core/components/payment/payment.component';
import { OrderListModalComponent } from '@/pages/order-page/components/order-list-modal/order-list-modal.component';
import { CartPopupComponent } from '@/pages/pos-page/components/cart-popup/cart-popup.component';
import { DialogService } from '@/services/dialog.service';
import { PosStoreService } from '@/store/pos-store.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe } from "@angular/common";
import { Component, computed, inject, signal } from '@angular/core';
import { MatBadgeModule } from "@angular/material/badge";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-pos-layout',
  standalone: true,
  imports: [
    OverlayModule,
    RouterOutlet,
    AsyncPipe,
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    MatBadgeModule,
    NavUserInfoToggleComponent,
    CartPopupComponent
  ],
  templateUrl: './pos-layout.component.html',
  styleUrl: './pos-layout.component.scss'
})
export class PosLayoutComponent {
  private posStoreSvc = inject(PosStoreService);
  private dialogSvc = inject(DialogService)
  isOverlayOpen = signal(false);

  totalOrderItems = computed(() => {
    let quantity = this.posStoreSvc.state().orderItems?.reduce((acc, curr) => {
      return acc += curr.quantity
    }, 0)
    return quantity;
  })

  private router = inject(Router)


  navigateDashboard() {
    this.router.navigateByUrl('/dashboard')
  }


  openOrderListModal() {
    // let modalRef = this.dialogSvc.open(PaymentComponent, {
    //   size: 'xl',

    // })



    let modalRef = this.dialogSvc.open(OrderListModalComponent, {
      size: 'xl',

    })

  }

}
