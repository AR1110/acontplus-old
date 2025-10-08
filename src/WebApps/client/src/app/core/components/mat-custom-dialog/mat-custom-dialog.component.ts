import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

export interface MatCustomDialogOptions {
  showButtonClose?: boolean | true | false;
}

@Component({
  selector: 'app-mat-custom-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OverlayModule,
    DragDropModule,
    ThemeButtonComponent,
  ],
  templateUrl: './mat-custom-dialog.component.html',
  styleUrl: './mat-custom-dialog.component.scss',
})
export class MatCustomDialogComponent {
  showHeader = input(true);
  loading = input(false);
  align = input<'start' | 'center' | 'end'>('end');
  title = input('');
  icon = input('');
  options = input<MatCustomDialogOptions>({
    showButtonClose: true,
  });
  close = output();
  @Input() containerTemplate!: TemplateRef<unknown> | null;
  @Input() actionsTemplate!: TemplateRef<unknown> | null;

  public cdk = inject(OverlayContainer);
  unique = generateUuidv4();
  toTop(id: string) {
    this.cdk.getContainerElement().childNodes.forEach((x: any) => {
      if (x.innerHTML.indexOf('id="' + id + '"') <= 0) x.style['z-index'] = 1000;
      else x.style['z-index'] = 1001;
    });
  }
}
