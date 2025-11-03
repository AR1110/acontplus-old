import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from '@core/components/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlay = inject(Overlay);

  private overlayRef!: OverlayRef;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  showSpinner() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
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
