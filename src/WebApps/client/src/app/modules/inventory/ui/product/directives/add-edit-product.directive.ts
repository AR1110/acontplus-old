import {Directive, HostListener, inject , output} from "@angular/core";
import { ProductAddEditModalComponent } from "@inventory/ui/product/components/product-add-edit-modal/product-add-edit-modal.component";
import {DialogService} from "@core/services/dialog.service";

@Directive({
  selector: '[appAddEditProduct]',
  standalone: true
})
export class AddEditProductDirective {
  onResult = output<any>();
  private dialogSvc = inject(DialogService);
  @HostListener('click') onClick() {
    const modalRef = this.dialogSvc.open(ProductAddEditModalComponent, {
      size: 'xl',
    });
    modalRef.subscribe((result: unknown) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

