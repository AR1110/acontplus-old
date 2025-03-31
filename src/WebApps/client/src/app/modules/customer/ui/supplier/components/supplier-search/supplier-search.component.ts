import { Component, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
  startWith,
  filter,
  Observable,
} from 'rxjs';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { SupplierUseCase } from '@customer/core/usecases/supplier.use-case';
import { AsyncPipe } from '@angular/common';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatAutocomplete,
    MatOption,
    MatProgressBar,
    MatAutocompleteTrigger,
    MatError,
    MatInputModule,
  ],
  templateUrl: './supplier-search.component.html',
  styles: [
    `
      .w-100 {
        width: 100%;
      }
    `,
  ],
})
export class SupplierSearchComponent {
  supplierSelected = output<SupplierSearch>();
  clearEmpty = output();
  isSearchSimple = input(true);
  textSearch = input<string>();
  textSearchControl = new FormControl<string>('', { nonNullable: true });
  filteredSuppliers: Observable<SupplierSearch[]>;

  searching = false;
  searchFailed = false;

  private readonly supplierUseCase = inject(SupplierUseCase);

  constructor() {
    this.textSearchControl.setValue(this.textSearch() ?? '');

    this.filteredSuppliers = this.textSearchControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => value !== null && value !== undefined),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.searchFailed = false;
      }),
      switchMap((term) => {
        // If term too short, return empty array
        if (term.length < 2) {
          this.searching = false;
          return of([]);
        }

        // Call supplier search use case
        return this.supplierUseCase.search({ textSearch: term }).pipe(
          tap({
            next: () => {
              this.searching = false;
              this.searchFailed = false;
            },
            error: () => {
              this.searching = false;
              this.searchFailed = true;
            },
          }),
          catchError((error) => {
            console.error(error);
            return of([]);
          }),
        );
      }),
    );
  }

  formatter(supplier: SupplierSearch): string {
    return supplier?.razonSocialComprador || '';
  }

  onSelect(supplier: SupplierSearch) {
    if (supplier) {
      this.supplierSelected.emit({
        ...supplier,
        razonSocialComprador: supplier.razonSocialComprador,
        identificacionComprador: supplier.identificacionComprador,
      });
    }
  }

  onKeyupSearch() {
    if (!this.textSearchControl.value) {
      this.clearEmpty.emit();
    }
  }
}
