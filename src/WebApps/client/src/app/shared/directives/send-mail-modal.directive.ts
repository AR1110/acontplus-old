import {
  Directive,
  HostListener,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { SendMailDialogComponent } from '@shared/components/send-mail-dialog/send-mail-dialog.component';
import { ToasterService } from '@core/services/toaster.service';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appSendMailModal]',
  standalone: true,
})
export class SendMailModalDirective implements OnInit {
  notificationAcontPlus = input(false);
  notificationSri = input(false);
  noModifyParam = input(true);
  data = input.required<unknown>();
  dialogResult = output();

  private readonly _dialogService = inject(DialogService);
  private readonly _tS = inject(ToasterService);

  ngOnInit() {
    console.log({});
  }

  @HostListener('click') onClick() {
    if (!(this.notificationAcontPlus() || this.notificationSri())) {
      this._tS.toastr({
        type: 'warning',
        message: 'No Definido el tipo de notificación',
      });
      return;
    }
    const dialogRef = this._dialogService.open(SendMailDialogComponent, {
      data: {
        notificationAcontPlus: this.notificationAcontPlus(),
        notificationSri: this.notificationSri(),
        data: this.data(),
        noModifyParam: this.noModifyParam(),
      },
    });
    dialogRef.subscribe((result: any) => {
      if (typeof result === 'object' && result !== null) {
        this.dialogResult.emit(result);
      }
    });
  }
}
