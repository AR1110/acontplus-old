import { isValidEmail } from '@domain/utils/utils';
import { DOC_TYPE, DOC_TYPE_SRI, SEPARATOR_KEY_CODE } from '@domain/enums/main.enum';
import { isApiResponse } from '@domain/models/api-response';
import { EmailConfigService } from '@data/repositories/email-config/email-config.service';
import { NotificacionTributariaService } from "@data/repositories/notificacion-tributaria/notificacion-tributaria.service";
import { NotificacionService } from "@data/repositories/notificacion/notificacion.service";
import { ToasterService } from '@domain/services/toaster.service'
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA , MatDialogRef  } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomContainerDialogComponent } from '@ui/components/custom-container-dialog/custom-container-dialog.component';

type Props = {
  idDocumento: number,
  codDoc: string
  serieComprobante?:string
  subject: unknown
  codEstado?:string,
  idDocumentoElectronico?:number
  json?:unknown
  noModifyParam:boolean
}

function createDataParamDocSri({idDocumento, codDoc}: Props) {
    return {
        id: idDocumento,
        codDoc: codDoc,
        esNotificacionTributaria: true
    };
}
function createDataParamDoc({idDocumento, codDoc}:Props) {
    return {
        id: idDocumento,
        codDoc: codDoc,
        esNotificacionGeneral: true
    };
}

@Component({
    selector: 'app-email-send-modal',
    imports: [
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        CustomContainerDialogComponent
    ],
    templateUrl: './email-send-modal.component.html'
})

export class EmailSendModalComponent {

  readonly dialogRef = inject(MatDialogRef<EmailSendModalComponent>);
  readonly data = inject<Props>(MAT_DIALOG_DATA);
  readonly tS = inject(ToasterService)
  private emailConfigSvc = inject(EmailConfigService)
  private notificacionSvc = inject(NotificacionService)
  private notificacionTribSvc = inject(NotificacionTributariaService)

  public emails:string[] = [''];
  public  lastIndex = this.emails.length -1;

  private esNotificacionTributaria = false;
  private esNotificacionGeneral = false;



dataParamGetDataForm:any = {
    [DOC_TYPE_SRI.FV]: createDataParamDocSri(this.data),
    [DOC_TYPE.NE]: createDataParamDoc(this.data),
    [DOC_TYPE.OR]: createDataParamDoc(this.data)
};

successResponse = (response:object)=>{
  if(isApiResponse(response)){
    if(response.code==="0"){
      this.tS.toastr({
        type: 'warning',
        message: response.message
      })
    }
    if(response.code==="1"){
      this.tS.toastr({
        type: 'success',
        message: response.message
      })
      this.dialogRef.close(response)
    }
  }
}

  getDataForm(){
    let params = this.dataParamGetDataForm[this.data.codDoc];
      if (!params) {
          console.error(`No se encontraron parámetros para el tipo de documento: ${this.data.codDoc}`);
          return;
      }
      this.esNotificacionTributaria = params.esNotificacionTributaria;
      this.esNotificacionGeneral = params.esNotificacionGeneral;


      this.emailConfigSvc.getDataFormNotificacion(params).subscribe(response => {
        this.emails =  response.correos;
        if(this.emails.length===0){
          this.addEmail()
        }

      })

  }

  ngOnInit(){
    this.getDataForm()
  }



  addEmail(event?: MouseEvent) {
    this.emails.push('');
    this.setLastIndex()
    event?.stopPropagation();
  }

  removeEmail(event: MouseEvent, index:number){
    this.emails.splice(index,1)
    this.setLastIndex()
    event.stopPropagation();

  }

  setLastIndex(){
    this.lastIndex = this.emails.length -1;
  }

  send(){

      try {

        console.log(this.esNotificacionTributaria ,
        this.esNotificacionGeneral  )

        if (this.emails.length === 0) {
          this.tS.toastr({
            type:'warning',
            message: 'Ingrese al menos un correo del destinatorio'
          })
          return
        }

        if (!this.emails.every(item => isValidEmail(item))) {
          this.tS.toastr({
            type: 'warning',
            message:'Verifique que los correos del destinatario esten ingresado correctamente'
          })
          return
        }

        let {
          codDoc,
          serieComprobante,
          subject,
          codEstado,
          idDocumento,
          idDocumentoElectronico

        } = this.data;
        let receptor = this.emails.join(SEPARATOR_KEY_CODE.SLASH)
        if(this.esNotificacionGeneral){
          let  params = {
            codDoc,
            serieComprobante,
            subject,
            params: this.data.json,
            receptor
          }
          if(this.data.noModifyParam){
           // params = this.data
            //params.receptor = receptor;
          }
          this.notificacionSvc.post(params).subscribe(this.successResponse)
        }

        if(this.esNotificacionTributaria){
          let params = {
            codDoc,
            codEstado,
            idDocumento,
            idDocumentoElectronico,
            receptor
          }
          this.notificacionTribSvc.post(params).subscribe(this.successResponse)
        }
      }catch (error){
        console.log(error)
      }
  }


  closeDialog(){
    this.dialogRef.close()
  }

}
