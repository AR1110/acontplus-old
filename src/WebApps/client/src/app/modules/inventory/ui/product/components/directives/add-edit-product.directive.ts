import { Directive, HostListener, inject, input, output } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AddEditProductDialogComponent } from '@inventory/ui/product/components/add-edit-product-dialog/add-edit-product-dialog.component';

@Directive({
  selector: '[appAddEditProduct]',
})
export class AddEditProductDirective {
  onResult = output<any>();
  private dialogSvc = inject(DialogService);

  data = input();
  id = input(0);

  @HostListener('click') onClick() {
    let data: unknown = {};
    if (this.data() && typeof this.data() === 'object') {
      data = this.data();
    }

    if (this.id() > 0) {
      data.id = this.id();
    }

    const modalRef = this.dialogSvc.open(AddEditProductDialogComponent, {
      size: 'xl',
      data,
    });
    modalRef.subscribe((result: unknown) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
