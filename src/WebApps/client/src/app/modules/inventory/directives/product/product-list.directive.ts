import { Directive, HostListener, Input } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { ProductAddEditModalComponent } from '@inventory/components/product/product-add-edit-modal/product-add-edit-modal.component';



@Directive({
  selector: '[appProductAddEdit]',
  standalone: true
})
export class ProductAddEditDirective {
  @Input() resultModalHandler!: Function;
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.openModalCustom(ProductAddEditModalComponent, {
      size: 'xl',
    });
    modalRef.result.then((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }
}


