import { Directive, HostListener, output } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AddEditProductDialogComponent } from '@inventory/ui/product/components/add-edit-product-dialog/add-edit-product-dialog.component';

@Directive({
  selector: '[appProductList]',
})
export class ProductAddEditDirective {
  resultModalHandler = output<unknown>();
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(AddEditProductDialogComponent, {
      size: 'xl',
    });
    modalRef.subscribe((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler.emit(result);
      }
    });
  }
  constructor(private modalSvc: DialogService) {}
}
