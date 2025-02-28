import { Directive, HostListener, inject, input,  output } from "@angular/core";
import { SubCategoryDialogComponent } from "@inventory/ui/sub-category/components/sub-category-dialog/sub-category-dialog.component";
import {DialogService} from "@core/services/dialog.service";

@Directive({
  selector: '[appSubCategoryModal]',
  standalone: true
})
export class SubCategoryModalDirective {
   onResult = output<any>();
    params = input({});
    private dialogSvc = inject(DialogService);

  @HostListener('click') onClick() {
    const modalRef = this.dialogSvc.open(SubCategoryDialogComponent, {
      data: this.params() || {}
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object' && result.isRefresh) {
        this.onResult.emit(result);
      }
    })
  }
}
