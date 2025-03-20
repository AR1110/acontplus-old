import { Component, inject, Input, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { SupplierUseCase } from '@customer/core/usecases/supplier.use-case';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-supplier-search',
  imports: [FormsModule, NgbTypeaheadModule, MatLabel, MatFormField, MatInput],
  templateUrl: './supplier-search.component.html',
  styles: ``,
})
export class SupplierSearchComponent {
  supplierSelected = output<SupplierSearch>();
  clearEmpty = output();
  isSearchSimple = input(true);
  @Input() textSearch = '';
  searching = false;

  //textSearch = ''
  searchFailed = false;
  private readonly _supplierUseCase = inject(SupplierUseCase);

  search: OperatorFunction<string, SupplierSearch[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this._supplierUseCase.search({ textSearch: term }).pipe(
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

  formatter = (x: { razonSocialComprador: string }) => {
    if (x && typeof x === 'object') {
      return x.razonSocialComprador;
    }
    return x;
  };

  onSelect($event: unknown) {
    const customer = $event as SupplierSearch;
    this.supplierSelected.emit({
      ...customer,
      razonSocialComprador: customer.razonSocialComprador,
      identificacionComprador: customer.identificacionComprador,
    });
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.clearEmpty.emit();
    }
  }
}
