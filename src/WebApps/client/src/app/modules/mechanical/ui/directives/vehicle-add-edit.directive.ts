import { Directive, HostListener, inject, input, output } from '@angular/core';
import { VehicleAddEditModalComponent } from '@mechanical/ui/components/vehicle-add-edit-modal/vehicle-add-edit-modal.component';

import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appVehicleAddEdit]',
})
export class VehicleAddEditDirective {
  dialogSvc = inject(DialogService);
  resultModalHandler = output<any>();
  params = input({});
  @HostListener('click', ['$event']) onClick($event: Event) {
    $event.stopPropagation();
    const modalRef = this.dialogSvc.open(VehicleAddEditModalComponent, {
      size: 'xl',
      data: this.params() || {},
    });

    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.resultModalHandler.emit(result);
      }
    });
  }
}
