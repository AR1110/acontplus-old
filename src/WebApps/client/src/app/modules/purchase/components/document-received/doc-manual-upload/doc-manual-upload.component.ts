import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { SubCategorySelectHtmlOnly } from '@accounting/core/domain/subcategory';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { ToasterService } from '@core/services/toaster.service';
import { DocumentReceivedService } from '@purchase/services/document-received.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SubCategoryUsecase } from '@accounting/core/usecases/sub-category.usecase';
import { ApiResponse } from '@core/models/api-response';
import { catchError, forkJoin, Observable, tap, throwError } from 'rxjs';

@Component({
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
    FaIconComponent,
    MatIconButton,
  ],
  templateUrl: './doc-manual-upload.component.html',
  styles: ``,
})
export class DocManualUploadComponent {
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
  private readonly _docReceivedService = inject(DocumentReceivedService);

  private _subCategoryUseCase = inject(SubCategoryUsecase);

  private readonly _tS = inject(ToasterService);

  get claveAccesoDocs() {
    return this.docUploadForm.get('claveAccesoDocs') as FormArray;
  }

  get xmlDocs() {
    return this.docUploadForm.get('xmlDocs') as FormArray;
  }

  addClaveAcceso() {
    const claveAccesoForm = this.#fb.group({
      claveAcceso: [
        '',
        [
          Validators.required,
          Validators.maxLength(49),
          Validators.minLength(49),
        ],
      ],
    });

    this.claveAccesoDocs.push(claveAccesoForm);
  }

  addXmlDoc($event: any) {
    const file = $event.target.files[0];

    const isValidXml = file.type === 'text/xml' || file.name.endsWith('.xml');
    if (!isValidXml) {
      return this._tS.toastr({
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
    this._subCategoryUseCase.getAll({}).subscribe((response) => {
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
      return this._tS.toastr({
        type: 'warning',
        message: 'Please select a subcategory',
      });
    }

    const uploadObservables: Observable<any>[] = [];
    this.xmlDocs.controls.forEach((control, index) => {
      const file = control.get('file')?.value;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadObservable = this._docReceivedService
          .uploadXml({ codEstab, subcategoryId }, formData)
          .pipe(
            tap((response) => {
              if (response.code === '1') {
                this._tS.toastr({ type: 'success', message: response.message });
                this.xmlDocs.removeAt(index); // Remove uploaded file from form
              } else {
                this._tS.toastr({ type: 'warning', message: response.message });
              }
            }),
            catchError((error) => {
              console.error('Error uploading file:', error);
              this._tS.toastr({ type: error, message: 'Error uploading file' });
              return throwError(() => error); // Re-throw error to handle in forkJoin
            }),
          );

        uploadObservables.push(uploadObservable);
      }
    });

    if (uploadObservables.length === 0) {
      this._tS.toastr({
        type: 'warning',
        message: 'No files selected for upload',
      });
      return;
    }

    debugger;

    forkJoin(uploadObservables).subscribe({
      complete: () => {
        this._tS.toastr({
          type: 'success',
          message: 'All files uploaded successfully',
        });
      },
      error: (error) => {
        console.error('Overall upload error:', error);
        this._tS.toastr({ type: 'error', message: 'Error uploading files' });
      },
    });
  }
}
