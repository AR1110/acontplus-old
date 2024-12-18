import {CODE_REPORT, DOC_TYPE} from '@/shared/enums/main.enum';
import { DialogService } from '@/shared/services/dialog.service';
import {Directive, HostListener, inject, Input, input} from '@angular/core';
import {EmailSendModalComponent} from "@/shared/components/email-send-modal/email-send-modal.component";

let paramToSendMail:any= {
      [DOC_TYPE.NE]: function(item:any) {
        return {
          serieComprobante: item.serieComprobante,
          correo: item.correo,
          subject: 'Documento Nota Entrega - Acontplus N°: ' + item.serieComprobante,
          json: {
            hasFile: true,
            isReport: "SI",
            reportParams: {
              hasParams: true,
              codEstab: item.codEstab,
              codigo: CODE_REPORT.RNE,
              format: "pdf"
            },
            spParams: {
              id: item.documentoId

            }
          }
        }
      }
  }

@Directive({
  selector: '[appActionEmailSend]',
  standalone: true
})
export class ActionEmailSendDirective {

  private dialogSvc = inject(DialogService)
 @Input()  params = {}
 @HostListener('click', ['$event']) onClick(){

   let params:any = structuredClone(this.params) || {};
   let {id, idDocumento, documentoId,codDoc,docType, ...rest} = params;
   let idDocumentoTemp = id ?? idDocumento?? documentoId;
   let codDocTemp = codDoc ?? docType;

   let data:any = {};

   if(codDocTemp===DOC_TYPE.NE){
     let dataSendEmail = paramToSendMail[codDocTemp](params);
     data = {
       ...rest,
       ...dataSendEmail,
       codDoc: codDocTemp,
       idDocumento: idDocumentoTemp
     }
   }else{
     data = {
       ...rest,
       codDoc: codDocTemp,
       idDocumento: idDocumentoTemp
     }
   }


   this.dialogSvc.open(EmailSendModalComponent, {
      //size: 'sm',
      data
    })
    }

}
