import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ConfigInspectionAddEditComponent } from '@mechanical/ui/components/config-inspection-add-edit-modal/config-inspection-add-edit-modal.componet';

import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appVehicleAddEdit]',
  standalone: true,
})
export class ConfigInspectionAddEditDirective {
  dialogSvc = inject(DialogService);
  resultModalHandler = output<any>();
  params = input({});
  @HostListener('click', ['$event']) onClick($event: Event) {
    $event.stopPropagation();
    const modalRef = this.dialogSvc.open(ConfigInspectionAddEditComponent, {
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
