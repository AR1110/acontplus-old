import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

type PropsModal = {
  size?: 'sm' | 'lg' | 'xl'
  backdropClass?: 'backdrop-custom-modal'
  fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string;
  centered?: boolean
  scrollable?: boolean,
  windowClass?: string
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModals: NgbModalRef[] = [];
  constructor(
    private ngbModal: NgbModal,
  ) { }

  openModalCustom(theComponent: any, { size, fullscreen, centered, scrollable, windowClass='' }: Partial<PropsModal> = {}) {

    const modalRef = this.ngbModal.open(theComponent, {
      backdrop: true,
      backdropClass: 'backdrop-custom-modal',
      windowClass,
      size,
      fullscreen,
      centered,
      scrollable
    });

    // this.openModals.push(modalRef);

    // modalRef.result.finally(() => {
    //   this.removeModal(modalRef);
    // });


    return modalRef;
  }

  private removeModal(modalRef: NgbModalRef): void {
    const index = this.openModals.indexOf(modalRef);
    if (index !== -1) {
      this.openModals.splice(index, 1);
    }
  }

  closeAllModals(): void {
    this.openModals.forEach((modalRef) => modalRef.close());
  }
}
