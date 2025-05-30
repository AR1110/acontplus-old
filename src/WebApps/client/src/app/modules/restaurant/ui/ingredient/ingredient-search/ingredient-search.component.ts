import {
  Component,
  inject,
  input,
  model,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { finalize, Observable, switchMap } from 'rxjs';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ingredient-search',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatInputModule,
  ],
  templateUrl: './ingredient-search.component.html',
  styles: ``,
})
export class IngredientSearchComponent implements OnInit {
  searching = false;
  searchFailed = false;
  selectedOn = output<Ingredient>();
  clearSearch = output();
  isSimpleMode = input(false);
  textSearch = model('');
  isSearchToExternal = input(false);
  id = model(0);
  ingredient = {} as Ingredient;

  isLoading = signal(false);
  control = new FormControl('');
  filteredProducts!: Observable<any[]>;

  #ingredientService = inject(IngredientService);

  ngOnInit() {
    this.filteredProducts = this.control.valueChanges.pipe(
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.clearSearch.emit();
        return [];
      })
    );
  }

  private _filter(value: string) {
    return this.#ingredientService
      .search({ textSearch: value })
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  onSelect($event: Ingredient) {
    this.ingredient = $event;
    this.id.set(this.ingredient.id);
    this.selectedOn.emit(this.ingredient);
  }
}
