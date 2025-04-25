
import { AsyncPipe } from '@angular/common';
import {Component, inject, input, model, output, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, debounceTime, distinctUntilChanged,  switchMap } from 'rxjs';
import {ProductSearchDto} from "@domain/models/inventory/product.model";
import { isValidField } from '@domain/utils/utils';
import {SearchProductUseCase} from "@domain/use-cases/product/search-product.use-case";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-product-search',
    imports: [
      FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        AsyncPipe,
        MatProgressSpinnerModule,
    ],
    templateUrl: './product-search.component.html',
    styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {
  private $searchUseCase = inject(SearchProductUseCase)

  isSimple = input(false);
  isAdvanced = input(false)
  labelText = input('');
  id =input(0);
  textName = model('')
  onSelect = output<any>()
  clearInput = output()
  control = new FormControl('');
  filteredProducts!: Observable<any[]>;

  isLoadingResults=signal(false);

  ngOnInit() {

    this.filteredProducts = this.control.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((val) => {
        this.isLoadingResults.set(false);
        if (val && val.length > 2) {
          return this._filter(val);
        }
        if(!isValidField(val)){
          this.clearInput.emit()

        }
        return [];
      }),

    );
  }

  private _filter(value: string) {
    this.isLoadingResults.set(true)
    return this.$searchUseCase.execute({ textSearch: value }).pipe(
      finalize(()=>this.isLoadingResults.set(false)),
    );
  }

  onSelectionChange(item: ProductSearchDto) {
    this.onSelect.emit(item);
  }

}
