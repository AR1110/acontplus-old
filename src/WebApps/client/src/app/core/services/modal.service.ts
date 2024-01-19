import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type PropsModal = {
  size?: 'sm' | 'lg' | 'xl';
  backdropClass?: 'backdrop-custom-modal';
  fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string;
  centered?: boolean;
  scrollable?: boolean;
  windowClass?: string;
  backdrop?: boolean | 'static';
};

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openModals: NgbModalRef[] = [];
  modalNumbers = 0;
  constructor(private ngbModal: NgbModal) {
    this.ngbModal.activeInstances
      .pipe(takeUntilDestroyed())
      .subscribe((list) => {
        this.modalNumbers = list.length;
        console.log(this.modalNumbers);
      });
  }

  openModalCustom(
    theComponent: any,
    {
      size,
      fullscreen,
      centered,
      scrollable,
      windowClass = '',
      backdrop,
    }: Partial<PropsModal> = {}
  ) {
    const modalRef = this.ngbModal.open(theComponent, {
      backdrop: backdrop ? backdrop : true,
      backdropClass: 'backdrop-custom-modal',
      windowClass,
      size,
      fullscreen,
      centered,
      scrollable,
    });

    // this.openModals.push(modalRef);

    // modalRef.result.finally(() => {
    //   this.removeModal(modalRef);
    // });

    return modalRef;
  }

  getActiveInstances() {}

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
