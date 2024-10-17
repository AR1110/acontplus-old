import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CartHeaderComponent } from '../cart-header/cart-header.component';
import { CartFooterComponent } from '../cart-footer/cart-footer.component';
import { CartItemsComponent } from '../cart-items/cart-items.component';

@Component({
  selector: 'app-cart-popup',
  standalone: true,
  imports: [
    MatCardModule,
    CartHeaderComponent,
    CartItemsComponent,
    CartFooterComponent
  ],
  templateUrl: './cart-popup.component.html',
  styleUrl: './cart-popup.component.scss'
})
export class CartPopupComponent {

}
