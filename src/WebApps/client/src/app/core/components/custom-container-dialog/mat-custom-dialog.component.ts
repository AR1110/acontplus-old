import { CommonModule } from '@angular/common';
import { Component, Input, input, output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mat-custom-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mat-custom-dialog.component.html',
  styleUrl: './mat-custom-dialog.component.scss',
})
export class MatCustomDialogComponent {
  showHeader = input(true);
  loading = input(false);
  align = input<'start' | 'center' | 'end'>('end');
  matDialogTitle = input('');
  close = output();
  @Input() containerTemplate!: TemplateRef<any> | null;
  @Input() actionsTemplate!: TemplateRef<any> | null;
}
