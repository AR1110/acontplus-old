import { Directive, HostListener, Input } from "@angular/core";
import { ModalService } from "@core/services/modal.service";
import { MeasureAddEditModalComponent } from "@modules/inventory/components/measure-add-edit-modal/measure-add-edit-modal.component";

@Directive({
  selector: '[appMeasureAddEdit]',
  standalone: true
})
export class MeasureAddEditDirective {

    @Input() resultModalHandler!: Function;
    @Input() params = {};
    @HostListener('click') onClick() {
      const modalRef = this.modalSvc.openModalCustom(MeasureAddEditModalComponent);
      modalRef.componentInstance.params = this.params || {};
      modalRef.result.then((result: unknown) => {
        if (this.resultModalHandler && typeof result === 'object') {
          this.resultModalHandler(result);
        }
      })
    }
    constructor(private modalSvc: ModalService) { }

}
