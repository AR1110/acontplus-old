 
import { ProductService } from '@/services/external/product.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import {ProductSearchDto} from "@/models/inventory/product.model";
import { isValidField } from '@/core/utils/utils';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
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
  
  isSimple = input(false);
  isAdvanced = input(false)
  labelText = input('');
  id =input(0);
  textName = model('')
  onSelect = output<any>()
  clearInput = output()
  private productSvc = inject(ProductService)
  control = new FormControl('');
  filteredProducts!: Observable<any[]>; 

  isLoadingResults=false;

  ngOnInit() {
    
    this.filteredProducts = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((val) => {
        this.isLoadingResults=false;
        if (val && val.length > 2) {
        this.isLoadingResults=true;
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
    return this.productSvc.search({ textSearch: value }).pipe(
      map((response) => {

        this.isLoadingResults=false;
        return response;
      }),
      catchError(() => {
        this.isLoadingResults=false;
        return []
      })
    );
  }

  onSelectionChange(item: ProductSearchDto) {
    this.onSelect.emit(item);
  }
  
}
