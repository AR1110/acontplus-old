import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-measure-add-edit-modal',
  standalone: true,
  imports: [],
  templateUrl: './measure-add-edit-modal.component.html',
  styles: ``
})
export class MeasureAddEditModalComponent {
  modal = inject(NgbActiveModal)
}
