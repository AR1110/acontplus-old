import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { EmployeeSearchDto } from '@modules/sale/models/employee.model';
import { EmployeeService } from '@modules/sale/services/employee.service';
import { Observable, OperatorFunction, catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './employee-search.component.html',
  styles: ``
})
export class EmployeeSearchComponent {
  @Output() onSupplierSelected = new EventEmitter<{ data: any }>();
  @Output() emptyInput = new EventEmitter();
  @Input() isSearchSimple = false;
  @Input() textSearch = ''

  private employeeSvc = inject(EmployeeService)

  //textSearch = ''

  searching = false;
  searchFailed = false;



  search: OperatorFunction<string, Array<EmployeeSearchDto>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.employeeSvc.search({ textSearch: term }).pipe(
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
    let employee: EmployeeSearchDto = $event.item;
    this.onSupplierSelected.emit({ data: employee });
    setTimeout(() => {
      this.textSearch = employee.nombreCompleto;
    });
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.emptyInput.emit({})
    }
  }
}
