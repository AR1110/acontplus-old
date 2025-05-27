import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@core/services/toaster.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import {
  PrinterRead,
  PrinterTypeSelectHtmlOnly,
} from '@modules/config/domain/models/printing/printer.model';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrinterDocService } from '@modules/config/services/printer-doc.service';
import { isApiResponse } from '@core/models/api-response';
import { isValidField } from '@core/utils/utils';
import { DOC_TYPE } from '@core/constants/global.constants';
import { PrinterUseCase } from '@modules/config/application/use-cases/printer.use-case';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-printer-add-edit-modal',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatIcon,
    MatButton,
    ThemeButtonComponent,
  ],
  templateUrl: './printer-add-edit-modal.component.html',
  styles: ``,
})
export class PrinterAddEditModalComponent {
  @Input() params = {
    data: {} as any,
    printers: [] as PrinterRead[],
  };
  readonly _modalRef = inject(NgbActiveModal);
  private readonly _printerUseCase = inject(PrinterUseCase);
  private readonly _tS = inject(ToasterService);
  private readonly _printerDocService = inject(PrinterDocService);

  modalTitle = 'Nueva Impresora';
  modalIcon = 'save';

  localPrinters: any[] = [];

  estabs: EstablecimientoSelectHtmlOnly[] = [];
  documents: any[] = [];
  printerTypes: PrinterTypeSelectHtmlOnly[] = [];

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

  successResponsePrinterDoc = (response: unknown) => {
    if (isApiResponse(response)) {
      this._tS.toastr({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this.getDataEdit(false);
      }
    }
  };

  successResponse = (response: unknown) => {
    if (isApiResponse(response)) {
      this._tS.toastr({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this._modalRef.close(response);
      }
    }
  };

  getDataForm(isRegister: boolean) {
    this._printerUseCase.getDataForm().subscribe((response) => {
      this.estabs = response.estabs;
      this.printerTypes = response.printerTypes;

      if (isRegister) {
        this.documents = response.documents.map((item: any) => {
          item.copies = 1;
          return item;
        });

        if (this.estabs.length > 0) {
          this.data.establecimientoId =
            this.estabs.find((e) => e.predeterminado)?.idEstablecimiento ?? 0;
        }
      }
      if (this.estabs.length === 0) {
        this._tS.toastr({
          type: 'warning',
          message: 'No tienes asignado los establecimientos',
        });
      }
    });
  }

  getLocalPrinters() {
    this._printerUseCase.getLocalPrinters().subscribe({
      next: (response) => {
        this.localPrinters = response.localPrinters;
        this.data.machine = this.localPrinters[0]?.machine;
      },
      error: (err) => {
        console.log(err);
        this._tS.toastr({
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
        console.log(response.printer);
        this.data = response.printer;
      }
      this.documents = response.documents;
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
        !data.isActive ? (data.labelisActive = 'Inactiva') : 'Activa';

        this._printerDocService
          .put(data.id, data)
          .subscribe(this.successResponsePrinterDoc);
      }

      if (!(data.id > 0)) {
        let params = {
          ...data,
          printerId: this.params.data.id,
        };
        this._printerDocService
          .post(params)
          .subscribe(this.successResponsePrinterDoc);
      }
    }
  }

  saveEdit() {
    if (!(this.data.establecimientoId > 0)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }
    if (!isValidField(this.data.name)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Se necesita ingresar el nombre de la Impresora',
      });
      return;
    }
    if (!(this.data.printerTypeId > 0)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el Tipo Impresora',
      });
      return;
    }
    if (
      this.data.serverDevice &&
      (!this.data.macAddress || this.data.macAddress.length == 0)
    ) {
      this._tS.toastr({
        type: 'warning',
        message: 'Ingreso la dirección Mac del equipo',
      });
      return;
    }
    if (!isValidField(this.data.ipAddress)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Ingrese el Ip de la máquina',
      });
      return;
    }
    if (this.documents.every((item) => !item.isActive)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un documento',
      });
      return;
    }

    let codDoc = '';
    if (
      this.documents.some(
        (item) => item.codDoc === DOC_TYPE.FV && item.isActive,
      )
    ) {
      codDoc = 'FV';
    }
    if (
      this.documents.some(
        (item) => item.codDoc === DOC_TYPE.NE && item.isActive,
      )
    ) {
      codDoc = 'NE';
    }
    if (this.documents.every((item) => item.isActive)) {
      codDoc = 'A';
    }

    let params = {
      ...this.data,
      codDoc,
      documents: this.documents.filter((x) => x.isActive),
    };

    if (this.params.data.id > 0) {
      this._printerUseCase
        .update(this.params.data.id, params)
        .subscribe(this.successResponse);
    }

    if (!(this.params.data.id > 0)) {
      this._printerUseCase.create(params).subscribe(this.successResponse);
    }
  }
}
