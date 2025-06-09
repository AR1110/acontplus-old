import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  of,
  startWith,
  switchMap,
  tap, debounceTime,
} from 'rxjs';
import { SupplierUseCase } from '@customer/domain/usecases/supplier.use-case';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AsyncPipe,
  ],
  templateUrl: './supplier-search.component.html',
  styles: [
    `
      .w-100 {
        width: 100%;
      }
    `,
  ],
})
export class SupplierSearchComponent {
  private readonly supplierUseCase = inject(SupplierUseCase);

  // Input properties
  isSimpleMode = input(true);
  isAdvancedMode = input(false);
  isGetId = input(false);
  id = input(0);

  // Two-way binding for text value
  textSearch = model<string>('');

  // Output events
  supplierSelected = output<SupplierSearch>();
  clearSearch = output();

  // Form control and observables
  searchControl = new FormControl<string>('', { nonNullable: true });
  filteredSuppliers: Observable<SupplierSearch[]>;

  // UI state flags
  isLoading = false;
  searchFailed = false;

  constructor() {
    // Initialize searchControl with textSearch value

    if (this.textSearch()) {
      this.searchControl.setValue(this.textSearch());
    }

    // Setup filtered suppliers observable
    this.filteredSuppliers = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),

      switchMap((term) => {
        if(term && typeof term!=='string') return of([]);
        // Return empty array for short search terms
        if (!term || term.length < 2) {
          this.isLoading = false;
          return of([]);
        }

        this.isLoading = true;
        this.searchFailed = false;
        // Call supplier search use case
        return this.supplierUseCase.search({ textSearch: term }).pipe(

          tap({
            next: () => (this.searchFailed = false),
            error: () => (this.searchFailed = true),
          }),
          finalize(() => (this.isLoading = false)),
          catchError((error) => {
            console.error('Supplier search error:', error);
            return of([]);
          }),
        );
      }),
    );
  }

  // Update control value when textSearch input changes
  ngOnChanges() {
    console.log(this.textSearch())
    if (this.textSearch()) {
      this.searchControl.setValue(this.textSearch());
    }
  }

  // Format supplier for display in autocomplete
  formatter(supplier: SupplierSearch | string): string {
    if(typeof supplier === 'string') {
      return  supplier;
    }
    return supplier?.name || '';
  }

  // Handle supplier selection
  onSupplierSelect(supplier: SupplierSearch) {
    if (supplier) {
      if (this.isGetId()) {
        // If getId is true, you could implement a service call to get additional supplier details
        // this.supplierUseCase.getId(supplier.id).subscribe(details => {
        //   this.supplierSelected.emit(details);
        // });
        this.supplierSelected.emit(supplier);
      } else {
        this.supplierSelected.emit(supplier);
      }
    }
  }

  // Clear event when input is empty
  onSearchInput() {
    if (!this.searchControl.value) {
      this.clearSearch.emit();
    }
  }

  // Handle enter key press in advanced mode
  onEnterKeypress(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (value && this.validateIdentification(value)) {
      // You could implement supplier lookup by identification number here
      // For example:
      // this.supplierUseCase.searchByIdentification(value).subscribe(supplier => {
      //   if (supplier) {
      //     this.supplierSelected.emit(supplier);
      //   } else {
      //     // Handle case when supplier not found
      //   }
      // });
      // this.companyCustomerSvc.searchByNro(inputValue).subscribe(response => {
      //   if (response.customerCompanyId > 0) {
      //     this.onSelect.emit(response);
      //     return
      //   }
      //   //Numero de RUC
      //   if (inputValue.length === 13) {
      //     try {
      //       this.companyCustomerSvc.checkClientSRIByRUC(inputValue).subscribe(response => {
      //         const { numeroRuc, razonSocial, direccion, telefonos, correos, error, nombreComercial } = response;
      //         if (error) {
      //           this.tS.toastr({
      //             type: 'warning',
      //             message: error
      //           })
      //           return
      //         }
      //         let params = {
      //           dataOfSri: true,
      //           numeroRuc,
      //           razonSocial,
      //           nombreComercial: nombreComercial ?? razonSocial,
      //           direccion,
      //           telefonos,
      //           correos,
      //           codigoSri: SRI_IDENTIFICATION_CODE.RUC
      //         }
      //         this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
      //           size: 'lg',
      //           infrastructure: params
      //         })
      //       })
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      //   //Numero de Cedula
      //   if (inputValue.length === 10) {
      //     try {
      //       this.companyCustomerSvc.checkClientSRIByCedula(inputValue).subscribe(response => {
      //         const { direccion, correos, error, nombreCompleto, telefonos } = response;
      //         if (error) {
      //           this.tS.toastr({
      //             type: 'warning',
      //             message: error
      //           })
      //           return
      //         }
      //         let params = {
      //           dataOfSri: true,
      //           numeroRuc: inputValue,
      //           razonSocial: nombreCompleto,
      //           nombreComercial: nombreCompleto,
      //           direccion,
      //           telefonos,
      //           correos,
      //           codigoSri: SRI_IDENTIFICATION_CODE.CEDULA
      //         }
      //         this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
      //           size: 'lg',
      //           infrastructure: params
      //         })
      //       })
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      // })
    }
  }

  // Validation helper for identification numbers
  private validateIdentification(value: string): boolean {
    if (!value) return false;

    const trimmed = value.trim();

    // Check length is either 10 (cedula) or 13 (RUC)
    if (![10, 13].includes(trimmed.length)) return false;

    // Check if it's a number
    if (isNaN(Number(trimmed))) return false;

    // Check if RUC ends with "001"
    if (trimmed.length === 13 && trimmed.slice(-3) !== '001') return false;

    return true;
  }
}
