import { CommonModule, } from '@angular/common';
import { Component, HostListener, inject, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRow, MatTableModule } from '@angular/material/table';
import { ProductService } from '@modules/inventory/services/product.service';
import { NgbActiveModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'; 
import { map } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { isValidField } from '@core/utils/utils';
import { hideLoader, showLoader } from '@core/utils/loader';
import { Pagination } from '@shared/models/pagination.model';
@Component({
  selector: 'app-product-search-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgbPopoverModule
  ],
  templateUrl: './product-search-popup.component.html',
  styleUrl: './product-search-popup.component.scss',
})
export class ProductSearchPopupComponent {
  @Input() params = {
    textSearch: '',
    searchPurchase: false,
    searchSale: false

  }
  modal = inject(NgbActiveModal)

  productSvc = inject(ProductService)
  dataSearch = {
    textSearch: ''
  }

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
    { columnDef: 'marca', header: 'Marca', },
  ]
  columns = structuredClone(this.mainColumns)

  dataSource: any[] = [];

  productTarifas: any = [];

  pagination = new Pagination()

  pageEvent!: PageEvent;

  highlightRowIndex: number = -1;
  overlayHasFocus: boolean = true;
  isOverlayOpen: boolean = false;

  currentOption: any;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  KEY_STORAGE_DATA_PRODUCT_SEARCH = 'KEY_STORAGE_DATA_PRODUCT_SEARCH'

  @ViewChildren(MatRow, { read: ViewContainerRef }) rows!: QueryList<ViewContainerRef>;

  ngOnInit(): void {
    this.pagination.pageIndex = 0;
    if (isValidField(this.dataSearch.textSearch)) {
      this.search()
      return
    }

    let getDataPersist = sessionStorage.getItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH)
    if (getDataPersist) {
      let dataPersist = JSON.parse(getDataPersist)
      this.pagination = dataPersist.pagination;
      this.dataSearch = dataPersist.dataSearch;
      if (this.params.textSearch) {
        this.dataSearch.textSearch = this.params.textSearch
      }
      this.dataSource = dataPersist.dataSource;
      this.productTarifas = dataPersist.productTarifas;
      this.columns = dataPersist.columns;
    }
    this.displayedColumns = this.columns.map(x => x.columnDef);
  }

  applyFilter($event?: any) {
    if ($event && (["ArrowDown", "ArrowUp", "Enter", 'ArrowLeft', 'ArrowRight'].includes($event.key))) return

    if (!isValidField(this.dataSearch.textSearch.trim())) return

    this.search()

  }

  search() {
    let params = {
      textSearch: this.dataSearch.textSearch,
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize
    }

    this.highlightRowIndex = -1;
    this.productTarifas = [];
    this.isLoadingResults = true;

    this.productSvc.search(params).pipe(
      map((response: any) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = response.length === 0;

        if (this.isRateLimitReached) {
          return [];
        }
        return response;
      })
    )

      .subscribe({
        next: (response) => {
          let results = structuredClone(response);

          this.columns = structuredClone(this.mainColumns)
          this.displayedColumns = this.columns.map(x => x.columnDef);
          this.pagination.totalRecords = 0;

          if (results.length > 0) {
            let dataResult = results[0];
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
          this.makeDynamicTarifa(results)

        },
        error: (err) => {
          this.isLoadingResults = false;
          console.log(err)
        },
      })
  }

  makeDynamicTarifa(results: any) {
    this.dataSource = results.map((item: any) => {
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
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.search()
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pagination.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }


  showElement(index: number, height: number): void {
    const row = this.rows.toArray()[index];

    if (row != null) {
      const rect = row.element.nativeElement.getBoundingClientRect();
      if ((rect.y <= 0) || ((rect.y + rect.height) > height)) {
        row.element.nativeElement.scrollIntoView(false, { behavior: 'instant' });
      }
      return;
    }
    console.log('not found');
  }

  onHighlightedRowChange(event: KeyboardEvent): void {

    let focused = this.dataSource[this.highlightRowIndex];
    const x: number = this.dataSource.indexOf(focused);
    const l: number = this.dataSource.length;
    if (event.keyCode === 38) { // Up
      if (x > 0) {
        focused = this.dataSource[x - 1];
      }
    } else if (event.keyCode === 40) { // Down
      if (x < l - 1) {
        focused = this.dataSource[x + 1];
      }
    }
    if (focused != null) {
      this.showElement(this.highlightRowIndex, 35);
    }
  }

  /**
   * Navigate between options in overlay and highlight the one that has keydown.arrowdown
   * @param event
   */
  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent): void { 
    if (this.overlayHasFocus && this.highlightRowIndex < (this.dataSource.length - 1)) { 
     
        this.highlightRowIndex += 1; 
       
      this.onHighlightedRowChange(event)
    }
  }

  /**
   * Navigate between options in overlay and highlight the one that has keydown.arrowup
   * @param event
   */
  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent): void {

    if (this.overlayHasFocus && this.highlightRowIndex > 0) {
      this.highlightRowIndex -= 1;
      this.onHighlightedRowChange(event) 
    }
  }

  /**
   * Close searchList and select option that is currently highlighted
   * @param event
   */
  @HostListener('keydown.enter', ['$event'])
  onKeyEnter(event: KeyboardEvent): void {

    if (this.isOverlayOpen) {
      if (this.overlayHasFocus && this.highlightRowIndex >= 0 && this.highlightRowIndex < this.dataSource.length) { // data
        this.selectRow(this.dataSource[this.highlightRowIndex]); // data
      }
    } else {
      this.openOverlay();
    }
  }

  /**
   * open searchList when user is typing
   * @param event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    const searchQueryHasAtLeast2Characters: any = this.dataSearch.textSearch && this.dataSearch.textSearch.toString().length >= 1;

    if (event.key !== 'Enter' && event.key !== 'Tab' && !this.isOverlayOpen && searchQueryHasAtLeast2Characters) {
      this.openOverlay();
    }
  }

  /**
   * Close searchList without selecting any option
   * @param event
   */
  @HostListener('keydown.esc', ['$event'])
  onKeyEsc(event: KeyboardEvent): void {

    this.closeOverlay();
  }

  selectRow<T extends { idArticulo: number }>(row: T, closeOverlay: boolean = true): void {

    if (closeOverlay) {
      this.closeOverlay();
    }
    this.currentOption = row;

    console.log('Overlay, selectRow(), currentOption: ' + JSON.stringify(row));
    if (this.params.searchSale) {
      this.getDataProductSale(row.idArticulo);
    }

  }

  getDataProductSale(id: number) {
    try {
      showLoader()
      this.productSvc.getForSale(id).subscribe({
        next: (response) => {
          hideLoader()
          this.modal.close(response)
        },
        error: (err) => {
          hideLoader();
          console.log(err)
        },
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }


  openOverlay(): void {
    this.isOverlayOpen = true;
   // this.highlightRowIndex = -1;
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.highlightRowIndex = -1;
  }

  onMouseEnter(index: number) {
    this.highlightRowIndex = index;
  }


  ngOnDestroy(): void {
    let persistSearch = {
      pagination: this.pagination,
      dataSearch: this.dataSearch,
      dataSource: this.dataSource,
      productTarifas: this.productTarifas,
      columns: this.columns
    }
    if (this.dataSource.length > 0) {
      sessionStorage.setItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH, JSON.stringify(persistSearch))
    } else {
      sessionStorage.removeItem(this.KEY_STORAGE_DATA_PRODUCT_SEARCH)

    }

  }

}


