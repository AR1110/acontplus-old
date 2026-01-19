import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CompanyService } from '@modules/config/services/company.service';

@Component({
  selector: 'app-company-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './company-search.component.html',
  styles: ``,
})
export class CompanySearchComponent {
  @Input() textName = '';
  @Output() onSelect = new EventEmitter<any>();

  private companySvc = inject(CompanyService);
  searchControl = new FormControl('');

  searching = false;
  searchFailed = false;
  filteredOptions$!: Observable<any[]>;

  constructor() {
    this.filteredOptions$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.searchFailed = false;
      }),
      switchMap((value: string | null) => {
        const searchText = value || '';
        if (searchText.length < 2) {
          return of([]);
        }
        return this.companySvc.search({ textSearch: searchText, tipo: 2 }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          }),
        );
      }),
      tap(() => (this.searching = false)),
    );
  }

  displayFn(company: any): string {
    return company?.businessName || '';
  }

  onOptionSelected(event: any): void {
    this.onSelect.emit(event.option.value);
  }
}
