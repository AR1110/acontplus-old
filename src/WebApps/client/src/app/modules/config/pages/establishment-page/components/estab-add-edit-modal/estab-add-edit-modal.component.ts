import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estab-add-edit-modal',
  standalone: true,
  imports: [],
  templateUrl: './estab-add-edit-modal.component.html',
  styles: ``
})
export class EstabAddEditModalComponent {

  modal = inject(NgbActiveModal);

}
