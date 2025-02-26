import { Component, inject, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier-docs',
  imports: [MatCustomDialogComponent],
  templateUrl: './supplier-docs.component.html',
  styles: ``,
})
export class SupplierDocsComponent {
  dialogIcon = signal('docs');
  dialogTitle = signal('Documentos del Proveedor');

  readonly data = inject<unknown>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SupplierDocsComponent>);

  ngOnInit() {
    console.log(this.data);
  }

  onClose() {
    this.dialogRef.close();
  }
}
