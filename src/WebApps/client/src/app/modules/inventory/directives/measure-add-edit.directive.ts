import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { ModalService } from "@core/services/modal.service";
import { MeasureAddEditModalComponent } from "@modules/inventory/components/measure-add-edit-modal/measure-add-edit-modal.component";
import { MeasureRead } from "../models/measure.model";

@Directive({
  selector: '[appMeasureAddEdit]',
  standalone: true
})
export class MeasureAddEditDirective {


    @Output() onResultModal = new EventEmitter();
    @Input() params = {} as MeasureRead;
    @Input() id  = 0;
    @HostListener('click') onClick() {
      const modalRef = this.modalSvc.openModalCustom(MeasureAddEditModalComponent);
      modalRef.componentInstance.params = {
        ...this.params,
        id: this.params.idMedida
      };
      modalRef.result.then((result: unknown) => {
        if (this.onResultModal && typeof result === 'object') {
          this.onResultModal.emit(result);
        }
      })
    }
    constructor(private modalSvc: ModalService) { }

}
