import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-convert-modal',
  standalone: true,
  imports: [
    AppModule, CommonModule
  ],
  templateUrl: './order-convert-modal.component.html',
  styles: ``
})
export class OrderConvertModalComponent {
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);
  @Input() data = {}

  ngOnInit() {
  }

  closeModal() {
    this.modalRef.close();
  }
}
