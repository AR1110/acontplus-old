import { Directive, EventEmitter, HostListener, inject, input, Input, output, Output } from '@angular/core';
import { VehicleAddEditModalComponent } from '@mechanical/ui/components/vehicle-add-edit-modal/vehicle-add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appVehicleAddEdit]',
  standalone: true
})
export class VehicleAddEditDirective {

  dialogSvc = inject(DialogService)
   resultModalHandler  = output<any>();
    params  =input({});
  @HostListener('click') onClick() {
    const modalRef = this.dialogSvc.open(VehicleAddEditModalComponent, {
      size: 'xl',
      data: this.params() || {}
    });


    modalRef.subscribe(result=>{
      if(result && typeof result==='object'){
        this.resultModalHandler.emit(result);

      }
    })
  }

}
