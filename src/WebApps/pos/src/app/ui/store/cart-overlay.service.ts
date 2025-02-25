import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartOverlayService {
  // Signal para manejar el estado del overlay (abierto o cerrado)
  private isOpen = signal<boolean>(false);

  // Getter para acceder al estado del overlay
  get overlayState() {
    return this.isOpen;
  }

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  toggleCart() {
    this.isOpen.update((state) => !state);
  }
}
