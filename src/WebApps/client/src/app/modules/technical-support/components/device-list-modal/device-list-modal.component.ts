import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-device-list-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-list-modal.component.html',
  styles: ``,
})
export class DeviceListModalComponent {
  private modalRef = inject(NgbActiveModal);
  closeModal() {
    this.modalRef.close();
  }
}
