import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, model, output, signal, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '@core/services/user.service';
import { isValidField } from '@core/utils/utils';
import { distinctUntilChanged, finalize, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-mat-user-search',
  imports: [
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  templateUrl: './mat-user-search.component.html',
  styles: ``
})
export class MatUserSearchComponent {
  private userSvc = inject(UserService)

  onSelect = output<any>()
  clearSearch = output()

  textName = model<string>('')
  control = new FormControl<null | string>(null);
  filters!: Observable<any[]>;

  companyCustomers: any[] = [];

  isLoadingResults = signal(false);


  ngOnInit() {
    this.filters = this.control.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
        }
        if (!isValidField(val)) {
          this.clearSearch.emit()

        }
        return [];
      }),

    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["textName"]) {
      this.control.setValue(this.textName())
    }

  }

  private _filter(value: string) {
    this.isLoadingResults.set(true)
    return this.userSvc.search({ textSearch: value }).pipe(
      finalize(() => {
        this.isLoadingResults.set(false)
      })
    );
  }

  onSelectionChange(item: any) {
      this.onSelect.emit(item);

  }


}
