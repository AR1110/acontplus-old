import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {ItemSearch} from "@restaurant/ui/items/item-search/item-search";
import {CATEGORY_ABBREVIATIONS} from "@restaurant/restaurant-const";
import {Button} from "@acontplus/ng-components";

@Component({
  selector: 'app-item-search-dialog',
  imports: [
    ItemSearch,
    Button
  ],
  templateUrl: './item-search-dialog.html',
  styleUrl: './item-search-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSearchDialog {
    data = input.required<any>();
    closed = output<any>();
  categoryAbbraviation = signal(CATEGORY_ABBREVIATIONS.RESTAURANT)
  itemSearchLabel = signal('Buscar Producto');


  onSelectItem($event:any){
    this.closed.emit($event);
  }

  closeOverlay() {
    this.closed.emit(null);
  }
}
