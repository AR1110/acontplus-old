import {
  Component,
  ViewChild,
  ElementRef,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { finalize } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import {DataGrid, DataGridColumn, KeyboardNavigationService} from '@acontplus/ng-components'
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-search-dialog.ts',
  templateUrl: './product-search-dialog.html',
  styleUrls: ['./product-search-dialog.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    DataGrid,
  ],
})
export class ProductSearchDialog implements OnInit, AfterViewInit, OnDestroy {
  private dialogRef = inject(MatDialogRef<ProductSearchDialog>);

  private keyboardNav = inject(KeyboardNavigationService);
  private PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  loading = signal(false);
  list = signal<any[]>([]);
  total = signal(0);

  columnsPrices = signal<DataGridColumn[]>([]);
  originalColumns = signal<DataGridColumn[]>([
    { header: 'Nro.', field: 'index', type: 'number' },
    { header: 'Imagen', field: 'imageUrl', type: 'image' },
    { header: 'Descripción', field: 'dataDescription' },
    { header: 'Stock', field: 'stock' },
    { header: 'IVA', field: 'vat' },
    { header: 'Subfamilia', field: 'subFamily' },
    { header: 'Medida', field: 'measure' },
  ]);

  columns = computed(() => {
    return [...this.originalColumns(), ...this.columnsPrices()];
  });

  query = {
    page: 0,
    per_page: 15,
    search: '',
  };

  private searchSub?: Subscription;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.keyboardNav.registerElement({
      element: this.searchInput,
      name: 'searchInput',
    });

    // Enfocar input automáticamente
    setTimeout(() => this.searchInput.nativeElement.focus(), 200);
  }

  ngOnDestroy(): void {
    this.keyboardNav.unregisterElement(this.searchInput);
    this.searchSub?.unsubscribe();
  }

  // ==========================================================
  // 🔹 Manejo de input (keyup)
  // ==========================================================
  private searchTimeout: any;

  search(): void {
    const value = this.searchInput.nativeElement.value.trim();

    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.query.page = 0;
      this.query.search = value;

      if (value.length < 3) {
        this.list.set([]);
        this.total.set(0);
        this.loading.set(false);
        return;
      }

      this.searchWithLoader();
    }, 500); // espera 500ms antes de buscar
  }

  private searchWithLoader(): void {
    this.loading.set(true);
    this.searchApi()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => this.processSearchResponse(res));
  }

  // ==========================================================
  // 🔹 API
  // ==========================================================
  private get params() {
    return {
      textSearch: this.query.search,
      pageIndex: this.query.page + 1,
      pageSize: this.query.per_page,
    };
  }

  private searchApi() {
    if (!this.query.search || this.query.search.length < 3) {
      return of({ items: [], total: 0 });
    }
    return this.PRODUCT_SERVICE.search(this.params);
  }

  private processSearchResponse(res: any): void {
    const items = res.items ?? [];
    this.total.set(res.total ?? 0);

    if (items.length === 0) {
      this.list.set([]);
      return;
    }

    const priceCols = items[0].prices.map((p: any) => ({
      header: p.name,
      field: p.name,
      type: 'currency',
      typeParameter: { currencyCode: '$' },
    }));

    const mappedItems = items.map((item: any) => {
      const priceMap = item.prices.reduce((acc: any, p: any) => {
        acc[p.name] = p.price;
        return acc;
      }, {});
      return { ...item, ...priceMap };
    });

    this.columnsPrices.set(priceCols);
    this.list.set(mappedItems);
  }

  // ==========================================================
  // 🔹 Acciones
  // ==========================================================
  clearSearch(): void {
    this.searchInput.nativeElement.value = '';
    this.query.search = '';
    this.list.set([]);
    this.total.set(0);
  }

  rowClick($event: any) {
    console.log($event);
    this.dialogRef.close($event.rowData);
  }
  getNextPage(e: PageEvent): void {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    this.searchWithLoader();
  }

  onFocusedRowChange(event: any): void {
    console.log('Fila enfocada:', event);
  }
}
