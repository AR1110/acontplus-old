// services/autocomplete.service.ts

import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, delay, map} from 'rxjs';
import {
  AutocompleteConfig,
  AutocompleteFilters,
  AutocompleteItem,
  DEFAULT_AUTOCOMPLETE_CONFIG, SearchFunction, SearchResult
} from "@shared/models/autocomplete.interfaces";


@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private historySubject = new BehaviorSubject<AutocompleteItem[]>([]);
  public history$ = this.historySubject.asObservable();

  constructor() {
    this.loadHistoryFromStorage();
  }

  // Búsqueda local (sin API)
  searchLocal(
    items: AutocompleteItem[],
    query: string,
    filters: AutocompleteFilters,
    config: AutocompleteConfig
  ): Observable<SearchResult> {
    const filtered = this.filterItems(items, query, filters, config);
    const page = 1; // Para búsqueda local, asumimos página 1
    const pageSize = config.itemsPerPage || 10;
    const startIndex = (page - 1) * pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + pageSize);

    return of({
      items: pageItems,
      totalCount: filtered.length,
      hasMore: filtered.length > startIndex + pageSize
    });
  }

  // Filtrar elementos basado en query y filtros
  filterItems(
    items: AutocompleteItem[],
    query: string,
    filters: AutocompleteFilters,
    config: AutocompleteConfig = DEFAULT_AUTOCOMPLETE_CONFIG
  ): AutocompleteItem[] {
    if (!query || query.length < (config.minSearchLength || 2)) {
      return [];
    }

    let filteredItems = items.filter(item => {
      if (item && typeof item === 'string') {
        return true
      }

      // Buscar por el campo seleccionado
      const searchValue = this.getSearchValue(item, filters.searchBy, config);
      return searchValue.toLowerCase().includes(query.toLowerCase());
    });

    // Aplicar filtro de stock si está habilitado
    if (config.enableStockFilter && filters.stockFilter !== 'all') {
      filteredItems = filteredItems.filter(item => {
        if (typeof item === 'string') return true;

        const stockValue = item[config.stockProperty || 'stock'];
        const hasStock = stockValue !== undefined && stockValue !== null && stockValue > 0;

        return filters.stockFilter === 'with-stock' ? hasStock : !hasStock;
      });
    }

    return filteredItems;
  }

  // Simular búsqueda asíncrona
  searchAsync(
    items: AutocompleteItem[],
    query: string,
    filters: AutocompleteFilters,
    config: AutocompleteConfig = DEFAULT_AUTOCOMPLETE_CONFIG
  ): Observable<AutocompleteItem[]> {
    const results = this.filterItems(items, query, filters, config);
    return of(results).pipe(delay(100)); // Simular delay de API
  }

  // Obtener valor de búsqueda según el campo seleccionado
  private getSearchValue(
    item: AutocompleteItem,
    searchBy: string,
    config: AutocompleteConfig
  ): string {
    const searchField = config.searchFields?.find(field => field.value === searchBy);
    if (searchField) {
      return item[searchField.property] || '';
    }

    // Fallback a la lógica anterior
    switch (searchBy) {
      case 'description':
        return item["description"]   || '';
      case 'code':
        return item["code"]   || item.id?.toString() || '';
      case 'barcode':
        return item["barcode"]  || '';
      case 'email':
        return   '';
      case 'phone':
        return   '';
      case 'document':
        return   '';
      case 'name':
      default:
        return item.name || item.value   || '';
    }
  }

  // Gestión de historial
  addToHistory(item: AutocompleteItem, maxItems = 10): void {
    const currentHistory = this.historySubject.value;

    // Remover si ya existe
    const filteredHistory = currentHistory.filter(historyItem => {
      if (typeof item === 'string' && typeof historyItem === 'string') {
        return item !== historyItem;
      } else if (typeof item === 'object' && typeof historyItem === 'object') {
        return (item.id || item.name) !== (historyItem.id || historyItem.name);
      }
      return true;
    });

    // Agregar al inicio
    const newHistory = [item, ...filteredHistory].slice(0, maxItems);

    this.historySubject.next(newHistory);
    this.saveHistoryToStorage(newHistory);
  }

  removeFromHistory(index: number): void {
    const currentHistory = this.historySubject.value;
    currentHistory.splice(index, 1);
    this.historySubject.next([...currentHistory]);
    this.saveHistoryToStorage(currentHistory);
  }

  clearHistory(): void {
    this.historySubject.next([]);
    this.saveHistoryToStorage([]);
  }

  getHistory(): AutocompleteItem[] {
    return this.historySubject.value;
  }

  // Gestión de almacenamiento
  private loadHistoryFromStorage(): void {
    try {
      const stored = localStorage.getItem('autocomplete_history');
      if (stored) {
        const history = JSON.parse(stored);
        this.historySubject.next(history);
      }
    } catch (error) {
      console.warn('Error loading autocomplete history:', error);
    }
  }

  private saveHistoryToStorage(history: AutocompleteItem[]): void {
    try {
      localStorage.setItem('autocomplete_history', JSON.stringify(history));
    } catch (error) {
      console.warn('Error saving autocomplete history:', error);
    }
  }

  // Paginación
  paginateItems<T>(items: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage) || 1;
  }

  // Validaciones
  isValidPage(page: number, totalPages: number): boolean {
    return page >= 1 && page <= totalPages;
  }

  // Utilidades para templates
  highlightText(text: string, query: string): string {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  getItemDisplayText(item: AutocompleteItem, displayField = 'nombre'): string {
    if (typeof item === 'string') return item;
    return item[displayField] || item.name || item.value || item.id?.toString() || '';
  }

  // Configuración dinámica
  mergeConfig(userConfig: Partial<AutocompleteConfig>): AutocompleteConfig {
    return { ...DEFAULT_AUTOCOMPLETE_CONFIG, ...userConfig };
  }



  createGenericSearchFunction(config: {
    search(params: any): Observable<any>;
    queryParam?: string;
    searchByParam?: string;
    pageParam?: string;
    pageSizeParam?: string;
    responseMapper?: (response: any) => SearchResult;
  }): SearchFunction {
    return (query: string, filters: AutocompleteFilters, page = 1, pageSize = 10) => {
      console.log(query, filters, page, pageSize);
      const params =  {
        [config.queryParam || 'textSearch']: query,
          [config.searchByParam || 'searchBy']: filters.searchBy,
        [config.pageParam || 'pageIndex']: page,
        [config.pageSizeParam || 'pageSize']: pageSize
      }
      return config.search(params).pipe(
        map(response => {
          console.log(response);
          if (config.responseMapper) {
            return config.responseMapper(response);
          }

          // Mapper por defecto
          const items =  response.data || response.items || response;
          const totalRecords = items.length>0? items[0].totalRecords : 0;
          return {
            items,
            totalCount: totalRecords|| response.totalCount || response.total || 0,
            hasMore: response.hasMore || false
          };
        })
      );
    };
  }

}
