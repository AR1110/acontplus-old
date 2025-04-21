import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToasterService } from '@core/services/toaster.service';
import { isValidEmail } from '@core/utils/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SendMailParams } from '@shared/models/send-mail.model';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { NotificacionTributariaService } from '@billing/services/notificacion-tributaria.service';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-send-mail-modal',
  imports: [CommonModule, FormsModule, ThemeButtonComponent],
  templateUrl: './send-mail-modal.component.html',
})
export class SendMailModalComponent {
  @Input({ required: true }) params: SendMailParams = {
    notificationSri: false,
    notificationAcontPlus: false,
    data: {},
    noModifyParam: false,
  };
  public modal = inject(NgbActiveModal);
  private tS = inject(ToasterService);
  private notificacionSvc = inject(NotificacionService);
  private notificacionTribSvc = inject(NotificacionTributariaService);

  public emails: string[] = [''];
  public lastIndex = this.emails.length - 1;

  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      if (response.code === '0') {
        this.tS.toastr({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this.tS.toastr({
          type: 'success',
          message: response.message,
        });
        this.modal.close(response);
      }
    }
  };
  ngOnInit() {
    if (
      'receptor' in this.params.data &&
      this.params.data.receptor &&
      typeof this.params.data.receptor == 'string'
    ) {
      this.emails = this.params.data.receptor.split(/[\|;]/);
    }
    this.setLastIndex();
  }
  addEmail() {
    this.emails.push('');
    this.setLastIndex();
  }

  removeEmail(index: number) {
    this.emails.splice(index, 1);
    this.setLastIndex();
  }

  setLastIndex() {
    this.lastIndex = this.emails.length - 1;
  }

  send() {
    try {
      if (this.emails.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese al menos un correo del destinatorio',
        });
        return;
      }

      if (!this.emails.every((item) => isValidEmail(item))) {
        this.tS.toastr({
          type: 'warning',
          message:
            'Verifique que los correos del destinatario esten ingresado correctamente',
        });
        return;
      }

      let {
        codDoc,
        serieComprobante,
        subject,
        codEstado,
        idDocumento,
        idDocumentoElectronico,
      } = this.params.data;
      let receptor = this.emails.join(SEPARATOR_KEY_CODE.SLASH);
      if (this.params.notificationAcontPlus) {
        let params = {
          codDoc,
          serieComprobante,
          subject,
          params: this.params.data.json,
          receptor,
        };
        if (this.params.noModifyParam) {
          params = this.params.data;
          params.receptor = receptor;
        }

        this.notificacionSvc.post(params).subscribe(this.successResponse);
      }

      if (this.params.notificationSri) {
        let params = {
          codDoc,
          codEstado,
          idDocumento,
          idDocumentoElectronico,
          receptor,
        };

        this.notificacionTribSvc.post(params).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
