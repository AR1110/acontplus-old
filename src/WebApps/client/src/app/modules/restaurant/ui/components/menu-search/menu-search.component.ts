import {
  Component,
  HostListener,
  inject,
  Input,
  output,
  QueryList,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { MenuSearchListComponent } from '../menu-search-list/menu-search-list.component';
import { MenuService } from '@restaurant/data/services/menu.service';
import { Pagination } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { isValidField } from '@core/utils/utils';

import { finalize, map, Subject } from 'rxjs';

@Component({
  selector: 'app-menu-search',
  imports: [OverlayModule, ReactiveFormsModule, MenuSearchListComponent],
  templateUrl: './menu-search.component.html',
  styleUrl: './menu-search.component.scss',
})
export class MenuSearchComponent implements OnInit, OnDestroy {
  @Input() overlayHasFocus = true;
  optionSelected = output();

  dataSource: any[] = [];

  _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  highlightRowIndex = -1;
  isOverlayOpen = false;
  focusedInput = false;
  clickedPaginator = false;

  productTarifas: any = [];

  pagination = new Pagination();

  isLoadingResults = signal(false);
  isRateLimitReached = false;

  menuSvc = inject(MenuService);
  dataSearch = {
    textSearch: '',
  };

  rows: any = [];

  currentOption: any;

  ngOnInit() {
    this.pagination.pageIndex = 0;
  }

  applyFilter(value: string) {
    this.dataSearch.textSearch = value;

    this.dataSource = [];
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

  search() {
    const params = {
      textSearch: this.dataSearch.textSearch,
      pageIndex: this.pagination.pageIndex + 1,
      pageSize: this.pagination.pageSize,
    };

    this.highlightRowIndex = -1;
    this.productTarifas = [];
    this.isLoadingResults.set(true);

    this.menuSvc
      .search(params)
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
        map((response) => {
          this.isRateLimitReached = response.menus.length === 0;

          if (this.isRateLimitReached) {
            return [];
          }
          return response.menus;
        }),
      )

      .subscribe({
        next: (response) => {
          this.openOverlay();
          const results = structuredClone(response);
          this.dataSource = results;
          console.log(this.dataSource);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleRows(rows: QueryList<ViewContainerRef>) {
    this.rows = rows;
  }

  showElement(index: number, height: number): void {
    const row = this.rows.toArray()[index];

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
    let focused = this.dataSource[this.highlightRowIndex];
    const x: number = this.dataSource.indexOf(focused);
    const l: number = this.dataSource.length;
    if (event.keyCode === 38) {
      // Up
      if (x > 0) {
        focused = this.dataSource[x - 1];
      }
    } else if (event.keyCode === 40) {
      // Down
      if (x < l - 1) {
        focused = this.dataSource[x + 1];
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

    if (this.overlayHasFocus && this.highlightRowIndex < this.dataSource.length - 1) {
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

    if (this.overlayHasFocus && this.highlightRowIndex > 0) {
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
    if (this.isOverlayOpen) {
      if (
        this.overlayHasFocus &&
        this.highlightRowIndex >= 0 &&
        this.highlightRowIndex < this.dataSource.length
      ) {
        // infrastructure
        this.selectRow(this.dataSource[this.highlightRowIndex]); // infrastructure
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
  onKeyDown(event: Event): void {}

  /**
   * Close searchList without selecting any option
   * @param event
   */
  @HostListener('keydown.esc', ['$event'])
  onKeyEsc(event: Event): void {
    this.checkValue();
    this.closeOverlay();
  }

  selectRow(row: any, closeOverlay = true): void {
    if (closeOverlay) {
      this.closeOverlay();
    }
    this.currentOption = row;
    this.optionSelected.emit(row);
  }

  onClickPaginator() {
    this.clickedPaginator = true;
  }

  openOverlay(): void {
    this.isOverlayOpen = true;
    this.highlightRowIndex = -1;
    this.clickedPaginator = false;
  }

  closeOverlay(): void {
    this.clickedPaginator = false;
    this.isOverlayOpen = false;
    this.highlightRowIndex = -1;
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;
    this.search();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.unsubscribe();
  }
}
