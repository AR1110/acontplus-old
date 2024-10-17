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
  template: `<div class="m3-dialog-header">
  <h6 mat-dialog-title>{{matDialogTitle()}}

    <button mat-icon-button class="close-button" (click)="close.emit()">
      <mat-icon>close</mat-icon>
    </button>
  </h6>
</div>

<mat-dialog-content class="mat-typography">
  <ng-container *ngTemplateOutlet="containerTemplate"></ng-container>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <ng-container *ngTemplateOutlet="actionsTemplate"></ng-container>
</mat-dialog-actions>
`,
  styles: `.m3-dialog-header {
  //  display: flex;
  //  justify-content: space-between;
  //  align-items: center;
  background-color: var(--pink);
}

h6[mat-dialog-title] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.close-button {
  margin-left: auto;
  color: white;
}
`
})
export class CustomContainerDialogComponent {
  matDialogTitle = input("");
  close = output()
  @Input() containerTemplate!: TemplateRef<any> | null;
  @Input()  actionsTemplate!: TemplateRef<any> | null;


}
