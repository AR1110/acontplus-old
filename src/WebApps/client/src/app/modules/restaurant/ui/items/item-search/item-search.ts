import { Component, inject, output, signal, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ItemSearchUseCase } from '@restaurant/application/use-cases/item.use-case';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/domain/enums/restaurant.enum';
import {PaginationParams} from "@acontplus/core";

@Component({
  selector: 'app-item-search',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatProgressSpinnerModule,
    JsonPipe,
  ],
  templateUrl: './item-search.html',
  styles: ``,
})
export class ItemSearch implements OnInit {
  private searchUseCase = inject(ItemSearchUseCase);
  items = signal<any>([]);
  loading = signal(false);
  selectedItem = output<any>();

  placeholder = input('');
  label = input('');
  private search$ = new Subject<string>();
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((value) => {
          if (value.length < 2) this.items.set([]);
        }),
        switchMap((value) => {
          if (value.length < 2) return of([]);

          this.loading.set(true);

          return this.searchUseCase
            .execute(new PaginationParams({
              searchTerm: value,
              filters: {
              categoryAbbreviation: CATEGORY_ABBREVIATIONS.RESTAURANT,
              }
            }))
            .pipe(
              catchError(() => of([])),
              finalize(() => this.loading.set(false)),
            );
        }),
      )
      .subscribe((response) => {
        console.log(response);
        console.log(this.items);
        this.items.set(response.data);
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.search$.next(value); // 🔹 emite el texto actual
  }

  onSelect(state: any) {
    this.selectedItem.emit(state);
    console.log('Seleccionado:', state);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
