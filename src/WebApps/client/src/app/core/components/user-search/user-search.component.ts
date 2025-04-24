import { Component, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
  startWith,
  filter,
  Observable,
} from 'rxjs';
import { UserSearch } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { AsyncPipe } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatAutocomplete,
    MatOption,
    MatProgressBar,
    MatAutocompleteTrigger,
    MatError,
    MatInputModule,
    MatLabel,
  ],
  templateUrl: './user-search.component.html',
  styles: [
    `
      .w-100 {
        width: 100%;
      }
    `,
  ],
})
export class UserSearchComponent {
  userSelected = output<{ data: UserSearch }>();
  emptyInput = output();
  isSimpleMode = input(true);
  textSearch = input<string>('');
  textSearchControl = new FormControl<string>('', { nonNullable: true });
  filteredUsers: Observable<UserSearch[]>;

  searching = false;
  searchFailed = false;

  private readonly userService = inject(UserService);

  constructor() {
    this.textSearchControl.setValue(this.textSearch() ?? '');

    this.filteredUsers = this.textSearchControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => value !== null && value !== undefined),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.searchFailed = false;
      }),
      switchMap((term) => {
        // If term too short, return empty array
        if (!term || term.length < 2) {
          this.searching = false;
          return of([]);
        }

        // Call user search service
        return this.userService.search({ textSearch: term }).pipe(
          tap({
            next: () => {
              this.searching = false;
              this.searchFailed = false;
            },
            error: () => {
              this.searching = false;
              this.searchFailed = true;
            },
          }),
          catchError((error) => {
            console.error(error);
            return of([]);
          }),
        );
      }),
    );
  }

  formatter(user: UserSearch): string {
    return user?.nombreCompleto || '';
  }

  onSelect(user: UserSearch) {
    if (user) {
      this.userSelected.emit({ data: user });
      // setTimeout(() => {
      //   this.textSearchControl.setValue(user.nombreCompleto);
      // });
    }
  }

  onKeyupSearch() {
    if (!this.textSearchControl.value) {
      this.emptyInput.emit();
    }
  }
}
