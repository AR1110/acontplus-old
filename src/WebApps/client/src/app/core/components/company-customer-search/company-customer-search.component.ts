import { Component, EventEmitter, Output } from '@angular/core';
import { CompanyCustomerSearch } from '@core/models/company-customer';
import { CompanyCustomerService } from '@core/services/company-customer.service';
import { Observable, OperatorFunction, catchError, debounceTime, switchMap } from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-company-customer-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './company-customer-search.component.html',
  styleUrl: './company-customer-search.component.scss'
})
export class CompanyCustomerSearchComponent {
  @Output() onCustomerSelected = new EventEmitter<{ data: any }>();

  textSearch = ''
  dataSearch = {
    idCliente: 0,
    razonSocial: ''
  }

  constructor(private companyCustomerService: CompanyCustomerService) { }

  onSelect($event: any) {
    let customer: CompanyCustomerSearch = $event.item
    this.dataSearch.idCliente = customer.idCliente
    this.onCustomerSelected.emit({ data: this.dataSearch })
    setTimeout(() => {
      this.textSearch = customer.nombreFiscal
    })
  }

  search: OperatorFunction<string, Array<CompanyCustomerSearch>> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    switchMap((term) => {
      if (!term || term.length < 2) {
        return [];
      }
      return this.companyCustomerService.search({ textSearch: term }).pipe(
        catchError((error) => {
          console.log(error)
          return [];
        })
      )
    })
  )
}
