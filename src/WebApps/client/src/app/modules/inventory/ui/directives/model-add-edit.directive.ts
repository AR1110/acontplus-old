import { Directive, HostListener, inject, input,   output } from "@angular/core";
import { ModelAddEditComponent } from "@inventory/ui/inv-model-page/model-add-edit-modal/model-add-edit.component";
import {DialogService} from "@core/services/dialog.service";


@Directive({
  selector: '[appModelAddEdit]',
})
export class ModelAddEditDirective {
  private _dialogSvc = inject(DialogService)
  onResult = output<any>();
  params = input({});

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
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

