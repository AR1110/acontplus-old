import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  input,
  Input,
  output,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MatColumnDef,
  MatFooterRowDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TableCellIndex } from '@shared/models/mat-table-models/table-cell-index.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { GetTotalPipe } from '@shared/pipes/get-total.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Pagination } from '@shared/models/pagination.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CustomMatSpinnerComponent } from '@core/components/custom-mat-spinner/custom-mat-spinner.component';

@Component({
  selector: 'app-mat-dynamic-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NgClass,
    GetTotalPipe,
    DatePipe,
    DecimalPipe,
    CustomMatSpinnerComponent,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  templateUrl: './mat-dynamic-table.component.html',
  styleUrl: `./mat-dynamic-table.component.scss`,
})
export class MatDynamicTableComponent<T> {
  @Input() showExpand = false;
  @Input() showFooter: boolean = false;
  @Input() locale: string = '';
  @Input() highlightRowIndex: number = 0;

  @Input() visibleColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefinition[] = [];

  //  columnsToDisplayWithExpand = this.showExpand ? [...this.visibleColumns, 'expand'] : this.visibleColumns

  @Input() showSelectBox: boolean = false;
  @Input() tableData: T[] = [];
  @Output() rowSelected = new EventEmitter<T>();
  @Output() copyRow = new EventEmitter<T>();
  onShowExpanded = output<T>();
  onHideExpanded = output<T>();

  dataSource = new MatTableDataSource<T>([]);
  selection: SelectionModel<T> = new SelectionModel<T>(true, []);

  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;

  // @ViewChildren('matrow', { read: ViewContainerRef })
  @ContentChildren(ViewContainerRef)
  rows!: QueryList<ViewContainerRef>; // Query for ViewContainerRefs

  @Input() templateOp!: TemplateRef<any> | null;
  @Input() expandedDetail!: TemplateRef<any> | null;

  expandedElement!: T | null;

  enablePagination = input(false);
  onPageEvent = output<PageEvent>();
  paginationConfig = input<Pagination>();

  handlePageEvent(e: PageEvent) {
    this.onPageEvent.emit(e);
  }

  isLoadingData = input<boolean>(false);

  constructor() {}

  ngAfterContentInit(): void {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach((rowDef) => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach((headerRowDef) =>
      this.table.addHeaderRowDef(headerRowDef),
    );

    if (this.showFooter) {
      this.footerRowDefs.forEach((footerRowDef) =>
        this.table.addFooterRowDef(footerRowDef),
      );
    } else {
      this.footerRowDefs.forEach((footerRowDef) =>
        this.table.removeFooterRowDef(footerRowDef),
      );
    }
    // init grid state
    this.selection = new SelectionModel<T>(true, []);
    this.table.setNoDataRow(this.noDataRow);
  }

  ngOnInit(): void {
    if (!this.visibleColumns) {
      this.visibleColumns = this.columnDefinitions.map((col) => col.key);
      this.columnDefinitions.forEach((col, index) => (col.index = index));
    }

    if (this.showSelectBox && this.visibleColumns.indexOf('select') < 0) {
      this.visibleColumns = ['select', ...this.visibleColumns];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']?.currentValue && changes['tableData']) {
      this.dataSource = new MatTableDataSource<T>(this.tableData);
    }
  }

  moveNextRow(cell: TableCellIndex): void {
    console.log('moveNextRow(): ' + JSON.stringify(cell));
  }

  selectRow(row: T): void {
    this.rowSelected.emit(row); // this.selection.selected
  }

  // ----START CHECKBOX LOGIC

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`; //  ${row.id + 1}
  }

  // ----END CHECKBOX LOGIC

  showElement(index: number, height: number): void {
    const row = this.rows.toArray()[index]; // .find(row => row.element.nativeElement.getAttribute('position') === indexstr);
    if (row != null) {
      const rect = row.element.nativeElement.getBoundingClientRect();
      if (rect.y <= 0 || rect.y + rect.height > height) {
        row.element.nativeElement.scrollIntoView(false, {
          behavior: 'instant',
        });
      }
      return;
    }
    console.log('not found');
  }

  onHighlightedRowChange(event: KeyboardEvent): void {
    // let rect     = event.target.getBoundingClientRect();
    let focused = this.dataSource.data[this.highlightRowIndex];
    const x: number = this.dataSource.data.indexOf(focused);
    const l: number = this.dataSource.data.length;
    if (event.keyCode === 38) {
      // Up
      if (x > 0) {
        focused = this.dataSource.data[x - 1];
      }
    } else if (event.keyCode === 40) {
      // Down
      if (x < l - 1) {
        focused = this.dataSource.data[x + 1];
      }
    }
    if (focused != null) {
      this.showElement(this.highlightRowIndex, 35); // $table-row-height = 35px // rect.height
    }
  }

  getRowColor(element: any): string {
    return element.colorRow ? element.colorRow : ''; // Return empty string if no color is defined
  }

  onExpand($event: any, element: T) {
    $event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.onShowExpanded.emit(element);
    } else {
      this.onHideExpanded.emit(element);
    }
  }
}
