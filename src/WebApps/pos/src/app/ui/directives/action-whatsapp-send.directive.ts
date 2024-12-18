import { DialogService } from '@domain/services/dialog.service';
import {Directive, HostListener, inject, Input, input} from '@angular/core';
import {WhatsappSendModalComponent} from "@ui/components/whatsapp-send-modal/whatsapp-send-modal.component";

@Directive({
  selector: '[appActionWhatsappSend]',
  standalone: true
})
export class ActionWhatsappSendDirective {

  private dialogSvc = inject(DialogService)
 @Input()  params = {}
 @HostListener('click', ['$event']) onClick(){
   console.log(this.params)
   this.dialogSvc.open(WhatsappSendModalComponent, {
      //size: 'sm',
      data: this.params || {}
    })
    }

}
