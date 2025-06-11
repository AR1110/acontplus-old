import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayModule,
} from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  OnChanges,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogService } from '@core/services/dialog.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ResponsiveService } from '@shared/services/responsive.service';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { CompanyCustomerUseCase } from '@customer/domain/usecases/company-customer.use-case';
import {
  CompanyCustomer,
  CompanyCustomerSearch,
} from '@customer/domain/models/company-customer';
import { CompanyCustomerAddEditDirective } from '@customer/ui/company-customer/company-customer-add-edit.directive';

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
    MatProgressBarModule,
    MatMenuModule,
    MatCardModule,
    OverlayModule,
    CompanyCustomerAddEditDirective,
  ],
  templateUrl: './company-customer-search.component.html',
  styles: [
    `
      .w-100 {
        width: 100%;
      }
      .overlay-content {
        min-width: 250px;
        max-width: 350px;
        padding: 0;
      }
      .vstack {
        display: flex;
        flex-direction: column;
      }
      .gap-1 {
        gap: 0.25rem;
      }
    `,
  ],
})
export class CompanyCustomerSearchComponent implements OnChanges {
  // Injected services
  private readonly responsiveService = inject(ResponsiveService);
  private readonly companyCustomerUseCase = inject(CompanyCustomerUseCase);
  private readonly toasterService = inject(ToastrNotificationService);
  private readonly overlay = inject(Overlay);

  // Input properties
  isSimpleMode = input(false);
  isAdvancedMode = input(false);
  isGetId = input(false);
  id = input(0);

  // Two-way binding for text value
  textSearch = model<string>('');

  // Output events
  customerSelected = output<CompanyCustomer>();
  clearSearch = output();

  // Form control and observables
  searchControl = new FormControl<string>('');
  filteredCustomers: Observable<CompanyCustomerSearch[]>;

  // UI state flags
  isLoading = signal(false);
  searchFailed = signal(false);

  // Responsive state
  isTablet = computed(() => this.responsiveService.isTablet());
  isHandset = computed(() => this.responsiveService.isHandset());

  // Overlay details
  @ViewChild(CdkOverlayOrigin) trigger!: CdkOverlayOrigin;
  isOpenDetail = signal(false);
  positionStrategy!: FlexibleConnectedPositionStrategy;
  customerDetail = signal<CompanyCustomerSearch | null>(null);

  constructor() {
    // Initialize searchControl with textSearch value if provided
    if (this.textSearch()) {
      this.searchControl.setValue(this.textSearch());
    }

    // Setup filtered customers observable
    this.filteredCustomers = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        console.log('Search term:', term);
        if (term && typeof term !== 'string') return of([]);
        // Return empty array for short search terms
        if (!term || term.length < 2) {
          this.isLoading.set(false);
          return of([]);
        }

        this.isLoading.set(true);
        this.searchFailed.set(false);

        // Call company customer search use case
        return this.companyCustomerUseCase.search({ textSearch: term }).pipe(
          finalize(() => this.isLoading.set(false)),
          catchError((error) => {
            console.error('Company customer search error:', error);
            this.searchFailed.set(true);
            return of([]);
          })
        );
      })
    );
  }

  // Update control value when textSearch input changes
  ngOnChanges() {
    if (this.textSearch()) {
      this.searchControl.setValue(this.textSearch());
    }
  }

  // Handle customer selection
  onSelectionChange(customer: CompanyCustomerSearch | CompanyCustomer) {
    if (!customer) return;

    if (this.isGetId()) {
      this.companyCustomerUseCase
        .getId(customer.idCliente || customer.id)
        .subscribe((response) => {
          this.customerSelected.emit(response);
        });
      return;
    }

    this.customerSelected.emit(customer);
  }

  // Clear event when input is empty
  onSearchInput() {
    if (!this.searchControl.value) {
      this.clearSearch.emit();
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

  // Handle enter key press in advanced mode
  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const inputValue = (keyboardEvent.target as HTMLInputElement).value;

    if (
      keyboardEvent.key === 'Enter' &&
      !(this.id() > 0) &&
      this.validateIdentification(inputValue)
    ) {
      // Here you would implement the code to lookup customer by identification
      // and either select it or open the dialog to create a new one
      // This is a placeholder for where that implementation would go
    }
  }

  // Toggle customer detail overlay
  toggleOverlay(event: Event) {
    event.stopPropagation();
    this.isOpenDetail.update((value) => !value);

    if (this.isOpenDetail()) {
      // Configure position strategy for overlay
      this.positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(this.trigger.elementRef)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]);

      // Fetch customer details
      if (this.id() > 0) {
        this.companyCustomerUseCase.getId(this.id(), true).subscribe({
          next: (customer) => {
            this.customerDetail.set(customer);
          },
          error: (error) => {
            console.error('Error fetching customer details:', error);
            this.toasterService.show({
              type: 'error',
              message: 'Error al obtener detalles del cliente',
            });
            this.isOpenDetail.set(false);
          },
        });
      }
    } else {
      this.customerDetail.set(null);
    }
  }

  // Format customer for display in autocomplete
  formatCustomer(customer: CompanyCustomerSearch | string): string {
    if(typeof customer === 'string') {
      return customer
    }
    return customer?.name || '';
  }
}
