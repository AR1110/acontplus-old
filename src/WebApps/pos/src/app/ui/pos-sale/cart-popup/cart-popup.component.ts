import { Component, computed, inject, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CartHeaderComponent } from '@ui/pos-sale/cart-popup/cart-header/cart-header.component';
import { CartFooterComponent } from '@ui/pos-sale/cart-popup/cart-footer/cart-footer.component';
import { CartItemsComponent } from '@ui/pos-sale/cart-popup/cart-items/cart-items.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PosStoreService } from '@ui/store/pos-store.service';

@Component({
  selector: 'app-cart-popup',
  imports: [
    MatIconModule,
    OverlayscrollbarsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CartHeaderComponent,
    CartItemsComponent,
    CartFooterComponent,
  ],
  templateUrl: './cart-popup.component.html',
  styleUrl: './cart-popup.component.scss',
})
export class CartPopupComponent {
  toggleCart = output();
  private posStoreSvc = inject(PosStoreService);
  orderItems = computed(() => this.posStoreSvc.state().orderItems);

}
