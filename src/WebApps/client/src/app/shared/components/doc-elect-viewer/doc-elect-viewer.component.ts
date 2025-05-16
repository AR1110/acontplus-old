import { Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-elect-viewer',
  imports: [MatCustomDialogComponent],
  templateUrl: './doc-elect-viewer.component.html',
  styles: ``,
})
export class DocElectViewerComponent implements OnInit {
  safeContent = signal<SafeHtml>('');
  private readonly _dialogRef = inject(MatDialogRef<DocElectViewerComponent>);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _data = inject<string>(MAT_DIALOG_DATA);

  ngOnInit() {
    const safeHtml = this._sanitizer.bypassSecurityTrustHtml(this._data);
    this.safeContent.set(safeHtml);
  }

  onClose() {
    this._dialogRef.close();
  }
}
