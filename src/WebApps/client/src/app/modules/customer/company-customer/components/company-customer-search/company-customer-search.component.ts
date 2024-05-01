import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyCustomerSearch } from '@modules/customer/company-customer/models/company-customer';
import { CompanyCustomerService } from '@modules/customer/company-customer/services/company-customer.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  OperatorFunction,
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CompanyCustomerAddEditDirective } from '@company-customer/directives/company-customer-add-edit.directive';

@Component({
  selector: 'app-company-customer-search',
  standalone: true,
  imports: [
    FormsModule,
    NgbTypeaheadModule,
    FontAwesomeModule,
    CompanyCustomerAddEditDirective
  ],
  templateUrl: './company-customer-search.component.html',
  styles: `  `,
})
export class CompanyCustomerSearchComponent {
  @Output() onCustomerSelected = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  @Input() isSearchSimple = false;
  @Input() showActionsBtn = true;
  @Input() textSearch = '';
  @Input() isSearchToExternal = false;
  private companyCustomerService = inject(CompanyCustomerService);

  customer: CompanyCustomerSearch = {
    idCliente: 0,
    nombreFiscal: '',
    nombreComercial: '',
    telefono: '',
    direccion: '',
    correo: '',
    numeroIdentificacion: '',
  };

  searching = false;
  searchFailed = false;

  onKeyupSearch() {
    if (!this.textSearch) {
      this.resultEmptyInput.emit({});
    }
  }


  onSelect($event: any) {
    console.log($event);
    this.customer = $event.item;
    this.setCustomerData(this.customer);
  }

  search: OperatorFunction<string, Array<CompanyCustomerSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.companyCustomerService.search({ textSearch: term }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.searching = false))
    );

  setCustomerData(customer: CompanyCustomerSearch) {

    this.onEmitData(customer);
    setTimeout(() => {
      this.textSearch = customer.nombreFiscal;
    });
  }


  //retorno de data cuando registran del modal
  onResult($event:any){
    if($event!==null && "item" in $event){
      this.onEmitData($event.item);
    }
  }
  onEmitData(result:any){
    let data = {
      ...result,
      razonSocialComprador: result.nombreFiscal,
      identificacionComprador: result.numeroIdentificacion,
    };

    this.onCustomerSelected.emit({
      data
    });
  }

  onEnterKeyPressed(event:Event): void {
    let ev = event as KeyboardEvent;
    console.log(event)
    if (!this.isSearchToExternal && !(ev.key === 'Enter')) return


  }
}
