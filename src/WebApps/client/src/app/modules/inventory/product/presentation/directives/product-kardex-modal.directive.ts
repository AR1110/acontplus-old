import { Directive, HostListener, inject, input, output } from '@angular/core';
import { OpenModalProductService } from '@inventory/product/application/services/open-modal-product.service';

@Directive({
  selector: '[appProductKardexModal]',
  standalone: true
})
export class ProductKardexModalDirective {
  private openModalProductSvc = inject(OpenModalProductService)
  onResult = output<any>();
  params = input({} as any);

  @HostListener('click') onClick() {
    let params = {
      id: this.params().idArticulo
    }
    this.openModalProductSvc.openKardex(params)
  }

}
