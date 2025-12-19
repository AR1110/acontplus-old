import { Directive, HostListener, inject, input, output } from '@angular/core';
import { OpenModalProductService } from '@inventory/domain/services/open-modal-product.service';

@Directive({
  selector: '[appProductKardexModal]',
})
export class ProductKardexModalDirective {
  private openModalProductSvc = inject(OpenModalProductService);
  onResult = output<any>();
  params = input({} as any);

  @HostListener('click') onClick() {
    const params = {
      id: this.params().idArticulo,
    };
    this.openModalProductSvc.openKardex(params);
  }
}
