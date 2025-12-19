import { Directive, HostListener, inject, input, output } from '@angular/core';
import { SubCategoryAddEdit } from '@inventory/ui/sub-category/components/sub-category-add-edit/sub-category-add-edit';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appSubCategory]',
})
export class SubCategoryModalDirective {
  onResult = output<any>();
  params = input({});
  private dialogSvc = inject(DialogService);

  @HostListener('click',  ['$event']) onClick($event:MouseEvent) {
    $event.stopPropagation();
    const modalRef = this.dialogSvc.open(SubCategoryAddEdit, {
      data: this.params() || {},
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object' && result.isRefresh) {
        this.onResult.emit(result);
      }
    });
  }
}
