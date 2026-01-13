import { AddEditElectronicSignature } from '@modules/config/ui/electronic-signature-page/add-edit-electronic-signature/add-edit-electronic-signature';
import { ELECTRONIC_SIGNATURE_HTTP_TOKEN } from '@modules/config/data/config-token';

import { ElectronicSignatureList } from '@modules/config/data/models/electronic-signature.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SvgIconComponent } from '@shared/components/svg-icon/svg-icon.component';
import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  DynamicCard,
  DataGrid,
  DataGridColumn,
  AdvancedDialogService,
  Button,
} from '@acontplus/ng-components';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { getValidId } from '@core/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-electronic-signature-page',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    Button,
    MatIconModule,
    DataGrid,
    SvgIconComponent,
    MatTooltip,
  ],
  templateUrl: './electronic-signature-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectronicSignaturePage implements OnInit {
  private electronicSignatureHttp = inject(ELECTRONIC_SIGNATURE_HTTP_TOKEN);
  private dialogSvc = inject(AdvancedDialogService);

  dataSource = signal<ElectronicSignatureList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'nomEntidad', header: 'Entidad' },
    { field: 'contrasenia', header: 'Contraseña' },
    { field: 'nombreArchivo', header: 'Nombre Archivo' },
    { field: 'mimeType', header: 'Mime Type' },
    { field: 'fechaCaducidad', header: 'Fecha Caducidad' },
  ];

  async openModalAddUpdate(item?: ElectronicSignatureList) {
    const isEdit = !!item;
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: AddEditElectronicSignature,
        title: isEdit ? 'Editar Firma Electrónica' : 'Nueva Firma Electrónica',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: structuredClone(item) ?? {},
      },
      {
        size: 'md',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  refresh() {
    this.getList();
  }

  private getList() {
    this.electronicSignatureHttp.list().subscribe((response) => {
      this.dataSource.set(response.data);
    });
  }

  ngOnInit() {
    this.refresh();
  }

  async updateSignature(item: ElectronicSignatureList) {
    // First, get the file
    const result1 = await Swal.fire({
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

    const file = result1.value as File;
    if (!file) return;

    // Then, get the password
    const result2 = await Swal.fire({
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

    const password = result2.value as string;
    if (!password) return;

    if (!getValidId(item.idFirmaElectronica)) {
      void Swal.fire({
        icon: 'warning',
        text: 'El id es:' + item.idFirmaElectronica,
      });
      return;
    }

    this.electronicSignatureHttp
      .updateSignature({
        idFirmaElectronica: item.idFirmaElectronica,
        contrasenia: password,
        file,
      })
      .subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      void Swal.fire({
        icon: 'warning',
        text: response.message,
      });
    }
    if (response.code === '1') {
      void Swal.fire({
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
      if (filenameMatch?.[1]) {
        fileName = filenameMatch[1].replace(/['"]/g, '');

        // Decode URL encoded characters
        fileName = decodeURIComponent(fileName);

        // Replace problematic characters
        fileName = fileName.replaceAll('+', ' ');

        // Additional sanitization if needed
        fileName = fileName.replace(/[/?<>\\:*|"]/g, '_');
      }
    }
    return fileName ?? null;
  }

  downloadSignature(item: ElectronicSignatureList) {
    this.electronicSignatureHttp
      .downloadSignature(item.idFirmaElectronica)
      .subscribe((response: Response) => {
        const filename = this.getFileNameFromResponse(response) ?? 'firma.p12';

        // Convertir el ReadableStream a ArrayBuffer
        void response.arrayBuffer().then((arrayBuffer) => {
          const blob = new Blob([arrayBuffer], { type: 'application/x-pkcs12' });

          // descarga
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(a.href);
        });
      });
  }
}
