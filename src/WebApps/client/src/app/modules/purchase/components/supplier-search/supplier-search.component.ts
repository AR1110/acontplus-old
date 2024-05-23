import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SupplierSearch } from '@modules/purchase/models/supplier.model';
import { SupplierService } from '@modules/purchase/services/supplier.service';
import {
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  imports: [FormsModule, NgbTypeaheadModule],
  templateUrl: './supplier-search.component.html',
  styles: ``,
})
export class SupplierSearchComponent {
  @Output() onSupplierSelected = new EventEmitter<{ data: any }>();
  @Output() emptyInput = new EventEmitter();
  @Input() isSearchSimple = false;
  @Input() textSearch = '';
  searching = false;

  //textSearch = ''
  searchFailed = false;
  private supplierSvc = inject(SupplierService);

  search: OperatorFunction<string, Array<SupplierSearch>> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.supplierSvc.search({ textSearch: term }).pipe(
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

  onSelect($event: any) {
    let customer: SupplierSearch = $event.item;
    this.onSupplierSelected.emit({
      data: {
        ...customer,
        razonSocialComprador: customer.razonSocial,
        identificacionComprador: customer.numeroIdentificacion,
      },
    });
    setTimeout(() => {
      this.textSearch = customer.razonSocial;
    });
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.emptyInput.emit({});
    }
  }
}
