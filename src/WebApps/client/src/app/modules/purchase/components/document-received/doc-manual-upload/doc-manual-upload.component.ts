import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { SubCategorySelectHtmlOnly } from '@accounting/models/subcategory';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';

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
  ],
  templateUrl: './doc-manual-upload.component.html',
  styles: ``,
})
export class DocManualUploadComponent {
  readonly data = inject<any>(MAT_DIALOG_DATA);
  docUploadForm = new FormGroup({
    tipo: new FormControl(),
  });

  dialogIcon = signal('list-box"');
  dialogTitle = signal('Importación Manual de Documentos');

  subcategories: SubCategorySelectHtmlOnly[] = [];
  private readonly dialogRef = inject(MatDialogRef<DocManualUploadComponent>);

  onSave() {}

  onClose() {
    this.dialogRef.close();
  }
}
