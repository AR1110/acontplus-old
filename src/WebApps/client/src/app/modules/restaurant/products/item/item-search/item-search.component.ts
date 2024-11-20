import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { NgbHighlight, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Item } from '@restaurant/models/item.model';
import { ItemService } from '@restaurant/services/item.service';

@Component({
    selector: 'app-item-search',
    imports: [NgbHighlight, NgbTypeahead, FormsModule],
    templateUrl: './item-search.component.html',
    styles: ``
})
export class ItemSearchComponent {
  searching = false;
  searchFailed = false;
  @Output() onItemSelected = new EventEmitter<{
    item: Item;
  }>();
  @Output() resultEmptyInput = new EventEmitter();
  @Input() textSearch = '';
  @Input() id = 0;
  item = {} as Item;
  #itemService = inject(ItemService);

  onKeyupSearch() {
    if (!this.textSearch) {
      this.id = 0;
      this.resultEmptyInput.emit({});
    }
  }

  onSelect($event: any) {
    this.item = $event.item as Item;
    this.id = this.item.id;
    this.setCustomerData(this.item);
  }

  search: OperatorFunction<string, Array<Item>> = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.id = 0;
      }),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.#itemService.search({ textSearch: term }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          }),
        );
      }),
      tap(() => (this.searching = false)),
    );

  setCustomerData(item: Item) {
    this.onEmitData(item);
    setTimeout(() => {
      this.textSearch = item.descripcion;
    });
  }

  onEmitData(item: Item) {
    this.onItemSelected.emit({ item });
  }

  onEnterKeyPressed(event: Event): void {
    let ev = event as KeyboardEvent;
    if (!(ev.key === 'Enter')) return;
  }
}
