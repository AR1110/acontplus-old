import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  AfterViewInit, input, signal, output, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, switchMap} from "rxjs/operators";
import {distinctUntilChanged, Observable} from "rxjs";
import {
  ProductSearchListComponent
} from "@inventory/product/presentation/components/product-search-list/product-search-list.component";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {DataGrid} from "@shared/components/data-grid/data-grid";
import {DataGridColumn} from "@shared/components/data-grid/types";

export interface SearchResult {
  title: string;
  description?: string;
  category?: string;
  [key: string]: any;
}

// search-config.model.ts
export interface SearchConfig {
  search(params: any):Observable<any>;
  columns?: TableColumn[];     // columnas si el modo es table
  displayMode?: 'list' | 'card' | 'table';
}

export interface TableColumn {
  key: string;                 // propiedad del objeto
  label: string;               // título de columna
}
export const EXAMPLE_DATA: any[] = [
  {
    position: 1,
    name: 'Boron',
    tag: [
      {
        color: 'red',
        value: [1, 2],
      },
    ],
    weight: 10.811,
    symbol: 'B',
    gender: 'male',
    mobile: '13198765432',
    tele: '567891234',
    city: 'Berlin',
    address: 'Bernauer Str.111,13355',
    date: '1423456765768',
    website: 'www.matero.com',
    company: 'matero',
    email: 'Boron@gmail.com',
    status: false,
    cost: 4,
  },
  {
    position: 2,
    name: 'Helium',
    tag: [
      {
        color: 'blue',
        value: [3, 4],
      },
    ],
    weight: 8.0026,
    symbol: 'He',
    gender: 'female',
    mobile: '13034676675',
    tele: '80675432',
    city: 'Shanghai',
    address: '88 Songshan Road',
    date: '1423456765768',
    website: 'www.matero.com',
    company: 'matero',
    email: 'Helium@gmail.com',
    status: true,
    cost: 5,
  },
  {
    position: 3,
    name: 'Nitrogen',
    tag: [
      {
        color: 'yellow',
        value: [5, 6],
      },
    ],
    weight: 14.0067,
    symbol: 'N',
    gender: 'male',
    mobile: '15811112222',
    tele: '345678912',
    city: 'Sydney',
    address: 'Circular Quay, Sydney NSW 2000',
    date: '1423456765768',
    website: 'www.matero.com',
    company: 'matero',
    email: 'Nitrogen@gmail.com',
    status: true,
    cost: 2,
  },
];

@Component({
  selector: 'app-universal-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ProductSearchListComponent,
    DataGrid
  ],
  templateUrl: './universal-search.component.html',
  styleUrls: ['./universal-search.component.scss']
})
export class UniversalSearch  {
  config = input.required<SearchConfig>();

  close = output<void>();
  selectItem = output<any>();

  searchControl = new FormControl('');
  loading = signal(false);
  results = signal<any[]>([])
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  placeholder = input('Buscar');

  searchTerm = '';
  selectedIndex = 0;

  // Table data source + paginator
  dataSource = new MatTableDataSource<SearchResult>([]);
  displayedColumns = ['title', 'description'];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  //
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.searchApi(query || ''))
      )
      .subscribe((res: any) => {
        console.log(res)
        this.results.set(res.items || res);
        this.totalItems.set(res.total || this.results().length)
      });
  }

  searchApi(query: string) {
    this.loading.set(true);
    return this.config().search({
      q: query,
      page: this.currentPage(),
      pageSize: this.pageSize(),
    }).pipe(
      switchMap((response: any) => {
        this.loading.set(false);
        return [response];
      })
    );
  }


  // sync results into table datasource
  ngOnChanges(): void {
    // keep selected index within bounds
    if (this.selectedIndex >= (this.results?.length || 0)) {
      this.selectedIndex = Math.max(0, (this.results?.length || 1) - 1);
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.results.set([]);
  }

  onSelect(item: any) {
    this.selectItem.emit(item);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close.emit();
  }

  changePage(event: any) {
    this.currentPage.set(event.pageIndex + 1);
    this.searchApi(this.searchControl.value || '').subscribe((res: any) => {
      this.results.set(res.items || res)
      this.totalItems.set(res.total || this.results().length)
    });
  }

  // keyboard handling scoped to component
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close.emit();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.results() || this.results().length === 0) return;
      this.selectedIndex = (this.selectedIndex + 1) % this.results().length;
      this.scrollToSelected();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.results() || this.results().length === 0) return;
      this.selectedIndex = (this.selectedIndex - 1 + this.results().length) % this.results().length;
      this.scrollToSelected();
    } else if (event.key === 'Enter') {
      if (this.results() && this.results().length > 0) {
        event.preventDefault();
        this.selectItem.emit(this.results()[this.selectedIndex]);
      }
    }
  }

  private scrollToSelected() {
    // simple scroll: query DOM for element with data-index
    try {
      const el = document.querySelector(`[data-result-index="${this.selectedIndex}"]`) as HTMLElement;
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    } catch {}
  }




}
