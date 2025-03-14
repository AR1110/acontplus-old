import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from '@core/components/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) {}

  showSpinner() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
      });

      const spinnerPortal = new ComponentPortal(SpinnerComponent);
      this.overlayRef.attach(spinnerPortal);
    }
  }

  hideSpinner() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
    }
  }
}
