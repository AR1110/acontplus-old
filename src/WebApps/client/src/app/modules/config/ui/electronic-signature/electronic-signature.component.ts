import { UpdateSignatureElectronicSignatureUseCase } from '@modules/config/application/use-cases/electronic-signature/update-signature-electronic-signature.use-case';
import { AddEditElectronicSignatureComponent } from '@modules/config/ui/electronic-signature/add-edit-electronic-signature/add-edit-electronic-signature.component';
import { ListElectronicSignatureUseCase } from '@modules/config/application/use-cases/electronic-signature/list-electronic-signature.use-case';
import { DownloadSignatureUseCase } from '@modules/config/application/use-cases/electronic-signature/download-signature.use-case';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';

import { ElectronicSignatureList } from '@modules/config/domain/models/electronic-signature.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SvgIconComponent } from '@shared/components/svg-icon/svg-icon.component';
import { Component, inject, signal, OnInit } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { DynamicCard } from '@acontplus/ng-components';
import { MatButtonModule } from '@angular/material/button';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { getValidId } from '@core/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-electronic-signature',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    MatButtonModule,
    MatIconModule,
    MatDynamicTableComponent,
    SvgIconComponent,
    MatTooltip,
  ],
  templateUrl: './electronic-signature.component.html',
  styles: ``,
})
export class ElectronicSignatureComponent implements OnInit {
  private $listUseCase = inject(ListElectronicSignatureUseCase);
  private $updateSignature = inject(UpdateSignatureElectronicSignatureUseCase);
  private $downloadSignature = inject(DownloadSignatureUseCase);
  private _dialogSvc = inject(DialogService);

  dataSource = signal<ElectronicSignatureList[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomEntidad', label: 'Entidad', type: 'string' },
    { key: 'contrasenia', label: 'Contraseña', type: 'string' },
    { key: 'nombreArchivo', label: 'Nombre Archivo', type: 'string' },
    { key: 'mimeType', label: 'Mime Type', type: 'string' },
    { key: 'fechaCaducidad', label: 'Fecha Caducidad', type: 'string' },
  ];

  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  openModalAddUpdate(item?: ElectronicSignatureList) {
    const ref = this._dialogSvc.open(AddEditElectronicSignatureComponent, {
      data: structuredClone(item) || {},
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  refresh() {
    this.getList();
  }

  private getList() {
    this.$listUseCase.execute().subscribe((response) => {
      this.dataSource.set(response.data);
    });
  }

  ngOnInit() {
    this.refresh();
  }

  async updateSignature(item: ElectronicSignatureList) {
    // First, get the file
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo',
      input: 'file',
      inputAttributes: {
        accept: '.p12',
        'aria-label': 'Update Signature',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    });

    if (!file) return;

    // Then, get the password
    const { value: password } = await Swal.fire({
      title: 'Ingrese la contraseña',
      input: 'password',
      inputLabel: 'Contraseña del archivo de firma',
      inputPlaceholder: 'Ingrese la contraseña',
      inputAttributes: {
        maxlength: '100',
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'La contraseña es requerida';
        }
        return null;
      },
    });

    if (!password) return;

    if (!getValidId(item.idFirmaElectronica)) {
      Swal.fire({
        icon: 'warning',
        text: 'El id es:' + item.idFirmaElectronica,
      });
      return;
    }

    this.$updateSignature
      .execute({
        idFirmaElectronica: item.idFirmaElectronica,
        contrasenia: password,
        file,
      })
      .subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      Swal.fire({
        icon: 'warning',
        text: response.message,
      });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000,
      });
      this.refresh();
    }
  };

  private getFileNameFromResponse(response: Response): string | null {
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = '';
    // Extract filename safely using regex
    if (contentDisposition) {
      const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (filenameMatch && filenameMatch[1]) {
        fileName = filenameMatch[1].replace(/['"]/g, '');

        // Decode URL encoded characters
        fileName = decodeURIComponent(fileName);

        // Replace problematic characters
        fileName = fileName.replaceAll('+', ' ');

        // Additional sanitization if needed
        fileName = fileName.replace(/[/?<>\\:*|"]/g, '_');
      }
    }
    return fileName || null;
  }

  downloadSignature(item: ElectronicSignatureList) {
    this.$downloadSignature.execute(item.idFirmaElectronica).subscribe((response) => {
      const filename = this.getFileNameFromResponse(response) || 'firma.p12';
      const blob = new Blob([response.body!], { type: 'application/x-pkcs12' });

      // descarga
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(a.href);
    });
  }
}
