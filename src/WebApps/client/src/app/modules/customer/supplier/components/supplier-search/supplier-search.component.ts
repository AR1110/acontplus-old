import {Component, inject, Input, input, output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {SupplierService} from "@purchase/services/supplier.service";
import {catchError, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap} from "rxjs";
import {SupplierSearch} from "@purchase/models/supplier.model";

@Component({
  selector: 'app-supplier-search',
  standalone: true,
    imports: [
         FormsModule,
      NgbTypeaheadModule
    ],
  templateUrl: './supplier-search.component.html',
  styles: ``
})
export class SupplierSearchComponent {
  onSelected = output<any>()
  onInputEmpty = output();
  isSearchSimple = input(true)
  @Input() textSearch ='';
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

  formatter = (x: { razonSocial: string }) => {
    if(x && typeof x==='object'){
      return x.razonSocial
    }
    return x;
  }

  onSelect($event: any) {
    let customer: SupplierSearch = $event.item;
    this.onSelected.emit({
        ...customer,
        razonSocialComprador: customer.razonSocial,
        identificacionComprador: customer.numeroIdentificacion,
      });

  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.onInputEmpty.emit();
    }
  }
}
