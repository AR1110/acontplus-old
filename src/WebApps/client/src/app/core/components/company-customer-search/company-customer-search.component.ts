import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AddEditModalComponent } from '@modules/customer/company-customer/components/add-edit-modal/add-edit-modal.component';
import { CompanyCustomerSearch } from '@modules/customer/company-customer/models/company-customer';
import { CompanyCustomerService } from '@modules/customer/company-customer/services/company-customer.service';
import {
  Observable,
  OperatorFunction,
  catchError, 
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-company-customer-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './company-customer-search.component.html',
  styles: ``,
})
export class CompanyCustomerSearchComponent {
  @Output() onCustomerSelected = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  @Input() isSearchSimple = false;

  private modalService = inject(ModalService);
  searching = false;
  searchFailed = false;

  textSearch = '';
  dataSearch = {
    idCliente: 0,
    razonSocial: '',
  };

  constructor(private companyCustomerService: CompanyCustomerService) { }

  openModal() {
    if (this.dataSearch.idCliente > 0) {
      const modalRef = this.modalService.openModalCustom(
        AddEditModalComponent,
        {
          centered: true,
          size: 'lg',
        }
      );
      modalRef.componentInstance.data = { idCliente: this.dataSearch.idCliente, bussinesName: 'Test' };
    } else {
      this.modalService.openModalCustom(AddEditModalComponent, {
        centered: true,
        size: 'xl',
      });
    }
  }

  onSelect($event: any) {
    let customer: CompanyCustomerSearch = $event.item;
    this.dataSearch.idCliente = customer.idCliente;
    this.onCustomerSelected.emit({ data: customer });
    setTimeout(() => {
      this.textSearch = customer.nombreFiscal;
    });
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
      tap(() => (this.searching = false)),
    );

  onKeyupSearch() {
    if (!this.textSearch) {
      this.resultEmptyInput.emit({})
    }
  }
}
