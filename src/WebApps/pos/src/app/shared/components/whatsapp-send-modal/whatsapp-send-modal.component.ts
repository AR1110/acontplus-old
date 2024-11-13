import { isValidField } from '@/shared/utils/utils';
import { CODE_REPORT, DOC_TYPE } from '@/shared/enums/main.enum';
import { EmailConfigService } from '@/shared/services/email-config.service';
import { ApiGreenApiService } from '@/shared/services/external/api-green-api.service';
import { SharedService } from '@/shared/services/shared.service';
import { ToasterService } from '@/shared/services/toaster.service';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { concatMap } from 'rxjs';
import Swal from 'sweetalert2';

import { CustomContainerDialogComponent } from '../custom-container-dialog/custom-container-dialog.component';

type Props = {
  idDocumentoElectronico: number
  documentoId: number
  codDoc: string
  docType: string //eliminar cuando en order doc tipo 3 se cambia
  codEstab: string
  id: number
}

function createDataParamDocSri(data: Props) {
  let id = data.idDocumentoElectronico > 0 ? data.idDocumentoElectronico : data.documentoId;
  return {
    id,
    codDoc: data.codDoc || data.docType,
    esNotificacionTributaria: true,
  };
}
function createDataParamDoc(data: Props) {
  return {
    id: data.documentoId,
    codDoc: data.codDoc || data.docType,
    esNotificacionGeneral: true,
  };
}



const phoneNumberFormatter = (number: string) => {
  let formatted = number.replace(/\D/g, '')
  if (formatted.startsWith('0')) {
    formatted = '593' + formatted.substr(1)
  }
  if (!formatted.endsWith('@c.us')) {
    formatted += '@c.us'
  }
  return formatted
}

@Component({
  selector: 'app-whatsapp-send-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    CustomContainerDialogComponent
  ],
  templateUrl: './whatsapp-send-modal.component.html',
})
export class WhatsappSendModalComponent {
  readonly dialogRef = inject(MatDialogRef<WhatsappSendModalComponent>);
  readonly data = inject<Props>(MAT_DIALOG_DATA);
  private emailConfigSvc = inject(EmailConfigService)
  private tS = inject(ToasterService)
  private sharedSvc = inject(SharedService)
  private apiGreenApiSvc = inject(ApiGreenApiService)

  private totalMessages = 0;

  esNotificacionTributaria = false;
  esNotificacionGeneral = false;
  phoneNumbers = []

  whatsapp = {
    number: '',
    message: 'ACONTPLUS adjunta el siguiente comprobante:'
  }

  telefonoEstab = "";
  nombreEstab = "";


  private dataParamGetDataForm: any = {
    [DOC_TYPE.FV]: createDataParamDocSri(this.data),
    [DOC_TYPE.NE]: createDataParamDoc(this.data),
  };

  isFetching = signal(false)

  private getCodeDoc() {
    return this.data.codDoc || this.data.docType;
  }

  getDataForm() {

    let params = this.dataParamGetDataForm[this.getCodeDoc()];
    if (!params) {
      console.error(`No se encontraron parámetros para el tipo de documento: ${this.data.codDoc}`);
      return;
    }
    this.esNotificacionTributaria = params.esNotificacionTributaria;
    this.esNotificacionGeneral = params.esNotificacionGeneral;


    this.emailConfigSvc.getDataFormNotificacion(params).subscribe(response => {

      this.telefonoEstab = response.telefonoEstab;
      this.nombreEstab = response.nombreEstab;

      this.phoneNumbers = response.telefonos.filter((p: string) => p.length === 10)

      if (this.phoneNumbers.length > 0) {
        this.whatsapp.number = this.phoneNumbers[0]
      }

      if (this.esNotificacionTributaria) {
        this.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante electrónico:'
      }
    })
  }
  ngOnInit() {
    this.getDataForm()
  }


  private validatePhoneNumber() {
    if (!isValidField(this.whatsapp.number)) {
      this.tS.toastr({
        type: 'warning',
        message: 'El número de celular no puede estar vacio!'
      })
      return
    }

    if (this.whatsapp.number.length < 10) {
      this.tS.toastr({
        type: 'warning',
        message: 'El número de celular no puede ser menor a diez digitos!'
      })
      return
    }

    if (this.whatsapp.number.length > 10) {
      this.tS.toastr({
        type: 'warning',
        message: 'El número de celular no puede ser mayor a diez digitos!'
      })
      return
    }
    return true
  }

  private contentFile(responseFile: any) {
    const responseHeaders = responseFile.headers;
    const fileName = this.sharedSvc.getFileName(responseFile)
    const file = new File([responseFile.body], fileName, { type: responseHeaders["content-type"] })
    return {
      file,
      fileName
    }
  }

  private sendMedia(caption: string, file: File) {
    try {
      const payload = new FormData();
      const formettedPhoneNumber = phoneNumberFormatter(this.whatsapp.number)
      payload.append("caption", caption)
      payload.append("chatId", formettedPhoneNumber)
      payload.append("file", file)

      let messageEstab = '_______________________________'
      const messageInfo = 'Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!.';
      const messageFooter = `*_Por favor responda con un OK y agregue este número a sus contactos_*`;

      if (this.telefonoEstab) {
        messageEstab = `Si tiene alguna observación, favor comunicarse con la empresa *${this.nombreEstab}* al siguiente número: *${this.telefonoEstab}*`
      }

      let chatId = phoneNumberFormatter(this.whatsapp.number);

      this.isFetching.set(true)

      this.apiGreenApiSvc.sendSMS(chatId,
        'ACONTPLUS adjunta el siguiente comprobante electrónico:'
      ).pipe(
        concatMap(response1 => {
          return this.apiGreenApiSvc.sendFileByUpload({
            chatId,
            caption,
            file
          })
        }),
        concatMap(response2 => {
          return this.apiGreenApiSvc.sendSMS(chatId,
            messageEstab
          )
        }),
        concatMap(response3 => {
          return this.apiGreenApiSvc.sendSMS(chatId,
            messageInfo
          )
        }),
        concatMap(response4 => {
          return this.apiGreenApiSvc.sendSMS(chatId,
            messageFooter
          )
        })
      ).subscribe({
        next: response=>{
          this.isFetching.set(false)
          Swal.fire({
            icon: 'success',
            text: 'Enviado correctamente',
            timer: 2000
          })
        },
        error: ()=>{
          this.isFetching.set(false)
        }
      })

    } catch (error) {
      this.isFetching.set(false)
      console.log(error);
    }

  }

  private generateFile() {
    try {
      const format = 'pdf';
      /**
       * Factura
       */
      if (this.getCodeDoc() === DOC_TYPE.FV) {
        const dataParms = {
          hasParams: true,
          id: this.data.documentoId,
          codEstab: this.data.codEstab,
          codigo: CODE_REPORT.FV,
          format,
        }
        const parameters = {
          hasService: true,
          reportParams: JSON.stringify({
            hasParams: true,
            codigo: CODE_REPORT.FV,
            codEstab: this.data.codEstab,
            format,
            aditionalParams: []
          }),
          dataParams: JSON.stringify(dataParms)
        }


        this.sharedSvc.getReport({
          data: parameters,
          isReturnData: true,
          isOldVersion: true
        })?.subscribe(response => {
          if (response) {
            const { file, fileName } = this.contentFile(response);
            this.sendMedia(fileName, file)

          }

        })

      }

      /**
       * Nota de Entrega
       */
      if (this.getCodeDoc() === DOC_TYPE.NE) {

        const parameters = {
          hasService: true,
          reportParams: JSON.stringify({
            hasParams: true,
            codigo: CODE_REPORT.NE,
            codEstab: this.data.codEstab,
            format,
            aditionalParams: []
          }),
          dataParams: JSON.stringify({
            id: this.data.documentoId,
            tipo: 1
          })
        }

        this.sharedSvc.getReport({
          data: parameters,
          isReturnData: true,
          isOldVersion: true
        })?.subscribe(response => {
          if (response) {
            const { file, fileName } = this.contentFile(response);
            this.sendMedia(fileName, file)

          }

        })
      }

      //Orden de pedido
      if (this.getCodeDoc() === DOC_TYPE.OR) {
        const parameters = {
          reportParams: JSON.stringify({
            codigo: CODE_REPORT.OR,
            codEstab: this.data.codEstab,
            format,
          }),
          dataParams: JSON.stringify({
            id: this.data.id
          })
        }
        this.sharedSvc.getReport({
          data: parameters,
          isReturnData: true
        })?.subscribe(response => {
          if (response) {
            const { file, fileName } = this.contentFile(response);
            this.sendMedia(fileName, file)

          }

        })
      }
    } catch (error) {
      console.log(error)
    }
  }



  send() {
    try {
      this.totalMessages = 0
      if (!this.validatePhoneNumber()) return;


      if (!isValidField(this.whatsapp.message)) {
        this.tS.toastr({
          type: 'warning',
          message: 'El mensaje no puede estar vacio!'
        })
        return
      }


      this.generateFile();
    } catch (error) {
      console.log(error)
    }
  }






  closeDialog() {
    if (this.isFetching()) return
    this.dialogRef.close()
  }

}
