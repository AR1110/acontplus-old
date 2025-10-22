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
  ChangeDetectionStrategy, KeyValueChangeRecord, ANIMATION_MODULE_TYPE, ViewEncapsulation
} from '@angular/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort, SortDirection } from '@angular/material/sort';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatProgressBar } from "@angular/material/progress-bar";
import { SelectionModel } from '@angular/cdk/collections';
import {
  DataGridCellTemplate,
  DataGridColumn,
  DataGridDefaultOptions,
  DataGridRowClassFormatter,
  DataGridRowSelectionFormatter
} from "@shared/components/data-grid/types";
import { DataGridColClassPipe, DataGridRowClassPipe } from "@shared/pipes/data-grid.pipe";
import { AcpIsTemplateRefPipe } from "@shared/pipes/is-template-ref.pipe";
import { AcpToObservablePipe } from "@shared/pipes/to-observable.pipe";
import { DataGridSelectableCell } from "@shared/directives/selectable-cell";
import { DataGridUtils } from "@shared/utils/data-grid.util";
import { DataGridExpansionToggle } from "@shared/directives/data-grid-expansion-toggle";
import { DataGridCell } from "@shared/components/data-grid/data-grid-cell/data-grid-cell";

export const DATA_GRID_DEFAULT_OPTIONS = new InjectionToken<DataGridDefaultOptions>(
  'data-grid-default-options'
);

@Component({
  selector: 'app-data-grid',
  exportAs: 'dataGrid',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    MatProgressBar,
    MatIconButton,
    MatCheckbox,
    MatTable,
    MatColumnDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatFooterCellDef,
    MatFooterCell,
    MatSort,
    MatSortHeader,
    MatPaginator,
    DataGridColClassPipe,
    AcpIsTemplateRefPipe,
    AcpToObservablePipe,
    DataGridSelectableCell,
    DataGridExpansionToggle,
    DataGridCell,
    DataGridRowClassPipe,
  ],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  host: {
    'class': 'data-grid',
    '[class.data-grid-animations-enabled]': '!_animationsDisabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid<T = any> {
  protected _animationsDisabled =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
  // Inyección de dependencias
  private _utils = inject(DataGridUtils);
  private _defaultOptions = inject<DataGridDefaultOptions>(DATA_GRID_DEFAULT_OPTIONS, {
    optional: true,
  });

  // ===== ViewChild & ContentChildren =====
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<any>>;
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatFooterRow) footerRowDefs!: QueryList<MatFooterRowDef>;

  // ===== Toolbar =====
  showToolbar = input(this._defaultOptions?.showToolbar ?? false, { transform: booleanAttribute });
  showColumnMenuButton = input(this._defaultOptions?.showColumnMenuButton ?? true, { transform: booleanAttribute });
  toolbarTitle = input(this._defaultOptions?.toolbarTitle ?? '');
  toolbarTemplate = input<TemplateRef<any>>();

  // ===== Data Configuration =====
  data = input<T[]>([]);
  columns = input<DataGridColumn<T>[]>([]);
  length = input<number>(0);
  loading = input<boolean>(false);
  emptyValuePlaceholder = input<string>('-');
  trackBy = input<TrackByFunction<any>>();

  // ===== Templates =====
  cellTemplate = input<{ [key: string]: TemplateRef<any> }>({});
  headerTemplate = input<TemplateRef<any> | DataGridCellTemplate>();
  headerExtraTemplate = input<TemplateRef<any> | DataGridCellTemplate>();
  noResultTemplate = input<TemplateRef<any>>();
  paginationTemplate = input<TemplateRef<any>>();
  summaryTemplate = input<TemplateRef<any> | DataGridCellTemplate>();

  // ===== Expansion =====
  expandable = input<boolean>(false);
  expansionTemplate = input<TemplateRef<any> | null>(null);

  // ===== Pagination =====
  pageOnFront = input<boolean>(true);
  showPaginator = input<boolean>(true);
  pageDisabled = input<boolean>(false);
  showFirstLastButtons = input<boolean>(true);
  pageIndex = input<number>(0);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 20, 50]);
  hidePageSize = input<boolean>(false);

  // ===== Sorting =====
  sortOnFront = input<boolean>(true);
  sortActive = input<string>('');
  sortDirection = input<SortDirection>('');
  sortDisableClear = input<boolean>(false);
  sortDisabled = input<boolean>(false);
  sortStart = input<'asc' | 'desc'>('asc');

  // ===== Row Behavior =====
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

  // ===== Cell Selection =====
  cellSelectable = input<boolean>(false);

  // ===== Row Templates =====
  useContentRowTemplate = input(false, { transform: booleanAttribute });
  useContentHeaderRowTemplate = input(false, { transform: booleanAttribute });
  useContentFooterRowTemplate = input(false, { transform: booleanAttribute });

  // ===== Summary =====
  showSummary = input(false, { transform: booleanAttribute });

  // ===== No Result =====
  noResultText = input(this._defaultOptions?.noResultText ?? 'No se encontraron registros');

  // ===== Outputs =====
  page = output<PageEvent>();
  sortChange = output<Sort>();
  rowClick = output<any>();
  rowSelectedChange = output<any[]>();
  selectionChange = output<T[]>();
  cellClick = output<{ row: T; column: DataGridColumn<T> }>();
  cellSelectedChange = output<any[]>();
  expansionChange = output<any>();
  rowContextMenu = output<any>();

  // ===== Internal State =====
  dataSource = new MatTableDataSource<any>();
  private _selectedCell?: DataGridSelectableCell;
  cellSelection: any[] = [];
  rowChangeRecord?: KeyValueChangeRecord<string, any>;
  rowSelection: SelectionModel<any> = new SelectionModel<any>(true, []);

  expansionRowStates = signal<any[]>([]);
  // ===== Signals =====
  selection = signal<SelectionModel<T>>(new SelectionModel<T>(true, []));
  currentSort = signal<Sort>({ active: '', direction: '' });

  // ===== Computed Properties =====
  displayedColumns = computed(() => {
    const cols = this.columns()
      .filter(item => !this.isColumnHide(item))
      .map(item => item.field);

    if (this.rowSelectable() && !this.hideRowSelectionCheckbox()) {
      cols.unshift('DataGridCheckboxColumnDef');
    }

    return cols;
  });

  hasNoResult = computed(() =>
    (!this.dataSource.data || this.dataSource.data.length === 0) && !this.loading()
  );

  whetherShowSummary = computed(() => this.showSummary());

  constructor() {
    // Initialize selection model when multiSelectable changes
    effect(() => {
      this.selection.set(new SelectionModel<T>(this.multiSelectable(), []));
    });

    // Sync rowSelected input with selection
    effect(() => {
      const selected = this.rowSelected();
      if (selected && selected.length > 0) {
        const selectionModel = this.selection();
        selectionModel.clear();
        selected.forEach(row => selectionModel.select(row));
      }
    });

    // Emit selection changes
    effect(() => {
      const selected = this.selection().selected;
      this.selectionChange.emit(selected);
      this.rowSelectedChange.emit(selected);
    });

    // Update data source when data changes
    // effect(() => {
    //   this.dataSource.data = this.data();
    //   this.updateExpansionRowStates();
    // });

    // Update displayed columns when columns change
    effect(() => {
      this.updateDisplayedColumns();
      this.countPinnedPosition();
    });

    // Update row selection when rowSelectable changes
    effect(() => {
      if (this.rowSelectable()) {
        this.rowSelection = new SelectionModel<any>(this.multiSelectable(), this.rowSelected());
      }
    });
  }


  getColData(data: any[], colDef: DataGridColumn) {
    return this._utils.getColData(data, colDef);
  }

  isColumnHide(item: DataGridColumn) {
    return item.hide !== undefined ? item.hide : item.show !== undefined ? !item.show : false;
  }

  // ===== Event Handlers =====
  onSortChange(sort: Sort) {
    this.currentSort.set(sort);
    this.sortChange.emit(sort);
  }

  onPage(event: PageEvent): void {
    if (this.pageOnFront()) {
      this.scrollTop(0);
    }
    this.page.emit(event);
  }

  onExpansionChange(
    expansionRef: DataGridExpansionToggle,
    rowData: Record<string, any>,
    column: DataGridColumn,
    index: number
  ) {
    // Actualiza el estado de expansión usando el signal
    const currentStates = structuredClone(this.expansionRowStates());
    if (currentStates[index]) {
      currentStates[index].expanded = expansionRef.opened;
      this.expansionRowStates.set(currentStates);
    }

    this.expansionChange.emit({ expanded: expansionRef.opened, data: rowData, index, column });
  }


  // ===== Selection Methods =====
  isAllSelected(): boolean {
    const numSelected = this.rowSelection.selected.length;
    const numRows = this.dataSource.data.filter(
      (row, index) => !this.rowSelectionFormatter().disabled?.(row, index)
    ).length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.rowSelection.clear();
    } else {
      this.dataSource.data.forEach((row, index) => {
        if (!this.rowSelectionFormatter().disabled?.(row, index)) {
          this.rowSelection.select(row);
        }
      });
    }
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

  // ===== Row Selection =====
  selectRow(event: MouseEvent, rowData: Record<string, any>, index: number) {
    if (
      this.rowSelectable() &&
      !this.rowSelectionFormatter().disabled?.(rowData, index) &&
      !this.rowSelectionFormatter().hideCheckbox?.(rowData, index) &&
      !this.disableRowClickSelection()
    ) {
      if (!this.multiSelectionWithClick && !event.ctrlKey && !event.metaKey) {
        this.rowSelection.clear();
      }
      this.toggleNormalCheckbox(rowData);
    }
    this.rowClick.emit({ event, rowData, index });
  }

  // ===== Cell Selection =====
  selectCell(
    cellRef: DataGridSelectableCell,
    rowData: Record<string, any>,
    colDef: DataGridColumn
  ): void {
    if (this._selectedCell !== cellRef) {
      const colValue = this._utils.getCellValue(rowData, colDef);
      this.cellSelection = [{ cellData: colValue, rowData, colDef }];
      this.cellSelectedChange.emit(this.cellSelection);
      this._selectedCell?.deselect();
    }
    this._selectedCell = cellRef.selected ? cellRef : undefined;
  }

  // ===== Data Change Methods =====
  onRowDataChange(record: KeyValueChangeRecord<string, any>) {
    this.rowChangeRecord = record;
  }

  // ===== Lifecycle Hooks =====
  ngOnChanges(changes: SimpleChanges) {
    // Actualiza las columnas mostradas
    this.updateDisplayedColumns();
    this.countPinnedPosition();

    // Actualiza los estados de expansión cuando cambian los datos
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data());

      this.updateExpansionRowStates();
      this.scrollTop(0);
    }

    // Actualiza el modelo de selección cuando cambia la capacidad de selección
    if (changes['rowSelectable']) {
      if (this.rowSelectable()) {
        this.rowSelection = new SelectionModel<any>(this.multiSelectable(), this.rowSelected());
      }
    }

    // Configura el paginador y ordenamiento
    this.dataSource.paginator = this.pageOnFront() ? this.paginator : null;
    this.dataSource.sort = this.sortOnFront() ? this.sort : null;
  }

  ngAfterViewInit() {
    // Configure paginator and sort
    this.dataSource.paginator = this.pageOnFront() ? this.paginator : null;
    this.dataSource.sort = this.sortOnFront() ? this.sort : null;

    // Add custom row definitions
    if (this.rowDefs?.length > 0 && this.useContentRowTemplate()) {
      this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    }
    if (this.headerRowDefs?.length > 0 && this.useContentHeaderRowTemplate()) {
      this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    }
    if (this.footerRowDefs?.length > 0 && this.useContentFooterRowTemplate()) {
      this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
    }
  }

  // ===== Private Helper Methods =====
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
      this.data()?.forEach(_ => {
        newStates.push({ expanded: false });
      });
      this.expansionRowStates.set(newStates);
    }
  }

  private countPinnedPosition() {
    const count = (acc: number, cur: DataGridColumn) => acc + parseFloat(cur.width ?? '80px');

    const pinnedLeftCols = this.columns().filter(col => col.pinned && col.pinned === 'left');
    pinnedLeftCols.forEach((item, idx) => {
      item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
    });

    const pinnedRightCols = this.columns()
      .filter(col => col.pinned && col.pinned === 'right')
      .reverse();
    pinnedRightCols.forEach((item, idx) => {
      item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
    });
  }

  // ===== Scroll Methods =====
  scrollTop(value?: number): number | void {
    if (value == null) {
      return this.tableContainer?.nativeElement.scrollTop;
    }
    if (this.tableContainer && !this.loading()) {
      this.tableContainer.nativeElement.scrollTop = value;
    }
  }

  scrollLeft(value?: number): number | void {
    if (value == null) {
      return this.tableContainer?.nativeElement.scrollLeft;
    }
    if (this.tableContainer && !this.loading()) {
      this.tableContainer.nativeElement.scrollLeft = value;
    }
  }

  // ===== Context Menu =====
  contextmenu(event: MouseEvent, rowData: Record<string, any>, index: number) {
    this.rowContextMenu.emit({ event, rowData, index });
  }

  // ===== Utility Methods =====
  getIndex(index: number | undefined, dataIndex: number) {
    return index === undefined ? dataIndex : index;
  }
}
