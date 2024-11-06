import { CommonModule } from '@angular/common';
import {Component, Input, TemplateRef, input, output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-custom-container-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './custom-container-dialog.component.html',
  styleUrl: './custom-container-dialog.component.scss'
})
export class CustomContainerDialogComponent {
  loading = input(false)
  align = input<'start' | 'center' | 'end'>('end')
  matDialogTitle = input("");
  close = output()
  @Input() containerTemplate!: TemplateRef<any> | null;
  @Input()  actionsTemplate!: TemplateRef<any> | null;


}
