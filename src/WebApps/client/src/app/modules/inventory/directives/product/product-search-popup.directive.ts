import { Directive, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { ProductSearchPopupComponent } from '../../components/product/product-search-popup/product-search-popup.component';

@Directive({
  selector: '[appProductSearchPopup]',
  standalone: true,
})
export class ProductSearchPopupDirective {

  private modalSvc = inject(ModalService)
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
    let modalRef = this.modalSvc.open(ProductSearchPopupComponent, {
      centered: true,
      keyboard: true,
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      searchPurchase: this.searchPurchase,
      searchSale: this.searchSale,
      textSearch: this.textSearch
    }
    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.onSelectedRow.emit(result)
      }
    })
  }
}
