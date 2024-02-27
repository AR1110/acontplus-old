import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductService } from '@modules/inventory/services/product.service';
import { MatTableModule } from '@angular/material/table';

/**
 * @title Plain input autocomplete
 */
@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatTableModule, AsyncPipe],
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  private productSvc = inject(ProductService)
  control = new FormControl('');
  filteredStreets!: Observable<any[]>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];;

  ngOnInit() {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        if (val && val.length > 2) {
          return this._filter(val)
        }
        return []
      })
    );
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value);
    return this.productSvc.search({ textSearch: filterValue }).pipe(
      map(response => {
        console.log(response)
        return response;
      })
    )
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
