import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EmbeddedViewRef,
  inject,
  Injector,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
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
import { CustomMatSpinnerComponent } from '@core/components/custom-mat-spinner/custom-mat-spinner.component';
import { DYNAMIC_INPUT } from '@shared/input/dynamic-input';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDynamicTableComponent<T>
  implements AfterContentInit, OnInit, OnChanges, OnDestroy
{
  private viewContainerRef = inject(ViewContainerRef);
  private injector = inject(Injector);
  private embeddedViews: EmbeddedViewRef<any>[] = [];
  _selectedRows = new Set<T>();

  @Input() showExpand = false;
  @Input() showFooter = false;
  @Input() locale = '';
  @Input() highlightRowIndex = 0;

  @Input() visibleColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefinition[] = [];

  //  columnsToDisplayWithExpand = this.showExpand ? [...this.visibleColumns, 'expand'] : this.visibleColumns

  @Input() showSelectBox = false;
  @Input() tableData: T[] = [];
  rowAllSelected = output<T[]>();
  rowSelected = output<any>();

  //agrego por tema de que el rowAllSelected esta mesclado con rowSelected
  //deberia gestionar independientemente rowSelected para cuando seleccionan una fila y rowAllSelected checkbox general
  returnMultiple = input(true)

  copyRow = output<T>();
  showExpanded = output<T>();
  hideExpanded = output<T>();

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
  pageEvent = output<PageEvent>();
  paginationConfig = input<Pagination>();

  handlePageEvent(e: PageEvent) {
    this.pageEvent.emit(e);
  }

  isLoadingData = input<boolean>(false);

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

  public createInjector = (element: any): Injector =>
    Injector.create({
      providers: [
        {
          //please note that the STATUS_INPUT is a token that we define in the status-input.ts file
          provide: DYNAMIC_INPUT,
          // here we pass the element that we want to use
          useValue: element,
        },
      ],
      parent: this.injector,
    });

  createEmbeddedView(column: any, element: any): void {
    console.log(column);
    const templateRef = column.body as TemplateRef<any>;

    // Create context for the template
    const context = {
      $implicit: element,
      ...column.body,
    };

    // Create the embedded view
    const viewRef = templateRef.createEmbeddedView(context);
    this.embeddedViews.push(viewRef);

    // Attach to the view container
    this.viewContainerRef.insert(viewRef);
  }

  moveNextRow(cell: TableCellIndex): void {
    console.log('moveNextRow(): ' + JSON.stringify(cell));
  }

  selectRow(row: T): void {
    // Toggle selection state
    if (this._selectedRows.has(row)) {
      this._selectedRows.delete(row);
      this.selection.deselect(row);
    } else {
      this._selectedRows.add(row);
      this.selection.select(row);
    }

    // Emit the current selection
    if(this.returnMultiple()){
      this.rowSelected.emit([...this._selectedRows]);
    }else{
      this.rowSelected.emit(row);
    }


  }

  // ----START CHECKBOX LOGIC

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // Update masterToggle to emit all selections
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this._selectedRows.clear();
    } else {
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);
        this._selectedRows.add(row);
      });
    }
    // Emit both events to keep parent components in sync
    if(this.returnMultiple()){
      this.rowAllSelected.emit([...this.selection.selected]);
      this.rowSelected.emit([...this._selectedRows]);
    }else{
      this.rowAllSelected.emit([...this.selection.selected]);
    }
  }

  clearSelection(): void {
    this.selection.clear();
    this._selectedRows.clear();
    this.rowSelected.emit([]);
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
      this.showExpanded.emit(element);
    } else {
      this.hideExpanded.emit(element);
    }
  }

  ngOnDestroy(): void {
    // Clean up components and views to prevent memory leaks
    this.embeddedViews.forEach((view) => view.destroy());
  }
}
