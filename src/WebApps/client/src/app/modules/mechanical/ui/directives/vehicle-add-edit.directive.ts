import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { VehicleAddEditModalComponent } from '@mechanical/ui/components/vehicle-add-edit-modal/vehicle-add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';

@Directive({
  selector: '[appVehicleAddEdit]',
  standalone: true
})
export class VehicleAddEditDirective {

  //@Input() resultModalHandler!: <T>(obj: T) => void;
  @Output() resultModalHandler: EventEmitter<any> = new EventEmitter<any>();
  @Input() params = {};
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.openModalCustom(VehicleAddEditModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.params = this.params || {};
    modalRef.result.then((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler.emit(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }

}
