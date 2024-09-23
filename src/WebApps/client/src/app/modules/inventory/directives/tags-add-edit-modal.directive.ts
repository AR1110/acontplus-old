import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { TagsAddEditModalComponent } from '../components/tags-add-edit-modal/tags-add-edit-modal.component';

@Directive({
  selector: '[appTagsAddEditModal]',
  standalone: true
})
export class TagsAddEditModalDirective {

  private modalSvc = inject(ModalService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(TagsAddEditModalComponent);
    modalRef.componentInstance.params = this.params() || {};
    modalRef.result.then((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }

}
