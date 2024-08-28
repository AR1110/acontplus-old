import { DOC_TYPE } from '@/enums/main.enum';
import { EmailConfigService } from '@/services/email-config.service';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

type Props = {
  idDocumento: number
  codDoc: string
  docType:string //eliminar cuando en order doc tipo 3 se cambia
  
}

function createDataParamDocSri(data:Props) {
    return {
        id: data.idDocumento,
        codDoc: data.codDoc||data.docType,
        esNotificacionTributaria: true, 
    };
}
function createDataParamDoc(data:Props) {
      return {
          id: data.idDocumento,
          codDoc: data.codDoc||data.docType,
          esNotificacionGeneral: true, 
      };
  }

@Component({
  selector: 'app-whatsapp-send-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
  ],
  templateUrl: './whatsapp-send-modal.component.html',
  styleUrl: './whatsapp-send-modal.component.scss'
})
export class WhatsappSendModalComponent {
  readonly dialogRef = inject(MatDialogRef<WhatsappSendModalComponent>);
  readonly data = inject<Props>(MAT_DIALOG_DATA);
  private emailConfigSvc = inject(EmailConfigService)
  
  esNotificacionTributaria = false;
  esNotificacionGeneral = false;
  phoneNumbers=[]
  
  whatsapp ={
    number:'',
    message: ''
  }
 

  private dataParamGetDataForm:any = {
    [DOC_TYPE.FV]: createDataParamDocSri(this.data), 
    [DOC_TYPE.NE]: createDataParamDoc(this.data), 
  };

  getDataForm() {

        let params = this.dataParamGetDataForm[this.data.codDoc||this.data.docType];
        if (!params) {
            console.error(`No se encontraron parámetros para el tipo de documento: ${this.data.codDoc}`);
            return;
        }
        this.esNotificacionTributaria = params.esNotificacionTributaria;
        this.esNotificacionGeneral = params.esNotificacionGeneral;
         

        this.emailConfigSvc.getDataFormNotificacion(params).subscribe(response => {
         console.log(response)
            
          this.phoneNumbers = response.telefonos.filter((p:string)=>p.length===10) 
  
            if (this.phoneNumbers.length > 0) { 
                this.whatsapp.number = this.phoneNumbers[0]
            }

            if (this.esNotificacionTributaria) {
                this.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante electrónico:'
            } else {
                this.whatsapp.message = 'ACONTPLUS adjunta el siguiente comprobante:'
            }  
        })
  }
  ngOnInit(){
    this.getDataForm()
  }

  closeDialog(){
    this.dialogRef.close()
  }
    
}
