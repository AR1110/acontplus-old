import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { SubCategorySelectHtmlOnly } from '@accounting/data/models/subcategory';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { RECEIVED_DOCUMENT_HTTP_TOKEN } from '@purchases/data/purchases-token';
import { SUB_CATEGORY_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { Button } from '@acontplus/ng-components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-doc-manual-upload',
  imports: [
    ReactiveFormsModule,
    MatCustomDialogComponent,
    MatButton,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatIcon,
    MatIconButton,
    Button,
  ],
  templateUrl: './doc-manual-upload.component.html',
  styles: ``,
})
export class DocManualUploadComponent implements OnInit {
  dialogIcon = signal('list-box"');
  dialogTitle = signal('Importación Manual de Documentos');

  subcategories: SubCategorySelectHtmlOnly[] = [];

  #fb = inject(FormBuilder);
  docUploadForm = this.#fb.group({
    codEstab: '',
    subcategoryId: 0,
    tipo: '',
    claveAccesoDocs: this.#fb.array([]),
    xmlDocs: this.#fb.array([this.#fb.control('')]),
  });

  readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DocManualUploadComponent>);
  private readonly _receivedDocumentSvc = inject(RECEIVED_DOCUMENT_HTTP_TOKEN);
  private readonly _subCategoryHttp = inject(SUB_CATEGORY_HTTP_TOKEN);
  private readonly _tS = inject(ToastrNotificationService);

  get claveAccesoDocs() {
    return this.docUploadForm.get('claveAccesoDocs') as FormArray;
  }

  get xmlDocs() {
    return this.docUploadForm.get('xmlDocs') as FormArray;
  }

  addClaveAcceso() {
    const claveAccesoForm = this.#fb.group({
      claveAcceso: ['', [Validators.required, Validators.maxLength(49), Validators.minLength(49)]],
    });

    this.claveAccesoDocs.push(claveAccesoForm);
  }

  addXmlDoc($event: any) {
    const file = $event.target.files[0];

    const isValidXml = file.type === 'text/xml' || file.name.endsWith('.xml');
    if (!isValidXml) {
      return this._tS.show({
        type: 'warning',
        message: 'El formato de archivo no es correcto',
      });
    }

    const fileControl = this.#fb.group({
      file: [null, Validators.required],
    });
    fileControl.patchValue({ file });
    this.xmlDocs.push(fileControl);
  }

  removeClaveAcceso(index: number): void {
    this.claveAccesoDocs.removeAt(index);
  }

  removeXml(index: number): void {
    this.xmlDocs.removeAt(index);
  }

  ngOnInit() {
    this._subCategoryHttp.getAll({}).subscribe((response) => {
      this.subcategories = response;
    });

    this.docUploadForm.patchValue({ tipo: '2', codEstab: this.data.codEstab });
  }

  onSave() {}

  onClose() {
    this.dialogRef.close();
  }

  uploadXml() {
    const { codEstab, subcategoryId } = this.docUploadForm.value;

    if (!subcategoryId) {
      return this._tS.show({
        type: 'warning',
        message: 'Please select a subcategory-page',
      });
    }

    const uploadObservables: Observable<any>[] = [];
    this.xmlDocs.controls.forEach((control, index) => {
      const file = control.get('file')?.value;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadObservable = this._receivedDocumentSvc
          .uploadXml({ codEstab, subcategoryId }, formData)
          .pipe(
            tap((response) => {
              this._tS.show({
                type: response.code === '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code === '1') {
                if (index > 0) {
                  index = index - 1;
                }
                this.removeXml(index); // Remove uploaded file from form
              }
            }),
            catchError((error) => {
              console.error('Error uploading file:', error);
              this._tS.show({ type: error, message: 'Error uploading file' });
              return throwError(() => error); // Re-throw error to handle in forkJoin
            }),
          );

        uploadObservables.push(uploadObservable);
      }
    });

    if (uploadObservables.length === 0) {
      return this._tS.show({
        type: 'warning',
        message: 'No files selected for upload',
      });
    }

    debugger;

    forkJoin(uploadObservables).subscribe({
      complete: () => {
        this._tS.show({
          type: 'success',
          message: 'Archivos subidos exitosamente!',
        });
      },
      error: (error) => {
        console.error('Overall upload error:', error);
        this._tS.show({
          type: 'error',
          message: 'Error al subir los archivos',
        });
      },
    });
  }
}
