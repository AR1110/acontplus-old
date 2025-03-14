import { Directive, HostListener, inject, input, output } from '@angular/core';
import { TagsAddEditModalComponent } from '@inventory/ui/tags/tags-add-edit-modal/tags-add-edit-modal.component';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appTagsAddEditModal]',
  standalone: true,
})
export class TagsAddEditModalDirective {
  private dialogSvc = inject(DialogService);
  onResult = output<any>();
  params = input({});

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
    const modalRef = this.dialogSvc.open(TagsAddEditModalComponent, {
      data: structuredClone(this.params()) || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
