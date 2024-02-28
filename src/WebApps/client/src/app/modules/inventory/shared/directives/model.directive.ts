import { Directive, HostListener, Input } from "@angular/core";
import { ModelAddEditComponent } from "../pages/model-page/model-add-edit-modal/model-add-edit.component";
import { ModalService } from "@core/services/modal.service";


@Directive({
  selector: '[appModelAddEdit]',
  standalone: true
})
export class ModelAddEditDirective {
  @Input() resultModalHandler!: Function;
  @Input() params = {};
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.openModalCustom(ModelAddEditComponent);
    modalRef.componentInstance.params = this.params || {};
    modalRef.result.then((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }
}

