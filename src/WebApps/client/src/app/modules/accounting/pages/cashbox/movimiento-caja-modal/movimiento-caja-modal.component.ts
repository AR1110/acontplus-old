import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movimiento-caja-modal',
  standalone: true,
  imports: [],
  templateUrl: './movimiento-caja-modal.component.html',
  styleUrl: './movimiento-caja-modal.component.scss'
})
export class MovimientoCajaModalComponent {
  private activeModal = inject(NgbActiveModal);

  closeModal() {
    this.activeModal.close();
  }
}
