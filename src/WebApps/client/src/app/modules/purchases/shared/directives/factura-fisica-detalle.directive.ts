import { Directive, HostListener, inject, input } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { FacturaFisicaDetalleModalComponent } from '@purchases/ui/factura-fisica/components/factura-fisica-detalle-modal/factura-fisica-detalle-modal.component';

@Directive({
  selector: '[appFacturaFisicaDetalle]',
})
export class FacturaFisicaDetalleDirective {
  private modalSvc = inject(DialogService);

  id = input(0);

  @HostListener('click') onClick() {
    this.modalSvc.open(FacturaFisicaDetalleModalComponent, {
      size: 'xl',
      data: {
        id: this.id(),
      },
    });
  }
}
