import { Component, computed, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ProductSearchBarService} from "@inventory/product/application/services/product-search-bar.service";
@Component({
  selector: 'app-product-search-overlay',
  imports: [
    MatDivider, MatListModule, MatIcon, MatIconButton, MatButton
  ],
  templateUrl: './product-search-overlay.component.html',
  styles: `
    .overlay-container {
       border-radius: 0px 0px 32px 32px;
      min-width: 468px;
      background: white;
      padding-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 16px;
    }


    .search-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #e8eaed;
    }
  `
})
export class ProductSearchOverlayComponent {
  searchBarSvc = inject(ProductSearchBarService);
  recentSearches = computed(() => this.searchBarSvc.recentSearches().slice(0, 5));

  deleteRecentSearch(searchTerm: string) {
    this.searchBarSvc.deleteRecentSearch(searchTerm)
  }

  performSearch(searchTerm: string) {

    this.searchBarSvc.search(searchTerm)
  }
}
