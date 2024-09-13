import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ItemListComponent } from '@restaurant/products/item/item-list/item-list.component';
import { MenuListComponent } from '@restaurant/products/menu/menu-list/menu-list.component';
import { PromotionListComponent } from '@restaurant/products/promotion/promotion-list/promotion-list.component';
import { IngredientListComponent } from '@restaurant/products/ingredient/ingredient-list/ingredient-list.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTab,
    MatTabGroup,
    ItemListComponent,
    MenuListComponent,
    PromotionListComponent,
    IngredientListComponent,
  ],
  templateUrl: './products-page.component.html',
  styles: ``,
})
export class ProductsPageComponent {
  isMenuTabActive: boolean = false;
  isPromotionTabActive: boolean = false;
  isIngredientTabActive: boolean = false;

  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1: // '1' es el índice de la pestaña 'Salas'
        this.isMenuTabActive = true;
        break;
      case 2:
        this.isPromotionTabActive = true;
        break;
      case 3:
        this.isIngredientTabActive = true;
        break;
    }
  }
}
