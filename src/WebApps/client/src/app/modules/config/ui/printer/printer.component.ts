import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrinterRead } from '@modules/config/domain/models/printing/printer.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@core/services/modal.service';
import { PrinterAddEditModalComponent } from '@modules/config/ui/printer/components/printer-add-edit-modal/printer-add-edit-modal.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrinterUseCase } from '@modules/config/domain/use-cases/printer.use-case';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-printer-page',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    FontAwesomeModule,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './printer.component.html',
  styles: ``,
})
export class PrinterComponent {
  private readonly _printerUseCase = inject(PrinterUseCase);
  private readonly _modalService = inject(ModalService);
  private readonly _tS = inject(ToasterService);

  printers: PrinterRead[] = [];

  openModalNewOrEdit(item?: PrinterRead) {
    let modalRef = this._modalService.open(PrinterAddEditModalComponent, {
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
    });
  }

  ngOnInit() {
    this.getPrinters();
  }

  successResponse = (response: unknown) => {
    this.getPrinters();
    if (isApiResponse(response)) {
      if (response.code === '0') {
        this._tS.toastr({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this._tS.toastr({
          type: 'success',
          message: response.message,
        });
      }
    }
  };
  async askToDelete(item: PrinterRead) {
    let { isConfirmed } = await Swal.fire({
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
        .subscribe(this.successResponse);
    }
  }

  updateStatus(item: PrinterRead) {
    this._printerUseCase
      .updateStatus(item.id, item)
      .subscribe(this.successResponse);
  }
}
