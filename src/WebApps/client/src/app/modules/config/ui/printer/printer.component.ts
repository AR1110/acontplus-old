import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrinterRead } from '@modules/config/domain/models/printing/printer.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@core/services/modal.service';
import { PrinterAddEditModalComponent } from '@modules/config/ui/printer/components/printer-add-edit-modal/printer-add-edit-modal.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import Swal from 'sweetalert2';
import { PrinterUseCase } from '@modules/config/domain/use-cases/printer.use-case';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-printer-page',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCardContent,
    MatCard,
    ThemeButtonComponent,
  ],
  templateUrl: './printer.component.html',
  styles: ``,
})
export class PrinterComponent implements OnInit {
  private readonly _printerUseCase = inject(PrinterUseCase);
  private readonly _modalService = inject(ModalService);
  private readonly _tS = inject(ToasterService);
  private readonly _cdr = inject(ChangeDetectorRef);

  printers: PrinterRead[] = [];

  openModalNewOrEdit(item?: PrinterRead) {
    const modalRef = this._modalService.open(PrinterAddEditModalComponent, {
      backdrop: 'static',
      size: 'xl',
    });

    let data = {};
    if (item) {
      data = item;
    }
    modalRef.componentInstance.params = {
      data,
      printers: structuredClone(this.printers),
    };
    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getPrinters();
      }
    });
  }

  getPrinters() {
    this.printers = [];
    this._printerUseCase.getPrinters().subscribe((response) => {
      this.printers = response.printers;
      this._cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.getPrinters();
  }

  commonResponse = (response: unknown) => {
    this.getPrinters();
    if (isApiResponse(response)) {
      this._tS.toastr({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
    }
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
      this._printerUseCase
        .removePrinter(item.id)
        .subscribe(this.commonResponse);
    }
  }

  updateStatus(item: PrinterRead) {
    this._printerUseCase
      .updateStatus(item.id, item)
      .subscribe(this.commonResponse);
  }
}
