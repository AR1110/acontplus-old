import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { MeasureAddEditModalComponent } from "@inventory/ui/measure-page/measure-add-edit-modal/measure-add-edit-modal.component";
import { MeasureRead } from "../../domain/models/measure.model";
import {DialogService} from "@core/services/dialog.service";

@Directive({
  selector: '[appMeasureAddEdit]',
  standalone: true
})
export class MeasureAddEditDirective {


    @Output() onResultModal = new EventEmitter();
    @Input() params = {} as MeasureRead;
    @Input() id  = 0;
    @HostListener('click') onClick() {
      const modalRef = this._dialogSvc.open(MeasureAddEditModalComponent, {
        data: {
          ...this.params,
          id: this.params.idMedida
        }
      });
      modalRef.subscribe((result: unknown) => {
        if (this.onResultModal && typeof result === 'object') {
          this.onResultModal.emit(result);
        }
      })
    }
    constructor(private _dialogSvc: DialogService) { }

}
