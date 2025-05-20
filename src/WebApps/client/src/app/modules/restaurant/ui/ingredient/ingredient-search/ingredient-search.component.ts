import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import {
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';

@Component({
    selector: 'app-ingredient-search',
    imports: [FormsModule, NgbHighlight, NgbTypeahead],
    templateUrl: './ingredient-search.component.html',
    styles: ``
})
export class IngredientSearchComponent {
  searching = false;
  searchFailed = false;
  @Output() onIngredientSelected = new EventEmitter<{
    ingredient: Ingredient;
  }>();
  @Output() clearSearch = new EventEmitter();
  @Input() isSimpleMode = false;
  @Input() textSearch = '';
  @Input() isSearchToExternal = false;
  @Input() id = 0;
  ingredient = {} as Ingredient;
  #ingredientService = inject(IngredientService);

  onKeyupSearch() {
    if (!this.textSearch) {
      this.id = 0;
      this.clearSearch.emit({});
    }
  }

  onSelect($event: any) {
    this.ingredient = $event.item as Ingredient;
    this.id = this.ingredient.id;
    this.setCustomerData(this.ingredient);
  }

  search: OperatorFunction<string, Array<Ingredient>> = (
    text$: Observable<string>,
  ) =>
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
        return this.#ingredientService.search({ textSearch: term }).pipe(
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

  setCustomerData(ingredient: Ingredient) {
    this.onEmitData(ingredient);
    setTimeout(() => {
      this.textSearch = ingredient.productDescription;
    });
  }

  onEmitData(ingredient: Ingredient) {
    this.onIngredientSelected.emit({ ingredient });
  }

  onEnterKeyPressed(event: Event): void {
    let ev = event as KeyboardEvent;
    if (!this.isSearchToExternal && !(ev.key === 'Enter')) return;
  }
}
