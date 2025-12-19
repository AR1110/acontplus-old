import { Directive, HostListener, inject, input, output } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AddEditProduct } from '@inventory/ui/product/components/add-edit-product/add-edit-product';

@Directive({
  selector: '[appAddEditProduct]',
})
export class AddEditProductDirective {
  onResult = output<any>();
  private dialogSvc = inject(DialogService);

  data = input();
  id = input(0);

  @HostListener('click') onClick() {
    let data: any = {};
    if (this.data() && typeof this.data() === 'object') {
      data = this.data();
    }

    if (this.id() > 0) {
      data.id = this.id();
    }

    const modalRef = this.dialogSvc.open(AddEditProduct, {
      size: 'xl',
      data,
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
