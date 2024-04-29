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
  @Input() showActionsBtn = true;
  @Input() textSearch = '';
  @Input() isSearchToExternal = false;
  private companyCustomerService = inject(CompanyCustomerService);
  private modalService = inject(ModalService);

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

  openModal() {
    const modalRef = this.modalService.openModalCustom(AddEditModalComponent, {
      centered: true,
      size: 'xl',
    });
    if (this.customer.idCliente > 0) {
      modalRef.componentInstance.data = this.customer;
    }
    modalRef.result.then((response) => {
      if (response != null && typeof response === 'object') {
        this.customer = JSON.parse(response.payload)[0];
        this.setCustomerData(this.customer);
      }
    });
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
    this.onCustomerSelected.emit({
      data: {
        ...customer,
        razonSocialComprador: customer.nombreFiscal,
        identificacionComprador: customer.numeroIdentificacion,
      },
    });
    setTimeout(() => {
      this.textSearch = customer.nombreFiscal;
    });
  }


  onEnterKeyPressed(event:Event): void {
    let ev = event as KeyboardEvent;
    console.log(event)
    if (!this.isSearchToExternal && !(ev.key === 'Enter')) return


  }


}
