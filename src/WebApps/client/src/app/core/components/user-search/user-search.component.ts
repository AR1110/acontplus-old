import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UserSearch } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { Observable, OperatorFunction, catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { AppModule } from 'src/app/app.module';
@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './user-search.component.html',
  styles: ``
})
export class UserSearchComponent {
  @Output() onUserSelected = new EventEmitter<{ data: any }>();
  @Output() emptyInput = new EventEmitter();
  @Input() isSearchSimple = false;
  @Input() textSearch = ''

  private userSvc = inject(UserService)
  searching = false;
  searchFailed = false;

  search: OperatorFunction<string, Array<UserSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.userSvc.search({ textSearch: term }).pipe(
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

  onSelect($event: any) {
    let user: UserSearch = $event.item;
    this.onUserSelected.emit({ data: user });
    setTimeout(() => {
      this.textSearch = user.nombreUsuario;
    });
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.emptyInput.emit({})
    }
  }
}
