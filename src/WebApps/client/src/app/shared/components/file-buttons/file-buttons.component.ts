import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-buttons',
  template: `
    <button
      mat-raised-button
      [ngClass]="{ 'pdf-button': isPdf, 'excel-button': isExcel }"
      [color]="getButtonColor()"
      (click)="handleClick()"
    >
      <mat-icon>{{ getFileIcon() }}</mat-icon>
      {{ text }}
    </button>
  `,
  styles: [
    `
      .pdf-button {
        background-color: #dc3545 !important;
        color: white !important;
      }

      .excel-button {
        background-color: #28a745 !important;
        color: white !important;
      }
    `,
  ],
  imports: [MatButton, MatIconModule, NgClass],
})
export class FileButtonsComponent {
  @Input() fileType: 'pdf' | 'excel' = 'pdf';
  @Input() text: string = '';
  @Output() downloadFile = new EventEmitter<{ type: 'pdf' | 'excel' }>();

  get isPdf(): boolean {
    return this.fileType === 'pdf';
  }

  get isExcel(): boolean {
    return this.fileType === 'excel';
  }

  getButtonColor(): string {
    return this.isPdf ? 'warn' : 'primary';
  }

  getFileIcon(): string {
    return this.isPdf ? 'picture_as_pdf' : 'table_view';
  }

  handleClick(): void {
    this.downloadFile.emit({ type: this.fileType });
  }
}
