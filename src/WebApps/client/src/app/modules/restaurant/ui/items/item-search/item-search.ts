import { Component, inject, output, signal, OnInit, input, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {
  distinctUntilChanged,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
  catchError,
  debounceTime,
  finalize,
} from 'rxjs';
import { ItemSearchUseCase } from '@restaurant/application/use-cases/item.use-case';
import { PaginationParams } from '@acontplus/core';

@Component({
  selector: 'app-item-search',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './item-search.html',
  styles: ``,
})
export class ItemSearch implements OnInit, OnDestroy {
  private searchUseCase = inject(ItemSearchUseCase);

  items = signal<any>([]);
  loading = signal(false);
  selectedItem = output<any>();

  categoryAbbraviation = input.required();
  placeholder = input('');
  label = input('');

  private search$ = new Subject<string>();
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)), // 🔹 activa loading al iniciar cada búsqueda
        switchMap((value) => {
          if (value.length < 2) {
            this.loading.set(false);
            return of({ items: [] });
          }

          return this.searchUseCase
            .execute(
              new PaginationParams({
                searchTerm: value,
                filters: {
                  categoryAbbreviation: this.categoryAbbraviation(),
                },
              }),
            )
            .pipe(
              catchError((err) => {
                console.error('Error en búsqueda:', err);
                return of({ items: [] });
              }),
            );
        }),
        finalize(() => this.loading.set(false)), // 🔹 se ejecuta en TODOS los casos
      )
      .subscribe((res) => {
        this.items.set(res.items ?? []);
        this.loading.set(false); // 🔹 seguridad extra por si finalize no alcanza
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.search$.next(value);
  }

  onSelect(state: any) {
    this.selectedItem.emit(state);
    console.log('Seleccionado:', state);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
