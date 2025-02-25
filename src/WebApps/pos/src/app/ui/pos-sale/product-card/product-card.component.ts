import {
  FlexibleConnectedPositionStrategy,
  OverlayModule,
} from '@angular/cdk/overlay';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  imports: [
    NgClass,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    OverlayModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: any;
  @Output() addToCart = new EventEmitter<any>();

  infoProductCard = signal(false);
  positionStrategy!: FlexibleConnectedPositionStrategy;

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  infoProductCardToggle($event: Event): void {
    $event.stopPropagation();
    this.infoProductCard.set(!this.infoProductCard());
  }

  overlayOutsideClick(event: Event): void {
    this.infoProductCard.set(false);
  }
}
