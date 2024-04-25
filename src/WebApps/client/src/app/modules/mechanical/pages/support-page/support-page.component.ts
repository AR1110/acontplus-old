import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './support-page.component.html',
  styleUrl: './support-page.component.css',
})
export class SupportPageComponent implements OnInit {
  modalSvc = inject(ModalService);

  openModal() {
    const modalRef = this.modalSvc.open(SupportAddEditModalComponent, {
      size: 'lg'
    })
    modalRef.result.then(result => {
      console.log(result)
    })
  }
  ngOnInit(): void { }

}
