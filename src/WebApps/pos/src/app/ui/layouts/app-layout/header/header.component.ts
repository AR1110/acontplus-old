import {
  Component,
  computed,
  inject,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavUserInfoToggleComponent } from '../nav-user-info-toggle/nav-user-info-toggle.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NavUserToggleComponent } from '../nav-user-toggle/nav-user-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { ActionOrderDialogDirective } from '@/ui/directives/action-order-dialog.directive';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  OverlayModule,
} from '@angular/cdk/overlay';
import { PosStoreService } from '@/ui/store/pos-store.service';
import { CartPopupComponent } from '@/ui/pos-sale/cart-popup/cart-popup.component';
import { CartOverlayService } from '@/ui/store/cart-overlay.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    OverlayModule,
    NavUserInfoToggleComponent,
    NavUserToggleComponent,
    CartPopupComponent,

    ActionOrderDialogDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  toggleSidenav = output();
  posStoreSvc = inject(PosStoreService);
  $cartOverlaySvc = inject(CartOverlayService);
  @ViewChild('trigger') trigger!: CdkOverlayOrigin;

  totalOrderItems = computed(() => {
    let quantity = this.posStoreSvc.state().orderItems?.reduce((acc, curr) => {
      return (acc += curr.quantity);
    }, 0);
    return quantity;
  });
}
