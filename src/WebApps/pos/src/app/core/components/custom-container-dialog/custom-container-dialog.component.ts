import { CommonModule } from '@angular/common';
import {Component, Input, TemplateRef, input, output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-container-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './custom-container-dialog.component.html',
  styleUrl: './custom-container-dialog.component.scss'
})
export class CustomContainerDialogComponent {
  matDialogTitle = input("");
  close = output()
  @Input() containerTemplate!: TemplateRef<any> | null;
  @Input()  actionsTemplate!: TemplateRef<any> | null;


}
