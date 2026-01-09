import { Directive, HostListener, inject, input, output } from '@angular/core';
import { TagsAddEdit } from '@inventory/ui/tags/tags-add-edit/tags-add-edit';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appTagsAddEditModal]',
})
export class TagsAddEditModalDirective {
  private dialogSvc = inject(DialogService);
  onResult = output<any>();
  params = input({});

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
    const modalRef = this.dialogSvc.open(TagsAddEdit, {
      data: structuredClone(this.params()) || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
