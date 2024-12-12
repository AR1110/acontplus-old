import { Directive, HostListener, inject, input, Input, output } from "@angular/core";

import { ModalService } from "@core/services/modal.service";
import { ModelAddEditComponent } from "@inventory/ui/modelo/model-add-edit-modal/model-add-edit.component";


@Directive({
  selector: '[appModelAddEdit]',
  standalone: true
})
export class ModelAddEditDirective {
  private modalSvc = inject(ModalService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(ModelAddEditComponent);
    modalRef.componentInstance.params = this.params() || {};
    modalRef.result.then((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

