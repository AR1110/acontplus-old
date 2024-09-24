import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { ProductHistPurchaseModalComponent } from '@modules/inventory/components/product/product-hist-purchase-modal/product-hist-purchase-modal.component';

@Directive({
  selector: '[appProductHistPurchase]',
  standalone: true
})
export class ProductHistPurchaseDirective {

  private modalSvc = inject(ModalService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(ProductHistPurchaseModalComponent, {
      size: 'xl'
    });
    modalRef.componentInstance.params = this.params() || {};
    modalRef.result.then((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }

}
