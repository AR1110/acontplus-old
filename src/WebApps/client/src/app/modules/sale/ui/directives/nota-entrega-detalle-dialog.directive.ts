import { Directive,  HostListener, inject, input,   } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { NotaEntregaDetalleDialogComponent } from '@sale/ui/components/nota-entrega-detalle-dialog/nota-entrega-detalle-dialog.component';

@Directive({
  selector: '[appNotaEntregaDetalleDialog]',
  standalone: true
})
export class NotaEntregaDetalleDialogDirective {
  private dialogSvc = inject(DialogService)
  id = input()

  @HostListener('click') onClick() {

    this.dialogSvc.open(NotaEntregaDetalleDialogComponent, {
      size: 'xl',
      data: {
        id: this.id()
      }
    });

  }
}
