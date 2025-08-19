import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { distinctUntilChanged, Subject } from 'rxjs';
import {
  FilterData,
  FilterOptions,
  getMergedDocElectFilterOptions,
} from '@billing/domain/models/documento-electronico.model';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DocumentoElectronicoUseCase } from '@billing/domain/use-cases/documento-electronico.use-case';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';

@Component({
  selector: 'app-doc-elect-filters',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CompanyCustomerSearchComponent,
    DateRangeSelectionComponent,
    ThemeButtonComponent,
    UserSearchComponent,
    SupplierSearchComponent,
  ],
  templateUrl: './doc-elect-filters.component.html',
  styles: ``,
})
export class DocElectFiltersComponent implements OnInit {
  private destroy$ = new Subject<void>();
  filterOptions = input<FilterOptions>(getMergedDocElectFilterOptions());
  showMoreOptions = input.required();
  establecimientos = signal<any[]>([]);
  puntosEmision = signal<any[]>([]);
  estadoDocumentos = signal<any[]>([]);
  tipoDocumentos = signal<any[]>([]);
  estadoPagos = signal<any[]>([]);

  triggerSearch = output();
  selectCliente = output();
  keyupCliente = output();
  toggleMoreOptions = output();
  selectUsuario = output();
  keyupUsuario = output<string>();
  dialogOpen = output();

  filterForm: FormGroup;
  clienteNombre = '';
  usuarioNombre = '';
  checkBoxFecha = false;

  filterData: FilterData | null = null;

  // Estados de carga
  isLoadingFilters = false;
  isRefreshingFilters = false;
  isLoadingMainData = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      idEstablecimiento: [0],
      checkBoxFecha: [false],
      fechaInicio: [new Date()],
      fechaFin: [new Date()],
      idCliente: [0],
      idProveedor: [0],
      idPuntoEmision: [0],
      idTipoDocumento: [0],
      nroSecuencial: [''],
      infoAdicional: [''],
      idEstadoServicio: [0],
      idUsuario: [0],
      claveAcceso: [''],
    });
  }

  private readonly _documentoElectronicoUseCase = inject(
    DocumentoElectronicoUseCase,
  );

  private loadFilters(): void {
    this.isLoadingFilters = true;

    this._documentoElectronicoUseCase
      .getFilters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.handleFilterDataReceived(data);
          this.isLoadingFilters = false;
        },
        error: (error) => {
          console.error('Error al cargar filtros:', error);
          this.isLoadingFilters = false;
          // Aquí puedes mostrar un toast o mensaje de error
        },
      });
  }

  ngOnInit(): void {
    this.loadFilters();
    // this.setupFormSubscription();
    // this.subscribeToFilterDataChanges();
  }

  /**
   * Refresca los filtros manualmente
   */
  onRefreshFilters(): void {
    this.isRefreshingFilters = true;

    this._documentoElectronicoUseCase
      .refreshFilters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.handleFilterDataReceived(data);
          this.isRefreshingFilters = false;
          console.log('✅ Filtros actualizados exitosamente');
          // Aquí puedes mostrar un toast de éxito
        },
        error: (error) => {
          console.error('Error al refrescar filtros:', error);
          this.isRefreshingFilters = false;
          // Aquí puedes mostrar un toast de error
        },
      });
  }
  onEstabChange(): void {
    const dataEstab = this.establecimientos().find(
      (estab) =>
        estab.idEstablecimiento ===
        this.filterForm.get('idEstablecimiento')?.value,
    );
    if (dataEstab) {
      this.puntosEmision.set(dataEstab.puntosEmision);
      this.filterForm
        .get('idEstablecimiento')
        ?.setValue(dataEstab.idEstablecimiento);
    } else {
      this.puntosEmision.set([]);
      this.filterForm.get('idEstablecimiento')?.setValue(0);
      this.filterForm.get('idPuntoEmision')?.setValue(0);
    }
    this.triggerSearch.emit(this.filterForm.value);
  }

  onRangeFilterChange(result: { startDate: Date; endDate: Date }): void {
    this.filterForm.patchValue({
      fechaInicio: result.startDate,
      fechaFin: result.endDate,
    });
    this.triggerSearch.emit(this.filterForm.value);
  }

  onSelectClienteHandler(cliente: any): void {
    this.clienteNombre = cliente.nombreFiscal;
    this.filterForm.patchValue({
      idCliente: cliente.id,
    });
    this.selectCliente.emit(cliente);
  }

  onKeyupClienteHandler(): void {
    this.keyupCliente.emit();
  }

  onMoreOptionsClick(): void {
    this.toggleMoreOptions.emit();
  }

  onSelectedUsuarioSearch(usuario: any): void {
    this.usuarioNombre = usuario.nombreCompleto;
    this.filterForm.patchValue({
      idUsuario: usuario.id,
    });
    this.selectUsuario.emit(usuario.username);
  }

  onKeyupUsuarioSearchHandler(searchText: string) {
    this.keyupUsuario.emit(searchText);
  }

  reload(): void {
    this.triggerSearch.emit(this.filterForm.value);
  }

  /**
   * Se suscribe a cambios en los datos de filtros
   */
  private subscribeToFilterDataChanges(): void {
    this._documentoElectronicoUseCase.filterData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.handleFilterDataReceived(data);
        }
      });
  }

  /**
   * Maneja los datos recibidos de filtros
   */
  private handleFilterDataReceived(data: FilterData): void {
    this.filterData = data;

    // Extraer arrays para usar en los dropdowns
    this.establecimientos.set(data.estabs);
    if (this.establecimientos().length > 0) {
      const dataEstab = this.establecimientos().find(
        (estab) => estab.defaultEstab,
      );
      this.filterForm
        .get('idEstablecimiento')
        ?.setValue(dataEstab?.idEstablecimiento);
      this.puntosEmision.set(dataEstab?.puntosEmision ?? []);
    }
    this.tipoDocumentos.set(data.tipoDocumentos);
    this.estadoDocumentos.set(data.estadoDocumentos);
    this.estadoPagos.set(data.estadoPagos);

    console.log('📊 Datos de filtros procesados:', {
      establecimientos: this.establecimientos.length,
      tipoDocumentos: this.tipoDocumentos.length,
      estadoDocumentos: this.estadoDocumentos.length,
      estadoPagos: this.estadoPagos.length,
      lastUpdated: data.lastUpdated,
    });
  }

  /**
   * Configura la suscripción a cambios del formulario
   */
  private setupFormSubscription(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((formValue) => {
        console.log('🔍 Filtros cambiados:', formValue);
        // this.loadMainData();
      });
  }

  onDialogOpen() {
    this.dialogOpen.emit();
  }

  onSelectSupplierHandler($event: any): void {
    this.clienteNombre = $event.name;
    this.filterForm.patchValue({
      idProveedor: $event.idProveedor,
    });
    this.selectCliente.emit($event);
  }

  onDateRangeSelected($event: { from: string; to: string }) {
    this.filterForm.get('fechaInicio')?.setValue($event.from);
    this.filterForm.get('fechaFin')?.setValue($event.to);
  }

  setCheckBoxDate() {
    this.filterForm.get('checkBoxFecha')?.setValue(this.checkBoxFecha);
  }
}
