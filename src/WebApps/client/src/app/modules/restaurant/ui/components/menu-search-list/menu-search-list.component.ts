import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatRow,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/models/pagination.model';

@Component({
  selector: 'app-menu-search-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgbPopoverModule,
    MatSortModule,
  ],
  templateUrl: './menu-search-list.component.html',
  styleUrl: './menu-search-list.component.scss',
})
export class MenuSearchListComponent<T> {
  @Input() tableData: any[] = [];

  @Input() highlightRowIndex!: number;
  @Input() isLoadingResults = false;
  @Input() isRateLimitReached = false;
  @Input() pagination!: Pagination;

  @Output() handlePageEvent: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();
  @Output() rowsEmitter: EventEmitter<QueryList<ViewContainerRef>> =
    new EventEmitter<QueryList<ViewContainerRef>>();
  @ViewChildren(MatRow, { read: ViewContainerRef })
  rows!: QueryList<ViewContainerRef>;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() rowSelected = new EventEmitter<T>();
  @Output() onClickPaginator = new EventEmitter<T>();

  dataSource = new MatTableDataSource([]);

  visibleColumns: string[] = [];
  columns = [
    { columnDef: 'position', header: 'No.' },
    { columnDef: 'codigo', header: 'Código' },
    { columnDef: 's3ObjectUrl', header: 'Img' },
    { columnDef: 'title', header: 'Descripción' },
    { columnDef: 'summary', header: 'Resumen' },
    // { columnDef: 'iva', header: 'Iva', },
    // { columnDef: 'subFamilia', header: 'SubFamilia', },
    // { columnDef: 'medida', header: 'Medida', },
    // { columnDef: 'marca', header: 'Marca', },
  ];

  productTarifas: any = [];
  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    this.visibleColumns = this.columns.map((x) => x.columnDef);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.rowsEmitter.emit(this.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && changes['tableData'].currentValue) {
      this.visibleColumns = this.columns.map((x) => x.columnDef);
      this.pagination.totalRecords = 0;

      if (this.tableData.length > 0) {
        let dataResult = this.tableData[0];
        this.pagination.totalRecords = dataResult.totalRecords;
      }
      this.makeDynamicTarifa(this.tableData);
    }
  }

  makeDynamicTarifa(results: any) {
    this.dataSource = new MatTableDataSource(results);
    this.dataSource.sort = this.sort;
  }

  onPageEvent(event: PageEvent) {
    this.handlePageEvent.emit(event);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pagination.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  selectRow(row: T): void {
    console.log(row);
    this.rowSelected.emit(row); // this.selection.selected
  }

  sortData($event: any) {
    this.highlightRowIndex = -1;
    console.log(this);
  }
}
