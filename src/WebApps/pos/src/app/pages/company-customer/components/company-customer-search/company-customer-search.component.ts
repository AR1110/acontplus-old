import { Component, inject, input, model, output, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { CompanyCustomerSearch } from "@/models/company-customer.model";
import { CompanyCustomerService } from "@/services/company-customer.service";
import { isValidField } from "@core/utils/utils";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionCompanyCustomerAddEditModalDirective } from '@/directives/action-company-customer-add-edit.directive';

import { OverlayModule } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
import { ToasterService } from '@/services/toaster.service';
import { DialogService } from '@/services/dialog.service';
import { CompanyCustomerAddEditModalComponent } from '../company-customer-add-edit-modal/company-customer-add-edit-modal.component';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-company-customer-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatCardModule,
    ActionCompanyCustomerAddEditModalDirective,

  ],
  templateUrl: './company-customer-search.component.html',
  styleUrl: './company-customer-search.component.scss'
})
export class CompanyCustomerSearchComponent {
  private companyCustomerSvc = inject(CompanyCustomerService)
  private tS = inject(ToasterService);
  private dialogSvc = inject(DialogService)

  isSimple = input(false);
  isAdvanced = input(false)
  isApplyGetId = input(false)
  id = input(0);

  onSelect = output<any>()
  clearInput = output()

  textName = model<string | null | undefined>('')
  control = new FormControl('');
  filteredCustomers!: Observable<any[]>;

  companyCustomers: CompanyCustomerSearch[] = [];

  isLoadingResults = false;

  isOpenDetail = signal(false)

  dataDetail = {} as any

  ngOnInit() {

    this.filteredCustomers = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((val) => {
        this.isLoadingResults = false;
        if (val && val.length > 2) {
          this.isLoadingResults = true;
          return this._filter(val);
        }
        if (!isValidField(val)) {
          this.clearInput.emit()

        }
        return [];
      }),

    );
  }

  private _filter(value: string) {
    return this.companyCustomerSvc.search({ textSearch: value }).pipe(
      map((response) => {

        this.isLoadingResults = false;
        return response;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        return []
      })
    );
  }

  onSelectionChange(item: CompanyCustomerSearch) {
    if (this.isApplyGetId()) {
      this.companyCustomerSvc.getId(item.idCliente).subscribe(response => {
        this.onSelect.emit(response);
      })
    } else {
      this.onSelect.emit(item);
    }
  }

  private verificarNumero(numero: any) {
    numero = numero ? numero.trim() : ""

    if (![10, 13].includes(numero.length)) return;

    if (isNaN(numero)) return

    if (numero.length === 13 && numero.slice(-3) !== "001") return;

    return true;
  }

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const inputValue = (keyboardEvent.target as HTMLInputElement).value;
    if (keyboardEvent.key === 'Enter') {
      if (!(this.id() > 0) && this.verificarNumero(inputValue)) {
        this.companyCustomerSvc.searchByNro(inputValue).subscribe(response => {

          if (response.customerCompanyId > 0) {
            this.onSelect.emit(response);
            return
          }

          //Numero de RUC
          if (inputValue.length === 13) {
            try {
              this.companyCustomerSvc.checkClientSRIByRUC(inputValue).subscribe(response => {
                const { numeroRuc, razonSocial, direccion, telefono, email, error } = response;
                if (!numeroRuc) {
                  this.tS.toastr({
                    type: 'warning',
                    message: error
                  })
                  return
                }
                let params = {
                  dataOfSri: true,
                  numeroRuc,
                  razonSocial,
                  direccion: direccion as string,
                  telefono: telefono as string,
                  email: email as string
                }
                this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
                  size: 'lg',
                  data: params
                })
              })

            } catch (error) {
              console.log(error);
            }
          }

          //Numero de Cedula
          if (inputValue.length === 10) {
            try {
              this.companyCustomerSvc.checkClientSRIByCedula(inputValue).subscribe(response => {
                const { identificacion, nombreCompleto, direccion, telefono, email, error } = response;
                if (!identificacion || !nombreCompleto) {
                  this.tS.toastr({
                    type: 'warning',
                    message: error
                  })
                  return
                }
                let params = {
                  dataOfSri: true,
                  numeroRuc: identificacion,
                  razonSocial: nombreCompleto,
                  direccion: direccion as string,
                  telefono: telefono as string,
                  email: email as string
                }

              })
            } catch (error) {
              console.log(error);

            }
          }

        })

      }

    }
  }

  onClickOpenDetail($event: any) {
    $event.stopPropagation();
    this.isOpenDetail.set(!this.isOpenDetail())

    if (this.isOpenDetail()) {
      this.companyCustomerSvc.getId(this.id(), true).subscribe(response => {
        this.dataDetail = response;
        console.log(response)
      })

    } else {
      this.dataDetail = {}
    }
  }

}
