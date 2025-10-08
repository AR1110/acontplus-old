import { Observable } from 'rxjs';

export interface AutocompleteItem {
  id?: string | number;
  name?: string;
  value?: string;
  [key: string]: any;
}

export interface SearchResult {
  items: AutocompleteItem[];
  totalCount: number;
  hasMore?: boolean;
}

export type SearchFunction = (
  query: string,
  filters: AutocompleteFilters,
  page?: number,
  pageSize?: number,
) => Observable<SearchResult>;

export interface AutocompleteConfig {
  placeholder?: string;
  clearInput?: boolean;
  disabled?: boolean;
  debounceTime?: number;
  minSearchLength?: number;
  maxHistoryItems?: number;
  itemsPerPage?: number;
  enableStockFilter?: boolean;
  stockProperty?: string;
  enablePagination?: boolean;
  enableFilters?: boolean;
  enableFooterActions?: boolean;
  searchFields?: SearchField[];
  stockOptions?: StockOption[];
  // Nueva propiedad para función de búsqueda personalizada
  searchFunction?: SearchFunction;

  // Indica si usar búsqueda local o remota
  searchMode?: 'local' | 'remote' | 'hybrid';
}

export interface SearchField {
  value: string;
  label: string;
  property: string;
}

export interface StockOption {
  value: string;
  label: string;
}

export interface AutocompleteFilters {
  searchBy: string;
  stockFilter: string;
}

export interface AutocompleteEvents {
  itemSelected: AutocompleteItem;
  searchChanged: string;
  pageChanged: number;
  filterChanged: AutocompleteFilters;
  advancedSearchClicked: void;
  allResultsClicked: string;
  createProductClicked: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AutocompleteState {
  query: string;
  isLoading: boolean;
  overlayOpen: boolean;
  selectedIndex: number;
  pagination: PaginationInfo;
  hasResults: boolean;
  isHistoryVisible: boolean;
  historyCount: number;
  filters: AutocompleteFilters;
}

// Configuraciones predefinidas
export const DEFAULT_AUTOCOMPLETE_CONFIG: AutocompleteConfig = {
  placeholder: 'Buscar...',
  disabled: false,
  debounceTime: 300,
  minSearchLength: 2,
  maxHistoryItems: 10,
  itemsPerPage: 10,
  enableStockFilter: true,
  stockProperty: 'stock',
  enablePagination: true,
  enableFilters: true,
  enableFooterActions: true,
  searchFields: [
    // { value: 'name', label: 'Nombre', property: 'name' },
    { value: 'description', label: 'Descripción', property: 'description' },
    { value: 'code', label: 'Código', property: 'code' },
    { value: 'barcode', label: 'Código de Barras', property: 'barcode' },
    { value: 'auxCode', label: 'Código Auxiliar', property: 'auxCode' }, // <- nuevo campo
  ],
  stockOptions: [
    { value: 'all', label: 'Todos' },
    { value: 'with-stock', label: 'Con Stock' },
    { value: 'without-stock', label: 'Sin Stock' },
  ],
};

export const PRODUCT_AUTOCOMPLETE_CONFIG: AutocompleteConfig = {
  ...DEFAULT_AUTOCOMPLETE_CONFIG,
  placeholder: 'Buscar productos...',
  enableStockFilter: true,
  enableFooterActions: true,
};

export const CUSTOMER_AUTOCOMPLETE_CONFIG: AutocompleteConfig = {
  ...DEFAULT_AUTOCOMPLETE_CONFIG,
  placeholder: 'Buscar clientes...',
  enableStockFilter: false,
  searchFields: [
    { value: 'name', label: 'Nombre', property: 'name' },
    { value: 'email', label: 'Email', property: 'email' },
    { value: 'phone', label: 'Teléfono', property: 'phone' },
    { value: 'document', label: 'Documento', property: 'document' },
  ],
};

export const SIMPLE_AUTOCOMPLETE_CONFIG: AutocompleteConfig = {
  ...DEFAULT_AUTOCOMPLETE_CONFIG,
  placeholder: 'Buscar...',
  enableStockFilter: false,
  enableFilters: false,
  enableFooterActions: false,
  enablePagination: false,
  itemsPerPage: 50,
};
