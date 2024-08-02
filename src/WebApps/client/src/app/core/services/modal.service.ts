import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MODAL_SIZE } from '@core/constants/global.constants';

type PropsModal = {
  backdrop?: boolean | 'static';
  centered?: boolean;
  fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string;
  keyboard?: boolean;
  scrollable?: boolean;
  size?: MODAL_SIZE.SM | MODAL_SIZE.LG | MODAL_SIZE.XL | string;
  windowClass?: string;
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
      });
  }

  open(
    theComponent: any,
    {
      backdrop,
      centered,
      fullscreen,
      keyboard,
      size,
      scrollable,
      windowClass = '',
    }: Partial<PropsModal> = {}
  ) {
    const modalRef = this.ngbModal.open(theComponent, {
      backdrop,
      centered,
      fullscreen,
      keyboard,
    //  keyboard: this.getKeyboard(backdrop, keyboard),
      scrollable,
      size,
      windowClass,
    });

    // this.openModals.push(modalRef);

    // modalRef.result.finally(() => {
    //   this.removeModal(modalRef);
    // });

    return modalRef;
  }

  /**
   * !Deprecated
   * @param theComponent
   * @param param1
   * @returns
   */
  openModalCustom(
    theComponent: any,
    {
      backdrop,
      centered,
      fullscreen,
      keyboard,
      size,
      scrollable,
      windowClass = '',
    }: Partial<PropsModal> = {}
  ) {
    const modalRef = this.ngbModal.open(theComponent, {
      backdrop: !backdrop ? 'static' : true,
      centered,
      fullscreen,
      keyboard: this.getKeyboard(backdrop, keyboard),
      scrollable,
      size,
      windowClass,
    });

    // this.openModals.push(modalRef);

    // modalRef.result.finally(() => {
    //   this.removeModal(modalRef);
    // });

    return modalRef;
  }

  getKeyboard = (backdrop: any, keyboard: any) => {
    if (backdrop && !keyboard) {
      return true;
    } else {
      return false;
    }
  };

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
