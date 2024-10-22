import { NavUserInfoToggleComponent } from "@/core/components/nav-user-info-toggle/nav-user-info-toggle.component";
import { ActionOrderDialogDirective } from "@/shared/directives/action-order-dialog.directive";
import { CartPopupComponent } from "@/features/pos/components/cart-popup/cart-popup.component";

import { PosStoreService } from "@/features/pos/store/pos-store.service";
import {  FlexibleConnectedPositionStrategy, Overlay, OverlayModule } from "@angular/cdk/overlay";
import { AsyncPipe } from "@angular/common";
import { Component, computed, inject, signal  } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-pos-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    MatBadgeModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    NavUserInfoToggleComponent,
    CartPopupComponent,
    ActionOrderDialogDirective
  ],
  templateUrl: './pos-layout.component.html',
  styleUrl: './pos-layout.component.scss'
})
export class PosLayoutComponent {
  private posStoreSvc = inject(PosStoreService);
  private router = inject(Router)
  isOverlayOpen = signal(false);

  // @ViewChild(CdkOverlayOrigin) trigger!: CdkOverlayOrigin;
  positionStrategy!: FlexibleConnectedPositionStrategy;
  private overlay = inject(Overlay)


  // ngAfterViewChild(){
  //   this.positionStrategy = this.overlay.position()
  //   .flexibleConnectedTo(this.trigger.elementRef) // Usar el elemento de origen
  //   .withPositions([
  //     { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  //     { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  //     { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  //     { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' }, // Modificado aquí
  //     { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' }, // Nueva posición
  //   ]);
  // }

  totalOrderItems = computed(() => {
    let quantity = this.posStoreSvc.state().orderItems?.reduce((acc, curr) => {
      return acc += curr.quantity
    }, 0)
    return quantity;
  })



  navigateDashboard() {
    this.router.navigateByUrl('/dashboard')
  }



}
