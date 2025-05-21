import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-elect-filters',
  imports: [
    CommonModule,
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
  ],
  templateUrl: './doc-elect-filters.component.html',
  styles: ``,
})
export class DocElectFiltersComponent {
  @Input() establecimientos: any[] = [];
  @Input() puntosEmision: any[] = [];
  @Input() estadoDocumentos: any[] = [];
  @Input() showMoreOptions = false;

  @Output() search = new EventEmitter<any>();
  @Output() selectCliente = new EventEmitter<any>();
  @Output() keyupCliente = new EventEmitter<void>();
  @Output() toggleMoreOptions = new EventEmitter<void>();
  @Output() selectUsuario = new EventEmitter<any>();
  @Output() keyupUsuario = new EventEmitter<string>();

  filterForm: FormGroup;
  clienteNombre = '';
  usuarioNombre = '';

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      codEstab: [null],
      checkBoxFecha: [false],
      fechaInicio: [new Date()],
      fechaFin: [new Date()],
      idCliente: [0],
      idPuntoEmision: [null],
      nroSecuencial: [''],
      infoAdicional: [''],
      byEstado: [''],
      idUsuario: [null],
    });
  }

  ngOnInit(): void {}

  onEstabChange(): void {
    this.search.emit(this.filterForm.value);
  }

  onRangeFilterChange(result: { startDate: Date; endDate: Date }): void {
    this.filterForm.patchValue({
      fechaInicio: result.startDate,
      fechaFin: result.endDate,
    });
    this.search.emit(this.filterForm.value);
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
    this.selectUsuario.emit(usuario);
  }

  onKeyupUsuarioSearchHandler(searchText: string): void {
    this.keyupUsuario.emit(searchText);
  }

  reload(): void {
    this.search.emit(this.filterForm.value);
  }
}
