import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { SendMailParams } from '@shared/models/send-mail.model';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { NotificacionTributariaService } from '@billing/services/notificacion-tributaria.service';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-send-mail-dialog',
  imports: [
    FormsModule,
    ThemeButtonComponent,
    MatCustomDialogComponent,
    MatLabel,
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    ReactiveFormsModule,
    MatChipInput,
    MatError,
  ],
  templateUrl: './send-mail-dialog.component.html',
})
export class SendMailDialogComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emailCtrl = new FormControl('', [Validators.email]);
  emails: string[] = [];

  readonly data = inject<SendMailParams>(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<SendMailDialogComponent>);
  private readonly _tS = inject(ToasterService);
  private readonly _notificacionSvc = inject(NotificacionService);
  private readonly _notificacionTribSvc = inject(NotificacionTributariaService);

  commonResponse = (response: object) => {
    if (isApiResponse(response)) {
      this._tS.toastr({
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
      this.emails = this.data.data.receptor.split(/[|;]/);
    }
    if (this.emails.length === 0) {
      this.emails = [''];
    }
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add email to the list
    if (value && this.isValidEmail(value)) {
      this.emails.push(value);
      this.emailCtrl.setValue(null);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }

    // Make sure we always have at least one email option
    if (this.emails.length === 0) {
      this.emailCtrl.setValue('');
    }
  }

  send() {
    try {
      if (this.emails.length === 0) {
        this._tS.toastr({
          type: 'warning',
          message: 'Ingrese al menos un correo del destinatorio',
        });
        return;
      }

      if (!this.emails.every((item) => this.isValidEmail(item))) {
        this._tS.toastr({
          type: 'warning',
          message:
            'Verifique que los correos del destinatario esten ingresado correctamente',
        });
        return;
      }
      console.log(this.data)
      const {
        codDoc,
        serieComprobante,
        subject,
        codEstado,
        idDocumento,
        idDocumentoElectronico,
      } = this.data.data;
      const receptor = this.emails.join(SEPARATOR_KEY_CODE.SLASH);
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
