import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-maintenance-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './order-maintenance-modal.component.html',
  styles: ``,
})
export class OrderMaintenanceModalComponent implements OnInit {
  private modalRef = inject(NgbActiveModal);
  params: any = {};
  closeModal() {
    this.modalRef.close();
  }
  ngOnInit(): void {
    console.log(this.params);
  }
}
