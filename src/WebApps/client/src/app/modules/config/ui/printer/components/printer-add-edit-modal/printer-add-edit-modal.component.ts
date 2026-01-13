import { Component, inject, signal, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import {
  PrinterRead,
  PrinterTypeSelectHtmlOnly,
} from '@modules/config/data/models/printer.model';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrinterDocService } from '@modules/config/services/printer-doc.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { isValidField } from '@core/utils/utils';
import { DOC_TYPE } from '@core/constants/global.constants';
import { PrinterUseCase } from '@modules/config/application/use-cases/printer.use-case';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-printer-add-edit-modal',
  imports: [FormsModule, MatSlideToggleModule, Button, MatCustomDialogComponent],
  templateUrl: './printer-add-edit-modal.component.html',
  styles: ``,
})
export class PrinterAddEditModalComponent implements OnInit {
  params = inject<{
    data: any;
    printers: PrinterRead[];
  }>(MAT_DIALOG_DATA);
  readonly _modalRef = inject(MatDialogRef<PrinterAddEditModalComponent>);
  private readonly _printerUseCase = inject(PrinterUseCase);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _printerDocService = inject(PrinterDocService);

  modalTitle = 'Nueva Impresora';
  modalIcon = 'save';

  localPrinters = signal<any[]>([]);

  estabs = signal<EstablecimientoSelectHtmlOnly[]>([]);
  documents = signal<any[]>([]);
  printerTypes = signal<PrinterTypeSelectHtmlOnly[]>([]);

  data = {
    machine: '',
    establecimientoId: 0,
    ipAddress: '',
    printerTypeId: 0,
    name: '',
    serverDevice: false,
    macAddress: '',
    isDefault: false,
    domain: '',
  };

  successResponsePrinterDoc = (response: ApiResponseLegacy) => {
    this._tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code === '1') {
      this.getDataEdit(false);
    }
  };

  successResponse = (response: ApiResponseLegacy) => {
    this._tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code === '1') {
      this._modalRef.close(response);
    }
  };

  getDataForm(isRegister: boolean) {
    this._printerUseCase.getDataForm().subscribe((response) => {
      this.estabs.set(response.estabs);
      this.printerTypes.set(response.printerTypes);

      if (isRegister) {
        const documents = response.documents.map((item: any) => {
          item.copies = 1;
          return item;
        });
        this.documents.set(documents);
        if (this.estabs().length > 0) {
          this.data.establecimientoId =
            this.estabs().find((e) => e.predeterminado)?.idEstablecimiento ?? 0;
        }
      }
      if (this.estabs.length === 0) {
        this._tS.show({
          type: 'warning',
          message: 'No tienes asignado los establecimientos',
        });
      }
    });
  }

  getLocalPrinters() {
    this._printerUseCase.getLocalPrinters().subscribe({
      next: (response) => {
        this.localPrinters.set(response.localPrinters);
        this.data.machine = this.localPrinters()[0]?.machine;
      },
      error: (err) => {
        console.log(err);
        this._tS.show({
          type: 'warning',
          message:
            'Por favor instale el programa Acontplus Print, para obtener el listado de impresoras',
        });
      },
    });
  }

  getDataEdit(isReload: boolean) {
    this._printerUseCase.getById(this.params.data.id).subscribe((response) => {
      if (isReload) {
        this.data = response.printer;
      }
      this.documents.set(response.documents);
    });
  }

  async ngOnInit() {
    if (this.params.data.id > 0) {
      this.modalTitle = 'Editar Impresora';
      this.modalIcon = 'edit';
      this.getDataForm(false);
      this.getDataEdit(true);
      this.getLocalPrinters();
    } else {
      if (this.params.printers.every((item) => !item.isDefault)) {
        this.data.isDefault = true;
      }
      if (this.params.printers.length > 0) {
        this.data.ipAddress = this.params.printers[0].ipAddress;
        this.data.domain = 'acontplusprint.com';
      }

      this.getDataForm(true);
      this.getLocalPrinters();
    }
  }

  async updateDocument(data: any) {
    if (!data.isActive) {
      data.copies = 1;
    }
    if (this.params.data.id > 0) {
      if (data.id > 0) {
        data.isActive = !data.isActive;
        data.labelisActive = data.isActive ? 'Activa' : 'Inactiva';

        this._printerDocService.put(data.id, data).subscribe(this.successResponsePrinterDoc);
      }

      if (!(data.id > 0)) {
        const params = {
          ...data,
          printerId: this.params.data.id,
        };
        this._printerDocService.post(params).subscribe(this.successResponsePrinterDoc);
      }
    }
  }

  saveEdit() {
    if (!(this.data.establecimientoId > 0)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }
    if (!isValidField(this.data.name)) {
      this._tS.show({
        type: 'warning',
        message: 'Se necesita ingresar el nombre de la Impresora',
      });
      return;
    }
    if (!(this.data.printerTypeId > 0)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Tipo Impresora',
      });
      return;
    }
    if (this.data.serverDevice && (!this.data.macAddress || this.data.macAddress.length == 0)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingreso la dirección Mac del equipo',
      });
      return;
    }
    if (!isValidField(this.data.ipAddress)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese el Ip de la máquina',
      });
      return;
    }
    if (this.documents().every((item) => !item.isActive)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione al menos un documento',
      });
      return;
    }

    let codDoc = '';
    if (this.documents().some((item) => item.codDoc === DOC_TYPE.FV && item.isActive)) {
      codDoc = 'FV';
    }
    if (this.documents().some((item) => item.codDoc === DOC_TYPE.NE && item.isActive)) {
      codDoc = 'NE';
    }
    if (this.documents().every((item) => item.isActive)) {
      codDoc = 'A';
    }

    const params = {
      ...this.data,
      codDoc,
      documents: this.documents().filter((x) => x.isActive),
    };

    if (this.params.data.id > 0) {
      this._printerUseCase.update(this.params.data.id, params).subscribe(this.successResponse);
    }

    if (!(this.params.data.id > 0)) {
      this._printerUseCase.create(params).subscribe(this.successResponse);
    }
  }
  close() {
    this._modalRef.close();
  }
}
