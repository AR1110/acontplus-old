import { Directive, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { ProductSearchPopupComponent } from '@inventory/product/presentation/components/product-search-popup/product-search-popup.component';
import {DialogService} from "@core/services/dialog.service";

@Directive({
  selector: '[appProductSearchPopup]',
})
export class ProductSearchPopupDirective {

  private modalSvc = inject(DialogService)
  @Output() onSelectedRow = new EventEmitter();
  @Input() searchPurchase = false;
  @Input() searchSale = false;
  @Input() textSearch = null as string | null;

  @HostListener('keydown.enter')
  onEnter() {
    console.log('this')
    this.openPopup()
  }

  openPopup() {
    const modalRef = this.modalSvc.open(ProductSearchPopupComponent, {

      size: 'xl',
      data:  {
        searchPurchase: this.searchPurchase,
        searchSale: this.searchSale,
        textSearch: this.textSearch
      }
    })
    modalRef.subscribe(result => {
      if (result !== null && typeof result === 'object') {
        this.onSelectedRow.emit(result)
      }
    })
  }
}
