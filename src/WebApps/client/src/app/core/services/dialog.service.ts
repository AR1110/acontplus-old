import { Overlay } from '@angular/cdk/overlay';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

interface DialogOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  data?: unknown;
  disableClose?: boolean;
  isFullScreen?: boolean;
  isScrollable?: boolean;
  enterAnimationDuration?: number;
  exitAnimationDuration?: number;
}
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  open(component: any, options: DialogOptions) {
    const dialogConfig = new MatDialogConfig();

    if (options.isFullScreen) {
      dialogConfig.width = '100%';
      dialogConfig.height = '100%';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '100vh';
      dialogConfig.panelClass = ['full-screen-dialog'];
      dialogConfig.position = {
        top: '0',
        left: '0',
      };
    } else {
      dialogConfig.width = this.getDialogWidth(options.size);
      dialogConfig.maxWidth = '90vw';
      dialogConfig.height = 'auto';
      //  dialogConfig.maxHeight = options.isScrollable ? '90vh' : undefined;
    }

    // dialogConfig.panelClass = [
    //   'custom-dialog',
    //   options.isScrollable ? 'dialog-scrollable' : 'dialog-non-scrollable'
    // ];

    dialogConfig.data = options.data;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.disableClose = options.disableClose ?? true;
    dialogConfig.enterAnimationDuration = options.enterAnimationDuration ?? 500;
    dialogConfig.exitAnimationDuration = options.exitAnimationDuration ?? 700;

    const dialogRef = this.dialog.open(component, dialogConfig);

    return dialogRef.afterClosed();
  }

  private getDialogWidth(size?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): string {
    switch (size) {
      case 'sm':
        return '300px';
      case 'md':
        return '600px';
      case 'lg':
        return '800px';
      case 'xl':
        return '1200px';

      case 'xxl':
        return '1400px';
      default:
        return '600px'; // Default size
    }
  }
}
