import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/models/pagination.model';

@Component({
    selector: 'app-product-search-list',
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        NgbPopoverModule,
        MatSortModule
    ],
    templateUrl: './product-search-list.component.html',
    styleUrl: './product-search-list.component.scss'
})
export class ProductSearchListComponent<T>   {

  @Input() dataList: any[] = [];

  @Input() highlightRowIndex!: number;
  @Input() isLoadingResults= false;
  @Input() isRateLimitReached = false;
  @Input() pagination!:Pagination

  @Output() handlePageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() rowsEmitter: EventEmitter<QueryList<ViewContainerRef>> = new EventEmitter<QueryList<ViewContainerRef>>();
  @ViewChildren(MatRow, { read: ViewContainerRef }) rows!: QueryList<ViewContainerRef>;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() rowSelected = new EventEmitter<T>();
  @Output() onClickPaginator = new EventEmitter<T>();

  dataSource = new MatTableDataSource([]);


  displayedColumns: string[] = [];
  mainColumns = [
    { columnDef: 'position', header: 'No.', },
    { columnDef: 'codigo', header: 'Código', },
    { columnDef: 's3ObjectUrl', header: 'Img', },
    { columnDef: 'descripcion', header: 'Descripción', },
    { columnDef: 'stock', header: 'Stock', },
    { columnDef: 'iva', header: 'Iva', },
    { columnDef: 'subFamilia', header: 'SubFamilia', },
    { columnDef: 'medida', header: 'Medida', },
    // { columnDef: 'marca', header: 'Marca', },
  ]
  columns = structuredClone(this.mainColumns)


  productTarifas: any = [];




  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    this.displayedColumns = this.columns.map(x => x.columnDef);
  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.rowsEmitter.emit(this.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes["dataList"] && changes["dataList"].currentValue) {
      this.columns = structuredClone(this.mainColumns)
      this.displayedColumns = this.columns.map(x => x.columnDef);
      this.pagination.totalRecords = 0;

      if (this.dataList.length > 0) {
        let dataResult = this.dataList[0];
        this.productTarifas = dataResult.tarifas;
        this.pagination.totalRecords = dataResult.totalRecords;
      }

      for (let item of this.productTarifas) {
        this.columns.push({
          header: item.tarifa,
          columnDef: item.tarifa,
        })
      }


      this.displayedColumns = this.columns.map(x => x.columnDef);
      this.makeDynamicTarifa(this.dataList)
    }
  }



  makeDynamicTarifa(results: any) {
    let mapped = results.map((item: any) => {
      let { tarifas, ...restItem } = item;
      const tarifasObj = tarifas.reduce((obj: any, item: any) => {
        obj[item.tarifa] = item.precio;
        return obj;
      }, {});
      return {
        ...restItem,
        ...tarifasObj
      }
    })
    this.dataSource = new MatTableDataSource(mapped)
    this.dataSource.sort = this.sort;
  }

  onPageEvent(event: PageEvent) {
    this.handlePageEvent.emit(event);
  }


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pagination.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  selectRow(row: T): void {
    this.rowSelected.emit(row); // this.selection.selected
  }

  sortData($event:any){
    this.highlightRowIndex = -1;
  }






}
