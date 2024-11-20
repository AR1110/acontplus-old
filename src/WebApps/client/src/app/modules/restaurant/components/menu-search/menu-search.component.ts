import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input, output, QueryList, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { isValidField } from '@core/utils/utils';
import { MenuService } from '@modules/restaurant/services/menu.service';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { Pagination } from '@shared/models/pagination.model';
import { map, Subject } from 'rxjs';
import { MenuSearchListComponent } from '../menu-search-list/menu-search-list.component';

@Component({
    selector: 'app-menu-search',
    imports: [
        CommonModule,
        OverlayModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        ClickOutsideDirective,
        MenuSearchListComponent
    ],
    templateUrl: './menu-search.component.html',
    styleUrl: './menu-search.component.scss'
})
export class MenuSearchComponent { 

  @Input() overlayHasFocus: boolean = true;
  optionSelected = output();

  dataSource: any[] = []

  _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  highlightRowIndex: number = -1;
  isOverlayOpen: boolean = false;
  focusedInput = false;
  clickedPaginator = false;

  productTarifas: any = [];

  pagination = new Pagination()

  isLoadingResults = false;
  isRateLimitReached = false;

  menuSvc = inject(MenuService)
  dataSearch = {
    textSearch: ''
  }

  rows: any = []

  currentOption: any;



  ngOnInit() {
    this.pagination.pageIndex = 0;
  }

  applyFilter(value: string) {
    this.dataSearch.textSearch = value; 

    this.dataSource = [];
    let text = this.dataSearch.textSearch.trim();
    if (!isValidField(text)) {
      this.closeOverlay()
      return
    }

    if (text.length <= 1) {
      this.closeOverlay()
      return
    }

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

    this.menuSvc.search(params).pipe(
      map((response) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = response.menus.length === 0;

        if (this.isRateLimitReached) {
          return [];
        }
        return response.menus;
      })
    )

      .subscribe({
        next: (response) => {
          this.openOverlay();
          let results =  structuredClone(response);
          this.dataSource = results;   
          console.log(this.dataSource)
        },
        error: (err) => {
          this.isLoadingResults = false;
          console.log(err)
        },
      })
  }
 

  handleRows(rows: QueryList<ViewContainerRef>) {
    this.rows = rows;
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

  checkValue(): void {
    console.log(' ')
  }

  onFocus($event: any) {
    this.focusedInput = true;
    $event.stopPropagation();
    if (isValidField(this.dataSearch.textSearch)) {
      this.openOverlay()
    }
  }

  onBlur(ev: any) {
    this.focusedInput = false;
    //this.closeOverlay()
  }

  handleKeyDown(event: KeyboardEvent) {
    // Verificar si se presionó una tecla de desplazamiento hacia la izquierda o hacia la derecha
    if (this.isOverlayOpen && (event.key === 'Tab')) {
      this.closeOverlay()
    }
  }

  backdropClick() {
    if (this.focusedInput) return 

    if (this.clickedPaginator) return
    this.focusedInput = false;
    this.closeOverlay()
  }

  /**
    * Navigate between options in overlay and highlight the one that has keydown.arrowdown
    * @param event
    */
  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent): void {
    event.preventDefault();

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
    event.preventDefault();

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
  }

  /**
   * Close searchList without selecting any option
   * @param event
   */
  @HostListener('keydown.esc', ['$event'])
  onKeyEsc(event: KeyboardEvent): void {
    this.checkValue();
    this.closeOverlay();
  }


  selectRow(row: any, closeOverlay: boolean = true): void {

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
    this.search()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.unsubscribe();
  }

}
