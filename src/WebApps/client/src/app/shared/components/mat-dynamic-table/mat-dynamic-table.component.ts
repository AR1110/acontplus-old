import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TableCellIndex } from '@shared/models/mat-table-models/table-cell-index.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { GetTotalPipe } from '@shared/pipe/get-total.pipe';

@Component({
  selector: 'app-mat-dynamic-table',
  standalone: true,
  imports: [
    MatCheckbox,
    MatSort,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatFooterCellDef,
    MatFooterCell,
    MatSortModule,
    NgClass,
    MatFooterRowDef,
    MatFooterRow,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    GetTotalPipe,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './mat-dynamic-table.component.html',
  styleUrl: `./mat-dynamic-table.component.scss`,
})
export class MatDynamicTableComponent<T> {
  @Input() showFooter: boolean = false;
  @Input() locale: string = '';
  @Input() highlightRowIndex: number = 0;

  @Input() displayedColumns: string[] = [];
  @Input() displayColumnDefs: ColumnDefinition[] = [];
  @Input() showSelectBox: boolean = false;
  @Input() dataList: T[] = [];
  @Output() rowSelected = new EventEmitter<T>();
  @Output() copyRow = new EventEmitter<T>();
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
    if (!this.displayedColumns) {
      this.displayedColumns = this.displayColumnDefs.map((col) => col.key);
      this.displayColumnDefs.forEach((col, index) => (col.index = index));
    }

    if (this.showSelectBox && this.displayedColumns.indexOf('select') < 0) {
      this.displayedColumns = ['select', ...this.displayedColumns];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataList'].currentValue && changes['dataList']) {
      this.dataSource = new MatTableDataSource<T>(this.dataList);
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
}
