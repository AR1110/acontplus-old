import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  OnInit,
  AfterViewInit,
  OnChanges,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pagination } from '@acontplus/ng-components';

@Component({
  selector: 'app-product-search-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  templateUrl: './product-search-list.component.html',
  styleUrl: './product-search-list.component.scss',
})
export class ProductSearchListComponent implements OnInit, AfterViewInit, OnChanges {
  readonly tableData = input<any[]>([]);

  @Input() highlightRowIndex!: number;

  isLoadingResults = input(false);
  readonly isRateLimitReached = input(false);
  @Input() pagination!: Pagination;

  handlePageEvent = output<PageEvent>();

  rowsEmitter = output<QueryList<ViewContainerRef>>();
  @ViewChildren(MatRow, { read: ViewContainerRef })
  rows!: QueryList<ViewContainerRef>;
  @ViewChild(MatSort) sort!: MatSort;

  rowSelected = output<any>();
  onClickPaginator = output<void>();

  dataSource = signal<any[]>([]);

  visibleColumns: string[] = [];
  mainColumns = [
    { columnDef: 'index', header: 'No.' },
    { columnDef: 'code', header: 'Código' },
    { columnDef: 'imageUrl', header: 'Img' },
    { columnDef: 'description', header: 'Descripción' },
    { columnDef: 'stock', header: 'Stock' },
    { columnDef: 'vat', header: 'Iva' },
    { columnDef: 'subFamily', header: 'SubFamilia' },
    { columnDef: 'measure', header: 'Medida' },
    // { columnDef: 'marca', header: 'Marca', },
  ];
  columns = structuredClone(this.mainColumns);

  productTarifas = signal<any>([]);

  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    this.visibleColumns = this.columns.map((x) => x.columnDef);
  }

  ngAfterViewInit() {
    this.rowsEmitter.emit(this.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']?.currentValue) {
      this.columns = structuredClone(this.mainColumns);
      this.visibleColumns = this.columns.map((x) => x.columnDef);
      this.pagination.totalRecords = 0;

      if (this.tableData().length > 0) {
        const dataResult = this.tableData()[0];
        this.productTarifas.set(dataResult.prices);
        this.pagination.totalRecords = dataResult.totalRecords;
      }

      for (const item of this.productTarifas()) {
        this.columns.push({
          header: item.name,
          columnDef: item.name,
        });
      }

      this.visibleColumns = this.columns.map((x) => x.columnDef);
      this.makeDynamicTarifa(this.tableData());
    }
  }

  makeDynamicTarifa(results: any) {
    const mapped = results.map((item: any) => {
      const { prices, ...restItem } = item;
      const tarifasObj = prices.reduce((obj: any, item: any) => {
        obj[item.name] = item.price;
        return obj;
      }, {});
      return {
        ...restItem,
        ...tarifasObj,
      };
    });
    this.dataSource.set(mapped);
  }

  onPageEvent(event: PageEvent) {
    this.handlePageEvent.emit(event);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pagination.pageSizeOptions = setPageSizeOptionsInput.split(',').map((str) => +str);
    }
  }

  selectRow(row: any): void {
    this.rowSelected.emit(row); // this.selection.selected
  }

  sortData($event: any) {
    this.highlightRowIndex = -1;
  }
}
