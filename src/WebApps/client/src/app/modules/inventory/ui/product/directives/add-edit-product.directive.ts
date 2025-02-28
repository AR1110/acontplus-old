import {Directive, HostListener, inject , output} from "@angular/core";
import {DialogService} from "@core/services/dialog.service";
import {
  AddEditProductDialogComponent
} from "@inventory/ui/product/components/add-edit-product-dialog/add-edit-product-dialog.component";

@Directive({
  selector: '[appAddEditProduct]',
  standalone: true
})
export class AddEditProductDirective {
  onResult = output<any>();
  private dialogSvc = inject(DialogService);
  @HostListener('click') onClick() {
    const modalRef = this.dialogSvc.open(AddEditProductDialogComponent, {
      size: 'xl',
    });
    modalRef.subscribe((result: unknown) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

