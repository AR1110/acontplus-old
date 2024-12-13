import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ModalService } from '@core/services/modal.service';

import { CompraHabitualHistorialModalComponent } from '@purchase/ui/shared/components/compra-habitual-historial-modal/compra-habitual-historial-modal.component';

@Directive({
  selector: '[appCompraHabitualHistorial]',
  standalone: true
})
export class CompraHabitualHistorialDirective {

  private modalSvc = inject(ModalService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(CompraHabitualHistorialModalComponent, {
      size: 'xl'
    });
    modalRef.componentInstance.params = this.params() || {};
    modalRef.result.then((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }

}
