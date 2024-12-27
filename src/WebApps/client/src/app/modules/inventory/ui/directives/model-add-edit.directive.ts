import { Directive, HostListener, inject, input, Input, output } from "@angular/core";

import { ModalService } from "@core/services/modal.service";
import { ModelAddEditComponent } from "@inventory/ui/inv-model-page/model-add-edit-modal/model-add-edit.component";
import {DialogService} from "@core/services/dialog.service";


@Directive({
  selector: '[appModelAddEdit]',
  standalone: true
})
export class ModelAddEditDirective {
  private _dialogSvc = inject(DialogService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this._dialogSvc.open(ModelAddEditComponent, {
      data: this.params() || {}
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

