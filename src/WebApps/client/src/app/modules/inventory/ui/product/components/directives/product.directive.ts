import { Directive, HostListener, output } from '@angular/core';
import { AddEditProductDialogComponent } from '@inventory/ui/product/components/add-edit-product-dialog/add-edit-product-dialog.component';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appProductAddEdit]',
})
export class ProductAddEditDirective {
  resultModalHandler = output<any>();
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
