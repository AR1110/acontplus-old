import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

type PropsModal = {
  size?: 'sm' | 'lg' | 'xl'
  backdropClass?: 'backdrop-custom-modal'
  fullscreen?: boolean
  centered?: boolean
  scrollable?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModals: NgbModalRef[] = [];
  constructor(
    private ngbModal: NgbModal,
  ) { }

  openModalCustom(theComponent: any, { size, fullscreen, centered, scrollable }: Partial<PropsModal> = {}) {
    console.log(size)
    const modalRef = this.ngbModal.open(theComponent, {
      backdropClass: 'backdrop-custom-modal',
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
