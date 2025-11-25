import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SendMailParams } from '@shared/models/send-mail.model';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { NotificacionTributariaService } from '@billing/services/notificacion-tributaria.service';
import { Button, InputChip } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-mail-dialog',
  imports: [FormsModule, Button, MatCustomDialogComponent, ReactiveFormsModule, InputChip],
  templateUrl: './send-mail-dialog.component.html',
})
export class SendMailDialogComponent implements OnInit {
  emails = signal<string[]>([]);

  readonly data = inject<SendMailParams>(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<SendMailDialogComponent>);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _notificacionSvc = inject(NotificacionService);
  private readonly _notificacionTribSvc = inject(NotificacionTributariaService);

  commonResponse = (response: object) => {
    if (isApiResponse(response)) {
      this._tS.show({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this._dialogRef.close(response);
      }
    }
  };

  ngOnInit() {
    if (
      'receptor' in this.data.data &&
      this.data.data.receptor &&
      typeof this.data.data.receptor == 'string'
    ) {
      this.emails().push(this.data.data.receptor.split(/[|;]/));
    }
  }

  send() {
    try {
      if (this.emails().length === 0) {
        this._tS.show({
          type: 'warning',
          message: 'Ingrese al menos un correo del destinatorio',
        });
        return;
      }

      if (!this.emails().every((item) => this.isValidEmail(item))) {
        this._tS.show({
          type: 'warning',
          message: 'Verifique que los correos del destinatario esten ingresado correctamente',
        });
        return;
      }
      console.log(this.data);
      const { codDoc, serieComprobante, subject, codEstado, idDocumento, idDocumentoElectronico } =
        this.data.data;
      const receptor = this.emails().join(SEPARATOR_KEY_CODE.SLASH);
      if (this.data.notificationAcontPlus) {
        let params = {
          codDoc,
          serieComprobante,
          subject,
          params: this.data.data.json,
          receptor,
        };
        if (this.data.noModifyParam) {
          params = this.data.data;
          params.receptor = receptor;
        }

        this._notificacionSvc.post(params).subscribe(this.commonResponse);
      }

      if (this.data.notificationSri) {
        const params = {
          codDoc,
          codEstado,
          idDocumento,
          idDocumentoElectronico,
          receptor,
        };
        this._notificacionTribSvc.post(params).subscribe(this.commonResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onClose() {
    this._dialogRef.close();
  }
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
