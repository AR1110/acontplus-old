import { Component, inject, OnInit, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrinterRead } from '@modules/config/data/models/printer.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PrinterAddEditModalComponent } from '@modules/config/ui/printer/components/printer-add-edit-modal/printer-add-edit-modal.component';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { PrinterUseCase } from '@modules/config/application/use-cases/printer.use-case';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-printer-page',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    Button,
    DynamicCard,
  ],
  templateUrl: './printer.component.html',
  styles: ``,
})
export class PrinterComponent implements OnInit {
  private readonly _printerUseCase = inject(PrinterUseCase);
  private readonly _modalService = inject(DialogService);
  private readonly _tS = inject(ToastrNotificationService);

  printers = signal<PrinterRead[]>([]);

  openModalNewOrEdit(item?: PrinterRead) {
    const modalRef = this._modalService.open(PrinterAddEditModalComponent, {
      size: 'xl',
      data: {
        data: structuredClone(item) || {},
        printers: structuredClone(this.printers()),
      },
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getPrinters();
      }
    });
  }

  getPrinters() {
    this.printers.set([]);
    this._printerUseCase.getPrinters().subscribe((response) => {
      this.printers.set(response.printers);
    });
  }

  ngOnInit() {
    this.getPrinters();
  }

  commonResponse = (response: ApiResponseLegacy) => {
    this.getPrinters();
    this._tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
  };
  async askToDelete(item: PrinterRead) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Está seguro de eliminar esta impresora?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar',
      allowOutsideClick: false,
    });
    if (isConfirmed) {
      this._printerUseCase.removePrinter(item.id).subscribe(this.commonResponse);
    }
  }

  updateStatus(item: PrinterRead) {
    this._printerUseCase.updateStatus(item.id, item).subscribe(this.commonResponse);
  }
}
