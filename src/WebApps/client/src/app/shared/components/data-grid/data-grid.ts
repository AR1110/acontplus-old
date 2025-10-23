import {
  Component,
  input,
  output,
  effect,
  computed,
  signal,
  TemplateRef,
  InjectionToken,
  inject,
  booleanAttribute,
  TrackByFunction,
  ViewChild,
  ContentChildren,
  QueryList,
  ElementRef,
  SimpleChanges,
  ChangeDetectionStrategy,
  KeyValueChangeRecord,
  ANIMATION_MODULE_TYPE,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { fromEvent, Subject, takeUntil, debounceTime, filter } from 'rxjs';

// Material Imports
import {
  MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef,
  MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort, SortDirection } from '@angular/material/sort';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatProgressBar } from "@angular/material/progress-bar";
import { SelectionModel } from '@angular/cdk/collections';

// Shared Imports
import {
  DataGridCellTemplate, DataGridColumn, DataGridDefaultOptions,
  DataGridRowClassFormatter, DataGridRowSelectionFormatter
} from "./types";
import { AcpIsTemplateRefPipe } from "../../pipes/is-template-ref.pipe";
import { AcpToObservablePipe } from "../../pipes/to-observable.pipe";
import { DataGridSelectableCell } from "../../directives/selectable-cell";
import { DataGridUtils } from "../../utils/data-grid.util";
import { DataGridExpansionToggle } from "../../directives/data-grid-expansion-toggle";
import { DataGridCell } from "./data-grid-cell/data-grid-cell";
import {DataGridColClassPipe, DataGridRowClassPipe} from "@shared/pipes/data-grid.pipe";
import {KeyboardNavigationService} from "@shared/components/data-grid/keyboard-navigation";

export const DATA_GRID_DEFAULT_OPTIONS = new InjectionToken<DataGridDefaultOptions>(
  'data-grid-default-options'
);

@Component({
  selector: 'app-data-grid',
  exportAs: 'dataGrid',
  imports: [
    AsyncPipe, NgTemplateOutlet, MatProgressBar, MatIconButton, MatCheckbox,
    MatTable, MatColumnDef, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow,
    MatFooterRowDef, MatFooterRow, MatHeaderCellDef, MatHeaderCell, MatCellDef,
    MatCell, MatFooterCellDef, MatFooterCell, MatSort, MatSortHeader, MatPaginator,
    DataGridColClassPipe, AcpIsTemplateRefPipe, AcpToObservablePipe,
    DataGridSelectableCell, DataGridExpansionToggle, DataGridCell, DataGridRowClassPipe,
  ],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  host: {
    'class': 'data-grid',
    '[class.data-grid-animations-enabled]': '!_animationsDisabled',
    '[attr.tabindex]': '0',
   // '(keydown)': 'handleKeyDown($event)'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid<T = any> implements AfterViewInit, OnDestroy {
  protected _animationsDisabled = inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
  private _utils = inject(DataGridUtils);
  private _defaultOptions = inject<DataGridDefaultOptions>(DATA_GRID_DEFAULT_OPTIONS, { optional: true });
  private _keyboardNavService = inject(KeyboardNavigationService);
  private _destroy$ = new Subject<void>();

  // ViewChild & ContentChildren
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<any>>;
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatFooterRow) footerRowDefs!: QueryList<MatFooterRowDef>;

  // Toolbar
  showToolbar = input(this._defaultOptions?.showToolbar ?? false, { transform: booleanAttribute });
  showColumnMenuButton = input(this._defaultOptions?.showColumnMenuButton ?? true, { transform: booleanAttribute });
  toolbarTitle = input(this._defaultOptions?.toolbarTitle ?? '');
  toolbarTemplate = input<TemplateRef<any>>();

  // Data Configuration
  data = input<T[]>([]);
  columns = input<DataGridColumn<T>[]>([]);
  length = input<number>(0);
  loading = input<boolean>(false);
  emptyValuePlaceholder = input<string>('-');
  trackBy = input<TrackByFunction<any>>();

  // Templates
  cellTemplate = input<{ [key: string]: TemplateRef<any> }>({});
  headerTemplate = input<TemplateRef<any> | DataGridCellTemplate>();
  headerExtraTemplate = input<TemplateRef<any> | DataGridCellTemplate>();
  noResultTemplate = input<TemplateRef<any>>();
  paginationTemplate = input<TemplateRef<any>>();
  summaryTemplate = input<TemplateRef<any> | DataGridCellTemplate>();

  // Expansion
  expandable = input<boolean>(false);
  expansionTemplate = input<TemplateRef<any> | null>(null);

  // Pagination
  pageOnFront = input<boolean>(true);
  showPaginator = input<boolean>(true);
  pageDisabled = input<boolean>(false);
  showFirstLastButtons = input<boolean>(true);
  pageIndex = input<number>(0);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 20, 50]);
  hidePageSize = input<boolean>(false);

  // Infinite Scroll
  infiniteScroll = input<boolean>(false);
  infiniteScrollThreshold = input<number>(0.8);
  infiniteScrollDisabled = input<boolean>(false);

  // Keyboard Navigation
  keyboardNavigation = input<boolean>(true);

  focusedRowIndex = computed(()=>this._keyboardNavService.focusedRowIndex()); // Vinculado al servicio
  // Sorting
  sortOnFront = input<boolean>(true);
  sortActive = input<string>('');
  sortDirection = input<SortDirection>('');
  sortDisableClear = input<boolean>(false);
  sortDisabled = input<boolean>(false);
  sortStart = input<'asc' | 'desc'>('asc');

  // Row Behavior
  rowHover = input<boolean>(true);
  rowStriped = input<boolean>(false);
  rowSelectable = input<boolean>(false);
  multiSelectable = input<boolean>(true);
  multiSelectionWithClick = input<boolean>(false);
  hideRowSelectionCheckbox = input<boolean>(false);
  disableRowClickSelection = input<boolean>(false);
  rowClassFormatter = input<DataGridRowClassFormatter>();
  rowSelected = input<T[]>([]);
  rowSelectionFormatter = input<DataGridRowSelectionFormatter>({});

  // Cell Selection
  cellSelectable = input<boolean>(false);

  // Row Templates
  useContentRowTemplate = input(false, { transform: booleanAttribute });
  useContentHeaderRowTemplate = input(false, { transform: booleanAttribute });
  useContentFooterRowTemplate = input(false, { transform: booleanAttribute });

  // Summary
  showSummary = input(false, { transform: booleanAttribute });

  // No Result
  noResultText = input(this._defaultOptions?.noResultText ?? 'No se encontraron registros');

  // Outputs
  page = output<PageEvent>();
  sortChange = output<Sort>();
  rowClick = output<any>();
  rowSelectedChange = output<any[]>();
  selectionChange = output<T[]>();
  cellClick = output<{ row: T; column: DataGridColumn<T> }>();
  cellSelectedChange = output<any[]>();
  expansionChange = output<any>();
  rowContextMenu = output<any>();
  infiniteScrollLoad = output<void>();
  focusedRowChange = output<{ row: T; index: number }>();

  // Internal State
  dataSource = new MatTableDataSource<any>();
  private _selectedCell?: DataGridSelectableCell;
  cellSelection: any[] = [];
  rowChangeRecord?: KeyValueChangeRecord<string, any>;
  rowSelection: SelectionModel<any> = new SelectionModel<any>(true, []);
  expansionRowStates = signal<any[]>([]);

  // Signals
  selection = signal<SelectionModel<T>>(new SelectionModel<T>(true, []));
  currentSort = signal<Sort>({ active: '', direction: '' });
  isLoadingMore = signal<boolean>(false);

  // Computed Properties
  displayedColumns = computed(() => {
    const cols = this.columns().filter(item => !this.isColumnHide(item)).map(item => item.field);
    if (this.rowSelectable() && !this.hideRowSelectionCheckbox()) {
      cols.unshift('DataGridCheckboxColumnDef');
    }
    return cols;
  });

  hasNoResult = computed(() => {
    console.log(this.data())

    return  (this.data().length === 0) && !this.loading();

  });
  whetherShowSummary = computed(() => this.showSummary());

  constructor() {
    // Effects
    effect(() => this.selection.set(new SelectionModel<T>(this.multiSelectable(), [])));
    effect(() => {
      const selected = this.rowSelected();
      if (selected?.length > 0) {
        const selectionModel = this.selection();
        selectionModel.clear();
        selected.forEach(row => selectionModel.select(row));
      }
    });
    effect(() => {
      const selected = this.selection().selected;
      this.selectionChange.emit(selected);
      this.rowSelectedChange.emit(selected);
    });
    effect(() => {
      this.updateDisplayedColumns();
      this.countPinnedPosition();
    });
    effect(() => {
      if (this.rowSelectable()) {
        this.rowSelection = new SelectionModel<any>(this.multiSelectable(), this.rowSelected());
      }
    });
    effect(() => {
      if (this.data()) {
        // Usamos el método público del servicio en lugar de modificar su signal directamente
        this._keyboardNavService.resetFocusedRowIndex();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pageOnFront() ? this.paginator : null;
    this.dataSource.sort = this.sortOnFront() ? this.sort : null;

    if (this.rowDefs?.length > 0 && this.useContentRowTemplate()) {
      this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    }
    if (this.headerRowDefs?.length > 0 && this.useContentHeaderRowTemplate()) {
      this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    }
    if (this.footerRowDefs?.length > 0 && this.useContentFooterRowTemplate()) {
      this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
    }

    if (this.keyboardNavigation()) {
      this._keyboardNavService.registerElement({
        element: this.tableContainer,
        name: 'dataGrid',
        onFocus: (index) => {
          // Cuando el DataGrid recibe el foco, enfocar la primera fila
          this.focusRow(index ?? 0);
        },
        onFocusedChange: (index) => {
          // Cuando el índice cambia externamente, actualizar la fila enfocada
          this.focusRow(index);
        }
      });
    }

    if (this.infiniteScroll()) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    if (this.keyboardNavigation()) {
      this._keyboardNavService.unregisterElement(this.tableContainer);
    }
  }

  // Infinite Scroll
  private setupInfiniteScroll() {
    if (!this.tableContainer) return;
    fromEvent(this.tableContainer.nativeElement, 'scroll').pipe(
      takeUntil(this._destroy$),
      debounceTime(200),
      filter(() => !this.infiniteScrollDisabled() && !this.loading() && !this.isLoadingMore())
    ).subscribe(() => {
      const element = this.tableContainer.nativeElement;
      const threshold = this.infiniteScrollThreshold();
      const scrollPosition = element.scrollTop + element.clientHeight;
      const scrollHeight = element.scrollHeight;
      if (scrollPosition / scrollHeight >= threshold) {
        this.loadMoreData();
      }
    });
  }

  private loadMoreData() {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.infiniteScrollLoad.emit();
    setTimeout(() => this.isLoadingMore.set(false), 1000); // Prevent rapid-fire calls
  }



  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    if(!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) return;
    if (!this.keyboardNavigation() || this.hasNoResult()) return;

    const dataLength = this.dataSource.data.length;
    const currentFocusIndex = this._keyboardNavService.focusedRowIndex();
    let newFocusIndex = currentFocusIndex;
    let preventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
        newFocusIndex = Math.min(currentFocusIndex + 1, dataLength - 1);
        break;

      case 'ArrowUp':
        if (currentFocusIndex === 0) {
          // Si estamos en la primera fila, mover el foco al elemento anterior
          event.preventDefault();
          this._keyboardNavService.focusElement('searchInput');
          return;
        }
        newFocusIndex = Math.max(currentFocusIndex - 1, 0);
        break;

      case 'Home':
        newFocusIndex = 0;
        break;

      case 'End':
        newFocusIndex = dataLength - 1;
        break;

      case 'Enter':
        if (currentFocusIndex >= 0 && currentFocusIndex < dataLength) {
          event.preventDefault();
          const row = this.dataSource.data[currentFocusIndex];
          this.handleRowAction(row, currentFocusIndex);
        }
        break;

      case ' ':
        if (currentFocusIndex >= 0 && currentFocusIndex < dataLength) {
          event.preventDefault();
          const row = this.dataSource.data[currentFocusIndex];
          this.toggleRowSelection(row);
        }
        break;

      default:
        preventDefault = false;
        break;
    }

    if (preventDefault && newFocusIndex !== currentFocusIndex) {
      event.preventDefault();
      this._keyboardNavService.updateFocusedIndex(newFocusIndex);
    }
  }


  focusRow(index: number) {
    if (index < 0 || index >= this.dataSource.data.length) return;
    const row = this.dataSource.data[index];
    this.focusedRowChange.emit({ row, index });
    this.scrollRowIntoView(index);
  }

  private scrollRowIntoView(index: number) {
    if (!this.tableContainer) return;
    const rowElements = this.tableContainer.nativeElement.querySelectorAll('tr.mat-row');
    if (rowElements.length > index) {
      const rowElement = rowElements[index] as HTMLElement;
      const containerElement = this.tableContainer.nativeElement;
      const containerRect = containerElement.getBoundingClientRect();
      const rowRect = rowElement.getBoundingClientRect();

      if (rowRect.bottom > containerRect.bottom) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else if (rowRect.top < containerRect.top) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  private handleRowAction(row: T, index: number) {
    if (this.expandable()) {
      this.toggleRowExpansion(row, index);
    } else if (this.rowSelectable()) {
      this.toggleRowSelection(row);
    } else {
      this.rowClick.emit({ event: new MouseEvent('click'), rowData: row, index });
    }
  }

  private toggleRowExpansion(row: T, index: number) {
    const currentStates = structuredClone(this.expansionRowStates());
    if (currentStates[index]) {
      currentStates[index].expanded = !currentStates[index].expanded;
      this.expansionRowStates.set(currentStates);
      this.expansionChange.emit({ expanded: currentStates[index].expanded, data: row, index, column: null });
    }
  }

  private toggleRowSelection(row: T) {
    if (this.multiSelectable()) {
      this.rowSelection.toggle(row);
    } else {
      this.rowSelection.clear();
      this.rowSelection.select(row);
    }
    this.rowSelectedChange.emit(this.rowSelection.selected);
  }

  // Event Handlers
  onSortChange(sort: Sort) {
    this.currentSort.set(sort);
    this.sortChange.emit(sort);
  }

  onPage(event: PageEvent): void {
    if (this.pageOnFront()) this.scrollTop(0);
    this.page.emit(event);
  }

  onExpansionChange(expansionRef: DataGridExpansionToggle, rowData: Record<string, any>, column: DataGridColumn, index: number) {
    const currentStates = structuredClone(this.expansionRowStates());
    if (currentStates[index]) {
      currentStates[index].expanded = expansionRef.opened;
      this.expansionRowStates.set(currentStates);
    }
    this.expansionChange.emit({ expanded: expansionRef.opened, data: rowData, index, column });
  }

  // Selection Methods
  isAllSelected(): boolean {
    const numSelected = this.rowSelection.selected.length;
    const numRows = this.dataSource.data.filter((row, index) => !this.rowSelectionFormatter().disabled?.(row, index)).length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows(): void {
    this.isAllSelected() ? this.rowSelection.clear() : this.dataSource.data.forEach((row, index) => {
      if (!this.rowSelectionFormatter().disabled?.(row, index)) this.rowSelection.select(row);
    });
    this.rowSelectedChange.emit(this.rowSelection.selected);
  }

  toggleNormalCheckbox(row: Record<string, any>) {
    this.rowSelection.toggle(row);
    this.rowSelectedChange.emit(this.rowSelection.selected);
  }

  isRowDisabled(row: T, index?: number): boolean {
    return this.rowSelectionFormatter()?.disabled?.(row, index ?? 0) ?? false;
  }

  shouldHideCheckbox(row: T, index?: number): boolean {
    if (this.hideRowSelectionCheckbox()) return true;
    return this.rowSelectionFormatter()?.hideCheckbox?.(row, index ?? 0) ?? false;
  }

  // Row Selection
  selectRow(event: MouseEvent, rowData: Record<string, any>, index: number) {
    if (this.rowSelectable() && !this.rowSelectionFormatter().disabled?.(rowData, index) && !this.rowSelectionFormatter().hideCheckbox?.(rowData, index) && !this.disableRowClickSelection()) {
      if (!this.multiSelectionWithClick && !event.ctrlKey && !event.metaKey) {
        this.rowSelection.clear();
      }
      this.toggleNormalCheckbox(rowData);
    }
    if (this.keyboardNavigation()) {
      this._keyboardNavService.updateFocusedIndex(index);
    }
    this.rowClick.emit({ event, rowData, index });
  }

  // Cell Selection
  selectCell(cellRef: DataGridSelectableCell, rowData: Record<string, any>, colDef: DataGridColumn): void {
    if (this._selectedCell !== cellRef) {
      const colValue = this._utils.getCellValue(rowData, colDef);
      this.cellSelection = [{ cellData: colValue, rowData, colDef }];
      this.cellSelectedChange.emit(this.cellSelection);
      this._selectedCell?.deselect();
    }
    this._selectedCell = cellRef.selected ? cellRef : undefined;
  }

  // Data Change Methods
  onRowDataChange(record: KeyValueChangeRecord<string, any>) {
    this.rowChangeRecord = record;
  }

  // Lifecycle Hooks
  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplayedColumns();
    this.countPinnedPosition();

    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data());
      this.updateExpansionRowStates();
      this.scrollTop(0);
    }

    if (changes['rowSelectable'] && this.rowSelectable()) {
      this.rowSelection = new SelectionModel<any>(this.multiSelectable(), this.rowSelected());
    }

    this.dataSource.paginator = this.pageOnFront() ? this.paginator : null;
    this.dataSource.sort = this.sortOnFront() ? this.sort : null;

    if (changes['infiniteScroll'] && this.infiniteScroll()) {
      this.setupInfiniteScroll();
    }
  }

  // Private Helper Methods
  private updateDisplayedColumns() {
    if (this.showColumnMenuButton()) {
      this.columns().forEach(item => {
        item.hide = this.isColumnHide(item);
        item.show = !item.hide;
      });
    }
  }

  private updateExpansionRowStates() {
    if (this.expandable()) {
      const newStates: any[] = [];
      this.data()?.forEach(_ => newStates.push({ expanded: false }));
      this.expansionRowStates.set(newStates);
    }
  }

  private countPinnedPosition() {
    const count = (acc: number, cur: DataGridColumn) => acc + parseFloat(cur.width ?? '80px');
    const pinnedLeftCols = this.columns().filter(col => col.pinned === 'left');
    pinnedLeftCols.forEach((item, idx) => {
      item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
    });
    const pinnedRightCols = this.columns().filter(col => col.pinned === 'right').reverse();
    pinnedRightCols.forEach((item, idx) => {
      item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
    });
  }

  // Scroll Methods
  scrollTop(value?: number): number | void {
    if (value == null) return this.tableContainer?.nativeElement.scrollTop;
    if (this.tableContainer && !this.loading()) {
      this.tableContainer.nativeElement.scrollTop = value;
    }
  }

  scrollLeft(value?: number): number | void {
    if (value == null) return this.tableContainer?.nativeElement.scrollLeft;
    if (this.tableContainer && !this.loading()) {
      this.tableContainer.nativeElement.scrollLeft = value;
    }
  }

  // Context Menu
  contextmenu(event: MouseEvent, rowData: Record<string, any>, index: number) {
    this.rowContextMenu.emit({ event, rowData, index });
  }

  // Utility Methods
  getColData(data: any[], colDef: DataGridColumn) {
    return this._utils.getColData(data, colDef);
  }

  isColumnHide(item: DataGridColumn) {
    return item.hide !== undefined ? item.hide : item.show !== undefined ? !item.show : false;
  }

  getIndex(index: number | undefined, dataIndex: number) {
    return index === undefined ? dataIndex : index;
  }
}
