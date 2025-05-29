import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { ItemListComponent } from '@restaurant/ui/item/item-list/item-list.component';
import { MenuListComponent } from '@restaurant/ui/menu/menu-list/menu-list.component';
import { PromotionListComponent } from '@restaurant/ui/promotion/promotion-list/promotion-list.component';
import { IngredientListComponent } from '@restaurant/ui/ingredient/ingredient-list/ingredient-list.component';
import { MatCardModule } from '@angular/material/card';
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";

@Component({
    selector: 'app-products-page',
  imports: [
    MatCardModule,
    BreadcrumbComponent,
    MatTabsModule,
    ItemListComponent,
    MenuListComponent,
    PromotionListComponent,
    IngredientListComponent,
    MatDynamicCardComponent,
  ],
    templateUrl: './products-page.component.html',
    styles: ``
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
