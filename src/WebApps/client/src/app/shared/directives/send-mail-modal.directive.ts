import {Directive, EventEmitter, HostListener, inject, input, Input, Output} from '@angular/core';

import {ModalService} from "@core/services/modal.service";
import {SendMailModalComponent} from "@shared/components/send-mail-modal/send-mail-modal.component";
import {SendMailParams} from "@shared/models/send-mail.model";
import {ToasterService} from "@core/services/toaster.service";

@Directive({
  selector: '[appSendMailModal]',
  standalone: true
})
export class SendMailModalDirective {

  tS = inject(ToasterService)
  @Output() onResultModal = new EventEmitter();


  @Input() notificationAcontPlus = false;
  @Input() notificationSri = false;
  @Input() noModifyParam = true;
  @Input({required: true}) getDataSendMail!: (data: any) => any;
  data = input.required()


  @HostListener('click') onClick() {

    if(!(this.notificationAcontPlus || this.notificationSri)){
      this.tS.toastr({
        type: 'warning',
        message: 'No Definido el tipo de notificación'
      })
      return
    }
    const modalRef = this.modalSvc.open(SendMailModalComponent, {
      backdrop: 'static'
    });
    let params: SendMailParams = {
      notificationAcontPlus: this.notificationAcontPlus,
      notificationSri: this.notificationSri,
      data: this.getDataSendMail(this.data()),
      noModifyParam: this.noModifyParam
    }
    modalRef.componentInstance.params = params;

    modalRef.result.then((result: unknown) => {
      if (this.onResultModal && typeof result === 'object') {
        this.onResultModal.emit(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }

}
