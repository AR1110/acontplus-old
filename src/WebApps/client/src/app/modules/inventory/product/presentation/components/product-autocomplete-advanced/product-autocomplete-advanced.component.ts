import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AutocompleteConfig, PRODUCT_AUTOCOMPLETE_CONFIG} from "@shared/models/autocomplete.interfaces";
import {ProductUseCase} from "@inventory/product/application/use-cases/product.use-case";
import {AutocompleteService} from "@shared/services/autocomplete.service";
import {ReusableAutocompleteComponent} from "@shared/components/reusable-autocomplete/reusable-autocomplete.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  ProductAutocompleteImageComponent
} from "@inventory/product/presentation/components/product-autocomplete-advanced/product-autocomplete-image/product-autocomplete-image.component";
import {
  ListProductWithPricesUseCase
} from "@inventory/product/application/use-cases/product/list-product-with-prices.use-case";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-product-autocomplete-advanced',
  imports: [
    MatTooltipModule,
    ReusableAutocompleteComponent,
    ProductAutocompleteImageComponent,
    CurrencyPipe
  ],
  templateUrl: './product-autocomplete-advanced.component.html',
  styleUrl: './product-autocomplete-advanced.component.scss'
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
  @Input() maxPricesToShow = 1;

  @Output() itemSelected = new EventEmitter<any>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() filterChanged = new EventEmitter<any>();
  @Output() createProductClicked = new EventEmitter<string>();
  @Output() stockDetails = new EventEmitter<any>();
  @Output() quickAdd = new EventEmitter<any>();
  @Output() imageClicked = new EventEmitter<{product: any, image: any}>();
  @Output() quickViewClicked = new EventEmitter<any>();

  private autocompleteService = inject(AutocompleteService);
  public $listProductWithPricesUseCase = inject(ListProductWithPricesUseCase);

  get finalConfig(): AutocompleteConfig {
    return {
      ...PRODUCT_AUTOCOMPLETE_CONFIG,
      placeholder: 'Buscar productos con precios...',
      itemsPerPage: 8, // Menos items por el mayor tamaño
      ...this.config
    };
  }

  productSearchFunction = this.autocompleteService.createGenericSearchFunction({
    search: this.$listProductWithPricesUseCase.execute
  })

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

  trackByPrice(index: number, price: any): any {
    return price.id || `${price.type}-${price.value}`;
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
