import { Component, computed, inject, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavUserInfoToggleComponent } from '../nav-user-info-toggle/nav-user-info-toggle.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NavUserToggleComponent } from '../nav-user-toggle/nav-user-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { ActionOrderDialogDirective } from '@/ui/directives/action-order-dialog.directive';
import {
  FlexibleConnectedPositionStrategy,
  OverlayModule,
} from '@angular/cdk/overlay';
import { PosStoreService } from '@/ui/store/pos-store.service';
import { CartPopupComponent } from '@/ui/pos-sale/cart-popup/cart-popup.component';

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

  isOverlayOpen = signal(false);
  positionStrategy!: FlexibleConnectedPositionStrategy;
  private posStoreSvc = inject(PosStoreService);

  totalOrderItems = computed(() => {
    let quantity = this.posStoreSvc.state().orderItems?.reduce((acc, curr) => {
      return (acc += curr.quantity);
    }, 0);
    return quantity;
  });
}
