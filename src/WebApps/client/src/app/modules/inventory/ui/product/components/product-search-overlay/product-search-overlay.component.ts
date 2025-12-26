import { OverlayModule } from '@angular/cdk/overlay';

import {
  Component,
  HostListener,
  inject,
  QueryList,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { isValidField } from '@core/utils/utils';
import { Pagination } from '@acontplus/ng-components';
import { debounceTime, distinctUntilChanged, finalize, map, of, Subject, switchMap } from 'rxjs';

import { ProductSearchListComponent } from '@inventory/ui/product/components/product-search-list/product-search-list.component';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { MatInputModule } from '@angular/material/input';
import { catchError, takeUntil } from 'rxjs/operators';
import { MatIconButton } from '@angular/material/button';
import { AddEditProductDirective } from '@inventory/ui/product/components/directives/add-edit-product.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-search-overlay',
  imports: [
    OverlayModule,
    ReactiveFormsModule,
    MatInputModule,
    ProductSearchListComponent,
    MatIcon,
    MatIconButton,
    AddEditProductDirective,
  ],
  templateUrl: './product-search-overlay.component.html',
  styleUrl: './product-search-overlay.component.scss',
})
export class ProductSearchOverlayComponent implements OnInit, OnDestroy {
  readonly searchSale = input(false);

  readonly overlayHasFocus = input(true);
  optionSelected = output();
  resultRegistered = output<any>();

  dataSource = signal<any>([]);

  _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  private searchTerms = new Subject<any>();
  private destroy$ = new Subject<void>();

  highlightRowIndex = -1;
  isOverlayOpen = false;
  focusedInput = false;
  clickedPaginator = false;

  productTarifas = signal<any>([]);

  pagination = new Pagination();

  isLoadingResults = signal(false);
  isRateLimitReached = signal(false);

  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  dataSearch = {
    textSearch: '',
  };

  rows = signal<any>([]);

  currentOption: any;

  showPrefix = input(false);

  constructor() {
    this.setupSearchListener();
  }

  ngOnInit() {
    this.pagination.pageIndex = 0;
  }

  applyFilter(value: string) {
    this.dataSearch.textSearch = value;
    // if ($event && (["ArrowDown", "ArrowUp", "Enter", 'ArrowLeft', 'ArrowRight'].includes($event.key))) return

    this.dataSource.set([]);
    const text = this.dataSearch.textSearch.trim();
    if (!isValidField(text)) {
      this.closeOverlay();
      return;
    }

    if (text.length <= 1) {
      this.closeOverlay();
      return;
    }

    this.search();
  }

  setupSearchListener() {
    this.searchTerms
      .pipe(
        debounceTime(400), // ⏳ Espera antes de llamar al API
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        switchMap((params) => {
          this.isLoadingResults.set(true);
          this.highlightRowIndex = -1;
          this.productTarifas.set([]);

          return this._PRODUCT_SERVICE.search(params).pipe(
            map((response: any) => {
              this.isRateLimitReached.set(response.length === 0);
              return this.isRateLimitReached() ? [] : response;
            }),
            catchError((err) => {
              console.error(err);
              this.isRateLimitReached.set(true);
              return of([]);
            }),
            finalize(() => this.isLoadingResults.set(false)),
          );
        }),
        takeUntil(this.destroy$), // 👈 Cancela al destruir componente
      )
      .subscribe((response) => {
        this.openOverlay();
        const results = structuredClone(response);
        this.dataSource.set(results);
      });
  }

  search() {
    const params = {
      textSearch: this.dataSearch.textSearch,
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize,
    };
    this.searchTerms.next(params);
  }

  makeDynamicTarifa(results: any) {
    this.dataSource = results.map((item: any) => {
      const { tarifas, ...restItem } = item;
      const tarifasObj = tarifas.reduce((obj: any, item: any) => {
        obj[item.tarifa] = item.precio;
        return obj;
      }, {});
      return {
        ...restItem,
        ...tarifasObj,
      };
    });
  }

  handleRows(rows: QueryList<ViewContainerRef>) {
    this.rows.set(rows);
  }

  showElement(index: number, height: number): void {
    const row = this.rows().toArray()[index];

    if (row != null) {
      const rect = row.element.nativeElement.getBoundingClientRect();
      if (rect.y <= 0 || rect.y + rect.height > height) {
        row.element.nativeElement.scrollIntoView(false, {
          behavior: 'instant',
        });
      }
      return;
    }
  }

  onHighlightedRowChange(event: KeyboardEvent): void {
    let focused = this.dataSource()[this.highlightRowIndex];
    const x: number = this.dataSource().indexOf(focused);
    const l: number = this.dataSource().length;
    if (event.keyCode === 38) {
      // Up
      if (x > 0) {
        focused = this.dataSource()[x - 1];
      }
    } else if (event.keyCode === 40) {
      // Down
      if (x < l - 1) {
        focused = this.dataSource()[x + 1];
      }
    }
    if (focused != null) {
      this.showElement(this.highlightRowIndex, 35);
    }
  }

  checkValue(): void {
    console.log(' ');
  }

  onFocus($event: any) {
    this.focusedInput = true;
    $event.stopPropagation();
    if (isValidField(this.dataSearch.textSearch)) {
      this.openOverlay();
    }
  }

  onBlur(ev: any) {
    this.focusedInput = false;
    //this.closeOverlay()
  }

  handleKeyDown(event: KeyboardEvent) {
    // Verificar si se presionó una tecla de desplazamiento hacia la izquierda o hacia la derecha
    if (this.isOverlayOpen && event.key === 'Tab') {
      this.closeOverlay();
    }
  }

  backdropClick() {
    if (this.focusedInput) return;

    if (this.clickedPaginator) return;
    this.focusedInput = false;
    this.closeOverlay();
  }

  /**
   * Navigate between options in overlay and highlight the one that has keydown.arrowdown
   * @param event
   */
  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (this.overlayHasFocus() && this.highlightRowIndex < this.dataSource().length - 1) {
      this.highlightRowIndex += 1;

      this.onHighlightedRowChange(keyboardEvent);
    }
  }

  /**
   * Navigate between options in overlay and highlight the one that has keydown.arrowup
   * @param event
   */
  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (this.overlayHasFocus() && this.highlightRowIndex > 0) {
      this.highlightRowIndex -= 1;
      this.onHighlightedRowChange(keyboardEvent);
    }
  }

  /**
   * Close searchList and select option that is currently highlighted
   * @param event
   */
  @HostListener('keydown.enter', ['$event'])
  onKeyEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isOverlayOpen) {
      if (
        this.overlayHasFocus() &&
        this.highlightRowIndex >= 0 &&
        this.highlightRowIndex < this.dataSource().length
      ) {
        // infrastructure
        this.selectRow(this.dataSource()[this.highlightRowIndex]); // infrastructure
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
    // const searchQueryHasAtLeast2Characters: any = this.dataSearch.textSearch && this.dataSearch.textSearch.toString().length >= 1;
    // console.log(searchQueryHasAtLeast2Characters)
    // console.log("heydownnnnnnnnnnnnnnnnnnnnnn")
    // if (event.key !== 'Enter' && event.key !== 'Tab' && !this.isOverlayOpen && searchQueryHasAtLeast2Characters) {
    //   this.openOverlay();
    // }
  }

  /**
   * Close searchList without selecting any option
   * @param event
   */
  @HostListener('keydown.esc', ['$event'])
  onKeyEsc(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    this.checkValue();
    this.closeOverlay();
  }

  selectRow(row: any, closeOverlay = true): void {
    if (closeOverlay) {
      this.closeOverlay();
    }
    this.currentOption = row;

    console.log('Overlay, selectRow(), currentOption: ' + JSON.stringify(row));
    if (this.searchSale()) {
      this.getDataProductSale(row.idArticulo);
    }
  }

  getDataProductSale(id: number) {
    this.dataSearch.textSearch = '';
    this._PRODUCT_SERVICE
      .getForSale({ id })
      .subscribe((response) => this.optionSelected.emit(response));
  }

  onClickPaginator() {
    this.clickedPaginator = true;
  }

  openOverlay(): void {
    this.isOverlayOpen = true;
    this.highlightRowIndex = -1;
    this.clickedPaginator = false;
    // console.log('--highlightRowIndex = ' + this.highlightRowIndex);
  }

  closeOverlay(): void {
    this.clickedPaginator = false;
    this.isOverlayOpen = false;
    this.highlightRowIndex = -1;
    console.log('closeeeeeeeeeeeeeeee');
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.search();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
