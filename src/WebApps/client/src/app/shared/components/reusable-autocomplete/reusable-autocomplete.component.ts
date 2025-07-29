import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  computed,
  signal,
  inject,
  output,
  input,
  ChangeDetectionStrategy, OnInit, OnDestroy
} from '@angular/core';
import {Subject, takeUntil, debounceTime, Observable, of,  distinctUntilChanged } from 'rxjs';

import { AutocompleteService } from '../../services/autocomplete.service';
import {
  AutocompleteItem,
  AutocompleteConfig,
  AutocompleteFilters,
  AutocompleteState,
  DEFAULT_AUTOCOMPLETE_CONFIG, SearchFunction,
  SearchResult
} from '@shared/models/autocomplete.interfaces';
import {MatIcon} from "@angular/material/icon";
import {NgTemplateOutlet} from "@angular/common";
import {OverlayModule} from "@angular/cdk/overlay";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {catchError, switchMap} from "rxjs/operators";
@Component({
  selector: 'app-reusable-autocomplete',
  imports: [
    MatIcon,
    NgTemplateOutlet,
    OverlayModule,
    MatProgressBarModule,
    MatProgressSpinner,
    FormsModule,
    MatIconButton
  ],
  templateUrl: './reusable-autocomplete.component.html',
  styleUrl: './reusable-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableAutocompleteComponent implements OnInit, OnDestroy {
  @Input() dataSource: AutocompleteItem[] = []; // Para búsqueda local
  @Input() config: AutocompleteConfig = DEFAULT_AUTOCOMPLETE_CONFIG;
  @Input() itemTemplate?: TemplateRef<any>;
  @Input() searchFunction?: SearchFunction;

  @Input() notFoundTemplate?: TemplateRef<any>;


   overlayWidth = input('auto');
   overlayMaxHeight = input('400px');

   itemSelected = output<AutocompleteItem>();
   searchChanged = output<string>();
   searchRequested = output<{query: string, filters: AutocompleteFilters, page: number}>(); // Nuevo evento
   pageChanged = output<number>();
   filterChanged = output<AutocompleteFilters>();
   advancedSearchClicked = output<void>();
   allResultsClicked = output<string>();
   createClicked = output<string>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('historyListElement') historyListElement?: ElementRef<HTMLUListElement>;
  @ViewChild('resultsListElement') resultsListElement?: ElementRef<HTMLUListElement>;

  // State
  query = '';
  isLoading = signal(false);
  overlayOpen = signal(false);
  selectedIndex = signal(-1);
  currentPage = signal(1);
  filteredItems = signal<AutocompleteItem[]>([]);
  historyList = signal<AutocompleteItem[]>([]);
  totalCount = signal(0);
  // Filters
  filters: AutocompleteFilters = {
    searchBy: 'name',
    stockFilter: 'all'
  };

  // Computed properties
  isHistoryVisible = computed(() => {
    return this.query.length < (this.config.minSearchLength || 2) && this.historyList().length > 0  ;
  });

  totalItems = computed(() => this.filteredItems().length);

  totalPages = computed(() => {
    const total = this.totalCount();
    return total > 0 ? Math.ceil(total / (this.config.itemsPerPage || 10)) : 1;
  });

  currentPageItems = computed(() => {
    // if (!this.config.enablePagination) {
    // }
      return this.filteredItems();
    // return this.autocompleteService.paginateItems(
    //   this.filteredItems(),
    //   this.currentPage(),
    //   this.config.itemsPerPage || 10
    // );
  });

  startItem = computed(() => {
    const total = this.totalItems();
    if (total === 0) return 0;
    return (this.currentPage() - 1) * (this.config.itemsPerPage || 10) + 1;
  });

  endItem = computed(() => {
    const total = this.totalItems();
    const calculated = this.currentPage() * (this.config.itemsPerPage || 10);
    return Math.min(calculated, total);
  });

  sectionTitle = computed(() => {
    const total = this.totalItems();
    return `Resultados (${total})`;
  });

  isNoResults = computed(() => {
    return    this.totalItems() === 0 &&  !this.isLoading() && this.query.length >= (this.config.minSearchLength || 2)
  });

  // Private
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<{ query: string; filters: any; page: number }>();
  private autocompleteService = inject(AutocompleteService);

  ngOnInit() {
    this.mergeDefaultConfig();
    this.setupSearch();
    this.loadHistory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mergeDefaultConfig() {
    this.config = this.autocompleteService.mergeConfig(this.config);
    this.filters.searchBy = this.config.searchFields?.[0]?.value || 'name';
    this.filters.stockFilter = this.config.stockOptions?.[0]?.value || 'all';
  }

  private setupSearch() {
    this.filteredItems.set([])
    this.searchSubject
      .pipe(
        debounceTime(this.config.debounceTime || 300),
       // distinctUntilChanged(),
       //  distinctUntilChanged((prev, curr) => {
       //    console.log(prev);
       //    console.log(curr);
       //      return  prev.query === curr.query &&
       //        JSON.stringify(prev.filters) === JSON.stringify(curr.filters) &&
       //        prev.page === curr.page
       //
       //    }
       //
       //  ),
        takeUntil(this.destroy$),
        switchMap(({query}) => this.performSearch(query))
      )
      .subscribe(result => {
        this.filteredItems.set(result.items);
        this.totalCount.set(result.totalCount);
        this.isLoading.set(false);
      });
  }

  private performSearch(query: string): Observable<SearchResult> {
    if (query.length < (this.config.minSearchLength || 2)) {
      return of({ items: [], totalCount: 0 });
    }

    // ESTRATEGIA A: Función de búsqueda personalizada
    if (this.searchFunction) {
      return this.searchFunction(query, this.filters, this.currentPage(), this.config.itemsPerPage || 10)
        .pipe(catchError(() => of({ items: [], totalCount: 0 })));
    }

    // ESTRATEGIA B: Emit evento para que el padre maneje
    if (this.config.searchMode === 'remote') {
      this.searchRequested.emit({
        query,
        filters: this.filters,
        page: this.currentPage()
      });
      return of({ items: [], totalCount: 0 }); // El padre actualizará los datos
    }

    // ESTRATEGIA C: Búsqueda local (fallback)
    return this.autocompleteService.searchLocal(this.dataSource, query, this.filters, this.config);
  }


  private loadHistory() {
    this.autocompleteService.history$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(history => {
      this.historyList.set(history);
    });
  }

  private searchSubjectNext(){
    this.searchSubject.next({
      query: this.query,
      filters: this.filters,
      page: this.currentPage()
    });

  }

  // Event Handlers
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.selectedIndex.set(-1);
    this.currentPage.set(1);

    if (this.query.length >= (this.config.minSearchLength || 2)) {
      this.isLoading.set(true);
      this.searchSubjectNext();
    } else {
      this.filteredItems.set([]);
      this.isLoading.set(false);
    }

    this.showOverlay();
    this.searchChanged.emit(this.query);
  }

  onKeyDown(event: KeyboardEvent) {
    const currentList = this.isHistoryVisible() ? this.historyList() : this.currentPageItems();
    const maxIndex = currentList.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (maxIndex >= 0) {
          const nextIndex = this.selectedIndex() < maxIndex ? this.selectedIndex() + 1 : 0;
          this.selectedIndex.set(nextIndex);
          this.scrollToSelected();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (maxIndex >= 0) {
          const prevIndex = this.selectedIndex() > 0 ? this.selectedIndex() - 1 : maxIndex;
          this.selectedIndex.set(prevIndex);
          this.scrollToSelected();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex() >= 0 && this.selectedIndex() <= maxIndex) {
          this.selectItem(currentList[this.selectedIndex()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.hideOverlay();
        break;

      case 'PageDown':
        event.preventDefault();
        if (!this.isHistoryVisible() && this.config.enablePagination) {
          this.goToNextPage();
        }
        break;

      case 'PageUp':
        event.preventDefault();
        if (!this.isHistoryVisible() && this.config.enablePagination) {
          this.goToPreviousPage();
        }
        break;
    }
  }

  onFilterChange() {
    this.currentPage.set(1);
     if (this.query.length >= (this.config.minSearchLength || 2)) {
        this.performSearch(this.query);
       this.searchSubjectNext()
      }
    // this.filterChanged.emit(this.filters);
  }


  // Método público para actualizar resultados desde el padre
  public updateSearchResults(result: SearchResult) {
    this.filteredItems.set(result.items);
    this.totalCount.set(result.totalCount);
    this.isLoading.set(false);
  }


  // Overlay Methods
  showOverlay() {
    this.overlayOpen.set(true);
  }

  hideOverlay() {
    this.overlayOpen.set(false);
    this.selectedIndex.set(-1);
  }

  isType(item: any): item is string {
    return typeof item === 'string';
  }

  // Selection Methods
  selectItem(item: AutocompleteItem) {
    if(this.config.clearInput){
      this.query = '';
    }else{
      this.query = this.getItemDisplayText(item);
    }
    this.hideOverlay();
    this.currentPage.set(1);
    this.autocompleteService.addToHistory(item, this.config.maxHistoryItems);
    this.itemSelected.emit(item);

    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);


  }

  clearSearch() {
    this.query = '';
    this.filteredItems.set([]);
    this.selectedIndex.set(-1);
    this.currentPage.set(1);
    this.searchInput?.nativeElement?.focus();
    this.searchChanged.emit('');
  }

  // History Methods
  removeHistoryItem(index: number, event: Event) {
    event.stopPropagation();
    this.autocompleteService.removeFromHistory(index);
  }

  clearHistory() {
    this.autocompleteService.clearHistory();
  }

  // Pagination Methods
  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    const page = parseInt(target.value);
    if (this.autocompleteService.isValidPage(page, this.totalPages())) {
      this.currentPage.set(page);
      this.selectedIndex.set(-1);
      this.pageChanged.emit(page);
      this.searchSubjectNext()
    } else {
      target.value = this.currentPage().toString();
    }
  }

  goToFirstPage() {
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.selectedIndex.set(-1);
      this.pageChanged.emit(1);
      this.searchSubjectNext()
    }
  }

  goToPreviousPage() {
    const prevPage = this.currentPage() - 1;
    if (prevPage >= 1) {
      this.currentPage.set(prevPage);
      this.selectedIndex.set(-1);
      this.pageChanged.emit(prevPage);
      this.searchSubjectNext()
    }
  }

  goToNextPage() {
    const nextPage = this.currentPage() + 1;
    if (nextPage <= this.totalPages()) {
      this.currentPage.set(nextPage);
      this.selectedIndex.set(-1);
      this.pageChanged.emit(nextPage);
      this.searchSubjectNext()
    }
  }

  goToLastPage() {
    const lastPage = this.totalPages();
    if (this.currentPage() !== lastPage) {
      this.currentPage.set(lastPage);
      this.selectedIndex.set(-1);
      this.pageChanged.emit(lastPage);
      this.searchSubjectNext()
    }
  }

  // Footer Actions
  onCreateNew($event:MouseEvent) {
    //$event.stopPropagation();
   // this.hideOverlay();
    this.createClicked.emit(this.query);
  }

  onAdvancedSearch() {
    this.hideOverlay();
    this.advancedSearchClicked.emit();
  }

  onShowAllResults() {
    this.hideOverlay();
    this.allResultsClicked.emit(this.query);
  }

  // Utility Methods
  getItemDisplayText(item: AutocompleteItem): string {
    return this.autocompleteService.getItemDisplayText(item);
  }

  noResultsText(): string {
    return `No se encontraron resultados para "${this.query}"`;
  }

  private scrollToSelected() {
    const listElement = this.isHistoryVisible()
      ? this.historyListElement?.nativeElement
      : this.resultsListElement?.nativeElement;

    if (listElement) {
      const selectedElement = listElement.children[this.selectedIndex()] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }

  // Public API
  public getState(): AutocompleteState {
    return {
      query: this.query,
      isLoading: this.isLoading(),
      overlayOpen: this.overlayOpen(),
      selectedIndex: this.selectedIndex(),
      pagination: {
        currentPage: this.currentPage(),
        totalPages: this.totalPages(),
        totalItems: this.totalItems(),
        itemsPerPage: this.config.itemsPerPage || 10,
        startItem: this.startItem(),
        endItem: this.endItem(),
        hasNextPage: this.currentPage() < this.totalPages(),
        hasPreviousPage: this.currentPage() > 1
      },
      hasResults: this.totalItems() > 0,
      isHistoryVisible: this.isHistoryVisible(),
      historyCount: this.historyList().length,
      filters: this.filters
    };
  }

  public setQuery(query: string) {
    this.query = query;
    this.currentPage.set(1);
    if (query.length >= (this.config.minSearchLength || 2)) {
      this.performSearch(query);
      this.showOverlay();
    } else {
      this.filteredItems.set([]);
      if (query.length === 0) {
        this.hideOverlay();
      }
    }
    this.searchChanged.emit(query);
  }

  public focus() {
    this.searchInput?.nativeElement?.focus();
  }
}
