import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyCustomerSearch } from '@company-customer/company-customer';
import { CompanyCustomerService } from '@company-customer/company-customer.service';
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
import { CompanyCustomerAddEditDirective } from '@company-customer/company-customer-add-edit.directive';

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
  @Input() isGetId = false;
  @Input() showActionsBtn = true;
  @Input() textSearch = '';
  @Input() isSearchToExternal = false;
  private companyCustomerService = inject(CompanyCustomerService);

  @Input() id = 0;
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
      this.id=0;
      this.resultEmptyInput.emit({});
    }
  }


  onSelect($event: any) {
    this.customer = $event.item;
    this.id = this.customer.idCliente;
    this.setCustomerData(this.customer);
  }

  search: OperatorFunction<string, Array<CompanyCustomerSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.id = 0;
      }),
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
    if(this.isGetId){
      this.companyCustomerService.getId($event.id).subscribe(response=>{
        this.onEmitData(response);
      })
    }else{
      this.onCustomerSelected.emit($event)
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
    if (!this.isSearchToExternal && !(ev.key === 'Enter')) return


  }
}
