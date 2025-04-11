import { DialogService } from '@domain/services/dialog.service';
import {Directive, HostListener, inject, Input, input} from '@angular/core';
import {WhatsappSendModalComponent} from "@ui/components/whatsapp-send-modal/whatsapp-send-modal.component";
//import {WhatsappChatComponent} from "@ui/components/whatsapp-chat/whatsapp-chat.component";

@Directive({
  selector: '[appActionWhatsappSend]',
})
export class ActionWhatsappSendDirective {

  private dialogSvc = inject(DialogService)
  public params = input({})
 @HostListener('click', ['$event']) onClick(){

   // this.dialogSvc.open(WhatsappChatComponent, {
   //    data: this.params() || {}
   //  })
   this.dialogSvc.open(WhatsappSendModalComponent, {
     data: this.params() || {}
   })
  }

}
