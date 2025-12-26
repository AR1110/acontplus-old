import { Component, inject, Input, output } from '@angular/core';
import {
  AutocompleteConfig,
  PRODUCT_AUTOCOMPLETE_CONFIG,
} from '@shared/models/autocomplete.interfaces';
import { AutocompleteService } from '@shared/services/autocomplete.service';
import { ReusableAutocompleteComponent } from '@shared/components/reusable-autocomplete/reusable-autocomplete.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrencyPipe } from '@angular/common';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';

@Component({
  selector: 'app-product-autocomplete-advanced',
  imports: [MatTooltipModule, ReusableAutocompleteComponent, CurrencyPipe],
  templateUrl: './product-autocomplete-advanced.component.html',
  styleUrl: './product-autocomplete-advanced.component.scss',
})
export class ProductAutocompleteAdvancedComponent {
  @Input() config: Partial<AutocompleteConfig> = {};
  @Input() imageSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() enableImageZoom = true;
  @Input() enableQuickView = true;
  @Input() showStockBadge = true;
  @Input() showImageNavigation = true;
  @Input() autoRotateImages = false;
  @Input() showQuickActions = true;
  @Input() maxLocationsToShow = 4;
  @Input() maxPricesToShow = 5;

  itemSelected = output<any>();
  searchChanged = output<string>();
  pageChanged = output<number>();
  filterChanged = output<any>();
  createProductClicked = output<string>();
  stockDetails = output<any>();
  quickAdd = output<any>();
  imageClicked = output<{ product: any; image: any }>();
  quickViewClicked = output<any>();

  private autocompleteService = inject(AutocompleteService);
  public $productService = inject(PRODUCT_SERVICE);

  get finalConfig(): AutocompleteConfig {
    return {
      ...PRODUCT_AUTOCOMPLETE_CONFIG,
      placeholder: 'Buscar productos por nombre, SKU o código de barras...',
      itemsPerPage: 8, // Menos items por el mayor tamaño
      clearInput: true,
      ...this.config,
    };
  }

  productSearchFunction = this.autocompleteService.createGenericSearchFunction({
    search: this.$productService.listProductWithPrices,
  });

  onProductSelected(product: any) {
    this.itemSelected.emit(product);
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'SIN';
    if (stock <= 5) return 'BAJO';
    return stock.toString();
  }

  getDisplayPrices(prices: any[]): any[] {
    if (!prices || prices.length === 0) return [];

    // Ordenar precios por importancia
    const sortedPrices = [...prices].sort((a, b) => {
      // Precio por defecto primero
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;

      // Precios promocionales segundo
      if (a.type === 'promotional' && b.type !== 'promotional') return -1;
      if (a.type !== 'promotional' && b.type === 'promotional') return 1;

      // Ordenar por precio (menor primero)
      return a.value - b.value;
    });

    return sortedPrices.slice(0, this.maxPricesToShow);
  }

  isPromotional(price: any): boolean {
    return price.type === 'promotional' && !!price.validTo;
  }

  onQuickAdd(product: any, event: Event) {
    event.stopPropagation();
    this.quickAdd.emit(product);
  }

  onViewDetails(product: any, event: Event) {
    event.stopPropagation();
  }

  onViewAllPrices(product: any, event: Event) {
    event.stopPropagation();
  }

  onImageClick(image: any) {
    // El producto se obtiene del contexto
    this.imageClicked.emit({ product: null as any, image });
  }
}
