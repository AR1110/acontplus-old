import { generateUuidv4 } from '@/domain/utils/generate-uuidv4';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  TemplateRef,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-custom-container-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    DragDropModule,
  ],
  template: `
    @if(showHeader()){

    <div
      class="m3-dialog-header"
      cdkDrag
      cdkDragRootElement=".cdk-overlay-pane"
      (mousedown)="toTop(unique)"
    >
      <h6 mat-dialog-title>
        {{ matDialogTitle() }}

        <button mat-icon-button class="close-button" (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </h6>
    </div>
    }

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
  cursor:all-scroll;
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
`,
})
export class CustomContainerDialogComponent {
  showHeader = input(true);
  matDialogTitle = input('');
  close = output();
  @Input() containerTemplate!: TemplateRef<any> | null;
  @Input() actionsTemplate!: TemplateRef<any> | null;

  public cdk = inject(OverlayContainer);
  unique = generateUuidv4();
  toTop(id: string) {
    this.cdk.getContainerElement().childNodes.forEach((x: any) => {
      if (x.innerHTML.indexOf('id="' + id + '"') <= 0)
        x.style['z-index'] = 1000;
      else x.style['z-index'] = 1001;
    });
  }
}
