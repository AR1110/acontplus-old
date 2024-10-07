import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

type DialogOptions = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  data?: any,
  disableClose?: boolean,
  isFullScreen?: boolean
}
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private overlay: Overlay) { }

  open(component: any, options: DialogOptions): Observable<any> {

    const dialogConfig = new MatDialogConfig();

    if (options.isFullScreen) {
      dialogConfig.width = '100vw';
      dialogConfig.height = '100vh';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '100vh';
      dialogConfig.panelClass = 'full-screen-dialog';
    } else {
      dialogConfig.width = this.getDialogWidth(options.size);
      dialogConfig.maxWidth = '90vw'; // Set maximum width for xl size
      dialogConfig.height = 'auto'
    }

    dialogConfig.data = options.data;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.reposition()
    dialogConfig.disableClose = options.disableClose ?? true;

    const dialogRef = this.dialog.open(component, dialogConfig);

    return dialogRef.afterClosed();
  }

  private getDialogWidth(size?: 'default' | 'sm' | 'md' | 'lg' | 'xl'): string {
    switch (size) {
      case 'sm':
        return '300px';
      case 'md':
        return '600px';
      case 'lg':
        return '800px';
      case 'xl':
        return '1200px';
      default:
        return '600px'; // Default size
    }
  }

}
