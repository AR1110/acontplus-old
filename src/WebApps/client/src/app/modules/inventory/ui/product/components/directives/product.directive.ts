import { Directive, HostListener, output } from '@angular/core';
import { AddEditProduct } from '@inventory/ui/product/components/add-edit-product/add-edit-product';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appProductAddEdit]',
})
export class ProductAddEditDirective {
  resultModalHandler = output<any>();
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(AddEditProduct, {
      size: 'xl',
    });
    modalRef.subscribe((result: any) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler.emit(result);
      }
    });
  }
  constructor(private modalSvc: DialogService) {}
}
