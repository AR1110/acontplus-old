// product-search-bar.component.ts
import {
  ChangeDetectorRef,
  Component, computed,
  ContentChild, effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input, Output,
  output,
  Renderer2, signal,
  SimpleChanges,
  TemplateRef, viewChild,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import {OverlayModule} from "@angular/cdk/overlay";
import {
  ProductSearchOverlayComponent
} from "@inventory/product/presentation/components/product-search-overlay/product-search-overlay.component";
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {ProductSearchBarService} from "@inventory/product/application/services/product-search-bar.service";
import {debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, Subject} from "rxjs";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {HighlightPipe} from "@inventory/product/presentation/components/product-search-bar/highlight-pipe.pipe";
import {MatFormFieldModule} from "@angular/material/form-field";
import {takeUntil} from "rxjs/operators";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

/**
 * Keyboard events
 */
const isArrowUp = (keyCode:any) => keyCode === 38;
const isArrowDown = (keyCode:any) => keyCode === 40;
const isArrowUpDown = (keyCode:any) => isArrowUp(keyCode) || isArrowDown(keyCode);
const isEnter = (keyCode:any) => keyCode === 13;
const isBackspace =(keyCode:any) => keyCode === 8;
const isDelete = (keyCode:any) => keyCode === 46;
const isESC = (keyCode:any) => keyCode === 27;
const isTab = (keyCode:any) => keyCode === 9;

export interface AutocompleteItem {
  id?: string | number;
  name?: string;
  value?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-product-search-bar',
  imports: [
    MatIcon,
    MatButtonModule,
    OverlayModule,
    ProductSearchOverlayComponent,
    NgClass,
    ReactiveFormsModule,
    NgTemplateOutlet,
    HighlightPipe,
    FormsModule,
    MatFormFieldModule,
    MatProgressSpinner,
  ],
  templateUrl: './product-search-bar.component.html',
  styleUrl: './product-search-bar.component.scss',
})
export class ProductSearchBarComponent {
  @Input() placeHolder = 'Buscar productos...';
  @Input() disabled = false;
  @Input() debounceTime = 300;
  @Input() minSearchLength = 2;
  @Input() maxHistoryItems = 10;
  @Input() overlayWidth = 'auto';
  @Input() overlayMaxHeight = '500px';
  @Input() searchKeyword = 'name';
  @Input() notFoundText = 'No se encontraron productos';
  @Input() itemsPerPage = 10; // Nueva propiedad para paginación

  // Templates
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() notFoundTemplate!: TemplateRef<any>;

  // Data
  @Input() dataSource: AutocompleteItem[] = [];

  // Outputs
  @Output() itemSelected = new EventEmitter<AutocompleteItem>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() advancedSearchClicked = new EventEmitter<void>();
  @Output() allResultsClicked = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>(); // Nuevo evento para cambio de página

  // ViewChild references
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('historyListElement') historyListElement!: ElementRef<HTMLUListElement>;
  @ViewChild('filteredListElement') filteredListElement!: ElementRef<HTMLUListElement>;

  // Reactive properties
  query = '';
  filteredList = signal<AutocompleteItem[]>([]);
  historyList: AutocompleteItem[] = [];
  isLoading = false;
  overlayOpen = signal(false);
  selectedIdx = signal(-1);

  // Propiedades de paginación
  currentPage = signal(1);

  // Computed properties
  isHistoryListVisible = computed(() => {
    return this.query.length < this.minSearchLength && this.historyList.length > 0;
  });

  notFound = computed(() => {
    return this.query.length >= this.minSearchLength &&
      this.filteredList().length === 0 &&
      !this.isLoading;
  });

  toHighlight = computed(() => this.query);

  // Computed properties para paginación
  totalFilteredItems = computed(() => this.filteredList().length);

  totalPages = computed(() => {
    const total = this.totalFilteredItems();
    return total > 0 ? Math.ceil(total / this.itemsPerPage) : 1;
  });

  paginatedList = computed(() => {
    const list = this.filteredList();
    const page = this.currentPage();
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return list.slice(startIndex, endIndex);
  });

  startItem = computed(() => {
    const total = this.totalFilteredItems();
    if (total === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  });

  endItem = computed(() => {
    const total = this.totalFilteredItems();
    const calculated = this.currentPage() * this.itemsPerPage;
    return Math.min(calculated, total);
  });

  // Private properties
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private readonly HISTORY_STORAGE_KEY = 'autocomplete_history';

  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.setupSearch();
    this.loadHistoryFromStorage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Setup search with debounce
  private setupSearch() {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  // Input change handler
  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.selectedIdx.set(-1);
    this.currentPage.set(1); // Reset página al cambiar búsqueda

    if (this.query.length >= this.minSearchLength) {
      this.isLoading = true;
      this.searchSubject.next(this.query);
    } else {
      this.filteredList.set([]);
      this.isLoading = false;
    }

    this.overlayOpen.set(true);
    this.searchChanged.emit(this.query);
  }

  // Perform the actual search
  private performSearch(query: string) {
    if (query.length < this.minSearchLength) {
      this.filteredList.set([]);
      this.isLoading = false;
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const filteredList = this.dataSource.filter(item => {
        if (this.isType(item)) {
          return item.toString().toLowerCase().includes(query.toLowerCase());
        } else {
          const searchValue = item[this.searchKeyword] || item.name || item.value || '';
          return searchValue.toString().toLowerCase().includes(query.toLowerCase());
        }
      });

      this.filteredList.set(filteredList);
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 100);
  }

  // Métodos de paginación
  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    const page = parseInt(target.value);
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(page);
    } else {
      // Resetear al valor actual si es inválido
      target.value = this.currentPage().toString();
    }
  }

  goToFirstPage() {
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(1);
    }
  }

  goToPreviousPage() {
    const prevPage = this.currentPage() - 1;
    if (prevPage >= 1) {
      this.currentPage.set(prevPage);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(prevPage);
    }
  }

  goToNextPage() {
    const nextPage = this.currentPage() + 1;
    if (nextPage <= this.totalPages()) {
      this.currentPage.set(nextPage);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(nextPage);
    }
  }

  goToLastPage() {
    const lastPage = this.totalPages();
    if (this.currentPage() !== lastPage) {
      this.currentPage.set(lastPage);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(lastPage);
    }
  }

  // Keyboard navigation - Actualizado para paginación
  onKeyDown(event: KeyboardEvent) {
    const currentList = this.isHistoryListVisible() ? this.historyList : this.paginatedList();
    const maxIndex = currentList.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (maxIndex >= 0) {
          const nextIndex = this.selectedIdx() < maxIndex ? this.selectedIdx() + 1 : 0;
          this.selectedIdx.set(nextIndex);
          this.scrollToSelected();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (maxIndex >= 0) {
          const prevIndex = this.selectedIdx() > 0 ? this.selectedIdx() - 1 : maxIndex;
          this.selectedIdx.set(prevIndex);
          this.scrollToSelected();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIdx() >= 0 && this.selectedIdx() <= maxIndex) {
          this.select(currentList[this.selectedIdx()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.overlayOpen.set(false);
        this.selectedIdx.set(-1);
        break;

      case 'PageDown':
        event.preventDefault();
        if (!this.isHistoryListVisible()) {
          this.goToNextPage();
        }
        break;

      case 'PageUp':
        event.preventDefault();
        if (!this.isHistoryListVisible()) {
          this.goToPreviousPage();
        }
        break;
    }
  }

  // Scroll to selected item
  private scrollToSelected() {
    const listElement = this.isHistoryListVisible()
      ? this.historyListElement?.nativeElement
      : this.filteredListElement?.nativeElement;

    if (listElement) {
      const selectedElement = listElement.children[this.selectedIdx()] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }

  // Select item
  select(item: AutocompleteItem) {
    if (this.isType(item)) {
      this.query = item.toString();
    } else {
      this.query = item[this.searchKeyword] || item.name || item.value || '';
    }

    this.overlayOpen.set(false);
    this.selectedIdx.set(-1);
    this.currentPage.set(1); // Reset página al seleccionar
    this.addToHistory(item);
    this.itemSelected.emit(item);

    // Focus back to input
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  // Clear search
  clearSearch() {
    this.query = '';
    this.filteredList.set([]);
    this.selectedIdx.set(-1);
    this.currentPage.set(1); // Reset página
    this.searchInput?.nativeElement?.focus();
    this.searchChanged.emit('');
  }

  // History management
  private addToHistory(item: AutocompleteItem) {
    // Remove if already exists
    this.historyList = this.historyList.filter(historyItem => {
      if (this.isType(item) && this.isType(historyItem)) {
        return item.toString() !== historyItem.toString();
      } else if (!this.isType(item) && !this.isType(historyItem)) {
        return (item.id || item.name) !== (historyItem.id || historyItem.name);
      }
      return true;
    });

    // Add to beginning
    this.historyList.unshift(item);

    // Limit history size
    if (this.historyList.length > this.maxHistoryItems) {
      this.historyList = this.historyList.slice(0, this.maxHistoryItems);
    }

    this.saveHistoryToStorage();
  }

  removeHistoryItem(index: number, event: Event) {
    event.stopPropagation();
    this.historyList.splice(index, 1);
    this.saveHistoryToStorage();

    // Adjust selected index if necessary
    if (this.selectedIdx() >= index && this.selectedIdx() > 0) {
      this.selectedIdx.set(this.selectedIdx() - 1);
    } else if (this.selectedIdx() === index) {
      this.selectedIdx.set(-1);
    }
  }

  clearHistory() {
    this.historyList = [];
    this.selectedIdx.set(-1);
    this.saveHistoryToStorage();
  }

  // Storage management
  private loadHistoryFromStorage() {
    try {
      const stored = localStorage.getItem(this.HISTORY_STORAGE_KEY);
      if (stored) {
        this.historyList = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error loading autocomplete history:', error);
      this.historyList = [];
    }
  }

  private saveHistoryToStorage() {
    try {
      localStorage.setItem(this.HISTORY_STORAGE_KEY, JSON.stringify(this.historyList));
    } catch (error) {
      console.warn('Error saving autocomplete history:', error);
    }
  }

  // Advanced search
  openAdvancedSearch() {
    this.overlayOpen.set(false);
    this.advancedSearchClicked.emit();
  }

  // Show all results
  showAllResults() {
    this.overlayOpen.set(false);
    this.allResultsClicked.emit(this.query);
  }

  // Type checking utility
  isType(item: any): item is string {
    return typeof item === 'string';
  }

  // Focus management
  focusInput() {
    this.searchInput?.nativeElement?.focus();
  }

  // Public API methods
  public setQuery(query: string) {
    this.query = query;
    this.currentPage.set(1); // Reset página
    if (query.length >= this.minSearchLength) {
      this.performSearch(query);
    } else {
      this.filteredList.set([]);
    }
  }

  public clearAll() {
    this.clearSearch();
    this.clearHistory();
  }

  public getSelectedItem(): AutocompleteItem | null {
    const currentList = this.isHistoryListVisible() ? this.historyList : this.paginatedList();
    return this.selectedIdx() >= 0 && this.selectedIdx() < currentList.length
      ? currentList[this.selectedIdx()]
      : null;
  }

  // Métodos públicos para paginación
  public getCurrentPage(): number {
    return this.currentPage();
  }

  public getTotalPages(): number {
    return this.totalPages();
  }

  public getTotalItems(): number {
    return this.totalFilteredItems();
  }

  public setItemsPerPage(items: number) {
    this.itemsPerPage = items;
    this.currentPage.set(1); // Reset página al cambiar items por página
  }

  public setCurrentPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(page);
    }
  }

  // Método para obtener información de paginación
  public getPaginationInfo() {
    return {
      currentPage: this.currentPage(),
      totalPages: this.totalPages(),
      totalItems: this.totalFilteredItems(),
      itemsPerPage: this.itemsPerPage,
      startItem: this.startItem(),
      endItem: this.endItem(),
      hasNextPage: this.currentPage() < this.totalPages(),
      hasPreviousPage: this.currentPage() > 1
    };
  }

  // Método para buscar programáticamente
  public search(query: string) {
    this.query = query;
    this.currentPage.set(1);
    if (query.length >= this.minSearchLength) {
      this.isLoading = true;
      this.searchSubject.next(query);
      this.overlayOpen.set(true);
    } else {
      this.filteredList.set([]);
      this.isLoading = false;
      if (query.length === 0) {
        this.overlayOpen.set(false);
      }
    }
    this.searchChanged.emit(query);
  }

  // Método para navegar a una página específica con validación
  public navigateToPage(page: number): boolean {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.selectedIdx.set(-1);
      this.pageChanged.emit(page);
      return true;
    }
    return false;
  }

  // Método para obtener los elementos de la página actual
  public getCurrentPageItems(): AutocompleteItem[] {
    return this.paginatedList();
  }

  // Método para verificar si hay resultados
  public hasResults(): boolean {
    return this.totalFilteredItems() > 0;
  }

  // Método para obtener el estado del componente
  public getState() {
    return {
      query: this.query,
      isLoading: this.isLoading,
      overlayOpen: this.overlayOpen(),
      selectedIndex: this.selectedIdx(),
      pagination: this.getPaginationInfo(),
      hasResults: this.hasResults(),
      isHistoryVisible: this.isHistoryListVisible(),
      historyCount: this.historyList.length
    };
  }
}
