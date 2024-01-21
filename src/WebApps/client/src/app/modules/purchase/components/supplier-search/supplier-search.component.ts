import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierSearch } from '@modules/purchase/models/supplier.model';
import { SupplierService } from '@modules/purchase/services/supplier.service';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './supplier-search.component.html',
  styles: ``
})
export class SupplierSearchComponent {
  @Output() onSupplierSelected = new EventEmitter<{ data: any }>();
  @Output() emptyInput = new EventEmitter();
  @Input() isSearchSimple = false;
  @Input() textSearch = ''

  private supplierSvc = inject(SupplierService)

  //textSearch = ''

  searching = false;
  searchFailed = false;



  search: OperatorFunction<string, Array<SupplierSearch>> = (
    text$: Observable<string>
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
          })
        );
      }),
      tap(() => (this.searching = false)),
    );

  onSelect($event: any) {
    let customer: SupplierSearch = $event.item;
    this.onSupplierSelected.emit({ data: customer });
    setTimeout(() => {
      this.textSearch = customer.razonSocial;
    });
  }

  onKeyupSearch() { 
    if (!this.textSearch) {
      this.emptyInput.emit({})
    }
  }

}
