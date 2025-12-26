import { Directive, HostListener, inject, input, output } from '@angular/core';

import { CompraHabitualHistorialModalComponent } from '@purchases/shared/components/compra-habitual-historial-modal/compra-habitual-historial-modal.component';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appCompraHabitualHistorial]',
})
export class CompraHabitualHistorialDirective {
  private modalSvc = inject(DialogService);
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(CompraHabitualHistorialModalComponent, {
      size: 'xl',
      data: this.params(),
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
