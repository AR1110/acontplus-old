import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '@acontplus/ng-notifications';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { PrinterRead, PrinterTypeSelectHtmlOnly } from '@modules/config/data/models/printer.model';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrinterDocService } from '@modules/config/services/printer-doc.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { isValidField } from '@core/utils/utils';
import { DOC_TYPE } from '@core/constants/global.constants';
import { PRINTER_HTTP_TOKEN } from '@modules/config/data/config-token';
import { Button, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-printer-add-edit-modal',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogContent,
    Button,
    DataGrid,
  ],
  templateUrl: './printer-add-edit-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrinterAddEditModal implements OnInit {
  params = inject<{
    data: {
      data: any;
      printers: PrinterRead[];
    };
  }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PrinterAddEditModal>);
  private readonly printerService = inject(PRINTER_HTTP_TOKEN);
  private readonly notificationSvc = inject(NotificationService);
  private readonly printerDocService = inject(PrinterDocService);

  loading = signal(false);
  btnText = signal('Guardar');

  localPrinters = signal<any[]>([]);
  estabs = signal<EstablecimientoSelectHtmlOnly[]>([]);
  documents = signal<any[]>([]);
  printerTypes = signal<PrinterTypeSelectHtmlOnly[]>([]);

  documentColumns: DataGridColumn[] = [
    {
      header: 'N°',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Documento',
      field: 'name',
      sortable: false,
    },
    {
      header: 'Estado',
      field: 'status',
      sortable: false,
    },
    {
      header: 'Copias',
      field: 'copies',
      sortable: false,
    },
  ];

  dataForm = {
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

  get getParamsData() {
    return this.params.data;
  }

  private successResponsePrinterDoc = {
    next: (response: ApiResponseLegacy) => {
      if (response.code === '0') {
        this.notificationSvc.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.notificationSvc.success({ message: response.message });
        this.getDataEdit(false);
      }
    },
    error: (error: unknown) => {
      console.error(error);
    },
  };

  private successResponse = {
    next: (response: ApiResponseLegacy) => {
      if (response.code === '0') {
        this.notificationSvc.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.notificationSvc.success({ message: response.message });
        this.dialogRef.close(response);
      }
    },
    error: (error: unknown) => {
      console.error(error);
    },
  };

  getDataForm(isRegister: boolean): void {
    this.printerService.getDataForm().subscribe((response) => {
      this.estabs.set(response.estabs);
      this.printerTypes.set(response.printerTypes);

      if (isRegister) {
        const documents = response.documents.map((item: any) => {
          item.copies = 1;
          return item;
        });
        this.documents.set(documents);
        if (this.estabs().length > 0) {
          this.dataForm.establecimientoId =
            this.estabs().find((e) => e.predeterminado)?.idEstablecimiento ?? 0;
        }
      }
      if (this.estabs.length === 0) {
        this.notificationSvc.warning({
          message: 'No tienes asignado los establecimientos',
        });
      }
    });
  }

  getLocalPrinters(): void {
    this.printerService.getLocalPrinters().subscribe({
      next: (response) => {
        this.localPrinters.set(response.localPrinters);
        this.dataForm.machine = this.localPrinters()[0]?.machine;
      },
      error: (err) => {
        console.error(err);
        this.notificationSvc.warning({
          message:
            'Por favor instale el programa Acontplus Print, para obtener el listado de impresoras',
        });
      },
    });
  }

  getDataEdit(isReload: boolean): void {
    this.printerService.getById(this.getParamsData.data.id).subscribe((response) => {
      if (isReload) {
        this.dataForm = response.printer;
      }
      this.documents.set(response.documents);
    });
  }

  ngOnInit(): void {
    if (this.getParamsData.data.id > 0) {
      this.btnText.set('Actualizar');
      this.getDataForm(false);
      this.getDataEdit(true);
      this.getLocalPrinters();
    } else {
      if (this.getParamsData.printers.every((item) => !item.isDefault)) {
        this.dataForm.isDefault = true;
      }
      if (this.getParamsData.printers.length > 0) {
        this.dataForm.ipAddress = this.getParamsData.printers[0].ipAddress;
        this.dataForm.domain = 'acontplusprint.com';
      }

      this.getDataForm(true);
      this.getLocalPrinters();
    }
  }

  updateDocument(data: any): void {
    if (!data.isActive) {
      data.copies = 1;
    }
    if (this.getParamsData.data.id > 0) {
      if (data.id > 0) {
        data.isActive = !data.isActive;
        data.labelisActive = data.isActive ? 'Activa' : 'Inactiva';

        this.printerDocService.put(data.id, data).subscribe(this.successResponsePrinterDoc);
      }

      if (!(data.id > 0)) {
        const saveData = {
          ...data,
          printerId: this.getParamsData.data.id,
        };
        this.printerDocService.post(saveData).subscribe(this.successResponsePrinterDoc);
      }
    }
  }

  saveEdit(): void {
    try {
      if (!(this.dataForm.establecimientoId > 0)) {
        this.notificationSvc.warning({
          message: 'Seleccione el Establecimiento',
        });
        return;
      }
      if (!isValidField(this.dataForm.name)) {
        this.notificationSvc.warning({
          message: 'Se necesita ingresar el nombre de la Impresora',
        });
        return;
      }
      if (!(this.dataForm.printerTypeId > 0)) {
        this.notificationSvc.warning({
          message: 'Seleccione el Tipo Impresora',
        });
        return;
      }
      if (
        this.dataForm.serverDevice &&
        (!this.dataForm.macAddress || this.dataForm.macAddress.length == 0)
      ) {
        this.notificationSvc.warning({
          message: 'Ingreso la dirección Mac del equipo',
        });
        return;
      }
      if (!isValidField(this.dataForm.ipAddress)) {
        this.notificationSvc.warning({
          message: 'Ingrese el Ip de la máquina',
        });
        return;
      }
      if (this.documents().every((item) => !item.isActive)) {
        this.notificationSvc.warning({
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

      const saveData = {
        ...this.dataForm,
        codDoc,
        documents: this.documents().filter((x) => x.isActive),
      };

      this.loading.set(true);
      const operation =
        this.getParamsData.data.id > 0
          ? this.printerService.update(this.getParamsData.data.id, saveData)
          : this.printerService.create(saveData);

      operation.pipe(finalize(() => this.loading.set(false))).subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
