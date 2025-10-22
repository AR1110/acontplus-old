import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  DestroyRef,
  signal,
  computed,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRow, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';

import { isValidField } from '@core/utils/utils';
import { Pagination } from '@shared/models/pagination.model';
import { ProductUseCase } from '@inventory/product/application/use-cases/product.use-case';
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

interface SearchParams {
  textSearch: string;
  searchPurchase: boolean;
  searchSale: boolean;
}

interface ColumnDefinition {
  columnDef: string;
  header: string;
}

interface ProductData {
  idArticulo: number;
  codigo: string;
  s3ObjectUrl?: string;
  descripcion: string;
  stock: number;
  iva: number;
  subFamilia: string;
  medida: string;
  marca: string;
  [key: string]: any;
}

interface PersistedState {
  pagination: Pagination;
  dataSearch: { textSearch: string };
  dataSource: ProductData[];
  productTarifas: any[];
  columns: ColumnDefinition[];
}

@Component({
  selector: 'app-product-search-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './product-search-popup.component.html',
  styleUrl: './product-search-popup.component.scss',
})
export class ProductSearchPopupComponent implements OnInit, OnDestroy {
  // Injects
  private readonly params = inject<SearchParams>(MAT_DIALOG_DATA);
  private readonly modal = inject(MatDialogRef<ProductSearchPopupComponent>);
  private readonly productUseCase = inject(ProductUseCase);
  private readonly destroyRef = inject(DestroyRef);

  // ViewChild con nueva API
  readonly txtSearch = viewChild<ElementRef<HTMLInputElement>>('txtSearch');

  // Signals para estado reactivo
  readonly dataSearch = signal({ textSearch: '' });
  readonly dataSource = signal<ProductData[]>([]);
  readonly productTarifas = signal<any[]>([]);
  readonly columns = signal<ColumnDefinition[]>([]);
  readonly pagination = signal(new Pagination());
  readonly highlightRowIndex = signal(-1);
  readonly isOverlayOpen = signal(false);
  readonly isLoadingResults = signal(false);
  readonly isRateLimitReached = signal(false);

  // Computed values
  readonly visibleColumns = computed(() => this.columns().map(x => x.columnDef));
  readonly resultsLength = computed(() => this.pagination().totalRecords);

  // Constants
  private readonly KEY_STORAGE_DATA_PRODUCT_SEARCH = 'KEY_STORAGE_DATA_PRODUCT_SEARCH';
  private readonly MAIN_COLUMNS: readonly ColumnDefinition[] = [
    { columnDef: 'position', header: 'No.' },
    { columnDef: 'codigo', header: 'Código' },
    { columnDef: 's3ObjectUrl', header: 'Img' },
    { columnDef: 'descripcion', header: 'Descripción' },
    { columnDef: 'stock', header: 'Stock' },
    { columnDef: 'iva', header: 'Iva' },
    { columnDef: 'subFamilia', header: 'SubFamilia' },
    { columnDef: 'medida', header: 'Medida' },
    { columnDef: 'marca', header: 'Marca' },
  ];

  // Subjects
  private readonly searchSubject$ = new Subject<string>();

  @ViewChildren(MatRow, { read: ViewContainerRef })
  rows!: QueryList<ViewContainerRef>;

  constructor() {
    this.setupSearchStream();
   // this.setupAutoFocus();
  }

  ngOnInit(): void {
    this.initializePagination();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.persistSearchState();
  }

  // Public Methods
  applyFilter(value: string): void {
    this.dataSearch.update(state => ({ ...state, textSearch: value }));

    if (!isValidField(value.trim())) return;

    this.searchSubject$.next(value);
  }

  handlePageEvent(e: PageEvent): void {
    this.pagination.update(p => ({
      ...p,
      pageSize: e.pageSize,
      pageIndex: e.pageIndex,
    }));
    this.performSearch();
  }

  selectRow(row: ProductData, closeOverlay = true): void {
    if (closeOverlay) {
      this.closeOverlay();
    }

    console.log('Overlay, selectRow(), currentOption:', row);

    if (this.params.searchSale) {
      this.loadProductForSale(row.idArticulo);
    } else {
      this.modal.close(row);
    }
  }

  onMouseEnter(index: number): void {
    this.highlightRowIndex.set(index);
  }

  // Keyboard Navigation
  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent): void {
    event.preventDefault();
    const currentIndex = this.highlightRowIndex();
    const maxIndex = this.dataSource().length - 1;

    if (currentIndex < maxIndex) {
      this.highlightRowIndex.set(currentIndex + 1);
      this.scrollToHighlightedRow();
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent): void {
    event.preventDefault();
    const currentIndex = this.highlightRowIndex();

    if (currentIndex > 0) {
      this.highlightRowIndex.set(currentIndex - 1);
      this.scrollToHighlightedRow();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onKeyEnter(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.isOverlayOpen()) {
      const index = this.highlightRowIndex();
      const dataSource = this.dataSource();

      if (index >= 0 && index < dataSource.length) {
        this.selectRow(dataSource[index]);
      }
    } else {
      this.openOverlay();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const searchText = this.dataSearch().textSearch;
    const hasValidSearch = searchText && searchText.length >= 1;

    if (
      event.key !== 'Enter' &&
      event.key !== 'Tab' &&
      !this.isOverlayOpen() &&
      hasValidSearch
    ) {
      this.openOverlay();
    }
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyEsc(event: KeyboardEvent): void {
    event.preventDefault();
    this.closeOverlay();
  }

  // Private Methods
  private setupSearchStream(): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this.search()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setupAutoFocus(): void {
    effect(() => {
      const input = this.txtSearch();
      if (input) {
        setTimeout(() => input.nativeElement.focus(), 100);
      }
    });
  }

  private initializePagination(): void {
    this.pagination.update(p => ({ ...p, pageIndex: 0 }));
  }

  private loadInitialData(): void {
    if (isValidField(this.params.textSearch)) {
      this.dataSearch.set({ textSearch: this.params.textSearch });
      this.performSearch();
      return;
    }

    this.loadPersistedState();
    this.columns.set([...this.MAIN_COLUMNS]);
  }

  private loadPersistedState(): void {
    const persistedData = sessionStorage.getItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH);

    if (persistedData) {
      const state: PersistedState = JSON.parse(persistedData);

      this.pagination.set(state.pagination);
      this.dataSearch.set(state.dataSearch);
      this.dataSource.set(state.dataSource);
      this.productTarifas.set(state.productTarifas);
      this.columns.set(state.columns);

      if (this.params.textSearch) {
        this.dataSearch.update(s => ({ ...s, textSearch: this.params.textSearch }));
      }
    }
  }

  private persistSearchState(): void {
    const state: PersistedState = {
      pagination: this.pagination(),
      dataSearch: this.dataSearch(),
      dataSource: this.dataSource(),
      productTarifas: this.productTarifas(),
      columns: this.columns(),
    };

    if (this.dataSource().length > 0) {
      sessionStorage.setItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH);
    }
  }

  private performSearch(): void {
    const searchText = this.dataSearch().textSearch;

    if (!isValidField(searchText.trim())) return;

    this.search().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private search() {
    const params = {
      textSearch: this.dataSearch().textSearch,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };

    this.resetSearchState();

    return this.productUseCase.search(params).pipe(
      catchError(error => {
        console.error('Search error:', error);
        this.isLoadingResults.set(false);
        return of([]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).pipe(
      switchMap(response => {
        this.isLoadingResults.set(false);
        this.isRateLimitReached.set(response.length === 0);

        if (response.length > 0) {
          this.processSearchResults(response);
        }

        return of(response);
      })
    );
  }

  private resetSearchState(): void {
    this.highlightRowIndex.set(-1);
    this.productTarifas.set([]);
    this.isLoadingResults.set(true);
  }

  private processSearchResults(results: any[]): void {
    const newColumns = [...this.MAIN_COLUMNS];
    const firstResult = results[0];

    this.productTarifas.set(firstResult.tarifas || []);
    this.pagination.update(p => ({
      ...p,
      totalRecords: firstResult.totalRecords || 0
    }));

    // Add dynamic tarifa columns
    for (const tarifa of this.productTarifas()) {
      newColumns.push({
        header: tarifa.tarifa,
        columnDef: tarifa.tarifa,
      });
    }

    this.columns.set(newColumns);
    this.dataSource.set(this.transformResultsWithTarifas(results));
  }

  private transformResultsWithTarifas(results: any[]): ProductData[] {
    return results.map((item: any) => {
      const { tarifas, ...restItem } = item;
      const tarifasObj = tarifas?.reduce((obj: any, tarifa: any) => {
        obj[tarifa.tarifa] = tarifa.precio;
        return obj;
      }, {}) || {};

      return {
        ...restItem,
        ...tarifasObj,
      };
    });
  }

  private loadProductForSale(id: number): void {
    this.productUseCase
      .getForSale(id)
      .pipe(
        catchError(error => {
          console.error('Error loading product for sale:', error);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        if (response) {
          this.modal.close(response);
        }
      });
  }

  private scrollToHighlightedRow(): void {
    const index = this.highlightRowIndex();
    const row = this.rows.toArray()[index];

    if (row) {
      const rect = row.element.nativeElement.getBoundingClientRect();
      const containerHeight = 35;

      if (rect.y <= 0 || rect.y + rect.height > containerHeight) {
        row.element.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }

  private openOverlay(): void {
    this.isOverlayOpen.set(true);
  }

  private closeOverlay(): void {
    this.isOverlayOpen.set(false);
    this.highlightRowIndex.set(-1);
  }
}
